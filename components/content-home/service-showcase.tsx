"use client";
/* 승인된 3D 배치를 유지한다. 수동 정지/재개와 실제 작품 보기를 제공하고 화면 밖·숨김 탭·감소모션·수동정지·작품보기 중 자동 넘김을 멈춘다. */
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contentLinkProps } from "@/lib/new-tab";
import { NewTabHint } from "@/components/new-tab-hint";
import {
 contentHomeServices as services,
 contentHomeServicesHead as head,
 homeCardMedia,
 homeCarouselMotion,
} from "@/lib/content-home";
import { startingPrice } from "@/lib/content-pricing";
import type { ContentSelection } from "@/lib/home-journey";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import { useCsMotion } from "@/components/content-site/shell/frame";
import { useStageActivity } from "./use-stage-activity";
import { HomeArtwork } from "./home-artwork";
import { HomeCasePreview } from "./home-case-preview";
import type { ContentServiceId } from "@/lib/content-home";

type Page = { src:string; alt:string; width:number; height:number };
type CardMedia =
 | { kind:"video"; src:string; poster?:string; alt:string; slot:string|null }
 | { kind:"image"; src:string; alt:string; slot:string|null }
 | { kind:"comic"; pages:Page[]; slot:string|null };

/** 공개 허용된 실제 소재만 사용하고 private 검토 카탈로그는 읽지 않는다 */
function cardMedia(selection:ContentSelection):CardMedia {
 const alt=homeCardMedia[selection.tab.id].alt;

 const slot=homeCardMedia[selection.tab.id];
 if(slot.video) {
  const poster = selection.tab.id === "motion-graphics" ? "/content-fb3/motion-05.webp"
   : selection.tab.id === "brand-film" ? "/content-fb3/healernet-16.webp"
   : selection.tab.id === "ad" ? "/service-detail-v14/sns-cplus-ending.webp" : slot.poster;
  return {kind:"video",src:slot.video,poster,alt,slot:slot.slotId};
 }

 return {kind:"image",src:slot.poster,alt,slot:slot.slotId};
}

/** 선택된 카드에만 마운트한다. 재생은 play()로만(서버 HTML에 autoplay 속성 없음) */
function CardVideo({ media, play, reduced }: { media:Extract<CardMedia,{kind:"video"}>; play:boolean; reduced:boolean }) {
 const ref=useRef<HTMLVideoElement>(null);
 useEffect(()=>{
  const node=ref.current;
  if(!node)return;
  if(play){node.muted=true;node.play().catch(()=>{});}
  else node.pause();
 },[play]);
 return <video ref={ref} src={media.src} poster={media.poster} muted loop playsInline preload="metadata" controls={reduced} aria-label={media.alt}/>;
}

function WorkMedia({ id, media, selected, play, reduced }: { id:ContentServiceId; media:CardMedia; selected:boolean; play:boolean; reduced:boolean }) {
 const shape=media.kind==="comic" ? "ch-depth-media--comic" : "ch-depth-media--wide";
 let body:ReactNode=null;
 if(media.kind==="comic") body=<div className="ch-kb ch-depth-comic">{media.pages.map((page,index)=><Image key={page.src} src={page.src} alt={selected ? page.alt : ""} width={page.width} height={page.height} sizes="(min-width:768px) 260px, 270px" className={index ? "ch-depth-comic-second" : undefined}/>)}</div>;
 else if(media.kind==="video" && selected) body=<CardVideo media={media} play={play} reduced={reduced}/>;
 else if(media.kind==="image") body=<HomeArtwork id={id} alt={selected}/>;
 else {
  const src=media.poster;
  body=src ? <div className="ch-kb"><Image src={src} alt={selected ? media.alt : ""} fill sizes="(min-width:768px) 540px, 280px"/></div> : null;
 }
 return <div className={`ch-depth-media ${shape}`} data-slot={media.slot ?? undefined} data-kind={media.kind}>{body}</div>;
}

