import { siteUrl } from "./metadata.ts";
import { servicePlans } from "./service-plans.ts";
export function marketingOffers(id: string) {
  if (!["integrated", "sns", "ai-influencer"].includes(id)) return undefined;
  const plan = servicePlans[id];
  const amount = Number(plan.price.match(/[0-9]+/)![0]) * 10000;
  return [
    {
      "@type": "Offer",
      name: plan.price,
      description: plan.term,
      url: siteUrl + "/marketing/services/" + id + "#pricing",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "KRW",
        ...(id === "integrated" ? { minPrice: amount } : { price: amount }),
        unitText: "착수일부터 1개월",
        billingDuration: "P1M",
        valueAddedTaxIncluded: false,
      },
    },
  ];
}
