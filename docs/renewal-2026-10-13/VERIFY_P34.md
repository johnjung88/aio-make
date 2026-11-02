# P3 · P4 · FIX 독립 검증 (VERIFY_P34)

2026-10-14 · 검증자 Claude Sonnet · 대상: 기준 커밋 `0e8be3b` 위의 미커밋 P3 + P4 + RESULT_FIX_P34 변경 · 소스 수정 없음

**최종 판정: FAIL.** 명령 검증, 게이트 누수 차단, 메인 5단계 워크플로우, 타이포 일관성은 재현되어 PASS다. 단 `/content` 캐러셀 옆 카드 클릭이 동작하지 않고(P3 필수 동작), 그 밖에 P3 4건, P4 3건, FIX 1건의 결함이 있다.

## 검증 방법

- 실행 중인 사용자 미리보기(3213/3214)가 어느 작업트리의 `.next`를 쓰는지 알 수 없어, 작업트리의 `.next`를 건드리지 않으려고 **스냅샷 복사본**(`.qa/p34-verify/src`, 작업트리와 `diff -rq` 결과 차이 0)에서 빌드·서버를 돌렸다. `node_modules`와 `public/reference-review`는 junction으로 연결했고 검증 후 junction 먼저 해제하고 스냅샷을 삭제했다(원본 `node_modules`, 검토 자산 18개 폴더 유지 확인).
- 지시한 `.env.local` 이름 바꾸기는 하지 않았다. 스냅샷에서 `.env.local`을 빼고 빌드 A(플래그 미설정)를 만들었고, 빌드 B는 같은 스냅샷에 원본 `.env.local`(내용: `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1` 한 줄)을 복사해 만들었다. 원본 `.env.local`은 수정 시각(10월 12일)과 내용이 그대로다. 결과적으로 "플래그 미설정 빌드 / 플래그 켠 빌드"라는 검증 조건은 동일하다.
- 빌드·서버는 한 번에 하나, 포트 3215만 사용했다. 3213/3214는 건드리지 않았고 종료 후에도 LISTEN 상태다. 3215는 종료했다.
- 브라우저: Playwright(playwright-core 1.58 + 설치된 Chrome headless), 페이지를 직렬로 열고 닫음. 글리프 실제 렌더 폰트는 CDP `CSS.getPlatformFontsForNode`로 조회.
- 환경변수: `ENABLE_LEGACY_SUPABASE=false AIO_LOCAL_ADMIN_ENABLED=false`.
- 증거: `.qa/p34-verify/` (측정 JSON `mainB_metrics.json`, `mainB2.json`, `mainB3.json`, `contentB_metrics.json`, `contentB2.json`, `contentB3.json`, 로그 `check1.log` `buildA.log` `buildB.log`, 스크린샷 `shotsA/` `shotsB/`).

## 1. 명령 검증 — PASS

| 항목 | 결과 | 근거 |
|---|---|---|
| `npm run typecheck` | PASS | exit 0 |
| `npm run lint` | PASS | 오류 0, 경고 1(`tests/local-admin.test.mjs:110`, 기존 허용) |
| 직렬 테스트 | PASS | 54개 중 pass 53 · fail 0 · skipped 1(`AIO_VERIFY_LOCAL_MEDIA` 게이트, 기존) |
| `tests/seo-http.mjs` (빌드 B, `AIO_QA_REFERENCE_REVIEW=1`) | PASS | 48 페이지, 내부 링크 170, errors 0 |
| 빌드 A·B | PASS | 둘 다 22개 정적 페이지 생성, 컴파일 성공 |

## 2. 빌드 A (플래그 미설정) 고객 문자열 — PASS

대상 문자열: `BWL`, `DR's Secret`(이스케이프 포함), `닥터시크릿`, `힐러넷`, `Healernet`/`HEALERNET`, `YoFree`, `요프리`, `87언니`, `before-pc`, `before-mobile`, `reference-review`, `content/works/*.json`의 slug 18개.

| 대상 | 적중 |
|---|---|
| `.next/static` 텍스트 파일 전체 | 0건 |
| `/`, `/content`, `/lab`, `/marketing` 서버 HTML(RSC payload 포함) | 각 0건 |
| `.next/static`의 대소문자 무시 검색에서 woff2 바이너리 1건 | 바이너리 우연 일치(대소문자 구분·텍스트 모드에서 0건) |

