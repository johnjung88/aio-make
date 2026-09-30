"use client";

import Link from "next/link";

interface Props {
  locale: string;
}

export function ConsultCta({ locale }: Props) {
  return (
    <section
      className="mx-auto text-center"
      style={{
        padding: "90px clamp(20px,3vw,24px) 70px",
        maxWidth: 1180,
        borderTop: "1px solid var(--tone-consult-line)",
        marginTop: 16,
      }}
    >
      <h2
        className="font-bold mx-auto mb-[22px]"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "clamp(34px,5.4vw,80px)",
          letterSpacing: "-0.03em",
          lineHeight: 0.96,
          color: "var(--tone-consult-ink)",
          maxWidth: 900,
        }}
      >
        <span style={{ color: "var(--tone-consult-ink-3)", fontWeight: 600 }}>발표가</span>
        <br />
        <em
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            color: "var(--tone-consult-navy)",
            fontWeight: 500,
          }}
        >
          결정
        </em>
        을 만듭니다
      </h2>

      <p
        className="mb-10 text-[13px] font-medium"
        style={{
          fontFamily: "var(--font-ibm-plex-mono)",
          color: "var(--tone-consult-ink-2)",
          letterSpacing: "0.04em",
        }}
      >
        1시간 내 응답 · 24시간 내 견적 · 1–5일 납품
      </p>

      <div className="inline-flex gap-3 flex-wrap justify-center">
        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center gap-2 px-[22px] py-[13px] text-[13px] font-semibold transition-all hover:-translate-y-0.5"
          style={{
            fontFamily: "var(--font-inter)",
            background: "var(--tone-consult-ink)",
            color: "var(--tone-consult-paper)",
            textDecoration: "none",
            letterSpacing: "-0.005em",
          }}
          
        >
          견적 시작 →
        </Link>
        <Link
          href={`/${locale}/services/ppt-design/portfolio`}
          className="inline-flex items-center gap-2 px-[22px] py-[13px] text-[13px] font-medium transition-all hover:-translate-y-0.5 hover:border-[var(--tone-consult-navy)] hover:text-[var(--tone-consult-navy)]"
          style={{
            fontFamily: "var(--font-inter)",
            background: "transparent",
            color: "var(--tone-consult-ink)",
            border: "1px solid var(--tone-consult-line-2)",
            textDecoration: "none",
            letterSpacing: "-0.005em",
          }}
        >
          포트폴리오 보기
        </Link>
      </div>

      {/* Footer links */}
      <div
        className="mt-16 pt-8 flex items-center justify-center gap-8 flex-wrap"
        style={{
          borderTop: "1px solid var(--tone-consult-line)",
          fontFamily: "var(--font-ibm-plex-mono)",
          fontSize: 11,
          color: "var(--tone-consult-ink-3)",
          letterSpacing: "0.1em",
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
