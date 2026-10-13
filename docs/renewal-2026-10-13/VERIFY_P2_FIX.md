# P2 FIX 재검증 결과 (VERIFY_P2_FIX)

- 버전: VERIFY_P2_FIX v1 / 2026-10-13
- **전체 판정: PASS** — 이전 FAIL 2건, 주의 5건, healernet-motion scope 수정이 모두 해결됐고 이번 수정으로 생긴 회귀는 찾지 못했다. 남은 관찰 2건은 판정에 넣지 않았다(아래 "잔여 관찰").
- 검증자: Claude Sonnet (읽기 전용). 소스 수정·커밋·push·배포·패키지 설치·비밀값 읽기 없음. 쓴 파일은 이 문서와 `.qa/p2-verify/fix/`(gitignore) 뿐이다. 검증 전후 `git status --short`가 동일하다.
- 대상: 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`, HEAD `4c62a58` 위의 P2·P2 FIX 미커밋 변경
- 방법: `RESULT_P2_FIX.md`는 믿지 않고 직접 재현했다. 브라우저 검사는 기존 `.qa/p2-fix` 스크립트를 쓰지 않고 새로 쓴 `.qa/p2-verify/fix/run.mjs`(Chrome 헤드리스 CDP)로 했다. 빌드는 한 번에 하나, 서버는 `next start -p 3214`만 썼고 dev 서버는 쓰지 않았다. 서버 3회(켠 빌드, 끈 빌드, seo-http) 모두 종료 후 3214 리스너 0개를 확인했다.
- 증거(gitignore): `.qa/p2-verify/fix/` — `typecheck.log`, `lint.log`, `tests.log`, `build-review.log`, `build-public.log`, `review/`·`public/`(`RESULTS.json`, 스크린샷), `HEADINGS_review.json`, `HEADINGS_public.json`, `SEO_HTTP.json`

## 요청 항목별 판정

| # | 항목 | 판정 | 근거 |
| --- | --- | --- | --- |
| 1 | typecheck / lint / 직렬 테스트 / build | PASS | `npm run typecheck` exit 0. `npm run lint` exit 0, `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110`). 직렬 테스트 exit 0, `tests 31 / pass 30 / fail 0 / skipped 1`. skip 1은 `AIO_VERIFY_LOCAL_MEDIA` 미지정 시 의도된 skip이고, `AIO_VERIFY_LOCAL_MEDIA=1`로 다시 돌리면 `pass 31 / skipped 0`이다. `npm run build` 켠 빌드(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`)·끈 빌드(`=0`) 모두 exit 0(공통 `ENABLE_LEGACY_SUPABASE=false AIO_LOCAL_ADMIN_ENABLED=false`) |
| 2 | 6개 서비스 h1·h2·h3 조사·span 공백·같은 틀 | PASS | 아래 "제목 검사" |
| 3 | 삭제 CSS 선택자 0건, 다른 페이지 스타일 | PASS | 아래 "삭제 CSS 검사" |
| 4 | 켠/끈 빌드 × 6 × 4폭 넘침·콘솔·화면 | PASS | 아래 "화면 검사" |
| 5 | healernet scope 문장, JSON ↔ generated 일치 | PASS | 아래 "healernet scope" |
| 6 | 18작품 review 게이트·rightsConfirmed false·사이트맵 제외 | PASS | 아래 "게이트" |
| 7 | `tests/seo-http.mjs` | PASS | 끈 빌드 서버(3214)에서 exit 0, `pages 56 / internalLinks 197 / shareImages 4 / errors []` |

## 이전 지적 사항 해결 여부

