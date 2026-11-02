"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  locale: string;
}

interface Slide {
  id: string;
  coverSrc: string;
  catLabel: string;
  catLabelEn: string;
  brand: string;
  stat: string;
  statLabel: string;
}

const SLIDES: Slide[] = [
  { id: "beauty",  coverSrc: "/portfolio/detail-page/ampoule-anti-aging/cover.png", catLabel: "뷰티 · 스킨케어",   catLabelEn: "Beauty",  brand: "LUMICELL", stat: "+42%", statLabel: "전환율" },
  { id: "food",    coverSrc: "/portfolio/detail-page/premium-mealkit/cover.png",     catLabel: "식품 · 밀키트",      catLabelEn: "Food",    brand: "HOMEDISH", stat: "+52%", statLabel: "재구매율" },
  { id: "fashion", coverSrc: "/portfolio/detail-page/linen-onepiece/cover.png",      catLabel: "패션 · 의류",         catLabelEn: "Fashion", brand: "LINENA",   stat: "+33%", statLabel: "전환율" },
  { id: "living",  coverSrc: "/portfolio/detail-page/mood-light/cover.png",          catLabel: "리빙 · 조명",         catLabelEn: "Living",  brand: "GLOWAVE",  stat: "+29%", statLabel: "전환율" },
  { id: "pet",     coverSrc: "/portfolio/detail-page/premium-pet-food/cover.png",    catLabel: "펫 · 프리미엄 사료", catLabelEn: "Pet",     brand: "멍슐랭",   stat: "+47%", statLabel: "전환율" },
];

/* ============================================================
   Vertical Marquee — 이미지 2장 복제 후 -50% 스크롤 무한 루프
   ============================================================ */
function ScrollingScreen({
  src,
  alt,
  speed = "normal",
  className = "",
}: {
  src: string;
  alt: string;
  speed?: "normal" | "slow";
  className?: string;
}) {
  const animClass =
    speed === "slow" ? "animate-device-marquee-slow" : "animate-device-marquee";
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: "100%", height: "100%" }}
    >
      <div className={animClass} style={{ width: "100%" }}>
        {/* 2장 스택 — 무한 루프 위해 동일 이미지 복제 */}
        {[0, 1].map((i) => (
          <Image
            key={i}
            src={src}
            alt={`${alt} (${i + 1})`}
            width={482}
            height={710}
            sizes="(max-width: 768px) 240px, 480px"
            className="block w-full h-auto"
            priority={i === 0}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   PC Browser Mockup — left
   ============================================================ */
function DesktopMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: "100%",
        maxWidth: 540,
        background: "#ECE6DC",
        borderRadius: 10,
        padding: "8px 8px 0",
        boxShadow:
          "0 30px 60px rgba(42,36,24,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5" style={{ padding: "8px 10px 12px" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF6B6B" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FFD93D" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#6BCB77" }} />
        <span
          className="ml-3 flex-1 px-3 py-1 text-[10px]"
          style={{
            background: "#F8F4ED",
            borderRadius: 5,
            fontFamily: "var(--font-jetbrains)",
            color: "var(--tone-life-ink-3)",
            letterSpacing: "0.06em",
            border: "1px solid rgba(0,0,0,0.05)",
            textAlign: "left",
          }}
        >
          aio-make.com/products
        </span>
      </div>
      {/* Screen — 4:3 aspect, 이미지 자동 스크롤 */}
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          aspectRatio: "4/3",
          background: "var(--tone-life-cream-3)",
          borderRadius: "0 0 6px 6px",
        }}
      >
        <ScrollingScreen src={src} alt={alt} speed="slow" />
      </div>
    </div>
  );
}

/* ============================================================
   Phone Mockup — right
   ============================================================ */
function PhoneMockup({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="relative mx-auto"
      style={{
        width: "100%",
        maxWidth: 280,
        aspectRatio: "9/19.5",
        background: "linear-gradient(160deg, #1a1816 0%, #2a2825 100%)",
        borderRadius: 36,
        padding: 7,
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 28,
          background: "var(--tone-life-cream-3)",
        }}
      >
        <ScrollingScreen src={src} alt={alt} speed="normal" />
        {/* Dynamic island */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 10,
            width: 84,
            height: 22,
            background: "#000",
            borderRadius: 999,
            zIndex: 3,
          }}
        />
      </div>
      {/* Side button hint */}
      <span
        className="absolute"
        style={{
          right: -2,
          top: "28%",
          width: 3,
          height: 60,
          background: "linear-gradient(180deg, #555 0%, #2a2825 100%)",
          borderRadius: 2,
        }}
      />
    </div>
  );
}

