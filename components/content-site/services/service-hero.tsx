import Image from "next/image";
import type { ReactNode } from "react";
import { startingPrice } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import type { CsWorkCard, CsWorkMedia, ServiceLandingData } from "@/lib/content-site/types";
import { focusData, type ExampleSlot } from "@/lib/content-site/example-media";
import { CsPrice } from "../ui/price";
import { CsTag } from "../ui/tag";
import "./service-editorial.css";
import { LoopVideo, MotionCanvas, MotionTitle, WorkPreview } from "./motion-runtime";

/** Title, work, decision copy is also the DOM order on a narrow screen */
export function ServiceHero({ data, media, wide = false }: { data: ServiceLandingData; media: ReactNode; wide?: boolean }) {
  const price = startingPrice(data.id, true);
  return <section className={`cs-hero cs-service-editorial-hero${wide ? " cs-service-editorial-hero--wide" : ""}`} data-cs-section="hero" aria-labelledby="cs-hero-title">
    <div className="cs-container cs-service-editorial-grid">
      <div className="cs-service-editorial-heading"><p className="cs-t-eyebrow">{data.hero.eyebrow}</p><MotionTitle title={data.hero.title}/></div>
      <div className="cs-service-editorial-media"><MotionCanvas variant={data.id}>{media}</MotionCanvas></div>
      <div className="cs-service-editorial-copy">
        <p className="cs-t-lead">{data.hero.lead}</p>
        <div className="cs-service-editorial-price"><CsPrice id={data.id}/>{price?.note && <p className="cs-t-small">{price.note}</p>}{data.hero.note && <p className="cs-t-small">{data.hero.note}</p>}</div>
        <div className="cs-hero-actions"><a href="#inquiry" className="cs-btn cs-btn--primary cs-btn--lg">{CS_COPY.hero.primary} <span aria-hidden="true">↓</span></a><a href="#pricing" className="cs-btn cs-btn--ghost cs-btn--lg">{CS_COPY.hero.secondary} <span aria-hidden="true">↓</span></a></div>
        <ul className="cs-hero-facts" aria-label={CS_COPY.hero.factsLabel}>{data.hero.facts.map(fact=><li key={fact} className="cs-t-small">{fact}</li>)}</ul>
      </div>
    </div>
  </section>;
}

/** Only receives server-selected works: never consults the raw review catalog */
export function FeaturedWork({ work, media, fallback }: { work?: CsWorkCard; media?: CsWorkMedia; fallback: ReactNode }) {
  const asset = media ?? work?.media[0];
  if (!work || !asset) return fallback;
  const portrait = asset.presentation === "portrait" || (asset.width && asset.height && asset.height > asset.width);
  return <figure className={`cs-service-featured${portrait ? " cs-service-featured--portrait" : ""}`}>
    {asset.kind === "video" ? <WorkPreview src={asset.src} poster={asset.poster} label={`${work.title} · ${work.label}`}/> : <Image src={asset.src} alt={asset.alt} width={asset.width ?? (portrait ? 900 : 1600)} height={asset.height ?? (portrait ? 1600 : 900)} sizes="(max-width:767px) 90vw, 50vw" priority />}
    <figcaption><div><p className="cs-t-caption">{work.brand} · {work.label}</p><p className="cs-t-label">{work.title}</p></div><a className="cs-link" href={work.href}>작품 보기 <span aria-hidden="true">↗</span></a></figcaption>
  </figure>;
}

/** 공개판 연출 예시 슬롯 한 칸. 이미지는 느린 켄번스, 영상은 보이는 동안만 무음 반복. 표기는 슬롯 label */
export function ExampleFigure({ slot, sizes, priority = false, className = "" }: { slot: ExampleSlot; sizes: string; priority?: boolean; className?: string }) {
  return <figure className={`cs-example-figure ${className}`} data-aspect={slot.aspect} data-kind={slot.kind}>
    <div className="cs-example-frame">
      {slot.kind === "video"
        ? <LoopVideo className="cs-example-video" src={slot.src} poster={slot.poster} label={slot.alt}/>
        : <Image className="cs-example-image" src={slot.src} alt={slot.alt} width={slot.width} height={slot.height} sizes={sizes} priority={priority} {...focusData(slot.focus)}/>}
    </div>
    <CsTag overlay>{slot.label}</CsTag>
  </figure>;
}

export function ProductionNotes({ title, items }: { title: string; items: { title: string; body: string }[] }) {
  return <div className="cs-service-production"><h3 className="cs-t-h3">{title}</h3><ol>{items.map((item,index)=><li key={item.title}><span className="cs-t-caption">{String(index+1).padStart(2,"0")}</span><div><h4 className="cs-t-label">{item.title}</h4><p className="cs-t-small">{item.body}</p></div></li>)}</ol></div>;
}
