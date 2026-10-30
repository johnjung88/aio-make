import { marketingOffers } from "@/lib/marketing-offers";
import { notFound } from "next/navigation";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { JsonLd } from "@/components/ui";
import { marketingFaq } from "@/lib/marketing-faq";
import { seoDescriptions } from "@/lib/seo-descriptions";
import { faqSchema, breadcrumbSchema } from "@/lib/seo";
import { MarketingDetail } from "@/components/marketing/detail";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const p = await params,
    d = divisionByPath("marketing"),
    s = d && serviceById(d.id, p.service);
  return d && s && d.id !== "video"
    ? pageMetadata(s.id === "seo" ? "SEO · AEO · GEO 구축" : s.id === "integrated" ? "통합 마케팅 대행" : s.name, s.description, "/" + d.path + "/services/" + s.id)
    : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const p = await params,
    d = divisionByPath("marketing"),
    s = d && serviceById(d.id, p.service);
  // /content/services/*는 컨텐츠 사이트 라우트 그룹이 처리한다. 이 분기는 도달하지 않는다.
  if (!d || !s || d.id === "video") notFound();
  return (
    <>
      <MarketingDetail service={s} />
      <JsonLd data={faqSchema(marketingFaq(s.id))} />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": siteUrl + "/" + d.path + "/services/" + s.id + "#service",
          name: s.name,
          description:
            seoDescriptions["/marketing/services/" + s.id] ?? s.description,
          provider: { "@id": siteUrl + "/#organization" },
          serviceType: s.name,
          offers: marketingOffers(s.id),
          areaServed: { "@type": "Country", name: "대한민국" },
          url: siteUrl + "/" + d.path + "/services/" + s.id,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "AIO MAKE", path: "/" },
          { name: d.label, path: "/" + d.path },
          { name: s.name, path: "/" + d.path + "/services/" + s.id },
        ])}
      />
    </>
  );
}
