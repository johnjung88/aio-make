# 개발 카테고리 4페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 개발 허브 + 웹사이트·쇼핑몰·자동화 4개 페이지를 클린 화이트 에이전시 스타일로 전면 재설계. 서브 서비스 3개 페이지는 전환 랜딩페이지 구조(첫 화면 CTA 노출).

**Architecture:** 공통 재사용 컴포넌트(`components/services/`)를 먼저 만들고, 각 페이지 랜딩 컴포넌트가 이를 조립. `accentColor` 문자열 prop으로 페이지별 포인트 컬러 주입. AioNav·AioFooter는 기존 import 유지.

**Tech Stack:** Next.js 15 App Router, React 19, Tailwind CSS v4, TypeScript, `next/image`, `lib/services-data.ts` (기존 가격 데이터 재사용)

---

## 파일 구조

**신규 생성:**
```
components/services/
  service-hero.tsx       - 히어로 (텍스트 좌 + 이미지 우, 분할 레이아웃)
  trust-numbers.tsx      - 신뢰 수치 바 (의뢰수/재의뢰율/응답시간)
  pricing-tiers.tsx      - 가격 3티어 테이블
  process-steps.tsx      - 제작 프로세스 4단계
  service-cta.tsx        - 하단 CTA 섹션
```

**수정 (전체 교체):**
```
components/landing/development-services.tsx  - 개발 허브 (블랙)
components/landing/website-landing.tsx       - 웹사이트 (민트)
components/landing/shopping-mall-landing.tsx - 쇼핑몰 (오렌지)
components/landing/automation-landing.tsx    - 자동화 (인디고)
```

---

## Task 1: ServiceHero 컴포넌트

**Files:**
- Create: `components/services/service-hero.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// components/services/service-hero.tsx
import Image from "next/image";
import Link from "next/link";

interface Props {
  accentColor: string;
  eyebrow: string;
  headline: React.ReactNode;
  sub: string;
  badges?: string[];
  ctaLabel?: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt?: string;
}

export function ServiceHero({
  accentColor,
  eyebrow,
  headline,
  sub,
  badges = [],
  ctaLabel = "제작 문의 →",
  ctaHref,
  imageSrc,
  imageAlt = "",
}: Props) {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* 좌: 텍스트 */}
          <div>
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5"
              style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
            >
              {eyebrow}
            </p>
            <h1
              className="font-bold leading-[1.05] tracking-tight text-[#111] mb-5"
              style={{ fontSize: "clamp(34px,5vw,62px)" }}
            >
              {headline}
            </h1>
            <p className="text-[#6B7280] leading-[1.8] mb-7" style={{ fontSize: "clamp(14px,1.2vw,17px)" }}>
              {sub}
            </p>
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border"
                    style={{ borderColor: accentColor, color: accentColor }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-lg text-[14px] font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: accentColor }}
            >
              {ctaLabel}
            </Link>
          </div>
          {/* 우: 이미지 */}
          <div className="relative w-full h-[260px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit 2>&1 | head -20
```

기대값: 오류 없음 또는 기존 오류만 출력.

---

## Task 2: TrustNumbers 컴포넌트

**Files:**
- Create: `components/services/trust-numbers.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// components/services/trust-numbers.tsx
interface TrustItem {
  value: string;
  label: string;
  sub?: string;
}

interface Props {
  accentColor: string;
  items: TrustItem[];
}

export function TrustNumbers({ accentColor, items }: Props) {
  return (
    <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-10 md:py-14">
        <div
          className="grid text-center"
          style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="px-4"
              style={i < items.length - 1 ? { borderRight: "1px solid #E5E7EB" } : {}}
            >
              <div
                className="font-bold leading-none mb-1"
                style={{
                  fontSize: "clamp(28px,4vw,48px)",
                  color: accentColor,
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                {item.value}
              </div>
              <div className="text-[13px] font-semibold text-[#111] mb-0.5">{item.label}</div>
              {item.sub && <div className="text-[11px] text-[#9CA3AF]">{item.sub}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit 2>&1 | head -20
```

---

## Task 3: PricingTiers + ProcessSteps + ServiceCta

**Files:**
- Create: `components/services/pricing-tiers.tsx`
- Create: `components/services/process-steps.tsx`
- Create: `components/services/service-cta.tsx`

- [ ] **Step 1: pricing-tiers.tsx 생성**

