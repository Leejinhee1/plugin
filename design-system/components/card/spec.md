---
name: Card
status: stable
since: 1.1.0
---

# Card 스펙

관련 콘텐츠를 하나의 시각 단위로 묶는 컨테이너. 브리핑 요약, 일정 항목, 설정 섹션 등 "하늘" 앱의 기본 콘텐츠 블록.

## 서브컴포넌트 (shadcn 방식 합성)
| 컴포넌트 | 역할 |
| :-- | :-- |
| `Card` | 최상위 컨테이너(테두리·반경·배경) |
| `CardHeader` | 제목·부가 액션 영역(상단) |
| `CardTitle` | 제목 텍스트(시맨틱 헤딩) |
| `CardBody` | 본문 콘텐츠 |
| `CardFooter` | 액션 버튼 등 하단 영역 |

각 서브컴포넌트는 독립적으로 사용 가능하지만, `Card` 없이 단독 사용하지 않는다.

## Variants
| variant | 용도 | 시각 차이 |
| :-- | :-- | :-- |
| `default` | 일반 콘텐츠 카드 | 얇은 테두리, 그림자 없음 |
| `elevated` | 목록에서 시선을 끌어야 하는 카드(오늘 브리핑 등) | 테두리 유지 + 은은한 그림자로 강조 |

## Props (API)

### Card
| prop | 타입 | 기본 | 설명 |
| :-- | :-- | :-- | :-- |
| `variant` | `default \| elevated` | `default` | 시각적 강조 |
| `padding` | `sm \| md \| lg` | `md` | 안쪽 여백 밀도(레이아웃 상황에 맞게 조정) |

### CardHeader / CardBody / CardFooter
`React.HTMLAttributes<HTMLDivElement>` 를 그대로 확장. 추가 prop 없음 — 레이아웃은 children 구성으로 해결.

### CardTitle
`React.HTMLAttributes<HTMLHeadingElement>` 확장 + `as` (`h2 | h3 | h4`, 기본 `h3`) — 문서 구조에 맞는 헤딩 레벨 선택.

## States
default · hover(선택적, 클릭 가능한 카드에서만) · focus-visible(클릭 가능한 카드일 때만)

카드 자체는 인터랙티브 요소가 아니다. 클릭 가능하게 만들려면 내부에 네이티브 `<button>`/`<a>` 를 두거나, 카드 전체가 링크라면 `CardHeader` 밖에 `<a>` 로 감싼다 — `div` 에 `onClick` 만 붙이는 방식 금지(키보드 접근 불가).

## 토큰 매핑 (하드코딩 금지)
- 배경: `color.bg.base`
- 테두리: `color.border.base` (`default`), `elevated` 도 동일 테두리 유지(그림자로만 강조 차등화)
- 반경: `dimension.radius.lg`
- 안쪽 여백: `space.inset-sm`(`sm`) · `space.inset-md`(`md`, 기본) · `space.inset-lg`(`lg`)
- 헤더/바디/푸터 간격: `space.stack-sm` · `space.stack-md`
- 제목 타이포: `typography.heading`(`CardTitle`), 본문 텍스트는 `typography.body`
- 부가 텍스트: `color.fg.muted`
- `elevated` 그림자: 별도 토큰 없이 `color.border.base` 를 활용한 저강도 box-shadow(핵심 색상 하드코딩 없이 `--hds-border-base` 참조)

## 접근성
- `Card` 는 기본적으로 `<div>`(정적 컨테이너). 시맨틱이 필요하면 `as="section"` 등으로 교체 가능.
- `CardTitle` 은 문서 헤딩 계층을 깨지 않도록 `as` 로 레벨을 명시적으로 지정할 것(임의로 h1 건너뛰기 금지).
- 카드 전체를 클릭 영역으로 만들 때는 반드시 네이티브 인터랙티브 요소로 감싸 키보드·스크린리더 접근을 보장한다.
- 색만으로 상태(예: 완료된 일정)를 전달하지 않는다 — 텍스트/아이콘 병행.

## 하지 말 것
- `Card` 밖에서 배경·테두리·반경을 재정의(className 으로 토큰 우회) 금지
- 클릭 가능한 카드에 `onClick` 만 붙이고 포커스/키보드 처리 생략 금지
- `elevated` 를 화면에 다수 남용해 위계를 무너뜨리지 말 것 — 강조가 필요한 1~2개 카드에만 사용
