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

export function LifestyleTabs({ tabs }: Props) {
  return (
    <div
      className="flex justify-center gap-[6px] overflow-x-auto px-6 py-2"
      style={{
        background: "var(--tone-life-cream-2)",
        borderBottom: "1px solid var(--tone-life-line)",
        fontFamily: "var(--font-jakarta)",
        fontSize: "12.5px",
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.num}
          href={tab.href}
          className="inline-flex items-center gap-2 px-[18px] py-2 rounded-full whitespace-nowrap font-medium transition-all"
          style={{
            color: tab.active ? "var(--tone-life-cream)" : "var(--tone-life-ink-2)",
            background: tab.active ? "var(--tone-life-ink)" : "transparent",
            fontWeight: tab.active ? 600 : 500,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-jetbrains)",
              fontSize: "10.5px",
              opacity: tab.active ? 0.85 : 0.55,
              color: tab.active ? "var(--tone-life-rose)" : "inherit",
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
