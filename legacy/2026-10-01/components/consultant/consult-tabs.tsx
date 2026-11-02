import Link from "next/link";

interface Tab {
  num: string;
  label: string;
  href: string;
  active?: boolean;
}

interface Props {
  tabs: Tab[];
}

export function ConsultTabs({ tabs }: Props) {
  return (
    <div
      className="flex justify-center overflow-x-auto px-6"
      style={{
        background: "var(--tone-consult-paper)",
        borderBottom: "1px solid var(--tone-consult-line)",
        fontFamily: "var(--font-inter)",
        fontSize: "12.5px",
        scrollbarWidth: "none",
        gap: 0,
      }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.num}
          href={tab.href}
          className="inline-flex items-center gap-2 px-[22px] py-[14px] whitespace-nowrap font-medium transition-all"
          style={{
            color: tab.active ? "var(--tone-consult-ink)" : "var(--tone-consult-ink-2)",
            fontWeight: tab.active ? 600 : 500,
            borderBottom: `2px solid ${tab.active ? "var(--tone-consult-navy)" : "transparent"}`,
            marginBottom: -1,
            textDecoration: "none",
            letterSpacing: "-0.005em",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono)",
              fontSize: "10.5px",
              opacity: tab.active ? 1 : 0.55,
              color: tab.active ? "var(--tone-consult-navy)" : "inherit",
            }}
          >
            {tab.num}
          </span>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
