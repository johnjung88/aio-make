import { notFound } from "next/navigation";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { JsonLd } from "@/components/ui";
import StudioServices from "@/components/guide/studio-services";
import MarketingServices from "@/components/guide/marketing-services";
import LabServices from "@/components/guide/lab-services";
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
  const key = keys[s.id] ?? s.id,
    guideKey = d.path === "marketing" && key === "ai-influencer" ? "ai" : key;
  return (
    <>
      {d.path === "video" ? (
        <StudioServices key={guideKey} service={guideKey} />
      ) : d.path === "marketing" ? (
        <MarketingServices key={guideKey} service={guideKey} />
      ) : (
        <LabServices key={guideKey} service={guideKey} />
      )}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          description: s.description,
          provider: { "@id": siteUrl + "/#organization" },
          url: siteUrl + "/" + d.path + "/services/" + s.id,
        }}
      />
    </>
  );
}
