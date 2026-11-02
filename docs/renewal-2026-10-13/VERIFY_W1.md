# W1 독립 검증 — 2026-10-14

대상: 작업트리 미커밋 변경(기준 HEAD `87c39cc`), 검증자 Claude Sonnet. 소스 수정 없음. `RESULT_W1.md`는 참고만 하고 항목마다 직접 재현했다.

## 전체 판정: PASS

네 요구 모두 PASS. 재지시가 필요한 FAIL 0건. 참고 사항(비차단) 4건은 맨 아래에 적었다.

| # | 요구 | 판정 |
|---|---|---|
| 1 | `/content/services/*` 둘째 줄 앵커 내비 제거, 번호 탭 줄 유지 | PASS |
| 2 | `/work` 목록 301 없이 삭제, `/work/[slug]` 유지·뒤로가기는 서비스 페이지, 헤더·llms·sitemap·홈 전체 보기·`/portfolio` 제거 | PASS |
| 3 | 컨텐츠 분과 작업 사례 탭, `/content/work`, `/content/work/[slug]` 301 없이 404, 마케팅·개발 work 유지 | PASS |
| 4 | 서브 내비 타이포·간격 통일 | PASS |

## 실행 환경과 한계

- 메모리 보호: 사용자 미리보기 3213·3214가 이 작업트리의 `.next`로 `next start` 중이라 같은 폴더에서 빌드하면 미리보기가 깨진다. 그래서 소스를 `.qa/w1-verify/build/`로 복사하고(`node_modules`·`public`은 읽기 전용 junction) 거기서 빌드·`next start --port 3215`를 했다. 소스는 동일하다. 검증 후 junction과 복사본은 삭제했고 실제 `node_modules`·`public`은 그대로다. 복사본 빌드에서 "상위 package-lock 감지" 경고가 떴으나 결과에는 영향이 없었다.
- 빌드는 한 번, 검토 플래그 켠 상태: `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1 CIRCLE_NODE_TOTAL=2 NODE_OPTIONS=--max-old-space-size=2048 npm run build`.
- 서버는 3215만 사용하고 종료했다. 종료 후 3215 listener 0, 3213·3214는 그대로 2개 유지. 브라우저는 Playwright 페이지 1개를 순차로 재사용하고 마지막에 닫았다.
- 비밀값 열람·커밋·push·배포·설치 없음. `git status` 항목 수는 시작 때와 같은 26개.

## 명령 검증 (재현)

| 항목 | 결과 | 근거 |
|---|---|---|
| `npm run typecheck` | PASS, exit 0 | `.qa/w1-verify/typecheck.log` |
| `npm run lint` | PASS, 오류 0 · 경고 1(`tests/local-admin.test.mjs:110` 기존) | `lint.log` |
| 직렬 테스트 (`--test-concurrency=1 tests/*.test.mjs`) | PASS, 32건 중 pass 31 · fail 0 · skip 1(로컬 미디어가 릴리스 체크아웃에 없을 때의 파생 파일 검사) | `tests.log` |
| `npm run build` (복사본) | PASS, exit 0, 22/22 정적 페이지. 라우트 표에 `/work` 목록은 없고 `/work/[slug]`만 있음 | `build.log` |
| `tests/seo-http.mjs` (3215, 검토 모드) | PASS, 48페이지 · 내부 링크 164 · 오류 0 | `seo-http.log`, `seo-http.json` |

## 1. 앵커 내비 제거 — PASS

- 서비스 6페이지(webtoon, animation, ai-influencer, motion-graphics, brand-film, ad) HTML에서 `content-service-anchors` 0건.
- 번호 탭 줄(`.guide-service-tabs`)은 6페이지 모두 링크 6개(01~06)로 존재. 히어로의 `#cases` 링크와 `id="scope"`·`id="cases"`는 유지.
- 6페이지 × 1440/768/390/360 = 24회 로드에서 가로 넘침 0, 앵커 0, 탭 6개, `#scope`·`#cases` 존재.

## 2. `/work` 목록 삭제 — PASS

HTTP(3215, 리다이렉트 따라가지 않음):

| 경로 | 결과 |
|---|---|
| `/work`, `/work?page=2`, `/portfolio` | 404, Location 헤더 없음 |
| `/work/yofree-outing-webtoon`, `/work/bwl-store` | 200 (검토 플래그 빌드), noindex |
| `/work/nonexistent` | 404 |

