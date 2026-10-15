# RESULT R7 잔여 수정

2026-10-15 · 대상 HEAD `a8f610e`(R7 재검증 PASS 43 / FAIL 0) 작업트리 · 커밋·push·배포 없음 · 구현 담당(Sonnet high)

VERIFY_R6 5~7장은 옛 HEAD `8a7f677` 기준이다. 이후 `b2ecda9`(웹툰 묶음 칩 정렬, seo-http 기대값)와 R7 구현이 있어 항목마다 현재 코드와 실제 화면(3215 읽기 전용 접속)으로 먼저 확인했다.

## 항목별 결과

| 항목 | 판정 | 내용 |
|---|---|---|
| F-1 웹툰 "함께 제작" 박스 내부 정렬 | 해소됨 | `b2ecda9`와 R7이 묶음 그룹을 보라 외곽 박스 1개로 바꿨다. 칩 없음, 두 칸 모두 `라벨 / 금액` 같은 구조이고 금액이 칸 아래에 붙는다(`pricing.tsx`, `theme.css`의 `.cs-plan-amount { margin-top:auto }`). 테스트 R7-3 통과. |
| R-2 웹툰 가격 박스 최대폭 | 해소됨 | 2칸 그룹 `max-width: 880px`가 이미 적용돼 1440에서 그룹 폭 880(실측). 767px AI 가격 끝칸은 이번 범위 밖. |
| R-3 같은 이미지 연속 노출 | 수정함 | 웹툰: 히어로 표지를 컷 1에서 컷 4(소파에서 경기를 보다 환호하는 장면)로 바꿔 바로 아래 책 리더 첫 장(컷 1)과 다르게 했다. 12컷은 모두 그대로 공개 사용(리더·이어 읽기 목록 변경 없음). 애니메이션: 히어로 이미지(`animation-hero-1`)와 같은 파일을 쓰는 레퍼런스 슬롯(`animation-scene-1`)을 그리드에서 뺐다. 슬롯 정의·`animationReferenceIds`는 그대로이고 렌더만 거른다(남는 칸 2개, 768 이상 2열에 맞음). |
| R-4 홈 워크플로우 박스 안 박스·"연출 예시" | 해소됨 | R7이 홈 마케팅 단계를 시뮬레이션 구조로 다시 만들어 01/02/03 카드+화살표 중첩은 없다. 남은 "연출 예시" 표기는 공개판 소재가 연출 이미지임을 밝히는 필수 표기(COMMON 금지 규칙)라 유지. R7 비교·시뮬레이션 구조는 건드리지 않음. |
| R-9 / N-1 `tests/seo-http.mjs` | 수정함 | (a) `/content/insights/*`는 컨텐츠 사이트 셸에 Organization 스키마만 있으므로 Article·"최종 정리" 기대를 마케팅·개발 인사이트에만 적용하고, 컨텐츠 인사이트는 `cs-site` 셸·Article 없음을 확인한다. (b) `/content` 홈의 `href="/content/insights"`(헤더 링크)는 허용하고 삭제된 `/content/work` 링크만 금지한다. (c) 고객명·`reference-review`·"제안용 시안" 금지 검사는 공개판(`AIO_QA_REFERENCE_REVIEW` 없음)에서만 적용한다(검토판 카드는 고객 작업물을 쓴다). 사이트 동작은 바꾸지 않았다. 공개판 기준 금지 검사는 그대로 유지. |
| R-1 웹툰·애니 히어로 1440 오른쪽 정렬 | 수정함 | 768 이상에서 표지·대표 이미지에 `margin-inline-start:auto`. 1440 실측: 표지가 x 701~1141에서 929~1369(컨테이너 오른쪽 끝)로 이동. 모바일(<768)은 왼쪽 시작 유지(390에서 x 20). |
| R-5 `/content` PROCESS 1440 폭 | 해소됨 | R7이 PROCESS를 4칸 격자로 바꿨고 1440에서 x 56~1369 전체 폭(칸 310, 간격 24)을 쓴다. |
| R-8 다른 서비스 행 패딩 | 수정함 | 행 세로 패딩 12px→8px(<768), 768 이상은 12px 유지. 390 실측: 행 72px × 5, 목록 높이 360(이전 약 390). |

## 변경 파일

- `components/content-site/services/webtoon/landing.tsx` (표지 컷 4)
- `components/content-site/services/webtoon/webtoon.css` (표지 오른쪽 정렬)
- `components/content-site/services/animation/landing.tsx` (히어로와 같은 이미지 슬롯 제외)
- `components/content-site/services/animation/animation.css` (대표 이미지 오른쪽 정렬)
- `components/content-site/theme.css` (다른 서비스 행 패딩)
- `tests/content-site-wpa.test.mjs` (표지 컷·히어로 슬롯 제외 기대값)
- `tests/seo-http.mjs` (낡은 기대값 갱신)
- `docs/renewal-2026-10-13/RESULT_R7_REMAIN.md`(이 문서), `HANDOFF_RESUME.md`(상태 줄 한 줄)

## 실행한 검증

| 검증 | 결과 |
|---|---|
| `npx tsc --noEmit` | PASS(오류 0) |
| `npm run lint` | 오류 0, 기존 경고 1개(`local-admin.test.mjs`) |
| 직렬 테스트 `tests/*.test.mjs` | 189개 중 188 통과 · 0 실패 · 1 skip(기존) |
| `tests/seo-http.mjs` (3215 검토판 빌드 대상, `AIO_QA_REFERENCE_REVIEW=1`) | PASS: 48쪽·내부 링크 157·공유 이미지 4, errors 0. 수정 전 4건 FAIL이던 인사이트 3페이지·홈 링크 기대는 모두 해소 |
| 3215 화면에서 CSS 주입 실측(읽기 전용, 소스 빌드 아님) | 웹툰 1440 표지 오른쪽 끝 정렬, 390 표지 왼쪽 시작, 390 다른 서비스 행 72px·목록 360, 1440 가격 그룹 폭 880, `/content` PROCESS 폭 확인 |
| `seo-http.mjs` 공개판 모드 | NOT_RUN(공개판 빌드를 띄운 서버가 없고 새 빌드는 메모리 사유로 만들지 않음) |
| 새 빌드·전 폭 브라우저 검증(웹툰 컷 4 표지의 실제 렌더, 애니메이션 2칸 그리드, 360/768/1024 정렬) | NOT_RUN(메모리 부족 제약. 3215는 변경 전 소스 빌드라 컷 4 표지·그리드 변경은 화면 확인하지 못함) |

## 미해결·참고

- 다음 빌드 검증에서 확인할 것: 웹툰 `/content/services/webtoon` 히어로 표지(컷 4)와 책 리더 첫 장(컷 1)이 다른지, 애니메이션 레퍼런스가 2칸이고 대표 이미지와 겹치지 않는지, 768~1023에서 오른쪽 정렬 이동이 어색하지 않은지.
- 포트 3213·3214·3215 프로세스와 작업트리 `.next`는 건드리지 않았다. 공개판에 고객명이 새로 노출되는 변경은 없다(검토 게이트 코드 미변경).
