# API 계약 v01

| 경로 | 인증/역할 | 동작 |
|---|---|---|
| POST /api/quote | 공개, 활성화·동의 검사 | ko/marketing만 수용. 필수 업체 정보·UUID idempotencyKey·consent_version·attribution. `{success:true,data:{quoteId}}` 유지. 저장 미확인 시 성공하지 않음 |
| GET /api/quote/notice | 공개 | 동의 안내·버전·활성화 상태만. 비밀값·고객 정보 없음 |
| GET/POST /api/admin/marketing-consultations | 기존 관리자 세션, 변경은 Origin 검사 | 목록/상세, 상태·메모·초안·수동 대조. 발송 승인은 Slack 본인 승인으로 분리 |
| GET/POST /api/admin/marketing-content | 관리자 세션, Origin 검사 | 콘텐츠 버전 조회/생성/공개. 가격 등 공개는 별도 활성화 필요 |
| POST /api/integrations/marketing/slack | Slack HMAC+5분 시각+본인/팀/채널 | 최신 초안 승인 기록과 email outbox 생성. 직접 발송하지 않음 |
| GET/POST /api/integrations/marketing/grok | Grok Bearer, 외부 실행 플래그 | 대기 작업 한 건 claim / 결과 원자적 저장. 최신 고객 회신 기준과 중복 작업 검사 |
| POST /api/integrations/marketing/dispatch | worker Bearer, 외부 실행 플래그 | `{kind:"slack"}` 또는 `{kind:"email"}` 한 건. 타임아웃·불명확 결과 자동 재실행 금지 |
| POST /api/integrations/marketing/email | Resend raw body webhook 서명 | 수신 본문 조회 후 상담 서명 주소·발신자 대조. provider event 중복 제거. 발송 배달/반송 결과 별도 기록 |

DB 기준 함수: marketing_submit / marketing_action / marketing_claim / marketing_finish / marketing_grok_result / marketing_save_content / marketing_reconcile.

모든 새 테이블 RLS 활성화, anon/authenticated/public 접근 및 함수 실행 권한 취소, service_role만 사용. 공개 콘텐츠도 서버에서 published만 선택한다. 비공개 원문을 클라이언트 SDK로 읽지 않는다.

Slack·이메일 문서 확인(2026-09-19):
- https://docs.slack.dev/authentication/verifying-requests-from-slack/
- https://resend.com/docs/webhooks/verify-webhooks-requests
- https://resend.com/docs/dashboard/receiving/introduction
- https://supabase.com/docs/reference/javascript/rpc
- https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects
Supabase changelog: Data API 노출/권한 변경 확인. 새 테이블·함수 권한을 명시적으로 지정했다. 운영 Supabase advisor 실행은 미완료.

발송 시작 경계: 최신 초안·고객 회신 기준을 잠금 아래 재검사한 후 `sending`으로 전환한다. 그 전에 도착한 회신은 발송을 차단한다. 이미 발송을 시작한 뒤 도착한 회신은 외부 이메일을 취소하는 것으로 처리하지 않고 다음 대화로 기록한다.
