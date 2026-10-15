# SPEC R8 W2: 영상 6개 렌더와 소리 켜기 UI (Codex)

[Target]
- 작업 위치: 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`. W1(페이지·카드)이 끝난 상태에서 시작한다.
- 먼저 읽을 문서(`docs/renewal-2026-10-13/` 안):
  - `COMMON.md`
  - `BRIEF_R8.md`: 승인본, 2026-10-16 권장안 전체 승인. 2-3, 2-5, 2-7절과 WP-V, WP-V2를 본다.
  - `DRAFT_R8_VIDEO.md`: 장면표·컷표·소스 경로.
  - `DRAFT_R8_MUSIC.md`
  - `RESULT_R8_W1.md`: 영상 슬롯 데이터 위치를 확인한다.
  - `hero-reel-r7/build.py`, `hero-reel-r7/index.html`: 이 제작 방식을 그대로 쓴다.

[Change]
0. W1 잔여 처리(사용자 측 승인됨): `RESULT_R8_W1.md` '필수 잔여 1건'의 캐러셀 크롭 후보 `.qa/r8-w1/carousel-crop-candidate.css`를 소스에 반영(홈 캐러셀 슬롯 비율 크롭, 모바일 280×320 상하 여백 제거). 최종 빌드·검증에 포함하고 RESULT_R8_W2에 기록.
1. **WP-V 히어로 릴 R8**: 약 68초 16:9 1920×1080이다. 6장면 × 5칸 단계 패널이며, 승인 카피 2-3을 쓴다.
   - 결과물: `docs/renewal-2026-10-13/hero-reel-r8/`(build.py, index.html), `public/content-home/hero-reel-r8.mp4`와 포스터 webp.
   - 용량은 12MB 이하로 맞춘다.
2. **WP-V 서비스 30초 영상 5종**: 대상은 웹툰(2:3), AI 인플루언서(9:16), 모션그래픽(16:9), 브랜드 홍보(16:9), SNS 광고(9:16)다.
   - 결과물: `docs/renewal-2026-10-13/service-reels-r8/<id>/`, `public/content-examples/<id>/service-reel-r8.mp4`와 포스터 webp.
   - 용량은 각 6MB 이하로 맞춘다.
3. **음악**: 추천곡을 쓴다. 파일은 `.qa/r8-music/`에 있다.
   - 히어로: m01 Arpent
   - 웹툰: m02
   - AI 인플루언서: m03
   - 모션그래픽: m04
   - 브랜드 홍보: m05
   - SNS 광고: m06
   - 박자에 맞춰 컷을 마디 단위로 스냅한다. 곡마다 BPM을 직접 다시 확인한다.
   - 루프 지점은 페이드로 처리한다. 음량은 -16 LUFS 근처로 정규화하고 AAC 128k로 넣는다.
   - 쓴 음원 파일 사본은 저장소에 넣지 않는다(mp4에 믹스만).
   - 원본 영상의 오디오는 전부 버린다(`-an`). 성우도 쓰지 않는다.
4. **영상 슬롯 연결**: 홈 히어로는 `lib/content-home.ts`의 히어로 영상 경로를 r8로 바꾼다. 서비스 5종은 W1이 비워 둔 영상 슬롯의 `src`/`poster`에 위 파일을 연결한다.
5. **WP-V2 소리 켜기 UI**: 대상은 `components/content-home/hero-video.tsx`와 서비스 히어로 영상 컴포넌트(W1 결과의 `ReelPlayer` 등)다.
   - 무음 자동재생을 유지한다.
   - '소리 켜기/끄기' 버튼을 넣는다(aria-pressed, 키보드 포커스). 기존 재생/일시정지 버튼과 나란히 둔다.
   - reduced-motion이면 자동재생하지 않는다.
   - 푸터에 자발 크레딧 한 줄을 넣는다: "음악: FreePD(CC0) · Kevin MacLeod 외". 정확한 작곡가 표기는 MUSIC 문서를 따른다.
6. **R7 정리**: `public/content-home/hero-reel-r7.*`는 참조가 없어지면 삭제하지 말고 그대로 둔다. 사용 여부만 RESULT에 적는다.

[Constraints]
- 금지: `git commit`, push, 배포, 패키지 신규 설치, 유료 생성(Higgsfield 등).
- 원본(`I:/AIO_OS/01_WORK/...`, `public/reference-review/`)은 읽기만 한다.
- 화면 자막에 고객명을 넣지 않는다(요프리, 힐러넷, BWL, 닥터시크릿, 맥스테크 등). 영상 속 로고·제품은 허용한다.
- BRIEF에서 제외하기로 한 구간은 넣지 않는다:
  - 진상품 '화장실' 컷 2개
  - 힐러넷 끝카드의 연락처
  - CC BY 크레딧 구간
  - 87언니 효능 단정 자막 편
  - 제조사 원본 영상
- **메모리**: 렌더는 한 번에 영상 하나씩 순서대로 한다. 끝날 때마다 Chrome·Playwright 프로세스를 종료한다. `next build`는 마지막에 `.qa/r8-w2/src` 스냅샷에서 한 번만 포그라운드로 돌린다.
- 3215 포트(PID 14204)는 건드리지 않는다.

[Ownership]
- `docs/renewal-2026-10-13/hero-reel-r8/**`, `docs/renewal-2026-10-13/service-reels-r8/**`
- `public/content-home/**`, `public/content-examples/*/service-reel-r8.*`
- `components/content-home/hero-video.tsx`, 서비스 히어로 영상 컴포넌트, 영상 슬롯 데이터 줄, 푸터 크레딧 줄
- 관련 `tests/*`

[Acceptance]
- ffprobe로 6개 영상의 길이·해상도·오디오 트랙(AAC)·용량 목표를 확인한다. 라우드니스는 loudnorm 측정값을 기록한다.
- 각 영상에서 5장 이상 프레임을 추출해(`.qa/r8-w2/frames/`) 직접 보고 확인한다:
  - 자막에 고객명 0
  - 제외 구간 0
  - 글자 잘림 0
  - 360px 폭에서 읽을 수 있는 글자 크기
- 품질 기준은 고급 몰입형이다. 정지 이미지를 단순 나열하지 않는다.
- `npm run typecheck`, `npm run lint`(오류 0), 직렬 전체 테스트 실패 0.
- 스냅샷에서 검토판·공개판 빌드 exit 0, 공개판 금지 문자열 0건.
- Playwright로 홈과 서비스 5종에서 영상이 재생되는지, 소리 켜기 토글이 `muted=false`가 되는지, reduced-motion에서 자동재생이 없는지 확인한다.
- `docs/renewal-2026-10-13/RESULT_R8_W2.md`의 첫 줄에 `판정: PASS|FAIL`을 쓴다. 이어서 영상별 사양 표, 음원·크레딧, 명령과 결과, NOT_RUN을 적는다.
