# P2 구현 및 로컬 검증 결과

- 버전: RESULT_P2 v1 / 2026-10-13
- 판정: **PASS_LOCAL_P2_SELF_CHECK** — BRIEF_P2의 구현·로컬 검증 완료
- 작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- 브랜치: `codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- 기준과 현재 HEAD: `4c62a58bfe0b50f17ba70f4f2f76e9d944f9aa1c` (P1)
- 담당: Codex 구현·자기 점검. 다른 AI의 독립 검토는 **NOT_RUN**
- Dispatch: `task_cd1d04bf5956` / `ctx_6c24d258762f`

COMMON.md, RESULT_P1.md, VERIFY_P1.md, BRIEF_P2.md를 끝까지 읽고 P1 위에서 구현했다. I: 볼륨은 AIO_MAIN_2TB / NTFS / Healthy로 확인했으며 시작 시 Git 변경은 없었다. 커밋·push·배포·패키지 설치·비밀값 열람·계정 적용은 실행하지 않았다.

## 구현과 결정

- 6개 컨텐츠 서비스 상세를 `studio-services.jsx`에서 분리했다. 서버 컴포넌트를 기본으로 하며 클라이언트 상호작용은 기존 서비스 탭, 웹툰 라이트박스, 쇼릴을 재사용한다. FAQ는 키보드로 조작하는 네이티브 details/summary다.
- 공통 흐름은 히어로 → 고객 상황 → 제작 범위·규격 → 조건부 사례 → 프로세스 → 활용처 → 진행·견적 → FAQ → 문의의 9개 섹션이다. 기존 sticky 서비스 탭 6개와 별도의 페이지 내 앵커를 유지했다.
- 각 서비스의 히어로·규격·프로세스·FAQ를 별도로 작성했다. 제작 범위는 정의 목록, 진행은 산출물·고객 확인 시점이 붙은 타임라인, 활용처는 채널·규격별 목록으로 구성했다. 범위 설명 패널도 애니메이션의 컷→장면 흐름, 인물 기준 시트, 모션 스타일 프레임, 브랜드 이야기 구조, 광고 후크·길이·비율 조합으로 구분했다.
- 제목은 의도한 두 줄을 각각 span으로 렌더한다. 기존 공통 CSS의 `!important` 제목 크기가 덮어쓰는 문제를 발견해 새 컴포넌트의 클래스 안에서만 보정했다. 768px에서는 히어로를 한 열로 배치한다.
- 사례 조회는 `displayWorkCatalog`와 `workMatchesService`를 유지한다. 컨텐츠 상세에서 가이드의 `제작 예시`를 고객 사례로 사용하지 않으며, 웹툰은 웹툰 대표 페이지를 우선하고 영상 서비스는 영상 미디어를 우선해 최대 4개를 노출한다. 등록된 제목·브랜드·scope·제작 상태와 상세 URL을 그대로 사용한다.
- 작품이 없는 기본 빌드에서는 사례 섹션과 사례 앵커를 함께 숨긴다. 히어로의 보조 버튼은 제작 범위로 연결하고 정적 대표 이미지를 `연출 예시`로 표시한다. 빈 사례 카드나 가짜 고객 사례를 만들지 않는다.
- 실제 영상은 controls / playsInline / preload="none" / poster와 크기를 지정했다. 웹툰은 대표 페이지, 사이트 미디어는 브라우저 프레임을 제공하는 컴포넌트로 처리한다. 프레임의 비율은 클래스 CSS로 지정하며 새 컴포넌트의 인라인 style은 0개다.
- 웹툰 기본 1회분을 12컷으로 바꿨다. `cut-01.webp`부터 `cut-12.webp`까지 연속 사용하며 라벨·aria-label·본문·서비스 데이터·가이드 본문을 함께 정정했다. `WebtoonDevices`, `WebtoonScope`, `ShowcaseVideo kind="webtoon"`을 재사용했다.
- 서비스별 title/description/OG는 기존 pageMetadata 패턴을 사용한다. Service와 BreadcrumbList 구조화 데이터는 라우트에, 화면과 같은 질문·답변의 FAQPage는 상세 컴포넌트에 둔다. 문의 URL은 `/content/contact?service=<id>`다.
- 가격은 모두 `맞춤 견적`이며 분량·난도·권리·수정 범위를 설명한다. 광고 집행·매체비와 인플루언서 채널 운영은 각각 마케팅 서비스 링크로 연결했다. 성과 수치·후기·가격을 새로 주장하지 않았다.

## 변경 파일

| 파일 | 변경 |
| --- | --- |
| `lib/content-service-plans.ts` | 6개 서비스별 히어로·상황·규격·진행·활용·견적·FAQ·CTA 기획 |
| `components/content-service/content-service.tsx` | 새 상세페이지, 조건부 사례, 앵커, 문의, FAQPage |
| `components/content-service/work-media.tsx` | 실제 영상·대표 웹툰 페이지·사이트 프레임 |
| `components/content-service/content-service.css` | 기존 토큰과 다크 테마 기반 클래스 CSS·서비스별 패널·반응형·포커스·reduced-motion |
| `app/(public)/[division]/services/[service]/page.tsx` | video 분기 교체, 고객 사례 최대 4개, 서비스별 메타데이터 |
| `components/guide/webtoon-scope.tsx` | 12컷 연속 샘플·그리드·문구, 확대 dialog의 접근성 라벨 |
| `lib/content.ts` | 웹툰 기본 1회 12컷과 산출물 문구 |
| `lib/guide-content.ts` | 웹툰 가이드 본문의 회차 분량 12컷 |
| `components/guide/studio-services.jsx` | 삭제: 범용 상세·cuts·cutNote·tabs·임시 motion 항목 함께 제거 |
| `components/guide/studio-p1.css` | 삭제한 임시 화면에서만 쓰던 `.p1-motion-preview` 제거 |
| `tests/seo-http.mjs` | 새 FAQ id 선택자, 서비스별 4개 이상 FAQ·FAQPage 일치·필수 섹션·12컷 회귀 검증 |
| `docs/renewal-2026-10-13/RESULT_P2.md` | 이번 결과 |

검증 보조 스크립트·실제 로그·JSON·캡처는 기존 gitignore 대상 `.qa/p2/`에 저장했다. 새 최상위 폴더는 만들지 않았다. COMMON·BRIEF·P1 결과/검증 문서, 메인 워크플로우(P4), `/content` 메인(P3), 마케팅·개발 페이지는 수정하지 않았다.

## 실제 실행한 명령과 출력

Windows에서 `.qa/p2/checks.mjs`는 아래 npm CLI와 Node 테스트를 순서대로 자식 프로세스로 실행하고 로그에 종료 코드를 기록한다. `.qa/p2/builds.mjs`는 빌드 → next start → 브라우저 검사 → 서버 종료를 한 모드씩 직렬 실행한다. 검증용 환경값은 해당 자식 프로세스에만 전달했고 `.env`와 계정 설정은 변경하지 않았다.

| 명령 | 실제 결과 | 로그·증거 |
| --- | --- | --- |
| `npm run typecheck` | exit 0 / PASS | `.qa/p2/typecheck.log` |
| `npm run lint` | exit 0 / 오류 0, 기존 경고 1 | `.qa/p2/lint.log` |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` (`AIO_VERIFY_LOCAL_MEDIA=1`) | exit 0 / 31 PASS, 실패·skip 0 | `.qa/p2/tests.log` |
| `npm run build` (`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`) | exit 0 / PASS | `.qa/p2/build-review.log` |
| `npm run build` (`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=0`) | exit 0 / PASS | `.qa/p2/build-public.log` |
| `node .qa/p2/builds.mjs` | 두 모드의 최종 빌드·브라우저·공개 SEO 검사·자산 보존 PASS | `.qa/p2/browser-review.log`, `browser-public.log`, `PRESERVATION.json` |
| `node --conditions=react-server --experimental-strip-types tests/seo-http.mjs` | exit 0 / 56페이지, 내부 링크 197개, 공유 이미지 4개, 오류 0 | `.qa/p2/seo-http.log`, `SEO_HTTP.json` |
| `node --experimental-strip-types .qa/p2/source-audit.mjs` | 기존 회차 문구 0 / 새 인라인 style 0 / 상세 import 0 / 6종 고유 데이터 / 일반 JS 고객 작품 0 | `.qa/p2/SOURCE_AUDIT.json` |
| `node .qa/p2/visuals.mjs`, `node .qa/p2/visuals.mjs --grid-only` | 모바일 범위·진행·FAQ 18장, 12컷 전체 그리드 캡처 | `.qa/p2/sections-public/` |
| `git diff --check` | exit 0 / 공백 오류 없음, LF/CRLF 안내만 발생 | 터미널 출력 |
| `git diff --name-only -- content/works lib/generated lib/work-catalog.ts next.config.ts app/sitemap.ts 'app/(public)/[division]/page.tsx' components/guide/main.jsx components/guide/studio-home.jsx lib/service-plans.ts components/guide/service-detail.tsx` | 출력 0 / 공개 게이트와 범위 밖 파일 변경 없음 | 터미널 출력 |
| `Get-NetTCPConnection -LocalPort 3251,3252 -State Listen` 집계 | `P2_LISTENERS=0` | 터미널 출력, `.qa/p2/server-*.log` |

