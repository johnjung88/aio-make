# P4 결과: 메인 레퍼런스 섹션 → 스크롤 워크플로우 5단계

2026-10-14 · 구현: Opus 서브에이전트 · 기준 HEAD `0e8be3b`(W1·W2 커밋 위) · 커밋·push·배포·설치 없음

**상태: 구현 완료, 로컬 자체 검사만 PASS.** 빌드·브라우저·타이포 실측은 메모리 제약 지시에 따라 실행하지 않았다(NOT_RUN, 별도 검증 담당).

## 선행 조건 확인
- `git log`: `0e8be3b`(W2) · `9998b0b`(W1) 커밋됨. 시작 시 `git status`의 미커밋 변경은 `HANDOFF_RESUME.md`(조율 문서)뿐이었다.
- `app/globals.css`에 W2 토큰(`--ff-text`, `--type-*`, `--gutter`, `--container`, `--section-y`)이 있고, `components/guide/type.css`에 `.t-*` 역할 클래스가 있다. review.css의 일반 `.guide-page h1/h2 !important` 글자 규칙은 없다(남은 `.guide-page h1 [data-fit-line]`은 하위 요소 규칙).
- 작업 중 다른 구현자(P3)의 `app/(public)/[division]/page.tsx`, `lib/content.ts`, `lib/content-home.ts`, `components/content-home/`, `tests/seo-http.mjs`, `scripts/verify-reference-pages.mjs`, `tests/content-home.test.mjs` 변경이 함께 보인다. 이 파일들은 건드리지 않았다.

## 변경 파일
| 파일 | 내용 |
|---|---|
| `lib/home-journey.ts` (신규) | 단계·카피·탭 구성·slug 선택·대체 이미지·before 캡처 맵. JSX 없음. 고객 문자열(개발 탭 라벨, before 경로, 컨텐츠 slug, 87언니 라벨)은 각 삼항에 `process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"`을 직접 적어 플래그 끈 빌드에서 상수 접힘으로 빠지게 했다 |
| `components/home/workflow-journey.tsx` (신규, client) | 섹션·레일·단계 5개·01/02/05 패널·마무리 CTA, IntersectionObserver 1개 |
| `components/home/journey-dev.tsx` (신규) | 03 개발: 프로젝트 탭, 기존/AIO 브라우저 프레임 비교, 폰 프레임, HOLD 자리, 공유 `<dialog>` 확대 보기, 기본 빌드 대체 탭 |
| `components/home/journey-content.tsx` (신규) | 04 컨텐츠: 6개 탭, 미디어 무대, 3D 옆 미리보기, 이전·다음 |
| `components/home/journey-tabs.tsx` (신규) | 공용 탭 목록(roving tabindex, ←/→/Home/End) |
| `components/home/workflow-journey.css` (신규) | 이 섹션 전용 CSS + `#divisions` 목록 `.home-division-services` |
| `components/guide/main.jsx` | 아래 "main.jsx 변경" |
| `components/guide/about.jsx` | 문자열 1개만 6종 문구로 교체 |
| `tests/home-journey.test.mjs` (신규) | BRIEF 테스트 1~9 |
| `public/reference-review/{bwl-store,healernet-website}/before-{pc,mobile}.webp` (신규, gitignore) | 기존 사이트 캡처 상단 자르기 |
| `docs/renewal-2026-10-13/RESULT_P4.md` | 이 문서 |

### main.jsx 변경
- `import { HomeReferences } from "./home-references"` → `import { WorkflowJourney } from "@/components/home/workflow-journey"`, `<HomeReferences …/>` → `<WorkflowJourney entries={this.props.entries} />`
- FAQ: `브랜드 홍보 및 SNS 광고 영상` → `브랜드 홍보 영상, SNS 광고 영상`
- `#divisions` 세 카드 목록을 `<span className="home-division-services t-small">` 하나로 통일하고 인라인 style(`fontSize clamp`, 색, 여백)과 `p1-content-service-list`·`t-wrap`을 뺐다. 항목은 파일 상단 `divisionServiceItems()`가 `<span>항목 ·</span>` 단위로 감싼다(span `white-space: nowrap`). 화면 텍스트는 `웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상` 그대로이고, 줄바꿈은 `·` 뒤 공백에서만 일어난다. 필수 문구 원문은 main.jsx에 문자열로 남아 있다.
- `#process` 섹션(`main-method`, h2 `AI로 효율을 높이고 / 전문가가 품질을 지킵니다`, 4단계 ol, Unbounded 인라인 숫자 4곳) 153줄 삭제. OUR STANDARD·FAQ·`#contact`는 그대로다.
- `import "./studio-p1.css"` 삭제: 유일한 사용처 `.p1-content-service-list`가 사라져 사용처 0건(grep 확인). 파일 자체는 수정·삭제하지 않았다.
- Prettier로 형식만 맞췄다(HEAD 파일도 Prettier 통과 상태였다).

