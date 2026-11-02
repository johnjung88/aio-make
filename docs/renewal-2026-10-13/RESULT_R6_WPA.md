# RESULT_R6_WPA · 웹툰·애니메이션 페이지 구현 결과

작성 2026-10-15 · 기준 HEAD `7260219` · 근거 `BRIEF_R6.md` 5·6절, `RESULT_R6_WP0.md`. 커밋·빌드·서버 실행 없음.

## 1. 변경 파일

| 구분 | 파일 | 내용 |
|---|---|---|
| 웹툰 | `components/content-site/services/webtoon/landing.tsx` | 히어로 미디어를 표지 컷 1장(`CsMedia` 2:3, `CUTS[0]`, 자체 웹툰 태그, priority)으로 교체. 순서 읽기 → 모션코믹. Unfold 삭제. 모션코믹은 영상 + lead 한 줄 + 맡기는 방법 2개(텍스트, 위 가는 선만). 캡션·가격 링크·번호 칩·`cs-section--alt` 삭제 |
| 웹툰 | `webtoon/webtoon-experience.tsx` | `WebtoonCover`·`WebtoonUnfold` 삭제, `WebtoonReader`만 남김(client 섬 1개 유지) |
| 웹툰 | `webtoon/webtoon.css` | 494줄 → 243줄. 표지 카드·캡션·폰 틀·스크롤 틀·글로우·R2 덮어쓰기·펼침 전부 삭제. 책 리더와 모션코믹만 남김, 책·표지는 열의 왼쪽 선에서 시작 |
| 웹툰 | `lib/content-site/services/webtoon.ts` | `signature`에서 `cover`·`unfold`·리더 칩/힌트·영상 캡션·`priceLink` 삭제, 모션코믹 lead와 방법1 문장 다듬기(30초나 60초 → 방법1에만 한 번), 히어로 lead "엮어"로 |
| 웹툰 가격 | `lib/content-pricing.ts` | 웹툰 시작가 앞부분 `웹툰 제작 12컷` → `12컷`, `note`(모션코믹 영상화 옵션) 삭제. 히어로 줄이 "12컷 10만 원부터 · 부가세 별도". 금액은 그대로 |
| 애니메이션 | `animation/landing.tsx` | 히어로 = 텍스트 + 대표 슬롯(`animation-hero-1`) 1개. 영상 레퍼런스 영역 신설. `WorkSequence`·`ProductionNotes`·`FeaturedWork`(요프리 연결) 제거 |
| 애니메이션 | `animation/animation.css` | 38줄 → 약 45줄 전면 교체. 숨 쉬는 링·점, 죽은 보드/그림체/플랜 규칙 삭제. 레퍼런스 그리드(모바일 1열, 768부터 2열, 칸은 항상 16:9)와 빈 면 |
| 애니메이션 | `lib/content-site/services/animation.ts` | `animationSignature`에서 `styles`·`beforeMotion` 삭제 → `reference`(eyebrow·title·empty). 신규 `animationReferenceIds` |
| 테스트 | `tests/content-site-wpa.test.mjs` | 새 구조 계약으로 전면 갱신(아래 3절) |

## 2. 설계 요점

- **레퍼런스 추가 방법**: `example-media.ts`에 `section: "scene"` 슬롯 한 줄을 만들고(영상이면 `kind: "video"`, `src`, `poster`) `animationReferenceIds`에 id를 한 줄 더하면 그리드가 한 칸 늘어난다. `src`가 빈 슬롯은 그리지 않는다. 슬롯이 0개일 때만 16:9 빈 면과 "영상 레퍼런스를 순서대로 추가합니다". 칸은 `ExampleFigure`를 재사용하므로 영상은 보이는 동안만 무음 반복, 태그는 슬롯 label("연출 예시").
- **시작 상태**: `animation-scene-1..3`(연출 예시 3장) 그대로. `example-media.ts`는 건드리지 않았다.
- **웹툰 가격 박스**: 세 그룹 모두 플랜이 2개라 공통 `.cs-pricing-grid[data-count="2"]`가 360px부터 2열이다. 390px에서 한 줄 2칸이 유지되는 CSS 계약을 테스트로 고정했다(시각 확인은 미실시). 박스는 `align-items: flex-start`라 라벨과 금액이 왼쪽 정렬.
- **표지 컷 떠오름 차단**: 공통 `service-motion.css`가 `data-motion-variant="webtoon"` 안의 모든 `img`에 떠오름 애니메이션을 건다. `.cs-media`가 이미지를 자르므로 표지가 틀 안에서 밀려 빈 줄이 생긴다. `webtoon.css`의 no-preference 블록에서 표지 한 장에 한해 `animation-name: none`으로 껐다.
- 웹툰 `data.types`·`scope`는 데이터에 남아 있다. 공통 랜딩이 `types`를 렌더하지 않고 `scope`는 `CsPricing`이 쓴다.

## 3. 테스트

