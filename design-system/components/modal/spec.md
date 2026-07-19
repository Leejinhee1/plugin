---
name: Modal
status: stable
since: 1.1.0
---

# Modal 스펙

현재 화면 흐름을 일시 정지시키고 사용자의 응답이 필요한 콘텐츠를 표시하는 오버레이 다이얼로그. 알림 설정, 삭제 확인, 상세 보기 등에 사용.

## Sizes
| size | 최대 너비 | 용도 |
| :-- | :-- | :-- |
| `sm` | 384px | 확인/취소 같은 짧은 결정 |
| `md`(기본) | 448px | 폼 1~2개 필드, 일반 설정 |
| `lg` | 512px | 목록·상세 등 콘텐츠가 많은 경우 |

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `open` | `boolean` | — | 표시 여부(제어 컴포넌트) |
| `onClose` | `() => void` | — | 닫기 요청 콜백(ESC·오버레이 클릭·닫기 버튼에서 호출) |
| `title` | `ReactNode` | — | 다이얼로그 제목(필수, `aria-labelledby` 연결) |
| `children` | `ReactNode` | — | 본문 |
| `footer` | `ReactNode` | — | 액션 버튼 영역(우측 정렬) |
| `size` | `sm \| md \| lg` | `md` | 크기 |
| `closeOnOverlayClick` | `boolean` | `true` | 오버레이 클릭 시 닫기 허용 여부. 파괴적 액션 확인 등 실수로 닫히면 안 되는 경우 `false` |

## 동작
- **ESC 닫기**: `open` 상태에서 `Escape` 키 입력 시 `onClose` 호출.
- **오버레이 클릭 닫기**: `closeOnOverlayClick`(기본 `true`)일 때, 오버레이 배경(패널 바깥)을 클릭하면 `onClose` 호출. 패널 내부 클릭·드래그는 닫히지 않음.
- **포커스 이동**: 열릴 때 열리기 직전의 활성 요소를 기억해 두고, 패널 내부의 첫 포커스 가능 요소(없으면 패널 자체)로 포커스를 이동.
- **포커스 복귀**: 닫힐 때(언마운트 시) 열기 직전 활성 요소로 포커스를 되돌린다.
- **포커스 트랩**: 열려 있는 동안 `Tab`/`Shift+Tab` 이 패널 내부 포커스 가능 요소 범위를 벗어나지 않도록 순환시킨다.
- **렌더링**: `document.body` 에 포털로 렌더링(레이아웃 컨텍스트로부터 분리, z-index 충돌 방지).

## 등장 모션
- 오버레이: `opacity` 트랜지션, `duration.base` + `cubicBezier.emphasized`.
- 패널: `opacity` + `scale/translateY` 트랜지션, 동일 토큰.
- `prefers-reduced-motion: reduce` 환경에서는 트랜지션을 생략한다(Tailwind `motion-reduce:transition-none` 사용).
- 퇴장 애니메이션은 이 레퍼런스 범위에 포함하지 않는다(단순화). 필요 시 상위 컴포넌트에서 unmount 타이밍을 지연시켜 구현.

## 토큰 매핑 (하드코딩 금지)
- 오버레이 배경: `color.bg.overlay` (이번에 추가된 토큰, neutral.900 유래 반투명값)
- 패널 배경: `color.bg.base`
- 패널 테두리: `color.border.base`
- 반경: `dimension.radius.lg`
- 패널 안쪽 여백: `space.inset-lg`
- 오버레이 안쪽 여백(뷰포트 가장자리 여유): `space.inset-md`
- 제목/본문/푸터 간 간격: `space.stack-md`, 푸터 내부 버튼 간격: `space.stack-sm`
- 전환: `duration.base` + `cubicBezier.emphasized`

## 접근성
- `role="dialog"`, `aria-modal="true"`.
- `aria-labelledby` 는 `title` 이 렌더링되는 요소의 `id` 를 가리킨다(내부에서 `useId` 로 자동 생성).
- 본문에 설명 텍스트가 있다면 `aria-describedby` 연결을 권장(추가 구현은 사용처에서).
- 닫기 버튼은 아이콘 전용이라면 `aria-label="닫기"` 필수.
- 배경 스크롤은 열려 있는 동안 잠그는 것을 권장(레이아웃에 따라 사용처에서 `overflow: hidden` 처리).

## 하지 말 것
- `onClose` 없이 닫을 방법이 없는 모달 금지(ESC·오버레이·명시적 버튼 중 최소 하나는 항상 제공)
- 파괴적 액션 확인 모달에서 `closeOnOverlayClick` 기본값을 그대로 둬서 실수로 닫히게 방치하지 말 것 — 상황에 맞게 `false` 로 조정
- 오버레이 색을 `rgba()` 로 화면마다 다르게 지정 금지 — 항상 `color.bg.overlay` 토큰 사용
- 모달 안에 모달을 중첩하지 말 것(포커스 트랩 충돌)
