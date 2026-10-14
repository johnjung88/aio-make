# R5 WP-H 컨텐츠 홈(/content) 모션 결과

2026-10-14 · 구현 opus 서브에이전트 · 구현자 자체 검사만 했다(독립 검증 전) · 커밋하지 않았다

## 바꾼 파일

- `components/content-home/service-showcase.tsx`: 자동 넘김, 정지 조건, 카드 소재 슬롯, 선택 카드 영상과 켄번스
- `components/content-home/process-tabs.tsx`: 탭마다 순차 진입, 장면 루프, 슬롯 영상, `data-still`
- `components/content-home/hero-stage.tsx` (신규): 히어로 작품 묶음을 감싸는 client 섬. 화면 밖, 탭 숨김, 움직임 토글일 때 멈춘다
- `components/content-home/content-home.tsx`: 히어로에 패럴랙스·드리프트 층과 '연출 예시' 오버레이 표기를 넣고, 쇼릴 `data-slot`을 달았다
- `components/content-home/content-home.css`: 죽은 규칙을 지웠다(966줄 → 534줄). R5 모션을 넣었다
- `lib/content-home.ts`: `homeCardMedia`, `homeCarouselMotion`, `contentHomeHero.reelSlot`, 자동 넘김 버튼 문구를 추가했다. 과정 3단계 문구는 "한 번 수정해 마무리합니다"로 바꿨다(기존 테스트 12가 실패하던 부분)
- `tests/content-home.test.mjs`: 8-1을 갱신했고 8-2~8-5를 새로 넣었다

다른 WP 파일(`components/content-site/*`, `lib/content-site/*`, `components/home/*`, `public/content-examples/`)은 건드리지 않았다. `contentHomeServices`의 label·line·uses도 바꾸지 않았다(`lib/home-journey.ts`가 import한다).

## 무엇이 움직이나

| 위치 | 움직임 | 값 |
|---|---|---|
| 서비스 캐러셀 | 자동 넘김. 선택 카드는 앞으로 나오고 옆 카드는 회전하며 뒤로 물러난다 | 이미지 카드 3.5초, 영상 카드 5.2초 |
| 카드 배치(레퍼런스 `updateCarousel`) | translateX ±365px(태블릿 290, 모바일 212), translateZ −170/−340(모바일 −95/−190), rotateY ∓42deg, scale 1/.88/.72, opacity 1/.85/.55, blur 0/1/2.5px | transform .65s `cubic-bezier(.22,.75,.23,1)`, opacity·filter .5s |
| 맞은편 6번째 카드 | 가운데 카드 뒤로 물러나 사라졌다가 다음 차례에 뒤에서 옆으로 나온다(`data-pos="hidden"`) | translateZ −3.5×Z, scale .5, opacity .3s |
| 진행 막대 | 번호 아래 2px 막대가 차오르고, 다 차면 다음 카드로 넘어간다 | `cs-ch-autoplay` linear |
| 선택 카드 작품 | 영상이 있으면 그 카드에서만 muted·loop·playsInline으로 재생한다. 나머지 카드는 포스터만 보인다. 영상이 없으면 켄번스, 웹툰이면 세로로 읽어 내려가는 이동을 준다 | 켄번스 7s alternate, scale 1→1.08 |
| 히어로 '연출 예시' 이미지 | 바깥 층은 스크롤 패럴랙스(0→7%, `animation-timeline: scroll(root)`, 0~80vh), 안쪽 층은 느린 드리프트 | 드리프트 16s alternate, scale 1.05→1.1 |
| 히어로 웹툰 썸네일 | 컷을 위에서 아래로 읽는 이동 | object-position 12s alternate |
| 과정 01 상담 | 문서 진입 → 항목 3줄 순차 → 메모 진입 → 문서·메모가 계속 흔들린다 | .35/.47/.59s, 메모 .45s, 흔들림 6s·5s |
| 과정 02 기획 | 콘티 4장 순차 진입 → 장면 하이라이트가 01→04 순서로 돈다 → 각 장면 켄번스 | 진입 .12s 간격, 하이라이트 4.8s 주기(1.2s 간격) |
| 과정 03 제작 | 화면 진입 → 타임라인 진입 → 클립 4개가 순서대로 자란다 → 재생 헤드가 훑는다. 화면은 영상 재생 또는 켄번스 | .25s, .45~.75s, 헤드 5s |
| 과정 04 납품 | 파일 3개 순차 진입 → 확인 표시가 하나씩 튀어나온다 → 파일 묶음이 3D로 흔들린다 | .15s 간격, ✓ .55/.7/.85s, 흔들림 7s |

탭을 바꾸면 `.ch-making-art`가 `key={current}`로 다시 마운트되어 순차 진입이 처음부터 다시 재생된다. 문단 설명(탭 본문, 상세 설명)은 움직이지 않는다.

