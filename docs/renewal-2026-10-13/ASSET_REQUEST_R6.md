# AIO MAKE 컨텐츠 사이트 R6 소재 요청서 (R5 개정판)

2026-10-15 · BRIEF_R6 10절 · R6 통합 정리 · 사용자가 Higgsfield에서 직접 무료 생성 · 기준 문서는 `ASSET_REQUEST_R5.md`(30초 마스터 방식)입니다.

이 문서는 R5를 대체하지 않고 **R6에서 바뀐 부분만** 고칩니다. 바뀌지 않은 부분(공통 스타일 블록, 캐릭터 시트, 슬롯별 이미지 프롬프트, 편집 방법, 라벨 규칙, 공통 금지)은 R5 본문을 그대로 따릅니다. 저장 위치도 R5와 같은 `I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트\_소재_인박스_R5\`입니다(이미 만든 파일을 옮기지 않아도 됩니다).

## 0. 한눈에 보기

| 항목 | R5 | R6 | 바뀐 이유 |
|---|---|---|---|
| 이미지 (나노바나나 프로 2) | 59장 (필수 42 · 선택 17) | **54장 (필수 37 · 선택 17)**, 보류 1장 별도 | 취소 4장, 보류 1장 |
| 마스터 영상 (Wan 3.0) | 8개 (필수 6 · 선택 2) | **7개 (필수 4 · 선택 3)** | HERO 취소, AD-A는 선택으로 이동 |
| 마스터 생성 시간 합계 | 240초 | **184초** (필수 100 · 선택 84) | MOTION 30초에서 10초로, AD-A 30초에서 24초로 |
| 슬롯 영상 (팀이 편집) | 30개 (필수 17 · 선택 13) | **25개 (필수 12 · 선택 13)**, 보류 1개 별도 | 취소 4개, 보류 1개 |

R5 문서에 적힌 합계(59 · 8 · 30 · 필수 17)는 취소분이 빠지지 않은 숫자라 이 표의 숫자로 바로잡습니다.

---

## 1. R6에서 취소된 항목 (만들지 않아도 됩니다)

| 항목 | 종류 | R5에서의 자리 | 취소 이유 | 수량 영향 |
|---|---|---|---|---|
| `home-hero-reel` | 이미지 · 슬롯 영상 | 컨텐츠 홈 히어로 배경 (데스크톱) | 홈 히어로가 사용자가 직접 만드는 메이킹 필름 16:9 영상 한 칸으로 바뀌었습니다 | 이미지 −1, 슬롯 영상 −1 |
| `home-hero-reel-mobile` | 이미지 · 슬롯 영상 | 컨텐츠 홈 히어로 배경 (모바일) | 같은 이유 | 이미지 −1, 슬롯 영상 −1 |
| `MASTER-HERO` | 마스터 영상 | 위 두 슬롯의 원본 30초 영상 | 같은 이유 | 마스터 −1 |
| `motion-bg-1` | 이미지 · 슬롯 영상 | 모션그래픽 히어로·글자 배치 배경 루프(도형) | MOTION STUDY 박스를 삭제해 코드에서 쓰는 곳이 없어졌습니다 | 이미지 −1, 슬롯 영상 −1 |
| `ad-center-1` | 이미지 · 슬롯 영상 | SNS 광고 히어로 가운데 고정 세로 영상 | 광고 히어로의 가운데 카드를 삭제하고 3열 레일만 남겼습니다 | 이미지 −1, 슬롯 영상 −1 |

`ASSET_REQUEST_R5.md`에는 이 취소 표시(취소선 + 사유)가 이미 들어 있습니다. `motion-bg-1`의 취소 표시는 이 문서가 기준입니다.

### 1-1. 이미 만든 경우 어디에 쓰이는지

만든 소재를 버릴 필요는 없습니다. 아래 자리에 그대로 쓸 수 있습니다.

| 이미 만든 파일 | 쓸 수 있는 곳 | 방법 |
|---|---|---|
| `home-hero-reel.png`, `MASTER-HERO.mp4` | 홈 히어로 임시 영상 | 메이킹 필름이 오기 전까지 `lib/content-home.ts`의 `contentHomeHero.video` 한 줄(16:9, `src`와 `poster`)에 넣을 수 있습니다. 메이킹 필름이 오면 같은 줄을 교체합니다. 그 밖에 `MASTER-MOTION`의 색감 참조 이미지로도 계속 씁니다 |
| `home-hero-reel-mobile.png`, 모바일 크롭 영상 | 쓸 곳 없음 | 홈 히어로는 모바일에서도 같은 16:9 한 칸입니다. 보관만 하면 됩니다 |
| `motion-bg-1.png` (도형 궤도, 가운데 비움) | 모션그래픽 `motion-scene-3` | 슬롯 설명이 "문구가 들어갈 여백을 남긴 마무리 장면"이라 가운데를 비운 이 이미지가 맞습니다. `example-media.ts`의 `motion-scene-3` `src` 한 줄을 바꿉니다 |
| `ad-center-1.png` (향수병 세로) | 광고 장면 `ad-scene-2` 또는 레일 | 광고 페이지 "장면의 역할" 3컷(`ad-hook-1~3`, 슬롯 `ad-scene-1~3`) 중 제품을 크게 보이는 컷의 원본이 됩니다. 같은 병과 같은 톤이라 `ad-hook-2` 대신 그대로 써도 됩니다. 업종이 겹치지 않으면 레일 슬롯 하나로도 가능합니다 |
| `MASTER-AD-A.mp4` (30초, 샷 A가 향수병) | 광고 레일 `ad-rail-1~4` 영상 | 샷 B~E 구간(0:07 이후)만 잘라 씁니다. 샷 A 구간(0:00~0:06)만 쓰지 않습니다. 다시 만들 필요가 없습니다 |
| `MASTER-MOTION.mp4` (30초 3샷) | 홈 카드 `home-card-motion-graphics` | 샷 C 구간(0:20~0:29)을 그대로 씁니다. 샷 A·B 구간은 사용처가 없지만 다시 만들 필요도 없습니다 |
| `MASTER-HOME-CARDS.mp4` (9번 참조에 `ad-center-1`을 넣고 만든 것) | 그대로 | 샷 C의 향수병 형태가 다를 수 있으나 카드 영상으로 충분하면 다시 만들지 않습니다 |

만들던 중이라면 위 표의 "쓸 곳"을 먼저 보고 새로 만들지 판단해 주세요.

---

## 2. 재확인 항목

### 2-1. `motion-bg-2` · 보류 (사용처 없음)

| 항목 | 내용 |
|---|---|
| 용도(R5) | 스타일 프레임·장면 전환 배경 루프(유리 리본 물결) |
| 현재 코드 | 삭제된 스타일 프레임이 유일한 사용처였고, `lib/content-site/example-media.ts`에 이 슬롯이 없습니다 |
| 결정 | 만들지 않아도 됩니다. 수량에서 제외하고 **보류**로 따로 표시합니다 |
| 이미 만든 경우 | 모션그래픽 `motion-scene-1`("유리 리본의 색과 질감으로 시작하는 장면") 또는 히어로 예시 `motion-hero-1`의 `src` 한 줄을 바꿔 씁니다 |
| 다시 쓰고 싶다면 | 사용할 자리를 알려 주시면 슬롯을 만들고 R5의 이미지·영상 지시를 그대로 살립니다 |

### 2-2. `ai-card-1` ~ `ai-card-4` · 카드 2배 해상도

AI 인플루언서 히어로 카드가 데스크톱 240×336에서 **480×672**로 커졌습니다. 이미지는 그대로 3:4 한 장이지만 해상도 기준이 올랐습니다.

| 구분 | 화면에서 보이는 크기 | 2배 선명도에 필요한 픽셀 |
|---|---|---|
| 데스크톱 (768px 이상) | 최대 480×672 (비율 1 : 1.4) | **960×1344** |
| 모바일 (767px 이하) | 약 290×406 (뷰포트 폭의 75% 이내) | 580×812 (데스크톱 기준을 맞추면 충족) |

| 기준 | 3:4 원본 크기 | 설명 |
|---|---|---|
| **최소** | **1008×1344** | 카드 높이의 정확히 2배(1344px). 이보다 작으면 큰 화면에서 흐려집니다 |
| **권장** | **1536×2048** (나노바나나 프로 2K, 3:4) | 사이트 이미지 최적화가 1080px 폭으로 줄여 내보내도 2배를 넘습니다. R5의 3:4 권장 크기와 같습니다 |

- R5 지시대로 만들었다면(최소 1200×1600 이상) 이미 R6 기준을 넘으므로 **다시 만들지 않습니다**. 1200×1600 미만으로 저장했다면 권장 크기로 다시 생성해 주세요.
- 화면의 카드 비율(1 : 1.4)은 3:4(1 : 1.33)보다 약간 길쭉합니다. 3:4 원본을 쓰면 좌우가 합쳐서 약 5% 잘립니다. 얼굴·손·소품(머그잔, 밀짚모자, 스카프)을 좌우 가장자리 5%에 닿지 않게 두세요. 머리 위 여백은 8% 이상 둡니다.
- 3:4가 아닌 비율로 받았다면: 4:5는 좌우가 약 11% 잘리고, 2:3은 위아래가 약 7% 잘립니다(위쪽 28% 기준이라 얼굴을 위쪽 60% 안에 둡니다).
- 파일 이름은 인박스에서는 R5처럼 `ai-card-1.png`입니다. 팀이 사이트에 넣을 때 계정 id가 든 이름(`unnie87-card.webp`, `yeopjip-card.webp`, `grace-card.webp`, `ssal-card.webp`)으로 바꿉니다. 카드 조회가 파일명의 계정 id를 보기 때문입니다.
- 현재 카드에 쓰는 기준 사진은 `unnie87-face`가 1080×1440이지만 `yeopjip-portrait`(900×1117)와 `ssal-portrait`(900×1205)는 2배에 못 미칩니다. 새 카드 이미지가 오면 교체됩니다.
- `MASTER-PERSONAS`의 카드 영상(선택)은 같은 이유로 최소 크기를 **1080×1440**으로 올립니다. R5의 720×960은 쓰지 않습니다.
- 카드 이미지 프롬프트와 장면 문장은 R5 4-7 그대로입니다. R5의 "얼굴과 상반신을 가운데 4:5 영역 안에" 문장은 위 5% 여백 규칙으로 바꿔 읽습니다.

### 2-3. 애니메이션 영상 레퍼런스 슬롯 구조

애니메이션 페이지는 영상 레퍼런스가 쌓이는 구조로 바뀌었습니다. 소재 요청은 R5와 같고(`animation-scene-1~3`과 `MASTER-ANIMATION`), 추가분은 코드 두 줄로 붙습니다.

**화면 구성**: 히어로의 대표 슬롯 1개(`animation-hero-1`, 기존 2:3 이미지 그대로) 아래에 16:9 영상 레퍼런스 그리드가 있습니다. 모바일 1열, 768px 이상 2열입니다. 채워진 슬롯만 그려지고, 슬롯이 하나도 없을 때만 빈 16:9 면과 안내 한 줄이 보입니다.

**지금 들어 있는 슬롯**: `animation-scene-1`, `-2`, `-3`(연출 예시 이미지 3장). `MASTER-ANIMATION`에서 영상이 오면 이 세 슬롯의 `src`(+`poster`)를 영상과 첫 프레임 WebP로 바꿉니다.

**레퍼런스를 더 늘리는 방법** (팀이 하는 일, 사용자는 영상만 주면 됩니다)

1. 영상은 `public/content-examples/animation/<슬롯id>.mp4`, 첫 프레임은 같은 폴더의 `<슬롯id>.webp`로 둡니다.
2. `lib/content-site/example-media.ts`에 슬롯 한 줄을 추가합니다.
   `{ id: "animation-scene-4", service: "animation", section: "scene", kind: "video", src: ".../animation-scene-4.mp4", poster: ".../animation-scene-4.webp", alt: "...", label: STAGED, aspect: "16x9", width: 1280, height: 720 }`
3. `lib/content-site/services/animation.ts`의 `animationReferenceIds`에 그 id를 한 줄 더합니다. 그리드가 한 칸 늘어납니다. `src`가 빈 슬롯은 그려지지 않습니다.
4. `public/content-examples/MANIFEST.json`에 파일과 SHA를 올립니다(테스트가 요구합니다).

**영상 사양**: 16:9, 최소 1280×720 · 권장 1920×1080, H.264, 소리 없음, 5~6초(끝에서 정지하거나 왕복), 5초당 1MB 안팎, 첫 프레임 WebP. 고객 레퍼런스 영상은 공개 권리 HOLD라 쓰지 않습니다.

**히어로 대표 슬롯을 16:9 영상으로 바꾸고 싶다면**: `MASTER-ANIMATION` 박자 1(0:00~0:10)에서 6초를 잘라 `animation-hero-1`의 `kind`·`src`·`poster`를 바꿉니다. 비율 규칙이 16:9에서는 세로 제한을 풀어 열 전체를 씁니다. 필요하면 알려 주세요. 수량에는 넣지 않았습니다(같은 마스터에서 나오는 선택 편집입니다).

---

## 3. 바뀐 마스터 영상 (R5 5장의 해당 부분을 이 내용으로 바꿉니다)

### 3-1. `MASTER-HOME-CARDS` · 필수 · 참조 묶음과 샷 C 문장만 변경

- 참조 이미지 9번(`ad-center-1.png`)을 뺍니다. **8/10**입니다. 이미지 8번 `home-card-ad.png`가 휴대폰 화면 속 향수병을 보여 주므로 형태 기준은 그것으로 충분합니다.
- 샷 C 문장의 끝 부분을 아래로 바꿉니다. 나머지(샷 A, B, 공통 문장)는 R5 그대로입니다.

```
[20-30s] Shot C, hard cut. Photographed premium CGI, composition of Image 8. A generic logo-free smartphone with thin black bezels floats tilted about 15 degrees against a near-black background and rotates very slowly a few degrees. Its screen shows the vertical ad scene seen in Image 8: the unbranded amber glass perfume bottle on an ivory travertine block with a sheer violet fabric flowing gently behind it under warm coral light. A soft light sweep slides across the phone glass. No text or icons on the screen. It ends close to its starting pose.
```
(맨 끝에 [M-MASTER])

### 3-2. `MASTER-MOTION` · 필수 · 10초 한 샷으로 축소

`motion-bg-1`(샷 A)과 `motion-bg-2`(샷 B)가 모두 사용처를 잃었고 `MASTER-HERO`의 참조 영상 역할도 사라졌습니다. 남는 슬롯은 `home-card-motion-graphics` 하나이므로 **샷 C만 10초로** 만듭니다.

- 규격: 10초 · 16:9 · 1920×1080 · 컷 없음. 4:3이 없으면 16:9로 만들고 피사체를 가운데 4:3 안에 둡니다.
- 만들어지는 슬롯: `home-card-motion-graphics` (1개)
- 파일 이름: `MASTER-MOTION.mp4` (R5의 `MASTER-MOTION-C`와 같은 내용)

**참조 묶음**
- 이미지 (3/10)
  1. `home-card-motion-graphics.png` (나노바나나) 시작 프레임
  2. `[REPO]content-examples\motion-graphics\motion-ribbon.webp`
  3. `[REPO]renewal\hero.webp`
- 영상 (1/5)
  - Video 1: `[REPO]content-examples\brand-film\brandfilm-motion.mp4`

**통합 프롬프트**
```
A calm 10-second abstract motion-graphics shot with a locked-off camera and one tiny slow push-in. Near-black background, clean premium 3D render, materials and colors as in Images 2 and 3: violet glass, matte ivory, flat coral, mirror chrome, soft violet rim light, fine film grain. Match the color grade, lighting and camera speed of Video 1, but not its content. No text or letters.

