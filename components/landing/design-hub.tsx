"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";


const ACCENT = "#C66060";

const SUB_SERVICES = [
  {
    no: "01", id: "logo", title: "로고·명함", en: "Logo & Business Card",
    desc: "브랜드의 첫 글자 — 손에 남는 첫 명함, 현재 준비 중",
    price: "준비 중", days: "", tags: ["Illustrator", "Figma"],
    href: () => "#", soon: true, accent: "#9CA3AF", bg: "#F9FAFB",
  },
  {
    no: "02", id: "detail-page", title: "상세페이지", en: "Detail Page",
    desc: "스크롤을 멈추게 만드는 한 페이지 — 길이와 깊이를 골라서",
    price: "₩99,000~", days: "5일 이내", tags: ["Figma", "Photoshop", "HTML/CSS"],
    href: (l: string) => `/${l}/services/detail-page`, soon: false, accent: "#2DD4BF", bg: "#F0FDFA",
  },
  {
    no: "03", id: "ppt-design", title: "PPT 디자인", en: "PPT Design",
    desc: "제안·IR·발표 — 한 장으로 전달되는 슬라이드",
    price: "₩59,000~", days: "5일 이내", tags: ["PowerPoint", "Keynote", "Figma"],
    href: (l: string) => `/${l}/services/ppt-design`, soon: false, accent: "#818CF8", bg: "#EEF2FF",
  },
  {
    no: "04", id: "brand", title: "브랜드 패키지", en: "Brand Package",
    desc: "로고·컬러·폰트·가이드라인 — 브랜드 전체를 한 번에, 현재 준비 중",
    price: "준비 중", days: "", tags: ["Illustrator", "Figma"],
    href: () => "#", soon: true, accent: "#9CA3AF", bg: "#F9FAFB",
  },
];

const HOW = [
  { no: "01", title: "매일 진행 공유", desc: "시안이 막혀도 모르고 기다리는 시간이 없도록 — 매일 진행 상황을 알려드립니다", icon: "💬" },
  { no: "02", title: "원본 파일 제공", desc: "PSD·AI·PPTX 원본 그대로 납품 — 나중에 다른 곳에서 수정해도 막힘 없이", icon: "📁" },
  { no: "03", title: "빠른 속도", desc: "의뢰 후 5일 이내 첫 시안 — 다음 날 착수합니다", icon: "⚡" },
  { no: "04", title: "2차 수정 무료", desc: "1차 시안 확인 후 수정 요청 → 2차 시안 → 최종 납품 — 만족할 때까지", icon: "✅" },
];

const REVIEWS = [
  { stars: 5, text: "상세페이지 보는 순간 '이거다' 싶었어요 — 고객 반응도 완전히 달라졌고 구매 전환율이 확 올랐습니다", author: "김*현", service: "상세페이지 제작", date: "2026.04" },
  { stars: 5, text: "PPT 디자인 완성도가 정말 높아서 발표 때 자신감이 생겼습니다 — 투자자 피드백도 긍정적이었어요", author: "이*준", service: "IR 덱 디자인", date: "2026.03" },
  { stars: 5, text: "기존에 직접 만든 상세페이지와 비교하면 차원이 달랐습니다 — 수정 요청도 빠르게 반영해주셨어요", author: "박*민", service: "상세페이지 리디자인", date: "2026.05" },
];

const FAQS = [
  { q: "제작 기간이 얼마나 걸리나요?", a: "모든 서비스 최대 5일 이내 납품이 기준이며 의뢰 내용에 따라 견적 시 정확한 납기를 안내드립니다" },
  { q: "수정은 몇 번까지 가능한가요?", a: "기본 2차 수정이 포함되어 있으며 1차 시안 확인 후 수정 요청 → 2차 시안 → 최종 납품 순서로 진행됩니다" },
  { q: "원본 파일도 받을 수 있나요?", a: "네 — Figma·PSD·AI·PPTX 등 작업에 사용한 원본 파일 전체를 납품과 함께 제공합니다" },
  { q: "이미지·사진이 없어도 제작 가능한가요?", a: "가능합니다 — 무료 스톡 이미지를 활용해 제작하며 필요 시 유료 스톡 사용 비용은 별도로 안내드립니다" },
  { q: "착수금은 어떻게 되나요?", a: "착수 시 50%, 납품 시 나머지 50%를 계좌이체로 진행합니다" },
  { q: "납품 후 수정이 필요하면 어떻게 하나요?", a: "납품 후 2주 이내 오류·누락 수정은 무상으로 진행합니다 — 이후 추가 수정은 별도 견적으로 안내드립니다" },
];

