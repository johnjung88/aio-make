# BRIEF P3 — `/content`(컨텐츠 분과 홈) 재구성: 서비스 6종 소개 중심

> **개정 2026-10-14: 사용자 결정 반영.** (1) 서비스마다 **시작가를 표시**한다(`PRICING_FINAL` 금액만, 형식 `25만 원부터 · 30초 기준 · 부가세 별도`). 웹툰은 `웹툰 제작 12컷 10만 원부터`와 모션코믹 옵션, AI 인플루언서는 `10만 원부터 · 캐릭터 1명 세팅 + 이미지 5장 기준`. 상수 하나(`SHOW_STARTING_PRICE`)로 전부 끌 수 있다. (2) 히어로는 **사용자가 나중에 줄 컨텐츠 쇼릴**을 데이터 한 필드(`contentHomeHero.video = { src, poster }`)로 꽂는 영상 슬롯으로 만든다. 그 전에는 정지 이미지 + 작은 `연출 예시` 표기만 보이고 "준비 중"류 문구는 쓰지 않는다. (3) AI 인플루언서 범위는 **브랜드 전용 AI 인물 제작**이고, 계정 운영은 `별도 견적` 한 줄로만 적는다. (4) 글자는 W2가 도입한 **역할 토큰**(`AUDIT_TYPOGRAPHY.md` 1.1·1.2 이름)만 쓰고, review.css `.guide-page` 제목 `!important`에 맞추던 이전 설계를 없앴다. (5) W1에서 301 없이 삭제한 작업 사례 탭과 `/content/work` 링크를 되살리지 않는다.

먼저 `COMMON.md`, `HANDOFF_RESUME.md`, `AUDIT_TYPOGRAPHY.md`, `PRICING_FINAL_2026-10-14.md`, `FACTS_AI_INFLUENCER.md`, `RESULT_W1.md`, `RESULT_W2.md`(있으면), `RESULT_P4.md`(있으면)를 읽는다. 결과는 `RESULT_P3.md`에 쓴다.

**선행 조건**: W1(앵커 줄 제거, `/work`·`/content/work`·작업 사례 탭 삭제, 서브 내비 타이포 통일)과 W2(전역 타이포: `app/globals.css` 역할 토큰, `.t-*` 역할 클래스, review.css `.guide-page` 제목 `!important` 제거)가 **둘 다 커밋된** 코드 위에서 작업한다. 시작 전에 `git log --oneline -5`와 `git status`를 확인한다. W1·W2의 미커밋 변경(`primitives.tsx`, `guide.css`, `review.css`, `globals.css`, `type.css`, `studio-home.jsx`, `home-references.tsx`, `main.jsx` 등)이 남아 있거나 `app/globals.css`에 W2 토큰(`--ff-text` 등)이 없으면 손대지 말고 RESULT에 적은 뒤 멈춘다. P4는 선행 조건이 아니다(있으면 아래 "P4와 공유"를 따른다). 이 문서는 줄 번호 대신 컴포넌트·선택자·문자열로 대상을 가리킨다.

## 배경
- `/content`는 `app/(public)/[division]/page.tsx`의 `video` 분기에서 `components/guide/studio-home.jsx`(`StudioHome`)를 그린다. 지금 구성은 히어로(`GuideMedia` 정지 이미지 + 캡션 `콘셉트 이미지 · 실제 컨텐츠는 등록 후 공개`) → 전문성 문장 → `HomeReferences` 레퍼런스 격자 → `Services` 이름 목록(각 줄 `맞춤 견적`) → `Process` 5단계 → `Insights` 3개 → 보라 CTA다. 모든 스타일이 인라인 `style`이다.
- 사용자 판정: "레퍼런스 격자 + 서비스 이름만 나열 = 너무 단순하다". 요구:
  1. 서비스 6종을 각각 짧고 전문적으로 설명한다.
  2. 레퍼런스를 이 페이지에 모아 보여주지 않는다. 레퍼런스는 서비스 상세와 메인 워크플로우(P4)에만 둔다.
  3. 작업 사례 탭과 `/content/work`는 W1에서 301 없이 삭제됐다(404가 정상). 이 페이지는 그 탭·경로·`작업 사례` 문구를 **어떤 형태로도 되살리지 않는다**: `GuideNav`의 탭 목록·nav 데이터에 항목을 추가하지 않고, `/content/work`·`/work` 목록으로 가는 링크·리다이렉트·`next.config` 규칙을 만들지 않는다. 히어로의 `제작 방향 살펴보기`(`Studio 작업 사례.dc.html` → 지금은 `/content` 자기 자신)도 정리한다.
  4. 서비스 표기는 정확히 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상`이다.
  5. 사용자는 글자 크기·정렬·간격의 들쭉날쭉함과 어색한 한국어에 가장 민감하다. **같은 역할의 글자는 화면 폭과 표시 방식(캐러셀/목록)에 관계없이 같은 계산값**을 가져야 한다.
- 벤치마크(사용자 지정, 읽기만): `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\`(`index.html`, `style.css`, `app.js`). 컨텐츠 에이전시 페이지 시안이다. 히어로 브랜드 필름 루프, 스튜디오좋식 3D 서비스 캐러셀, Superpixel식 5단계 탭, Demo Duck식 예시 필터·상세 창, 인사이트, 푸터 CTA로 구성된다. 실행·복사하지 않는다. 반영 범위는 아래 "벤치마크 반영"에 정리했다.
- 가격은 `PRICING_FINAL_2026-10-14.md`(3~9번)가 정본이다. COMMON.md의 "가격은 맞춤 견적" 규칙은 이 페이지의 시작 가격 표시에 한해 이 문서가 대신한다(사용자 결정 2026-10-14로 확정). 금액은 정본 값만 쓰고 새로 만들지 않는다.
- AI 인플루언서 문구는 `FACTS_AI_INFLUENCER.md`를 따른다. 서비스 범위는 사용자 결정으로 **브랜드 전용 AI 인물 제작**(캐릭터 세팅, 그 인물이 나오는 이미지·숏폼 영상)이다. 계정 게시·운영은 서비스 소개에 넣지 않고 `별도 견적` 한 줄로만 안내한다.

## 결정 요약
| 항목 | 결정 | 이유 |
|---|---|---|
| 히어로 미디어 | **영상 슬롯 + 정지 이미지 대체**. 데이터 한 필드 `contentHomeHero.video`(`{ src, poster }` 또는 `undefined`)가 영상 유무를 정한다. 지금은 `undefined`라 정지 이미지(`/renewal/brand-film-v03.webp`, `priority`) + 작은 태그 `연출 예시`만 보인다. 사용자가 쇼릴을 주면 그 한 필드만 채워 교체한다 | 사용자가 컨텐츠 쇼릴을 따로 제공한다(결정 9). 고객 작업물 18개는 공개 권리 HOLD라 기본 빌드에 못 쓴다. `brand-intro-v01.mp4`는 회사 전체 소개(밝은 로고 화면, 30초, 3.9MB, 음성 포함)이고 메인에서 이미 쓰므로 쇼릴로 쓰지 않는다. 정지 이미지를 항상 아래층에 깔아 LCP 요소로 유지한다 |
| 서비스 표현 | **3D 캐러셀(벤치마크) + 같은 데이터의 구조화 목록 모드**. 서버 렌더·JS 없음·reduced-motion은 목록, 하이드레이션 후 동작 허용 환경은 캐러셀. 사용자가 `한 번에 모두 보기`로 전환 가능 | 사용자가 고른 레퍼런스를 살리면서 서비스 6개 설명이 항상 접근 가능하고 검색에 노출된다 |
| 서비스 상세 텍스트 | 캐러셀에서는 무대 아래 패널 1개, 목록에서는 항목마다. **같은 `ServiceDetail` 컴포넌트**를 쓴다 | 두 모드의 글자 계산값이 구조적으로 같아진다 |
| 시작 가격 | **표시(사용자 확정)**. 한 줄 형식 `25만 원부터 · 30초 기준 · 부가세 별도`. `SHOW_STARTING_PRICE` 상수 하나로 모두 끌 수 있다 | 분과 홈은 서비스를 비교하는 곳이다. 서비스 상세 재작업 전까지 가격을 볼 수 있는 유일한 곳이 된다 |
| AI 인플루언서 범위 | 브랜드 전용 AI 인물 제작. 계정 게시·운영은 `계정 게시·운영은 별도 견적` 한 줄 | 사용자 확정. 가격표 3번과 같다 |
| 제작 과정 | 유지. 5단계 탭(Superpixel식). `Blender 시뮬레이션` 표기는 뺀다. 수정 횟수(기획안 2회·최종안 1회)를 넣는다 | 정본 가격표의 공통 수정 기준이 가장 구체적인 사실이다. Blender는 웹툰·AI 인플루언서에 해당하지 않는다 |
| 전문성 문장 섹션 | 삭제. 메시지는 히어로 h1과 03 단계 본문에 남긴다 | 히어로 h1과 같은 말을 반복한다 |
| 레퍼런스 격자 | 삭제(`HomeReferences` 사용 안 함) | 사용자 요구 2 |
| 인사이트 | 삭제 | 서브 내비에 `인사이트` 탭이 있다. 3개 글은 범용 안내이고 썸네일이 자리표시 이미지다 |
| CTA | 유지. 보라 띠, 문구 정리, `프로젝트 문의` → `/content/contact` | — |
| 페이지 바탕 | 어두운 테마 유지(`--ink`). 벤치마크의 서비스별 파스텔 배경 순환은 가져오지 않고 고정 무대 + 보라 빛 하나 | 컨텐츠 분과 서브 내비·문의 페이지가 어둡다. 색 6세트는 사이트 토큰 밖이다 |
| 구현 방식 | 새 컴포넌트·CSS 파일. `studio-home.jsx`는 수정·삭제하지 않고 연결만 끊는다 | 인라인 style 생성 파일(`scripts/restore-guide.py` 산출물)이다. W1과 충돌을 피한다 |

## 범위
변경 허용(이 목록 밖은 수정 금지):
1. 신규 `lib/content-home.ts`: 히어로·서비스 6종·제작 과정 5단계·CTA 카피와 이미지 맵. JSX 없이 순수 데이터와 선택 함수만 둔다. import는 `.ts` 확장자를 붙인다(node 테스트에서 직접 import).
2. 신규 `lib/content-pricing.ts`: `PRICING_FINAL` 3~9번 전체를 구조화한 데이터, `formatWon()`, `startingPrice(id, show = SHOW_STARTING_PRICE)`, `export const SHOW_STARTING_PRICE = true`. 이후 서비스 상세 재작업에서도 이 파일을 쓴다.
3. 신규 `components/content-home/`:
   - `content-home.tsx`(서버 컴포넌트): 루트, 히어로, 섹션 머리, CTA.
   - `hero-media.tsx`(`"use client"`): 히어로 정지 이미지(항상) + `contentHomeHero.video`가 있을 때만 영상 층과 일시정지 버튼.
   - `service-showcase.tsx`(`"use client"`): 모드 전환, 캐러셀, 목록.
   - `service-detail.tsx`: 서비스 상세 텍스트 블록(서버·클라이언트 공용, 훅 없음).
   - `process-tabs.tsx`(`"use client"`): 제작 과정 탭.
   - `content-home.css`: 이 폴더의 CSS는 이 파일 하나다. `content-home.tsx`에서 import한다(`content-service.tsx`의 CSS import 방식과 같다).
4. `app/(public)/[division]/page.tsx`의 `video` 분기만: `StudioHome` 대신 `ContentHome`을 렌더한다. `video`일 때는 `publicEntries` 호출을 하지 않는다(레퍼런스·인사이트를 쓰지 않는다). 다른 분과 분기와 `generateMetadata`는 그대로 둔다.
5. `lib/content.ts`의 `divisions` 중 `id: "video"`의 `summary` 문자열 하나만: `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상을 기획하고 제작합니다`(메타 description에 쓰인다). 서비스 배열은 건드리지 않는다.
6. `scripts/verify-reference-pages.mjs`: `/content`를 방문할 때 기다리는 선택자를 `#work`에서 `#services`로 바꾼다(그 외 로직 변경 금지).
7. 신규 `tests/content-home.test.mjs`.
8. 조건부(P4가 이미 커밋된 경우만): `lib/home-journey.ts`의 컨텐츠 탭 한 줄 설명 6개를 `lib/content-home.ts`의 `line`을 import해서 쓰도록 바꾼다. 그 외 필드는 수정하지 않는다. P4 테스트가 계속 통과해야 한다.

