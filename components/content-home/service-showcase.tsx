"use client";
/* 서비스 6종(#services): 목록 모드와 3D 캐러셀 모드.
 * - 서버 렌더와 첫 클라이언트 렌더는 목록 모드(JS 없이도 6개 서비스·가격·링크가 모두 보인다).
 *   마운트 후 reduced-motion이 아니면 캐러셀. 사용자가 토글을 누르면 그 선택이 우선한다.
 * - 캐러셀: 탭(roving tabindex, ←/→·Home/End), 이전·다음 버튼, 스와이프(48px), 옆 카드 클릭 → 그 카드 선택,
 *   가운데 카드 클릭 → 서비스 페이지. 자동 넘김·wheel·scroll-snap 없음.
 * - 무대(.ch-stage)는 탭·패널을 시각적으로 되풀이하므로 aria-hidden이다. 카드는 Tab으로 닿지 않고(tabIndex -1)
 *   마우스로 눌러도 포커스를 받지 않는다(aria-hidden 안 포커스 경고 방지). */
import { useEffect, useRef, useState } from "react";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
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
      data-cs-section="services"
      aria-labelledby="ch-services-title"
      data-mode={mode}
    >
      <div className="cs-container">
        <CsSectionHead
          id="ch-services-title"
          eyebrow={head.eyebrow}
          title={head.title}
          lead={head.lead}
          aside={
            <button
              type="button"
              className="ch-toggle cs-t-chip"
              aria-pressed={mode === "list"}
              aria-controls="ch-services-body"
              onClick={toggle}
            >
              {head.toggle}
            </button>
          }
        />
      </div>

      <div id="ch-services-body" className="ch-services-body">
        {mode === "list" ? (
          <ol className="cs-container ch-list">
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
                  <figcaption className="cs-tag cs-t-caption ch-media-tag">
                    {s.imageTag}
                  </figcaption>
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
                    onMouseDown={(event) => event.preventDefault()}
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
                      <span className="cs-tag cs-t-caption">{s.imageTag}</span>
                      <span className="ch-card-num cs-t-eyebrow">
                        {pad2(i + 1)}
                      </span>
                    </span>
                    <span className="ch-card-bottom">
                      <span className="cs-t-eyebrow">{s.kicker}</span>
                      <span className="ch-card-title cs-t-h3">{s.label}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="cs-container ch-controls">
              <span className="ch-counter cs-t-eyebrow" aria-hidden="true">
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
                    className="ch-tab cs-t-chip"
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
                  className="ch-arrow cs-t-button"
                  aria-label={head.prev}
                  onClick={() => select(current - 1)}
                >
                  <span aria-hidden="true">←</span>
                </button>
                <button
                  type="button"
                  className="ch-arrow cs-t-button"
                  aria-label={head.next}
                  onClick={() => select(current + 1)}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>

            <div className="cs-container">
              {/* 여섯 설명을 같은 칸에 겹쳐 가장 긴 설명 높이로 고정한다(서비스를 바꿔도 아래가 움직이지 않는다).
                  선택되지 않은 설명은 visibility:hidden + inert라 읽히거나 포커스되지 않는다. */}
              <div
                className="ch-panel"
                role="tabpanel"
                id={PANEL_ID}
                aria-labelledby={tabId(active.id)}
              >
                {services.map((s, i) => (
                  <div
                    key={s.id}
                    className="ch-panel-item"
                    data-active={i === current ? "" : undefined}
                    inert={i !== current}
                  >
                    <ServiceDetail service={s} index={i} />
                  </div>
                ))}
              </div>
            </div>
            <p className="cs-sr-only" aria-live="polite">
              {`${COUNT}개 중 ${current + 1}번째 · ${active.label}`}
            </p>
          </div>
        )}
      </div>

      <div className="cs-container">
        <p className="ch-services-note cs-t-small">{head.note}</p>
      </div>
    </section>
  );
}
