---
name: ui-review
description: 퍼블 구현 결과(컴포넌트 설치·화면 구현 diff)를 배포 전에 스펙 정합성과 코드 표준 2축으로 병렬 리뷰합니다. 설계서/HDS spec 대비 구현 누락, 토큰 준수, 접근성 표면, React/TS 코드 스멜을 점검할 때 사용. Use when reviewing implemented components/screens against the product spec and HDS coding standards before shipping.
---

# UI 리뷰 (2축 병렬 리뷰)

퍼블리셔가 구현한 컴포넌트 설치·화면 구현 diff를 배포 전에 검토합니다. mattpocock/skills 의 code-review 기법을 차용해 **Spec축**과 **Standards축**을 완전히 분리된 병렬 리뷰로 실행합니다.

## 사전 확인
구현 전 단계(설계서·프로토타입)가 흐릿하면 리뷰보다 먼저 다음을 읽는다:
- 제품 설계서의 "5. 화면 명세"(보통 `docs/specs/*.md`)
- handoff 문서 `docs/specs/*.handoff.md` (있다면)
- 대상 HDS 컴포넌트의 `spec.md` (`hds-design` 의 `registry.json` 경유로 조회)

## 실행 방법
두 축을 **각각 독립 서브에이전트(Task/Explore)로 병렬 실행**한다. 한 에이전트가 두 역할을 순차로 겸하지 않는다 — 같은 코드를 보더라도 관점을 섞지 않기 위함이다.

### Spec축 — 구현이 설계서·컴포넌트 spec을 충실히 반영했는가
- 화면 명세(§5)에 있는 variant/상태(empty·loading·error)가 모두 구현됐는가, 누락은 없는가
- 반응형(모바일/데스크톱) 분기가 명세대로 존재하는가
- 사용된 HDS 컴포넌트의 props/상태가 `spec.md` 와 일치하는가
- 명세에 없는 화면 요소가 임의로 추가되지 않았는가

### Standards축 — 코드 자체가 HDS 코드 표준을 지키는가
- **토큰 준수** — 색·간격 하드코딩은 위반이다(원칙 2). semantic 토큰(CSS 변수) 참조인지 확인.
- **컴포넌트 임의 변형** — 설치된 HDS 컴포넌트를 프로젝트 안에서 몰래 바꾸지 않았는가.
- **접근성 표면** — 키보드 접근·`:focus-visible`·aria 속성의 존재 여부만 확인한다. **대비 수치 계산·모션 민감성 등 심층 접근성은 `/hds-publish:a11y-audit` 에 위임**하며 이 축에서 다시 계산하지 않는다.
- **React/TS 품질(스멜)** — 중복 코드, 임의 유틸 재발명(`cn()` 등 기존 유틸 무시), prop drilling 과다. **각 항목은 판단이지 강제 위반이 아니다** — 스타일 취향까지 blocker로 올리지 않는다.

## 결과 통합 규칙
Do not merge or rerank findings — the two axes are deliberately separate. 두 축의 발견을 하나로 합치거나 우선순위를 다시 매기지 않고, **축별로 나란히** 보고한다.

두 축이 같은 코드를 서로 다른 근거로 지적하는 등 우선순위 판단이 필요할 때는 다음 규칙을 따른다: **프로젝트/HDS 저장소 고유 규칙이 일반 관행보다 항상 이긴다(The repo overrides).** 즉 `principles.md`·`registry.json`·설계서의 명시적 규칙이 일반적인 React/TS 관행보다 우선한다.

## 보고 형식
축별로 표로 정리한다.

| 심각도 | 근거(파일:라인) | 발견 | 수정안 |
| :-- | :-- | :-- | :-- |
| blocker/warning/nit | `path/to/file.tsx:42` | ... | ... |

- **blocker** — 배포 차단(명세 상태 누락, 토큰 하드코딩, 키보드 접근 불가 등)
- **warning** — 배포는 가능하나 다음 PR 전 수정 권장
- **nit** — 판단 영역, 강제하지 않음

## 수정 적용
발견당 원자적으로 수정한다(여러 발견을 한 번에 묶어 고치지 않는다). 수정 후 해당 발견만 재검증한다.

## 흐름 연결
1. 구현(`/hds-publish:component-build` 등)
2. **이 스킬 — 2축 리뷰, blocker 0 확인**
3. `/hds-publish:a11y-audit` — 대비 수치 등 심층 접근성 점검
4. 배포
