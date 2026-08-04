#!/usr/bin/env node
/**
 * HES 스킬 정합성 체크 — `claude plugin validate` 가 보지 않는 것들을 검사한다.
 *
 * validate 는 "매니페스트가 가리키는 폴더가 존재하는가"까지만 본다.
 * 그 폴더 안의 SKILL.md 가 유효한지는 검사하지 않으므로,
 * 이름 규칙 위반(예: test_script) 같은 문제는 아무 신호 없이 스킬만 사라진다.
 * 이 스크립트가 그 구멍을 메운다.
 *
 * 사용: node scripts/check-skills.mjs   (의존성 없음)
 * 종료코드: 에러 있으면 1, 없으면 0 (경고만 있으면 0)
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

/** frontmatter 의 최상위 스칼라 키만 뽑는다(중첩·리스트는 이 체크에 불필요). */
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return null;
  const end = text.indexOf("\n---", 3);
  if (end === -1) return null;
  const out = {};
  for (const line of text.slice(4, end).split("\n")) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

/** skills/<버킷>/<이름>/SKILL.md 를 전부 찾는다. */
function findSkillDirsOnDisk() {
  const base = join(ROOT, "skills");
  if (!existsSync(base)) return [];
  const found = [];
  for (const bucket of readdirSync(base)) {
    const bucketPath = join(base, bucket);
    if (!statSync(bucketPath).isDirectory()) continue;
    for (const name of readdirSync(bucketPath)) {
      const dir = join(bucketPath, name);
      if (!statSync(dir).isDirectory()) continue;
      if (existsSync(join(dir, "SKILL.md"))) found.push(`./skills/${bucket}/${name}`);
    }
  }
  return found;
}

// ── 매니페스트 읽기 ────────────────────────────────────────────────
const pluginPath = join(ROOT, ".claude-plugin", "plugin.json");
if (!existsSync(pluginPath)) {
  console.error("✘ .claude-plugin/plugin.json 이 없습니다.");
  process.exit(1);
}
let plugin;
try {
  plugin = JSON.parse(readFileSync(pluginPath, "utf8"));
} catch (e) {
  console.error(`✘ plugin.json JSON 파싱 실패: ${e.message}`);
  process.exit(1);
}

// "// ..." 주석 문자열은 목록이 아니라 메모다.
const isComment = (s) => s.trim().startsWith("//");
const active = (plugin.skills ?? []).filter((s) => !isComment(s));
const disabled = (plugin._disabledSkills ?? []).filter((s) => !isComment(s));

// ── 1. 등록된 경로 검사 (활성·비활성 모두) ─────────────────────────
const seenNames = new Map();

// 같은 경로가 양쪽 배열에 있으면(=아래 2번에서 별도 보고) 여기서는 한 번만 검사한다.
// 두 번 돌면 자기 자신과 이름이 겹친다는 오탐이 난다.
const toCheck = [];
const checkedPaths = new Set();
for (const [entry, state] of [
  ...active.map((s) => [s, "활성"]),
  ...disabled.map((s) => [s, "비활성"]),
]) {
  if (checkedPaths.has(entry)) continue;
  checkedPaths.add(entry);
  toCheck.push([entry, state]);
}

for (const [entry, state] of toCheck) {
  const dir = join(ROOT, entry);
  const label = `${entry} [${state}]`;

  if (!existsSync(dir)) {
    err(`${label} — 폴더가 없습니다.`);
    continue;
  }
  const skillMd = join(dir, "SKILL.md");
  if (!existsSync(skillMd)) {
    err(`${label} — SKILL.md 가 없습니다. (스킬로 인식되지 않습니다)`);
    continue;
  }

  const fm = parseFrontmatter(readFileSync(skillMd, "utf8"));
  if (!fm) {
    err(`${label} — SKILL.md 에 frontmatter(--- 블록)가 없습니다.`);
    continue;
  }

  const folder = basename(entry);
  if (!SKILL_NAME_RE.test(folder)) {
    err(`${label} — 폴더명 '${folder}' 이 kebab-case 규칙(^[a-z0-9]+(-[a-z0-9]+)*$) 위반.`);
  }

  if (!fm.name) {
    err(`${label} — frontmatter 에 name 이 없습니다.`);
  } else {
    if (!SKILL_NAME_RE.test(fm.name)) {
      err(
        `${label} — name '${fm.name}' 이 kebab-case 규칙 위반. ` +
          `언더스코어·대문자·공백이 있으면 스킬이 조용히 등록되지 않습니다.`,
      );
    }
    if (fm.name !== folder) {
      err(`${label} — frontmatter name '${fm.name}' 과 폴더명 '${folder}' 불일치.`);
    }
    if (seenNames.has(fm.name)) {
      err(`${label} — name '${fm.name}' 이 ${seenNames.get(fm.name)} 와 중복.`);
    } else {
      seenNames.set(fm.name, entry);
    }
  }

  if (!fm.description) {
    err(`${label} — frontmatter 에 description 이 없습니다. (모델이 언제 쓸지 판단하지 못합니다)`);
  } else if (fm.description.length < 20) {
    warn(`${label} — description 이 너무 짧습니다(${fm.description.length}자).`);
  }
}

