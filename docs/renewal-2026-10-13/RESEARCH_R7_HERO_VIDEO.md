# R7 컨텐츠 홈 히어로 영상 조사 (도구 · 소재 · 폰트 · 음악 · 스토리보드 초안)

2026-10-15 · 조사 전용. 영상 제작, 유료 생성, 설치, 빌드, 커밋은 하지 않았다. 라이선스 원문 증거는 `license-evidence-r7/`(16개 파일, SHA-256은 `INDEX.sha256.txt`).

## 0. 결론 요약

| 항목 | 추천 1안 | 근거 한 줄 |
|---|---|---|
| 제작 도구 | HTML/CSS/JS 타임라인 페이지 + Python Playwright(시스템 Chrome 채널)로 프레임 캡처 + ffmpeg 인코딩 | 모두 이미 설치되어 있고 실제 스크린샷까지 확인함. 추가 설치 0 |
| 소재 | 저장소 `public/`의 자체 소재만 사용 (웹툰 컷 12, 정지 이미지, 자체 영상 2~3개). `reference-review/` 고객 영상은 제외 | 고객 레퍼런스 18개 HOLD 규칙. 새 Higgsfield 소재는 인박스에 아직 없음 |
| 폰트 | Pretendard(본문·자막) + Unbounded(영문 디스플레이) + 필요 시 Black Han Sans(강조 한글) | 셋 다 SIL OFL 1.1. 원문 저장 완료. 앞의 둘은 이미 저장소에 번들 |
| 음악 | 1안: 자체 합성 음악(numpy/scipy + ffmpeg, 제3자 라이선스 없음). 2안: Pixabay Music 트랙 1개(트랙 페이지 저장 조건) | CC0 근거를 저장할 수 있는 무료 상업 음원 사이트가 이번 조사에서 확인되지 않음. 자체 합성은 근거가 곧 제작 스크립트 |
| 큰 결정 거리 | 히어로 컴포넌트가 `muted` 고정이라 음악이 들리지 않음 | 3절 "함정", 7절 질문 참고 |

## 1. 이 PC의 제작 도구 (설치 여부 확인, 설치하지 않음)

| 도구 | 상태 | 비고 |
|---|---|---|
| ffmpeg / ffprobe | 있음. 9.0.2 full build (gyan.dev) | 인코더: libx264, libx265, libvpx-vp9, libaom-av1, libsvtav1, aac, libopus, libmp3lame, h264_nvenc(GTX 1050 Ti). 필터: drawtext, subtitles/ass, xfade, zoompan, gblur, overlay, afade, acrossfade, amix, sidechaincompress. libfreetype/libass/harfbuzz/fontconfig 포함이라 한글 자막 번인 가능 |
| Node / npm | v24.13.1 / 11.8.0 | 저장소 `node_modules`에 remotion, puppeteer, playwright 없음. 전역 npm에도 없음(전역: claude-code, codex, gemini, vercel, pnpm 등). `sharp 0.35.5`만 있음 |
| Remotion | 미설치 | 설치하면 의존성+Chromium 다운로드가 필요하다. Remotion은 개인과 소규모 회사는 무료지만 일정 규모 이상 회사는 유료 라이선스가 필요하다는 조건이 있다(이번에 원문 확인하지 않음 -> UNKNOWN). 이 건에서는 쓰지 않는 쪽을 추천 |
| Python 3.12.10 | 있음 | `playwright 1.58.0`, `Pillow 10.4.0`, `numpy 2.4.4`, `scipy 1.18.1`, `librosa 1.0.0` 설치됨. moviepy/opencv/imageio/pydub는 없음 |
| Playwright 브라우저 | 자체 다운로드 Chromium은 없음 | `ms-playwright/b`에 chromium 폴더가 없다. 대신 `channel="chrome"`(Chrome 155.0.8059.40)과 `channel="msedge"`(155.0.4283.45) 둘 다 헤드리스 실행과 한글 스크린샷 성공을 확인했다(640x360 프로브) |
| Playwright 내장 녹화(`record_video`) | 쓰지 않음 | VP8, 25fps, 저화질이라 품질 기준(고급 몰입형)에 부족 |
| ImageMagick | 없음 | Pillow와 ffmpeg로 대체 가능 |
| 음악 신시사이저/DAW | 없음 | numpy+scipy로 합성 가능(4절 1안). 시스템에 FluidSynth/사운드폰트는 확인하지 못함 |

### 추천 제작 파이프라인 (미실행, 설계)

