---
name: figma-bridge
description: Figma와 HES 코드 디자인시스템을 잇는 스킬. 세 가지 행위 — 동기화(토큰·Code Connect 정합), 구현(Figma 화면→코드), 검증(픽셀 대조·회귀) — 를 한 스킬에서 수행. 코드가 진실. 스택 세부는 adapters/<스택>.md. Use for any Figma↔code work: syncing tokens, implementing a Figma frame, or verifying an implementation.
---

# Figma 브릿지 (동기화 · 구현 · 검증)

Figma와 HES 코드 디자인시스템 사이의 모든 작업을 한 스킬에서 세 행위로 다룹니다.

## 진실 규칙 (최우선 — 코드가 진실)
- SSOT는 **코드**(`${CLAUDE_PLUGIN_ROOT}/design-system/`). Figma는 소비/협업/요청 채널.
- 충돌 시 코드가 이긴다. Figma를 원본 삼아 코드를 덮어쓰지 않는다.
- Figma 값이 코드 토큰/컴포넌트에 **없으면** → 하드코딩 말고 **"신규 토큰/컴포넌트 후보"로 보고**해 코드 SSOT에 흡수. (⛔ 근사 치환·눈대중 금지 — 값은 Figma MCP 실측)

## 0. 공통 준비
- Figma MCP(공식 Dev Mode)는 플러그인이 제공(`plugin.json` 의 `mcpServers.figma`, 로컬 `http://127.0.0.1:3845/mcp`). Figma 데스크톱 앱에서 Dev Mode MCP 서버를 켜면 연결(별도 토큰 불필요). 미연결이면 `/hes:mcp-connectors` 로 현황 확인. `use_figma` 계열 호출 전 `figma-use` 규칙 준수.
- **구현·검증 행위 시작 전, 대상 스택 어댑터를 확정한다(코드 변환의 전제):**
  1. `adapters/` 의 사용 가능한 어댑터를 확인한다 — 현재: `react-tailwind`(React+Tailwind), `njk-scss`(하나머니 Nunjucks+SCSS).
  2. **어떤 어댑터로 변환할지 사용자에게 묻고 확정한다.** 대상 프로젝트 신호(`.tsx`·`tailwind.config` vs `.njk`·`scss`)로 명확히 추정되면 그 어댑터를 **기본값으로 제시**하되, 골라 확정하게 한다. 어댑터가 하나뿐이면 그것으로 진행(질문 생략).
  3. 확정한 `adapters/<stack>.md` 를 읽는다. 이하 "⟨어댑터⟩"는 그 파일이 정의한 값.
- **왕복 최소화(전 행위 공통):** 독립 호출(MCP·grep·Read)은 한 메시지에 배칭 · 파일은 Write 1회 · 확인용 재읽기 금지.

---

## 행위 A — 동기화·정합
기존 토큰·컴포넌트를 Figma와 맞춘다.

- **코드 → Figma(발행):** `design-system/tokens/` 의 4파일(core·semantic·component·platform)을 Figma Variables로 매핑 발행 — core→`base`, semantic+component→`theme`(Light/Dark), platform→`platform`(AOS/iOS/PC/Min). 라이브러리 생성은 `figma-generate-library` 규칙.
- **Figma → 코드(대조):** Figma 변수/컴포넌트를 읽어 코드와 diff. **매핑 커버리지 진단**(`scripts/figma-token-map.mjs`)으로 판정 — ✅일치 / 🔶값불일치 / 🔁후보 / ⚠️미매핑. 의도된 디자인 변경이면 `tokens/` 갱신(version bump), ⚠️미매핑은 신규 토큰 후보로 보고.
  > 실행: `node "${CLAUDE_PLUGIN_ROOT}/skills/design/figma-bridge/scripts/figma-token-map.mjs" --figma <get_variable_defs 저장 JSON>` (무의존 · 기본 대상=플러그인 토큰 · `--tokens <dir>`로 변경 · `--json` 기계출력). 값 기반 휴리스틱이라 🔶/🔁는 사용자 확인.
