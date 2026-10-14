# RESULT_R7_WP6 · 히어로 영상 제작 (컨텐츠 홈)

2026-10-15 · 구현 담당(WP-6). 사용자 승인: 자막 카피 A안(BRIEF_R7 §3-4) + §3-3 타임라인 그대로. 유료 생성 0, 빌드·서버·커밋·push 0. 소유 파일만 수정했다. `lib/content-home.ts`는 건드리지 않았다.

## 1. 산출물

| 파일 | 내용 |
|---|---|
| `public/content-home/hero-reel-r7.mp4` | 최종 영상 (9,397,395 바이트, 약 8.96 MiB) |
| `public/content-home/hero-reel-r7.webp` | 포스터 1280x720, 6.4초 지점(웹툰 장면), 35,864 바이트 |
| `public/fonts/Pretendard-OFL.txt` | Pretendard OFL 원문(`license-evidence-r7/font_pretendard_LICENSE.txt` 사본, SHA 동일) |
| `docs/renewal-2026-10-13/hero-reel-r7/index.html` | 타임라인 페이지. `window.render(t)` 순수 함수, 자막 원문은 `CAP` 상수 |
| `docs/renewal-2026-10-13/hero-reel-r7/build.py` | `extract` / `shots` / `render` / `encode` |
| `docs/renewal-2026-10-13/hero-reel-r7/frames/hero_01~06_*.png` | mp4에서 뽑은 대표 프레임 6장(2.5 · 5.5 · 16.0 · 22.0 · 32.0 · 39.8초) |

SHA-256(최종 파일): mp4 `01bec30d87fb976005ef3412f82c36bdb8e7f851d547bbe19822cd945e35b2ab`, webp `0c3dd3b1f82ce91f11fbf11e31456f124467086f1ebaf6cdd3d1ea5fae216f84`, OFL `82e9c8a4b203261f10ddba1296422d64914ff3d4b7bd8a12896d03f0f088d70a`.

프레임 원본 1350장(JPEG)과 영상 추출 프레임은 `.qa/hero-reel-r7/`(git 제외, 약 400MB). 재현: `python build.py extract && python build.py render && python build.py encode`.

## 2. ffprobe 결과 (최종 mp4)

- 비디오 스트림 1개, 오디오 스트림 0개(`-an`, ffprobe 스트림 목록에 audio 없음)
- h264 High, 1920x1080, yuv420p(BT.709, limited range), 30/1 fps, nb_frames 1350, duration 45.000000초
- bit_rate 약 1.67 Mbps, `+faststart`, 크기 9.40MB(10,485,760 바이트 한도 안)
- 루프: 첫 프레임과 마지막 프레임(1349번)의 평균 절대 차이 0.49/255(최대 17, 인코딩 잡음 수준). 마지막 장면의 격자 디졸브가 첫 프레임 상태(희미한 6칸 격자, 자막 없음)로 끝난다.

## 3. 소재와 폰트 출처

모두 저장소 `public/` 안 파일이다. `public/reference-review/**` 사용 0건(`index.html`·`build.py`에 문자열 0건 확인).

| 구간 | 소재 |
|---|---|
| 여는 장면 격자 | `webtoon-v11/cut-01.webp`, `creative-v06/video-animation.webp`, `content-site/ai-influencer/ssal-full.webp`, `content-examples/motion-graphics/motion-product.webp`, 브랜드 필름 프레임(아래), `creative-v06/video-sns-ad.webp` |
| 웹툰 | `webtoon-v11/cut-01~04.webp`(폰 스크롤), `videos/webtoon-reference-v02.mp4`의 16.0~18.0초 2초(오디오 제거, 모션코믹 화면) |
| 애니메이션 | `creative-v06/video-animation.webp`, `renewal/animation-sample.webp`, `content-site/animation.webp`(캐릭터 카드) |
| AI 인플루언서 | `content-site/ai-influencer/{unnie87-street,ssal-full,grace-full,yeopjip-style}.webp`, 태그 "AI 가상인물" 상시 표시 |
| 모션그래픽 | `content-site/hero.webp`(유리 리본 배경), `content-examples/motion-graphics/motion-product.webp` |
| 브랜드 홍보 영상 | `content-examples/brand-film/brandfilm-motion.mp4`의 3.0~8.0초 5초(원본 무음, 24fps를 30fps로 변환) |
| SNS 광고 영상 | `content-examples/ad/ad-product.webp`, `creative-v06/video-sns-ad.webp`, 태그 "연출 예시" |
| 진행 방식 | `webtoon-v11/cut-05~07.webp`(콘티), `cut-06.webp`(AI 초안→다듬기), `creative-v06/video-animation.webp`(9:16·4:5·16:9에 같은 장면) |

폰트는 Pretendard Variable(`public/fonts/PretendardVariable.woff2`)과 Unbounded(`public/fonts/Unbounded-latin.woff2`)만 썼다. 둘 다 SIL OFL 1.1. 근거: `license-evidence-r7/font_pretendard_LICENSE.txt`(= `public/fonts/Pretendard-OFL.txt`), `public/fonts/Unbounded-OFL.txt`. Black Han Sans는 BRIEF §3-1이 "다른 글꼴 금지"라서 쓰지 않았다. 번들 woff2가 upstream과 같은 버전인지는 해시 대조하지 않았다(조사 문서와 같은 한계).

## 4. 자막 카피 검증

