# SPEC R8 W1: 트랙 B 페이지·카드 구현 (Codex)

[Target]
- 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`, 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`, HEAD `03ce0e4` 이후.
- 먼저 읽을 문서(모두 `docs/renewal-2026-10-13/`): `COMMON.md`, `BRIEF_R8.md`(승인본, 사용자가 2026-10-16에 **권장안 전체 승인**), 참조 초안 `DRAFT_R8_COPY.md`, `DRAFT_R8_SERVICES_A.md`, `DRAFT_R8_SERVICES_B.md`, `DRAFT_R8_VIDEO.md`(소재 경로).

[Change]
`BRIEF_R8.md` 3절의 작업 패키지 가운데 영상 렌더(WP-V)와 소리 켜기 UI(WP-V2)를 뺀 나머지를 3절 순서대로 혼자 구현한다.
- WP-B1: 홈 캐러셀 카드.
- WP-B2: CONTACT 바로 위에 서비스 카드 섹션 신설.
- WP-B3a: 1단계로 공통 가격·과정·FAQ 가운데 정렬과 theme.css를 하고, 2단계로 웹툰·애니메이션 페이지를 한다.
- WP-B3b: AI 인플루언서·모션그래픽.
- WP-B3c: 브랜드 홍보·SNS 광고.

각 항목의 기준은 다음과 같다.
- 카피는 승인 체크리스트 권장안과 2절 본문 그대로 쓴다.
- 서비스 히어로의 30초 영상 슬롯은 데이터만 둔다. `src`는 비워 두고, 포스터나 기존 이미지로 대체되게 한다. 실제 mp4 연결은 W2(영상)가 한다.
- 정지 소재(카드 대표 이미지, 컷 보드 이미지 등)는 BRIEF가 지정한 원본에서 ffmpeg로 추출한다. 원본은 읽기만 하고, 결과는 `public/content-examples/<서비스>/`에 webp로 둔다(git 추적). 출처는 `public/content-examples/MANIFEST.json`에 sha256과 함께 추가한다.

[Constraints]
- `git commit`, push, 배포, 패키지 설치, 유료 생성, 외부 터널은 금지한다.
- `public/reference-review/` 원본을 수정하거나 삭제하지 않는다. 고객 폴더(`I:/AIO_OS/01_WORK/...`) 원본도 수정하지 않는다.
- 화면 HTML·alt·메타의 고객명 문자열은 0건이어야 한다: 요프리, YoFree, yofree-, 힐러넷, BWL, DR's Secret, 닥터시크릿, 맥스테크. 영상·이미지 속 로고와 제품은 허용한다.
- `/content/projects/*`의 review 게이트와 noindex는 유지한다.
- 근거 없는 수치·성과는 쓰지 않는다. 가격은 `lib/content-pricing.ts`만 쓴다.
- 이 PC는 메모리가 부족하다. `next build`는 마지막에 한 번만 포그라운드로 돌리고, 작업트리 `.next` 대신 `.qa/r8-w1/src` 스냅샷에서 실행한다(public·node_modules는 junction). 빌드 결과물과 서버는 끝나면 종료한다.
- 3215 포트(PID 14204, 사용자 검토용)는 건드리지 않는다.
- 4단계 카피의 "최종 편집후"는 "최종 편집 후"로 띄어 쓴다(`lib/content-home.ts`와 테스트).

[Ownership]
- 소유 범위: `components/content-home/*`, `components/content-site/**`, `lib/content-home.ts`, `lib/home-journey.ts`의 `contentFallbacks`, `lib/home-journey-data.ts`의 컨텐츠 선택 부분, `lib/content-site/**`, `app/(content-site)/**`, `public/content-examples/**`, 관련 `tests/*`.
- 메인 페이지(`components/guide/*`, `components/home/*`)는 건드리지 않는다.
- `components/content-home/hero-video.tsx`와 `public/content-home/*`는 W2 소유라 건드리지 않는다.

[Acceptance]
- `npm run typecheck`가 통과하고, `npm run lint`는 오류 0이어야 한다.
- 직렬 전체 테스트(`node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`)의 실패가 0이어야 한다. 바뀐 요구에 맞게 테스트를 고치거나 추가한다.
- 스냅샷에서 검토판 빌드(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`)와 공개판 빌드가 모두 exit 0이어야 한다.
- 공개판 응답 HTML과 `.next/static`에 금지 문자열이 0건이어야 한다.
- Playwright로 `/content`와 서비스 6종을 360·390·768·1024·1440 폭에서 확인한다. 가로 스크롤 0, 콘솔 오류 0이어야 하고, 가격·과정·FAQ 가운데 정렬과 서비스 카드 섹션 위치(CONTACT 바로 위)를 `getBoundingClientRect`로 측정한다. 스크린샷은 `.qa/r8-w1/shots/`에 둔다.
- `docs/renewal-2026-10-13/RESULT_R8_W1.md`에 다음을 적는다: 변경 파일, Q번호·WP별 처리, 추출 소재 목록, 명령과 결과, NOT_RUN, 남은 문제. 첫 줄은 `판정: PASS|FAIL` 한 줄 요약이다.
