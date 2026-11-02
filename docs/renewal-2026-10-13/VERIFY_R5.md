# VERIFY_R5 · R5 독립 검증 결과

2026-10-14 · 독립 검증(소스 미수정, 커밋 없음) · 대상 HEAD `7d60088` · 기준 문서 `BRIEF_R5.md` Step 2

## 0. 판정 요약

**조건부 PASS. 출시 차단 결함은 없고 중간 결함 1건, 경미 결함 6건(그중 1건은 사용자 판단 사항), 참고 1건을 남긴다.**

| 검사 | 판정 | 비고 |
| --- | --- | --- |
| A. tsc·lint·직렬 테스트 | PASS | 115개 중 114 pass, 1 skip, 0 fail |
| B. 공개판 고객 정보 누출 | PASS | client static·프리렌더 HTML·런타임 응답 모두 0건 |
| C. 메인 `/` 3214 대비 | PASS | 워크플로우 외 6개 섹션 HTML 동일, 워크플로우 3단계 확인 |
| D. 모션 시간차 검증 | PASS (주의 2건) | 아래 결함 2, 4 |
| E. 모바일 390 | FAIL (1건) | 영상 카드 위에서 시작한 가로 스와이프가 무시됨(결함 1). 나머지는 PASS |
| F. prefers-reduced-motion | PASS | |
| G. 콘솔·네트워크 | PASS | 오류 0, 4xx/5xx 0, 경고만 있음 |
| H. 타이포 | PASS (경미 2건) | 결함 5, 6 |

집계: 8개 검사 중 PASS 6(A, B, C, F, G와 D), 경미한 주의 2개 항목 포함 PASS 1(H), FAIL 1(E, 한 항목). 결함 번호는 4절.

## 1. 검증 환경과 방법

