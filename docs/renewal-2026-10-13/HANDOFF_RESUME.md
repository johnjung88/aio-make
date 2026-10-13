# 이어서 작업하기 (대화 클리어 후 여기서 시작)

최종 갱신: 2026-10-14 · 작성: Opus(조율) · 새 세션은 이 파일 → `COMMON.md` → 해당 단계 BRIEF 순서로 읽는다.

## 목표
AIO MAKE 홈페이지(aio-make.com) 리뉴얼. 더 전문적으로, 작업물 레퍼런스 반영, 레퍼런스를 계속 추가할 수 있게. 마지막에 `I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트` **폴더 정리**(이 폴더 내부만, 상위 규칙 적용 금지, 삭제 없이 이동·SHA 매니페스트·구경로→신경로 대응표).

## 사용자 작업 규칙
- **(2026-10-14 변경) 구현·검증·조사 모두 이 대화 안의 병렬 서브에이전트(Agent 도구)로 한다.** 구현은 opus 서브에이전트, 검증은 sonnet 서브에이전트. Orca 외부 워커·codex exec는 더 쓰지 않는다(W2까지만 Orca/Codex로 진행). 메인(Opus)은 계획·지시·커밋만, 코드를 직접 고치지 않는다. FAIL은 구현 서브에이전트에 재지시.
- 서브에이전트끼리 파일 소유 범위를 나눠 동시에 돌리고, 빌드·브라우저 검사는 검증 에이전트 하나만 순차로(메모리 부족 PC, `.next` 공유).
- 폴더 정리 결정(P6): 웹툰 폴더 v01→v02 이름 변경, 중복 파일 144그룹은 99_보관으로 이동(대응표 기록). `개발표준_적용연결_v01.md`는 루트 유지(권장안). simulation·검증 문서 이동으로 깨지는 외부 문서 6개 처리 방식은 미정(P6 실행 때 다시 확인).
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

9. (2026-10-14 추가) `/content` 서비스 소개에 **시작가 표시**(PRICING_FINAL 금액만, 부가세 별도). 메인의 기존 'AI로 효율을 높이고 / 전문가가 품질을 지킵니다' 과정 섹션은 **삭제**(워크플로우와 중복). AI 인플루언서는 **브랜드 전용 AI 인물 제작 중심 + 계정 운영은 별도 견적**. `/content` 히어로는 **사용자가 컨텐츠 쇼릴을 따로 제공 예정** → 그 전까지 자리만 만들고 영상 슬롯은 데이터 한 줄로 교체 가능하게.

10. (2026-10-14 추가, 핵심 방향) **컨텐츠 카테고리는 하나의 별도 사이트처럼 상품화한다.** 광고 유입 랜딩이 각 서비스 페이지로 연결되므로(예: SNS 광고 관심 고객 → SNS 광고 서비스 페이지), 서비스 페이지는 AIO MAKE 로고 외에는 기존 페이지를 참고하지 말고 서비스 품질·특성이 강조되게 전혀 다르게 만든다. 이 원리는 이후 개발·마케팅 리뉴얼에도 적용. 서비스 페이지 벤치마킹 시안(완벽하진 않지만 이 구조 중심으로 발전): `I:\00_AIO_CODEX\2026-10-14\aio-make-1-aio-make-https\outputs\aio-service-pages-v01`, `...\outputs\service-benchmark-v01`. 재기획 지시서 `BRIEF_P2R.md`(작성 중, 병렬 작업 패키지 WP0 공통 셸 → WP-A/B/C 서비스별, WP-D /content 정렬).
10-1. (P2R 결정) 헤더 표기 **AIO MAKE CONTENT STUDIO**. 메인 사이트 링크는 **헤더에 없음, 푸터에만**. 벤치마킹 시안의 **AIO 생성 이미지는 '연출 예시' 표기로 사용 가능**(타사 캡처·로고 금지). **87언니 캐릭터는 자체 AI 가상인물 IP로 공개 가능**(AI 가상인물 표기, 계정 운영 성과 언급 금지). BRIEF_P2R의 나머지 미결 질문은 권장안으로 진행.
10-2. VERIFY_P34 FAIL 처리: P3(/content) 지적 P3-1~5는 WP-D(컨텐츠 홈 재정렬)에서 함께 해결, P4 지적 P4-1~3·FIX-1은 즉시 수정 에이전트로.
11. 사용량 한도 대비: 이 세션에 매시 17분 자동 재개 점검(cron, 세션 한정, 7일 만료)을 걸어 둠. 대화를 클리어하거나 세션을 끄면 사라지므로 새 세션에서 다시 걸 것.

