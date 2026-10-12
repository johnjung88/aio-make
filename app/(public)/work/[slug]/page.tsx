import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/work-portfolio";
import { pageMetadata } from "@/lib/metadata";
import { publicWorkCatalog } from "@/lib/work-catalog";

type Props = { params: Promise<{ slug: string }> };
function workForSlug(slug: string) {
  return publicWorkCatalog([]).find((work) => work.slug === slug);
}
export async function generateMetadata({ params }: Props) {
  const work = workForSlug((await params).slug);
  return work ? pageMetadata(work.title, work.description, work.canonicalPath) : { robots: { index: false, follow: false } };
}
export default async function CatalogWorkDetail({ params }: Props) {
  const work = workForSlug((await params).slug);
  if (!work) notFound();
  const related = publicWorkCatalog([]).filter((item) => item.id !== work.id && (item.division === work.division || item.relatedServices.some((service) => service.id === work.primaryService && service.division === work.division)));
  return <WorkDetail work={work} related={related} />;
}
