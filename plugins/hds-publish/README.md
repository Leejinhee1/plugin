# HDS · 퍼블 (`hds-publish`)

디자인 시스템을 **바로 개발에 적용 가능한 코드**로 변환합니다. `hds-design` 에 의존합니다.

## 스킬
| 스킬 | 용도 |
| :-- | :-- |
| `/hds-publish:token-export` | DTCG 토큰 → `tokens.css` · Tailwind preset · TS 타입 |
| `/hds-publish:component-build` | 레지스트리 컴포넌트를 프로젝트에 설치(shadcn 방식) |
| `/hds-publish:a11y-audit` | 접근성(WCAG AA) 점검 |

## 흐름
`token-export`(CSS 변수 세팅) → `component-build`(컴포넌트 vendoring) → `a11y-audit`(검증).
컴포넌트 CSS 변수명은 `token-export` 산출물과 정확히 일치해야 하며, 프로젝트에서 값 하드코딩은 금지합니다.
