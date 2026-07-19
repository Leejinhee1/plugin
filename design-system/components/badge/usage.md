# Badge 사용 사례 (화면별)

## 오늘 화면 — 날씨 상태 뱃지
```tsx
<Badge variant="brand">맑음</Badge>
<Badge variant="warning">미세먼지 나쁨</Badge>
<Badge variant="danger">호우 예보</Badge>
```
> 날씨 아이콘과 함께 텍스트를 반드시 병기한다(아이콘·색만으로 상태를 전달하지 않음). `맑음` 처럼 중립적으로 반가운 정보는 `brand`, 대기질 주의는 `warning`, 위험 예보는 `danger` 로 의미를 고정한다.

## 일정 목록 — D-day
```tsx
<Badge variant="neutral" size="sm">D-3</Badge>
<Badge variant="danger" size="sm">D-day</Badge>
```
> 임박한 일정만 `danger` 로 강조하고, 나머지는 `neutral` 로 눌러 위계를 지킨다.

## 알림 아이콘 — 읽지 않은 개수
```tsx
<button aria-label="알림 5개">
  <BellIcon aria-hidden />
  <Badge variant="danger" size="sm" aria-hidden>
    5
  </Badge>
</button>
```
> Badge 자체는 클릭 대상이 아니므로 인터랙션은 감싸는 `button` 이 담당한다. 개수 정보를 스크린리더가 중복으로 읽지 않도록 Badge 는 `aria-hidden`, 실제 안내는 버튼의 `aria-label` 로 제공한다.

## 진행 상태 태그
```tsx
<Badge variant="success">완료</Badge>
<Badge variant="neutral">예정</Badge>
```

## 안티패턴 ❌
```tsx
// Badge 를 버튼처럼 사용 — Button 사용할 것
<Badge variant="brand" onClick={() => setFilter("brand")}>맑음</Badge>

// 의미 고정을 어기고 danger 를 장식으로 사용
<Badge variant="danger">신규</Badge>

// 색만으로 정보 전달 — 텍스트 없이 색 점만 표시
<Badge variant="warning" aria-hidden />
```
