---
pattern: list-detail
components: [card, badge, modal, button]
---

# 목록 → 상세 (거래 내역 목록)

거래 내역 목록을 `Card` 리스트로 보여주고, 항목을 선택하면 `Modal`로 상세를 여는 패턴. "결제 브리핑"의 최근 거래 요약, 전체 거래 내역 화면에서 공통으로 쓴다.

## 목적

- 여러 거래를 한눈에 훑고, 상태(적립 완료/확인 필요/결제 실패 등)를 즉시 구분할 수 있게 한다.
- 상세 확인이 필요할 때만 흐름을 잠깐 멈추는 가벼운 상호작용(Modal)으로 처리해, 목록 맥락을 잃지 않게 한다.
- 내역이 없을 때도 다음 행동을 제안해 화면이 막다른 길처럼 느껴지지 않게 한다(voice-tone `빈 상태` 톤).

## 구성 (컴포넌트 + 레이아웃)

### 목록 (리스트 뷰)

```
[ 목록 제목 (heading) ]
  Card (variant=default, padding=md)         ┐
    CardHeader: 제목 + Badge(상태)            │ space.stack-sm 로 헤더/바디 분리
    CardBody: 시간·장소 등 부가 정보(fg.muted) ┘
  ── space.stack-sm (카드 간 간격) ──
  Card (variant=default, padding=md)
    ...
```

- 리스트의 각 항목은 `Card`(`variant="default"`, `padding="md"`) 하나. 오늘 거래 중 확인이 필요한 1건만 `variant="elevated"`로 강조해도 좋다(elevated 남용 금지 — 화면당 1~2개).
- `CardHeader` 안에 가맹점명(`CardTitle as="h3"`)과 오른쪽 정렬된 `Badge`를 함께 배치.
  - `Badge` `variant`는 상태 의미에 맞춰 고정 매핑한다: 예정 `neutral`, 적립 `brand`, 완료 `success`, 확인 필요 `warning`, 취소/실패 `danger`.
  - `Badge` `size="sm"`(목록처럼 밀도가 높은 곳) 기본.
- `CardBody`에 결제 시각(`오후 3:00`), 금액·적립 등 보조 정보를 `color.fg.muted`로 표기.
- 카드 자체는 인터랙티브 요소가 아니므로, 클릭 가능하게 하려면 `CardHeader` 전체를 감싸는 네이티브 `<button>`으로 구현하고 `div onClick`만 붙이지 않는다.
- 카드 간 간격: `space.stack-sm`, 리스트 상단과 제목 사이: `space.stack-md`.

### 상세 (Modal)

목록 항목을 선택하면 `Modal`(`size="md"`, 콘텐츠가 많으면 `lg`)을 연다.

```
Modal(open, onClose, title="가맹점명", size="md")
  본문: 결제 시각 · 금액 · 적립 · 메모 등 상세 필드 (space.stack-md 간격)
  footer: [Button variant=ghost "닫기"]  [Button variant=primary "영수증 보기"]
```

- `title`은 가맹점명을 그대로 사용(필수 prop, `aria-labelledby` 자동 연결).
- `footer`는 우측 정렬 기본 배치를 따르고, 버튼 간 간격은 `space.stack-sm`.
- 취소·삭제처럼 되돌리기 어려운 액션이 상세 안에 있다면 해당 버튼만 `variant="danger"`로 구분하고, 삭제 확인은 별도의 확인 모달(중첩 금지 — 먼저 닫고 새로 연다)로 분리한다.
- 콘텐츠가 많아 목록형 상세(예: 하루 전체 거래)가 필요하면 `size="lg"`를 사용.

## 반응형

- 모바일: 목록은 세로 1열. `Modal`은 화면 폭에 맞춰 `size="sm"`~`md"` 범위에서 실제 렌더 폭이 뷰포트에 맞게 줄어들며(최대 너비 제한이므로 좁은 화면에서는 자동으로 화면 폭에 맞춰짐), 오버레이 안쪽 여백(`space.inset-md`)으로 가장자리 여유를 유지한다.
- 태블릿/데스크톱: 목록을 2열 그리드로 배치 가능(카드 간 가로 간격도 `space.stack-sm`). 또는 좌측 목록 + 우측 상세 패널의 마스터-디테일 레이아웃으로 확장할 수 있으며, 이 경우 Modal 대신 상세 영역에 `Card`(`variant="elevated"`)를 직접 렌더링하는 변형을 쓴다(화면별로 어떤 방식을 쓸지는 콘텐츠 밀도에 따라 선택하되 한 화면 내에서는 일관되게).

## 상태 (empty / loading / error)

- **빈 상태(empty)**: 거래 내역이 없을 때, 목록 영역 전체를 하나의 안내 블록으로 대체한다.
  - 문구: "아직 적립 내역이 없어요. 첫 결제부터 자동으로 쌓아드릴게요." (voice-tone 빈 상태 예시 그대로 적용)
  - 아래에 `Button`(`variant="primary"`) "카드 등록"으로 다음 행동을 바로 제안한다.
- **로딩(loading)**: 목록을 불러오는 동안 `Card` 형태의 스켈레톤(테두리·반경은 Card와 동일 토큰, 내부는 회색 블록)을 2~3개 표시해 레이아웃 흔들림(shift)을 막는다. 상세 저장/삭제 등 Modal 내부 액션 진행 중에는 `footer`의 해당 `Button`에 `loading={true}`를 준다.
- **오류(error)**: 목록을 불러오지 못하면 카드 대신 오류 안내 블록을 노출한다.
  - 문구: "거래 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
  - `Button`(`variant="secondary"`, "다시 시도")를 함께 배치. 전체 화면을 막는 파괴적 실패가 아니므로 `danger` variant는 쓰지 않는다.

## 접근성

- `CardHeader`를 감싸는 버튼에는 가맹점명과 상태를 함께 읽을 수 있도록, 시각적으로는 `Badge` 텍스트가 있으므로 추가 `aria-label` 없이도 스크린리더가 "가맹점명, 배지 텍스트" 순으로 읽는다 — 배지 텍스트가 항상 화면에 노출되어야 하는 이유이기도 하다(색만으로 상태 전달 금지).
- `Modal`이 열리면 포커스가 패널 내부 첫 포커스 가능 요소(보통 닫기 버튼 또는 첫 액션 버튼)로 이동하고, 닫히면 목록에서 열었던 카드 버튼으로 포커스가 복귀한다(Modal 스펙 기본 동작 — 별도 구현 불필요, 연결만 확인).
- `Modal` 내부에서 Tab 이동은 패널 밖으로 나가지 않아야 한다(포커스 트랩).
- 목록이 비동기로 갱신될 때(예: 상세에서 상태를 변경하고 돌아왔을 때) 목록 컨테이너에 `aria-live="polite"`를 부여해 변경을 알리되, 개별 `Badge`에는 `aria-live`를 달지 않는다(Badge 스펙 — 과도한 알림 방지).
- ESC 키로 `Modal`을 닫을 수 있어야 하며, 삭제 확인처럼 실수로 닫히면 안 되는 화면에서는 `closeOnOverlayClick={false}`로 조정한다.
