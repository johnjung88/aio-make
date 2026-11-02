# CLAUDE.md — aio-make.com (2026-10 리뉴얼 기준)

> AI가 이 저장소에서 작업할 때 처음 읽는 안내. 진행 상태·승인·성과는 여기 적지 않고
> 공유 정본(`AIO_SHARED/06_외주 관리/03_사업 관리/02_플랫폼 관리/02_자사 웹사이트/PROJECT.MD`)을 따른다.

## 지금 기준

- 리뉴얼 코드가 기준이다. 2026-06 이전의 Supabase·텔레그램 봇·cron 브리핑·ERP 구조는 **쓰지 않는다**.
  옛 코드는 `legacy/2026-10-01/`에 보관만 한다(수정·참고 구현 금지).
- 운영(aio-make.com)은 Vercel 프로젝트 `aio-make-src`이며, 운영 배포 브랜치는 `renewal/2610-finish`다.
  `master`도 같은 리뉴얼 코드로 맞췄다(2026-11-02). 운영 브랜치를 바꿀 때는 Vercel 설정도 함께 바꾼다.
- 챗봇은 보류(HOLD) 상태다. 위젯·API를 되살리지 않는다.

## 구조 요약

자세한 내용은 [README.md](README.md), [docs/renewal/ARCHITECTURE.md](docs/renewal/ARCHITECTURE.md),
[docs/renewal/RELEASE.md](docs/renewal/RELEASE.md), [docs/inquiry-direct/HANDOFF_v01.md](docs/inquiry-direct/HANDOFF_v01.md)를 본다.

| 영역 | 위치 |
|---|---|
| 공개 화면 | `app/(public)/`, `app/(content-site)/`, `components/guide/` |
| 서비스·공개 조건 데이터 | `lib/content.ts`, `lib/guide-content.ts`, `lib/development-offers.ts` |
| 문의 접수 | `app/api/contact/`, `lib/inquiry-db.ts` (Neon/PostgreSQL `INQUIRY_DATABASE_URL`), 메일은 Resend |
| 관리자 | `app/admin/`, `app/api/admin/`, `lib/session.ts`, `lib/auth.ts` |
| 분석 | `lib/ga.ts` (GA4, 서비스 계정 읽기 전용) |
| 환경변수 목록 | `.env.example` (값은 `.env.local`·Vercel에만 둔다) |

- `lib/db.ts`의 Supabase 연결은 `ENABLE_LEGACY_SUPABASE=true`일 때만 켜지는 옛 경로다. 새 기능을 여기에 붙이지 않는다.
- `supabase/` 폴더도 옛 자료다. 새 마이그레이션을 추가하지 않는다.

## 작업 규칙

- 작업 브랜치에서 수정하고 PR로 `renewal/2610-finish`(운영)에 병합한다.
- 푸시 전 확인: `npm run lint`, `npm test`, `npm run build`(그 뒤 `npm run typecheck`). dev 서버와 build를 동시에 돌리지 않는다.
- 시크릿(`.env.local`, API 키, 관리자 비밀번호, 서명 키)은 채팅·문서·커밋에 넣지 않는다.
- 실제 데이터가 없으면 수치를 만들거나 문의 접수를 성공으로 처리하지 않는다.

## 갱신 이력
- 2026-11-02: 리뉴얼 기준으로 새로 작성(옛 Supabase·텔레그램 안내 대체)
