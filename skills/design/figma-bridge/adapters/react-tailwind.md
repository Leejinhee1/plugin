# 어댑터: React + Tailwind (플러그인 기본 스택)

`figma-bridge/SKILL.md` 방법론의 스택별 세부를 채운다. 대상: HES 코드 디자인시스템(`${CLAUDE_PLUGIN_ROOT}/design-system/`, React+Tailwind+CSS 변수).

## 1. 재사용 사다리 각 칸
```
① Code Connect → ② HES 컴포넌트(registry.json) → ③ variant/compound props
             → ④ cn() · tailwind-merge 유틸 → ⑤ 토큰 CSS 변수(--hes-*) → ⑥ 국소 className
```
- ② `design-system/components/registry.json` 에서 조회, 소스는 `components/<name>/<Component>.tsx`. 의존 컴포넌트도 함께.
- ③ 새 조합이 필요하면 기존 컴포넌트의 variant/합성으로 먼저 시도(`component-catalog` 원칙 1).

## 2. 토큰 참조 표기
- **`--hes-*` CSS 변수만** 참조(`token-export` 산출 `tokens.css`). ⛔ 색·px 하드코딩 금지.
- 예: `color.brand.default` → `var(--hes-brand-default)`, `space.inset-md` → `var(--hes-space-inset-md)`.
- 컴포넌트 CSS가 참조하는 변수명과 **정확히 일치**해야 함(불일치 시 스타일 소실).

## 3. 컴포넌트 소스 위치·조회법
- 인덱스: `registry.json`(name/status/spec/source/usage/tokens/dependencies).
- 스펙: `components/<name>/spec.md`(props·variant·state·토큰 매핑·접근성), 사례: `usage.md`.

## 4. 산출물 형식·배치·스코프·등록
- 산출: `.tsx`(+ 필요 시 화면 조합). 배치는 대상 프로젝트 규칙(예: `src/components/ui/<name>.tsx`).
- `cn()` 유틸을 프로젝트 것으로 연결(clsx + tailwind-merge). import 경로·파일명은 프로젝트 컨벤션.
- 별도 등록 파일 없음(React import 그래프). 화면은 `usage/screens/` 패턴을 따른다.

## 5. 에셋
- 아이콘/이미지는 프로젝트 정적 경로(예: `public/assets/…`) 또는 컴포넌트 import. SVG 우선.
- 최적화 도구는 프로젝트 파이프라인(별도 투명복원 도구 불필요 — 벡터 중심).

## 6. 스택 특유 금지
- 색·간격·radius 하드코딩 금지(토큰 CSS 변수만). `spec.md`의 접근성(키보드·포커스·aria) 유지.
- 프레임워크가 React가 아니면 `spec.md` 기준으로 해당 프레임워크 구현을 생성(사용자 확인).

## 7. 검증 렌더 방법
- Vite+React 또는 Storybook 으로 컴포넌트/화면을 렌더 → 스크린샷 캡처 → 행위 C가 Figma baseline과 픽셀 대조.
- 접근성은 `/hes:a11y-audit`(대비·키보드·aria)로 병행.
