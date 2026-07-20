# Radio 사용 사례 (화면별)

## 폼 — 기본 라디오 (dot)
```tsx
<RadioGroup name="job" label="직업" value={job} onChange={setJob}>
  <Radio value="employee">직장인</Radio>
  <Radio value="self">자영업</Radio>
  <Radio value="etc">기타</Radio>
</RadioGroup>
```

## 충전 금액 선택 — 버튼형 1행 (rdoList)
```tsx
<RadioGroup name="amount" variant="list" value={amount} onChange={setAmount}>
  <Radio value="10000">1만</Radio>
  <Radio value="30000">3만</Radio>
  <Radio value="50000">5만</Radio>
  <Radio value="100000">10만</Radio>
</RadioGroup>
```
> 선택지가 4개 이하이고 라벨이 짧을 때만 1행 균등 분할. 길면 `columns` 로 그리드.

## 은행 선택 — 버튼형 그리드 (rdoListCol)
```tsx
<RadioGroup name="bank" variant="list" columns={3} value={bank} onChange={setBank}>
  <Radio value="hana">하나</Radio>
  <Radio value="kb">국민</Radio>
  {/* … 9개 항목 */}
</RadioGroup>
```

## 선택 확인이 중요한 목록 — 체크 아이콘 버튼형 (rdoListChk)
```tsx
<RadioGroup name="coupon" variant="listCheck" columns={3} value={c} onChange={setC}>
  <Radio value="fx90">환율 90% 우대</Radio>
  <Radio value="fee0">수수료 면제</Radio>
  <Radio value="none">적용 안 함</Radio>
</RadioGroup>
```

## 안티패턴 ❌
```tsx
// 복수 선택인데 Radio — Checkbox 사용할 것
<RadioGroup name="agree">…약관 항목들…</RadioGroup>

// RadioGroup 없이 단독 Radio — 그룹핑·방향키 순회가 깨짐
<Radio value="a">항목</Radio>

// 버튼형을 Button 컴포넌트로 흉내 — 선택 상태·접근성 무너짐
<Button variant="secondary" onClick={...}>1만</Button>
```
