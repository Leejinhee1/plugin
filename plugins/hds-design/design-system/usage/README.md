# 화면별 사용 사례 (Screen Patterns)

개별 컴포넌트를 넘어, **화면 단위의 조합 패턴**을 축적하는 공간입니다.
기획의 프로토타입과 퍼블의 화면 구현이 여기서 출발합니다.

## 무엇을 기록하나
- 로그인, 목록/상세, 폼, 빈 상태(empty), 오류/로딩 상태 등 반복되는 화면 유형
- 각 패턴: 목적 · 사용 컴포넌트 · 레이아웃/간격 토큰 · 반응형 규칙 · 접근성 체크

## 템플릿
```
usage/screens/<pattern-name>.md
---
pattern: <이름>
components: [button, ...]
---
## 목적
## 구성 (컴포넌트 + 레이아웃)
## 반응형
## 상태 (empty / loading / error)
## 접근성
```

> 새 화면 패턴은 `/hds-planning:prototype` 이 프로토타입을 만들 때 근거로 사용합니다.
> 반복되는 조합이 보이면 개별 화면에 남기지 말고 여기에 패턴으로 승격시키세요.

## 축적된 패턴

| 패턴 | 파일 | 사용 컴포넌트 | 요약 |
| :-- | :-- | :-- | :-- |
| 로그인 / 온보딩 진입 | [`screens/login.md`](./screens/login.md) | input, button | 이메일 한 필드 로그인. 오류(errorMessage)·로딩(Button loading) 상태 포함 |
| 목록 → 상세 | [`screens/list-detail.md`](./screens/list-detail.md) | card, badge, modal, button | 주간 플랜 일정을 Card 리스트 + Badge 상태로 보여주고 Modal로 상세 확인 |
| 생성 / 편집 폼 | [`screens/form.md`](./screens/form.md) | input, button | 일정 추가/수정 폼. 유효성 검사 흐름과 저장 중 상태 |
| 공통 상태 패턴 | [`screens/feedback-states.md`](./screens/feedback-states.md) | button, card, badge, input | empty/loading/error 공통 규칙 — 카피, 스켈레톤·스피너 기준, 재시도 버튼 |
