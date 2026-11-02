# RESULT_R7_WP2 · 마케팅 단계 플랫폼 시뮬레이션 (BRIEF_R7 §2-3·§2-4)

작업 2026-10-15 · 구현 담당 WP-2 · 빌드·서버·커밋·push 없음 · 화면 육안·실측 검증 없음(WP-V 몫) · 독립 검수 NOT_RUN

## 가상 브랜드 이름 확인 (웹 검색)

| 후보 | 검색 | 결과 |
|---|---|---|
| 하루결 (`@harugyeol.daily`) | "하루결 스킨케어 브랜드", "하루결 화장품 OR 크림 OR 쇼핑몰 harugyeol", "harugyeol.daily instagram" | 같은 이름의 스킨케어 브랜드·쇼핑몰은 나오지 않았다. 이름이 비슷한 하루나(HARUNA, 바디케어), 하루하루원더(haruharu wonder)가 있으나 다른 이름이다. 핸들은 검색에서 나오지 않았고, instagram.com 직접 열람은 로그인 벽이라 **존재 여부 UNKNOWN**이다 |
| 모아담·결테라(예비) | 조사 안 함 | 하루결에서 충돌이 없어 넘어가지 않았다 |

확정: **하루결**, 핸들 `@harugyeol.daily`, 이니셜 원형 아바타 "결". 실존 인물 사진·고객 작업물·87언니는 쓰지 않았다. 피드 썸네일은 저장소 자체 소재 3장(`content-examples/ad/ad-product.webp`, `ad-ribbon.webp`, `renewal/shop-products.webp`)이고 사람이 보이는 이미지가 없음을 육안으로 확인했다.

## 변경 파일

| 파일 | 내용 |
|---|---|
| `lib/home-journey-marketing.ts` (신규) | 4단계 카피(제목·하는 일·설명), 장면 8개와 길이(검색 3초·일정 3초·플랫폼 4×1.5초·인사이트 6초·개선 6초 = 24초), 계정 화면별 수치·막대 비율, 상수(카운트업 600ms, 타이핑 90ms, 루프 힌트 800ms), 진행 채움 계산(`stageProgress`). 화면 글자와 숫자는 전부 여기에만 있다 |
| `components/home/journey-marketing.tsx` (신규) | 클라이언트 `JourneyMarketing`: 모바일 4칸 진행 막대, 폰 시뮬레이터(검색 분석·채널 일정·Instagram·YouTube·TikTok·Facebook·인사이트·A/B 8개 장면), 플랫폼 로고 버튼 4개, 단계 목록 4행, 상표 고지 1줄. 문구·숫자 리터럴 0개(테스트로 확인) |
| `components/home/journey-marketing.css` (신규) | 명세표 크기·글자·배치. 폰 안쪽은 폰 폭 단위(cqw)라 폭이 달라도 같은 모양. data 속성 규칙으로 막대 길이·진행 채움을 정해 인라인 style 0 |
| `components/home/workflow-journey.tsx` | `MarketingBody` 삭제, 마케팅 body를 `<JourneyMarketing />`로 연결, `marketingPanel` import 삭제 (WP-1 후 순차 허용 범위) |
| `lib/home-journey.ts` | `marketingPanel` 삭제 (허용 범위) |
| `tests/home-marketing-sim.test.mjs` (신규) | 14건 |

WP-0의 `PlatformLogoMark`·`logos.ts`(`getPlatformLogo`, `PLATFORM_TRADEMARK_NOTICE`)를 그대로 썼다. 로고 파일·`PlatformFrame`은 수정하지 않았다.

## 인수 기준별 확인

| 기준 | 확인 |
|---|---|
| 번호·제목 한 줄(번호 bottom ≤ 제목 bottom, 같은 행) | `.wj-mk-step-head`가 `display:flex; align-items:baseline; gap:8px; margin:0`이고 번호·제목 모두 `margin:0`. 전역 `.eyebrow` 클래스를 쓰지 않음. 번호 14px/650, 제목 20px/650(1440 22px). 실측은 WP-V |
| 화면 수치는 §2-4-3 표 값만 | 테스트가 표의 값을 상수로 대조(팔로워 1.2만·8,240명·2.6만·1,040명, 조회 2.4만·8,930·1.1만·3.1만회·9,870회·1.2만회·5.2만·7,600·1.9만, 인사이트 3.8만·6.1만·1,920·412, 막대 2.6만·2.1만·1.1만·3,200, A/B 9,800·2.3만 등 전부). 컴포넌트에는 한글·숫자 리터럴이 없고 CSS 막대 길이는 데이터의 조회 비율과 같음을 테스트로 확인 |
| 'AI 가상 예시' 문자열 0건 | 새 파일 3개와 테스트로 0건 확인. '연출 예시' 태그도 삭제(구 마케팅 패널과 함께) |
| 상표 고지 1줄 | `PLATFORM_TRADEMARK_NOTICE` 사용 1곳, `.wj-mk-notice` 1개 |
| reduced-motion에서 자동 진행 0회 | `running = active && !reduced && !hover && !focusIn && !held`일 때만 장면 넘김 타이머가 생김. 타이머는 장면 넘김용 1개뿐이며 `reduced`는 기본값 true라 서버·첫 페인트는 정지 상태. 카운트업·타이핑·막대 성장·진행 채움·장면 페이드는 `animate=active && !reduced` 또는 reduce 미디어 쿼리로 모두 끔. 이때 각 장면은 완성 상태로 보임 |
| 동시에 애니메이션하는 화면 1개 | 장면은 `{screen}` 한 곳에서 1개만 렌더(키로 교체, 300ms 페이드). 3D·블러 없음 |
| 50% 이상 보일 때만 진행, 호버·포커스·터치·직접 선택·탭 숨김에서 멈춤 | IntersectionObserver threshold 0.5, `document.hidden`, 마우스 포인터 진입, `:focus-visible` 포커스, 폰 영역 touchstart, 단계·로고·탭 선택 시 hold. hold는 섹션이 화면을 벗어나면 풀림 |
| 가상 브랜드·공식 로고 4종 | Instagram·YouTube·TikTok·Facebook 로고가 단계 장면·일정·막대·버튼에 공식 파일 그대로(16px, 버튼 20px). lucide 브랜드 아이콘·simple-icons 0건 |

