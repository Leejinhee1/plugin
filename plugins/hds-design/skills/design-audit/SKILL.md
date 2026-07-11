---
name: design-audit
description: 렌더링된 화면(프로토타입·라이브 화면·스크린샷)의 비주얼 완성도를 감사합니다. 첫인상 기록부터 체크리스트 감사, Design Score/Slop Score 이중 평가, 심각도별 트리아지까지 진행할 때 사용. Use when visually auditing a rendered screen, prototype, or screenshot for design quality and "AI slop" — not for reviewing component spec/code (use the hds-design:design-reviewer agent for that).
---

# 렌더링 화면 비주얼 감사

이 스킬은 **화면으로 렌더링된 결과물**(프로토타입, 라이브 화면, 스크린샷)을 감사합니다. 컴포넌트 spec·코드 같은 시스템 산출물 검수는 이 스킬의 영역이 아니라 `hds-design:design-reviewer` 에이전트의 몫입니다 — 렌더링 화면 요청이 아니면 그쪽으로 안내하세요.

## 절차

1. **첫인상 기록** — 체크리스트를 열기 전, 화면을 3~5초 본 인상(위계가 읽히는가, 시선이 먼저 가는 곳, 어색한 지점)을 먼저 적는다. 세부 점검이 첫인상을 지우지 않도록 순서를 지킨다.
2. **체크리스트 감사** — `checklist.md` 를 로드해 6개 카테고리를 항목별로 판정한다.
3. **이중 스코어링** — 서로 다른 두 축으로 A~F를 매긴다.
   - **Design Score** — 시각 위계·타이포·색/대비·간격/정렬·인터랙션 상태·반응형/모션, 체크리스트 충족도의 종합.
   - **Slop Score** — `anti-slop.md` 블랙리스트에 해당하는 항목 수. 해당 없음=A, 다수 해당=F.
   두 점수는 독립적이다 — 체크리스트를 대체로 지켜도 제네릭한 그라디언트·카드 그리드가 있으면 Slop Score는 낮게 나올 수 있다.
4. **심각도별 트리아지** — 발견을 **blocker**(출시 불가) / **warning**(개선 권장) / **nit**(사소)로 분류한다.
5. **원자적 수정** — 발견 하나당 수정 하나로 처리한다(여러 발견을 묶어 한 번에 고치지 않는다). 단 **토큰 값 자체의 문제**(대비 부족한 색, 스케일에 없는 간격 등)는 화면에서 임의로 덮어쓰지 말고 `/hds-design:design-tokens` 로 에스컬레이션한다 — 원칙 2(토큰이 진실)·4(일관성 > 개인 취향).
6. **재감사** — 수정 후 1~5를 다시 돌려 Design Score/Slop Score가 개선됐는지 확인한다.

## 참조 파일 (필요할 때만 로드)
- `checklist.md` — 6개 카테고리 상세 체크리스트. 근거: `design-system/guidelines/`.
- `anti-slop.md` — HDS/브랜드 기준 "AI 슬롭" 블랙리스트. 근거: `design-system/brand/voice-tone.md`, `visual-style.md`.

## 하지 말 것
- 컴포넌트 spec/코드 자체의 검수는 이 스킬이 아니라 `hds-design:design-reviewer` 에이전트에게 위임한다(중복 방지).
- 대비의 결정적 수치 계산과 공식 pass/fail 리포트가 필요하면 `/hds-publish:a11y-audit` 를 함께 안내한다 — 이 스킬은 눈으로 보는 완성도 감사, a11y-audit 은 수치 검증을 맡는다.
- 토큰 문제를 화면 레벨에서 몰래 우회해 고치지 않는다.
