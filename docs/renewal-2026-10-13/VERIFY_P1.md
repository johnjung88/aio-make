# P1 독립 검증 결과 (VERIFY_P1)

- 버전: VERIFY_P1 v1 / 2026-10-13
- **전체 판정: PASS** (FAIL 0, 아래 NOT_RUN 1건과 참고 사항은 판정에 영향 없음)
- 검증자: Claude Sonnet (읽기 전용). 소스 수정·커밋·push·패키지 설치·배포·비밀값 읽기 없음. 쓴 파일은 이 문서 하나뿐이다.
- 대상: 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`, 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`, 기준 커밋 `db002f7`
- 방법: `RESULT_P1.md`는 믿지 않고 모든 항목을 직접 재실행했다. 임시 파일과 로그는 세션 scratchpad에만 두었고 작업트리의 `git status`는 검증 전후 동일했다.
- 환경: 빌드는 한 번에 하나씩 실행했다. 서버는 `next start -p 3214 -H 127.0.0.1`만 사용했고 두 번 모두 종료 후 3214 리스너 0개를 확인했다. dev 서버는 쓰지 않았다. `.next`는 gitignore 대상이며 마지막 빌드는 검토 플래그를 켠 빌드다.

## 완료 기준 판정 (BRIEF_P1 "완료 기준" 순서)

