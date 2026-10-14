# RESULT_R6_INTEGRATE · R6 통합 정리 결과

작성 2026-10-15 · 기준 HEAD `93807c9`(R6 구현) · 근거 `BRIEF_R6.md`, `RESULT_R6_WP0/WPH/WPM/WPA/WPB/WPC.md`. 커밋·푸시·빌드·서버 실행 없음, 포트 3213·3214·3215 미접촉. `blocks/hero.tsx`·`blocks/types.tsx` 삭제는 `git rm`으로 인덱스에 올라가 있다(커밋은 하지 않음).

## 1. 변경 파일

### 죽은 코드·규칙 정리 (공통 요청 1-a)
| 구분 | 파일 | 내용 |
|---|---|---|
| 삭제 | `components/content-site/blocks/hero.tsx` | `CsHero`·`CsHeroCopy`·`HERO_TITLE_ID`. 사용처 0(서비스 히어로는 `ServiceHero`가 담당) |
| 삭제 | `components/content-site/blocks/types.tsx` | `CsTypes`. 사용처 0 |
| 타입 | `lib/content-site/types.ts` | `ServiceLandingData.types` 필드와 값이 없던 `hero.note?` 삭제 |
| 데이터 | `lib/content-site/services/{ad,ai-influencer,animation,brand-film,motion-graphics,webtoon}.ts` | 각 `types` 블록 18줄 삭제(화면에 쓰이지 않던 데이터) |
| CSS | `components/content-site/theme.css` | `.cs-hero-grid`·`.cs-hero-media`·`.cs-hero-copy`(+ 하위 규칙), `.cs-types-grid`·`.cs-type-card` 삭제. `.cs-hero`·`.cs-hero-actions`·`.cs-price`는 `ServiceHero`가 써서 유지 |
| CSS | `services/service-motion.css` | 웹툰 부채(`.cs-webtoon-fan*`, `[data-motion-variant="webtoon"]` 떠오름·벌어짐 5줄, `cs-float` 키프레임) 삭제 |
| CSS | `services/webtoon/webtoon.css` | 표지 보호용 `animation-name: none` 블록 삭제(부채가 없어져 불필요) |
| CSS | `services/service-editorial.css` | `.cs-service-sequence*`, `.cs-service-plan-compare`, `.cs-svc-webtoon-cover*`, AI 피드 `figure[data-feed-index]` 17줄 삭제 |
| 런타임 | `services/motion-runtime.tsx` | 미사용 `useAutoCycle` 삭제, `useCallback` import 정리 |
| 주석 | `components/content-site/module.ts` | 섹션 순서·히어로 계약 주석을 실제 구성(`Hero → Signature → BeforePricing → pricing → process → works → faq → inquiry → related`, `ServiceHero`)으로 수정 |
| 유지 | `ServiceHero`의 `FeaturedWork`·`ExampleFigure`·`ProductionNotes` | 세 export 모두 실사용(brand-film, motion-graphics, animation). 삭제 대상 없음 |

### 슬롯·스크립트·사례 중복 (공통 요청 1-b, 1-c, 1-d)
| 파일 | 내용 |
|---|---|
| `lib/content-site/example-media.ts` | `motion-bg-1`(요청 b) 삭제. 같은 사유로 `webtoon-key-1`도 삭제(웹툰 표지가 컷 1을 쓰므로 사용처 0). 홈 히어로 슬롯은 `example-media`에 원래 없고 `contentHomeHero.reelSlot`(DOM 식별자)만 남아 있어 그대로 둠 |
| `scripts/verify-reference-pages.mjs` | `bwl-brand-ad`를 광고 묶음에서 빼 브랜드 홍보 영상(brand-film) 소속 위치로 옮김(주석 1줄) |
| `lib/content-site/types.ts` | `CsWorkCard.placement?: "character-case"` 추가 |
| `lib/content-site/works.server.ts` | 검토판 모션그래픽에서 `yofree-mg30`에 `placement: "character-case"` 표시(검토 플래그 안에서만 slug 존재, 기존 `aiPersonDraft`와 같은 방식) |
| `components/content-site/service-landing.tsx` | `CsWorks`에는 `placement`가 없는 작품만 넘김 |
| `services/motion-graphics/character-case.tsx` | 고객 slug 상수(`REVIEW_CASE`) 제거, `placement === "character-case"`로 찾음. 서버 컴포넌트에서 고객 slug가 사라짐 |

### 카피 점검 (4번)
| 파일 | 내용 |
|---|---|
| `lib/content-site/services/brand-film.ts` | FAQ 첫 문항의 "두 구성 모두 부가세 별도입니다" 삭제(부가세는 히어로 가격 줄과 가격 주석에 이미 있음) → "30초는 25만 원, 60초는 45만 원입니다" |

