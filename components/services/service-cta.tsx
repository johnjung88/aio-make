"use client";

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
