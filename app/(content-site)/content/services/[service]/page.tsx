/* /content/services/<id> 서비스 랜딩(광고 유입 랜딩으로 단독 작동).
 * 고객 사례는 서버에서만 고른다(lib/content-site/works.server.ts, 검토 빌드에서만 결과가 있다). */
import { notFound } from "next/navigation";
import { ServiceLanding } from "@/components/content-site/service-landing";
import { JsonLd } from "@/components/ui";
import { contentLandings } from "@/lib/content-site";
import { serviceJsonLd } from "@/lib/content-site/schema";
import {
  CONTENT_SERVICE_IDS,
  contentServicePath,
  isContentServiceId,
} from "@/lib/content-site/types";
import { selectContentWorks } from "@/lib/content-site/works.server";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ service: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return CONTENT_SERVICE_IDS.map((service) => ({ service }));
}

export async function generateMetadata({ params }: Props) {
  const { service } = await params;
  if (!isContentServiceId(service)) return {};
  const { seo } = contentLandings[service];
  return pageMetadata(seo.title, seo.description, contentServicePath(service));
}

export default async function ContentServicePage({ params }: Props) {
  const { service } = await params;
  if (!isContentServiceId(service)) notFound();
  const works = await selectContentWorks(service);
  return (
    <>
      <ServiceLanding id={service} works={works} />
      {serviceJsonLd(service).map((data) => (
        <JsonLd key={String(data["@type"])} data={data} />
      ))}
    </>
  );
}
