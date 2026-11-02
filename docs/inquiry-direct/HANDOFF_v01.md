# 문의·관리자 연동 수정 v01

작업: WRK-20261002-INQUIRY-DIRECT / 실행·자체 검수: Codex
기준: 운영 커밋 c8f6f21, 기존 UX 수정 유지. 별도 codex 브랜치·worktree.

## 원인과 변경
- 기존 contact API는 Gmail OAuth 발송 인증 4개와 공개접수 flag를 요구했다. Gmail 인증은 운영에 없었으며 CURRENT v17에도 미완료로 명시됐다.
- /admin/layout과 login API는 로컬 주소만 허용했다. 운영 관리자 계정 환경변수는 존재하지만 운영 접근은 404였다.
- 홈 간단문의 입력에 globals.css의 밝은 글자색이 상속되어 흰 배경에서 보이지 않았다.
- Supabase 대신 Neon PostgreSQL 문의 전용 DB. 문의와 알림 대기열을 같은 트랜잭션으로 먼저 기록한다. 이메일은 Resend 별도 알림.
- 클라우드 DB 기반 idempotency와 IP별 접수·로그인 제한. 관리자 인증·HttpOnly/SameSite/Secure cookie 유지.
- 관리자 문의 조회·검색·상태·메모·CSV·백업 유지. 문의 30초 갱신. 알림 실패·불확실 상태 구분.
- 네트워크 타임아웃/불명확 발송은 자동 재발송하지 않는다. Resend 이벤트와 관리자 상태를 대조한 뒤 운영자가 판단한다.
- 입력 글자색·커서·자동완성 대비 수정. 문의 미저장 시 성공 표시 없음.

## 완료 기준
실제 운영 폼 접수번호, 관리자 로그인/동일 문의 조회/메모 저장, 동일 키 중복 방지, 이메일 수신 증거. 로컬 통과를 운영 완료로 표시하지 않는다.

## 설정
INQUIRY_DATABASE_URL / ADMIN_WEB_ENABLED=true / CONTACT_PUBLIC_ENABLED=true.
기존 ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET 사용. 키·비밀번호는 문서·Git에 기록하지 않는다.
RESEND_API_KEY (sending only), INQUIRY_EMAIL_FROM (또는 기존 RESEND_FROM_EMAIL). 수신자 aiomake2023@gmail.com 고정.
Neon Vercel Marketplace 연결 INQUIRY prefix, Production/Preview. 서버 및 DB sin1. Free 플랜, Auth 비활성.

## 승인
사용자가 Neon 무료 저장소 생성·약관·연결 승인, Resend 로그인·약관·발송 전용 키·Vercel 연결 승인.
유료 결제 없음. 기존 로컬 원본 DB와 .env 설정 변경 없음.

## 검증 진행
- typecheck 통과, 자동 검증 18/18, lint 오류 0 (기존 테스트 unused parameter 경고 1).
- 최종 next build 통과 (sender alias·privacy·region 포함).
- Chrome 로컬: 홈 이름/연락처 글자 rgb(13,13,18), 배경 white. 접수번호 발급, 관리자 로그인, 동일 문의 조회, 메모 저장 확인.
- 실제 Neon TLS 연결 및 schema 생성 성공, 초기 문의 0건 확인.
- 실제 Neon 저장/중복 방지/메모 확인, Resend 발송 후 Gmail 수신 확인. 접수 305a75c6-0251-4638-81c0-7797e960c73b. 운영 배포 검증은 후속 v02에 기록.

## 근거 문서
https://node-postgres.com/features/transactions
https://resend.com/docs/api-reference/emails/send-email
https://neon.tech/docs/guides/vercel-native-integration

