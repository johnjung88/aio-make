# R7 조사: 플랫폼 계정 화면 시뮬레이션 · 컨텐츠 카드 폰 프레임

작성 2026-10-15 · 조사 전용(코드 수정 없음) · 요구 원문: `PROMPT_NEXT_R7.md` 메인 사이트 4)·7)
이 문서는 법률 자문이 아니다. 로고 사용을 결정하기 전에 상표 전문가 확인이 필요하다.

## 0. 결론 (권장안 1개)

**상표 로고·브랜드 색·아이콘 모사를 쓰지 않는 "중립 플랫폼 프레임"** 으로 간다.
- 플랫폼은 이름 텍스트(예: Instagram 릴스 · 9:16), 화면비, UI 구조(상단 바·하단 액션 열·재생 막대 배치)로 전달한다.
- 아이콘은 `lucide-react`의 범용 아이콘(Heart, MessageCircle, Send, Bookmark, Play 등)만 쓴다. 브랜드 로고 아이콘은 쓰지 않는다.
- 구현은 **React 상태 1개(활성 카드) + CSS 프레임 + 활성 카드에서만 영상 마운트**. 데스크톱은 3D 캐러셀, 모바일은 CSS scroll-snap 가로 넘김.
- 모든 가상 화면에 '**AI 가상 예시**' 태그를 프레임에 고정하고, 계정명·팔로워·조회수 숫자는 넣지 않는다(스켈레톤 막대 또는 "—").

## 1. 플랫폼 공식 가이드라인 (확인 범위 명시)

| 플랫폼 | 확인한 출처 | 핵심 문구(원문) | 확인 한계 |
|---|---|---|---|
| Instagram (Meta) | https://www.meta.com/brand/resources/instagram/instagram-brand/ (WebFetch 성공) | "should only use the logos and screenshots found on our Brand Resource Center site" / "Don't modify, abbreviate or translate the word Instagram to a different language" / "Don't combine any part of the Instagram brand with a company name, other trademarks, or generic terms." / 금지: "Implies partnership, sponsorship or endorsement." · "Makes the Instagram brand the most distinctive or prominent feature." / 피드·프로필 등 인터페이스 스크린샷을 상업물에 쓰려면 허가가 필요("speak to your Instagram contact") | 페이지는 UI를 흉내 낸 자체 제작 화면을 따로 규정하지 않음 |
| Instagram 도움말 | 검색 결과 요약(help.instagram.com/502205773161542 외) | 상표 침해 기준: "likely to confuse people regarding the source, endorsement or affiliation" | 도움말 본문은 WebFetch로 못 읽음(스니펫만) |
| Facebook (Meta) | https://www.meta.com/brand/resources/facebook/logo/ (검색 결과 스니펫. 직접 WebFetch는 404) | "The logo must be complete and unaltered." / "Do not recolor our logo to your own brand colors." / "Any logos or images found elsewhere on the web are not approved for use." / "All other forms of marketing do not require permission but must use the officially provided assets" / UI 사용 시 "ensure it reflects the latest version" | 스니펫 기반. 원문 재확인 필요 |
| YouTube | https://developers.google.com/youtube/branding (WebFetch 성공, API 브랜딩 규정) | "You also cannot change YouTube branding images or remove, obstruct, distort, or alter any element of a YouTube trademark." / "imply an association with or endorsement of any other product" 는 서면 허가 필요 / "Do not display the logo as the most prominent element on your web page." | `brand.youtube`(공식 브랜드 리소스)는 JS 렌더링이라 본문 추출 실패(이미지 파일명만). 검색 스니펫에 따르면 "product placements that show any YouTube Logos, Icons, or elements of the UI (e.g. buttons, pages, mobile screenshots)" 는 YouTube 승인 필요(미디어 노출 대상). 직접 원문 재확인 필요 |
| TikTok | https://developers.tiktok.com/doc/getting-started-design-guidelines (WebFetch 성공) | "You may not use TikTok logos, icons, symbols, or designs, without our prior written permission." / "you may not use names, logos, icons, symbols or designs of anyone without their permission." / 브랜드북 링크 제시: https://tiktokbrandbook.com/d/HhXfjVK1Poj9/legal | 이 문구는 개발자 프로그램 대상. 대행사 사이트 적용 여부는 불명. `tiktokbrandhub.com` 본문 추출 실패. 서면 허가 필요가 일반 원칙으로 보이므로 로고는 보수적으로 금지로 취급 |

