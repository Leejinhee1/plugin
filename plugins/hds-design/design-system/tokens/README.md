# HDS Design Tokens

디자인 시스템의 **원자 단위 단일 소스**. 색·타이포·간격·모션의 모든 값은 여기서 시작합니다.

## 2-레이어 구조 (반드시 지킬 것)

```
core.tokens.json      원시값 (brand.500 = #2f6bff)  ← UI에서 직접 참조 금지
        │ alias
        ▼
semantic.tokens.json  의미값 (brand.default → {color.brand.500})  ← UI/컴포넌트는 여기만 참조
```

- **왜 2레이어인가**: 리브랜딩·다크테마·그룹사별 테마를 core 한 곳만 바꿔서 대응. 컴포넌트 코드는 절대 손대지 않음. → 유지보수 비용 최소화.
- **명명 규칙**: `category.role.variant` (예: `color.brand.hover`, `space.inset-md`). 새 토큰은 semantic 레이어에 role 기준으로 추가.

## 표준 포맷

[W3C Design Tokens Community Group (DTCG)](https://tr.designtokens.org/format/) 포맷을 사용합니다 (`$value` / `$type` / `$description`). 이 포맷은 Style Dictionary, Tokens Studio(Figma), Terrazzo 등 대부분의 툴이 그대로 읽습니다 — 특정 벤더에 종속되지 않아 장기 유지보수에 유리합니다.

## 소비 방법

| 대상 | 방법 |
| :-- | :-- |
| 퍼블 (CSS 변수 / Tailwind) | `/hds-publish:token-export` 스킬로 `tokens.css` · `tailwind.preset.js` 생성 |
| 디자인 (Figma) | `/hds-design:figma-bridge` 로 Variables 동기화 |
| 기획 (프로토타입) | 프로토타입 생성 시 semantic 토큰을 그대로 사용 |

## 토큰을 바꿀 때

1. `core.tokens.json` 또는 `semantic.tokens.json` 수정 (PR)
2. `CHANGELOG.md` 에 변경 기록 + `plugin.json` / `marketplace.json` version bump
3. 다운스트림(퍼블 export, Figma variables)은 소비 시점에 재생성 — 원본은 항상 이 파일

> ⚠️ 컴포넌트 코드나 export 산출물(`tokens.css` 등)을 직접 수정하지 마세요. 그 순간 단일 소스가 깨집니다.
