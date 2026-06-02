# 웹사이트 에이전시 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `website-landing.tsx`를 다크 히어로 + CSS 사실적 디바이스 목업 쇼케이스 + SVG 아이콘 업종 섹션으로 완전 재작성해 웹 에이전시 느낌으로 업그레이드한다.

**Architecture:** `website-landing.tsx` 단일 파일 완전 재작성. `MacbookMockup`·`PhoneMockup`·`ScreenContent` 를 파일 내부 함수로 정의. 기존 TrustNumbers·PricingTiers·ProcessSteps·ServiceCta 공유 컴포넌트는 그대로 import. AioNav는 이미 `level="leaf" sub="website"`로 수정됨.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4 (inline style 위주), lucide-react (Stethoscope·Scale·GraduationCap·ShoppingBag·UtensilsCrossed·Scissors·Building2·Rocket), next/image (fill + unoptimized, onError fallback)

---

## 파일 맵

| 작업 | 파일 경로 | 방식 |
|---|---|---|
| Task 1 | `components/landing/website-landing.tsx` | 전체 재작성 |
| Task 2 | 빌드 + 배포 | 검증 |

---

## Task 1: website-landing.tsx 완전 재작성

**Files:**
- Modify: `components/landing/website-landing.tsx` (전체 교체)

- [ ] **Step 1: 현재 파일 읽기 (필수)**

```bash
cat components/landing/website-landing.tsx | head -5
```
읽었으면 Step 2로.

- [ ] **Step 2: 파일 전체 교체**

`components/landing/website-landing.tsx` 의 전체 내용을 아래로 교체:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Stethoscope, Scale, GraduationCap, ShoppingBag,
  UtensilsCrossed, Scissors, Building2, Rocket,
} from "lucide-react";
import { AioNav, AioFooter } from "./aio-nav";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#4DD4AC";
const DARK = "#0D1117";

const service = servicesData.find((s) => s.id === "website")!;

const TRUST = [
  { value: "142", label: "누적 의뢰",  sub: "기업·개인 포함" },
  { value: "98%", label: "재의뢰율",   sub: "142명 중 139명 재의뢰" },
  { value: "23분", label: "평균 응답", sub: "영업일 기준" },
  { value: "14일", label: "기본 A/S",  sub: "납품 후 무상" },
];

const SHOWCASE = [
  { id: "all",     label: "전체",      domain: "aio-make.com",       name: "AIO 스튜디오",       kpi: "누적 142개 프로젝트", gradient: "linear-gradient(135deg,#1a3a4a 0%,#2d5e6f 50%,#4DD4AC 100%)" },
  { id: "medical", label: "병원·의료", domain: "jaeheon-clinic.com",  name: "자연한의원",          kpi: "예약 +120%",          gradient: "linear-gradient(135deg,#0f2a3a 0%,#1a4a6a 50%,#2d8aaf 100%)" },
  { id: "legal",   label: "법률·세무", domain: "seoul-legal.kr",      name: "서울법무사사무소",    kpi: "상담문의 +85%",       gradient: "linear-gradient(135deg,#1a1f0a 0%,#2a3a14 50%,#4a6a28 100%)" },
  { id: "shop",    label: "쇼핑몰",    domain: "chefmeal.co.kr",      name: "셰프밀 식품몰",      kpi: "매출 +28%",           gradient: "linear-gradient(135deg,#2a1f0a 0%,#5a3a14 50%,#8a6228 100%)" },
  { id: "startup", label: "스타트업",  domain: "v-aio.app",           name: "V-AIO 서비스",       kpi: "전환율 +52%",         gradient: "linear-gradient(135deg,#0a1a2a 0%,#1a2a4a 50%,#2a4a8a 100%)" },
];

type ShowcaseItem = (typeof SHOWCASE)[number];

const INDUSTRIES = [
  { Icon: Stethoscope,    title: "병원·의료",       desc: "의원·한의원·치과·성형외과. 예약·진료 안내·의료광고법 대응." },
  { Icon: Scale,          title: "법률·세무",       desc: "변호사·법무사·세무사. 상담 유도와 전문성 강조에 최적화." },
  { Icon: GraduationCap,  title: "교육·학원",       desc: "학원·과외·온라인 강의. 강사·시간표·수강 신청 시스템." },
  { Icon: ShoppingBag,    title: "쇼핑몰·D2C",     desc: "카페24·자사몰. 상품성과 구매 동선 최적화." },
  { Icon: UtensilsCrossed, title: "F&B·카페",      desc: "음식점·카페·베이커리. 메뉴·매장·주문 흐름." },
  { Icon: Scissors,       title: "뷰티·미용",       desc: "미용실·네일·피부관리. 시술 메뉴·예약·후기." },
  { Icon: Building2,      title: "부동산",          desc: "중개·분양·임대. 매물 리스트·지도·문의." },
  { Icon: Rocket,         title: "스타트업·서비스",  desc: "빠른 런칭과 전환율 중심의 서비스 랜딩페이지." },
];

