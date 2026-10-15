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
import { AdRail, AdWorkVariants, type RailCard } from "./ad-reel";
import "./ad.css";

const head = r8Sections.ad;
function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item => item.placement === "ad-signature");
  const samples: RailCard[] = [1,2,3].map(n => {const slot=getSlot(`ad-hook-${n}`);return {kind:"image",src:slot.poster as string,width:540,height:960};});
  const reviewMedia = (works ?? []).filter(item => item.railLead || item === work).flatMap(item => item.media.filter(media => media.poster).map(media => ({kind:"image" as const,src:media.poster as string,width:540,height:960})));
  const media = reviewMedia.length ? reviewMedia : samples;
  const columns = [0,1,2].map(i => Array.from({length:4},(_,j)=>media[(i+j)%media.length]));
  return <ServiceHero data={data} media={<div className="cs-svc-ad-hero-frame"><div className="cs-svc-ad-hero-rails"><AdRail columns={columns} /></div><ReelPlayer slot={getSlot("ad-hero-reel")} hero /></div>} />;
}
function Signature({ works }: ServiceSectionProps) {
  const review = works?.find(item => item.placement === "ad-signature");
  return <>
    <EditorialSection id="ad-hooks" head={head.HOOK}><FigureRow items={r8Details.ad.HOOK.map((item,i)=>({...item,slot:`ad-hook-${i+1}`}))} /><p className="cs-t-small cs-r8-note">세 가지 중 하나를 고르거나 섞어서 첫 장면을 확정합니다</p></EditorialSection>
    <CutBoard board={r8Boards.ad} />
    <EditorialSection id="ad-products" head={head["PRODUCT CLIPS"]}><FigureRow bands items={[
      {title:"고층용 사다리차",body:"사다리가 올라가는 순간을 한 장면으로 보여줍니다",slot:"ad-product-1"},
      {title:"공항 소방차",body:"출동하는 차량의 속도감을 한 장면으로 보여줍니다",slot:"ad-product-2"},
      {title:"원격 조종 소방 로봇",body:"로봇이 비탈을 오르는 움직임을 한 장면으로 보여줍니다",slot:"ad-product-3"},
    ]} /><p className="cs-t-small cs-r8-note">원본이 가로 영상이면 세로 화면 안에 제품 장면을 두고 위아래에 자막을 배치합니다</p></EditorialSection>
    <EditorialSection id="ad-vertical" head={head["VERTICAL EDIT"]}><FigureRow items={[
      {title:"가로 16:9 · 30초",body:"글자와 제품이 가로 구도로 놓인 원본 화면",slot:"ad-vertical-1"},
      {title:"세로 9:16 · 15초",body:"같은 장면을 세로 구도로 다시 배치하고 컷 길이를 줄였습니다",slot:"ad-vertical-2"},
    ]} /><p className="cs-t-small cs-r8-note">기본 납품은 9:16 세로 1080p이며 다른 화면비는 추가 작업으로 안내합니다</p>
    {review && <div className="cs-r8-band"><h3 className="cs-t-h3">{review.title}</h3><AdWorkVariants items={review.media.filter(media => media.kind === "video").map(media => ({src:media.src,poster:media.poster,alt:media.alt}))} label="영상 고르기" tag={review.label} /><a className="cs-link" href={review.href}>작품 보기 →</a></div>}</EditorialSection>
  </>;
}
export const adLanding: ServiceModule = { Hero, Signature, worksLayout: "vertical" };