- 신규/변경: A-1b(히어로 가격 줄, 그룹 순서·금액·2칸, 정렬), A-2b(표지 1장, 순서, 펼침·죽은 CSS 삭제), A-3(캡션 없음, 태그 2개, 방법 2개 텍스트), A-5(레퍼런스 구조·16:9 그리드·빈 면·삭제 항목·시작 3장), A-6, A-7(웹툰 키프레임 유지, 애니메이션 CSS에 자체 루프·sticky 없음), A-8. A-2·A-4는 새 구조(표지+리더 sizes 2곳, priority 위치, 애니메이션 client 파일 0)에 맞춰 검사 대상을 바꿨고 느슨해진 항목은 없다.
- 실행 결과(직렬)
  - `npx tsc --noEmit` PASS
  - `tests/content-site-wpa.test.mjs` + `tests/content-site.test.mjs` 35개 PASS
  - 함께 확인한 PASS: `content-r5-fix1`, `content-site-wps1`, `content-site-wps2`, `content-site-grid`, `content-scenes`, `reference-release`
  - eslint(웹툰·애니메이션 폴더, 두 서비스 데이터, `content-pricing.ts`) 오류 0
- 실패(이 작업 소유 아님, 동시 작업 중인 WP)
  - `content-home.test.mjs`: 파일 단위 로드 실패(`hero ... alt`). WP-H 진행 중 변경으로 보이며, 별개로 아래 공통 요청 3번의 단언 2곳이 이번 가격 변경으로도 깨진다
  - `content-site-wpb.test.mjs` B-2, `content-site-wps2.test.mjs` S2-1: WP-B(AI 인플루언서) 진행 중 변경
- NOT_RUN: `npm run build`, 서버, 390·767·1440px 스크린샷, `local-admin`·`inquiry-direct`·`seo-http.mjs`

## 4. 공통 요청 (다른 WP/공통 소유자)

1. **WP-H**: `tests/content-home.test.mjs` 134행 `"웹툰 제작 12컷 10만 원부터 · 부가세 별도"` → `"12컷 10만 원부터 · 부가세 별도"`, 154행 `price.head` → `"12컷 10만 원부터"`, 155행 `price.note` 단언 삭제(웹툰도 note 없음). 홈 시작가 줄이 이 값을 그대로 출력한다. `service-detail.tsx`를 지웠다면 `StartingPrice.note` 타입과 `startingPrice()`의 note 통로(`lib/content-pricing.ts:91,96,140`)도 지울 수 있다.
2. **WP-0**: `service-motion.css`의 `.cs-webtoon-fan*`(85~91줄)와 `[data-motion-variant="webtoon"] img[data-panel]`·떠오름 규칙(100~104줄)은 웹툰 부채가 없어져 죽은 규칙이다. 지우면 `webtoon.css`의 표지 보호 규칙(no-preference 블록)도 함께 지울 수 있다. `service-editorial.css` 끝쪽의 `.cs-svc-webtoon … cover/cover-caption/cover-card` 4줄도 죽은 규칙이다.
3. **WP-0**: `ServiceLandingData.types`가 필수라 두 서비스의 `types` 데이터가 화면에 쓰이지 않는 채 남아 있다. 선택 필드로 바꾸면 두 서비스 데이터에서 지울 수 있다(테스트 A-8이 `types.title`을 읽고 있어 같이 정리).
4. 공통 pricing 그리드는 이번 범위에서 수정 요청 없음. 390px 시각 확인에서 깨지면 재요청.

## 5. 미결

1. **히어로와 첫 레퍼런스가 같은 그림**: `animation-hero-1`과 `animation-scene-1`이 같은 원본(`animation-character.webp`)이다(크롭만 다름). 사용자가 영상을 만들면 슬롯 한 줄씩 교체하면 해소된다. 지금은 BRIEF 6절 지시(연출 예시 3장으로 시작)를 따랐다.
2. **대표 슬롯 비율**: 히어로 대표 슬롯은 기존 2:3 이미지다. 16:9 영상으로 바꾸면 `[data-aspect="16x9"]` 규칙이 세로 제한을 풀어 열 전체를 쓴다(모바일은 그대로 전폭).
3. **웹툰 표지 크기**: 2:3 컷을 최대 폭 440px로 열 왼쪽에 둔다. 데스크톱에서 텍스트 열보다 높아지는지, 오른쪽에 빈 폭이 남는 정도는 시각 확인이 필요하다.
4. **모바일 390px 시각 확인 전부 미실시**: 가격 2칸 박스 안 줄바꿈("17.5만 원", "웹툰 12컷 + 모션코믹 30초" 라벨), 읽기 섹션 책 크기, 레퍼런스 1열.
5. 웹툰 SEO 설명문에 "웹툰 제작 12컷 10만 원부터"가 남아 있다(새 시작가 앞부분 "12컷 10만 원부터"를 포함해 테스트 통과). 문구 통일이 필요하면 `webtoon.ts` seo.description 한 곳.
