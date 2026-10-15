판정: FAIL — 캐러셀 슬롯 크롭 보정이 미적용이며 재빌드 예외 결정 대기

- 기준: `03ce0e4297c8d2f857ef223aa672f0ba150e5cc6`, `codex/WRK-20261013-AIO-CONTENT-RENEWAL`, `SPEC_R8_W1_PAGES.md` 및 승인된 `BRIEF_R8.md`
- 버전: R8-W1, 2026-10-16
- 구현자가 직접 수행한 자체 검증이며 독립 검토·사용자 최종 디자인 승인·커밋·push·배포를 뜻하지 않는다
- 기존 사용자 변경 `HANDOFF_RESUME.md`와 작업 전부터 있던 `SPEC_R8_W1_PAGES.md`는 수정하지 않았다

## 필수 잔여 1건

- 홈 캐러셀 신규 16:10 프레임이 모바일 280×320 슬롯에서 contain으로 표시되어 상하 여백이 남는다
- BRIEF 2-1의 슬롯 비율 크롭을 맞추는 후보는 `.qa/r8-w1/carousel-crop-candidate.css`와 `shots/carousel-crop-candidate-390.png`에 준비했다
- 후보는 소스와 빌드에 적용하지 않았다, SPEC의 “next build는 마지막에 한 번만” 제약에 대한 예외 질문 `msg_e8b18356dbc4`와 escalation은 미응답이다
- 이 잔여 때문에 W1 전체 완료로 판정하지 않는다, 아래 빌드·84화면·누수·SEO 검사는 현재 미적용 코드에서 실제 통과한 결과다
- 다음 담당은 예외 결정 후 후보 CSS를 반영하고 검토판·공개판 최종 재빌드와 영향 화면 검증을 수행한다

## WP·Q 처리

| WP / Q | 처리 |
|---|---|
| B1 / Q4–Q7, Q41 | 캐러셀 설명 6종 승인문 그대로, 슬롯 크롭은 위 잔여 참조, 제작 상태 배지 제거, 검토 작품이 있을 때만 작업 링크 표시, AI 이미지 태그 유지, 카드 정지 프레임과 고객명 없는 alt 적용, 기존 쇼핑몰 PC·모바일 alt 정리 |
| B2 / Q8–Q10 | ALL SERVICES 6장 신설, CONTACT 바로 위, h2→h3, 카드당 링크 1개, 서비스명 포함 접근성 라벨, 1·2·3열과 작은 폭의 짧은 CTA 적용 |
| B3a 1단계 / Q30–Q31 | 가격 그룹·라벨·금액·범위·주석, 6단계 과정 행, FAQ 질문·답변 가운데 정렬, 읽기 컨테이너 가운데, 문의·다른 서비스 기존 흐름 유지 |
| B3a 공통 | ReelPlayer(포스터 대체·마운트 후 무음 play·사용자 정지·reduced-motion), CutBoard(화면비 전환·metadata 뒤 seek), FigureRow, 타입과 공통 슬롯 추가 |
| B3a 웹툰 / Q14, Q32–Q34 | STORY TYPES→READ(12컷)→ONE CUT(텍스트 4단계, 줄거리 카드·기존 완성 컷 2장)→MOTION COMIC, 가격 링크, 과정 6단계·FAQ 7개 |
| B3a 애니메이션 / Q35–Q36 | 16:9 클레이 발췌 포스터, FORMS→CHARACTER→STORYBOARD→REFERENCE, 6칸 타임라인, 빈 목록 생략·7개 이상 더 보기, 애니매틱·소리 맞춤 범위와 FAQ |
| B3b AI / Q16, Q37–Q40 | 인물 설계 4항목·운영 별도 행, 캐릭터 시트 2×2·프로필·규칙, ONE CHARACTER 슬롯, 수 고정 없는 덱·캡션, 3명 미만 정적 가드, 피드·탭·account 렌더 제거, 제안용 시안·AI 고지, 사례 중복 placement 적용 |
| B3b 모션그래픽 / Q19, Q42–Q43, Q45 | MOTION GRAMMAR→SAMPLE FILM→PLANNING SHEET→BRAND CHARACTER, 컷별 보드, 기획 이미지 연락처 열 크롭, 근거 없는 말투·성격 삭제, 음악·동시 화면비 견적 FAQ |
| B3c 브랜드 / Q21–Q22, Q41–Q42, Q44 | STORY STRUCTURE 4장·6컷 보드·8장 비례 막대·SOURCES·LENGTH, 61.8초 캡션, 검토 작품 분기와 noindex 유지 |
| B3c SNS / Q18, Q22–Q24, Q41 | HOOK→SAMPLE FILM→PRODUCT CLIPS→VERTICAL EDIT, 실제 포스터 레일·폰 프레임·DOM 자막 띠, type 문구·정지 3장 전환 제거, 제외 컷 없는 보드·소리 열은 대본 설계로 표시, 검토 작품 분기 유지 |
| 공통 카피 | “최종 편집 후”로 수정, 시작가·플랜과 새 FAQ 금액은 `lib/content-pricing.ts` 참조, 모든 서비스 과정 6단계·FAQ 7개, 레지스트리 순서 유지 |
| Q1–Q3, Q5 | 이미 확정된 정렬·컨텐츠 토큰·키워드 결정 유지, 신설 머리 강조 “골라” 적용 |
| Q11–Q29의 영상·음원 실행 / WP-V·V2 | W1 범위 밖, 실제 렌더·음원·소리 UI는 미실행, 정지 프레임과 슬롯·관련 문구만 반영 |