## 자동 넘김 정지 로직

타이머(setInterval/setTimeout)는 쓰지 않는다. 진행 막대의 CSS 애니메이션이 끝날 때 `onAnimationEnd`가 다음 카드로 넘긴다. 그래서 막대와 실제 넘김이 늘 같은 시점이다. 멈췄다가 다시 재생하면 남은 시간부터 이어진다.

```
moving  = inView(IntersectionObserver, document.hidden 포함) && 헤더 움직임 토글 on && !reduced
running = moving && !사용자멈춤 && !hover(mouse) && !키보드포커스(:focus-visible) && !터치중 && !상세(details) 열림
```

- 갤러리의 `data-autoplay`는 running / paused / off 중 하나다. paused면 `.ch-autoplay-fill`이 `animation-play-state: paused`가 된다
- 수동 조작(탭, 화살표, 옆 카드, 키보드, 스와이프)을 하면 `key={cycle}`로 막대를 다시 마운트해 타이머를 처음부터 시작한다
- 마우스로 누른 뒤 버튼에 포커스가 남아 있어도 멈추지 않는다. 키보드 포커스(`:focus-visible`)일 때만 멈춘다
- 서비스 상세 `details`를 열면 읽는 동안 넘기지 않는다. toggle 이벤트는 capture로 듣고, 카드가 바뀌면 다시 계산한다
- 자동 넘김 멈춤/재생 버튼(44px)을 화살표 왼쪽에 두었다(WCAG 2.2.2). 헤더 움직임 토글도 그대로 적용된다
- 자동 회전 중에는 스크린 리더 알림을 `aria-live="off"`로 끄고, 멈췄을 때만 `polite`로 알린다
- 영상: 선택 카드이면서 moving일 때만 `play()`를 호출한다. 선택이 바뀌거나 화면 밖, 숨김 탭, 토글, reduced-motion이면 `pause()`. 서버 HTML에는 autoplay 속성이 없다

## reduced-motion

- 자동 넘김을 하지 않는다(막대와 멈춤 버튼도 그리지 않는다). 영상도 자동재생하지 않고 포스터와 `controls`로 직접 재생한다
- 옆 카드를 숨기던 규칙(`display:none`)을 지웠다. 3D 배치는 보간 없이 그대로 정적으로 보인다
- 탭, 화살표, 키보드, 스와이프 조작은 그대로 된다
- 모든 transition과 animation은 `prefers-reduced-motion: no-preference` 안에서만 선언한다(테스트 8, 8-3)
- 헤더 움직임 토글로 멈추면 과정 장면이 진입 중간에 멈추지 않도록 `data-still="true"`가 `animation:none`으로 완성 장면을 보여준다

## 모바일

- `.ch-depth-stage`에 `touch-action: pan-y`를 둔다. 세로 스크롤은 브라우저가 처리한다. 가로로 45px 넘게, 세로보다 1.2배 이상 움직였을 때만 넘긴다. 스와이프 뒤에 생기는 클릭은 막는다. 터치 중에는 자동 넘김을 멈추고 `touchcancel`도 처리한다
- 누를 수 있는 곳은 모두 44px 이상이다: 히어로 형식 링크(`min-height:44px`로 바꿈), 상세 summary(바꿈), 탭, 화살표, 멈춤 버튼, `.cs-link`(공용 44px)

## 소재 슬롯(ASSET_REQUEST_R5와 같은 ID)

| 슬롯 ID | 위치 | 지금 값 | 교체 방법 |
|---|---|---|---|
| `home-card-webtoon` | `homeCardMedia.webtoon` | `/webtoon-v11/cut-01.webp`, 표기 `1억의 구단주 · 제작 예시` | `video: "/content-examples/home-card-webtoon.mp4"` 한 줄 |
| `home-card-animation` | `homeCardMedia.animation` | `/creative-v06/video-animation.webp` · 연출 예시 | 〃 |
| `home-card-ai-influencer` | `homeCardMedia["ai-influencer"]` | `/creative-v06/video-ai-influencer.webp` · AI 가상인물 · 연출 예시 | 〃 |
| `home-card-motion-graphics` | `homeCardMedia["motion-graphics"]` | `/renewal/video.webp` · 연출 예시. 과정 03 제작 화면도 이 슬롯 영상을 쓴다 | 〃 |
| `home-card-brand-film` | `homeCardMedia["brand-film"]` | `/creative-v06/video-brand-film.webp` · 연출 예시 | 〃 |
| `home-card-ad` | `homeCardMedia.ad` | `/creative-v06/video-sns-ad.webp` · 연출 예시 | 〃 |
| `home-hero-reel` | `contentHomeHero.reelSlot` / `contentHomeHero.video` | 비어 있다(테스트 10이 커밋 상태로 고정) | `video: { src, poster }` 한 줄 |

