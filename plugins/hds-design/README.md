# HDS · 디자인 (`hds-design`)

디자인 시스템의 **단일 소스 오브 트루스**를 담는 플러그인. 기획/퍼블 플러그인이 이 콘텐츠를 참조합니다.

## 스킬
| 스킬 | 용도 |
| :-- | :-- |
| `/hds-design:design-tokens` | 토큰(색·타이포·간격·모션) 조회/추가/수정 |
| `/hds-design:design-guide` | 디자인 가이드(원칙·규범) 조회/유지보수 |
| `/hds-design:component-catalog` | 컴포넌트 조회 및 신규 추가(3종 세트) |
| `/hds-design:brand-visual` | 브랜드 비주얼·모션·영상 기획/검수 |
| `/hds-design:figma-bridge` | Figma ↔ 코드 토큰/컴포넌트 동기화(선택) |

## 에이전트
- `hds-design:design-reviewer` — 토큰 준수·가이드 부합·접근성 심층 검수

## 콘텐츠 (원본)
`design-system/` — `tokens/` · `guidelines/` · `components/`(+`registry.json`) · `usage/` · `brand/`.
자세한 편집 규칙은 [`design-system/README.md`](./design-system/README.md).
