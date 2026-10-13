# RESULT_WP0FIX — 컨텐츠 사이트 공통 셸 결함 수정 (VERIFY_G0 WP0-1, WP0-2)

2026-10-14 · 구현: Opus 서브에이전트(공통 셸 담당) · 기준 HEAD `c0ab7d9` · 커밋 안 함 · 빌드·브라우저 NOT_RUN(Sonnet 검증 몫)

## 변경 파일
| 파일 | 내용 |
|---|---|
| `components/content-site/theme.css` | 격자 열 유틸리티 재작성, `--cs-t-lockup-*` 토큰 + `.cs-t-lockup` 역할, 서비스 버튼 아이콘(`.cs-sheet-toggle-icon`), <768·<480 헤더 규칙. 끝의 WP-D 임시 다리 블록은 건드리지 않음 |
| `components/content-site/shell/header.tsx` | 라벨 클래스 `cs-t-eyebrow` → `cs-t-lockup`, 서비스 버튼 안을 `span.cs-sheet-toggle-text`(서비스) + `span.cs-sheet-toggle-icon`(aria-hidden)으로 바꿈(기존 `↓`/`×` 글자 대신 CSS 두 줄↔× 아이콘). aria-label·aria-expanded·aria-controls·포커스 처리 그대로 |
| `tests/content-site-grid.test.mjs` (신규) | 격자 조합·모바일 헤더 회귀 테스트 3개 |

`blocks/inquiry.tsx`(`cs-col-6 cs-col-start-7`)와 `ui/section-head.tsx`(`cs-col-4 cs-col-start-9`)의 마크업은 바꾸지 않았다. 클래스 이름과 의미가 그대로라 WP-A~D 코드는 수정 없이 맞는다(하위 호환).

## WP0-1 격자 열 유틸리티
원인: `.cs-col-start-M { grid-column-start: M }`이 앞의 `grid-column: span N`의 시작값을 덮어 끝이 `auto`가 되어 1열이 됐다.

수정(≥1024): 폭·시작 클래스는 변수만 정하고 한 규칙이 합친다.
```css
.cs-site .cs-grid > * { --cs-col-start: auto; --cs-col-end: -1; grid-column: 1 / -1; min-width: 0; }
.cs-site .cs-grid > .cs-col-6 { --cs-col-end: span 6; }        /* 3~8 동일 */
.cs-site .cs-grid > .cs-col-start-7 { --cs-col-start: 7; }      /* 7·8·9 */
.cs-site .cs-grid > :is(.cs-col-3, …, .cs-col-start-9) { grid-column: var(--cs-col-start) / var(--cs-col-end); }
```
- `cs-col-6` → `auto / span 6`, `cs-col-start-7` 단독 → `7 / -1`(이전 동작과 같음), 둘 다 → `7 / span 6`.
- 변수 기본값을 격자 자식마다 다시 정해 중첩 격자로 상속되지 않는다.
- 768 미만은 기존처럼 `1 / -1`(한 열), `.cs-col-md-3`은 그대로.

전체 사용처(1440 계산, 테스트가 소스를 훑어 확인): hero `7`+`5`, inquiry `5` + `6@7`(1~5열·7~12열), section-head `7` + `4@9`(9~12열), footer `5`+`4`+`3`. 모두 12열 안.

## WP0-2 모바일 헤더
원인: 390·360에서 로고(108px) + 간격 12 + 오른쪽 묶음 232px(서비스 버튼·움직임 토글·상담 신청)이 본문 폭(350·320)을 넘었다. 같은 계산으로 480~600px 구간도 가로 잠금(로고 + 구분선 + CONTENT STUDIO)이 넘쳤다(G0에서 재지 않은 폭).

