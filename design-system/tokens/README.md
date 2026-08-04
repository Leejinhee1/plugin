# HES Design Tokens

디자인 시스템의 **원자 단위 단일 소스**. 색·타이포·간격·모션의 모든 값은 여기서 시작합니다.

## 레이어 구조 — HES 이식 기준

HES(Figma) 자체가 base → theme → platform 3컬렉션 구조이므로 코드 토큰도 이를 따른다.
기존 2레이어(core→semantic)를 유지하되, 그 위에 component 레이어와 platform 컬렉션이 얹힌다
(3.1.0 결정: HES 이식이 목표이므로 2레이어 틀에 억지로 구겨넣지 않는다):

```
core.tokens.json       HES base 컬렉션 완전판 — 원시 램프(color·space·sizing·radius·borderWidth·font·lineHeight)
        │ alias                                                        ← UI에서 직접 참조 금지
        ▼
semantic.tokens.json   의미값 — HES role 이름(bg.base, fg.muted 등: 기존 컴포넌트 계약) 
        │ alias          + HES 원명 이식 그룹(text.01~08, brand.box*, chart, risk, space.elements/section)
        ▼
component.tokens.json  HES theme 의 컴포넌트/레이아웃 스펙 — comp.button.*, comp.layer.*, layout.*,
                       sizing.icon.*, font.size.body|headline.* (HES 원본 이름 보존, 자체 재작명 없음)

platform.tokens.json   HES platform 컬렉션 — AOS/iOS/PC/Min 모드. $value 가 모드 맵인 자체 확장 포맷.
                       기본 AOS, 나머지는 [data-platform="ios|pc|min"] 오버라이드로 소비.
```

- **일반 UI/신규 컴포넌트**는 지금까지처럼 **semantic 레이어만** 참조한다.
- **HES 컴포넌트를 1:1 이식**할 때는 **component 레이어**(`--hes-comp-*`)를 참조한다 — HES 스펙 추적성이 목적이라 이름도 HES 그대로 둔다.
- **명명 규칙**: semantic 은 `category.role.variant`(예: `color.brand.hover`). component 는 HES 경로 보존(예: `comp.button.solid.primary.bg`).

### 이식 각색 결정 (Figma HES ↔ 코드 차이 — 새 항목 추가 시 여기에 기록)
- HES `bg/N`·`border/N` 램프는 grayScale 1:1 패스스루 → 별도 토큰 없이 `{color.grayScale.N}` 을 참조하고 `$description` 에 HES 원명을 남긴다.
- HES `*fixed*` 변형(다크에서 안 뒤집히는 값)은 DTCG 에선 "`$dark` 오버라이드 없음"과 동일 → 토큰 생략.
- HES 오타 `disabeldFg` → `disabledFg` 로 정정(설명에 원명 기록). `bottomSeat` 는 키명 보존.
- radius `circle(50)` 은 Figma 의 '높이 절반' 관행값 → 웹 pill 보장값 `9999px`(`full`) 로 각색.
- `brand.hover/active`·`duration`·`cubicBezier` 는 HES 에 정의가 없는 자체 토큰(`$description` 에 명시).
- HES Dark 모드는 `text/black` 반전만 정의 → HES `$dark` 의 grayScale 반전 규칙은 자체 설계.
- **예외: radius·duration·easing 은 core 를 직접 export** (Button/Badge 선례). `build-tokens.mjs` 는 `dimension.radius.*` · `duration.*` · `cubicBezier.*` · `fontFamily.*` 를 semantic alias 없이 core 에서 곧바로 `--hes-radius-*` / `--hes-duration-*` / `--hes-ease-*` / `--hes-font-*` 로 export 한다(`CORE_DIRECT_PREFIXES`). 값 자체가 브랜드마다 잘 갈리지 않는 형태값이라 semantic 별칭의 실익이 적고, 스크립트의 CSS 변수 생성 루프는 `color.` / `space.` / `typography.` 접두사만 훑기 때문에 semantic 레이어에 `radius.full` 같은 새 그룹을 얹어도 CSS 변수가 생성되지 않아(무출력) core-direct 산출물 `--hes-radius-full` 과 이름만 겹치는 죽은 토큰이 된다. 그래서 semantic alias 는 추가하지 않고 core 직접 참조를 정책으로 유지한다(1.2.0 검토 결론).

## 표준 포맷

[W3C Design Tokens Community Group (DTCG)](https://tr.designtokens.org/format/) 포맷을 사용합니다 (`$value` / `$type` / `$description`). 이 포맷은 Style Dictionary, Tokens Studio(Figma), Terrazzo 등 대부분의 툴이 그대로 읽습니다 — 특정 벤더에 종속되지 않아 장기 유지보수에 유리합니다.

## 소비 방법

| 대상 | 방법 |
| :-- | :-- |
| 퍼블 (CSS 변수 / Tailwind) | token-export 스킬(🚧 준비중)로 `tokens.css` · `tailwind.preset.js` 생성. **지금은** `node skills/publish/token-export/scripts/build-tokens.mjs` 직접 실행 또는 `npx hes add`(토큰 CSS 동봉) |
| 디자인 (Figma) | figma-bridge(🚧 준비중)로 Variables 동기화. **지금은** 수동 |
| 기획 (프로토타입) | 프로토타입 생성 시 semantic 토큰을 그대로 사용 |

## 토큰을 바꿀 때

1. `core / semantic / component / platform .tokens.json` 중 해당 레이어 수정 (PR)
2. `CHANGELOG.md` 에 변경 기록 + `plugin.json` / `marketplace.json` version bump
3. 다운스트림(퍼블 export, Figma variables)은 소비 시점에 재생성 — 원본은 항상 이 파일

> ⚠️ 컴포넌트 코드나 export 산출물(`tokens.css` 등)을 직접 수정하지 마세요. 그 순간 단일 소스가 깨집니다.
