# AIO MAKE 컨텐츠 사이트 R5 소재 생성 작업지시서

2026-10-14 · BRIEF_R5 Step 1.5 · 문서 담당 · 사용자가 Higgsfield에서 직접 무료 생성

- 이미지 도구: 나노바나나 프로 2 (Nano Banana Pro 2)
- 영상 도구: Wan 3.0, 5초. 이미지 → 영상(I2V) 방식을 권장합니다. 같은 슬롯의 PNG를 첫 프레임으로 쓰면 정지 화면과 영상이 맞습니다.
- 공개 화면에는 모든 소재에 '연출 예시' 라벨을 붙입니다. AI 인물이 나오는 소재에는 'AI 가상인물' 표기를 함께 붙입니다. 라벨과 표기는 사이트가 HTML로 얹으므로 이미지 안에는 글자를 넣지 않습니다.

---

## 1. 전달 방법

### 저장 위치
`I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트\_소재_인박스_R5\`

### 파일 이름
- 이미지는 `<slotId>.png`, 영상은 `<slotId>.mp4`로 저장합니다. 예: `home-card-ad.png`, `home-card-ad.mp4`
- 슬롯 ID는 아래 표의 철자를 그대로 씁니다. 구현 에이전트가 이 이름으로 자동 연결합니다.
- Higgsfield 기본 파일명(`higgsfield_xxx.mp4` 등)은 그대로 두지 말고 바꿔 주세요.
- 다시 만들면 같은 이름으로 덮어씁니다. 후보를 여러 개 남기고 싶으면 `home-card-ad__2.mp4`처럼 뒤에 `__2`를 붙입니다. 이 경우 팀이 하나를 골라 연결합니다.
- 캐릭터 일관성용 참고 이미지처럼 사이트에 쓰지 않는 파일은 `_ref_` 접두사를 붙입니다. 예: `_ref_seoyun-sheet.png`
- JPG로만 받을 수 있으면 `<slotId>.jpg`도 괜찮습니다.

### 해상도
나노바나나 프로 2는 2K(가능하면 그 이상), Wan 3.0은 1080p로 설정합니다. 무료 한도 때문에 1080p가 안 되면 720p도 받습니다.

| 비율 | 이미지 권장 (최소) | 영상 |
|---|---|---|
| 16:9 | 2560×1440 (1920×1080) | 1920×1080 (1280×720) |
| 9:16 | 1440×2560 (1080×1920) | 1080×1920 (720×1280) |
| 4:3 | 2048×1536 (1440×1080) | 1440×1080 (960×720) |
| 3:4 | 1536×2048 (1200×1600) | 해당 없음 |
| 2:3 | 1600×2400 (1200×1800) | 해당 없음 |

- 영상은 5초, 소리 없이 만들어도 됩니다. 사이트에서는 음소거로 재생합니다.
- 루프 슬롯에서 Wan 3.0에 끝 프레임(End frame) 입력이 보이면 시작 이미지를 끝 프레임에도 넣어 주세요. 이음새가 깔끔해집니다. 끝 프레임 입력이 없으면 그대로 두셔도 됩니다. 팀이 크로스페이드나 왕복 재생으로 이음새를 처리합니다.

### 받은 뒤 팀이 하는 일
- `public/content-examples/`로 옮겨 `lib/content-site/example-media.ts`의 슬롯과 연결합니다.
- 영상은 웹용 mp4(H.264, 1MB 안팎)로 압축하고, 첫 프레임에서 포스터 이미지(WebP)를 뽑습니다.
- 이미지는 WebP로 변환하고 화면 크기에 맞춰 자릅니다.
- 원본은 인박스에 그대로 둡니다.

### 우선순위와 생성 순서
| 순위 | 슬롯 | 이미지 | 영상 |
|---|---|---|---|
| **1순위 필수** | `home-card-*` 6개 → `ad-center-1` → `ad-rail-1..9`(이미지) → `animation-scene-1..3` → `brandfilm-main-1..3` | 22 | 13 |
| **2순위 필수** | `home-hero-reel` 2종 → `motion-bg-1..2` → `ai-card-1..4` → `webtoon-cut-1..12` | 20 | 4 |
| **3순위 선택** | `ai-feed-*` 12개 · `animation-character-front/side` · `ad-hook-1..3` · `ad-rail-1..9` 영상 | 17 | 9 |

1순위 안에서는 컨텐츠 홈 카드 6개를 가장 먼저 만듭니다. 사이트 첫 화면의 3D 캐러셀이 이 카드로 움직입니다.

### 공통 금지
- 글자·숫자·자막·로고·브랜드 마크·워터마크 금지. 휴대폰 화면 속 UI 글자도 금지합니다.
- 실존 연예인, 알아볼 수 있는 실존 인물, 실제 고객사 이름·제품은 쓰지 않습니다. 제품은 모두 무상표 가상 제품입니다.
- 87언니·옆집엄마·그레이스의정원·쌀만드는아저씨는 회사 자체 AI 가상인물 IP라 써도 됩니다. 효과·후기·전후 비교를 암시하는 장면은 만들지 않습니다.
- 웹툰과 애니메이션 캐릭터는 이 문서에서 새로 정한 자체 IP만 씁니다. 기존 유명 작품이나 캐릭터를 닮지 않게 합니다.

---

## 2. 공통 스타일 블록 (모든 프롬프트 끝에 붙이기)

지금 사이트는 검정 바탕(#080808)에 보라 강조색(#A99BFF)을 씁니다. 기존 AIO 생성 이미지(`hero`·`brand`·`webtoon`·`animation`)를 실제로 열어 확인했습니다. 공통 기준은 어두운 숯색 무대, 보라 측광과 따뜻한 코랄·호박색 보조광, 아이보리·라벤더 하이라이트, 유리·트래버틴·새틴 같은 촉감 있는 재질, 고급 CGI·광고 사진 질감, 옅은 필름 그레인입니다. 아래 블록 중 슬롯에 표시된 것을 프롬프트 뒤에 그대로 붙여 넣으세요.

### [S-CINE] 사진·CGI 기본 (홈·모션그래픽·브랜드 영상·광고)
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

### [M-COMMON] Wan 3.0 영상 공통 (모든 영상 프롬프트 끝에)
```
Smooth, slow, cinematic motion. Keep the subject's identity, face, shape, colors and lighting stable from the first frame to the last. No new objects appearing, no text appearing, no morphing, no flicker, no camera shake, no scene cut.
```
루프 슬롯은 아래 문장을 하나 더 붙입니다.
```
Seamless loop: gentle cyclical motion so the final frame closely matches the first frame.
```

### [NEG] Wan 3.0 네거티브 프롬프트 (입력칸이 있으면)
```
text, letters, subtitles, captions, logo, watermark, brand name, extra fingers, deformed hands, distorted face, identity change, morphing, flicker, jitter, fast motion, scene cut, motion blur smear, low quality
```

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

## 4. 슬롯별 지시

표기: 종류 `IMG` = 이미지만, `IMG+VID` = 이미지 + 5초 영상(I2V). 비율·해상도는 1장 표를 따릅니다.

### 4-1. 컨텐츠 홈 (`/content`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `home-hero-reel` | 홈 히어로 배경 (데스크톱) | IMG+VID | 16:9 | 루프 | 2순위 |
| `home-hero-reel-mobile` | 홈 히어로 배경 (모바일) | IMG+VID | 9:16 | 루프 | 2순위 |
| `home-card-webtoon` | 서비스 3D 캐러셀 카드 | IMG+VID | 4:3 | 루프 | 1순위 |
| `home-card-animation` | 〃 | IMG+VID | 4:3 | 루프 | 1순위 |
| `home-card-ai-influencer` | 〃 | IMG+VID | 4:3 | 루프 권장 | 1순위 |
| `home-card-motion-graphics` | 〃 | IMG+VID | 4:3 | 루프 | 1순위 |
| `home-card-brand-film` | 〃 | IMG+VID | 4:3 | 루프 권장 | 1순위 |
| `home-card-ad` | 〃 | IMG+VID | 4:3 | 루프 | 1순위 |

카드 비율: `content-home.css`의 R4 깊이 캐러셀(`.ch-depth-media`)은 데스크톱 540×390(약 4:3), 모바일 280×320(거의 정사각)이고 `object-fit: contain`입니다. 그래서 4:3으로 만들고 주인공을 가운데 3:4 영역 안에 둡니다. 모바일에서 가운데를 잘라 써도 주인공이 남습니다.

#### `home-hero-reel` · 16:9 · IMG+VID · 루프 · 2순위
- 설명: 컨텐츠 홈 첫 화면 배경 루프입니다. 기존 `hero.webp`와 같은 세계(보라 유리 리본 아치, 아이보리 구, 필름 스트립)를 씁니다. 왼쪽 절반은 어둡게 비워 제목 자리로 남깁니다.
- 참조: `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\assets\hero.png`
- 이미지 프롬프트 (+[S-CINE])
```
Ultra-wide cinematic scene: a sculptural translucent violet glass ribbon arching over a dark reflective satin stage, three matte ivory spheres of different sizes and one small clear glass sphere resting beside dark volcanic rocks on the right, an iridescent transparent film strip curling around them, delicate coral-pink branch sprigs, a faint warm coral glow behind. The left half of the frame stays dark, empty and quiet for a headline overlay. Looks like a frame from a luxury motion-design brand film, photographed premium CGI.
```
- 영상 프롬프트 (+[M-COMMON] +루프)
```
Very slow camera push-in with a slight drift to the left. The glass ribbon gently undulates like silk in slow motion, small light glints travel along its edge, the film strip turns slightly, tiny particles of light drift upward, reflections on the floor shimmer softly. The left half stays dark.
```

#### `home-hero-reel-mobile` · 9:16 · IMG+VID · 루프 · 2순위
- 설명: 같은 장면을 세로로 다시 구성합니다. 위쪽 1/3은 제목 자리라 어둡게 비웁니다.
- 참조: `home-hero-reel.png`
- 이미지 프롬프트 (+[S-CINE])
```
Vertical composition of the same world: a translucent violet glass ribbon rising from the lower right in a tall arch, ivory spheres, a small clear glass sphere and an iridescent film strip clustered at the bottom on a dark reflective satin floor, faint coral glow. The upper third of the frame is dark, empty and quiet for a headline overlay. Premium CGI brand-film frame.
```
- 영상 프롬프트 (+[M-COMMON] +루프)
```
Slow upward tilt of a few degrees with a gentle push-in. The glass ribbon undulates slowly, light glints run along its edge, tiny light particles float upward, floor reflections shimmer. The upper third stays dark.
```

#### `home-card-webtoon` · 4:3 · IMG+VID · 루프 · 1순위
- 설명: 웹툰 대표 카드입니다. 서윤이 노을 지는 옥상에서 스케치북을 들고 있고, 주변에 웹툰 컷 3개가 떠 있습니다.
- 참조: `webtoon.png` (캐릭터 시트를 먼저 만들었다면 `_ref_seoyun-sheet.png`)
- 이미지 프롬프트 (CHARACTER W1 + 아래 + [S-WEBTOON], 이 슬롯만 "Single panel only" 문장을 지우고 사용)
```
Webtoon key art: Seo-yun stands on a city rooftop at violet dusk holding her violet sketchbook, hair and jacket moving in the wind, surrounded by three floating rectangular comic panels with thin white borders at different depths: one shows a glowing city skyline, one a close-up of her eye, one sheets of paper flying. Loose sketch pages drift through the air. Subject centered, generous dark violet margins on the left and right.
```
- 영상 프롬프트 (+[M-COMMON] +루프)
```
Gentle parallax: the three floating panels drift slowly at different speeds and depths, Seo-yun's hair and jacket flutter softly in the wind, paper pages float across the frame, very slow push-in. Her face stays stable.
```

#### `home-card-animation` · 4:3 · IMG+VID · 루프 · 1순위
- 설명: 애니메이션 대표 카드입니다. 보리가 아치 세계의 라벤더 계단 위에서 손을 흔듭니다.
- 참조: `animation.png`
- 이미지 프롬프트 (CHARACTER A1 + 아래 + [S-3D])
```
Bori stands on the top step of the lavender stairs under the large coral arch, waving one stubby arm with a happy face, the pale yellow sun disk behind the arch, the chrome sphere on a side ledge reflecting the scene, warm golden late-afternoon light with soft violet shadows. Low camera angle, character centered with space around.
```
- 영상 프롬프트 (+[M-COMMON] +루프)
```
Bori bounces gently in place and waves, blinks once, then returns to the starting pose. The camera orbits slowly about 10 degrees to the right and back, reflections move on the chrome sphere, soft light shimmer on the pool.
```

#### `home-card-ai-influencer` · 4:3 · IMG+VID · 루프 권장 · 1순위 · 'AI 가상인물' 표기
- 설명: AI 인플루언서 대표 카드입니다. 87언니가 어두운 스튜디오에서 카메라를 보는 모습이며, 사이트 톤에 맞춰 보라 측광을 씁니다.
- 참조: `unnie87-face.webp`, `unnie87-front.webp`
- 이미지 프롬프트 (CHARACTER P1 + 아래 + [S-PERSONA])
```
Waist-up portrait of 87 Unnie seated at a minimal dark studio set, one hand resting near her cheek, looking softly into the camera. Background is deep charcoal with a soft violet rim light from behind and a warm key light from the front left, a blurred small unbranded glass bottle and a ceramic cup on the table edge. Subject centered.
```
- 영상 프롬프트 (+[M-COMMON], 가능하면 +루프)
```
She turns her head slightly toward the camera, blinks naturally and gives a soft close-lipped smile, a few strands of hair move, very slow push-in. She does not speak. Face stays identical throughout.
```

#### `home-card-motion-graphics` · 4:3 · IMG+VID · 루프 · 1순위
- 설명: 모션그래픽 대표 카드입니다. 도형만으로 구성한 추상 화면이고 글자는 넣지 않습니다.
- 이미지 프롬프트 (+[S-CINE])
```
Abstract kinetic composition on a near-black background: a violet glass torus, a matte ivory sphere, a flat coral disc, a mirror-chrome capsule and a small lavender cube float in a balanced arrangement at different depths, connected by thin glowing violet lines and dotted arcs like a motion-design layout grid. Clean, graphic, premium 3D render.
```
- 영상 프롬프트 (+[M-COMMON] +루프)
```
Each shape rotates slowly on its own axis and drifts along a small circular orbit at a different speed; the thin lines draw on and fade rhythmically; the camera stays almost locked with a tiny slow push-in.
```

#### `home-card-brand-film` · 4:3 · IMG+VID · 루프 권장 · 1순위
- 설명: 브랜드 영상 대표 카드입니다. 가상 도자기 공방에서 장인의 손이 물레로 컵을 빚습니다. `brandfilm-main`과 같은 세계입니다.
- 이미지 프롬프트 (+[S-CINE])
```
Cinematic close shot of an artisan's hands shaping a small pale clay cup on a spinning pottery wheel inside a dim minimalist studio, warm amber window light from the side, a soft violet rim light outlining the hands and clay, fine dust in the air, unbranded tools on a shelf in soft focus. Face not visible.
```
- 영상 프롬프트 (+[M-COMMON], 가능하면 +루프)
```
The wheel spins steadily, the hands rise slowly as the cup wall forms, wet clay glistens, dust particles float in the window light, very slow dolly-in.
```

#### `home-card-ad` · 4:3 · IMG+VID · 루프 · 1순위
- 설명: SNS 광고 대표 카드입니다. 로고 없는 휴대폰이 비스듬히 떠 있고, 화면 안에 세로 향수 광고 장면이 보입니다. `ad-center-1`과 같은 제품입니다.
- 이미지 프롬프트 (+[S-CINE])
```
A generic modern smartphone with thin black bezels and no logo floats tilted about 15 degrees against a near-black background. Its screen shows a vertical ad scene: an unbranded amber glass perfume bottle with a blank label standing on an ivory travertine block, a sheer violet fabric sweeping behind it, warm coral light. The phone screen contains no interface text or icons. Soft violet rim light on the phone edges, subtle reflection below.
```
- 영상 프롬프트 (+[M-COMMON] +루프)
```
The phone floats and rotates very slowly a few degrees, a soft light sweep slides across its glass; inside the screen the violet fabric flows gently behind the bottle. No text appears on the screen.
```

### 4-2. 웹툰 (`/content/webtoon`) · 이미지만

| 슬롯 ID | 사용처 | 종류 | 비율 | 순위 |
|---|---|---|---|---|
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
| `animation-scene-1` | 장면 전환(깊이·크로스컷) 1 · 시작 | IMG+VID | 16:9 | 아니오 | 1순위 |
| `animation-scene-2` | 〃 2 · 전개 | IMG+VID | 16:9 | 아니오 | 1순위 |
| `animation-scene-3` | 〃 3 · 마무리 | IMG+VID | 16:9 | 끝 정지 | 1순위 |
| `animation-character-front` | 캐릭터 설정(정면) | IMG | 4:3 | — | 3순위 선택 |
| `animation-character-side` | 캐릭터 설정(측면) | IMG | 4:3 | — | 3순위 선택 |

세 장면은 한 이야기로 이어집니다. 1번 결과물을 2·3번의 참조로 올려 조명과 세계를 맞춥니다. 모든 이미지는 CHARACTER A1 + 장면 설명 + [S-3D], 모든 영상은 장면 모션 + [M-COMMON]입니다.

#### `animation-scene-1` · 시작
- 설명: 아침 햇살, 계단 위의 보리가 리본 달린 작은 상자를 발견합니다.
- 이미지
```
Wide cinematic shot: early golden morning in Bori's world. Bori stands at the top of the lavender stairs and leans forward curiously toward a small ivory gift box tied with a violet ribbon on the step below, the coral arch framing the scene, sun disk rising behind, long soft shadows.
```
- 영상
```
Bori tilts its body, blinks twice and hops down one step toward the gift box. The camera pushes in slowly and slightly lowers. Morning light flickers softly on the pool.
```

#### `animation-scene-2` · 전개
- 설명: 상자가 열리고 따뜻한 빛 구슬이 떠올라 아치 사이로 날아갑니다. 보리가 손을 뻗습니다.
- 참조: `animation-scene-1.png`
- 이미지
```
Medium-wide shot: the gift box lid has popped open and a glowing warm amber orb of light floats up out of it, rising toward the coral arch; Bori reaches both stubby arms up with an excited face, the orb's light painting warm highlights on its glossy lilac body.
```
- 영상
```
The orb floats upward and drifts slowly to the right through the arch, leaving a faint sparkle trail; Bori follows it with its eyes and takes two small steps forward. The camera tilts up gently to follow the orb.
```

#### `animation-scene-3` · 마무리
- 설명: 빛 구슬이 연못가 원형 받침대에 내려앉고 세계 전체가 환해집니다. 보리가 카메라를 향해 손을 흔듭니다.
- 참조: `animation-scene-1.png`, `animation-scene-2.png`
- 이미지
```
Wide closing shot: the glowing orb rests on a round lavender pedestal beside the shallow pool, warm light radiating across the cream walls and coral arch, the whole world brighter and golden; Bori stands next to it facing the camera and waving happily, the sun disk centered behind.
```
- 영상
```
A soft wave of warm light ripples outward from the orb across the walls and pool, Bori waves and bounces once, then settles. The camera pulls back slowly and ends on a calm, still wide frame.
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
| `motion-bg-1` | 히어로·글자 배치 배경 루프(도형) | IMG+VID | 16:9 | 이음새 없는 루프 | 2순위 |
| `motion-bg-2` | 스타일 프레임·장면 전환 배경 루프(리본) | IMG+VID | 16:9 | 이음새 없는 루프 | 2순위 |

