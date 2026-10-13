import { Fragment } from "react";
import Link from "next/link";
import { GuideNav } from "@/components/guide/primitives";
import {
  contentHomeCta as cta,
  contentHomeHero as hero,
  contentHomeProcessHead as processHead,
  contentHomeServices,
} from "@/lib/content-home";
import { HeroMedia } from "./hero-media";
import { ProcessTabs } from "./process-tabs";
import { ServiceShowcase } from "./service-showcase";
import "./content-home.css";

/* h1의 강조어(AI)만 색을 바꾼다. 줄바꿈은 데이터의 \n에서만 일어난다(white-space: pre-line). */
function HeroTitle() {
  const at = hero.title.indexOf(hero.accent);
  if (at < 0) return <>{hero.title}</>;
  return (
    <>
      {hero.title.slice(0, at)}
      <span className="ch-accent">{hero.accent}</span>
      {hero.title.slice(at + hero.accent.length)}
    </>
  );
}

export function ContentHome() {
  return (
    <div className="guide-page content-home">
      <GuideNav division="video" active="home" />

      <section className="ch-hero" aria-labelledby="ch-hero-title">
        <div className="ch-hero-media">
          <HeroMedia />
        </div>
        <span className="ch-hero-shade" aria-hidden="true" />
        <div className="ch-container l-container ch-hero-copy">
          <p className="ch-eyebrow eyebrow">{hero.eyebrow}</p>
          <h1 id="ch-hero-title" className="ch-hero-title t-h1">
            <HeroTitle />
          </h1>
          <p className="ch-lead t-lead">{hero.lead}</p>
          <p className="ch-hero-services t-body">
            {contentHomeServices.map((s, i) => (
              <Fragment key={s.id}>
                {i > 0 ? " · " : null}
                <span className="ch-nowrap">{s.label}</span>
              </Fragment>
            ))}
          </p>
          <a className="ch-button t-button t-button--lg" href={hero.buttonHref}>
            {hero.button}
            <span aria-hidden="true"> ↓</span>
          </a>
        </div>
        {hero.video ? null : (
          <span className="ch-tag ch-hero-tag t-caption">{hero.tag}</span>
        )}
      </section>

      <ServiceShowcase />

      <section
        id="process"
        className="ch-process"
        aria-labelledby="ch-process-title"
      >
        <header className="ch-container l-container ch-head">
          <div className="ch-head-copy">
            <p className="ch-eyebrow eyebrow">{processHead.eyebrow}</p>
            <h2 id="ch-process-title" className="ch-title t-h2">
              {processHead.title}
            </h2>
            <p className="ch-lead t-lead">{processHead.lead}</p>
          </div>
        </header>
        <ProcessTabs />
      </section>

      <section className="ch-cta" aria-labelledby="ch-cta-title">
        <div className="ch-container l-container ch-cta-inner">
          <div className="ch-cta-copy">
            <h2 id="ch-cta-title" className="ch-title t-h2">
              {cta.title}
            </h2>
            <p className="ch-lead t-lead">{cta.lead}</p>
          </div>
          <Link className="ch-button t-button t-button--lg" href={cta.href}>
            {cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}
