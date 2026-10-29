"use client";
/* 쇼릴 영상 층(contentHomeHero.video가 있을 때만 쓰인다).
 * - <video>는 마운트 뒤에만 만든다. 서버 HTML에 autoplay 속성이 없고 reduced-motion 판정 전에 재생되지 않는다.
 * - 재생 여부: 헤더 움직임 토글(useCsMotion)이 켜져 있고 reduced-motion이 아니면 자동재생.
 *   토글로 멈추면 같이 멈추고, 이 버튼으로 영상만 따로 멈추거나 다시 재생할 수 있다(reduced-motion에서도 버튼으로 재생 가능).
 * - 'playing' 전에는 영상 층을 투명하게 둬 정지 이미지에서 깜빡임 없이 넘어간다. */
import { useEffect, useRef, useState } from "react";
import { Maximize, Pause, Play } from "lucide-react";
import { useCsMotion } from "@/components/content-site/shell/frame";
import { contentHomeHero, type HeroVideo } from "@/lib/content-home";
import { useReelSound } from "@/components/content-site/services/reel-sound";

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function HeroVideoLayer({ video }: { video: HeroVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const { motion } = useCsMotion();
  const [mounted, setMounted] = useState(false);
  const [wantPlay, setWantPlay] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [shown, setShown] = useState(false);
  const [actualMuted, setActualMuted] = useState(true);
  const [active, setActive] = useState(false);
  const automaticPause = useRef(false);
  const { muted, toggleSound } = useReelSound(ref);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    let intersecting = false;
    const sync = () => setActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      sync();
    }, { threshold: .05 });
    observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [mounted]);

  // 움직임 토글·reduced-motion → 자동재생 의도
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setWantPlay(motion === "on" && !reducedMotion());
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [motion]);

  useEffect(() => {
    const node = ref.current;
    if (!mounted || !node) return;
    if (wantPlay && active) node.play().catch(() => setPlaying(false));
    else if (!node.paused) {
      automaticPause.current = true;
      node.pause();
    }
  }, [mounted, wantPlay, active]);

  if (!mounted) return null;

  return (
    <>
      <video
        ref={ref}
        className="ch-hero-video"
        data-shown={shown ? "" : undefined}
        muted={muted}
        loop
        playsInline
        controls
        preload="metadata"
        poster={video.poster}
        onLoadedMetadata={() => setShown(true)}
        onVolumeChange={event => setActualMuted(event.currentTarget.muted)}
        aria-label="AIO MAKE 컨텐츠 제작 영상 · 59초"
        onPlay={() => setWantPlay(true)}
        onPlaying={() => {
          setShown(true);
          setPlaying(true);
        }}
        onPause={() => {
          setPlaying(false);
          if (automaticPause.current) automaticPause.current = false;
          else setWantPlay(false);
        }}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <div className="ch-hero-controls" role="group" aria-label="히어로 영상 조작">
      <button
        type="button"
        className="ch-hero-pause"
        aria-label={
          playing ? contentHomeHero.videoPause : contentHomeHero.videoPlay
        }
        onClick={() => {
          const node = ref.current;
          if (!node) return;
          if (node.paused) {
            setWantPlay(true);
            node.play().catch(() => setPlaying(false));
          } else {
            setWantPlay(false);
            node.pause();
          }
        }}
      >
        {playing ? (
          <Pause size={18} aria-hidden="true" />
        ) : (
          <Play size={18} aria-hidden="true" />
        )}
      </button>
      <button type="button" className="ch-hero-sound cs-t-caption" aria-pressed={!actualMuted} onClick={toggleSound}>
        {actualMuted ? "소리 켜기" : "소리 끄기"}
      </button>
      <button type="button" className="ch-hero-pause" aria-label="영상 전체화면" onClick={() => {
        const node = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
        if (node?.requestFullscreen) node.requestFullscreen().catch(() => {});
        else node?.webkitEnterFullscreen?.();
      }}><Maximize size={18} aria-hidden="true"/></button>
      </div>
    </>
  );
}
