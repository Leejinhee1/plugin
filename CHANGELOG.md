# Changelog

이 프로젝트는 [semver](https://semver.org)를 따릅니다. 각 릴리스에서 `.claude-plugin/plugin.json` 과 `marketplace.json` version을 함께 bump 합니다.

## [3.8.0] — 2026-08-24
### 추가 — `spec-lookup` 스킬: 사내 설계서 저장소를 최신으로 조회
확정된 설계서를 물어볼 때마다 저장소를 찾아 들어가 파일을 뒤지고 있었고, 그렇게 찾은 답이 **언제 기준인지** 아무도 말해주지 않았습니다. `/hes:spec-lookup <질문>` 으로 사내 설계서 저장소에서 화면·정책을 찾아 **근거(파일 경로·기준일/설계버전·조회 커밋)와 함께** 답하게 했습니다.

- **설계서 본문은 이 저장소에 0바이트입니다.** 설계서 저장소는 보통 비공개이고 이 저장소는 공개라, 내용을 벤더링하면 그대로 유출입니다. 스킬은 **조회 절차만** 싣고, 내용은 사용자의 자격증명으로 그때그때 읽습니다.
- **대상 저장소를 하드코딩하지 않습니다** — `--repo` → `HES_SPEC_REPO` → 프로젝트의 `.hes/spec-source.json` 순으로 해석하고, 하나도 없으면 **묻고 멈춥니다**(추측 금지). 덕분에 HES 는 제품 중립으로 남고, 공개 저장소에 비공개 레포 이름이 박히지 않습니다.
- **`scripts/sync-spec-repo.mjs` 신설**(의존성 없음): `~/.cache/hes/spec-repos/<owner>__<name>` 에 sparse-checkout 캐시를 두고 **매 호출 `origin/<ref>` 로 리셋**합니다. 캐시를 그대로 믿지 않는 것이 요점 — 낡은 체크아웃으로 답하는 것이 이 스킬의 유일한 치명적 실패입니다. 출력은 캐시 경로·커밋·커밋 시각이고, 그 시각이 "언제 기준 최신인지"의 답이 됩니다. 실측: 문서 루트만 받아 **1.1MB**, 클론 수 초.
- **조회 절차는 설계서 저장소가 갖습니다** — 스킬은 캐시의 `docs/agents/spec-lookup.md`(레이아웃·라우팅·응답 규율) 를 읽는 포인터입니다. 저장소 구조가 바뀌어도 **플러그인 릴리스가 필요 없습니다.** `figma-bridge` 가 `design-system/` 을 가리키는 것과 같은 얇은 어댑터 패턴.
- **근거 없이 답하지 않습니다** — 읽은 문서에 없으면 없다고 하고, "설계서에 없다"와 "아직 명세되지 않았다(스텁)"를 구분합니다. 담당자 실명·연락처는 옮기지 않고, 비공개 설계서 본문을 외부로 내보내기 전에 사용자에게 확인시킵니다. 접근 권한이 없으면 우회하지 않고 접근 요청을 안내합니다.
- **배포되는 스킬은 4개**: `/hes:ask-hes` · `/hes:mcp-connectors` · `/hes:test-script` · `/hes:spec-lookup`. `ask-hes` 라우터에 등록하고, `product-spec`(쓰기) · `test-script`(QA 시나리오 추출)와 헷갈리지 않도록 "헷갈리는 짝"에 구분을 추가했습니다.

## [3.7.0] — 2026-08-04
### 변경 — 미완성 스킬 11개 비활성화, 배포 스킬을 3개로 축소
완성되지 않은 스킬이 설치·노출되면서 "호출했는데 아무 일도 안 일어난다"는 상태를 만들고 있었습니다. **파일은 그대로 두고 배포에서만 빼는** 방식으로 정리해, 지금 실제로 동작하는 것만 사용자에게 보이도록 했습니다.

- **`plugin.json` 의 `skills[]` → `_disabledSkills[]`**: product-spec · prototype · design-tokens · design-guide · component-catalog · brand-visual · figma-bridge · token-export · registry-export · component-build · a11y-audit (11개). 스킬 파일·폴더는 이동/삭제하지 않았고, 완성되면 **경로 한 줄을 `skills` 배열로 옮기는 것만으로** 활성화됩니다. `_disabledSkills` 는 스키마에 없는 키라 Claude Code 는 무시하며, JSON 이 주석을 지원하지 않으므로 배열 첫 원소를 `"// 미완성 — ..."` 주석 문자열로 둡니다.
- **배포되는 스킬은 3개**: `/hes:ask-hes` · `/hes:mcp-connectors` · `/hes:test-script`.
- **스킬이 아닌 경로는 영향 없음** — `hes:design-reviewer` 에이전트 · `npx hes` CLI · Codex 프롬프트 3종 · `mcp/` 커넥터 등록/현황은 전부 그대로 동작합니다. 퍼블 업무는 CLI 로, 디자인 검수는 에이전트로 사실상 대체됩니다.

### 추가 — 스킬 정합성 체크 스크립트 `npm run check`
3.6.0 의 `test_script` 사고(스킬 이름이 kebab-case 가 아니어서 **아무 경고 없이 등록되지 않던** 문제)가 기존 검증으로는 잡히지 않는다는 것을 확인하고, 그 구멍을 메우는 스크립트를 추가했습니다.
- **`scripts/check-skills.mjs` 신설**(의존성 없음, `npm run check`): `plugin.json` 의 `skills[]`·`_disabledSkills[]` 를 순회하며 검사 — 폴더/`SKILL.md` 존재 · **frontmatter `name` 의 kebab-case 준수** · **폴더명 ↔ `name` 일치** · `description` 존재 · 이름 중복 · 양쪽 배열 중복 등록 · 디스크에 있는데 미등록인 스킬(경고) · `plugin.json`↔`marketplace.json` 버전 일치. 에러가 있으면 exit 1.
- **검증 결과**: 실패 픽스처(언더스코어 이름·이름 불일치·없는 경로·양쪽 중복·버전 불일치·미등록 스킬)로 모든 케이스를 검출하는 것을 확인. 현재 저장소는 경고 없이 통과.
- **버전 동기화 대상을 4개로 확정**: `plugin.json` · `marketplace.json`(+`plugins[0].version`) · `package.json` · `package-lock.json`. 3.4.0 에 머물러 있던 npm 쪽 두 파일을 3.7.0 으로 맞추고, 불일치를 **경고가 아니라 에러**로 잡도록 했습니다. `maintenance.md` 버전 정책에 `npm version <새버전> --no-git-tag-version` 을 포함한 릴리스 절차를 명시.

### 변경 — `claude plugin validate` 에서 `--strict` 제거
- **`--strict` 는 검사 항목을 늘리지 않는다**(경고를 에러로 승격할 뿐)는 점, 그리고 이 저장소에서 걸리는 유일한 경고가 **의도적으로 넣은 `_disabledSkills`** 라는 점을 확인. 반면 실제로 사고를 냈던 이름 규칙 위반은 `--strict` 로도 잡히지 않습니다(픽스처로 확인 — `✔ Validation passed`).
- `docs/maintenance.md` 에 **검증 절차 섹션 신설**: 두 도구의 검사 범위 비교표 + `--strict` 를 쓰지 않는 이유. `getting-started.md` 검증 명령과 PR 체크리스트도 `npm run check` + `claude plugin validate .` 조합으로 교체.
- 참고: 이 저장소에는 아직 CI 설정(`.github/workflows/`)이 없어 당장 깨지는 파이프라인은 없습니다.

### 수정 — 문서에서 "없는 스킬" 안내 제거
비활성 스킬을 `/hes:xxx` 슬래시 형태로 안내하던 곳을 전부 정리했습니다. 준비중 항목은 **슬래시 없이 이름만 + 🚧 배지 + 대안 경로**로 표기하는 규칙을 세웠습니다.
- **`ask-hes` 라우터**: 상단에 "지금 실행 가능한 스킬 3개" 표와 라우팅 규칙 추가 — *준비중 스킬을 슬래시 커맨드로 안내하지 말 것, 없는 스킬이 있는 척하지 말 것, 단계를 알려주되 대안을 함께 제시할 것*. 메인 플로우·정비 레인·단독 스킬 항목별로 대안 경로(`design-system/` 직접 참조 · `npx hes`)를 명시.
- **`mcp-connectors`**: 소비 스킬 `figma-bridge`·`brand-visual` 이 준비중임을 명시(커넥터 조회·등록 기능 자체는 정상).
- **README · getting-started · user-guide · architecture · maintenance · index.html · 버킷 README 3종**: 구조 트리·역할표·시나리오·랜딩 카드에 🚧 상태 표기, 각 항목에 "지금 하는 법" 추가. user-guide 는 상단에 개발 현황 표 신설.
- **`maintenance.md` 에 비활성화 규칙 문서화**: 승격/강등 절차 + **함께 갱신할 문서 목록** + `grep -rn "/hes:<이름>"` 확인 절차.
- `mcp/registry.json`: `policy.disabledConsumers` + 커넥터별 `usedByDisabled` 추가 — 레지스트리는 유지하되 준비중 소비 스킬을 실행 가능한 것처럼 보고하지 않도록.
- `skills/publish/README.md` 에 누락돼 있던 `registry-export` 를 표에 추가.
- 플러그인/마켓플레이스 `description` 을 "스킬 전체 설치" → 개발 중·제공 스킬 3개 기준으로 정정. index.html 버전 표기 동기화.

> **MINOR 로 올린 이유**: 토큰·컴포넌트 API 는 변경이 없으나(=MAJOR 아님), 기존 설치자가 받던 스킬 11개가 업데이트 후 사라지므로 PATCH 로 두기엔 사용자 영향이 큽니다. `/plugin update hes@hes` 시 해당 슬래시 커맨드가 목록에서 없어집니다.

## [3.6.0] — 2026-08-04
### 추가 — QA 테스트 시나리오 자동 생성 스킬 `/hes:test-script`
확정된 UI 기획서를 QA 시트로 옮기는 수작업(화면×영역×CASE×엣지 조합을 손으로 수백 줄)을 스킬로 대체. 기획 파트의 산출물이 프로토타입·구현에 이어 **테스트 시나리오**까지 이어집니다.
- **`/hes:test-script <설계서>` 스킬 신설**(`skills/planning/test-script/`): 입력은 **Figma URL · PDF · 단일 이미지 · 이미지가 든 폴더**(폴더는 파일명 순 정렬, 표지·여백 페이지 스킵). 화면명+화면ID · 영역 · CASE 분기 조건 · Description · "터치 시 >" 액션 · 엣지 케이스(미로그인/외국인/빈 데이터)를 추출 → 9컬럼 시나리오(Test ID·담당자·로그인 상태·화면명·영역·사전조건·시험내용·테스트 수행·예상결과)로 생성 → 사용자 확인 후 출력.
- **Figma 기획서 직접 입력**(실사용에서 확인된 1순위 입력 형태): URL의 `fileKey`·`node-id` 로 `get_metadata` 를 호출하고, 동봉 스크립트 `scripts/figma_spec_text.py` 가 응답 XML을 **스펙 페이지별 텍스트**로 환원한다(텍스트 문구는 `<text>` 노드의 `name` 속성에 있고, 최상위 프레임 1개 = 스펙 페이지 1장, 좌표 y→x 로 읽기 순서 복원). 스크린샷은 프로세스 플로우처럼 **레이아웃을 눈으로 봐야 하는 페이지에만** 보조로 쓴다 — 수십 장 렌더링 대비 토큰이 압도적으로 싸고 Description 전문이 손실 없이 들어온다. 실사용 검증: 36페이지 덱 → 텍스트 노드 446개 추출 → 시나리오 232건. `mcp/registry.json` 의 figma 커넥터 `usedBy` 에 등록(**읽기 전용** — figma-bridge 의 양방향 동기화와 구분), 미연결 시 PDF 내보내기로 폴백.
- **출력 3경로, 회사 계정 기본값은 클립보드**: (A) CSV(UTF-8 BOM, `~/Downloads/`) 는 항상 백업으로 생성 · (B) **TSV 클립보드 복사**(권한 불필요, 시트 A1에 `Cmd+V` → 9컬럼 자동 분리) 를 기본 권장 · (C) Google Sheets 자동 작성은 서비스 계정 권한이 확보된 경우에만. 사내 보안정책상 서비스 계정 키 발급이 막히는 상황을 기본 전제로 폴백을 설계.
- **CSV 재반영 루프**: 사용자가 CSV를 직접 수정한 뒤 "이 내용으로 다시 옮겨줘" 하면 메모리 원본이 아니라 **수정된 파일을 다시 읽어** 재출력.
- **메인 플로우 밖 단독 스킬로 배치**: 입력이 HES 설계서일 필요가 없고(외부 팀 PDF 기획서 가능) 산출물이 SoT 로 되돌아오지 않는 단방향 파생물이라, `ask-hes` 라우터에서 단독 스킬로 안내.
- 상호 참조: `planning/README`, README(구조·역할별 진입점), `ask-hes` 라우터, getting-started(기획 첫 사용 4), user-guide(시나리오 K5 + 릴레이 다이어그램 QA 갈래), architecture(흐름의 QA 갈래), index.html(planning 카드·역할표).

### 수정
- **스킬 이름을 kebab-case 로 정정**(`test_script` → `test-script`): 스킬 이름 규칙(소문자·숫자·하이픈)에 맞지 않아 플러그인 로드 시 **스킬이 등록되지 않던 문제**. 디렉터리·프런트매터 `name`·`plugin.json` 의 `skills` 항목을 함께 변경.
- **개인 머신 절대경로 제거**: CSV 저장 경로를 `~/Downloads/` 로, Google Sheets 경로의 `sheets_writer.py` 는 "사용자가 준비한 스크립트(플러그인 비동봉) — 경로를 모르면 물어보고 없으면 클립보드로 진행"으로 일반화.
- index.html 버전 표기 v3.4.0 → v3.6.0 동기화(3.5.0 릴리스 때 누락).

## [3.5.0] — 2026-07-20
### 추가 — MCP 커넥터 레지스트리 + 플러그인 번들 제공 + `/hes:mcp-connectors` 현황 스킬
외부 MCP 커넥터를 "무엇을 쓰는지(레지스트리) · 플러그인이 무엇을 제공하는지(번들) · 지금 무엇이 연결됐는지(현황)"로 한데 묶어 관리. 두 세션에서 병행 진행되던 커넥터 작업(레지스트리 방식 · 번들 방식)을 하이브리드로 통합.
- **`mcp/` 레지스트리 신설(SoT 패턴 확장)**: `mcp/registry.json`(커넥터 인덱스 — `name·status·since·transport·scope·usedBy·connect`) + `mcp/mcp.example.json`(복사용 예시) + `mcp/README.md`. 컴포넌트 `registry.json` 과 같은 패턴 — 어떤 커넥터를 왜/어떻게 쓰는지의 진실을 한 곳에.
- **플러그인이 Figma MCP를 직접 번들 제공**: `plugin.json` 에 `mcpServers.figma`(공식 Figma **Dev Mode** MCP, `type:"http"` · `url:"http://127.0.0.1:3845/mcp"`) 선언. 설치하면 서버가 자동 등록 — 사용자가 `claude mcp add` 로 따로 추가할 필요 없음. **번들에 비밀 없음**: 로컬 URL만 등록하고 인증은 Figma 데스크톱 앱 세션이 담당(config 에 토큰 없음) → "자격증명 커넥터 비번들" 보안 원칙과 양립.
  - `figma-bridge` 가 참조하는 도구(`use_figma`·Code Connect)는 공식 Dev Mode 기준이므로 커뮤니티 서버(`figma-developer-mcp`)가 아니라 Dev Mode 를 번들. 개인 REST 토큰 변형은 registry 의 `connect.altUserConfig` 에 user 스코프로 문서화(번들 금지).
- **`/hes:mcp-connectors` 스킬 신설**(`skills/general/`): 레지스트리 **조회** + 세션 **연결 현황**(도구 `mcp__plugin_hes_figma__*` 탐지 → `claude mcp list`/`get` 헬스 → 판정, ✅/⚠️/✗) + 커넥터 **등록·관리**(scope 결정·보안 게이트). 미연결(대개 Figma 앱 Dev Mode 꺼짐)이면 켜는 법 안내 — 자격증명 문제 아님을 구분.
- **scope 로 소유권 분리**: `bundled`(플러그인 자동 연결, config 에 비밀 없는 것만) · `user`(각자 인증) · `project`(팀 `.mcp.json`). `url` 커넥터는 `type` 필수(누락 시 Claude Code가 서버 스킵).
- 상호 참조: `figma-bridge` 전제, `ask-hes` 라우터(단독 스킬), `general/README`, README(구조 `mcp/`·`mcpServers`), architecture(결정 6), maintenance(커넥터 추가 절차·PR 체크리스트), getting-started·user-guide, codex config.

## [3.4.0] — 2026-07-20
### 추가 — 자체 설치 CLI `npx hes add` (shadcn 브랜드 탈피)
설치 명령에 외부 도구 이름(shadcn)이 노출되는 문제 해소 — HES 자체 CLI 를 1차 경로로 승격.
- **`cli/hes.mjs` + 루트 `package.json`(bin: hes) 신설**: `npm i -D github:Leejinhee1/plugin` 후 `npx hes list` / `npx hes add <name...>`.
  - 기본은 **동봉 소스 모드**(호스팅 불필요·오프라인 동작): 저장소의 registry.json·컴포넌트 소스를 직접 읽고, 토큰 CSS 는 token-export 를 내부 실행해 생성.
  - `--registry <URL>` 로 registry-export 산출물 호스팅본에서도 설치(shadcn registry-item 포맷 파싱).
  - 의존성 자동 포함(modal→button, 전 컴포넌트→tokens), 멱등(변경 없으면 skip), 로컬 수정본 보호(`--force` 없인 덮어쓰지 않고 exit 1), `--dir`/`--tokens-dir` 로 위치 지정.
  - 검증: 로컬/원격 모드 설치 파일이 원본과 diff 0, 멱등·수정보호·강제덮어쓰기 시나리오 통과.
- **브랜딩 정리**: index.html 카탈로그 복사 버튼·README·registry-export 스킬의 1차 명령을 `npx hes add <name>` 으로 교체. shadcn CLI 는 "호환 옵션"으로 명시(설치 도구일 뿐, 소스는 전부 HES).

## [3.3.0] — 2026-07-20
### 추가 — shadcn 스타일 소비 경로: 컴포넌트를 "불러와서 바로 쓰는" 구조
컴포넌트가 문서+참조 구현으로만 존재하던 것을, shadcn/ui·사내 패키지처럼 즉시 설치/임포트 가능한 구조로 확장. 소스 오브 트루스(components/ 3종 세트)는 그대로 — 소비 산출물만 파생.
- **`/hes:registry-export` 스킬 신설**: `build-registry.mjs` 가 컴포넌트를 [shadcn 레지스트리 스키마](https://ui.shadcn.com/docs/registry)로 변환 — `registry.json`(인덱스) + `r/<name>.json`(소스 content 임베드). 정적 호스팅 후 대상 프로젝트 `components.json` 에 `"registries": { "@hes": "<URL>/r/{name}.json" }` 등록하면 `npx shadcn@latest add @hes/button` 으로 설치.
  - `r/tokens.json`: token-export 를 내부 실행해 최신 tokens.css 를 임베드(`~/styles/hes-tokens.css` 로 설치) — 모든 컴포넌트가 `@hes/tokens` 를 `registryDependencies` 로 자동 견인. 토큰·컴포넌트 산출물 불일치 원천 차단.
  - 내부 registry.json 의 `dependencies`(modal→button)를 `@hes/*` 레지스트리 의존성으로 변환, spec 프런트매터의 `figma` 노드를 `meta.figma` 로 실어 추적성 유지, `deprecated` 는 제외.
- **`components/index.ts` barrel 신설**: 13종 전 컴포넌트+타입 export — 모노레포 alias/사내 npm 발행 시 `import { Button } from "@hes/react"` 스타일 소비(Meta 계열 패키지 방식).
- **components/README.md**: "가져다 쓰는 법" 3경로(A. shadcn CLI — 권장 · B. 패키지 import · C. 파일 복사) 문서화. 컴포넌트가 외부 유틸 의존 없는 자체 완결이라는 전제를 명문화하고, 추가 절차에 barrel·registry-export 단계 편입.
- **index.html — 컴포넌트 카탈로그 개편(ui.shadcn.com 스타일)**: 4종 데모 → 13종 전부 라이브 프리뷰. 카테고리 사이드 내비(sticky) + 컴포넌트별 `npx shadcn add @hes/*` 복사 버튼 + spec 링크. checkbox/radio/switch/tab/textarea 는 실제 인터랙션, select 는 바텀시트, toast/snackbar·tooltip 은 트리거 데모로 재현(전부 --hes-* 토큰만 사용). 버전 표기 v3.3.0 동기화.

## [3.2.0] — 2026-07-20
### 추가 — HES 변수 3컬렉션 완전 이식: component·platform 레이어 신설
HES 이식이 목표라는 원칙에 따라 2레이어(core→semantic) 틀을 확장 — HES 자체 구조(base→theme→platform)를 따라 4파일 체계로 전환. **기존 semantic 토큰 이름과 `--hes-*` 변수는 전부 보존**(컴포넌트 무수정, 순수 additive).
- **core.tokens.json — HES `base` 컬렉션 완전판(124개 전체)**: `dimension.sizing`(25스텝 램프) · `dimension.borderWidth`(none/1/2) · `lineHeight`(100/200/300) 신설. `radius`·`dimensionFont.size` 를 HES 스텝 번호 전체 램프로 확장(기존 `xs~xl`/`xs~3xl` 키는 스텝 alias 로 유지 — CSS 변수 불변). `dimensionFont.scale`(rem 기준 10) 추가.
- **semantic.tokens.json — HES `theme` 시맨틱 컬러 이식**: `brand.secondary`(#6479ea 블루)·`lightgray`·`darkgray` + `disabled`/`boxbg`/`boxfg`/`boxborder` 알파 시스템(soft/line 버튼 색 기반 ~30개), `text.01~08+black+white+point.*`(HES 텍스트 위계 원본 — 05 이하 AA 미달 주의 명기), `chart.up/down`(상승 적·하락 청), `risk.lv1~5`, `space.elements.*`/`space.section.*`(HES 간격 의미 스케일). `$dark` 에 `text.black` 반전(HES theme 유일의 다크 오버라이드) 추가. typography lineHeight 를 core `{lineHeight.*}` alias 로 정규화(출력값 동일).
- **component.tokens.json (신설) — HES `theme` 컴포넌트/레이아웃 스펙 이식**: `comp.button.*`(solid/soft/line 3계열×색상군 + 구세대 primary/primary2/primary3/secondary, ~120개) · `comp.layer.*`(alert/modal/bottomSeat/head/content/dim) · `layout.*`(콘텐츠 여백·사이드·헤더) · `sizing.icon.*`(product/function) · `font.size.body|headline.*` · `letterSpacing`. HES 원본 이름 보존(자체 재작명 없음 — 이식 추적성 우선). 각색: bg/border 램프는 grayScale 패스스루로 flatten, 오타 `disabeldFg`→`disabledFg` 정정, *fixed* 변형은 `$dark` 부재로 표현, 소수점 px 반올림(123.2/142.4).
- **platform.tokens.json (신설) — HES `platform` 컬렉션(AOS/iOS/PC/Min 4모드)**: breakpoint(sm/md/foldable/pc)·safeArea·vw/vh·content/toast 간격·고정버튼 폭·isNotch. DTCG 에 모드 표준이 없어 `$value`={모드 맵} 자체 확장 포맷 채택. 3.0.0에서 "웹 하네스 범위 밖"으로 제외했던 컬렉션을 이식 원칙에 따라 편입.
- **build-tokens.mjs**: component/platform 파일 로딩(없으면 skip, 하위호환) + `--hes-comp-*`/`--hes-platform-*` export + `[data-platform="ios|pc|min"]` 오버라이드 블록(기본 AOS, 차이값만 출력) + boolean 값 지원(isNotch). 빌드 검증: **337 vars(:root) + 12 dark + 35 platform 오버라이드**(기존 57+11).
- **문서**: tokens/README 를 "레이어 구조 — HES 이식 기준"으로 개편, **이식 각색 결정 목록**(circle 50→9999px, fixed 변형 생략, bg/border 램프 flatten, 자체 토큰 표시 등) 신설. design-tokens·token-export·figma-bridge 스킬, maintenance 가이드 정합.
- **동기화 출처**: Figma HES 브랜치 `0F4A8OTZzApAJIjFjeQULz` 변수 3컬렉션(base 124 · theme 317 · platform 24) 전량 덤프 대조(2026-07-20). 메인 파일과 달리 이 브랜치는 brand→theme(Light/Dark) 개편·hana 색 base 이동·radius/sizing 스텝 번호 개편이 반영된 최신 체계 — 코드 토큰은 브랜치 체계를 따른다.

## [3.1.0] — 2026-07-20
### 추가 — HES 🧱 Template 페이지 기준 컴포넌트 8종
Figma `[공식] Hana Experience System` 🧱 Template 페이지(node 691:3060)의 컴포넌트 정리를 코드 모듈로 반영. 각 모듈은 spec+tsx+usage 3종 세트, semantic 토큰(CSS 변수 `--hes-*`)만 참조.
- **checkbox**: HES checkAll/check/checkSub → `all`/`basic`/`sub` + 칩형 `round`/`button`. "all 은 전체선택 시에만" HES 규칙 명문화. btn_star(즐겨찾기)는 Checkbox 범위에서 제외.
- **radio**: `dot`(rdo/rdoM) + 버튼형 `list`/`listCheck`(rdoList/rdoListCol/rdoListChk) — RadioGroup(fieldset) + columns 그리드.
- **switch**: 48×24 단일형, `role="switch"`. off 트랙은 semantic 램프 한계로 `color.bg.muted` 매핑(HES bg/35 근사) 명시.
- **select**: `line`(wrapSel)/`box`(wrapSelBox) + 옵션 **바텀시트**(layer/layerSelect — 네이티브 드롭다운 대신 HES 기준). 기간 입력(boxDate)은 조합 패턴으로 usage 에 수록.
- **textarea**: `line`(textarea/textareaL)/`box`(textareaBox), maxLength 카운터("n/30자")·클리어 버튼·오류 가이드(txtInpGuide).
- **tab**: `underline`(tab/tab2/tabScroll — 4개 이하 균등·5개부터 스크롤 자동)/`round`(tabRound, isSticky 시 미선택 필 배경 제거 HES 규칙)/`toggle`(tabToggle, subLabel). roving tabindex + 방향키 이동.
- **toast**: Toast(자동 닫힘)+Snackbar(닫기 버튼, 왼쪽 정렬) 통합. HES 간격 변수 그대로: bottom 24 / +고정버튼 84 / top 102 / +고정탭 150. 배경은 `color.bg.inverse` 매핑(HES 원본 grayScale.90 톤) 주석.
- **tooltip**: 클릭형(모바일 기준) tooltip/tooltipTitle, min 150/max 260, position center/left/right.
- **registry.json** 1.3.0: 8종 등록 + `figmaSource` 필드 신설. 기존 spec 4종(button·input·card·modal)에 `figma` 프런트매터로 원본 프레임 노드 연결(card=box, modal=layer 부분 커버).
- **components/README.md**: 🧱 Template 전 프레임 ↔ HES 매핑표(구현 12 · 미구현 후보 bubble/dropdown/list/table · 파운데이션/패턴 분류) 추가.
- Select/Toast 등장 트랜지션은 Modal 과 동일한 visible-state 패턴 + `createPortal` 로 통일(외부 애니메이션 플러그인 의존 없음).

## [3.0.0] — 2026-07-20
### 파괴적 변경 — 하나머니 리브랜딩: Figma "[공식] Hana Experience System(HES)" 변수 기반으로 전면 교체
가상 브랜드 (주)하늘 데모 스타일을 걷어내고, 하나카드 HES Figma 파일의 변수 컬렉션(base·theme·platform)을 코드 토큰으로 동기화. **semantic 토큰 이름과 CSS 변수(`--hes-*`)는 유지**되어 컴포넌트 코드는 무수정 — core 값 교체만으로 리브랜딩하는 2레이어 설계가 그대로 작동함을 검증.
- **core.tokens.json**: HES `base` 컬렉션과 1:1 동기화.
  - `color.teal.70~125`(브랜드 틸 램프, HES 스텝 번호 유지) · `color.grayScale.5~100+white/black`(쿨 그레이) · `color.hana.*`(하나 CI 11색, 하나그린 #009178 포함) · `purple`/`orange`/`pink` 포인트색.
  - 구 `color.brand.50~900`(블루) · `color.neutral.0~900` 램프 **삭제** — core 직접 참조가 있었다면 마이그레이션 필요(원칙상 금지였음).
  - spacing 스케일 키를 HES 스텝(`space.0~160`)으로 변경, radius 를 HES borderRadius 매핑(xs4·sm8·md12·lg20·xl24·full)으로 교체(값 변경: sm 6→8, md 10→12, lg 16→20).
  - 폰트 `Spoqa Han Sans Neo` 우선(폴백 Pretendard), `fontWeight` 를 HES 3단계(light 300/regular 400/bold 700)로 축소 — medium(500)·semibold(600) **삭제**.
- **semantic.tokens.json**: HES `theme` 컬렉션 매핑으로 값 교체.
  - `brand.default` = 하나그린(HES brand/primary), hover/active = teal 115/120, `focus.ring` = teal 100(HES primary/lighter).
  - 텍스트 위계 = HES text/01~08 기준(`fg.base`=grayScale.100, `fg.muted`=grayScale.70 — 흰 배경 4.6:1 AA 충족).
  - feedback = HES status 원본값(success #009178 · warning #ff5833 · danger #ec4361). ⚠️ **흰 텍스트 AA(4.5:1) 미충족** — 큰 텍스트/아이콘(3:1)만 허용으로 사용 규칙 변경(1.2.0의 warning AA 조정은 HES 원본 우선 원칙으로 폐기, `guidelines/color.md`에 대비 현황표 명문화).
  - 타이포: 줄높이 본문 1.32/헤드라인 1.28(HES lineHeight), **자간 -0.05em**(HES letterSpacing/default -5%) 신설, label 은 medium→bold.
- **build-tokens.mjs**: typography composite 에 `letterSpacing` 필드 지원 추가(`--hes-typo-*-letter-spacing` 출력). 빌드 검증 완료(57 vars + 11 dark).
- **brand/**: (주)하늘 패키지를 하나머니로 교체 — identity(가치 3종: 명확함·신뢰·절제, 카피는 초안으로 브랜드팀 확정 필요)·visual-style·voice-tone(금융 문맥: 금액 표기·보안 톤 추가)·logo(그룹 CI 심볼은 CI팀 원본만 사용 원칙 명시)·motion-video. 로고 SVG 는 하나머니 워드마크 플레이스홀더로 교체.
- **guidelines/**: color(하나그린·틸 램프 규칙, 피드백 대비 현황), typography(Spoqa·자간 -5%·두께 3단계) 갱신.
- **문서/데모 정합**: 컴포넌트 usage/spec·화면 패턴(login·list-detail·feedback-states)의 날씨 앱 예시 카피를 하나머니 금융 문맥으로 교체. 랜딩 `index.html` 을 새 팔레트(Hana CI·Teal·GrayScale 스와치, Spoqa 로드)로 재구성.
- **미변경**: `examples/`((주)하늘 데모)는 참고용 아카이브로 유지. duration/cubicBezier 는 Figma HES 에 정의가 없어 자체 값 유지. HES Dark 모드는 Figma 상 Light 와 사실상 동일해 다크 오버라이드는 자체 grayScale 반전 규칙 유지.
- **동기화 출처**: Figma 파일 `[공식] Hana Experience System` (branch 0F4A8OTZzApAJIjFjeQULz, 2026-07-19 figma-bridge 로 변수 3컬렉션 465개 덤프). platform 컬렉션(AOS/iOS/PC 브레이크포인트 등)은 웹 하네스 범위 밖이라 이번 동기화에서 제외.

## [2.1.0] — 2026-07-19
### 추가 — `/hes:ask-hes` 라우터 스킬
- mattpocock/skills 의 `ask-matt` 를 참고한 **스킬 라우터**: 상황을 설명하면 어떤 스킬을 어떤 순서(플로우)로 쓸지 안내. 일은 직접 하지 않음.
  - 첫 분기(시스템을 바꾸는가/쓰는가) → 메인 플로우(기능→배포) · 정비 레인 · 단독 스킬로 라우팅.
  - 헷갈리는 짝 구분 수록: `component-catalog` vs `component-build`, `design-tokens` vs `token-export`, `prototype` vs `component-build`.
  - `disable-model-invocation: true` — 사용자가 직접 호출하는 스킬(모델이 자동 실행하지 않음).
- 파트 공통 스킬 버킷 `skills/general/` 신설.

## [2.0.0] — 2026-07-19
### 파괴적 변경 — 플러그인 3종 → 단일 플러그인 `hes` (mattpocock/skills 구조)
설치를 세 번 해야 하는 불편과 플러그인 간 파일 참조 문제를 없애기 위해, [mattpocock/skills](https://github.com/mattpocock/skills)의 단일 플러그인 구조로 전면 재구성.
- **저장소 루트가 곧 플러그인**: `marketplace.json` 의 `source: "./"`. `hes-design`/`hes-planning`/`hes-publish` 3개 플러그인을 `hes` 하나로 통합 — 설치는 `/plugin install hes@hes` 한 번.
- **스킬은 역할별 버킷으로 이동**: `plugins/<플러그인>/skills/*` → `skills/planning|design|publish/*`. 10개 스킬 전부를 `.claude-plugin/plugin.json` 의 `skills` 배열에 명시(배열에 없는 폴더는 배포되지 않음 — 초안/보류 스킬을 두는 공간으로 활용 가능).
- **소스 오브 트루스 승격**: `plugins/hes-design/design-system/` → 루트 `design-system/`. 모든 스킬이 `${CLAUDE_PLUGIN_ROOT}/design-system/` 하나를 참조 — 크로스 플러그인 상대경로 제거.
- **에이전트/스크립트 이동**: `design-reviewer` → 루트 `agents/` (자동 발견). `build-tokens.mjs` → `skills/publish/token-export/scripts/` (스킬 전속 스크립트는 스킬 폴더 안에).
- **스킬 호출명 변경**: `/hes-design:design-tokens` → `/hes:design-tokens` 등 전부 `/hes:*` 네임스페이스로 통일.
- **v1 마이그레이션**: `forceRemoveDeletedPlugins: true` — 마켓플레이스 업데이트 시 옛 플러그인 3종이 자동 제거됨. 이후 `/plugin install hes@hes` 한 번이면 끝.
- 문서(README·getting-started·user-guide·architecture·maintenance)·codex 어댑터·examples·랜딩 페이지를 새 구조에 맞게 갱신.

## [1.2.0] — 2026-07-10
### 접근성 — 1.1.0 검수 반영
- **hes-design 1.2.0**
  - `color.warning.500` 를 `#d98a00`(흰 텍스트 대비 2.77:1, WCAG AA 미달) → `#a15c00`(흰 텍스트 대비 5.19:1, AA 4.5:1 및 목표 4.6:1 확보)로 조정. 색상(hue)은 주황/앰버 계열 유지.
    - Badge `warning` variant 배경(`color.feedback.warning`) + `color.fg.onBrand`(#ffffff) 텍스트 조합에 직접 적용(컴포넌트 코드 수정 없이 토큰만 교체).
    - 참고로 함께 점검한 `success.500`(#1f9d55) vs 흰 텍스트 3.49:1, `danger.500`(#e23b3b) vs 흰 텍스트 4.27:1 — 둘 다 3:1 이상이라 이번 릴리스에서는 미조정(AA 4.5:1 미달이지만 보고만 하고 warning 만 수정).
  - `guidelines/color.md` 대비 기준 표 아래에 "피드백 색 + fg.onBrand 조합은 AA 검증 완료(1.2.0)" 명시.
  - semantic 타이포그래피에 `typography.caption`(sans/12px/regular/1.4) 신설 — 보조 설명·helper text 용도. `guidelines/typography.md` 스케일 섹션에 용도 추가.
  - `dimension.radius.full` semantic alias 도입 여부 검토: `build-tokens.mjs` 가 이미 core `dimension.radius.*` 를 `--hes-radius-*` 로 직접 export 하고 있어(Button/Badge 선례), semantic 레이어에 별도 `radius` 그룹을 얹어도 CSS 변수 생성 루프(`color.`/`space.`/`typography.` 접두사만 처리)가 이를 훑지 않아 무출력 상태의 죽은 토큰이 됨 → 추가하지 않고 core 직접 참조 정책을 `tokens/README.md` 에 예외로 명문화.
  - `examples/haneul-prototype/tokens.css` 를 새 토큰(경고색·caption 타이포)으로 재생성. 프로토타입은 `tokens.css` 만 유지(부산물인 `tailwind.preset.js`/`tokens.ts` 는 재생성 후 삭제).

## [1.1.0] — 2026-07-10
### 추가 — 가상 브랜드 "(주)하늘" 실사용 예시 완성
- **hes-design 1.1.0**
  - 컴포넌트 4종 추가: `input`, `badge`, `card`, `modal` (각 spec+code+usage 3종 세트, registry 등록)
  - semantic 토큰 `color.bg.overlay` 추가 (모달 스크림, 라이트/다크)
  - (주)하늘 브랜드 패키지: identity·logo·voice-tone·visual-style·motion-video 규범 + 로고 SVG 원본 2종
  - 화면 패턴 4종: login · list-detail · form · feedback-states
- **hes-publish 1.1.0**
  - `scripts/build-tokens.mjs`: 실행 가능한 DTCG→tokens.css/tailwind preset/TS 변환 스크립트 (의존성 0)
- **examples/**: "오늘 브리핑" 제품 설계서 + 동작 프로토타입 (기획→디자인→퍼블 파이프라인 데모)
### 변경
- hes-planning/hes-publish 의 hes-design 의존 제약을 `^1.0.0` 으로 완화

## [1.0.0] — 2026-07-10
### 최초 릴리스
- 사내 마켓플레이스(`hes`) + 역할별 플러그인 3종 골격.
- **hes-design**: design-tokens · design-guide · component-catalog · brand-visual · figma-bridge 스킬, design-reviewer 에이전트.
  - 단일 소스 오브 트루스 `design-system/`: DTCG 토큰(core/semantic), 가이드라인(원칙·색·타이포·모션), 컴포넌트 레지스트리 + Button 정본 예시(spec·code·usage), 화면 패턴·브랜드 규범 뼈대.
- **hes-planning**: product-spec(AI-리더블 PRD 템플릿) · prototype 스킬.
- **hes-publish**: token-export · component-build · a11y-audit 스킬.
- **Codex 어댑터**: AGENTS.md + prompts(/hes-tokens, /hes-component, /hes-spec) + config 예시.
- 문서: 아키텍처 · 시작하기 · 유지보수 가이드.
