"use client";

import Image from "next/image";
import { Pause, Play, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Frame = {
  image: string;
  title: string;
  copy: string;
  visual?: "growth" | "search" | "automation";
};

export function ServiceMotion({
  label,
  frames,
}: {
  label: string;
  frames: Frame[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);
  const running = !paused && !reduced && inView && visible;
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % frames.length),
      4800,
    );
    return () => window.clearInterval(timer);
  }, [running, frames.length]);

  return (
    <div
      ref={root}
      className="service-motion"
      data-running={running}
      data-reduced={reduced}
      aria-label={label}
    >
      <div className="motion-stage">
        {frames.map((frame, i) => (
          <div
            key={`${frame.title}-${i}`}
            className="motion-scene"
            data-active={index === i}
            aria-hidden={index !== i}
          >
            <Image
              src={frame.image}
              alt=""
              fill
              sizes="(max-width: 1000px) 90vw, 48vw"
              className="motion-image"
            />
            {frame.visual === "growth" && (
              <div className="motion-graphic motion-graphic-growth" aria-hidden="true">
                <span>운영 흐름 예시</span>
                <svg viewBox="0 0 420 170" preserveAspectRatio="none">
                  <path className="motion-chart-grid" d="M0 40H420M0 85H420M0 130H420" />
                  <polyline
                    className="motion-chart-line motion-chart-traffic"
                    points="0,136 55,127 110,116 165,120 220,91 275,79 330,55 420,24"
                  />
                  <polyline
                    className="motion-chart-line motion-chart-sales"
                    points="0,154 55,146 110,141 165,126 220,131 275,103 330,94 420,64"
                  />
                </svg>
                <div className="motion-graphic-legend">
                  <span>● 유입</span>
                  <span>● 매출</span>
                </div>
              </div>
            )}
            {frame.visual === "search" && (
              <div className="motion-graphic motion-graphic-search" aria-hidden="true">
                <span>SEO · 사이트 구조</span>
                <span>AEO · 질문과 답</span>
                <span>GEO · 근거 정보</span>
              </div>
            )}
            {frame.visual === "automation" && (
              <div className="motion-graphic motion-graphic-automation" aria-hidden="true">
                <span>입력</span>
                <i />
                <span>처리</span>
                <i />
                <span>결과</span>
              </div>
            )}
            <div className="motion-caption">
              <span>
                0{i + 1} / 0{frames.length}
              </span>
              <strong>{frame.title}</strong>
              <p>{frame.copy}</p>
            </div>
          </div>
        ))}
        <span className="motion-label">
          {label} <ArrowUpRight size={14} aria-hidden="true" />
        </span>
        <span className="motion-disclosure">
          AI 생성 콘셉트 · 실제 고객 사례 아님
        </span>
      </div>
      <div className="motion-controls">
        <div role="group" aria-label={`${label} 장면 선택`}>
          {frames.map((frame, i) => (
            <button
              key={frame.title}
              type="button"
              aria-label={`${i + 1}. ${frame.title}`}
              aria-pressed={index === i}
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
            >
              <span className="motion-segment">
                <span />
              </span>
              <span className="motion-step-name">{frame.title}</span>
            </button>
          ))}
        </div>
        <button
          className="motion-toggle"
          type="button"
          disabled={reduced}
          aria-label={
            reduced
              ? "동작 줄이기 설정 적용 중"
              : paused
                ? "모션 재생"
                : "모션 일시정지"
          }
          onClick={() => setPaused((value) => !value)}
        >
          {paused || reduced ? <Play size={16} /> : <Pause size={16} />}
        </button>
      </div>
    </div>
  );
}
