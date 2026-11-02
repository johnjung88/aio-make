# 운영 전환·롤백 — 리뉴얼 v01 후보

현재 상태: 로컬 후보. GitHub push/PR, 운영 DB 적용, GA 권한 변경, Vercel 배포는 실행하지 않았습니다.

## 대상과 남은 연결

|대상|확인 사실|운영 적용 전에 필요한 일|
|---|---|---|
|GitHub johnjung88/aio-make|master 기준 a0e677bf06b4a958dc3129dd4122a08d736026e8, 독립 codex/WRK-20261001-WEBSITE-RENEWAL|최종 diff 검토, Vercel 자동 배포 연결 확인, 승인 후 branch push/PR|
|Supabase rohodabwnabpqkxgxbft / aio-make / Seoul|커넥터 조회 INACTIVE|복구 가능성·과금 영향 확인, 복구 승인, 백업 후 실제 테이블·함수·RLS·Storage 정책 대조|
|GA4 AIO-MAKE|계정 394051405, 속성 536780274, 스트림 14842217461, 측정 G-7R9P2N40RW. UI에서 최근 수집 활성 확인|Google Cloud Data API 활성 및 해당 속성 Viewer 전용 서버 인증. 키는 서버 환경에만 저장. 같은 기간 runReport와 UI 대조|
|Vercel|커넥터 UNAUTHORIZED|재인증 후 실제 프로젝트·도메인·환경변수·region·기존 배포 및 rollback 대상 확인|

GA 웹 수집과 관리자 API 조회는 별도 검증입니다. 코드에 수동 페이지뷰와 저장 성공 뒤 generate_lead를 구현했습니다. GA4 웹 스트림의 자동 브라우저 기록 페이지뷰가 수동 이벤트와 중복되는지 DebugView에서 확인하고 필요 시 정확한 설정 변경을 승인받습니다. GA에 고객 성함·연락처·문의 본문은 보내지 않습니다. 로컬과 관리자 화면에서는 GA 태그를 로드하지 않습니다.

## 데이터·기존 운영 보존

1. Supabase 복구 후 migration 적용 전 스키마와 기존 데이터·권한을 백업합니다. migration 001~014의 적용 여부를 실제 schema와 비교합니다. 과거 migration을 무조건 재실행하지 않습니다.
2. 신규 migration 20260930174544_website_renewal.sql은 website_entries, website_rate_limits, Storage website-media와 transaction RPC를 추가합니다. 기존 leads/quote_requests/conversations/portfolios 및 ERP 테이블을 삭제하지 않습니다.
3. 옛 anonymous 문의/상담 insert 정책 3개를 제거하고 서버 검증 경로로 제한합니다. 실제 운영에서 이 직접 입력 권한을 사용하는 외부 연동이 있는지 먼저 확인합니다.
4. legacy에 보존한 ERP 메뉴, cron·Telegram·page-factory 등 기존 API는 신규 활성 앱에 포함하지 않았습니다. Vercel의 예약 작업과 봇 호출이 실제 사용 중이면 별도 운영 모듈로 유지·이전한 뒤 전환해야 합니다. 확인 전 기존 운영 배포를 교체하지 않습니다.
5. 기존 portfolios 자료의 실제 slug·권리·공개 상태를 확인하고 새 CMS로 선별 이전합니다. 미확인 사례를 일괄 공개하지 않습니다. 옛 portfolio 상세 URL 이전표는 실제 자료 확인 후 확정합니다.

## 콘텐츠·관리자·환경

- 가격은 범위 확인 후 견적. 내부 제안 가격과 미확인 실적·후기·직원 프로필을 공개하지 않습니다.
- 개인정보 안내는 운영 초안입니다. 상담 종료 후 1년 보유 제안, 종료·삭제 담당 및 실제 국외 처리·수탁 조건을 운영자 확인 뒤 확정합니다. 자동 개인정보 삭제를 구현·실행했다고 주장하지 않습니다.
- 공개 고객 사례는 권리 확인과 사실 확인을 마친 뒤 게시합니다. 이미지 업로드는 공개 Storage를 사용하므로 업로드 전 공개 가능한 자료인지 확인합니다.
- ADMIN_USERNAME/PASSWORD/SESSION_SECRET과 service-role 키는 기존 배포 환경을 확인하고 안전하게 설정합니다. 로컬 임시 검증 계정을 운영에 복사하지 않습니다.
- .env.example의 변수 목록을 기준으로 준비합니다. 노출 가능한 변수는 URL·GA 측정 ID뿐입니다. 비밀은 NEXT_PUBLIC_ 접두사를 쓰지 않습니다.
- 챗봇 HOLD. provider/AI 키/위젯/공개 응대는 이번 배포에 추가하지 않습니다.

## 배포 시험

연결과 승인 후 preview에서: 신규 문의 → 접수번호 → DB → 관리자 조회/상태/메모/필터 → 레퍼런스 이미지 업로드/저장/공개/비공개 → GA Data API → DebugView → URL/SEO → 4폭 화면을 실제 Supabase와 Vercel에서 검증합니다. 실제 고객 대신 명확한 승인된 시험 자료를 사용하고 외부 알림은 별도로 시험합니다.

운영 배포 후 https://aio-make.com의 동일 동선과 301·쿠키·SSL·깨진 자산·오류 로그를 확인합니다. 실측 LCP/CLS 및 실제 기기 브라우저 검증은 추가 게이트입니다. 현재 Chrome 폭 검증은 물리 모바일 기기나 field CWV 검증이 아닙니다.

## 롤백

전환 전 기존 Vercel deployment ID와 Git 기준 SHA, DB backup 식별자, 이전 env 이름·권한 설정을 기록합니다. 사이트 장애 시 기존 배포로 되돌리고 신규 CMS/문의 자료를 별도 보존합니다. 새로 접수된 문의를 지우는 DB 초기화나 snapshot 덮어쓰기는 실행하지 않습니다. 새 테이블·함수 제거는 의존성과 새 데이터 확인 및 별도 삭제 승인이 필요합니다.

프로젝트 AGENTS.md의 운영 게시·권한·자격 증명 변경에 대한 사람 승인 규칙을 적용합니다.
