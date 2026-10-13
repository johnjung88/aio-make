# W2 타이포그래피 통일 결과

2026-10-14 · 버전 W2 로컬 후보 · 기준 HEAD `9998b0b` · 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`

**결과: PASS_LOCAL_SELF_CHECK.** 타입 검사·lint 오류 0·직렬 테스트·빌드 PASS. 지정 9개 경로 × 4개 폭, 36개 화면에서 가로 넘침 0·콘솔 오류 0·좌측선 일치. 한글 서체 스택/굵기 조합 224개를 실제 렌더 폰트로 검사해 모두 Pretendard Variable을 사용함. 별도로 모바일 주 메뉴를 연 18개 상태에서도 내비 타이포 일치·넘침 0·콘솔 오류 0.

## 변경

| 단계 | 적용 내용 |
|---|---|
| P0 | Pretendard 변수를 html로 이동하고 전역 --ff-text/display/mono에 한글 폴백을 연결 · 정의되지 않은 Pretendard Variable 문자열 및 SVG용 FF/UN 상수 정리 · 한글 링크/STEP/날짜/작업 facts는 text 역할로 전환 · 공개 로고 잠금 선택자 충돌 정리 |
| P1 | globals.css에 역할별 size/weight/leading/tracking 토큰 · 마지막 import type.css에서 h1/h2/h3/feature/lead/body/small/caption/eyebrow/nav/button/chip 역할 적용 · 같은 변경에서 JSX 제목 인라인 5속성 제거 및 일반 h1/h2 !important 제거 · 소개 모바일 H1 덮어쓰기 제거 |
| P2 | .guide-page 행간 normal→1.7 · 실제 UI 본문/라벨/버튼을 역할 클래스에 연결 · 반 픽셀 크기 정리 · FAQ 버튼 all:unset을 낮은 특이도의 reset 클래스로 이동 · 폼 라벨 14px/600, 입력 16px/400, 제출 16px/600/1.2 |
| P3 | --container 1440px, --gutter clamp(20px,4vw,56px) · 헤더/서브 내비/본문/푸터/목록/작업 상세에 같은 기준 · --section-y/sm으로 래퍼 세로 간격 토큰화 · 별도 --max 재정의 제거 · 헤더 높이 측정값에서 테두리 1px을 빼 ResizeObserver 크기 증가 순환 방지 |
| P4 | style 부분 문자열 선택자를 안정된 클래스로 전환 · 사용처 0건을 확인한 구형 헤더/내비/히어로/section-title/principles CSS 제거 · Unbounded 라틴/기호 서브셋 WOFF2와 next/font/local 선로딩 적용 |

타입 스케일의 제목은 Pretendard로 통일함. 로고·영문 eyebrow·숫자/장식에는 display/mono 토큰을 사용하며 한글 글리프는 Pretendard로 폴백함. 버튼은 기본 15px, 소형 14px, 제출/대형 16px으로 역할을 구분함. W1 서브 내비의 20px 행간·52px 브랜드 줄·36px CTA·모바일 두 줄 구성은 유지하고 변수로 연결함.

원본 Unbounded.ttf 778,272 bytes → 새 Unbounded-latin.woff2 238,612 bytes (69.34% 감소). 원본 TTF/OFL은 보존. fontTools와 이미 설치된 Git brotli.exe를 연결해 생성했으며 설치하지 않음. --font-display를 html에 함께 정의하고 next/font/local로 로드함. 보호된 #process 숫자 4곳을 위해 Unbounded 가족 별칭만 같은 WOFF2로 유지함.

## 변경 파일

- `app/(public)/layout.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `components/entries.tsx`
- `components/guide/about.jsx`
- `components/guide/creative.css`
- `components/guide/fixes.css`
- `components/guide/guide.css`
- `components/guide/inquiry-bridge.tsx`
- `components/guide/lab-contact.jsx`
- `components/guide/lab-home.jsx`
- `components/guide/lab-services.jsx`
- `components/guide/main.jsx`
- `components/guide/marketing-contact.jsx`
- `components/guide/marketing-home.jsx`
- `components/guide/marketing-services.jsx`
- `components/guide/reference-filters.tsx`
- `components/guide/review.css`
- `components/guide/service-detail.tsx`
- `components/guide/service-overview.tsx`
- `components/guide/showcase-video.tsx`
- `components/guide/studio-contact.jsx`
- `components/guide/studio-home.jsx`
- `components/guide/team.jsx`
- `components/guide/ux.css`
- `components/site-shell.tsx`
- `components/work-portfolio.css`
- `components/work-portfolio.tsx`
- `components/guide/type.css`
- `public/fonts/Unbounded-latin.woff2`

