# BRIEF P2R — 컨텐츠 서브사이트: `/content` + 서비스 6종 랜딩 전면 재제작

2026-10-14 · 작성: Opus(기획) · 대체 대상: `BRIEF_P2.md`의 컨텐츠 서비스 상세 부분 전체 · 서비스별 상세 명세는 `BRIEF_P2R_SERVICES.md`

> **사용자 방향 (2026-10-14, 원문 취지).** 컨텐츠 서비스 페이지는 기존 aio-make 로고를 제외하고는 기존 페이지를 참고하지 않는다. 서비스 품질과 서비스 특성이 강조되게 전혀 다르게 만든다. 광고 유입 랜딩은 각 서비스 페이지로 연결된다(예: SNS 광고에 관심 있는 고객은 SNS 광고 서비스 페이지로 들어오고, 그 고객은 컨텐츠에만 관심이 있으므로 컨텐츠 서비스만 본다). 그래서 메인 카테고리 '컨텐츠'를 **하나의 별도 사이트처럼 상품화**한다. 이 원리는 이후 개발·마케팅 리뉴얼에도 적용한다. 벤치마킹 시안은 완벽하지 않지만 그 구조를 중심으로 발전시킨다.

먼저 읽는다: `HANDOFF_RESUME.md` → `COMMON.md` → 이 문서 → `BRIEF_P2R_SERVICES.md` → `PRICING_FINAL_2026-10-14.md` → `FACTS_AI_INFLUENCER.md` → `RESULT_P3.md`, `RESULT_FIX_P34.md`(게이트 누수 교훈) → `AUDIT_TYPOGRAPHY.md` 1.2(참고만). 벤치마크(읽기 전용, 실행·복사 금지. 단 아래 6-3의 자산 6개만 복사 허용):
- `I:\00_AIO_CODEX\2026-10-14\aio-make-1-aio-make-https\outputs\aio-service-pages-v01\`(서비스 6종 시안: `source/content.mjs`·`build.mjs`·`style.css`·`app.js`, `HANDOFF.md`, `qa/*.jpg`)
- `I:\00_AIO_CODEX\2026-10-14\aio-make-1-aio-make-https\outputs\service-benchmark-v01\`(레퍼런스 조사: `verification-v01.json`의 서비스별 `flow`·`proposal`·`faq`·`caseSpec`, `AIO_SERVICE_BENCHMARK_v01.html`의 SHARED + DIFFERENT 절, `captures/`)

## 0. COMMON.md와 다른 점 (이 단계에 한해 이 문서가 우선)
| COMMON 규칙 | P2R 적용 |
|---|---|
| 가격은 "맞춤 견적" | 컨텐츠 사이트 전체에 `PRICING_FINAL` 3~9번 금액을 **그대로** 표시한다. `맞춤 견적` 문구 0건. 금액은 새로 만들지 않는다 |
| 사이트 토큰 `--ink --paper --violet --lavender …` 유지 | 컨텐츠 사이트는 **자체 토큰·테마**(`--cs-*`)를 쓴다(사용자 허용). 한글은 Pretendard, 역할마다 규칙 하나 |
| 구현: Codex | 구현: Opus 서브에이전트(작업 패키지별), 검증: Sonnet 서브에이전트 1개(빌드·브라우저 직렬) |
| `git commit` 금지 | 그대로. 커밋은 조율자가 검증 후 한다 |

금지는 COMMON 그대로 유지한다(push·배포·계정·환경변수·패키지 설치·DB 쓰기 금지, `public/reference-review/` 보존, 18작품 공개 권리 HOLD·검토 게이트 약화 금지, 근거 없는 수치·후기·성과 금지).

## 1. 목표와 완료 상태
1. `/content`, `/content/services/{webtoon|animation|ai-influencer|motion-graphics|brand-film|ad}`, `/content/contact`가 **자체 셸(헤더·푸터·모바일 하단 바)을 가진 하나의 제품 사이트**가 된다. 메인 사이트와 공유하는 시각 요소는 AIO MAKE 로고 하나뿐이다.
2. 각 서비스 페이지는 광고 랜딩으로 단독 작동한다: 첫 화면에서 무엇을 만드는지·얼마부터인지·어디로 문의하는지가 보이고, 페이지 안에서 그 서비스가 선택된 상태로 바로 문의할 수 있다.
3. 서비스마다 첫 화면·대표 섹션·미디어 배치가 서비스 특성대로 다르다(벤치마크의 "서비스마다 바꿀 요소"). 공통 블록(가격·과정·FAQ·문의)은 같은 컴포넌트·같은 글자 규칙을 쓴다.
4. 마케팅·개발·메인·회사소개 페이지는 바뀌지 않는다(서버 HTML 비교로 증명).
5. 경로는 그대로다. 새 경로·리다이렉트를 만들지 않고 `/content/work`·`/work` 목록·작업 사례 탭을 되살리지 않는다.

## 2. 아키텍처

### 2-1. 셸 분리 방식: 라우트 그룹 (결정)
- 새 라우트 그룹 `app/(content-site)/content/`를 만들고 그 안에 자체 `layout.tsx`를 둔다. 정적 세그먼트 `content`가 `app/(public)/[division]`보다 우선하므로 `/content`, `/content/contact`, `/content/services/[service]`는 새 그룹이 처리한다. 루트 레이아웃(`app/layout.tsx`: Pretendard·Unbounded 변수, robots)은 공유한다.
- 새 그룹에 **없는** 하위 경로는 계속 `(public)/[division]`이 처리한다: `/content/insights`, `/content/insights/[slug]`(메인 셸 유지), `/content/work`(W1대로 404, `Location` 없음). WP0이 이를 G0 게이트에서 실제로 확인한다.
- 대안 B(라우트 그룹이 빌드 충돌을 일으킬 때만): `(public)/layout.tsx`는 그대로 두고 `Header`·`Footer`·`FloatingContact`·`PageNavigation`이 `usePathname()`으로 `/content`, `/content/services/*`, `/content/contact`에서 `null`을 반환하게 한 뒤 컨텐츠 셸을 페이지 쪽에서 그린다. 대안 B로 갈 때는 WP0이 멈추고 RESULT에 충돌 로그를 적어 조율자 확인을 받는다.

### 2-2. 새 레이아웃 `app/(content-site)/content/layout.tsx`
- import: `@/components/content-site/theme.css`(이 사이트 유일한 전역 CSS). `(public)/layout.tsx`의 guide CSS 7종은 **import하지 않는다**.
- 구성: 본문 바로가기 링크 → `<ContentSiteFrame>`(client, 아래) 안에 `<ContentSiteHeader/>` · `<main id="main-content">{children}</main>` · `<ContentSiteFooter/>` · `<ContentMobileBar/>` → `<JsonLd data={organizationSchema}/>` → `<Suspense fallback={null}><Analytics …/></Suspense>`(props는 `(public)/layout.tsx`와 똑같이). Analytics는 광고 랜딩의 `aio_renewal_landing`·`aio_renewal_utm` 기록과 `page_view`를 담당하므로 반드시 포함한다.
- `FloatingContact`, `PageNavigation`, 메인 `Header`·`Footer`는 쓰지 않는다.
- `robots` 메타를 덮어쓰지 않는다(루트의 `indexable` 규칙을 그대로 따른다).

### 2-3. 라우트 파일
| 파일 | 내용 |
|---|---|
| `app/(content-site)/content/page.tsx` | `generateMetadata`는 기존과 같은 값(`컨텐츠 대행`, video `summary`, `/content`). `<ContentHome/>` 렌더(WP-D가 셸에 맞게 재스타일) |
| `app/(content-site)/content/services/[service]/page.tsx` | id가 6종이 아니면 `notFound()`. `generateMetadata`는 `contentLandings[id].seo`로 `pageMetadata(title, description, path)`. 서버에서 `selectContentWorks(id)`(아래 2-5)로 사례를 고른 뒤 `<ServiceLanding id works/>` 렌더. JSON-LD 3종(Service+offers, FAQPage, BreadcrumbList)을 데이터 파일 한 곳에서 생성 |
| `app/(content-site)/content/contact/page.tsx` | 기존 메타(`컨텐츠 문의`) 유지. `searchParams.service`가 6종 중 하나면 미리 선택. `<ContentContact service/>`(WP-D) 렌더 |
| `app/(public)/[division]/services/[service]/page.tsx` | **video 분기만 제거**(이제 도달 불가): `ContentService`·`contentServicePlans` import 삭제, `d.id === "video"`이면 `notFound()`. 마케팅·개발 출력은 그대로 |
| `app/(public)/[division]/page.tsx` | video 분기를 `notFound()`로 바꾸고 `ContentHome` import 삭제. 다른 분과 그대로 |
| `app/(public)/[division]/contact/page.tsx` | **수정하지 않는다**(video 분기는 도달 불가가 되지만 마케팅·개발 위험을 피한다. RESULT에 잔존으로 기록) |

### 2-4. 삭제·유지
- 삭제: `components/content-service/`(3파일), `lib/content-service-plans.ts`. 다른 import가 없음을 grep으로 확인했다(2026-10-14: 위 서비스 페이지 라우트만 사용).
- 유지(수정 금지): `components/guide/service-navigation.tsx`, `primitives.tsx`의 `GuideNav`·`ServiceTabs`(마케팅·개발 상세와 `/content/insights`가 계속 쓴다).
- 사용처가 없어지는 파일(삭제하지 않고 RESULT에 목록만): `components/guide/webtoon-devices.tsx`, `webtoon-scope.tsx`, `studio-home.jsx`, `studio-contact.jsx`(죽은 video 분기에서만 참조).
- `lib/content-pricing.ts` 신설: `lib/content-home.ts` 하단의 `SHOW_STARTING_PRICE`·`contentPricing`·`formatWon`·`StartingPrice`·`startingPrice`를 **그대로 옮기고**, `lib/content-home.ts`는 같은 이름을 re-export한다(기존 테스트·import 유지). 여기에 `pricingPlans(id)`(가격표 블록·JSON-LD offers용, 웹툰은 웹툰 제작 + 모션코믹 + 함께 제작 묶음)와 `PRICING_COMMON`(부가세 별도, 수정 기준 2개 문장, 대량·정기 별도 견적)을 추가한다. 금액 리터럴은 이 파일에만 있다.

### 2-5. 고객 데이터 경계 (RESULT_FIX_P34 교훈 적용)
- `lib/content-site/works.server.ts`: 첫 줄 `import "server-only";`. `selectContentWorks(id)` = `displayWorkCatalog(mergeGuideEntries(await publicEntries("reference","video"),"reference","video"))` → `workMatchesService(work, id, "video")` → `media.length > 0` → `productionStatus !== "제작 예시"` → 서비스별 정렬(웹툰은 `media[0].kind === "webtoon"` 우선, 그 외는 video 우선) → 최대 4개. 결과를 **직렬화 가능한 평범한 객체**(`CsWorkCard`: slug, brand, title, scope, label, href, media[])로 변환해 반환한다.
- 라벨 규칙도 이 파일에만 둔다: `bwl-aqua-ad`·`bwl-cplus-ad`·`bwl-cleanser-ad`는 어느 페이지에서든 `87언니(AI 가상인물) 출연 · 제안용 시안`, 그 외는 `productionStatus`.
- `"use client"` 파일은 `@/lib/work-catalog`, `@/lib/generated/*`, `@/lib/home-journey-data`, `works.server`를 값으로 import하지 않는다(테스트 grep). 사례는 서버 컴포넌트 `CsWorks`가 그리고, 클라이언트가 필요하면 선택된 카드만 props로 받는다.
- 플래그 미설정·`0` 빌드에서는 18작품이 모두 `review`라 사례 섹션이 렌더되지 않는다(빈 자리·제목도 없음). 검토 빌드(`"1"`)에서만 보인다. 사례 상세 링크는 기존 `/work/{slug}`(메인 셸)를 그대로 쓴다.

## 3. 파일 소유와 작업 패키지

### 3-1. 디렉터리 구조 (WP0이 만든다)
```
app/(content-site)/content/layout.tsx · page.tsx · contact/page.tsx · services/[service]/page.tsx
components/content-site/
  theme.css                       ← 토큰·역할 클래스·리셋·셸·공통 블록 스타일 (WP0 전용)
  shell/frame.tsx (client)        ← pathname → data-cs-theme / data-cs-service
  shell/header.tsx (client) · shell/footer.tsx · shell/mobile-bar.tsx (client) · shell/motion-toggle.tsx (client)
  ui/section-head.tsx · ui/media.tsx · ui/tag.tsx · ui/price.tsx · ui/reveal.tsx (client)
  blocks/pricing.tsx · process.tsx · scope.tsx · faq.tsx · inquiry.tsx (client) · works.tsx · related.tsx
  service-landing.tsx             ← id → 서비스 컴포넌트 레지스트리 (WP0 전용, 이후 수정 금지)
  services/<id>/landing.tsx · services/<id>/<id>.css   ← WP0은 스텁만, 이후 각 WP 소유
  contact/contact-page.tsx        ← WP0은 스텁만, 이후 WP-D 소유
lib/content-pricing.ts · lib/content-site/types.ts · theme-map.ts · works.server.ts · index.ts(contentLandings 집계)
lib/content-site/services/<id>.ts ← WP0은 스텁만, 이후 각 WP 소유
public/content-site/              ← 벤치마크 자산 6개 복사(6-3)
tests/content-site.test.mjs       ← WP0 (6개 데이터 파일을 반복 검사하는 일반 테스트)
```

### 3-2. 작업 패키지
| WP | 담당 | 소유 파일(이 목록 밖 수정 금지) | 시작 조건 |
|---|---|---|---|
| **WP0** 공통 셸·테마·블록 | Opus 1 | 위 3-1에서 `services/<id>/*`·`contact/*`·`lib/content-site/services/*`의 **스텁 생성까지**, 2-3 라우트 4개와 `(public)` 파일 2개의 video 분기 제거, 2-4 삭제·`lib/content-pricing.ts`·`lib/content-home.ts` 가격 블록 이동(re-export만), `components/guide/inquiry-bridge.tsx`의 선택 prop 2개 추가(4-9), `public/content-site/*`, `tests/content-site.test.mjs`, `tests/seo-http.mjs`의 `/content/services/*` 검사 블록, `scripts/verify-reference-pages.mjs`의 대기 선택자 한 줄 | P3·P4 검증 통과·커밋 완료 |
| **G0** 게이트 | Sonnet 검증 1 | 읽기·실행만 | WP0 완료 |
| **WP-A** 웹툰 + 애니메이션 | Opus 1 | `lib/content-site/services/webtoon.ts`·`animation.ts`, `components/content-site/services/webtoon/**`·`animation/**` | G0 PASS |
| **WP-B** AI 인플루언서 + 모션그래픽 | Opus 1 | `lib/content-site/services/ai-influencer.ts`·`motion-graphics.ts`, `components/content-site/services/ai-influencer/**`·`motion-graphics/**` | G0 PASS |
| **WP-C** 브랜드 홍보 영상 + SNS 광고 영상 | Opus 1 | `lib/content-site/services/brand-film.ts`·`ad.ts`, `components/content-site/services/brand-film/**`·`ad/**` | G0 PASS |
| **WP-D** `/content` 홈 정렬 + 문의 페이지 | Opus 1 | `components/content-home/**`, `lib/content-home.ts`(WP0 이후), `tests/content-home.test.mjs`, `components/content-site/contact/**`, `tests/seo-http.mjs`의 `/content`·`/content/contact` 블록 | G0 PASS |
| **V** 최종 검증 | Sonnet 1 | 읽기·실행만 → `VERIFY_P2R.md` | A~D 완료 |

- WP-A~D는 **동시에** 돈다. 서로의 파일, `theme.css`, `shell/`·`ui/`·`blocks/`, 레지스트리, 라우트, 테스트 공용부를 고치지 않는다. 공용 블록 결함·토큰 추가가 필요하면 고치지 말고 자기 RESULT의 "WP0 요청"에 적는다(조율자가 WP0에 재지시).
- 서비스 고유 스타일은 `services/<id>/<id>.css` 한 파일, 선택자는 모두 `.cs-svc-<id>`로 시작한다.
- 구현자(WP0 포함)는 `npm run build`·서버·브라우저를 실행하지 않는다(메모리·`.next` 공유). 허용: `npm run typecheck`, `npm run lint`, `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-site.test.mjs`(WP-D는 `content-home.test.mjs`도). 동시에 typecheck를 돌리다 메모리 오류가 나면 재시도 한 번 후 NOT_RUN으로 적는다.
- 결과 문서: `RESULT_P2R_WP0.md`, `RESULT_P2R_A.md`, `RESULT_P2R_B.md`, `RESULT_P2R_C.md`, `RESULT_P2R_D.md`. 변경 파일, 결정, 카피 최종본과 humanizer 점검, 실행한 명령과 결과(미실행은 NOT_RUN), "WP0 요청", 열린 질문.

### 3-3. 순서
1. 선행: P3+P4(+W2 수정) 검증 PASS·커밋. 작업트리가 깨끗한지 `git status`로 확인한다. 미커밋 변경이 있으면 WP0은 시작하지 않는다.
2. WP0 → G0(Sonnet: typecheck·lint·직렬 테스트·두 빌드·라우트 해석·마케팅/개발 HTML 동일성·스텁 6페이지가 새 셸로 렌더·누수 0).
3. WP-A·B·C·D 병렬 → 각 RESULT.
4. V(전체 완료 기준 9절). FAIL은 파일 소유자에게 재지시한다(소유가 불분명하면 WP0).
5. 조율자 커밋 → 사용자 디자인 확인(1440·390 캡처 + 미리보기 포트).

## 4. 공통 컴포넌트 명세 (WP0)

### 4-1. `ContentSiteFrame` (client, `shell/frame.tsx`)
루트 `div.cs-site`에 `data-cs-theme="ink|paper"`, `data-cs-service="<id>|home|contact"`, `data-motion="on|paused"`를 붙인다. pathname → `lib/content-site/theme-map.ts`의 순수 데이터 맵(홈·문의는 `ink`). 서버 렌더에서도 같은 값이 나와야 한다(`usePathname`). 서비스 색 토큰은 이 속성 선택자로 `theme.css`에서 바뀐다.

### 4-2. 헤더 (`shell/header.tsx`, client)
- 높이 고정: ≥1024 `72px`, <1024 `60px` → `--cs-header-h`(CSS 상수, ResizeObserver 없음). `position: sticky; top: 0`, 바탕은 현재 테마 `--cs-bg` 92% + `backdrop-filter: blur(12px)`, 아래 1px `--cs-line`.
- 왼쪽: 로고 잠금 = `Brand`(site-shell에서 import만) + 세로 구분선 + 영문 라벨 `CONTENT STUDIO`(eyebrow 역할). 잠금 전체가 `/content` 링크(`aria-label="AIO MAKE 컨텐츠 홈"`). 로고 CSS는 `.cs-brand`로 메인과 같은 값을 다시 선언한다: `font-family: var(--ff-display)`, 19px(푸터 22px), `AIO` 800·`MAKE` 300, `letter-spacing:-0.03em`, gap 7px, 6px 정사각 점 `#6b4dff`. 로고는 컨텐츠 사이트에서 Unbounded를 쓰는 유일한 요소다.
- 가운데(≥1180): 서비스 6개 링크(`웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상` 순서·표기 고정), 현재 페이지 `aria-current="page"` + 아래 2px 막대(accent). <1180: `서비스` 버튼 → 시트(6개 링크 + 각 시작가 한 줄, `startingPrice`). Esc·바깥 클릭 닫힘, 포커스 복귀, 열릴 때 첫 링크로 포커스.
- 오른쪽: 움직임 토글(4-8) → `상담 신청` 버튼(`.cs-btn--primary` sm). href는 서비스 페이지에선 `#inquiry`, 홈에선 `/content/contact`, 문의 페이지에선 숨김.
- 메인 사이트 링크는 헤더에 두지 않는다(열린 질문 Q2).

### 4-3. 푸터 (`shell/footer.tsx`, 서버)
항상 `ink` 테마. 3열(≥1024): ① 로고 잠금 + 한 줄 `웹툰부터 SNS 광고 영상까지 기획과 제작을 한 팀이 맡습니다` ② 서비스 6개 링크 ③ `상담 신청`(→`/content/contact`)·이메일. 아래 줄: 사업자 정보 4줄(메인 `Footer`와 **같은 문자열**), `개인정보처리방침`·`이용약관`, `AIO MAKE 홈 →`(`/`, 메인으로 가는 유일한 링크), `© 2026 AIO MAKE · All rights reserved`. 모바일 하단 바가 있는 페이지에서는 푸터 아래 여백 `calc(64px + env(safe-area-inset-bottom))`.

### 4-4. 모바일 하단 바 (`shell/mobile-bar.tsx`, client)
<768px의 서비스 페이지에서만. 높이 64px + safe-area. 왼쪽 두 줄: 서비스명(caption) / `head`(예: `25만 원부터`, price-sm 역할). 오른쪽 `상담 신청` → `#inquiry`. `#inquiry`가 화면에 들어오면 숨김(IntersectionObserver), 가상 키보드가 열리면 숨김(visualViewport 160px 기준, 기존 FloatingContact와 같은 방식). 숨김은 `hidden` 속성이 아니라 transform + `visibility`로(레이아웃 이동 0).

### 4-5. 섹션 머리 `CsSectionHead` (`ui/section-head.tsx`)
props: `eyebrow`(영문 대문자, 3단어 이하), `title`(`\n`으로만 줄바꿈), `lead?`, `aside?`, `id`. ≥1024 2열(왼쪽 7/12: eyebrow→h2, 오른쪽 4/12: lead를 아래 정렬), <1024 세로. 간격: eyebrow→h2 `s4(16)`, h2→lead `s5(24)`, 머리→본문 `s7(48)`(≥1024 `s8(64)`). h2에 `id`를 주고 섹션은 `aria-labelledby`.

### 4-6. 미디어 `CsMedia` + 상태 태그 `CsTag`
- 이미지: `next/image`만(`fill` + 비율 박스 클래스 또는 width/height, `sizes` 필수). `priority`는 페이지당 히어로 1개.
- 영상: `<video muted loop playsInline preload="metadata" poster>`. 자동재생은 마운트 후 `prefers-reduced-motion: no-preference`이고 `data-motion="on"`일 때만 `play()`(서버 HTML에 `autoplay` 속성 금지). 움직임 토글이 꺼지면 일시정지. 재생 실패 시 poster만 남는다.
- 태그(필수, 미디어 왼쪽 아래 12px): `연출 예시` · `AI 가상인물 · 연출 예시`(AI가 만든 사람 이미지는 전부) · `1억의 구단주 · 제작 예시`(AIO 자체 웹툰) · `1억의 구단주 영상 · 제작 예시` · `연출 예시 · 무음`(브랜드 홍보 영상 배경 영상) · 검토 빌드 사례 라벨(2-5). 문자열은 `lib/content-site/types.ts`의 상수 `MEDIA_TAGS`로만 쓴다(새 태그가 필요하면 "WP0 요청").
- alt는 내용 설명 + 태그 성격(예: `SNS 광고 영상 연출 예시 · AI로 만든 가상인물`). 장식 그래픽(CSS 일러스트)은 `aria-hidden` + 근처에 `연출 예시` 태그.

### 4-7. 가격 `CsPricing` (`blocks/pricing.tsx`, `id="pricing"`)
- 입력: 서비스 id. 출력: 플랜 카드 그리드(≥1024 플랜 수만큼 최대 4열, 768 2열, <768 1열). 카드 = 플랜 라벨(h3) · 금액(price 역할, `formatWon`, 숫자 `tabular-nums`) · 기준 설명 · `이 구성으로 상담`(`a.cs-link[href="#inquiry"][data-plan="<plan key>"]`). 금액 뒤에 `부가세 별도`(small)를 카드마다 붙인다.
- 웹툰: 3묶음(웹툰 제작 2플랜 / 모션코믹 2플랜 / 함께 제작 2묶음)을 탭 없이 세로로 나열하고 묶음 카드에 `함께 제작` 표시.
- 카드 아래 공통 주석(모든 서비스 같은 문장, `PRICING_COMMON`): `표시 금액은 모두 부가세 별도입니다.` / `기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다.` / `대량 제작과 정기 제작은 따로 견적을 드립니다.` + 서비스별 주석(PRICING_FINAL 해당 번호의 문장만, 서비스 명세 참조).
- `SHOW_STARTING_PRICE`와 관계없이 항상 표시한다(서비스 페이지 가격은 사용자 확정).

### 4-8. 움직임 토글 `MotionToggle`
헤더 안 36×36 버튼. `aria-pressed`, 라벨 `화면 움직임 멈추기`/`화면 움직임 다시 재생`. 누르면 `.cs-site[data-motion="paused"]` → CSS가 `.cs-site *`의 animation-play-state를 paused로, 영상은 pause. reduced-motion 환경의 초기값은 `paused`. 상태는 저장하지 않는다. 5초 넘게 자동으로 움직이는 요소(콜라주 흐름, 키네틱 타이포, 배경 영상)는 모두 이 토글로 멈춰야 한다(WCAG 2.2.2).

### 4-9. 문의 `CsInquiry` (`blocks/inquiry.tsx`, client, `id="inquiry"`)
- 기존 `InquiryBridge`를 감싼다(검증된 `/api/contact` 저장, 어트리뷰션, `generate_lead` 이벤트를 그대로 재사용. 새 추적 이벤트는 추가하지 않는다).
- WP0이 `inquiry-bridge.tsx`에 **선택 prop 2개만** 추가한다: `homeHref?: string`(기본 `"/"`), `homeLabel?: string`(기본 `"홈으로 돌아가기"`). 기본값이라 마케팅·개발 문의는 바뀌지 않는다. 컨텐츠는 `/content`, `컨텐츠 홈으로`.
- props: `service?: ContentServiceId`, `chooser?: boolean`(문의 페이지용), 서비스 데이터의 `inquiry` 문구. `initialService`는 고정 서비스 또는 선택값(state). 서비스 선택 라디오는 `<form>` **바깥**에 둬서 메시지에 섞이지 않게 한다.
- 필드(라벨 위, 순서 고정): `성함`*(name) · `회사·브랜드`(company) · `이메일`(email) · `전화번호`(phone) · `희망 구성`(select, name=`희망 구성`: 그 서비스의 플랜 라벨들 + `아직 정하지 않았어요`) · `희망 일정`(select, name=`희망 일정`: `2주 안에`·`1개월 안에`·`상담 후 정할게요`) · `참고 링크`(name=`reference`) · `만들고 싶은 컨텐츠`*(message, textarea, 서비스별 placeholder) · 동의 체크박스(name=`consent`, `개인정보 수집·이용에 동의합니다 (필수)`) · 제출 `상담 신청하기`.
- `CsPricing`의 `[data-plan]` 클릭(문서 위임)을 받아 `희망 구성` 값을 맞추고 `#inquiry`로 스크롤한 뒤 그 select에 포커스한다.
- `InquiryBridge`가 그리는 `guide-*` 클래스(`.guide-inquiry`, `.guide-form-fields`, `.guide-form-note`, `.guide-form-error`, `.guide-receipt`, `.honeypot`)를 `theme.css`에서 `.cs-site` 범위로 스타일한다. **`.cs-site .honeypot`은 반드시 시각적으로 숨긴다**(guide.css가 로드되지 않으므로 빠지면 스팸 함정 입력칸이 보인다).
- 섹션 구성: ≥1024 2열(왼쪽: eyebrow `CONTACT`, h2, lead, 진행 순서 3줄 `상담 신청 → 기획안과 견적 안내 → 제작 시작`, 오른쪽: 폼 카드). 응답 시간 약속 문구는 쓰지 않는다(근거 없음).

### 4-10. 그 밖의 블록
- `CsProcess`(`blocks/process.tsx`): `steps[] {title, body, check}` 가로 4~5단(≥1024), 2열(768), 1열(<768). 단계 번호는 렌더 시 `01`부터 생성(데이터에 숫자 없음). `check`는 `함께 확인` 라벨(label-ko) + 한 줄. 아래에 수정 기준 한 줄(PRICING_COMMON).
- `CsScope`(`blocks/scope.tsx`): 3열 `기본 포함` / `별도 상담` / `준비하면 좋은 자료`. 각 `ul`.
- `CsFaq`(`blocks/faq.tsx`, `id="faq"`): `<details>`·`<summary>`(서버 렌더, JS 없음), 답변 `id="cs-faq-<service>-<i>"`. 질문·답변 문자열은 JSON-LD FAQPage와 같은 배열에서 온다.
- `CsWorks`(`blocks/works.tsx`, 서버, `id="works"`): `works.length === 0`이면 `null`. 변형 `layout="vertical"|"wide"|"webtoon"`. 카드 = 미디어(영상은 `controls preload="none"`, 웹툰은 첫 페이지 이미지) + 라벨 태그 + 브랜드·제목·범위 + `사례 자세히 보기 ↗`(`/work/{slug}`).
- `CsRelated`(`blocks/related.tsx`): 현재 서비스를 뺀 5개를 한 줄 카드(라벨 + 시작가 head)로. 머리는 eyebrow `MORE SERVICES` + h2 `다른 컨텐츠 서비스`.
- 공통 블록의 머리 문구는 고정이다: 가격 `PRICING` / `제작 가격`, 범위 `SCOPE` / `포함 범위`, FAQ `FAQ` / `자주 묻는 질문`. 과정·문의·고유 섹션의 h2는 서비스 데이터가 준다.
- 섹션 바탕 순서(공통 블록은 WP0이 고정): types `--cs-bg` · signature는 서비스가 정함 · works `--cs-bg` · pricing `--cs-bg-2` · process `--cs-bg` · scope `--cs-bg` · faq `--cs-bg-2` · inquiry `--cs-bg`(폼 카드 `--cs-surface`) · related `--cs-bg-2`.
- `Reveal`(`ui/reveal.tsx`, client): 루트에 `data-js` 표시가 붙은 뒤에만 `[data-reveal]` 요소를 16px 아래·투명에서 한 번 나타나게 한다. JS가 없거나 reduced-motion이면 처음부터 보인다.

## 5. 디자인 시스템 (`components/content-site/theme.css`)

벤치마크 `aio-service-pages-v01/source/style.css`의 방향(어두운 스튜디오 / 밝은 종이 테마, 서비스별 강조색, 둥근 알약 버튼, 큰 미디어)을 가져오되, 8~11px 글자·px 고정 자간·-0.065em 자간·브레이크포인트마다 다른 글자 크기·장식 영문 문장은 버린다.

### 5-1. 글자 역할 (Pretendard 단일. 로고만 예외)
모든 역할의 family는 `var(--ff-text)`. 토큰 `--cs-t-<role>-size|weight|leading|tracking`을 `.cs-site`에 선언하고 역할 클래스 `.cs-t-<role>`이 그 토큰만 읽는다.

| 역할 | 클래스 | size | weight | line-height | letter-spacing | 쓰임 |
|---|---|---|---|---|---|---|
| display | `.cs-t-display` | `clamp(38px, 6vw, 88px)` | 750 | 1.12 | -0.045em | 히어로 h1 |
| h2 | `.cs-t-h2` | `clamp(30px, 3.8vw, 56px)` | 700 | 1.2 | -0.035em | 섹션 제목 |
| statement | `.cs-t-statement` | `clamp(24px, 2.6vw, 36px)` | 600 | 1.4 | -0.025em | 큰 문장 단락(브랜드 영상 메시지 등) |
| h3 | `.cs-t-h3` | `clamp(20px, 1.8vw, 26px)` | 650 | 1.35 | -0.02em | 카드·단계·플랜 제목 |
| lead | `.cs-t-lead` | `clamp(17px, 1.35vw, 20px)` | 400 | 1.75 | -0.01em | 제목 아래 설명 |
| body | `.cs-t-body` | 16px | 400 | 1.75 | -0.01em | 본문·FAQ 답·폼 입력 |
| small | `.cs-t-small` | 14px | 400 | 1.7 | 0 | 카드 설명·주석 |
| caption | `.cs-t-caption` | 12px | 500 | 1.5 | 0.01em | 상태 태그·메타 |
| eyebrow | `.cs-t-eyebrow` | 12px | 650 | 1.5 | 0.14em + uppercase | 영문 머리글(라틴만) |
| label | `.cs-t-label` | 13px | 650 | 1.5 | 0 | 한글 라벨(`함께 확인`, 폼 라벨) |
| price | `.cs-t-price` | `clamp(28px, 2.6vw, 40px)` | 750 | 1.15 | -0.03em, tabular-nums | 가격 카드 금액 |
| price-sm | `.cs-t-price-sm` | 18px | 700 | 1.3 | -0.01em, tabular-nums | 히어로 가격 칩·하단 바 |
| num | `.cs-t-num` | `clamp(40px, 4vw, 64px)` | 300 | 1 | -0.04em, tabular-nums | 장식 숫자(aria-hidden) |
| nav | `.cs-t-nav` | 14px | 550 | 1.4 | -0.01em | 헤더·푸터 링크 |
| button | `.cs-t-button` | 15px (lg 16px) | 650 | 1.2 | -0.005em | 버튼·텍스트 링크 |
| chip | `.cs-t-chip` | 14px | 500 | 1.2 | 0 | 칩·탭·선택지 |

규칙: (a) 역할 값은 `theme.css`의 토큰 선언에만 숫자로 있다. 다른 CSS(`services/*/*.css`, `content-home.css`)의 `font-size|font-weight|line-height|letter-spacing|font-family` 값은 모두 `var(--cs-t-…)`이다(예외: `.cs-brand`의 `var(--ff-display)`). (b) `@media` 안에서 글자 속성을 선언하지 않는다(반응은 clamp가 한다). (c) 12px 미만 금지, 반 픽셀 금지, 한글에 양수 자간 금지(eyebrow는 라틴 전용). (d) 같은 역할이면 페이지·폭·테마와 관계없이 계산값이 같다. 색만 바뀔 수 있다. (e) `!important` 0. (f) 줄바꿈: `word-break: keep-all`, 제목류는 `white-space: pre-line; text-wrap: balance`, 본문은 `text-wrap: pretty`. **h1 한 줄 9자 이하, h2·statement 한 줄 11자 이하**(공백·문장부호 포함). (g) 숫자 금액은 `tabular-nums`.

### 5-2. 색
`.cs-site[data-cs-theme="ink"]`
| 토큰 | 값 | 용도 |
|---|---|---|
| `--cs-bg` | `#0E0D12` | 페이지 |
| `--cs-bg-2` | `#17151D` | 번갈아 쓰는 섹션 바탕 |
| `--cs-surface` | `#1E1B25` | 카드·폼 |
| `--cs-fg` | `#F7F5F2` | 제목·주 텍스트 |
| `--cs-fg-2` | `#C9C5CF` | lead·본문 |
| `--cs-fg-3` | `#9B97A3` | 캡션·보조 |
| `--cs-line` | `rgba(255,255,255,.14)` | 구분선·테두리 |
| `--cs-focus` | `#FFFFFF` | 포커스 외곽선 |

