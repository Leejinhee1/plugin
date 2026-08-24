# HES 사용 가이드 — 파트별 업무 시나리오

> 이 문서는 기획·디자인·퍼블리셔가 **실제 업무 상황에서 어떤 스킬을 어떤 환경에서 쓰는지**를 안내합니다.
> 업무 시나리오 예시는 데모 프로젝트 (주)하늘의 "하늘" 앱(`examples/`) 기준이며, 실제 제품 이름으로 바꿔 쓰면 됩니다. 브랜드 정본(토큰·가이드·brand/)은 3.0.0부터 **하나머니 / Hana Experience System(HES)** 기준입니다.

## ⚠️ 개발 현황 — 지금 실행되는 스킬은 4개입니다

HES는 개발 중입니다. 아래 시나리오 중 **🚧 준비중** 표시가 붙은 것은 해당 스킬이 아직 완성되지 않아 설치되지 않으며, `/hes:...` 로 호출해도 실행되지 않습니다.

| 상태 | 스킬 |
| :-- | :-- |
| ✅ 사용 가능 | `/hes:ask-hes` · `/hes:mcp-connectors` · `/hes:test-script` · `/hes:spec-lookup` |
| ✅ 사용 가능 (스킬 아님) | `hes:design-reviewer` 에이전트 · `npx hes` CLI · Codex 프롬프트 3종 |
| 🚧 준비중 | product-spec · prototype · design-tokens · design-guide · component-catalog · brand-visual · figma-bridge · token-export · registry-export · component-build · a11y-audit |

준비중 스킬의 파일은 저장소에 그대로 있고 `.claude-plugin/plugin.json` 의 `_disabledSkills` 에 보관돼 있습니다 — 완성되면 `skills` 배열로 옮기는 것만으로 활성화됩니다. **그동안 해당 영역의 업무는 `design-system/` 소스를 직접 참조해 수동으로 진행**하며, 각 시나리오에 대안 경로를 적어두었습니다.

---

## 1. 환경 선택 — 나는 어디서 쓰면 되나

| 내 상황 | 권장 환경 | 준비 |
| :-- | :-- | :-- |
| 기획자 — 코드/터미널 경험 없음 | **Claude Code 데스크톱 앱 또는 웹**(claude.ai/code) | 아래 "공통 설치" 1회 |
| 디자이너 — 문서·토큰 관리, Figma 병행 | **Claude Code** (+ 선택: Figma) | 공통 설치 + Figma 쓰면 Figma 앱에서 Dev Mode MCP만 켜기(서버는 플러그인이 제공) |
| 퍼블리셔 — 내 프로젝트 저장소에서 작업 | **Claude Code CLI** (프로젝트 폴더에서 실행) 또는 **Codex CLI** | 공통 설치, Codex는 §5 참고 |
| HES 자체를 수정하는 관리자 | Claude Code CLI + 이 저장소 클론 | `claude --plugin-dir` 개발 모드 (docs/maintenance.md) |

### 공통 설치 (1회, 약 1분)

Claude Code 안에서:

```
/plugin marketplace add Leejinhee1/plugin
/plugin install hes@hes               ← 이 한 번으로 기획·디자인·퍼블 스킬 전체 설치
```

- 파트에 상관없이 **설치는 이 두 줄이 전부**입니다. 스킬은 역할별로 구분되어 있으니 내 파트 것만 쓰면 됩니다. (완성되면 product-spec은 기획, design-tokens는 디자인, token-export는 퍼블 진입점이 됩니다 — 현재는 모두 🚧 준비중)
- 팀 프로젝트 저장소에서 모두가 자동으로 쓰게 하려면: `claude plugin install hes@hes --scope project` 후 `.claude/settings.json` 커밋.
- 업데이트 공지가 오면: `/plugin update hes@hes` (또는 `/plugin` 메뉴에서 Update).

> 스킬 호출 방법: 채팅창에 `/hes:test-script` 처럼 입력하거나, 그냥 자연어로 요청해도 Claude가 알아서 해당 스킬을 사용합니다. 어떤 걸 쓸지 모르겠으면 `/hes:ask-hes`.

