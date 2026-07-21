# HES 사용 가이드 — 파트별 업무 시나리오

> 이 문서는 기획·디자인·퍼블리셔가 **실제 업무 상황에서 어떤 스킬을 어떤 환경에서 쓰는지**를 안내합니다.
> 업무 시나리오 예시는 데모 프로젝트 (주)하늘의 "하늘" 앱(`examples/`) 기준이며, 실제 제품 이름으로 바꿔 쓰면 됩니다. 브랜드 정본(토큰·가이드·brand/)은 3.0.0부터 **하나머니 / Hana Experience System(HES)** 기준입니다.

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

- 파트에 상관없이 **설치는 이 두 줄이 전부**입니다. 스킬이 `/hes:product-spec`(기획), `/hes:design-tokens`(디자인), `/hes:token-export`(퍼블)처럼 역할별로 구분되어 있으니 내 파트 것만 쓰면 됩니다.
- 팀 프로젝트 저장소에서 모두가 자동으로 쓰게 하려면: `claude plugin install hes@hes --scope project` 후 `.claude/settings.json` 커밋.
- 업데이트 공지가 오면: `/plugin update hes@hes` (또는 `/plugin` 메뉴에서 Update).

> 스킬 호출 방법: 채팅창에 `/hes:component-catalog` 처럼 입력하거나, 그냥 자연어로 "HES 컴포넌트 뭐 있어?"라고 물어도 Claude가 알아서 해당 스킬을 사용합니다.

---

## 2. 기획 파트

**설치**: `hes` (공통 설치 1회) · **환경**: Claude Code 데스크톱/웹 (터미널 불필요)

### 시나리오 K1. 새 기능 기획서를 쓴다
> "다음 스프린트에 '미세먼지 알림' 기능을 넣기로 했다. 설계서를 써야 한다."

1. `/hes:product-spec 미세먼지 알림` — 표준 템플릿으로 초안이 생성됩니다.
2. 문제 정의·사용자 시나리오·플로우를 대화로 채웁니다.
3. **화면 명세는 HES 이름으로**: "알림 카드는 Card + Badge(warning), 설정 버튼은 Button secondary" 처럼. 뭐가 있는지 모르면 그 자리에서 "쓸 수 있는 컴포넌트 보여줘"라고 물으면 됩니다(→ 자동으로 `component-catalog` 조회).
4. 완성본은 제품 저장소 `docs/specs/미세먼지-알림.md` 로 저장.

**결과물**: AI-리더블 설계서 — 이 문서 하나로 디자인·퍼블·프로토타입이 파생됩니다.
**참고 정본**: `examples/specs/today-briefing.md` (오늘 브리핑 설계서)

### 시나리오 K2. 설계서로 클릭 가능한 프로토타입을 만든다
> "내일 리뷰 미팅 전에 이해관계자에게 보여줄 화면이 필요하다."

1. K1의 설계서를 열어둔 상태에서 `/hes:prototype`
2. 실제 HES 컴포넌트·토큰으로 조립된 동작 프로토타입(HTML)이 생성됩니다 — 디자인 시안 없이도 브랜드가 입혀진 화면이 나옵니다.
3. 브라우저로 열어 시연. empty/loading/error 상태·다크모드까지 포함됩니다.

**주의**: 프로토타입에서 "이 부분만 색 다르게"는 금지 — 시스템에 없는 표현이 필요하면 K3으로.
**참고 정본**: `examples/haneul-prototype/index.html`

### 시나리오 K3. 필요한 컴포넌트가 시스템에 없다
> "타임라인 컴포넌트가 필요한데 카탈로그에 없다."

1. 설계서의 "신규 컴포넌트 후보" 항목에 요구사항을 적습니다(용도·상태·예시 화면).
2. 디자인 파트에 전달 → 디자인이 시나리오 D2로 추가하면, 다음 `/plugin update` 후 프로토타입에서 바로 사용 가능.

### 시나리오 K4. 기존 설계서를 업데이트한다
> "스펙이 바뀌었다. 문서와 구현이 어긋나기 시작했다."

1. 설계서 파일을 열고 `/hes:product-spec` 로 변경 반영 — 프론트매터 version/updated 와 상단 changelog가 함께 갱신됩니다.
2. 원칙: **구현과 다르면 설계서를 먼저 고친다.** 설계서가 진실이어야 다음 파생물이 올바릅니다.

---

## 3. 디자인 파트

**설치**: `hes` (공통 설치 1회) · **환경**: Claude Code (+ Figma 쓰면 Figma 앱 Dev Mode MCP만 켜기 — 서버는 플러그인이 제공)

### 시나리오 D1. 뭐가 있는지 확인하고, 올바른 사용법을 안내한다
> "주니어가 버튼을 두 개 다 primary로 썼다. 근거를 들어 피드백하고 싶다."

