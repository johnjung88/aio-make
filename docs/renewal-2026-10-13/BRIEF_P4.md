# BRIEF P4 — 메인 레퍼런스 섹션을 스크롤 워크플로우로 교체

> **개정 2026-10-14: 사용자 결정 반영.** (1) 흐름은 **5단계**(상담 → 자료 취합·브랜드 가이드 → 개발 → 컨텐츠 → 마케팅)다. 이전 초안의 06 `성과 개선`은 05 마케팅 안(플랜 기획·운영·데이터 기반 개선)으로 합쳤고 마무리 CTA는 유지한다. (2) 메인의 기존 `#process` 섹션(`AI로 효율을 높이고 / 전문가가 품질을 지킵니다` 4단계)은 워크플로우와 중복이므로 **삭제**하고, `#process`를 가리키는 링크를 정리한다. (3) 글자는 W2가 도입한 **역할 토큰**(`AUDIT_TYPOGRAPHY.md` 1.1·1.2의 이름)만 쓴다. 값을 직접 적지 않고, review.css의 `.guide-page` 제목 `!important`에 기대는 문장을 모두 없앴다. (4) `about.jsx`의 옛 서비스 문구를 6종 문구로 고친다. (5) AI 인플루언서 탭 미디어 라벨은 `FACTS_AI_INFLUENCER.md`대로 `87언니(AI 가상인물) 출연 · 제안용 시안`이다. 이 문서는 동시 작업 때문에 줄 번호 대신 문자열·선택자로 대상을 가리킨다.

먼저 `COMMON.md`, `HANDOFF_RESUME.md`, `AUDIT_TYPOGRAPHY.md`, `FACTS_AI_INFLUENCER.md`, `RESULT_W1.md`, `RESULT_W2.md`(있으면)를 읽는다. 결과는 `RESULT_P4.md`에 쓴다.

**선행 조건**: W1(앵커 줄 제거, `/work` 목록·`/content/work` 삭제, 서브 내비 타이포 통일)과 W2(전역 타이포: `app/globals.css` 역할 토큰, `.t-*` 역할 클래스, review.css `.guide-page` 제목 `!important` 제거)가 **둘 다 커밋된** 코드 위에서 작업한다. 시작 전에 `git log --oneline -5`와 `git status`를 확인한다. W1·W2의 미커밋 변경이 남아 있거나 `app/globals.css`에 W2 토큰(`--ff-text` 등)이 없으면 손대지 말고 RESULT에 적은 뒤 멈춘다.

## 배경
- 메인(`/`)의 `#work` 섹션은 지금 `components/guide/home-references.tsx`의 카드 격자다. 제목은 "브랜드의 이야기를 이렇게 만들었습니다"이다. 사용자 판정은 "카드 나열이라 이상하다"이다.
- 사용자 요구: 카드 나열을 없애고, 한 장의 상세페이지처럼 AIO의 작업 흐름을 스크롤로 따라가게 한다. 각 단계 안에 실제 레퍼런스를 붙인다. 흐름은 **상담(개발·마케팅·컨텐츠) → 고객 자료 취합·브랜드 가이드 정립 → 개발 → 컨텐츠 → 마케팅(플랜 기획·운영·데이터 기반 성과 개선)** 5단계다. 데이터 기반 개선은 별도 단계가 아니라 마케팅 단계 안에 있다.
- 메인의 `#process` 섹션(`<section id="process" className="main-method">`, h2 `AI로 효율을 높이고 / 전문가가 품질을 지킵니다`, 기획·AI 활용 제작·전문가 검수·납품·관리 4단계)은 새 워크플로우와 내용이 겹친다. 사용자 결정으로 삭제한다.
- 메인 서비스 문구는 정확히 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상`이어야 한다.
- 사용자는 글자 크기, 정렬, 간격이 들쭉날쭉한 것을 가장 크게 지적했다. 이전 단계(P2)의 카피·폰트·배치도 "이상하다"는 판정을 받았다. 이번 단계는 **같은 역할의 글자는 화면 어디서나 같은 계산값**을 갖는 것이 핵심 품질 기준이다. 그 기준은 W2가 사이트 전체에 깐 역할 토큰이다. 이 섹션만의 글자 값을 새로 만들지 않는다.
- 벤치마크 시안: `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\`(`index.html`, `style.css`, `app.js`. 읽기만 하고 실행·복사하지 않는다). 가져올 것과 버릴 것은 아래 "벤치마크 반영"에 정리했다.

## 범위
변경 허용(이 목록 밖은 수정 금지):
1. 신규 `lib/home-journey.ts`: 단계·카피·탭 구성·작품 slug 선택·대체 이미지·기존 화면 캡처 맵. JSX 없이 순수 데이터와 선택 함수만 둔다. import는 `lib/work-catalog.ts`처럼 `.ts` 확장자를 붙인다(node 테스트에서 직접 import한다).
2. 신규 `components/home/workflow-journey.tsx`(`"use client"`)와 `components/home/workflow-journey.css`. 필요하면 같은 폴더에 `journey-dev-compare.tsx`, `journey-content-stage.tsx`처럼 하위 컴포넌트를 나눈다. CSS는 이 폴더의 CSS 파일 하나에만 둔다.
3. 신규 `tests/home-journey.test.mjs`.
4. `components/guide/main.jsx`의 다음 다섯 곳만 수정한다. W2가 이 파일을 먼저 고쳤으므로 줄 번호가 아니라 문자열로 찾는다.
   - `import { HomeReferences } ...` 줄 → `import { WorkflowJourney } from "@/components/home/workflow-journey";`
   - `<HomeReferences entries={this.props.entries} />` → `<WorkflowJourney entries={this.props.entries} />`
   - FAQ 답변 문자열의 `브랜드 홍보 및 SNS 광고 영상` → `브랜드 홍보 영상, SNS 광고 영상`
   - `#divisions` 카드 3개의 서비스 목록(문자열 `브랜드 홍보 및 SNS 광고 영상`, `통합 마케팅 · SNS 대행 운영`류, `업무 자동화 · 프로그램 · 웹사이트 · 쇼핑몰`이 있는 요소): 컨텐츠 카드 문구를 필수 문구로 바꾼다. 세 카드 목록을 같은 클래스 하나로 통일한다. 남은 인라인 style(`whiteSpace: nowrap` 등)은 지운다. 규칙은 아래 "#divisions 서비스 목록"을 따른다.
   - **`#process` 섹션 삭제**: `<section id="process" className="main-method" …>`부터 그 `</section>`까지 통째로 지운다(h2 `AI로 효율을 높이고 / 전문가가 품질을 지킵니다`, `.method-intro`, 4단계 `<ol>` 포함). 바로 다음의 OUR STANDARD 섹션(`OUR STANDARD`, `만드는 일의 끝은,` 인용)과 그 뒤 FAQ·`#contact`는 그대로 둔다. 삭제 후 이 파일에서만 쓰이던 import·변수가 남으면 함께 지운다.
