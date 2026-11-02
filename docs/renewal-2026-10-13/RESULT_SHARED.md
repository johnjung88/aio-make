# RESULT_SHARED — 컨텐츠 서브사이트 공용 후속 변경 (WP-A~D·WP0FIX '공용 변경 요청' 통합)

2026-10-14 · 구현: Opus 서브에이전트(공용 담당) · 기준 HEAD `88d33df` · 커밋·push·배포·설치 안 함 · `next build`·dev·브라우저 NOT_RUN(지시)

## 변경 요약 (요청 번호순)

### 1. CSS 테스트의 @keyframes 오탐 → 테스트 수정, 분리 파일 합침, WP-C 레일 CSS 전환
- `tests/content-site.test.mjs` 7번 파서(`cssRules`): `@keyframes`/`@-webkit-keyframes` 안의 단계(from·to·N%)는 규칙으로 내지 않는다(@media 안·밖 모두). 새 `cssKeyframes()`로 이름을 따로 읽어 **서비스 CSS는 `cs-svc-<id>-`, theme·홈 CSS는 `cs-`로 시작**하는지 검사.
- 같은 테스트에 추가: 파서 자체 점검 샘플, `*.keyframes.css` 파일 0개, 서비스 CSS의 축약형 `animation:` 0, `animation-*`·`transition*` 선언은 `@media (prefers-reduced-motion: no-preference)` 안에서만.
- 합침: `animation.keyframes.css` → `animation.css`, `motion-graphics.keyframes.css` → `motion-graphics.css`(각 파일 '움직임' 절, no-preference 블록 바로 앞, 최상위). 두 분리 파일 삭제, `landing.tsx`의 import 2줄 삭제. 키프레임 내용은 한 글자도 바꾸지 않았다.
- `content-site-wpa.test.mjs` A-7, `content-site-wpb.test.mjs` B-4·B-5: 분리 파일 대신 서비스 CSS에서 키프레임을 읽고 분리 파일·import가 없음을 확인하도록 경로만 바꿨다(B-4는 '키프레임 단계에 transform만' 검사로 기존 '분리 파일엔 키프레임만' 검사를 대체).
- **WP-C 레일: Web Animations API → CSS 키프레임으로 전환(더 단순함 확인).** `ad/collage-motion.tsx`(client 섬, 80줄) 삭제, `ad/landing.tsx`는 같은 자리에 `<div className="cs-svc-ad-viewport" role="img" aria-label={collage.label}>`. `ad.css` 끝에 `@keyframes cs-svc-ad-rail`(translate3d 0,-4% → 0,4%, WAAPI와 같은 값) + no-preference 블록 안 롱핸드(12초, ease-in-out, infinite, alternate, 가운데 열 `alternate-reverse` = 기존 index 1).
  - reduced-motion: 선언이 no-preference 안에만 있고 theme.css의 reduce 규칙도 `animation: none` → 레일 정지(이동 0, 기존과 같음).
  - 움직임 토글: 축약형을 쓰지 않으므로 theme.css `[data-motion="paused"] * { animation-play-state: paused }`가 그대로 멈춘다(WCAG 2.2.2). 다른 서비스와 같은 방식.
  - SNS 광고 페이지의 고유 client 섬은 0개가 됐다(테스트 8의 '1개 이하' 충족).

### 2. 사례 상한: 서비스별
- `lib/content-site/works.server.ts`: `MAX_WORKS = 4`(기본) 유지 + `MAX_WORKS_BY_SERVICE = { ad: 6 }`, `maxContentWorks(id)` export, `.slice(0, maxContentWorks(id))`. 다른 서비스는 4 그대로.
- 테스트에서 실제로 불러 보려고 import를 `"../db"` → `"../db.ts"`로 바꿨다(다른 lib 파일과 같은 확장자 표기, `allowImportingTsExtensions` 사용 중).
- 검토 플래그 `1`에서 실측: ad 6편 = `bwl-brand-ad`, `bwl-aqua-ad`·`bwl-cplus-ad`·`bwl-cleanser-ad`(87언니 라벨), `yofree-mg-short`, `yofree-mg30` → 명세 6-4 매핑 전체. webtoon 4 · animation 2 · ai-influencer 3 · motion-graphics 4 · brand-film 3(변화 없음). 미설정·`0`·`true`는 모두 0편.
- 새 테스트 `6-1`(자식 프로세스로 플래그별 실행, DB 환경변수 제거)이 위 값을 고정한다.

