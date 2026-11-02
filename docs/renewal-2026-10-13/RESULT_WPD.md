# RESULT WP-D — `/content` 홈 재정렬 + `/content/contact`

2026-10-14 · 구현: Opus 서브에이전트(WP-D) · 기준 HEAD `c0ab7d9` · 커밋·push·배포·설치 없음 · `next build`/`dev`·브라우저 실행 안 함(지시)
(BRIEF_P2R 3-2는 결과 파일명을 `RESULT_P2R_D.md`로 적었지만 조율자 지시대로 `RESULT_WPD.md`로 썼다.)

**상태: 구현 완료. typecheck PASS, lint 오류 0(경고 1 = 기존 `tests/local-admin.test.mjs:110`), 직렬 테스트 95개 중 pass 94 · fail 0 · skipped 1(기존) · todo 0. build·브라우저·HTTP 검사는 NOT_RUN(V 몫).**
작업트리에는 WP0FIX·WP-A/B/C의 미커밋 파일이 함께 있는 상태에서 실행했다.

## 1. 변경 파일 (모두 소유 범위 안)

| 경로 | 내용 |
|---|---|
| `lib/content-home.ts` | 카피 정리(아래 4절), 히어로 이미지 → `CONTENT_SITE_ASSETS.hero`, 태그는 `MEDIA_TAGS` 상수, 보조 버튼·영상 버튼 문구 추가, 제작 과정 5단계 → 4단계. 가격은 `./content-pricing.ts` re-export만(기존 import·테스트 유지) |
| `components/content-home/content-home.tsx` | 루트 `div.cs-home`(`guide-page`·`GuideNav` 제거). `.cs-t-*` 역할·`.cs-container`·`.cs-btn`·`.cs-tag`만 사용. 섹션 머리는 공용 `CsSectionHead`. 섹션마다 `data-cs-section` |
| `components/content-home/hero-media.tsx` | 서버 컴포넌트로 전환(이미지만). `video`가 있을 때만 `HeroVideoLayer` |
| `components/content-home/hero-video.tsx` (신규, client) | 쇼릴 층. 마운트 후에만 `<video>`(서버 HTML autoplay 0), 헤더 움직임 토글(`useCsMotion`)·reduced-motion 연동, 개별 재생/정지 버튼 44×44 |
| `components/content-home/service-showcase.tsx` | P3-2 수정(옆 카드 클릭·aria-hidden 포커스), 패널 높이 고정, cs 역할 클래스 |
| `components/content-home/service-detail.tsx` | `startingPrice`를 `@/lib/content-pricing`에서 직접 import(P3-5). 가격은 서비스 히어로와 같은 `.cs-price` 칩, 링크는 `.cs-btn--ghost` |
| `components/content-home/process-tabs.tsx` | P3-3 수정(번호·라벨 기준선), 장식 번호 `cs-t-num`을 패널 흐름 안으로 |
| `components/content-home/content-home.css` | 전면 재작성. 글자 속성 선언 0, 색 리터럴 0(`--cs-*`와 `color-mix`만), 선택자 전부 `.cs-site .cs-home`, 트랜지션은 `no-preference` 안에서만, `!important` 0 |
| `components/content-site/contact/contact-page.tsx` | 스텁 → 완성(서버): 히어로 + 옆 `가격 기준` 3줄 + `ContactFlow` |
| `components/content-site/contact/contact-flow.tsx` (신규, client) | 서비스 선택 카드 6개(폼 밖) + `CsInquiry service={chosen}` + 미선택 제출 안내(G0 6) |
| `components/content-site/contact/copy.ts` (신규) | 문의 페이지 문구(순수 데이터, 테스트 대상) |
| `components/content-site/contact/contact.css` (신규) | 배치만. 선택자 `.cs-site .cs-contact`, 글자 속성 0 |
| `app/(content-site)/content/page.tsx` | 주석만 |
| `app/(content-site)/content/contact/page.tsx` | meta description 문장 정리(아래 3-6) |
| `components/content-site/theme.css` | **끝의 WP0 임시 다리 블록(76줄)만 삭제.** 다른 줄은 손대지 않음(WP0FIX가 같은 파일을 수정 중) |
| `tests/content-home.test.mjs` | 새 규칙으로 재작성(13개) |
| `tests/content-contact.test.mjs` (신규) | 문의 페이지 4개 |
| `tests/content-site.test.mjs` | `7-1`, `8-1`의 `todo` 옵션만 제거 |
| `tests/seo-http.mjs` | `/content` 블록 갱신, `/content/contact`(+`?service=webtoon`) 블록 추가 |

