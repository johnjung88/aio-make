# RESULT_R6_WPM · R6 메인 `/` 구현 결과

작성 2026-10-15 · 기준 HEAD `7260219` · 근거 `BRIEF_R6.md` 3·12절, `RESULT_R6_WP0.md`. 커밋·빌드·서버 실행 없음, 포트 3213·3214·3215 미사용.

## 1. 변경 파일

| 파일 | 내용 |
|---|---|
| `components/guide/main.jsx` | 히어로·분야 선택·OUR STANDARD·FAQ·문의 껍데기를 클래스 기반으로 다시 씀. 인라인 `style`은 문의 폼 안쪽과 접수 완료 박스에만 남음 |
| `components/guide/ux.css` | 파일 끝에 `.guide-main` 한정 규칙 추가(히어로, `.main-division*`, `.main-standard*`, `.main-faq*`, `.main-contact*`). 문의 카피 가운데 정렬 규칙(`.main-contact-copy { align-items: center }`)은 제거 |
| `components/home/workflow-journey.css` | `--wj-step-gap`을 `clamp(64px, 7vw, 96px)`로, `.home-division-services` 색을 토큰으로, 주석 갱신 |
| `lib/home-journey.ts` | 소개 h2 "기획부터 성과까지 / 하나로 이어집니다", 소개 lead와 단계 lead 3개의 문장 끝 마침표 제거 |
| `tests/home-journey.test.mjs`, `tests/new-tab-links.test.mjs` | 새 계약에 맞춰 수정과 신규 검사 추가 |

`type.css`·`guide.css`는 손대지 않았다(전역 토큰만 읽음). `lib/home-journey-data.ts`·`journey-*.tsx`·`workflow-journey.tsx`도 변경 없음.

## 2. 항목별 처리

1. **히어로** 왼쪽 정렬(`align-items:flex-start; text-align:left`). 카피는 "분야별 전문가들이 / AI와 함께 일합니다", lead "컨텐츠·마케팅·개발, 필요한 일만 골라 맡기고 결과를 함께 확인하세요", 버튼 "견적 문의"·"제작 예시 살펴보기". lead 폭은 `34em`. 위아래 패딩 64px 고정을 `--section-y`로.
2. **브랜드 소개 영상** 손대지 않음(대칭 영상 가운데 예외).
3. **분야 선택** h2 왼쪽. 카드 순서·번호 `01 개발 → /lab`, `02 마케팅 → /marketing`, `03 컨텐츠 → /content`(새 탭, `NewTabHint` 유지). 영문 이름(Studio/Marketing/Lab)과 상태 칩 삭제, `01 · CONTENT`류 영문 표기 삭제. 카드 4줄은 `번호·분야명 / 한 줄(기존 "시스템을 만드는 분야" 등) / 서비스 나열 / 상담 링크`이고 grid 행은 `auto auto 1fr auto`. 색 hex는 `--ink`·`--violet`·`--lavender`와 `.guide-main` 지역 변수로 옮김.
4. **워크플로우** 단계 간격 `clamp(64px, 7vw, 96px)`, 소개 h2 변경. 단계 3개 순서·레일 수치 테스트는 그대로 통과.
5. **OUR STANDARD** 인라인 패딩·`maxWidth` 삭제, `l-container` + `--section-y`. 인용은 왼쪽 정렬 닫는 문구로 유지하고 크기는 H2 토큰을 따름(기존 24~42px, 600 → 28~44px, 700). 캡션은 "기획 · 제작 · 검수 · 인계" 한 줄. 같은 사실을 반복하던 "AIO MAKE의 작업 기준" 줄은 eyebrow "OUR STANDARD"와 겹쳐 삭제.
6. **FAQ·문의** 공통 `--section-y`, 인라인 예외 삭제. 문의 카피는 `centered-copy main-contact-copy` 때문에 실제로는 가운데 정렬이었으므로 왼쪽 정렬로 맞춤(SURVEY에는 왼쪽으로 적혀 있었음).
7. **카피** 문장 끝 마침표 제거(워크플로우 소개·단계 lead 4개). 새 사실·가격·수량 추가 없음. 'X가 아니라 Y' 구조 없음. 단계 lead의 문장 사이 마침표는 BRIEF 4장 표기처럼 유지.

## 3. 테스트

수정
- `home-journey.test.mjs`: 소개 title·lead 문자열, 단계 lead 원문(마침표만 제거) 갱신, 마침표로 끝나는 문장이 없다는 검사 추가.
- `new-tab-links.test.mjs`: 옛 `gridTemplateRows` 문자열 3회 검사를 `.main-division` 카드 3개와 `.main-division-body { grid-template-rows: auto auto 1fr auto }` 검사로 교체. `/content` 새 탭, `/marketing`·`/lab` 일반 링크 검사는 그대로.

추가(`home-journey.test.mjs`)
- 히어로 왼쪽 정렬·카피·버튼 2개
- 분야 카드 순서·번호·4줄 구성, 영문 이름·칩·옛 번호 부재, h2 왼쪽
- render 본문(문의 폼 앞)에 인라인 `style` 없음, ux.css 메인 블록에 hex 직접 사용 없음(흰색 제외)·가운데 정렬 없음, 5개 섹션이 모두 `padding-block: var(--section-y)`, `.wj` 간격
- OUR STANDARD 닫는 문구·한 줄 캡션·왼쪽 정렬

실행 결과(직렬)
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/home-journey.test.mjs tests/new-tab-links.test.mjs` 22개 PASS (다른 WP 파일이 깨지기 전에 실행)
- `npx tsc --noEmit` PASS (오류 0). 중간에 다른 WP가 쓰던 파일에서 문자열 오류가 잠시 났으나 해당 WP가 고친 뒤 재실행해 통과.
- 위 테스트 22개 재실행 PASS.
- NOT_RUN: `npm run build`, 서버 실행, 390·767·1440px 스크린샷(금지 사항).

## 4. 미결·확인 필요

1. **시각 확인 전부 미실시.** 특히 히어로 왼쪽 정렬이 배경 이미지·오버레이와 어울리는지, 분야 카드 이름(24px 상한)이 옛 Studio(30~40px)보다 약해 보이지 않는지, 390px에서 카드 4줄 높이.
2. **문의 폼 안쪽 인라인 style**(입력칸·칩 hex)은 `InquiryBridge`가 `style`만 받고 `className`을 받지 않아 이번 범위에서 남겼다. 접수 완료 박스도 같다. 칩 색은 `renderVals`의 `bg`/`fg`(hex) 상태 값이다.
3. **인용 문구 크기 변경**(H2 토큰 사용)은 BRIEF의 "공통 기준" 해석이다. 기존 크기를 유지하려면 `.main-standard-quote`의 font 세 줄만 바꾸면 된다.
4. **단계 lead 마침표 제거**는 "3214 원문 유지"와 "문장 끝 마침표 없음" 중 후자를 따른 해석이다(문장 사이 마침표는 유지).
5. `components/guide/main.jsx` 머리 주석("Generated from the preserved design by scripts/restore-guide.py")은 이미 R5에서 직접 편집하는 파일이라 실제와 다르다. 주석은 손대지 않았다.
6. 워크플로우 소개 lead "필요한 단계만 맡기셔도 됩니다 …"와 하단 닫음 문구가 비슷한 취지인지는 시각 확인 때 판단(문구는 유지).
