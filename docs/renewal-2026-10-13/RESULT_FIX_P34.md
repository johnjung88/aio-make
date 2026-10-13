# RESULT FIX P3·P4 — 검토 게이트 누수, 옛 서비스 문구, 문구 단일 출처, 죽은 CSS

2026-10-14 · 구현: Opus 서브에이전트 · HEAD `0e8be3b` 위 미커밋 P3·P4 변경 유지 · 커밋·push·배포·설치 없음

**상태: 구현 완료. typecheck PASS, lint 오류 0(기존 경고 1), 직렬 테스트 54개 중 통과 53·건너뜀 1·실패 0. `next build`, `next dev`, 브라우저 검사는 NOT_RUN(지시에 따름, 검증 담당 몫).**

## 1. 검토 게이트 누수 (가장 중요)

원인: Next는 **값이 있는** `NEXT_PUBLIC_*`만 인라인한다(`node_modules/next/dist/lib/static-env.js` `getNextPublicEnvironmentVariables`, `value != null`일 때만 define). 변수가 없으면(운영·Vercel) 클라이언트 코드에 `process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"`이 그대로 남아 상수 접힘이 일어나지 않는다. 그래서 삼항 안의 고객 문자열이 번들에 남을 수 있었다. 또 `components/home/workflow-journey.tsx`(client)가 `displayWorkCatalog`를 값으로 import해서 `lib/generated/works.generated.ts` 전체가 메인 클라이언트 그래프에 들어가 있었다.

수정 두 겹:
1. **구조 분리(메인 홈)**: 고객 데이터와 선택 로직을 서버 전용 모듈로 옮기고 결과만 props로 내린다.
   - `lib/home-journey-data.ts`(신규, `import "server-only"`): `devProjects`, `beforeShots`, `contentReviewSlugs`, `aiInfluencerDraft`(4곳 모두 `process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"` 삼항), `selectDevProjects`, `selectContentMedia`, `homeJourneyData(entries)`. 카탈로그는 서버에서 `displayWorkCatalog(mergeGuideEntries(entries, "reference"))`로 만든다(정확히 `"1"`일 때만 검토 작업 포함).
   - `lib/home-journey.ts`(client 안전): 고객 문자열·`process.env` 읽기 0, `work-catalog`는 `import type`만. `fallbackContentSelection`, `HomeJourneyData` 타입, `emptyJourneyData` 추가.
   - `app/(public)/page.tsx`: `<MainGuide entries={entries} journey={homeJourneyData(entries)} />`.
   - `components/guide/main.jsx`: `<WorkflowJourney data={this.props.journey} />`. `components/guide/primitives.tsx` `GuideProps`에 `journey?: HomeJourneyData`(type import만).
   - `components/home/workflow-journey.tsx`: `displayWorkCatalog`·`mergeGuideEntries`·`useMemo` 제거, `data`(기본 `emptyJourneyData`)를 받아 `JourneyDev projects=`·`JourneyContent selections=`로 전달. `journey-dev.tsx`·`journey-content.tsx`는 선택 함수 대신 props를 받는다.
   - 결과: 플래그가 꺼져 있으면(미설정·`0`·`true` 등) 서버가 고객 데이터를 고르지 않으므로 서버 HTML·RSC payload·클라이언트 JS 어디에도 고객 데이터가 들어가지 않는다. 클라이언트 모듈이 `home-journey-data`를 import하면 `server-only` 때문에 빌드가 실패한다.
2. **중앙 정규화(전 사이트)**: `next.config.ts`에 `env: { NEXT_PUBLIC_AIO_REFERENCE_REVIEW: process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1" ? "1" : "0" }`. 미설정이면 `"0"`을 인라인하므로 남은 모든 `=== "1"` 게이트(`works.generated.ts`, `work-catalog.ts`)가 빌드 때 접힌다. 아직 client에서 `displayWorkCatalog`를 값으로 쓰는 `components/guide/home-references.tsx`(`/lab`·`/marketing` 개요)는 이 정규화에 기대고 있다(아래 미해결). Vercel 환경변수 값은 바꾸지 않았고 코드에서 컴파일 값만 정규화했다.

확인 (`components/content-home/**`, `lib/content-home.ts`): 고객명·slug·`reference-review`·`process.env`·`work-catalog`·`generated` import 0건(grep). 수정할 것 없음.

게이트 위치 전체(grep `NEXT_PUBLIC_AIO_REFERENCE_REVIEW`, app·components·lib·next.config·build-works): 모두 `=== "1"`(`lib/metadata.ts`의 `!== "1"`은 정확히 "1"일 때 색인을 끄는 것이라 같은 기준). `next.config.ts`의 Vercel `"1"` 차단도 유지.

## 2. 옛 서비스 문구

| 파일 | 변경 |
|---|---|
| `lib/guide-content.ts:23` | `…모션그래픽, 브랜드 홍보 및 SNS 광고 영상은` → `…모션그래픽, 브랜드 홍보 영상, SNS 광고 영상은` |
| `lib/guide-content.ts:32` | `…모션그래픽·브랜드 홍보 및 SNS 광고 영상 중` → `…모션그래픽·브랜드 홍보 영상·SNS 광고 영상 중` |
| `components/guide/main.jsx:75` | 메인 Studio 그룹 `cat3: "브랜드 컨텐츠"` → `"브랜드 홍보 영상"`(brand-film 샘플과 짝) |
| `components/guide/primitives.tsx` `GuideMedia` 기본 alt | `브랜드 컨텐츠 제작 방향 예시 이미지` → `브랜드 홍보 영상 제작 방향 예시 이미지`(이미지가 brand-film-v03) |

