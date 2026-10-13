# VERIFY_G0 — WP0(컨텐츠 사이트 공통 셸) + P4FIX 게이트 검증

2026-10-14 · 검증: Sonnet(독립, 소스 수정 없음) · 대상: 작업트리 미커밋 상태(HEAD `7711303` 위 WP0 + P4FIX) · 환경 `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`
산출물: 이 문서, `.qa/g0-verify/`(측정 스크립트·JSON·스크린샷·빌드 로그). 서버는 3215만 사용했고 종료했다(3213·3214는 건드리지 않음). 미설정 빌드는 `.qa/g0-verify/src` 스냅샷(robocopy 복사, `.env.local` 제거, node_modules 정션)에서 했고 검증 후 삭제했다.

## 총평

**VERDICT: FAIL** (WP0 재지시 2건이 차단 사유, P4FIX는 PASS)

- WP0: 라우트 그룹 충돌 없음, 셸 분리·새 탭 규칙·가격·문의 페이로드·누수 0은 통과. 그러나 (1) 문의 폼 카드가 1열로 찌그러져 데스크톱에서 폼이 쓸 수 없는 상태, (2) 390·360px에서 헤더 가로 넘침(상담 신청 버튼이 화면 밖으로 잘림)이 있다. 광고 랜딩의 전환 지점이 `#inquiry`이므로 둘 다 WP-A~D 시작 전에 고쳐야 한다.
- P4FIX: 화살표 간격 4px, `#divisions` 제목 정렬, 클라이언트 번들 누수 0 모두 통과.

## 체크별 결과

| # | 항목 | 결과 |
|---|---|---|
| 1 | typecheck · lint · 직렬 테스트 · build · 라우트 충돌 | PASS |
| 2 | 컨텐츠 셸 렌더·헤더·푸터·모바일 바·가격표·문의·404 | FAIL (문의 레이아웃, 모바일 헤더 넘침) / 모션 토글 효과는 일부 NOT_RUN |
| 3 | 새 탭 규칙 | PASS |
| 4 | P4FIX (화살표·카드 제목·누수) | PASS |
| 5 | 타이포·시각 점검 | 타이포 PASS / 시각·넘침 FAIL (2의 두 건과 같은 원인) |
| 6 | 알려진 문제(`아직 모르겠어요`) | 확인됨(결함 유지) |

### 1) 정적 검증·빌드 — PASS
- `npm run typecheck`: exit 0.
- `npm run lint`: `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110`).
- 직렬 테스트: `tests 72 · pass 69 · fail 0 · skipped 1 · todo 2`, exit 0. RESULT_WP0 보고와 같다. todo 2개(`7-1`, `8-1`)는 WP-D 완료 전 실패가 정상(`components/content-home/content-home.tsx`가 아직 `GuideNav`를 import).
- `next build`(`.env.local` 플래그 `=1`) exit 0, 미설정 빌드도 exit 0. 라우트 표에 `/content`(정적), `/content/contact`(동적), `/content/services/[service]`(SSG, 6경로)가 `/[division]`과 함께 나온다. **라우트 그룹 충돌 없음, 대안 B 불필요.**
- HTTP(플래그 켠 빌드): `/content`, `/content/contact`, `/content/contact?service=webtoon`, 서비스 6종 모두 200 + `class="cs-site"`, `guide-header`·`floating-contact`·`guide-footer` 0개. `/content/insights`, `/content/insights/preparation` 200(메인 셸, `guide-header` 있음). `/content/work` 404(Location 없음), `/work` 404, `/content/work/foo` 404, `/content/services/foo` 404, `/content/services/editing` 301 → `/content`. `/`, `/about`, `/marketing`, `/lab`, `/marketing/services/integrated`, `/lab/services/website` 200 + 컨텐츠 셸 클래스 0(마케팅·개발은 메인 셸).
- SEO(미설정 빌드, 참고): 서비스 6페이지 title·description(66~89자)·canonical이 서로 다르고 JSON-LD Service·FAQPage·BreadcrumbList·Organization이 있으며 `robots: index, follow`. 플래그 켠 빌드는 `noindex` + `X-Robots-Tag: noindex, nofollow, noarchive`.