1. 장면 전체를 하나의 HTML(`index.html`)로 만들고 시간 `t`를 받아 모든 요소의 위치와 투명도를 결정하는 `window.render(t)` 함수를 둔다. CSS 애니메이션 대신 순수 함수로 해야 프레임 재현이 정확하다.
2. Python 스크립트가 `chromium.launch(channel="chrome")`로 1920x1080 뷰포트를 열고, 30fps로 `t = n/30`마다 `render(t)` 호출 후 `page.screenshot(type="jpeg" 또는 png)` 저장.
3. `ffmpeg -framerate 30 -i frame_%05d.png -i music.wav -c:v libx264 -pix_fmt yuv420p -crf 22 -movflags +faststart -c:a aac -b:a 128k out.mp4` 로 인코딩. 무한 반복(`loop`)용으로 마지막 프레임을 첫 프레임과 맞춘다.
4. 포스터는 `ffmpeg -ss 3 -frames:v 1`로 webp 추출(기존 방식과 동일: `RESULT_FINALFIX_WPA.md`).
5. 예상 렌더 시간: 46초 x 30fps = 1380장. 1080p JPEG 캡처가 장당 0.15~0.4초라면 약 4~10분(추정, 전체 렌더는 하지 않음).
6. 메모리 주의: 프로젝트 규칙상 빌드와 서버를 동시에 올리지 않는다. 렌더는 Chrome 1개 프로세스만 쓰므로 `next build`와 겹치지 않게 순서를 둔다.

대안: ffmpeg만 사용(zoompan, xfade, drawtext). 한글 타이포그래피 제어와 정확한 이징이 약하다. 일부 장면의 켄번스에는 쓸 수 있다.

### 함정

- **히어로 컴포넌트는 항상 `muted`다.** `components/content-home/hero-video.tsx`가 `<video muted loop playsInline preload="metadata" aria-hidden>`을 만들고 `node.muted = true`를 강제한다. 소리 켜기 버튼이 없다. 그래서 지금 구조에서는 mp4에 음악을 넣어도 사용자는 듣지 못한다. 다만 mp4 안에 오디오 트랙이 있으면 파일로는 배포되므로 라이선스 책임은 그대로 생긴다. 선택지는 (a) 무음 mp4를 넣고 음악은 쓰지 않음, (b) 소리 켜기 버튼을 추가(컴포넌트 수정, R7 범위 판단 필요).
- 컴포넌트는 `video.src`(mp4 H.264) 한 줄과 `poster`만 받는다. 16:9(`.ch-hero-reel { aspect-ratio: 16 / 9 }`)이므로 1920x1080이 맞다.
- 기존 `public/videos/brand-intro-v01.mp4`와 `webtoon-reference-v02.mp4`에는 AAC 오디오가 있지만 음원 출처가 이번 조사에서 확인되지 않았다. 영상은 재사용해도 **오디오는 제거**(`-an`)해야 한다.

## 2. 사용 가능한 소재 목록

### 2-1. 판정 기준
- 사용 가능: 저장소 `public/` 자체 소재 중 공개 사이트에서 이미 쓰는 것.
- 제외: `public/reference-review/**`(고객 영상 · 고객 레퍼런스 18개 HOLD, 공개판 노출 금지). 이 폴더의 mp4 17개는 길이·해상도만 아래에 참고로 적고 히어로에는 쓰지 않는다.
- 같은 파일이 여러 경로에 복제돼 있어(MD5 동일) 실제로 서로 다른 그림은 적다.

### 2-2. 서비스별 소재 (해상도는 ffprobe/Pillow 실측)

