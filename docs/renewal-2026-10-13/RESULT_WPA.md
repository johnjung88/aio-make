# RESULT P2R WP-A: 웹툰 + 애니메이션 서비스 랜딩

2026-10-14 · 구현: Opus 서브에이전트(WP-A) · 기준 HEAD `c0ab7d9`(WP0 커밋), 작업트리에 WP-B/C/D와 WP0FIX의 미커밋 변경이 함께 있는 상태에서 작업
커밋·push·배포·설치 없음. `next build`/`dev`·브라우저는 실행하지 않았다(지시).

**상태: 구현 완료.** typecheck PASS. lint 오류 0(경고 2개: 기존 `local-admin.test.mjs`, WP-D 진행 중 파일 `contact-flow.tsx`). `content-site.test.mjs`와 `content-site-wpa.test.mjs`는 20개 모두 통과. 전체 직렬 실행에서 실패 1건은 WP-D 진행 중인 `content-home.test.mjs` 8번이다(내 파일과 관계없음). build·브라우저 검사는 NOT_RUN(V 몫).

## 1. 변경 파일 (모두 WP-A 소유 범위)
| 경로 | 내용 |
|---|---|
| `lib/content-site/services/webtoon.ts` | `webtoonSignature`(표지·세로 리더·모션코믹 문구) 추가, `signature`에 연결. 초안 카피 일부 다듬음(4절) |
| `lib/content-site/services/animation.ts` | `animationSignature`(그림체·움직이기 전 확인 탭·CSS 그림 문구) 추가, FAQ 2개 추가, 카피 일부 다듬음 |
| `components/content-site/services/webtoon/landing.tsx` | 히어로(기울어진 《1억의 구단주》 표지 카드 + `웹툰 읽어보기 ↓`), 고유 섹션 ① 12컷 세로 리더 `#reader` ② 웹툰 + 모션코믹 묶음. 서버 컴포넌트만 씀(client 섬 0개) |
| `components/content-site/services/webtoon/webtoon.css` | 웹툰 고유 스타일 |
| `components/content-site/services/animation/landing.tsx` | 히어로(오른쪽 70% 캐릭터 장면 + 그라데이션 + 후광 원), 고유 섹션 ① 그림체 3종 ② 움직이기 전 확인 |
| `components/content-site/services/animation/before-motion.tsx` (신규, client) | 애니메이션 유일한 client 섬. APG 탭 3개 + CSS 그림 3종 |
| `components/content-site/services/animation/animation.css` | 애니메이션 고유 스타일 |
| `components/content-site/services/animation/animation.keyframes.css` (신규) | 후광 `@keyframes` 하나(5절 1번 사유, WP-B와 같은 방식) |
| `tests/content-site-wpa.test.mjs` (신규) | WP-A 전용 검사 8개(3절) |

공용 파일(theme.css·shell·ui·blocks·레지스트리·라우트·`content-site.test.mjs`)과 다른 서비스, content-home, contact 파일은 수정하지 않았다.

## 2. 구현 내용과 결정

### 웹툰 `/content/services/webtoon` (paper·보라)
섹션 순서: hero → types(공통) → **reader**(`--cs-bg-2`) → **motion comic**(`--cs-bg`) → works(검토 빌드만) → pricing → … → related.
1. **히어로**: `CsHero`(문구 7/12 + 미디어 5/12)에 표지 카드를 넣었다. `cut-01`을 2:3 카드로 보여주고 ≥1024에서 `rotate(6deg)`, 768~1023에서 폭 56%·4deg, <768에서 폭 72%·가운데·4deg를 쓴다. 그림자는 `0 30px 60px rgba(64,38,93,.18)`. 카드 아래쪽은 짙은 보라 그라데이션이고, 그 위에 `1억의 구단주`(`p.cs-t-h2`, 흰색 = `--cs-on-accent`)와 `웹툰 읽어보기 ↓`(→`#reader`)를 둔다. 태그는 `1억의 구단주 · 제작 예시`이고 `priority`는 이 이미지 하나뿐이다. 왼쪽 아래에는 옅은 원형 그라데이션(`--svc-glow`)을 깔았다. 작품명은 h2 의미가 없어 heading이 아닌 `p`로 두었다.
2. **세로 리더 `#reader`**: 왼쪽 5칸에 eyebrow·h2·lead와 칩 `12컷 한 회`, 안내 `화면 안을 내리면 다음 컷이 이어집니다`를 둔다. 오른쪽에는 휴대폰 틀(최대 폭 420px, 높이 720px, <768은 `70svh`·최소 420px, 8px 테두리, `--cs-r-lg`)을 두고 그 안에 `cut-01..12`를 간격 없이 세로로 이어 붙였다. 스크롤 영역은 `role="region"`, `tabIndex=0`, `aria-label="1억의 구단주 12컷 세로 보기"`이고 포커스 후 화살표 키로 스크롤된다. JS는 쓰지 않는다. 12컷 모두 장면을 설명하는 alt를 달았다. 실존 인물·상표 이름은 alt에 쓰지 않았다. 모든 컷은 `loading="lazy"`다.
   - **이미지 중복 요청 0**: 표지와 리더 첫 컷이 같은 `cut-01`이라 `sizes`를 같은 상수 `CUT_SIZES = "(max-width: 767px) 100vw, 440px"`로 맞췄다. 그래서 같은 `/_next/image` 주소를 받아 캐시가 재사용된다.
