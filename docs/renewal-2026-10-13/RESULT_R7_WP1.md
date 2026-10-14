# RESULT_R7_WP1 · 메인 셸·개발 단계 (BRIEF_R7 §2-1·§2-2)

작업 2026-10-15 · 구현 담당 WP-1 · 빌드·서버·커밋·push 없음 · 화면 육안 검증 없음(WP-V 몫)

## 변경 파일

| 파일 | 내용 |
|---|---|
| `lib/home-journey.ts` | 단계 lead 3개를 문장마다 `\n`으로 나눔(문구 그대로, 중간 마침표만 줄바꿈으로). `devServiceLinks`·`devFallbackTabs`·`devCopy.workLink/serviceLink/beforeHold`·마케팅 `links`·컨텐츠 `stepLinks/serviceLink/workLink`·`ContentTab.chips` 삭제. 단일 사례용 `devFallback`(쇼핑몰 제작 1장), `DevDetail`, 단일 `DevProject`, `HomeJourneyData.devProject`(null 가능) 추가. 중립 라벨 `devCopy` 재구성 |
| `lib/home-journey-data.ts` | `devProjects`·`selectDevProjects` → `devProjectConfig`(bwl-store 1건)·`selectDevProject`. `beforeShots`는 bwl-store만. `detail`(title·status·description·purpose·scope)만 클라이언트로 전달(WorkItem 전체 제거). 환경 게이트 4곳 유지 |
| `components/home/workflow-journey.tsx` | `LinkRow`·`JourneyAnchor`·링크 데이터 삭제, 개발 본문을 `<JourneyDev project=...>`로 연결 |
| `components/home/workflow-journey.css` | 링크·칩·개발 구 프레임·구 모달·마케팅 4박스(.wj-cycle/node/loop/arrow/branches 스타일) CSS 삭제. 모바일 타임라인 `padding-left:32px`와 세로선 삭제, 점 12px을 eyebrow 줄 안으로 이동. lead `pre-line`+`text-wrap:pretty`. 설명문 16px(≤429)/토큰(≥430), 1440에서 폭 32em(640px). 설명문→본문 간격 32/40/48, 단계 간격 64/80/88/96 |
| `components/home/journey-dev.tsx` (재작성) | 탭 없는 단일 사례. 제목 h3 1개 + 비교 블록 + 상세 모달. 공개판은 `project=null`이라 쇼핑몰 제작 단독 프레임 |
| `components/home/journey-dev-compare.tsx` (신규) | 비교 블록. PC·모바일 쌍 2벌 렌더, CSS로 표시 전환. ≥768 슬라이더(`role=slider`, ←/→ 5%, Shift 20%, Home/End, aria-valuetext, Pointer capture, 6px 미만 탭=모달 열기, 진입 시 50→35→65→50 스윕 1회). <768 BEFORE/AFTER 세그먼트(`aria-pressed`, 300ms 크로스페이드, 진입 시 BEFORE 1.2초 후 AFTER 1회). PC/모바일 기기 전환, 출처 캡션. reduced-motion이면 안내 모션 없음. 인라인 style 속성 0(CSS 변수는 ref로 설정) |
| `components/home/journey-detail-dialog.tsx` (신규) | 네이티브 `<dialog>`+`showModal()`. 닫기 버튼 첫 포커스, ESC·닫기·백드롭 닫힘, Tab 순환 트랩, 닫히면 연 버튼으로 포커스 복귀, `aria-labelledby`=h2. 모달 안 BEFORE/AFTER·PC/모바일 전환. 링크 없음. 검토판은 title·status·description·purpose·scope(한계 문구 유지), 공개판은 제목·설명 한 문장·4단계 목록 |
| `components/home/journey-dev.css` (신규) | 비교 프레임·세그먼트·핸들·모달. 모달 ≥1024 `min(1120px,92vw)`/90dvh 2열, 768~1023 `min(720px,94vw)`, <768 전체 화면 시트(100dvh, safe-area), `html:has(dialog[open]){overflow:hidden}`, `overscroll-behavior:contain` |
| `components/home/journey-content.tsx` | **소유 밖 최소 수정**(아래 남은 문제 1). 서비스·작업 링크 블록과 칩 목록, 관련 import만 삭제 |
| `tests/home-journey.test.mjs` | 기존 단언 갱신(3상태 누수·단일 사례·lead `\n`·칩 제거·단계 간격·CSS 토큰 검사를 새 CSS까지 확장) + R7 신규 5건 |
| `tests/new-tab-links.test.mjs` | LinkRow·JourneyAnchor·콘텐츠 서비스 링크 기대 삭제(활성 카드 새 탭 검사는 WP-3 테스트로 이동) |
| `components/home/journey-tabs.tsx` | 변경 없음(개발 전용 코드가 원래 없었음. 컨텐츠 단계가 WP-3까지 계속 사용) |

## 인수 기준별 확인

