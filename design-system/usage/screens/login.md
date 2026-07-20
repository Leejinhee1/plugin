---
pattern: login
components: [input, button]
---

# 로그인 / 온보딩 진입

하나머니 앱의 첫 진입 화면. 이메일 한 필드로 로그인을 시작하는 가장 단순한 흐름을 기본으로 한다.

## 목적

- 사용자가 최소한의 입력(이메일)으로 앱에 진입하도록 돕는다.
- 오류·로딩 등 실패/대기 상태에서도 다음에 뭘 해야 하는지 항상 알 수 있게 한다.
- 온보딩 첫 화면은 부담을 주지 않는 환영 문구로 시작한다(voice-tone `온보딩` 톤).

## 구성 (컴포넌트 + 레이아웃)

세로 스택 레이아웃, 화면 중앙(모바일은 상단 정렬 + 여백) 배치.

```
[ 환영 문구 (heading) ]                 ← space.stack-md
[ 안내 문구 (body, fg.muted) ]          ← space.stack-md
[ Input: label="이메일" size=md ]       ← space.stack-sm (Input 내부)
[ Button: variant=primary size=lg ]     ← space.stack-md (Input과의 간격)
[ 보조 링크: "다시 시도" 등 텍스트 링크 ] ← space.stack-sm
```

- 헤딩: 타이포 `typography.heading`, 안내 문구: `typography.body` + `color.fg.muted`
- `Input`
  - `label="이메일"`, `type="email"`, `placeholder` 는 라벨 대용으로 쓰지 않는다(예: `placeholder="you@example.com"` 정도의 형식 힌트만).
  - `size="md"` 기본, 화면이 단순하므로 `lg` 로 키워도 무방(터치 타깃 확보).
  - `helperText` 로 "가입 시 사용한 이메일을 입력해 주세요." 같은 안내를 기본 상태에 노출 가능.
- `Button`
  - `variant="primary"` 1개만 배치(화면당 primary 1개 원칙). "이메일로 계속하기".
  - `size="lg"`(48px) — 로그인 화면은 터치 타깃을 크게.
  - 보조 액션(다른 방법으로 로그인 등)은 `variant="ghost"` 텍스트 버튼 또는 텍스트 링크로, primary 버튼 아래 `space.stack-sm` 간격.
- 화면 바깥 여백은 `space.inset-lg`, 폼 내부 요소 간 세로 간격은 `space.stack-md`.

### 예문 (voice-tone 준수)

- 헤딩: "안녕하세요. 지금부터 하나머니가 결제와 적립을 함께 챙겨드릴게요."
- 안내: "이메일로 간편하게 시작할 수 있어요."
- 버튼: "이메일로 계속하기"
- 보조 링크: "다른 방법으로 로그인"

## 반응형

- 모바일(기본): 폼 폭 100%, 화면 상단에서 `space.inset-lg` 만큼 내려온 위치에서 시작. `Button` `size="lg"` 유지.
- 데스크톱/태블릿(넓은 뷰포트): 폼 컨테이너 최대폭을 제한(중앙 정렬 카드형 레이아웃과 동일한 폭 감각)하고 화면 수직 중앙에 배치. `Input`/`Button` `size` 는 `md`로 낮춰도 됨.
- 키보드가 올라오는 모바일 환경에서는 헤딩·안내 문구를 스크롤 영역 밖으로 밀어내지 않도록 폼이 뷰포트 하단에 가깝게 붙지 않게 여유를 둔다.

## 상태 (empty / loading / error)

- **기본(default)**: 위 구성 그대로. Button은 `disabled` 하지 않는다 — 빈 입력이어도 클릭 시 Input의 `invalid` 상태로 피드백하는 방식을 권장(제출을 막기보다 시도 후 안내).
- **오류(error)**: 이메일 형식이 잘못되었거나 서버 검증 실패 시 `Input`에 `errorMessage`를 채운다.
  - 예: `errorMessage="이메일 형식을 확인해 주세요."` 또는 `errorMessage="등록되지 않은 이메일이에요."`
  - `errorMessage`가 채워지면 컴포넌트가 자동으로 `invalid` 상태(테두리 `color.feedback.danger`, 포커스 링도 danger 색)로 전환되므로 별도로 `invalid`를 명시할 필요는 없다.
  - 오류가 발생해도 이미 입력한 값은 유지한다(재입력 강요 금지).
- **로딩(loading)**: 제출 후 인증 확인 중에는 `Button`에 `loading={true}`를 전달한다. 스피너가 노출되고 `aria-busy="true"`가 자동 부여되며 클릭이 차단된다. 이 상태에서 `Input`은 `disabled`로 함께 잠가 중복 제출을 막는다.
- **빈 상태**: 이 화면 자체는 목록형이 아니므로 별도 empty 상태는 없다. 최초 진입 시 안내 문구가 곧 empty 상태의 대체 역할을 한다.

## 접근성

- 포커스 순서: 진입 시 이메일 `Input`에 자동 포커스 → `Button`(primary) → 보조 링크. 시각적 순서와 DOM 순서를 일치시킨다.
- `Input`의 `label`은 `htmlFor`/`id`로 연결되어 스크린리더가 필드 목적을 읽을 수 있어야 한다.
- 오류 발생 시 `errorMessage`는 `aria-describedby`로 input과 연결되고 `aria-invalid="true"`가 함께 붙는다(Input 스펙 기본 동작) — 색만으로 오류를 전달하지 않는다.
- 오류 메시지가 새로 나타날 때 스크린리더가 즉시 인지하도록, 오류 메시지 영역(또는 그 상위 폼 컨테이너)에 `aria-live="polite"`를 부여해 동적으로 삽입되는 텍스트를 알린다.
- `Button`의 `loading` 상태에서는 `aria-busy="true"`가 자동 적용되므로 별도 안내 텍스트(예: "로그인하는 중이에요")를 시각적으로 숨겨진 텍스트로 추가하지 않아도 무방하나, 로딩이 3초 이상 이어질 수 있다면 버튼 라벨을 "확인하는 중"으로 바꿔 상태를 텍스트로도 알린다.
- 모든 인터랙션은 마우스 없이 Tab/Enter만으로 완료 가능해야 한다(네이티브 `<input>`/`<button>` 사용 원칙 준수).
