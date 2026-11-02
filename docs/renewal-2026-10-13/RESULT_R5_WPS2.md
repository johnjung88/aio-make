# R5 WP-S2 결과 — AI 인플루언서 · 브랜드 홍보 영상 · SNS 광고 모션

2026-10-14 · 구현 담당 WP-S2(opus) · 미커밋 · 독립 검증(VERIFY_R5) 대기

## 요약

- 세 페이지는 이제 공개판에서도 계속 움직인다. 화면 밖에 있거나, 탭이 숨겨졌거나, 헤더 움직임 토글이 꺼졌거나, reduced-motion이면 멈춘다.
- 공용 훅은 WP-S1의 `useInViewPlay`를 그대로 import했다. 공용 파일은 고치지 않았다.
- 인라인 `style=`과 `autoPlay` 속성은 0개다. 서비스마다 client 섬은 1개다.
- 문단(소개·설명·캡션)에는 움직임을 주지 않았다.

## 페이지별 모션과 시간값

### AI 인플루언서 (`ai-influencer/creator-experience.tsx`, `ai-influencer.css`)

| 장면 | 동작 | 시간값 |
| --- | --- | --- |
| 히어로 3D 덱 | 카드 4장이 자동 회전한다. 앞 카드는 정면에 서고, 양옆 카드는 `translateX ±150px · translateZ −170px · rotateY ∓42° · scale .88 · brightness .62`로 물러난다. 뒤 카드는 `Z −300 · scale .72 · opacity .32`로 숨는다. 모바일 값은 ±104px, Z −95/−190, 38°다. | 4,000ms 간격. 전환은 transform 900ms `cubic-bezier(.22,1,.36,1)`, opacity·filter 700ms |
| 정지 | hover, focus(focusin), 터치(pointerenter/leave), 화면 밖, 숨김 탭, 움직임 끔에서 멈춘다(`useInViewPlay(root,{pauseOnInteract:true})`). 멈췄다가 다시 시작하면 4초를 처음부터 다시 잰다. | — |
| 조작 | 카드 클릭, 가로 스와이프(45px 이상이고 dx가 dy×1.2보다 클 때), 이름 버튼, ←/→/Home/End | — |
| 앞 카드 | 켄번스 효과로 scale 1→1.07에 살짝 이동한다. | 8s alternate |
| 피드 동기화 | 카드가 바뀔 때마다 그 계정의 피드 3컷이 `key` 교체로 새로 들어온다. 각 컷은 translateY 22px, scale .92, clip-path 24%에서 시작한다. | 700ms, 지연 260/380/500ms |
| 남은 시간 막대 | 120px 선이 다음 회전까지 남은 시간만큼 채워진다. 멈추면 처음으로 돌아간다. | 4,000ms linear |
| 계정 소개 피드 | 탭을 바꾸면 큰 화면이 먼저 들어온다(translateX 36px). 이어서 썸네일 3개가 순서대로 들어온다. 보이는 계정의 큰 화면은 다음 컷으로 자동 전환되고, 새 컷은 오른쪽에서 clip-path 와이프로 덮이며 scale 1.12→1로 자리 잡는다. 썸네일 아래 선은 남은 시간을 보여준다. | 와이프 950ms. 자동 넘김 3,600ms. 썸네일 지연 380/500/620ms |
| reduced-motion | 자동 넘김이 없고 카드 4장은 정적인 3D 배치로 모두 보인다. 피드 컷은 즉시 바뀐다. | — |

- 터치 영역(`orbit`, `feed-stage`)에는 `touch-action: pan-y`를 줬다. 이름 버튼, 계정 탭, 썸네일은 높이 44px 이상이다.

### 브랜드 홍보 영상 (`brand-film/film-timeline.tsx`, `landing.tsx`, `brand-film.css`)

| 장면 | 동작 | 시간값 |
| --- | --- | --- |
| 프레임 확대 | 공용 `MotionCanvas variant="brand-film"`의 스크롤 연동(`scale(.92→1)`, 모서리 28→0px)을 그대로 쓴다. | 스크롤 |
| 메인 영상(공개판) | `FilmScreen`은 35% 이상 보일 때만 `muted loop playsInline`으로 재생하고, 화면을 벗어나거나 탭이 숨겨지면 멈춘다. 아래 3px 진행선이 `currentTime/duration`을 따라간다. 44px 재생/정지 버튼이 있고, 사용자가 멈추면 다시 누를 때까지 자동 재생하지 않는다. | rAF |
| 검토판 히어로 | 지금처럼 서버가 고른 실제 작업물(`FeaturedWork` → 공용 `WorkPreview`, 보일 때 재생)을 보여준다. | — |
| 30초/60초 | 역할 6칸(도입, 핵심 메시지, 고객의 문제, 제품과 서비스, 일하는 방식, 마무리)이 항상 DOM에 있다. 버전을 바꿀 때마다 `flex-grow`, margin, padding이 다시 나뉜다. 켜진 칸은 `data-version`별로 이름이 다른 키프레임(seg-a/seg-b)을 받아서, 전환할 때마다 진입 애니메이션(translateY 16px, scaleX .55)이 다시 실행된다. | 너비 760ms. 진입 720ms, 지연 120/200/280/360/440ms |
| 재생 헤드 | 타임라인 미리보기 영상(공개판은 연출 예시, 검토판은 실제 작업물)의 `currentTime/duration`이 `--svc-playhead`로 들어가 헤드, 지나온 선, 현재 칸 강조를 움직인다. 영상이 없거나 `onError`가 나면 12초 루프 시계로 바뀐다. | rAF, 루프 12,000ms |
| reduced-motion | 자동 재생이 없다. 포스터와 재생 버튼으로 직접 볼 수 있다. 헤드는 0에 있고 칸은 모두 보인다. | — |

