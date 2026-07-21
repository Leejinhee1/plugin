# HES MCP 커넥터 레지스트리

HES 스킬이 사용하는 **MCP 서버(커넥터)의 단일 소스**입니다. `design-system/components/registry.json` 이 컴포넌트의 SoT이듯, 여기가 커넥터의 SoT입니다.

- **`registry.json`** — 커넥터 인덱스. `name·status·since·transport·scope·usedBy·연결법`. 조회·관리 대상.
- **`mcp.example.json`** — 복사용 예시 `.mcp.json`. 플러그인 없이 프로젝트/다른 하네스에서 같은 서버를 쓸 때 참고.

조회·현황 확인·등록·관리는 **`/hes:mcp-connectors`** 스킬로 합니다.

## bundled 의 진실은 plugin.json

`scope=bundled` 커넥터의 **실제 실행 config 는 `.claude-plugin/plugin.json` 의 `mcpServers` 가 진실**입니다. 이 레지스트리의 `connect.bundledConfig` 는 그 사본이며, 어긋나면 `plugin.json` 을 기준으로 삼습니다. 플러그인이 등록하므로 사용자는 서버를 따로 추가할 필요가 없고, 도구는 `mcp__plugin_hes_<서버명>__*` 로 노출됩니다.

## 필드

| 필드 | 뜻 |
| :-- | :-- |
| `name` | 커넥터 식별자(= MCP 서버 이름). |
| `status` | `active`(HES 스킬이 실제 사용) · `candidate`(검토 중) · `deprecated`(대체재 명시). |
| `since` | 등록된 HES 버전. |
| `transport` | `stdio` · `http` · `sse`(deprecated) · `ws`. `url` 커넥터는 `type` 을 반드시 명시. |
| `scope` | `bundled`(플러그인이 `mcpServers` 로 등록, **config 에 비밀 없는 것만**) · `user`(각자 연결/인증) · `project`(팀 `.mcp.json` 커밋). |
| `required` | HES 전체 사용에 필수인지(대개 특정 플로우에서만 필요 → false). |
| `usedBy` | 이 커넥터를 쓰는 HES 스킬 목록. |
| `connect` | 연결법·확인법(`/mcp`)·공식 문서·config(번들/대안)·폴백. |

## 원칙

1. **SoT는 여기 한 곳** — 어떤 커넥터를 쓰는지의 진실은 `registry.json`. 스킬 문서는 이 파일을 가리키는 얇은 포인터. (bundled 실행 config 의 진실은 `plugin.json`.)
2. **번들에 비밀 없음** — 번들 config(`command`/`args`/`env`/`url`/`headers`)에 토큰·키를 넣지 않는다. 로컬 `stdio`·공개 `http`·"로컬 http + 앱/OS 세션 인증"(예: Figma Dev Mode `127.0.0.1:3845` — URL만 등록, 인증은 Figma 앱)처럼 config 에 비밀이 없는 것만 `bundled`. 개인 API 토큰이 필요한 변형(예: `figma-developer-mcp` + `FIGMA_API_KEY`)은 `user`/`project` 로.
3. **지어내지 않음** — 실제로 HES 스킬이 참조/사용하는 커넥터만 `active`. 후보는 `candidate` 로 두고 `usedBy` 를 비운다.
4. **바꾸면 버전과 함께** — 커넥터를 추가/변경하면 `plugin.json`(mcpServers)·이 레지스트리·`CHANGELOG.md` + `plugin.json`·`marketplace.json` version bump(둘을 항상 같이).
