# 색상 가이드

## 사용 규칙
- **참조는 semantic만**: `color.bg.base`, `color.fg.muted`, `color.brand.default` 등. `color.brand.500` 같은 core 값 직접 사용 금지.
- **브랜드 색은 강조에만**: 화면의 주요 액션 1개(primary)에 집중. 남용하면 위계가 사라진다.
- **피드백 색은 의미 고정**: success=완료, warning=주의, danger=파괴/오류. 장식 목적 사용 금지.

## 대비 기준 (WCAG)
| 조합 | 최소 대비 |
| :-- | :-- |
| 본문 텍스트 / 배경 | 4.5 : 1 |
| 큰 텍스트(≥24px 또는 ≥19px bold) | 3 : 1 |
| UI 컴포넌트 경계·아이콘 | 3 : 1 |

`/hds-publish:a11y-audit` 로 자동 검증할 수 있습니다.

피드백 색 + fg.onBrand 조합은 AA 검증 완료(1.2.0).

## 다크 테마
`semantic.tokens.json` 의 `$dark` 블록이 오버라이드를 정의합니다. 컴포넌트는 테마를 몰라도 되며, `[data-theme=dark]` 스코프에서 CSS 변수만 교체됩니다.