3. **웹툰 + 모션코믹**: `CsSectionHead` 아래 왼쪽 7칸에 `/videos/webtoon-reference-v02.mp4`를 둔다(16:9, `controls`, `preload="none"`, poster, `figcaption`). 태그는 `1억의 구단주 영상 · 제작 예시`이고, 조작 막대와 겹치지 않게 왼쪽 위로 옮겼다(5절 2번). 오른쪽 5칸에는 `웹툰과 함께 맡길 때` 묶음 카드 2개가 있다. 공통 `.cs-plan` 카드 모양을 쓰고 `함께 제작` 배지, 금액, `부가세 별도`, 분해 줄, `이 구성으로 상담 ↓`(`data-plan="bundle-N"` → 문의 폼 선택)을 넣었다. 분해 줄은 `웹툰 제작 12컷 10만 원 + 모션코믹 30초 7.5만 원` 형식이다. 그 아래 `모션코믹만 맡길 때`(30초 7.5만 원 / 60초 12만 원, 부가세 별도)와 주석을 붙였다. 금액은 모두 `pricingPlans("webtoon")`·`formatWon`으로 렌더하고 리터럴은 0개다. 테스트 A-1이 묶음 금액 = 웹툰 제작 + 모션코믹임을 확인한다(17.5만 = 10만 + 7.5만, 30만 = 18만 + 12만).
4. works는 `layout="webtoon"`(WP0 그대로)이고 기본 빌드에서는 렌더되지 않는다.

### 애니메이션 `/content/services/animation` (paper·살구)
섹션 순서: hero → types(공통) → **그림체**(`--cs-bg-2`) → **움직이기 전 확인**(`--cs-bg`) → works(검토 빌드만) → pricing → … → related.
1. **히어로**: `CsHero` 대신 같은 계약(`data-cs-section="hero"`, `aria-labelledby="cs-hero-title"`, `CsHeroCopy`)으로 직접 그렸다. ≥1024에서는 `content-site/animation.webp`가 섹션 오른쪽 70%를 꽉 채운다(`priority`, `sizes="(max-width: 1023px) 100vw, 70vw"`). 왼쪽은 `--cs-bg` → 72% → 투명으로 가는 가로 그라데이션이고 문구는 6칸에 둔다. <1024에서는 문구 다음에 장면이 오고(높이 `clamp(340px, 58svh, 640px)`, 위쪽 그라데이션), 태그 `연출 예시`는 오른쪽 아래에 둔다.
   - **후광 원**: 1px 흰 원(지름 `clamp(96px, 24%, 240px)`, ≥1024에서 240px)을 캐릭터 머리 근처에 둔다. `object-position` y를 머리 위치(28%)와 같게 잡아 화면 폭이 바뀌어도 머리가 장면 높이의 약 27%에 머물게 했다. 루프는 `scale 1→1.08` 4초 alternate(왕복 8초)이고 `prefers-reduced-motion: no-preference` 안에서만 돈다. 축약형이 `animation-play-state`를 되돌리므로 longhand로 선언했고, 그래서 헤더 움직임 토글(theme.css `data-motion="paused"`)로 멈춘다.
