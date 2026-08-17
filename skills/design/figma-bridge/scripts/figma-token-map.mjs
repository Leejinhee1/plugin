#!/usr/bin/env node
// figma-token-map.mjs — Figma 변수(get_variable_defs)를 HES 토큰과 대조해 매핑 커버리지를 진단.
// 무의존(Node >=18). 판정: ✅일치 / 🔶값불일치 / 🔁후보 / ⚠️미매핑.
//
// 사용:
//   node figma-token-map.mjs --figma <vars.json> [--tokens <토큰 디렉터리>] [--json]
//     --figma  : get_variable_defs 산출(JSON). 형태 관대 — {name:value} 객체 / [{name,value}] 배열 / {variables:{…}}
//     --tokens : 토큰 디렉터리(생략 시 플러그인 design-system/tokens 자동 탐색)
//     --json   : 사람용 리포트 대신 기계용 JSON 출력
//
// 주의: 값 기반 휴리스틱 진단이다. 🔶(이름 유사·값 다름)은 이름 매칭이 느슨하므로 사용자가 확인한다.
// 정확한 토큰 값 resolve 기준은 build-tokens.mjs 이며, 이 도구는 그와 같은 규칙(별칭 재귀 resolve)을 최소 구현한다.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- args ----------
function parseArgs(argv) {
  const a = { figma: null, tokens: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--figma') a.figma = argv[++i];
    else if (k === '--tokens') a.tokens = argv[++i];
    else if (k === '--json') a.json = true;
    else if (k === '-h' || k === '--help') a.help = true;
  }
  return a;
}

