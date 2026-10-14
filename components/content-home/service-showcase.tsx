"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { contentHomeServices as services, contentHomeServicesHead as head, pad2 } from "@/lib/content-home";
import type { ContentSelection } from "@/lib/home-journey";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import { ServiceDetail } from "./service-detail";
import { useStageActivity } from "./use-stage-activity";

function WorkMedia({ selection, selected }: { selection:ContentSelection; selected:boolean }) {
 const media=selection.media;
 const comic=selection.tab.id === "webtoon";
 const pages=selection.work?.media.filter(item=>item.kind !== "video").slice(0,2) ?? [];
 const poster=media.kind === "video" ? media.poster : media.src;
 return <div className={`ch-depth-media ${comic ? "ch-depth-media--comic" : media.height > media.width ? "ch-depth-media--portrait" : "ch-depth-media--wide"}`}>
  {comic ? <div className="ch-depth-comic">{(pages.length ? pages : [{src:media.src,alt:media.alt,width:media.width,height:media.height}]).map((page,index)=><Image key={page.src} src={page.src} alt={selected ? page.alt : ""} width={page.width ?? 1024} height={page.height ?? 1536} sizes="(min-width:768px) 260px, 270px" className={index ? "ch-depth-comic-second" : undefined}/>)}</div> : media.kind === "video" && selected ? <video src={media.src} poster={media.poster} controls playsInline preload="none" aria-label={media.alt}/> : poster ? <Image src={poster} alt={selected ? media.alt : ""} fill sizes="(min-width:768px) 540px, 280px"/> : null}
 </div>;
}

/** React selection moves every card through a real 3D transform, never a background-color substitution */
export function ServiceShowcase({ selections }: { selections: ContentSelection[] }) {
 const [current,setCurrent]=useState(0);
 const {root,active:inView,reduced}=useStageActivity();
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const touch=useRef<{x:number;y:number}|null>(null);
 const suppressClick=useRef(false);
 const active=services[current];
 const select=(index:number,focus=false)=>{
  root.current?.querySelectorAll("video").forEach(video=>video.pause());
  const next=(index+services.length)%services.length;
  setCurrent(next);
  if(focus) buttons.current[next]?.focus();
 };
 useEffect(()=>{if(!inView || reduced) root.current?.querySelectorAll("video").forEach(video=>video.pause());},[inView,reduced,root]);
 const keyboard=(event:KeyboardEvent)=>{
  if((event.target as HTMLElement).closest("video"))return;
  let next:number|null=null;
  if(event.key==="ArrowRight")next=current+1;
  if(event.key==="ArrowLeft")next=current-1;
  if(event.key==="Home")next=0;
  if(event.key==="End")next=services.length-1;
  if(next!==null){event.preventDefault();select(next,true);}
 };
 return <section id="services" className="ch-services" data-cs-section="services" aria-labelledby="ch-services-title">
  <div className="cs-container">
   <CsSectionHead id="ch-services-title" eyebrow={head.eyebrow} title={head.title} lead={head.lead}/>
   <div className="ch-gallery ch-gallery--depth" ref={root} data-active={inView ? "true":"false"} onKeyDown={keyboard}>
    <div className="ch-gallery-tabs" role="tablist" aria-label="컨텐츠 서비스 선택">{services.map((service,index)=><button key={service.id} ref={node=>{buttons.current[index]=node;}} type="button" role="tab" id={`ch-tab-${service.id}`} aria-selected={index===current} aria-controls="ch-service-panel" tabIndex={index===current?0:-1} className="ch-tab cs-t-chip" onClick={()=>select(index)}>{service.label}</button>)}</div>
    <div className="ch-depth-stage" aria-label="서비스 작업물 카드" onClickCapture={event=>{if(suppressClick.current){event.preventDefault();event.stopPropagation();suppressClick.current=false;}}} onTouchStart={event=>{
     suppressClick.current=false;
     if((event.target as HTMLElement).closest("video, a, button")){touch.current=null;return;}
     touch.current={x:event.touches[0].clientX,y:event.touches[0].clientY};
    }} onTouchEnd={event=>{
     if(!touch.current)return;
     const dx=event.changedTouches[0].clientX-touch.current.x,dy=event.changedTouches[0].clientY-touch.current.y;
     touch.current=null;
     if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.2){suppressClick.current=true;select(current+(dx<0?1:-1));}
    }}>
     {selections.map((selection,index)=>{
      let distance=index-current;
      if(distance>services.length/2)distance-=services.length;
      if(distance< -services.length/2)distance+=services.length;
      const selected=index===current;
      return <div key={selection.tab.id} className="ch-depth-card" data-pos={distance} aria-hidden={!selected}>
       <WorkMedia selection={selection} selected={selected}/>
       <div className="ch-depth-caption"><span className="cs-t-eyebrow">{selection.tab.label}</span><p className="cs-t-small">{selection.caption ?? selection.tab.line}</p>{selection.tag ? <span className="cs-tag cs-t-caption">{selection.tag}</span>:null}{selected && selection.work ? <Link className="cs-link" href={`/content/projects/${selection.work.slug}?service=${selection.tab.id}`}>작업 자세히 보기 <span aria-hidden="true">↗</span></Link>:null}</div>
       {!selected && Math.abs(distance)<=2 ? <button className="ch-depth-select" type="button" tabIndex={-1} aria-label={`${selection.tab.label} 선택`} onClick={()=>select(index)}/>:null}
      </div>;
     })}
     <div className="ch-depth-nav"><span className="cs-t-caption">{pad2(current+1)} / {pad2(services.length)}</span><div className="ch-arrows"><button type="button" className="ch-arrow" aria-label="이전 서비스" onClick={()=>select(current-1)}>←</button><button type="button" className="ch-arrow" aria-label="다음 서비스" onClick={()=>select(current+1)}>→</button></div></div>
    </div>
    <div className="ch-depth-detail" role="tabpanel" id="ch-service-panel" aria-labelledby={`ch-tab-${active.id}`}><ServiceDetail service={active} index={current}/></div>
    <p className="cs-sr-only" aria-live="polite">{`${current+1} / ${services.length} ${active.label}`}</p>
   </div>
  </div>
 </section>;
}
