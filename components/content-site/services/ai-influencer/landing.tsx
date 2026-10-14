import { CreatorDeck, CreatorRoster } from "./creator-experience";
import { ServiceHero } from "../service-hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import "./ai-influencer.css";

function Hero({ data }: ServiceSectionProps) {
  return <ServiceHero data={data} media={<CreatorDeck/>}/>;
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
  return (
    <section className="cs-section cs-section--sm cs-svc-ai-influencer-package" data-cs-section="signature" aria-labelledby="cs-ai-package-title">
      <div className="cs-container">
        <CsSectionHead id="cs-ai-package-title" eyebrow="YOUR BRAND CHARACTER" title={"우리 브랜드에는\n어떤 인물이 어울릴까요"} lead="브랜드 전용 인물의 외형과 성격부터 정하고 제품 이미지와 숏폼으로 확장합니다" />
        <ol className="cs-svc-ai-influencer-deliverables">
          {[
            ["01", "캐릭터 기준", "얼굴과 헤어, 스타일을 정하고 같은 인물을 재현할 기준 이미지를 준비합니다"],
            ["02", "이미지 구성", "제품에 맞춰 인물의 의상과 공간, 표정과 구도를 기획합니다"],
            ["03", "영상 확장", "선택한 구성에 따라 30초 영상을 만들고 화면에 AI 가상인물을 표시합니다"],
          ].map(([number, title, body]) => <li key={number}><span className="cs-t-caption">{number}</span><h3 className="cs-t-h3">{title}</h3><p className="cs-t-body">{body}</p></li>)}
        </ol>
        <p className="cs-svc-ai-influencer-disclosure cs-t-small">AI 가상인물 표기 · 광고 표기 · 플랫폼 합성 컨텐츠 설정을 함께 안내합니다</p>
      </div>
    </section>
  );
}
export const aiInfluencerLanding: ServiceModule = { Hero, Signature, BeforePricing, worksLayout: "vertical" };