- 스냅샷: `.qa/r5-verify/src`(HEAD `7d60088`의 추적·미추적 파일 1326개 복사, `public`·`node_modules`는 원본 junction). 목록과 SHA는 `.qa/r5-verify/src-manifest.json`. 실제 작업트리의 `.next`는 건드리지 않았다.
- 환경: `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, `NODE_OPTIONS=--max-old-space-size=1536`. 빌드와 서버는 한 번에 하나만 실행했다.
- 공개판: 플래그 미설정, BUILD_ID `UcGq7Ng2i3eR4aNM7USEF`, 포트 3217. 검사 후 종료하고 `.next`를 `.next-public`으로 보존했다.
- 검토판: `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`, BUILD_ID `o_RFav1OurK1oFL1-z7-c`, 포트 3218. 검사 후 종료했다.
- 브라우저: 시스템 Chrome + playwright-core(헤드리스). 폭 1440×900, 390×844(touch·mobile 에뮬레이션). 모바일 스와이프는 CDP `Input.dispatchTouchEvent`로 보내 실제 `touch-action`이 적용되게 했다.
- 시간차: 자연 재생을 폴링한 값과, Web Animations API로 전환을 멈추고 `currentTime`을 0/300/600ms로 고정한 값을 함께 기록했다. 탭 숨김은 `document.hidden` 재정의와 `visibilitychange` 발생으로 에뮬레이션했다(실제 탭 전환은 아님).
- 스크립트: `.qa/r5-verify/*.cjs`(`recon`, `maincmp`, `wf`, `m-home`, `m-home2`, `m-webtoon`, `m-scene`, `m-mg`, `m-ai`, `m-film`, `m-ad`, `m-reduced`, `montage`). 결과 JSON은 같은 폴더의 `*-pub.json`, `*-rev.json`.

## 2. 검사별 결과와 증거

### A. 타입·lint·테스트 — PASS
- `tsc --noEmit`(스냅샷, `--incremental false`): 오류 0. 로그 `.qa/r5-verify/tsc.log`.
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`: tests 115, pass 114, fail 0, skipped 1(로컬 파생본이 릴리스 체크아웃에 없어 skip, 기존과 동일), 약 25.7초. 로그 `tests.log`.
- eslint(components·lib·app·tests): 오류 0, 경고 1(`tests/local-admin.test.mjs:110` 미사용 변수, R5 변경 아님). 로그 `lint.log`.

### B. 공개판 누출 — PASS
- 검색 문자열은 `tests/content-site-wps1.test.mjs` S1-1/S1-2와 같다(`reference-review|BWL|DR's Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-`).
- `.next/static`: 텍스트 일치 0건(글꼴 woff2 바이너리 한 개가 대소문자 무시 검색에 걸린 것이며 의미 없음).
- 프리렌더 HTML 13개(`.next/server/app/**/*.html`)와 RSC 페이로드: 0건.
- 런타임 응답: 메인, 컨텐츠 홈, 문의, 인사이트, 서비스 6종, about, contact를 HTML과 `RSC: 1` 헤더로 각각 받아 확인했다. 전부 0건. 같은 검사를 3214(검토판)에 하면 `reference-review` 182건 등이 나와 검사식이 유효함을 확인했다.
- 고객 작품 상세 `/content/projects/bwl-aqua-ad`, `/work/bwl-aqua-ad`, `/content/projects/yofree-night-motion`, `/reference-review`는 모두 404.
- 참고(결함 아님): 서버 번들 `.next/server/app/(content-site)/content/services/[service]/page.js`와 `.next/server/chunks/5040.js`에는 검토 분기 코드와 고객 slug가 남아 있다. 브라우저로 전달되지 않는 서버 전용 코드이며 S1-1 설계와 같다.

### C. 메인 `/` 3214 비교 — PASS
- 3214는 검토판이라 공개판과는 워크플로우 패널의 고객 작품 부분이 당연히 다르다. 그래서 공개판(3217)과 검토판(3218) 둘 다 3214와 비교했다. 결과 `main-compare-pub.json`, `main-compare-rev.json`.
- 최상위 섹션 7개씩. 섹션 0(히어로), 1, 2(분야 선택), 4(OUR STANDARD), 5(FAQ), 6(문의): outerHTML과 텍스트가 3214와 같다. 정규화는 `_next` 해시와 `useId` 값만 지웠다.
- 픽셀 비교(고정 헤더 제거): 섹션 0·1·2는 두 폭 모두 차이 0%. 섹션 4·5·6은 워크플로우 높이가 달라 소수점 위치가 바뀌면서 글자 가장자리 안티앨리어싱만 달라진다(검토판 기준 1440에서 0.35%, 2.31%, 0.50%, 390에서 모두 0%). 차이 이미지 `shots/diff-pub-main-1440-sec5.png`는 글자 외곽선만 붉다.
- 워크플로우(`#work`, `main-*-sec3-A/B.html`, `wf-pub.json`, `wf-rev.json`):
  - 단계 3개, 순서 개발 → 마케팅 → 컨텐츠. 레일 `01개발|02마케팅|03컨텐츠`, 두 폭 동일. 상담·브랜드 가이드 단계와 패널은 DOM에 없다.
  - 3214 원문과 단계별 비교: 개발·컨텐츠·마케팅 세 패널의 본문 텍스트가 3214와 동일하고, HTML 차이는 런타임 속성 `data-current` 뿐이다(검토판 기준).
  - 진행바: 1440에서 높이 66/133/199px(트랙 199px)로 3등분. 3214는 67/135/202/270/337(트랙 337px)로 5등분. 390은 레일이 숨겨져 있어 3214도 0이다.
  - `/content` 링크 7개(서비스 6 + 전체 보기 1) 모두 `target="_blank" rel="noopener noreferrer"`이고 `(새 탭에서 열림)` 안내가 있다. 클릭 시 새 탭이 열렸다.
- 참고: 소개 제목은 3214 원문 그대로 "상담부터 성과까지 하나로 이어집니다"라서 첫 단계가 개발이다. 지시(원문 유지)대로이지만 문구가 단계와 어긋난다(결함 7, 사용자 판단 사항).

### D. 모션 — PASS (공개판·검토판 모두, 두 폭)

