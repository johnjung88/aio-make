# VERIFY_R5_FIX1 · R5 수정분 재검증 결과

2026-10-14 · 독립 검증(소스 미수정, 커밋 없음) · 대상 HEAD `0384db2` · 기준 `VERIFY_R5.md`, `RESULT_R5_FIX1.md`

## 0. 판정 요약

**PASS. 출시 차단 결함 없음. 참고 사항 2건만 남긴다.** 지시한 5개 항목과 tsc·전체 테스트가 모두 통과했다.

| 번호 | 항목 | 판정 |
| --- | --- | --- |
| 1 | 390 `/content` 캐러셀: 영상 위 가로 스와이프, 세로 스크롤, 탭, 가로 넘침 | PASS |
| 2 | 390 브랜드 영상 프레임 확대, 390·1440 가로 넘침 | PASS |
| 3 | 공개판 광고 장면 전환 묶음, 공개판 고객 문자열 누출 | PASS (참고 1) |
| 4 | 광고 레일 태그 한 줄, 애니메이션 히어로 '연출 예시' 태그 | PASS |
| 5 | 회귀: 메인 워크플로우·섹션, 캐러셀 자동 넘김, 웹툰 리더, 콘솔 오류 | PASS |
| - | tsc, 직렬 전체 테스트 | PASS |

## 1. 환경과 방법

- 스냅샷 `.qa/r5-verify2/src`(HEAD `0384db2`의 추적·미추적 파일 1330개, `public`·`node_modules`는 junction). 실제 작업트리의 `.next`는 건드리지 않았다.
- 환경 플래그: `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, `NODE_OPTIONS=--max-old-space-size=1536`. 빌드와 서버는 한 번에 하나만 실행했다.
- 공개판: 플래그 미설정, BUILD_ID `EQxMzxXSzchBokqFmxf-p`, 포트 3217. 검사 후 종료하고 `.next-public`으로 보존했다.
- 검토판: `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`, BUILD_ID `nzaoTGwWXqy0SdI_3las-`, 포트 3218. 검사 후 종료했다.
- 브라우저: 시스템 Chrome + playwright-core(헤드리스). 1440×900, 390×844(touch·mobile). 모바일 스와이프는 CDP `Input.dispatchTouchEvent`로 보내 `touch-action`이 실제로 적용되게 했다.
- 스크립트·결과·화면: `.qa/r5-verify2/` (`swipe2~7.cjs`, `film2.cjs`, `tags.cjs`, `leak.cjs`, `m-scene.cjs` 외, 결과 JSON, 화면 `shots/`).

## 2. 항목별 결과와 증거

### 0. tsc · 테스트 — PASS
- `tsc --noEmit --incremental false`: 오류 0 (`.qa/r5-verify2/tsc.log`).
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`: tests 119, pass 118, fail 0, skipped 1(로컬 미디어 파생본, 기존과 동일), 약 18초 (`tests.log`).

### 1. 390 `/content` 캐러셀 영상 위 스와이프 — PASS (검토판)
- 활성 카드가 영상인 탭 5개(인덱스 1~5, 인덱스 0은 만화 이미지)를 모두 시험했다. 영상은 재생 중(currentTime 1.5 → 2.4)이고 `pointer-events:none`이라 영상 중앙 좌표의 히트 대상이 카드(`DIV.ch-depth-media`)다.
- 영상 중앙에서 시작한 가로 스와이프: 왼쪽 → 다음, 오른쪽 → 이전. 5개 탭 모두 기대대로 이동(1→2, 2→3, 3→4, 4→5, 5→0 / 1→0, 2→1, 3→2, 4→3, 5→4). 이전 검증에서 실패하던 동작이다.
- 자동 넘김이 도는 상태(`data-autoplay=running`)에서 카드가 안정된 뒤 영상 위 스와이프: 1→2 (`swipe4-rev.json`). 카드 전환 시작 후 100ms 시점에 스와이프해도 이동했다(`swipe7`). 스와이프 뒤 자동 넘김은 계속 `running`.
- 영상 위에서 시작한 세로 스와이프: 5개 탭 모두 페이지가 스크롤되고(scrollY 1372 → 1597~1712) 카드 인덱스는 그대로.
- 탭: 영상 위 탭은 이동·네비게이션 없음, 옆 카드(`ch-depth-select`) 탭은 해당 카드로 이동(양쪽, 활성 카드 만화·영상 모두), "작업 자세히 보기" 탭은 `/content/projects/yofree-outing-webtoon?service=webtoon`으로 이동.
- 가로 넘침: 모든 시험 단계에서 scrollWidth 390 = clientWidth 390.
- 화면: `shots/rev-swipe2-after-left.png`, `rev-swipe4-after.png`, `rev-swipe2-final.png`.
- 주의: 검증 중 한 번, 자동 넘김 직후 이동 중이던 카드의 오래된 좌표로 스와이프했을 때 무시된 적이 있다. 좌표를 다시 재면 항상 동작해 시험 스크립트 문제로 판단한다(`swipe7`로 100·250·450·800·1200ms 지연 모두 확인).

