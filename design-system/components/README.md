# 컴포넌트 카탈로그

`registry.json` 이 인덱스입니다. 각 컴포넌트는 폴더 하나 + 3종 세트로 구성합니다.

```
components/
├── registry.json          # 인덱스 (name → spec/source/usage/tokens)
├── index.ts               # barrel — 패키지형 소비 진입점
└── <component>/
    ├── spec.md            # API·variant·상태·토큰매핑·접근성 (프론트매터 포함)
    ├── <Component>.tsx    # 구현 (자체 완결 — 토큰 CSS 변수만 참조, 외부 의존성 없음)
    └── usage.md           # 화면별 사용 사례 + 안티패턴
```

## 가져다 쓰는 법 (소비 경로 3종)

모든 경로의 공통 전제: 전역 CSS 에 토큰이 로드되어 있을 것 (`/hes:token-export` 산출물 `tokens.css`).

### A. HES CLI 로 설치 — 권장
저장소 루트의 자체 CLI(`cli/hes.mjs`, 외부 의존성 없음)로 설치한다. 호스팅 없이도 동작한다.
```bash
npm i -D github:Leejinhee1/plugin   # 또는 사내 npm 발행본
npx hes list                        # 설치 가능한 컴포넌트 확인
npx hes add button checkbox         # 토큰·의존 컴포넌트(예: modal→button) 자동 포함
```
- 코드는 `components/hes/` 로, 토큰 CSS 는 `styles/hes-tokens.css` 로 복사된다(`--dir`/`--tokens-dir` 로 변경).
- 로컬에서 수정한 파일은 덮어쓰지 않는다(`--force` 로 강제).
- `--registry <URL>` 을 주면 `/hes:registry-export` 산출물을 호스팅한 곳에서 받아온다.
- **shadcn CLI 호환(선택)**: 같은 레지스트리를 호스팅하면 shadcn 쓰는 팀은 `components.json` 에 `"registries": { "@hes": "<URL>/r/{name}.json" }` 등록 후 `npx shadcn add @hes/button` 으로도 설치할 수 있다. shadcn 은 설치 도구일 뿐, 컴포넌트 소스는 전부 HES 다.

### B. 패키지처럼 import — 모노레포/사내 npm
이 디렉터리를 패키지로 발행하거나 tsconfig alias 로 연결하면 barrel 로 바로 쓴다.
```tsx
import { Button, Checkbox, Toast } from "@hes/react"; // → design-system/components/index.ts
```

### C. 파일 복사 — 단발 사용
컴포넌트가 자체 완결(외부 유틸 의존 없음)이라 `<component>/` 폴더의 `.tsx` 한 파일만 복사해도 동작한다. spec.md·usage.md 를 함께 가져가면 규칙까지 따라간다.

## 새 컴포넌트 추가 절차
1. `/hes:component-catalog` 실행 → 스캐폴딩 생성
2. `spec.md` 에 API/상태/토큰 매핑 정의
3. 구현 코드 작성 — 값은 semantic 토큰(CSS 변수)만, 외부 의존성 없이 자체 완결로
4. `usage.md` 에 실제 화면 조합 + 안티패턴 기록
5. `registry.json` 과 `index.ts`(barrel) 에 등록 (`status: draft → stable`)
6. `/hes:registry-export` 로 레지스트리 재생성 (배포 중이라면)
7. `CHANGELOG.md` + version bump

> `status`: `draft`(실험) · `stable`(사용 권장) · `deprecated`(사용 중단, 대체재 명시)

## Figma 원본 매핑 — HES 🧱 Template 페이지

원본: `[공식] Hana Experience System` branch `0F4A8OTZzApAJIjFjeQULz`, 페이지 노드 `691:3060`. 각 spec.md 프런트매터의 `figma` 필드가 해당 프레임을 가리킨다.

### 구현됨
| Figma 프레임 | 노드 | HES 모듈 | 비고 |
| :-- | :-- | :-- | :-- |
| Buttons | 691:3084 | `button` | |
| input | 691:3116 | `input` | |
| textarea | 8220:46698 | `textarea` | textareaBox·textarea·textareaL |
| select | 691:3109 | `select` | wrapSel·wrapSelBox + layerSelect 바텀시트 |
| checkbox | 691:3124 | `checkbox` | checkAll·check·checkSub·checkRound·chkBtn·chkL/M/S |
| radio | 691:3123 | `radio` | rdo·rdoM·rdoList·rdoListCol·rdoListChk |
| switch | 691:3122 | `switch` | |
| tab | 691:3082 | `tab` | tab·tab2·tabScroll·tabRound·tabToggle |
| toast | 691:3065 | `toast` | Toast + Snackbar |
| tooltip | 691:3064 | `tooltip` | tooltip·tooltipTitle |
| box | 691:3077 | `card` | HES box/boxCardType 상당 |
| layer | 7897:48910 | `modal` | 센터 팝업(Alert/Modal)만 — BottomSheet·Full 미구현 |

### 미구현 (추가 후보)
| Figma 프레임 | 노드 | 메모 |
| :-- | :-- | :-- |
| bubble | 691:3061 | 말풍선(캐럿 위치·색·3사이즈) |
| dropdown | 691:3078 | 인라인 드롭다운 — 모바일 폼은 `select` 로 대체 |
| list | 691:3079 | listTxtItem·listRefer 등 텍스트 목록 |
| table | 691:3083 | |
| text / layout / icon / graphic | 691:3126 / 691:3154 / 691:3125 / 11495:41528 | 컴포넌트가 아닌 파운데이션 — tokens·guidelines 영역 |
| 패턴 프레임들 | swiper·listTrans·list/notice·wrapBox·listNum·listInfo·infoExchange·footer·FAQ·sectionForm·Agree·Message | 화면 패턴 — `usage/screens/` 후보 |