`.cs-site[data-cs-theme="paper"]`: `--cs-bg #F6F2EC`, `--cs-bg-2 #EEE8E0`, `--cs-surface #FFFFFF`, `--cs-fg #1C1824`, `--cs-fg-2 #4A4453`, `--cs-fg-3 #625B6B`, `--cs-line rgba(28,24,36,.14)`, `--cs-focus #1C1824`.

서비스 강조색(`[data-cs-service="<id>"]`, `--cs-accent` 채움 / `--cs-accent-text` 바탕 위 글자 / `--cs-on-accent` 채움 위 글자 / `--cs-bg` 덮어쓰기):
| 서비스 | 테마 | `--cs-bg` | accent | accent-text | on-accent |
|---|---|---|---|---|---|
| ad | ink | 기본 | `#FF5A82` | `#FF7D9C` | `#1A0F14` |
| motion-graphics | ink | 기본 | `#B9A0FF` | `#C7B4FF` | `#1D1631` |
| brand-film | ink | `#0B0A0F` | `#D6C6EA` | `#D6C6EA` | `#1C1824` |
| webtoon | paper | `#F1ECF6` | `#7951AC` | `#6A4399` | `#FFFFFF` |
| animation | paper | `#F5EBDD` | `#EFB27A` | `#8A4B12` | `#2E2233` |
| ai-influencer | paper | `#EFEAE6` | `#AF8CDE` | `#6B47A3` | `#1F1530` |
| home·contact | ink | 기본 | `#A99BFF` | `#B9AEFF` | `#14102A` |

