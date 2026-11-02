import Link from "next/link";

interface Props {
  locale: string;
}

export function IdeTitlebar({ locale }: Props) {
  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between gap-4 px-3 md:px-4 py-[10px]"
      style={{
        background: "var(--tone-ide-bg-2)",
        borderBottom: "1px solid var(--tone-ide-line)",
        fontFamily: "var(--font-jetbrains)",
      }}
    >
      {/* Traffic lights */}
      <div className="inline-flex gap-2 items-center shrink-0">
        <span className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
      </div>

      {/* Filepath */}
      <div
        className="flex-1 text-center text-xs overflow-hidden text-ellipsis whitespace-nowrap"
        style={{ color: "var(--tone-ide-fg-2)" }}
      >
        <Link href={`/${locale}`} style={{ color: "var(--tone-ide-mint)", textDecoration: "none" }}>
          ~/aio
        </Link>
        <span style={{ color: "var(--tone-ide-fg-faint)", margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--tone-ide-fg)" }}>web-development</span>
        <span style={{ color: "var(--tone-ide-fg-faint)", margin: "0 6px" }}>/</span>
        <span style={{ color: "var(--tone-ide-fg)" }}>index.tsx</span>
      </div>

      {/* Right actions */}
      <div className="shrink-0 flex items-center gap-3">
        <span
          className="hidden sm:inline-flex items-center gap-2 px-[10px] py-1 text-[11px]"
          style={{
            border: "1px solid var(--tone-ide-line-2)",
            borderRadius: 4,
            background: "var(--tone-ide-bg-3)",
            color: "var(--tone-ide-fg-2)",
          }}
        >
          <span
            className="w-[6px] h-[6px] rounded-full animate-[pulse_2.4s_ease-in-out_infinite]"
            style={{ background: "var(--tone-ide-mint)", boxShadow: "0 0 6px var(--tone-ide-mint-soft)" }}
          />
          응대 가능
        </span>
        <Link
          href={`/${locale}/quote`}
          className="px-3 py-[6px] text-[11px] font-semibold rounded transition-all hover:opacity-90"
          style={{
            background: "var(--tone-ide-mint)",
            color: "var(--tone-ide-bg)",
            fontFamily: "var(--font-jetbrains)",
          }}
        >
          $ aio quote
        </Link>
      </div>
    </div>
  );
}