수정:
- **<768**: 로고 잠금을 두 줄로 쌓는다(`AIO MAKE` 위, `CONTENT STUDIO` 아래, 구분선 숨김). 라벨은 계속 보인다(사용자가 고른 표기). 헤더 높이 60px 안에 약 40px.
- **<480**: `서비스` 버튼은 44×44 아이콘만(보이는 글자 숨김, 이름은 기존 aria-label `서비스 메뉴 열기/닫기`), 헤더 간격 8px, 오른쪽 묶음 간격 4px, `상담 신청` 좌우 안쪽 여백 16→12px.
- 라벨 역할 `.cs-t-lockup`: 12px · 650 · 행간 1.2, 자간 `clamp(0.5px, calc(0.9vw - 2.4px), 1.68px)`(≥453px에서 기존 eyebrow 자간 0.14em=1.68px과 같아 데스크톱 모양은 그대로, 360에서 약 0.84px). 테마 규칙(12px 이상·@media 안 글자 속성 0) 준수. 라벨이 eyebrow 역할에서 빠져 eyebrow 역할 측정값이 폭마다 1종류로 유지된다.
- 6개 서비스는 <1180에서 이미 시트(드로어)로 들어가 있다(변경 없음). 움직임 토글은 모든 폭에서 헤더에 그대로 보인다.

추정 폭(글꼴 메트릭 기반, 실측 아님): 360 = 로고 잠금 ≈116 + 8 + (44 + 4 + 44 + 4 + 상담 신청 ≈86) ≈ 306 ≤ 320. 390은 여유 약 40px, 480은 두 줄 잠금 ≈127 + 24 + ≈252 ≈ 403 ≤ 432. 지원 하한은 360px(320px는 약 20px 넘칠 수 있음, 범위 밖).

접근성: 포커스 순서 로고 → (≥1180 내비) → 서비스 버튼 → 움직임 토글 → 상담 신청 → 시트 링크 그대로. 아이콘은 border로 그려 강제 색상 모드에서도 보인다. 서비스 버튼의 보이는 글자 `서비스`는 이름 `서비스 메뉴 열기`에 포함된다(2.5.3).

## 검증 (작업트리, 이 수정 후)
- `npm run typecheck`: PASS(exit 0).
- `npm run lint`: 0 errors, 1 warning(기존 `tests/local-admin.test.mjs:110`).
- 직렬 테스트 `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`: tests 75 · pass 72 · fail 0 · skipped 1 · todo 2(7-1·8-1, WP-D 몫으로 기존과 같음).
- 새 테스트를 HEAD의 theme.css에 돌리면 3개 모두 실패함을 확인(회귀 검출 확인 후 수정본으로 되돌림).
- `next build`, 브라우저 실측: NOT_RUN(지시상 금지). 작업트리에는 다른 구현자의 진행 중 파일(ai-influencer·motion-graphics 등)이 함께 있다.

## Sonnet 검증 요청
1. 서비스 6종 `#inquiry` 폼 카드 폭: 1440(≈6/12열, 시작 x가 7열), 1024, 768·390(한 열). 입력칸에 `희망 구성` 값이 잘리지 않는지.
2. `scrollWidth ≤ innerWidth`: 360·390·480·560·768에서 서비스 6종 + `/content` + `/content/contact`. 360에서 `상담 신청` 오른쪽 끝 ≤ 340.
3. 390·360 헤더에 `AIO MAKE` / `CONTENT STUDIO` 두 줄이 보이고 겹치지 않는지, 1440에서는 한 줄 잠금이 이전과 같은지.
4. <480 서비스 아이콘 버튼: 이름 `서비스 메뉴 열기`, 열면 ×로 바뀌고 첫 링크 포커스·Esc 복귀. 움직임 토글 44×44로 보이고 누를 수 있음.
5. section-head `aside`를 쓰는 섹션이 생기면(WP-A~D) 1440에서 9~12열에 놓이는지.

## 미해결
- 1180px 바로 위(가로 내비 + 한 줄 잠금)는 계산상 여유 약 40px로 들어가지만 실측 전이다.
