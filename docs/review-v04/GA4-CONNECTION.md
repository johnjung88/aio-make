# GA4 대시보드 읽기 연결 — v04

상태: 구현·가상 응답 검증 완료, 실제 Google 조회 인증 미연결. 사용자 승인 대기.

쉽게 말하면 **Google에 모인 방문 통계를 AIO 관리자 화면으로 가져올 권한**이 필요하다. `G-7R9P2N40RW`는 방문 기록을 보내는 측정 ID이고, 속성 `536780274`가 조회 대상이다. 측정 ID만으로 비공개 통계를 읽을 수 없다.

## 승인받을 구체적 설정

- 전용 Google Cloud 프로젝트: `AIO MAKE Analytics` (생성 전 화면 준비, 제안 ID `aio-make-analytics`).
- Analytics Data API 활성화.
- 조회용 서비스 계정: `aio-make-dashboard`. Google Cloud 프로젝트 관리자 역할은 부여하지 않는다.
- GA4 속성 `536780274`에 해당 계정의 **뷰어/보기** 권한만 부여.
- 인증 파일은 서버 전용 보호 경로에 보관하고 `GOOGLE_APPLICATION_CREDENTIALS`에 경로만 등록. Git·공개 폴더·브라우저 코드·채팅에 비밀키를 넣지 않는다.
- 인증 정보 생성·입력 화면은 브라우저 보안 규칙에 따라 필요 시 사용자가 직접 완료한다. 키 생성에 대한 승인을 다른 권한·결제·계약 동의로 확대하지 않는다.

## 실제 연결 후 확인할 항목

1. 로컬 또는 승인된 서버에 속성 ID·인증 경로를 등록하고 서버를 다시 시작한다.
2. 로그인한 관리자 `/admin#analytics`에서 최근 7일을 조회한다. API 응답 `connected:true`, `status:connected`와 화면의 GA4 Data API 출처·조회 시각을 확인한다.
3. 동일 속성·시간대·어제까지의 동일 날짜로 Google Analytics와 방문자/세션/조회/문의 이벤트를 대조한다. 수집 지연·임계값 안내가 있으면 기록한다.
4. 28일·90일, 직전 기간, 채널/페이지/기기, 데이터 없는 기간을 확인한다. 전체 방문자는 일별 방문자의 합과 일치할 필요가 없다.
5. 문의 완료는 성공한 폼 제출에 대한 `generate_lead` 이벤트 수다. GA 동의·차단·수집 지연 때문에 DB의 문의 건수와 다를 수 있다. DB 문의를 GA 성과로 바꾸어 표시하지 않는다.
6. 실제 수치가 표시되는 캡처를 남기고 이 문서와 REPORT의 대기 상태를 갱신한다. 운영 사이트 배포는 별도 상태로 기록한다.

참고: [공식 빠른 시작](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart), [batchRunReports](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/batchRunReports).
