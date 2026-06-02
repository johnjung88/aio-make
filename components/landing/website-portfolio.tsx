"use client";

import { IdeTitlebar }  from "@/components/ide/ide-titlebar";
import { IdeTabbar }    from "@/components/ide/ide-tabbar";
import { IdePortfolio } from "@/components/ide/ide-portfolio";
import { IdeStatusbar } from "@/components/ide/ide-statusbar";

export function WebsitePortfolio({ locale }: { locale: string }) {
  const tabs = [
    { num: "01", label: "services.tsx",  href: `/${locale}/services/website` },
    { num: "02", label: "portfolio.tsx", href: `/${locale}/services/website/portfolio`, active: true },
    { num: "03", label: "resources.md",  href: `/${locale}/services/website/resources` },
  ];

  return (
    <main data-tone="ide" style={{ background: "var(--tone-ide-bg)", minHeight: "100vh" }}>
      <IdeTitlebar locale={locale} />
      <IdeTabbar tabs={tabs} />
      <IdePortfolio locale={locale} />
      <IdeStatusbar locale={locale} />
    </main>
  );
}