### 2) 컨텐츠 셸 (1440 / 768 / 390 / 360, 8페이지 = `/content` + 서비스 6 + `/content/contact`)
통과한 것:
- 헤더 잠금 `AIO MAKE | CONTENT STUDIO`, 가운데 서비스 6개(웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상) + `상담 신청`(서비스 `#inquiry`, 홈 `/content/contact`, 문의 페이지는 숨김). 메인 사이트 내비 링크 0개. <1180은 `서비스` 시트 버튼: 열면 첫 링크 포커스, Esc로 닫히고 토글로 포커스 복귀, 6개 링크에 시작가 줄(`10만 원부터 · … · 부가세 별도`).
- 푸터: 메인으로 가는 링크는 `AIO MAKE 홈 →`(`/`) 하나뿐(나머지는 `/content/*`, `/privacy`, `/terms`, mailto).
- 모바일 하단 바(390·360 서비스 페이지): `웹툰 / 웹툰 제작 12컷 10만 원부터` 등 서비스명 + 시작가 + `상담 신청`(`#inquiry`), 높이 64px. 실제 스크롤로 `#inquiry`에 들어가면 `data-hidden=true`·`visibility:hidden`이 되고, 문서 끝에서는 다시 보이며 푸터 텍스트를 가리지 않는다(마지막 텍스트 하단 688 < 바 상단 736, 푸터 하단 패딩 112px). 768에서는 `display:none`, `/content`·`/content/contact`에는 없다.
- 가격: 6개 서비스 `#pricing`의 플랜·금액을 `PRICING_FINAL_2026-10-14.md`와 대조해 모두 일치(웹툰 12컷 10만·24컷 18만, 모션코믹 30초 7.5만·60초 12만, 함께 제작 17.5만·30만, 애니메이션 30만·55만, AI 인플루언서 10만·30만·100만 + 주석 2개, 모션그래픽 단순형 10·18만·맞춤형 15·27만 + `맞춤형은 브랜드 전용 캐릭터 제작 서비스 포함.`, 브랜드 홍보영상 25·45만, SNS 광고 25·45만 + 주석 2개). 금액마다 `부가세 별도`, 공통 주석 3문장(`표시 금액은 모두 부가세 별도입니다.` / `기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다.` / `대량 제작과 정기 제작은 따로 견적을 드립니다.`) 있음. `맞춤 견적` 문구 0건. 히어로 가격 칩·시트·관련 서비스의 시작가 일치. 증거: `pricing.json`.
- 문의(Playwright `page.route('**/api/contact')`로 가로채 실제 저장 없음): `/content/services/ad?utm_source=g0` 제출 페이로드 `division:"video"`, `service:"ad"`, `attribution.landingPath:"/content/services/ad"`, `utm:{utm_source:"g0"}`. 웹툰은 `이 구성으로 상담`(bundle-2) 클릭 → `희망 구성` select가 `웹툰 24컷 + 모션코믹 60초`로 바뀌고 select에 포커스, `#inquiry`로 스크롤(top ≈ 100px). AI 인플루언서 plan-3, 모션그래픽 plan-3도 같음. 서비스는 고정(서비스 선택 라디오 없음)이라 `service`가 항상 그 서비스. 접수 화면 링크 `컨텐츠 홈으로 →`(`/content`). `.honeypot` 크기 1×1, `clip: rect(0,0,0,0)`, `left:-10000` 화면에 안 보임. `/content/contact?service=webtoon`은 웹툰 라디오를 미리 선택하고 `희망 구성`이 웹툰 플랜 6개 + `아직 정하지 않았어요`. 라디오는 `<form>` 바깥.
- 서버 HTML에 `autoplay` 속성 0.
- 움직임 토글: 클릭 시 `data-motion` on→paused→on, `aria-pressed`·라벨(`화면 움직임 멈추기`/`화면 움직임 다시 재생`) 정상. reduced-motion 환경에서 초기값 `paused`·`aria-pressed=true`, 실행 중 CSS 애니메이션 0, `video.paused=true`.
- 콘솔 error 0, 깨진 이미지 0, h1 1개: 8페이지 × 4폭(플래그 켠 빌드) 및 미설정 빌드 8페이지 × 1440/390.
- 가로 넘침 0: 1440·768 전 페이지, 390·360의 `/content/contact`.
- 공개 사례: 플래그 켠 빌드 웹툰 서비스에 사례 4개(`BWL · DR's Secret`, `YoFree`). 미설정 빌드는 `[data-cs-section="works"]` 0개.