- 등록 작품 18개 `/work/<slug>` 전부 200이고 noindex이며 뒤로가기(`←`) 링크가 서비스 페이지다. 예: webtoon 작품 → `/content/services/webtoon`, bwl-store·bwl-editorial·yofree-shop → `/lab/services/shopping-mall`, healernet-website → `/lab/services/website`, motion 작품 → `/content/services/motion-graphics` 또는 `animation`.
- 서비스 페이지의 사례 카드를 브라우저로 클릭하면 `/work/yofree-outing-webtoon`으로 이동하고 뒤로가기 링크는 `/content/services/webtoon`이다. 상세 안에 `/work` 목록 링크 0.
- 헤더 링크는 홈·컨텐츠·마케팅·개발·문의하기뿐이다. 1440 스크린샷(`shots/home-header-1440.png`), 390 닫힘·열림(`home-header-390.png`, `home-header-390-open.png`) 모두 배치가 자연스럽고 가로 넘침 0. 메뉴 열림 상태도 항목 4개가 정상 정렬.
- `sitemap.xml` 48개 URL에 `/work`·`/portfolio`·`/content/work*` 없음(마케팅·개발 `/marketing/work`, `/lab/work`와 예시 상세는 있음). `llms.txt` 30줄에 `work`·`portfolio`·`레퍼런스` 없음.
- 메인 홈은 `#work` 섹션 카드 6개가 정상 렌더되고 `reference-all`(전체 보기) 링크가 없다. 홈 안의 `/work` 목록·`/content/work`·`/portfolio` href 0. 히어로 CTA는 `#work`.
- `lib/redirects.ts`에서 `/portfolio → /work` 규칙이 삭제되었고 `/portfolio`는 404.

## 3. 컨텐츠 분과 work 삭제 — PASS

| 경로 | 결과 |
|---|---|
| `/content/work` | 404, Location 없음 |
| `/content/work?service=webtoon` | 404 |
| `/content/work/example-webtoon` | 404 |
| `/content/work/yofree-outing-webtoon` | 404 |
| `/marketing/work` | 200 |
| `/lab/work` | 200 |

- 컨텐츠 서브 내비는 `홈 | 서비스 | 인사이트` 3개이고 작업 사례 탭 없음. 마케팅은 `홈|서비스|운영 사례|인사이트`, 개발은 `홈|서비스|레퍼런스|인사이트`로 유지되고 `/work` 링크가 살아 있다.
- 사이트맵·크롤 49페이지(sitemap 48 + `/`) 전체에서 `href="/work"`, `/work?…`, `/content/work…`, `/portfolio…` 0건, 비200 응답 0건.
- 소스 grep(`legacy`·`docs`·`public/reference-review`·`node_modules`·`.next*`·`.qa` 제외): 앱 소스(`app`·`components`·`lib`)에 컨텐츠 분과 `/content/work`·`/work` 목록 href가 없다. 남은 일치는 모두 의도된 것이다. `[division]/work/*`와 `lib/work-catalog.ts`의 `/${division.path}/work/…`는 마케팅·개발용으로 컨텐츠(video)는 `notFound()`로 막혀 있다. `tests/`·`scripts/`의 일치는 404를 단언하는 코드다. `primitives.tsx`의 `guideHref`는 컨텐츠를 `/content`로 보낸다.

## 4. 서브 내비 타이포·간격 — PASS

측정: 3분과 × 5뷰포트 = 15건, 페이지 로드 500ms 안정화 후 측정. 서비스 페이지(`/content/services/webtoon`, `/marketing/services/integrated`, `/lab/services/website`) 기준. 기준선 y는 텍스트 baseline에 맞춘 0×0 inline-block 마커의 하단 y다. 스크린샷은 `shots/nav-<분과>-<폭>.png` 15장.

| 분과 | 폭 | 가로 넘침 | 브랜드 size/weight | 메뉴 size/weight | CTA size/weight | 메뉴↔메뉴 gap | 라벨→첫 메뉴 | 기준선 y (브랜드/메뉴/CTA) | 활성 글자색 / 밑줄색 | nav 높이 |
|---|---|---|---|---|---|---|---|---|---|---|
| content | 1440 | 0 | 15/600 | 14/500 | 14/600 | 24/24 | 969px | 101/101/101 | #fff / rgb(169,155,255) | 53 |
| content | 900 | 0 | 15/600 | 14/500 | 14/600 | 24/24 | 469px | 101/101/101 | 동일 | 53 |
| content | 768 | 0 | 15/600 | 14/500 | 14/600 | 24/24 | 348px | 101/101/101 | 동일 | 53 |
| content | 390 | 0 | 15/600 | 14/500 | 14/600 | 24/24 | 2행(수직 0, 좌 20) | 102/154/102 | 동일 | 105 |
| content | 360 | 0 | 15/600 | 14/500 | 14/600 | 24/24 | 2행(수직 0, 좌 20) | 102/154/102 | 동일 | 105 |
| marketing | 1440 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 928px | 101/101/101 | 동일 | 53 |
| marketing | 900 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 428px | 101/101/101 | 동일 | 53 |
| marketing | 768 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 306px | 101/101/101 | 동일 | 53 |
| marketing | 390 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 2행 | 102/154/102 | 동일 | 105 |
| marketing | 360 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 2행 | 102/154/102 | 동일 | 105 |
| lab | 1440 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 934px | 101/101/101 | 동일 | 53 |
| lab | 900 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 434px | 101/101/101 | 동일 | 53 |
| lab | 768 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 313px | 101/101/101 | 동일 | 53 |
| lab | 390 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 2행 | 102/154/102 | 동일 | 105 |
| lab | 360 | 0 | 15/600 | 14/500 | 14/600 | 24/24/24 | 2행 | 102/154/102 | 동일 | 105 |