2. **그림체 (추가 고유 섹션)**: 애니메이션 페이지가 히어로 이미지 한 장에 기대지 않도록 연출 예시 3장을 그림체 카드로 보여준다. 카드는 `입체 캐릭터`(히어로와 같은 원본을 가까이 자른 것, 히어로와 같은 `sizes`라 중복 요청 0), `동화풍 장면`(`/creative-v06/video-animation.webp`), `포근한 질감`(`/renewal/animation-sample.webp`)이다. ≥768은 3열 4:5, <768은 3:2다. 모든 카드에 `연출 예시` 태그를 붙였다. 서비스 명세는 고유 섹션을 1~2개 허용하고, 6-3 공개 자산 목록 안의 이미지만 썼다.
3. **움직이기 전 확인** (`before-motion.tsx`, 유일한 client 섬):
   - 서버 HTML과 하이드레이션 전에는 세 항목(`이야기`·`캐릭터`·`장면 구성`)이 h3·본문·그림과 함께 세로 목록(`data-mode="list"`)으로 모두 보인다. JS가 없어도 내용이 다 나온다.
   - 마운트 후에는 APG 탭(`role=tablist/tab/tabpanel`, roving tabindex, ←/→/↑/↓·Home·End, 끝에서 순환)으로 바뀐다. 패널 높이는 세 항목을 같은 grid 칸에 겹쳐 가장 긴 것에 맞춘다. 보이지 않는 사본은 heading 없는 `div` + `aria-hidden` + `visibility:hidden`이다(P3 방식).
   - CSS 그림(`aria-hidden` + `연출 예시` 태그)은 세 가지다. 이야기는 한 문장 카드에 `시작·전개·마무리` 칩을 붙였다. 캐릭터는 원과 둥근 사각형으로 만든 정면·측면 실루엣에 점선 기준선을 그었다. 장면 구성은 16:9 콘티 칸 4개(`01~04`, `전체·인물·제품·마무리`)이고 칸마다 구도가 다르다. 그림 안 문구는 데이터(`animationSignature.beforeMotion`)에서 온다.
4. works는 `layout="vertical"`(WP0 그대로)이다.

### 공통으로 지킨 것
- 글자는 `.cs-t-*` 역할 클래스만 쓰고 서비스 CSS의 글자 속성 0, `!important` 0, `@media` 안 글자 속성 0이다. 텍스트 색은 `var(--cs-*)`만 쓰고, 장식색은 각 CSS 맨 위 `--svc-*` 블록에만 있다. theme.css 규칙을 덮을 때는 `.cs-svc-<id>` + 클래스 2개(0,3,0)를 썼다.
- 인라인 `style=` 0, `autoPlay` 0. 영상은 `preload="none"` + poster + `controls`다. heading 순서는 h1 → h2 → h3이고 고유 섹션은 모두 `data-cs-section="signature"` + `aria-labelledby`를 갖는다.
- 섹션 머리·리더 문구의 왼쪽 끝은 `.cs-container` 왼쪽(헤더 로고 왼쪽)과 같다. 의도적인 가운데 정렬 요소는 없다.
- 고객 데이터·고객 이름 0. 사례는 WP0의 `CsWorks`(검토 빌드 `=== "1"` 서버 선택)만 거친다.

