# RESULT P3 — `/content` 컨텐츠 분과 홈 재구성

2026-10-14 · 구현: Opus 서브에이전트 · 기준 HEAD `0e8be3b`(W1·W2 커밋 위) · 커밋·push·배포·설치 없음

**상태: 구현 완료, 브라우저·빌드 검증 NOT_RUN(검증 에이전트 몫).** 타입 검사 PASS, lint 오류 0(기존 경고 1), 새 테스트 11/11 PASS.

## 선행 조건 확인
- `git log`: `0e8be3b`(W2) → `9998b0b`(W1) 커밋 확인. 시작 시 미커밋 변경은 `HANDOFF_RESUME.md`뿐이었음.
- `app/globals.css`에 W2 토큰(`--ff-text`, `--type-*`, `--gutter`, `--container`, `--section-y(-sm)`) 있음. `review.css`에 `.guide-page h1/h2`의 `!important` 글자 규칙 없음(grep). 남은 `!important`는 `.guide-main .method-intro h2`(메인 전용)와 `[data-fit-line]` 상속 규칙뿐이라 이 페이지와 관계없음.
- 작업 중 다른 구현자(P4)가 `components/home/`, `lib/home-journey.ts`를 만들고 있었음. 손대지 않음.

## 변경 파일
| 파일 | 내용 |
|---|---|
| `lib/content-home.ts` (신규) | 히어로·서비스 6종·제작 과정·CTA 데이터, 쇼릴 슬롯 `contentHomeHero.video`, 가격 정본 `contentPricing`·`formatWon`·`startingPrice`·`SHOW_STARTING_PRICE` |
| `components/content-home/content-home.tsx` (신규, 서버) | 루트 `.guide-page.content-home`, GuideNav, 히어로, 제작 과정 섹션 머리, CTA |
| `components/content-home/hero-media.tsx` (신규, client) | 정지 이미지(항상, priority) + `video`가 있을 때만 영상 층·일시정지 버튼 |
| `components/content-home/service-showcase.tsx` (신규, client) | `#services` 섹션: 목록/캐러셀 모드, 토글, 3D 무대, 탭·화살표·스와이프·키보드, 패널, aria-live |
| `components/content-home/service-detail.tsx` (신규, 공용) | 목록 항목과 캐러셀 패널이 같이 쓰는 설명 블록 |
| `components/content-home/process-tabs.tsx` (신규, client) | 제작 과정 5단계 탭 |
| `components/content-home/content-home.css` (신규) | 이 폴더 유일한 CSS. `!important` 0, 글자 리터럴 0(예외 2개) |
| `app/(public)/[division]/page.tsx` | `video` 분기만 `<ContentHome />`로 교체. video는 `publicEntries`를 호출하지 않음. 다른 분과는 `publicEntries("reference", id)` 그대로, `generateMetadata` 그대로 |
| `lib/content.ts` | video `summary` 한 줄만 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상을 기획하고 제작합니다` |
| `scripts/verify-reference-pages.mjs` | `/content` 방문 대기 선택자 `#work` → `#services`(그 외 로직 그대로) |
| `tests/seo-http.mjs` | `/content` 서버 HTML 확인 1블록 추가: `#services`·`#process`·`data-mode="list"`, 서비스 링크 6개, `.ch-price` 6개, 고객 작품 흔적·`/content/work`·`작업 사례`·`맞춤 견적`·`Blender` 0건 |
| `tests/content-home.test.mjs` (신규) | BRIEF 테스트 1~11 |
| `docs/renewal-2026-10-13/RESULT_P3.md` | 이 문서 |

`components/guide/studio-home.jsx`는 수정·삭제하지 않고 연결만 끊음(현재 import하는 곳 0).

