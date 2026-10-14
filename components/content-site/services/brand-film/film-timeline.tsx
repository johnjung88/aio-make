"use client";

/* R5 WP-S2 · 브랜드 홍보 영상 고유 client 섬(이 폴더의 유일한 "use client").
 * - FilmScreen(히어로 공개판): 메인 영상을 보일 때만 무음 반복 재생하고(화면 밖·숨김 탭·움직임 끔·reduced-motion이면 정지),
 *   아래쪽 진행선이 재생 위치를 따라간다. 44px 재생/정지 버튼은 사용자가 멈춘 상태를 유지한다.
 *   프레임 확대(.88→1)는 ServiceHero의 MotionCanvas variant="brand-film" 스크롤 연동을 그대로 쓴다.
 * - FilmTimeline(구성 예시): 30초/60초를 바꿀 때마다 세그먼트가 너비를 다시 나누며 순서대로 다시 들어온다.
 *   재생 헤드는 미리보기 영상의 currentTime을 따라 움직이고, 영상이 없거나 열리지 않으면 12초 루프 시계로 움직인다.
 * - 인라인 style 속성 없음. 진행값은 ref.style.setProperty로 CSS 변수에만 쓴다. */
import { useEffect, useRef, useState } from "react";
import { CsTag } from "../../ui/tag";
import { useInViewPlay } from "../motion-runtime";

export type FilmSource = { src: string; poster?: string; label: string; tag?: string };
export type FilmLabels = { pause: string; play: string };

/** 영상이 없을 때 재생 헤드가 한 바퀴 도는 시간 */
const LOOP_MS = 12 * 1000;

/** 보일 때만 재생, 진행값(0~1)을 매 프레임 알린다. 사용자가 멈추면 다시 누를 때까지 자동 재생하지 않는다 */
function FilmVideo({ source, labels, playing, onProgress, onFail }: { source: FilmSource; labels: FilmLabels; playing: boolean; onProgress?: (progress: number) => void; onFail?: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const report = useRef(onProgress);
  const [held, setHeld] = useState(false);
  const [running, setRunning] = useState(false);
  useEffect(() => { report.current = onProgress; });
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (playing && !held) { node.muted = true; node.play().catch(() => { /* 포스터 유지 */ }); }
    else if (!held) node.pause();
  }, [playing, held, source.src]);
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const tick = () => {
      const node = video.current;
      if (node && node.duration > 0) {
        const progress = node.currentTime / node.duration;
        box.current?.style.setProperty("--svc-progress", progress.toFixed(4));
        report.current?.(progress);
      }
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
  return <div ref={box} className="cs-svc-brand-film-video" data-running={running}>
    <video ref={video} src={source.src} poster={source.poster} muted loop playsInline preload="metadata" aria-label={source.label} onPlaying={() => setRunning(true)} onPause={() => setRunning(false)} onError={onFail} />
    <span className="cs-svc-brand-film-progress" aria-hidden="true" />
    <button type="button" className="cs-svc-brand-film-toggle" data-state={running ? "playing" : "paused"} aria-label={running ? labels.pause : labels.play} onClick={toggle}>
      <span className="cs-svc-brand-film-toggle-icon" aria-hidden="true" />
    </button>
  </div>;
}

export function FilmScreen({ source, labels }: { source: FilmSource; labels: FilmLabels }) {
  const root = useRef<HTMLElement>(null);
  const playing = useInViewPlay(root, { threshold: .35 });
  return <figure ref={root} className="cs-svc-brand-film-screen">
    <FilmVideo source={source} labels={labels} playing={playing} />
    {source.tag && <CsTag overlay>{source.tag}</CsTag>}
  </figure>;
}

const ROLES = ["도입", "핵심 메시지", "고객의 문제", "제품과 서비스", "일하는 방식", "마무리"] as const;
const versions = [
  { length: "30초", title: "한 가지 메시지에 집중", description: "도입에서 제품의 특징으로 이어지는 짧은 구성", parts: ["도입", "핵심 메시지", "마무리"] },
  { length: "60초", title: "배경과 과정을 설명", description: "고객의 문제와 제품의 쓰임, 일하는 방식까지 전하는 구성", parts: ["도입", "고객의 문제", "제품과 서비스", "일하는 방식", "마무리"] },
] as const;

export function FilmTimeline({ source, labels }: { source?: FilmSource; labels: FilmLabels }) {
  const root = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const playing = useInViewPlay(root, { threshold: .3 });
  const [active, setActive] = useState(0);
  const [current, setCurrent] = useState(0);
  const [loop, setLoop] = useState(!source);
  const value = versions[active];
  const parts: readonly string[] = value.parts;
  const move = (progress: number) => {
    ruler.current?.style.setProperty("--svc-playhead", progress.toFixed(4));
    const index = Math.min(parts.length - 1, Math.floor(progress * parts.length));
    setCurrent((previous) => (previous === index ? previous : index));
  };
  const step = useRef(move);
  useEffect(() => { step.current = move; });
  // 영상이 없으면 보이는 동안만 12초 루프 시계로 재생 헤드를 움직인다
  useEffect(() => {
    if (!loop || !playing) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => { step.current(((now - start) % LOOP_MS) / LOOP_MS); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loop, playing]);
  return <div ref={root} className="cs-svc-brand-film-timeline" data-loop={loop}>
    <div className="cs-svc-brand-film-timeline-head">
      {source && !loop && <figure className="cs-svc-brand-film-preview">
        <FilmVideo source={source} labels={labels} playing={playing} onProgress={move} onFail={() => setLoop(true)} />
        {source.tag && <figcaption className="cs-t-caption">{source.tag}</figcaption>}
      </figure>}
      <div className="cs-svc-brand-film-timeline-copy">
        <div className="cs-svc-brand-film-length-tabs" role="group" aria-label="영상 길이 구성 예시">
          {versions.map((item, index) => <button className="cs-btn cs-btn--ghost" type="button" key={item.length} aria-pressed={index === active} onClick={() => setActive(index)}>{item.length}</button>)}
        </div>
        <h3 className="cs-t-h3">{value.title}</h3>
        <p className="cs-t-body">{value.description}</p>
      </div>
    </div>
    <div ref={ruler} className="cs-svc-brand-film-ruler">
      <ol className="cs-svc-brand-film-track" data-version={active} aria-label={`${value.length} 구성 예시`}>
        {ROLES.map((role) => {
          const order = parts.indexOf(role);
          const on = order >= 0;
          return <li key={role} data-on={on} data-order={on ? order : undefined} data-current={on && order === current} aria-hidden={!on}>
            <span className="cs-t-small">{role}</span>
          </li>;
        })}
      </ol>
      <span className="cs-svc-brand-film-playhead" aria-hidden="true" />
    </div>
    <p className="cs-t-caption cs-svc-brand-film-timeline-note">장면 역할을 설명하는 구성 예시 · 실제 초 단위 배분은 기획안에서 정합니다</p>
  </div>;
}
