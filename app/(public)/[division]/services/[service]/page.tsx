import { publicEntries } from "@/lib/db";
import { notFound } from "next/navigation";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/seo";
import StudioServices from "@/components/guide/studio-services";
import { ServiceDetail } from "@/components/guide/service-detail";
import { WorkCard } from "@/components/work-portfolio";
import { mergeGuideEntries } from "@/lib/guide-content";
import { displayWorkCatalog, workMatchesService } from "@/lib/work-catalog";
import Link from "next/link";
const keys: Record<string, string> = {
  "shopping-mall": "shop",
  "brand-film": "promo",
  "motion-graphics": "motion",
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
  const works = displayWorkCatalog(mergeGuideEntries(await publicEntries("reference", d.id), "reference", d.id)).filter((work) => workMatchesService(work, s.id, s.division)).slice(0, s.id === "motion-graphics" ? 4 : 2);
  const key = keys[s.id] ?? s.id,
    guideKey = d.path === "marketing" && key === "ai-influencer" ? "ai" : key;
  const references = (works.length > 0 && <section className="work-service-strip work-page"><div className="work-service-strip-inner"><div><span className="work-eyebrow">RELATED WORK</span><h2>관련 작업</h2><Link href={`/${d.path}/work?service=${s.id}`}>이 서비스 작업 더 보기 ↗</Link></div><div className="work-grid">{works.map((work) => <WorkCard key={work.id} work={work} heading="h3" />)}</div></div></section>
  );
  return (
    <>
      {d.id === "video" ? (
        <StudioServices key={guideKey} service={guideKey} entries={entries} references={references} />
      ) : (
        <ServiceDetail service={s} references={references} />
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
