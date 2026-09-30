import { EntryList } from "@/components/entries";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const d = divisionByPath((await params).division);
  return d
    ? pageMetadata(d.label + " 인사이트", d.summary, "/" + d.path + "/insights")
    : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  return <EntryList division={(await params).division} type="insight" />;
}
