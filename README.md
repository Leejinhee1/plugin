# HDS — 그룹 공식 디자인 시스템 하네스

기획·디자인·퍼블리셔가 **하나의 소스**에서 문서·토큰·컴포넌트를 공유하고, **코덱스와 클로드**에서 동일하게 호출하는 디자인 시스템 하네스입니다.
Hicksfield·shadcn처럼 skill / MCP / plugin으로 불러 씁니다. 부서에서 시작해 그룹사 공식 가이드로 확장하도록 설계했습니다.

## 이 저장소의 구성

```
plugin/  (= 사내 플러그인 마켓플레이스)
├── .claude-plugin/marketplace.json    # 마켓플레이스 카탈로그
├── plugins/
│   ├── hds-design/     디자인 — 디자인 시스템의 단일 소스 오브 트루스
│   │   └── design-system/   ★ tokens · guidelines · components · usage · brand
│   ├── hds-planning/   기획 — 제품 설계서(AI-리더블) + 프로토타입 생성
│   └── hds-publish/    퍼블 — 개발 적용 코드 변환 · 토큰 export · 접근성
├── examples/           (주)하늘 가상 브랜드 데모 — 설계서 + 동작 프로토타입
├── codex/              Codex 어댑터 (AGENTS.md · prompts · config)
└── docs/               아키텍처 · 시작하기 · 유지보수 가이드
```

## 핵심 설계 (유지보수 최우선)

1. **단일 소스 오브 트루스** — 디자인 시스템의 실제 내용은 `plugins/hds-design/design-system/` 에 **한 번만** 존재합니다. 토큰·컴포넌트·가이드를 여기서 고치면 모든 하네스·역할에 반영됩니다.
2. **얇은 하네스 어댑터** — Claude 스킬과 Codex 프롬프트는 같은 파일을 읽는 얇은 포인터입니다. 하네스가 늘어도 내용은 한 곳.
3. **2레이어 토큰** — core(원시값) → semantic(의미값). 리브랜딩·다크테마·그룹사 테마를 core만 바꿔 대응.
4. **표준 포맷** — 토큰은 W3C DTCG, 컴포넌트는 레지스트리(shadcn 방식). 벤더 종속 없이 장기 유지.
5. **명시적 버전 관리** — 공식 릴리스는 semver + CHANGELOG. 팀은 통제된 시점에만 업데이트를 받습니다.

## 빠른 시작

### Claude Code (플러그인)
```bash
# 사내 마켓플레이스 등록 (private repo 가능)
/plugin marketplace add leejinhee1/plugin
# 역할별 설치
/plugin install hds-design@hds
/plugin install hds-planning@hds   # hds-design 자동 동반
/plugin install hds-publish@hds
```
개발 중에는 설치 없이:
```bash
claude --plugin-dir ./plugins/hds-design --plugin-dir ./plugins/hds-planning --plugin-dir ./plugins/hds-publish
```

### Codex CLI (어댑터)
```bash
cp codex/prompts/*.md ~/.codex/prompts/     # /hds-tokens, /hds-component, /hds-spec
# 저장소를 열면 codex/AGENTS.md 규칙이 적용됩니다.
```

## 역할별 진입점

| 역할 | Claude 스킬 | Codex 프롬프트 |
| :-- | :-- | :-- |
| 기획 | `/hds-planning:product-spec`, `/hds-planning:prototype` | `/hds-spec` |
| 디자인 | `/hds-design:design-tokens`, `:design-guide`, `:component-catalog`, `:brand-visual`, `:figma-bridge` | `/hds-tokens`, `/hds-component` |
| 퍼블 | `/hds-publish:token-export`, `:component-build`, `:a11y-audit` | `/hds-component` |

## 더 읽기
- [**웹 소개 페이지**](https://leejinhee1.github.io/plugin/) — HDS 토큰으로 만든 랜딩(라이트/다크·컴포넌트 데모). GitHub Pages 활성화 후 접속됩니다. 소스: [`index.html`](index.html)
- [docs/user-guide.md](docs/user-guide.md) — **사용 가이드: 파트별 업무 시나리오 → 스킬 → 환경**
- [examples/README.md](examples/README.md) — 가상 브랜드 "(주)하늘" 실사용 예시 (설계서 → 프로토타입)
- [docs/getting-started.md](docs/getting-started.md) — 설치·역할별 첫 사용
- [docs/architecture.md](docs/architecture.md) — 왜 이렇게 설계했는가
- [docs/maintenance.md](docs/maintenance.md) — 토큰/컴포넌트 추가·버전·릴리스
- [plugins/hds-design/design-system/README.md](plugins/hds-design/design-system/README.md) — 소스 오브 트루스 규칙
