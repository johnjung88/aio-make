"use client";

/* R5 공용 모션 런타임(WP-S1 소유, WP-S2는 import만).
 * - useInViewPlay: 화면 안 + 탭 보임 + 움직임 켜짐 + reduced-motion 아님일 때만 data-play="running".
 *   CSS(service-motion.css)가 [data-play="paused"] 안의 모든 루프를 animation-play-state: paused로 멈춘다.
 * - useMotionProgress: 스크롤 진행값을 --cs-motion-progress(일반)·--cs-pin-progress(sticky 고정 구간)로 기록. 같은 노드에 data-play도 둔다.
 * - useAutoCycle: 보이는 동안만 n개 상태를 일정 간격으로 넘긴다. 사용자가 조작하면 멈춘다.
 * - LoopVideo / WorkPreview: 보이는 동안만 muted 재생.
 * 인라인 style 속성은 쓰지 않는다(테스트 8). 변수는 ref.style.setProperty로만 쓴다. */
import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useCsMotion } from "../shell/frame";
import "./service-motion.css";

const reducedQuery = () => matchMedia("(prefers-reduced-motion: reduce)");

export type InViewPlayOptions = {
  /** 이 비율 이상 보여야 재생(기본 0.15) */
  threshold?: number;
  rootMargin?: string;
  /** hover·focus·터치 중에는 멈춤(자동 넘김 카드용) */
  pauseOnInteract?: boolean;
};

/** 화면 밖·숨김 탭·움직임 끔·reduced-motion이면 false. 노드에 data-play="running|paused"를 기록한다 */
export function useInViewPlay(ref: RefObject<HTMLElement | null>, { threshold = 0.15, rootMargin = "0px", pauseOnInteract = false }: InViewPlayOptions = {}) {
  const { motion } = useCsMotion();
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = reducedQuery();
    let visible = false;
    let interacting = false;
    const sync = () => {
      const next = visible && !interacting && !document.hidden && motion === "on" && !reduced.matches;
      node.dataset.play = next ? "running" : "paused";
      setPlaying(next);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= threshold; sync(); }, { threshold: [0, threshold], rootMargin });
    observer.observe(node);
    const hold = () => { interacting = true; sync(); };
    const release = () => { interacting = false; sync(); };
    const leaveFocus = (event: FocusEvent) => { if (!node.contains(event.relatedTarget as Node | null)) release(); };
    if (pauseOnInteract) {
      node.addEventListener("pointerenter", hold);
      node.addEventListener("pointerleave", release);
      node.addEventListener("focusin", hold);
      node.addEventListener("focusout", leaveFocus);
    }
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      if (pauseOnInteract) {
        node.removeEventListener("pointerenter", hold);
        node.removeEventListener("pointerleave", release);
        node.removeEventListener("focusin", hold);
        node.removeEventListener("focusout", leaveFocus);
      }
    };
  }, [motion, ref, threshold, rootMargin, pauseOnInteract]);
  return playing;
}

/** playing인 동안 index를 intervalMs마다 넘긴다. stop()을 부르면 이후 자동 넘김을 하지 않는다 */
export function useAutoCycle(count: number, intervalMs: number, playing: boolean) {
  const [index, setIndex] = useState(0);
  const [stopped, setStopped] = useState(false);
  useEffect(() => {
    if (!playing || stopped || count < 2) return;
    const timer = window.setInterval(() => setIndex((previous) => (previous + 1) % count), intervalMs);
    return () => window.clearInterval(timer);
  }, [count, intervalMs, playing, stopped]);
  const select = useCallback((next: number, stop = true) => {
    if (stop) setStopped(true);
    setIndex(((next % count) + count) % count);
  }, [count]);
  return [index, select, stopped] as const;
}

