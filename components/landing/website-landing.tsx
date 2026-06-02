"use client";

import { IdeTitlebar }        from "@/components/ide/ide-titlebar";
import { IdeTabbar }          from "@/components/ide/ide-tabbar";
import { IdeHero }            from "@/components/ide/ide-hero";
import { IdeDevice }          from "@/components/ide/ide-device";
import { IdeIndustries }      from "@/components/ide/ide-industries";
import { IdeServices }        from "@/components/ide/ide-services";
import { IdePricing }         from "@/components/ide/ide-pricing";
import { IdeProcess }         from "@/components/ide/ide-process";
import { IdeResourcesTeaser } from "@/components/ide/ide-resources-teaser";
import { IdeFaq }             from "@/components/ide/ide-faq";
import { IdeCta }             from "@/components/ide/ide-cta";
import { IdeStatusbar }       from "@/components/ide/ide-statusbar";
import Link from "next/link";

export function WebsiteLanding({ locale }: { locale: string }) {
  const tabs = [
    { num: "01", label: "services.tsx",  href: `/${locale}/services/website`,           active: true },
    { num: "02", label: "portfolio.tsx", href: `/${locale}/services/website/portfolio` },
    { num: "03", label: "resources.md",  href: `/${locale}/services/website/resources` },
  ];

  return (
    <main data-tone="ide" style={{ background: "var(--tone-ide-bg)", minHeight: "100vh" }}>
      <IdeTitlebar locale={locale} />
      <IdeTabbar tabs={tabs} />
      <IdeHero locale={locale} />
      <IdeDevice locale={locale} />
      <IdeIndustries />
      <IdeServices locale={locale} />
      <IdePricing locale={locale} />
      <IdeProcess />
      <IdeResourcesTeaser locale={locale} />
      <IdeFaq />

      {/* Portfolio teaser */}
      <section style={{ padding: "80px clamp(16px,3vw,24px) 56px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ padding: "56px clamp(20px,3vw,40px)", background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 8, position: "relative", overflow: "hidden", textAlign: "center" }}>
          {/* mint glow */}
          <span style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 100%, var(--tone-ide-mint-soft), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11.5, color: "var(--tone-ide-mint)", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 8, position: "relative" }}>
            <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
            aio open portfolio --view
          </div>
          <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.1, marginBottom: 14, color: "var(--tone-ide-fg)", position: "relative" }}>
            이미 42개.{" "}
            <span style={{ color: "var(--tone-ide-mint)" }}>결과를 보고</span> 결정하세요.
          </h2>
          <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15, color: "var(--tone-ide-fg-2)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6, position: "relative" }}>
            실제 운영 중인 사이트들. 한 작품 한 작품이 다음 의뢰의 답입니다.
          </p>
          <Link
            href={`/${locale}/services/website/portfolio`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", border: "1px solid var(--tone-ide-mint)", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, borderRadius: 6, textDecoration: "none", position: "relative" }}
          >
            $ portfolio.tsx →
          </Link>
        </div>
      </section>

      <IdeCta locale={locale} />
      <IdeStatusbar locale={locale} />
    </main>
  );
}
