# R5 WP-S1 결과 · 웹툰·애니메이션·모션그래픽 + 공용 모션·연출 예시 소재

2026-10-14 · 구현 담당 WP-S1(opus) · 코드 동결 · 미커밋 · 독립 검증 대기

## 1. 요약

- 공개판에서도 세 페이지가 계속 움직인다. 고객 레퍼런스(공개 권리 HOLD)는 렌더하지 않고, AIO가 직접 만든 이미지에 `연출 예시` 표기를 붙여 채운다. 검토판은 서버가 고른 실제 작품을 먼저 쓴다
- 소재 슬롯은 `lib/content-site/example-media.ts` 한 곳에 있다. 사용자가 Higgsfield로 만든 이미지·5초 영상을 받으면 슬롯의 `src`(영상은 `poster`도) 한 줄만 바꾸면 된다
- 공용 정지 계약은 `[data-play="paused"]`다. WP-S2가 재사용할 수 있게 `useInViewPlay`·`useAutoCycle`·`LoopVideo` 훅과 컴포넌트를 공개했다(5절). WP-S2는 이미 `useInViewPlay`를 쓰고 있다
- 자동 검토 지적 사항(고객 정보가 client 번들에 들어가는 문제)을 서버 분기로 고치고 테스트를 추가했다(2절)

## 2. 보안 지적 사항과 수정

**지적**: R4 `components/content-site/services/scene-sequence.tsx`는 `"use client"` 파일이다. 그런데 이 파일 안에 고객 작품 slug 3개(`bwl-brand-motion`·`bwl-aqua-ad`·`yofree-night-motion`)와 발췌 시점 표가 있었고, `/reference-review/r3-scenes/${slug}/…` 경로도 이 파일에서 조립했다. 공개판 렌더 여부와 상관없이 고객 slug와 경로 패턴이 client 번들에 실렸다. 기존 테스트 6(`client customer string`)도 이 파일에서 FAIL이었다.

**수정**
- `scene-sequence.tsx`(client)는 이미 계산된 `scenes: SceneFrame[]`(src·alt·크기·시점 문자열)만 받는다. slug prop, 고객 표, 경로 조립 코드를 모두 지웠다. 요소 id는 `useId()`로 만든다
- `work-sequence.tsx`(서버)는 첫 줄에 `import "server-only"`를 두었다. 고객 slug→시점 표(`REVIEW_SCENES`)는 이 파일에만 있다. 장면 목록은 `works.server.ts`가 고른 `work`가 있을 때만 만든다. 이 `work`는 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"`일 때만 존재한다
- 공개판에서는 `work`가 `undefined`다. 그래서 고객 문자열은 하나도 만들지 않고 `getExampleMedia(service, "scene")` 슬롯만 client로 넘긴다
- 모션그래픽 live 구성의 이미지도 같은 방식이다. 검토판에서는 서버가 작품 포스터를 넘기고, 공개판에서는 `motion-scene-2` 슬롯을 넘긴다
- 테스트: `tests/content-site-wps1.test.mjs`
  - S1-1: client 섬에 고객 문자열·`/reference-review`·slug prop이 없는지, 서버 분기 구조, services 아래 모든 client 파일, 예시 데이터·매니페스트를 검사한다
  - S1-2: 플래그를 끈 자식 프로세스에서 세 서비스의 선택 작품이 0개인지 확인한다
- 남은 확인: 실제 공개판 빌드의 client chunk와 렌더 HTML에 고객 문자열이 없는지는 검증 담당이 격리 빌드로 확인한다(NOT_RUN)

## 3. 연출 예시 슬롯

