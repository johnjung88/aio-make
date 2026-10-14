# RESULT_R7_FIX1 · R7 검증 FAIL 5건 수정

2026-10-15 · 대상 HEAD `833210c`(커밋 안 함) · 근거 `VERIFY_R7.md` F-1~F-5 · 빌드·서버 기동·커밋·push 없음, 3213·3214·3215(PID 28652) 건드리지 않음.

## 확인 방법 (서버 없이)

`.qa/r7-verify/pub-evidence/pub_*.html`과 `next-public-build/static`을 Playwright `page.route`로 가짜 origin(`http://localhost:59999`)에 연결한 뒤 소스 CSS를 `addStyleTag`로 덧입혀 Chrome에서 측정했다(서버 프로세스 없음). 수정 전 값은 VERIFY_R7 수치(번호 y 2.8/3.4, 푸터 700.2/668.7/676.7, 간격 75.8/16.4/0, 옆 카드 클릭 `ul.wjc-track`)를 그대로 재현했다. 설명문 줄바꿈은 새 TSX가 빌드에 없어서 같은 CSS 위에 DOM 쪽에서 같은 문장 분리를 적용해 측정했다. 소스 TSX 자체의 렌더(`<span class="wj-lead-line">`)는 빌드 검증(WP-V 재검증)이 필요하다.

## 항목별

| # | 원인 | 수정 | 수정 후 측정 |
|---|---|---|---|
| 1 메인 설명문 | Chrome `text-wrap: pretty`는 마지막 줄 한 단어만 막는다. `balance`는 `pre-line` 문단에서 첫 문장만 균형을 맞춘다(문장 2는 99%+32%로 남음). 430px(박스 390)에서 17px면 마케팅 4줄 | `workflow-journey.tsx`에 `LeadText`(문장 `\n`마다 `<span class="wj-lead-line">`, 문구 그대로). `workflow-journey.css`: `.wj-lead` `text-wrap: balance`, `.wj-lead-line {display:block; text-wrap:balance}`. 설명문 16px 구간을 `<430`에서 `<480`으로 확대(430에서 3줄 이내) | 마지막 줄 비율 최소 46%(전 폭). 줄 수(개발/마케팅/컨텐츠): 360 = 3/4/4, 390 = 3/4/3, 430 = 3/3/2(≤3), 480 = 3/3/2, 768+ = 문장당 1줄. 마케팅 430 문장1은 98%로 한 줄(한 줄 한계 폭 약 382px, 박스 390) |
| 2 마케팅 번호·제목 y | `.wj-mk-step-head`가 `align-items: baseline`이라 14px 번호 박스가 제목 박스보다 아래로 놓임 | `journey-marketing.css` `align-items: center` | 360~1440 전 행 중심 차이 0(1440은 -0.01) |
| 3 푸터 서비스 링크 간격 | 768~1023에서 열이 내용 폭(103px)으로 줄고 `column-gap` 0 | `theme.css` 768~1023 `.cs-footer-links--services { column-gap: var(--cs-s6) }` | 가장 붙었던 3줄 간격 0 → 32px(768·800·900·1023 모두) |
| 4 옆 카드 클릭(≥768) | 3D 캐러셀에서 투명 `ul.wjc-track`이 z=0 평면에서 뒤쪽 옆 카드를 가려 클릭을 받음(`elementFromPoint` = `wjc-track`) | `journey-content.css` ≥768 `.wjc-track { pointer-events: none }`, `.wjc-card { pointer-events: auto }`(hidden·far 카드의 `pointer-events:none`은 유지) | 768·1024·1440: 옆 카드 클릭이 `wjc-select`에 닿고 활성 카드가 바뀜(webtoon → animation 등). 1440에서 ±1·±2 카드 모두 선택됨. 활성 카드 링크 `a.wjc-open` `target=_blank` `rel="noopener noreferrer"` 유지 |
| 5 푸터 높이(≥768) | 위 여백 64, 사업자 정보 4줄 세로, 아래 블록 간격 48~64 | `theme.css` ≥768: `.cs-footer` `padding-block: 48px var(--cs-s7)`, `.cs-footer-bottom` `margin-top: 48px`(1024·1440 개별 규칙 삭제), `.cs-footer-biz` `display:flex; flex-wrap:wrap; column-gap:24px; row-gap:4px`(4줄 → 1~2줄). 링크 글자·터치 높이 44 유지 | 768 = 628.6(≤640), 1024 = 589.1(≤600), 1440 = 561.3(≤600). 360 = 810.3, 390·430 = 786.5 변화 없음, 767 = 754.7. 가로 스크롤 0. 서비스 링크 15~16px |

## 변경 파일

- `components/home/workflow-journey.tsx`, `components/home/workflow-journey.css`
- `components/home/journey-marketing.css`, `components/home/journey-content.css`
- `components/content-site/theme.css`
- 테스트: `tests/home-journey.test.mjs`(`balance`·`.wj-lead-line`·`max-width: 479.98px` 16px), `tests/home-content-cards.test.mjs`(R7-fix1 pointer-events 신규), `tests/home-marketing-sim.test.mjs`(`align-items: center`), `tests/content-site-wpa.test.mjs`(R7-fix1 푸터 간격·높이 규칙 신규)

## 검증

- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1` 각각: home-journey 22/22, home-content-cards 13/13, home-marketing-sim 14/14, content-site 27/27, content-site-wpa 14/14, new-tab-links 6/6, content-home 20/20(전부 통과)
- `npx tsc --noEmit` 오류 0, `npx eslint components/home/workflow-journey.tsx` 오류 0

## 남은 것·주의

- 설명문 16px 구간이 480px 미만으로 늘어 430px에서 17px → 16px(타입 토큰 17px 하한과 다른 명세 값, `--wj-step-lead-size`로만 적용). 줄 수 ≤3을 지키려면 카피를 바꾸지 않는 한 필요했다. 480~767은 17px, 줄 수 3.
- 푸터 ≥768에서 사업자 정보가 줄바꿈 가로 흐름이 되어 항목 사이는 24px 간격만 둔다(구분자 문자 없음). 1024에서 이메일이 둘째 줄로 내려간다.
- 검증 담당이 새 빌드로 폭 6개 재측정해야 한다(특히 설명문 `wj-lead-line` 렌더, 옆 카드 클릭, 푸터 높이).
