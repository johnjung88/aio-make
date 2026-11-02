"use client";

import Link from "next/link";

interface Props {
  locale: string;
}

export function LifestyleNav({ locale }: Props) {
  return (
    <nav
      className="sticky top-0 z-50 grid items-center gap-5"
      style={{
        background: "rgba(250,245,238,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--tone-life-line)",
        padding: "14px 32px",
        gridTemplateColumns: "1fr auto 1fr",
      }}
    >
      {/* Left — live indicator */}
      <div
        className="hidden sm:flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase"
        style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-life-ink-2)" }}
      >
        <span
          className="w-[6px] h-[6px] rounded-full animate-[pulse_2.4s_ease-in-out_infinite]"
          style={{ background: "var(--tone-life-rose)" }}
        />
        상세페이지 · live
      </div>

      {/* Center — logo */}
      <Link
        href={`/${locale}`}
        className="text-center"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: 20,
          fontWeight: 500,
          color: "var(--tone-life-ink)",
          textDecoration: "none",
          letterSpacing: "-0.005em",
        }}
      >
        AIO <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>Studio</em>
        <span
          className="ml-1 text-[11px] tracking-[0.16em] align-middle"
          style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-life-ink-3)" }}
        >
          · 상세
        </span>
      </Link>

      {/* Right — CTA */}
      <div className="flex justify-end items-center gap-3">
        <Link
          href={`/${locale}/services/detail-page/portfolio`}
          className="hidden sm:inline-block text-[12.5px] font-medium transition-colors"
          style={{
            fontFamily: "var(--font-jakarta)",
            color: "var(--tone-life-ink)",
            textDecoration: "none",
          }}
        >
          포트폴리오
        </Link>
        <Link
          href={`/${locale}/quote`}
          className="px-[18px] py-2 text-[12.5px] font-semibold rounded-full transition-all"
          style={{
            fontFamily: "var(--font-jakarta)",
            background: "var(--tone-life-ink)",
            color: "var(--tone-life-cream)",
            textDecoration: "none",
          }}
        >
          견적 문의
        </Link>
      </div>
    </nav>
  );
}
