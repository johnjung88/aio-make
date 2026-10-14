"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MotionCanvas } from "../motion-runtime";
type Cut={src:string;alt:string};

export function WebtoonCover({cuts}:{cuts:Cut[]}) {
  return <MotionCanvas variant="webtoon" className="cs-webtoon-fan"><div className="cs-webtoon-fan-images">{[2,1,0].map(index=><Image key={cuts[index].src} src={cuts[index].src} alt={index===0?cuts[index].alt:""} width={800} height={1200} sizes="(max-width:767px) 72vw, 30vw" priority={index===0} data-panel={index}/>)}</div><div className="cs-webtoon-fan-caption"><p className="cs-t-caption">AIO 자체 웹툰 · 제작 예시</p><h2 className="cs-t-h3">1억의 구단주</h2><a href="#reader" className="cs-link">12컷 읽어보기 ↓</a></div></MotionCanvas>;
}

export function WebtoonReader({cuts}:{cuts:Cut[]}) {
  const rail=useRef<HTMLDivElement>(null);
  const [active,setActive]=useState(0);
  const select=(index:number)=>{
    const next=Math.max(0,Math.min(cuts.length-1,index));
    const node=rail.current;
    if(node){const child=node.children[next] as HTMLElement;node.scrollTo({left:child.offsetLeft-node.offsetLeft,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});}
  };
  const scroll=()=>{
    const node=rail.current;if(!node)return;
    const step=(node.children[1] as HTMLElement).offsetLeft-(node.children[0] as HTMLElement).offsetLeft;
    const next=Math.max(0,Math.min(cuts.length-1,Math.round(node.scrollLeft/step)));
    setActive(previous=>previous===next?previous:next);
  };
  return <div className="cs-webtoon-reading-experience">
    <div ref={rail} className="cs-webtoon-reading-rail" onScroll={scroll} tabIndex={0} role="region" aria-label="1억의 구단주 컷별 읽기" onKeyDown={event=>{if(event.key==="ArrowLeft"||event.key==="ArrowRight"){event.preventDefault();select(active+(event.key==="ArrowRight"?1:-1));}}}>{cuts.map((cut,index)=><figure key={cut.src}><Image src={cut.src} alt={cut.alt} width={800} height={1200} sizes="(max-width:767px) 86vw, 440px"/><figcaption className="cs-t-caption">{String(index+1).padStart(2,"0")} / 12</figcaption></figure>)}</div>
    <div className="cs-webtoon-reading-controls"><button className="cs-btn cs-btn--ghost" onClick={()=>select(active-1)} disabled={active===0} aria-label="이전 컷">←</button><span className="cs-t-label" aria-live="polite">{String(active+1).padStart(2,"0")} / 12</span><button className="cs-btn cs-btn--ghost" onClick={()=>select(active+1)} disabled={active===cuts.length-1} aria-label="다음 컷">→</button></div>
    <div className="cs-webtoon-reading-progress" aria-hidden="true"><i style={{width:`${(active+1)/cuts.length*100}%`}}/></div>
    <details className="cs-webtoon-continuous"><summary className="cs-t-label">12컷 전체 이어서 읽기</summary><div>{cuts.map(cut=><Image key={cut.src} src={cut.src} alt={cut.alt} width={800} height={1200} sizes="(max-width:767px) 90vw, 440px"/>)}</div></details>
  </div>;
}
