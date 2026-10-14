/* 모션그래픽 서비스 모듈(R6 WP-B). 섹션 순서: 히어로 → 화면 전환 시퀀스 → 캐릭터 제작 사례 → (공통) 가격 → 진행 → FAQ → 문의 → 다른 서비스.
 * 공개판은 example-media 슬롯(motion-hero-1, motion-scene-1..3)으로 히어로와 장면 전환을 채우고, 검토판은 서버가 고른 실제 작품을 먼저 쓴다.
 * 이 서비스에는 client 섬이 없다. */
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { getSlot } from "@/lib/content-site/example-media";
import { ServiceHero, FeaturedWork, ExampleFigure } from "../service-hero";
import { WorkSequence } from "../work-sequence";
import { CharacterCase } from "./character-case";
import "./motion-graphics.css";

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-brand-motion");
  return <ServiceHero data={data} media={<FeaturedWork work={work} fallback={<ExampleFigure className="cs-svc-motion-graphics-hero-example" slot={getSlot("motion-hero-1")} sizes="(max-width:767px) 90vw, 50vw" priority/>}/>}/>;
}
function Signature({ works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-brand-motion");
  return <>
    <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-motion-edit-title"><div className="cs-container">
      <CsSectionHead id="cs-motion-edit-title" eyebrow="DESIGN IN MOTION" title={"한 화면에서\n다음 화면으로"} lead="제품의 크기와 배치, 글자가 나타나는 순서로 읽는 흐름을 만듭니다"/>
      <WorkSequence work={work} service="motion-graphics" labels={["질감을 가까이", "제품을 나란히", "라인업을 한 화면에"]} exampleLabels={["색과 질감으로 시작", "제품을 화면 중앙에", "문구가 들어갈 여백으로"]}/>
    </div></section>
    <CharacterCase works={works}/>
  </>;
}
export const motionGraphicsLanding: ServiceModule = { Hero, Signature, worksLayout:"wide" };