### 2. 390 브랜드 영상 프레임 확대 — PASS
`film2-pub.json`, `film2-rev.json`(두 빌드 값 동일). 계산값은 `transform`·`border-top-left-radius`.

| 폭 | 스크롤 | scale | border-radius | 프레임 상단 |
| --- | --- | --- | --- | --- |
| 390 | 0 | 0.912 | 20.5px | 310 |
| 390 | 120 | 0.946 | 12.6px | 190 |
| 390 | 300 | 0.997 | 0.64px | 10 |
| 390 | 500 | 1.000 | 0px | -190 |
| 1440 | 0 | 0.880 | 28px | 472 |
| 1440 | 150 | 0.914 | 20.0px | 322 |
| 1440 | 300 | 0.954 | 10.7px | 172 |
| 1440 | 450 | 0.994 | 1.3px | 22 |
| 1440 | 600 | 1.000 | 0px | -128 |

- 이전 390 값은 .984 → 1.0, 모서리 0.7px → 0이었다. 지금은 첫 화면에서 .912, 20.5px로 시작해 스크롤 300px 동안 자란다. `shots/pub-film2-390-y0.png`와 `y200.png`에서 프레임 폭이 눈에 띄게 달라진다(좌우 여백 36px → 25px 안팎, 모서리 둥글기 감소).
- 가로 넘침: 페이지 전체를 500px 간격으로 스크롤하며 측정한 최대 scrollWidth가 390과 1440 모두 폭과 같다(공개판·검토판).

### 3. 공개판 광고 장면 전환 — PASS (참고 1)
- 광고 페이지에 `.cs-scene-chapter--ad` 묶음이 렌더된다(`m-scene-pub-ad.json`). 장면 3개는 `ad-scene-1..3`, 9:16 세로 화면(`data-portrait`), 이미지는 `object-fit: cover`.
- 1440: 고정 구간 2430px(270vh). 진행도 0.30에서 0번, 0.36에서 1번, 0.70에서 2번으로 바뀐다. 전환 중간(WAAPI로 고정) 값: 0ms 나가는 장면 scale 1, 들어오는 장면 scale .94 · translateX +45.9px · opacity 0, 300ms 나가는 장면 scale .95 · translateX -38.2px · opacity .2, 들어오는 장면 scale .99 · translateX 7.7px · opacity .8, 600ms 나가는 장면 -45.2px, 들어오는 장면 scale .999 · opacity 1. 장면 이미지는 켄번스(scale 1.001 → 1.013) 동반. 화면 `shots/pub-ad-1440-scene-mid-t300.png`.
- 390: 자동 순환 간격 3428, 3395, 3402ms. 화면 밖 8초와 숨김 탭 8초 동안 정지. 가로 스와이프 1→2, 세로 스와이프로 스크롤 2389 → 2735, `touch-action: pan-y`. 수동 선택 뒤 5초간 순환 정지. 조작 버튼 높이 48~96px.
- 누출 점검(VERIFY_R5 B와 같은 검색식 `reference-review|BWL|DR's Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-`, 대소문자 무시):
  - 새 공개판 `.next/static` 텍스트 파일 일치 0건(79개 파일).
  - `.next/server/app` 프리렌더 HTML·RSC·meta 43개 일치 0건.
  - 런타임 응답(홈, 컨텐츠 홈, 문의, 인사이트, 서비스 6종, about)을 HTML과 `RSC: 1` 헤더로 받아 일치 0건.
  - 고객 작품 상세 `/content/projects/bwl-aqua-ad`, `/reference-review`는 404. 404 응답에 보이는 일치(각 2~3건)는 요청한 경로 문자열을 되풀이한 것이다.
- 참고 1: 광고 전환은 가로 이동(±14%)과 scale .94 ↔ 1, 투명도 교차이며 z축 이동·원근은 없다. 애니메이션·모션그래픽 전환(translateZ, rotateY, 클립 와이프)보다 깊이감이 약하다. 기존 `--ad` 변형 CSS의 의도된 값이라 결함으로 세지 않는다.

