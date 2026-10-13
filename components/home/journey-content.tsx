"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  contentCopy,
  mediaShape,
  type ContentSelection,
  type JourneyMedia,
} from "@/lib/home-journey";
import { JourneyTabList, panelId, tabId } from "./journey-tabs";

const PREFIX = "wj-content";
const STAGE_SIZES = "(min-width: 1024px) 40vw, 92vw";

// Side previews are decoration: desktop width and motion allowed only.
function useSidePreview() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return enabled;
}

const stillOf = (media: JourneyMedia) =>
  media.kind === "video" ? (media.poster ?? null) : media.src;

function StageMedia({ media }: { media: JourneyMedia }) {
  return (
    <div className={`wj-stage-frame wj-shape-${mediaShape(media)}`}>
      {media.kind === "video" ? (
        <video
          className="wj-video"
          controls
          playsInline
          preload="none"
          poster={media.poster}
          width={media.width}
          height={media.height}
          aria-label={media.alt}
          src={media.src}
        />
      ) : (
        <Image
          className="wj-cover"
          src={media.src}
          alt={media.alt}
          fill
          sizes={STAGE_SIZES}
        />
      )}
    </div>
  );
}

function SidePreview({
  selection,
  side,
}: {
  selection: ContentSelection;
  side: "prev" | "next";
}) {
  const still = stillOf(selection.media);
  if (!still) return null;
  return (
    <div className={`wj-side wj-side--${side}`} aria-hidden="true">
      <Image className="wj-cover" src={still} alt="" fill sizes="200px" />
    </div>
  );
}

export function JourneyContent({
  selections,
}: {
  selections: ContentSelection[];
}) {
  const [selected, setSelected] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const sidePreview = useSidePreview();
  const count = selections.length;
  const select = (index: number) => {
    root.current?.querySelectorAll("video").forEach((video) => {
      if (!video.paused) video.pause();
    });
    setSelected((index + count) % count);
  };

  return (
    <div className="wj-content" ref={root}>
      <JourneyTabList
        prefix={PREFIX}
        label="컨텐츠 종류"
        items={selections.map(({ tab }) => ({ id: tab.id, label: tab.label }))}
        selected={selected}
        onSelect={select}
      />
      {selections.map((selection, index) => {
        const { tab, work, media, caption, tag } = selection;
        const active = index === selected;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId(PREFIX, tab.id)}
            aria-labelledby={tabId(PREFIX, tab.id)}
            hidden={!active}
            className="wj-tabpanel wj-content-panel"
          >
            <div className="wj-content-text">
              <h3 className="wj-item-title t-h3">{tab.label}</h3>
              <p className="wj-body t-body">{tab.line}</p>
              <ul className="wj-chips" aria-label={`${tab.label} 활용처`}>
                {tab.chips.map((chip) => (
                  <li key={chip} className="wj-chip t-chip">
                    {chip}
                  </li>
                ))}
              </ul>
              {(caption || tag) && (
                <p className="wj-media-meta">
                  {caption && (
                    <span className="wj-caption t-small">{caption}</span>
                  )}
                  {tag && <span className="wj-tag t-caption">{tag}</span>}
                </p>
              )}
              <div className="wj-links">
                <Link
                  className="wj-link t-button"
                  href={`/content/services/${tab.id}`}
                >
                  {contentCopy.serviceLink} <span aria-hidden="true">→</span>
                </Link>
                {work && (
                  <Link className="wj-link t-button" href={work.canonicalPath}>
                    {contentCopy.workLink} <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="wj-stage-column">
              <div className="wj-stage wj-media">
                {active && sidePreview && (
                  <>
                    <SidePreview
                      selection={selections[(index - 1 + count) % count]}
                      side="prev"
                    />
                    <SidePreview
                      selection={selections[(index + 1) % count]}
                      side="next"
                    />
                  </>
                )}
                <StageMedia media={media} />
              </div>
            </div>
          </div>
        );
      })}
      <div className="wj-stage-nav">
        <button
          type="button"
          className="wj-step-button t-chip"
          aria-label={contentCopy.prevLabel}
          aria-controls={panelId(
            PREFIX,
            selections[(selected - 1 + count) % count].tab.id,
          )}
          onClick={() => select(selected - 1)}
        >
          <span aria-hidden="true">←</span> {contentCopy.prev}
        </button>
        <button
          type="button"
          className="wj-step-button t-chip"
          aria-label={contentCopy.nextLabel}
          aria-controls={panelId(
            PREFIX,
            selections[(selected + 1) % count].tab.id,
          )}
          onClick={() => select(selected + 1)}
        >
          {contentCopy.next} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
