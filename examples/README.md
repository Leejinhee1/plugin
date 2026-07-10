# HDS 예시 (Examples)

이 폴더는 HDS(Haneul Design System)의 **기획 → 디자인 → 퍼블** 전체 파이프라인을 하나의 완결된 사례로 보여주는 플래그십 예시입니다. 가상 브랜드 **(주)하늘**의 날씨 기반 일상 플래너 앱 "하늘"을 소재로, AI가 읽을 수 있는 제품 설계서 한 장이 어떻게 실제 동작하는 화면으로 이어지는지 증명합니다.

## 흐름: 설계서 → 프로토타입

```
① 제품 설계서                    ② 동작 프로토타입
specs/today-briefing.md    →     haneul-prototype/index.html
(무엇을·어떤 컴포넌트로)          (그 명세대로 동작하는 화면)
        │                                 ▲
        │  HDS 컴포넌트 spec 참조           │  var(--hds-*) 토큰만 사용
        ▼                                 │
   components/*/spec.md            tokens.css ◀── build-tokens.mjs ◀── tokens/*.json
   (variant·prop 계약)             (파생된 CSS 변수)          (DTCG 원본 토큰)
```

- **설계서**는 화면을 산문이 아니라 **HDS 컴포넌트·토큰 이름**으로 명세합니다. 예: "날씨 요약 = `Card`(variant=elevated) + 날씨 상태 `Badge`(variant=brand)". 그래서 사람도 AI도 애매함 없이 그대로 조립할 수 있습니다.
- **프로토타입**은 그 명세를 1:1로 구현합니다. 컴포넌트 클래스(`hds-card--elevated`, `hds-badge--brand` …)는 컴포넌트 `spec.md` 의 variant 체계를 미러링하고, 모든 색·간격·라디우스·모션은 토큰(`var(--hds-*)`)으로만 지정합니다.

## 파일

| 경로 | 내용 |
| :-- | :-- |
| [`specs/today-briefing.md`](./specs/today-briefing.md) | "오늘 브리핑" 화면의 제품 설계서(status: approved). 문제 정의·시나리오·플로우·화면 명세(HDS 컴포넌트/토큰)·수용 기준. |
| [`haneul-prototype/index.html`](./haneul-prototype/index.html) | 설계서대로 동작하는 단일 페이지 프로토타입. 브라우저에서 바로 열림. |
| [`haneul-prototype/tokens.css`](./haneul-prototype/tokens.css) | `build-tokens.mjs` 로 파생된 `--hds-*` 변수(라이트/다크). 빌드 산출물. |
| [`haneul-prototype/logo.svg`](./haneul-prototype/logo.svg) | 브랜드 로고. |
| [`haneul-prototype/README.md`](./haneul-prototype/README.md) | 프로토타입 실행법·파이프라인 설명·토큰 재생성 명령. |

## 설계서 ↔ 프로토타입 대응

| 설계서 §5 명세 | 프로토타입 구현 |
| :-- | :-- |
| 날씨 요약 = `Card`(variant=elevated, padding=lg) + 상태 `Badge`(variant=brand) | `.hds-card--elevated.hds-card--pad-lg` + `.hds-badge--brand` |
| 시간대별 추천 = `Card`(default) + 구간 `Badge`(neutral/warning, size=sm) | `.hds-card` + `.hds-badge--neutral / --warning .hds-badge--sm` |
| 오늘 일정 = `Card` + 시간 `Badge`(neutral) + 상태 `Badge`(예정=brand/완료=success) | `.hds-card` + `.hds-badge--neutral` + `.hds-badge--brand / --success` |
| 알림 설정 = `Modal`(size=sm), ESC·오버레이·버튼 닫기, 포커스 트랩/복귀 | `.hds-modal .hds-modal__panel`(max-width 384px) + JS |
| 주간 플랜 일정 추가 = `Input`(errorMessage) + `Button`(primary) | `.hds-input[data-invalid]` + `.hds-btn--primary` |
| empty / loading / error 상태 | 상단 "상태 데모" 컨트롤로 전환 |

## 이 예시를 자기 제품으로 복제하는 법 (3단계)

1. **설계서를 복제한다.** `plugins/hds-planning/skills/product-spec/templates/spec-template.md` 를 채워 새 화면 설계서를 씁니다. `specs/today-briefing.md` 처럼 §5 화면 명세를 반드시 HDS 컴포넌트·토큰 이름으로 적으세요(`related_components` 에 사용할 컴포넌트 나열).
2. **토큰을 파생한다.** 저장소 루트에서 빌드를 돌려 `tokens.css` 를 생성합니다.
   ```
   node plugins/hds-publish/scripts/build-tokens.mjs \
     --tokens plugins/hds-design/design-system/tokens \
     --out <내-프로토타입-폴더>
   ```
3. **컴포넌트로 조립한다.** `haneul-prototype/index.html` 을 출발점으로 삼아 화면을 만듭니다. 컴포넌트 클래스는 `components/*/spec.md` 의 variant 체계를 미러링하고, 색·간격·라디우스·모션은 반드시 `var(--hds-*)` 만 사용합니다(hex/rgb 하드코딩 금지). 다크 테마는 `[data-theme="dark"]` 로 자동 전환됩니다.
</content>
