# 유지보수 가이드

> 목표: 몇 년 뒤 다른 담당자가 와도 **한 곳만 고치면 안전하게 반영**되도록.

## 황금 규칙
1. **내용은 SoT에서만** 바꾼다 → `plugins/hds-design/design-system/`.
2. **파생물은 재생성**한다 → `tokens.css`, Tailwind preset, Figma 변수, 프로토타입은 절대 손으로 고치지 않는다.
3. **바꾸면 버전과 함께** → `CHANGELOG.md` + 해당 `plugin.json`/`marketplace.json` `version` bump.

## 토큰 바꾸기
1. `design-system/tokens/core.tokens.json`(원시값) 또는 `semantic.tokens.json`(의미값) 수정.
2. 색이면 대비(WCAG AA)·다크(`$dark`) 확인 → `/hds-publish:a11y-audit`.
3. `CHANGELOG.md` 기록 + version bump.
4. 소비처 재생성: `/hds-publish:token-export`, (Figma 쓰면) `/hds-design:figma-bridge`.
> CSS 변수명이 컴포넌트 코드의 `--hds-*` 와 일치하는지 반드시 확인.

## 컴포넌트 추가/변경
1. `/hds-design:component-catalog` 로 스캐폴딩 → `components/<name>/` 에 3종 세트.
   - `spec.md`(API·상태·토큰매핑·접근성) + `<Component>.tsx`(토큰 변수만) + `usage.md`(사례+안티패턴).
2. `registry.json` 에 등록(`status`, `since`, 경로, `tokens`).
3. 값/API가 바뀌면 `CHANGELOG.md` + version bump.
4. `hds-design:design-reviewer` 로 검수.
> `status`: `draft` → `stable` → `deprecated`(대체재 명시).

## 가이드 문서 갱신
`design-system/guidelines/` 를 표·명시적 규칙으로 유지(AI-리더블). 예외를 늘리지 말고 규칙/토큰으로 승격.

## 버전 정책 (릴리스)
- 이 저장소는 **명시적 semver**를 사용합니다(공식 가이드라 통제된 배포).
- `MAJOR`: 토큰 삭제/이름변경, 컴포넌트 API 파괴적 변경.
- `MINOR`: 토큰/컴포넌트/화면패턴 추가.
- `PATCH`: 값 조정·문서·버그.
- 릴리스 시: 세 `plugin.json` 중 바뀐 것과 `marketplace.json` 의 version을 bump하고 `CHANGELOG.md` 작성. 사용자는 `/plugin update` 로 받는다.
> 빠른 실험 단계라면 `version` 을 비워 커밋 SHA를 버전으로 쓸 수 있으나, 공식 배포는 명시 버전을 유지.

## 마켓플레이스 유지
- 플러그인 이름 변경/삭제는 `marketplace.json` 의 `renames` 로 사용자 자동 마이그레이션.
- 새 플러그인 추가는 `plugins/` 에 폴더 + `marketplace.json` `plugins[]` 등록.
- 검증: `claude plugin validate <plugin> --strict` (CI에 넣기 권장).

## 확장 (부서 → 그룹사)
- 계열사 테마: `core` 토큰만 오버라이드하는 방식이 가장 저비용.
- 계열사 특화 컴포넌트: 별도 플러그인 + `dependencies: [hds-design]`.
- 다른 마켓플레이스 의존이 필요하면 `allowCrossMarketplaceDependenciesOn` 설정.

## 체크리스트 (PR 리뷰용)
- [ ] 값이 SoT(tokens/)에서만 바뀌었는가? 하드코딩 없는가?
- [ ] 컴포넌트 3종 세트 + registry 등록?
- [ ] 접근성(대비·키보드·포커스·aria) 확인?
- [ ] CHANGELOG + version bump?
- [ ] `claude plugin validate --strict` 통과?
