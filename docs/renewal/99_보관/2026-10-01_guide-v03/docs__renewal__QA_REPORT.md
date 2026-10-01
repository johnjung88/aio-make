# AIO MAKE 리뉴얼 후보 검증 v02

2026-10-01 KST · WRK-20261001-WEBSITE-RENEWAL · 담당: 이 대화의 Codex

**로컬 구현·검증 완료 후보이며 운영 배포 완료가 아닙니다.** 계획 v01을 먼저 작성한 뒤 구현했습니다. 기존 저장소와 사용자 원본을 보존하고 독립 작업트리에서 실행했습니다. legacy 보존 파일 364종을 Git 기준 blob과 대조해 내용 변경이 없음을 확인했습니다(362종 tracked, 2종 보조 복사본; CRLF 차이 별도 기록, preservation.json). 아래 결과는 담당 AI의 자기 검증이며 독립 AI 검토가 아닙니다.

## 구현 결과

한국어 공통 홈, 마케팅·개발·영상 대행 페이지, 서비스 상세 13종, 회사·문의·레퍼런스·인사이트·정책 페이지를 구축했습니다. /ko·/KO·/en 제거 301과 UTM 보존, /dev→/lab을 구현했습니다.

관리자 로그인·로그아웃, 문의 페이지 나눔/필터/상태/상담 메모/변경 기록, 레퍼런스·인사이트 편집/공개/비공개, 이미지 업로드 코드, GA4 서버 조회 코드를 구현했습니다. 실데이터 연결 전에는 대시보드 수치를 '—'와 미연결 상태로 표시합니다. 챗봇은 HOLD입니다.

생성 이미지 8종을 실제 화면에 적용했습니다. 원본 PNG, 프롬프트·출처·SHA-256, 최적화 WebP를 보존했습니다. 웹툰·애니메이션·가상 인물은 생성 제작 예시로 표시하고 실제 고객 사례나 직원으로 소개하지 않습니다.

## 실제 실행 결과

|검사|결과|근거·범위|
|---|---|---|
|TypeScript|PASS|typecheck-final.log, tsc --noEmit|
|ESLint|PASS, 오류/경고 0|lint-final.log, 활성 app/components/lib/tests|
|production build|PASS|build-final.log, Next.js 15.5.27. 오류 무시 설정 없음|
|단위·DB 시험|8 PASS|test-final.log. 실제 로컬 PGlite PostgreSQL에서 기존 001/002 스키마+후보 migration 실행|
|HTTP 통합|9 흐름 PASS|http-qa.json. 실제 Next API+루프백 REST 시험 어댑터+로컬 PostgreSQL|
|DB 미연결|PASS|disconnected-qa.json. 유효 문의 요청에 503/success:false, 접수 성공으로 표시하지 않음|
|운영 의존성 보안 감사|알려진 취약점 0|audit-after.json, npm audit --omit=dev. 전체 개발 의존성이나 보안 침투 시험을 뜻하지 않음|
|원본 작업트리|clean|WRK-20260919-002 git status --porcelain 출력 없음|

DB 시험은 원자적 문의 생성, 중복 제출시 같은 접수번호, 중간 저장 실패시 전체 rollback, 상태·메모·audit 기록, rate-limit window, 공개 권리 조건/RLS/함수 권한을 확인했습니다. 운영 Supabase와 Storage 실행 결과는 아닙니다.

HTTP 시험은 미인증 401, 관리자 이동, 301/UTM, 잘못된 Origin·비밀번호, HttpOnly/SameSite=strict 쿠키, 문의 동의·저장·중복 방지, 상담 상태/메모, 공개 콘텐츠 권리·미공개 차단, GA 미연결, 로그아웃을 포함했습니다.

## 실제 브라우저 검증

Windows Chrome에서 직접 화면과 폼을 조작했습니다.

