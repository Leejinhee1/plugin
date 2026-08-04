# HES 스킬 · 퍼블 (publish)

디자인 시스템을 **바로 개발에 적용 가능한 코드**로 변환하는 스킬 묶음입니다.
디자인 시스템 원본(`design-system/`)을 읽기 전용으로 소비합니다.

## 스킬
**이 버킷의 스킬은 현재 전부 🚧 준비중입니다** — 미완성이라 `.claude-plugin/plugin.json` 의 `_disabledSkills` 에 보관 중이며 설치·호출되지 않습니다. 완성되면 `skills` 배열로 옮기고 아래 상태를 갱신하세요.

| 스킬 | 상태 | 용도 | 그동안의 대안 |
| :-- | :-- | :-- | :-- |
| token-export | 🚧 준비중 | DTCG 토큰 → `tokens.css` · Tailwind preset · TS 타입 | `npx hes add` 가 토큰 CSS를 함께 설치. 스크립트 직접 실행도 가능: `node skills/publish/token-export/scripts/build-tokens.mjs` |
| registry-export | 🚧 준비중 | 컴포넌트 → shadcn CLI 호환 레지스트리(JSON) | `node skills/publish/registry-export/scripts/build-registry.mjs` |
| component-build | 🚧 준비중 | 레지스트리 컴포넌트를 프로젝트에 설치(shadcn 방식) | `npx hes add <name>` |
| a11y-audit | 🚧 준비중 | 접근성(WCAG AA) 점검 | `design-system/guidelines/color.md` 기준 수동 검토 / `hes:design-reviewer` 에이전트 |

> 스킬은 준비중이지만 **각 스킬이 쓰는 빌드 스크립트와 `npx hes` CLI는 이미 동작합니다** — 퍼블 업무는 사실상 막히지 않습니다.

## 흐름
`token-export`(CSS 변수 세팅) → `component-build`(컴포넌트 vendoring) → `a11y-audit`(검증).
컴포넌트 CSS 변수명은 `token-export` 산출물과 정확히 일치해야 하며, 프로젝트에서 값 하드코딩은 금지합니다.