## 결정 사항
- **가격 모듈 위치**: BRIEF 범위 2는 `lib/content-pricing.ts` 신규였으나 조율자가 준 소유 범위에 없어 같은 내용을 `lib/content-home.ts` 하단에 둠(`contentPricing`, `formatWon`, `startingPrice(id, show = SHOW_STARTING_PRICE)`, `SHOW_STARTING_PRICE = true`). 서비스 상세 재작업 때 `lib/content-pricing.ts`로 그대로 옮기면 된다(아래 '소유 범위 밖').
- `startingPrice()`는 `{ amount, amountText, head, rest, line, note? }`. `head`가 굵은 금액부(`25만 원부터`, 웹툰 `웹툰 제작 12컷 10만 원부터`), `rest`가 ` · `로 잇는 단위(마지막은 항상 `부가세 별도`), `line`이 화면 한 줄 전체.
- 가격 줄 마크업: `strong.ch-price-amount.ch-nowrap` + 단위마다 공백 + `span.ch-nowrap("· 30초 기준")`. 래퍼 span을 두지 않아 줄바꿈은 단위 사이 공백에서만 일어나고 각 span의 `getClientRects()`가 1개가 된다. 히어로 서비스 줄도 같은 방식(Fragment + nowrap span).
- **모드**: 서버·첫 클라이언트 렌더는 `data-mode="list"`(`section#services`에 붙음). 마운트 후 reduced-motion이 아니면 `carousel`. `matchMedia` change를 듣고, 토글을 한 번이라도 누르면 사용자 선택이 우선. 토글 `aria-pressed`는 목록 모드일 때 true.
- **캐러셀**: 위치는 `data-pos="0|±1|±2|off"` + CSS. `off`는 오른쪽 바깥(`--ch-shift * 2.4`)에 `visibility:hidden`으로 둬서 순환 시 가로질러 날아가는 모습이 보이지 않음. reduced-motion이면 JS가 `data-pos="0"` 카드만 렌더하고 CSS도 3D 변환을 지움. 스와이프는 pointerdown/up 48px, 직후 click은 캡처 단계에서 막음(pointerdown마다 초기화). 카드·이미지 `draggable=false`. wheel·scroll-snap·타이머 없음.
- **키보드**: 캐러셀 영역 keydown에서 ←/→는 어디에 포커스가 있든 이동, 탭 위에서는 Home/End도 동작하고 포커스가 새 탭으로 감(roving tabindex).
- **제작 과정 패널 높이**: 고정 `min-height` 숫자 대신 다섯 단계 내용을 같은 grid 칸에 겹쳐 가장 긴 단계 높이로 자동 고정. 선택되지 않은 단계는 heading이 아닌 `div` 사본(`aria-hidden`, `visibility:hidden`)이라 h3는 1개만 있다. 폭마다 측정할 필요가 없음. 대신 단계 문구가 서버 HTML에 사본으로 한 번 더 들어감(숨김 텍스트).
- 장식 번호 `.ch-display-num`: `font-family: var(--ff-display)`(예외 2), 크기·행간·자간은 `var(--type-h1-*)`, 굵기는 `var(--type-body-weight)`(=400). 숫자 리터럴 대신 토큰으로 400을 맞춤. 제목이 번호 밑으로 들어가지 않게 `.ch-step-title`에 `padding-right: calc(var(--type-h1-size) * 1.7)`.
- `objectPosition`: 6개 클래스 `.ch-focus-{id}`에 BRIEF 초기값 그대로(웹툰 25% 50%, 애니메이션 45% 50%, AI 인플루언서 55% 40%, 모션그래픽 50% 50%, 브랜드 45% 50%, SNS 50% 50%). **1440·768·390 화면으로 본 조정은 NOT_RUN**(브라우저 금지).
- 히어로 `연출 예시` 태그와 (영상이 있을 때) 일시정지 버튼은 같은 자리(오른쪽 아래, 히어로 아래 여백). 767px 이하에서는 오른쪽 위(`top: 16px`)로 옮김(겹침 0 목적, 실측 NOT_RUN).
- CTA 포커스: `guide.css`의 `.guide-page a:focus-visible { outline: 3px solid #a99bff !important }` 때문에 외곽선 색을 흰색으로 바꿀 수 없음(`!important` 금지). 대신 `box-shadow: 0 0 0 7px var(--ch-action), 0 0 0 9px #fff`로 lavender 외곽선 바깥에 흰 테를 덧댐.
- `.guide-page a:hover`(lavender)는 `.content-home` 범위에서 `.ch-button`·`.ch-card`·`.ch-link`·탭 hover 색을 명시해 덮음(보라 버튼 글자는 hover에도 흰색, CTA 흰 버튼 글자는 `--ink` 유지).
- 히어로 영상 층(`HeroVideoLayer`)은 마운트 후에만 `<video>`를 만든다. 서버 HTML에 `autoplay`가 있으면 reduced-motion 판정 전에 재생되기 때문이다. 동작 허용이면 `autoPlay` + `play()`, reduced면 자동재생 없이 버튼으로 재생. `playing` 전에는 영상 층 opacity 0.

## W2 역할 이름 대응표
AUDIT 1.2 이름과 W2 실제 이름이 같아 그대로 씀: `.t-h1 .t-h2 .t-h3 .t-lead .t-body .t-small .t-caption .eyebrow .t-chip .t-button .t-button--lg`, 토큰 `--type-{role}-{size|weight|leading|tracking}`, `--ff-text/--ff-display`, `.l-container`(`.ch-container`는 같은 규칙의 별칭, JSX에 둘 다 붙임).