---

## 2. 기획 파트

**설치**: `hes` (공통 설치 1회) · **환경**: Claude Code 데스크톱/웹 (터미널 불필요)

### 시나리오 K1. 새 기능 기획서를 쓴다 🚧 준비중
> "다음 스프린트에 '미세먼지 알림' 기능을 넣기로 했다. 설계서를 써야 한다."

1. product-spec 스킬이 표준 템플릿으로 초안을 생성합니다.
2. 문제 정의·사용자 시나리오·플로우를 대화로 채웁니다.
3. **화면 명세는 HES 이름으로**: "알림 카드는 Card + Badge(warning), 설정 버튼은 Button secondary" 처럼.
4. 완성본은 제품 저장소 `docs/specs/미세먼지-알림.md` 로 저장.

**지금 하는 법**: 템플릿 `skills/planning/product-spec/templates/spec-template.md` 를 복사해 직접 작성하고, 쓸 수 있는 컴포넌트는 `design-system/components/registry.json` 에서 확인합니다.
**결과물**: AI-리더블 설계서 — 이 문서 하나로 디자인·퍼블·프로토타입이 파생됩니다.
**참고 정본**: `examples/specs/today-briefing.md` (오늘 브리핑 설계서)

### 시나리오 K2. 설계서로 클릭 가능한 프로토타입을 만든다 🚧 준비중
> "내일 리뷰 미팅 전에 이해관계자에게 보여줄 화면이 필요하다."

1. K1의 설계서를 열어둔 상태에서 prototype 스킬을 실행합니다.
2. 실제 HES 컴포넌트·토큰으로 조립된 동작 프로토타입(HTML)이 생성됩니다 — 디자인 시안 없이도 브랜드가 입혀진 화면이 나옵니다.
3. 브라우저로 열어 시연. empty/loading/error 상태·다크모드까지 포함됩니다.

**지금 하는 법**: `examples/haneul-prototype/index.html` 을 출발점으로 복사한 뒤, `design-system/usage/screens/` 의 화면 패턴과 `design-system/components/` 소스를 조합해 직접 만듭니다.
**주의**: 프로토타입에서 "이 부분만 색 다르게"는 금지 — 시스템에 없는 표현이 필요하면 K3으로.
**참고 정본**: `examples/haneul-prototype/index.html`

### 시나리오 K3. 필요한 컴포넌트가 시스템에 없다
> "타임라인 컴포넌트가 필요한데 카탈로그에 없다."

1. 설계서의 "신규 컴포넌트 후보" 항목에 요구사항을 적습니다(용도·상태·예시 화면).
2. 디자인 파트에 전달 → 디자인이 시나리오 D2로 추가하면, 다음 `/plugin update` 후 프로토타입에서 바로 사용 가능.

### 시나리오 K4. 기존 설계서를 업데이트한다 🚧 준비중
> "스펙이 바뀌었다. 문서와 구현이 어긋나기 시작했다."

1. 설계서 파일을 열고 product-spec 스킬로 변경 반영 — 프론트매터 version/updated 와 상단 changelog가 함께 갱신됩니다.
2. 원칙: **구현과 다르면 설계서를 먼저 고친다.** 설계서가 진실이어야 다음 파생물이 올바릅니다.

**지금 하는 법**: 프론트매터의 version/updated 와 상단 changelog를 직접 갱신합니다. 원칙은 그대로 적용됩니다.

### 시나리오 K5. 기획서로 QA 테스트 시나리오를 만든다 ✅
> "화면 정의가 확정됐다. QA에 넘길 테스트 시나리오를 손으로 수백 줄 쓰고 있다."

