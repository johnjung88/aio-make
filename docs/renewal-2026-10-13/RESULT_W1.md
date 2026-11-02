# W1 결과 — 2026-10-14

기준 HEAD `87c39cc`, 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`, dispatch `ctx_559566636f31`.

상태: `PASS_LOCAL_SELF_CHECK` — 요청된 네 변경 및 로컬 인수 기준 완료, 독립 검토·커밋·push·배포는 후속 단계.

## 변경

- 컨텐츠 서비스 6종의 페이지 내 앵커 줄과 해당 CSS 제거, 번호 서비스 탭과 히어로의 `#scope`·`#cases` 유지, 스크롤 추가 여백 80px → 24px
- `/work` 목록 라우트 삭제, 컨텐츠 분과 work 목록·상세는 공용 동적 라우트와 메타데이터에서 즉시 `notFound()` 처리, 301 규칙 추가 없음
- 헤더·홈의 전체 보기·컨텐츠 서브 내비·guideHref·사이트맵·llms.txt 연결 정리, `/portfolio` 리다이렉트 제거
- 등록 작품의 `/work/[slug]` 유지, 상세 breadcrumb·뒤로가기 목적지는 해당 주 서비스 페이지
- 예전 컨텐츠 Entry의 폐기된 상세 주소는 공용 공개 카탈로그에서 제외, 마케팅·개발 Entry 및 18개 등록 작품은 유지
- 서브 내비 타이포와 간격을 guide.css로 통합, 모바일은 브랜드·CTA 첫 줄/메뉴 둘째 줄, breakpoint별 글자 축소 제거, 실제 비율 그대로 아이콘 유지
- 활성 밑줄을 pseudo-element로 이동해 링크 border에 따른 기준선 이동 제거, 활성색은 기존 `--lavender`, 서비스 탭 line-height 20px 명시

18작품의 `visibility: review`·`rightsConfirmed: false`·로컬 검토 플래그·noindex·사이트맵 제외는 유지했다. 서비스 본문·카피·가격·사례 상세 디자인은 변경하지 않았다.

## 실제 검증

| 검증 | 결과 | 근거 |
|---|---|---|
| typecheck | PASS, exit 0 | w1-evidence/typecheck.log |
| lint | PASS, 오류 0·기존 경고 1, 최종 수정 HTTP 검사 파일 별도 lint exit 0 | w1-evidence/lint.log·lint-seo-verified.log |
| 직렬 테스트 | PASS, 32건 중 31 PASS·실패 0·조건부 SKIP 1 | w1-evidence/tests.log |
| build | PASS, exit 0, 22/22 정적 페이지 생성 | w1-evidence/build.log |
| HTTP/SEO 링크 크롤 | PASS, 48페이지·내부 링크 164·공유 이미지 4·오류 0 | w1-evidence/seo-http.json·seo-http.log |
| 폐기 경로 소스 grep | PASS, 고정 링크·앵커 클래스 0건, rg exit 1 | w1-evidence/removed-links-grep.log |
| 서브 내비 화면/computed style | PASS, 3분과 × 5뷰포트 15건, 캡처 15장 직접 열어 확인 | w1-evidence/BROWSER_QA.json·nav-*.png |
| 유지된 작품 상세 | PASS, 18개 `/work/[slug]` 200·noindex·서비스 뒤로가기 | w1-evidence/BROWSER_QA.json |
| 검증 서버 종료 | PASS, 직접 실행한 PID 31020 종료, 포트 3215 listener 없음 | w1-evidence/server-cleanup.log |

첫 typecheck는 기존 `.next`·`.next-dev` 생성 타입이 삭제한 `/work/page`를 참조해 실패했다. 해당 폐기된 생성 파일만 제거하고 `next typegen`으로 라우트 타입을 재생성한 후 통과했다. 초기 실패 출력은 `w1-evidence/typecheck-initial.log`, 재생성 출력은 `w1-evidence/typegen.log`에 보존했다.

직렬 테스트 명령: `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`. 건너뛴 기존 테스트는 로컬 검토 플래그가 켜졌을 때의 미디어 파생 파일 검사다.

빌드 명령은 `npm run build`, 해당 프로세스에만 `CIRCLE_NODE_TOTAL=2`(Next 기본 build worker 1개), `NODE_OPTIONS=--max-old-space-size=2048`, `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`을 적용했다. 비밀값을 열거나 영구 환경변수를 수정하지 않았다.

HTTP 명령은 `AIO_QA_BASE=http://127.0.0.1:3215 AIO_QA_REFERENCE_REVIEW=1 AIO_QA_REPORT=docs/renewal-2026-10-13/w1-evidence/seo-http.json node --conditions=react-server --experimental-strip-types tests/seo-http.mjs`다(Windows에서는 `$env:`로 해당 실행에 설정). 첫 실행은 기존 release 검사 모드가 검토 빌드의 정상적인 noindex·robots 전체 차단을 오류로 판정해 49건 실패했다. release 기본 기대값은 그대로 두고 명시적인 검토 모드에서는 noindex 응답 헤더·메타 및 robots 차단을 검증하게 한 뒤 오류 0으로 통과했다. 초기 출력은 `seo-http-initial.log`·`seo-http-initial.json`에 보존했다. 공개 빌드의 인덱싱/운영 배포 검증은 이번에 실행하지 않았다.

