import { JsonLd } from "@/components/ui";
import { siteUrl, socialImage, seoDescription } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicEntry } from "@/lib/db";
import { guideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { studioText } from "@/lib/content-site/text";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
async function entryFor(slug: string) {
  return (
    (await publicEntry("insight", "video", slug)) ??
    guideEntries("insight", "video").find((entry) => entry.slug === slug)
  );
}
export async function generateMetadata({ params }: Props) {
  const entry = await entryFor((await params).slug);
  if (!entry) return {};
  const meta = pageMetadata(
    entry.title,
    entry.summary,
    `/content/insights/${entry.slug}`,
  );
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article" as const,
      publishedTime: entry.created_at,
      modifiedTime: entry.updated_at,
    },
  };
}
export default async function Insight({ params }: Props) {
  const entry = await entryFor((await params).slug);
  if (!entry) notFound();
  return (
    <article className="cs-container cs-article">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: seoDescription(`/content/insights/${entry.slug}`, entry.summary),
          image: socialImage("/content"),
          mainEntityOfPage: siteUrl + `/content/insights/${entry.slug}`,
          author: { "@id": siteUrl + "/#organization" },
          publisher: { "@id": siteUrl + "/#organization" },
          datePublished: entry.created_at,
          dateModified: entry.updated_at,
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "AIO MAKE", path: "/" },
          { name: "컨텐츠", path: "/content" },
          { name: "인사이트", path: "/content/insights" },
          { name: entry.title, path: `/content/insights/${entry.slug}` },
        ])}
      />
      <header className="cs-article-header">
        <Link className="cs-link" href="/content/insights">
          ← 인사이트
        </Link>
        <p className="cs-t-eyebrow">INSIGHTS</p>
        <h1 className="cs-t-display">{studioText(entry.title)}</h1>
        <p className="cs-t-lead">{studioText(entry.summary)}</p>
      </header>
      <div className="cs-article-body">
        {entry.body.split(/\n\n+/).map((paragraph, index) => (
          <p className="cs-t-body" key={index}>
            {studioText(paragraph)}
          </p>
        ))}
      </div>
      <Link className="cs-btn cs-btn--primary" href="/content/contact">
        제작 상담 신청
      </Link>
    </article>
  );
}
