"use client";

import Image from "next/image";
import {
  useId,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";
import { devCopy } from "@/lib/home-journey";
import {
  SegmentControl,
  deviceItems,
  viewItems,
  type CompareModel,
  type Device,
  type OpenState,
  type View,
} from "./journey-dev-compare";
import "./journey-dev.css";

// Detail dialog for the development step (R7): native <dialog> so the rest of
// the page is inert, ESC closes it, and focus goes back to the opener.
// 1024px and up: picture left, text right. 768-1023: stacked. Under 768: a
// full-screen sheet with a sticky close bar.

export type ModalState = OpenState & { id: number };

export type DetailContent = {
  title: string;
  tag: string | null;
  description: string;
  sections: { label: string; text: string }[];
  steps: string[];
};

const FOCUSABLE =
  'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

function DetailBody({
  model,
  content,
  initial,
  titleId,
}: {
  model: CompareModel;
  content: DetailContent;
  initial: OpenState;
  titleId: string;
}) {
  const [view, setView] = useState<View>(initial.view);
  const [device, setDevice] = useState<Device>(
    model.mobile ? initial.device : "pc",
  );
  const hasBefore = model.pc.before !== null;
  const pair = device === "mobile" && model.mobile ? model.mobile : model.pc;
  const media = view === "before" && pair.before ? pair.before : pair.after;

  return (
    <div className="wj-detail-body">
      <div className="wj-detail-media">
        {(hasBefore || model.mobile) && (
          <div className="wj-detail-controls">
            {hasBefore && (
              <SegmentControl
                label={devCopy.viewLabel}
                items={viewItems}
                value={view}
                onChange={setView}
              />
            )}
            {model.mobile && (
              <SegmentControl
                label={devCopy.deviceLabel}
                items={deviceItems}
                value={device}
                onChange={setDevice}
              />
            )}
          </div>
        )}
        <Image
          key={media.src}
          className={`wj-detail-image wj-detail-image--${device}`}
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes="(min-width: 1024px) 640px, 94vw"
        />
      </div>
      <div className="wj-detail-text">
        <div className="wj-detail-titlebar">
          <h2 id={titleId} className="wj-item-title t-h3">
            {content.title}
          </h2>
          {content.tag && (
            <span className="wj-tag t-caption">{content.tag}</span>
          )}
        </div>
        <p className="wj-body t-body">{content.description}</p>
        {content.sections.map((section) => (
          <section key={section.label} className="wj-detail-section">
            <h3 className="wj-detail-label eyebrow-ko">{section.label}</h3>
            <p className="wj-body t-body">{section.text}</p>
          </section>
        ))}
        {content.steps.length > 0 && (
          <section className="wj-detail-section">
            <h3 className="wj-detail-label eyebrow-ko">{devCopy.stepsLabel}</h3>
            <ol className="wj-flow-list">
              {content.steps.map((label, index) => (
                <li key={label}>
                  <span className="wj-num eyebrow">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="wj-body t-body">{label}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}

export function DetailDialog({
  dialogRef,
  model,
  content,
  state,
  onClosed,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  model: CompareModel;
  content: DetailContent;
  state: ModalState | null;
  onClosed: () => void;
}) {
  const titleId = useId();
  const close = () => dialogRef.current?.close();

  // Native modal dialogs let Tab leave for the browser UI; keep it inside.
  const trapTab = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((item) => item.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;
    if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="wj-detail"
      aria-labelledby={titleId}
      onClose={onClosed}
      onKeyDown={trapTab}
      onClick={(event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="wj-detail-bar">
        <button
          type="button"
          className="wj-detail-close t-chip"
          aria-label={`${devCopy.dialogSuffix} ${devCopy.close}`}
          onClick={close}
        >
          {devCopy.close}
        </button>
      </div>
      {state && (
        <DetailBody
          key={state.id}
          model={model}
          content={content}
          initial={state}
          titleId={titleId}
        />
      )}
    </dialog>
  );
}
