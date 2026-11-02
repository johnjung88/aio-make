"use client";


import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";
import { creatorRoster } from "@/lib/content-site/creator-roster";
import { useInViewPlay } from "../motion-runtime";

type CreatorCardMedia = { kind: "image" | "video"; src: string; poster?: string };

const COUNT = creatorRoster.length;

const DECK_MS = 4000;




function place(index: number, active: number) {
  const distance = (index - active + COUNT) % COUNT;
  return distance === COUNT - 1 ? -1 : distance;
}


function useAdvance(playing: boolean, ms: number, key: number, advance: () => void) {
  const step = useRef(advance);
  useEffect(() => { step.current = advance; });
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => step.current(), ms);
    return () => window.clearTimeout(timer);
  }, [playing, ms, key]);
}


function useSwipe(move: (direction: 1 | -1) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onTouchStart: (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    },
    onTouchEnd: (event: TouchEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - from.x;
      const dy = touch.clientY - from.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) move(dx < 0 ? 1 : -1);
    },
  };
}



function CardVideo({ src, poster, label, playing }: { src: string; poster?: string; label: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) { video.muted = true; video.play().catch(() => {  }); }
    else video.pause();
  }, [playing]);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />;
}

export function CreatorDeck({ cards }: { cards: readonly CreatorCardMedia[] }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rotating = useInViewPlay(root, { threshold: .3, pauseOnInteract: true });
  const visible = useInViewPlay(stage, { threshold: .3 });
  const [active, setActive] = useState(0);
  const select = (index: number) => setActive(((index % COUNT) + COUNT) % COUNT);
  useAdvance(rotating && COUNT >= 3, DECK_MS, active, () => setActive((previous) => (previous + 1) % COUNT));
  const swipe = useSwipe((direction) => select(active + direction));
  const creator = creatorRoster[active];
  if (!creator) return null;
  if (COUNT < 3) return <figure className="cs-svc-ai-influencer-static"><Image src={creator.portrait} alt={`${creator.name} · AI 가상인물`} width={720} height={960} sizes="(max-width:767px) 80vw, 400px" /><figcaption className="cs-t-body">{creator.name} · {creator.category}<br />{creator.line}</figcaption></figure>;
  return <div ref={root} className="cs-svc-ai-influencer-deck">
    <div ref={stage} className="cs-svc-ai-influencer-orbit" {...swipe}>
      {creatorRoster.map((item, index) => {
        const media = cards[index] ?? { kind: "image", src: item.portrait };
        const front = index === active;
        return <button key={item.id} type="button" className="cs-svc-ai-influencer-orbit-card" data-place={COUNT < 3 ? (front ? 0 : 2) : place(index, active)} aria-hidden={!front} tabIndex={-1} onClick={() => select(index)}>
          <span className="cs-svc-ai-influencer-orbit-media">
            {media.kind === "video"
              ? <CardVideo src={media.src} poster={media.poster} label={`${item.name} · AI 가상인물`} playing={visible && front} />
              : <Image src={media.src} alt={`${item.name} · AI 가상인물`} width={900} height={1200} sizes="(max-width:767px) 75vw, 480px" priority={index === 0} />}
          </span>
          <span className="cs-svc-ai-influencer-orbit-tag cs-t-caption">AI 가상인물</span>
        </button>;
      })}
    </div>
    <div className="cs-svc-ai-influencer-deck-bar" role="group" aria-label="크리에이터 선택">
      <button type="button" className="cs-svc-ai-influencer-deck-arrow" aria-label="이전 크리에이터" onClick={() => select(active - 1)}><span aria-hidden="true">←</span></button>
      <p className="cs-svc-ai-influencer-deck-name cs-t-label">{creator.name} · {creator.category}</p>
      <button type="button" className="cs-svc-ai-influencer-deck-arrow" aria-label="다음 크리에이터" onClick={() => select(active + 1)}><span aria-hidden="true">→</span></button>
    </div>
    <p className="cs-t-body cs-r8-note">{creator.line}</p>
  </div>;
}
