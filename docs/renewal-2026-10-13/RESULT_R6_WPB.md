# RESULT_R6_WPB · AI 인플루언서 · 모션그래픽 구현 결과

작성 2026-10-15 · 기준 HEAD `7260219` · 근거 `BRIEF_R6.md` 7·8·12장, `RESULT_R6_WP0.md`, `SURVEY_R6.md` 4.3·4.4·7, `FACTS_YOPRI.md`, `FACTS_AI_INFLUENCER.md`. 커밋·빌드·서버 실행 없음. 브라우저 확인 없음(시각 검증 NOT_RUN).

## 1. 변경 파일

| 구분 | 파일 | 내용 |
|---|---|---|
| AI 인플루언서 | `components/content-site/services/ai-influencer/landing.tsx` | `ServiceHero wide`(글 위 · 덱 아래 전체 폭), 브랜드 전용 인물 섹션을 데이터(`signature.brand`)에서 렌더 |
| | `.../ai-influencer/creator-experience.tsx` | `CreatorDeck` 재작성: 카드 + 카드 아래 `[←] 이름 [→]` 한 줄만 |
| | `.../ai-influencer/ai-influencer.css` | 덱 크기·기하를 카드 너비 비율로 재정의, 히어로 레이아웃, 계정 소개 박스 줄임, 브랜드 인물 텍스트 행 |
| | `lib/content-site/services/ai-influencer.ts` | 히어로 lead 교체, `signature.brand` 추가(3항목 + 표기 고지 1문장) |
| 모션그래픽 | `components/content-site/services/motion-graphics/type-composition.tsx` | **삭제** |
| | `.../motion-graphics/landing.tsx` | TypeComposition·ProductionNotes·plan-compare·도우미 삭제, `CharacterCase` 추가 |
| | `.../motion-graphics/character-case.tsx` | **신규** 서버 컴포넌트(공개 3단계 + 검토판 분기) |
| | `.../motion-graphics/motion-graphics.css` | 599줄 → 약 75줄(composition/live/도형/글자/키프레임/단순형·맞춤형/스타일 프레임 삭제) |
| | `lib/content-site/services/motion-graphics.ts` | `signature`를 `characterCase`로 교체(`stage`·`compare`·`frame` 데이터 삭제) |
| 테스트 | `tests/content-site-wpb.test.mjs` | B-4~B-8 새 계약(아래 4장), B-2·B-3 갱신 |
| 소유 밖 테스트 최소 수정 | `tests/content-site-wps1.test.mjs` | 삭제된 `type-composition.tsx` 읽기(1곳)와 `.cs-svc-motion-graphics-modes` 44px 검사(1줄) 제거 |
| | `tests/content-site-wps2.test.mjs` | S2-1(AI 덱)만: `side-z` 값을 비율식으로, 히어로 덱 피드 3컷·`deck-select` 검사를 새 덱(화살표 44px)·계정 소개 피드 썸네일로 교체. S2-3(광고)은 WP-C 소유라 손대지 않음 |

## 2. AI 인플루언서 (BRIEF 7장)

- **히어로**: 글(제목 왼쪽, 리드·가격·상담 신청 오른쪽, 모바일은 제목 → 리드·가격·버튼 → 덱) 위, 카드 덱 아래 전체 폭. 공통 `ServiceHero`의 `wide` 변형을 쓰고, 모바일 순서만 AI CSS가 바꾼다(명시도 `(0,4,0)`).
- **카드 크기**: 모든 거리가 카드 너비 `--svc-card-w`의 비율이다. 모바일 `min(75vw, 290px)` x 1.4 = 290 x 406(390px 화면), 768px 이상 `min(480px, 48vw)` x 1.4 = 480 x 672(1000px 이상에서 480). 덱 높이 = 카드 높이 + 24px, 옆 카드 간격 `.625w`, 깊이 `-.354w`, 원근 `2.3w`(예전 480 기준 `150/-170/1100`과 같은 비율).
- **잘리지 않는 조건**: 옆 카드 바깥 끝이 카드 너비의 약 0.93배라 데스크톱은 768~2560px 전 구간에서 컨테이너 안에 들어온다(테스트 B-6이 8px 간격으로 계산). 컨테이너는 가로만 `overflow-x: clip`이라 그림자는 세로로 잘리지 않는다. 모바일은 앞 카드가 뷰포트 75%, 거터 안에 완전히 들어오고, 덱을 거터만큼 넓혀 옆 카드가 화면 가장자리에서 약 50px 보인다(옆 카드의 화면 끝 절단은 캐러셀 연출이며 앞 카드는 안 잘림).
- **sizes**: `(max-width:767px) 75vw, 480px`(원본 900x1200은 충분).
- **삭제**: 덱 주변 피드 3컷 줄, 이름 버튼 4개, 타이머 막대, 카테고리·한 줄·"계정과 피드 보기"·"자체 IP · AI 가상인물 4명" 줄, 가운데 정렬 카피. 카드 안에는 `AI 가상인물` 표기만 남기고 이름은 카드 아래 한 줄(중복 제거). 화살표 44px, 키보드 접근 가능. 자동 회전(`DECK_MS` 4000)·정지 조건(hover·focus·터치·화면 밖·숨김 탭·움직임 끔)·스와이프·카드 클릭 선택 유지.
- **lead**: "얼굴과 말투, 관심사를 정해 브랜드 전용 AI 가상인물을 만들고 제품 이미지와 숏폼을 제작합니다".
- **섹션 순서**: 히어로 → 4계정 소개(탭 유지, 패널 아래 선·메타 선·큰 패딩 삭제, 피드 화면 왼쪽 기준, "네 계정 모두 펼쳐 보기" 유지) → 브랜드 전용 인물 제작 → (공통) 가격 → 진행 → FAQ → 문의 → 다른 서비스.
- **브랜드 전용 인물 제작**: 기존 Types(레지스트리에서 이미 렌더 안 함)와 BeforePricing을 한 섹션으로. 제목 "브랜드 전용 인물 / 세 가지로 만듭니다"(의문형 제목 삭제), 3항목은 박스 없이 위 가는 선 행, 03 "영상 확장"에서 AI 표기 문구를 빼서 고지 한 문장("AI 가상인물 표기 · 광고 표기 · 플랫폼 합성 컨텐츠 설정을 함께 안내합니다")과 겹치지 않게 했다. "계정 게시·운영 및 대량 제작은 별도 견적"은 공통 가격 블록의 주석 한 줄(기존 그대로).
- 87언니는 'AI 가상인물' 표기 유지, 팔로워·성과·운영 중 표현 없음(기존 테스트 유지).

