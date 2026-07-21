---
spec: 오늘 브리핑
status: approved
owner: 하늘 프로덕트팀
version: 1.0.0
updated: 2026-07-10
related_components: [card, badge, button, input, modal]
---

# 오늘 브리핑 제품 설계서

## 0. Changelog
- 1.0.0 (2026-07-10): 승인. 화면 명세를 HES 컴포넌트·토큰으로 확정하고 프로토타입(`examples/haneul-prototype/`)과 1:1 정합.
- 0.2.0 (2026-07-08): 상태(empty/loading/error)·수용 기준 보강, 알림 설정 Modal 추가.
- 0.1.0 (2026-07-05): 초안.

## 1. 문제 정의 (Why)
- 배경/문제: 사용자는 아침마다 날씨 앱과 캘린더 앱을 따로 열어 "오늘 뭘 입고, 무엇을 챙기고, 어떤 일정이 있는지"를 스스로 조합한다. 정보가 흩어져 있어 하루를 준비하는 데 마찰이 크다.
- 이 기능이 해결하는 것: 앱을 열자마자 보이는 첫 화면에서 오늘의 날씨·시간대별 추천·일정을 한 번에 요약해, 하루 준비를 한 화면에서 끝낸다. 브랜드 가치(명료함·잔잔함·신뢰)를 화면 위계로 옮긴다.
- 성공 지표(측정 가능):
  - 앱 실행 후 오늘 브리핑 화면 3초 이내 렌더 완료(로딩 스켈레톤 → 콘텐츠) 비율 95% 이상
  - "오늘 브리핑"에서 일정 상세로 진입하는 D+7 리텐션 사용자 비율 40% 이상
  - 날씨 변화 알림(우산 등) 노출 후 24시간 내 알림 설정 유지율 80% 이상

## 2. 사용자 & 시나리오 (Who)
- 주요 사용자: 출퇴근·통학을 하며 날씨에 하루가 좌우되는 20~40대. 아침에 짧게 앱을 확인하고 바로 나선다.
- 핵심 시나리오(User story):
  - "출근을 준비하는 사람으로서, 앱을 열자마자 오늘 날씨와 첫 일정을 함께 보고 싶다. 그래야 우산·겉옷을 챙길지 바로 판단할 수 있다."
  - "일정이 많은 날의 사용자로서, 오늘 일정을 시간 순으로 훑고 싶다. 그래야 다음 할 일을 놓치지 않는다."
  - "비 예보에 민감한 사용자로서, 오후 비 소식을 미리 알림으로 받고 싶다. 그래야 나가기 전에 우산을 챙긴다."

## 3. 범위 (Scope)
- In:
  - 오늘 날씨 요약(현재 상태·최고/최저·위치)
  - 시간대별 추천(아침/낮/저녁 3구간, 날씨 기반 한 줄 제안)
  - 오늘 일정 리스트(시간 순, 완료 표시)
  - 알림 설정 Modal(아침 브리핑·날씨 변화·일정 리마인더 on/off)
  - empty / loading / error 상태
- Out(이번 범위 아님):
  - 주간 플랜 화면 전체 명세(별도 설계서. 프로토타입에는 탐색용으로만 포함)
  - 일정 생성/수정의 상세 폼(주간 플랜에서 다룸)
  - 위치 검색·다중 지역, 시간별 상세 예보 그래프
  - 계정·로그인

## 4. 사용자 플로우 (Flow)
1. 앱 실행 → 오늘 브리핑 화면 진입, 데이터 요청 시작.
2. 로딩 중: 날씨 카드·일정 리스트 자리에 스켈레톤 표시(loading 상태).
3. 성공: 날씨 요약 → 시간대별 추천 → 오늘 일정 리스트 순으로 렌더.
   - 3a. (분기) 오늘 일정이 하나도 없으면 리스트 영역을 empty 상태로 대체("첫 일정을 추가해 볼까요?").
   - 3b. (예외) 날씨/일정 요청 실패 시 해당 영역을 error 상태로 대체하고 "다시 시도" 액션 노출.
4. 사용자가 상단 알림 아이콘 버튼을 누름 → 알림 설정 Modal(size=sm) 열림.
   - 4a. 스위치 토글 후 "저장" → Modal 닫힘, 포커스는 알림 버튼으로 복귀.
   - 4b. ESC·오버레이 클릭·"취소" → 변경 취소하고 닫힘.
5. 하단 내비게이션으로 "주간 플랜"으로 전환(오늘 브리핑을 벗어남).

> 분기·예외 경로: empty(일정 0건), loading(요청 중), error(요청 실패)를 각각 처리한다. Modal은 ESC·오버레이·명시적 버튼 세 경로 모두에서 닫힌다.

## 5. 화면 명세 (HES 참조로 기술)
각 화면을 HES 컴포넌트·토큰 이름으로 명세한다. 프로토타입 `index.html`의 컴포넌트 클래스(`hes-*`)가 이 명세를 그대로 미러링한다.

