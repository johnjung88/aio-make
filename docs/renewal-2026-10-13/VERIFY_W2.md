# W2 타이포그래피 통일 독립 검증

2026-10-14 · 대상 커밋 `0e8be3b` (W2) · 검증자 Claude Sonnet · 기준 비교 커밋 `9998b0b`

**최종 판정: FAIL (재지시 1건).** 타입 검사·lint·직렬 테스트·빌드·폰트·넘침·콘솔·좌측선·보호 범위는 모두 재현되어 PASS. 단 `/content` 히어로에서 W2가 하단 여백 64px를 삭제해 회귀가 생겼다.

## 검증 방법

- 작업트리가 다른 작업자에 의해 수정 중이라 `git -c core.autocrlf=false archive 0e8be3b` 스냅샷(`.qa/w2-verify/src`)에서만 실행. node_modules와 `public/reference-review`는 junction. 기준선 비교용으로 `9998b0b`도 같은 방식으로 별도 스냅샷(`.qa/w2-verify/base`, 포트 3216)을 빌드했다.
- 처음 `git archive`에 autocrlf가 적용되어 `works.generated.ts`가 CRLF가 되어 `reference-release` 테스트가 실패했다. 스냅샷 추출 방식의 문제이며 autocrlf=false로 다시 추출해 해소했다. 커밋 자체의 결함이 아니다.
- 서버는 3215 한 개만 사용(기준선 비교 때만 3216 추가). 3213/3214는 건드리지 않았다. 브라우저는 Playwright(playwright-core 1.58 + 설치된 Chrome headless)로 페이지를 직렬로 열었고 폰트는 CDP `CSS.getPlatformFontsForNode`로 실제 렌더 폰트를 조회했다.
- 증거 파일: `.qa/w2-verify/metrics_*.json`(페이지별 4폭 측정 원본), `.qa/w2-verify/shots/*.jpg`(전체 화면 36장 + 히어로 전후 비교 4장), `.qa/w2-verify/crops/`.

## 1. 명령 검증

| 항목 | 결과 | 근거 |
|---|---|---|
| `npm run typecheck` | PASS | exit 0 |
| `npm run lint` | PASS | 오류 0, 경고 1(`tests/local-admin.test.mjs:110`, 기존 허용 경고) |
| 직렬 테스트 | PASS | 32개 중 pass 31, fail 0, skip 1. skip은 `AIO_VERIFY_LOCAL_MEDIA` 게이트 테스트이며 `AIO_VERIFY_LOCAL_MEDIA=1`로 `reference-release.test.mjs`를 따로 실행해 11/11 PASS |
| `next build` (`ENABLE_LEGACY_SUPABASE=false AIO_LOCAL_ADMIN_ENABLED=false`) | PASS | Compiled successfully, 22개 정적 페이지. `.env.local`의 검토 플래그는 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1` |

## 2. 브라우저 검증 (9개 경로 x 4폭 = 36 화면)

경로: `/`, `/about`, `/contact`, `/content`, `/content/services/webtoon`, `/marketing`, `/marketing/services/integrated`(첫 서비스 링크), `/lab`, `/lab/services/website`(첫 서비스 링크).

| 항목 | 결과 | 근거 |
|---|---|---|
| 가로 넘침(`scrollWidth>clientWidth`) | PASS | 36/36 모두 0 (`docScroll == clientWidth`) |
| 콘솔 오류 | PASS | 36/36 모두 0 (pageerror 포함) |
| 한글 실제 렌더 폰트 | PASS | 페이지당 한글 보유 요소를 (font-family, weight) 조합별로 3개씩 CDP 조회. 한글이 Pretendard Variable이 아닌 폰트로만 그려진 요소 0건. 한글+JetBrains Mono가 섞인 요소는 하위 내비 `01웹툰` 계열(숫자 2글자만 Mono, 한글은 Pretendard)뿐이라 정상 |
| 역할별 일관성 | PASS | 1440 기준 h1 74.88px/750/-2.995px(8개 경로 동일), h2 51.84px/700(홈·소개·컨텐츠·마케팅·개발 동일), h3 27.36px/650, 본문 p 16px/400/28px, eyebrow-ko 13px/650/0.26px, 헤더 nav 14px/500/19.6px. 390은 h1 34px, h2 28px, h3 20px, 본문 16px로 모든 경로 동일. 768/360도 RESULT_W2 값과 일치 |
| 좌측선(헤더 로고 / 본문 컨테이너 / 푸터 로고) | PASS | 1440: 56/56/56, 768: 30.72/30.72/30.72, 390과 360: 20/20/20. 9개 경로 모두 동일 |
| 제목 시각 깨짐 | FAIL(부분) | 홈·소개·마케팅·개발·컨텐츠 상세 전체 화면을 직접 확인. 제목 크기 이상(거대/축소), 겹침 없음. 단 `/content` 히어로 하단 여백 회귀(아래 재지시 1) |

### 보조 관찰 (FAIL 아님, 참고)

- `/lab` 히어로 모션 카드(`.motion-stage`)는 360/390에서 폭이 450px로 컨테이너(320/350px)보다 넓어 캡션 문장이 좌우로 잘린다. 기준선 `9998b0b`에서도 똑같이 450px라 W2 이전부터 있던 문제이며 `creative.css` 해당 규칙은 W2가 바꾸지 않았다.
- 360px에서 `right > 뷰포트` 요소(서비스 하위 내비 탭, `.motion-stage` 슬라이드)가 보이지만 문서 넘침은 0이다. 둘 다 `overflow` 컨테이너 안에 있다.
- `/content`의 `SELECTED WORK` 블록이 앞의 검은 띠에 붙어 보인다. 기준선에서도 `.work-home` 상단 값이 같다(eyebrow top == section top). W2 이전부터 있던 상태다.
- 홈 `#process` h2는 52px(1440)/25.35px(390)로 공통 h2와 다르다. 보호 범위(`.method-intro h2` `!important`)라 의도된 잔존.
- 마케팅·개발 서비스 상세의 히어로 h1이 54px에서 74.88px로 커졌다(공통 h1 적용 결과). 3줄로 접히지만 깨지지 않는다. 디자인 판단 사항.
- 1440에서 헤더 높이가 기준선 69px에서 76px로 7px 늘었다. 원인 미조사.
- `/content/services/webtoon`의 h1/h2/h3(43.92/40/21px)는 content-service 자체 규칙이라 지시대로 공통 비교에서 제외.

