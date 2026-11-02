"use client";

import { useEffect, useId, useRef } from "react";
import { DetailVideo } from "./shared";

export type FilmPreviewSelection = {
  src: string;
  poster: string;
  title: string;
  label: string;
  caseId: string;
  startAt?: number;
  portrait?: boolean;
  trigger: HTMLElement;
};

/** A route-local native dialog; keyboard dismissal is handled by the dialog itself. */
export function FilmPreview({ selection, onClose }: {
  selection: FilmPreviewSelection | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const title = useId();
  useEffect(() => {
    const node = dialog.current;
    if (!selection || !node) return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => video.pause());
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    node.showModal();
    close.current?.focus({ preventScroll: true });
    return () => {
      node.querySelectorAll<HTMLVideoElement>("video").forEach((video) => video.pause());
      if (node.open) node.close();
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      if (selection.trigger.isConnected) selection.trigger.focus({ preventScroll: true });
    };
  }, [selection]);
  return <dialog ref={dialog} className="fd-preview-dialog" aria-labelledby={title}
    onCancel={(event) => { event.preventDefault(); onClose(); }}
    onClose={() => { if (selection) onClose(); }}
    onClick={(event) => {
      if (event.target !== dialog.current) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
    {selection ? <>
      <div className="fd-preview-top"><h2 id={title}>{selection.title}</h2><button ref={close} type="button" onClick={onClose} aria-label="큰 영상 닫기">닫기 ×</button></div>
      <div className="fd-preview-body"><DetailVideo src={selection.src} poster={selection.poster} label={selection.label} portrait={selection.portrait} startAt={selection.startAt} />
        <a className="sd-text-link sd-case-cta" href="#inquiry" data-case={selection.caseId} data-case-title={selection.title} data-entry="large-film-preview" onClick={onClose}>이 영상으로 제작 상담 <span aria-hidden="true">↗</span></a>
      </div>
    </> : null}
  </dialog>;
}
