import { JsonLd } from "@/components/ui";
import { breadcrumbSchema } from "@/lib/seo";
import { siteUrl, socialImage, seoDescription } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { labInsights } from "@/lib/lab-resources";
import { pageMetadata } from "@/lib/metadata";
import { labServicePath } from "@/lib/lab-services";
import styles from "@/components/lab-main/resources.module.css";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return labInsights.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const entry = labInsights.find((entry) => entry.slug === slug);
  return entry
    ? pageMetadata(entry.title, entry.summary, `/lab/insights/${slug}`)
    : {};
}
export default async function LabInsightPage({ params }: Props) {
  const { slug } = await params;
  const entry = labInsights.find((entry) => entry.slug === slug);
  if (!entry) notFound();
  return (
    <main className={`cs-site ${styles.page}`}>
      <article className="cs-container cs-article">
        <JsonLd
          data={breadcrumbSchema([
            { name: "AIO MAKE", path: "/" },
            { name: "개발", path: "/lab" },
            { name: "인사이트", path: "/lab/insights" },
            { name: entry.title, path: "/lab/insights/" + slug },
          ])}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: entry.title,
            description: seoDescription("/lab/insights/" + slug, entry.summary),
            url: siteUrl + "/lab/insights/" + slug,
            mainEntityOfPage: siteUrl + "/lab/insights/" + slug,
            image: socialImage("/lab"),
            inLanguage: "ko-KR",
            datePublished: entry.datePublished,
            dateModified: entry.dateModified,
            author: { "@id": siteUrl + "/#organization" },
            publisher: { "@id": siteUrl + "/#organization" },
          }}
        />
        <header className="cs-article-header">
          <p className="cs-t-eyebrow">{entry.category}</p>
          <h1 className="cs-t-display">{entry.title}</h1>
          <p className="cs-t-lead">{entry.summary}</p>
        </header>
        <div className={styles.body}>
          {entry.sections.map((section) => (
            <section key={section.title}>
              <h2 className="cs-t-h3">{section.title}</h2>
              <p className="cs-t-body">{section.body}</p>
            </section>
          ))}
        </div>
        <div className={styles.actions}>
          <Link className="cs-link" href="/lab/insights">
            인사이트 목록 ←
          </Link>
          <Link className="cs-link" href={labServicePath(entry.service)}>
            관련 서비스 살펴보기 →
          </Link>
        </div>
      </article>
    </main>
  );
}
