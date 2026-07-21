#!/usr/bin/env node
/**
 * build-registry.mjs
 *
 * HES 컴포넌트를 shadcn CLI 호환 레지스트리(JSON)로 내보낸다.
 * 산출물을 정적 호스팅하면 어느 프로젝트에서든
 * `npx shadcn@latest add @hes/button` 으로 컴포넌트를 즉시 설치할 수 있다.
 *
 * Node.js >= 18, 외부 의존성 없음. 출력은 결정적(정렬됨).
 *
 * 사용법:
 *   node build-registry.mjs [--components <컴포넌트디렉터리>] [--out <출력디렉터리>] [--homepage <url>]
 *
 * 기본값:
 *   --components  이 스크립트 기준 ../../../../design-system/components
 *   --out         현재 작업 디렉터리 기준 ./dist/registry
 *
 * 산출물:
 *   registry.json      — shadcn 레지스트리 인덱스 (item 메타데이터, content 없음)
 *   r/tokens.json      — HES 토큰 CSS(registry:file) — 모든 컴포넌트의 registryDependency
 *   r/<name>.json      — 컴포넌트별 registry-item (파일 content 포함)
 *
 * 소스(components/*)는 읽기 전용. 토큰 CSS 는 token-export 의 build-tokens.mjs 를
 * 임시 디렉터리로 실행해 얻는다(산출물 이중 관리 방지).
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
  mkdtempSync,
} from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REGISTRY_NAME = "hes";
const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json";
const INDEX_SCHEMA = "https://ui.shadcn.com/schema/registry.json";

// ---------------------------------------------------------------------------
// CLI 인자
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = { components: undefined, out: undefined, homepage: undefined, help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") args.help = true;
    else if (arg === "--components") args.components = argv[++i];
    else if (arg.startsWith("--components=")) args.components = arg.slice("--components=".length);
    else if (arg === "--out") args.out = argv[++i];
    else if (arg.startsWith("--out=")) args.out = arg.slice("--out=".length);
    else if (arg === "--homepage") args.homepage = argv[++i];
    else if (arg.startsWith("--homepage=")) args.homepage = arg.slice("--homepage=".length);
    else {
      console.error(`알 수 없는 인자: ${arg}\n--help 로 사용법을 확인하세요.`);
      process.exit(1);
    }
  }
  return args;
}

function printHelp() {
  console.log(`build-registry.mjs — HES 컴포넌트 -> shadcn 호환 레지스트리(JSON)

사용법:
  node build-registry.mjs [--components <dir>] [--out <dir>] [--homepage <url>]

옵션:
  --components <dir>  registry.json 과 컴포넌트 폴더가 있는 디렉터리
  --out <dir>         산출물을 쓸 디렉터리 (기본값: ./dist/registry)
  --homepage <url>    registry.json 의 homepage 필드 (기본값: plugin repository)
  -h, --help          도움말
`);
}

// ---------------------------------------------------------------------------
// 소스 로딩
// ---------------------------------------------------------------------------

/** spec.md 프런트매터의 name 과, 본문 첫 문단(제목 다음 비어있지 않은 줄)을 뽑는다. */
function parseSpec(specPath) {
  const raw = readFileSync(specPath, "utf8");
  const title = raw.match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const lines = raw.split("\n");
  const headingIdx = lines.findIndex((l) => l.startsWith("# "));
  let description = "";
  for (let i = headingIdx + 1; i >= 0 && i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      description = line;
      break;
    }
  }
  return { title: title ?? basename(specPath), description };
}

