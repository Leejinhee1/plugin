---
name: Toast
status: stable
since: 3.1.0
figma: "🧱 Template / toast (691:3065)"
---

# Toast 스펙

텍스트 메시지를 통한 간단한 피드백 제공하는 UI. (HES 정의 그대로)

## Variants
| variant | HES 원본 | 형태 | 사라짐 |
| :-- | :-- | :-- | :-- |
| `toast` | `Toast` | 어두운 박스 + 메시지 | 일정 시간 후 자동 |
| `snackbar` | `Snackbar` | 어두운 박스 + 메시지 + 닫기(X) | 닫기 액션으로 |

## Placement (HES property)
- `align`: `center`(toast 기본) · `left`(snackbar 기본, HES 규칙상 snackbar 는 왼쪽 정렬)
- `position`: `bottom`(기본) · `top`
- 화면 가장자리 간격(HES 변수, 360 뷰포트 기준):
  | 상황 | 간격 |
  | :-- | :-- |
  | bottom 기본 | 24px (`toast/spacing/bottom`) |
  | bottom + 하단고정버튼 | 84px (`toast/spacing/withFixedBtn`) |
  | top 기본 | 102px (`toast/spacing/top`) |
  | top + 하단고정탭 | 150px (`toast/spacing/withFixedTab`) |

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `open` | `boolean` | 필수 | 표시 여부(제어형) |
| `message` | `ReactNode` | 필수 | 메시지(1~3줄) |
| `variant` | `toast \| snackbar` | `toast` | 닫힘 방식 |
| `align` | `center \| left` | variant 따라 | 텍스트 정렬 |
| `position` | `bottom \| top` | `bottom` | 화면 내 위치 |
| `hasFixedBtn` / `hasFixedTab` | `boolean` | `false` | 하단고정 요소와 겹침 회피 간격 |
| `duration` | `number` | `3000` | toast 자동 닫힘(ms) |
| `onClose` | `() => void` | 필수 | 닫힘 요청 |

## 토큰 매핑 (하드코딩 금지)
- 배경: `color.bg.inverse` (HES 원본은 grayScale.90 톤 — semantic 반전 배경으로 매핑) · 텍스트: `color.fg.onInverse`
- 반경: `dimension.radius.sm` · 안쪽 여백: `space.inset-md`
- 스낵바 닫기 버튼: 터치 영역 44px(HES `comp/snackbar/button/width`)
- 등장/퇴장: `duration.base` + `cubicBezier.emphasized`

## 접근성
- 컨테이너 `role="status"` + `aria-live="polite"` — 등장 시 스크린리더가 읽음
- 닫기 버튼 `aria-label="닫기"`
- 자동 닫힘 시간은 3초 이상, 메시지가 길면 연장
- 토스트에 유일한 행동 수단(실행 취소 등)을 담지 않는다 — 사라지면 접근 불가

## 하지 말 것
- 여러 토스트 동시 쌓기 금지 — 마지막 메시지로 교체
- 긴 안내·오류 상세를 토스트로 전달 금지 (→ Modal/인라인 메시지)
- 하단고정버튼 위에 겹쳐 띄우기 금지 — `hasFixedBtn` 으로 간격 확보(HES 규칙)
