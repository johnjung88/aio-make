"use client";

import Link from "next/link";

interface Props {
  locale: string;
}

export function ConsultNav({ locale }: Props) {
  return (
    <nav
      className="sticky top-0 z-50 grid items-center gap-5"
      style={{
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(10px)",
        borderBottom: "2px solid var(--tone-consult-ink)",
        padding: "14px clamp(16px, 3vw, 32px)",
        gridTemplateColumns: "1fr auto 1fr",
      }}
    >
      {/* Left */}
      <div
        className="hidden sm:flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-ink-2)" }}
      >
        PPT · Design ·{" "}
        <span style={{ color: "var(--tone-consult-gold)", fontWeight: 600 }}>
          AIO Studio
        </span>
      </div>

      {/* Center */}
      <Link
        href={`/${locale}`}
        className="text-center"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "clamp(15px, 1.8vw, 18px)",
          fontWeight: 700,
          color: "var(--tone-consult-ink)",
          textDecoration: "none",
          letterSpacing: "-0.012em",
        }}
      >
        AIO{" "}
        <em
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            color: "var(--tone-consult-navy)",
            fontWeight: 500,
          }}
        >
          Studio
        </em>
        <span
          className="ml-2 text-[11px] tracking-[0.16em] align-middle font-normal"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-ink-3)" }}
        >
          · PPT
        </span>
      </Link>

      {/* Right */}
      <div className="flex justify-end items-center gap-[14px]">
        <Link
          href={`/${locale}/services/ppt-design/portfolio`}
          className="hidden sm:inline-block text-[12.5px] font-medium transition-colors hover:!text-[var(--tone-consult-navy)]"
          style={{
            fontFamily: "var(--font-inter)",
            color: "var(--tone-consult-ink)",
            textDecoration: "none",
            letterSpacing: "-0.005em",
          }}
        >
          포트폴리오
        </Link>
        <Link
          href={`/${locale}/quote`}
          className="px-[18px] py-[9px] text-[12.5px] font-semibold transition-all hover:!bg-[var(--tone-consult-navy)]"
          style={{
            fontFamily: "var(--font-inter)",
            background: "var(--tone-consult-ink)",
            color: "var(--tone-consult-paper)",
            textDecoration: "none",
            letterSpacing: "-0.005em",
            borderRadius: 0,
          }}
        >
          견적 문의
        </Link>
      </div>
    </nav>
  );
}
