import { creatorRoster } from "@/lib/content-site/creator-roster";
import { HERO_TITLE_ID, CsHeroCopy } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import "./ai-influencer.css";

function Hero({ data }: ServiceSectionProps) {
  return (
    <section className="cs-hero cs-svc-ai-influencer-hero" data-cs-section="hero" aria-labelledby={HERO_TITLE_ID}>
      <div className="cs-container"><div className="cs-grid cs-hero-grid">
        <div className="cs-col-7"><CsHeroCopy id={data.id} hero={data.hero} /></div>
        <div className="cs-col-5 cs-svc-ai-influencer-cast">
          {creatorRoster.map((creator, i) => (
            <a key={creator.id} href={`#creator-${creator.id}`} className="cs-svc-ai-influencer-cast-card">
              <CsMedia ratio="3x4" src={creator.portrait} alt={`${creator.name} · AI 가상인물`} sizes="(max-width: 767px) 43vw, 22vw" priority={i === 0} />
              <span className="cs-svc-ai-influencer-cast-name cs-t-label">{creator.name}</span>
            </a>
          ))}
          <p className="cs-svc-ai-influencer-cast-note cs-t-caption">자체 IP · AI 가상인물 4명</p>
        </div>
      </div></div>
    </section>
  );
}
function Signature() {
  return (
    <section id="sheet" className="cs-section cs-svc-ai-influencer-roster" data-cs-section="signature" aria-labelledby="cs-ai-roster-title">
      <div className="cs-container">
        <CsSectionHead id="cs-ai-roster-title" eyebrow="OUR CREATORS" title={"서로 다른 취향\n각자의 이야기"} lead="얼굴뿐 아니라 말투와 관심사, 일상의 분위기까지 계정마다 다르게 설계합니다" />
        <p className="cs-svc-ai-influencer-editor-note cs-t-small">자체 IP 계정 소개 · 피드 구성 예시</p>
        <div className="cs-svc-ai-influencer-accounts">
          {creatorRoster.map((creator) => (
            <article key={creator.id} id={`creator-${creator.id}`} className="cs-svc-ai-influencer-account" aria-labelledby={`creator-${creator.id}-name`}>
              <div className="cs-svc-ai-influencer-account-head">
                <div className="cs-svc-ai-influencer-avatar"><CsMedia ratio="1x1" src={creator.portrait} alt={`${creator.name} 프로필 · AI 가상인물`} sizes="64px" /></div>
                <div className="cs-svc-ai-influencer-account-name"><span className="cs-t-caption">{creator.category}</span><h3 id={`creator-${creator.id}-name`} className="cs-t-h3">{creator.name}</h3></div>
                <span className="cs-svc-ai-influencer-label cs-t-caption">AI 가상인물</span>
              </div>
              <div className="cs-svc-ai-influencer-account-copy"><p className="cs-t-label">{creator.line}</p><p className="cs-t-small">{creator.bio}</p></div>
              <div className="cs-svc-ai-influencer-feed" aria-label={`${creator.name} 이미지 포트폴리오`}>
                {creator.images.map((item) => <figure key={item.src}><CsMedia ratio="3x4" src={item.src} alt={`${creator.name} ${item.label} 이미지 · AI 가상인물`} sizes="(max-width: 767px) 29vw, 15vw" /><figcaption className="cs-t-caption">{item.label}</figcaption></figure>)}
              </div>
              <div className="cs-svc-ai-influencer-account-foot"><p className="cs-t-small">{creator.direction}</p><p className="cs-t-caption">{creator.account}</p></div>
            </article>
          ))}
        </div>
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