**/content 홈** (`m-home-pub.json`, `m-home-rev.json`, 화면 `shots/*-home-*`)
- 캐러셀 자동 넘김 간격: 공개판 1440에서 3498, 3560, 3561ms, 390에서 3490, 3561ms. 검토판은 영상 카드가 있어 5274, 5209ms(CSS 영상 체류 5.2초 `content-home.css:465`, 의도된 값).
- 전환 중 값(1440): 가운데로 오는 카드의 `translateX 365→0`, `translateZ −170→0`, `rotateY −42°→0`, `scale .88→1`. 109ms에 tx 179, tz −83, rotY −20.6°, 309ms에 tx 31, rotY −3.6°, 약 600ms에 정지. 390은 translateX 212, translateZ −95. 레퍼런스 수치(±365/212, −170/−95, ±42°, 1/.88/.72)와 일치한다.
- 정지: hover 8초 동안 인덱스 불변(막대 `animation-play-state: paused`, 막대 값 0.790 고정), 마우스를 빼고 5.2초 뒤 이동 재개. 화면 밖에서 8초, `document.hidden` 에뮬레이션 8초 모두 인덱스 불변이고 복귀하면 재개.
- 카드 소재: 공개판은 켄번스(`cs-ch-kb` 7초, scale 1.003→1.025 관측). 공개판 카드에는 영상 슬롯이 아직 없다(영상 소재 도착 전). 검토판은 muted 루프 영상이 재생된다(currentTime 0.80→2.61).
- 과정 탭 4개: 전환마다 장면이 다시 마운트된다. 탭 2(1440) 300ms 시점 opacity 0.93/0.81/0.58/0.33, 600ms 시점 1/0.97/0.90/0.75로 순차 진입. 탭 3은 화면 .77, 트랙 .05로 시작, 탭 4는 파일 .87/.63/.32. 탭 1은 delay 0.35/0.47/0.59s의 선 진입(클릭 동작 지연으로 첫 측정이 이미 시작 후라 opacity는 1).
- 히어로: 패럴랙스 스크롤 0/150/300/500에서 ty 0/6.3/12.5/20.9(1440). 드리프트 16초 루프로 0, 4초에 tx −8.3→−3.1.

**웹툰** (`m-webtoon-pub.json`, `-rev.json`)
- 히어로 부채: 컷별 `cs-float` 5.6/6.4/7.2초, 시간 경과에 따라 translate 값 변화 확인. 스크롤 0→400에서 부채 각도 ±9°→±12°.
- 컷 펼침: sticky 고정 구간 2070px(1440, 230vh), 1604px(390, 190vh). `--cs-pin-progress`가 0→1.0, p=0.5에서 컷 1·2·4·5가 순서대로 이동(1440: −469/−216/0/108/108px, rotY 32/14.7/0/−7.4/−7.3°, tz 0/10/−34/−125/−200). 390은 rotY 없이 x·z 이동.
- 12컷 3D 페이지 넘김 중간 프레임(WAAPI 고정): 0ms rotY 0°, 300ms −30.5°(scale .86), 600ms −154°, 900ms −180°. `perspective 2200px`, `transform-origin` 책등(왼쪽), 앞면 `backface-visibility: hidden`. 그림자 애니메이션 `cs-svc-webtoon-sweep`·`cs-svc-webtoon-cast` 동반. 자연 재생 rAF 시계열도 같은 곡선. 화면 `shots/pub-webtoon-1440-flip-t300.png` 등.
- 12컷 전체 도달: 다음 버튼 11회로 01/12 → 12/12, 컷마다 `/webtoon-v11/cut-01..12.webp`가 모두 로드(naturalWidth 440 또는 312). 마지막에서 다음 버튼 비활성, 이전 버튼으로 11/12, End/Home 키 12/12·01/12 동작. 공개판·검토판 동일.

**애니메이션** (`m-scene-pub-animation.json` 등)
- 1440: 고정 구간 2430px(270vh). 선택 장면이 진행도 0.33과 0.67 경계에서 바뀐다(0.30에서 0번, 0.36에서 1번, 0.70에서 2번). 전환 중간(WAAPI 300ms): 나가는 장면 tz −266, rotY 11.7°, scale .837, opacity .2, clip `inset(0 17.5% 0 0)`, 들어오는 장면 tz +30, scale 1.02, opacity .8, clip `inset(0 0 0 82.5%)`. 600ms에는 −315/14.2°/.806 과 +2.9/1.002.
- 390: 자동 순환 간격 3394, 3399, 3372ms(CYCLE 3400). 화면 밖 8초와 숨김 8초 동안 불변. 가로 스와이프 1→2, 수동 선택 뒤 5초간 순환 정지, 세로 스와이프로 스크롤 2554→2896.
- 공개판 히어로: 켄번스 14초, 링 8초, 점프 2.6초 애니메이션이 실행 중이다.

