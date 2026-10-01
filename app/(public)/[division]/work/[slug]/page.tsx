import { EntryDetail } from "@/components/entries";
import { divisionByPath } from "@/lib/content";
import { publicEntry } from "@/lib/db";
import { guideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; slug: string }>;
}) {
  const p = await params,
    d = divisionByPath(p.division),
    e =
      d &&
      ((await publicEntry("reference", d.id, p.slug)) ??
        guideEntries("reference", d.id).find((entry) => entry.slug === p.slug));
  return d && e
    ? pageMetadata(e.title, e.summary, "/" + d.path + "/work/" + e.slug)
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ division: string; slug: string }>;
}) {
  const p = await params;
  return <EntryDetail division={p.division} slug={p.slug} type="reference" />;
}
