# SURVEY_R6 · R6 항목 1~7 현황 조사 (읽기 전용)

조사 2026-10-15 · 기준 HEAD `175524c`(R5 `35ac724` + R6 프롬프트 문서) · 코드·빌드·서버·git 변경 없음(NOT_RUN). 이 문서 한 개만 새로 만들었다.
읽은 자료: `HANDOFF_RESUME.md` · `COMMON.md` · `PROMPT_NEXT_R6.md` · `AUDIT_TYPOGRAPHY.md` · 스크린샷 `_피드백_R6\img17~28.png`(12장 전부 확인) · 아래 파일들. 줄 번호는 현재 작업트리 기준.

## 0. 먼저 알아야 할 것 (BRIEF_R6 작성 전 확인 사항)

1. **`lib/content-service-plans.ts`는 없다.** 프롬프트에 적힌 이름은 옛 이름이다. 실제 위치: 가격 `lib/content-pricing.ts`, 서비스별 카피 `lib/content-site/services/<id>.ts`, 공통 고정 문구 `lib/content-site/copy.ts`, 컨텐츠 홈 카피·캐러셀 수치 `lib/content-home.ts`, 메인 워크플로우 카피 `lib/home-journey.ts`.
2. **스크린샷 폭이 전부 좁다**(img17 559px, img19 542px, img22 545px, img23 548px, img24 645px, img25 666px, img27 480px, img28 316px 등). 사용자는 모바일·좁은 창(<768px) 레이아웃으로 보고 있다. 예: 웹툰 가격이 "2줄로 쌓임"(img23)은 `theme.css:1289-1299`가 768px 미만에서 1열이기 때문이고, 768px 이상에서는 이미 2열이다. "다른 컨텐츠 서비스"(img24)도 768px 미만 1열(`theme.css:1738-1750`). **고칠 때 ≤767px를 기준으로 설계·검증해야 한다.**
3. **img27(광고 중앙 영상 카드, "작품 보기")과 img28("브랜드 광고 30초 시안")은 검토판(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`)에서만 보이는 고객 작품이다.** 공개판에는 같은 자리에 연출 예시 이미지(`ad-center-1`)가 나온다. 삭제는 두 판 모두 처리해야 한다(각각 4.5 참고).
4. **모션그래픽의 '요프리 캐릭터' 사례는 고객 자료 HOLD와 충돌한다.** 요프리(YoFree)는 힐러넷의 제품 브랜드(고객)이며 `content/works/yofree-*.json`은 전부 `visibility:"review"`, `rightsConfirmed:false`다. 테스트 4곳이 공개 번들에 `요프리|YoFree|yofree-`가 없어야 한다고 검사한다(`content-site.test.mjs:59`, `content-site-wps1.test.mjs:13`, `content-r5-fix1.test.mjs:10`, `seo-http.mjs:348`). 공개 페이지에 '요프리'라는 이름을 쓰려면 사용자 결정(권리 확인)이 먼저다. 4.4의 UNKNOWN 목록 참고.
5. 캐러셀 자동 넘김은 **진행 막대(카운터 안의 `.ch-autoplay-fill`)의 `animationend`가 시계 역할**을 한다(`service-showcase.tsx:103-106, 171`, `content-home.css:459-461` 계열). 카운터를 지우면 자동 회전이 같이 죽는다. 다른 시계(타이머 또는 숨긴 요소)로 바꿔야 한다. 이 의존은 테스트가 고정하고 있다(`content-home.test.mjs:407-412`).
6. 타이포는 이미 상당 부분 정리됐다(W2 `type.css`와 `--ff-display` 폴백, 컨텐츠 사이트는 `--cs-t-*` 역할 체계). `AUDIT_TYPOGRAPHY.md`의 P0~P1 항목 대부분은 적용된 상태다(6장). 사용자 불만의 중심은 폰트 서체보다 **정렬·위계·카피·중복 블록**이다.

---

## 1. 서비스 페이지 공통 구조 (웹툰·애니메이션·AI·모션·광고가 같은 틀)

`app/(content-site)/content/services/[service]/page.tsx`(43줄) → `components/content-site/service-landing.tsx:35-54`가 순서를 고정한다.

```
Hero(서비스별) → CsTypes → Signature(서비스별 1~3섹션) → BeforePricing(AI만) → CsPricing → CsProcess → CsScope → CsWorks(검토판만) → CsFaq → CsInquiry → CsRelated
```
(순서는 `content-site.test.mjs:731-745`가 고정. 실제 JSX는 `service-landing.tsx:41-51`)

| 블록 | 파일:줄 | 노출 요소 |
|---|---|---|
| Hero | `components/content-site/services/service-hero.tsx:13-27` (`ServiceHero`) | eyebrow, h1(`MotionTitle`), 미디어, lead, 가격 칩(`CsPrice`), 가격 보조 문장(`price.note`·`hero.note`), 버튼 2개("상담 신청", "가격 보기"), facts 3개 |
| Types | `blocks/types.tsx` (41줄) | eyebrow·h2·lead + 3열 카드(번호·h3·small) |
| Pricing | `blocks/pricing.tsx:16-67` | 묶음 제목, 플랜 카드(라벨·금액·"부가세 별도"·"이 구성으로 상담 ↓"), 공통 주석 3줄 + 서비스 주석 |
| Process | `blocks/process.tsx` (43줄) | h2·lead + 4단계(번호·h3·small·"함께 확인 …") |
| Scope | `blocks/scope.tsx` (41줄) | 3열: 기본 포함 / 별도 상담 / 준비하면 좋은 자료 |
| Works | `blocks/works.tsx:28-86` | 검토판 전용 카드 그리드(공개판은 null) |
| FAQ | `blocks/faq.tsx` | 서비스별 3개 + 공통 3개(`lib/content-site/faq.ts:3-16`) |
| Inquiry | `blocks/inquiry.tsx` (243줄, client) | h2·lead + 폼 + 진행 순서 3단계(`copy.ts` `inquiry.steps`) |
| Related | `blocks/related.tsx:13-41` | "다른 컨텐츠 서비스" 5카드 |

서비스별 섹션 수(공개판): 웹툰 11(hero, types, unfold, reader, motion-comic, pricing, process, scope, faq, inquiry, related), AI 인플루언서 10, 애니메이션·모션·광고 각 9. 모든 섹션이 `border-top` 구분선과 같은 배경색(`--cs-bg`=`--cs-bg-2`=#080808, `theme.css:136-137`)이라 `--alt`는 시각 효과가 없다(`theme.css:537-547, 1847`).

`blocks/hero.tsx`(`CsHero`)는 어떤 서비스도 쓰지 않는 죽은 컴포넌트다(grep 결과 정의만 있음). `lib/content-site/services/animation.ts:32-79`의 `animationSignature.styles/beforeMotion`, `motion-graphics.ts:9-43`의 `motionGraphicsSignature.stage/compare/frame`도 landing에서 렌더하지 않는다. 다만 `tests/content-site-wpa.test.mjs:166`, `content-site-wpb.test.mjs:126-133`이 이 문자열을 카피 검사 대상으로 읽으므로 지울 때 테스트도 고친다.

---

## 2. 항목 1 · 메인 페이지 `/`

### 2.1 화면을 그리는 파일
- 라우트 `app/(public)/page.tsx`(24줄) → `components/guide/main.jsx`(928줄, 인라인 `style={{` 83곳, 색은 `#0D0D12`·`#6B4DFF`·`#A99BFF` 등 hex 직접 사용)
- 워크플로우 `components/home/workflow-journey.tsx`(251줄) · `journey-dev.tsx` · `journey-content.tsx`(200줄) · `journey-tabs.tsx` · `workflow-journey.css`(909줄) · 카피·데이터 `lib/home-journey.ts`, `lib/home-journey-data.ts`(서버 전용 선택)
- 브랜드 영상 `components/guide/showcase-video.tsx`(`kind="brand"`) · CSS `components/guide/ux.css:171-311`
- 공통 타이포 `components/guide/type.css`(284줄) · 토큰 `app/globals.css:1-60+` · 글꼴 `app/layout.tsx:6-19`(Pretendard + Unbounded-latin)
- 헤더·푸터 `components/site-shell.tsx`, `components/guide/guide.css`

### 2.2 섹션 구성과 카피 원문 (위에서 아래)
| # | 섹션 | main.jsx 줄 | 카피 원문 | 정렬 |
|---|---|---|---|---|
| 1 | 히어로 `.main-hero`(배경 이미지 + 어두운 오버레이, min-height `min(780px, 100svh-70px)`, 세로 패딩 64px) | 105-245 | eyebrow "All-In-One Agency" / h1 "분야별 **전문가들**이 / **AI**와 함께 일합니다" / lead "컨텐츠·마케팅·개발, **필요한 일**을 골라 맡기고 결과를 함께 확인하세요" / 버튼 "견적 문의"(#contact), "제작 예시 살펴보기"(#work) | 전부 **가운데** |
| 2 | 브랜드 소개 영상 `ShowcaseVideo kind="brand"` | 246 | 재생 버튼 "회사 소개 보기"(제목·설명은 webtoon 종류에서만 렌더, brand는 영상 프레임만) | 가운데 |
| 3 | 분야 선택 `#divisions` | 247-567 | h2 "필요한 분야만 **골라** 맡기세요" → 카드 3장: ①"01 · CONTENT"+칩"바로 의뢰 가능" / "장면을 담는 분야" / "Studio" / "웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상" / "컨텐츠 상담하기 →"(새 탭) ②"02 · MARKETING"+"문의 가능" / "고객을 부르는 분야" / "Marketing" / "통합 마케팅 · SNS 대행 운영 · SEO·AEO·GEO" / "마케팅 상담하기 →" ③"03 · DEV"+"문의 가능" / "시스템을 만드는 분야" / "Lab" / "업무 자동화 · 프로그램 · 웹사이트 · 쇼핑몰" / "개발 상담하기 →" | h2 가운데, 카드 본문 왼쪽 |
| 4 | 워크플로우 `#work` `.wj` (흰 배경) | 568 → `workflow-journey.tsx:175-249` | eyebrow "HOW WE WORK" / h2 "상담부터 성과까지 / 하나로 이어집니다" / lead "필요한 단계만 맡기셔도 됩니다. 단계마다 하는 일과 결과물을 살펴보세요." / 왼쪽 단계 레일 + 단계 3개(개발→마케팅→컨텐츠) / 닫음 "어디서부터 시작할지 상담에서 함께 정합니다" + "견적 문의" | 왼쪽(레일 있음) |
| 4-1 | 01 DEVELOPMENT | `lib/home-journey.ts:36-42` | "웹사이트와 쇼핑몰을 / 가이드대로 만듭니다" / "정리한 브랜드 자료를 화면에 녹입니다. 방문한 고객이 제품을 살펴보고 문의나 구매로 이어지도록 동선을 설계합니다." / 링크 "웹사이트 제작", "쇼핑몰 제작" / 본문: 개발 프로젝트(검토판 고객 사례) 또는 폴백 탭 "웹사이트 제작"·"쇼핑몰 제작"(연출 예시) + 단계 "기존 화면 점검 · 가이드 적용 · PC·모바일 화면 설계 · 문의·구매 동선 연결" |  |
| 4-2 | 02 MARKETING | `:44-50, 360-386` | "계획하고 운영하고 / 데이터로 고칩니다" / "누구에게 어떤 메시지를 어느 채널에서 보여줄지 먼저 정합니다. 계획대로 SNS와 광고, 검색 노출을 운영하고 쌓인 데이터를 보며 계속 고칩니다." / 패널 "마케팅 운영 흐름"+태그"연출 예시" / 노드 "플랜 기획 · 목표 고객 · 채널 · 메시지 · 일정", "운영 · 게시 · 광고 · 검색 노출 관리", "데이터 확인 · 유입 · 반응 · 문의 흐름", "성과 개선 · 반응 좋은 메시지 늘리기 · 막히는 지점 고치기" / 분기 링크 "화면 수정 → 개발 단계", "소재 교체 → 컨텐츠 단계" / 링크 "통합 마케팅", "SNS 대행 운영", "SEO·AEO·GEO" |  |
| 4-3 | 03 CONTENT | `:52-58, 273-332` | "채널에 맞는 컨텐츠를 / 직접 만듭니다" / "같은 브랜드 가이드로 타깃과 플랫폼에 맞는 형식을 고릅니다. 웹툰부터 광고 영상까지 기획과 제작을 한 팀이 맡습니다." / 서비스 탭 6개 + 서비스별 한 줄("브랜드 이야기를 세로로 읽히는 컷으로 그립니다" 등)·칩·"서비스 자세히 보기 →" / 이전·다음 버튼 / 링크 "컨텐츠 서비스 전체 보기"(`/content`, 새 탭) |  |
| 5 | OUR STANDARD(흰 배경, `maxWidth:1000px`, 패딩 `clamp(80px,10vw,140px)` 인라인) | 569-625 | "OUR STANDARD" / 인용 "만드는 일의 끝은, / **고객이 쓰기 시작하는 순간**입니다" / "AIO MAKE의 작업 기준" / "기획 · 제작 · 검수 · 인계" | 전부 **가운데** |
| 6 | FAQ | 626-702 | h2 "자주 묻는 질문" + 5문항(AIO MAKE는 어떤 회사인가요? / 어떤 일을 맡길 수 있나요? / 견적은 어떻게 받나요? / AI를 쓰면 품질은 괜찮나요? / 납품 후에도 관리해 주나요?, 답 데이터는 `main.jsx:44-65`) | 왼쪽 2열 |
| 7 | 문의 `#contact`(보라 #6B4DFF 배경) | 703-921 | h2 "필요한 작업, / 편하게 문의하세요" / "이름과 연락처만 남겨주세요 / 담당자가 먼저 연락드립니다" / "상세 문의 남기기 →" / 폼: 고객명 · 연락처 · 관심 분야 칩("컨텐츠","마케팅","개발","아직 모르겠어요") · 동의 · "간단 문의 보내기" | 왼쪽 |

### 2.3 삭제·변경이 걸리는 위치와 눈에 띄는 불일치
- **번호·순서 불일치**: 분야 카드는 `01 · CONTENT / 02 · MARKETING / 03 · DEV`(`main.jsx:333, 429, 524`)인데 워크플로우는 `01 DEVELOPMENT / 02 MARKETING / 03 CONTENT`(`home-journey.ts:38, 46, 54`). 같은 화면에서 01이 서로 다른 분야를 가리킨다.
- **분야 이름 혼용**: 카드는 한글 라벨("장면을 담는 분야") + 영문 이름(Studio/Marketing/Lab, `main.jsx:357-365` 등 `--ff-display`)인데 서비스 문장·FAQ·문의 칩은 "컨텐츠·마케팅·개발". Studio/Lab은 사이트 어디에도 설명이 없다.
- **정렬 혼재**: 히어로·영상·h2(분야)·OUR STANDARD는 가운데, 워크플로우·FAQ·문의는 왼쪽. 한 페이지에서 가운데/왼쪽이 번갈아 나온다.
- **간격**: 섹션 패딩이 `--section-y`(히어로 64px 고정, 분야·FAQ·문의·`.wj`는 토큰, OUR STANDARD만 인라인 `clamp(80px,10vw,140px)`)로 섞여 있다. 워크플로우 단계 간격은 `--wj-step-gap: clamp(96px,11vw,160px)`(`workflow-journey.css:15`)이라 가장 길다.
- 워크플로우 소개 제목 "상담부터 성과까지"는 테스트가 문자열을 고정한다(`home-journey.test.mjs:132-144`). "기획부터 성과까지"로 바꾸면 이 테스트를 같이 고친다(결정 대기 항목).
- OUR STANDARD 문구 존재는 테스트가 확인한다(`home-journey.test.mjs:319`). 지우거나 바꾸면 이 줄과 `new-tab-links.test.mjs:69-118`(main.jsx 읽기)을 확인한다.
- 워크플로우 개발·컨텐츠 단계의 구조(탭+스테이지+이전/다음)는 `/content` 캐러셀과 같은 개념이 한 번 더 나오는 것이다(길이 요인, 7장 참고).

---

## 3. 항목 2 · 컨텐츠 홈 `/content`

### 3.1 화면을 그리는 파일
`app/(content-site)/content/page.tsx`(14줄) → `components/content-home/content-home.tsx`(113줄) → 카피 `lib/content-home.ts` · CSS `components/content-home/content-home.css`(536줄) · 서브 컴포넌트 `hero-stage.tsx`(20), `hero-media.tsx`(22), `hero-video.tsx`(86), `service-showcase.tsx`(184), `service-detail.tsx`(67), `process-tabs.tsx`(55), `use-stage-activity.ts`(20) · 셸 `components/content-site/shell/*` · 테마 `components/content-site/theme.css`(1890줄)

### 3.2 현재 섹션 구성과 카피 원문
| # | 섹션 | 파일:줄 | 카피 원문 |
|---|---|---|---|
| 1 | 히어로 `.ch-hero` | `content-home.tsx:42-71` · `lib/content-home.ts:13-32` | eyebrow "AI CONTENT PRODUCTION" / h1 "읽고 싶게 / 끝까지 **보고 싶게**" / lead "웹툰부터 브랜드 영상까지 / 기획부터 채널에 맞는 납품까지 한 팀에서" / 버튼 "서비스 살펴보기 ↓"(#services), "상담 신청 →"(`/content/contact`) / 오른쪽 `HeroStage`: 모션그래픽 작품 큰 카드(패럴랙스·드리프트, 캡션 "MOTION GRAPHICS"+"제품을 이해시키는 장면", 태그 "연출 예시", ↗) + 웹툰 소형 카드("BRAND WEBTOON" / "읽는 흐름 속에 브랜드를 담는 이야기" / "웹툰 제작 ↗") / 아래 줄 `.ch-hero-formats`: 서비스 6개 링크 줄("웹툰↗ … SNS 광고 영상↗", `content-home.tsx:69`) / 쇼릴 슬롯 `data-slot="home-hero-reel"`(`hero.video`가 있을 때만 렌더, 지금은 비어 있음) |
| 2 | 서비스 `#services` (3D 캐러셀) | `service-showcase.tsx:139-183` · `lib/content-home.ts:196-209` | eyebrow "SERVICES" / h2 "이야기에 맞는 형식 / 결과물로 살펴보세요" / lead "카드를 넘겨 제작 형식과 실제 작업물을 살펴보세요" / **탭 칩 6개**(웹툰, 애니메이션, AI 인플루언서, 모션그래픽, 브랜드 홍보 영상, SNS 광고 영상) / 3D 카드 6장(캡션: eyebrow·한 줄·태그·"작업 자세히 보기 ↗") / **카운터 "06 / 06"+진행 막대+일시정지+←→** / **서비스 설명 블록**(번호·kicker·제목·한 줄·가격 칩·"서비스 자세히 보기 →"·"제작 구성과 활용처 ＋" 아코디언) |
| 3 | 제작 과정 `#process` | `content-home.tsx:75-90` · `process-tabs.tsx` · `lib/content-home.ts:218-252` | eyebrow "PROCESS" / h2 "함께 확인하고 / 다음 단계로" / lead "기획안 수정 2회, 최종안 수정 1회 포함 / 무엇을 확인하고 어떤 파일을 받는지 단계마다 정리합니다" / 4단계 아코디언: 01 상담 "만들 컨텐츠를 함께 정합니다"(본문 "사용할 채널과 일정, 가진 자료를 확인해 서비스와 분량을 정하고 견적을 안내합니다", 결과물 "작업 범위와 견적") · 02 기획 "기획안으로 방향을 맞춥니다"(본문 "이야기 흐름과 장면 구성을 기획안으로 정리하고 두 번까지 수정해 방향을 맞춥니다", 결과물 "기획안") · 03 제작 "확정한 기획대로 만듭니다"(본문 "AI로 만든 초안을 담당자가 직접 다듬어 최종안을 전달하고 한 번 수정해 마무리합니다", 결과물 "최종안") · 04 납품 "채널에 맞는 파일로 전달합니다"(본문 "게시할 채널의 화면 비율에 맞춰 파일을 정리하며 다른 화면비 추가는 별도로 견적을 드립니다", 결과물 "최종 파일") / 오른쪽 장식 패널: ①"CONTENT BRIEF"(기울어진 종이: "어떤 이야기를 / 누구에게 전할까요", 목적·채널·범위, 메모 "가진 자료에서 / 시작해도 괜찮아요") ②콘티 4장 "장면 01 · 웹툰…" ③제작 화면+타임라인 ④납품 파일 "MP4 영상 파일 · IMG 이미지 파일 · SIZE 채널별 규격", "파일 구성 예시 · 실제 납품은 합의한 범위에 따름" / 패널 하단 "01 / 04 · 제작 과정 설명 예시" + "결과물 — 작업 범위와 견적" |
| 4 | 상담 띠 `.ch-cta` | `content-home.tsx:92-110` · `lib/content-home.ts:254-260` | eyebrow "CONTACT" / h2 "어떤 컨텐츠가 / 필요하신가요?" / lead "만들고 싶은 컨텐츠와 일정을 알려주시면 담당자가 범위와 견적을 안내합니다" / 버튼 "상담 신청 →" |

(헤더 "CONTENT STUDIO" · 푸터는 `components/content-site/shell/*`와 `lib/content-site/copy.ts:6-31`)

### 3.3 요구별 삭제·변경 위치
**① 히어로를 영상 슬롯만 남기기**
- 지울 것: `content-home.tsx:47-69` 전체(카피 컬럼, `HeroStage`, `.ch-hero-feature`, `.ch-hero-comic`, `.ch-hero-formats` 서비스 링크 줄), `hero-stage.tsx` 전체(패럴랙스·드리프트 스위치), `lib/content-home.ts:13-32`의 eyebrow/title/lead/button/secondary/tag/image(`CONTENT_SITE_ASSETS.hero`), 연출 예시 태그.
- 남길 것: `data-slot={hero.reelSlot}`(`home-hero-reel`), `hero.video` 한 줄 교체 구조, `hero-media.tsx`·`hero-video.tsx`(영상이 있으면 재생 버튼 포함). 지금은 `hero.video`가 비어 있어 `.ch-hero-showreel`(`content-home.css:319`, 16:9)이 렌더되지 않는다(`content-home.tsx:70`) → **영상이 없으면 히어로가 통째로 빈 화면**이 된다. "깨져 보이지 않는 최소 자리표시"를 새로 설계해야 한다(예: 같은 16:9 상자에 어두운 면 + 아주 작은 문구).
- 주의: h1이 사라지면 `/content` 페이지에 `h1`이 없다(서비스 섹션의 `h2`가 첫 제목). SEO·접근성 때문에 `sr-only` h1 또는 슬롯 위 짧은 제목을 남길지 결정 필요.
- 관련 CSS: `content-home.css:21-86`(히어로·일시정지·영상), `:275`(min-height 650), `:291-293`, `:297-319`(2열 편집형·작품 카드·formats·showreel), `:386`(패럴랙스 층), `:337-341`(모바일), `:461-536` 중 `cs-ch-drift`·`cs-ch-comic-pan`·`cs-ch-parallax`(히어로 모션) 관련 4줄.
- 테스트: `content-home.test.mjs:474`(`.ch-hero-formats a` 44px), `:479-502`(8-4: `reelSlot`, `data-slot={hero.reelSlot}` 유지는 OK), `:503-535`(8-5: `<HeroStage>`, `ch-hero-parallax`·`ch-hero-drift`, `hero-stage.tsx` 읽기, 히어로 모션) → **8-5의 히어로 부분 삭제/수정**, `:546-565`(10: 쇼릴 슬롯 비어 있음, `hero.video ?` 구조 유지 필요). `content-home.test.mjs:114-131`(1)·`:199-237`(3·4: hero 카피 문자열 금지어·마침표·줄 길이 검사 대상에서 hero 필드가 빠지면 같이 수정).
- 슬롯·소재: `ASSET_REQUEST_R5.md` `home-hero-reel`(16:9)·`home-hero-reel-mobile`(9:16)은 `MASTER-HERO`(5-6번째 마스터). 쇼릴은 사용자가 별도 "메이킹 필름"으로 제작하므로 이 두 슬롯 요청은 **삭제 또는 우선순위 하향** 대상. `lib/content-site/types.ts:91` `CONTENT_SITE_ASSETS.hero`(`/content-site/hero.webp`)도 히어로에서 안 쓰게 된다(다른 곳 사용 여부 확인 필요: 브랜드 영상 폴백 `brand-film/landing.tsx:21`이 `hero.src`를 포스터로 쓴다 → 삭제 금지).

**② 서비스 탭 칩 줄 삭제 (img17)**
- JSX `service-showcase.tsx:143`(`.ch-gallery-tabs`, `role="tablist"` 버튼 6개) + `buttons` ref(`:83`)와 키보드 이동 `select(...,focus)` 포커스 이동 부분(`:98-102`) + 탭 id(`ch-tab-*`)를 가리키는 `aria-labelledby`(`:179`) 정리.
- CSS `content-home.css:157-172`(`.ch-tab`·selected), `:277`(`.ch-gallery-tabs`), `:282-290` 반응(`.ch-gallery-tabs`, `.ch-tab`).
- 문자열 `head.tabsLabel`(`lib/content-home.ts:202`)은 이미 JSX에 직접 한글을 쓰고 있어(`:143` "컨텐츠 서비스 선택") 데이터 필드가 죽는다.
- 테스트: `content-home.test.mjs:337-372`(8-1: `role="tablist"` 341행, 접근성 계약), 키보드 Home/End 검사 구간.
- 동시에 히어로의 `.ch-hero-formats`(서비스 링크 줄)도 같은 성격이므로 ①에서 함께 사라진다.

**③ 캐러셀 컨트롤: 화살표만 양끝에 붙이기 (img18)**
- 지금: `.ch-depth-nav`(`service-showcase.tsx:170-177`, `content-home.css:371`)가 스테이지 **위쪽** 가운데 영역(`inset: 8px max(16px, calc(50% - 270px)) auto`, 폭 540px 카드 기준)에 카운터(좌) + 일시정지·←·→(우)를 한 줄로 둔다.
- 지울 것: `.ch-depth-count`(`:171`, `.ch-autoplay-track`·`.ch-autoplay-fill`), `.ch-autoplay-toggle` 버튼(`:173`), 관련 CSS `content-home.css:373-375, 459-461(자동 넘김 막대 규칙)`, `lib/content-home.ts:204-207`(`autoplayPause/Play`), 상태 `userPaused`·`cycle`(`:75-80`).
- 남길 것: ←/→ 두 버튼, 정지 조건 `hover·focusPause·touching·detailsOpen·inView·motion·reduced`(`:90`).
- **자동 회전 시계 교체 필수**(0장 5번): `advance`(`:103-106`)가 `animationend`에 의존. 정지 조건이 되살아나는 구조를 유지하려면 `useEffect` 타이머(3.5s / 영상 5.2s) 등으로 바꾸고 `running` 변화 시 재시작해야 한다. `homeCarouselMotion.dwellMs/videoDwellMs`(`lib/content-home.ts:88-101`) 값은 재사용 가능.
- 새 배치: 화살표를 `.ch-depth-stage`(`content-home.css:348`, 높이 630px, 폭은 컨테이너 전체)의 좌우 가장자리에 세로 가운데로 `position:absolute; left/right: …`. 모바일(≤767px, 스테이지 폭 약 390px에서 카드 280px)은 화살표가 카드와 겹치므로 아래쪽 양끝 또는 카드 옆 8px 여백 안에서 44px 버튼이 들어가는지 확인 필요(`.ch-arrow` 44×44, `:376`; 테스트 `:476` 고정).
- `service-showcase.tsx:180`의 `aria-live` 문장("N / 6 이름")은 남기는 것이 접근성에 유리.
- 테스트: `content-home.test.mjs:373-445`(8-2: 자동 넘김 수치·`cs-ch-autoplay` 이름·`.ch-autoplay-fill` 문자열·`onAnimationEnd` 호출) 전체 수정, `:446-478`(8-3, `.ch-depth-nav .ch-arrow` 44px 검사 476행).

**④ 캐러셀 아래 서비스 설명 블록 삭제 (img19)**
- JSX `service-showcase.tsx:179`(`.ch-depth-detail` 패널) + `import { ServiceDetail }`(`:22`) + `components/content-home/service-detail.tsx` 파일 전체. 이 블록이 쓰는 데이터: `ContentHomeService.kicker/line/description/uses/scopeNote`(`lib/content-home.ts:103-194`), `contentHomeServicesHead.detailLink`(`:205`), `startingPrice`(홈 시작가 표시, `SHOW_STARTING_PRICE`).
- CSS: `content-home.css:96-155`(`.ch-detail*`, `.ch-chips`, `.ch-chip`, `.ch-note`), `:320-343`(오버라이드 + 모바일), `:377-385`(`.ch-depth-detail` 그리드), `:434-445`의 `.ch-depth-detail` 모바일 규칙.
- 테스트: `content-home.test.mjs:68`(`detailLink` 카피 검사), `:85-103`(카피 마침표/줄 길이 검사 대상에 `description`·`uses` 포함 여부), `:132-198`(2: 시작가 정본 비교와 `service-detail.tsx` 읽기 `:185-195`: **파일을 지우면 `read()`가 실패**), `:475`(`.ch-detail-more summary` 44px 검사).
- 결과로 서비스 홈의 "시작가"가 홈에서 사라진다(서비스 페이지 히어로와 "다른 컨텐츠 서비스"에는 남음). 사용자 의도인지 확인.
- 홈 카드 캡션(`service-showcase.tsx:166`)에는 라벨·한 줄·태그·"작업 자세히 보기"만 남아 서비스 링크가 거의 없다(카드 클릭 시 이동 경로: 선택된 카드 안 링크는 `selected && selection.work`일 때만 렌더, 공개판엔 없음). **서비스 설명 블록을 지우면 공개판에서 서비스 페이지로 가는 링크가 /content 홈에서 사라진다**(히어로 formats 줄도 삭제 대상) → 카드 자체를 서비스 링크로 만드는 방안이 필요.

**⑤ PROCESS 섹션 재기획 (img20·21)**
- 파일: `content-home.tsx:75-90`, `process-tabs.tsx`(55줄 전부), `lib/content-home.ts:218-252`, CSS `content-home.css:387-426`(장식 패널·종이·메모·콘티·타임라인·납품 파일), `:427-440` 모바일, `:480-535`(장식 애니메이션 25여 줄), 테스트 `content-home.test.mjs:11-12, 71-73, 85-103, 358-360(탭 role), 497-535, 579-593(12: 서비스 페이지와 같은 4단계·수정 기준)`.
- 요구 사항과 걸리는 것: "수정 횟수 등 확정 사실만 사용"의 확정 사실은 `lib/content-pricing.ts:149-160`(수정 2회·1회·부가세·대량 별도)와 `lib/content-site/services/*.ts`의 단계별 `check` 값. 12번 테스트(`:579-593`)는 현 4단계 라벨(상담·기획·제작·납품)·`기획안 수정 2회`·`두 번까지 수정`·`한 번 수정`을 정규식으로 고정하므로, 새 카피에 맞게 테스트도 수정해야 한다.
- 장식 요소(기울기 `rotate(-5deg)`, `box-shadow:16px 16px 0`, "제작 과정 설명 예시", "파일 구성 예시" 문구)는 `content-home.css:400, 406, 421-422`·`process-tabs.tsx:47-52`.
- 서비스 페이지의 `CsProcess`와 문구가 따로 놀고 있다(홈은 공통 4단계, 서비스는 서비스별 4단계). 홈 PROCESS를 서비스 페이지 `CsProcess`와 같은 데이터 구조로 맞추면 중복이 줄어든다.
- 슬롯·소재: `process-tabs.tsx:23, 25`가 `homeCardMedia["motion-graphics"]`와 슬롯 영상을 쓴다. PROCESS를 재기획하면 이 참조가 사라지므로 `ASSET_REQUEST_R5.md`의 `home-card-motion-graphics` 영상 용도는 캐러셀 카드 하나만 남는다.

**⑥ "다른 컨텐츠 서비스"**: 5장 참고(모든 서비스 페이지 공통).

### 3.4 /content에서 같이 건드릴 슬롯·요청 정리
- 사라지는 용도: `home-hero-reel`(+`-mobile`), 히어로 연출 예시 이미지(`CONTENT_SITE_ASSETS.hero` 히어로 사용분).
- 유지: `home-card-<서비스>` 6개 슬롯(`lib/content-home.ts:48-85`)은 캐러셀 카드 소재로 계속 쓴다.
- `homeCardMedia`의 `video` 줄은 테스트가 존재를 요구(`content-home.test.mjs:482-490`).

---

## 4. 항목 3~7 · 서비스 페이지별 조사

### 4.1 웹툰 `/content/services/webtoon`

**파일**: 데이터 `lib/content-site/services/webtoon.ts`(143줄) · 랜딩 `components/content-site/services/webtoon/landing.tsx`(155줄) · 클라이언트 섬 `webtoon-experience.tsx`(88줄) · CSS `webtoon.css`(494줄) · 공통 `service-hero.tsx`, `service-editorial.css`(56줄), `service-motion.css`(130줄) · 가격 `lib/content-pricing.ts:42-58, 98-102, 209-232`

**섹션 순서와 카피 원문 (공개판)**
1. Hero(`ServiceHero`, `service-hero.tsx:13-27`): eyebrow "WEBTOON" / h1 "제품의 이야기를 / 웹툰 한 편으로" / lead "제품을 만나는 순간부터 사용하는 장면까지 12컷·24컷 이야기로 엮고 컷별 이미지로 전달합니다" / 가격 칩 "**웹툰 제작 12컷 10만 원부터** · 부가세 별도" / 보조 "모션코믹 영상화 옵션 · 30초 7.5만 원부터" / 버튼 "상담 신청 ↓" "가격 보기 ↓" / facts "12컷 · 24컷 한 회" "완성 이미지 1장 = 1컷" "콘티부터 작화까지" / 미디어 `WebtoonCover`(3컷 부채, 캡션 "자체 웹툰", h2 "1억의 구단주", 링크 "12컷 넘겨 읽기 ↓")
2. Types: "WHAT WE MAKE" / "쓰는 곳에 / 맞춘 웹툰" / 카드 3: 브랜드 웹툰 · 정보 웹툰 · 인스타툰
3. Unfold(스크롤 컷 펼침, `landing.tsx:34-45`): "CUT BY CUT" / "한 컷씩 펼치면 / 한 회가 됩니다" / lead "장면마다 인물의 거리와 표정을 나눠 그리고 한 회의 흐름으로 이어 붙입니다" / 캡션 "자체 웹툰 《1억의 구단주》 1회 첫 장면들" / 힌트 "스크롤하면 컷이 차례로 펼쳐집니다"
4. Reader(`#reader`, `:48-77`): "READ" / "12컷 한 회를 / 직접 넘겨보세요" / lead / 칩 "12컷 한 회" / 힌트 + 3D 책 리더(←/→, 진행 막대, "12컷 전체 이어서 읽기" 펼침)
5. MotionComic(`:80-139`): "MOTION COMIC" / "완성한 웹툰을 / 영상으로 잇습니다" / lead / 영상 / 캡션 / "맡기는 방법" 2개("웹툰과 함께 맡길 때", "모션코믹만 맡길 때") / 링크 "모션코믹 가격 보기 ↓"
6. Pricing(`#pricing`): "PRICING" "제작 가격" / **그룹 3개**: "웹툰 제작"(12컷 10만 원 · 24컷 18만 원) · "모션코믹"(30초 7.5만 원 · 60초 12만 원) · "함께 제작"(웹툰 12컷+모션코믹 30초 17.5만 원 · 24컷+60초 30만 원, 배지 "함께 제작") / 카드마다 "부가세 별도"·"이 구성으로 상담 ↓" / 주석 4줄("표시 금액은 모두 부가세 별도입니다" · "기획안 전달 후 수정 2회, 최종안 전달 후 수정 1회가 포함됩니다" · "대량 제작과 정기 제작은 따로 견적을 드립니다" · "모션코믹은 기존 웹툰을 영상화하는 가격입니다 웹툰 신규 제작은 별도입니다")
7. Process: "PROCESS" / "줄거리에서 / 컷별 완성본까지" / 4단계(이야기 정리·기획안 전달·작화·최종안·납품, 각 "함께 확인 …")
8. Scope: "SCOPE" "포함 범위" / 3열 목록
9. FAQ 6문항(웹툰 3 + 공통 3) 10. Inquiry("어떤 이야기를 / 그리고 싶으신가요?") 11. Related

**삭제·변경 위치**
- **히어로 "가격 보기" 삭제**: `service-hero.tsx:22`의 둘째 `<a href="#pricing">`와 `CS_COPY.hero.secondary`(`lib/content-site/copy.ts:33`). 이 컴포넌트는 6개 서비스 공용이므로 웹툰만 지우려면 prop 분기가, 전체 서비스에서 지우면 단순 삭제다. 가격 앵커 `#pricing`은 다른 곳(MotionComic 링크 `landing.tsx:131`, 테스트 `content-site-wpa.test.mjs:36-40`)이 계속 쓰므로 유지.
- **facts 3개 삭제**: 데이터 `webtoon.ts:63`, 렌더 `service-hero.tsx:23`, CSS `theme.css:1141-1163` + `service-editorial.css:12`. 타입 `lib/content-site/types.ts:51`이 `facts: [string,string,string]` 필수라 **6개 서비스 모두에 영향**. 테스트 `content-site.test.mjs:266`(`facts.length === 3`).
- **가격 보조 문장 "모션코믹 영상화 옵션 …" 삭제**: `lib/content-pricing.ts:101`(`startingBasis.webtoon.note`) → `startingPrice().note`가 `service-hero.tsx:21`과 `/content` 홈 `service-detail.tsx:38`에서 출력. 홈에서 설명 블록을 지우면 히어로 한 곳만 남는다. 테스트 `content-home.test.mjs:132-198`이 `note`를 읽는지 확인 필요.
- **"핵심 가격 한 줄"**: 현재 가격 칩 문구는 "웹툰 제작 12컷 10만 원부터 · 부가세 별도"(`CsPrice`, `ui/price.tsx`). 이것을 남기고 1줄 가격으로 유지하는 구조.
- **히어로 미디어 `WebtoonCover`**(3컷 부채+캡션+링크)는 사용자 목록 "제목·한 줄 설명·핵심 가격 한 줄·상담 신청만"에 들어 있지 않다. 지울지 확인 필요(`service-motion.css:85-86`, `service-editorial.css:50-55`, `webtoon-experience.tsx:15-21`).
- **가격 12컷/24컷 한 줄 2개 박스(img23)**: `blocks/pricing.tsx:32-56` `ul.cs-pricing-grid` / `theme.css:1289-1306`. ≥768px는 이미 2열(`repeat(2)`), <768px는 1열(`display:grid` 기본). 그룹이 3개(웹툰·모션코믹·함께 제작)라 모바일에서 6장이 세로로 길게 쌓인다. 카드는 `.cs-plan`(`theme.css:1307-1316`, 패딩 32/24px, 라운드 14px, 박스) 안에 라벨·금액·"부가세 별도"·"이 구성으로 상담 ↓" 4줄. 요구는 "12컷·24컷 한 줄에 2개씩 박스, 박스 안 정렬·간격 정돈"이므로 모바일에서도 `repeat(2, minmax(0,1fr))`로 두고 박스 안 요소를 줄여야 한다(폭 390px에서 박스 폭 약 170px).
- 웹툰 전용 죽은 CSS 후보: `webtoon.css`의 `.cs-svc-webtoon-cover-card/-caption/-phone/-scroll/-glow` 계열(25-62, 126-153, 230-238줄)은 현재 JSX가 쓰지 않는다(`WebtoonCover`는 `cs-webtoon-fan-*`로 그린다). 정리 대상.
- 테스트: `content-site-wpa.test.mjs`(웹툰 섹션 구조, `:36-40` 금액은 #pricing에만, `:132` tablist 없음, `:198-200` 제목), `content-site.test.mjs:238, 266, 302, 425`, 웹툰 카피 검사(`webtoon.ts` 문자열 전부 마침표·줄 길이 검사 `:218-237` 계열).
- 슬롯: `example-media.ts:59` `webtoon-cut-1..12`, `webtoon-key-1`(`:73`) 유지. `ASSET_REQUEST_R5.md` 웹툰은 이미지만이라 영향 없음(컷은 이미 《1억의 구단주》 사용).

### 4.2 애니메이션 `/content/services/animation`

**파일**: `lib/content-site/services/animation.ts`(173줄) · `components/content-site/services/animation/landing.tsx`(24줄) · `animation.css`(38줄) · `scene-sequence.tsx`(116, client) · `work-sequence.tsx`(51) · `service-hero.tsx`의 `FeaturedWork`·`ExampleFigure`·`ProductionNotes` · `service-motion.css`

**섹션 순서와 카피 원문 (공개판)**
1. Hero: "ANIMATION" / "캐릭터와 장면을 / 움직이는 영상으로" / lead "캐릭터의 표정과 행동, 배경과 장면 전환을 기획해 30초·60초 애니메이션으로 완성합니다" / 가격 칩 "30만 원부터 · 30초 기준 · 부가세 별도" / 버튼 2 / facts "30초 · 60초" "그림체 함께 결정" "장면 먼저 확인" / 미디어 `ExampleFigure animation-hero-1`(연출 예시 + 숨 쉬는 링 장식 `animation.css:196-204`)
2. Types: "WHAT WE MAKE" / "이야기에 맞춰 / 움직입니다" / 카드 3: 캐릭터 애니메이션 · 설명 애니메이션 · 숏폼 애니메이션
3. Signature(`landing.tsx:15-23`): "CHARACTER & SCENE" / "표정이 달라지고 / 장면이 이어집니다" / lead / `WorkSequence`(3장면 깊이 전환, 라벨 "아치 아래 첫 등장" "비 오는 밤의 다리 위" "노을 진 마을로 이어지는 길", "SCENE BY SCENE", 힌트 "스크롤하면 다음 장면으로 넘어갑니다") / `ProductionNotes` "그림에서 영상으로"(캐릭터의 기준 · 장면별 이미지 · 움직임과 편집)
4. Pricing: 30초 30만 원 · 60초 55만 원 (주석 3줄 공통만)
5. Process "장면을 확인하며 / 만듭니다" 4단계 6. Scope 7. FAQ 6 8. Inquiry 9. Related

**구조 문제(길이·중복)**: 히어로 facts 3개 + Types 3카드 + ProductionNotes 3개 + Process 4단계 + Scope 3열(항목 약 7줄)이 모두 "무엇을 만들고 어떤 순서로 만드는가"를 다른 박스로 되풀이한다. 영상 레퍼런스가 중심이어야 하는데 영상 자리는 히어로 이미지 1개와 `WorkSequence`(정지 이미지 3장 전환)뿐이다. `WorkSequence`는 데스크톱에서 sticky 고정 구간이라 스크롤 길이도 추가된다(`scene-sequence.tsx:61-67`, `service-motion.css`).
- 영상 레퍼런스 자리표시: 현재 공개판은 `getExampleMedia("animation","scene")` 3장(이미지, `example-media.ts:76-78`)과 `animation-hero-1`(`:75`)을 쓴다. 영상 전용 슬롯은 `ASSET_REQUEST_R5.md` `MASTER-ANIMATION`(`animation-scene-1..3`, `home-card-animation`)이 영상으로 채울 계획. 자리표시가 비었을 때를 위한 컴포넌트는 아직 없다(`ExampleFigure`는 이미지 전제).
- 검토판 전용 `FeaturedWork`(`service-hero.tsx:30-38`)는 `yofree-night-motion` 작품을 히어로에 올린다 → 이미 '요프리' 고객 작품이 애니메이션 히어로에 연결돼 있다(검토판만).
- 테스트: `content-site-wpa.test.mjs:132-145`(landing 구조, `getSlot("animation-hero-1")`, 장면 슬롯 파일 존재), `:166`(`animationSignature` 동일성), `:198-200`, `content-r5-fix1.test.mjs:57-58`(히어로 예시 태그 위치 CSS), `content-site-wps1.test.mjs:86`(슬롯 ID 존재), `:128`(motion-runtime/scene-sequence/work-sequence/service-hero 서버·클라이언트 경계).

### 4.3 AI 인플루언서 `/content/services/ai-influencer`

**파일**: `lib/content-site/services/ai-influencer.ts`(~140줄) · `lib/content-site/creator-roster.ts`(59, 4계정 데이터) · `components/content-site/services/ai-influencer/landing.tsx`(38) · `creator-experience.tsx`(182, client) · `ai-influencer.css`(240)

**섹션 순서와 카피 원문**
1. Hero: "AI INFLUENCER" / "브랜드를 닮은 / AI 크리에이터" / lead "얼굴과 말투, 관심사를 정해 전용 AI 가상인물을 만들고 제품 이미지와 숏폼을 제작합니다" / 가격 칩 "10만 원부터 · 캐릭터 1명 세팅 + 이미지 5장 기준 · 부가세 별도" / 버튼 2 / facts "캐릭터 1명 세팅" "이미지 · 30초 영상" "AI 가상인물 표기 안내" / 미디어 `CreatorDeck`(`creator-experience.tsx:127-168`): 3D 카드 4장(카드 라벨 "AI 가상인물 / 기록하는87" 등), **그 아래 피드 3컷 줄, 이름 버튼 4개, 타이머 막대, 카테고리·한 줄·"계정과 피드 보기 ↓"·"자체 IP · AI 가상인물 4명"**
2. Types: "한 인물로 / 이어지는 컨텐츠" 3카드
3. Signature `#sheet`: "OUR CREATORS" / "네 개의 계정 / 네 가지 일상" / lead "뷰티와 신혼 생활, 시니어의 취향과 귀농 생활을 각자의 말투와 스타일로 풀어냅니다" / 메모 "자체 IP 계정 소개 · 피드 구성 예시" / `CreatorRoster`(계정 탭 4, 프로필 h3·lead·bio·direction·account, 피드 UI, "네 계정 모두 펼쳐 보기 +")
4. BeforePricing: "YOUR BRAND CHARACTER" / "우리 브랜드에는 / 어떤 인물이 어울릴까요" / lead / 3항목 + "AI 가상인물 표기 · 광고 표기 · 플랫폼 합성 컨텐츠 설정을 함께 안내합니다"
5. Pricing(3플랜: 10만/30만/100만) 6. Process 7. Scope 8. FAQ 9. Inquiry 10. Related

**카드 크기 (img25)**
- 크기 정의: `ai-influencer.css:6-12` `--svc-card-w:240px; --svc-card-h:336px; --svc-orbit-h:384px; --svc-side-x:150px; --svc-side-z:-170px; --svc-back-z:-300px`(모바일 `:159-166`: 196×274, orbit 312, side-x 104). 카드 `.cs-svc-ai-influencer-orbit-card`(`:27-42`), 위치 `data-place`(`:43-46`), 미디어 `object-fit:cover; object-position:center 28%`(`:47-49`).
- 2배 = 데스크톱 약 480×672, orbit 높이 약 768px, side-x 약 300px. 이 덱이 들어가는 히어로 미디어 칸은 `service-editorial.css:2`의 `grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)` 중 큰 칸이며 1440px에서 약 600~660px다. 중앙 카드 480 + 옆 카드(scale .88, 중심 ±300) 폭이 칸을 넘어 `overflow:clip`(`:19`)에 **잘린다**. 2배를 하려면 히어로를 위/아래 배치(제목 위, 덱 전체 폭)로 바꾸거나 side-x를 줄여야 한다.
- **모바일은 2배가 물리적으로 불가능**: 현재 196px → 392px는 390px 뷰포트보다 넓다. "화면 안에서 잘리지 않게"를 지키려면 모바일은 약 1.4~1.5배(약 280~300px, 뷰포트 폭의 75% 안)가 한계. 사용자에게 "모바일 2배 = 최대 ~1.5배"로 알려야 한다.
- 히어로 덱 주변 요소(피드 3컷 줄 `cs-svc-ai-influencer-deck-feed` 폭 372px, 이름 버튼 4, 타이머, 카피 3줄)는 카드가 커지면 첫 화면 밖으로 밀린다.
- `place()`·카드 정렬·`DECK_MS 4000`은 `creator-experience.tsx:58, 71-74`.
- 테스트: `content-site-wpb.test.mjs`(B-1~B-3: `creator-experience.tsx` 단일 client, `href="#sheet"`, `id="sheet"`, 인라인 style 없음 `:88-90`), `content-site-wps2.test.mjs`(S2-1/2: AI 카드 회전·수치), `content-r5-fix1.test.mjs`(고객 문자열 없음).
- 슬롯: `ai-card-1..4`(`example-media.ts:87-90`)·`MASTER-PERSONAS`(선택 3순위, `ai-card-1~4` 영상, 슬롯 신설 필요). 카드가 커지면 해상도 요구가 올라간다(현재 `sizes="(max-width:767px) 56vw, 245px"`, `creator-experience.tsx:146` → 2배면 `sizes`와 원본 해상도 재확인, 900×1200 원본은 480px 카드에 충분).

### 4.4 모션그래픽 `/content/services/motion-graphics`

**파일**: `lib/content-site/services/motion-graphics.ts`(128) · `components/content-site/services/motion-graphics/landing.tsx`(35) · `type-composition.tsx`(43, client) · `motion-graphics.css`(599) · `service-hero.tsx` · `service-editorial.css:33-35`(`cs-service-plan-compare`)

**섹션 순서와 카피 원문**
1. Hero: "MOTION GRAPHICS" / "복잡한 설명도 / 쉽게 보이도록" / lead "로고와 제품 이미지, 숫자와 문구를 읽는 순서에 맞춰 움직이는 30초 또는 60초 영상으로 만듭니다" / 가격 칩 "10만 원부터 · 단순형 30초 기준 · 부가세 별도" / 버튼 2 / facts "단순형 · 맞춤형" "30초 · 60초" "맞춤형은 전용 캐릭터 포함" / 미디어 `ExampleFigure motion-hero-1`(검토판 `bwl-brand-motion`)
2. Types: "이런 장면을 / 움직입니다" 3카드
3. Signature(`landing.tsx:25-34`): ①"DESIGN IN MOTION" / "한 화면에서 / 다음 화면으로" / lead / `WorkSequence`(라벨 "색과 질감으로 시작" "제품을 화면 중앙에" "문구가 들어갈 여백으로", "MOTION TIMELINE") ②**`TypeComposition`**(아래) ③`ProductionNotes` "모션에 들어가기 전"(자료를 고릅니다 · 정지 화면을 맞춥니다 · 움직임과 박자를 정합니다) ④`cs-service-plan-compare` 2칸 "SIMPLE / 가지고 있는 자료로 구성 …" · "CUSTOM / 전용 캐릭터까지 제작 …" + "단순형 가격 보기 ↓" "맞춤형 가격 보기 ↓"
4. Pricing(단순형 30초 10만/60초 18만, 맞춤형 30초 15만/60초 27만, 주석 "맞춤형은 브랜드 전용 캐릭터 제작 서비스 포함") 5. Process 6. Scope 7. FAQ 8. Inquiry 9. Related

**삭제 대상 "AIO MAKE / MOTION STUDY" 박스 (img26)**
- 렌더: `type-composition.tsx:54-77`. 구조: 왼쪽 문구 컬럼("TYPE IN MOTION" / "같은 문구도 배치와 박자가 다르게" / "강조할 단어와 읽는 순서에 맞춰 화면을 구성합니다" / 모드 버튼 3개 "문구 중심" "단어 강조" "이미지 조합" / 안내 "구성이 차례로 바뀝니다 · 버튼으로 직접 고를 수 있습니다") + 오른쪽 `.cs-svc-motion-graphics-live`(배경 이미지 `motion-bg-1`, 도형 6개, 글자 "읽고" "보고" "기억하다", 구분선, 제품 이미지 `motion-scene-2`, 우상단 라벨 `AIO MAKE / MOTION STUDY`, 태그 "연출 예시").
- 호출: `landing.tsx:30`(`<TypeComposition …/>`), import `:10`, `compositionImage()`·`slotImage()` 도우미 `:13-19`, `MEDIA_TAGS` 사용 `:6`.
- CSS: `motion-graphics.css:310-599` 대부분(`-composition*`, `-live*`, 도형·글자·키프레임 drift/spin/tumble/stretch/bounce/letter-a/b/c, `[data-type-mode]` 규칙). 파일 상단 1-309줄은 다른 용도(히어로·compare 등)로 남는지 선택 확인 필요(`:43`, `:243`, `:275` 미디어 쿼리 구간은 옛 compare/frame 스타일일 가능성, 사용 여부 미확인).
- 테스트: `content-site-wpb.test.mjs:88-90`(**client 섬 목록 `["type-composition.tsx"]` 고정 → 파일 삭제 시 모션그래픽 폴더 client 파일 0개로 기대값 수정**), `:96-125`(B-4: 키프레임 이름, `data-type-mode`, `useInViewPlay`·`useAutoCycle`·`aria-pressed` 검사), `:126-133`(`motionGraphicsSignature` 문구), `content-site-wps1.test.mjs:86`(슬롯 `motion-bg-1` 존재 검사).
- 슬롯: `motion-bg-1`(`example-media.ts:80`)과 `ASSET_REQUEST_R5.md` `motion-bg-1`(4-4, `MASTER-MOTION`의 일부)은 삭제 후 용도가 없다. `motion-scene-2`는 `WorkSequence`가 계속 쓴다. `motion-bg-2`(스타일 프레임 배경)는 코드에서 쓰는 곳 확인되지 않음(요청서에만 있음).
- 공용 훅: `motion-runtime.tsx`의 `useAutoCycle`이 다른 곳에서도 쓰이는지 확인 필요(삭제 후 미사용이면 정리).

**요프리 캐릭터 제작 과정 섹션(신규)**
- 찾은 자료(읽기만): 고객 폴더 `I:\AIO_OS\01_WORK\01_에이전시\01_영업관리\03_잠재고객\261010_힐러넷\`
  - `02_컨텐츠 자료\모션그래픽\요프리\MG-20261012-03_v01\`(30초 광고 모션그래픽 3편 후보 v01, 2026-10-12, 승인② 대기·영업 시안 전용): `README.md`, `docs\공통브리프_v01.md`, `docs\기획_3시나리오_v01.md`, `docs\캐릭터컷아웃_확인.jpg`, 편별 `docs\shotlist.md`·`REPORT.md`(S1 키네틱=클레이 캐릭터 포함, S3 모션코믹×캐릭터).
  - `04_쇼핑몰\요프리 쇼핑몰 브랜딩.zip` 내부 `YoFreeMascot.dc.html`(병 모양 SVG 마스코트, 표정 happy/sleepy/wink/worried/calm) · `assets/gen/char-cheer·point·sleep·wave·wink·worried.png`(6포즈).
  - `01_브랜드 자료\02_요프리\`(브랜드 가이드 v1.2, 제품 브랜드).
- **확인된 사실(문서 근거)**: ①요프리는 힐러넷의 제품 브랜드 "요프리 밸런스 샷"(액상+정제 이중제형 건강기능식품). ②"클레이 요프리 캐릭터(쇼핑몰 마스코트)" 6포즈(걱정·윙크(정제 들고)·손 흔듦·점프·베개에서 잠·가리킴)가 2026-10-12 쇼핑몰용 생성 이미지 61장 안에 있다(Higgsfield 생성, `공통브리프_v01.md` 2절). ③그 컷아웃(rembg isnet-general-use)을 30초 광고 3편에 썼다: ①「하루 한 병」키네틱 타이포+클레이 캐릭터(9:16·16:9) ②「부모님께 드리는 하루」한지·먹 프리미엄 ③「요프리가 왔어요」웹툰 모션코믹×캐릭터(캐릭터가 패널을 뚫고 등장). ④캐릭터 쓰는 규칙 일부: 걱정 포즈 등 "고민·문제 장면" 이미지는 쓰지 말 것(브랜드 가이드 금지어).
- **UNKNOWN (문서에서 못 찾음, 만들어 쓰면 안 됨)**: 캐릭터의 **성격**, **세계관**, **외형 규칙**(디자인 시트), **이름/설정 문서**, 캐릭터 설정→디자인→모션 제작 순서를 적은 문서. 폴더에서 `캐릭터|세계관|마스코트|설정`으로 검색했을 때 제작 지시·샷리스트에서 "캐릭터" 단어만 나오고 설정 문서는 없다. 요프리 브랜드 가이드 HTML에도 캐릭터 항목이 0건이다. 사용자에게 물을 것: (a) 설정 자료가 따로 있는지 (b) '설정→디자인→모션' 3단계를 실제 작업 기록(shotlist, review_log)에서 뽑아 쓸지, (c) **권리 확인 여부**(0장 4번: 공개 번들에 '요프리'가 들어가면 기존 테스트·HOLD 규칙 위반, `rightsConfirmed:false`) (d) 쇼핑몰 ZIP 마스코트는 고객 원본 디자인이므로 AIO가 만든 캐릭터로 소개할 수 있는지. 대안: 고객명 없이 "브랜드 전용 캐릭터 제작" 일반 공정 설명으로 쓰고 요프리 사례는 검토판 한정.
- 관련 기존 코드: 데이터 `content/works/yofree-mg30.json`(slug `yofree-mg30`, "30초 광고 모션그래픽 3편", `purpose`/`scope` 문구 있음), `yofree-mg-short.json`(밸런스 샷 모션그래픽 4안), 검토판 연결 선택 `works.server.ts:62-82`(`workMatchesService`). 현재 `MotionGraphics` 페이지의 `FeaturedWork`는 `bwl-brand-motion`을 쓰고 요프리 작품은 `CsWorks` 카드로만 나온다. 맞춤형 설명 "전용 캐릭터까지 제작"(`landing.tsx:32`)이 요프리 사례와 자연스럽게 연결되는 자리.

### 4.5 SNS 광고 영상 `/content/services/ad`

**파일**: `lib/content-site/services/ad.ts`(~175) · `components/content-site/services/ad/landing.tsx`(70) · `ad-reel.tsx`(100, client) · `ad.css`(175) · `blocks/works.tsx` · `lib/content-site/works.server.ts` · `content/works/bwl-brand-ad.json`

**섹션 순서와 카피 원문**
1. Hero: "SNS AD FILM" / "제품의 매력을 / 짧고 선명하게" / lead "릴스와 쇼츠에서 제품 하나를 알리는 9:16 광고 영상을 기획하고 자막과 음악까지 편집합니다" / 가격 칩 "25만 원부터 · 30초 기준 · 부가세 별도" / 버튼 2 / facts "9:16 · 1080p" "기본 자막·BGM 포함" "제품 1개 · 콘셉트 1개 기준" / 미디어 `AdRail`(기울어진 3열 레일 + 가운데 화면)
2. Types: "제품에 맞춰 고르는 / 광고의 표현 방식" 3카드(제품 중심·인물 등장·모션형)
3. Signature(`landing.tsx:61-69`): "VERTICAL EDIT" / "사용하는 순간을 / 보여주는 광고" / lead / `WorkSequence`(라벨 "첫 장면에서 상황을 전달" "사용 방법을 자막으로" "사용 장면으로 마무리", "VERTICAL CUT") / `ProductionNotes` "한 제품, 한 콘셉트" 3개
4. Pricing(30초 25만 / 60초 45만, 주석 2줄 + 공통) 5. Process 6. Scope(기본 포함 4 / 별도 4 / 준비 3) 7. **Works(검토판 전용, 상한 6개: `works.server.ts:28-30`)** 8. FAQ 9. Inquiry 10. Related

**삭제·변경 위치**
- **레일 속도**: `ad.css:145-155` 3개 컬럼이 `animation-duration: 18s`, `ease-in-out`, `alternate`, 지연 `-4.5s`(열 1)·`-9s`(열 2). 이동 거리 `--svc-travel: 140px`(모바일 `:131` 90px, `ad.css:9`) → 18초 동안 140px(약 8px/s)이라 느리다. "대략 절반 수준으로 시작" = `animation-duration: 9s`, 지연도 비율 유지(`-2.25s`, `-4.5s`). 속도뿐 아니라 이동 거리를 늘리는 방법도 있다(`--svc-travel` 증가). 정지 조건 `data-play="paused"`·`:focus-within`(`:157-158`)은 유지.
- 테스트: `content-site-wps2.test.mjs:102-134`(S2-3: **제목 "18초 왕복"**, `animation-duration: 18s;` 119행, `rail-column[data-column="2"] { animation-delay: -9s; }` 122행) → 값 바꾸면 이 테스트 수정 필수. 주석 `ad.css:4, 144`·`ad-reel.tsx:73` 문구도 갱신.
- **중앙 영상 카드 삭제(img27)**:
  - 공개판: `landing.tsx:43-48`(`centerExample()` → `ad-center-1` 슬롯 이미지, 태그), `:57`(`center={work ? undefined : centerExample()}`), `ad-reel.tsx:114-154`(`CenterScreen`, 진행 막대·재생 토글 버튼·무음 재생 로직), `ad.css:68-117, 119-141`(중앙 화면·막대·토글·shadow) + 타입 `CenterMedia`(`ad-reel.tsx:90`).
  - 검토판: `landing.tsx:57-59`가 `FeaturedWork`(BWL · DR's Secret 작품 카드 "작품 보기 ↗", `service-hero.tsx:30-38`)를 children으로 중앙에 올린다. 이것이 img27의 실제 카드다. `children`/`ad-reel.tsx:167` 경로와 CSS `ad.css:119-121`(`.cs-service-featured` 중앙 규칙)도 정리.
  - 결과: 레일만 배경 없이 남게 된다. 레일은 `aria-hidden="true"`(`ad-reel.tsx:160`) 장식이라 **히어로 미디어 칸이 "의미 있는 콘텐츠 없는 장식만"** 되는 점 확인 필요(접근성·콘텐츠 가치). 레일이 중앙 카드 없이 히어로 오른쪽 칸 전체를 차지한다.
  - 테스트: `content-site-wps2.test.mjs:27-31`(client 섬 `["ad-reel.tsx"]`), `:105-110`(`item.id === "ad-center-1"` 검색 **정규식 필수 → 삭제 시 실패**), `:111-113`(검토판 `FeaturedWork` fallback null), `:124-130`(가운데 화면 고정·재생/정지 44px `.cs-svc-ad-screen-toggle` 129-134행), `content-r5-fix1.test.mjs:55`(`.cs-svc-ad-reel-tag .cs-tag` ellipsis).
  - 슬롯·소재: `ad-center-1`(`example-media.ts:95`) 및 `ASSET_REQUEST_R5.md` `ad-center-1`(4-6, `MASTER-AD-A`의 일부이자 1순위, `MASTER-HOME-CARDS`·`MASTER-AD-B` 참조 이미지에도 포함: `:81, 84, 87`)는 **용도 없음 → 요청서에서 삭제**(단 `home-card-ad`는 `ad-center-1`과 같은 제품이라고 `:275`에 적혀 있어 참조 관계 문구 수정). 레일 `ad-rail-1..9`·`ad-scene-1..3`(`example-media.ts:97-108`)은 유지.
- **"브랜드 광고 30초 시안" 제거 (img28)**: 이 카드는 `CsWorks`(검토판) 목록의 한 항목이다. 원인 데이터 `content/works/bwl-brand-ad.json`(`primaryService:"ad"`, `relatedServices:[brand-film]`, 제목 "브랜드 광고 30초 시안", 설명 "16:9 브랜드 광고의 기획과 편집 시안입니다", `brand "BWL · DR's Secret"`) + 생성본 `lib/generated/works.generated.ts:81`. `workMatchesService`(`lib/work-catalog.ts:131-144`)는 `primaryService` 또는 `relatedServices`가 일치하면 포함하므로 현재 광고 페이지와 브랜드 홍보 페이지에 모두 나온다.
  - 방법 A: `bwl-brand-ad.json`의 `primaryService`를 `brand-film`으로, `relatedServices`에서 `ad`를 제외(`ad`로 바꾸지 않기) → `npm run works:build`로 `works.generated.ts` 재생성 필요. 방법 B: `selectContentWorks`(`works.server.ts:63-82`)에서 서비스별 제외 목록 추가(코드 한 줄).
  - 현재 `MAX_WORKS_BY_SERVICE.ad = 6`(`:28-30`)은 "AI 인물 3 + 브랜드 광고 1 + 모션 광고 2" 매핑(명세 6-4) 기준이다. 브랜드 광고가 빠지면 5편이 된다 → 상수·테스트 `content-site.test.mjs:425`(`["bwl-aqua-ad","bwl-brand-ad","bwl-cleanser-ad","bwl-cplus-ad","yofree-mg-short","yofree-mg30"]` 6개 고정) 수정.
  - 브랜드 홍보 페이지 쪽: `brand-film/landing.tsx:14`가 `bwl-brand-ad`를 우선 선택하므로 그대로 동작(현재도 이 slug를 직접 찾음).
  - 공개판에는 영향 없다(CsWorks는 비어 있을 때 렌더하지 않음, `works.tsx:35`).

---

## 5. 공통 블록 · 다른 컨텐츠 서비스 (img24, 모든 서비스 페이지)

- 파일: `components/content-site/blocks/related.tsx`(41줄), CSS `theme.css:1738-1767`, 카피 `lib/content-site/copy.ts:88-91`(eyebrow "MORE SERVICES", title "다른 컨텐츠 서비스"), 호출 `service-landing.tsx:51`.
- 현재 구조: `CsSectionHead`(eyebrow+h2) + `ul.cs-related-list`. 반응형 `theme.css:1738-1750`: 기본 1열 / ≥768px 2열 / ≥1024px **5열**. 카드 `.cs-related-card`(`:1752-1764`): `min-height:120px`, 패딩 24px, 라운드 14px, 박스, 안에 h3 서비스명 + small 시작가(`startingPrice(id,true).head` 예 "30만 원부터", 웹툰은 "웹툰 제작 12컷 10만 원부터"). 설명 문장 없음.
- 한 줄 설명 재료: `lib/content-home.ts:125-194`의 `contentHomeServices[].line`(예 "브랜드 캐릭터가 살아 움직이는 애니메이션") 또는 `lib/home-journey.ts:273-310`의 짧은 한 줄. 가격 문구는 `startingPrice` 재사용 가능.
- 테스트: `content-site.test.mjs:743`(`<CsRelated` 위치·순서), CS_COPY 전체 카피 검사 `:272-275`. 레이아웃·카피를 바꿔도 컴포넌트 이름만 유지하면 순서 테스트는 통과.
- 길이 영향: 5개 항목 × (패딩 24×2 + 120px) 모바일 1열 약 750px. 설명을 더하면 더 길어지므로 2열 그리드 또는 행(리스트) 형태가 높이를 줄인다(좁은 폭 390px에서 한 열 약 170px라 설명이 두세 줄 접힘).

---

## 6. 공통 타이포·정렬·간격 현황

### 6.1 서비스 페이지(컨텐츠 사이트)가 공유하는 것
- 글자 역할 클래스 `.cs-t-*`(display·h2·statement·h3·lead·body·small·caption·eyebrow·label·price·price-sm·num·nav·button·chip·lockup)가 `theme.css:12-83, 294-440`에 있다. 서체는 모두 `--cs-t-family: var(--ff-text)`(Pretendard 가변, `theme.css:12, 210, 310`). **Unbounded는 로고(`.cs-brand .brand`, `theme.css:444-470`) 한 곳**뿐이다.
- 제목 클래스: 섹션 제목 = `cs-t-h2`(`clamp(30px,3.8vw,56px)`/700/1.2/-0.035em), 서비스 히어로 h1 = `.cs-t-display`지만 `.cs-service-editorial-heading .cs-t-display`가 `--cs-t-service-display-size: clamp(38px,4.6vw,68px)`로 덮어쓴다(`service-editorial.css:4, 53`). `/content` 홈 h1은 `--cs-t-display-size: clamp(38px,6vw,88px)`(`theme.css:13`) → **같은 `cs-t-display`인데 홈과 서비스 페이지가 다른 크기**.
- 카드 제목 `cs-t-h3`(`clamp(20px,1.8vw,26px)`), 본문 `cs-t-body` 16px, 보조 `cs-t-small` 14px, 라벨 `cs-t-label` 13px, 캡션 12px. 인라인 style은 컨텐츠 사이트 JSX에 0개(`blocks/*`, `content-home/*` 확인).
- 정렬: 본문 텍스트는 거의 모두 왼쪽 정렬이다. `text-align:center`는 `ai-influencer.css:89`(덱 아래 카피), `brand-film.css:105`(타임라인 칸), `content-home.css:426`(납품 주석), `theme.css:1206`(가격 구분 점)뿐이다. 가운데로 놓이는 것은 **미디어**(`margin-inline:auto`·`justify-self:center`: `service-editorial.css:15, 50`, `service-motion.css:55, 85`, `ai-influencer.css:117, 75`(이름 버튼 중앙 정렬), `theme.css:1108` 히어로 미디어 모바일)와 **AI 덱 아래 카피·버튼**이다. 사용자가 느끼는 "가운데 정렬 어색함"은 (a) AI 덱의 가운데 정렬 카피, (b) 모바일에서 미디어가 가운데이고 텍스트는 왼쪽인 혼재, (c) 메인 페이지의 가운데 섹션으로 보인다.
- 컨테이너: 컨텐츠 사이트는 `.cs-container`(`theme.css:476-481`, `max-width: var(--cs-container)` 1440px, 좌우 `--cs-gutter: clamp(20px,5vw,80px)`) **1종**이 본문·헤더·푸터 공통. 메인은 `.l-container`·`.container`·`.guide-header-inner`·`.guide-footer-inner` 등 8개 선택자가 한 규칙으로 묶여(`type.css:190-201`, 1440 / `--gutter: clamp(20px,4vw,56px)`) 1종이지만 두 사이트의 거터가 다르다(56px vs 80px 상한). 텍스트 블록 최대 폭(`max-width`)은 컨텐츠 CSS에서 **17종**(20em·25em·28em·30em·32em·34em·36em·40em·48em, 420·440·460·520·540·760·900·1000px) 쓰인다(`grep` 집계).
- 섹션 패딩: 서비스 페이지 `--cs-section-y: clamp(72px,10vw,140px)`(`theme.css:98`), 소형 `--cs-section-y-sm: clamp(48px,6vw,88px)`. 컨텐츠 홈은 `.cs-home { --cs-section-y: clamp(64px,7vw,104px) }`로 덮어쓴다(`content-home.css:296`) → **홈과 서비스 페이지 섹션 간격이 다르다**. 서비스 히어로는 별도 `padding: clamp(40px,6vw,84px) 0 64px`(`service-editorial.css:1`, 모바일 `32px 0 48px`). 섹션 머리와 본문 사이 `--cs-head-gap` 48/64px. 메인은 `--section-y: clamp(72px,9vw,128px)`(`globals.css:9`) + 인라인 예외 `clamp(80px,10vw,140px)`(OUR STANDARD) + 히어로 64px 고정.
- 섹션 구분: 컨텐츠 `.cs-section { border-top:1px solid var(--cs-line) }`(`theme.css:1847`)로 모든 섹션에 줄이 들어가고 `--alt` 배경 차이는 없다(전부 #080808). 박스(`--cs-surface` #141414 + 14px 라운드 + 1px 선)는 플랜 카드·관련 카드·타입 카드·스코프·문의 폼에 쓰인다.

### 6.2 `AUDIT_TYPOGRAPHY.md` 대비 현재 상태
- 해결됨: `<html>`에 폰트 변수 부착(`app/layout.tsx:61-63`), `--ff-text/--ff-display/--ff-mono`·`--type-*` 토큰(`app/globals.css:1-60+`), `type.css`의 `.t-*` 클래스, `Unbounded.ttf`→라틴 서브셋 `Unbounded-latin.woff2` + `next/font/local`(`layout.tsx:12-17`). `--ff-display: var(--font-display), var(--ff-text)`라서 **한글이 Unbounded 서체 안에서도 글자별로 Pretendard로 폴백**된다(OS 고딕으로 떨어지지 않음). `main.jsx`의 인라인 제목 크기는 `className="t-h1"`/`"t-h2"`로 바뀌었다(`main.jsx:180, 262, 640, 729`).
- 한글이 Unbounded 서체로 지정된 곳 남음(폴백으로 Pretendard 렌더, 굵기·자간 불일치 가능): `guide.css:99` `.guide-brand`, `:204` `.guide-subbrand`(로고, 영문), `:487` `.guide-kicker`(레퍼런스/인사이트 목록 라벨 — `components/entries.tsx:40, 80, 227`에서 한글 문구 가능성, 확인 필요), `:548` 날짜, `:727` `.guide-utility .eyebrow`, `work-portfolio.css:100` `.work-count`, `main.jsx:357, 453, 548`("Studio" "Marketing" "Lab" 영문 제목이라 문제 없음), `main.jsx:677`(FAQ +/−), `about.jsx:283, 613`, `marketing-home.jsx:2305, 2332, 2641, 2771`. 컨텐츠 사이트(`/content/**`)는 해당 없음.
- JetBrains Mono: `guide.css:10-11`에 `@font-face`가 남아 있고 `lab-home.jsx`·`lab-services.jsx`(개발 분야 페이지)에서 `--ff-mono`를 쓴다(메인·컨텐츠 범위 밖).
- 남은 문제(메인 `/`): 인라인 `style`이 `main.jsx` 83곳, hex 색 직접 사용, 버튼 패딩 인라인(`18px 28px`, `16.5px 26px`), 칩 테두리 `#55555E` 등. `!important` 제거와 컨테이너 클래스 통일은 일부 진행(`l-container` 사용)이지만 OUR STANDARD(`maxWidth:1000px`, `clamp(80px,10vw,140px)`)는 인라인 예외로 남았다.
- 컨텐츠 CSS 자체의 일관성 문제: `content-home.css`는 "R2 work-led gallery"·"R3"·"R4→R5" 덧씌움 블록이 아래에 계속 붙은 구조다(`:275-296, 297-343, 345-385`). 같은 선택자(`.ch-hero`, `.ch-detail`, `.ch-services`)가 위에서 정의되고 아래에서 다시 덮어쓴다. R6에서 홈을 재구성할 때 파일을 새로 쓰는 편이 안전하다.

### 6.3 R6에서 정할 공통 기준에 바로 쓸 수 있는 현황 숫자
- 서비스 페이지 제목 계층: h1 1개(`cs-t-display` 68px 상한) → h2(섹션) 56px 상한 → h3(카드) 26px 상한. 홈 h1은 88px.
- 컨텐츠 사이트 섹션 패딩 값 종류: 서비스 140 / 홈 104 / sm 88 / 히어로 84, 64.
- 가운데 정렬 텍스트 블록: 컨텐츠 사이트 4곳(주로 AI 덱), 메인 3곳(히어로·분야 h2·OUR STANDARD).

---

## 7. 페이지 길이를 늘리는 중복·장식 요소

### 7.1 모든 서비스 페이지 공통 (공개판 기준)
| 요소 | 위치 | 문제 |
|---|---|---|
| 히어로 facts 3줄 | `service-hero.tsx:23`, `data.hero.facts` | Types·Scope가 같은 내용 반복 |
| 가격 칩 + 보조 문장 + 버튼 2 + facts | `service-hero.tsx:19-24` | 히어로 한 구간에 CTA·가격·사실 4중 구조 |
| Types 3카드 + Signature의 ProductionNotes 3개 + Process 4단계 + Scope 3열 | `blocks/types.tsx`, `service-hero.tsx:52-54`, `blocks/process.tsx`, `blocks/scope.tsx` | "무엇을 만들고 어떻게 진행하나"를 4번 서술. 모두 박스/카드 |
| "수정 2회·1회" 문구 | Process 단계 `check` 2곳 + Pricing 공통 주석 + Scope "기본 포함" + FAQ 공통 첫 문항(+홈 PROCESS lead) | 같은 사실이 한 페이지에 5회 |
| "부가세 별도" | 히어로 가격 칩 + 플랜 카드마다 + 가격 주석 + FAQ 공통 문항 | 웹툰은 카드 6장이라 총 약 9회 |
| "상담 신청" 계열 | 헤더 CTA, 히어로 버튼, 모바일 하단 바, 플랜 카드마다 "이 구성으로 상담 ↓", Inquiry | 웹툰 한 페이지에 10회 안팎 |
| "대량·정기 제작은 별도" | Scope "별도 상담" + 가격 주석 + FAQ 공통 | 3회 |
| Inquiry의 진행 순서 3단계 | `copy.ts:67-69`("상담 신청 / 기획안과 견적 안내 / 제작 시작") | Process 섹션과 겹침 |
| Related 5카드(가격만 있음) | `blocks/related.tsx` | 750px 안팎, 정보량 낮음 |
| 섹션 구분선 + 번호 장식 | `theme.css:1847`, `cs-t-num`(`clamp(40px,4vw,64px)` 얇은 큰 숫자, Types·Process 카드) | 장식용 큰 숫자 |

### 7.2 서비스별 추가 항목
- **웹툰**: Unfold(스크롤 컷 펼침, sticky 고정 구간)와 Reader(12컷 3D 책)와 MotionComic 3섹션이 같은 12컷을 세 번 보여준다. 가격 그룹 3개(6카드). 히어로 `WebtoonCover` 부채+캡션+링크. 죽은 CSS(4.1).
- **애니메이션**: 히어로 이미지 + 장면 전환(sticky) + ProductionNotes + 숨 쉬는 링·점 장식(`animation.css:196-204`).
- **AI 인플루언서**: 히어로 덱 안에 카드+피드 3컷+이름 버튼+타이머+카피+링크 7요소, 그 아래 Roster 섹션(탭 4+프로필+피드 UI+"모두 펼쳐 보기")이 같은 4계정을 다시 소개, BeforePricing 3항목+고지 문장이 또 한 섹션.
- **모션그래픽**: WorkSequence + TypeComposition(삭제 대상) + ProductionNotes + plan-compare 2칸이 모두 Signature 안에 연달아 놓여 한 섹션이 매우 길다. plan-compare의 "SIMPLE/CUSTOM"은 Pricing의 단순형/맞춤형 카드와 중복.
- **SNS 광고**: 레일(장식, aria-hidden)+중앙 카드(삭제 대상) + WorkSequence + ProductionNotes. 검토판은 Works 6편이 더 붙는다.
- **/content 홈**: 히어로 2카드+formats 줄, 캐러셀 위 탭 칩, 캐러셀 아래 설명 블록+아코디언, 과정 4탭+장식 패널 4종(기울어진 종이·메모·콘티·타임라인·파일), CTA. 메인 `/`는 분야 카드 3장 + 워크플로우 3단계(각각 탭/스테이지/이전·다음) + OUR STANDARD + FAQ + 문의로, 단계 간격 `--wj-step-gap` 96~160px가 가장 크다.

---

## 8. 삭제·변경이 영향을 주는 테스트 파일 종합

| 요구 | 영향 테스트(줄) | 비고 |
|---|---|---|
| 홈 히어로 비우기 | `content-home.test.mjs` 1(114-131)·3(199-217)·4(218-237) 카피 검사, 8-4(479-502), 8-5(503-535), 10(546-565) | `reelSlot`·`data-slot`·`hero.video ?` 구조는 유지해야 8-4·10이 통과 |
| 서비스 탭 칩 삭제 | `content-home.test.mjs` 8-1(337-372: `role="tablist"` 341행) | |
| 캐러셀 컨트롤 | 8-2(373-445: `cs-ch-autoplay`·`.ch-autoplay-fill` 문자열·animationend), 8-3(446-478: `.ch-depth-nav .ch-arrow` 476행) | 자동 넘김 시계 교체 시 대폭 수정 |
| 서비스 설명 블록 삭제 | 2(132-198: `service-detail.tsx` 읽기 185-195), 3·4(카피 검사의 `description`·`uses`), `:68`(`detailLink`), `:475`(`.ch-detail-more summary`) | 파일 삭제 시 `read()` 실패 |
| PROCESS 재기획 | 8(263-336) 일부, 8-5의 과정 탭 계약(517-535), 12(579-593), `:358-360`(process-tabs role), `:497-499` | 4단계 라벨·수정 횟수 정규식 |
| 관련 서비스 변경 | `content-site.test.mjs:743`(순서), `:272-275`(CS_COPY 카피 검사) | 컴포넌트 이름 `CsRelated` 유지 시 순서 테스트 통과 |
| hero facts / "가격 보기" 삭제 | `content-site.test.mjs:266`(`facts.length === 3`), 카피 검사 `:218-237` 계열 | `types.ts:51` 튜플 타입도 변경 |
| 웹툰 가격 | `content-site-wpa.test.mjs:36-40`, `content-site.test.mjs:238, 302` | 금액 정본 비교는 그대로 통과 |
| 모션 STUDY 박스 삭제 | `content-site-wpb.test.mjs:88-90, 96-125, 126-133`, `content-site-wps1.test.mjs:86` | client 섬 기대값을 `[]`로 |
| 광고 레일 속도 | `content-site-wps2.test.mjs:102-122` (`18s`, `-9s`) | |
| 광고 중앙 카드 삭제 | `content-site-wps2.test.mjs:27-31, 105-113, 124-134`, `content-r5-fix1.test.mjs:55` | `ad-center-1` 정규식 필수 |
| 브랜드 광고 시안 제외 | `content-site.test.mjs:425`(6개 slug 고정), `reference-release.test.mjs:144-166`(works 선택 규칙 확인 필요) | 데이터 변경 시 `npm run works:build` |
| AI 카드 크기 | `content-site-wpb.test.mjs`(B-1~B-3), `content-site-wps2.test.mjs`(S2-1/2) | 크기 숫자 직접 검사는 확인 필요(미확인) |
| 요프리 사례 공개 | `content-site.test.mjs:59`, `content-site-wps1.test.mjs:13`, `content-r5-fix1.test.mjs:10`, `seo-http.mjs:348`(공개 번들·HTML에서 요프리/YoFree/yofree- 금지) | 사용자 권리 확인 없이는 공개판에 넣을 수 없음 |
| 메인 제목·워크플로우 | `home-journey.test.mjs:132-144`("상담부터 성과까지"), `:195-201`(레일 `scaleY(0.333333)` 등 3단계 고정), `:319`(OUR STANDARD), `new-tab-links.test.mjs:69-118` | 단계 수를 바꾸면 레일 수치 테스트 수정 |
| 전체 | 직렬 실행 `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | R5 기준 119중 118 PASS·1 skip |

(주: 위 줄 번호는 grep과 부분 읽기로 확인한 것이다. 각 테스트의 세부 assert는 구현 담당이 해당 파일을 열어 정확히 대조해야 한다.)

## 9. example-media 슬롯 · `ASSET_REQUEST_R5.md` 영향 정리

| 슬롯 | 현재 용도 | R6 후 | 요청서 조치 |
|---|---|---|---|
| `home-hero-reel` / `home-hero-reel-mobile` | `/content` 히어로 배경 루프 | 사용자 메이킹 필름이 대체 | 요청 삭제 또는 우선순위 하향 (`MASTER-HERO` 마스터 전체) |
| 히어로 연출 예시 이미지 (`CONTENT_SITE_ASSETS.hero`, `/content-site/hero.webp`) | 히어로 작품 카드 | 삭제 | 해당 없음(기존 자산). 브랜드 영상 폴백 포스터로는 계속 사용 |
| `home-card-*` 6개 | 캐러셀 카드 | 유지(설명 블록 삭제와 무관) | 유지. `home-card-motion-graphics`는 PROCESS 제작 장면에서도 쓰이던 것이 사라짐 |
| `motion-bg-1` | MOTION STUDY 박스 배경 | **삭제** | 요청서 4-4에서 삭제, `MASTER-MOTION`은 `motion-bg-2`·`home-card-motion-graphics`만 남기거나 재검토 |
| `motion-bg-2` | 코드에서 사용처 미확인 | — | 필요 여부 재확인 |
| `motion-scene-1..3`, `motion-hero-1` | 장면 전환·히어로 | 유지 | 유지 |
| `ad-center-1` | 광고 중앙 영상 카드(공개판) | **삭제** | 요청서 `MASTER-AD-A`·`MASTER-AD-B`·`MASTER-HOME-CARDS`의 `ad-center-1` 항목 삭제, `home-card-ad` 설명 속 참조 수정 |
| `ad-rail-1..9`, `ad-scene-1..3` | 레일·장면 | 유지(레일 속도만 변경) | 유지 |
| `animation-scene-1..3`, `animation-hero-1` | 장면 전환·히어로 | 영상 레퍼런스 영역 재구성에 따라 변경 가능 | 영상 슬롯 구조 확정 후 재정리 |
| `ai-card-1..4` | AI 덱 카드 | 카드 확대로 해상도 요구 상향 | 요청서 `MASTER-PERSONAS`의 크기 사양 재확인 |
| `webtoon-cut-1..12`, `webtoon-key-1` | 리더·펼침·부채 | 유지 | 유지(웹툰은 이미 사용자 결정으로 전 컷 사용) |

## 10. 사용자에게 확인이 필요한 사항 (BRIEF_R6 기획안에 포함 권장)

1. `/content` 홈 히어로: 영상이 없을 때의 자리표시 모양, 그리고 h1(숨김 h1 포함) 유지 여부.
2. 서비스 설명 블록과 히어로 formats 줄을 지우면 공개판 `/content`에서 서비스 페이지로 가는 링크가 없어진다 → 카드 자체를 링크로 만들지.
3. 캐러셀 자동 회전 시계를 타이머로 바꿔도 되는지(동작은 같게 유지).
4. 웹툰 히어로 미디어(`WebtoonCover`)를 남길지. "제목·한 줄 설명·핵심 가격 한 줄·상담 신청만"에 미디어가 빠져 있다.
5. 히어로 facts·가격 보조 문장·"가격 보기" 삭제를 웹툰만 할지 6개 서비스 전체에 할지(공용 컴포넌트).
6. AI 인플루언서 카드 "2배 이상"은 모바일에서 물리적으로 불가능(≈1.5배 상한). 데스크톱은 히어로 레이아웃 변경(덱 전체 폭)이 필요.
7. 광고 레일만 남으면 히어로 미디어가 장식 전용이 된다. 중앙 대체 요소 없이 괜찮은지.
8. 요프리: 설정 문서 부재(성격·세계관·외형 규칙 UNKNOWN), 공개 권리 HOLD와의 충돌. 어떤 근거로 어디까지 쓸지.
9. 메인 `/`: 분야 카드(01 컨텐츠·02 마케팅·03 개발)와 워크플로우(01 개발·02 마케팅·03 컨텐츠) 순서 통일, Studio/Marketing/Lab 영문 이름 유지 여부, 워크플로우 제목 "기획부터 성과까지" 결정, 가운데 정렬 섹션(히어로·OUR STANDARD) 처리.
10. 공통 기준 결정: 홈과 서비스 페이지의 섹션 패딩·h1 크기 일치 여부, 컨텐츠 사이트 거터(80px 상한)와 메인(56px)을 맞출지.

## 11. 요약 숫자
- 조사한 화면 파일: 메인 5개 묶음, /content 7개 + CSS 1(536줄), 서비스 공통 9개 블록 + 서비스별 5개 랜딩/데이터 쌍, 테스트 12개 파일.
- 서비스 페이지 섹션 수: 웹툰 11, AI 10, 애니메이션·모션·광고 9(공개판).
- 삭제 대상 컴포넌트·파일: `service-detail.tsx`(전체), `hero-stage.tsx`(전체), `type-composition.tsx`(전체), `ad-reel.tsx`의 `CenterScreen`, `process-tabs.tsx`(재기획), `blocks/hero.tsx`(미사용), 죽은 데이터 `animationSignature.styles/beforeMotion`·`motionGraphicsSignature.compare/frame/stage`.
- 직접 영향을 받는 테스트 파일: `content-home.test.mjs`, `content-site.test.mjs`, `content-site-wpa.test.mjs`, `content-site-wpb.test.mjs`, `content-site-wps1.test.mjs`, `content-site-wps2.test.mjs`, `content-r5-fix1.test.mjs`, `home-journey.test.mjs`, `new-tab-links.test.mjs`(9개), 요프리 공개 시 `seo-http.mjs` 포함.
