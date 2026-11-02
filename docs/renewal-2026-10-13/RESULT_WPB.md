# RESULT P2R WP-B — AI 인플루언서 · 모션그래픽 서비스 랜딩

2026-10-14 · 구현: Opus 서브에이전트(WP-B) · 기준 HEAD `c0ab7d9` · 커밋·push·배포·설치 없음 · `next build`/`dev`·브라우저 실행 안 함(지시)
(BRIEF_P2R 3-2의 결과 파일명은 `RESULT_P2R_B.md`지만 조율자 지시대로 `RESULT_WPB.md`로 썼다.)

**상태: 구현 완료. WP-B 파일 기준 typecheck·lint·테스트 PASS. 전체 직렬 테스트의 실패 2건은 다른 WP의 작업 중 파일(아래 5절)에서 났다. 빌드·브라우저 검사는 NOT_RUN(V 몫).**

## 1. 변경 파일 (모두 WP-B 소유 범위)
| 경로 | 내용 |
|---|---|
| `lib/content-site/services/ai-influencer.ts` | `aiInfluencerSignature`(히어로 인물 패널, 캐릭터 시트, AI 가상인물 표기 띠) 추가, `signature`에 연결. 나머지 카피는 WP0 초안(=명세) 그대로 |
| `lib/content-site/services/motion-graphics.ts` | `motionGraphicsSignature`(키네틱 타이포 문자열, 단순형·맞춤형 비교, 스타일 프레임) 추가, `signature`에 연결 |
| `components/content-site/services/ai-influencer/landing.tsx` | 히어로(7/12 문구 + 5/12 아치형 인물 카드, 87언니 이름 패널, `#sheet` 링크), Signature(캐릭터 시트 `#sheet`), BeforePricing(AI 가상인물 표기 띠). 서버 컴포넌트만 |
| `components/content-site/services/ai-influencer/ai-influencer.css` | 위 섹션 스타일. 루프 애니메이션 없음(인물 사진 중심의 정적인 화면) |
| `components/content-site/services/motion-graphics/landing.tsx` | 히어로(7/12 문구 + 5/12 기울어진 정사각 무대·키네틱 타이포), Signature 2개(단순형과 맞춤형 / 스타일 프레임 → 모션). 서버 컴포넌트만(client 섬 0) |
| `components/content-site/services/motion-graphics/motion-graphics.css` | 위 섹션 스타일, 루프(롱핸드만, reduced-motion no-preference 안), 사례 wide 레이아웃의 세로 소재 처리 |
| `components/content-site/services/motion-graphics/motion-graphics.keyframes.css` | **신규.** `@keyframes` 6개만(이름 `cs-svc-motion-graphics-*`). 분리한 이유는 7절 요청 1 |
| `public/content-site/ai-influencer/unnie87-*.webp` ×5 | **신규.** 87언니 기준·프로필 이미지 파생본(2절) |
| `tests/content-site-wpb.test.mjs` | **신규.** WP-B 전용 검사 5개(3절) |

공용 파일(theme.css·shell·ui·blocks·레지스트리·라우트·`tests/content-site.test.mjs`)과 다른 서비스·content-home·contact는 고치지 않았다.