- 이 보고서: `docs/renewal-2026-10-13/RESULT_W2.md`
- 검사·화면·재현 스크립트·해시: `.qa/w2/` (gitignore 대상, 커밋 없음)
- 기존/동시 변경인 HANDOFF_RESUME.md, BRIEF_P3.md, BRIEF_P4.md, PLAN_P6_FOLDER.md는 이 작업의 수정 파일 목록에서 제외하고 보존함

## 실제 검증

| 명령/검사 | 결과 | 근거 |
|---|---|---|
| npm run typecheck | PASS | .qa/w2/check-1.log |
| npm run lint | 오류 0, 기존 경고 1 | .qa/w2/check-2.log · tests/local-admin.test.mjs:110 options unused |
| node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs | 32개 중 PASS 31, FAIL 0, SKIP 1 | .qa/w2/check-3.log · 검토 원본 로컬 미디어 파생본 검사는 체크아웃에 없어서 SKIP |
| npm run build | PASS | .qa/w2/check-4.log |
| 카피/DOM 구조/보호 구간 | PASS | .qa/w2/scope-verification.json · TypeScript AST에서 타이포·간격 속성/클래스/불필요한 날짜 비교를 제외해 기준 버전과 비교 |
| 브라우저 | 36/36 PASS | .qa/w2/after-metrics.json, summary.json |
| 모바일 열린 주 메뉴 | 18/18 PASS | .qa/w2/mobile-nav-metrics.json |
| 공개 검토 게이트 | PASS | 기존 reference-release 직렬 테스트 통과 및 gate/catalog/content/works 소스 변경 없음 |

ego-browser CLI가 이 세션 PATH에 없어 저장소의 capture-review-preview.mjs 방식에 따라 설치된 Chrome을 로컬 CDP로 사용함. 페이지는 직렬 탐색했고 검사 서버는 3215만 사용함. 각 페이지에서 document.fonts.ready 이후 계산값을 수집하고, 한글을 가진 모든 보이는 텍스트 요소의 고유 font-family/weight 조합마다 같은 스타일의 '한글' 프로브를 만들어 CSS.getPlatformFontsForNode로 실제 사용 가족을 확인함. 라틴과 한글이 섞인 스택의 첫 한글 렌더 가족도 Pretendard Variable이었음. 서체 검사에서 프로브의 폰트 로딩과 두 프레임 렌더 완료를 기다림.

## 역할별 페이지 간 계산값

아래 값은 실제 CSS px. 공통 스케일 비교는 8개 경로(/, /about, /contact, /marketing, /lab, 마케팅·개발 상세 각 1개, /content)에 적용함. 해당 역할이 없는 페이지는 샘플 0건이며 값을 만들어 기록하지 않음. 모바일 nav는 메뉴를 열어 측정했고 subnav는 W1의 고정 20px 행간을 별도 역할로 기록함. 제출 버튼은 buttonLg로 비교함.

