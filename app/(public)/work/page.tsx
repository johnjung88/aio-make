import { publicEntries } from "@/lib/db";
import { mergeGuideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { publicWorkCatalog } from "@/lib/work-catalog";
import { WorkIndex } from "@/components/work-portfolio";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ service?: string; page?: string }> }) {
  const { service, page } = await searchParams;
  const number = Number(page);
  const canonical = !service && Number.isInteger(number) && number > 1 ? `/work?page=${number}` : "/work";
  return { ...pageMetadata("레퍼런스", "웹사이트·쇼핑몰·컨텐츠 작업과 제작 범위를 살펴보세요", canonical), ...(service ? { robots: { index: false, follow: true } } : {}) };
}

export default async function Work({ searchParams }: { searchParams: Promise<{ service?: string; page?: string }> }) {
  const query = await searchParams;
  const works = publicWorkCatalog(mergeGuideEntries(await publicEntries("reference"), "reference"));
  return <WorkIndex works={works} service={query.service} page={Number(query.page) || 1} />;
}
