# RESULT P2R WP0 — 컨텐츠 사이트 공통 셸·테마·블록·라우트·테스트

2026-10-14 · 구현: Opus 서브에이전트(WP0) · 기준 HEAD `7711303` · 커밋·push·배포·설치 없음 · `next build`/`dev`·브라우저 실행 안 함(지시)
(BRIEF_P2R 3-2는 결과 파일명을 `RESULT_P2R_WP0.md`로 적었지만 조율자 지시대로 `RESULT_WP0.md`로 썼다.)

**상태: 구현 완료. typecheck PASS, lint 오류 0(기존 경고 1), 직렬 테스트 72개 중 통과 69 · 실패 0 · 건너뜀 1(기존) · todo 2(WP-D 몫, 아래). build·브라우저·HTTP 검사는 NOT_RUN(G0 몫).**

결정 10-1 반영: 헤더 `AIO MAKE | CONTENT STUDIO`, 헤더에는 서비스 6개 + 상담 신청만(메인 링크 없음), 푸터에 `AIO MAKE 홈 →`(`/`) 하나, 벤치마크 AIO 생성 이미지는 `연출 예시` 태그로 사용, 가격은 PRICING_FINAL만(부가세 별도·수정 기준), 고객 사례는 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"`일 때만 서버 전용 선택, `/content/work`는 404 그대로(리다이렉트 없음).

## 1. 변경 파일

