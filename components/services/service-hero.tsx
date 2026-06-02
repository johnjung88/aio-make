"use client";
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
                {badges.map((b, i) => (
                  <span
                    key={`${b}-${i}`}
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