## 2. VERIFY_P34 P3-1~5 처리

| # | 처리 |
|---|---|
| P3-1 버튼 크기 | 홈 버튼 3개(히어로 주·보조, 상담 띠)를 `.cs-btn--lg`(16px, 56px)로 통일. 서비스 히어로 `CsHeroCopy` 버튼과 같은 값이다. 헤더 `상담 신청`은 sm(15px, 셸 규칙). `t-button` 계열 0 |
| P3-2 옆 카드 클릭 | 원인은 `.ch-stage`의 `transform-style: preserve-3d`(뒤로 물러난 카드보다 z=0 무대가 먼저 hit). **preserve-3d 제거, `perspective`만 유지**: 카드 3D 모양은 같고 앞뒤는 기존 z-index(6/5/4)가 정한다. 옆 카드 `onClick` → `preventDefault` + 선택(기존 로직 유지). aria-hidden 무대 안 포커스 경고는 카드에 `onMouseDown={preventDefault}`로 막음(클릭·이동은 그대로, tabIndex -1 유지) |
| P3-3 탭 번호·라벨 10px 어긋남 | 원인 `.t-chip { min-height:44px }`(guide CSS)는 이제 로드되지 않고 클래스도 쓰지 않는다. 추가로 번호·라벨을 `span.ch-step-tab-inner`(`align-items: baseline`)로 묶고 버튼은 `align-items: center` → 두 글자가 같은 기준선, 묶음은 세로 가운데 |
| P3-4 390×844 CTA 가림 | 컨텐츠 셸에는 `.floating-contact`가 없고 모바일 하단 바는 서비스 페이지에서만 렌더(`mobile-bar.tsx:39`). 히어로 높이는 `min-height: max(560px, min(920px, calc(100svh - var(--cs-header-h))))`로 바꿔 내용이 길어도 잘리지 않음(고정 height 제거) |
| P3-5 가격 모듈 위치 | WP0이 만든 `lib/content-pricing.ts`를 컴포넌트가 직접 import. `lib/content-home.ts`는 re-export만. 테스트 2가 import 경로·금액 리터럴 0을 확인 |

## 3. 결정