| # | 완료 기준 | 판정 | 근거 (실행 명령 → 실제 출력 요약) |
| --- | --- | --- | --- |
| 1a | `npm run typecheck` PASS | PASS | `npm run typecheck` → `tsc --noEmit`, exit 0, 출력 없음 |
| 1b | `npm run lint` 오류 0 | PASS | `npm run lint` → exit 0, `✖ 1 problem (0 errors, 1 warning)`. 경고는 기존 `tests/local-admin.test.mjs:110` `'options' is assigned a value but never used` 1건(허용 기준) |
| 1c | 직렬 테스트 전부 PASS | PASS | `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` → exit 0, `tests 31 / pass 30 / fail 0 / skipped 1`. skip 1건은 `prepared derivatives exist when local review is requested`(env `AIO_VERIFY_LOCAL_MEDIA` 없을 때 의도된 skip). 같은 테스트를 `AIO_VERIFY_LOCAL_MEDIA=1`로 `tests/reference-release.test.mjs`에 돌리면 `tests 10 / pass 10 / skipped 0` (로컬 `public/reference-review` 18폴더 존재). 전후 `git status` 동일 |
| 1d | `npm run build` PASS | PASS | 플래그 끔(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=` 빈 값) `npm run build` exit 0. 이어서 플래그 켬(`=1`) `npm run build` exit 0, `✓ Compiled successfully`. 두 빌드 모두 라우트 표 정상 출력 |
| 2a | 컨텐츠 서비스 정확히 6종 | PASS | `lib/content.ts` 서비스 id 순서 `webtoon(L259) animation(L280) ai-influencer(L301) motion-graphics(L322) brand-film(L343) ad(L364)`. 런타임 확인: `divisionServices("video")` → 6개, `services.some(id==="editing")` → false. 표시명 `웹툰 | 애니메이션 | AI 인플루언서 | 모션그래픽 | 브랜드 홍보 영상 | SNS 광고 영상` (BRIEF 표와 일치). 기준 커밋의 `id: "editing"`(db002f7 L364)은 제거됨 |
| 2b | `editing` 문자열이 서비스 코드·문의 폼·테스트에 없음(리다이렉트 제외) | PASS | `grep -rnE "editing\|\"edit\"\|'edit'\|\bedit:\|컨텐츠 편집" app components lib tests scripts content` → 일치 3건뿐. `lib/redirects.ts:14`(리다이렉트 규칙), `tests/domain.test.mjs:130`(리다이렉트 테스트), `components/admin/entries.tsx:166`(관리자 화면 "컨텐츠 편집" = 문서 편집 UI 문구, 서비스와 무관). `primitives.tsx`의 `edit:"editing"`·`editing:"edit"`, `inquiry-bridge.tsx`의 `editing:["편집"]`, `studio-contact.jsx`의 `edit:"편집·클리퍼"`는 모두 제거 확인(`git diff db002f7`). `studio-services.jsx`에 `edit` 키 0건. 오타 `컨텐츠가나` 0건. 옛 표시명 `브랜드 홍보 컨텐츠`·`SNS 광고 컨텐츠`·`AI 인플루언서 컨텐츠`·`편집·클리퍼` 0건 |
| 3a | `/content/services/editing`, `/video/services/editing`, `/ko/video/services/editing` → `/content` 301 | PASS | 코드: `lib/redirects.ts:14` `if (/^\/content\/services\/editing\/?$/i.test(clean)) clean = "/content";` (`/video→/content` 변환 뒤 적용, `/ko` 제거 후 적용). 테스트: `tests/domain.test.mjs:130` 4개 경로(끝 슬래시 포함)를 검증, `retired content service redirects permanently to the content home` PASS. 실제 HTTP(`next start -p 3214`, 플래그 끔·켬 두 번 모두): 세 경로 모두 `301`, Location `http://localhost:3214/content` |
| 3b | 기존 `/video` 레거시 리다이렉트 유지 | PASS | `/video` → 301 `/content`, `/video/work/example-webtoon` → 301 `/content/work/example-webtoon` (HTTP). `legacy locale and service aliases resolve in one step` PASS |
| 3c | `/content/services/motion-graphics` 200, 사례 4작품 매칭(플래그 켠 상태) | PASS | 플래그 켬: HTTP 200, 본문의 `/reference-review/` 경로는 `bwl-brand-motion, healernet-motion, yofree-mg-short, yofree-mg30` 정확히 4개. 플래그 끔: 200, 고객 작품 경로 0개. 다른 서비스 5종도 200 (`webtoon`, `animation`, `ai-influencer`, `brand-film`, `ad`) |
| 4 | 홈·`/content`·소개 서비스 나열 문구 6종 통일 | PASS | 코드: `lib/content.ts:41` summary, `components/guide/main.jsx:39`(FAQ), `main.jsx:400`(홈 Studio 카드), `components/guide/about.jsx:423`, `lib/guide-content.ts:23,32`가 모두 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 및 SNS 광고 영상` 취지. 렌더된 HTML(플래그 끔): `/`·`/content`·`/about` 모두 해당 문구 확인. `/content`에 서비스명 6종 모두 등장(웹툰 8, 애니메이션 11, AI 인플루언서 10, 모션그래픽 7, 브랜드 홍보 영상 4, SNS 광고 영상 10회). 렌더된 페이지 6개에서 `편집` 0건. `llms.txt`에 모션그래픽 항목 포함. 범위 밖(`scripts/generate-*.mjs`, `public/social/*.svg`)은 확인 대상 아님 |
| 5a | `content/works/*.json` 18개 | PASS | `ls content/works \| wc -l` → 18. `works:build PASS — 18 JSON` |
| 5b | 모든 media 경로·순서가 `db002f7` `prepared-work-media.ts`와 동일 | PASS | `git archive db002f7 lib`를 scratchpad에 풀어 기준 `reviewWorks`를 불러오고 현재 `reviewWorks`와 대조: 18작품 모두 `assert.deepStrictEqual(media)` 일치(불일치 0), 미디어 항목 수 55 = 55. 키 순서만 다르고 값은 동일. 현재 배열 순서는 알파벳순이나 `order` 값은 18개 모두 기준과 같고 `order`로 정렬한 슬러그 순서가 기준과 동일(`bwl-brand-motion, yofree-outing-webtoon, bwl-store, healernet-website, yofree-shop, bwl-brand-webtoon, ...`) |
| 5c | 서비스 재배치 4건 | PASS | 같은 스크립트 출력: `bwl-brand-motion brand-film => motion-graphics related [] => [video/brand-film]`, `healernet-motion` 동일, `yofree-mg-short ad => motion-graphics related [] => [video/ad]`, `yofree-mg30` 동일. 이 4건 외 `primaryService` 변경 0건. `relatedServices` 변경 0건(나머지 14작품). `yofree-outing-motion`, `yofree-night-motion`은 animation 유지 |
| 5d | title/description/purpose/scope 원문 보존 | PASS | 같은 스크립트가 18작품의 `id, brand, title, description, purpose, scope, division, productionStatus, visibility, order, canonicalPath`를 기준과 `JSON.stringify`로 비교: 불일치 0 |
| 6a | `npm run works:build` 재실행 시 diff 없음 | PASS | 실행 전후 `lib/generated/works.generated.ts` SHA-256 동일 `5c60dbb2e9a02ba569fa38012ae350281dfa28987952807ec9b52223bb0b7dde`, `git status --short`와 `git diff` 해시 모두 동일. exit 0 (`works:build PASS — 18 JSON`) |
| 6b | 스키마 위반 JSON에서 실패, 확인 후 원복 | PASS | 작업트리를 건드리지 않도록 `content/works` 복사본을 scratchpad에 만들고 `--input-dir <복사본> --output <임시>`로 실행. 5가지 위반이 모두 exit 1과 파일명·필드 오류로 실패: `primaryService: video의 서비스가 아닙니다: editing` / `rightsConfirmed: 공개 작품은 공개 권리 확인이 필요합니다` / `productionStatus: 제작 후보는 공개할 수 없습니다` / `scope: purpose와 scope는 서로 달라야 합니다` / `media.0.poster: 영상은 .webp poster가 필요합니다`. 임시 출력 파일 미생성. 실제 `content/works`는 수정하지 않았으므로 원복 대상이 없고, `git status --short`는 실행 전과 동일(`STATUS_SAME_AFTER_NEG`) |
| 7a | 플래그 끔: `publicWorkCatalog`·sitemap에 review 작품 없음, 화면에 18작품 비노출 | PASS | HTTP(플래그 끔 빌드): `/`, `/content`, `/about`, `/contact`, `/work`, `/content/work`, `/development/work`, `/marketing/work`, 서비스 상세 4종, `/sitemap.xml`, `/llms.txt` 모두 18개 슬러그·`AIO-WORK-` ID·`reference-review/<slug>` 일치 0건. `/work/<18슬러그>` 18개 모두 404. `sitemap.xml` `<loc>` 56개에 review 슬러그 없음. 클라이언트 번들: `.next/static` 전체에서 18개 슬러그 문자열 일치 0건, `AIO-WORK-`·`reference-review` 포함은 가드 코드가 있는 청크 1개(`chunks/480-*.js`, 데이터 아님). 테스트 `unapproved customer references never enter the public catalog or sitemap source`, `public browser data excludes pending customer references with the review flag off` PASS |
| 7b | 플래그 켬: 검토 작품이 화면에만 노출되고 sitemap·공개 카탈로그에서는 제외 | PASS | 플래그 켠 빌드: `/work/<18슬러그>` 18개 모두 200이고 각 본문에 `noindex`. 응답 헤더 `X-Robots-Tag: noindex, nofollow, noarchive`. `/sitemap.xml`에서 `yofree|bwl|healernet` 일치 0건. 서비스 상세별 매칭: motion-graphics 4(위 3c), ad 2(`bwl-brand-ad, bwl-aqua-ad`), brand-film 2(`healernet-motion, bwl-brand-motion`), animation 2(`yofree-outing-motion, yofree-night-motion`), webtoon 2 |
| 8 | 의심 회귀 탐색 | PASS | 아래 "회귀 탐색" 참조. FAIL로 기록할 회귀 없음 |

## 보충 확인

| 항목 | 판정 | 근거 |
| --- | --- | --- |
| 문의 폼 서비스 선택지 | PASS | `studio-contact.jsx`의 선택지 6종 + "아직 모르겠어요". `inquiry-bridge.tsx`의 선택 로직을 실제 `divisionServices("video")`로 재현: `웹툰→webtoon, 애니메이션→animation, AI 인플루언서→ai-influencer, 모션그래픽→motion-graphics, 브랜드 홍보 영상→brand-film, SNS 광고 영상→ad` 6개 모두 기대값과 일치. `?service=motion-graphics` 미리 선택: `guideContactKey("motion-graphics")→"motion"`→`MAP.motion="모션그래픽"` (`primitives.tsx:81-88`, `studio-contact.jsx:57`). 서버 검증(`lib/domain.ts:53,82`)은 `services`와 대조하므로 `editing`은 거부, `motion-graphics`는 허용(테스트 `motion graphics is a valid content inquiry and entry service` PASS). `/content/contact` 200, 옵션에 모션그래픽·브랜드 홍보 영상·SNS 광고 영상 렌더 |
| 서비스 키 매핑 | PASS | `primitives.tsx`(`serviceKeys.motion`, `guideContactKey`), `page.tsx` 키 맵 `"motion-graphics":"motion"`, `studio-services.jsx` `SVC.motion`(L692 `// P2에서 교체` 주석 포함), `studio-home.jsx:33-34` 카드 순서 `모션그래픽 → 브랜드 홍보 영상` |
| 이미지 | PASS | `serviceVisual()`의 motion-graphics는 기존 자산 `/creative-v06/video-brand-film.webp`(파일 존재 확인)를 재사용하고 캡션에 `연출 예시` 표기. 신규 이미지 생성 없음 |
| `lib/prepared-work-media.ts` 삭제 | PASS | `git status`에서 `D lib/prepared-work-media.ts`. 저장소 전체 grep(`prepared-work-media`, `preparedWorkMedia`)에서 코드 참조 0건 |
| `docs/REFERENCES.md` | PASS | `## 새 작품 추가: 5단계`(① 원본/`source` 지정 ② JSON 작성 ③ `works:build -- --media` ④ `npm test` ⑤ `visibility`+`rightsConfirmed` 변경), `## 필드`, `## 더미 JSON` 존재. 5단계 설명에 "제작 후보는 먼저 제작 상태를 확인해야 한다"는 스키마 규칙이 추가돼 있으며 스키마와 일치 |
| 권리·공개 게이트 약화 여부 | PASS | 18작품 모두 `visibility:"review"`, `rightsConfirmed:false` 유지. `lib/work-catalog.ts` `publicWorkCatalog`는 `public && rightsConfirmed`만 반환하고 `제작 후보` 공개 시 예외를 던지는 기존 가드 유지. `displayWorkCatalog`는 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW==="1"`일 때만 review 포함 |
| `git diff --check` | PASS | 공백 오류 없음(LF/CRLF 안내만 출력) |
| 신규 테스트 요구(BRIEF Part B-6) | PASS | ① 스키마 위반 → `works build rejects an invalid temporary JSON...` ② review 제외 → `unapproved customer references never enter...` ③ 4작품 매칭 → `the six content services match the four motion graphics works` ④ editing 리다이렉트 → `retired content service redirects permanently...`. 기존 의미 검증(`bwl-aqua-ad`는 video/ai-influencer 매칭, marketing은 아님)은 `related content is not represented as a marketing operations result`로 유지 |
| `works:build -- --media` 실제 실행 | NOT_RUN | 공개 폴더 `public/reference-review/`에 파일을 쓸 수 있어 읽기 전용 원칙에 따라 실행하지 않았다. 대신 `media preparation creates missing image/video/poster and preserves existing files`(임시 폴더 사용) 테스트가 직렬 전체 실행에서 PASS 했다 |

## 회귀 탐색 (항목 8)

FAIL로 기록할 회귀는 찾지 못했다. 확인한 의심 지점과 결과는 다음과 같다.

- 문의 폼 서비스 선택, 서버 서비스 검증, 사전 선택 `?service=` : 위 보충 확인대로 6종 모두 정상.
- 기존 `/video`, `/ko/video`, `/video/work/*` 리다이렉트: 정상(301). `legacy locale and service aliases resolve in one step` PASS.
- 관리자 화면 서비스 드롭다운(`components/admin/entries.tsx`)은 `divisionServices()`를 사용하므로 6종으로 자동 반영된다.
- 정렬: `reviewWorks` 배열 순서가 기준(메타데이터 순서)과 알파벳순으로 달라졌지만 `order` 값이 18개 모두 같고 화면 정렬은 `order` 기준이므로 외부 동작은 불변.
- 웹툰 24컷 문구 등 P2 범위(`studio-services.jsx`의 `웹툰 제작`, `components/guide/webtoon-*.tsx`의 `웹툰 제작 …`)는 남아 있어도 정상이라는 지시에 따라 FAIL 처리하지 않았다.

## 참고 사항 (판정에 영향 없음, 재지시 불필요)

1. 끝 슬래시가 있는 `/content/services/editing/`은 Next 기본 동작으로 308(`/content/services/editing`) 후 301(`/content`)의 2단 이동이다. RESULT_P1의 "단일 301"은 슬래시 없는 3개 경로 기준으로는 사실이다. 테스트가 슬래시 경로의 최종 목적지를 검증한다.
2. 301 `Location`은 로컬에서 `http://localhost:3214/content`(요청 호스트 기준)로 나온다. 운영 도메인에서의 값은 확인하지 않았다(NOT_RUN). 이 규칙은 기존 `/video` 리다이렉트와 같은 경로를 쓰므로 이번 변경 고유의 문제로 보지 않는다.
3. 기존 DB 데이터에 `service = 'editing'`인 컨텐츠 항목이 있다면 `workFromEntry`가 서비스를 찾지 못하고 설명을 요약문으로 대체하는 폴백을 탄다(오류는 아님). 실제 데이터는 읽지 않았으므로 운영 DB의 `editing` 항목 존재 여부는 NOT_RUN이다. 배포 전 확인을 권한다.
4. `RESULT_P1.md`의 "일반 빌드 JS의 검토 작품 0개" 주장은 독립 재현으로 사실이다(슬러그 문자열 0건).
5. 범위 밖 나열 문구 잔여: `scripts/generate-brand-assets.mjs:60`, `scripts/generate-social-v11.mjs:5`, `public/social/video-v09.svg:12`, `public/social/video-v11.svg:1` (RESULT_P1에 기록돼 있고 BRIEF상 범위 밖이어서 직접 확인하지는 않았다).

## 최종 판정

**PASS.** BRIEF_P1 완료 기준 7개 항목과 검증 지시 (1)~(8)을 모두 직접 재현했고 FAIL은 없다. NOT_RUN은 `works:build -- --media`의 실제 실행 1건이며 관련 테스트가 대신 통과했다. 재지시 사항은 없다.

### FAIL 항목 목록 (재지시용)

없음.