출처 원칙
- `aio-service-pages-v01/dist/assets`의 생성 이미지 5종과 무음 모션 1개만 복사했다
- 원본은 `new-chat/outputs/aio-content-v01`이다. 내장 image_gen으로 만들었고 프롬프트는 `IMAGE_PROMPTS.json`에 있다
- 세 경로의 SHA-256이 같은지 확인했다
- 제외한 것: `service-benchmark-v01/captures`(타사 사이트 캡처), favicon(로고), 글꼴, `qa/` 화면 캡처
- 매니페스트(`public/content-examples/MANIFEST.json`)에는 경로, sha256, 원본·출처 sha, 생성 방식, 프롬프트 참조, 인물 여부를 기록했다
- 웹툰 컷은 저장소에 이미 있는 자체 IP 《1억의 구단주》(`/webtoon-v11/cut-NN.webp`)를 그대로 가리킨다
- `animation-scene-2`·`-3`은 기본 빌드에 이미 쓰던 공개 자산(`BRIEF_P2R.md:261` 허용 목록)을 가리킨다

| 슬롯 ID | 종류·비율 | 파일 | 출처(원본 키) | 표기 |
| --- | --- | --- | --- | --- |
| webtoon-cut-1 … webtoon-cut-12 | 이미지 2x3 | /webtoon-v11/cut-01 … cut-12.webp | 자체 웹툰(기존 자산) | 1억의 구단주 · 제작 예시 |
| webtoon-key-1 | 이미지 2x3 | /content-examples/webtoon/webtoon-key.webp | image_gen `webtoon` | 연출 예시 |
| animation-hero-1 | 이미지 2x3 | /content-examples/animation/animation-character.webp | image_gen `animation` | 연출 예시 |
| animation-scene-1 | 이미지 16x9 | /content-examples/animation/animation-character.webp | image_gen `animation` | 연출 예시 |
| animation-scene-2 | 이미지 16x9 | /creative-v06/video-animation.webp | 기존 공개 자산 | 연출 예시 |
| animation-scene-3 | 이미지 16x9 | /renewal/animation-sample.webp | 기존 공개 자산 | 연출 예시 |
| motion-bg-1 | 이미지 16x9 | /content-examples/motion-graphics/motion-ribbon.webp | image_gen `hero` | 연출 예시 |
| motion-hero-1 | 이미지 16x9 | 같은 파일 | image_gen `hero` | 연출 예시 |
| motion-scene-1, motion-scene-3 | 이미지 16x9 | 같은 파일(구도만 다름) | image_gen `hero` | 연출 예시 |
| motion-scene-2 | 이미지 16x9 | /content-examples/motion-graphics/motion-product.webp | image_gen `brand` | 연출 예시 |
| ai-card-1 | 이미지 2x3 | /content-examples/ai-influencer/ai-creator.webp | image_gen `creator` | AI 가상인물 · 연출 예시 |
| brandfilm-main | 영상 16x9 + poster | /content-examples/brand-film/brandfilm-motion.mp4, brandfilm-poster.webp | hero 생성 이미지 12초 무음 모션 | 연출 예시 · 무음 |
| ad-rail-1 | 이미지 9x16 | /content-examples/ad/ad-product.webp | image_gen `brand` | 연출 예시 |
| ad-rail-2, ad-rail-6 | 이미지 9x16 | /content-examples/ad/ad-ribbon.webp | image_gen `hero` | 연출 예시 |
| ad-rail-3 | 이미지 9x16 | /content-examples/ad/ad-creator.webp | image_gen `creator` | AI 가상인물 · 연출 예시 |
| ad-rail-4 | 이미지 9x16 | /content-examples/ad/ad-character.webp | image_gen `animation` | 연출 예시 |
| ad-rail-5 | 이미지 9x16 | /content-examples/ad/ad-webtoon.webp | image_gen `webtoon` | 연출 예시 |

API(순수 데이터, React·env 없음, 고객 문자열 없음)
- `getExampleMedia(service, section?) → ExampleSlot[]`: 정의 순서를 유지한다
- `getSlot(id) → ExampleSlot`: 없는 ID를 넘기면 오류를 낸다
- `focusData(slot.focus) → { "data-fx", "data-fy" }`: object-position을 10 단위로 나눈 값이다. 인라인 style을 금지하는 테스트 8 규칙 때문에 `service-motion.css`의 `img[data-fx]` 규칙으로 적용한다
- 슬롯 필드는 `id, service, section, kind, src, poster?, alt, label, aspect, width, height, focus?`다
- 같은 원본을 여러 슬롯에서 재사용한 곳이 있다. 사용자 소재가 오면 슬롯별로 각각 바꿀 수 있다

