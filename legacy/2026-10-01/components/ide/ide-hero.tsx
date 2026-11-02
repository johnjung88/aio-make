"use client";

import Link from "next/link";

interface Props {
  locale: string;
}

const stats = [
  { key: "response_time", val: "1", unit: "h", comment: "// 평균 23분" },
  { key: "delivery_avg", val: "5", unit: "d", comment: "// 평균 4.6일" },
  { key: "portfolio_count", val: "42", unit: "", comment: "// 누적 작업" },
  { key: "client_rating", val: "4.9", unit: "/5", comment: "// 의뢰인 평점" },
  { key: "warranty", val: "1", unit: "개월", comment: "// 무상 A/S" },
];

export function IdeHero({ locale }: Props) {
  return (
    <section
      className="text-center mx-auto"
      style={{
        padding: "clamp(64px,8vw,96px) clamp(16px,3vw,24px) 80px",
        maxWidth: 1280,
      }}
    >
      {/* Terminal prompt */}
      <div
        className="inline-flex items-center gap-2 mb-9 px-4 py-[9px] text-xs"
        style={{
          fontFamily: "var(--font-jetbrains)",
          background: "var(--tone-ide-bg-2)",
          border: "1px solid var(--tone-ide-line)",
          borderRadius: 6,
          color: "var(--tone-ide-fg-2)",
        }}
      >
        <span style={{ color: "var(--tone-ide-mint)", fontWeight: 600 }}>$</span>
        <span style={{ color: "var(--tone-ide-fg)" }}>aio init</span>
        <span style={{ color: "var(--tone-ide-amber)" }}>--web</span>
        <span style={{ color: "var(--tone-ide-syntax-string)" }}>&quot;5d-delivery&quot;</span>
        <span
          className="inline-block w-2 h-[13px] align-middle ml-1 animate-[caretBlink_1s_step-end_infinite]"
          style={{ background: "var(--tone-ide-mint)" }}
        />
      </div>

      {/* H1 */}
      <h1
        className="font-bold mx-auto mb-8"
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "clamp(34px, 7.2vw, 108px)",
          letterSpacing: "-0.028em",
          lineHeight: 0.98,
          color: "var(--tone-ide-fg)",
          maxWidth: 1200,
        }}
      >
        <span className="block" style={{ color: "var(--tone-ide-fg-3)", fontWeight: 500 }}>
          5일 후,
        </span>
        <span className="block">
          <span
            className="relative inline-block"
            style={{ color: "var(--tone-ide-mint)" }}
          >
            결과물
            <span
              className="absolute bottom-[0.05em] left-0 right-0 animate-[ulDraw_1.4s_cubic-bezier(0.16,1,0.3,1)_1.4s_both]"
              style={{
                height: "0.06em",
                background: "var(--tone-ide-mint)",
                display: "block",
                boxShadow: "0 0 12px var(--tone-ide-mint-soft)",
              }}
            />
          </span>
          을 받습니다
        </span>
      </h1>

      {/* Sub */}
      <p
        className="mx-auto mb-11"
        style={{
          fontFamily: "var(--font-pretendard)",
          fontSize: "clamp(14.5px, 1.3vw, 19px)",
          lineHeight: 1.6,
          color: "var(--tone-ide-fg-2)",
          maxWidth: 720,
          letterSpacing: "-0.005em",
        }}
      >
        병원 · 법률 · 쇼핑몰까지.{" "}
        <strong style={{ color: "var(--tone-ide-fg)", fontWeight: 600 }}>업종별 전문 사이트</strong>를{" "}
        <code
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "0.9em",
            background: "var(--tone-ide-bg-3)",
            border: "1px solid var(--tone-ide-line)",
            padding: "2px 8px",
            borderRadius: 4,
            color: "var(--tone-ide-mint)",
            fontWeight: 500,
          }}
        >
          운영 가능한 수준
        </code>
        으로.
      </p>

      {/* CTAs */}
      <div className="inline-flex gap-3 flex-wrap justify-center mb-16">
        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center gap-2 px-6 py-[13px] text-[13px] font-semibold rounded-md transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(77,212,172,0.25)]"
          style={{
            background: "var(--tone-ide-mint)",
            color: "var(--tone-ide-bg)",
            fontFamily: "var(--font-jetbrains)",
            border: "1px solid var(--tone-ide-mint)",
          }}
        >
          $ 견적 시작 →
        </Link>
        <Link
          href={`/${locale}/services/website/portfolio`}
          className="inline-flex items-center gap-2 px-6 py-[13px] text-[13px] font-medium rounded-md transition-all hover:-translate-y-0.5"
          style={{
            background: "var(--tone-ide-bg-2)",
            color: "var(--tone-ide-fg)",
            fontFamily: "var(--font-jetbrains)",
            border: "1px solid var(--tone-ide-line-2)",
          }}
        >
          $ ls portfolio →
        </Link>
      </div>

      {/* Terminal stats box */}
      <div
        className="text-left mx-auto"
        style={{
          background: "var(--tone-ide-bg-2)",
          border: "1px solid var(--tone-ide-line)",
          borderRadius: 8,
          padding: "clamp(16px, 3vw, 22px) clamp(16px, 3vw, 28px)",
          maxWidth: 720,
          fontFamily: "var(--font-jetbrains)",
          fontSize: 13,
        }}
      >
        <div
          className="flex items-center justify-between pb-[14px] mb-4 text-[11.5px]"
          style={{
            borderBottom: "1px solid var(--tone-ide-line)",
            color: "var(--tone-ide-fg-3)",
          }}
        >
          <span>{"//"} aio.web · vital signs</span>
          <span
            className="px-2 py-[2px] text-[9.5px] tracking-[0.16em] uppercase rounded-[3px]"
            style={{
              background: "var(--tone-ide-mint-soft)",
              color: "var(--tone-ide-mint)",
            }}
          >
            live
          </span>
        </div>
        {stats.map((s) => (
          <div
            key={s.key}
            className="grid py-[7px] items-baseline"
            style={{
              gridTemplateColumns: "110px 1fr",
              gap: 12,
            }}
          >
            <span style={{ color: "var(--tone-ide-syntax-blue)" }}>{s.key}</span>
            <span style={{ color: "var(--tone-ide-fg)" }}>
              <span style={{ color: "var(--tone-ide-mint)", fontWeight: 700 }}>{s.val}</span>
              {s.unit && <span style={{ color: "var(--tone-ide-fg-3)" }}>{s.unit}</span>}
              <span className="ml-2 text-[12px]" style={{ color: "var(--tone-ide-fg-3)" }}>
                {s.comment}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
