# VERIFY_FINAL_P2R — 컨텐츠 서브사이트 최종 검증 (BRIEF_P2R 완료 기준 + 서비스 6종 + 공용 변경)

2026-10-14 · 검증: Sonnet(독립, 소스 수정 없음) · 대상: 작업트리 HEAD `65b3be7`(깨끗한 상태) · 환경 `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`
산출물: 이 문서, `.qa/final-verify/`(스크립트·JSON·로그), `.qa/final-verify/shots/`(스크린샷). 서버는 3215만 사용했고 종료했다(3213·3214는 건드리지 않음). 플래그 미설정 빌드는 `.qa/final-verify/src` 복사본(robocopy, `.env.local` 제거, node_modules 정션)에서 했고 검증 후 정션만 `rmdir`로 끊고 복사본을 삭제했다. `git status` 깨끗.

## 종합 판정

**VERDICT: FAIL (경미).** 기능·가격·누수·회귀·모션·문의 흐름은 모두 PASS다. 실패는 (1) AI 인플루언서 계정 운영 문구가 '한 번만'이 아니라 4곳에 나오는 점, (2) 같은 문장이 한 페이지 안에서 되풀이되는 카피 중복, (3) 360·390 히어로 가격 칩 줄바꿈 결함, (4) 브랜드 홍보 영상 히어로 영상에 poster 속성 없음, (5) 서비스별 시각 결함 몇 건이다. 차단급(빌드·가격·누수·회귀) 결함은 없다. 아래 재지시 목록을 처리하면 PASS로 본다.

## 1) 빌드·정적 검사

| 항목 | 결과 | 근거 |
|---|---|---|
| `npm run typecheck` | PASS | exit 0 (`.qa/final-verify/typecheck.log`) |
| `npm run lint` | PASS | 오류 0, 경고 1(기존 `tests/local-admin.test.mjs:110`) |
| 직렬 테스트 | PASS | tests 99 · pass 98 · fail 0 · skipped 1(기존 로컬 미디어 게이트) |
| 빌드(플래그 `1`) | PASS | 라우트 표에 `/content`, `/content/contact`, `/content/services/[service]`(SSG 6경로). 경고 없음 |
| 빌드(플래그 미설정, 복사본) | PASS | 같은 라우트. 경고는 복사본 때문에 생긴 lockfile 두 개 알림뿐 |
| `tests/seo-http.mjs` 플래그 켠 서버 | PASS | 48페이지·내부 링크 162·오류 0(`AIO_QA_REFERENCE_REVIEW=1`, 보고서는 `.qa/` 쪽으로 저장) |
| `tests/seo-http.mjs` 미설정 서버 | PASS | 48페이지·내부 링크 144·오류 0 |

## 2) 페이지 매트릭스