| 이 페이지 | 붙인 역할 클래스 |
|---|---|
| `.ch-hero-title` | `t-h1` |
| `.ch-title` | `t-h2` |
| `.ch-eyebrow` `.ch-kicker` `.ch-num` | `eyebrow` |
| `.ch-lead` `.ch-svc-line` | `t-lead` |
| `.ch-hero-services` `.ch-body` `.ch-price` | `t-body` |
| `.ch-svc-title`(h3·카드 span) `.ch-step-title` | `t-h3` |
| `.ch-price-note` `.ch-note` `.ch-caption` | `t-small` |
| `.ch-tab` `.ch-chip` `.ch-toggle` | `t-chip` |
| `.ch-tag` | `t-caption` |
| `.ch-link` | `t-button` |
| `.ch-button` | `t-button t-button--lg` |

## 카피 최종본
BRIEF 초안을 그대로 썼다. humanizer 기준(번역투 `~을 통해/에 대해`, 쉼표 2개 이상, `A가 아니라 B`, `A 없이`, 문장 끝 쉼표절, AI 상투어, 구조 반복)으로 다시 읽었고 고칠 문장이 없었다. 쉼표는 문장마다 1개 이하이고, 한 문장 필드는 마침표가 없고, 두 문장 필드는 문장마다 마침표가 있다(테스트 4가 확인).
- 히어로: `AIO MAKE STUDIO` / `AI가 속도를 내고⏎전문가가 완성합니다` / `웹툰부터 SNS 광고 영상까지 기획과 제작을 한 팀이 맡습니다` / 6종 줄 / `서비스 살펴보기 ↓`
- 서비스 머리: `SERVICES` / `만들고 싶은 컨텐츠를⏎골라보세요` / `서비스마다 만드는 것과 쓰이는 곳을 정리했습니다` / 토글 `한 번에 모두 보기`
- 서비스 6종: BRIEF 2-1 표 그대로(라벨·kicker·line·description·칩·태그·alt). AI 인플루언서만 `계정 게시·운영은 별도 견적`.
- 섹션 주석: `이미지는 서비스 분위기를 보여주는 연출 예시입니다. 대량 제작과 정기 제작은 따로 견적을 드립니다.`
- 제작 과정: `PROCESS` / `기획안을 먼저 맞추고⏎제작합니다` / lead와 5단계 표 그대로. `Blender` 표기 제거.
- CTA: `어떤 컨텐츠가⏎필요하신가요?`(띄어쓰기 오류 수정) / `만들고 싶은 컨텐츠와 일정을 남겨주세요. 담당자가 범위와 견적을 안내합니다.` / `프로젝트 문의` → `/content/contact`
- 시작가 6줄(테스트 2와 `seo-http` 블록이 확인):
  - 웹툰 `웹툰 제작 12컷 10만 원부터 · 부가세 별도` + `모션코믹 영상화 옵션 · 30초 7.5만 원부터`
  - 애니메이션 `30만 원부터 · 30초 기준 · 부가세 별도`
  - AI 인플루언서 `10만 원부터 · 캐릭터 1명 세팅 + 이미지 5장 기준 · 부가세 별도`
  - 모션그래픽 `10만 원부터 · 단순형 30초 기준 · 부가세 별도`
  - 브랜드 홍보 영상 `25만 원부터 · 30초 기준 · 부가세 별도`
  - SNS 광고 영상 `25만 원부터 · 30초 기준 · 부가세 별도`

## 사용자 결정 반영
1. 시작 가격 표시 — **반영**. `SHOW_STARTING_PRICE = false` 한 줄로 가격 줄·옵션 줄이 모두 사라지고 빈 자리를 남기지 않음(`startingPrice()`가 null → `ServiceDetail`이 렌더하지 않음, 테스트 2가 `startingPrice(id,false) === null` 확인). 실제 화면 끄기 확인은 NOT_RUN.
2. 히어로 쇼릴 — **반영**. `contentHomeHero.video`(`HeroVideo = { src, poster }`)가 커밋 값 `undefined`. 지금은 정지 이미지 + `연출 예시` 태그만, `<video>`·버튼·자리표시 문구 없음.
   - 받을 쇼릴 사양(사용자 안내): **10~15초 무음, 1920×1080 H.264 mp4, 3MB 이하, 공개 가능한 장면만, poster용 첫 장면 webp 1장.** 받으면 `public/`(예: `/content-home/showreel.mp4`, `/content-home/showreel.webp`)에 두고 그 한 필드만 채운다.
   - 임시 값으로 슬롯 동작 확인: **NOT_RUN**(이번 지시상 브라우저·빌드 금지). 값을 바꾼 적 없으므로 되돌릴 것도 없음. 검증 때 쓸 임시 값 제안: `{ src: "/videos/brand-intro-v01.mp4", poster: "/renewal/brand-film-v03.webp" }` → 확인 후 `undefined`로 되돌리고 `git diff lib/content-home.ts`로 증거를 남긴다.