### 문서
| 파일 | 내용 |
|---|---|
| `docs/renewal-2026-10-13/ASSET_REQUEST_R6.md` | 신규 |
| `docs/renewal-2026-10-13/ASSET_REQUEST_R5.md` | 맨 위에 R6 기준 안내 인용 1블록만 추가. 기존 취소 표시(`home-hero-reel`·`MASTER-HERO`·`ad-center-1`)는 WP-C/WP-H 동시 수정 뒤에도 모두 남아 있어 복원할 것이 없었음(`R6에서` 표시 29곳 확인) |

### 테스트 (새 계약 반영, 약화 없음)
| 파일 | 내용 |
|---|---|
| `tests/content-site.test.mjs` | `.cs-type-card` 박스 규칙 항목 삭제(규칙이 없어짐). 11-3: 삭제된 `blocks/hero.tsx`·`blocks/types.tsx`가 없음을 확인으로 변경. 6-1 보조 함수가 `placed` 목록도 반환. **신규 6-2**(모션그래픽 `placed == ["yofree-mg30"]`, 다른 서비스 0, 광고 페이지는 같은 작품을 계속 목록에 보임, 공개판은 빈 목록, `CsWorks` 호출에서 `placement` 걸러짐). FAQ에 부가세 문구가 없다는 검사 추가 |
| `tests/content-site-wps1.test.mjs` | `useAutoCycle` export 기대 삭제. 사라진 슬롯(`motion-bg-1`·`ad-center-1`·`webtoon-key-1`·`home-hero-reel(-mobile)`)이 데이터에 없다는 검사 추가, 슬롯 존재 목록의 `motion-bg-1`은 `motion-hero-1`로 교체 |
| `tests/content-site-wpa.test.mjs` | A-8: `types.title` 읽기 삭제. 표지 보호 규칙 기대를 "부채·`animation-name: none`·`cs-float`·죽은 편집 규칙이 없다"로 교체. `webtoon-key-1` 슬롯이 없다는 검사 |
| `tests/content-site-wpb.test.mjs` | `character-case.tsx`에 고객 slug·`REVIEW_CASE`가 없고 `placement` 선택을 쓰는지 검사. 고객 slug 금지 검사 대상에 `character-case.tsx`와 `service-landing.tsx` 추가 |

## 2. 전체 테스트 결과

직렬 실행(메모리 고려, 병렬 없음).

| 항목 | 결과 |
|---|---|
| `npx tsc --noEmit` | PASS (오류 0) |
| `npx eslint components/content-site components/content-home lib/content-site lib/content-home.ts` | 오류 0, 경고 0 |
| `npx eslint scripts/verify-reference-pages.mjs` | 경고 1(`pathToFileURL` 미사용, 이번 변경 이전부터 있던 것) |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | **141개 중 140 PASS · 0 FAIL · 1 skip**. skip은 의도한 것(검토 파생본 `prepared derivatives exist when local review is requested`, 로컬 미디어가 릴리스 체크아웃에 없음) |

작업 도중 처음 실행한 전체 직렬 실행에서도 같은 140 PASS였고, 카피 수정 뒤 두 번째 실행에서 같은 숫자를 확인했다. 남은 실패는 없다.

NOT_RUN: `next build`, 서버 실행, 390·767·1440px 스크린샷, 서버가 필요한 `seo-http.mjs`·`inquiry-direct`·`local-admin`. 이 항목들은 다음 단계 검증 에이전트가 맡는다. `seo-http.mjs:368`은 문의 페이지에서 마침표 포함 문장을 기대하는 기존 불일치(RESULT_R6_WP0 5절 기록)로 이번 변경과 무관하다.

## 3. 공통 요청 처리 대응표

| 요청 | 처리 |
|---|---|
| WP-A 요청 1(`content-home` 시작가 단언) | WP-H가 `tests/content-home.test.mjs`를 재작성해 이미 반영됨. 전체 실행에서 PASS |
| WP-A 요청 2(웹툰 부채·편집 CSS 죽은 규칙) | 삭제 완료(1절) |
| WP-A·WP-C 요청 3(`types` 필수 필드) | 필드와 6개 데이터 모두 삭제 완료 |
| WP-B 요청 1(`CsWorks` 중복) | `placement` 규칙 추가(1절) |
| WP-B 요청 2(`useAutoCycle`) | 삭제 |
| WP-B 요청 3(`motion-bg-1`) | 슬롯 삭제, 요청서는 R6에 반영 |
| WP-B 요청 4(AI 피드 죽은 규칙) | 삭제 |
| WP-C 요청 2(`ProductionNotes` export) | brand-film이 사용하므로 유지 |
| WP-C 요청 3(요청서 합계) | `ASSET_REQUEST_R6.md`에서 재계산(이미지 54 · 마스터 7 · 슬롯 영상 25) |
| WP-C 요청 4(`bwl-brand-ad` 소속) | 스크립트 갱신 |
| WP-H 미결 7(요청서 취소 표시 덮어쓰기 위험) | 점검 결과 모든 취소 표시가 남아 있음 |

