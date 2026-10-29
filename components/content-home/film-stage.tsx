"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  contentHomeHero,
  contentHomeServices,
  homeCardMedia,
} from "@/lib/content-home";
import type { ContentServiceId } from "@/lib/content-site/types";
import { HomeCasePreview } from "./home-case-preview";

const order: ContentServiceId[] = [
  "motion-graphics",
  "webtoon",
  "animation",
  "ai-influencer",
  "brand-film",
  "ad",
];

/** Finite filmstrip: poster first, media fetched only after an explicit preview. */
export function FilmStage() {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<ContentServiceId | null>(null);
  const [introFailed, setIntroFailed] = useState(false);
  const intro = useRef<HTMLDialogElement>(null);
  const introButton = useRef<HTMLButtonElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const overflow = useRef("");
  const id = order[selected];
  const media = homeCardMedia[id];
  const service = contentHomeServices.find((item) => item.id === id)!;

  function select(index: number) {
    const next = (index + order.length) % order.length;
    setSelected(next);
    try {
      sessionStorage.setItem("aio-content-film-selection", order[next]);
    } catch {
      /* Poster selection still works without storage. */
    }
  }
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("aio-content-film-selection");
      const index = order.findIndex((item) => item === saved);
      if (index >= 0) setSelected(index);
    } catch {
      /* The server-rendered default remains usable. */
    }
  }, []);
  useEffect(() => {
    const node = strip.current;
    const button = node?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (node && button)
      node.scrollTo({
        left:
          button.offsetLeft -
          node.offsetLeft -
          (node.clientWidth - button.clientWidth) / 2,
        behavior: "instant",
      });
  }, [selected]);
  useEffect(() => {
    const dialog = intro.current;
    const stop = () => {
      if (document.hidden) dialog?.querySelector("video")?.pause();
    };
    document.addEventListener("visibilitychange", stop);
    return () => {
      document.removeEventListener("visibilitychange", stop);
      if (dialog?.open) document.body.style.overflow = overflow.current;
    };
  }, []);

  return (
    <div className="cf-stage">
      <div className="cf-heading">
        <p className="cs-t-eyebrow">AIO MAKE CONTENT STUDIO</p>
        <h1 id="ch-hero-title">
          기획한 이야기가
          <br />
          움직이는 장면으로
        </h1>
        <p className="cs-t-lead">영상부터 웹툰까지 실제 결과물을 살펴보세요</p>
        <div className="cf-actions">
          <a className="cs-btn" href="#services">
            작품 골라보기 <span aria-hidden="true">↓</span>
          </a>
          <Link className="cs-link" href="/content/contact">
            상담 신청 ↗
          </Link>
        </div>
      </div>
      <div className="cf-prism" aria-hidden="true">
        <span>▶</span>
      </div>
      <div
        className="cf-film"
        onTouchStart={(event) => {
          touch.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={(event) => {
          if (!touch.current) return;
          const dx = event.changedTouches[0].clientX - touch.current.x;
          const dy = event.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2)
            select(selected + (dx < 0 ? 1 : -1));
        }}
        onTouchCancel={() => {
          touch.current = null;
        }}
      >
        {[-1, 0, 1].map((offset) => {
          const index = (selected + offset + order.length) % order.length;
          const item = homeCardMedia[order[index]];
          return (
            <button
              key={offset}
              className="cf-frame"
              data-position={offset}
              type="button"
              tabIndex={offset ? -1 : 0}
              aria-label={
                offset
                  ? `${item.caseLabel} 선택`
                  : `${media.caseLabel} ${media.video ? "크게 재생" : "이미지 크게 보기"}`
              }
              onClick={() => (offset ? select(index) : setPreview(id))}
            >
              <span className="cf-picture">
                <Image
                  src={item.poster}
                  alt={item.alt}
                  fill
                  priority={offset === 0}
                  sizes={offset ? "20vw" : "(min-width:768px) 55vw, 86vw"}
                />
              </span>
              {!offset ? (
                <span className="cf-open">
                  {item.video ? "▶ 크게 재생" : "이미지 크게 보기 ↗"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="cf-selection" aria-live="polite">
        <p className="cs-t-h3">{media.caseLabel}</p>
        <p className="cs-t-caption">{media.tag}</p>
        <Link className="cs-link" href={service.href}>
          {service.label} 서비스 보기 →
        </Link>
      </div>
      <div
        className="cf-controls"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            select(selected + (event.key === "ArrowRight" ? 1 : -1));
          }
          if (event.key === "Home") {
            event.preventDefault();
            select(0);
          }
          if (event.key === "End") {
            event.preventDefault();
            select(order.length - 1);
          }
        }}
      >
        <button
          type="button"
          className="cf-arrow"
          aria-label="이전 작품"
          onClick={() => select(selected - 1)}
        >
          ←
        </button>
        <div className="cf-thumbnails" ref={strip} aria-label="작품 선택">
          {order.map((key, index) => (
            <button
              key={key}
              type="button"
              aria-label={homeCardMedia[key].caseLabel}
              aria-pressed={index === selected}
              onClick={() => select(index)}
            >
              <Image
                src={homeCardMedia[key].poster}
                alt=""
                width={120}
                height={76}
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="cf-arrow"
          aria-label="다음 작품"
          onClick={() => select(selected + 1)}
        >
          →
        </button>
      </div>
      <div className="cf-bottom cs-t-caption">
        <span>{selected + 1} / 6</span>
        <button
          ref={introButton}
          type="button"
          onClick={() => {
            overflow.current = document.body.style.overflow;
            intro.current?.showModal();
            document.body.style.overflow = "hidden";
          }}
        >
          스튜디오 소개 영상 ↗
        </button>
      </div>
      <noscript>
        <p>
          작품 선택에는 자바스크립트가 필요합니다 아래에서 모든 제작 분야를
          확인할 수 있습니다
        </p>
        <a href={contentHomeHero.video?.src}>스튜디오 소개 영상 보기</a>
      </noscript>
      <HomeCasePreview id={preview} onClose={() => setPreview(null)} />
      <dialog
        data-slot={contentHomeHero.reelSlot}
        ref={intro}
        className="ch-case-dialog"
        aria-label="스튜디오 소개 영상"
        onClose={() => {
          intro.current?.querySelector("video")?.pause();
          document.body.style.overflow = overflow.current;
          introButton.current?.focus();
        }}
      >
        <div className="ch-case-bar">
          <h2 className="cs-t-h3">AIO MAKE 컨텐츠 스튜디오</h2>
          <button
            className="cs-btn"
            type="button"
            onClick={() => intro.current?.close()}
          >
            닫기 ×
          </button>
        </div>
        {contentHomeHero.video ? (
          <video
            controls
            playsInline
            muted
            preload="none"
            poster={contentHomeHero.video.poster}
            src={contentHomeHero.video.src}
            onError={() => setIntroFailed(true)}
          />
        ) : null}
        {introFailed ? (
          <div role="status">
            <p>영상을 불러오지 못했어요</p>
            <button
              type="button"
              className="cs-btn"
              onClick={() => {
                setIntroFailed(false);
                intro.current?.querySelector("video")?.load();
              }}
            >
              다시 시도
            </button>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
