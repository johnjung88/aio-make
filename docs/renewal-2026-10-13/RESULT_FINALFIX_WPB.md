# RESULT FINALFIX WP-B: AI 인플루언서 · 모션그래픽 (VERIFY_FINAL_P2R 재지시)

2026-10-14 · 구현: WP-B 담당 · 기준 HEAD `65b3be7` · 커밋·push·설치 없음 · `next build`/`dev`·브라우저는 지시에 따라 실행하지 않음

**상태: WP-B-1~4 반영 완료. typecheck PASS, lint 오류 0. 직렬 테스트 99개 중 실패 2개. 그중 1개(`content-site.test.mjs` 5)는 이번 WP-B-1 변경 때문에 생긴 실패이고 공용 테스트를 고쳐야 풀린다(4절 요청 1). 나머지 1개는 WP-A 파일에서 났다.**

## 1. 변경 파일 (모두 WP-B 소유)
| 경로 | 내용 |
|---|---|
| `lib/content-site/services/ai-influencer.ts` | `hero.note` 삭제. 범위 `separate`의 `계정 게시와 운영`을 빼고 `구성 밖의 추가 이미지와 영상`·`대량·정기 제작`으로 바꿈. FAQ `SNS 계정 운영도 맡길 수 있나요?`를 삭제함(서비스 고유 FAQ 3개 + 공통 3개 = 6개) |
| `components/content-site/services/ai-influencer/landing.tsx` | 캐릭터 시트 구조 변경: 사진 4장 `ul`(전체 폭) → 프로필 `cs-col-5` → 설정 `dl` `cs-col-7`. 캡션을 프로필 아래로 옮김. 이미지 `sizes`는 `22vw`(≥1024 4열)로 바꿈 |
| `components/content-site/services/ai-influencer/ai-influencer.css` | 시트: <1024는 2×2, ≥1024는 사진 4열 한 줄 + 프로필과 설정 나란히. sticky 제거. 가격 카드 subgrid(아래 3절) 추가 |
| `lib/content-site/services/motion-graphics.ts` | 비교 플랜마다 `word` 추가(`로고와\n핵심 문구` · `캐릭터가\n안내해요`). 스타일 프레임 `word`를 `한 장면\n한 메시지`로 바꿈. 히어로 `움직이는\n메시지`는 그대로 둠 |
| `components/content-site/services/motion-graphics/landing.tsx` | `Composition`에 `tone`(`accent`·`light`·`lime`)을 추가함. 단순형은 light, 맞춤형은 accent(캐릭터 실루엣 대비 유지), 스타일 프레임 두 칸은 lime |
| `components/content-site/services/motion-graphics/motion-graphics.css` | 구도 색을 변수(`--svc-comp-ink/dot/mark`)로 바꾸고 tone별 바탕과 글자색을 정함. light는 `--cs-fg` 바탕에 `--cs-bg` 글자, lime은 `--svc-lime` 바탕에 `--cs-on-accent` 글자. 글자색은 `var(--cs-*)`/`inherit`만 씀 |
| `tests/content-site-wpb.test.mjs` | B-2: `hero.note` 없음, 가격 주석에 계정 문장이 1개, 랜딩 데이터에 계정 게시·운영 표현 0, 시트 5/7 구조, subgrid 검사. B-5: 히어로·단순형·맞춤형·스타일 프레임의 구도 글자가 모두 다르고 두 줄인지 검사 |

공용 파일(`lib/content-pricing.ts`, `blocks/*`, `theme.css`, `tests/content-site.test.mjs`)과 다른 서비스 파일은 고치지 않았다.

