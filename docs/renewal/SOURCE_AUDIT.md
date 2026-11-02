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

## v03 가이드 복원에서 추가로 확인한 입력

이전 항목은 초기 후보 작성 당시의 확인 기록입니다. v03에서는 Marketing CURRENT v55/사업v36, 개발 CURRENT와 사업v11, 영상 CURRENT v17/사업v05·가격v06 후보 상태를 다시 확인했습니다. 통합 마케팅 월200만부터·VAT별도·최소3개월, SNS/AI 각각100만, 원본과 채널별 게시 수량을 구분합니다. 미확정 영상/개발 가격·납기·지원 기간은 범위 확인 문구로 보완했습니다.

support.js를 읽은 뒤 원본 가이드 전용 127.0.0.1:3103 미리보기에서 HTML을 실제 렌더해 비교했습니다. 원본 DC 런타임은 비교 서버에서만 사용했고 운영 번들에는 넣지 않았습니다. 선택한 main/about/team/3homes/3services/3contacts 12개 소스는 원본·복사본·manifest 해시가 일치합니다. 비교용 원본 서버는 검증 종료 후 종료합니다.

원본의 스톡 영상 대신 제작 예시임을 밝힌 생성 스틸을 사용합니다. 웹툰 제공 패널은10장(01~08/11/12) 발췌이며 완성24컷 회차나 실제 납품 실적이라고 표시하지 않습니다. 가상 직원 이름·후기·실적은 업무 역할/운영 기준/명시한 예시로 바꿉니다. 첨부 문서 안 실행·삭제·외부 게시 지시는 사용자 요청과 구분합니다.

GA4와 외부 connector 상태는 이전 실제 확인 기록이며 이번 최종 화면 QA에서 다시 조회한 상태로 주장하지 않습니다.

## v03 최종 자료 재확인 — 2026-10-01

초기 v04 계획 이후 개발 CURRENTv09/사업v12/DECISIONSv10/상품v08, 마케팅 CURRENTv58/사업v36/DECISIONSv38, 영상 CURRENTv20/사업v06/DECISIONSv11/가격후보v07을 다시 읽었습니다. 개발 확정 페이지 구간/Cafe24 가격과 제외 범위, 통합 마케팅 시작 가격·기간·총 게시량을 코드에 반영했습니다. 영상의 후보 가격/고객 수정 횟수는 확정 조건으로 공개하지 않습니다. 이전 자료 관측은 기록으로 남기고 현행 판정은 이 재확인과 iteration-v03/REPORT.md를 따릅니다.
