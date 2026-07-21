#!/usr/bin/env node
/**
 * build-tokens.mjs
 *
 * DTCG 토큰(core + semantic + component + platform .tokens.json) → 개발 산출물 변환.
 * component/platform 파일은 없으면 건너뛴다(하위호환). Node.js >= 18, 외부 의존성 없음.
 * 출력은 결정적(정렬됨).
 *
 * 사용법:
 *   node build-tokens.mjs [--tokens <토큰디렉터리>] [--out <출력디렉터리>]
 *
 * 기본값(인자 생략 시):
 *   --tokens  이 스크립트 기준 ../../../../design-system/tokens (저장소 레이아웃 가정)
 *   --out     현재 작업 디렉터리 기준 ./dist/tokens
 *
 * 산출물:
 *   tokens.css          — :root { --hes-*: ...; } + [data-theme="dark"] + [data-platform="ios|pc|min"] 오버라이드
 *   tailwind.preset.js  — theme.extend 가 var(--hes-*) 를 참조 (semantic + core-direct 만 — comp/platform 토큰은
 *                         컴포넌트 CSS 에서 var() 직접 참조가 원칙이고, breakpoint 는 미디어쿼리에 var() 불가)
 *   tokens.ts           — 토큰 이름 -> CSS 변수명 상수 맵 (as const) + 타입
 *
 * 원본 tokens/*.json 은 읽기 전용으로만 다룬다. 이 스크립트는 그 어떤 원본 파일도 쓰지 않는다.
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// CLI 인자 파싱
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { tokens: undefined, out: undefined, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      args.help = true;
    } else if (arg === "--tokens") {
      args.tokens = argv[++i];
    } else if (arg.startsWith("--tokens=")) {
      args.tokens = arg.slice("--tokens=".length);
    } else if (arg === "--out") {
      args.out = argv[++i];
    } else if (arg.startsWith("--out=")) {
      args.out = arg.slice("--out=".length);
    } else {
      console.error(`알 수 없는 인자: ${arg}\n--help 로 사용법을 확인하세요.`);
      process.exit(1);
    }
  }
  return args;
}

function printHelp() {
  console.log(`build-tokens.mjs — DTCG 토큰(core+semantic) -> tokens.css / tailwind.preset.js / tokens.ts

사용법:
  node build-tokens.mjs [--tokens <토큰디렉터리>] [--out <출력디렉터리>]

옵션:
  --tokens <dir>   core.tokens.json, semantic.tokens.json 이 있는 디렉터리
                   (기본값: ${relative(process.cwd(), resolve(SCRIPT_DIR, "../../../../design-system/tokens"))})
  --out <dir>      산출물을 쓸 디렉터리 (기본값: ./dist/tokens, 없으면 생성)
  -h, --help       도움말 출력
`);
}

// ---------------------------------------------------------------------------
// 토큰 로딩
// ---------------------------------------------------------------------------

function loadJsonFile(path, label) {
  if (!existsSync(path)) {
    console.error(
      `[build-tokens] ${label} 파일을 찾을 수 없습니다: ${path}\n` +
        `  --tokens 로 core.tokens.json / semantic.tokens.json 이 있는 디렉터리를 지정하세요.`
    );
    process.exit(1);
  }
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (err) {
    console.error(`[build-tokens] ${label} 을(를) 읽을 수 없습니다: ${path}\n  ${err.message}`);
    process.exit(1);
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[build-tokens] ${label} 이(가) 올바른 JSON이 아닙니다: ${path}\n  ${err.message}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// DTCG 트리 평탄화
//
// 두 가지 형태를 모두 처리한다:
//   1) 표준형: { "green": { "$value": "#009178", "$description": "..." } }
//   2) semantic.tokens.json 의 $dark 축약형: { "base": "{color.neutral.900}" }
//      (앞뒤에 $value 래핑 없이 값이 바로 온다 — alias 문자열이든 raw 값이든)
// ---------------------------------------------------------------------------

function flatten(node, prefix, out) {
  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    out[prefix] = node;
    return;
  }
  if (Array.isArray(node)) {
    out[prefix] = node;
    return;
  }
  if (node && typeof node === "object") {
    if (Object.prototype.hasOwnProperty.call(node, "$value")) {
      out[prefix] = node.$value;
      return;
    }
    for (const key of Object.keys(node)) {
      if (key.startsWith("$")) continue; // $type, $description, $schema, $dark(최상위에서 별도 처리) 등
      const childPrefix = prefix ? `${prefix}.${key}` : key;
      flatten(node[key], childPrefix, out);
    }
    return;
  }
  // null/undefined 등은 무시
}

function flattenRoot(json) {
  const out = {};
  flatten(json, "", out);
  // flatten(prefix="") 이 최상위에서 만드는 빈 접두어 케이스 방지: 위 구현은 항상 key를 붙이므로
  // out 에 "" 키가 생기지 않는다. 방어적으로 제거.
  delete out[""];
  return out;
}

// ---------------------------------------------------------------------------
// Alias 재귀 resolve (순환 감지)
// ---------------------------------------------------------------------------

const ALIAS_RE = /^\{(.+)\}$/;

function resolveValue(value, map, chain) {
  if (typeof value === "string") {
    const m = value.match(ALIAS_RE);
    if (m) {
      const refPath = m[1].trim();
      if (chain.includes(refPath)) {
        throw new Error(`순환 alias 참조 감지: ${[...chain, refPath].join(" -> ")}`);
      }
      if (!(refPath in map)) {
        throw new Error(
          `해석할 수 없는 alias 참조: {${refPath}} (참조 경로: ${chain[chain.length - 1] ?? "root"})`
        );
      }
      return resolveValue(map[refPath], map, [...chain, refPath]);
    }
    return value; // 리터럴 문자열(색상 hex/rgba, "1.5" 같은 lineHeight 등)
  }
  if (Array.isArray(value)) {
    return value.map((v) => resolveValue(v, map, chain));
  }
  if (value && typeof value === "object") {
    // typography 같은 composite 값: 각 필드를 개별 resolve
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = resolveValue(value[key], map, chain);
    }
    return out;
  }
  return value; // number, boolean 등 리터럴
}

// ---------------------------------------------------------------------------
// 이름 변환 유틸
// ---------------------------------------------------------------------------

// "onBrand" -> "on-brand", "inset-md" -> "inset-md"(변화 없음), "2xl" -> "2xl"
function segmentToKebab(segment) {
  return segment
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

// "fg.onBrand" -> "fg-on-brand"
function dottedToKebab(dottedRest) {
  return dottedRest
    .split(".")
    .map(segmentToKebab)
    .join("-");
}

function sortedEntries(obj) {
  return Object.keys(obj)
    .sort()
    .map((k) => [k, obj[k]]);
}

function formatFontFamilyValue(resolvedArray) {
  if (!Array.isArray(resolvedArray)) {
    throw new Error(`fontFamily 값이 배열이 아닙니다: ${JSON.stringify(resolvedArray)}`);
  }
  return resolvedArray.map((f) => `"${f}"`).join(", ");
}

function formatCubicBezierValue(resolvedArray) {
  if (!Array.isArray(resolvedArray) || resolvedArray.length !== 4) {
    throw new Error(`cubicBezier 값이 4개 성분 배열이 아닙니다: ${JSON.stringify(resolvedArray)}`);
  }
  return `cubic-bezier(${resolvedArray.join(", ")})`;
}

function formatScalarValue(v, contextKey) {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return String(v); // platform isNotch 같은 참조 데이터
  throw new Error(`예상치 못한 값 형태 (${contextKey}): ${JSON.stringify(v)}`);
}

// ---------------------------------------------------------------------------
// 메인 빌드 로직
// ---------------------------------------------------------------------------

function build(tokensDir, outDir) {
  const corePath = join(tokensDir, "core.tokens.json");
  const semanticPath = join(tokensDir, "semantic.tokens.json");
  const componentPath = join(tokensDir, "component.tokens.json");
  const platformPath = join(tokensDir, "platform.tokens.json");

  const coreJson = loadJsonFile(corePath, "core.tokens.json");
  const semanticJson = loadJsonFile(semanticPath, "semantic.tokens.json");
  // component/platform 은 선택 파일 — 없으면 해당 산출 섹션만 비운다.
  const componentJson = existsSync(componentPath) ? loadJsonFile(componentPath, "component.tokens.json") : null;
  const platformJson = existsSync(platformPath) ? loadJsonFile(platformPath, "platform.tokens.json") : null;

  const mapCore = flattenRoot(coreJson);
  const mapSemanticLight = flattenRoot(semanticJson); // $dark 는 flatten 단계에서 자동 제외됨($ 로 시작하는 키 skip)
  const mapComponent = componentJson ? flattenRoot(componentJson) : {};

  const darkRoot = semanticJson.$dark && typeof semanticJson.$dark === "object" ? semanticJson.$dark : {};
  const mapDark = {};
  flatten(darkRoot, "", mapDark);
  delete mapDark[""];

  // resolve 용 그래프: core + semantic(light) + component 통합. dark 오버라이드 resolve 시에는 dark 값 우선.
  const resolveMapLight = { ...mapCore, ...mapSemanticLight, ...mapComponent };
  const resolveMapDark = { ...mapCore, ...mapSemanticLight, ...mapComponent, ...mapDark };

  const resolvedLight = {};
  for (const [key, val] of Object.entries(mapSemanticLight)) {
    resolvedLight[key] = resolveValue(val, resolveMapLight, [key]);
  }

  const resolvedDark = {};
  for (const [key, val] of Object.entries(mapDark)) {
    resolvedDark[key] = resolveValue(val, resolveMapDark, [key]);
  }

  const resolvedComponent = {};
  for (const [key, val] of Object.entries(mapComponent)) {
    resolvedComponent[key] = resolveValue(val, resolveMapLight, [key]);
  }

  // platform: 각 토큰의 $value 가 {AOS, iOS, PC, Min} 모드 맵. 모드별로 평탄화 후 개별 resolve —
  // 모드 내 alias({breakpoint.*} 등)는 같은 모드의 값으로 해석된다.
  const platformModes = platformJson?.$modes ?? [];
  const platformDefaultMode = platformJson?.$defaultMode ?? platformModes[0];
  const mapPlatform = platformJson ? flattenRoot(platformJson) : {};
  const resolvedPlatformByMode = {};
  for (const mode of platformModes) {
    const modeFlat = {};
    for (const [key, modeMap] of Object.entries(mapPlatform)) {
      if (!modeMap || typeof modeMap !== "object" || Array.isArray(modeMap)) {
        throw new Error(`platform 토큰 ${key} 의 $value 가 모드 맵({AOS,...})이 아닙니다.`);
      }
      if (!(mode in modeMap)) {
        throw new Error(`platform 토큰 ${key} 에 ${mode} 모드 값이 없습니다.`);
      }
      modeFlat[key] = modeMap[mode];
    }
    const resolveMap = { ...mapCore, ...mapSemanticLight, ...mapComponent, ...modeFlat };
    const resolved = {};
    for (const [key, val] of Object.entries(modeFlat)) {
      resolved[key] = resolveValue(val, resolveMap, [key]);
    }
    resolvedPlatformByMode[mode] = resolved;
  }

  const CORE_DIRECT_PREFIXES = ["dimension.radius.", "duration.", "cubicBezier.", "fontFamily."];
  const resolvedCoreDirect = {};
  for (const [key, val] of Object.entries(mapCore)) {
    if (CORE_DIRECT_PREFIXES.some((p) => key.startsWith(p))) {
      resolvedCoreDirect[key] = resolveValue(val, mapCore, [key]);
    }
  }

  // --- CSS 변수 목록 구성 (name -> value), 토큰 이름(tokens.ts 용)도 함께 수집 ---
  /** @type {Array<{cssVar: string, value: string, tokenName: string}>} */
  const rootVars = [];
  /** @type {Array<{cssVar: string, value: string}>} */
  const darkVars = [];

  // 1) semantic color.*
  for (const [key, resolved] of sortedEntries(resolvedLight)) {
    if (!key.startsWith("color.")) continue;
    const rest = key.slice("color.".length);
    const cssVar = `--hes-${dottedToKebab(rest)}`;
    rootVars.push({ cssVar, value: formatScalarValue(resolved, key), tokenName: rest });
  }

  // 2) semantic space.*
  for (const [key, resolved] of sortedEntries(resolvedLight)) {
    if (!key.startsWith("space.")) continue;
    const rest = key.slice("space.".length); // 이미 kebab (e.g. inset-md)
    const cssVar = `--hes-space-${dottedToKebab(rest)}`;
    rootVars.push({ cssVar, value: formatScalarValue(resolved, key), tokenName: `space.${rest}` });
  }

  // 3) semantic typography.* (composite -> family/size/weight/line-height)
  const TYPO_FIELD_SUFFIX = {
    fontFamily: "family",
    fontSize: "size",
    fontWeight: "weight",
    lineHeight: "line-height",
    letterSpacing: "letter-spacing",
  };
  for (const [key, resolved] of sortedEntries(resolvedLight)) {
    if (!key.startsWith("typography.")) continue;
    const role = key.slice("typography.".length);
    if (!resolved || typeof resolved !== "object") {
      throw new Error(`typography.${role} 값이 composite 객체가 아닙니다.`);
    }
    for (const field of Object.keys(TYPO_FIELD_SUFFIX).sort()) {
      if (!(field in resolved)) continue;
      const suffix = TYPO_FIELD_SUFFIX[field];
      const cssVar = `--hes-typo-${role}-${suffix}`;
      let value;
      if (field === "fontFamily") {
        value = formatFontFamilyValue(resolved[field]);
      } else {
        value = formatScalarValue(resolved[field], `typography.${role}.${field}`);
      }
      rootVars.push({ cssVar, value, tokenName: `typography.${role}.${suffix}` });
    }
  }

  // 4) core 직접 export
  for (const [key, resolved] of sortedEntries(resolvedCoreDirect)) {
    if (key.startsWith("dimension.radius.")) {
      const rest = key.slice("dimension.radius.".length);
      const cssVar = `--hes-radius-${dottedToKebab(rest)}`;
      rootVars.push({ cssVar, value: formatScalarValue(resolved, key), tokenName: `radius.${rest}` });
    } else if (key.startsWith("duration.")) {
      const rest = key.slice("duration.".length);
      const cssVar = `--hes-duration-${dottedToKebab(rest)}`;
      rootVars.push({ cssVar, value: formatScalarValue(resolved, key), tokenName: `duration.${rest}` });
    } else if (key.startsWith("cubicBezier.")) {
      const rest = key.slice("cubicBezier.".length);
      const cssVar = `--hes-ease-${dottedToKebab(rest)}`;
      rootVars.push({ cssVar, value: formatCubicBezierValue(resolved), tokenName: `ease.${rest}` });
    } else if (key.startsWith("fontFamily.")) {
      const rest = key.slice("fontFamily.".length);
      const cssVar = `--hes-font-${dottedToKebab(rest)}`;
      rootVars.push({ cssVar, value: formatFontFamilyValue(resolved), tokenName: `font.${rest}` });
    }
  }

  // 5) component.tokens.json — 전 토큰을 --hes-<경로 kebab> 으로 export (comp.* / layout.* / sizing.* / font.* / letterSpacing.*)
  for (const [key, resolved] of sortedEntries(resolvedComponent)) {
    const cssVar = `--hes-${dottedToKebab(key)}`;
    rootVars.push({ cssVar, value: formatScalarValue(resolved, key), tokenName: key });
  }

  // 6) platform.tokens.json — 기본 모드는 :root, 나머지 모드는 [data-platform] 오버라이드(차이값만)
  /** @type {Array<{mode: string, vars: Array<{cssVar: string, value: string}>}>} */
  const platformOverrideBlocks = [];
  if (platformJson) {
    const defaults = resolvedPlatformByMode[platformDefaultMode];
    for (const [key, resolved] of sortedEntries(defaults)) {
      const cssVar = `--hes-platform-${dottedToKebab(key)}`;
      rootVars.push({ cssVar, value: formatScalarValue(resolved, `platform.${key}`), tokenName: `platform.${key}` });
    }
    for (const mode of platformModes) {
      if (mode === platformDefaultMode) continue;
      const vars = [];
      for (const [key, resolved] of sortedEntries(resolvedPlatformByMode[mode])) {
        const value = formatScalarValue(resolved, `platform.${key}(${mode})`);
        if (value === formatScalarValue(defaults[key], `platform.${key}`)) continue;
        vars.push({ cssVar: `--hes-platform-${dottedToKebab(key)}`, value });
      }
      platformOverrideBlocks.push({ mode, vars });
    }
  }

  // 7) dark 오버라이드 (color.* 만 존재 — semantic.tokens.json 의 $dark 구조상)
  for (const [key, resolved] of sortedEntries(resolvedDark)) {
    if (!key.startsWith("color.")) continue;
    const rest = key.slice("color.".length);
    const cssVar = `--hes-${dottedToKebab(rest)}`;
    darkVars.push({ cssVar, value: formatScalarValue(resolved, `$dark.${key}`) });
  }

  // 중복 CSS 변수명 검사 (매핑 규칙 충돌 조기 발견용)
  const seen = new Map();
  for (const { cssVar, tokenName } of rootVars) {
    if (seen.has(cssVar) && seen.get(cssVar) !== tokenName) {
      throw new Error(
        `CSS 변수명 충돌: ${cssVar} (토큰 "${seen.get(cssVar)}" 와 "${tokenName}" 이 동일한 변수명으로 매핑됨)`
      );
    }
    seen.set(cssVar, tokenName);
  }

  rootVars.sort((a, b) => a.cssVar.localeCompare(b.cssVar));
  darkVars.sort((a, b) => a.cssVar.localeCompare(b.cssVar));

  // --- tokens.css ---
  const cssLines = [];
  cssLines.push("/* generated by build-tokens.mjs — do not edit */");
  cssLines.push("/* source: DTCG tokens (core + semantic + component + platform .tokens.json) */");
  cssLines.push(":root {");
  for (const { cssVar, value } of rootVars) {
    cssLines.push(`  ${cssVar}: ${value};`);
  }
  cssLines.push("}");
  cssLines.push("");
  cssLines.push('[data-theme="dark"] {');
  for (const { cssVar, value } of darkVars) {
    cssLines.push(`  ${cssVar}: ${value};`);
  }
  cssLines.push("}");
  for (const { mode, vars } of platformOverrideBlocks) {
    cssLines.push("");
    cssLines.push(`[data-platform="${mode.toLowerCase()}"] {`);
    for (const { cssVar, value } of vars) {
      cssLines.push(`  ${cssVar}: ${value};`);
    }
    cssLines.push("}");
  }
  cssLines.push("");
  const tokensCss = cssLines.join("\n");

  // --- tailwind.preset.js ---
  const colors = {};
  for (const [key] of sortedEntries(resolvedLight)) {
    if (!key.startsWith("color.")) continue;
    const rest = key.slice("color.".length);
    const segs = rest.split(".").map(segmentToKebab);
    const cssVar = `--hes-${segs.join("-")}`;
    let node = colors;
    for (let i = 0; i < segs.length - 1; i++) {
      node[segs[i]] = node[segs[i]] || {};
      node = node[segs[i]];
    }
    node[segs[segs.length - 1]] = `var(${cssVar})`;
  }

  const spacing = {};
  for (const [key] of sortedEntries(resolvedLight)) {
    if (!key.startsWith("space.")) continue;
    const rest = key.slice("space.".length);
    const cssVar = `--hes-space-${dottedToKebab(rest)}`;
    spacing[rest] = `var(${cssVar})`;
  }

  const borderRadius = {};
  const transitionDuration = {};
  const transitionTimingFunction = {};
  const fontFamily = {};
  for (const [key, resolved] of sortedEntries(resolvedCoreDirect)) {
    if (key.startsWith("dimension.radius.")) {
      const rest = key.slice("dimension.radius.".length);
      borderRadius[rest] = `var(--hes-radius-${dottedToKebab(rest)})`;
    } else if (key.startsWith("duration.")) {
      const rest = key.slice("duration.".length);
      transitionDuration[rest] = `var(--hes-duration-${dottedToKebab(rest)})`;
    } else if (key.startsWith("cubicBezier.")) {
      const rest = key.slice("cubicBezier.".length);
      transitionTimingFunction[rest] = `var(--hes-ease-${dottedToKebab(rest)})`;
    } else if (key.startsWith("fontFamily.")) {
      const rest = key.slice("fontFamily.".length);
      fontFamily[rest] = [`var(--hes-font-${dottedToKebab(rest)})`];
    }
  }

  const tailwindPresetObj = {
    theme: {
      extend: {
        colors,
        spacing,
        borderRadius,
        fontFamily,
        transitionDuration,
        transitionTimingFunction,
      },
    },
  };

  const tailwindPreset =
    "// generated by build-tokens.mjs — do not edit\n" +
    "// HES 토큰을 참조하는 Tailwind preset. 값은 항상 var(--hes-*) 이므로 [data-theme] 전환에 자동 반응한다.\n" +
    "/** @type {import('tailwindcss').Config} */\n" +
    "module.exports = " +
    JSON.stringify(tailwindPresetObj, null, 2) +
    ";\n";

  // --- tokens.ts ---
  const tokenEntries = rootVars
    .map(({ cssVar, tokenName }) => [tokenName, cssVar])
    .sort((a, b) => a[0].localeCompare(b[0]));

  const dedupedTokenEntries = [];
  const seenTokenNames = new Set();
  for (const [name, cssVar] of tokenEntries) {
    if (seenTokenNames.has(name)) continue; // 방어적: 이론상 발생하지 않음
    seenTokenNames.add(name);
    dedupedTokenEntries.push([name, cssVar]);
  }

  const tsLines = [];
  tsLines.push("// generated by build-tokens.mjs — do not edit");
  tsLines.push("// 토큰 이름 -> CSS 변수명 상수 맵. 값은 항상 --hes-* 커스텀 프로퍼티 이름이다.");
  tsLines.push("");
  tsLines.push("export const hesTokens = {");
  for (const [name, cssVar] of dedupedTokenEntries) {
    tsLines.push(`  ${JSON.stringify(name)}: ${JSON.stringify(cssVar)},`);
  }
  tsLines.push("} as const;");
  tsLines.push("");
  tsLines.push("export type HesTokenName = keyof typeof hesTokens;");
  tsLines.push("export type HesCssVarName = (typeof hesTokens)[HesTokenName];");
  tsLines.push("");
  tsLines.push("/** 토큰 이름으로 `var(--hes-*)` 문자열을 얻는다. */");
  tsLines.push("export function hesVar(name: HesTokenName): string {");
  tsLines.push("  return `var(${hesTokens[name]})`;");
  tsLines.push("}");
  tsLines.push("");
  const tokensTs = tsLines.join("\n");

  const platformOverrideCount = platformOverrideBlocks.reduce((n, b) => n + b.vars.length, 0);
  return {
    tokensCss,
    tailwindPreset,
    tokensTs,
    stats: { rootVars: rootVars.length, darkVars: darkVars.length, platformOverrides: platformOverrideCount },
  };
}

