# RESULT_R6_WPC · R6 SNS 광고 영상 페이지 구현 결과

작성 2026-10-15 · 기준 HEAD `7260219` · 근거 `BRIEF_R6.md` 9절·12절, `RESULT_R6_WP0.md`, `SURVEY_R6.md` 4.5절. 커밋·빌드·서버 실행 없음, 3213·3214·3215 미접촉.

## 1. 변경 파일

| 구분 | 파일 | 내용 |
|---|---|---|
| 레일 | `components/content-site/services/ad/ad.css` | 3열 `animation-duration` 18s → 9s, 지연 -4.5s → -2.25s, -9s → -4.5s. 중앙 화면·진행 막대·재생 토글·shadow·`.cs-service-featured` 규칙과 변수(`--svc-center-w`, `--svc-screen-shadow`, `--svc-ui-*`, `--svc-control-*`), 켄번스 키프레임 삭제. 레일 칸은 `place-items` 없이 절대 배치 레일이 칸 전체를 쓴다. 정지 조건(`data-play="paused"`, `:focus-within`, reduced-motion 바깥 선언 금지)은 그대로. 머리 주석 갱신 |
| 레일 | `components/content-site/services/ad/ad-reel.tsx` | `CenterScreen`, `CenterMedia`, `children`/`center`/`labels` props, 무음 재생·진행 막대·토글 로직 삭제. `AdRail({ columns, tag })`만 남음. 레일은 `aria-hidden` 장식 유지, `useInViewPlay` 유지, client 섬 파일 1개 유지 |
| 랜딩 | `components/content-site/services/ad/landing.tsx` | `centerExample()`, `FeaturedWork`, `ProductionNotes`, `brandFilmSignature` import 삭제. 히어로는 `<AdRail columns tag/>`만. 시퀀스 섹션은 `WorkSequence` 하나 |
| 데이터 | `lib/content-site/services/ad.ts` | 히어로 lead 유지(마침표 없음). `adSignature`를 레일 문구 카드용 `screens` 3개로 축소(죽은 `collage`, `hook.eyebrow/title/lead`, 프레임 `title/body/alt` 삭제). `scope`에서 공통 가격 블록이 걸러내던 중복 항목 2개(수정 횟수, 대량·정기) 삭제 |
| 사례 | `content/works/bwl-brand-ad.json` | `primaryService` `ad` → `brand-film` (`relatedServices`는 `brand-film`만, `ad` 없음) |
| 사례 | `lib/generated/works.generated.ts` | `npm run works:build`로 재생성(PASS, 18 JSON). diff는 `primaryService` 한 줄 |
| 사례 | `lib/content-site/works.server.ts` | `MAX_WORKS_BY_SERVICE.ad` 6 → 5, 주석 갱신 |
| 슬롯 | `lib/content-site/example-media.ts` | `ad-center-1` 한 줄만 삭제 |
| 테스트 | `tests/content-site-wps2.test.mjs` | S2-3 새 계약으로 교체, S2-3b 신설, `getExampleMedia` import 추가 |
| 테스트 | `tests/content-site.test.mjs` | 6-1: 광고 상한 5, slug 5개 고정, `bwl-brand-ad`는 광고에서 제외되고 `brand-film` 선택에는 포함됨을 검사 |
| 요청서 | `docs/renewal-2026-10-13/ASSET_REQUEST_R5.md` | `ad-center-1` 항목마다 `(R6에서 중앙 카드 삭제로 요청 취소)` 표시와 취소선(MASTER-AD-A·AD-B·HOME-CARDS 참조, `home-card-ad` 설명, 4-6 표·상세, 5-4 슬롯 맵, 순위·합계 표). `ad-rail` 설명은 9초 왕복으로 수정. 합계 숫자(17·13, 59 등)는 그대로 둠, 개정판 R6에서 재계산 필요 |

`brand-film/*`은 수정하지 않았다. `landing.tsx:14`가 `bwl-brand-ad`를 slug로 직접 고르므로 그대로 동작한다.
`tests/content-r5-fix1.test.mjs`의 광고 줄(FIX1-5, 태그 한 줄 말줄임)은 `.cs-svc-ad-reel-tag` 규칙이 남아 수정 없이 통과한다.

## 2. 새 계약

