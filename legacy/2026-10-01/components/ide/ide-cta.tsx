import Link from "next/link";

interface Props {
  locale: string;
}

export function IdeCta({ locale }: Props) {
  return (
    <section
      className="mx-auto text-center"
      style={{
        padding: "90px clamp(16px,3vw,24px) 70px",
        maxWidth: 1180,
        borderTop: "1px solid var(--tone-ide-line)",
        marginTop: 16,
      }}
    >
      <h2
        className="font-bold mx-auto mb-[22px]"
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: "clamp(34px,5.4vw,80px)",
          letterSpacing: "-0.03em",
          lineHeight: 0.96,
          color: "var(--tone-ide-fg)",
          maxWidth: 900,
        }}
      >
        <span style={{ color: "var(--tone-ide-fg-3)", fontWeight: 500 }}>지금 바로</span>
        <br />
        <span style={{ color: "var(--tone-ide-mint)" }}>시작</span>하세요
      </h2>

      <p
        className="mb-8 text-[13px]"
        style={{
          fontFamily: "var(--font-jetbrains)",
          color: "var(--tone-ide-fg-2)",
        }}
      >
        <span style={{ color: "var(--tone-ide-fg-3)" }}>{"//"} </span>
        1시간 내 임시 답변 · 24시간 내 견적 제안서
      </p>

      <div className="inline-flex gap-3 flex-wrap justify-center">
        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center gap-2 px-6 py-[13px] text-[13px] font-semibold rounded-md transition-all hover:-translate-y-0.5"
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
          className="inline-flex items-center gap-2 px-6 py-[13px] text-[13px] font-medium rounded-md transition-all hover:border-[var(--tone-ide-mint)] hover:text-[var(--tone-ide-mint)]"
          style={{
            background: "var(--tone-ide-bg-2)",
            color: "var(--tone-ide-fg)",
            fontFamily: "var(--font-jetbrains)",
            border: "1px solid var(--tone-ide-line-2)",
            transition: "all 0.25s",
          }}
        >
          $ ls portfolio →
        </Link>
      </div>
    </section>
  );
}
