# 웹사이트 문구·정렬 보완 v13

2026-10-02 KST · WRK-20261002-WEBSITE-UX · Codex 직접 구현·자체 검증

## 반영

- 메인 브랜드 영상 위 AIO MAKE·제목·설명 제거, 영상과 공유 메타 설명 유지
- 메인 결과물 소개 제목 가운데 정렬, 하단 설명 삭제
- 메인 문의 소개와 상세 문의 링크 가운데 정렬, 입력 폼 배치 유지
- 회사 소개 BRAND · ALL-IN-ONE 영역과 합리적인 가격 안내 가운데 정렬
- 영상 소개 두 줄 가운데 정렬, 영상 전문가를 AI와 같은 보라색으로 강조
- 영상 Works 웹툰 카드에 웹툰 서비스의 1억의 구단주 이미지 적용, 16:9 카드에 cover 배치
- 영상 홈·문의 제목을 사용자가 지정한 ‘어떤 영상이 필요 하신가요?’로 변경
- WEBTOON SHOWREEL 제목·설명 세 줄 가운데 정렬

## 실제 검증

- Next production build·타입 검사 성공
- 수정 TSX·JSX 6개 파일 ESLint: 오류 0, 기존 불필요 eslint-disable 주석 경고 3
- git diff --check 통과
- Chrome에서 메인·소개·영상·웹툰 서비스의 390/1440/1920px 레이아웃 확인: 가로 넘침 없음, 대상 computed text-align center
- 브랜드 소개 제거·브랜드 영상 URL 유지, 삭제 대상 설명 제거 확인
- AI와 영상 전문가 색상 모두 rgb(169, 155, 255)
- 웹툰 레퍼런스 이미지 로드 및 cover 표시 확인
- 이번 변경은 문구·정렬이며 영상 재생·폼 전송·관리자/API 재검증은 수행하지 않음
- 실물 휴대전화 검증 및 다른 AI 독립 검토 아님

## 상태

- 기반: v12 로컬 커밋 789ecd6d90ad4f734043592d066c476be2f538ce
- 작업트리: I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261002-WEBSITE-UX
- 브랜치: codex/WRK-20261002-WEBSITE-UX
- 로컬 미리보기: http://127.0.0.1:3114/video/services/webtoon
- 운영 배포·원격 push 없음, 운영 v11 상태는 이전 인수인계 기준이며 이번에 외부 운영 상태를 재조회하지 않음
- 관리자·문의 API·GA4·인증·DB 변경 없음
- 화면·검증 로그: I:/AIO_OS/09_TRANSFER/02_인수인계/WRK-20261002-WEBSITE-UX/v13
