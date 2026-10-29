"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contentLinkProps } from "@/lib/new-tab";
import { NewTabHint } from "@/components/new-tab-hint";
import { homeCardMedia, contentHomeServices } from "@/lib/content-home";
import type { ContentServiceId } from "@/lib/content-site/types";
import { HomeArtwork } from "./home-artwork";

export function HomeCasePreview({ id, onClose }: { id: ContentServiceId | null; onClose: () => void }) {
  const path = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => {
    if (!id || !ref.current) return;
    const dialog = ref.current;
    const trigger = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const stop = () => { if (document.hidden) dialog.querySelectorAll("video").forEach(video => video.pause()); };
    document.addEventListener("visibilitychange", stop);
    return () => {
      document.removeEventListener("visibilitychange", stop);
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
      {media.video ? <><video key={media.video} src={media.video} poster={media.poster} controls playsInline muted preload="metadata" aria-label={media.alt} onError={() => setFailed(media.video!)} />{failed === media.video ? <div role="status"><p>영상을 불러오지 못했어요{"\n"}작품 설명과 제작 분야를 확인할 수 있습니다</p><button type="button" className="cs-btn" onClick={() => { setFailed(null); ref.current?.querySelector("video")?.load(); }}>다시 시도</button></div> : null}</> : <div className="ch-case-images"><HomeArtwork id={id} /></div>}
      <p className="cs-t-small">{media.caseNote}</p>
      {service ? <Link className="cs-link" href={service.href} {...contentLinkProps(service.href, path)}>{service.label} 서비스 보기 →{contentLinkProps(service.href, path).target && <NewTabHint/>}</Link> : null}
    </div> : null}
  </dialog>;
}