글자가 위에 얹히므로 화면 가운데는 비교적 어둡고 단순하게 둡니다.

#### `motion-bg-1` · 기하 도형 궤도
- 설명: 검정 바탕 위에서 보라 유리 링, 아이보리 구, 코랄 원판, 크롬 캡슐, 라벤더 큐브가 가장자리 쪽에 흩어져 천천히 돕니다.
- 이미지 (+[S-CINE])
```
Abstract motion-graphics background on a near-black field: a violet glass ring, a matte ivory sphere, a flat coral disc, a mirror-chrome capsule and a small lavender cube float near the edges and corners at different depths, thin glowing violet guide lines and dotted arcs connect them. The center of the frame is dark and empty for typography. Clean premium 3D render.
```
- 영상 (+[M-COMMON] +루프)
```
All shapes rotate slowly on their own axes and travel along small elliptical orbits at different speeds, guide lines draw on and fade in a calm rhythm, locked-off camera. The center stays empty and dark.
```

#### `motion-bg-2` · 유리 리본 물결
- 설명: 반투명 보라 유리 리본 두 가닥과 가는 빛 선이 화면 아래쪽에서 천천히 물결칩니다.
- 이미지 (+[S-CINE])
```
Abstract background: two translucent violet glass ribbons flow in long horizontal waves across the lower third of a near-black frame, a few fine glowing light threads run parallel to them, tiny coral and ivory light specks float in the dark upper area. Minimal, elegant, premium CGI.
```
- 영상 (+[M-COMMON] +루프)
```
The ribbons undulate slowly like silk underwater, light glints travel along their edges from left to right, light specks drift gently, locked-off camera.
```

