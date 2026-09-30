import { EntryDetail } from "@/components/entries";
import { divisionByPath } from "@/lib/content";
import { publicEntry } from "@/lib/db";
import { pageMetadata } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; slug: string }>;
}) {
  const p = await params,
    d = divisionByPath(p.division),
    e = d && (await publicEntry("insight", d.id, p.slug));
  return d && e
    ? pageMetadata(e.title, e.summary, "/" + d.path + "/insights/" + e.slug)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ division: string; slug: string }>;
}) {
  const p = await params;
  return <EntryDetail division={p.division} slug={p.slug} type="insight" />;
}
