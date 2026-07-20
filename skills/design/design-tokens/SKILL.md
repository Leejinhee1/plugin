---
name: design-tokens
description: HDS 디자인 토큰(색·타이포·간격·모션)을 조회·추가·수정합니다. 토큰 값을 바꾸거나, 새 semantic 토큰을 추가하거나, 특정 UI에 어떤 토큰을 써야 하는지 물을 때 사용. Use when adding/editing design tokens or choosing which token applies.
---

# HDS 디자인 토큰 관리

토큰은 디자인 시스템의 뿌리입니다. 이 스킬은 `${CLAUDE_PLUGIN_ROOT}/design-system/tokens/` 의 원본을 다룹니다.

## 먼저 읽기
1. `${CLAUDE_PLUGIN_ROOT}/design-system/tokens/README.md` — 레이어 규칙(HES 이식 기준)과 이식 각색 결정 목록
2. `core.tokens.json` (HES base 원시값) / `semantic.tokens.json` (의미값) / `component.tokens.json` (HES comp/layout 스펙) / `platform.tokens.json` (AOS·iOS·PC·Min 모드)

## 작업 규칙
- **일반 UI가 참조할 토큰**은 semantic 레이어에 있어야 한다. UI가 core를 직접 참조하려 하면 semantic alias를 먼저 만든다. 단, **HES 컴포넌트 1:1 이식**은 component 레이어(`comp.*`)를 참조한다.
- HES 원본에 없는 값을 임의로 만들어 채우지 말 것(예: `space.elements.xl` 은 HES 에 없음). HDS 자체 토큰을 추가할 땐 `$description` 에 "HDS 자체 토큰"을 명시.
- 새 토큰은 `category.role.variant` 명명. DTCG 포맷(`$value`/`$type`)을 지킨다.
- 색 추가 시 다크(`$dark`) 대응과 대비(WCAG AA)를 함께 확인한다 → 필요하면 `/hds:a11y-audit` 안내.
- 값 변경은 파급이 크므로: 변경 후 반드시 (1) `CHANGELOG.md` 기록, (2) `plugin.json`/`marketplace.json` version bump, (3) 소비처(퍼블 export, Figma) 재생성 안내.

## 자주 하는 요청
- "이 버튼 배경색 토큰이 뭐야?" → `semantic.tokens.json` 에서 role 검색 후 답. 하드코딩 값이 보이면 지적.
- "브랜드 색을 바꾸고 싶어" → `core.tokens.json` 의 `color.brand.*` 만 수정하면 semantic·컴포넌트 전체가 따라옴을 설명하고 수정.
- "간격 스케일에 값을 추가" → `dimension.space` 에 추가하고 semantic space alias 검토.

## 하지 말 것
- 컴포넌트 코드나 export 산출물(`tokens.css`)을 직접 고쳐 값을 바꾸지 말 것. 원본은 언제나 tokens/.