### 신규
| 경로 | 내용 |
|---|---|
| `app/(content-site)/content/layout.tsx` | 컨텐츠 셸: Frame(본문 바로가기 → 헤더 → `main#main-content` → 푸터 → 모바일 바 → Reveal) + Organization JSON-LD + `Suspense`/`Analytics`(props는 `(public)/layout.tsx`와 같음). import CSS는 `theme.css` 하나. guide CSS 7종·메인 Header/Footer/FloatingContact/PageNavigation 없음. robots 덮어쓰기 없음 |
| `app/(content-site)/content/page.tsx` | `/content`. 메타 `컨텐츠 대행`·video summary·`/content`(기존과 같음). P3 `<ContentHome/>` 그대로 |
| `app/(content-site)/content/contact/page.tsx` | `/content/contact`. 메타 기존 문자열 그대로. `?service=`가 6종이면 미리 선택 → `<ContentContact/>`(WP-D 스텁) |
| `app/(content-site)/content/services/[service]/page.tsx` | `generateStaticParams`(6종) + `dynamicParams = false`(그 외 404). 메타 `pageMetadata(seo.title, seo.description, path)`. 서버에서 `selectContentWorks(id)` → `<ServiceLanding/>`. JSON-LD 3종(`serviceJsonLd`) |
| `components/content-site/theme.css` | 토큰(글자 16역할·간격·격자·모양·움직임), ink/paper·서비스 강조색, 리셋, 역할 클래스, `.cs-brand`, 레이아웃, 버튼·링크·태그, 미디어, 헤더·시트, 푸터, 모바일 바, 히어로·가격 칩, 공통 블록 전부, InquiryBridge `guide-*`·`.honeypot`, 움직임(토글·reduced-motion), `/content` 홈 임시 다리(아래 3-5) |
| `components/content-site/shell/frame.tsx` (client) | pathname → `data-cs-theme`·`data-cs-service`·`data-cs-page`, `data-motion`, `data-js`. 자동재생 영상(`video[data-cs-autoplay]`) play/pause 일괄 처리. `useCsMotion()` 훅 export |
| `components/content-site/shell/header.tsx` (client) | 로고 잠금(`Brand` import만) → `/content`, ≥1180 서비스 6개(`aria-current` + 2px 막대), <1180 `서비스` 버튼 → 시트(6개 + `startingPrice().line`, Esc·바깥 클릭 닫힘·포커스 복귀·열 때 첫 링크 포커스·↑↓/Home/End). 움직임 토글, `상담 신청`(서비스 `#inquiry`, 홈 `/content/contact`, 문의 페이지 숨김) |
| `components/content-site/shell/footer.tsx` | 항상 ink. 3열(로고+한 줄 / 서비스 6 / 상담 신청·이메일), 사업자 정보(메인과 같은 문자열 4줄), 개인정보처리방침·이용약관·`AIO MAKE 홈 →`·저작권 |
| `components/content-site/shell/mobile-bar.tsx` (client) | <768 서비스 페이지만. 서비스명(caption)/`head`(price-sm) + `상담 신청`→`#inquiry`. `#inquiry` 보이면·가상 키보드(160px) 열리면 `data-hidden`(transform+visibility) |
| `components/content-site/shell/motion-toggle.tsx` (client) | 36×36(터치 44×44), `aria-pressed`, `화면 움직임 멈추기`/`화면 움직임 다시 재생`, reduced-motion 초기값 paused, 저장 안 함 |
| `components/content-site/ui/section-head.tsx` | `CsSectionHead`(eyebrow·h2(id)·lead·aside, ≥1024 7/12 + 4/12) |
| `components/content-site/ui/media.tsx` | `CsMedia`(이미지 `next/image fill`+비율 박스·`sizes` 필수 / 영상 `muted loop playsInline`, `autoplay`는 `data-cs-autoplay`만, 아래층 이미지 `under`) + 태그 |
| `components/content-site/ui/tag.tsx` · `ui/price.tsx` | `CsTag`, `CsPrice`(head `cs-t-price-sm` · 나머지 `cs-t-small`, 단위 사이에서만 줄바꿈) |
| `components/content-site/ui/reveal.tsx` (client) | `CsReveal`: `[data-reveal]` 1회 나타남(IntersectionObserver). JS 없음·reduced-motion이면 처음부터 보임 |
| `components/content-site/blocks/hero.tsx` | `CsHeroCopy`(eyebrow→h1→lead→가격 칩→안내 줄→버튼 2개→facts 3개, 0-2 간격) + `CsHero`(기본 2열 배치, `media`·`backdrop`·`className`) |
| `components/content-site/blocks/types.tsx` | `CsTypes` 3열 카드(장식 번호 + h3 + small) |
| `components/content-site/blocks/pricing.tsx` | `CsPricing`(`id="pricing"`, 웹툰 3묶음 세로, 묶음 `함께 제작` 배지, 금액마다 `부가세 별도`, `a.cs-link[href="#inquiry"][data-plan]`, 공통 주석 3문장 + 서비스 주석) |
| `components/content-site/blocks/process.tsx` · `scope.tsx` · `faq.tsx` · `works.tsx` · `related.tsx` | 4-10 명세대로. FAQ 답 id `cs-faq-<id>-<i>`, works는 `[]`이면 `null` |
| `components/content-site/blocks/inquiry.tsx` (client) | `CsInquiry`(InquiryBridge 감쌈, `division="video"`, `homeHref="/content"`, `homeLabel="컨텐츠 홈으로"`). 필드 순서 고정, `희망 구성` = 그 서비스 플랜 + `아직 정하지 않았어요`, `희망 일정` 3개. `chooser`면 서비스 라디오를 `<form>` 밖에. `[data-plan]` 문서 위임 → 선택·스크롤·포커스 |
| `components/content-site/module.ts` | 서비스 모듈 계약 `ServiceModule { Hero, Signature?, BeforePricing?, worksLayout }` |
| `components/content-site/service-landing.tsx` | 레지스트리 + 고정 순서 조립(hero→types→signature→works→BeforePricing→pricing→process→scope→faq→inquiry→related) |
| `components/content-site/services/<id>/landing.tsx` · `<id>.css` ×6 | 스텁: 기본 `CsHero` + 히어로 이미지 1장(태그 포함, `priority`). CSS는 빈 `.cs-svc-<id> {}` + 규칙 주석 |
| `components/content-site/contact/contact-page.tsx` | WP-D 스텁: 짧은 히어로(h1) + `CsInquiry chooser` |
| `lib/content-pricing.ts` | `content-home.ts`의 가격 블록을 **그대로** 이동 + `PRICING_COMMON`(3문장)·`PRICING_COMMON_LINES`·`pricingPlans(id)`(groups·notes)·`planOptions(id)`. 금액 리터럴은 이 파일에만 |
| `lib/content-site/types.ts` | `ContentServiceId`, `CONTENT_SERVICES`(순서·표기), `isContentServiceId`, `contentServicePath`, `ServiceLandingData`(+ `hero.note?`), `MEDIA_TAGS`, `CONTENT_SITE_ASSETS`, `CsWorkCard`/`CsWorkMedia`/`CsWorksLayout` |
| `lib/content-site/theme-map.ts` | `CS_THEME`, `csRoute(pathname)` 순수 맵 |
| `lib/content-site/copy.ts` | 셸·공통 블록 고정 문구 `CS_COPY`(카피 테스트 대상) |
| `lib/content-site/faq.ts` | 공통 FAQ 3개(0-4 문자열 그대로) |
| `lib/content-site/services/<id>.ts` ×6 | BRIEF_P2R_SERVICES 카피 초안 그대로 채운 데이터(hero·types·process·scope·faq·inquiry·seo). `signature: {}` |
| `lib/content-site/index.ts` | `contentLandings` 집계 + 타입·상수 re-export |
| `lib/content-site/schema.ts` | `serviceJsonLd(id)` → Service(offers: 플랜마다 Offer + `priceSpecification.valueAddedTaxIncluded:false`) · FAQPage(화면 FAQ와 같은 배열) · BreadcrumbList(`/` → `/content` → 서비스) |
| `lib/content-site/works.server.ts` | 첫 줄 `import "server-only";`. `selectContentWorks(id)`(2-5 그대로, 최대 4개, 평범한 객체), 87언니 시안 라벨·slug는 `=== "1"` 게이트 안 |
| `public/content-site/*` 6개 | 벤치마크 자산 복사(2절) |
| `tests/content-site.test.mjs` | 8절 1~9 + 테마 맵·자산 SHA(10) |

