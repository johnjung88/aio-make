import { notFound } from "next/navigation";
import { WorkDetail } from "@/components/work-portfolio";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { displayWorkCatalog } from "@/lib/work-catalog";

type Props = { params: Promise<{ slug: string }> };
function workForSlug(slug: string) {
  return displayWorkCatalog([]).find((work) => work.slug === slug);
}
export async function generateMetadata({ params }: Props) {
  const work = workForSlug((await params).slug);
  if (!work) return { robots: { index: false, follow: false } };
  const meta = pageMetadata(`${work.brand} · ${work.title}`, work.description, work.canonicalPath);
  const cover = work.media[0];
  const image = cover && (cover.kind === "video" ? cover.poster : cover.src);
  return { ...meta, ...(image ? {
    openGraph: { ...meta.openGraph, images: [{ url: siteUrl + image, alt: cover.alt }] },
    twitter: { ...meta.twitter, card: "summary_large_image" as const, images: [siteUrl + image] },
  } : {}), ...(work.visibility === "review" ? { robots: { index: false, follow: false } } : {}) };

}
export default async function CatalogWorkDetail({ params }: Props) {
  const work = workForSlug((await params).slug);
  if (!work) notFound();
  const related = displayWorkCatalog([]).filter((item) => item.id !== work.id && (item.division === work.division || item.relatedServices.some((service) => service.id === work.primaryService && service.division === work.division)));
  return <WorkDetail work={work} related={related} />;
}
