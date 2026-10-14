# RESULT R5 · WP-M 메인 워크플로우

2026-10-14 · 구현 담당(opus 서브에이전트) 자체 검증 · 커밋 안 함 · 빌드/서버 실행 안 함

## 결과 요약
- 메인(`/`)의 홈 컴포넌트를 3214 기준(`9b3def8`)으로 되돌렸다. 그 위에 워크플로우 3단계(개발 → 마케팅 → 컨텐츠)만 다시 적용했다.
- `components/guide/main.jsx`는 수정하지 않았다(`git diff --quiet 9b3def8 -- components/guide/main.jsx` 통과).
- 문구는 3214 원문 그대로 두고, 번호만 01~03으로 바꿨다. 소개 문구도 바꾸지 않았다(아래 "판단 보류" 참고).
- 컨텐츠 탭의 한 줄 설명·활용처 칩·라벨은 3214 문구 그대로 `lib/home-journey.ts` 안에 고정했다. 이제 `lib/content-home.ts`의 값을 import하지 않는다. 타입 `ContentServiceId`만 `import type`으로 가져온다.

## 파일별 diff (9b3def8 대비)
| 파일 | 9b3def8 대비 변경 |
|---|---|
| `components/home/journey-content.tsx` | **변경 없음**(바이트 동일). R2 변경(옆 미리보기 제거, 카드 안 이전/다음, `/content/projects/...` 링크)을 되돌렸다 |
| `components/home/journey-dev.tsx`, `journey-tabs.tsx` | 변경 없음(원래부터 동일) |
| `components/home/workflow-journey.tsx` | `ConsultBody`·`BrandBody` 컴포넌트, `consultPanel`·`brandPanel` import, `bodies`·`links`의 consult/brand 항목을 지웠다. 주석 "five articles"는 "three articles"로 고쳤다. 그 밖의 마크업·로직은 원문 그대로다 |
| `components/home/workflow-journey.css` | 진행바만 3등분했다: 기본 `scaleY(0.2)`→`0.333333`, `data-active="1"` `0.4`→`0.666667`, `data-active="2"` `0.6`→`1`. `data-active="3"`·`"4"` 규칙은 지웠다. Codex가 911-915에 추가한 블록(카드 안 둥근 이전/다음, `object-fit: contain`)은 9b3def8 복원으로 함께 빠졌다 |
| `lib/home-journey.ts` | ① `JourneyStepId`에서 consult/brand를 뺐다. ② `journeySteps`를 개발·마케팅·컨텐츠 순서의 3개로 줄였다. 문구는 원문 그대로이고 `num`·`eyebrow` 번호만 01~03으로 바꿨다. ③ `consultPanel`·`brandPanel` 데이터는 원문을 보존하고, 렌더링하지 않는다는 주석을 달았다. ④ `contentTabs`는 3214 문구를 담은 `contentTabCopy` 배열에서 만든다. `requiredContentServices`도 이 배열에서 만든다. ⑤ 섹션 주석 번호를 바꿨다(03→01 개발, 04→03 컨텐츠, 05→02 마케팅) |
| `components/home/home-hero.tsx`, `home-hero.css`, `home-services.tsx` | **삭제.** 9b3def8에는 없던 파일이다(e53e108에서 추가됨). 코드 어디에서도 import하지 않는다. grep 결과 `tests/new-tab-links.test.mjs`(R4 수정본)만 `home-services.tsx`를 파일로 읽었다(아래 요청 사항 참고) |
| `tests/home-journey.test.mjs` | 아래 "테스트 계약" 참고 |

### 단계 번호 전후 (문구는 동일)
| 3214 | 지금 |
|---|---|
| 03 DEVELOPMENT · 웹사이트와 쇼핑몰을 / 가이드대로 만듭니다 | 01 DEVELOPMENT · (같은 문구) |
| 05 MARKETING · 계획하고 운영하고 / 데이터로 고칩니다 | 02 MARKETING · (같은 문구) |
| 04 CONTENT · 채널에 맞는 컨텐츠를 / 직접 만듭니다 | 03 CONTENT · (같은 문구) |
| 01 CONSULT, 02 BRAND GUIDE | 렌더링 안 함(데이터만 보존) |

마케팅 패널(label "마케팅 운영 흐름", tag "연출 예시", 노드 detail 4개)은 3214 원문으로 돌아갔다. Codex가 고친 문구는 남아 있지 않다.

## 문구 변경
**없음.** 소개 제목·리드와 각 단계 문구는 모두 3214 원문 그대로다.

판단 보류(메인·사용자 확인 필요):
- 소개 제목 `상담부터 성과까지\n하나로 이어집니다`는 '상담'을 흐름의 시작점으로 부른다. 단계를 하나씩 나열하는 문구는 아니어서 "3214 원문 유지" 결정에 따라 그대로 두었다. 상담은 맺음 문구("어디서부터 시작할지 상담에서 함께 정합니다")와 견적 문의 버튼으로 여전히 남아 있다. 바꾸기로 하면 가장 작은 수정안은 `기획부터 성과까지\n하나로 이어집니다`(한 단어 교체)다.
- 개발 단계 제목 "가이드대로 만듭니다"와 리드 "정리한 브랜드 자료", 컨텐츠 리드 "같은 브랜드 가이드로"는 이제 화면에 없는 '브랜드 가이드' 단계를 가리킨다. 지시대로 원문을 유지했다.

