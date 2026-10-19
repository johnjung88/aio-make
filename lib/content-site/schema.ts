/* 컨텐츠 서비스 페이지 JSON-LD(Service+offers · FAQPage · BreadcrumbList)를 한 곳에서 만든다.
 * Organization은 컨텐츠 레이아웃이 따로 넣는다. FAQ 문자열은 화면 FAQ(CsFaq)와 같은 배열에서 온다. */
import { siteUrl } from "../metadata.ts";
import { breadcrumbSchema } from "../seo.ts";
import { planOptions } from "../content-pricing.ts";
import { contentLandings } from "./index.ts";
import { contentServicePath, type ContentServiceId } from "./types.ts";

export function serviceJsonLd(id: ContentServiceId, faqItems?: readonly (readonly [string, string])[]) {
  const data = contentLandings[id];
  const path = contentServicePath(id);
  const url = siteUrl + path;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": url + "#service",
    name: data.label,
    serviceType: data.label,
    description: data.seo.description,
    provider: { "@id": siteUrl + "/#organization" },
    areaServed: { "@type": "Country", name: "대한민국" },
    url,
    offers: planOptions(id).map((plan) => ({
      "@type": "Offer",
      name: plan.option,
      price: plan.amount,
      priceCurrency: "KRW",
      url: url + "#pricing",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: plan.amount,
        priceCurrency: "KRW",
        valueAddedTaxIncluded: false,
      },
    })),
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (faqItems ?? data.faq).map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
  const breadcrumb = breadcrumbSchema([
    { name: "AIO MAKE", path: "/" },
    { name: "컨텐츠", path: "/content" },
    { name: data.label, path },
  ]);
  return [service, faq, breadcrumb] as const;
}
