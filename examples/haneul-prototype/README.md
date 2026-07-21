# 하늘 프로토타입 — 오늘 브리핑

날씨 기반 일상 플래너 앱 "하늘"의 동작 프로토타입입니다. HES(Haneul Design System)의 **기획 → 디자인 → 퍼블** 파이프라인이 실제로 이어진다는 것을 하나의 화면으로 증명합니다.

## 열어보는 법

빌드가 필요 없습니다. 브라우저에서 `index.html` 을 바로 여세요.

```
# 파일을 더블클릭하거나
open index.html          # macOS
xdg-open index.html      # Linux
```

외부 CDN·네트워크 요청이 전혀 없어 오프라인에서도 그대로 동작합니다.

## 무엇을 볼 수 있나요

- **오늘 브리핑**: 날씨 요약 카드(elevated) + 시간대별 추천 + 오늘 일정 리스트
- **주간 플랜**: 7일 리스트 + 일정 추가 폼(빈 값 검증)
- **알림 설정 Modal**: 상단 종 아이콘으로 열기
- **인터랙션**:
  - 다크 모드 토글(상단 해 아이콘) — `html[data-theme=dark]` 전환
  - Modal 열기/닫기 — ESC · 오버레이 클릭 · 취소/저장, 닫을 때 포커스 복귀, 열려 있는 동안 포커스 트랩
  - 일정 추가 — 빈 값이면 `Input` 의 `errorMessage` 패턴 노출
  - 상태 데모 컨트롤(상단 "상태 데모") — 정상 / 로딩(스켈레톤) / 빈 상태 / 오류 전환
- 키보드만으로 전체 플로우 조작 가능, `prefers-reduced-motion` 존중

## 이 프로토타입이 증명하는 파이프라인

```
설계서(spec)                레지스트리 조립                토큰 파생
examples/specs/          →  components/*/spec.md 의     →  tokens/*.json
today-briefing.md           variant·prop 를 미러링          → build-tokens.mjs
                            (hes-btn--primary,             → tokens.css (--hes-*)
                             hes-card--elevated,
                             hes-badge--brand, …)
```

1. **설계서 → 화면**: `examples/specs/today-briefing.md` 의 §5 화면 명세가 이 `index.html` 과 1:1로 대응합니다. 설계서에서 "날씨 요약 = Card(variant=elevated)"라고 적으면, 프로토타입에는 `hes-card hes-card--elevated` 로 나타납니다.
2. **레지스트리 조립**: 모든 UI는 `design-system/components/{button,input,badge,card,modal}/spec.md` 의 variant·prop 체계를 그대로 클래스 이름으로 미러링합니다. 각 컴포넌트 CSS 블록 상단에 대응 `spec.md` 경로가 주석으로 달려 있습니다.
3. **토큰 파생**: 색·간격·라디우스·모션은 **하드코딩 없이** `var(--hes-*)` 만 사용합니다. 이 변수들은 DTCG 토큰(`core.tokens.json` + `semantic.tokens.json`)에서 `build-tokens.mjs` 로 파생된 `tokens.css` 에 정의되어 있습니다. 다크 테마는 `[data-theme="dark"]` 스코프에서 같은 변수만 교체됩니다.

## tokens.css 재생성

`tokens.css` 는 빌드 산출물입니다(수정 금지). 원본 토큰이 바뀌면 다음 명령으로 다시 생성하세요. 저장소 루트에서 실행합니다.

```
node skills/publish/token-export/scripts/build-tokens.mjs \
  --tokens design-system/tokens \
  --out examples/haneul-prototype
```

이 프로토타입은 `tokens.css` 만 사용하므로, 함께 생성되는 `tailwind.preset.js` / `tokens.ts` 는 이 예시에서 제거했습니다(불필요).

## 파일

| 파일 | 설명 |
| :-- | :-- |
| `index.html` | 단일 페이지 프로토타입(HTML/CSS/JS, 빌드 불필요) |
| `tokens.css` | `build-tokens.mjs` 산출물 — `--hes-*` 변수(라이트/다크) |
| `logo.svg` | 브랜드 로고(`brand/assets/logo.svg` 복사본) |
</content>
