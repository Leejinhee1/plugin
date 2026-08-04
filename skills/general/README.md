# HES 스킬 · 공통 (general)

특정 역할에 속하지 않는, 파트 공통 스킬 묶음입니다.

## 스킬
**이 버킷의 두 스킬은 현재 설치되는 3개 중 2개입니다** (나머지 하나는 `/hes:test-script`). 다른 버킷의 스킬은 대부분 🚧 준비중 — `.claude-plugin/plugin.json` 의 `_disabledSkills` 참조.

두 스킬 모두 frontmatter에 `disable-model-invocation: true` 가 있어 **모델이 자동으로 호출하지 않고, 사용자가 `/hes:` 로 직접 불러야** 실행됩니다(라우터·조회 성격이라 의도된 설정).

| 스킬 | 용도 |
| :-- | :-- |
| `/hes:ask-hes` | 지금 상황에 어떤 스킬·플로우가 맞는지 알려주는 라우터. 일은 직접 하지 않고 안내만. 준비중 스킬은 그 사실과 대안을 함께 안내. |
| `/hes:mcp-connectors` | 플러그인이 **제공(번들)** 하는 커넥터·MCP 서버(`mcp/registry.json`·`plugin.json` 의 `mcpServers`)의 공식 목록과 현재 세션 연결 현황 리포트 + 커넥터 등록·관리. 미연결 시 연결 방법 안내. |
