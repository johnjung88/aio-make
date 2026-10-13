# P1 구현 및 로컬 검증 결과

- 버전: RESULT_P1 v1 / 2026-10-13
- 결과: **PASS_LOCAL_P1_SELF_CHECK** — BRIEF_P1 완료 기준 전 항목 확인
- 작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- 브랜치: `codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- 기준 및 현재 HEAD: `db002f7ca0b43f05b457e98c337d2b01f696dca9`
- 담당: Codex 구현·자기 점검. Sonnet 독립 검증은 **NOT_RUN**
- Dispatch: `task_6689bef2d710` / `ctx_3adfa4e0fbeb`

중단된 이전 실행의 변경을 먼저 검토하고 유지했다. 이번 재개에서는 모션그래픽 매칭을 정확히 4작품으로 검증하도록 보강하고, 일반 빌드의 브라우저 JavaScript에 남아 있던 검토 작품 데이터를 제거하는 생성물 게이트와 회귀 테스트를 추가했다. 기존 QA 기록만으로 통과를 판단하지 않고 아래 명령과 두 빌드의 화면 검사를 다시 실행했다.

## 구현 결과와 결정

- 컨텐츠 서비스는 순서대로 `webtoon`, `animation`, `ai-influencer`, `motion-graphics`, `brand-film`, `ad`의 6종이다. 표시명·문의 선택지·서비스 키·홈과 소개의 나열 문구를 통일했다
- `motion-graphics` 상세는 기존 서비스 화면에 최소 구성을 추가했으며 `// P2에서 교체` 주석을 유지한다. `/creative-v06/video-brand-film.webp`를 연출 예시로 재사용했다
- 편집 서비스 데이터와 키는 제거했다. `/content/services/editing`, `/video/services/editing`, `/ko/video/services/editing`은 모두 단일 301로 `/content`에 연결한다. 기존 `/video/work/example-webtoon` 등 레거시 테스트도 통과했다
- 18작품은 JSON을 기준으로 등록하고 zod로 검증한 뒤 TS를 생성한다. 서비스·분과, 목적과 범위, 영상 포스터, 웹툰 순서, 공개 권리와 제작 상태를 검증한다
- 4개 모션그래픽 작품의 primary/related만 BRIEF대로 재배치했다. 기존 제목·설명·목적·범위·미디어·정렬은 기준 커밋과 직접 비교해 보존을 확인했다
- 생성 스크립트의 기본 실행은 TS만 갱신한다. `--media`는 `source`가 있는 누락 파생물만 만들며 기존 자산을 덮어쓰지 않는다. `source`는 생성 TS에 포함하지 않는다
- `lib/prepared-work-media.ts`는 제거하고 카탈로그는 생성물을 읽는다. 기존 5개 경로 인자 미디어 준비 방식은 유지하며 미디어 데이터를 지정 보고서 폴더의 `PREPARED_WORK_MEDIA.json`에 기록한다
- 18작품은 모두 `visibility: "review"`, `rightsConfirmed: false`를 유지한다. 공개 카탈로그·사이트맵 제외와 검토 빌드 noindex/Vercel 차단 규칙을 유지했다
- 검토 플래그가 꺼진 브라우저에서는 생성물의 공개 데이터만 사용하도록 조건을 생성한다. 실제 일반 빌드 JS 62개에서 검토 작품 slug·ID가 0개임을 확인했다. 서버의 등록 데이터와 기존 카탈로그 API는 유지한다

## 변경 파일

아래는 기준 커밋 대비 P1 변경 집합이며 이전 실행에서 남은 변경을 포함한다.

