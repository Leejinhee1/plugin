#!/usr/bin/env node
/**
 * hds — HDS 컴포넌트 설치 CLI.
 *
 * shadcn 같은 외부 도구 없이, HDS 컴포넌트를 소비 프로젝트에 바로 복사한다.
 * Node.js >= 18, 외부 의존성 없음.
 *
 * 사용법:
 *   npx hds list                            # 설치 가능한 컴포넌트 목록
 *   npx hds add <name...> [옵션]            # 컴포넌트 설치 (의존 컴포넌트·토큰 자동 포함)
 *
 * 옵션:
 *   --dir <path>         컴포넌트를 복사할 위치 (기본: components/hds)
 *   --tokens-dir <path>  토큰 CSS 위치 (기본: styles)
 *   --registry <url>     호스팅된 레지스트리(registry-export 산출물)에서 설치.
 *                        생략 시 이 패키지에 동봉된 소스에서 직접 설치(오프라인 동작).
 *   --force              기존 파일과 내용이 다를 때 덮어쓰기
 *
 * 소스 오브 트루스는 design-system/components — 이 CLI는 읽기만 한다.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { join, resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const COMPONENTS_DIR = join(REPO_ROOT, "design-system", "components");
const TOKENS_FILE_NAME = "hds-tokens.css";

// ---------------------------------------------------------------------------
// 인자 파싱
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    command: undefined,
    names: [],
    dir: "components/hds",
    tokensDir: "styles",
    registry: process.env.HDS_REGISTRY,
    force: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") args.help = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--dir") args.dir = argv[++i];
    else if (arg.startsWith("--dir=")) args.dir = arg.slice("--dir=".length);
    else if (arg === "--tokens-dir") args.tokensDir = argv[++i];
    else if (arg.startsWith("--tokens-dir=")) args.tokensDir = arg.slice("--tokens-dir=".length);
    else if (arg === "--registry") args.registry = argv[++i];
    else if (arg.startsWith("--registry=")) args.registry = arg.slice("--registry=".length);
    else if (!args.command) args.command = arg;
    else args.names.push(arg.replace(/^@hds\//, ""));
  }
  return args;
}

function printHelp() {
  console.log(`hds — HDS 컴포넌트 설치 CLI

사용법:
  npx hds list                     설치 가능한 컴포넌트 목록
  npx hds add <name...> [옵션]     컴포넌트 설치 (의존 컴포넌트·토큰 자동 포함)

옵션:
  --dir <path>         컴포넌트 위치 (기본: components/hds)
  --tokens-dir <path>  토큰 CSS 위치 (기본: styles)
  --registry <url>     호스팅 레지스트리에서 설치 (기본: 동봉 소스, env HDS_REGISTRY)
  --force              내용이 다른 기존 파일 덮어쓰기

예시:
  npx hds add button checkbox
  npx hds add modal                # 의존하는 button, 토큰까지 함께 설치
`);
}

function fail(msg) {
  console.error(`[hds] ${msg}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 소스 로딩 — 로컬(동봉 소스) 모드
// ---------------------------------------------------------------------------

function loadLocalRegistry() {
  const path = join(COMPONENTS_DIR, "registry.json");
  if (!existsSync(path)) fail(`동봉된 컴포넌트 레지스트리를 찾을 수 없습니다: ${path}`);
  return JSON.parse(readFileSync(path, "utf8")).components.filter(
    (c) => c.status !== "deprecated"
  );
}

function buildLocalTokensCss() {
  const buildTokens = join(
    REPO_ROOT, "skills", "publish", "token-export", "scripts", "build-tokens.mjs"
  );
  if (!existsSync(buildTokens)) fail(`토큰 빌드 스크립트를 찾을 수 없습니다: ${buildTokens}`);
  const tmp = mkdtempSync(join(tmpdir(), "hds-cli-"));
  try {
    const result = spawnSync(process.execPath, [buildTokens, "--out", tmp], { encoding: "utf8" });
    if (result.status !== 0) fail(`토큰 빌드 실패:\n${result.stderr || result.stdout}`);
    return readFileSync(join(tmp, "tokens.css"), "utf8");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

/** 로컬 모드: 이름 → { files: [{relTarget, content}], deps: [name] } */
function localItem(name, args, registry) {
  if (name === "tokens") {
    return {
      files: [{ relTarget: join(args.tokensDir, TOKENS_FILE_NAME), content: buildLocalTokensCss() }],
      deps: [],
    };
  }
  const comp = registry.find((c) => c.name === name);
  if (!comp) {
    fail(`알 수 없는 컴포넌트: "${name}"\n  사용 가능한 목록은 \`npx hds list\` 로 확인하세요.`);
  }
  const sourcePath = resolve(COMPONENTS_DIR, comp.source);
  return {
    files: [{ relTarget: join(args.dir, basename(sourcePath)), content: readFileSync(sourcePath, "utf8") }],
    deps: [...(comp.dependencies ?? []), "tokens"],
  };
}