// ---------------------------------------------------------------------------
// 엔트리 포인트
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const tokensDir = args.tokens
    ? resolve(process.cwd(), args.tokens)
    : resolve(SCRIPT_DIR, "../../../../design-system/tokens");
  const outDir = args.out ? resolve(process.cwd(), args.out) : resolve(process.cwd(), "dist/tokens");

  if (!existsSync(tokensDir)) {
    console.error(
      `[build-tokens] 토큰 디렉터리를 찾을 수 없습니다: ${tokensDir}\n` +
        `  저장소 레이아웃 밖에서 실행 중이라면 --tokens <경로> 로 core.tokens.json / semantic.tokens.json 이 있는 디렉터리를 지정하세요.\n` +
        `  예) node build-tokens.mjs --tokens design-system/tokens --out /tmp/out`
    );
    process.exit(1);
  }

  let result;
  try {
    result = build(tokensDir, outDir);
  } catch (err) {
    console.error(`[build-tokens] 빌드 실패: ${err.message}`);
    process.exit(1);
  }

  try {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "tokens.css"), result.tokensCss, "utf8");
    writeFileSync(join(outDir, "tailwind.preset.js"), result.tailwindPreset, "utf8");
    writeFileSync(join(outDir, "tokens.ts"), result.tokensTs, "utf8");
  } catch (err) {
    console.error(`[build-tokens] 출력 파일을 쓸 수 없습니다: ${outDir}\n  ${err.message}`);
    process.exit(1);
  }

  console.log(
    `[build-tokens] OK — ${result.stats.rootVars}개 변수(:root) + ${result.stats.darkVars}개 다크 + ${result.stats.platformOverrides}개 플랫폼 오버라이드 -> ${outDir}\n` +
      `  tokens: ${tokensDir}\n` +
      `  out:    ${outDir}/{tokens.css, tailwind.preset.js, tokens.ts}`
  );
}

main();
