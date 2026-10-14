"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { useMotionProgress } from "./motion-runtime";

const times: Record<string, number[]> = { "bwl-brand-motion":[2,12.5,22], "bwl-aqua-ad":[2,8,14], "yofree-night-motion":[3,22,42] };
export function SceneSequence({ slug, title, label, labels, portrait }: { slug: string; title: string; label: string; labels: [string,string,string]; portrait: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [selected,setSelected] = useState(0);
  const manual = useRef(false);
  const touch = useRef(0);
  const variant = slug === "bwl-aqua-ad" ? "ad" : slug === "yofree-night-motion" ? "animation" : "motion";
  useMotionProgress(root, progress => {
    if (!manual.current && window.innerWidth >= 768) {
      const index = Math.min(2, Math.floor(progress * 4));
      setSelected(previous => previous === index ? previous : index);
    }
  });
  const select = (index: number, focus = false) => {
    manual.current = true;
    const next = (index + 3) % 3;
    setSelected(next);
    if (focus) root.current?.querySelector<HTMLButtonElement>(`[data-scene-tab="${next}"]`)?.focus();
  };
  const key = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    select(event.key === "Home" ? 0 : event.key === "End" ? 2 : index + (event.key === "ArrowRight" ? 1 : -1), true);
  };
  return <div ref={root} className={`cs-scene-chapter cs-scene-chapter--${variant}`} data-selected={selected}>
    <div className="cs-scene-sticky">
      <div className="cs-scene-screen" data-portrait={portrait} onTouchStart={event=>{touch.current=event.changedTouches[0].clientX;}} onTouchEnd={event=>{const distance=event.changedTouches[0].clientX-touch.current;if(Math.abs(distance)>45) select(selected+(distance<0?1:-1));}}>
        {labels.map((text,index)=><figure id={`scene-${slug}-${index}`} role="tabpanel" aria-labelledby={`scene-tab-${slug}-${index}`} aria-hidden={index!==selected} key={text} className="cs-scene-frame" data-active={index===selected} data-side={index < selected ? "before" : "after"}>
          <Image src={`/reference-review/r3-scenes/${slug}/scene-${index+1}.webp`} alt={`${title} 실제 영상 장면 ${index+1} · ${label}`} width={900} height={portrait?1600:506} sizes={portrait?"(max-width:767px) 75vw, 32vw":"(max-width:767px) 90vw, 62vw"}/>
        </figure>)}
        <span className="cs-scene-counter cs-t-caption" aria-hidden="true">0{selected+1} / 03</span>
      </div>
      <div className="cs-scene-controls">
        <p className="cs-t-eyebrow">{variant === "ad" ? "VERTICAL CUT" : variant === "animation" ? "SCENE BY SCENE" : "MOTION TIMELINE"}</p>
        <h3 className="cs-t-h3">{labels[selected]}</h3>
        <p className="cs-t-small">실제 영상에서 발췌한 장면</p>
        <div className="cs-scene-tabs" role="tablist" aria-label={`${title} 장면 선택`}>
          {labels.map((text,index)=><button key={text} id={`scene-tab-${slug}-${index}`} data-scene-tab={index} role="tab" aria-selected={index===selected} aria-controls={`scene-${slug}-${index}`} tabIndex={index===selected?0:-1} onClick={()=>select(index)} onKeyDown={event=>key(event,index)}><span className="cs-t-caption">0{index+1} <span>{times[slug]?.[index]}초</span></span><span className="cs-t-label">{text}</span><i aria-hidden="true"/></button>)}
        </div>
        <div className="cs-scene-arrows"><button className="cs-btn cs-btn--ghost" onClick={()=>select(selected-1)} aria-label="이전 장면">←</button><button className="cs-btn cs-btn--ghost" onClick={()=>select(selected+1)} aria-label="다음 장면">→</button></div>
        <p className="cs-t-caption cs-scene-hint">스크롤하거나 장면을 선택해 보세요</p>
      </div>
    </div>
  </div>;
}
