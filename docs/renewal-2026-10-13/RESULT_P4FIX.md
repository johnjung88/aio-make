# RESULT_P4FIX: VERIFY_P34의 P4·FIX 항목과 컨텐츠 새 탭 요청

2026-10-14 · 구현 담당 Claude · 기준 HEAD `7711303` · 커밋, 푸시, 배포, 설치 없음

범위: VERIFY_P34의 P4-1, P4-2, P4-3, FIX-1과 사용자 신규 요청(메인 사이트에서 컨텐츠로 가는 링크는 새 탭에서 열기). 다른 구현 담당의 컨텐츠 서브 사이트 파일(`app/(content-site)/**`, `components/content-site/**`, `lib/content-site*.ts`, `public/content-site/`)은 건드리지 않았다.

## 변경 파일

| 파일 | 내용 |
|---|---|
| `components/home/workflow-journey.css` | P4-1: 토큰 `--wj-s0: 4px` 추가, `.wj-link`에 `gap: var(--wj-s0)` 적용. `/content` `.ch-link`와 같은 4px다. 워크플로우의 화살표 링크(단계 링크 줄, 03 `작업 자세히 보기 ↗`·`서비스 자세히 보기 →`, 04 링크, 05 갈래 `화면 수정 → 개발 단계`)가 모두 `.wj-link`라 한 번에 적용된다. `.wj-step-button`(이전/다음)에는 원래 `gap`이 있다. P4-2 설명 주석 추가 |
| `components/guide/main.jsx` | P4-2: `#divisions` 카드 3개의 본문 그리드 행을 `auto 1fr auto auto auto auto`에서 `auto auto auto auto 1fr auto`로 바꾸고 빈 spacer span을 CTA 바로 위로 옮겼다. 머리줄, kicker, 제목, 서비스 목록이 위에서부터 쌓이므로 목록이 2줄이어도 세 카드의 제목 y가 같다. 남는 높이는 spacer가 받아 CTA만 카드 아래쪽에 정렬된다. 모바일 세로 배치에서는 spacer 높이가 0이라 기존처럼 자연스럽게 쌓인다. P4-3: 사용하지 않는 `workGroups`(`Studio 작업 사례.dc.html` 포함)와 구조분해를 삭제했다. 신규 요청: 컨텐츠 카드 `GuideLink href="/content"`에 `{...newTabProps}`와 `<NewTabHint />`를 넣었다 |
| `components/guide/primitives.tsx` | P4-3: `adaptGuideValues`의 `page === "main"` `workGroups` 가공 분기(죽은 코드, `작업 사례` 문구 포함)를 삭제했다. `GuideMedia` 캡션 `콘셉트 이미지 · 실제 컨텐츠는 등록 후 공개` span을 삭제했다. `GuideMedia`를 쓰는 곳은 라우트에 연결되지 않은 `studio-home.jsx`뿐이다 |
| `components/guide/guide.css` | P4-3: 사용처가 0이 된 `.guide-media-caption` 규칙 2개 삭제 |
| `lib/home-references-data.ts` (신규) | FIX-1: `server-only`. `homeReferenceWorks(entries, division)`가 서버에서 `displayWorkCatalog(mergeGuideEntries(...))`로 고르고, 분야가 정해져 있으면 그 분야 첫 4개만 반환한다(기존 클라이언트 로직과 같은 결과) |
| `components/guide/home-references.tsx` | FIX-1: `entries` 대신 `works: WorkItem[]` props를 받는다. `displayWorkCatalog`, `mergeGuideEntries`, `work-portfolio` import 제거. 카탈로그 모듈은 `import type`만 남았다. 필터·개수 제한·문구는 그대로다 |
| `components/work-card.tsx` (신규) | FIX-1: `WorkCard`를 `work-portfolio.tsx`에서 옮겼다. `work-portfolio.tsx`는 `workMatchesService`를 값으로 import하므로 클라이언트 `HomeReferences`가 그 파일을 import하면 카탈로그 모듈(`works.generated.ts`)이 클라이언트 번들에 들어갈 수 있었다. 새 파일은 `lib/content`의 `services`와 `WorkItem` 타입만 쓴다. 마크업은 한 글자도 바꾸지 않았다 |
| `components/work-portfolio.tsx` | `WorkCard`를 `./work-card`에서 가져와 다시 export한다. 기존 import 경로(`app/(public)/[division]/services/[service]/page.tsx`)는 그대로 동작한다 |
| `components/guide/service-overview.tsx` | FIX-1: 서버 컴포넌트에서 `works={homeReferenceWorks(entries, division)}`로 넘긴다. `/marketing`·`/lab` 화면 결과는 같다 |
| `components/guide/studio-home.jsx` | 라우트 미연결 파일. 바뀐 props 이름에 맞춰 `works={this.props.referenceWorks}`로 한 줄 수정(렌더 경로 없음) |
| `lib/new-tab.ts` (신규) | 신규 요청: `newTabProps = { target: "_blank", rel: "noopener noreferrer" }`, `NEW_TAB_HINT = "새 탭에서 열림"`, `isContentHref`(`/content`, `/content/…`, `?`, `#`), `contentLinkProps(href, currentPath)`. 현재 경로가 `/content` 안이면 빈 객체를 돌려줘 컨텐츠 영역 안의 링크는 같은 탭을 유지한다 |
| `components/new-tab-hint.tsx`, `components/new-tab-hint.css` (신규) | 화면에 보이지 않는 `(새 탭에서 열림)` span. 링크 안 span 규칙에 덮이지 않게 sr-only 속성에 `!important`를 줬다. absolute 배치라 inline-flex `gap`이나 카드 그리드 행에 영향이 없다 |
| `components/site-shell.tsx` | 신규 요청: 헤더 `컨텐츠`와 푸터 `컨텐츠` 링크에 `contentLinkProps(href, path)`를 적용하고 새 탭일 때만 `<NewTabHint />`를 붙였다. 푸터도 `usePathname`을 쓴다(파일 전체가 이미 `"use client"`). 마케팅·개발·회사소개·정책 링크와 헤더 문의 버튼은 그대로다 |
| `components/home/workflow-journey.tsx` | 신규 요청: `JourneyAnchor`가 `contentLinkProps(href)`를 적용한다. 04 단계 링크 `컨텐츠 서비스 전체 보기`(`/content`)가 새 탭이 되고, 마케팅·개발 단계 링크와 `#` 앵커는 그대로다. Prettier가 같은 파일의 기존 한 줄(`journey-content` 항목)을 한 줄로 합쳤다 |
| `components/home/journey-content.tsx` | 신규 요청: 04 탭의 `서비스 자세히 보기 →`(`/content/services/<id>`)에 `newTabProps`와 힌트 추가. `작업 자세히 보기 ↗`는 `/work/<slug>`라 대상이 아니다 |
| `tests/new-tab-links.test.mjs` (신규) | 6개 테스트. `contentLinkProps` 동작(메인 경로에서 `/content`와 `/content/services/*`는 새 탭, `/content` 안에서는 같은 탭, `/marketing`·`/lab`은 변경 없음), 헤더·푸터·메인 카드·04 링크·`JourneyAnchor`의 `target`/`rel`/힌트, 마케팅·개발 카드에는 없음, `.wj-link` gap, `#divisions` 행 정의 3개, `workGroups`·옛 캡션 0건, `HomeReferences` 값 import 0건, `homeReferenceWorks` 결과가 기존 선택(분야 필터 + 4개)과 같은지 |

