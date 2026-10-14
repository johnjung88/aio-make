# 메인 범위 정정 · 복원 결과

2026-10-14 · 구현자 자기 정적검사 완료 · 독립 화면검증 대기

사용자 최신 정정에 따라 메인 전체 개편을 철회하고 서비스 소개 카드 뒤 워크플로우만 개발→마케팅→컨텐츠로 반영
컨텐츠사이트 R3는 보존

## 기준과 증거

- 소스 기준9b3def8, cec0de1/502cacc와앱코드동일 (이후문서변경만)
- 보호3214 원본 BUILD_ID VyJyJwD8zeEXO5IGPQ7ZO 및 SHA54E8046B7D219AA9042B8AD1723ADA988C7F8AB5E12CDE8D2191176FB227503B 기존기록동일
- 원본빌드main번들 hero-bg.jpg/기존서비스카드문구 확인, 검증자도3214HTTP실물교차확인
- 빌드커밋문자열은없으므로정확commit을직접읽었다고단정하지않고 코드동일성과빌드보호증거로기준선정

## 복원

components/guide/main.jsx는9b3def8과바이트완전동일
양쪽SHA256 2ac6e67f620c60909f470c826ac8d1228aaa2f0eca3ac92081f7a802cbf8b9eb
기존히어로→회사소개영상→기존서비스소개3카드→워크플로우→OUR STANDARD→FAQ→상담순서복원
메인문구·카드레이아웃·추가섹션을자율재기획하지않음

워크플로우섹션만 개발01→마케팅02→컨텐츠03
레이아웃은기준CSS로복원하고3단계레일진행률만1/3·2/3·1로조정
카드안좌우화살표와컨텐츠내부상세링크는워크플로우안에서유지
컨텐츠열기새탭·검토자료서버게이트보존
FloatingContact의메인(/)인라인숨김효과철회, /content필요동작은유지
공통footer/primitives/globals는9b3def8대비diff0
R2/R3 HomeHero/HomeServices 파일은원본삭제없이남기고main에서참조해제

## 안전 보존

.qa/main-scope-restore/r3-before-20261014T041458Z
명시12파일 copy+source/destination SHA256일치, manifest.json
restore-evidence.json에main기준hash/순서/컨텐츠73파일불변증거
원본삭제·광역checkout/reset없음

## 이번 수정 파일

- components/guide/main.jsx
- components/home/workflow-journey.tsx
- components/home/workflow-journey.css
- lib/home-journey.ts
- components/floating-contact.tsx
- docs/renewal-2026-10-13/BRIEF_MAIN_SCOPE_RESTORE.md
- docs/renewal-2026-10-13/RESULT_MAIN_SCOPE_RESTORE.md

components/home/journey-content.tsx는이번에수정하지않았고 R2의워크플로우내상세링크/카드화살표수정을유지
그밖의컨텐츠R3코드73파일은복원전후SHA256변경0
현재dirty검증tests·서비스6종·컨텐츠데이터사용자변경보존

## 실제 실행과 남은 검증

PASS(자기검사): 문법4파일오류0, diff --check, 기준main바이트동일, 단계순서/번호, 기존섹션순서, 컨텐츠73파일불변
NOT_RUN: 빌드·브라우저·모바일·업데이트미리보기
보호3213/3214 및 R3폰검토3215/3216/터널미변경

검증자요청: 원래3214와메인히어로·카드·영상·FAQ·상담동일화면비교, 카드뒤워크플로우3단계순서/레일/탭/내부링크/모바일, 컨텐츠R3회귀없음
기존폰미리보기는이복원이아직반영되지않았으므로새후보검증후별도반영
