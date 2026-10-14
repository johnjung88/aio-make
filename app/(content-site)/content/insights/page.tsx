import Link from "next/link";
import { publicEntries } from "@/lib/db";
import { mergeGuideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { studioText } from "@/lib/content-site/text";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("컨텐츠 인사이트", "컨텐츠 제작을 준비하는 방법과 의뢰 전 확인할 자료", "/content/insights");
export default async function ContentInsights() {
 const entries = mergeGuideEntries(await publicEntries("insight", "video"), "insight", "video");
 return <section className="cs-container cs-article">
  <header className="cs-article-header"><p className="cs-t-eyebrow">INSIGHTS</p><h1 className="cs-t-display">제작 전에 읽어보세요</h1><p className="cs-t-lead">자료 준비부터 제작 흐름까지, 컨텐츠 의뢰에 필요한 이야기</p></header>
  <div className="cs-insight-list">{entries.map((entry,index) => <article className="cs-insight-card" key={entry.id}><span className="cs-t-eyebrow">{String(index+1).padStart(2,"0")}</span><h2 className="cs-t-h3">{studioText(entry.title)}</h2><p className="cs-t-body">{studioText(entry.summary)}</p><Link className="cs-link" href={`/content/insights/${entry.slug}`}>글 읽기 ↗</Link></article>)}</div>
 </section>;
}