## before 캡처 변환 (기존 화면 규칙)
일회성 스크립트(`sharp` 0.35.5, 작업트리 node_modules)로 원본 왼쪽 위에서 PC `1440×900`, 모바일 `390×844`를 잘라 webp quality 80으로 저장했다. 리터치·배너 제거 없음(BWL PC 캡처에는 원래 있던 쿠키 배너가 그대로 보인다). 원본은 읽기만 했다. 고객 폴더 절대경로는 저장소 코드에 넣지 않았다.

```
sharp(src).extract({ left: 0, top: 0, width: W, height: H }).webp({ quality: 80 }).toFile(out)
```

| 원본(`01_영업관리/03_잠재고객/…`) | 원본 크기 | 원본 SHA-256 | 출력 | 출력 크기·바이트 | 출력 SHA-256 |
|---|---|---|---|---|---|
| `261010_BWL/00_기존 자료/05_웹사이트_캡처/kr_home_pc.png` | 1440×4439 | `1b146ed9f71af368157dbe64563c7d4b52daec8026a87efb742b72d5eaac71f0` | `public/reference-review/bwl-store/before-pc.webp` | 1440×900 · 50,306 | `be4b1c1288a5127a407a3bc0cb154468a98d8a0abf3b1c23db43782493965c34` |
| `261010_BWL/00_기존 자료/05_웹사이트_캡처/kr_home_mo.png` | 390×7027 | `7ffdf9784825f58d86be07cfea98bf9924e8a033cd6879ec9452131446c8fad7` | `public/reference-review/bwl-store/before-mobile.webp` | 390×844 · 25,600 | `22c2832e87cbf9cfdbbd0afa2703ab9cfc39bf82ac95db47b6ba153d9daa4281` |
| `261010_힐러넷/00_기존 자료/08_사이트_캡처/캡처_index_1440_20261010.png` | 1440×7094 | `984286b5b0b9f1c502fac68e45bbef4a90304cc09d5f486160cab62d250d7cdf` | `public/reference-review/healernet-website/before-pc.webp` | 1440×900 · 90,600 | `8c36193fdd65238f1a70563a9ee80963c43b5cbbb150c4c6dd83f86808977eab` |
| `261010_힐러넷/00_기존 자료/08_사이트_캡처/캡처_index_390_20261010.png` | 390×6528 | `1e0a1ff9416745c7f50371db54d46521e0a7f4fb97a0c8b22cd1094bbcc546c2` | `public/reference-review/healernet-website/before-mobile.webp` | 390×844 · 36,052 | `b923054e1576a1cfbec0fe1133fb09a4c58c8ca0de26eb0c4b1f46364df092a0` |

yofree-shop은 기존 화면 캡처가 없어 만들지 않았다. HOLD 자리(`data-hold="before"`, 점선 프레임, `기존 화면 자료 확인 중`)만 둔다.