### 수정
| 경로 | 변경 |
|---|---|
| `app/(public)/[division]/page.tsx` | `ContentHome` import 삭제, `if (!d \|\| d.id === "video") notFound()` |
| `app/(public)/[division]/services/[service]/page.tsx` | `ContentService`·`contentServicePlans` import 삭제, video면 `notFound()`(메타는 `{}`), video 정렬 분기·description 분기 삭제. 마케팅·개발 출력 식은 그대로(`matching.slice(0, 2)`, `s.description`) |
| `components/guide/inquiry-bridge.tsx` | 선택 prop 2개만: `homeHref`(기본 `"/"`), `homeLabel`(기본 `"홈으로 돌아가기"`). 접수 링크 `{`${homeLabel} →`}`(한 텍스트 노드라 기본값 출력은 이전과 같다) |
| `lib/content-home.ts` | 가격 블록 → `./content-pricing.ts` re-export(`SHOW_STARTING_PRICE`, `contentPricing`, `formatWon`, `startingPrice`, `StartingPrice`), `ContentServiceId`는 `./content-site/types.ts`에서 re-export. 나머지 데이터 그대로 |
| `tests/content-home.test.mjs` | 테스트 7만: 읽는 파일을 `app/(content-site)/content/page.tsx`로(라우트가 옮겨져 이 수정 없이는 실패). 나머지는 WP-D 몫으로 손대지 않음 |
| `tests/seo-http.mjs` | `/content/services/*` 블록: Service offers ≥2(KRW·VAT false)·FAQPage(HTML에 그대로)·BreadcrumbList(`/`,`/content`,path)·`data-cs-section` hero/pricing/process/faq/inquiry·`class="cs-site"`·메인 셸 클래스 0·`autoplay` 속성 0. 하단 블록: `content-service-anchors` 0, `id="pricing"`·`id="inquiry"`, `id="cs-faq-<id>-N"` ≥4. 옛 섹션(fit/uses/quote/cta)·웹툰 12컷 aria 검사 삭제 |
| `scripts/verify-reference-pages.mjs` | 대기 선택자 `.content-service-hero` → `[data-cs-section="hero"]` 한 줄 |

