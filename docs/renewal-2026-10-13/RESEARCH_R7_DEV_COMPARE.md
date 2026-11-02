# R7 조사: 개발 단계 전/후 비교 · 사례 1개 노출 · 상세 모달

작성 2026-10-15 · 조사 전용(코드·빌드·서버·커밋 없음) · 요구 원문 `PROMPT_NEXT_R7.md` 메인 사이트 1)~3) · 스크린샷 `_피드백_R7\img31~33.png` 직접 확인

스크린샷 확인 결과: img31은 칩 3개(DR's Secret 쇼핑몰 · 힐러넷 웹사이트 · 요프리 쇼핑몰)가 한 줄로 동시에 보이는 장면, img32는 개발 단계 lead 2줄이 "…구매로 / 이어지도록…"으로 끊겨 왼쪽 정렬로 나온 장면, img33은 "작업 자세히 보기 ↗ / 서비스 자세히 보기 →" 줄과 그 아래 "웹사이트 제작 → / 쇼핑몰 제작 →" 줄이다. 마지막 두 줄이 각각 다른 코드에서 나온다는 점이 중요하다(3절).

## 0. 결론 (권장안)

1. 비교 UI: **슬라이더 핸들형**(같은 비율 겹침) + 큰 BEFORE/AFTER 라벨 + 출처 캡션. PC 캡처 쌍과 모바일 캡처 쌍을 `PC | 모바일` 토글로 바꿔 본다(모바일 폭 기본값은 모바일 쌍). 이 방식은 사례 사진을 새로 만들지 않고 기존 캡처 자산만 쓴다.
2. 사례 전환: 칩 3개 대신 **사례 하나의 큰 제목 + 막대형 3분할 인디케이터**(Stories식, 글자 없음) + 헤더 영역 스와이프/방향키. 자동 넘김은 쓰지 않는다.
3. 상세 모달: 새 라이브러리 없이 **네이티브 `<dialog>`**(프로젝트에 이미 3곳이 같은 방식). 모바일은 전체 화면 시트. 설명글은 `/work/[slug]` 페이지가 쓰던 같은 데이터(`WorkItem`)에서 서버가 만든다.
4. **요프리 쇼핑몰은 BEFORE 자료가 없다.** 슬라이더가 불가능하므로 AFTER 단독 프레임으로 둔다(자료를 지어내지 않는다).

## 1. 현재 구현과 자산

### 1-1. 구현 위치

| 항목 | 위치 |
|---|---|
| 개발 단계 본문(탭·패널·프레임·링크·확대 dialog) | `components/home/journey-dev.tsx` (`JourneyDev`, `ProjectPanel`, `ZoomFrame`, `HoldFrame`, `SamplePanel`) |
| 탭 접근성 컴포넌트(개발·컨텐츠 공용) | `components/home/journey-tabs.tsx` (`JourneyTabList`: ←/→/Home/End, 롤링 tabindex) |
| 단계 틀·진입 모션·단계 하단 링크 줄 | `components/home/workflow-journey.tsx` (`LinkRow`, `bodies["journey-dev"]`, `.wj-media` 진입 `data-reveal`) |
| 스타일 | `components/home/workflow-journey.css` (`.wj-tabs` 262행, `.wj-compare` 295행, `.wj-browser*`·`.wj-phone` 319~369행, `.wj-dialog*` 602~629행, 데스크톱 2열 822행) |
| 클라이언트 안전 문구·타입 | `lib/home-journey.ts` (`devCopy`, `devServiceLinks`, `devFallbackTabs`, `devFallbackSteps`, `DevProject`, `BeforeShot`) |
| 고객 데이터(서버 전용) | `lib/home-journey-data.ts` (`devProjects` 3건, `beforeShots` 2건, `selectDevProjects`; 상단 `import "server-only"`, 플래그 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"`일 때만 채워짐) |
| 페이지 연결 | `app/(public)/page.tsx` → `homeJourneyData(entries)` → `MainGuide journey` → `WorkflowJourney data` |
| 원작 데이터 | `content/works/{bwl-store,healernet-website,yofree-shop}.json` → `lib/generated/works.generated.ts` → `lib/work-catalog.ts`(`WorkItem`) |

사용자가 지적한 `div#wj-dev-panel-bwl-store > div.wj-compare.wj-media`는 `ProjectPanel`의 119행이다. 구조는 `figure(BEFORE 또는 HoldFrame) + figure(AFTER)`가 한 컨테이너에 2개 들어가고, 각 figure는 `button.wj-frame-button > .wj-browser(바 28px + 16:10 뷰) + 캡션`이다. 모바일(<1024)은 1열이라 위아래로 쌓이고(594×888의 원인: 프레임 2개 + 캡션 2개), 1024 이상은 `repeat(2, 1fr)`이다. PC 캡처 위에 `.wj-phone`(폭 30%, 데스크톱 24%) 모바일 캡처가 겹친다. 현재 패널 전환은 `hidden` 속성이라 한 번에 패널 1개만 화면에 있지만, 선택용 칩 3개가 항상 보인다.

그 외 현재 동작: `ZoomFrame`을 클릭하면 `dialog.showModal()`로 **이미지만** 확대하고, `onClose`에서 열었던 버튼으로 포커스를 돌린다. 그리고 `ProjectPanel` 하단 `.wj-links`에 `작업 자세히 보기 ↗`(`work.canonicalPath` = `/work/{slug}`)와 `서비스 자세히 보기 →`(`config.serviceHref`)가 있다. img33의 두 번째 줄("웹사이트 제작 →/쇼핑몰 제작 →")은 패널이 아니라 `workflow-journey.tsx`의 `links["journey-dev"] = devServiceLinks`를 그리는 `LinkRow`다. **링크 전부 삭제는 두 곳(패널 `.wj-links` + 단계 `LinkRow`) + 공개판용 `SamplePanel`의 `서비스 자세히 보기` 링크까지 해야 완결된다.** 공개판(플래그 없음)은 `devProjects`가 비어 `SamplePanel`(웹사이트 제작/쇼핑몰 제작 2칩 + 4단계 목록)이 렌더된다.

### 1-2. 이미지 자산 (실제 파일 확인, 위치 `public/reference-review/…`, 전체가 `.gitignore`의 `/public/reference-review/`라 이 PC 로컬에서만 존재)

| 사례 | 역할 | 파일 | 해상도(px, 헤더 직접 판독) | 용량 |
|---|---|---|---|---|
| DR's Secret (`bwl-store`) | BEFORE PC | `bwl-store/before-pc.webp` | 1440×900 | 50,306 B |
| | BEFORE 모바일 | `bwl-store/before-mobile.webp` | 390×844 | 25,600 B |
| | AFTER PC | `bwl-store/hero.webp` | 1440×1000 | 45,726 B |
| | AFTER 모바일 | `bwl-store/mobile.webp` | 390×844 | 26,528 B |
| 힐러넷 (`healernet-website`) | BEFORE PC | `healernet-website/before-pc.webp` | 1440×900 | 90,600 B |
| | BEFORE 모바일 | `healernet-website/before-mobile.webp` | 390×844 | 36,052 B |
| | AFTER PC | `healernet-website/hero.webp` | 1440×900 | 72,534 B |
| | AFTER 모바일 | `healernet-website/mobile.webp` | 390×900 | 28,704 B |
| | AFTER 추가 | `healernet-website/gallery-01.webp` | 1440×900 | 46,556 B |
| 요프리 쇼핑몰 (`yofree-shop`) | BEFORE PC·모바일 | **없음** | - | - |
| | AFTER PC | `yofree-shop/hero.webp` | 1440×900 | 77,642 B |
| | AFTER 모바일 | **없음**(`content/works/yofree-shop.json`에 `mobileSrc` 없음) | - | - |

BEFORE 4개는 `RESULT_P4.md`에 따라 고객 폴더 원본에서 왼쪽 위 기준으로 잘랐다(리터치 없음). 원본 풀페이지 캡처는 고객 폴더에 남아 있다: `I:\AIO_OS\01_WORK\01_에이전시\01_영업관리\03_잠재고객\261010_BWL\00_기존 자료\05_웹사이트_캡처\kr_home_pc.png`(1440×4439), `kr_home_mo.png`(390×7027), `261010_힐러넷\00_기존 자료\08_사이트_캡처\캡처_index_1440_20261010.png`(1440×7094), `캡처_index_390_20261010.png`(390×6528). 이 풀페이지 원본 4개는 긴 스크롤 비교가 필요할 때의 재료다. AFTER 풀페이지는 이 작업트리에 없다.

비교 설계에 영향을 주는 실제 상태(직접 열어 확인):
- **비율 불일치**: BWL AFTER PC만 1440×1000(1.44:1), 나머지 PC는 1440×900(1.6:1). 현재 `.wj-browser-view`는 `aspect-ratio:16/10` + `object-fit:cover; object-position:top`이라 BWL AFTER는 아래 100px이 잘린다. 슬라이더는 두 이미지를 같은 박스에 겹치므로 이 규칙(16:10, 위 기준 크롭)을 그대로 써야 한다. 힐러넷 모바일 AFTER(390×900)도 같은 이유로 844 기준 크롭 필요.
- **BWL AFTER PC 오른쪽 가장자리**: 캡처 우측 약 15px에 브라우저 스크롤바가 찍혀 있다(1425~1440px). 슬라이더 겹침 시 우측이 눈에 띌 수 있어 캡처를 다시 만들거나(새 자산) 우측 크롭(`object-position`/`scale`)을 고려해야 한다. 새로 지어내는 것이 아니라 같은 시연 화면 재캡처이므로 사용자 확인이 필요하다.
- **BWL BEFORE PC**: 아래 쿠키 동의 바와 위 프로모션 바가 원래 사이트 그대로 들어 있다(리터치 금지 규칙 유지). 힐러넷 BEFORE: 우측에 "YoFree / 요프리 한눈에 / FAQ / 구매" 고정 메뉴가 있다.
- **힐러넷 고객 폴더 README**: 사이트 캡처는 "저장된 HTML 기준 렌더링이라 일부 애니메이션 요소가 비어 보일 수 있음"이라고 명시한다(`00_기존 자료\00_README.md` 16행). BEFORE가 "실제 공개 사이트의 화면 그대로"라고 단정하는 주석은 쓰지 않는다. 캡션은 현재처럼 "기존 … 첫 화면 · 2026-10-10 캡처"로 유지한다.
- **요프리의 기존 화면 후보 검토**: 힐러넷 캡처 중 `캡처_shop_1440_20261010.png`(1440×1948)를 열어 보니 헤더·푸터만 있고 본문이 빈 화면이며 "요프리 3" 텍스트 한 줄만 있다. 요프리 쇼핑몰의 BEFORE로 쓸 수 없다(쓰면 오해를 준다). `캡처_product_1440_20261010.png`(1440×5406)는 열어보지 않았고 요프리 제품 소개 페이지로 추정되나 "쇼핑몰의 기존 화면"이라는 근거가 없으므로 사용자 확인 전에는 BEFORE로 쓰지 않는다.

## 2. 전/후 비교 UI 후보

공통 전제: 새 이미지는 만들지 않고 위 캡처 쌍만 쓴다. 그림 안의 번호 주석 문구는 눈으로 확인되는 차이와 `work.scope`(이미 승인된 설명)에서만 가져오고, 성과 수치나 "전환율 상승" 같은 주장은 쓰지 않는다.

### A. 슬라이더 핸들형 (권장)

같은 비율 박스에 BEFORE를 아래, AFTER를 위에 겹치고 `clip-path: inset(0 X% 0 0)`(또는 `inset(0 0 0 X%)`)로 경계를 움직인다. 큰 BEFORE/AFTER 칩을 좌우 상단에 고정한다.
- 장점: 같은 위치의 바뀐 점을 한 장면에서 비교한다(요구 "한눈에 대비"에 가장 직접적). 프레임이 사례당 1개가 되어 지금처럼 2개 쌓이던 세로 길이(594×888)가 크게 줄고, 데스크톱에서는 열 전체 폭(약 800~900px)을 쓸 수 있다. `ZoomFrame`의 `Image` 두 장을 그대로 재사용한다.
- 단점: 구도가 다른 두 시안(예: 힐러넷 DNA 배경 vs 크림 배경)은 경계 양쪽이 전혀 다른 화면이라 "같은 위치 비교"의 효과가 작다. 드래그 제스처가 페이지 스크롤·사례 스와이프·이미지 클릭과 충돌할 수 있다. 요프리에는 BEFORE가 없어 적용 불가.
- 접근성: 핸들은 `role="slider"`, `tabIndex=0`, `aria-valuemin/max/now`, `aria-valuetext="기존 화면 40% · AIO 제작 화면 60%"`. ←/→ 5%, Shift+←/→ 20%, Home/End 0/100%. 키보드 사용자도 같은 비교를 한다. 라벨 대비: 흰 라벨 칩은 밝은 캡처 위에서 읽혀야 하므로 반투명 어두운 칩(`rgb(13 13 18 / .78)` + 흰 글자)으로 고정한다.
- 터치: 핸들 히트 영역 44×44px 이상(WCAG 2.5.5 권장 목표, 2.5.8 최소는 24px). 슬라이더 면에 `touch-action: pan-y`로 세로 스크롤은 살리고 가로 드래그만 가져온다. Pointer Events + `setPointerCapture`로 손가락이 프레임 밖으로 나가도 계속 드래그한다. 탭과 드래그 구분은 이동량 6px 기준(미만이면 상세 모달을 연다).
- 이미지 클릭 요구와의 충돌 처리: 슬라이더 위 이벤트를 "드래그=이동, 탭=모달 열기"로 가른다. 접근성용으로는 프레임 우하단에 눈에 보이는 `자세히 보기` 버튼(`aria-haspopup="dialog"`)을 따로 둔다. 슬라이더 안에 버튼을 감싸는 중첩 인터랙티브 구조는 만들지 않는다(현재 `button.wj-frame-button` 안에 내용물을 넣는 구조를 쓰면 안 됨, 형제 레이어로 분리).
- 어포던스: 진입 시 1회 50%→35%→65%→50% 스윕으로 드래그 가능함을 알린다. `prefers-reduced-motion`이면 스윕을 끄고 정지 상태에서 핸들만 보이게 한다(기존 CSS가 이미 reduce에서 `transition`·`animation`을 끈다).
- 기기 선택: 프레임 아래 `PC | 모바일` 세그먼트(2칸). PC 쌍은 16:10, 모바일 쌍은 `390/844` 폰 비율이며 최대 높이 `min(70svh, 640px)`로 제한하고 가운데에 둔다. `.wj-phone` 겹침 오버레이는 슬라이더 모드에서 쓰지 않는다(경계와 겹쳐 혼란). 모바일 AFTER가 없는 사례(요프리)는 토글 자체를 숨긴다.

### B. 좌우·상하 분할 + 번호 주석

현재 구조의 강화판. 데스크톱 좌우 2칸(같은 16:10), 모바일 위아래 스택. 두 프레임 모서리에 동일 좌표로 ①②③ 핀을 찍고, 아래에 번호별 변경 설명 목록을 둔다.
- 장점: 제스처가 없다. 두 화면을 동시에 완전히 볼 수 있고(인쇄·접근성 우수) 변경 지점을 말로 짚을 수 있다. 번호 핀 목록은 모달 설명과도 이어진다.
- 단점: 폭이 반으로 줄어 글자가 읽히지 않는다(데스크톱 정렬 열 약 800px이면 프레임 한 칸 약 390px, 1440px 캡처가 27% 크기). 모바일 스택은 지금 문제(길이 888px)를 그대로 가진다. 핀 좌표·설명은 사례마다 손으로 써야 하고(새 데이터), 잘못 짚으면 사실 오류가 된다. 시선 대비는 슬라이더보다 약하다.
- 접근성: 핀은 장식(aria-hidden)이고 목록이 본문(`<ol>`). 지금 구조라 가장 안전하다.

### C. 모바일 세로 스택 / BEFORE·AFTER 토글

모바일 한정 대안. 프레임 1개에 `BEFORE | AFTER` 세그먼트(2칸)로 이미지를 교차 전환(크로스페이드)한다. 두 장을 한 위치에서 번갈아 보여 "바뀜"이 가장 선명하고, 슬라이더가 필요한 드래그가 없다.
- 장점: 터치 충돌이 0이다. 폭을 전부 쓴다. 키보드·스크린리더 대응이 단순(버튼 2개, `aria-pressed`).
- 단점: 두 이미지를 동시에 보지 못한다(전환을 기억해야 한다). "한눈에 대비"에는 슬라이더보다 약하다.

### 권장 1안

**A(슬라이더) 기본 + 번호 주석은 모달 안에만(B의 일부) + 모바일은 A를 폰 비율 쌍으로 쓰되, 드래그를 어려워하는 환경을 위해 C의 `BEFORE | AFTER` 세그먼트를 슬라이더 아래에 보조로 둔다.** 이유: 요구가 "비교가 약하다"이고, 지금은 같은 첫 화면을 두 프레임에 나누어 놓은 것뿐이라 경계에서 바로 대비되는 슬라이더가 효과가 크다. 번호 핀을 슬라이더 위에 직접 얹으면 경계와 핀이 겹쳐 복잡해지므로 본문(모달)에 목록으로만 둔다.

레이아웃 명세 초안(검증 에이전트가 `getBoundingClientRect`로 대조할 값):

| 항목 | 360~430 | 768 | 1024~1440 |
|---|---|---|---|
| 슬라이더 프레임 폭 | 컨테이너 100%(약 342~398px) | 컨테이너 100% | 열 100%(약 800~900px) |
| 비율 | 모바일 쌍 390/844(최대 높이 `min(70svh,640px)`, 가운데) 또는 PC 쌍 16/10 | 16/10 | 16/10 |
| BEFORE/AFTER 라벨 | 칩 `t-chip` 14px, 좌/우 상단 8px | 동일 | 16px, 12px |
| 핸들 | 선 2px + 원 44×44 | 동일 | 동일 |
| 캡션(출처) | 프레임 아래 한 줄 `t-small`, 두 줄로 줄바꿈 허용 | 동일 | 동일 |

## 3. 사례 1개만 노출하는 전환 방식

해석: img31처럼 3칩이 동시에 보이는 것을 막고 한 번에 사례 하나만 크게 보이게 하라는 뜻으로 읽었다. 현재도 패널은 이미 1개만 보이므로(`hidden`), 바뀌어야 하는 것은 "선택 장치(칩 3개)"와 "프레임 2개"다. 다른 의도(예: 칩을 그대로 두고 프레임만 1개)일 수 있어 기획안에서 한 줄로 확인할 것을 권한다.

| 후보 | 장점 | 단점 |
|---|---|---|
| 1. 칩/탭 1개 선택 상태(지금 구조 유지, 시각만 정리) | 구현 최소, `JourneyTabList` 접근성 재사용 | 3칩이 계속 보여 "동시 노출" 불만이 해소되지 않는다 |
| 2. 세그먼트 컨트롤(붙은 3칸) | 한 번에 하나 선택이 명확 | 글자가 길어 360px에서 줄바꿈("DR's Secret 쇼핑몰" 등), 여전히 3개 이름이 보인다 |
| 3. 이전/다음 화살표 | 단순 | 요구가 명시적으로 배제 |
| 4. 가로 스와이프(scroll-snap) | 모바일에서 자연스럽다 | 이웃 사례가 가장자리에 비쳐 "1개만 정확히"에 어긋남(peek 제거 시 이동 단서가 없음), 슬라이더 드래그와 충돌 |
| 5. 자동 순환(타이머) | 손이 필요 없다 | 사용자가 읽는 중 바뀜, WCAG 2.2.2(자동 이동 정지 수단) 필요, 모달과 충돌 |
| 6. 스크롤 연동 스테이지 | `/content` 3D 카드와 결이 같다 | 스크롤 길이 증가·가로채기 금지 규칙(BRIEF_P4)과 충돌, 구현·검증 부담이 큼 |

### 권장

**사례 헤더 + 막대형 인디케이터(후보 1+2의 변형)**: 패널 위에 사례 이름을 큰 제목(h3 `t-h3`) 하나로 보이고, 그 위/옆에 글자 없는 3분할 얇은 막대(Stories식, 선택된 칸만 보라)를 둔다. 각 칸은 44px 높이의 클릭 영역을 가진 `button role="tab"`이고 `aria-label="2/3 힐러넷 웹사이트"`, 선택 칸에 `aria-selected`. 즉 "3개 이름이 동시에 보이지 않지만" 사용자는 3개 중 하나로 바로 갈 수 있다. 전환은 헤더·프레임 영역의 가로 스와이프(임계 40px)와 ←/→ 키, 막대 클릭. 슬라이더 드래그와 충돌하지 않도록 **스와이프는 헤더 영역(제목 줄)에서만 인식**하고 프레임 위 가로 드래그는 슬라이더가 가진다. 전환 효과는 250ms 가로 이동+페이드, `prefers-reduced-motion`이면 즉시 교체. 자동 순환은 쓰지 않는다.

구현 메모: `JourneyTabList`는 컨텐츠 단계도 같이 쓴다(`journey-content.tsx`, 단 R7 6)에서 컨텐츠 칩은 삭제 예정). 개발 단계만 새 컴포넌트(예: `CaseSwitcher`)로 분리하고 `journey-tabs.tsx`는 건드리지 않는 편이 파일 소유 충돌을 피한다. 공개판의 `SamplePanel`(웹사이트/쇼핑몰 2개)도 같은 스위처를 쓰되 막대는 2칸이다.

### 검토판 전용 규칙 유지 방법 (공개판 고객명·요프리·YoFree 0건)

- 데이터 경로를 바꾸지 않는다: 사례 라벨·BEFORE/AFTER 캡션·번호 주석·모달 설명은 **모두 `lib/home-journey-data.ts`(server-only, 플래그 `"1"` 조건)에서 `DevProject` 필드로 만들어 props로만 내려준다.** 클라이언트 파일(`journey-dev.tsx`, `home-journey.ts`, CSS)에는 고객명·사례별 문구·`reference-review` 경로를 넣지 않는다. 스위처·슬라이더 라벨(`BEFORE`/`AFTER`/`PC`/`모바일`/`자세히 보기`)은 중립 문구라 `devCopy`에 두어도 된다.
- 요프리 쇼핑몰의 "BEFORE 없음" 표시도 서버가 `before: null`로 주고, 클라이언트는 문구 `devCopy.beforeHold`("기존 화면 자료 확인 중")를 그대로 쓴다(고객명 없음, 현재 `HoldFrame`과 동일). 새 문구가 필요하면 사용자 확인 전에는 이 문구를 유지.
- `DevProject.work`를 통째로 클라이언트에 넘기는 현재 구조(`work: WorkItem` 전체: `id`, `slug`, `canonicalPath`, `brand` 등)는 모달 설명이 필요한 필드(`title`, `productionStatus`, `description`, `purpose`, `scope`, 추가 미디어)만 뽑은 `detail` 객체로 줄이는 것이 안전하다(검토판 RSC 페이로드 축소, 실수 노출 방지).
- 검증: 기존 `tests/home-journey.test.mjs`의 "플래그 꺼짐 3상태(unset·0·true)에서 JSON 전체에 고객명·slug·미디어 경로 0건" 테스트가 새 필드(`detail`, 주석 문구, 캡션)에도 그대로 적용되도록, 새 문자열을 이 grep 대상에 포함한다. 빌드 검증도 R6과 같이 미설정 빌드의 `/` HTML·RSC·`.next/static`에서 `reference-review|BWL|DR's Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-|before-pc|87언니` 0건을 확인한다.

## 4. 이미지 클릭 → 상세 제작 내용 모달

### 4-1. 기존 컴포넌트 현황

공용 모달 컴포넌트는 없다. 대신 **네이티브 `<dialog>` + `showModal()`이 이미 3곳에서 쓰인다**: `components/home/journey-dev.tsx`(`.wj-dialog`, 이미지 확대, `onClose`로 포커스 복귀, 백드롭 클릭 닫기), `components/floating-contact.tsx`(`.faq-dialog`), `components/guide/webtoon-scope.tsx`(`.cut-dialog`). 서드파티 UI 라이브러리는 `package.json`에 없다(의존성: next, react, lucide-react 등). 바디 스크롤 잠금 코드는 어디에도 없다(`dialog[open]` 연동 CSS·JS 0건).

### 4-2. 구현 방식 비교

| 방식 | 포커스 트랩·ESC | 장점 | 단점 |
|---|---|---|---|
| 네이티브 `<dialog>` + `showModal()` (권장) | 문서 나머지가 inert, ESC로 `cancel`→닫힘, 닫히면 `close` 이벤트 | 의존성 0, 프로젝트 관례와 동일, top layer라 z-index 문제 없음, 이미 `.wj-dialog`가 있다 | 스크롤 잠금·포커스 복귀·백드롭 클릭·애니메이션을 직접 처리해야 한다. Tab이 주소창 등 브라우저 UI로 빠질 수 있는데 이는 표준 동작 |
| Radix/Headless UI Dialog | 라이브러리가 처리 | 스크롤 잠금·애니메이션 상태 지원 | 새 의존성 2개 이상, 프로젝트 철학(최소 의존성)과 불일치, 번들 증가 |
| 직접 만든 `div[role=dialog]` | 직접 구현 | 완전 제어 | 포커스 트랩·`inert`·ESC·복귀를 전부 구현해야 하고 가장 오류가 잘 난다 |

**권장: 네이티브 `<dialog>`.** 보완이 필요한 4가지를 명세에 넣는다.
1. 제목 연결: `aria-labelledby`로 모달 안 `h2`를 가리킨다(현재 `aria-label`은 이미지 설명).
2. 첫 포커스: 닫기 버튼에 `autofocus`(상세 글을 읽는 모달이라 첫 포커스를 닫기로 둠). 열었던 버튼으로 복귀는 현재 `onClose`+`opener` ref 방식을 유지한다(드래그 후 탭으로 열린 경우의 `opener`는 프레임의 `자세히 보기` 버튼).
3. 스크롤 잠금: `html:has(dialog[open]) { overflow: hidden; }`(Safari 15.4+, Chrome 105+, Firefox 121+) + 필요하면 열기/닫기에서 `scrollbar-gutter` 보정. 모달 내부는 `overscroll-behavior: contain`.
4. 닫기 방법 3가지: ESC(기본), 닫기 버튼(눈에 보이는 텍스트 `닫기` + 아이콘 `X`, 히트 44px), 백드롭 클릭(현재 `event.target === event.currentTarget`). 선택: Android 뒤로가기 지원은 `history.pushState`/`popstate`가 필요한데 복잡도가 커서 첫 구현에서는 제외하고 기획안에서 선택지로 둔다.

### 4-3. 레이아웃 명세

| 환경 | 크기·형태 | 구성 |
|---|---|---|
| 데스크톱 ≥1024 | `width: min(1120px, 92vw)`, `max-height: 90dvh`, 내부 스크롤, 가운데 | 좌: 큰 비교(슬라이더 재사용, 또는 현재 선택 장면 확대) / 우: `h2` 사례명 + 상태 태그(`productionStatus`) + 설명글(아래 4-4) |
| 태블릿 768~1023 | `width: min(720px, 94vw)` | 위 이미지, 아래 설명글 1열 |
| 모바일 <768 | **전체 화면 시트**: `width:100%; max-width:none; height:100dvh; max-height:none; margin:0; border-radius:0; padding-bottom: env(safe-area-inset-bottom)`. 아래→위 슬라이드 인(`@starting-style` 사용 가능, 미지원 브라우저는 즉시 표시) | 상단 sticky 바(좌: 사례명 일부 또는 빈칸, 우: `닫기` 44px 이상) → 이미지 → 설명. 이미지는 가로 100%, 세로 스와이프는 모달 스크롤이 가진다 |

모바일에서 슬라이더를 모달 안에도 둘지 여부: 모달 안에서는 `BEFORE | AFTER` 세그먼트(방식 C)를 쓰는 것이 스크롤과 드래그 충돌을 피한다(시트가 세로 스크롤 영역이므로).

### 4-4. 상세 설명 콘텐츠 출처

"작업 자세히 보기"는 `/work/{slug}`(`app/(public)/work/[slug]/page.tsx` → `components/work-portfolio.tsx`의 `WorkDetail`)를 가리켰다. 그 페이지가 보여주던 정보와 같은 소스를 쓴다. `content/works/{slug}.json` → `lib/generated/works.generated.ts` → `WorkItem`:

| 모달 영역 | 필드 | 현재 값 요지 |
|---|---|---|
| 제목 | `title` | DR's Secret 쇼핑몰 레퍼런스 / 힐러넷 기업 웹사이트 시안 / 쇼핑몰 고객 시연 |
| 상태 태그 | `productionStatus` | 제작 완료 / 제작 후보 / 제작 후보 |
| 한 줄 소개 | `description` | 정적 쇼핑몰 레퍼런스, 실제 주문·결제 미접수 등 |
| 무엇을 만들었나요 | `purpose` | 브랜드 분위기를 유지하며 제품 탐색·비교 / 회사 소개와 연구 방향을 요프리 제품 소개로 연결 / 브랜드·제품 정보를 구매 동선에 맞춰 정리 |
| 어디까지 작업했나요 | `scope` | 화면 범위와 **한계 문구**(주문·결제 미운영, 최종 배포본 아님, 판매 조건 확정 전) |
| 추가 이미지 | `media[1..]` | 힐러넷만 `gallery-01.webp` 1장, 나머지는 `hero`만 있음 |

주의:
- `scope`의 한계 문구(주문·결제 미운영, 시안, 확정 전)를 모달에서 잘라내지 않는다. 권리 확인(`rightsConfirmed: false`)과 검토판 전용 규칙을 지키는 장치이기도 하다.
- 이 필드는 검토판 서버에서만 만들고(`selectDevProjects`), 공개판에는 존재하지 않는다. 공개판 `SamplePanel`의 모달은 `tab.label`·`tag`(연출 예시)와 `devFallbackSteps` 4단계("기존 화면 점검 → 가이드 적용 → PC·모바일 화면 설계 → 문의·구매 동선 연결")를 설명글로 쓴다. 한두 문장의 새 설명문이 필요하면 카피 승인이 필요하다.
- 사용자 지시 "상세는 설명글에만 기재한다"와 "링크 전부 삭제"에 따라 모달 안에도 `/work/{slug}`·서비스 페이지 링크를 넣지 않는다(`/work` 페이지는 그대로 존재, 검토판 noindex).
- 번호 주석(B안의 일부)을 쓰면 문구는 위 `scope`와 육안 차이에서만 가져온다. 사실이 아닌 성과·수치는 넣지 않는다.

## 5. 구현 시 영향 파일·테스트 (참고)

- 수정 대상 후보: `components/home/journey-dev.tsx`(재작성), `components/home/workflow-journey.css`(`.wj-compare`·`.wj-dialog` 영역), `components/home/workflow-journey.tsx`(`links["journey-dev"]` 비움 → `LinkRow`가 이미 `!links.length`면 렌더하지 않음), `lib/home-journey.ts`(`devServiceLinks`·`devCopy.workLink/serviceLink` 제거, 새 중립 라벨·`DevDetail` 타입), `lib/home-journey-data.ts`(`detail` 생성).
- 영향받는 기존 테스트: `tests/home-journey.test.mjs`(개발 단계 문구·링크·프로젝트 구성 단언, `devProjects`/`beforeShots` 설정 단언), `tests/new-tab-links.test.mjs`(`LinkRow`·`JourneyAnchor` 문자열을 찾는다, `contentLinkProps`는 컨텐츠 단계 링크라 유지), 고객 누수 테스트(위 3절). 변경 후 직렬 `npm test`로 확인한다.
- 빌드·서버는 한 번에 하나(메모리), 3215 미리보기는 새 빌드 전에 내리고 다시 올린다.

## 6. 기획안에서 사용자에게 물을 것

1. 요프리 쇼핑몰: BEFORE 자료가 없는 것을 "AFTER 단독 프레임 + `기존 화면 자료 확인 중`"으로 유지해도 되는가, 아니면 고객 폴더에 따로 있는 기존 요프리 화면을 찾아서 쓸 것인가(힐러넷 `캡처_shop`은 빈 화면이라 사용 불가).
2. BWL AFTER PC 캡처 우측 스크롤바 아티팩트를 재캡처로 없애도 되는가(같은 시연 화면을 새로 찍는 것, 로컬 검토판 전용 자산).
3. 3칩 동시 노출이 불만의 핵심인가(스위처 변경만) 아니면 칩 자체를 없애야 하는가.
4. 모바일 Android 뒤로가기로 모달을 닫는 동작을 넣을 것인가.
