# R8 계획: 메인·컨텐츠 홈·서비스 6종 수정, 영상 재편집

## Context
- 사용자가 R7 검토판(3215)을 확인하고 이미지 31장과 함께 수정 지시를 보냈다.
- 범위는 네 가지다.
  - 메인 페이지: 가운데 정렬, 문구 교체·삭제, 단계 내비 확대.
  - 컨텐츠 홈: 정렬과 키워드 색, 문구 삭제·교체, 히어로 영상(음악, 단계별 장면), 카드 소재 교체·카피, 서비스 카드 섹션 신설.
  - 서비스 6종: 구성 보강, 30초 영상, 가격·과정·FAQ 가운데 정렬.
  - AI 인플루언서 계정 수 고정 표기 제거.
- 작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`. HEAD는 `7046c60` 이후이며 미푸시다.

## 사용자 결정 (2026-10-15, 이 대화)
- **D1 고객 소재 공개판 사용.** 요프리(키네틱·진상품), 힐러넷 모션그래픽, 맥스테크 홍보영상, 87언니·닥터시크릿 시안, 힐러넷·요프리·닥터시크릿 웹툰을 공개판에서도 쓴다. 권리 책임은 사용자에게 있다.
  - 화면 HTML의 고객명 문자열은 계속 0건이다. 금지 문자열은 요프리, YoFree, 힐러넷, BWL, DR's Secret이고, 맥스테크 표기는 BRIEF에서 정한다.
  - 영상 속 로고와 제품은 그대로 둔다.
  - 기존 18개 레퍼런스 상세 페이지(`/content/projects/*`)의 review 게이트, noindex, 사이트맵 제외는 유지한다.
  - 공개용 소재는 `public/reference-review/`가 아니라 git에 추적되는 `public/content-examples/…`에 새로 만든다.
- **D2 음악.** 무료 사용이 가능한 음원을 찾아 모션 박자에 맞춰 넣는다.
  - 곡마다 라이선스 원문을 저장해야 쓸 수 있다(`license-evidence-r8/`, sha256 포함). CC0 또는 상업용·웹 게시가 허용되는 곡만 쓴다.
  - Mixkit과 YouTube Audio Library는 계속 쓰지 않는다.
  - 자동재생은 무음으로 시작하고 '소리 켜기' 버튼을 둔다.
- **D3 30초 서비스 영상** 대상은 웹툰, AI 인플루언서, 모션그래픽, 브랜드 홍보, SNS 광고 5종이다. 애니메이션은 이번에 구조만 잡는다.
  - SNS 광고 소스는 요프리 진상품, 힐러넷 영상, 맥스테크 제품별 영상이다.

## 진행 방식 (고정 규칙)
- 메인(Opus)은 계획·BRIEF·커밋만 한다. 조사·카피 초안·구현·검증은 전부 `model: sonnet` 서브에이전트(effort high)가 맡는다.
- 빌드·브라우저·영상 렌더는 한 번에 하나만, 포그라운드로 돌린다. 검증은 `.qa/r8-verify/` 스냅샷에서 한다.
- push, 배포, 외부 터널, 유료 생성은 금지다.
- 디자인 게이트는 혼자 승인하지 않는다. 신규 카피·구성·스토리보드는 `BRIEF_R8.md`로 사용자 승인을 받은 뒤 구현한다.

## 단계

### 0단계 (승인 직후, 메인)
- 메모리를 저장한다(D1 공개 사용 결정, D2 음악 규칙).
- `BRIEF_R8.md` 뼈대와 `HANDOFF_RESUME.md` 상단 상태 줄을 쓴다.

### 1단계: 바로 구현하는 트랙 A와 기획 트랙 B를 동시에 진행
트랙 A는 사용자가 문구까지 확정한 항목이라 기획 승인이 필요 없다. 파일 소유를 나눠 두 에이전트가 병렬로 작업하고, 빌드는 하지 않는다.

**WP-A1 메인 페이지** (`components/guide/main.jsx`, `components/guide/ux.css`, `components/home/workflow-journey.{tsx,css}`, `lib/home-journey.ts`, `journey-marketing.*`, `journey-dev-compare.tsx`, `lib/home-journey-data.ts`, 관련 tests)
1. 가운데 정렬은 PC와 모바일 모두 적용한다.
   - 대상: 히어로(`.main-hero-inner` → `align-items:center; text-align:center`, 버튼 행 가운데), `main-divisions-title`, HOW WE WORK 머리(`.wj-intro`), 단계 머리(개발·마케팅·컨텐츠 `.wj-step` 제목과 리드), OUR STANDARD(`.main-standard-inner`).
   - 단계 머리는 오른쪽 열 안에서 가운데로 맞춘다.
2. 문구 교체(줄바꿈은 그대로, `\n`):
   - 개발 리드: `새롭게 기획한 브랜드 가이드를\n문의나 구매로 이어지도록 설계`
   - 마케팅 리드: `어느 채널에, 어떻게 보여줄지 계획하고\n데이터를 쌓아, 개선하면서 성과 극대화`
   - 컨텐츠 리드: `브랜드 가이드로 기준을 잡고\n웹툰부터 SNS 영상까지 직접 제작`
3. 삭제:
   - HOW WE WORK 부제("필요한 단계만 맡기셔도…")
   - 상담 행 `.wj-closing`
   - 상표 고지 2곳(`wj-mk-notice`, `wjc-notice`). 데이터 상수는 다른 곳에서 쓰는지 확인한 뒤 남긴다.
   - 개발 비교 캡션("기존 공식몰 첫 화면 · … 캡처")
   - OUR STANDARD 캡션("기획 · 제작 · 검수 · 인계")
4. 단계 내비(`.wj-rail`)를 키운다.
   - 라벨은 `t-h3`급(약 22~26px/600), 번호는 16px, 행 패딩은 약 20px로 한다.
   - 레일 폭은 약 280px이고, 1440에서 880×550 시안과 시각 비중을 맞춘다. 수치는 에이전트가 측정해 정한다.
5. 영향받는 테스트(`home-journey.test.mjs`의 text-align:left·OUR STANDARD·레일 정규식, `home-marketing-sim.test.mjs:254`, `platform-frame.test.mjs:176`)를 새 기준으로 고친다.

**WP-A2 컨텐츠 홈 정렬·문구** (`lib/content-home.ts`, `components/content-home/{content-home.tsx,process-steps.tsx,content-home.css}`, `components/content-site/ui/section-head.tsx`의 center 변형 옵션, `tests/content-home.test.mjs`)
1. SERVICES와 PROCESS 머리를 가운데 정렬한다(`CsSectionHead`에 `align="center"` prop을 추가).
2. 메인 키워드에 색을 준다(`--violet`/`--lavender` 강조 span). 데이터에 강조 표기를 둔다.
   - 기본안은 "이야기에 맞는 **형식**"과 "**네 단계**로 진행합니다"다. 확정은 BRIEF 승인 때 한다.
3. 삭제: SERVICES 부제, PROCESS 부제, 4단계의 "받는 것 · …" 줄 전부(라벨과 데이터 렌더).
4. 4단계 설명을 교체한다(순서대로):
   1. `서비스와 분량을 확정합니다`
   2. `컨텐츠별로 기획한 내용을 전달하고 공유합니다`
   3. `확정한 기획안대로 제작하고 공유합니다`
   4. `게시할 채널에 맞춰 최종 편집후 결과물을 전달합니다`

**트랙 B 기획 (병렬 초안 에이전트 → 메인이 `BRIEF_R8.md`로 정리)**
- **B-1 카피 초안**(Sonnet 1개): 캐러셀 6장의 서비스 설명 카피(제품과 메시지를 간결하게 쓰는 형식), 신설 서비스 카드 6장 카피(번호, 이름, 한 줄, 세부 항목, CTA), 히어로 영상 장면 자막. `copywriting`과 `humanizer` 규칙을 적용한다.
- **B-2 서비스 페이지 6종 구성안**(Sonnet 2개, 3종씩): 서비스별 섹션 구성과 카피 초안.
  - 웹툰, AI 인플루언서, 모션그래픽, 브랜드 홍보, SNS 광고는 탄탄하게 보강한다.
  - 애니메이션은 구조를 완전하게 잡고, 레퍼런스 자리는 데이터 한 줄로 늘릴 수 있게 한다.
  - AI 인플루언서는 계정 수 고정 표기를 없애고 `creatorRoster` 길이를 따르게 한다.
  - 근거 없는 수치·성과는 쓰지 않는다. 가격은 `lib/content-pricing.ts` 그대로다.
- **B-3 영상 스토리보드**(Sonnet 1개, 소재 문서를 읽고 작성):
  - 히어로 릴 R8의 장면별 "웹툰식 단계 패널"을 짠다.
    - 애니메이션 = 요프리 키네틱 S1: 캐릭터 기획 → 설계 → 영상 시나리오 → 작업·편집 → 완성
    - AI 인플루언서 = 87언니: 브랜드 전용 인물 기획 → 컨텐츠 기획 → SNS 운영 기획 → 작업·업로드 → 운영
    - 모션그래픽 = 힐러넷 MG v02: 컷별 기획 포함
    - 브랜드 홍보 = 맥스테크 v05: 컷별 기획 포함
    - SNS 광고 = 진상품 brand.mp4: 컷별 기획 포함
    - 웹툰 = 1억의 구단주
  - 5종 30초 서비스 영상의 컷표(초 단위, 자막, 소스 파일 경로)를 만든다.
  - 맥스테크 제품별 영상의 위치를 찾는다.
- **B-4 음원 조사**(Sonnet 1개): 무료 상업 사용이 가능한 곡 후보 6~8개를 찾는다(히어로 1곡, 서비스 영상 5곡, 같은 곡 재사용 가능).
  - 각 곡의 라이선스 원문을 `license-evidence-r8/`에 저장하고 BPM과 길이를 기록한다.
  - 진상품 폴더의 Pixabay 기록 곡, FreePD CC0, Pixabay Music, 기타 CC0 출처를 본다.
  - 원문 저장에 실패한 곡은 후보에서 뺀다.

**BRIEF_R8.md 구성:**
- 번호별 요구와 이미지 매핑(#51~#86)
- 모바일·PC 명세 표(360·390·430·768·1024·1440)
- 카피 전문
- 서비스별 구성안
- 영상 스토리보드와 음원 후보
- 홈 카드 소재 매핑: SNS 광고 = 진상품, 브랜드 홍보 = 맥스테크, 웹툰 = 1억의 구단주, 애니메이션 = 요프리, 모션그래픽 = 힐러넷 회사 홍보 MG, AI 인플루언서 = 현행 유지

### 2단계: 사용자 승인 게이트
- 트랙 A 결과를 3215 검토판에 반영한다. 검증 에이전트 1개가 빌드와 측정을 맡는다.
- 사용자는 `BRIEF_R8.md`를 함께 확인한다. 승인 전에는 트랙 B를 구현하지 않는다.

### 3단계: 트랙 B 구현 (승인 후, 파일 소유를 나눠 병렬)
- **WP-B1 컨텐츠 홈 카드**: `lib/content-home.ts`, `lib/home-journey.ts`의 `contentFallbacks`, `service-showcase.tsx`.
  - 카드의 '제작 후보'/'제작 완료' 배지를 제거한다.
  - 승인된 카피와 공개 소재를 슬롯에 넣는다.
  - 공개판에서 '작업 보기'는 공개 상세가 없으면 숨긴다.
- **WP-B2 서비스 카드 섹션 신설**: CONTACT 바로 위에 메인 `#divisions` 카드 형식(이미지 16:10, 번호, 이름, 한 줄, 항목, CTA)으로 6장을 만든다.
  - 메인 `main.jsx:171-266`과 `ux.css:425-473`의 구조를 컨텐츠 사이트 토큰으로 옮긴 새 컴포넌트를 만든다. `.guide-main` 스코프에 의존하지 않는다.
- **WP-B3a/b/c 서비스 페이지**: 웹툰·애니메이션, AI 인플루언서·모션그래픽, 브랜드 홍보·SNS 광고를 나눠 맡는다.
  - 승인된 구성으로 `components/content-site/services/<id>/`와 `lib/content-site/services/<id>.ts`를 고친다.
  - 공통 `blocks/{pricing,process,faq}.tsx`와 `theme.css`의 가운데 정렬(머리, 가격 카드 텍스트, 과정 행, FAQ 목록 폭 가운데)은 B3a 한 명만 소유한다.
  - 히어로 영상 슬롯을 `example-media.ts`에 데이터 한 줄로 추가한다.
- **WP-V 영상 제작**: 한 에이전트가 순차로 렌더한다(메모리 때문).
  - `hero-reel-r7/build.py` 방식(HTML `render(t)`, Playwright 프레임 캡처, ffmpeg)을 재사용해 `hero-reel-r8/`과 `service-reels-r8/<id>/`를 만든다.
  - 음원은 박자 격자에 컷을 맞추고, AAC 128k로 넣으며 라우드니스는 -16 LUFS 근처로 맞춘다.
  - 출력은 `public/content-home/hero-reel-r8.mp4`와 `public/content-examples/<id>/service-reel-r8.mp4`, 포스터 webp다.
  - 크기 목표는 히어로 12MB 이하, 서비스 영상 각 6MB 이하다.
- **WP-V2 소리 켜기 UI**: `components/content-home/hero-video.tsx`와 서비스 히어로 영상 컴포넌트.
  - 무음 자동재생을 유지하고 '소리 켜기/끄기' 버튼을 추가한다(aria-pressed, reduced-motion 시 자동재생 안 함).
  - 음원 크레딧이 필요한 곡이면 푸터에 크레딧 줄을 넣는다.

### 4단계: 검증·커밋·미리보기
- 검증 에이전트 1개가 아래를 확인한다.
  - typecheck, lint, 직렬 테스트
  - 검토판·공개판 각각 빌드
  - 6폭 × 메인·컨텐츠 홈·서비스 6종의 정렬 `getBoundingClientRect` 측정, 확대 스크린샷
  - 가로 스크롤 0, 콘솔 오류 0
  - 공개판 금지 문자열 0건, `seo-http`
  - 영상: ffprobe(오디오 트랙, 길이, 크기), 소리 켜기 동작, 라이선스 증거 파일과 sha
- FAIL은 담당 구현 에이전트에 다시 지시한다. PASS가 나오면 메인이 커밋한다(`git commit -F`, Co-Authored-By 줄 포함).
- 3215를 R8로 교체해 띄우고 사용자 디자인 확인을 받는다. `HANDOFF_RESUME.md`도 갱신한다.

## 핵심 파일
- 메인: `components/guide/main.jsx`, `components/guide/ux.css`, `components/home/workflow-journey.{tsx,css}`, `lib/home-journey.ts`
- 컨텐츠 홈: `components/content-home/*`, `lib/content-home.ts`, `lib/home-journey.ts`(contentFallbacks), `lib/home-journey-data.ts`
- 서비스: `components/content-site/service-landing.tsx`, `components/content-site/blocks/*`, `components/content-site/services/<id>/*`, `lib/content-site/services/<id>.ts`, `lib/content-site/example-media.ts`, `lib/content-site/creator-roster.ts`, `components/content-site/theme.css`
- 영상: `docs/renewal-2026-10-13/hero-reel-r7/build.py`, `index.html`(재사용 기준)
- 테스트: `tests/home-journey.test.mjs`, `tests/content-home.test.mjs`, `tests/content-site-wpb.test.mjs`, `tests/home-marketing-sim.test.mjs`, `tests/platform-frame.test.mjs`, `tests/seo-http.mjs`

## 위험·메모
- 소재 원본은 `01_에이전시`와 `05_MCN` 폴더에 있다. 원본은 읽기만 하고 작업트리로 변환본만 만든다(원본 보존).
- 1억의 구단주 원본은 `05_MCN\04_기획 채널\…\01_1억의_구단주\`에 있다.
- 맥스테크 원곡(Mixkit 3곡)은 쓰지 않고 영상만 쓴다(`-an`). 음악은 D2 음원으로 새로 입힌다. 진상품 성우 내레이션은 같은 프로젝트 자산이라 유지할지 BRIEF에서 정한다.
- 영상 소재가 늘어 저장소 용량이 커진다. 각 파일 목표 크기를 지킨다.