### 2-1. 8페이지 × 5폭(1440·1024·768·390·360, 플래그 켬) — 기계 측정(`matrix-on.json`)
| 항목 | 결과 | 근거 |
|---|---|---|
| 페이지·헤더 가로 넘침 0 | PASS | 40조합 모두 `scrollWidth-innerWidth=0`, 헤더 넘침 0. (장식 요소 `halo`·`glow`·`stage`는 `overflow` 안에서 잘려 문서 넘침 없음) |
| 콘솔 error 0 | PASS | 40조합 모두 0(하이드레이션 포함), 4xx/5xx 응답 0 |
| 깨진 이미지 0 | PASS | 스크롤 후 미로딩 이미지는 (a) 웹툰 리더 안쪽 스크롤 영역의 lazy 컷, (b) `/content` 캐러셀의 숨은 사본뿐. 모두 URL 직접 요청 200, 리더 안에서 스크롤하면 12/12 로드 |
| h1 1개 | PASS | 40조합 모두 1 |
| `.guide-header/.guide-footer/.floating-contact` 0 | PASS | 40조합 모두 0 |
| 영상 poster·재생 | PASS(주의 1) | 영상 24개 중 poster 있고 `play()` 후 `paused=false`·`currentTime>1s`·`readyState 4`. 서버 HTML `autoplay` 속성 0. 주의: 브랜드 홍보 영상 히어로 배경 영상은 `poster` 속성이 없다(아래 이미지가 대신 깔림, 재생 정상) → 재지시 WP-C-1 |
| 움직임 토글 | PASS | 7페이지(문의 제외): 토글 누르면 `CSSAnimation` 전부 paused(애니메이션 후광 1, 모션그래픽 13, SNS 광고 레일 3), `currentTime` 정지 확인, 브랜드 홍보 영상 배경 영상 `paused=true`, 다시 누르면 재개. 라벨 `화면 움직임 멈추기 ↔ 다시 재생`, `aria-pressed` 정상. 모션그래픽은 정지 시 `animation-name:none`(정지 구도) |
| reduced-motion 에뮬레이션 | PASS | 7페이지 모두 실행 중 애니메이션 0, 영상 재생 0, 토글 초기값 pressed |
| 헤더 `AIO MAKE CONTENT STUDIO` 전 폭 표시 | PASS | 라벨 너비 127(≥768)·119(390)·116(360)px, 보임. ≥1180 가로 내비 6개, 그보다 좁으면 `서비스` 시트 6개 + 시작가. 상담 신청 버튼 존재(문의 페이지는 설계상 숨김) |
| 헤더에 메인 사이트 링크 없음 | PASS | 헤더 href는 `/content*`·`#inquiry`뿐 |
| 푸터 `AIO MAKE 홈` 한 개 | PASS | 40조합 모두 1개, 문서 안 `href="/"`는 이 링크뿐 |
| 모바일 하단 바 | PASS | 390×844·360×740: 서비스 6페이지에서 높이 64px, 서비스명 + 시작가가 맞다(웹툰 `웹툰 제작 12컷 10만 원부터`, 애니메이션 30만, AI 10만, 모션그래픽 10만, 브랜드 25만, SNS 25만 원부터). 히어로 CTA(상담 신청·가격 보기)는 바 위에 있어 가려지지 않는다(`coveredByBar:false` 12조합). 홈·문의엔 없음 |
| `/content` 캐러셀 옆 카드 클릭 | PASS | 1440·1024·768: 옆 카드 클릭마다 선택 변경(웹툰→…→SNS), 390·360: 터치 탭으로 변경. URL 이동 0(`framenavigated` 1회뿐), 콘솔 0. 이전/다음 버튼 존재 |
| 캐러셀 키보드 | PASS | 선택된 탭에서 ←/→ 이동, Home/End 동작(5폭 모두) |
| 문의 폼 카드 폭 | PASS | 1440: x=732, 폭 636(7열 시작, 6열 폭), 6페이지 동일 |
| 서비스 미리 선택 | PASS | 6서비스 모두 페이로드 `division:"video"`, `service:<id>`. `이 구성으로 상담` 클릭 시 `희망 구성`이 해당 플랜으로 바뀌고 포커스가 select로 이동(번들 포함). `/api/contact`는 `page.route`로 가로챔(저장 0). `utm_source:p2r` 전달, `landingPath`는 경로만(`/content/services/<id>`). 모의 성공 후 접수 화면 링크 `/content`. honeypot 1×1px·`clip:rect(0)`. `/content/contact?service=webtoon`이 웹툰 라디오를 미리 체크. 미선택 제출 시 요청 0, 안내 `요청 서비스를 하나 골라주세요` |
| 웹툰 12컷 리더 | PASS | 리더 12컷 전부 로드, `role=region`·`tabindex=0`·라벨, ↓/PageDown 키 스크롤 동작(1440·390) |
| AI 인플루언서: 87언니·`AI 가상인물` 표기·성과 주장 없음 | PASS | 87언니 이미지마다 `AI 가상인물 · 연출 예시` 태그, 소개문 `직접 만든 AI 가상인물`. 팔로워·조회수·운영 중·게시 중·성과 표현 0 |
| AI 인플루언서: 계정 운영 별도 견적 **한 번** | **FAIL** | 같은 문장 `계정 게시·운영 및 대량 제작은 별도 견적`이 히어로와 가격 주석에 2번, 포함 범위 `계정 게시와 운영`, FAQ `계정 게시와 운영은 별도 견적으로 안내합니다`까지 4곳 → WP-B-1 |
| SNS 광고: 성과 약속 없음 | PASS | 전환·클릭·매출·ROAS·조회수·효과 표현 0, `광고 집행·계정 운영·매체비는 별도` 문장 원문과 같음 |
| 금지어 정규식(BRIEF 6-1) | PASS | 8페이지 보이는 텍스트에서 `을 통해/를 통해/에 대해/아니라/없이/최고/보장/%/콘텐츠/팔로워/조회수/맞춤 견적/작업 사례` 등 0 |
| 가격 PRICING_FINAL 일치 | PASS | 6서비스 `#pricing` 금액 전부 일치(웹툰 10/18, 모션코믹 7.5/12, 묶음 17.5/30, 애니메이션 30/55, AI 10/30/100, 모션그래픽 10/18/15/27, 브랜드 25/45, SNS 25/45). 금액마다 `부가세 별도`, 수정 문구(기획안 2회·최종안 1회), 대량·정기 별도 문구, 모션그래픽 `맞춤형은 브랜드 전용 캐릭터 제작 서비스 포함.`, AI 주석 2줄, SNS 포함·별도 2줄이 원문과 같다. 허용 금액 집합 밖 숫자 0 |

