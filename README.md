# HDS — 그룹 공식 디자인 시스템 하네스

기획·디자인·퍼블리셔가 **하나의 소스**에서 문서·토큰·컴포넌트를 공유하고, **코덱스와 클로드**에서 동일하게 호출하는 디자인 시스템 하네스입니다.
[mattpocock/skills](https://github.com/mattpocock/skills) 방식의 **단일 플러그인** 구조로, 설치 명령 한 번이면 모든 역할의 스킬이 들어옵니다.

## 이 저장소의 구성

```
plugin/  (= 저장소 루트가 곧 플러그인이자 마켓플레이스)
├── .claude-plugin/
│   ├── plugin.json        # 단일 플러그인 "hds" — skills 배열에 배포 스킬을 명시
│   └── marketplace.json   # source: "./" 단일 플러그인 마켓플레이스
├── skills/                # 역할별 스킬 버킷 (설치는 한 번에 전부)
│   ├── general/           공통 — ask-hds (스킬 라우터) · mcp-connectors (MCP 커넥터 조회·관리)
│   ├── planning/          기획 — product-spec · prototype
│   ├── design/            디자인 — design-tokens · design-guide · component-catalog · brand-visual · figma-bridge
│   └── publish/           퍼블 — token-export · component-build · a11y-audit
├── agents/                design-reviewer 검수 에이전트
├── design-system/         ★ 단일 소스 오브 트루스 — tokens · guidelines · components · usage · brand
├── mcp/                    MCP 커넥터 레지스트리(SoT) — registry.json · 예시 .mcp.json
├── examples/              (주)하늘 가상 브랜드 데모 — 설계서 + 동작 프로토타입
├── codex/                 Codex 어댑터 (AGENTS.md · prompts · config)
└── docs/                  아키텍처 · 시작하기 · 사용 가이드 · 유지보수
```

## 핵심 설계 (유지보수 최우선)

1. **단일 소스 오브 트루스** — 디자인 시스템의 실제 내용은 `design-system/` 에 **한 번만** 존재합니다. 토큰·컴포넌트·가이드를 여기서 고치면 모든 하네스·역할에 반영됩니다.
2. **단일 플러그인, 역할별 스킬 버킷** — 플러그인은 `hds` 하나. 스킬은 `skills/planning|design|publish/` 로 분류하되 `plugin.json` 의 `skills` 배열에 명시적으로 나열합니다. 배열에 없는 폴더(초안 등)는 배포되지 않습니다.
3. **얇은 하네스 어댑터** — Claude 스킬과 Codex 프롬프트는 같은 파일을 읽는 얇은 포인터입니다. 하네스가 늘어도 내용은 한 곳.
4. **2레이어 토큰** — core(원시값) → semantic(의미값). 리브랜딩·다크테마·그룹사 테마를 core만 바꿔 대응.
5. **표준 포맷** — 토큰은 W3C DTCG, 컴포넌트는 레지스트리(shadcn 방식). 벤더 종속 없이 장기 유지.
6. **명시적 버전 관리** — 공식 릴리스는 semver + CHANGELOG. 팀은 통제된 시점에만 업데이트를 받습니다.

## 빠른 시작

### Claude Code (플러그인)
```bash
/plugin marketplace add leejinhee1/plugin   # 사내 마켓플레이스 등록 (private repo 가능)
/plugin install hds@hds                     # 이 한 번으로 기획·디자인·퍼블 전체 설치
```
개발 중에는 설치 없이:
```bash
claude --plugin-dir .                       # 저장소 루트가 곧 플러그인
```

### Codex CLI (어댑터)
```bash
cp codex/prompts/*.md ~/.codex/prompts/     # /hds-tokens, /hds-component, /hds-spec
# 저장소를 열면 codex/AGENTS.md 규칙이 적용됩니다.
```

## 역할별 진입점

**어떤 스킬을 써야 할지 모르겠으면 `/hds:ask-hds`** — 상황을 설명하면 맞는 스킬과 순서를 알려주는 라우터입니다.

| 역할 | Claude 스킬 | Codex 프롬프트 |
| :-- | :-- | :-- |
| 기획 | `/hds:product-spec`, `/hds:prototype` | `/hds-spec` |
| 디자인 | `/hds:design-tokens`, `/hds:design-guide`, `/hds:component-catalog`, `/hds:brand-visual`, `/hds:figma-bridge` | `/hds-tokens`, `/hds-component` |
| 퍼블 | `/hds:token-export`, `/hds:component-build`, `/hds:a11y-audit` | `/hds-component` |

검수는 어느 역할이든 `hds:design-reviewer` 에이전트로.

## 더 읽기
- [**웹 소개 페이지**](https://leejinhee1.github.io/plugin/) — HDS 토큰으로 만든 랜딩(라이트/다크·컴포넌트 데모). GitHub Pages 활성화 후 접속됩니다. 소스: [`index.html`](index.html)
- [docs/user-guide.md](docs/user-guide.md) — **사용 가이드: 파트별 업무 시나리오 → 스킬 → 환경**
- [examples/README.md](examples/README.md) — 가상 브랜드 "(주)하늘" 실사용 예시 (설계서 → 프로토타입)
- [docs/getting-started.md](docs/getting-started.md) — 설치·역할별 첫 사용
- [docs/architecture.md](docs/architecture.md) — 왜 이렇게 설계했는가
- [docs/maintenance.md](docs/maintenance.md) — 토큰/컴포넌트 추가·버전·릴리스
- [design-system/README.md](design-system/README.md) — 소스 오브 트루스 규칙
