# Input 사용 사례 (화면별)

## 거래 메모 입력
```tsx
<Input
  label="거래 메모"
  placeholder="예: 점심값, 회식비"
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
/>
```
> 내역 목록에서 바로 눈에 띄어야 하므로 `label` 을 생략하지 않는다.

## 거래 메모 입력 실패(빈 값 제출)
```tsx
<Input
  label="거래 메모"
  invalid
  errorMessage="메모를 입력해 주세요"
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
/>
```
> `errorMessage` 가 있으면 `aria-invalid` 와 `aria-describedby` 가 자동으로 붙는다. 테두리 색만 바꾸지 않고 항상 문구를 함께 보여준다.

## 알림 시간 설정
```tsx
<Input
  label="알림 시간"
  type="time"
  size="sm"
  helperText="하나머니가 이 시간에 결제 브리핑을 알려드려요"
  value={notifyAt}
  onChange={(e) => setNotifyAt(e.target.value)}
/>
```
> 설정 화면의 촘촘한 목록에는 `sm` 사이즈로 Button `sm` 과 높이를 맞춘다.

## 헤더 검색
```tsx
<Input
  aria-label="거래 내역 검색"
  size="md"
  placeholder="거래 내역 검색"
  leadingIcon={<SearchIcon aria-hidden />}
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```
> 라벨을 화면에 노출하지 않는 검색창은 `label` 대신 `aria-label` 로 접근성을 유지한다(시각 라벨 없이도 스크린리더가 용도를 읽을 수 있어야 함).

## 안티패턴 ❌
```tsx
// placeholder 를 라벨 대용으로 사용 — 입력 시작하면 정보가 사라짐
<Input placeholder="거래 메모" />

// 오류를 색으로만 표시하고 메시지 생략
<Input invalid />

// 여러 필드가 id 없이 label 만 텍스트로 나열 — htmlFor 연결 누락
<span>알림 시간</span>
<input type="time" />
```
