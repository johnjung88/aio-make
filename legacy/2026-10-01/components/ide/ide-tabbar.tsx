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

const FileIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7 }}>
    <path d="M2 1.75A.75.75 0 0 1 2.75 1h7.5a.75.75 0 0 1 .53.22l3.5 3.5c.141.14.22.331.22.53v9a.75.75 0 0 1-.75.75h-11a.75.75 0 0 1-.75-.75z" />
  </svg>
);

export function IdeTabbar({ tabs }: Props) {
  return (
    <div
      className="flex items-center overflow-x-auto"
      style={{
        background: "var(--tone-ide-bg)",
        borderBottom: "1px solid var(--tone-ide-line)",
        fontFamily: "var(--font-jetbrains)",
        fontSize: 12,
        scrollbarWidth: "none",
      }}
    >
      {tabs.map((tab) => (
        <Link
          key={tab.num}
          href={tab.href}
          className="inline-flex items-center gap-2 px-4 py-[10px] whitespace-nowrap transition-all"
          style={{
            color: tab.active ? "var(--tone-ide-fg)" : "var(--tone-ide-fg-3)",
            background: tab.active ? "var(--tone-ide-bg-2)" : "transparent",
            borderRight: "1px solid var(--tone-ide-line)",
            borderBottom: tab.active ? "2px solid var(--tone-ide-mint)" : "2px solid transparent",
            marginBottom: -1,
            textDecoration: "none",
          }}
        >
          <FileIcon />
          <span style={{ color: "var(--tone-ide-mint)" }}>{tab.num}</span>
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
