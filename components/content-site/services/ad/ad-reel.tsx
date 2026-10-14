"use client";

/* R5 WP-S2 · SNS 광고 고유 client 섬(이 폴더의 유일한 "use client").
 * - 공개판·검토판 모두 기울어진 3열 레일(-11°)이 18초 왕복한다. 열마다 방향과 위상이 달라(1·3열 위로, 2열 아래로, 3열 반 주기 앞섬)
 *   레퍼런스(aio-service-pages-v01 .collage-rail)처럼 서로 엇갈려 흐른다. 화면 밖·숨김 탭·움직임 끔에서는 멈춘다(data-play).
 * - 가운데 9:16 화면은 움직이지 않고 고정된다. 공개판은 연출 예시 영상을 보일 때만 무음 반복 재생하고 위쪽 진행 막대가 재생 위치를 따른다.
 *   검토판은 서버가 고른 실제 작업물(FeaturedWork)을 children으로 받는다.
 * - 고객 문자열·경로는 이 파일에 없다. 레일 카드와 가운데 소재는 서버(landing.tsx)가 props로 넘긴다.
 * - 인라인 style 속성 없음. 카드 구도(object-position)는 ref로 CSS 변수에만 쓴다. */
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CsTag } from "../../ui/tag";
import { useInViewPlay } from "../motion-runtime";

export type RailCard =
  | { kind: "image"; src: string; width: number; height: number; focus?: string }
  | { kind: "video"; src: string; poster?: string; focus?: string }
  | { kind: "type"; text: string };

export type CenterMedia = { kind: "image" | "video"; src: string; poster?: string; alt: string; tag: string; width: number; height: number; focus?: string };

const setFocus = (focus?: string) => (node: HTMLElement | null) => { if (node && focus) node.style.setProperty("--svc-focus", focus); };

function RailVideo({ src, poster, playing }: { src: string; poster?: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) { video.muted = true; video.play().catch(() => { /* 포스터 유지 */ }); }
    else video.pause();
  }, [playing]);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" />;
}

function RailItem({ card, playing }: { card: RailCard; playing: boolean }) {
  if (card.kind === "type") return <div className="cs-svc-ad-rail-card cs-svc-ad-rail-card--type"><span className="cs-t-h3">{card.text}</span></div>;
  return <div ref={setFocus(card.focus)} className="cs-svc-ad-rail-card">
    {card.kind === "video"
      ? <RailVideo src={card.src} poster={card.poster} playing={playing} />
      : <Image src={card.src} alt="" width={card.width} height={card.height} sizes="(max-width:767px) 34vw, 220px" />}
  </div>;
}

function CenterScreen({ media, playing, labels }: { media: CenterMedia; playing: boolean; labels: { pause: string; play: string } }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [held, setHeld] = useState(false);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (playing && !held) { node.muted = true; node.play().catch(() => { /* 포스터 유지 */ }); }
    else if (!held) node.pause();
  }, [playing, held]);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const tick = () => {
      const node = video.current;
      if (node && node.duration > 0) box.current?.style.setProperty("--svc-progress", (node.currentTime / node.duration).toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  const toggle = () => {
    const node = video.current;
    if (!node) return;
    if (node.paused) { setHeld(false); node.muted = true; node.play().catch(() => { /* 포스터 유지 */ }); }
    else { setHeld(true); node.pause(); }
  };
  return <figure className="cs-svc-ad-screen">
    <div ref={(node) => { box.current = node; setFocus(media.focus)(node); }} className="cs-svc-ad-screen-media" data-kind={media.kind}>
      {media.kind === "video"
        ? <video ref={video} src={media.src} poster={media.poster} muted loop playsInline preload="metadata" aria-label={media.alt} onPlaying={() => setRunning(true)} onPause={() => setRunning(false)} />
        : <Image src={media.src} alt={media.alt} width={media.width} height={media.height} sizes="(max-width:767px) 46vw, 300px" priority />}
      <span className="cs-svc-ad-screen-bar" aria-hidden="true" />
      {media.kind === "video" && <button type="button" className="cs-svc-ad-screen-toggle" data-state={running ? "playing" : "paused"} aria-label={running ? labels.pause : labels.play} onClick={toggle}>
        <span className="cs-svc-ad-screen-toggle-icon" aria-hidden="true" />
      </button>}
      <CsTag overlay>{media.tag}</CsTag>
    </div>
  </figure>;
}

export function AdRail({ columns, center, tag, labels, children }: { columns: RailCard[][]; center?: CenterMedia; tag?: string; labels: { pause: string; play: string }; children?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const playing = useInViewPlay(root, { threshold: .2 });
  return <div ref={root} className="cs-svc-ad-reel">
    <div className="cs-svc-ad-rail" aria-hidden="true">
      <div className="cs-svc-ad-rail-stage">
        {columns.map((column, index) => <div key={index} className="cs-svc-ad-rail-column" data-column={index}>
          {column.map((card, cell) => <RailItem key={cell} card={card} playing={playing} />)}
        </div>)}
      </div>
    </div>
    <div className="cs-svc-ad-reel-center">{children ?? (center ? <CenterScreen media={center} playing={playing} labels={labels} /> : null)}</div>
    {tag && <span className="cs-svc-ad-reel-tag"><CsTag>{tag}</CsTag></span>}
  </div>;
}
