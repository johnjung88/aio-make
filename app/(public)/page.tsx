import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { divisions, companyFaq } from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { Eyebrow, FAQ, ContactCTA, Action, JsonLd } from "@/components/ui";
import { publicEntries } from "@/lib/db";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "마케팅·개발·영상, 필요한 일을 연결합니다",
  "사업의 목적에 맞는 마케팅, 웹사이트와 업무 개발, 영상 제작. AIO MAKE와 필요한 일을 연결하세요.",
  "/",
);
export default async function Home() {
  const entries = (await publicEntries("reference"))
    .filter((e) => e.is_featured)
    .slice(0, 3);
  return (
    <>
      <section className="home-hero">
        <div className="hero-image">
          <Image
            src="/renewal/hero.webp"
            alt="서로 연결되는 형태로 표현한 AIO MAKE의 제작 방향"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="container hero-copy">
          <Eyebrow>ALL IDEAS. ONE DIRECTION.</Eyebrow>
          <h1>
            가능성을 연결해,
            <br />
            당신의 일을
            <br />
            <span>앞으로.</span>
          </h1>
          <div className="hero-description">
            <p>
              마케팅, 개발, 영상.
              <br />
              필요한 전문성을 하나의 방향으로 연결합니다.
            </p>
            <Action href="/contact">프로젝트 이야기하기</Action>
          </div>
        </div>
        <div className="hero-foot container">
          <span>STRATEGY · DEVELOPMENT · CONTENT</span>
          <a href="#divisions" aria-label="세 분야 살펴보기">
            <ArrowDownRight size={22} />
          </a>
        </div>
      </section>
      <section className="section paper" id="divisions">
        <div className="container">
          <div className="section-title">
            <div>
              <Eyebrow>THREE FIELDS. ONE PARTNER.</Eyebrow>
              <h2>
                필요한 분야부터,
                <br />
                함께 시작합니다.
              </h2>
            </div>
            <p>
              하나의 프로젝트도, 여러 분야의 협업도.
              <br />
              사업에 필요한 범위를 먼저 정합니다.
            </p>
          </div>
          <div className="division-cards">
            {divisions.map((d) => (
              <Link key={d.id} href={"/" + d.path} className="division-card">
                <div className="card-image">
                  <Image
                    src={d.image}
                    alt={d.label + " 분야를 표현한 생성 이미지"}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <span>
                    {d.number} / {d.brand.toUpperCase()}
                  </span>
                </div>
                <div className="card-copy">
                  <h3>{d.label}</h3>
                  <ArrowUpRight />
                  <p>{d.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container approach">
          <Eyebrow>THE AIO WAY</Eyebrow>
          <h2>
            도구보다 먼저,
            <br />
            <span>일의 목적을 봅니다.</span>
          </h2>
          <div className="principles">
            {[
              [
                "01",
                "목적을 분명하게",
                "고객과 사업을 이해하고, 무엇을 바꿀지 함께 정합니다.",
              ],
              [
                "02",
                "필요한 일을 연결",
                "기획과 제작, 웹사이트와 채널이 같은 방향을 보게 합니다.",
              ],
              [
                "03",
                "AI와 사람의 협업",
                "AI로 제작 과정을 돕고 사람이 사실과 권리, 품질을 확인합니다.",
              ],
              [
                "04",
                "다음 운영까지",
                "결과물과 사용 방법을 함께 정리해 다음 운영으로 이어갑니다.",
              ],
            ].map(([n, t, p]) => (
              <div key={n}>
                <span className="mono">{n}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {entries.length > 0 && (
        <section className="section paper">
          <div className="container">
            <Eyebrow>SELECTED WORK</Eyebrow>
            <h2>공개된 결과물</h2>
            <div className="content-grid">
              {entries.map((e) => {
                const d = divisions.find((d) => d.id === e.division);
                return d ? (
                  <Link
                    key={e.id}
                    className="content-card"
                    href={"/" + d.path + "/work/" + e.slug}
                  >
                    <Eyebrow>
                      {e.kind === "example" ? "제작 예시" : "고객 사례"}
                    </Eyebrow>
                    <h3>{e.title}</h3>
                    <p>{e.summary}</p>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </section>
      )}
      <section className="section paper">
        <div className="container split">
          <div>
            <Eyebrow>GOOD QUESTIONS. CLEAR ANSWERS.</Eyebrow>
            <h2>
              시작 전에
              <br />
              궁금한 이야기.
            </h2>
          </div>
          <FAQ items={companyFaq} />
        </div>
      </section>
      <ContactCTA />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": siteUrl + "/#organization",
          name: "AIO MAKE",
          url: siteUrl,
          description: "마케팅·개발·영상 대행",
          email: "aiomake2023@gmail.com",
        }}
      />
    </>
  );
}