### 4-5. 브랜드 홍보 영상 (`/content/brand-film`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `brandfilm-main-1` | 대체 영상 컷 1 · 도입(전경) + 포스터 | IMG+VID | 16:9 | 아니오 | 1순위 |
| `brandfilm-main-2` | 컷 2 · 핵심 메시지(제품·사람) + 포스터 | IMG+VID | 16:9 | 아니오 | 1순위 |
| `brandfilm-main-3` | 컷 3 · 마무리 + 포스터 | IMG+VID | 16:9 | 끝 정지 | 1순위 |

- 가상의 소규모 도자기 공방을 소개하는 영상입니다. 브랜드명과 로고는 없습니다.
- 팀이 1 → 2 → 3을 이어 15초 `brandfilm-main.mp4`를 만들고 muted autoplay 루프로 재생합니다. 이미지 3장은 각 컷의 포스터와 30초·60초 구성 표의 장면 역할(도입·핵심 메시지·마무리) 이미지로 씁니다.
- 세 컷의 색감을 맞추기 위해 1번 결과물을 2·3번의 참조로 올립니다. 3번은 기존 `brand.png`도 참조로 올립니다(`I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\dist\assets\brand.png`).

#### `brandfilm-main-1` · 도입
- 설명: 푸른 새벽, 안개 낀 언덕 위 콘크리트·유리 공방 건물 창에 따뜻한 불이 켜져 있습니다.
- 이미지 (+[S-CINE])
```
Wide establishing shot at blue hour: a minimalist concrete-and-glass craft studio building on a misty hillside among dark pine trees, warm amber light glowing from its tall windows, a thin band of violet sky above the ridge, soft fog in the valley. Cinematic, calm, premium documentary look.
```
- 영상 (+[M-COMMON])
```
Slow aerial push toward the building, fog drifts gently across the hillside, one more window light turns on softly, trees sway very slightly.
```