## 4. 페이지별 움직임과 시간값

### 웹툰
- 히어로 3컷 부채
  - 스크롤 진행값(`--cs-motion-progress`)에 따라 벌어진다
  - 컷마다 다른 박자로 떠오른다(`cs-float`, 5.6·6.4·7.2초, 지연 0·−2·−4초, `translate` 루프)
  - 화면 밖에서는 멈춘다
- ① 스크롤 컷 펼침(신규 섹션)
  - sticky 고정 구간: 데스크톱 230vh, 모바일 190vh
  - `--cs-pin-progress`를 컷별 국소 진행값으로 나눈다. 컷 i는 `clamp(0,(p−0.1i)×2.3,1)`이고, 다섯 컷이 0→0.45 … 0.4→0.85 구간에서 차례로 펼쳐진다
  - 쌓인 상태(translateZ −260px, 회전 ±5°)에서 펼친 상태(가로 102% 간격, rotateY ±16°, 가운데 컷 +68px 앞)로 바뀐다
  - 움직임이 꺼지면 펼친 상태만 정적으로 보여준다
- ② 12컷 3D 페이지 넘김 리더
  - 왼쪽 책등(`transform-origin: left center`)을 기준으로 `rotateY(0→−180deg)` 900ms `cubic-bezier(.645,.045,.355,1)`로 넘어간다. 원근은 `perspective 2200px`다
  - 앞면과 뒷면에 `backface-visibility: hidden`을 줬다. 뒷면은 종이 바탕에 쪽 번호를 넣었다
  - 넘어가는 면 위로 그라디언트 그림자가 지나간다(`cs-svc-webtoon-sweep`, 900ms, background-position 100%→0%). 아래 페이지에는 그림자가 드리웠다가 사라진다(`cs-svc-webtoon-cast`)
  - 조작: 이전·다음 버튼(48px), 방향키·Home·End, 스와이프(가로 40px 이상이면서 세로 이동보다 1.2배 클 때)
  - 무대는 `touch-action: pan-y`라 세로 스크롤이 막히지 않는다
  - 진행선은 `scaleX` 500ms로 움직인다. 12컷 전체 이어 읽기는 유지했다
- 모션코믹 영상 섹션은 바꾸지 않았다

### 애니메이션
- 공개판에서도 3장면 전환이 렌더된다(`animation-scene-1..3`)
- 데스크톱
  - 고정 구간 270vh에서 스크롤 진행 0~1을 장면 3개로 나눈다
  - 탭으로 장면을 고른 뒤에도 다음 구간에 들어가면 스크롤이 다시 장면을 바꾼다
- 모바일: 보이는 동안 3.4초마다 다음 장면으로 넘어간다. 터치·hover·focus 중에는 멈추고, 직접 고르면 자동 순환을 끝낸다. 스와이프로도 넘길 수 있다
- 전환 효과
  - 들어오는 장면: translateZ 180px·scale 1.12에서 0으로 오고, clip-path가 오른쪽에서 왼쪽으로 열린다(크로스컷 와이프)
  - 지나간 장면: translateZ −320px·scale .82·rotateY 12°로 물러난다
  - 시간값: transform 1000ms, clip-path 850ms, opacity 600ms. 빛줄기 와이프 850ms
  - 장면을 바꿀 때마다 와이프를 다시 시작한다. 활성 이미지는 7초 왕복 드리프트(scale 1→1.08)를 한다
- 히어로: 연출 예시 이미지에 14초 켄번스를 주고, 숨 쉬는 링(8초)과 점프하는 점(2.6초)을 얹었다
- 영상 슬롯을 쓰는 경우 `LoopVideo`는 보이는 동안에만 muted·loop로 재생한다
- `animation/before-motion.tsx`는 어디서도 import하지 않는 것을 grep으로 확인하고 삭제했다(작업트리 삭제, 미스테이징)