참고: `.next/server/app/(public)/[division]/page.js` 같은 서버 번들에는 고객 데이터가 남아 있다(`works.generated.ts` 서버 코드). 공개 응답에는 나오지 않으며 이전과 같은 구조다.

렌더 확인(1440/390, 4페이지): 가로 넘침 0, 콘솔 오류 0, 깨진 이미지 0, h1 1개. 메인은 03이 `웹사이트 제작`·`쇼핑몰 제작` 연출 예시 탭 + 4단계 목록, 04가 6개 대체 이미지 탭(웹툰 `1억의 구단주 · 제작 예시`)으로 정상 표시된다. `/lab`도 사례 카드가 정상이다. `/content/work`는 404, `Location` 헤더 없음.

## 3. 빌드 B (플래그 켬) 브라우저

### 3-1. 메인 `/` — PASS (결함 3건은 아래 목록)

| 항목 | 결과 | 근거 |
|---|---|---|
| 옛 카드 격자·`#process` 제거 | PASS | `.home-references` `.work-card` `.main-method` `#process` 0개, 문구 `브랜드의 이야기를 이렇게 만들었습니다`·`AI로 효율을 높이고` 0건, 5폭 모두 |
| 5단계 순서 | PASS | 상담 → 브랜드 가이드 → 개발 → 컨텐츠 → 마케팅, 레일 항목 5개, 마무리 CTA `견적 문의` 있음 |
| 레일 활성 단계 변화 | PASS | 스크롤 기록: 상담(y-300) → 브랜드 가이드(+1050) → 개발(+1800) → 컨텐츠(+2850) → 마케팅(+4050), `#work[data-active]` 0→4, 세로선 `scaleY` 0.2→0.84. 레일 `position: sticky`, 중간 스크롤에서 top 109 고정(헤더 77 + 32). 레일 링크 클릭 시 `#journey-dev` top 101 > 헤더 하단 77 |
| 03 개발 | PASS | 탭 3개(DR's Secret 쇼핑몰 · 힐러넷 웹사이트 · 요프리 쇼핑몰). 1·2번은 브라우저 프레임 2개 + 폰 프레임 2개(기존/AIO), 캡션 `기존 공식몰 첫 화면 · 2026-10-10 캡처` 등. 3번은 `data-hold="before"` 점선 프레임 + `기존 화면 자료 확인 중`(조작된 before 없음), 폰 프레임 0개. 프레임 클릭 시 dialog가 열리고 Esc로 닫히며 포커스가 누른 `기존 화면 크게 보기` 버튼으로 돌아옴 |
| 04 컨텐츠 | PASS | 탭 6개 순서·라벨이 필수 문구와 일치. 각 탭에 지정 미디어(웹툰 이미지, 영상 5개는 poster 있음). 영상 5개 모두 `play()`로 `currentTime` 약 1.46초 증가. 탭 이동 시 이전 영상 정지 코드 있음. AI 인플루언서 캡션 정확히 `87언니(AI 가상인물) 출연 · 제안용 시안`. ←/→/Home/End 동작(순환 포함). 3D 옆 미리보기 2개(≥1024) |
| 05 마케팅 | PASS | 노드 4개 순서대로, 숫자·`%`·차트 요소 0(eyebrow·번호 제외), `연출 예시` 태그, 개발·컨텐츠 갈래 링크 `#journey-dev` `#journey-content` |
| 모바일 | PASS | 390에서 레일 `display:none`, 본문 왼쪽 세로선 + 12px 점(현재 단계 보라), sticky 요소는 dialog 바 외 없음 |
| reduced-motion(1440·390) | PASS | 옆 미리보기 0개, 미디어 transform 없음·reveal 대기 없음, 숨은 텍스트 0, 콘솔 0. transition-duration은 `1e-05s`로 나온다. 사이트 전역 `review.css`의 `.guide-page * {transition-duration:.01ms !important}` 때문이며 사실상 0이다(P3·P4 결함 아님) |
| 가로 넘침·콘솔·깨진 이미지 | PASS | 1440/1024/768/390/360 모두 넘침 0, 콘솔 error·warning 0, 보이는 깨진 이미지 0, h1 1개 |
| 좌측 정렬 | PASS | 5폭에서 단계 5개의 eyebrow·h2·lead 왼쪽 x가 같음(1440: 368). `.wj-title`과 `#divisions h2` left 같음(56/41/30.7/20) |
| 제목 줄 수 | PASS | 360에서 `.wj-title`·단계 h2 6개 모두 2줄(데이터의 `\n` 수 + 1) |

### 3-2. `/content` — FAIL (캐러셀 옆 카드 클릭 불가)

| 항목 | 결과 | 근거 |
|---|---|---|
| 히어로 | PASS | 1440x900: 히어로 top 130, bottom 900, 높이 770. 첫 CTA `서비스 살펴보기` bottom 820으로 완전히 보이고 아래 여백 80px. 1024: 61px, 768: 46px, 390: 40px. `<video>`·`.ch-hero-pause` 0개, 정지 이미지 + `연출 예시` 태그. 390·360에서 태그는 오른쪽 위로 이동하며 버튼·h1·eyebrow와 겹침 0. 자리표시 문구(`준비 중` 등) 0건. 단 아래 P3-4 참고 |
| 구성 | PASS | 히어로 → `#services` → `#process` → CTA 순서. 레퍼런스 격자·인사이트 섹션·`/content/work` 링크·`작업 사례` 문구 0건(서브 내비의 `인사이트` 탭은 W1 이후 상태 그대로). 페이지의 모든 `a[href]`(17개)가 200. `/content/work` 404 |
| 서비스 시작가 | PASS | 6줄 모두 `PRICING_FINAL`과 일치: 웹툰 `웹툰 제작 12컷 10만 원부터 · 부가세 별도` + 옵션 `모션코믹 영상화 옵션 · 30초 7.5만 원부터`, 애니메이션 `30만 원부터 · 30초 기준 · 부가세 별도`, AI 인플루언서 `10만 원부터 · 캐릭터 1명 세팅 + 이미지 5장 기준 · 부가세 별도`, 모션그래픽 `10만 원부터 · 단순형 30초 기준 · 부가세 별도`, 브랜드 홍보 영상·SNS 광고 영상 `25만 원부터 · 30초 기준 · 부가세 별도`. `맞춤 견적` 문구 0건. 가격 span은 1440~360에서 모두 한 줄 안(`getClientRects` 1) |
| AI 인플루언서 | PASS | 이미지 태그 `AI 가상인물 · 연출 예시`, `계정 게시·운영은 별도 견적`이 목록 모드에만 해당 항목에 있고 다른 서비스에는 없음. (캐러셀 패널에서 AI 인플루언서를 선택했을 때의 표시는 소스상 같은 `ServiceDetail`이라 같음) |
| 3D 캐러셀 기본 동작 | PASS | `data-mode="carousel"`, 탭 6개 라벨 순서 일치, ←/→/Home/End·이전/다음 버튼으로 탭·패널 h3·카운터·`data-pos=0` 카드·`aria-live` 문구가 함께 바뀜(6→1 순환 포함), 6초 대기에도 자동 넘김 없음, 포커스 외곽선 3px lavender, 무대 `aria-hidden` + 카드 `tabindex=-1` + `touch-action: pan-y`, 캐러셀 내 Tab 서비스 링크 1개, 스와이프(dx -80)로 다음 서비스 이동 + 이동 없이 URL 유지, 가운데 카드 클릭은 `/content/services/animation` 이동 |
| **옆 카드 클릭** | **FAIL** | 옆 카드(`data-pos` ±1·±2)의 중심점 `elementFromPoint` 결과가 카드가 아니라 `div.ch-stage`다. 1440·768·390 모두 같다. 실제 마우스 클릭 후 선택이 바뀌지 않는다(웹툰 유지). 원인: `.ch-stage`가 `perspective` + `transform-style: preserve-3d`이고 카드가 `translateZ(-95~-300px)`라 같은 3D 컨텍스트에서 z=0인 무대 박스가 먼저 hit된다 |
| 목록 모드 | PASS | 토글 클릭 시 `li.ch-item` 6개, 각 항목에 서비스명·한 줄 소개·설명·칩 3개·가격·링크. JS 끈 상태에서도 목록 6개, 링크 6개, 가격 6개 |
| reduced-motion | PASS | 초기 `data-mode="list"`, 숨은 텍스트 0, 캐러셀 전환 시 카드는 `data-pos=0` 하나만, transform은 `translateX`만(회전·Z 없음) |
| 제작 과정 탭 | PASS(부분) | 탭 5개, ↑/↓/←/→/Home/End 동작(순환 포함), 탭 전환 중 `.ch-cta` top 3684 불변(패널 높이 고정), h3 1개, `Blender` 0건. 단 아래 P3-3 |
| 이미지 요청 | PASS | 페이지 전체 스크롤 + 모드 3회 전환 후 `/_next/image` 요청이 원본마다 1개(히어로 w=1920, 카드 6개 w=384) |
| `/content` HTML 고객 문자열 | PASS | 빌드 A·B 모두 `reference-review` `BWL` `DR's Secret` `닥터시크릿` `힐러넷` `YoFree` `요프리` `87언니` `/content/work` `home-references` `work-card` `작업 사례` 0건 |
| 히어로 영상 슬롯 동작 | NOT_RUN | 값이 `undefined`로 커밋돼 있고 확인하려면 소스를 바꿔 새로 빌드해야 한다(소스 수정 금지, 빌드 1회 추가 비용). 코드 읽기: `HeroMedia`는 `video`가 없으면 이미지만 렌더하고 영상 층은 마운트 후에만 생성, reduced-motion이면 `autoPlay` 끔 |
| `SHOW_STARTING_PRICE=false` 화면 확인 | NOT_RUN | 같은 이유. `tests/content-home.test.mjs`의 `startingPrice(id,false) === null` 통과로 갈음 |
| `scripts/verify-reference-pages.mjs` | NOT_RUN | 이번 범위 밖(대신 `tests/seo-http.mjs` 실행 PASS) |

### 3-3. 타이포 — PASS(P3 버튼 1건 불일치)

5폭(1440/1024/768/390/360)에서 역할별로 `fontSize | lineHeight | letterSpacing | fontWeight | fontFamily` 조합이 **모두 1종류**다(캐러셀/목록 두 모드 합쳐서도 1종류). W2 토큰 계산값과 일치한다.

| 역할 | 1440 | 1024 | 768 · 390 · 360 | 비고 |
|---|---|---|---|---|
| h1 (`/` 히어로 = `.ch-hero-title`) | 74.88/89.856, 750, -2.9952px | 53.248/63.898 | 39.936/47.923 (768), 34/40.8 (390·360) | 두 페이지 동일 |
| h2 (`#divisions h2` = `.wj-title` = `.ch-title`) | 51.84/64.8, 700, -1.8144px | 36.864/46.08 | 28/35 | 세 요소 동일 |
| 단계 h2 `.wj-step-title` | 40/48, 600 | 28.672/34.406 | 26/31.2 | feature 토큰 |
| h3 (`.wj-item-title` = `.ch-svc-title` = `.ch-step-title`) | 27.36/36.936, 650 | 20/27 | 20/27 | 동일 |
| lead (`.wj-lead` = `.ch-lead` = `.ch-svc-line`) | 20/35, 400, -0.2px | 17/29.75 | 17/29.75 | 동일 |
| 본문 (`.wj-body` = `.ch-body` = `.ch-price` = `.ch-hero-services`) | 16/28, 400, -0.16px | 같음 | 같음 | 동일 |
| 캡션·작은 글씨 (`.wj-caption` = `.ch-caption` = `.ch-price-note` = `.ch-note`) | 14/23.8, 400 | 같음 | 같음 | 동일 |
| 탭·칩 (`.wj-tab` `.wj-chip` = `.ch-tab` `.ch-chip` `.ch-toggle`) | 14/16.8, 500 | 같음 | 같음 | 동일 |
| 태그 (`.wj-tag` = `.ch-tag`) | 12/19.2, 400, 0.12px | 같음 | 같음 | 동일 |
| eyebrow·번호 (`.wj-eyebrow` `.wj-num` = `.ch-eyebrow` `.ch-kicker` `.ch-num`) | 12/18, 500, 1.68px, Unbounded | 같음 | 같음 | 라틴·숫자만 |
| 링크 (`.wj-link` = `.ch-link`) | 15/18, 600, -0.15px | 같음 | 같음 | 동일 |
| 레일 라벨 `.wj-rail-label` | 14/19.6, 500 | 같음 | 같음 | |
| 가격 금액 `.ch-price-amount` | 16/28, **700** | 같음 | 같음 | 허용된 예외 1 |
| **버튼** 메인 히어로 `견적 문의`, `.wj-button`, `/about` 히어로 버튼 | **15/18, 600** | 같음 | 같음 | |
| **버튼** `/content` `.ch-button`(히어로·CTA) | **16/19.2, 600** | 같음 | 같음 | **불일치** (P3-1) |

- 한글 실제 렌더 폰트: 두 페이지 모두 한글 보유 요소(h1·h2·h3·본문·버튼·탭)가 전부 Pretendard Variable로 렌더된다(CDP 확인). 자기 텍스트에 한글이 있고 computed `font-family`가 Unbounded로 시작하는 요소는 서브 내비 `.guide-subbrand`(`컨텐츠`) 1개뿐이며 실제 렌더는 Pretendard다. W1·W2 영역이며 P3·P4 결함이 아니다. P3·P4의 Unbounded 요소는 라틴·숫자만 담는다.
- 줄 수: 360에서 `/content` h1 2줄, h2 3개 모두 2줄, 히어로 서비스 6개 span·서비스 탭·가격 span 모두 항목 안 줄바꿈 없음. 외톨이 한 글자 줄 없음.
- 정렬: `/content` 5폭에서 히어로 eyebrow·h1·lead, 섹션 머리 eyebrow·h2·lead, CTA h2의 left가 `.guide-subbrand` left와 같다(56/41/30.7/20/20). 목록 모드 서비스 h3는 이미지 열 오른쪽에 놓이는 설계라 제외.
- 가로 넘침 0, 콘솔 error·warning 0(클릭 상호작용 제외, 아래 P3-2), 깨진 이미지 0, 텍스트 잘림 0(`.ch-sr-only` 제외). h1 1개.

### 3-4. 헤더 높이 — PASS(판단)

W2 이후 헤더는 ≥768에서 77px(`--site-header-height: 77px`), 390·360에서 74px이다(지시서의 76px보다 1px 크다). `/`, `/about`, `/marketing`, `/lab`, `/content`, `/contact` 6개 경로가 같은 값이고 CSS 변수와 실측이 일치해 sticky 오프셋(레일 top 109, 히어로 높이 770)이 정확히 맞는다. 1440 캡처(`.qa/p34-verify/shotsB/header_1440.png`)에서 로고·내비·보라 문의 버튼(44px)의 상하 여백이 균형 잡혀 의도된 값으로 보인다. 390도 햄버거와 로고 정렬이 자연스럽다. 이슈 없음.

## 4. 카피 품질

대상: 메인 `#work` 전체와 `/content` 전체(캐러셀·목록 모드 텍스트).

- 금지 패턴(`을 통해` `를 통해` `에 대해` `아니라` `없이` `최고` `최저` `보장` `%` `~배` `운영 중` `게시 중` `팔로워` `조회수` `콘텐츠` `Blender` `준비 중` 등): `/content` 0건. 메인은 `맞춤 견적`만 적중하며 COMMON 규칙상 메인에서는 허용된 표현이다.
- 번역투·쉼표 연쇄·`A가 아니라 B`: 없음. 문장당 쉼표 1개 이하. 근거 없는 수치·성과 약속 없음.
- 서비스 6종 이름: 두 페이지 모두 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상`로만 쓰인다(변형 `AI인플루언서` `홍보영상` `SNS광고` `모션 그래픽` 0건).
- 사이트 전체 옛 문구: `브랜드 홍보 및`, `홍보 및 SNS`, `편집·클리퍼`, `브랜드의 이야기를 이렇게`, `AI로 효율을 높이고`, `전문가가 품질을 지킵니다` 사용자 노출 0건(10개 경로 HTML 확인). 소스에는 사용되지 않는 잔재가 남아 있다(P4-3).
- 개선 권장(결함 등급 아님): 띄어쓰기 `정해두면`(`lib/home-journey.ts:56`)은 표준 표기가 `정해 두면`, `남겨주세요`(`lib/content-home.ts:187`)는 `남겨 주세요`, `알려주시면`(`lib/home-journey.ts:48`)은 `알려 주시면`이다. 사이트 다른 곳도 같은 식으로 붙여 쓰고 있어(`components/entries.tsx:136` 등) 일괄 정리 대상이다.
- 개선 권장: 가격 줄의 `단순형 30초 기준`(모션그래픽)은 `단순형`이 무엇인지 페이지 어디에도 설명이 없다. 설명의 `맞춤형은 브랜드 전용 캐릭터까지…`와 짝이 맞게 `단순형`도 한 줄 풀어주는 편이 좋다.
- 검수 단계 본문의 `인물과 제품 정보, 자막과 소재의 권리를 확인합니다`는 자료 근거 없이 추가된 업무 약속이다. 사실이면 유지, 아니면 삭제 검토.

## 5. 전체 화면 캡처 — 육안 확인 결과

경로: `.qa/p34-verify/`
- 메인 1440 전체: `shots_main_full_1440.png`, 390 전체: `shots_main_full_390.png`
- `/content` 캐러셀 1440: `shotsB/content_full_carousel_1440.png`, 390: `shotsB/content_full_carousel_390.png` (목록 모드: `content_full_list_1440.png` `content_full_list_390.png`)
- 단계별: `shotsB/dev_tab1~3_1440.png` `shotsB/dev_dialog_1440.png` `shotsB/content_tab1~6_1440.png` `shotsB/main_390_*.png` `shotsB/content_hero_{1440,1024,768,390,360}.png` `shotsB/content_process_1440.png`

육안으로 확인한 시각 결함(구체적):
1. `/content` 제작 과정 탭의 번호(`01`)와 라벨(`상담`)의 세로 정렬이 어긋난다. 라벨이 번호보다 위로 약 10px 올라가 있다(1440 세로 목록, 390 칩 모두). 실측: 탭 높이 66px, 번호 top +24, 라벨 박스 top +11 높이 44px, 글자는 박스 맨 위. (P3-3)
2. `/content` 390x844 첫 화면에서 히어로 CTA `서비스 살펴보기`의 아래쪽이 고정 문의 바(`.floating-contact`)에 가려진다. 버튼 748~804, 바 774~832. (P3-4)
3. `/content` 제작 과정 패널(1440)은 가장 긴 단계 기준 높이라 오른쪽에 큰 빈 공간이 생긴다(패널 481, 탭 열 663). 의도한 고정 높이의 결과라 결함은 아니지만 균형이 아쉽다.
4. 메인 `#divisions`(1440) 세 카드의 제목 높이가 다르다. 컨텐츠 카드의 서비스 목록이 2줄이라 `Studio`가 `Marketing`·`Lab`보다 약 18px 위에 놓인다. (P4-2)
5. 메인 링크 줄 화살표가 글자에 붙어 보인다(`상담 신청하기→`, `작업 자세히 보기↗`). JSX는 `{label} <span>→</span>`이지만 `.t-button`이 `inline-flex`라 공백이 사라진다. `/content`의 `.ch-link`는 `gap: 4px`가 있어 정상이다. (P4-1)
6. 메인 03 단계에 링크 줄이 두 겹이다(패널 `작업 자세히 보기 ↗ · 서비스 자세히 보기 →` 아래에 단계 링크 `웹사이트 제작 → · 쇼핑몰 제작 →`). 의도된 구성이지만 같은 서비스 링크가 중복돼 보인다. 결함 등급 아님.
7. 그 밖에 겹침·잘림·깨진 이미지·가로 넘침은 없다. 히어로 그림자 위 흰 글자 대비는 충분하다. 3D 캐러셀은 1440에서 의도한 모양으로 보인다.

## 재지시 FAIL 목록

### P3

| # | 위치 | 증상 | 기대 |
|---|---|---|---|
| P3-1 | `components/content-home/content-home.tsx:52`, `:89` (`ch-button t-button t-button--lg`) | `/content` 버튼이 16px/19.2px/600인데 메인 히어로 `견적 문의`·`.wj-button`·`/about` 히어로 버튼은 15px/18px/600이다. 같은 역할(주 버튼)의 계산값이 두 페이지에서 다르다 | 사이트 기준(`t-button`, 15px)에 맞춰 `t-button--lg`를 제거하거나, 사이트 전체를 `--lg`로 올리는 결정을 먼저 한다. BRIEF 표(`--lg`)와 실제 메인 버튼이 충돌하는 문서 문제이므로 조율자가 하나로 정한 뒤 두 페이지를 같은 값으로 맞춘다 |
| P3-2 | `components/content-home/service-showcase.tsx:172` (카드 `onClick`)와 `components/content-home/content-home.css:381-389` (`.ch-stage { perspective; transform-style: preserve-3d }`) | **옆 카드를 클릭해도 선택이 바뀌지 않는다.** `data-pos` ±1·±2 카드의 중심 `elementFromPoint`가 `div.ch-stage`다(1440·768·390). 가운데 카드(`pos=0`)만 클릭된다. 또 가운데 카드를 마우스로 누르면 포커스가 `a.ch-card`로 가면서 콘솔에 `Blocked aria-hidden on an element because its descendant retained focus … Ancestor with aria-hidden: div.ch-stage` 메시지가 뜬다 | BRIEF 2-6 "옆 카드 클릭 → `preventDefault` 후 그 카드를 선택". 무대가 hit을 가로채지 않게 한다(예: `.ch-stage`에 `pointer-events:none`, `.ch-card`에 `pointer-events:auto`. 스와이프 pointer 이벤트는 캐러셀 래퍼로 옮김). `aria-hidden` 안에 포커스가 가지 않게 카드에 `onMouseDown preventDefault` 또는 `inert` 사용. 수정 후 1440·768·390에서 옆 카드 클릭 시 선택만 바뀌고 URL 불변, 콘솔 0 확인 |
| P3-3 | `components/content-home/process-tabs.tsx:100` (`<span className="ch-tab t-chip">`)와 `content-home.css:585-598` (`.ch-step-tab`) | `.t-chip { min-height: 44px }`(`components/guide/type.css:186-189`)가 라벨 span에 걸려 44px 블록이 되고 글자가 박스 맨 위에 붙는다. 번호(18px, 가운데)와 라벨의 세로 위치가 약 10px 어긋난다(≥1024 세로 목록, <1024 칩 모두) | 번호와 라벨이 같은 가로 기준선에 놓인다. 라벨 span에 `min-height: 0`(`.ch-chip`처럼) 또는 `line-height` 정렬을 주고 탭 버튼의 `align-items: center`가 먹히게 한다. 글자 속성(font-*) 리터럴은 쓰지 않는다 |
| P3-4 | `components/content-home/content-home.css:123-136` (`.ch-hero`, `--ch-hero-pad`) | 390x844·360x844에서 히어로 CTA(748~804)의 하단 절반이 고정 문의 바(774~832)에 가려진다. 첫 화면에서 주 CTA가 반쯤 보이지 않는다 | 모바일 첫 화면에서 CTA가 고정 요소와 겹치지 않는다(히어로 아래 여백을 고정 바 높이 + 여유만큼 늘리거나 CTA를 위로 올린다). 고정 요소 CSS는 수정 금지. 1440x900은 이미 정상(아래 여백 80px)이라 해당 변수만 모바일에서 조정 |
| P3-5 | `lib/content-pricing.ts` 없음 (BRIEF P3 범위 2) | 가격 데이터·`formatWon`·`startingPrice`·`SHOW_STARTING_PRICE`가 `lib/content-home.ts:194-334`에 들어 있다. RESULT는 소유 범위 때문이라고 적었다. 동작과 값은 정확하다 | BRIEF 범위 2대로 별도 파일로 분리하고 `content-home.ts`가 import하도록 한다(서비스 상세 재작업에서 재사용). 분리 후 `tests/content-home.test.mjs` 2번과 `tests/seo-http.mjs` 통과 유지. 결함 등급은 낮음 |

### P4

| # | 위치 | 증상 | 기대 |
|---|---|---|---|
| P4-1 | `components/home/workflow-journey.css:124-131` (`.guide-page .wj .wj-link`) | 링크 줄 화살표가 글자에 붙는다(`상담 신청하기→`, `작업 자세히 보기↗`, `웹사이트 제작→`). `.t-button`이 `inline-flex`라 JSX의 공백(`{label} <span>→</span>`)이 사라진다. BRIEF 문구는 `상담 신청하기 →` | `.wj-link`에 `gap: 4px`(`.ch-link`와 같은 값)를 둬 화살표 간격을 맞춘다. 글자 속성 리터럴은 쓰지 않는다 |
| P4-2 | `components/guide/main.jsx:398` `:493` `:588` (`home-division-services`)와 `components/home/workflow-journey.css:701-710` | 메인 `#divisions` 세 카드에서 컨텐츠 카드 서비스 목록이 2줄이라 `Studio`가 `Marketing`·`Lab`보다 위로 올라가 세 카드의 제목 높이가 어긋난다(1440 캡처 `shotsB/main_divisions_crop.png`) | 세 카드 제목의 y가 같다. 목록 영역 `min-height`를 2줄 높이로 고정하거나 카드 내부를 위에서부터 쌓아 정렬한다. 1440·1024·390에서 확인 |
| P4-3 | `components/guide/main.jsx:65-80` (`workGroups`, `Studio 작업 사례.dc.html`)와 `components/guide/primitives.tsx:316` (`GuideMedia` 캡션 `콘셉트 이미지 · 실제 컨텐츠는 등록 후 공개`) | `HomeReferences` 제거 후 `workGroups` 데이터는 구조분해(`main.jsx:127`)만 되고 쓰이지 않는다. `작업 사례` 문구와 존재하지 않는 `.dc.html` 링크가 소스에 남는다. `GuideMedia` 캡션도 10개 경로 HTML에는 나오지 않지만 코드에 있다 | 사용되지 않는 `workGroups`를 삭제한다(`main.jsx` 허용 범위 내). `GuideMedia` 캡션은 W1·W2 소유 파일이라 조율자가 사용 여부를 확인해 정리한다. 낮은 등급 |

### FIX

| # | 위치 | 증상 | 기대 |
|---|---|---|---|
| FIX-1 | `components/guide/home-references.tsx` (RESULT_FIX_P34가 미해결로 남긴 항목) | `/lab`·`/marketing`의 `HomeReferences`가 클라이언트에서 `displayWorkCatalog`를 값으로 import한다. 이번 검증에서 빌드 A의 `.next/static`·HTML에 누수는 0건이라 현재는 `next.config.ts`의 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW` 정규화(`"1"`일 때만 `"1"`, 아니면 `"0"` 인라인)에 의존해 막히고 있다 | 구조적으로도 막는다: 메인처럼 서버에서 목록을 골라 props로 내린다(`service-overview.tsx`가 서버 컴포넌트라 이동 쉬움). 결함 등급 낮음(현재 누수 없음). 이번 FIX 본 항목(게이트 누수 차단, 옛 서비스 문구 정리, 문구 단일 출처, 죽은 CSS 삭제)은 모두 PASS |

FIX 검증 요약(모두 PASS): 빌드 A 누수 0건(위 2번), `contentTabs`가 `contentHomeServices`에서 만들어져 메인 04 탭 라벨·한 줄 소개·칩이 `/content`와 같은 문자열(측정 확인), 옛 서비스 문구 사용자 노출 0건, `.method-intro` `.method-line` `.main-method` CSS 사용처 0건이고 빌드·화면 정상, `studio-p1.css` 삭제 후 빌드 정상.

## 요약

- PASS: 명령 검증, 빌드 A 고객 문자열 0건 + 폴백 화면, 메인 5단계 워크플로우(레일 sticky·활성 변화·03/04/05·dialog·영상 재생·reduced-motion·모바일 타임라인), `/content` 구성·시작가·AI 인플루언서 표기·히어로 하단 여백(1440x900 CTA 완전 노출)·목록 모드·JS 끔·reduced-motion·제작 과정 탭, 타이포 역할 일관성, 헤더 77/74px, 카피 금지 패턴.
- FAIL: P3-2(옆 카드 클릭 불가, 필수 동작), P3-1(버튼 크기 불일치), P3-3(제작 과정 탭 번호·라벨 정렬), P3-4(모바일 히어로 CTA 가림), P4-1(링크 화살표 간격), P4-2(`#divisions` 카드 제목 높이), 그리고 낮은 등급의 P3-5, P4-3, FIX-1.
- NOT_RUN: 히어로 영상 슬롯 동작, `SHOW_STARTING_PRICE=false` 화면, `scripts/verify-reference-pages.mjs`.