3. AI 인플루언서 범위 — **반영**. 설명은 브랜드 전용 AI 가상인물 제작(캐릭터 시트·기준 이미지, 제품 이미지·9:16 숏폼)만, 계정 운영은 `scopeNote` 한 줄. 이미지 태그 `AI 가상인물 · 연출 예시`, alt `… · AI로 만든 가상인물`.

남은 결정(사용자):
4. 카드 이미지 — 지금은 AI로 만든 연출 이미지 6장(모두 `연출 예시` 표기). 고객 작품 공개 권리가 풀리면 실제 작업 스틸로 바꿀지.
5. 쇼릴 위 표기 — 쇼릴이 들어오면 `연출 예시` 태그는 사라진다. 쇼릴에 고객 작업이나 AI 가상인물 장면이 들어가면 별도 표기(`AI 가상인물` 등)가 필요한지.

## 검증
| 명령 | 결과 |
|---|---|
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-home.test.mjs` | 11/11 PASS (테스트 9는 작업 중 생긴 P4 `lib/home-journey.ts`의 컨텐츠 탭 line 6개가 `contentHomeServices.line`과 같음을 확인) |
| `npm run typecheck` | PASS (P4 진행 중 파일 포함 상태에서) |
| `npm run lint` | 오류 0, 기존 경고 1(`tests/local-admin.test.mjs:110 options`) |
| 전체 직렬 테스트 `tests/*.test.mjs` | NOT_RUN(지시: 자기 테스트 파일만) |
| `npm run build`(검토·기본 두 빌드) | NOT_RUN(지시: 빌드 금지, 검증 에이전트 몫) |
| `tests/seo-http.mjs`, `scripts/verify-reference-pages.mjs` | NOT_RUN(서버 필요) |
| Playwright 측정(타이포 계산값·좌측선·넘침·줄바꿈·캐러셀·reduced-motion·JS 끔·이미지 요청·고정 요소 겹침·캡처 `.qa/p3/`) | NOT_RUN 전부. 측정표 없음 |

검증 에이전트가 볼 점:
- 서브 내비·헤더 등 `.content-home` 안의 다른 요소에 대해 reduced-motion `transition-duration`이 `0s`가 아니라 `1e-05s`로 나올 수 있다. `review.css`의 `.guide-page * { transition-duration: 0.01ms !important }`가 `guide.css`의 `transition: none !important`보다 뒤에 와서 이기기 때문이다(이 페이지만의 문제가 아님, `!important`라 이 CSS에서 덮을 수 없음).
- 서비스 패널은 서비스마다 글 길이가 달라 탭을 바꾸면 아래(주석·제작 과정) 위치가 조금 움직인다. BRIEF는 제작 과정 패널에만 고정 높이를 요구해 그대로 둠.
- 고정 요소(`.floating-contact`·`.back-to-top`)와 390·360px 조작 줄 겹침은 실측 필요. 겹치면 `.ch-controls` 아래 여백을 늘린다.

## 소유 범위 밖 필요 변경
1. `lib/content-pricing.ts` 분리(BRIEF 범위 2): 소유 범위에 없어 `lib/content-home.ts`에 넣음. 서비스 상세 재작업 때 이 블록(가격 데이터·`formatWon`·`startingPrice`·`SHOW_STARTING_PRICE`, 웹툰+모션코믹 함께 제작 합계 17.5만·30만 포함)을 `lib/content-pricing.ts`로 옮기고 `lib/content-home.ts`가 import하게 하면 된다.
2. `lib/home-journey.ts`(P4 소유): 컨텐츠 탭 line 6개가 현재 같은 문자열을 복사해 둠. BRIEF "P4와 공유"대로 `contentHomeServices`의 `line`을 import하게 바꾸는 것은 P4 커밋 후 P4 담당이 할 일. 지금 문구 차이는 없음(테스트 9).
3. `components/guide/guide.css`의 `.guide-page …:focus-visible { outline: … !important }`: 보라 CTA 위 흰 외곽선을 정식으로 쓰려면 공유 CSS에서 `!important`를 빼거나 CTA 예외가 필요함. 지금은 box-shadow 흰 테로 대체.
4. 옛 문구 `브랜드 홍보 및 SNS 광고 영상`이 남은 위치: `components/guide/about.jsx:419`, `components/guide/main.jsx:39`, `components/guide/main.jsx:390`, `lib/guide-content.ts:23`, `lib/guide-content.ts:32`(main·about은 P4 담당이 수정 중일 수 있음).

## 미해결·후속
- `components/guide/studio-home.jsx`: 이제 import하는 곳 0. 삭제 여부는 사용자·조율자 결정(삭제하면 `scripts/restore-guide.py`의 `studio-home` 매핑도 함께 정리).
- `HomeReferences`는 이 페이지에서 쓰지 않음. 메인 사용 여부는 P4 범위.
- 쇼릴 도착 시 `contentHomeHero.video` 한 필드 교체만 필요.