## 2. 항목별 처리
- **WP-B-1 (계정 운영 별도 견적 4번)**: 이 안내는 이제 **가격 주석 한 곳**(`lib/content-pricing.ts`의 `계정 게시·운영 및 대량 제작은 별도 견적.`, PRICING_FINAL 원문)에만 나온다. 히어로 안내 줄, 범위의 `계정 게시와 운영`, FAQ 문답은 모두 지웠다. AI 가상인물 표기는 그대로 둔다: 히어로 facts `AI 가상인물 표기 안내`, 가격 위 표기 띠(칩 3개), 표기 FAQ, 모든 87언니 이미지의 `AI 가상인물 · 연출 예시` 태그와 alt.
- **WP-B-2 (시트 오른쪽 약 700px 공백)**: 2×2 사진(약 1,050px 높이) 옆에 짧은 글 열을 두던 배치를 버렸다. ≥1024에서는 기준 이미지 네 장을 턴어라운드처럼 한 줄(1440 기준 장당 약 294×392px)로 두고, 그 아래에 프로필(5/12)과 설정 4행(7/12)을 나란히 둔다. 두 열의 높이가 비슷해서(각각 약 250~300px) 한쪽 열만 길게 비지 않는다. <1024에서는 예전처럼 위에서 아래로 쌓는다.
- **WP-B-3 (`100만 원` 기준선)**: 플랜 이름은 공용 가격 정본 문구라 바꾸지 않았다. 대신 AI 인플루언서 가격 카드만 ≥768에서 `grid-template-rows: subgrid`(이름·금액·링크 3행, `grid-row: span 3`)로 바꿨다. 이름이 두 줄인 카드가 있으면 같은 줄의 카드는 이름 행 높이를 함께 맞추므로 금액 기준선이 나란히 놓인다. `@supports`로 감쌌기 때문에 subgrid를 지원하지 않는 브라우저에서는 공통 flex 카드가 그대로 쓰인다. 선택자는 `.cs-svc-ai-influencer .cs-pricing-grid > .cs-plan`(0,3,0)이라 theme(0,2,0)보다 우선한다.
- **WP-B-4 (같은 보라 구도 5번)**: 구도 글자와 바탕을 섹션마다 다르게 했다. 히어로는 보라 바탕에 `움직이는 메시지`, 단순형은 크림 바탕에 `로고와 핵심 문구`, 맞춤형은 보라 바탕에 캐릭터와 `캐릭터가 안내해요`, 스타일 프레임 두 칸은 연두 바탕에 `한 장면 한 메시지`를 쓴다. 스타일 프레임 두 칸은 같은 화면의 정지 전후를 보여 주는 칸이라 글자를 일부러 같게 뒀다. 모두 장식(`aria-hidden`)이고 `연출 예시` 태그는 유지했다. 움직임 규칙(롱핸드, no-preference 안, 토글 시 `animation-name: none`)은 바꾸지 않았다.
  - 히어로 아래 약 270px 공백은 바꾸지 않았다. 계산해 보면 무대 래퍼 아래 패딩 32px + 공용 히어로 `min-height` 세로 가운데 정렬 여백 약 35px + 히어로 패딩 64px + 다음 섹션 `--cs-section-y` 140px이다. 여섯 서비스가 함께 쓰는 히어로 리듬이라 한 서비스에서만 줄이지 않았다. 줄여야 한다면 공용(theme `.cs-hero`)에서 정하는 게 맞다.

## 3. 카피 점검 (humanizer 기준)
새 문구는 `구성 밖의 추가 이미지와 영상`, `로고와\n핵심 문구`, `캐릭터가\n안내해요`, `한 장면\n한 메시지` 넷이다. 번역투, `A가 아니라 B`, 쉼표 꼬리, 근거 없는 숫자는 없다. 장식 글자는 줄마다 5자 이하라 1440·390 카드 폭 안에 들어간다(계산값이며 실측은 NOT_RUN). 카피 테스트 3(모든 서비스 데이터 문자열)은 PASS다.

## 4. 공용 변경 요청 (조율자·WP0)
1. **`tests/content-site.test.mjs` 5번 (필수)**: 지금은 `strings(contentLandings["ai-influencer"])` 안에 `계정 게시·운영 및 대량 제작은 별도 견적`(예전 `hero.note`)이 있어야 통과한다. 그래서 '한 번만' 지시와 충돌하고, 이번 변경 뒤로 **FAIL**이다. 이 문장은 이미 테스트 2(`pricingPlans("ai-influencer").notes`)가 가격 주석 쪽에서 검사하고 있다. 바꿀 안:
   ```js
   assert.ok(
     !all.some((s) => /계정 (게시|운영)|게시와 운영|게시·운영/.test(s)),
     "account operation note only in pricing notes",
   );
   assert.ok(pricingPlans("ai-influencer").notes.includes("계정 게시·운영 및 대량 제작은 별도 견적."));
   ```
   같은 검사를 WP-B 테스트 B-2에도 넣어 두었다.
2. (선택) `types.ts`의 `hero.note` 주석 예시(`AI 인플루언서의 별도 견적 안내`)는 이제 맞지 않는다. 지금 이 필드를 쓰는 서비스가 없으면 주석만 고치거나 필드를 정리해도 된다.
3. (선택) 공용 가격 카드(`theme.css .cs-plan`)에도 같은 subgrid를 넣으면 다른 서비스(웹툰 묶음 카드 등)의 금액 기준선도 맞는다. 그렇게 되면 WP-B 쪽 규칙은 지운다.

## 5. 실행한 검증
- `npm run typecheck` → PASS(출력 없음).
- `npm run lint` → `0 errors, 1 warning`(기존 `tests/local-admin.test.mjs:110`).
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`(실제 작업트리, 다른 WP가 동시에 작업 중) → `tests 99 · pass 96 · fail 2 · skipped 1`.
  - `content-site-wpb.test.mjs` B-1~B-5는 모두 PASS다. `content-site.test.mjs`의 1·2·3·4·6·6-1·7·7-1·8·8-1·8-2·8-3·9·10·10-1도 PASS다(CSS 선택자 범위·글자색·움직임 규칙 포함).
  - FAIL `content-site.test.mjs` 5: 이번 WP-B-1 변경 때문에 난 실패다. 4절 요청 1의 공용 테스트 수정이 필요하다.
  - FAIL `content-site-wpa.test.mjs` A-8: WP-A 웹툰 데이터 작업 중에 난 실패이고 WP-B와 관계없다.

### NOT_RUN (지시에 따라 실행하지 않음, V 몫)
`npm run build`, 서버·브라우저 실측: 1440/1024/768/390/360에서 시트 4열·5/7 배치 높이 균형, 가격 카드 금액 기준선(subgrid) 실측, 모션그래픽 tone별 대비·장식 글자 폭, 가로 넘침, 움직임 토글·reduced-motion 재확인.
