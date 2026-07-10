# 모션 가이드

## 토큰
- 지속시간: `duration.fast`(120) · `base`(200) · `slow`(320)
- 이징: `cubicBezier.standard`(진입/기본), `emphasized`(강조 전환)

## 원칙
- 모션은 **의미 전달용**(상태 변화·공간 관계). 장식적 애니메이션 지양.
- 100ms 미만은 인지되지 않고, 400ms 초과는 느리게 느껴진다. 대부분 `base`.
- `prefers-reduced-motion: reduce` 를 반드시 존중해 애니메이션을 최소화한다.
- 진입은 emphasized, 종료·소멸은 standard + 짧게.

## 영상/브랜드 모션
브랜드 인트로·프로모 영상은 `/hds-design:brand-visual` 참고. 위 이징·듀레이션 토큰을 영상 타임라인에도 동일 적용해 제품과 결이 맞도록 한다.
