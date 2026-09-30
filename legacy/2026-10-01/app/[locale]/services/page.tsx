import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { servicesData } from "@/lib/services-data";
import { TypeBadge } from "@/components/ui/type-badge";
import type { ServiceCategory } from "@/lib/services-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("sectionTitle") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  const l = locale as "ko" | "en";
  const base = `/${locale}`;

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

        <div className="mb-16 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-6">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("sectionTitle")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {t("sectionTitle")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{t("sectionSubtitle")}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service) => (
            <Link
              key={service.id}
              href={`${base}/services/${service.id}`}
              className="group flex flex-col gap-5 rounded-2xl border border-white/8 bg-card p-6 transition-all hover:border-white/16 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <TypeBadge type={service.id as ServiceCategory} />
                <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{service.title[l]}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {service.description[l]}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-1">
                {service.items.slice(0, 3).map((item) => (
                  <span
                    key={item.name[l]}
                    className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {item.name[l]}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
