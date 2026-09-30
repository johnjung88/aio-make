import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { divisionByPath, divisionServices, companyFaq } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { Eyebrow, Action, ContactCTA, FAQ } from "@/components/ui";
import { DevelopmentDemo } from "@/components/development-demo";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const d = divisionByPath((await params).division);
  return d ? pageMetadata(d.label + " 대행", d.summary, "/" + d.path) : {};
}
export default async function DivisionPage({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const d = divisionByPath((await params).division);
  if (!d) notFound();
  return (
    <>
      <section className="division-hero container">
        <div>
          <Eyebrow>AIO MAKE / {d.brand.toUpperCase()}</Eyebrow>
          <h1>{d.headline}</h1>
          <p>{d.summary}</p>
          <Action href={"/" + d.path + "/contact"}>프로젝트 문의</Action>
        </div>
        <div className="division-hero-image">
          <Image
            src={d.image}
            alt={d.label + "의 제공 방향을 표현한 생성 이미지"}
            fill
            priority
            sizes="(max-width:768px) 100vw, 50vw"
          />
          <span className="image-caption">
            CONCEPT VISUAL / AIO MAKE {d.brand.toUpperCase()}
          </span>
        </div>
      </section>
      <section className="section" id="services">
        <div className="container">
          <div className="section-title">
            <div>
              <Eyebrow>WHAT WE MAKE</Eyebrow>
              <h2>무엇이 필요한가요?</h2>
            </div>
            <p>
              목표에 맞는 서비스를 확인하고,
              <br />
              필요한 범위를 함께 정합니다.
            </p>
          </div>
          <div className="service-list">
            {divisionServices(d.id).map((s, i) => (
              <Link key={s.id} href={"/" + d.path + "/services/" + s.id}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.name}</h3>
                  <p>{s.subtitle}</p>
                </div>
                <span className="service-description">{s.description}</span>
                <ArrowUpRight />
              </Link>
            ))}
          </div>
        </div>
      </section>
      {d.id === "development" ? (
        <section className="section paper">
          <div className="container">
            <div className="section-title">
              <div>
                <Eyebrow>BUILT TO WORK</Eyebrow>
                <h2>화면 뒤의 기능까지.</h2>
              </div>
              <p>
                목적에 맞는 화면과 데이터를 설계합니다.
                <br />
                아래 화면은 기능 구성을 설명하는 제작 예시입니다.
              </p>
            </div>
            <DevelopmentDemo />
          </div>
        </section>
      ) : (
        <section className="section paper">
          <div className="container split">
            <div>
              <Eyebrow>
                {d.id === "marketing"
                  ? "CONNECTED MARKETING"
                  : "STORIES IN MOTION"}
              </Eyebrow>
              <h2>
                {d.id === "marketing"
                  ? "콘텐츠와 채널이\n같은 방향을 보도록."
                  : "이야기에 맞는\n표현을 찾습니다."}
              </h2>
            </div>
            <div className="outcome-panel">
              <span className="eyebrow">OUR FOCUS</span>
              {(d.id === "marketing"
                ? [
                    "고객이 궁금해하는 질문",
                    "질문에 답하는 콘텐츠",
                    "검색과 채널의 접점",
                    "문의 이후의 다음 행동",
                  ]
                : [
                    "메시지와 소재",
                    "캐릭터와 장면",
                    "이야기의 연속성",
                    "채널에 맞는 결과물",
                  ]
              ).map((t, i) => (
                <div key={t}>
                  <span className="mono">0{i + 1}</span>
                  <h3>{t}</h3>
                  <ArrowUpRight size={20} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <section className="section">
        <div className="container">
          <Eyebrow>FROM IDEA TO DELIVERY</Eyebrow>
          <h2>진행 방식도 분명하게.</h2>
          <div className="process-grid">
            {d.process.map((p, i) => (
              <div key={p}>
                <span className="mono">0{i + 1}</span>
                <h3>{p}</h3>
                <p>
                  {
                    [
                      "목표, 자료와 요청 범위를 확인합니다.",
                      "계획과 필요한 작업을 합의합니다.",
                      "결과물과 실제 동작을 확인합니다.",
                      "사용할 수 있는 형식과 방법을 정리합니다.",
                    ][i]
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section paper">
        <div className="container split">
          <div>
            <Eyebrow>BEFORE WE START</Eyebrow>
            <h2>자주 묻는 질문.</h2>
          </div>
          <FAQ items={companyFaq} />
        </div>
      </section>
      <ContactCTA path={"/" + d.path + "/contact"} />
    </>
  );
}