#### `brandfilm-main-2` · 핵심 메시지
- 설명: 공방 안에서 장인 두 명이 일합니다. 앞의 한 명은 물레를 돌리고, 뒤의 한 명은 유약을 바릅니다. 얼굴은 알아볼 수 없게 잡습니다.
- 이미지 (+[S-CINE])
```
Interior medium-wide shot inside the craft studio: in the foreground an artisan in a linen apron shapes a pale clay cup on a pottery wheel, seen from the side with the face turned away; in the soft-focus background a second artisan glazes ivory cups at a wooden table; shelves of unbranded ceramics, warm window light with a violet rim light, floating dust.
```
- 영상 (+[M-COMMON])
```
Slow lateral dolly from left to right past the wheel, the wheel spins and the clay rises under the hands, the background artisan lifts a cup to inspect it, dust drifts in the light beams.
```

#### `brandfilm-main-3` · 마무리
- 설명: 완성된 아이보리 컵에서 김이 오르고, 트래버틴 받침, 보라 천, 둥근 창의 코랄 햇빛이 보입니다. 왼쪽 1/3은 나중에 문구를 넣을 자리라 어둡게 둡니다.
- 이미지 (+[S-CINE])
```
Closing hero still life: a finished handmade ivory ceramic cup with steam rising, standing on a sculptural ivory travertine block on the right two-thirds of the frame, a sheer violet fabric floating behind it, warm coral sunlight falling through a circular aperture, deep lavender shadows. The left third is dark and quiet for a later title.
```
- 영상 (+[M-COMMON])
```
Steam rises and curls slowly, the violet fabric drifts gently, the circular light patch slides a little across the wall, very slow push-in that ends in a still hold.
```

