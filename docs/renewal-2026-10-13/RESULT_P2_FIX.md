# P2 지적사항 수정 결과

- 버전: RESULT_P2_FIX v1 / 2026-10-13
- 판정: **PASS_LOCAL_P2_FIX_SELF_CHECK**
- 작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- 브랜치: `codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- HEAD: `4c62a58bfe0b50f17ba70f4f2f76e9d944f9aa1c` 유지, 기존 P2 미커밋 변경 위에서 수정
- 담당: Codex 구현·자기 점검. 이번 수정의 다른 AI 독립 검토와 사람 승인은 **NOT_RUN**
- Dispatch: `task_8de75cf48af3` / `ctx_6b8e5b40346a`

COMMON.md, BRIEF_P2.md, RESULT_P2.md, VERIFY_P2.md를 읽고 필수 2건과 권장 5건, 지정된 힐러넷 scope를 수정했다. I: 볼륨은 AIO_MAIN_2TB / NTFS / Healthy, 디스크는 TOSHIBA EXTERNAL_USB / Healthy / Online으로 확인했다. 커밋·push·배포·패키지 설치·비밀값 열람·계정 적용은 실행하지 않았다.

## 변경 파일과 결정

| 파일 | 이번 수정 |
| --- | --- |
| `lib/content-service-plans.ts` | `usesTitle`, `caseTitle`, `faqTitle`, `quoteTitle`, `fitTitle` 필드와 6서비스의 고유 제목 추가. AI 인플루언서 프로세스 제목의 의도한 줄바꿈 추가 |
| `components/content-service/content-service.tsx` | 이름에 조사를 붙이는 범용 제목을 plan 필드로 교체. 히어로 상단 라벨을 `AIO MAKE / CONTENT`로 정리. h1의 서비스명·제목 span 사이에 실제 공백 추가. 견적 라벨에 `맞춤 견적` 유지 |
| `components/content-service/content-service.css` | AI 인플루언서 프로세스 제목에 `white-space: pre-line`과 `text-wrap: balance`. 모션그래픽 사례 프레임의 폭·높이 통일 |
| `components/guide/ux.css` | 사용처가 없는 웹툰 소개 규칙 4개와 영상 히어로 규칙 2개 제거. 비어지는 1100px 미디어 블록도 함께 제거 |
| `components/guide/creative.css` | 사용처가 없는 프로세스 제목 규칙 1개 제거 |
| `components/guide/guide.css` | 선택자 목록에서 삭제된 서비스 클래스 한 항목만 제거. 홈·문의 항목 보존 |
| `content/works/healernet-motion.json` | scope의 두 문장을 마침표로 구분하고, 카드의 `아래에서`를 `작품 상세에서`로 수정 |
| `lib/generated/works.generated.ts` | `npm run works:build`로 힐러넷 scope 한 줄 갱신 |
| `docs/renewal-2026-10-13/RESULT_P2_FIX.md` | 이번 결과 기록 |

모션그래픽 사례에만 같은 16:9 프레임을 적용했다. 세로 영상은 기존 1080×1920 크기와 `object-fit: contain`을 유지해 잘라내거나 늘리지 않는다. 히어로, 다른 서비스의 미디어와 그리드 구성은 변경하지 않았다. 같은 프레임 폭을 기준으로 브랜드·상태 라벨이 정렬된다.

힐러넷 scope의 최종 문장은 `30초 가로판과 15초 세로판을 제작했습니다. 두 화면 비율은 작품 상세에서 확인할 수 있습니다.`다. 제작 길이·비율·상태의 의미는 유지했다. `git diff -- content/works lib/generated`에서 JSON과 생성 TS 각각 이 scope 한 줄만 바뀐 것을 확인했고, 비교 스크립트로 다른 필드와 생성물의 나머지 바이트가 같은지 검사했다. 다른 작품 JSON은 변경하지 않았다.

## 실제 검증 명령과 출력

검증 보조 스크립트·로그·JSON·캡처는 gitignore 대상 `.qa/p2-fix/`에 저장했다. 이전 `.qa/p2/`와 `.qa/p2-verify/` 결과는 덮어쓰지 않았다. npm CLI와 테스트는 순서대로 실행했고, 빌드 → 로컬 서버 → 브라우저 검사 → 서버 종료도 검토/공개 모드별로 직렬 실행했다.

| 명령 | 실제 결과 | 증거 |
| --- | --- | --- |
| `npm run works:build` | exit 0 / `works:build PASS — 18 JSON` | 터미널 diff와 `SOURCE_AUDIT.json` |
| `npm run typecheck` | exit 0 / PASS | `typecheck.log` |
| `npm run lint` | exit 0 / 오류 0, 기존 경고 1 | `lint.log` |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | exit 0 / 31 pass, fail 0, skipped 0 | `tests.log` |
| `npm run build`, 검토 플래그 1 | exit 0 / PASS | `build-review.log` |
| `npm run build`, 검토 플래그 0 | exit 0 / PASS | `build-public.log` |
| `node .qa/p2-fix/builds.mjs` | exit 0 / 두 빌드·브라우저·SEO·보존 검사 PASS | `browser-review.log`, `browser-public.log`, `PRESERVATION.json` |
| `node --conditions=react-server --experimental-strip-types tests/seo-http.mjs` | exit 0 / 56페이지, 내부 링크 197개, 공유 이미지 4개, errors 빈 배열 | `seo-http.log`, `SEO_HTTP.json` |
| `node .qa/p2-fix/source-audit.mjs` | exit 0 / 지정 소스 8개만 변경, 원본 자산 91개 보존, 작품 18개 review·권리 미확인 유지 | `SOURCE_AUDIT.json` |
| `git diff --check` | exit 0 / 공백 오류 없음 | 터미널 출력. 기존 파일의 LF/CRLF 안내만 발생 |
| `Get-NetTCPConnection -LocalPort 3261,3262 -State Listen` 집계 | `P2_FIX_LISTENERS=0` | 터미널 출력, 두 `server-*.log`의 `OWNED_SERVER_STOPPED=true` |

테스트에는 `AIO_VERIFY_LOCAL_MEDIA=1`을 전달해 파생 자산 검사도 실행했다. 빌드와 서버에는 `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`를 자식 프로세스 범위에서 전달했다. 검토 서버는 127.0.0.1:3261, 공개 서버는 127.0.0.1:3262이며 dev 서버는 사용하지 않았다. 마지막 `.next`는 플래그를 끈 공개 빌드다.

```text
typecheck: EXIT_CODE=0
lint: 1 problem (0 errors, 1 warning), EXIT_CODE=0
tests: tests 31 / pass 31 / fail 0 / cancelled 0 / skipped 0 / todo 0
tests: duration_ms 18861.9216, EXIT_CODE=0
build-review: code 0
build-public: code 0
review: viewportChecks 24 / interactionChecks 13 / consoleErrors 0 / reviewDetails 18 / PASS
public: viewportChecks 24 / interactionChecks 9 / consoleErrors 0 / reviewDetails 18 / PASS
seo-http: pages 56 / internalLinks 197 / shareImages 4 / errors []
review: serverStopped true / pid 27900
public: serverStopped true / pid 3588
P2_FIX_LISTENERS=0
```

기존 경고는 `tests/local-admin.test.mjs:110`의 미사용 `options`다. 로컬 보조 스크립트 준비 중 문자열 구문 오류와 rg의 일치 0 종료 코드 처리 오류가 있었으며 보조 스크립트를 수정했다. 위 판정은 수정 후 성공한 실제 실행을 기준으로 한다.

## 페이지 텍스트·화면 확인

두 빌드 각각 6개 서비스 × 360/390/768/1440px, 총 48회에서 HTTP 200, h1 1개, 가로 넘침 0, 깨진 이미지 0, 콘솔·런타임 오류 0을 확인했다. 검토 빌드의 h1 6개와 h2 50개를 실제 DOM에서 추출해 모두 읽고 조사 오류가 없음을 확인했다. 웹툰의 h2는 10개, 나머지 서비스는 각각 8개다. 공개 빌드에서는 사례 제목·섹션만 조건부로 숨겨진다. 전체 제목 텍스트는 `.qa/p2-fix/HEADINGS.json`과 두 `browser-*/BROWSER_QA.json`에 있다.

| 서비스 | 실제 h1 textContent | 실제 활용처 h2 |
| --- | --- | --- |
| 웹툰 | 웹툰 브랜드 이야기를 다음 컷이 궁금한 웹툰으로 | 읽는 화면에 맞춰 컷을 배치합니다 |
| 애니메이션 | 애니메이션 멈춰 있던 캐릭터에 장면의 움직임을 더합니다 | 릴스와 본편에 맞춰 장면을 재구성합니다 |
| AI 인플루언서 | AI 인플루언서 같은 얼굴과 말투로 브랜드 이야기를 이어갑니다 | 시리즈를 게시할 채널에 맞춰 인물을 배치합니다 |
| 모션그래픽 | 모션그래픽 제품과 글자가 움직이면 메시지의 순서가 보입니다 | 가로와 세로 화면에 제품과 글자를 다시 배치합니다 |
| 브랜드 홍보 영상 | 브랜드 홍보 영상 브랜드가 시작된 이유를 한 편의 영상에 담습니다 | 홈페이지와 발표, SNS에 맞는 버전을 준비합니다 |
| SNS 광고 영상 | SNS 광고 영상 첫 3초의 메시지부터 매체별 변형 소재까지 | 광고 게재 위치에 맞춰 길이와 비율을 나눕니다 |

상황·사례·활용처·견적·FAQ의 제목은 각각 6페이지에서 고유 문장 6개다. h1 textContent가 서비스명과 각 제목 줄 사이 공백을 포함하는지 DOM 비교로 검증했다. 기존 서비스 탭은 유지하고 히어로 상단의 서비스명 반복만 정리했다.

360px AI 인플루언서 프로세스 제목은 `한 인물의 기준을 정한 뒤,` / `여러 편의 이야기를 만듭니다`로 표시된다. DOM Range에서 `여러`와 `편의`의 top은 둘 다 5806.34375px였다. 해당 제목 캡처 `browser-review/ai-process-360.png`를 직접 열어 확인했다.

모션그래픽 사례의 실제 프레임 높이와 프레임 시작부터 메타 시작까지 거리:

| 화면 폭 | 4개 프레임 높이 | 4개 메타 시작 거리 | 정렬 |
| --- | --- | --- | --- |
| 1440px | 모두 360.28125px | 모두 378.28125px | 같은 행의 상단·메타·상태 라벨 top 동일 |
| 768px | 모두 185.5px | 모두 203.5px | 같은 행의 상단·메타·상태 라벨 top 동일 |
| 390px | 모두 196.875px | 모두 214.875px | 한 열에서 폭·높이·메타 위치 동일 |
| 360px | 모두 180px | 모두 198px | 한 열에서 폭·높이·메타 위치 동일 |

`browser-review/motion-cases-{1440,768,390,360}.png` 네 장을 직접 열어 세로 영상의 비율, 프레임 정렬, 상태 라벨 위치를 확인했다. AI 인플루언서 390px와 모션그래픽 1440px 히어로도 직접 열어 위계를 확인했다. 영상의 `preload="none"`, poster, 크기 지정은 유지하며 실제 재생 시간 증가와 오류 없음을 기존 상호작용 검사에서 확인했다. 헤드리스 캡처 일부에는 네이티브 영상의 초기 로딩 표시가 보이지만 별도의 재생 검사 5종은 모두 통과했다.

## 고아 CSS·기존 변경 보존

제거 전 저장소 검색에서 해당 클래스의 CSS 규칙은 8건, 실제 코드 사용처는 0건이었다. 제거 후 아래 두 검색은 모두 출력 0건이며 rg exit 1은 일치 없음이다.

```powershell
rg -n --glob '*.css' 'webtoon-service-intro|video-service-hero-copy|studio-process-heading|guide-studio-services' .
rg -n --glob '*.{js,jsx,ts,tsx,mjs}' 'webtoon-service-intro|video-service-hero-copy|studio-process-heading|guide-studio-services' .
```

BRIEF·VERIFY 등의 역사적 설명 문서는 보존하므로 클래스 이름에 대한 문서 언급은 남는다. 운영 CSS 선택자와 코드 사용처는 모두 0건이다. 제거 전 규칙과 최종 검색 출력은 `.qa/p2-fix/SOURCE_AUDIT.json`에 기록했다.

수정 전 소스·자산 2,310개를 bytes/SHA-256으로 기록했고 대상 소스 8개를 `.qa/p2-fix/before/`에 복사했다. 최종 비교에서 이 8개 외 2,302개가 동일했다. 기존 P2의 라우트·웹툰 스코프·서비스 데이터·SEO 검사·삭제 상태, COMMON·BRIEF·RESULT_P2·VERIFY_P2는 보존했다. 등록 JSON 18개 중 힐러넷 scope만 변경했고 `public/reference-review/` 원본·파생 자산 91개는 모두 동일하다.

```text
generatedScopeOnlyChange=true
referenceAssetsPreserved=91
reviewRecords=18
rightsUnconfirmed=18
generated SHA-256=f6dd32d5f4288f2e12cd956a49ea67861896424ab0b2ee1f5b8f08ac35783ccf
```

18개 작품의 `visibility:"review"`, `rightsConfirmed:false`, 검토 게이트와 사이트맵 제외를 유지했다. 검토 빌드의 18개 상세는 HTTP 200·noindex, 공개 빌드에서는 404이며 두 사이트맵 모두 해당 작품 0개다. 공개 서비스 페이지는 사례 0개·사례 앵커 없음, 나머지 8섹션 정상이다.

## 남은 일

이번 수정과 지정 로컬 검증의 미해결 사항은 없다. 다음 단계는 조정자가 이번 수정의 독립 검토를 진행하는 것이다. 사람의 페이지·공개 승인, 커밋·push·배포·계정 적용은 이번 작업에서 실행하지 않았다. 고객 작품의 공개 권리는 기존 UNKNOWN/HOLD 상태를 유지한다.
