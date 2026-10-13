# RESULT FINALFIX WP-A: 웹툰 + 애니메이션 (VERIFY_FINAL_P2R 재지시 WP-A-1~6)

2026-10-14 · 구현: Opus 서브에이전트(WP-A) · 기준 HEAD `65b3be7`. 작업트리에 SHARED·WP-B·WP-C의 미커밋 변경이 함께 있는 상태에서 작업했다.
커밋·push·배포·설치 없음. `next build`/`dev`와 브라우저는 실행하지 않았다(지시). 공용 파일(theme.css·shell·ui·blocks·레지스트리·`content-site.test.mjs`·`lib/content-pricing.ts`)과 다른 서비스 파일은 건드리지 않았다.

**상태: 구현 완료. 구현 담당의 자체 검증이며 독립 검증은 NOT_RUN이다.** typecheck PASS. lint 오류 0(경고 1, 기존 `local-admin.test.mjs:110`). 직렬 전체 테스트는 `tests 99 · pass 97 · fail 1 · skipped 1`이다. 실패 1건은 WP-B가 작업 중인 `content-site.test.mjs` 5번(`account operation note`, AI 인플루언서)이고 WP-A 파일과 관계없다. skipped 1건은 기존 항목이다.

## 1. 변경 파일
| 경로 | 내용 |
|---|---|
| `lib/content-site/services/webtoon.ts` | 모션코믹 문구 재작성(`ways` 2개 + `priceLink`, `bundlesLabel`·`soloLabel`·`note` 삭제), h1·types 제목·hero facts·리더 lead 수정, 금액이 든 FAQ 2개 교체·삭제 |
| `lib/content-site/services/animation.ts` | 그림체 lead, hero facts, FAQ(금액 FAQ 교체, 중복 FAQ 삭제) |
| `components/content-site/services/webtoon/landing.tsx` | 모션코믹 오른쪽 열: 금액 카드·모션코믹 단독 금액표·주석 → `맡기는 방법` 2항목 + `#pricing` 링크. 가격 import(`pricingPlans`·`formatWon`·`CS_COPY`) 제거, poster 교체 |
| `components/content-site/services/webtoon/webtoon.css` | 묶음·단독 금액 스타일 삭제, `.cs-svc-webtoon-ways`·`-way-list`·`-way` 추가 |
| `components/content-site/services/animation/before-motion.tsx` | 이야기 그림: 문장 카드 + 시작·전개·마무리 장면 3칸 |
| `components/content-site/services/animation/animation.css` | 탭 패널 정렬·그림 비율, 이야기 그림 스타일, 후광 위치·크기 |
| `tests/content-site-wpa.test.mjs` | A-1·A-3·A-8을 새 기준으로 갱신(3절) |
| `public/webtoon-v11/motion-comic-poster.webp` (신규) | 모션코믹 poster, 영상에서 뽑은 프레임 |

## 2. 항목별 처리

