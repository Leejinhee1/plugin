HDS 디자인 토큰 작업. 소스: `plugins/hds-design/design-system/tokens/`.

먼저 `tokens/README.md`(2레이어 규칙)와 `core.tokens.json`/`semantic.tokens.json` 을 읽어라. 그다음 사용자의 요청($ARGUMENTS)을 처리하되:

- UI가 참조할 값은 semantic 레이어에만 둔다. core 직접 참조가 필요하면 alias를 먼저 만든다.
- 새 토큰은 `category.role.variant` 명명 + DTCG 포맷(`$value`/`$type`).
- 색 추가/변경 시 다크(`$dark`) 대응과 대비(WCAG AA)를 함께 검토한다.
- 값을 바꾸면 원본(tokens/)만 고치고, 파생물(tokens.css 등)은 재생성 대상임을 알린다.
- 변경 시 `CHANGELOG.md` 기록과 version bump를 함께 제안한다.

하드코딩된 색/간격이 보이면 지적하고 토큰으로 교체하라.
