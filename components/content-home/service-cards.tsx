import Link from "next/link";
import { contentHomeCards } from "@/lib/content-home-cards";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import { HomeArtwork } from "./home-artwork";

export function ServiceCards() {
  return <section className="ch-all-services cs-section" data-cs-section="all-services" aria-labelledby="ch-all-services-title">
    <div className="cs-container">
      <CsSectionHead id="ch-all-services-title" eyebrow="ALL SERVICES" title={"필요한 컨텐츠를\n골라 맡기세요"} emphasis="골라" align="center" />
      <ul className="ch-service-cards">
        {contentHomeCards.map((card, index) => <li key={card.id}>
          <Link className="ch-service-card" href={card.href}>
            <div className="ch-service-card-image"><HomeArtwork id={card.id} placement="services"/>{card.id === "ai-influencer" && <span className="cs-tag cs-t-caption">AI 가상인물</span>}{card.id === "animation" && <span className="cs-tag cs-t-caption">캐릭터·모션 활용</span>}</div>
            <div className="ch-service-card-copy">
              <p className="cs-t-eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="cs-t-h3">{card.label}</h3>
              <p className="cs-t-body">{card.line}</p>
              <p className="cs-t-small ch-service-card-details">{card.details}</p>
              <span className="cs-link ch-service-card-cta" aria-label={`${card.label} 서비스 보기`}><span className="ch-service-card-cta-name">{card.label} </span>서비스 보기 <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        </li>)}
      </ul>
    </div>
  </section>;
}
