/* /content 컨텐츠 사이트 홈(서버). 헤더·푸터는 app/(content-site)/content/layout.tsx의 컨텐츠 셸이 그린다.
 * 구성(R6): 16:9 영상 슬롯 히어로(화면에 보이지 않는 h1) → 서비스 6종 자동 넘김 3D 캐러셀 → 제작 과정 4행 표 → 상담 띠.
 * 글자는 .cs-t-* 역할 클래스만, 색·간격·모양은 컨텐츠 사이트 토큰(--cs-*)만 쓴다. */
import { publicEntries } from "@/lib/db";
import { homeJourneyData } from "@/lib/home-journey-data";
import Link from "next/link";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import {
  contentHomeCta as cta,
  contentHomeHero as hero,
  contentHomeProcessHead as processHead,
} from "@/lib/content-home";
import { HeroMedia } from "./hero-media";
import { ProcessSteps } from "./process-steps";
import { ServiceShowcase } from "./service-showcase";
import "./content-home.css";

export async function ContentHome() {
  const journey = homeJourneyData(await publicEntries("reference", "video"));
  return (
    <div className="cs-home">
      <section
        className="ch-hero"
        data-cs-section="hero"
        aria-labelledby="ch-hero-title"
      >
        <h1 id="ch-hero-title" className="cs-sr-only">
          {hero.title}
        </h1>
        <div className="cs-container">
          <div className="ch-hero-reel" data-slot={hero.reelSlot}>
            {hero.video ? (
              <HeroMedia />
            ) : (
              <p className="ch-hero-placeholder cs-t-caption" aria-hidden="true">
                {hero.placeholder}
              </p>
            )}
          </div>
        </div>
      </section>

      <ServiceShowcase selections={journey.contentSelections} />

      <section
        id="process"
        className="ch-process"
        data-cs-section="process"
        aria-labelledby="ch-process-title"
      >
        <div className="cs-container cs-container--read">
          <CsSectionHead
            id="ch-process-title"
            eyebrow={processHead.eyebrow}
            title={processHead.title}
            lead={processHead.lead}
          />
          <ProcessSteps />
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