| 폭 | 역할 | font-size / weight / line-height / letter-spacing | 비교 샘플 | 결과 |
|---:|---|---|---:|---|
| 1440 | h1 | 74.88px / 750 / 89.856px / -2.9952px | 8 | PASS |
| 1440 | h2 | 51.84px / 700 / 64.8px / -1.8144px | 33 | PASS |
| 1440 | eyebrow | 12px / 500 / 18px / 1.68px | 11 | PASS |
| 1440 | eyebrowKo | 13px / 650 / 19.5px / 0.26px | 16 | PASS |
| 1440 | body | 16px / 400 / 28px / -0.16px | 27 | PASS |
| 1440 | lead | 20px / 400 / 35px / -0.2px | 10 | PASS |
| 1440 | nav | 14px / 500 / 19.6px / -0.14px | 24 | PASS |
| 1440 | subnav | 14px / 500 / 20px / -0.14px | 19 | PASS |
| 1440 | button | 15px / 600 / 18px / -0.15px | 16 | PASS |
| 1440 | buttonLg | 16px / 600 / 19.2px / -0.16px | 2 | PASS |
| 768 | h1 | 39.936px / 750 / 47.9232px / -1.59744px | 8 | PASS |
| 768 | h2 | 28px / 700 / 35px / -0.98px | 33 | PASS |
| 768 | eyebrow | 12px / 500 / 18px / 1.68px | 11 | PASS |
| 768 | eyebrowKo | 13px / 650 / 19.5px / 0.26px | 16 | PASS |
| 768 | body | 16px / 400 / 28px / -0.16px | 27 | PASS |
| 768 | lead | 17px / 400 / 29.75px / -0.17px | 10 | PASS |
| 768 | nav | 14px / 500 / 19.6px / -0.14px | 24 | PASS |
| 768 | subnav | 14px / 500 / 20px / -0.14px | 19 | PASS |
| 768 | button | 15px / 600 / 18px / -0.15px | 16 | PASS |
| 768 | buttonLg | 16px / 600 / 19.2px / -0.16px | 2 | PASS |
| 390 | h1 | 34px / 750 / 40.8px / -1.36px | 8 | PASS |
| 390 | h2 | 28px / 700 / 35px / -0.98px | 33 | PASS |
| 390 | eyebrow | 12px / 500 / 18px / 1.68px | 11 | PASS |
| 390 | eyebrowKo | 13px / 650 / 19.5px / 0.26px | 16 | PASS |
| 390 | body | 16px / 400 / 28px / -0.16px | 27 | PASS |
| 390 | lead | 17px / 400 / 29.75px / -0.17px | 10 | PASS |
| 390 | nav | 14px / 500 / 19.6px / -0.14px | 24 | PASS |
| 390 | subnav | 14px / 500 / 20px / -0.14px | 19 | PASS |
| 390 | button | 15px / 600 / 18px / -0.15px | 16 | PASS |
| 390 | buttonLg | 16px / 600 / 19.2px / -0.16px | 2 | PASS |
| 360 | h1 | 34px / 750 / 40.8px / -1.36px | 8 | PASS |
| 360 | h2 | 28px / 700 / 35px / -0.98px | 33 | PASS |
| 360 | eyebrow | 12px / 500 / 18px / 1.68px | 11 | PASS |
| 360 | eyebrowKo | 13px / 650 / 19.5px / 0.26px | 16 | PASS |
| 360 | body | 16px / 400 / 28px / -0.16px | 27 | PASS |
| 360 | lead | 17px / 400 / 29.75px / -0.17px | 10 | PASS |
| 360 | nav | 14px / 500 / 19.6px / -0.14px | 24 | PASS |
| 360 | subnav | 14px / 500 / 20px / -0.14px | 19 | PASS |
| 360 | button | 15px / 600 / 18px / -0.15px | 16 | PASS |
| 360 | buttonLg | 16px / 600 / 19.2px / -0.16px | 2 | PASS |

## 경로·폭별 좌측선/넘침/제목 크기

본문 x는 제목을 감싼 실제 컨테이너의 왼쪽 content edge. 가운데 정렬 제목의 글자 시작 x와는 구분함. 헤더·푸터는 로고 시작 x, 서브 내비는 분과 브랜드 시작 x. 데스크톱 스크롤바로 요소 전체 폭은 1425px인 경우가 있으나 vw는 지정 CSS 뷰포트 기준임.

| 경로 | 폭 | H1 크기 | H2 크기 | 헤더 x | 본문 x | 푸터 x | 서브 내비 x | 넘침 / 콘솔 |
|---|---:|---|---|---:|---:|---:|---:|---|
| / | 1440 | 74.88px | 51.84px | 56 | 56 | 56 | — | 0 / 0 |
| / | 768 | 39.936px | 28px | 30.71875 | 30.72 | 30.71875 | — | 0 / 0 |
| / | 390 | 34px | 28px | 20 | 20 | 20 | — | 0 / 0 |
| / | 360 | 34px | 28px | 20 | 20 | 20 | — | 0 / 0 |
| /about | 1440 | 74.88px | 51.84px | 56 | 56 | 56 | — | 0 / 0 |
| /about | 768 | 39.936px | 28px | 30.71875 | 30.72 | 30.71875 | — | 0 / 0 |
| /about | 390 | 34px | 28px | 20 | 20 | 20 | — | 0 / 0 |
| /about | 360 | 34px | 28px | 20 | 20 | 20 | — | 0 / 0 |
| /contact | 1440 | 74.88px | — | 56 | 56 | 56 | — | 0 / 0 |
| /contact | 768 | 39.936px | — | 30.71875 | 30.72 | 30.71875 | — | 0 / 0 |
| /contact | 390 | 34px | — | 20 | 20 | 20 | — | 0 / 0 |
| /contact | 360 | 34px | — | 20 | 20 | 20 | — | 0 / 0 |
| /marketing | 1440 | 74.88px | 51.84px | 56 | 56 | 56 | 56 | 0 / 0 |
| /marketing | 768 | 39.936px | 28px | 30.71875 | 30.72 | 30.71875 | 30.71875 | 0 / 0 |
| /marketing | 390 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /marketing | 360 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /lab | 1440 | 74.88px | 51.84px | 56 | 56 | 56 | 56 | 0 / 0 |
| /lab | 768 | 39.936px | 28px | 30.71875 | 30.72 | 30.71875 | 30.71875 | 0 / 0 |
| /lab | 390 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /lab | 360 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /marketing/services/integrated | 1440 | 74.88px | 51.84px | 56 | 56 | 56 | 56 | 0 / 0 |
| /marketing/services/integrated | 768 | 39.936px | 28px | 30.71875 | 30.72 | 30.71875 | 30.71875 | 0 / 0 |
| /marketing/services/integrated | 390 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /marketing/services/integrated | 360 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /lab/services/website | 1440 | 74.88px | 51.84px | 56 | 56 | 56 | 56 | 0 / 0 |
| /lab/services/website | 768 | 39.936px | 28px | 30.71875 | 30.72 | 30.71875 | 30.71875 | 0 / 0 |
| /lab/services/website | 390 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /lab/services/website | 360 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /content | 1440 | 74.88px | 51.84px | 56 | 56 | 56 | 56 | 0 / 0 |
| /content | 768 | 39.936px | 28px | 30.71875 | 30.72 | 30.71875 | 30.71875 | 0 / 0 |
| /content | 390 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /content | 360 | 34px | 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /content/services/webtoon | 1440 | 43.92px | 40px, 51.84px | 56 | 56 | 56 | 56 | 0 / 0 |
| /content/services/webtoon | 768 | 29px | 26px, 28px | 30.71875 | 30.72 | 30.71875 | 30.71875 | 0 / 0 |
| /content/services/webtoon | 390 | 29.64px | 26px, 28px | 20 | 20 | 20 | 20 | 0 / 0 |
| /content/services/webtoon | 360 | 27.36px | 26px, 28px | 20 | 20 | 20 | 20 | 0 / 0 |

