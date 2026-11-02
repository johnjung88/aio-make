# RESULT_FINALFIX_SHARED

## 공용 셸 수정

2026-10-14 · 구현: Claude(공용 파일 담당) · 기준 HEAD `65b3be7` · 근거: `VERIFY_FINAL_P2R.md` 재지시 '공용 셸' SHARED-1~4 · 커밋·푸시·설치·빌드·dev 서버·브라우저 실행 없음.

### 변경 파일
| 파일 | 항목 | 내용 |
|---|---|---|
| `components/content-site/ui/price.tsx` | SHARED-1 | 단위를 `.cs-price-units > .cs-price-row`로 감쌌다. props(`id`)는 그대로 |
| `components/content-site/theme.css` | SHARED-1 | 새 마크업은 모든 단위 앞에 같은 폭(`--cs-price-sep` = `--cs-s5` 24px)의 `·`를 그리고, 행을 그 폭만큼 왼쪽으로 당겨 `.cs-price-units`(`overflow:hidden`)에서 잘라낸다. 줄이 접혀도 줄 머리의 구분점은 잘리고 줄 끝에는 구분점이 생기지 않는다. 폭과 무관하게 동작한다. 이전 마크업(단위가 `.cs-price` 바로 아래, `components/content-home/service-detail.tsx`의 `ch-price`)은 `.cs-price > .cs-price-unit + .cs-price-unit::before`로 기존 동작 유지 |
| `components/content-site/blocks/process.tsx`, `theme.css` | SHARED-2 | 과정 아래 수정 기준 문장(`PRICING_COMMON.revisions`)과 `.cs-process-note` 규칙 삭제. 수정 기준은 가격 주석에만 남는다. props 그대로 |
| `lib/content-site/faq.ts`, `tests/content-site.test.mjs` | SHARED-2 | 공통 FAQ 세 번째 답 `대량 제작과 정기 제작은 따로 견적을 드립니다. 편수와 일정을…` → `네. 편수와 일정을 알려주시면 범위와 견적을 따로 안내합니다.` 가격 주석 문장이 FAQ에서 되풀이되지 않는다. 테스트 기대값을 바꾸고, 서비스 FAQ 답에 `PRICING_COMMON_LINES` 문장이 들어가지 않는지와 `process.tsx`가 `PRICING_COMMON`을 쓰지 않는지 단언을 추가했다 |
| `components/content-site/ui/section-head.tsx`, `theme.css` | SHARED-3 | lead를 오른쪽 4/12 열에서 왼쪽 7/12 열(`.cs-head-main`)의 h2 아래로 옮겼다(`.cs-head-lead`, h2→lead 간격 s4+s1=s5 유지, `max-width:36em`). eyebrow·h2·lead의 left가 로고 left와 같은 선이 된다. `aside`(예: `/content` 홈 서비스 보기 전환 버튼)는 기존처럼 ≥1024 오른쪽 4/12 아래 정렬. props(`id/eyebrow/title/lead/aside`) 그대로 |
| `components/content-site/shell/footer.tsx`, `theme.css` | SHARED-4 | 이메일 표시·mailto를 소문자 `aiomake2023@gmail.com`로. `AIO MAKE 홈 →` 링크에 `gap: var(--cs-s2)`로 화살표 간격 |

### 결정 사항
- SHARED-3: BRIEF_P2R 125행(오른쪽 4/12 lead)과 293행(lead left = 로고 left)이 충돌했다. 조율자 지시가 '정렬 불일치 수정'이라 293행 기준으로 맞췄다. BRIEF 125행은 이번 구현과 다르다(문서는 수정하지 않음).
- SHARED-4: 메인 푸터(`components/site-shell.tsx`)·`lib/seo.ts`는 대문자 그대로다. 컨텐츠 푸터만 소문자다(공유 범위 밖이라 손대지 않음).
- 공통 FAQ 첫 답(`기획안을 받은 뒤 2회, 최종안을 받은 뒤 1회 수정할 수 있습니다…`)은 질문에 직접 답하는 문장이고 가격 주석과 문장이 달라 유지했다. 같은 사실을 줄이려면 조율자 판단.
- `lib/content-site/faq.ts`와 `tests/content-site.test.mjs`는 지정 소유 범위(ui/blocks/shell/theme.css) 밖이지만, SHARED-2에 적힌 대량·정기 문장 중복을 고칠 수 있는 유일한 공용 위치라 수정했다. 서비스별 파일과 `lib/content-pricing.ts`(WP-B-1 대상)는 건드리지 않았다.

### 검증
| 명령 | 결과 |
|---|---|
| `npm run typecheck` | PASS (exit 0) |
| `npm run lint` | PASS (오류 0, 기존 경고 1 `tests/local-admin.test.mjs:110`) |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | PASS (tests 99 · pass 98 · fail 0 · skipped 1 기존 로컬 미디어 게이트). 다른 구현자의 진행 중 변경이 작업트리에 함께 있는 상태에서 실행 |
| `npm run build`, 360·390·1024·1440 실측·스크린샷 | NOT_RUN (지시상 build/dev/브라우저 금지). 가격 칩 줄머리 구분점, lead left, 푸터 화살표 간격은 검증자 재측정 필요 |