### 삭제
`components/content-service/`(3파일), `lib/content-service-plans.ts`. 삭제 전 grep: 사용처는 위 서비스 라우트뿐이었다.

### 사용처가 없어졌지만 보존(삭제 안 함)
`components/guide/webtoon-devices.tsx`, `webtoon-scope.tsx`(이제 참조 0), `studio-home.jsx`(참조 0), `studio-contact.jsx`(`(public)/[division]/contact/page.tsx`의 도달 불가 video 분기에서만 참조). `(public)/[division]/contact/page.tsx`는 지시대로 수정하지 않음(video 분기 잔존, `/content/contact`는 새 그룹이 처리).

## 2. 자산 복사 (`aio-service-pages-v01/dist/assets` → `public/content-site/`)
MANIFEST.json SHA-256과 복사본 SHA가 모두 같다. 기존 `public/`(reference-review 제외)에 같은 SHA 파일 없음 → 6개 모두 복사.
| 파일 | SHA-256 | 크기 | 표시 태그 |
|---|---|---|---|
| hero.webp | `59790ca5…dfcad02` | 1920×1081 | 연출 예시(추상 유리 곡면) |
| brand.webp | `e238c98e…686ea22` | 900×1350 | 연출 예시(향수 제품) |
| animation.webp | `ac8b9c60…59a4fb6` | 900×1350 | 연출 예시(캐릭터) |
| creator.webp | `9e8aeb3b…a44dc45` | 900×1350 | **AI 가상인물 · 연출 예시** |
| webtoon.webp | `c5f9c0de…f6267bf` | 900×1350 | 그림체 사람 → 쓰면 `AI 가상인물 · 연출 예시` 권장(현재 미사용) |
| brand-motion.mp4 | `1c6f0bbd…e52539` | 656,521B | 연출 예시 · 무음 |
테스트 10이 전체 SHA를 대조한다. 벤치마크 가상 인물 이름·프로필은 쓰지 않았다.

