"use client";

import Link from "next/link";

interface Props {
  locale: string;
}

export function LifestyleCta({ locale }: Props) {
  return (
    <section
      className="mx-auto text-center"
      style={{
        padding: "80px clamp(20px,3vw,24px) 60px",
        maxWidth: 1100,
        borderTop: "1px solid var(--tone-life-line)",
      }}
    >
      {/* Ornament */}
      <div
        className="mx-auto mb-8 w-10 h-10"
        style={{ color: "var(--tone-life-rose)" }}
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <g fill="currentColor">
            <path d="M50 0 L54 46 L100 50 L54 54 L50 100 L46 54 L0 50 L46 46 Z" opacity="0.85" />
            <circle cx="50" cy="50" r="3" />
          </g>
        </svg>
      </div>

      <h2
        className="font-medium mx-auto mb-5"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(36px,5.4vw,72px)",
          letterSpacing: "-0.025em",
          lineHeight: 0.96,
          color: "var(--tone-life-ink)",
          maxWidth: 800,
        }}
      >
        스크롤 한 번에{" "}
        <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>결제 버튼</em>까지
      </h2>

      <p
        className="mx-auto mb-10"
        style={{
          fontFamily: "var(--font-pretendard)",
          fontSize: 17,
          color: "var(--tone-life-ink-2)",
          lineHeight: 1.6,
          maxWidth: 520,
        }}
      >
        1시간 내 응답 · 24시간 내 견적 · 1–3일 납품
      </p>

      <div className="inline-flex gap-3 flex-wrap justify-center">
        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center gap-2 px-8 py-[14px] text-[14px] font-semibold rounded-full transition-all hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-jakarta)",
            background: "var(--tone-life-ink)",
            color: "var(--tone-life-cream)",
            textDecoration: "none",
          }}
        >
          견적 시작 →
        </Link>
        <Link
          href={`/${locale}/services/detail-page/portfolio`}
          className="inline-flex items-center gap-2 px-8 py-[14px] text-[14px] font-medium rounded-full transition-all hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-jakarta)",
            background: "transparent",
            color: "var(--tone-life-ink)",
            border: "1.5px solid var(--tone-life-line-2)",
            textDecoration: "none",
          }}
        >
          포트폴리오 보기
        </Link>
      </div>

      {/* Footer */}
      <div
        className="mt-16 pt-8 flex items-center justify-center gap-8 flex-wrap"
        style={{
          borderTop: "1px solid var(--tone-life-line)",
          fontFamily: "var(--font-jetbrains)",
          fontSize: 11,
          color: "var(--tone-life-ink-3)",
          letterSpacing: "0.06em",
        }}
      >
        <Link href={`/${locale}`} style={{ color: "inherit", textDecoration: "none" }}>HOME</Link>
        <span>·</span>
        <Link href={`/${locale}/services`} style={{ color: "inherit", textDecoration: "none" }}>SERVICES</Link>
        <span>·</span>
        <Link href={`/${locale}/quote`} style={{ color: "inherit", textDecoration: "none" }}>QUOTE</Link>
        <span>·</span>
        <span>AIO STUDIO © 2026</span>
      </div>
    </section>
  );
}
