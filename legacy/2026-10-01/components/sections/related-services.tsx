import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  servicesData,
  serviceCategories,
  type ServiceCategory,
} from "@/lib/services-data";
import { ICON_MAP } from "@/lib/category-icons";

interface Props {
  currentCategory: ServiceCategory;
  relatedIds: ServiceCategory[];
  locale: string;
}

export function RelatedServices({ relatedIds, locale }: Props) {
  const lang = locale === "ko" ? "ko" : "en";

  const related = relatedIds
    .map((id) => servicesData.find((s) => s.id === id))
    .filter(Boolean)
    .slice(0, 3) as (typeof servicesData)[number][];

  if (related.length === 0) return null;

  const iconNameMap = Object.fromEntries(
    serviceCategories.map((c) => [c.value, c.icon])
  ) as Record<ServiceCategory, string>;

  return (
    <section className="mt-16 border-t border-white/8 pt-16">
      <h2 className="mb-6 text-sm font-semibold text-foreground">
        {lang === "ko" ? "함께 자주 의뢰되는 서비스" : "Services often requested together"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((svc) => {
          const Icon = ICON_MAP[iconNameMap[svc.id]] ?? ICON_MAP["Globe"];
          const startingPrice = svc.pricing[0]?.eventPrice ?? "";

          return (
            <Link
              key={svc.id}
              href={`/${locale}/services/${svc.id}`}
              className="group flex items-center gap-4 rounded-xl border border-white/8 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{svc.title[lang]}</p>
                {startingPrice && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {lang === "ko" ? `시작가 ${startingPrice}` : `From ${startingPrice}`}
                  </p>
                )}
              </div>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
