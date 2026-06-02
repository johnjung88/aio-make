# CLAUDE.md — 4_AIO_SITE (aio-make.com 자사몰)

> 이 파일은 Claude Code가 4_AIO_SITE 안에서 작업할 때 항상 가장 먼저 읽는 컨텍스트.

---

## 📌 마스터 작업 규칙 (반드시 참조)

이 도구의 작업도 *솔로프리너 마스터 규칙*을 따른다:

→ `../CLAUDE.md` (솔로프리너 루트) — 폴더 구조, 명명 규칙, 데이터 SoT

---

## 프로젝트 한 줄

**aio-make.com** — Next.js 15 + Supabase + Resend + Anthropic + Telegram Bot 통합 자사몰. 견적/문의 폼·챗봇·관리자 대시보드·양방향 텔레그램 봇.

---

## 사용자 컨텍스트

- **이름**: 의장 (koreabencb@gmail.com)
- **개발 경력**: 2026년 1월부터 바이브코딩 시작. 초보자.
- **목표**: 자체 매출 채널 확보 + 운영 자동화 (cron 일일/주간 브리핑)

---

## 절대 잊으면 안 되는 5가지

1. **단일 Supabase 프로젝트** — `rohodabwnabpqkxgxbft` (서울 ap-northeast-2). `.env.local` `NEXT_PUBLIC_SUPABASE_URL` 변경 금지.
2. **모든 텔레그램 알림 — Markdown 형식 통일** — `lib/admin/telegram-templates.ts` 의 헬퍼만 사용. 직접 escape 안 된 문자열 sendMessage 금지.
3. **CRON_SECRET 검증 필수** — `/api/cron/*` route는 모두 Bearer 헤더 검증. 우회 금지.
4. **데이터 SOT는 Supabase**. 엑셀(`0_운영관리/AIO_*.xlsx`)은 backup·시각화용. *입력은 Supabase 우선*.
5. **시크릿 노출 X** — `.env.local`, `CRON_SECRET`, `TELEGRAM_BOT_TOKEN` 등 절대 채팅·문서·커밋에 넣지 X.

---

## 핵심 파일 위치

| 영역 | 위치 |
|---|---|
| 사이트 폼 | `app/api/quote/route.ts`, `app/api/contact/route.ts` |
| 챗봇 | `app/api/chatbot/route.ts` |
| Admin 페이지 | `app/admin/(protected)/{inbox,contracts,customers,bot}/` |
| 텔레그램 webhook | `app/api/telegram/webhook/route.ts` |
| 텔레그램 cron | `app/api/cron/{daily,weekly}/route.ts` |
| 메시지 템플릿 | `lib/admin/telegram-templates.ts` |
| 데이터 빌더 | `lib/admin/briefing.ts` |
| Supabase 클라이언트 | `lib/supabase.ts` |
| 마이그레이션 | `supabase/migrations/00X_*.sql` |
| 시드 | `supabase/scripts/seed_*.sql` |

---

## 새 기능 추가 규칙

### API route 추가
1. `app/api/{feature}/route.ts` 생성
2. zod schema로 입력 검증
3. Supabase 데이터 변경 시 `lib/admin/{feature}.ts` 분리
4. 텔레그램 알림 필요 시 `notifyTelegram()` + Markdown 템플릿 사용

### Supabase 스키마 변경
1. `supabase/migrations/00N_{name}.sql` 추가 (DDL)
2. 시드 데이터는 `supabase/scripts/seed_*.sql` 별도
3. 이미 적용된 마이그레이션은 *재실행 안전*하게 (CREATE TABLE IF NOT EXISTS)

### 새 admin 페이지
1. `app/admin/(protected)/{name}/page.tsx`
2. `lib/admin/{name}.ts` 데이터 함수
3. `app/api/admin/{name}/route.ts` API
4. 인증: `getAdminSession()` 검증 필수

---

## 환경변수 (Vercel + .env.local 동기화)

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-haiku-latest
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=7668768088
TELEGRAM_WEBHOOK_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
CONTACT_TO_EMAIL=
CRON_SECRET=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=
```

→ 추가 시 *둘 다 갱신* + Vercel Redeploy.

---

## Cron 스케줄

```json
{
  "crons": [
    { "path": "/api/cron/daily", "schedule": "0 22 * * *" },
    { "path": "/api/cron/weekly", "schedule": "0 22 * * 0" }
  ]
}
```

- `0 22 * * *` UTC = 매일 KST 07:00
- `0 22 * * 0` UTC = 일요일 22:00 = 월요일 KST 07:00

---

## 갱신 이력
- 2026-05-10: 초기 작성
