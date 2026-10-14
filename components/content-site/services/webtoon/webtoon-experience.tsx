"use client";

/* 웹툰 client 섬(R5, 이 서비스의 유일한 client 파일).
 * - WebtoonCover: 히어로 3컷 부채(스크롤 진행 + 느린 떠오름 루프, 화면 밖 정지)
 * - WebtoonUnfold: sticky 고정 구간에서 스크롤에 맞춰 다섯 컷이 순서대로 펼쳐진다
 * - WebtoonReader: 12컷 3D 페이지 넘김(왼쪽 책등 기준 rotateY, 뒷면, 움직이는 그림자). 버튼·스와이프·방향키
 * 컷 경로와 설명은 서버(landing.tsx → example-media 슬롯)가 props로 넘긴다. 인라인 style 없음(변수는 setProperty). */
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CsTag } from "../../ui/tag";
import { MotionCanvas, useInViewPlay, useMotionProgress } from "../motion-runtime";

type Cut = { src: string; alt: string };

export function WebtoonCover({ cuts, sizes, title, caption }: { cuts: readonly Cut[]; sizes: string; title: string; caption: string }) {
  return <MotionCanvas variant="webtoon" className="cs-webtoon-fan">
    <div className="cs-webtoon-fan-images">{[2,1,0].map(index=><Image key={cuts[index].src} src={cuts[index].src} alt={index===0?cuts[index].alt:""} width={800} height={1200} sizes={sizes} priority={index===0} data-panel={index}/>)}</div>
    <div className="cs-webtoon-fan-caption"><p className="cs-t-caption">{caption}</p><h2 className="cs-t-h3">{title}</h2><a href="#reader" className="cs-link">12컷 넘겨 읽기 ↓</a></div>
  </MotionCanvas>;
}

export function WebtoonUnfold({ cuts, sizes, tag, hint }: { cuts: readonly Cut[]; sizes: string; tag: string; hint: string }) {
  const track = useRef<HTMLDivElement>(null);
  useMotionProgress(track, undefined, { mode: "pin" });
  return <div ref={track} className="cs-svc-webtoon-unfold-track">
    <div className="cs-svc-webtoon-unfold-sticky">
      <div className="cs-svc-webtoon-unfold-stage">
        {cuts.map((cut,index)=><figure key={cut.src} className="cs-svc-webtoon-unfold-cut" data-cut={index}><Image src={cut.src} alt={cut.alt} width={800} height={1200} sizes={sizes}/></figure>)}
      </div>
      <div className="cs-svc-webtoon-unfold-meta"><CsTag>{tag}</CsTag><p className="cs-t-caption">{hint}</p></div>
    </div>
  </div>;
}

const TURN_MS = 950;
type Turn = { index: number; dir: "next" | "prev" };

export function WebtoonReader({ cuts, sizes, label, tag }: { cuts: readonly Cut[]; sizes: string; label: string; tag: string }) {
  const book = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const timer = useRef(0);
  const touch = useRef({ x: 0, y: 0 });
  const last = cuts.length - 1;
  useInViewPlay(stage, { threshold: .2 });

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => { book.current?.style.setProperty("--cs-book-progress", ((active + 1) / cuts.length).toFixed(4)); }, [active, cuts.length]);

  const go = (target: number) => {
    const next = Math.max(0, Math.min(last, target));
    if (next === active) return;
    const dir = next > active ? "next" : "prev";
    // 앞으로: 지금 페이지가 책등을 돌아 넘어간다. 뒤로: 목표 페이지가 되돌아온다
    setTurn({ index: dir === "next" ? next - 1 : next, dir });
    setActive(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTurn(null), TURN_MS);
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: last };
    if (!(event.key in map)) return;
    event.preventDefault();
    go(map[event.key]);
  };
  const state = (index: number) => index < active ? "flipped" : index === active ? "current" : index === active + 1 ? "next" : "under";

  return <div ref={book} className="cs-svc-webtoon-book">
    <div ref={stage} className="cs-svc-webtoon-book-stage" role="region" aria-roledescription="웹툰 리더" aria-label={label} tabIndex={0} onKeyDown={keys} data-turn={turn?.dir}
      onTouchStart={event=>{const t=event.changedTouches[0];touch.current={x:t.clientX,y:t.clientY};}}
      onTouchEnd={event=>{const t=event.changedTouches[0];const dx=t.clientX-touch.current.x;const dy=t.clientY-touch.current.y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2) go(active+(dx<0?1:-1));}}>
      {cuts.map((cut,index)=><figure key={cut.src} className="cs-svc-webtoon-page" data-page={index} data-state={state(index)} data-turning={turn?.index===index?turn.dir:undefined} aria-hidden={index!==active}>
        <div className="cs-svc-webtoon-page-front"><Image src={cut.src} alt={cut.alt} width={800} height={1200} sizes={sizes} loading={index<2?"eager":"lazy"}/></div>
        <div className="cs-svc-webtoon-page-back" aria-hidden="true"><span className="cs-t-caption">{String(index+1).padStart(2,"0")}</span></div>
      </figure>)}
      <span className="cs-svc-webtoon-spine" aria-hidden="true"/>
      <CsTag overlay>{tag}</CsTag>
    </div>
    <div className="cs-svc-webtoon-book-controls">
      <button type="button" className="cs-btn cs-btn--ghost" onClick={()=>go(active-1)} disabled={active===0} aria-label="이전 컷">←</button>
      <span className="cs-t-label" aria-live="polite">{String(active+1).padStart(2,"0")} / {cuts.length}</span>
      <button type="button" className="cs-btn cs-btn--ghost" onClick={()=>go(active+1)} disabled={active===last} aria-label="다음 컷">→</button>
    </div>
    <div className="cs-svc-webtoon-book-progress" aria-hidden="true"><i/></div>
    <details className="cs-svc-webtoon-continuous"><summary className="cs-t-label">{cuts.length}컷 전체 이어서 읽기</summary><div>{cuts.map(cut=><Image key={cut.src} src={cut.src} alt={cut.alt} width={800} height={1200} sizes={sizes} loading="lazy"/>)}</div></details>
  </div>;
}
