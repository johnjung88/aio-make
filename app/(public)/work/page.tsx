import Image from "next/image";
import Link from "next/link";
import { publicEntries } from "@/lib/db";
import { divisions } from "@/lib/content";
import { Eyebrow, ContactCTA } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "레퍼런스",
  "공개 권리와 내용을 확인한 고객 사례와 제작 예시.",
  "/work",
);
export default async function Work() {
  const entries = await publicEntries("reference");
  return (
    <>
      <div className="container page-intro">
        <Eyebrow>SELECTED WORK</Eyebrow>
        <h1>
          무엇을, 어떻게
          <br />
          만들었는지.
        </h1>
        <p>고객 사례와 제작 예시를 구분해 소개합니다.</p>
      </div>
      <section className="section paper">
        <div className="container">
          <div className="reference-tabs">
            {divisions.map((d) => (
              <Link key={d.id} href={"/" + d.path + "/work"}>
                {d.label} 레퍼런스 ↗
              </Link>
            ))}
          </div>
          {entries.length ? (
            <div className="content-grid">
              {entries.map((e) => {
                const d = divisions.find((d) => d.id === e.division);
                return d ? (
                  <Link
                    key={e.id}
                    href={"/" + d.path + "/work/" + e.slug}
                    className="content-card"
                  >
                    {e.cover_url && (
                      <div className="content-image">
                        <Image
                          src={e.cover_url}
                          alt={e.title}
                          fill
                          sizes="(max-width:768px) 100vw,33vw"
                        />
                      </div>
                    )}
                    <Eyebrow>
                      {d.label} /{" "}
                      {e.kind === "example" ? "제작 예시" : "고객 사례"}
                    </Eyebrow>
                    <h3>{e.title}</h3>
                    <p>{e.summary}</p>
                  </Link>
                ) : null;
              })}
            </div>
          ) : (
            <div className="empty-state">
              <h3>공개할 결과물을 정리하고 있습니다.</h3>
              <p>
                내용과 공개 권리를 확인한 항목부터 소개합니다. 필요한 작업
                범위는 서비스 안내와 문의에서 확인해주세요.
              </p>
              <Link href="/contact">프로젝트 문의 →</Link>
            </div>
          )}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
