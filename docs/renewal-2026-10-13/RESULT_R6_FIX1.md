# RESULT_R6_FIX1 · R6 검증 지적 수정

2026-10-15 · 기준 HEAD `8a7f677` 이후 작업트리(미커밋) · 빌드·서버 실행·commit/push 없음 · 3213·3214·3215(PID 15816) 건드리지 않음(3215는 읽기 전용 curl 1회로 DOM 개수만 확인).

## 변경

1. **F-1 웹툰 "함께 제작" 정렬(해결)**
   - `components/content-site/blocks/pricing.tsx`: 박스 안의 "함께 제작" 배지(`cs-plan-badge`)를 삭제하고, 묶음 그룹(`group.bundle`)의 그룹 제목 `<p>` 자체를 배지(`cs-pricing-badge`)로 렌더링. 박스는 모두 `라벨 / 금액` 2줄 같은 구조. 강조 테두리(`cs-plan--bundle`)는 첫 박스만이 아니라 묶음 두 박스 모두에 적용. 같은 말이 제목과 배지로 두 번 나오지 않음.
   - `components/content-site/theme.css`: `.cs-plan-badge` 규칙을 `.cs-pricing-group .cs-pricing-badge`(알약 모양, `justify-self:start`)로 교체.
   - 가격·순서·금액·문구는 변경 없음(`CS_COPY.pricing.bundle` 키도 유지, 이제 pricing 블록에서 쓰이지 않음).
   - `tests/content-site.test.mjs` 11-4: 배지 기대를 새 구조(박스 밖 `cs-pricing-badge` 1개, `cs-plan-badge`·`index === 0` 없음, `group.bundle ?`)로 갱신.
2. **`tests/seo-http.mjs` 낡은 기대 3건 갱신**
   - 홈 `data-mode="list"` → `class="ch-gallery ch-gallery--depth"` + `data-slot="home-hero-reel"`.
   - 홈 `ch-price` 6개 → `ch-depth-card` 6개 + `ch-depth-service-link` 6개(서비스 6종 링크 검사는 유지). "연출 예시" 기대는 공개판에서 유지(`referenceReview`가 아닐 때만): 공개판 카드가 연출 이미지에 표기를 계속 달기 때문. 고객명 금지 정규식·`<video>`·autoplay 금지는 그대로.
   - 문의 페이지 `표시 금액은 모두 부가세 별도입니다.` → 마침표 제거(현행 카피 `PRICING_COMMON.vat`).
   - 공개판 서버 응답 기준 검증은 서버 실행 금지로 못 했다. 구조 문자열은 R6 검증 로그의 공개판 HTML과 3215 검토판 HTML(카드 6, 링크 6, 슬롯 1)로 대조했고 `node --check`는 통과.

## 테스트

- `npx tsc --noEmit`: PASS (오류 0)
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs`: 141개 중 140 PASS · 0 FAIL · 1 skip(로컬 미디어 없음, 기존과 동일)
- `tests/seo-http.mjs`: 서버가 필요해 실행하지 않음.

## 고치지 않고 보고만 한 항목

- **인사이트 3페이지 Article 스키마·"최종 정리"(R6 무관 실제 누락)**: `/content/insights/{preparation,process,consultation}`가 쓰는 `app/(content-site)/content/insights/[slug]/page.tsx`에는 `Article` JSON-LD와 "AIO MAKE · 최종 정리 날짜" 바이라인이 없다. 이 기능은 옛 셸 `components/entries.tsx`(L200, L238)에만 있고 컨텐츠 사이트 셸 도입 때 새 페이지로 옮겨지지 않았다. R6 변경분이 아니므로 `seo-http.mjs`의 기대(원래 지키려던 SEO 요소)는 그대로 두었고, 서버 실행 시 이 3건은 계속 FAIL로 남는다. 별도 WP로 새 페이지에 Article 스키마와 최종 정리 바이라인을 추가해야 한다.
- **홈 워크플로우 마케팅 단계의 박스 안 박스·"연출 예시" 태그(R5 그대로)**: BRIEF_R6 3장은 워크플로우에 대해 "개발→마케팅→컨텐츠 유지, 단계 간격만 `clamp(64px,7vw,96px)`로 축소"라고만 한다. 박스·태그 삭제 근거가 BRIEF에 없어 수정하지 않았다. VERIFY_R6 R-4와 같은 결론(범위 확장은 사용자 결정 필요).