// ─── 이미지 없으면 그라디언트, 있으면 이미지 자동 표시 ───────────────────────
function ScreenContent({ item, device }: { item: ShowcaseItem; device: "desktop" | "mobile" }) {
  const [err, setErr] = useState(false);
  const src = `/images/portfolio/ws-${item.id}-${device}.jpg`;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: item.gradient }}>
      {!err && (
        <Image
          key={src}
          src={src}
          alt={item.name}
          fill
          unoptimized
          style={{ objectFit: "cover", objectPosition: "top center" }}
          onError={() => setErr(true)}
        />
      )}
    </div>
  );
}

// ─── MacBook 사실적 CSS 프레임 ────────────────────────────────────────────────
function MacbookMockup({ item }: { item: ShowcaseItem }) {
  return (
    <div style={{ position: "relative", width: "76%", maxWidth: 860, flexShrink: 0 }}>
      <div style={{ filter: "drop-shadow(0 50px 100px rgba(0,0,0,0.80)) drop-shadow(0 20px 40px rgba(0,0,0,0.45))" }}>
        {/* Lid */}
        <div style={{
          background: "linear-gradient(170deg,#464a50 0%,#38393d 50%,#2d2f33 100%)",
          borderRadius: "14px 14px 0 0",
          padding: "10px 10px 24px",
          position: "relative",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08),inset 0 -1px 0 rgba(0,0,0,0.25),0 0 0 1px #1c1e22",
        }}>
          {/* Camera notch */}
          <div style={{
            position: "absolute", top: 5, left: "50%", transform: "translateX(-50%)",
            width: 70, height: 10, background: "#1c1e22", borderRadius: "0 0 6px 6px", zIndex: 2,
          }} />
          {/* Screen bezel */}
          <div style={{ background: "#080808", borderRadius: 5, overflow: "hidden", position: "relative", aspectRatio: "16/10" }}>
            {/* Browser chrome */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
              background: "#1d1d1d", borderBottom: "1px solid #2e2e2e",
              display: "flex", alignItems: "center", gap: 8, padding: "0 12px", height: 32,
            }}>
              {(["#FF5F57","#FEBC2E","#28C840"] as const).map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, flexShrink: 0 }} />
              ))}
              <div style={{
                flex: 1, maxWidth: 260, margin: "0 auto",
                background: "#2a2a2a", borderRadius: 4, padding: "2px 10px",
                fontFamily: "var(--font-jetbrains,monospace)", fontSize: 10,
                color: "rgba(255,255,255,0.4)", textAlign: "center",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                🔒 {item.domain}
              </div>
            </div>
            {/* Screenshot */}
            <div style={{ position: "absolute", inset: 0, top: 32 }}>
              <ScreenContent item={item} device="desktop" />
            </div>
          </div>
        </div>
        {/* Hinge */}
        <div style={{ height: 3, background: "#1c1e22", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)" }} />
        {/* Base */}
        <div style={{
          background: "linear-gradient(180deg,#3c3f45 0%,#464a50 70%,#3c3f45 100%)",
          height: 18, borderRadius: "0 0 5px 5px",
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.5),0 1px 0 rgba(255,255,255,0.03)",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
            width: 90, height: 2, background: "rgba(0,0,0,0.35)", borderRadius: 1,
          }} />
        </div>
      </div>
    </div>
  );
}

