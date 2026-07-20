# Toast 사용 사례 (화면별)

## 계좌번호 복사 — 기본 토스트
```tsx
<Toast open={copied} message="계좌번호가 복사되었습니다." onClose={() => setCopied(false)} />
```

## 하단고정버튼이 있는 화면 — 간격 회피
```tsx
<Toast
  open={saved}
  message="자주 쓰는 계좌로 등록했어요."
  hasFixedBtn
  onClose={...}
/>
<FixedBottomButton>다음</FixedBottomButton>
```
> 하단고정버튼 위 84px 로 자동 배치(HES `toast/spacing/withFixedBtn`). 버튼을 가리게 띄우지 않는다.

## 네트워크 오류 안내 — 스낵바 (닫기 액션)
```tsx
<Toast
  variant="snackbar"
  open={offline}
  message="네트워크 연결이 원활하지 않습니다. 연결 상태를 확인해 주세요."
  onClose={() => setOffline(false)}
/>
```
> 사용자가 읽고 닫아야 하는 메시지는 자동으로 사라지는 toast 대신 snackbar. 스낵바는 왼쪽 정렬이 기본(HES 규칙).

## 안티패턴 ❌
```tsx
// 토스트에 유일한 실행 취소 수단 — 사라지면 복구 불가
<Toast message={<>삭제됨 <button>실행 취소</button></>} duration={2000} />

// 오류 상세를 토스트로 — Modal 또는 인라인 오류 사용할 것
<Toast message="E-4012: 인증 서버 응답 없음. 관리자에게 문의하세요." />

// 여러 개 동시 쌓기 — 마지막 메시지로 교체할 것
{queue.map((m) => <Toast key={m.id} … />)}
```
