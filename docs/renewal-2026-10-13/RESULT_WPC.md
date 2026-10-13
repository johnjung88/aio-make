# RESULT WP-C — 브랜드 홍보 영상 · SNS 광고 영상 서비스 랜딩

2026-10-14 · 구현: Opus 서브에이전트(WP-C) · 기준 HEAD `c0ab7d9` · 커밋·push·배포·설치 없음 · `next build`/`dev`·브라우저 실행 안 함(지시)

**상태: 구현 완료. typecheck PASS, lint 오류 0(기존 경고 1), WP-C 관련 테스트 실패 0. build·브라우저·HTTP 검사는 NOT_RUN(V 몫).**

## 1. 변경 파일 (BRIEF_P2R 3-2 WP-C 소유 범위 안)
| 경로 | 내용 |
|---|---|
| `lib/content-site/services/brand-film.ts` | `brandFilmSignature`(히어로 영상 라벨·일시정지 문구, 이야기 순서 3행, 길이별 구성 2줄) 추가 → `signature`. h1 문구 1곳 수정(아래 4절) |
| `lib/content-site/services/ad.ts` | `adSignature`(콜라주 라벨·타이포 카드 3개, 첫 장면 설계 프레임 3개) 추가 → `signature` |
| `components/content-site/services/brand-film/landing.tsx` | 화면 전체 배경 영상 히어로 + Signature(이야기 순서, 길이별 구성) |
| `components/content-site/services/brand-film/film-control.tsx` (신규, client) | 배경 영상 일시정지 버튼(이 페이지 고유 client 섬 1개) |
| `components/content-site/services/brand-film/brand-film.css` | 위 스타일 전부 |
| `components/content-site/services/ad/landing.tsx` | 9:16 카드 콜라주 히어로 + Signature(첫 장면 설계) |
| `components/content-site/services/ad/collage-motion.tsx` (신규, client) | 콜라주 레일 왕복(이 페이지 고유 client 섬 1개) |
| `components/content-site/services/ad/ad.css` | 위 스타일 전부 |

공용 파일(`theme.css`, `shell/`·`ui/`·`blocks/`, 레지스트리, 라우트, 테스트, `works.server.ts`)과 다른 서비스·content-home·contact는 고치지 않았다.

## 2. 페이지 구성
섹션 순서는 레지스트리 고정: hero → types(공통) → signature → works(검토 빌드만) → pricing → process → scope → faq → inquiry → related.

### 브랜드 홍보 영상 (`/content/services/brand-film`, ink·더 어두운 바탕·연라일락)
- **히어로**: 섹션 전체를 채우는 배경. 아래층 `next/image`(`/content-site/hero.webp`, `priority`, `sizes=100vw`, alt 비움 → LCP), 위층 `CsMedia kind="video" autoplay preload="metadata"`(`/content-site/brand-motion.mp4`, 12초 무음, `aria-label`=영상 설명). 서버 HTML에 `autoplay` 속성 없음, 재생은 frame.tsx가 마운트 후 처리, `playing` 전 투명. 그림자: ≥768 왼쪽→오른쪽 .72→0 + 아래→위 .88→0(40%), <768 아래→위 .88→0(78%) + 전체 .38(문구가 영상 위를 넓게 덮어서).
  - 문구(`CsHeroCopy`)는 왼쪽 아래, 오른쪽 아래에 `연출 예시 · 무음` 태그 + 44×44 일시정지 버튼. <768은 태그·버튼이 문구 위 첫 줄로 올라간다(겹침 0).
  - 높이: ≥768 `clamp(560px, 100svh - 헤더, 900px)`, <768 최소 640px(360px 폭에서 문구 높이가 640을 넘으면 늘어난다).
  - 일시정지 버튼: 같은 섹션의 영상 하나만 제어. 라벨은 실제 재생 상태를 따른다(`영상 일시정지`/`영상 재생`, 서버 렌더 초기값 `영상 재생`). 사용자가 멈춘 뒤 frame이 다시 `play()`하면 `play` 이벤트에서 다시 멈춘다. 헤더 움직임 토글을 껐다 켜면 사용자 정지도 풀린다(자식 effect가 frame effect보다 먼저 실행). reduced-motion에서는 자동재생이 없고 버튼으로만 재생.
