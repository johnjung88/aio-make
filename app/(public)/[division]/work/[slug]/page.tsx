import { EntryDetail } from "@/components/entries";
import { notFound } from "next/navigation";
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
    d = divisionByPath(p.division);
  if (!d || d.id === "video") notFound();
  const e =
    (await publicEntry("reference", d.id, p.slug)) ??
    guideEntries("reference", d.id).find((entry) => entry.slug === p.slug);
  return d && e
    ? pageMetadata(
        e.title,
        e.kind === "example"
          ? `${e.title}의 화면 구성과 제작 방향을 살펴보세요 ${e.summary}`
          : e.summary,
        "/" + d.path + "/work/" + e.slug,
      )
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ division: string; slug: string }>;
}) {
  const p = await params;
  const d = divisionByPath(p.division);
  if (!d || d.id === "video") notFound();
  return <EntryDetail division={p.division} slug={p.slug} type="reference" />;
}