### 모션그래픽
- live 구성(`type-composition.tsx`)
  - 도형 6개가 서로 다른 루프로 계속 움직인다
    - ring 9초 회전, arc 12초 역회전, disc 7초 드리프트(−2초)
    - square 5초 텀블(−1초), bar 3.2초 늘어남(−0.6초), dot 2.4초 바운스(−1.2초)
  - 글자 한 자씩 5.4초 루프로 아래에서 올라와 머물렀다가 위로 사라진다. 지연은 단어×220ms + 글자×70ms다
  - 배경 이미지는 16초 팬을 반복한다
- 배치 전환
  - 버튼 3개로 배치를 고르고, 보이는 동안에는 4.2초마다 자동으로 넘어간다. 버튼을 누르면 자동 넘김을 멈춘다
  - 배치가 바뀌면 도형과 글자가 같은 배치 변수(`--tx`·`--ty`·`--ts`)로 함께 이동한다(left·top·scale·rotate 900ms)
  - 글자 키프레임 이름이 a·b·c로 바뀌어 진입 스태거가 처음부터 다시 시작된다
- 장면 전환: 공개판에서도 렌더된다(`motion-scene-1..3`). 세로 와이프와 깊이 이동을 쓴다
- 히어로: 연출 예시 이미지에 켄번스, 회전 링(10초), 떠다니는 원(6초)을 얹었다

### 공통
- 문단(`cs-t-body/lead/small`)은 움직이지 않는다. 움직이는 것은 제목 줄, 이미지, 도형, 장식 글자뿐이다(S1-6 검사)
- 제목 줄 지연은 CSS `nth-child`(110·220ms)로 옮겼다. 인라인 style을 0으로 만들기 위해서다
- 탭 대상은 장면 화살표·리더 버튼 48px, 장면 탭 64px, 구성 버튼 44px 이상이다
- reduced-motion·움직임 끔
  - 고정 구간과 자동 순환을 끄고, 키프레임과 전환은 no-preference 안에서만 선언했다
  - 작품은 모두 보이고 탭·버튼·방향키로 즉시 바꿀 수 있다

## 5. 공용 훅 API(WP-S2 재사용)

`components/content-site/services/motion-runtime.tsx`(client)

```ts
useInViewPlay(ref, { threshold = .15, rootMargin = "0px", pauseOnInteract = false }?) => boolean
```
- 화면 안 + `!document.hidden` + 헤더 움직임 토글 on + reduced-motion 아님일 때 true다
- 노드에 `data-play="running" | "paused"`를 기록한다. CSS가 `[data-play="paused"]` 안의 모든 루프를 멈춘다
- `pauseOnInteract`를 켜면 pointerenter·focusin 동안 멈춘다

```ts
useAutoCycle(count, intervalMs, playing) => [index, select(next, stop = true), stopped]
```
- playing일 때만 넘긴다. `select`를 부르면 자동 넘김을 영구 정지한다

```ts
useMotionProgress(ref, onProgress?, { mode: "pass" | "pin" }?)
```
- `pass`: `--cs-motion-progress`(화면 통과 진행)와 `--cs-motion-shift`를 기록한다
- `pin`: `--cs-pin-progress`(부모 높이 동안 sticky 고정 구간의 0→1)를 기록한다
- 노드에 `data-motion-ready`·`data-in-view`·`data-entered`·`data-play`를 기록한다. 움직임이 꺼지면 pass는 0.5, pin은 1로 고정한다

컴포넌트
- `<LoopVideo src poster label className?/>`: 장식·예시용 무음 반복 영상. 보이는 동안(35%)만 play한다
- `<WorkPreview/>`: 기존 그대로
- `<MotionCanvas/>`·`<MotionTitle/>`: 기존 그대로, 인라인 style을 제거했다

서버 컴포넌트(`service-hero.tsx`)
- `<ExampleFigure slot sizes priority? className?/>`: 슬롯 하나를 켄번스 이미지나 LoopVideo로 렌더하고 slot.label 태그를 붙인다