**실패·미실행:**
- **FAIL WP0-1 문의 폼 레이아웃 붕괴(1440·1024에서 확인, 서비스 6종 공통).** `#inquiry` 폼 카드 폭이 1440px에서 86px, 1024px에서 63px이다(`.cs-inquiry-grid`의 12열 중 한 칸). 입력칸이 73px 폭으로 찌그러져 `희망 구성` 값이 `아…`처럼 잘리고 안내문이 세로로 한 글자 폭으로 흘러내린다(`inq-ad-1440.png`, `full-webtoon-1440.png`). 원인: `components/content-site/blocks/inquiry.tsx:107`의 `className="cs-col-6 cs-col-start-7"`가 `theme.css`의 `.cs-col-6 { grid-column: span 6 }` 뒤에 오는 `.cs-col-start-7 { grid-column-start: 7 }`에 덮여 `grid-column-end`가 auto가 된다(span 소실). 같은 조합이 `components/content-site/ui/section-head.tsx:28`의 `cs-col-4 cs-col-start-9`(aside)에도 있어 `aside`를 쓰는 섹션에서 같은 증상이 난다(현재 사용처 없음, 잠복 결함). 768 이하(1열)는 정상. 수정 방향: `.cs-col-start-N`이 `grid-column: N / span K`로 폭까지 지정하거나 `.cs-col-N.cs-col-start-M`용 규칙을 둔다.
- **FAIL WP0-2 모바일 헤더 가로 넘침.** 390px에서 `scrollWidth 392 > 390`, 360px에서 `392 > 360`(서비스 6페이지 + `/content`; 문의 페이지는 헤더에 CTA가 없어 0). 원인은 헤더 우측 `.cs-header-actions` 폭 232px(서비스 버튼 + 움직임 토글 44px + `상담 신청`)이 로고(`AIO MAKE`)와 합쳐 392px가 되어 `상담 신청`이 오른쪽으로 2px(390) / 32px(360) 밀려나는 것이다(`top-ad-360.png`에서 버튼이 잘림). 같은 이유로 <480에서 `CONTENT STUDIO` 라벨과 구분선을 숨긴다(`theme.css` 872행) → 모바일 헤더에는 `AIO MAKE CONTENT STUDIO` 표기가 나오지 않는다. 수정 방향: <480에서 `서비스` 버튼을 아이콘/짧은 라벨로 줄이거나 gap·패딩을 줄여 합계 폭을 `100vw - 2 × gutter` 이하로. 라벨 숨김은 의도 여부를 조율자가 판단.
- **NOT_RUN(스텁 한계) 모션 토글의 영상·애니메이션 정지 효과.** 현재 스텁에는 `data-cs-autoplay` 영상과 CSS 루프가 없어(서비스 영상은 `controls preload="none"` 사례 영상뿐, `brand-motion.mp4`는 WP-C가 연결) 토글이 실제로 멈출 대상이 없다. WP-A/B/C·V에서 재검증이 필요하다.
- 참고: 1440·390에서 본 `/content` 홈은 임시 다리 블록(`.cs-site .content-home …`) 덕에 컨텐츠 셸 안에서 렌더되지만 히어로 버튼 `서비스 살펴보기`가 얇은 보라 막대로 보인다(WP-D 몫으로 기록만).