### 3. 조작 막대 영상의 태그 위치 (공용 `CsMedia`)
- `ui/media.tsx`: `controls`(명시 또는 자동재생 아님)인 영상에 태그가 있으면 태그를 **박스 밖 바로 아래**에 둔다(`div.cs-media-stack` = 박스 + 태그). 이미지·자동재생 영상(조작 막대 없음)은 기존처럼 박스 안 왼쪽 아래.
- 결정 근거: WP-A 제안(왼쪽 위 12px)은 데스크톱 아래 막대는 피하지만 iOS·iPadOS Safari 인라인 조작(위 모서리 버튼)과 겹칠 수 있어 '절대 가리지 않음'을 보장하지 못한다. 박스 밖이면 어떤 브라우저 조작과도 겹치지 않는다.
- `theme.css`: `.cs-site .cs-media-stack`(세로 flex, 간격 `--cs-s2`), `> .cs-tag { align-self: flex-start }`. 적용 대상은 지금 `CsWorks` 영상 카드(검토 빌드)와 웹툰 모션코믹 영상 2곳.
- `webtoon.css`의 임시 규칙(`.cs-svc-webtoon-video-media > .cs-tag { top: 12px }`)은 더 이상 맞는 요소가 없어 삭제.

### 4. 자막 트랙 옵션
- `CsMedia` 영상 prop `captions?: { src; label; srcLang?; default? }` → `<track kind="captions" srcLang={srcLang ?? "ko"} …>`. 쓰는 곳은 아직 없다(요청대로 자막 파일 미추가).

