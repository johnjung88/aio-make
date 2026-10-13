# 타이포그래피·정렬 감사 (읽기 전용)

작성 2026-10-14 · 대상 작업트리 `codex/WRK-20261013-AIO-CONTENT-RENEWAL` · 방법: CSS/JSX 정적 분석 + 폰트 파일 cmap 직접 조회. 서버·빌드·브라우저 미실행(NOT_RUN). 아래 "확인 필요" 표시는 브라우저 계산값으로 재확인할 항목이다.

제외(동시 작업자 담당): GuideNav(`.guide-subnav` `.guide-subbrand` `.guide-sublinks` `.guide-nav-cta`, guide.css:181-271), 서비스 탭 줄(`.guide-service-tabs`, review.css:1151-1190, ux.css:20-43), content-service 앵커 줄. 서비스 상세(`components/content-service/*`, `service-overview/detail`)는 3장에 짧게만 적는다.

## 0. 원인 요약 (이것만 고쳐도 체감이 크게 바뀐다)

1. **Unbounded·JetBrains Mono에는 한글 글리프가 없다.** `public/fonts/Unbounded.ttf` cmap 1,138자, U+AC00·U+3131 없음. JetBrains Mono 976자, 한글 없음(fontTools 조회). 그런데 대부분 스택이 `Unbounded,sans-serif`라 한글은 Pretendard가 아니라 OS 기본 고딕(Windows 맑은 고딕, macOS Apple SD Gothic Neo)으로 떨어진다. 같은 줄에 Pretendard와 OS 고딕이 섞인다.
2. **`.guide-page h1/h2`의 `!important`가 JSX 인라인 제목 스타일을 전부 무효화한다**(review.css:1115-1136, 1223-1229). 인라인 값은 파일마다 다른데 실제 렌더는 숨겨져 있다. 홈 한 페이지에 h2 크기 공식이 6가지다.
3. **`.guide-page`가 `line-height: normal`**(guide.css:26)이고 `p`만 1.75(globals.css:93)다. span/strong/div로 만든 설명문은 행간이 붙어서 두세 줄로 접히면 답답해 보인다.
4. **컨테이너 정의가 7가지**(최대폭 1320/1360/1440, 좌우 여백 40/48/56/72px). 헤더·푸터·본문 좌측선이 어긋난다.
5. **자간 극단값**(-0.085em)과 한글에 붙은 양수 자간(+0.1em~+0.14em).

## 1. 제안 단일 타입 스케일

### 1.1 먼저 고칠 전제 (토큰이 동작하려면)

`app/layout.tsx:56`에서 `pretendard.variable`이 `<body>`에만 붙어 있다. `--font-body`는 body에서만 정의되므로 `:root`에 `var(--font-body)`를 쓰는 토큰을 만들면 값이 비어 버린다. `className={pretendard.variable}`을 `<html lang="ko">`(55행)로 옮기거나 둘 다 붙인다.

```css
:root{
  /* 서체: Hangul이 한 글자라도 들어갈 수 있는 곳은 --ff-text만 쓴다 */
  --ff-text: var(--font-body), "Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif;
  --ff-display: Unbounded, var(--ff-text);          /* 라틴 전용: 로고, 영문 eyebrow, 숫자, 영문 단어 제목 */
  --ff-mono: "JetBrains Mono", var(--ff-text);
  --gutter: clamp(20px, 4vw, 56px);
  --container: 1440px;                               /* 콘텐츠 폭 = 1440 - 2*56 = 1328 */
  --section-y: clamp(72px, 9vw, 128px);
  --section-y-sm: clamp(48px, 6vw, 88px);
}
```

`--ff-display`에 `var(--ff-text)`를 이어 두면 한글이 실수로 들어가도 글자별 폴백이 Pretendard로 간다. 다만 굵기·폭이 달라 보이므로 한글 문구는 처음부터 `--ff-text` 클래스를 쓴다.

### 1.2 역할표

