---
name: token-export
description: HDS 디자인 토큰(DTCG)을 개발에 바로 쓸 산출물 — CSS 변수(tokens.css), Tailwind preset, TS 타입 — 로 내보냅니다. 토큰을 코드에서 소비할 형태로 변환할 때 사용. Use when generating tokens.css, tailwind preset, or TS token types from HDS tokens.
---

# 토큰 내보내기 (DTCG → 코드 산출물)

HDS 토큰 원본(`${CLAUDE_PLUGIN_ROOT}/design-system/tokens/`)을 개발이 소비하는 형태로 변환합니다.
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

## 구현 방식

이 스킬은 `${CLAUDE_PLUGIN_ROOT}/skills/publish/token-export/scripts/build-tokens.mjs` 를 실행해 산출물을 생성한다(Node.js ≥18, 외부 의존성 없음, 출력은 항상 결정적/정렬됨).

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/publish/token-export/scripts/build-tokens.mjs" \
  --tokens <토큰 디렉터리 (생략 시 플러그인의 design-system/tokens)> \
  --out <산출물을 쓸 디렉터리, 보통 대상 프로젝트의 tokens 폴더>
```

- `--tokens` 를 생략하면 플러그인 루트의 `design-system/tokens` 로 자동 탐색하고, 없으면 안내 메시지와 함께 종료한다.
- `--out` 을 생략하면 현재 작업 디렉터리의 `./dist/tokens` 에 쓴다. `component-build` 스킬처럼 사용자 프로젝트에 설치할 때는 반드시 프로젝트 내 실제 경로를 지정할 것.
- `-h`/`--help` 로 사용법 확인 가능.
- alias(`{color.brand.500}`) 재귀 resolve, 순환 참조 감지, `$dark` 블록의 축약형(`"bg": {"base": "{color.neutral.900}"}`)과 raw 값(alias 아닌 직접 값, 예: `rgba(...)`)을 모두 처리한다.
- 원본 `tokens/*.json` 은 읽기만 하며 스크립트가 원본을 수정하는 일은 없다.
- (대안) 도구를 도입하고 싶다면 [Style Dictionary](https://styledictionary.com)/Terrazzo로 교체할 수 있으나, 변환 규칙(위 섹션)은 그대로 유지해야 한다.

## 재생성 트리거
토큰 원본이 바뀌면(=version bump) 이 산출물을 재생성한다. 산출물을 손으로 고치지 말 것.