1. **h1**: 브리프 안 `AI로 빠르게\n전문가가 완성합니다`는 둘째 줄이 10자라 9자 규칙(5-1 f)에 걸린다. `AI로 빠르게\n전문가가 꼼꼼하게`(7자/9자)로 정했다. 제작 단계 문장(`초안은 AI로 빠르게 만들고 연출은 담당자가 직접 다듬습니다`)과 뜻이 맞는다. `AI`만 `--cs-accent-text`.
2. **히어로 이미지**: `/renewal/brand-film-v03.webp`(정물 사진) → `CONTENT_SITE_ASSETS.hero`(`/content-site/hero.webp`, 보라 유리 리본·필름 띠, 왼쪽이 비어 문구 자리). 결정 10-1(벤치마크 AIO 생성 이미지는 `연출 예시` 표기로 사용)에 따름. 태그 `연출 예시`, `object-position: 72% 50%`(모바일 세로 화면에서 오브젝트 쪽). 거절 시 `lib/content-home.ts` 한 줄.
3. **eyebrow**: `AIO MAKE STUDIO` → `AI CONTENT PRODUCTION`. 헤더 잠금 `AIO MAKE | CONTENT STUDIO`(WP0FIX 후 모바일에서도 보임)와 같은 말을 되풀이하지 않고 h1의 `AI`와 이어지게 했다.
4. **제작 과정 5단계 → 4단계**: 서비스 페이지 과정은 4단계 고정(BRIEF_P2R_SERVICES 0-3)인데 홈이 `같은 다섯 단계`라고 하면 사이트 안에서 말이 어긋난다. `검수`를 `제작`에 합쳐(`최종안을 전달한 뒤 한 번 수정합니다`) 상담·기획·제작·납품으로 맞췄다. 이 과정에서 VERIFY_P34 4절이 지적한 근거 없는 약속(`권리를 확인합니다`)과 미확인 항목(`원본 파일`, 열린 질문 7)을 뺐다.
5. **쇼릴 슬롯**: `contentHomeHero.video` 한 필드(커밋 값 `undefined`). 비어 있으면 정지 이미지 + 작은 `연출 예시` 태그만(`<video>`·버튼·자리표시 문구 0). 값이 생기면 이미지 위에 영상 층이 `playing` 뒤에 나타나고 태그는 사라진다. 재생은 헤더 움직임 토글과 같이 멈추고(WCAG 2.2.2), reduced-motion에서는 자동재생 없이 버튼으로만 재생. `data-cs-autoplay`(frame 일괄 처리)는 쓰지 않았다: frame은 reduced-motion에서 재생을 막아 BRIEF_P3의 '버튼으로 직접 재생'을 지킬 수 없기 때문.
   - 받을 쇼릴 사양(사용자 안내): **10~15초 무음, 1920×1080 H.264 mp4, 3MB 이하, 공개 가능한 장면만, poster용 첫 장면 webp 1장.** `public/content-home/`에 두고 `video: { src, poster }`만 채운다.
6. **문의 페이지 미선택 문구(VERIFY_G0 6)**: '아직 모르겠어요' 선택지를 추가하는 대신 **문구를 바꾸는 쪽**을 택했다. 미정 문의를 제대로 보내려면 `InquiryBridge`에 `selection.service`를 넘겨야 하는데 그 경로는 공용 `CsInquiry`에 없다(소유 밖). 그래서 서비스 선택을 이 페이지의 `ContactFlow`가 직접 갖고(`CsInquiry`는 `chooser` 없이 `service={chosen}`), 아무것도 고르지 않은 제출은 래퍼의 `onSubmitCapture`에서 `preventDefault + stopPropagation`으로 멈춘 뒤 선택 카드 위에 `요청 서비스를 하나 골라주세요`(role=alert)를 띄우고 첫 카드로 포커스를 옮긴다. 공용 문장은 이 페이지에서 실행되지 않는다. 카드 위 안내 줄 `아직 정하지 못했다면 가까운 서비스를 고르고 고민하는 점을 적어주세요`로 미정 고객의 길을 남겼다.
   - 브리프 8절의 `CsInquiry chooser`에서 벗어난 점: 선택 카드가 폼 카드 안이 아니라 히어로 띠(`--cs-bg-2`) 안, h1 질문 바로 아래에 온다. 카드·라디오 스타일은 theme.css의 `.cs-chooser*`를 그대로 써서 모양은 같다. 3열(≥1024)·2열(≥768)·1열.
   - 메타 description: 기존 문장에 마침표가 빠져 있고(`…알려주세요 담당자가…`) 페이지에 없는 `예산`을 물었다. `웹툰부터 SNS 광고 영상까지 필요한 컨텐츠와 일정을 알려주세요. 담당자가 범위와 견적을 안내합니다.`로 바꿨다(title `컨텐츠 문의`는 그대로).
