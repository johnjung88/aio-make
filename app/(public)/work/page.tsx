import Link from "next/link";
import { publicEntries } from "@/lib/db";
import { divisions } from "@/lib/content";
import { mergeGuideEntries } from "@/lib/guide-content";
import { GuideEntryCard } from "@/components/entries";
import { pageMetadata } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "레퍼런스",
  "컨텐츠·마케팅·개발 서비스와 작업을 살펴보세요",
  "/work",
);
export default async function Work() {
  const entries = mergeGuideEntries(
    await publicEntries("reference"),
    "reference",
  );
  return (
    <div className="guide-page guide-editorial is-light is-work">
      <section className="guide-list-wrap">
        <div className="guide-list-heading">
          <div>
            <span className="guide-kicker">SELECTED WORK</span>
            <h1>레퍼런스</h1>
          </div>
          <p>마케팅, 개발, 컨텐츠의 제작 방향과 작업물을 살펴보세요</p>
        </div>
        <nav className="guide-reference-tabs" aria-label="레퍼런스 분야">
          {divisions.map((d) => (
            <Link key={d.id} href={`/${d.path}/work`}>
              {d.brand} · {d.label} →
            </Link>
          ))}
        </nav>
        <div className="guide-work-grid">
          {entries.map((entry) => (
            <GuideEntryCard
              key={entry.id}
              entry={entry}
              path={divisions.find((d) => d.id === entry.division)!.path}
              type="reference"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