## 화면 수치 표 (CSS에 넣은 값, 실측은 WP-V)

| 항목 | 360 | 390 | 430 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|---|
| 폰 외곽(9:19.5) 폭 | 232 | 240 | 248 | 260 | 260 | 300(상한 68svh 비례) |
| 폰 높이(계산) | 503 | 520 | 537 | 563 | 563 | 650 |
| 배치 | 진행 막대 → 폰 → 로고 → 활성 글 | 동일 | 동일 | 2열(목록 1fr / 폰) | 동일 | 동일 |
| 진행 막대 | 4칸, 트랙 4px, 클릭 44px, 칸 간격 6 | 동일 | 동일 | 숨김 | 숨김 | 숨김 |
| 번호 / 제목 | 14/650 · 20/650 | 동일 | 동일 | 동일 | 동일 | 14/650 · 22/650 |
| 설명 | 15/1.7 | 15 | 15 | 15 | 15 | 16 |
| "하는 일" 줄 | 13/600 보라, 활성만 | 동일 | 동일 | 활성 행만 | 동일 | 동일 |
| 행 패딩 | 0(활성 글만) | 0 | 0 | 16 20 | 16 20 | 20 24 |
| 로고 버튼 | 44×44, 간격 8, 로고 20 | 동일 | 동일 | 동일 | 동일 | 동일 |
| 열 간격 | - | - | - | 32 | 40 | 40 |

## 테스트 결과

- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/home-marketing-sim.test.mjs` → 14 pass / 0 fail.
- `tests/home-journey.test.mjs` → 22 pass / 0 fail (카피·누수·CSS 토큰·`marketingPanel` 삭제 영향 없음).
- 추가 확인: `tests/new-tab-links.test.mjs`, `tests/platform-frame.test.mjs` 포함 3개 파일 30 pass / 0 fail.
- `npx tsc --noEmit` 1회 → 오류 0.
- `npx eslint`(신규·수정 파일) → 경고·오류 없음.

## 남은 문제 / UNKNOWN

1. **육안·실측 미실시**(빌드 금지). 폭 6개의 폰 크기, 번호·제목 y 차이, 4행 높이, 모바일 블록 높이, 장면별 글자 넘침, 로고 가독성은 WP-V에서 확인해야 한다.
2. **모바일 블록 높이 예상 약 826~833px**로 360px 목표 ≤820을 조금 넘을 수 있다(설명 3줄·고지 2줄 가정). 넘으면 고지·라벨 간격이나 로고 줄 간격을 줄인다.
3. **상표 고지가 360~430에서 한 줄에 안 들어갈 가능성**이 크다(12px 약 350px 추정, 본문 폭 320~390). 줄바꿈이 되도록 `text-wrap: balance`만 두었다. 한 줄로 고정하려면 글자를 줄이거나 명세를 바꿔야 한다.
4. **고지 위치**: 768 이상에서는 왼쪽 단계 목록 아래(폰 열 옆)에 둔다. 전체 폭 아래로 두면 블록 높이가 ≤640 목표를 넘기 때문이다.
5. **`PlatformFrame`은 쓰지 않고** 같은 비율·베젤의 폰 틀을 자체 CSS로 만들었다. `PlatformFrame`의 장식 막대·액션 열이 프로필·인사이트 같은 DOM 텍스트 화면과 맞지 않아서다. 로고는 WP-0 `PlatformLogoMark`를 그대로 사용한다. 화면은 라이트 톤이다(공식 로고가 흰 바탕에서 가장 잘 보임, TikTok 검은 원 로고 포함).
6. **50% 가시 기준**을 위해 `useStageActivity`(threshold .05) 대신 같은 방식의 관찰자를 파일 안에 따로 두었다.
7. **진행 채움 막대**는 CSS 애니메이션이라 호버로 멈추면 해당 장면의 끝 값에 고정되고, 다시 시작하면 그 장면 길이를 처음부터 기다린다(약간의 어긋남).
8. **명세에 없는 최소 보조 문구**를 추가했다: 장면 상단 "분석 / 일정" 탭(검색 분석과 채널 플랜 둘 다 reduced-motion·수동으로 보기 위함), 일정 항목의 형식 글자(릴스·쇼츠·숏폼·피드), "주간 플랜", "게시물 반응" 소제목, 루프 문구 "01 플랜 기획으로". 불필요하면 `lib/home-journey-marketing.ts`에서 지우면 된다.
9. `@harugyeol.daily` 핸들은 실존 여부를 검색으로 확인할 수 없었다(위 표). Instagram 로그인 없이 확인 불가.
10. 모바일은 활성 단계 글만 보이고 나머지 3행은 `display:none`이다(진행 막대 버튼이 이름을 가진다). 360에서 단계 이동은 진행 막대로만 한다.
