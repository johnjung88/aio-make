import Link from "next/link";
import { publicEntries } from "@/lib/db";
import { mergeGuideEntries } from "@/lib/guide-content";
import { pageMetadata } from "@/lib/metadata";
import { MarketingInquiry } from "@/components/marketing/blocks";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "마케팅 인사이트",
  "자료 준비부터 운영 흐름까지, 마케팅 의뢰에 필요한 이야기",
  "/marketing/insights",
);
export default async function Page() {
  const entries = mergeGuideEntries(
    await publicEntries("insight", "marketing"),
    "insight",
    "marketing",
  );
  return (
    <>
      <section className="mk-container mk-section">
        <div className="mk-page-title">
          <p className="mk-eyebrow">INSIGHTS</p>
          <h1>운영 전에 읽어보세요</h1>
          <p className="mk-lead">
            자료 준비부터 운영 흐름까지, 마케팅 의뢰에 필요한 이야기
          </p>
        </div>
        <div className="mk-insights">
          {entries.map((entry, i) => (
            <article key={entry.id}>
              <span className="mk-eyebrow">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
              <Link href={"/marketing/insights/" + entry.slug}>글 읽기 ↗</Link>
            </article>
          ))}
        </div>
      </section>
      <MarketingInquiry />
    </>
  );
}
