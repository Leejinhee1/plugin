# 유지보수 가이드

> 목표: 몇 년 뒤 다른 담당자가 와도 **한 곳만 고치면 안전하게 반영**되도록.

## 황금 규칙
1. **내용은 SoT에서만** 바꾼다 → `design-system/`.
2. **파생물은 재생성**한다 → `tokens.css`, Tailwind preset, Figma 변수, 프로토타입은 절대 손으로 고치지 않는다.
3. **바꾸면 버전과 함께** → `CHANGELOG.md` + `.claude-plugin/plugin.json` · `marketplace.json` `version` bump (둘을 항상 같이).

## 토큰 바꾸기
1. `design-system/tokens/` 의 해당 레이어 수정 — `core`(원시값)·`semantic`(의미값)·`component`(HES comp/layout 스펙)·`platform`(모드별 값).
2. 색이면 대비(WCAG AA)·다크(`$dark`) 확인 → `/hds:a11y-audit`.
3. `CHANGELOG.md` 기록 + version bump.
4. 소비처 재생성: `/hds:token-export`, (Figma 쓰면) `/hds:figma-bridge`.
> CSS 변수명이 컴포넌트 코드의 `--hds-*` 와 일치하는지 반드시 확인.

## 컴포넌트 추가/변경
1. `/hds:component-catalog` 로 스캐폴딩 → `components/<name>/` 에 3종 세트.
   - `spec.md`(API·상태·토큰매핑·접근성) + `<Component>.tsx`(토큰 변수만) + `usage.md`(사례+안티패턴).
2. `registry.json` 에 등록(`status`, `since`, 경로, `tokens`).
3. 값/API가 바뀌면 `CHANGELOG.md` + version bump.
4. `hds:design-reviewer` 로 검수.
> `status`: `draft` → `stable` → `deprecated`(대체재 명시).

## 가이드 문서 갱신
`design-system/guidelines/` 를 표·명시적 규칙으로 유지(AI-리더블). 예외를 늘리지 말고 규칙/토큰으로 승격.

## MCP 커넥터 추가/관리
1. `/hds:mcp-connectors` 로 `mcp/registry.json` 에 등록(`name·status·since·transport·scope·usedBy·connect`). Figma 항목이 정본 예시.
2. **scope 결정**: `bundled`(config 에 비밀 없는 로컬 stdio·공개 http·"로컬 http+앱 세션 인증"만 — `plugin.json` 의 `mcpServers` 에 선언) · `user`(각자 연결) · `project`(팀 `.mcp.json`). **비밀은 절대 커밋·번들 금지.** bundled 는 `registry.json` 과 `plugin.json` 을 같은 PR에서 갱신.
3. `url` 커넥터는 `type`(http/sse/ws)을 반드시 명시. 소비 스킬(`usedBy`)에 전제/폴백을 링크.
4. `CHANGELOG.md` + version bump.
> 레지스트리는 *써야 할* 커넥터, `/mcp`·`claude mcp list` 는 *연결된* 커넥터. 둘을 대조.

## 버전 정책 (릴리스)
- 이 저장소는 **명시적 semver**를 사용합니다(공식 가이드라 통제된 배포).
- `MAJOR`: 토큰 삭제/이름변경, 컴포넌트 API 파괴적 변경.
- `MINOR`: 토큰/컴포넌트/화면패턴 추가.
- `PATCH`: 값 조정·문서·버그.
- 릴리스 시: `.claude-plugin/plugin.json` 과 `marketplace.json` 의 version을 함께 bump하고 `CHANGELOG.md` 작성. 사용자는 `/plugin update hds@hds` 로 받는다.
> 빠른 실험 단계라면 `version` 을 비워 커밋 SHA를 버전으로 쓸 수 있으나, 공식 배포는 명시 버전을 유지.

## 플러그인/스킬 유지
- **새 스킬 추가**: `skills/<버킷>/<이름>/SKILL.md` 생성 + `.claude-plugin/plugin.json` 의 `skills[]` 배열에 경로 등록. **배열에 없는 스킬은 배포되지 않는다** — 초안은 배열에서 빼두면 됨 (mattpocock/skills 의 promoted 방식).
- 마켓플레이스에서 사라진 옛 플러그인(v1의 `hds-design`/`hds-planning`/`hds-publish`)은 `marketplace.json` 의 `forceRemoveDeletedPlugins: true` 로 사용자 업데이트 시 자동 제거된다. 제거 후 `/plugin install hds@hds` 한 번이면 이전과 동일 + 그 이상.
- 검증: `claude plugin validate . --strict` (CI에 넣기 권장).

## 확장 (부서 → 그룹사)
- 계열사 테마: `core` 토큰만 오버라이드하는 방식이 가장 저비용.
- 계열사 특화 컴포넌트: 별도 플러그인 + `dependencies: [hds]`.
- 다른 마켓플레이스 의존이 필요하면 `allowCrossMarketplaceDependenciesOn` 설정.

## 체크리스트 (PR 리뷰용)
- [ ] 값이 SoT(tokens/)에서만 바뀌었는가? 하드코딩 없는가?
- [ ] 컴포넌트 3종 세트 + registry 등록?
- [ ] (MCP 커넥터 변경 시) `mcp/registry.json` 등록 + scope 적절 + **번들에 비밀 없음** + `url`엔 `type` + `plugin.json` mcpServers 동기화?
- [ ] 접근성(대비·키보드·포커스·aria) 확인?
- [ ] CHANGELOG + version bump?
- [ ] `claude plugin validate --strict` 통과?
