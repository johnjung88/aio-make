"use client";

import Link from "next/link";

interface Props {
  locale: string;
}

export function IdeStatusbar({ locale }: Props) {
  return (
    <footer
      className="mt-[60px] grid items-center"
      style={{
        padding: "12px clamp(12px, 3vw, 16px)",
        background: "var(--tone-ide-bg-2)",
        borderTop: "1px solid var(--tone-ide-line)",
        gridTemplateColumns: "1fr auto 1fr",
        gap: 8,
        fontFamily: "var(--font-jetbrains)",
        fontSize: 11,
        color: "var(--tone-ide-fg-3)",
      }}
    >
      <div className="flex items-center gap-[14px]">
        <span
          className="inline-flex items-center gap-[5px]"
          style={{ color: "var(--tone-ide-mint)" }}
        >
          <span
            className="w-[5px] h-[5px] rounded-full"
            style={{ background: "var(--tone-ide-mint)" }}
          />
          main
        </span>
        <span>web-development</span>
      </div>

      <div style={{ color: "var(--tone-ide-fg-2)", textAlign: "center" }}>
        AIO Studio © 2026
      </div>

      <div className="flex items-center gap-[14px] justify-end">
        <Link
          href={`/${locale}`}
          className="transition-colors hover:!text-[var(--tone-ide-mint)]"
          style={{ color: "var(--tone-ide-fg-3)", textDecoration: "none" }}
        >
          home
        </Link>
        <Link
          href={`/${locale}/quote`}
          className="transition-colors hover:!text-[var(--tone-ide-mint)]"
          style={{ color: "var(--tone-ide-fg-3)", textDecoration: "none" }}
        >
          견적 문의
        </Link>
        <Link
          href={`/${locale}/contact`}
          className="transition-colors hover:!text-[var(--tone-ide-mint)]"
          style={{ color: "var(--tone-ide-fg-3)", textDecoration: "none" }}
        >
          contact
        </Link>
      </div>
    </footer>
  );
}