// ─── iPhone 사실적 CSS 프레임 ────────────────────────────────────────────────
function PhoneMockup({ item }: { item: ShowcaseItem }) {
  return (
    <div style={{
      position: "absolute", bottom: "-10%", right: "3%",
      width: "22%", maxWidth: 190,
      transform: "rotate(3deg)",
      filter: "drop-shadow(0 28px 56px rgba(0,0,0,0.9))",
      zIndex: 10,
    }}>
      <div style={{
        background: "linear-gradient(160deg,#2b2c30 0%,#1a1b1e 100%)",
        borderRadius: 40, padding: "7px 5px",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09),inset 1px 0 0 rgba(255,255,255,0.05)",
        position: "relative",
      }}>
        {/* Side buttons */}
        <div style={{ position: "absolute", right: -2.5, top: "25%", width: 2.5, height: 36, background: "#2b2c30", borderRadius: "0 2px 2px 0" }} />
        <div style={{ position: "absolute", left: -2.5, top: "20%", width: 2.5, height: 22, background: "#2b2c30", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -2.5, top: "31%", width: 2.5, height: 34, background: "#2b2c30", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -2.5, top: "43%", width: 2.5, height: 34, background: "#2b2c30", borderRadius: "2px 0 0 2px" }} />
        {/* Screen */}
        <div style={{ background: "#000", borderRadius: 33, overflow: "hidden", position: "relative", aspectRatio: "9/19.5" }}>
          {/* Dynamic Island */}
          <div style={{
            position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
            width: 82, height: 24, background: "#000", borderRadius: 12, zIndex: 3,
            boxShadow: "0 0 0 1.5px #1a1b1e",
          }} />
          <ScreenContent item={item} device="mobile" />
        </div>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export function WebsiteLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";
  const [activeId, setActiveId] = useState("all");
  const activeItem = SHOWCASE.find((s) => s.id === activeId) ?? SHOWCASE[0];

  return (
    <div style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="leaf" sub="website" cat="development" active="service" />

      {/* ── DARK HERO ────────────────────────────────────────────────────── */}
      <section style={{
        background: DARK, minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "clamp(80px,12vw,140px) clamp(16px,5vw,48px) clamp(60px,8vw,100px)",
        position: "relative",
      }}>
        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 50% at 50% 30%,rgba(77,212,172,0.07) 0%,transparent 70%)",
        }} />
        {/* Eyebrow */}
        <p style={{
          fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
          letterSpacing: "0.30em", textTransform: "uppercase",
          color: ACCENT, marginBottom: 24, position: "relative",
        }}>
          WEBSITE · 웹사이트 제작
        </p>
        {/* H1 */}
        <h1 style={{
          fontSize: "clamp(44px,7vw,96px)", fontWeight: 700,
          letterSpacing: "-0.03em", lineHeight: 0.98,
          color: "#F0F6FC", marginBottom: 28, maxWidth: 900, position: "relative",
        }}>
          스크롤을 멈추게<br />
          만드는 <span style={{ color: ACCENT }}>홈페이지</span>
        </h1>
        {/* Sub */}
        <p style={{
          fontSize: "clamp(15px,1.3vw,18px)", color: "rgba(240,246,252,0.58)",
          lineHeight: 1.8, maxWidth: 540, marginBottom: 36, position: "relative",
        }}>
          랜딩페이지·회사 홈페이지·서비스 사이트.<br />
          운영 가능한 완성품을 5일 이내 납품합니다.
        </p>
        {/* Badges */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 40, position: "relative" }}>
          {["5일 납품","14일 A/S","SEO 세팅 포함"].map((b) => (
            <span key={b} style={{
              fontSize: 11, fontWeight: 600, padding: "6px 14px",
              border: `1px solid ${ACCENT}`, color: ACCENT,
              borderRadius: 999, letterSpacing: "0.04em",
            }}>
              {b}
            </span>
          ))}
        </div>
        {/* CTA */}
        <Link href={`/${locale}/quote`} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "14px 28px", background: ACCENT, color: "#0D1117",
          borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none",
          position: "relative",
        }}>
          웹사이트 제작 문의 →
        </Link>
      </section>

      {/* ── MOCKUP SHOWCASE ──────────────────────────────────────────────── */}
      <section style={{ background: DARK, padding: "0 clamp(16px,5vw,48px) 100px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          {/* Heading */}
          <div style={{ textAlign: "center", marginBottom: 40, paddingTop: 0 }}>
            <h2 style={{
              fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 700,
              letterSpacing: "-0.025em", color: "#F0F6FC", marginBottom: 12,
            }}>
              결과를 먼저 보고 결정하세요
            </h2>
            <p style={{ fontSize: 15, color: "rgba(240,246,252,0.55)", lineHeight: 1.7 }}>
              데모가 아닙니다. 실제 운영 중인 사이트입니다.
            </p>
          </div>
          {/* Filter chips */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            {SHOWCASE.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                style={{
                  padding: "8px 18px", borderRadius: 999,
                  border: "1px solid",
                  borderColor: activeId === s.id ? ACCENT : "rgba(240,246,252,0.20)",
                  background: activeId === s.id ? ACCENT : "transparent",
                  color: activeId === s.id ? "#0D1117" : "rgba(240,246,252,0.65)",
                  fontSize: 13, fontWeight: activeId === s.id ? 700 : 400,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Device mockup area */}
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", paddingBottom: 60, maxWidth: 960, margin: "0 auto" }}>
            <MacbookMockup item={activeItem} />
            <PhoneMockup item={activeItem} />
          </div>
          {/* Caption */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <p style={{ fontFamily: "var(--font-jetbrains,monospace)", fontSize: 12, color: ACCENT, marginBottom: 4 }}>
              {activeItem.domain}
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#F0F6FC", marginBottom: 4 }}>
              {activeItem.name}
            </p>
            <p style={{ fontSize: 13, color: "rgba(240,246,252,0.55)" }}>{activeItem.kpi}</p>
          </div>
          {/* Portfolio link */}
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link href={`/${locale}/services/website/portfolio`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 22px",
              border: `1px solid ${ACCENT}`, color: ACCENT,
              borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
            }}>
              전체 포트폴리오 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST NUMBERS ────────────────────────────────────────────────── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── INDUSTRIES ───────────────────────────────────────────────────── */}
      <section style={{ background: "#fff", padding: "clamp(60px,8vw,96px) clamp(16px,5vw,48px)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{
              fontFamily: "var(--font-jetbrains,monospace)", fontSize: 11,
              fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase",
              color: ACCENT, marginBottom: 12,
            }}>
              Industries
            </p>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>
              업종별 전문 제작
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {INDUSTRIES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: "#fff", border: "1px solid #E5E7EB",
                  borderRadius: 16, padding: "24px 20px",
                  transition: "border-color 0.2s,transform 0.2s,box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ACCENT;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px ${ACCENT}1a`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: 40, height: 40, background: `${ACCENT}1a`, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                }}>
                  <Icon size={18} color={ACCENT} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <PricingTiers tiers={service.pricing} accentColor={ACCENT} isKo={isKo} ctaHref={`/${locale}/quote`} />

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
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

- [ ] **Step 3: 빌드 확인**

```bash
cd "C:\Users\PC\OneDrive\Desktop\개발 1\aio-make-src"
npm run build 2>&1 | grep -E "Error|error TS|✓|Failed" | head -20
```

Expected: `✓ Compiled successfully` 또는 오류 없음.

빌드 오류 발생 시 대처:
- `Type error: Property 'onError' does not exist` → `next/image`가 `onError`를 지원하지 않는 버전이면 `<img>` 태그로 대체
- `Cannot find module 'lucide-react'` → `npm install lucide-react`
- `Module not found: @/components/services/...` → 해당 컴포넌트 경로 확인

- [ ] **Step 4: Commit**

```bash
git add components/landing/website-landing.tsx
git commit -m "feat: website-landing 에이전시 리디자인 — 다크 히어로 + 디바이스 목업 쇼케이스"
```

---

## Task 2: 최종 검증 + 배포

**Files:**
- 없음 (push만)

- [ ] **Step 1: 빌드 최종 확인**

```bash
npm run build 2>&1 | tail -10
```

Expected: 0 errors, 167 pages generated.

- [ ] **Step 2: TypeScript 확인**

```bash
npx tsc --noEmit 2>&1 | head -10
```

Expected: 출력 없음.

- [ ] **Step 3: push**

```bash
git push origin master
```

---

## 이미지 준비 안내 (내일 작업)

아래 경로에 스크린샷을 추가하면 목업에 자동으로 표시됩니다:

```
public/images/portfolio/
  ws-all-desktop.jpg        1280×800   (필터 "전체")
  ws-all-mobile.jpg          390×844
  ws-medical-desktop.jpg    1280×800   (병원·의료)
  ws-medical-mobile.jpg      390×844
  ws-legal-desktop.jpg      1280×800   (법률·세무)
  ws-legal-mobile.jpg        390×844
  ws-shop-desktop.jpg       1280×800   (쇼핑몰)
  ws-shop-mobile.jpg         390×844
  ws-startup-desktop.jpg    1280×800   (스타트업)
  ws-startup-mobile.jpg      390×844
```

이미지가 없으면 그라디언트 플레이스홀더가 보임 → 이미지 파일을 추가하고 push하면 즉시 반영.
