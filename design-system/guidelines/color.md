# 색상 가이드

## 사용 규칙
- **참조는 semantic만**: `color.bg.base`, `color.fg.muted`, `color.brand.default` 등. `color.teal.110` 같은 core 값 직접 사용 금지.
- **브랜드 색은 강조에만**: 주 브랜드색은 하나그린(`color.brand.default` = HES brand/primary #009178). 화면의 주요 액션 1개(primary)에 집중. 남용하면 위계가 사라진다.
- **호버/눌림은 틸 램프로**: `brand.hover`(teal.115) → `brand.active`(teal.120) 순으로 어두워진다. 옅은 강조 배경은 `brand.subtle`(teal.70).
- **피드백 색은 의미 고정**: success=완료(하나그린), warning=주의(HES orange), danger=파괴/오류(HES pink). 장식 목적 사용 금지.

## 대비 기준 (WCAG)
| 조합 | 최소 대비 |
| :-- | :-- |
| 본문 텍스트 / 배경 | 4.5 : 1 |
| 큰 텍스트(≥24px 또는 ≥19px bold) | 3 : 1 |
| UI 컴포넌트 경계·아이콘 | 3 : 1 |

`/hds:a11y-audit` 로 자동 검증할 수 있습니다.

### 피드백 색 + 흰 텍스트(fg.onBrand) 대비 현황 (3.0.0, HES 값 기준)
| 토큰 | 값 | 흰 텍스트 대비 | 허용 용도 |
| :-- | :-- | :-- | :-- |
| `feedback.success` | #009178 | 3.9 : 1 | 큰 텍스트·아이콘·UI 경계 (3:1) |
| `feedback.warning` | #ff5833 | 3.1 : 1 | 큰 텍스트·아이콘·UI 경계 (3:1) |
| `feedback.danger` | #ec4361 | 3.8 : 1 | 큰 텍스트·아이콘·UI 경계 (3:1) |

⚠️ HES 원본 값을 그대로 따르므로 **피드백 배경 + 흰색 작은 텍스트(AA 4.5:1) 조합은 금지**합니다. 작은 텍스트가 필요한 피드백 UI는 옅은 배경(`bg.subtle` 등) + 피드백 색 텍스트 대신 `fg.base` 텍스트 + 피드백 색 아이콘 구성을 사용하세요. 텍스트 자체를 피드백 색으로 쓸 때도 큰 텍스트 기준(3:1)만 충족합니다.

`fg.muted`(grayScale.70, 4.6:1)는 본문 보조 텍스트 AA를 충족합니다. HES 텍스트 위계의 text/05 이하(grayScale 60~35)는 대비 미달이라 semantic으로 승격하지 않았습니다 — placeholder/disabled 같은 비정보성 텍스트에만 제한적으로 고려하세요.

## 다크 테마
`semantic.tokens.json` 의 `$dark` 블록이 오버라이드를 정의합니다. 컴포넌트는 테마를 몰라도 되며, `[data-theme=dark]` 스코프에서 CSS 변수만 교체됩니다. HES Figma의 Dark 모드는 현재 Light와 사실상 동일하게 정의되어 있어, 다크 값은 HDS가 grayScale 램프 반전으로 자체 정의합니다(HES 다크 모드가 실제 값을 갖게 되면 figma-bridge로 재동기화).
