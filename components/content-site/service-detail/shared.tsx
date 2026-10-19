"use client";
/* eslint-disable @next/next/no-img-element -- The verified WebP derivatives are displayed without another transform, including full-resolution document dialogs. */

import { useEffect, useId, useRef, type ReactNode } from "react";
import { startingPrice } from "@/lib/content-pricing";
import type { ContentServiceId } from "@/lib/content-site/types";

function Lines({ children }: { children: ReactNode }) {
  return typeof children === "string"
    ? children.split(/\\n|\n/).map((line, i) => <span key={i}>{line}</span>)
    : children;
}

export function DetailHero({ eyebrow, title, description, variant = "default", children, label, caseHref = "#case", primaryLabel = "실제 제작 사례 보기", inquiryCase }: {
  eyebrow: string; title: ReactNode; description: ReactNode; variant?: string;
  children: ReactNode; label?: ReactNode; caseHref?: string; primaryLabel?: string; inquiryCase?: { caseId: string; caseTitle: string };
}) {
  return (
    <section className={`sd-hero sd-hero--${variant}`} aria-labelledby="sd-title">
      <div className="sd-hero-inner">
        <div className="sd-hero-copy">
          <p className="sd-eyebrow">{eyebrow}</p>
          <h1 id="sd-title"><Lines>{title}</Lines></h1>
          <p className="sd-hero-description">{description}</p>
          <div className="sd-actions">
            <a className="sd-button" href={caseHref}>{primaryLabel}<span aria-hidden="true">↓</span></a>
            <a className="sd-text-link" href="#inquiry" data-case={inquiryCase?.caseId} data-case-title={inquiryCase?.caseTitle} data-entry={inquiryCase ? "hero" : undefined}>제작 상담<span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="sd-hero-art">{children}{label ? <p className="sd-hero-label">{label}</p> : null}</div>
      </div>
      <a className="sd-hero-next" href="#service-overview">제작할 수 있는 일 살펴보기 <span aria-hidden="true">↓</span></a>
    </section>
  );
}

export function DetailSection({ id, eyebrow, title, lead, children, className = "" }: {
  id?: string; eyebrow?: string; title: ReactNode; lead?: ReactNode; children: ReactNode; className?: string;
}) {
  const uid = useId();
  return <section id={id} className={`sd-section ${className}`} aria-labelledby={uid}>
    <div className="sd-container">
      <header className="sd-section-head">{eyebrow ? <p className="sd-eyebrow">{eyebrow}</p> : null}
        <h2 id={uid}><Lines>{title}</Lines></h2>{lead ? <p className="sd-lead">{lead}</p> : null}
      </header>{children}
    </div>
  </section>;
}

export function DetailImage({ src, alt, caption, className = "", eager = false, zoom = true }: {
  src: string; alt: string; caption?: ReactNode; className?: string; eager?: boolean; zoom?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const id = useId();
  const close = () => dialog.current?.close();
  const restore = () => { document.body.style.overflow = previousOverflow.current; opener.current?.focus({ preventScroll: true }); };
  useEffect(() => () => { if (dialog.current?.open) document.body.style.overflow = previousOverflow.current; }, []);
  const art = <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />;
  return <figure className={`sd-image ${className}`}>
    {zoom ? <button className="sd-image-open" ref={opener} type="button" aria-label={`${alt} 확대`} aria-haspopup="dialog" onClick={() => {
      previousOverflow.current = document.body.style.overflow; dialog.current?.showModal(); document.body.style.overflow = "hidden";
    }}>{art}<span className="sd-image-expand" aria-hidden="true">확대 ↗</span></button> : art}
    {caption ? <figcaption>{caption}</figcaption> : null}
    {zoom ? <dialog ref={dialog} className="sd-image-dialog" aria-labelledby={id} onClose={restore} onClick={(e) => { if (e.target === dialog.current) close(); }}>
      <div className="sd-dialog-top"><p id={id}>{alt}</p><button type="button" onClick={close} aria-label="제작 자료 확대 닫기" autoFocus>닫기 ×</button></div>
      <div className="sd-image-zoom"><img src={src} alt={alt} /></div>
    </dialog> : null}
  </figure>;
}

export function DetailVideo({ src, poster, label, portrait = false, className = "", startAt }: {
  src: string; poster: string; label: ReactNode; portrait?: boolean; className?: string; startAt?: number;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const uid = useId();
  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const stop = () => { if (document.hidden) node.pause(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) node.pause(); }, { threshold: 0.1 });
    observer.observe(node); document.addEventListener("visibilitychange", stop);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", stop); node.pause(); };
  }, []);
  useEffect(() => {
    const node = video.current;
    if (!node || startAt === undefined || !Number.isFinite(startAt)) return;
    const seek = () => { node.currentTime = Math.min(Math.max(0, startAt), Number.isFinite(node.duration) ? Math.max(0, node.duration - 0.05) : startAt); node.pause(); };
    if (node.readyState >= 1) seek(); else node.addEventListener("loadedmetadata", seek, { once: true });
    return () => node.removeEventListener("loadedmetadata", seek);
  }, [startAt, src]);
  return <figure className={`sd-video ${portrait ? "sd-video--portrait" : ""} ${className}`}>
    <video ref={video} controls playsInline muted preload="metadata" poster={poster} aria-describedby={uid} onPlay={(event) => {
      document.querySelectorAll<HTMLVideoElement>("video").forEach((other) => { if (other !== event.currentTarget) other.pause(); });
    }}><source src={src} type="video/mp4" />영상을 재생할 수 없습니다</video>
    <figcaption id={uid}>{label}</figcaption>
  </figure>;
}

export function CaseCta({ caseId, caseTitle, children, plan, material, entryPoint = "case" }: {
  caseId: string; caseTitle: string; children: ReactNode; plan?: string; material?: string; entryPoint?: string;
}) {
  return <a className="sd-text-link sd-case-cta" href="#inquiry" data-case={caseId} data-case-title={caseTitle} data-plan={plan} data-material={material} data-entry={entryPoint}>{children}<span aria-hidden="true">↗</span></a>;
}

export function ServiceOverview({ service, items }: { service: ContentServiceId; items: string[] }) {
  const price = startingPrice(service);
  return <section className="sd-overview" id="service-overview" aria-label="제작 범위와 시작 가격">
    <div className="sd-container"><ul>{items.map((item, i) => <li key={item}><span aria-hidden="true">0{i + 1}</span><p>{item}</p></li>)}</ul>
      {price ? <p className="sd-starting-price">{price.line}<a href="#pricing">구성과 가격 보기 ↓</a></p> : null}
    </div>
  </section>;
}
