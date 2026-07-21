HES 컴포넌트 작업. 소스: `design-system/components/` (인덱스: `registry.json`).

요청($ARGUMENTS)을 처리하기 전에 `registry.json` 을 읽어 존재하는 컴포넌트를 파악하라. `components/button/` 을 구조 정본 예시로 삼는다.

- 조회 요청: registry에서 name·status·용도와 spec/usage를 근거로 답한다.
- 코드화/설치 요청(퍼블): 레퍼런스 소스를 대상 프로젝트에 배치하되 색/간격은 `--hes-*` CSS 변수(토큰)만 참조하고 하드코딩하지 않는다. 먼저 tokens.css 설치를 확인한다.
- 신규 추가: `spec.md`(프론트매터+API+상태+토큰매핑+접근성) + `<Component>.tsx`(토큰 변수만) + `usage.md`(사례+안티패턴) 3종을 만들고 `registry.json` 에 등록. `CHANGELOG.md`+version bump.

접근성(키보드·포커스·aria·대비)을 항상 포함하라. 기존 조합으로 되는 건 새로 만들지 마라.
