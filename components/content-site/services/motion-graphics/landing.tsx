import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import { ServiceHero, FeaturedWork, ProductionNotes } from "../service-hero";
import { WorkSequence } from "../work-sequence";
import "./motion-graphics.css";
import { TypeComposition } from "./type-composition";

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-brand-motion");
  return <ServiceHero data={data} media={<FeaturedWork work={work} fallback={<CsMedia ratio="16x9" src="/creative-v06/video-editing.webp" alt="모션그래픽 화면 구성 연출 예시" tag={MEDIA_TAGS.staged} sizes="(max-width:767px) 90vw, 50vw" priority/>}/>}/>;
}
function Signature({ works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-brand-motion");
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-motion-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-motion-edit-title" eyebrow="DESIGN IN MOTION" title={"한 화면에서\n다음 화면으로"} lead="제품의 크기와 배치, 글자가 나타나는 순서로 읽는 흐름을 만듭니다"/>
    <WorkSequence work={work} labels={["질감을 가까이", "제품을 나란히", "라인업을 한 화면에"]}/>
    <TypeComposition poster={work?.media[0]?.poster}/>
    <ProductionNotes title="모션에 들어가기 전" items={[{title:"자료를 고릅니다",body:"로고 원본과 제품 사진, 확정 문구를 모아 장면별로 나눕니다"},{title:"정지 화면을 맞춥니다",body:"색과 글자 크기, 제품의 위치를 기획안에서 먼저 확인합니다"},{title:"움직임과 박자를 정합니다",body:"문구를 읽을 시간과 다음 장면으로 넘어가는 속도를 조정합니다"}]}/>
    <div className="cs-service-plan-compare"><article><p className="cs-t-eyebrow">SIMPLE</p><h3 className="cs-t-h3">가지고 있는 자료로 구성</h3><p className="cs-t-body">로고와 제품 사진, 확정 문구를 중심으로 화면을 디자인하고 움직임을 더합니다</p><a className="cs-link" href="#pricing">단순형 가격 보기 ↓</a></article><article><p className="cs-t-eyebrow">CUSTOM</p><h3 className="cs-t-h3">전용 캐릭터까지 제작</h3><p className="cs-t-body">설명에 등장할 전용 캐릭터를 만들고 제품과 캐릭터가 만나는 장면을 구성합니다</p><a className="cs-link" href="#pricing">맞춤형 가격 보기 ↓</a></article></div>
  </div></section>;
}
export const motionGraphicsLanding: ServiceModule = { Hero, Signature, worksLayout:"wide" };
