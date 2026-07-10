# Changelog

이 프로젝트는 [semver](https://semver.org)를 따릅니다. 각 릴리스에서 바뀐 플러그인의 `plugin.json` 과 `marketplace.json` version을 함께 bump 합니다.

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