해석(추정이며 확정 아님):
1. 세 곳 모두 **공식 자산 원본을 변형 없이** 쓰는 것을 전제로 하고, 로고·아이콘·UI 캡처를 "다른 상품과의 제휴·보증으로 읽히게" 쓰는 것을 막는다.
2. 로고를 UI 모사 화면 안에 넣거나 색을 바꾸거나 다른 요소와 합치면 "변형·결합" 금지에 직접 걸린다.
3. 공식 문서는 **로고가 없는 자체 제작 UI 모사**를 명시적으로 허용하거나 금지하지 않는다. 남는 위험은 가이드라인이 아니라 (a) 혼동·제휴 오인, (b) 한국 부정경쟁방지법의 타인 표지 혼동 행위·상표권, (c) 허위 성과 표시(표시광고법)다.
4. 한글 표기 주의: Meta 문구는 "translate the word Instagram"을 금하지만 한국어 본문에서 "인스타그램"은 일반 표기다. 라벨에는 라틴 표기 `Instagram`(I 대문자)을 우선하고, 본문 설명은 "인스타그램" 사용 가능으로 보되 확정은 법률 검토에 맡긴다.

### 안전한 선 (대행사 사이트가 UI 모사 가상 화면을 쓸 때)
| 해도 되는 것 | 하지 말 것 |
|---|---|
| 이름을 문장 속 일반 텍스트로 언급("릴스 9:16 규격") | 공식 로고·글리프·워드마크 이미지, 로고를 흉내 낸 그래픽 |
| 범용 아이콘(하트·말풍선·종이비행기·북마크·재생) | 브랜드 그라데이션, 유튜브 빨강+흰 삼각형, 틱톡 음표형 로고 등 트레이드 드레스 |
| 화면비·안전영역·레이아웃 구조 암시 | 실제 앱의 픽셀 단위 복제, 최신 앱과 달라 오해를 낳는 구버전 UI |
| 가상 계정명(실존 핸들이 아닌 일반 문구)과 'AI 가상 예시' 고정 표기 | 실존 `@핸들`, 실제 브랜드·고객 계정 캡처, 플랫폼이 AIO를 인증·제휴한 것처럼 읽히는 문구 |
| 지표 자리에 스켈레톤·"—" | 팔로워·조회수·성과 숫자(허위 성과 금지, 요구문 명시) |

`lucide-react` 주의: 0.577 버전에도 `Instagram`, `Facebook`, `Youtube` 같은 **브랜드 로고 아이콘**이 deprecated 형태로 남아 있을 수 있다. 사용 금지 목록에 넣고 린트 또는 테스트로 import를 막는 것을 권장한다.

## 2. 안 비교: 로고 없음 vs 로고 사용

| 항목 | A. 중립(이름 텍스트·범용 아이콘·구조) | B. 공식 로고 사용 | C. 로고 모사(색·형태 흉내) |
|---|---|---|---|
| 플랫폼 식별 | 이름 라벨+화면비+구조로 충분 | 즉시 식별 | 즉시 식별 |
| 가이드라인 충돌 | 낮음 | 중간. 원본 무변형·비중 제한·제휴 오인 금지. TikTok은 서면 허가 필요 문구. UI 모사 화면 안에 넣으면 "결합" 소지 | **높음**. 변형·모사 |
| 혼동·제휴 오인 | 낮음 | 중간(대행사 사이트가 공식 파트너로 읽힘) | 높음 |
| 디자인 일관성 | AIO 팔레트로 통일 가능 | 플랫폼 색이 섞여 산만 | 산만 |
| 유지 비용 | 낮음 | 자산 최신판 관리, 허가 문서 보관 | 분쟁 위험 |
| 판정 | **권장** | 보류. 쓰려면 별도 "지원 채널" 줄에 공식 원본만, 시뮬레이션 안에는 금지, 상표 검토 후 | 금지 |

## 3. 현재 코드 구조와 재사용

