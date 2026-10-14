import { CreatorDeck, CreatorRoster } from "./creator-experience";
import { ServiceHero } from "../service-hero";
import { aiInfluencerSignature } from "@/lib/content-site/services/ai-influencer";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import "./ai-influencer.css";

/* R6 섹션 순서: 히어로(글 위 · 카드 덱 아래 전체 폭) → 4계정 소개 → 브랜드 전용 인물 제작 → (공통) 가격 → 진행 → FAQ → 문의 → 다른 서비스 */
function Hero({ data }: ServiceSectionProps) {
  return <ServiceHero data={data} media={<CreatorDeck/>} wide/>;
}
function Signature() {
  return (
    <section id="sheet" className="cs-section cs-svc-ai-influencer-roster" data-cs-section="signature" aria-labelledby="cs-ai-roster-title">
      <div className="cs-container">
        <CsSectionHead id="cs-ai-roster-title" eyebrow="OUR CREATORS" title={"네 개의 계정\n네 가지 일상"} lead="뷰티와 신혼 생활, 시니어의 취향과 귀농 생활을 각자의 말투와 스타일로 풀어냅니다" />
        <p className="cs-svc-ai-influencer-editor-note cs-t-small">자체 IP 계정 소개 · 피드 구성 예시</p>
        <CreatorRoster/>
      </div>
    </section>
  );
}
function BeforePricing() {
  const brand = aiInfluencerSignature.brand;
  return (
    <section className="cs-section cs-svc-ai-influencer-package" data-cs-section="signature" aria-labelledby="cs-ai-package-title">
      <div className="cs-container">
        <CsSectionHead id="cs-ai-package-title" eyebrow={brand.eyebrow} title={brand.title} />
        <ol className="cs-svc-ai-influencer-deliverables">
          {brand.items.map((item, index) => <li key={item.title}><span className="cs-t-caption">{String(index + 1).padStart(2, "0")}</span><h3 className="cs-t-h3">{item.title}</h3><p className="cs-t-body">{item.body}</p></li>)}
        </ol>
        <p className="cs-svc-ai-influencer-disclosure cs-t-small">{brand.notice}</p>
      </div>
    </section>
  );
}
export const aiInfluencerLanding: ServiceModule = { Hero, Signature, BeforePricing, worksLayout: "vertical" };
