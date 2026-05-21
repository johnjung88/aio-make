import type { Metadata } from "next";
import { QuoteForm } from "@/components/sections/quote-form";
import { MagazineEyebrow } from "@/components/magazine/magazine-eyebrow";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/quote",
    title: isKo ? "견적 문의" : "Quote Request",
    description: isKo
      ? "서비스, 예산, 일정, 유입 경로를 구조화해 AIO 담당 PM에게 바로 인계되는 견적 문의입니다."
      : "Send a structured quote request with service, budget, timeline, and source for PM handoff.",
  });
}

export default async function QuotePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; service?: string; subtype?: string; source?: string; entry?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const l = locale as "ko" | "en";
  const isKo = l === "ko";

  return (
    <div
      data-tone="magazine"
      style={{ background: "var(--tone-magazine-paper)" }}
      className="min-h-screen"
    >
      <section
        className="max-w-[1100px] mx-auto"
        style={{
          padding: "clamp(56px,8vw,120px) clamp(16px,3vw,40px) clamp(64px,10vw,140px)",
        }}
      >
        {/* Cover meta */}
        <div
          className="pb-4 border-b mb-8 md:mb-12 inline-flex flex-wrap items-center gap-2.5 md:gap-[18px] justify-center w-full"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "clamp(9.5px, 0.9vw, 11px)",
            color: "var(--tone-magazine-ink-3)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            borderColor: "var(--tone-magazine-ink)",
          }}
        >
          <span>Issue 2026 · May</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-marcellus)", letterSpacing: "0.4em", color: "var(--tone-magazine-ink)" }}>
            A&nbsp;·&nbsp;I&nbsp;·&nbsp;O&nbsp;&nbsp; S T U D I O
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)", display: "inline-block" }} />
          <span>{isKo ? "견적 문의" : "Quote Request"}</span>
        </div>

        {/* Eyebrow + H1 + Subtitle — text-center */}
        <div className="text-center mb-14">
          <MagazineEyebrow className="mb-8">Quote · Get a structured estimate</MagazineEyebrow>

          <h1
            className="font-normal mx-auto mb-8 max-w-[1100px]"
            style={{
              fontFamily: "var(--font-marcellus)",
              fontSize: "clamp(34px, 7.5vw, 108px)",
              lineHeight: 1.0,
              letterSpacing: "-0.014em",
              color: "var(--tone-magazine-ink)",
            }}
          >
            {isKo ? (
              <>
                맡기실 일을{" "}
                <em
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    color: "var(--tone-magazine-red)",
                    fontWeight: 500,
                  }}
                >
                  알려주세요
                </em>
              </>
            ) : (
              <>
                Tell us about{" "}
                <em
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontStyle: "italic",
                    color: "var(--tone-magazine-red)",
                    fontWeight: 500,
                  }}
                >
                  your work
                </em>
              </>
            )}
          </h1>

          <p
            className="mx-auto"
            style={{
              fontFamily: "var(--font-pretendard)",
              fontSize: "clamp(13.5px, 1.2vw, 17px)",
              lineHeight: 1.85,
              color: "var(--tone-magazine-ink-2)",
              maxWidth: 700,
              fontWeight: 400,
              letterSpacing: "-0.005em",
            }}
          >
            {isKo
              ? "작업 종류 · 예산 · 일정이 정리되어 들어오면, 1시간 내 임시 답변, 24시간 내 견적 제안서를 더 정확하게 드릴 수 있습니다."
              : "Share the work type, budget, and timeline so we can send a quick first reply within 1 hour and a clearer quote within 24 hours."}
          </p>
        </div>

        <QuoteForm
          locale={l}
          initialCategory={query.category ?? query.service}
          initialSubtype={query.subtype}
          initialSource={query.source}
          initialEntryPath={query.entry}
        />
      </section>
    </div>
  );
}
