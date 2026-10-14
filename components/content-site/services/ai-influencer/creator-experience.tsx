"use client";

/* R5 WP-S2 · R6 WP-B · AI 인플루언서 고유 client 섬(이 폴더의 유일한 "use client").
 * - CreatorDeck(히어로): 4장의 3D 카드가 약 4초마다 자동 회전한다. 앞 카드는 정면, 양옆은 rotateY ±42°·translateZ·scale로 물러나고
 *   뒤 카드는 가장 깊이 숨는다. 카드 아래에는 이름 한 줄과 좌우 화살표만 있다(R6: 피드 3컷·이름 버튼·타이머 막대·카피 삭제).
 *   hover·focus·터치·화면 밖·숨김 탭·움직임 끔에서는 멈추고(useInViewPlay), 클릭·스와이프·화살표로 고른다.
 * - CreatorRoster(계정 소개): 탭 전환 때 피드 3컷이 순차 진입하고, 보이는 계정의 큰 피드 화면은 3.6초마다 다음 컷으로 닦아 넘긴다.
 * - 문단(소개·설명)은 움직이지 않는다. reduced-motion이면 자동 넘김 없이 모든 카드와 컷이 정적으로 보인다.
 * - 인라인 style 속성 없음(테스트 8). 카드 위치는 data-place, 순서 지연은 data-order로 CSS가 정한다. */
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { creatorRoster } from "@/lib/content-site/creator-roster";
import { EXAMPLE_MEDIA } from "@/lib/content-site/example-media";
import { useInViewPlay } from "../motion-runtime";

type Creator = (typeof creatorRoster)[number];

const COUNT = creatorRoster.length;
/** 히어로 카드 자동 회전 간격 */
const DECK_MS = 4000;
/** 계정 소개 피드 자동 넘김 간격 */
const FEED_MS = 3600;

/** 카드 미디어: 연출 예시 슬롯이 영상이거나 파일명에 계정 id가 들어 있으면 슬롯, 아니면 계정 기준 초상 */
function cardMedia(creator: Creator) {
  const slot = EXAMPLE_MEDIA.find((item) => item.id === creator.cardSlot);
  if (slot && (slot.kind === "video" || slot.src.includes(creator.id)))
    return { kind: slot.kind, src: slot.src, poster: slot.poster };
  return { kind: "image" as const, src: creator.portrait, poster: undefined };
}

/** 앞 0 · 오른쪽 1 · 왼쪽 -1 · 뒤 2 */
function place(index: number, active: number) {
  const distance = (index - active + COUNT) % COUNT;
  return distance === COUNT - 1 ? -1 : distance;
}

/** playing인 동안 ms 뒤 한 번 넘긴다. key(현재 선택)가 바뀌면 처음부터 다시 잰다 */
function useAdvance(playing: boolean, ms: number, key: number, advance: () => void) {
  const step = useRef(advance);
  useEffect(() => { step.current = advance; });
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => step.current(), ms);
    return () => window.clearTimeout(timer);
  }, [playing, ms, key]);
}

/** 가로로 분명히 민 경우만 넘긴다. 세로 스크롤은 touch-action: pan-y로 브라우저가 계속 처리한다 */
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

function cycle(event: KeyboardEvent<HTMLButtonElement>, current: number, count: number, select: (index: number) => void) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (current + (event.key === "ArrowRight" ? 1 : -1) + count) % count;
  select(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
}

/** 카드 영상 슬롯(생성 5초 루프): 앞 카드이고 보일 때만 무음 재생 */
function CardVideo({ src, poster, label, playing }: { src: string; poster?: string; label: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (playing) { video.muted = true; video.play().catch(() => { /* 포스터 유지 */ }); }
    else video.pause();
  }, [playing]);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label={label} />;
}