## 실제 검증

| 명령 / 대상 | 결과 / 증거 |
|---|---|
| `npm run typecheck` | PASS, `.qa/r8-w1/typecheck.log` |
| `npm run lint` | 오류 0, 기존 `tests/local-admin.test.mjs` 미사용 options 경고 1개, `.qa/r8-w1/lint.log` |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | 180개, 179 PASS / 0 FAIL / 기존 1 SKIP, `.qa/r8-w1/tests-final.log` |
| 검토판 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1 next build` | exit 0, `.qa/r8-w1/build-review*.log`, `build-review-exit.json` |
| 공개판 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=0 next build` | exit 0, `.qa/r8-w1/build-public.log`, `build-public-exit.json` |
| 빌드 환경 | `.qa/r8-w1/src` 격리 스냅샷, public·node_modules junction, 비밀값 미복사, QA 설정만 cpus=1·webpackBuildWorker=false·heap 1536MB, 동시 빌드 없음 |
| Playwright 검토판·공개판 | 각각 7경로×6폭=42화면, 합계 84화면(reduced-motion 설정), 360·390·430·768·1024·1440, 가로 넘침 0·콘솔 오류 0·깨진 이미지 0·정렬 중심 오차 허용치 초과 0 |
| 정렬 측정 | 가격 카드 라벨·금액·금액 행 y, 과정 번호·제목·본문·확인, FAQ 질문·열린 답변, 섹션 머리를 getBoundingClientRect로 비교, 중심 오차 ±1px 이내 |
| 위치·반응형 | 서비스 카드 6개, CONTACT 직전 이웃, 1·2·3열, `.qa/r8-w1/browser-{review,public}.json` |
| 실제 조작 | 캐러셀 6장·키보드·카드 링크, 웹툰 다음 컷, FAQ 7개, 샘플 화면비·컷 선택, 30/60 길이, 인물 선택 등 21검사 PASS, 콘솔 오류 0, `.qa/r8-w1/interactions.json` |
| 게이트 | 검토판 2개 상세 200+헤더·메타 noindex, 공개판 같은 상세 404+noindex, `review-gates.json`·`public-scan.json` |
| 공개판 누수 검사 | HTML 48경로·`.next/static` 텍스트 파일 77개, 지정 금지 문자열 0건, `.qa/r8-w1/public-scan.json` |
| `tests/seo-http.mjs` | 공개판 PASS, `.qa/r8-w1/seo-http.json` |
| 원본 보존 | 추출에 사용한 원본 SHA256 유지, `public/reference-review/`·고객 폴더에는 쓰기 없음, 각 원본·파생본 SHA는 MANIFEST에 기록 |
| 보호 범위 | 메인 `components/guide/*`·`components/home/*`, W2 `hero-video.tsx`·`public/content-home/*` 변경 0, 3215 PID 14204 및 보호 BUILD_ID SHA 동일 |
| 종료 | W1 3218 서버·브라우저 종료, 빌드 폴더 재귀삭제는 자동 승인 심사에서 정책상 차단되어 `.next`·`.next-dev`와 증거 로그·화면·소스 스냅샷 보존, `cleanup.json` |

