import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { portfolioGroups, getProjectsByCategory } from "@/lib/portfolio";
import type { PortfolioGroup } from "@/lib/portfolio";
import { PortfolioCard } from "@/components/ui/portfolio-card";
import { AioNav, AioFooter } from "@/components/landing/aio-nav";
import type { AioNavLevel } from "@/components/landing/aio-nav";

const VALID_CATEGORIES = portfolioGroups
  .filter((group) => group.value !== "all")
  .map((group) => group.value as PortfolioGroup);

const categoryLabels = Object.fromEntries(
  portfolioGroups
    .filter((group) => group.value !== "all")
    .map((group) => [group.value, group.label]),
) as Record<PortfolioGroup, { ko: string; en: string }>;

/** 포트폴리오 카테고리 → 서비스 nav 매핑 */
const CATEGORY_NAV: Record<
  string,
  { level: AioNavLevel; cat: "development" | "design" | "video" | "marketing"; sub?: string }
> = {
  "logo-business-card": { level: "middle", cat: "design" },
  "detail-page":        { level: "leaf",   cat: "design",      sub: "detail-page" },
  "ppt-design":         { level: "leaf",   cat: "design",      sub: "ppt-design" },
  "website":            { level: "leaf",   cat: "development", sub: "website" },
  "shopping-mall":      { level: "leaf",   cat: "development", sub: "shopping-mall" },
  "automation-app":     { level: "leaf",   cat: "development", sub: "automation-app" },
  "video-content":      { level: "middle", cat: "video" },
};

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!VALID_CATEGORIES.includes(category as PortfolioGroup)) return {};
  const label = categoryLabels[category as PortfolioGroup][locale as "ko" | "en"];
  return { title: `${label} 포트폴리오` };
}

export default async function CategoryPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });

  if (category === "logo-design") {
    redirect(`/${locale}/portfolio/category/logo-business-card`);
  }

  if (!VALID_CATEGORIES.includes(category as PortfolioGroup)) {
    notFound();
  }

  const group = category as PortfolioGroup;
  const projects = await getProjectsByCategory(group);
  const label = categoryLabels[group][locale as "ko" | "en"];
  const nav = CATEGORY_NAV[group] ?? { level: "middle" as AioNavLevel, cat: "development" as const };

  return (
    <div>
      <AioNav locale={locale} level={nav.level} cat={nav.cat} sub={nav.sub} active="portfolio" />

      <main className="pb-24 pt-20">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10 bg-primary" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                {t("sectionTitle")}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{label}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {locale === "ko" ? `${projects.length}개 작업물` : `${projects.length} projects`}
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-muted-foreground">
              {locale === "ko" ? `${t("comingSoon")} - 5월부터 채워집니다` : t("comingSoon")}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <PortfolioCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AioFooter locale={locale} />
    </div>
  );
}