장면 전환(`work-sequence.tsx`)
- `<WorkSequence work labels portrait? service? exampleLabels?/>`
- `service`를 넘기면 공개판에서 `<service>-scene-1..3` 슬롯으로 렌더한다. 생략하면 예전처럼 null이다

WP-S2 참고
- ad는 현재 `service`를 넘기지 않고 `ad-scene-*` 슬롯도 없어서 공개판 장면 전환이 null이다. 필요하면 슬롯 추가를 WP-S1에 요청한다
- `service-motion.css`의 WP-S2 구역(creator·film·ad)에는 R4의 축약형 `animation:` 규칙이 남아 있다. 공용 정지 규칙의 명시도를 `.cs-site[data-cs-theme] [data-play="paused"] *`(0,3,0)로 올려 축약형보다 우선하게 했다. 그래도 각자 CSS는 롱핸드를 권장한다
- `public/content-examples/MANIFEST.json`은 WP-S1이 관리한다. WP-H가 루트에 둘 소재는 S1-4 검사에서 제외했다

## 6. 변경 파일

- 신규: `lib/content-site/example-media.ts`, `public/content-examples/**`(12개 파일 + MANIFEST), `tests/content-site-wps1.test.mjs`, 이 문서
- 수정
  - `components/content-site/services/{motion-runtime,scene-sequence,work-sequence,service-hero}.tsx`, `service-motion.css`(WP-S2 구역은 원문 유지)
  - `webtoon/{landing.tsx,webtoon-experience.tsx,webtoon.css}`, `animation/{landing.tsx,animation.css}`, `motion-graphics/{landing.tsx,type-composition.tsx,motion-graphics.css}`
  - `lib/content-site/services/webtoon.ts`: `unfold` 문구 추가, 리더 문구를 넘김에 맞게 수정
  - 테스트 `content-site-wpa`(A-2·A-3·A-4·A-6·A-7), `content-site-wpb`(B-3의 MG 조건, B-4)
- 삭제: `components/content-site/services/animation/before-motion.tsx`

## 7. 실행한 검사

직렬로 실행했다(`node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/<file>`).

| 파일 | 결과 |
| --- | --- |
| content-scenes | 1/1 PASS (검토 파생본 없으면 skip 경로) |
| content-site | 16/16 PASS(작업 전 3 FAIL, 6번 고객 문자열 포함) |
| content-site-grid | 3/3 PASS |
| content-site-wpa | 8/8 PASS(작업 전 3 FAIL) |
| content-site-wpb | 5/5 PASS(B-2는 WP-S2 수정 후 PASS) |
| content-site-wps1(신규) | 6/6 PASS |
| content-home·content-site-wps2(다른 WP, 읽기 확인) | 18/18 · 4/4 PASS |
| tsc --noEmit(전체 프로젝트) | 오류 0 |
| eslint(담당 파일) | 오류 0 |

## 8. NOT_RUN과 남은 일

- NOT_RUN: next build, 서버 기동, 브라우저 실측(시간차 프레임, 스크롤 프레임, 페이지 넘김 중간 프레임, 화면 밖 정지, reduced-motion, 모바일 스와이프와 세로 스크롤 공존), 공개판 client chunk·HTML의 고객 문자열 검사. 모두 검증 담당 범위다
- 권리 확인 미결(RESULT_WPA 6-1): 《1억의 구단주》 컷 3~12에 실존 구단 엠블럼·중계 화면·실존 인물로 보이는 장면이 있다. 리더와 펼침 구간(컷 1~5)에서 노출된다. 공개 전 사용자 확인이 필요하다
- 임시 소재 한계: 생성 이미지가 5종뿐이라 여러 슬롯이 같은 원본을 구도만 바꿔 쓴다. Higgsfield 소재가 오면 슬롯 한 줄씩 교체하고, 매니페스트에 출처를 추가한다
- 커밋·push·배포는 하지 않았다