- 대비: 본문·캡션 4.5:1 이상, 24px 이상(또는 19px·700 이상) 3:1 이상. V가 실측해 미달이면 WP0이 토큰을 조정한다(값은 위 시작점).
- 서비스 CSS는 새 텍스트 색을 만들지 않는다. 장식(도형·그라데이션·패널 무늬)용 색은 파일 맨 위 `.cs-svc-<id> { --svc-*: … }` 한 블록에만 둔다.

### 5-3. 간격·격자·모양
- 컨테이너 `.cs-container { max-width: var(--cs-container); margin-inline: auto; padding-inline: var(--cs-gutter) }`, `--cs-container: 1440px`, `--cs-gutter: clamp(20px, 5vw, 80px)`. 헤더 로고 왼쪽 끝 = 모든 섹션 머리 왼쪽 끝(±1px).
- 간격 단계 `--cs-s1..s9 = 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96px`. 섹션 세로 `--cs-section-y: clamp(72px, 10vw, 140px)`, 작은 섹션 `--cs-section-y-sm: clamp(48px, 6vw, 88px)`.
- 격자: ≥1024 12열 gap 24px, 768~1023 6열 gap 20px, <768 4열 gap 16px. 폭 규칙은 클래스(`.cs-grid`, `.cs-col-*`)로만.
- 모서리 `--cs-r-sm 6px`(입력·태그 외 작은 요소) · `--cs-r-md 14px`(카드·미디어) · `--cs-r-lg 24px`(큰 패널·폼 카드·시트) · `--cs-r-pill 999px`(버튼·칩·태그).
- 버튼: `.cs-btn` 높이 48px(lg 56px), 좌우 24px, 아이콘 간격 12px, 알약. `--primary` = 바탕 `--cs-fg`·글자 `--cs-bg`, hover 시 바탕 `--cs-accent`·글자 `--cs-on-accent`. `--ghost` = 1px `--cs-line`, 글자 `--cs-fg`. `.cs-link` = 밑줄 1px, `cs-t-button`. 화살표(`↗`, `↓`, `→`)는 `aria-hidden` span. 터치 대상 최소 44×44.
- 포커스: `outline: 3px solid var(--cs-focus); outline-offset: 3px`, 강조색 띠 위에서는 `--cs-on-accent`.
- 리셋: `.cs-site :where(h1,h2,h3,h4,p,ul,ol,dl,dd,figure,blockquote){margin:0}`, `:where(ul,ol){padding:0;list-style:none}`. WP0은 `app/globals.css`의 요소 선택자(h1·h2·h3·p·a·ul·label·textarea·select 등)가 `.cs-site`에 주는 값을 목록으로 만들어 RESULT에 적고, 필요한 것은 `.cs-site` 범위에서 덮는다(`!important` 없이).

