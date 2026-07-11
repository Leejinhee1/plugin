---
name: grill
description: 설계서를 쓰기 전, 요구사항을 1문1답으로 집요하게 인터뷰해 결정을 다집니다. 기획 방향이 아직 흐릿하거나 "요구사항부터 정리하자"고 할 때 사용. Use before writing a product spec, when requirements are still fuzzy and decisions need to be interrogated one at a time.
---

# 요구사항 그릴 (Grilling)

설계서를 쓰기 전 결정을 하나씩 확정한다. 목적: `/hds-planning:product-spec` 이 재질문 없이 결정들을 그대로 옮겨 담기만 하면 되게 만든다.

## 규칙
- 질문은 **한 번에 하나만** 한다. 다음 질문은 답을 받은 뒤에 던진다.
- 각 질문에 **추천 답을 먼저 제시**하고, 사용자가 동의하거나 고치게 한다.
- 결정 트리를 따라 내려가며, 앞선 답을 다음 질문의 전제로 삼는다(의존성 순서).
- 코드베이스에서 확인 가능한 사실은 직접 조회해서 제시한다. 사용자에게는 **결정**만 묻는다.

## 컴포넌트·화면 질문 전 필수 조회
③ 화면·상태를 묻기 전에 반드시 먼저 읽는다:
- `hds-design`의 `design-system/components/registry.json` — 존재하는 컴포넌트·토큰
- `design-system/usage/screens/` — 화면 패턴(login/list-detail/form/feedback-states)

조회한 결과 이미 있는 것은 "이미 있음"으로 제시하고, 없는 것만 "신규 컴포넌트 후보?"로 묻는다.

## 질문 축 (이 순서로 내려간다)
1. **Why** — 누가 쓰는가 / 지금 어떻게 하고 있는가 / 무엇을 하게 하고 싶은가 / 왜 지금인가 / 성공을 뭘로 재는가
2. **범위** — MVP에 들어갈 것 / 이번엔 빼는 것(Out of scope)
3. **화면·상태** — 필요한 화면들, 각 화면의 empty/loading/error
4. **엣지케이스** — 실패·동시성·권한 등 경계 조건

## 종료
네 축이 모두 끝나면 합의된 결정 목록을 요약해 제시한다. 사용자가 승인하면:
→ "이제 `/hds-planning:product-spec` 으로 설계서를 합성한다. 재인터뷰 없이 이 결정들을 그대로 옮긴다."