| 파일 | 변경 |
| --- | --- |
| `lib/content.ts` | 서비스 6종, 모션그래픽 데이터·이미지, summary |
| `lib/guide-content.ts` | 서비스 나열 문구·서비스별 예시, 기존 오타 수정 |
| `lib/creative-assets.ts` | 기존 모션그래픽 예시 이미지 매핑 |
| `lib/redirects.ts` | 편집 서비스 301 |
| `app/(public)/[division]/services/[service]/page.tsx` | motion 키, 모션그래픽 4작품 표시 |
| `components/guide/primitives.tsx` | 서비스 URL·문의 키 매핑 |
| `components/guide/inquiry-bridge.tsx` | 문의 서비스 별칭 |
| `components/guide/main.jsx` | 홈 Studio·FAQ 문구, 줄바꿈 클래스 |
| `components/guide/about.jsx` | 소개 서비스 문구 |
| `components/guide/studio-home.jsx` | 서비스 순서·표시명·맞춤 견적 |
| `components/guide/studio-contact.jsx` | 6종 문의 선택지 |
| `components/guide/studio-services.jsx` | 임시 motion 항목·예시·서비스 이름, edit 제거 |
| `components/guide/studio-p1.css` | 이미지와 서비스 나열 문구 클래스 |
| `lib/work-schema.ts` | JSON zod 스키마 |
| `lib/work-catalog.ts` | 생성물 기반 등록·공개 권리 가드 |
| `lib/generated/works.generated.ts` | 결정적 생성물·브라우저 공개 게이트 |
| `lib/prepared-work-media.ts` | 삭제 |
| `scripts/build-works.mjs` | 검증·생성·누락 미디어 옵션 |
| `scripts/prepare-reference-media.mjs` | 기존 자산 보존·누락 파생물 함수, TS 출력 제거 |
| `package.json` | `works:build`, 직렬 `test` |
| `tests/domain.test.mjs` | 301과 모션그래픽 분과 검증 |
| `tests/reference-release.test.mjs` | JSON 기반 검증·정확한 4작품·공개 게이트·빌드 실패·브라우저 데이터 회귀 검사 |
| `tests/reference-media.test.mjs` | 임시 이미지·영상·포스터 생성과 기존 파일 보존 검사 |
| `docs/REFERENCES.md` | 5단계 등록 절차·필드 설명·더미 JSON·공개 규칙 |
| `docs/renewal-2026-10-13/RESULT_P1.md` | 이번 결과 |

`content/works/` 신규 JSON 18개:

```text
bwl-aqua-ad.json
bwl-aqua-webtoon.json
bwl-brand-ad.json
bwl-brand-motion.json
bwl-brand-webtoon.json
bwl-cleanser-ad.json
bwl-cplus-ad.json
bwl-editorial.json
bwl-store.json
healernet-motion.json
healernet-website.json
yofree-mg-short.json
yofree-mg30.json
yofree-night-motion.json
yofree-night-webtoon.json
yofree-outing-motion.json
yofree-outing-webtoon.json
yofree-shop.json
```

이번 재개에서 실제로 보강한 제품·문서 파일은 `scripts/build-works.mjs`, `lib/generated/works.generated.ts`, `tests/reference-release.test.mjs`, `docs/REFERENCES.md`, 이 결과 문서다. 검증 보조 스크립트와 실제 로그는 gitignore 대상 `.qa/p1/`에 있다. COMMON·BRIEF_P1·BRIEF_P2는 이미 있던 지시 문서이며 수정하지 않았다.

## 실행한 검증과 실제 출력

최종 코드에서 실행한 명령이다. 테스트의 `AIO_VERIFY_LOCAL_MEDIA=1` 및 빌드의 검토 플래그는 검증 프로세스에만 전달했으며 `.env`·계정·배포 설정을 변경하지 않았다. 두 빌드는 외부 DB/관리 기능을 호출하지 않도록 해당 자식 프로세스에 `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`를 전달했다. 비밀값을 읽거나 출력하지 않았다.