## 결정 사항
1. **인트로 제목 변경**: BRIEF 초안 `한 흐름으로 이어집니다`는 공백 포함 12자라 11자 규칙을 넘는다 → `상담부터 성과까지\n하나로 이어집니다`.
2. **04 제목 변경**: `컨텐츠를 직접 만듭니다`(12자) → `채널에 맞는 컨텐츠를\n직접 만듭니다`(11·7자). 같은 단어 반복을 피하려 04 lead의 `채널과 타깃에 맞는` → `타깃과 플랫폼에 맞는`.
3. **현재 단계 판정 선**: BRIEF의 rootMargin `-45% 0px -50% 0px`는 그대로 쓰되, 판정은 "top ≤ innerHeight × 0.5인 마지막 단계"로 했다. 띠(45~50%) 진입·이탈 콜백은 글 위쪽이 50% 선을 넘을 때 오므로, 0.45로 판정하면 단계 top이 45% 선을 지나는 순간에는 콜백이 없어 다음 단계로 바뀌지 않는 구간이 생긴다. 0.5 선은 모든 콜백에서 같은 결과를 낸다.
4. **IntersectionObserver 1개 유지**: 진입 효과는 별도 관찰자를 두지 않고, 같은 관찰 결과로 현재 단계 이하 단계의 `.wj-media[data-reveal="pending"]`을 `done`으로 바꾼다. 마운트 때 화면 아래에 있는 미디어만 `pending`(translateY 24px, opacity 불변). reduced-motion이면 `pending`을 붙이지 않는다. 효과 대상은 03 비교 블록·대체 프레임과 04 무대뿐이다.
5. **`.wj-button` 역할**: 히어로 `견적 문의`가 실제로 `.t-button`(15px, min-height 52px)이고 `--lg`가 아니다. BRIEF 대응표(`.t-button--lg`)와 "히어로 버튼과 같은 크기"가 충돌해 히어로와 같은 `.t-button`을 택했다(padding 18px 28px, 보라 배경). `--lg`가 맞다면 JSX 클래스 하나만 바꾸면 된다.
6. **단계 제목 h2 = feature 역할**: type.css의 `.guide-public .guide-page:not(.content-service) h2`(특이도 0,3,1)가 `.t-h3--feature`(0,3,0)보다 강해 h2 요소에는 feature 값이 적용되지 않는다. type.css를 고치지 않고 `workflow-journey.css`에 `.guide-public .guide-page .wj h2.wj-step-title`(0,4,1) 한 규칙으로 W2 feature 토큰(`var(--ff-text)`, `var(--type-feature-*)`)만 참조했다. 리터럴 값·`!important` 없음.
7. **링크 줄**: 01 `상담 신청하기 →`(#contact), 03 `웹사이트 제작 →`·`쇼핑몰 제작 →`, 04 `컨텐츠 서비스 전체 보기 →`(/content), 05 BRIEF 3개. 02는 BRIEF에 링크가 없고 브랜드 가이드 서비스 페이지도 없어 링크 줄을 두지 않았다.
8. **이전·다음 버튼**은 패널 밖 한 벌로 두었다(패널 안에 두면 누른 버튼이 숨겨져 키보드 포커스를 잃는다). 1024px 이상에서는 무대 열(2열)에 맞춰 놓인다.
9. **폰 프레임**: 1024 이상 폭 24%, 미만 30%. 30%에서는 390:844 비율이 프레임 높이를 넘으므로 `max-height`로 막았다(이때 폰 상자가 약간 낮아지고 이미지는 cover·top 자르기).
10. **글자 대비**: 12px 보라 글자는 tint(#f0edfa) 위에서 4.5:1이 안 되므로(약 4.4:1) 태그·노드 번호는 흰 바탕 상자 안에 두었다(흰 바탕 보라 약 5.1:1).
11. 05의 순환 화살표·단계 사이 화살표는 `aria-hidden` span을 CSS로 그렸다. 노드 높이가 달라도 맞도록 노드마다 자기 구간만 그린다(가로: 노드 아래, 세로: 노드 오른쪽).
12. 03 기본 빌드의 4단계 목록은 각 탭 패널 안(프레임 옆)에 둔다.

### 카피 최종본
- 인트로: `HOW WE WORK` / `상담부터 성과까지\n하나로 이어집니다` / `필요한 단계만 맡기셔도 됩니다. 단계마다 하는 일과 결과물을 살펴보세요.`
- 01 `필요한 일부터\n함께 정합니다` / lead BRIEF 그대로 / 칩 `개발` `컨텐츠` `마케팅` / `상담에서 정하는 것`: `목표` 알리고 싶은 내용과 기대하는 반응 · `작업 범위` 개발·컨텐츠·마케팅 중 맡길 일과 분량 · `일정` 오픈일이나 게시일에 맞춘 작업 순서 · `맞춤 견적` 정한 범위와 일정에 따른 비용 안내
- 02 `브랜드 가이드로\n기준을 세웁니다` / lead BRIEF 그대로 / `가이드 구성` + `구성 예시`: `로고 사용` 여백과 최소 크기, 잘못 쓴 예 · `컬러` 주색과 보조색의 쓰임 · `서체` 제목과 본문 서체의 크기 단계 · `톤과 말투` 자주 쓰는 표현과 피할 표현 · `사진 방향` 빛과 배경, 제품 연출 기준
- 03 `웹사이트와 쇼핑몰을\n가이드대로 만듭니다` / lead BRIEF 그대로 / 캡션 `기존 공식몰 첫 화면 · 2026-10-10 캡처`, `기존 홈페이지 첫 화면 · 2026-10-10 캡처`, `AIO 제작 화면`, HOLD `기존 화면 자료 확인 중` / 링크 `작업 자세히 보기 ↗`, `서비스 자세히 보기 →` / 기본 빌드 목록 `기존 화면 점검` `가이드 적용` `PC·모바일 화면 설계` `문의·구매 동선 연결`
- 04 `채널에 맞는 컨텐츠를\n직접 만듭니다` / `같은 브랜드 가이드로 타깃과 플랫폼에 맞는 형식을 고릅니다. 웹툰부터 광고 영상까지 기획과 제작을 한 팀이 맡습니다.` / 탭 line·칩은 BRIEF_P3 2-1 표와 같은 문자열 / 대체 캡션·태그·alt는 BRIEF대로(웹툰 `1억의 구단주 · 제작 예시`, AI 인플루언서 `AI 가상인물 · 연출 예시`, alt `AI 인플루언서 연출 예시 이미지 · AI로 만든 가상인물`)
- 05 `계획하고 운영하고\n데이터로 고칩니다` / lead BRIEF 그대로 / `마케팅 운영 흐름` + `연출 예시` / 노드 4개·세부 문구 BRIEF 그대로 / 갈래 `화면 수정 → 개발 단계`, `소재 교체 → 컨텐츠 단계`
- 마무리 `어디서부터 시작할지 상담에서 함께 정합니다` + `견적 문의`

### humanizer 점검으로 고친 것
- `정한 범위와 일정에 맞춘 비용 안내` → `…따른 비용 안내`(바로 위 행의 `맞춘`과 반복)
- `여백과 최소 크기, 피할 사용 예` → `…잘못 쓴 예`(톤 타일의 `피할 표현`과 반복, `사용 예`는 어색)
- 04 lead `채널과 타깃` → `타깃과 플랫폼`(제목과 반복)
- 금지 패턴(`을 통해·에 대해·아니라·없이·최고·보장·%·N배·운영 중·게시 중·팔로워·조회수·립싱크·목소리·고화질`)은 데이터·컴포넌트 문구 전체에서 0건(테스트 5). 문장당 쉼표 1개 이하, 한 문장 설명·라벨에는 마침표 없음, 두 문장 lead는 문장마다 마침표.

## W2 역할 이름 대응표
AUDIT 1.2의 이름과 W2 실제 이름이 같아 그대로 썼다.

| 이 섹션 | 붙인 역할 | 비고 |
|---|---|---|
| `.wj-title` (h2) | `.t-h2` | `#divisions` h2와 같은 역할 |
| `.wj-step-title` (h2) | `.t-h3--feature` | 결정 6의 보강 규칙(토큰만 참조) |
| `.wj-eyebrow`, `.wj-num` | `.eyebrow` | `--ff-display`, 라틴만 |
| `.wj-lead` (인트로·단계·마무리) | `.t-lead` | |
| `.wj-item-title` (h3, 01의 dt) | `.t-h3` | |
| `.wj-body` | `.t-body` | |
| `.wj-caption` | `.t-small` | |
| `.wj-tag` | `.t-caption` | |
| `.wj-tab`, `.wj-chip` | `.t-chip` | 칩은 min-height만 0으로 |
| `.wj-rail-label` | `.t-nav` | |
| `.wj-link` | `.t-button` | min-height 44px로 낮춤(배치 속성) |
| `.wj-button` | `.t-button` | 결정 5 |
| (보조) 이전·다음, dialog 닫기 | `.t-chip` | 측정 그룹 밖 |
| (보조) 02 서체 견본 `가 Aa` | `.t-h2` | `aria-hidden` 장식 |
| `#divisions` 목록 `.home-division-services` | `.t-small` | 색 `#C9C9D1`·여백 24px·`keep-all`만 |

## `#process` 링크 grep (components, app, lib, scripts, tests, content)
- 메인 `/`의 `#process`를 가리키는 링크: **0건**(수정한 곳 없음). `/#process` 문자열 0건, main.jsx `href="#process"` 0건.
- 남은 일치는 모두 메인과 무관해 그대로 둠: `components/guide/lab-services.jsx`(자기 `<section id="process">`와 링크 4곳), `components/content-service/content-service.tsx`(`id="process"`), `lib/guide-content.ts:69·113`과 `tests/seo-http.mjs:134`(인사이트 slug `"process"`).

## 실행한 검증
| 명령 | 결과 |
|---|---|
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/home-journey.test.mjs` | 9/9 PASS |
| 같은 명령 + `AIO_VERIFY_LOCAL_MEDIA=1` | 9/9 PASS (before webp 4개 존재 확인) |
| `npm run typecheck` | PASS (P3 진행 중 파일 포함 상태에서 오류 0) |
| `npm run lint` | 오류 0, 기존 경고 1개(`tests/local-admin.test.mjs:110`) |
| `npx prettier --write` (내 소유 파일) | 적용 후 위 3개 재실행 PASS |
| 플래그 on/off 선택 함수 확인(node) | on: 개발 3탭(bwl·힐러넷 before 있음, yofree HOLD), 컨텐츠 6탭 모두 지정 slug, AI 인플루언서 캡션 = 87언니 라벨 / off: 개발 대체 2탭, 컨텐츠 6탭 모두 대체 미디어 |

### NOT_RUN (메모리 제약으로 지시에 따라 실행 안 함, 검증 담당 몫)
- 전체 직렬 테스트(`tests/*.test.mjs`), `npm run build`(검토·기본 두 빌드), `next start` 브라우저 검사 전부: 폭별 가로 넘침, 콘솔 오류·하이드레이션 경고, 깨진 이미지, **타이포 측정표**(getComputedStyle 5속성), 좌측선 정렬, 360px 제목 줄 수, 레일 sticky·`aria-current` 전환, reduced-motion, dialog 열기·Esc·포커스 복귀, 영상 재생·탭 전환 정지, `/` HTML·`.next/static`의 고객명·`before-pc`·`87언니` 0건, `.qa/p4/` 캡처.
- 번들 확인 메모: 고객 문자열은 `"0" === "1"` 접힘으로 빠지도록 작성했지만 실제 `.next/static` grep은 기본 빌드 후 확인해야 한다. 플래그를 아예 설정하지 않은 빌드는 Next가 값을 인라인하지 않아 문자열이 남을 수 있다(기존 `works.generated.ts`와 같은 조건). BRIEF대로 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW='0'`으로 빌드해야 한다.

## 미해결
- **yofree-shop 기존 화면 HOLD**: 캡처 없음. 생성·합성·추정 이미지는 만들지 않았다.
- 브랜드 가이드(`261010_BWL/01_브랜드 자료/01_브랜드가이드/DRsSecret_BrandGuide_v1.1.*`, `261010_힐러넷/01_브랜드 자료/01_힐러넷/01_브랜드가이드`)와 요프리 마케팅 제안서(`261010_힐러넷/05_마케팅플랜`)를 02·05 레퍼런스로 쓸지: 공개 권리 미확정이라 이번에는 붙이지 않음(후속 후보).
- before 캡처의 공개 권리: 작품 공개 승인과 별도로 판단 필요. 지금은 검토 플래그 빌드에서만 보인다.
- 닥터시크릿 이름·87언니 시안 공개 허락(FACTS 남은 확인). 현재 검토 빌드 전용.
- 메인 #process 삭제로 쓰이지 않게 된 CSS 정리 후보: `review.css` `.method-intro`, `.guide-main .method-intro h2`, `.method-line`, `.method-line em`, `.method-intro p`, `.main-method ol`(미디어 쿼리 포함), `creative.css` `.method-line`, `.guide-main .method-intro h2`.
- 범위 밖에 남은 옛 문구 `브랜드 홍보 및 SNS 광고 영상`: `lib/guide-content.ts:23`(컨텐츠 상담 안내 본문), `lib/guide-content.ts:32`(인사이트 본문). `lib/content.ts` video summary는 P3 작업 중 이미 바뀐 상태로 보인다.
- reduced-motion: 전역 `review.css`의 `.guide-page * { transition-duration: 0.01ms !important }`가 이 섹션의 `transition: none`보다 우선하므로 계산값은 0이 아니라 `1e-05s`로 나온다(사실상 0). 옆 미리보기는 렌더하지 않고 미디어 transform도 없다.

## 소유 범위 밖 필요 변경
- `components/guide/review.css`, `creative.css`: 위 `.main-method`·`.method-*` 규칙 삭제(W2 소유 전역 스타일).
- `components/guide/guide.css`: `#process` 인라인 `Unbounded,sans-serif` 숫자를 위해 남긴 `@font-face { font-family: Unbounded }` 별칭은 이제 사용처가 없을 수 있다. 다른 사용처 확인 후 정리 후보.
- `components/guide/studio-p1.css`: import 0건이 된 파일. 삭제 여부 판단 필요.
- `components/guide/type.css`: 일반 `h2` 역할 규칙(0,3,1)이 같은 요소의 `.t-h3--feature`(0,3,0)를 이긴다. 다른 곳에서도 h2에 feature 역할을 쓰려면 `h2.t-h3--feature` 선택자를 type.css에 추가하는 편이 낫다(이번에는 결정 6의 국소 규칙으로 처리).
- `lib/guide-content.ts`: 옛 문구 2곳(위 미해결).
- `components/guide/home-references.tsx`: 메인에서는 더 쓰지 않는다. 서비스 개요 등 다른 사용처가 있어 파일은 그대로 둠.
