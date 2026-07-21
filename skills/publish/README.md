# HES 스킬 · 퍼블 (publish)

디자인 시스템을 **바로 개발에 적용 가능한 코드**로 변환하는 스킬 묶음입니다.
디자인 시스템 원본(`design-system/`)을 읽기 전용으로 소비합니다.

## 스킬
| 스킬 | 용도 |
| :-- | :-- |
| `/hes:token-export` | DTCG 토큰 → `tokens.css` · Tailwind preset · TS 타입 |
| `/hes:component-build` | 레지스트리 컴포넌트를 프로젝트에 설치(shadcn 방식) |
| `/hes:a11y-audit` | 접근성(WCAG AA) 점검 |

## 흐름
`token-export`(CSS 변수 세팅) → `component-build`(컴포넌트 vendoring) → `a11y-audit`(검증).
컴포넌트 CSS 변수명은 `token-export` 산출물과 정확히 일치해야 하며, 프로젝트에서 값 하드코딩은 금지합니다.
