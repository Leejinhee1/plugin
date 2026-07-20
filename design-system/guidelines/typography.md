# 타이포그래피 가이드

## 서체
`fontFamily.sans` = **Spoqa Han Sans Neo**(HES font/family/spoqa) 우선, 미로드 환경 폴백 Pretendard → system-ui. 임의 폰트 도입 금지.

## 스케일
`dimensionFont.size` xs(12) · sm(14) · md(16) · lg(20) · xl(24) · 2xl(32) · 3xl(40) — HES font/size 스케일(12~40)의 부분집합입니다.
본문 기본은 `typography.body`(16/regular/1.32), 라벨은 `typography.label`(14/bold/1.32), 제목은 `typography.heading`(32/bold/1.28).
보조 설명·helper text 에는 `typography.caption`(12/regular/1.32)을 사용합니다.

## HES 고유 규칙
- **자간 -5%**: 모든 타이포 토큰에 `letterSpacing: -0.05em`(HES letterSpacing/default) 적용. Spoqa Han Sans Neo 전제의 값이므로 자간을 임의로 풀지 않는다(숫자 강조 등 예외는 HES letterSpacing/increased=0).
- **줄높이**: 본문 132%(HES lineHeight/body), 헤드라인 128%(HES lineHeight/headline). 1.5 같은 임의 줄높이를 쓰지 않는다.
- **굵기 3단계**: light(300) / regular(400) / bold(700) — HES font/weight 정의를 따른다. medium(500)·semibold(600)는 사용하지 않는다.

## 규칙
- 한 화면에서 위계는 3단계 이내(제목/본문/보조)로 제한.
- 줄 길이는 본문 기준 45–75자 권장.
- 굵기로 위계를 만들되, 위 3단계(light/regular/bold)만 사용.
