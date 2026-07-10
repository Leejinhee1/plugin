# Changelog

이 프로젝트는 [semver](https://semver.org)를 따릅니다. 각 릴리스에서 바뀐 플러그인의 `plugin.json` 과 `marketplace.json` version을 함께 bump 합니다.

## [1.0.0] — 2026-07-10
### 최초 릴리스
- 사내 마켓플레이스(`hds`) + 역할별 플러그인 3종 골격.
- **hds-design**: design-tokens · design-guide · component-catalog · brand-visual · figma-bridge 스킬, design-reviewer 에이전트.
  - 단일 소스 오브 트루스 `design-system/`: DTCG 토큰(core/semantic), 가이드라인(원칙·색·타이포·모션), 컴포넌트 레지스트리 + Button 정본 예시(spec·code·usage), 화면 패턴·브랜드 규범 뼈대.
- **hds-planning**: product-spec(AI-리더블 PRD 템플릿) · prototype 스킬.
- **hds-publish**: token-export · component-build · a11y-audit 스킬.
- **Codex 어댑터**: AGENTS.md + prompts(/hds-tokens, /hds-component, /hds-spec) + config 예시.
- 문서: 아키텍처 · 시작하기 · 유지보수 가이드.
