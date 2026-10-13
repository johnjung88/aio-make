# 이어서 작업하기 (대화 클리어 후 여기서 시작)

최종 갱신: 2026-10-14 · 작성: Opus(조율) · 새 세션은 이 파일 → `COMMON.md` → 해당 단계 BRIEF 순서로 읽는다.

## 목표
AIO MAKE 홈페이지(aio-make.com) 리뉴얼. 더 전문적으로, 작업물 레퍼런스 반영, 레퍼런스를 계속 추가할 수 있게. 마지막에 `I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트` **폴더 정리**(이 폴더 내부만, 상위 규칙 적용 금지, 삭제 없이 이동·SHA 매니페스트·구경로→신경로 대응표).

## 사용자 작업 규칙
- 계획 Opus 5.5 high / 구현 Codex `gpt-6.1-sol` xhigh / 검증 Claude Sonnet high, **전부 Orca 오케스트레이션**(`orca orchestration worker-start`). 메인에서 코드를 직접 고치지 않는다. FAIL은 Codex에 재지시.
- 메인 대화는 핵심만. 조사·리서치·문서 읽기는 병렬 에이전트에 맡기고 요약만 가져온다. 한국어로 답한다.
- push·배포는 사용자 확인 후. 18개 고객 레퍼런스는 공개 권리 UNKNOWN/HOLD(review 게이트·noindex·사이트맵 제외 유지).