## 새 탭 적용 범위 확인

- 메인 사이트 소스에서 `/content`로 가는 링크를 전부 찾았다(`grep "/content"`, `GuideLink` href와 `guideHref` 매핑 확인). 대상은 헤더 `컨텐츠`, 푸터 `컨텐츠`, 메인 `#divisions` 컨텐츠 카드, 04 단계 링크 `컨텐츠 서비스 전체 보기`, 04 탭 `서비스 자세히 보기` 5곳이고 모두 적용했다.
- `/about`(`about.jsx`)과 `/about/team`(`team.jsx`)에는 컨텐츠로 가는 링크가 없다(`/#contact`, `/about/team`만 있다). 변경 없음.
- 헤더·푸터는 `/content` 경로 안에서 렌더될 때 같은 탭을 유지한다. 컨텐츠 영역 안의 링크(`components/content-home/**`, `components/content-service/**`, 서브 내비)는 건드리지 않았다.
- `#divisions` 카드는 링크 하나다. 안의 `컨텐츠 상담하기 →`는 별도 링크가 아니라 카드 텍스트라 카드 링크의 새 탭 속성을 따른다.

## 검증

| 명령 | 결과 |
|---|---|
| `npm run typecheck` | PASS (exit 0) |
| `npm run lint` | PASS, 오류 0, 경고 1(`tests/local-admin.test.mjs:110`, 기존 허용) |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | PASS, 60개 중 pass 59 · fail 0 · skipped 1(`AIO_VERIFY_LOCAL_MEDIA` 게이트, 기존) |
| `prettier --check` (변경 파일) | PASS(두 파일은 `--write` 후) |
| `npm run build`, 브라우저 측정(1440/1024/768/390/360 제목 y, 화살표 간격, 새 탭 동작, 빌드 A 누수 검색) | NOT_RUN (지시: 메모리 부족, 검증자가 실행) |

