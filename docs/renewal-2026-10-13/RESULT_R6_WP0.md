# RESULT_R6_WP0 · R6 공통 기반 구현 결과

작성 2026-10-15 · 기준 HEAD `5664a45` · 근거 `BRIEF_R6.md` 1·2·5절, `TYPE_STANDARD_R6_DRAFT.md` 9장. 커밋·빌드·서버 실행 없음.

## 1. 변경 파일

| 구분 | 파일 |
|---|---|
| 토큰·공통 CSS | `components/content-site/theme.css`, `components/content-site/services/service-editorial.css`, `components/content-site/services/service-motion.css`(포트레이트 장면 `justify-self` 한 줄), `app/globals.css`(`--type-h1~h3`, `--type-caption-size`, `--section-y(-sm)`) |
| 히어로 | `components/content-site/services/service-hero.tsx`(ServiceHero), `components/content-site/blocks/hero.tsx`(미사용 CsHero, export 유지) |
| 블록 | `blocks/pricing.tsx`, `blocks/scope.tsx`(섹션 → `CsScopeText`), `blocks/process.tsx`, `blocks/faq.tsx`, `blocks/related.tsx`, `blocks/inquiry.tsx`, `blocks/types.tsx`(주석만), `components/content-site/service-landing.tsx` |
| 공통 외 1곳 | `components/content-site/contact/contact-flow.tsx`(`cs-section--alt` 클래스 1개 제거) |
| 데이터·카피 | `lib/content-site/copy.ts`, `lib/content-site/types.ts`, `lib/content-site/faq.ts`, 6개 서비스 데이터(`facts` 줄만 삭제) |
| 테스트 | `tests/content-site.test.mjs` |

`components/guide/type.css`는 값을 직접 갖지 않고 `app/globals.css` 토큰만 읽으므로 수정하지 않았다.

## 2. 새 CSS 토큰·클래스 (다른 WP가 쓸 것)

토큰(`.cs-site`)
- 타이포 한 벌: H1 `--cs-t-display-*` = `clamp(34px,5vw,72px)`/750/1.2/-0.04em, H2 `--cs-t-h2-*` = `clamp(28px,3.2vw,44px)`/700/1.3/-0.03em, H3 `--cs-t-h3-*` = `clamp(20px,1.6vw,24px)`/650/1.4/-0.02em, 캡션 13px. 메인 `--type-h1/h2/h3-*`, `--type-caption-size`도 같은 값.
- 간격: `--cs-section-y: clamp(64px,7vw,96px)`, `--cs-section-y-sm: clamp(40px,4.5vw,64px)`(메인 `--section-y(-sm)`도 동일). 신규 `--cs-measure: 34em`, `--cs-read: 880px`. 거터 `--cs-gutter: clamp(20px,4vw,56px)`(메인 `--gutter`와 동일).
- 폐지: `--cs-t-statement-*`와 `.cs-t-statement`, `--cs-t-service-display-size`, R2 덮어쓰기 블록(theme.css 맨 아래의 display·h2 재정의), `.cs-section { border-top }`, `.cs-section--alt`.
- `--cs-t-num-*`는 장식 크기를 버리고 14px/650/+0.04em(번호 행용). `--cs-t-price-size`는 `clamp(24px,2.6vw,36px)`(아래 미결 1).

클래스
- `.cs-container.cs-container--read`: 읽기 폭 880. 1440 이상에서도 넓은 컨테이너와 왼쪽 선이 같다. 안의 `.cs-head-main`은 전폭.
- 섹션 간격: `.cs-section`(위아래 `--cs-section-y`), `.cs-section--sm`(`--cs-section-y-sm`). 구분선·배경 교차 없음.
- 가격 한 줄: `.cs-price`(틀 없는 텍스트 블록). 서비스 히어로는 `.cs-service-editorial-price` 안에서 사용.
- 가격 플랜(박스는 여기만): `.cs-pricing-grid[data-count]`, `.cs-plan`(테두리만, 면 없음, 패딩 20 → 480px부터 24), `.cs-plan--bundle`(강조 1개), `.cs-plan-badge`, `.cs-plan-amount`. 격자: <360 1열, 360부터 `data-count="2"` 2열, 480부터 전부 2열, 1024부터 `data-count` 3·4열.
- 포함·별도 2열 텍스트: `.cs-scope-grid`(768부터 2열), `.cs-scope-col`(위 가는 선), `.cs-scope-col--wide`, `.cs-scope-list`, `.cs-scope-prepare`.
- 진행 방식 행: `.cs-steps`, `.cs-step`(번호·제목·`.cs-step-body`·`.cs-step-check`, 위 가는 선만; 768부터 3열).
- 행 목록(관련 서비스): `.cs-related-list`(1/2/3열) > `a.cs-related-row`(서비스명 `.cs-related-name` / 시작가 `.cs-related-price` / 한 줄 `.cs-related-line`, 위 가는 선, 최소 높이 72px).
- 박스 없는 항목: `.cs-type-card`, `.cs-insight-card`도 위 가는 선만으로 바뀌었다(`.cs-type-card`는 landing에서 쓰지 않음).