export function ServiceShowcase({ selections, heading = head }: { selections: ContentSelection[]; heading?: { eyebrow: string; title: string; titleEm: string } }) {
 const path=usePathname();
 const [current,setCurrent]=useState(0);
 const [hover,setHover]=useState(false);
 const [focusPause,setFocusPause]=useState(false);
 const [touching,setTouching]=useState(false);
 const [manualPaused,setManualPaused]=useState(false);
 const [previewId,setPreviewId]=useState<ContentServiceId|null>(null);
 const {root,active:inView,reduced}=useStageActivity();
 const {motion}=useCsMotion();
 const touch=useRef<{x:number;y:number}|null>(null);
 const suppressClick=useRef(false);
 const count=selections.length;
 const cards=selections.map(cardMedia);
 const moving=inView && motion==="on" && !reduced && !manualPaused && !previewId;
 const autoplay=!reduced;
 const running=moving && !hover && !focusPause && !touching;
 const dwellMs=cards[current]?.kind==="video" ? homeCarouselMotion.videoDwellMs : homeCarouselMotion.dwellMs;
 const activeService=services.find(item=>item.id===selections[current]?.tab.id) ?? services[current];

 /** 이동 전에 재생 중인 영상을 멈춘다(선택 카드가 바뀌면 이전 영상은 언마운트된다) */
 const select=(index:number)=>{
  root.current?.querySelectorAll("video").forEach(video=>video.pause());
  setCurrent((index+count)%count);
 };

 // 자동 넘김 시계: 정지 조건이 모두 풀려 있는 동안에만 돈다. 카드가 바뀌거나 정지가 풀리면 처음부터 다시 잰다
 useEffect(()=>{
  if(!running)return;
  const timer=window.setTimeout(()=>{
   root.current?.querySelectorAll("video").forEach(video=>video.pause());
   setCurrent(value=>(value+1)%count);
  },dwellMs);
  return ()=>window.clearTimeout(timer);
 },[running,current,dwellMs,count,root]);

 // 화면 밖·탭 숨김·reduced-motion·움직임 토글이면 영상을 멈춘다
 useEffect(()=>{if(!moving) root.current?.querySelectorAll("video").forEach(video=>video.pause());},[moving,root]);

 const keyboard=(event:KeyboardEvent)=>{
  if((event.target as HTMLElement).closest("video"))return;
  let next:number|null=null;
  if(event.key==="ArrowRight")next=current+1;
  if(event.key==="ArrowLeft")next=current-1;
  if(event.key==="Home")next=0;
  if(event.key==="End")next=count-1;
  if(next!==null){event.preventDefault();select(next);}
 };
 // 키보드 포커스(:focus-visible)일 때만 멈춘다. 마우스로 누른 버튼에 남은 포커스로는 멈추지 않는다
 const focusIn=(event:FocusEvent)=>{
  let visible=false;
  try{visible=(event.target as HTMLElement).matches(":focus-visible");}catch{visible=true;}
  setFocusPause(visible);
 };
 const focusOut=(event:FocusEvent)=>{
  if(!event.currentTarget.contains(event.relatedTarget as Node|null)) setFocusPause(false);
 };

 return <section id="services" className="ch-services" data-cs-section="services" aria-labelledby="ch-services-title">
  <div className="cs-container">
   <CsSectionHead id="ch-services-title" eyebrow={heading.eyebrow} title={heading.title} emphasis={heading.titleEm} align="center"/>
   <div className="ch-gallery ch-gallery--depth" ref={root} data-active={moving ? "true":"false"} data-autoplay={autoplay ? (running ? "running":"paused") : "off"} onKeyDown={keyboard} onFocus={focusIn} onBlur={focusOut} onPointerEnter={event=>{if(event.pointerType==="mouse")setHover(true);}} onPointerLeave={event=>{if(event.pointerType==="mouse")setHover(false);}}>
    <div className="ch-depth-stage" aria-label="서비스 작업물 카드" aria-roledescription="carousel" onClickCapture={event=>{if(suppressClick.current){event.preventDefault();event.stopPropagation();suppressClick.current=false;}}} onTouchStart={event=>{
     suppressClick.current=false;
     setTouching(true);
     const target=event.target as HTMLElement;
     // 영상 위에서 시작한 스와이프도 넘긴다(조작 막대가 있는 영상 video[controls]·링크·버튼만 제외). 카드 전체를 덮는 이동 링크·선택 버튼은 스와이프를 받는다
     if(!target.closest(".ch-depth-open, .ch-depth-select") && target.closest("video[controls], a, button")){touch.current=null;return;}
     touch.current={x:event.touches[0].clientX,y:event.touches[0].clientY};
    }} onTouchCancel={()=>{touch.current=null;setTouching(false);}} onTouchEnd={event=>{
     setTouching(false);
     if(!touch.current)return;
     const dx=event.changedTouches[0].clientX-touch.current.x,dy=event.changedTouches[0].clientY-touch.current.y;
     touch.current=null;
     // 가로가 45px 이상이고 세로보다 1.2배 이상일 때만 넘긴다(세로 스크롤은 touch-action: pan-y로 브라우저가 처리)
     if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.2){suppressClick.current=true;select(current+(dx<0?1:-1));}
    }}>
     {selections.map((selection,index)=>{
      let distance=index-current;
      if(distance>count/2)distance-=count;
      if(distance< -count/2)distance+=count;
      const selected=index===current;
      const hidden=Math.abs(distance)>2;
      const service=services.find(item=>item.id===selection.tab.id) ?? services[index];
      const price=service.id === "webtoon" ? null : startingPrice(service.id);
      // reduced-motion의 조작 막대 영상은 카드 전체 링크가 가리지 않는다(영상 조작이 우선, 캡션 링크는 그대로)
      const linkable=!(reduced && cards[index].kind==="video");
      return <div key={selection.tab.id} className="ch-depth-card" data-pos={hidden ? "hidden" : distance} aria-hidden={!selected}>
       <WorkMedia id={selection.tab.id} media={cards[index]} selected={selected} play={selected && moving} reduced={reduced}/>
       {selected && linkable ? <Link className="ch-depth-open" href={service.href} {...contentLinkProps(service.href,path)} tabIndex={-1} aria-hidden="true"/>:null}
       {selection.tab.id === "ai-influencer" && <span className="ch-depth-ai-tag cs-tag cs-t-caption">AI 가상인물</span>}
       {selection.tab.id === "animation" && <span className="ch-content-note cs-tag cs-t-caption">캐릭터·모션 활용</span>}
       <div className="ch-depth-caption">
        <p className="ch-depth-title"><span className="cs-t-h3">{service.label}</span>{price ? <span className="ch-depth-price cs-t-small">{price.head}</span>:null}</p>
        <p className="ch-depth-line cs-t-small">{service.line}</p>
        <div className="ch-depth-links"><button type="button" className="cs-link ch-case-open" tabIndex={selected ? undefined : -1} onClick={()=>setPreviewId(service.id)} aria-label={`${service.label} 실제 작품 보기`}>작품 보기 <span aria-hidden="true">↗</span></button><Link className="cs-link ch-depth-service-link" href={service.href} {...contentLinkProps(service.href,path)} tabIndex={selected ? undefined : -1} aria-label={`${service.label} ${head.detailLink}`}>{head.detailLink} <span aria-hidden="true">→</span>{contentLinkProps(service.href,path).target && <NewTabHint/>}</Link></div>
       </div>
       {!selected && !hidden ? <button className="ch-depth-select" type="button" tabIndex={-1} aria-label={`${selection.tab.label} 선택`} onClick={()=>select(index)}/>:null}
      </div>;
     })}
     <button type="button" className="ch-arrow ch-arrow--prev cs-t-button" aria-label="이전 서비스" onClick={()=>select(current-1)}>←</button>
     <button type="button" className="ch-arrow ch-arrow--next cs-t-button" aria-label="다음 서비스" onClick={()=>select(current+1)}>→</button>
     <div className="ch-gallery-tools"><span className="cs-t-caption">{String(current+1).padStart(2,"0")} / {String(count).padStart(2,"0")}</span><button type="button" className="cs-t-caption" disabled={reduced || motion!=="on"} aria-label={manualPaused ? "자동 넘김 재개" : "자동 넘김 일시정지"} aria-pressed={manualPaused} onClick={()=>setManualPaused(value=>!value)}>{reduced || motion!=="on" ? "정지" : manualPaused ? "▶" : "Ⅱ"}</button></div>
    </div>
    <p className="cs-sr-only" aria-live={running ? "off" : "polite"}>{`${current+1} / ${count} ${activeService.label}`}</p>
   </div>
  </div>
  <HomeCasePreview id={previewId} onClose={()=>setPreviewId(null)}/>
 </section>;
}
