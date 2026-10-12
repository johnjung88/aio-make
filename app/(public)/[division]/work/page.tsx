import { notFound } from "next/navigation";
import { divisionByPath } from "@/lib/content";
import { publicEntries } from "@/lib/db";
import { mergeGuideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { displayWorkCatalog } from "@/lib/work-catalog";
import { WorkIndex, workPageSize } from "@/components/work-portfolio";
import { workMatchesService } from "@/lib/work-catalog";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ division: string }>; searchParams: Promise<{ service?: string; page?: string }> };

export async function generateMetadata({ params, searchParams }: Props) {
  const d = divisionByPath((await params).division);
  if (!d) return {};
  const { service, page } = await searchParams;
  const works = displayWorkCatalog(mergeGuideEntries(await publicEntries("reference", d.id), "reference", d.id)).filter((work) => work.division === d.id || work.relatedServices.some((item) => item.division === d.id));
  const number = Number(page);
  const base = `/${d.path}/work`;
  const total = service ? works.filter((work) => workMatchesService(work, service, d.id)).length : works.length;
  const valid = page === undefined || (Number.isInteger(number) && number >= 1 && number <= Math.max(1, Math.ceil(total / workPageSize)));
  const canonical = !service && valid && number > 1 ? `${base}?page=${number}` : base;
  return { ...pageMetadata(`${d.label} 작업`, `${d.label} 분야의 작업 범위와 제작 사례를 살펴보세요`, canonical), ...(!valid || service ? { robots: { index: false, follow: true } } : {}) };
}

export default async function DivisionWork({ params, searchParams }: Props) {
  const d = divisionByPath((await params).division);
  if (!d) notFound();
  const query = await searchParams;
  const works = displayWorkCatalog(mergeGuideEntries(await publicEntries("reference", d.id), "reference", d.id)).filter((work) => work.division === d.id || work.relatedServices.some((item) => item.division === d.id));
  const total = query.service ? works.filter((work) => workMatchesService(work, query.service!, d.id)).length : works.length;
  const page = query.page === undefined ? 1 : Number(query.page);
  if (!Number.isInteger(page) || page < 1 || page > Math.max(1, Math.ceil(total / workPageSize))) notFound();
  return <WorkIndex works={works} base={`/${d.path}/work`} division={d.id} service={query.service} page={page} />;
}
