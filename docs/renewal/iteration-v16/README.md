# 분야 메뉴 고정 통일 v16

2026-10-02 KST · Codex 직접 구현·자체 검증

문제: 서비스 상세는 ServiceNavigation으로 고정되지만 홈·목록·상세·문의의 GuideNav는 일반 흐름에 있어 스크롤 시 사라짐
수정: 공통 GuideNav를 전체 사이트 헤더 바로 아래에 sticky 배치
서비스 상세에서는 외부 ServiceNavigation이 두 메뉴 줄을 함께 고정하고 내부 GuideNav는 static 유지
독립 GuideNav는 ResizeObserver로 실제 높이를 측정해 앵커 이동 시 본문 가림 방지
서비스 상세의 기존 두 줄 높이 측정과 충돌하지 않도록 해당 래퍼 안에서는 개별 높이 측정 제외

검증:
- Next production build·타입 검사 성공, 변경 파일 ESLint 오류·경고 0, diff 공백 검사 통과
- Chrome 1440px에서 영상·마케팅·개발 각각 홈/작업 목록/인사이트 목록 9페이지 실제 스크롤 확인
- 메뉴 상단은 전체 헤더 하단 70px와 일치
- Chrome 390px에서 개발 홈/레퍼런스/인사이트/서비스 상세 스크롤 확인: 분야 메뉴 상단 71px 고정
- 상세 두 줄 메뉴: 분야 메뉴 하단125px = 카테고리 시작125px, 전체 메뉴 하단174px
- 상세의 제공 범위 앵커197.6px, 홈 서비스 앵커148.9px로 각각 메뉴 아래 약24px 확보
- 상세에서 홈으로 링크 이동 후 높이103px→54px 갱신 확인
- 실물 휴대전화와 모든 상세·문의 경로를 재검증하지는 않음, 자체 검증이며 독립 검토 아님

로컬 미리보기: http://127.0.0.1:3114/lab/work
작업트리: I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261002-WEBSITE-UX
운영 배포·원격 push 없음
증거: I:/AIO_OS/09_TRANSFER/02_인수인계/WRK-20261002-WEBSITE-UX/v16
