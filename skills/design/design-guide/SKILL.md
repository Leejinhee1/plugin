---
name: design-guide
description: HES 디자인 가이드(원칙·색·타이포·모션 규범)를 조회하고 유지보수합니다. 디자인 결정이 가이드에 맞는지 검토하거나, 가이드 문서를 갱신할 때 사용. Use when checking a design decision against HES guidelines or updating the guideline docs.
---

# HES 디자인 가이드

애플리케이션 디자인의 규범 문서를 관리합니다. 원본: `${CLAUDE_PLUGIN_ROOT}/design-system/guidelines/`.

## 문서 맵
- `principles.md` — 6대 원칙 (본질 우선, 토큰이 진실, 접근성 기본, 일관성, AI-리더블, 반응형·테마)
- `color.md` · `typography.md` · `motion.md` — 영역별 상세 규범

## 사용법
1. 질문/검토 요청 시 관련 가이드를 읽고, **원칙 번호를 근거로** 답한다.
2. 디자인 산출물(컴포넌트/화면)이 가이드에 어긋나면 어떤 원칙을 위반했고 어떻게 고칠지 제시한다.
3. 가이드를 새로 정할 때는 사람이 읽기 쉽고 AI가 규칙으로 해석 가능하도록 **표·명시적 규칙**으로 작성한다.

## 유지보수
- 가이드 변경은 조직 전체에 영향 → 변경 시 `CHANGELOG.md` 기록 + version bump.
- 예외를 허용하기보다, 반복되는 요구는 토큰/컴포넌트 변형으로 시스템에 반영한다(원칙 4).