### 화면: 오늘 브리핑 (메인)
- 목적: 앱 진입 첫 화면. 오늘의 날씨·추천·일정을 한 화면에서 요약한다.
- 구성:
  - 상단 앱 바 — 좌측 `logo.svg`(하늘 워드마크), 날짜 텍스트 "7월 10일 (금)"(`typography.label`, `color.fg.muted`). 우측에 다크 모드 토글 `Button`(variant=ghost, size=sm, `aria-label="테마 전환"`)과 알림 설정 열기 `Button`(variant=ghost, size=sm, `aria-label="알림 설정"`).
  - 날씨 요약 — `Card`(variant=elevated, padding=lg). 화면에서 시선을 끄는 유일한 elevated 카드.
    - `CardBody`: 현재 상태 "맑음, 24°"(`typography.heading`, `color.fg.base`), 그 옆 날씨 상태 `Badge`(variant=brand, size=md) 라벨 "맑음".
    - 보조 라인 "최고 24° · 최저 16° · 서울"(`typography.body`, `color.fg.muted`).
    - 간격: 요소 사이 `space.stack-sm`, 카드 안쪽 패딩 `space.inset-lg`.
  - 시간대별 추천 — 섹션 제목 "시간대별 추천"(`typography.label`). 3개의 `Card`(variant=default, padding=md)를 세로 스택.
    - 각 카드: 구간 라벨 `Badge`(size=sm) — 아침=variant=neutral, 낮=variant=warning("비 소식"일 때), 저녁=variant=neutral — 와 한 줄 제안 텍스트(`typography.body`).
    - 카드 사이 간격 `space.stack-sm`.
  - 오늘 일정 — 섹션 제목 "오늘 일정"(`typography.label`)과 총건수 `Badge`(variant=neutral, size=sm, 예 "3건"). 아래로 일정 항목 `Card`(variant=default, padding=md) 리스트.
    - 각 항목: 시간 `Badge`(variant=neutral, size=sm, 예 "오전 9:00"), 제목(`typography.body`, `color.fg.base`), 부가 설명(`color.fg.muted`). 진행 예정 항목은 상태 `Badge`(variant=brand) "예정", 완료 항목은 `Badge`(variant=success) "완료".
    - 항목 사이 간격 `space.stack-sm`, 리스트 컨테이너 상단 여백 `space.stack-md`.
  - 컨테이너: 전체 화면 배경 `color.bg.subtle`, 콘텐츠 영역 좌우 패딩 `space.inset-md`, 섹션 사이 세로 간격 `space.stack-md`.
- 상태:
  - empty: 오늘 일정이 0건이면 일정 리스트 자리에 안내 `Card`(variant=default) — "아직 등록된 일정이 없어요. 첫 일정을 추가해 볼까요?"(`color.fg.muted`)와 "일정 추가" `Button`(variant=primary, size=md). 날씨 카드·추천은 그대로 유지.
  - loading: 날씨 카드와 일정 항목 자리에 스켈레톤 블록(배경 `color.bg.muted`, 라디우스 `dimension.radius.md`). 스켈레톤 shimmer는 `color.bg.muted`↔`color.bg.subtle` 그라데이션, `duration.slow`+`cubicBezier.standard`. `prefers-reduced-motion`에서는 정적.
  - error: 날씨/일정 로드 실패 시 해당 영역을 `Card`(variant=default)로 대체 — 오류 문구 "일정을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."(`color.fg.base`)와 "다시 시도" `Button`(variant=secondary, size=sm, leadingIcon=재시도). 상태 색은 `color.feedback.danger`를 아이콘/경계에만 절제해서 사용.
- 반응형:
  - 모바일(~390px): 단일 컬럼. 앱 바 고정 상단, 내비게이션 고정 하단. 콘텐츠 세로 스크롤.
  - 데스크톱: 앱 컨테이너를 최대 너비 약 430px로 중앙 정렬하고 주변은 `color.bg.subtle`로 채워 실제 앱 화면처럼 보이게 한다. 컴포넌트 레이아웃 자체는 동일.
- 신규 컴포넌트 후보: 없음(모두 기존 registry 컴포넌트로 조립). 단, 알림 설정의 on/off 스위치는 이번 범위에서 Modal 내부 로컬 요소로 처리하며, 반복 사용이 확인되면 별도 `Switch` 컴포넌트 승격을 검토한다(§7).

### 화면: 알림 설정 (Modal)
- 목적: 아침 브리핑·날씨 변화·일정 리마인더 알림을 켜고 끈다.
- 구성:
  - `Modal`(size=sm, `closeOnOverlayClick=true`) — title "알림 설정". 오버레이 배경 `color.bg.overlay`, 패널 배경 `color.bg.base`, 라디우스 `dimension.radius.lg`, 패널 패딩 `space.inset-lg`.
  - 본문: 3개 항목(라벨 + 설명 `color.fg.muted` + on/off 스위치). 스위치 on 색 `color.brand.default`, off 색 `color.border.strong`. 항목 사이 `space.stack-md`.
  - 푸터(우측 정렬): "취소" `Button`(variant=secondary) + "저장" `Button`(variant=primary). 버튼 사이 `space.stack-sm`.
