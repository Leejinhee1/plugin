---
name: Checkbox
status: stable
since: 3.1.0
figma: "🧱 Template / checkbox (691:3124)"
---

# Checkbox 스펙

하나 이상의 선택을 할 수 있는 폼 요소. (HES 정의 그대로)

## Variants
HES 원본 컴포넌트 매핑:
| variant | HES 원본 | 형태 | 용도 |
| :-- | :-- | :-- | :-- |
| `all` | `checkAll` / `chkL` | 원형 채움 + 체크 | **전체선택 시에만 사용** (HES 규칙) |
| `basic` | `check` / `chkM` | 원형 라인 + 체크 | 1depth 기본 체크 |
| `sub` | `checkSub` / `chkS` | 체크마크만 | 2depth(하위 항목) 체크 |
| `round` | `checkRound` | 라벨+체크를 라운드 칩으로 | 인라인 필터·옵션 선택 |
| `button` | `chkBtn` | 박스형 버튼 | 폼 안의 강조 선택지 |

> `btn_star`(즐겨찾기 별)와 `Currency/select_currency`(통화 선택 카드)는 HES에선 checkbox 페이지에 있지만 성격이 달라 HES에선 별도 패턴으로 취급 — Checkbox로 만들지 말 것.

## Sizes
아이콘 24×24 고정(HES `comp/checkbox/sizing/default`). 라벨 간격 8px(HES `comp/checkbox/chkM/gap`).
라벨 타이포는 variant가 결정: `all` 18px bold · `basic` 16px · `sub` 14px.

## States
default · checked · disabled · disabled+checked · focus-visible(포커스 링)

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `variant` | `all \| basic \| sub \| round \| button` | `basic` | 형태 |
| `checked` / `defaultChecked` | `boolean` | — | 제어/비제어 |
| `disabled` | `boolean` | `false` | 비활성 |
| `onChange` | `(e) => void` | — | 네이티브 change |
| `children` | `ReactNode` | — | 라벨 (없으면 `aria-label` 필수) |

## 토큰 매핑 (하드코딩 금지)
- 체크 시 채움/테두리: `color.brand.default` · 마크: `color.fg.onBrand`
- 미체크 테두리: `color.border.strong` · 배경: `color.bg.base`
- 라벨: `color.fg.base`, 미체크 `sub` 마크: `color.border.strong`
- disabled: 컨트롤+라벨 opacity 40% (HES는 전용 연한 틸이지만 semantic 토큰이 없어 opacity로 대응)
- `round`/`button` 테두리: 선택 시 `color.brand.default`, 미선택 `color.border.base` · 반경: `dimension.radius.full`/`dimension.radius.sm`
- 포커스 링: `color.focus.ring` · 전환: `duration.fast` + `cubicBezier.standard`

## 접근성
- 네이티브 `<input type="checkbox">` 를 시각적으로만 숨겨 유지(스크린리더·키보드 무료 확보)
- 라벨 없는 싱글 타입은 `aria-label` 필수
- 전체선택(`all`)이 하위 항목과 연동될 때 일부만 선택되면 `indeterminate` 상태를 코드에서 설정

## 하지 말 것
- `all` variant를 전체선택 이외 용도로 사용 금지 (HES 규칙)
- 단일 선택 UI에 Checkbox 사용 금지 (→ Radio)
- 즐겨찾기 토글을 Checkbox로 구현 금지 (→ 별도 아이콘 버튼)
