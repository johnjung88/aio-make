import Link from "next/link";
import { labInsights } from "@/lib/lab-resources";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/lab-main/resources.module.css";
export const metadata = pageMetadata(
  "개발 인사이트",
  "웹사이트·쇼핑몰·자동화 의뢰 전에 준비할 내용을 확인하세요",
  "/lab/insights",
);
export default function LabInsightsPage() {
  return (
    <main className={`cs-site ${styles.page}`}>
      <section className="cs-container cs-article">
        <header className="cs-article-header">
          <p className="cs-t-eyebrow">INSIGHTS</p>
          <h1 className="cs-t-display">제작 전에 읽어보세요</h1>
          <p className="cs-t-lead">
            웹사이트·쇼핑몰·자동화를 준비하는 데 필요한 이야기
          </p>
        </header>
        <div className="cs-insight-list">
          {labInsights.map((entry) => (
            <article className="cs-insight-card" key={entry.slug}>
              <span className="cs-t-eyebrow">{entry.category}</span>
              <h2 className="cs-t-h3">{entry.title}</h2>
              <p className="cs-t-body">{entry.summary}</p>
              <Link className="cs-link" href={`/lab/insights/${entry.slug}`}>
                글 읽기 ↗
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
