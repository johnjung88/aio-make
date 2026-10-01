# 가이드 복원 및 재검증 v03

2026-10-01 KST · WRK-20261001-WEBSITE-RENEWAL · codex/WRK-20261001-WEBSITE-RENEWAL

사용자가 지적한 방향 변경을 바로잡았다. 밝은 메인과 사무실 배경, 세 분야의 서로 다른 구성, 원본 서체·색·카드 순서를 복원하고 문의·관리자·콘텐츠 연결을 유지했다. 이전 후보 bfcc9a4와 원본 작업트리는 보존했다. 로컬 후보이며 운영 배포 전이다.

## 구현

12원본HTML→일반React JSX. 공통 링크/이미지/폼/자료 모듈. DC interpreter·eval·HTML 삽입은 제품에서 실행하지 않는다. 마케팅4/개발4/영상6 서비스, 제작 방향 예시14개, 안내 글9개. /ko·/KO·/en301 및 UTM 보존, /dev→/lab. 챗봇 HOLD.

고객·직원·성과는 명시한 예시/업무 역할로 구분하고 CMS 공개 자료를 우선한다. 생성 원본10종 보존/현재6종 사용. 새 브랜드 필름·마케팅2종의 PNG/WebP·해시·생성 설명 보존.

최신 개발 CURRENTv09/사업v12, 마케팅 CURRENTv58/사업v36, 영상 CURRENTv20/사업v06을 다시 읽어 공개 조건을 맞췄다. 웹1~9페이지10만원/10~20페이지20만원/21페이지부터30만원 이상 별도 견적, 대시보드3만원 추가, 미제공 이미지 AI 제작 포함. Cafe24 복사15만원/기본 이미지 세팅30만원이며 상품 등록·PG/배송 오픈 설정 제외. VAT·납기·수정·지원·결제 견적 협의. 통합 마케팅 월200만원부터/VAT별도/최소3개월, 원본20개→총100회 게시·월별 배분. 영상 검토 후보 가격/수정 횟수를 고정 판매 조건으로 사용하지 않는다.

## 실제 결과

|검사|결과|근거|
|---|---|---|
|최종 production build|PASS|build-complete-final.log|
|최종 TypeScript|PASS|typecheck-complete-final.log; build 후 순차 실행|
|최종 ESLint|PASS, 오류/경고0|lint-complete-final.log|
|최종 단위·SQL|11 PASS|tests-complete-final.log; 로컬 PGlite migration/RPC 포함|
|최종 production URL|56 PASS|smoke-production-delivery.log, smoke-production.json;14서비스/14예시/9글·sitemap/metadata/301|
|사업 조건|4URL PASS|business-conditions-final.json;20/21페이지 경계·Cafe24 제외·통합 시작 가격/기간|
|production HTTP|9+8흐름 PASS|production/http-qa.json, production/http-usability.json;새 격리 PGlite/루프백 REST adapter|
|원본 화면 비교|6쌍 직접 확인|comparison-*-visible-final.jpg;양쪽1385×900·동일 상태|
|Chrome 반응형|47기록 가로 넘침 없음|responsive-delivery.json;14서비스PC+14모바일·기타·tablet·admin|
|브라우저 동선|PASS|browser-flows.json, browser-delivery.json;서비스 변경→접수·로그인→상담/메모·CMS→공개 반영|

HTTP9+8은 production Next+새 임시 DB에서 실행했다. 마지막 공개 문구/ARIA 수정 전 시험이며 해당 서버 저장 로직은 변경하지 않았다. 운영 Supabase/Storage 결과는 아니다. 최종 production 미연결 환경에서 문의503/success:false·새 로그인503·미인증 보호API401 확인. 영속 DB rate limiter 없이 production 로그인하지 않도록 한다. 로컬 dev는 기존 메모리 보호로 시험 로그인/미연결 대시보드를 확인한다.

## 실패·수정 기록

metadata 실패→canonical/OG 수정→PASS. 기존 fixture 재사용 HTTP 수량 실패→새 DB9+8PASS. build/typecheck 동시 실행 .next 타입 경쟁→순차 최종PASS. 사례 배열 정리의 남은 참조 오류→참조 제거→56페이지PASS. DB 없는 production 로그인429→연결 필요503→PASS. 행맞춤·Marketing 카드·모바일 cover·빈 Studio 버튼·Lab 버튼 이름도 수정 후 실제 화면/상태 재확인. 초기 실패/제외 캡처는 삭제하지 않았다.

상세 디자인 판정/캡처 제외 사유는 [design-qa.md](../../../design-qa.md). 최신 기본 viewport 화면은 main-delivery-final.jpg. 자기 검증이며 독립 AI 검토가 아니다.

## 보존·남은 일

원본12HTML SHA 일치, 기존 legacy364개·원본worktree 보존, .env.local 복구 확인. .gitattributes로 가이드/보관 기록/로그 바이트 보존. 시험DB/adapter 종료, 최종 수치 ‘—’.

GA4 UI 속성536780274/G-7R9P2N40RW는 이전 관측이고 서버 인증 미연결. Supabase INACTIVE/Vercel UNAUTHORIZED도 이전 관측이며 이번에 재인증·복구·운영 적용하지 않았다. 실제 schema/RLS/Storage/Advisors NOT_RUN. 운영 연결·ERP/cron/portfolio 이전·개인정보 조건·실기기/CWV·배포는 RELEASE.md를 따른다. GitHub push/PR·계정/권한 변경·운영 배포 없음.

최종 화면 인계 직전 메인 Marketing 세 번째 카드의 분류명이 SNS로 남은 것을 실제 DOM에서 발견했다. 공통 갤러리 분류를 연결된 서비스/CMS service 값으로 계산하도록 고치고 AI 인플루언서 분류·링크를 실제 DOM으로 재확인했다(gallery-delivery-final.json). 변경 뒤 최종 build/type/lint/단위11시험과 production56페이지를 다시 실행해 PASS. 최종 로컬 dev56페이지와 시험 로그인·미연결 관리자 API도 PASS(smoke-development-final.log). Chrome에 공개 홈과 ‘—’ 수치의 관리자 대시보드를 열어두었다(admin-delivery-final.jpg).