## 위치
- 코드 작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL` · 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- 커밋: `db002f7`(이전 후보) → `4c62a58`(P1) → `1c8a76f`(P2). 이후 W1은 미커밋 진행 중.
- Orca: 작업트리를 repo로 등록함. worktree 선택자 `id:a4d9cd9a-f0d5-4acc-8324-a1ca4717901a::I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`, Run `run_2a47ef8c61c5`.
- 미리보기: 포트 3214에 P2 커밋 빌드(검토 플래그 켬)가 떠 있을 수 있음. 3213은 옛 버전.
- 이 폴더 문서: `PRICING_SOURCE_2026-10-14.md`(웹사이트·쇼핑몰 1~2번), `PRICING_FINAL_2026-10-14.md`(컨텐츠 3~9번, 최신 정본), `BRIEF_P1/P2/P4.md`, `RESULT_*`, `VERIFY_*`.

## 완료
- P1: 컨텐츠 서비스 6종(webtoon, animation, ai-influencer, motion-graphics, brand-film, ad), editing 삭제·301, 레퍼런스 `content/works/*.json` 18개 + `npm run works:build`(등록법은 `docs/REFERENCES.md`).
- P2: `components/content-service/` + `lib/content-service-plans.ts`로 서비스 상세 6개 재구축, 웹툰 24컷→12컷. Sonnet 검증 PASS. **그러나 사용자 디자인 확인에서 카피·폰트·배치·디자인 전부 "이상하다"는 판정 → 재기획 필요.**

## 사용자 피드백·결정 (2026-10-14)
1. 서비스 페이지의 둘째 줄 앵커(소개·제작 범위 등) 제거. 서비스 페이지는 원페이지 소개.
2. 서비스 페이지 카피·폰트·배치·디자인 전면 재작업. **서비스별 벤치마킹 가이드를 사용자가 각각 따로 전달 예정** → 도착 전에는 시작하지 않는다(가격 반영도 그때 함께).
3. `/work`(레퍼런스 목록) 페이지, `/content/work`(작업 사례 목록)와 탭: **301 없이 완전 삭제**. 마케팅·개발의 work는 유지.
4. 작업 사례 눌렀을 때 나오던 상세 디자인도 정리 대상(서비스 페이지 제작 사례 → `/work/[slug]` 상세는 일단 유지, 디자인 재정리는 서비스 가이드 도착 후).
5. 폰트·간격 일관성을 세심한 곳까지 점검(상단 서브 내비의 '컨텐츠' 라벨 간격이 대표 사례).
6. 가격은 `PRICING_FINAL`대로. 웹툰은 제작(12컷 10만/24컷 18만)과 모션코믹(30초 7.5만/60초 12만) 분리, 합계 안내 포함. SNS 광고·숏폼 30초 25만/60초 45만.
7. 메인 벤치마킹: `I:\00_AIO_CODEX\2026-10-14\new-chat\outputs\aio-content-v01\`(Codex 시안, 스튜디오좋 캐러셀·Superpixel 단계 탭·Demo Duck 필터/상세). 메인은 이 룩을 참고하되 워크플로우 구조로.
8. 메인 구조: 메인의 '브랜드의 이야기를 이렇게 만들었습니다' 섹션을 교체. 상담 → 자료 취합·브랜드 가이드 → 개발(기존 vs 새로 만든 것) → 컨텐츠(6종) → 마케팅(플랜·운영·데이터 개선)이 스크롤로 이어지고 그 안에 실제 레퍼런스를 넣는다. 메인 서비스 문구는 '웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상'.

## 진행 중
- **W1**(Orca dispatch `ctx_8019af469d7b`, Codex): 앵커 줄 제거, `/work`·`/content/work` 삭제(범위 변경 메시지 전달함), 서브 내비 타이포 통일. 끝나면 `RESULT_W1.md` → Sonnet 검증 → 커밋.
- **P4 지시서**: 에이전트가 `BRIEF_P4.md` 작성 중. 있으면 읽고 Codex에 보낸다.

## 남은 순서
1. W1 검증·커밋 → 2. P4(메인 워크플로우) Codex 실행·Sonnet 검증 → 사용자 디자인 확인 → 3. 서비스별 벤치마킹 가이드 도착 시 서비스 페이지 6종 재기획(P2 재작업, 가격 포함) → 4. `/content` 홈(서비스 6개 소개 블록, 레퍼런스 그리드 제거) → 5. 전체 검증, 사용자 확인 후 push → 6. 프로젝트 폴더 정리(`00_AIO 웹사이트`, 계획은 `C:\Users\PC\.claude\plans\i-aio-os-01-work-01-00-aio-modular-wreath.md` P6) → CURRENT·인수인계 문서 갱신.

## 확인 필요
- AI 인플루언서: 사실 기준은 `FACTS_AI_INFLUENCER.md`. 사례 3편은 자체 AI 가상인물 87언니가 출연한 닥터시크릿 제안용 시안(계정 게시 콘텐츠 없음). 서비스 페이지 재작업 때 라벨을 "87언니(AI 가상인물) 출연 · 제안용 시안"으로 정정.
- 개발 단계 '기존 vs 새로 만든 것'의 기존 사이트 캡처가 고객 폴더에 있는지.

## 실행법·함정
- worker 시작: `orca orchestration worker-start --spec <자체완결 명세> --worktree <선택자> --agent codex --model gpt-6.1-sol --effort xhigh --run <run> --json` (stderr 경고가 JSON을 깨므로 `2>$null`). 검증은 `--agent claude --model claude-sonnet-5-5 --effort high`.
- 명세는 [Target][Change][Constraints][Ownership][Acceptance]를 모두 담는다. 완료는 `orca orchestration check --wait --types worker_done,escalation,question --timeout-ms 570000`(전경 실행), 처리 후 `--ack`, 끝난 worker는 `worker-release`.
- worker-start가 `outcome_unknown / turn_start_unobserved`이면 입력창에 붙여넣기만 되고 Enter가 안 눌린 것이다. `worker-read --dispatch <id>`로 확인 후 `orca terminal send --terminal <handle> --enter` 한 번. 재시작 금지.
- `codex exec -s workspace-write` 직접 실행 금지(이 PC 샌드박스 오류). 사용자 config 기본(danger-full-access)을 따른다.
- 저장소는 sparse-checkout(cone). 새 최상위 폴더는 `git sparse-checkout add <dir>`(content 추가함).
- 테스트는 직렬만 신뢰: `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`.
- 이 PC는 메모리가 자주 부족하다. 빌드·서버는 한 번에 하나, 터미널 소유 표시(user_takeover)된 worker는 release가 retained가 되며 닫지 않는다.
- 커밋은 메시지 파일로 `git commit -F`. 푸쉬는 `git push -u origin codex/WRK-20261013-AIO-CONTENT-RENEWAL`(사용자 확인 후).
