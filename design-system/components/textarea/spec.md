---
name: Textarea
status: stable
since: 3.1.0
figma: "🧱 Template / textarea (8220:46698)"
---

# Textarea 스펙

긴 텍스트 데이터를 입력하는 폼 요소. (HES 정의 그대로)

## Variants
| variant | HES 원본 | 형태 |
| :-- | :-- | :-- |
| `line` | `textarea` / `textareaL` | 캡션 라벨 + 언더라인, 우하단 글자수 카운터 |
| `box` | `textareaBox` | 옅은 배경 박스(radius) + 내부 카운터 |

`textareaL`(장문, 1,000자)은 별도 variant가 아니라 `rows`/`maxLength` 조합.

## States
default(placeholder) · focus(클리어 버튼 노출) · hasVal · error(`txtInpGuide` 노출) · disabled

## Props (API)
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `variant` | `line \| box` | `line` | 형태 |
| `label` | `string` | — | 캡션 라벨(box형·장문형은 생략 가능) |
| `maxLength` | `number` | — | 최대 글자수. 지정 시 카운터 자동 노출("n/30자") |
| `rows` | `number` | `3` | 표시 줄수(장문형은 8~10) |
| `error` / `errorMessage` | `boolean` / `string` | — | 오류 + 가이드 텍스트 |
| `clearable` | `boolean` | `true` | focus 시 전체 삭제 버튼 |
| 나머지 | `TextareaHTMLAttributes` | — | value/onChange/placeholder/disabled 등 |

## 토큰 매핑 (하드코딩 금지)
- 라벨: `color.fg.muted`(caption) · 입력 텍스트: `color.fg.base` · placeholder: `color.fg.muted`
- 언더라인: `color.border.strong` → focus `color.fg.base` → error `color.feedback.danger`
- 카운터: `color.fg.muted`, 입력 중 현재 글자수만 `color.brand.default`
- 가이드 텍스트(error): `color.feedback.danger`
- box형 배경: `color.bg.subtle` · 반경: `dimension.radius.md` · 안쪽 여백: `space.inset-md`
- 전환: `duration.fast` + `cubicBezier.standard`

## 접근성
- `label` 은 `<label htmlFor>` 로 연결, 생략 시 `aria-label` 필수
- 오류 메시지는 `role="alert"` + `aria-invalid`, `aria-describedby` 로 연결
- 글자수 카운터는 장식 정보 — `aria-hidden`, 한도 도달은 가이드 텍스트로 안내
- 클리어 버튼은 `aria-label="입력 내용 지우기"` + 최소 터치 영역 44px

## 하지 말 것
- 한 줄 입력에 Textarea 사용 금지 (→ Input)
- `maxLength` 없이 카운터만 표시 금지 (기준 없는 숫자)
- 카운터 위치 임의 이동 금지 — 우하단 고정(HES)
