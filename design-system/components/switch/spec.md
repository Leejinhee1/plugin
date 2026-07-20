---
name: Switch
status: stable
since: 3.1.0
figma: "🧱 Template / switch (691:3122)"
---

# Switch 스펙

즉각적인 상태 변경을 하는 on/off 와 같은 두 가지 옵션을 선택하는 폼 요소. (HES 정의 그대로)

## Variants
단일형만 존재(HES `switch`, 레이블 없는 싱글 타입). 라벨이 필요하면 바깥에서 행 레이아웃으로 조합.

## Sizes
트랙 48×24 고정(HES 원본 치수). 썸(원) 20×20, 이동 거리 24px.

## States
default(off) · checked(on) · disabled · disabled+checked · focus-visible

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `checked` / `defaultChecked` | `boolean` | — | 제어/비제어 |
| `disabled` | `boolean` | `false` | 비활성 |
| `onChange` | `(e) => void` | — | 네이티브 change |
| `aria-label` 또는 `aria-labelledby` | `string` | 필수 | 레이블 없는 컨트롤이므로 |

## 토큰 매핑 (하드코딩 금지)
- on 트랙: `color.brand.default` · 썸: `color.fg.onBrand`
- off 트랙: `color.bg.muted` (HES 원본은 bg/35 — semantic 램프에서 가장 가까운 값. 대비가 부족하면 `color.border.strong` 검토)
- disabled: opacity 40%
- 반경: `dimension.radius.full` · 포커스 링: `color.focus.ring`
- 전환: `duration.fast` + `cubicBezier.standard`

## 접근성
- 네이티브 `<input type="checkbox" role="switch">` 사용
- 시각 레이블이 없으므로 `aria-label`(또는 연결된 `aria-labelledby`) 필수
- 토글 즉시 효과가 적용되는 항목에만 사용 — 저장 버튼이 따로 있으면 Checkbox

## 하지 말 것
- 폼 제출로 반영되는 항목에 Switch 사용 금지 (→ Checkbox)
- on/off 이외의 의미(예: 탭 전환)에 사용 금지 (→ Tab `toggle`)
- 트랙 안에 ON/OFF 텍스트 삽입 금지 (HES 형태 아님)
