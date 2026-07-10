---
name: prototype
description: 승인된 제품 설계서를 근거로, HDS 디자인·퍼블 코드베이스를 사용해 동작하는 프로토타입을 생성합니다. 설계서를 화면/플로우로 시각화하거나 클릭 가능한 프로토타입이 필요할 때 사용. Use when turning a product spec into a working prototype built from the HDS component library.
---

# 프로토타입 생성 (설계서 → 동작 화면)

기획 설계서를 **실제 HDS 컴포넌트·토큰으로 만든 프로토타입**으로 변환합니다.
새 UI를 처음부터 그리지 않고, 디자인 시스템에서 조립합니다 → 프로토타입이 곧 구현의 출발점.

## 입력
- 제품 설계서(`product-spec` 산출물) — 특히 "5. 화면 명세"의 HDS 참조.
- HDS 소스: `hds-design` 의 `design-system/components/registry.json`, `usage/`, `tokens/`.

## 절차
1. 설계서의 화면 명세를 읽고, 참조된 컴포넌트를 `registry.json` 에서 확인한다.
2. 토큰 CSS 변수를 세팅한다: `/hds-publish:token-export` 로 `tokens.css` 를 생성(또는 재사용)해 프로토타입에 로드.
3. 컴포넌트를 조립해 화면을 만든다:
   - 존재하는 컴포넌트는 레퍼런스 소스(`components/<name>/<Component>.tsx`)를 그대로 사용.
   - 화면 조합은 `usage/screens/` 패턴을 따른다.
   - empty/loading/error 상태를 설계서 수용기준대로 포함.
4. 클릭 가능한 플로우로 연결(라우팅/상태). 산출물은 프로토타입 앱(예: Vite+React) 또는 단일 HTML로.
5. 설계서에 없는 컴포넌트가 필요하면 임시 조립하되 **"신규 컴포넌트 후보"로 표시**하고 `/hds-design:component-catalog` 승격을 제안.

## 원칙
- 프로토타입도 토큰·컴포넌트를 준수한다(하드코딩 금지). 그래야 퍼블이 그대로 이어받는다.
- 프로토타입 ≠ 최종 코드지만, HDS를 지켰다면 **퍼블 단계에서 재작성이 아니라 정리로 끝난다**.
- 데이터는 목업으로, 상태·인터랙션은 진짜처럼.

## 산출 후
- 설계서의 미해결 질문이 프로토타입에서 드러나면 설계서 Open questions에 반영.
- 검수는 `hds-design:design-reviewer` 에이전트로.
