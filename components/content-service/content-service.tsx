import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/ui";
import { ServiceNavigation } from "@/components/guide/service-navigation";
import { WebtoonDevices } from "@/components/guide/webtoon-devices";
import { WebtoonScope } from "@/components/guide/webtoon-scope";
import { ShowcaseVideo } from "@/components/guide/showcase-video";
import { contentServicePlans } from "@/lib/content-service-plans";
import { creativeAsset } from "@/lib/creative-assets";
import type { Service } from "@/lib/content";
import type { WorkItem } from "@/lib/work-catalog";
import { WorkMedia } from "./work-media";
import "./content-service.css";

export function ContentService({
  service,
  works,
}: {
  service: Service;
  works: WorkItem[];
}) {
  const plan = contentServicePlans[service.id];
  const contact = `/content/contact?service=${service.id}`;
  const representative = works[0];
  const hero = representative?.media[0];
  const webtoon = service.id === "webtoon";
  return (
    <div
      className={`guide-page service-dark content-service content-service-${service.id}`}
    >
      <ServiceNavigation division="video" />
      <section
        id="intro"
        className="content-service-hero content-service-container"
        aria-labelledby="content-service-title"
        data-content-section="hero"
      >
        <div className="content-service-hero-copy">
          <span className="content-service-eyebrow">AIO MAKE / CONTENT</span>
          <h1 id="content-service-title">
            <span className="content-service-name">{plan.name}</span>
            {plan.headline.split("\n").map((line) => (
              <span key={line}> {line}</span>
            ))}
          </h1>
          <p>{plan.intro}</p>
          <div className="content-service-actions">
            <Link className="content-service-primary" href={contact}>
              견적 문의 ↗
            </Link>
            {works.length > 0 ? (
              <a href="#cases">제작 사례 보기 ↓</a>
            ) : (
              <a href="#scope">제작 범위 보기 ↓</a>
            )}
          </div>
        </div>
        <div className="content-service-hero-visual">
          {webtoon ? (
            <WebtoonDevices />
          ) : (
            <figure>
              {hero ? (
                <WorkMedia media={hero} priority />
              ) : (
                <Image
                  className="content-service-static"
                  src={creativeAsset("video", service.id)}
                  alt={`${plan.name} 제작 방향 · 연출 예시`}
                  width={1536}
                  height={1024}
                  priority
                  sizes="(max-width: 767px) 90vw, 560px"
                />
              )}
              <figcaption>
                {hero ? (
                  <>
                    <span>
                      {service.id === "ai-influencer"
                        ? "인물 중심 세로 영상 시안"
                        : representative.title}
                    </span>
                    <strong>{representative.productionStatus}</strong>
                  </>
                ) : (
                  "연출 예시 · 서비스의 제작 방향을 보여주는 이미지"
                )}
              </figcaption>
            </figure>
          )}
        </div>
      </section>
      <section
        className="content-service-fit content-service-container"
        aria-labelledby="content-fit-title"
        data-content-section="fit"
      >
        <span className="content-service-eyebrow">WHEN TO USE</span>
        <h2 id="content-fit-title">{plan.fitTitle}</h2>
        <ul>
          {plan.fit.map((text, i) => (
            <li key={text}>
              <span>0{i + 1}</span>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section
        id="scope"
        className="content-service-scope content-service-container"
        aria-labelledby="content-scope-title"
        data-content-section="scope"
      >
        <div className="content-service-section-heading">
          <span className="content-service-eyebrow">제작 범위·규격</span>
          <h2 id="content-scope-title">{plan.scopeTitle}</h2>
        </div>
        <dl className="content-service-specs">
          {plan.specs.map(([title, copy]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{copy}</dd>
            </div>
          ))}
        </dl>
        <div className="content-service-direction">
          <div>
            <h3>{plan.direction.title}</h3>
            <p>{plan.direction.intro}</p>
          </div>
          <ol>
            {plan.direction.items.map(([title, copy], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <h4>{title}</h4>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {webtoon && (
        <>
          <WebtoonScope />
          <div className="content-service-container content-service-showreel">
            <ShowcaseVideo kind="webtoon" />
          </div>
        </>
      )}
      {works.length > 0 && (
        <section
          id="cases"
          className="content-service-cases content-service-container"
          aria-labelledby="content-cases-title"
          data-content-section="cases"
        >
          <div className="content-service-section-heading">
            <span className="content-service-eyebrow">제작 사례</span>
            <h2 id="content-cases-title">{plan.caseTitle}</h2>
            <p>{plan.caseIntro}</p>
          </div>
          <div className="content-service-case-grid">
            {works.map((work) => (
              <article
                className="content-service-case"
                key={work.id}
                data-work-slug={work.slug}
              >
                {work.media[0] && <WorkMedia media={work.media[0]} />}
                <div className="content-service-case-meta">
                  <span>{work.brand}</span>
                  <strong>{work.productionStatus}</strong>
                </div>
                <h3>{work.title}</h3>
                <p>{work.scope}</p>
                <Link href={work.canonicalPath}>작품 상세 보기 ↗</Link>
              </article>
            ))}
          </div>
        </section>
      )}
      <section
        id="process"
        className="content-service-process content-service-container"
        aria-labelledby="content-process-title"
        data-content-section="process"
      >
        <div className="content-service-section-heading">
          <span className="content-service-eyebrow">제작 프로세스</span>
          <h2 id="content-process-title">{plan.processTitle}</h2>
        </div>
        <ol>
          {plan.stages.map((stage, i) => (
            <li key={stage.title}>
              <span className="content-service-step">0{i + 1}</span>
              <div>
                <h3>{stage.title}</h3>
                <p>{stage.task}</p>
              </div>
              <dl>
                <div>
                  <dt>산출물</dt>
                  <dd>{stage.output}</dd>
                </div>
                <div>
                  <dt>고객 확인</dt>
                  <dd>{stage.review}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="content-service-uses content-service-container"
        aria-labelledby="content-uses-title"
        data-content-section="uses"
      >
        <div className="content-service-section-heading">
          <span className="content-service-eyebrow">활용처</span>
          <h2 id="content-uses-title">{plan.usesTitle}</h2>
        </div>
        <ul>
          {plan.uses.map(([title, format, copy]) => (
            <li key={title}>
              <div>
                <h3>{title}</h3>
                <span>{format}</span>
              </div>
              <p>{copy}</p>
            </li>
          ))}
        </ul>
      </section>
      <section
        className="content-service-quote content-service-container"
        aria-labelledby="content-quote-title"
        data-content-section="quote"
      >
        <div>
          <span className="content-service-eyebrow">진행 방식과 맞춤 견적</span>
          <h2 id="content-quote-title">{plan.quoteTitle}</h2>
          <p>{plan.quote}</p>
          <Link href={contact}>제작 범위 상담하기 ↗</Link>
        </div>
        <dl>
          {plan.quoteFactors.map(([title, copy]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{copy}</dd>
            </div>
          ))}
        </dl>
        {service.id === "ad" && (
          <p className="content-service-quote-link">
            광고비·매체 집행 상담은{" "}
            <Link href="/marketing/services/integrated">
              마케팅 통합 운영 ↗
            </Link>
          </p>
        )}
        {service.id === "ai-influencer" && (
          <p className="content-service-quote-link">
            게시·채널 운영 상담은{" "}
            <Link href="/marketing/services/ai-influencer">
              AI 인플루언서 마케팅 ↗
            </Link>
          </p>
        )}
      </section>
      <section
        id="faq"
        className="content-service-faq content-service-container"
        aria-labelledby="content-faq-title"
        data-content-section="faq"
      >
        <div className="content-service-section-heading">
          <span className="content-service-eyebrow">FAQ</span>
          <h2 id="content-faq-title">{plan.faqTitle}</h2>
        </div>
        {plan.faq.map(([question, answer], i) => (
          <details key={question} className="content-service-faq-item">
            <summary
              aria-controls={`content-service-faq-answer-${service.id}-${i}`}
            >
              <span>{question}</span>
              <span aria-hidden="true">+</span>
            </summary>
            <p
              id={`content-service-faq-answer-${service.id}-${i}`}
              className="content-service-faq-answer"
            >
              {answer}
            </p>
          </details>
        ))}
      </section>
      <section
        id="inquiry"
        className="content-service-cta"
        aria-labelledby="content-cta-title"
        data-content-section="cta"
      >
        <div className="content-service-container">
          <div>
            <span className="content-service-eyebrow">
              {plan.name} / START A PROJECT
            </span>
            <h2 id="content-cta-title">{plan.cta[0]}</h2>
            <p>{plan.cta[1]}</p>
          </div>
          <Link href={contact}>견적 문의 ↗</Link>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: plan.faq.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }}
      />
    </div>
  );
}