### WP-A-1 금액 중복·같은 사실 반복 (웹툰)
- 금액은 이제 `제작 가격`(#pricing, 공용 `CsPricing`) **한 곳에서만** 보인다. 모션코믹 섹션의 묶음 카드 2개(17.5만·30만), 분해 줄(10만 + 7.5만 등), `모션코믹만 맡길 때` 금액표(7.5만·12만)를 지웠다. 대신 `모션코믹 가격 보기 ↓` 링크(`#pricing`)를 둔다. 묶음 상담 선택(`data-plan="bundle-N"`)은 가격 섹션의 카드에 그대로 있다.
- '기존 웹툰 영상화 가격 / 신규 제작은 별도'는 가격 주석의 한 문장(`모션코믹은 기존 웹툰을 영상화하는 가격입니다. 웹툰 신규 제작은 별도입니다.`, 공용 `lib/content-pricing.ts`)만 남겼다. 섹션 주석 `m.note`와 FAQ 4의 변주 문장은 삭제했다.
- FAQ에서 금액을 뺐다. 이제 FAQ와 고유 섹션 데이터에는 `N만 원` 문장이 없다(SEO description의 시작가 `…만 원부터`만 남음).
  - `모션코믹은 무엇인가요?` → `완성한 웹툰을 움직이는 영상으로 바꾸는 작업입니다.`(금액 문장 삭제)
  - `웹툰과 모션코믹을 함께 맡기면 얼마인가요?`(금액 2개) → 삭제하고 `대사는 누가 쓰나요?` / `저희가 씁니다. 꼭 넣고 싶은 문구가 있으면 상담할 때 알려주세요.`로 교체
  - `이미 있는 웹툰도 모션코믹으로 만들 수 있나요?` → 삭제(`모션코믹만 맡길 때` 항목과 같은 사실). 서비스 FAQ 3개 + 공통 3개 = 6개(테스트 기준 ≥4).
- 섹션 lead가 FAQ 답과 같은 문장(`모션코믹은 완성한 웹툰을 움직이는 영상으로 바꾸는 작업입니다`)이었으므로 lead를 `컷에 움직임과 화면 전환을 더해 30초나 60초 영상으로 만듭니다`로 바꿨다.
- 같은 사실 반복을 더 줄였다. 리더 lead `컷마다 완성 이미지 1장으로 셉니다`는 FAQ 1과 겹쳐서 `《1억의 구단주》 1회를 휴대폰 화면처럼 세로로 이어 붙였습니다`로 바꿨다. hero facts의 `모션코믹 영상화 옵션`은 바로 위 가격 안내 줄(`모션코믹 영상화 옵션 · 30초 7.5만 원부터`)과 겹쳐서 `콘티부터 작화까지`로 바꿨다.

### WP-A-2 영상 왼쪽 열 아래 공백 · 로고 poster (웹툰)
- 오른쪽 열이 금액 카드 2장 + 금액표 + 주석으로 길었고, 그래서 영상 아래가 약 380px 비었다. 이제 오른쪽 열은 라벨 `맡기는 방법`, 번호 목록 2개, 가격 링크로 끝난다.
  - `01 웹툰과 함께 맡길 때`: `웹툰을 그린 뒤 같은 컷으로 영상을 이어 만듭니다. 12컷은 30초, 24컷은 60초 영상과 묶어 맡길 수 있습니다.`
  - `02 모션코믹만 맡길 때`: `이미 완성한 웹툰이 있다면 컷별 원본 이미지로 영상만 만듭니다.`
  - 계산 높이는 1440 기준 약 430px이다. 영상 열은 16:9(약 745×419) + 캡션으로 약 450px이라 두 열 높이가 비슷하다(계산값이며 화면 실측은 NOT_RUN).
- **poster 교체**: 기존 `/videos/webtoon-reference-poster.jpg`는 로고 엔드카드였다. 메인 사이트 `components/guide/showcase-video.tsx`가 같은 파일을 쓰므로 그대로 두고 새 파일을 만들었다.
  - 파일: `public/webtoon-v11/motion-comic-poster.webp` (1280×720, 58,958 bytes)
  - SHA-256: `83933fce9da7b4ab80cba45abf36580da6561c3d48a961df754faf12f81fb305`
  - 원본: `public/videos/webtoon-reference-v02.mp4` (SHA-256 `6c630cd9ca6b43e08bb671d83743707dcc1bfb6c6b6167a527b2f0dabfd3550d`, 1920×1080, 21초)
  - 명령: `ffmpeg -ss 17.6 -i public/videos/webtoon-reference-v02.mp4 -frames:v 1 -vf scale=1280:720 -c:v libwebp -quality 82 -compression_level 6 public/webtoon-v11/motion-comic-poster.webp`
  - 장면: 영상 17.6초 프레임이다. 축구장 벤치에 앉은 주인공 뒷모습과 아이들 훈련 장면 위에 `ORIGINAL WEBTOON / 1억의 구단주 / 1화 「새 게임」 · 기획부터 편집까지 AIO MAKE Studio` 제목이 있다. 기존 영상에서 프레임을 그대로 추출한 것이고 새로 생성한 이미지가 아니다. 자체 웹툰의 장면이며 실존 인물·구단 표기는 없다.
  - 참고: 영상 태그(`1억의 구단주 영상 · 제작 예시`)가 왼쪽 위에 있어 프레임 왼쪽 위의 작은 `AIO MAKE Studio` 표기를 덮는다. 제목 영역(왼쪽 아래)은 가리지 않는다.

### WP-A-3 탭 패널 빈 공간 (애니메이션)
- 패널 항목을 `align-items: center` → `start`로 바꿨다. 글은 그림 윗선에 맞추고, ≥1024에서는 그림 안쪽 여백만큼 `padding-top: var(--cs-s5)`를 준다. 그래서 탭과 글 사이의 약 230px 공백이 없어진다.
- 그림 상자는 ≥1024에서 4:3 → 3:2로 낮췄다(1440 기준 높이 약 559 → 497px). 장면 구성 4칸(2×2, 칸당 약 334×188)이 안쪽 높이 약 401px 안에 들어가는 것을 계산으로 확인했다.
- 이야기 그림이 '흰 카드 안 작은 카드 하나'였던 것을 고쳤다. 이제 상자 폭을 채운다. 위에는 문장 카드(`한 문장 이야기` + 문장)가 있고, 아래에는 `시작·전개·마무리` 16:9 장면 3칸이 있다. 1칸은 캐릭터 혼자, 2칸은 캐릭터가 제품 쪽으로, 3칸은 제품 옆이다. 기존 콘티 도형 클래스(`-frame-ground/-char/-prop`)를 다시 썼고 전부 `aria-hidden` 안이며 `연출 예시` 태그는 그대로다.
- 캐릭터 그림의 인물 최대 폭은 136 → 160px로 키웠다.
- <768에서는 비율을 고정하면 이야기 그림이 잘리므로 `aspect-ratio: auto; min-height: 280px`로 내용 높이를 따른다. 세 항목이 같은 grid 칸에 겹치는 구조라 패널 높이는 가장 큰 항목에 맞춰진다.

### WP-A-4 제목 마지막 줄 2글자
`쓰는 곳에 맞춘\n웹툰` → `쓰는 곳에\n맞춘 웹툰`.

### WP-A-5 후광 원 위치 (애니메이션)
- 원본(900×1350) 좌표를 다시 쟀다. 얼굴·머리 중심은 x 52.5%, y 약 29%이다(눈 26%, 입 28%, 머리 윗선 20%).
- `object-position`을 `54% 28%` → `54% 29%`로 바꿨다. 후광은 `left 52.5% / top 29%`로 같은 좌표에 둔다. object-position y와 같은 비율의 점은 모든 폭에서 장면의 같은 비율 자리에 머문다. 장면은 모든 폭에서 가로 기준으로 채워지므로 x 비율은 원본과 같다.
- 지름은 `clamp(96px, 24%, 240px)` → `clamp(96px, 32%, 320px)`로 키웠다. 1440 기준 반지름 160px이고 눈 바깥 끝까지의 거리는 약 123px이라, 원이 두 눈을 가로지르지 않고 머리 윗선 위 약 29px을 지난다. 계산값이며 캡처 확인은 NOT_RUN이다.

### WP-A-6 h1 구절 겹침
웹툰 h1을 `브랜드 이야기를\n읽히는 컷으로` → `끝까지 읽히는\n브랜드 웹툰`으로 바꿨다. 브랜드 홍보 영상 h1(`브랜드 이야기를…`)은 WP-C 소유라 건드리지 않았다.

### 같은 그룹의 추가 정리 (애니메이션, 같은 기준 적용)
- FAQ `길이와 가격은 어떻게 되나요?`(금액 30만·55만이 가격 섹션과 중복, 금액 리터럴) → `길이는 어떻게 정하나요?` / `어디에 올릴 영상인지 듣고 30초와 60초 중에서 고릅니다.`
- FAQ `제작 중에 무엇을 확인하나요?` → 삭제했다. 첫 문장이 `움직이기 전` 섹션 lead와 거의 같았고 둘째 문장은 수정 정책의 반복이었다. 서비스 FAQ는 3개 + 공통 3개다.
- 그림체 lead `기획안 단계에서 캐릭터와 배경의 그림체를 함께 정합니다`가 FAQ `그림체는 어떻게 정하나요?` 답과 겹쳐서 `캐릭터의 생김새부터 배경의 질감까지 브랜드 분위기에 맞춥니다`로 바꿨다.
- hero facts의 `캐릭터·배경 설계`(바로 위 lead와 같은 내용)는 `그림체 함께 결정`으로, `기획안 수정 2회`(수정 정책 반복, SHARED-2 취지)는 `장면 먼저 확인`으로 바꿨다.

## 3. 실행한 검증
- `npm run typecheck` → PASS(출력 없음).
- `npm run lint` → `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110`).
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` → `tests 99 · pass 97 · fail 1 · skipped 1`. 실패는 `content-site.test.mjs` 5번 `AI 인플루언서 범위·표기`(`account operation note`)로 WP-B 진행 중 변경 때문이다. `content-site-wpa.test.mjs` 8개는 모두 통과한다.
- `content-site-wpa.test.mjs` 갱신 내용:
  - A-1: 웹툰 랜딩에 `pricingPlans`·`formatWon`·`content-pricing` 사용 0, `만 원` 리터럴 0, `href="#pricing"`이 있다. 웹툰·애니메이션 데이터에 `N만 원` 문장 0(시작가 `…부터` 제외). 묶음 = 웹툰 + 모션코믹 합계 검사는 유지한다.
  - A-3: poster가 `/webtoon-v11/motion-comic-poster.webp`이고 SHA-256이 위 값과 같다. 웹툰 랜딩에 로고 poster 참조가 0이다.
  - A-8: `ways` 2개를 확인하고 `note`가 없음을 확인한다. `새로 그리는 비용|신규 제작은 별도`는 서비스 데이터에 0이다. 서비스 데이터 안에서 마침표로 끝나는 같은 문장의 반복이 0이다. 웹툰·애니메이션 h1·types 제목의 마지막 줄이 3글자 이상이다. 웹툰 h1은 `브랜드 이야기를`로 시작하지 않는다.
- 카피 점검: 공용 카피 테스트(금지어·쉼표 ≤1·허용 숫자·마침표 규칙·영문)를 통과했다. 번역투와 `A가 아니라 B`는 없다. 새 숫자는 12·24·30·60뿐이다.

### NOT_RUN
- `npm run build`, 서버·브라우저 검사(지시로 실행하지 않음).
- 1440/1024/768/390/360 화면에서 확인할 것:
  - 모션코믹 두 열 높이 균형과 새 poster 표시
  - 탭 패널 3개 항목의 높이·정렬과 <768 이야기 그림 잘림 여부
  - 후광 원의 실제 위치(위 수치는 원본 좌표로 계산한 값)
  - 가로 넘침
- 독립 검증(V 몫)도 하지 않았다.

## 4. 남은 일·조율자 확인
1. **poster 프레임 사용**: VERIFY는 '기존 프레임 추출 허용 여부는 조율자 확인'이라고 적었다. 이번 지시(영상 프레임 webp 추출)대로 추출했다. 되돌리려면 `MOTION_COMIC_VIDEO.poster`를 이전 jpg로 바꾸고 테스트 A-3의 SHA 줄을 지우면 된다.
2. **브랜드 홍보 영상 h1**(WP-C-3)은 WP-C 소유다. 웹툰 쪽을 바꿨으므로 WP-C-3은 처리하지 않아도 겹침이 풀린다.
3. 웹툰 가격 주석 문장과 hero 가격 안내 줄(`모션코믹 영상화 옵션 · 30초 7.5만 원부터`)은 공용 `lib/content-pricing.ts` 소유라 그대로 두었다. 모션코믹 금액은 hero 시작가 안내와 #pricing 두 곳에 나온다. hero 시작가는 6서비스 공통 설계다.
4. 《1억의 구단주》 컷 3~12의 실존 구단·인물 노출 권리 확인(RESULT_WPA 6-1)은 여전히 열려 있다.
