# VERIFY R8 트랙 A (WP-A1 메인 / WP-A2 컨텐츠 홈)

2026-10-16 · 대상: HEAD `90fafb3` + 미커밋 R8 A1·A2 수정(`RESULT_R8_A1.md`, `RESULT_R8_A2.md`) · 독립 검증 담당 · 소스 수정 없음(.qa 아래 산출물만)

## 결론
- 판정: **PASS (FAIL 0건)**. M1~M16, C1~C6 전 항목 6개 폭(360·390·430·768·1024·1440)에서 충족. 메모(결함 아님) 4건은 아래 "관찰 사항".
- 자동 검사: typecheck PASS, lint 오류 0(기존 경고 1), 전체 직렬 테스트 192개 중 pass 191 / fail 0 / skipped 1.

## 환경
| 항목 | 값 |
|---|---|
| 스냅샷 | `.qa/r8-verify/src-a` (파일 1424개, 미커밋 상태 그대로, `public`·`node_modules` junction, manifest `.qa/r8-verify/src-a-manifest.json`) |
| 빌드 | 검토판 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`, `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, `NODE_OPTIONS=--max-old-space-size=1536`, 포그라운드 exit 0, **BUILD_ID `iLF2-tRvphlSYhDJ5mKUD`** (로그 `.qa/r8-verify/build-review.log`) |
| 서버 | 이전 3215(PID 24600) 종료 후 스냅샷에서 `next start -p 3215`, **PID 14204**, 검증 후에도 계속 켜 둠 (`netstat` LISTENING 확인) |
| 작업트리 `.next` | 건드리지 않음 |
| 측정 | `.qa/r8-verify/r8a.cjs`(6폭), `txt.cjs`(보이는 텍스트 재검사), 결과 `.qa/r8-verify/data/r8a.json`, 요약 `sum1.cjs`·`sum2.cjs` |
| 중앙 판정 방법 | 요소 `getBoundingClientRect` 중심과 컨테이너(content box) 중심 차이(`elDev`), 줄별 글자 Range 중심과의 차이(`lineDevMax`), `text-align` 계산값 |

명령 결과(작업트리): `npm run typecheck` exit 0 · `npm run lint` 오류 0, 경고 1(`tests/local-admin.test.mjs` 110:38, 기존) · `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` tests 192, pass 191, fail 0, skipped 1(로컬 미디어 파생물 테스트, 제외 사유 명시된 기존 skip). 로그 `.qa/r8-verify/typecheck.log`, `lint.log`, `tests.log`.

## 항목별 판정: 메인 `/` (M1~M16)
기준: 중심 차이 ≤ 2px. 표의 값은 6개 폭 공통(차이 있는 폭만 따로 표기).

| 번호 | 판정 | 수치 근거 |
|---|---|---|
| M1 히어로 가운데 | PASS | eyebrow·제목·부제·버튼 행 모두 `text-align:center`, 요소 중심 차이 0px, 줄별 중심 차이 제목·부제 0, 버튼 2개 합집합 중심 차이 0. eyebrow는 ■ 표식+글자 묶음이 정확히 중앙(x 621.3~818.7, 중심 720=화면 중심, 1440). 글자만의 줄 중심이 9px 어긋나는 것은 표식 폭 때문이다. 제목은 360~1440에서 2줄 `분야별 전문가들이 / AI와 함께 일합니다`, 부제는 360·390·430에서 2줄(마지막 줄 "결과를 함께 확인하세요"/"함께 확인하세요", 한 글자 줄 없음), 768 이상 1줄 |
| M2 분야 제목 | PASS | `필요한 분야만 골라 맡기세요` 1줄, 중심 차이 0, `text-align:center` |
| M3 HOW WE WORK 머리 | PASS | eyebrow·h2(`기획부터 성과까지 / 하나로 이어집니다`) 중심 차이 0, 머리 자식은 eyebrow와 h2뿐(부제 없음) |
| M4 부제 삭제 | PASS | `필요한 단계만 맡기셔도`, `단계마다 하는 일과 결과물` 보이는 텍스트·DOM 0건 |
| M5 레일 확대 | PASS | 아래 별도 표 |
| M6 개발 리드 | PASS | `.wj-lead-line` 2개가 정확히 `새롭게 기획한 브랜드 가이드를` / `문의나 구매로 이어지도록 설계`, 화면에서도 6개 폭 모두 2줄(줄바꿈 위치 일치) |
| M7 02 MARKETING 머리 | PASS | eyebrow(점 포함 요소)·h2·리드 중심 차이 0(단계 열 기준), 6개 폭 |
| M8 마케팅 리드 | PASS | `어느 채널에, 어떻게 보여줄지 계획하고` / `데이터를 쌓아, 개선하면서 성과 극대화` 정확 일치, 360px에서도 2줄 유지(줄 분리 없음) |
| M9 03 CONTENT 머리 | PASS | 동일, 차이 0 |
| M10 컨텐츠 리드 | PASS | `브랜드 가이드로 기준을 잡고` / `웹툰부터 SNS 영상까지 직접 제작` 정확 일치, 2줄 |
| M11 상담 행 삭제 | PASS | `어디서부터 시작할지`, `상담에서 함께 정합니다` 0건, `.wj-closing` 없음, `.wj` 안 링크·버튼에 `견적 문의` 없음 |
| M12 상표 고지 삭제 | PASS | `각 회사의 상표`, `상표입니다`, `Instagram, Facebook` 0건(보이는 텍스트 390·1440, 스크립트 제외 textContent) |
| M13 캡션 삭제 | PASS | 보이는 `기존 공식몰 첫 화면`, `2026-10-10 캡처` 0건, `.wj-caption` 없음. 단 이미지 alt `DR's Secret 기존 공식몰 첫 화면 PC/모바일 캡처`(`lib/home-journey-data.ts` 45, 52행)는 남아 있다. 화면 캡션이 아닌 접근성 문구이므로 PASS, 삭제 대상 해석은 사용자 확인 사항 |
| M14 OUR STANDARD | PASS | eyebrow·인용문 `text-align:center`, 중심 차이 0. 인용문은 390 이상 2줄 `만드는 일의 끝은, / 고객이 쓰기 시작하는 순간입니다`, 360은 3줄 `… 시작하는 / 순간입니다`(한 글자 줄 아님) |
| M15 "기획 · 제작 · 검수 · 인계" 삭제 | PASS | 문자열 0건, `.main-standard-caption` 없음 |
| M16 개발 단계 머리 | PASS | 마케팅·컨텐츠와 같은 규칙, 중심 차이 0, 제목 `웹사이트와 쇼핑몰을 / 가이드대로 만듭니다` 2줄 |

