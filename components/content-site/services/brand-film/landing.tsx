import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { MEDIA_TAGS, CONTENT_SITE_ASSETS } from "@/lib/content-site/types";
import { ServiceHero, FeaturedWork, ProductionNotes } from "../service-hero";
import "./brand-film.css";
import { FilmTimeline } from "./film-timeline";

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-brand-ad") ?? works?.find(item=>item.media.some(media=>media.kind==="video"));
  return <ServiceHero data={data} wide media={<FeaturedWork work={work} fallback={<CsMedia kind="video" ratio="16x9" src={CONTENT_SITE_ASSETS.brandMotion.src} poster={CONTENT_SITE_ASSETS.hero.src} alt="색과 질감을 표현한 브랜드 영상 연출 예시" tag={MEDIA_TAGS.stagedMuted} controls preload="none"/>}/>}/>;
}
function Signature() {
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-brand-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-brand-edit-title" eyebrow="FILM DIRECTION" title={"무엇을 보여주고\n무엇을 남길지"} lead="소개 자료의 모든 내용을 담기보다 영상을 보는 사람이 기억할 내용을 먼저 고릅니다"/>
    <ProductionNotes title="소개 자료를 영상으로" items={[{title:"고객이 겪는 상황",body:"제품이나 서비스가 필요한 순간을 도입 장면으로 정리합니다"},{title:"제품과 일하는 방식",body:"제품의 특징과 회사가 하는 일을 자료와 장면으로 설명합니다"},{title:"마지막에 남길 정보",body:"브랜드 이름과 핵심 문구, 이어서 볼 정보와 문의 경로를 정합니다"}]}/>
    <FilmTimeline/>
    <p className="cs-service-review-note cs-t-small">길이별 구성 예시이며 실제 장면 순서는 기획안에서 정합니다</p>
  </div></section>;
}
export const brandFilmLanding: ServiceModule = { Hero, Signature, worksLayout:"wide" };