### 4-6. SNS 광고 영상 (`/content/ad`)

| 슬롯 ID | 사용처 | 종류 | 비율 | 루프 | 순위 |
|---|---|---|---|---|---|
| `ad-center-1` | 가운데 고정 세로 영상 | IMG+VID | 9:16 | 루프 | 1순위 |
| `ad-rail-1` ~ `ad-rail-9` | 기울어진 3열 레일(열당 3장, 18초 왕복) | IMG 필수 · VID 선택 | 9:16 | 루프 | 이미지 1순위 · 영상 3순위 |
| `ad-hook-1` ~ `ad-hook-3` | '장면의 역할' 휴대폰 화면 3컷 | IMG | 9:16 | — | 3순위 선택 |

- 레일은 이미지로 먼저 채우고, 영상은 여유가 있을 때 만듭니다. 레일이 계속 움직이므로 이미지만으로도 충분히 동적으로 보입니다.
- 레일 9장은 업종이 모두 달라야 합니다. 그래도 같은 사이트 톤을 위해 어두운 배경, 보라 측광, 따뜻한 보조광은 공통으로 씁니다.
- 각 장면의 위쪽 1/4과 아래쪽 1/5은 비교적 단순하게 둡니다. 팀이 광고 문구 장식을 얹을 수 있습니다.

