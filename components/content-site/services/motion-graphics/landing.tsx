import type { ServiceModule, ServiceSectionProps } from "../../module";
import { getSlot } from "@/lib/content-site/example-media";
import { r8Sections } from "@/lib/content-site/r8-sections";
import { r8Details } from "@/lib/content-site/r8-details";
import { r8Boards } from "@/lib/content-site/r8-boards";
import { ServiceHero } from "../service-hero";
import { EditorialSection } from "../editorial-section";
import { FigureRow } from "../figure-row";
import { CutBoard } from "../cut-board";
import { ReelPlayer } from "../reel-player";
import { CharacterCase } from "./character-case";
import "./motion-graphics.css";

const head = r8Sections["motion-graphics"];
function Hero({ data }: ServiceSectionProps) { return <ServiceHero data={data} wide media={<ReelPlayer slot={getSlot("motion-hero-reel")} hero />} />; }
function Signature({ works }: ServiceSectionProps) {
  return <>
    <EditorialSection id="motion-grammar" head={head["MOTION GRAMMAR"]}><FigureRow items={r8Details["motion-graphics"]["MOTION GRAMMAR"].map((item, i) => ({ ...item, slot: `motion-grammar-${i + 1}` }))} /></EditorialSection>
    <CutBoard board={r8Boards["motion-graphics"]} />
    <EditorialSection id="motion-planning" className="cs-svc-motion-graphics-planning" head={head["PLANNING SHEET"]}><FigureRow items={[
      {title:"스타일프레임",body:"색과 서체, 질감을 정지 화면으로 확인합니다",slot:"motion-plan-1"},
      {title:"비트시트",body:"컷의 흐름을 한 장에 모아 순서와 길이를 확인합니다",slot:"motion-plan-2"},
      {title:"서체 비교",body:"국문 서체 후보를 같은 문장으로 놓고 비교해 고릅니다",slot:"motion-plan-3"},
    ]} /></EditorialSection>
    <CharacterCase works={works} />
  </>;
}
export const motionGraphicsLanding: ServiceModule = { Hero, Signature, worksLayout: "wide" };
