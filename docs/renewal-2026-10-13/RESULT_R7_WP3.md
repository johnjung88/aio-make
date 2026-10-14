# RESULT_R7_WP3 · 메인 #work 컨텐츠 단계 플랫폼 카드 (BRIEF_R7 §2-5)

작업 2026-10-15 · 구현 담당 WP-3 · 빌드·서버·커밋·push 없음 · 화면 육안 검증 없음(WP-V 몫) · 독립 검수 NOT_RUN

## 변경 파일 (WP-3 소유 범위 + 테스트 영향분)

| 파일 | 내용 |
|---|---|
| `components/home/journey-content.tsx` (재작성) | 탭 6개·하위 칩·이전/다음 버튼·링크 줄 없는 카드 캐러셀. 카드 6장 = `PlatformFrame`(WP-0) + 공식 로고. 활성 카드만 `<video>`, 활성 카드 전체가 서비스 페이지 링크(`target=_blank rel="noopener noreferrer"`, aria-label "웹툰 서비스 보기, 새 탭"). 옆 카드는 선택 버튼. 카드 아래 캡션 1줄 + 6칸 진행 막대(버튼, 탭 아님). `JourneyContent({ selections })` props 그대로 |
| `components/home/journey-content.css` (신규) | 카드 폭 표(`--wjc-w`), 768 미만 scroll-snap 가로 넘김(3D·블러 없음), 768 이상 3D(`data-pos` -2..2·hidden, transform·opacity만), 웹툰 세로 스크롤·켄번스·글자 모션(활성 카드 1장, 화면 안일 때만) |
| `components/home/use-depth-carousel.ts` (신규) | 활성 카드 상태, `data-pos` 계산 입력, 자동 넘김(이미지 3.5초·영상 5.2초), 정지 조건(마우스·키보드 포커스·터치·화면 밖·탭 숨김·reduced-motion), 키보드(←→ Home End), 3D 스와이프(45px·1.2배), 가로 넘김의 스크롤 정지 위치 동기화. `useStageActivity`는 import만(`content-home` 파일 수정 없음) |
| `lib/home-journey-platforms.ts` (신규) | 서비스→프레임 매핑 `platformCards`, 공개판 연출 예시 소재, `cardPlan(selection)`(검토판 소재 선택·태그·링크 라벨), 카드 폭 표 `cardWidthSteps`, 캐러셀 계산 함수. 고객 작업물 문자열 없음 |
| `tests/home-content-cards.test.mjs` (신규) | 12건 |
| `tests/home-journey.test.mjs` | "journey CSS uses role tokens only"에 `journey-content.css`를 추가(글자 토큰 규칙은 동일 적용, `scroll-snap` 금지는 기존 2개 시트에만 유지) |
| `tests/new-tab-links.test.mjs` | 컨텐츠 단계 링크 단언을 "`/content/services/` 부재"에서 "`서비스 자세히 보기` 부재 + `{...newTabProps}` 사용"으로 교체 |

## 카드 크기·서비스-프레임 매핑 확정 표

외곽은 6장 모두 같은 폰 프레임(9:19.5). 폭은 `--wjc-w` 하나이고 서비스별 크기 차이는 없다. 높이 = 폭 × 19.5 / 9. 스테이지 높이 = 카드 + 24px.

| 화면 폭 | 360 | 390 | 430 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|---|
| 카드 외곽(폭×높이) | 200×433 | 216×468 | 232×503 | 240×520 | 248×537 | 280×607 (폭 상한 `68svh × 9/19.5`) |
| 방식 | scroll-snap 가로 넘김(양옆 카드 일부 보임) | 동일 | 동일 | 3D(±1 x±190·scale .84, ±2 x±330·scale .7) | 3D(±1 x±200, ±2 숨김) | 3D(±1 x±230, ±2 x±400) |