## 3. 모션그래픽 (BRIEF 8장)

- **삭제**: `type-composition.tsx`(client 섬 0개가 됨), CSS composition/live/도형·글자·키프레임·단순형/맞춤형·스타일 프레임 규칙, landing의 호출·import·`compositionImage`·`slotImage`·`MEDIA_TAGS`, `ProductionNotes`, plan-compare, 데이터 `stage`·`compare`·`frame`. 히어로 예시 이미지 위의 도형 장식 2개(키프레임 `drift`·`spin`)는 요청 범위에 없어 남겼다(미결 4).
- **섹션 순서**: 히어로 → 화면 전환 시퀀스(`WorkSequence` 유지) → 캐릭터 제작 사례 → (공통) 가격 단순형/맞춤형 → 진행 → FAQ → 문의 → 다른 서비스.
- **캐릭터 제작 사례(공개판)**: 제목 "브랜드 전용 캐릭터는 이렇게 만듭니다", 3단계(공통 `.cs-steps` 행, 박스 없음).
  - 01 캐릭터 설정: "브랜드의 말투와 성격, 쓰는 장면의 규칙을 먼저 정합니다"(일반 공정, 성격·세계관·외형·수치·기간 없음)
  - 02 포즈 디자인: "제품을 의인화한 점토 질감의 캐릭터를 이미지 생성 도구로 포즈별로 여러 장 만듭니다"(FACTS_YOPRI b-1·b-4)
  - 03 모션 제작: "배경을 제거한 컷아웃에 움직임을 입혀 30초 광고 영상에 씁니다"(b-2·b-3)
  - 고객명·제품명·`yofree`·숫자 없음, 이미지 없음. 문구는 `lib/content-site/services/motion-graphics.ts`의 `characterCase`에 있어 기존 카피 테스트(마침표·숫자·영문·쉼표·금지어)를 그대로 받는다.
- **검토판**: `character-case.tsx`(서버 컴포넌트)가 `works.server.ts`가 검토 플래그에서만 넘기는 `works`에서 `yofree-mg30`(30초 광고 모션그래픽 3편, 영상 4개)을 찾아 같은 섹션 아래 영상으로 붙인다. 환경 변수는 읽지 않고 공개판은 `works`가 `[]`라 분기가 렌더되지 않는다. 고객 slug는 이 서버 파일 한 곳에만 있다(`lib`·landing·CSS·client에는 없음). 검토판 선택 결과는 `bwl-brand-motion, healernet-motion, yofree-mg-short, yofree-mg30`을 실제로 확인했다.

## 4. 테스트 결과

