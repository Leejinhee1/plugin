# Textarea 사용 사례 (화면별)

## 문의하기 — 기본 라인형
```tsx
<Textarea
  label="문의 내용"
  placeholder="내용을 입력해 주세요"
  maxLength={30}
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
/>
```

## 이체 메모 — 박스형 (textareaBox)
```tsx
<Textarea
  variant="box"
  aria-label="받는 분에게 표시할 메모"
  placeholder="받는 분 통장 표시 메모"
  maxLength={30}
/>
```
> 라벨을 생략하면 `aria-label` 필수.

## 상세 사유 입력 — 장문형 (textareaL)
```tsx
<Textarea
  label="이의신청 사유"
  placeholder="내용을 입력해 주세요"
  rows={10}
  maxLength={1000}
  error={tooShort}
  errorMessage="10자 이상 입력해 주세요."
/>
```

## 안티패턴 ❌
```tsx
// 한 줄 입력(이름·금액)에 Textarea — Input 사용할 것
<Textarea label="예금주명" rows={1} />

// maxLength 없이 카운터 흉내 — 기준 없는 숫자 금지
<Textarea label="메모" /> <span>12자</span>

// 오류를 placeholder 로 전달 — errorMessage 사용할 것
<Textarea placeholder="10자 이상 입력해주세요!" />
```
