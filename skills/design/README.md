# HDS 스킬 · 디자인 (design)

디자인 시스템의 **단일 소스 오브 트루스**(`design-system/`)를 관리하는 스킬 묶음입니다.
기획/퍼블 스킬이 모두 이 콘텐츠를 참조합니다.

## 스킬
| 스킬 | 용도 |
| :-- | :-- |
| `/hds:design-tokens` | 토큰(색·타이포·간격·모션) 조회/추가/수정 |
| `/hds:design-guide` | 디자인 가이드(원칙·규범) 조회/유지보수 |
| `/hds:component-catalog` | 컴포넌트 조회 및 신규 추가(3종 세트) |
| `/hds:brand-visual` | 브랜드 비주얼·모션·영상 기획/검수 |
| `/hds:figma-bridge` | Figma ↔ 코드 토큰/컴포넌트 동기화(선택) |

## 에이전트
- `hds:design-reviewer` — 토큰 준수·가이드 부합·접근성 심층 검수 (`agents/design-reviewer.md`)

## 콘텐츠 (원본)
저장소 루트의 `design-system/` — `tokens/` · `guidelines/` · `components/`(+`registry.json`) · `usage/` · `brand/`.
자세한 편집 규칙은 [`design-system/README.md`](../../design-system/README.md).