## 3. 결정
1. **서비스 모듈 계약(레지스트리 조립)**: 공통 블록·순서·바탕은 `service-landing.tsx`가 고정하고, 서비스는 `Hero`·`Signature`·`BeforePricing`·`worksLayout`만 낸다(AI 인플루언서 '가격 바로 위 띠'를 위해 `BeforePricing` 슬롯). types는 서비스 공통 형식이라 공통 블록 `CsTypes`로 뺐다(BRIEF 3-1 목록 밖이지만 WP0 소유 경로 안).
2. **서비스 데이터는 스텁이 아니라 명세 카피 초안으로 채웠다.** 일반 테스트(카피·FAQ·SEO)가 6개 파일에 바로 적용되고 G0가 스텁 6페이지를 실제 내용으로 볼 수 있게 하려는 것. `signature`만 비웠다. WP0 수정 1건: 모션그래픽 `seo.description` 끝 `… · 부가세 별도`(마침표 없음) → `…10만 원부터, 부가세 별도.`(마침표 규칙).
3. `ServiceLandingData.hero.note?` 추가(AI 인플루언서 `계정 게시·운영 및 대량 제작은 별도 견적`을 가격 칩 아래 항상 표시). 웹툰은 `startingPrice().note`(모션코믹 옵션 줄)도 칩 아래 표시.
4. 웹툰 가격 주석은 서비스 명세 1-5 문장(`모션코믹은 기존 웹툰을 영상화하는 가격입니다. 웹툰 신규 제작은 별도입니다.`), 나머지 서비스 주석은 PRICING_FINAL 원문.
5. **`/content` 홈 임시 다리**: P3 홈은 W2 역할 클래스(`.t-*`, `.eyebrow`, guide.css의 GuideNav)에 기대는데 컨텐츠 셸은 guide CSS를 로드하지 않는다. `content-home/**`는 고치지 않고 `theme.css` 끝에 `.cs-site .content-home …` 블록으로 `.t-*`→`--cs-t-*` 값 매핑, `--site-header-height: var(--cs-header-h)`, `--service-nav-height: 0`, 메인용 `.guide-subnav` 숨김만 넣었다. **WP-D가 이 블록을 지운다.**
6. 서비스 페이지는 SSG(`generateStaticParams` + `dynamicParams=false`). 6종 밖 id는 404, `/content/services/editing`은 기존 미들웨어 301 그대로.
7. 자동재생은 `ui/media.tsx`를 서버 컴포넌트로 두고 frame이 일괄 처리(공용 client 섬을 BRIEF의 6개로 유지). 서비스 고유 컨트롤(브랜드 영상 일시정지 버튼)은 `useCsMotion()`으로 토글 상태를 읽는다.
8. reduced-motion 리셋은 `.cs-site[data-cs-theme][data-cs-service] *`(명시도 0,3,0)로 `animation: none; transition: none`. 서비스 CSS가 더 강한 선택자로 덮을 수 있으므로 **서비스 애니메이션·트랜지션은 `@media (prefers-reduced-motion: no-preference)` 안에서만 선언**하는 규칙을 스텁 CSS 머리 주석에 적었다.
9. 헤더 시트의 시작가는 `line`(예: `25만 원부터 · 30초 기준 · 부가세 별도`), 하단 바·관련 서비스는 `head`.
10. 문의 select 기본값: `희망 구성` = `아직 정하지 않았어요`, `희망 일정` = `상담 후 정할게요`. 참고 링크는 `type="url"`을 쓰지 않음(브라우저 자체 검증이 InquiryBridge 오류 흐름을 가로막지 않게).

### globals.css 요소 선택자가 `.cs-site`에 주는 값과 처리 (5-3)
| globals.css 규칙 | 처리 |
|---|---|
| `html { scroll-padding-top: 130px }` | `html:has(.cs-site){scroll-padding-top:0}` + `.cs-site [id]{scroll-margin-top: header+16px}` |
| `body { background: ink; line-height:1.65; word-break }` | `.cs-site`가 바탕·글자 기본값 재선언, `body:has(.cs-site)` 바탕 |
| `h1,h2,h3 { line-height 1.18; letter-spacing -0.045em; weight 650 }`, `h1/h2/h3 font-size`, `h1,h2 white-space: pre-line` | `.cs-site :where(h1…h6){font-*: inherit; white-space: normal}` + 모든 제목에 `.cs-t-*` |
| `h1,h2,h3,p { margin:0 }`, `ul { padding-left:22px }` | `.cs-site :where(…)` 리셋 |
| `p { line-height:1.75 }` | 텍스트 p는 모두 역할 클래스, 컨테이너 p는 flex라 영향 없음 |
| `a { color: inherit; text-decoration:none }` | 유지 |
| `button,input,textarea,select { font: inherit }` | 유지 + 입력칸 `--cs-t-body-*` |
| `label { display:grid; gap:9px; font-size:13px; weight 550 }` | `.cs-field-label`(flex, gap 0, `cs-t-label`), `.cs-check`/`.cs-chooser-option` flex |
| `input,select,textarea { width; bg transparent; color: --paper; border; padding 13px 15px; radius 4px }` | `.cs-site .cs-field input/select/textarea` 재선언, 체크박스·라디오 `padding:0` |
| `select option { background: ink }`, `textarea { min-height:140px }` | `.cs-field select option` surface/fg, textarea 160px, `select{color-scheme: 테마}` |
| `*:focus-visible { outline 3px lavender; offset 5px }` | `.cs-site :focus-visible { 3px --cs-focus; offset 3px }` |
| `::selection`, `img { object-fit: cover }`, `button:disabled { opacity .6 }` | selection은 accent로 덮음, 나머지 유지 |
| `.eyebrow`, `.button`, `.container`, `.section`, `.paper`, `.brand` 클래스 | 컨텐츠 사이트는 이 이름을 쓰지 않음(`.brand`는 `.cs-brand .brand`가 0,3,0으로 덮음) |
메인에서 클라이언트 이동으로 들어와 guide CSS가 남아 있는 경우: `fixes.css`의 `select { color-scheme: light }`·`select option`은 위 규칙이 이기고, type.css의 `.t-*`는 InquiryBridge 내부(`.guide-form-note.t-body` 등)에서 `.cs-site .cs-inquiry-card …`(0,3,0) 재선언으로 덮는다.

