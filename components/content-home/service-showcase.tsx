"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  contentHomeServices as services,
  contentHomeServicesHead as head,
  pad2,
} from "@/lib/content-home";
import { ServiceDetail } from "./service-detail";

type Mode = "list" | "carousel";

const COUNT = services.length;
const SWIPE_MIN = 48;
const IMAGE_SIZES = "(max-width: 767px) 360px, 340px";
const PANEL_ID = "ch-service-panel";
const tabId = (id: string) => `ch-tab-${id}`;

/* 원형 거리: 6개 기준 -3..+3. ±3은 화면 밖(off). */
function position(index: number, current: number): string {
  let delta = index - current;
  if (delta > COUNT / 2) delta -= COUNT;
  if (delta < -COUNT / 2) delta += COUNT;
  return Math.abs(delta) > 2 ? "off" : String(delta);
}

export function ServiceShowcase() {
  // 서버 렌더와 첫 클라이언트 렌더는 항상 목록 모드다(JS 없이도 6개가 모두 보인다).
  const [mode, setMode] = useState<Mode>("list");
  const [reduced, setReduced] = useState(false);
  const [current, setCurrent] = useState(0);
  const userChose = useRef(false);
  const swipe = useRef<{ x: number; id: number } | null>(null);
  const suppressClick = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(query.matches);
      if (!userChose.current) setMode(query.matches ? "list" : "carousel");
    };
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const select = (index: number, focus = false) => {
    const next = (index + COUNT) % COUNT;
    setCurrent(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const toggle = () => {
    userChose.current = true;
    setMode((m) => (m === "list" ? "carousel" : "list"));
  };

  const onCarouselKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const onTab = (event.target as HTMLElement).getAttribute("role") === "tab";
    let next: number | null = null;
    if (event.key === "ArrowRight") next = current + 1;
    else if (event.key === "ArrowLeft") next = current - 1;
    else if (onTab && event.key === "Home") next = 0;
    else if (onTab && event.key === "End") next = COUNT - 1;
    if (next === null) return;
    event.preventDefault();
    select(next, onTab);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    swipe.current = { x: event.clientX, id: event.pointerId };
    suppressClick.current = false;
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) < SWIPE_MIN) return;
    suppressClick.current = true;
    select(current + (dx < 0 ? 1 : -1));
  };
  const onStageClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const active = services[current];

  return (
    <section
      id="services"
      className="ch-services"
      aria-labelledby="ch-services-title"
      data-mode={mode}
    >
      <header className="ch-container l-container ch-head ch-head--services">
        <div className="ch-head-copy">
          <p className="ch-eyebrow eyebrow">{head.eyebrow}</p>
          <h2 id="ch-services-title" className="ch-title t-h2">
            {head.title}
          </h2>
          <p className="ch-lead t-lead">{head.lead}</p>
        </div>
        <button
          type="button"
          className="ch-toggle t-chip"
          aria-pressed={mode === "list"}
          aria-controls="ch-services-body"
          onClick={toggle}
        >
          {head.toggle}
        </button>
      </header>

      <div id="ch-services-body" className="ch-services-body">
        {mode === "list" ? (
          <ol className="ch-container l-container ch-list">
            {services.map((s, i) => (
              <li key={s.id} className="ch-item">
                <figure className="ch-item-media">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes={IMAGE_SIZES}
                    className={`ch-img ch-focus-${s.id}`}
                  />
                  <figcaption className="ch-tag t-caption">{s.imageTag}</figcaption>
                </figure>
                <ServiceDetail service={s} index={i} />
              </li>
            ))}
          </ol>
        ) : (
          <div
            className="ch-carousel"
            role="region"
            aria-roledescription="캐러셀"
            aria-label={head.carouselLabel}
            onKeyDown={onCarouselKeyDown}
          >
            <div
              className="ch-stage"
              aria-hidden="true"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                swipe.current = null;
              }}
              onClickCapture={onStageClickCapture}
              onDragStart={(event) => event.preventDefault()}
            >
              {services.map((s, i) => {
                const pos = position(i, current);
                if (reduced && pos !== "0") return null;
                return (
                  <Link
                    key={s.id}
                    href={s.href}
                    className="ch-card"
                    data-pos={pos}
                    tabIndex={-1}
                    draggable={false}
                    onClick={(event) => {
                      if (pos === "0") return;
                      event.preventDefault();
                      select(i);
                    }}
                  >
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes={IMAGE_SIZES}
                      draggable={false}
                      className={`ch-img ch-focus-${s.id}`}
                    />
                    <span className="ch-card-shade" />
                    <span className="ch-card-top">
                      <span className="ch-tag t-caption">{s.imageTag}</span>
                      <span className="ch-num eyebrow">{pad2(i + 1)}</span>
                    </span>
                    <span className="ch-card-bottom">
                      <span className="ch-kicker eyebrow">{s.kicker}</span>
                      <span className="ch-svc-title t-h3">{s.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="ch-container l-container ch-controls">
              <span className="ch-num ch-counter eyebrow" aria-hidden="true">
                {pad2(current + 1)} / {pad2(COUNT)}
              </span>
              <div
                className="ch-tabs"
                role="tablist"
                aria-label={head.tabsLabel}
              >
                {services.map((s, i) => (
                  <button
                    key={s.id}
                    ref={(node) => {
                      tabRefs.current[i] = node;
                    }}
                    type="button"
                    role="tab"
                    id={tabId(s.id)}
                    className="ch-tab t-chip"
                    aria-selected={i === current}
                    aria-controls={PANEL_ID}
                    tabIndex={i === current ? 0 : -1}
                    onClick={() => select(i)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="ch-arrows">
                <button
                  type="button"
                  className="ch-arrow"
                  aria-label={head.prev}
                  onClick={() => select(current - 1)}
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  className="ch-arrow"
                  aria-label={head.next}
                  onClick={() => select(current + 1)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div className="ch-container l-container">
              <div
                className="ch-panel"
                role="tabpanel"
                id={PANEL_ID}
                aria-labelledby={tabId(active.id)}
              >
                <ServiceDetail service={active} index={current} />
              </div>
            </div>
            <p className="ch-sr-only" aria-live="polite">
              {`${COUNT}개 중 ${current + 1}번째 · ${active.label}`}
            </p>
          </div>
        )}
      </div>

      <p className="ch-container l-container ch-caption ch-services-note t-small">
        {head.note}
      </p>
    </section>
  );
}
