---
name: component-catalog
description: HDS 컴포넌트 카탈로그를 조회하고, 새 컴포넌트를 추가하거나 기존 컴포넌트의 스펙·사용사례를 갱신합니다. 어떤 컴포넌트가 있는지, 특정 컴포넌트를 어떻게 쓰는지, 새 컴포넌트를 만들 때 사용. Use when listing components, authoring a new component (spec+code+usage), or updating usage examples.
---

# HDS 컴포넌트 카탈로그

원본: `${CLAUDE_PLUGIN_ROOT}/design-system/components/`. 인덱스는 `registry.json`.

## 조회
- "무슨 컴포넌트 있어?" → `registry.json` 을 읽어 name·status·용도를 표로 답한다.
- "Button 어떻게 써?" → 해당 폴더의 `spec.md`(API) + `usage.md`(사례)를 근거로 답한다.

## 새 컴포넌트 추가 (3종 세트 + 등록)
1. `components/<name>/` 생성
2. `spec.md` — 프론트매터(name/status/since) + variant·size·state·**토큰 매핑**·접근성·안티패턴
3. `<Component>.tsx` — 레퍼런스 구현. **색/간격은 semantic 토큰 CSS 변수(`--hds-*`)만** 참조. 하드코딩 금지.
4. `usage.md` — 화면별 사용 사례 + 안티패턴
5. `registry.json` 에 등록 (spec/source/usage/tokens 경로, `status`, `since`)
6. `CHANGELOG.md` + version bump

Button(`components/button/`)을 정본 예시로 삼아 동일한 구조·깊이로 작성한다.

## 품질 게이트
- 기존 컴포넌트 조합으로 되는 건 새로 만들지 않는다(원칙 1).
- 스펙의 토큰 매핑과 코드의 실제 CSS 변수가 일치하는지 확인.
- 접근성(키보드·포커스·aria) 항목이 spec과 코드 모두에 있는지 확인.
- 상세 검수는 `hds-design:design-reviewer` 에이전트에 위임 가능.