| 명령 | 결과 | 실제 로그 |
| --- | --- | --- |
| `npm run typecheck` | exit 0, PASS | `.qa/p1/typecheck-final.log` |
| `npm run lint` | exit 0, 오류 0·기존 경고 1 | `.qa/p1/lint-final.log` |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` (`AIO_VERIFY_LOCAL_MEDIA=1`) | exit 0, 31/31 PASS, skip 0 | `.qa/p1/tests-final.log` |
| `npm run build` (`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`) | exit 0, PASS | `.qa/p1/current/build-review.log` |
| `npm run build` (`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=0`) | exit 0, PASS | `.qa/p1/current/build-public.log` |
| `npm run works:build` 2회 | exit 0, 생성물 bytes·SHA와 전체 `git diff` 불변 | `.qa/p1/current/registration.log` |
| `npm run works:build -- --media` | exit 0, PASS, 기존 자산 보존 | `.qa/p1/works-media-current.log` |
| `npm run works:build -- --input-dir <임시 JSON 폴더> --output <임시 생성물>` | 의도한 exit 1, 파일명·필드 오류, 출력 보존·임시 폴더 제거 | `.qa/p1/current/registration.log` |
| `node --experimental-strip-types .qa/p1/compare-head-current.mjs` | 기준 커밋 원본과 직접 비교 PASS | `.qa/p1/head-migration-current.log` |
| `node --experimental-strip-types .qa/p1/verify-data.mjs` | 기존 자산 91개 bytes·SHA 일치, 미디어·문구·정렬 보존 PASS | `.qa/p1/DATA_QA.json` |
| `node .qa/p1/validate-builds-current.mjs` | 위 두 빌드·JS 검토 데이터 검사·Chrome 화면 검사 PASS | `.qa/p1/builds-browser-final.log` |
| `git diff --check` | exit 0, 공백 오류 없음 | 터미널 출력 없음. Git의 LF/CRLF 안내만 발생 |

타입 검사·lint 출력:

```text
> aio-make@1.0.0 typecheck
> tsc --noEmit
EXIT_CODE=0

> aio-make@1.0.0 lint
> eslint app components lib tests
tests/local-admin.test.mjs
  110:38  warning  'options' is assigned a value but never used  @typescript-eslint/no-unused-vars
✖ 1 problem (0 errors, 1 warning)
EXIT_CODE=0
```

최종 직렬 테스트 출력 발췌:

```text
✔ the six content services match the four motion graphics works (0.3205ms)
✔ public browser data excludes pending customer references with the review flag off (441.5137ms)
✔ prepared derivatives exist when local review is requested (7.4733ms)
ℹ tests 31
ℹ suites 0
ℹ pass 31
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 15203.3336
EXIT_CODE=0
```

두 빌드 출력 발췌:

```text
BUILD_START mode=review reviewFlag=1
✓ Compiled successfully in 9.1s
✓ Generating static pages (22/22)
status: 0
{"mode":"review","chunks":62,"pendingRecords":18,"pendingRecordsInBrowserJavaScript":18,"result":"PASS"}
{"mode":"review","viewportChecks":40,"reviewDetails":18,"redirects":3,"sitemap":"PASS","result":"PASS"}
BUILD_AND_BROWSER PASS mode=review reviewFlag=1

