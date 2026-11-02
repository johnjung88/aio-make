import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ServiceDetail } from "@/lib/services-data";
import { serviceCategories } from "@/lib/services-data";
import { ICON_MAP } from "@/lib/category-icons";
import { CategoryCardLink } from "./category-card-link";
import { getProjectsByCategory } from "@/lib/portfolio";
import type { PortfolioGroup } from "@/lib/portfolio";

async function ServiceCard({ svc, locale }: { svc: ServiceDetail; locale: string }) {
  const iconName = serviceCategories.find((c) => c.value === svc.id)?.icon ?? "Globe";
  const Icon = ICON_MAP[iconName] ?? ICON_MAP["Globe"];
  const lang = locale === "ko" ? "ko" : "en";
  const startingPrice = svc.pricing[0]?.eventPrice ?? "";
  const duration = svc.pricing[0]?.duration ?? "";

  const projects = await getProjectsByCategory(svc.id as PortfolioGroup);
  const cover = projects[0]?.cover ?? null;

  return (
    <CategoryCardLink
      href={`/${locale}/services/${svc.id}`}
      category={svc.id}
      className="group flex flex-col overflow-hidden rounded-xl border border-white/8 bg-card transition-colors hover:border-primary/40 hover:bg-card/80"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <span className="mt-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
            {svc.subtitle}
          </span>
        </div>

        <p className="mb-1 text-lg font-bold text-foreground">{svc.title[lang]}</p>
        <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {svc.description[lang]}
        </p>

        {startingPrice && (
          <p className="mb-4 text-sm font-semibold text-primary">
            {lang === "ko"
              ? `시작가 ${startingPrice} · 납기 ${duration}`
              : `From ${startingPrice} · ${duration}`}
          </p>
        )}

        {cover && (
          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-lg border border-white/10 bg-black">
            <Image
              src={cover}
              alt={svc.title[lang]}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-primary">
          <span>{lang === "ko" ? "자세히 보기" : "Learn more"}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </CategoryCardLink>
  );
}

export async function SubcategoryGrid({
  services,
  locale,
}: {
  services: ServiceDetail[];
  locale: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((svc) => (
        <ServiceCard key={svc.id} svc={svc} locale={locale} />
      ))}
    </div>
  );
}
