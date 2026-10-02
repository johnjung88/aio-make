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
        "필요한 작업과 준비된 자료를 알려주세요",
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
  return d.path === "video" ? (
    <StudioContact service={service ? service.id : undefined} />
  ) : d.path === "marketing" ? (
    <MarketingContact service={service ? service.id : undefined} />
  ) : (
    <LabContact service={service ? service.id : undefined} />
  );
}
