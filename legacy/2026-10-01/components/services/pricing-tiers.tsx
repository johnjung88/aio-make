"use client";

import Link from "next/link";
import type { PricingTier } from "@/lib/services-data";

interface Props {
  tiers: PricingTier[];
  accentColor: string;
  isKo: boolean;
  ctaHref: string;
  sectionBg?: string;
}

export function PricingTiers({ tiers, accentColor, isKo, ctaHref, sectionBg }: Props) {
  const regularTiers = tiers.filter((t) => !t.enterprise);
  const enterpriseTiers = tiers.filter((t) => t.enterprise);

  return (
    <section style={{ background: sectionBg ?? "#F8FAF9" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-6 md:py-20">
        <div className="text-center mb-4 md:mb-12">
          <p
            className="text-[10px] md:text-[11px] font-semibold tracking-[0.22em] uppercase mb-2"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Pricing
          </p>
          <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(18px,3.5vw,38px)" }}>
            {isKo ? "투명한 가격" : "Transparent Pricing"}
          </h2>
        </div>

        {/* 일반 티어 그리드 — 모바일 2열, 데스크탑 3열 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-5">
          {regularTiers.map((tier) => (
            <div
              key={tier.name.ko}
              className="border rounded-xl p-3 sm:p-4 md:p-6 flex flex-col bg-white"
              style={
                tier.recommended
                  ? { borderColor: accentColor, borderWidth: 2, boxShadow: `0 4px 20px ${accentColor}28` }
                  : { borderColor: "#E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }
              }
            >
              {/* 추천 배지 — 모든 카드 공간 확보, 비추천은 invisible */}
              <div className="mb-1.5">
                <span
                  className={`inline-block text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${tier.recommended ? "" : "invisible"}`}
                  style={{ background: accentColor }}
                >
                  {isKo ? "추천" : "Recommended"}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] md:text-[13px] font-semibold text-[#6B7280] mb-1.5 leading-snug" style={{ wordBreak: "keep-all" }}>
                {isKo ? tier.name.ko : tier.name.en}
              </div>
              <div
                className="font-bold text-[#111] leading-none mb-1"
                style={{ fontSize: "clamp(15px,2.8vw,30px)", fontFamily: "var(--font-jetbrains)" }}
              >
                {tier.eventPrice.replace(/₩/g, "")}
              </div>
              <div className="text-[9px] md:text-[11px] text-[#9CA3AF] mb-1">
                {isKo ? "정가" : "Regular"} {tier.regularPrice.replace(/₩/g, "")}
              </div>
              <div className="text-[10px] md:text-[12px] text-[#6B7280] mb-2 pb-2 md:mb-4 md:pb-4 border-b border-[#F3F4F6]">
                {isKo ? "납기" : "Delivery"} {tier.duration}
              </div>
              <ul className="space-y-1 flex-1">
                {tier.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-1 text-[10px] sm:text-[11px] md:text-[13px] text-[#374151]" style={{ wordBreak: "keep-all" }}>
                    <span
                      className="mt-0.5 text-[8px] md:text-[10px] font-bold flex-shrink-0"
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
                className="mt-2 md:mt-5 block text-center py-1.5 md:py-2.5 rounded-lg text-[10px] sm:text-[11px] md:text-[13px] font-semibold transition-all hover:-translate-y-0.5"
                style={
                  tier.recommended
                    ? { background: accentColor, color: "#fff" }
                    : { background: "#F9FAFB", color: "#111", border: "1px solid #E5E7EB" }
                }
              >
                {isKo ? "문의 →" : "Inquire →"}
              </Link>
            </div>
          ))}
        </div>

        {/* 엔터프라이즈 티어 — 전체폭 가로 카드 */}
        {enterpriseTiers.map((tier) => (
          <div
            key={tier.name.ko}
            className="mt-4 md:mt-6 rounded-2xl p-5 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-10"
            style={{
              background: `linear-gradient(135deg, #0D1117 0%, #1a1f2e 100%)`,
              border: `1px solid ${accentColor}44`,
              boxShadow: `0 8px 40px rgba(0,0,0,0.25)`,
            }}
          >
            {/* 왼쪽: 이름·가격·납기 */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
                >
                  {isKo ? "기업·고급형" : "Enterprise"}
                </span>
              </div>
              <div
                className="font-bold text-white leading-tight mb-1"
                style={{ fontSize: "clamp(15px,1.4vw,18px)" }}
              >
                {isKo ? tier.name.ko : tier.name.en}
              </div>
              <div
                className="font-bold leading-none mb-1"
                style={{ fontSize: "clamp(26px,3.5vw,40px)", fontFamily: "var(--font-jetbrains)", color: accentColor }}
              >
                {tier.eventPrice.replace(/₩/g, "")}
              </div>
              <div className="text-[11px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {isKo ? "정가" : "Regular"} {tier.regularPrice.replace(/₩/g, "")}
              </div>
              <div className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                {isKo ? "납기" : "Delivery"} {tier.duration}
              </div>
            </div>

            {/* 구분선 */}
            <div
              className="hidden md:block w-px self-stretch"
              style={{ background: `${accentColor}22` }}
            />

            {/* 가운데: 포함 항목 */}
            <ul className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
              {tier.includes.map((inc, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] md:text-[13px]" style={{ color: "rgba(240,246,252,0.75)" }}>
                  <span className="mt-0.5 text-[10px] font-bold flex-shrink-0" style={{ color: accentColor }}>✓</span>
                  {isKo ? inc.ko : inc.en}
                </li>
              ))}
            </ul>

            {/* 오른쪽: CTA */}
            <div className="flex-shrink-0">
              <Link
                href={ctaHref}
                className="block text-center px-6 py-3 rounded-xl text-[13px] font-bold transition-all hover:-translate-y-0.5 whitespace-nowrap"
                style={{ background: accentColor, color: "#0D1117" }}
              >
                {isKo ? "별도 견적 문의 →" : "Request Custom Quote →"}
              </Link>
              <p className="text-[11px] text-center mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                {isKo ? "고급/기업형은 별도 견적" : "Custom pricing for enterprise"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
