# AIO MAKE 컨텐츠 사이트 R5 소재 생성 작업지시서 (v2 · 30초 마스터 방식)

2026-10-14 · BRIEF_R5 Step 1.5 · 문서 담당 · 사용자가 Higgsfield에서 직접 무료 생성 · 5초 26개 방식(v1)을 대체합니다. 이전 판은 같은 폴더의 `ASSET_REQUEST_R5_v1_5sec.md`입니다.

- 이미지 도구: 나노바나나 프로 2 (Nano Banana Pro 2). 이미지 59장 지시는 v1과 같습니다.
- 영상 도구: Wan 3.0. 한 번에 최대 30초, 동시에 1건만 생성됩니다. 그래서 5초짜리를 하나씩 만들지 않고 **30초 마스터 영상 8개**(필수 6 + 선택 2)만 만듭니다. 팀이 ffmpeg로 자르고 줄이고 이어 붙여 **슬롯 영상 30개**(필수 17 + 선택 13)를 만듭니다.
- Wan 3.0은 한 번에 참조 이미지 최대 10장, 참조 영상 최대 5개를 받습니다. 모든 마스터에 참조 묶음(reference pack)을 정해 두었습니다. 사용법은 5장 앞부분입니다.
- 공개 화면에는 모든 소재에 '연출 예시' 라벨을 붙입니다. AI 인물이 나오는 소재에는 'AI 가상인물' 표기를 함께 붙입니다. 라벨과 표기는 사이트가 HTML로 얹으므로 이미지와 영상 안에는 글자를 넣지 않습니다.

## 0. 한눈에 보기

| 항목 | v1 (5초 개별) | v2 (30초 마스터) |
|---|---|---|
| 이미지 | 59장 | 59장 (변경 없음) |
| 사용자가 Wan 3.0으로 생성하는 횟수 | 26회 | **8회** (필수만 6회) |
| 사이트에 들어가는 슬롯 영상 | 26개 | 30개 (필수 17 · 선택 13, 팀이 편집) |

| 순서 | 마스터 ID | 길이 · 비율 | 만들어지는 슬롯 영상 | 구분 |
|---|---|---|---|---|
| 1 | `MASTER-HOME-CARDS` | 30초 · 4:3 | home-card-ai-influencer, home-card-webtoon, home-card-ad | 필수 (1순위) |
| 2 | `MASTER-ANIMATION` | 30초 · 16:9 | animation-scene-1, -2, -3, home-card-animation | 필수 (1순위) |
| 3 | `MASTER-BRANDFILM` | 30초 · 16:9 | brandfilm-main-1, -2, -3, home-card-brand-film | 필수 (1순위) |
| 4 | `MASTER-AD-A` | 30초 · 9:16 | ad-center-1, ad-rail-1 ~ 4 | 필수 (ad-center-1) |
| 5 | `MASTER-MOTION` | 30초 · 16:9 | motion-bg-1, motion-bg-2, home-card-motion-graphics | 필수 (2순위, 카드는 1순위) |
| 6 | `MASTER-HERO` | 30초 · 16:9 | home-hero-reel, home-hero-reel-mobile (가운데 세로 크롭) | 필수 (2순위) |
| 7 | `MASTER-AD-B` | 30초 · 9:16 | ad-rail-5 ~ 9 | 선택 (3순위) |
| 8 | `MASTER-PERSONAS` | 30초 · 3:4 | ai-card-1 ~ 4 영상 (슬롯 신설 필요) | 선택 (3순위) |

웹툰(`webtoon-cut-1~12`)은 이미지만 만듭니다. 변경 없습니다.

---

## 1. 전달 방법

