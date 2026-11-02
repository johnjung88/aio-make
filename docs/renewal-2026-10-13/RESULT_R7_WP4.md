# RESULT_R7_WP4 · 컨텐츠 사이트 공통(PROCESS · 푸터 · 가격 박스 · 하단 바)

작성 2026-10-15 · 작업트리 `WRK-20261013-AIO-CONTENT-RENEWAL` · 빌드·서버·커밋·push 없음 · 구현 담당 자체 검증(독립 검토 NOT_RUN)

## 1. 변경 파일

| 파일 | 내용 |
|---|---|
| `components/content-home/process-steps.tsx` | 장면 그림 + 번호·이름 + 확인 문장 한 블록 + 받는 것으로 재작성(서버). 인라인 `style` 없음 |
| `components/content-home/process-run.tsx` (신규) | 진행 모션 시작 신호만 주는 작은 client(IntersectionObserver 1회, reduced-motion이면 완료 상태 정지) |
| `components/content-home/content-home.css` | PROCESS 구간 전체 교체(모바일 머리 줄형, 768 2x2, 1024+ 4열, 읽기 폭 880 제한 해제, 모션은 no-preference 안에서만) |
| `lib/content-home.ts` | PROCESS 카피·`art` 필드만(상담 문장 "채널·일정·가진 자료로 서비스와 분량을 정합니다"). `video:` 줄 미접촉 |
| `components/content-site/shell/footer.tsx` | `cs-footer-intro`, `cs-footer-links--services` 클래스 추가(구조 동일) |
| `components/content-site/shell/mobile-bar.tsx` | 주석만(로직 불변) |
| `components/content-site/blocks/pricing.tsx` | 묶음 그룹 `cs-pricing-group--bundle` 외곽 박스 1개, 알약 배지 삭제, 그룹 제목은 박스 안 1번 |
| `components/content-site/theme.css` | 푸터·하단 바·가격 박스 규칙 교체 |
| `tests/content-home.test.mjs` | 12번(PROCESS) R7 구조로 갱신 |
| `tests/content-site-wpa.test.mjs` | R7-1(푸터) · R7-2(하단 바, 6서비스 대비 계산) · R7-3(가격 박스) 신규 |
| `tests/content-site.test.mjs` | 11-4(배지 0·외곽 박스 1) · 11-8(푸터 767px 이하 가운데 허용) 두 곳만 최소 수정. **WP-5 소유 파일이라 해당 두 블록 외에는 건드리지 않았다. WP-5가 파일 전체를 다시 쓰면 이 두 수정이 사라질 수 있다** |
| `lib/content-site/copy.ts` | 변경 없음(카피 변경 불필요) |

## 2. 인수 기준 확인

실측은 실제 CSS를 그대로 넣은 정적 HTML(Pretendard 로드)을 헤드리스 Chrome으로 6폭에서 측정했다(서버 기동 없음). 하네스는 세션 임시 폴더에만 있고 저장소에는 넣지 않았다. 실제 Next 렌더(next/image, 실제 로고 묶음 높이)와의 차이는 WP-V에서 3215 빌드로 다시 확인해야 한다.