| 서비스 | 파일 (public/ 기준) | 형식 · 해상도 · 길이 | 메모 |
|---|---|---|---|
| 웹툰 | `webtoon-v11/cut-01.webp` ~ `cut-12.webp` | 800x1200 (2:3), 각 120~195KB | 《1억의 구단주》 컷 1~12 전부 공개 사용 결정. 13~24도 파일은 있으나 공개 사용 결정 범위는 확인 못 함 |
| 웹툰 | `videos/webtoon-reference-v02.mp4` + `webtoon-v11/motion-comic-poster.webp` | 1920x1080, 30fps, 21초, 오디오 있음(19MB). poster 1280x720 | 오디오 출처 UNKNOWN. 영상만 쓰고 `-an` |
| 웹툰 | `content-site/webtoon.webp` (= `content-examples/webtoon/webtoon-key.webp` = `ad-webtoon.webp`) | 900x1350 | 동일 파일 3벌 |
| 애니메이션 | `creative-v06/video-animation.webp` | 1586x992 | 홈 카드 포스터 |
| 애니메이션 | `renewal/animation-sample.webp` | 1100x733 | |
| 애니메이션 | `content-site/animation.webp` (= `animation-character.webp` = `ad-character.webp`) | 900x1350 | 인박스 `animation.png`는 1024x1536로 더 큼 |
| 애니메이션 | 영상 없음 | - | 정지 이미지뿐. 모션은 패럴랙스·카메라 이동으로 직접 만들어야 함 |
| AI 가상인물 | `content-site/ai-influencer/unnie87-{face,full}.webp` | 1080x1440 | 87언니(AI 가상인물, 자체 IP) |
| | `unnie87-front.webp` / `unnie87-side.webp` / `unnie87-street.webp` | 1080x1080 / 1080x1446 / 1080x1935 | |
| | `yeopjip-{portrait,detail}.webp` / `yeopjip-style.webp` | 900x1117 / 900x1342 | 옆집엄마 |
| | `grace-{full,portrait,style}.webp` | 900x1613 | 그레이스의정원 |
| | `ssal-{farm,full}.webp` / `ssal-portrait.webp` | 900x1613 / 900x1205 | 쌀만드는아저씨 |
| | `creative-v06/video-ai-influencer.webp` | 1586x992 | 홈 카드 포스터 |
| | 표기 규칙 | `FACTS_AI_INFLUENCER.md`: 영상 노출 시 "AI 가상인물" 병기. 계정에 실제 게시한 콘텐츠는 없음 | 성과·팔로워 수치 금지 |
| 모션그래픽 | `content-site/hero.webp` (= `motion-ribbon.webp` = `ad-ribbon.webp` = `brandfilm-poster.webp`) | 1920x1081 유리 리본 | 동일 파일 4벌 |
| | `renewal/video.webp` / `renewal/hero.webp` | 1100x1100 / 1536x1024 | |
| | `content-examples/motion-graphics/motion-product.webp` (= `brand.webp` = `ad-product.webp`) | 900x1350 | 동일 파일 3벌 |
| 브랜드 홍보 영상 | `content-examples/brand-film/brandfilm-motion.mp4` (= `content-site/brand-motion.mp4`) | 1920x1080, 24fps, 12초, 무음, 656KB | 가장 쓸 만한 AIO 자체 움직이는 소재 |
| | `videos/brand-intro-v01.mp4` | 1920x1080, 30fps, 30초, 오디오 있음(3.9MB) | 오디오 제거 후 사용 가능성 검토 |
| | `renewal/brand-film-v03.webp`(1600x1000), `.png`(1586x992) / `creative-v06/video-brand-film.webp`(1586x992) | | |
| SNS 광고 영상 | `creative-v06/video-sns-ad.webp` | 1586x992 | |
| | `content-examples/ad/ad-product.webp` | 900x1350 | 위 제품 이미지와 동일 파일 |
| 공통 | `brand/aio-agency-logo-final/aio-agency-horizontal-{dark,light}-1600.png` | 1600x560 | 마무리 로고 |
| | `mockups/phone.png`(1728x3072), `mockups/monitor.png`(3072x2048) | | 폰/모니터 프레임 장면용 |

### 2-3. `_소재_인박스_R5` (`I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트\_소재_인박스_R5`)

- 총 25개 파일. `ASSET_REQUEST_R5.md`, `_R5_v1_5sec.md`, `_참조/` 안의 PNG 21개 + mp4 1개 + `목록.md`.
- `_참조/` 이미지는 저장소 webp를 PNG로 변환한 사본이거나 AIO 기존 산출물(`hero.png` 1672x942, `brand.png` 1024x1536, `webtoon.png` 1024x1536, `animation.png` 1024x1536)이다. **저장소에 없는 새 생성 소재는 사실상 없다**(`hero_renewal.png`도 저장소 `renewal/hero.webp` 사본).
- `목록.md`가 "이 폴더에 없는 것"으로 명시한 파일: `home-card-*.png`, `ad-center-1.png`, `ad-rail-1~9.png`, `animation-scene-1~3.png`, `animation-character-front/side.png`, `brandfilm-main-1~3.png`, `motion-bg-1/2.png`, `home-hero-reel.png`, `ai-card-1~4.png`. 즉 **사용자가 Higgsfield로 만들기로 한 신규 소재와 MASTER 영상은 아직 인박스에 없다.** (R6: `home-hero-reel`은 취소됨)
- 고해상도 이점이 있는 인박스 PNG: `animation.png` 1024x1536, `webtoon.png` 1024x1536, `brand.png` 1024x1536, `motion-ribbon.png` 1920x1082.

