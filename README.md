# AIO MAKE — 가이드 기준 리뉴얼 v03

첨부 가이드의 밝은 공통 홈, 흰색 Marketing, 검정 Studio, 어두운 Lab을 정상 React/Next.js 페이지로 구현했습니다. 한국어 단일 URL과 14개 서비스, 실제 문의 저장 경로, 관리자 상담·콘텐츠 관리, GA4 조회 준비를 포함합니다. 챗봇은 사용자 지시로 보류했습니다.

현재는 로컬 검증 후보입니다. 운영 배포와 Supabase/Storage 적용, GA4 서버 읽기 인증은 완료 전입니다. 실제 데이터가 없으면 수치를 만들거나 문의 접수를 성공 처리하지 않습니다.

## 로컬 실행

Windows Node.js 24.13.1에서 검증합니다. 서버 인증 값은 ignored .env.local 또는 호스팅 서버 환경에만 둡니다. 로컬 시험 계정을 운영에 복사하지 않습니다.

```powershell
npm ci --ignore-scripts
Copy-Item -LiteralPath .env.example -Destination .env.local
npm run dev -- --hostname 127.0.0.1 --port 3100
```

배포 빌드와 dev를 동시에 실행하지 않습니다. 타입 검사는 빌드의 생성 파일 작업이 끝난 뒤 실행합니다.

```powershell
npm run lint
npm test
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1 --port 3100
```

## 구조와 편집

- 공개 경로: /, /about, /about/team, /marketing, /lab, /video, 분야별 services/contact/work/insights, /work, /contact.
- /ko·/KO·/en은 301로 제거하고 UTM을 유지합니다. /dev는 /lab로 연결합니다.
- lib/content.ts: 서비스 분류와 공개 사업 조건. lib/guide-content.ts: 14개 제작 방향 예시와 9개 안내 글. 운영 DB에 시험 콘텐츠를 넣지 않습니다.
- components/guide: 가이드 화면 12개, 공통 내비게이션·이미지·폼·모션·필터. 관리자와 서버 코드에 DC 편집 런타임을 넣지 않습니다.
- scripts/restore-guide.py: 보존한 HTML을 일반 React로 변환합니다. Python beautifulsoup4가 필요한 개발용 도구입니다. 실행 후 generated JSX를 Prettier로 정리합니다. 변경은 compiler adaptation 또는 공통 primitives에 기록합니다.
- docs/renewal/guide-source: 읽기 기준 원본 12개와 SHA-256. public/images/guide: 제공 이미지. 생성 자산 10개 원본을 보존하며 현재 화면에는 6개를 제작 예시로 사용합니다.
- legacy/2026-10-01: 원본 저장소 코드 364개 보존. 기존 ERP/cron/API 사용 상태 확인 전 운영 교체를 하지 않습니다.

## 검증과 운영 연결

- [이번 수정과 검증](docs/renewal/iteration-v03/REPORT.md)
- [원본 화면 비교](design-qa.md)
- [종합 검증](docs/renewal/QA_REPORT.md)
- [구조](docs/renewal/ARCHITECTURE.md)
- [운영 전환과 롤백](docs/renewal/RELEASE.md)
- [자산 출처](docs/renewal/assets.json)

격리 통합 시험은 tests/support/local-supabase.mjs의 메모리 PostgreSQL을 127.0.0.1:3102에서 실행합니다. .env.local의 DB 주소/키를 loopback/local-qa-only로 임시 지정한 뒤 tests/http-flow.mjs → tests/http-usability.mjs 순으로 실행합니다. 첫 시험은 비어 있는 시험 DB가 필요합니다. 실행 후 환경 원상 복구와 어댑터 종료가 필수입니다. 실제 Supabase·Storage·GA 결과로 해석하지 않습니다.

로컬 dev에서는 시험 계정 로그인과 미연결 대시보드를 확인할 수 있습니다. production은 DB 기반 로그인 보호가 연결되기 전503을 반환합니다. 개발 공개 가격/범위는 lib/development-offers.ts의 사업v12 공통 값을 사용합니다.
