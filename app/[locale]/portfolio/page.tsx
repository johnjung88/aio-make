import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { portfolioGroups, getProjectsByCategory } from "@/lib/portfolio";
import type { PortfolioGroup } from "@/lib/portfolio";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const ko = locale === "ko";

  const groups = portfolioGroups.filter((g) => g.value !== "all");
  const cards = await Promise.all(
    groups.map(async (g) => {
      const projects = await getProjectsByCategory(g.value as PortfolioGroup);
      return {
        value: g.value as PortfolioGroup,
        label: g.label[ko ? "ko" : "en"],
        icon: g.icon,
        count: projects.length,
        cover: projects[0]?.cover ?? projects[0]?.thumbnail ?? null,
      };
    }),
  );

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("sectionTitle")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {ko ? "카테고리별 작업물" : "Work by category"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {ko
              ? "분야를 골라 실제 결과물을 확인하세요 — 웹사이트·쇼핑몰·로고·상세페이지·PPT·자동화·영상."
              : "Pick a field to see real work — websites, stores, logos, detail pages, decks, automation, video."}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.value}
              href={`/${locale}/portfolio/category/${c.value}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:-translate-y-1 hover:border-primary/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.01]">
                {c.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.cover}
                    alt={c.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl opacity-40">
                    {c.icon}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-base font-semibold text-foreground">{c.label}</span>
                </div>
                <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-muted-foreground">
                  {c.count > 0 ? (ko ? `${c.count}개` : `${c.count}`) : ko ? "준비 중" : "Soon"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
