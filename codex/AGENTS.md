# HDS — Codex 하네스 규칙 (AGENTS.md)

이 저장소는 **HDS 디자인 시스템**입니다. Codex CLI로 작업할 때 이 규칙을 따르세요.
Claude Code 플러그인과 **동일한 소스 오브 트루스**를 공유합니다 — 하네스만 다릅니다.

## 소스 오브 트루스 (항상 여기서 시작)
- 토큰: `plugins/hds-design/design-system/tokens/`  (`core.tokens.json`, `semantic.tokens.json`, DTCG 포맷)
- 가이드: `plugins/hds-design/design-system/guidelines/`  (원칙·색·타이포·모션)
- 컴포넌트: `plugins/hds-design/design-system/components/`  (인덱스: `registry.json`)
- 화면 패턴: `plugins/hds-design/design-system/usage/`
- 브랜드: `plugins/hds-design/design-system/brand/`

## 불변 규칙
1. 색·간격·타이포·모션을 **하드코딩 금지**. 항상 semantic 토큰을 참조. (컴포넌트는 `--hds-*` CSS 변수 사용)
2. 값 변경은 `tokens/` 원본에서만. 파생물(`tokens.css` 등)을 직접 고치지 않는다.
3. 컴포넌트 추가 = spec + 코드 + usage 3종 + `registry.json` 등록.
4. 접근성은 기본값(WCAG AA·키보드·포커스·aria).
5. 값/API 변경 시 `CHANGELOG.md` + 관련 `version` bump.

## 역할별 작업 (Codex 프롬프트)
`codex/prompts/` 의 커스텀 프롬프트를 `~/.codex/prompts/` 에 복사하면 슬래시로 호출됩니다.
- `/hds-tokens`   — 토큰 조회/수정 (기획·디자인·퍼블 공통)
- `/hds-component` — 컴포넌트 조회/추가/코드화 (디자인·퍼블)
- `/hds-spec`     — 제품 설계서 작성/업데이트 (기획)

각 프롬프트는 위 소스 경로를 읽고 Claude 플러그인 스킬과 같은 규칙으로 동작합니다.

## Claude Code 플러그인과의 관계
Claude 사용자는 마켓플레이스로 `hds-design`/`hds-planning`/`hds-publish` 를 설치해 같은 콘텐츠를 스킬로 사용합니다.
두 하네스가 같은 파일을 참조하므로, 콘텐츠를 한 번 고치면 양쪽에 반영됩니다.
