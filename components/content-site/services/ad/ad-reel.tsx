"use client";

/* R5 WP-S2 · R6 WP-C · SNS 광고 고유 client 섬(이 폴더의 유일한 "use client").
 * - 공개판·검토판 모두 기울어진 3열 레일(-11°)이 9초 왕복한다. 열마다 방향과 위상이 달라(1·3열 위로, 2열 아래로, 3열 반 주기 앞섬)
 *   레퍼런스(aio-service-pages-v01 .collage-rail)처럼 서로 엇갈려 흐른다. 화면 밖·숨김 탭·움직임 끔에서는 멈춘다(data-play).
 * - R6: 가운데 영상 카드(공개판 연출 예시·검토판 FeaturedWork)는 삭제했다. 레일이 히어로 미디어 칸 전체를 쓰는 장식 전용(aria-hidden)이다.
 * - 고객 문자열·경로는 이 파일에 없다. 레일 카드는 서버(landing.tsx)가 props로 넘긴다.
 * - 인라인 style 속성 없음. 카드 구도(object-position)는 ref로 CSS 변수에만 쓴다. */
import Image from "next/image";
import { useEffect, useRef } from "react";
import { CsTag } from "../../ui/tag";
import { useInViewPlay } from "../motion-runtime";

export type RailCard =
  | { kind: "image"; src: string; width: number; height: number; focus?: string }
  | { kind: "video"; src: string; poster?: string; focus?: string }
  | { kind: "type"; text: string };

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

export function AdRail({ columns, tag }: { columns: RailCard[][]; tag?: string }) {
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
    {tag && <span className="cs-svc-ad-reel-tag"><CsTag>{tag}</CsTag></span>}
  </div>;
}
