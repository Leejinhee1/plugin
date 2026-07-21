---
name: mcp-connectors
description: HDS 플러그인이 제공(번들)하는 MCP 커넥터의 공식 목록과 현재 세션의 실제 연결 현황을 보여주고, 새 커넥터 등록·연결·번들 설정을 관리합니다. "무슨 MCP 써?", "Figma 연결됐어?", "지금 뭐가 연결돼 있어?" 같은 질문이나 figma-bridge 실행 전 사전 점검, 커넥터 추가에 사용. Use when listing HDS MCP connectors, checking live connection status, or registering/managing one.
disable-model-invocation: true
---

# HDS MCP 커넥터 (현황 · 관리)

원본(SoT): `${CLAUDE_PLUGIN_ROOT}/mcp/registry.json`(무엇을 쓰는지) + `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` 의 `mcpServers`(번들 서버의 실제 실행 config). 예시: `${CLAUDE_PLUGIN_ROOT}/mcp/mcp.example.json`.

HDS는 **파일 기반** 플러그인입니다 — 메인 플로우(기획→디자인→퍼블)는 커넥터 없이 전부 동작합니다. 다만 일부 스킬(`figma-bridge`·`brand-visual`)은 외부 MCP 서버를 쓰고, 그중 번들 가능한 것은 플러그인이 **직접 제공(등록)** 합니다. 이 스킬은 두 가지를 한 번에 보고합니다: (1) 플러그인이 **제공/인정하는 커넥터의 공식 목록**, (2) 지금 이 세션의 **실제 연결 상태**. 그리고 커넥터를 **등록·관리**합니다.

## 조회 (무엇을 쓰는가)

- **"HDS가 무슨 MCP 커넥터 써?"** → `registry.json` 을 읽어 `name·status·scope·usedBy·purpose` 를 표로 답한다. 레지스트리에 없는 걸 지어내지 않는다 — 실제로 HDS 스킬이 쓰는 커넥터만 `active`.
- **"figma 어떻게 연결해?"** → 해당 커넥터의 `connect`(연결법·확인법·공식 문서·config)를 근거로 안내한다.

## 현황 확인 (지금 무엇이 연결됐는가)

레지스트리는 *써야 하는* 커넥터, 실제 *연결 상태*는 사용자 환경이다. 아래 절차로 대조한다.

1. **플러그인 선언 읽기** — `plugin.json` 의 `mcpServers` 로 실제 번들 서버 목록을 확보(scope=bundled 의 진실). 개발 모드가 아니면 `registry.json` 을 기준으로 삼는다.
2. **세션 MCP 도구 탐지** — 현재 세션 도구 중 `mcp__` 프리픽스를 확인. 플러그인 제공 서버는 `mcp__plugin_hds_<서버명>__*`(예: `mcp__plugin_hds_figma__*`) 형태로 노출된다. 이름에 `figma` 가 포함된 도구가 있으면 **연결됨(세션)**. 지연 로드 도구는 ToolSearch(있으면)로 `figma` 검색해 확인.
3. **CLI 헬스 확인** — Bash로 `claude mcp list`(읽기 전용). ✓=**연결됨**, ✗=**등록됨·연결 실패**. `claude mcp get figma` 로 상세. 명령이 없거나 실패하면 "확인 불가"로 두고 2단계 결과만 쓴다.
4. **판정** — 2·3 중 하나라도 연결이면 연결됨. 등록은 됐는데 연결이 안 됐으면 원인을 함께 보고(figma 는 대개 **Figma 데스크톱 앱 미실행 또는 Dev Mode MCP 꺼짐** — 자격증명 문제 아님). 레지스트리에 없는 MCP가 세션에 있으면 "참고: HDS 제공 아님(사용자/다른 플러그인)"으로 구분 표시.
5. (Codex 환경 질문일 때만) `~/.codex/config.toml` 의 `[mcp_servers.*]` 유무로 판단. 예시는 `${CLAUDE_PLUGIN_ROOT}/codex/config.example.toml`.

### 리포트 형식
레지스트리 순서대로 표 하나 + 필요 시 조치. 예:

| 커넥터 | 상태 | 원인 | 영향 받는 스킬 | 조치 |
| :-- | :-- | :-- | :-- | :-- |
| figma | ⚠️ 등록됨·연결 안 됨 | Figma 앱 Dev Mode MCP 꺼짐 | figma-bridge · brand-visual | 아래 안내 |

상태값: ✅ 연결됨 / ⚠️ 등록됨·연결 안 됨 / ✗ 확인 불가. 마지막에 한 줄 요약으로 **미연결이어도 메인 플로우엔 영향 없음**(제공 커넥터가 선택 기능뿐이면)을 명시. 미연결 상태로 `figma-bridge` 를 쓰려는 맥락이면 아래 안내를 잇는다.