// ── 2. 양쪽 배열에 중복 등록됐는지 ─────────────────────────────────
for (const entry of active) {
  if (disabled.includes(entry)) {
    err(`${entry} — skills 와 _disabledSkills 양쪽에 있습니다. 한쪽에서 제거하세요.`);
  }
}

// ── 3. 디스크에는 있는데 어느 배열에도 없는 스킬 ───────────────────
const registered = new Set([...active, ...disabled]);
for (const onDisk of findSkillDirsOnDisk()) {
  if (!registered.has(onDisk)) {
    warn(
      `${onDisk} — SKILL.md 가 있지만 plugin.json 의 skills/_disabledSkills 어느 쪽에도 없습니다. ` +
        `배포되지 않으며 비활성 의도인지 불분명합니다.`,
    );
  }
}

// ── 4. 버전 정합성 ────────────────────────────────────────────────
const readVersion = (rel) => {
  const p = join(ROOT, rel);
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
};
const marketplace = readVersion(".claude-plugin/marketplace.json");
if (marketplace) {
  if (marketplace.version !== plugin.version) {
    err(
      `버전 불일치 — plugin.json ${plugin.version} vs marketplace.json ${marketplace.version}. ` +
        `릴리스 시 항상 함께 bump 합니다.`,
    );
  }
  const entryVersion = marketplace.plugins?.[0]?.version;
  if (entryVersion && entryVersion !== plugin.version) {
    err(`버전 불일치 — plugin.json ${plugin.version} vs marketplace.plugins[0].version ${entryVersion}.`);
  }
}
// package.json / package-lock.json 도 같은 버전을 유지한다(3.7.0~).
// 잠금파일은 `npm version <새버전> --no-git-tag-version` 으로 함께 갱신하는 것이 안전하다.
const pkg = readVersion("package.json");
if (pkg && pkg.version !== plugin.version) {
  err(
    `버전 불일치 — package.json ${pkg.version} vs plugin.json ${plugin.version}. ` +
      `\`npm version ${plugin.version} --no-git-tag-version\` 으로 맞추세요.`,
  );
}
const lock = readVersion("package-lock.json");
if (lock) {
  const lockVersions = [lock.version, lock.packages?.[""]?.version].filter(Boolean);
  for (const v of lockVersions) {
    if (v !== plugin.version) {
      err(
        `버전 불일치 — package-lock.json ${v} vs plugin.json ${plugin.version}. ` +
          `\`npm version ${plugin.version} --no-git-tag-version\` 이 두 파일을 함께 갱신합니다.`,
      );
      break;
    }
  }
}

// ── 결과 출력 ─────────────────────────────────────────────────────
console.log(`스킬 등록 현황 — 활성 ${active.length}개 / 비활성 ${disabled.length}개\n`);
if (active.length) console.log(`  활성:   ${active.map((s) => basename(s)).join(" · ")}`);
if (disabled.length) console.log(`  비활성: ${disabled.map((s) => basename(s)).join(" · ")}`);
console.log("");

for (const w of warnings) console.log(`⚠  ${w}`);
for (const e of errors) console.log(`✘  ${e}`);

if (errors.length) {
  console.log(`\n✘ 에러 ${errors.length}건${warnings.length ? `, 경고 ${warnings.length}건` : ""}`);
  process.exit(1);
}
console.log(warnings.length ? `\n✔ 통과 (경고 ${warnings.length}건)` : "\n✔ 통과");