HTTP 검사는 `/work`, `/work?page=2`, `/portfolio`, `/content/work`, `/content/work?service=webtoon`, 기존 컨텐츠 Entry slug 전부와 `/content/work/yofree-outing-webtoon`의 404·Location 헤더 없음·noindex를 확인했다. `/marketing/work`·`/lab/work`는 200을 확인했다. 컨텐츠 6페이지 모두 앵커 클래스 0건·`id="scope"` 유지, 전체 크롤 내부 링크 및 sitemap/llms에서 폐기 경로 0건을 확인했다. `d.path + "/work"` 같은 공용 소스 조각은 컨텐츠를 제외한 마케팅·개발 경로에만 사용되므로 유지했다.

브라우저 명령은 `AIO_QA_BASE=http://127.0.0.1:3215 node scripts/verify-reference-pages.mjs W1 docs/renewal-2026-10-13/w1-evidence --navigation-only`다. 설치된 ego-browser 실행 파일이 없어 기존 로컬 Chrome CDP 검증 스크립트를 사용했다. 브라우저 1개·페이지 1개를 순차 재사용하고 각 검사 후 about:blank로 내려 메모리를 해제했으며 마지막에 Browser.close로 종료했다. 결과 출력은 `{"checks":39,"videoPlayback":0,"result":"PASS"}`다. 이번 범위에서 전체 미디어 재생 검사는 하지 않았다.

실측 근거 SHA-256: `BROWSER_QA.json` = `4C3098B60898CE3F1BBB7203A9E8F214321306CD74352C765EB963B28C3404A4`, `seo-http.json` = `FBAF0D19C4B81E5FD30A1A274D23334B1D7CE30EAA6D8637D8D55A2643D13170`.

### 화면·computed style 실측

대상은 `/content/services/webtoon`, `/marketing/services/integrated`, `/lab/services/website`다. font-family, font-size, font-weight, line-height, gap, padding, 요소 크기, 실제 DOM baseline marker의 좌표를 JSON으로 보존했다.

| 세 분과 공통 뷰포트 | 가로 넘침 | 브랜드/메뉴/CTA 크기 | 컨테이너/메뉴 gap | 브랜드·메뉴·CTA 기준선(y) | 서브 내비 높이 |
|---|---|---|---|---|---|
| 1440 | 0 | 15/14/14px | 24/24px | 101/101/101px | 53px |
| 900 | 0 | 15/14/14px | 24/24px | 101/101/101px | 53px |
| 768 | 0 | 15/14/14px | 24/24px | 101/101/101px | 53px |
| 390 | 0 | 15/14/14px | 24/24px | 102/154/102px | 105px |
| 360 | 0 | 15/14/14px | 24/24px | 102/154/102px | 105px |

브랜드 실측 family는 `Unbounded, pretendard, "pretendard Fallback", sans-serif`, 메뉴·CTA는 `pretendard, "pretendard Fallback", sans-serif`다. 굵기는 600/500/600, line-height는 모두 20px, CTA 높이는 항상 36px, 메뉴 border-bottom은 0px다. 모바일은 메뉴만 다음 줄이라 y가 52px 내려가며 같은 줄의 브랜드·CTA 기준선과 각 메뉴 기준선은 정확히 일치한다. 컨텐츠·개발 아이콘은 20×20px, 기존 마케팅 square는 10×10px로 모든 폭에서 종횡비를 유지했다. 활성 밑줄·서비스 탭 색은 기존 lavender 토큰 `rgb(169, 155, 255)`로 통일됐다. 6종 번호 탭은 유지되며 line-height 20px로 컨텐츠 본문 1.7 상속을 차단했다.

### 변경 파일 (작업자 소유)

- `app/(public)/work/page.tsx` 삭제
- `app/(public)/[division]/work/page.tsx`, `app/(public)/[division]/work/[slug]/page.tsx`
- `app/sitemap.ts`, `app/llms.txt/route.ts`
- `components/content-service/content-service.tsx`, `components/content-service/content-service.css`
- `components/site-shell.tsx`, `components/work-portfolio.tsx`, `components/entries.tsx`
- `components/guide/primitives.tsx`, `components/guide/guide.css`, `components/guide/review.css`, `components/guide/ux.css`, `components/guide/home-references.tsx`, `components/guide/studio-home.jsx`
- `lib/redirects.ts`, `lib/work-catalog.ts`
- `tests/seo-http.mjs`, `tests/reference-release.test.mjs`, `scripts/verify-reference-pages.mjs`
- `docs/renewal-2026-10-13/RESULT_W1.md`, `docs/renewal-2026-10-13/w1-evidence/`의 실제 검증 로그·JSON·캡처

공용 GuideListLayout·EntryList·EntryDetail은 grep으로 마케팅·개발/인사이트에서 계속 사용됨을 확인해 유지하고, 컨텐츠 reference 호출만 notFound로 차단했다. studio-home의 옛 works 값은 사용처가 구조 분해 한 곳뿐이고 렌더에 쓰이지 않아 그 값과 구조 분해만 제거했다.

숨김 Start-Process 서버 명령은 자동 승인 검토가 `blocked by policy`로 거절했고 실제 시작되지 않았다. PTY 생성도 Windows `os error 5`로 실패해 일반 전경 exec 세션으로 서버를 실행했다. 성공한 세션의 단일 PID만 종료했으며 3213·3214는 건드리지 않았다.

검증은 Codex의 로컬 자기 점검이며 다른 AI의 독립 검토가 아니다. 커밋·push·배포·패키지 설치·외부 전달은 수행하지 않았다. 작업 중 이 작업자 외부에서 생긴 `HANDOFF_RESUME.md` 변경과 새 `AUDIT_TYPOGRAPHY.md`·`BRIEF_P3.md`는 이 작업자의 변경 목록에서 제외하고 보존한다.

## 남은 일

요청된 네 변경의 구현·로컬 검증은 완료했다. 서비스별 가이드에 따른 본문 재기획과 다른 AI 검증·커밋은 조정자 후속 단계다.