## 검증자 확인 요청

1. `#divisions` 1440·1024·768에서 같은 행의 카드 제목(`Studio`, `Marketing`, `Lab`) top이 같고, 서비스 목록 시작 y도 같은지. 390·360 세로 배치에 빈 공간이 생기지 않는지.
2. 워크플로우 링크 `상담 신청하기 →`, `작업 자세히 보기 ↗`, `웹사이트 제작 →`, `화면 수정 → 개발 단계`의 글자와 화살표 사이 4px.
3. 메인 `/`, `/about`, `/marketing`, `/lab`에서 헤더 `컨텐츠`, 푸터 `컨텐츠`가 `target="_blank" rel="noopener noreferrer"`이고 접근 가능한 이름 끝에 `(새 탭에서 열림)`이 붙는지. `/content`와 `/content/services/*`에서는 두 링크에 `target`이 없는지. 메인 `#divisions` 컨텐츠 카드, 04 단계 링크, 04 탭 `서비스 자세히 보기`도 새 탭인지. 마케팅·개발 카드와 링크는 같은 탭인지. 힌트 span이 화면에 보이지 않고 가로 넘침이 없는지.
4. 빌드 A(플래그 미설정)에서 `/marketing`·`/lab` HTML과 `.next/static`의 고객 문자열 0건 유지. 클라이언트 청크에 `works.generated` 데이터가 없는지(이번 변경으로 `HomeReferences` 경로의 값 import가 끊겼다).

## 미해결·참고

- 헤더·푸터가 `/content` 안에서 같은 탭을 쓰는 판단은 현재 `(public)` 레이아웃이 컨텐츠 경로에도 같은 헤더를 그리기 때문이다. 다른 구현 담당이 컨텐츠 서브 사이트에 별도 헤더를 두면 이 분기는 메인 사이트에서만 쓰이고, 동작은 같다.
- `components/guide/primitives.tsx`의 `assetSlots`에 `main-studio-big` 등 옛 키가 남아 있다. 값만 있는 매핑이라 화면 영향이 없어 이번 범위에서는 그대로 뒀다.
- `docs/renewal-2026-10-13/HANDOFF_RESUME.md`의 미커밋 변경과 `public/content-site/`는 이번 작업이 만든 것이 아니다.
