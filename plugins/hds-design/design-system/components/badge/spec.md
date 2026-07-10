---
name: Badge
status: stable
since: 1.1.0
---

# Badge 스펙

상태·분류·개수를 짧은 텍스트로 보여주는 비인터랙티브 표시 요소. 클릭·포커스 대상이 아니며 항상 `<span>` 으로 렌더링한다.

## Variants
| variant | 용도 | 의미 |
| :-- | :-- | :-- |
| `neutral` | 중립 상태·분류 태그 | 정보 |
| `brand` | 강조하고 싶은 중립 상태(예: 진행 중) | 브랜드 강조 |
| `success` | 완료·정상 | 완료 |
| `warning` | 주의 필요 | 주의 |
| `danger` | 오류·위험 | 파괴/오류 |

`color.md` 원칙에 따라 success/warning/danger 는 의미가 고정되어 있으며 장식 목적으로 쓰지 않는다.

## Sizes
`sm`(20px 높이) · `md`(24px 높이, 기본)

## States
default 만 존재(비인터랙티브 — hover/active/focus 상태 없음)

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `variant` | `neutral \| brand \| success \| warning \| danger` | `neutral` | 의미·색상 |
| `size` | `sm \| md` | `md` | 크기 |
| `children` | `ReactNode` | — | 뱃지 텍스트(또는 텍스트+아이콘) |

나머지 `<span>` 속성(`aria-label`, `title` 등)은 그대로 전달된다.

## 토큰 매핑 (하드코딩 금지)
| variant | 배경 | 전경 |
| :-- | :-- | :-- |
| `neutral` | `color.bg.muted` | `color.fg.muted` |
| `brand` | `color.brand.subtle` | `color.brand.default` |
| `success` | `color.feedback.success` | `color.fg.onBrand` |
| `warning` | `color.feedback.warning` | `color.fg.onBrand` |
| `danger` | `color.feedback.danger` | `color.fg.onBrand` |

- 반경: `dimension.radius.full`(알약형)
- 안쪽 여백: 좌우만 사용, Tailwind `px-*` 로 크기별 지정(Button 과 동일 관례)
- 전환: 상태 변화가 없으므로 `duration`/`easing` 토큰 불필요

## 접근성
- 색만으로 의미를 전달하지 않는다 — 항상 텍스트(또는 스크린리더가 읽을 수 있는 라벨)를 함께 표기. 아이콘만 넣는 경우 `aria-label` 필수
- 인터랙티브 요소가 아니므로 `tabIndex`, `onClick` 을 부여하지 않는다(클릭 가능한 필터 칩이 필요하면 별도 컴포넌트를 만들 것)
- 개수(카운트) 배지가 실시간으로 바뀌는 경우, 주변 문맥에 `aria-live` 는 배지가 아니라 상위 컨테이너에 부여해 과도한 알림을 피한다

## 하지 말 것
- Badge 에 `onClick` 을 달아 버튼처럼 사용 금지(→ Button 사용)
- success/warning/danger 의미를 장식용으로 오용 금지(예: 임의로 danger 색을 강조 목적으로 사용)
- 토큰 대신 색상 직접 입력 금지