- 쓰이지 않던 `brand-film/film-control.tsx`는 grep으로 import가 0건임을 확인하고 삭제했다(`.qa/` 사본만 있음).

### SNS 광고 (`ad/ad-reel.tsx`, `landing.tsx`, `ad.css`)

| 장면 | 동작 | 시간값 |
| --- | --- | --- |
| 레일 | `if(!enabled)return children`을 지웠다. 공개판과 검토판 모두 3열 × 4칸 레일을 렌더한다. 무대 전체가 `rotate(-11deg)`로 기울고, 2열은 90px(모바일 50px) 내려 놓았다. | — |
| 왕복 | 1·3열은 위로(0 → −140px), 2열은 아래로(−140 → 0) 움직인다. 2열은 −4.5s, 3열은 −9s 위상차로 엇갈린다. 이동 거리는 모바일에서 90px이다. | 18s ease-in-out infinite alternate |
| 정지 | `useInViewPlay(root,{threshold:.2})`가 설정한 `data-play="paused"`와 `:focus-within`에서 멈춘다. | — |
| 가운데 화면 | 9:16 화면은 고정이다(레일 위 z-index 2). 공개판은 보일 때만 무음 반복 재생하고, 위쪽 진행 막대가 재생 위치를 따른다. 44px 재생/정지 버튼이 있다. 이미지 슬롯이 들어오면 켄번스로 재생한다. | 이미지 9s alternate |
| 검토판 | 가운데에는 서버가 고른 `bwl-aqua-ad`(`FeaturedWork`)가 온다. 레일은 실제 발췌 3장면과 서버가 고른 광고 작업물 포스터만 쓰고, 연출 예시와 섞지 않는다. 고객 경로·문자열은 서버 `landing.tsx`에만 있다. | — |
| 문구 카드 | 레일 12칸 중 3칸은 `adSignature.hook.frames[].screen` 문구 카드다(장식, aria-hidden). | — |
| 모바일 | 레일은 그대로 보인다. `.cs-svc-ad-reel`과 `.cs-svc-ad-rail`이 `overflow: clip`이라 무대 폭(150%)이 페이지 가로 스크롤을 만들지 않는다. | — |

## 소비한 연출 예시 슬롯(`lib/content-site/example-media.ts`, 읽기만 함)

| 슬롯 | 사용처 | 현재 상태 |
| --- | --- | --- |
| `brandfilm-main` | 브랜드 영상 히어로 `FilmScreen`과 타임라인 미리보기(공개판) | 있음(video) |
| `ad-rail-1`~`ad-rail-6` (`getExampleMedia("ad","rail")`) | 광고 레일 9칸(9개 미만이면 순환) | 6개 있음. 7~9는 추가하면 자동 반영 |
| `ad-center-1` | 광고 가운데 9:16 화면 | **없음** → `brandfilm-main` 영상을 세로로 잘라 쓴다(alt `SNS 광고 영상 연출 예시 · 무음`, 태그 `연출 예시 · 무음`) |
| `ai-card-1`~`ai-card-4` (`creatorRoster[].cardSlot`) | AI 덱 카드 | `ai-card-1`만 있고 이름 없는 다른 AI 인물이라 쓰지 않는다. 대신 계정 기준 초상(`/content-site/ai-influencer/*-portrait/face.webp`)을 쓴다 |

- AI 카드 교체 규칙: 슬롯이 **영상**이거나 **파일명에 계정 id**(`unnie87`·`yeopjip`·`grace`·`ssal`)가 들어 있으면 초상 대신 슬롯을 쓴다. 다른 인물 이미지가 계정 이름으로 잘못 붙는 일을 막기 위한 규칙이다.
- 슬롯 구도 `focus`는 `[x,y]` 배열과 문자열을 모두 받는다. ref로 `--svc-focus` 변수를 써서 `object-position`에 반영한다. 인라인 style은 쓰지 않는다.
- 공개판 광고 레일 태그: 슬롯 중 하나라도 `AI 가상인물 · 연출 예시` 라벨이면 레일 태그도 같은 문구를 쓴다(현재 `ad-rail-3` 때문에 해당).

## 공용 파일 변경 요청(WP-S1)

