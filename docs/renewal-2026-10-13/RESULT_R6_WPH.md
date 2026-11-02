# RESULT_R6_WPH · R6 /content 컨텐츠 홈 구현 결과

작성 2026-10-15 · 기준 HEAD `7260219`(WP-0 위) · 근거 `BRIEF_R6.md` 4·12장, `RESULT_R6_WP0.md`. 커밋·빌드·서버 실행 없음. 브라우저 확인 없음(아래 미결).

## 1. 변경 파일

| 구분 | 파일 |
|---|---|
| 새로 씀 | `components/content-home/content-home.css`(536줄 → 약 250줄, R2~R5 덧씌움 전부 폐기), `components/content-home/process-steps.tsx`(서버 컴포넌트, 4행 표) |
| 고침 | `components/content-home/content-home.tsx`, `service-showcase.tsx`, `hero-media.tsx`, `lib/content-home.ts`, `app/(content-site)/content/page.tsx`(주석 한 줄), `tests/content-home.test.mjs`(전면 재작성) |
| 삭제 | `components/content-home/hero-stage.tsx`, `service-detail.tsx`, `process-tabs.tsx` |
| 문서 | `docs/renewal-2026-10-13/ASSET_REQUEST_R5.md`(home-hero-reel·mobile·MASTER-HERO를 취소선 + "(R6에서 사용자 메이킹 필름으로 대체, 요청 취소)"로 표시만, 삭제 없음) |
| 읽기만 | `lib/content-site/types.ts`(CONTENT_SITE_ASSETS는 브랜드 영상 폴백이 쓰므로 그대로) |

`hero-video.tsx`, `use-stage-activity.ts`는 변경 없음(영상 재생 로직 재사용).

## 2. 구현한 계약

**히어로**
- 구조: `section.ch-hero > h1.cs-sr-only` + `div.ch-hero-reel[data-slot="home-hero-reel"]`. 연출 이미지·패럴랙스·드리프트·formats 서비스 링크 줄·카피·버튼 전부 삭제.
- 영상 슬롯은 항상 렌더. `hero.video`(한 줄 교체)가 있으면 `HeroMedia`(포스터 + 기존 `HeroVideoLayer` 재생·일시정지 버튼), 없으면 같은 16:9 어두운 면(`--cs-surface`) 왼쪽 아래에 `AIO MAKE CONTENT STUDIO` 캡션 한 줄(`aria-hidden`). 영상이 들어오면 자리표시는 렌더되지 않는다.
- 폭은 `min(100%, (100svh − 헤더 − 48px) × 16/9)`로 첫 화면 안에 들어오게 제한, 가운데 배치(좌우 대칭 영상 예외 1곳).
- h1(보이지 않음): "AIO MAKE 컨텐츠 스튜디오". 데이터 `contentHomeHero`는 `title · placeholder · reelSlot · video · videoPause · videoPlay`만 남김.

**서비스 캐러셀**
- 탭 칩 줄(`.ch-gallery-tabs`), `role=tablist/tabpanel`, `aria-labelledby` 탭 연결, 탭 포커스 이동 삭제. `aria-labelledby="ch-services-title"`만 남음.
- 카운터·진행 막대·일시정지·`.ch-depth-nav` 삭제. 화살표 2개(`.ch-arrow--prev/next`, 44px)가 스테이지 좌우 가장자리(`left:0 / right:0`) 세로 중앙(`top:50%`)에 absolute.
- 모바일(≤767px): 카드 280px 옆 여백(스테이지 약 35px)에 44px 버튼이 들어갈 수 없어 **스테이지 아래 양끝**(`bottom:12px`)으로 내림. 모바일 스테이지 높이 620px, 카드 맨 아래와 화살표 사이 약 86px(필요 56px)로 겹치지 않음. 테스트가 이 산식을 검사.
- 자동 회전: `animationend` 제거, `useEffect` 안 단발 `setTimeout`(이미지 `dwellMs` 3500, 영상 `videoDwellMs` 5200). 의존성 `[running, current, dwellMs, count, root]`라 정지가 풀리거나 카드가 바뀌면 처음부터 다시 잰다. 정지 조건은 hover(마우스)·키보드 포커스(`:focus-visible`)·터치 중·화면 밖/탭 숨김(`useStageActivity`)·헤더 움직임 토글·reduced-motion(타이머 자체가 시작되지 않음). 사용자 일시정지·열린 상세 상태는 삭제. `aria-live` 문장(`N / 6 이름`) 유지(자동 회전 중 off).
- 서비스 설명 블록과 `service-detail.tsx` 삭제. **선택된 카드 아래 캡션**: `서비스명 · 시작가(startingPrice.head)` / 한 줄(`line`) / `표시 태그 · 서비스 보기 →`(검토판은 `작업 보기 ↗` 추가). 선택된 카드는 전체가 같은 서비스 링크(`.ch-depth-open`, 카드 빈 곳 클릭), 옆 카드는 선택 이동 버튼. 6개 서비스 모두 공개판에서 `/content/services/<id>`로 가는 링크가 있다.
- 스와이프: 카드 전체를 덮는 이동 링크·선택 버튼에서 시작한 터치도 스와이프로 처리(그 밖의 링크·버튼·조작 막대 영상은 제외). `content-r5-fix1.test.mjs`가 요구하는 `closest("video[controls], a, button")` 문자열 유지.
- reduced-motion의 조작 막대 영상 카드는 전체 링크가 영상 조작을 가리지 않도록 카드 링크만 생략(캡션 링크는 유지).
- `homeCardMedia` 6개 슬롯 유지, 데이터에서 `video` 줄 유지.