### 2-4. 참고만: `public/reference-review/**` (히어로 사용 금지)
bwl-*(5개, 18~30초), healernet-motion(2개), yofree-mg30(4개 30초), yofree-mg-short(4개 20~25초), yofree-night-motion(207초), yofree-outing-motion(30초). 모두 720x1280 또는 1280x720, 오디오 있음. 고객 작업물이라 공개 히어로에 쓰면 HOLD 규칙 위반.

### 2-5. 소재 부족 지점
- 애니메이션과 AI 가상인물과 광고는 **움직이는 원본이 없다.** 켄번스, 레이어 분리 패럴랙스(Pillow로 수동 마스크), 타이포 모션으로 "움직임"을 만들어야 한다. 이는 "서비스 소스를 모두 활용"하는 요구와 맞지만 실제 영상 소스가 아니라 정지 이미지 기반 모션임을 사용자에게 알려야 한다.
- 새 AI 영상이 필요하면 사용자가 Higgsfield 무료로 5~10초 클립을 만들어 인박스에 넣는 흐름이 R5/R6에 이미 정의돼 있다.

## 3. 상업 사용 가능한 한글 폰트 후보

판정 기준은 SIL Open Font License 1.1 원문 확보 여부다. OFL은 상업 이용과 임베딩을 허용하고, 폰트 파일 자체를 단독으로 판매하는 것은 금지한다. 영상에 글자를 찍어 내는 것은 폰트 재배포가 아니다. 사이트에서 웹폰트 파일을 서빙하는 경우에는 OFL 원문을 함께 두는 것이 정석이다.

| 폰트 | 용도 제안 | 라이선스 | 저장소 번들 | 원문 URL / 저장 파일 | 비고 |
|---|---|---|---|---|---|
| Pretendard Variable | 본문 · 자막 · 굵은 한글 헤드라인 | SIL OFL 1.1 (Copyright 2021 Kil Hyung-jin, 포함된 Source Sans/Inter/M PLUS 1 각각 OFL) | **있음** `public/fonts/PretendardVariable.woff2` (2.0MB), `app/layout.tsx`에서 `--font-body`로 로드 | https://github.com/orioncactus/pretendard/blob/main/LICENSE -> `license-evidence-r7/font_pretendard_LICENSE.txt` (HTTP 200) | 저장소 `public/fonts/`에는 OFL 텍스트가 **없음**(Unbounded, JetBrainsMono만 있음). 번들 woff2가 upstream과 같은 버전인지는 해시 대조 안 함. 추천: 이번에 받은 LICENSE를 `public/fonts/Pretendard-OFL.txt`로 추가 |
| Unbounded | 영문 디스플레이(CONTENT STUDIO, 서비스 영문명) | SIL OFL 1.1 (Copyright 2022 The Unbounded Project Authors) | **있음** `Unbounded-latin.woff2`(Latin 전용, 한글 글리프 없음), `Unbounded.ttf`, `Unbounded-OFL.txt` | https://github.com/googlefonts/unbounded -> `font_unbounded_OFL_upstream.txt` (저장소 번들 OFL과 같은 4392바이트) | 한글은 폴백으로 Pretendard가 나가게 설정 |
| JetBrains Mono | 타임코드 · 숫자 라벨 | SIL OFL 1.1 | 있음, `JetBrainsMono-OFL.txt` 포함 | 저장소 사본 | 필요하면 |
| Black Han Sans (블랙한산스) | 서비스명 한 단어 임팩트(예: 웹툰, 모션) | SIL OFL 1.1 (Copyright 2015 The Black Han Sans Project Authors) | 없음 | https://github.com/google/fonts/blob/main/ofl/blackhansans/OFL.txt -> `font_blackhansans_OFL.txt` (HTTP 200) | Google Fonts 배포본. 사용 시 `.ttf` 별도 다운로드 필요(이번엔 받지 않음) |
| SUIT | Pretendard 대안 본문 | SIL OFL 1.1 (Copyright 2022 SUNN, Reserved Font Name SUIT) | 없음 | https://github.com/sun-typeface/SUIT/blob/main/LICENSE -> `font_suit_LICENSE.txt` (HTTP 200) | 중복 용도라 필수 아님 |
| Noto Sans KR / Noto Serif KR | 폴백 · 명조 계열 제목 | SIL OFL 1.1 | 없음. 이 PC에 `C:\Windows\Fonts\NotoSansKR-VF.ttf`, `NotoSerifKR-VF.ttf` 설치돼 있음(출처·버전 미확인) | https://github.com/notofonts/noto-cjk/blob/main/Sans/LICENSE -> `font_notosanskr_OFL.txt` (HTTP 200, Sans 기준. Serif는 같은 저장소 `Serif/LICENSE`, 저장 안 함) | 세리프 타이틀이 필요하면 |
| Gmarket Sans | 둥근 임팩트 제목 | 공식 페이지에 "SIL Open Font License에 따라 개인 또는 기업이 영리적 · 비영리적 목적으로 자유롭게 사용" 안내 | 없음 | https://corp.gmarket.com/fonts -> `font_gmarketsans_corp_page.html` (HTTP 200) | 라이선스 **원문**이 아니라 안내 문구만 저장. 사용하려면 폰트 압축파일 안의 OFL 텍스트를 받아 저장 필요(UNKNOWN 보강 대상) |
| Malgun Gothic, Batang 등 Windows 시스템 글꼴 | 사용 금지 | Microsoft 글꼴 라이선스(재배포 · 임베딩 제한) | - | - | 영상에 찍는 것 자체의 허용 범위를 확인하지 않았으므로 UNKNOWN. 쓰지 않는다 |

