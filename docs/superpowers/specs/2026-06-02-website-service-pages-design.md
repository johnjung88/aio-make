# 웹사이트 서비스 페이지 설계 (IDE 톤 완전체)

**날짜**: 2026-06-02  
**대상 라우트**: `/services/website` · `/services/website/portfolio`  
**범위**: 3페이지 중 resources는 이미 완성, 2페이지 신규/재작성 + 신규 IDE 컴포넌트 4개  

---

## 1. 현황 & 목표

| 페이지 | 현재 상태 | 목표 |
|---|---|---|
| `/services/website` | 제네릭 컴포넌트 (AioNav + ServiceHero 등) | IDE 톤 완전체로 교체 |
| `/services/website/portfolio` | gold 톤 CSS-string (잘못된 디자인) | IDE 톤 IdePortfolio 기반으로 교체 |
| `/services/website/resources` | ✅ 완성 | 그대로 유지 |

시안 파일: `_design_mockups/01_web_dev_v2.html` (IDE 톤 — dark #0D1117, mint #4DD4AC, JetBrains Mono)

---

## 2. 파일 구조

```
components/ide/
  (기존 9개 유지)
  ide-device.tsx             ← 신규
  ide-services.tsx           ← 신규
  ide-process.tsx            ← 신규
  ide-resources-teaser.tsx   ← 신규 (랜딩 전용 4카드 teaser)
  ide-faq.tsx                ← 신규

components/landing/
  website-landing.tsx   ← 전체 재작성
  website-portfolio.tsx ← 전체 재작성
```

`app/[locale]/services/website/page.tsx`와 `portfolio/page.tsx`는 import만 하므로 **수정 없음**.

---

## 3. 랜딩 페이지 섹션 순서

```tsx
<main data-tone="ide" style={{ background: "var(--tone-ide-bg)", minHeight: "100vh" }}>
  <IdeTitlebar locale={locale} />
  <IdeTabbar tabs={[...]} />   // 01 services.tsx active
  <IdeHero locale={locale} />
  <IdeDevice locale={locale} />
  <IdeIndustries />
  <IdeServices locale={locale} />
  <IdePricing locale={locale} />
  <IdeProcess />
  <IdeResourcesTeaser locale={locale} />
  <IdeFaq />
  <IdeCta locale={locale} />
  <IdeStatusbar locale={locale} />
</main>
```

IdeTabbar tabs 정의:
```ts
[
  { num: "01", label: "services.tsx", href: `/${locale}/services/website`, active: true },
  { num: "02", label: "portfolio.tsx", href: `/${locale}/services/website/portfolio` },
  { num: "03", label: "resources.md", href: `/${locale}/services/website/resources` },
]
```

---

## 4. 신규 컴포넌트 명세

### 4-1. `ide-device.tsx`

**목적**: "지금 보이는 모든 사이트, 실제 운영 중입니다" 섹션 — Mac + iPhone 목업  

**구현**:
- Mac SVG 프레임 (시안 SVG 그대로 이식) + iPhone SVG 프레임
- 화면 영역 안에 `.site-mock` div — 4개 미니 페이지를 세로로 쌓아놓고 `@keyframes scrollUp` CSS animation으로 위로 스크롤
- GSAP 없이 CSS-only (`animation: scrollUp 28s linear infinite`)
- iPhone도 동일하지만 22s 주기
- Props: `locale: string`

**keyframe**:
```css
@keyframes scrollUp {
  0%, 6%   { transform: translateY(0); }
  24%, 30% { transform: translateY(-100%); }
  48%, 54% { transform: translateY(-200%); }
  72%, 78% { transform: translateY(-300%); }
  96%, 100%{ transform: translateY(0); }
}
```

---

### 4-2. `ide-services.tsx`

**목적**: "어떤 사이트를 만드나요?" — 2열 서비스 타입 코드블록 카드

**구현**:
- 2열 그리드 (`grid-template-columns: 1fr 1fr`, 모바일 1열)
- 각 카드: VS Code 파일 창 스타일
  - 상단 바: traffic dots (red/yellow/green) + filename (`landing-page.tsx` / `company-site.tsx`)
  - body: `// 01` 주석 + 제목 + 설명 텍스트 + `<ul>` 포함항목 (`✓ ` prefix)
- 카드 1: 랜딩페이지 — 빠른 런칭, 전환율 중심, 스타트업/서비스
- 카드 2: 회사 홈페이지 — 신뢰·SEO·장기 운영, 병원·법률·기업
- Props: `locale: string`

---

### 4-3. `ide-process.tsx`

**목적**: "5일 납품 프로세스" — git log 타임라인

**구현**:
- `.gitlog` 컨테이너: bg-2 배경, border, border-radius 8px
- 헤더: `branch: main` (mint) + `5 commits` (fg-3)
- 5개 row, 각각:
  - 좌측: mint 원형 bullet (border 2px solid mint, glow)
  - bullet 사이 수직선 (line-2 색상)
  - 우측: hash (amber) + day 태그 (mint) + 업무명 (fg bold) + 날짜 (fg-3 float right)
  - 한 줄 아래: 설명 (fg-2, 12px)
- 5 row 내용:
  1. `Day 01` — 상담 · 기획 — 30분 미팅, 벤치마크 3개, 스펙 확정
  2. `Day 02` — 견적 · 시안 — 와이어프레임 + 가격 견적 발송
  3. `Day 03` — 개발 착수 — 반응형 HTML/CSS 기반 구축
  4. `Day 04` — 기능 구현 — CMS·폼·예약 등 핵심 기능 연결
  5. `Day 05` — 납품 · 검수 — 실 도메인 배포 + QA 통과 + 인수인계
- Props: 없음 (정적)

---

### 4-4. `ide-resources-teaser.tsx`

**목적**: 랜딩 중간의 "꿀팁 미리보기" — 4장 카드 + 전체 보기 링크

**구현**:
- `IdeResources`는 풀 페이지(필터+그리드+뉴스레터) 컴포넌트라 랜딩 teaser에 사용 불가
- 별도 `ide-resources-teaser.tsx` 작성: `resources` 배열에서 앞 4개만 표시
- 카드 레이아웃: `2×2` 그리드 (1fr 1fr, 모바일 1열)
- 각 카드: file icon(PDF) + tag + 제목 + 설명 + `$ pending --soon` 하단
- 하단: `→ 전체 꿀팁 보기 (14편)` 링크 → `/services/website/resources`
- Props: `locale: string`
- `resources` 데이터는 `IdeResources`에서 직접 import하지 않고 파일 내 별도 배열 정의 (중복을 감수하거나 나중에 `lib/ide-resources-data.ts`로 추출)

---

### 4-5. `ide-faq.tsx`

**목적**: 의뢰 전 자주 묻는 질문 7개

**구현**:
- `<details>/<summary>` HTML 네이티브 아코디언
- `open` 상태: `border-color: var(--tone-ide-mint)`
- summary 우측 `+` / `×` 전환 (CSS `details[open] summary .arrow { transform: rotate(45deg) }`)
- 7개 질문:
  1. 수정 횟수 제한이 있나요?
  2. 납품 형태가 어떻게 되나요?
  3. A/S 기간은 얼마나 되나요?
  4. SEO는 포함인가요?
  5. 디자인 방향은 어떻게 정하나요?
  6. 유지보수는 어떻게 하나요?
  7. 계약은 어떻게 진행되나요?
- Props: 없음 (정적)

---

### 4-6. `website-landing.tsx` 재작성

- 기존 AioNav, ServiceHero, TrustNumbers, PricingTiers, ProcessSteps, ServiceCta 전부 제거
- `"use client"` 유지 (자식 컴포넌트 중 IdePortfolio·IdeResources 등이 "use client"이므로)
- 위 섹션 순서대로 조립
- export 이름 `WebsiteLanding` 유지

---

### 4-6. `website-portfolio.tsx` 재작성

- 기존 CSS-string (`.aiowsp`) 전부 제거
- 구조:
```tsx
<main data-tone="ide" style={{ background: "var(--tone-ide-bg)", minHeight: "100vh" }}>
  <IdeTitlebar locale={locale} />
  <IdeTabbar tabs={[...]} />   // 02 portfolio.tsx active
  <IdePortfolio locale={locale} />
  <IdeStatusbar locale={locale} />
</main>
```
- `"use client"` 유지 (IdePortfolio 내부에 useState 있음)
- export 이름 `WebsitePortfolio` 유지

---

## 5. 애니메이션 전략

PORTING_PLAN.md 권장대로 **CSS-only MVP**:

| 시안 GSAP 효과 | Next.js 대체 |
|---|---|
| Hero h1 kinetic (translateY reveal) | `@keyframes` + `animation` (기존 IdeHero에 이미 구현) |
| Hero underline draw | CSS `scaleX` animation (기존 IdeHero에 이미 구현) |
| Device 스크롤 | `@keyframes scrollUp` CSS infinite (이 스펙에서 구현) |
| Reveal on scroll | `IntersectionObserver` + CSS transition (IdePortfolio 패턴 재사용) |

---

## 6. 주의 사항

1. **레이아웃 충돌 없음**: `site-shell.tsx`의 `isStandalone()` 함수가 `/services/website/...` 경로에서 자동으로 SiteHeader/SiteFooter 숨김.
2. **폰트**: `var(--font-jetbrains)` — `layout.tsx`에서 이미 로드됨.
3. **CSS 변수**: `var(--tone-ide-*)` — `globals.css`의 `[data-tone="ide"]` 블록에 모두 정의됨.
4. **서버/클라이언트**: Device 섹션은 `"use client"` 불필요 (순수 CSS animation). FAQ는 `<details>` 네이티브라 JS 불필요.
5. **i18n**: 현재 한국어 우선, 영어 카피는 나중에 추가.

---

## 7. 구현 순서 (권장)

1. 신규 컴포넌트 5개 (`ide-device`, `ide-services`, `ide-process`, `ide-resources-teaser`, `ide-faq`)
2. `website-landing.tsx` 재작성 + 로컬 확인
3. `website-portfolio.tsx` 재작성 + 로컬 확인
4. `npm run build` 통과 확인
5. git commit + push → Vercel 배포 확인

---

## 8. 완료 체크리스트

- [ ] 시안 HTML vs 실제 사이트 시각 비교
- [ ] 모바일 반응형 (320 / 375 / 768 / 1024)
- [ ] `npm run build` 로컬 통과
- [ ] Vercel 빌드 READY 확인