### 5-4. 움직임
- 시간 `--cs-dur-1 160ms`(hover) · `--cs-dur-2 320ms`(나타남) · `--cs-dur-3 640ms`(히어로) / 이징 `--cs-ease: cubic-bezier(.2,.7,.2,1)`.
- 허용: 카드 hover `translateY(-4px)`, 미디어 hover `scale(1.04)`(overflow clip), Reveal 1회, 서비스 명세에 적힌 히어로 루프(콜라주 흐름·키네틱 타이포·후광·배경 영상). 스크롤 연동 고정(pin)·패럴랙스·자동 넘김 캐러셀은 쓰지 않는다. 새 패키지(GSAP 등) 금지.
- `prefers-reduced-motion: reduce`: `.cs-site` 안 animation·transition 0, 영상 자동재생 없음, Reveal 없음. `data-motion="paused"`: 루프 정지·영상 정지.

## 6. 콘텐츠·자산 규칙

### 6-1. 카피 (모든 데이터 파일에 테스트로 강제)
- 짧은 존댓말(`~합니다`). 한 문장 쉼표 1개 이하. 문장 끝에 쉼표절을 덧붙이지 않는다.
- 금지(정규식, 대소문자 무시): `을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|1위|%|\d+배|혁신|차원이 다른|압도적|극대화|시너지|원스톱|완벽|최적|퀄리티|콘텐츠|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질|coming soon|준비 중|공개 예정|곧 공개|맞춤 견적|작업 사례`. 표기는 `컨텐츠`.
- 숫자 허용 목록: 데이터 문자열의 숫자는 `12, 24, 30, 60, 9:16, 1080p, 1, 2, 4, 5, 20`과 금액뿐이다. 금액은 `N만 원` 형식으로만 쓰고 `PRICING_FINAL` 금액 집합(`7.5만 10만 12만 15만 17.5만 18만 25만 27만 30만 45만 55만 100만`) 안의 값이어야 한다(테스트가 `\d+(\.\d)?만 원`을 뽑아 대조). 가격 카드·시작가 줄은 데이터에 쓰지 않고 `lib/content-pricing.ts`로 렌더한다. 그 밖의 숫자(기간·회신 시간·건수·퍼센트, `첫 3초` 같은 표현 포함)는 쓰지 않는다. 필요하면 열린 질문으로 올린다.
- 마침표: 제목·라벨·칩·태그·버튼·한 문장 lead에는 찍지 않는다. 두 문장 이상 필드(설명, FAQ 답, 단계 본문)는 문장마다 찍는다.
- 영문은 eyebrow(대문자 3단어 이하)와 로고 잠금에만. 벤치마크의 장식 영문 문장(`SOCIAL FIRST. BRAND ALWAYS.` 류)은 쓰지 않는다.
- 근거 범위: 금액·포함 범위는 `PRICING_FINAL`, AI 인플루언서 표현은 `FACTS_AI_INFLUENCER`의 "써도 되는 표현"만. 제작 과정 설명은 수정 기준(기획안 2회·최종안 1회)과 맞아야 한다. 촬영 포함 여부·납품 파일 규격·제작 기간·원본 제공은 확인 전이라 쓰지 않는다(열린 질문).
- 쓴 뒤 `humanizer` 기준으로 한 번 읽고 고친 문장을 RESULT에 적는다.

