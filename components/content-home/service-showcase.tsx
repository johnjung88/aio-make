"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { contentHomeServices as services, contentHomeServicesHead as head, pad2 } from "@/lib/content-home";
import type { ContentSelection } from "@/lib/home-journey";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import { ServiceDetail } from "./service-detail";

/** Manual work-led gallery: controls stay inside the media card, never below it */
export function ServiceShowcase({ selections }: { selections: ContentSelection[] }) {
  const [current, setCurrent] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const active = services[current];
  const selection = selections[current];
  const media = selection.media;
  const select = (index: number, focus = false) => {
    root.current?.querySelectorAll("video").forEach(video => video.pause());
    const next = (index + services.length) % services.length;
    setCurrent(next);
    if (focus) buttons.current[next]?.focus();
  };
  return <section id="services" className="ch-services" data-cs-section="services" aria-labelledby="ch-services-title">
    <div className="cs-container">
      <CsSectionHead id="ch-services-title" eyebrow={head.eyebrow} title={head.title} lead={head.lead} />
      <div className="ch-gallery" ref={root}>
        <div className="ch-gallery-tabs" role="tablist" aria-label="컨텐츠 서비스 선택" onKeyDown={event => {
          let next: number | null = null;
          if(event.key === "ArrowRight") next = current + 1;
          if(event.key === "ArrowLeft") next = current - 1;
          if(event.key === "Home") next = 0;
          if(event.key === "End") next = services.length - 1;
          if(next !== null) { event.preventDefault(); select(next, true); }
        }}>
          {services.map((service, index) => <button type="button" role="tab" id={`ch-tab-${service.id}`} ref={node => { buttons.current[index] = node; }} key={service.id} aria-selected={index === current} aria-controls="ch-service-panel" tabIndex={index === current ? 0 : -1} className="ch-tab cs-t-chip" onClick={() => select(index)}>{service.label}</button>)}
        </div>
        <div className="ch-gallery-layout" role="tabpanel" id="ch-service-panel" aria-labelledby={`ch-tab-${active.id}`}>
          <div className="ch-work-card">
            <div className="ch-work-media" key={active.id}>
              {media.kind === "video" ? <video src={media.src} poster={media.poster} controls playsInline preload="none" aria-label={media.alt} /> : <Image src={media.src} alt={media.alt} fill sizes="(min-width:1024px) 55vw, 92vw" />}
            </div>
            <div className="ch-work-nav">
              <span className="cs-t-caption">{pad2(current + 1)} / {pad2(services.length)}</span>
              <div className="ch-arrows">
                <button type="button" className="ch-arrow" aria-label="이전 서비스" onClick={() => select(current - 1)}>←</button>
                <button type="button" className="ch-arrow" aria-label="다음 서비스" onClick={() => select(current + 1)}>→</button>
              </div>
            </div>
            <div className="ch-work-caption">
              <p className="cs-t-small">{selection.caption ?? active.label}</p>
              {selection.tag ? <span className="cs-tag cs-t-caption">{selection.tag}</span> : null}
              {selection.work ? <Link className="cs-link" href={`/content/projects/${selection.work.slug}?service=${active.id}`}>작업 자세히 보기 <span aria-hidden="true">↗</span></Link> : null}
            </div>
          </div>
          <ServiceDetail service={active} index={current} />
        </div>
        <p className="cs-sr-only" aria-live="polite">{`${current + 1} / ${services.length} ${active.label}`}</p>
      </div>
    </div>
  </section>;
}