- `/hes:component-catalog` — 컴포넌트 목록·상태 조회
- "Button 사용 규칙 알려줘" — spec/usage 기반으로 답변(화면당 primary 1개, 안티패턴 포함)
- `/hes:design-guide 이 시안이 원칙에 맞는지 검토해줘` — 6대 원칙 번호를 근거로 리뷰

### 시나리오 D2. 새 컴포넌트를 시스템에 추가한다
> "기획에서 타임라인 컴포넌트 요청이 왔다."

1. HES 저장소를 연 Claude Code에서 `/hes:component-catalog 타임라인 컴포넌트 추가`
2. 스킬이 3종 세트(spec.md + 코드 + usage.md)를 Button 정본과 같은 구조로 만들고 registry에 등록합니다.
3. `hes:design-reviewer` 에이전트에게 검수 요청: "@hes:design-reviewer 타임라인 검수해줘" — 토큰 준수·접근성·중복 여부를 심층 점검.
4. PR → 머지 → 버전 bump. 이후 전 파트가 `/plugin update` 로 받습니다.

**주의**: 기존 컴포넌트 조합으로 되는 건 새로 만들지 않습니다(원칙 1). 스킬이 먼저 이를 검토해줍니다.

### 시나리오 D3. 색·간격·모션 토큰을 바꾼다 (리브랜딩 포함)
> "브랜드 컬러 톤을 조정하기로 했다." / "계열사용 테마가 필요하다."

1. HES 저장소에서 `/hes:design-tokens 브랜드 색을 ~로 바꿔줘`
2. **core 토큰 한 곳만** 바뀌고, semantic → 컴포넌트 → 프로토타입 전체가 따라옵니다. (1.2.0에서 warning 색 교체가 컴포넌트 코드 무수정으로 전파된 것이 실증 사례)
3. 색 변경 시 스킬이 대비(WCAG AA)·다크 대응을 함께 점검하고, CHANGELOG·버전 bump까지 안내합니다.
4. 머지 후 퍼블 파트에 공지 → 퍼블은 시나리오 P4로 재생성.

### 시나리오 D4. 브랜드가 녹아든 비주얼·영상을 만든다
> "신기능 홍보 키비주얼과 15초 인트로 영상 콘티가 필요하다."

1. `/hes:brand-visual 미세먼지 알림 출시 키비주얼` — 브랜드 규범(visual-style·voice-tone)을 근거로 시안 방향·카피가 나옵니다.
2. 영상은 motion-video.md 의 토큰-타임라인 매핑(듀레이션·이징 프레임 환산표)대로 콘티가 설계됩니다 — 제품 UI와 같은 모션 언어.
3. 로고 원본은 `brand/assets/logo.svg`(라이트)/`logo-dark.svg`(다크)만 사용.

### 시나리오 D5. Figma와 동기화한다 (선택)
> "디자이너들은 Figma에서 작업한다. 토큰을 Figma Variables로 쓰고 싶다."

1. **Figma MCP 서버는 플러그인이 이미 제공**합니다 — Figma 데스크톱 앱에서 Dev Mode MCP 서버만 켜면 됩니다(서버 추가·토큰 불필요). 연결이 됐는지 모르겠으면 `/hes:mcp-connectors` — 제공 커넥터 목록·연결 현황·미연결 시 켜는 법이 나옵니다.
2. `/hes:figma-bridge 토큰을 Figma Variables로 발행해줘`
3. 반대로 Figma에서 값이 바뀌었으면 "Figma와 코드 토큰 diff 보여줘" — 의도된 변경이면 코드 토큰에 반영(D3), 아니면 Figma를 코드에 맞춥니다.

**원칙**: 충돌 시 **코드가 진실**입니다. Figma는 협업 채널.

---

## 4. 퍼블 파트

**설치**: `hes` (공통 설치 1회) · **환경**: **내 프로젝트 폴더에서** Claude Code CLI 실행 (`cd my-app && claude`)

### 시나리오 P1. 새 프로젝트에 HES를 처음 셋업한다
> "신규 React 프로젝트에 디자인 시스템을 깔아야 한다."

1. 프로젝트 폴더에서 `/hes:token-export` — `tokens.css`(+ Tailwind preset, TS 타입)가 프로젝트에 생성되고 엔트리 import까지 안내됩니다.
2. `/hes:component-build button input card` — 필요한 컴포넌트가 `src/components/ui/` 에 설치됩니다(shadcn처럼 소스를 소유).
3. 빌드/타입체크 확인은 스킬이 함께 수행합니다.

### 시나리오 P2. 설계서·프로토타입을 받아 실제 화면을 구현한다
> "기획의 '미세먼지 알림' 설계서와 프로토타입이 넘어왔다."

1. 설계서의 §5 화면 명세가 이미 HES 컴포넌트·토큰 이름으로 되어 있으므로, "이 설계서대로 알림 화면 구현해줘"라고 요청.
2. 없는 컴포넌트가 나오면 임의로 만들지 말고 → 기획 K3/디자인 D2 경로로. (프로토타입이 HES를 지켰다면 **재작성이 아니라 정리** 수준으로 끝납니다)
3. 반복 화면 유형은 `usage/screens/` 패턴(login·list-detail·form·feedback-states)을 그대로 따릅니다.

### 시나리오 P3. 배포 전 접근성을 점검한다
> "QA 전에 접근성 이슈를 걸러내고 싶다."

- `/hes:a11y-audit` — 색 대비(수치 계산)·키보드·포커스·aria·모션 민감성을 pass/fail + 수정안으로 리포트합니다.
- 대비 미달이 토큰 문제면 디자인 파트(D3)로 에스컬레이션 — 화면에서 색을 덮어쓰지 않습니다.

### 시나리오 P4. HES가 업데이트됐다 (토큰/컴포넌트 변경 수신)
> "디자인 시스템 1.3.0이 릴리스됐다는 공지가 왔다."

1. `/plugin update hes@hes`
2. `/hes:token-export` 재실행 — tokens.css 재생성. **산출물은 절대 손으로 고치지 않았어야** 충돌이 없습니다.
3. 컴포넌트가 바뀌었으면 `/hes:component-build <이름>` 재실행 — 프로젝트에서 커스터마이즈한 부분은 diff로 검토 후 병합.

---

## 5. Codex CLI 사용자 (파트 무관)

Codex를 쓰는 팀원도 **같은 소스, 같은 규칙**으로 작업합니다.

```bash
# 1회 설치
cp codex/prompts/*.md ~/.codex/prompts/
```

| 업무 | Codex 명령 | Claude 대응 스킬 |
| :-- | :-- | :-- |
| 설계서 작성/갱신 (기획) | `/hes-spec 미세먼지 알림` | `/hes:product-spec` |
| 토큰 조회/수정 (디자인·퍼블) | `/hes-tokens warning 색 근거 알려줘` | `/hes:design-tokens` |
| 컴포넌트 조회/추가/설치 (디자인·퍼블) | `/hes-component card 설치해줘` | `component-catalog` / `component-build` |

- HES 저장소(또는 심볼릭 링크)가 작업 폴더에 있으면 `codex/AGENTS.md` 규칙이 자동 적용됩니다.
- 프로토타입 생성·브랜드 비주얼·Figma 동기화 등 나머지 업무는 Claude Code 사용을 권장합니다(전용 스킬 제공).

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
```

핵심 규칙 세 가지만 기억하면 됩니다:
1. **값은 토큰으로, 화면에서 우회 금지** — 필요하면 시스템에 승격.
2. **설계서·레지스트리가 공용어** — 파트 간 전달물은 항상 HES 이름으로.
3. **산출물은 재생성, 원본만 수정** — tokens.css·프로토타입을 손으로 고치지 않기.

---

## 7. 자주 묻는 질문

| 질문 | 답 |
| :-- | :-- |
| 스킬 이름을 못 외우겠어요 | `/hes:ask-hes` 에 상황을 설명하면 맞는 스킬과 순서를 알려줍니다. 자연어 요청도 됩니다 — "접근성 점검해줘"라고 하면 a11y-audit이 실행됩니다. |
| 업데이트했는데 반영이 안 돼요 | `/plugin update` 후 새 세션을 시작하거나 `/reload-plugins`. 퍼블은 P4의 재생성까지 해야 프로젝트에 반영됩니다. |
| Figma(MCP)가 연결됐는지 모르겠어요 | `/hes:mcp-connectors` — 플러그인이 **제공하는** MCP 서버 목록과 현재 연결 상태, 미연결 시 연결 방법을 보여줍니다. Figma 서버(공식 Dev Mode)는 플러그인이 이미 등록하므로 Figma 앱에서 Dev Mode MCP만 켜면 되고, HES 메인 플로우는 이 서버 없이도 전부 동작합니다. |
| 우리 제품은 React가 아니에요 | `component-build` 가 spec 기준으로 해당 프레임워크 구현을 생성합니다. 먼저 팀 스택을 알려주세요. |
| 급해서 색을 하드코딩했어요 | 다음 PR에서 반드시 토큰으로 교체하세요. `a11y-audit`/`design-reviewer` 가 하드코딩을 잡아냅니다. |
| 그룹사/계열사 테마는? | core 토큰만 교체한 브랜드 오버라이드로 대응합니다 — docs/maintenance.md "확장" 참조. |

**더 깊은 내용**: 설치 상세 [getting-started.md](./getting-started.md) · 구조/철학 [architecture.md](./architecture.md) · 시스템 수정 [maintenance.md](./maintenance.md)