변경 금지: `components/guide/studio-home.jsx`(연결만 끊고 파일은 그대로. 삭제 여부는 RESULT 후속에 적는다), `components/guide/primitives.tsx`·`guide.css`·`review.css`·`ux.css`(W1 담당. `GuideNav`는 import만 하고 탭 목록을 바꾸지 않는다), W2 소유 전역 스타일(`app/globals.css`, `components/guide/type.css`, `creative.css`, `fixes.css`. 토큰·역할 클래스는 쓰기만 한다), `next.config.*`(리다이렉트 추가 금지), `home-references.tsx`, `components/content-service/*`, `lib/content-service-plans.ts`, 서비스 상세 페이지, 메인(`main.jsx`, `components/home/*`), `about.jsx`, 마케팅·개발 페이지, `/work/[slug]`, `content/works/*.json`, `lib/generated/*`, `lib/work-*.ts`, 검토 게이트(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW`, noindex, 사이트맵 제외). `scripts/restore-guide.py`는 실행하지 않는다. 새 패키지 설치 금지(GSAP·Swiper·Embla 등 포함). 이미지·영상 신규 생성 금지(기존 `public/` 파일만 쓴다).

## 구조

```
<div class="guide-page content-home">              ← 서버 컴포넌트 루트
  <GuideNav division="video" active="home" />        (기존 그대로)
  <section class="ch-hero" aria-labelledby="ch-hero-title">
    <HeroMedia/>: <Image fill priority …/> (+ video 있으면 <video> 층 · button.ch-hero-pause)  <span class="ch-hero-shade" aria-hidden="true">
    <div class="ch-container ch-hero-copy">
      p.ch-eyebrow · h1#ch-hero-title.ch-hero-title · p.ch-lead · p.ch-hero-services · a.ch-button(#services)
    <span class="ch-tag ch-hero-tag">연출 예시</span>   ← video가 없을 때(정지 이미지)만
  </section>
  <section id="services" class="ch-services" aria-labelledby="ch-services-title" data-mode="list|carousel">
    <header class="ch-container ch-head"> p.ch-eyebrow · h2#ch-services-title.ch-title · p.ch-lead · button.ch-toggle
    (list)     <ol class="ch-container ch-list"> li.ch-item × 6 : figure.ch-item-media(Image + .ch-tag) + ServiceDetail(h3)
    (carousel) <div class="ch-carousel" role="region" aria-roledescription="캐러셀" aria-label="컨텐츠 서비스 6종">
                 <div class="ch-stage" aria-hidden="true"> a.ch-card[data-pos] × 6 </div>
                 <div class="ch-container ch-controls"> span.ch-num(01 / 06) · div.ch-tabs[role=tablist] (button.ch-tab × 6) · button.ch-arrow × 2
                 <div class="ch-container"><div class="ch-panel" role="tabpanel"> ServiceDetail(h3) </div></div>
                 <p class="ch-sr-only" aria-live="polite">
    <p class="ch-container ch-caption ch-services-note">
  </section>
  <section id="process" class="ch-process" aria-labelledby="ch-process-title">
    header.ch-head · div.ch-process-layout( div.ch-step-tabs[role=tablist] · div.ch-step-panel[role=tabpanel] )
  </section>
  <section class="ch-cta" aria-labelledby="ch-cta-title"> h2#ch-cta-title.ch-title · p.ch-lead · a.ch-button </section>
</div>
```

- 루트는 `guide-page`를 함께 쓴다. 서브 내비의 hover 색(`.guide-page a:hover`)과 포커스 외곽선, W2가 `.guide-page`에 준 기본 행간을 다른 분과 홈과 똑같이 유지하기 위해서다. 제목 글자 값은 W2 역할 토큰이 정한다(아래 "디자인 토큰"의 글자 항목). review.css의 `.guide-page h1/h2 !important`는 W2가 지웠으므로 그 값에 맞추거나 기대지 않는다. 혹시 남아 있으면 덮어쓰지 말고 RESULT에 적고 멈춘다. `.guide-page a:hover`가 모든 링크 글자를 lavender로 바꾸므로 `.ch-button`, `.ch-link`, `.ch-card`, `.ch-tab`의 hover 색은 `.content-home` 범위에서 명시한다(예: 보라 버튼 위 글자는 hover에도 흰색).
- heading: h1 1개(히어로), h2 3개(서비스·제작 과정·CTA), h3는 서비스명(캐러셀 1개 / 목록 6개)과 단계 패널 제목 1개. 카드 위 서비스명은 heading이 아니다(`span`). h4 이하는 만들지 않는다.
- 모든 텍스트는 왼쪽 정렬이다. 섹션 머리(eyebrow·h2·lead), 히어로 문구, 패널, CTA 문구의 왼쪽 끝은 `.ch-container`의 안쪽 왼쪽 끝이며 서브 내비 `.guide-subbrand`의 왼쪽 끝과 같다. 가운데 정렬 문단은 만들지 않는다(캐러셀 카드 무대만 화면 가운데).

## 섹션별 명세
카피는 방향과 초안이다. 다듬어도 되지만 글자 수 제한과 카피 규칙을 지키고, 고친 내역을 RESULT에 적는다. 영문 eyebrow·kicker는 아래 값을 그대로 쓴다.

### 1. 히어로 `.ch-hero`
- 높이: `height: calc(100svh - var(--site-header-height) - var(--service-nav-height)); min-height: 560px; max-height: 920px`. 문구는 아래쪽 왼쪽에 둔다(현재 배치 유지). 아래 여백 `clamp(40px, 6vw, 80px)`.
- 이미지(항상 렌더, LCP 요소): `next/image` `fill`, `priority`, `sizes="100vw"`, `object-fit: cover`. 현재와 같은 `/renewal/brand-film-v03.webp`. alt `브랜드 영상 연출 예시 이미지`. `GuideMedia`는 쓰지 않는다(캡션 `콘셉트 이미지 · 실제 컨텐츠는 등록 후 공개`를 없앤다).
- 그림자 `.ch-hero-shade`: `linear-gradient(90deg, rgba(13,13,18,.78) 0%, rgba(13,13,18,.25) 70%), linear-gradient(0deg, rgba(13,13,18,.85) 0%, rgba(13,13,18,0) 55%)`. 흰 글자와 배경 대비를 화면 캡처로 확인한다.
- `.ch-hero-tag`(정지 이미지일 때만): 오른쪽 아래(문구와 겹치지 않게 `right: var(--gutter); bottom: 같은 아래 여백`), 텍스트 `연출 예시` 하나. 작고 조용하게(`.t-caption` 역할, 반투명 어두운 바탕). 390·360px에서 버튼·문구와 겹치면 오른쪽 위로 옮긴다(겹침 0이 완료 기준).
- **자리표시 문구 금지**: 쇼릴이 없는 동안에도 `coming soon`, `준비 중`, `공개 예정`, `곧 공개`, `쇼릴`, `영상 업데이트 예정` 같은 문구나 빈 플레이어·재생 버튼 모양을 보이지 않는다. 방문자에게는 완성된 정지 화면으로 보여야 한다.
- 문구:
  - eyebrow `AIO MAKE STUDIO`
  - h1 `AI가 속도를 내고\n전문가가 완성합니다` (`AI`만 `.ch-accent` 색. 데이터의 `\n`에서만 줄을 바꾼다)
  - lead `웹툰부터 SNS 광고 영상까지 기획과 제작을 한 팀이 맡습니다`
  - `.ch-hero-services`: 필수 문구 6개를 `<span>`마다 `white-space: nowrap`으로 감싸고 ` · `로 잇는다. 줄바꿈은 항목 사이에서만 일어난다.
  - 버튼 `.ch-button` `서비스 살펴보기` → `#services`(보라 배경·흰 글자, 화살표 `↓`는 `aria-hidden` span).
- **쇼릴 영상 슬롯**(이번 단계에서 동작까지 구현한다. 사용자가 쇼릴을 주면 데이터 한 줄만 바꾼다):
  - 데이터: `lib/content-home.ts`에 `export const contentHomeHero = { …, video: undefined as HeroVideo | undefined }`, 타입 `HeroVideo = { src: string; poster: string }`. 경로는 `public/` 기준 절대경로(`/content-home/showreel.mp4` 식). 커밋 값은 `undefined`다. 슬롯을 켜고 끄는 다른 플래그나 상수를 만들지 않는다.
  - `video`가 `undefined`: `HeroMedia`는 정지 이미지만 렌더한다. `<video>` 요소·일시정지 버튼·영상 관련 빈 상자는 DOM에 없다. `.ch-hero-tag` `연출 예시`가 보인다.
  - `video`가 있을 때: 정지 이미지는 그대로 아래층에 두고(LCP 유지), 그 위에 `<video muted loop playsInline autoPlay preload="metadata" poster={video.poster}>`를 `object-fit: cover`로 겹친다. 영상의 `playing` 이벤트 전에는 영상 층을 투명하게 둬 깜빡임이 없게 한다. 오른쪽 아래(태그 자리)에 `button.ch-hero-pause` 44×44px, `aria-label`은 상태에 따라 `영상 일시정지`/`영상 재생`, 아이콘은 `aria-hidden`. `.ch-hero-tag`는 렌더하지 않는다(실제 쇼릴이다. 표기가 필요하면 사용자 결정 후 추가).
  - `prefers-reduced-motion: reduce`이면 자동재생하지 않는다. 정지 이미지만 보이고 버튼으로 직접 재생할 수 있다. 화면 밖으로 나가면 재생을 멈추는 것은 하지 않는다(이벤트 추가 최소화).
  - 받을 쇼릴 사양(사용자 안내용, RESULT에 그대로 적는다): 10~15초 무음, 1920×1080 H.264 mp4, 3MB 이하, 공개 가능한 장면만, poster용 첫 장면 webp 1장.
  - 로컬 확인: 슬롯 동작은 임시로 `video`에 저장소의 기존 공개 영상 하나와 기존 webp를 넣어 확인한 뒤 **반드시 `undefined`로 되돌리고 커밋한다**. 사용한 임시 값과 되돌린 사실을 RESULT에 적는다.

### 2. 서비스 `#services`
- 머리: eyebrow `SERVICES` / h2 `만들고 싶은 컨텐츠를\n골라보세요` / lead `서비스마다 만드는 것과 쓰이는 곳을 정리했습니다`
- 머리 오른쪽(≥1024) 또는 lead 아래(<1024)에 토글 `button.ch-toggle` `한 번에 모두 보기`(`aria-pressed`, 라벨은 바뀌지 않는다). 누르면 목록 모드, 다시 누르면 캐러셀 모드. 스타일은 `.ch-tab` 역할을 쓴다.
- 섹션 바탕 `--ch-surface`, 위아래 패딩 `var(--section-y)`. 가로 넘침은 `.ch-services { overflow-x: clip }`으로 막는다(`overflow: hidden` 금지).

#### 2-1. 데이터 (`lib/content-home.ts` → `contentHomeServices`, 이 순서 고정)
| id | 라벨(h3) | kicker | 한 줄 소개 `line` | 설명 `description`(2문장) | 활용처 칩 3개 | 카드 이미지 / `objectPosition` | 이미지 태그 |
|---|---|---|---|---|---|---|---|
| `webtoon` | 웹툰 | WEBTOON | 브랜드 이야기를 세로로 읽히는 컷으로 그립니다 | 제품을 쓰는 인물의 이야기를 12컷 한 회로 구성합니다. 원하시면 완성한 웹툰을 모션코믹 영상으로 이어서 만듭니다. | 인스타툰 · 상세페이지 · 광고 소재 | `/creative-v06/video-webtoon.webp` / `25% 50%` | 연출 예시 |
| `animation` | 애니메이션 | ANIMATION | 캐릭터와 장면에 움직임을 더합니다 | 캐릭터와 배경을 설계하고 장면을 이어 한 편의 애니메이션으로 만듭니다. 길이는 30초와 60초 중에서 고릅니다. | 릴스 · 쇼츠 · 캐릭터 영상 | `/creative-v06/video-animation.webp` / `45% 50%` | 연출 예시 |
| `ai-influencer` | AI 인플루언서 | AI INFLUENCER | 브랜드 전용 AI 가상인물을 만듭니다 | 캐릭터 시트와 기준 이미지로 얼굴과 스타일을 일정하게 유지합니다. 이 인물이 등장하는 제품 이미지와 9:16 숏폼 영상을 만듭니다. | 제품 소개 · 숏폼 영상 · SNS 이미지 | `/creative-v06/video-ai-influencer.webp` / `55% 40%` | AI 가상인물 · 연출 예시 |
| `motion-graphics` | 모션그래픽 | MOTION GRAPHICS | 그래픽과 글자의 움직임으로 메시지를 전합니다 | 제품 이미지와 로고, 핵심 문구를 장면 전환으로 엮습니다. 맞춤형은 브랜드 전용 캐릭터까지 함께 만듭니다. | 제품 소개 · 홈페이지 · 행사 화면 | `/renewal/video.webp` / `50% 50%` | 연출 예시 |
| `brand-film` | 브랜드 홍보 영상 | BRAND FILM | 브랜드가 하는 일과 이유를 한 편에 담습니다 | 브랜드 자료와 제품 정보를 정리해 이야기 순서를 잡습니다. 회사 소개와 홈페이지에 오래 쓸 영상을 만듭니다. | 홈페이지 · 회사 소개 · 전시 | `/creative-v06/video-brand-film.webp` / `45% 50%` | 연출 예시 |
| `ad` | SNS 광고 영상 | SNS AD | 피드에서 첫 장면으로 시선을 붙잡습니다 | 제품 하나와 콘셉트 하나로 9:16 세로 광고 영상을 만듭니다. 기본 자막과 배경음악을 넣어 1080p로 전달합니다. | 릴스 · 쇼츠 · 피드 광고 | `/creative-v06/video-sns-ad.webp` / `50% 50%` | 연출 예시 |

- `href`는 `/content/services/{id}`. 라벨을 ` · `로 이으면 필수 문구와 같아야 한다.
- AI 인플루언서만 `scopeNote: "계정 게시·운영은 별도 견적"` 필드를 갖는다(사용자 결정: 서비스 범위는 브랜드 전용 AI 인물 제작, 계정 운영은 한 줄로만). 다른 서비스에는 이 필드가 없다. 이 문구는 가격 표시 상수와 관계없이 항상 보인다. 설명·칩·한 줄 소개에 계정 운영·게시 대행을 서비스 내용처럼 쓰지 않는다.
- alt: `{라벨} 연출 예시 이미지`. AI 인플루언서는 `AI 인플루언서 연출 예시 이미지 · AI로 만든 가상인물`.
- 표의 `objectPosition`은 초기값이다. 값은 데이터가 아니라 CSS 클래스 `.ch-focus-{id}`(6개)에 둔다(데이터에는 `id`만 있으면 된다. 인라인 style 금지 때문이다). 1440·768·390에서 카드(세로 약 3:4)와 목록 이미지를 직접 보고 인물·제품이 잘리지 않게 이 클래스 값만 조정한다. 조정 결과를 RESULT에 적는다.
- 사실 근거: 웹툰 12컷·모션코믹(가격표 7·8), 애니메이션 30초·60초(5), AI 인플루언서 캐릭터 세팅·이미지·30초 영상(3, FACTS), 모션그래픽 맞춤형 전용 캐릭터(6), SNS 광고 제품 1개·콘셉트 1개·9:16·1080p·기본 자막·BGM(9). 표에 없는 사실을 더하지 않는다.

#### 2-2. `ServiceDetail` (캐러셀 패널과 목록 항목이 같이 쓴다)
내부 순서 고정: `.ch-detail-meta`(`.ch-num` `01` + `.ch-kicker` `WEBTOON`) → h3 `.ch-svc-title` 라벨 → `.ch-svc-line` 한 줄 소개 → `.ch-body` 설명 → `ul.ch-chips`(`li.ch-chip` 3개) → 가격 블록 → (AI 인플루언서만) `p.ch-note` `계정 게시·운영은 별도 견적` → `a.ch-link` `서비스 자세히 보기 →`(`/content/services/{id}`, 화살표는 `aria-hidden`).
- 가격 블록(`startingPrice(id)`가 값이 있을 때만): 한 줄 `p.ch-price` = `strong.ch-price-amount`(금액 부분, 예 `25만 원부터`) + 나머지(` · 30초 기준 · 부가세 별도`). 화면에는 `25만 원부터 · 30초 기준 · 부가세 별도`로 읽힌다. 웹툰은 이어서 `p.ch-price-note` 한 줄(모션코믹 옵션, 아래 2-3)을 둔다. 값이 없으면(`SHOW_STARTING_PRICE=false`) 가격 줄과 옵션 줄을 모두 렌더하지 않고 빈 자리도 남기지 않는다. 가격 줄은 360px에서 줄바꿈될 수 있으나 ` · ` 구분 단위(span마다 `white-space: nowrap`) 사이에서만 끊긴다.
- 최대 폭: 텍스트 열 `max-width: 40em`.

#### 2-3. 시작 가격 (`lib/content-pricing.ts`, 정본 `PRICING_FINAL` 그대로)
형식: `{앞말 }{금액}부터 · {기준} 기준 · 부가세 별도`. `startingPrice(id, show = SHOW_STARTING_PRICE)`는 `{ amount, amountText, line, note? } | null`을 돌려준다. `line`이 화면의 한 줄 전체 문자열이다. `export const SHOW_STARTING_PRICE = true`가 유일한 끄기 스위치다(다른 곳에 가격 표시 여부 분기를 두지 않는다).
| id | 금액(원) | 화면 한 줄 `line` (정확히 이 문자열) | 옵션 줄 `note` | 정본 |
|---|---|---|---|---|
| `webtoon` | 100000 | `웹툰 제작 12컷 10만 원부터 · 부가세 별도` | `모션코믹 영상화 옵션 · 30초 7.5만 원부터` | 7 웹툰 제작 12컷, 8 모션코믹 30초 |
| `animation` | 300000 | `30만 원부터 · 30초 기준 · 부가세 별도` | — | 5 |
| `ai-influencer` | 100000 | `10만 원부터 · 캐릭터 1명 세팅 + 이미지 5장 기준 · 부가세 별도` | — | 3 |
| `motion-graphics` | 100000 | `10만 원부터 · 단순형 30초 기준 · 부가세 별도` | — | 6 |
| `brand-film` | 250000 | `25만 원부터 · 30초 기준 · 부가세 별도` | — | 4 |
| `ad` | 250000 | `25만 원부터 · 30초 기준 · 부가세 별도` | — | 9 |
- 웹툰의 `strong.ch-price-amount`는 `웹툰 제작 12컷 10만 원부터`, 나머지는 금액부터 `부터`까지다. 웹툰 줄은 앞말 `웹툰 제작 12컷`이 기준을 담고 있어 `· 12컷 기준`을 따로 붙이지 않는다.
- 웹툰 옵션 줄은 설명의 "모션코믹 영상으로 이어서 만듭니다"와 짝이다. 함께 제작 합계(17.5만·30만)는 `contentPricing`에만 담고 이 페이지에는 쓰지 않는다(서비스 상세 재작업 때 쓴다).
- `formatWon(n)`: 만 원 단위, 소수 첫째 자리까지. `100000→"10만 원"`, `75000→"7.5만 원"`, `175000→"17.5만 원"`, `1000000→"100만 원"`.
- `contentPricing`에는 3~9번 항목 전체(AI 인플루언서 10만·30만·100만, 브랜드 25만·45만, 애니메이션 30만·55만, 모션그래픽 단순 10만·18만/맞춤 15만·27만, 웹툰 12컷 10만·24컷 18만, 모션코믹 30초 7.5만·60초 12만, 함께 제작 17.5만·30만, SNS 30초 25만·60초 45만)과 공통 안내(기획안 후 수정 2회, 최종안 후 수정 1회, 부가세 별도, 대량·정기 제작 별도 견적)를 담는다. 이번 페이지는 시작 가격만 쓴다.

#### 2-4. 모드
- 서버 렌더 기본값은 `data-mode="list"`다(JS가 없어도 6개 서비스와 링크·가격이 모두 보인다).
- 마운트 후 `matchMedia("(prefers-reduced-motion: reduce)")`가 거짓이면 `carousel`로 바꾼다. 참이면 `list`를 유지한다. 미디어 쿼리 변경 이벤트를 듣는다. 사용자가 토글을 누르면 그 선택이 우선한다.
- 첫 클라이언트 렌더는 서버와 같은 `list`여야 한다(하이드레이션 경고 0). 모드 전환은 `useEffect`에서 한다.
- 두 모드의 이미지 `sizes`는 같은 문자열 `(max-width: 767px) 360px, 340px`로 둬 같은 파일을 다시 받지 않게 한다. 모두 lazy, `priority` 금지.

#### 2-5. 목록 모드 `.ch-list`
- `li.ch-item` 6개, 항목 사이 1px `--ch-line`, 항목 위아래 패딩 `--ch-s6`.
- ≥1024: grid `280px | 1fr`, 열 간격 `clamp(32px, 4vw, 64px)`, 이미지 비율 4:5. 768~1023: `220px | 1fr`. <768: 1열, 이미지 16:10이 먼저, 그 아래 텍스트(간격 `--ch-s4`).
- 이미지 위 `.ch-tag`(왼쪽 위 12px 안쪽). 이미지는 링크가 아니다(링크는 `ServiceDetail` 안 하나).

#### 2-6. 캐러셀 모드 `.ch-carousel`
- 무대 `.ch-stage`: 높이 ≥1024 `560px` / 768~1023 `500px` / <768 `420px`. `perspective: 1300px; transform-style: preserve-3d`. 뒤에 `::before`로 `radial-gradient(closest-side, var(--ch-glow), transparent)` 원 하나(가운데, 폭 `min(720px, 90vw)`). `touch-action: pan-y`.
- 카드 `a.ch-card` 6개(무대 전체가 `aria-hidden="true"`, 모든 카드 `tabIndex={-1}`): 크기 ≥1024 `340×460` / 768~1023 `300×410` / <768 `248×336`, `border-radius: var(--radius)`. 이미지 `fill` + `objectPosition`. 아래쪽 그라데이션 `linear-gradient(180deg, rgba(13,13,18,.1) 0%, rgba(13,13,18,0) 40%, rgba(13,13,18,.85) 100%)`. 카드 위: 왼쪽 위 `.ch-tag`, 오른쪽 위 `.ch-num`. 카드 아래: `.ch-kicker` → `span.ch-svc-title` 라벨. 한 줄 소개는 카드에 넣지 않는다(패널과 중복).
- 위치는 인라인 style이 아니라 `data-pos="0|1|-1|2|-2|off"`와 CSS 규칙으로 정한다. 원형 거리(6개 기준 −3~+3, ±3은 `off`).
  | data-pos | transform | opacity | z-index |
  |---|---|---|---|
  | `0` | `translateX(-50%) translateZ(0) rotateY(0) scale(1)` | 1 | 6 |
  | `±1` | `translateX(calc(-50% ± var(--ch-shift))) translateZ(-170px) rotateY(∓38deg) scale(.88)` | .8 | 5 |
  | `±2` | `translateX(calc(-50% ± var(--ch-shift) * 1.85)) translateZ(-300px) rotateY(∓38deg) scale(.74)` | .5 | 4 |
  | `off` | `±2`과 같은 쪽, `visibility: hidden` | 0 | 0 |
  - `--ch-shift`: ≥1024 `380px` / 768~1023 `320px` / <768 `210px`(레이아웃 변수라 `@media` 안에서 바꿔도 된다). `translateZ`는 <768에서 `-95px`·`-170px`.
  - 전환: `transform .6s cubic-bezier(.22,.75,.23,1), opacity .4s`. `filter: blur`는 쓰지 않는다.
  - 가운데 카드 hover 시 이미지 `scale(1.03)`(.6s).
- 마우스: 가운데 카드 클릭 → 그 서비스 페이지로 이동(링크 기본 동작). 옆 카드 클릭 → `preventDefault` 후 그 카드를 선택.
- 스와이프: 무대의 `pointerdown`/`pointerup` 가로 이동이 48px 이상이면 이전·다음. 스와이프 직후의 click은 막는다. wheel 이벤트, `scroll-snap`, 스크롤 가로채기, 자동 넘김은 금지한다.
- 조작 줄 `.ch-controls`(무대 아래, `--ch-s5` 간격): ≥768은 한 줄 grid `auto | 1fr | auto` = `.ch-num` 카운터 `01 / 06`(`aria-hidden`) · 탭 줄 · 이전/다음 버튼. <768은 탭 줄이 첫 줄 전체 폭, 둘째 줄에 카운터(왼쪽)와 버튼(오른쪽).
  - 탭 줄 `div.ch-tabs[role=tablist][aria-label="서비스 선택"]`: `button.ch-tab[role=tab]` 6개, 라벨은 서비스 라벨. `flex-wrap: wrap`(가로 스크롤 금지), 라벨 안 줄바꿈 금지(`white-space: nowrap`). 선택 탭은 `aria-selected="true"`, 흰 글자 + 아래 2px `--ch-action` 막대. 나머지는 `--ch-text-3`. roving tabindex, ←/→ 이동(끝에서 순환), Home/End, 포커스 이동이 곧 선택. `aria-controls`는 패널 id.
  - `button.ch-arrow` 2개: `aria-label="이전 서비스"`·`"다음 서비스"`, 44×44px, 테두리 1px `--ch-line`, 글자 `←`·`→`(`aria-hidden`). 끝에서 순환한다.
  - 캐러셀 영역 안에서 탭 이외 요소에 포커스가 있을 때도 ←/→가 동작한다(벤치마크와 같다). 입력 요소는 없다.
- 패널 `.ch-panel[role=tabpanel]`: `aria-labelledby`는 선택 탭 id. 안에 선택 서비스의 `ServiceDetail` 하나. 패널 위 여백 `--ch-s6`. 패널 전환 애니메이션은 없다(글자가 숨겨지는 순간이 없게).
- 상태 알림 `.ch-sr-only[aria-live=polite]`: `6개 중 3번째 · AI 인플루언서` 형식. `.ch-sr-only`는 이 CSS 파일에 정의한다(전역 sr-only 클래스가 없다).
- reduced-motion에서 사용자가 캐러셀로 전환하면: 전환 없음(`transition: none`), `rotateY`·`translateZ` 없음, 옆 카드(`±1`, `±2`)는 렌더하지 않고 가운데 카드만 보인다.

#### 2-7. 섹션 주석 `.ch-services-note`
`이미지는 서비스 분위기를 보여주는 연출 예시입니다. 대량 제작과 정기 제작은 따로 견적을 드립니다.` (`.ch-caption`, 두 모드 공통으로 섹션 맨 아래 한 번)

### 3. 제작 과정 `#process`
- 바탕 `--ch-bg`, 위 경계 1px `--ch-line`.
- 머리: eyebrow `PROCESS` / h2 `기획안을 먼저 맞추고\n제작합니다` / lead `모든 컨텐츠는 같은 다섯 단계로 진행합니다. 기획안 수정 2회와 최종안 수정 1회가 기본입니다.`
- 탭(`role=tablist`, `aria-label="제작 단계"`): 각 탭은 `span.ch-num` `01` + `span.ch-tab` 라벨. 탭 안에 heading을 넣지 않는다(벤치마크의 버튼 안 h3는 가져오지 않는다).
  - ≥1024: grid `5fr | 7fr`, 열 간격 `clamp(32px, 4vw, 72px)`. 탭은 세로 목록(`aria-orientation="vertical"`, ↑/↓ 그리고 ←/→ 모두 이동, Home/End). 각 행 위아래 패딩 `--ch-s5`, 행 사이 1px `--ch-line`. 선택 행: 번호 `--ch-accent`, 라벨 흰색, 왼쪽 2px `--ch-action` 막대.
  - <1024: 탭은 가로 줄바꿈 칩(`flex-wrap: wrap`), 그 아래 패널. 가로 스크롤 금지.
- 패널 `.ch-step-panel`: `--ch-surface` 바탕, 패딩 `clamp(24px, 4vw, 48px)`, 오른쪽 위에 장식 번호 `.ch-display-num`(`aria-hidden`, `--ch-accent` 30% 불투명). 내용 순서: h3 `.ch-step-title` → `.ch-body` 본문(2문장) → `dl`(`dt.ch-caption` `결과물`, `dd.ch-body`). 패널 최소 높이는 가장 긴 단계 기준으로 고정해 탭을 바꿔도 아래 섹션이 움직이지 않게 한다(`min-height`, 측정 후 값 결정).
- 단계 데이터(`contentHomeProcess`):
  | # | 탭 라벨 | h3 | 본문 | 결과물 |
  |---|---|---|---|---|
  | 01 | 상담 | 만들 컨텐츠를 함께 정합니다 | 사용할 채널과 일정, 가진 자료를 확인합니다. 서비스와 분량을 정하고 견적을 안내합니다. | 작업 범위와 견적 |
  | 02 | 기획 | 기획안으로 방향을 맞춥니다 | 이야기 흐름과 장면 구성을 기획안으로 정리해 전달합니다. 기획안은 두 번까지 수정합니다. | 기획안 |
  | 03 | 제작 | 확정한 기획대로 만듭니다 | 초안은 AI로 빠르게 만들고 연출은 담당자가 직접 다듬습니다. 캐릭터와 장면, 움직임과 자막을 완성합니다. | 최종안 |
  | 04 | 검수 | 최종안을 함께 확인합니다 | 최종안을 전달한 뒤 한 번 수정합니다. 인물과 제품 정보, 자막과 소재의 권리를 확인합니다. | 수정 반영본 |
  | 05 | 납품 | 채널에 맞는 파일로 전달합니다 | 게시할 채널의 규격과 화면 비율에 맞춰 파일을 정리합니다. 추가 화면비와 원본 파일은 상담에서 정합니다. | 최종 파일 |

### 4. CTA `.ch-cta`
- 바탕 `--ch-action`(보라), 글자 흰색. 위아래 패딩 `var(--section-y-sm)`.
- h2 `어떤 컨텐츠가\n필요하신가요?`(기존 `필요 하신가요` 띄어쓰기 오류 수정) / lead `만들고 싶은 컨텐츠와 일정을 남겨주세요. 담당자가 범위와 견적을 안내합니다.` / 버튼 `프로젝트 문의` → `/content/contact`(흰 바탕·`--ink` 글자, `.ch-button` 크기 동일, hover 시 글자색 유지).
- ≥1024 문구 왼쪽·버튼 오른쪽 아래 정렬(`align-items: end`), <1024 세로 쌓기. CTA의 lead는 이 띠에서만 흰색(`.ch-cta .ch-lead { color: #fff }`. 글자 크기 등은 바꾸지 않는다).

## 디자인 토큰 (`.content-home` 범위에 선언)

벤치마크 `style.css`의 값을 사이트 토큰(`--ink #0d0d12 --paper --violet #6b4dff --lavender #a99bff --radius 4px`, Pretendard·Unbounded)에 맞춰 바꿨다. 메인 P4(`.wj-*`)와 역할이 같은 것은 값도 같다.

색:
| 토큰 | 값 | 용도 | 벤치마크 원값 |
|---|---|---|---|
| `--ch-bg` | `var(--ink)` | 페이지·제작 과정 바탕(서브 내비 `is-dark` #0d0d12와 이어짐) | `--paper #f7f5f0` |
| `--ch-surface` | `#15141c` | 서비스 섹션·패널 바탕 | `--service-bg` 파스텔 6색 순환 → 고정 |
| `--ch-text` | `#ffffff` | 제목 | `--ink` |
| `--ch-text-2` | `#c9c9d1` | lead·본문 | `#6d6873` |
| `--ch-text-3` | `#9a9aa3` | 캡션·비활성 탭(바탕 두 종류 모두 대비 4.5:1 이상) | `#88808b` |
| `--ch-line` | `#2a2a32` | 구분선·칩·화살표 테두리 | `--line #dcd8d0` |
| `--ch-accent` | `var(--lavender)` | eyebrow·번호·h1의 `AI` | `#c6b4f6` |
| `--ch-action` | `var(--violet)` | 주 버튼·선택 막대·CTA 띠 | `--purple #7542ee` |
| `--ch-glow` | `rgba(107, 77, 255, .28)` | 무대 가운데 빛 | 블롭 3개 → 원 하나 |

간격·크기(폭·좌우 여백·섹션 세로 여백은 W2 전역 토큰을 그대로 쓴다. `.ch` 전용 값을 새로 만들지 않는다):
| 토큰 | 값 |
|---|---|
| `.ch-container` | W2의 `.l-container`와 같은 규칙(`max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter)`). W2가 `.l-container`를 제공하면 JSX에 함께 붙이고 이 클래스는 별칭으로만 둔다. 서브 내비 좌측선과 맞아야 한다 |
| 섹션 위아래 여백 | `var(--section-y)`(서비스·제작 과정), CTA는 `var(--section-y-sm)` |
| `--ch-s1..s7` | `8 · 12 · 16 · 24 · 32 · 48 · 64px` |
| 섹션 머리 | eyebrow→h2 `s3` · h2→lead `s4` · 머리→본문 `s6` |
| ServiceDetail | meta→h3 `s2` · h3→line `s2` · line→body `s3` · body→칩 `s4` · 칩 사이 `s1` · 칩→가격 줄 `s4` · 가격 줄→옵션 줄·범위 안내(`.ch-price-note`, `.ch-note`) `4px` · →링크 `s4` |
| 히어로 문구 | eyebrow→h1 `s4` · h1→lead `s4` · lead→서비스 줄 `s2` · →버튼 `s5` |
| 모서리 | 카드·이미지·패널·칩·탭·버튼 모두 `var(--radius)`(4px). 벤치마크 18px는 버린다 |
| 칩 `.ch-chip` | 패딩 `8px 12px`, 테두리 1px `--ch-line` |
| 서비스 탭 `.ch-tab` 버튼 | 패딩 `10px 14px`, 최소 높이 44px |

글자: **W2 역할 토큰만 쓴다.** 글자 크기·굵기·행간·자간·서체 값의 정본은 `AUDIT_TYPOGRAPHY.md` 1.2 역할표이고, W2가 그것을 `app/globals.css`(토큰 `--ff-text`·`--ff-display`·`--ff-mono`, 레이아웃 토큰 `--gutter`·`--container`·`--section-y`·`--section-y-sm`)와 역할 클래스(`.t-h1` `.t-h2` `.t-h2--latin` `.t-h3` `.t-h3--feature` `.t-lead` `.t-body` `.t-small` `.t-caption` `.eyebrow` `.eyebrow-ko` `.t-nav` `.t-button`(`--sm`/`--lg`) `.t-chip`)로 구현했다. 메인 P4(`.wj-*`)와 같은 역할은 같은 W2 역할을 쓴다.
- 시작 전에 `RESULT_W2.md`, `app/globals.css`, `components/guide/type.css`(W2가 다른 파일에 뒀으면 그 파일)에서 실제 이름을 확인한다. 이름이 AUDIT와 다르면 W2 실제 이름을 쓰고 RESULT에 대응표를 적는다.
- 적용 방법: W2가 역할 클래스를 제공하면 JSX에서 기능 클래스와 역할 클래스를 함께 붙인다(예: `className="ch-title t-h2"`). W2가 역할별 CSS 변수를 제공하면 `content-home.css`에서 `var(--…)`로만 참조한다. 어느 쪽이든 **`content-home.css`에는 font-size·line-height·letter-spacing·font-weight·font-family의 숫자·글꼴 이름 리터럴을 쓰지 않는다**(값은 `var(--…)`만). `!important`도 쓰지 않는다. 예외는 아래 표에 "예외"로 적은 두 가지뿐이다.
- `@media` 안(reduced-motion 블록 포함)에서 글자 속성을 다시 선언하지 않는다. 반응은 역할 토큰의 clamp가 맡는다.

| 역할(이 페이지) | 클래스 | W2 역할(AUDIT 1.2) | 비고 |
|---|---|---|---|
| 히어로 제목 h1 | `.ch-hero-title` | `.t-h1` | |
| 섹션 제목 h2 | `.ch-title` | `.t-h2` | 메인 `#divisions h2`와 같은 역할 |
| eyebrow(라틴) | `.ch-eyebrow` | `.eyebrow` | `--ff-display`, 대문자 |
| lead | `.ch-lead` | `.t-lead` | max-width 34em은 배치 속성 |
| 히어로 서비스 줄 | `.ch-hero-services` | `.t-body` | |
| 서비스명(h3·카드 span) | `.ch-svc-title` | `.t-h3` | 카드 위 span과 패널 h3가 같은 값 |
| 한 줄 소개 | `.ch-svc-line` | `.t-lead` | |
| 본문 | `.ch-body` | `.t-body` | |
| 가격 줄 | `.ch-price` | `.t-body` | 금액 `strong.ch-price-amount`는 **예외 1**: `font-weight` 700(AUDIT 허용 굵기, 크기·행간은 상속). `font-variant-numeric: tabular-nums` |
| 가격 옵션 줄·범위 안내 | `.ch-price-note`, `.ch-note` | `.t-small` | |
| 캡션·주석(한글 문장) | `.ch-caption` | `.t-small` | 섹션 주석, `dt 결과물` |
| 탭·칩·토글 | `.ch-tab`, `.ch-chip`, `.ch-toggle` | `.t-chip` | P4 `.wj-tab`·`.wj-chip`과 같다 |
| 상태 태그 | `.ch-tag` | `.t-caption` | P4 `.wj-tag`와 같다 |
| 영문 kicker | `.ch-kicker` | `.eyebrow` | |
| 번호·카운터 | `.ch-num` | `.eyebrow` | P4 `.wj-num`과 같다 |
| 단계 제목 h3 | `.ch-step-title` | `.t-h3` | |
| 장식 번호 | `.ch-display-num` | **예외 2**(`aria-hidden` 장식): 크기는 `.t-h1` 역할 크기 토큰, `font-family: var(--ff-display)`, 굵기 400 | W2가 h1 크기를 변수로 주지 않으면 `.t-h1` 클래스를 붙이고 family만 `var(--ff-display)`로 둔다 |
| 링크 | `.ch-link` | `.t-button` | |
| 버튼 | `.ch-button` | `.t-button--lg` | 메인 히어로 `견적 문의`와 같은 역할 |

글꼴 규칙:
- 한글이 한 글자라도 들어가는 요소는 `--ff-text` 역할(Pretendard)이다. `.ch-*` CSS에서 font-family를 선언하지 않는다(예외 2만 `var(--ff-display)`).
- Unbounded(`--ff-display`, 한글 글리프 없음)는 `.eyebrow` 역할(`.ch-eyebrow`·`.ch-kicker`·`.ch-num`)과 `.ch-display-num`(라틴·숫자)에만 쓰인다. `--ff-display`는 `var(--ff-text)` 폴백을 갖는다.
- 최소 글자 크기는 AUDIT 규칙대로 12px(`.t-caption`)이다. 반 픽셀 크기와 한글 양수 자간을 쓰지 않는다.
- 줄바꿈: `word-break: keep-all`. 제목은 데이터의 `\n`에서만 끊는다(`white-space: pre-line`, `text-wrap: balance`). **h2 한 줄은 공백 포함 11자 이하, h1 한 줄은 10자 이하**로 써서 360px에서 의도하지 않은 줄바꿈이 없게 한다.
- 같은 역할을 다른 요소에 쓸 때(예: 카드 위 `span.ch-svc-title`과 패널 `h3.ch-svc-title`) 색 외의 글자 속성을 덮어쓰지 않는다.

## 벤치마크 반영
- 가져온다: 히어로 아래 왼쪽 문구 배치와 어두운 그림자, 섹션 머리(eyebrow → 큰 제목 → 짧은 설명), 스튜디오좋식 3D 카드 배치·화살표·순번·키보드·터치 이동, 가운데 카드 클릭 시 서비스 상세 이동, Superpixel식 단계 탭(번호 + 라벨, 선택 단계만 강조), 푸터 직전 큰 CTA, reduced-motion 처리, 짧은 존댓말 문장 톤.
- 버린다: 8~11px 글자, 브레이크포인트마다 다른 글자 크기, 서비스별 파스텔 배경·블롭 순환, 배경 큰 글자(`MAKE STORIES.`), 18px 둥근 카드, 카드 `blur` 필터, 점(dot) 내비(서비스명 탭으로 바꾼다), 벤치마크의 히어로 영상 파일 자체(히어로 영상은 사용자 쇼릴 슬롯으로만 받는다)와 `CONTENT DESIGN · V01` 같은 시안 표기, 제작 예시 필터·상세 창(레퍼런스를 이 페이지에 두지 않는다), 인사이트 카드, 벤치마크 서비스명(`웹툰 제작`·`브랜드 콘텐츠`·`SNS 광고 콘텐츠`·`편집·클리퍼`) 및 `콘텐츠` 표기(사이트 표기는 `컨텐츠`), 인라인 style로 위치를 쓰는 방식.

## 카피 규칙
- COMMON.md 금지 문체를 지킨다. 다음도 금지한다: "A가 아니라 B", "A 없이", "~을 통해", "~에 대해", "최고·최저·보장·업계 1위", 근거 없는 수치·퍼센트·배수, 성과 약속("매출이 오릅니다" 류).
- AI 인플루언서: `FACTS_AI_INFLUENCER.md`의 "쓰면 안 되는 표현"을 지킨다. `운영 중`, `게시 중`, 팔로워·조회수·성과, 목소리·립싱크, 고화질, 고객 납품·채택, 제품 효과 암시 금지. 이미지에는 `AI 가상인물` 표기를 붙인다.
- 문장은 짧은 존댓말(`~합니다`)이다. 한 문장에 쉼표는 1개까지. 문장 끝에 쉼표절을 이어 붙이지 않는다.
- 마침표: 제목·라벨·칩·캡션·태그·버튼·링크, 한 문장짜리 lead와 한 줄 소개는 마침표를 찍지 않는다. 두 문장 이상(서비스 설명, 단계 본문, 제작 과정 lead, CTA lead, 섹션 주석)은 문장마다 찍는다.
- 표기 통일: `컨텐츠`, `AI 인플루언서`, `AI 가상인물`, `모션그래픽`, `브랜드 홍보 영상`, `SNS 광고 영상`, `모션코믹`, `9:16`, `1080p`, 금액은 `10만 원`·`7.5만 원`(만 원 단위, 띄어쓰기 `만 원`).
- 카피를 쓴 뒤 `humanizer` 기준(번역투·과한 쉼표·AI 어휘·구조 반복)으로 한 번 점검하고, 고친 문장과 이유를 RESULT에 적는다.

## P4와 공유
- `lib/home-journey.ts`가 있으면(P4 커밋 후) 메인 컨텐츠 탭의 한 줄 설명은 `contentHomeServices`의 `line`을 import해서 같은 문자열을 쓴다. 메인과 `/content`가 같은 서비스를 다르게 설명하지 않게 하기 위해서다. P4 개정본(2026-10-14)은 이미 2-1 표와 같은 `line`·칩을 적어 두었으므로 화면 문구는 바뀌지 않고 출처만 한 곳이 된다. 문구가 달랐던 곳이 있으면 RESULT에 적는다. P4의 AI 인플루언서 미디어 라벨(`87언니(AI 가상인물) 출연 · 제안용 시안`)은 메인 전용이므로 가져오지 않는다(`/content`에는 고객 작품이 없다).
- 없으면 이 항목은 건너뛰고 RESULT에 "P4 미적용, 공유 보류"라고 적는다.

## 접근성·성능·SEO
- 섹션마다 `aria-labelledby`. 캐러셀은 APG 탭 캐러셀 패턴(`role=region` + `aria-roledescription="캐러셀"`, 탭 = 슬라이드 선택). 무대는 장식이므로 `aria-hidden="true"`이고 그 안의 카드 링크는 모두 `tabIndex=-1`이다. 서비스로 가는 키보드 경로는 패널의 `서비스 자세히 보기` 링크 하나다.
- 키보드: 히어로 버튼, 토글, 서비스 탭, 이전·다음, 패널 링크, 단계 탭, CTA 버튼이 모두 Tab으로 닿고 `:focus-visible` 외곽선(전역 lavender 3px)이 보인다. CTA 띠(보라 바탕)에서는 외곽선 색을 흰색으로 바꾼다.
- 자동 넘김 없음. 움직임은 사용자 조작에만 반응한다.
- `prefers-reduced-motion: reduce`: 초기 목록 모드, `.content-home` 안 모든 transition·animation 0, 3D transform 없음, 히어로 영상(슬롯에 값이 있을 때) 자동재생 안 함.
- 이미지: `next/image`만 쓴다(`fill` + 비율 박스, `sizes` 지정). `priority`는 히어로 이미지 하나뿐이다. 모든 미디어 박스는 `aspect-ratio`나 고정 높이를 가져 CLS가 생기지 않는다(목록↔캐러셀 전환은 첫 화면 밖에서 일어난다).
- JS: 클라이언트 섬은 `hero-media.tsx`, `service-showcase.tsx`, `process-tabs.tsx` 세 개뿐이다. `hero-media.tsx`는 `video`가 없으면 이미지 외에 아무것도 하지 않는다(이벤트·effect 없음). 이벤트는 pointer·keydown·click, 영상 `playing`, `matchMedia`(reduced-motion). resize 리스너는 쓰지 않는다(이동 거리는 CSS 변수).
- 인라인 style: 새 JSX에 `style=` 속성 0개. `next/image`의 `style` prop도 쓰지 않는다(`objectPosition`은 `data-focus` 같은 속성 대신 **클래스 6개**(`.ch-focus-webtoon` 등)로 CSS에 둔다).
- SEO: h1 1개. 메타 title은 기존 `컨텐츠 대행`, description은 범위 5의 새 summary. 서버 HTML(목록 모드)에 6개 서비스명·설명·`/content/services/{id}` 링크가 모두 있다. JSON-LD는 추가하지 않는다. 두 빌드 모두 `/content` HTML에 고객 작품 흔적(`reference-review`, `BWL`, `DR's Secret`, `닥터시크릿`, `힐러넷`, `HEALERNET`, `YoFree`, `요프리`, `87언니`)과 `/content/work`, `home-references`, `work-card`가 0건이다. 컨텐츠 서브 내비와 `.content-home` 안에 `작업 사례` 문구가 0건이다(전역 헤더·푸터의 마케팅·개발 링크는 W1 이후 상태 그대로 둔다).

## 테스트 `tests/content-home.test.mjs`
직렬 테스트에 포함되게 만들고 `lib/content-home.ts`, `lib/content-pricing.ts`, `lib/content.ts`를 직접 import한다.
1. 서비스 id 순서가 정확히 `webtoon, animation, ai-influencer, motion-graphics, brand-film, ad`이고 라벨을 ` · `로 이으면 필수 문구와 같다. 각 id가 `lib/content.ts`에 division `video`로 있다. `href`가 `/content/services/{id}`다. 이미지 파일이 `public/`에 있다.
2. `startingPrice(id)`의 `amount`와 `line`이 2-3 표와 정확히 같다(예: brand-film `25만 원부터 · 30초 기준 · 부가세 별도`, webtoon `웹툰 제작 12컷 10만 원부터 · 부가세 별도` + `note` `모션코믹 영상화 옵션 · 30초 7.5만 원부터`, ai-influencer `10만 원부터 · 캐릭터 1명 세팅 + 이미지 5장 기준 · 부가세 별도`). 모든 `line`이 `부가세 별도`로 끝난다. `startingPrice(id, false)`는 `null`이다. `SHOW_STARTING_PRICE`가 export되고 `components/content-home/*`에서 가격 표시 여부를 다른 조건으로 분기하지 않는다(grep). `formatWon` 예시 4개가 맞다. `contentPricing`의 모든 금액이 `PRICING_FINAL` 값(테스트에 상수로 적는다)과 같다.
3. 모든 카피 문자열에 금지 패턴이 없다: `/을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|%|\d+배|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질|콘텐츠|coming soon|준비 중|공개 예정|곧 공개/i`. AI 인플루언서만 `scopeNote === "계정 게시·운영은 별도 견적"`이고 다른 서비스에는 `scopeNote`가 없다.
4. 문장 규칙: 모든 문장의 쉼표 ≤ 1개. 두 문장 이상 필드는 각 문장이 `.`로 끝나고, 한 문장 필드(라벨·한 줄 소개·칩·태그·탭·h3·한 문장 lead)는 `.`로 끝나지 않는다. h2 각 줄 ≤ 11자, h1 각 줄 ≤ 10자(공백 포함).
5. AI 인플루언서 항목의 `imageTag`와 alt에 `AI 가상인물` 또는 `가상인물`이 있다.
6. `lib/content.ts` video `summary`에 필수 문구가 있고 `브랜드 홍보 및`이 없다.
7. `app/(public)/[division]/page.tsx`가 `ContentHome`을 import하고 `StudioHome`을 import하지 않는다.
8. `components/content-home/*`와 `lib/content-home.ts`에 `style=`, `HomeReferences`, `/content/work`, `작업 사례`, `GuideMedia`가 0건이다. `content-home.css`에 `!important`가 0개이고, `font-size|line-height|letter-spacing|font-weight|font-family` 선언의 값이 모두 `var(`로 시작한다. 예외는 `.ch-price-amount`의 `font-weight: 700`과 `.ch-display-num`의 `font-family: var(--ff-display)`뿐이다. `@media` 블록 안에는 이 다섯 속성 선언이 0개다. `Unbounded` 글꼴 이름 리터럴이 0개다(`--ff-display`로만 참조).
9. `lib/home-journey.ts`가 있으면 그 컨텐츠 탭 한 줄 설명 6개가 `contentHomeServices`의 `line`과 같다.
10. 히어로 슬롯: `contentHomeHero.video`가 커밋 상태에서 `undefined`다. 타입 `HeroVideo`가 `src`·`poster` 두 문자열 필드를 갖는다. `hero-media.tsx`가 `video`가 없을 때 `<video`를 렌더하지 않는 분기를 갖는다(소스 확인).
11. 삭제된 경로를 되살리지 않는다: `next.config.*`에 `/content/work` 관련 redirect·rewrite가 없고, `GuideNav`의 video 분과 탭 데이터에 `작업 사례`·`/content/work`가 없다.

## 완료 기준 (Sonnet이 Playwright로 확인)
빌드·서버는 한 번에 하나만 띄운다. 검토 빌드는 `.env.local` 기본값, 기본 빌드는 `$env:NEXT_PUBLIC_AIO_REFERENCE_REVIEW='0'; npm run build`. 각각 `npm run start -- -p 3216`으로 띄워 확인하고 끈다.

- [ ] `npm run typecheck` PASS, `npm run lint` 오류 0(기존 경고 1개 허용), 직렬 테스트(새 테스트 포함) 실패 0, `npm run build` PASS(두 빌드).
- [ ] `/content`에 `.home-references`·`.work-card`·`Insights`·`Services`(영문 제목)·`콘셉트 이미지` 문구가 없다. 섹션 순서가 히어로 → `#services` → `#process` → `.ch-cta`다. 히어로 버튼이 `#services`로 이동하고 섹션 머리가 헤더·서브 내비 아래에 보인다. 페이지의 모든 `a[href]`가 200 응답 경로다(`/content/work` 0건). `GET /content/work`는 W1 그대로 404이고 `Location` 헤더(리다이렉트)가 없다. 서브 내비에 `작업 사례` 탭이 없다.
- [ ] 1440 / 1024 / 768 / 390 / 360px(두 빌드, 캐러셀·목록 두 모드)에서 `document.documentElement.scrollWidth <= innerWidth`, 콘솔 error 0(하이드레이션 경고 포함), 깨진 이미지 0(`img.naturalWidth > 0`, lazy 이미지는 스크롤 후 확인), `h1` 1개.
- [ ] 타이포 = 역할 토큰(각 폭, 두 모드에서 측정): `.ch-hero-title`, `.ch-title`, `.ch-eyebrow`, `.ch-lead`, `.ch-hero-services`, `.ch-svc-title`, `.ch-svc-line`, `.ch-body`, `.ch-price`, `.ch-price-note`, `.ch-note`, `.ch-caption`, `.ch-tab`, `.ch-chip`, `.ch-tag`, `.ch-kicker`, `.ch-num`, `.ch-step-title`, `.ch-link`, `.ch-button` 그룹마다 `getComputedStyle`의 `fontSize / lineHeight / letterSpacing / fontWeight / fontFamily` 조합이 1종류다. 그 값은 (a) 대응표의 W2 역할을 AUDIT 1.2 값으로 해당 폭에서 계산한 값과 같고, (b) 같은 역할 클래스를 가진 다른 요소와 같다: `.ch-title` = 메인 `/`의 `#divisions h2`, `.ch-hero-title` = 메인 h1(같은 `.t-h1`일 때), `.ch-tab`·`.ch-chip`·`.ch-tag`·`.ch-num`·`.ch-body` = P4의 `.wj-tab`·`.wj-chip`·`.wj-tag`·`.wj-num`·`.wj-body`(P4가 있으면). 캐러셀 패널의 `ServiceDetail`과 목록 항목의 `ServiceDetail`이 같은 값이다. 측정표를 RESULT에 적는다.
- [ ] 강제 규칙 의존 없음: 측정 시점에 review.css에 `.guide-page h1`·`.guide-page h2`의 `!important` 글자 규칙이 없다(`grep`). `.ch-hero-title`과 `.ch-title`의 계산값을 만든 규칙이 W2 역할 클래스·토큰임을 CSSOM/DevTools로 확인해 RESULT에 적는다.
- [ ] 정렬: 각 폭에서 `.ch-head`의 eyebrow·h2·lead, 히어로 eyebrow·h1·lead, 패널 h3, CTA h2의 `getBoundingClientRect().left`와 `.guide-subbrand`의 left 차이가 1px 이하다.
- [ ] 한글 글꼴: 자기 텍스트에 한글이 있는 요소 중 computed `fontFamily`가 `Unbounded`로 시작하는 요소 0개.
- [ ] 줄바꿈: 360px에서 h1·각 h2의 줄 수(높이 ÷ 계산 line-height, 반올림)가 데이터의 `\n` 수 + 1과 같다. `.ch-hero-services`와 서비스 탭에서 항목 안 줄바꿈이 없다(각 span·탭의 `getClientRects().length === 1`).
- [ ] 캐러셀(동작 허용 환경, 1440·768·390): 하이드레이션 후 `data-mode="carousel"`. 탭 6개 라벨이 순서대로 필수 문구와 같다. 탭에서 →/←/Home/End로 선택이 바뀌고 패널 h3·카운터·`data-pos="0"` 카드·`aria-live` 문구가 함께 바뀐다(6→1 순환 포함). 이전·다음 버튼도 같다. 390px에서 pointer 스와이프(dx −80px) 시 다음 서비스로 넘어가고, 무대의 computed `touch-action`이 `pan-y`다. 옆 카드 클릭은 선택만 하고 이동하지 않는다. 가운데 카드 클릭과 패널 링크 클릭은 `/content/services/{id}`로 이동한다. 캐러셀 영역의 Tab 순서에서 서비스 링크는 1개다. 무대가 `aria-hidden="true"`이고 그 안 링크가 모두 `tabindex="-1"`이다. 코드에 `wheel` 리스너·`scroll-snap`·`setInterval`/자동 넘김이 없다(grep).
- [ ] 목록 모드: 토글 `aria-pressed="true"`일 때 `li.ch-item` 6개가 모두 보이고 각 항목에 서비스명·한 줄 소개·설명·칩 3개·가격·링크가 있다. 다시 누르면 캐러셀로 돌아오고 선택 서비스가 유지된다.
- [ ] JS 끈 상태(`javaScriptEnabled: false`): 목록 6개, 링크 6개, 가격 6개가 보인다.
- [ ] reduced-motion(`emulateMedia({ reducedMotion: "reduce" })`): 초기 `data-mode="list"`. `.content-home` 안 요소의 `transition-duration`이 모두 0s. 캐러셀로 바꾸면 `data-pos="0"` 카드만 렌더되고 computed transform에 회전·Z 이동이 없다.
- [ ] 가격: 6개 `.ch-price`의 `textContent`(공백 정규화)가 2-3 표의 `line`과 정확히 같고 모두 `부가세 별도`로 끝난다. 웹툰에만 `.ch-price-note` `모션코믹 영상화 옵션 · 30초 7.5만 원부터`가 있다. 화면에 `맞춤 견적`이 없다. 360px에서 가격 줄이 ` · ` 구분 단위 안에서 끊기지 않는다. 끄기 확인: `SHOW_STARTING_PRICE=false`로 임시 빌드(또는 테스트 렌더)해 `.ch-price`·`.ch-price-note`가 0개이고 빈 자리가 없음을 확인한 뒤 `true`로 되돌린다(못 하면 NOT_RUN).
- [ ] AI 인플루언서: 카드·목록 이미지 태그에 `AI 가상인물`이 보인다. ServiceDetail에 `계정 게시·운영은 별도 견적` 한 줄이 캐러셀 패널·목록 항목 모두에 보이고, 다른 서비스에는 없다. 다른 이미지에는 `연출 예시`가 보인다.
- [ ] 히어로(`video` = `undefined`, 커밋 상태): `.ch-hero` 안에 `<video>`·`.ch-hero-pause`가 0개이고 정지 이미지와 `연출 예시` 태그만 있다. 페이지에 `coming soon`·`준비 중`·`공개 예정`·`곧 공개`·`쇼릴` 문구가 0건이다. 태그는 390·360px에서 버튼·문구와 겹치지 않는다(bounding rect 교차 0). LCP 요소가 히어로 이미지다.
- [ ] 히어로 슬롯 동작(임시 값으로 로컬 확인 후 되돌림): `video`를 채우면 `<video muted loop playsInline autoplay>`가 이미지 위에 렌더되고 재생되며(`currentTime` 증가), `.ch-hero-pause`로 멈추고 다시 재생된다(`aria-label` 전환). `연출 예시` 태그는 사라진다. reduced-motion에서는 자동재생하지 않는다(`paused === true`). 확인 후 `undefined`로 되돌렸음을 `git diff`로 보인다.
- [ ] 제작 과정: 탭 5개, 키보드(↑/↓/←/→/Home/End) 동작, 탭 전환 시 `#process` 아래 섹션의 top 좌표가 변하지 않는다(패널 min-height). `Blender`가 페이지에 없다.
- [ ] 고정 요소 겹침: 390·360px에서 서비스 조작 줄과 제작 과정 탭을 화면 아래쪽에 두었을 때 `.floating-contact`·`.back-to-top`과 이전·다음 버튼, 탭의 bounding rect 교차가 0이다. 겹치면 조작 줄 아래 여백을 늘려 해결하고 RESULT에 적는다(고정 요소 CSS는 수정 금지).
- [ ] 이미지 요청: 페이지를 끝까지 스크롤하고 모드를 두 번 바꾼 뒤 `performance.getEntriesByType("resource")`에서 서비스 카드 원본 6개(`video-webtoon`, `video-animation`, `video-ai-influencer`, `renewal/video`, `video-brand-film`, `video-sns-ad`)에 대한 `/_next/image` 요청이 원본마다 1개다.
- [ ] 두 빌드의 `/content` HTML에 고객 작품 흔적 문자열(접근성·SEO 항목의 목록)이 0건이다.
- [ ] `scripts/verify-reference-pages.mjs`를 실행할 수 있으면 실행해 `/content` 방문이 통과한다(못 하면 NOT_RUN과 이유).
- [ ] 1440·768·390px 전체 화면 캡처(두 모드)와 캐러셀 서비스 6개 각각의 1440 캡처, reduced-motion 390 캡처를 `.qa/p3/`에 저장하고 직접 열어 확인한 소감(글자 크기·정렬·간격·한국어 어색함)을 RESULT에 적는다. 실행하지 못한 항목은 NOT_RUN으로 적는다.

## 사용자 결정 (2026-10-14 확정분과 남은 것)
확정(구현 기준, RESULT에 "반영"으로 적는다):
1. **시작 가격 표시** — 표시한다. 형식과 문자열은 2-3 표. `SHOW_STARTING_PRICE = false` 한 줄로 전부 끈다.
2. **히어로 쇼릴** — 사용자가 컨텐츠 쇼릴을 따로 준다. 이번에는 영상 슬롯(`contentHomeHero.video`)과 정지 이미지 대체를 만든다. 받을 사양: 10~15초 무음, 1920×1080 H.264 mp4, 3MB 이하, 공개 가능한 장면만, poster webp 1장. 받으면 파일을 `public/`에 두고 그 한 필드만 채운다.
3. **AI 인플루언서 범위** — 브랜드 전용 AI 인물 제작(캐릭터 세팅, 그 인물이 나오는 이미지·숏폼 영상). 계정 게시·운영은 `계정 게시·운영은 별도 견적` 한 줄.

남은 결정(RESULT와 최종 보고에 그대로 올린다):
4. **카드 이미지** — 지금은 AI로 만든 연출 이미지 6장(모두 `연출 예시` 표기). 고객 작품 공개 권리가 풀리면 실제 작업 스틸로 바꿀지.
5. **쇼릴 위 표기** — 쇼릴이 들어오면 `연출 예시` 태그는 사라진다. 쇼릴에 고객 작업이나 AI 가상인물 장면이 들어가면 별도 표기(`AI 가상인물` 등)가 필요한지.

## RESULT_P3.md에 반드시 적을 것
변경 파일 목록, 결정 사항(카피 최종본과 humanizer 점검 내역, `objectPosition` 조정값, 패널 min-height 값), W2 역할 이름 대응표(AUDIT 이름과 다르면), 히어로 슬롯 임시 확인에 쓴 값과 되돌린 증거, 가격 끄기 확인 결과, 검증 명령과 결과(두 빌드), Playwright 측정표(폭·모드별 타이포·정렬·넘침), 사용자 결정 1~3 반영 내역과 남은 결정 4~5, 미해결: `studio-home.jsx` 미사용 파일 삭제 여부, 서비스 상세 재작업 때 `lib/content-pricing.ts` 재사용(웹툰 함께 제작 합계 포함), P4 공유 적용 여부, `about.jsx`·`main.jsx`·`lib/guide-content.ts`의 옛 문구(`브랜드 홍보 및 SNS 광고 영상`)가 남아 있으면 그 위치.