BUILD_START mode=public reviewFlag=0
✓ Compiled successfully in 4.3s
✓ Generating static pages (22/22)
status: 0
{"mode":"public","chunks":62,"pendingRecords":18,"pendingRecordsInBrowserJavaScript":0,"result":"PASS"}
{"mode":"public","viewportChecks":40,"reviewDetails":18,"redirects":3,"sitemap":"PASS","result":"PASS"}
BUILD_AND_BROWSER PASS mode=public reviewFlag=0
EXIT_CODE=0
```

JSON 빌드 실패의 실제 출력:

```text
works:build FAIL
invalid-work.json: primaryService: video의 서비스가 아닙니다: unknown-service
EXIT_CODE=1
```

잘못된 JSON은 `.qa/p1/current/invalid-json-veDFCl/invalid-work.json`에 만들었다. 기존 생성물 대신 임시 출력에 `preserved output`을 넣고 실패 후 같은 내용임을 확인했다. 최종 생성 TS도 변경되지 않았으며 임시 JSON과 폴더는 `finally`에서 제거하고 부재를 확인했다.

재생성·자산 증거:

```text
HEAD_MIGRATION PASS: db002f7 baseline and snapshot agree; 18 records preserve every unchanged field, 55 media items, featured order; only 4 approved service remappings
twoNpmRebuilds: PASS
gitDiffBeforeAfterEqual: true
generatedBytes: 29097
generatedSha256: 5c60dbb2e9a02ba569fa38012ae350281dfa28987952807ec9b52223bb0b7dde
originalOutputPreserved: true
temporaryJsonRemoved: true
works: 18 / jsonFiles: 18 / mediaItems: 55 / videos: 17
preservedAssets: 91 / preservedAssetBytes: 53426929
copyMediaAndOrder: PASS / sourceBytesAndSha256: PASS
```

## 로컬 HTTP·화면 확인

각 빌드를 `127.0.0.1:3241`(검토), `127.0.0.1:3242`(일반)에서 `next start`로 실행하고 Chrome CDP로 확인했다. 이 검증에서 시작한 서버는 검사 후 종료했다. 마지막 `.next`는 플래그를 끈 일반 빌드다.

- 두 모드에서 홈·`/content`·소개·문의·컨텐츠 상세 6종, 총 10개 경로 × 1440/768/390/360px = 각 40회, 합계 80회 확인
- 모든 대상 페이지 HTTP 200, 가로 넘침 0, 깨진 이미지 0, 페이지 h1 1개
- 모션그래픽 상세의 검토 사례는 정확히 `bwl-brand-motion`, `healernet-motion`, `yofree-mg-short`, `yofree-mg30` 4개. 일반 빌드에서는 고객 사례 0개
- 편집 URL 3개는 각각 HTTP 301과 `/content` Location 확인
- 검토 작품 상세 18개는 검토 빌드에서 200·noindex, 일반 빌드에서 404
- 두 모드 사이트맵에서 review 작품 18개 제외, 모션그래픽 서비스 URL 포함
- 홈·소개에서 통일 문구, `/content`에서 서비스 표시명 6종 확인. 모션그래픽 문의의 선택 상태도 390px 캡처를 열어 확인
- 키보드 Tab으로 본문 바로가기 링크 포커스 확인. reduced-motion 미디어 설정에서도 모션그래픽 페이지 검사 통과
- 세부 기록: `.qa/p1/current/browser-review/BROWSER_QA.json`, `.qa/p1/current/browser-public/BROWSER_QA.json`; 각 폴더에 390px PNG 4장

## 완료 기준

- [x] 타입 PASS, lint 오류 0, 직렬 테스트 31개 전부 PASS, build PASS
- [x] 컨텐츠 서비스 정확히 6종. `editing`은 리다이렉트 규칙·해당 규칙 테스트·변경 이력에만 남음
- [x] 모션그래픽 상세 200·검토 사례 정확히 4작품, 편집 상세 301 → `/content`
- [x] 홈·컨텐츠·소개 서비스 문구 6종 기준 통일
- [x] JSON 18개, 미디어 경로·크기·순서 및 원문 유지, 생성 재실행으로 추가 diff 없음
- [x] 스키마 위반 임시 JSON의 실패 및 제거 확인
- [x] 검토 플래그 켠/끈 두 빌드와 화면 정상, 일반 빌드 고객 작품 비노출·JS 제외, 두 사이트맵 review 제외

## 남은 일과 검증 경계

- P1 구현과 필수 로컬 검증의 미해결 사항은 없다
- 기존 lint 경고 `tests/local-admin.test.mjs:110` 1개는 허용 기준이며 수정 범위 밖이다
- P2 서비스 상세 재디자인과 이후 `/content`·메인 워크플로우 개편은 진행하지 않았다
- 범위 밖 나열 문구는 `scripts/generate-brand-assets.mjs:60`, `scripts/generate-social-v11.mjs:5`, `public/social/video-v09.svg:12`, `public/social/video-v11.svg:1`에 남아 있다. 파일을 수정하거나 생성 스크립트를 실행하지 않았다
- 고객 작품 18개의 공개 권리는 **UNKNOWN/HOLD**다. 권리 확인과 제작 후보 상태 해소, 사람의 공개 승인·배포는 별도다
- Sonnet 독립 검토, 사람 승인, 실제 배포·운영·고객 전달은 **NOT_RUN**이다. 커밋·push·패키지 설치·계정 적용도 실행하지 않았다
