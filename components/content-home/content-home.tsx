/* /content 컨텐츠 사이트 홈(서버). 헤더·푸터는 app/(content-site)/content/layout.tsx의 컨텐츠 셸이 그린다.
 * 구성: 히어로(쇼릴 슬롯) → 서비스 6종(캐러셀·목록) → 제작 과정 탭 → 상담 띠.
 * 글자는 .cs-t-* 역할 클래스만, 색·간격·모양은 컨텐츠 사이트 토큰(--cs-*)만 쓴다. */
import { Fragment } from "react";
import { publicEntries } from "@/lib/db";
import { homeJourneyData } from "@/lib/home-journey-data";
import Link from "next/link";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
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

/* h1의 강조어(AI)만 색을 바꾼다. 줄바꿈은 데이터의 \n에서만 일어난다(cs-t-display: pre-line). */
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

export async function ContentHome() {
  const journey = homeJourneyData(await publicEntries("reference", "video"));
  return (
    <div className="cs-home">
      <section
        className="ch-hero"
        data-cs-section="hero"
        aria-labelledby="ch-hero-title"
      >
        <div className="ch-hero-media">
          <HeroMedia />
        </div>
        <span className="ch-hero-shade" aria-hidden="true" />
        <div className="cs-container ch-hero-copy">
          <p className="cs-t-eyebrow">{hero.eyebrow}</p>
          <h1 id="ch-hero-title" className="cs-t-display">
            <HeroTitle />
          </h1>
          <p className="ch-hero-lead cs-t-lead">{hero.lead}</p>
          <p className="ch-hero-services cs-t-body">
            {contentHomeServices.map((s, i) => (
              <Fragment key={s.id}>
                {i > 0 ? " · " : null}
                <span className="cs-nowrap">{s.label}</span>
              </Fragment>
            ))}
          </p>
          <div className="ch-hero-actions">
            <a
              className="cs-btn cs-btn--primary cs-btn--lg"
              href={hero.buttonHref}
            >
              {hero.button}
              <span aria-hidden="true">↓</span>
            </a>
            <Link
              className="cs-btn cs-btn--ghost cs-btn--lg ch-hero-ghost"
              href={hero.secondaryHref}
            >
              {hero.secondary}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        {hero.video ? null : (
          <span className="cs-tag cs-t-caption ch-hero-tag">{hero.tag}</span>
        )}
      </section>

      <ServiceShowcase selections={journey.contentSelections} />

      <section
        id="process"
        className="ch-process"
        data-cs-section="process"
        aria-labelledby="ch-process-title"
      >
        <div className="cs-container">
          <CsSectionHead
            id="ch-process-title"
            eyebrow={processHead.eyebrow}
            title={processHead.title}
            lead={processHead.lead}
          />
          <ProcessTabs />
        </div>
      </section>

      <section
        className="ch-cta"
        data-cs-section="cta"
        aria-labelledby="ch-cta-title"
      >
        <div className="cs-container ch-cta-inner">
          <div className="ch-cta-copy">
            <p className="cs-t-eyebrow">{cta.eyebrow}</p>
            <h2 id="ch-cta-title" className="cs-t-h2">
              {cta.title}
            </h2>
            <p className="cs-t-lead">{cta.lead}</p>
          </div>
          <Link className="cs-btn cs-btn--lg ch-cta-button" href={cta.href}>
            {cta.button}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