### 3) 새 탭 규칙 — PASS (1440, Playwright)
- 메인 `/`: 헤더 `컨텐츠`, 푸터 `컨텐츠`, `#divisions` 컨텐츠 카드(`/content`), 워크플로우 04 단계 `컨텐츠 서비스 전체 보기 →`(`/content`)와 `서비스 자세히 보기 →` 6개(`/content/services/*`) 모두 `target="_blank" rel="noopener noreferrer"`이고 숨김 `(새 탭에서 열림)` span이 있다(보이는 크기 1×1/0×0, 가로 넘침 없음). 헤더 `컨텐츠`를 실제 클릭하면 새 탭이 열리고 원래 탭은 `/`에 남는다. `/about`·`/marketing`·`/lab`·`/marketing/services/integrated`·`/lab/services/website`에서도 헤더·푸터 `컨텐츠`는 새 탭.
- 마케팅·개발 링크: `/marketing`·`/lab`로 가는 링크 중 `target=_blank` 0개(모든 페이지). `_blank`로 열리는 비컨텐츠 링크는 `/privacy` 하나(문의 폼의 개인정보 동의 안내, 기존 동작).
- 컨텐츠 안: `/content`, `/content/services/ad`의 서비스·상담·푸터 링크 전부 같은 탭. `/content/insights`(메인 셸이지만 `/content` 경로)의 헤더·푸터 `컨텐츠`도 같은 탭이다(P4FIX 설계대로).
- 증거: `newtab.json`.

### 4) P4FIX — PASS
- 워크플로우 화살표 간격: `.wj-link` 계산 `column-gap 4px`, 보이는 링크 실측(글자 끝 → 화살표 시작) `상담 신청하기 →` 4px, `작업 자세히 보기 ↗` 4px, `웹사이트 제작 →`·`쇼핑몰 제작 →` 4px(숨은 패널은 측정 불가라 0).
- `#divisions` 카드 제목(`Studio`/`Marketing`/`Lab`) top y: 1440 세 카드 모두 2426, 1024 컨텐츠·마케팅 2113(셋째 카드는 다음 줄이며 카드 상단 대비 오프셋 106 vs 105 → 반올림 차), 768 컨텐츠·마케팅 1848, 같은 줄 카드 간 차 0px. 서비스 목록 시작 y도 같다(1440: 2508 ×3), CTA는 같은 줄에서 모두 2580. 390·360은 세로 1열이라 빈 공간 없음(`divisions-1440.png` 확인).
- 클라이언트 번들 누수(미설정 빌드, `.next/static`): `reference-review|BWL|DR's Secret|닥터시크릿|힐러넷|HEALERNET|Healernet|YoFree|요프리|bwl-|yofree-|healernet-|before-pc` 0건, `works.generated`·`work-catalog` 문자열 0건. `87언니` 0건(WP-B 전이라 아직 안 나옴, 허용 사항이므로 발견돼도 FAIL 아님).
- 서버 HTML·RSC payload(미설정 빌드): `/`, `/about`, `/marketing`, `/lab`, `/marketing/services/integrated`, `/lab/services/website`, `/content`, `/content/contact`, 서비스 6종, `/content/insights`, `/marketing/work`, `/lab/work` HTML 누수 0건. RSC(`RSC: 1` 요청) `/`, `/marketing`, `/lab`, `/content`, `/content/services/{webtoon,ai-influencer}`, `/content/contact` 0건. 미설정 빌드 8페이지 × 1440/390 콘솔 error 0, 깨진 이미지 0, 사례 섹션 0.
- 부수: 메인 `/` 5폭 가로 넘침 0, 콘솔 error 0.

