# R7 조사: 요프리 SNS 광고가 광고 서비스 페이지에 반영되지 않았다는 지적

작성 2026-10-15 · 조사 전용(코드·서버·커밋 변경 없음) · 근거: FACTS_YOPRI.md, content/works/yofree-*.json, lib/content-site/works.server.ts, R6 문서, 고객 폴더 MG-20261012-03_v01, 3215 검토판 HTML(curl, 읽기 전용)

## 0. 결론 요약

- 코드상 광고 페이지(검토판)는 요프리 광고 2건을 이미 목록에 넣고 있다. 3215 `/content/services/ad` 응답 HTML에서 사례 5건(`bwl-aqua-ad`, `bwl-cplus-ad`, `bwl-cleanser-ad`, `yofree-mg-short`, `yofree-mg30`)과 `/content/projects/yofree-*?service=ad` 링크 2개를 확인했다. 따라서 "완전히 빠졌다"가 아니라 "눈에 띄는 자리에 없고, 카드가 작품 전체를 보여주지 못한다"가 정확한 원인이다.
- "임금 관련 SNS 광고"가 정확히 무엇인지는 UNKNOWN. 고객 폴더 `요프리` 아래 md/txt/tsv/csv/json에서 "임금·월급·급여·연봉" 검색 0건.

## (a) '임금 관련 SNS 광고' 후보와 근거

"임금"은 음성 입력 오인식일 가능성이 높다. 요프리 SNS 광고용으로 만든 영상은 아래 두 묶음이고, 둘 다 광고 서비스(`relatedServices: video/ad`)에 연결돼 있다.

| 후보 | 작품 slug | 내용 | 근거 |
|---|---|---|---|
| A. MG-20261012-03 30초 광고 3편(4개 영상) | `yofree-mg30` (order 22) | ① 하루 한 병(키네틱+클레이 캐릭터, 9:16·16:9) ② 부모님께 드리는 하루(한지·먹 프리미엄) ③ 요프리가 왔어요(웹툰 모션코믹) | `MG-20261012-03_v01/README.md`, `REVIEW_ASSETS_v02.csv`. 지시문에 사용자가 직접 거론한 작품 |
| B. MG-20261010-02 밸런스 샷 4안 | `yofree-mg-short` (order 21) | 선물 프리미엄·선물 다이내믹·효능 프리미엄·효능 다이내믹(9:16) | `REVIEW_ASSETS_v02.csv`의 파일명 `YOFREE_MG_G-P/G-D/E-P/E-D` |

"임금"과 소리가 닮은 단어로 읽히는 후보(추정, 확정 근거 없음):
- 부모님/엄마 소재: A-② "부모님께 드리는 하루"(S2). 웹툰 쪽은 "엄마가 자꾸 멈추는 이유"(외출편), "엄마, 오늘은 잘 잤어?"(밤편). 웹툰·웹툰 모션(`yofree-*-webtoon`, `yofree-*-motion`)은 광고가 아니라 웹툰 서비스에 연결돼 있다.
- 효능/기능 소재: B의 "효능" 2안(E-P, E-D). 데이터에 "제품 효능 표현은 확인 대기"라는 문구가 있다.
- 임금(王)이나 급여 같은 말 그대로의 뜻이 나오는 요프리 광고는 어디에도 없다.

## (b) 현재 광고 페이지에서 눈에 안 띄는 코드상 원인

1. 연결은 되어 있고 상한도 아슬아슬하다. `works.server.ts`의 `MAX_WORKS_BY_SERVICE = { ad: 5 }`, 광고에 연결된 작품은 정확히 5건. 선별은 `workMatchesService`(primaryService 또는 relatedServices의 `ad`) → 영상 우선 → `order` 오름차순이라 요프리 2건(order 21, 22)이 항상 맨 뒤(4·5번째)다. 광고 작품이 1건만 늘어도 `yofree-mg30`부터 잘려 나간다(`.slice(0, 5)`).
2. `placement` 규칙은 원인이 아니다. `sectionWork`는 `motion-graphics`에만 `yofree-mg30 → "character-case"`를 붙인다. 광고 서비스에는 placement가 없으므로 `service-landing.tsx`의 `works.filter(w => !w.placement)`에서 걸러지지 않는다. R6 테스트 6-2도 "광고 페이지는 같은 작품을 계속 목록에 둔다"로 고정돼 있다. 다만 모션그래픽 페이지에는 yofree-mg30이 목록에서 빠지고 캐릭터 사례 섹션에만 있어, 사용자가 "요프리 광고는 모션그래픽 쪽에 갔다"고 느꼈을 수 있다.
3. 광고 페이지의 눈에 띄는 자리는 모두 `bwl-aqua-ad` 하나만 쓴다. `components/content-site/services/ad/landing.tsx`의 Hero(레일)·Signature(`WorkSequence`)가 `works.find(slug === "bwl-aqua-ad")`로 고정돼 있다. 요프리는 레일에 포스터 이미지로만 섞여 들어갈 뿐(`reviewCards`), 영상이 재생되는 자리는 페이지 맨 아래 "사례" 그리드(`CsWorks`)뿐이다.
4. 사례 카드는 작품당 영상 1개만 보인다. `blocks/works.tsx`가 `work.media[0]`만 렌더한다. `yofree-mg30`의 `media[0]`은 `presentation: "wide"`(S1 16:9)이고 9:16 3편(S1·S2·S3)은 카드에 나오지 않는다. 즉 "30초 광고 3편"이라는 제목인데 화면에는 가로 영상 1개만 보이고, 세로(9:16) 레이아웃 그리드에 16:9 카드가 섞인다. `yofree-mg-short`은 `media[0]`이 9:16 영상 1개(선물 프리미엄)이고 나머지 3안은 상세 페이지로 가야 보인다.
5. 레이블이 약하다. 카드 태그는 `productionStatus`("제작 후보")라 SNS 광고 시안이라는 설명이 없고, 같은 페이지의 AI 가상인물 3편은 "87언니(AI 가상인물) 출연 · 제안용 시안" 라벨이 따로 있다.