const STACK = ["Figma", "Photoshop", "Illustrator", "After Effects", "PowerPoint", "Keynote"];

export function DesignHub({ locale }: { locale: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="design" active="service" />

      {/* ── Hero ── */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <Image
          src="/images/services/design-hub.jpg"
          alt="AIO 디자인팀"
          fill
          className="object-cover object-center"
          priority
          quality={100}
          unoptimized
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(105deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.82) 42%, rgba(10,10,10,0.45) 100%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to top, #fff 0%, transparent 100%)" }} />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-28 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10 items-center">
          <div className="text-center md:text-left">
            <p
              className="text-[11px] font-semibold tracking-[0.28em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains)" }}
            >
              Design · 디자인 서비스
            </p>
            <h1
              className="font-bold leading-[1.02] tracking-tight text-white mb-5"
              style={{ fontSize: "clamp(30px,5.5vw,72px)" }}
            >
              보이는 것이<br />곧 <span style={{ color: ACCENT }}>신뢰</span>입니다
            </h1>
            <p
              className="leading-[1.8] mb-8"
              style={{ fontSize: "clamp(14px,1.1vw,16px)", color: "rgba(255,255,255,0.6)" }}
            >
              로고·명함·상세페이지·PPT<br className="hidden md:block" />
              브랜드의 첫 인사를 다듬습니다
            </p>
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
              {["5일 납품 보장", "원본 파일 제공", "디자이너 직접 작업", "2차 수정 기본 포함"].map((b) => (
                <span
                  key={b}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)", border: "1px solid rgba(255,255,255,0.18)" }}
                >
                  {b}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mb-12 justify-center md:justify-start">
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-[14px] font-bold text-[#111] bg-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                제작 문의 →
              </Link>
            </div>
            <div className="flex justify-center md:justify-start gap-6 sm:gap-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              {[{ v: "180", l: "누적 의뢰" }, { v: "5일", l: "최대 납기" }, { v: "100%", l: "원본 제공" }].map((s) => (
                <div key={s.l} className="text-center md:text-left">
                  <div className="font-bold text-white leading-none" style={{ fontSize: "clamp(20px,2.5vw,30px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                  <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: 서비스 미리보기 블록 */}
          <div
            className="hidden md:block rounded-xl overflow-hidden"
            style={{ background: "rgba(10,10,10,0.85)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
              <span className="ml-3 text-[10px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}>aio-design.fig</span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "상세페이지", time: "5일 이내", color: "#2DD4BF" },
                { label: "PPT 디자인", time: "5일 이내", color: "#818CF8" },
                { label: "로고·명함", time: "SOON", color: "#9CA3AF" },
                { label: "브랜드 패키지", time: "SOON", color: "#9CA3AF" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-[12px] font-medium text-white">{item.label}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: item.color, fontFamily: "var(--font-jetbrains)" }}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 디자인 툴 strip ── */}
      <div style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span
            className="text-[9px] font-bold tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}
          >
            Design Tools
          </span>
          <div className="flex flex-wrap gap-2">
            {STACK.map((t) => (
              <span
                key={t}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-jetbrains)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── 서비스 카드 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14 md:py-20">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>Services</p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(22px,3vw,36px)" }}>네 가지 디자인 서비스</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {SUB_SERVICES.map((s) => {
              const Card = (
                <div
                  className="group border rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: s.bg, borderColor: s.accent + "30", opacity: s.soon ? 0.6 : 1 }}
                >
                  <div className="h-1" style={{ background: s.accent }} />
                  <div className="p-3.5 sm:p-6">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <span className="text-[10px] font-bold tracking-[0.2em]" style={{ color: s.accent, fontFamily: "var(--font-jetbrains)" }}>{s.no}</span>
                      {s.soon && <span className="text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 bg-[#F3F4F6] text-[#9CA3AF] rounded-full">SOON</span>}
                    </div>
                    <h3 className="font-bold text-[#111] mb-0.5 sm:mb-1 text-[17px] sm:text-[clamp(18px,1.8vw,22px)]">{s.title}</h3>
                    <p className="hidden sm:block text-[11px] text-[#9CA3AF] mb-3" style={{ fontFamily: "var(--font-jetbrains)" }}>{s.en}</p>
                    <p className="hidden sm:block text-[13px] text-[#6B7280] leading-[1.7] mb-4">{s.desc}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5">
                      {s.tags.map((tag) => (
                        <span key={tag} className="text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md" style={{ background: s.accent + "12", color: s.accent }}>{tag}</span>
                      ))}
                    </div>
                    {!s.soon && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-[#F3F4F6] gap-0.5 sm:gap-0">
                        <span className="font-bold text-[17px] sm:text-[clamp(16px,1.6vw,20px)]" style={{ color: s.accent, fontFamily: "var(--font-jetbrains)" }}>{s.price}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] sm:text-[11px] text-[#9CA3AF]">납기</span>
                          <span className="text-[11px] sm:text-[12px] font-bold text-[#111]" style={{ fontFamily: "var(--font-jetbrains)" }}>{s.days}</span>
                          <span className="text-[11px] sm:text-[12px] font-semibold ml-0.5" style={{ color: s.accent }}>→</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
              return s.soon ? <div key={s.id}>{Card}</div> : <Link key={s.id} href={s.href(locale)} className="block">{Card}</Link>;
            })}
          </div>
        </div>
      </section>

      {/* ── 포트폴리오 미리보기 ── */}
      <style>{`
        @keyframes hubScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
      `}</style>
      <section style={{ background: "#F2F2F2", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14">
          <div className="text-center md:text-left mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>Portfolio</p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>실제 납품한 결과물</h2>
          </div>
          <div className="grid grid-cols-1 gap-8">

            {/* 01 — 로고 & 브랜드 브리프 */}
            <div style={{ background: "#FDF4F4", borderRadius: 20, padding: "24px 20px 20px", border: "1px solid #F5C6C6" }}>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#C6606022", color: "#C66060" }}>로고 &amp; 브랜드 브리프</span>
                <span className="text-[14px] font-bold text-[#111]">브랜드 아이덴티티 패키지</span>
                <span className="hidden sm:inline text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-jetbrains)" }}>Illustrator · Figma · Brand Brief</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  "/portfolio/logo-showcase/nudekind/brand-kit-board.svg",
                  "/portfolio/logo-showcase/vela-skin/brand-kit-board.svg",
                  "/portfolio/logo-showcase/salty-yuzu/brand-kit-board.svg",
                  "/portfolio/logo-showcase/danchae-table/brand-kit-board.svg",
                ].map((src, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 8, padding: "6px", border: "1px solid #F3F4F6", overflow: "hidden" }}>
                    <img src={src} alt="brand kit" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* 02 — 상세페이지 */}
            <div style={{ background: "#F0FDFA", borderRadius: 20, padding: "24px 20px 20px", border: "1px solid #99F6E4" }}>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#2DD4BF22", color: "#2DD4BF" }}>상세페이지</span>
                <span className="text-[14px] font-bold text-[#111]">프리미엄 밀키트 상세페이지</span>
                <span className="hidden sm:inline text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-jetbrains)" }}>Figma · Photoshop · HTML/CSS</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "3%" }}>
                <div style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
                  <div style={{ position: "absolute", top: "1.71%", left: "12.01%", width: "76.11%", height: "70.85%", overflow: "hidden", zIndex: 0 }}>
                    <div style={{ width: "100%", animation: "hubScroll 16s linear 0s infinite" }}>
                      <img src="/portfolio/detail-page/premium-mealkit/detail.png" alt="상세페이지" style={{ width: "100%", display: "block" }} />
                      <img src="/portfolio/detail-page/premium-mealkit/detail.png" aria-hidden="true" style={{ width: "100%", display: "block" }} />
                      <img src="/portfolio/detail-page/premium-mealkit/detail.png" aria-hidden="true" style={{ width: "100%", display: "block" }} />
                    </div>
                  </div>
                  <Image src="/mockups/monitor.png" alt="monitor" width={3072} height={2048} unoptimized style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))" }} />
                </div>
                <div style={{ flexShrink: 0, width: "30%", maxWidth: 260 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", top: "15.79%", left: "18.17%", width: "63.54%", height: "70.87%", overflow: "hidden", zIndex: 0 }}>
                      <div style={{ width: "100%", animation: "hubScroll 11s linear 0s infinite" }}>
                        <img src="/portfolio/detail-page/premium-mealkit/detail.png" alt="상세페이지 모바일" style={{ width: "100%", display: "block" }} />
                        <img src="/portfolio/detail-page/premium-mealkit/detail.png" aria-hidden="true" style={{ width: "100%", display: "block" }} />
                        <img src="/portfolio/detail-page/premium-mealkit/detail.png" aria-hidden="true" style={{ width: "100%", display: "block" }} />
                      </div>
                    </div>
                    <img src="/mockups/phone.png" alt="phone" style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 03 — PPT 디자인 */}
            <div style={{ background: "#EEF2FF", borderRadius: 20, padding: "24px 20px 20px", border: "1px solid #C7D2FE" }}>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#818CF822", color: "#818CF8" }}>PPT 디자인</span>
                <span className="text-[14px] font-bold text-[#111]">브랜드 제안서 덱</span>
                <span className="hidden sm:inline text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-jetbrains)" }}>PowerPoint · Figma</span>
              </div>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", top: "1.71%", left: "12.01%", width: "76.11%", height: "70.85%", overflow: "hidden", zIndex: 0 }}>
                  <div style={{ width: "100%", animation: "hubScroll 20s linear 3s infinite" }}>
                    {[
                      "/portfolio/ppt-design/brand-proposal/cover-slide.png",
                      "/portfolio/ppt-design/brand-proposal/sample-1.png",
                      "/portfolio/ppt-design/brand-proposal/sample-2.png",
                      "/portfolio/ppt-design/brand-proposal/cover-slide.png",
                      "/portfolio/ppt-design/brand-proposal/sample-1.png",
                      "/portfolio/ppt-design/brand-proposal/sample-2.png",
                      "/portfolio/ppt-design/brand-proposal/cover-slide.png",
                      "/portfolio/ppt-design/brand-proposal/sample-1.png",
                      "/portfolio/ppt-design/brand-proposal/sample-2.png",
                    ].map((src, i) => (
                      <img key={i} src={src} alt="PPT 슬라이드" aria-hidden={i > 0} style={{ width: "100%", display: "block" }} />
                    ))}
                  </div>
                </div>
                <Image src="/mockups/monitor.png" alt="monitor" width={3072} height={2048} unoptimized style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))" }} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 일하는 방식 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className="md:sticky md:top-24 text-center md:text-left">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>How We Work</p>
              <h2 className="font-bold text-[#111] mb-4" style={{ fontSize: "clamp(22px,3vw,36px)" }}>완성도 중심으로<br />일합니다</h2>
              <p className="text-[#6B7280] text-[13px] leading-[1.8] mb-6">
                다음 날 착수, 매일 진행 공유 — 원본 파일과 함께<br className="hidden md:block" />만족할 때까지 완성해 납품합니다
              </p>
              <div className="flex justify-center md:justify-start gap-6 mb-6 pb-6 border-b border-[#E5E7EB]">
                {[{ v: "1시간", l: "평균 응답" }, { v: "5일", l: "최대 납기" }].map((s) => (
                  <div key={s.l} className="text-center md:text-left">
                    <div className="font-bold text-[#111]" style={{ fontSize: "clamp(22px,2.5vw,30px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center md:justify-start">
                <Link href={`/${locale}/quote`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[13px] font-bold text-white bg-[#111] transition-all hover:-translate-y-0.5 hover:shadow-md">
                  제작 문의 →
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {HOW.map((h) => (
                <div key={h.no} className="flex items-start gap-4 p-5 rounded-xl border border-[#E5E7EB] hover:border-[#111] transition-colors bg-[#F9FAFB]">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0 bg-white border border-[#E5E7EB]">{h.icon}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#9CA3AF]" style={{ fontFamily: "var(--font-jetbrains)" }}>{h.no}</span>
                      <h3 className="text-[13px] font-bold text-[#111]">{h.title}</h3>
                    </div>
                    <p className="text-[12px] text-[#6B7280] leading-[1.7]">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 의뢰인 후기 ── */}
      <section style={{ background: "#0A0A0A" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14 md:py-18">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}>Reviews</p>
            <h2 className="font-bold text-white" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>의뢰인 후기</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className="rounded-xl p-5 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <span key={j} className="text-[#F59E0B] text-[13px]">★</span>
                  ))}
                </div>
                <p className="text-[13px] leading-[1.8] flex-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <div>
                    <p className="text-[12px] font-semibold text-white">{r.author}</p>
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.30)" }}>{r.service}</p>
                  </div>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white">
        <div className="max-w-[760px] mx-auto px-4 md:px-10 py-14 md:py-20">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>FAQ</p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>자주 묻는 질문</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F9FAFB] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-[13px] font-semibold text-[#111] pr-4">{faq.q}</span>
                  <span
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full border border-[#E5E7EB] text-[#111] text-[12px] transition-transform"
                    style={{ transform: openFaq === i ? "rotate(45deg)" : "none" }}
                  >+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 border-t border-[#F3F4F6]">
                    <p className="text-[12px] text-[#6B7280] leading-[1.8] pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline={<>디자인할 <span style={{ color: ACCENT }}>일</span>이 있나요?</>}
        sub="지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안"
        ctaLabel="제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
