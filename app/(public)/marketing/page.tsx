import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { publicEntries } from "@/lib/db";
import { ServiceOverview } from "@/components/guide/service-overview";
export async function generateMetadata() {
  const d = divisionByPath("marketing");
  return d ? pageMetadata(d.label + " 대행", d.summary, "/" + d.path) : {};
}
export default async function MarketingPage() {
  const d = divisionByPath("marketing");
  if (!d || d.id === "video") notFound();
  const entries = await publicEntries("reference", d.id);
  return <ServiceOverview key={d.id} division={d.id} entries={entries} />;
}
