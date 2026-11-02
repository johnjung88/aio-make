"use client";

/* R5 WP-S2 · R6 WP-C · SNS 광고 고유 client 섬(이 폴더의 유일한 "use client").
 * - 공개판·검토판 모두 기울어진 3열 레일(-11°)이 9초 왕복한다. 열마다 방향과 위상이 달라(1·3열 위로, 2열 아래로, 3열 반 주기 앞섬)
 *   레퍼런스(aio-service-pages-v01 .collage-rail)처럼 서로 엇갈려 흐른다. 화면 밖·숨김 탭·움직임 끔에서는 멈춘다(data-play).
 * - R6: 가운데 영상 카드(공개판 연출 예시·검토판 FeaturedWork)는 삭제했다. 레일이 히어로 미디어 칸 전체를 쓰는 장식 전용(aria-hidden)이다.
 * - R7: 사례 카드의 여러 안 보기(AdWorkVariants)도 같은 섬에 둔다. 서비스마다 client 섬은 1개라는 계약을 지키기 위해서다.
 * - 고객 문자열·경로는 이 파일에 없다. 레일 카드와 안 목록은 서버(landing.tsx · works.tsx)가 props로 넘긴다.
 * - 인라인 style 속성 없음. 카드 구도(object-position)는 ref로 CSS 변수에만 쓴다. */
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CsTag } from "../../ui/tag";
import { useInViewPlay } from "../motion-runtime";

export type RailCard =
  | { kind: "image"; src: string; width: number; height: number; focus?: string }
  | { kind: "video"; src: string; poster?: string; focus?: string };

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

export type WorkVariantItem = { src: string; poster?: string; alt: string };

/* 사례 카드의 여러 안 보기(R7, 세로형 카드 전용). 서버가 고른 9:16 영상 목록과 안 수 표시(label)를 props로만 받는다.
 * 포스터 띠(최대 4칸)를 누르면 위 영상이 그 안으로 바뀌고 바로 재생된다. 처음 그려질 때는 재생하지 않는다. */
export function AdWorkVariants({ items, label, tag }: { items: WorkVariantItem[]; label: string; tag: string }) {
  const [index, setIndex] = useState(0);
  const picked = useRef(false);
  const player = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!picked.current) return;
    player.current?.play().catch(() => { /* 재생 막대로 직접 시작 */ });
  }, [index]);
  const current = items[index] ?? items[0];
  return <div className="cs-svc-ad-variants">
    <div className="cs-media-stack">
      <div className="cs-media cs-ratio-9x16">
        <video ref={player} src={current.src} poster={current.poster} muted controls playsInline preload="none" aria-label={current.alt} />
      </div>
      <CsTag>{tag}</CsTag>
    </div>
    <p className="cs-t-caption cs-svc-ad-variants-count">{label}</p>
    <div className="cs-svc-ad-variants-strip" role="group" aria-label={`${label} 영상 고르기`}>
      {items.map((item, i) => <button key={item.src} type="button" className="cs-svc-ad-variants-thumb" aria-pressed={i === index} aria-label={`${i + 1}번째 영상 보기`}
        onClick={() => { picked.current = true; setIndex(i); }}>
        {item.poster ? <Image src={item.poster} alt="" fill sizes="(max-width:479px) 20vw, 80px" /> : null}
        <span className="cs-t-caption" aria-hidden="true">{i + 1}</span>
      </button>)}
    </div>
  </div>;
}
