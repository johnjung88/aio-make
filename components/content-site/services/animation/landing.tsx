/* 애니메이션 서비스 모듈(R5 WP-S1).
 * 검토판은 서버가 고른 실제 작품을 먼저 쓰고, 공개판은 example-media 슬롯(animation-hero-1, animation-scene-1..3)으로
 * 같은 깊이 장면 전환을 보여준다. 고객 정보는 서버에서만 다룬다. */
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { getSlot } from "@/lib/content-site/example-media";
import { ServiceHero, FeaturedWork, ProductionNotes, ExampleFigure } from "../service-hero";
import { WorkSequence } from "../work-sequence";
import "./animation.css";

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "yofree-night-motion");
  return <ServiceHero data={data} media={<FeaturedWork work={work} fallback={<ExampleFigure className="cs-svc-animation-hero-example" slot={getSlot("animation-hero-1")} sizes="(max-width:767px) 90vw, 50vw" priority/>}/>}/>;
}
function Signature({ works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "yofree-night-motion");
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-animation-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-animation-edit-title" eyebrow="CHARACTER & SCENE" title={"표정이 달라지고\n장면이 이어집니다"} lead="인물과 배경을 먼저 정하고 대사에 맞춰 화면의 거리와 전환을 설계합니다"/>
    <WorkSequence work={work} portrait service="animation" labels={["인물의 상황을 소개", "대화로 이어지는 장면", "다른 인물의 시선"]} exampleLabels={["아치 아래 첫 등장", "비 오는 밤의 다리 위", "노을 진 마을로 이어지는 길"]}/>
    {work && <p className="cs-t-small cs-service-review-note">웹툰 기반 영상 제작 예시 · {work.label}</p>}
    <ProductionNotes title="그림에서 영상으로" items={[{title:"캐릭터의 기준",body:"기존 캐릭터가 있다면 원본을 확인하고 없다면 외형과 표정을 정합니다"},{title:"장면별 이미지",body:"대사와 행동에 맞춰 배경, 구도, 인물의 위치를 기획안에 담습니다"},{title:"움직임과 편집",body:"확정한 장면에 표정과 동작, 화면 전환을 더해 30초 또는 60초 영상으로 만듭니다"}]}/>
  </div></section>;
}
export const animationLanding: ServiceModule = { Hero, Signature, worksLayout:"vertical" };
