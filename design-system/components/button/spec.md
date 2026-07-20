---
name: Button
status: stable
since: 1.0.0
figma: "🧱 Template / Buttons (691:3084)"
---

# Button 스펙

사용자의 주요 행동을 트리거하는 기본 인터랙티브 요소.

## Variants
| variant | 용도 | 화면당 개수 |
| :-- | :-- | :-- |
| `primary` | 화면의 핵심 액션 | 1개 권장 |
| `secondary` | 보조 액션 | 다수 허용 |
| `ghost` | 낮은 강조(툴바 등) | 다수 허용 |
| `danger` | 파괴적 액션(삭제 등) | 신중히 |

## Sizes
`sm`(32px) · `md`(40px, 기본) · `lg`(48px)

## States
default · hover · active · focus-visible(포커스 링 필수) · disabled · loading

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `variant` | `primary \| secondary \| ghost \| danger` | `primary` | 시각적 강조 |
| `size` | `sm \| md \| lg` | `md` | 크기 |
| `disabled` | `boolean` | `false` | 비활성 |
| `loading` | `boolean` | `false` | 진행 중(스피너, 클릭 차단) |
| `leadingIcon` / `trailingIcon` | `ReactNode` | — | 아이콘 슬롯 |

## 토큰 매핑 (하드코딩 금지)
- 배경: `color.brand.default` → hover `color.brand.hover` → active `color.brand.active`
- 전경: `color.fg.onBrand`
- 반경: `dimension.radius.md`
- 안쪽 여백: `space.inset-md`
- 포커스 링: `color.focus.ring`
- 전환: `duration.fast` + `cubicBezier.standard`

## 접근성
- 네이티브 `<button>` 사용, 아이콘 전용 버튼은 `aria-label` 필수
- `loading` 시 `aria-busy="true"`, 클릭 비활성
- 포커스 링은 `:focus-visible` 로 노출

## 하지 말 것
- 링크 이동에 Button 사용 금지(→ Link 사용)
- primary 2개 이상 배치 금지
- 토큰 대신 색상 직접 입력 금지
