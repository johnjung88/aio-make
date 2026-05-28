"use client";
import Link from "next/link";

interface Props {
  locale: string;
}

const CTA_BASE_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-pretendard)",
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: "-0.01em",
  border: "1px solid var(--tone-magazine-ink)",
};

export function MagazineEditorial({ locale }: Props) {
  return (
    <section
      className="max-w-[1500px] mx-auto text-center relative"
      style={{
        padding: "var(--space-section) var(--space-edge)",
        borderTop: "1px solid var(--tone-magazine-ink)",
      }}
    >
      {/* Meta — 모바일/PC 별도 마크업 */}
      <div
        className="pb-4 mb-10 md:mb-16 border-b mx-auto"
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 11,
          color: "var(--tone-magazine-ink-2)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          borderColor: "var(--tone-magazine-line-2)",
          maxWidth: 720,
        }}
      >
        {/* PC: 한 줄 */}
        <div className="hidden md:inline-flex items-center justify-center gap-[18px]">
          <span>Editorial · Founder&apos;s note</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)" }} />
          <span style={{ fontFamily: "var(--font-marcellus)", letterSpacing: "0.4em", color: "var(--tone-magazine-ink)", fontSize: 12 }}>
            A&nbsp;·&nbsp;I&nbsp;·&nbsp;O&nbsp;&nbsp; S T U D I O
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)" }} />
          <span>May 2026</span>
        </div>

        {/* Mobile: 2줄 */}
        <div className="md:hidden flex flex-col items-center gap-1.5">
          <span style={{ fontFamily: "var(--font-marcellus)", letterSpacing: "0.4em", color: "var(--tone-magazine-ink)", fontSize: 12 }}>
            A&nbsp;·&nbsp;I&nbsp;·&nbsp;O&nbsp;&nbsp; S T U D I O
          </span>
          <div className="inline-flex items-center gap-2.5">
            <span>Editorial · Founder&apos;s note</span>
            <span style={{ width: 2.5, height: 2.5, borderRadius: "50%", background: "var(--tone-magazine-ink-3)" }} />
            <span>May 2026</span>
          </div>
        </div>
      </div>

      {/* Ornament */}
      <div
        className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-7 md:mb-9 text-[var(--tone-magazine-red)] animate-orn-spin-reverse"
      >
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <g fill="currentColor">
            <path d="M50 0 L54 46 L100 50 L54 54 L50 100 L46 54 L0 50 L46 46 Z" opacity="0.85" />
            <circle cx="50" cy="50" r="3" />
          </g>
        </svg>
      </div>

      {/* Headline — Display 토큰 */}
      <h2
        className="font-normal mx-auto mb-10 md:mb-12 max-w-[1200px]"
        style={{
          fontFamily: "var(--font-marcellus)",
          fontSize: "var(--text-display)",
          lineHeight: "var(--leading-display)",
          letterSpacing: "-0.018em",
          color: "var(--tone-magazine-ink)",
        }}
      >
        <span>결과를 보고</span>
        <br />
        <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "normal", color: "var(--tone-magazine-red)", fontWeight: 500 }}>
          맡기는
        </em>{" "}
        외주
      </h2>

      {/* Body */}
      <div className="max-w-[720px] mx-auto mb-16">
        <p
          className="mb-[18px]"
          style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-magazine-ink-2)", fontWeight: 400 }}
        >
          AIO는{" "}
          <strong style={{ color: "var(--tone-magazine-ink)", fontWeight: 600 }}>각 분야 전문가</strong>가 직접 손을 대는 외주 스튜디오입니다
          <br />
          의뢰가 들어오면, 그 분야의 전문가가 처음부터 끝까지 책임집니다
        </p>
        <p
          style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-magazine-ink-2)", fontWeight: 400 }}
        >
          매주 새 작품이 더해지고, 그게 다음 의뢰인의 결정을 돕습니다
          <br />
          결과물을 먼저 보고, 가격을 확인하고,{" "}
          <strong style={{ color: "var(--tone-magazine-ink)", fontWeight: 600 }}>그 다음에 맡기세요</strong>
        </p>
      </div>

      {/* CTAs */}
      <div className="inline-flex gap-[14px] flex-wrap justify-center">
        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center gap-[10px] px-8 py-4 transition-all hover:-translate-y-0.5 hover:bg-[var(--tone-magazine-red)] hover:border-[var(--tone-magazine-red)]"
          style={{
            ...CTA_BASE_STYLE,
            background: "var(--tone-magazine-ink)",
            color: "var(--tone-magazine-paper)",
          }}
        >
          견적 문의 →
        </Link>
        <Link
          href="#toc"
          className="inline-flex items-center gap-[10px] px-8 py-4 transition-all hover:-translate-y-0.5 hover:bg-[var(--tone-magazine-ink)] hover:text-[var(--tone-magazine-paper)]"
          style={{
            ...CTA_BASE_STYLE,
            background: "transparent",
            color: "var(--tone-magazine-ink)",
          }}
        >
          분야별 전문가 보기
        </Link>
      </div>
    </section>
  );
}