5. **`#process` 링크 정리**: 저장소 전체(`components/`, `app/`, `lib/`, `scripts/`, `tests/`, `content/`)에서 `#process`·`/#process`·`"process"` 해시 링크를 grep한다. **메인 `/`의 `#process`를 가리키는 것만** `#work`(새 워크플로우)로 바꾸거나, 의미가 없으면 링크 항목을 지운다. 다른 페이지가 자기 페이지 안의 `#process`를 쓰는 것(`lab-services.jsx`의 `<section id="process">`와 그 링크, `components/content-service/content-service.tsx`의 `id="process"`, P3의 `/content` `#process`)은 메인과 무관하므로 건드리지 않는다. 2026-10-14 사전 조사에서는 메인 `#process`를 가리키는 링크가 0건이었다. 실행 시 다시 확인하고 결과(0건 포함)를 RESULT에 적는다.
6. `components/guide/about.jsx`의 문자열 하나만: `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 및 SNS 광고 영상` → `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상`. 이 파일의 다른 부분(스타일·구조)은 바꾸지 않는다. 이미 바뀌어 있으면 손대지 않고 RESULT에 "이미 반영"으로 적는다.
7. 로컬 검토 자산 4개를 새로 만든다: `public/reference-review/bwl-store/before-pc.webp`, `before-mobile.webp`, `public/reference-review/healernet-website/before-pc.webp`, `before-mobile.webp` (gitignore 대상. 만드는 방법은 03 개발 단계에 있다).

