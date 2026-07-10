# HDS · 기획 (`hds-planning`)

제품 설계서를 AI-리더블 문서로 관리하고, 디자인·퍼블 코드베이스 기반 프로토타입을 생성합니다.
`hds-design` 에 의존합니다(설치 시 자동 활성).

## 스킬
| 스킬 | 용도 |
| :-- | :-- |
| `/hds-planning:product-spec` | 제품 설계서(PRD)를 구조화 문서로 작성/업데이트 (템플릿 제공) |
| `/hds-planning:prototype` | 설계서 → HDS 컴포넌트로 조립한 동작 프로토타입 |

## 흐름
`product-spec`(HDS 컴포넌트/토큰 이름으로 화면 명세) → `prototype`(레지스트리에서 조립) → 퍼블(`hds-publish`)이 이어받아 구현.
