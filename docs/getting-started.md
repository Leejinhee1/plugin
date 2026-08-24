# 시작하기

> **⚠️ 개발 현황** — HES는 개발 중이며 현재 설치되는 스킬은 `/hes:ask-hes` · `/hes:mcp-connectors` · `/hes:test-script` · `/hes:spec-lookup` 4개입니다. 나머지는 🚧 준비중이라 `.claude-plugin/plugin.json` 의 `_disabledSkills` 에 보관돼 있고 호출되지 않습니다. 스킬이 아닌 경로(`hes:design-reviewer` 에이전트 · `npx hes` CLI · Codex 프롬프트)는 지금도 전부 동작합니다. 자세한 대안은 [user-guide.md](./user-guide.md) 참고.

## 1. 사전 준비
- Claude Code 최신 버전(`/plugin` 명령이 보여야 함).
- (퍼블) Node.js + React/Tailwind 프로젝트.
- (선택) Figma — Figma 동기화를 쓸 경우. **Figma MCP 서버(공식 Dev Mode)는 플러그인이 직접 제공**하므로 따로 설치할 필요 없이 Figma 데스크톱 앱에서 Dev Mode MCP 서버만 켜면 됩니다. 설치 후 `/hes:mcp-connectors` 로 제공 커넥터 목록과 연결 여부를 확인할 수 있습니다.

## 2. 설치

### A. 사내 마켓플레이스로 설치 (권장, 팀 배포)
```bash
/plugin marketplace add leejinhee1/plugin      # private repo 가능
/plugin install hes@hes                        # 이 한 번으로 기획·디자인·퍼블 스킬 전체 설치
```
> 팀 공유는 프로젝트 스코프로: `claude plugin install hes@hes --scope project` → `.claude/settings.json` 커밋.

### B. 개발/체험용 (설치 없이)
```bash
claude --plugin-dir .        # 저장소 루트가 곧 플러그인
```
수정 후에는 `/reload-plugins`.

### C. Codex CLI
```bash
cp codex/prompts/*.md ~/.codex/prompts/
# 필요 시 codex/config.example.toml 을 ~/.codex/config.toml 에 병합
```

## 3. 역할별 첫 사용

### 지금 바로 되는 것
- `/hes:ask-hes` → 내 상황에 맞는 스킬·플로우 안내(준비중 여부와 대안 포함).
- `/hes:test-script <Figma URL 또는 기획서 경로>` → 기획서(Figma·PDF·이미지·이미지 폴더)에서 QA 테스트 시나리오 생성.
- `/hes:spec-lookup <질문>` → 사내 설계서 저장소에서 화면·정책을 찾아 근거와 함께 답변. 대상 저장소는 처음 한 번만 알려주면 됩니다 — `--repo <owner>/<name> --save-global` 로 `~/.hes/spec-source.json` 에 저장되고, 다음부터는 어느 프로젝트에서든 자동으로 잡힙니다(비공개 레포 읽기 권한 필요).
- `/hes:mcp-connectors` → 제공 커넥터 목록·연결 현황 확인.
- `npx hes list` / `npx hes add button` → 컴포넌트를 내 프로젝트에 설치(토큰 CSS 포함).
- `@hes:design-reviewer` → 토큰 준수·가이드 부합·접근성 심층 검수.

### 기획 🚧 준비중
1. product-spec → 템플릿 기반 설계서 초안. *지금은* `skills/planning/product-spec/templates/spec-template.md` 복사해 직접 작성.
2. 화면을 HES 컴포넌트/토큰 이름으로 채운다. (`design-system/components/registry.json` 참조)
3. prototype → 설계서로 동작 프로토타입 생성. *지금은* `examples/haneul-prototype/index.html` 을 출발점으로.

### 디자인 🚧 준비중
- component-catalog → 있는 컴포넌트 확인 / 새 컴포넌트 추가. *지금은* `design-system/components/` 직접 조회·편집.
- design-tokens → core 토큰만 바꿔 전체 반영. *지금은* `design-system/tokens/core.tokens.json` 직접 수정(전파 구조는 그대로 동작).
- design-guide → 결정이 원칙에 맞는지 검토. *지금은* `design-system/guidelines/principles.md` 직접 참조.

### 퍼블 🚧 준비중 (CLI로 대체 가능)
1. token-export → `tokens.css` + Tailwind preset 생성. *지금은* `npx hes add` 가 토큰 CSS를 함께 설치.
2. component-build → 프로젝트에 컴포넌트 설치. *지금은* `npx hes add button`.
3. a11y-audit → 접근성 점검. *지금은* `design-system/guidelines/color.md` 기준 수동 검토 또는 `design-reviewer` 에이전트.

## 4. 검증
```bash
npm run check                 # 스킬 이름·경로·버전 정합성 (validate 가 못 보는 것)
claude plugin validate .      # 매니페스트 검증 (--strict 는 쓰지 않음 — maintenance.md 참조)
```
