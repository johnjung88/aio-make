# AIO 웹사이트 리뉴얼: 메인 범위 복원 + 컨텐츠 모션 재작업 (R5)

## Context
Codex가 이어받은 R4 작업은 미커밋 상태이고 사용자는 결과를 반려했다. 점검 결과는 다음과 같다.
- **메인**: `components/guide/main.jsx`는 3214 기준(`9b3def8`)과 바이트 단위로 같다. 워크플로우 순서는 개발→마케팅→컨텐츠로 맞다. 그러나 Codex가 `lib/home-journey.ts`의 소개·단계·마케팅 패널 문구를 새로 썼다. `workflow-journey.css:911-915`와 `journey-content.tsx`(R2 변경)의 카드 버튼 배치도 3214와 다르다. 컨텐츠 탭 한 줄 설명도 `lib/content-home.ts`가 바뀌면서 함께 달라졌다.
- **컨텐츠 모션**: 사용하는 라이브러리는 없고 CSS와 React state만 쓴다.
  - 홈 3D 캐러셀은 클릭할 때만 움직인다. 웹툰에는 페이지 넘김이 없다.
  - 모션그래픽에는 계속 움직이는 도형이 없다. 브랜드 영상은 자동재생이 없다.
  - 광고 레일과 애니메이션·모션그래픽 장면 전환은 검토판에서만 렌더링된다. 공개판에서는 정적 화면이다.
  - 브라우저 검증은 하지 않았다(NOT_RUN). 테스트는 66개 중 10개가 실패한다.

사용자 결정(2026-10-14):
1. 메인 워크플로우는 3214 원문을 유지하고, 상담·브랜드 가이드 단계만 빼서 순서를 바꾼다.
2. 컨텐츠 홈 캐러셀은 자동 회전하고 조작도 받는다.
3. 공개판 모션은 AIO 자체 생성 이미지에 '연출 예시'를 표기해 채운다. 검토판에서는 실제 레퍼런스를 우선한다. 유료 생성은 하지 않는다. 필요한 이미지와 5초 영상은 사용자가 Higgsfield(나노바나나 프로 2, Wan 3.0)에서 직접 생성해 전달하고, 우리는 작업지시서만 만든다.

운영 규칙(메모리·HANDOFF):
- 구현은 이 대화의 opus 서브에이전트, 검증은 sonnet 서브에이전트 하나가 순차로 맡는다.
- 메인 에이전트는 계획·지시·커밋만 하고 코드를 고치지 않는다.
- push·배포는 하지 않는다. 디자인 게이트는 메인이 혼자 승인하지 않고 사용자에게 보여준다.