### 4. 태그 — PASS
`tags-pub.json`, `tags-rev.json`.
- 광고 레일 태그(`.cs-svc-ad-reel-tag .cs-tag`, "AI 가상인물 · 연출 예시"): 1440과 390 모두 `white-space: nowrap`, 높이 26px, 줄 수 1, 폭 135px로 잘림 없음(`scrollWidth == clientWidth`), 화면 안. 이전에는 두 줄이었다. 화면 `shots/pub-tags-1440-ad-hero.png`, `pub-tags-390-ad-tag.png`.
- 애니메이션 히어로 '연출 예시' 태그: 1440 위치 (831,178) 69×26, 하단 204px(뷰포트 900) 안, 조상 clip 없음. 390 위치 (32,322) 69×26, 하단 348px(뷰포트 844) 안. 이미지 위쪽에 놓여 접힘선과 무관하다. 화면 `shots/pub-tags-1440-anim-hero.png`, `pub-tags-390-anim-hero.png`.

### 5. 회귀 — PASS
- 메인 `/`(3214 대비, 공개판·검토판 둘 다 `main-compare-*.json`): 최상위 섹션 7개씩. 워크플로우(섹션 3) 외 6개 섹션의 outerHTML과 텍스트가 3214와 같다. 픽셀 비교는 VERIFY_R5와 동일한 값(공개판 390 섹션 5·6 6.2%·3.7%, 1440 섹션 5 2.3%는 워크플로우 높이 차이로 가장자리 위치만 다름. 검토판 390은 0%, 1440은 0.35/2.31/0.50%).
- 워크플로우(`wf-pub.json`, `wf-rev.json`): 단계 3개, 순서 개발 → 마케팅 → 컨텐츠, 레일 `01개발|02마케팅|03컨텐츠`. 1440 진행바 66/133/199px(트랙 199px). `/content` 링크 7개 모두 `target="_blank" rel="noopener noreferrer"`, 클릭 시 새 탭.
- `/content` 캐러셀 자동 넘김: 공개판 1440 3559, 3501, 3590ms, 390 3490, 3569ms(약 3.5초). 검토판은 영상 카드 체류 5.2초라 5201~5285ms(의도된 값).
- 웹툰 리더(공개판·검토판, 두 폭): 01/12 → 12/12(다음 11회), 이전으로 11/12, End/Home 키 동작. 페이지 넘김 중 rotY 0 → -4.4 → -19.8 → -59 → -126.7 → -163.9°.
- 콘솔·네트워크(20개 화면 × 2빌드): pageerror·console error 0, 4xx/5xx 응답 0, 가로 넘침 0(`scrollWidth == clientWidth`). 콘솔 경고는 "preloaded but not used"뿐(VERIFY_R5 결함 8과 같음).

## 3. 결함 목록

| 번호 | 심각도 | 화면·폭 | 내용 |
| --- | --- | --- | --- |
| 없음 | - | - | R5 수정분 5개 항목에서 새 결함은 발견하지 못했다 |

참고(결함 아님)
1. 광고 장면 전환은 z축 깊이가 없는 가로 이동 + scale + 투명도 교차다(위 3절). 애니메이션·모션그래픽과 결이 다르다.
2. 콘솔 경고 "link preload but not used"는 이전과 같이 남아 있다(VERIFY_R5 결함 8). 동작에는 영향이 없다.

이전 결함 중 이번 범위 밖으로 남은 것은 4(공개판 광고 가운데 소재가 이미지, Higgsfield 영상이 오면 해결)와 7(워크플로우 소개 제목 문구, 사용자 판단 사항)이다.

## 4. NOT_RUN
- 실기기·Safari·Firefox, 실제 탭 전환(숨김은 `document.hidden` 재정의로 에뮬레이션).
- 검토판 브랜드 영상 히어로의 네이티브 재생 컨트롤 클릭, prefers-reduced-motion 재검증(이번 수정은 해당 분기를 바꾸지 않아 생략. 영상 `video[controls]`는 대상 제외 규칙을 그대로 유지하는 코드 확인만 했다).

## 5. 보호 확인
- 3213(PID 41252), 3214(PID 41552): 검증 전후 모두 리스닝, 프로세스 변경 없음. 3214에는 읽기 전용 요청만 보냈다.
- 실제 작업트리 `.next/BUILD_ID` = `VyJyJwD8zeEXO5IGPQ7ZO`, SHA256 `54E8046B7D219AA9042B8AD1723ADA988C7F8AB5E12CDE8D2191176FB227503B`로 검증 전후 동일.
- 3217, 3218 서버 종료, 헤드리스 Chrome과 `r5-verify2` 관련 node 프로세스 0개. 소스 수정·커밋·push 없음(`git status` 깨끗). 산출물은 `.qa/r5-verify2/`(스냅샷과 두 빌드 포함)와 이 문서뿐이다.
