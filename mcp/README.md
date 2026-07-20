# HDS MCP 커넥터 레지스트리

HDS 스킬이 사용하는 **MCP 서버(커넥터)의 단일 소스**입니다. `design-system/components/registry.json` 이 컴포넌트의 SoT이듯, 여기가 커넥터의 SoT입니다.

- **`registry.json`** — 커넥터 인덱스. `name·status·scope·transport·usedBy·연결법`. 조회·관리 대상.
- **`mcp.example.json`** — 복사용 예시 `.mcp.json`. `user` 스코프 커넥터를 각자 연결할 때 참고.

조회·등록·관리는 **`/hds:mcp-connectors`** 스킬로 합니다.

## 필드

| 필드 | 뜻 |
| :-- | :-- |
| `name` | 커넥터 식별자(= MCP 서버 이름). |
| `status` | `active`(HDS 스킬이 실제 사용) · `candidate`(검토 중) · `deprecated`(대체재 명시). |
| `since` | 등록된 HDS 버전. |
| `transport` | `stdio` · `http` · `sse`(deprecated) · `ws`. `url` 커넥터는 `type` 을 반드시 명시. |
| `scope` | `bundled`(플러그인이 자동 연결, **자격증명 없는 것만**) · `user`(각자 연결/인증) · `project`(팀 `.mcp.json` 커밋). |
| `required` | HDS 전체 사용에 필수인지(대개 특정 플로우에서만 필요 → false). |
| `usedBy` | 이 커넥터를 쓰는 HDS 스킬 목록. |
| `connect` | 연결법·확인법(`/mcp`)·공식 문서·예시 config·폴백. |

## 원칙

1. **SoT는 여기 한 곳** — 어떤 커넥터를 쓰는지의 진실은 `registry.json`. 스킬 문서는 이 파일을 가리키는 얇은 포인터.
2. **번들에 비밀 없음** — 자격증명/개인 인증이 필요한 커넥터(예: Figma)는 `bundled` 로 두지 않는다. 토큰·키는 커밋 금지(`.gitignore`). `bundled` 는 자격증명 없는 로컬 `stdio` 나 공개 `http` 만.
3. **지어내지 않음** — 실제로 HDS 스킬이 참조/사용하는 커넥터만 `active`. 후보는 `candidate` 로 두고 `usedBy` 를 비운다.
4. **바꾸면 버전과 함께** — 커넥터를 추가/변경하면 `CHANGELOG.md` + `plugin.json`·`marketplace.json` version bump(둘을 항상 같이).
