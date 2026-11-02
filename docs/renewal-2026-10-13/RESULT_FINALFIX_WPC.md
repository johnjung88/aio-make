# RESULT FINALFIX WP-C — 브랜드 홍보 영상 · SNS 광고 영상 (VERIFY_FINAL_P2R 재지시 WP-C-1~3)

2026-10-14 · 구현: Opus 서브에이전트(WP-C) · 기준 HEAD `65b3be7` · 커밋·push·설치 없음 · `next build`/`dev`·브라우저 실행 안 함(지시)

**상태: WP-C-1·2·3 반영. typecheck PASS, lint 오류 0(기존 경고 1), WP-C 관련 테스트 실패 0. 화면 확인은 NOT_RUN(V 몫).**

## 1. 변경 파일 (WP-C 소유 범위만)
| 경로 | 내용 |
|---|---|
| `components/content-site/services/brand-film/landing.tsx` | 히어로 배경 영상에 `poster={ASSETS.heroStill}` 추가, 주석 갱신 |
| `lib/content-site/services/brand-film.ts` | h1 `브랜드 이야기를\n한 편에 담습니다` → `한 편의 영상에\n브랜드를 담습니다` |
| `lib/content-site/services/ad.ts` | 첫 장면 설계 프레임마다 `screen` 문구 추가(`밤의 향기`·`은은한 잔향`·`문의하기`), 프레임 1·2 alt를 화면 문구에 맞게 수정 |
| `components/content-site/services/ad/landing.tsx` | 빈 막대(`headline`·`caption`·`cta` 장식 `<i>`) 제거 → 장면마다 실제 문구 `span` 하나(`SCREEN_TEXT` 표: 큰 문구 `cs-t-h3` · 자막 띠 `cs-t-caption` · 버튼 `cs-t-label`). `HOOK_SIZES` 마지막 값 320px → 360px |
| `components/content-site/services/ad/ad.css` | 프레임 격자(≥768) `repeat(3, minmax(0, 360px))` + `justify-content: space-between`, 휴대폰 틀 `max-width: 320px` 삭제. 빈 막대 규칙 삭제, `.cs-svc-ad-screen-text` 규칙 추가(첫 장면 위쪽 그림자). 쓰지 않게 된 `--svc-ui-line` 삭제 |

공용 파일(theme·shell·ui·blocks·tests·`public/content-site/`)과 다른 서비스는 고치지 않았다. 새 자산 파일은 만들지 않았다.

## 2. 항목별 처리

### WP-C-1 브랜드 홍보 영상 히어로 poster
- 기존 정지 화면 `/content-site/hero.webp`(`CONTENT_SITE_ASSETS.hero`)를 poster로 지정했다. 새 프레임을 추출하지 않은 이유: ffmpeg로 `brand-motion.mp4` 0초 프레임을 뽑아 비교하니 같은 장면이다(SSIM All 0.968, Y 0.957, 1920×1080 기준). 추출 파일을 따로 두면 같은 그림이 두 벌이 된다.
- SHA-256(2026-10-14 확인, 변경 없음):
  - `public/content-site/hero.webp` `59790ca5952628e6eca342aa5b609f5f1e6f60633f4b51e8b859993eedfcad02` (82,220 B, 1920×1081)
  - `public/content-site/brand-motion.mp4` `1c6f0bbdb7a1ccca1f6ad1372f33b295fffb7d338dcf4883d38204b439e52539` (h264 1920×1080, 12.0초)
- 주의: 아래층 이미지는 `next/image`라 브라우저가 `/_next/image?url=…&w=…`를 받고, poster는 원본 URL `/content-site/hero.webp`를 받는다. 두 URL이 달라 요청이 하나 늘 수 있다(원본 82 KB). VERIFY의 "같은 URL" 기대는 `CsMedia`(공용 `ui/media.tsx`)의 `under`가 최적화 URL을 쓰는 한 서비스 파일만으로는 맞출 수 없다. 줄이려면 공용 쪽에서 `under`에 `unoptimized` 선택지를 열거나 poster에 같은 최적화 URL을 쓰게 해야 한다(공용 변경 요청, 아래 4절).
- 영상은 재생 전 투명(`video[data-cs-autoplay]` opacity 0)이라 화면 모양은 바뀌지 않는다. 아래층 이미지가 없거나 늦게 뜨는 경우의 보강이다.

