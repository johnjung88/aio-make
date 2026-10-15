# RESULT R8 WP-A1 (메인 페이지)

상태: 구현 완료, 커밋 안 함. 빌드·화면 검증은 NOT_RUN(검증 담당 몫).

## 변경 파일
- `components/guide/main.jsx`, `components/guide/ux.css`
- `components/home/workflow-journey.tsx`, `workflow-journey.css`
- `components/home/journey-marketing.tsx/.css`, `journey-content.tsx/.css`
- `components/home/journey-dev.tsx`, `journey-dev-compare.tsx`
- `lib/home-journey.ts` (journeyIntro, journeySteps, journeyClosing 삭제, BeforeShot.caption 삭제)
- `lib/home-journey-data.ts` (개발 비교 caption 삭제)
- `tests/home-journey.test.mjs`, `tests/home-marketing-sim.test.mjs`, `tests/platform-frame.test.mjs`
- 건드리지 않음: `lib/content-home.ts`, `components/content-home/*`, `components/content-site/*`, `contentFallbacks`, `components/platform-frame/logos.ts`

## M번호별 처리
- M1 히어로 가운데: `.main-hero-inner` align-items:center, text-align:center. eyebrow justify-content:center, 부제 margin:0 auto, 버튼 행 justify-content:center. PC·모바일 공통.
- M2 분야 제목: `.main-divisions-title` text-align:center.
- M3 HOW WE WORK 머리: `.wj-intro` text-align:center, 마지막 요소 margin-bottom 0.
- M4 부제 삭제: `journeyIntro.lead` 필드와 렌더 삭제.
- M5 레일 확대: 아래 수치.
- M6/M8/M10 리드 교체: 지정 문구 그대로, `\n` 유지.
- M7/M9/M16 단계 머리 가운데: `.wj-step > .wj-eyebrow, .wj-step-title, .wj-lead` text-align:center, 리드 margin-inline:auto, 모바일 점+eyebrow 줄 justify-content:center. 개발·마케팅·컨텐츠 동일. 본문 컴포넌트 정렬은 그대로.
- M11 상담 행 삭제: `.wj-closing`/`.wj-button` 마크업·CSS·`journeyClosing` 삭제.
- M12 상표 고지 2곳 삭제: 렌더·CSS·import 삭제. 마케팅 그리드 `notice` 영역도 제거(rows `auto 1fr`). `PLATFORM_TRADEMARK_NOTICE` 상수는 `logos.ts`와 테스트에서만 남김(화면 사용처 0).
- M13 개발 캡션 삭제: 데이터 caption, `model.caption` 렌더, `.wj-caption` CSS 삭제. 모바일 전환 컨트롤이 없으면 `.wj-cmp-foot` 자체를 그리지 않음.
- M14 OUR STANDARD 가운데: align-items:center, text-align:center, 인용문 margin:0 auto.
- M15 캡션 "기획 · 제작 · 검수 · 인계" 삭제(마크업·CSS).

## 레일 최종 수치
- 폭 `--wj-rail-w`: 1024~1279px 250px, 1280px 이상 280px (본문 열 폭 보호). 열 간격 기존 clamp(40px,5vw,88px).
- 라벨: `clamp(22px, 1.8vw, 26px)` (1440에서 약 25.9px), 600급(`--type-h3-weight` 650), 행간 1.4.
- 번호: 16px, 650.
- 행 세로 패딩 22px, 행 사이 gap 24px, 왼쪽 패딩 32px, 번호-라벨 gap 16px.
- 1440 예상 레일 높이: 행 약 80px x 3 + gap 48px = 약 288px (시안 550px의 절반 이상). 실측은 NOT_RUN.
- 트랙·fill(scaleY 1/3, 2/3, 1)과 sticky 위치(`header + 32px`), 그리드 열 정의는 그대로.
- 구현: `t-nav`/`eyebrow` 역할 클래스를 `.guide-public .guide-page .wj ...`(0,4,0)로 덮어씀. 값은 모두 `var()`라 "journey CSS uses role tokens only" 테스트를 유지.

## 실행한 명령과 결과
- `npm run typecheck`: PASS
- `npm run lint`: 오류 0, 기존 경고 1개(`tests/local-admin.test.mjs`)
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/home-*.test.mjs tests/platform-frame.test.mjs`: 61개 중 pass 61, fail 0
- 테스트 갱신: 좌측 정렬 기준 4건을 중앙으로, 리드 원문표, 부제/캡션 문구 검사를 "없음" 검사로, 상표 고지는 마케팅·컨텐츠 단계에서 "없음" 검사로 교체. 새 테스트 2개 추가(R8 journey 정렬·삭제, 레일 수치).

## NOT_RUN
- `npm run build`, `next dev/start`, 브라우저·스크린샷, 6폭 getBoundingClientRect 측정, 가로 넘침 검사
- 전체 `tests/*.test.mjs` 직렬 실행(내 범위 외 테스트는 WP-A2 변경과 겹쳐 제외)

## 남은 문제 / 확인 요청
- 레일 실측 높이와 1024~1279 구간에서 본문 열 폭(약 650px) 확인 필요. 개발 비교 시안이 좁아지면 1024 구간 레일을 더 줄일 것.
- 단계 리드 두 줄이 360px에서 줄바꿈되는 모습(특히 마케팅 첫 줄 "어느 채널에, 어떻게 보여줄지 계획하고") 화면 확인 필요.
- 컨텐츠 카드 캐러셀은 상표 고지 삭제로 점 표시 아래 여백이 줄었으므로 간격 확인 필요.
- 일부 대상 파일이 CRLF이고 일부가 LF라 편집 시 줄바꿈을 유지했다.
