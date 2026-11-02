/* /content/services/<id> 서비스 랜딩(광고 유입 랜딩으로 단독 작동).
 * 승인된 상세 사례와 공개·권리 확인을 거친 관리 사례를 서버에서 선택한다. */
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/content-site/service-detail";
import { JsonLd } from "@/components/ui";
import { contentLandings } from "@/lib/content-site";
import { serviceJsonLd } from "@/lib/content-site/schema";
import {
  CONTENT_SERVICE_IDS,
  contentServicePath,
  isContentServiceId,
} from "@/lib/content-site/types";
import { serviceCases } from "@/lib/service-cases.server";
import { DETAIL_COPY } from "@/lib/content-site/service-detail-content";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ service: string }> };

export const dynamicParams = false;
export const revalidate = 60;

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
  const cases = await serviceCases(service);
  return (
    <>
      <ServiceDetail id={service} cases={cases} />
      {serviceJsonLd(service, DETAIL_COPY[service].faq).map((data) => (
        <JsonLd key={String(data["@type"])} data={data} />
      ))}
    </>
  );
}