| 이전 지적 | 판정 | 확인 내용 |
| --- | --- | --- |
| FAIL 1: 활용처 h2 "AI 인플루언서**을** 사용할…" | PASS | 활용처 h2가 서비스별 고유 문장이다. AI 인플루언서는 "시리즈를 게시할 채널에 맞춰 인물을 배치합니다". 6개 서비스 h1·h2·h3 전부(두 빌드 각 138개)에서 조사 오류 0 |
| FAIL 2: 고아 CSS 잔존 | PASS | 아래 "삭제 CSS 검사". 4개 선택자 소스 0건 |
| 주의 1: 같은 틀 제목 | PASS | `{이름} 작업 살펴보기`·`{이름} 제작 전 확인할 내용`·`{이름}을 사용할 화면에 맞춥니다`·고정 `맞춤 견적` 모두 사라졌다. 서비스명을 치환해 비교하면 서비스 간 같은 틀은 `자주 묻는 질문`(전역 플로팅 FAQ 위젯 `components/floating-contact.tsx:72`의 h2)뿐이다 |
| 주의 2: 히어로 서비스명 중복 | PASS | 상단 라벨이 `AIO MAKE / CONTENT`로 바뀌어 히어로 안에서 서비스명은 이름 줄 1회만 나온다. 서비스 탭의 활성 항목은 내비게이션으로 유지(1440 스크린샷 `hero-*-1440.png` 6장 확인) |
| 주의 3: h1 span 사이 공백 | PASS | h1 textContent가 `웹툰 브랜드 이야기를 다음 컷이 궁금한 웹툰으로`처럼 공백을 포함한다. 138개 제목 전부에서 인접 텍스트 노드가 공백 없이 붙는 경계 0건 |
| 주의 4: 360px AI 인플루언서 프로세스 제목 | PASS | DOM Range 줄 분해가 두 빌드 모두 `한 인물의 기준을 정한 뒤,` / `여러 편의 이야기를 만듭니다`(`white-space: pre-line`, `text-wrap: balance`). `ai-process-360.png`로 확인 |
| 주의 5: 모션그래픽 사례 그리드 | PASS | 켠 빌드 4폭에서 카드 4개의 프레임·카드 높이·제목 top·상태 라벨 top이 같은 행에서 동일하다(1440: 프레임 641×360, 768: 330×186, 390: 350×197, 360: 320×180). 상태 라벨 오른쪽 끝이 프레임 오른쪽 끝과 일치한다. 세로 영상은 16:9 프레임 안에서 좌우 여백을 두고 `contain`으로 들어가 잘리거나 늘어나지 않는다. `motion-cases-{1440,768,390,360}.png` 4장 확인 |
| 주의 6: healernet scope | PASS | 아래 "healernet scope" |

## 제목 검사 (Acceptance 2)

- 방법: 두 빌드 6페이지에서 `h1·h2·h3` 138개의 textContent를 추출해 `을/를·이/가·은/는·와/과`를 앞 글자 받침과 대조하는 스크립트(`headings.mjs`)로 검사했다.
- 결과: 후보 11건이 나왔고 전부 오탐이다("읽는", "묻는", "맞는"의 어미 `는`과 플로팅 위젯의 "자주 묻는 질문"). 실제 조사 오류 0. 목록은 `HEADINGS_*.json`.
- 서비스끼리 같은 문장 틀: 이름 치환 후에도 같은 제목은 `자주 묻는 질문`(전역 위젯)뿐이다. 같은 사례 작품이 두 서비스에 걸리는 경우(`브랜드 모션그래픽`, `아쿠아 세럼 영상 시안` 등)의 H3는 작품 제목이라 의도된 중복이다.
- 서비스별 활용처 h2: 웹툰 "읽는 화면에 맞춰 컷을 배치합니다", 애니메이션 "릴스와 본편에 맞춰 장면을 재구성합니다", AI 인플루언서 "시리즈를 게시할 채널에 맞춰 인물을 배치합니다", 모션그래픽 "가로와 세로 화면에 제품과 글자를 다시 배치합니다", 브랜드 홍보 영상 "홈페이지와 발표, SNS에 맞는 버전을 준비합니다", SNS 광고 영상 "광고 게재 위치에 맞춰 길이와 비율을 나눕니다". 상황·사례·활용처·견적·FAQ 제목이 모두 서비스마다 다르다.
- 문형 관찰(판정 제외): 활용처 h2 6개가 모두 "~에 맞춰/맞는 ~를 ~합니다" 문형이고 모션그래픽·브랜드 홍보 영상의 견적 h2가 둘 다 "~를 견적에 담습니다"로 끝난다. 이름만 바꾼 복붙은 아니고 내용이 서로 다르다.

## 삭제 CSS 검사 (Acceptance 3)

- `rg -n --hidden`(node_modules·.next·.git·.qa 제외)으로 `webtoon-service-intro|video-service-hero-copy|studio-process-heading|guide-studio-services`를 검색하면 소스·CSS·스크립트에서 0건이다. 남은 4줄은 `docs/renewal-2026-10-13/`의 설명 문서(`VERIFY_P2.md`, `RESULT_P2_FIX.md`)뿐이다.
- `.qa/p2-fix/before/`의 수정 전 사본과 현재 `ux.css`·`creative.css`·`guide.css`를 비교하면 차이는 정확히 해당 규칙 삭제뿐이다(`ux.css` 규칙 6개와 비게 되는 1100px 미디어 블록, `creative.css` 1개, `guide.css`의 선택자 1줄). `guide.css`의 `.guide-studio-home, .guide-studio-contact` 목록은 그대로이고 `studio-home.jsx`·`studio-contact.jsx`가 계속 쓴다.
- `className` 동적 조합(`guide-${…}` 등)으로 삭제 클래스가 만들어질 가능성도 `app components lib` 전체 검색에서 없다.
- 회귀 화면: 켠·끈 빌드 모두 `/`, `/content`, `/content/work`, `/content/contact`, `/marketing`, `/marketing/services/integrated`, `/marketing/contact`, `/lab`, `/lab/services/website`, `/lab/contact`, `/contact`, `/about`를 1440·390에서 열었다. 24회 전부 200, 가로 넘침 0, 깨진 이미지 0, 콘솔 오류 0, h1 1개. `/content`·`/marketing`·`/lab` 1440 스크린샷을 직접 열어 배경·타이포·레이아웃이 깨지지 않았음을 확인했다(`sample-*.png`).