**제작 과정(PROCESS)**
- h2 "상담에서 납품까지 / 네 단계로 진행합니다", lead "단계마다 확인하는 것과 받는 것을 미리 알려드립니다". `ol.ch-steps > li.ch-step` 4행, 행마다 `h3(번호 + 단계) | 확인하는 것 | 받는 것`.
- 사실은 BRIEF 카피 그대로: 기획안 두 번까지 수정, 최종안 한 번 수정, 다른 화면비 추가는 별도 견적(근거 `lib/content-pricing.ts`의 `common.revisions`와 `ad.notes`). 문장 끝 마침표 없음, 문장 단위로 줄 나눔(`check: string[]`).
- 박스·기울임·그림자·애니메이션 없음. 행 구분은 위 가는 선만. 모바일은 한 열로 쌓고, 768px부터 3열(`0.7fr 1.5fr 0.8fr`). 880 읽기 폭(`cs-container--read`)으로 서비스 페이지 진행 방식과 같은 왼쪽 선.
- `process-tabs.tsx`와 그 장면(종이·메모·콘티·타임라인·파일), `.cs-t-statement` 사용 삭제.

**공통**
- `.cs-home { --cs-section-y }` 덮어쓰기 삭제. 히어로 `--cs-s5 → --cs-section-y-sm`, 서비스·과정 `--cs-section-y`, 상담 띠 `--cs-section-y-sm`. 섹션 위 선·배경 교차 없음.
- 상담 띠(CTA) 유지: 제목·lead·버튼 "상담 신청 →"(`/content/contact`), 이전 최종 렌더와 같은 색(배경 `--cs-bg`, 버튼 `--cs-fg`).
- 정렬은 왼쪽. 가운데는 히어로 영상 틀(`margin-inline:auto`) 하나뿐(테스트가 1곳으로 고정).
- 데이터 정리: `contentHomeServices`는 `id · label · line · href`만 남김(설명 블록이 쓰던 `kicker · description · uses · image · imageTag · alt · scopeNote` 삭제). `contentHomeServicesHead`는 `eyebrow · title · lead · detailLink("서비스 보기")`, `pad2`와 자동 넘김 문구 등 죽은 값 삭제. `CsRelated`가 읽는 `contentHomeServices[].line`·`id`와 `startingPrice` 재내보내기는 유지.

## 3. 테스트 결과

직렬 실행, 모두 PASS.
- `npx tsc --noEmit` PASS, `npx eslint components/content-home lib/content-home.ts` 오류 0.
- `tests/content-home.test.mjs` 20개 PASS (재작성, 약화 없음).
- 영향받을 수 있는 다른 테스트 PASS: `content-site`(25), `content-site-grid`(3), `content-r5-fix1`(4), `home-journey`(16).
- NOT_RUN: `next build`, 서버 실행, 390·767·1440px 스크린샷(금지 사항), `new-tab-links`·`reference-*` 등 이 WP와 무관한 테스트.