### 5) 타이포·시각
- PASS 글꼴: 8페이지 × 1440·390, 한글이 있는 보이는 요소(페이지당 500~1900 글리프)의 CDP `CSS.getPlatformFontsForNode` 결과가 모두 `Pretendard Variable` 하나.
- PASS 역할 일관성: `.cs-t-*` 14종(button·nav·h3·small·eyebrow·caption·display·lead·price-sm·h2·num·label·price·body) 모두 8페이지·4폭 안에서 `fontSize/lineHeight/letterSpacing/fontWeight/fontFamily` 조합이 폭마다 1종류. 예: 1440 `display 86.4px/96.77px/-3.89px/750`, `h2 54.72px/65.66px/700`, 390 `display 38px/42.56px`, `h2 30px/36px`.
- FAIL 넘침: 위 WP0-2(390·360).
- 스크린샷(직접 열어 봄, `.qa/g0-verify/`): `top-webtoon-1440.png`, `top-webtoon-390.png`, `top-ad-360.png`, `top-home-1440.png`, `top-home-390.png`, `full-webtoon-1440.png`, `full-webtoon-390.png`, `full-home-1440.png`, `full-home-390.png`, `inq-ad-{1440,1024,768,390}.png`, `proc-webtoon-{1440,390}.png`, `divisions-{1440,1024,768}.png`. 소감: 웹툰 서비스는 헤딩·가격 칩·카드 위계가 읽기 쉽고 한글이 고르다. 단 문의 섹션이 깨져 있고(WP0-1), 1440 전체 화면은 스텁 상태라 서비스 간 차별성이 아직 없다(RESULT_WP0 열린 질문 5와 같음). 빠르게 스크롤하면 `[data-reveal]` 항목(과정 단계 등)이 늦게 나타나는 것은 의도된 동작(스크롤하면 나타남, 정지 화면에서 opacity 1 확인).

### 6) 알려진 문제 — 확인됨
`/content/contact`에서 서비스를 고르지 않고 제출하면 오류 문구가 `요청 서비스를 선택해주세요 아직 정하지 않았다면 ‘아직 모르겠어요’를 선택할 수 있습니다`로 나온다(`components/guide/inquiry-bridge.tsx:83`). 컨텐츠 문의 페이지의 서비스 선택 라디오 6개에는 `아직 모르겠어요` 항목이 없다(`희망 구성` select의 `아직 정하지 않았어요`와도 다름). 제출은 막히고 `/api/contact` 요청은 0건. RESULT_WP0 열린 질문 2와 같다.

## 재지시 FAIL 목록

### WP0 (소유: `components/content-site/**`)
1. **WP0-1** `theme.css`의 `.cs-col-start-*`가 `.cs-col-N`의 `span`을 덮어 문의 카드가 1열이 된다. `blocks/inquiry.tsx:107`의 `cs-col-6 cs-col-start-7`을 고치고(`grid-column: 7 / span 6`), `ui/section-head.tsx:28`의 `cs-col-4 cs-col-start-9`도 같은 방식으로 정리. 수정 후 1440·1024·768·390에서 폼 카드 폭(1440 기준 약 6/12 열)과 입력칸 폭을 재측정할 것.
2. **WP0-2** 390·360px 헤더 가로 넘침: `.cs-header-actions` 합계 폭 축소(서비스 버튼·움직임 토글·`상담 신청`) 후 `scrollWidth ≤ innerWidth`, 버튼이 화면 안에 들어오는지 확인. 모바일에서 `CONTENT STUDIO` 라벨을 계속 숨길지 조율자 결정 필요.
3. **WP0-3(낮음, 결정 필요)** 인라인 오류 문구의 `아직 모르겠어요`: `InquiryBridge`는 마케팅·개발과 공유라 소유 밖이다. 컨텐츠에서는 문구를 바꾸는 선택 prop을 추가하거나(예: `unselectedMessage?`) WP-D가 선택지를 두는 방안 중 조율자가 결정.
4. **WP0-4(재검증 필요)** 모션 토글이 실제로 멈추는지는 WP-C 영상·WP-A/B/C 루프가 들어온 뒤 V에서 다시 본다.

### P4FIX
- 재지시 없음(PASS).

### 참고(재지시 아님)
- `/content` 홈 임시 다리 블록과 todo 테스트 2개는 WP-D가 지운다. `/content` 홈 히어로 버튼은 임시 다리에서 얇은 막대로 렌더된다(WP-D 재작업 대상).
- `components/guide/type.css`의 `.guide-page:not(.content-service)` 선택자 잔존은 RESULT_WP0 기록대로 무해.
- 마케팅·개발 서버 HTML의 기준 커밋 대비 바이트 동일성은 이 게이트에서 측정하지 않았다(P4FIX로 메인 `/`가 의도적으로 바뀌어 비교 기준이 달라짐). 마케팅·개발 페이지가 컨텐츠 셸을 쓰지 않고 메인 셸·콘솔 error 0·누수 0임만 확인했다. V 단계 항목.
