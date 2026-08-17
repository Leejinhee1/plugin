# 어댑터: Nunjucks + SCSS (하나머니 hmui 스택)

`figma-bridge/SKILL.md` 방법론의 스택별 세부를 채운다. 대상: 하나머니 HES 프로젝트(순수 HTML/CSS/JS, 전처리 Nunjucks+SCSS, hmui 공통 디자인시스템). 방법론은 동일하고 스택 세부만 다르다.

> 축을 먼저 결정: **플랫폼** `mob`(본앱·SSOT) / `inapp`(인앱), **네임스페이스** `gw`(공통 hmui, `$hes-*` 직접) / `nrc`(업무 도메인, snake_case 별칭).

## 1. 재사용 사다리 각 칸
```
① Code Connect → ② hmui 매크로 → ③ 공용 클래스 → ④ 믹스인 → ⑤ 토큰($hes-*) → ⑥ 국소 선언
```
- ② 매크로는 카탈로그 요약을 믿지 말고 **정의 파일의 params**를 확인해 호출(클래스 문자열 손조립 금지).
- ④ 믹스인은 기존 것만: `typo`/`flexbox`/`bgimage`/`line-clamp`/`sectionSpacing`(새 믹스인 발명 금지).
- 기준선(사람 작성 실측): 공용 6종·믹스인 18회·토큰 33회 — 밑돌면 사다리를 건너뛴 것.

## 2. 토큰 참조 표기
- `gw`: `$hes-*` SCSS 변수 직접(예: `$hes-color-text-01`).
- `nrc`: 상단 `@import "../redefine";` 후 snake_case 별칭(`$space_xs`·`$imgroot`).
- 변수 매핑 판정은 대상 프로젝트의 `figma-token-map` 류 도구(`<vars.json> --ns <gw|nrc>`).

## 3. 컴포넌트 소스 위치·조회법
- 색인: 프로젝트의 `hes-지도`(자동 생성 색인)를 **grep**(도메인→파일, 공용클래스→정의파일, 매크로→params). ⛔ 레포 find/ls 전수 탐색 금지.
- 매크로 카탈로그: 프로젝트의 `hmui-컴포넌트-카탈로그`.

## 4. 산출물 형식·배치·스코프·등록
- 산출: `.njk` + `.scss`(HES 프로젝트 `src/**`). 빌드 산출물(`WebContent*/`·`hesGuide/`) 직접 수정 금지.
- 스코프: `[data-pageid="<CODE>"]`. 새 SCSS 파티얼은 해당 `_index.scss` 에 **등록해야 컴파일됨**.
- 신규 작명: 언더스코어 BEM, 2세그먼트 flat.

## 5. 에셋
- 저장: `WebContent/resources/<ns>/images/<CODE>/`, 파일명은 폴더 관례.
- 최적화: 투명복원 도구(`--quantize 256`, 알파 0% 배경은 flood 모드).

## 6. 스택 특유 금지
- ⛔ flex `gap` 금지 → 인접 형제 margin(`> * + *`) (최소지원 안드로이드 6.0·iOS 15.6).
- 신규 JS는 pure JavaScript(jQuery 금지). 말줄임은 `@include line-clamp`.

## 7. 검증 렌더 방법
- 프로젝트의 검증 원샷(예: `publish-verify.sh --page <njk> --figma <figma.png>`)으로 빌드→캡처→대조.
- 공용 SCSS를 건드렸으면 영향범위 산출 → 시각 회귀 스윕(`--git-baseline main`).
