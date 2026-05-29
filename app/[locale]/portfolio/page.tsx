import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getProjectsByCategory } from "@/lib/portfolio";
import type { PortfolioGroup } from "@/lib/portfolio";
import { FIELD_CATEGORIES, FIELD_META } from "@/lib/fields";

const FIELDS: { key: "development" | "design" | "video" | "marketing"; icon: string }[] = [
  { key: "development", icon: "💻" },
  { key: "design", icon: "🎨" },
  { key: "video", icon: "🎬" },
  { key: "marketing", icon: "📈" },
];

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  const ko = locale === "ko";

  const cards = await Promise.all(
    FIELDS.map(async (f) => {
      const cats = FIELD_CATEGORIES[f.key];
      let cover: string | null = null;
      let count = 0;
      for (const slug of cats) {
        const projects = await getProjectsByCategory(slug as PortfolioGroup);
        count += projects.length;
        if (!cover && projects[0]) cover = projects[0].cover ?? projects[0].thumbnail ?? null;
      }
      return { ...f, title: FIELD_META[f.key].title, lead: FIELD_META[f.key].lead, count, cover };
    }),
  );

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-12">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("sectionTitle")}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {ko ? "분야별 포트폴리오" : "Portfolio by field"}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {ko
              ? "보고 싶은 분야를 선택하세요 — 각 분야의 실제 작업물만 모아서 보여드립니다."
              : "Pick a field — each shows only that field's real work."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.key}
              href={`/${locale}/services/${c.key}/portfolio`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:-translate-y-1 hover:border-primary/60"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-white/[0.06] to-white/[0.01]">
                {c.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.cover} alt={c.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl opacity-40">{c.icon}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{c.icon}</span>
                    <span className="text-xl font-bold text-white">{c.title}</span>
                    <span className="ml-auto rounded-full border border-white/20 bg-black/30 px-2.5 py-1 font-mono text-[11px] text-white/80">
                      {c.count > 0 ? (ko ? `${c.count}개` : `${c.count}`) : ko ? "준비 중" : "Soon"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/70">{c.lead}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
