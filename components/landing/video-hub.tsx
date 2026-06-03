"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";

const ACCENT = "#F59E0B";

const SUB_SERVICES = [
  {
    no: "01", id: "shortform", title: "SNS 숏폼", en: "SNS Short-form",
    desc: "인스타 릴스·틱톡·페이스북 릴스 — 첫 3초에 멈추고 끝까지 보게 만드는 컷",
    price: "₩150,000~/편", days: "3–5일", tags: ["Instagram", "TikTok", "Reels"],
    href: (l: string) => `/${l}/services/video`, soon: false, accent: "#F472B6", bg: "#FDF2F8",
  },
  {
    no: "02", id: "youtube", title: "유튜브 채널", en: "YouTube Channel",
    desc: "기획·촬영·편집·자막·썸네일 — 구독과 체류 시간을 끌어올리는 채널 운영",
    price: "₩290,000~/편", days: "5–7일", tags: ["YouTube", "Shorts", "4K"],
    href: (l: string) => `/${l}/services/video`, soon: false, accent: "#EF4444", bg: "#FEF2F2",
  },
  {
    no: "03", id: "brand", title: "브랜드 영상", en: "Brand Video",
    desc: "제품·서비스·IR 소개 영상 — 브랜드 세계관을 한 컷에 담는 풀 프로덕션",
    price: "₩490,000~/편", days: "7–14일", tags: ["촬영", "편집", "4K", "색보정"],
    href: (l: string) => `/${l}/services/video`, soon: false, accent: ACCENT, bg: "#FFFBEB",
  },
  {
    no: "04", id: "package", title: "촬영 패키지", en: "Shoot Package",
    desc: "스튜디오·현장 촬영 + 편집 세트 패키지 — 현재 준비 중",
    price: "준비 중", days: "", tags: ["스튜디오", "현장촬영", "드론"],
    href: () => "#", soon: true, accent: "#9CA3AF", bg: "#F9FAFB",
  },
];

const HOW = [
  { no: "01", title: "레퍼런스 합의", desc: "방향과 레퍼런스를 먼저 시안으로 합의 — 촬영 전 콘티 확인까지", icon: "🎬" },
  { no: "02", title: "러프 컷 공유", desc: "구조와 호흡을 먼저 확인 — 방향이 맞으면 파인 컷으로 넘어갑니다", icon: "✂️" },
  { no: "03", title: "파인 컷 완성", desc: "컬러 그레이딩·자막·음악 믹스 — 플랫폼 최적 포맷으로 다듬습니다", icon: "🎨" },
  { no: "04", title: "마스터 납품", desc: "4K 원본 + 소스 파일 함께 전달 — 추후 재편집·재활용 가능하게", icon: "📦" },
];


const REVIEWS = [
  { stars: 5, text: "릴스 올리고 나서 팔로워가 2주 만에 2,000명 넘게 늘었어요 — 첫 3초 후킹이 진짜 다르다는 게 느껴졌습니다", author: "김*현", service: "SNS 숏폼 제작", date: "2026.04" },
  { stars: 5, text: "브랜드 소개 영상 반응이 완전히 달라졌어요 — 투자자 미팅에서 영상 하나로 분위기가 바뀌었습니다", author: "이*준", service: "브랜드 영상 제작", date: "2026.03" },
  { stars: 5, text: "유튜브 채널 운영 맡기고 조회수가 꾸준히 오르고 있어요 — 썸네일 퀄리티가 확실히 다르고 편집 속도도 빠릅니다", author: "박*서", service: "유튜브 채널 영상", date: "2026.05" },
];

const FAQS = [
  { q: "제작 기간이 얼마나 걸리나요?", a: "영상 종류에 따라 다릅니다 — SNS 숏폼 3–5일, 유튜브 영상 5–7일, 브랜드 영상 7–14일이 기준이며 촬영 유무에 따라 납기가 달라집니다" },
  { q: "촬영이 포함되나요?", a: "기본 패키지는 편집 중심으로 구성되어 있으며 촬영이 필요한 경우 별도 견적으로 안내드립니다 — 소스 영상이 있으면 편집만도 가능합니다" },
  { q: "원본 파일도 받을 수 있나요?", a: "네 — 4K 마스터 파일과 편집 소스 파일을 함께 납품합니다 — 추후 재편집·재활용이 가능합니다" },
  { q: "플랫폼별 비율로 납품 가능한가요?", a: "가능합니다 — 인스타 릴스(9:16), 유튜브(16:9), 유튜브 숏츠(9:16) 등 플랫폼에 맞는 비율로 컷 버전을 함께 제공합니다" },
  { q: "수정은 몇 번까지 가능한가요?", a: "러프 컷 확인 후 2차 수정까지 기본으로 포함됩니다 — 방향이 크게 바뀌는 경우 추가 비용이 발생할 수 있습니다" },
  { q: "착수금은 어떻게 되나요?", a: "착수 시 50%, 납품 시 나머지 50%를 계좌이체로 진행합니다" },
];

const STACK = ["Premiere Pro", "After Effects", "DaVinci Resolve", "Final Cut Pro", "CapCut", "Photoshop"];

