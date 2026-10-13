import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { publicEntries } from "@/lib/db";
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
  // /content는 컨텐츠 사이트 라우트 그룹(app/(content-site)/content)이 처리한다. 이 분기는 도달하지 않는다.
  if (!d || d.id === "video") notFound();
  const entries = await publicEntries("reference", d.id);
  return <ServiceOverview key={d.id} division={d.id} entries={entries} />;
}