| 기준 | 결과 |
|---|---|
| PROCESS 모바일 4행 합계 ≤ 600 | 360·390 = 493, 430 = 503 (통과) |
| PROCESS 칸 높이 | 768 칸 278(≤300), 1024 칸 298(≤320), 1440 칸 341(≤360) |
| 1440에서 컨테이너 전체 폭 | 컨테이너 1440 = 4열이 전체 폭 사용(읽기 폭 880 제한 해제). 가로 스크롤 0 |
| PROCESS 모션 | 01→04를 1.2초 간격(`--i * 1.2s`)으로 1회 진행, 루프 없음, `prefers-reduced-motion`이면 완료 상태 정지(테스트) |
| 푸터 ≤767 가운데 | 360/390/430에서 로고·소개·헤딩·사업자·법적 줄·저작권 중심 x = 화면 중심(180/195/215) 정확히 일치. 서비스 링크 2열 중심 100·260 / 108·283 / 118·313(화면 중심 대칭) |
| 푸터 ≥768 왼쪽 | `text-align`이 start. 768은 브랜드 / 서비스·연락처 2열, 1024+ 3열 |
| 푸터 글자 | 링크 16px(1024는 15px), 소개 15px, 사업자·법적 줄 14px, 헤딩 13px(실측) |
| 푸터 높이 | 360 = 810(목표 ≤820), 390·430 = 786(≤800), 768 = 700, 1024 = 669, 1440 = 677 |
| 가격 두 금액 y 차이 0px | 6폭 모두 0(360 y 527.5/527.5, 430 508/508, 768 524/524, 1024 535.7/535.7, 1440 578/578) |
| 알약 배지 0 · 외곽 보라 박스 1 | 배지 요소 0, `cs-pricing-group--bundle` 1개. 외곽 `1px solid var(--cs-accent)`, 배경 accent 14% |
| 그룹 간 열 정렬 | 세 그룹 폭 동일, 두 번째 열 시작 x 동일(360: 186, 768: 392), 글자 시작 x 동일(41/55.7/66/81). 2개 플랜 그룹 최대 폭 880 |
| 하단 바 ≥768 `display:none` | 768·1024·1440에서 6서비스 모두 none(실측, 테스트로 768px 이상 미디어에 `.cs-mbar` 규칙 없음 확인) |
| 하단 바 묶음 중심 = 바 중심 ±1px | 360/390/430에서 groupCx = barCx 정확히 일치(6서비스) |
| 하단 바 대비 ≥ 4.5 | 버튼(on-accent/accent) 웹툰 5.86, 애니 8.13, AI 6.31, 모션 7.87, 브랜드 10.89, 광고 6.27. 서비스명(accent-text)은 최저 광고 8.66, 시작가 19.3(실측, 테스트로 6서비스 계산) |
| 하단 바 크기 | 바 높이 64, 버튼 높이 44, 버튼 16px/700, 시작가 18px(430 이상 19px) |

## 3. 테스트

`node --conditions=react-server --experimental-strip-types --test --test-concurrency=1`

- `tests/content-home.test.mjs` 20/20 통과
- `tests/content-site-wpa.test.mjs` 13/13 통과(R7-1·2·3 포함)
- `tests/content-site.test.mjs` 27/27 통과, `tests/new-tab-links.test.mjs` 6/6 통과
- `tests/*.test.mjs` 전체 직렬: 161개 중 160 통과, 실패 0(1개는 기존 skip)

## 4. 설계 판단과 명세 편차

1. **PROCESS 그림 크기**: 명세의 모바일 72×72로는 글 열이 232px로 좁아 4행이 700px을 넘는다. 합계 ≤600 기준을 지키려 그림을 72×45(430px 이상 80×50)로 두고 확인 문장을 머리 줄 아래 전폭으로 놓았다. 768은 5:2, 1024+는 16:10 그림이다.
2. **모바일 진행선**: 세로 진행선 대신 행마다 위쪽 선이 왼쪽에서 오른쪽으로 채워진다(데스크톱 4열에서는 한 줄 진행처럼 읽힌다). 명세의 "번호 원 겹침"은 쓰지 않고 번호는 이름 줄에 둔다.
3. **글자 크기**: 확인 문장은 `cs-t-small`의 변수만 `.ch-step` 안에서 바꿔(15/16/15/16px) 쓴다. 새 글자 역할이나 `font-size` 선언은 추가하지 않았다.
4. **가격 셀 패딩**: 명세의 셀 패딩(12/16/20/24/32) 대신 다른 그룹 플랜 박스와 같은 값(20, 480px 이상 24)으로 두었다. 세 그룹의 글자 시작 x와 열 시작 x가 같아지는 것을 우선했다. 두 금액 y 일치는 `margin-top:auto`(같은 행 아래 정렬)로 보장해 라벨 줄 수와 무관하다.
5. **푸터 서비스 링크 2열**은 ≤1023에서 적용하고 1024+는 세로 1열이다(명세 표와 동일).
6. 하단 바에 `box-sizing: border-box`를 추가했다. 기존에는 border 1px와 safe-area가 높이에 더해져 65px였다.

## 5. 남은 문제 · 인계

- 실제 Next 빌드에서의 확인은 WP-V 몫이다(next/image 렌더, 실제 로고 묶음 높이, 푸터 높이 ±수px).
- `tests/content-site.test.mjs` 두 블록(11-4, 11-8)을 WP-5와 같은 파일에서 수정했다. 병합 시 확인이 필요하다.
- PROCESS 그림이 `webtoon-v11/cut-01~03`을 쓴다(공개 저장소 자체 소재, 사용 결정 범위 안). 공개 빌드 누수 검사 목록에 해당하지 않음을 WP-V가 다시 확인한다.
- 진행 모션의 시작 상태는 JS가 켠 뒤(`data-run="ready"`)에만 만들어지므로, JS가 없거나 모션을 줄이면 항상 완료 상태가 보인다.