추천 조합: **Pretendard(ExtraBold/Bold) + Unbounded(영문)**, 강조 한 곳에만 Black Han Sans. 이미 사이트 폰트와 같아 톤이 일관되고 새 라이선스 부담이 없다.

## 4. 상업 이용 가능한 음악 후보

원칙: 영상 파일이 사이트에서 배포되므로 "트랙 단위로 라이선스 본문과 트랙 페이지를 저장할 수 있는가"를 기준으로 삼았다. FreePD는 폐쇄돼 후보에서 제외.

| # | 후보 | 라이선스 | 크레딧 | 광고 · 재배포 제한 | 원문 URL / 저장 파일 | 판정 |
|---|---|---|---|---|---|---|
| A | **자체 합성 음악** (numpy+scipy로 비트·패드·스팅어를 생성, ffmpeg로 마스터링) | 제3자 라이선스 없음. 저작권은 AIO | 불필요 | 제한 없음 | 근거 = 합성 스크립트와 파라미터(제작 시 `docs/.../music-r7/`에 저장). 외부 URL 없음 | **추천 1안.** 장면 컷과 비트를 샘플 단위로 맞출 수 있고, 라이선스 UNKNOWN이 생길 수 없다. 대신 작곡 품질은 단순한 일렉트로닉 루프 수준이 한계 |
| B | **Pixabay Music** (Pixabay Content License) | 무료 사용 · 수정 · 무크레딧(요약: "Use Content without having to attribute the author"). 약관 6절: "You do not need to credit Pixabay or the contributor of Content when you use it" | 불필요 | 금지: Standalone 판매/배포("You cannot sell or distribute Content ... on a Standalone basis"), 상표 · 로고가 든 콘텐츠의 상업 연계, 오해 소지/불법 사용, 상호 · 상표의 일부로 사용. 라이선스는 비독점. 요약문에 "only the full Content License is legally binding" | 요약: https://pixabay.com/service/license-summary/ -> `music_pixabay_license_summary.html` (HTTP 200). 약관 5~8절: https://pixabay.com/service/terms/ -> curl 403, 헤드리스 Chrome 403이라 **전문 저장 실패**. WebFetch 발췌만 `music_pixabay_terms_webfetch_excerpt.md` | **2안.** 영상에 합성해 사용하는 것은 Standalone이 아님. 단 **구체 트랙을 아직 고르지 않았다**(트랙 페이지가 JS이고 Cloudflare 때문에 자동 수집 불가). 사람이 브라우저에서 트랙 선택, 트랙 URL, 제작자, 페이지 스크린샷을 저장해야 확정. 음악 전용 조항, Content ID 관련 조항은 확인 못 함(UNKNOWN). YouTube에 올릴 경우 Content ID 이슈 가능성은 별도로 확인 필요(이 조사에서는 사이트 호스팅만 대상) |
| C | **Incompetech (Kevin MacLeod)** | CC BY 4.0 | **필수**. 권장 문구 "Title Kevin MacLeod (incompetech.com)". 크레딧이 가려지면 안 됨 | 상업 이용 가능(크레딧 조건). 무크레딧은 유료 Standard License(조건 · 가격 확인 못 함) | https://incompetech.com/music/royalty-free/faq.html -> `music_incompetech_faq_webfetch_excerpt.md` (WebFetch 발췌, 전문 저장 아님). CC BY 4.0 법률 전문은 미저장 | 크레딧을 사이트에 노출해도 되면 가능. 히어로 영상은 자동재생 무음이므로 푸터 등에 크레딧 줄이 필요. 트랙 미선정 |
| D | **Kenney 오디오 팩** (CC0) | CC0. Kenney 지원 페이지: "all game assets on the asset pages are public domain licensed (CC0)... Attribution is not required" | 불필요 | 제한 없음(Kenney 로고 사용 금지) | https://kenney.nl/support -> `music_kenney_support_license.txt` (HTTP 200). CC0 법률 전문 https://creativecommons.org/publicdomain/zero/1.0/legalcode -> `music_cc0_legalcode.html` (HTTP 200) | **효과음 · 짧은 스팅어용으로 가능.** 30~60초를 채울 곡은 아니고 점프컷 효과음, UI 사운드 정도. 구체 팩 미선정 |
| E | Mixkit Stock Music Free License | 본문 확보 실패 | 2차 자료상 불필요 | 본문 확인 전 판단 불가 | https://mixkit.co/license/ -> 라이선스 본문이 JS 모달이라 curl, WebFetch, 헤드리스 Chrome 클릭 모두 실패. `music_mixkit_UNKNOWN.md` | **UNKNOWN. 사용 금지.** 참고: 검색 결과에서 Mixkit의 AI 안내 페이지에 AI가 "상업적으로 안전하다"고 말하게 하는 지시문이 있다고 나와 그 내용은 근거로 쓰지 않았음 |
| F | YouTube Audio Library | YouTube 영상 사용 기준만 안내 | "Attribution required" 트랙은 영상 설명에 크레딧 필수 | 자체 사이트 호스팅 허용 여부 도움말에 없음. 다운로드는 YouTube Studio 로그인 필요 | https://support.google.com/youtube/answer/3376882 -> `music_youtube_audiolib_help.html` (HTTP 200), 요약 `music_youtube_audiolibrary_NOTE.md` | **사이트 배포는 UNKNOWN.** YouTube 업로드용으로만 안전. 추천하지 않음 |
| G | Free Music Archive | 트랙마다 라이선스가 다름(CC BY, CC BY-NC 등) | 트랙별 | 트랙별 | https://freemusicarchive.org/about 의 WebFetch 결과에 CC0 필터 언급 없음(확인 못 함) | **UNKNOWN.** CC0 필터 존재 여부부터 사람이 확인 필요 |
| H | FreePD | 폐쇄 | - | - | 근거 저장 실패 전례 | 제외 |