### 6-2. 데이터 파일 형식 (`lib/content-site/types.ts`)
```ts
export type ContentServiceId = "webtoon"|"animation"|"ai-influencer"|"motion-graphics"|"brand-film"|"ad";
export type ServiceLandingData = {
  id: ContentServiceId; label: string;               // 라벨은 6종 표기와 같다
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string; facts: [string, string, string] };
  types: { eyebrow: string; title: string; lead?: string; items: { title: string; body: string }[] };
  process: { title: string; lead?: string; steps: { title: string; body: string; check: string }[] };
  scope: { included: string[]; separate: string[]; prepare: string[] };
  faq: [question: string, answer: string][];
  inquiry: { title: string; lead: string; placeholder: string };
  signature: Record<string, unknown>;                // 서비스 고유 섹션 문구(문자열은 모두 카피 테스트 대상)
};
```
순수 데이터만(JSX·process.env·고객 데이터 금지), 상대 import는 `.ts` 확장자. `lib/content-site/index.ts`가 6개를 모아 `contentLandings`로 내보낸다(WP0 작성 후 수정 금지).

### 6-3. 미디어 자산
- 기본 빌드에서 쓰는 미디어는 공개 자산만: `public/creative-v06/video-*.webp`, `public/renewal/*.webp`, `public/webtoon-v11/cut-01..12.webp`(《1억의 구단주》 AIO 자체 웹툰, `1억의 구단주 · 제작 예시`), `public/videos/webtoon-reference-v02.mp4`(+poster), 아래 복사본.
- WP0은 벤치마크 `aio-service-pages-v01/dist/assets/`의 `hero.webp`, `brand.webp`, `animation.webp`, `creator.webp`, `webtoon.webp`, `brand-motion.mp4`를 `public/content-site/`로 복사하고 `MANIFEST.json`의 SHA-256과 대조해 RESULT에 적는다. 기존 `public/`에 같은 SHA 파일이 있으면 복사하지 않고 기존 경로를 쓴다. 이 자산은 모두 `연출 예시`(creator는 `AI 가상인물 · 연출 예시`)로만 표시하고 벤치마크의 가상 인물 이름·프로필(`서아 SEOA` 등)은 쓰지 않는다. 사용 허락은 열린 질문 Q3 — 사용자가 거절하면 해당 자리를 `creative-v06`·`renewal` 이미지로 바꾼다(각 WP는 자산 경로를 데이터 파일 상수 한 곳에 둔다).
- 신규 이미지·영상 생성 금지. 고객 미디어(`/reference-review/…`)는 `CsWorks`를 거쳐 검토 빌드에서만.