스크린샷: `.qa/r8-w1/shots/review/`, `.qa/r8-w1/shots/public/` 및 프레임 검토용 `.qa/r8-w1/contact-0..2.jpg`

크롭 보정 결정: 코디네이터 질문 msg_e8b18356dbc4 미응답, 추가 빌드 예외를 가정하지 않고 후보 CSS는 미적용, 검토판·공개판은 각 1회 빌드

승인 문구 대조 213항목도 불일치 0건이며 스냅샷과 현재 앱·컴포넌트·라이브러리·테스트 소스 263개 파일의 SHA가 동일하다(`source-fidelity.json`, `source-integrity.json`)

## 정지 소재

57개 WebP, 합계 1,779,890 bytes, 카드 최대 80,508 bytes(250KB 이하)
ffmpeg로 지정 원본을 읽어 프레임 추출·크롭·축소했다
서체 비교는 연락처가 있는 오른쪽 열을 제거했고 AI 카드 정면은 얼굴이 잘리지 않도록 상단을 축소·패딩했다
원본 절대경로·시간·필터·원본 SHA256·파생본 SHA256 정본: `public/content-examples/MANIFEST.json`의 `version: R8-W1`
새 이미지 57개만 git index에 추가하여 추적 상태이며 코드·매니페스트·결과 문서는 미커밋이다

