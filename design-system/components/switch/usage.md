# Switch 사용 사례 (화면별)

## 설정 화면 — 알림 토글
```tsx
<div className="flex items-center justify-between">
  <span id="push-label">결제 알림</span>
  <Switch aria-labelledby="push-label" checked={push} onChange={togglePush} />
</div>
```
> 토글 즉시 설정이 반영되는 항목에만 사용한다. 행 전체 레이아웃은 List/Card 패턴이 담당하고 Switch 는 컨트롤만 맡는다.

## 홈 — 잔액 숨기기
```tsx
<Switch aria-label="잔액 숨기기" checked={hidden} onChange={toggleHidden} />
```

## 안티패턴 ❌
```tsx
// 저장 버튼으로 제출하는 폼 항목 — Checkbox 사용할 것
<form>… <Switch aria-label="마케팅 수신 동의" /> … <Button>저장</Button></form>

// 두 화면 사이 전환 — Tab(toggle) 사용할 것
<Switch aria-label="원화/외화 보기" />

// 레이블 생략 — 스크린리더가 용도를 알 수 없음
<Switch checked={on} onChange={...} />
```
