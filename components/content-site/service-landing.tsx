/* 서비스 id → 서비스 모듈 레지스트리(WP0 전용, 이후 수정 금지).
 * 섹션 순서·공통 블록·바탕 순서를 여기서 고정한다(BRIEF_P2R_SERVICES 0-1, BRIEF_P2R 4-10). */
import { contentLandings } from "@/lib/content-site";
import type { ContentServiceId, CsWorkCard } from "@/lib/content-site/types";
import { CsFaq } from "./blocks/faq";
import { CsInquiry } from "./blocks/inquiry";
import { CsPricing } from "./blocks/pricing";
import { CsProcess } from "./blocks/process";
import { CsRelated } from "./blocks/related";
import { CsScope } from "./blocks/scope";
import { CsTypes } from "./blocks/types";
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
      <Hero data={data} />
      <CsTypes types={data.types} />
      {Signature ? <Signature data={data} /> : null}
      <CsWorks works={works} layout={worksLayout} />
      {BeforePricing ? <BeforePricing data={data} /> : null}
      <CsPricing id={id} />
      <CsProcess process={data.process} />
      <CsScope scope={data.scope} />
      <CsFaq id={id} faq={data.faq} />
      <CsInquiry service={id} copy={data.inquiry} />
      <CsRelated current={id} />
    </div>
  );
}
