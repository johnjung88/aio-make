import { LabResourceInquiry } from "@/components/lab-main/resource-inquiry";
import { PageBreadcrumb } from "@/components/page-breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { labInsights } from "@/lib/lab-resources";
import { pageMetadata } from "@/lib/metadata";
import styles from "@/components/lab-main/resources.module.css";
export const metadata = pageMetadata(
  "개발 인사이트",
  "웹사이트·쇼핑몰·자동화·프로그램 개발 의뢰 전에 준비할 내용을 확인하세요",
  "/lab/insights",
);
export default function LabInsightsPage() {
  return (
    <>
      <PageBreadcrumb path="/lab/insights" />
      {
        <main className={`cs-site ${styles.page}`}>
          <section className="cs-container cs-article">
            <header className="cs-article-header">
              <p className="cs-t-eyebrow">INSIGHTS</p>
              <h1 className="cs-t-display">제작 전에 읽어보세요</h1>
              <p className="cs-t-lead">
                웹사이트·쇼핑몰·자동화·프로그램 개발을 준비하는 데 필요한 이야기
              </p>
            </header>
            <nav className={styles.topics} aria-label="개발 주제">
              {labInsights.map((entry) => (
                <Link key={entry.slug} href={`/lab/insights/${entry.slug}`}>
                  {entry.category} →
                </Link>
              ))}
            </nav>
            <div className={`cs-insight-list ${styles.insights}`}>
              {labInsights.map((entry, index) => (
                <article
                  className={`cs-insight-card ${index === 0 ? styles.featuredInsight : ""}`}
                  key={entry.slug}
                >
                  <Link
                    href={`/lab/insights/${entry.slug}`}
                    className={`${styles.media} ${styles.insightMedia}`}
                    aria-label={`${entry.title} 읽기`}
                  >
                    <Image
                      src={
                        entry.service === "website"
                          ? "/lab-references/munseodam.webp"
                          : entry.service === "shopping-mall"
                            ? "/lab-renewal/shopping-mall-banner.webp"
                            : entry.service === "automation"
                              ? "/lab-renewal/automation-hero.webp"
                              : "/lab-renewal/program-hero.webp"
                      }
                      width={1440}
                      height={900}
                      sizes={
                        index === 0
                          ? "(max-width: 900px) 90vw, 55vw"
                          : "(max-width: 900px) 90vw, 30vw"
                      }
                      alt={`${entry.category} 제작 방향 예시`}
                    />
                  </Link>
                  <div className={styles.insightCopy}>
                    <span className="cs-t-eyebrow">{entry.category}</span>
                    <h2 className="cs-t-h3">{entry.title}</h2>
                    <p className="cs-t-body">{entry.summary}</p>
                    <Link
                      className="cs-link"
                      href={`/lab/insights/${entry.slug}`}
                    >
                      글 읽기 ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <LabResourceInquiry />
        </main>
      }
    </>
  );
}
