---
name: figma-bridge
description: HDS 코드 기반 디자인 시스템과 Figma를 동기화합니다. 토큰을 Figma Variables로 내보내거나, Figma 디자인을 코드 토큰/컴포넌트와 대조·연결(Code Connect)할 때 사용. Use when syncing HDS tokens/components with Figma in either direction.
---

# Figma 브릿지 (선택적)

HDS의 **소스 오브 트루스는 코드**(`design-system/`)입니다. Figma는 소비/협업 채널로, 이 스킬로 양방향 동기화합니다.

## 전제
Figma MCP 서버(공식 Dev Mode)는 **플러그인이 직접 제공**합니다(`plugin.json` 의 `mcpServers.figma`, 로컬 `http://127.0.0.1:3845/mcp`). 따로 설치할 필요 없이 Figma 데스크톱 앱에서 **Dev Mode MCP 서버를 켜면** 연결됩니다(별도 토큰 불필요 — 인증은 앱 세션). 연결 여부가 불확실하면 먼저 `/hds:mcp-connectors` 로 현황(등록/연결/원인)을 확인하고, 미연결이면 그 스킬의 안내를 따르세요. Figma의 `use_figma` 계열 호출 전에는 반드시 `figma-use` 스킬 규칙을 따릅니다.

## 방향별 작업
### 코드 → Figma (토큰/라이브러리 발행)
1. `design-system/tokens/` 의 4파일(core·semantic·component·platform)을 읽는다.
2. Figma Variables로 매핑해 발행한다 — HES 컬렉션 구조 대응: core→`base`, semantic+component→`theme`(모드 Light/Dark), platform→`platform`(모드 AOS/iOS/PC/Min). 라이브러리 생성은 `figma-generate-library` 규칙을 따른다.

### Figma → 코드 (대조/역동기화)
1. Figma 변수/컴포넌트를 읽어 코드 토큰과 diff.
2. 차이가 있으면 **코드를 기준**으로 판단: 의도된 디자인 변경이면 `tokens/` 를 갱신(version bump), 아니면 Figma를 코드에 맞춘다.

### Code Connect
컴포넌트를 Figma 노드와 매핑해 디자인↔구현 추적성을 확보(`get_code_connect_map`/`add_code_connect_map`). Button 등 stable 컴포넌트부터 연결.

## 원칙
충돌 시 **코드가 진실**. Figma를 원본으로 삼아 코드를 덮어쓰지 않는다.
