# Card 사용 사례 (화면별)

## 오늘 브리핑 카드 (날씨 요약) — 홈 화면
```tsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>오늘의 하늘</CardTitle>
    <span className="text-sm text-[var(--hds-fg-muted)]">서울 · 오후 2시 기준</span>
  </CardHeader>
  <CardBody>
    <p>맑음, 22°C. 저녁부터 구름이 많아져요. 우산은 필요 없어요.</p>
  </CardBody>
</Card>
```
> 홈 화면에서 가장 먼저 눈에 띄어야 하는 카드이므로 `elevated`. 화면당 elevated 카드는 1개 권장.

## 일정 카드 — 오늘 목록
```tsx
<Card padding="sm">
  <CardHeader>
    <CardTitle as="h4">팀 회의</CardTitle>
    <span className="text-sm text-[var(--hds-fg-muted)]">14:00–15:00</span>
  </CardHeader>
  <CardBody>
    <p className="text-[var(--hds-fg-muted)]">우산 챙기기 — 오후에 비 예보</p>
  </CardBody>
</Card>
```
> 목록에서 반복되는 항목이므로 `default` + 좁은 `padding="sm"`. `CardTitle as="h4"` 로 리스트 내 헤딩 레벨을 맞춘다(페이지 제목이 h1, 섹션이 h2/h3라면 항목은 h4).

## 설정 섹션 카드
```tsx
<Card>
  <CardHeader>
    <CardTitle>알림</CardTitle>
  </CardHeader>
  <CardBody>
    <p className="text-[var(--hds-fg-muted)]">날씨 급변 시 알림을 받아요.</p>
  </CardBody>
  <CardFooter>
    <Button variant="ghost">나중에</Button>
    <Button variant="primary">설정하기</Button>
  </CardFooter>
</Card>
```
> `CardFooter` 는 우측 정렬 액션 영역. primary 는 1개만 배치(Button 규칙 준수).

## 안티패턴 ❌
```tsx
// Card 밖에서 배경·테두리 재정의 — 토큰 우회
<Card className="bg-white border-gray-300">...</Card>

// div onClick 만으로 클릭 가능한 카드 구현 — 키보드 접근 불가
<Card onClick={() => router.push("/schedule/1")}>...</Card>

// elevated 남용 — 목록 전체를 강조하면 강조가 사라짐
<Card variant="elevated">일정 1</Card>
<Card variant="elevated">일정 2</Card>
<Card variant="elevated">일정 3</Card>
```
> 클릭 가능한 카드가 필요하면 `<a>` 로 감싸거나 내부에 네이티브 버튼을 두어 포커스·키보드 동작을 보장할 것.