export function VideoHub({ locale }: { locale: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="video" active="service" />

      {/* ── Hero — 시네마 다크 배경 ── */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden" style={{ background: "#060402" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 55% at 35% 45%, rgba(245,158,11,0.20) 0%, transparent 65%), radial-gradient(ellipse 45% 40% at 75% 65%, rgba(239,68,68,0.08) 0%, transparent 60%)" }}
        />
        {/* 하단 화이트 페이드 */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to top, #fff 0%, transparent 100%)" }} />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-28 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10 items-center">
          <div className="text-center md:text-left">
            <p
              className="text-[11px] font-semibold tracking-[0.28em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains)" }}
            >
              Video · 영상 제작
            </p>
            <h1
              className="font-bold leading-[1.02] tracking-tight text-white mb-5"
              style={{ fontSize: "clamp(30px,5.5vw,72px)" }}
            >
              한 <span style={{ color: ACCENT }}>컷</span>이<br />전부입니다
            </h1>
            <p
              className="leading-[1.8] mb-8"
              style={{ fontSize: "clamp(14px,1.1vw,16px)", color: "rgba(255,255,255,0.6)" }}
            >
              브랜드·SNS·마케팅·유튜브<br className="hidden md:block" />
              첫 3초가 계속 볼지를 결정합니다
            </p>
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
              {["5일 납품 보장", "4K 원본 제공", "플랫폼 최적화", "소스 파일 포함"].map((b) => (
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
                제작 문의 ▶
              </Link>
            </div>
            <div className="flex justify-center md:justify-start gap-6 sm:gap-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              {[{ v: "80+", l: "누적 납품" }, { v: "5일", l: "평균 납기" }, { v: "4K", l: "최대 해상도" }].map((s) => (
                <div key={s.l} className="text-center md:text-left">
                  <div className="font-bold text-white leading-none" style={{ fontSize: "clamp(20px,2.5vw,30px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                  <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: 제작 타임라인 블록 */}
          <div
            className="hidden md:block rounded-xl overflow-hidden"
            style={{ background: "rgba(6,4,2,0.90)", border: "1px solid rgba(245,158,11,0.18)" }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(245,158,11,0.12)", background: "rgba(245,158,11,0.05)" }}>
              <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "var(--font-jetbrains)" }}>aio-video.timeline</span>
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "#EF4444", fontFamily: "var(--font-jetbrains)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> ● REC
              </span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { tc: "00:00", label: "레퍼런스·콘티", color: ACCENT },
                { tc: "01:00", label: "러프 컷", color: ACCENT },
                { tc: "02:00", label: "파인 컷·색보정", color: ACCENT },
                { tc: "03:00", label: "마스터 납품", color: ACCENT },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-[10px] w-12 flex-shrink-0" style={{ color: step.color, fontFamily: "var(--font-jetbrains)" }}>{step.tc}</span>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: step.color }} />
                  <span className="text-[12px] font-medium text-white">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 편집 툴 strip ── */}
      <div style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span
            className="text-[9px] font-bold tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}
          >
            Edit Tools
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

      {/* ── 4 서비스 카드 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14 md:py-20">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>Services</p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(22px,3vw,36px)" }}>네 가지 영상 서비스</h2>
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
      <section style={{ background: "#F2F2F2", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14">
          <div className="text-center md:text-left mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>Portfolio</p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>실제 납품한 결과물</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 justify-items-center">
            {([
              { label: "브랜드 소개 영상", title: "서비스 소개", accent: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", src: "/videos/brand-intro.mp4", poster: "/portfolio/video-content-samples/brand-shorts.png" },
              { label: "제품 광고 영상", title: "제품 광고", accent: "#EF4444", bg: "#FEF2F2", border: "#FECACA", src: "/videos/product-ad.mp4", poster: "/portfolio/video-content-samples/brand-shorts.png" },
              { label: "인플루언서 숏폼", title: "숏폼 영상", accent: "#F472B6", bg: "#FDF2F8", border: "#FBCFE8", src: "/videos/influencer-shortform.mp4", poster: "/portfolio/video-content-samples/brand-shorts.png" },
            ] as const).map((item) => (
              <div key={item.label} style={{ width: "100%", maxWidth: 320 }}>
                <div style={{ background: item.bg, borderRadius: 20, padding: "20px 16px 24px", border: `1px solid ${item.border}` }}>
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: item.accent + "22", color: item.accent }}>{item.label}</span>
                    <span className="text-[13px] font-bold text-[#111]">{item.title}</span>
                  </div>
                  <div style={{ position: "relative", maxWidth: 240, margin: "0 auto" }}>
                    <div style={{ position: "absolute", top: "15.79%", left: "18.17%", width: "63.54%", height: "70.87%", overflow: "hidden", zIndex: 0, borderRadius: "2px", background: "#000" }}>
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={item.poster}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      >
                        <source src={item.src} type="video/mp4" />
                      </video>
                    </div>
                    <img src="/mockups/phone.png" alt="phone" style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 일하는 방식 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className="md:sticky md:top-24 text-center md:text-left">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>How We Work</p>
              <h2 className="font-bold text-[#111] mb-4" style={{ fontSize: "clamp(22px,3vw,36px)" }}>컷 중심으로<br />일합니다</h2>
              <p className="text-[#6B7280] text-[13px] leading-[1.8] mb-6">
                레퍼런스 합의 → 러프 컷 → 파인 컷 → 마스터<br className="hidden md:block" />단계마다 확인하고 다음 단계로 넘어갑니다
              </p>
              <div className="flex justify-center md:justify-start gap-6 mb-6 pb-6 border-b border-[#E5E7EB]">
                {[{ v: "1시간", l: "평균 응답" }, { v: "5일", l: "평균 납기" }].map((s) => (
                  <div key={s.l} className="text-center md:text-left">
                    <div className="font-bold text-[#111]" style={{ fontSize: "clamp(22px,2.5vw,30px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center md:justify-start">
                <Link href={`/${locale}/quote`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[13px] font-bold text-white bg-[#111] transition-all hover:-translate-y-0.5 hover:shadow-md">
                  제작 문의 ▶
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
        headline={<>찍을 <span style={{ color: ACCENT }}>한 컷</span>이 있나요?</>}
        sub="지금 문의하면 24시간 안에 견적 · 5일 안에 첫 컷"
        ctaLabel="제작 문의 ▶"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
