---
name: product-spec
description: 제품 설계서(PRD)를 AI-리더블한 구조화 문서로 작성·관리·업데이트합니다. 새 기능 기획서를 만들거나 기존 설계서를 갱신할 때 사용. Use when creating or updating an AI-readable product spec / PRD.
---

# 제품 설계서 (AI-리더블 PRD)

기획의 산출물을 사람과 AI 모두가 읽고 실행 가능한 구조화 문서로 관리합니다.
목적: 이 설계서 하나로 디자인·퍼블·프로토타입이 파생될 수 있게 한다.

## 템플릿
`${CLAUDE_PLUGIN_ROOT}/skills/product-spec/templates/spec-template.md` 를 복사해 시작합니다.
설계서는 제품 저장소의 `docs/specs/<feature>.md` 에 두는 것을 권장합니다.

## 작성 원칙 (AI-리더블)
- **구조 고정**: 템플릿의 섹션·프론트매터를 유지. AI가 필드로 파싱할 수 있어야 함.
- **디자인 시스템 참조로 표현**: 화면을 자연어로만 쓰지 말고, HDS 컴포넌트/토큰 이름으로 명세한다.
  예: "확인 버튼(`Button` variant=primary), 간격 `space.inset-md`". → 프로토타입/퍼블이 바로 매핑.
- **수용 기준(Acceptance)은 검증 가능하게**: 상태(empty/loading/error) 포함, 체크 가능한 문장.
- **미해결(Open questions)을 분리**해 결정 대기 항목을 명시.

## 시작 전
요구사항이 아직 흐릿하면 먼저 `/hds-planning:grill` 로 결정을 다진다. 이 스킬은 그 결정들을 문서로 **합성만** 한다(재인터뷰 금지).

## 워크플로
1. 템플릿으로 초안 생성 → 문제정의·사용자·플로우·화면·수용기준 채우기.
2. 화면 명세 시 `hds-design` 의 `registry.json`/`usage/` 를 조회해 존재하는 컴포넌트·패턴으로 표현.
3. 없는 컴포넌트가 필요하면 "신규 컴포넌트 후보"로 표시하고 `/hds-design:component-catalog` 로 연결.
4. 설계가 확정되면 `/hds-planning:prototype` 로 프로토타입 생성.

## 완성 후
`/hds-planning:spec-review` 로 품질 게이트를 통과시킨 뒤 `/hds-design:handoff` 로 디자인/퍼블에 전달한다.

## 업데이트 관리
- 변경 시 프론트매터 `version`·`updated` 갱신, 변경 요지를 문서 상단 changelog에 남긴다.
- 설계서는 살아있는 문서다. 구현과 어긋나면 설계서를 먼저 고친다.
