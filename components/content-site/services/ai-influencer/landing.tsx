import Image from "next/image";
import { CreatorDeck } from "./creator-experience";
import { ServiceHero } from "../service-hero";
import { aiInfluencerSignature as sig } from "@/lib/content-site/services/ai-influencer";
import { getSlot } from "@/lib/content-site/example-media";
import { r8Sections } from "@/lib/content-site/r8-sections";
import { r8Details } from "@/lib/content-site/r8-details";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { EditorialSection } from "../editorial-section";
import { FigureRow } from "../figure-row";
import { ReelPlayer } from "../reel-player";
import "./ai-influencer.css";

const head = r8Sections["ai-influencer"];
function Hero({ data }: ServiceSectionProps) { return <ServiceHero data={data} media={<ReelPlayer slot={getSlot("ai-hero-reel")} hero />} />; }
function Signature() {
  return <>
    <EditorialSection id="ai-package" head={head["BRAND CHARACTER"]}>
      <FigureRow items={r8Details["ai-influencer"]["BRAND CHARACTER"]} />
      <div className="cs-r8-band"><p className="cs-t-caption">별도 견적</p><h3 className="cs-t-h3">계정 게시·운영</h3><p className="cs-t-body">인물을 계정에 올리고 운영하는 일은 인물 제작과 따로 견적을 드립니다</p></div>
    </EditorialSection>
    <EditorialSection id="sheet" head={head["CHARACTER SHEET"]}>
      <div className="cs-r8-two"><ul className="cs-svc-ai-influencer-sheet" aria-label={sig.sheet.viewsLabel}>{sig.sheet.views.map(view => <li key={view.id}><Image src={`/content-site/ai-influencer/unnie87-${view.id}.webp`} alt={view.alt} width={720} height={960} sizes="(min-width:1024px) 25vw, 45vw" /><p className="cs-t-label">{view.label}</p></li>)}</ul>
        <div><p className="cs-t-caption">{sig.sheet.profile.role}</p><h3 className="cs-t-h3">{sig.sheet.profile.name}</h3><p className="cs-t-body">{sig.sheet.profile.body}</p><dl className="cs-svc-ai-influencer-rules">{sig.sheet.rows.map(row => <div key={row.term}><dt className="cs-t-label">{row.term}</dt><dd className="cs-t-body">{row.detail}</dd></div>)}</dl></div>
      </div><p className="cs-t-small cs-r8-note">{sig.sheet.note}</p><p className="cs-t-caption">AI 가상인물 · 연출 예시</p>
    </EditorialSection>
    <EditorialSection id="ai-products" head={head["ONE CHARACTER"]}><FigureRow snap items={["제품 영상 시안 · 세럼 · 18초","제품 영상 시안 · 세럼 · 20초","제품 영상 시안 · 클렌저 · 20초"].map((title,i)=>({title,body:"AI 가상인물 출연 · 제안용 시안",slot:`ai-product-reel-${i+1}`}))} /><p className="cs-t-small cs-r8-note">제안용 시안이며 게시용이 아닙니다</p></EditorialSection>
    <EditorialSection id="ai-creators" head={head["OUR CREATORS"]}><CreatorDeck /></EditorialSection>
    <EditorialSection id="ai-disclosure" head={{eyebrow:"DISCLOSURE",title:sig.disclosure.title,lead:sig.disclosure.body}}><ul className="cs-svc-ai-influencer-disclosure">{sig.disclosure.items.map(item=><li className="cs-tag cs-t-caption" key={item}>{item}</li>)}</ul></EditorialSection>
  </>;
}
export const aiInfluencerLanding: ServiceModule = { Hero, Signature, worksLayout: "vertical" };
