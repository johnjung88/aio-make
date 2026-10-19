import { ContentReferenceLibrary } from "@/components/content-site/references/reference-library";
import { allServiceCases } from "@/lib/service-cases.server";
import { pageMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "콘텐츠 제작 레퍼런스",
  "웹툰·애니메이션·AI 인플루언서·모션그래픽·브랜드 영상·SNS 광고의 실제 제작 사례와 결과물을 살펴보세요",
  "/content/references",
);

export default async function ContentReferences() {
  const records = await allServiceCases();
  const unique = [...new Map(records.map((record) => [record.caseId, record])).values()];
  // Only customer-facing fields cross the server/client boundary.
  const cases = unique.map(({ caseId, title, brand, summary, scope, publicLabel, productionStatus, services, assets }) => ({
    caseId, title, brand, summary, scope, publicLabel, productionStatus, services, assets,
  }));
  return <ContentReferenceLibrary cases={cases} />;
}
