"use client";
/* 서비스 6종 3D 캐러셀(R5 WP-H).
 * - 카드 배치: React current → 카드별 data-pos(-2..2, hidden) → CSS 3D transform 보간(레퍼런스 updateCarousel 수치)
 * - 자동 넘김: 진행 막대의 CSS 애니메이션이 끝나면(animationend) 다음 카드로 간다. 타이머 없이 막대와 넘김이 같은 시계를 쓴다
 *   정지 조건(data-autoplay="paused"): 마우스 올림, 키보드 포커스, 터치 중, 열린 상세, 화면 밖, 탭 숨김, 헤더 움직임 토글, 사용자 멈춤
 *   수동 조작(탭·화살표·키·스와이프·옆 카드)은 막대를 처음부터 다시 시작한다
 * - reduced-motion: 자동 넘김과 영상 자동재생 없음, 옆 카드는 정적으로 보이고 수동 조작은 그대로
 * - 카드 소재: 검토판 실제 작업물 → 없으면 homeCardMedia 슬롯(영상 있으면 선택 카드만 muted 루프, 없으면 켄번스) */
import { useEffect, useRef, useState, type AnimationEvent, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import Link from "next/link";
import {
 contentHomeServices as services,
 contentHomeServicesHead as head,
 homeCardMedia,
 pad2,
} from "@/lib/content-home";
import type { ContentSelection } from "@/lib/home-journey";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import { useCsMotion } from "@/components/content-site/shell/frame";
import { ServiceDetail } from "./service-detail";
import { useStageActivity } from "./use-stage-activity";

type Page = { src:string; alt:string; width:number; height:number };
type CardMedia =
 | { kind:"video"; src:string; poster?:string; alt:string; slot:string|null }
 | { kind:"image"; src:string; alt:string; slot:string|null }
 | { kind:"comic"; pages:Page[]; slot:string|null };

/** 검토판 실제 작업물이 우선이고, 공개판에서는 홈 카드 소재 슬롯을 쓴다 */
function cardMedia(selection:ContentSelection):CardMedia {
 const media=selection.media;
 const comic=selection.tab.id==="webtoon";
 if(selection.work){
  if(comic){
   const pages=selection.work.media.filter(item=>item.kind!=="video").slice(0,2).map(page=>({src:page.src,alt:page.alt,width:page.width ?? 1024,height:page.height ?? 1536}));
   if(pages.length) return {kind:"comic",pages,slot:null};
  }
  if(media.kind==="video") return {kind:"video",src:media.src,poster:media.poster,alt:media.alt,slot:null};
  return {kind:"image",src:media.src,alt:media.alt,slot:null};
 }
 const slot=homeCardMedia[selection.tab.id];
 if(slot.video) return {kind:"video",src:slot.video,poster:slot.poster,alt:media.alt,slot:slot.slotId};
 if(comic) return {kind:"comic",pages:[{src:slot.poster,alt:media.alt,width:media.width,height:media.height}],slot:slot.slotId};
 return {kind:"image",src:slot.poster,alt:media.alt,slot:slot.slotId};
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

function WorkMedia({ media, selected, play, reduced }: { media:CardMedia; selected:boolean; play:boolean; reduced:boolean }) {
 const shape=media.kind==="comic" ? "ch-depth-media--comic" : "ch-depth-media--wide";
 let body:ReactNode=null;
 if(media.kind==="comic") body=<div className="ch-kb ch-depth-comic">{media.pages.map((page,index)=><Image key={page.src} src={page.src} alt={selected ? page.alt : ""} width={page.width} height={page.height} sizes="(min-width:768px) 260px, 270px" className={index ? "ch-depth-comic-second" : undefined}/>)}</div>;
 else if(media.kind==="video" && selected) body=<CardVideo media={media} play={play} reduced={reduced}/>;
 else {
  const src=media.kind==="video" ? media.poster : media.src;
  body=src ? <div className="ch-kb"><Image src={src} alt={selected ? media.alt : ""} fill sizes="(min-width:768px) 540px, 280px"/></div> : null;
 }
 return <div className={`ch-depth-media ${shape}`} data-slot={media.slot ?? undefined} data-kind={media.kind}>{body}</div>;
}

export function ServiceShowcase({ selections }: { selections: ContentSelection[] }) {
 const [current,setCurrent]=useState(0);
 const [cycle,setCycle]=useState(0);
 const [hover,setHover]=useState(false);
 const [focusPause,setFocusPause]=useState(false);
 const [touching,setTouching]=useState(false);
 const [detailsOpen,setDetailsOpen]=useState(false);
 const [userPaused,setUserPaused]=useState(false);
 const {root,active:inView,reduced}=useStageActivity();
 const {motion}=useCsMotion();
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const touch=useRef<{x:number;y:number}|null>(null);
 const suppressClick=useRef(false);
 const active=services[current];
 const cards=selections.map(cardMedia);
 const moving=inView && motion==="on" && !reduced;
 const autoplay=!reduced;
 const running=moving && !userPaused && !hover && !focusPause && !touching && !detailsOpen;

 const go=(index:number)=>{
  root.current?.querySelectorAll("video").forEach(video=>video.pause());
  setCurrent((index+services.length)%services.length);
  setCycle(value=>value+1);
 };
 /** 수동 조작: 이동하고 자동 넘김 막대를 처음부터 다시 시작한다 */
 const select=(index:number,focus=false)=>{
  const next=(index+services.length)%services.length;
  go(next);
  if(focus) buttons.current[next]?.focus();
 };
 const advance=(event:AnimationEvent)=>{
  if(event.animationName!=="cs-ch-autoplay" || !running)return;
  go(current+1);
 };

 // 화면 밖·탭 숨김·reduced-motion·움직임 토글이면 영상을 멈춘다
 useEffect(()=>{if(!moving) root.current?.querySelectorAll("video").forEach(video=>video.pause());},[moving,root]);
 // 서비스 상세(details)가 열려 있으면 읽는 동안 넘기지 않는다. toggle은 버블링하지 않아 capture로 듣는다
 useEffect(()=>{
  const node=root.current;
  if(!node)return;
  const update=()=>setDetailsOpen(!!node.querySelector("details[open]"));
  update();
  node.addEventListener("toggle",update,true);
  return ()=>node.removeEventListener("toggle",update,true);
 },[root,current]);

 const keyboard=(event:KeyboardEvent)=>{
  if((event.target as HTMLElement).closest("video"))return;
  let next:number|null=null;
  if(event.key==="ArrowRight")next=current+1;
  if(event.key==="ArrowLeft")next=current-1;
  if(event.key==="Home")next=0;
  if(event.key==="End")next=services.length-1;
  if(next!==null){event.preventDefault();select(next,true);}
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
   <CsSectionHead id="ch-services-title" eyebrow={head.eyebrow} title={head.title} lead={head.lead}/>
   <div className="ch-gallery ch-gallery--depth" ref={root} data-active={moving ? "true":"false"} data-autoplay={autoplay ? (running ? "running":"paused") : "off"} onKeyDown={keyboard} onFocus={focusIn} onBlur={focusOut} onPointerEnter={event=>{if(event.pointerType==="mouse")setHover(true);}} onPointerLeave={event=>{if(event.pointerType==="mouse")setHover(false);}}>
    <div className="ch-gallery-tabs" role="tablist" aria-label="컨텐츠 서비스 선택">{services.map((service,index)=><button key={service.id} ref={node=>{buttons.current[index]=node;}} type="button" role="tab" id={`ch-tab-${service.id}`} aria-selected={index===current} aria-controls="ch-service-panel" tabIndex={index===current?0:-1} className="ch-tab cs-t-chip" onClick={()=>select(index)}>{service.label}</button>)}</div>
    <div className="ch-depth-stage" aria-label="서비스 작업물 카드" aria-roledescription="carousel" onClickCapture={event=>{if(suppressClick.current){event.preventDefault();event.stopPropagation();suppressClick.current=false;}}} onTouchStart={event=>{
     suppressClick.current=false;
     setTouching(true);
     // 영상 위에서 시작한 스와이프도 넘긴다(조작 막대가 있는 영상 video[controls]·링크·버튼만 제외). 영상은 CSS로 pointer-events:none이라 터치가 카드로 간다
     if((event.target as HTMLElement).closest("video[controls], a, button")){touch.current=null;return;}
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
      if(distance>services.length/2)distance-=services.length;
      if(distance< -services.length/2)distance+=services.length;
      const selected=index===current;
      const hidden=Math.abs(distance)>2;
      return <div key={selection.tab.id} className="ch-depth-card" data-pos={hidden ? "hidden" : distance} aria-hidden={!selected}>
       <WorkMedia media={cards[index]} selected={selected} play={selected && moving} reduced={reduced}/>
       <div className="ch-depth-caption"><span className="cs-t-eyebrow">{selection.tab.label}</span><p className="cs-t-small">{selection.caption ?? selection.tab.line}</p>{selection.tag ? <span className="cs-tag cs-t-caption">{selection.tag}</span>:null}{selected && selection.work ? <Link className="cs-link" href={`/content/projects/${selection.work.slug}?service=${selection.tab.id}`}>작업 자세히 보기 <span aria-hidden="true">↗</span></Link>:null}</div>
       {!selected && !hidden ? <button className="ch-depth-select" type="button" tabIndex={-1} aria-label={`${selection.tab.label} 선택`} onClick={()=>select(index)}/>:null}
      </div>;
     })}
     <div className="ch-depth-nav">
      <span className="ch-depth-count cs-t-caption"><span>{pad2(current+1)} / {pad2(services.length)}</span>{autoplay ? <span className="ch-autoplay-track" aria-hidden="true"><span key={cycle} className="ch-autoplay-fill" data-dwell={cards[current].kind==="video" ? "video":"image"} onAnimationEnd={advance}/></span>:null}</span>
      <div className="ch-arrows">
       {autoplay ? <button type="button" className="ch-arrow ch-autoplay-toggle" aria-label={userPaused ? head.autoplayPlay : head.autoplayPause} onClick={()=>{setUserPaused(value=>!value);setCycle(value=>value+1);}}>{userPaused ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}</button>:null}
       <button type="button" className="ch-arrow" aria-label="이전 서비스" onClick={()=>select(current-1)}>←</button>
       <button type="button" className="ch-arrow" aria-label="다음 서비스" onClick={()=>select(current+1)}>→</button>
      </div>
     </div>
    </div>
    <div className="ch-depth-detail" role="tabpanel" id="ch-service-panel" aria-labelledby={`ch-tab-${active.id}`}><ServiceDetail service={active} index={current}/></div>
    <p className="cs-sr-only" aria-live={running ? "off" : "polite"}>{`${current+1} / ${services.length} ${active.label}`}</p>
   </div>
  </div>
 </section>;
}
