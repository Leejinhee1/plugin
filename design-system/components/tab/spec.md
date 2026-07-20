---
name: Tab
status: stable
since: 3.1.0
figma: "🧱 Template / tab (691:3082)"
---

# Tab 스펙

카테고리 변경이나 한 페이지 내의 연관 있는 정보의 그룹핑. (HES 정의 그대로)

## Variants
| variant | HES 원본 | 형태 | 용도 |
| :-- | :-- | :-- | :-- |
| `underline` | `tab` / `tab2` / `tabScroll` | 텍스트 + 하단 인디케이터 | 페이지 상단 고정 탭 |
| `round` | `tabRound` | 필(pill) 버튼 나열 | 콘텐츠 중간·sticky 필터 탭 |
| `toggle` | `tabToggle` | 2분할 세그먼트 | 두 보기 사이 전환 |

- `underline`: 2~4개는 균등 분할(HES `tab` property: 개수 3|4, `tab2`), 5개 이상이면 가로 스크롤(`tabScroll`) — `items` 수로 자동 결정.
- `round`: `isSticky` 지원(HES property). sticky 로 뜰 때는 그룹 배경 없음(HES 규칙).
- `toggle`: 항목당 `subLabel` 지원(HES `SubText` — 예: eng 병기).

## States
selected · default · focus-visible · disabled(항목 단위)

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `variant` | `underline \| round \| toggle` | `underline` | 형태 |
| `items` | `{ value; label; subLabel?; disabled? }[]` | 필수 | 탭 목록 (`toggle` 은 2개) |
| `value` / `onChange` | `string` / `(v) => void` | 필수 | 제어형 |
| `isSticky` | `boolean` | `false` | `round` 전용 — 상단 고정 |
| `aria-label` | `string` | 필수 | 탭 그룹 이름 |

패널 연결은 소비 측에서 `id`/`aria-controls` 로 구성 (레퍼런스 구현은 tablist만 담당).

## 토큰 매핑 (하드코딩 금지)
- underline 선택: 텍스트 `color.fg.base` bold + 인디케이터 2px `color.fg.base` · 미선택: `color.fg.muted` · 트랙 하단선: `color.border.base`
- round 선택: 배경 `color.brand.default` + 텍스트 `color.fg.onBrand` · 미선택: 배경 `color.bg.subtle` + 텍스트 `color.fg.muted` · 반경: `dimension.radius.full`
- toggle 선택: 배경 `color.bg.base` + 테두리 `color.border.strong` + bold · 미선택: 배경 `color.bg.subtle` + `color.fg.muted` · 반경: `dimension.radius.sm`
- 포커스 링: `color.focus.ring` · 전환: `duration.fast` + `cubicBezier.standard`

## 접근성
- `role="tablist"` / `role="tab"` + `aria-selected`, 좌우 방향키로 이동(roving tabindex)
- 선택 탭만 tab 순서에 포함(`tabIndex 0`), 나머지는 `-1`
- 스크롤 탭은 선택 항목이 보이도록 `scrollIntoView`

## 하지 말 것
- 페이지 이동(라우팅)에 underline 탭 사용 시 `tab` 대신 링크 시멘틱 유지 — 정보 그룹핑에만 tab role
- `toggle` 에 3개 이상 항목 금지 (→ `round`)
- 탭 5개 이상을 균등 분할로 욱여넣기 금지 — 스크롤 타입 사용(HES 규칙)