export type MotionProgressOptions = {
  /** "pin": 부모 높이 동안 sticky로 고정된 구간의 진행(0→1). 기본은 화면 통과 진행 */
  mode?: "pass" | "pin";
  /** true면 `--cs-frame-progress`도 기록한다: 프레임이 화면 위쪽 절반으로 올라오는 만큼 0→1(짧은 모바일 프레임도 스크롤 내내 자란다) */
  frame?: boolean;
};

/** 스크롤 진행값을 CSS 변수로 기록한다. 움직임이 꺼지면 고정값(pass 0.5 · pin 1)으로 두어 내용이 모두 보인다 */
export function useMotionProgress(ref: RefObject<HTMLElement | null>, onProgress?: (progress: number) => void, { mode = "pass", frame: trackFrame = false }: MotionProgressOptions = {}) {
  const { motion } = useCsMotion();
  const callback = useRef(onProgress);
  useEffect(() => { callback.current = onProgress; }, [onProgress]);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = reducedQuery();
    const variable = mode === "pin" ? "--cs-pin-progress" : "--cs-motion-progress";
    if (motion !== "on" || reduced.matches) {
      node.dataset.motionReady = "false";
      node.dataset.inView = "false";
      node.dataset.play = "paused";
      node.dataset.entered = "true";
      node.style.setProperty(variable, mode === "pin" ? "1" : "0.5");
      node.style.setProperty("--cs-motion-shift", "0px");
      return;
    }
    if (trackFrame) node.style.setProperty("--cs-frame-progress", Math.max(0, Math.min(1, 1 - node.getBoundingClientRect().top / (innerHeight * .5))).toFixed(4));
    node.dataset.motionReady = "true";
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      const rect = node.getBoundingClientRect();
      const progress = mode === "pin"
        ? Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)))
        : Math.max(0, Math.min(1, (innerHeight * .78 - rect.top) / (rect.height + innerHeight * .2)));
      node.style.setProperty(variable, progress.toFixed(4));
      // 브랜드 영상 프레임 확대: 화면 통과 진행은 짧은 모바일 프레임에서 첫 화면에 이미 .97이라 자라는 모습이 안 보인다
      if (trackFrame) node.style.setProperty("--cs-frame-progress", Math.max(0, Math.min(1, 1 - rect.top / (innerHeight * .5))).toFixed(4));
      if (mode === "pass") node.style.setProperty("--cs-motion-shift", `${((progress - .5) * 70).toFixed(2)}px`);
      callback.current?.(progress);
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(update); };
    const visibility = () => {
      const live = visible && !document.hidden;
      node.dataset.inView = String(live);
      node.dataset.play = live ? "running" : "paused";
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) node.dataset.entered = "true";
      visibility();
    }, { rootMargin: "40px 0px" });
    observer.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); document.removeEventListener("visibilitychange", visibility); };
  }, [motion, ref, mode, trackFrame]);
}

export function MotionCanvas({ children, variant, className = "" }: { children: ReactNode; variant: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useMotionProgress(ref, undefined, { frame: variant === "brand-film" });
  return <div ref={ref} className={`cs-motion-canvas ${className}`} data-motion-variant={variant}>{children}</div>;
}

/** 제목 줄 단위 진입. 지연은 CSS nth-child로 준다 */
export function MotionTitle({ title }: { title: string }) {
  return <MotionCanvas variant="title"><h1 id="cs-hero-title" className="cs-t-display" aria-label={title.replaceAll("\n", " ")}>{title.split("\n").map(line=><span aria-hidden="true" className="cs-motion-title-line" key={line}>{line}</span>)}</h1></MotionCanvas>;
}

/** 장식·예시용 무음 반복 영상. 보이는 동안만 재생하고 그 밖에는 포스터에서 멈춘다 */
export function LoopVideo({ src, poster, label, className }: { src: string; poster?: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const playing = useInViewPlay(ref, { threshold: .35 });
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) { video.muted = true; video.play().catch(() => { /* 포스터 유지 */ }); }
    else video.pause();
  }, [playing]);
  return <video ref={ref} className={className} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} data-cs-loop />;
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
    const reduced = reducedQuery();
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