- **이야기 순서**(`STORY`, 바탕 `--cs-bg-2`): 7/12열에 큰 문장 3행(장식 숫자 `cs-t-num` 01~03 렌더 시 생성 + `h3.cs-t-statement` + 본문), 9~12열에 `creative-v06/video-brand-film.webp` 3:4(`연출 예시`). <1024 세로.
- **길이별 구성**(`LENGTH`, 바탕 `--cs-bg`): 줄마다 왼쪽 머리(h3 `30초`/`60초` · 금액 `cs-t-price-sm` + `부가세 별도` · `이 구성으로 상담 ↓` 링크 `a[data-plan]` → 문의 폼 `희망 구성` 자동 선택), 오른쪽 `ol` 타임라인. 칸 폭은 줄 안에서 균등(시간 비율 주장 없음), ≥768에서 30초 줄 전체 길이는 60초 줄의 절반(총 길이만 반영). <768은 세로(왼쪽 막대). 막대는 `::before` 장식이고 읽히는 것은 `ol` 텍스트. 아래 캡션 `길이별 구성 예시입니다. 실제 구성은 기획안에서 정합니다.`
- 금액·플랜 키는 `pricingPlans("brand-film")`에서 읽는다(라벨 `30초`·`60초`로 매칭). 금액 리터럴 없음.

### SNS 광고 영상 (`/content/services/ad`, ink·핑크)
- **히어로(Vidsy 콜라주)**: ≥1024 왼쪽 6/12 문구(세로 가운데), 콜라주는 섹션 오른쪽 절반을 끝까지 채운다(`left:50%; right:0`). <1024 문구 → 콜라주(<768 높이 440px, 768~1023 560px), 폭은 화면의 122%를 가운데 기준으로 clip, 가로 넘침 0(섹션 `overflow: clip`).
  - 9:16 카드 9장 3열, 무대 전체 `rotate(-12deg)`, 가운데 열 `translateY(72px)`, 위아래 10% 마스크.
  - 카드: 이미지 6장(사람 없는 공개 이미지 5종: `creative-v06/video-sns-ad`, `renewal/shop-products`, `creative-v06/marketing-sns`, `renewal/brand-film-v03`, `renewal/video`) + 타이포 카드 3장(강조색 바탕, `cs-t-h2`, `첫 장면`·`제품 장면`·`마지막 장면`, 오른쪽 위 원 장식). 첫 카드만 `priority`.
  - 콜라주 컨테이너 하나에 `role="img"` + `aria-label="SNS 광고 영상 연출 예시"`, 카드 이미지 alt 비움, 링크 아님. 태그 `연출 예시`는 콜라주 왼쪽 아래(모바일은 문구 왼쪽 끝 `--cs-gutter`에 맞춤).
  - 레일 왕복: 한 번 왕복 24초(한 방향 12초, 레일 높이의 ±4%, 열마다 방향 반대). `CollageMotion`(client 섬)이 Web Animations API로 움직이고, reduced-motion이면 만들지 않으며(설정 변경 감지), 헤더 움직임 토글로 `pause()`/`play()`.
  - 무대 크기는 기울어진 무대가 콜라주 영역 모서리까지 덮도록 폭별로 계산했다(390·768·1024·1440·1920에서 계산상 빈 모서리 0, 2560 같은 초광폭은 모서리가 비어 보일 수 있음).
- **첫 장면 설계**(`HOOK`, 바탕 `--cs-bg-2`): 휴대폰 틀 3개(≥768 3열, <768 한 줄에 틀 132px + 설명). 틀 안은 같은 연출 예시 이미지(`/content-site/brand.webp`, 향수병)를 장면마다 다르게 잘라 한 편의 세 장면처럼 보인다(첫 장면=빛과 천 클로즈업, 제품 장면=제품 확대, 마지막 장면=전체 + 어두운 그라데이션). 화면 위 장식(진행 막대가 장면마다 1·2·3칸 채워짐, 첫 장면 굵은 문구 막대, 마지막 장면 버튼 모양, 자막 띠)은 CSS·`aria-hidden`. 이미지마다 alt와 `연출 예시` 태그. 틀 아래 `h3` + 설명.

