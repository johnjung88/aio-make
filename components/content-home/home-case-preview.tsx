"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { homeCardMedia, contentHomeServices } from "@/lib/content-home";
import type { ContentServiceId } from "@/lib/content-site/types";
import { HomeArtwork } from "./home-artwork";

export function HomeCasePreview({ id, onClose }: { id: ContentServiceId | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!id || !ref.current) return;
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.querySelectorAll("video").forEach(video => video.pause());
      if (dialog.open) dialog.close();
      document.body.style.overflow = oldOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, [id]);
  const media = id ? homeCardMedia[id] : null;
  const service = contentHomeServices.find(s => s.id === id);
  return <dialog ref={ref} className="ch-case-dialog" onClose={onClose} aria-labelledby="home-case-title">
    <div className="ch-case-bar"><h2 className="cs-t-h3" id="home-case-title">{media?.caseLabel ?? "제작 작품"}</h2><button className="cs-btn cs-btn--ghost" type="button" onClick={onClose} aria-label="작품 보기 닫기">닫기 ×</button></div>
    {media && id ? <div className="ch-case-body">
      {media.video ? <video src={media.video} poster={media.poster} controls playsInline preload="metadata" aria-label={media.alt} /> : <div className="ch-case-images"><HomeArtwork id={id} /></div>}
      <p className="cs-t-small">{media.caseNote}</p>
      {service ? <Link className="cs-link" href={service.href}>{service.label} 서비스 보기 →</Link> : null}
    </div> : null}
  </dialog>;
}
