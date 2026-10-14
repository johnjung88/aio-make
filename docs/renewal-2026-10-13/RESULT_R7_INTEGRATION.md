# RESULT_R7_INTEGRATION · 통합 정리

2026-10-15 · 빌드·서버·커밋·push 0.

## 1. 히어로 영상 연결
`lib/content-home.ts`의 `video:` 한 줄을 `{ src: "/content-home/hero-reel-r7.mp4", poster: "/content-home/hero-reel-r7.webp" }`로 교체(구조 `hero.video` 유지, 무음 muted 재생 로직은 hero-video.tsx 그대로). `tests/content-home.test.mjs` 10번을 "비어 있음"에서 "연결됨(파일 존재, 10MB 이하)"로 갱신.

## 2. 죽은 코드 삭제 (grep으로 tsx/ts/css/app 전체 미사용 확인 후)
- `components/home/journey-tabs.tsx` 삭제(어디서도 import 없음).
- `lib/home-journey.ts`의 `contentCopy` 삭제.
- `workflow-journey.css`: 탭(.wj-tabs/.wj-tab/.wj-tabpanel), 스테이지(.wj-stage*·.wj-shape-*·.wj-cover·.wj-video·.wj-side*·.wj-stage-nav·.wj-step-button·.wj-content*·.wj-media-meta), 그리고 같은 방식으로 미사용이던 .wj-link, .wj-panel*, .wj-defs/.wj-def, .wj-tiles/.wj-tile*/.wj-swatch*/.wj-type-sample 및 1024/768/모션감소 미디어쿼리 안의 해당 규칙, 변수 --wj-stage, --wj-stage-h, --wj-s0 삭제. `.wj-media`(진입 애니메이션)·`.wj-tag`·`.wj-num` 등 쓰이는 것은 유지.
- `tests/new-tab-links.test.mjs`: `.wj-link` gap 단언을 "`.wj-link` 없음"으로 교체.

## 3. 반복 문자열 점검
공개 소스(app·components·lib·public)에서 요프리·YoFree·yofree-·힐러넷·DR's Secret·bwl-/healernet- 슬러그는 모두 검토 플래그(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"`) 분기, `works.server.ts`/`work-sequence.tsx`(server-only), 생성 카탈로그(`lib/generated/works.generated.ts`, 검토 작품 데이터) 안에만 있다. 클라이언트 파일 중 플래그 밖 노출 0건. 'AI 가상 예시'는 소스 0건(테스트의 부재 단언과 BRIEF 문서에만 있음).
참고: `components/content-site/services/{brand-film,motion-graphics}/landing.tsx`에 `bwl-*` slug 비교가 있으나 작업물이 있을 때(검토판)만 매칭되는 기존 코드다.

## 4. WP-2 상표 고지
- 마케팅 `.wj-mk-notice`: `text-wrap: balance`·`overflow-wrap: normal`, 429px 이하에서 `max-inline-size: 22em`으로 두 줄 이하 균형 줄바꿈(글자 크기 12px 유지, 테스트가 고정).
- 컨텐츠 단계: `journey-content.tsx` 카드 하단(점 아래)에 `PLATFORM_TRADEMARK_NOTICE` 한 줄(`.wjc-notice t-small`, 가운데 정렬, balance). 글자 크기는 `home-journey` CSS 토큰 테스트 때문에 역할 클래스 `t-small`을 썼다.
- 실제 360~430px 줄 수는 브라우저로 보지 않았다(WP-V 확인 항목).

## 5. 검증
- `npx tsc --noEmit` 통과.
- `npx eslint`(변경·신규 ts/tsx 전부) 오류 0.
- 직렬 전체 테스트 `tests/*.test.mjs`: 187 tests, 186 pass, 0 fail, 1 skipped. 제외: `tests/seo-http.mjs`, `http-*.mjs`(서버 필요).
- 첫 실행 실패 2건(히어로 슬롯 "비어 있음" 단언, journey CSS 토큰 단언)을 위 수정으로 해결했다.

## 6. git status
수정·신규 파일은 R7 범위 안이다(삭제 1: journey-tabs.tsx). 커밋 전 유의할 큰 파일(.gitignore 대상 아님): `public/content-home/hero-reel-r7.mp4` 9.4MB(의도한 공개 자산), `docs/.../license-evidence-r7/` 7.0MB(`logos/instagram_official_original.png` 2MB 초과), `docs/.../hero-reel-r7/frames/` 5.6MB(재생성 가능, 제외 가능). `.qa/`는 무시 대상.
