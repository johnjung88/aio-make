# BRIEF P1 — 컨텐츠 서비스 6종 정리 + 레퍼런스 등록 체계

먼저 `COMMON.md`를 읽고 따른다. 결과는 `RESULT_P1.md`.

## 배경
AIO MAKE의 컨텐츠 분과(내부 division id `video`, URL `/content`)의 서비스를 사용자 기준 6종으로 바꾸고, 레퍼런스(작품)를 코드 수정 없이 폴더+JSON으로 추가할 수 있게 만든다. 화면 재디자인은 P2~P4에서 하므로 이번 단계는 **데이터·라우팅·문구·등록 체계**가 범위다. 단, 중간 상태에서도 모든 페이지가 빌드·렌더되어야 한다.

## Part A. 서비스 6종

| 순서 | id | 표시명 | 비고 |
|---|---|---|---|
| 01 | webtoon | 웹툰 | 기존 `웹툰 제작` |
| 02 | animation | 애니메이션 | 유지 |
| 03 | ai-influencer | AI 인플루언서 | 기존 `AI 인플루언서 제작` |
| 04 | motion-graphics | 모션그래픽 | **신설** |
| 05 | brand-film | 브랜드 홍보 영상 | 기존 `브랜드 홍보 컨텐츠` |
| 06 | ad | SNS 광고 영상 | 기존 `SNS 광고 컨텐츠` |

`editing`(컨텐츠 편집)은 **삭제**한다.

### 해야 할 일
1. `lib/content.ts`: video division의 서비스 목록을 위 6종으로. `motion-graphics`의 `subtitle/description/audience/outcomes/inputs`를 다른 서비스와 같은 수준으로 작성(예: 제품·브랜드 메시지를 그래픽·타이포·장면 전환으로 풀어 30초 안팎 영상으로 만드는 서비스; 근거 없는 수치 금지). 각 서비스의 표시명과 subtitle을 위 표 기준으로 정리한다. `editing` 관련 데이터 제거. L370 오타 "컨텐츠가나" 사라지도록(편집 서비스와 함께 삭제됨, 남아 있으면 수정).
2. division `video`의 `summary`(lib/content.ts:40-41)와 아래 하드코딩 나열 문구를 모두 **"웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 및 SNS 광고 영상"** 취지로 통일(문맥에 맞게 구분자·어순은 조정 가능):
   `components/guide/main.jsx:406`(홈 Studio 카드), `main.jsx:38`(FAQ 답변), `components/guide/about.jsx:423`, `lib/guide-content.ts:23,32`. `scripts/generate-*.mjs`와 `public/social/*.svg`는 이번 범위 밖(RESULT에 남은 위치만 기록).
3. 서비스 키 매핑 정리 (`editing→edit` 제거, `motion-graphics` 추가): `app/(public)/[division]/services/[service]/page.tsx` L13-17, `components/guide/primitives.tsx`(`serviceKeys`, `guideServiceHref`, `guideContactKey`), `components/guide/studio-services.jsx`의 `W()`와 `SVC`, `components/guide/studio-contact.jsx:30`, `components/guide/studio-home.jsx:29-36,33`, `lib/creative-assets.ts`, `lib/guide-content.ts`(서비스별 예시 생성), 문의 폼의 서비스 선택지, `lib/domain.ts` 검증.
   - `studio-services.jsx`는 P2에서 통째로 교체된다. 이번에는 `SVC`에 `motion` 키(=motion-graphics)를 **임시 최소 구성**으로 추가해 페이지가 렌더되게 하고, `edit` 항목은 제거한다. 임시 항목에는 `// P2에서 교체` 주석을 단다.
4. 이미지: `serviceVisual()`(lib/content.ts) 등이 서비스별 샘플 이미지를 요구하면, `motion-graphics`는 기존 실제 자산(예: `public/reference-review/bwl-brand-motion/` 포스터 또는 기존 `/creative-v08` 중 적합한 것)을 참조한다. 새 이미지를 생성하지 않는다.
5. 리다이렉트 (`lib/redirects.ts`): `/content/services/editing`, `/video/services/editing`, `/ko/video/services/editing` → `/content` **301**(영구). 기존 `/video→/content` 규칙과 충돌 없이. `tests/domain.test.mjs`에 이 규칙 검증 추가.
6. 기존 레거시 보존: `/video/work/example-webtoon` 등 기존 리다이렉트 테스트는 계속 통과해야 한다.

## Part B. 레퍼런스 등록 체계 (폴더 + 데이터 파일)

현재 18작품은 `lib/work-catalog.ts`의 `reviewWorkMetadata`·`workDetails`·`featuredReviewSlugs`와 `lib/prepared-work-media.ts`(생성물)에 흩어져 있다. 이를 아래 구조로 옮긴다.

1. `content/works/<slug>.json` — 작품 1개당 파일 1개. 필드:
   `slug, id, brand, title, division("video"|"development"|"marketing"), primaryService, relatedServices[{division,id}], productionStatus("제작 예시"|"제작 후보"|"제작 완료"|"운영 중"), visibility("public"|"review"), rightsConfirmed(boolean), featuredOrder?(number), description, purpose, scope, media[]`
   `media[]` 항목은 기존 `WorkMedia`(kind, src, alt, poster?, mobileSrc?, width?, height?, presentation?)와 동일하되, 원본에서 웹용 파생물을 만들 때 쓰는 `source`(원본 경로, 선택) 필드를 허용한다. 현재 `public/reference-review/<slug>/`에 있는 파일 경로·크기·순서를 **그대로** 보존한다(현 `prepared-work-media.ts` 값을 JSON으로 옮기되 값이 바뀌면 안 된다).
