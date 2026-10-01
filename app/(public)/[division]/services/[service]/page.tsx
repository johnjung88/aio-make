import { publicEntries } from "@/lib/db";
import { notFound } from "next/navigation";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/seo";
import StudioServices from "@/components/guide/studio-services";
import { ServiceDetail } from "@/components/guide/service-detail";
const keys: Record<string, string> = {
  "shopping-mall": "shop",
  "brand-film": "promo",
  editing: "edit",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; service: string }>;
}) {
  const p = await params,
    d = divisionByPath(p.division),
    s = d && serviceById(d.id, p.service);
  return d && s
    ? pageMetadata(s.name, s.description, "/" + d.path + "/services/" + s.id)
    : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ division: string; service: string }>;
}) {
  const p = await params,
    d = divisionByPath(p.division),
    s = d && serviceById(d.id, p.service);
  if (!d || !s) notFound();
  const entries = await publicEntries("insight", d.id);
  const key = keys[s.id] ?? s.id,
    guideKey = d.path === "marketing" && key === "ai-influencer" ? "ai" : key;
  return (
    <>
      {d.path === "video" ? (
        <StudioServices key={guideKey} service={guideKey} entries={entries} />
      ) : (
        <ServiceDetail service={s} />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": siteUrl + "/" + d.path + "/services/" + s.id + "#service",
          name: s.name,
          description: s.description,
          provider: { "@id": siteUrl + "/#organization" },
          serviceType: s.name,
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
