import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getServicesWithPriceOverrides } from "@/lib/admin/service-price-overrides";
import { PricingTable } from "@/components/sections/pricing-table";
import { AddonsTable } from "@/components/sections/addons-table";
import { BundleCards } from "@/components/sections/bundle-cards";
import { ChannelBadges } from "@/components/sections/channel-badges";
import { TypeBadge } from "@/components/ui/type-badge";
import type { ServiceCategory } from "@/lib/services-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  return { title: t("sectionTitle") };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  const l = locale as "ko" | "en";
  const servicesData = await getServicesWithPriceOverrides();

  return (
    <main className="pb-24 pt-28">
      <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">

        {/* 헤더 */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10 bg-primary" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              {t("sectionTitle")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {t("sectionTitle")}
            </h1>
            <span className="rounded-full bg-primary/15 px-4 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/30">
              {t("eventBadge")}
            </span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t("refundPolicy")} · {t("rebookDiscount")}
          </p>
        </div>

        {/* 카테고리별 가격표 */}
        <div className="flex flex-col gap-16">
          {servicesData.map((service) => (
            <section key={service.id}>
              <div className="mb-6 flex items-center gap-3">
                <TypeBadge type={service.id as ServiceCategory} />
                <h2 className="text-lg font-bold text-foreground">{service.title[l]}</h2>
              </div>
              <PricingTable tiers={service.pricing} />
              {service.addons && service.addons.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("addons")}
                  </p>
                  <AddonsTable addons={service.addons} />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* 번들 */}
        <section className="mt-20">
          <h2 className="mb-6 text-xl font-bold text-foreground">{t("bundles")}</h2>
          <BundleCards />
        </section>

        {/* 채널 CTA */}
        <section className="mt-20">
          <div className="rounded-2xl border border-white/8 bg-card p-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-foreground">
              {l === "ko" ? "지금 바로 시작하세요" : "Start right now"}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {l === "ko" ? "무료 상담 후 투명한 견적서를 드립니다" : "Free consultation, then a transparent quote"}
            </p>
            <ChannelBadges className="justify-center" />
          </div>
        </section>
      </div>
    </main>
  );
}