```tsx
// components/services/pricing-tiers.tsx
import Link from "next/link";
import type { PricingTier } from "@/lib/services-data";

interface Props {
  tiers: PricingTier[];
  accentColor: string;
  isKo: boolean;
  ctaHref: string;
}

export function PricingTiers({ tiers, accentColor, isKo, ctaHref }: Props) {
  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Pricing
          </p>
          <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
            {isKo ? "투명한 가격" : "Transparent Pricing"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name.ko}
              className="border rounded-2xl p-7 flex flex-col"
              style={
                tier.recommended
                  ? { borderColor: accentColor, borderWidth: 2, boxShadow: `0 8px 32px ${accentColor}22` }
                  : { borderColor: "#E5E7EB" }
              }
            >
              {tier.recommended && (
                <span
                  className="inline-block self-start text-[10px] font-bold px-3 py-1 rounded-full text-white mb-4"
                  style={{ background: accentColor }}
                >
                  {isKo ? "추천" : "Recommended"}
                </span>
              )}
              <div className="text-[13px] font-semibold text-[#6B7280] mb-2">
                {isKo ? tier.name.ko : tier.name.en}
              </div>
              <div
                className="font-bold text-[#111] leading-none mb-1"
                style={{ fontSize: "clamp(26px,3.5vw,38px)", fontFamily: "var(--font-jetbrains)" }}
              >
                {tier.eventPrice}
              </div>
              <div className="text-[11px] text-[#9CA3AF] mb-1">정가 {tier.regularPrice}</div>
              <div className="text-[12px] text-[#6B7280] mb-5 pb-5 border-b border-[#F3F4F6]">
                납기 {tier.duration}
              </div>
              <ul className="space-y-2.5 flex-1">
                {tier.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-[#374151]">
                    <span
                      className="mt-0.5 text-[10px] font-bold flex-shrink-0"
                      style={{ color: accentColor }}
                    >
                      ✓
                    </span>
                    {isKo ? inc.ko : inc.en}
                  </li>
                ))}
              </ul>
              <Link
                href={ctaHref}
                className="mt-6 block text-center py-3 rounded-lg text-[13px] font-semibold transition-all hover:-translate-y-0.5"
                style={
                  tier.recommended
                    ? { background: accentColor, color: "#fff" }
                    : { background: "#F9FAFB", color: "#111", border: "1px solid #E5E7EB" }
                }
              >
                {isKo ? "이 플랜으로 문의 →" : "Inquire with this plan →"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: process-steps.tsx 생성**

```tsx
// components/services/process-steps.tsx
interface Step {
  step: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
}

interface Props {
  steps: Step[];
  accentColor: string;
  isKo: boolean;
}

