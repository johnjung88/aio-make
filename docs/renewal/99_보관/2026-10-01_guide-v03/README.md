# AIO MAKE — 웹사이트 리뉴얼 v01

마케팅·개발·영상 대행을 한국어 단일 사이트로 소개하는 Next.js 웹사이트입니다. 관리자 로그인 후 문의·상담, 레퍼런스·인사이트, GA4 연결 상태와 통계를 관리합니다.

## 현재 상태

코드·이미지·로컬 기능 검증 완료 후보입니다. 운영 배포, 운영 Supabase 마이그레이션, GA4 Data API 서버 인증은 적용 전입니다. 챗봇은 사용자 요청으로 보류했습니다.

- 공개 URL: /, /marketing, /lab, /video, 분야별 services/contact/work/insights, /about, /work, /contact.
- /ko·/KO·/en 접두사를 301로 제거하고 UTM을 보존합니다. /dev는 /lab로 이전합니다.
- 서비스 설명과 선택 항목은 lib/content.ts 하나에서 관리합니다.
- 생성 이미지 8장, 원본/프롬프트/SHA-256은 docs/renewal/assets.json에 기록했습니다.
- 원본 코드는 legacy/2026-10-01에 보존했습니다. 활성 앱과 검사에서는 제외합니다.

## 로컬 실행

Windows Node.js 24.13.1에서 검증했습니다.

```powershell
npm ci --ignore-scripts
Copy-Item -LiteralPath .env.example -Destination .env.local
npm run dev -- --hostname 127.0.0.1 --port 3100
```

관리자 환경변수와 서버 키는 .env.local 또는 호스팅 환경변수에만 입력합니다. Git에 올리지 않습니다. DB가 없으면 온라인 문의를 성공 처리하지 않습니다. 운영 로그인 제한에는 DB 기반 rate-limit RPC가 필요합니다. 개발/관리자/localhost에서는 GA 이벤트를 보내지 않습니다.

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

## 연결과 검증 문서

- [구조](docs/renewal/ARCHITECTURE.md)
- [검증 결과](docs/renewal/QA_REPORT.md)
- [운영 전환·롤백](docs/renewal/RELEASE.md)
- [생성 자산](docs/renewal/assets.json)
- [HTTP 통합 결과](docs/renewal/http-qa.json)
- [브라우저 검증 기록](docs/renewal/browser/browser-qa.json)

로컬 PostgreSQL 통합 시험은 tests/support/local-supabase.mjs를 별도 터미널에서 실행하고 .env.local의 테스트 DB 주소를 http://127.0.0.1:3102, 키를 local-qa-only로 설정한 후 node tests/http-flow.mjs로 수행합니다. 이 어댑터는 루프백에서만 실행되는 테스트 코드이며 실제 Supabase·Storage·운영 환경 검증을 대신하지 않습니다.