## 2. 87언니 공개 자산 (결정 10-1 · 사용자 지시)
원본은 `I:\AIO_OS\01_WORK\05_MCN\02_AI 인플루언서\03_기록하는87\01_계정관리\02_브랜드·캐릭터자산\`의 `character`·`profile`에서 이미지 5장만 골랐다. 이미 있는 `node_modules/sharp`로 **크기만 줄여 webp로 저장**했다(가로 1080px 이하, q82, 메타데이터 제거, 새 생성·편집 없음). 계정 정보·ID 문서(`README.md`의 Elements/Soul ID, `01_계정정보·설정`)는 페이지·자산에 넣지 않았다.

| 공개 파일 | 원본 | 원본 SHA-256 | 공개본 SHA-256 | 크기 | 쓰는 곳 |
|---|---|---|---|---|---|
| `unnie87-face.webp` | `character/기준이미지/I03_얼굴후보_02_의장생성.png` | `e9c1464b…990a5e8` | `198a2b4d…6a46bc6` | 1080×1440 · 121,626B | 히어로 아치 카드(priority) |
| `unnie87-front.webp` | `profile/profile.png` | `ba1c9879…9319908` | `7718c9f1…634f2af` | 1080×1080 · 97,316B | 시트 `정면` |
| `unnie87-side.webp` | `character/soul_dataset/05.png` | `885595dd…735c56f` | `580dd17e…0133f3c6` | 1080×1446 · 119,034B | 시트 `측면` |
| `unnie87-full.webp` | `character/기준이미지/I03_전신후보_03_다리8퍼줄임.png` | `e50f7d33…c29411` | `9a87f6ef…714d20e0` | 1080×1440 · 44,856B | 시트 `전신` |
| `unnie87-street.webp` | `character/soul_dataset/14.png` | `1451206d…22b4bce0f9` | `37935143…a04cd5854` | 1080×1935 · 153,758B | 시트 `일상 장면` |

전체 SHA는 `tests/content-site-wpb.test.mjs` B-1에 있다(폴더에 이 5개만 있는지도 검사). 모든 87언니 이미지에 태그 `AI 가상인물 · 연출 예시`(`MEDIA_TAGS.aiPerson`)와 alt `… · AI로 만든 가상인물`을 달았다. 공개를 거둘 때는 `ai-influencer/landing.tsx` 상단 `ASSETS` 표와 데이터의 `87언니` 문구만 바꾸면 된다. 벤치마크 `creator.webp`는 이 페이지에서 쓰지 않는다(직접 만든 인물이 더 설득력 있어서).

## 3. 결정
1. **AI 인플루언서 히어로·시트에 87언니를 실제로 쓴다.** 명세 3-1·3-3(기본안: 87언니 비공개, `creator.webp`)보다 결정 10-1과 이번 사용자 지시가 우선한다. 87언니는 늘 `직접 만든 AI 가상인물` 라벨과 함께 보이고 계정·팔로워·게시·성과는 쓰지 않는다. 시트 아래 캡션으로 "고객이 받는 것은 브랜드와 함께 새로 정하는 전용 인물"임을 밝혔다.
2. 캐릭터 시트 4행은 명세 초안(일반 예시)을 87언니의 실제 설정(FACTS: 기준 이미지 20장, 뷰티 분야, 담백한 `~해요` 말투, 영상일기 콘셉트)으로 바꿨다. `87년생` 같은 숫자 표현은 카피 숫자 규칙 때문에 쓰지 않았다. `안티에이징`은 효과 암시를 피하려고 `뷰티`로만 썼다. 목소리·립싱크 언급 없음(말투는 `자막과 문구`로 한정).
3. 히어로 인물 이름 패널: ≥768은 사진 아래쪽(태그 위)에 겹치고, <768은 사진 아래로 내려 얼굴을 가리지 않는다. 아치 모양은 `border-radius: 50% 50% r-sm r-sm / 33.34% 33.34% r-sm r-sm`(2:3 카드에서 위쪽 반지름 = 폭의 50%).
4. AI 가상인물 표기 띠(BeforePricing): h3는 줄 길이 규칙(11자) 때문에 `AI 가상인물임을\n알립니다`로 나눴다. 칩 3개(`AI 가상인물 표기` · `광고 표기` · `플랫폼 합성 컨텐츠 설정`)는 FACTS '표시 의무' 그대로.
5. **모션그래픽 히어로는 명세의 6/6 대신 7/5.** h1 둘째 줄 `움직임을 더합니다`(9자)가 6열(1440에서 약 628px, 1024에서 약 449px)에 display 크기로 한 줄에 들어가지 않아 줄 수 규칙(데이터 `\n` + 1)이 깨진다. 7/5에서는 두 폭 모두 한 줄. 무대는 5열 폭(최대 600px)의 정사각, -5deg(<1024 -4deg, 폭 92%).
6. 키네틱 무대·비교 일러스트·스타일 프레임은 같은 장식 구도(`Composition`: 글자 두 줄 + 라임 원 + 보라 사각 + 글자 막대, 맞춤형은 둥근 캐릭터 실루엣 추가)를 `data-variant`(stage/still/moving)로 재사용한다. 모두 `aria-hidden`이고 옆에 `연출 예시` 태그. 글자 문자열은 데이터(`stage.title` = `frame.word`).
7. 움직임: 첫 프레임(`from`) = 정지 구도. `animation` 축약형을 쓰지 않는다(축약형은 `animation-play-state`를 running으로 되돌려 theme.css 움직임 토글을 무력화한다). 토글로 멈추면 `animation-name: none`으로 **정지 구도로 돌아간다**(theme의 기본 동작은 중간 프레임에서 멈춤). reduced-motion이면 루프 없음. 스타일 프레임 칸(still)은 원래 정지, 모션 적용 칸만 6초 왕복 + 12초 진행 막대.
8. 사례(검토 빌드만): AI 인플루언서는 사례가 3편이면 ≥1024에서 3열(`:has`, 없으면 공통 4열 유지). 모션그래픽 wide 레이아웃에서 세로(9:16) 소재는 카드를 16:9로 두고 영상을 `contain`(카드 안 9:16). 사례 선택·라벨(`87언니(AI 가상인물) 출연 · 제안용 시안`)은 공통 `works.server.ts` 게이트 그대로이며 이 WP 파일에는 고객 문자열이 없다. 현재 데이터 기준 매칭: AI 인플루언서 = `bwl-aqua-ad`·`bwl-cplus-ad`·`bwl-cleanser-ad`, 모션그래픽 = `bwl-brand-motion`·`healernet-motion`·`yofree-mg30`·`yofree-mg-short`(지시 목록과 같다).
9. 명시도: theme.css(`.cs-site .x` = 0,2,0)를 덮는 서비스 규칙은 클래스 3개 이상으로 써서 CSS 로드 순서에 기대지 않는다.

## 4. 카피 최종본 (signature 추가분, 나머지는 명세 초안 그대로)
**AI 인플루언서**
- 히어로 패널: `직접 만든 AI 가상인물` / `87언니` / `캐릭터 시트 보기 ↓`
- 시트: eyebrow `CHARACTER SHEET` · h2 `캐릭터 시트로\n인물을 고정합니다` · lead `한 번 정한 인물이 이미지와 영상에서 같은 얼굴로 나오도록 기준을 남깁니다`
- 이미지 라벨: `정면` · `측면` · `전신` · `일상 장면`
- 프로필: `직접 만든 AI 가상인물` / h3 `87언니` / `일상을 영상일기처럼 기록하는 뷰티 분야의 가상인물입니다.`
- 행: `외형 기준` — `기준 이미지 20장으로 얼굴과 헤어, 의상을 맞춥니다` · `말투` — `담백한 ‘~해요’ 말투로 자막과 문구를 씁니다` · `컨텐츠 톤` — `밝은 실내와 일상 장면을 영상일기처럼 담습니다` · `쓰지 않을 표현` — `제품 효과를 부풀리는 표현은 쓰지 않습니다`
- 캡션: `저희가 직접 만든 가상인물의 시트입니다. 브랜드 전용 인물은 브랜드와 함께 새로 정합니다.`
- 표기 띠: h3 `AI 가상인물임을\n알립니다` · `영상과 이미지에 AI 가상인물 표기를 함께 안내합니다. 광고로 쓸 때는 광고 표기도 함께 합니다.` · 칩 3개(3절 4)
- 계정 운영: 히어로 가격 칩 아래 한 줄 `계정 게시·운영 및 대량 제작은 별도 견적`(WP0 `hero.note`) + 가격 주석 원문 + FAQ 한 개. 다른 곳에는 쓰지 않았다.

**모션그래픽**
- 무대 글자: `움직이는\n메시지`
- 비교: eyebrow `COMPARE` · h2 `단순형과 맞춤형\n무엇이 다를까요` · lead `두 구성 모두 30초와 60초 중에서 길이를 고릅니다` · `단순형` — `로고와 이미지, 문구를 움직여 만듭니다.` · `맞춤형` — `브랜드 전용 캐릭터 제작이 포함됩니다. 캐릭터가 장면에 함께 등장합니다.` · `들어가는 요소`: `로고` `제품 이미지` `핵심 문구` (+ 맞춤형 `전용 캐릭터`, 강조 칩) · `가격 보기 ↓`
- 스타일 프레임: eyebrow `STYLE FRAME` · h2 `멈춘 화면을\n먼저 맞춥니다` · lead(명세) · `스타일 프레임` — `기획안에서 색과 배치를 확인합니다` · `모션 적용` — `확정한 화면에 움직임을 입힙니다`

**humanizer 점검(고친 것)**: 명세 시트 행 `분위기와 말투` → `말투`(87언니 설정에 맞춰 하나로), `브랜드에 맞는 말투와 표정의 범위를 적습니다` → 실제 설정 문장으로 교체. 캡션 `예시 설정입니다. 실제 시트는…` → `저희가 직접 만든 가상인물의 시트입니다. 브랜드 전용 인물은…`(무엇의 예시인지 분명하게). `AIO MAKE가 직접 만든…`은 영문 규칙(eyebrow·로고 외 라틴 금지) 때문에 `저희가`로. 번역투(`~을 통해`, `~에 대해`), `A가 아니라 B`, 쉼표절 꼬리, 근거 없는 숫자는 없다(테스트 3·5·B-2 통과).

## 5. 실행한 검증
- `npm run typecheck` → 첫 실행은 `lib/content-site/services/ad.ts`(WP-C 작업 중) 문법 오류로 실패 → WP-B 파일만 담은 tsconfig(작업트리 tsconfig 상속, 스크래치 폴더)로 `tsc -p` **PASS** → 이후 재실행한 전체 `npm run typecheck` **PASS**(출력 없음).
- `npm run lint` → `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110`). WP-B 파일만 `npx eslint …` → 0.
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-site.test.mjs tests/content-site-wpb.test.mjs`(다른 WP의 작업 중 데이터 파일을 HEAD로 둔 스크래치 사본) → `tests 17 · pass 15 · fail 0 · todo 2`(todo 2 = WP-D 몫 7-1·8-1).
- 전체 직렬 `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`(실제 작업트리) → `tests 80 · pass 75 · fail 2 · skipped 1 · todo 2`. 실패 2건은 WP-B 파일이 아니다:
  - `tests/content-home.test.mjs` 8(WP-D 작업 중 `content-home` 캐러셀 파일 주석의 `wheel|scroll-snap` 문자열)
  - `tests/content-site.test.mjs` 8 `style= 0`(WP-A `animation/landing.tsx`의 `data-style=` 속성이 `/style=/`에 걸림 — 테스트 정규식의 오탐일 가능성. 조율자 참고)
