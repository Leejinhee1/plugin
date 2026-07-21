---
name: brand-visual
description: 브랜드 아이덴티티가 녹아든 시각 자산(이미지·모션·영상)을 기획하고 생성/검수합니다. 브랜드 규범에 맞는 비주얼을 만들거나, 모션/영상 톤을 제품과 일치시킬 때 사용. Use when creating or reviewing brand imagery, motion, or video that must match HES brand and product tokens.
---

# 브랜드 비주얼 · 모션

원본 규범: `${CLAUDE_PLUGIN_ROOT}/design-system/brand/README.md`, 모션 토큰: `design-system/guidelines/motion.md`.

## 원칙
브랜드 자산은 제품 UI와 **같은 디자인 언어**를 써야 한다. 색은 `color.brand.*`, 모션은 `duration.*`/`cubicBezier.*` 토큰을 영상 타임라인에도 그대로 적용한다.

## 워크플로
1. 브랜드 규범과 모션 토큰을 먼저 읽는다.
2. 요청(로고 적용/키비주얼/인트로 영상 등)이 규범에 맞는지 확인하고, 색·모션 값을 토큰에서 가져온다.
3. 시각 자산 생성이 필요하면:
   - 정적 비주얼·목업·다이어그램: Figma MCP(`figma-generate-design` 등) 또는 이미지 생성 도구 활용
   - 영상: 콘티(장면·듀레이션·이징)를 토큰 기준으로 설계 → 렌더 도구/Figma `export_video` 등으로 산출
4. 산출물의 색·모션이 제품 토큰과 일치하는지 검수한다.

## 유지보수
- 새 브랜드 규칙(로고 여백, 금지사례 등)은 `design-system/brand/` 에 문서로 남긴다.
- 원본 에셋과 렌더 산출물을 구분해 원본을 저장소 기준으로 관리한다.
