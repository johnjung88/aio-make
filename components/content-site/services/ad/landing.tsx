import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { MEDIA_TAGS, CONTENT_SITE_ASSETS } from "@/lib/content-site/types";
import { ServiceHero, FeaturedWork, ProductionNotes } from "../service-hero";
import { WorkSequence } from "../work-sequence";
import "./ad.css";
import { AdReel } from "./ad-reel";

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-aqua-ad");
  return <ServiceHero data={data} media={<AdReel enabled={Boolean(work)}><FeaturedWork work={work} fallback={<CsMedia ratio="2x3" src={CONTENT_SITE_ASSETS.brand.src} alt="향수 제품 이미지 연출 예시" tag={MEDIA_TAGS.staged} sizes="(max-width:767px) 90vw, 50vw" priority/>}/></AdReel>}/>;
}
function Signature({ works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-aqua-ad");
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-ad-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-ad-edit-title" eyebrow="VERTICAL EDIT" title={"사용하는 순간을\n보여주는 광고"} lead="첫 장면에서 상황을 전하고 제품을 쓰는 과정으로 이어갑니다"/>
    <WorkSequence work={work} portrait labels={["퇴근 후의 일상", "사용 방법을 자막으로", "사용 장면으로 마무리"]}/>
    {work && <p className="cs-t-small cs-service-review-note">{work.label} · 실제 영상에서 발췌한 장면</p>}
    <ProductionNotes title="한 제품, 한 콘셉트" items={[{title:"첫 화면에 담을 상황",body:"누가 언제 제품을 찾는지 정하고 시작 문구를 씁니다"},{title:"보여줄 제품의 특징",body:"제품 사진과 설명 자료를 바탕으로 필요한 장면과 자막을 고릅니다"},{title:"게시할 세로 화면",body:"9:16 화면에 맞춰 편집하고 기본 자막과 배경음악을 더합니다"}]}/>
  </div></section>;
}
export const adLanding: ServiceModule = { Hero, Signature, worksLayout:"vertical" };