export function ProcessSteps({ steps, accentColor, isKo }: Props) {
  return (
    <section className="bg-[#F9FAFB]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Process
          </p>
          <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
            {isKo ? "제작 프로세스" : "How We Work"}
          </h2>
        </div>
        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
        >
          {steps.map((s, i) => (
            <div key={s.step} className="text-center">
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-[13px] font-bold mb-4"
                style={{ background: accentColor }}
              >
                {s.step}
              </div>
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-5 left-1/2 w-full h-px"
                  style={{ background: "#E5E7EB" }}
                />
              )}
              <h3 className="text-[14px] font-bold text-[#111] mb-2">
                {isKo ? s.title.ko : s.title.en}
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-[1.7]">
                {isKo ? s.description.ko : s.description.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: service-cta.tsx 생성**

```tsx
// components/services/service-cta.tsx
import Link from "next/link";

interface Props {
  accentColor: string;
  headline: string;
  sub: string;
  ctaLabel: string;
  ctaHref: string;
}

export function ServiceCta({ accentColor, headline, sub, ctaLabel, ctaHref }: Props) {
  return (
    <section className="bg-[#111] py-20 md:py-28 text-center">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <h2
          className="font-bold text-white mb-4"
          style={{ fontSize: "clamp(26px,4vw,44px)" }}
        >
          {headline}
        </h2>
        <p className="text-[#9CA3AF] text-[15px] mb-8">{sub}</p>
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-[15px] font-bold text-[#111] transition-all hover:-translate-y-0.5 hover:shadow-xl"
          style={{ background: accentColor }}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: 타입 체크**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: 커밋**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && git add components/services/ && git commit -m "feat: add shared service page components (ServiceHero, TrustNumbers, PricingTiers, ProcessSteps, ServiceCta)"
```

---

## Task 4: 개발 허브 재작성

**Files:**
- Modify: `components/landing/development-services.tsx` (전체 교체)

- [ ] **Step 1: development-services.tsx 교체**

```tsx
// components/landing/development-services.tsx
import Link from "next/link";
import Image from "next/image";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";

const ACCENT = "#111111";

const SUB_SERVICES = [
  {
    no: "01",
    id: "website",
    title: "웹사이트",
    en: "Website",
    desc: "랜딩페이지·회사 홈페이지·서비스 사이트. 스크롤을 멈추게 만드는 한 페이지.",
    price: "₩99,000~",
    days: "1-5일",
    href: (locale: string) => `/${locale}/services/website`,
    soon: false,
  },
  {
    no: "02",
    id: "shopping-mall",
    title: "쇼핑몰",
    en: "Shopping Mall",
    desc: "카페24·독립몰 구축. 상품 등록·결제 연동·모바일 최적화까지 한 번에.",
    price: "₩149,000~",
    days: "2-5일",
    href: (locale: string) => `/${locale}/services/shopping-mall`,
    soon: false,
  },
  {
    no: "03",
    id: "automation-app",
    title: "자동화·프로그램",
    en: "Automation & App",
    desc: "엑셀·데이터·크롤링·알림·매크로. 반복 업무를 코드에게 맡기세요.",
    price: "₩100,000~",
    days: "1-7일",
    href: (locale: string) => `/${locale}/services/automation-app`,
    soon: false,
  },
  {
    no: "04",
    id: "app",
    title: "앱",
    en: "App",
    desc: "iOS·Android 모바일 앱 개발. 현재 준비 중입니다.",
    price: "준비 중",
    days: "",
    href: () => "#",
    soon: true,
  },
];

const HOW = [
  { title: "투명한 진행", desc: "작업 상황을 매일 공유합니다" },
  { title: "운영 가능한 납품", desc: "시안이 아닌 완성품으로 드립니다" },
  { title: "빠른 속도", desc: "의뢰 후 1~5일 — 다음 날 착수" },
  { title: "책임 A/S", desc: "납품 후 14일 무상 유지보수" },
];

export function DevelopmentServices({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5"
                style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
              >
                Development · 개발 서비스
              </p>
              <h1
                className="font-bold leading-[1.05] tracking-tight text-[#111] mb-5"
                style={{ fontSize: "clamp(34px,5vw,62px)" }}
              >
                코드로 만드는<br />
                <span style={{ color: ACCENT }}>모든 것</span>
              </h1>
              <p className="text-[#6B7280] leading-[1.8] mb-7" style={{ fontSize: "clamp(14px,1.2vw,17px)" }}>
                웹사이트·쇼핑몰·자동화·프로그램 — 비즈니스에 필요한 결과물을 빠르게 만듭니다.
                보여주기용이 아닌, 바로 운영 가능한 완성품으로.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["5일 납품", "98% 재의뢰율", "1시간 응답", "14일 A/S"].map((b) => (
                  <span
                    key={b}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#111] text-[#111]"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-lg text-[14px] font-bold text-white bg-[#111] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                제작 문의 →
              </Link>
            </div>
            <div className="relative w-full h-[260px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/services/development-hero.png"
                alt="AIO 개발팀"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 서비스 카드 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Services
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              네 가지 <span style={{ borderBottom: "3px solid #111" }}>개발 서비스</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SUB_SERVICES.map((s) => {
              const Inner = (
                <div
                  className="border rounded-2xl p-7 bg-white flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ borderColor: s.soon ? "#E5E7EB" : "#E5E7EB", opacity: s.soon ? 0.6 : 1 }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
                    >
                      {s.no}
                    </span>
                    {s.soon && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F3F4F6] text-[#9CA3AF] rounded-full">
                        COMING SOON
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#111]">{s.title}</h3>
                    <p className="text-[12px] text-[#9CA3AF]">{s.en}</p>
                  </div>
                  <p className="text-[13px] text-[#6B7280] leading-[1.7] flex-1">{s.desc}</p>
                  {!s.soon && (
                    <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                      <span
                        className="text-[15px] font-bold"
                        style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
                      >
                        {s.price}
                      </span>
                      <span className="text-[11px] text-[#9CA3AF]">납기 {s.days}</span>
                    </div>
                  )}
                </div>
              );
              return s.soon ? (
                <div key={s.id}>{Inner}</div>
              ) : (
                <Link key={s.id} href={s.href(locale)} className="block">
                  {Inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 일하는 방식 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              How We Work
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              일하는 방식
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HOW.map((h) => (
              <div key={h.title} className="text-center p-6 border border-[#E5E7EB] rounded-2xl">
                <h3 className="text-[15px] font-bold text-[#111] mb-2">{h.title}</h3>
                <p className="text-[13px] text-[#6B7280] leading-[1.7]">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceCta
        accentColor={ACCENT}
        headline="코드로 만들 일이 있나요?"
        sub="지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물"
        ctaLabel="제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: 브라우저 확인 (개발 서버 실행 중이어야 함)**

`http://localhost:3000/ko/services/development` 접속.
- 흰 배경, 검정 포인트 색상 확인
- 히어로 이미지 (development-hero.png) 표시 확인
- 4개 서비스 카드 표시, 앱은 "COMING SOON" 배지 확인
- 웹사이트·쇼핑몰·자동화 카드 클릭 시 각 페이지로 이동 확인
- 375px 모바일: 카드 1열 레이아웃 확인

- [ ] **Step 4: 커밋**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && git add components/landing/development-services.tsx && git commit -m "feat: rewrite development hub — white agency style, black accent"
```

---

## Task 5: 웹사이트 랜딩 재작성

**Files:**
- Modify: `components/landing/website-landing.tsx` (전체 교체)

- [ ] **Step 1: website-landing.tsx 교체**

```tsx
// components/landing/website-landing.tsx
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceHero } from "@/components/services/service-hero";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#4DD4AC";

const service = servicesData.find((s) => s.id === "website")!;

const INDUSTRIES = [
  { icon: "🏥", title: "병원·의원", desc: "예약 유도와 신뢰 강조에 최적화된 의료 홈페이지" },
  { icon: "⚖️", title: "법률사무소", desc: "전문성과 상담 유도를 중심으로 한 법률 사이트" },
  { icon: "🛒", title: "커머스·브랜드", desc: "제품과 브랜드를 전면에 내세운 커머스 랜딩" },
  { icon: "🚀", title: "스타트업·서비스", desc: "빠른 런칭과 전환율 중심의 서비스 랜딩페이지" },
];

const TRUST = [
  { value: "142", label: "누적 의뢰", sub: "기업·개인 포함" },
  { value: "98%", label: "재의뢰율", sub: "142명 중 139명 재의뢰" },
  { value: "23분", label: "평균 응답", sub: "영업일 기준" },
  { value: "14일", label: "기본 A/S", sub: "납품 후 무상" },
];

export function WebsiteLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero (첫 화면 CTA 포함) ── */}
      <ServiceHero
        accentColor={ACCENT}
        eyebrow="Website · 웹사이트 제작"
        headline={
          <>
            스크롤을 멈추게<br />
            만드는 <span style={{ color: ACCENT }}>홈페이지</span>
          </>
        }
        sub="랜딩페이지·회사 홈페이지·서비스 사이트. 바로 운영 가능한 완성품을 5일 이내 납품합니다."
        badges={["5일 납품", "14일 A/S", "SEO 세팅 포함"]}
        ctaLabel="웹사이트 제작 문의 →"
        ctaHref={`/${locale}/quote`}
        imageSrc="/images/services/website-hero.png"
        imageAlt="웹사이트 제작 팀"
      />

      {/* ── 신뢰 수치 ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── 포트폴리오 쇼케이스 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Portfolio
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              실제 납품한 사이트들
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { title: "병원 홈페이지", tag: "의료", bg: "#EFF6FF" },
              { title: "법률사무소", tag: "법률", bg: "#F5F3FF" },
              { title: "스타트업 랜딩", tag: "서비스", bg: "#F0FDF4" },
              { title: "브랜드 홈페이지", tag: "커머스", bg: "#FFF7ED" },
              { title: "포트폴리오 사이트", tag: "개인", bg: "#FDF2F8" },
              { title: "B2B 서비스 랜딩", tag: "B2B", bg: "#F0F9FF" },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl overflow-hidden border border-[#E5E7EB] aspect-[4/3] flex items-end p-5"
                style={{ background: item.bg }}
              >
                <div>
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                    style={{ background: ACCENT + "22", color: ACCENT }}
                  >
                    {item.tag}
                  </span>
                  <p className="text-[13px] font-semibold text-[#111]">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={`/${locale}/portfolio/category/website`}
              className="text-[13px] font-semibold underline"
              style={{ color: ACCENT }}
            >
              전체 포트폴리오 보기 →
            </a>
          </div>
        </div>
      </section>

      {/* ── 업종별 전문 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Industries
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              업종별 전문 제작
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{ind.icon}</div>
                <h3 className="text-[15px] font-bold text-[#111] mb-2">{ind.title}</h3>
                <p className="text-[12px] text-[#6B7280] leading-[1.7]">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 가격 3티어 ── */}
      <PricingTiers
        tiers={service.pricing}
        accentColor={ACCENT}
        isKo={isKo}
        ctaHref={`/${locale}/quote`}
      />

      {/* ── 프로세스 ── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline="지금 제작 문의하세요"
        sub="24시간 안에 견적 · 5일 안에 첫 화면"
        ctaLabel="웹사이트 제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: 브라우저 확인**

`http://localhost:3000/ko/services/website` 접속.
- 흰 배경, 민트(#4DD4AC) 포인트 확인
- 히어로 이미지(website-hero.png) + 첫 화면 "웹사이트 제작 문의 →" 버튼 확인
- 신뢰 수치 바 확인 (142 / 98% / 23분 / 14일)
- 포트폴리오 그리드 6개 확인
- 업종별 전문 4칸 확인
- 가격 3티어 테이블 확인 (₩99,000 / ₩199,000 / ₩349,000)
- 375px 모바일 확인

- [ ] **Step 4: 커밋**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && git add components/landing/website-landing.tsx && git commit -m "feat: rewrite website landing — white agency style, mint accent, conversion-first"
```

---

## Task 6: 쇼핑몰 랜딩 재작성

**Files:**
- Modify: `components/landing/shopping-mall-landing.tsx` (전체 교체)

- [ ] **Step 1: shopping-mall-landing.tsx 교체**

```tsx
// components/landing/shopping-mall-landing.tsx
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceHero } from "@/components/services/service-hero";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#FB923C";

const service = servicesData.find((s) => s.id === "shopping-mall")!;

const INDUSTRIES = [
  { icon: "💄", title: "뷰티·화장품", desc: "스킨케어·메이크업·향수 전문 쇼핑몰" },
  { icon: "🍱", title: "식품·건강", desc: "농산물·건강기능식품·밀키트 전문 쇼핑몰" },
  { icon: "👗", title: "패션·의류", desc: "여성복·남성복·액세서리 전문 쇼핑몰" },
  { icon: "🛋️", title: "리빙·인테리어", desc: "가구·조명·생활용품 전문 쇼핑몰" },
];

const INCLUDES = [
  { icon: "📦", title: "상품 등록", desc: "상품 사진·설명·옵션·가격 세팅" },
  { icon: "💳", title: "결제 연동", desc: "카드·계좌·간편결제 연동 및 테스트" },
  { icon: "📱", title: "모바일 최적화", desc: "모바일 쇼핑 흐름 우선 설계" },
  { icon: "🛠️", title: "14일 A/S", desc: "납품 후 무상 유지보수 포함" },
];

const TRUST = [
  { value: "142", label: "누적 의뢰", sub: "쇼핑몰 포함" },
  { value: "98%", label: "재의뢰율", sub: "142명 중 139명" },
  { value: "2일", label: "평균 납기", sub: "기본 플랜 기준" },
  { value: "카페24", label: "전문 파트너", sub: "공식 구축 경험" },
];

export function ShoppingMallLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero ── */}
      <ServiceHero
        accentColor={ACCENT}
        eyebrow="Shopping Mall · 쇼핑몰 구축"
        headline={
          <>
            팔리는 쇼핑몰을<br />
            <span style={{ color: ACCENT }}>구축</span>합니다
          </>
        }
        sub="카페24·독립몰·자사몰. 상품 등록부터 결제 연동까지 한 번에. 운영 가능한 완성몰로 납품합니다."
        badges={["카페24 전문", "결제연동 포함", "14일 A/S"]}
        ctaLabel="쇼핑몰 제작 문의 →"
        ctaHref={`/${locale}/quote`}
        imageSrc="/images/services/shopping-hero.png"
        imageAlt="쇼핑몰 구축 팀"
      />

      {/* ── 신뢰 수치 ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── 포함 내역 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Includes
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              기본 패키지에 모두 포함
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {INCLUDES.map((inc) => (
              <div
                key={inc.title}
                className="border border-[#E5E7EB] rounded-2xl p-6 text-center bg-white"
              >
                <div className="text-3xl mb-3">{inc.icon}</div>
                <h3 className="text-[15px] font-bold text-[#111] mb-2">{inc.title}</h3>
                <p className="text-[12px] text-[#6B7280] leading-[1.7]">{inc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 업종별 전문 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Industries
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              업종별 전문 쇼핑몰
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{ind.icon}</div>
                <h3 className="text-[15px] font-bold text-[#111] mb-2">{ind.title}</h3>
                <p className="text-[12px] text-[#6B7280] leading-[1.7]">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 가격 3티어 ── */}
      <PricingTiers
        tiers={service.pricing}
        accentColor={ACCENT}
        isKo={isKo}
        ctaHref={`/${locale}/quote`}
      />

      {/* ── 프로세스 ── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline="팔리는 쇼핑몰, 지금 시작하세요"
        sub="24시간 안에 견적 · 2-5일 안에 운영 가능한 완성몰"
        ctaLabel="쇼핑몰 제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: 브라우저 확인**

`http://localhost:3000/ko/services/shopping-mall` 접속.
- 오렌지(#FB923C) 포인트 컬러 확인
- 히어로 이미지(shopping-hero.png) 확인
- 포함 내역 4칸 (상품등록/결제연동/모바일/A/S) 확인
- 가격 3티어 (₩149,000 / ₩249,000 / ₩399,000) 확인

- [ ] **Step 4: 커밋**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && git add components/landing/shopping-mall-landing.tsx && git commit -m "feat: rewrite shopping mall landing — white agency style, orange accent"
```

---

## Task 7: 자동화 랜딩 재작성

**Files:**
- Modify: `components/landing/automation-landing.tsx` (전체 교체)

- [ ] **Step 1: automation-landing.tsx 교체**

```tsx
// components/landing/automation-landing.tsx
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceHero } from "@/components/services/service-hero";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#818CF8";

const service = servicesData.find((s) => s.id === "automation-app")!;

const CASES = [
  {
    icon: "📊",
    title: "엑셀·데이터 파싱",
    before: "매일 2시간 수작업 복사·붙여넣기",
    after: "버튼 한 번으로 3분 완료",
    saving: "1,820시간/년 절약",
  },
  {
    icon: "🔔",
    title: "카카오 알림 자동 발송",
    before: "주문마다 수동 문자 발송",
    after: "조건 충족 시 자동 발송",
    saving: "무한 반복 제거",
  },
  {
    icon: "🌐",
    title: "데이터 크롤링·수집",
    before: "경쟁사 가격 매일 직접 확인",
    after: "매일 자동 수집 → 엑셀 저장",
    saving: "실시간 데이터 확보",
  },
  {
    icon: "⚙️",
    title: "반복 매크로·클릭봇",
    before: "같은 화면 클릭을 매일 반복",
    after: "스케줄 설정 → 자동 실행",
    saving: "야근·실수 제로화",
  },
];

const STACK = [
  { name: "n8n", desc: "노코드 자동화 플로우" },
  { name: "Make", desc: "API·앱 연동 자동화" },
  { name: "Python", desc: "크롤링·파싱·스크립트" },
  { name: "Electron", desc: "데스크탑 프로그램" },
  { name: "매크로", desc: "반복 클릭·입력 자동화" },
];

const TRUST = [
  { value: "142", label: "누적 의뢰", sub: "자동화 포함" },
  { value: "98%", label: "재의뢰율", sub: "142명 중 139명" },
  { value: "1일~", label: "최소 납기", sub: "단순 자동화 기준" },
  { value: "14일", label: "기본 A/S", sub: "납품 후 무상" },
];

export function AutomationLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero ── */}
      <ServiceHero
        accentColor={ACCENT}
        eyebrow="Automation · 자동화·프로그램"
        headline={
          <>
            반복 업무를<br />
            <span style={{ color: ACCENT }}>코드</span>에게 맡기세요
          </>
        }
        sub="엑셀 파싱·알림 발송·크롤링·매크로·데스크탑 프로그램. 하루 수 시간의 반복을 한 번에 없앱니다."
        badges={["1일~ 납기", "Python·n8n·Make", "14일 A/S"]}
        ctaLabel="자동화 문의 →"
        ctaHref={`/${locale}/quote`}
        imageSrc="/images/services/automation-hero.png"
        imageAlt="자동화 개발팀"
      />

      {/* ── 신뢰 수치 ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── Before / After 케이스 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Before / After
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              이런 일을 자동화합니다
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CASES.map((c) => (
              <div key={c.title} className="border border-[#E5E7EB] rounded-2xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="text-[15px] font-bold text-[#111]">{c.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#FEF2F2] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[#EF4444] mb-1 uppercase tracking-wider">BEFORE</p>
                    <p className="text-[12px] text-[#374151] leading-[1.6]">{c.before}</p>
                  </div>
                  <div
                    className="rounded-xl p-3"
                    style={{ background: ACCENT + "18" }}
                  >
                    <p
                      className="text-[10px] font-bold mb-1 uppercase tracking-wider"
                      style={{ color: ACCENT }}
                    >
                      AFTER
                    </p>
                    <p className="text-[12px] text-[#374151] leading-[1.6]">{c.after}</p>
                  </div>
                </div>
                <div
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-full inline-block"
                  style={{ background: ACCENT + "18", color: ACCENT }}
                >
                  💡 {c.saving}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 시간 절약 계산 ── */}
      <section className="bg-[#111] text-white py-16 md:py-20 text-center">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5"
            style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
          >
            Time Savings
          </p>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(24px,4vw,44px)" }}
          >
            하루 <span style={{ color: ACCENT }}>3시간</span> × 365일
          </h2>
          <p
            className="font-bold mb-4"
            style={{ fontSize: "clamp(32px,6vw,72px)", color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
          >
            = 1,095시간/년
          </p>
          <p className="text-[#9CA3AF] text-[15px] max-w-[40ch] mx-auto leading-[1.7]">
            그 시간을 매출·성장·쉬는 시간에 쓰세요.<br />
            자동화는 한 번 만들면 계속 일합니다.
          </p>
        </div>
      </section>

      {/* ── 기술 스택 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Tech Stack
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              사용하는 기술 스택
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {STACK.map((s) => (
              <div
                key={s.name}
                className="border rounded-xl px-6 py-4 text-center min-w-[120px] bg-white"
                style={{ borderColor: ACCENT + "44" }}
              >
                <p
                  className="text-[15px] font-bold mb-1"
                  style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
                >
                  {s.name}
                </p>
                <p className="text-[11px] text-[#6B7280]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 가격 3티어 ── */}
      <PricingTiers
        tiers={service.pricing}
        accentColor={ACCENT}
        isKo={isKo}
        ctaHref={`/${locale}/quote`}
      />

      {/* ── 프로세스 ── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline="지금 자동화할 업무가 있나요?"
        sub="24시간 안에 견적 · 빠르면 1일 안에 결과물"
        ctaLabel="자동화 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
```

- [ ] **Step 2: 타입 체크**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: 브라우저 확인**

`http://localhost:3000/ko/services/automation-app` 접속.
- 인디고(#818CF8) 포인트 컬러 확인
- 히어로 이미지(automation-hero.png) 확인
- Before/After 4개 케이스 카드 확인
- 검정 배경 "1,095시간/년" 섹션 확인
- 기술 스택 5개 칩 확인
- 가격 3티어 (₩100,000~ / ₩800,000~ / ₩1,500,000~) 확인

- [ ] **Step 4: 최종 타입 체크 + 빌드**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && npx tsc --noEmit && echo "✅ Type check passed"
```

- [ ] **Step 5: 4단계 반응형 스크린샷 확인 (Playwright)**

각 페이지를 375·768·1024·1440px에서 스크린샷 찍어 확인:
- 허브: `/ko/services/development`
- 웹사이트: `/ko/services/website`
- 쇼핑몰: `/ko/services/shopping-mall`
- 자동화: `/ko/services/automation-app`

- [ ] **Step 6: 최종 커밋 + 푸시**

```bash
cd "C:/Users/PC/OneDrive/Desktop/개발 1/aio-make-src" && git add components/landing/automation-landing.tsx public/images/services/ docs/ && git commit -m "feat: rewrite automation landing — white agency style, indigo accent, before/after cases" && git push origin master
```