| 기준 | 확인 |
|---|---|
| 공개 HTML에 "작업 자세히 보기"·"서비스 자세히 보기"·"웹사이트 제작 →"·"쇼핑몰 제작 →"·"통합 마케팅 →"·"SNS 대행 운영 →"·"SEO·AEO·GEO →" 0건 | 소스 7개 파일에서 해당 문자열·`LinkRow`·`.wj-links` 0건을 테스트로 확인(공개 HTML 실측은 WP-V) |
| 개발 단계 `.wj-tab`·`[role=tablist]`·사례 전환 막대 0개, 사례 제목 1개 | `journey-dev.tsx`에 `JourneyTabList`·`tablist` 없음(테스트). h3 1개 구조 |
| 검토판 `devProject`는 bwl-store 1건, 힐러넷·요프리 계열 0건 | 테스트(`devProject` JSON + 구성값). 컨텐츠 단계 `contentReviewSlugs`는 대상 밖(BRIEF §2-2) |
| ≥768 슬라이더 키보드·aria-valuetext, ≤767 BEFORE/AFTER `aria-pressed` | 소스 단언(테스트) |
| 모달 ESC·닫기·백드롭·포커스 복귀 | 네이티브 dialog(ESC), 닫기 버튼, 백드롭 `target===currentTarget`, `onClose`에서 opener 포커스(테스트로 코드 존재 확인) |
| 공개판 JSON·HTML에 고객명·slug·reference-review 0건 | 3상태(unset·0·true) 테스트 통과, `devProject:null`, `"detail"` 키 0건 |
| 설명문 시작 x = 소개 블록 x | 모바일 `padding-left:32px` 삭제로 x=거터. 실측은 WP-V |
| 설명문 문장당 1줄 | lead 3개 모두 `\n` 1회(2문장), `pre-line`+`text-wrap:pretty` |
| BWL 캡처 원본 사용 | 자르기·확대 없음(`object-fit:cover; object-position:top` 공통 규칙만). 테스트가 scale·오른쪽 정렬 부재 확인 |
| 인라인 style 0, wheel 리스너 0 | 기존 테스트가 새 파일 포함해 통과 |

## 테스트 결과

- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/home-journey.test.mjs tests/new-tab-links.test.mjs` → 28건 중 28 통과, 실패 0.
- `npx tsc --noEmit` → 오류 0(마지막 실행 시점 기준).
- `npx eslint components/home lib/home-journey.ts lib/home-journey-data.ts` → 경고·오류 없음.

## 남은 문제와 다음 담당에게

1. **`journey-content.tsx`는 WP-3 소유인데 최소 수정했다.** 링크 줄 삭제 인수 기준을 맞추려면 컨텐츠 단계의 "서비스 자세히 보기·작업 자세히 보기" 블록도 지워야 해서, 링크 블록·칩 목록·import만 삭제했다. 탭 6개·이전/다음·`contentCopy.prev/next`·`.wj-tabs/.wj-tab/.wj-stage-nav/.wj-step-button` CSS는 WP-3 재작성까지 **그대로 남아 있다**(WP-3가 함께 정리). 활성 카드 새 탭 링크는 WP-3가 새로 만든다.
2. **마케팅 단계는 WP-2 전까지 임시 상태다.** `MarketingBody`와 `marketingPanel`(nodes·branches)은 WP-2가 삭제하도록 남겼고, 이 컴포넌트의 4박스·화살표·루프 CSS는 지시대로 삭제해서 임시로 스타일이 없는 목록으로 보인다. `.wj-link` 스타일은 branches 앵커가 쓰므로 남겼다.
3. 단계 간격 `--wj-step-gap`을 명세표(64/80/88/96)에 맞춰 `clamp(64,7vw,96)`에서 구간 값으로 바꿨다. 닫는 문구 위 간격도 같은 변수를 쓰므로 함께 바뀐다.
4. 설명문 글자 16px(≤429)는 타입 토큰(17px 하한)에서 벗어난 명세 값이라 `--wj-step-lead-size` 커스텀 속성으로만 적용했다(타입 선언은 토큰만 쓴다는 테스트 유지).
5. **화면 검증 미실시.** 빌드·서버 금지라 폭 6개 실측, 슬라이더 드래그·터치 충돌, 모달 포커스, 모바일 BEFORE→AFTER 자동 전환, 설명문 줄 수·마지막 줄 40%, 타임라인 점 위치는 WP-V에서 확인해야 한다. 특히 1) 모바일 쌍/PC 쌍 2벌을 CSS로 전환하는 구조(숨은 쪽 이미지는 lazy라 받지 않음), 2) `.wj-media` 진입 모션과 슬라이더 좌표 계산이 겹치는지, 3) 모달 `html:has(dialog[open])` 스크롤 잠금을 봐 달라.
6. 파일 줄바꿈: 스크립트 수정 중 일부가 CRLF로 바뀌어 LF로 되돌렸다(`git ls-files --eol` 기준 index와 동일).