/** token-export 스크립트를 임시 디렉터리로 실행해 tokens.css 내용을 얻는다. */
function buildTokensCss() {
  const buildTokens = resolve(SCRIPT_DIR, "../../token-export/scripts/build-tokens.mjs");
  if (!existsSync(buildTokens)) {
    console.error(`[build-registry] token-export 스크립트를 찾을 수 없습니다: ${buildTokens}`);
    process.exit(1);
  }
  const tmp = mkdtempSync(join(tmpdir(), "hes-registry-"));
  try {
    const result = spawnSync(process.execPath, [buildTokens, "--out", tmp], {
      encoding: "utf8",
    });
    if (result.status !== 0) {
      console.error(`[build-registry] 토큰 빌드 실패:\n${result.stderr || result.stdout}`);
      process.exit(1);
    }
    return readFileSync(join(tmp, "tokens.css"), "utf8");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

// ---------------------------------------------------------------------------
// 레지스트리 아이템 구성
// ---------------------------------------------------------------------------

function tokensItem(tokensCss) {
  return {
    $schema: ITEM_SCHEMA,
    name: "tokens",
    type: "registry:item",
    title: "HES Design Tokens",
    description:
      "HES 시맨틱 토큰 CSS 변수(--hes-*). 모든 HES 컴포넌트의 전제 조건 — 전역 CSS 에서 import 하세요.",
    files: [
      {
        path: "registry/hes/tokens/hes-tokens.css",
        type: "registry:file",
        target: "~/styles/hes-tokens.css",
        content: tokensCss,
      },
    ],
    docs: "설치 후 전역 스타일(예: app/globals.css 또는 앱 엔트리)에 `@import \"../styles/hes-tokens.css\";` 를 추가하세요. 다크 테마는 <html data-theme=\"dark\">, 플랫폼 오버라이드는 data-platform 속성으로 전환됩니다.",
  };
}

function componentItem(comp, componentsDir) {
  const sourcePath = resolve(componentsDir, comp.source);
  const specPath = resolve(componentsDir, comp.spec);
  if (!existsSync(sourcePath)) {
    console.error(`[build-registry] 소스가 없습니다: ${sourcePath} (registry.json "${comp.name}")`);
    process.exit(1);
  }
  const content = readFileSync(sourcePath, "utf8");
  const { title, description } = existsSync(specPath)
    ? parseSpec(specPath)
    : { title: comp.name, description: "" };

  const dependencies = [];
  if (/from\s+"react-dom"/.test(content)) dependencies.push("react-dom");

  // 같은 레지스트리의 다른 컴포넌트 의존(예: modal → button)은 @hes 네임스페이스로 연결
  const registryDependencies = [
    "@hes/tokens",
    ...(comp.dependencies ?? []).map((d) => `@hes/${d}`),
  ];

  const fileName = basename(sourcePath);
  return {
    $schema: ITEM_SCHEMA,
    name: comp.name,
    type: "registry:component",
    title,
    description,
    ...(dependencies.length ? { dependencies } : {}),
    registryDependencies,
    files: [
      {
        path: `registry/hes/${comp.name}/${fileName}`,
        type: "registry:component",
        content,
      },
    ],
    ...(comp.figma ? { meta: { figma: comp.figma } } : {}),
  };
}

/** 인덱스(registry.json)에는 content 를 뺀 메타데이터만 싣는다. */
function stripContent(item) {
  const { $schema, ...rest } = item;
  return {
    ...rest,
    files: item.files.map(({ content, ...fileMeta }) => fileMeta),
  };
}

// ---------------------------------------------------------------------------
// 메인
// ---------------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const componentsDir = args.components
    ? resolve(process.cwd(), args.components)
    : resolve(SCRIPT_DIR, "../../../../design-system/components");
  const outDir = args.out ? resolve(process.cwd(), args.out) : resolve(process.cwd(), "dist/registry");

  const internalRegistryPath = join(componentsDir, "registry.json");
  if (!existsSync(internalRegistryPath)) {
    console.error(
      `[build-registry] 컴포넌트 레지스트리를 찾을 수 없습니다: ${internalRegistryPath}\n` +
        `  --components 로 design-system/components 디렉터리를 지정하세요.`
    );
    process.exit(1);
  }
  const internal = JSON.parse(readFileSync(internalRegistryPath, "utf8"));

  // spec.md 프런트매터의 figma 필드도 메타로 실어 추적성 유지
  const components = internal.components
    .filter((c) => c.status !== "deprecated")
    .map((c) => {
      const specPath = resolve(componentsDir, c.spec);
      const figma = existsSync(specPath)
        ? readFileSync(specPath, "utf8").match(/^figma:\s*"?([^"\n]+)"?$/m)?.[1]
        : undefined;
      return { ...c, figma };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const items = [
    tokensItem(buildTokensCss()),
    ...components.map((c) => componentItem(c, componentsDir)),
  ];

  const index = {
    $schema: INDEX_SCHEMA,
    name: REGISTRY_NAME,
    homepage: args.homepage ?? "https://github.com/leejinhee1/plugin",
    items: items.map(stripContent),
  };

  mkdirSync(join(outDir, "r"), { recursive: true });
  writeFileSync(join(outDir, "registry.json"), JSON.stringify(index, null, 2) + "\n", "utf8");
  for (const item of items) {
    writeFileSync(join(outDir, "r", `${item.name}.json`), JSON.stringify(item, null, 2) + "\n", "utf8");
  }

  console.log(
    `[build-registry] OK — 아이템 ${items.length}개(tokens + 컴포넌트 ${components.length}) -> ${outDir}\n` +
      `  사용: 대상 프로젝트 components.json 에\n` +
      `    "registries": { "@hes": "<호스팅URL>/r/{name}.json" }\n` +
      `  등록 후 npx shadcn@latest add @hes/<컴포넌트>`
  );
}

main();