#### `ad-center-1` · 1순위
- 설명: 향수 광고 세로 영상입니다. 보라 천이 휩쓸며 지나가면 무상표 호박색 향수병이 드러납니다.
- 이미지 (+[S-CINE])
```
Vertical product ad frame: an unbranded amber glass perfume bottle with a blank ivory label and a brushed silver cap stands on an ivory travertine block in the middle of the frame, a sheer violet fabric sweeping diagonally behind it, warm coral light through a circular aperture, deep charcoal-lavender shadows, glossy reflections on the glass. The top quarter and bottom fifth are calm and simple.
```
- 영상 (+[M-COMMON] +루프)
```
The violet fabric sweeps slowly across the frame and settles behind the bottle, a light glint travels down the bottle edge, tiny dust particles sparkle in the coral light, very slow push-in.
```

#### `ad-rail-1` ~ `ad-rail-9`
이미지 프롬프트 = 아래 문장 + [S-CINE]. 영상(선택)은 모션 문장 + [M-COMMON] + 루프 문장입니다.

| 슬롯 | 업종 | 한국어 설명 | 영문 이미지 프롬프트 | 영문 모션 프롬프트 |
|---|---|---|---|---|
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
|---|---|---|---|---|
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

## 5. 전체 슬롯 목록과 개수

