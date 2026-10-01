import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { publicEntries } from "@/lib/db";
import StudioHome from "@/components/guide/studio-home";
import MarketingHome from "@/components/guide/marketing-home";
import LabHome from "@/components/guide/lab-home";
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
  const entries = await publicEntries("insight", d.id);
  return d.path === "video" ? (
    <StudioHome entries={entries} />
  ) : d.path === "marketing" ? (
    <MarketingHome entries={entries} />
  ) : (
    <LabHome entries={entries} />
  );
}