### 3-1. /content 3D 카드 섹션
- 컴포넌트: `components/content-home/service-showcase.tsx` (R6 WP-H) + 스타일 `components/content-home/content-home.css` (`.ch-depth-*`) + 훅 `use-stage-activity.ts`.
- 방식: React `current` 상태 → 카드별 `data-pos`(-2..2, hidden) → CSS 3D transform 보간. 수치는 `lib/content-home.ts`의 `homeCarouselMotion`(X 365/212px, Z 170/95px, rotateY 42deg, scale 1/.88/.72, opacity 1/.85/.55).
- 자동 넘김: `useEffect` 타이머(이미지 3500ms, 영상 5200ms). 정지 조건은 hover·키보드 포커스·터치·화면 밖·탭 숨김·헤더 움직임 토글·reduced-motion.
- 입력: 좌우 화살표, 옆 카드 클릭, 키보드(←→ Home End), 가로 스와이프(45px 이상이고 가로가 세로의 1.2배 이상일 때).
- 성능 특성: IntersectionObserver 1개(`useStageActivity`)로 활성 판단하고 scroll·rAF 루프는 없다. 영상은 **선택 카드에만 마운트**하고 `play()`로만 재생. `transform .65s`, `opacity/filter .5s` 전이. 카드 6장 모두 DOM에 있고 ±2 밖은 `hidden` 상태로 opacity 0. 옆 카드에 `filter: blur(1px/2.5px)` 적용(모바일 GPU 비용 요인).
- 소재 선택 함수 `cardMedia(selection)`: 검토판 실제 작업물 우선 → 없으면 `homeCardMedia[tab.id]` 슬롯(poster/video). 웹툰은 2컷 그리드(`comic`).
- 제약: 스테이지 고정 높이 600px(모바일 620px), 미디어 높이 390px(모바일 320px)의 가로형 상자. 9:16 폰 프레임은 높이 확보가 필요하다.

### 3-2. 메인 #work 컨텐츠 단계
- `components/home/workflow-journey.tsx` → `journey-content.tsx`(`JourneyContent`). 6개 탭 칩(`JourneyTabList`) + 서비스별 `tabpanel` + 이전/다음 버튼(`wj-stage-nav`).
- 스테이지(`.wj-stage`)는 단일 소재(`StageMedia`)를 `mediaShape()`(portrait/page/square/landscape/wide)로 크기 지정. 데스크톱 한정 `SidePreview` 좌우 미리보기가 3D 흉내의 전부(rotateY ±32deg).
- 데이터: `lib/home-journey.ts`의 `ContentSelection {tab, work, media, caption, tag}`; 서버에서 `HomeJourneyData.contentSelections`로 props 전달. 마케팅은 `marketingPanel`(4 노드 + `.wj-cycle`)이고 `MarketingBody`가 정적 목록을 렌더한다.
- CSS는 `.wj`/`.guide-page` 범위의 `workflow-journey.css`(909줄)이며, 컨텐츠 사이트의 `--cs-*` 토큰과 다른 토큰 체계다. `.ch-depth-*`를 그대로 import하면 토큰이 맞지 않는다.
- 레이아웃: 좌측 레일 + `wj-main` 안의 텍스트/스테이지 2열(데스크톱 `STAGE_SIZES` 40vw). 3D 캐러셀(±365px 이동)은 이 폭에 들어가지 않는다.

### 3-3. 재사용 가능한 것
| 재사용 | 방법 |
|---|---|
| `useStageActivity` | 그대로 이동하거나 `components/shared`로 올려 양쪽에서 사용 |
| `data-pos` 위치 계산(distance wrap)과 3D transform 수치 | `homeCarouselMotion` 값을 CSS 변수로 복제. 클래스는 `.wj-` 접두로 새로 작성 |
| 선택 카드만 영상 마운트·pause 규칙, 스와이프/키보드 로직 | 로직을 훅(`useDepthCarousel`)으로 추출 |
| `cardMedia()` 소재 우선순위(검토판 작업물 → 슬롯) | 그대로. 공개판/검토판 규칙 유지 |
| `MEDIA_TAGS`(연출 예시·AI 가상인물 · 연출 예시·1억의 구단주 · 제작 예시) | 프레임 상단 태그에 사용. 마케팅 화면용 'AI 가상 예시' 문구는 새 상수 추가 |
| 웹툰 `ch-kb-read` 세로 읽기 키프레임 | 웹툰 프레임의 세로 스크롤 연출에 응용 |
| `components/guide/webtoon-devices.tsx`의 폰 프레임 마크업 | 참고용. 새 `PlatformFrame`이 대체 |

### 3-4. 소재 현황 (프레임 선택에 영향)
`lib/content-site/example-media.ts` 슬롯 화면비는 16x9(8), 2x3(6), 9x16(12)뿐이다. **4:5와 1:1 원본은 없다.** 인스타 피드 4:5 프레임은 2:3 이미지를 `object-fit: cover`로 잘라 쓰게 되고(약 17% 상하 손실), `focus` 값으로 구도를 보정한다. 실제 mp4는 `public/content-examples/brand-film/brandfilm-motion.mp4`, `public/content-site/brand-motion.mp4`, `public/videos/*.mp4` 정도라 영상 재생 프레임은 일부 서비스만 가능하고 나머지는 poster+켄번스다.

## 4. 플랫폼별 권장 화면비·안전영역