빌드·서버 검증용 자식 프로세스는 `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`로 실행했다. 검토 빌드는 127.0.0.1:3251, 일반 빌드는 127.0.0.1:3252에서 검사했다. SEO 검사에는 `AIO_QA_BASE=http://127.0.0.1:3252`, `AIO_QA_REPORT=.qa/p2/SEO_HTTP.json`을 전달했다. dev 서버는 사용하지 않았고 마지막 `.next`는 일반 빌드다.

타입·lint·직렬 테스트의 최종 출력:

```text
> aio-make@1.0.0 typecheck
> tsc --noEmit
EXIT_CODE=0

> aio-make@1.0.0 lint
> eslint app components lib tests
tests/local-admin.test.mjs
  110:38 warning 'options' is assigned a value but never used
✖ 1 problem (0 errors, 1 warning)
EXIT_CODE=0

ℹ tests 31
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 13135.1247
EXIT_CODE=0
```

빌드·화면·SEO 출력 발췌:

```text
BUILD_START mode=review reviewFlag=1
{"name":"build-review","code":0}
{"mode":"review","viewportChecks":24,"interactionChecks":13,"consoleErrors":0,"reviewDetails":18,"result":"PASS"}
{"mode":"review","serverStopped":true,"pid":27856}

BUILD_START mode=public reviewFlag=0
{"name":"build-public","code":0}
{"mode":"public","viewportChecks":24,"interactionChecks":9,"consoleErrors":0,"reviewDetails":18,"result":"PASS"}
{"pages":56,"internalLinks":197,"shareImages":4,"errors":[]}
{"mode":"public","serverStopped":true,"pid":19124}
{"referenceAssetsPreserved":91,"registrationsPreserved":18,"generatedPreserved":true,"result":"PASS"}

{"oldProductionCopy":[],"inlineStyles":[],"studioServiceImports":0,
 "uniqueFields":{"headline":true,"specs":true,"stages":true,"faq":true},
 "faqCounts":[5,4,5,5,5,5],"stageCounts":[6,5,5,5,5,5],
 "reviewRecords":18,"rightsUnconfirmed":18,"publicBrowserChunks":61,
 "customerRecordsInPublicBrowserJavaScript":0,"result":"PASS"}
P2_LISTENERS=0
```