1. `/hes:test-script <Figma URL 또는 파일 경로>` — **Figma URL·PDF·단일 이미지·이미지가 든 폴더** 아무거나 됩니다(폴더는 파일명 순으로 읽고 표지·여백 페이지는 건너뜁니다). 기획서가 Figma에 있으면 URL을 그대로 붙여넣으세요 — Figma MCP로 스펙 텍스트를 통째로 읽습니다(연결 확인은 `/hes:mcp-connectors`).
2. 스킬이 화면ID·영역·CASE 분기·"터치 시 >" 액션·엣지 케이스(미로그인·외국인·빈 데이터)를 추출해 시나리오를 만들고, 표로 보여줍니다. 이 단계에서 수정·추가·삭제를 요청하세요.
3. 출력 방식을 고릅니다 — **클립보드 복사**(권장·권한 불필요, 시트 A1에 `Cmd+V`) / **CSV**(`~/Downloads/`, 백업 겸 재수정 원본) / **Google Sheets 자동 작성**(서비스 계정 권한이 있을 때만).
4. CSV를 직접 열어 고친 뒤 "이 내용으로 다시 옮겨줘"라고 하면, 수정된 파일을 다시 읽어 그대로 재출력합니다.

**주의**: 입력이 HES 설계서일 필요는 없습니다 — 외부 팀이 준 PDF 기획서도 그대로 넣으면 됩니다. 회사 계정은 서비스 계정 키 발급이 막힌 경우가 많아 **클립보드 + CSV**가 기본 경로입니다.

### 시나리오 K6. 확정된 사내 설계서를 물어본다 ✅
> "이 화면이 지금 어떻게 동작하기로 돼 있더라? 설계서 어디 있는지부터 찾고 있다."

1. **처음 한 번만 대상 저장소를 알려줍니다** — 프로젝트에 `.hes/spec-source.json` 을 두거나(`{ "repo": "<owner>/<name>", "ref": "main", "specsDir": "docs" }`) 환경변수 `HES_SPEC_REPO` 를 설정합니다. 팀이 공유하는 설정이고 비밀이 아닙니다.
2. `/hes:spec-lookup <질문>` — 화면ID(`CRD_202`)든 화면명이든 "정산 요청하면 어떻게 되나" 같은 자연어든 됩니다.
3. 스킬이 **매 호출 저장소를 최신으로 동기화한 뒤**(sparse-checkout 캐시, `~/.cache/hes/spec-repos/`) 해당 문서를 찾아 읽고, **파일 경로 · 기준일/설계버전 · 조회 커밋**을 근거로 답합니다.
4. 설계서에 없으면 **없다고 답합니다.** "설계서에 없다"와 "아직 명세되지 않았다(스텁)"를 구분해서 알려주므로, 답이 없는 것을 "그런 기능이 없다"로 오해하지 않게 됩니다.

**주의**: 설계서 저장소는 대개 **비공개**입니다. 읽기 권한이 없으면 스킬이 우회하지 않고 접근 요청을 안내합니다(`gh auth status` 로 계정 확인). 캐시는 비공개 설계서의 로컬 사본이므로 공유 머신에서는 사용 후 지우세요.

---

## 3. 디자인 파트

**설치**: `hes` (공통 설치 1회) · **환경**: Claude Code (+ Figma 쓰면 Figma 앱 Dev Mode MCP만 켜기 — 서버는 플러그인이 제공)

### 시나리오 D1. 뭐가 있는지 확인하고, 올바른 사용법을 안내한다 🚧 준비중
> "주니어가 버튼을 두 개 다 primary로 썼다. 근거를 들어 피드백하고 싶다."

- component-catalog — 컴포넌트 목록·상태 조회
- "Button 사용 규칙 알려줘" — spec/usage 기반으로 답변(화면당 primary 1개, 안티패턴 포함)
- design-guide — 시안이 6대 원칙에 맞는지 원칙 번호를 근거로 리뷰

**지금 하는 법**: 목록은 `design-system/components/registry.json`, 사용 규칙은 각 컴포넌트의 `usage.md`·`spec.md`, 원칙은 `design-system/guidelines/principles.md` 를 직접 읽습니다. 시안 검수는 `hes:design-reviewer` 에이전트가 지금도 수행합니다.

### 시나리오 D2. 새 컴포넌트를 시스템에 추가한다 🚧 준비중
> "기획에서 타임라인 컴포넌트 요청이 왔다."

