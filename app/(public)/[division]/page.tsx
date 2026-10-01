import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { publicEntries } from "@/lib/db";
import StudioHome from "@/components/guide/studio-home";
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
  const entries = await publicEntries(
    d.path === "video" ? "insight" : "reference",
    d.id,
  );
  return d.path === "video" ? (
    <StudioHome entries={entries} />
  ) : (
    <ServiceOverview key={d.id} division={d.id} entries={entries} />
  );
}
