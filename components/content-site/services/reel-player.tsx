"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ExampleSlot } from "@/lib/content-site/example-media";
import { useInViewPlay } from "./motion-runtime";
import { CsTag } from "../ui/tag";
import { useReelSound } from "./reel-sound";

/** W1 owns the muted player shell; W2 supplies the final src and sound UI. */
export function ReelPlayer({ slot, hero = false }: { slot: ExampleSlot; hero?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const active = useInViewPlay(root, { threshold: .2 });
  const [failed, setFailed] = useState(false);
  const [held, setHeld] = useState(false);
  const [running, setRunning] = useState(false);
  const { muted, toggleSound } = useReelSound(video);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (active && !held && !failed) { node.play().catch(() => {}); }
    else node.pause();
  }, [active, held, failed, slot.src]);
  const hasVideo = slot.kind === "video" && Boolean(slot.src) && !failed;
  const poster = slot.poster || (slot.kind === "image" ? slot.src : "");
  return <figure ref={root} className={`cs-reel${hero ? " cs-reel--hero" : ""}`} data-slot={slot.id} data-aspect={slot.aspect}>
    {hasVideo ? <video ref={video} src={slot.src} poster={poster} muted={muted} loop playsInline preload={hero ? "metadata" : "none"} aria-label={slot.alt} onPlaying={() => setRunning(true)} onPause={() => setRunning(false)} onError={() => setFailed(true)} />
      : poster ? <Image src={poster} alt={slot.alt} width={slot.width} height={slot.height} sizes={hero ? "(min-width:1024px) 60vw, 90vw" : "(min-width:1024px) 50vw, 90vw"} priority={hero} /> : null}
    <CsTag overlay>{slot.label}</CsTag>
    {hasVideo && <div className="cs-reel-controls" role="group" aria-label="영상 조작"><button className="cs-reel-toggle cs-btn" type="button" aria-label={running ? "영상 일시정지" : "영상 재생"} aria-pressed={running} onClick={() => {
      const node = video.current;
      if (!node) return;
      if (running) { setHeld(true); node.pause(); }
      else { setHeld(false); node.play().catch(() => {}); }
    }}>{running ? "영상 일시정지" : "영상 재생"}</button>{hero && <button type="button" className="cs-reel-sound cs-btn" aria-pressed={!muted} onClick={toggleSound}>{muted ? "소리 켜기" : "소리 끄기"}</button>}</div>}
  </figure>;
}
