# HES — 그룹 공식 디자인 시스템 하네스

기획·디자인·퍼블리셔가 **하나의 소스**에서 문서·토큰·컴포넌트를 공유하고, **코덱스와 클로드**에서 동일하게 호출하는 디자인 시스템 하네스입니다.
[mattpocock/skills](https://github.com/mattpocock/skills) 방식의 **단일 플러그인** 구조로, 설치 명령 한 번이면 모든 역할의 스킬이 들어옵니다.

> **개발 중** — 현재 설치되는 스킬은 3개(`ask-hes` · `mcp-connectors` · `test-script`)입니다. 나머지는 미완성이라 비활성화(🚧)돼 있습니다. 자세한 현황과 대안은 [역할별 진입점](#역할별-진입점) 참조.

## 이 저장소의 구성

```
plugin/  (= 저장소 루트가 곧 플러그인이자 마켓플레이스)
├── .claude-plugin/
│   ├── plugin.json        # 단일 플러그인 "hes" — skills 배열 + mcpServers(번들 MCP 서버) 명시
│   └── marketplace.json   # source: "./" 단일 플러그인 마켓플레이스
├── skills/                # 역할별 스킬 버킷 (🚧 = 미완성, plugin.json 의 _disabledSkills 로 보관 — 설치되지 않음)
│   ├── general/           공통 — ask-hes (스킬 라우터) · mcp-connectors (커넥터·MCP 현황/관리)
│   ├── planning/          기획 — test-script · 🚧 product-spec · 🚧 prototype
│   ├── design/            디자인 — 🚧 design-tokens · 🚧 design-guide · 🚧 component-catalog · 🚧 brand-visual · 🚧 figma-bridge
│   └── publish/           퍼블 — 🚧 token-export · 🚧 registry-export · 🚧 component-build · 🚧 a11y-audit
├── agents/                design-reviewer 검수 에이전트
├── mcp/                   MCP 커넥터 레지스트리(SoT) — registry.json · mcp.example.json
├── design-system/         ★ 단일 소스 오브 트루스 — tokens · guidelines · components · usage · brand
├── cli/                   hes.mjs — `npx hes add` 컴포넌트 설치 CLI
├── scripts/               check-skills.mjs — 스킬 이름·경로·버전 정합성 체크 (`npm run check`)
├── package.json           bin: hes (컴포넌트를 쓰는 프로젝트가 devDependency 로 설치)
├── examples/              (주)하늘 가상 브랜드 데모 — 설계서 + 동작 프로토타입
├── codex/                 Codex 어댑터 (AGENTS.md · prompts · config)
└── docs/                  아키텍처 · 시작하기 · 사용 가이드 · 유지보수
```

## 핵심 설계 (유지보수 최우선)

1. **단일 소스 오브 트루스** — 디자인 시스템의 실제 내용은 `design-system/` 에 **한 번만** 존재합니다. 토큰·컴포넌트·가이드를 여기서 고치면 모든 하네스·역할에 반영됩니다.
2. **단일 플러그인, 역할별 스킬 버킷** — 플러그인은 `hes` 하나. 스킬은 `skills/planning|design|publish/` 로 분류하되 `plugin.json` 의 `skills` 배열에 명시적으로 나열합니다. 배열에 없는 폴더(초안 등)는 배포되지 않습니다. 미완성 스킬은 파일을 지우지 않고 `_disabledSkills` 에 보관하며, 완성되면 `skills` 배열로 옮기는 것만으로 활성화됩니다.
3. **얇은 하네스 어댑터** — Claude 스킬과 Codex 프롬프트는 같은 파일을 읽는 얇은 포인터입니다. 하네스가 늘어도 내용은 한 곳.
4. **HES 구조 그대로, 4레이어 토큰** — core(원시값) → semantic(의미값) → component(HES 컴포넌트 스펙) + platform(AOS·iOS·PC·Min). 리브랜딩·다크테마·그룹사 테마를 core/semantic만 바꿔 대응.
5. **표준 포맷** — 토큰은 W3C DTCG, 컴포넌트는 레지스트리(shadcn 호환). 벤더 종속 없이 장기 유지.
6. **명시적 버전 관리** — 공식 릴리스는 semver + CHANGELOG. 팀은 통제된 시점에만 업데이트를 받습니다.

## 빠른 시작

### Claude Code (플러그인)
```bash
/plugin marketplace add leejinhee1/plugin   # 사내 마켓플레이스 등록 (private repo 가능)
/plugin install hes@hes                     # 완성된 스킬이 늘면 /plugin update 로 받습니다
```
개발 중에는 설치 없이:
```bash
claude --plugin-dir .                       # 저장소 루트가 곧 플러그인
```

### Codex CLI (어댑터)
```bash
cp codex/prompts/*.md ~/.codex/prompts/     # /hes-tokens, /hes-component, /hes-spec
# 저장소를 열면 codex/AGENTS.md 규칙이 적용됩니다.
```

### 컴포넌트 가져다 쓰기 (제품 프로젝트에서)
디자인 시스템을 만드는 게 아니라 **컴포넌트를 소비**한다면, 위 플러그인 대신 자체 CLI를 씁니다.
```bash
npm i -D github:leejinhee1/plugin   # 또는 사내 npm 발행본
npx hes list                        # 설치 가능한 컴포넌트 13종 확인
npx hes add checkbox                # 코드→components/hes/, 토큰→styles/hes-tokens.css (의존·토큰 자동 포함)
```
전역 CSS에 `@import "./styles/hes-tokens.css";` 한 줄을 넣고 `import { Checkbox } from "@/components/hes/Checkbox"` 로 사용합니다.
자세한 옵션·다른 소비 경로(barrel import·shadcn CLI 호환)는 [design-system/components/README.md](design-system/components/README.md).

## 역할별 진입점

**어떤 스킬을 써야 할지 모르겠으면 `/hes:ask-hes`** — 상황을 설명하면 맞는 스킬과 순서를 알려주는 라우터입니다.
플러그인이 **제공(번들)** 하는 커넥터·MCP 서버의 공식 목록과 현재 연결 상태는 **`/hes:mcp-connectors`** 로 확인합니다. Figma MCP(공식 Dev Mode)는 플러그인이 직접 등록하므로 Figma 앱에서 Dev Mode MCP 서버만 켜면 됩니다.

> **개발 중** — 현재 설치되는 스킬은 `/hes:ask-hes` · `/hes:mcp-connectors` · `/hes:test-script` 3개뿐입니다. 나머지는 아직 미완성이라 비활성화(🚧)돼 있어 호출되지 않습니다.

| 역할 | 지금 쓸 수 있는 스킬 | 준비중 🚧 | Codex 프롬프트 |
| :-- | :-- | :-- | :-- |
| 기획 | `/hes:test-script` | product-spec, prototype | `/hes-spec` |
| 디자인 | — | design-tokens, design-guide, component-catalog, brand-visual, figma-bridge | `/hes-tokens`, `/hes-component` |
| 퍼블 | — (컴포넌트 설치는 `npx hes add` CLI 사용) | token-export, registry-export, component-build, a11y-audit | `/hes-component` |

검수는 어느 역할이든 `hes:design-reviewer` 에이전트로 — 에이전트는 스킬과 별개라 지금도 동작합니다.
준비중 스킬의 영역은 `design-system/` 소스(토큰·가이드·컴포넌트·usage)를 직접 참조해 수동으로 진행할 수 있습니다.

## 더 읽기
- [**웹 소개 페이지**](https://leejinhee1.github.io/plugin/) — HES 토큰으로 만든 랜딩(라이트/다크·컴포넌트 데모). GitHub Pages 활성화 후 접속됩니다. 소스: [`index.html`](index.html)
- [docs/user-guide.md](docs/user-guide.md) — **사용 가이드: 파트별 업무 시나리오 → 스킬 → 환경**
- [examples/README.md](examples/README.md) — 가상 브랜드 "(주)하늘" 실사용 예시 (설계서 → 프로토타입)
- [docs/getting-started.md](docs/getting-started.md) — 설치·역할별 첫 사용
- [docs/architecture.md](docs/architecture.md) — 왜 이렇게 설계했는가
- [docs/maintenance.md](docs/maintenance.md) — 토큰/컴포넌트 추가·버전·릴리스
- [design-system/README.md](design-system/README.md) — 소스 오브 트루스 규칙
- [design-system/components/README.md](design-system/components/README.md) — 컴포넌트 13종 카탈로그 · Figma 매핑 · 가져다 쓰는 법