1. HES 저장소를 연 Claude Code에서 component-catalog 스킬로 추가를 요청합니다.
2. 스킬이 3종 세트(spec.md + 코드 + usage.md)를 Button 정본과 같은 구조로 만들고 registry에 등록합니다.
3. `hes:design-reviewer` 에이전트에게 검수 요청: "@hes:design-reviewer 타임라인 검수해줘" — 토큰 준수·접근성·중복 여부를 심층 점검.
4. PR → 머지 → 버전 bump. 이후 전 파트가 `/plugin update` 로 받습니다.

**지금 하는 법**: `design-system/components/button/` 을 정본 삼아 3종 세트를 같은 구조로 직접 만들고 `registry.json` 에 등록합니다. 3·4단계(검수·릴리스)는 그대로 유효합니다.
**주의**: 기존 컴포넌트 조합으로 되는 건 새로 만들지 않습니다(원칙 1).

### 시나리오 D3. 색·간격·모션 토큰을 바꾼다 (리브랜딩 포함) 🚧 준비중
> "브랜드 컬러 톤을 조정하기로 했다." / "계열사용 테마가 필요하다."

1. HES 저장소에서 design-tokens 스킬로 값을 바꿉니다.
2. **core 토큰 한 곳만** 바뀌고, semantic → 컴포넌트 → 프로토타입 전체가 따라옵니다. (1.2.0에서 warning 색 교체가 컴포넌트 코드 무수정으로 전파된 것이 실증 사례)
3. 색 변경 시 스킬이 대비(WCAG AA)·다크 대응을 함께 점검하고, CHANGELOG·버전 bump까지 안내합니다.
4. 머지 후 퍼블 파트에 공지 → 퍼블은 시나리오 P4로 재생성.

**지금 하는 법**: `design-system/tokens/core.tokens.json` 을 직접 수정합니다 — 2번의 전파 구조는 스킬과 무관하게 동작합니다. 대비 점검·CHANGELOG·버전 bump는 수동으로 챙기세요.

### 시나리오 D4. 브랜드가 녹아든 비주얼·영상을 만든다 🚧 준비중
> "신기능 홍보 키비주얼과 15초 인트로 영상 콘티가 필요하다."

1. brand-visual 스킬이 브랜드 규범(visual-style·voice-tone)을 근거로 시안 방향·카피를 제안합니다.
2. 영상은 motion-video.md 의 토큰-타임라인 매핑(듀레이션·이징 프레임 환산표)대로 콘티가 설계됩니다 — 제품 UI와 같은 모션 언어.
3. 로고 원본은 `brand/assets/logo.svg`(라이트)/`logo-dark.svg`(다크)만 사용.

**지금 하는 법**: `design-system/brand/` 의 `visual-style.md`·`voice-tone.md`·`motion-video.md` 를 직접 근거로 삼습니다. 2·3번 규범은 그대로 유효합니다.

### 시나리오 D5. Figma와 동기화한다 (선택) 🚧 준비중
> "디자이너들은 Figma에서 작업한다. 토큰을 Figma Variables로 쓰고 싶다."

1. **Figma MCP 서버는 플러그인이 이미 제공**합니다 — Figma 데스크톱 앱에서 Dev Mode MCP 서버만 켜면 됩니다(서버 추가·토큰 불필요). 연결 확인은 **`/hes:mcp-connectors`**(사용 가능) — 제공 커넥터 목록·연결 현황·미연결 시 켜는 법이 나옵니다.
2. figma-bridge 스킬이 토큰을 Figma Variables로 발행합니다.
3. 반대로 Figma에서 값이 바뀌었으면 diff를 확인 — 의도된 변경이면 코드 토큰에 반영(D3), 아니면 Figma를 코드에 맞춥니다.

**지금 하는 법**: 1번(커넥터 연결·확인)은 지금도 됩니다. 2·3번 동기화는 준비중이라 Figma Variables를 수동으로 맞춰야 합니다.
**원칙**: 충돌 시 **코드가 진실**입니다. Figma는 협업 채널.

---

## 4. 퍼블 파트