최종 생성 TS SHA-256:

```text
5c60dbb2e9a02ba569fa38012ae350281dfa28987952807ec9b52223bb0b7dde
```

P1의 생성물 SHA와 같으며 JSON 18개와 reference-review 원본·파생물 91개도 검증 전후 bytes와 SHA가 일치한다. 상세 파일 목록과 각 SHA는 `PRESERVATION.json`에 있다.

## 화면·상호작용 확인

- 검토/일반 각 6경로 × 1440/768/390/360px = 24회, 합계 48회 HTTP 200·가로 넘침 0·깨진 이미지 0·h1 1개·콘솔/런타임 오류 0.
- 각 제목의 명시적 줄바꿈 span이 한 줄 높이를 유지하는지 실제 DOM 높이와 계산된 line-height로 확인했다. 서비스 앵커의 대상 누락 0, 문의 버튼의 서비스별 URL도 확인했다.
- 검토 빌드: 9섹션과 지정 작품 노출. 일반 빌드: 사례 섹션·사례 앵커 숨김, 나머지 8섹션과 정적 대표 이미지 정상.
- 두 모드에서 웹툰 그리드의 12개 실제 이미지 URL을 `cut-01..12` 배열과 직접 비교했다. 1·12컷 확대, Escape/닫기 버튼, 닫은 뒤 원래 버튼의 포커스 복귀를 확인했다.
- 6개 FAQ를 각각 키보드 Enter로 열었다. 검토 모드에서는 영상 서비스마다 고객 사례 1개를 실제 재생했고 일반 모드에서는 웹툰 쇼릴을 재생했다. 재생 시간 증가·paused false·video error 없음 확인.
- reduced-motion 설정에서 모션그래픽 페이지 렌더링을 확인했다.
- 두 모드 모두 고객 작품 18개의 사이트맵 제외를 확인했다. 검토 작품 상세는 검토 모드에서 200·noindex 헤더, 일반 모드에서 404다. `visibility:"review"`, `rightsConfirmed:false`와 Vercel 차단 규칙을 수정하지 않았다.
- 1440·390px 히어로 6종 캡처, 390px 범위·진행·FAQ 6종 캡처, 12컷 전체 그리드와 라이트박스 캡처를 직접 열어 확인했다. 비교용 이미지: `.qa/p2/heroes-review-1440.png`, `heroes-review-390.png`, `scope-public.png`, `process-public.png`, `faq-public.png`.
- 세부 DOM·작품·상호작용 증거: `.qa/p2/browser-review/BROWSER_QA.json`, `.qa/p2/browser-public/BROWSER_QA.json`.