| 역할 | family | size | weight | line-height | letter-spacing | 현행 → 통일 대상 |
|---|---|---|---|---|---|---|
| display / h1 | text | `clamp(34px,5.2vw,78px)` | 750 | 1.2 | -0.04em | review.css:1116은 `clamp(36px,5.3vw,78px)!important`, 모바일 `clamp(34px,8.7vw,48px)!important`. 인라인은 페이지마다 5종 |
| h2 | text | `clamp(28px,3.6vw,52px)` | 700 | 1.25 | -0.035em | 홈에서만 28~60, 25~52, 34~64, 30~52, 32~60, 36~68 |
| h2-latin (영문 단어 제목 Services/Process/Insights 한정) | display | h2와 동일 clamp | 700 | 1.2 | -0.03em | 현행 `clamp(36px,5vw,72px)` 800, lh 1 (스튜디오 3곳, 마케팅 6곳) |
| h3 (카드 제목) | text | `clamp(20px,1.9vw,28px)` | 650 | 1.35 | -0.025em | 18/19/20/22/24/26/30 혼재 |
| h3-feature (분야명, 큰 문장형 문단) | display 또는 text | `clamp(26px,2.8vw,40px)` | 600 | 1.2 (문장형은 1.5) | -0.03em | main.jsx:391 `clamp(30px,3vw,40px)` 유지 가능 |
| lead (제목 아래 설명) | text | `clamp(17px,1.4vw,20px)` | 400 | 1.75 | -0.01em | 16~21 clamp, 17, 17.5, 18 혼재 |
| body | text | 16px | 400 | 1.75 | -0.01em | 15/16/17 혼재 |
| small (카드·목록 설명) | text | 14px | 400 | 1.7 | -0.005em | 13, 13.5, 14, 15 혼재 |
| caption (주석·메타·배지) | text | 12px | 400/500 | 1.6 | 0.01em | 9.5, 10, 10.5, 11, 11.5, 12, 12.5 |
| eyebrow (영문) | display | 12px | 500 | 1.5 | +0.14em, uppercase | 11px/.12em(globals), 11px/.14em(work), 12px/.16em·.18em·.1em(인라인) |
| eyebrow-ko (한글 라벨) | text | 13px | 650 | 1.5 | +0.02em, 대문자 없음 | review.css:748 `.review-eyebrow` |
| nav | text | 14px | 500 | 1.4 | -0.01em | guide.css:126 `14.5px` |
| button | text | 15px (sm 14, lg 16) | 600 | 1.2 | -0.01em | 13/14/14.5/15/16, weight 600/650/700/730 혼재 |
| chip (필터·선택) | text | 14px | 500 | 1.2 | 0 | 12(work-filter)/13/14/15 혼재 |

굵기는 400/500/600/650/700/750만 쓴다(로고 잠금은 300/800 예외). 현재 CSS에 560, 680, 730, 740, 760, 780 같은 값이 있다(work-portfolio.css).

규칙: (a) 제목 자간은 -0.05em보다 좁히지 않는다. (b) 양수 자간은 영문 대문자 eyebrow에만 쓰고 한글에는 쓰지 않는다. (c) 12px 미만 텍스트는 `aria-hidden` 일러스트 목업 안에서만 허용한다. (d) 반 픽셀 크기(12.5, 13.5, 15.5, 17.5)를 쓰지 않는다. (e) 한글이 한 글자라도 들어가는 요소는 `--ff-text`.

### 1.3 벤치마크(`aio-content-v01/dist/style.css`) 대조

- 벤치마크는 Pretendard 단일 서체다(`body{font-family:Pretendard,'Malgun Gothic',sans-serif}`). Unbounded가 없다. 결정 필요: 옵션 A(권장) 로고·영문 eyebrow·숫자에만 Unbounded 유지. 옵션 B 벤치마크와 동일하게 Unbounded 전면 폐기. B는 `--ff-display: var(--ff-text);` 한 줄로 전환된다.
- 벤치마크 h1 `clamp(40px,4.9vw,78px)`/730/lh 1.24/-3.8px, h2 `clamp(32px,3.2vw,50px)`/690/lh 1.2/-2px, 카드 h3 32/740/1.18/-1.3px, 목록 h3 18~21/640~650. 제안값은 이 크기·굵기 범위 안이다. 단 자간은 px 고정이면 40px에서 -0.095em까지 조여지므로 em으로 바꿨다.
- 벤치마크 eyebrow 10~11px/680/1.8px(=0.16em). 제안은 12px로 올리고 0.14em으로 줄였다(가독성).
- 벤치마크 좌우 여백은 헤더 4.5%, 섹션 7.5%로 서로 다르다. 이 불일치는 따라 하지 않고 `--gutter` 하나로 통일한다.
- 벤치마크 본문 설명 14px/1.9, 16px/1.85. 제안 body 1.75, small 1.7은 한글 과밀을 피하면서 문단 길이를 줄인 값이다.

### 1.4 컨테이너·간격 기준

모든 섹션 래퍼를 `.l-container{max-width:var(--container);margin-inline:auto;padding-inline:var(--gutter)}` 하나로 한다(콘텐츠 폭 1328px은 이미 `showcase-video-brand`(ux.css:290-292)와 `.guide-editorial-cta`(guide.css:598)가 쓰는 값). 세로 여백은 `--section-y`(큰 섹션) / `--section-y-sm`(소형) 두 값만 쓴다.

## 2. 발견 사항

심각도: high 눈에 띄게 틀어짐 · med 일관성 깨짐 · low 정리 대상. 행 번호는 작업트리 기준.

### A. 서체 패밀리

