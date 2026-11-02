"use client";
/* eslint-disable @next/next/no-img-element -- The reader opens the exact verified page asset at full reading size. */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export type WebtoonViewerSelection =
  | { kind: "pages"; page: number; trigger: HTMLElement }
  | { kind: "image"; src: string; alt: string; trigger: HTMLElement };

const PAGE_COUNT = 25;
const pageSrc = (page: number) => `/service-detail-v14/webtoon-${String(page).padStart(2, "0")}.webp`;

/** The original 25-image order is preserved; source pages are never re-cut into product cuts. */
export function WebtoonDetailReader({ selection, onClose }: {
  selection: WebtoonViewerSelection | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const isPages = selection?.kind === "pages";

  useEffect(() => {
    if (!selection) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = selection.trigger;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    setPage(selection.kind === "pages" ? Math.max(1, Math.min(PAGE_COUNT, selection.page)) : 1);
    setZoomed(false);
    document.querySelectorAll<HTMLVideoElement>("video").forEach((video) => video.pause());
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [selection]);

  useEffect(() => {
    stageRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [page, selection, zoomed]);

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (!isPages || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;
    if (target.tagName === "SELECT" || target.tagName === "INPUT") return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPage((current) => Math.max(1, current - 1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPage((current) => Math.min(PAGE_COUNT, current + 1));
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="wt-reader-dialog"
      aria-labelledby="wt-reader-title"
      aria-describedby="wt-reader-hint"
      onKeyDown={handleKeys}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClose={() => { if (selection) onClose(); }}
    >
      <div className="wt-reader-top">
        <div>
          <strong id="wt-reader-title">{isPages ? "《1억의 구단주》 1화 · 새 게임" : "제작 자료 크게 보기"}</strong>
          <span aria-live="polite">{isPages ? `${String(page).padStart(2, "0")} / ${PAGE_COUNT}` : selection?.kind === "image" ? selection.alt : ""}</span>
        </div>
        <button ref={closeRef} type="button" className="wt-reader-close" aria-label="웹툰·제작 자료 닫기" onClick={onClose}>닫기 <span aria-hidden="true">×</span></button>
      </div>
      <div ref={stageRef} className={`wt-reader-stage${zoomed ? " is-zoomed" : ""}`} tabIndex={0} aria-label="이미지 읽기 영역">
        {selection && <img
          src={isPages ? pageSrc(page) : selection.kind === "image" ? selection.src : ""}
          alt={isPages ? `《1억의 구단주》 1화 ${page}번째 완성 이미지` : selection.kind === "image" ? selection.alt : ""}
          decoding="async"
        />}
      </div>
      <div className="wt-reader-controls">
        {isPages && <>
          <button type="button" aria-label="이전 완성 이미지" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>←</button>
          <label>페이지 <select aria-label="읽을 완성 이미지 선택" value={page} onChange={(event) => setPage(Number(event.target.value))}>
            {Array.from({ length: PAGE_COUNT }, (_, index) => <option key={index + 1} value={index + 1}>{String(index + 1).padStart(2, "0")} / {PAGE_COUNT}</option>)}
          </select></label>
        </>}
        <button type="button" className="wt-reader-zoom" aria-pressed={zoomed} onClick={() => setZoomed((current) => !current)}>{zoomed ? "화면에 맞추기" : "글자 확대"}</button>
        {isPages && <button type="button" aria-label="다음 완성 이미지" disabled={page === PAGE_COUNT} onClick={() => setPage((current) => Math.min(PAGE_COUNT, current + 1))}>→</button>}
      </div>
      <p id="wt-reader-hint" className="wt-reader-hint">{isPages ? "← → 키로 페이지 이동 · " : ""}확대 후 좌우로 이동해서 읽기 · Esc 닫기</p>
    </dialog>
  );
}
