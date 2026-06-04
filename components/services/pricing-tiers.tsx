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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name.ko}
              className="border rounded-xl p-3.5 md:p-7 flex flex-col bg-white"
              style={
                tier.recommended
                  ? { borderColor: accentColor, borderWidth: 2, boxShadow: `0 8px 32px ${accentColor}22` }
                  : { borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }
              }
            >
              {/* 배지 — 추천 카드만 표시 */}
              {tier.recommended && (
                <div className="mb-2 md:mb-4">
                  <span
                    className="inline-block text-[10px] font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: accentColor }}
                  >
                    {isKo ? "추천" : "Recommended"}
                  </span>
                </div>
              )}
              <div className="text-[12px] md:text-[13px] font-semibold text-[#6B7280] mb-1 md:mb-2">
                {isKo ? tier.name.ko : tier.name.en}
              </div>
              <div
                className="font-bold text-[#111] leading-none mb-1"
                style={{ fontSize: "clamp(22px,3.5vw,36px)", fontFamily: "var(--font-jetbrains)" }}
              >
                {tier.eventPrice.replace(/₩/g, "")}
              </div>
              <div className="text-[10px] md:text-[11px] text-[#9CA3AF] mb-1">
                {isKo ? "정가" : "Regular"} {tier.regularPrice.replace(/₩/g, "")}
              </div>
              <div className="text-[11px] md:text-[12px] text-[#6B7280] mb-3 pb-3 md:mb-5 md:pb-5 border-b border-[#F3F4F6]">
                {isKo ? "납기" : "Delivery"} {tier.duration}
              </div>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-0 md:space-y-2.5 flex-1">
                {tier.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] md:text-[13px] text-[#374151]">
                    <span
                      className="mt-0.5 text-[9px] md:text-[10px] font-bold flex-shrink-0"
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
                className="mt-3 md:mt-6 block text-center py-2.5 md:py-3 rounded-lg text-[12px] md:text-[13px] font-semibold transition-all hover:-translate-y-0.5"
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
