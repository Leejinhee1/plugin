# Checkbox 사용 사례 (화면별)

## 약관 동의 — 전체선택 + 하위 항목 (HES Agree 패턴)
```tsx
<Checkbox variant="all" checked={allChecked} onChange={toggleAll}>
  전체 동의
</Checkbox>
<Checkbox variant="basic" checked={terms} onChange={...}>
  [필수] 서비스 이용약관
</Checkbox>
<Checkbox variant="sub" checked={marketing} onChange={...}>
  [선택] 마케팅 정보 수신
</Checkbox>
```
> `all` 은 전체선택 시에만(HES 규칙). depth 가 내려갈수록 `basic` → `sub` 로 시각 무게를 줄인다. 일부만 선택된 상태는 ref 로 `indeterminate` 를 설정한다.

## 필터 칩 — 라운드 타입
```tsx
<Checkbox variant="round" checked={onlySaving} onChange={...}>
  적립만 보기
</Checkbox>
```

## 폼 안의 강조 선택 — 버튼 타입
```tsx
<Checkbox variant="button" checked={agree} onChange={...}>
  환율 우대 쿠폰 적용
</Checkbox>
```

## 라벨 없는 싱글 타입 (목록 행 선택)
```tsx
<Checkbox variant="basic" aria-label="2월 15일 스타벅스 결제 선택" checked={...} />
```
> 라벨이 없으면 `aria-label` 필수.

## 안티패턴 ❌
```tsx
// 전체선택이 아닌데 all(채움 원형) 사용 — HES 규칙 위반
<Checkbox variant="all">마케팅 수신 동의</Checkbox>

// 단일 선택 옵션에 Checkbox — Radio 사용할 것
<Checkbox>남성</Checkbox> <Checkbox>여성</Checkbox>

// 즐겨찾기 토글을 Checkbox 로 — 별도 아이콘 버튼(btn_star 상당) 사용할 것
<Checkbox variant="sub" aria-label="즐겨찾기" />
```
