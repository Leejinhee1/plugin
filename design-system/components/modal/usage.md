# Modal 사용 사례 (화면별)

## 알림 설정 모달
```tsx
const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="알림 설정"
  size="sm"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>취소</Button>
      <Button variant="primary" onClick={saveNotificationPrefs}>저장</Button>
    </>
  }
>
  <p>결제·적립이 일어나면 알림을 받아요.</p>
  {/* 설정 폼 필드 */}
</Modal>
```
> 짧은 결정이므로 `size="sm"`. footer 는 primary 1개 + 취소(ghost) 조합(Button 규칙 준수).

## 등록 카드 삭제 확인 (danger 버튼 조합)
```tsx
<Modal
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  title="등록 카드를 삭제할까요?"
  size="sm"
  closeOnOverlayClick={false}
  footer={
    <>
      <Button variant="ghost" onClick={() => setConfirmOpen(false)}>취소</Button>
      <Button
        variant="danger"
        loading={isDeleting}
        onClick={handleDelete}
      >
        영구 삭제
      </Button>
    </>
  }
>
  <p>“하나카드 (1234)” 등록 정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없어요.</p>
</Modal>
```
> 파괴적 액션이므로 `closeOnOverlayClick={false}` 로 실수로 닫히는 것을 방지. danger 버튼은 `loading` 으로 이중 클릭을 막는다(Button 사용법과 동일한 규칙).

## 주간 적립 상세
```tsx
<Modal
  open={detailOpen}
  onClose={() => setDetailOpen(false)}
  title="이번 주 적립"
  size="lg"
  footer={<Button variant="secondary" onClick={() => setDetailOpen(false)}>닫기</Button>}
>
  <ul className="flex flex-col gap-[var(--hes-space-stack-sm)]">
    {weekEarnings.map((day) => (
      <li key={day.date}>{day.date} · {day.summary}</li>
    ))}
  </ul>
</Modal>
```
> 콘텐츠가 많은 목록형 상세이므로 `size="lg"`. 단순 확인이라 액션은 secondary 1개.

## 안티패턴 ❌
```tsx
// onClose 없이 닫을 방법이 없는 모달 — 갇힘
<Modal open={open} title="공지" onClose={() => {}}>...</Modal>

// 오버레이 색을 직접 지정 — color.bg.overlay 토큰 우회
<div className="fixed inset-0 bg-black/50">...</div>

// 파괴적 확인인데 오버레이 클릭으로 쉽게 닫힘 — 실수로 의도치 않은 취소
<Modal open={open} onClose={onClose} title="삭제할까요?">
  <Button variant="danger">삭제</Button>
</Modal>
```
> 파괴적 확인 모달은 `closeOnOverlayClick={false}` 를 명시적으로 지정할 것.
