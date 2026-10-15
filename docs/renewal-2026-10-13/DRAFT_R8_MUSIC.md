# R8 음원 조사 초안 (B-4)

작성 2026-10-16. 조사만 했고 코드는 수정하지 않았다. 상태는 **초안, 사용자 청취 전**이다.

## 1. 결론

- 채택 후보는 FreePD(CC0 선언) 곡 8개다. 작곡가는 Kevin MacLeod, Bryan Teoh, Rafael Krux 세 명이다. 크레딧 의무는 없다.
- Pixabay Music은 곡 페이지 원문 저장에 실패해 후보에서 뺐다. Mixkit과 YouTube Audio Library는 이전 판정대로 제외했다.
- **음원을 직접 듣지 못했다.** 분위기는 FreePD의 곡 설명과 신호 분석(박자, 음량 변화)으로 판단했다. 사용자가 8곡을 들어보고 확정해야 한다.
- 용도별 추천은 아래 3절에 있다.

## 2. 후보 표

음원 파일은 모두 `.qa/r8-music/`(gitignore)에 있다. 증거 파일은 모두 `docs/renewal-2026-10-13/license-evidence-r8/`에 있고 sha256은 그 폴더의 `INDEX.sha256.txt`에 있다.

| id | 용도 | 제목 · 작곡가 | 출처 URL | 라이선스 | 크레딧 | 길이 | BPM(추정) | 분위기 | 로컬 파일 | 증거 파일 |
|---|---|---|---|---|---|---|---|---|---|---|
| r8-m01-arpent | 히어로 1순위, 모션그래픽 대안 | Arpent · Kevin MacLeod | https://freepd.com/music/Arpent.mp3 (사이트 폐쇄, Wayback 사본) | CC0 1.0 (FreePD 선언) | 불필요. 자발 크레딧 권장 | 2:42 (162s) | 120 (±2, 일정) | "Upbeat, uplifting and inspiring. Technology and innovation." 시작부터 꽉 찬 에너지, 110~130초 구간만 소강 | `.qa/r8-music/r8-m01-arpent.mp3` (-13.5 LUFS) | `freepd_wayback_electronic_20251202.html`, `TRACK_EVIDENCE_freepd_extracts.md` |
| r8-m02-slice-of-life | 웹툰 | Slice of Life · Bryan Teoh | https://freepd.com/music/Slice%20of%20Life.mp3 | CC0 1.0 (FreePD 선언) | 불필요 | 2:21 (141s) | 145 또는 하프타임 72.5 | "The beginning of a rom-com where we see the day to day of our leading character." 가볍고 이야기 시작 느낌, 에너지 완만히 상승 | `.qa/r8-music/r8-m02-slice-of-life.mp3` (-10.3 LUFS, 큼) | `freepd_wayback_scoring_20251124.html`, 추출 파일 |
| r8-m03-patron-saint | AI 인플루언서 | Patron Saint of Heists · Bryan Teoh | https://freepd.com/music/Patron%20Saint%20of%20Heists.mp3 | CC0 1.0 (FreePD 선언) | 불필요 | 3:07 (187s) | 85 (더블타임 170) | "Groovy, polished convertable passing neon lights in Nevada." 세련된 그루브, 100~120초에 한 번 소강 | `.qa/r8-music/r8-m03-patron-saint.mp3` (-12.9 LUFS) | `freepd_wayback_scoring_20251124.html`, 추출 파일 |
| r8-m04-goodnightmare | 모션그래픽 | Goodnightmare · Kevin MacLeod | https://freepd.com/music/Goodnightmare.mp3 | CC0 1.0 (FreePD 선언) | 불필요 | 4:00 (240s) | 130 추정(87로도 잡힘, 3:2 관계라 박 느낌이 모호) | "Upbeat, driving and cool. Simple synths with heavy bass, perfect for explainers!" 240초 내내 에너지 일정, 루프 편집에 유리 | `.qa/r8-music/r8-m04-goodnightmare.mp3` (-11.8 LUFS) | `freepd_wayback_electronic_20251202.html`, 추출 파일 |
| r8-m05-motions | 브랜드 홍보 | Motions · Rafael Krux (태그: Orchestralis) | https://freepd.com/music/Motions.mp3 | CC0 1.0 (FreePD 선언) | 불필요 | 1:57 (117s) | 120 (하프 60, 박이 약함) | "Emotional, uplifting and inspiring track made with warm cinematic piano and soft orchestral strings." 박자 약한 서정형 | `.qa/r8-music/r8-m05-motions.mp3` (-15.7 LUFS) | `freepd_wayback_upbeat_20251117.html`, 추출 파일 |
| r8-m06-backbeat | SNS 광고 | Backbeat · Kevin MacLeod | https://freepd.com/music/Backbeat.mp3 | CC0 1.0 (FreePD 선언) | 불필요 | 0:46 (46s) | 130 (129.2) | "Upbeat, heavy hitting beat with bass synth." 30초 영상에 맞는 짧은 비트 곡 | `.qa/r8-music/r8-m06-backbeat.mp3` (**-23.1 LUFS, 작음. 약 +7dB 필요**) | `freepd_wayback_electronic_20251202.html`, 추출 파일 |
| r8-m07-inspiration | 히어로 대안, SNS 대안 | Inspiration · Rafael Krux | https://freepd.com/music/Inspiration.mp3 | CC0 1.0 (FreePD 선언) | 불필요 | 2:18 (138s) | 120 | "Positive, uplifting and inspiring track suitable for commercials and advertising." 광고용 밝은 곡 | `.qa/r8-music/r8-m07-inspiration.mp3` (-11.1 LUFS) | `freepd_wayback_upbeat_20251117.html`, 추출 파일 |
| r8-m08-gotta-keep-on-movin | AI 인플루언서 대안 | Gotta Keep On Movin · Bryan Teoh | https://freepd.com/music/Gotta%20Keep%20On%20Movin.mp3 | CC0 1.0 (FreePD 선언) | 불필요 | 2:24 (144s) | 110 | "Discotech is killing it in this quirky night club." 디스코 그루브, 개성 강함 | `.qa/r8-music/r8-m08-gotta-keep-on-movin.mp3` (-13.3 LUFS) | `freepd_wayback_misc_20251208.html`, 추출 파일 |