7. **캐러셀 패널 높이 고정**: 서비스 6개 설명을 한 칸에 겹치고 선택 안 된 것은 `visibility:hidden` + `inert`. 서비스를 바꿔도 아래(주석·제작 과정)가 움직이지 않는다(P3 결과의 남은 지적). 숨은 사본은 읽기·포커스 대상이 아니다.
8. **상담 띠**: 바탕 `--cs-accent`, 글자 `--cs-on-accent`, 섹션에 `.cs-on-accent`(포커스 외곽선 색). 버튼 문구 `프로젝트 문의` → `상담 신청`(헤더·서비스 히어로·하단 바와 같은 이름).
9. 히어로 보조 버튼 `상담 신청 →`(`/content/contact`)를 더했다. 사진 위라 테두리 40%·바탕 40% 덧댐.
10. 섹션 바탕: 히어로(사진) → 서비스 `--cs-bg-2` → 과정 `--cs-bg` → 상담 띠 `--cs-accent` → 푸터. 모든 머리·문구는 `.cs-container` 안이라 헤더 로고 왼쪽 끝과 같은 선(측정은 V).

## 4. 카피 최종본과 humanizer 점검
- 히어로: `AI CONTENT PRODUCTION` / `AI로 빠르게⏎전문가가 꼼꼼하게` / `여섯 가지 컨텐츠를 기획부터 제작까지 한 팀이 맡습니다`(이전 문장은 푸터 한 줄과 같아 한 페이지에 두 번 나왔다) / 6종 줄 / `서비스 살펴보기 ↓` · `상담 신청 →` / 태그 `연출 예시`
- 서비스: 머리·6종 데이터·주석 P3 그대로(태그는 `MEDIA_TAGS` 상수, 값 같음).
- 과정: `PROCESS` / `기획안을 먼저 맞추고⏎제작합니다` / `모든 컨텐츠는 같은 네 단계로 진행합니다. 기획안 수정 2회와 최종안 수정 1회가 기본입니다.` / 상담·기획(P3 그대로) · 제작 `초안은 AI로 빠르게 만들고 연출은 담당자가 직접 다듬습니다. 최종안을 전달한 뒤 한 번 수정합니다.` · 납품 `게시할 채널의 화면 비율에 맞춰 파일을 정리합니다. 다른 화면비 추가는 따로 견적을 드립니다.`
- 상담 띠: `CONTACT` / `어떤 컨텐츠가⏎필요하신가요?` / 기존 lead / `상담 신청 →`
- 문의: `CONTACT` / `어떤 컨텐츠가⏎필요하신가요?` / `서비스를 고르고 만들고 싶은 내용을 남겨주세요. 담당자가 범위와 견적을 안내합니다.` / `가격 기준` + `PRICING_COMMON` 3줄 / `요청 서비스*` / 안내 줄 / 미선택 `요청 서비스를 하나 골라주세요` / 폼 h2 `만들고 싶은 내용을⏎알려주세요`, lead `고른 서비스와 함께 문의가 접수됩니다`, placeholder `예: 신제품을 알릴 30초 영상이 필요해요`
- humanizer 기준(번역투 `~을 통해/에 대해`, 쉼표 2개 이상, `A가 아니라 B`, `A 없이`, 문장 끝 쉼표절, AI 상투어, 같은 구조 반복)으로 다시 읽음. 고친 것: 히어로 lead(푸터와 중복), 문의 메타(마침표·없는 항목), 과정 4단계(사실 범위). 나머지는 고칠 문장 없음. 테스트가 금지어·쉼표·마침표·h1 9자·h2 11자·영문 범위·숫자를 강제한다.

