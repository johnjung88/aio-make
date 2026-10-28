# 문의 추적 1단계

갱신일: 2026-10-28 · 개정번호: 1 · 상태: PC2 Codex W-A1 · 구현·로컬 검증용

업무 정본은 AIO_SHARED `00_CONTROL/02_기준 변경/29_외주화면정리_261028/60_W-A1_PC2문의추적/00_명세.MD`(추가 1 포함)와 같은 폴더 `01_보고.MD`다. 상세 요구는 `04_SNS 채널/01_AIO_CONTENTS/00_계정정보/01_문의추적_GA_개발전달.MD` 개정 4의 4절이다. 운영 배포와 병합은 이 작업 범위에 없다.

`lib/tracking-config.ts`의 계정 표 한 곳에서 캠페인을 관리한다. `/go` 라우트는 허용된 코드·매체·콘텐츠 식별자·링크 위치로만 307을 만들고, 잘못된 값은 query 없는 `/content/contact`로 이동한다. 임의 URL·UTM·개인정보 query는 전달하지 않는다.

`lib/attribution.ts`가 기존 sessionStorage와 독립적으로 쿠키를 다룬다. `aio_first_touch`는 최초 UTM·랜딩·ISO 날짜를 90일 유지하며 덮어쓰지 않는다. `gclid`·`fbclid`·`NaPm` 쿠키는 각각 최근 정상값으로 갱신한다. Path=/, SameSite=Lax, HTTPS에서는 Secure다. 쿠키와 sessionStorage 접근을 각각 예외 처리한다. 문의 입력값은 쿠키에 넣지 않는다.

기존 JSON envelope payload에 purpose·found_via·attribution.firstTouch·attribution.clickIds를 보존하고, 기존 관리자 adapter에서 `leads.source_meta`로 표시한다. 새 테이블·열·마이그레이션은 없다. 과거 envelope 검증은 호환성을 유지하고, 신규 `/content` 경로 제출에는 서버의 trackedContactSchema가 목적을 요구한다. 목적·발견 경로는 열거형만 받는다.

관리자 필터는 JSON 경로를 사용한 parameterized SQL로 페이지 나누기 전에 적용한다. 같은 인증 API의 `format=csv`는 같은 필터로 전체 결과를 500건씩 내보낸다. CSV는 UTF-8 BOM이며 수식 주입 문자를 escape한다. 클릭ID는 상세·CSV 모두 유무만 표시한다. 내보낸 CSV에는 문의 연락처가 있으므로 실제 고객 자료를 Git·일반 로그에 보관하지 않는다.

`components/tracking.tsx`는 경로·CTA·상세 글을 추적한다. 현재 콘텐츠 모델에 없는 industry·biz_type은 빈 값으로 보내며 추정하지 않는다. YouTube iframe이 있을 때만 공식 IFrame API를 로드하고 실제 PLAYING 상태(1)에 한 번 전송한다. 현재 공개 코드에는 YouTube iframe 사용처가 없어 로컬 시험에서 공급자 콜백을 모의한다. 자체 MP4 자동재생은 YouTube 재생 이벤트에 포함하지 않는다.

폼 시작은 폼별 첫 입력 1회, 검증 오류는 실패한 제출의 필드 이름만 기록한다. aio_lead는 성공 응답의 inquiryId·duplicate=false를 확인한 뒤 ID당 한 번 기록한다. 실패·중복 응답과 ID 없는 응답은 전송하지 않는다. 이벤트 helper는 사전에 정의한 필드만 복사한다. 기존 GA4 직접 설치와 generate_lead는 유지한다. GTM·광고 픽셀·전환 API·처리방침 게시 변경은 없다.

## 검증

```text
npm run build
npm run typecheck
npm run lint
npm test
node --conditions=react-server --experimental-strip-types --test tests/tracking.test.mjs
node tests/tracking-browser.mjs
```

브라우저 시험은 별도로 설치된 Playwright를 사용한다. 기본 module 이름은 `playwright`, 기존 설치를 쓸 때 `PLAYWRIGHT_MODULE`에 module URL을 지정한다. `AIO_TRACKING_EVIDENCE`로 결과 폴더를, `AIO_TRACKING_PORT`로 비어 있는 loopback 포트(기본 3128)를 지정한다. 스크립트는 무작위 로컬 인증값과 새 PGlite 디렉터리를 만들며 운영 환경변수를 자식 프로세스로 전달하지 않는다. 이메일 발송·운영 DB 접근은 없다. 시험 후 생성한 서버와 브라우저를 종료한다.

실제 휴대폰의 유튜브·인스타 앱 내 브라우저, 실제 YouTube 재생, GA4 계정 수신, 운영 배포 검증은 로컬 Chromium·모의 공급자 시험과 구분해 공유 보고에 기록한다. 사이트맵은 기존 app/sitemap.ts를 유지한다.
