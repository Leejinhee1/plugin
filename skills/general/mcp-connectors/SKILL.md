---
name: mcp-connectors
description: HDS에서 사용가능한 MCP 커넥터 목록을 조회하고, 새 커넥터를 등록하거나 연결·번들 설정을 관리합니다. 어떤 MCP 서버를 쓰는지, 특정 커넥터를 어떻게 연결하는지, 새 커넥터를 추가할 때 사용. Use when listing HDS MCP connectors, checking how to connect one (e.g. Figma MCP), or registering/managing a connector.
---

# HDS MCP 커넥터

원본(SoT): `${CLAUDE_PLUGIN_ROOT}/mcp/registry.json`. 예시 설정: `${CLAUDE_PLUGIN_ROOT}/mcp/mcp.example.json`.

HDS 스킬 일부는 외부 MCP 서버를 씁니다(예: `figma-bridge` 의 Figma MCP). "무엇을 쓰는지·어떻게 연결하는지"의 진실은 컴포넌트가 `components/registry.json` 이듯, 커넥터는 이 레지스트리 한 곳입니다. 이 스킬은 그 레지스트리를 **조회**하고 **관리**합니다.

## 조회

- **"HDS가 무슨 MCP 커넥터 써?"** → `registry.json` 을 읽어 `name·status·scope·usedBy·purpose` 를 표로 답한다.
- **"figma 어떻게 연결해?"** → 해당 커넥터의 `connect`(연결법·확인법·공식 문서·예시 config)를 근거로 안내한다.
- **"지금 뭐가 연결돼 있어?"** → 레지스트리는 *무엇을 써야 하는지*, 실제 *연결 상태*는 사용자 환경이다. `/mcp` 패널 또는 `claude mcp list` 로 확인하도록 안내하고, 레지스트리의 `active` 목록과 대조한다(미연결 커넥터는 해당 스킬의 폴백을 알린다).

레지스트리에 없는 걸 지어내지 않는다 — 실제로 HDS 스킬이 쓰는 커넥터만 `active` 다.

## 커넥터 추가/변경 (관리)

1. **`registry.json` 에 등록** — `name·status·since·transport·scope·usedBy·purpose·connect`. Figma 항목을 정본 예시로 삼아 같은 구조·깊이로 작성한다.
   - `transport`: `stdio`(로컬 프로세스: `command`/`args`/`env`) · `http`(`type:"http"`+`url`) · `sse`(deprecated, 가능하면 http) · `ws`. **`url` 을 쓰면 `type` 을 반드시 명시** — 없으면 Claude Code가 서버를 건너뛴다.
   - `scope`: 아래 "연결 방식 결정" 참조.
2. **연결 방식 결정 (scope)**
   - **`bundled`** — 플러그인이 자동 연결. `.claude-plugin/plugin.json` 의 `mcpServers` 또는 루트 `.mcp.json` 에 서버를 선언하면 설치 시 자동 연결되고 도구는 `mcp__hds_<server>__<tool>` 로 네임스페이스된다. 경로는 `${CLAUDE_PLUGIN_ROOT}` 로 참조(플러그인 밖 경로 불가). **자격증명이 필요 없는 로컬 `stdio` 나 공개 `http` 만** 여기 둔다.
   - **`user`** — 사용자가 각자 연결/인증(Figma 처럼). 번들하지 말고 `connect` 에 연결법만 적는다. 필요하면 `mcp/mcp.example.json` 에 예시 항목을 더해 복사용으로 제공.
   - **`project`** — 팀이 제품 저장소의 `.mcp.json` 에 커밋(첫 사용 시 승인). 자격증명은 헤더/환경변수로, 값은 커밋 금지.
3. **소비 스킬 연결** — 그 커넥터를 쓰는 스킬(`usedBy`)의 SKILL.md에 "전제: 이 커넥터 필요 + 미연결 시 폴백"을 명시한다(`figma-bridge` 선례).
4. **버전** — `CHANGELOG.md` 기록 + `plugin.json`·`marketplace.json` version bump(둘을 항상 같이). 새 커넥터/스킬 추가는 MINOR.

## 보안 게이트 (반드시 확인)

- **번들에 비밀 없음** — 토큰·API 키·개인 인증 커넥터를 `bundled` 로 두지 않는다. 자격증명은 레포에 커밋 금지(`secrets/`·환경변수, `.gitignore` 차단).
- **`url`엔 `type`** — http/sse/ws 커넥터는 `type` 누락 시 무시된다. stdio·http·sse·ws 외 transport를 쓰지 않는다.
- **플러그인 경로 경계** — `bundled` 서버의 `command`/`args`/`env` 경로는 `${CLAUDE_PLUGIN_ROOT}` 안으로만. `../` 로 플러그인 밖을 참조하지 않는다.
- **지어내기 금지** — 연결 방법·엔드포인트가 확실치 않으면 `connect.docs`(공식 문서)로 넘기고 `exampleConfig` 는 예시임을 명시한다. 실제 값은 사용자가 공식 문서/`/mcp` 로 확인.

## 헷갈리는 짝

- **`mcp-connectors` vs `figma-bridge`** — mcp-connectors는 커넥터 목록을 **등록·관리**한다(어떤 MCP를 쓰는지의 SoT). figma-bridge는 연결된 Figma MCP를 **실제로 사용**해 토큰/컴포넌트를 동기화한다. 등록하는 쪽과 쓰는 쪽.
- **레지스트리 vs `/mcp`** — 레지스트리는 *써야 하는* 커넥터(HDS의 의도), `/mcp`·`claude mcp list` 는 *지금 연결된* 커넥터(사용자 환경). 둘을 대조해 갭을 안내한다.
