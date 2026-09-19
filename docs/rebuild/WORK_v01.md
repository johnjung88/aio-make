# 한국어 마케팅 우선 리빌딩 v01
작업: WRK-20260919-002 · 담당: Codex, MAIN-01 Orca 로컬 구현 후보 · 2026-09-19
입력: 사용자 리빌딩 계획, 마케팅 BUSINESS_STRUCTURE_v28 / DECISIONS_v30 / CURRENT_v35.
기존 사이트: johnjung88/aio-make master. 독립 복사본 codex/WRK-20260919-002.
환경 확인: 2026-09-19T14:38:47+09:00 디스크 식별·AIO_MAIN_2TB 통과, ready=true.
적용: 공통 자동화 정책 1.5.0, Next.js 스킬(배포 0.21.4), Supabase 스킬 0.1.2.
목표: 한국어 메인·마케팅·자료실·상담, 상담 기록·콘텐츠 관리, 승인 기반 이메일 연동.
완료 기준: 실제 상담 접수 → Slack 본인 승인 → 이메일 1회 발송 → 회신 연결. 로컬 모의시험과 구분.
현재 외부 실행: 미승인·미실행. 공통 연결 기록상 Slack signing secret/Grok acceptance 미검증.
기존 상담 API는 다중 테이블 순차 삽입·fallback·즉시 이메일/Telegram 알림이며 원자적 저장이 아님.
기존 데이터는 변경하지 않고 신규 상담 저장소와 트랜잭션 RPC를 추가한다. 과거 inbox는 유지한다.

최종 로컬 상태: 구현·프로덕션 빌드·DB/서명/HTTP/Chrome 검증 완료. 코드·시안은 검토 후보이며 외부 배포/발송 미실행.
추가 적용 스킬: vercel:agent-browser (플러그인 배포 0.21.4), CLI 0.38.1. 실제 Chrome 검증 수행.
남은 입력: 운영 설정 위치, 개인정보 안내 확정본, 본인 Slack 식별과 시험 이메일, 실제 실행자 연결·승인 범위.