### 공통 처리
- 섹션마다 `data-cs-section`(`hero`, `signature`), `aria-labelledby`, 머리는 `CsSectionHead`(eyebrow 정렬은 공통 규칙 그대로). 히어로는 `CsHeroCopy` 사용(`aria-labelledby="cs-hero-title"`).
- 글자는 모두 `.cs-t-*` 역할 클래스. 서비스 CSS의 글자 속성 선언 0, `@media` 안 글자 속성 0, `!important` 0, 인라인 `style` 0, 텍스트 색은 `var(--cs-*)`만(타이포 카드는 `.cs-t-h2` 기본색 `--cs-fg`를 `--cs-on-accent`로 덮음). 장식색은 파일 맨 위 `--svc-*` 블록.
- 공통 규칙(0,2,0)을 덮는 곳은 `.cs-svc-<id> .<고유>.<공통>`(0,3,0)로 써서 CSS 로드 순서에 기대지 않는다. 애니메이션을 선언하지 않으므로(레일은 WAAPI) 움직임 토글의 `animation-play-state: paused` 규칙과 충돌 없음. 트랜지션(일시정지 버튼 테두리)은 `prefers-reduced-motion: no-preference` 안.
- 미디어: 같은 원본은 같은 `sizes`로만 쓴다(`video-sns-ad`는 콜라주 안 두 카드 같은 `sizes`, `brand.webp`는 첫 장면 프레임 3개 같은 `sizes`) → `/_next/image` 중복 요청 0 의도. 첫 화면 밖 이미지는 lazy, 히어로 외 영상 없음.
- 고객 사례는 공용 `CsWorks` + `works.server.ts`(검토 플래그 `=== "1"`) 그대로. 브랜드 홍보 영상 `layout="wide"`, SNS 광고 `layout="vertical"`. 기본 빌드에서는 사례 섹션이 렌더되지 않고, WP-C 파일에는 고객 문자열이 없다(테스트 6 통과).

## 3. 카피 최종본 (데이터 파일)
브랜드 홍보 영상: hero eyebrow `BRAND FILM` · h1 `브랜드 이야기를\n한 편에 담습니다` · lead/facts/types/process/scope/FAQ/inquiry/SEO는 명세 초안 그대로. 영상 라벨 `브랜드 홍보 영상 연출 예시 · 보라색 유리 곡면이 천천히 흐르는 무음 영상`, 버튼 `영상 일시정지`/`영상 재생`. 이야기 순서 `STORY` / `이야기 순서부터\n정합니다` / lead `세 가지 질문에 차례로 답하는 구성으로 기획안을 씁니다` / 3행 명세 그대로 / 이미지 alt `보라색 천이 흐르는 물 위에 놓인 향수병 연출 예시`. 길이별 `LENGTH` / `30초와 60초\n이렇게 나눕니다` / 구성 명세 그대로 / 캡션 명세 그대로.

SNS 광고 영상: hero·types·process·scope·FAQ·inquiry·SEO는 명세 초안 그대로. 콜라주 라벨 `SNS 광고 영상 연출 예시`, 카드 `첫 장면`·`제품 장면`·`마지막 장면`. 첫 장면 설계 `HOOK` / `첫 장면에서\n멈추게 합니다` / lead·3프레임 문구 명세 그대로. 프레임 alt: `빛이 스치는 보라색 천을 가까이 담은 첫 장면 연출 예시` · `돌 받침 위 향수병을 크게 보여주는 제품 장면 연출 예시` · `향수병 아래로 문의 버튼이 놓인 마지막 장면 연출 예시`.

### humanizer 점검으로 고친 문장
- h1 `브랜드의 이유를 한 편에 담습니다` → `브랜드 이야기를 한 편에 담습니다`. `브랜드의 이유`는 번역투에 가깝고 뜻이 흐려서 고쳤다(8자, h1 9자 규칙 안).
- 이야기 순서 lead를 새로 넣음(명세엔 없음): 질문 세 개로 기획안을 쓴다는 사실만 말하고 효과는 약속하지 않는다.
- 나머지 명세 문장은 `~을 통해`·`~에 대해`·`A가 아니라 B`·쉼표 나열·근거 없는 숫자가 없어 그대로 뒀다. 광고 성과(클릭률·ROAS·전환·조회수) 표현 0, 숫자로 된 초 단위 표현(`첫 3초` 등) 0.

