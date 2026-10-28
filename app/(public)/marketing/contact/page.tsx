import { notFound } from "next/navigation";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import MarketingContact from "@/components/guide/marketing-contact";
export async function generateMetadata() {
  const d = divisionByPath("marketing");
  return d
    ? pageMetadata(
        d.label + " 문의",
        `${d.label} 프로젝트에 필요한 작업, 준비 자료, 일정과 예산을 알려주세요 담당자가 범위를 확인해 안내합니다`,
        "/" + d.path + "/contact",
      )
    : {};
}
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const d = divisionByPath("marketing");
  if (!d) notFound();
  const id = (await searchParams).service,
    service = id && serviceById(d.id, id);
  return <MarketingContact service={service ? service.id : undefined} />;
}