| 순위 | 슬롯 | 이미지 | 영상 |
|---|---|---|---|
| 1순위 필수 | `home-card-webtoon` · `home-card-animation` · `home-card-ai-influencer` · `home-card-motion-graphics` · `home-card-brand-film` · `home-card-ad` | 6 | 6 |
| 1순위 필수 | `ad-center-1` | 1 | 1 |
| 1순위 필수 | `ad-rail-1` ~ `ad-rail-9` (이미지) | 9 | 0 |
| 1순위 필수 | `animation-scene-1` ~ `animation-scene-3` | 3 | 3 |
| 1순위 필수 | `brandfilm-main-1` ~ `brandfilm-main-3` | 3 | 3 |
| 2순위 필수 | `home-hero-reel` · `home-hero-reel-mobile` | 2 | 2 |
| 2순위 필수 | `motion-bg-1` · `motion-bg-2` | 2 | 2 |
| 2순위 필수 | `ai-card-1` ~ `ai-card-4` | 4 | 0 |
| 2순위 필수 | `webtoon-cut-1` ~ `webtoon-cut-12` | 12 | 0 |
| 3순위 선택 | `ai-feed-1-1` ~ `ai-feed-4-3` | 12 | 0 |
| 3순위 선택 | `animation-character-front` · `animation-character-side` | 2 | 0 |
| 3순위 선택 | `ad-hook-1` ~ `ad-hook-3` | 3 | 0 |
| 3순위 선택 | `ad-rail-1` ~ `ad-rail-9` (영상) | 0 | 9 |
| **합계** | | **59** | **26** |

- 필수(1·2순위): 이미지 42장, 영상 17개 (1순위만: 이미지 22장, 영상 13개)
- 선택(3순위): 이미지 17장, 영상 9개
- 참고용 `_ref_` 캐릭터 시트(서윤·도현 등)는 개수에 넣지 않았습니다.
