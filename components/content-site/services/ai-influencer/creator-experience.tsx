"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { creatorRoster } from "@/lib/content-site/creator-roster";
import { MotionCanvas } from "../motion-runtime";

function cycle(event: KeyboardEvent<HTMLButtonElement>, current: number, count: number, select: (index: number) => void) {
  if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? count-1 : (current+(event.key === "ArrowRight" ? 1 : -1)+count)%count;
  select(next);
  const buttons=event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
  buttons?.[next]?.focus();
}

export function CreatorDeck() {
  const [active,setActive]=useState(0);
  const touch=useRef(0);
  return <MotionCanvas variant="creators" className="cs-creator-deck">
    <div className="cs-creator-depth" onTouchStart={event=>{touch.current=event.changedTouches[0].clientX;}} onTouchEnd={event=>{const distance=event.changedTouches[0].clientX-touch.current;if(Math.abs(distance)>45)setActive(previous=>(previous+(distance<0?1:3))%4);}}>
      {creatorRoster.map((creator,index)=>{
        let distance=index-active;if(distance>2)distance-=4;if(distance< -1)distance+=4;
        return <button key={creator.id} className="cs-creator-depth-card" data-active={index===active} onClick={()=>setActive(index)} tabIndex={-1} aria-label={`${creator.name} 선택`} style={{"--cs-card-distance":distance,"--cs-card-depth":Math.abs(distance)} as CSSProperties}>
          <Image src={creator.portrait} alt={`${creator.name} · AI 가상인물`} width={900} height={1200} sizes="(max-width:767px) 60vw, 24vw" priority={index===0}/>
          <span className="cs-creator-depth-name cs-t-h3">{creator.name}</span>
        </button>;
      })}
    </div>
    <div className="cs-creator-select" role="group" aria-label="크리에이터 선택">{creatorRoster.map((creator,index)=><button key={creator.id} aria-pressed={active===index} onClick={()=>setActive(index)} onKeyDown={event=>cycle(event,index,4,setActive)} className="cs-t-small">{creator.name}</button>)}</div>
    <div className="cs-creator-deck-copy"><p className="cs-t-label">{creatorRoster[active].category}</p><p className="cs-t-small">{creatorRoster[active].line}</p><a href="#sheet" className="cs-link">계정과 피드 보기 ↓</a><p className="cs-t-caption">자체 IP · AI 가상인물 4명</p></div>
  </MotionCanvas>;
}

function CreatorFeed({ creator }: { creator: typeof creatorRoster[number] }) {
  const [selected,setSelected]=useState(0);
  return <div className="cs-creator-feed-editor">
    <div className="cs-creator-feed-stage">{creator.images.map((item,index)=><figure key={item.src} data-active={selected===index} aria-hidden={selected!==index}><Image src={item.src} alt={`${creator.name} ${item.label} · AI 가상인물`} width={900} height={1350} sizes="(max-width:767px) 90vw, 40vw"/><figcaption><span className="cs-t-label">{item.label}</span><p className="cs-t-small">{item.caption}</p></figcaption></figure>)}</div>
    <div className="cs-creator-feed-thumbs" role="group" aria-label={`${creator.name} 피드 이미지 선택`}>{creator.images.map((item,index)=><button key={item.src} aria-pressed={selected===index} onClick={()=>setSelected(index)} onKeyDown={event=>cycle(event,index,3,setSelected)}><Image src={item.src} alt="" width={120} height={160} sizes="100px"/><span className="cs-t-caption">{item.label}</span></button>)}</div>
  </div>;
}

export function CreatorRoster() {
  const [selected,setSelected]=useState(0);
  const [all,setAll]=useState(false);
  return <div className="cs-creator-roster-interactive">
    <div className="cs-creator-roster-tabs" role="tablist" aria-label="계정 소개">{creatorRoster.map((creator,index)=><button key={creator.id} id={`creator-tab-${creator.id}`} role="tab" aria-selected={selected===index} aria-controls={`creator-${creator.id}`} tabIndex={selected===index?0:-1} onClick={()=>{setSelected(index);setAll(false);}} onKeyDown={event=>cycle(event,index,4,index=>{setSelected(index);setAll(false);})}><span className="cs-t-caption">0{index+1}</span><span className="cs-t-h3">{creator.name}</span><span className="cs-t-small">{creator.category}</span></button>)}</div>
    <div className="cs-creator-roster-panels">{creatorRoster.map((creator,index)=><article key={creator.id} id={`creator-${creator.id}`} role="tabpanel" aria-labelledby={`creator-tab-${creator.id}`} hidden={!all && selected!==index} className="cs-creator-profile-panel">
      <div className="cs-creator-profile-copy"><span className="cs-t-caption">AI 가상인물 · 계정 소개</span><h3 className="cs-t-h2">{creator.name}</h3><p className="cs-t-lead">{creator.line}</p><p className="cs-t-body">{creator.bio}</p><div className="cs-creator-profile-meta"><p className="cs-t-small">{creator.direction}</p><p className="cs-t-caption">{creator.account}</p></div></div>
      <CreatorFeed creator={creator}/>
    </article>)}</div>
    <button className="cs-link cs-creator-show-all" onClick={()=>setAll(previous=>!previous)} aria-expanded={all}>{all?"선택한 계정만 보기":"네 계정 모두 펼쳐 보기"} <span aria-hidden="true">{all?"−":"+"}</span></button>
  </div>;
}