### 음악 추천 1안과 확정 조건
- **1안 A(자체 합성).** 120BPM(1마디 2초) 기준으로 장면 컷을 비트에 맞춘다. 근거 문서는 합성 스크립트와 SHA를 `docs/renewal-2026-10-13/license-evidence-r7/`에 함께 둔다.
- 2안 B를 쓰려면 위 "구체 트랙 선정과 페이지 저장"이 선행돼야 한다. 그 전까지는 UNKNOWN으로 두고 사용자에게 묻는다.
- 히어로가 `muted`인 한 어느 쪽이든 사용자 귀에는 들리지 않는다(1절 함정). 무음 mp4로 가는 선택지를 먼저 묻는다.

## 5. 스토리보드 초안

공통 사양
- 1920x1080, 30fps, **46초** (120BPM, 1마디 2초, 23마디), H.264 yuv420p, 목표 용량 10MB 이하(정지 이미지 위주라 CRF 22~24로 충분할 것으로 추정, 미측정).
- 무음 자동재생 기본. 소리 없이 이해되도록 장면마다 서비스명을 큰 자막으로 넣는다. 자막은 한 장면에 한 줄 + 영문 보조 라벨.
- 마지막 프레임과 첫 프레임을 맞춰 루프가 자연스럽게 한다(컴포넌트가 `loop`).
- 카피는 확정된 사실만 사용. 성과 · 팔로워 · 가격 · 고객명 · 요프리 · 닥터시크릿 언급 0건. 자체 소재 라벨 규칙: "AI 가상인물" 병기(`FACTS_AI_INFLUENCER.md`), 연출 소재는 "연출 예시" 소형 태그.
- 폰트: Pretendard ExtraBold(자막) + Unbounded(영문 라벨).

