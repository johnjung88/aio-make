import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicEntries, publicEntry } from "@/lib/db";
import { divisionByPath } from "@/lib/content";
import { Eyebrow, ContactCTA } from "./ui";
import { isSafeImageUrl, isSafeMediaUrl } from "@/lib/domain";
export async function EntryList({
  division,
  type,
}: {
  division: string;
  type: "reference" | "insight";
}) {
  const d = divisionByPath(division);
  if (!d) notFound();
  const entries = await publicEntries(type, d.id),
    segment = type === "reference" ? "work" : "insights";
  return (
    <>
      <section className="container page-intro">
        <Eyebrow>
          AIO MAKE {d.brand} / {segment}
        </Eyebrow>
        <h1>
          {type === "reference"
            ? "제작의 결과와 방식."
            : "일을 이해하는 이야기."}
        </h1>
        <p>
          {type === "reference"
            ? "공개 확인을 마친 고객 사례와 제작 예시를 구분해 소개합니다."
            : "서비스와 제작, 운영에 관한 내용을 정리합니다."}
        </p>
      </section>
      <section className="section paper">
        <div className="container">
          {entries.length ? (
            <div className="content-grid">
              {entries.map((e) => (
                <Link
                  className="content-card"
                  key={e.id}
                  href={"/" + d.path + "/" + segment + "/" + e.slug}
                >
                  {e.cover_url && isSafeImageUrl(e.cover_url) && (
                    <div className="content-image">
                      <Image
                        src={e.cover_url}
                        alt={e.title}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    </div>
                  )}
                  <Eyebrow>
                    {type === "reference"
                      ? e.kind === "example"
                        ? "제작 예시"
                        : "고객 사례"
                      : d.label + " 인사이트"}
                  </Eyebrow>
                  <h3>{e.title}</h3>
                  <p>{e.summary}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>
                {type === "reference"
                  ? "공개할 결과물을 정리하고 있습니다."
                  : "새로운 이야기를 준비하고 있습니다."}
              </h3>
              <p>
                {type === "reference"
                  ? "프로젝트별 제공 범위와 제작 방식은 문의 시 안내합니다."
                  : "궁금한 서비스와 작업 방식은 분야별 안내에서 먼저 확인할 수 있습니다."}
              </p>
              <Link href={"/" + d.path + "/contact"}>프로젝트 문의 →</Link>
            </div>
          )}
        </div>
      </section>
      <ContactCTA path={"/" + d.path + "/contact"} />
    </>
  );
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
  const entry = await publicEntry(type, d.id, slug);
  if (!entry) notFound();
  return (
    <>
      <div className="container page-intro">
        <Eyebrow>
          {d.label} /{" "}
          {type === "reference"
            ? entry.kind === "example"
              ? "제작 예시"
              : "고객 사례"
            : "인사이트"}
        </Eyebrow>
        <h1>{entry.title}</h1>
        <p>{entry.summary}</p>
        <div className="entry-meta">
          <time dateTime={entry.created_at}>
            {new Date(entry.created_at).toLocaleDateString("ko-KR")}
          </time>
          <Link
            href={
              "/" + d.path + "/" + (type === "reference" ? "work" : "insights")
            }
          >
            목록으로 →
          </Link>
        </div>
      </div>
      {entry.cover_url && isSafeImageUrl(entry.cover_url) && (
        <div className="container">
          <div className="entry-cover">
            <Image
              src={entry.cover_url}
              alt={entry.title}
              fill
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}
      <article className="container entry-body">
        <div className="text-body">{entry.body}</div>
        {entry.video_url && isSafeMediaUrl(entry.video_url) && (
          <p>
            <a
              className="button"
              href={entry.video_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              영상 보기 ↗
            </a>
          </p>
        )}
      </article>
      <ContactCTA path={"/" + d.path + "/contact"} />
    </>
  );
}
