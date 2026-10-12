import { notFound } from "next/navigation";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import StudioContact from "@/components/guide/studio-contact";
import MarketingContact from "@/components/guide/marketing-contact";
import LabContact from "@/components/guide/lab-contact";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const d = divisionByPath((await params).division);
  return d
    ? pageMetadata(
        d.label + " 문의",
        `${d.label} 프로젝트에 필요한 작업, 준비 자료, 일정과 예산을 알려주세요 담당자가 범위를 확인해 안내합니다`,
        "/" + d.path + "/contact",
      )
    : {};
}
export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ division: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const d = divisionByPath((await params).division);
  if (!d) notFound();
  const id = (await searchParams).service,
    service = id && serviceById(d.id, id);
  return d.id === "video" ? (
    <StudioContact service={service ? service.id : undefined} />
  ) : d.path === "marketing" ? (
    <MarketingContact service={service ? service.id : undefined} />
  ) : (
    <LabContact service={service ? service.id : undefined} />
  );
}
