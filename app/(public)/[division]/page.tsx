import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { publicEntries } from "@/lib/db";
import { ContentHome } from "@/components/content-home/content-home";
import { ServiceOverview } from "@/components/guide/service-overview";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const d = divisionByPath((await params).division);
  return d ? pageMetadata(d.label + " 대행", d.summary, "/" + d.path) : {};
}
export default async function DivisionPage({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const d = divisionByPath((await params).division);
  if (!d) notFound();
  // 컨텐츠 분과 홈은 레퍼런스·인사이트 목록을 쓰지 않는다.
  if (d.id === "video") return <ContentHome />;
  const entries = await publicEntries("reference", d.id);
  return <ServiceOverview key={d.id} division={d.id} entries={entries} />;
}
