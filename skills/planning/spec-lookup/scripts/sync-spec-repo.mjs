#!/usr/bin/env node
/**
 * 설계서 저장소를 로컬 캐시에 최신으로 맞춘다 — spec-lookup 스킬의 1단계.
 *
 * 문서 경로만 sparse-checkout 하고 매번 origin/<ref> 로 리셋한다. 캐시를 그대로
 * 믿지 않는 것이 요점 — 오래된 체크아웃으로 답하는 것이 이 스킬의 치명적 실패다.
 *
 *   node sync-spec-repo.mjs [--repo <owner>/<name>] [--ref <branch>] [--dir <specsDir>]
 *
 * 대상 해석 순서: 인자 → HES_SPEC_REPO → ./.hes/spec-source.json
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};

const fromFile = (() => {
  const f = path.resolve(".hes/spec-source.json");
  if (!existsSync(f)) return {};
  try {
    return JSON.parse(readFileSync(f, "utf8"));
  } catch (e) {
    fail(`.hes/spec-source.json 을 읽을 수 없다: ${e.message}`);
  }
})();

const repo = arg("repo") ?? process.env.HES_SPEC_REPO ?? fromFile.repo;
const ref = arg("ref") ?? process.env.HES_SPEC_REF ?? fromFile.ref ?? "main";
const specsDir = arg("dir") ?? fromFile.specsDir ?? "docs";

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

if (!repo) {
  fail(
    "대상 저장소를 모른다. --repo <owner>/<name>, 환경변수 HES_SPEC_REPO, " +
      "또는 .hes/spec-source.json 중 하나로 지정할 것. 임의로 추측하지 않는다.",
  );
}
if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) fail(`레포 형식이 <owner>/<name> 이 아니다: ${repo}`);

const cache = path.join(homedir(), ".cache", "hes", "spec-repos", repo.replace("/", "__"));
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

const commit = git(["log", "-1", "--format=%h"], cache);
const when = git(["log", "-1", "--format=%cI"], cache);
console.log(
  JSON.stringify({ repo, ref, specsDir, cache, commit, committedAt: when }, null, 2),
);
console.log(`\n✓ ${repo}@${ref} 최신 — ${commit} (${when})\n  캐시: ${cache}\n  설계서: ${path.join(cache, specsDir)}`);