[0-10s] Composition of Image 1, which is the first frame. A balanced arrangement kept entirely inside the central 4:3 area of the frame: a violet glass torus, a matte ivory sphere, a flat coral disc, a mirror-chrome capsule and a small lavender cube at different depths, connected by thin glowing violet lines and dotted arcs like a motion-design layout grid. Each shape rotates slowly on its own axis and drifts along a small circular orbit, the lines draw on and fade rhythmically. By 10 seconds the arrangement is close to the starting arrangement.
```
(맨 끝에 [M-MASTER])

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:01 – 0:09 | `home-card-motion-graphics` | `home-card-motion-graphics.mp4` | R2 크로스페이드 루프 · 가운데 4:3 크롭 · 960×720 |

이미 30초 `MASTER-MOTION`을 만들었다면 1-1의 표대로 샷 C 구간을 씁니다.

### 3-3. `MASTER-AD-A` · 선택으로 이동 · 30초에서 24초 4샷으로

필수였던 이유는 `ad-center-1`(샷 A) 하나였고, 그 슬롯이 취소되어 남은 `ad-rail-1~4` 영상은 선택(3순위)입니다.

- 규격: 24초 · 9:16 · 1080×1920 · 하드컷 3번(6, 12, 18초), 샷마다 다른 업종 6초
- 만들어지는 슬롯: `ad-rail-1` ~ `ad-rail-4` (영상, 선택)

**참조 묶음**
- 이미지 (6/10)
  1. `ad-rail-1.png` (나노바나나) 시작 프레임, 립스틱
  2. `ad-rail-2.png` (나노바나나) 떡볶이
  3. `ad-rail-3.png` (나노바나나) 스니커즈
  4. `ad-rail-4.png` (나노바나나) 앱 화면과 손
  5. `home-card-ad.png` (나노바나나) 향수 광고 톤
  6. `[REPO]content-examples\ad\ad-product.webp` 기존 AIO 제품 장면
- 영상 (1/5)
  - Video 1: `MASTER-HOME-CARDS.mp4` (샷 C 구간 0:20–0:30의 광고 색감·조명)

**샷 목록**

| 샷 | 타임코드 | 내용 |
|---|---|---|
| A | 0:00 – 0:06 | 립스틱과 장미 꽃잎 (ad-rail-1) |
| B | 0:06 – 0:12 | 김 오르는 떡볶이 (ad-rail-2) |
| C | 0:12 – 0:18 | 공중에 뜬 스니커즈와 스카프 (ad-rail-3) |
| D | 0:18 – 0:24 | 손에 든 휴대폰, 추상 카드 UI (ad-rail-4) |

**통합 프롬프트**
```
A 24-second vertical 9:16 product-ad reel made of four separate shots joined by hard cuts at exactly 6, 12 and 18 seconds, no dissolves. Each shot shows a different unbranded product in the same premium dark-themed art direction: near-black charcoal background, soft violet rim light, warm coral-amber accent light, glossy reflections, subtle film grain. Match the color grade, lighting and camera speed of Video 1, but not its content. No text, logos or brand marks anywhere; the top quarter and bottom fifth of every frame stay calm and simple.