### 미연결 시 안내
figma 는 **플러그인이 이미 등록**했으므로 서버를 추가할 필요가 없다. 대부분 **연결만 켜면** 된다.
- **Figma 데스크톱 앱**: Preferences → Enable Dev Mode MCP server 를 켠다(로컬 `http://127.0.0.1:3845/mcp`). 인증은 앱 세션 — 별도 토큰 불필요.
- **Claude Code**: 새 세션에서 `/mcp` 또는 `claude mcp list` 로 재확인.
- **Codex CLI**: `${CLAUDE_PLUGIN_ROOT}/codex/config.example.toml` 의 `[mcp_servers.figma]` 예시를 `~/.codex/config.toml` 에 병합.
- (개인 REST 토큰 기반 커뮤니티 서버를 쓰려면 registry 의 `connect.altUserConfig` 참조 — 이건 user 스코프로 각자 연결.)

연결 후 이 스킬을 다시 실행해 상태 변화를 확인시킨다.

## 커넥터 추가/변경 (관리)

1. **`registry.json` 에 등록** — `name·status·since·transport·scope·usedBy·purpose·connect`. figma 항목을 정본 예시로 같은 구조·깊이로 작성.
   - `transport`: `stdio`(로컬 프로세스 `command`/`args`/`env`) · `http`(`type:"http"`+`url`) · `sse`(deprecated) · `ws`. **`url` 을 쓰면 `type` 을 반드시 명시** — 없으면 Claude Code가 서버를 건너뛴다.
2. **연결 방식 결정 (scope)**
   - **`bundled`** — 플러그인이 자동 연결. `plugin.json` 의 `mcpServers`(또는 루트 `.mcp.json`)에 서버를 선언하면 설치 시 등록되고 도구는 `mcp__plugin_hds_<server>__<tool>` 로 네임스페이스된다. 경로는 `${CLAUDE_PLUGIN_ROOT}` 안으로만. **config 에 비밀이 없는 것만** — 로컬 stdio, 공개 http, 또는 "로컬 http + 앱/OS 세션 인증"(figma Dev Mode 처럼 URL만 등록·인증은 앱). 등록 시 `registry.json` 과 `plugin.json` 을 **같은 PR에서** 갱신.
   - **`user`** — 사용자가 각자 연결/인증(개인 API 토큰 필요 등). 번들하지 말고 `connect` 에 연결법만 적는다. 필요하면 `mcp/mcp.example.json` 에 예시 항목 추가.
   - **`project`** — 팀이 제품 저장소 `.mcp.json` 에 커밋(첫 사용 시 승인). 자격증명은 헤더/환경변수로, 값은 커밋 금지.
3. **소비 스킬 연결** — 그 커넥터를 쓰는 스킬(`usedBy`)의 SKILL.md에 "전제: 이 커넥터 필요 + 미연결 시 폴백"을 명시(`figma-bridge` 선례).
4. **버전** — `CHANGELOG.md` 기록 + `plugin.json`·`marketplace.json` version bump(둘을 항상 같이). 새 커넥터/스킬 추가는 MINOR.

## 보안 게이트 (반드시 확인)

- **번들에 비밀 없음** — 토큰·API 키가 config(`env`/`headers`/`url`)에 들어가는 커넥터를 `bundled` 로 두지 않는다. 자격증명은 레포 커밋 금지(`.gitignore`). figma 를 bundled 로 둘 수 있는 건 Dev Mode 가 로컬 URL만 쓰고 인증을 앱이 하기 때문 — 개인 REST 토큰 변형(`figma-developer-mcp`)은 `user` 로.
- **`url`엔 `type`** — http/sse/ws 커넥터는 `type` 누락 시 무시된다. stdio·http·sse·ws 외 transport를 쓰지 않는다.
- **플러그인 경로 경계** — `bundled` 서버의 `command`/`args`/`env` 경로는 `${CLAUDE_PLUGIN_ROOT}` 안으로만. `../` 로 플러그인 밖을 참조하지 않는다.
- **지어내기 금지** — 연결 방법·엔드포인트가 확실치 않으면 `connect.docs`(공식 문서)로 넘기고 config 는 예시임을 명시. 실제 값은 사용자가 공식 문서/`/mcp` 로 확인.

## 헷갈리는 짝

- **`mcp-connectors` vs `figma-bridge`** — mcp-connectors는 커넥터를 **등록·관리하고 현황을 본다**(무엇을 쓰는지·연결됐는지의 SoT). figma-bridge는 연결된 Figma MCP를 **실제로 사용**해 토큰/컴포넌트를 동기화한다. 관리하는 쪽과 쓰는 쪽.
- **레지스트리 vs `/mcp`** — 레지스트리는 *써야 하는* 커넥터(HDS의 의도), `/mcp`·`claude mcp list` 는 *지금 연결된* 커넥터(사용자 환경). 둘을 대조해 갭을 안내한다.
- **registry.json vs plugin.json** — registry 는 커넥터의 의미·목록(SoT), plugin.json 의 `mcpServers` 는 bundled 서버의 실제 실행 config(SoT). 어긋나면 plugin.json 기준으로 보고.

## 하지 말 것

- 연결을 대신 시도하거나 인증·설정 파일을 임의로 수정하지 말 것 — 이 스킬은 **현황 보고·안내·레지스트리 관리**까지만. 실제 연결/인증(Figma 앱 Dev Mode 켜기 등)은 사용자가 수행.
- `claude mcp list`/`get` 외의 상태 변경성 `claude mcp` 하위 명령(add/remove)을 실행하지 말 것 — bundled 서버는 이미 플러그인이 제공하므로 add 가 필요 없다.
