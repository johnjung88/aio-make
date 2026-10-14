"use client";

/* 3장면 깊이 전환(R5). 장면 목록·작품명·경로는 서버(work-sequence.tsx)가 정해 props로만 받는다.
 * 이 client 파일에는 고객 slug·이름·경로가 없다(공개판 번들 경계).
 * 데스크톱: sticky 고정 구간의 스크롤 진행으로 장면 전환. 모바일: 보이는 동안 자동 순환, 스와이프·탭으로 조작.
 * reduced-motion·움직임 끔: 고정·자동 순환 없이 탭과 화살표로 즉시 전환. */
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { CsTag } from "../ui/tag";
import { useInViewPlay, useMotionProgress } from "./motion-runtime";

export type SceneFrame = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** object-position 10 단위(service-motion.css data-fx·data-fy) */
  "data-fx"?: string;
  "data-fy"?: string;
  /** 원본 영상의 발췌 시점 표기(실제 작업물만) */
  time?: string;
};

export type SceneSequenceProps = {
  variant: "animation" | "motion" | "ad";
  /** 장면 선택 탭 묶음 이름 */
  name: string;
  labels: readonly [string, string, string];
  scenes: readonly SceneFrame[];
  portrait: boolean;
  /** 장면 출처 설명(실제 발췌 또는 연출 예시) */
  note: string;
  /** 미디어 태그(연출 예시일 때) */
  tag?: string;
};

const EYEBROW = { ad: "VERTICAL CUT", animation: "SCENE BY SCENE", motion: "MOTION TIMELINE" } as const;
const CYCLE_MS = 3400;

export function SceneSequence({ variant, name, labels, scenes, portrait, note, tag }: SceneSequenceProps) {
  const uid = useId();
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [wide, setWide] = useState(false);
  const wideRef = useRef(false);
  const scrollIndex = useRef(-1);
  const touch = useRef({ x: 0, y: 0 });
  const count = scenes.length;

  useEffect(() => {
    const query = matchMedia("(min-width: 768px)");
    const apply = () => { wideRef.current = query.matches; setWide(query.matches); };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  // 데스크톱: 고정 구간 진행 0~1을 장면 3개로 나눈다. 탭으로 고른 뒤에도 다음 구간에 들어가면 스크롤이 다시 이끈다
  useMotionProgress(root, progress => {
    if (!wideRef.current) return;
    const index = Math.min(count - 1, Math.floor(progress * count));
    if (index === scrollIndex.current) return;
    scrollIndex.current = index;
    setSelected(index);
  }, { mode: "pin" });

  // 모바일: 보이는 동안 자동 순환, 터치·hover·focus 중에는 멈춤, 직접 고르면 순환 종료
  const playing = useInViewPlay(stage, { threshold: .35, pauseOnInteract: true });
  useEffect(() => {
    if (!playing || wide || stopped) return;
    const timer = window.setInterval(() => setSelected(previous => (previous + 1) % count), CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [playing, wide, stopped, count]);

  const select = (index: number, focus = false) => {
    setStopped(true);
    const next = (index + count) % count;
    setSelected(next);
    if (focus) root.current?.querySelector<HTMLButtonElement>(`[data-scene-tab="${next}"]`)?.focus();
  };
  const key = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    select(event.key === "Home" ? 0 : event.key === "End" ? count - 1 : index + (event.key === "ArrowRight" ? 1 : -1), true);
  };

  return <div ref={root} className={`cs-scene-chapter cs-scene-chapter--${variant}`} data-selected={selected}>
    <div className="cs-scene-sticky">
      <div ref={stage} className="cs-scene-screen" data-portrait={portrait}
        onTouchStart={event=>{const t=event.changedTouches[0];touch.current={x:t.clientX,y:t.clientY};}}
        onTouchEnd={event=>{const t=event.changedTouches[0];const dx=t.clientX-touch.current.x;const dy=t.clientY-touch.current.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)) select(selected+(dx<0?1:-1));}}>
        {scenes.map((scene,index)=>{
          const { src, alt, width, height, time, ...focus } = scene;
          return <figure id={`${uid}-scene-${index}`} role="tabpanel" aria-labelledby={`${uid}-tab-${index}`} aria-hidden={index!==selected} key={`${src}-${index}`} className="cs-scene-frame" data-active={index===selected} data-side={index < selected ? "before" : index > selected ? "after" : "current"} data-time={time ? "" : undefined}>
            <Image className="cs-scene-image" src={src} alt={alt} width={width} height={height} sizes={portrait?"(max-width:767px) 75vw, 32vw":"(max-width:767px) 92vw, 62vw"} {...focus}/>
          </figure>;
        })}
        <i className="cs-scene-wipe" key={`wipe-${selected}`} aria-hidden="true"/>
        <span className="cs-scene-counter cs-t-caption" aria-hidden="true">0{selected+1} / 0{count}</span>
        {tag && <CsTag overlay>{tag}</CsTag>}
      </div>
      <div className="cs-scene-controls">
        <p className="cs-t-eyebrow">{EYEBROW[variant]}</p>
        <h3 className="cs-t-h3" aria-live="polite">{labels[selected]}</h3>
        <p className="cs-t-small">{note}</p>
        <div className="cs-scene-tabs" role="tablist" aria-label={`${name} 장면 선택`}>
          {labels.map((text,index)=><button key={text} type="button" id={`${uid}-tab-${index}`} data-scene-tab={index} role="tab" aria-selected={index===selected} aria-controls={`${uid}-scene-${index}`} tabIndex={index===selected?0:-1} onClick={()=>select(index)} onKeyDown={event=>key(event,index)}><span className="cs-t-caption">0{index+1}{scenes[index]?.time && <span>{scenes[index].time}</span>}</span><span className="cs-t-label">{text}</span><i aria-hidden="true"/></button>)}
        </div>
        <div className="cs-scene-arrows"><button type="button" className="cs-btn cs-btn--ghost" onClick={()=>select(selected-1)} aria-label="이전 장면">←</button><button type="button" className="cs-btn cs-btn--ghost" onClick={()=>select(selected+1)} aria-label="다음 장면">→</button></div>
        <p className="cs-t-caption cs-scene-hint">{wide ? "스크롤하면 다음 장면으로 넘어갑니다" : "옆으로 밀어 장면을 넘겨 보세요"}</p>
      </div>
    </div>
  </div>;
}