| 파일 | 원본 시각(초) | 파생 SHA256 앞 12자 |
|---|---|---|
| `public/content-examples/webtoon/card-r8.webp` | 정지 원본 | `17e0a616f7af` |
| `public/content-examples/animation/card-r8.webp` | 2.5 | `260701a8704c` |
| `public/content-examples/motion-graphics/card-r8.webp` | 21 | `a24b8dbfecec` |
| `public/content-examples/brand-film/card-r8.webp` | 14 | `64e425fb9ee8` |
| `public/content-examples/ad/card-r8.webp` | 9 | `6914935ad080` |
| `public/content-examples/webtoon/type-1.webp` | 정지 원본 | `fbc20334d446` |
| `public/content-examples/webtoon/type-2.webp` | 정지 원본 | `3db9443ab84c` |
| `public/content-examples/webtoon/type-3.webp` | 정지 원본 | `498b4089558f` |
| `public/content-examples/animation/hero-r8.webp` | 2.5 | `c1fc867c3b40` |
| `public/content-examples/animation/form-1.webp` | 2.5 | `c1fc867c3b40` |
| `public/content-examples/animation/form-2.webp` | 4.5 | `6443f1481e98` |
| `public/content-examples/animation/form-3.webp` | 6.5 | `fd844a16097d` |
| `public/content-examples/motion-graphics/grammar-1.webp` | 1 | `670bb40acace` |
| `public/content-examples/motion-graphics/grammar-2.webp` | 3.5 | `705df87b385d` |
| `public/content-examples/motion-graphics/grammar-3.webp` | 7 | `a2ad54905e8e` |
| `public/content-examples/motion-graphics/grammar-4.webp` | 12 | `21ed9283920e` |
| `public/content-examples/motion-graphics/planning-1.webp` | 정지 원본 | `73a73e3d8549` |
| `public/content-examples/motion-graphics/planning-2.webp` | 정지 원본 | `6d26dd58e819` |
| `public/content-examples/motion-graphics/cut-1.webp` | 1 | `c9c20d112385` |
| `public/content-examples/motion-graphics/cut-2.webp` | 3 | `d533d55bdecc` |
| `public/content-examples/motion-graphics/cut-3.webp` | 6.5 | `ac8f73215a83` |
| `public/content-examples/motion-graphics/cut-4.webp` | 11 | `07e23dd41d1b` |
| `public/content-examples/motion-graphics/cut-5.webp` | 21 | `f0d180f3ee53` |
| `public/content-examples/motion-graphics/cut-6.webp` | 24 | `e75189927c46` |
| `public/content-examples/motion-graphics/sample-wide-poster.webp` | 1 | `670bb40acace` |
| `public/content-examples/motion-graphics/sample-vertical-poster.webp` | 1 | `c94c93e974e3` |
| `public/content-examples/brand-film/story-01.webp` | 정지 원본 | `25389bea33ac` |
| `public/content-examples/brand-film/story-02.webp` | 정지 원본 | `69cd5b60ddf2` |
| `public/content-examples/brand-film/story-03.webp` | 정지 원본 | `2ec9bedc4729` |
| `public/content-examples/brand-film/story-04.webp` | 정지 원본 | `bba06901aa55` |
| `public/content-examples/brand-film/source-own.webp` | 정지 원본 | `a4b0825fb1be` |
| `public/content-examples/brand-film/source-made.webp` | 정지 원본 | `69cd5b60ddf2` |
| `public/content-examples/brand-film/source-graphic.webp` | 정지 원본 | `9fa26ae2b3ce` |
| `public/content-examples/brand-film/cut-1.webp` | 1 | `3f14751d2a6f` |
| `public/content-examples/brand-film/cut-2.webp` | 5 | `790d2a77a342` |
| `public/content-examples/brand-film/cut-3.webp` | 14 | `821f00d9f288` |
| `public/content-examples/brand-film/cut-4.webp` | 23 | `ae538ba7cb4d` |
| `public/content-examples/brand-film/cut-5.webp` | 30 | `f2870fd06066` |
| `public/content-examples/brand-film/cut-6.webp` | 59 | `54dbb479de4e` |
| `public/content-examples/brand-film/sample-poster.webp` | 14 | `10bc7a051e89` |
| `public/content-examples/ad/cut-1.webp` | 0.8 | `ca0892693ae0` |
| `public/content-examples/ad/cut-2.webp` | 3 | `e46e5e80f992` |
| `public/content-examples/ad/cut-3.webp` | 6.6 | `f10cb0e522a9` |
| `public/content-examples/ad/cut-4.webp` | 9 | `da546ba86a55` |
| `public/content-examples/ad/cut-5.webp` | 16 | `6debcffaed2b` |
| `public/content-examples/ad/cut-6.webp` | 23 | `bc3dcd724543` |
| `public/content-examples/ad/sample-poster.webp` | 9 | `78f4cb231850` |
| `public/content-examples/ad/hook-1.webp` | 1 | `8837d09a9dc9` |
| `public/content-examples/ad/hook-2.webp` | 1 | `06ee70d9eb20` |
| `public/content-examples/ad/hook-3.webp` | 1 | `7bb8a028e5f9` |
| `public/content-examples/ad/product-1.webp` | 1 | `7bb8a028e5f9` |
| `public/content-examples/ad/product-2.webp` | 1 | `3dc30ea63079` |
| `public/content-examples/ad/product-3.webp` | 1 | `ae519f9293f7` |
| `public/content-examples/ad/vertical-1.webp` | 1 | `670bb40acace` |
| `public/content-examples/ad/vertical-2.webp` | 1 | `c94c93e974e3` |
| `public/content-examples/motion-graphics/planning-3.webp` | 정지 원본 | `4a1a9f9132fe` |
| `public/content-examples/ai-influencer/card-r8.webp` | 정지 원본 | `5e71e385a9a7` |

