# Select 사용 사례 (화면별)

## 폼 — 기본 라인형 (wrapSel)
```tsx
<Select
  label="출금 계좌"
  placeholder="계좌를 선택해주세요"
  options={accounts}
  value={account}
  onChange={setAccount}
/>
```

## 오류 상태 — 가이드 텍스트
```tsx
<Select
  label="통화"
  options={currencies}
  value={currency}
  onChange={setCurrency}
  error={!currency && submitted}
  errorMessage="통화를 선택해주세요."
/>
```

## 충전 화면 — 박스형 (wrapSelBox)
```tsx
<Select
  variant="box"
  label="충전 금액"
  options={amounts}
  value={amount}
  onChange={setAmount}
  helperText="1회 최대 USD 5,000 까지 충전할 수 있어요."
/>
```

## 거래내역 조회 — 기간 입력 (boxDate 패턴)
```tsx
<div className="flex items-center gap-2">
  <Select hideLabel label="조회 시작일" options={dates} value={from} onChange={setFrom} />
  <span aria-hidden>~</span>
  <Select hideLabel label="조회 종료일" options={dates} value={to} onChange={setTo} />
</div>
```
> 기간 입력은 Select 2개 조합(HES `boxDate`). `hideLabel` 이어도 `label` 은 스크린리더용으로 반드시 채운다.

## 안티패턴 ❌
```tsx
// 옵션 3개뿐인데 바텀시트 — Radio(list) 사용할 것
<Select label="성별" options={[남, 여, 선택안함]} />

// 네이티브 select 로 대체 — HES 기준은 바텀시트
<select>…</select>

// 자유 입력 필드를 Select 로 — Input 사용할 것
<Select label="이메일" options={emailDomains} />
```