**설치**: `hes` (공통 설치 1회) · **환경**: **내 프로젝트 폴더에서** Claude Code CLI 실행 (`cd my-app && claude`)

### 시나리오 P1. 새 프로젝트에 HES를 처음 셋업한다 🚧 준비중 (CLI로 대체 가능)
> "신규 React 프로젝트에 디자인 시스템을 깔아야 한다."

1. token-export — `tokens.css`(+ Tailwind preset, TS 타입)가 프로젝트에 생성되고 엔트리 import까지 안내됩니다.
2. component-build — 필요한 컴포넌트가 `src/components/ui/` 에 설치됩니다(shadcn처럼 소스를 소유).
3. 빌드/타입체크 확인은 스킬이 함께 수행합니다.

**지금 하는 법**: 스킬 없이 **CLI가 이미 동작합니다** — 이 시나리오는 전부 대체됩니다.
```bash
npm i -D github:leejinhee1/plugin
npx hes list                  # 설치 가능한 컴포넌트 13종
npx hes add button input card # 코드 + 토큰 CSS 자동 설치
```
전역 CSS에 `@import "./styles/hes-tokens.css";` 추가 후 사용. 빌드/타입체크는 직접 확인하세요.

### 시나리오 P2. 설계서·프로토타입을 받아 실제 화면을 구현한다
> "기획의 '미세먼지 알림' 설계서와 프로토타입이 넘어왔다."

1. 설계서의 §5 화면 명세가 이미 HES 컴포넌트·토큰 이름으로 되어 있으므로, "이 설계서대로 알림 화면 구현해줘"라고 요청.
2. 없는 컴포넌트가 나오면 임의로 만들지 말고 → 기획 K3/디자인 D2 경로로. (프로토타입이 HES를 지켰다면 **재작성이 아니라 정리** 수준으로 끝납니다)
3. 반복 화면 유형은 `usage/screens/` 패턴(login·list-detail·form·feedback-states)을 그대로 따릅니다.

### 시나리오 P3. 배포 전 접근성을 점검한다 🚧 준비중
> "QA 전에 접근성 이슈를 걸러내고 싶다."

- a11y-audit — 색 대비(수치 계산)·키보드·포커스·aria·모션 민감성을 pass/fail + 수정안으로 리포트합니다.
- 대비 미달이 토큰 문제면 디자인 파트(D3)로 에스컬레이션 — 화면에서 색을 덮어쓰지 않습니다.

**지금 하는 법**: 기준 문서 `design-system/guidelines/color.md` + `principles.md`(원칙 3)로 수동 검토하거나, `hes:design-reviewer` 에이전트에 검수를 맡깁니다(접근성 포함). 프로젝트에는 axe-core / eslint-plugin-jsx-a11y 도입을 권장.

### 시나리오 P4. HES가 업데이트됐다 (토큰/컴포넌트 변경 수신) 🚧 준비중 (CLI로 대체 가능)
> "디자인 시스템 1.3.0이 릴리스됐다는 공지가 왔다."

1. `/plugin update hes@hes`
2. token-export 재실행 — tokens.css 재생성. **산출물은 절대 손으로 고치지 않았어야** 충돌이 없습니다.
3. 컴포넌트가 바뀌었으면 component-build 재실행 — 프로젝트에서 커스터마이즈한 부분은 diff로 검토 후 병합.

**지금 하는 법**: 2·3번은 CLI로 대체됩니다 — `npx hes list` 로 변경분 확인 후 `npx hes add <이름>` 재실행(토큰 CSS 포함). diff 검토 원칙은 동일합니다.

---

## 5. Codex CLI 사용자 (파트 무관)

Codex를 쓰는 팀원도 **같은 소스, 같은 규칙**으로 작업합니다.

```bash
# 1회 설치
cp codex/prompts/*.md ~/.codex/prompts/
```

Codex 프롬프트 3종은 `codex/prompts/` 파일을 직접 복사해 쓰는 방식이라 **플러그인의 스킬 활성화 여부와 무관하게 지금도 동작합니다.**