테스트가 새로 검사하는 계약: 히어로 슬롯 구조(sr-only h1 1개, `data-slot`, 영상 있을 때/없을 때 분기, 16:9·`--cs-surface`·placeholder 위치), 연출 이미지·패럴랙스·formats 삭제와 삭제된 3개 파일 부재, 탭 칩·tablist 없음, 화살표 2개·44px·가장자리 세로 중앙·모바일 하단과 겹침 여유 산식, `animationend`·진행 막대·일시정지·카운터 없음, 단발 타이머와 의존성·dwell 값·정지 조건 전부, 설명 블록 없음·캡션 링크·카드 링크·6개 서비스 주소, PROCESS 4행 구조와 사실 문구(수정 횟수·화면비)·박스 없음, 홈 전용 간격 덮어쓰기 없음·가운데 정렬 1곳.

기존 테스트 수정 중 "원래 값을 맞춘" 항목 1건: 시작가 정본 비교에서 웹툰 `head`가 `lib/content-pricing.ts`의 다른 WP 변경(`prefix: "12컷"`, 옵션 줄 삭제)에 맞춰 `12컷 10만 원부터`, `note` 없음으로 바뀌었다. 이쪽 코드가 아니라 가격 정본을 따라간 것이다.

## 4. 미결

1. **시각 확인 전혀 없음.** 특히 (a) 3D 캐러셀에서 화살표가 태블릿(768~1023px) 옆 카드 위에 겹치는 정도, (b) 모바일 캡션이 최소 높이(188px)보다 길어질 때(AI 인플루언서 태그 줄바꿈) 화살표와의 거리, (c) 히어로 16:9 틀의 첫 화면 높이 제한, (d) PROCESS 행 간격. 모두 390·767·1440px에서 확인해야 한다.
2. **모바일 화살표 위치**: BRIEF의 "카드 옆 8px 여백 안 44px 버튼"은 스테이지(콘테이너 폭 약 350px)에서 카드 옆 여백이 약 35px라 불가능해 "스테이지 아래 양끝"으로 처리했다. 스테이지를 화면 폭까지 넓히는 방안은 360px에서 여전히 불가해 택하지 않았다.
3. **캡션 "한 줄" 해석**: `서비스명 · 한 줄 · 시작가 · 서비스 보기 →`가 280px 카드에서 실제 한 줄로 나올 수 없어 3행(이름·시작가 / 한 줄 / 태그·링크)으로 배치했다. 한 줄 링크 전체를 하나의 `<a>`로 묶는 안은 아니다.
4. **상담 띠 구분**: 섹션 위 선 삭제 규칙을 따라 PROCESS와 CTA 사이는 여백뿐이다. 띠로 보이게 하려면 배경 면이 필요하나 BRIEF에 없어 넣지 않았다.
5. **h1 문구**: sr-only h1을 "AIO MAKE 컨텐츠 스튜디오"로 정했다(자리표시는 영문 "AIO MAKE CONTENT STUDIO"). 검색 제목은 `page.tsx` 메타데이터("컨텐츠 대행")가 따로 맡는다. 문구 변경은 데이터 `title` 한 줄.
6. **서비스 설명 데이터 폐기**: 홈에서 설명 블록이 사라져 `description · uses · scopeNote`(예: AI 인플루언서 "계정 게시·운영은 별도 견적")를 데이터에서도 지웠다. 홈에서 계정 운영 별도 안내는 더 이상 보이지 않고 서비스 페이지에만 남는다. 필요하면 캡션이나 FAQ로 다시 올려야 한다.
7. **다른 WP와 같은 파일**: `docs/.../ASSET_REQUEST_R5.md`는 WP-C가 `ad-center-1` 취소 표시를 동시에 고치고 있었다. 읽고 바로 쓰는 방식으로 두 변경이 모두 남은 것을 diff로 확인했으나, 이후 다른 쪽이 덮어쓰면 home-hero-reel 표시가 사라질 수 있다.
8. **`hero.video` 포스터**: 영상이 들어오면 `HeroMedia`가 `video.poster`를 하단 이미지로 쓴다(`alt=""`, 영상 자체는 기존대로 `aria-hidden`). 영상에 접근성 설명이 필요한지는 사용자 결정 사항.