- 마지막 재실행(WP0FIX·WP-A 반영 후): 전체 `npm run typecheck` PASS, 전체 직렬 `tests 80 · pass 76 · fail 1 · skipped 1 · todo 2` — 남은 실패 1건은 위 `content-home.test.mjs` 8(WP-D). `content-site.test.mjs`·`content-site-grid.test.mjs`·`content-site-wpb.test.mjs`는 `tests 20 · pass 18 · fail 0 · todo 2`. WP0FIX의 격자 수정 후에도 WP-B의 `cs-col-7`+`cs-col-5` 조합은 그대로 맞다.
- `tests/content-site-wpb.test.mjs`(신규): B-1 87언니 자산 5개·SHA·랜딩 경로 일치 / B-2 사람 이미지마다 `aiPerson` 태그와 alt, 87언니 옆 `AI 가상인물` 라벨, 표기 칩, 별도 견적 한 줄, `#sheet` / B-3 두 랜딩 서버 전용·히어로 계약·priority ≤1 / B-4 축약형 `animation` 0, 애니메이션은 no-preference 블록 안만, 사용 키프레임 = 정의 키프레임, 토글 시 `animation-name: none` / B-5 장식 무대 `aria-hidden`·`연출 예시` 태그 3개·문자열 데이터 출처.

