"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  locale: string;
}

/* =============================================================
   SLIDE 1 — IR DECK
   Layout: title left, growth chart right
   ============================================================= */
function SlideIR() {
  return (
    <>
      {/* Top left */}
      <div
        className="absolute top-7 md:top-8 left-7 md:left-9 inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.55)" }}
      >
        <span style={{ width: 16, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        — AIO STUDIO · IR
      </div>
      <div
        className="absolute top-7 md:top-8 right-7 md:right-9 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.4)" }}
      >
        Series A · 2026 · CONFIDENTIAL
      </div>

      {/* Left half — title */}
      <div
        className="absolute z-10 text-left"
        style={{ top: "50%", left: "5%", transform: "translateY(-50%)", maxWidth: "48%" }}
      >
        <div
          className="mb-4 text-[10px] tracking-[0.28em] uppercase font-medium"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-gold)" }}
        >
          Series A IR Deck · 2026
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(22px, 3.4vw, 48px)",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.0,
            letterSpacing: "-0.028em",
          }}
        >
          투자자를{" "}
          <em
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tone-consult-gold)",
              fontWeight: 500,
            }}
          >
            설득하는
          </em>
          <br />
          한 장
        </div>

        {/* mini stats */}
        <div className="mt-7 inline-flex gap-6 flex-wrap">
          {[
            { v: "$2M+", l: "Raised" },
            { v: "142", l: "Customers" },
            { v: "98%", l: "Retention" },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(18px, 2.2vw, 28px)",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 5,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right half — growth chart */}
      <div
        className="absolute z-10"
        style={{ top: "20%", right: "5%", width: "42%", height: "60%" }}
      >
        <svg viewBox="0 0 400 240" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
          <defs>
            <linearGradient id="ir-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(201,169,97,0.45)" />
              <stop offset="100%" stopColor="rgba(201,169,97,0)" />
            </linearGradient>
          </defs>
          {/* Grid */}
          {[60, 120, 180].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
          ))}
          {/* Area */}
          <path
            d="M 0 215 C 60 200, 110 180, 170 150 C 230 115, 280 75, 340 35 C 365 20, 385 12, 400 8 L 400 240 L 0 240 Z"
            fill="url(#ir-fill)"
          />
          {/* Line */}
          <path
            d="M 0 215 C 60 200, 110 180, 170 150 C 230 115, 280 75, 340 35 C 365 20, 385 12, 400 8"
            fill="none"
            stroke="var(--tone-consult-gold)"
            strokeWidth="2.5"
          />
          {/* End point */}
          <circle cx="400" cy="8" r="6" fill="var(--tone-consult-gold)" />
          <circle cx="400" cy="8" r="14" fill="var(--tone-consult-gold)" opacity="0.2" />
          {/* X axis labels */}
          <text x="0" y="232" fill="rgba(255,255,255,0.35)" fontFamily="var(--font-ibm-plex-mono)" fontSize="8" letterSpacing="1.5">JAN &apos;25</text>
          <text x="180" y="232" fill="rgba(255,255,255,0.35)" fontFamily="var(--font-ibm-plex-mono)" fontSize="8" letterSpacing="1.5">JAN &apos;26</text>
          <text x="355" y="232" fill="var(--tone-consult-gold)" fontFamily="var(--font-ibm-plex-mono)" fontSize="8" letterSpacing="1.5">NOW</text>
        </svg>
      </div>

      {/* Bottom left */}
      <div
        className="absolute bottom-7 md:bottom-8 left-7 md:left-9 text-[10px] tracking-[0.16em] z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.45)" }}
      >
        aio-make.com · ir
      </div>
    </>
  );
}

/* =============================================================
   SLIDE 2 — COMPANY PROFILE
   Layout: brand mark + 4 service grid
   ============================================================= */