### 안 1. "여섯 개의 화면, 하나의 박자" (플랫폼 규격 프레임 순회)

R7 지시 2-7·1-7의 플랫폼 규격 시뮬레이션 방향과 같은 문법. 각 서비스를 그 서비스가 실제로 소비되는 화면 비율로 보여 주고, 박자에 맞춰 화면 틀이 바뀐다.

| 시간 | 마디 | 화면 | 소재 | 자막(안) | 모션 |
|---|---|---|---|---|---|
| 0~4초 | 1~2 | 검은 배경, 6개의 얇은 프레임선(9:16, 16:9, 4:5, 2:3 등)이 박자에 맞춰 그려졌다 사라짐 | 없음(벡터) | AIO MAKE / CONTENT STUDIO | 선 드로잉, 로고 글자 빌드온 |
| 4~10초 | 3~5 | 세로 스크롤 웹툰 프레임 | 웹툰 컷 01~06 (800x1200) | 웹툰 | 컷이 박자마다 아래로 이어 붙으며 스크롤. 마지막에 말풍선 팝 |
| 10~16초 | 6~8 | 16:9 시네마 프레임, 상하 레터박스 | 애니메이션 정지 이미지 3장(animation, video-animation, animation-sample) | 애니메이션 | 레이어 패럴랙스 + 프레임 보간 느낌의 느린 푸시인 |
| 16~22초 | 9~11 | 폰 프레임 9:16 | AI 가상인물 4명(unnie87-street 1080x1935, ssal-full, grace-full, yeopjip-style) | AI 가상인물 (태그: AI 가상 인물) | 폰 안에서 4명이 박자마다 스와이프 전환, 하트/댓글 UI 없음(수치 금지) |
| 22~28초 | 12~14 | 가득 찬 16:9, 글자만 | 유리 리본(hero.webp) 배경 + 키네틱 타이포 | 모션그래픽 | 글자 하나가 늘어나고 쪼개지며 박자에 컷. 이 장면이 폰트 리듬 쇼케이스 |
| 28~34초 | 15~17 | 시네마스코프 2.39:1 바 | brandfilm-motion.mp4 12초 중 6초 | 브랜드 홍보 영상 | 실제 영상 소재를 쓰는 유일한 구간 |
| 34~40초 | 18~20 | 4:5 피드 카드 + 세로 카드 | ad-product, video-sns-ad | SNS 광고 영상 (태그: 연출 예시) | 카드가 박자마다 뒤집히며 문구만 바뀜 |
| 40~46초 | 21~23 | 6개 프레임이 한 화면 격자로 모임 -> 정지 -> 첫 프레임의 프레임선으로 복귀 | 위 소재 썸네일 | 말하는 대로 만드는 컨텐츠 / AIO MAKE | 격자 -> 로고 락업 -> 선으로 해체(루프 이음) |

리스크: 장면 6개가 순서 나열이라 단조로울 수 있음. 박자 컷과 프레임 비율 변화를 리듬으로 삼는다.

### 안 2. "한 컷이 영상이 되기까지" (연속 변신)

웹툰 한 컷에서 시작해 하나의 요소가 여섯 서비스로 변하는 매치컷 구성. 연속성이 높지만 제작 난도가 높다.

| 시간 | 마디 | 화면 | 소재 | 자막(안) | 모션 |
|---|---|---|---|---|---|
| 0~6초 | 1~3 | 어두운 배경에 웹툰 컷 한 장(2:3)이 떠오름 | cut-01 | 한 컷에서 시작합니다 | 느린 푸시인, 컷 안 인물 눈높이에 포커스 |
| 6~12초 | 4~6 | 컷이 분할되어 웹툰 컷 6장으로 흐름 | cut-02~07 | 웹툰 | 박자마다 컷이 이어지다 한 컷이 와이드로 확대 |
| 12~18초 | 7~9 | 확대된 컷이 16:9로 열리며 카메라 이동 | animation 이미지 + 패럴랙스 | 애니메이션 | 컷의 배경 레이어가 분리되어 움직임 |
| 18~24초 | 10~12 | 컷 속 인물이 폰 화면 안으로 이동 | AI 가상인물 이미지 | AI 가상인물 (태그) | 인물 이미지가 폰 프레임으로 매치컷 |
| 24~30초 | 13~15 | 폰 화면의 색 면이 퍼지며 글자 모션으로 | 유리 리본 + 타이포 | 모션그래픽 | 리본이 글자 형태로 접힘 |
| 30~36초 | 16~18 | 글자가 영상 프레임으로 열려 브랜드 필름 | brandfilm-motion.mp4 | 브랜드 홍보 영상 | 시네마스코프 바가 열림 |
| 36~42초 | 19~21 | 영상 프레임이 피드 카드로 줄어듦 | ad-product, video-sns-ad | SNS 광고 영상 (태그: 연출 예시) | 카드 3장 레일 |
| 42~46초 | 22~23 | 카드들이 격자로 모여 첫 웹툰 컷 한 장으로 접힘 | 썸네일 | AIO MAKE | 루프 이음 |