1. `example-media.ts`
   - `ad-center-1`(9:16 무음 5초 루프 영상과 포스터)을 추가한다.
   - `ad-rail-7`~`ad-rail-9`를 추가한다.
   - `ai-card-1`~`ai-card-4`를 계정별로 정의한다. 파일명에 계정 id를 넣어 `ai-card-unnie87.mp4`처럼 만든다. 지금 `ai-card-1`(`ai-creator.webp`)은 기록하는87이 아니므로 그대로 두면 카드에 쓰이지 않는다.
   - ASSET_REQUEST_R5에도 이 파일명 규칙을 적어 둔다.
2. `service-motion.css`
   - R4의 다음 규칙은 이제 아무 요소에도 적용되지 않는다. 클래스명을 서비스 전용(`cs-svc-*`)으로 옮겼기 때문이다. 이 파일은 WP-S1이 수정 중이라 행 번호 대신 선택자로 적는다.
     - `.cs-creator-*` 전부(키프레임 `cs-profile-enter` 포함)
     - `.cs-film-*` 전부(키프레임 `cs-segment-enter` 포함)
     - `.cs-ad-reel`·`.cs-ad-side-rail*` 전부(키프레임 `cs-ad-rail-left/right` 포함)
   - 위 규칙들을 정리해 달라.
   - 브랜드 영상 프레임 확대(`.cs-motion-canvas[data-motion-variant="brand-film"][data-motion-ready="true"]`)는 유지해야 한다. `tests/content-site-wps2.test.mjs` S2-2가 이 규칙을 검사한다.
3. `service-editorial.css`의 `.cs-svc-ai-influencer .cs-svc-ai-influencer-feed figure[...]` 두 줄은 R2 구조가 남은 것이다. 지금은 쓰이지 않으니 삭제해 달라.
4. (선택) `motion-runtime.tsx`의 `LoopVideo`에는 진행 콜백과 사용자 정지 버튼이 없다. 그래서 브랜드 영상과 광고 가운데 화면은 각 섬 안에서 같은 생명주기(보일 때 play, 사용자 정지 유지, rAF 진행값)를 직접 구현했다. 공용 `LoopVideo`가 `onProgress`와 정지 버튼을 지원하면 그쪽으로 합칠 수 있다.

## 테스트

담당 범위 테스트를 수정·추가했다.

- `tests/content-site-wpb.test.mjs` B-2(AI 표기·계정 소개)와 B-3(AI의 client 섬은 `creator-experience.tsx` 1개)을 R5 구조에 맞게 고쳤다. B-3의 모션그래픽 부분과 B-4는 WP-S1이 고쳤다.
- `tests/content-site-wps2.test.mjs`(신규)를 추가했다.
  - S2-0: client 섬 개수, FilmControl 삭제
  - S2-1: AI 자동 회전, 정지, 조작, 피드 순차 진입, pan-y, 44px
  - S2-2: 브랜드 영상 자동재생, 30/60 재배치, 재생 헤드
  - S2-3: 광고 공개판 레일, 18초 왕복, -11°, 가운데 고정, 모바일 clip

직렬 실행(`node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/<file>`) 결과, 2026-10-14 마지막 실행에서 전부 PASS다.

| 파일 | 결과 |
| --- | --- |
| content-site.test.mjs | pass 16 · fail 0 |
| content-site-wpb.test.mjs | pass 5 · fail 0 |
| content-site-wps2.test.mjs | pass 4 · fail 0 |
| 나머지 16개 tests/*.test.mjs(직렬 전체 실행) | 모두 fail 0 (content-home 18, wpa 8, home-journey 12, new-tab-links 6 …) |

- 담당 파일 범위 타입 검사: 임시 tsconfig로 `tsc -p`를 돌려 exit 0이었다. 임시 파일은 삭제했다.
- 담당 폴더 ESLint: exit 0.

## NOT_RUN

- `next build`, 서버 기동, 실제 브라우저의 시간차·스크롤 프레임 녹화는 하지 않았다. 지시에 따른 것이고, 독립 검증(VERIFY_R5) 담당이다.
- 그래서 다음 항목은 정적 검사로만 확인했다.
  - 화면 밖 정지
  - 모바일 실기기에서 스와이프와 세로 스크롤이 함께 동작하는지
  - 390px 폭에서 페이지 가로 스크롤 0
  - 브라우저별 `flex-grow` 전환과 keyframes 안 `var()`
- 레퍼런스 dist와의 항목별 점수 비교도 하지 않았다.
- 커밋, push, 배포, 유료 생성은 하지 않았다.

## 검증 때 볼 점

- AI 덱은 마우스가 히어로 위에 있으면 정지가 정상이다. 시간차 프레임은 포인터를 덱 밖에 두고 기록한다.
- 광고 레일은 hover로 멈추지 않는다(레퍼런스와 같다). 키보드 초점이 안에 있을 때만 멈춘다.
- 브랜드 영상 히어로 영상과 타임라인 미리보기는 같은 공개판 소재를 쓴다. 두 화면이 동시에 보이는 일은 드물지만, 둘 다 보이면 둘 다 재생된다.
