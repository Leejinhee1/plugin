---
name: Radio
status: stable
since: 3.1.0
figma: "🧱 Template / radio (691:3123)"
---

# Radio 스펙

단일 선택을 하는 폼 요소. (HES 정의 그대로)

## Variants
HES 원본 컴포넌트 매핑:
| variant | HES 원본 | 형태 | 용도 |
| :-- | :-- | :-- | :-- |
| `dot` | `rdo` / `rdoM` | 원형 링 + 내부 점 | 기본 라디오 (라벨 유/무) |
| `list` | `rdoList` / `rdoListCol` | 버튼형 그룹 | 짧은 선택지를 행/그리드로 |
| `listCheck` | `rdoListChk` | 체크 아이콘 버튼형 | 선택 항목에 체크 표시가 필요할 때 |

- `rdoList`(1행) vs `rdoListCol`(2행 이상)은 별도 variant가 아니라 그룹의 `columns` 로 결정.
- 버튼형에서 선택 항목: 흰 배경 + 진한 테두리(+bold), 미선택: 옅은 배경·테두리 없음.

## Sizes
`dot` 컨트롤 24×24 고정, 라벨 간격 8px. 버튼형 셀 높이 32~36px, 그리드 간격 1px(구분선 느낌).

## States
default · checked · disabled · disabled+checked · focus-visible

## Props (API)
`RadioGroup` + `Radio` 2단 구성:
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `RadioGroup.name` | `string` | 필수 | 네이티브 그룹핑 |
| `RadioGroup.variant` | `dot \| list \| listCheck` | `dot` | 하위 Radio 형태 일괄 지정 |
| `RadioGroup.columns` | `number` | — | 버튼형 그리드 열 수 (없으면 1행 균등) |
| `RadioGroup.value` / `onChange` | `string` / `(v) => void` | — | 제어형 |
| `Radio.value` | `string` | 필수 | 항목 값 |
| `Radio.disabled` | `boolean` | `false` | 항목 비활성 |

## 토큰 매핑 (하드코딩 금지)
- `dot` 체크: 링·점 `color.brand.default` · 미체크 링: `color.border.strong`
- 버튼형 선택: 배경 `color.bg.base` + 테두리 `color.fg.base`(진한 라인) + bold
- 버튼형 미선택: 배경 `color.bg.subtle`, 텍스트 `color.fg.muted`
- `listCheck` 체크 아이콘: `color.brand.default`
- disabled: opacity 40% · 포커스 링: `color.focus.ring` · 전환: `duration.fast` + `cubicBezier.standard`

## 접근성
- 네이티브 `<input type="radio" name=...>` 유지 — 방향키 순회·그룹핑을 브라우저가 처리
- `RadioGroup` 은 `<fieldset>` + `<legend>`(label prop) 사용
- 버튼형도 실제로는 radio — `role` 재정의 금지

## 하지 말 것
- 복수 선택 가능한 항목에 Radio 사용 금지 (→ Checkbox)
- 선택지 2개이고 즉시 반영이면 Radio 대신 Switch/tabToggle 검토
- 버튼형 그룹을 개별 Button 으로 구현 금지 (선택 상태 관리·접근성 무너짐)