**모션그래픽** (`m-mg-pub.json`, `m-scene-pub-motion-graphics.json`)
- 도형 6개가 쉬는 상태에서 계속 이동(1440 원판 673,358 → 666,366, 막대 478 → 512px). 루프 9/7/5/3.2/2.4/12초.
- 글자 스태거: 지연 0/.07/.22/.29s, 5.4초 루프.
- 배치 버튼 3개(44px 높이): 클릭하면 도형과 글자가 함께 재배치(1440 모드 1→2 클릭 후 306ms: 링 114,334→388,147, 글자 y 94→73), 글자 키프레임 이름이 a/b/c로 바뀌어 진입이 다시 시작. 자동 넘김 4227, 4216ms(390은 4215, 4141ms). 버튼을 누르면 자동 넘김이 멈춘다. 화면 밖에서 도형이 `paused`로 고정된다.
- 장면 전환 3개는 애니메이션과 같은 방식으로 동작(세로 와이프, 깊이 이동, 모바일 3.4초 자동 순환 3412, 3386, 3415ms).

**AI 인플루언서** (`m-ai-pub.json`, `m-ai-rev.json`)
- 카드 4장 자동 회전 간격 4035, 3966, 4031ms(390은 4115, 3891, 3993ms). 정면 카드 0px, 옆 카드 ±150px·tz −170·rotY ∓42°·scale .654(모바일 ±104px, tz −95, 38°). 전환 중 값 155ms에 −86/−106/24°, 321ms에 −131/−151/36.8°.
- 피드 3컷이 카드 전환마다 순차 진입: 300ms에 opacity .49/0/0, 600ms에 .96/.87/.60, 이후 1/1/1.
- hover 9초 정지(불변), 마우스를 빼면 재개. 화면 밖과 숨김 탭에서 정지.
- 계정 소개 피드: 탭 전환 시 썸네일 지연 .38/.5/.62s 순차 진입, 큰 화면은 3622, 3576ms마다 와이프 전환. 390에서는 화면에 보일 때만 진행(보이기 전에는 정지 상태로 opacity 0이며 보이면 재생).

**브랜드 홍보 영상** (`m-film-pub.json`, `-rev.json`)
- 스크롤 프레임 확대(1440): scale .941→.950→.959→.972→.985→1.0, 모서리 20.7→0px(스크롤 0~700). 390은 .984→1.0, 0.7→0px(결함 2).
- 공개판 메인 영상: 보일 때만 재생. 화면 밖에서 currentTime 고정(0.60 → 0.60), 숨김 탭에서 정지, 되돌아오면 재생 재개, 사용자가 정지하면 다시 눌러야 재생(스크롤로 복귀해도 유지). muted, loop, `autoplay` 속성 없음.
- 30초/60초 전환: 세그먼트 너비 426px×3 → 253px×5로 재배치(1440, 0ms 234 → 316ms 224/158/127/127/148 → 4초 253). 진입 애니메이션 seg-a/seg-b가 전환마다 다시 시작(300ms에 opacity .63/.29/0). 재생 헤드 x 404→501→600→699→796px(900ms 간격).
- 검토판은 히어로가 `WorkPreview`(실제 영상, 네이티브 컨트롤)이며 같은 정지 규칙을 따른다.

