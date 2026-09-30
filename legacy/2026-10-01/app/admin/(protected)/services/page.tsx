import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, Megaphone } from "lucide-react";
import { metaCategoriesData, type ServiceCategory } from "@/lib/services-data";
import { AddonPriceEditor, TierPriceEditor } from "@/components/admin/service-price-editor";
import { getServicesWithPriceOverrides } from "@/lib/admin/service-price-overrides";

export const metadata = {
  title: "서비스 가격 | AIO 관리자",
};

const PUBLIC_PATH: Record<ServiceCategory, string> = {
  website: "/ko/services/website",
  "shopping-mall": "/ko/services/shopping-mall",
  "logo-business-card": "/ko/services/logo-business-card",
  "detail-page": "/ko/services/detail-page",
  "ppt-design": "/ko/services/ppt-design",
  "automation-app": "/ko/services/automation-app",
  "video-content": "/ko/services/video",
};

export default async function AdminServicesPage() {
  const servicesData = await getServicesWithPriceOverrides();
  const liveServices = servicesData.length;
  const tierCount = servicesData.reduce((sum, service) => sum + service.pricing.length, 0);
  const addonCount = servicesData.reduce((sum, service) => sum + (service.addons?.length ?? 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Content Source</p>
        <h2 className="mt-2 text-3xl font-semibold">서비스 · 가격</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          공개 서비스/가격 원본 위에 admin 수동 수정값을 반영합니다. 최종 가격 확정과 고객 발송은 승인센터 대상입니다.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "공개 서비스", value: `${liveServices}개`, icon: Megaphone },
          { label: "가격 티어", value: `${tierCount}개`, icon: BadgeCheck },
          { label: "추가 옵션", value: `${addonCount}개`, icon: FileText },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-white/10 bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{card.value}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">대분류 구조</h3>
        </div>
        <div className="grid gap-3 p-5 md:grid-cols-2">
          {metaCategoriesData.map((category) => (
            <div key={category.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-semibold">{category.title.ko}</h4>
                <span className={`rounded-full px-2 py-1 text-[11px] ${category.comingSoon ? "bg-amber-500/10 text-amber-200" : "bg-emerald-500/10 text-emerald-200"}`}>
                  {category.comingSoon ? "준비중" : "공개중"}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{category.description.ko}</p>
              <p className="mt-3 text-xs text-muted-foreground">하위 서비스: {category.subcategories.length > 0 ? category.subcategories.join(", ") : "미정"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {servicesData.map((service) => (
          <article key={service.id} className="rounded-lg border border-white/10 bg-card">
            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{service.subtitle}</p>
                <h3 className="mt-1 text-lg font-semibold">{service.title.ko}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{service.description.ko}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={PUBLIC_PATH[service.id]} className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  공개 페이지
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link href={`/admin/quotes/new?category=${service.id}`} className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground">
                  견적서
                </Link>
              </div>
            </div>

            <div className="grid gap-5 p-5 xl:grid-cols-[1fr_0.75fr]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">
                      <th className="py-2">상품/티어</th>
                      <th className="py-2">가격</th>
                      <th className="py-2">기간</th>
                      <th className="py-2">포함</th>
                      <th className="py-2">수동 수정</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {service.pricing.map((tier, index) => (
                      <tr key={`${service.id}-${tier.name.ko}`}>
                        <td className="py-3 font-medium">
                          {tier.name.ko}
                          {tier.recommended && <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">추천</span>}
                        </td>
                        <td className="py-3 text-primary">{tier.eventPrice || tier.regularPrice || "별도 견적"}</td>
                        <td className="py-3 text-muted-foreground">{tier.duration || "-"}</td>
                        <td className="py-3 text-xs text-muted-foreground">{tier.includes.slice(0, 3).map((item) => item.ko).join(" · ")}</td>
                        <td className="min-w-[300px] py-3">
                          <TierPriceEditor
                            serviceId={service.id}
                            itemIndex={index}
                            itemName={tier.name.ko}
                            eventPrice={tier.eventPrice}
                            regularPrice={tier.regularPrice}
                            duration={tier.duration}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">추가 옵션</h4>
                  <div className="mt-2 space-y-2">
                    {(service.addons ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">등록된 추가 옵션 없음</p>
                    ) : (
                      service.addons?.slice(0, 6).map((addon, index) => (
                        <div key={`${service.id}-${addon.name.ko}`} className="space-y-2 rounded-md bg-white/[0.03] px-3 py-2 text-sm">
                          <div className="flex justify-between gap-3">
                            <span>{addon.name.ko}</span>
                            <span className="shrink-0 text-primary">{addon.price}</span>
                          </div>
                          <AddonPriceEditor
                            serviceId={service.id}
                            itemIndex={index}
                            itemName={addon.name.ko}
                            price={addon.price}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">관련 포트폴리오</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{service.relatedPortfolio.length > 0 ? service.relatedPortfolio.join(", ") : "없음"}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
        수동 수정값은 DB override로 저장되어 admin 가격표와 견적 작업 기준값으로 관리됩니다. 공개 가격 페이지까지 즉시 반영하려면 현재 정적 생성 구조를 publish/revalidate 흐름으로 한 번 더 연결해야 합니다. 고객에게 견적서를 보내거나 최종 가격을 확정할 때는 승인센터 기록을 먼저 남겨주세요.
      </section>
    </div>
  );
}