| ID | file:line | 위치 | 문제 | 심각도 | 수정 |
|---|---|---|---|---|---|
| A1 | guide.css:521-525 (`.guide-kicker`) · entries.tsx:40-47, 225-229 | 레퍼런스·인사이트 목록/글 상단 라벨 | `Unbounded,sans-serif`에 "서비스 미리보기", "고객 사례"가 들어간다 → 한글이 OS 고딕. 자간 .14em까지 한글에 적용 | high | 한글 문구는 `.eyebrow-ko` 클래스(`--ff-text`, 13px/650/+0.02em)로 분리. 영문 "GUIDE/INSIGHT/…WORKS"만 `.eyebrow` |
| A2 | work-portfolio.css:179 · work-portfolio.tsx:323,328 | 작업 상세 facts | `.work-detail-facts span` Unbounded 11px에 "01 / 목적", "02 / 범위" | high | 숫자 `01 /`만 Unbounded 스팬, "목적"은 `--ff-text` |
| A3 | marketing-home.jsx:905, 1084, 1238 | 마케팅 홈 STEP 라벨 | Unbounded 11px/.14em에 "STEP 01 · 상담·분석 자료" 등 한글 혼합 | high | "STEP 01"만 display, 뒤 한글은 별도 스팬 `--ff-text`, 자간 0 |
| A4 | marketing-home.jsx:2596-2603 · studio-home.jsx:191-219 | "서비스 자세히 보기 →", "제작 방향 살펴보기" | 한글 링크 문구에 Unbounded + 자간 .1em | high | `.t-button` (`--ff-text`, 자간 -0.01em). 화살표 "→"는 Unbounded에도 있다(cmap 확인) |
| A5 | studio-home.jsx:540-549 · marketing-home.jsx:3030-3040 · primitives.tsx:~606 | 인사이트 카드 날짜 | Unbounded 13px/12.5px에 "제작 가이드", "서비스 안내" 출력. `p.date === "制作"`라는 한자 비교 코드가 남아 있다 | high | 날짜 숫자만 display, 문구는 `--ff-text`. 한자 비교 분기 삭제 |
| A6 | marketing-home.jsx:1132, 1144 | "20개 → 100개" 의 "개" | `'Pretendard Variable',sans-serif`는 어떤 `@font-face`에도 정의돼 있지 않다(layout.tsx는 `next/font` 해시 이름). 사용자 PC에 Pretendard가 없으면 OS 고딕 | high | `fontFamily: "var(--ff-text)"` |
| A7 | work-portfolio.css:131 (`.work-card-placeholder`) | 작업 카드 대체 이미지 | `Unbounded,sans-serif` + 고객 한글 상호 → OS 고딕 | med | `--ff-text`, weight 650 |
| A8 | work-portfolio.css:32, 171 | /work 목록 h1, 상세 h1 | 스택은 `Unbounded, var(--font-body)`라 한글은 Pretendard로 간다. 즉 Unbounded는 마침표 하나에만 적용(목록 h1 "레퍼런스." 등). 같은 줄에서 굵기·폭이 어긋남 | med | h1 `--ff-text`로 통일, 마침표도 같은 서체 |
| A9 | 인라인 전역 (main 13, about 11, studio-home 10, studio-contact 1, marketing-home 27, team 4, marketing-contact 1 = 67곳) | 홈/소개/스튜디오/마케팅 | `fontFamily:"Unbounded,sans-serif"` 문자열이 파일마다 복사돼 있다. 한글 폴백 경로 없음 | med | 일괄 치환 `"Unbounded,sans-serif"` → `"var(--ff-display)"`, 이후 A1~A5 개별 정리 |
| A10 | guide.css:2-13 · app/layout.tsx:6-11 | 폰트 로딩 | Unbounded(778KB TTF)·JetBrains Mono(187KB TTF)는 CSS `@font-face` + `swap`, preload 없음. 로딩 전 폴백(좁은 고딕)으로 그렸다가 폭 넓은 Unbounded로 바뀌며 영문 제목이 재배치된다 | med | Unbounded를 라틴 서브셋 woff2로 줄여 `next/font/local`(preload, `adjustFontFallback`)로 이동. 확인 필요: Network 탭 폰트 완료 시점과 CLS |
| A11 | site-shell.tsx:8 · globals.css:195-216 · guide.css:97-121 | 헤더/푸터 로고 | `className="brand guide-brand"` 두 규칙이 같은 우선순위로 충돌: font-size 21 vs 19, `align-items:center` vs `baseline`, `.brand>span` weight 350·자간 -0.06em vs `.guide-brand>span` 300·inherit, `i` `align-self` flex-start vs auto. 이긴 쪽은 CSS 주입 순서에 달려 있다(개발/운영이 다를 수 있음) | med | 공개 영역은 `.guide-header .guide-brand` / `.guide-footer .guide-brand`로 특이도를 올려 `.brand` 선언을 덮거나 `.brand` 중복 선언 제거(admin이 `Brand`를 쓰므로 `.brand`는 admin 전용으로 축소) |

### B. 같은 역할, 다른 크기 / 제목 시스템