## 병렬 산출물 (2026-10-14)
- `AUDIT_TYPOGRAPHY.md`: 전역 타이포 감사. 근본 원인 = Unbounded/JetBrains Mono에 한글 글리프 없음(한글이 OS 폰트로), review.css `!important` 제목 규칙, line-height normal, 컨테이너 정의 7종. P0~P4 일괄 수정 목록. 주의: `!important` 제거와 제목 클래스 추가는 같은 커밋, `--font-body`를 `<html>`로.
- `BRIEF_P3.md`: `/content` 재구성(3D 캐러셀+리스트 대체, 시작가, 과정 5탭, 레퍼런스 그리드·인사이트 제거). 히어로는 결정 9대로 쇼릴 슬롯.
- `PLAN_P6_FOLDER.md`: 프로젝트 폴더 정리 계획(작성 중이거나 완료).
- 실행 순서: W1 검증·커밋 → W2 전역 타이포(AUDIT) → P4 메인 → P3 /content → (가이드 도착 시) 서비스 6종 → P6 폴더. 메모리 때문에 Codex 빌드는 한 번에 하나, 조사·기획은 병렬 에이전트.

## 다음에 바로 할 일 (2026-10-14 사용량 한도 도달 시점, HEAD `8f24d16`, 작업트리 깨끗함, 실행 중 에이전트 없음)
1. 병렬 서브에이전트 2개 동시 실행: (a) **P4 수정**(opus): `VERIFY_P34.md`의 P4-1 화살표 간격(`workflow-journey.css:124`), P4-2 `#divisions` 카드 제목 높이(`main.jsx:398`), P4-3 미사용 `workGroups`(`main.jsx:65`)·옛 문구(`primitives.tsx:316`), FIX-1 `home-references.tsx` 클라이언트 import 정리. 빌드 금지. (b) **P2R WP0**(opus): `BRIEF_P2R.md`의 WP0(컨텐츠 사이트 공통 셸·토큰·블록·라우트·테스트, 서비스별 자리 파일), 결정 10-1 반영. 빌드 금지, 파일 소유 분리.
2. Sonnet 검증(G0 + P4 수정) → 커밋 → WP-A/B/C/D 4개 동시 구현(WP-D에 VERIFY_P34의 P3-1~5 포함) → Sonnet 최종 검증 → 커밋 → 사용자 디자인 확인.
3. 이후: 사용자 확인 후 push, P6 폴더 정리(`PLAN_P6_FOLDER.md`, 외부 문서 6개 처리 방식 확인 필요).

## 진행 중 (이력)
- **P3·P4 커밋** `8f24d16` (VERIFY_P34: FAIL 경미, 위 1번에서 처리).
- **W1 완료**: 커밋 `9998b0b` (VERIFY_W1 PASS).
- **W2**: Codex(Orca 마지막 작업)로 구현, 커밋 `0e8be3b`(검증 전 스냅샷). Sonnet 서브에이전트가 `.qa/w2-verify/src` 스냅샷에서 검증 중 → `VERIFY_W2.md`. FAIL이면 수정 커밋 추가.
- **P4 메인 워크플로우 / P3 /content**: 이 대화의 Opus 서브에이전트 2개가 동시에 구현 중(파일 소유 분리, 빌드 안 함) → `RESULT_P4.md`, `RESULT_P3.md`. 끝나면 Sonnet 서브에이전트 하나가 P3+P4 함께 빌드·브라우저 검증 → 커밋 → 사용자 디자인 확인.
- BRIEF_P3·P4 결정 반영 완료, `PLAN_P6_FOLDER.md` 완료(P6는 맨 마지막).
- (이력) **W1 재시도**(Orca dispatch `ctx_559566636f31`, Codex): 앵커 줄 제거, `/work`·`/content/work`·작업 사례 탭 301 없이 삭제, 서브 내비 타이포 통일. 첫 시도 `ctx_8019af469d7b`는 PC 메모리 부족으로 Codex가 죽어 stopped(변경 없음). 끝나면 `RESULT_W1.md` → Sonnet 검증 → 커밋.
- **P4**: `BRIEF_P4.md` 작성 완료(커밋 `87c39cc`). W1 커밋 후 Codex 실행. 실행 시 덮어쓸 결정: 사용자 흐름은 5단계(상담→브랜드 가이드→개발→컨텐츠→마케팅, 데이터 개선은 마케팅 안), 지시서의 별도 '성과 개선' 6단계는 마케팅에 합친다. `about.jsx` 옛 서비스 문구도 6종으로 고친다. 기존 `#process` 섹션 중복 여부는 사용자 디자인 확인 때 묻는다.
- 2026-10-14 메모리 정리(사용자 승인): 옛 aio-make Next 서버(포트 3100·3212·3238, 10-03·10-12 작업트리) 종료, 끝난 Orca 워커 터미널 3개 닫음. 3213·3214 미리보기는 유지.

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
