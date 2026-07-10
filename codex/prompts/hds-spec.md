HDS 제품 설계서(기획) 작업. 템플릿: `plugins/hds-planning/skills/product-spec/templates/spec-template.md`.

요청($ARGUMENTS)에 따라 설계서를 작성/업데이트하라:

- 템플릿의 섹션·프론트매터 구조를 유지한다(AI-리더블).
- 화면은 자연어로만 쓰지 말고 HDS 컴포넌트/토큰 이름으로 명세한다. 존재 여부는 `plugins/hds-design/design-system/components/registry.json` 과 `usage/` 로 확인한다.
- 없는 컴포넌트가 필요하면 "신규 컴포넌트 후보"로 표시한다.
- 수용 기준은 검증 가능하게, 상태(empty/loading/error)를 포함한다.
- 미해결 항목은 Open questions로 분리한다.
- 설계서를 저장할 위치는 제품 저장소의 `docs/specs/<feature>.md` 를 권장한다.
- 변경 시 프론트매터 version·updated 를 갱신하고 상단 Changelog에 남긴다.

설계가 확정되면 프로토타입 생성(레지스트리 조립)을 다음 단계로 안내하라.