function SlideCompany() {
  const services = [
    { code: "WEB", label: "Web" },
    { code: "DTL", label: "Detail" },
    { code: "PPT", label: "Deck" },
    { code: "OPS", label: "Ops" },
  ];

  return (
    <>
      <div
        className="absolute top-7 md:top-8 left-7 md:left-9 inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.55)" }}
      >
        <span style={{ width: 16, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        — AIO STUDIO · COMPANY
      </div>
      <div
        className="absolute top-7 md:top-8 right-7 md:right-9 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.4)" }}
      >
        Profile · 2026
      </div>

      <div
        className="absolute z-10 w-full text-center"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", padding: "0 clamp(24px,4vw,56px)" }}
      >
        {/* Big AIO mark */}
        <div
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(72px, 11vw, 168px)",
            fontWeight: 500,
            color: "var(--tone-consult-gold)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            marginBottom: 16,
          }}
        >
          AIO
        </div>

        <div
          className="mb-2 text-[10px] tracking-[0.32em] uppercase font-medium"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-gold)" }}
        >
          All-In-One Studio
        </div>

        <div
          className="mb-8"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(20px, 2.8vw, 36px)",
            fontWeight: 600,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: "-0.022em",
          }}
        >
          각 분야 전문가가{" "}
          <em
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tone-consult-gold)",
              fontWeight: 500,
            }}
          >
            만듭니다
          </em>
        </div>

        {/* 4 service codes */}
        <div className="inline-flex gap-3 md:gap-4 flex-wrap justify-center">
          {services.map((s) => (
            <div
              key={s.code}
              className="px-4 py-2.5"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(201,169,97,0.4)",
                minWidth: 70,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: "var(--tone-consult-gold)",
                }}
              >
                {s.code}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.6)",
                  marginTop: 2,
                  letterSpacing: "-0.005em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-7 md:bottom-8 left-7 md:left-9 text-[10px] tracking-[0.16em] z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.45)" }}
      >
        aio-make.com · est 2024
      </div>
    </>
  );
}

/* =============================================================
   SLIDE 3 — BUSINESS PROPOSAL
   Layout: left numbered index + right title
   ============================================================= */
function SlideBiz() {
  const sections = [
    { num: "01", label: "Executive Summary" },
    { num: "02", label: "Approach" },
    { num: "03", label: "Pricing & ROI" },
    { num: "04", label: "Timeline" },
  ];

  return (
    <>
      <div
        className="absolute top-7 md:top-8 left-7 md:left-9 inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.55)" }}
      >
        <span style={{ width: 16, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        — AIO STUDIO · PROPOSAL
      </div>
      <div
        className="absolute top-7 md:top-8 right-7 md:right-9 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.4)" }}
      >
        Q1 2026 · B2B
      </div>

      {/* Left — index */}
      <div
        className="absolute z-10"
        style={{ top: "50%", left: "5%", transform: "translateY(-50%)", maxWidth: "32%" }}
      >
        <div
          className="mb-5 text-[10px] tracking-[0.28em] uppercase font-medium"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-gold)" }}
        >
          Contents
        </div>
        <div
          className="flex flex-col gap-3"
          style={{ borderLeft: "1px solid rgba(201,169,97,0.4)", paddingLeft: 18 }}
        >
          {sections.map((s) => (
            <div key={s.num} className="flex items-baseline gap-3">
              <span
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: 10,
                  color: "var(--tone-consult-gold)",
                  letterSpacing: "0.1em",
                }}
              >
                {s.num}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(11px, 1.1vw, 14px)",
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "-0.005em",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — title */}
      <div
        className="absolute z-10 text-right"
        style={{ top: "50%", right: "5%", transform: "translateY(-50%)", maxWidth: "55%" }}
      >
        <div
          className="mb-4 text-[10px] tracking-[0.28em] uppercase font-medium"
          style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-gold)" }}
        >
          Business Proposal
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(24px, 4vw, 56px)",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
          }}
        >
          디지털 전환을
          <br />
          <em
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              color: "var(--tone-consult-gold)",
              fontWeight: 500,
            }}
          >
            설계
          </em>
          합니다
        </div>
        <div
          className="mt-4 text-[11px]"
          style={{
            fontFamily: "var(--font-pretendard)",
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "-0.005em",
          }}
        >
          Prepared by AIO Studio · For Strategic Partners
        </div>
      </div>

      <div
        className="absolute bottom-7 md:bottom-8 left-7 md:left-9 text-[10px] tracking-[0.16em] z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.45)" }}
      >
        aio-make.com · b2b
      </div>
    </>
  );
}