// ---------------------------------------------------------------------------
// 소스 로딩 — 원격(호스팅 레지스트리) 모드
// ---------------------------------------------------------------------------

async function remoteItem(name, args) {
  const base = args.registry.replace(/\/$/, "");
  const url = `${base}/r/${name}.json`;
  const res = await fetch(url);
  if (!res.ok) fail(`레지스트리에서 "${name}" 을(를) 받지 못했습니다 (${res.status}): ${url}`);
  const item = await res.json();
  const files = item.files.map((f) => ({
    relTarget:
      f.type === "registry:file"
        ? join(args.tokensDir, basename(f.target ?? f.path))
        : join(args.dir, basename(f.path)),
    content: f.content,
  }));
  const deps = (item.registryDependencies ?? []).map((d) => d.replace(/^@hds\//, ""));
  return { files, deps };
}

// ---------------------------------------------------------------------------
// 명령
// ---------------------------------------------------------------------------

async function commandList(args) {
  if (args.registry) {
    const res = await fetch(`${args.registry.replace(/\/$/, "")}/registry.json`);
    if (!res.ok) fail(`레지스트리 인덱스를 받지 못했습니다 (${res.status})`);
    const index = await res.json();
    for (const item of index.items) {
      if (item.name === "tokens") continue;
      console.log(`  ${item.name.padEnd(10)} ${item.description ?? ""}`);
    }
    return;
  }
  const registry = loadLocalRegistry();
  for (const comp of registry) {
    const specPath = resolve(COMPONENTS_DIR, comp.spec);
    const desc = existsSync(specPath)
      ? readFileSync(specPath, "utf8").split("\n").find(
          (l, i, lines) => l.trim() && lines.slice(0, i).some((p) => p.startsWith("# "))
        )?.trim() ?? ""
      : "";
    console.log(`  ${comp.name.padEnd(10)} ${desc}`);
  }
  console.log(`\n설치: npx hds add <name...>`);
}

async function commandAdd(args) {
  if (args.names.length === 0) fail("설치할 컴포넌트 이름을 지정하세요. 예: npx hds add button");

  const registry = args.registry ? null : loadLocalRegistry();
  const getItem = (name) =>
    args.registry ? remoteItem(name, args) : Promise.resolve(localItem(name, args, registry));

  // 의존성 포함 설치 대상 결정 (BFS, 중복 제거)
  const queue = [...args.names];
  const resolved = new Map();
  while (queue.length) {
    const name = queue.shift();
    if (resolved.has(name)) continue;
    const item = await getItem(name);
    resolved.set(name, item);
    queue.push(...item.deps);
  }

  // 파일 쓰기
  const written = [], unchanged = [], skipped = [];
  for (const [name, item] of resolved) {
    for (const file of item.files) {
      const target = resolve(process.cwd(), file.relTarget);
      if (existsSync(target)) {
        const current = readFileSync(target, "utf8");
        if (current === file.content) { unchanged.push(file.relTarget); continue; }
        if (!args.force) { skipped.push(file.relTarget); continue; }
      }
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, file.content, "utf8");
      written.push(file.relTarget);
    }
  }

  const names = [...resolved.keys()].filter((n) => n !== "tokens");
  console.log(`[hds] ${names.join(", ")} 설치 완료`);
  for (const f of written) console.log(`  + ${f}`);
  for (const f of unchanged) console.log(`  = ${f} (변경 없음)`);
  for (const f of skipped) console.log(`  ! ${f} — 로컬 수정본과 다릅니다. 덮어쓰려면 --force`);
  if (written.some((f) => f.endsWith(TOKENS_FILE_NAME))) {
    console.log(
      `\n다음 단계: 전역 스타일에 토큰을 로드하세요.\n` +
        `  @import "./${join(args.tokensDir, TOKENS_FILE_NAME).replace(/\\/g, "/")}";\n` +
        `다크 테마는 <html data-theme="dark"> 로 전환됩니다.`
    );
  }
  if (skipped.length) process.exitCode = 1;
}

// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
if (args.help || !args.command) {
  printHelp();
  process.exit(args.help ? 0 : 1);
}
if (args.command === "list") await commandList(args);
else if (args.command === "add") await commandAdd(args);
else fail(`알 수 없는 명령: "${args.command}" — list 또는 add 를 사용하세요.`);