- 분위기 열의 따옴표 문구는 FreePD 원문 설명이다. 그 뒤 문장은 이번 신호 분석에서 읽은 에너지 변화다.
- BPM은 ffmpeg로 디코딩한 오디오에서 numpy/scipy로 구한 onset 자기상관과 박 격자 비교값이다. 모든 값이 **추정**이고 오차는 2 BPM 안팎이다. 정박/하프/더블 해석이 갈리는 곡은 표에 함께 적었다. 컷 박자 격자를 확정하기 전에 DAW나 클릭으로 한 번 확인한다.
- 길이는 ffprobe 값이다. 라우드니스는 ffmpeg ebur128 통합값이다.

라이선스 근거(공통):
- FreePD 홈 사본 `freepd_wayback_home_20241231.html`: "This music is all licensed CC0 1.0 Universal Public Domain Dedication." "Can I use this music in an ad? Yes" "Must I credit the musician in my film? Nope - but we do like it."
- CC0 법률 전문: `cc0_legalcode.html`.
- 곡별 항목(곡명, 시간, 작곡가, 설명, 다운로드 링크, 크기와 MD5 일치 확인): `TRACK_EVIDENCE_freepd_extracts.md`.
- FreePD는 곡별 상세 페이지가 없고 장르 목록 페이지가 곡 페이지 역할을 한다. 그 원문을 Wayback 사본으로 저장했다.

## 3. 용도별 추천 1곡

| 용도 | 추천 | 이유 | 대안 |
|---|---|---|---|
| 히어로 브랜드 영상 (60~80초 이상) | **r8-m01 Arpent** | 120 BPM으로 일정하고 시작부터 에너지가 있어 자동재생 첫 장면에 맞다. 162초라 80초를 잘라 쓰거나 루프 편집이 가능하다. 설명도 "Technology and innovation" | r8-m07 Inspiration (광고형 밝은 분위기), r8-m04 |
| 웹툰 30초 | **r8-m02 Slice of Life** | 롬콤 시작부 같은 가볍고 이야기가 시작되는 느낌 | r8-m08 |
| AI 인플루언서 30초 | **r8-m03 Patron Saint of Heists** | 세련된 그루브. 85 BPM이라 컷이 느긋하게 맞는다 | r8-m08 (디스코, 더 튀는 분위기) |
| 모션그래픽 30초 | **r8-m04 Goodnightmare** | 설명 영상에 맞는 신스와 베이스, 에너지가 일정해 컷 박자 격자를 짜기 쉽다 | r8-m01 |
| 브랜드 홍보 30초 | **r8-m05 Motions** | 따뜻한 피아노와 현악, 신뢰감. 박자가 약해 컷을 박에 정확히 맞추기보다 호흡에 맞춘다 | 후보 없음. 필요하면 더 찾기 |
| SNS 광고 30초 | **r8-m06 Backbeat** | 46초짜리 강한 비트라 30초 편집에 맞고 훅이 바로 온다 | r8-m07 (더 밝고 길다) |

히어로와 모션그래픽에 Arpent를 겹쳐 쓰지 않으려고 모션그래픽은 Goodnightmare로 나눴다. 같은 곡 재사용이 허용되므로 줄이려면 모션그래픽을 Arpent로 바꾼다.

## 4. 판정 근거

- 모든 후보의 크레딧 의무: 없음. FreePD가 곡마다 CC0로 선언했고 광고, YouTube, 영상 동기화가 "Yes"다.
- 음원 파일 신뢰성: 사이트가 닫혀서 Wayback의 freepd.com/music 사본을 받았다. 8곡 모두 Internet Archive "freepd" 항목의 같은 곡과 파일 크기와 MD5가 일치한다. 즉 두 경로가 같은 파일이다.
- 확보하지 못한 것: 곡별 작곡가 본인의 CC0 증서. FreePD의 선언이 유일한 근거다.