function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[active];

  return (
    <div className="w-full mx-auto" style={{ maxWidth: 1180 }}>
      {/* Devices row — PC 좌측 / Phone 우측, 겹치지 않음 */}
      <div
        key={slide.id}
        className="animate-fade-in grid items-center gap-6 md:gap-10 lg:gap-14 grid-cols-1 md:[grid-template-columns:minmax(0,1.6fr)_minmax(0,1fr)]"
        style={{
          padding: "clamp(20px, 4vw, 40px) 0",
        }}
      >
        {/* Left — PC (모바일에서는 숨김) */}
        <div className="hidden md:flex justify-end">
          <DesktopMockup src={slide.coverSrc} alt={`${slide.brand} desktop`} />
        </div>
        {/* Right — Phone (모바일에서는 중앙 정렬) */}
        <div className="flex justify-center md:justify-start">
          <PhoneMockup src={slide.coverSrc} alt={`${slide.brand} mobile`} />
        </div>
      </div>

      {/* Caption row — 카테고리 / 브랜드 / 통계 */}
      <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11,
            color: "var(--tone-life-rose)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {slide.catLabelEn} · {slide.brand}
        </span>
        <span style={{ color: "var(--tone-life-line-2)" }}>·</span>
        <span
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--tone-life-rose)",
            letterSpacing: "-0.018em",
          }}
        >
          {slide.stat}
        </span>
        <span
          style={{
            fontFamily: "var(--font-pretendard)",
            fontSize: 12.5,
            color: "var(--tone-life-ink-3)",
            letterSpacing: "-0.005em",
          }}
        >
          {slide.statLabel}
        </span>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 28 : 10,
              height: 2,
              background:
                i === active ? "var(--tone-life-rose)" : "var(--tone-life-line-2)",
              border: 0,
              padding: 0,
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
            }}
          />
        ))}
        <span
          className="ml-2"
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: 10,
            color: "var(--tone-life-ink-3)",
            letterSpacing: "0.18em",
          }}
        >
          {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export function LifestyleHero({ locale }: Props) {
  return (
    <section
      className="mx-auto text-center"
      style={{ padding: "clamp(64px, 10vw, 100px) clamp(16px, 3vw, 24px) clamp(48px, 7vw, 70px)", maxWidth: 1280 }}
    >
      <div
        className="inline-flex items-center gap-[14px] mb-7 text-[11.5px] tracking-[0.28em] uppercase"
        style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-life-rose)" }}
      >
        <span style={{ width: 32, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
        Detail Page · Commerce
        <span style={{ width: 32, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
      </div>

      <h1
        className="font-medium mx-auto mb-8"
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(40px, 8vw, 132px)",
          letterSpacing: "-0.03em",
          lineHeight: 0.96,
          color: "var(--tone-life-ink)",
          maxWidth: 1100,
        }}
      >
        <span>스크롤 한 번에,</span>
        <br />
        <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)" }}>결제 버튼</em>까지
      </h1>

      <p
        className="mx-auto mb-11"
        style={{
          fontFamily: "var(--font-pretendard)",
          fontSize: "clamp(15px, 1.4vw, 21px)",
          lineHeight: 1.55,
          color: "var(--tone-life-ink-2)",
          maxWidth: 640,
        }}
      >
        뷰티 · 식품 · 패션 · 리빙 · 펫까지.{" "}
        <strong style={{ color: "var(--tone-life-ink)", fontWeight: 600 }}>커머스 상세페이지</strong>를{" "}
        <em
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
            color: "var(--tone-life-rose)",
            fontWeight: 500,
          }}
        >
          전환율 중심
        </em>
        으로.
      </p>

      <div className="inline-flex gap-3 flex-wrap justify-center mb-14">
        <Link
          href={`/${locale}/quote`}
          className="inline-flex items-center gap-2 px-7 py-[14px] text-[14px] font-semibold rounded-full transition-all hover:-translate-y-0.5 hover:!bg-[var(--tone-life-rose)]"
          style={{
            fontFamily: "var(--font-jakarta)",
            background: "var(--tone-life-ink)",
            color: "var(--tone-life-cream)",
            textDecoration: "none",
          }}
        >
          견적 시작 →
        </Link>
        <Link
          href={`/${locale}/services/detail-page/portfolio`}
          className="inline-flex items-center gap-2 px-7 py-[14px] text-[14px] font-medium rounded-full transition-all hover:-translate-y-0.5 hover:!border-[var(--tone-life-ink)]"
          style={{
            fontFamily: "var(--font-jakarta)",
            background: "transparent",
            color: "var(--tone-life-ink)",
            border: "1.5px solid var(--tone-life-line-2)",
            textDecoration: "none",
          }}
        >
          포트폴리오 보기
        </Link>
      </div>

      <HeroSlideshow />
    </section>
  );
}
