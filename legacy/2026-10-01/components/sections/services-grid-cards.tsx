import { ArrowRight } from "lucide-react";
import { metaCategoriesData, servicesData, type MetaCategory } from "@/lib/services-data";
import { ICON_MAP } from "@/lib/category-icons";
import { CategoryCardLink } from "./category-card-link";

function MetaCard({ cat, locale }: { cat: MetaCategory; locale: string }) {
  const Icon = ICON_MAP[cat.icon] ?? ICON_MAP["Globe"];
  const lang = locale === "ko" ? "ko" : "en";

  const subLabels = cat.subcategories.map((id) => {
    const svc = servicesData.find((s) => s.id === id);
    return svc?.title[lang] ?? id;
  });

  const inner = (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border p-7 transition-all ${
        cat.comingSoon
          ? "cursor-not-allowed border-white/5 bg-white/[0.02]"
          : "cursor-pointer border-white/8 bg-card hover:border-primary/40 hover:bg-card/80"
      }`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div
          className={`grid size-14 place-items-center rounded-xl border text-primary ${
            cat.comingSoon
              ? "border-white/5 bg-white/5 opacity-40"
              : "border-primary/20 bg-primary/10"
          }`}
        >
          <Icon className="size-6" />
        </div>
        <span
          className={`mt-1 rounded-full px-3 py-1 text-xs font-medium ${
            cat.comingSoon
              ? "bg-white/5 text-muted-foreground/50"
              : "border border-white/10 bg-white/[0.04] text-muted-foreground"
          }`}
        >
          {cat.comingSoon
            ? lang === "ko"
              ? "준비 중"
              : "Coming Soon"
            : cat.subtitle[lang]}
        </span>
      </div>

      <h3
        className={`mb-2 text-2xl font-bold ${
          cat.comingSoon ? "text-foreground/30" : "text-foreground"
        }`}
      >
        {cat.title[lang]}
      </h3>

      <p
        className={`mb-5 text-sm leading-6 ${
          cat.comingSoon ? "text-muted-foreground/30" : "text-muted-foreground"
        }`}
      >
        {cat.description[lang]}
      </p>

      {subLabels.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {subLabels.map((label) => (
            <span
              key={label}
              className={`rounded-full px-3 py-1 text-xs ${
                cat.comingSoon
                  ? "bg-white/5 text-muted-foreground/30"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {!cat.comingSoon && (
        <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary">
          <span>{lang === "ko" ? "자세히 보기" : "Learn more"}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      )}
    </div>
  );

  if (cat.comingSoon) return inner;

  return (
    <CategoryCardLink
      href={`/${locale}/services/${cat.id}`}
      category={cat.id}
      className="flex"
    >
      {inner}
    </CategoryCardLink>
  );
}

interface Props {
  locale: string;
  variant?: "home" | "compact";
}

export function ServicesGridCards({ locale }: Props) {
  return (
    <section id="services" className="py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className="mb-12">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Services
            </span>
          </div>
          <h2 className="max-w-2xl text-3xl font-bold leading-tight text-foreground md:text-5xl">
            {locale === "ko"
              ? "원하시는 서비스를 선택하세요"
              : "Choose the service you need"}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
            {locale === "ko"
              ? "각 카테고리를 클릭하면 포트폴리오, 가격, 작업 프로세스를 확인할 수 있습니다"
              : "Click any category to see portfolio samples, pricing, and work process."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {metaCategoriesData.map((cat) => (
            <MetaCard key={cat.id} cat={cat} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
