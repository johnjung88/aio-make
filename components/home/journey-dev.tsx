"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type MouseEvent } from "react";
import {
  devCopy,
  devFallbackSteps,
  devFallbackTabs,
  type DevProject,
  type JourneyMedia,
} from "@/lib/home-journey";
import { JourneyTabList, panelId, tabId } from "./journey-tabs";

const PREFIX = "wj-dev";
const FRAME_SIZES = "(min-width: 1024px) 36vw, 92vw";
const PHONE_SIZES = "(min-width: 1024px) 9vw, 28vw";

type Open = (media: JourneyMedia, button: HTMLButtonElement) => void;

function BrowserBar() {
  return (
    <span className="wj-browser-bar" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function ZoomFrame({
  pc,
  mobile,
  label,
  caption,
  onOpen,
}: {
  pc: JourneyMedia;
  mobile: JourneyMedia | null;
  label: string;
  caption: string;
  onOpen: Open;
}) {
  return (
    <figure className="wj-figure">
      <button
        type="button"
        className="wj-frame-button"
        aria-label={label}
        aria-haspopup="dialog"
        onClick={(event: MouseEvent<HTMLButtonElement>) =>
          onOpen(pc, event.currentTarget)
        }
      >
        <span className="wj-browser">
          <BrowserBar />
          <span className="wj-browser-view">
            <Image
              className="wj-cover-top"
              src={pc.src}
              alt={pc.alt}
              fill
              sizes={FRAME_SIZES}
            />
            {mobile && (
              <span className="wj-phone">
                <Image
                  className="wj-cover-top"
                  src={mobile.src}
                  alt={mobile.alt}
                  fill
                  sizes={PHONE_SIZES}
                />
              </span>
            )}
          </span>
        </span>
      </button>
      <figcaption className="wj-caption t-small">{caption}</figcaption>
    </figure>
  );
}

function HoldFrame() {
  return (
    <figure className="wj-figure">
      <div className="wj-browser wj-hold" data-hold="before">
        <BrowserBar />
        <span className="wj-browser-view wj-hold-view">
          <span className="wj-caption t-small">{devCopy.beforeHold}</span>
        </span>
      </div>
    </figure>
  );
}

function ProjectPanel({
  project,
  hidden,
  onOpen,
}: {
  project: DevProject;
  hidden: boolean;
  onOpen: Open;
}) {
  const { config, work, before, after, afterMobile } = project;
  return (
    <div
      role="tabpanel"
      id={panelId(PREFIX, config.slug)}
      aria-labelledby={tabId(PREFIX, config.slug)}
      hidden={hidden}
      className="wj-tabpanel"
    >
      <div className="wj-panel-head">
        <h3 className="wj-item-title t-h3">{work.title}</h3>
        <span className="wj-tag t-caption">{work.productionStatus}</span>
      </div>
      <div className="wj-compare wj-media">
        {before ? (
          <ZoomFrame
            pc={before.pc}
            mobile={before.mobile}
            label={devCopy.beforeLabel}
            caption={before.caption}
            onOpen={onOpen}
          />
        ) : (
          <HoldFrame />
        )}
        <ZoomFrame
          pc={after}
          mobile={afterMobile}
          label={devCopy.afterLabel}
          caption={devCopy.afterCaption}
          onOpen={onOpen}
        />
      </div>
      <p className="wj-body t-body">{work.purpose}</p>
      <div className="wj-links">
        <Link className="wj-link t-button" href={work.canonicalPath}>
          {devCopy.workLink} <span aria-hidden="true">↗</span>
        </Link>
        <Link className="wj-link t-button" href={config.serviceHref}>
          {devCopy.serviceLink} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function SamplePanel({
  tab,
  hidden,
}: {
  tab: (typeof devFallbackTabs)[number];
  hidden: boolean;
}) {
  return (
    <div
      role="tabpanel"
      id={panelId(PREFIX, tab.id)}
      aria-labelledby={tabId(PREFIX, tab.id)}
      hidden={hidden}
      className="wj-tabpanel"
    >
      <div className="wj-panel-head">
        <h3 className="wj-item-title t-h3">{tab.label}</h3>
        <span className="wj-tag t-caption">{tab.tag}</span>
      </div>
      <div className="wj-dev-sample">
        <figure className="wj-figure wj-media">
          <span className="wj-browser">
            <BrowserBar />
            <span className="wj-browser-view">
              <Image
                className="wj-cover-top"
                src={tab.media.src}
                alt={tab.media.alt}
                fill
                sizes={FRAME_SIZES}
              />
            </span>
          </span>
        </figure>
        <ol className="wj-flow-list">
          {devFallbackSteps.map((label, index) => (
            <li key={label}>
              <span className="wj-num eyebrow">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="wj-body t-body">{label}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="wj-links">
        <Link className="wj-link t-button" href={tab.href}>
          {devCopy.serviceLink} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

export function JourneyDev({ projects }: { projects: DevProject[] }) {
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState<JourneyMedia | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const open: Open = (media, button) => {
    opener.current = button;
    setZoom(media);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const tabs = projects.length
    ? projects.map((project) => ({
        id: project.config.slug,
        label: project.config.label,
      }))
    : devFallbackTabs.map((tab) => ({ id: tab.id, label: tab.label }));
  const current = Math.min(selected, tabs.length - 1);

  return (
    <div className="wj-dev">
      <JourneyTabList
        prefix={PREFIX}
        label={projects.length ? "개발 프로젝트" : "개발 서비스"}
        items={tabs}
        selected={current}
        onSelect={setSelected}
      />
      {projects.length
        ? projects.map((project, index) => (
            <ProjectPanel
              key={project.config.slug}
              project={project}
              hidden={index !== current}
              onOpen={open}
            />
          ))
        : devFallbackTabs.map((tab, index) => (
            <SamplePanel key={tab.id} tab={tab} hidden={index !== current} />
          ))}
      {projects.length > 0 && (
        <dialog
          ref={dialog}
          className="wj-dialog"
          aria-label={zoom ? `${zoom.alt} 크게 보기` : "화면 크게 보기"}
          onClose={() => opener.current?.focus()}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="wj-dialog-bar">
            <button
              type="button"
              className="wj-dialog-close t-chip"
              aria-label="확대 화면 닫기"
              onClick={close}
            >
              닫기
            </button>
          </div>
          {zoom && (
            <Image
              key={zoom.src}
              className="wj-dialog-image"
              src={zoom.src}
              alt={zoom.alt}
              width={zoom.width}
              height={zoom.height}
              sizes="92vw"
            />
          )}
        </dialog>
      )}
    </div>
  );
}
