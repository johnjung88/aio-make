import Image from "next/image";
import { notFound } from "next/navigation";
import {
  divisionByPath,
  serviceById,
  serviceVisual,
  companyFaq,
} from "@/lib/content";
import { pageMetadata, siteUrl } from "@/lib/metadata";
import { Eyebrow, Action, FAQ, ContactCTA, JsonLd } from "@/components/ui";
import { DevelopmentDemo } from "@/components/development-demo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; service: string }>;
}) {
  const p = await params,
    d = divisionByPath(p.division),
    s = d && serviceById(d.id, p.service);
  return d && s
    ? pageMetadata(s.name, s.description, "/" + d.path + "/services/" + s.id)
    : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ division: string; service: string }>;
}) {
  const p = await params,
    d = divisionByPath(p.division),
    s = d && serviceById(d.id, p.service);
  if (!d || !s) notFound();
  const contact = "/" + d.path + "/contact?service=" + s.id,
    visual = serviceVisual(s);
  return (
    <>
      <section
        className={"page-hero container" + (visual ? " has-service-image" : "")}
      >
        <div>
          <Eyebrow>AIO MAKE {d.brand} / SERVICE</Eyebrow>
          <h1>{s.name}</h1>
          <p className="lead">{s.subtitle}</p>
          <p>{s.description}</p>
          <Action href={contact}>범위 확인 후 견적 문의</Action>
        </div>
        {visual && (
          <figure className="service-sample">
            <div>
              <Image
                src={visual.image}
                alt={visual.caption}
                fill
                priority
                sizes="(max-width:768px) 100vw,50vw"
              />
            </div>
            <figcaption>{visual.caption}</figcaption>
          </figure>
        )}
      </section>
      {d.id === "development" && (
        <section className="container">
          <DevelopmentDemo service={s.id} />
        </section>
      )}
      <section className="section paper">
        <div className="container split">
          <div>
            <Eyebrow>IS THIS FOR YOU?</Eyebrow>
            <h2>
              이런 일을
              <br />
              함께 해결합니다.
            </h2>
          </div>
          <p className="large-copy">{s.audience}</p>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <Eyebrow>SCOPE & OUTPUT</Eyebrow>
            <h2>
              제공 범위부터
              <br />
              명확하게.
            </h2>
            <p>
              세부 수량과 기능, 수정·검수·지원 범위는
              <br />
              요청 내용을 확인한 뒤 합의합니다.
            </p>
          </div>
          <div className="number-list">
            {s.outcomes.map((t, i) => (
              <div key={t}>
                <span className="mono">0{i + 1}</span>
                <h3>{t}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section paper">
        <div className="container split">
          <div>
            <Eyebrow>WHAT WE NEED</Eyebrow>
            <h2>준비할 자료.</h2>
            <p>아직 없는 자료는 문의 때 알려주세요.</p>
          </div>
          <div className="number-list">
            {s.inputs.map((t, i) => (
              <div key={t}>
                <span className="mono">0{i + 1}</span>
                <h3>{t}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2>
              문의 전에
              <br />
              확인하세요.
            </h2>
          </div>
          <FAQ items={[...(s.faq ?? []), companyFaq[0]]} />
        </div>
      </section>
      <ContactCTA path={contact} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          description: s.description,
          provider: { "@id": siteUrl + "/#organization" },
          url: siteUrl + "/" + d.path + "/services/" + s.id,
        }}
      />
    </>
  );
}