주의: 이 표의 수치는 이 세션에서 공식 문서로 재확인하지 못했다(Meta·YouTube·TikTok 크리에이터 문서는 JS 렌더링 또는 지역별 변경이 잦음). 이미지 디자인 기준이 아니라 **UI 틀의 비율 암시용**이므로 구현 시 공식 도움말로 한 번 더 확인한다.

| 포맷 | 화면비 | 권장 해상도 | 안전영역(콘텐츠를 피할 UI 영역, 대략) | 프레임에서 암시할 구조 |
|---|---|---|---|---|
| 인스타 릴스 | 9:16 | 1080×1920 | 상단 약 14%, 하단 약 35%, 좌우 약 6% | 우측 세로 액션 열, 하단 캡션/계정 줄 |
| 인스타 피드 | 4:5 (1:1, 1.91:1도 허용) | 1080×1350 | 상하 여백 거의 없음, 프로필 그리드는 3:4 크롭 가능성 | 상단 계정 줄, 하단 좋아요·댓글 줄, 캡션 |
| 유튜브 숏츠 | 9:16 | 1080×1920 | 하단 약 20%, 우측 약 12%, 상단 약 10% | 우측 액션 열, 하단 제목·채널 줄 |
| 유튜브 가로 | 16:9 | 1920×1080 (썸네일 1280×720) | 플레이어 컨트롤 하단 막대, 우하단 시간 배지 | 재생 막대, 제목·채널 줄 |
| 틱톡 | 9:16 | 1080×1920 | 하단 약 20~25%, 우측 약 12%, 상단 약 8~10% | 우측 액션 열, 하단 캡션·음원 줄 |
| 페이스북 피드 | 4:5 또는 1:1, 영상 16:9 | 1080×1350 / 1080×1080 | 텍스트 비중 낮추는 게 권장 | 상단 페이지 줄, 하단 반응 줄 |
| 웹툰(세로 스크롤) | 폭 고정, 길이 가변 | 네이버 웹툰 가로 690px 내외, 컷당 세로 약 1280px 이하(플랫폼별 상이) | 컷 경계, 말풍선 가장자리 | 세로 스크롤 영역과 에피소드 헤더 |

AIO 웹툰 자산은 800×1200(2:3) 컷이므로 웹툰 프레임은 이 컷들을 세로로 이어 붙인 스크롤 연출이 적합하다.

폰 프레임 자체(외곽) 권장: 외곽 비율 약 9:19.5, 둥근 모서리 반경은 폭의 약 12%, 상단 다이나믹 아일랜드/노치는 도형 하나로 생략 가능. 16:9 유튜브는 가로 폰 또는 데스크톱 플레이어 카드로 표현한다.

## 5. 서비스 6종 → 프레임 매핑 (제안)
| 서비스 | 프레임 | 소재 |
|---|---|---|
| 웹툰 | 웹툰 세로 스크롤 | 컷 이미지 연속 스크롤 |
| 애니메이션 | 가로 16:9 영상 플레이어 | poster/영상 |
| AI 인플루언서 | 릴스형 9:16 | AI 가상인물 이미지/영상 + 'AI 가상인물 · 연출 예시' |
| 모션그래픽 | 숏폼 9:16 | 영상/poster |
| 브랜드 홍보 영상 | 유튜브형 16:9 | `brandfilm-motion.mp4` |
| SNS 광고 영상 | 인스타 피드 4:5 (또는 숏폼) | 광고 소재, 공개판은 연출 예시 |

## 6. 구현 방식 후보

| 항목 | A. CSS only | B. React 상태 (권장) | C. 영상 재생(화면 녹화형) |
|---|---|---|---|
| 개요 | 서버 컴포넌트+키프레임 루프 | 활성 카드 `useState`+CSS 프레임+활성 카드만 영상 마운트 | 플랫폼 화면 전체를 녹화한 mp4 |
| 상호작용 | 라디오/앵커 해킹 수준, 키보드·스와이프 부실 | 화살표·키보드·스와이프·자동 넘김 모두 가능 | 재생/정지만 |
| JS | 0 | 소량(캐러셀 로직은 이미 존재) | 작음 |
| 용량 | 작음 | 작음(이미지 poster 위주) | 큼(카드 6장×수 MB), 모바일 데이터 부담 |
| 접근성 | 양호(텍스트 DOM) | 양호(DOM 텍스트+aria) | 대체 텍스트뿐, 자막 별도 |
| 렌더 부담 | 키프레임 6세트 동시 실행 위험 | 활성 1장만 애니메이션 | 영상 디코딩, 모바일 배터리 |
| 변경 용이성 | 낮음 | 높음(데이터 주도) | 낮음(재촬영) |
| 허위 UI/수치 통제 | 쉬움 | 쉬움 | 녹화물에 박힘 |

