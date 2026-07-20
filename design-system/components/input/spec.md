---
name: Input
status: stable
since: 1.1.0
figma: "🧱 Template / input (691:3116)"
---

# Input 스펙

사용자가 텍스트를 입력하는 기본 필드 컴포넌트. 라벨·도움말·오류 메시지를 내장해 폼 한 줄을 구성한다.

## Variants
Input 은 색상 variant 대신 **상태**로 구분한다(아래 States 참고).

## Sizes
`sm`(32px) · `md`(40px, 기본) · `lg`(48px) — Button 과 동일한 높이 스케일로 폼·툴바 정렬을 맞춘다.

## States
default · hover(테두리 강조) · focus-visible(포커스 링 필수) · disabled · invalid(오류)

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `label` | `string` | — | 필드 라벨. 제공 시 `<label htmlFor>` 로 입력과 연결 |
| `helperText` | `string` | — | 보조 설명(오류가 없을 때 표시) |
| `errorMessage` | `string` | — | 오류 메시지. 존재하면 `invalid` 상태로 간주하고 helperText 대신 표시 |
| `size` | `sm \| md \| lg` | `md` | 크기 |
| `invalid` | `boolean` | `false` | 명시적 오류 상태(errorMessage 없이도 강제 가능) |
| `disabled` | `boolean` | `false` | 비활성 |
| `leadingIcon` | `ReactNode` | — | 입력 앞 아이콘 슬롯(검색 아이콘 등) |
| `id` | `string` | 자동 생성(`useId`) | 라벨·설명 연결용. 미지정 시 내부에서 생성 |

네이티브 `<input>` 의 나머지 속성(`type`, `placeholder`, `value`, `onChange` 등)은 그대로 전달된다.

## 토큰 매핑 (하드코딩 금지)
- 배경: `color.bg.base`
- 전경(입력값): `color.fg.base`, placeholder `color.fg.muted`
- 테두리: 기본 `color.border.base` → hover `color.border.strong` → invalid `color.feedback.danger`
- 라벨 텍스트: `color.fg.base`, 도움말 `color.fg.muted`, 오류 메시지 `color.feedback.danger`
- 반경: `dimension.radius.md`
- 안쪽 여백: `space.inset-sm`(sm) / `space.inset-md`(md, lg)
- 라벨·필드·도움말 간격: `space.stack-sm`
- 포커스 링: `color.focus.ring`(invalid 시 `color.feedback.danger`)
- 전환: `duration.fast` + `cubicBezier.standard`

## 접근성
- `label` 은 `htmlFor` / `id` 로 input 과 연결(`React.useId` 로 id 자동 생성, 충돌 방지)
- `invalid` 이거나 `errorMessage` 가 있으면 `aria-invalid="true"`
- `helperText` 또는 `errorMessage` 는 `aria-describedby` 로 input 에 연결(둘 중 화면에 보이는 것과 동일한 요소를 가리킴)
- 포커스 링은 `:focus-visible` 로 노출, 오류 상태에서는 링 색이 `color.feedback.danger` 로 전환되어 색+링 이중 신호 제공
- 색만으로 오류를 전달하지 않는다 — 테두리 색 변경과 함께 반드시 `errorMessage` 텍스트를 병기

## 하지 말 것
- `placeholder` 를 `label` 대용으로 사용 금지(포커스 잃으면 정보 소실)
- 오류 상태를 테두리 색만으로 표시하고 메시지를 생략하는 것 금지
- 토큰 대신 색상·간격 직접 입력 금지