### NOT_RUN (V 몫, 지시로 실행 안 함)
`npm run build`(두 빌드), 서버·브라우저: 1440/1024/768/390/360 가로 넘침, 줄 수(h1 `\n`+1), 정렬(로고 left ±1px), 대비 실측(특히 라벤더 무대 위 `--cs-on-accent` 글자, AI 표기 띠 바탕 위 `--cs-fg-2`), reduced-motion·움직임 토글 실동작, LCP(히어로 87언니 이미지), 검토 빌드 사례 카드 표시, 누수 grep.

## 6. 공용 변경 요청 (WP0·조율자)
1. **`tests/content-site.test.mjs` 7번**: CSS 파서가 `@keyframes` 안의 `from`/`to`/`%` 단계를 일반 규칙으로 보고 "선택자는 `.cs-svc-<id>`로 시작" 검사에 걸린다. 서비스 CSS에 키프레임을 둘 수 없어 `motion-graphics.keyframes.css`로 분리했다(명세의 '서비스 CSS 한 파일' 규칙과 어긋남). 요청: `@keyframes` 내부 규칙은 건너뛰고 키프레임 이름이 `cs-svc-<id>-`로 시작하는지만 검사. 반영되면 WP-B가 두 파일을 합친다(WP-A·C의 루프에도 같은 문제가 있을 것).
2. **V 누수 grep 목록(BRIEF_P2R 9절)에서 `87언니` 제외**: 결정 10-1로 기본 빌드 AI 인플루언서 페이지 HTML에 `87언니`와 `/content-site/ai-influencer/unnie87-*.webp`가 나온다. 고객 쪽(`BWL`, `DR's Secret`, `닥터시크릿`, `bwl-`, 힐러넷·요프리 등)은 그대로 0이어야 한다. (`87언니(AI 가상인물) 출연 · 제안용 시안` 라벨은 여전히 검토 빌드에서만.)
3. (선택) `MEDIA_TAGS`에 자체 IP 인물용 태그(예: `ownAiPerson: "87언니 · AI 가상인물"`) 추가. 지금은 `AI 가상인물 · 연출 예시`를 쓰는데 87언니 기준 이미지는 '연출 예시'라기보다 실제 캐릭터 자산이다. 추가되면 WP-B가 랜딩 상수만 바꾼다.
4. (선택) theme.css 움직임 토글은 루프를 중간 프레임에서 멈춘다. 명세(모션그래픽 4-1)는 "일시정지 = 정지 구도"라 WP-B는 서비스 CSS에서 `animation-name: none`으로 처리했다. 다른 서비스도 같은 기대라면 공용 규칙으로 올릴 만하다.
5. (선택) `CsWorks` `wide` 레이아웃의 세로 소재(카드 안 9:16) 처리를 공용 블록으로 올리면 서비스 CSS 덮어쓰기가 필요 없다(브랜드 홍보 영상도 같은 사례 계열을 쓴다).

## 7. 열린 질문
1. 87언니 공개 이미지 5장(기준 얼굴·정면 프로필·측면·전신·거리 장면) 선택이 괜찮은가? 세면대 시험 이미지(T3)와 하이라이트·배너는 쓰지 않았다.
2. 시트의 87언니 설정 문구(뷰티 분야, `~해요` 말투, 영상일기 톤, 기준 이미지 20장)를 공개해도 되는가? 계정명 `기록하는87`과 계정 주소는 쓰지 않았다.
3. 가격 주석 `총 20장에 세팅용 이미지 포함. 주 이미지 5장·영상 1편 구성 가능.`(Q5)은 원문 그대로 둔다.
