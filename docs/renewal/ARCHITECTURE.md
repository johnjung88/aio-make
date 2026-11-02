# AIO MAKE 가이드 기준 구현 v03

## 화면과 콘텐츠

- app/(public): 공통 홈·회사/업무 역할, 3개 분야, 14개 서비스, 3개 분야 문의와 전체 문의, 작업/인사이트 목록·상세, 정책 안내.
- components/guide/*.jsx: 12개 가이드 HTML에서 변환한 일반 React 화면. 링크·이미지·폼·자료 연결은 별도 primitives/inquiry-bridge로 집중합니다. eval, HTML injection, DC 편집 interpreter, 원본 데모 영상은 제품에서 실행하지 않습니다.
- scripts/restore-guide.py: 재현 가능한 소스 변환 및 명시적 사업/제품 문구 보완. guide-source/manifest.json과 iteration-v03/source-preservation.json으로 원본 바이트를 대조합니다.
- guide.css/source-hover.css: 원본 토큰·레이아웃·상태 효과, 공통 헤더/푸터와 반응형 보완. Pretendard와 로컬 Unbounded/JetBrains Mono 사용, 라이선스 파일 보존.
- lib/content.ts: 마케팅4/개발4/영상6 서비스 분류. lib/guide-content.ts: 고객 실적과 구분한 제작 방향 예시14개와 안내 글9개. CMS 공개 자료 우선으로 병합합니다.
- lib/development-offers.ts: 개발 사업v12의 페이지 구간·대시보드 추가·Cafe24 포함/제외 조건을 공통 데이터로 관리합니다.
- components/entries.tsx/reference-filters.tsx: 분야별 목록·상세와 실제 서비스 필터.

## 문의·관리자·연결

- InquiryBridge: 가이드 폼 선택값을 API 형식으로 정규화. 동의, 이메일 또는 전화, 중복 방지 UUID, 상태/포커스, 저장 성공 뒤 접수번호를 표시합니다. 선택 서비스 변경은 초기 URL보다 우선합니다.
- app/admin: 별도 로그인과 보호된 관리 화면. 문의 검색/필터/페이지 나눔, 상태·상담 메모와 변경 기록, 콘텐츠 저장/공개/권리 확인, 이미지 경로 검사·미리보기와 Storage 업로드 경로.
- lib/domain.ts: Zod 입력 검사, 미디어 허용 경로, 상태명, JSON-LD escaping. lib/session.ts/auth.ts: 서명된 8시간 HttpOnly/SameSite Strict 세션, 서버 인증.
- lib/db.ts: server-only service-role 접근. 기존 leads/quote_requests/conversations와 신규 website_entries를 사용합니다. 홈/CMS 페이지는 동적 렌더링으로 변경을 반영합니다.
- lib/ga.ts: 서비스 계정 OAuth와 읽기 전용 GA4 보고서. 인증이 없으면 미연결과 ‘—’ 표시. localhost와 admin에서 GA 수집을 하지 않고 고객 개인정보를 이벤트에 보내지 않습니다.
- 20260930174544_website_renewal.sql: CMS/Storage/rate-limit와 원자적 문의 RPC. 기존 문의 직접 anonymous write 정책 제거는 실제 연동 확인 후 운영에 적용합니다. 기존 업무 테이블은 삭제하지 않습니다.
- Chatbot: HOLD. 활성 위젯/API/AI 서비스 인증 없음.
- production 로그인은 영속 DB rate limiter가 미연결이면503으로 중단합니다. 로컬 dev 시험의 메모리 보호와 운영 연결 검증을 구분합니다.

## 보존과 실행 환경

원본 worktree와 legacy 364개를 보존합니다. 거절된 v02도 Git 커밋 bfcc9a4에 남습니다. .env.local/.qa/node_modules/.next는 ignored입니다. Windows local만 사용하며 dev는 .next-dev, production은 .next를 사용합니다. 두 서버/빌드를 동시에 돌려 검증하지 않습니다. 운영 전환과 롤백은 RELEASE.md를 따릅니다.
