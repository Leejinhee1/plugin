#!/usr/bin/env node
/**
 * 설계서 저장소를 로컬 캐시에 최신으로 맞춘다 — spec-lookup 스킬의 1단계.
 *
 * 문서 경로만 sparse-checkout 하고 매번 origin/<ref> 로 리셋한다. 캐시를 그대로
 * 믿지 않는 것이 요점 — 오래된 체크아웃으로 답하는 것이 이 스킬의 치명적 실패다.
 *
 *   node sync-spec-repo.mjs [--repo <owner>/<name>] [--ref <branch>] [--dir <specsDir>]
 *                           [--save | --save-global]
 *
 * 대상 해석 순서 (앞이 이김):
 *   1 --repo            2 HES_SPEC_REPO      3 ./.hes/spec-source.json
 *   4 ~/.hes/spec-source.json                5 캐시에 딱 하나 있으면 그것
 *
 * 4·5 가 있는 이유: 레포는 사람마다 한 번 정하면 안 바뀌는데, 3 만 있으면 **프로젝트를
 * 옮길 때마다** 다시 물어야 한다. 4 는 머신에 한 번(`--save-global`), 5 는 이미 이 머신에서
 * 쓰던 레포가 하나뿐일 때의 명백한 답이다 — 둘 이상이면 5 를 쓰지 않고 묻는다(추측 금지).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const flag = (name) => argv.includes(`--${name}`);

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

const CACHE_ROOT = path.join(homedir(), ".cache", "hes", "spec-repos");
const PROJECT_CFG = path.resolve(".hes/spec-source.json");
const HOME_CFG = path.join(homedir(), ".hes", "spec-source.json");

function readCfg(file) {
  if (!existsSync(file)) return {};
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    fail(`${file} 을 읽을 수 없다: ${e.message}`);
  }
}

/** 이 머신에서 이미 쓰던 설계서 레포가 **딱 하나**면 그것. 둘 이상이면 고르지 않는다. */
function soleCachedRepo() {
  if (!existsSync(CACHE_ROOT)) return undefined;
  const found = readdirSync(CACHE_ROOT)
    .filter((d) => existsSync(path.join(CACHE_ROOT, d, ".git")))
    .map((d) => d.replace("__", "/"));
  return found.length === 1 ? found[0] : undefined;
}

const projectCfg = readCfg(PROJECT_CFG);
const homeCfg = readCfg(HOME_CFG);

const resolved = [
  ["arg", arg("repo")],
  ["env", process.env.HES_SPEC_REPO],
  ["project", projectCfg.repo],
  ["home", homeCfg.repo],
  ["cache", soleCachedRepo()],
].find(([, v]) => v);

if (!resolved) {
  const others = existsSync(CACHE_ROOT)
    ? readdirSync(CACHE_ROOT).filter((d) => existsSync(path.join(CACHE_ROOT, d, ".git")))
    : [];
  fail(
    "설계서 저장소가 지정되지 않았다. `--repo <owner>/<name>` 로 한 번 주면 되고, " +
      "`--save-global` 을 함께 주면 ~/.hes/spec-source.json 에 저장돼 다음부터 어느 프로젝트에서든 자동으로 잡힌다." +
      (others.length > 1
        ? `\n  이 머신의 캐시에 후보가 여럿이라 고르지 않았다: ${others.map((d) => d.replace("__", "/")).join(" · ")}`
        : ""),
  );
}

const [source, repo] = resolved;
const ref = arg("ref") ?? process.env.HES_SPEC_REF ?? projectCfg.ref ?? homeCfg.ref ?? "main";
const specsDir = arg("dir") ?? projectCfg.specsDir ?? homeCfg.specsDir ?? "docs";

if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) fail(`레포 형식이 <owner>/<name> 이 아니다: ${repo}`);

const cache = path.join(CACHE_ROOT, repo.replace("/", "__"));
const git = (args, cwd) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

try {
  if (!existsSync(path.join(cache, ".git"))) {
    mkdirSync(path.dirname(cache), { recursive: true });
    git(["clone", "--filter=blob:none", "--no-checkout", "--depth", "1", "--branch", ref,
         `https://github.com/${repo}.git`, cache]);
    git(["sparse-checkout", "set", "--no-cone", specsDir], cache);
    git(["checkout", ref], cache);
  } else {
    git(["sparse-checkout", "set", "--no-cone", specsDir], cache);
    git(["fetch", "--depth", "1", "origin", ref], cache);
    git(["reset", "--hard", `origin/${ref}`], cache);
    git(["clean", "-fd"], cache);
  }
} catch (e) {
  // 실패한 클론이 .git 없는 껍데기를 남기면 다음 호출의 clone 이 "비어 있지 않은 디렉터리"로 또 죽는다.
  if (!existsSync(path.join(cache, ".git"))) rmSync(cache, { recursive: true, force: true });
  const stderr = (e.stderr ?? "").toString();
  if (/Permission denied|not found|Authentication failed|could not read Username/i.test(stderr)) {
    fail(
      `${repo} 를 읽을 권한이 없다. 비공개 저장소라면 지금 로그인된 계정에 접근 권한을 받아야 한다 ` +
        `— \`gh auth status\` 로 계정 확인. 우회하지 말 것.\n${stderr.trim()}`,
    );
  }
  fail(`git 동기화 실패:\n${stderr.trim() || e.message}`);
}

let saved;
if (flag("save") || flag("save-global")) {
  const target = flag("save-global") ? HOME_CFG : PROJECT_CFG;
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify({ repo, ref, specsDir }, null, 2) + "\n");
  saved = target;
}

const commit = git(["log", "-1", "--format=%h"], cache);
const when = git(["log", "-1", "--format=%cI"], cache);
console.log(JSON.stringify({ repo, ref, specsDir, source, cache, commit, committedAt: when, saved }, null, 2));
console.log(`\n✓ ${repo}@${ref} 최신 — ${commit} (${when})\n  캐시: ${cache}\n  설계서: ${path.join(cache, specsDir)}`);
if (source === "cache") {
  console.log(`  ⚠ 대상을 지정받지 못해 이 머신의 캐시에 있던 유일한 레포를 썼다 — 사용자에게 이 사실을 알리고, 맞으면 --save-global 을 권할 것.`);
}
if (saved) console.log(`  ✓ 설정 저장: ${saved}`);
