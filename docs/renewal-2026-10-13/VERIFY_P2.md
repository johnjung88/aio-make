# P2 독립 검증 결과 (VERIFY_P2)

- 버전: VERIFY_P2 v1 / 2026-10-13
- **전체 판정: FAIL (경미)** — 기능·빌드·화면·SEO 기준은 모두 PASS. 재지시할 FAIL은 2건(문장 조사 오류 1, 고아 CSS 잔존 1)이고 둘 다 한두 줄 수정이다. 주의 항목 6건은 판정에 넣지 않았다.
- 검증자: Claude Sonnet (읽기 전용). 소스 수정·커밋·push·배포·패키지 설치·비밀값 읽기 없음. 쓴 파일은 이 문서와 `.qa/p2-verify/`(gitignore) 뿐이다. 검증 전후 `git status --short`가 동일하다.
- 대상: 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`, 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`, HEAD `4c62a58`(P2는 미커밋)
- 방법: `RESULT_P2.md`는 믿지 않고 모두 직접 재현했다. 빌드는 한 번에 하나, 서버는 `next start -p 3214 -H 127.0.0.1`만 사용했고 두 번 모두 종료 후 3214 리스너 0개를 확인했다. dev 서버는 쓰지 않았다. 브라우저는 Playwright 도구(Chrome 154)를 썼다. 마지막 `.next`는 플래그를 끈 빌드다.
- 증거 위치(모두 gitignore): `.qa/p2-verify/` — `typecheck.log`, `lint.log`, `tests.log`, `build-review.log`, `build-public.log`, `seo-http.log`, `SEO_HTTP.json`, `text-review.json`(6페이지 텍스트), `review/`·`public/`(전체 페이지·섹션 스크린샷).

## 완료 기준 판정 (BRIEF_P2 "완료 기준" 순서)

