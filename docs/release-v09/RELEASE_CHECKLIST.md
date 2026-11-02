# 배포 마무리 점검 v09

2026-10-02 KST · 담당 Codex · 기준 91f1271(v08)

## 검색·AI 답변·공유 개선

- 완료: 56개 공개 경로의 고유 제목, 설명, canonical, OG/Twitter, 단일 H1 및 내부 링크 144개 HTTP 검증. 이전 언어 접두사와 별칭 301 및 쿼리 보존, 없는 페이지 실제404/noindex 확인.
- 완료: Organization, WebSite, Service, BreadcrumbList, Article JSON-LD. 회사 정보는 공개 하단과 일치. 글에 운영 주체와 실제 수정일 표시. 기존 가이드의 게시일은 추정하지 않았다.
- 완료: FAQ 답변을 초기 HTML에 포함하고 펼침 동작·접근성 속성 유지. 분야별 작업 절차/상담 글 6개를 서로 다른 실제 업무 내용으로 보완했다. 본문에 없는 실적·리뷰·AI 인용 보장이나 평가 점수를 만들지 않았다.
- 완료: favicon SVG/ICO(16·32·48), PNG96, Apple180, 아이콘192/512, 한국어 manifest. 현재 로고 사용. 공유 카드 4장(main/marketing/lab/video)은1200×630 PNG, 직접 이미지 검수 완료. 생성 스크립트는 Windows Malgun Gothic 글꼴을 사용하며 배포물 PNG는 글꼴 설치와 무관하다.
- 완료: 관리자/API noindex 헤더, preview noindex/robots 차단. GA 수집을 운영 hostname으로 한정하여 로컬·preview 방문 혼입 방지.
- 완료: npm audit 전체 의존성 취약점0. 알려진 개발 의존성5건의 호환 범위 패치 적용. 라이브러리 주요 버전 변경 없음.

## 실제 확인 및 한계

- 생산 빌드, 타입, 린트, 직렬 기능 테스트16건 PASS. HTTP 결과 seo-http.json. 첫 HTTP 시험은 홈 canonical 끝 슬래시의 동등한 URL 비교에서 실패했고 URL 정규화 후 재검증 통과했다.
- Chrome1920px 메인 및 업무자동화 시각 확인, FAQ 열기 확인. Chrome390px SEO 서비스 이미지/줄바꿈/가로 넘침 없음, 모바일 메뉴 및 모션 정지·3번 장면 선택 확인. 실제 물리 모바일 기기 시험은 미실행.
- 검색엔진 실제 색인·순위·AI 인용, 카카오톡 등 외부 앱 공유 캐시 갱신은 배포 후 확인 대상이다. 로컬 메타/이미지 검사만으로 이를 완료 처리하지 않는다.

## 운영 대상과 전환 장애

- 브라우저 로그인으로 Vercel john-jungs-projects-eef5c147 / aio-make-src → aio-make.com 및 www.aio-make.com 연결을 확인했다.
- 현재 운영은 master a0e677bf06b4a958dc3129dd4122a08d736026e8, 배포 J9T4Z2c7ab7w8m48LAosadocnC36, URL aio-make-lhg7murel-john-jungs-projects-eef5c147.vercel.app. 롤백 기준으로 보존한다.
- 운영 환경 변수 이름에 기존 ADMIN_USERNAME/PASSWORD/SESSION_SECRET, Supabase URL/서비스 키, GA ID 및 SITE_URL 존재를 확인했다. 비밀 값은 표시·복사하지 않았다. GA4 Data API 서버 인증 변수는 아직 없다. 로컬 시험 계정을 운영 계정으로 복사하지 않는다.
- Supabase aio-make(rohodabwnabpqkxgxbft) INACTIVE. 재개 API가 조직 미납 PaymentRequiredException으로 거절했다. 사용자 결제 처리 전 재개·백업·운영 migration·문의/CMS·관리자 로그인 실검증 불가. 결제나 임의 대체 DB 생성 없음.
- Vercel CLI/커넥터 인증도 미완료지만 기존 브라우저 관리 화면은 사용 가능하다. CLI 로그인 완료를 운영 배포의 유일 경로라고 단정하지 않는다.
- 운영용 영속 rate limiter가 없으면 관리자 로그인은503으로 차단되므로, 정적 화면 정상만으로 운영 전환 완료 처리하지 않는다.
- 기존 cron/봇 API 운영 여부, 실제 포트폴리오 URL·공개 권리와 이전표, 개인정보 보유/수탁 조건은 기존 RELEASE.md의 전환 점검 대상이며 아직 확인 필요하다.
- 챗봇 HOLD 유지.

## 외부 장애 해소 후 실행 순서

1. Supabase 미납 해결 확인 → 기존 프로젝트 재개 → 백업 및 테이블/정책/연동 확인 → 필요한 migration 적용 → Advisors.
2. 기존 운영 관리자 자격 유지, GA Viewer 인증을 운영 서버에 연결. 실제 문의 저장/관리/콘텐츠 공개 전환과 GA 조회 검증.
3. 기존 cron/외부 의존성 및 과거 URL 이전표 확인. 후보 배포를 검증한 다음 aio-make.com으로 전환.
4. 운영 HTTPS/정규 도메인·301·캐시·robots/sitemap·메타/이미지·폼·관리자·GA 중복 이벤트 점검. Search Console/네이버 사이트맵과 대표 URL 검사. 외부 공유 카드 캐시 확인.

## 분석 근거

- Google AI features: https://developers.google.com/search/docs/appearance/ai-features
- Google AI optimization guide: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google 변경 이력: https://developers.google.com/search/updates (2026-05 FAQ rich results 종료, 별도 llms.txt를 Google 색인/순위 필수요소로 취급하지 않음)
- 사이트명: https://developers.google.com/search/docs/appearance/site-names
- favicon: https://developers.google.com/search/docs/appearance/favicon-in-search
- 구조화 데이터: https://developers.google.com/search/docs/appearance/structured-data/organization
- 네이버: https://searchadvisor.naver.com/guide/seo-basic-intro

Google AI 노출에도 검색 접근성, 고유하고 유용한 본문, 실제 정보와 일치하는 구조화 데이터가 기본이다. 본 작업은 이 근거에 맞춰 구현했으며 노출 결과를 보장하지 않는다.