- **Code Connect:** 컴포넌트↔Figma 노드 매핑(`get_code_connect_map`/`add_code_connect_map`). stable 컴포넌트(Button 등)부터.

## 행위 B — 구현 (Figma 화면 → 코드)
Figma 디자인을 **코드 어휘로 번역**해 화면/컴포넌트를 만든다.

1. **Figma 직독 — MCP 배칭:** `get_metadata`·`get_design_context`·`get_variable_defs`·`get_screenshot`·`get_code_connect_map`을 **한 메시지에**(서로 의존 없음). 참고 코드(React/Tailwind)는 구조 참고용, 그대로 옮기지 않음.
2. **변수→토큰 매핑:** 행위 A의 진단 도구(`scripts/figma-token-map.mjs`)를 재사용. ⚠️미매핑 = 신규 후보. 표기는 ⟨어댑터⟩.
3. **재사용 사다리 — 모양 고정, 각 칸은 ⟨어댑터⟩:**
   `① Code Connect → ② 기존 컴포넌트 → ③ variant/조합 → ④ 스택 유틸 → ⑤ 토큰 → ⑥ 국소 선언`
   높은 재사용부터, 안 될 때만 한 칸씩 내려간다. 기존 컴포넌트 조합으로 되는 건 새로 만들지 않는다. (기존 자산 조회는 `/hes:component-catalog`·`registry.json` 활용.)
4. **에셋:** 기존 재사용 우선 → 없으면 Figma export → 최적화. 위치·명명·도구는 ⟨어댑터⟩. ⛔ CSS 도형·이모지 흉내 금지.
5. **작성:** 파일당 Write 1회. 형식·배치·스코프·등록은 ⟨어댑터⟩. 값은 전부 §B-1 MCP 실측.

## 행위 C — 검증
구현이 요청을 반영했고 다른 화면을 깨지 않았는지 확인.

- **적합성(픽셀 대조):** Figma 스크린샷(행위 B baseline) vs 구현 렌더를 픽셀 diff + side-by-side(원본│구현│diff). 상이는 **구조 → 간격/정렬 → 타이포 → 색** 순으로 원인 분석 → 수정 → 재대조(수렴 루프). 렌더 방법은 ⟨어댑터⟩. **코드가 진실**이므로 Figma와 다르면 "코드를 바꿀지"를 결정(Figma 자동 승리 아님).
- **회귀(기준선=코드 이전 렌더):** 토큰·공용 자산을 건드렸으면 영향범위 산출 → 안 건드린 화면의 픽셀 diff로 회귀 검출. 기준선은 Figma가 아니라 **직전 코드 렌더**(git baseline).
- **접근성:** `/hes:a11y-audit` 호출(대비·키보드·aria).

> **도구 참고 — 검증은 번들 실행 도구가 없다.** 이 플러그인은 픽셀 diff·캡처·시각회귀 스크립트를 동봉하지 않는다. **캡처는 세션 브라우저 자동화**(`claude-in-chrome`/`playwright` MCP)로 하고, **픽셀 비교는 side-by-side를 에이전트가 판독**한다(결정적 diff 아님). 대상 프로젝트에 전용 검증 도구가 있으면 그것을 우선 사용한다(예: `njk-scss` 어댑터 = 하나머니 검증 원샷). 접근성만 결정적(`a11y-audit`).

---

## 막혔을 때 — 멈추지 말고 결정 (품질은 낮추지 않음)
사용자에게 올리는 건 **2개뿐**: ① 노드 특정 불가 ② 에셋 수신 불가. 그 외는 결정 + 근거 한 줄. 단 근사 치환·눈대중·CSS 아이콘 흉내 금지 → 실측값 국소 선언 + "신규 토큰 필요".

## 어댑터가 정의하는 계약 (새 스택 = 이 7개만 채움)
1. 재사용 사다리 각 칸(②~⑥ 실제 대상)  2. 토큰 참조 표기  3. 컴포넌트 소스 위치·조회법  4. 산출물 형식·배치·스코프·등록  5. 에셋 위치·명명·도구  6. 스택 특유 금지  7. 검증 렌더 방법