### M5 레일 측정
| 폭 | 레일 폭 | 라벨 글자 | 레일 높이 | 개발 시안 높이(`.wj-cmp` / 이미지 영역) | 레일/시안 | 레일 오른쪽 끝~본문 왼쪽 | 본문 열 폭 = 시안 폭 |
|---|---|---|---|---|---|---|---|
| 1024 | 250px | 22px(650) | 345px | 460.6 / 400.6 | 0.749 | 간격 51.2px(겹침 없음) | 640.9px |
| 1100 | 250 | 22px | 345 | 501.9 | 0.687 | 55px | 707 |
| 1279 | 250 | 23.0px | 348 | 599.2 | 0.581 | 63.9px | 862.8 |
| 1280 | 280 | 23.0px | 348 | 581 | 0.599 | 64px | 833.6 |
| 1440 | 280px | 25.92px(650) | 357px | 610 / 550 | 0.585 (이미지 영역 대비 0.649) | 72px | 976px(시안 이미지 880) |
- 번호 글자 16px(650), 행 높이 99~103px. 이전 HEAD의 레일 폭 변수는 240px였다. 레일은 모든 폭에서 sticky, 본문과 겹침 0. 768 이하에서는 레일이 `display:none`이고 단계 표식(점+eyebrow)만 보인다(의도).
- 1024~1279 본문 열 폭은 641~863px로 개발 시안이 이 폭 그대로 들어가며 가로 넘침 없음(`RESULT_R8_A1` 예상 약 650 일치).
- 판정 기준을 "레일 높이가 시안 이미지 높이 550의 절반 이상"(`RESULT_R8_A1`)으로 보면 1440에서 357 / 550 = 0.65로 충족.