## NOT_RUN·W2 인계

- 신규 서비스·샘플·훅·제품·AI 시안·애니메이션 발췌·모션코믹 mp4 생성·재인코딩·연결, 영상 전체 재생·청취·프레임별 효능 자막 검사·LUFS/ffprobe·실제 영상 seek 검증은 NOT_RUN이다
- 30초 히어로 5종은 src 빈 값이며 포스터를 표시한다
- W2 연결 위치: `lib/content-site/r8-media.ts`(히어로·훅·제품·AI 시안·모션코믹), `example-media.ts`의 `animation-hero-1`, `r8-boards.ts`의 sample[].src
- SNS 보드 시간은 아직 원본 시간이다, Q18의 두 컷을 뺀 편집본을 연결할 때 W2가 새 시간으로 환산해야 한다
- AI 3편은 Q16의 자막 구간 검사를 통과한 편만 연결한다, 샘플 음원은 제거하고 새 영상·음악 증거는 W2가 MANIFEST에 추가한다
- 홈 히어로 R8 교체, 소리 켜기/끄기, 한 번에 한 영상 음성, 푸터 음악 크레딧은 W2 범위다
- 기존 1 SKIP은 로컬 검토용 미디어를 release checkout에서 제외한 테스트다
- 다른 AI의 독립 검토, 사용자 최종 디자인 확인, 실제 문의 저장·메일·GA4, git commit·push·배포는 NOT_RUN이다

## 변경 파일

