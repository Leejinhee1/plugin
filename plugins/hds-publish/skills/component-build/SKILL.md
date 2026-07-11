---
name: component-build
description: HDS 컴포넌트/프로토타입을 바로 개발에 적용 가능한 프로덕션 코드로 변환해 사용자의 프로젝트에 설치합니다. 디자인 시스템 컴포넌트를 실제 코드베이스에 가져오거나 화면을 구현 코드로 만들 때 사용. Use when vendoring HDS components into a project or turning a design/prototype into production-ready code.
---

# 컴포넌트 빌드 (디자인 시스템 → 개발 적용 코드)

shadcn처럼 **HDS 레지스트리에서 컴포넌트를 가져와 사용자 프로젝트에 설치**합니다.
목적: 퍼블리셔가 디자인 시스템을 바로 개발에 적용.

## 입력
- 대상 컴포넌트: `hds-design` 의 `design-system/components/registry.json` 에서 조회.
- 대상 프로젝트: 사용자의 현재 리포(React + Tailwind 가정).

## 절차
1. **레지스트리 조회** — 요청 컴포넌트의 `source`/`spec`/`dependencies`/`tokens` 확인. 의존 컴포넌트도 함께 가져온다.
2. **토큰 선행** — `/hds-publish:token-export` 로 `tokens.css`(+tailwind preset)를 프로젝트에 설치/갱신하고, 엔트리에서 import 하도록 안내.
3. **컴포넌트 설치** — 레퍼런스 소스를 프로젝트 규칙에 맞춰 배치(예: `src/components/ui/<name>.tsx`).
   - `cn()` 유틸을 프로젝트 것으로 연결(clsx + tailwind-merge).
   - import 경로·파일명 컨벤션을 프로젝트에 맞춤.
   - **토큰 CSS 변수 참조는 유지**(값 하드코딩으로 바꾸지 말 것).
4. **검증** — 타입체크/빌드가 통과하는지 확인. `spec.md` 의 props·상태가 유지됐는지 대조. 접근성은 `/hds-publish:a11y-audit`.
5. **기록** — 어떤 컴포넌트를 어떤 HDS version에서 가져왔는지 프로젝트에 남긴다(업데이트 추적용).

설치/구현 후 `/hds-publish:ui-review` 로 2축 리뷰(스펙 정합·코드 표준)를 거친다.

## 업데이트
HDS가 올라가면(마켓플레이스 update) 재실행해 컴포넌트를 갱신. 프로젝트에서 커스터마이즈한 부분은 diff로 검토 후 병합.

## 원칙
- **가져오되 소스는 HDS**: 프로젝트 안에서 임의로 디자인을 바꾸지 말고, 필요하면 HDS에 반영 후 다시 가져온다.
- 프레임워크가 React가 아니면 사용자에게 확인하고 스펙(spec.md) 기준으로 해당 프레임워크 구현을 생성.