## 7. 접근성·성능·SEO
- 페이지마다 h1 1개, heading 순서 건너뛰기 없음, 섹션 `aria-labelledby`. 서비스 페이지 공통 앵커 id: `pricing`, `faq`, `inquiry`(헤더·히어로 버튼이 쓴다). 두 번째 줄 앵커 내비는 만들지 않는다.
- 섹션 루트마다 `data-cs-section="hero|types|signature|works|pricing|process|scope|faq|inquiry|related"`(테스트·검증용).
- 키보드: 모든 링크·버튼·탭·폼에 Tab으로 닿고 포커스가 보인다. 헤더 시트·서비스 고유 탭은 화살표 키 지원(APG 패턴).
- 클라이언트 섬: 공용은 frame·header·mobile-bar·motion-toggle·inquiry·reveal 6개. 서비스 페이지마다 고유 client 컴포넌트는 1개 이하(필요한 서비스만). resize 리스너 금지. 인라인 `style=` 0(이미지 `style` prop 포함).
- 성능: 히어로 미디어 하나만 `priority`. 영상은 `preload="metadata"`(히어로) 또는 `"none"`(그 외). 첫 화면 밖 이미지는 lazy. 모든 미디어 상자는 `aspect-ratio`로 자리를 잡아 CLS 0.05 이하.
- SEO: 서비스마다 고유 `title`(22자 이하)·`description`(60~120자, 서비스명·시작가·`부가세 별도` 포함)·canonical·OG(이미지는 공통 `/social/video-v19.png`, 열린 질문 Q10). JSON-LD: Organization(레이아웃) + Service(`name`, `description`, `provider`, `areaServed`, `url`, `offers`: 플랜마다 `Offer{name, price, priceCurrency:"KRW", priceSpecification{price, priceCurrency:"KRW", valueAddedTaxIncluded:false}}`) + FAQPage(화면 FAQ와 같은 문자열) + BreadcrumbList(AIO MAKE `/` → 컨텐츠 `/content` → 서비스). 사이트맵은 기존 그대로 6개 서비스·`/content`·`/content/contact`를 포함한다.
- 색인: 검토 빌드(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW="1"`)는 noindex + `X-Robots-Tag`(기존 규칙), 기본 빌드는 index. 컨텐츠 레이아웃·페이지는 robots를 따로 정하지 않는다.

## 8. 테스트 (WP0: `tests/content-site.test.mjs`, 직렬 실행에 포함)
`lib/content-site/index.ts`, `lib/content-pricing.ts`, `lib/content.ts`를 직접 import하고 소스 파일을 grep한다.
1. `contentLandings`에 6개 id가 있고 순서·라벨이 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상`과 같다. 각 id가 `lib/content.ts` video 서비스에 있다.
2. `contentPricing`·`pricingPlans()`의 모든 금액이 `PRICING_FINAL` 값(테스트 상수)과 같다. 웹툰 묶음 17.5만·30만, 모션그래픽 맞춤형 주석, SNS 광고 포함·별도 문장, AI 인플루언서 주석 2개가 원문과 같다. `formatWon` 예시 4개.
3. 6-1 카피 규칙을 모든 데이터 문자열에 재귀 적용(금지어, 쉼표 ≤1/문장, 마침표 규칙, 숫자 허용 목록, `hero.title` 줄 ≤9자, 그 밖의 `title` 줄 ≤11자).
4. 서비스마다 FAQ 4개 이상, 수정 기준·부가세 문장이 들어간 FAQ가 있다(공통 FAQ 3개는 `BRIEF_P2R_SERVICES.md` 0-4의 문자열 그대로). `seo.title` ≤22자, `description` 60~120자에 `startingPrice(id).head`와 `부가세 별도` 포함, 6개가 서로 다르다.
5. ai-influencer: `계정 게시·운영 및 대량 제작은 별도 견적` 문자열이 있고 FACTS 금지 표현이 없다. AI 사람 이미지 태그 상수에 `AI 가상인물`이 있다.
6. `components/content-site/**`의 `"use client"` 파일이 `work-catalog`·`generated`·`home-journey-data`·`works.server`를 import하지 않는다. `works.server.ts` 첫 문장이 `import "server-only"`다.
7. CSS: `components/content-site/**/*.css`와 `components/content-home/*.css`에 `!important` 0, 글자 속성 값은 `var(--cs-t-`로 시작(예외 `.cs-brand`), `@media` 안 글자 속성 0, 서비스 CSS 선택자는 모두 `.cs-svc-<id>`로 시작.
8. `components/content-site/**`·`components/content-home/**`에 `style=` 0, `/content/work` 0, `작업 사례` 0, `맞춤 견적` 0, `GuideNav`·`ServiceNavigation` import 0.
9. `components/content-service/`와 `lib/content-service-plans.ts`가 없다. `(public)/[division]/services/[service]/page.tsx`와 `(public)/[division]/page.tsx`가 `content-service`·`ContentHome`을 import하지 않는다. `next.config.*`에 `/content/work` redirect·rewrite가 없다.
- `tests/seo-http.mjs`: `/content/services/*`마다 Service(offers ≥2)·FAQPage(질문·답이 HTML에 그대로)·BreadcrumbList·Organization, `data-cs-section` hero·pricing·process·faq·inquiry 존재, `content-service-anchors` 0. `scripts/verify-reference-pages.mjs`의 `.content-service-hero` 대기 선택자를 `[data-cs-section="hero"]`로.

## 9. 완료 기준 (V가 두 빌드로 확인: 검토 `"1"` / 기본 미설정. 서버는 한 번에 하나, `npm run start -- -p 3216`)
- [ ] `npm run typecheck` PASS, `npm run lint` 오류 0(기존 경고 1 허용), 직렬 테스트 실패 0, `npm run build` 두 빌드 PASS. 빌드 라우트 표에 `(content-site)` 3경로가 있다.
- [ ] 라우트: `/content`, `/content/contact`, `/content/services/{6}`는 200이고 `.cs-site` 셸(컨텐츠 헤더·푸터)을 쓰며 `.guide-header`·`.guide-footer`·`.floating-contact`가 0개. `/content/insights`와 글 상세는 200(메인 셸). `/content/work`·`/content/services/editing` 등 기존 404·301 동작이 그대로.
- [ ] 마케팅·개발 불변: `/`, `/about`, `/marketing`, `/lab`, `/marketing/services/integrated`, `/lab/services/website`, `/marketing/contact`, `/lab/contact`의 서버 HTML이 기준 커밋과 같다(빌드 해시·nonce 정규화 후). 다르면 차이를 적고 FAIL.
- [ ] 1440 / 1024 / 768 / 390 / 360 × 8페이지(`/content`, 서비스 6, `/content/contact`) × 두 빌드: `scrollWidth <= innerWidth`, 콘솔 error 0(하이드레이션 포함), 깨진 이미지 0, h1 1개.
- [ ] 글자: `.cs-t-*` 역할마다 8페이지·5폭·두 테마 전체에서 `fontSize/lineHeight/letterSpacing/fontWeight/fontFamily` 조합이 폭별 1종류이고 5-1 표의 계산값과 같다. 한글을 가진 보이는 요소의 실제 렌더 글꼴(CDP `CSS.getPlatformFontsForNode`)이 모두 Pretendard다. Unbounded는 `.cs-brand` 안에만.
- [ ] 정렬: 각 폭에서 섹션 머리의 eyebrow·h2·lead, 히어로 eyebrow·h1, 문의 h2의 `left`가 헤더 로고 `left`와 1px 이하 차이(서비스 명세에서 의도적으로 가운데 정렬로 지정한 요소만 예외, 목록을 RESULT에 적는다). 360px에서 h1·h2 줄 수 = 데이터 `\n` 수 + 1.
- [ ] 대비: 페이지마다 보이는 텍스트 요소 표본 전체에서 5-2 대비 기준 충족. 미달 목록 0.
- [ ] 클라이언트 이동 후에도 같은 값: `/`에서 헤더 `컨텐츠` 클릭 → `/content` → 서비스 링크 → `/content/services/ad`로 이동한 뒤 측정한 역할 계산값이 직접 접속 값과 같고, 다시 `/`로 돌아왔을 때 메인 h1·h2 계산값이 기준과 같다(CSS 누수 0).
- [ ] 가격: 각 서비스 `#pricing`의 플랜·금액 텍스트가 `PRICING_FINAL`과 정확히 같고, 금액마다 `부가세 별도`, 공통 주석 3문장이 있다. `맞춤 견적` 0건. 헤더 시트·하단 바·관련 서비스의 시작가가 `startingPrice()`와 같다.
- [ ] 문의: 서비스 페이지 `#inquiry` 폼에서 `희망 구성` 선택지가 그 서비스 플랜과 같다. `이 구성으로 상담` 클릭 시 그 값이 선택되고 포커스가 이동한다. `/api/contact`를 **Playwright route로 가로채(실제 저장 금지)** 페이로드가 `division:"video"`, `service:<id>`, `attribution.landingPath`가 처음 들어온 경로(`/content/services/ad?utm_source=p2r` 새 세션 → `/content/services/ad`), `utm.utm_source:"p2r"`임을 확인한다. 모의 성공 응답 후 접수 화면의 링크가 `/content`. `.honeypot`이 화면에 보이지 않는다(크기 1px 이하 또는 clip). `/content/contact?service=webtoon`이 웹툰을 미리 선택한다.
- [ ] 모바일 하단 바(390·360): 서비스 페이지에서 보이고 `#inquiry`가 보이면 사라지며 푸터 내용을 가리지 않는다. 768 이상에서 없다.
- [ ] 움직임: reduced-motion에서 `.cs-site` 안 animation·transition 0, `video.paused === true`. 움직임 토글로 루프와 영상이 멈추고 다시 재생된다. 서버 HTML에 `autoplay` 속성 0.
- [ ] 누수(기본 빌드): 8페이지 서버 HTML, RSC payload(`?_rsc` 요청 응답), `.next/static/**`에서 `reference-review|BWL|DR's Secret|DR&#x27;s Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|87언니|bwl-|yofree-|healernet-` 0건. 사례 섹션(`[data-cs-section="works"]`) 0개. 검토 빌드에서는 웹툰·애니메이션·모션그래픽·브랜드 홍보 영상·SNS 광고·AI 인플루언서 중 사례가 있는 서비스에 사례 카드가 보이고 87언니 시안 3편의 라벨이 `87언니(AI 가상인물) 출연 · 제안용 시안`이다.
- [ ] SEO: 서비스 6페이지의 title·description이 서로 다르고 7절 길이 규칙을 지킨다. canonical·og:url = `siteUrl + path`. JSON-LD 4종이 있고 FAQ 문자열이 화면과 같다. 검토 빌드 noindex + `X-Robots-Tag`, 기본 빌드 index. 사이트맵에 8경로가 있다.
- [ ] 성능(390, 기본 빌드): LCP 요소가 히어로 미디어(이미지 또는 poster), CLS ≤ 0.05, 같은 원본의 `/_next/image` 요청 중복 0, 히어로 외 영상은 스크롤 전 미디어 바이트 요청 0.
- [ ] 캡처: 8페이지 × 1440·390 전체 화면(두 빌드), 서비스별 히어로 1440·1024·768·390·360을 `.qa/p2r/`에 저장하고 직접 열어 본 소감(글자 크기·정렬·간격·한국어 어색함·서비스 간 차별성)을 `VERIFY_P2R.md`에 적는다. 실행하지 못한 항목은 NOT_RUN과 이유.

## 10. 열린 질문 (사용자 확인 필요. 답이 오기 전에는 괄호 안 기본안으로 구현한다)
1. 서브사이트 표기: 로고 옆 `CONTENT STUDIO`가 괜찮은가? (기본안: `CONTENT STUDIO`)
2. 메인 사이트로 가는 링크를 헤더에도 둘까? (기본안: 헤더 없음, 푸터 `AIO MAKE 홈 →` 한 개)
3. 벤치마크 v01의 AI 생성 이미지 5종·12초 무음 모션을 공개 사이트의 `연출 예시`로 써도 되는가? (기본안: 사용, 거절 시 기존 공개 이미지로 교체)
4. AI 인플루언서 페이지에 자체 IP인 87언니의 이름·콘셉트(`87년생의 영상일기`)·기준 이미지를 기본 빌드에 공개할까? 닥터시크릿 시안 3편은 공개 권리 HOLD 유지가 맞는가? (기본안: 87언니 비공개, 시안은 검토 빌드에서만)
5. AI 인플루언서 가격 주석 `총 20장에 세팅용 이미지 포함. 주 이미지 5장·영상 1편 구성 가능.`의 정확한 뜻(100만 원 구성 안에서 바꿔 고를 수 있다는 뜻인가?). (기본안: 원문 그대로 주석으로만 표시)
6. 브랜드 홍보 영상에 현장 촬영이 포함되는가, 별도인가? (기본안: 언급하지 않음, FAQ에서 `촬영이 필요한지는 상담에서 정합니다`도 쓰지 않음)
7. 납품 규격·파일(웹툰 컷 크기, MP4·원본 파일 제공), 제작 기간, 추가 수정·추가 화면비 비용을 페이지에 쓸까? (기본안: 9:16·1080p 외에는 쓰지 않음, 추가 항목은 `별도 상담`)
8. 모션코믹 예시로 `/videos/webtoon-reference-v02.mp4`(《1억의 구단주》 소개 영상)를 써도 되는가? 모션코믹 품질을 대표하는 영상인가? (기본안: `1억의 구단주 영상 · 제작 예시` 라벨로 모션코믹 섹션에 사용)
9. 웹툰 벤치마크의 핵심 제안인 "같은 컷의 콘티 → 스케치 → 완성" 비교 이미지(《1억의 구단주》 1컷 분량)를 줄 수 있는가? (기본안: 섹션 없이 진행, 받으면 WP-A 데이터 한 곳에 추가)
10. 서비스별 공유 이미지(OG 1200×630)를 따로 만들까? (기본안: 공통 `video-v19.png`)
11. `/content/insights`를 컨텐츠 셸로 옮길까, 메인 셸에 둘까? (기본안: 메인 셸 유지, 컨텐츠 헤더에 링크 없음)
12. `/content` 히어로 쇼릴(결정 9)은 아직 대기다. 쇼릴이 오면 WP-D가 만든 슬롯에 한 줄로 넣는다.
13. 사용처가 없어진 `studio-home.jsx`·`studio-contact.jsx`·`webtoon-devices.tsx`·`webtoon-scope.tsx`를 지울까? (기본안: 보존, P6 이후 결정)