- `components/content-home/content-home.css`
- `components/content-home/content-home.tsx`
- `components/content-home/service-cards.tsx`
- `components/content-home/service-showcase.tsx`
- `components/content-site/blocks/faq.tsx`
- `components/content-site/blocks/pricing.tsx`
- `components/content-site/blocks/process.tsx`
- `components/content-site/blocks/scope.tsx`
- `components/content-site/module.ts`
- `components/content-site/services/ad/ad-reel.tsx`
- `components/content-site/services/ad/ad.css`
- `components/content-site/services/ad/landing.tsx`
- `components/content-site/services/ai-influencer/ai-influencer.css`
- `components/content-site/services/ai-influencer/creator-experience.tsx`
- `components/content-site/services/ai-influencer/landing.tsx`
- `components/content-site/services/animation/animation.css`
- `components/content-site/services/animation/landing.tsx`
- `components/content-site/services/animation/references.tsx`
- `components/content-site/services/brand-film/brand-film.css`
- `components/content-site/services/brand-film/film-timeline.tsx`
- `components/content-site/services/brand-film/landing.tsx`
- `components/content-site/services/cut-board.tsx`
- `components/content-site/services/editorial-section.tsx`
- `components/content-site/services/figure-row.tsx`
- `components/content-site/services/motion-graphics/landing.tsx`
- `components/content-site/services/motion-graphics/motion-graphics.css`
- `components/content-site/services/reel-player.tsx`
- `components/content-site/services/service-editorial.css`
- `components/content-site/services/webtoon/landing.tsx`
- `components/content-site/services/webtoon/webtoon.css`
- `components/content-site/theme.css`
- `lib/content-home-cards.ts`
- `lib/content-home.ts`
- `lib/content-site/creator-roster.ts`
- `lib/content-site/example-media.ts`
- `lib/content-site/r8-boards.ts`
- `lib/content-site/r8-details.ts`
- `lib/content-site/r8-media.ts`
- `lib/content-site/r8-sections.ts`
- `lib/content-site/services/ad.ts`
- `lib/content-site/services/ai-influencer.ts`
- `lib/content-site/services/animation.ts`
- `lib/content-site/services/brand-film.ts`
- `lib/content-site/services/motion-graphics.ts`
- `lib/content-site/services/webtoon.ts`
- `lib/content-site/types.ts`
- `lib/content-site/works.server.ts`
- `lib/home-journey-data.ts`
- `lib/home-journey.ts`
- `public/content-examples/MANIFEST.json`
- `public/content-examples/ad/card-r8.webp`
- `public/content-examples/ad/cut-1.webp`
- `public/content-examples/ad/cut-2.webp`
- `public/content-examples/ad/cut-3.webp`
- `public/content-examples/ad/cut-4.webp`
- `public/content-examples/ad/cut-5.webp`
- `public/content-examples/ad/cut-6.webp`
- `public/content-examples/ad/hook-1.webp`
- `public/content-examples/ad/hook-2.webp`
- `public/content-examples/ad/hook-3.webp`
- `public/content-examples/ad/product-1.webp`
- `public/content-examples/ad/product-2.webp`
- `public/content-examples/ad/product-3.webp`
- `public/content-examples/ad/sample-poster.webp`
- `public/content-examples/ad/vertical-1.webp`
- `public/content-examples/ad/vertical-2.webp`
- `public/content-examples/ai-influencer/card-r8.webp`
- `public/content-examples/animation/card-r8.webp`
- `public/content-examples/animation/form-1.webp`
- `public/content-examples/animation/form-2.webp`
- `public/content-examples/animation/form-3.webp`
- `public/content-examples/animation/hero-r8.webp`
- `public/content-examples/brand-film/card-r8.webp`
- `public/content-examples/brand-film/cut-1.webp`
- `public/content-examples/brand-film/cut-2.webp`
- `public/content-examples/brand-film/cut-3.webp`
- `public/content-examples/brand-film/cut-4.webp`
- `public/content-examples/brand-film/cut-5.webp`
- `public/content-examples/brand-film/cut-6.webp`
- `public/content-examples/brand-film/sample-poster.webp`
- `public/content-examples/brand-film/source-graphic.webp`
- `public/content-examples/brand-film/source-made.webp`
- `public/content-examples/brand-film/source-own.webp`
- `public/content-examples/brand-film/story-01.webp`
- `public/content-examples/brand-film/story-02.webp`
- `public/content-examples/brand-film/story-03.webp`
- `public/content-examples/brand-film/story-04.webp`
- `public/content-examples/motion-graphics/card-r8.webp`
- `public/content-examples/motion-graphics/cut-1.webp`
- `public/content-examples/motion-graphics/cut-2.webp`
- `public/content-examples/motion-graphics/cut-3.webp`
- `public/content-examples/motion-graphics/cut-4.webp`
- `public/content-examples/motion-graphics/cut-5.webp`
- `public/content-examples/motion-graphics/cut-6.webp`
- `public/content-examples/motion-graphics/grammar-1.webp`
- `public/content-examples/motion-graphics/grammar-2.webp`
- `public/content-examples/motion-graphics/grammar-3.webp`
- `public/content-examples/motion-graphics/grammar-4.webp`
- `public/content-examples/motion-graphics/planning-1.webp`
- `public/content-examples/motion-graphics/planning-2.webp`
- `public/content-examples/motion-graphics/planning-3.webp`
- `public/content-examples/motion-graphics/sample-vertical-poster.webp`
- `public/content-examples/motion-graphics/sample-wide-poster.webp`
- `public/content-examples/webtoon/card-r8.webp`
- `public/content-examples/webtoon/type-1.webp`
- `public/content-examples/webtoon/type-2.webp`
- `public/content-examples/webtoon/type-3.webp`
- `tests/content-home-cards-section.test.mjs`
- `tests/content-home.test.mjs`
- `tests/content-r5-fix1.test.mjs`
- `tests/content-site-r8-brand-ad.test.mjs`
- `tests/content-site-wpa.test.mjs`
- `tests/content-site-wpb.test.mjs`
- `tests/content-site-wps1.test.mjs`
- `tests/content-site-wps2.test.mjs`
- `tests/content-site.test.mjs`
- `tests/home-journey.test.mjs`
- `docs/renewal-2026-10-13/RESULT_R8_W1.md`
