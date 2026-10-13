"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { contentHomeHero, type HeroVideo } from "@/lib/content-home";

/* 히어로 미디어. 정지 이미지는 항상 아래층(LCP)이다.
 * contentHomeHero.video가 있을 때만 영상 층과 일시정지 버튼을 더한다. */
export function HeroMedia() {
  const { image, video } = contentHomeHero;
  return (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="ch-hero-img"
      />
      {video ? <HeroVideoLayer video={video} /> : null}
    </>
  );
}

function HeroVideoLayer({ video }: { video: HeroVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  // 영상 요소는 마운트 뒤에만 만든다. 서버 HTML의 autoplay가 reduced-motion보다 먼저 재생하는 일을 막는다.
  const [mounted, setMounted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoPlay(!reduce);
    setMounted(true);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!mounted || !node) return;
    node.muted = true;
    if (autoPlay) node.play().catch(() => setPlaying(false));
  }, [mounted, autoPlay]);

  if (!mounted) return null;

  const toggle = () => {
    const node = ref.current;
    if (!node) return;
    if (node.paused) node.play().catch(() => setPlaying(false));
    else node.pause();
  };

  return (
    <>
      <video
        ref={ref}
        className={"ch-hero-video" + (visible ? " is-playing" : "")}
        muted
        loop
        playsInline
        autoPlay={autoPlay}
        preload="metadata"
        poster={video.poster}
        aria-hidden="true"
        onPlaying={() => {
          setVisible(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <button
        type="button"
        className="ch-hero-pause"
        aria-label={playing ? "영상 일시정지" : "영상 재생"}
        onClick={toggle}
      >
        {playing ? (
          <Pause size={18} aria-hidden="true" />
        ) : (
          <Play size={18} aria-hidden="true" />
        )}
      </button>
    </>
  );
}
