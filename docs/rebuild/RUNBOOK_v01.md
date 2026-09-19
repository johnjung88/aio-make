# 연결·출시·복구 절차 v01

상태: 준비본. 운영 적용 미실행. 공통 정책 1.5.0에 따라 실제 실행자·연결·정확한 사람 승인 확인 후 적용한다. 자격 증명은 환경의 비밀 저장소에만 둔다.

## 로컬 재현

1. `npm ci --ignore-scripts`, `npm run test:marketing`, `npm run build`.
2. 별도 터미널: `node tests/marketing/local-db.mjs` (127.0.0.1:54339, 메모리 DB, 실제 Supabase가 아님).
3. **실제 .env.local이 없는 독립 작업본에서만** `tests/marketing/local-env.example`을 `.env.local`로 복사한다. 가짜 토큰과 가짜 동의 안내이며 운영에 사용하지 않는다.
4. `npm run dev -- --hostname 127.0.0.1 --port 3319`.
5. `node tests/marketing/api.test.mjs`, `node tests/marketing/browser.test.mjs`, `node tests/marketing/retry.test.mjs`, `node tests/marketing/content.test.mjs`. 브라우저 경로는 `TEST_CHROME_PATH`로 지정 가능. 기본 `/opt/google/chrome/chrome`.
6. DB/브라우저 테스트는 로컬 계정 `local-review`만 사용하며 실메시지를 보내지 않는다. 종료 후 테스트 서버와 테스트 .env.local을 정리한다.

## 운영 적용 전

- 기준 배포·복구 대상 SHA와 URL, 운영 DB 프로젝트 ID·백업·기존 마이그레이션 적용 이력을 확인한다. 기존 공유 DB의 테이블·RLS는 로컬 코드만으로 적용 상태를 가정하지 않는다.
- 새 SQL 파일 `supabase/migrations/20260919055959_marketing_consultations.sql`은 추가 테이블/함수와 RLS/권한만 만든다. 기존 데이터 UPDATE/DELETE 없음. 운영 적용 전 복제 DB에서 실제 Supabase migration/advisor 검증을 수행한다.
- 필요한 비밀/설정 이름은 `.env.example` 참고. 기본으로 접수·콘텐츠 공개·외부 실행 모두 false.
- 개인정보 동의 안내는 `MARKETING_CONSENT_NOTICE`와 `MARKETING_CONSENT_VERSION`에 확정본을 설정한다. 실제 동의 안내 전문과 버전이 문의와 함께 저장된다.
- Slack은 비공개 채널로 한정하고 OWNER/TEAM/CHANNEL을 실계정과 대조한다. 서명 secret과 bot token은 별개다. `chat:write` 등 필요한 권한만 설정한다.
- 이메일은 Resend 발신 도메인과 수신 도메인을 실제 검증한다. `MARKETING_REPLY_SECRET`은 충분한 난수 비밀이다. 회신 주소는 상담 UUID+서명이며 발신자 이메일도 대조한다. 미일치 회신은 422로 보류하고 제공자 inbox에서 사람이 확인한다.
- Grok 토큰은 worker token과 분리한다. 조회한 고객 원문을 도구 명령으로 실행하지 않으며 초안만 반환한다. 공식 실행자 연결/acceptance와 개인정보 처리 승인 없이 연결하지 않는다.

## 실제 시험 순서

1. 승인된 비개인 가상 매장 정보와 **본인의 시험 수신 이메일**을 확정한다. 실제 메시지·수신자·초안 버전의 승인 근거를 남긴다.
2. 마이그레이션 적용 후 anon/authenticated 테이블·RPC 접근 거부를 실제 검증한다. 관리자 API도 로그인 없이는 401이어야 한다.
3. 접수만 활성화해 한 건을 제출한다. consultation 1건·intake 이벤트·slack/grok pending 2건을 확인한다.
4. 허가된 실행자가 dispatch `kind=slack`을 한 번 호출한다. 상담 전용 스레드 연결 확인. Grok 작업 API에서 수령하고 결과를 반환한다. 사람이 작성한 초안도 가능하다.
5. Slack에 수신자·채널·제목·전체 본문·버전이 보이는지 확인한다. 다른 사용자 승인·오래된 버튼·중복 버튼은 차단/무효 처리되는지 시험한다.
6. 본인 승인 후 허가된 실행자의 email dispatch 1회. provider ID, DB sent, 실제 수신함 메시지 1건을 대조한다. 승인 기록과 발송 완료는 서로 다른 상태다.
7. 시험 이메일에서 회신한다. 서명 검증된 webhook이 본문을 가져와 같은 상담에 저장하고 같은 Slack 스레드와 새 Grok 작업으로 이어지는지 확인한다.
8. 초안 수정·회신 후 이전 승인 불가, Slack/Grok 장애 중 문의 보존, API 타임아웃 이후 중복 발송 없음까지 확인한다.
9. 증거·시간·릴리스 SHA·설정 버전·시험건 ID를 별도 인계에 기록한 뒤 배포 승인을 적용한다. 미검증을 통과로 표시하지 않는다.

## 장애·복구

- 우선 `MARKETING_INTAKE_ENABLED=false`, `MARKETING_EXTERNAL_ENABLED=false`로 새 접수/외부 실행을 중단한다. 오래 실행 중인 worker도 중단 확인한다.
- `processing`은 자동 재선점되지 않는다. `unknown`도 자동 재시도되지 않는다. Resend/Slack 외부 이력과 이전 실행 종료를 확인하고 관리자에서 근거를 기록한다.
- 이메일 완료 확인에는 provider ID, Slack 완료에는 thread timestamp가 필요하다. 미실행 확인 후 failed로 처리하더라도 동일 답변을 자동 재전송하지 않는다. 필요하면 새 초안·새 사람 승인을 거친다.
- DB 새 테이블을 삭제하거나 기존 문의를 되돌리지 않는다. 접수·승인·발송 이력은 보존한다.
- 코드 롤백은 정확한 승인 대상 릴리스로만 한다. 구버전 quote API는 즉시 Telegram/이메일 발송과 다서비스 접수를 포함하므로 **이전 SHA 단순 재배포를 안전한 비활성화로 간주하지 않는다**. 우선 현행 후보의 차단 플래그로 멈추고, 구버전의 외부 효과와 비운영 서비스 노출을 별도 검토한다.

## 범위 밖

개인 카카오톡 자동화, 영상·개발 상품·가격·접수, 새 인프라·계정·도메인 개설, 실제 고객 연락처 이관, 미확인 실적 공개는 수행하지 않는다.
