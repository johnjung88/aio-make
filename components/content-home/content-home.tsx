/* /content 컨텐츠 사이트 홈(서버). 헤더·푸터는 app/(content-site)/content/layout.tsx의 컨텐츠 셸이 그린다.
 * 구성(W-H3): 작품 필름 히어로 → 서비스 6종 3D 캐러셀 → 제작 과정 → 6서비스 → 상담 띠.
 * 글자는 .cs-t-* 역할 클래스만, 색·간격·모양은 컨텐츠 사이트 토큰(--cs-*)만 쓴다. */
import { publicEntries } from "@/lib/db";
import { DivisionFaq } from "@/components/division-faq";
import { homeJourneyData } from "@/lib/home-journey-data";
import Link from "next/link";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import {
  contentHomeCta as cta,
  contentHomeProcessHead as processHead,
} from "@/lib/content-home";
import { FilmStage } from "./film-stage";
import { ProcessSteps } from "./process-steps";
import { ServiceShowcase } from "./service-showcase";
import { ServiceCards } from "./service-cards";
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
        <div className="cs-container">
          <FilmStage />
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
            emphasis={processHead.titleEm}
            align="center"
          />
          <ProcessSteps distinctFrames />
        </div>
      </section>

      <ServiceCards />

      <DivisionFaq division="content" />

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