변경 금지: `home-references.tsx`(서비스 개요·`/content` 홈에서 계속 쓴다. 파일은 그대로 둔다), `components/content-service/*`, `lib/content-service-plans.ts`, 서비스 상세 페이지, `/content` 홈(`studio-home.jsx`), `/work/[slug]`, 가격 관련 파일·문구, `content/works/*.json`, `lib/generated/*`, `lib/work-catalog.ts`, `lib/work-schema.ts`, 검토 게이트(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW`, noindex, 사이트맵 제외), 히어로·ShowcaseVideo·OUR STANDARD·FAQ 구조·`#contact`, **W2 소유 전역 스타일**(`app/globals.css`, `components/guide/type.css`, `guide.css`, `review.css`, `creative.css`, `ux.css`, `fixes.css`). `#process` 삭제로 쓰이지 않게 되는 `.main-method`·`.method-intro`·`.method-line` 규칙(review.css·creative.css)은 지우지 않고 RESULT 후속 정리 후보에 적는다. `scripts/restore-guide.py`는 실행하지 않는다. 새 패키지는 설치하지 않는다(GSAP 포함 금지).

가격은 메인 범위가 아니다. 이 섹션에 금액·"부터"·할인 문구를 넣지 않는다. 견적 언급은 "맞춤 견적"만 쓴다.

## 구조

```
<section id="work" class="wj" aria-labelledby="wj-title">     ← 히어로 "제작 예시 살펴보기"(#work)가 그대로 여기로 온다
  <header class="wj-intro">  eyebrow · h2#wj-title · p
  <div class="wj-layout">
    <nav class="wj-rail" aria-label="작업 단계">  01~05 링크 (데스크톱 sticky)
    <ol class="wj-steps">
      <li><article id="journey-consult" class="wj-step" aria-labelledby="journey-consult-title"> … 01
      … journey-brand(02) · journey-dev(03) · journey-content(04) · journey-marketing(05)
    </ol>
  </div>
  <div class="wj-closing">  한 줄 + "견적 문의" 버튼(#contact)
</section>
                                                                 ← 바로 다음은 OUR STANDARD 섹션(기존 #process는 삭제됨)
```

- 메인 섹션 순서는 기존 그대로이고 두 가지만 바뀐다: `#work`(`.wj`)가 `#divisions` 바로 다음에 오고, 그 바로 다음이 OUR STANDARD다(`#process` 삭제). FAQ·`#contact`는 그 뒤 그대로다.
- heading: 섹션 h2 1개(`#wj-title`) + 단계마다 h2 1개(총 5개). 단계 안의 프로젝트명·서비스명은 h3. h1과 h4 이하는 만들지 않는다.
- 단계 하나의 내부 순서는 고정한다: `eyebrow`(예: `03 DEVELOPMENT`) → h2 → lead(1~2문장) → 단계 본문(시각 자료와 레퍼런스) → 관련 서비스 링크 줄.
- 모든 텍스트는 왼쪽 정렬이다. 단계 5개의 eyebrow·h2·lead 왼쪽 끝은 같은 x좌표다. 가운데 정렬 문단은 만들지 않는다.

## 스크롤 동작 (새 의존성 없이 CSS sticky + IntersectionObserver)
- **스크롤 가로채기 금지**: wheel/touch 이벤트 가로채기, `scroll-snap`, 스크롤 길이를 늘리는 pin, 스크롤 속도 변경, 프레임마다 스타일을 쓰는 scroll 리스너를 모두 금지한다. 사용자가 스크롤한 만큼만 움직인다.
- **데스크톱(≥1024px)**: 2열 grid(`--wj-rail-w` | 본문). 레일은 `position: sticky; top: calc(var(--site-header-height) + 32px)`이다. 레일 항목은 `<a href="#journey-…">` 5개(번호 + 한글 라벨)다. 현재 단계에는 `aria-current="step"`, 보라 번호, 진한 라벨, 왼쪽 2px 보라 막대가 붙는다. 레일 옆 세로선 채움은 `.wj[data-active="0..4"]` 속성별 CSS 규칙으로 `transform: scaleY()`만 바꾼다. 인라인 style은 쓰지 않는다.
- **현재 단계 판정**: IntersectionObserver 1개가 5개 article을 관찰한다(`rootMargin: "-45% 0px -50% 0px"`). 콜백에서 각 article의 `getBoundingClientRect().top`을 읽고 `top <= innerHeight * 0.45`인 마지막 단계를 현재 단계로 정한다. 기본값은 0이다. 언마운트 때 disconnect한다.
- **sticky가 깨지지 않게**: `.wj`부터 `main.jsx` 바깥 래퍼까지 `overflow: hidden/auto`를 두지 않는다. 가로 넘침은 레이아웃으로 막는다. 꼭 필요하면 `.wj`에만 `overflow-x: clip`을 쓴다.
- **진입 효과**: JS 없이도, 또는 효과가 시작되기 전에도 모든 텍스트와 미디어가 보여야 한다(SSR 기본 상태가 최종 상태다). 효과는 미디어 프레임에만 준다. 마운트 후 화면 아래에 있는 `.wj-media`에 `data-reveal="pending"`을 붙이고(`transform: translateY(24px)`, opacity는 건드리지 않는다), 화면에 들어오면 `done`(600ms ease-out, 한 번만)으로 바꾼다. 텍스트를 opacity 0으로 숨기지 않는다.
- **모바일·태블릿(<1024px)**: 1열 세로 타임라인. 레일은 숨기고 본문 왼쪽에 2px 세로선과 단계별 12px 점을 둔다(점은 eyebrow 첫 줄 중앙에 맞춘다). 현재 단계 점은 같은 IntersectionObserver 결과로 보라색이 된다. sticky 요소는 두지 않는다.
- **`prefers-reduced-motion: reduce`**: 진입 효과·레일 전환·3D 옆 미리보기 기울기·탭 전환 애니메이션을 끈다(`transition: none`, transform 없음). 영상은 어떤 경우에도 자동재생하지 않는다.

## 디자인 토큰 (`.wj` 범위에 선언, 기존 `--ink --paper --violet --lavender` 재사용)

색:
| 토큰 | 값 | 용도 |
|---|---|---|
| `--wj-bg` | `#ffffff` | 섹션 배경. 위 `#divisions`(paper)와 구분된다. 아래 OUR STANDARD도 흰 바탕이므로 `.wj` 아래쪽에 1px `--wj-line` 경계를 둔다(OUR STANDARD 섹션 코드는 건드리지 않는다) |
| `--wj-tint` | `#f0edfa` | 일러스트 패널(01·02·05), 탭 비활성 배경 |
| `--wj-ink` | `var(--ink)` | 제목·본문 |
| `--wj-text-2` | `#3a3a42` | lead·본문 보조 |
| `--wj-text-3` | `#5f5f69` | 캡션·메타. 흰 바탕·tint 모두 대비 4.5:1 이상 |
| `--wj-line` | `#dad8d1` | 구분선·프레임 테두리 |
| `--wj-accent` | `var(--violet)` | 현재 단계·활성 탭·주 버튼 |
| `--wj-stage` | `var(--ink)` | 영상 무대 배경 |

간격·크기(폭·여백은 W2 전역 토큰을 그대로 쓴다. `.wj` 전용 폭·좌우 여백·섹션 세로 여백 값을 새로 만들지 않는다):
| 토큰 | 값 |
|---|---|
| 콘텐츠 폭·좌우 여백 | W2의 `.l-container`(또는 `max-width: var(--container); padding-inline: var(--gutter)`). `#divisions` 내용 래퍼와 같은 방식이어야 좌측선이 맞는다 |
| 섹션 위아래 여백 | `var(--section-y)` (W2 토큰) |
| `--wj-step-gap` | `clamp(96px, 11vw, 160px)` 단계 사이 |
| `--wj-rail-w` / `--wj-col-gap` | `240px` / `clamp(40px, 5vw, 88px)` |
| `--wj-s1..s7` | `8 · 12 · 16 · 24 · 32 · 48 · 64px` |
| 단계 내부 간격 | eyebrow→h2 `s3` · h2→lead `s4` · lead→본문 `s6` · 본문 블록 사이 `s5` · 본문→서비스 링크 줄 `s5` · 칩 사이 `s1` |
| 모서리 | 프레임·패널·칩·탭 모두 `var(--radius)`(4px). 예외는 폰 프레임 20px 하나 |

글자: **W2 역할 토큰만 쓴다.** 이 섹션의 글자 크기·굵기·행간·자간·서체 값은 `AUDIT_TYPOGRAPHY.md` 1.2 역할표가 정본이고, W2가 그 역할을 `app/globals.css`(토큰 `--ff-text`·`--ff-display`·`--ff-mono`, 레이아웃 토큰 `--gutter`·`--container`·`--section-y`·`--section-y-sm`)와 역할 클래스(`.t-h1` `.t-h2` `.t-h2--latin` `.t-h3` `.t-h3--feature` `.t-lead` `.t-body` `.t-small` `.t-caption` `.eyebrow` `.eyebrow-ko` `.t-nav` `.t-button`(`--sm`/`--lg`) `.t-chip`)로 구현했다.
- 시작 전에 `RESULT_W2.md`, `app/globals.css`, `components/guide/type.css`(W2가 다른 파일에 뒀으면 그 파일)에서 실제 이름을 확인한다. 이름이 AUDIT와 다르면 W2 실제 이름을 쓰고 RESULT에 대응표를 적는다.
- 적용 방법: W2가 역할 클래스를 제공하면 JSX에서 기능 클래스와 역할 클래스를 함께 붙인다(예: `className="wj-step-title t-h3--feature"`). W2가 역할별 CSS 변수(크기·행간 등)를 제공하면 `workflow-journey.css`에서 `var(--…)`로만 참조한다. 어느 쪽이든 **`workflow-journey.css`에는 font-size·line-height·letter-spacing·font-weight·font-family의 숫자·글꼴 이름 리터럴을 쓰지 않는다**(값은 `var(--…)`만 허용). `!important`도 쓰지 않는다.
- 이전 초안처럼 review.css의 `.guide-page h1/h2 !important` 값에 맞추거나 기대는 설계는 하지 않는다. W2가 그 규칙을 지웠다. 혹시 남아 있으면 덮어쓰지 말고 RESULT에 적고 멈춘다.
- `@media` 안에서 글자 속성을 다시 선언하지 않는다. 반응은 역할 토큰의 clamp가 맡는다.

| 역할(이 섹션) | 클래스 | W2 역할(AUDIT 1.2) | 비고 |
|---|---|---|---|
| 섹션 제목 h2 | `.wj-title` | `.t-h2` | `#divisions` h2와 같은 역할이므로 계산값이 같다 |
| 단계 제목 h2 | `.wj-step-title` | `.t-h3--feature`(글꼴은 `--ff-text`) | 요소는 h2(문서 구조), 모양은 섹션 제목 아래 단계라 한 단계 낮춘다 |
| eyebrow(라틴, `03 DEVELOPMENT`) | `.wj-eyebrow` | `.eyebrow` | `--ff-display`, 대문자 |
| lead | `.wj-lead` | `.t-lead` | max-width 34em은 배치 속성이라 이 CSS에 둔다 |
| 항목 제목 h3 | `.wj-item-title` | `.t-h3` | |
| 본문 | `.wj-body` | `.t-body` | |
| 캡션(한글 문장: 프레임 설명·작품 캡션) | `.wj-caption` | `.t-small` | |
| 상태 태그(`연출 예시`, productionStatus) | `.wj-tag` | `.t-caption` | |
| 탭·칩 | `.wj-tab`, `.wj-chip` | `.t-chip` | |
| 레일 번호·단계 번호 | `.wj-num` | `.eyebrow` | 라틴 숫자만 |
| 레일 라벨 | `.wj-rail-label` | `.t-nav` | |
| 링크 줄(`서비스 자세히 보기 →` 등) | `.wj-link` | `.t-button` | |
| 버튼 | `.wj-button` | `.t-button--lg` | 히어로 `견적 문의` 버튼과 같은 역할 |

글꼴 규칙:
- 한글이 한 글자라도 들어가는 요소는 `--ff-text` 역할(Pretendard)이다. `.wj-*` CSS에서 font-family를 선언하지 않는다(역할 클래스·토큰이 정한다).
- Unbounded(`--ff-display`)에는 한글 글리프가 없다. `.eyebrow` 역할(`.wj-eyebrow`·`.wj-num`, 라틴 대문자·숫자)에만 쓰인다. `--ff-display`는 `var(--ff-text)` 폴백을 갖고 있어 실수로 들어간 한글도 Pretendard로 떨어진다.
- 최소 글자 크기는 AUDIT 규칙대로 12px이다(`.t-caption`). 벤치마크의 8~11px 글자는 가져오지 않는다. 반 픽셀 크기와 한글 양수 자간을 쓰지 않는다.
- 줄바꿈: `word-break: keep-all`. 제목은 데이터의 `\n` 위치에서만 끊는다(`white-space: pre-line`, `text-wrap: balance`). **제목 한 줄은 공백 포함 11자 이하**로 써서 360px에서도 의도하지 않은 줄바꿈이 생기지 않게 한다.

## 단계별 명세
카피는 방향과 초안이다. 다듬어도 되지만 제목 줄 수·글자 수 제한과 카피 규칙을 지킨다. 영문 eyebrow는 아래 값을 그대로 쓴다.

### 인트로
- eyebrow `HOW WE WORK` / h2 `상담부터 성과까지\n한 흐름으로 이어집니다` / p `필요한 단계만 맡기셔도 됩니다. 단계마다 하는 일과 결과물을 살펴보세요.`
- 검토 플래그를 끈 빌드에서도 거짓이 되지 않는 문장만 쓴다("실제 작업을 보세요" 류 금지).

### 01 상담 — `journey-consult`, eyebrow `01 CONSULT`, 레일 라벨 `상담`
- 목적: 개발·컨텐츠·마케팅 중 무엇을 먼저 할지 한 번의 상담에서 정한다는 점을 보여준다.
- h2 `필요한 일부터\n함께 정합니다` / lead `개발·컨텐츠·마케팅 중 무엇이 먼저인지 상담에서 정리합니다. 목표와 일정, 가진 자료를 알려주시면 범위와 맞춤 견적을 안내합니다.`
- 본문(tint 패널, HTML/CSS로 구성. 이미지 없음): 분야 칩 3개 `개발` `컨텐츠` `마케팅` + "상담에서 정하는 것" 4행 목록 `목표` `작업 범위` `일정` `맞춤 견적`. 각 행에 짧은 설명 한 줄. 고객명·날짜·금액 같은 가짜 기록은 넣지 않는다.
- 링크 줄: `상담 신청하기 →` (`#contact`).
- 레퍼런스 없음.

### 02 자료 취합·브랜드 가이드 — `journey-brand`, eyebrow `02 BRAND GUIDE`, 라벨 `브랜드 가이드`
- 목적: 흩어진 고객 자료를 모아 가이드로 만들고, 이후 모든 작업이 이 기준을 따른다는 점.
- h2 `브랜드 가이드로\n기준을 세웁니다` / lead `로고와 제품 사진, 기존 홈페이지와 SNS 자료를 모아 정리합니다. 컬러와 서체, 말투를 정해두면 개발·컨텐츠·마케팅이 같은 기준으로 움직입니다.`
- 본문: "가이드 구성" 보드(tint 패널, HTML/CSS 타일 5개: `로고 사용` `컬러` `서체` `톤과 말투` `사진 방향`). 컬러 타일은 중립 견본(ink·paper·violet·lavender)을 쓰고 고객 색을 쓰지 않는다. 보드 오른쪽 위에 `.wj-tag` `구성 예시`.
- 레퍼런스: 이번 단계에서는 붙이지 않는다. 고객 폴더에 실제 가이드가 있다(`01_영업관리/03_잠재고객/261010_BWL/01_브랜드 자료/01_브랜드가이드/DRsSecret_BrandGuide_v1.1.*`, `261010_힐러넷/01_브랜드 자료/01_힐러넷/01_브랜드가이드`). 공개 권리가 정해지지 않았으므로 RESULT의 "후속 후보"에만 적는다.

### 03 개발 — `journey-dev`, eyebrow `03 DEVELOPMENT`, 라벨 `개발`
- 목적: 가이드를 기준으로 웹사이트·쇼핑몰을 만들고, 기존 화면과 새 화면을 나란히 보여준다. 브랜딩한 고객 자료를 화면에 녹여 고객이 문의·구매로 이어지게 설계한다는 점.
- h2 `웹사이트와 쇼핑몰을\n가이드대로 만듭니다` / lead `정리한 브랜드 자료를 화면에 녹입니다. 방문한 고객이 제품을 살펴보고 문의나 구매로 이어지도록 동선을 설계합니다.`
- **검토 빌드(작품 있음)**: 프로젝트 탭(role=tablist) 3개를 이 순서로 둔다. `displayWorkCatalog(entries)`에 slug가 있는 것만 보인다.
  | slug | 탭 라벨 | 기존 화면 |
  |---|---|---|
  | `bwl-store` (기본 선택) | `DR's Secret 쇼핑몰` | 있음: 기존 공식몰 캡처 |
  | `healernet-website` | `힐러넷 웹사이트` | 있음: 기존 홈페이지 캡처 |
  | `yofree-shop` | `요프리 쇼핑몰` | **없음 → HOLD 자리** |
  - 패널 구성: h3(작품 `title`) + `.wj-tag`(작품 `productionStatus`를 그대로 표시. 후보를 완료처럼 보이게 하지 않는다) → 비교 블록 → 작품 `purpose` 한 문장(`.wj-body`) → 링크 `작업 자세히 보기 ↗`(`work.canonicalPath`) + 서비스 링크(`/lab/services/shopping-mall` 또는 `/lab/services/website`).
  - 작품 `scope` 문장은 쓰지 않는다(원문 JSON에 문장 사이 마침표가 빠져 있다. JSON은 이번 범위에서 수정 금지).
  - **비교 블록**: 브라우저 프레임 2개. 왼쪽 `기존 화면`, 오른쪽 `AIO 제작 화면`. 1024px 이상은 나란히, 미만은 위아래로 둔다. 각 프레임은 16:10 비율, `object-fit: cover; object-position: top`이다. 모바일 캡처가 있으면 프레임 안쪽 오른쪽 아래에 폰 프레임(프레임 폭의 24%, 1024 미만은 30%)을 겹친다. 프레임 바깥으로 튀어나오지 않게 한다. AIO 쪽 PC는 `media[0].src`, 폰은 `media[0].mobileSrc`(없으면 폰 생략. yofree-shop은 PC만)다. 각 프레임 아래 `.wj-caption`: 기존 `기존 공식몰 첫 화면 · 2026-10-10 캡처`(bwl) / `기존 홈페이지 첫 화면 · 2026-10-10 캡처`(힐러넷), AIO `AIO 제작 화면`.
  - 프레임을 누르면 원본 크기 이미지를 보여주는 `<dialog>` 하나를 공유해 연다(벤치마크 Demo Duck 상세 창). `showModal`, 닫기 버튼, Esc, 배경 클릭 닫기, 닫으면 누른 프레임으로 포커스를 돌린다. 구현 패턴은 `components/guide/webtoon-scope.tsx`의 라이트박스를 참고한다(파일 수정 금지).
  - **기존 화면 규칙**: 실제 캡처가 있는 경우에만 쓴다. 원본은 고객 폴더에 있고 수정·이동하지 않는다.
    - `I:\AIO_OS\01_WORK\01_에이전시\01_영업관리\03_잠재고객\261010_BWL\00_기존 자료\05_웹사이트_캡처\kr_home_pc.png` (1440×4439) · `kr_home_mo.png` (390×7027). 출처 README에 따르면 2026-10-10 drs-secret.co.kr 수집본이다.
    - `I:\AIO_OS\01_WORK\01_에이전시\01_영업관리\03_잠재고객\261010_힐러넷\00_기존 자료\08_사이트_캡처\캡처_index_1440_20261010.png` (1440×7094) · `캡처_index_390_20261010.png` (390×6528). healernet.co.kr 수집본이다.
    - 이미 설치된 `sharp`로 일회성 변환한다: PC는 위에서 `1440×900`, 모바일은 위에서 `390×844`를 잘라 webp(quality 80)로 저장한다. 자르기와 크기 변환만 하고 리터치·쿠키 배너 제거 같은 편집은 하지 않는다. 출력은 범위 5번의 경로 4개다. 변환 명령, 원본·출력 SHA-256, 크기를 RESULT에 기록한다. 고객 폴더의 절대경로를 저장소 코드에 남기지 않는다.
    - 경로 맵은 `lib/home-journey.ts`에 `export const beforeShots = localReferenceReview ? { "bwl-store": {...}, "healernet-website": {...} } : {};` 형태로 둔다. 플래그를 끈 빌드에서는 문자열 자체가 번들에 남지 않게 한다. 작품이 카탈로그에 있을 때만 렌더한다.
    - **yofree-shop**: 요프리 쇼핑몰의 기존 화면 캡처는 찾지 못했다. 힐러넷 `캡처_shop_1440`은 다른 페이지이므로 쓰지 않는다. 기존 자리에 HOLD 자리표시를 둔다: 같은 프레임 크기의 점선 상자, 가운데 `.wj-caption` `기존 화면 자료 확인 중`, 속성 `data-hold="before"`. RESULT 미해결에 적는다. **기존 화면을 생성·합성·추정해서 만들지 않는다.**
- **기본 빌드(작품 없음)**: 탭 2개 `웹사이트 제작`·`쇼핑몰 제작`. 각 패널은 브라우저 프레임 1개에 대표 이미지(`/creative-v08/development-website.webp`, `/creative-v06/development-shopping-mall.webp`)와 `.wj-tag` `연출 예시`를 둔다. 비교 블록은 렌더하지 않는다. 그 자리에 작업 순서 4단계 목록 `기존 화면 점검` → `가이드 적용` → `PC·모바일 화면 설계` → `문의·구매 동선 연결`을 둔다. 링크는 서비스 페이지 2개다.

### 04 컨텐츠 — `journey-content`, eyebrow `04 CONTENT`, 라벨 `컨텐츠`
- 목적: 플랫폼과 타깃에 맞춘 컨텐츠 6종을 직접 만든다는 점. 서비스마다 실제 미디어 1개를 보여준다.
- h2 `플랫폼에 맞는\n컨텐츠를 직접 만듭니다` / lead `같은 브랜드 가이드로 채널과 타깃에 맞는 형식을 고릅니다. 웹툰부터 광고 영상까지 기획과 제작을 한 팀이 맡습니다.`
- 탭(role=tablist) 6개. 순서·id·라벨은 아래와 같고 바꾸지 않는다. 라벨을 ` · `로 이으면 필수 문구와 같아야 한다.
  | 서비스 id | 탭 라벨 | 검토 빌드 미디어(slug → media) | 기본 빌드 미디어 | 한 줄 설명 | 활용처 칩 |
  |---|---|---|---|---|---|
  | `webtoon` | 웹툰 | `yofree-outing-webtoon` → media[0](웹툰 1페이지) | `/webtoon-v11/cut-01.webp`, 캡션 `1억의 구단주 · 제작 예시` | 브랜드 이야기를 세로로 읽히는 컷으로 그립니다 | 인스타툰 · 상세페이지 · 광고 소재 |
  | `animation` | 애니메이션 | `yofree-outing-motion` → media[0](세로 영상) | `/creative-v06/video-animation.webp` `연출 예시` | 캐릭터와 장면에 움직임을 더합니다 | 릴스 · 쇼츠 · 캐릭터 영상 |
  | `ai-influencer` | AI 인플루언서 | `bwl-aqua-ad` → media[0](세로 영상). 캡션 `87언니(AI 가상인물) 출연 · 제안용 시안` | `/creative-v06/video-ai-influencer.webp` `AI 가상인물 · 연출 예시` | 브랜드 전용 AI 가상인물을 만듭니다 | 제품 소개 · 숏폼 영상 · SNS 이미지 |
  | `motion-graphics` | 모션그래픽 | `bwl-brand-motion` → media[0](16:9) | `/renewal/video.webp` `연출 예시` | 그래픽과 글자의 움직임으로 메시지를 전합니다 | 제품 소개 · 홈페이지 · 행사 화면 |
  | `brand-film` | 브랜드 홍보 영상 | `healernet-motion` → media[0](16:9) | `/creative-v06/video-brand-film.webp` `연출 예시` | 브랜드가 하는 일과 이유를 한 편에 담습니다 | 홈페이지 · 회사 소개 · 전시 |
  | `ad` | SNS 광고 영상 | `yofree-mg-short` → media[0](세로 영상) | `/creative-v06/video-sns-ad.webp` `연출 예시` | 피드에서 첫 장면으로 시선을 붙잡습니다 | 릴스 · 쇼츠 · 피드 광고 |
  - 한 줄 설명·칩은 BRIEF_P3 `contentHomeServices`의 `line`·칩과 같은 문자열이다(메인과 `/content`가 같은 서비스를 다르게 설명하지 않게 한다). P3가 나중에 이 6개를 import로 바꾼다.
  - 선택 함수(`lib/home-journey.ts`): 지정 slug가 카탈로그에 있으면 그 작품. 없으면 `workMatchesService(work, id, "video")`의 첫 작품(`ai-influencer`는 마케팅 분과에도 같은 id가 있으므로 division `"video"`를 반드시 넘긴다). 그것도 없으면 기본 빌드 미디어를 쓴다.
  - **AI 인플루언서 탭**(`FACTS_AI_INFLUENCER.md` 기준): `bwl-aqua-ad`는 자체 AI 가상인물 87언니가 출연한 닥터시크릿 제안용 시안이다(계약·게시·납품 아님). 검토 빌드에서 이 작품이 선택되면 `.wj-caption`은 `{brand} · {title}` 대신 데이터에 고정한 라벨 `87언니(AI 가상인물) 출연 · 제안용 시안`을 쓰고, `.wj-tag`는 productionStatus 그대로다. 라벨은 FACTS가 87언니 출연으로 확인한 slug 3개(`bwl-aqua-ad`, `bwl-cplus-ad`, `bwl-cleanser-ad`)에 묶어 두고, 다른 작품으로 폴백되면 일반 `{brand} · {title}`을 쓴다. 기본 빌드 대체 이미지는 AI로 만든 인물 이미지이므로 태그를 `AI 가상인물 · 연출 예시`로 쓴다. 문구는 FACTS의 "쓰면 안 되는 표현"(`운영 중`, `게시 중`, 팔로워·조회수·성과, 목소리·립싱크, 고화질, 납품·채택, 제품 효과)을 지킨다. `87언니` 문자열은 플래그를 끈 빌드에 남지 않게 `localReferenceReview` 조건 안에 둔다.
  - 패널 구성: 왼쪽 텍스트(h3 서비스 라벨, `.wj-body` 한 줄 설명, 활용처 `.wj-chip` 3개, 작품이 있으면 `.wj-caption`(위 규칙의 캡션) + `.wj-tag` productionStatus, 링크 `서비스 자세히 보기 →` `/content/services/{id}`와 작품이 있으면 `작업 자세히 보기 ↗`). 오른쪽은 미디어 무대(`--wj-stage` 배경, `min-height: clamp(420px, 48vw, 600px)`, 미디어는 가운데. 세로 영상은 높이 기준, 가로는 폭 기준).
  - 3D 옆 미리보기(벤치마크 스튜디오좋 캐러셀): 1024px 이상에서만 무대 좌우에 이전·다음 탭의 poster(또는 대체 이미지)를 `rotateY(±32deg) scale(.78)`, opacity .55로 살짝 보이게 한다. 장식이므로 `aria-hidden="true"`, `pointer-events: none`이다. 무대 아래 `이전` `다음` 버튼(aria-label 포함)은 탭 선택과 동기화한다. reduced-motion과 1024px 미만에서는 옆 미리보기를 렌더하지 않는다.
  - 영상: `controls playsInline preload="none"`, poster 필수, width/height 속성 지정, 자동재생 없음. 탭을 바꾸면 재생 중인 영상을 `pause()`한다. 비활성 패널은 `hidden`이다(lazy 이미지·영상이 미리 받아지지 않는다).
  - 탭 키보드: ←/→ 이동, Home/End, roving tabindex, `aria-selected`, `aria-controls`, 패널 `role=tabpanel aria-labelledby`. 1024 미만에서 탭 줄은 줄바꿈(`flex-wrap: wrap`)한다. 가로 스크롤 탭 줄은 만들지 않는다. 라벨 안에서는 줄을 바꾸지 않는다(`white-space: nowrap`).

### 05 마케팅 — `journey-marketing`, eyebrow `05 MARKETING`, 라벨 `마케팅`
- 목적: 마케팅 안에서 **플랜 기획 → 운영 → 데이터 기반 성과 개선**이 한 바퀴로 이어진다는 점. 이전 초안의 별도 06 `성과 개선` 단계는 없앴고 그 내용(데이터를 보고 고치기, 필요하면 개발·컨텐츠로 돌아가기)을 이 단계에 합쳤다. 실제 레퍼런스는 없다.
- h2 `계획하고 운영하고\n데이터로 고칩니다` / lead `누구에게 어떤 메시지를 어느 채널에서 보여줄지 먼저 정합니다. 계획대로 SNS와 광고, 검색 노출을 운영하고 쌓인 데이터를 보며 계속 고칩니다.`
- 본문: tint 패널 안의 순환 흐름도. HTML/CSS로 만든다(이미지·차트 라이브러리 금지). 1024 이상은 가로, 미만은 세로. 패널 오른쪽 위에 `.wj-tag` `연출 예시`.
  - 노드 4개: `플랜 기획`(목표 고객 · 채널 · 메시지 · 일정) → `운영`(게시 · 광고 · 검색 노출 관리) → `데이터 확인`(유입 · 반응 · 문의 흐름) → `성과 개선`(반응 좋은 메시지 늘리기 · 막히는 지점 고치기).
  - `성과 개선`에서 `운영`으로 돌아가는 화살표 하나(순환). `성과 개선` 노드 아래 갈래 링크 2개: `화면 수정 → 개발 단계`(`#journey-dev`), `소재 교체 → 컨텐츠 단계`(`#journey-content`). 링크 문구에 단계 번호 숫자를 넣지 않는다.
  - 화살표는 장식이므로 `aria-hidden`. 노드는 순서 목록(`ol`)으로 마크업해 스크린리더가 순서를 읽게 한다.
- **숫자·그래프·성과 지표·가상 대시보드 금지.** 축·막대·퍼센트·증가 화살표 같은 성과 연출도 넣지 않는다(eyebrow `05 MARKETING`과 `.wj-num` 번호만 예외).
- 링크 줄: `통합 마케팅` `/marketing/services/integrated` · `SNS 대행 운영` `/marketing/services/sns` · `SEO·AEO·GEO` `/marketing/services/seo`.

### 마무리 CTA `.wj-closing` (유지)
- `.wj-lead` `어디서부터 시작할지 상담에서 함께 정합니다` + `.wj-button` `견적 문의` → `#contact`(보라 배경·흰 글자, `.t-button--lg` 역할로 히어로 버튼과 같은 크기). 가격 안내는 넣지 않는다. `#process`가 지워졌으므로 이 CTA 바로 다음이 OUR STANDARD다.

## #divisions 서비스 목록
- 세 카드 목록을 한 클래스로 통일한다. 글자는 W2 `.t-small` 역할(AUDIT B7과 같다)이고, 그 클래스에는 색·여백·줄바꿈만 둔다: `color: #C9C9D1; margin-bottom: 24px; word-break: keep-all`. W2가 B7(세 카드 목록 통일)을 이미 적용했으면 그 클래스를 그대로 쓰고 문구와 아래 span 처리만 한다. W2 클래스가 없으면 W2 소유 CSS를 고치지 말고 `workflow-journey.css`에 메인 전용 규칙 `.home-division-services` 하나를 두고 JSX에 `t-small`과 함께 붙인다.
- 항목은 `<span>`마다 `white-space: nowrap`으로 감싸 `AI 인플루언서`, `브랜드 홍보 영상` 같은 항목이 중간에서 끊기지 않게 한다. 구분자는 ` · `이고, 줄바꿈은 항목 사이에서만 일어난다. W2가 넣은 `overflow-wrap: anywhere`가 있으면 이 목록에서는 span nowrap 방식으로 대신한다.
- 컨텐츠: `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상`. 마케팅·개발 문구는 바꾸지 않는다.
- `studio-p1.css`가 아직 있으면 다른 사용처를 grep으로 확인한다. 이 파일은 수정하지 않는다. 다른 페이지 모양이 바뀌면 RESULT에 적는다.

## 벤치마크 반영
- 가져온다: 섹션 머리 구성(eyebrow → 큰 제목 → 짧은 설명), 흰 바탕과 연보라 tint 패널, 짧은 존댓말 문장 톤, Superpixel식 단계 탭(03·04의 탭), 스튜디오좋 3D 배치(04의 옆 미리보기), Demo Duck 상세 창(03 프레임 크게 보기)과 필터 감각(04 탭), reduced-motion 처리.
- 버린다: 8~11px 글자, 브레이크포인트마다 다른 글자 크기, 생성 이미지를 작업물처럼 쓰는 것(대체 이미지는 반드시 `연출 예시` 표기), 벤치마크의 색 변수(`--purple #7542ee` 등. 사이트 `--violet`을 쓴다), 둥근 18px 카드, 인사이트 섹션.
- 히어로 브랜드 필름 루프는 이번 범위가 아니다(최종 AIO 브랜드 영상 미확정, LCP 영향). 히어로와 `ShowcaseVideo`는 그대로 둔다.

## 카피 규칙
- COMMON.md 금지 문체를 지킨다. 다음도 금지한다: "A가 아니라 B", "A 없이", "~을 통해", "~에 대해", "최고·최저·보장·업계 1위", 근거 없는 수치·퍼센트·배수, 성과 약속("매출이 오릅니다" 류).
- 문장은 짧은 존댓말(`~합니다`)로 쓴다. 문장 끝에 쉼표절을 이어 붙이지 않는다. 한 문장에 쉼표는 1개까지다.
- 마침표 규칙은 섹션 전체에서 하나다. 제목·라벨·칩·캡션·버튼, 한 문장짜리 설명(탭 설명 포함)은 마침표를 찍지 않는다. 두 문장 이상인 lead는 문장마다 마침표를 찍는다.
- 표기 통일: `컨텐츠`(사이트 표기), `웹사이트`, `쇼핑몰`, `AI 인플루언서`, `SEO·AEO·GEO`, 고객사명은 작품 JSON `brand` 표기를 따른다(탭 라벨만 표에 적은 짧은 이름).
- 카피를 쓴 뒤 `humanizer` 기준(번역투·과한 쉼표·AI 어휘)으로 한 번 점검하고 고친 내역을 RESULT에 적는다.

## 접근성·성능·SEO
- 섹션 `aria-labelledby="wj-title"`, 단계 article마다 `aria-labelledby`, 레일 `nav aria-label="작업 단계"`. 모든 이미지에 의미 있는 alt를 단다(작품은 JSON alt, 대체 이미지는 "웹사이트 제작 연출 예시 이미지" 식). 장식 요소는 `aria-hidden`.
- 키보드: 레일 링크, 탭, 이전·다음, 프레임 확대 버튼, dialog 모두 Tab으로 닿고 `:focus-visible` 외곽선(기존 lavender 3px)이 보인다.
- 이미지는 `next/image`(width/height 또는 `fill`+비율 박스, `sizes` 지정, lazy 기본, priority 금지)를 쓴다. 영상은 `preload="none"` + poster다. 이 섹션 때문에 첫 화면 네트워크 요청이 늘어나면 안 된다.
- CLS 0을 목표로 한다. 모든 미디어 박스는 aspect-ratio나 고정 높이를 가진다.
- JS: IntersectionObserver 1개, 탭 상태, dialog뿐이다. 새 의존성은 없다.
- SEO: 페이지 h1은 기존 1개 그대로다. 이 섹션의 h2는 6개(인트로 1 + 단계 5)다. `#process` 삭제로 메인 h2가 1개(`AI로 효율을 높이고…`) 줄어든다. JSON-LD는 추가하지 않는다. 플래그를 끈 빌드의 `/` HTML에 고객 작품 흔적(`reference-review`, `before-pc`, `BWL`, `DR's Secret`, `닥터시크릿`, `87언니`, `힐러넷`, `HEALERNET`, `YoFree`, `요프리`)이 없어야 한다.

## 테스트 `tests/home-journey.test.mjs`
직렬 테스트에 포함되게 `*.test.mjs`로 만들고 `lib/home-journey.ts`를 직접 import한다. 다음을 확인한다.
1. 단계 5개의 id 순서: `journey-consult, journey-brand, journey-dev, journey-content, journey-marketing`. `journey-growth`는 없다. 제목은 `\n` 기준 2줄 이하이고 각 줄은 공백 포함 11자 이하다.
2. 컨텐츠 탭 id가 정확히 `webtoon, animation, ai-influencer, motion-graphics, brand-film, ad`이고 라벨을 ` · `로 이으면 필수 문구와 같다. 각 id는 `lib/content.ts`에 division `video`로 존재한다.
3. 데이터에 적힌 모든 slug가 `content/works/*.json`에 있다. 컨텐츠 slug는 해당 서비스에 `workMatchesService(..., "video")`로 매칭되고, 개발 slug는 division `development`다.
4. `beforeShots` 키는 개발 slug의 부분집합이고 `yofree-shop`을 포함하지 않는다. 파일 존재는 `AIO_VERIFY_LOCAL_MEDIA=1`일 때만 검사한다(기존 테스트 관례).
5. 모든 카피 문자열에 금지 패턴(`을 통해|를 통해|에 대해|아니라|없이|최고|최저|보장|%|\d+배|운영 중|게시 중|팔로워|조회수|립싱크|목소리|고화질`)이 없다. AI 인플루언서 탭 데이터의 87언니 출연 slug 라벨이 정확히 `87언니(AI 가상인물) 출연 · 제안용 시안`이고(플래그 조건 때문에 값이 비면 `beforeShots`와 같은 방식으로 플래그를 켠 import에서 확인한다), 기본 빌드 대체 미디어 태그에 `AI 가상인물`이 있다. `인물 중심 세로 영상 시안`·`AI 생성 여부 확인 중` 문자열이 없다.
6. `components/guide/main.jsx`에 필수 문구가 있고 `브랜드 홍보 및 SNS 광고 영상`이 없다. `HomeReferences` import가 없다. `id="process"`, `main-method`, `method-intro`, `AI로 효율을 높이고`, `전문가가 품질을 지킵니다`가 없다. `OUR STANDARD`는 남아 있다.
7. `components/guide/about.jsx`에 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상`이 있고 `브랜드 홍보 및`이 없다.
8. `components/`·`app/`·`lib/`에 메인을 가리키는 `/#process` 링크가 0건이고, `main.jsx` 안에 `href="#process"`가 0건이다.
9. `components/home/workflow-journey.css`에 `!important`가 0개이고, `font-size|line-height|letter-spacing|font-weight|font-family` 선언의 값이 모두 `var(`로 시작한다(또는 선언 자체가 0개). `@media` 블록 안에는 이 다섯 속성 선언이 0개다.

## 완료 기준 (Sonnet이 Playwright로 확인)
빌드·서버는 한 번에 하나만 띄운다. 검토 빌드는 `.env.local` 기본값(플래그 켬)으로 만든다. 기본 빌드는 `$env:NEXT_PUBLIC_AIO_REFERENCE_REVIEW='0'; npm run build`로 만든다. 각 빌드를 `npm run start -- -p 3215`로 띄워 확인하고 끈다.

- [ ] `npm run typecheck` PASS, `npm run lint` 오류 0(기존 경고 1개 허용), 직렬 테스트(새 테스트 포함) 실패 0, `npm run build` PASS(두 빌드 모두).
- [ ] 메인에 "브랜드의 이야기를 이렇게 만들었습니다"와 `.home-references`가 없다. `#work`(= `.wj`)가 `#divisions` 바로 다음, OUR STANDARD 섹션 바로 앞에 있다. 히어로 `제작 예시 살펴보기` 클릭 시 `#work`로 이동한다. `/content` 홈과 서비스 상세의 레퍼런스 블록은 이전과 같다.
- [ ] `#process` 삭제: `/`에 `#process` 요소, `.main-method`, `AI로 효율을 높이고`, `전문가가 품질을 지킵니다` 문구가 0건이다. `/`의 모든 `a[href*="#process"]`가 0건이다. 다른 페이지(`/lab/services/*`, `/content/services/*`)의 자기 `#process` 섹션과 링크는 이전과 같이 동작한다. `/about`에 6종 문구가 있고 `브랜드 홍보 및`이 없다.
- [ ] 1440 / 1024 / 768 / 390 / 360px에서 `document.documentElement.scrollWidth <= innerWidth`(두 빌드), 콘솔 error 0(하이드레이션 경고 포함), 깨진 이미지 0(`img.naturalWidth > 0`).
- [ ] 타이포 = 역할 토큰(각 폭에서 측정): `.wj-title`, `.wj-step-title`, `.wj-lead`, `.wj-body`, `.wj-eyebrow`, `.wj-num`, `.wj-item-title`, `.wj-caption`, `.wj-tab`, `.wj-chip`, `.wj-tag`, `.wj-rail-label`, `.wj-link`, `.wj-button` 그룹마다 `getComputedStyle`의 `fontSize / lineHeight / letterSpacing / fontWeight / fontFamily` 조합이 1종류다. 그 값은 (a) 위 대응표의 W2 역할을 AUDIT 1.2 값으로 해당 폭에서 계산한 값과 같고, (b) 같은 역할 클래스를 가진 사이트의 다른 요소와 같다(예: `.wj-title` = `#divisions h2`, `.wj-button` = 히어로 `견적 문의`, `.wj-body` = 다른 `.t-body`). 측정표(역할·폭·5속성·비교 대상)를 RESULT에 적는다.
- [ ] 강제 규칙 의존 없음: 측정 시점에 review.css에 `.guide-page h1`·`.guide-page h2`의 `!important` 글자 규칙이 없다(`grep`). `.wj` 안 제목의 계산값을 만든 규칙이 역할 클래스·토큰임을 DevTools/CSSOM으로 1개 이상 확인해 RESULT에 적는다.
- [ ] 정렬: 같은 폭에서 5개 `.wj-step-title`의 `getBoundingClientRect().left` 차이가 1px 이하다. eyebrow·lead도 같다. `.wj-title`의 left와 `#divisions` h2의 left 차이가 1px 이하다(같은 컨테이너 토큰).
- [ ] 한글 글꼴: 자기 텍스트에 한글이 있는 요소 중 computed `fontFamily`가 `Unbounded`로 시작하는 요소가 0개다. 테스트 9의 CSS 검사가 통과한다(reduced-motion 블록 포함).
- [ ] 제목 줄바꿈: 360px에서 각 h2의 줄 수(높이 ÷ 계산 line-height, 반올림)가 데이터의 `\n` 수 + 1과 같다.
- [ ] 스크롤: 1440px에서 각 단계로 스크롤하면 레일의 `aria-current="step"`이 해당 단계로 바뀌고, 레일 링크 클릭 시 해당 article이 헤더 아래에 보인다. 레일은 sticky로 화면에 남는다. wheel 이벤트 리스너·scroll-snap이 없다(코드 grep). 390px에서는 레일이 숨겨지고 타임라인 점이 보인다.
- [ ] reduced-motion(`emulateMedia({ reducedMotion: "reduce" })`): `.wj` 안 요소의 transition-duration이 0이고, 옆 미리보기가 렌더되지 않고, 모든 미디어가 transform 없이 보인다.
- [ ] 검토 빌드: 03에 탭 3개가 지정 순서로 있다. bwl-store·healernet-website는 기존/AIO 프레임 2개와 폰 프레임이 보이고, yofree-shop은 `data-hold="before"` 자리와 `기존 화면 자료 확인 중`이 보인다. 프레임 클릭 시 dialog가 열리고 Esc로 닫히며 포커스가 돌아온다. 04에 탭 6개가 있고 각 탭에 지정 slug의 미디어가 있다. 영상 탭 5개(애니메이션·AI 인플루언서·모션그래픽·브랜드 홍보 영상·SNS 광고 영상)는 재생 버튼을 누르면 `currentTime`이 증가한다. 탭 전환 시 이전 영상이 멈춘다. 상태 태그는 JSON productionStatus와 같다. AI 인플루언서 탭 캡션이 정확히 `87언니(AI 가상인물) 출연 · 제안용 시안`이다.
- [ ] 기본 빌드: 섹션이 5단계 모두 정상으로 렌더된다. 03은 `연출 예시` 프레임 2개와 4단계 목록만 있고 비교 블록·HOLD는 없다. 04 탭 6개 모두 대체 미디어(웹툰은 `1억의 구단주 · 제작 예시`, AI 인플루언서는 `AI 가상인물 · 연출 예시`)가 있다. `/` HTML과 `.next/static`에 `before-pc`·`before-mobile`·`87언니`가 0건이고, `/` HTML에 고객명·`reference-review`가 0건이다.
- [ ] 05 마케팅: 노드 4개(`플랜 기획`·`운영`·`데이터 확인`·`성과 개선`)가 순서대로 있고, 개발·컨텐츠 단계로 가는 링크 2개가 각각 `#journey-dev`·`#journey-content`로 이동한다. eyebrow·`.wj-num` 밖에 숫자(0-9)·`%`·차트 요소가 없고 `연출 예시` 태그가 있다. `#journey-growth`와 `성과 개선` 레일 항목이 없다(레일 항목 5개). 마무리 CTA `견적 문의`가 `#contact`로 이동한다.
- [ ] 메인 `#divisions` 컨텐츠 카드와 FAQ에 필수 문구가 정확히 들어 있다. 세 카드 서비스 목록의 계산 글자 스타일이 같다. 360px에서 `AI 인플루언서`가 중간에서 끊기지 않는다.
- [ ] 새 컴포넌트의 JSX에 `style=` 속성이 0개다(`grep -n "style=" components/home`).
- [ ] 1440·390px 전체 화면 캡처와 단계별 캡처(두 빌드)를 `.qa/p4/`에 저장하고 직접 열어 확인한 소감을 RESULT에 적는다. 실행하지 못한 항목은 NOT_RUN으로 적는다.

## RESULT_P4.md에 반드시 적을 것
변경 파일 목록, before 캡처 변환 명령과 SHA-256, 결정 사항(카피 최종본 포함), W2 역할 이름 대응표(AUDIT 이름과 다르면), `#process` 링크 grep 결과와 바꾼 곳, 검증 명령과 결과, 타이포 측정표, 미해결: yofree-shop 기존 화면 HOLD, 브랜드 가이드·요프리 마케팅 제안서(`261010_힐러넷/05_마케팅플랜`)를 레퍼런스로 쓸지 여부(권리 미확정), before 캡처의 공개 권리(작품 공개 승인과 별도로 판단 필요), 닥터시크릿 이름·87언니 시안 공개 허락(FACTS 남은 확인), 쓰이지 않게 된 `.main-method`·`.method-intro`·`.method-line` CSS 정리 후보, 범위 밖에 남은 옛 문구 `브랜드 홍보 및 SNS 광고 영상`의 위치(예: `lib/guide-content.ts` 인사이트 본문, `lib/content.ts` video summary는 P3 담당).