| 업무 | Codex 명령 | Claude 대응 스킬 |
| :-- | :-- | :-- |
| 설계서 작성/갱신 (기획) | `/hes-spec 미세먼지 알림` | product-spec 🚧 |
| 토큰 조회/수정 (디자인·퍼블) | `/hes-tokens warning 색 근거 알려줘` | design-tokens 🚧 |
| 컴포넌트 조회/추가/설치 (디자인·퍼블) | `/hes-component card 설치해줘` | component-catalog / component-build 🚧 |

- HES 저장소(또는 심볼릭 링크)가 작업 폴더에 있으면 `codex/AGENTS.md` 규칙이 자동 적용됩니다.
- Claude 스킬이 준비중인 동안에는 오히려 **Codex 프롬프트 쪽이 커버 범위가 넓습니다** — 설계서·토큰·컴포넌트 업무는 Codex 경로를 권장합니다.
- 프로토타입 생성·브랜드 비주얼·Figma 동기화는 양쪽 모두 준비중입니다.

---

## 6. 파트 간 릴레이 — 한 기능의 전체 흐름

"미세먼지 알림" 기능 하나가 흐르는 표준 경로:

```
기획  K1 설계서(HES 이름으로 명세) ──▶ K2 프로토타입(리뷰 통과)
                │ 없는 컴포넌트 발견(K3)
                ▼
디자인 D2 컴포넌트 추가 + reviewer 검수 ──▶ 릴리스(버전 bump)
                │
                ▼
퍼블  P4 업데이트 수신 ──▶ P2 화면 구현 ──▶ P3 접근성 점검 ──▶ 배포
                                                    ▲
QA    K5 테스트 시나리오 생성(화면 정의 확정 시점) ──────┘
```

핵심 규칙 세 가지만 기억하면 됩니다:
1. **값은 토큰으로, 화면에서 우회 금지** — 필요하면 시스템에 승격.
2. **설계서·레지스트리가 공용어** — 파트 간 전달물은 항상 HES 이름으로.
3. **산출물은 재생성, 원본만 수정** — tokens.css·프로토타입을 손으로 고치지 않기.

---

## 7. 자주 묻는 질문

| 질문 | 답 |
| :-- | :-- |
| 스킬 이름을 못 외우겠어요 | `/hes:ask-hes` 에 상황을 설명하면 맞는 스킬과 순서를 알려줍니다. 준비중인 단계면 그 사실과 대안까지 함께 알려줍니다. |
| `/hes:xxx` 를 쳤는데 아무 일도 안 일어나요 | 그 스킬이 아직 🚧 준비중이라 설치되지 않은 경우입니다. 문서 맨 위 "개발 현황" 표에서 사용 가능 여부를 확인하세요. |
| 업데이트했는데 반영이 안 돼요 | `/plugin update` 후 새 세션을 시작하거나 `/reload-plugins`. 퍼블은 P4의 재생성까지 해야 프로젝트에 반영됩니다. |
| Figma(MCP)가 연결됐는지 모르겠어요 | `/hes:mcp-connectors` — 플러그인이 **제공하는** MCP 서버 목록과 현재 연결 상태, 미연결 시 연결 방법을 보여줍니다. Figma 서버(공식 Dev Mode)는 플러그인이 이미 등록하므로 Figma 앱에서 Dev Mode MCP만 켜면 됩니다. |
| 우리 제품은 React가 아니에요 | component-build(🚧)가 spec 기준으로 해당 프레임워크 구현을 생성할 예정입니다. 그전까지는 `design-system/components/<name>/spec.md` 를 근거로 직접 포팅하세요. |
| 급해서 색을 하드코딩했어요 | 다음 PR에서 반드시 토큰으로 교체하세요. `design-reviewer` 에이전트가 하드코딩을 잡아냅니다. |
| 그룹사/계열사 테마는? | core 토큰만 교체한 브랜드 오버라이드로 대응합니다 — docs/maintenance.md "확장" 참조. |

**더 깊은 내용**: 설치 상세 [getting-started.md](./getting-started.md) · 구조/철학 [architecture.md](./architecture.md) · 시스템 수정 [maintenance.md](./maintenance.md)