### 5. paper 서비스별 `--cs-bg-2`
| 서비스 | `--cs-bg` | 새 `--cs-bg-2` | bg/bg-2 | bg-2 위 fg / fg-2 / fg-3 / accent-text |
|---|---|---|---|---|
| 웹툰 | #F1ECF6 | **#E9E1F1** (WP-A 제안값) | 1.09 | 13.69 / 7.36 / 5.11 / 5.74 |
| 애니메이션 | #F5EBDD | **#EFE2CF** (WP-A 제안값) | 1.08 | 13.65 / 7.33 / 5.10 / 5.31 |
| AI 인플루언서 | #EFEAE6 | **#E7E0DA** | 1.09 | 13.33 / 7.17 / 4.98 / 5.26 |
- 모두 WCAG AA(4.5:1) 이상(WCAG 상대 휘도 공식으로 계산, 브라우저 실측 아님). 이전 AI 인플루언서는 공용 bg-2(#EEE8E0)가 bg(#EFEAE6)와 거의 같아(약 1.0) 섹션 구분이 안 됐다.
- 새 테스트 `10-1`: 세 서비스가 자기 bg-2를 갖고, bg와 다르며, fg·fg-2·fg-3·accent-text가 bg·bg-2 위에서 4.5:1 이상인지 계산한다.

### 6. `CsInquiry` chooser 모드 삭제 + 미선택 문구 prop
- `blocks/inquiry.tsx`: `chooser` prop·라디오 fieldset·관련 state/import(`startingPrice`, `CONTENT_SERVICES`) 삭제. 서비스 변경 시 희망 구성 초기화는 유지. (문의 페이지는 이미 `contact-flow.tsx`가 폼 밖 선택을 직접 그린다 — 변경 없음.)
- 두 겹으로 막았다: `InquiryBridge`에 선택 prop `unselectedMessage?`를 추가(기본값 = 기존 문장 → '아직 모르겠어요' 선택지가 있는 메인·개발 폼은 그대로). `CsInquiry`는 항상 `CS_COPY.inquiry.serviceMissing`(`요청 서비스를 하나 골라주세요`, 문의 페이지 안내와 같은 문장)을 넘긴다. 컨텐츠 사이트 어디서든 잘못된 문장은 나올 수 없다.
- `lib/content-site/copy.ts`: 안 쓰게 된 `serviceLegend` 삭제, `serviceMissing` 추가.
- 새 테스트 `8-2`: chooser·radio 0, prop 전달, 컨텐츠 사이트·홈·lib 전체 '모르겠' 0, 공용 문장은 InquiryBridge 기본값 1곳뿐.

### 7. 누수 grep 목록에서 `87언니` 제외
- `BRIEF_P2R.md` 9절 체크리스트 목록에서 `87언니` 삭제(갱신 사유 괄호 주석 포함). 고객 문자열(`reference-review|BWL|DR's Secret|DR&#x27;s Secret|닥터시크릿|힐러넷|HEALERNET|YoFree|요프리|bwl-|yofree-|healernet-`)은 그대로.
- `tests/seo-http.mjs` `/content` 홈 HTML 검사에서 `87언니` 삭제, 대신 검토 빌드 전용 라벨 조각 `제안용 시안`을 추가(라벨 게이트는 계속 감시).
- `tests/content-site.test.mjs`의 `CUSTOMER`에는 원래 `87언니`가 없다(변경 없음).
- **바꾸지 않은 곳**: `tests/home-journey.test.mjs`의 목록(77·189행)은 메인 홈 여정 데이터(P4)의 검토 게이트용이다. 그 데이터에서 `87언니`는 검토 전용 라벨 `87언니(AI 가상인물) 출연 · 제안용 시안`으로만 나오므로 빼면 게이트 감시가 약해진다. 컨텐츠 사이트 누수 목록이 아니라 그대로 뒀다. 함께 빼야 한다면 조율자 결정 필요.

## 변경 파일
`components/content-site/{theme.css, ui/media.tsx, blocks/inquiry.tsx}` · `components/content-site/services/ad/{ad.css, landing.tsx}` · `services/ad/collage-motion.tsx`(삭제) · `services/animation/{animation.css, landing.tsx}` · `services/animation/animation.keyframes.css`(삭제) · `services/motion-graphics/{motion-graphics.css, landing.tsx}` · `services/motion-graphics/motion-graphics.keyframes.css`(삭제) · `services/webtoon/webtoon.css` · `components/guide/inquiry-bridge.tsx` · `lib/content-site/{works.server.ts, copy.ts}` · `tests/{content-site, content-site-wpa, content-site-wpb}.test.mjs` · `tests/seo-http.mjs` · `docs/renewal-2026-10-13/{BRIEF_P2R.md, RESULT_SHARED.md}`.
`docs/renewal-2026-10-13/HANDOFF_RESUME.md`는 작업 중 다른 쪽에서 수정된 것으로 이 작업 소관이 아니다(건드리지 않음).

## 검증 (작업트리, 최종 상태)
- `npm run typecheck` → PASS (exit 0)
- `npm run lint` → 0 errors, 1 warning(기존 `tests/local-admin.test.mjs:110 'options'`)
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` → tests 99 · pass 98 · fail 0 · skipped 1(기존 로컬 미디어 skip) · todo 0
- 대비값: WCAG 상대 휘도 계산(스크립트·테스트 10-1). 브라우저 실측 아님.

## NOT_RUN (지시로 실행 안 함 → V 몫)
`npm run build`(두 빌드), `tests/seo-http.mjs` 등 HTTP 스크립트, 브라우저 전부:
1. SNS 광고 히어로 레일: 1440·768·390에서 흐름(가운데 열 반대 방향), 움직임 토글로 정지·재개, reduced-motion에서 정지, 첫 페인트에 레일 튐 없음. `/content/services/ad` client 청크에서 `collage-motion` 사라짐.
2. 검토 빌드 SNS 광고 사례 6장: 1440(4열 → 4+2), 768(2열), 390(1열) 넘침 0. 87언니 라벨 3장 표시.
3. 조작 막대 영상(웹툰 모션코믹, 검토 빌드 사례 카드): 태그가 영상 바로 아래 왼쪽, 조작 막대·전체화면 버튼과 겹침 0, 카드 높이 변화로 인한 정렬 이상 없음. iOS Safari 인라인 재생 확인 권장.
4. paper 3종(웹툰·애니메이션·AI 인플루언서): 가격·FAQ·관련 서비스 섹션 바탕이 같은 색조로 보이는지, 대비 실측.
5. 애니메이션 후광·모션그래픽 루프: 파일 합침 후에도 동작·토글·reduced-motion 그대로(키프레임 내용은 무변경).
6. 기본 빌드 누수 grep(BRIEF_P2R 9절 갱신 목록): AI 인플루언서 페이지의 `87언니`는 허용, 고객 문자열과 `제안용 시안`은 0.

## 남은 일·제안
- 6편 사례의 1440 배치(4+2)가 어색하면 `CsWorks`에 개수 기반 열 수(예: 6이면 3열) 규칙을 둘 수 있다(이번 범위 밖).
- WP-B 선택 요청 3·4·5(자체 IP 태그, 토글 시 정지 구도 공용화, `wide` 레이아웃 9:16 공용화), WP-C 선택 3, WP-D 7-3(`CsPrice show?`)은 이번 7개 항목에 없어 손대지 않았다.
