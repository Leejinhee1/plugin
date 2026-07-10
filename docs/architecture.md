# 아키텍처 — 왜 이렇게 설계했는가

> 이 프로젝트의 1순위 요구사항은 **유지보수성**입니다. 모든 구조 결정은 "장기적으로 업데이트가 쉬운가"를 기준으로 내렸습니다.

## 한 장 요약

```
                ┌─────────────────────────────────────────────┐
                │  단일 소스 오브 트루스 (SoT)                  │
                │  plugins/hds-design/design-system/           │
                │    tokens · guidelines · components · usage   │
                └───────────────┬──────────────────────────────┘
                                │ (참조; 파일은 한 벌)
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                        ▼
  Claude 플러그인          Codex 어댑터            파생 산출물
  (skills/agents)         (AGENTS.md/prompts)     tokens.css · Tailwind
   hds-design                                     preset · Figma vars
   hds-planning                                   (항상 재생성 가능)
   hds-publish
```

## 결정 1 — 내용과 하네스의 분리
디자인 시스템의 **내용**(토큰·컴포넌트·가이드)과 그것을 **호출하는 하네스**(Claude 스킬, Codex 프롬프트)를 분리했습니다.
- 내용은 `design-system/` 에 한 벌만.
- 스킬/프롬프트는 그 파일을 읽으라고 지시하는 얇은 포인터.
- **효과**: 새 하네스(예: 다른 AI 툴)가 생겨도 내용을 복제하지 않습니다. 내용을 한 번 고치면 모두 반영됩니다.

## 결정 2 — 2레이어 토큰 (core → semantic)
- `core`: 브랜드 원시값(팔레트 전체). UI가 직접 보지 않음.
- `semantic`: 의미 별칭(`brand.default`, `fg.muted`). UI/컴포넌트는 이 레이어만 참조.
- **효과**: 리브랜딩/다크테마/그룹사별 테마를 core 한 곳 교체로 대응. 컴포넌트 코드는 불변.

## 결정 3 — 표준 포맷으로 벤더 종속 회피
- 토큰: [W3C DTCG](https://tr.designtokens.org/format/) — Style Dictionary·Tokens Studio·Terrazzo 등이 그대로 소비.
- 컴포넌트: shadcn식 **레지스트리 + vendoring** — 런타임 의존 라이브러리가 아니라 프로젝트로 복사해 소유.
- **효과**: 특정 툴이 사라져도 자산이 살아남습니다. 그룹사 전체 확장 시 유리.

## 결정 4 — 역할별 플러그인 + 의존성
- `hds-design`(내용+디자인) · `hds-planning`(기획) · `hds-publish`(퍼블) 3개로 분리.
- planning/publish는 `hds-design` 에 `dependencies` 로 의존 → 설치 시 자동 동반, 항상 같은 SoT를 봄.
- **효과**: 역할별로 필요한 것만 설치하되, 내용은 항상 하나로 수렴.

## 결정 5 — 코드가 소스, Figma는 브릿지
- AI가 직접 읽고 고치기 가장 쉬운 형태는 텍스트(코드/JSON/MD)입니다 → 코드를 원본으로.
- Figma는 `figma-bridge` 로 양방향 동기화하되, 충돌 시 **코드가 진실**.
- **효과**: AI-리더블 관리와 디자이너 협업을 모두 확보하면서 원본이 흔들리지 않음.

## 흐름: 기획 → 디자인 → 퍼블 (한 방향으로 흐르되 SoT로 수렴)
1. 기획: `product-spec` 이 화면을 **HDS 컴포넌트/토큰 이름**으로 명세.
2. 기획: `prototype` 이 레지스트리에서 조립해 동작 프로토타입 생성.
3. 퍼블: `token-export` + `component-build` 로 프로토타입을 개발 코드로 승격.
4. 새 요구는 화면에 임시 반영하지 않고 **디자인 시스템(SoT)에 승격** → 다음부터 모두가 재사용.

## 확장 시나리오 (부서 → 그룹사)
- 그룹사 공통은 이 마켓플레이스에, 계열사 특화는 `core` 토큰 오버라이드 또는 별도 플러그인 + `dependencies`.
- 여러 마켓플레이스로 나뉘면 `allowCrossMarketplaceDependenciesOn` 으로 의존 허용.