export function CreatorDeck() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const rotating = useInViewPlay(root, { threshold: .3, pauseOnInteract: true });
  const visible = useInViewPlay(stage, { threshold: .3 });
  const [active, setActive] = useState(0);
  const select = (index: number) => setActive(((index % COUNT) + COUNT) % COUNT);
  useAdvance(rotating, DECK_MS, active, () => setActive((previous) => (previous + 1) % COUNT));
  const swipe = useSwipe((direction) => select(active + direction));
  const creator = creatorRoster[active];
  return <div ref={root} className="cs-svc-ai-influencer-deck">
    <div ref={stage} className="cs-svc-ai-influencer-orbit" {...swipe}>
      {creatorRoster.map((item, index) => {
        const media = cardMedia(item);
        const front = index === active;
        return <button key={item.id} type="button" className="cs-svc-ai-influencer-orbit-card" data-place={place(index, active)} aria-hidden={!front} tabIndex={-1} onClick={() => select(index)}>
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
      <p className="cs-svc-ai-influencer-deck-name cs-t-label">{creator.name}</p>
      <button type="button" className="cs-svc-ai-influencer-deck-arrow" aria-label="다음 크리에이터" onClick={() => select(active + 1)}><span aria-hidden="true">→</span></button>
    </div>
  </div>;
}

function CreatorFeed({ creator }: { creator: Creator }) {
  const root = useRef<HTMLDivElement>(null);
  const playing = useInViewPlay(root, { threshold: .35, pauseOnInteract: true });
  const [selected, setSelected] = useState(0);
  const count = creator.images.length;
  const select = (index: number) => setSelected(((index % count) + count) % count);
  useAdvance(playing, FEED_MS, selected, () => setSelected((previous) => (previous + 1) % count));
  const swipe = useSwipe((direction) => select(selected + direction));
  const item = creator.images[selected];
  return <div ref={root} className="cs-svc-ai-influencer-feed-ui">
    <div className="cs-svc-ai-influencer-feed-stage" {...swipe}>
      {creator.images.map((image, index) => <figure key={image.src} data-active={selected === index} data-order={index} aria-hidden={selected !== index}>
        <Image src={image.src} alt={`${creator.name} ${image.label} · AI 가상인물`} width={900} height={1350} sizes="(max-width:767px) 90vw, 40vw" />
      </figure>)}
    </div>
    <div className="cs-svc-ai-influencer-feed-caption"><span className="cs-t-label">{item.label}</span><p className="cs-t-small">{item.caption}</p></div>
    <div className="cs-svc-ai-influencer-feed-thumbs" role="group" aria-label={`${creator.name} 피드 이미지 선택`}>
      {creator.images.map((image, index) => <button key={image.src} type="button" data-order={index} aria-pressed={selected === index} onClick={() => select(index)} onKeyDown={(event) => cycle(event, index, count, select)}>
        <Image src={image.src} alt="" width={120} height={160} sizes="100px" />
        <span className="cs-t-caption">{image.label}</span>
        {selected === index && <i key={`${selected}-${playing}`} data-run={playing} aria-hidden="true" />}
      </button>)}
    </div>
  </div>;
}

export function CreatorRoster() {
  const [selected, setSelected] = useState(0);
  const [all, setAll] = useState(false);
  const choose = (index: number) => { setSelected(index); setAll(false); };
  return <div className="cs-svc-ai-influencer-roster-ui">
    <div className="cs-svc-ai-influencer-tabs" role="tablist" aria-label="계정 소개">
      {creatorRoster.map((creator, index) => <button key={creator.id} id={`creator-tab-${creator.id}`} type="button" role="tab" aria-selected={selected === index} aria-controls={`creator-${creator.id}`} tabIndex={selected === index ? 0 : -1} onClick={() => choose(index)} onKeyDown={(event) => cycle(event, index, COUNT, choose)}>
        <span className="cs-t-caption">0{index + 1}</span><span className="cs-t-h3">{creator.name}</span><span className="cs-t-small">{creator.category}</span>
      </button>)}
    </div>
    <div className="cs-svc-ai-influencer-panels">
      {creatorRoster.map((creator, index) => <article key={creator.id} id={`creator-${creator.id}`} role="tabpanel" aria-labelledby={`creator-tab-${creator.id}`} hidden={!all && selected !== index} className="cs-svc-ai-influencer-panel">
        <div className="cs-svc-ai-influencer-profile">
          <span className="cs-t-caption">AI 가상인물 · 계정 소개</span>
          <h3 className="cs-t-h2">{creator.name}</h3>
          <p className="cs-t-lead">{creator.line}</p>
          <p className="cs-t-body">{creator.bio}</p>
          <div className="cs-svc-ai-influencer-profile-meta"><p className="cs-t-small">{creator.direction}</p><p className="cs-t-caption">{creator.account}</p></div>
        </div>
        <CreatorFeed creator={creator} />
      </article>)}
    </div>
    <button type="button" className="cs-link cs-svc-ai-influencer-show-all" onClick={() => setAll((previous) => !previous)} aria-expanded={all}>{all ? "선택한 계정만 보기" : "네 계정 모두 펼쳐 보기"} <span aria-hidden="true">{all ? "−" : "+"}</span></button>
  </div>;
}