- 한글 렌더 글꼴: CDP `CSS.getPlatformFontsForNode`로 브랜드 라벨(컨텐츠·마케팅·개발)이 실제로 쓰는 글꼴은 15건 모두 `Pretendard Variable`뿐이고 시스템 고딕 폴백은 없다. 메뉴 링크도 `Pretendard Variable`. 메뉴·CTA의 computed family는 `pretendard, "pretendard Fallback", sans-serif`. 브랜드 라벨 computed family는 `Unbounded, pretendard, "pretendard Fallback", sans-serif`이며, Unbounded에는 한글 글리프가 없어 한글은 바로 다음 Pretendard로 렌더된다(참고 2).
- 같은 줄(1440/900/768)에서 브랜드·메뉴·CTA 기준선이 101로 같고, 모바일은 브랜드·CTA가 102, 둘째 줄 메뉴가 154로 메뉴끼리 같다. 메뉴 간격은 모든 폭·분과에서 24px, 마지막 메뉴↔CTA는 데스크톱 24px다. 모바일 둘째 줄 메뉴는 좌측 20px에서 시작하고 라벨 행과의 수직 간격은 0.
- 활성 밑줄색은 모든 분과·폭에서 `rgb(169,155,255)`(`--lavender`), 활성 글자색 #fff, 비활성 `rgb(154,154,163)`. 홈·인사이트·마케팅 work 등 다른 하위 페이지 12건(`/content`, `/content/insights`, `/marketing`, `/marketing/work`, `/lab`, `/lab/insights` × 1440/390)도 같은 크기·굵기·간격·밑줄색이었다.
- 가로 넘침: 15건과 하위 페이지 12건 모두 `scrollWidth ≤ innerWidth`.

## 회귀 샘플

- 메인 홈 1440/390: 렌더 정상, 섹션 8개, 깨진 이미지 0, 가로 넘침 0, `#work` 카드 6개.
- 문의 폼: `/contact`(필드 9개, 제출 버튼 "프로젝트 문의 보내기")와 `/content/contact?service=webtoon`(필드 7개) 모두 렌더되고 390px 넘침 0. 빈 값 제출 시 브라우저 검증이 막아 POST 요청 0건(실제 문의는 전송하지 않았다).
- 서비스 페이지 사례 카드 링크: 6개 서비스 모두 `/work/<slug>` 카드가 있고 클릭 이동·뒤로가기 정상(위 2번).
- 검토 게이트: 상세 18개 모두 `noindex`, 응답 헤더 `X-Robots-Tag: noindex, nofollow, noarchive`, sitemap에 `/work/*` 없음.

## 재지시용 FAIL 목록

없음. (파일·줄·현상·기대값을 적을 항목 0건)

## 참고 사항 (비차단, 판단은 조정자)

1. `/video/work`는 기존 `/video → /content` 레거시 규칙으로 301 → `/content/work` → 404가 된다(`lib/redirects.ts:13-14`). 요구한 `/content/work` 자체는 301 없이 404이므로 PASS로 봤다. `/video/work` 별칭까지 곧바로 404로 하고 싶으면 이 규칙에 예외가 필요하다.
2. 브랜드 라벨 computed family의 첫 값이 `Unbounded`다(`components/guide/guide.css` `.guide-subbrand`). 한글 렌더는 Pretendard Variable로 확인했으나, computed 문자열이 Pretendard 우선이어야 한다면 `.guide-subbrand`를 Pretendard로 시작하게 바꾸는 후속이 필요하다. 라틴 문자가 들어갈 경우에만 Unbounded가 쓰인다.
3. 라벨→첫 메뉴 가로 간격은 고정값이 아니다. 메뉴가 CTA 쪽으로 오른쪽 정렬이라 분과별 메뉴 개수에 따라 1440에서 928~969px로 달라진다. 메뉴 간 24px·메뉴↔CTA 24px·기준선은 일관되므로 PASS로 판단했다. 라벨 바로 옆에 메뉴를 붙이는 배치가 의도라면 별도 지시가 필요하다.
4. `README.md:29`에 공개 경로로 `/work`가 적혀 있다(삭제된 경로). 문서 정리 대상이며 코드에는 영향이 없다.

## 증거 파일 (`.qa/w1-verify/`)

`typecheck.log`, `lint.log`, `tests.log`, `build.log`, `server.log`, `seo-http.log`, `seo-http.json`, `html/`(sitemap.xml, llms.txt, 서비스 6페이지 HTML), `shots/`(nav 15장, home-header 3장).
