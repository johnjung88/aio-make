# AIO MAKE 가이드 기준 리뉴얼 검증 v03

2026-10-01 KST · WRK-20261001-WEBSITE-RENEWAL · 담당 Codex

**원본 가이드 기준의 로컬 구현·재검증 완료 후보다. 운영 배포 완료가 아니다.** 이전 v01/v02 기록은 99_보관/2026-10-01_guide-v03에 바이트·SHA-256 manifest로 보존했다. 최신 상세 기록은 [iteration-v03/REPORT.md](iteration-v03/REPORT.md), 화면 판정은 [design-qa.md](../../design-qa.md). 담당 AI 자기 검증이며 독립 AI 검토가 아니다.

## 결과

메인·회사소개·업무 역할·마케팅/개발/영상·14서비스·문의·레퍼런스/인사이트·정책 안내를 연결했다. 원본 구성·서체·색·이미지 배치를 유지하고 가상 실적은 제작 방향 예시로 구분했다. 생성 원본10종 보존/현재6종 사용. /ko·/KO·/en301/UTM 보존, /dev→/lab. 챗봇 HOLD.

로그인→보호 대시보드, 상담 검색/상태/메모/변경 기록, CMS 저장/권리/공개, 이미지 업로드 경로, GA4 서버 조회 코드를 구현했다. 연결이 없으면 수치 ‘—’, 문의 저장503, GA미연결. production 로그인은 영속 DB 보호가 없으면503이며 로컬 dev 시험 로그인과 구분한다.

## 검증

- 최종 build/typecheck/lint PASS, 오류/경고0. 단위·SQL11 PASS.
- 최신 production 공개56페이지·metadata/sitemap·301·미연결 문의/로그인·보호API PASS. 최신 사업 조건4URL PASS.
- 실제 production Next API+새 격리 PGlite PostgreSQL에서 기본9/회귀8동선 PASS. 원자성/중복·상담/메모·CMS권리/공개·쿠키/Origin·rate-limit·GA미연결. 운영 Supabase/Storage 결과는 아니다.
- Windows Chrome 가이드/구현6쌍 같은1385×900에서 직접 비교, 모바일14서비스 실제 화면 확인. 47폭/템플릿 가로 넘침 없음.
- 실제 브라우저 서비스 변경→접수·로그인 창→대시보드→상담 수정·CMS→홈 링크 반영·미연결 오류/임의 수치 미표시 확인. 물리 스마트폰 검증 아님.
- 원본12HTML SHA 일치, 기존 legacy364파일·원본worktree 보존, ignored .env.local 복구. 시험 adapter 종료.

최신 로그: iteration-v03/*-complete-final.log, smoke-production-delivery.log, business-conditions-final.json, production/http-*.json, browser-*.json, responsive-delivery.json. 초기 실패와 제외 캡처는 상세 REPORT/design-qa에 기록했다.

## 운영 연결

GA4 UI에서 계정394051405/속성536780274/스트림14842217461/측정G-7R9P2N40RW·최근 수집 활성을 이전에 확인했다. 서버 Data API·실제 수치/DebugView 대조 미실행. Supabase INACTIVE/Vercel UNAUTHORIZED도 이전 관측이며 현재 연결 성공으로 주장하지 않는다.

Supabase 복구/백업·실제 schema/RLS/RPC·Storage·Advisors, ERP/cron/API와 portfolio URL 이전, Vercel preview/live, 개인정보 운영 조건, 실제 기기/CWV는 남았다. [RELEASE.md](RELEASE.md)의 구체적 전환/롤백 절차로 검증한다. GitHub push/PR·운영 DB/계정/권한 변경·배포·외부 알림 발송 없음.
