---
name: a11y-audit
description: 컴포넌트/화면/토큰의 접근성을 HDS 기준(WCAG AA)으로 점검합니다. 색 대비, 키보드 접근, 포커스, aria, 모션 민감성을 검사할 때 사용. Use when auditing accessibility of components, screens, or color tokens against WCAG AA.
---

# 접근성 점검 (WCAG AA)

퍼블 산출물이 HDS 접근성 기준을 만족하는지 검사합니다. 기준: `hds-design` 의 `design-system/guidelines/color.md` 및 `principles.md` 원칙 3.

코드 구조·스펙 정합까지 포함한 종합 리뷰는 `/hds-publish:ui-review` (이 스킬은 접근성 심층 담당).

## 검사 항목
1. **색 대비** — 본문 4.5:1, 큰 텍스트 3:1, UI 경계/아이콘 3:1. semantic 색 조합(fg/bg)을 계산해 통과 여부 판정. 다크 테마(`$dark`)도 별도 검사.
2. **키보드** — 모든 인터랙티브 요소 Tab 접근·조작 가능, 논리적 포커스 순서, 트랩 없음.
3. **포커스 가시성** — `:focus-visible` 링(`--hds-focus-ring`) 노출.
4. **의미/ARIA** — 네이티브 요소 우선, 아이콘 전용 버튼 `aria-label`, 로딩 `aria-busy`, 상태 알림 `aria-live`.
5. **색 비의존** — 색만으로 정보 전달하지 않음(아이콘/텍스트 병행).
6. **모션** — `prefers-reduced-motion: reduce` 존중.

## 출력
항목별 pass/fail + 실패 시 대비값·근거·수정안(어떤 토큰/속성으로 고칠지). 대비 계산은 결정적으로 수행하고 수치를 함께 제시.

## 자동화 제안
프로젝트에 axe-core / eslint-plugin-jsx-a11y / Storybook a11y addon 도입을 권장하고, 이 스킬은 토큰 레벨(대비)과 스펙 레벨 검사를 담당.
