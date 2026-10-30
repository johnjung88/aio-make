"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { devCopy, type JourneyMedia } from "@/lib/home-journey";

// Before/after comparison for the development step (R7).
// 768px and up: a slider (both pictures in one frame, a handle between them).
// Under 768px: a BEFORE | AFTER switch (one picture, crossfade, no drag).
// Both are driven by the same markup; CSS decides which one is visible.

export type View = "before" | "after";
export type Device = "pc" | "mobile";
export type OpenState = { view: View; device: Device };

export type CompareModel = {
  pc: { before: JourneyMedia | null; after: JourneyMedia };
  mobile: { before: JourneyMedia; after: JourneyMedia } | null;
};

// The PC stage is about 1,060px wide at 1440, so ask for that, not 880px (PC1 17:5x: soft at 1.2x)
const PC_SIZES = "(min-width: 1440px) 1100px, (min-width: 1024px) 76vw, 94vw";
const MOBILE_SIZES = "(min-width: 768px) 320px, 70vw";
const TAP_SLOP = 6;

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function SegmentControl<T extends string>({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string;
  items: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      className={className ? `wj-seg ${className}` : "wj-seg"}
      role="group"
      aria-label={label}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className="wj-seg-button t-chip"
          aria-pressed={value === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export const viewItems: { value: View; label: string }[] = [
  { value: "before", label: devCopy.before },
  { value: "after", label: devCopy.after },
];

export const deviceItems: { value: Device; label: string }[] = [
  { value: "pc", label: devCopy.devicePc },
  { value: "mobile", label: devCopy.deviceMobile },
];

function Stage({
  pair,
  before,
  after,
  view,
  pos,
  onView,
  onPos,
  onDragging,
  onUse,
  onOpen,
}: {
  pair: Device;
  before: JourneyMedia | null;
  after: JourneyMedia;
  view: View;
  pos: number;
  onView: (view: View) => void;
  onPos: (pos: number) => void;
  onDragging: (dragging: boolean) => void;
  onUse: () => void;
  onOpen: (button: HTMLButtonElement) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ id: number; x: number; moved: boolean } | null>(null);
  const sizes = pair === "pc" ? PC_SIZES : MOBILE_SIZES;

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button")) return;
    drag.current = { id: event.pointerId, x: event.clientX, moved: false };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Capture is a nicety; dragging still works inside the frame.
    }
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== event.pointerId || !before) return;
    if (!current.moved && Math.abs(event.clientX - current.x) < TAP_SLOP) return;
    if (!current.moved) {
      current.moved = true;
      onUse();
      onDragging(true);
    }
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width > 0)
      onPos(clamp(((event.clientX - rect.left) / rect.width) * 100));
  };
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    drag.current = null;
    onDragging(false);
    if (!current || current.id !== event.pointerId) return;
    const onHandle = (event.target as HTMLElement).closest('[role="slider"]');
    if (event.type === "pointerup" && !current.moved && !onHandle)
      if (openButton.current) onOpen(openButton.current);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 20 : 5;
    const next =
      event.key === "ArrowLeft"
        ? pos - step
        : event.key === "ArrowRight"
          ? pos + step
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? 100
              : null;
    if (next === null) return;
    event.preventDefault();
    onUse();
    onPos(clamp(next));
  };

  return (
    <div className={`wj-cmp-unit wj-cmp-unit--${pair}`}>
      {before && (
        <SegmentControl
          className="wj-cmp-seg"
          label={devCopy.viewLabel}
          items={viewItems}
          value={view}
          onChange={(next) => {
            onUse();
            onView(next);
          }}
        />
      )}
      <div
        ref={stage}
        className={before ? "wj-cmp-stage wj-cmp-stage--split" : "wj-cmp-stage"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finish}
        onPointerCancel={finish}
      >
        {before && (
          <div className="wj-cmp-layer wj-cmp-layer--before">
            <Image
              className="wj-cmp-image"
              src={before.src}
              alt={before.alt}
              fill
              sizes={sizes}
            />
          </div>
        )}
        <div className="wj-cmp-layer wj-cmp-layer--after">
          <Image
            className="wj-cmp-image"
            src={after.src}
            alt={after.alt}
            fill
            sizes={sizes}
          />
        </div>
        {before && (
          <>
            <span
              className="wj-cmp-chip wj-cmp-chip--before"
              aria-hidden="true"
            >
              {devCopy.before}
            </span>
            <span className="wj-cmp-chip wj-cmp-chip--after" aria-hidden="true">
              {devCopy.after}
            </span>
            <div
              className="wj-cmp-handle"
              role="slider"
              tabIndex={0}
              aria-label={devCopy.sliderLabel}
              aria-orientation="horizontal"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${devCopy.beforeValue} ${Math.round(pos)}% · ${devCopy.afterValue} ${Math.round(100 - pos)}%`}
              onKeyDown={onKeyDown}
            />
          </>
        )}
        <button
          type="button"
          className="wj-cmp-hit"
          tabIndex={-1}
          aria-hidden="true"
          onClick={(event) => onOpen(event.currentTarget)}
        />
        <button
          ref={openButton}
          type="button"
          className="wj-cmp-open t-chip"
          aria-haspopup="dialog"
          onClick={(event) => onOpen(event.currentTarget)}
        >
          {devCopy.open}
        </button>
      </div>
    </div>
  );
}

export function CompareBlock({
  model,
  onOpen,
}: {
  model: CompareModel;
  onOpen: (state: OpenState, button: HTMLButtonElement) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [view, setView] = useState<View>("after");
  const [device, setDevice] = useState<Device | null>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const hasBefore = model.pc.before !== null;

  const stopIntro = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  // The picture pair follows the viewport until the visitor picks one.
  useEffect(() => {
    if (!model.mobile) return;
    setDevice(window.matchMedia("(min-width: 768px)").matches ? "pc" : "mobile");
  }, [model.mobile]);

  useEffect(() => {
    root.current?.style.setProperty("--wj-cmp-pos", String(pos));
  }, [pos]);

  // One-time hint when the comparison scrolls into view: a short slider sweep
  // (768 and up) or a BEFORE flash then AFTER (under 768). Skipped for reduced motion.
  useEffect(() => {
    const element = root.current;
    if (!element || !hasBefore || typeof IntersectionObserver === "undefined")
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const later = (run: () => void, ms: number) =>
      timers.current.push(window.setTimeout(run, ms));
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        if (window.matchMedia("(min-width: 768px)").matches) {
          later(() => setPos(35), 300);
          later(() => setPos(65), 900);
          later(() => setPos(50), 1500);
        } else {
          setView("before");
          later(() => setView("after"), 1200);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [hasBefore]);

  const open = (button: HTMLButtonElement) => {
    stopIntro();
    onOpen({ view, device: device ?? "pc" }, button);
  };

  return (
    <div
      ref={root}
      className="wj-cmp wj-media"
      role="group"
      aria-label={devCopy.compareLabel}
      data-view={view}
      data-device={model.mobile ? (device ?? "auto") : "pc"}
      data-dragging={dragging ? "true" : undefined}
    >
      <Stage
        pair="pc"
        before={model.pc.before}
        after={model.pc.after}
        view={view}
        pos={pos}
        onView={setView}
        onPos={setPos}
        onDragging={setDragging}
        onUse={stopIntro}
        onOpen={open}
      />
      {model.mobile && (
        <Stage
          pair="mobile"
          before={model.mobile.before}
          after={model.mobile.after}
          view={view}
          pos={pos}
          onView={setView}
          onPos={setPos}
          onDragging={setDragging}
          onUse={stopIntro}
          onOpen={open}
        />
      )}
      {model.mobile && (
        <div className="wj-cmp-foot">
          {model.mobile && (
            <SegmentControl
              className="wj-cmp-device"
              label={devCopy.deviceLabel}
              items={deviceItems}
              value={device ?? "pc"}
              onChange={(next) => {
                stopIntro();
                setDevice(next);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