### 저장 위치
`I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트\_소재_인박스_R5\`

### 파일 이름
- 이미지는 `<slotId>.png`로 저장합니다. 예: `home-card-ad.png`. 슬롯 ID는 4장 표의 철자를 그대로 씁니다.
- **마스터 영상은 `MASTER-<이름>.mp4`로 저장합니다.** 예: `MASTER-ANIMATION.mp4`. 슬롯별 mp4는 사용자가 만들지 않습니다. 팀이 `_편집결과\<slotId>.mp4`로 만듭니다.
- Higgsfield 기본 파일명(`higgsfield_xxx.mp4` 등)은 그대로 두지 말고 바꿔 주세요.
- 다시 만들면 같은 이름으로 덮어씁니다. 후보를 남기고 싶으면 `MASTER-ANIMATION__2.mp4`처럼 `__2`를 붙입니다. 팀이 하나를 골라 씁니다.
- 사이트에 쓰지 않는 참고 이미지(캐릭터 시트 등)는 `_ref_` 접두사를 붙입니다. 예: `_ref_seoyun-sheet.png`
- JPG로만 받을 수 있으면 `<slotId>.jpg`도 괜찮습니다.

### 참조 파일 약칭 (5장의 참조 묶음에서 씁니다)
- `[REPO]` = `I:\AIO_OS\06_GITHUB\worktrees\aio-make\codex\WRK-20261013-AIO-CONTENT-RENEWAL\public\`
- `[AIO기존]` = `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\assets\` (기존 AIO 생성 이미지 `hero.png`, `brand.png`, `webtoon.png`, `animation.png`와 `brand-motion.mp4`)
- Higgsfield가 `.webp`를 받지 않으면 팀이 PNG로 바꿔 인박스의 `_참조\` 폴더에 복사해 둡니다(7장 8번). 사용자는 그 폴더에서 올리면 됩니다.
- 고객 레퍼런스 영상(`public/reference-review/` 등)은 공개 권리 HOLD라 참조로 쓰지 않습니다.

### 해상도

이미지는 나노바나나 프로 2에서 2K(가능하면 그 이상)로 만듭니다.

| 비율 | 이미지 권장 (최소) | 마스터 영상 권장 (최소) |
|---|---|---|
| 16:9 | 2560×1440 (1920×1080) | 1920×1080 (1280×720) |
| 9:16 | 1440×2560 (1080×1920) | 1080×1920 (720×1280) |
| 4:3 | 2048×1536 (1440×1080) | 1440×1080 (960×720) |
| 3:4 | 1536×2048 (1200×1600) | 1080×1440 (720×960) |
| 2:3 | 1600×2400 (1200×1800) | 해당 없음 |

- 마스터 영상은 30초로 설정하고 소리는 없어도 됩니다. 1080p가 안 되면 720p로 받습니다.
- Wan 3.0에 4:3 또는 3:4 선택지가 없으면 가장 가까운 비율(16:9 또는 9:16)로 만들고, 프롬프트의 "피사체를 가운데 4:3(또는 3:4) 안에" 문장을 지키면 팀이 가운데를 잘라 씁니다.
- 마스터 영상은 처음 프레임을 시작 이미지(Start frame)로 넣어 만듭니다. 시작 이미지는 각 마스터의 참조 묶음 1번 이미지입니다.
- Wan 3.0에 끝 프레임(End frame) 입력이 있으면 `MASTER-HERO`에서만 시작 이미지를 끝 프레임에도 넣어 주세요. 나머지 마스터는 컷이 여러 개라 넣지 않습니다.

### 받은 뒤 팀이 하는 일
- 마스터에서 슬롯별로 잘라 웹용 mp4(H.264, 5초당 1MB 안팎)로 만들고 첫 프레임에서 포스터(WebP)를 뽑습니다. 방법은 7장입니다.
- `public/content-examples/`로 옮겨 `lib/content-site/example-media.ts`의 슬롯과 연결합니다.
- 이미지는 WebP로 변환하고 화면 크기에 맞춰 자릅니다.
- 마스터 원본과 이미지 원본은 인박스에 그대로 둡니다.

### 우선순위와 생성 순서

영상은 한 번에 하나씩만 생성되므로 Wan 3.0이 돌아가는 동안 다음 마스터의 시작 이미지(나노바나나)를 만들어 두세요.

| 순서 | 마스터 | 먼저 있어야 하는 이미지 | 참조 영상 (먼저 만든 마스터) |
|---|---|---|---|
| 1 | `MASTER-HOME-CARDS` | home-card-ai-influencer, home-card-webtoon, home-card-ad, ad-center-1, `_ref_seoyun-sheet` | 없음 |
| 2 | `MASTER-ANIMATION` | animation-scene-1 ~ 3, animation-character-front/side, home-card-animation | 없음 |
| 3 | `MASTER-BRANDFILM` | brandfilm-main-1 ~ 3, home-card-brand-film | 기존 `brandfilm-motion.mp4` |
| 4 | `MASTER-AD-A` | ad-center-1, ad-rail-1 ~ 4, home-card-ad | **MASTER-HOME-CARDS** |
| 5 | `MASTER-MOTION` | motion-bg-1, motion-bg-2, home-card-motion-graphics, home-hero-reel | 기존 `brandfilm-motion.mp4` |
| 6 | `MASTER-HERO` | home-hero-reel | **MASTER-MOTION** |
| 7 | `MASTER-AD-B` (선택) | ad-rail-5 ~ 9, ad-center-1 | **MASTER-AD-A** |
| 8 | `MASTER-PERSONAS` (선택) | ai-card-1 ~ 4 | **MASTER-HOME-CARDS** |

처음 3개(HOME-CARDS → ANIMATION → BRANDFILM)로 카드 6개 중 5개와 장면 영상 6개가 채워집니다. 4번(AD-A)에서 ad-center-1, 5번(MOTION)에서 여섯 번째 카드가 채워지며 홈 캐러셀이 완성됩니다.

### 공통 금지
- 글자·숫자·자막·로고·브랜드 마크·워터마크 금지. 휴대폰 화면 속 UI 글자도 금지합니다.
- 실존 연예인, 알아볼 수 있는 실존 인물, 실제 고객사 이름·제품은 쓰지 않습니다. 제품은 모두 무상표 가상 제품입니다.
- 87언니·옆집엄마·그레이스의정원·쌀만드는아저씨는 회사 자체 AI 가상인물 IP라 써도 됩니다. 효과·후기·전후 비교를 암시하는 장면은 만들지 않습니다.
- 웹툰과 애니메이션 캐릭터는 이 문서에서 새로 정한 자체 IP만 씁니다. 기존 유명 작품이나 캐릭터를 닮지 않게 합니다.

---

## 2. 공통 스타일 블록 (이미지 프롬프트 끝에 붙이기)

지금 사이트는 검정 바탕(#080808)에 보라 강조색(#A99BFF)을 씁니다. 기존 AIO 생성 이미지(`hero`·`brand`·`webtoon`·`animation`)를 실제로 열어 확인했습니다. 공통 기준은 어두운 숯색 무대, 보라 측광과 따뜻한 코랄·호박색 보조광, 아이보리·라벤더 하이라이트, 유리·트래버틴·새틴 같은 촉감 있는 재질, 고급 CGI·광고 사진 질감, 옅은 필름 그레인입니다. 아래 블록 중 슬롯에 표시된 것을 **이미지** 프롬프트 뒤에 그대로 붙여 넣으세요. 영상 마스터 프롬프트(5장)에는 같은 분위기가 이미 풀어 쓰여 있습니다.

### [S-CINE] 사진·CGI 기본 (홈·모션그래픽·브랜드 영상·광고) · 나노바나나 이미지용
```
Premium cinematic art direction for a dark-themed creative studio website. Near-black charcoal background tones, low-key lighting, soft violet rim light (#A99BFF) with a warm coral-amber accent light, ivory and lavender highlights, deep shadows that keep detail. Tactile materials: clear and violet glass, ivory travertine, satin fabric, brushed silver. 50mm lens look, shallow depth of field, subtle analog film grain, high dynamic range, crisp detail. No text, no letters, no numbers, no logos, no brand marks, no watermark, no UI captions, no real celebrities, no recognizable real people. Single cohesive frame, not a collage, not a website screenshot.
```

### [S-PERSONA] AI 가상인물 (AI 인플루언서 카드·피드·홈 카드)
```
Photorealistic editorial portrait photography of a fictional AI virtual person, clearly an adult, realistic skin texture with natural pores, natural hands with five fingers, consistent face identical to the reference image. Soft natural light, warm neutral palette with a subtle lavender accent somewhere in the scene, 35mm to 50mm lens look, shallow depth of field, light film grain, authentic rather than over-retouched. No text, no logos, no brand names on any product, no watermark, not a collage.
```

### [S-WEBTOON] 웹툰 컷
```
Original Korean webtoon panel illustration, refined clean ink linework, soft cel shading with painterly gradients, cinematic lavender and violet palette with warm orange accents and cream highlights, subtle off-white paper texture, consistent character design identical to the reference. Single panel only, no page grid, no speech bubbles, no text, no sound-effect lettering, no logos, no watermark.
```

### [S-3D] 애니메이션
```
Premium stylized 3D animation still, soft clay-and-glass materials, polished feature-animation quality, warm golden light with violet shadows, studio ambient occlusion, cinematic depth of field, beautiful scale and perspective. Original character design that does not resemble any existing famous character. No text, no letters, no logos, no watermark.
```

### [M-MASTER] Wan 3.0 마스터 영상 공통 (5장의 통합 프롬프트 맨 끝에 한 번 붙이기)
```
Smooth, slow, cinematic motion. Keep every subject's identity, face, shape, colors and lighting consistent from the first frame to the last, and consistent with the reference images. No text, letters, logos or watermarks appearing, no new objects popping in, no morphing, no flicker, no camera shake, no fast motion.
```
5장의 통합 프롬프트에는 스타일 문장이 이미 들어 있으므로 [S-CINE] 등을 따로 붙이지 않습니다. 이 장의 [S-CINE]·[S-PERSONA]·[S-WEBTOON]·[S-3D]는 **나노바나나 이미지**용입니다.

### [NEG] Wan 3.0 네거티브 프롬프트 (입력칸이 있으면, 모든 마스터 공통)
```
text, letters, subtitles, captions, logo, watermark, brand name, extra fingers, deformed hands, distorted face, identity change, morphing, flicker, jitter, fast motion, scene cut, motion blur smear, low quality
```

---

---

## 3. 캐릭터 시트 (고정 설명, 매번 그대로 복사)

일관성을 지키는 방법:
1. 나노바나나 프로 2의 참조 이미지(Reference) 칸에 기준 이미지를 1~3장 올립니다.
2. 아래 고정 설명을 프롬프트 앞부분에 그대로 붙입니다.
3. 같은 인물의 다음 장면은 앞에서 마음에 든 결과물을 다시 참조로 올립니다.

### 3-1. AI 가상인물 4명 (자체 IP · 공개 화면 'AI 가상인물' 표기)

사이트 `lib/content-site/creator-roster.ts`에 이미 등록된 자체 AI 가상인물 4명을 그대로 씁니다. 기준 이미지가 있으니 반드시 참조로 올리세요. 새 인물을 만들면 기존 계정 설정과 어긋납니다.

**P1 · 87언니 (기록하는87)** · 뷰티·자기관리 · 콘셉트 "87년생의 영상일기"
- 기준 이미지: `I:\AIO_OS\06_GITHUB\worktrees\aio-make\codex\WRK-20261013-AIO-CONTENT-RENEWAL\public\content-site\ai-influencer\unnie87-face.webp`, `unnie87-front.webp`, `unnie87-full.webp`
```
CHARACTER P1 "87 Unnie": a fictional Korean woman in her late thirties with a youthful, gentle look; shoulder-length layered soft brown hair with wispy see-through bangs and face-framing waves; warm brown eyes, soft rounded face, clear dewy skin, rosy glossy lips; small pearl stud earrings and a delicate thin gold chain necklace with one pearl; signature outfit is a cream chunky-knit cardigan over a crisp white collared shirt; calm, warm, close-lipped smile.
```

**P2 · 옆집엄마** · 리빙·신혼 라이프스타일
- 기준 이미지: 같은 폴더 `yeopjip-portrait.webp`, `yeopjip-style.webp`, `yeopjip-detail.webp`
```
CHARACTER P2 "Next-door Newlywed": a fictional Korean woman in her early thirties; long wavy dark chestnut-brown hair with a center part falling past the shoulders; straight natural brows, calm almond-shaped dark brown eyes, slim oval face, minimal natural makeup with muted rose lips; thin gold hoop earrings; wears soft beige or camel tones such as a button-up shirt or a loose knit sweater; composed, friendly expression.
```

**P3 · 그레이스의정원** · 시니어 라이프스타일
- 기준 이미지: 같은 폴더 `grace-portrait.webp`, `grace-style.webp`, `grace-full.webp`
```
CHARACTER P3 "Grace's Garden": a fictional Korean woman in her early sixties; chin-length silver-gray bob with a side part and soft volume; warm smile with fine laugh lines, gentle dark eyes, light natural makeup with coral-rose lips; signature outfit is a beige double-breasted trench coat over a navy crew-neck knit, camel straight trousers and tan leather loafers, sometimes a small patterned silk scarf as a color accent; elegant, relaxed posture.
```

**P4 · 쌀만드는아저씨** · 농업·귀농 라이프스타일
- 기준 이미지: 같은 폴더 `ssal-portrait.webp`, `ssal-farm.webp`, `ssal-full.webp`
```
CHARACTER P4 "Rice Farmer Uncle": a fictional Korean man in his early sixties; short salt-and-pepper hair brushed up and back; lightly tanned skin, crow's-feet and smile lines, kind dark eyes, gentle closed-mouth smile; slim build; signature top is a navy crew-neck knit, and in farm scenes a faded denim work shirt, a beige utility vest and a woven straw hat.
```

### 3-2. 웹툰 등장인물 (자체 IP · 작품 가제 《날아간 스케치북》)

- 줄거리: 바람 부는 저녁, 콘티 작가 서윤의 스케치북 종이가 옥상에서 도시로 흩어집니다. 자전거 배송원 도현이 종이를 모아 돌려주는데, 그중 한 장에 서윤이 예전에 그린 도현의 모습이 있습니다.
- 서윤 기준 이미지: `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\assets\webtoon.png`. 기존 AIO 생성 이미지라 그림체와 인물이 같습니다. 이 이미지로 먼저 `_ref_seoyun-sheet.png`(정면·측면·전신 시트)를 만들고, 도현도 `_ref_dohyeon-sheet.png`를 만든 뒤 컷마다 둘 다 참조로 올리기를 권장합니다.
- 배경은 이름 없는 한국 도시입니다. 실제 랜드마크(남산타워 등)는 넣지 않습니다.

```
CHARACTER W1 "Seo-yun": a fictional Korean woman in her early twenties, a storyboard artist; wind-swept dark brown-black bob with soft layers just above the shoulders and side-swept bangs; gray-violet eyes, calm confident expression; oversized ivory trench-style jacket over a black top, black wide trousers, thin black crossbody strap; always carries a violet spiral-bound sketchbook.
```
```
CHARACTER W2 "Do-hyeon": a fictional Korean man in his mid twenties, a bicycle courier; short tousled black hair with a slightly long fringe; warm brown eyes, friendly smile with a small dimple on the left cheek; muted olive-khaki windbreaker over a white T-shirt, dark gray cargo pants, white sneakers, coral-orange messenger bag without any logo; rides a matte black city bicycle.
```

### 3-3. 애니메이션 캐릭터 (자체 IP · "보리")

- 기준 이미지: `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\assets\animation.png`. 기존 AIO 생성 캐릭터입니다.
- 이야기 가제 《보리의 작은 선물》: 보리가 계단에서 선물 상자를 발견하고, 상자에서 빛 구슬이 날아오르고, 구슬이 자리를 찾자 세상이 환해집니다. 3장면이 이어집니다.

```
CHARACTER A1 "Bori": an original 3D mascot, a glossy soft lilac bean-shaped creature whose whole body is one rounded form about knee-high to an adult; two large round white eyes with glossy black pupils and tiny highlights; a small curved smile; short rounded stubby arms; two short cylindrical legs; no ears, no clothing, no accessories; glossy vinyl-clay material with soft subsurface glow.
WORLD: miniature surreal architecture with cream stone walls and round windows, a large coral-red arch, lavender stairs, a mirror-chrome sphere, a pale yellow sun disk, a shallow calm pool.
```

---

---

## 4. 슬롯별 지시

표기: 이 장은 **이미지(나노바나나 프로 2)** 지시만 담습니다. 종류 칸의 `영상 ○`은 그 슬롯의 영상이 5장 마스터에서 만들어진다는 뜻이며 개별 생성하지 않습니다. 비율·해상도는 1장 표를 따릅니다.

### 4-1. 컨텐츠 홈 (`/content`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `home-hero-reel` | 홈 히어로 배경 (데스크톱) | IMG · 영상 ○ | 16:9 | 루프 | 2순위 |
| `home-hero-reel-mobile` | 홈 히어로 배경 (모바일) | IMG · 영상 ○ | 9:16 | 루프 | 2순위 |
| `home-card-webtoon` | 서비스 3D 캐러셀 카드 | IMG · 영상 ○ | 4:3 | 루프 | 1순위 |
| `home-card-animation` | 〃 | IMG · 영상 ○ | 4:3 | 루프 | 1순위 |
| `home-card-ai-influencer` | 〃 | IMG · 영상 ○ | 4:3 | 루프 권장 | 1순위 |
| `home-card-motion-graphics` | 〃 | IMG · 영상 ○ | 4:3 | 루프 | 1순위 |
| `home-card-brand-film` | 〃 | IMG · 영상 ○ | 4:3 | 루프 권장 | 1순위 |
| `home-card-ad` | 〃 | IMG · 영상 ○ | 4:3 | 루프 | 1순위 |

카드 비율: `content-home.css`의 R4 깊이 캐러셀(`.ch-depth-media`)은 데스크톱 540×390(약 4:3), 모바일 280×320(거의 정사각)이고 `object-fit: contain`입니다. 그래서 4:3으로 만들고 주인공을 가운데 3:4 영역 안에 둡니다. 모바일에서 가운데를 잘라 써도 주인공이 남습니다.

#### `home-hero-reel` · 16:9 · IMG · 영상 ○ · 루프 · 2순위
- 설명: 컨텐츠 홈 첫 화면 배경 루프입니다. 기존 `hero.webp`와 같은 세계(보라 유리 리본 아치, 아이보리 구, 필름 스트립)를 씁니다. 왼쪽 절반은 어둡게 비워 제목 자리로 남깁니다.
- 참조: `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\assets\hero.png`
- 이미지 프롬프트 (+[S-CINE])
```
Ultra-wide cinematic scene: a sculptural translucent violet glass ribbon arching over a dark reflective satin stage, three matte ivory spheres of different sizes and one small clear glass sphere resting beside dark volcanic rocks on the right, an iridescent transparent film strip curling around them, delicate coral-pink branch sprigs, a faint warm coral glow behind. The left half of the frame stays dark, empty and quiet for a headline overlay. Looks like a frame from a luxury motion-design brand film, photographed premium CGI.
```

#### `home-hero-reel-mobile` · 9:16 · IMG · 영상 ○ · 루프 · 2순위
- 설명: 같은 장면을 세로로 다시 구성합니다. 위쪽 1/3은 제목 자리라 어둡게 비웁니다.
- 참조: `home-hero-reel.png`
- 이미지 프롬프트 (+[S-CINE])
```
Vertical composition of the same world: a translucent violet glass ribbon rising from the lower right in a tall arch, ivory spheres, a small clear glass sphere and an iridescent film strip clustered at the bottom on a dark reflective satin floor, faint coral glow. The upper third of the frame is dark, empty and quiet for a headline overlay. Premium CGI brand-film frame.
```

#### `home-card-webtoon` · 4:3 · IMG · 영상 ○ · 루프 · 1순위
- 설명: 웹툰 대표 카드입니다. 서윤이 노을 지는 옥상에서 스케치북을 들고 있고, 주변에 웹툰 컷 3개가 떠 있습니다.
- 참조: `webtoon.png` (캐릭터 시트를 먼저 만들었다면 `_ref_seoyun-sheet.png`)
- 이미지 프롬프트 (CHARACTER W1 + 아래 + [S-WEBTOON], 이 슬롯만 "Single panel only" 문장을 지우고 사용)
```
Webtoon key art: Seo-yun stands on a city rooftop at violet dusk holding her violet sketchbook, hair and jacket moving in the wind, surrounded by three floating rectangular comic panels with thin white borders at different depths: one shows a glowing city skyline, one a close-up of her eye, one sheets of paper flying. Loose sketch pages drift through the air. Subject centered, generous dark violet margins on the left and right.
```

#### `home-card-animation` · 4:3 · IMG · 영상 ○ · 루프 · 1순위
- 설명: 애니메이션 대표 카드입니다. 보리가 아치 세계의 라벤더 계단 위에서 손을 흔듭니다.
- 참조: `animation.png`
- 이미지 프롬프트 (CHARACTER A1 + 아래 + [S-3D])
```
Bori stands on the top step of the lavender stairs under the large coral arch, waving one stubby arm with a happy face, the pale yellow sun disk behind the arch, the chrome sphere on a side ledge reflecting the scene, warm golden late-afternoon light with soft violet shadows. Low camera angle, character centered with space around.
```

#### `home-card-ai-influencer` · 4:3 · IMG · 영상 ○ · 루프 권장 · 1순위 · 'AI 가상인물' 표기
- 설명: AI 인플루언서 대표 카드입니다. 87언니가 어두운 스튜디오에서 카메라를 보는 모습이며, 사이트 톤에 맞춰 보라 측광을 씁니다.
- 참조: `unnie87-face.webp`, `unnie87-front.webp`
- 이미지 프롬프트 (CHARACTER P1 + 아래 + [S-PERSONA])
```
Waist-up portrait of 87 Unnie seated at a minimal dark studio set, one hand resting near her cheek, looking softly into the camera. Background is deep charcoal with a soft violet rim light from behind and a warm key light from the front left, a blurred small unbranded glass bottle and a ceramic cup on the table edge. Subject centered.
```

#### `home-card-motion-graphics` · 4:3 · IMG · 영상 ○ · 루프 · 1순위
- 설명: 모션그래픽 대표 카드입니다. 도형만으로 구성한 추상 화면이고 글자는 넣지 않습니다.
- 이미지 프롬프트 (+[S-CINE])
```
Abstract kinetic composition on a near-black background: a violet glass torus, a matte ivory sphere, a flat coral disc, a mirror-chrome capsule and a small lavender cube float in a balanced arrangement at different depths, connected by thin glowing violet lines and dotted arcs like a motion-design layout grid. Clean, graphic, premium 3D render.
```

#### `home-card-brand-film` · 4:3 · IMG · 영상 ○ · 루프 권장 · 1순위
- 설명: 브랜드 영상 대표 카드입니다. 가상 도자기 공방에서 장인의 손이 물레로 컵을 빚습니다. `brandfilm-main`과 같은 세계입니다.
- 이미지 프롬프트 (+[S-CINE])
```
Cinematic close shot of an artisan's hands shaping a small pale clay cup on a spinning pottery wheel inside a dim minimalist studio, warm amber window light from the side, a soft violet rim light outlining the hands and clay, fine dust in the air, unbranded tools on a shelf in soft focus. Face not visible.
```

#### `home-card-ad` · 4:3 · IMG · 영상 ○ · 루프 · 1순위
- 설명: SNS 광고 대표 카드입니다. 로고 없는 휴대폰이 비스듬히 떠 있고, 화면 안에 세로 향수 광고 장면이 보입니다. `ad-center-1`과 같은 제품입니다.
- 이미지 프롬프트 (+[S-CINE])
```
A generic modern smartphone with thin black bezels and no logo floats tilted about 15 degrees against a near-black background. Its screen shows a vertical ad scene: an unbranded amber glass perfume bottle with a blank label standing on an ivory travertine block, a sheer violet fabric sweeping behind it, warm coral light. The phone screen contains no interface text or icons. Soft violet rim light on the phone edges, subtle reflection below.
```

### 4-2. 웹툰 (`/content/webtoon`) · 이미지만

| 슬롯 ID | 사용처 | 종류 | 비율 | 순위 |
|---|---|---|---|
| `webtoon-cut-1` ~ `webtoon-cut-12` | 12컷 리더(3D 페이지 넘김) · 표지 3컷 펼침 | IMG | 2:3 (리더 800×1200 기준) | 2순위 |

- 모든 컷: CHARACTER W1·W2 중 등장인물 설명 + 컷 설명 + [S-WEBTOON]. 참조로 `_ref_seoyun-sheet.png`와 `_ref_dohyeon-sheet.png`, 직전 컷을 함께 올립니다.
- 대사와 말풍선은 넣지 않습니다. 필요하면 팀이 HTML로 얹습니다.
- 컷 아래쪽 1/6은 비교적 단순하게 비워 둡니다.

| 슬롯 | 한국어 설명 | 영문 컷 프롬프트 |
|---|---|---|
| `webtoon-cut-1` | 노을 진 도시 옥상, 서윤이 난간 옆에서 스케치 | `Wide establishing panel: Seo-yun sits on a rooftop ledge bench at violet dusk sketching in her violet sketchbook, a generic city skyline with warm windows below, long shadows.` |
| `webtoon-cut-2` | 펜 끝과 스케치북 클로즈업, 거리 사람들의 스케치 | `Close-up panel: Seo-yun's hand holding a fine pen over the open violet sketchbook, pages filled with small wordless sketches of street scenes and a cyclist, warm orange sunset light on the paper.` |
| `webtoon-cut-3` | 갑자기 강한 바람, 종이가 뜯겨 날아오름 | `Dynamic panel: a sudden gust of wind, many loose sketch pages tear free from the sketchbook and burst into the air, Seo-yun's hair and jacket whipped sideways, speed lines drawn as wind streaks.` |
| `webtoon-cut-4` | 놀라서 손을 뻗는 서윤 | `Medium close-up panel: Seo-yun reaches out toward the flying pages with a shocked expression, eyes wide, pages fluttering just beyond her fingertips.` |
| `webtoon-cut-5` | 도시 위로 흩어지는 종이 부감 | `High-angle wide panel: dozens of white sketch pages scatter over the city streets at dusk like birds, tiny cars and streetlights below, lavender sky.` |
| `webtoon-cut-6` | 자전거 탄 도현, 핸들에 종이 한 장이 내려앉음 | `Panel: Do-hyeon rides his matte black city bicycle down a narrow street, a single sketch page lands on his handlebar, he glances down in surprise.` |
| `webtoon-cut-7` | 종이를 보고 미소 짓는 도현 | `Close-up panel: Do-hyeon stopped at the curb, holding the sketch page up in the streetlight and smiling with his left-cheek dimple, the back of the page faintly visible.` |
| `webtoon-cut-8` | 계단을 뛰어 내려가는 서윤 | `Panel with strong diagonal composition: Seo-yun runs down a building's emergency staircase clutching the half-empty violet sketchbook, motion lines, worried face.` |
| `webtoon-cut-9` | 골목 곳곳에서 종이를 줍는 도현 | `Panel: Do-hyeon on foot beside his bicycle picking up sketch pages from an alley, a lamp post and a cafe awning, a small stack of pages in his hand, warm shop lights.` |
| `webtoon-cut-10` | 건물 입구 가로등 아래 두 사람의 만남 | `Two-shot panel: at the building entrance under a streetlight, out-of-breath Seo-yun meets Do-hyeon, who holds out the neat stack of collected pages, soft violet night.` |
| `webtoon-cut-11` | 건네받은 종이 중 한 장에 도현의 스케치 | `Close-up panel: their hands meet over the stack of pages; the top page shows a pencil sketch of a cyclist who clearly looks like Do-hyeon; both faces blush slightly at the frame edges.` |
| `webtoon-cut-12` | 밤 옥상, 나란히 앉아 스케치북을 보는 두 사람 | `Final wide panel: Seo-yun and Do-hyeon sit side by side on the rooftop at night looking at the reassembled violet sketchbook, the city lights glowing below, calm warm mood, a few stars.` |

### 4-3. 애니메이션 (`/content/animation`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `animation-scene-1` | 장면 전환(깊이·크로스컷) 1 · 시작 | IMG · 영상 ○ | 16:9 | 아니오 | 1순위 |
| `animation-scene-2` | 〃 2 · 전개 | IMG · 영상 ○ | 16:9 | 아니오 | 1순위 |
| `animation-scene-3` | 〃 3 · 마무리 | IMG · 영상 ○ | 16:9 | 끝 정지 | 1순위 |
| `animation-character-front` | 캐릭터 설정(정면) | IMG | 4:3 | — | 3순위 선택 |
| `animation-character-side` | 캐릭터 설정(측면) | IMG | 4:3 | — | 3순위 선택 |

세 장면은 한 이야기로 이어집니다. 1번 결과물을 2·3번의 참조로 올려 조명과 세계를 맞춥니다. 모든 이미지는 CHARACTER A1 + 장면 설명 + [S-3D]입니다. 영상은 5-2 `MASTER-ANIMATION` 한 번의 테이크에서 팀이 세 장면으로 자릅니다.

#### `animation-scene-1` · 시작
- 설명: 아침 햇살, 계단 위의 보리가 리본 달린 작은 상자를 발견합니다.
- 이미지
```
Wide cinematic shot: early golden morning in Bori's world. Bori stands at the top of the lavender stairs and leans forward curiously toward a small ivory gift box tied with a violet ribbon on the step below, the coral arch framing the scene, sun disk rising behind, long soft shadows.
```

#### `animation-scene-2` · 전개
- 설명: 상자가 열리고 따뜻한 빛 구슬이 떠올라 아치 사이로 날아갑니다. 보리가 손을 뻗습니다.
- 참조: `animation-scene-1.png`
- 이미지
```
Medium-wide shot: the gift box lid has popped open and a glowing warm amber orb of light floats up out of it, rising toward the coral arch; Bori reaches both stubby arms up with an excited face, the orb's light painting warm highlights on its glossy lilac body.
```

#### `animation-scene-3` · 마무리
- 설명: 빛 구슬이 연못가 원형 받침대에 내려앉고 세계 전체가 환해집니다. 보리가 카메라를 향해 손을 흔듭니다.
- 참조: `animation-scene-1.png`, `animation-scene-2.png`
- 이미지
```
Wide closing shot: the glowing orb rests on a round lavender pedestal beside the shallow pool, warm light radiating across the cream walls and coral arch, the whole world brighter and golden; Bori stands next to it facing the camera and waving happily, the sun disk centered behind.
```

#### `animation-character-front` / `animation-character-side` · 선택
- 설명: 애니메이션 페이지 '캐릭터 설정(정면·측면)'에 쓰는 설정 이미지입니다.
- 이미지
```
Character turnaround sheet view of Bori, [front view | exact side profile view], neutral standing pose, full body centered on a plain warm cream background with a soft floor shadow, even studio lighting, no props.
```
(대괄호 안에서 슬롯에 맞는 하나만 남깁니다.)

### 4-4. 모션그래픽 (`/content/motion-graphics`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `motion-bg-1` | 히어로·글자 배치 배경 루프(도형) | IMG · 영상 ○ | 16:9 | 이음새 없는 루프 | 2순위 |
| `motion-bg-2` | 스타일 프레임·장면 전환 배경 루프(리본) | IMG · 영상 ○ | 16:9 | 이음새 없는 루프 | 2순위 |

글자가 위에 얹히므로 화면 가운데는 비교적 어둡고 단순하게 둡니다.

#### `motion-bg-1` · 기하 도형 궤도
- 설명: 검정 바탕 위에서 보라 유리 링, 아이보리 구, 코랄 원판, 크롬 캡슐, 라벤더 큐브가 가장자리 쪽에 흩어져 천천히 돕니다.
- 이미지 (+[S-CINE])
```
Abstract motion-graphics background on a near-black field: a violet glass ring, a matte ivory sphere, a flat coral disc, a mirror-chrome capsule and a small lavender cube float near the edges and corners at different depths, thin glowing violet guide lines and dotted arcs connect them. The center of the frame is dark and empty for typography. Clean premium 3D render.
```

#### `motion-bg-2` · 유리 리본 물결
- 설명: 반투명 보라 유리 리본 두 가닥과 가는 빛 선이 화면 아래쪽에서 천천히 물결칩니다.
- 이미지 (+[S-CINE])
```
Abstract background: two translucent violet glass ribbons flow in long horizontal waves across the lower third of a near-black frame, a few fine glowing light threads run parallel to them, tiny coral and ivory light specks float in the dark upper area. Minimal, elegant, premium CGI.
```

### 4-5. 브랜드 홍보 영상 (`/content/brand-film`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `brandfilm-main-1` | 대체 영상 컷 1 · 도입(전경) + 포스터 | IMG · 영상 ○ | 16:9 | 아니오 | 1순위 |
| `brandfilm-main-2` | 컷 2 · 핵심 메시지(제품·사람) + 포스터 | IMG · 영상 ○ | 16:9 | 아니오 | 1순위 |
| `brandfilm-main-3` | 컷 3 · 마무리 + 포스터 | IMG · 영상 ○ | 16:9 | 끝 정지 | 1순위 |

- 가상의 소규모 도자기 공방을 소개하는 영상입니다. 브랜드명과 로고는 없습니다.
- 영상은 5-3 `MASTER-BRANDFILM`에서 팀이 `brandfilm-main-1~3`을 잘라 만들고, 이어 붙여 15초 `brandfilm-main.mp4`(muted autoplay 루프)를 만듭니다. 이미지 3장은 각 컷의 포스터 후보와 30초·60초 구성 표의 장면 역할(도입·핵심 메시지·마무리) 이미지로 씁니다.
- 세 컷의 색감을 맞추기 위해 1번 결과물을 2·3번의 참조로 올립니다. 3번은 기존 `brand.png`도 참조로 올립니다(`I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\assets\brand.png`).

#### `brandfilm-main-1` · 도입
- 설명: 푸른 새벽, 안개 낀 언덕 위 콘크리트·유리 공방 건물 창에 따뜻한 불이 켜져 있습니다.
- 이미지 (+[S-CINE])
```
Wide establishing shot at blue hour: a minimalist concrete-and-glass craft studio building on a misty hillside among dark pine trees, warm amber light glowing from its tall windows, a thin band of violet sky above the ridge, soft fog in the valley. Cinematic, calm, premium documentary look.
```

#### `brandfilm-main-2` · 핵심 메시지
- 설명: 공방 안에서 장인 두 명이 일합니다. 앞의 한 명은 물레를 돌리고, 뒤의 한 명은 유약을 바릅니다. 얼굴은 알아볼 수 없게 잡습니다.
- 이미지 (+[S-CINE])
```
Interior medium-wide shot inside the craft studio: in the foreground an artisan in a linen apron shapes a pale clay cup on a pottery wheel, seen from the side with the face turned away; in the soft-focus background a second artisan glazes ivory cups at a wooden table; shelves of unbranded ceramics, warm window light with a violet rim light, floating dust.
```

#### `brandfilm-main-3` · 마무리
- 설명: 완성된 아이보리 컵에서 김이 오르고, 트래버틴 받침, 보라 천, 둥근 창의 코랄 햇빛이 보입니다. 왼쪽 1/3은 나중에 문구를 넣을 자리라 어둡게 둡니다.
- 이미지 (+[S-CINE])
```
Closing hero still life: a finished handmade ivory ceramic cup with steam rising, standing on a sculptural ivory travertine block on the right two-thirds of the frame, a sheer violet fabric floating behind it, warm coral sunlight falling through a circular aperture, deep lavender shadows. The left third is dark and quiet for a later title.
```

### 4-6. SNS 광고 영상 (`/content/ad`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `ad-center-1` | 가운데 고정 세로 영상 | IMG · 영상 ○ | 9:16 | 루프 | 1순위 |
| `ad-rail-1` ~ `ad-rail-9` | 기울어진 3열 레일(열당 3장, 18초 왕복) | IMG 필수 · 영상 선택 | 9:16 | 루프 | 이미지 1순위 · 영상 3순위 |
| `ad-hook-1` ~ `ad-hook-3` | '장면의 역할' 휴대폰 화면 3컷 | IMG | 9:16 | — | 3순위 선택 |

- 레일은 이미지로 먼저 채우고, 영상은 마스터를 만드는 김에 함께 나오는 만큼 씁니다. 레일이 계속 움직이므로 이미지만으로도 충분히 동적으로 보입니다.
- 레일 9장은 업종이 모두 달라야 합니다. 그래도 같은 사이트 톤을 위해 어두운 배경, 보라 측광, 따뜻한 보조광은 공통으로 씁니다.
- 각 장면의 위쪽 1/4과 아래쪽 1/5은 비교적 단순하게 둡니다. 팀이 광고 문구 장식을 얹을 수 있습니다.

#### `ad-center-1` · 1순위
- 설명: 향수 광고 세로 영상입니다. 보라 천이 휩쓸며 지나가면 무상표 호박색 향수병이 드러납니다.
- 이미지 (+[S-CINE])
```
Vertical product ad frame: an unbranded amber glass perfume bottle with a blank ivory label and a brushed silver cap stands on an ivory travertine block in the middle of the frame, a sheer violet fabric sweeping diagonally behind it, warm coral light through a circular aperture, deep charcoal-lavender shadows, glossy reflections on the glass. The top quarter and bottom fifth are calm and simple.
```

#### `ad-rail-1` ~ `ad-rail-9`
이미지 프롬프트 = 아래 문장 + [S-CINE]입니다. 레일 영상(선택)은 5-4 `MASTER-AD-A`(레일 1~4)와 5-7 `MASTER-AD-B`(레일 5~9)에서 만듭니다.

| 슬롯 | 업종 | 한국어 설명 | 영문 이미지 프롬프트 |
|---|---|---|---|
| `ad-rail-1` | 뷰티(립) | 무상표 립스틱과 장미 꽃잎 | `Vertical product ad frame: an unbranded glossy rose-red lipstick bullet in a plain silver case, standing on a dark mirror surface, scattered rose petals, violet rim light, soft coral highlight.` | `Petals fall slowly past the lipstick, light glint slides over the bullet, slow orbit 10 degrees.` |
| `ad-rail-2` | 음식 | 김 오르는 떡볶이 팬 | `Vertical food ad frame: a shallow black pan of glossy Korean rice-cake tteokbokki with fish cake and boiled egg, steam rising, sesame sprinkled, dark wooden table, warm amber key light, violet rim.` | `Steam rises and curls, sauce bubbles gently, very slow push-in.` |
| `ad-rail-3` | 패션 | 공중에 뜬 흰 스니커즈와 라벤더 스카프 | `Vertical fashion ad frame: a pair of unbranded white leather sneakers floating mid-air at playful angles, a lavender silk scarf ribbon looping around them, dark studio, violet rim light.` | `Sneakers rotate slowly in the air, the scarf ripples and loops, gentle floating bob.` |
| `ad-rail-4` | 앱 | 손에 든 휴대폰, 화면엔 글자 없는 추상 카드 UI | `Vertical app ad frame: a hand holding a generic logo-free smartphone, the screen shows abstract colorful rounded cards and soft gradient shapes with no text or icons, glowing violet light spilling from the screen onto the hand, dark background.` | `Cards on the screen slide up smoothly one after another, the hand moves very slightly, screen glow pulses softly.` |
| `ad-rail-5` | 카페 | 라테아트 커피와 아침 햇살 | `Vertical cafe ad frame: a ceramic cup of latte with leaf latte art on a dark wooden counter, morning sunlight beam through a window, steam rising, blurred cafe interior with warm bulbs, violet shadows.` | `Steam swirls upward, the sunlight beam shimmers with dust, slow push-in.` |
| `ad-rail-6` | 피트니스 | 어두운 체육관, 케틀벨 스쿼트 | `Vertical fitness ad frame: an athletic adult woman in plain dark sportswear mid-squat holding a matte kettlebell in a dim gym, strong violet rim light outlining her silhouette, warm key light, face partly in shadow, no logos.` | `She rises slowly from the squat and lowers again in one controlled repetition, chalk dust drifts in the light.` |
| `ad-rail-7` | 스킨케어 | 뚜껑 열린 크림 단지와 물방울 | `Vertical skincare ad frame: an open unbranded frosted glass cream jar with a smooth swirl of white cream, water droplets on the glass, ivory travertine base, violet reflections, soft coral light.` | `A drop of water slides down the jar, light glint moves across the cream swirl, slow orbit.` |
| `ad-rail-8` | 디저트 | 딸기 케이크 한 조각과 떨어지는 딸기 | `Vertical dessert ad frame: a slice of layered strawberry cream cake on a dark ceramic plate, fresh strawberries and a few falling in mid-air, powdered sugar dust, warm amber key light, violet rim.` | `Strawberries fall slowly in the air, powdered sugar drifts down, very slow push-in.` |
| `ad-rail-9` | 리빙 | 향초와 디퓨저, 리넨 위 | `Vertical home-living ad frame: an unbranded amber glass candle with a lit flame next to a reed diffuser on folded linen, a dim cozy room with a warm window glow, violet shadows.` | `The candle flame flickers gently, a thin wisp of smoke curls up, soft light breathing on the linen.` |

#### `ad-hook-1` ~ `ad-hook-3` · 선택
- 설명: 광고 페이지의 '첫 장면·제품 장면·마지막 장면' 휴대폰 화면 3컷입니다. 현재 alt 문구(보라 천 / 돌 받침 위 향수병 / 문의 버튼 자리)와 맞춥니다. `ad-center-1.png`를 참조로 올립니다.
- 이미지 (+[S-CINE])
  - `ad-hook-1`: `Vertical frame: close-up of a sheer violet fabric with a beam of warm light grazing across its folds, dark background, no product visible, the upper third calm for a short headline.`
  - `ad-hook-2`: `Vertical frame: the same unbranded amber perfume bottle shown large on the ivory travertine block, filling the middle of the frame, a calm dark band across the lower fifth for a subtitle.`
  - `ad-hook-3`: `Vertical frame: the same perfume bottle small in the upper half on the travertine block, the lower 40 percent of the frame dark and empty for a call-to-action button.`

### 4-7. AI 인플루언서 (`/content/ai-influencer`) · 전부 'AI 가상인물' 표기

| 슬롯 ID | 사용처 | 종류 | 비율 | 순위 |
|---|---|---|---|
| `ai-card-1` ~ `ai-card-4` | 4계정 3D 회전 카드 | IMG | 3:4 (컴포넌트 900×1200) | 2순위 |
| `ai-feed-1-1` ~ `ai-feed-4-3` | 계정별 피드 3컷(카드 전환과 함께 교체) | IMG | 2:3 (컴포넌트 900×1350) | 3순위 선택 |

- 번호는 1 = 87언니(P1), 2 = 옆집엄마(P2), 3 = 그레이스의정원(P3), 4 = 쌀만드는아저씨(P4)이고 `creator-roster.ts` 순서와 같습니다.
- 카드 비율 메모: 처음 요청은 4:5였지만 현재 컴포넌트는 3:4입니다. 그래서 3:4로 만들고 얼굴과 상반신을 가운데 4:5 영역 안에 둡니다. 피드는 레이아웃에 따라 3:4나 3:2로 잘릴 수 있으니 인물을 가운데에 여유 있게 둡니다.
- 모든 프롬프트는 해당 CHARACTER 설명 + 장면 + [S-PERSONA]이고, 각 인물의 기준 이미지를 반드시 참조로 올립니다.

#### 카드 (`ai-card-n`) · 같은 구도 4장
- 설명: 어두운 스튜디오에 보라 측광을 둔 상반신 인물 사진입니다. 네 장을 같은 구도와 조명으로 맞춰 카드끼리 통일감을 줍니다.
- 공통 장면 문장
```
Waist-up editorial portrait against a deep charcoal studio backdrop, soft violet rim light from behind, warm soft key light from the front left, the person looks gently into the camera, centered with headroom. Wearing their signature outfit.
```

| 슬롯 | 인물 | 추가 문장 |
|---|---|---|
| `ai-card-1` | 87언니 | `Calm warm smile, one hand lightly near the collar of the cardigan.` |
| `ai-card-2` | 옆집엄마 | `Soft friendly half-smile, holding a warm mug with both hands.` |
| `ai-card-3` | 그레이스의정원 | `Graceful smile, small patterned silk scarf tied at the neck over the trench coat.` |
| `ai-card-4` | 쌀만드는아저씨 | `Gentle smile, navy knit, a woven straw hat held at his chest.` |

#### 피드 (`ai-feed-n-1..3`) · 선택
| 슬롯 | 인물 | 한국어 설명 | 영문 장면 |
|---|---|---|---|
| `ai-feed-1-1` | 87언니 | 아침 화장대, 무상표 병들 사이 손등에 크림을 덜어 보는 장면 | `Morning vanity scene: she dabs a little cream on the back of her hand beside a few unbranded glass bottles, soft window daylight, cream and lavender tones.` |
| `ai-feed-1-2` | 87언니 | 창가 카페에서 소형 카메라로 영상일기 촬영 | `Cafe window seat: she holds a small compact camera at arm's length filming a video diary of herself, latte on the table, warm afternoon light.` |
| `ai-feed-1-3` | 87언니 | 저녁 거리 산책, 가벼운 외출 차림 | `Evening street walk: full-body candid shot strolling on a quiet city sidewalk at golden hour wearing a light beige coat over her cardigan look, warm shop lights.` |
| `ai-feed-2-1` | 옆집엄마 | 작은 신혼집 주방에서 요리 | `Small bright newlywed kitchen: she stirs a pot of soup on the stove, wooden utensils, plants on the windowsill, natural daylight.` |
| `ai-feed-2-2` | 옆집엄마 | 니트 차림으로 소파에서 머그잔 | `Cozy living room: she sits on a linen sofa in a loose oatmeal knit sweater holding a mug, a folded blanket and a stack of books, soft afternoon light.` |
| `ai-feed-2-3` | 옆집엄마 | 주말 창가에서 화분 돌보기 | `Weekend morning by the window: she waters small potted plants and trims a monstera leaf, sheer curtains glowing with daylight.` |
| `ai-feed-3-1` | 그레이스 | 장미 정원 가지치기, 밀짚 바구니 | `Rose garden: she trims roses with garden shears, a woven straw basket of cut flowers on her arm, silk scarf as hair band, soft morning sun.` |
| `ai-feed-3-2` | 그레이스 | 트렌치코트 차림의 돌길 외출 | `Outing day: full-body shot walking on a cobblestone lane between old stone buildings in her trench coat look, relaxed smile.` |
| `ai-feed-3-3` | 그레이스 | 햇살 드는 방에서 차와 책 | `Tea time: she reads a hardcover book at a sunlit table with a porcelain teacup and a small vase of garden roses, reading glasses on.` |
| `ai-feed-4-1` | 쌀아저씨 | 초여름 푸른 논, 밀짚모자 | `Early-summer rice paddy: he stands at the edge of bright green rice fields in a faded denim work shirt and straw hat, mountains in the distance, clear morning light.` |
| `ai-feed-4-2` | 쌀아저씨 | 황금 들판에서 벼 이삭을 든 모습 | `Golden autumn harvest: he holds a bundle of ripe rice stalks and smiles, golden fields behind him, warm late-afternoon light, utility vest.` |
| `ai-feed-4-3` | 쌀아저씨 | 시골집 나무 식탁의 갓 지은 밥 | `Rustic farmhouse kitchen: a steaming bowl of freshly cooked white rice on a worn wooden table, his hands placing chopsticks beside it, his face partly visible and smiling, warm window light.` |

---

---

## 5. 마스터 영상 (Wan 3.0 · 30초)

### 5-0. 읽는 법과 공통 규칙

각 마스터는 같은 순서로 적혀 있습니다. 규격, 참조 묶음, 샷 목록(타임코드), 통합 프롬프트(그대로 붙여넣기), 일관성·루프 메모, 분할안, SLOT MAP입니다.

**만드는 순서**
1. 참조 묶음의 이미지를 번호 순서대로 Wan 3.0 참조 이미지 칸에 올립니다. **1번 이미지는 시작 프레임(Start frame)으로도 넣습니다.** 참조 영상이 있으면 영상 칸에 올립니다.
2. 통합 프롬프트 전체를 붙여넣고 맨 끝에 [M-MASTER] 문장을 붙입니다. 네거티브 입력칸이 있으면 [NEG]를 넣습니다.
3. 길이 30초, 비율과 해상도는 각 마스터 규격대로 설정하고 생성합니다.
4. 결과를 눈으로 확인합니다(얼굴이 바뀌었는지, 샷이 섞였는지). 괜찮으면 `MASTER-<이름>.mp4`로 저장합니다.

**참조 이미지·영상 사용법**
- 한도: 한 번에 참조 이미지 최대 10장, 참조 영상 최대 5개입니다. 아래 묶음은 모두 한도 안입니다.
- 번호: 올린 순서가 번호입니다. 통합 프롬프트의 `Image 3`은 3번째로 올린 이미지, `Video 1`은 첫 참조 영상입니다. 입력칸이 번호 지칭을 지원하지 않으면 번호 문구만 지우고 순서를 그대로 지켜 올립니다.
- 모든 묶음에 나노바나나 프로 2로 만든 이미지(캐릭터 시트나 스타일 프레임)를 1장 이상 넣었습니다. 마스터마다 인물·색감이 어긋나지 않게 하는 기준입니다.
- 캐릭터 일관성(애니메이션): 보리의 정면·측면 시트와 기존 `animation.png`를 같은 묶음에 올리고 프롬프트에 `Bori exactly as in Images 4 to 7`처럼 번호로 적습니다. 장면 이미지 3장(`animation-scene-1~3`)은 세계와 조명 기준입니다. 정면·측면 시트는 원래 3순위 선택 이미지지만 이 마스터 전에 만들어 두기를 권합니다.
- 캐릭터 일관성(AI 인물): 인물마다 얼굴 기준 사진 1장과 나노바나나 카드 이미지 1장을 함께 올리고, 샷마다 그 인물의 이미지 번호를 프롬프트에 적습니다. 한 샷에는 한 사람만 나옵니다. 다른 인물의 얼굴이 섞이면 5-8의 분할안으로 인물별로 따로 만듭니다.
- 참조 영상: 먼저 만든 마스터를 올려 색감·조명·카메라 속도를 맞춥니다. 프롬프트에 `Match the color grade, lighting and camera speed of Video 1, but not its content.` 문장이 이미 들어 있습니다. 파일이 너무 커서 안 올라가면 팀이 10초 720p 샘플을 만들어 드립니다(7장 7번).
- **생성 순서 규칙:** 다른 마스터의 참조 영상이 되는 마스터를 먼저 만듭니다. 이번 순서에서는 `MASTER-HOME-CARDS`(→ AD-A, PERSONAS), `MASTER-AD-A`(→ AD-B), `MASTER-MOTION`(→ HERO)이 해당합니다. 참조 영상으로 쓸 마스터는 얼굴 변형이나 형태 붕괴가 있으면 먼저 다시 만들고, 문제 있는 결과를 참조로 올리지 않습니다.

**타임코드와 컷**
- 모델이 컷 위치를 1~2초 어긋나게 만들 수 있습니다. 팀이 장면 전환 검출로 실제 컷 시각을 확인해 SLOT MAP을 ±1초 보정합니다(7장 2번). SLOT MAP은 컷 앞뒤에 1초 안팎 여유를 두었습니다.
- `ANIMATION`, `HERO`는 컷 없는 한 번의 테이크입니다. 나머지는 하드컷으로 이어진 여러 샷입니다.

**품질이 무너질 때**
- 샷이 서로 번지거나, 컷이 안 나뉘거나, 20초 이후 형태가 흐트러지면 해당 마스터만 각 마스터의 **분할안**대로 나눠 생성합니다. 파일명은 `MASTER-<이름>-A.mp4`, `-B.mp4`입니다. 팀이 B의 타임코드에서 분할안의 시작 시각을 뺍니다.
- 처음부터 쪼개지 말고 먼저 30초로 한 번 시도해 보세요.

---

### 5-1. `MASTER-HOME-CARDS` · 순서 1 · 필수

- 규격: 30초 · 4:3 · 1440×1080 (4:3이 없으면 16:9로 만들고 모든 샷의 피사체를 가운데 4:3 안에 둡니다)
- 만들어지는 슬롯: `home-card-ai-influencer`, `home-card-webtoon`, `home-card-ad` (컨텐츠 홈 3D 캐러셀 카드 6개 중 3개)

**참조 묶음**
- 이미지 (9/10)
  1. `home-card-ai-influencer.png` (나노바나나) 시작 프레임, 샷 A 구도
  2. `[REPO]content-site\ai-influencer\unnie87-face.webp`
  3. `[REPO]content-site\ai-influencer\unnie87-front.webp`
  4. `[REPO]content-site\ai-influencer\unnie87-full.webp`
  5. `_ref_seoyun-sheet.png` (나노바나나 캐릭터 시트, 3-2에서 만든 것)
  6. `[AIO기존]webtoon.png` 웹툰 그림체
  7. `home-card-webtoon.png` (나노바나나) 샷 B 구도
  8. `home-card-ad.png` (나노바나나) 샷 C 구도
  9. `ad-center-1.png` (나노바나나) 향수병 형태
- 영상 (0/5): 없음. 첫 마스터입니다.

**샷 목록**

| 샷 | 타임코드 | 내용 |
|---|---|---|
| A | 0:00 – 0:10 | 87언니 어두운 스튜디오 반신 (시작 프레임 장면 그대로) |
| B | 0:10 – 0:20 | 웹툰 서윤, 노을 옥상, 떠 있는 컷 3개 |
| C | 0:20 – 0:30 | 비스듬히 뜬 무상표 휴대폰, 화면 속 향수 광고 |

**통합 프롬프트**
```
A 30-second video made of three separate calm shots with hard cuts at exactly 10 seconds and 20 seconds, no dissolves or fades. Dark premium art direction in all three: near-black charcoal background, soft violet rim light, warm coral-amber accent light, subtle film grain, no text or logos anywhere. Keep each main subject centered inside the middle 3:4 area of the frame.

[0-10s] Shot A, continues the first frame (Image 1). Waist-up portrait of the same fictional Korean woman as in Images 1 to 4, identical face, hair and cream cardigan outfit, seated at a minimal dark studio set. She turns her head slightly toward the camera, blinks naturally and gives a soft close-lipped smile, a few strands of hair move, then returns to the starting pose by 10 seconds. Very slow push-in. She does not speak.

[10-20s] Shot B, hard cut. Original Korean webtoon key-art style with refined ink linework and soft cel shading in lavender and violet tones, art style of Image 6. Seo-yun from Image 5, a woman in her early twenties with a wind-swept dark brown-black bob, an ivory oversized trench-style jacket and a violet spiral-bound sketchbook, stands on a city rooftop at violet dusk, composition of Image 7. Three floating rectangular comic panels with thin white borders drift slowly at different depths around her (a glowing city skyline, a close-up of an eye, sheets of paper flying), loose sketch pages float across the frame, her hair and jacket flutter softly. Gentle parallax, very slow push-in, her face stays stable, the arrangement settles close to the starting state by 20 seconds.

[20-30s] Shot C, hard cut. Photographed premium CGI, composition of Image 8. A generic logo-free smartphone with thin black bezels floats tilted about 15 degrees against a near-black background and rotates very slowly a few degrees. Its screen shows a vertical ad scene: the unbranded amber glass perfume bottle from Image 9 on an ivory travertine block with a sheer violet fabric flowing gently behind it under warm coral light. A soft light sweep slides across the phone glass. No text or icons on the screen. It ends close to its starting pose.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 샷 A는 시작 프레임과 얼굴 사진 3장으로 87언니를 고정합니다. 얼굴이 바뀌면 다시 만듭니다. 이 결과가 AD-A와 PERSONAS의 참조 영상이 되므로 가장 먼저, 가장 꼼꼼히 확인합니다.
- 샷 B·C는 시작 프레임이 아니라 참조 이미지로만 맞춥니다. 구도가 `home-card-webtoon.png`와 조금 달라도 괜찮습니다. 포스터는 영상 첫 프레임에서 뽑습니다.
- 각 샷이 끝에서 시작 자세로 돌아오게 써 두었습니다. 팀이 끝 1초를 첫 1초에 크로스페이드해 루프를 만듭니다.
- 분할안: 샷별 10초 3개(`-A`, `-B`, `-C`). B의 시작 프레임은 `home-card-webtoon.png`, C는 `home-card-ad.png`. 타임코드는 각각 0, 10, 20초를 뺍니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 (7장) |
|---|---|---|---|
| 0:01 – 0:07 | `home-card-ai-influencer` | `home-card-ai-influencer.mp4` | R2 크로스페이드 루프 · 4:3 960×720 |
| 0:11 – 0:17 | `home-card-webtoon` | `home-card-webtoon.mp4` | R2 · 4:3 960×720 |
| 0:21 – 0:27 | `home-card-ad` | `home-card-ad.mp4` | R2 · 4:3 960×720 |

16:9로 만들었다면 위 규칙 앞에 "가운데 4:3 크롭"을 먼저 적용합니다.

---

### 5-2. `MASTER-ANIMATION` · 순서 2 · 필수

- 규격: 30초 · 16:9 · 1920×1080 · **컷 없는 한 번의 테이크**
- 만들어지는 슬롯: `animation-scene-1`, `animation-scene-2`, `animation-scene-3`, `home-card-animation`

**참조 묶음**
- 이미지 (8/10)
  1. `animation-scene-1.png` (나노바나나) 시작 프레임
  2. `animation-scene-2.png` (나노바나나) 전개 장면 기준
  3. `animation-scene-3.png` (나노바나나) 마무리 장면 기준
  4. `animation-character-front.png` (나노바나나) 보리 정면 시트
  5. `animation-character-side.png` (나노바나나) 보리 측면 시트
  6. `[AIO기존]animation.png` 기존 보리 이미지
  7. `[REPO]content-examples\animation\animation-character.webp` 기존 AIO 캐릭터
  8. `home-card-animation.png` (나노바나나) 카드 구도
- 영상 (0/5): 없음.

**샷 목록 (이어지는 세 박자)**

| 박자 | 타임코드 | 내용 |
|---|---|---|
| 1 | 0:00 – 0:10 | 아침, 계단 위의 보리가 리본 상자를 발견하고 한 계단 뛰어 내려감 |
| 2 | 0:10 – 0:20 | 상자가 열리고 빛 구슬이 아치 사이로 날아감, 보리가 손을 뻗음 |
| 3 | 0:20 – 0:30 | 구슬이 받침대에 앉고 세계가 환해짐, 보리가 손 흔들고 카메라가 물러나 정지 |

**통합 프롬프트**
```
One continuous 30-second take in a premium stylized 3D animated world, no cuts and no scene changes, a single unbroken story in three beats. The same original character throughout: Bori exactly as in Images 4 to 7, a glossy soft lilac bean-shaped creature with one rounded body, two large round white eyes with glossy black pupils, a small curved smile, short stubby arms, two short cylindrical legs, no ears or clothing. The world, materials and warm golden light with soft violet shadows match Images 1 to 3: cream stone walls with round windows, a large coral-red arch, lavender stairs, a mirror-chrome sphere, a pale yellow sun disk, a shallow calm pool.

[0-10s] Early morning, continues the first frame (Image 1). Bori stands at the top of the lavender stairs, leans forward curiously toward a small ivory gift box tied with a violet ribbon on the step below, tilts its body, blinks twice and hops down one step toward the box. The camera pushes in slowly and lowers slightly. Morning light flickers softly on the pool.

[10-20s] The box lid pops open (Image 2) and a glowing warm amber orb of light floats up out of it, then drifts slowly to the right through the coral arch, leaving a faint sparkle trail. Bori reaches both stubby arms up with an excited face, follows the orb with its eyes and takes two small steps forward, the orb's light painting warm highlights on its glossy lilac body. The camera tilts up gently to follow the orb.

[20-30s] The orb settles onto a round lavender pedestal beside the shallow pool (Image 3). A soft wave of warm light ripples outward across the cream walls, the arch and the pool, and the whole world becomes brighter and golden. Bori stands next to the orb facing the camera, waves happily and bounces once, then settles. The camera pulls back slowly and ends on a calm, still wide frame.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 한 테이크이므로 보리의 몸 색, 눈 크기, 세계 구성이 30초 내내 같아야 합니다. 보리가 변하면 5-0의 분할안을 씁니다.
- 슬롯 3개는 루프가 아닙니다. 장면 3은 끝 정지를 그대로 둡니다. `home-card-animation`만 왕복(boomerang) 루프입니다.
- 분할안: 박자 1~2(20초, 시작 프레임 `animation-scene-1.png`)와 박자 3(10초, 시작 프레임 `animation-scene-3.png`). B의 타임코드는 20초를 뺍니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:01 – 0:06 | `animation-scene-1` | `animation-scene-1.mp4` | R1 · 16:9 1280×720 |
| 0:12 – 0:17 | `animation-scene-2` | `animation-scene-2.mp4` | R1 |
| 0:25 – 0:30 | `animation-scene-3` | `animation-scene-3.mp4` | R1 (끝 정지, 마지막 프레임 유지) |
| 0:24 – 0:29 | `home-card-animation` | `home-card-animation.mp4` | R3 왕복 루프 · 가운데 4:3 크롭 · 960×720 |

---

### 5-3. `MASTER-BRANDFILM` · 순서 3 · 필수

- 규격: 30초 · 16:9 · 1920×1080 · 하드컷 3번(8초, 16초, 23초)
- 만들어지는 슬롯: `brandfilm-main-1`, `brandfilm-main-2`, `brandfilm-main-3`, `home-card-brand-film` (그리고 팀이 만드는 15초 합본 `brandfilm-main.mp4`)

**참조 묶음**
- 이미지 (6/10)
  1. `brandfilm-main-1.png` (나노바나나) 시작 프레임, 새벽 전경
  2. `brandfilm-main-2.png` (나노바나나) 공방 내부
  3. `brandfilm-main-3.png` (나노바나나) 마무리 컵
  4. `home-card-brand-film.png` (나노바나나) 물레 클로즈업
  5. `[AIO기존]brand.png` 기존 브랜드 이미지
  6. `[REPO]renewal\brand-film-v03.webp` 기존 AIO 브랜드 이미지
- 영상 (1/5)
  - Video 1: `[REPO]content-examples\brand-film\brandfilm-motion.mp4` (기존 AIO 브랜드 모션, 카메라 속도와 톤만 참고)

**샷 목록**

| 샷 | 타임코드 | 내용 |
|---|---|---|
| A | 0:00 – 0:08 | 푸른 새벽, 안개 낀 언덕 위 콘크리트·유리 공방 전경 |
| B | 0:08 – 0:16 | 공방 내부, 물레 앞 장인과 뒤쪽 유약 작업 |
| C | 0:16 – 0:23 | 물레 위에서 컵을 빚는 손 클로즈업 |
| D | 0:23 – 0:30 | 김 오르는 완성 컵, 보라 천, 둥근 창의 코랄 햇빛 |

**통합 프롬프트**
```
A 30-second brand film for a fictional small pottery studio, four separate cinematic shots joined by hard cuts at exactly 8, 16 and 23 seconds, no dissolves. Consistent look: blue-hour and warm amber light, soft violet rim light, near-black charcoal shadows, ivory and clay tones, fine film grain, calm premium documentary feel, matching Images 5 and 6. Match the color grade, lighting and camera speed of Video 1, but not its content. No text, no logos, no faces in focus.

[0-8s] Shot A, continues the first frame (Image 1). Wide establishing shot at blue hour: a minimalist concrete-and-glass craft studio building on a misty hillside among dark pine trees, warm amber light from its tall windows, a thin band of violet sky above the ridge. Slow aerial push toward the building, fog drifts gently across the hillside, one more window light turns on softly, trees sway very slightly.

[8-16s] Shot B, hard cut, look of Image 2. Interior of the craft studio: in the foreground an artisan in a linen apron shapes a pale clay cup on a pottery wheel, seen from the side with the face turned away; in the soft-focus background a second artisan lifts an ivory cup to inspect it at a wooden table; shelves of unbranded ceramics, warm window light with a violet rim light, floating dust. Slow lateral dolly from left to right, the wheel spins and the clay rises under the hands.

[16-23s] Shot C, hard cut, look of Image 4. Cinematic close shot of the artisan's hands shaping a small pale clay cup on a spinning pottery wheel inside a dim minimalist studio, warm amber window light from the side, soft violet rim light outlining the hands and clay, wet clay glistening, dust floating in the light. The wheel spins steadily, the cup wall rises slowly, very slow dolly-in. Face not visible.

[23-30s] Shot D, hard cut, look of Image 3. Closing still life: a finished handmade ivory ceramic cup with steam rising on a sculptural ivory travertine block in the right two-thirds of the frame, a sheer violet fabric floating behind it, warm coral sunlight falling through a circular aperture, deep lavender shadows; the left third stays dark and quiet. Steam rises and curls slowly, the fabric drifts gently, the light patch slides a little, a very slow push-in that ends in a still hold.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 장인 두 명의 얼굴은 보이지 않게 잡습니다. 샷 사이의 같은 인물 일관성이 필요 없는 구성입니다.
- 샷 D는 끝 정지로 끝납니다. `home-card-brand-film`은 샷 C의 한 구간을 크로스페이드 루프로 씁니다.
- 분할안: 샷 A~B(16초, 시작 프레임 `brandfilm-main-1.png`)와 샷 C~D(14초, 시작 프레임 `home-card-brand-film.png`). B의 타임코드는 16초를 뺍니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:01 – 0:06 | `brandfilm-main-1` | `brandfilm-main-1.mp4` | R1 · 16:9 1280×720 |
| 0:09 – 0:14 | `brandfilm-main-2` | `brandfilm-main-2.mp4` | R1 |
| 0:25 – 0:30 | `brandfilm-main-3` | `brandfilm-main-3.mp4` | R1 (끝 정지) |
| 0:17 – 0:22 | `home-card-brand-film` | `home-card-brand-film.mp4` | R2 · 가운데 4:3 크롭 · 960×720 |
| 위 세 슬롯 연결 | `brandfilm-main` (15초) | `brandfilm-main.mp4` | R4 합본 (0.5초 크로스페이드) |

---

### 5-4. `MASTER-AD-A` · 순서 4 · 필수 (ad-center-1)

- 규격: 30초 · 9:16 · 1080×1920 · 하드컷 4번(6, 12, 18, 24초), 샷마다 다른 업종 6초
- 만들어지는 슬롯: `ad-center-1` (필수), `ad-rail-1` ~ `ad-rail-4` (선택 슬롯이지만 이 마스터에서 함께 나옵니다)

**참조 묶음**
- 이미지 (7/10)
  1. `ad-center-1.png` (나노바나나) 시작 프레임, 향수병
  2. `ad-rail-1.png` (나노바나나) 립스틱
  3. `ad-rail-2.png` (나노바나나) 떡볶이
  4. `ad-rail-3.png` (나노바나나) 스니커즈
  5. `ad-rail-4.png` (나노바나나) 앱 화면과 손
  6. `home-card-ad.png` (나노바나나) 향수 광고 톤
  7. `[REPO]content-examples\ad\ad-product.webp` 기존 AIO 제품 장면
- 영상 (1/5)
  - Video 1: `MASTER-HOME-CARDS.mp4` (샷 C 구간 0:20–0:30의 향수 광고 색감·조명)

**샷 목록**

| 샷 | 타임코드 | 내용 |
|---|---|---|
| A | 0:00 – 0:06 | 향수병 + 보라 천 (ad-center-1) |
| B | 0:06 – 0:12 | 립스틱과 장미 꽃잎 (ad-rail-1) |
| C | 0:12 – 0:18 | 김 오르는 떡볶이 (ad-rail-2) |
| D | 0:18 – 0:24 | 공중에 뜬 스니커즈와 스카프 (ad-rail-3) |
| E | 0:24 – 0:30 | 손에 든 휴대폰, 추상 카드 UI (ad-rail-4) |

**통합 프롬프트**
```
A 30-second vertical 9:16 product-ad reel made of five separate shots joined by hard cuts at exactly 6, 12, 18 and 24 seconds, no dissolves. Each shot shows a different unbranded product in the same premium dark-themed art direction: near-black charcoal background, soft violet rim light, warm coral-amber accent light, glossy reflections, subtle film grain. Match the color grade, lighting and camera speed of Video 1, but not its content. No text, logos or brand marks anywhere; the top quarter and bottom fifth of every frame stay calm and simple.

[0-6s] Shot A, continues the first frame (Image 1). An unbranded amber glass perfume bottle with a blank ivory label and a brushed silver cap stands on an ivory travertine block, warm coral light through a circular aperture. A sheer violet fabric sweeps slowly across the frame and settles behind the bottle, a light glint travels down the bottle edge, tiny dust particles sparkle in the coral light, very slow push-in.

[6-12s] Shot B, hard cut, product as in Image 2. An unbranded glossy rose-red lipstick bullet in a plain silver case stands on a dark mirror surface with scattered rose petals, violet rim light. Petals fall slowly past the lipstick, a light glint slides over the bullet, slow orbit of about 10 degrees.

[12-18s] Shot C, hard cut, look of Image 3. A shallow black pan of glossy Korean rice-cake tteokbokki with fish cake and a boiled egg, sesame sprinkled, on a dark wooden table, warm amber key light with a violet rim. Steam rises and curls, the sauce bubbles gently, very slow push-in.

[18-24s] Shot D, hard cut, look of Image 4. A pair of unbranded white leather sneakers floating mid-air at playful angles with a lavender silk scarf looping around them, dark studio, violet rim light. The sneakers rotate slowly in the air, the scarf ripples and loops, a gentle floating bob.

[24-30s] Shot E, hard cut, look of Image 5. A hand holding a generic logo-free smartphone, its screen showing abstract colorful rounded cards and soft gradient shapes with no text or icons, glowing violet light spilling from the screen onto the hand, dark background. The cards on the screen slide up smoothly one after another, the hand moves very slightly, the screen glow pulses softly.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 샷마다 제품이 달라야 합니다. 제품이 다음 샷으로 번지면 분할안을 씁니다.
- 광고 장면은 한 번 지나가는 동작이라 루프가 아니라 왕복(boomerang)으로 만듭니다.
- 분할안: 샷 A~C(18초, 시작 프레임 `ad-center-1.png`)와 샷 D~E(12초, 시작 프레임 `ad-rail-3.png`). B의 타임코드는 18초를 뺍니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:00 – 0:05 | `ad-center-1` | `ad-center-1.mp4` | R3 왕복 루프 · 9:16 720×1280 |
| 0:07 – 0:11 | `ad-rail-1` | `ad-rail-1.mp4` | R3 · 9:16 |
| 0:13 – 0:17 | `ad-rail-2` | `ad-rail-2.mp4` | R3 · 9:16 |
| 0:19 – 0:23 | `ad-rail-3` | `ad-rail-3.mp4` | R3 · 9:16 |
| 0:25 – 0:29 | `ad-rail-4` | `ad-rail-4.mp4` | R3 · 9:16 |

---

### 5-5. `MASTER-MOTION` · 순서 5 · 필수

- 규격: 30초 · 16:9 · 1920×1080 · 하드컷 2번(10초, 20초), 샷마다 반복되는 움직임
- 만들어지는 슬롯: `motion-bg-1`, `motion-bg-2`, `home-card-motion-graphics`
- 이 마스터는 `MASTER-HERO`의 참조 영상이 됩니다. HERO보다 먼저 만듭니다.

**참조 묶음**
- 이미지 (6/10)
  1. `motion-bg-1.png` (나노바나나) 시작 프레임
  2. `motion-bg-2.png` (나노바나나) 리본 배경 기준
  3. `home-card-motion-graphics.png` (나노바나나) 카드 구도 기준
  4. `[REPO]content-examples\motion-graphics\motion-ribbon.webp` 기존 AIO 모션그래픽
  5. `[REPO]renewal\hero.webp` 기존 AIO 홈 히어로 (같은 유리 세계)
  6. `home-hero-reel.png` (나노바나나) 히어로 장면 (색감 일치용)
- 영상 (1/5)
  - Video 1: `[REPO]content-examples\brand-film\brandfilm-motion.mp4` (유리 리본이 움직이는 질감과 속도)

**샷 목록**

| 샷 | 타임코드 | 내용 |
|---|---|---|
| A | 0:00 – 0:10 | 가장자리에 흩어진 도형이 천천히 도는 배경 (가운데 비움) |
| B | 0:10 – 0:20 | 화면 아래쪽에서 물결치는 보라 유리 리본 두 가닥 |
| C | 0:20 – 0:30 | 가운데 4:3 안에 균형 있게 모인 도형 구성 (카드용) |

**통합 프롬프트**
```
A 30-second abstract motion-graphics reel made of three separate loop-friendly shots with hard cuts at exactly 10 and 20 seconds, no dissolves. Near-black background, clean premium 3D render, materials and colors as in Images 4 to 6: violet glass, matte ivory, flat coral, mirror chrome, soft violet rim light, fine film grain. Match the color grade, lighting and camera speed of Video 1, but not its content. No text or letters.

[0-10s] Shot A, continues the first frame (Image 1). A violet glass ring, a matte ivory sphere, a flat coral disc, a mirror-chrome capsule and a small lavender cube float near the edges and corners at different depths, connected by thin glowing violet guide lines and dotted arcs; the center of the frame stays dark and empty. All shapes rotate slowly on their own axes and travel along small elliptical orbits at different speeds, guide lines draw on and fade in a calm rhythm, locked-off camera. By 10 seconds the arrangement is close to the starting arrangement.

[10-20s] Shot B, hard cut, look of Image 2. Two translucent violet glass ribbons flow in long horizontal waves across the lower third of a near-black frame, a few fine glowing light threads run parallel to them, tiny coral and ivory light specks float in the dark upper area. The ribbons undulate slowly like silk underwater, light glints travel along their edges from left to right, locked-off camera. By 20 seconds the ribbon shape is close to its starting shape.

[20-30s] Shot C, hard cut, composition of Image 3. A balanced arrangement kept entirely inside the central 4:3 area of the frame: a violet glass torus, a matte ivory sphere, a flat coral disc, a mirror-chrome capsule and a small lavender cube at different depths, connected by thin glowing violet lines and dotted arcs like a motion-design layout grid. Each shape rotates slowly on its own axis and drifts along a small circular orbit, the lines draw on and fade rhythmically, the camera almost locked with a tiny slow push-in. By 30 seconds the arrangement is close to the starting arrangement.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 샷 안의 움직임이 처음 상태로 돌아오게 써 두었습니다. 팀이 끝 1초를 첫 1초에 크로스페이드해 이음새 없는 루프로 만듭니다.
- 샷 A의 가운데는 글자가 얹히는 자리라 비워 둡니다. 샷 C만 가운데 모음 구성입니다.
- 분할안: 샷별 10초 3개. B의 시작 프레임은 `motion-bg-2.png`, C는 `home-card-motion-graphics.png`. 타임코드는 각각 0, 10, 20초를 뺍니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:00 – 0:09 | `motion-bg-1` | `motion-bg-1.mp4` | R2 크로스페이드 루프 · 16:9 1280×720 |
| 0:11 – 0:19 | `motion-bg-2` | `motion-bg-2.mp4` | R2 · 16:9 |
| 0:21 – 0:29 | `home-card-motion-graphics` | `home-card-motion-graphics.mp4` | R2 · 가운데 4:3 크롭 · 960×720 |

---

### 5-6. `MASTER-HERO` · 순서 6 · 필수

- 규격: 30초 · 16:9 · 1920×1080 · **컷 없는 한 번의 테이크**
- 만들어지는 슬롯: `home-hero-reel` (데스크톱), `home-hero-reel-mobile` (같은 영상을 가운데 세로로 크롭)
- 먼저 `MASTER-MOTION`을 만들어 참조 영상으로 올립니다.

**참조 묶음**
- 이미지 (4/10)
  1. `home-hero-reel.png` (나노바나나) 시작 프레임 (끝 프레임 입력이 있으면 같은 이미지)
  2. `[AIO기존]hero.png` 기존 AIO 히어로
  3. `[REPO]content-examples\motion-graphics\motion-ribbon.webp`
  4. `motion-bg-2.png` (나노바나나)
- 영상 (2/5)
  - Video 1: `MASTER-MOTION.mp4` (5-5, 리본 질감과 속도)
  - Video 2: `[REPO]content-examples\brand-film\brandfilm-motion.mp4`

**통합 프롬프트**
```
One continuous 30-second take, no cuts. The scene continues the first frame (Image 1) in the world of Images 2 to 4: a sculptural translucent violet glass ribbon arching over a dark reflective satin stage, three matte ivory spheres of different sizes and one small clear glass sphere beside dark volcanic rocks, an iridescent transparent film strip curling around them, delicate coral-pink branch sprigs, a faint warm coral glow behind. Keep the whole arrangement compact inside the right-center of the frame, roughly between 45 and 85 percent of the frame width, so a tall center crop still shows it; the left half and the top third stay dark, empty and quiet. The camera is almost still: a barely perceptible push-in over the first 15 seconds and back to the starting framing over the last 15 seconds. The glass ribbon gently undulates like silk in slow motion, small light glints travel along its edge, the film strip turns slightly, tiny particles of light drift upward, reflections on the floor shimmer softly. The final frame returns close to the first frame. Match the color grade, lighting and camera speed of Video 1 and Video 2, but not their content.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 피사체를 오른쪽 가운데에 모으라고 써 둔 이유는 모바일 세로 크롭(가운데 31%)에도 리본과 구가 남게 하기 위해서입니다. 모바일은 크롭 방식이 가능합니다. 단 위쪽 1/3을 어둡게 비우는 모바일 전용 구도는 보장되지 않으므로 사이트가 그라데이션을 얹습니다.
- 모바일이 거칠거나 구도가 안 맞으면 `home-hero-reel-mobile.png`를 시작 프레임으로 9:16 15초 1개를 따로 만듭니다(`MASTER-HERO-MOBILE`). 먼저 크롭본을 보고 판단합니다.
- 분할안: 해당 없음. 문제가 생기면 15초 1개로 줄입니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:02 – 0:14 | `home-hero-reel` | `home-hero-reel.mp4` | R2 크로스페이드 루프 · 16:9 1280×720 (화질 우선이면 1920×1080) |
| 0:02 – 0:14 | `home-hero-reel-mobile` | `home-hero-reel-mobile.mp4` | R2 + 9:16 크롭(왼쪽 기준 70% 위치) · 720×1280 |

---

### 5-7. `MASTER-AD-B` · 순서 7 · 선택

- 규격: 30초 · 9:16 · 1080×1920 · 하드컷 4번(6, 12, 18, 24초)
- 만들어지는 슬롯: `ad-rail-5` ~ `ad-rail-9` (영상 선택). 이미지가 이미 충분히 움직여 보이므로 여유가 있을 때 만듭니다.

**참조 묶음**
- 이미지 (6/10)
  1. `ad-rail-5.png` (나노바나나) 시작 프레임, 카페 라테
  2. `ad-rail-6.png` (나노바나나) 체육관
  3. `ad-rail-7.png` (나노바나나) 스킨케어 크림
  4. `ad-rail-8.png` (나노바나나) 딸기 케이크
  5. `ad-rail-9.png` (나노바나나) 향초와 디퓨저
  6. `ad-center-1.png` (나노바나나) 광고 톤 기준
- 영상 (1/5)
  - Video 1: `MASTER-AD-A.mp4` (색감과 카메라 속도)

**샷 목록**

| 샷 | 타임코드 | 내용 |
|---|---|---|
| A | 0:00 – 0:06 | 카페 라테아트와 아침 햇살 (ad-rail-5) |
| B | 0:06 – 0:12 | 어두운 체육관 케틀벨 스쿼트 (ad-rail-6) |
| C | 0:12 – 0:18 | 뚜껑 열린 크림 단지와 물방울 (ad-rail-7) |
| D | 0:18 – 0:24 | 딸기 케이크 한 조각과 떨어지는 딸기 (ad-rail-8) |
| E | 0:24 – 0:30 | 향초와 디퓨저, 리넨 위 (ad-rail-9) |

**통합 프롬프트**
```
A 30-second vertical 9:16 ad reel made of five separate shots joined by hard cuts at exactly 6, 12, 18 and 24 seconds, no dissolves. Each shot shows a different unbranded subject in the same premium dark-themed art direction: near-black charcoal background, soft violet rim light, warm amber accent light, subtle film grain. Match the color grade, lighting and camera speed of Video 1, but not its content. No text, logos or brand marks anywhere; the top quarter and bottom fifth of every frame stay calm and simple.

[0-6s] Shot A, continues the first frame (Image 1). A ceramic cup of latte with leaf latte art on a dark wooden counter, a morning sunlight beam through a window, blurred cafe interior with warm bulbs, violet shadows. Steam swirls upward, the sunlight beam shimmers with dust, slow push-in.

[6-12s] Shot B, hard cut, look of Image 2. An athletic adult woman in plain dark sportswear mid-squat holding a matte kettlebell in a dim gym, strong violet rim light outlining her silhouette, warm key light, face partly in shadow, no logos. She rises slowly from the squat and lowers again in one controlled repetition, chalk dust drifts in the light.

[12-18s] Shot C, hard cut, look of Image 3. An open unbranded frosted glass cream jar with a smooth swirl of white cream, water droplets on the glass, an ivory travertine base, violet reflections, soft coral light. A drop of water slides down the jar, a light glint moves across the cream swirl, slow orbit.

[18-24s] Shot D, hard cut, look of Image 4. A slice of layered strawberry cream cake on a dark ceramic plate, fresh strawberries with a few falling in mid-air, powdered sugar dust, warm amber key light with a violet rim. Strawberries fall slowly, powdered sugar drifts down, very slow push-in.

[24-30s] Shot E, hard cut, look of Image 5. An unbranded amber glass candle with a lit flame next to a reed diffuser on folded linen, a dim cozy room with a warm window glow, violet shadows. The candle flame flickers gently, a thin wisp of smoke curls up, soft light breathes on the linen.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 사람이 나오는 샷은 B 하나이고 얼굴이 중요하지 않습니다. 샷 사이 일관성은 색감과 조명만 맞으면 됩니다.
- 분할안: 샷 A~C(18초)와 샷 D~E(12초, 시작 프레임 `ad-rail-8.png`). B의 타임코드는 18초를 뺍니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:00 – 0:04 | `ad-rail-5` | `ad-rail-5.mp4` | R3 왕복 루프 · 9:16 720×1280 |
| 0:07 – 0:11 | `ad-rail-6` | `ad-rail-6.mp4` | R3 |
| 0:13 – 0:17 | `ad-rail-7` | `ad-rail-7.mp4` | R3 |
| 0:19 – 0:23 | `ad-rail-8` | `ad-rail-8.mp4` | R3 |
| 0:25 – 0:29 | `ad-rail-9` | `ad-rail-9.mp4` | R3 |

---

### 5-8. `MASTER-PERSONAS` · 순서 8 · 선택 (AI 가상인물 4명)

- 규격: 30초 · 3:4 · 1080×1440 (3:4가 없으면 9:16으로 만들고 인물을 가운데 3:4 안에 둡니다) · 하드컷 3번(7, 15, 22초), 샷마다 1명
- 만들어지는 슬롯: `ai-card-1` ~ `ai-card-4`의 **영상**. 현재 이 슬롯들은 이미지 전용이므로 구현 쪽에서 영상 슬롯을 신설해야 합니다. 구현 합의 전에는 만들지 않아도 됩니다.
- 표기: 공개 화면에서 'AI 가상인물' 표기를 붙입니다.

**참조 묶음**
- 이미지 (8/10)
  1. `ai-card-1.png` (나노바나나) 시작 프레임, 87언니
  2. `ai-card-2.png` (나노바나나) 옆집엄마
  3. `ai-card-3.png` (나노바나나) 그레이스의정원
  4. `ai-card-4.png` (나노바나나) 쌀만드는아저씨
  5. `[REPO]content-site\ai-influencer\unnie87-face.webp`
  6. `[REPO]content-site\ai-influencer\yeopjip-portrait.webp`
  7. `[REPO]content-site\ai-influencer\grace-portrait.webp`
  8. `[REPO]content-site\ai-influencer\ssal-portrait.webp`
- 영상 (1/5)
  - Video 1: `MASTER-HOME-CARDS.mp4` (샷 A 0:00–0:10의 87언니 움직임과 톤)

**샷 목록**

| 샷 | 타임코드 | 인물 | 참조 이미지 |
|---|---|---|---|
| A | 0:00 – 0:07 | 87언니 | 1, 5 |
| B | 0:07 – 0:15 | 옆집엄마 | 2, 6 |
| C | 0:15 – 0:22 | 그레이스의정원 | 3, 7 |
| D | 0:22 – 0:30 | 쌀만드는아저씨 | 4, 8 |

**통합 프롬프트**
```
A 30-second 3:4 video of four different fictional adult Korean AI virtual persons, one per shot, with hard cuts at exactly 7, 15 and 22 seconds, no dissolves. Every shot is a waist-up editorial portrait against a deep charcoal studio backdrop, soft violet rim light from behind, warm soft key light from the front left, the person looking gently into the camera, centered with headroom inside the middle 3:4 area, natural skin texture, light film grain. Each person must look exactly like their own reference images (same face, hair and outfit) and must never resemble the other people. Match the tone and head motion style of Video 1, but not its content.

[0-7s] Shot A, continues the first frame (Image 1). Person 1, the woman in Images 1 and 5: late thirties, shoulder-length soft brown hair with wispy bangs, cream chunky-knit cardigan over a white collared shirt, pearl earrings. Calm warm smile, one hand lightly near the collar. She turns her head slightly toward the camera, blinks, a few strands of hair move, very slow push-in. She does not speak.

[7-15s] Shot B, hard cut. Person 2, the woman in Images 2 and 6: early thirties, long wavy dark chestnut hair with a center part, soft beige knit, thin gold hoop earrings. Soft friendly half-smile, holding a warm mug with both hands. Steam rises from the mug, she blinks and tilts her head slightly.

[15-22s] Shot C, hard cut. Person 3, the woman in Images 3 and 7: early sixties, chin-length silver-gray bob, beige trench coat over a navy knit, a small patterned silk scarf at the neck. Graceful smile, she lifts her chin slightly and blinks, the scarf moves gently.

[22-30s] Shot D, hard cut. Person 4, the man in Images 4 and 8: early sixties, short salt-and-pepper hair brushed up and back, navy crew-neck knit, a woven straw hat held at his chest. Gentle closed-mouth smile, he nods very slightly and blinks.
```
(맨 끝에 [M-MASTER])

**일관성·루프 메모**
- 샷 A만 시작 프레임으로 얼굴이 고정됩니다. B~D는 참조 이미지(카드 PNG와 얼굴 사진)로 맞춥니다. 얼굴이 섞이거나 닮지 않으면 분할안을 씁니다.
- 분할안: 인물별 7~8초 4개(`-A` ~ `-D`). 각 시작 프레임은 해당 인물의 `ai-card-n.png`, 참조 이미지는 그 인물의 카드 PNG와 얼굴 사진 2장씩. 타임코드는 0, 7, 15, 22초를 뺍니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:01 – 0:06 | `ai-card-1` (영상) | `ai-card-1.mp4` | R2 크로스페이드 루프 · 3:4 720×960 |
| 0:08 – 0:14 | `ai-card-2` (영상) | `ai-card-2.mp4` | R2 |
| 0:16 – 0:21 | `ai-card-3` (영상) | `ai-card-3.mp4` | R2 |
| 0:23 – 0:29 | `ai-card-4` (영상) | `ai-card-4.mp4` | R2 |

---

## 6. 전체 소재 목록과 개수

### 6-1. 이미지 (나노바나나 프로 2) · 59장 · v1과 같음

| 순위 | 슬롯 | 이미지 |
|---|---|---|
| 1순위 필수 | `home-card-webtoon` · `home-card-animation` · `home-card-ai-influencer` · `home-card-motion-graphics` · `home-card-brand-film` · `home-card-ad` | 6 |
| 1순위 필수 | `ad-center-1` | 1 |
| 1순위 필수 | `ad-rail-1` ~ `ad-rail-9` | 9 |
| 1순위 필수 | `animation-scene-1` ~ `animation-scene-3` | 3 |
| 1순위 필수 | `brandfilm-main-1` ~ `brandfilm-main-3` | 3 |
| 2순위 필수 | `home-hero-reel` · `home-hero-reel-mobile` | 2 |
| 2순위 필수 | `motion-bg-1` · `motion-bg-2` | 2 |
| 2순위 필수 | `ai-card-1` ~ `ai-card-4` | 4 |
| 2순위 필수 | `webtoon-cut-1` ~ `webtoon-cut-12` | 12 |
| 3순위 선택 | `ai-feed-1-1` ~ `ai-feed-4-3` | 12 |
| 3순위 선택 | `animation-character-front` · `animation-character-side` | 2 |
| 3순위 선택 | `ad-hook-1` ~ `ad-hook-3` | 3 |
| **합계** | | **59** (필수 42 · 선택 17) |

- 마스터의 시작 프레임과 참조 묶음에 쓰는 이미지는 모두 위 59장 안에 있습니다. 새로 만들 이미지는 없습니다. 참고용 `_ref_` 캐릭터 시트(서윤·도현)는 개수에 넣지 않았습니다.
- `animation-character-front/side`는 3순위 선택이지만 `MASTER-ANIMATION`의 캐릭터 일관성에 효과가 커서 2번째 마스터 전에 만들기를 권합니다.

### 6-2. 마스터 영상 (Wan 3.0) · 8개

| 구분 | 마스터 | 개수 |
|---|---|---|
| 필수 | HOME-CARDS · ANIMATION · BRANDFILM · AD-A · MOTION · HERO | 6 |
| 선택 | AD-B · PERSONAS | 2 |
| **합계** | | **8** (생성 시간 30초 × 8) |

### 6-3. 슬롯 영상 (팀이 마스터에서 편집) · 30개

| 마스터 | 슬롯 영상 | 필수 | 선택 |
|---|---|---|---|
| HOME-CARDS | home-card-ai-influencer, -webtoon, -ad | 3 | 0 |
| ANIMATION | animation-scene-1, -2, -3, home-card-animation | 4 | 0 |
| BRANDFILM | brandfilm-main-1, -2, -3, home-card-brand-film | 4 | 0 |
| AD-A | ad-center-1 / ad-rail-1 ~ 4 | 1 | 4 |
| MOTION | motion-bg-1, -2, home-card-motion-graphics | 3 | 0 |
| HERO | home-hero-reel, home-hero-reel-mobile | 2 | 0 |
| AD-B | ad-rail-5 ~ 9 | 0 | 5 |
| PERSONAS | ai-card-1 ~ 4 (영상 슬롯 신설) | 0 | 4 |
| **합계** | | **17** | **13** |

- v1의 슬롯 영상 26개(필수 17 · 선택 9)는 모두 그대로 채워지고, AI 인물 카드 영상 4개가 선택으로 더해졌습니다.
- 팀이 만드는 15초 합본 `brandfilm-main.mp4`(기존 슬롯)는 개수에 넣지 않았습니다.

---

## 7. 편집 담당 처리 방법 (ffmpeg)

대상: 사용자가 `MASTER-<이름>.mp4`를 인박스에 넣은 뒤 팀이 슬롯 영상 30개와 포스터를 만드는 작업입니다. 아래 명령은 PowerShell 기준입니다.

### 7-0. 도구 확인과 설치
- 이 PC에서 확인한 결과(2026-10-14): `where ffmpeg` → `C:\Users\PC\AppData\Local\Microsoft\WinGet\Links\ffmpeg.exe`, `ffmpeg -version` → 9.0.2 (gyan.dev full build), `where ffprobe` → 같은 폴더에 있음. 바로 쓸 수 있습니다.
- 다른 PC에서 확인: `where ffmpeg` 와 `ffmpeg -version`.
- 없으면 설치(이 문서 작업에서는 실행하지 않았습니다): `winget install --id Gyan.FFmpeg -e` 후 새 터미널을 열어 다시 `ffmpeg -version`을 확인합니다.

### 7-1. 공통 변수
```powershell
$IN  = 'I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트\_소재_인박스_R5'
$OUT = "$IN\_편집결과"
New-Item -ItemType Directory -Force $OUT | Out-Null
# 웹용 H.264 인코딩 옵션: 약 1.6Mbps 상한 = 5초당 1MB 안팎, 무음, 빠른 시작
$ENC = @('-c:v','libx264','-preset','slow','-crf','26','-maxrate','1.6M','-bufsize','3.2M','-pix_fmt','yuv420p','-an','-movflags','+faststart')
```
출력 크기 기준: 16:9 1280×720 · 4:3 960×720 · 9:16 720×1280 · 3:4 720×960. 용량이 5초당 1.3MB를 넘으면 `-crf`를 28~30으로 올립니다.

### 7-2. 컷 위치 확인
컷이 있는 마스터(HOME-CARDS, BRANDFILM, AD-A, AD-B, MOTION, PERSONAS)는 SLOT MAP을 쓰기 전에 실제 컷 시각을 확인하고, 어긋났으면 SLOT MAP 구간을 컷 기준으로 ±1초 옮깁니다.
```powershell
ffmpeg -hide_banner -i "$IN\MASTER-BRANDFILM.mp4" -vf "select='gt(scene,0.25)',showinfo" -an -f null - 2>&1 | Select-String 'pts_time:[0-9.]+'
```
도형 위주 마스터(MOTION)는 오탐이 많으니 `0.25`를 `0.4`로 올립니다. 길이 확인: `ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN\MASTER-X.mp4"`

### 7-3. 레시피 (SLOT MAP의 R1 ~ R4)

아래 예시의 `-ss`(시작 초), `-t`(구간 길이), 입력 파일, 출력 파일명만 SLOT MAP 값으로 바꿉니다.

**R1 · 일반 컷 (루프 없음)** 예: `animation-scene-1` (0:01 – 0:06)
```powershell
ffmpeg -y -ss 1 -t 5 -i "$IN\MASTER-ANIMATION.mp4" -vf "scale=1280:720:flags=lanczos" @ENC "$OUT\animation-scene-1.mp4"
```

**R2 · 이음새 없는 루프 (끝 1초를 첫 1초에 크로스페이드)** 예: `home-card-ai-influencer` (0:01 – 0:07, 구간 6초, 이미 4:3)
```powershell
ffmpeg -y -ss 1 -t 6 -i "$IN\MASTER-HOME-CARDS.mp4" -filter_complex "[0:v]scale=960:720:flags=lanczos,split[a][b];[a]trim=start=1,setpts=PTS-STARTPTS[body];[b]trim=end=1,setpts=PTS-STARTPTS[head];[body][head]xfade=transition=fade:duration=1:offset=4,format=yuv420p[v]" -map "[v]" @ENC "$OUT\home-card-ai-influencer.mp4"
```
- 구간 길이를 L초로 바꾸면 `-t L`, `offset=L-2`입니다. 결과 길이는 L−1초입니다.
- 장면 안의 움직임이 처음 상태로 돌아오게 프롬프트를 써 두었기 때문에 크로스페이드가 눈에 띄지 않습니다.

**R3 · 왕복 루프 (정방향 + 역방향)** 예: `ad-rail-1` (0:07 – 0:11, 9:16)
```powershell
ffmpeg -y -ss 7 -t 4 -i "$IN\MASTER-AD-A.mp4" -filter_complex "[0:v]scale=720:1280:flags=lanczos,split[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1:a=0,format=yuv420p[v]" -map "[v]" @ENC "$OUT\ad-rail-1.mp4"
```
한 번 지나가는 동작(천이 휩쓸기, 꽃잎 낙하)처럼 처음과 끝이 다른 구간에 씁니다. 결과 길이는 구간의 2배라 용량도 2배가 됩니다. 1.3MB를 넘으면 구간을 3초로 줄입니다.

**R4 · 합본 (brandfilm-main 15초)** : R1로 만든 `brandfilm-main-1/2/3.mp4`(각 5초)를 0.5초 크로스페이드로 이어 붙입니다.
```powershell
ffmpeg -y -i "$OUT\brandfilm-main-1.mp4" -i "$OUT\brandfilm-main-2.mp4" -i "$OUT\brandfilm-main-3.mp4" -filter_complex "[0][1]xfade=transition=fade:duration=0.5:offset=4.5[x];[x][2]xfade=transition=fade:duration=0.5:offset=9,format=yuv420p[v]" -map "[v]" @ENC "$OUT\brandfilm-main.mp4"
```

### 7-4. 비율 바꾸기 (크롭)
위 레시피의 `scale=...` 바로 앞에 크롭 필터를 붙입니다. `-vf`와 `[0:v]` 뒤 모두 같은 방식입니다.

| 용도 | 크롭 필터 (스케일 앞에 붙임) | 이어지는 스케일 |
|---|---|---|
| 16:9 → 4:3 가운데 (카드) | `crop=ih*4/3:ih,` | `scale=960:720:flags=lanczos` |
| 16:9 → 9:16 모바일 히어로 | `crop=ih*9/16:ih:(iw-ow)*0.70:0,` | `scale=720:1280:flags=lanczos` |
| 9:16 → 3:4 (3:4가 없었을 때) | `crop=iw:iw*4/3,` | `scale=720:960:flags=lanczos` |

- 모바일 히어로의 `0.70`은 가로 위치입니다(0 = 왼쪽 끝, 0.5 = 가운데, 1 = 오른쪽 끝). 피사체가 오른쪽 가운데에 모여 있으므로 0.70에서 시작해 한 프레임 확인한 뒤 ±0.05씩 맞춥니다.
- 1080 높이에서 9:16을 자르면 608×1080입니다. 720×1280으로 키우면 약간 부드러워지는데, 어두운 배경 영상이라 허용 범위입니다. 크롭본이 너무 거칠면 `MASTER-HERO-MOBILE`(9:16 별도 생성)로 바꿉니다.
- 모바일 히어로 R2 예시:
```powershell
ffmpeg -y -ss 2 -t 12 -i "$IN\MASTER-HERO.mp4" -filter_complex "[0:v]crop=ih*9/16:ih:(iw-ow)*0.70:0,scale=720:1280:flags=lanczos,split[a][b];[a]trim=start=1,setpts=PTS-STARTPTS[body];[b]trim=end=1,setpts=PTS-STARTPTS[head];[body][head]xfade=transition=fade:duration=1:offset=10,format=yuv420p[v]" -map "[v]" @ENC "$OUT\home-hero-reel-mobile.mp4"
```
- `MASTER-HERO`에서 끝 프레임 입력을 썼다면 처음과 끝이 이미 이어지므로 R2의 크로스페이드 없이 R1로 잘라도 됩니다.

### 7-5. 포스터 추출 (영상 첫 프레임 → WebP)
슬롯 영상마다 하나씩 뽑습니다. 포스터는 나노바나나 PNG가 아니라 영상 첫 프레임에서 뽑아야 영상과 어긋나지 않습니다.
```powershell
Get-ChildItem $OUT -Filter *.mp4 | ForEach-Object { ffmpeg -y -i $_.FullName -frames:v 1 -c:v libwebp -quality 82 ("$OUT\" + $_.BaseName + "-poster.webp") }
```

### 7-6. 용량 확인
```powershell
Get-ChildItem $OUT -Filter *.mp4 | ForEach-Object { '{0}  {1:N2} MB' -f $_.Name, ($_.Length/1MB) }
```
목표: 5초 클립 1MB 안팎, 홈 히어로 2.5MB 이하, 다른 클립도 2MB 이하.

### 7-7. 참조 영상 샘플 (Wan 3.0 업로드가 막힐 때만)
```powershell
ffmpeg -y -ss 0 -t 10 -i "$IN\MASTER-HOME-CARDS.mp4" -vf "scale=-2:720" -an -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p "$IN\_ref_MASTER-HOME-CARDS_10s.mp4"
```

### 7-8. 참조 이미지 준비 (`_참조\` 폴더)
Higgsfield가 WebP를 받지 않을 때를 대비해 5장의 참조 묶음에 나온 기존 파일을 PNG로 바꿔 `_참조\`에 모아 둡니다. 예:
```powershell
$REPO = 'I:\AIO_OS\06_GITHUB\worktrees\aio-make\codex\WRK-20261013-AIO-CONTENT-RENEWAL\public'
New-Item -ItemType Directory -Force "$IN\_참조" | Out-Null
ffmpeg -y -i "$REPO\content-site\ai-influencer\unnie87-face.webp" "$IN\_참조\unnie87-face.png"
Copy-Item "$REPO\content-examples\brand-film\brandfilm-motion.mp4" "$IN\_참조\"
```
AI 인물 사진(`unnie87-*`, `yeopjip-*`, `grace-*`, `ssal-*`)과 `content-examples` 아래 기존 AIO 이미지가 대상입니다.

### 7-9. 연결과 보관
1. `_편집결과\`의 mp4와 포스터를 `public/content-examples/<service>/`로 옮기고 `example-media.ts`의 슬롯 `kind`·`src`·`poster`를 바꿉니다.
2. `MANIFEST.json`에 슬롯별로 마스터 파일명, 구간(시작–끝), 레시피, SHA를 적어 출처를 남깁니다.
3. 마스터 원본과 `_편집결과\`는 인박스에 남깁니다.
4. 슬롯이 아직 이미지 전용인 `ai-card-1~4` 영상은 구현 합의 뒤에 연결합니다.
