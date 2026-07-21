---
name: registry-export
description: HES 컴포넌트를 shadcn CLI 호환 레지스트리(JSON)로 내보냅니다. 정적 호스팅하면 어느 프로젝트든 npx shadcn add @hes/<컴포넌트> 로 즉시 설치. Use when exporting HES components as a shadcn-compatible registry, or when a project wants to consume HES components via the shadcn CLI.
---

# 레지스트리 내보내기 (컴포넌트 → shadcn 호환 레지스트리)

HES 컴포넌트(`${CLAUDE_PLUGIN_ROOT}/design-system/components/`)를 [shadcn 레지스트리 스키마](https://ui.shadcn.com/docs/registry)로 변환합니다.
**원본을 고치지 않습니다.** 산출물은 항상 파생물(재생성 가능)이며, 소스 오브 트루스는 컴포넌트 폴더 + `registry.json` 입니다.

## 산출물
| 파일 | 용도 |
| :-- | :-- |
| `registry.json` | 레지스트리 인덱스(아이템 메타데이터, content 없음) |
| `r/tokens.json` | HES 토큰 CSS — 모든 컴포넌트의 `registryDependencies` 대상 |
| `r/<name>.json` | 컴포넌트별 registry-item(소스 content 포함, spec 의 figma 노드가 `meta.figma` 로 실림) |

## 실행

```bash
node "${CLAUDE_PLUGIN_ROOT}/skills/publish/registry-export/scripts/build-registry.mjs" \
  --out <산출물 디렉터리, 기본 ./dist/registry>
```

- 내부적으로 `token-export` 의 `build-tokens.mjs` 를 실행해 최신 tokens.css 를 `r/tokens.json` 에 임베드한다 — 토큰/컴포넌트 산출물이 어긋날 일이 없음.
- `registry.json`(HES 내부 인덱스)의 `dependencies` 는 `@hes/<name>` 레지스트리 의존성으로 변환된다(예: modal → `@hes/button`).
- `status: deprecated` 컴포넌트는 제외된다.

## 소비 측 설정 (컴포넌트를 가져다 쓰는 프로젝트)

이 산출물의 1차 소비자는 **HES 자체 CLI**(`npx hes add <name> --registry <URL>`)다. 호스팅 없이 저장소 동봉 소스로 설치하는 기본 모드는 레지스트리가 필요 없으므로, 이 스킬은 **호스팅 배포용**이다.

1. 산출물을 정적 호스팅한다 — 사내 정적 서버, GitHub Pages, 또는 로컬 확인용 `npx serve dist/registry`.
2. HES CLI 로 설치:
   ```bash
   npx hes add button checkbox --registry https://<호스팅URL>   # tokens 는 의존성으로 자동 설치
   ```
3. (선택 — shadcn 쓰는 팀 호환) 대상 프로젝트 `components.json` 에 `"registries": { "@hes": "https://<호스팅URL>/r/{name}.json" }` 등록 후 `npx shadcn add @hes/button`.
4. 전역 CSS 에 `styles/hes-tokens.css` import 를 추가한다(`r/tokens.json` 의 docs 안내 참조).

> CLI 없이 쓰는 다른 두 경로(barrel import·파일 복사)는 `design-system/components/README.md` 의 "가져다 쓰는 법" 참조.

## 재생성 트리거
컴포넌트 추가/수정 또는 토큰 변경(=version bump) 시 재생성한다. 산출물을 손으로 고치지 말 것.
