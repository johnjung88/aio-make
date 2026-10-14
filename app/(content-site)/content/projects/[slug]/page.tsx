import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { displayWorkCatalog, workMatchesService } from "@/lib/work-catalog";
import { CONTENT_SERVICES, isContentServiceId } from "@/lib/content-site/types";
import { workLabel } from "@/lib/content-site/works.server";
import { pageMetadata } from "@/lib/metadata";
import { studioText } from "@/lib/content-site/text";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ service?: string }> };
function findWork(slug: string) {
 return displayWorkCatalog([]).find(work => work.slug === slug && CONTENT_SERVICES.some(service => workMatchesService(work, service.id, "video")));
}
export async function generateMetadata({ params }: Props) {
 const work = findWork((await params).slug);
 if (!work) return { robots:{ index:false, follow:false } };
 return { ...pageMetadata(`${work.brand} · ${work.title}`, work.description, `/content/projects/${work.slug}`), ...(work.visibility === "review" ? { robots:{ index:false, follow:false } } : {}) };
}
export default async function ContentProject({ params, searchParams }: Props) {
 const work = findWork((await params).slug);
 if (!work) notFound();
 const requestedService = (await searchParams).service;
 const service = requestedService && isContentServiceId(requestedService) && workMatchesService(work, requestedService, "video") ? requestedService : isContentServiceId(work.primaryService) ? work.primaryService : CONTENT_SERVICES.find(item => workMatchesService(work, item.id, "video"))?.id;
 const back = service ? `/content/services/${service}#works` : "/content#services";
 return <article className="cs-container cs-article">
  <header className="cs-article-header">
   <Link href={back} className="cs-link">← 서비스 제작 사례로</Link>
   <p className="cs-t-eyebrow">{studioText(work.brand)}</p>
   <h1 className="cs-t-display">{studioText(work.title)}</h1>
   <p className="cs-t-lead">{studioText(work.description)}</p>
   <span className="cs-tag cs-t-caption">{workLabel(work)}</span>
  </header>
  <div className="cs-article-media">{work.media.map((media,index) => <figure key={`${media.src}-${index}`}>
   {media.kind === "video" ? <video src={media.src} poster={media.poster} controls playsInline preload="none" aria-label={media.alt} /> : <Image src={media.src} alt={media.alt} width={media.width ?? 1200} height={media.height ?? 900} sizes="(min-width:1024px) 1000px, 92vw" />}
   <figcaption className="cs-t-caption">{studioText(media.alt)}</figcaption>
  </figure>)}</div>
  <div className="cs-article-body"><section><h2 className="cs-t-h3">제작 목적</h2><p className="cs-t-body">{studioText(work.purpose)}</p></section><section><h2 className="cs-t-h3">제작 범위</h2><p className="cs-t-body">{studioText(work.scope)}</p></section></div>
  <Link className="cs-btn cs-btn--ghost cs-article-back" href={back}>서비스 제작 사례로 돌아가기</Link>
 </article>;
}