**SNS 광고** (`m-ad-pub.json`)
- 공개판에서 3열 레일 렌더. 무대 `rotate(−11deg)`. 열별 `cs-svc-ad-rail-up`/`down`/`up` 18초 alternate, 지연 0/−4.5/−9s. 자연 재생 값: 1열 −10.8→−17.3→−22.6→−64.4px, 2열 −83→−71→−63→−22px, 3열 −113→−121→−126→−140px.
- 왕복 확인(애니메이션 시각을 0~35초로 고정해 읽음): 1열 0 → −18 → −70 → −122 → **−140(18초)** → −122 → −70 → −18 → −0.8(35초). 2열은 반대 위상으로 −122에서 시작해 0(13.5초)까지 갔다 −140(31.5초)로 돌아간다. 390도 같은 모양이고 진폭만 90px.
- 가운데 9:16 화면은 레일이 움직이는 동안 좌표 889,229 크기 300×533이 변하지 않는다(4회 측정 동일).
- 화면 밖과 숨김 탭에서 열이 모두 `paused`로 고정, 되돌아오면 재개. hover로는 멈추지 않는다(구현 노트와 같음).
- 공개판 가운데 소재는 이미지(`ad-center-1` = `ad-product.webp`)이고 영상이 아니다(결함 4).

### E. 모바일 390 — FAIL(결함 1) / 그 외 PASS
- 가로 스크롤: 공개판·검토판 20개 화면(10경로 × 2폭) 모두 `scrollWidth == clientWidth`. 화면 밖으로 튀어나온 요소는 화면 밖에 둔 honeypot 입력뿐이다(`recon-pub.json`, `recon-rev.json`).
- 세로 스크롤과 가로 스와이프 공존(CDP 터치, 세로 스와이프 시작점을 캐러셀 중앙에 둠): 컨텐츠 홈 캐러셀(`touch-action: pan-y`, 스크롤 1336→1601), 웹툰 리더(4609→5021), 애니메이션·모션그래픽 장면(2554→2896, 2106→2351), AI 덱(0→245). 가로 스와이프는 모두 동작(홈 0→1, 웹툰 01→02, 장면 1→2, AI 1→2).
- 예외: 검토판 홈 캐러셀에서 활성 카드가 영상이면 영상 위에서 시작한 가로 스와이프가 무시된다(결함 1). 캡션 영역이나 카드 가장자리에서 시작하면 동작한다(`dbg-swipe-home.cjs`).
- 탭 대상 크기(390): 캐러셀 화살표·일시정지·탭 44px 이상, 과정 탭 전체 폭, 장면 화살표 64×48, 장면 탭 109×77~96, 웹툰 이전/다음 48px, 모션그래픽 구성 버튼 44px, 브랜드 영상 길이 버튼 82×48, 재생 버튼 44×44, AI 계정 탭 167×130. R5 컨트롤 중 44px 미만은 없다. 44px 미만은 기존 헤더의 "상담 신청"(81×36), 폼 체크박스(20px), 브레드크럼과 본문 안 링크이며 R5 변경 범위 밖이다.

### F. reduced-motion — PASS
`m-reduced-pub.json`, `m-reduced-rev.json`, 화면 `shots/*-reduced-*`. 7개 화면 × 2폭.
- 홈: 자동 넘김 표시 `off`, 막대 없음, 8초 뒤에도 인덱스 불변, 옆 카드 opacity .85로 보임, 화살표·탭 클릭으로 이동, 과정 탭 4개 모두 본문 표시, 루프 애니메이션 0개.
- 웹툰: 펼침은 정지 상태로 5컷이 펼친 위치(prog 1)에 있고, 부채 애니메이션 없음, 리더는 버튼으로 01→02→03, 전환 애니메이션 0개.
- 애니메이션·모션그래픽: 고정 구간 없음(min-height 0), 장면 자동 전환 없음, 화살표·탭으로 전환 가능. 모션그래픽 구성 자동 넘김 없음, 버튼으로 전환.
- AI: 덱 자동 회전 없음, 카드 4장 모두 보임(opacity 1/.82/.32/.82), 이름 버튼으로 변경. 계정 피드 자동 넘김 없음, 썸네일로 변경.
- 브랜드 영상: 자동 재생 없음(paused, currentTime 0), 재생 버튼으로 재생(공개판), 30/60초 전환으로 재배치(너비 3칸/5칸). 검토판 `WorkPreview`는 화면이 안정된 상태에서 `play()`가 동작하나 네이티브 컨트롤 클릭은 헤드리스에서 검증하지 못했다(NOT_RUN).
- 광고: 레일 애니메이션 `none`, 가운데 화면 보임.
- 보이지 않는 텍스트: 폼의 `<option>` 요소(크기 0)뿐이며 내용·설명은 모두 보인다. 가로 스크롤 0.

