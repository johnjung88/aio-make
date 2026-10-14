import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { animationSignature as sig } from "@/lib/content-site/services/animation";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import "./animation.css";

const STYLE_MEDIA = [
  { src: CONTENT_SITE_ASSETS.animation.src, alt: "보라색 입체 캐릭터 · 연출 예시" },
  { src: "/creative-v06/video-animation.webp", alt: "비 오는 밤의 동화풍 캐릭터와 배경 · 연출 예시" },
  { src: "/renewal/animation-sample.webp", alt: "등불을 든 하얀 캐릭터와 배경 · 연출 예시" },
] as const;

function Hero({ data }: ServiceSectionProps) {
  return <CsHero id={data.id} hero={data.hero} className="cs-svc-animation-hero" media={
    <div className="cs-svc-animation-hero-board">
      <CsMedia ratio="4x5" src={STYLE_MEDIA[0].src} alt={STYLE_MEDIA[0].alt} tag={MEDIA_TAGS.staged} sizes="(max-width: 767px) 90vw, 42vw" priority />
      <div className="cs-svc-animation-board-caption"><span className="cs-t-label">캐릭터에서 하나의 장면으로</span><span className="cs-t-caption">캐릭터 · 배경 · 표정 · 움직임</span></div>
    </div>
  } />;
}
function Styles() {
  return <section className="cs-section cs-svc-animation-styles" data-cs-section="signature" aria-labelledby="cs-animation-styles-title">
    <div className="cs-container">
      <CsSectionHead id="cs-animation-styles-title" eyebrow={sig.styles.eyebrow} title={sig.styles.title} lead={sig.styles.lead} />
      <div className="cs-svc-animation-style-list">{sig.styles.items.map((item,i)=>
        <figure key={item.title} className="cs-svc-animation-style">
          <CsMedia ratio="4x5" src={STYLE_MEDIA[i].src} alt={STYLE_MEDIA[i].alt} tag={MEDIA_TAGS.staged} sizes="(max-width: 767px) 90vw, 30vw" />
          <figcaption><h3 className="cs-t-h3">{item.title}</h3><p className="cs-t-body">{item.body}</p></figcaption>
        </figure>
      )}</div>
    </div>
  </section>;
}
function BeforeMotion() {
  const items=[
    {number:"01",title:"이야기와 장면 순서",body:"누가 어떤 문제를 만나고 어떻게 달라지는지 정리합니다",result:"줄거리 · 장면별 전달 내용"},
    {number:"02",title:"캐릭터와 분위기",body:"캐릭터의 외형과 표정, 배경의 질감과 색을 맞춥니다",result:"캐릭터 기준 · 주요 장면 이미지"},
    {number:"03",title:"동작과 화면 전환",body:"확정한 장면에 움직임을 더하고 전체 흐름을 편집합니다",result:"30초 또는 60초 완성 영상"},
  ];
  return <section className="cs-section cs-svc-animation-planning" data-cs-section="signature" aria-labelledby="cs-animation-plan-title"><div className="cs-container">
    <CsSectionHead id="cs-animation-plan-title" eyebrow="BEFORE MOTION" title={"움직이기 전에\n먼저 확인하는 것"} lead="장면이 달라지면 작업도 달라집니다  이야기와 그림체를 먼저 확인하고 제작을 시작합니다" />
    <ol className="cs-svc-animation-plan-list">{items.map(item=><li key={item.number}>
      <span className="cs-t-caption">{item.number}</span><div><h3 className="cs-t-h3">{item.title}</h3><p className="cs-t-body">{item.body}</p></div><p className="cs-t-small">{item.result}</p>
    </li>)}</ol>
  </div></section>;
}
function Signature(){return <><Styles/><BeforeMotion/></>;}
export const animationLanding: ServiceModule={Hero,Signature,worksLayout:"vertical"};
