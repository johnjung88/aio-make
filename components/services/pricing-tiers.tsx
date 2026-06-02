"use client";

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