## 3. 다른 WP가 알아야 할 계약

- **`hero.facts` 삭제**: `ServiceLandingData.hero`에 `facts`가 없다. 6개 서비스 데이터에서 줄을 지웠다. `hero.note`는 선택 필드로 남겼으나 히어로가 출력하지 않는다. `startingPrice().note`도 히어로에서 출력하지 않는다(데이터는 `lib/content-pricing.ts`에 그대로).
- **`ServiceHero` props 그대로** `{ data, media, wide? }`. 구성은 eyebrow · h1(MotionTitle) · lead · 가격 한 줄(`CsPrice`) · "상담 신청" 버튼 1개 · 미디어. `CS_COPY.hero`는 `{ primary }`만 남았다(`secondary`, `factsLabel` 삭제). `FeaturedWork`, `ExampleFigure`, `ProductionNotes`, `CsHero` export 유지.
- **랜딩 순서** (`service-landing.tsx`): Hero → Signature → BeforePricing(AI만) → `CsPricing id scope` → CsProcess → CsWorks(검토판) → CsFaq → CsInquiry → CsRelated. **`CsTypes` 렌더 삭제**, **`CsScope` 섹션 삭제**(`blocks/scope.tsx`는 `CsScopeText`만 내보내며 `CsPricing`이 호출). `#scope` 앵커는 없어졌고 `#pricing`은 유지. `data.types` 데이터는 남아 있으나 화면에 쓰이지 않는다.
- **`CsPricing` 시그니처** `{ id, scope? }`. 카드마다 "부가세 별도"와 "이 구성으로 상담 ↓" 삭제, 부가세 별도는 그룹 아래 주석 한 줄(`PRICING_COMMON.vat`)에서 한 번. 수정 횟수·대량 별도 문구는 가격 블록에서 뺐다. 배지·강조 테두리는 묶음 그룹의 첫 플랜 하나에만. `a[data-plan]` 링크가 없어져 `inquiry.tsx`의 문서 위임 핸들러는 사실상 쓰이지 않는다(그대로 둠).
- **같은 사실 한 번만**: `CsScopeText`가 `기획안 수정 2회 · 최종안 수정 1회`와 `대량·정기 제작` 항목을 렌더에서 거른다(정규식 `DUPLICATE_FACT`). 서비스 데이터 쪽에서 그 항목을 지우면 필터는 아무 일도 하지 않는다. 수정 횟수는 진행 방식 단계의 `check`와 FAQ에만, 대량·정기는 FAQ에만 남는다.
- **FAQ**: `COMMON_FAQ`는 2개(수정 횟수, 정기 제작). 부가세 문항은 삭제. 서비스별 FAQ 3개 + 공통 2개 = 5개가 기준인데 **motion-graphics 서비스 FAQ가 2개뿐**이라 합계 4개다(WP-B가 한 문항을 더하면 5).
- **문의**: `CS_COPY.inquiry.steps`·`stepsLabel`과 `.cs-inquiry-steps` 삭제. 폼 카드 모서리 14px(`--cs-r-md`), 패딩 24(768부터 32).
- **관련 서비스**: `CsRelated`가 `@/lib/content-home`의 `contentHomeServices[].line`을 읽는다. WP-H는 이 export와 `id`·`line` 필드를 유지해야 한다.
- **`.cs-hero` 최소 높이 삭제**: 서비스 히어로는 내용 높이로 줄고, 패딩은 `.cs-hero.cs-service-editorial-hero`가 `--cs-section-y-sm`을 쓴다. `ai-influencer.css:153`의 `min-height: 0`은 영향 없이 남아 있다.
- **WP-H(`components/content-home/*`)**: `process-tabs.tsx:47`이 삭제된 `.cs-t-statement`를 쓴다(PROCESS를 새로 쓰면 사라짐). `content-home.css:296` `.cs-home { --cs-section-y: clamp(64px,7vw,104px) }`는 지우고 공통 토큰을 쓰는 편이 맞다. `service-detail.tsx`의 `ch-price cs-price`는 칩 틀이 없어졌다(파일 삭제 대상).
- **WP-A**: `webtoon/landing.tsx:53`의 `cs-section--alt`는 CSS가 없어 효과 없는 클래스다. `service-motion.css`의 `.cs-webtoon-fan`·`-images`의 `margin-inline:auto`(가운데 미디어)는 웹툰 전용이라 손대지 않았다. `service-editorial.css`의 `.cs-svc-webtoon … cover-caption .cs-t-h2 { font-size }`(웹툰 전용)도 남겼다.
- **WP-M**: 메인 `--type-*`, `--section-y(-sm)`가 바뀌었으므로 메인 전 페이지의 제목·섹션 간격이 함께 변한다. `--type-lead-size`는 바꾸지 않았다.