실제 검토 사례:

| 서비스 | 개수 | slug |
| --- | --- | --- |
| 웹툰 | 4 | `yofree-outing-webtoon`, `bwl-brand-webtoon`, `yofree-night-webtoon`, `bwl-aqua-webtoon` |
| 애니메이션 | 2 | `yofree-outing-motion`, `yofree-night-motion` |
| AI 인플루언서 | 3 | `bwl-aqua-ad`, `bwl-cplus-ad`, `bwl-cleanser-ad` |
| 모션그래픽 | 4 | `bwl-brand-motion`, `healernet-motion`, `yofree-mg-short`, `yofree-mg30` |
| 브랜드 홍보 영상 | 3 | `bwl-brand-motion`, `healernet-motion`, `bwl-brand-ad` |
| SNS 광고 영상 | 4 | `bwl-brand-ad`, `bwl-aqua-ad`, `bwl-cplus-ad`, `bwl-cleanser-ad` |

## 미사용 코드·기존 회차 문구 전수 확인

`rg -n '24컷|24 cut|length: 24|24장' app components lib tests scripts content`를 실행했다. 서비스 화면·app/components/lib의 운영 문구에는 일치 0개다. 새 스크립트도 실제 화면의 본문과 12개 썸네일을 확인했다. 남은 일치와 사유는 BRIEF_P2의 잔여 기록 규칙에 따라 아래와 같이 구분한다.