### 권장: B + 모바일 CSS scroll-snap
1. `PlatformFrame` 컴포넌트 1개(props: `platform: "reels" | "shorts" | "tiktok" | "feed45" | "feed11" | "youtube169" | "webtoon"`, `tag`, `children`). 플랫폼별 UI 구조는 `data-platform` CSS로 분기하고 로고는 없다.
2. 데스크톱(≥1024px, motion 허용): `useDepthCarousel`로 3D 캐러셀. 블러는 ±1 카드에만, 가능하면 생략(transform+opacity만).
3. 모바일(<1024px): `scroll-snap-type: x mandatory` 가로 넘김. 3D, blur, 자동 넘김 없음. 한 번에 1.2장 보이게 해 넘길 수 있음을 암시.
4. 활성 카드만 `<video>` 마운트·`play()`, 그 외 poster. 화면 밖·탭 숨김·reduced-motion에서는 정지(`useStageActivity` 재사용).
5. 가상 계정 시뮬레이션(마케팅)은 같은 프레임 컴포넌트를 쓰되 4단계(플랜→운영→데이터→개선)에 맞춰 화면 내용만 바꾼다. 예: 플랜=게시 일정 격자, 운영=피드 카드, 데이터=스켈레톤 막대(숫자 없음), 개선=A/B 두 안. SEO·AEO·GEO는 플랫폼 화면이 아니라 "검색·AI 답변" 중립 패널로 표현하고 구글·ChatGPT 로고도 쓰지 않는다.

성능·모바일 예산(추정치, 구현 후 측정 필요): 프레임 6장 DOM 약 300~400 노드, 동시 애니메이션은 활성 1장으로 제한, 첫 화면 이미지는 `sizes` 지정+lazy, 영상 `preload="none"`(선택 후 `metadata`). 수치 기준은 기존 `VERIFY_R6.md`의 측정 항목과 같은 방식으로 360/390/768/1024/1440 스크린샷에서 확인한다.

## 7. 리스크와 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| 플랫폼 이름·UI 구조 모사가 혼동·제휴로 오인 | 상표·부정경쟁 분쟁 | 로고·브랜드 색·아이콘 금지, 'AI 가상 예시' 상시 표기, 제휴 암시 문구 금지, 시행 전 상표 검토 |
| 허위 성과·팔로워 숫자 | 표시광고법, 신뢰 훼손 | 숫자 자리에 스켈레톤/"—", 실제 고객 수치는 근거 문서가 있을 때만 |
| 실존 계정명 충돌 | 제3자 침해 | `@핸들` 형식 금지. 필요 시 "예시 브랜드" 같은 일반 문구 |
| `lucide-react` 브랜드 아이콘 import | 로고 사용으로 번짐 | 사용 금지 목록과 테스트 |
| 4:5·1:1 원본 부재 | 크롭으로 구도 손실 | `focus` 값 지정, 필요하면 소재 요청서(ASSET_REQUEST)에 4:5 컷 추가 |
| 메인 #work 레이아웃 폭 부족 | 3D 캐러셀이 안 들어감 | 컨텐츠 단계만 풀폭 스테이지 또는 이동량 축소(`--shift` 변수) |
| 토큰 체계 불일치(`--cs-*` vs `.wj`) | 스타일 깨짐 | CSS를 `.wj-` 범위로 새로 작성, 공유 로직만 훅으로 이동 |
| 기존 테스트 | `tests/home-journey.test.mjs`, `tests/new-tab-links.test.mjs`가 `journey-content.tsx`·이전/다음 버튼에 의존 | 구조 변경 시 같이 갱신 |
| 모바일 성능 | 3D+blur+영상 | 모바일 scroll-snap, 블러 제거, 활성 1장 재생 |
| 한글 표기 "인스타그램" | Meta의 "translate" 금지 문구와 충돌 가능 | 라벨은 `Instagram`, 본문은 일반 표기 허용 여부를 법률 검토에서 확인 |

## 8. 사용자에게 확인할 질문 (BRIEF_R7에 포함)
1. 로고는 쓰지 않고 이름 텍스트만 쓰는 안(A)으로 확정해도 되는가.
2. 마케팅 시뮬레이션의 가상 계정 이름 기준(예: "예시 브랜드")과 'AI 가상 예시' 문구 위치(프레임 상단 고정)에 동의하는가.
3. 4:5 인스타 피드용 소재(광고 영상·이미지)를 새로 받을 수 있는가, 기존 2:3 크롭으로 갈 것인가.
4. 모바일은 3D 대신 가로 scroll-snap으로 가도 되는가.