가능성 낮은 다른 원인(확인함): 환경변수는 문제 없음(3215는 검토 플래그가 켜진 상태로 요프리 문자열 38건 응답). 공개 빌드는 설계상 요프리가 0건이다(정상).

## (c) 고칠 후보안

| 안 | 내용 | 영향 파일 | 장단점 |
|---|---|---|---|
| 1. 광고 페이지에 요프리 전용 섹션 추가(권장) | 검토판에서만 Signature 아래(또는 Pricing 위)에 "30초 광고 3편" 쇼케이스를 둔다. 폰 프레임 3개에 S1·S2·S3 9:16 영상을, 밸런스 샷 4안은 2x2 또는 2줄로. `placement: "ad-showcase"`를 `CsWorkCard.placement` 유니언에 추가하고, `sectionWork`에 `ad`용 항목을 넣어 맨 아래 목록과 중복 표시를 피한다 | `lib/content-site/types.ts`(placement 유니언), `lib/content-site/works.server.ts`(sectionWork·toCard), `components/content-site/services/ad/landing.tsx`(새 섹션), 신규 `ad/ad-showcase.tsx`, `ad.css`, `tests/content-site.test.mjs` 6-2류 | 사용자 지적을 가장 직접 해결. 작업량 중간. 공개판은 works가 `[]`라 분기가 렌더되지 않아 금지 문자열 0건 유지 |
| 2. 기존 목록 개선(최소 변경) | 요프리 2건을 목록 앞으로(`order` 조정 또는 sort 규칙에 광고 우선 slug), 카드에서 `media[0]` 대신 9:16 영상 우선 선택, 다중 영상은 카드 안 썸네일 스트립/"외 N편" 표시, 라벨을 "SNS 광고 시안 · 요프리 제품 광고"가 아닌 중립 문구로(공개판 노출 금지 규칙은 검토판 한정이라 고객명 라벨은 검토판 안에서만) | `lib/content-site/works.server.ts`(정렬·라벨), `components/content-site/blocks/works.tsx`(미디어 선택·다중 표시), `content/works/yofree-mg30.json`(media 순서를 9:16 먼저로), `theme.css` | 가장 작고 안전. 다만 여전히 페이지 맨 아래라 "눈에 띄지 않는다"는 지적이 남을 수 있음 |
| 3. 히어로 레일·Signature에 요프리 연결 | Hero 레일 카드에 요프리 영상 포스터를 앞쪽으로 넣고, Signature의 `WorkSequence`를 `bwl-aqua-ad` 대신 `yofree-mg30`(S3 등)과 번갈아 쓰거나 탭으로 선택하게 한다 | `ad/landing.tsx`(Hero·Signature), `ad-reel.tsx`, `lib/content-site/example-media.ts`(공개판 연출 예시와의 분기) | 첫 화면에서 요프리가 보임. 단 Signature 문구("사용하는 순간을 보여주는 광고")는 AI 인물 시안용 카피라 요프리 영상과 맞지 않아 카피 수정이 필요. 변경 범위 큼 |

공통 주의:
- `MAX_WORKS_BY_SERVICE.ad = 5`는 작품이 늘어날 때 요프리부터 잘리는 구조이므로, 안 1·2 어느 쪽이든 상한을 요프리 슬롯을 보장하도록 고치거나 요프리 전용 슬롯을 따로 두는 것이 안전하다(테스트 `content-site.test.mjs` 6-1이 광고 slug 5개와 상한 5를 고정하고 있어 함께 수정해야 한다).
- 공개판 규칙은 그대로 유지: `요프리|YoFree|yofree-|힐러넷` 문자열이 공개 HTML·`.next/static`에 0건이어야 한다(`content-site.test.mjs:59`, `content-site-wps1.test.mjs:13`, `content-r5-fix1.test.mjs:10`, `seo-http.mjs:348`). 새 섹션 문구에 고객명을 넣지 말고, 데이터는 `works.server.ts`처럼 검토 플래그 안에서만 slug를 다룰 것.
- 권리: 4개 영상 모두 `UNKNOWN/HOLD`, 영업 시안 전용, 승인② 대기. 음악 FreePD CC0 근거 재확인(사이트 폐쇄)과 건강기능식품 자율심의가 남아 있다(MG-20261012-03 README "다음 행동"). 검토판 LAN 한정 유지.

## (d) 사용자에게 던질 확인 질문

1. "요프리에서 임금 관련된 SNS 광고"는 어느 쪽인가요? (가) 30초 광고 3편(하루 한 병 / 부모님께 드리는 하루 / 요프리가 왔어요) (나) 밸런스 샷 4안(선물 2안·효능 2안) (다) 둘 다 (라) 그 외(웹툰에서 나온 장면 등). "임금"이 엄마·부모님, 효능 중 어느 말이었는지도 알려주시면 정확히 고릅니다.
2. 광고 페이지에서 어느 정도로 보이길 원하나요? 맨 아래 사례 목록 개선(안 2)이면 충분한지, 아니면 폰 프레임 3개로 3편을 나란히 보이는 전용 섹션(안 1)이나 첫 화면 연결(안 3)까지 원하는지요. 모션그래픽 페이지의 캐릭터 사례에 이미 쓰는 yofree-mg30을 광고 페이지에도 계속 보여도 되는지(현재는 두 곳 모두 노출)도 함께 정해 주세요.
