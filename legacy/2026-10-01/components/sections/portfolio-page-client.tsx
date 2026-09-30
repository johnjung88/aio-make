"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PortfolioFilter } from "@/components/sections/portfolio-filter";
import { PortfolioCard } from "@/components/ui/portfolio-card";
import { portfolioGroups, getPortfolioGroup } from "@/lib/portfolio-data";
import type { PortfolioProject, PortfolioGroup } from "@/lib/portfolio-data";

type FilterValue = PortfolioGroup | "all";

export function PortfolioPageClient({
  projects,
  locale,
}: {
  projects: PortfolioProject[];
  locale: string;
}) {
  const t = useTranslations("portfolio");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => getPortfolioGroup(p) === activeFilter);

  const counts = Object.fromEntries(
    portfolioGroups.map((group) => [
      group.value,
      group.value === "all"
        ? projects.length
        : projects.filter((p) => getPortfolioGroup(p) === group.value).length,
    ]),
  ) as Partial<Record<FilterValue, number>>;

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("sectionTitle")}
            </span>
          </div>
          <PortfolioFilter
            active={activeFilter}
            onChange={setActiveFilter}
            counts={counts}
          />
          <div className="mt-6 rounded-lg border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-100">
            {locale === "ko"
              ? "비공개 작업물은 민감 정보를 제거한 결과 화면, 핵심 지표, 작업 설명만 공개해 고객이 완성도와 납품 수준을 확인할 수 있도록 보여줍니다"
              : "Private repositories and local work are shown only through sanitized result screens, KPIs, and work summaries. Code and repository links are hidden."}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/15 text-sm text-muted-foreground">
            {t("noItems")}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <PortfolioCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
