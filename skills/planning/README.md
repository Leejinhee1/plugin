# HES 스킬 · 기획 (planning)

제품 설계서를 AI-리더블 문서로 관리하고, 디자인 시스템 기반 프로토타입과 QA 테스트 시나리오를 생성하는 스킬 묶음입니다.
`hes` 플러그인 하나에 포함되어 있으며, 디자인 시스템 원본(`design-system/`)을 직접 참조합니다.

## 스킬
| 스킬 | 상태 | 용도 |
| :-- | :-- | :-- |
| `/hes:test-script` | ✅ 사용 가능 | UI 기획서(Figma·PDF·이미지·이미지 폴더) → QA 테스트 시나리오 (클립보드/CSV/Sheets) |
| product-spec | 🚧 준비중 | 제품 설계서(PRD)를 구조화 문서로 작성/업데이트 (템플릿 제공) |
| prototype | 🚧 준비중 | 설계서 → HES 컴포넌트로 조립한 동작 프로토타입 |

> 🚧 = 미완성이라 `.claude-plugin/plugin.json` 의 `_disabledSkills` 에 보관 중 — 설치되지 않으며 `/hes:` 로 호출되지 않습니다. 완성되면 `skills` 배열로 옮기고 위 표의 상태를 갱신하세요.
> 그동안 설계서는 `product-spec/templates/spec-template.md` 를, 프로토타입은 `examples/haneul-prototype/index.html` 을 출발점으로 직접 작성합니다.

## 흐름
`product-spec`(HES 컴포넌트/토큰 이름으로 화면 명세) → `prototype`(레지스트리에서 조립) → 퍼블 스킬(`skills/publish/`)이 이어받아 구현. *(앞 두 단계는 준비중 — 현재는 수동)*
`test-script` 는 이 흐름과 **독립**입니다 — HES 설계서든 외부 팀이 준 PDF·이미지 기획서든, 화면 정의가 확정된 시점에 QA 시나리오를 뽑는 용도.