- 상태:
  - empty: 해당 없음(설정 항목은 항상 고정).
  - loading: 저장 시 "저장" `Button`을 `loading=true`(스피너, `aria-busy`, 클릭 차단)로 잠깐 표시.
  - error: 저장 실패 시 Modal 본문 상단에 `color.feedback.danger` 텍스트 한 줄로 "저장하지 못했어요. 다시 시도해 주세요." 표시(이번 프로토타입에서는 성공 경로만 시연).
- 반응형: 모바일에서 패널은 좌우 `space.inset-md` 여백을 두고 화면 폭에 맞춰 축소. 데스크톱에서는 최대 384px(size=sm).
- 신규 컴포넌트 후보: `Switch`(위 §7 참조).

### 화면: 주간 플랜 (탐색 연계 — 요약)
> 상세 명세는 별도 설계서. 여기서는 오늘 브리핑에서 이어지는 탐색 경로만 기록한다.
- 목적: 7일 일정을 한눈에 보고 새 일정을 추가한다.
- 구성:
  - 7일 리스트 — 각 날짜 `Card`(variant=default, padding=md) + D-day `Badge`(오늘=variant=brand "오늘", 임박=variant=warning, 그 외 variant=neutral, 예 "D-2").
  - 일정 추가 폼 — `Input`(size=md, label "일정 제목", placeholder "예: 오후 3시 팀 회의")과 "추가" `Button`(variant=primary). 빈 값 제출 시 `Input`의 `errorMessage`("일정 제목을 입력해 주세요.") 노출, `aria-invalid=true`, 테두리 `color.feedback.danger`.
- 상태: empty(주간 일정 0건 → 안내 카드), loading/error는 오늘 브리핑과 동일 패턴 재사용.
- 반응형: 오늘 브리핑과 동일 컨테이너 규칙.
- 신규 컴포넌트 후보: 없음.

## 6. 수용 기준 (Acceptance — 검증 가능하게)
- [ ] 앱 진입 시 오늘 브리핑이 날씨 요약 → 시간대별 추천 → 오늘 일정 순서로 렌더된다.
- [ ] 날씨 요약은 elevated `Card` 1개에만 사용되어 화면 위계의 주인공이 된다(elevated 남용 없음).
- [ ] 날씨 상태 `Badge`(variant=brand)와 시간대 추천 `Badge`가 각 의미(brand/neutral/warning)에 맞게 표시된다.
- [ ] 오늘 일정 항목마다 시간 `Badge`와 상태 `Badge`(예정/완료)가 텍스트와 함께 표시된다(색만으로 의미 전달하지 않음).
- [ ] empty 상태: 일정 0건일 때 안내 문구와 "일정 추가" `Button`(primary)이 표시된다.
- [ ] loading 상태: 스켈레톤이 표시되고 `prefers-reduced-motion: reduce`에서 애니메이션이 멈춘다.
- [ ] error 상태: 오류 문구와 "다시 시도" 액션이 표시된다.
- [ ] 알림 설정 Modal이 ESC·오버레이 클릭·"취소"/"저장" 버튼 모두에서 닫힌다.
- [ ] Modal이 열릴 때 패널 내부로 포커스가 이동하고, 닫힐 때 열기 직전 요소(알림 버튼)로 포커스가 복귀한다.
- [ ] Modal이 열려 있는 동안 Tab/Shift+Tab 포커스가 패널 내부를 벗어나지 않는다(포커스 트랩).
- [ ] 주간 플랜 일정 추가 폼에서 빈 값 제출 시 `errorMessage`가 표시되고 `aria-invalid=true`가 설정된다.
- [ ] 다크 모드 토글 시 `html[data-theme=dark]`로 전환되고 모든 색이 토큰 오버라이드로 자연스럽게 반영된다.
- [ ] 키보드만으로 전체 플로우(탐색 전환 → Modal 열기/닫기 → 일정 추가) 완료 가능.
- [ ] 모든 색·간격·라디우스·모션 값이 `var(--hes-*)` 토큰으로만 지정된다(hex/rgb 하드코딩 없음).

## 7. 미해결 질문 (Open questions)
- [ ] on/off 스위치를 registry의 정식 `Switch` 컴포넌트로 승격할지(알림 설정 외에도 반복 사용 예상). 승격 시 토큰 매핑: on=`color.brand.default`, off=`color.border.strong`, 포커스 링=`color.focus.ring`.
- [ ] 시간대별 추천 구간을 3개(아침/낮/저녁) 고정으로 둘지, 사용자 기상/취침 시간에 맞춰 가변으로 둘지.
- [ ] 날씨 데이터 실패 시 마지막 성공 값을 캐시로 보여줄지, 전면 error 상태로 둘지(정직함 원칙과 최신성 사이 균형).

## 8. 참고
- 디자인: `design-system/guidelines/{color,typography,motion}.md`, `brand/{voice-tone,visual-style}.md`
- 컴포넌트: `design-system/components/{card,badge,button,input,modal}/spec.md`
- 토큰: `design-system/tokens/{core,semantic}.tokens.json` → `examples/haneul-prototype/tokens.css`
- 프로토타입: `examples/haneul-prototype/index.html`
- 관련 설계서: 주간 플랜(예정)
</content>
</invoke>
