---
name: Tooltip
status: stable
since: 3.1.0
figma: "🧱 Template / tooltip (691:3064)"
---

# Tooltip 스펙

간단한 추가 정보를 제공하는 floating UI. 부가 설명을 필요로 하는 타겟 **클릭 시 하단에 노출**. (HES 정의 그대로)

## Variants
| variant | HES 원본 | 형태 |
| :-- | :-- | :-- |
| 기본 | `tooltip` | 본문 텍스트(+서브 텍스트) + 닫기(X) |
| 타이틀형 | `tooltipTitle` | 타이틀 + 본문 + 서브 + 닫기 — `title` prop 유무로 결정 |

## Placement (HES property)
- `position`: `center`(기본) · `left` · `right` — 트리거 버튼 위치 기준. 트리거가 화면 왼쪽에 가까우면 `left` 정렬(HES 규칙).
- 크기: **min-width 150px / max-width 260px** (HES 규칙).

## States
closed · open · focus-visible(닫기 버튼)

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `open` / `onClose` | `boolean` / `() => void` | 필수 | 제어형 |
| `text` | `ReactNode` | 필수 | 기본 툴팁 텍스트(HES `txt_tooltip`) |
| `subText` | `ReactNode` | — | 더 작은 서브 텍스트(HES `txt_sub`) |
| `title` | `ReactNode` | — | 지정 시 타이틀형(HES `tit_tooltip`) |
| `position` | `center \| left \| right` | `center` | 트리거 기준 좌우 정렬 |
| `children` | `ReactNode` | 필수 | 트리거(주로 ⓘ 아이콘 버튼) |

## 토큰 매핑 (하드코딩 금지)
- 배경: `color.bg.base` · 테두리: `color.border.base` + 그림자
- 타이틀·본문: `color.fg.base`(타이틀 bold) · 서브 텍스트: `color.fg.muted`
- 반경: `dimension.radius.sm` · 안쪽 여백: `space.inset-md`
- 등장: `duration.fast` + `cubicBezier.standard`

## 접근성
- 클릭형(닫기 버튼 보유)이므로 hover 전용 tooltip 패턴이 아님 — 트리거는 `<button aria-expanded>`, 패널은 `role="note"` 로 트리거의 `aria-describedby` 연결이 아닌 명시적 열고 닫기
- 닫기 버튼 `aria-label="닫기"`, ESC 로도 닫힘
- 트리거가 아이콘 전용이면 `aria-label`(예: "우대금리 안내") 필수
- 필수 정보(수수료·한도 등 의사결정 필수값)는 툴팁에 숨기지 않는다

## 하지 말 것
- 긴 설명·리스트·링크 묶음을 툴팁에 넣기 금지 (→ BottomSheet/Modal)
- max-width 260px 초과 커스텀 금지 (HES 규칙)
- hover 에서만 열리게 구현 금지 — 모바일 터치에서 접근 불가
