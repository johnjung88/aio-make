import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { publicEntries } from "@/lib/db";
import { mergeGuideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { publicWorkCatalog } from "@/lib/work-catalog";
import { WorkIndex } from "@/components/work-portfolio";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ division: string }>; searchParams: Promise<{ service?: string; page?: string }> };

export async function generateMetadata({ params, searchParams }: Props) {
  const d = divisionByPath((await params).division);
  if (!d) return {};
  const { service, page } = await searchParams;
  const number = Number(page);
  const base = `/${d.path}/work`;
  const canonical = !service && Number.isInteger(number) && number > 1 ? `${base}?page=${number}` : base;
  return { ...pageMetadata(`${d.label} 작업`, `${d.label} 분야의 작업 범위와 제작 사례를 살펴보세요`, canonical), ...(service ? { robots: { index: false, follow: true } } : {}) };
}

export default async function DivisionWork({ params, searchParams }: Props) {
  const d = divisionByPath((await params).division);
  if (!d) notFound();
  const query = await searchParams;
  const works = publicWorkCatalog(mergeGuideEntries(await publicEntries("reference", d.id), "reference", d.id));
  return <WorkIndex works={works} base={`/${d.path}/work`} division={d.id} service={query.service} page={Number(query.page) || 1} />;
}
