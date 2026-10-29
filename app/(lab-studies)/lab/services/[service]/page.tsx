import { JsonLd } from "@/components/ui";
import { siteUrl } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/seo";
import { notFound } from "next/navigation";
import { LabServiceDetail } from "@/components/lab-main/service-detail";
import { labServices, labServicePath } from "@/lib/lab-services";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ service: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return labServices.map((s) => ({ service: s.id }));
}
export async function generateMetadata({ params }: Props) {
  const { service: id } = await params;
  const service = labServices.find((s) => s.id === id);
  if (!service) return {};
  return pageMetadata(
    `${service.name} | 개발 랩`,
    service.description,
    labServicePath(id),
  );
}
export default async function LabServicePage({ params }: Props) {
  const { service: id } = await params;
  if (!labServices.some((s) => s.id === id)) notFound();
  const service = labServices.find((s) => s.id === id)!;
  return (
    <>
      <LabServiceDetail id={id} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": siteUrl + labServicePath(id) + "#service",
          name: service.name,
          description: service.description,
          url: siteUrl + labServicePath(id),
          provider: { "@id": siteUrl + "/#organization" },
          serviceType: service.name,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "AIO MAKE", path: "/" },
          { name: "개발", path: "/lab" },
          { name: service.name, path: labServicePath(id) },
        ])}
      />
    </>
  );
}