- 우선순위: 검토판(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`)에서 실제 작업물이 선택되면 그 작업물을 쓴다. 공개판에서는 슬롯을 쓴다. 슬롯에 영상이 있으면 영상, 없으면 poster 이미지(켄번스)다
- 카드 미디어에는 `data-slot`, `data-kind`가 붙는다. 쇼릴 래퍼에는 `data-slot="home-hero-reel"`이 붙어 브라우저 검증에서 찾을 수 있다
- poster를 새 이미지로 바꿀 때도 해당 줄의 `poster`만 고친다. 테스트 8-4는 poster와 video 파일이 실제로 있는지, video 경로가 `/content-examples/*.mp4` 형식인지 확인한다
- 참고: ASSET_REQUEST의 `home-hero-reel-mobile`(9:16)은 지금 코드에 연결할 자리가 없다. 쇼릴은 히어로 아래 16:9 슬롯이고 모바일 전용 소스 분기는 만들지 않았다. 필요하면 다음 차례에 `HeroVideo`에 `mobileSrc`를 추가한다

## 지운 CSS

다음 클래스는 `app`, `components`, `lib`, `tests`의 ts/tsx/js/mjs/css 어디에서도 쓰지 않는 것을 확인하고 지웠다.

`.ch-card*`, `.ch-carousel`, `.ch-stage`, `.ch-controls`, `.ch-counter`, `.ch-tabs`, `.ch-panel*`, `.ch-services-note`, `.ch-list`, `.ch-item*`, `.ch-media-tag`, `.ch-img`, `.ch-focus-*`, `.ch-toggle`, `.ch-step-*`, `.ch-process-layout/rows/row/name/result`, `.ch-work-*`, `.ch-comic-*`, `.ch-gallery-layout`, `.ch-hero-media/shade/tag/ghost/services`, `--ch-stage-h/--ch-card-w/--ch-card-h/--ch-shift/--ch-z1/--ch-z2`

모두 56개 클래스다. 쓰는 규칙은 순서와 값을 그대로 두었다. 수정 전 파일은 git `5ca205a`에 있다.

## 테스트

```
node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-home.test.mjs
ℹ tests 18 · pass 18 · fail 0
```

시작 전에는 14개 중 13개가 통과했다(12번 "한 번 수정" 문구 1개 실패). 새로 넣은 테스트는 다음과 같다.

- 8-2: 레퍼런스 수치, 진행 막대 시간과 데이터 값의 일치, 정지 조건 식 전체, 영상과 켄번스
- 8-3: reduced-motion 블록에 `display:none`과 animation이 없는지, no-preference 밖에 animation이 없는지, 죽은 클래스가 남지 않았는지, 44px
- 8-4: 슬롯 6개와 쇼릴 ID, 파일 존재, 표기
- 8-5: 히어로 패럴랙스·드리프트·연출 예시 표기, 과정 순차 지연·루프·정지

추가로 한 검사:

- PASS: 이 WP 파일만 포함한 임시 tsconfig로 `tsc --noEmit`을 돌렸다(오류 0, 임시 설정 파일은 지웠다)
- PASS: `git diff --check`

## NOT_RUN (검증 에이전트 몫)

- `next build`, lint, 전체 테스트 묶음, 서버 실행, 브라우저 검증. 지시대로 저사양 PC라 실행하지 않았다
- 시간차 프레임(0, 0.3, 0.6, 4초)에서 카드가 3.5초 뒤 자동으로 넘어가는지, hover·포커스·터치·details 열림·화면 밖·탭 숨김일 때 막대와 넘김이 멈추는지
- 중간 프레임의 3D matrix가 레퍼런스 `observed.json`의 carousel 샘플과 맞는지(같은 폭에서 녹화해 비교)
- 맞은편 카드가 가운데 뒤로 퇴장하는 모습이 어색하지 않은지(레퍼런스는 끝까지 가로질러 이동한다. 여기서는 잔상을 줄이려고 뒤로 물러나게 했다)
- 스크롤 패럴랙스는 `animation-timeline`을 지원하는 브라우저(Chromium, Safari 26 이상)에서만 동작한다. Firefox에서는 드리프트만 보인다
- 모바일 실기기에서 스와이프와 세로 스크롤이 함께 되는지, 390폭에서 가로 넘침이 0인지
- 영상 슬롯이 아직 비어 있다. 영상 카드 재생과 5.2초 체류는 사용자 소재가 도착한 뒤 확인한다
- 블러가 있는 옆 카드 5장의 3D 합성 성능(저사양 모바일 기준)