[0-6s] Shot A, continues the first frame (Image 1). An unbranded glossy rose-red lipstick bullet in a plain silver case stands on a dark mirror surface with scattered rose petals, violet rim light. Petals fall slowly past the lipstick, a light glint slides over the bullet, slow orbit of about 10 degrees.

[6-12s] Shot B, hard cut, look of Image 2. A shallow black pan of glossy Korean rice-cake tteokbokki with fish cake and a boiled egg, sesame sprinkled, on a dark wooden table, warm amber key light with a violet rim. Steam rises and curls, the sauce bubbles gently, very slow push-in.

[12-18s] Shot C, hard cut, look of Image 3. A pair of unbranded white leather sneakers floating mid-air at playful angles with a lavender silk scarf looping around them, dark studio, violet rim light. The sneakers rotate slowly in the air, the scarf ripples and loops, a gentle floating bob.

[18-24s] Shot D, hard cut, look of Image 4. A hand holding a generic logo-free smartphone, its screen showing abstract colorful rounded cards and soft gradient shapes with no text or icons, glowing violet light spilling from the screen onto the hand, dark background. The cards on the screen slide up smoothly one after another, the hand moves very slightly, the screen glow pulses softly.
```
(맨 끝에 [M-MASTER])

- 분할안: 샷 A~B(12초, 시작 프레임 `ad-rail-1.png`)와 샷 C~D(12초, 시작 프레임 `ad-rail-3.png`). 뒤쪽 파일의 타임코드는 12초를 뺍니다.
- 광고 장면은 한 번 지나가는 동작이라 루프가 아니라 왕복(boomerang)으로 만듭니다.

**SLOT MAP**

| 마스터 구간 | 슬롯 ID | 출력 파일 | 편집 규칙 |
|---|---|---|---|
| 0:01 – 0:05 | `ad-rail-1` | `ad-rail-1.mp4` | R3 왕복 루프 · 9:16 720×1280 |
| 0:07 – 0:11 | `ad-rail-2` | `ad-rail-2.mp4` | R3 |
| 0:13 – 0:17 | `ad-rail-3` | `ad-rail-3.mp4` | R3 |
| 0:19 – 0:23 | `ad-rail-4` | `ad-rail-4.mp4` | R3 |

### 3-4. 나머지 마스터

| 마스터 | 변경 |
|---|---|
| `MASTER-ANIMATION` | 없음. 애니메이션 영상 레퍼런스 그리드의 `animation-scene-1~3`과 홈 카드를 채웁니다 |
| `MASTER-BRANDFILM` | 없음 |
| `MASTER-AD-B` (선택) | 참조 이미지 6번(`ad-center-1.png`)을 뺍니다(5/10). 광고 톤 기준이 필요하면 6번을 `home-card-ad.png`로 바꿉니다 |
| `MASTER-PERSONAS` (선택) | 최소 해상도를 1080×1440으로 올립니다(2-2). 나머지는 R5 그대로 |
| `MASTER-HERO` | 취소 |

`ad-hook-1~3`(선택 이미지)의 참조는 `ad-center-1.png` 대신 `home-card-ad.png`를 올립니다(R5 4-6에 이미 반영됨).

---

## 4. 다시 계산한 수량과 우선순위

### 4-1. 이미지 (나노바나나 프로 2) · 54장 (필수 37 · 선택 17)

| 순위 | 슬롯 | 이미지 | 비고 |
|---|---|---|---|
| 1순위 필수 | `home-card-webtoon` · `-animation` · `-ai-influencer` · `-motion-graphics` · `-brand-film` · `-ad` | 6 | 4:3, 변경 없음 |
| 1순위 필수 | `ad-rail-1` ~ `ad-rail-9` | 9 | 변경 없음 |
| 1순위 필수 | `animation-scene-1` ~ `animation-scene-3` | 3 | 영상 레퍼런스 그리드의 첫 세 칸 |
| 1순위 필수 | `brandfilm-main-1` ~ `brandfilm-main-3` | 3 | 변경 없음 |
| 2순위 필수 | `ai-card-1` ~ `ai-card-4` | 4 | **해상도 상향** (최소 1008×1344, 권장 1536×2048) |
| 2순위 필수 | `webtoon-cut-1` ~ `webtoon-cut-12` | 12 | 변경 없음 |
| 3순위 선택 | `ai-feed-1-1` ~ `ai-feed-4-3` | 12 | 변경 없음 |
| 3순위 선택 | `animation-character-front` · `-side` | 2 | 변경 없음 |
| 3순위 선택 | `ad-hook-1` ~ `ad-hook-3` | 3 | 참조만 변경 |
| **합계** | | **54** | 필수 37 · 선택 17 |

계산: 59장에서 취소 4장(`home-hero-reel`, `home-hero-reel-mobile`, `motion-bg-1`, `ad-center-1`)과 보류 1장(`motion-bg-2`)을 뺐습니다. 2순위 필수는 20장에서 16장으로, 1순위 필수는 22장에서 21장으로 줄었습니다. 필수 42에서 5를 뺀 37입니다.

### 4-2. 마스터 영상 (Wan 3.0) · 7개 (필수 4 · 선택 3)

| 순서 | 마스터 | 길이 · 비율 | 구분 | 먼저 있어야 하는 이미지 | 참조 영상 |
|---|---|---|---|---|---|
| 1 | `MASTER-HOME-CARDS` | 30초 · 4:3 | 필수 (1순위) | home-card-ai-influencer, -webtoon, -ad, `_ref_seoyun-sheet` | 없음 |
| 2 | `MASTER-ANIMATION` | 30초 · 16:9 | 필수 (1순위) | animation-scene-1 ~ 3, animation-character-front/side, home-card-animation | 없음 |
| 3 | `MASTER-BRANDFILM` | 30초 · 16:9 | 필수 (1순위) | brandfilm-main-1 ~ 3, home-card-brand-film | 기존 `brandfilm-motion.mp4` |
| 4 | `MASTER-MOTION` | **10초** · 16:9 | 필수 (카드 1개) | home-card-motion-graphics | 기존 `brandfilm-motion.mp4` |
| 5 | `MASTER-AD-A` | **24초** · 9:16 | **선택** (3순위) | ad-rail-1 ~ 4, home-card-ad | MASTER-HOME-CARDS |
| 6 | `MASTER-AD-B` | 30초 · 9:16 | 선택 (3순위) | ad-rail-5 ~ 9 | MASTER-AD-A |
| 7 | `MASTER-PERSONAS` | 30초 · 3:4 | 선택 (3순위) | ai-card-1 ~ 4 | MASTER-HOME-CARDS |

생성 시간: 필수 30 + 30 + 30 + 10 = 100초, 선택 24 + 30 + 30 = 84초, 합계 184초입니다.

처음 세 개(HOME-CARDS, ANIMATION, BRANDFILM)로 카드 6개 중 5개와 애니메이션 레퍼런스 3칸, 브랜드 영상 컷 3개가 채워지고, 네 번째(MOTION)에서 여섯 번째 카드가 채워져 홈 캐러셀이 완성됩니다. 영상이 없는 카드는 포스터 이미지에 느린 확대가 걸려 비어 보이지 않습니다.

### 4-3. 슬롯 영상 (팀이 마스터에서 편집) · 25개 (필수 12 · 선택 13)

| 마스터 | 슬롯 영상 | 필수 | 선택 |
|---|---|---|---|
| HOME-CARDS | home-card-ai-influencer, -webtoon, -ad | 3 | 0 |
| ANIMATION | animation-scene-1, -2, -3, home-card-animation | 4 | 0 |
| BRANDFILM | brandfilm-main-1, -2, -3, home-card-brand-film | 4 | 0 |
| MOTION | home-card-motion-graphics | 1 | 0 |
| AD-A | ad-rail-1 ~ 4 | 0 | 4 |
| AD-B | ad-rail-5 ~ 9 | 0 | 5 |
| PERSONAS | ai-card-1 ~ 4 (영상) | 0 | 4 |
| **합계** | | **12** | **13** |

계산: R5의 30개(필수 17 · 선택 13)에서 취소 4개(`home-hero-reel`, `home-hero-reel-mobile`, `motion-bg-1`, `ad-center-1`)와 보류 1개(`motion-bg-2`)를 뺐습니다. 필수는 17에서 5가 빠진 12, 선택은 그대로 13입니다. 팀이 만드는 15초 합본 `brandfilm-main.mp4`는 개수에 넣지 않았습니다.

### 4-4. 남은 요청 우선순위 요약

1. 이미지 1순위 필수 21장: 홈 카드 6, 광고 레일 9, 애니메이션 장면 3, 브랜드 영상 컷 3
2. 마스터 1~3 (HOME-CARDS, ANIMATION, BRANDFILM)과 이미지 2순위 필수 16장 (`ai-card-1~4` 고해상도, 웹툰 컷 12)
3. 마스터 4 (MOTION 10초)
4. 선택: 이미지 17장, 마스터 5~7 (AD-A, AD-B, PERSONAS)

---

## 5. R5 본문과 달라진 곳 대조표

| R5 위치 | R6 처리 |
|---|---|
| 0장 한눈에 보기의 59 · 8 · 30 · 17 | 이 문서 0장의 숫자로 대체 |
| 1장 우선순위 표 | 이 문서 4-2의 표로 대체 |
| 4-1 `home-hero-reel` · `-mobile` | 취소 (1장) |
| 4-4 `motion-bg-1` | 취소 (1장). `motion-bg-2`는 보류 (2-1) |
| 4-6 `ad-center-1` | 취소 (R5에 표시됨). `ad-rail`은 3열 레일을 9초 왕복으로 2배 빠르게 돌립니다(소재 사양 변경 없음) |
| 4-7 `ai-card-n` 비율 메모 | 해상도 기준 상향 (2-2) |
| 5-0 만드는 순서 | 변경 없음. 생성 순서는 4-2 |
| 5-1 `MASTER-HOME-CARDS` | 참조 9번 삭제 · 샷 C 문장 교체 (3-1) |
| 5-4 `MASTER-AD-A` | 24초 4샷으로 교체 (3-3) |
| 5-5 `MASTER-MOTION` | 10초 한 샷으로 교체 (3-2) |
| 5-6 `MASTER-HERO` | 취소 |
| 5-7 `MASTER-AD-B` | 참조 6번 삭제 (3-4) |
| 5-8 `MASTER-PERSONAS` | 최소 해상도 1080×1440 (2-2) |
| 6장 개수 표 | 이 문서 4장의 표로 대체 |
| 애니메이션 슬롯 | 영상 레퍼런스 그리드 구조 (2-3) |