`index.html`의 `CAP` 상수를 BRIEF_R7 §3-4 A안 열과 스크립트로 대조했다. 큰 줄·작은 줄 문자열 22개가 전부 일치(`caption match: True`). 진행 방식은 표의 "기획 · 기획안을 먼저 확인합니다 → 제작 · … → 납품 · …"를 세 칸(큰 줄 "기획"/"제작"/"납품", 작은 줄 그 뒤 문장)으로 나눠 썼다. " · "와 "→" 기호 자체는 화면에 찍지 않고 칸 배치와 진행선으로 대신했다.

자막이 아닌 장식 글자: 상단 진행 표시 "01 / 06"~"06 / 06"(Unbounded 숫자), 여는 격자 칸 번호 "01"~"06". 서비스 태그 "AI 가상인물", "연출 예시"는 §3-3 타임라인에 명시된 문구다.

## 5. 대표 프레임 점검 결과 (직접 열어 확인)

6장과 추가 확인(7.8초 모션코믹, 12.8초 애니메이션 카드, 26.5초 브랜드 필름, 41.8초 락업, 장면 전환 9.1·34.1·40.8초)을 열어 봤다.

- 자막 왼쪽 시작선은 모든 서비스 장면에서 x=154(8% 안전 영역)로 같고, 큰 줄 폭 최대 1233px(여는 장면), 작은 줄 최대 1170px로 안전 영역 폭 1612px 안이다. 잘림 없음.
- 겹침: 폰·카드·16:9 화면은 y 110~740 안에 두고 자막 블록은 y 753 이하라서 겹치지 않는다. 전체 화면 장면(애니메이션·브랜드 필름)은 하단 어두운 그라데이션 위에 자막이 올라 가독성 확보.
- 점검 중 고친 것: 모션그래픽 카드·원이 상단 진행 표시와 겹침 → 아래로 내림, 여는 장면 줌 중 자막이 확대 격자와 겹침 → 자막을 3.2~3.5초에 먼저 숨김, SNS 두 폰이 한때 같은 이미지 → 스크롤 시점 조정, 격자 4번 칸과 5번 칸이 같은 리본 → 4번을 제품 이미지로 교체, 납품 칸이 41초 직전에야 채워짐 → 38.6초로 앞당김.
- 남은 육안 관찰: 웹툰 폰 장면의 흐린 배경이 약간 탁한 회갈색, SNS 장면 배경에 라임색 번짐이 있다(소재 색에서 온 것으로 의도한 연출 범위).

## 6. 연결 방법 (메인이 WP-4 완료 후 수행)

`lib/content-home.ts` 21행 `video:` 한 줄만 아래로 바꾼다.

```ts
  video: { src: "/content-home/hero-reel-r7.mp4", poster: "/content-home/hero-reel-r7.webp" } as HeroVideo | undefined,
```

`components/content-home/hero-video.tsx`는 수정하지 않는다(muted·loop 그대로, 영상은 무음이라 영향 없음).

## 7. 기획안 대비 차이와 한계

- 45초 타임라인과 구간 경계(4/9/14/19/24/29/34/41/45초)는 §3-3 그대로다. 구간 안 세부 모션은 소재 한계에 맞춰 정했다.
- 자막 크기: 일반 장면은 큰 줄 128px/800, 작은 줄 72px/600 그대로. 예외 둘: (a) 진행 방식은 가로 세 칸이라 큰 줄 104px, 작은 줄 36px, (b) 마무리 락업 "AIO MAKE CONTENT STUDIO"는 Unbounded가 넓어 한 줄 폭 1500px에 맞춰 약 82px로 줄이고 가운데 정렬.
- 진행 방식 장면의 자막은 "시작 0.3초 뒤 등장" 규칙 대신 세 칸이 순서대로 켜지는 방식(흐림→선명)으로 처리했다. 여는 장면 자막은 줌 때문에 장면 끝 0.8초 전에 사라진다(규칙은 0.4초 전).
- 애니메이션·AI 인플루언서·SNS 광고는 움직이는 원본이 없어 정지 이미지 기반 모션(푸시인·패럴랙스 입자·카드 전환·스크롤)이다. 애니메이션 "배경·캐릭터 2레이어"는 컷아웃 소재가 없어서 배경 이미지 + 캐릭터 카드로 구성했다.
- 웹툰 소개 영상 구간(16.0~18.0초)에는 원본 영상 안에 작은 글자("AIO MAKE Studio", "1억의 구단주", "aio-make.com")가 들어 있다. 자체 소재의 일부이며 카피로 넣은 것이 아니다.
- 소재 권리: `public/`의 자체 소재라는 조사 문서(RESEARCH_R7_HERO_VIDEO)의 분류를 따랐고, 이 작업에서 개별 권리 서류를 다시 확인하지 않았다. AI 가상인물 4종의 공개 노출 가능 여부는 `FACTS_AI_INFLUENCER.md` 기준을 그대로 신뢰했다.
- 브라우저 호환은 ffprobe(H.264 High, yuv420p, faststart)까지만 확인했고 실제 브라우저 재생은 WP-V 단계에서 확인해야 한다. 파일은 9.4MB라 모바일 데이터에서는 `preload="metadata"`(현 컴포넌트 설정)로 충분하다.
- `docs/.../hero-reel-r7/frames/` 대표 프레임 6장은 약 5.6MB다. 커밋 시 크기가 부담되면 제외해도 된다(재생성 가능).