## 4. 테스트

수정(`tests/content-site.test.mjs`)
- 3번: `facts.length === 3` 대신 `"facts" in hero === false`.
- 4번: 공통 FAQ 2개(수정 횟수·정기 제작)로, `faq.slice(-2)`가 공통과 같고 부가세 문항은 없다. 서비스 FAQ 합계는 4~5개. 부가세는 `PRICING_COMMON.vat`로 확인.
- 7번: 글자 역할 목록에서 `statement` 제거.
- 9번: 섹션 순서를 새 순서로 바꾸고 `CsTypes`·`CsScope`가 랜딩에 없음을 검사.

추가(11 ~ 11-8, 새 계약 검사): 타이포 값(컨텐츠·메인 일치), 토큰 중복 정의·폐지 토큰, 간격·거터·읽기 폭·`--alt`·`border-top`, 박스 규칙(항목 카드·`.cs-step-check`·가격 칩), 서비스 히어로(버튼 1개, facts·보조 문장 없음), 가격 격자(360/480/1024 규칙, 카드 구성, 배지 1개), 진행 방식, 문의, 관련 서비스(1/2/3열, 72px), 가운데 정렬(공통 CSS 세 파일).

실행(직렬, 모두 PASS)
- `npx tsc --noEmit` PASS, `npx eslint`(components/content-site/blocks·service-landing·service-hero, lib/content-site) 오류 0.
- `tests/content-site.test.mjs` 25개 PASS.
- 다른 테스트도 변경 없이 PASS 확인: content-contact, content-site-grid, content-site-wpa, content-site-wpb, content-site-wps1, content-site-wps2, content-r5-fix1, content-scenes, guide-content, content-home, home-journey, new-tab-links, reference-release, reference-media. 다른 WP 영역에서 깨진 항목은 현재 없음(다른 WP 파일이 아직 바뀌지 않은 상태 기준).
- NOT_RUN: `npm run build`, 서버 실행, 390·767·1440px 스크린샷(금지 사항), `inquiry-direct`·`local-admin`·`seo-http.mjs`(서버 필요). `seo-http.mjs:368`은 문의 페이지에서 마침표 포함 문장을 기대하는 기존 불일치로 이번 변경과 무관.

## 5. 미결

1. **가격 글자 크기**: 360px에서 "17.5만 원"이 플랜 칸(안쪽 약 112px)에서 줄바꿈되지 않도록 `--cs-t-price-size`를 `clamp(24px,2.6vw,36px)`로 했다(초안은 28~36). 시각 확인이 필요하다.
2. **BRIEF에 없어 건드리지 않은 초안 항목**: 리드(`--cs-t-lead`, `--type-lead`)와 `.cs-work-body` 최소 높이·링크 선, `--cs-r-lg` 정리.
3. **강조 플랜**: "배지는 강조 플랜 1개"를 웹툰 묶음 그룹의 첫 플랜(12컷+모션코믹 30초)으로 해석했다. 그룹 제목이 이미 "함께 제작"이라 배지 문구와 겹친다.
4. **준비 자료**: 별도 3열 대신 포함·별도 2열 아래 한 줄(쉼표로 이은 텍스트)로 두었다. 포함/별도 중 한쪽이 비면(애니메이션·모션그래픽은 별도가 대량·정기 하나뿐) 1열로 보인다.
5. **인사이트 글 본문**(`.cs-article-*`)의 미디어 `margin-inline:auto`(가운데)는 서비스 페이지가 아니라서 그대로 두었다.
6. 가격 단위 구분점 `·`의 `text-align:center`(글리프 폭 맞춤)는 정렬 규칙의 예외로 남겼다(테스트에 명시).
7. 시각 검증(390·767·1440)은 모두 미실시. 특히 읽기 폭 컨테이너의 왼쪽 선, 관련 서비스 행 높이, 360px 플랜 2열을 확인해야 한다.
