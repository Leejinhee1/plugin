# 시작하기

## 1. 사전 준비
- Claude Code 최신 버전(`/plugin` 명령이 보여야 함).
- (퍼블) Node.js + React/Tailwind 프로젝트.
- (선택) Figma MCP 연결 — Figma 동기화를 쓸 경우.

## 2. 설치

### A. 사내 마켓플레이스로 설치 (권장, 팀 배포)
```bash
/plugin marketplace add leejinhee1/plugin      # private repo 가능
/plugin install hds@hds                        # 이 한 번으로 기획·디자인·퍼블 스킬 전체 설치
```
> 팀 공유는 프로젝트 스코프로: `claude plugin install hds@hds --scope project` → `.claude/settings.json` 커밋.

### B. 개발/체험용 (설치 없이)
```bash
claude --plugin-dir .        # 저장소 루트가 곧 플러그인
```
수정 후에는 `/reload-plugins`.

### C. Codex CLI
```bash
cp codex/prompts/*.md ~/.codex/prompts/
# 필요 시 codex/config.example.toml 을 ~/.codex/config.toml 에 병합
```

## 3. 역할별 첫 사용

### 기획
1. `/hds:product-spec 새 결제 화면` → 템플릿 기반 설계서 초안.
2. 화면을 HDS 컴포넌트/토큰 이름으로 채운다.
3. `/hds:prototype` → 설계서로 동작 프로토타입 생성.

### 디자인
- `/hds:component-catalog` → 있는 컴포넌트 확인 / 새 컴포넌트 추가.
- `/hds:design-tokens 브랜드 색을 초록으로` → core 토큰만 바꿔 전체 반영.
- `/hds:design-guide` → 결정이 원칙에 맞는지 검토.

### 퍼블
1. `/hds:token-export` → `tokens.css` + Tailwind preset 생성.
2. `/hds:component-build button` → 프로젝트에 컴포넌트 설치.
3. `/hds:a11y-audit` → 접근성 점검.

## 4. 검증
```bash
claude plugin validate . --strict
```