| # | 완료 기준 | 판정 | 근거 |
| --- | --- | --- | --- |
| 1 | 6개 서비스가 9섹션 골격(사례 조건부)을 갖고 서비스마다 히어로·규격·프로세스·FAQ 문장이 다르다 | PASS | 두 빌드 6페이지 모두 `data-content-section` = hero/fit/scope/process/uses/quote/faq/cta(+켠 빌드는 cases) 확인, h1 1개, sticky 앵커(소개·제작 범위·사례·진행·FAQ·문의). 6페이지 렌더 텍스트를 섹션별로 뽑아 문장 단위로 비교: 고유 문장 480개 중 서비스 간 겹침 11개이며 전부 `견적 문의 ↗`, `WHEN TO USE`, `제작 프로세스` 같은 섹션 라벨·버튼이다. 본문 문장 복붙 0. 히어로·규격·프로세스·FAQ의 문장은 모두 서비스별로 다르다(FAQ 수 5/4/5/5/5/5). "AI 인플루언서 고지", "광고 성과 보장 안 함" 등 서비스 고유 항목이 있다 |
| 2 | 웹툰: 12컷 그리드·라이트박스 정상, 어디에도 24컷/24개 썸네일 없음 | PASS | 두 빌드, 1440·390폭: 썸네일 `li` 12개·버튼 12개, 이미지 `cut-01..12`가 순서대로, `ol aria-label="12컷 구성"`, `1회분 · 12컷`, h2 `웹툰 1회분은 12컷으로 제작합니다`. 키보드(Enter)로 1컷 열림→포커스가 dialog 안으로 이동→Escape로 닫힘→포커스가 `1컷 크게 보기` 버튼으로 복귀. 12컷 클릭 열기→`확대 이미지 닫기` 버튼 닫기→바깥(backdrop) 클릭 닫기 모두 정상, dialog `aria-label` "1억의 구단주 N컷 확대 보기". 6개 서비스 HTML·`/`·`/content`·`/content/work`·`/about`·`/content/insights`·`/llms.txt`·`.next/static`·`.next/server/app`에서 `24컷`·`24장`·`24 cut` 0건. 24 문자열 잔존 구분은 아래 "24 문자열 잔존" 참조 |
| 3 | 검토 플래그 켠 빌드: 지정 작품이 실제 미디어로 노출 / 끈 빌드: 사례 숨김·나머지 정상·콘솔 오류 0 | PASS | 켠 빌드 `[data-work-slug]`: webtoon `yofree-outing-webtoon, bwl-brand-webtoon, bwl-aqua-webtoon, yofree-night-webtoon`(4) / animation `yofree-outing-motion, yofree-night-motion` / ai-influencer `bwl-aqua-ad, bwl-cplus-ad, bwl-cleanser-ad` / motion-graphics `bwl-brand-motion, healernet-motion, yofree-mg-short, yofree-mg30` / brand-film `bwl-brand-motion, healernet-motion, bwl-brand-ad` / ad `bwl-brand-ad, bwl-aqua-ad, bwl-cplus-ad, bwl-cleanser-ad`. BRIEF 지정과 일치한다. 영상은 모두 `preload="none"` + poster, 깨진 이미지 0. `제작 후보`/`제작 완료` 라벨이 데이터 값 그대로 표시된다(후보를 완료로 표기하지 않음). 끈 빌드: 24회(6×4폭) 모두 200, 사례 섹션·`#cases`·사례 앵커 없음, 카드 0, HTML 안 `reference-review` 문자열 0, 히어로 보조 버튼이 `제작 범위 보기 ↓`로 대체되고 정적 대표 이미지에 `연출 예시` 캡션. 콘솔 error/warning 0, pageerror 0(prefetch `_rsc` ERR_ABORTED는 페이지 이동 시 정상 취소라 제외) |
| 4 | 1440/768/390/360 가로 넘침 0, 제목 줄바꿈·정렬 이상 없음 | PASS (주의 4건) | 두 빌드 × 6 × 4폭 = 48회: `scrollWidth == clientWidth` 전부 일치(1425/1425, 753/753, 375/375, 345/345 — 스크롤바 15px 제외), 깨진 이미지 0. 390/360에서 `right > clientWidth`인 요소는 있으나 모두 `overflow:auto/hidden` 조상(서비스 탭 줄)에 갇혀 있어 페이지 가로 스크롤을 만들지 않는다(조상 overflow 검사로 확인, `/content/services/ad`·`webtoon`·`/content` 모두 클립되지 않은 넘침 0). 앵커 클릭 5회: 제목이 sticky 스택 아래(top 385 > 238)에 도착. 줄바꿈·정렬은 아래 "주의" 참조 |
| 5 | typecheck / lint / 직렬 테스트 / build PASS, `tests/seo-http.mjs` 갱신본이 로컬 서버에서 PASS | PASS | `npm run typecheck` exit 0. `npm run lint` exit 0, `✖ 1 problem (0 errors, 1 warning)`(기존 `tests/local-admin.test.mjs:110` 경고). 직렬 테스트 exit 0, `tests 31 / pass 30 / fail 0 / skipped 1`(skip 1 = `AIO_VERIFY_LOCAL_MEDIA` 미지정 시 의도된 skip, P1 검증과 동일. RESULT_P2의 "31 PASS"는 해당 env를 켰을 때 수치). `npm run build` 두 번(켠 빌드 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`, 끈 빌드 `=0`, 공통 `ENABLE_LEGACY_SUPABASE=false AIO_LOCAL_ADMIN_ENABLED=false`) 모두 exit 0. `tests/seo-http.mjs`를 끈 빌드 서버(3214)에 실행: `AIO_QA_BASE=http://127.0.0.1:3214 AIO_QA_REPORT=.qa/p2-verify/SEO_HTTP.json node --conditions=react-server --experimental-strip-types tests/seo-http.mjs` → exit 0, `pages 56 / internalLinks 197 / shareImages 4 / errors []`. 새 FAQ id(`content-service-faq-answer-`) 4개 이상, FAQPage 문답이 서버 HTML과 일치, 필수 섹션, 웹툰 12컷 회귀 검증이 포함되어 통과한다 |
| 6 | `studio-services.jsx` 제거 또는 분리, 미사용 코드 정리 | **FAIL (경미)** | 파일 삭제됨, `app/components/lib/tests` import 0, 새 컴포넌트 인라인 `style=` 0, `.p1-motion-preview` 제거 확인. 그러나 삭제한 파일에서만 쓰이던 공유 CSS가 남아 있다(grep으로 사용처 0 확인): `components/guide/ux.css:71-79`·`:259-266`(`.webtoon-service-intro`), `ux.css:80-88`(`.video-service-hero-copy`), `components/guide/creative.css:33-35`(`.studio-process-heading`), `components/guide/guide.css:62`(`.guide-studio-services` 선택자). BRIEF는 "명백히 고아가 된 것만 제거"를 요구했고 RESULT_P2는 `.p1-motion-preview`만 제거했다고 적었다. 재지시 목록 2번 참조 |

## 요청 항목별 확인 (Acceptance 1~8)

| 항목 | 판정 | 근거 |
| --- | --- | --- |
| (1) typecheck / lint / 직렬 테스트 / build | PASS | 위 기준 5 |
| (2) 두 빌드 × 6페이지 × 4폭 전체 스크린샷·넘침·콘솔 | PASS | `.qa/p2-verify/review/{service}-{폭}.png`, `.qa/p2-verify/public/{service}-{폭}.png` 전체 페이지 48장. 섹션·상단 캡처는 같은 폴더 `top-*`, `sec-*`. 직접 열어 확인한 장면: 6개 히어로(1440), 390·360 히어로, 사례(모션그래픽·AI 인플루언서), 프로세스, 활용처, 견적, 웹툰 범위(390), 768 히어로 |
| (2) 영상 재생 | PASS (도구 한계 1건) | poster 표시 확인(6개 히어로·사례 카드 모두 포스터 프레임이 보임). `bwl-brand-motion` 영상에 `play()` 호출 후 2.4초 재생, `paused=false`, `error` 없음, readyState 4. 키보드 포커스 후 Space로 `healernet-motion` 1.9초 재생. **마우스 클릭 재생은 이 Playwright 브라우저에서 확인하지 못했다**: 사례 카드와 P2에서 건드리지 않은 `/work/healernet-motion` 상세 영상 모두 `page.mouse.click`·`locator.click` 후 `paused=true`였다. 같은 현상이 변경 없는 페이지에도 있어 P2 결함이 아니라 도구의 네이티브 컨트롤 클릭 한계로 판단한다. 실제 브라우저에서 사람이 한 번 눌러보는 확인은 NOT_RUN으로 남긴다 |
| (3) 사례 섹션 켠/끈 빌드 | PASS | 기준 3 |
| (4) 웹툰 12컷·라이트박스·키보드 | PASS | 기준 2. 24 문자열 잔존은 아래 |
| (5) 카피·디자인 품질 | PASS (FAIL 1·주의 4) | 아래 "카피·디자인 품질" |
| (6) `tests/seo-http.mjs` | PASS | 기준 5. 이전 기준 대비 "서비스당 FAQ 3개 이상"이 "4개 이상"으로 강화됨. 각 서비스 `<title>`·description·og:title·og:url이 서비스별로 고유하고 JSON-LD가 `Service`·`FAQPage`·`BreadcrumbList` 각 1개씩이다 |
| (7) 삭제 후 잔존 import·죽은 CSS | FAIL (경미) | 기준 6. import 잔존은 없다. `scripts/polish-v11.mjs:5`, `scripts/restore-guide.py:29`는 삭제된 경로 문자열을 담은 과거 복원 스크립트(빌드 입력 아님, 참고) |
| (8) 마케팅·개발 서비스·문의 폼 회귀 | PASS | 끈 빌드, 1440·390: `/marketing/services/{integrated,sns,ai-influencer,seo}`, `/lab/services/{website,shopping-mall,automation,program}` 8개 200·넘침 0·h1 1·section 8·form 있음·깨진 이미지 0, `/content,/marketing,/lab/contact`·`/contact` 200. 콘솔 오류 0. 켠 빌드에서도 `/marketing/services/{integrated,ai-influencer}`, `/lab/services/website`, `/content`, `/content/work`, 문의 3종 정상(추측한 슬러그 `performance`·`ai-automation`의 404는 존재하지 않는 경로라서 제외). 컨텐츠 문의 `?service=` 프리셋 6종 모두 해당 서비스가 선택됨, 서비스 페이지 CTA(`견적 문의`)가 `/content/contact?service=<id>`로 이동해 선택 유지 |

### 24 문자열 잔존 (UI와 스크립트·테스트 구분)

- UI(화면·HTML·클라이언트 번들·`llms.txt`): **0건**.
- 테스트: `tests/seo-http.mjs:145` — 웹툰 HTML에 `24컷|24장`이 있으면 실패시키는 부정 회귀 검사. 화면 문구 아님.
- 스크립트: `scripts/restore-guide.py:178,209,242,243,245` — 과거 HTML 입력의 24장 문구를 치환하는 복원용 패턴. 현재 빌드 입력 아님.
- 문서: `docs/renewal/**`, `BRIEF_P2.md`, `RESULT_P2.md`, `VERIFY_P1.md`의 역사적 기록.
- 참고: `public/webtoon-v11/cut-13..24.webp`는 파일로 남아 있으나 어디에서도 참조하지 않는다(화면 영향 없음).

### 카피·디자인 품질

문장 중복·번역투 검사는 서버 렌더 HTML에서 섹션 텍스트를 추출해 직접 계산했다(`.qa/p2-verify/text.mjs`, `scan.mjs`).

- 번역투·AI 말투: `~을 통해`·`~에 대해`·`되어진`·`A가 아니라 B` 반복·`~ 없이` 나열 0건(`없이` 2건은 "소리 없이도 이해할 수 있는", "촬영 없이도 만들 수 있나요?"로 자연스러운 쓰임). 쉼표 2개 이상 문장은 전부 `A, B, C` 형태의 명사 나열(규격·견적 요소)이며 쉼표절로 늘어지는 문장은 없다. 문장은 짧고 고객 관점이다.
- 근거 없는 수치·가격·성과: 가격은 전부 `맞춤 견적`. 쓰인 수치는 BRIEF가 정한 값(12컷, 800×1200, 15~60초, 30~60초, 6·15·30초, 첫 3초, 9:16/1:1/16:9)뿐이다. 광고 성과 보장 문구 없음(`ad` FAQ는 "광고 성과를 약속하지 않습니다"). `성과·최저가·1위·보장` 류의 약속 문구 0.
- AI 인플루언서: 사례는 "인물 중심 세로 영상 시안"으로 표기하고 "AI 생성 여부는 확인 중입니다"를 명시했으며 FAQ에도 단정하지 않는 답을 뒀다. BRIEF 요구를 충족한다.

**FAIL 1건**
- `components/content-service/content-service.tsx:248`: 활용처 h2가 `${plan.name}을 사용할 화면에 맞춥니다`라서 **"AI 인플루언서을 사용할 화면에 맞춥니다"**로 렌더된다(받침 없는 단어 뒤에 `을`). 화면 제목이므로 FAIL. 나머지 4개(`애니메이션을`, `모션그래픽을`, `브랜드 홍보 영상을`, `SNS 광고 영상을`)는 받침이 있어 문법상 맞다.

**주의(판정 제외, 개선 권장)**
1. 같은 문장 틀의 제목이 6페이지에서 이름만 바뀐다: `{이름} 작업 살펴보기`(`:183`), `{이름} 제작 전 확인할 내용`(`:307`), `{이름}을 사용할 화면에 맞춥니다`(`:248`), 견적 h2 `맞춤 견적`(`:270`) 고정. "이름만 바꾼 복붙" 기준을 엄격히 적용하면 걸릴 수 있으나 본문은 모두 다르다. 활용처 h2는 웹툰만 고유하게 썼으므로 나머지도 서비스별로 쓰는 편이 낫다. 문장도 "애니메이션을 사용할 화면에 맞춥니다"는 뜻이 어색하다(쓰는 화면에 맞춰 제작한다는 의미).
2. 히어로에서 서비스명이 세 번 보인다: 앵커 라벨 `AIO MAKE / 웹툰`, 별도 `웹툰` 줄(`content-service.tsx:59-67`), 서비스 탭의 활성 항목. 위계가 중복되어 시선이 분산된다.
3. h1이 `<span>` 3개로 구성되고 span 사이에 공백이 없어 `textContent`가 `웹툰브랜드 이야기를다음 컷이 궁금한 웹툰으로`로 이어진다(`content-service.tsx:62-67`). 화면 표시는 정상이지만 크롤러·일부 스크린 리더 이름 계산에서 단어가 붙을 수 있다. span 사이에 공백 또는 `<br>`를 두면 해결된다.
4. 360px에서 프로세스 제목 `한 인물의 기준을 정한 뒤, 여러 / 편의 이야기를 만듭니다`(AI 인플루언서, `lib/content-service-plans.ts:295`)가 `여러`에서 끊긴다. `text-wrap: balance` 또는 의도한 줄바꿈 권장.
5. 켠 빌드 모션그래픽 사례 그리드: 세로 영상(`yofree-mg-short`) 카드가 두 열 중 한 칸에 가운데 정렬로 들어가 옆 카드와 상단·메타 높이가 맞지 않고 오른쪽에 큰 여백이 생긴다. 상태 라벨(`제작 후보`)이 영상 폭과 달리 열 오른쪽 끝에 붙는다.
6. 사례 카드 한 줄 설명에 상세 페이지 문맥이 남아 있다: `content/works/healernet-motion.json:17`의 scope가 "…제작했습니다 아래에서 두 화면 비율을 확인할 수 있습니다"라서 카드에서는 "아래"가 가리키는 대상이 없다(P1 데이터 원문 보존 정책 때문이므로 P2 범위 밖일 수 있음). 또 이 scope 문장들은 마침표 없이 이어진다.
- 그 밖: 끈 빌드의 모션그래픽 정적 대표 이미지가 향수병 사진이라 주제와 거리가 있다(`연출 예시` 표기는 정상). 헤더·서비스 탭·앵커 줄이 겹쳐 1440에서 첫 화면 상단 약 240px를 차지하나 BRIEF가 요구한 구조다. 웹툰 범위 썸네일의 `next/image` srcset이 `w=3840`을 고르는 것은 변경 전과 동일한 `sizes` 설정(P2 비변경분)이다.

## 재지시용 FAIL 목록

| # | 파일 · 줄 | 현상 | 기대값 |
| --- | --- | --- | --- |
| 1 | `components/content-service/content-service.tsx:246-248` | 활용처 h2가 `` `${plan.name}을 사용할 화면에 맞춥니다` ``로 고정되어 AI 인플루언서 페이지에서 "AI 인플루언서**을** 사용할 화면에 맞춥니다"로 표시된다 | 조사를 이름에 맞게 쓴다. 가장 간단한 해법은 활용처 제목을 `lib/content-service-plans.ts`의 plan마다 `usesTitle`로 서비스별 문장으로 쓰는 것이다(웹툰처럼 서비스마다 고유 문장, "~을/를" 조사 문제 소멸). 최소 수정이면 받침 판별 후 `을/를` 선택 |
| 2 | `components/guide/ux.css:71-88` 및 `:259-266`, `components/guide/creative.css:33-35`, `components/guide/guide.css:62` | 삭제된 `studio-services.jsx`에서만 쓰던 선택자가 남아 있다: `.webtoon-service-intro`(규칙 4개), `.video-service-hero-copy`(규칙 2개), `.studio-process-heading`, `.guide-studio-services`(셀렉터 목록의 한 항목). 저장소 전체 grep에서 사용처 0 | 해당 규칙을 삭제한다. `guide.css:62`는 `.guide-studio-home, .guide-studio-contact` 목록에서 `.guide-studio-services`만 뺀다. 삭제 후 `npm run build`와 `/content/services/*` 시각 확인 |

위 두 건을 고치면 전체 판정은 PASS가 된다. 주의 항목 1~6은 같은 재작업에 함께 반영하면 좋지만 필수는 아니다.

## 실행하지 않은 것 (NOT_RUN)

- 실제 브라우저에서 사람이 마우스로 영상 재생 버튼을 누르는 확인(위 도구 한계).
- `npm run works:build -- --media`·운영 배포·계정·DB 관련 모두(검증 범위 밖, 금지).
- P3/P4 범위(`/content` 메인, 메인 워크플로우).