### 2-2. 플래그 미설정 빌드 — 1440·390 빠른 점검
| 항목 | 결과 | 근거 |
|---|---|---|
| 넘침·콘솔·깨진 이미지·h1 | PASS | 16조합 모두 0·0·0·1 |
| 모션 토글·reduced-motion(1440) | PASS | 평상시 실행 → 토글로 정지 → 재개, reduced 0. 브랜드 홍보 영상 배경 영상 재생·정지·재개 정상 |
| 사례 섹션 | PASS | `data-cs-section="works"` 8페이지 모두 0 |
| 고객 누수 | PASS | 서버 HTML 8개·RSC 응답 8개·`.next/static`에서 `reference-review|BWL|DR's Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-|before-pc` 0건(정적 폴더의 1건은 woff2 바이너리 오탐). `제안용 시안` 0. `87언니`는 AI 인플루언서 페이지에서만 16회(허용) |

## 3) 타이포·시각 품질

| 항목 | 결과 | 근거 |
|---|---|---|
| `.cs-t-*` 역할 일관성 | PASS | 8페이지 × 5폭에서 역할마다 `fontFamily/size/weight/line-height/letter-spacing`이 폭별 한 종류(`typo-on.json`). 값은 BRIEF 5-1 표와 같다(display 86.4px@1440·38px@390, h2 54.72·30, h3 25.92·20, lead 19.44·17, body 16/28, price 37.44·28 등). 같은 역할이 `tabular-nums` 때문에 둘로 갈리는 경우(eyebrow·caption·chip)는 숫자 폭 속성만 다르고 크기·굵기·행간·자간은 같다. `cs-t-lockup`만 자간이 폭에 따라 계산(1.68px→1.11px→0.84px)되는데 WP0FIX 설계대로 폭별 한 값이다 |
| 한글 Pretendard | PASS | 두 폭 × 8페이지에서 CDP로 한글 요소 1,500여 개 검사, 실제 렌더 글꼴 `Pretendard Variable`만 나옴 |
| 왼쪽 정렬(헤더 로고=섹션 머리=푸터) | PASS(주의 1) | 1440·390 모두 로고 left = 콘텐츠 시작 = 푸터 로고 left(72px·20px). 섹션 머리의 eyebrow·h1·h2 left는 로고와 일치. 주의: ≥1024에서 섹션 머리의 `lead`가 오른쪽 열(x=952px)에 놓인다. 이는 `ui/section-head.tsx` 주석(오른쪽 4/12에 lead)대로의 설계지만 BRIEF 9절 정렬 기준('lead left가 로고 left와 1px 이하')과 어긋나고 어느 RESULT에도 예외로 적혀 있지 않다 → 조율자 판단(재지시 SHARED-3) |
| 제목 줄바꿈 | PASS(주의 1) | h1/h2/h3/statement/lead/body의 마지막 줄이 한 글자인 경우 0. 360에서 h1·h2 줄 수 = 데이터 `\n` 수 + 1 모두 일치. 마지막 줄 2글자인 곳: 웹툰 `쓰는 곳에 맞춘 / 웹툰` 1건 → WP-A-4 |
| 겹침·잘림 | PASS | 육안 확인(아래 스크린샷). 대비: 보이는 텍스트 전수 계산에서 기준 미달 0(웹툰 히어로 카드의 흰 글씨 2건은 그라데이션 위라 계산 오탐, 육안으로는 선명) |