- `tests/seo-http.mjs`: 기존 회차 문구가 재등장하면 실패시키는 부정 회귀 검사 정규식. 화면에 출력되는 문구가 아니다.
- `scripts/restore-guide.py:178,209,242,243,245`: 과거 HTML/JS 입력의 회차 문구를 제거하는 복원용 치환 패턴. 현재 빌드의 입력이나 UI가 아니며 이번 상세 구현에서 실행하지 않았다. 과거 입력 호환을 위한 문자열이라 보존했다.
- 지시 문서·P1 검증 기록과 legacy 보관 자료의 기존 분량 기록은 역사적 근거이므로 수정하지 않았다.

`studio-services.jsx`의 실행 import는 app/components/lib/tests에서 0개다. `scripts/polish-v11.mjs`와 `scripts/restore-guide.py`에는 과거 파일 경로가 남아 있지만 이 단계에서 사용하는 실행 경로가 아니다. 이 복원 스크립트를 현재 상세페이지에 재실행하는 작업은 진행하지 않았다.

공유 CSS는 사용처를 검색했다. `.p1-motion-preview`만 삭제한 상세의 임시 미디어 전용이라 제거했다. `.p1-content-service-list`는 메인에서 쓰므로 유지했고, 웹툰 기기·스코프·쇼릴 및 다른 페이지의 공유 CSS도 유지했다.

초기 QA에서는 영상 내부의 파일 링크를 작품 상세 링크로 읽는 셀렉터 오류와 Enter 문자 입력이 빠진 키보드 시뮬레이션 오류를 발견했다. QA 스크립트를 고친 뒤 재실행했고 제목 크기의 실제 CSS 충돌도 수정했다. 첫 빌드·중간 실패 로그는 `.qa/p2/build-review-attempt1.log`, `browser-review-attempt2.log`에 보존했으며 최종 판정은 최종 두 빌드·화면·검사 결과를 기준으로 한다.

## 완료 기준과 남은 확인

- [x] 6서비스 고유 히어로·규격·진행·FAQ, 검토 9섹션/일반 조건부 8섹션
- [x] 웹툰 12컷 연속 그리드·확대·닫기·포커스 복귀, 화면의 기존 분량 문구 0
- [x] 검토 지정 사례 노출 / 일반 사례 숨김·콘솔 오류 0
- [x] 1440/768/390/360 가로 넘침 0·제목 줄바꿈 확인
- [x] typecheck / lint 오류 0 / 직렬 31테스트 / 두 빌드 / SEO HTTP PASS
- [x] 기존 범용 상세 제거·video 분기 교체·임시 motion 코드와 CSS 정리
- [x] 고객 작품 18개 등록·권리·원본 자산 보존, noindex·사이트맵·브라우저 공개 게이트 유지

P2 구현과 필수 로컬 검증의 미해결 사항은 없다. 사람의 확인이 필요한 사항은 다음과 같다.

- `bwl-aqua-ad`, `bwl-cplus-ad`, `bwl-cleanser-ad`의 등장인물이 AI 생성인지 근거 자료에 기록돼 있지 않다. 확인 필요이며 페이지에서는 **인물 중심 세로 영상 시안**으로 표시하고 제작 방식을 단정하지 않는다.
- 18개 고객 작품의 공개 권리·후보의 제작 상태는 여전히 **UNKNOWN/HOLD**다. 사람의 공개 승인과 근거 확인 전까지 기존 게이트를 유지해야 한다.
- 기존 lint 경고 1개(`tests/local-admin.test.mjs:110`)는 허용 기준이며 범위 밖이라 수정하지 않았다.
- 다른 AI의 독립 검토, 사람의 페이지 승인, 운영 DB·계정 적용, 실제 배포·운영·고객 전달은 **NOT_RUN**이다. P3/P4 작업도 **NOT_RUN**이다.
- 커밋·push·패키지 설치·게시·외부 전달·결제·자격 증명 변경은 실행하지 않았다.
