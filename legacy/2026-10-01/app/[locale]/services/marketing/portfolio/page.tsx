import type { Metadata } from "next";
import { FieldPortfolio } from "@/components/landing/field-portfolio";
import { FIELD_CATEGORIES, FIELD_META } from "@/lib/fields";
import { portfolioGroups, getProjectsByCategory } from "@/lib/portfolio";
import type { PortfolioGroup } from "@/lib/portfolio";

const FIELD = "marketing" as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  await params;
  return { title: `${FIELD_META[FIELD].title} 포트폴리오 — AIO` };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ko = locale === "ko";
  const meta = Object.fromEntries(
    portfolioGroups.filter((g) => g.value !== "all").map((g) => [g.value, g]),
  ) as Record<string, { label: { ko: string; en: string }; icon: string }>;
  const cards = await Promise.all(
    FIELD_CATEGORIES[FIELD].map(async (slug) => {
      const projects = await getProjectsByCategory(slug as PortfolioGroup);
      const g = meta[slug];
      return {
        slug,
        label: g ? g.label[ko ? "ko" : "en"] : slug,
        icon: g ? g.icon : "",
        count: projects.length,
        cover: projects[0]?.cover ?? projects[0]?.thumbnail ?? null,
      };
    }),
  );
  const m = FIELD_META[FIELD];
  return <FieldPortfolio locale={locale} field={FIELD} title={m.title} lead={m.lead} cards={cards} />;
}