## 5. 실행한 검증
- `npm run typecheck` → PASS(출력 없음, 최종 상태에서 재실행).
- `npm run lint` → `0 errors, 1 warning`(기존). 중간에 나온 `aria-invalid`(radio 미지원) 경고는 `radiogroup` fieldset으로 옮겨 해결.
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` → `tests 95 · pass 94 · fail 0 · skipped 1 · todo 0`(skipped = 기존 `AIO_VERIFY_LOCAL_MEDIA` 게이트). `content-site.test.mjs`의 7-1(홈 CSS 규칙)·8-1(GuideNav 0)이 todo 없이 통과, `content-site-grid.test.mjs`(WP0FIX)도 홈·문의의 `cs-col-*` 조합 포함 통과.
- `node --check tests/seo-http.mjs` → OK(실행은 서버 필요라 NOT_RUN).

## 6. NOT_RUN (V 몫, 구현자는 빌드·브라우저 금지)
- `npm run build` 두 빌드, `tests/seo-http.mjs`(새 `/content`·`/content/contact` 블록 포함), `scripts/verify-reference-pages.mjs`(`/content` 대기 선택자 `#services` 그대로).
- 브라우저: 옆 카드 클릭 시 선택 변경·URL 불변·콘솔 0(1440·768·390), 스와이프, 탭 번호·라벨 기준선 실측, 390×844·360 히어로 CTA 노출, 역할 계산값·좌측 정렬(로고 left ±1px)·대비(상담 띠 `#14102A` on `#A99BFF`, 히어로 사진 위 글자), 가로 넘침 5폭, reduced-motion(목록 시작·전이 0), `?service=webtoon` 미리 선택, 미선택 제출 시 안내·포커스·`/api/contact` 요청 0, 선택 후 제출 페이로드 `service` 값(route 가로채기).
- 쇼릴 슬롯 실제 재생: 값이 `undefined`라 확인하려면 임시 값으로 빌드해야 한다. 제안 임시 값 `{ src: "/content-site/brand-motion.mp4", poster: "/content-site/hero.webp" }` → 확인 후 `undefined`로 되돌리고 `git diff lib/content-home.ts`로 증거.
- `SHOW_STARTING_PRICE=false` 화면(테스트 2의 `startingPrice(id,false) === null`과 컴포넌트에 강제 표시 경로 0으로 갈음).

## 7. 공용 변경 요청 (WP0 소유, 이번에 고치지 않음)
1. `CsInquiry`의 `chooser` 모드는 이제 쓰는 곳이 없다. 남겨 두면 미선택 제출 때 `InquiryBridge` 기본 문구(`‘아직 모르겠어요’를 선택할 수 있습니다`)가 다시 나온다. 정리안: (a) `chooser` 모드 삭제, 또는 (b) `InquiryBridge`에 선택 prop `unselectedMessage?` 추가. 진짜 `아직 모르겠어요` 선택지가 필요해지면 `CsInquiry`가 `selection={{ service: "아직 모르겠어요" }}`를 `InquiryBridge`로 넘기는 경로가 필요하다(그러면 메시지에 `서비스 미정 · 상담 분류는 임시 지정`이 붙는 기존 흐름을 그대로 쓴다).
2. `CsSectionHead`의 `aside`(홈 서비스 머리의 `한 번에 모두 보기` 토글)는 WP0FIX의 격자 수정(`cs-col-4 cs-col-start-9` → 9~12열)에 기대고 있다. 테스트는 통과하지만 V가 1440에서 위치를 확인해 주면 좋다.
3. (참고) 홈 가격 줄은 `.cs-price`·`.cs-price-unit`(theme.css) 모양을 그대로 쓰되 `CsPrice` 컴포넌트는 쓰지 않았다. `CsPrice`가 `startingPrice(id, true)`로 `SHOW_STARTING_PRICE`를 무시하기 때문이다(서비스 페이지는 항상 표시가 맞음). 홈에서도 컴포넌트를 쓰려면 `CsPrice`에 `show?` prop이 필요하다.

## 8. 열린 질문(사용자)
1. h1 `AI로 빠르게⏎전문가가 꼼꼼하게`, eyebrow `AI CONTENT PRODUCTION` 괜찮은가.
2. 홈 히어로 이미지를 벤치마크 `hero.webp`(연출 예시)로 바꾼 것. 쇼릴이 오면 이 자리는 영상이 덮는다.
3. 쇼릴에 AI 가상인물이나 고객 작업 장면이 들어가면 영상 위 표기가 필요한가(지금은 쇼릴이 있으면 태그를 없앤다, P3 결정).
4. 문의 페이지에 실제 `아직 모르겠어요` 선택지를 둘지(7-1 공용 변경 필요). 지금은 안내 줄로 대신한다.