리스크: 소재 해상도와 비율이 제각각(900x1350, 1586x992, 1920x1080)이라 매치컷 정렬에 수작업이 많다.

### 추천
**안 1.** 소재가 비율별로 흩어져 있어 비율 전환을 연출로 쓰는 안 1이 소재 품질 편차를 가려 주고, 메인 사이트 `/content` 카드의 플랫폼 규격 시뮬레이션 방향(R7 2-7)과 같은 언어다. 안 2는 인상은 강하지만 매치컷 정렬이 어렵다.

## 6. 증거 파일 상태 (license-evidence-r7)

| 파일 | 내용 | 상태 |
|---|---|---|
| `font_pretendard_LICENSE.txt` | Pretendard OFL 1.1 | 전문 저장 (HTTP 200) |
| `font_suit_LICENSE.txt` | SUIT OFL 1.1 | 전문 저장 |
| `font_notosanskr_OFL.txt` | Noto CJK(Sans) OFL | 전문 저장 |
| `font_blackhansans_OFL.txt` | Black Han Sans OFL | 전문 저장 |
| `font_unbounded_OFL_upstream.txt` | Unbounded OFL | 전문 저장 (저장소 번들 사본과 같은 크기) |
| `font_gmarketsans_corp_page.html` | Gmarket 폰트 안내 페이지 | 안내 문구만, 원문 아님 |
| `music_pixabay_license_summary.html` | Pixabay 라이선스 요약 | 저장 (HTTP 200). 법적 구속력은 약관 전문 |
| `music_pixabay_terms_webfetch_excerpt.md` | Pixabay 약관 발췌 | **전문 저장 실패(403)**, WebFetch 발췌만 |
| `music_incompetech_faq_webfetch_excerpt.md` | Incompetech 라이선스 안내 | 발췌만 |
| `music_kenney_support_license.txt` | Kenney CC0 안내 | 저장 (HTTP 200) |
| `music_cc0_legalcode.html` | CC0 1.0 법률 전문 | 저장 (HTTP 200) |
| `music_youtube_audiolib_help.html`, `..._NOTE.md` | YouTube Audio Library 도움말 | 저장. 사이트 배포는 UNKNOWN |
| `music_mixkit_license.html`, `music_mixkit_UNKNOWN.md` | Mixkit | **본문 확보 실패 = UNKNOWN** |
| `INDEX.sha256.txt` | 위 파일 SHA-256 | |

한계: 모든 저장은 2026-10-15 시점이고, HTML 페이지는 스크립트 포함 원본이라 텍스트가 읽기 불편하다. 필요하면 `python`으로 태그를 벗겨 읽는다. 라이선스 해석은 법률 자문이 아니다.

## 7. 사용자에게 물어야 할 것

1. 히어로 영상에 **소리가 필요한가?** 지금 컴포넌트는 `muted` 고정이다. 필요하면 소리 켜기 버튼을 컴포넌트에 추가하는 범위 확대가 필요하고, 필요 없으면 무음 mp4로 가고 음악 라이선스 문제가 사라진다.
2. 음악을 쓴다면 **자체 합성(추천)**을 받아들일지, 아니면 Pixabay 트랙을 사용자가 직접 골라 트랙 URL과 스크린샷을 주실지.
3. 스토리보드 **안 1 / 안 2** 선택과 카피(서비스명 자막, 마무리 문구 "말하는 대로 만드는 컨텐츠" 등은 초안일 뿐 확정 카피 아님).
4. 애니메이션 · AI 가상인물 · 광고는 정지 이미지 기반 모션이라는 점을 받아들일지, 아니면 Higgsfield 무료 클립을 기다릴지.
5. 저장소 `public/fonts/`에 Pretendard OFL 텍스트를 추가해도 되는지(이번에 받은 사본 사용).