## 3. 실행한 검증
- `npm run typecheck` → PASS(출력 없음).
- `npm run lint` → `0 errors, 2 warnings`(기존 `tests/local-admin.test.mjs:110`, WP-D 진행 중 `components/content-site/contact/contact-flow.tsx:99`). WP-A 파일에서 나온 경고는 0이다.
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-site-wpa.test.mjs tests/content-site.test.mjs` → `tests 20 · pass 20 · fail 0`.
- 전체 직렬 실행 `… tests/*.test.mjs` → `tests 88 · pass 86 · fail 1 · skipped 1`. 실패 1건은 `content-home.test.mjs` 8번(`/wheel|scroll-snap|setInterval|setTimeout/`, WP-D 진행 중 `components/content-home/*`)이고 skipped 1건은 기존 항목이다.
- 작업 중 1회 실패를 고쳤다: `content-site.test.mjs` 8번(`style=` grep)이 CSS 선택자 `[data-style="1"]`에 걸렸다. 속성 이름을 `data-look`으로 바꿨다.
- `tests/content-site-wpa.test.mjs` 검사 항목은 다음과 같다. A-1 묶음 합계 = 웹툰 + 모션코믹, 금액 리터럴 0. A-2 cut-01..12 존재, alt 12개 고유, 표지·리더 같은 sizes, `#reader`·region·tabIndex·lazy, priority 1개. A-3 모션코믹 영상 controls·preload none·poster·태그·figcaption. A-4 서버 랜딩, signature 섹션 2개씩, client 섬(웹툰 0·애니메이션 `before-motion.tsx` 1). A-5 탭 목록/탭 모드, APG 키, 사본 heading 0, 서버 데이터 import 0. A-6 애니메이션 미디어 태그·같은 sizes·자산 존재. A-7 후광 루프 no-preference 안, 축약형 0, 키프레임 이름 일치, 웹툰 루프 0. A-8 signature 객체 연결.

### NOT_RUN (V 몫)
`npm run build` 두 빌드, 서버·브라우저 검사가 남았다. 1440/1024/768/390/360 가로 넘침, 하이드레이션 경고, 탭 키보드 동작, 리더 스크롤·포커스, 후광 위치(머리 근처인지 실측), 움직임 토글 정지, reduced-motion, 대비 실측, LCP·CLS, `/_next/image` 중복 요청, 캡처와 소감을 확인해야 한다. 특히 **후광 원의 위치(left 54% / top 27%)와 표지 카드 하단 그라데이션 농도는 눈으로 확인한 값이 아니라 이미지 좌표로 계산한 값**이라 캡처로 확인이 필요하다.

## 4. 카피 최종본과 humanizer 점검
초안(BRIEF_P2R_SERVICES 1·2절, WP0 데이터)에서 바꾼 것:
| 위치 | 초안 | 최종 | 이유 |
|---|---|---|---|
| 웹툰 hero.lead | …원하시면 모션코믹 영상으로 이어갑니다 | …원하시면 모션코믹 영상까지 이어갑니다 | 웹툰 다음 단계라는 흐름이 드러나게 |
| 웹툰 hero.facts[0] | 12컷 · 24컷 | 12컷 · 24컷 한 회 | 단위를 분명히 |
| 웹툰 FAQ 4·모션코믹 주석 | 웹툰을 새로 그리는 비용은 따로입니다 | …비용은 별도입니다 | '따로입니다'로 끝나는 문장이 어색함 |
| 웹툰 scope.separate | 모션코믹 영상화(옵션 가격) | 모션코믹 영상화(옵션) | 군더더기 제거 |
| 애니메이션 hero.lead | …30초와 60초 애니메이션으로 완성합니다 | …30초나 60초 애니메이션으로 완성합니다 | 둘 중 하나를 고르는 구조 |
| 애니메이션 FAQ | (2개) | + `이미 있는 캐릭터로도 만들 수 있나요?` / `네. 캐릭터 원본 파일을 보내주시면 기획안에서 생김새와 움직임을 먼저 맞춥니다.` + `그림체는 어떻게 정하나요?` / `브랜드 분위기와 쓰일 곳을 듣고 기획안 단계에서 함께 정합니다. 참고하고 싶은 영상이 있으면 같이 보내주세요.` | 준비 자료(`기존 캐릭터 원본 파일`)·그림체 섹션과 짝 |

새 문구(signature):
- 웹툰 표지: `1억의 구단주` / `웹툰 읽어보기`
- 리더: `READ` / `12컷 한 회를\n직접 읽어보세요` / `《1억의 구단주》 1회 12컷입니다. 컷마다 완성 이미지 1장으로 셉니다.` / 칩 `12컷 한 회` / `화면 안을 내리면 다음 컷이 이어집니다`
- 모션코믹: `MOTION COMIC` / `완성한 웹툰을\n영상으로 잇습니다` / `모션코믹은 완성한 웹툰을 움직이는 영상으로 바꾸는 작업입니다` / 영상 이름 `《1억의 구단주》 소개 영상` / 설명 `직접 그린 웹툰 《1억의 구단주》 소개 영상` / `웹툰과 함께 맡길 때` / `모션코믹만 맡길 때` / `기존 웹툰을 영상화하는 가격입니다. 웹툰을 새로 그리는 비용은 별도입니다.`
- 그림체: `STYLE` / `브랜드에 맞는\n그림체를 고릅니다` / `기획안 단계에서 캐릭터와 배경의 그림체를 함께 정합니다` / `입체 캐릭터` `둥근 형태와 매끈한 재질로 친근한 인상을 만듭니다.` / `동화풍 장면` `빛과 날씨를 살린 배경으로 이야기의 분위기를 잡습니다.` / `포근한 질감` `털과 천의 결을 살려 따뜻한 느낌을 줍니다.`
- 움직이기 전 확인: `BEFORE MOTION` / `움직이기 전에\n장면을 맞춥니다` / lead·탭 3개 본문은 명세 그대로 / 탭 이름 `움직이기 전에 확인하는 것` / 그림 문구 `한 문장 이야기`, `작은 캐릭터가 새 제품을 만나 하루가 달라집니다`, `시작·전개·마무리`, `정면·측면`, `전체·인물·제품·마무리`

점검: 번역투(`~을 통해`·`~에 대해`) 0, `A가 아니라 B` 0, 한 문장 쉼표 ≤1, 문장 끝 쉼표절 0, 숫자는 허용 목록과 금액만, 영문은 eyebrow만이다. 근거 없는 성과·기간·납품 규격 표현도 없다. 영상 설명은 이 영상이 모션코믹이라고 단정하지 않고 '소개 영상'으로만 썼다(Q8).

## 5. 공용 변경 요청 (WP0 소유라 고치지 않음)
1. **`tests/content-site.test.mjs` 7번 CSS 파서**: `@keyframes` 안의 `from`/`to`/`%` 블록을 선택자로 읽어 '서비스 선택자는 `.cs-svc-<id>`로 시작' 검사에 걸린다. 그래서 키프레임을 `<id>.css`에 둘 수 없다. 파서가 `@keyframes` 본문을 건너뛰게 고쳐 달라(WP-B도 같은 요청). 고친 뒤 `animation.keyframes.css`를 `animation.css`에 합치고 `content-site-wpa.test.mjs` A-7의 파일 경로만 바꾸면 된다.
2. **`controls` 영상의 태그 위치**(`ui/media.tsx`·theme.css): 태그를 왼쪽 아래 12px에 두면 브라우저 영상 조작 막대와 겹쳐 재생 막대 클릭을 가린다. 공용 규칙으로 `.cs-site .cs-media:has(> video[controls]) > .cs-tag { top: 12px; bottom: auto }`를 제안한다. `CsWorks`의 영상 카드도 같은 문제가 있다. 웹툰은 서비스 CSS로 임시 처리했다.
3. **영상 자막**: `CsMedia`에 `<track kind="captions">`를 넣는 prop이 없다. `webtoon-reference-v02.mp4`에 음성·대사가 있는지 확인하지 못했고 VTT 파일도 없다. 자막이 필요한 영상이면 prop 추가와 자막 파일이 필요하다(지금은 aria-label + figcaption으로 대신함).
4. **paper 서비스의 `--cs-bg-2`**: 웹툰은 `--cs-bg`만 라벤더(#F1ECF6)로 바뀌고 `--cs-bg-2`는 기본 베이지(#EEE8E0)로 남는다. 그래서 리더·가격·FAQ·관련 서비스 섹션이 라벤더와 베이지 사이를 오가 색감이 섞인다. 애니메이션은 두 색이 가까워 덜 두드러진다. 서비스별 `--cs-bg-2`를 제안한다. 예: 웹툰 `#E9E1F1`, 애니메이션 `#EFE2CF`, AI 인플루언서도 같은 방식. V 대비 실측과 함께 WP0가 정하면 된다.
5. (확인) 리더의 `cs-col-6 cs-col-start-7` 배치는 WP0FIX의 열 유틸 수정(`grid-column: var(--cs-col-start) / var(--cs-col-end)`, VERIFY_G0 WP0-1)을 전제로 한다. 작업트리에는 이미 반영돼 있고 함께 커밋돼야 한다.

## 6. 열린 질문
1. **《1억의 구단주》 공개 노출 권리**: 컷 3~12에 FIFA 월드컵 중계 화면, 실존 축구 구단의 엠블럼·이름(선덜랜드, 렉섬, 리버풀, 토트넘), 'Football Manager' 화면이 나온다. 컷 8~9에는 렉섬을 인수한 실존 배우 두 사람으로 보이는 인물도 있다. 광고 유입 랜딩에서 상업적 제작 예시로 쓰면 초상·상표 문제가 생길 수 있다. 사용자 지시대로 그대로 썼지만(alt에는 실명·상표 없음) 공개 전에 한 번 확인을 권한다.
2. **Q8 모션코믹 예시 영상**: poster가 로고 엔드카드(`웹툰 제작 문의`)라 첫 화면에서 웹툰 내용이 보이지 않는다. 이 영상이 모션코믹 품질을 대표하는지, 더 나은 poster 프레임(영상 속 컷 장면)이 있는지 확인이 필요하다. 신규 이미지 생성 금지라 poster는 바꾸지 않았다.
3. **애니메이션 그림체 섹션**: `creative-v06/video-animation.webp`·`renewal/animation-sample.webp`는 메인 사이트 다른 곳에서도 쓰이는 AIO 생성 이미지다(6-3 공개 자산). '기존 페이지와 전혀 다르게'라는 방향과 겹친다고 보면 이 섹션을 빼거나 이미지를 바꿀 수 있다. 데이터 3항목과 `STYLE_MEDIA` 상수만 고치면 된다.
4. 웹툰 24컷 예시: `public/webtoon-v11/cut-13..24`도 있지만 지시대로 12컷만 썼다. 24컷 플랜을 보여주는 장치(예: `24컷 이어 읽기` 토글)가 필요하면 알려 달라.
