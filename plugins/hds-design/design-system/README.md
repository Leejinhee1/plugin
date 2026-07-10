# HDS Design System — 단일 소스 오브 트루스 (Source of Truth)

이 디렉터리가 **디자인 시스템의 원본**입니다. 기획·디자인·퍼블·코덱스·클로드 모두 여기를 참조합니다.
다른 어떤 산출물(퍼블의 `tokens.css`, Figma Variables, 프로토타입)도 이 폴더에서 **파생**될 뿐, 여기를 대체하지 않습니다.

```
design-system/
├── tokens/         색·타이포·간격·모션 (W3C DTCG)   → 모든 값의 뿌리
├── guidelines/     원칙·색·타이포·모션 규범 (사람+AI가 읽음)
├── components/     컴포넌트 스펙 + 레퍼런스 코드 + 사용사례
│   └── registry.json   무엇이 있는지 조회하는 인덱스
├── usage/          화면별 조합 사례
└── brand/          브랜드 아이덴티티(비주얼·모션·영상) 규범
```

## 편집 원칙 (유지보수 핵심)
1. **값은 tokens/ 에서만** 바꾼다. 컴포넌트 코드에 색·간격을 하드코딩하지 않는다.
2. **컴포넌트 추가 시 3종 세트**: `spec.md` + 소스코드 + `usage.md` 를 만들고 `registry.json` 에 등록한다.
3. **변경은 버전과 함께**: `CHANGELOG.md` 기록 + 관련 `plugin.json`/`marketplace.json` version bump.
4. **문서는 AI-리더블하게**: 표·프론트매터·명시적 규칙으로 작성해 AI가 읽고 올바른 산출물을 만들 수 있게 한다.