| 서비스 | 프레임(platform) | 로고 | 콘텐츠 영역 | 공개판 소재(연출 예시) | 태그 |
|---|---|---|---|---|---|
| 웹툰 | `webtoon` (상단 바 "1억의 구단주 · 1화") | 없음 | 폭 100% 세로 스크롤, 컷 2:3 연속 | `webtoon-v11/cut-01~12` 이어 붙여 세로 이동 | 1억의 구단주 · 제작 예시 |
| 애니메이션 | `youtube169` | YouTube | 상단 16:9 플레이어 + 제목·채널 + 다음 영상 행 | `creative-v06/video-animation.webp` 켄번스 | 연출 예시 |
| AI 인플루언서 | `reels` | Instagram | 9:16 전체 | `content-site/ai-influencer/unnie87-street.webp`(1080×1935) | AI 가상인물 · 연출 예시 |
| 모션그래픽 | `tiktok` | TikTok | 9:16 전체 | `content-examples/motion-graphics/motion-product.webp` + CSS 글자 모션 | 연출 예시 |
| 브랜드 홍보 영상 | `fbvideo` | Facebook | 페이지 줄 + 16:9 영상 + 반응 줄 | `content-examples/brand-film/brandfilm-motion.mp4`(무음, 활성 카드만 재생), 포스터 `brandfilm-poster.webp` | 연출 예시 |
| SNS 광고 영상 | `feed45`(+"광고") | Instagram | 4:5 | `content-examples/ad/ad-product.webp`(900×1350, 2:3 → 4:5 크롭, `object-position` 50% 40%) | 연출 예시 |

검토판(`selection.work`가 있을 때)은 서버가 고른 작업물을 쓴다. 웹툰은 그 작업물의 이미지 최대 6장을 이어 붙이고, 영상 작업물은 활성 카드에서만 `<video>`, 이미지는 정지 이미지다. 태그는 `selection.tag`(제작 후보 등)이고, 출처 줄(`selection.caption`, 예: AI 가상인물 표기 문구)은 카드 아래 캡션 밑에 한 줄로 보인다(공개판은 없음).

## 인수 기준별 확인 (소스·테스트 기준, 화면 실측은 WP-V)

| 기준 | 확인 |
|---|---|
| 탭 6개·하위 칩·이전/다음 0개 | `journey-content.tsx`에 `JourneyTabList`·`role=tab(list)`·`contentCopy`·"이전"·"다음"·칩 클래스 0건(테스트). 진행 막대 6개는 `button.wjc-dot`(탭 아님) |
| 카드 6장 외곽 크기 같음(§2-5 표 ±1px) | 폭 단일 변수 `--wjc-w`, 서비스별 폭·높이 규칙 없음, 표 값 6개를 CSS·`cardWidthSteps`와 대조(테스트), 높이 433/468/503/520/537/607 |
| 서비스-프레임 매핑이 표와 같음 | `platformCards`와 표를 테스트로 대조(프레임·로고·광고 표기·캡션 6줄) |
| 활성 카드만 `<video>` | 소스에 `<video` 1곳, `CardVideo`는 `selected && !reduced`일 때만 마운트, 비활성은 포스터, reduced-motion은 영상 0개(테스트) |
| 조회·좋아요 숫자 0건 | 컴포넌트·매핑 파일에 숫자 지표 문구 0건, 프레임은 아이콘과 빈 막대만(WP-0 테스트) |
| 활성 카드 링크 새 탭 | 활성 카드만 `<a href="/content/services/{id}" target="_blank" rel="noopener noreferrer">`, 옆 카드는 선택 버튼 |
| 공개판에 고객 작업물 0건 | 공개 카드 데이터 JSON에 `reviewWorks`의 slug·brand·title·media 경로, `reference-review`, 87언니, DR's Secret, 힐러넷, 요프리, YoFree, BWL 0건(테스트). 'AI 가상 예시' 0건 |
| 데스크톱 3D, 모바일 scroll-snap(3D·블러 제외) | 768 미만 기본 CSS에 `rotateY`·`perspective`·`translate3d` 없음, CSS 전체에 `blur(`·`filter:` 없음(테스트) |
| `ContentSelection` props 형태 불변 | `lib/home-journey.ts` 변경 없음, 컴포넌트 시그니처와 키 5개 단언 |

## 테스트 결과

- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/home-content-cards.test.mjs tests/home-journey.test.mjs tests/new-tab-links.test.mjs tests/platform-frame.test.mjs` → 50건 중 50 통과, 실패 0 (home-content-cards 12건 포함)
- `npx tsc --noEmit` → 오류 0
- `npx eslint components/home/journey-content.tsx components/home/use-depth-carousel.ts lib/home-journey-platforms.ts` → 경고·오류 없음

## 남은 문제와 다음 담당에게

1. **좌우 화살표 미구현(브리프와 사용자 확정의 충돌).** BRIEF §2-5 표는 ≥768에 가장자리 화살표 44px를 두지만, 사용자 확정("이전/다음 넘김 없음")과 인수 기준("이전/다음 0개")을 따라 화살표 버튼은 만들지 않았다. 넘기는 방법은 자동 넘김, 옆 카드 클릭, 스와이프·가로 스크롤, ←/→/Home/End, 하단 진행 막대 6개다. 화살표가 필요하면 `journey-content.tsx`의 스테이지에 버튼 2개만 더하면 된다.
2. **캡션 글자 크기 14px 고정.** 브리프는 768~1439에서 15px, 1440에서 16px이지만 타입 토큰에 15px가 없어 `t-small`(14px)만 썼다.
3. **죽은 코드는 소유 밖이라 남겨 두었다(정리 대상).** `components/home/workflow-journey.css`의 `.wj-tabs/.wj-tab/.wj-tabpanel/.wj-content-*/.wj-stage*/.wj-shape-*/.wj-cover/.wj-video/.wj-side*/.wj-stage-nav/.wj-step-button`와 1024 미디어쿼리의 `.wj-content` 규칙, `components/home/journey-tabs.tsx` 전체(이제 어디서도 import하지 않음), `lib/home-journey.ts`의 `contentCopy`(이전/다음 문구). 새 카드는 `wjc-` 접두 클래스만 써서 충돌은 없다. `.wj-media`(단계 진입 애니메이션 관찰 대상)는 스테이지에 그대로 붙였다.
4. **상표 고지.** 이 단계에도 YouTube·Instagram·TikTok·Facebook 공식 로고가 보이지만 `PLATFORM_TRADEMARK_NOTICE` 줄은 넣지 않았다(WP-2가 마케팅 섹션 아래에 쓰는 줄 1개로 두기로 한 규칙). 페이지에 로고가 두 곳에 나오므로 한 줄로 충분한지 WP-V나 메인이 판정해 달라. 필요하면 `wjc-note` 아래에 같은 상수 한 줄을 추가한다.
5. **모션그래픽 카드의 글자 모션은 "MOTION / GRAPHICS" 영문 두 줄(장식, `aria-hidden`).** 새 카피이므로 싫으면 `platformCards["motion-graphics"].kinetic`을 지우면 된다. 검토판 실제 작업물에는 붙지 않는다.
6. **검토판 SNS 광고 카드:** 소재가 9:16 영상이라 4:5 틀에서 위아래가 잘린다(`object-position` 50% 40%). 공개판 `ad-product.webp`(2:3)도 위아래 약 17%가 잘린다.
7. **화면 검증 미실시**(빌드·서버 금지). WP-V가 6폭에서 확인할 것: (a) 카드 외곽 6장 실측 폭·높이와 스테이지 높이, (b) 768 미만 scroll-snap의 가운데 스냅과 자동 넘김(`scrollTo` smooth 뒤 활성 카드 동기화)이 서로 싸우지 않는지, 마지막→첫 카드로 감길 때의 긴 스크롤, (c) 768 이상 3D 위치(±1·±2, 1024~1439에서 ±2 숨김, 768에서 ±2가 스테이지 가장자리에서 잘리는 정도), (d) 웹툰 세로 스크롤이 끝에서 아래쪽 끝에 맞는지(바깥·안쪽 translateY 쌍), (e) 활성 카드 전환 시 영상 1개만 존재하는지, (f) 화면 밖·hover·포커스·터치·reduced-motion에서 자동 넘김 정지, (g) `.wj-media` 진입 translateY와 3D 스테이지가 겹쳐 깜박이지 않는지, (h) 360 문서 가로 스크롤 0.
8. **웹툰 카드는 활성화될 때 컷 12장을 한꺼번에 요청한다**(lazy, `sizes` 지정). 모바일 데이터가 걱정되면 보이는 컷만 렌더하도록 줄일 수 있다.
9. 파일 줄바꿈: 새 파일·수정 파일 모두 LF로 확인했다.
