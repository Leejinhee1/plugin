# Tab 사용 사례 (화면별)

## 거래내역 — 페이지 상단 고정 탭 (underline)
```tsx
<Tab
  aria-label="거래내역 구분"
  items={[
    { value: "all", label: "전체" },
    { value: "in", label: "입금" },
    { value: "out", label: "출금" },
  ]}
  value={tab}
  onChange={setTab}
/>
<div role="tabpanel">…선택된 목록…</div>
```
> 4개 이하는 균등 분할, 5개 이상이면 자동으로 가로 스크롤(HES `tabScroll`).

## 콘텐츠 중간 필터 — 라운드 탭 (tabRound)
```tsx
<Tab
  variant="round"
  isSticky
  aria-label="통화 필터"
  items={[{ value: "usd", label: "USD" }, { value: "jpy", label: "JPY" }, …]}
  value={cur}
  onChange={setCur}
/>
```
> 스크롤 시 상단에 붙는 필터는 `isSticky` — sticky 상태에선 미선택 필의 배경이 사라진다(HES 규칙).

## 신분증 선택 — 토글 탭 (tabToggle)
```tsx
<Tab
  variant="toggle"
  aria-label="신분증 종류"
  items={[
    { value: "reg", label: "외국인 등록증", subLabel: "Registration card" },
    { value: "lic", label: "운전면허증", subLabel: "Driver's license" },
  ]}
  value={doc}
  onChange={setDoc}
/>
```

## 안티패턴 ❌
```tsx
// 페이지 라우팅을 tab 시멘틱으로 — 링크 내비게이션 사용할 것
<Tab items={[{ value: "/home", label: "홈" }, …]} onChange={navigate} />

// toggle 에 3개 항목 — round 사용할 것
<Tab variant="toggle" items={[a, b, c]} />

// 탭 6개를 균등 분할로 강제 — 스크롤 타입에 맡길 것 (flex-1 커스텀 금지)
```
