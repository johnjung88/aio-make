/* 모션그래픽 서비스 모듈(R5 WP-S1). 공개판은 example-media 슬롯(motion-hero-1, motion-bg-1, motion-scene-1..3)으로
 * 장면 전환과 live 구성을 채우고, 검토판은 서버가 고른 실제 작품을 먼저 쓴다. */
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { focusData, getSlot } from "@/lib/content-site/example-media";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import { ServiceHero, FeaturedWork, ProductionNotes, ExampleFigure } from "../service-hero";
import { WorkSequence } from "../work-sequence";
import "./motion-graphics.css";
import { TypeComposition } from "./type-composition";

/** 검토판은 실제 작품 포스터, 공개판은 연출 예시 슬롯 */
function slotImage(id: string) {
  const slot = getSlot(id);
  return { src: slot.src, alt: "", width: slot.width, height: slot.height, ...focusData(slot.focus) };
}
function compositionImage(poster?: string) {
  return poster ? { src: poster, alt: "", width: 900, height: 506 } : slotImage("motion-scene-2");
}

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-brand-motion");
  return <ServiceHero data={data} media={<FeaturedWork work={work} fallback={<ExampleFigure className="cs-svc-motion-graphics-hero-example" slot={getSlot("motion-hero-1")} sizes="(max-width:767px) 90vw, 50vw" priority/>}/>}/>;
}
function Signature({ works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-brand-motion");
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-motion-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-motion-edit-title" eyebrow="DESIGN IN MOTION" title={"한 화면에서\n다음 화면으로"} lead="제품의 크기와 배치, 글자가 나타나는 순서로 읽는 흐름을 만듭니다"/>
    <WorkSequence work={work} service="motion-graphics" labels={["질감을 가까이", "제품을 나란히", "라인업을 한 화면에"]} exampleLabels={["색과 질감으로 시작", "제품을 화면 중앙에", "문구가 들어갈 여백으로"]}/>
    <TypeComposition image={compositionImage(work?.media[0]?.poster)} background={slotImage("motion-bg-1")} tag={MEDIA_TAGS.staged}/>
    <ProductionNotes title="모션에 들어가기 전" items={[{title:"자료를 고릅니다",body:"로고 원본과 제품 사진, 확정 문구를 모아 장면별로 나눕니다"},{title:"정지 화면을 맞춥니다",body:"색과 글자 크기, 제품의 위치를 기획안에서 먼저 확인합니다"},{title:"움직임과 박자를 정합니다",body:"문구를 읽을 시간과 다음 장면으로 넘어가는 속도를 조정합니다"}]}/>
    <div className="cs-service-plan-compare"><article><p className="cs-t-eyebrow">SIMPLE</p><h3 className="cs-t-h3">가지고 있는 자료로 구성</h3><p className="cs-t-body">로고와 제품 사진, 확정 문구를 중심으로 화면을 디자인하고 움직임을 더합니다</p><a className="cs-link" href="#pricing">단순형 가격 보기 ↓</a></article><article><p className="cs-t-eyebrow">CUSTOM</p><h3 className="cs-t-h3">전용 캐릭터까지 제작</h3><p className="cs-t-body">설명에 등장할 전용 캐릭터를 만들고 제품과 캐릭터가 만나는 장면을 구성합니다</p><a className="cs-link" href="#pricing">맞춤형 가격 보기 ↓</a></article></div>
  </div></section>;
}
export const motionGraphicsLanding: ServiceModule = { Hero, Signature, worksLayout:"wide" };
