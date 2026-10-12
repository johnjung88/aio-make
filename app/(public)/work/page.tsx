import { publicEntries } from "@/lib/db";
import { notFound } from "next/navigation";
import { mergeGuideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { displayWorkCatalog, workMatchesService } from "@/lib/work-catalog";
import { WorkIndex, workPageSize } from "@/components/work-portfolio";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ service?: string; division?: string; page?: string }> }) {
  const { service, division, page } = await searchParams;
  const works = displayWorkCatalog(mergeGuideEntries(await publicEntries("reference"), "reference"));
  const number = Number(page);
  const total = service ? works.filter((work) => workMatchesService(work, service, division)).length : works.length;
  const valid = page === undefined || (Number.isInteger(number) && number >= 1 && number <= Math.max(1, Math.ceil(total / workPageSize)));
  const canonical = !service && valid && number > 1 ? `/work?page=${number}` : "/work";
  return { ...pageMetadata("레퍼런스", "웹사이트·쇼핑몰·컨텐츠 작업과 제작 범위를 살펴보세요", canonical), ...(!valid || service ? { robots: { index: false, follow: true } } : {}) };
}

export default async function Work({ searchParams }: { searchParams: Promise<{ service?: string; division?: string; page?: string }> }) {
  const query = await searchParams;
  const works = displayWorkCatalog(mergeGuideEntries(await publicEntries("reference"), "reference"));
  const total = query.service ? works.filter((work) => workMatchesService(work, query.service!, query.division)).length : works.length;
  const page = query.page === undefined ? 1 : Number(query.page);
  if (!Number.isInteger(page) || page < 1 || page > Math.max(1, Math.ceil(total / workPageSize))) notFound();
  return <WorkIndex works={works} service={query.service} filterDivision={query.division} page={page} />;
}