// ---------- 값 정규화 (양쪽 동일 규칙으로 비교) ----------
function normVal(v) {
  if (v == null) return null;
  if (typeof v === 'object') {
    if ('value' in v) return normVal(`${v.value}${v.unit || ''}`); // DTCG dimension {value,unit}
    return JSON.stringify(v);
  }
  let s = String(v).trim().toLowerCase();
  const hex3 = s.match(/^#([0-9a-f]{3})$/);              // #abc → #aabbcc
  if (hex3) s = '#' + hex3[1].split('').map((c) => c + c).join('');
  const dim = s.match(/^(-?\d*\.?\d+)(px|rem|em)?$/);    // 16 / 16px / 1rem → Npx
  if (dim) {
    let n = parseFloat(dim[1]);
    if (dim[2] === 'rem' || dim[2] === 'em') n *= 16;
    s = `${n}px`;
  }
  return s.replace(/\s+/g, '');                          // rgba(1, 2, 3) 등 공백 제거
}

function slug(s) {
  return String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

// ---------- 토큰 로딩 + 별칭 resolve + 평탄화 ----------
function loadTokens(dir) {
  const raw = new Map(); // "color.brand.default" → $value(원시, 별칭 가능)
  const files = readdirSync(dir).filter((f) => f.endsWith('.tokens.json'));
  for (const f of files) {
    let tree;
    try { tree = JSON.parse(readFileSync(join(dir, f), 'utf8')); }
    catch (e) { throw new Error(`토큰 파싱 실패: ${f} — ${e.message}`); }
    walk(tree, [], raw);
  }
  const seen = new Set();
  const resolve = (val, path, depth = 0) => {
    if (depth > 20) return val;
    if (typeof val === 'string') {
      const m = val.match(/^\{(.+)\}$/);
      if (m) {
        const target = m[1];
        if (raw.has(target)) return resolve(raw.get(target), target, depth + 1);
        return val; // 미해결 별칭 — 그대로
      }
    }
    return val;
  };
  const flat = [];
  for (const [path, val] of raw) {
    const resolved = resolve(val, path);
    flat.push({ path, value: resolved, norm: normVal(resolved) });
  }
  return flat;
}

function walk(obj, prefix, out) {
  if (!obj || typeof obj !== 'object') return;
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue; // 메타($description/$type/$dark…) 스킵
    if (v && typeof v === 'object' && '$value' in v) {
      out.set([...prefix, k].join('.'), v['$value']); // 리프 토큰
    } else if (v && typeof v === 'object') {
      walk(v, [...prefix, k], out); // 그룹
    }
  }
}

// ---------- Figma 변수 입력 (형태 관대) ----------
function loadFigma(file) {
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const out = [];
  const val = (v) => (v && typeof v === 'object' && 'value' in v ? `${v.value}${v.unit || ''}` : v);
  if (Array.isArray(j)) {
    for (const it of j) {
      if (it && typeof it === 'object') out.push({ name: it.name ?? it.id ?? JSON.stringify(it), value: val(it.value ?? it.$value ?? it.resolvedValue) });
    }
  } else if (j && typeof j === 'object') {
    const src = j.variables && typeof j.variables === 'object' ? j.variables : j;
    for (const [k, v] of Object.entries(src)) out.push({ name: k, value: val(v) });
  }
  return out.filter((e) => e.value != null && e.name);
}

// ---------- 진단 ----------
function diagnose(figmaVars, tokens) {
  const byNorm = new Map();
  for (const t of tokens) {
    if (t.norm == null) continue;
    if (!byNorm.has(t.norm)) byNorm.set(t.norm, []);
    byNorm.get(t.norm).push(t);
  }
  const results = [];
  for (const fv of figmaVars) {
    const fnorm = normVal(fv.value);
    const matches = byNorm.get(fnorm) || [];
    let verdict, detail = {};
    if (matches.length === 1) { verdict = '✅일치'; detail.token = matches[0].path; }
    else if (matches.length > 1) { verdict = '🔁후보'; detail.tokens = matches.map((m) => m.path); }
    else {
      // 값 일치 없음 → 이름 유사 토큰 있으면 값불일치, 없으면 미매핑
      const fseg = slug(fv.name);
      const leaf = fseg[fseg.length - 1];
      const nameHit = leaf && tokens.find((t) => slug(t.path).includes(leaf) && !/^\d+$/.test(leaf));
      if (nameHit) { verdict = '🔶값불일치'; detail.token = nameHit.path; detail.tokenValue = nameHit.value; }
      else verdict = '⚠️미매핑';
    }
    results.push({ name: fv.name, value: fv.value, verdict, ...detail });
  }
  return results;
}

// ---------- 리포트 ----------
function report(results, figmaN, tokenN) {
  const order = ['✅일치', '🔶값불일치', '🔁후보', '⚠️미매핑'];
  const count = Object.fromEntries(order.map((v) => [v, results.filter((r) => r.verdict === v).length]));
  const L = [];
  L.push(`매핑 커버리지 진단 (Figma 변수 ${figmaN}개 · 토큰 ${tokenN}개)`);
  L.push(order.map((v) => `${v} ${count[v]}`).join('   '));
  const grp = (v) => results.filter((r) => r.verdict === v);
  for (const r of grp('⚠️미매핑').length ? ['⚠️미매핑 (신규 토큰 후보):'] : []) L.push('\n' + r);
  for (const r of grp('⚠️미매핑')) L.push(`  - ${r.name} = ${r.value}`);
  if (grp('🔶값불일치').length) L.push('\n🔶값불일치 (이름 유사·값 다름 → 오버라이드/갱신 검토):');
  for (const r of grp('🔶값불일치')) L.push(`  - ${r.name} = ${r.value}  (토큰 ${r.token} = ${r.tokenValue})`);
  if (grp('🔁후보').length) L.push('\n🔁후보 (값 동일 토큰 복수 → 선택 필요):');
  for (const r of grp('🔁후보')) L.push(`  - ${r.name} = ${r.value}  → ${r.tokens.join(', ')}`);
  if (grp('✅일치').length) L.push('\n✅일치:');
  for (const r of grp('✅일치')) L.push(`  - ${r.name} = ${r.value}  → ${r.token}`);
  return L.join('\n');
}

// ---------- main ----------
const args = parseArgs(process.argv.slice(2));
if (args.help || !args.figma) {
  console.log('사용: node figma-token-map.mjs --figma <vars.json> [--tokens <dir>] [--json]');
  process.exit(args.help ? 0 : 1);
}
const tokensDir = args.tokens
  || (process.env.CLAUDE_PLUGIN_ROOT && join(process.env.CLAUDE_PLUGIN_ROOT, 'design-system/tokens'))
  || join(__dirname, '../../../../design-system/tokens');
if (!existsSync(tokensDir)) {
  console.error(`토큰 디렉터리를 찾을 수 없습니다: ${tokensDir}\n--tokens <dir> 로 지정하세요.`);
  process.exit(1);
}
const tokens = loadTokens(tokensDir);
const figmaVars = loadFigma(args.figma);
const results = diagnose(figmaVars, tokens);
if (args.json) console.log(JSON.stringify({ figma: figmaVars.length, tokens: tokens.length, results }, null, 2));
else console.log(report(results, figmaVars.length, tokens.length));