작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`

## Step 0. 현재 상태 보존 (메인)
- R4 미커밋 변경 전체를 `wip: codex R4 motion (unverified, rejected)` 커밋으로 남긴다(`git commit -F`). 이후 diff와 되돌림의 기준점이 된다.
- 지시서 `docs/renewal-2026-10-13/BRIEF_R5.md`를 작성한다. 내용은 아래 WP 명세, 결정 1~3, 레퍼런스 수치(`BRIEF_CONTENT_HOME_MOTION_R4.md:11`, `BRIEF_CONTENT_MOTION_R4.md:30-37`, `.qa/design-r4-independent/reference-motion/observed.json`)다.

## Step 1. 병렬 구현 (opus 서브에이전트 4개, 파일 소유 분리, 빌드 금지)

**WP-M 메인 워크플로우** (소유: `lib/home-journey.ts`, `components/home/*`, `tests/home-journey.test.mjs`)
- `lib/home-journey.ts`, `workflow-journey.tsx/.css`, `journey-content.tsx`, `home-services.tsx`를 `9b3def8` 원문으로 되돌린다.
- 최소 변경만 다시 적용한다.
  - 단계 배열을 개발→마케팅→컨텐츠 3개로 바꾸고, 진행바를 3등분한다.
  - 소개 제목과 각 단계 문구는 3214 원문을 쓰고 번호만 01~03으로 바꾼다.
  - 상담·브랜드 가이드의 본문과 패널은 렌더링하지 않는다. 데이터에서 지울지는 원문 보존 원칙에 맞춰 판단한다.
- 컨텐츠 탭 한 줄 설명은 3214 문구를 `home-journey.ts` 안에 고정한다. 그래야 `lib/content-home.ts` 변경의 영향을 받지 않는다.
- 아무 데서도 import하지 않는 `home-hero.tsx/.css`는 제거한다.
- 테스트 계약은 3214 기준을 따른다. 3214에 있는 섹션(OUR STANDARD 등)은 최신 지시인 "3214 복원"에 따라 유지한다.

**WP-H 컨텐츠 홈** (소유: `components/content-home/*`, `lib/content-home.ts`, `tests/content-home.test.mjs`)
- `service-showcase.tsx` 캐러셀을 자동 회전시킨다.
  - 약 3.5초마다 다음 카드로 넘어가고, 레퍼런스 수치(translateX ±365/모바일 212, Z −170/−95, rotateY ±42, scale 1/.88/.72)를 쓴다.
  - 정지 조건: hover, focus, 터치 중, 화면 밖, `document.hidden`.
  - 클릭·스와이프·화살표 키 조작은 유지한다.
  - reduced-motion이면 자동 회전하지 않고 옆 카드를 정적으로 보여준다. 카드를 숨기지 않는다.
- 각 카드 안의 작품도 움직이게 한다. 영상이면 muted 루프로 재생하고, 이미지면 느린 켄번스를 준다.
- 과정 탭은 전환할 때마다 패널이 순차로 들어오게 한다.
- 히어로는 쇼릴 슬롯을 유지하면서 '연출 예시' 이미지 레이어에 패럴랙스와 느린 이동을 준다.
- 쓰이지 않는 `.ch-card` CSS(`content-home.css:266-345`)를 정리한다.

**WP-S1 웹툰·애니메이션·모션그래픽 + 공용** (소유: `components/content-site/services/{webtoon,animation,motion-graphics}/*`, 공용 `motion-runtime.tsx`, `scene-sequence.tsx`, `work-sequence.tsx`, `service-motion.css`, `service-hero.tsx`, `lib/content-site/services/{webtoon,animation,motion-graphics}.ts`, 공용 연출 예시 데이터 `lib/content-site/example-media.ts`(신규), `public/content-examples/`(신규))
- 공개판 대체 소재:
  - `I:/00_AIO_CODEX/2026-10-14/aio-service-pages-v01`과 `new-chat/outputs/aio-content-v01`에서 AIO 생성 이미지만 고른다. `IMAGE_PROMPTS.json`, MANIFEST로 확인한다. 타사 캡처와 로고는 제외한다.
  - 고른 이미지를 `public/content-examples/`에 복사하고 출처 매니페스트를 남긴다.
  - `work-sequence.tsx`는 리뷰 작품이 없으면 예시 소재로 렌더링하고 '연출 예시' 라벨을 붙인다.
- 웹툰:
  - 컷 펼침이 스크롤에 맞춰 진행되게 한다.
  - 12컷 리더에 3D 페이지 넘김을 넣는다(rotateY와 transform-origin, 그림자). 스와이프와 버튼으로 조작한다.
- 애니메이션: 공개판에서도 장면 전환을 보여준다. 깊이 이동과 크로스컷을 쓰고, 데스크톱에서는 스크롤로 진행한다.
- 모션그래픽:
  - 도형이 계속 이동·회전하도록 루프 키프레임을 넣는다(화면 밖에서는 정지).
  - 글자 스태거가 반복되게 한다.
  - 레이아웃 전환 때 도형과 글자가 함께 재배치되게 한다.

**WP-S2 AI 인플루언서·브랜드 영상·광고** (소유: `components/content-site/services/{ai-influencer,brand-film,ad}/*`, 해당 `lib/content-site/services/*.ts`, 서비스별 CSS 파일. 공용 파일은 읽기만 하고, 필요한 변경은 RESULT에 요청으로 남긴다)
- AI 인플루언서: 4개 카드의 3D 회전을 자동으로 진행하고 조작도 받는다. 피드는 카드 전환에 맞춰 순차로 교체한다.
- 브랜드 영상:
  - 프레임 확대는 스크롤 연동을 유지한다.
  - 대체 영상은 muted autoplay 루프로 재생한다(화면 밖에서는 정지).
  - 30초/60초 구조를 바꾸면 타임라인 세그먼트가 다시 배치된다.
- 광고: `ad-reel.tsx:4`의 `if(!enabled)return children`를 바꿔 공개판에서도 예시 소재 레일이 돌게 한다. 기울어진 3열이 18초 왕복한다. 중앙 세로 영상은 고정한다.

공통 수용 기준 (모든 WP):
- 화면 밖이나 탭 숨김 상태에서는 루프를 멈춘다.
- reduced-motion에서도 작품과 설명이 보여야 하고, 수동으로 볼 수 있어야 한다.
- 모바일에서 가로 스와이프가 세로 스크롤을 막지 않아야 한다(`touch-action: pan-y`).
- 문단 설명은 움직이지 않는다.
- 각자 `RESULT_R5_<WP>.md`를 작성하고, 자기 영역 테스트를 직렬로 실행한다.

## Step 1.5 사용자 생성 소재 작업지시 (Step 1과 동시, 문서 담당 서브에이전트 1개)
사용자가 Higgsfield에서 이미지(나노바나나 프로 2)와 5초 영상(Wan 3.0)을 직접 무료로 생성해 전달한다. 그래서 코드는 소재 슬롯을 데이터 한 줄로 바꿀 수 있게 만든다(`lib/content-site/example-media.ts`). 처음에는 기존 AIO 생성 이미지를 임시로 넣는다.
- `docs/renewal-2026-10-13/ASSET_REQUEST_R5.md`를 작성한다. 슬롯 하나가 한 행이다.
  - 사용처(페이지·섹션·슬롯 ID)
  - 종류(이미지 / 5초 영상, 영상은 이미지 → 영상 방식 권장)
  - 비율과 해상도(9:16, 16:9, 4:5 등)
  - 프롬프트(한국어 설명 + 영문 프롬프트), 카메라·움직임 지시
  - 루프 여부, 스타일 일관성 기준(톤·조명·인물)
  - 파일명
  - 우선순위(필수/선택)
- 우선순위가 높은 슬롯:
  - 컨텐츠 홈 캐러셀 카드 6개(서비스별 대표 5초 루프)
  - 광고 레일 세로 영상
  - 애니메이션 장면 3컷
  - 모션그래픽 배경 루프
  - 브랜드 영상 대체 영상
  - AI 인플루언서 카드(87언니 등 자체 AI 인물)
  - 웹툰 컷(자체 IP)
- 전달 폴더: `I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트\_소재_인박스_R5\`(신규). 받으면 구현 에이전트가 `public/content-examples/`로 옮겨 넣고 연결한다. 영상은 웹용으로 압축하고(mp4 H.264, 1MB 안팎) 포스터 이미지를 추출한다.
- 메인 에이전트는 이 작업지시를 대화에 짧게 요약해 사용자에게 전달한다. 공개 화면에는 '연출 예시' 표기를 유지한다.

## Step 2. 검증 (sonnet 서브에이전트 1개, 순차)
1. 타입 검사와 lint, 직렬 테스트(`node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`)를 돌린다. 66개 전부 PASS여야 한다.
2. 격리 스냅샷을 빌드한다. 공개판(OFF)과 검토판(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`)을 각각 빌드해 3217 포트에서 하나씩 띄운다. 3213과 3214는 건드리지 않는다.
3. 메인 검사:
   - 3214와 같은 폭(1440, 390)에서 섹션별 스크린샷을 비교한다. 워크플로우를 뺀 모든 섹션이 같아야 한다.
   - 워크플로우는 3단계 순서와 3214 원문 문구를 확인한다.
4. 컨텐츠 검사:
   - 시간차 프레임(0, 0.3, 0.6, 4초)과 스크롤 프레임을 기록해 아래 항목을 확인한다.
     - 캐러셀 자동 회전과 hover 시 정지
     - 웹툰 페이지 넘김 중간 프레임
     - 애니메이션 장면 전환
     - 모션그래픽 도형 이동
     - 광고 레일 위치 변화
     - AI 카드 전환
     - 브랜드 영상 재생
   - 화면 밖 정지, reduced-motion, 모바일 스와이프와 세로 스크롤 공존도 확인한다.
   - `reference-motion/observed.json`과 레퍼런스 dist를 같은 폭에서 녹화해 항목별 점수로 비교한다.
5. 결과는 `VERIFY_R5.md`에 남긴다. FAIL이면 해당 WP 에이전트에 다시 지시하고 재검증한다.

## Step 2.5 소재 반영
사용자 생성 소재가 도착하면 해당 WP 에이전트가 슬롯을 교체한다. 검증 에이전트는 바뀐 화면만 다시 검증한다. 소재 도착 전이라도 임시 소재로 Step 2를 PASS했다면 1차 미리보기를 먼저 사용자에게 보여줄 수 있다.

## Step 3. 마무리
- PASS 후 커밋하고 `HANDOFF_RESUME.md`를 갱신한다.
- 미리보기(3215, 필요하면 `PHONE_PREVIEW_R3.md` 절차로 휴대폰 링크)를 띄우고 사용자 디자인 확인을 요청한다.
- push, 배포, P6 폴더 정리는 하지 않는다.

## 핵심 파일
- 메인: `lib/home-journey.ts`, `components/home/workflow-journey.tsx`, `workflow-journey.css`, `journey-content.tsx` (기준 `9b3def8`)
- 홈: `components/content-home/service-showcase.tsx`, `process-tabs.tsx`, `content-home.css`
- 서비스: `components/content-site/services/*`, `ad/ad-reel.tsx`, `work-sequence.tsx`, `service-motion.css`