## 항목별 판정: 컨텐츠 홈 `/content` (C1~C6)
| 번호 | 판정 | 수치 근거 |
|---|---|---|
| C1 SERVICES 머리 가운데 + 강조 | PASS | eyebrow·h2 `text-align:center`, 중심 차이 0, h2 2줄 `이야기에 맞는 형식 / 결과물로 살펴보세요`. 강조 단어 `형식`: 색 `rgb(185,174,255)`(#b9aeff), 본문 h2 `rgb(247,245,242)`, 배경 `rgb(8,8,8)`. 대비 10.07:1(본문 h2 18.4:1), 강조색 대 본문색 1.83:1. `font-style normal`, weight 700 동일, `<em class="cs-head-em">` |
| C2 PROCESS 머리 가운데 + 강조 | PASS | 동일 수치, h2 `상담에서 납품까지 / 네 단계로 진행합니다`, 강조 `네 단계`, 대비 10.07:1 |
| C3 부제 삭제 | PASS | `카드를 넘겨 제작 형식과`, `실제 작업물을 살펴보세요` 0건, 머리 자식은 `.cs-head-main` 하나, `.cs-head-lead` 없음 |
| C4 부제 삭제 | PASS | `단계마다 확인하는 것과`, `미리 알려드립니다` 0건 |
| C5 "받는 것" 줄 삭제 | PASS | `받는 것`, `확인하는 것` 6개 폭 보이는 텍스트·DOM 0건, `.ch-step-output`·sr-only 라벨 없음(`.ch-step` 자식은 art·name·text 3개) |
| C6 4단계 문구 | PASS | `.ch-step-text` 정확 일치 4건: `서비스와 분량을 확정합니다` / `컨텐츠별로 기획한 내용을 전달하고 공유합니다` / `확정한 기획안대로 제작하고 공유합니다` / `게시할 채널에 맞춰 최종 편집후 결과물을 전달합니다`("편집후" 지시 그대로). 한 글자 줄 없음: 360·390·430·768은 각 1줄, 1024는 2·3·4단계 2줄(`확정한 기획안대로 / 제작하고 공유합니다`), 1440은 4단계만 2줄(`게시할 채널에 맞춰 최종 편집후 / 결과물을 전달합니다`) |

## 공통 검사
| 항목 | 판정 | 근거 |
|---|---|---|
| 가로 스크롤 0 | PASS | `/`·`/content` × 6폭 + `/` 1100·1279·1280, 전부 `scrollWidth == clientWidth` |
| 콘솔 오류 0 | PASS | `pageerror`·`console.error` 0건(리소스 로드 실패 필터 적용 전후 모두 0) |
| 한 글자 줄(orphan) | PASS | 두 페이지 h1~h3 전 폭 스캔 결과 줄 길이 ≤2글자인 다중 줄 제목 0건 |
| 여백 붕괴 | PASS | 삭제 항목 주변 수치: 머리~본문 간격 `/` 64px, 분야 제목~카드 48~80px, 마지막 단계~OUR STANDARD 65~97px, `/content` 머리~갤러리·단계 48(모바일)/64px. 육안 확인에서도 붕괴·겹침 없음 |

## 스크린샷(`.qa/r8-verify/shots-a/`, 직접 확인)
| 대상 | 390 | 1440 |
|---|---|---|
| 히어로 | `main-390-hero.png` | `main-1440-hero.png` |
| 분야 제목 | `main-390-divisions-title.png` | `main-1440-divisions-title.png` |
| HOW WE WORK | `main-390-howwework.png` | `main-1440-howwework.png` |
| 레일 + 개발 시안 | (레일 없음, `main-390-step-dev.png`) | `main-1440-rail-dev.png` |
| 단계 머리 3개 | `main-390-step-dev/marketing/content.png` | `main-1440-step-dev/marketing/content.png` |
| 마지막 단계~OUR STANDARD | `main-390-journey-end.png`, `main-390-standard.png` | `main-1440-journey-end.png`, `main-1440-standard.png` |
| /content SERVICES 머리 | `content-390-services-head.png` | `content-1440-services-head.png` |
| /content PROCESS 머리·4단계 | `content-390-process-head.png`, `content-390-process-steps.png` | `content-1440-process-head.png`, `content-1440-process-steps.png` |
육안 판정: 줄바꿈 어색함(한 글자 줄)·균형 문제·여백 붕괴·겹침 모두 없음. 히어로 제목·부제·버튼, 분야 제목, 단계 머리, OUR STANDARD, SERVICES·PROCESS 머리 모두 시각적으로 가운데. 레일은 지시 전(img55의 작은 번호·라벨)보다 뚜렷이 커져 시안과 균형이 맞는다.

## 관찰 사항(결함 아님, 판단은 메인)
1. 1024 이상에서 HOW WE WORK 머리는 화면 중심(x=720)이고 단계 머리 3개는 본문 열 중심(x=896, 1440)이라 두 머리가 176px 어긋나 보인다. 브리프가 "컨테이너/열 중심"이라 PASS이나, 시각적으로 어색하다고 판단하면 단계 머리를 화면 중심으로 바꿀 수 있다(레일과 겹침이 생기는지 확인 필요).
2. `/content`의 강조색 `#b9aeff`는 컨텐츠 사이트 eyebrow 토큰이며 메인 히어로의 밝은 강조색(`rgb(169,155,255)`, #a99bff)과 비슷하지만 같지 않다. 메인 키워드 색과 완전히 같게 하려면 토큰을 맞춰야 한다.
3. `/content` 4단계는 머리가 가운데인데 단계 행은 왼쪽 정렬이다(`RESULT_R8_A2`가 우려한 부분). 1440 육안으로는 어색하지 않으나 디자인 취향 확인 대상.
4. 이미지 alt에 `기존 공식몰 첫 화면 … 캡처`와 고객명(`DR's Secret`)이 남아 있다(M13 캡션과 별개, 검토 게이트 안). 공개판 문자열 0건 정책은 이번 검토판에서 검사하지 않았다.

## 발견 결함
없음.

## NOT_RUN
- 공개판(플래그 없음) 빌드와 공개판 HTML 금지 문자열 검사, `tests/seo-http.mjs`
- 브라우저는 Chrome headless 한 종류만(Safari·Firefox·실기기 미확인), 터치·스와이프 동작 검증, `prefers-reduced-motion`
- 360·430·768·1024 폭 스크린샷(수치 측정만 수행. 스크린샷은 390·1440만)
- 트랙 B 항목(R8 문서의 2장), 18개 `/content/projects/*`와 서비스 6페이지의 정렬 변경 영향 확인(공통 `.cs-head--center`는 홈의 SERVICES·PROCESS에서만 사용됨을 코드로만 확인)
- 외부 배포·커밋은 하지 않음
