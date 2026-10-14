# RESULT_R7_WP5 · SNS 광고 페이지 요프리 반영 (검토판 한정)

작성 2026-10-15 · 근거 BRIEF_R7 §4(r2)·§5 WP-5 · 빌드·서버 기동·커밋·push 없음 · 작품 JSON 수정 없음

## 변경 파일

| 파일 | 내용 |
|---|---|
| `lib/content-site/types.ts` | `CsWorkCard.placement`에 `"ad-signature"` 추가. 필드 3개 추가: `signatureLabels`(시그니처 3장면 이름), `railLead`(히어로 레일 앞칸 표시), `variantLabel`(안 수 표시). 고객 문자열 없음 |
| `lib/content-site/works.server.ts` | `sectionWork`에 `ad: { slug: yofree-mg30, placement: "ad-signature", labels: 톤 라벨 3개 }` 추가(검토 플래그 안). `adRailLead`(30초 3편 → 4안). `pickContentWorks(id, catalog)` 순수 함수를 분리해 export(테스트가 고정 데이터로 호출), `selectContentWorks`는 이를 호출. placement 작품은 상한 계산에서 빼고 앞에 둔다. 광고만 "영상 우선 → 9:16 영상이 많은 순 → order" 정렬. 9:16 영상이 둘 이상인 광고 작품(시그니처 제외)에 `variantLabel` = "N안" |
| `components/content-site/services/ad/landing.tsx` | 고객명·slug 문자열 0. Hero는 `placement === "ad-signature"` 작품을 기준으로 `reviewCards`가 `railLead` 작품의 9:16 포스터(7장)를 레일 앞에 두고 나머지 광고 포스터를 잇는다. Signature는 시그니처 작품의 9:16 3편 포스터를 `SceneSequence`(variant ad) 3장면에 한 편씩 두고 장면 이름은 서버 `signatureLabels`를 쓴다. 장면 아래에 "사례 자세히 보기 ↗" 링크. 공개판·조건 미충족은 기존 `WorkSequence` 연출 예시 경로 그대로 |
| `components/content-site/services/ad/ad-reel.tsx` | 같은 client 섬에 `AdWorkVariants` 추가(포스터 띠 최대 4칸, 누르면 위 영상이 그 안으로 바뀌고 재생. 처음에는 재생 안 함). props로만 데이터를 받는다. `AdRail`은 변경 없음 |
| `components/content-site/services/ad/ad.css` | 포스터 띠 스타일(`.cs-svc-ad-variants*`, 선택·포커스 표시, 44px 이상). 색은 `--cs-*` 토큰만 |
| `components/content-site/blocks/works.tsx` | `cardMedia()` 추가: `layout === "vertical"`일 때만 9:16 영상을 앞세우고, 서버가 `variantLabel`을 준 작품은 `AdWorkVariants`(포스터 띠)로 그린다. 다른 레이아웃은 `media[0]` 그대로 |
| `tests/content-site.test.mjs` | 6-1·6-2 교체, 6-3 신설(누수). 자식 프로세스 헬퍼 `runWorksChild`·`pickedWithVirtualAdWorks` 추가 |

새 client 파일은 만들지 않았다(공용 client 섬 6개 목록 단언과 서비스별 섬 1개 계약 유지). 사례 블록이 `services/ad/ad-reel.tsx`의 `AdWorkVariants`를 import한다.

## 인수 기준별 확인

