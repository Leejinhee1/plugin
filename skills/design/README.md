# HES 스킬 · 디자인 (design)

디자인 시스템의 **단일 소스 오브 트루스**(`design-system/`)를 관리하는 스킬 묶음입니다.
기획/퍼블 스킬이 모두 이 콘텐츠를 참조합니다.

## 스킬
**이 버킷의 스킬은 현재 전부 🚧 준비중입니다** — 미완성이라 `.claude-plugin/plugin.json` 의 `_disabledSkills` 에 보관 중이며 설치·호출되지 않습니다. 완성되면 `skills` 배열로 옮기고 아래 상태를 갱신하세요.

| 스킬 | 상태 | 용도 | 그동안의 대안 |
| :-- | :-- | :-- | :-- |
| design-tokens | 🚧 준비중 | 토큰(색·타이포·간격·모션) 조회/추가/수정 | `design-system/tokens/*.json` 직접 편집 |
| design-guide | 🚧 준비중 | 디자인 가이드(원칙·규범) 조회/유지보수 | `design-system/guidelines/` 직접 참조 |
| component-catalog | 🚧 준비중 | 컴포넌트 조회 및 신규 추가(3종 세트) | `design-system/components/registry.json` + button 정본 구조 복제 |
| brand-visual | 🚧 준비중 | 브랜드 비주얼·모션·영상 기획/검수 | `design-system/brand/` 직접 참조 |
| figma-bridge | 🚧 준비중 | Figma ↔ 코드 토큰/컴포넌트 동기화(선택) | Figma Variables 수동 동기화 |

## 에이전트
- `hes:design-reviewer` — 토큰 준수·가이드 부합·접근성 심층 검수 (`agents/design-reviewer.md`). **에이전트는 스킬과 별개라 지금도 동작합니다** — 이 버킷이 준비중인 동안 검수는 여기로.

## 콘텐츠 (원본)
저장소 루트의 `design-system/` — `tokens/` · `guidelines/` · `components/`(+`registry.json`) · `usage/` · `brand/`.
자세한 편집 규칙은 [`design-system/README.md`](../../design-system/README.md).