## 화면 검사 (Acceptance 4)

- 두 빌드 × 6서비스 × 360/390/768/1440 = 48회: HTTP 200, h1 1개, `scrollWidth == clientWidth`(1440은 스크롤바 15px 제외로 1425/1425, 768은 753/753), 클립되지 않은 가로 넘침 요소 0, 깨진 이미지 0, 콘솔 error·warning·pageerror·HTTP 4xx·네트워크 실패 0(prefetch 취소 `ERR_ABORTED`만 제외).
- 켠 빌드: `cases` 섹션 포함 9섹션, 사례 수 웹툰 4·애니메이션 2·AI 인플루언서 3·모션그래픽 4·브랜드 홍보 영상 3·SNS 광고 영상 4(BRIEF 지정과 동일). 끈 빌드: 8섹션, 사례 0, 문서 안 `reference-review` 문자열 0, 히어로 버튼이 `제작 범위 보기 ↓`로 대체되고 정적 대표 이미지에 `연출 예시` 캡션.
- 모션그래픽 사례의 상태 라벨은 데이터 값 그대로 표시된다(`제작 완료` 1건, `제작 후보` 3건).

## healernet scope (Acceptance 5)

- 최종 문장: `30초 가로판과 15초 세로판을 제작했습니다. 두 화면 비율은 작품 상세에서 확인할 수 있습니다.` 켠 빌드 모션그래픽 사례 카드에서 그대로 보이고 "아래"를 가리키는 말이 없어 카드 안에서도 자연스럽다(1440 스크린샷).
- `git diff -- content/works lib/generated`는 JSON과 생성 TS에서 이 scope 한 줄씩만 바뀐 것을 보여준다. `npm run works:build` 재실행(`PASS — 18 JSON`) 전후 `git diff -- lib/generated content/works`의 md5가 동일(`ccfc7bf4…`)하고 `git status --short`도 같다. 즉 JSON과 generated가 일치한다.

## 게이트 (Acceptance 6)

- `content/works/*.json` 18개 모두 `visibility: "review"`, `rightsConfirmed: false`(어긋난 파일 0).
- 사이트맵은 `app/sitemap.ts:49`의 `publicWorkCatalog([])`로만 작품 경로를 넣는다. 끈 빌드 서버 `sitemap.xml` 56개 URL에 작품 슬러그가 없고, `/work/healernet-motion`·`/work/bwl-brand-motion`·`/work/yofree-outing-webtoon`은 404이다. 직렬 테스트 중 "registered work enters the public catalog only with both publication values", "public browser data excludes pending customer references with the review flag off"가 통과한다. 켠 빌드의 사이트맵은 이번에 라이브로 받아보지 않았고 소스와 테스트로 확인했다(마지막 `.next`가 끈 빌드라서).

## 잔여 관찰 (판정 제외)

1. 다른 작품의 scope에도 마침표 없이 이어진 문장이 남아 있다. 예: `yofree-mg30` 카드 "…출력 4개입니다 제품 효능 표현은 확인 대기 상태입니다". 이번 지시는 healernet 한 건이었고 P1 데이터 원문 보존 정책 범위라 지적하지 않는다. 필요하면 별도 데이터 정리로 처리할 수 있다.
2. 활용처 h2의 "~에 맞춰 ~를 ~합니다" 문형 반복(위 "문형 관찰").

## 실행하지 않은 것 (NOT_RUN)

- 실제 브라우저에서 사람이 마우스로 영상 재생 버튼을 누르는 확인(P2 검증과 같은 도구 한계. 이번에는 재생 동작을 다시 확인하지 않았고 영상 마크업은 변경되지 않았다).
- `npm run works:build -- --media`, 운영 배포, 계정·DB 관련(범위 밖, 금지).
- P3/P4 범위.
