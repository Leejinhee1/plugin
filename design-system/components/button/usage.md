# Button 사용 사례 (화면별)

## 폼 제출
```tsx
<Button type="submit" variant="primary">저장</Button>
<Button variant="ghost" onClick={onCancel}>취소</Button>
```
> primary 1개 + ghost 취소. 파괴적이지 않은 취소는 ghost.

## 삭제 확인 다이얼로그
```tsx
<Button variant="danger" leadingIcon={<TrashIcon />} loading={isDeleting}>
  영구 삭제
</Button>
```
> danger + loading 으로 이중 실행 방지. 아이콘 전용이면 `aria-label` 필수.

## 툴바(낮은 강조)
```tsx
<Button size="sm" variant="ghost" leadingIcon={<FilterIcon />}>필터</Button>
```

## 안티패턴 ❌
```tsx
// 링크 이동에 Button 사용 — Link 사용할 것
<Button onClick={() => router.push("/next")}>다음</Button>
// primary 2개 — 위계 붕괴
<Button variant="primary">저장</Button><Button variant="primary">발행</Button>
// 색 하드코딩 — 토큰 우회
<Button className="bg-[#2f6bff]">저장</Button>
```