스크린샷은 8페이지 × 1440·390 전체(플래그 켬·미설정 각각)와 390×844·360×740 첫 화면을 `.qa/final-verify/shots/`에 저장했고 직접 열어 보았다. 구체 결함(재지시 항목과 번호가 같다):
- 웹툰 1440: '웹툰 + 모션코믹' 섹션에서 영상 왼쪽 열 아래가 약 380px 비어 있고(오른쪽 카드가 길다) 영상 poster가 웹툰 장면이 아니라 `AIO MAKE Studio 웹툰 제작 문의` 로고 엔드카드다. 같은 가격(17.5만·30만·7.5만·12만)이 바로 아래 `제작 가격` 섹션에 다시 나온다 → WP-A-1·2.
- 애니메이션 1440: `움직이기 전에 장면을 맞춥니다` 탭 패널에서 왼쪽 글(01 이야기…)이 패널 중간 높이에 떠 있어 탭과의 간격이 약 230px 비고, 오른쪽 시각은 흰 카드 한가운데 작은 카드 하나뿐이라 휑하다. 히어로 후광 원이 머리 중심이 아니라 눈 위쪽에 걸친다 → WP-A-3·5.
- AI 인플루언서 1440: 캐릭터 시트 섹션에서 오른쪽 열 아래가 약 700px 비어 왼쪽 2×2 사진 카드와 균형이 안 맞는다. 가격 카드 3번째(`세팅 + 이미지 총 20장 + 30초 영상 4편`)가 제목 2줄이라 `100만 원` 기준선이 다른 두 카드보다 아래로 내려간다 → WP-B-2·3.
- 모션그래픽 1440: 같은 `움직이는 메시지` 보라 카드 구도가 히어로·비교 2장·스타일 프레임 2장으로 5번 되풀이된다. 히어로 아래 약 270px 빈 공간 → WP-B-4(경미).
- SNS 광고 1440: 첫 장면 설계 프레임 3개가 3열 칸(416px)에 320px 폭으로 왼쪽에 붙어 오른쪽 여백이 남고, 첫 프레임 위의 흰 막대 2개가 글자 없이 비어 있어 미완성 와이어프레임처럼 보인다 → WP-C-2.
- 공통(모든 서비스) 360·390: 히어로 가격 칩이 3줄로 접히며 줄 머리에 `·` 구분점이 남는다(예: `10만 원부터 / · 캐릭터 1명 세팅 + 이미지 5장 기준 / · 부가세 별도`) → SHARED-1.
- 공통 푸터: `AIO MAKE 홈→` 화살표가 글자에 붙어 있고(간격 0), 이메일이 대문자(`AIOMAKE2023@GMAIL.COM`)로 나온다(메인 푸터와 같은 문자열) → SHARED-4(경미).

## 4) 카피

