# 유지보수 가이드

> 목표: 몇 년 뒤 다른 담당자가 와도 **한 곳만 고치면 안전하게 반영**되도록.

## 황금 규칙
1. **내용은 SoT에서만** 바꾼다 → `design-system/`.
2. **파생물은 재생성**한다 → `tokens.css`, Tailwind preset, Figma 변수, 프로토타입은 절대 손으로 고치지 않는다.
3. **바꾸면 버전과 함께** → `CHANGELOG.md` + `.claude-plugin/plugin.json` · `marketplace.json` `version` bump (둘을 항상 같이).

## 토큰 바꾸기
1. `design-system/tokens/` 의 해당 레이어 수정 — `core`(원시값)·`semantic`(의미값)·`component`(HES comp/layout 스펙)·`platform`(모드별 값).
2. 색이면 대비(WCAG AA)·다크(`$dark`) 확인 → a11y-audit 🚧 (지금은 `guidelines/color.md` 기준 수동 검토 또는 `hes:design-reviewer`).
3. `CHANGELOG.md` 기록 + version bump.
4. 소비처 재생성: token-export 🚧 (지금은 `node skills/publish/token-export/scripts/build-tokens.mjs` 직접 실행), (Figma 쓰면) figma-bridge 🚧 (지금은 수동).
> CSS 변수명이 컴포넌트 코드의 `--hes-*` 와 일치하는지 반드시 확인.

## 컴포넌트 추가/변경
1. component-catalog 🚧 로 스캐폴딩 → `components/<name>/` 에 3종 세트. (지금은 `components/button/` 정본 구조를 복제해 수동 생성)
   - `spec.md`(API·상태·토큰매핑·접근성) + `<Component>.tsx`(토큰 변수만) + `usage.md`(사례+안티패턴).
2. `registry.json` 에 등록(`status`, `since`, 경로, `tokens`).
3. 값/API가 바뀌면 `CHANGELOG.md` + version bump.
4. `hes:design-reviewer` 로 검수.
> `status`: `draft` → `stable` → `deprecated`(대체재 명시).

## 가이드 문서 갱신
`design-system/guidelines/` 를 표·명시적 규칙으로 유지(AI-리더블). 예외를 늘리지 말고 규칙/토큰으로 승격.

## MCP 커넥터 추가/관리
1. `/hes:mcp-connectors` 로 `mcp/registry.json` 에 등록(`name·status·since·transport·scope·usedBy·connect`). Figma 항목이 정본 예시.
2. **scope 결정**: `bundled`(config 에 비밀 없는 로컬 stdio·공개 http·"로컬 http+앱 세션 인증"만 — `plugin.json` 의 `mcpServers` 에 선언) · `user`(각자 연결) · `project`(팀 `.mcp.json`). **비밀은 절대 커밋·번들 금지.** bundled 는 `registry.json` 과 `plugin.json` 을 같은 PR에서 갱신.
3. `url` 커넥터는 `type`(http/sse/ws)을 반드시 명시. 소비 스킬(`usedBy`)에 전제/폴백을 링크.
4. `CHANGELOG.md` + version bump.
> 레지스트리는 *써야 할* 커넥터, `/mcp`·`claude mcp list` 는 *연결된* 커넥터. 둘을 대조.

## 버전 정책 (릴리스)
- 이 저장소는 **명시적 semver**를 사용합니다(공식 가이드라 통제된 배포).
- `MAJOR`: 토큰 삭제/이름변경, 컴포넌트 API 파괴적 변경.
- `MINOR`: 토큰/컴포넌트/화면패턴 추가.
- `PATCH`: 값 조정·문서·버그.
- 릴리스 시: **버전이 적힌 파일 4개를 함께 bump** 하고 `CHANGELOG.md` 작성. 사용자는 `/plugin update hes@hes` 로 받는다.
  ```bash
  # 1) npm 쪽 2개 (package.json + package-lock.json 을 한 번에)
  npm version <새버전> --no-git-tag-version
  # 2) 플러그인 쪽 2개는 직접 수정
  #    .claude-plugin/plugin.json  → version
  #    .claude-plugin/marketplace.json → version, plugins[0].version
  # 3) 확인
  npm run check
  ```
  `index.html` 의 버전 표기(히어로 배지·푸터)도 함께 갱신한다. 4개 파일 불일치는 `npm run check` 가 에러로 잡는다.
> 빠른 실험 단계라면 `version` 을 비워 커밋 SHA를 버전으로 쓸 수 있으나, 공식 배포는 명시 버전을 유지.

