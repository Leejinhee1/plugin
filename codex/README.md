# HDS — Codex 어댑터

Codex CLI에서 HDS 디자인 시스템을 Claude Code와 **동일한 규칙·동일한 소스**로 사용하기 위한 얇은 어댑터입니다.

## 구성
- `AGENTS.md` — Codex가 읽는 하네스 규칙(소스 경로 + 불변 규칙). 저장소를 열면 자동 로드됩니다.
- `prompts/` — 슬래시 커맨드용 프롬프트. `~/.codex/prompts/` 로 복사해 사용.
- `config.example.toml` — 선택적 MCP(Figma 등) 연동 예시.

## 설치
```bash
# 1) 커스텀 프롬프트 등록
mkdir -p ~/.codex/prompts
cp codex/prompts/*.md ~/.codex/prompts/

# 2) (선택) MCP/프로젝트 설정 병합
#   codex/config.example.toml 내용을 ~/.codex/config.toml 에 반영

# 3) 이 저장소(또는 심볼릭 링크)를 작업 대상 근처에 두면
#    Codex가 AGENTS.md 를 읽어 규칙을 적용합니다.
```

## 왜 얇은가 (유지보수)
디자인 시스템의 진짜 내용(토큰·컴포넌트·가이드)은 `plugins/hds-design/design-system/` 에 **한 번만** 존재합니다.
Codex 프롬프트와 Claude 스킬은 모두 그 파일을 읽는 포인터일 뿐이라, 내용을 한 곳에서 고치면 두 하네스에 동시에 반영됩니다.