## 4. 실행한 검증
- `npm run typecheck` → PASS(최종 상태에서 재실행).
- `npm run lint` → `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110 'options'`).
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-site.test.mjs` → pass 10 · fail 0 · todo 2(7-1, 8-1: WP-D 몫).
- 전체 직렬 `tests/*.test.mjs`(최종): tests 80 · pass 75 · fail 2 · skipped 1 · todo 2. **실패 2개는 다른 WP의 진행 중 파일**: `content-home.test.mjs` 8(`components/content-home/service-showcase.tsx` 주석 속 `wheel·scroll-snap` 단어, WP-D), `content-site.test.mjs` 8(`components/content-site/services/animation/landing.tsx`의 `style=`, WP-A). 같은 실행 직전(그 파일들이 바뀌기 전)에는 tests 80 · pass 77 · fail 0이었다. WP-C 파일에서 `style=`·`autoPlay`·`process.env`·금액 리터럴 grep 0건.
- NOT_RUN(지시상 금지·V 몫): `npm run build` 두 빌드, 서버·브라우저(1440/1024/768/390/360 넘침·정렬·대비·글자 계산값, 하이드레이션, 움직임 토글·일시정지 버튼 동작, LCP·CLS, `/_next/image` 중복, 검토 빌드 사례 카드·87언니 라벨).

## 5. 공용 변경 요청 (고치지 않음)
1. **테스트 7의 CSS 파서가 `@keyframes` 안의 `from`/`to`/`%` 단계를 선택자로 읽는다** → 서비스 `<id>.css`에서 키프레임을 쓸 수 없다. WP-C는 Web Animations API로 우회했다. WP-B는 별도 `motion-graphics.keyframes.css` 파일을 만든 것으로 보여(서비스 스타일 한 파일 규칙과 어긋남) 방식이 갈린다. 파서가 `@keyframes` 블록의 자식을 건너뛰게 하고, 키프레임 이름 규칙(`cs-svc-<id>-*`)을 테스트로 거는 쪽을 권한다.
2. **`works.server.ts`의 `MAX_WORKS = 4`**: SNS 광고 후보가 6개(87언니 시안 3편 + BWL 브랜드 광고 + 요프리 모션 광고 2편)라 2편이 잘린다. 명세 6-4 매핑(시안 3편 · BWL 브랜드 광고 · 요프리 모션 광고)을 모두 보이려면 서비스별 상한(광고 5~6) 또는 우선순위가 필요하다. 어떤 4편이 남는지는 카탈로그 `order`에 달려 있어 검토 빌드에서 확인 필요.
3. (선택) frame.tsx 자동재생 루프가 사용자가 멈춘 영상(`data-user-paused` 등)을 건너뛰면 서비스 쪽 재정지 처리가 필요 없다. 현재 구현으로도 동작상 문제는 없다.

## 6. 열린 질문·주의
1. 첫 장면 설계 프레임 안은 명세의 "CSS 일러스트" 대신 **연출 예시 이미지 + CSS 화면 장식**으로 만들었다(품질이 보이는 쪽이 광고 랜딩 전환에 낫다고 판단). 이미지마다 `연출 예시` 태그와 alt가 있다. CSS만으로 되돌리려면 `ad/landing.tsx`의 `CsMedia` 한 줄을 빼면 된다.
2. 콜라주 이미지 구성: 명세의 `brand.webp`는 콜라주 대신 첫 장면 프레임에 썼다(같은 원본을 다른 `sizes`로 두 번 쓰면 `/_next/image` 요청이 중복된다). 콜라주에는 사람 없는 공개 이미지 5종을 쓴다.
3. 길이별 구성에서 30초 줄 전체 길이를 60초 줄의 절반으로 그렸다(총 길이만 반영, 칸은 균등). 시간 비율 표현으로 읽힐 우려가 있으면 CSS `[data-span="half"]` 규칙 하나를 지우면 두 줄이 같은 폭이 된다.
4. 히어로 h1 문구를 바꿨다(3절). 명세 원문으로 되돌릴지 사용자 확인.
5. 브랜드 홍보 영상 촬영 포함 여부(Q6)·납품 규격(Q7)은 쓰지 않았다.
