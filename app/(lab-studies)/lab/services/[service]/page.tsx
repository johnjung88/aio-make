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
  return <LabServiceDetail id={id} />;
}