## 4. 각 WP가 채울 것 (계약)
- **공통 규칙(WP-A/B/C)**: 자기 `lib/content-site/services/<id>.ts`의 `signature`(문자열은 카피 테스트 대상, 제목 키는 `title`/`statement`로 쓰면 줄 길이 검사 적용, 2문장 이상은 문장마다 마침표, 단문 `body`는 마침표)와 `components/content-site/services/<id>/landing.tsx`의 `Hero`(배치 자유. 단 `CsHeroCopy` 사용, 섹션에 `data-cs-section="hero"`·`aria-labelledby="cs-hero-title"`, `priority`는 히어로 미디어 1개), `Signature`(섹션마다 `data-cs-section="signature"`, `aria-labelledby`, `CsSectionHead`), 필요하면 `BeforePricing`. 스타일은 `<id>.css` 한 파일·`.cs-svc-<id>`로 시작·장식색은 첫 블록 `--svc-*`·텍스트 색은 `var(--cs-*)`만·글자 값은 `var(--cs-t-…)`만·애니메이션은 `prefers-reduced-motion: no-preference` 안에서만. 미디어는 `CsMedia`(태그는 `MEDIA_TAGS`), 자산 경로는 파일 상단 상수 한 곳(`CONTENT_SITE_ASSETS` 사용 가능). 고유 client 섬 ≤1(테스트 8). 움직임 토글 연동은 `useCsMotion()`(`@/components/content-site/shell/frame`), 자동재생 배경 영상은 `CsMedia kind="video" autoplay preload="metadata" under={…}`.
- **WP-A 웹툰·애니메이션**: 웹툰 기울어진 표지 히어로(`cut-01`), 세로 리더 `#reader`(CSS만), 웹툰 + 모션코믹(묶음 카드는 `pricingPlans("webtoon").groups[2]`), 애니메이션 배경 캐릭터 히어로 + 후광, '움직이기 전 확인' APG 탭(client 1개).
- **WP-B AI 인플루언서·모션그래픽**: 아치형 인물 카드(`creator.webp`=AI 가상인물 태그), 캐릭터 시트 `#sheet`, `BeforePricing` AI 가상인물 표기 띠, 키네틱 타이포 무대(문자열은 데이터에), 단순형/맞춤형 비교, 스타일 프레임 → 모션.
- **WP-C 브랜드 홍보 영상·SNS 광고**: 전체 배경 영상 히어로(`brand-motion.mp4` + `hero.webp` under, 일시정지 버튼 client 1개), 이야기 순서·길이별 구성, 9:16 콜라주 히어로(레일 24초 루프), 첫 장면 프레임 3개.
- **WP-D `/content` 홈·문의**: `components/content-home/**`를 cs 체계로(`cs-t-*` 치환, `GuideNav` 제거, `content-home.css` 글자 값 `var(--cs-t-…)`, 색 `--cs-*`, 히어로 높이 `calc(100svh - var(--cs-header-h))`), **`theme.css` 끝 '임시 다리' 블록 삭제**(theme.css는 WP0 소유라 조율자 확인 후 WP0 재지시 또는 WP-D에 한 블록 삭제 허용), `tests/content-site.test.mjs`의 todo 2개(`7-1`, `8-1`)에서 `todo` 옵션 제거, `tests/content-home.test.mjs` 새 규칙 반영, `contact/contact-page.tsx` 완성(히어로 확정, 서비스 카드 배치, `PRICING_COMMON` 3줄), `tests/seo-http.mjs`의 `/content`·`/content/contact` 블록.