| 기준 | 확인 |
|---|---|
| 검토판에서 새 섹션 0개 | 섹션 추가 없음. 히어로 레일·시그니처·사례 목록 세 자리만 바뀜 |
| 히어로 레일 앞 7칸이 9:16 포스터 | 테스트 6-2: `railLead` 작품이 `yofree-mg30`(9:16 포스터 3)과 `yofree-mg-short`(9:16 포스터 4), 순서 고정. 레일은 3열×(소재 9칸) 순으로 소재를 소비하므로 앞 7칸이 이 포스터. 화면 실측은 WP-V |
| 시그니처 3장면 = `yofree-mg30` S1·S2·S3(9:16) | `gallery-01~03`(S1 키네틱·S2 프리미엄·S3 모션코믹, REVIEW_ASSETS_v02.csv와 대조)의 포스터를 한 편씩. 장면 이름은 서버의 톤 라벨 3개 |
| 사례 목록 정확히 4건, `yofree-mg-short` 첫 자리, "4안" 표시와 포스터 띠, `yofree-mg30` 중복 없음 | 테스트 6-1: 목록 = `yofree-mg-short`, `bwl-aqua-ad`, `bwl-cplus-ad`, `bwl-cleanser-ad`. `variantLabel` "4안"은 이 작품 1건에만. `yofree-mg30`은 placement로 목록에서 빠짐(`service-landing.tsx` 필터 유지) |
| 가상 광고 2건을 더해도 요프리 2건이 빠지지 않음 | 테스트 6-1: 가상 2건(order가 앞) 추가 시 목록 5건에서 `yofree-mg-short`가 첫 자리, `yofree-mg30`은 시그니처로 유지 |
| 다른 서비스 카드 모양 그대로 | 포스터 띠·9:16 우선은 `vertical`에만. 같은 vertical인 animation·ai-influencer는 작품당 9:16 영상 1개가 `media[0]`이라 결과 동일(실행으로 확인). 정렬의 9:16 키는 `ad`에만. 모션그래픽 목록 구성도 동일(캐릭터 사례 작품이 배열 앞으로 이동했을 뿐 `find`로 쓰므로 영향 없음) |
| 공개판·공개 번들에 요프리·YoFree·yofree-·톤 라벨 3개 0건 | 테스트 6-3: (a) 톤 라벨은 `works.server.ts` 밖의 components·lib·app 전체(ts·tsx·css·json)에 0건, (b) 광고 landing·ad-reel·ad.css·works.tsx·types.ts에 CUSTOMER 정규식 0건, (c) 플래그 없음·"0"·"true"에서 직렬화 결과에 라벨·yofree·표시 필드 0건(검토판에는 있음을 대조). 기존 금지 문자열 테스트 4곳은 그대로 |
| 작품 JSON 미수정 | `content/works/*.json` 변경 0 |

## 테스트 결과

- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-site.test.mjs` → 27개 중 25 통과, 2 실패.
  - 6-1·6-2·6-3, 6(client 경계) 통과. 실패 2건은 WP-4 영역: `11-4`(가격 배지 단언: 알약 배지 삭제와 충돌), `11-8`(공통 CSS에 가운데 정렬 없음: 푸터 모바일 가운데 정렬과 충돌). WP-4가 같은 파일의 해당 단언을 새 기준으로 고쳐야 한다(내 소유 범위 밖이라 건드리지 않음).
  - 앞서 실행했을 때 7·8번도 WP-4 작업 중 파일(theme.css `.cs-mbar-text`, `process-steps.tsx` style=) 때문에 실패했으나, 마지막 실행에서는 통과.
- 영향 가능 테스트 추가 실행: `content-site-wps1/wps2/wpa/wpb`, `content-r5-fix1`, `content-scenes` → 34개 전부 통과(`content-r5-fix1`의 `<WorkSequence work={work} portrait service="ad" labels=` 단언을 지키려고 폴백 경로를 그 형태로 유지).
- 소유 6개 파일 타입 검사(TypeScript API, 프로젝트 tsconfig 옵션) 진단 0건.

## 남은 문제·메모

1. 시각 확인 없음(빌드·서버 금지). 레일 앞 7칸의 실제 배치, 시그니처 장면 포스터, 포스터 띠의 360~1440 폭 모양은 WP-V에서 확인해야 한다.
2. 시그니처는 영상 재생이 아니라 9:16 포스터 3장면이다(`SceneSequence`가 이미지 전용이고 `scene-sequence.tsx`·`work-sequence.tsx`는 WP-5 소유 밖). 영상은 장면 아래 링크(상세)와 `yofree-mg-short` 카드의 포스터 띠에서 재생된다. 시그니처에서 직접 재생을 원하면 `scene-sequence.tsx` 소유권 확장이 필요하다.
3. `lib/content-home.ts`에 `\n`이 실제 줄바꿈으로 들어간 구문 오류가 한때 있어(WP-4 작업 중) 테스트가 시작되지 않았고, 이후 고쳐졌다. 같은 증상이 내 `landing.tsx`에서도 한 번 생겨 고쳤다(제목 `\n` 이스케이프).
4. 권리: 영상 7개는 UNKNOWN/HOLD(영업 시안). 검토판 LAN 한정 유지, 공개 빌드에서는 위 누수 검사로 0건 보장.
5. 줄바꿈: 내 파일은 저장소 기준 LF로 유지(작업트리에 CRLF 파일이 섞여 있어 git이 경고만 낸다).
