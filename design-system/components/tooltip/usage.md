# Tooltip 사용 사례 (화면별)

## 환전 화면 — 우대율 안내 (기본형)
```tsx
<Tooltip
  open={tip}
  onClose={() => setTip(false)}
  text="첫 환전 시 환율 우대 90%가 적용돼요."
  subText="우대율은 통화별로 다를 수 있어요."
>
  <button aria-label="환율 우대 안내" aria-expanded={tip} onClick={() => setTip(!tip)}>
    <InfoIcon aria-hidden />
  </button>
</Tooltip>
```

## 상품 목록 — 용어 설명 (타이틀형)
```tsx
<Tooltip
  open={tip}
  onClose={() => setTip(false)}
  title="세이프박스"
  text="출금 계좌와 분리해 보관하는 잔액이에요."
  position="left"
>
  <button aria-label="세이프박스란?" aria-expanded={tip} onClick={() => setTip(!tip)}>
    <InfoIcon aria-hidden />
  </button>
</Tooltip>
```
> 트리거가 화면 왼쪽에 가까우면 `position="left"` (HES 규칙 — 박스가 화면 밖으로 나가지 않게).

## 안티패턴 ❌
```tsx
// 의사결정에 필수인 정보를 툴팁에만 — 본문에 노출할 것
<Tooltip text="해외 결제 수수료 3%가 부과됩니다" …>

// 긴 설명 + 링크 묶음 — BottomSheet/Modal 사용할 것
<Tooltip text={<>약관 전문…<a href="…">자세히</a></>} …>

// hover 전용 — 모바일 터치에서 접근 불가, 클릭형으로 구현할 것
<span onMouseEnter={openTip}>…</span>
```