- 주요 공개 화면·로그인·관리자 템플릿을 375/768/1024/1440px에서 점검했습니다.
- 서비스 상세 13종을 PC와 375px에서 점검했습니다.
- 추가 영상 예시 3종을 375/1440px에서 재점검했습니다.
- 총 72개의 폭/템플릿 기록에서 실제 clientWidth와 scrollWidth를 비교했고 가로 넘침이 없었습니다. 15px 스크롤바를 제외한 실제 콘텐츠 폭도 기록했습니다.
- 모바일 메뉴 이동, 개발 데모 테마/장바구니/자동화 동작, 서비스 선택 문의 폼 → 접수번호를 확인했습니다.
- 실제 로그인 창으로 로그인, 저장된 로컬 문의 조회 → 상태 변경/메모 작성 → 재조회, 레퍼런스 권리 확인 → 저장/공개 페이지 → 비공개 404를 확인했습니다.
- DB 시험 연결을 제거한 최종 화면에서 문의/GA 미연결 상태와 임의 수치 미표시를 확인했습니다.
- browser/browser-qa.json, extra-visual-qa.json 및 JPEG 화면을 보존했습니다. local-qa 파일명의 관리자 수치는 시험 데이터이며 실제 실적이 아닙니다.

처음 이미지 로딩 직후의 두 PC 관측은 완료 전이었으므로 화면/로드 완료 후 다시 확인했습니다. 최종 3종 모두 정상 이미지 로드를 확인했습니다. 브라우저 폭 시험은 물리 스마트폰 검증이 아닙니다.

## 외부에서 확인한 사실

GA4 Chrome 실제 화면: 계정 394051405 / 속성 536780274 / 스트림 14842217461 / 측정 G-7R9P2N40RW, https://aio-make.com/ 스트림과 최근 48시간 수집 활성 확인. 설정·권한은 변경하지 않았습니다.

Supabase aio-make(rohodabwnabpqkxgxbft, Seoul)는 커넥터 조회 INACTIVE였습니다. Vercel 커넥터는 UNAUTHORIZED였습니다. 실제 schema/migration/Storage와 배포 환경·rollback 대상은 미확인입니다.

## 운영 적용 전 남은 검증

- Supabase 복구/백업, 실제 테이블·RLS·RPC 대조, 후보 migration 적용 및 Storage 업로드.
- 기존 ERP/cron/Telegram/page-factory 등 실제 사용 중인 연동 보존과 portfolio slug 이전. legacy에 원본만 보존한 기능을 활성 상태라고 주장하지 않습니다.
- GA4 Data API 서버 인증·실제 runReport, 같은 기간 UI 대조, DebugView 수집/페이지뷰 중복·전환 확인.
- Vercel 인증·기존 환경·도메인·배포/rollback 확인, preview와 live smoke.
- 실제 기기, LCP/CLS 측정과 field CWV, 운영 개인정보/보유기간 확정.
- 외부 알림은 구현·발송 시험 완료로 표시하지 않습니다.

다음 절차와 정확한 변경 대상은 RELEASE.md에 기록했습니다. 운영 고객/데이터/계정에 시험 fixture를 전송하지 않았으며 GitHub push·PR·운영 배포·운영 DB 변경을 실행하지 않았습니다.


## 실제 사용·수정·재검증 v02

현행 추가 검증은 [iteration-v02/REPORT.md](iteration-v02/REPORT.md)를 따릅니다. 문의 제목 여백/필수 표시/오류 포커스, 모바일 메뉴, 전체 문의 검색, 편집 내용 보호, 이미지 주소 검증과 미리보기, 저장된 공개 링크, 관리자 버튼 배치, 생성 제품 이미지를 보완했습니다. 최종 타입/린트/build PASS, 단위·SQL 9개 PASS, 기존 HTTP 9동선과 추가 회귀 8동선 PASS. 공개 24개 추가 폭/템플릿 기록을 확인했습니다. 위 v01 기록은 최초 실행 증거이며 최신 실행은 iteration-v02의 로그입니다. 운영 연결·배포는 아직 실행하지 않았습니다.