### G. 콘솔·네트워크 — PASS
- 20개 화면 × 2빌드: pageerror·console error 0, 4xx/5xx 응답 0. 없는 자산 404는 없다.
- 요청 실패는 `_rsc` 프리페치와 영상 `ERR_ABORTED`(컨텍스트 종료 시 중단)뿐이다.
- 콘솔 경고: 서비스 6종과 홈에서 "리소스가 preload되었지만 사용되지 않았다"(CSS 청크) 경고가 페이지당 1~4건 나온다. 동작에 영향은 없다(결함 8, 참고).
- 존재하지 않는 경로 `/does-not-exist`, `/content/services/nothing`, `/content/insights/x`는 404.

### H. 타이포 — PASS (경미 2건)
- 제목류 요소의 잘림(자기 overflow와 조상 clip) 0건, 두 폭 모두. 글자 겹침 후보 몇 건이 나왔으나 모두 닫힌 `<details>`(FAQ 답변, 서비스 상세)의 숨은 레이아웃 박스라 실제 겹침이 아니다(`shots/dbg-ov2.png`로 확인).
- 확인한 화면: 첫 화면 몽타주 `shots/pub-montage-first-390.png`, `-1440.png`, `rev-montage-first-*`. 한국어 제목 줄바꿈이 의미 단위이고 잘리지 않는다.
- 경미: 결함 5, 6.

## 3. NOT_RUN
- 레퍼런스 dist와의 항목별 점수 비교(BRIEF Step 2-4 마지막 줄): 이번 지시 범위(A~H)에 없어 실행하지 않았다.
- 실기기·Safari·Firefox 검증, 실제 탭 전환(숨김은 `document.hidden` 재정의로 에뮬레이션), Lighthouse·성능 측정.
- 검토판 브랜드 영상 히어로의 네이티브 재생 컨트롤 클릭(헤드리스에서 오버레이 클릭이 재생을 시작하지 못함. `play()` API는 정상).
- 사용자 생성 소재(Higgsfield 영상·이미지)는 아직 없어 슬롯 교체 후 재검증은 하지 않았다.

## 4. 결함 목록