## 플러그인/스킬 유지
- **새 스킬 추가**: `skills/<버킷>/<이름>/SKILL.md` 생성 + `.claude-plugin/plugin.json` 의 `skills[]` 배열에 경로 등록. **배열에 없는 스킬은 배포되지 않는다** — 초안은 배열에서 빼두면 됨 (mattpocock/skills 의 promoted 방식).
- **미완성 스킬 비활성화** (3.7.0~): 파일을 지우거나 옮기지 않고 `skills[]` 에서 `_disabledSkills[]` 로 경로를 옮긴다. JSON은 주석을 못 쓰므로 이 배열의 첫 원소를 `"// 미완성 — ..."` 주석 문자열로 둔다(스키마에 없는 키라 Claude Code는 무시).
  - 완성 → `_disabledSkills` 에서 `skills` 로 경로 한 줄 이동 + version bump.
  - **비활성화/활성화 시 함께 갱신할 곳**: `README.md`(구조 트리 🚧 · 역할별 표) · `docs/user-guide.md`(개발 현황 표 + 해당 시나리오) · `docs/getting-started.md`(상단 배너 + 역할별 첫 사용) · `skills/<버킷>/README.md` 상태 열 · `skills/general/ask-hes/SKILL.md`(라우터의 실행 가능 목록) · `index.html`(랜딩 배지).
  - 원칙: **없는 스킬을 `/hes:xxx` 슬래시 형태로 문서에 남기지 않는다.** 준비중 항목은 슬래시 없이 이름만 쓰고 🚧 배지와 대안 경로를 함께 적는다. 확인: `grep -rn "/hes:<이름>" --include="*.md" --include="*.html" .`
- 마켓플레이스에서 사라진 옛 플러그인(v1의 `hes-design`/`hes-planning`/`hes-publish`)은 `marketplace.json` 의 `forceRemoveDeletedPlugins: true` 로 사용자 업데이트 시 자동 제거된다. 제거 후 `/plugin install hes@hes` 한 번이면 이전과 동일 + 그 이상.

### 검증 (스킬을 건드렸으면 둘 다)

```bash
npm run check                 # = node scripts/check-skills.mjs
claude plugin validate .      # --strict 없이 (아래 참조)
```

두 도구는 **보는 곳이 다르다**. 겹치지 않으므로 둘 다 돌린다.

| | `claude plugin validate` | `npm run check` |
| :-- | :-- | :-- |
| JSON 문법·필수 필드 | ✅ | 파싱 실패만 |
| `skills[]` 경로 존재 | ✅ | ✅ (`_disabledSkills` 도) |
| **SKILL.md 의 `name` kebab-case** | ❌ 검사 안 함 | ✅ |
| **폴더명 ↔ frontmatter `name` 일치** | ❌ 검사 안 함 | ✅ |
| `description` 누락 | ❌ | ✅ |
| 이름 중복 · 양쪽 배열 중복 등록 | ❌ | ✅ |
| 디스크에 있는데 미등록인 스킬 | ❌ | ⚠️ 경고 |
| plugin·marketplace·package·lock 버전 일치 | ❌ | ✅ |

> **`--strict` 는 쓰지 않는다.** `--strict` 는 검사 항목을 늘리는 게 아니라 경고를 에러로 승격시킬 뿐인데, 이 저장소에서 걸리는 경고는 의도적으로 넣은 `_disabledSkills`("Unknown field — Claude Code ignores it at load time") 하나뿐이다. 반면 실제로 사고를 냈던 이름 규칙 위반(3.6.0 의 `test_script`)은 `--strict` 로도 잡히지 않는다 — 그건 `npm run check` 의 몫이다.

## 확장 (부서 → 그룹사)
- 계열사 테마: `core` 토큰만 오버라이드하는 방식이 가장 저비용.
- 계열사 특화 컴포넌트: 별도 플러그인 + `dependencies: [hes]`.
- 다른 마켓플레이스 의존이 필요하면 `allowCrossMarketplaceDependenciesOn` 설정.

## 체크리스트 (PR 리뷰용)
- [ ] 값이 SoT(tokens/)에서만 바뀌었는가? 하드코딩 없는가?
- [ ] 컴포넌트 3종 세트 + registry 등록?
- [ ] (MCP 커넥터 변경 시) `mcp/registry.json` 등록 + scope 적절 + **번들에 비밀 없음** + `url`엔 `type` + `plugin.json` mcpServers 동기화?
- [ ] 접근성(대비·키보드·포커스·aria) 확인?
- [ ] CHANGELOG + version bump?
- [ ] (스킬 변경 시) `npm run check` 통과? `claude plugin validate .` 통과? — `--strict` 는 쓰지 않는다
