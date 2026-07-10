# 컴포넌트 카탈로그

`registry.json` 이 인덱스입니다. 각 컴포넌트는 폴더 하나 + 3종 세트로 구성합니다.

```
components/
├── registry.json          # 인덱스 (name → spec/source/usage/tokens)
└── <component>/
    ├── spec.md            # API·variant·상태·토큰매핑·접근성 (프론트매터 포함)
    ├── <Component>.tsx    # 레퍼런스 구현 (토큰 CSS 변수만 참조)
    └── usage.md           # 화면별 사용 사례 + 안티패턴
```

## 새 컴포넌트 추가 절차
1. `/hds-design:component-catalog` 실행 → 스캐폴딩 생성
2. `spec.md` 에 API/상태/토큰 매핑 정의
3. 레퍼런스 코드 작성 — 값은 semantic 토큰(CSS 변수)만 사용
4. `usage.md` 에 실제 화면 조합 + 안티패턴 기록
5. `registry.json` 에 등록 (`status: draft → stable`)
6. `CHANGELOG.md` + version bump

> `status`: `draft`(실험) · `stable`(사용 권장) · `deprecated`(사용 중단, 대체재 명시)
