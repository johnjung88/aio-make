"use client";
/* 제작 과정 4단계(R5 WP-H). 레퍼런스 selectStep/processArt처럼 단계마다 작업 재료 장면을 통째로 바꾼다.
 * - 장면(.ch-making-art)은 key={current}로 다시 마운트되어 탭을 바꿀 때마다 순차 진입을 처음부터 재생한다
 *   상담: 기획 문서 → 메모 / 기획: 콘티 4장 순차 → 장면 하이라이트 순환 / 제작: 화면 → 타임라인 클립 → 재생 헤드 / 납품: 파일 3개 순차 → 확인 표시
 * - 진입 뒤에는 선택된 장면 안의 재료가 계속 움직인다(문서 흔들림, 콘티 하이라이트, 재생 헤드, 영상 또는 켄번스)
 * - 화면 밖·탭 숨김·헤더 움직임 토글이면 data-active="false"로 루프와 영상을 멈춘다. reduced-motion이면 정지 장면과 수동 재생 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { contentHomeProcess as steps, contentHomeProcessHead as head, homeCardMedia, pad2 } from "@/lib/content-home";
import type { ContentSelection } from "@/lib/home-journey";
import { useCsMotion } from "@/components/content-site/shell/frame";
import { useStageActivity } from "./use-stage-activity";

export function ProcessTabs({ selections }: { selections:ContentSelection[] }) {
 const [current,setCurrent]=useState(0);
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const video=useRef<HTMLVideoElement>(null);
 const {root,active,reduced}=useStageActivity();
 const {motion}=useCsMotion();
 const moving=active && !reduced && motion==="on";
 const production=selections.find(item=>item.tab.id==="motion-graphics") ?? selections[0];
 const media=production.media;
 const slot=homeCardMedia["motion-graphics"];
 // 실제 작업물 영상 → 없으면 모션그래픽 카드 슬롯 영상 → 없으면 정지 이미지(켄번스)
 const productionVideo=media.kind==="video" ? {src:media.src,poster:media.poster} : !production.work && slot.video ? {src:slot.video,poster:slot.poster} : null;
 const boards=[selections.find(item=>item.tab.id==="webtoon"), production, selections.find(item=>item.tab.id==="animation"), selections.find(item=>item.tab.id==="ai-influencer")].filter((item):item is ContentSelection=>!!item);
 const select=(index:number,focus=false)=>{video.current?.pause();const next=(index+steps.length)%steps.length;setCurrent(next);if(focus)buttons.current[next]?.focus();};
 useEffect(()=>{
  const node=video.current;
  if(!node)return;
  if(current===2 && moving){node.muted=true;node.play().catch(()=>{});}else node.pause();
 },[current,moving]);
 const step=steps[current];
 return <div className="ch-making" ref={root} data-active={moving ? "true":"false"} data-still={motion==="on" ? undefined : "true"}>
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
    {current===1 ? <div className="ch-storyboard">{boards.map((board,index)=><figure key={board.tab.id}><div className="ch-board-frame"><div className="ch-kb"><Image src={board.media.poster ?? board.media.src} alt={`${board.tab.label} 장면 구성 참고`} fill sizes="(min-width:768px) 240px, 40vw"/></div></div><figcaption className="cs-t-caption">장면 {pad2(index+1)} · {board.tab.label}</figcaption></figure>)}</div>:null}
    {current===2 ? <><div className="ch-production-screen">{productionVideo ? <video ref={video} src={productionVideo.src} poster={productionVideo.poster} controls={reduced} muted loop playsInline preload="none" aria-label={media.alt}/> : <div className="ch-kb"><Image src={media.src} alt={media.alt} fill sizes="(min-width:768px) 550px, 90vw"/></div>}</div><div className="ch-production-track" aria-hidden="true"><div className="ch-track-clips">{boards.map(board=><span key={board.tab.id}/>)}</div><span className="ch-track-head"/><span className="ch-track-wave"/></div></>:null}
    {current===3 ? <div className="ch-delivery-files">{[{kind:"MP4",title:"영상 파일",body:"합의한 길이와 화면 비율"},{kind:"IMG",title:"이미지 파일",body:"합의한 규격과 분량"},{kind:"SIZE",title:"채널별 규격",body:"계약한 납품 범위에 한해"}].map((file,index)=><div className="ch-delivery-file" key={file.kind} data-index={index}><span className="ch-file-kind cs-t-caption">{file.kind}</span><span><strong className="cs-t-label">{file.title}</strong><small className="cs-t-small">{file.body}</small></span><span className="ch-file-ok cs-t-label" aria-hidden="true">✓</span></div>)}<p className="cs-t-caption">파일 구성 예시 · 실제 납품은 합의한 범위에 따름</p></div>:null}
   </div>
   <div className="ch-making-caption"><span className="cs-t-caption">{pad2(current+1)} / {pad2(steps.length)} · 제작 과정 설명 예시</span><span className="cs-t-label">{head.outputLabel} — {step.output}</span></div>
  </div>
 </div>;
}