### WP-C-2 SNS 광고 첫 장면 설계 프레임
- 정렬: ≥768에서 칸마다 최대 360px로 채우고 남는 폭은 사이 간격으로 나눈다. 첫 틀 왼쪽은 섹션 머리 왼쪽 선, 셋째 틀 오른쪽은 콘텐츠 오른쪽 끝에 닿는다. 1440 계산: 콘텐츠 1296px → 틀 360×3, 사이 108px(이전: 416px 칸에 320px 틀이 왼쪽에 붙어 오른쪽 96px 빈칸). 1024 계산: 틀 약 291px로 칸을 꽉 채움. <768은 이전과 같다(틀 132px + 설명 한 줄).
- 빈 막대: 첫 장면 흰 막대 2개, 마지막 장면 빈 분홍 버튼, 세 장면 공통 자막 띠의 흰 선 2개를 모두 지우고 장면마다 실제 문구 하나만 둔다.
  - 첫 장면: 위쪽 큰 문구 `밤의 향기`(`cs-t-h3`, `--cs-fg`), 밝은 천 위에서도 읽히게 위쪽 46%에 어두운 그라데이션.
  - 제품 장면: 아래쪽 가운데 자막 띠 `은은한 잔향`(`cs-t-caption`, 반투명 어두운 띠).
  - 마지막 장면: 버튼 `문의하기`(`cs-t-label`, `--cs-accent` 바탕 · `--cs-on-accent` 글자, 높이는 글자+패딩).
  - 진행 막대(장면마다 1·2·3칸)는 장면 순서를 보여주는 장식이라 그대로 뒀다.
  - 문구 묶음은 전처럼 `aria-hidden`이고 의미는 이미지 alt가 맡는다. alt 수정: 1 `빛이 스치는 보라색 천 위에 짧은 문구를 얹은 첫 장면 연출 예시`, 2 `돌 받침 위 향수병을 크게 보여주고 아래에 자막을 넣은 제품 장면 연출 예시`, 3 그대로.
  - 132px 틀(모바일)에서도 한 줄에 들어가게 문구를 4~5자로 정했다(`cs-t-h3` 20px 기준 약 80px, 가용 약 100px). 자막·버튼은 `white-space: nowrap`.
- `screen` 문구의 모양(큰 문구·자막·버튼)은 데이터에 영문 키를 두면 카피 규칙 테스트(3번, 데이터 문자열 라틴 금지)에 걸려서 `ad/landing.tsx`의 `SCREEN_TEXT` 표에서 장면 순서로 정한다.

### WP-C-3 h1 겹침
- 브랜드 홍보 영상 h1을 `한 편의 영상에\n브랜드를 담습니다`로 바꿨다(줄마다 공백 포함 8자, 9자 규칙 안). 웹툰 h1(`브랜드 이야기를…`)과 시작 구절이 겹치지 않는다. WP-A-6에서 웹툰 쪽도 바뀌어도 충돌 없음.
- 점검: `~을 통해`·`~에 대해`·`아니라`·`없이`·쉼표 연쇄·숫자 없음. 마지막 줄 한 글자 아님.

## 3. 실행한 검증
- `npm run typecheck` → PASS(exit 0, 최종 상태). 중간 실행에서 `webtoon/landing.tsx` 오류 3건이 보였으나 WP-A 작업 중 파일이었고 최종 재실행에서 0건.
- `npm run lint` → `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110 'options'`). WP-C 파일만 `npx eslint` → exit 0.
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` (최종) → tests 99 · pass 94 · fail 4 · skipped 1.
  - 실패 4건은 모두 다른 WP의 진행 중 파일: `5. AI 인플루언서 범위·표기`(WP-B), `A-1`·`A-3`·`A-8`(WP-A, `tests/content-site-wpa.test.mjs`).
  - WP-C 관련 `content-site.test.mjs` 3(카피 규칙)·6(고객 경계)·7(CSS 규칙)·8(소스 규칙) PASS. 첫 실행에서 3번이 데이터의 영문 `kind` 값에 걸려 2절대로 구조를 고친 뒤 통과.
- NOT_RUN(지시상 금지·V 몫): `npm run build`, 서버·브라우저(1440/1024/768/390/360 프레임 정렬·문구 줄바꿈·대비 계산, poster 요청 수·LCP, 히어로 줄바꿈).

## 4. 공용 변경 요청 (고치지 않음)
1. `components/content-site/ui/media.tsx`의 `under` 이미지와 `poster`가 같은 URL을 쓰도록 하려면 공용 쪽 선택지가 필요하다(예: `under.unoptimized` 또는 poster를 `getImageProps`로 같은 최적화 URL에 맞춤). 지금은 poster 원본 요청 1건(82 KB)이 늘 수 있다.

## 5. 열린 질문
1. h1 새 문구(`한 편의 영상에 / 브랜드를 담습니다`) 사용자 확인.
2. 첫 장면 설계 화면 문구 `밤의 향기`·`은은한 잔향`·`문의하기`는 가상 향수 광고의 연출 예시 문구다(이미지마다 `연출 예시` 태그 유지). 다른 문구를 원하면 `lib/content-site/services/ad.ts`의 `screen` 세 줄만 바꾸면 된다.