grep 근거(app·components·lib, `content-service/` 제외):
- `브랜드 홍보 및|홍보 및 SNS|편집·클리퍼|클리퍼` → 0건.
- `about.jsx:419`, `main.jsx:400`, `lib/content.ts:41`는 이미 여섯 서비스 문구.
- 남긴 것(서비스 목록이 아닌 일반 명사): `브랜드 컨텐츠` — `lib/content.ts:78`(통합 마케팅 설명), `lib/content.ts:307`(AI 인플루언서 마케팅 대상), `lib/service-plans.ts:21`, `components/guide/marketing-services.jsx:271`. `컨텐츠 편집` — `components/admin/entries.tsx:166`(관리자 편집 버튼). 모두 마케팅·관리 문맥이라 그대로 둠.

## 3. 컨텐츠 탭 문구 단일 출처

`lib/home-journey.ts`의 `contentTabs`는 이제 `contentHomeServices`(lib/content-home.ts)에서 `id·label·line·uses(chips)`를 가져오고, 메인 전용 대체 이미지만 `contentFallbacks`에 둔다. `ContentTabId = ContentServiceId`. `requiredContentServices`도 `contentHomeServices` 라벨을 ` · `로 이어 만든다. 테스트가 탭마다 id·label·line·chips 일치를 확인한다.

## 4. 죽은 CSS

grep `main-method|method-(intro|line)` (app·components·lib의 jsx/tsx/ts): 사용처 0 → 규칙 삭제.
- `components/guide/review.css`: `.method-intro`, `.guide-main .method-intro h2`, `.method-line`, `.method-line em`, `.method-intro p`, `.method-intro p > span`, `.main-method ol`, `@media (max-width:1000px)`의 `.main-method ol`, `@media (max-width:620px)`의 `.method-intro p`·`.guide-main .method-intro h2` (48줄).
- `components/guide/creative.css`: `.method-line`, `.guide-main .method-intro h2` (8줄).
- 삭제 후 grep 결과 0건.

`components/guide/studio-p1.css`: 규칙은 `.p1-content-service-list` 하나뿐. 소스 전체에서 클래스 사용처 0, 파일 import 0(남은 언급은 `.qa/p2-verify/old-studio-services.jsx`, `.qa/p2-fix/BASELINE.json` 기록뿐) → 남는 규칙이 없어 파일 삭제(git에서 복구 가능, stage 안 함).

## 테스트 추가·수정 (`tests/home-journey.test.mjs`)
- 자식 프로세스로 `lib/home-journey-data.ts`를 `--conditions=react-server`로 읽고 플래그 `"1"`, **미설정**, `"0"`, `"true"` 네 상태를 만든다.
- `review gate: unset, 0 and true select no customer work data`: 검토 상태는 실제로 고객 데이터를 담는지 먼저 확인(`reference-review`, `before-pc`, `87언니`, `DR's Secret` 포함)한 뒤, 꺼진 세 상태에서 config가 비었는지, 개발 프로젝트 0개, 컨텐츠 선택 6개가 공개 작업 또는 대체 이미지뿐인지, JSON 전체에 검토 작업의 slug·brand(분해 포함)·title·미디어 경로와 `reference-review`·`before-*`·`87언니`·고객명이 0건인지 확인.
- `client journey modules hold no customer data and never import it`: `lib/home-journey.ts`, `lib/content-home.ts`, `components/home/*`, `components/content-home/*` 소스에 `home-journey-data`·`generated/works` import 0, `work-catalog` 값 import 0, `process.env` 0, 위 고객 단어 0. 서버 모듈의 `server-only` 선언과 게이트 4곳이 모두 정확히 `=== "1"`인지, `next.config.ts` 정규화 줄이 있는지 확인.
- 기존 테스트는 새 모듈·props 구조에 맞춤(`<WorkflowJourney data={this.props.journey} />`, 페이지의 `journey={homeJourneyData(entries)}`, 탭 문구 출처 일치).

## 실행한 검증
- `npm run typecheck` → PASS(출력 없음).
- `npm run lint` → `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110 'options'`).
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` → 
  ```
  ℹ tests 54
  ℹ pass 53
  ℹ fail 0
  ℹ skipped 1   (prepared derivatives exist when local review is requested — AIO_VERIFY_LOCAL_MEDIA 미설정 시 기존대로 건너뜀)
  ```
  시간 초과 재실행 필요 없었음.

## NOT_RUN (검증 담당 몫)
- `npm run build` 두 가지(변수 **미설정** 빌드, `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1` 로컬 검토 빌드)와 `.next/static`·`/` HTML grep: 미설정 빌드에서 `bwl-`, `healernet`, `yofree`, `DR's Secret`, `힐러넷`, `요프리`, `87언니`, `before-pc`, `reference-review` 0건이어야 한다. `/lab`·`/marketing` 청크도 포함해 확인할 것(정규화에 기대는 부분).
- 브라우저: 메인 03·04 단계가 기본 빌드에서 대체 탭·대체 이미지로, 검토 빌드에서 기존과 같게 보이는지.

## 미해결·후속
- `components/guide/home-references.tsx`(client)는 여전히 `displayWorkCatalog`를 값으로 import한다. 지금은 `next.config.ts` 정규화로 접히지만, 메인처럼 서버에서 고른 목록을 props로 받게 바꾸면 구조적으로도 막힌다(`service-overview.tsx`가 서버 컴포넌트라 쉽게 옮길 수 있음). 이번 지시 범위 밖이라 그대로 둠.
- `components/content-service/**`는 지시대로 손대지 않음.
- RESULT_P4가 적은 `components/guide/guide.css`의 `Unbounded` `@font-face` 별칭 정리는 이번 범위(4번 항목) 밖이라 그대로 둠.
