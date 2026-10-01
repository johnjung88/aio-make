import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicEntries, publicEntry, type Entry } from "@/lib/db";
import { divisionByPath } from "@/lib/content";
import { guideEntries, mergeGuideEntries } from "@/lib/guide-content";
import { isSafeImageUrl, isSafeMediaUrl } from "@/lib/domain";
import { GuideNav } from "./guide/primitives";
import { ReferenceFilters } from "./guide/reference-filters";

export function GuideEntryCard({
  entry,
  path,
  type,
}: {
  entry: Entry;
  path: string;
  type: "reference" | "insight";
}) {
  const segment = type === "reference" ? "work" : "insights";
  return (
    <Link
      className={type === "reference" ? "guide-work-card" : "guide-post-row"}
      href={`/${path}/${segment}/${entry.slug}`}
    >
      {entry.cover_url && isSafeImageUrl(entry.cover_url) && (
        <div className="guide-entry-image">
          <Image
            src={entry.cover_url}
            alt={entry.title}
            fill
            sizes="(max-width:720px) 100vw,50vw"
          />
        </div>
      )}
      <div className="guide-entry-copy">
        <span className="guide-kicker">
          {type === "reference"
            ? entry.kind === "example"
              ? "제작 방향 예시"
              : "고객 사례"
            : entry.id.startsWith("guide-")
              ? "GUIDE"
              : "INSIGHT"}
        </span>
        <h2>{entry.title}</h2>
        <p>{entry.summary}</p>
        {type === "insight" && (
          <time dateTime={entry.created_at}>
            {new Date(entry.created_at).toLocaleDateString("ko-KR")}
          </time>
        )}
      </div>
    </Link>
  );
}
export function GuideListLayout({
  entries,
  division,
  type,
}: {
  entries: Entry[];
  division: string;
  type: "reference" | "insight";
}) {
  const d = divisionByPath(division);
  if (!d) notFound();
  const reference = type === "reference";
  return (
    <div
      className={`guide-page guide-editorial ${division === "video" ? "is-studio" : ""} ${division === "marketing" ? "is-light" : "is-dark"} ${reference ? "is-work" : "is-insight"}`}
    >
      <GuideNav division={division} active={reference ? "cases" : "insights"} />
      <section className="guide-list-wrap">
        <div className="guide-list-heading">
          <div>
            <span className="guide-kicker">
              {d.brand.toUpperCase()} {reference ? "WORKS" : "INSIGHTS"}
            </span>
            <h1>
              {reference
                ? division === "lab"
                  ? "레퍼런스"
                  : division === "marketing"
                    ? "운영 사례"
                    : "작업 사례"
                : "인사이트"}
            </h1>
          </div>
          <p>
            {reference
              ? "제작 방향 예시와 공개 확인을 마친 고객 사례를 소개합니다."
              : `전체 ${entries.length}건`}
          </p>
        </div>
        {reference ? (
          <ReferenceFilters
            division={d.id}
            services={entries.map((entry) => entry.service)}
          >
            {entries.map((e) => (
              <GuideEntryCard
                key={e.id}
                entry={e}
                path={division}
                type={type}
              />
            ))}
          </ReferenceFilters>
        ) : (
          <div className="guide-post-list">
            {entries.map((e) => (
              <GuideEntryCard
                key={e.id}
                entry={e}
                path={division}
                type={type}
              />
            ))}
          </div>
        )}
      </section>
      <GuideEditorialCTA path={division} />
    </div>
  );
}
export function GuideEditorialCTA({ path }: { path: string }) {
  return (
    <section className="guide-editorial-cta">
      <div>
        <h2>필요한 작업이 있다면</h2>
        <p>만들고 싶은 것을 알려주시면 범위와 일정을 정리해드립니다.</p>
      </div>
      <Link href={`/${path}/contact`}>프로젝트 문의 →</Link>
    </section>
  );
}
export async function EntryList({
  division,
  type,
}: {
  division: string;
  type: "reference" | "insight";
}) {
  const d = divisionByPath(division);
  if (!d) notFound();
  const entries = mergeGuideEntries(
    await publicEntries(type, d.id),
    type,
    d.id,
  );
  return <GuideListLayout entries={entries} division={division} type={type} />;
}
export async function EntryDetail({
  division,
  slug,
  type,
}: {
  division: string;
  slug: string;
  type: "reference" | "insight";
}) {
  const d = divisionByPath(division);
  if (!d) notFound();
  const entry =
    (await publicEntry(type, d.id, slug)) ??
    guideEntries(type, d.id).find((e) => e.slug === slug);
  if (!entry) notFound();
  const segment = type === "reference" ? "work" : "insights";
  return (
    <div
      className={`guide-page guide-editorial ${division === "video" ? "is-studio" : ""} ${division === "marketing" ? "is-light" : "is-dark"}`}
    >
      <GuideNav
        division={division}
        active={type === "reference" ? "cases" : "insights"}
      />
      <article className="guide-article">
        <Link className="guide-article-back" href={`/${division}/${segment}`}>
          ← {type === "reference" ? "작업 사례" : "인사이트"}
        </Link>
        <span className="guide-kicker">
          {type === "reference"
            ? entry.kind === "example"
              ? "제작 방향 예시"
              : "고객 사례"
            : "INSIGHT"}
        </span>
        <h1>{entry.title}</h1>
        <p className="guide-article-summary">{entry.summary}</p>
        {entry.cover_url && isSafeImageUrl(entry.cover_url) && (
          <div className="guide-article-cover">
            <Image
              src={entry.cover_url}
              alt={entry.title}
              fill
              priority
              sizes="(max-width:760px) 100vw,760px"
            />
          </div>
        )}
        <div className="guide-article-body">
          {entry.body
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((text, i) => (
              <p key={i}>{text}</p>
            ))}
        </div>
        {entry.video_url && isSafeMediaUrl(entry.video_url) && (
          <a
            className="guide-video-link"
            href={entry.video_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            영상 보기 ↗
          </a>
        )}
        <div className="guide-article-actions">
          <Link href={`/${division}/${segment}`}>목록으로</Link>
          <Link
            href={`/${division}/contact${entry.service ? "?service=" + entry.service : ""}`}
          >
            프로젝트 문의 →
          </Link>
        </div>
      </article>
    </div>
  );
}