## 링크 새 탭 (HANDOFF 결정 12)
9b3def8에 이미 들어 있어서 그대로 유지했다.
- 워크플로우 단계 링크는 `JourneyAnchor`가 `contentLinkProps(href)`로 처리한다. `/content`로 가는 링크는 새 탭으로 열리고 `NewTabHint`가 붙는다.
- 컨텐츠 탭의 "서비스 자세히 보기"(`/content/services/{id}`)에는 `newTabProps`와 `NewTabHint`가 붙어 있다.
- "작업 자세히 보기"는 `work.canonicalPath`(메인 사이트의 `/work/...` 경로)로 가며 같은 탭에서 열린다. 리뷰 플래그 "1"일 때만 보인다.
- 9b3def8판 `new-tab-links.test.mjs`의 메인 카드·워크플로우 검사(테스트 3·4)는 지금 작업트리에서 통과한다(아래 참고).

## 테스트 계약 변경 (`tests/home-journey.test.mjs`)
9b3def8판을 기준으로 아래만 바꿨다.
1. "five journey steps…" 테스트를 "three journey steps … keep the 3214 wording"으로 바꿨다. 검사하는 것은 단계 ID 순서, num 01~03, eyebrow, 각 단계의 railLabel·title·lead(3214 원문과 정확히 일치), 소개 제목·리드 원문, consult/brand 단계 부재다. 줄 길이 11자 이하 규칙은 그대로 유지했다.
2. 컨텐츠 탭 테스트는 이제 `contentHomeServices`와 문구를 비교하지 않는다. 대신 고정된 3214 라벨·한 줄 설명·칩을 검사하고, ID 순서만 `contentHomeServices`와 맞는지 확인한다(서비스 링크가 맞는 곳으로 가는지 보장).
3. 테스트를 하나 추가했다: consult/brand 패널 데이터는 남아 있지만 `workflow-journey.tsx`에서는 쓰지 않는지, 진행바 CSS가 3등분인지 확인한다.
4. 메인 테스트는 9b3def8판으로 되돌렸다. R4에서 추가된 `분야별 전문가들이` 검사는 3214 `main.jsx`에 없는 문구라 뺐다. `브랜드 홍보 영상, SNS 광고 영상` 검사와 REQUIRED 전체 문자열 검사는 복원했다. `<HomeHero|<HomeServices`가 없는지 검사하는 줄을 추가했다. 3214 `main.jsx`에는 `id="process"`가 없어서 "no #process" 검사는 그대로 통과한다. OUR STANDARD 검사도 유지했다.
5. 고객 데이터 검사에서 `"use client"`가 아닌 `components/` 파일은 건너뛰는 줄을 유지했다(HEAD에 있던 것). R2 ContentHome 서버 컴포넌트는 다른 에이전트 소유라서 필요하다.

## 실행 결과 (직렬)
```
node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/home-journey.test.mjs
✔ three journey steps (development, marketing, content) keep the 3214 wording
✔ content tabs are the six video services and spell the required phrase
✔ consult and brand guide panels are kept as data but not rendered
✔ every referenced slug exists and matches its step
✔ before captures exist only for real captures and only in the review build
✔ copy avoids banned phrasing and keeps the AI influencer facts
✔ main page uses the journey, the six-service wording and no #process section
✔ about page lists the six content services
✔ no link points at the removed main #process section
✔ journey CSS uses role tokens only
✔ review gate: unset, 0 and true select no customer work data
✔ client journey modules hold no customer data and never import it
ℹ tests 12 · pass 12 · fail 0
```
```
npx tsc --noEmit -p .   → exit 0 (출력 없음, 실행 시점의 다른 에이전트 작업분 포함)
```
```
node … --test tests/new-tab-links.test.mjs (HEAD = R4 수정본, WP-M 소유 아님)
✖ main page content links open in a new tab; marketing and lab cards do not   (home-services.tsx ENOENT, main.jsx에 <HomeServices 없음)
✖ workflow link arrows keep a gap and #divisions titles share one row       (.home-service-card CSS 기대)
ℹ tests 6 · pass 4 · fail 2
```
9b3def8판 `new-tab-links.test.mjs`를 스크래치 경로로 복사하고 root만 작업트리로 바꿔 실행했다. 결과는 테스트 1~5 통과다. 테스트 6(HomeReferences)은 복사본의 상대 import 경로 때문에 실패했다. 이 테스트는 R4 수정본에서도 바뀌지 않았고, 원래 위치의 R4 실행에서는 통과한다.

## 메인에 요청 (WP-M 소유 밖)
1. **`tests/new-tab-links.test.mjs` 테스트 3·4를 9b3def8판으로 되돌려야 한다.** R4의 Codex가 `HomeServices` 카드를 기준으로 고쳐 썼는데, 3214 `main.jsx`는 이 카드를 쓰지 않는다. 3·4번은 원래 9b3def8판처럼 `main.jsx`의 `GuideLink` 카드와 `gridTemplateRows`를 검사해야 한다. 되돌린 판은 지금 작업트리에서 통과한다.
2. `tests/content-home.test.mjs` 9번("메인 컨텐츠 탭 한 줄 설명 공유")은 `/content-home/.test(journey)` 조건 덕분에 지금도 통과한다(`home-journey.ts`가 `content-home.ts`를 type import한다). 다만 이 테스트의 의도인 '공유'는 이번 '고정' 결정과 맞지 않는다. WP-H가 정리할지 판단해야 한다.

## NOT_RUN / 주의
- `next build`, 개발 서버, 브라우저 렌더링 확인(3214와 화면 비교, 진행바 동작, 모바일)은 하지 않았다(지시대로 NOT_RUN).
- 독립 검수: NOT_RUN(자체 검증만 함).
- 커밋 안 함. 파일 복원 과정에서 `git rm` 뒤에 `git reset -q`(index만)를 실행했다. 작업트리 파일은 바뀌지 않았다. 지금 index는 HEAD와 같다. 실행 직전에 staged 상태인 변경은 없었다(실행 전 상태 확인 결과는 untracked `BRIEF_R5.md` 하나뿐이었다).
