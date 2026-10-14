"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { contentHomeProcess as steps, contentHomeProcessHead as head, pad2 } from "@/lib/content-home";
import type { ContentSelection } from "@/lib/home-journey";
import { useStageActivity } from "./use-stage-activity";

/** Each selected step changes the visual working material, not just its caption */
export function ProcessTabs({ selections }: { selections:ContentSelection[] }) {
 const [current,setCurrent]=useState(0);
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const video=useRef<HTMLVideoElement>(null);
 const {root,active,reduced}=useStageActivity();
 const production=selections.find(item=>item.tab.id==="motion-graphics") ?? selections[0];
 const media=production.media;
 const boards=[selections.find(item=>item.tab.id==="webtoon"), production, selections.find(item=>item.tab.id==="animation"), selections.find(item=>item.tab.id==="ai-influencer")].filter((item):item is ContentSelection=>!!item);
 const select=(index:number,focus=false)=>{video.current?.pause();const next=(index+steps.length)%steps.length;setCurrent(next);if(focus)buttons.current[next]?.focus();};
 useEffect(()=>{
  const node=video.current;
  if(!node)return;
  if(current===2 && active && !reduced){node.muted=true;node.play().catch(()=>{});}else node.pause();
 },[current,active,reduced]);
 const step=steps[current];
 return <div className="ch-making" ref={root} data-active={active && !reduced ? "true":"false"}>
  <div className="ch-making-tabs" role="tablist" aria-label={head.tabsLabel} aria-orientation="vertical" onKeyDown={event=>{
   let next:number|null=null;
   if(event.key==="ArrowDown")next=current+1;
   if(event.key==="ArrowUp")next=current-1;
   if(event.key==="Home")next=0;
   if(event.key==="End")next=steps.length-1;
   if(next!==null){event.preventDefault();select(next,true);}
  }}>{steps.map((item,index)=><button type="button" role="tab" key={item.label} id={`ch-process-tab-${index}`} aria-controls="ch-making-panel" aria-selected={index===current} tabIndex={index===current?0:-1} ref={node=>{buttons.current[index]=node;}} className="ch-making-tab" onClick={()=>select(index)}>
   <span className="cs-t-eyebrow">{pad2(index+1)}</span><span className="ch-making-tab-copy"><span className="cs-t-h3">{item.label}</span><span className="cs-t-small">{item.title}</span>{index===current?<span className="cs-t-body">{item.body}</span>:null}</span><span className="cs-t-lead" aria-hidden="true">{index===current?"−":"+"}</span>
  </button>)}</div>
  <div className="ch-making-panel" id="ch-making-panel" role="tabpanel" aria-labelledby={`ch-process-tab-${current}`}>
   <div className="ch-making-art" data-step={current} key={current}>
    {current===0 ? <><div className="ch-brief-paper"><span className="cs-t-eyebrow">CONTENT BRIEF</span><p className="cs-t-statement">어떤 이야기를<br/>누구에게 전할까요</p><dl className="cs-t-small"><div><dt>목적</dt><dd>전하고 싶은 메시지</dd></div><div><dt>채널</dt><dd>보여줄 곳과 화면 비율</dd></div><div><dt>범위</dt><dd>분량과 일정</dd></div></dl></div><div className="ch-brief-note cs-t-small">가진 자료에서<br/>시작해도 괜찮아요</div></> : null}
    {current===1 ? <div className="ch-storyboard">{boards.map((board,index)=><figure key={board.tab.id}><div><Image src={board.media.poster ?? board.media.src} alt={`${board.tab.label} 장면 구성 참고`} fill sizes="(min-width:768px) 240px, 40vw"/></div><figcaption className="cs-t-caption">장면 {pad2(index+1)} · {board.tab.label}</figcaption></figure>)}</div>:null}
    {current===2 ? <><div className="ch-production-screen">{media.kind==="video" ? <video ref={video} src={media.src} poster={media.poster} controls muted loop playsInline preload="none" aria-label={media.alt}/> : <Image src={media.src} alt={media.alt} fill sizes="(min-width:768px) 550px, 90vw"/>}</div><div className="ch-production-track" aria-hidden="true"><div className="ch-track-clips">{boards.map(board=><span key={board.tab.id}/>)}</div><span className="ch-track-head"/><span className="ch-track-wave"/></div></>:null}
    {current===3 ? <div className="ch-delivery-files">{[{kind:"MP4",title:"영상 파일",body:"합의한 길이와 화면 비율"},{kind:"IMG",title:"이미지 파일",body:"합의한 규격과 분량"},{kind:"SIZE",title:"채널별 규격",body:"계약한 납품 범위에 한해"}].map((file,index)=><div className="ch-delivery-file" key={file.kind} data-index={index}><span className="ch-file-kind cs-t-caption">{file.kind}</span><span><strong className="cs-t-label">{file.title}</strong><small className="cs-t-small">{file.body}</small></span><span className="cs-t-label" aria-hidden="true">✓</span></div>)}<p className="cs-t-caption">파일 구성 예시 · 실제 납품은 합의한 범위에 따름</p></div>:null}
   </div>
   <div className="ch-making-caption"><span className="cs-t-caption">{pad2(current+1)} / {pad2(steps.length)} · 제작 과정 설명 예시</span><span className="cs-t-label">{head.outputLabel} — {step.output}</span></div>
  </div>
 </div>;
}