- `npx tsc --noEmit` PASS, `npx eslint`(두 서비스 폴더 + 두 lib 파일) 오류 0.
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-site-wpb.test.mjs tests/content-site.test.mjs tests/content-r5-fix1.test.mjs` 37 중 37 PASS. 공개 번들 고객 문자열 금지(content-site.test.mjs 6번, 카피 규칙의 고객명 검사, r5-fix1의 슬롯 검사) 통과.
- 추가 확인: `content-site-wps1`·`content-site-wps2`·`content-site-grid`·`reference-release`·`reference-media` 직렬 PASS(25 pass, 1 skip).
- wpb 신규 계약: B-4(MOTION STUDY·plan-compare·ProductionNotes·구성 CSS·키프레임 삭제, 섹션 순서), B-5(공개 3단계 문구·고객명/숫자 없음·서버 컴포넌트 분기·검토 데이터 상태), B-6(카드 크기 식과 768~2560px·320~767px 기하 계산, 레이아웃·sizes·overflow), B-7(덱에서 옛 요소 삭제·이름 한 줄·화살표 44px·자동 회전 유지), B-8(브랜드 인물 섹션·박스 없음·고지 한 문장·lead).
- NOT_RUN: `npm run build`, 서버, 390·767·1440px 스크린샷, 실제 터치 스와이프. 3D 카드 기하는 투영 계산으로만 확인했다.

## 5. 공통 요청 (소유 밖, 필요 시 처리)

1. **`service-landing.tsx`(WP-0)**: 검토판에서 `CsWorks`가 `yofree-mg30`을 한 번 더 보여준다(캐릭터 사례 영상 + 맨 아래 사례 목록). 중복을 피하려면 motion-graphics일 때 `CsWorks`에서 이 작품을 빼야 한다. 지금은 그대로 둔다.
2. **`motion-runtime.tsx`**: `useAutoCycle`이 어디에서도 쓰이지 않게 됐다(MOTION STUDY가 유일한 사용처였음). 삭제 여부는 WP-0 판단.
3. **`lib/content-site/example-media.ts`**: `motion-bg-1`은 이제 사용처가 없다(코드 사용처 0, 참조는 `content-site-wps1.test.mjs:86`의 `getSlot` 존재 검사뿐, 파일은 `public/content-examples/motion-graphics/motion-ribbon.webp`). 슬롯과 `ASSET_REQUEST_R5.md`의 `motion-bg-1` 항목 삭제는 소유 밖이라 하지 않았다.
4. **`service-editorial.css`(WP-0)**: `.cs-svc-ai-influencer .cs-svc-ai-influencer-feed figure[data-feed-index]` 두 줄은 이미 없는 클래스를 가리키는 죽은 규칙이다.

## 6. 미결

1. **6포즈 실물이 없다**: 작업 지시의 "검토판 works 데이터 `yofree-*`의 6포즈"에 해당하는 이미지 작품 데이터가 저장소에 없다(`content/works/yofree-*`는 영상·웹툰뿐, `public/reference-review/yofree-*`에도 캐릭터 PNG 없음). 포즈 PNG 6장은 고객 폴더의 쇼핑몰 zip 안에만 있다(FACTS_YOPRI A3). 지금 검토판은 광고 3편만 붙는다. 6포즈를 보이려면 포즈 이미지를 검토판 전용 작품(`content/works/*.json` + `public/reference-review/...`, `npm run works:build`)으로 추가해야 하며, `character-case.tsx`의 `ReviewCase`는 media 종류(영상·이미지)를 가리지 않고 그리므로 같은 `REVIEW_CASE` 작품에 이미지를 넣으면 그대로 나온다(별도 작품이면 slug 목록 확장 필요). 사용자 결정 필요.
2. **모션그래픽 FAQ 4개**: 서비스 문항이 2개뿐이라 합계 4(공통 2). 새 문항은 캐릭터 사례나 준비 자료와 겹쳐서 "같은 사실 한 번만"에 걸려 추가하지 않았다. 필요하면 사용자가 주제를 정해 주어야 한다.
3. **AI 표기 사실의 이중 서술**: 브랜드 인물 섹션의 고지 한 문장과 FAQ 3번 답이 같은 사실이다(문구는 다름). 브리프가 고지를 섹션에 두라고 해서 FAQ는 유지했다. 한쪽을 줄일지 사용자 판단.
4. **모션그래픽 히어로 예시의 장식 도형 2개**(원호·점): TYPE_STANDARD 7장의 "장식용 도형 금지"와 충돌할 수 있으나 BRIEF 8장의 삭제 범위에 없어 남겼다.
5. **시각 검증 필요 지점**: (a) 모바일 390px에서 옆 카드가 화면 끝에서 보이는 정도와 앞 카드 아래 `[←] 이름 [→]` 줄, (b) 768~1000px에서 `48vw` 카드와 옆 카드 간격, (c) wide 히어로에서 제목(왼쪽)과 리드·가격·버튼(오른쪽)의 높이 균형, (d) 카드 `object-position: center 28%`의 1:1.4 크롭(원본은 3:4), (e) 모션그래픽 `.cs-steps` 3행이 읽기 폭 컨테이너에서 보이는 모양.
6. **계정 소개 섹션 "박스 줄임" 범위**: 패널 아래 선·메타 위 선·큰 패딩을 없애고 피드 화면을 왼쪽 기준으로 돌렸다. 탭(위 가는 선)·피드 화면 틀·썸네일은 조작 요소라 유지했다. 더 줄일지 확인 필요.
