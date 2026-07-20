---
name: Select
status: stable
since: 3.1.0
figma: "🧱 Template / select (691:3109)"
---

# Select 스펙

여러 옵션 중 하나를 선택. 트리거를 터치하면 옵션 목록이 **바텀시트**(HES `layer/layerSelect`)로 열린다. (HES 정의 그대로)

## Variants
| variant | HES 원본 | 형태 |
| :-- | :-- | :-- |
| `line` | `wrapSel` | 캡션 라벨 + 값 + 우측 셰브런, 하단 1px 언더라인 |
| `box` | `wrapSelBox` | 옅은 배경 박스(radius) 안에 라벨/값/셰브런 |

기간 입력(`boxDate`, 시작일 ~ 종료일)은 Select 2개 조합 패턴 — usage 참고.

## States
default(placeholder) · focus/open(언더라인 강조) · hasVal · error(`txtInpGuide` 노출) · disabled
`label={false}` 조합도 HES 에 정의됨 → `hideLabel` prop.

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `variant` | `line \| box` | `line` | 형태 |
| `label` | `string` | 필수 | 캡션 라벨(시트 타이틀로도 사용) |
| `hideLabel` | `boolean` | `false` | 라벨 시각 숨김(HES label=false) |
| `options` | `{ value; label; description? }[]` | 필수 | 옵션 목록 |
| `value` / `onChange` | `string` / `(v) => void` | — | 제어형 |
| `placeholder` | `string` | — | 미선택 표시 |
| `error` / `errorMessage` | `boolean` / `string` | — | 오류 + 가이드 텍스트 |
| `helperText` | `string` | — | 보조 설명(box형 하단) |
| `disabled` | `boolean` | `false` | 비활성 |

## 토큰 매핑 (하드코딩 금지)
- 라벨: `color.fg.muted`(caption) · 값: `color.fg.base` · placeholder: `color.fg.muted`
- 언더라인: `color.border.strong` → open 시 `color.fg.base` → error 시 `color.feedback.danger`
- 가이드 텍스트(error): `color.feedback.danger`
- box형 배경: `color.bg.subtle` · 반경: `dimension.radius.md`
- 시트: 배경 `color.bg.base` + 스크림 `color.bg.overlay` + 상단 반경 `dimension.radius.xl`
- 선택된 옵션 체크: `color.brand.default`
- 전환: `duration.base` + `cubicBezier.emphasized`(시트), `duration.fast`(언더라인)

## 접근성
- 트리거는 `<button aria-haspopup="dialog" aria-expanded>` — 값·라벨을 함께 읽도록 구성
- 시트는 `role="dialog"` + `aria-label`(라벨), 닫기 버튼 `aria-label="닫기"`, ESC/스크림 터치로 닫힘
- 옵션 목록은 `role="listbox"` + `role="option"` + `aria-selected`
- 열릴 때 선택 항목으로 포커스 이동, 닫히면 트리거로 복귀

## 하지 말 것
- 옵션이 2~4개뿐이면 바텀시트 대신 Radio 버튼형 검토
- 브라우저 네이티브 드롭다운으로 대체 금지 — 모바일 UX 기준이 바텀시트(HES 규칙)
- 자유 입력이 필요한 필드에 Select 사용 금지 (→ Input)
