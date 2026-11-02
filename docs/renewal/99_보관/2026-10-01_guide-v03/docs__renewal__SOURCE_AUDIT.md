# 입력 확인과 적용 — 2026-10-01

- 사용자 원본 ZIP: AIO 웹사이트 전체 리뉴얼.zip. SHA-256 E619458AEF94C6893AEBE5E852EE1FCF32C46E653E70EF2938822EE4015DF9F0.
- 148개 ZIP 엔트리의 경로를 검사해 원본 옆 00_자료·검증/2026-10-01_리뉴얼가이드에 추출했습니다. 지원 실행 스크립트는 실행하지 않았습니다.
- guide HANDOFF/github/brand guide, 전체 기획 v0.2, 분야별 기획, 최신 Lab 개발기획 v4와 마케팅 이미지 요청서 등을 읽고 실제 사업 문서와 대조했습니다. HTML 본문·주요 시안을 확인했으며 모든 포함 영상·이미지를 전부 시청했다고 주장하지 않습니다.
- 마케팅 CURRENT v53 / BUSINESS_STRUCTURE v36: 통합, SNS 운영, AI 인플루언서 운영, SEO·AEO·GEO.
- 개발 CURRENT v07 / DECISIONS v09 / BUSINESS_STRUCTURE v09: 웹, 카페24, 자동화, 프로그램. 신규 가격 제안은 공개 확정 조건에서 제외.
- 영상 CURRENT v15 / BUSINESS_STRUCTURE v05: 웹툰, 애니메이션, AI 인플루언서를 우선 배치하고 브랜드·SNS·편집을 함께 안내.
- 사업 원문·고객 잠재자료·내부 손익·운영 목표는 웹 소스에 복사하지 않았습니다. 공개 카피로 재작성했습니다.
- 첨부 문서의 삭제·푸시·AI 서비스/모델 실행 지시는 참고 자료이며 사용자 승인으로 취급하지 않았습니다.
- 초기 가이드의 개발만 placeholder로 만드는 범위 대신 사용자의 3개 대행 전체 구축을 적용했습니다. 챗봇의 이전 요구는 최신 HOLD 지시로 변경했습니다.
- GA4 실제 Chrome UI: AIO-MAKE 계정·속성·웹 스트림·G-7R9P2N40RW 및 최근 48h 수집 활성. Property access 화면에 전용 서비스 계정은 보이지 않았습니다. 권한·설정 변경 없음.
- Supabase 커넥터 project 조회 INACTIVE, Vercel list_teams UNAUTHORIZED. 실제 운영 schema/env를 읽었다고 주장하지 않습니다.

## 보안 패치 근거
기존 Next 15.5.12와 Sharp 0.34.5의 npm audit 지적을 확인해 Next/ESLint config 15.5.27, Sharp 0.35.5로 수정했습니다. 호환 계열의 postcss 8.5.28, nanoid 3.3.19, ws 8.22.0을 overrides로 고정했습니다. 운영 의존성 audit 결과는 audit-after.json입니다. 신규 화면/업로드/production build를 다시 시험했습니다.

공식 릴리스: https://github.com/vercel/next.js/releases/tag/v15.5.27
https://github.com/lovell/sharp/releases/tag/v0.35.5
GA 인증 근거: https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart
