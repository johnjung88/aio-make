# 공통 작업 규칙 (모든 BRIEF에 적용)

작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`
브랜치: `codex/WRK-20261013-AIO-CONTENT-RENEWAL` (기준 커밋 `db002f7`)
프로젝트 문서 폴더(읽기 참고만): `I:/AIO_OS/01_WORK/01_에이전시/00_AIO 웹사이트`

## 역할
- 계획·명세: Claude Opus / 구현: 너(Codex) / 검증: Claude Sonnet. 너는 BRIEF의 범위만 구현한다.
- 구현 후 반드시 `docs/renewal-2026-10-13/RESULT_<단계>.md`에 변경 파일, 결정 사항, 실행한 검증 명령과 결과, 미해결 사항을 쓴다. 실행하지 않은 검증은 NOT_RUN으로 적는다.

## 금지
- push, 배포, Vercel/Supabase/DB/계정/환경변수 변경, 패키지 신규 설치(필요하면 RESULT에 사유만 적고 멈춘다), 비밀값 읽기·출력.
- `git commit`은 하지 않는다 (Opus가 단계 검증 후 커밋).
- `public/reference-review/` 원본 파일 삭제·덮어쓰기 금지 (gitignore 대상이지만 로컬 자산이다).
- 근거 없는 고객 성과·매출·가격·후기·수치 작성 금지. 가격은 "맞춤 견적". AI 생성 이미지·가상 그래프를 실제 실적으로 표현 금지(필요하면 "연출 예시" 표기).
- 18개 고객 레퍼런스의 공개 권리는 UNKNOWN/HOLD다. `visibility:"review"`와 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW` 게이트, noindex, 사이트맵 제외를 약화하지 않는다.

## 품질 기준
- 한국어 UI 카피는 자연스러운 한국어. "~을 통해", "~에 대해", 과한 쉼표·번역투, "A가 아니라 B" 반복, "A, B, C 없이" 나열, 문장 끝에 쉼표절을 이어 붙이는 문체 금지. 문구는 짧고 구체적으로.
- 디자인 토큰은 기존 `app/globals.css`의 `--ink --paper --violet --lavender --muted --line --max` 와 Pretendard를 유지한다. 신규 UI는 인라인 style 대신 클래스 CSS(파일 단위)를 쓴다.
- 접근성: 의미 있는 heading 순서, 이미지 alt, 키보드 포커스, `prefers-reduced-motion` 대응.
- 반응형: 1440 / 768 / 390 / 360px에서 가로 넘침 0.

## 검증 명령 (작업트리에서)
- `npm run typecheck`
- `npm run lint` (오류 0; 기존 경고 1개는 허용)
- 테스트는 병렬 실행 시 `inquiry-direct`, `local-admin` 두 파일이 시간 초과로 간헐 실패한다(기준선에서 확인됨). 직렬로 실행한다:
  `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`
- `npm run build`

## 기준선
- 직렬 테스트 22개 중 실패 0, 타입 검사 PASS (2026-10-13, 기준 커밋).
