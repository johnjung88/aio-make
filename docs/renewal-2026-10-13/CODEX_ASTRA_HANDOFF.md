# Codex Astra 인수 지침 (Claude 사용량 한도 도달 시)

Claude(Opus 조율)의 사용량이 막히면 그 지점에서 Claude는 멈추고, 이 문서를 받은 Codex(`gpt-6-astra`)가 이어서 진행한다.

## 먼저 읽기 (순서대로)
1. `docs/renewal-2026-10-13/HANDOFF_RESUME.md` — 목표, 사용자 결정 1~12, 현재 상태, 다음에 할 일. **'현재 상태' 또는 '지금 실행 중' 절이 기준이다.**
2. `docs/renewal-2026-10-13/COMMON.md` — 금지·품질·검증 규칙.
3. 현재 단계의 BRIEF와 마지막 `RESULT_*`, `VERIFY_*` 문서.
4. `git status`, `git log --oneline -10` — 마지막 커밋 이후 커밋되지 않은 중간 변경이 있으면 그것부터 파악한다(Claude가 작업 도중 멈췄을 수 있다).

## 진행 규칙
- 작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`, 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`.
- **HANDOFF_RESUME의 상태가 "사용자 디자인 확인 대기"이거나 사용자 답변을 기다리는 중이면 코드를 바꾸지 않는다.** 이 경우 상태만 확인하고 HANDOFF_RESUME에 "Codex Astra 인수, 대기 유지" 한 줄을 남기고 끝낸다.
- 그 외에는 '다음에 할 일'의 첫 항목부터 이어서 한다. 구현 후 자체 검증(typecheck, lint 오류 0, 직렬 테스트, 필요 시 build와 브라우저 점검)을 하고, 결과를 `RESULT_<단계>_ASTRA.md`에 실제 출력과 함께 남긴다. 실행하지 못한 검증은 NOT_RUN.
- 직렬 테스트: `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`
- 이 PC는 메모리가 부족하다. 빌드·서버는 한 번에 하나, 검증 서버는 포트 3215만 쓰고 끝나면 종료한다. 3213·3214는 사용자 미리보기이므로 건드리지 않는다.
- 18개 고객 레퍼런스는 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"`일 때만 노출(서버 전용 선택). 가격은 `PRICING_FINAL_2026-10-14.md`만 사용. AI 인플루언서 표현은 `FACTS_AI_INFLUENCER.md`.
- **금지:** push, 배포, Vercel/DB/계정/환경변수 변경, 패키지 설치, 비밀값 읽기, 삭제성 정리(폴더 정리 P6는 사용자 확인 전 실행 금지).
- 커밋은 해도 된다(검증 통과한 단위로, 메시지 끝에 `Co-Authored-By: Codex gpt-6-astra`). 커밋 메시지는 파일로 `git commit -F`.
- 끝나면 `HANDOFF_RESUME.md`의 현재 상태를 갱신하고, Claude가 돌아와 이어받을 수 있게 "Codex Astra 진행 내역" 절에 한 일·남은 일·주의점을 적는다.