2. `lib/work-schema.ts` — zod 스키마(프로젝트에 zod 3.25 이미 있음). 검증 규칙: division과 primaryService/relatedServices가 `lib/content.ts` 서비스와 일치; `purpose !== scope`(기존 테스트 규칙); video가 있으면 `.webp` poster 필수; 웹툰 media는 `gallery-NN` 순서; `visibility:"public"`이면 `rightsConfirmed:true` 및 `productionStatus !== "제작 후보"` 필요(기존 `publicWorkCatalog` 가드 유지).
3. `scripts/build-works.mjs`(신규) + `package.json`에 `"works:build"`:
   - `content/works/*.json` 읽기 → 스키마 검증 → `lib/generated/works.generated.ts` 생성(커밋 대상). 생성물 상단에 "자동 생성, 직접 수정 금지" 주석.
   - 기존 `scripts/prepare-reference-media.mjs`의 sharp/ffmpeg 파생물 생성은 유지하되, JSON의 `source`가 있고 `public/reference-review/<slug>/`에 결과가 없을 때만 생성하는 `--media` 옵션으로 연결한다. 옵션이 없으면 생성물(TS)만 갱신한다.
   - 검증 실패 시 파일명·필드를 명시한 오류로 종료(exit 1).
4. `lib/work-catalog.ts`: `reviewWorkMetadata/workDetails/featuredReviewSlugs`를 제거하고 생성물을 읽도록 변경. `reviewWorks`가 `visibility:"review"` 또는 `rightsConfirmed:false` 항목, `publicWorks`가 공개 항목이 되도록 하되 **외부 동작은 불변**: `displayWorkCatalog`는 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW==="1"`일 때만 review 작품을 포함, `publicWorkCatalog`/사이트맵은 review 작품을 절대 반환하지 않음. `lib/prepared-work-media.ts`는 삭제하고 `scripts/prepare-reference-media.mjs`가 더 이상 그 파일을 쓰지 않게 한다.
5. 18작품 이관 + 서비스 재배치(현재 → 변경):
   - `bwl-brand-motion`, `healernet-motion`: brand-film → **primary `motion-graphics`**, related `brand-film`
   - `yofree-mg-short`, `yofree-mg30`: ad → **primary `motion-graphics`**, related `ad`
   - `yofree-outing-motion`, `yofree-night-motion`: `animation` 유지, related `webtoon` 유지
   - 웹툰 4·광고 4(`bwl-brand-ad`, `bwl-aqua-ad`, `bwl-cplus-ad`, `bwl-cleanser-ad`)·개발 5(`bwl-store`, `healernet-website`, `bwl-editorial`, `yofree-shop` 등)는 서비스 불변. 단 `bwl-brand-ad`의 related는 brand-film 유지.
   - 각 작품의 title, description, purpose, scope 문장은 **원문 그대로 이관**(P2 이후 카피 정리는 별도).
   - `featuredOrder`는 기존 `featuredReviewSlugs` 순서와 동일한 정렬 결과가 나와야 한다.
6. `tests/reference-release.test.mjs`: 하드코딩된 "18작품·17영상" 대신 `content/works/*.json` 개수를 기준으로 검증(파일 개수 = 카탈로그 개수, 고유 경로, 영상 poster, 웹툰 순서). 기존 의미 검증(bwl-aqua-ad는 video/ai-influencer 매칭, marketing은 아님 등)은 유지. 새 테스트 추가: ① 스키마 위반 JSON(예: 잘못된 service id)이 `works:build` 단계에서 실패, ② review 작품이 `publicWorkCatalog`와 sitemap에 없음, ③ `motion-graphics` 서비스에 해당 4작품이 매칭, ④ `editing` 리다이렉트.
7. `docs/REFERENCES.md`: 새 레퍼런스 추가 절차 5단계(① `public/reference-review/<slug>/`에 원본 또는 `source` 지정 ② `content/works/<slug>.json` 작성 ③ `npm run works:build -- --media` ④ `npm test` ⑤ 공개 전환은 `visibility`+`rightsConfirmed` 두 값만 변경)와 필드 설명, 더미 예시 JSON 1개.

## 완료 기준
- [ ] `npm run typecheck` PASS, `npm run lint` 오류 0, 직렬 테스트 전부 PASS, `npm run build` PASS.
- [ ] `lib/content.ts` 컨텐츠 서비스가 정확히 6종이고 `editing` 문자열이 서비스 코드·문의 폼·테스트 어디에도 남아 있지 않다(리다이렉트 규칙·변경 이력 문서 제외).
- [ ] `/content/services/motion-graphics`가 로컬에서 200으로 렌더되고 사례로 4작품이 매칭된다(검토 플래그 켠 상태). `/content/services/editing`은 301 → `/content`.
- [ ] 홈·`/content`·소개 페이지의 서비스 나열 문구가 6종 기준으로 통일.
- [ ] `content/works/` JSON 18개, 모든 media 경로가 기존과 동일, `npm run works:build`가 재실행해도 `git diff` 없음(결정적 생성).
- [ ] 스키마를 일부러 어긴 임시 JSON에서 `works:build`가 실패하고, 확인 후 제거됨.
- [ ] 로컬 검토 플래그 켠/끈 두 빌드 모두 정상(끈 빌드에서는 18작품 비노출, 사이트맵에 review 작품 없음).