## 5. 위험과 확인 필요 사항

1. **출처가 제3자 선언이다.** FreePD는 2025년에 영구 폐쇄됐다(`freepd_live_site_closed_2026-10-15.html`). FreePD 법률 페이지도 "You can't just 'declare' something is Public Domain"이라고 쓴다. 최종 사용 전 사용자가 위험을 받아들이는 판단이 필요하다. 완화책으로 푸터에 자발적 크레딧 한 줄을 권한다(`NOTE_freepd_status.md`).
2. **같은 곡의 다른 라이선스.** Kevin MacLeod는 incompetech에서 같은 계열 곡을 CC BY 4.0(크레딧 필수)으로 배포한다. FreePD의 CC0 사본은 별도 공개이지만, 분쟁이 생기면 크레딧을 달아 두는 쪽이 안전하다.
3. **Alexander Nakarada 곡은 뺐다.** 2024-01 사본에는 FreePD에 있었으나 2025-12 사본에서 사라졌다. 작곡가가 뺐을 수 있다(추정). 그래서 처음 점찍은 Fireworks, Chronos, Favorite는 제외했다(`NOTE_excluded_nakarada_tracks.md`).
4. **Content ID.** FreePD는 이 점을 언급하지 않는다. Kevin MacLeod 곡처럼 널리 쓰이는 곡은 YouTube, Instagram, TikTok에 올릴 때 무관한 제3자의 Content ID 신고가 들어올 수 있다. 자체 사이트 mp4 호스팅에서는 문제가 아니다. 이 영상을 SNS에 따로 올릴 계획이면 그 시점에 확인한다. Pixabay 쪽은 곡 페이지에 "Content ID Registered" 배지가 실제로 붙는다(`pixabay_example_track_contentid_registered_wayback_20250823.html`).
5. **청취 미실시.** 분위기 적합성과 곡 안의 어색한 구간은 사람이 들어야 알 수 있다. 특히 Motions(박이 약함)와 Goodnightmare(박 해석이 3:2로 모호)는 컷 격자를 만들기 전에 듣고 박을 확인한다.
6. **음량.** Backbeat가 -23 LUFS로 작고 Slice of Life가 -10 LUFS로 크다. 계획의 -16 LUFS 목표로 맞추는 정규화가 필요하다.
7. **조사 범위.** Pixabay, FreePD, Incompetech, Kenney, Mixkit, YouTube Audio Library를 봤다. OpenGameArt, Free Music Archive 같은 다른 CC0 출처는 시간상 조사하지 않았다. 8곡으로 6~8곡 조건은 채웠으나 브랜드 홍보용은 대안이 없다.

## 6. Pixabay 처리 결과 (403 대응)

- 직접 접속: 약관과 곡 페이지 모두 Cloudflare 403이다.
- 약관 전문: Wayback 사본으로 저장 성공(`pixabay_terms_wayback_20261012.html`, 원본 https://pixabay.com/service/terms/).
- 곡 페이지: 후보로 본 곡들은 사본이 없어 저장 실패, 그래서 채택하지 않았다. 상세는 `NOTE_pixabay_not_adopted.md`.
- 요프리 폴더의 기존 Pixabay 곡(Grace in Hanbok 등)은 분위기가 한국 전통풍이고 곡 페이지 원문이 저장돼 있지 않아 제외했다.

## 7. 로컬 후보 확인

- `요프리/…/00_참조/사운드/` : Pixabay 곡 `BGM_GraceInHanbok`, `bgm_atlas`, `bgm_taiko`, `bgm_tense_loop`과 효과음. 분위기가 전통풍, 오케스트라풍, 긴장형이라 이번 용도와 맞지 않고 곡 페이지 원문이 없어 제외. 효과음(whoosh, ding, stamp 등)은 라이선스 목록에 Pixabay 페이지 URL이 있으나 이번 범위 밖이다.
- 힐러넷 MG-20261010-01_v02 `assets/음악/`의 `From Page to Practice`(Bryan Teoh)와 요프리 MG-20261010-02_v01의 `Advertime`, `Lovely Piano Song`: 모두 FreePD 곡이라 같은 근거를 쓴다. 현재도 FreePD 사본에 남아 있어(2025-12) 필요하면 추가할 수 있으나, 이번 목록에는 넣지 않았다(`Advertime`은 업비트 광고형 대안으로 쓸 수 있음).
- 요프리 MG-20261012-03: `Happy Whistling Ukulele`, `Ukulele Song`, `Romantic Inspiration`(모두 FreePD). 우쿨렐레 곡이라 모던 에이전시 영상에는 맞지 않아 제외.
- `01_웹툰_모션그래픽`, `02_웹툰_밤편` : Scott Buckley 곡은 CC BY 4.0(크레딧 필수)이라 제외.
