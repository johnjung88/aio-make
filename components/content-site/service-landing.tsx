/* 서비스 id → 서비스 모듈 레지스트리.
 * R6 섹션 순서(BRIEF_R6 2절): Hero → Signature → (BeforePricing) → Pricing(+포함·별도) → Process → Works(검토판) → FAQ → Inquiry → Related.
 * CsTypes 렌더와 CsScope 별도 섹션은 없다(Scope는 CsPricing 아래 2열 텍스트로 흡수). */
import { contentLandings } from "@/lib/content-site";
import type { ContentServiceId, CsWorkCard } from "@/lib/content-site/types";
import { CsFaq } from "./blocks/faq";
import { CsInquiry } from "./blocks/inquiry";
import { CsPricing } from "./blocks/pricing";
import { CsProcess } from "./blocks/process";
import { CsRelated } from "./blocks/related";
import { CsWorks } from "./blocks/works";
import type { ServiceModule } from "./module";
import { adLanding } from "./services/ad/landing";
import { aiInfluencerLanding } from "./services/ai-influencer/landing";
import { animationLanding } from "./services/animation/landing";
import { brandFilmLanding } from "./services/brand-film/landing";
import { motionGraphicsLanding } from "./services/motion-graphics/landing";
import { webtoonLanding } from "./services/webtoon/landing";

const registry: Record<ContentServiceId, ServiceModule> = {
  webtoon: webtoonLanding,
  animation: animationLanding,
  "ai-influencer": aiInfluencerLanding,
  "motion-graphics": motionGraphicsLanding,
  "brand-film": brandFilmLanding,
  ad: adLanding,
};

export function ServiceLanding({
  id,
  works,
}: {
  id: ContentServiceId;
  works: CsWorkCard[];
}) {
  const data = contentLandings[id];
  const { Hero, Signature, BeforePricing, worksLayout } = registry[id];
  return (
    <div className={`cs-landing cs-svc-${id}`}>
      <Hero data={data} works={works} />
      {Signature ? <Signature data={data} works={works} /> : null}
      {BeforePricing ? <BeforePricing data={data} /> : null}
      <CsPricing id={id} scope={data.scope} />
      <CsProcess process={data.process} />
      <CsWorks works={works} layout={worksLayout} />
      <CsFaq id={id} faq={data.faq} />
      <CsInquiry service={id} copy={data.inquiry} />
      <CsRelated current={id} />
    </div>
  );
}