| ID | file:line | 위치 | 문제 | 심각도 | 수정 |
|---|---|---|---|---|---|
| B1 | review.css:1115-1120, 1133-1136, 1223-1229 | `.guide-page` 전체 h1/h2 | `font-size/line-height/letter-spacing !important`가 모든 인라인 제목 스타일을 덮는다. 인라인(main.jsx:206-210 등)은 죽은 값. 반대로 `!important`를 지우면 죽은 값이 되살아나 페이지마다 달라진다 | high | 1.2 토큰 클래스 `.t-h1`/`.t-h2`를 만들고 아래 B2의 제목 요소들에서 인라인 크기·자간·행간·굵기를 제거한 뒤에 `!important` 블록 삭제 (반드시 같은 커밋) |
| B2 | h1: main.jsx:203, about.jsx:167, studio-home.jsx:174, studio-contact.jsx:149, marketing-home.jsx:641 / h2: main.jsx:290,626,834,928, about.jsx:247,352,562,740,791, studio-home.jsx:281,392,483,585, marketing-home.jsx:1671,1816,2438,2636,2816,2924,3105 (team.jsx:211,268,387,564, marketing-contact.jsx:169도 동일) | 제목 요소 27개 | 인라인 `fontSize/letterSpacing/lineHeight/fontWeight`가 요소마다 다르다. h1: clamp 42~104/-.03em, 44~112/-.025em, 40~100/-.045em, 36~68/-.04em, 40~80/-.045em | high | 해당 요소에 `className="t-h1"`/`"t-h2"`(또는 `t-h2 t-h2--latin`) 부여, 인라인 4속성 삭제 |
| B3 | main.jsx:294, review.css:875, work-portfolio.css:227, ux.css:189, main.jsx:837, 931 | 홈 h2 6종 | 분야 선택 `clamp(28,4.4vw,60)` 700 · 방법 `clamp(25,4.4vw,52)` 750 · 레퍼런스 `clamp(34,4.5vw,64)`(자간 -.055em은 B1로 죽음) · 영상 쇼케이스 `clamp(30,3.5vw,52)` · FAQ `clamp(32,4.4vw,60)` · 문의 `clamp(36,5vw,68)` 800 | high | 전부 `.t-h2` |
| B4 | about.jsx:250,355,565,743,794 · studio-home.jsx:285,396,487,588 · marketing-home.jsx:1674,1819,2441,2639,2819,2927,3108 | 소개·스튜디오·마케팅 h2 | 소개 `32~60/700` · 소개 CTA `32~64/800` · 스튜디오 `36~72`(Unbounded 800, lh 1) · 스튜디오 CTA `32~64` · 마케팅 `36~72` · 마케팅 CTA `30~60` | high | `.t-h2` (영문 단어 제목은 `.t-h2--latin`) |
| B5 | guide.css:98 `19px` · guide.css:295 `22px` · about.jsx:392,441,490 `20px` · about.jsx:295 `clamp(40,5.4vw,72)` | 로고 잠금 5종 | 헤더 19, 푸터 22, 소개 카드 20, 소개 대형 가변. 비율 규칙이 없다 | low | 잠금 크기를 `--brand-sm/md/lg`로 고정 |
| B6 | review.css:748-754, work-portfolio.css:21-29, ux.css:181-186, globals.css:111-117, guide.css:759-762 및 인라인 12px/.16em 계열 | eyebrow | 홈 한 페이지 안에서 Unbounded 12px/.16em("All-In-One Agency", "OUR STANDARD")와 Pretendard 11px/760/.14em("SELECTED WORK", home-references.tsx:44)와 12px/600/.16em(showcase-video 헤딩)이 공존한다. 정의가 5곳 | med | `.eyebrow` / `.eyebrow-ko` 2종으로 통일. `.work-eyebrow` `.review-eyebrow` `.guide-kicker` 별칭 삭제 |
| B7 | main.jsx:399 vs 492-500, 594-603 | 홈 분야 카드 3장 | 첫 카드 목록은 `.p1-content-service-list`(studio-p1.css:6-13, 줄바꿈 허용, 색 `var(--muted)`=#aaa9b4), 나머지 둘은 인라인 `nowrap` + `#C9C9D1`. 같은 위치 텍스트의 색·줄바꿈·크기 공식이 다르다. 721~1000px에서 nowrap은 340px 카드 안(내부 276px)에서 넘칠 수 있다 | med | 3장 모두 `.t-small` + `overflow-wrap:anywhere`, 색 하나로 통일. `studio-p1.css` 삭제 |
| B8 | main.jsx:672,699,726,753 · studio-home.jsx:452 · about.jsx:413-423 | 프로세스/카드 설명 | `15px`, 일부는 lineHeight 없음. 같은 계층 설명문이 15(홈 프로세스), 15(소개), 15(스튜디오), 14(마케팅 카드, marketing-home.jsx:843), 13.5 등으로 나뉨 | med | `.t-small` 14px |
| B9 | marketing-home.jsx: 12.5px ×12 (951, 992, 1034, 1284…), 13.5px ×11 (1056, 1164, 1173…), 15.5px (2531), 17.5px (2861), 11.5px (2201), 10px (1966, 2040), 9.5px (2082, 2213, 2275), 10.5px | 마케팅 목업/카드 | 소수 크기와 9~11px가 광범위하다. 목업(SERP/AI 답변)은 일러스트라 허용 가능하지만 951~1526 구간 카드 본문은 실제 UI 텍스트 | med | 목록·카드의 12.5/13.5는 12 또는 14로 정규화. 목업(1960-2290)은 `aria-hidden` 확인 후 11px로 올림 |
| B10 | 폼: main.jsx:1008 `14px/600` vs studio-contact.jsx:225 `13.5px/400` vs marketing-contact.jsx(동일 13.5) vs review.css:1196 `14px` vs globals.css:615 `13px/550`; 입력 `17px`(main.jsx:1020, studio-contact.jsx:237) vs textarea `16px`(studio-contact.jsx:381) vs review.css:1203 `16px`; 제출 padding 18px(main.jsx:1117) vs 20px(studio-contact.jsx:419) | 문의 폼 | 라벨·입력·제출 버튼 크기가 폼마다 다르고 한 폼 안에서도 17과 16이 섞임 | med | 라벨 `.t-small`/600, 입력·textarea 16px, 제출 `.t-button--lg` |
| B11 | 버튼: main.jsx:254,266(16px/600) · about.jsx:809 (크기 없음→상속 16) · guide.css:132-137 `.guide-header-cta`(14.5px/600) · review.css:381 `.service-primary`(15px/650) · fixes.css:232 `.floating-contact`(14px/650) · work-portfolio.css:183,193 (13px/730) · guide.css:622,696 (700/600) · globals.css:131 `.button`(14px/600) | 버튼 | 크기 5종, weight 600/650/700/730, padding 18·16.5·10·20px. 높이가 제각각 | med | `.t-button` 3단(sm/md/lg), min-height 44/52/56, weight 600 |
| B12 | work-portfolio.css:158-159, 204, 212, 227-234 | 작업 카드 제목 | 제목 `clamp(24,2.5vw,36)` 500 + `strong` 740. 모바일은 `.guide-page h2 !important`(B1)와 충돌해 홈에서는 27~36px, /work에서는 28px로 서로 다름 | med | `.t-h3` + `strong`은 650으로 통일(span 부제는 `.t-caption`) |

### C. 자간 · 행간 · 굵기 극단값

| ID | file:line | 위치 | 문제 | 심각도 | 수정 |
|---|---|---|---|---|---|
| C1 | work-portfolio.css:35 `-.085em`(최대 124px), 204 `-.08em` | /work 목록 h1 | 한글 위 -0.085em은 글자가 겹친다(124px에서 -10.5px). 굵기 780 | high | `.t-h1` (-0.04em, 750) |
| C2 | work-portfolio.css:171 `-.07em`, 191 `-.06em`, 198 `-.06em`, 44/158/180/185 `-.05em`, globals.css:208 `-0.06em` | /work 상세·CTA·서비스 스트립 | -0.05em보다 좁은 값 다수 | high | h1 `.t-h1`, h2 `.t-h2`, 본문형 문구(work-index p, 44행)는 -0.01em |
| C3 | main.jsx:213 | 홈 히어로 h1 첫 줄 | `<span style={{letterSpacing:"-.008em"}}>`가 첫 줄만 자간을 풀어 둔다. h1은 -0.035em(`!important`)이라 한 제목 안에서 두 줄의 자간이 다르다 | high | 해당 스팬의 `style` 삭제 |
| C4 | guide.css:26 | `.guide-page` | `line-height: normal`. span/strong/div 설명문(예: main.jsx:381-387, studio-home.jsx:293·452, marketing-home.jsx:941-962)은 행간 ≈1.2~1.3로 접힌다. `p`만 1.75 | high | `.guide-page{line-height:1.7}` 추가, 단 버튼류가 커지므로 B11의 `.t-button`에서 line-height 1.2 지정해 함께 반영 |
| C5 | review.css:1133-1136 | `.guide-page h2` | `line-height:1.25 !important`가 스튜디오·마케팅 영문 제목의 설계값(lh 1, 36~72px)을 덮어 위아래 간격이 18px 늘어난다 | med | B1 처리로 소멸 |
| C6 | 인라인 lineHeight 분포 | 전역 | 1, 1.08, 1.1, 1.12, 1.14, 1.15, 1.25, 1.35, 1.4, 1.45, 1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, .6 (18종) | med | 1.2/1.25/1.35/1.6/1.7/1.75 6종으로 |
| C7 | 인라인 letterSpacing 분포 | 전역 | -.008, -.02, -.025, -.03, -.035, -.04, -.045, .04, .06, .08, .1, .12, .14, .16, .18em (15종) | med | 제목 -0.04/-0.035/-0.025, 본문 -0.01, eyebrow +0.14 |
| C8 | work-portfolio.css 전체 weight 560, 680, 730, 740, 760, 780 · review.css 650, 750 | 굵기 | 가변 폰트라 허용되지만 같은 역할(버튼·eyebrow·칩)에 730/760/680/650/600이 섞여 보인다 | low | 1.2의 허용 굵기 6종 |

### D. `!important` · 선택자 구조

| ID | file:line | 문제 | 심각도 | 수정 |
|---|---|---|---|---|
| D1 | guide.css 11 · review.css 40 · creative.css 9 · ux.css 5 · fixes.css 2 · globals.css 2 | `!important` 총 69개. 제목 `font-size`는 review.css:10-11, 189, 875, 1108, 1116-1118, 1128-1135, 1224-1228, creative.css:601, fixes.css:250 에서 서로 싸운다 | high | B1과 함께 제목 계열 제거(서비스 전용은 3장 참고) |
| D2 | guide.css:442-461, 462-464 · review.css:1146-1150 · fixes.css:279-283 | `[style*="white-space: nowrap"]`, `[style*="text-align-last"]`, `[style*="padding: clamp(100px"]`, `[style*="max-width: 1320px"]` 속성 선택자. SSR HTML의 `style`은 `white-space:nowrap`처럼 콜론 뒤 공백이 없어 매칭되지 않을 가능성이 높다(확인 필요: DevTools에서 `document.querySelector('[style*="max-width: 1320px"]')`). 매칭이 안 되면 모바일 nowrap 해제, 1440px 이상 폭 확대(fixes.css:279)가 모두 동작하지 않는다 | med | 인라인을 클래스로 바꾸며 선택자 삭제 |
| D3 | globals.css:178-560, 1204-1300, 1482-1530 등 | 사용처 없는 레거시 규칙(`.site-header` `.desktop-nav` `.division-nav` `.home-hero` `.division-hero` `.page-hero` `.principles` `.section-title` 등, className 검색 0건). 같은 이름(`.eyebrow`, `.brand`, `.button`, `.container`)이 guide 쪽과 겹쳐 우선순위 사고를 만든다 | low | 사용 중인 `.page-intro` `.prose` `.contact-*` `.container` `.button` `.eyebrow`만 남기고 삭제 |
| D4 | creative.css:25-31 vs review.css:869-887, 878-883 | `.method-line` / `.method-intro h2`가 두 파일에서 덮어쓰기(`display:flex`→`block`, `width:max-content`→`auto`). `.guide-main .method-intro h2{display:grid;gap:8px}`는 남는다 | low | 최종 상태만 한 곳에 |

### E. 컨테이너 · 정렬 (헤더 기준 좌측선)

뷰포트 1440 / 1920 에서 콘텐츠 좌측 시작 위치(px, 스크롤바 제외, CSS 값으로 계산):

| 영역 | max-width / 좌우 여백 | 1440 | 1920 | 근거 |
|---|---|---|---|---|
| 헤더 `.guide-header-inner` | 1440 / clamp(20,4vw,48) | 48 | 288 | guide.css:88-96 |
| 푸터 `.guide-footer-inner` | 1320 / 48 | 108 | 348 | guide.css:278-285 |
| 홈·소개 섹션 | 1320 / 48 | 108 | 348 | main.jsx:159, 280, 617…, about.jsx:146, 219… |
| 스튜디오·마케팅 섹션 | 1440 / 56 | 56 | 296 | studio-home.jsx:143, 225…, marketing-home.jsx:602, 1663… |
| `.review-container` (fixes.css:27-31 이후) | 1440 / 48 | 48 | 288 | review.css:743-747 |
| 목록 `.guide-list-wrap` | 1440 / 56 | 56 | 296 | fixes.css:27-31, guide.css:499-506 |
| 문의·약관 `.container` | 1440 / clamp(24,5vw,80) | 72 | 320 | globals.css:9, 99-103 |
| /work `.work-index` `.work-detail` | min(100%-80px, 1360) | 40 | 280 | work-portfolio.css:11 |

| ID | file:line | 문제 | 심각도 | 수정 |
|---|---|---|---|---|
| E1 | 위 표 | 같은 사이트에서 좌측선이 48/108/56/72/40(1440)과 288/348/296/320/280(1920)으로 갈린다. 로고와 본문, 푸터 로고와 본문이 어긋난다 | high | `.l-container` 단일 클래스. 인라인 `maxWidth:1320/1440 + padding:… clamp(20px,4vw,48|56px)` 약 25곳을 클래스로 교체. 푸터 `max-width` 1320→`var(--container)`. `.guide-header-inner` 패딩도 `var(--gutter)` |
| E2 | globals.css:9 `--space: clamp(24px,5vw,80px)` | 문의·약관 페이지만 5vw. 모바일 최소 24px가 헤더 20px보다 크다 | med | `.container{padding-inline:var(--gutter)}` |
| E3 | work-portfolio.css:11, 196, 201 | /work는 `calc(100%-80px)`(모바일 `calc(100%-36px)`)로 폭 계산 방식이 다르다 | med | `width:min(100% - 2*var(--gutter), 1328px)` |
| E4 | 섹션 세로 여백 | 140(홈 대부분), 136(globals `--section`), 120(마케팅 일부, work 120px 고정), 112/104/100/96/88(CTA·문의·review-container). 한 페이지 안에서도 140→112→88로 리듬이 바뀐다 | med | `--section-y` / `--section-y-sm` 두 값 |
| E5 | ux.css:2 `--site-header-height:74px` · guide.css:395-398, review.css:1218-1222 | 헤더 높이를 74px로 하드코딩했지만 실제는 패딩 16×2 + 가장 큰 자식으로 결정된다. ≤720px는 `min-height:70px`에 패딩 9px → 70 안팎. 서브내비 sticky `top`이 4px 비는/겹치는 틈이 생길 수 있다(확인 필요: `header.offsetHeight`) | low | `.guide-header-inner{min-height:var(--site-header-height)}`로 값 고정. 서브내비 영역 변경은 동시 작업자와 조율 |
| E6 | guide.css:39-41 | `.guide-page a:hover{color:#a99bff}` 라벤더가 밝은 배경(홈/소개/마케팅 #fff, #f4f3ef)의 링크에도 적용돼 대비가 약해진다 | low | 어두운 페이지에서만 적용(`.guide-studio-home …`) |

### F. 반응형 흔들림

| ID | file:line | 문제 | 심각도 | 수정 |
|---|---|---|---|---|
| F1 | review.css:1227-1229 | ≤700px에서 모든 h2를 `clamp(27px,7vw,36px)!important`로 고정. 카드 제목으로 쓴 h2(work-portfolio.css:158, home-references)까지 같이 커져 부모 맥락이 깨진다 | med | `.t-h2` clamp 하나로 해결, h2 태그를 카드 제목에 쓴 곳은 `.t-h3` |
| F2 | 브레이크포인트 | 620 / 700 / 720 / 767 / 900 / 1000이 혼재(review.css, guide.css, work-portfolio.css, creative.css). 같은 컴포넌트에서 620에 바뀌고 700에 또 바뀐다 | med | 640 / 960 두 개로 정리, 글자 크기는 clamp로 흡수 |
| F3 | about.jsx:685, 714 · marketing-home.jsx:964-1518 · main.jsx:495, 597 | `nowrap` 인라인 14곳. 카드 폭 204px 안쪽(about 4열) 같은 좁은 곳에서 내용이 길어지면 넘친다. 모바일 해제는 D2 때문에 동작 확인 필요 | low | `overflow-wrap:anywhere` 허용 또는 `.chip`/`.badge` 클래스 |

## 3. 서비스 상세 (짧게, 추후 전면 재설계 예정)

- `.review-eyebrow`(13px/700)이 한글 라벨 전용이고 홈의 영문 eyebrow와 모양이 다르다(review.css:748).
- 서비스 h1이 `.guide-page.service-detail .service-hero h1` `clamp(32,3.6vw,52)!important`(review.css:349), `.overview-hero h1` `clamp(34,3.8vw,54)!important`(review.css:10), `.lab-specialist` `clamp(40,5.2vw,76)!important`(fixes.css:250), content-service `clamp(29,3.05vw,44)!important`(content-service.css:79)로 4종. 홈 h1(최대 78px)과 연속성이 없다.
- `.service-fit h2`는 데스크톱 18px(review.css:443)인데 모바일은 B1의 h2 !important로 27~36px가 된다.
- 소형 텍스트 8~11px: creative.css:473 `8px`, 411/616 `9px·10px`, fixes.css:125 `10px`, content-service.css:185, 361 `11px`.
- 서비스 상세 `h2` 크기 `clamp(26,2.5vw,36)`(review.css:434), content-service `clamp(26,3vw,40)`로 서로 다름.
- 재설계 시 1.2의 `.t-*` 클래스만 사용하도록 요구하고, 인라인 스타일 금지를 COMMON.md 규칙(이미 "신규 UI는 인라인 style 대신 클래스 CSS")대로 적용.

범위 밖 참고: lab-home.jsx·lab-services.jsx에 JetBrains Mono 인라인 63곳, 그중 한글이 따라오는 8곳(lab-home.jsx:262, 962, lab-services.jsx:2200, 2375, 2914, 3031, 3103, 4116)이 같은 한글 폴백 문제를 가진다. marketing-services.jsx에도 Unbounded 23곳. 같은 치환(P0)을 적용하면 된다.

## 4. 우선순위 수정 목록 (구현자 한 번에 적용)

제외 영역(guide.css:181-271, review.css:1151-1190, ux.css:20-43, GuideNav, content-service 앵커 줄)은 건드리지 않는다.

### P0 서체 (기계적 치환, 레이아웃 변화 없음)
1. `app/layout.tsx:56` → `pretendard.variable`을 `<html>`에 부착.
2. `app/globals.css`에 1.1의 `:root` 토큰 추가(`--ff-*`, `--gutter`, `--container`, `--section-y*`).
3. 인라인 `"Unbounded,sans-serif"` 67곳과 CSS 9곳(guide.css:98, 521, 582, 761; work-portfolio.css:32, 80, 131, 171, 179)을 `var(--ff-display)`로 치환. guide.css:203(`.guide-subbrand`)은 제외 영역이므로 건드리지 않는다. 같은 방식으로 `'Pretendard Variable',sans-serif`(marketing-home.jsx:1132, 1144)는 `var(--ff-text)`.
4. 한글이 붙은 표시 11곳을 `--ff-text` + 자간 0으로 분리: A1(`.guide-kicker`), A2, A3(3곳), A4(2곳), A5(2곳), A7. 한자 비교 `p.date === "制作"` 삭제.
5. `.brand`/`.guide-brand` 충돌(A11) 정리.

### P1 제목 시스템 (B1+B2+B3+B4+C3+C5, 같은 커밋)
6. 새 파일 `components/guide/type.css`를 `app/(public)/layout.tsx`의 마지막 import로 추가. `.t-h1 .t-h2 .t-h2--latin .t-h3 .t-h3--feature .t-lead .t-body .t-small .t-caption .eyebrow .eyebrow-ko .t-nav .t-button(--sm/--lg) .t-chip` 정의(1.2 표 그대로).
7. B2 목록의 h1 5개와 h2 22개에서 인라인 `fontSize/letterSpacing/lineHeight/fontWeight` 삭제 후 클래스 부여. main.jsx:213 스팬 `style` 삭제(C3).
8. 그 후에 review.css:1115-1136, 1223-1229 삭제. 홈 전용 `!important`(review.css:875, 1107-1110) 삭제. 서비스 전용(10-11, 189, 349-350, 733)은 3장 이유로 유지.
9. `.work-home .reference-heading h2`(work-portfolio.css:227), `.reference-heading h2`(review.css:766), `.showcase-video-heading h2`(ux.css:187-192)의 크기·자간·행간 삭제하고 `.t-h2`를 적용. 해당 TSX(home-references.tsx:46, showcase-video.tsx)에 클래스 부여.

### P2 본문 계열
10. `.guide-page{line-height:1.7}` 추가(guide.css:26 수정). 같은 시점에 인라인 버튼 `GuideLink`/`button` 스타일을 `.t-button`으로 교체해 line-height 1.2, min-height를 지정(B11).
11. 크기 정규화(역할 기준): 11/11.5/12/12.5 → caption 12, 13/13.5/14 → small 14, 카드·목록의 15 → small 14, 문단의 15/16/17 → body 16 또는 lead, 15.5/17.5 → 16/18. 대상은 B7~B10과 marketing-home B9 목록.
12. 폼(B10) 라벨/입력/제출 3값 통일.

### P3 컨테이너
13. `.l-container`/`.l-section`(padding-block `--section-y`)을 type.css에 정의하고 E1 표의 인라인 래퍼 약 25곳을 교체.
14. `.guide-footer-inner`(guide.css:279), `.guide-header-inner`(guide.css:91), `.container`(globals.css:99-103, `--space`→`--gutter`), `.work-index/.work-detail/.work-service-strip-inner`(work-portfolio.css:11, 196, 201) 값 변경. 헤더 쪽 변경은 서브내비 작업자와 `--gutter` 값(56)을 맞춘다.

### P4 정리·성능
15. D2 속성 선택자와 D3 레거시 규칙 삭제, D4 최종 상태 정리.
16. A10: Unbounded를 라틴 서브셋 woff2 + `next/font/local`로 이동.

### 검증(서버 없이, 구현 직후)
- `grep -rn "Unbounded,sans-serif" components app` → 서비스·lab 범위 밖 잔여만 남아야 한다.
- `grep -rn "Pretendard Variable" components` → 0.
- `grep -nE "letter-spacing: *-?\.0?[6-9]|letterSpacing: \"-\.0[6-9]" components app` → 0.
- `grep -nE "fontSize: \"[0-9]+\.5px\"" components/guide/*.jsx` → 목업 구간 외 0.
- `grep -c "!important" components/guide/review.css` → 40에서 서비스 전용 분만 남을 것.
- 이후 브라우저 확인(타 작업자 몫): 1440/768/390에서 `getComputedStyle(h2).fontSize`가 홈 6곳 모두 동일, 헤더·푸터·본문 좌측 x 일치, `document.fonts.check('16px Unbounded')`와 한글 문자열의 실제 사용 폰트(DevTools Rendered Fonts)가 Pretendard.

## 부록. 측정 근거

- 인라인 fontSize 사용 빈도(홈/소개/스튜디오/마케팅/팀 JSX): 15px 40 · 13px 30 · 17px 26 · 13.5px 23 · 12px 21 · 16px 14 · 14px 13 · 11px 13 · 12.5px 13 · 20px 10, clamp 형태 30여 종. 소수점 크기 합계 약 55곳.
- 인라인 fontWeight: 600 ×48, 800 ×27, 700 ×15, 300 ×8, 500 ×2.
- 폰트 cmap: Unbounded 1,138자 한글 없음(가변 wght 200~900, 화살표 U+2192·마이너스 U+2212·따옴표 U+201C 포함), JetBrains Mono 976자 한글 없음.
- Pretendard는 `next/font/local`로 `weight:"45 920"`, 변수 `--font-body`(body에만 정의).