## 4. BRIEF와 어긋나는 점 (요청 e: 수정하지 않고 기록)

1. **모바일 홈 캐러셀 화살표 위치**: BRIEF 4장 3항은 "모바일은 카드 옆 8px 여백 안에 44px 버튼, 겹치면 스테이지 아래 양끝"이다. WP-H는 카드 옆 여백이 약 35px라 불가능하다고 보고 모바일(767px 이하)에서 **스테이지 아래 양끝**(`bottom:12px`)을 택했다. BRIEF의 단서 조항 안이지만 첫 안(옆 8px)과는 다르다. 데스크톱은 BRIEF대로 좌우 가장자리 세로 중앙이다.
2. **홈 카드 캡션 "한 줄"**: BRIEF 4장 4항은 `서비스명 · 한 줄 · 시작가 · 서비스 보기 →` 한 줄 링크다. 280px 카드에서 한 줄이 불가능해 WP-H는 3행(이름·시작가 / 한 줄 설명 / 태그·링크)으로 배치했다.
3. **상담 띠 구분**: 섹션 위 선 삭제 규칙 때문에 PROCESS와 상담 띠 사이는 여백뿐이다(BRIEF에 배경 면 지시 없음).
4. 태블릿(768~1023px)에서 화살표가 옆 카드 위에 겹치는 정도는 시각 확인 전이다.

## 5. 카피 점검 결과 (4번)

대상: `lib/content-site/**`, `lib/content-home.ts`, `lib/home-journey.ts`, `lib/content-pricing.ts`, `components/guide/main.jsx`, `components/content-home/**`, `components/content-site/**`, `app/(content-site)/**`.

- 문장 끝 마침표: 사용자에게 보이는 문자열 중 끝이 마침표인 곳은 없다. 남은 마침표는 (a) `home-journey.ts` 소개·단계 lead의 문장 사이 마침표(BRIEF 4장 표기와 WP-M 결정을 따름), (b) `app/(content-site)/content/contact/page.tsx:12`의 메타 설명(검색 결과용 문장이며 `seo-http.mjs`가 마침표 문장을 기대) 두 종류다.
- 'X가 아니라 Y' 구조: 화면에 보이는 카피에는 없다. 코드 주석에만 3곳 있다(`animation/landing.tsx`, `shell/mobile-bar.tsx`, `ui/media.tsx`).
- 같은 사실 반복: 부가세 별도는 히어로 가격 줄과 가격 주석(BRIEF 5장이 둘 다 지시)에만 남기고, 어긋났던 브랜드 영상 FAQ의 부가세 문구를 삭제했다. 수정 2회·1회는 진행 방식과 FAQ(BRIEF 2장 지시), 홈의 PROCESS 4행에만 있다. 대량·정기 제작은 FAQ 한 곳과 AI 인플루언서 가격 주석(계정 운영 별도 안내 때문에 BRIEF가 지시)에만 있다.

## 6. 미결

1. **서비스 데이터 `scope`의 중복 항목**: 웹툰·애니메이션·AI 인플루언서·모션그래픽·브랜드 영상 데이터에 "기획안 수정 2회 · 최종안 수정 1회"와 "대량·정기 제작"이 남아 있다. `CsScopeText`의 `DUPLICATE_FACT` 필터가 렌더에서 거르므로 화면은 맞다. 데이터에서 지우고 필터를 없애는 정리는 하지 않았다(필터와 테스트 11-4가 현재 계약).
2. **`lib/content-pricing.ts`의 `StartingPrice.note` 통로**(WP-A 제안): 히어로가 출력하지 않는 필드. 이번에는 건드리지 않았다.
3. **`hero.note`**: 어느 서비스 데이터에도 값이 없던 선택 필드라 `ServiceLandingData.hero`의 타입에서 삭제했다(`types.ts`). 테스트의 `ai.hero.note === undefined` 단언은 그대로 통과한다.
4. **`webtoon-key-1` 파일**(`public/content-examples/webtoon/webtoon-key.webp`): 슬롯은 지웠지만 파일과 `MANIFEST.json` 항목은 남겼다(원본 보존).
5. **요프리 6포즈 실물**(WP-B 미결 1)과 **모션그래픽 FAQ 4개**(WP-B 미결 2)는 사용자 결정 사항으로 그대로 남는다.
6. **시각 검증 전부 미실시**: 390·767·1440px에서 각 WP 결과 문서의 "시각 확인 필요 지점"을 다음 단계에서 확인해야 한다. 특히 가격 플랜 360px 2열, AI 카드 덱 기하, 광고 레일 9초 속도, 홈 캐러셀 화살표, 읽기 폭 컨테이너의 왼쪽 선.
7. **소재 요청서(`ASSET_REQUEST_R6.md`)가 사용자에게 묻는 것**: `motion-bg-2`의 사용처(없으면 보류 유지), 애니메이션 히어로 대표 슬롯을 16:9 영상으로 바꿀지 여부.