| 번호 | 심각도 | 화면·폭 | 내용 | 위치 |
| --- | --- | --- | --- | --- |
| 1 | 중 | `/content` 390, 검토판(공개판도 영상 슬롯이 들어오면 동일) | 활성 카드가 영상이면 영상 위에서 시작한 가로 스와이프가 무시된다. 검토판 모션그래픽 카드에서 영상 중앙(195,437) 스와이프 시 인덱스 3→3, 캡션 영역 3→4, 가장자리 4→5. 터치 시작이 `video, a, button` 안이면 `touch.current=null`로 버린다. 폰 미리보기에서 사용자가 먼저 만나는 동작이다 | `components/content-home/service-showcase.tsx:147`. 증거 `.qa/r5-verify/dbg-swipe-home.cjs`, `m-home2-rev.json`(afterRightSwipe 불일치) |
| 2 | 하 | `/content/services/brand-film` 390 | 프레임 확대가 사실상 보이지 않는다. 진행도가 스크롤 0에서 이미 .97이라 scale .984→1.0, 모서리 0.7px→0이다(1440은 .941→1.0, 20.7→0px). 짧은 프레임(197px)이 화면 위쪽에 있고 진행도 식이 `(innerHeight*.78 − top)/(height + innerHeight*.2)`이기 때문 | `components/content-site/services/motion-runtime.tsx:117`, 규칙 `service-motion.css:96`. 증거 `m-film-pub.json` frameGrowth |
| 3 | 하 | `/content/services/ad` 공개판 | 광고 페이지는 장면 전환 묶음이 공개판에서 렌더되지 않는다(`WorkSequence`에 `service`를 넘기지 않음). 지시 점검 목록에는 없으나 애니메이션·모션그래픽과 달리 광고만 정적이다. WP-S1 결과 문서에도 기록된 상태 | `components/content-site/services/ad/landing.tsx`의 `Signature`(`<WorkSequence work={work} portrait labels=.../>`). 증거 `m-scene-pub-ad.json` sceneChapter false |
| 4 | 하 | `/content/services/ad` 공개판 | 지시의 "가운데 영상 고정"과 달리 공개판 가운데 소재가 이미지다(`ad-center-1` = `ad-product.webp`, 켄번스 `cs-svc-ad-screen-drift`). 고정 위치는 맞다. WP-S2 결과 문서는 슬롯이 없으면 `brandfilm-main` 영상으로 대체한다고 적었으나 WP-S1이 이미지 슬롯을 추가해 영상 경로는 쓰이지 않는다. Higgsfield 영상이 오면 해결될 사항 | `lib/content-site/example-media.ts:95`. 증거 `m-ad-pub.json` rest.video null |
| 5 | 하 | 광고 `/content/services/ad` 1440·390 공개판 | 레일 태그가 두 줄로 꺾여 "예시"만 아래로 떨어진다("AI 가상인물 · 연출 / 예시") | `ad.css`의 `.cs-svc-ad-reel-tag`. 증거 `shots/pub-ad-1440-hero-t4000.png`, `pub-ad-390-hero-t4000.png` |
| 6 | 하 | `/content/services/animation` 1440 | 히어로 예시 이미지가 첫 화면 아래로 이어져 `연출 예시` 태그가 접힘선에서 잘려 보인다(제목은 정상) | 레이아웃, `shots/pub-montage-first-1440.png` 세 번째 칸 |
| 7 | 하(결정 필요) | `/` 1440·390 | 워크플로우 소개 제목이 3214 원문 "상담부터 성과까지 하나로 이어집니다"라 첫 단계가 개발인 현재 구성과 문구가 맞지 않는다. 지시상 원문 유지이므로 결함이 아니라 사용자 판단 사항이다 | `lib/home-journey.ts`의 `journeyIntro`. 증거 `main-pub-1440-sec3-B.html` |
| 8 | 참고 | 서비스 6종·홈 | 콘솔 경고 "preloaded using link preload but not used"가 페이지당 1~4건 | Next가 만든 CSS 청크 preload. 동작 영향 없음 |

참고 사항(결함 아님)
- 서버 번들에 고객 slug·검토 분기 코드가 있고(`.next/server/...`), 공개판에서도 `public/reference-review/*` 파일은 URL을 추측하면 200으로 열린다(`/reference-review/bwl-aqua-ad/hero.mp4`). 기존 동작이며 테스트의 "로컬 미디어는 릴리스 체크아웃에서 제외" 전제에 의존한다.
- 작업트리에 검증 중 다른 편집이 있었다(`git status`: `docs/.../ASSET_REQUEST_R5.md` 수정, `ASSET_REQUEST_R5_v1_5sec.md` 신규). 검증자는 소스·문서를 수정하지 않았고 이 두 파일은 검증 범위 밖이다.
- lint 경고 1건(`tests/local-admin.test.mjs:110`)은 R5 이전부터 있던 것이다.

## 5. 보호 확인

- 3213(PID 41252), 3214(PID 41552): 검증 전후 모두 리스닝, 프로세스 변경 없음. 읽기 전용 요청만 보냈다(메인 페이지 비교, 워크플로우 측정, curl).
- 실제 작업트리 `.next/BUILD_ID` = `VyJyJwD8zeEXO5IGPQ7ZO`, 파일 SHA256 `54E8046B7D219AA9042B8AD1723ADA988C7F8AB5E12CDE8D2191176FB227503B`로 검증 전 기준값과 동일.
- 3217, 3218 서버 종료, 헤드리스 Chrome과 `r5-verify` 관련 node 프로세스 0개.
- 소스 수정, 커밋, push 없음. 산출물은 `.qa/r5-verify/`(스냅샷 `src`, 두 빌드의 `.next`·`.next-public` 포함 약 630MB)와 이 문서뿐이다.
