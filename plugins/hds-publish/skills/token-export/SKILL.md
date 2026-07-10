---
name: token-export
description: HDS 디자인 토큰(DTCG)을 개발에 바로 쓸 산출물 — CSS 변수(tokens.css), Tailwind preset, TS 타입 — 로 내보냅니다. 토큰을 코드에서 소비할 형태로 변환할 때 사용. Use when generating tokens.css, tailwind preset, or TS token types from HDS tokens.
---

# 토큰 내보내기 (DTCG → 코드 산출물)

HDS 토큰 원본(`hds-design` 의 `design-system/tokens/`)을 개발이 소비하는 형태로 변환합니다.
**원본을 고치지 않습니다.** 여기서 나오는 파일은 항상 파생 산출물(재생성 가능).

## 산출물
| 파일 | 용도 |
| :-- | :-- |
| `tokens.css` | `:root` 에 `--hds-*` CSS 변수, `[data-theme=dark]` 오버라이드 |
| `tailwind.preset.js` | Tailwind theme 확장(색·간격·radius·폰트가 CSS 변수 참조) |
| `tokens.ts` | 토큰 이름 자동완성/타입 안정성용 상수 |

## 변환 규칙
1. `core.tokens.json` 의 원시값을 해석하고, `semantic.tokens.json` 의 alias(`{color.brand.500}`)를 실제 값으로 resolve.
2. semantic 토큰 이름을 CSS 변수로 매핑: `color.brand.default` → `--hds-brand-default`, `space.inset-md` → `--hds-space-inset-md`, `dimension.radius.md` → `--hds-radius-md`, `color.focus.ring` → `--hds-focus-ring`.
   > 컴포넌트 코드(예: Button.tsx)가 참조하는 변수명과 **정확히 일치**해야 함. 불일치 시 컴포넌트가 스타일을 잃는다.
3. `$dark` 블록은 `[data-theme=dark] { ... }` 로 출력.
4. Tailwind preset은 값 대신 `var(--hds-*)` 를 참조하게 해 런타임 테마 전환을 지원.

## 구현 방식(둘 중 택1)
- **표준 도구**: [Style Dictionary](https://styledictionary.com) 또는 Terrazzo로 DTCG → 다중 포맷 빌드(권장, 유지보수 쉬움). 설정 파일을 프로젝트에 두고 이 스킬이 실행/갱신.
- **직접 변환**: 도구 도입 전이라면 위 규칙대로 직접 생성. 로직은 결정적으로.

## 재생성 트리거
토큰 원본이 바뀌면(=version bump) 이 산출물을 재생성한다. 산출물을 손으로 고치지 말 것.