| 경로 (1440px) | 변경 전 헤더 / 본문 / 푸터 x | 변경 후 |
|---|---|---|
| / | 48 / 100.5 / 100.5 | 56 / 56 / 56 |
| /about | 48 / 100.5 / 100.5 | 56 / 56 / 56 |
| /contact | 48 / 72 / 100.5 | 56 / 56 / 56 |
| /marketing | 48 / 48 / 100.5 | 56 / 56 / 56 |
| /lab | 48 / 48 / 100.5 | 56 / 56 / 56 |
| /marketing/services/integrated | 48 / 48 / 100.5 | 56 / 56 / 56 |
| /lab/services/website | 48 / 48 / 100.5 | 56 / 56 / 56 |
| /content | 48 / — / 100.5 | 56 / 56 / 56 |
| /content/services/webtoon | 48 / 56 / 100.5 | 56 / 56 / 56 |

## 전후 화면과 범위 보존

- `.qa/w2/compare.html`에서 10쌍을 나란히 비교 가능: /, /about, /contact, /marketing, /content/services/webtoon × 1440/390
- 원본 PNG는 `.qa/w2/before/`, 수정 PNG는 `.qa/w2/after/`; 화면을 직접 열어 메인/소개/마케팅/컨텐츠 상세 대표 화면의 한글 줄바꿈·잘림·헤더와 본문 간격을 확인함
- components/content-service/*는 수정하지 않음 · /content 구성과 카피 유지 · 기본 본문 토큰 변화가 상세의 상속값에 반영될 수 있으나 4개 폭에서 잘림/넘침 없음
- 컨텐츠 상세 h1/h2 자체 크기 규칙은 재기획 대기 범위이므로 공통 제목 PASS 대상에서 제외하며 실측값은 위 경로별 표에 기록함; 공유 쇼케이스 h2는 공통 토큰을 사용함
- 메인 HomeReferences 컴포넌트 및 #process JSX 원문을 보존함 · method-/work-home/reference-heading 전용 스타일은 보호 범위로 보존함 · #process의 영문 숫자 Unbounded 인라인 4곳과 process 전용 제목 !important는 다음 P4 교체까지 남음
- 일반 .guide-page h1/h2 !important는 제거했으며 data-fit-line의 상속/fit 처리, 접근성 reduced-motion 및 보호된 과정 섹션 규칙은 유지함
- 공개 권리 18작품 visibility:review / 정확한 검토 플래그 / noindex / sitemap 제외는 그대로 유지됨

## 남은 일과 상태

요청된 W2 적용·로컬 검증 완료. 독립 Sonnet 검토와 사용자 디자인 확인은 NOT_RUN이며 조율자 단계임. 컨텐츠 상세 재기획, /content 구성 P3, 메인 #work/#process 교체·삭제 P4는 원래 후속 범위로 남음. 커밋·push·배포·설치·환경변수 변경·외부 전송은 하지 않음. 검사 서버 3215와 이 작업이 만든 Chrome은 종료하며 3213·3214는 건드리지 않음. 종료 확인은 .qa/w2/cleanup.json에 별도로 기록함.