- 광고 히어로 미디어 = 기울어진 3열 레일만. 중앙 카드·진행 막대·재생 토글·`FeaturedWork` 없음, `ad-center-1` 슬롯 없음.
- 레일 9초 왕복, 열 지연 0 / -2.25s / -4.5s(R5와 같은 위상 비율). 부족하면 `--svc-travel`(140px, 모바일 90px)을 늘리는 방법이 남아 있다.
- 광고 페이지 검토판 사례는 5편(`bwl-aqua-ad`, `bwl-cleanser-ad`, `bwl-cplus-ad`, `yofree-mg-short`, `yofree-mg30`). 공개판은 빈 배열 유지.
- 브랜드 홍보 페이지는 `bwl-brand-ad`를 `brand-film` 주 서비스로 계속 사용한다(검토판 `selectContentWorks("brand-film")`에 포함됨을 테스트로 확인).

## 3. 공통에 요청할 것

1. `ServiceLandingData.types`: 광고를 포함해 모든 서비스에서 화면에 쓰이지 않는다(WP-0가 `CsTypes` 렌더 삭제). `tests/content-site-wpa.test.mjs:198`이 `types.title`을 읽어 지우지 못했다. 공통 단계에서 타입과 데이터를 함께 정리할 것.
2. `ProductionNotes` export는 광고가 더 쓰지 않는다. 다른 서비스(brand-film 등)가 쓰므로 `service-hero.tsx`는 그대로이며 `content-site.test.mjs:986`의 export 존재 검사도 그대로 통과한다.
3. `ASSET_REQUEST_R5.md` 합계(필수 17 · 선택 13, 이미지 59 등)는 `ad-center-1` 취소분과 `MASTER-HERO`·`motion-bg-1` 삭제분을 합쳐 개정판 `ASSET_REQUEST_R6.md`에서 다시 계산해야 한다. `MASTER-AD-A`의 시작 프레임과 `ad-hook` 참조 이미지는 `ad-center-1`이 없어지므로 개정판에서 정해야 한다.
4. `scripts/verify-reference-pages.mjs`는 `bwl-brand-ad`를 목록에 두고 있다. 소유 밖이라 수정하지 않았다. 페이지별 소속을 검사한다면 광고에서 홍보 영상으로 옮겨야 한다.

## 4. 테스트 결과

- `npx tsc --noEmit`: 최종 실행에서 오류 0. 작업 중 다른 WP 파일(webtoon·animation·content-home·ai-influencer) 편집 중 구문 오류가 잠시 보였으나 마지막에는 해소됨.
- `npx eslint components/content-site/services/ad lib/content-site/services/ad.ts lib/content-site/works.server.ts`: 오류 0.
- 직렬 4개 파일(`content-site-wps2`, `content-site`, `content-r5-fix1`, `reference-release`): 45개 중 43 PASS · 1 skip(미디어 파생본, 기존) · **1 FAIL**.
  - FAIL = `S2-1`(AI 인플루언서 카드 3D 수치). WP-B가 같은 시간에 `ai-influencer.css`의 `--svc-side-z`를 계산식으로 바꾼 것이 원인이며 광고와 무관하다. 광고 테스트 S2-3·S2-3b와 `content-site.test.mjs` 6-1은 PASS.
  - 단독 실행에서 `content-site.test.mjs` 25개 + `content-r5-fix1` + `reference-release`는 모두 PASS였다.
- 새 검사: 중앙 카드 흔적 정규식(`ad-center`, `CenterScreen`, `FeaturedWork`, `screen-toggle`, `children` 등 landing·ad-reel·ad.css에 0), 레일 `aria-hidden` 유지, 9초와 -2.25s/-4.5s, `18s` 부재, `focus-within` 정지, 움직임은 no-preference 블록에만, 슬롯 `ad-center-1` 부재, `bwl-brand-ad`의 `primaryService`·생성본·brand-film 선택, `WorkSequence` 1개와 `ProductionNotes` 부재, 히어로 lead 원문.

## 5. 미결

1. 시각 확인 미실시(금지 사항). 중앙 카드가 빠진 뒤 레일이 미디어 칸 전체를 쓰는 모습, 390px에서 레일 3열이 잘리는 정도, 문구 카드(`밤의 향기` 등)가 가운데 열에서 보이는 위치, 9초 속도가 적절한지는 390·767·1440px 스크린샷으로 확인해야 한다.
2. 레일이 장식 전용(`aria-hidden`)이라 히어로 미디어 칸에 의미 있는 콘텐츠가 없다. BRIEF 결정(질문 7)에 따라 유지했다.
3. 검토판(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`) 레일은 `bwl-aqua-ad` 장면 3컷과 5편의 포스터를 쓴다. `bwl-brand-ad`의 16:9 포스터가 빠져 카드 수가 하나 줄었다. 별도 보충은 하지 않았다.
4. `works.generated.ts`와 소스 파일의 줄바꿈은 LF로 유지했다(저장소 기준). git이 CRLF 경고를 내는 것은 `core.autocrlf` 때문이다.