## 5. 실행한 검증
- `npm run typecheck` → PASS(출력 없음, 최종 상태에서 재실행).
- `npm run lint` → `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110 'options'`).
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` →
  ```
  ℹ tests 72 · pass 69 · fail 0 · skipped 1 · todo 2
  ```
  skipped 1 = 기존 `prepared derivatives exist when local review is requested`. todo 2 = `7-1 CSS: /content 홈`, `8-1 소스: /content 홈은 GuideNav를 쓰지 않는다`(WP-D 완료 전 실패가 정상, 종료 코드 0). 다른 구현자(P4FIX)의 미커밋 파일과 테스트가 작업트리에 함께 있는 상태에서 실행했다.
- `node --check tests/seo-http.mjs`, `node --check scripts/verify-reference-pages.mjs` → 문법 OK.

## 6. NOT_RUN (G0 몫)
- `npm run build` 두 빌드(미설정·`"1"`)와 라우트 표의 `(content-site)` 3경로 확인. **라우트 그룹 충돌 여부(대안 B 필요성)도 빌드 전이라 미확인.**
- 서버 실행 후 라우트 해석: `/content`·`/content/contact`·`/content/services/{6}` 200 + `.cs-site` 셸, `/content/insights`·글 상세 200(메인 셸), `/content/work`·`/content/services/editing` 기존 404·301.
- 마케팅·개발 HTML 동일성, `tests/seo-http.mjs`·`scripts/verify-reference-pages.mjs` 실행, 브라우저(하이드레이션·움직임 토글·시트 키보드·하단 바·`data-plan` 포커스·`.honeypot` 숨김·대비·글자 계산값·누수 grep).

## 7. 소유 범위 밖 필요 변경
- 필수 변경 없음. `components/site-shell.tsx`는 고치지 않았다(대안 B로 가지 않음). 다만 헤더·푸터가 `Brand`를 import하므로 다른 구현자가 `Brand` export 이름·마크업(`span.brand > b + span + i`)을 바꾸면 `.cs-brand .brand` CSS와 어긋난다(현재 그대로임을 확인).
- `components/guide/type.css`의 `.guide-page:not(.content-service)` 선택자 3곳은 클래스가 사라져 의미 없음(무해). guide CSS 정리 때 함께.

## 8. 열린 질문·주의
1. **87언니 누수 목록 충돌**: 결정 10-1은 87언니를 자체 AI 가상인물로 공개 허용하지만 BRIEF_P2R 9절 누수 grep에는 `87언니`가 있다. WP-B가 기본 빌드에 87언니를 쓰면 V의 grep 목록에서 `87언니`를 빼고 `DR's Secret`·`닥터시크릿`·`bwl-` 등 고객 쪽만 남겨야 한다. 카피 테스트는 숫자 검사에서 `87언니` 토큰만 허용한다.
2. 문의 페이지에서 서비스를 고르지 않고 제출하면 InquiryBridge 기존 오류 문구 `… ‘아직 모르겠어요’를 선택할 수 있습니다`가 나오는데 컨텐츠 선택지에는 그 항목이 없다. WP-D가 7번째 선택지를 둘지, InquiryBridge 문구를 바꿀지(소유 밖) 결정 필요.
3. `webtoon.webp`는 그림체 사람이라 쓴다면 `AI 가상인물 · 연출 예시` 태그 권장(현재 미사용).
4. 벤치마크 자산 사용(Q3)은 결정 10-1로 허용. 거절 시 `CONTENT_SITE_ASSETS`와 각 서비스 파일 상단 상수만 바꾸면 된다.
5. 스텁 상태의 서비스 페이지는 히어로가 모두 같은 2열 배치다(WP-A/B/C가 서비스별로 바꾼다). G0의 '서비스 간 차별성'은 이 단계에서 평가 대상이 아니다.