## 3. 소스 grep (`0e8be3b` 스냅샷)

| 항목 | 결과 | 근거 |
|---|---|---|
| `.guide-page` 일반 h1/h2/h3의 `!important` | PASS | 일반 제목 규칙에 `!important` 없음. 남은 것: `content-service.css:77,541`(h1, content-service 제외 범위), `review.css:868,1106`(`.method-intro h2`, `#process` 보호), `review.css:1115-1121,1210`(`[data-fit-line]` 보조 줄) |
| `Pretendard Variable` 정의되지 않은 문자열 | PASS | `app components lib` 0건 |
| Unbounded 인라인에 Pretendard 폴백 없는 문자열 | PASS(보호 예외) | 잔존 4건은 `main.jsx:650,677,704,731` `#process` 숫자 `01`~`04`(라틴 숫자만, 보호 구간). 나머지는 `var(--ff-display)`로 치환되어 폴백 체인에 Pretendard 포함. 렌더에서 `Unbounded` 첫 스택 요소의 한글도 Pretendard로 그려짐 |

## 4. 변경 금지 범위

| 항목 | 결과 | 근거 |
|---|---|---|
| `components/content-service/*` | PASS | `git diff 9998b0b 0e8be3b --name-only`에 없음 |
| 메인 `#process` 구조 | PASS | `main.jsx` diff 헝크가 old 597~778행 사이에 없음. `#process` JSX는 원문 그대로 |
| 메인 `#work`(HomeReferences) | PASS | `home-references.tsx`는 변경 없음. 홈 화면에서 구성·필터·카드 확인 |
| 공개 검토 게이트 | PASS | `lib`, catalog, gate, `content/works`, sitemap 파일 변경 없음. `reference-release` 11/11 PASS |
| sitemap에서 검토 작품 제외 | PASS | `/sitemap.xml` 48개 URL(기준선과 동일), `bwl/yofree/healer`와 `/work/<검토작품>` 없음. `marketing|lab/work/example-*`만 존재 |
| 검토 작품 noindex | PASS | `/work/bwl-brand-motion` 200 + `robots noindex, nofollow` |

## 재지시 FAIL 목록

| # | 위치 | 증상 | 기대 |
|---|---|---|---|
| 1 | `components/guide/studio-home.jsx:145` (`/content` 히어로 `.l-container` 인라인 스타일 `paddingBlock: "0"`) | W2 이전은 `padding: "0 clamp(20px,4vw,56px) clamp(36px,5vw,64px)"`였다. 지금은 하단 패딩이 0이다. 1440x900에서 h1 하단 902px = 히어로 하단 902px(기준선 831/895)로 제목이 히어로 아래 끝에 붙고 첫 화면에서 "제작 방향 살펴보기"가 잘린다(`shots/hero_content_w2_1440.jpg`와 `hero_content_base_1440.jpg` 비교) | `paddingBottom: "clamp(36px,5vw,64px)"` 복원(인라인 `paddingBlock`을 `paddingTop: 0`과 `paddingBottom`으로 분리). 복원 후 1440/390에서 h1/CTA 하단 간격이 기준선과 같아야 함 |

참고: 같은 방식으로 `paddingBlock: "0"`으로 바뀐 `marketing-home.jsx:1746`, `marketing-services.jsx:1436`, `lab-services.jsx:773`, `team.jsx:245`는 기준선에서 하단 패딩이 0이었거나(앞 3개) 상위 섹션이 자체 패딩을 가져(team, 간격 80px 대 86px) 회귀 없음을 측정으로 확인했다.

## 정리

- 3215·3216 서버 종료, 스냅샷 `src`·`base` 삭제(junction은 `rmdir`로 먼저 제거, 원본 `node_modules`와 `public/reference-review` 18개 폴더 유지 확인). 3213/3214 서버는 그대로 두었다.
- 작업 중 사용한 임시 스크립트는 세션 scratchpad와 `.playwright-mcp/w2v/`(검증 후 삭제)에만 있다.
