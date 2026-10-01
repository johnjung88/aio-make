# 운영 배포와 검색·공유 마무리 계획 v09

2026-10-02 KST · WRK-20261002-WEBSITE-RELEASE · 담당 Codex

사용자의 실제 배포 지시를 근거로 최신 작업본91f1271(v08)에서 독립 codex/WRK-20261002-WEBSITE-RELEASE를 만들었다. 기존 리뷰·리뉴얼 작업트리와 원본은 보존한다. 이전 배포 보류를 이번 배포 승인으로 갱신하며 챗봇 HOLD는 유지한다.

1. 현재 Vercel 프로젝트·도메인·환경·기존 배포/rollback을 읽고 정확한 대상 확인. Supabase 재개·기존 schema/data 보존·필요 migration·문의/CMS 검증. GA4 기존 읽기 인증을 운영 서버 환경에 안전하게 연결.
2. Google/네이버 공식 문서 기준 SEO/AEO/GEO 분석. 페이지별 고유 제목·설명/canonical, 서버 본문, 내부 링크, robots/sitemap, 회사/WebSite/Service/Breadcrumb/Article 구조화 데이터의 사실·본문 일치, 관리자/미공개 제외, 이전 URL301 확인. 검색·AI 인용을 보장하거나 특수 파일을 필수 조건으로 주장하지 않는다.
3. 현재 로고에서 favicon SVG/ICO/PNG·Apple touch·manifest를 만들고 브랜드 공유 카드1200×630을 페이지 분야와 연결. OG/Twitter 절대URL·제목/설명/alt·이미지실응답 확인.
4. v08 미검증 모션·신규 이미지까지 실제 PC/모바일에서 확인. lint/type/build/직렬 단위 시험, HTML/메타/구조화/이미지/404/301 자동 검사. 발견→수정→재검증을 증거와 기록.
5. 실제 배포 환경에서 운영 후보 검증 후 aio-make.com 배포. 공개 화면·문의 접수/관리자·CMS·GA·공유 이미지·robots/sitemap·HTTPS/도메인 canonical을 확인. 현재 배포ID와 rollback 보존. 코드 버전·배포ID·URL·완료/미완료를 CURRENT/인계에 기록.

현재 확인한 외부 장애: Vercel 커넥터 UNAUTHORIZED 및 CLI invalid token, 기기 로그인 진행. Supabase rohodabwnabpqkxgxbft는 INACTIVE, 조직 free지만 재개 API가 미납 청구서 PaymentRequiredException으로 거부. 사용자에게 인증/결제 직접 조치를 요청했다. 결제·새 유료 자원·권한 확대는 자동 실행하지 않는다. 장애 동안 독립적인 구현·검증은 계속한다.

기준 자료: Google Search AI features, site names, favicon, Organization structured data, 네이버 Search Advisor 기본 SEO, Vercel 배포 문서. 정확한 URL과 구현 결과는 RELEASE_CHECKLIST.md에 기록한다.
