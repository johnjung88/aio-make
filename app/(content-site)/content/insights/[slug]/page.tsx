import Link from "next/link";
import { notFound } from "next/navigation";
import { publicEntry } from "@/lib/db";
import { guideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { studioText } from "@/lib/content-site/text";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug:string }> };
async function entryFor(slug:string) { return await publicEntry("insight","video",slug) ?? guideEntries("insight","video").find(entry => entry.slug === slug); }
export async function generateMetadata({params}:Props) { const entry=await entryFor((await params).slug); return entry ? pageMetadata(entry.title,entry.summary,`/content/insights/${entry.slug}`) : {}; }
export default async function Insight({params}:Props) {
 const entry=await entryFor((await params).slug); if(!entry) notFound();
 return <article className="cs-container cs-article"><header className="cs-article-header"><Link className="cs-link" href="/content/insights">← 인사이트</Link><p className="cs-t-eyebrow">INSIGHTS</p><h1 className="cs-t-display">{studioText(entry.title)}</h1><p className="cs-t-lead">{studioText(entry.summary)}</p></header><div className="cs-article-body">{entry.body.split(/\n\n+/).map((paragraph,index)=><p className="cs-t-body" key={index}>{studioText(paragraph)}</p>)}</div><Link className="cs-btn cs-btn--primary" href="/content/contact">제작 상담 신청</Link></article>;
}
