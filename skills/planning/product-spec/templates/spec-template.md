---
spec: <기능 이름>
status: draft            # draft | review | approved | shipped
owner: <기획자>
version: 0.1.0
updated: <YYYY-MM-DD>
related_components: []   # 예: [button, ...] — HES registry의 name
---

# <기능 이름> 제품 설계서

## 0. Changelog
- 0.1.0 (<date>): 초안

## 1. 문제 정의 (Why)
- 배경/문제:
- 이 기능이 해결하는 것:
- 성공 지표(측정 가능):

## 2. 사용자 & 시나리오 (Who)
- 주요 사용자:
- 핵심 시나리오(User story): "…로서 …하고 싶다, 그래야 …"

## 3. 범위 (Scope)
- In:
- Out(이번 범위 아님):

## 4. 사용자 플로우 (Flow)
1. …
2. …
> 분기·예외 경로 포함.

## 5. 화면 명세 (HES 참조로 기술)
각 화면을 **HES 컴포넌트·토큰 이름**으로 명세한다. (프로토타입/퍼블이 바로 매핑)

### 화면: <이름>
- 목적:
- 구성:
  - <영역> — `Button` (variant=primary), 라벨 "저장"
  - 간격: `space.stack-md`, 컨테이너 패딩 `space.inset-lg`
- 상태:
  - empty:
  - loading:
  - error:
- 반응형: (모바일/데스크톱 차이)
- 신규 컴포넌트 후보: (없으면 "없음")

## 6. 수용 기준 (Acceptance — 검증 가능하게)
- [ ] …
- [ ] 키보드만으로 전체 플로우 완료 가능
- [ ] 각 상태(empty/loading/error) 표시

## 7. 미해결 질문 (Open questions)
- [ ] …

## 8. 참고
- 디자인:
- 관련 설계서:
