"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { useCsMotion } from "../shell/frame";
import "./service-motion.css";

export function useMotionProgress(ref: RefObject<HTMLElement | null>, onProgress?: (progress: number) => void) {
  const { motion } = useCsMotion();
  const callback = useRef(onProgress);
  useEffect(() => { callback.current = onProgress; }, [onProgress]);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion !== "on" || reduced.matches) {
      node.dataset.motionReady = "false";
      node.dataset.inView = "false";
      node.style.setProperty("--cs-motion-progress", "0.5");
      node.style.setProperty("--cs-motion-shift", "0px");
      return;
    }
    node.dataset.motionReady = "true";
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const rect = node.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * .78 - rect.top) / (rect.height + innerHeight * .2)));
      node.style.setProperty("--cs-motion-progress", progress.toFixed(4));
      node.style.setProperty("--cs-motion-shift", `${((progress - .5) * 70).toFixed(2)}px`);
      callback.current?.(progress);
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(update); };
    const visibility = () => {
      node.dataset.inView = String(visible && !document.hidden);
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      node.dataset.inView = String(visible && !document.hidden);
      if (visible) { node.dataset.entered = "true"; schedule(); }
    }, { rootMargin: "40px 0px" });
    observer.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", visibility); };
  }, [motion, ref]);
}

export function MotionCanvas({ children, variant, className = "" }: { children: ReactNode; variant: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotionProgress(ref);
  return <div ref={ref} className={`cs-motion-canvas ${className}`} data-motion-variant={variant}>{children}</div>;
}

export function MotionTitle({ title }: { title: string }) {
  return <MotionCanvas variant="title"><h1 id="cs-hero-title" className="cs-t-display" aria-label={title.replaceAll("\n", " ")}>{title.split("\n").map((line,index)=><span aria-hidden="true" className="cs-motion-title-line" key={line} style={{ animationDelay:`${index * 110}ms` }}>{line}</span>)}</h1></MotionCanvas>;
}

let activePreview: HTMLVideoElement | null = null;
/** A single visible, muted preview owns autoplay; source playback remains available */
export function WorkPreview({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const userControlled = useRef(false);
  const { motion } = useCsMotion();
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let visible = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (!visible || document.hidden || motion !== "on" || reduced.matches) { video.pause(); if (activePreview === video) activePreview = null; return; }
      if (userControlled.current) return;
      if (activePreview && activePreview !== video) activePreview.pause();
      activePreview = video;
      video.muted = true;
      video.play().catch(() => { /* Poster and native controls stay available */ });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .35; sync(); }, { threshold:[0,.35,.65] });
    observer.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); video.pause(); if (activePreview === video) activePreview = null; };
  }, [motion, src]);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline controls preload="none" aria-label={label} data-cs-preview onPointerDown={()=>{userControlled.current=true;}} onKeyDown={()=>{userControlled.current=true;}} onPlay={()=>{if(activePreview && activePreview!==ref.current)activePreview.pause();activePreview=ref.current;}} />;
}