| 항목 | 결과 | 근거 |
|---|---|---|
| 번역투·`A가 아니라 B`·쉼표 연쇄 | PASS | 8페이지 보이는 텍스트에서 해당 표현 0. 문장당 쉼표 2개 이상 0 |
| 근거 없는 숫자·성과 | PASS | 숫자는 허용 목록과 금액뿐 |
| 서비스명 표기 일관 | PASS | 헤더·시트·푸터·관련 서비스·문의 선택지 모두 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상` |
| 한 페이지 안 중복 문장 | **FAIL** | (a) 수정 정책 `기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다.`가 6서비스 모두 가격 주석과 제작 과정 아래 문장으로 2번, (b) `대량 제작과 정기 제작은 따로 견적을 드립니다.`가 가격 주석과 FAQ 답에 2번, (c) 웹툰: `웹툰을 새로 그리는 비용은 별도입니다`가 2번 + 같은 사실이 세 가지 문장(`기존 웹툰을 영상화하는 가격입니다` / `웹툰 신규 제작은 별도입니다` / `모션코믹 가격은 기존 웹툰을 영상화하는 기준입니다`)으로 → SHARED-2, WP-A-1 |
| 서비스 사이 유사 제목 | 주의 | 웹툰 h1 `브랜드 이야기를 읽히는 컷으로`, 브랜드 홍보 영상 h1 `브랜드 이야기를 한 편에 담습니다`가 같은 구절로 시작한다 → WP-A-6 / WP-C-3(경미) |

## 5) 회귀

| 항목 | 결과 | 근거 |
|---|---|---|
| 메인 사이트 셸 | PASS | `/`, `/about`, `/marketing`, `/lab`, `/marketing/services/integrated`, `/lab/services/website`, `/marketing/contact`, `/lab/contact`, `/content/insights` 모두 200, `.guide-header` 있음·`.cs-site` 없음, 넘침 0, 콘솔 0 |
| 컨텐츠로 가는 새 탭 링크 | PASS | `/`·`/about`·마케팅·개발 페이지의 `/content*` 링크가 모두 `target=_blank rel="noopener noreferrer"`(메인 `/`는 서비스 6개 카드 포함). `/content/insights` 안의 내부 링크는 새 탭 아님(컨텐츠 쪽 링크라 의도대로) |
| 404·301 | PASS | `/content/work` 404, `/work` 404(둘 다 `Location` 없음), `/content/services/editing` 301 → `/content`(기존 동작) |
| 마케팅·개발 work | PASS | `/marketing/work`·`/lab/work` 200, `/work/bwl-store` 200 |

## NOT_RUN
- iOS Safari 인라인 재생·조작 막대, 실제 기기 터치.
- LCP·CLS·`/_next/image` 중복 요청(성능 항목), 클라이언트 이동 후 CSS 누수 비교(`/` → `/content` → 서비스 → `/`), 메인 서버 HTML 기준 커밋 비교. 이번 요청 범위 밖이라 측정하지 않았다.
- 1024·768 폭의 전체 화면 스크린샷 육안 확인(넘침·역할 값·정렬·줄바꿈은 5폭 모두 기계 측정, 육안은 1440·390 전체와 360·768·1024 첫 화면만).
- 타이포 계산값 전수 비교는 플래그 켠 빌드에서만 했다(미설정은 같은 코드라 넘침·콘솔·모션만 확인).

## 재지시 FAIL 목록 (담당별)

### 공용 셸 (WP0/SHARED)
- **SHARED-1** `components/content-site/theme.css:1168-1190`(`.cs-price`, `.cs-price-unit`, `.cs-price-unit + .cs-price-unit::before`) · 증상: 360·390 서비스 히어로 가격 칩이 3줄로 접히며 줄 머리에 `·` 구분점이 남고(`· 부가세 별도`) 칩 모양이 깨진다. 기대: 폭이 좁으면 구분점 없이 줄마다 하나씩 쌓이거나, 구분점이 줄 끝/머리에 오지 않게 처리.
- **SHARED-2** `components/content-site/blocks/process.tsx:41`(`PRICING_COMMON.revisions`)와 `blocks/pricing.tsx:59-60`(`PRICING_COMMON_LINES`) · 증상: 수정 정책 문장이 6서비스 모두 가격 주석과 과정 아래에서 중복. 같은 문장이 FAQ에도 풀어 쓰여 있다. `lib/content-pricing.ts`의 `대량 제작과 정기 제작은 따로 견적을 드립니다.`도 가격 주석과 FAQ에 2번. 기대: 한 페이지에서 같은 문장은 한 곳(가격 주석)에만, 과정 아래 문장은 삭제하거나 다른 정보로 교체.
- **SHARED-3** `components/content-site/ui/section-head.tsx:21-30`, theme.css의 `.cs-head-aside` · 증상: ≥1024에서 섹션 머리의 lead가 로고 left(72px)와 다른 x=952px에 놓여 BRIEF 9절 정렬 기준 불일치(어느 RESULT에도 예외 목록 없음). 기대: 조율자가 의도 설계로 인정하면 BRIEF에 예외로 적기, 아니면 lead를 eyebrow·h2와 같은 왼쪽 선으로.
- **SHARED-4**(경미) `components/content-site/shell/footer.tsx:64`(이메일 대문자), `AIO MAKE 홈` 링크(화살표 간격 0) · 기대: 화살표 `margin-inline-start`, 이메일 소문자 표기(메인 푸터와 맞추려는 의도라면 조율자 확인).

### WP-A (웹툰·애니메이션)
- **WP-A-1** `components/content-site/services/webtoon/landing.tsx:144-186`, `lib/content-site/services/webtoon.ts`(모션코믹 주석·FAQ) · 증상: 모션코믹·묶음 금액이 '웹툰 + 모션코믹' 섹션과 `제작 가격` 섹션에 두 번 나오고, 같은 사실이 세 문장으로 변주되어 반복된다. 기대: 금액은 한 섹션에서만 보이고 설명 문장은 하나.
- **WP-A-2** 같은 섹션 · 증상: 영상 왼쪽 열 아래 약 380px 공백, poster가 로고 엔드카드라 웹툰 내용이 안 보임. 기대: 왼쪽 열에 설명·목록 등을 두어 높이를 맞추거나 오른쪽을 줄임, poster는 영상 속 컷 장면 프레임(신규 생성 금지, 기존 프레임 추출은 허용 여부 조율자 확인).
- **WP-A-3** `components/content-site/services/animation/before-motion.tsx`, `animation.css` · 증상: 탭 패널에서 왼쪽 글이 가운데로 떠 간격이 약 230px 비고 오른쪽 시각이 휑하다(흰 카드에 작은 카드 하나). 기대: 글을 패널 위 기준선에 맞추고 시각 카드를 채우거나 높이 축소.
- **WP-A-4** `lib/content-site/services/webtoon.ts:49`(`쓰는 곳에 맞춘\n웹툰`) · 마지막 줄 2글자. 기대: `쓰는 곳에\n맞춘 웹툰` 등 균형.
- **WP-A-5**(경미) `animation.css`(후광 원 위치) · 후광이 머리 중심이 아니라 눈 위쪽에 걸림. 기대: 머리 중심에 맞춤.
- **WP-A-6**(경미) 웹툰 h1과 브랜드 홍보 영상 h1이 `브랜드 이야기를`로 시작. 기대: 한쪽을 다르게.

### WP-B (AI 인플루언서·모션그래픽)
- **WP-B-1** `lib/content-site/services/ai-influencer.ts:60`(`hero.note`), `:111`(`separate`), `:129`(FAQ), `lib/content-pricing.ts:18` · 증상: 계정 운영 별도 견적이 4곳(히어로·가격 주석에 같은 문장 2번, 범위, FAQ). 기대: 한 번(가격 주석 또는 히어로)만 쓰고 나머지는 삭제. 범위·FAQ 항목은 다른 정보로 교체하거나 `계정 운영`을 `별도 상담`에 이미 있는 항목으로 두고 FAQ는 유지할지 조율자 결정.
- **WP-B-2** `components/content-site/services/ai-influencer/ai-influencer.css`(시트 섹션 격자) · 증상: 시트 섹션 오른쪽 열 아래 약 700px 공백. 기대: 왼쪽 사진 카드 높이에 맞춰 오른쪽을 늘리거나 사진 2×2를 줄임.
- **WP-B-3** `lib/content-site/services/ai-influencer.ts`(플랜 3번째 이름) 또는 `blocks/pricing.tsx` · 증상: 제목이 2줄이라 `100만 원` 기준선이 다른 카드와 어긋남. 기대: 금액 줄을 카드 아래 정렬(grid 행 정렬)하거나 이름을 한 줄로.
- **WP-B-4**(경미) `components/content-site/services/motion-graphics/landing.tsx` · 같은 `움직이는 메시지` 구도가 5번 되풀이. 기대: 비교·스타일 프레임 문구를 서로 다르게.

### WP-C (브랜드 홍보 영상·SNS 광고)
- **WP-C-1** `components/content-site/services/brand-film/landing.tsx:38`(`<CsMedia kind="video" …>`) · 증상: 히어로 배경 영상에 `poster` 속성 없음. 기대: `/content-site/hero.webp`를 poster로 지정(이미 아래층 이미지가 같은 파일이라 이중 요청이 생기지 않게 같은 URL 사용).
- **WP-C-2** `components/content-site/services/ad/ad.css`(첫 장면 설계 프레임), `ad/landing.tsx:96` · 증상: 프레임 3개가 칸에 왼쪽으로 붙어 오른쪽 여백, 첫 프레임의 흰 막대가 글자 없는 와이어프레임처럼 보임. 기대: 칸 가운데 정렬 또는 폭 채움, 막대에 실제 문구 또는 제거.
- **WP-C-3**(경미) h1 `브랜드 이야기를 한 편에 담습니다`가 웹툰 h1과 같은 구절로 시작(WP-A-6과 동일 항목).

### WP-D (/content 홈·문의)
- 재지시 없음. 홈·문의 모두 5폭 넘침 0, 콘솔 0, 캐러셀·키보드·문의 흐름 PASS. 참고: 문의 페이지가 `CONTACT` eyebrow를 위·아래 섹션에서 두 번 쓴다(경미, 필요하면 아래 섹션 eyebrow를 `FORM` 등으로).
