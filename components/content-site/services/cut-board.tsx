"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CsCutBoard } from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

/** Sample clips are always muted; pending samples show the source frame only. */
export function CutBoard({ board }: { board: CsCutBoard }) {
  const [variant, setVariant] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const requested = useRef<number | null>(null);
  const sample = board.sample[variant];
  const cuts = sample.cuts ?? board.cuts;
  const hasSoundColumn = cuts.some(cut => cut.sound);
  useEffect(() => { setActive(null); requested.current = null; }, [variant]);
  const seek = (time: number) => {
    const node = video.current;
    requested.current = time;
    if (!node) return;
    node.muted = true;
    if (node.readyState >= 1) { node.currentTime = time; requested.current = null; }
    node.play().catch(() => {});
  };
  return <section className="cs-section cs-cut-board" data-cs-section="signature" aria-labelledby={`${board.id}-title`}>
    <div className="cs-container">
      <CsSectionHead id={`${board.id}-title`} eyebrow={board.eyebrow} title={board.title} lead={board.lead} align="center" />
      <div className="cs-cut-layout">
        <div className="cs-cut-player">
          {board.sample.length > 1 && <div className="cs-cut-tabs" role="group" aria-label="샘플 화면비 선택">{board.sample.map((item, i) => <button key={item.label} className="cs-btn" type="button" aria-pressed={variant === i} onClick={() => { video.current?.pause(); setVariant(i); }}>{item.label}</button>)}</div>}
          <figure className="cs-cut-screen" data-aspect={sample.aspect}>
            {sample.src ? <video key={sample.src} ref={video} src={sample.src} poster={sample.poster} muted controls playsInline preload="none" aria-label={sample.label} onLoadedMetadata={() => { if (requested.current !== null && video.current) { video.current.currentTime = requested.current; requested.current = null; } }} onVolumeChange={() => { if (video.current) video.current.muted = true; }} /> : <Image src={sample.poster} alt={sample.label} width={1280} height={720} sizes="(min-width:1024px) 45vw, 90vw" />}
            <figcaption className="cs-t-caption">{board.tag}</figcaption>
          </figure>
          <p className="cs-t-small">{board.note}</p>
        </div>
        <div>
          {sample.src && <p className="cs-t-small cs-cut-help">컷을 누르면 영상이 그 장면부터 재생됩니다</p>}
          {board.chapters && <ol className="cs-cut-chapters" aria-label="영상 장 구성">{board.chapters.map(chapter => <li key={chapter.name} ref={node => { node?.style.setProperty("--chapter-length", String(chapter.to - chapter.from)); }}><span className="cs-t-caption">{chapter.name}</span></li>)}</ol>}
          <div className="cs-cut-table-head cs-t-label" aria-hidden="true" data-sound={hasSoundColumn}><span>컷</span><span>시간</span><span>화면</span><span>자막</span>{hasSoundColumn && <span>소리</span>}<span>의도</span></div>
          <ol className="cs-cut-list">{cuts.map((cut, index) => <li key={cut.no}>
            <button type="button" className="cs-cut-row" data-active={active === index} data-sound={hasSoundColumn} aria-pressed={active === index} aria-label={`${cut.no}, ${cut.from}초부터 ${cut.to}초`} onClick={() => { setActive(index); seek(cut.from); }}>
              <span className="cs-cut-name cs-t-label">{cut.thumb && <Image src={cut.thumb} alt="" width={120} height={68} sizes="80px" />}{cut.no}</span>
              <span className="cs-t-caption">{cut.from}–{cut.to}초</span><span className="cs-t-small">{cut.scene}</span><span className="cs-t-small">{cut.copy}</span>{hasSoundColumn && <span className="cs-t-small">{cut.sound}</span>}<span className="cs-t-small">{cut.intent}</span>
            </button>
          </li>)}</ol>
        </div>
      </div>
    </div>
  </section>;
}
