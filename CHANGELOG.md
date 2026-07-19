# Changelog

이 프로젝트는 [semver](https://semver.org)를 따릅니다. 각 릴리스에서 `.claude-plugin/plugin.json` 과 `marketplace.json` version을 함께 bump 합니다.

## [2.0.0] — 2026-07-19
### 파괴적 변경 — 플러그인 3종 → 단일 플러그인 `hds` (mattpocock/skills 구조)
설치를 세 번 해야 하는 불편과 플러그인 간 파일 참조 문제를 없애기 위해, [mattpocock/skills](https://github.com/mattpocock/skills)의 단일 플러그인 구조로 전면 재구성.
- **저장소 루트가 곧 플러그인**: `marketplace.json` 의 `source: "./"`. `hds-design`/`hds-planning`/`hds-publish` 3개 플러그인을 `hds` 하나로 통합 — 설치는 `/plugin install hds@hds` 한 번.
- **스킬은 역할별 버킷으로 이동**: `plugins/<플러그인>/skills/*` → `skills/planning|design|publish/*`. 10개 스킬 전부를 `.claude-plugin/plugin.json` 의 `skills` 배열에 명시(배열에 없는 폴더는 배포되지 않음 — 초안/보류 스킬을 두는 공간으로 활용 가능).
- **소스 오브 트루스 승격**: `plugins/hds-design/design-system/` → 루트 `design-system/`. 모든 스킬이 `${CLAUDE_PLUGIN_ROOT}/design-system/` 하나를 참조 — 크로스 플러그인 상대경로 제거.
- **에이전트/스크립트 이동**: `design-reviewer` → 루트 `agents/` (자동 발견). `build-tokens.mjs` → `skills/publish/token-export/scripts/` (스킬 전속 스크립트는 스킬 폴더 안에).
- **스킬 호출명 변경**: `/hds-design:design-tokens` → `/hds:design-tokens` 등 전부 `/hds:*` 네임스페이스로 통일.
- **v1 마이그레이션**: `forceRemoveDeletedPlugins: true` — 마켓플레이스 업데이트 시 옛 플러그인 3종이 자동 제거됨. 이후 `/plugin install hds@hds` 한 번이면 끝.
- 문서(README·getting-started·user-guide·architecture·maintenance)·codex 어댑터·examples·랜딩 페이지를 새 구조에 맞게 갱신.

## [1.2.0] — 2026-07-10
### 접근성 — 1.1.0 검수 반영
- **hds-design 1.2.0**
  - `color.warning.500` 를 `#d98a00`(흰 텍스트 대비 2.77:1, WCAG AA 미달) → `#a15c00`(흰 텍스트 대비 5.19:1, AA 4.5:1 및 목표 4.6:1 확보)로 조정. 색상(hue)은 주황/앰버 계열 유지.
    - Badge `warning` variant 배경(`color.feedback.warning`) + `color.fg.onBrand`(#ffffff) 텍스트 조합에 직접 적용(컴포넌트 코드 수정 없이 토큰만 교체).
    - 참고로 함께 점검한 `success.500`(#1f9d55) vs 흰 텍스트 3.49:1, `danger.500`(#e23b3b) vs 흰 텍스트 4.27:1 — 둘 다 3:1 이상이라 이번 릴리스에서는 미조정(AA 4.5:1 미달이지만 보고만 하고 warning 만 수정).
  - `guidelines/color.md` 대비 기준 표 아래에 "피드백 색 + fg.onBrand 조합은 AA 검증 완료(1.2.0)" 명시.
  - semantic 타이포그래피에 `typography.caption`(sans/12px/regular/1.4) 신설 — 보조 설명·helper text 용도. `guidelines/typography.md` 스케일 섹션에 용도 추가.
  - `dimension.radius.full` semantic alias 도입 여부 검토: `build-tokens.mjs` 가 이미 core `dimension.radius.*` 를 `--hds-radius-*` 로 직접 export 하고 있어(Button/Badge 선례), semantic 레이어에 별도 `radius` 그룹을 얹어도 CSS 변수 생성 루프(`color.`/`space.`/`typography.` 접두사만 처리)가 이를 훑지 않아 무출력 상태의 죽은 토큰이 됨 → 추가하지 않고 core 직접 참조 정책을 `tokens/README.md` 에 예외로 명문화.
  - `examples/haneul-prototype/tokens.css` 를 새 토큰(경고색·caption 타이포)으로 재생성. 프로토타입은 `tokens.css` 만 유지(부산물인 `tailwind.preset.js`/`tokens.ts` 는 재생성 후 삭제).

## [1.1.0] — 2026-07-10
### 추가 — 가상 브랜드 "(주)하늘" 실사용 예시 완성
- **hds-design 1.1.0**
  - 컴포넌트 4종 추가: `input`, `badge`, `card`, `modal` (각 spec+code+usage 3종 세트, registry 등록)
  - semantic 토큰 `color.bg.overlay` 추가 (모달 스크림, 라이트/다크)
  - (주)하늘 브랜드 패키지: identity·logo·voice-tone·visual-style·motion-video 규범 + 로고 SVG 원본 2종
  - 화면 패턴 4종: login · list-detail · form · feedback-states
- **hds-publish 1.1.0**
  - `scripts/build-tokens.mjs`: 실행 가능한 DTCG→tokens.css/tailwind preset/TS 변환 스크립트 (의존성 0)
- **examples/**: "오늘 브리핑" 제품 설계서 + 동작 프로토타입 (기획→디자인→퍼블 파이프라인 데모)
### 변경
- hds-planning/hds-publish 의 hds-design 의존 제약을 `^1.0.0` 으로 완화

## [1.0.0] — 2026-07-10
### 최초 릴리스
- 사내 마켓플레이스(`hds`) + 역할별 플러그인 3종 골격.
- **hds-design**: design-tokens · design-guide · component-catalog · brand-visual · figma-bridge 스킬, design-reviewer 에이전트.
  - 단일 소스 오브 트루스 `design-system/`: DTCG 토큰(core/semantic), 가이드라인(원칙·색·타이포·모션), 컴포넌트 레지스트리 + Button 정본 예시(spec·code·usage), 화면 패턴·브랜드 규범 뼈대.
- **hds-planning**: product-spec(AI-리더블 PRD 템플릿) · prototype 스킬.
- **hds-publish**: token-export · component-build · a11y-audit 스킬.
- **Codex 어댑터**: AGENTS.md + prompts(/hds-tokens, /hds-component, /hds-spec) + config 예시.
- 문서: 아키텍처 · 시작하기 · 유지보수 가이드.
