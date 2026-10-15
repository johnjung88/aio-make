# VERIFY R7 잔여 수정

2026-10-15 · 대상: HEAD `a8f610e` + 미커밋 수정(`RESULT_R7_REMAIN.md`) · 검증 담당(Sonnet high) · 소스 수정 없음

## 환경
- 스냅샷 `.qa/r7-verify/src-remain`(1417파일, public·node_modules는 junction, 작업트리 `.next` 불변). 환경변수 `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, `NODE_OPTIONS=--max-old-space-size=1536`.
- 검토판 빌드(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`): 1차 시도가 타입 검사 단계에서 로그 오류 없이 종료되어(exit 127, 백그라운드 실행) BUILD_ID 없음, 2차 시도도 백그라운드 실행이 중단됨. 3차를 포그라운드로 실행해 exit 0, BUILD_ID `J1s18ECoxopkS_PfMuuFY`. (로그 `build-remain-review-try1.log`·`try2.log`·`build-remain-review.log`)
- 공개판 빌드(플래그 없음): exit 0, BUILD_ID `6ACnaHrihYUpYV442bcl1`.
- 검토판 서버 3215, 공개판 서버 3217. 검증 후 모두 종료, 3213~3217 LISTEN 없음. 검증 시작 시 3215에 있던 이전 서버(PID 13316, 수정 전 빌드)는 종료함.
- 측정 스크립트 `.qa/r7-verify/rem1.cjs`, 결과 `.qa/r7-verify/data-remain/rem1.json`, 스크린샷 `.qa/r7-verify/shots-remain/`.

## 결과

| 항목 | 판정 | 근거 |
|---|---|---|
| (a) 웹툰 히어로 표지 ≠ 리더 첫 장 (390·1440) | PASS | 표지 `/webtoon-v11/cut-04.webp`, 리더 첫 이미지 `cut-01.webp`. 리더 안 표지 위치는 4번째. `shots-remain/webtoon-390-hero.png`, `webtoon-1440-hero.png`, `webtoon-390-reader.png`, `webtoon-1440-reader.png` |
| (b) 애니메이션 히어로 이미지가 그리드에 재등장 안 함 (390·1440) | PASS | 히어로 `animation-character.webp`, 그리드 2칸에 없음(heroInRefs false). 390 1열 350×196.9 2개, 1440 2열 648×364.5 2개(x 56, 736), 그리드 깨짐 없음. `animation-390-refs.png`, `animation-1440-refs.png` |
| (c) 1440 히어로 미디어 오른쪽 정렬 | PASS(수치 차이 메모) | 웹툰 표지 x 944~1384(폭 440), 애니 대표 이미지 x 944~1384. 컨테이너 오른쪽 선(1440−56=1384)과 일치. 명세의 929~1369는 스크롤바 15px을 뺀 기준이며 헤드리스 오버레이 스크롤바라 15px 오른쪽에 측정됨. 모바일 390은 x 20 왼쪽 시작. `webtoon-1440-hero.png` |
| (d) 서비스 6페이지 390 다른 서비스 목록 높이 | PASS | 6페이지 모두 행 72px × 5, 목록 360px, 패딩 8px. `related-<서비스>-390.png` 6장 |
| (e) 8페이지 × 390·767·1440 가로 스크롤 0·콘솔 오류 0 | PASS | 24건 모두 scrollWidth = clientWidth, 오류 0(`Failed to load resource` 제외 필터 적용) |
| 공개판 `tests/seo-http.mjs` | PASS | `AIO_QA_BASE=http://127.0.0.1:3217`, 48쪽, 내부 링크 133, 공유 이미지 4, errors 0. 로그 `.qa/r7-verify/seo-remain-public.log`, 보고서 `data-remain/seo-public.json` |
| 공개판 응답 HTML 금지 문자열(요프리·YoFree·yofree-·힐러넷·BWL·DR's Secret) | PASS | `/`, `/content`, `/content/insights`, 서비스 6개, `/about`, `/contact`, `/marketing`, `/marketing/work` 14쪽 0건(`.qa/r7-verify/pub-remain/`). `.next/static` js·css·html 0건 |

## 남은 NOT_RUN
- 360·768·1024 폭 정렬 검토, 공개판 서비스 페이지의 별도 화면 측정(이전 한계 그대로). 767 폭은 가로 스크롤·콘솔만 확인.