/* =============================================================
   SLIDE 4 — WORKSHOP KEYNOTE
   Layout: centered title with agenda items
   ============================================================= */
function SlideWorkshop() {
  const agenda = [
    { time: "0-15", label: "Opening · 발표의 본질" },
    { time: "15-45", label: "AI 시대 슬라이드 설계" },
    { time: "45-75", label: "실전: 한 장의 힘" },
    { time: "75-90", label: "Q&A · 워크 포워드" },
  ];

  return (
    <>
      <div
        className="absolute top-7 md:top-8 left-7 md:left-9 inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.55)" }}
      >
        <span style={{ width: 16, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        — AIO STUDIO · WORKSHOP
      </div>
      <div
        className="absolute top-7 md:top-8 right-7 md:right-9 text-[10px] tracking-[0.22em] uppercase z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.4)" }}
      >
        Keynote · 90 min
      </div>

      <div
        className="absolute z-10 w-full"
        style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", padding: "0 clamp(24px,5vw,72px)" }}
      >
        <div className="text-center mb-7">
          <div
            className="mb-3 text-[10px] tracking-[0.28em] uppercase font-medium"
            style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-gold)" }}
          >
            Workshop Keynote · 2026
          </div>
          <div
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(22px, 3.4vw, 48px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-0.028em",
            }}
          >
            AI 시대의{" "}
            <em
              style={{
                fontFamily: "var(--font-cormorant)",
                fontStyle: "italic",
                color: "var(--tone-consult-gold)",
                fontWeight: 500,
              }}
            >
              발표 전략
            </em>
          </div>
        </div>

        {/* Agenda */}
        <div className="mx-auto max-w-[640px]">
          {agenda.map((a, i) => (
            <div
              key={a.time}
              className="flex items-baseline gap-4 py-2"
              style={{
                borderBottom:
                  i < agenda.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-ibm-plex-mono)",
                  fontSize: "clamp(9.5px, 0.95vw, 11px)",
                  color: "var(--tone-consult-gold)",
                  letterSpacing: "0.12em",
                  minWidth: 60,
                }}
              >
                {a.time}&apos;
              </span>
              <span
                style={{
                  fontFamily: "var(--font-pretendard)",
                  fontSize: "clamp(11px, 1.1vw, 14px)",
                  color: "rgba(255,255,255,0.85)",
                  letterSpacing: "-0.005em",
                  fontWeight: 400,
                }}
              >
                {a.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-7 md:bottom-8 left-7 md:left-9 text-[10px] tracking-[0.16em] z-10"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "rgba(255,255,255,0.45)" }}
      >
        aio-make.com · seminar
      </div>
    </>
  );
}

/* =============================================================
   Hero Slideshow — rotates through 4 distinct slide layouts
   ============================================================= */
const SLIDE_COMPONENTS = [SlideIR, SlideCompany, SlideBiz, SlideWorkshop];
const SLIDE_LABELS = ["IR", "회사 소개서", "사업 제안서", "세미나"];

function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDE_COMPONENTS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const ActiveSlide = SLIDE_COMPONENTS[active];

  return (
    <div
      className="w-full mx-auto relative overflow-hidden"
      style={{
        maxWidth: 1120,
        aspectRatio: "16/9",
        borderRadius: 4,
        boxShadow: "0 30px 80px rgba(14,26,43,0.32)",
        background: "linear-gradient(135deg, #1B3B5F 0%, #0E1A2B 60%, #050A14 100%)",
      }}
    >
      {/* Static overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(27,59,95,0.5) 0%, rgba(14,26,43,0) 50%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(201,169,97,0.18), transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          opacity: 0.5,
        }}
      />

      {/* Active slide content */}
      <div key={active} className="absolute inset-0 animate-fade-in">
        <ActiveSlide />
      </div>

      {/* Slide indicator + label */}
      <div className="absolute bottom-7 md:bottom-8 right-7 md:right-9 z-20 flex items-center gap-3">
        <span
          className="hidden sm:inline-block text-[10px] tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-ibm-plex-mono)",
            color: "rgba(255,255,255,0.55)",
            textTransform: "uppercase",
          }}
        >
          {SLIDE_LABELS[active]}
        </span>
        <div className="flex items-center gap-2">
          {SLIDE_COMPONENTS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 24 : 8,
                height: 2,
                background: i === active ? "var(--tone-consult-gold)" : "rgba(255,255,255,0.3)",
                border: 0,
                padding: 0,
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          ))}
        </div>
        <span
          className="text-[10px] tracking-[0.18em]"
          style={{
            fontFamily: "var(--font-ibm-plex-mono)",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          {String(active + 1).padStart(2, "0")} / {String(SLIDE_COMPONENTS.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export function ConsultHero({ locale }: Props) {
  return (
    <section
      className="mx-auto text-center"
      style={{ padding: "clamp(64px, 8vw, 96px) clamp(16px, 3vw, 24px) clamp(56px, 8vw, 80px)", maxWidth: 1280 }}
    >
      {/* Eyebrow */}
      <div
        className="inline-flex items-center gap-[14px] mb-7 text-[11.5px] tracking-[0.3em] uppercase font-medium"
        style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-navy)" }}
      >
        <span style={{ width: 28, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        Presentation · Design
      </div>

      {/* H1 */}
      <h1
        className="font-bold mx-auto mb-8"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "clamp(38px, 7.4vw, 124px)",
          letterSpacing: "-0.035em",
          lineHeight: 0.96,
          color: "var(--tone-consult-ink)",
          maxWidth: 1100,
        }}
      >
        <span>한 장이</span>
        <br />
        <em
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            color: "var(--tone-consult-navy)",
            fontWeight: 500,
          }}
        >
          결정을 짓는
        </em>{" "}
        발표
      </h1>

      <p
        className="mx-auto mb-11"
        style={{
          fontFamily: "var(--font-pretendard)",
          fontSize: "clamp(14.5px, 1.3vw, 19px)",
          lineHeight: 1.6,
          color: "var(--tone-consult-ink-2)",
          maxWidth: 660,
        }}
      >
        IR 덱 · 사업 제안서 · 컨설팅 보고서까지.{" "}
        <strong style={{ color: "var(--tone-consult-ink)", fontWeight: 600 }}>의사결정자를 설득하는</strong>{" "}
        <em
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            color: "var(--tone-consult-navy)",
            fontWeight: 500,
          }}
        >
          슬라이드 한 세트
        </em>
        .
      </p>

      {/* CTAs */}
      <div className="inline-flex gap-3 flex-wrap justify-center mb-16">
        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center gap-2 px-[22px] py-[13px] text-[13px] font-semibold transition-all hover:-translate-y-0.5 hover:!bg-[var(--tone-consult-navy)]"
          style={{
            fontFamily: "var(--font-inter)",
            background: "var(--tone-consult-ink)",
            color: "var(--tone-consult-paper)",
            textDecoration: "none",
            letterSpacing: "-0.005em",
          }}
        >
          견적 시작 →
        </Link>
        <Link
          href={`/${locale}/services/ppt-design/portfolio`}
          className="inline-flex items-center gap-2 px-[22px] py-[13px] text-[13px] font-medium transition-all hover:-translate-y-0.5 hover:!border-[var(--tone-consult-navy)] hover:!text-[var(--tone-consult-navy)]"
          style={{
            fontFamily: "var(--font-inter)",
            background: "transparent",
            color: "var(--tone-consult-ink)",
            border: "1px solid var(--tone-consult-line-2)",
            textDecoration: "none",
            letterSpacing: "-0.005em",
          }}
        >
          포트폴리오 보기
        </Link>
      </div>

      <HeroSlideshow />
    </section>
  );
}
