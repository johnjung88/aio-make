"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";

const ACCENT = "#10B981";

const SUB_SERVICES = [
  {
    no: "01", id: "blog", title: "블로그 운영대행", en: "Blog Management",
    desc: "네이버·티스토리 — 월 8–12편 SEO 키워드 발굴부터 발행·추적까지",
    price: "₩390,000~/월", days: "월 10편 기준", tags: ["Naver Blog", "SEO", "GA4"],
    href: (l: string) => `/${l}/services/marketing`, soon: false, accent: "#10B981", bg: "#F0FDF4",
  },
  {
    no: "02", id: "sns", title: "SNS 운영대행", en: "SNS Management",
    desc: "인스타·릴스·틱톡 — 월 20–30컷 컨셉·촬영·편집·발행·반응 분석",
    price: "₩490,000~/월", days: "월 25컷 기준", tags: ["Instagram", "TikTok", "Reels"],
    href: (l: string) => `/${l}/services/marketing`, soon: false, accent: "#F472B6", bg: "#FDF2F8",
  },
  {
    no: "03", id: "video-ch", title: "영상채널 운영대행", en: "Video Channel Ops",
    desc: "유튜브·숏폼 — 월 4–8편 기획·촬영·편집·자막·썸네일·분석",
    price: "₩590,000~/월", days: "월 6편 기준", tags: ["YouTube", "Shorts", "편집"],
    href: (l: string) => `/${l}/services/marketing`, soon: false, accent: "#FB923C", bg: "#FFF7ED",
  },
  {
    no: "04", id: "ad", title: "광고 운영대행", en: "Ad Management",
    desc: "Meta·카카오·네이버 광고 — 예산 설정·소재 제작·성과 최적화, 준비 중",
    price: "준비 중", days: "", tags: ["Meta Ads", "Kakao", "Naver"],
    href: () => "#", soon: true, accent: "#9CA3AF", bg: "#F9FAFB",
  },
];

const HOW = [
  { no: "01", title: "주간 리포트", desc: "매주 월요일 KPI 표를 공유합니다 — 방문자·도달·전환 데이터를 실제 수치 그대로", icon: "📊" },
  { no: "02", title: "월 종합 + 다음 달 계획", desc: "월말 종합 리포트와 다음 달 운영 방향을 함께 제안합니다", icon: "📋" },
  { no: "03", title: "데이터 기반 운영", desc: "GA4·서치콘솔·픽셀 연동 — 감이 아닌 데이터로 판단합니다", icon: "📈" },
  { no: "04", title: "월 단위 유연 계약", desc: "최소 3개월 운영 / 해지 30일 전 통보 — 불필요한 장기 구속 없이", icon: "🤝" },
];


const REVIEWS = [
  { stars: 5, text: "블로그 운영 시작 3개월 만에 네이버 검색 유입이 4배 늘었어요 — 키워드 선정부터 글 퀄리티까지 모두 만족합니다", author: "정*연", service: "블로그 운영대행", date: "2026.04" },
  { stars: 5, text: "인스타 릴스 운영 후 팔로워가 2배 늘고 DM 문의도 확실히 늘었습니다 — 매주 리포트 보내줘서 진행 상황이 한눈에 보여요", author: "한*미", service: "SNS 운영대행", date: "2026.03" },
  { stars: 5, text: "유튜브 채널 운영 맡기고 구독자 1,000명 돌파했습니다 — 영상 퀄리티와 썸네일 모두 기대 이상이었어요", author: "윤*석", service: "영상채널 운영대행", date: "2026.05" },
];

const FAQS = [
  { q: "최소 계약 기간이 있나요?", a: "최소 3개월 운영을 권장합니다 — 콘텐츠 마케팅은 꾸준함이 핵심이라 단기 계약보다 3개월 이상 운영했을 때 유의미한 성과가 나타납니다" },
  { q: "월별 발행 수량은 협의 가능한가요?", a: "네 — 기준 수량은 플랜별로 다르며 예산에 맞게 발행 수를 조정한 맞춤 견적도 가능합니다" },
  { q: "콘텐츠 아이디어는 누가 내나요?", a: "AIO 팀이 키워드 리서치와 트렌드 분석을 바탕으로 콘텐츠 방향을 제안합니다 — 의뢰인의 피드백을 반영해 최종 방향을 확정합니다" },
  { q: "기존 계정에 이어서 운영 가능한가요?", a: "가능합니다 — 기존 계정 분석 후 현재 상태에 맞는 운영 전략을 수립해 이어서 진행합니다" },
  { q: "성과 측정은 어떻게 하나요?", a: "GA4·네이버 서치콘솔·Meta 픽셀·유튜브 스튜디오 등 플랫폼별 공식 지표를 기준으로 매주 리포트를 제공합니다" },
  { q: "결제 방식은 어떻게 되나요?", a: "월 초 계좌이체로 진행합니다 — 첫 달은 착수 확인 후 다음 날 운영을 시작합니다" },
];

const STACK = ["Naver Blog", "Instagram", "TikTok", "YouTube", "GA4", "Meta Ads", "서치콘솔"];

export function MarketingHub({ locale }: { locale: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="marketing" active="service" />

      {/* ── Hero — 그라디언트 다크 배경 ── */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden" style={{ background: "#050D09" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 30% 40%, rgba(16,185,129,0.18) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(16,185,129,0.08) 0%, transparent 60%)" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to top, #fff 0%, transparent 100%)" }} />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-28 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10 items-center">
          <div className="text-center md:text-left">
            <p
              className="text-[11px] font-semibold tracking-[0.28em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains)" }}
            >
              Marketing · 마케팅 운영대행
            </p>
            <h1
              className="font-bold leading-[1.02] tracking-tight text-white mb-5"
              style={{ fontSize: "clamp(30px,5.5vw,72px)" }}
            >
              유입의 답은<br /><span style={{ color: ACCENT }}>꾸준함</span>입니다
            </h1>
            <p
              className="leading-[1.8] mb-8"
              style={{ fontSize: "clamp(14px,1.1vw,16px)", color: "rgba(255,255,255,0.6)" }}
            >
              블로그·SNS·영상채널 — 매일 보이는 것이<br className="hidden md:block" />한 달 뒤의 매출이 됩니다
            </p>
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
              {["주간 KPI 리포트", "데이터 기반 운영", "월 단위 계약", "GA4 연동 포함"].map((b) => (
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
                운영 문의 →
              </Link>
            </div>
            <div className="flex justify-center md:justify-start gap-6 sm:gap-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              {[{ v: "+42%", l: "평균 유입 증가" }, { v: "3개월", l: "성과 기준" }, { v: "주 1회", l: "KPI 리포트" }].map((s) => (
                <div key={s.l} className="text-center md:text-left">
                  <div className="font-bold text-white leading-none" style={{ fontSize: "clamp(20px,2.5vw,30px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                  <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: KPI 미리보기 블록 */}
          <div
            className="hidden md:block rounded-xl overflow-hidden"
            style={{ background: "rgba(5,13,9,0.90)", border: "1px solid rgba(16,185,129,0.15)" }}
          >
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(16,185,129,0.12)", background: "rgba(16,185,129,0.05)" }}>
              <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "var(--font-jetbrains)" }}>module / live-kpis</span>
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT }} /> LIVE
              </span>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "평균 방문자", value: "128,420", delta: "▲ +42%", color: ACCENT },
                { label: "평균 전환율", value: "3.84%", delta: "▲ +0.9pt", color: ACCENT },
                { label: "평균 CPC", value: "₩318", delta: "▼ −22%", color: "#F472B6" },
                { label: "평균 ROAS", value: "412%", delta: "▲ +1.4×", color: ACCENT },
              ].map((kpi) => (
                <div key={kpi.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "var(--font-jetbrains)" }}>{kpi.label}</span>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-white" style={{ fontFamily: "var(--font-jetbrains)" }}>{kpi.value}</div>
                    <div className="text-[10px]" style={{ color: kpi.color }}>{kpi.delta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 채널 스택 strip ── */}
      <div style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span
            className="text-[9px] font-bold tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}
          >
            Channels & Tools
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
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(22px,3vw,36px)" }}>네 가지 마케팅 서비스</h2>
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
                    <h3 className="font-bold text-[#111] mb-0.5 sm:mb-1 text-[15px] sm:text-[clamp(16px,1.6vw,20px)]">{s.title}</h3>
                    <p className="hidden sm:block text-[11px] text-[#9CA3AF] mb-3" style={{ fontFamily: "var(--font-jetbrains)" }}>{s.en}</p>
                    <p className="hidden sm:block text-[13px] text-[#6B7280] leading-[1.7] mb-4">{s.desc}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-5">
                      {s.tags.map((tag) => (
                        <span key={tag} className="text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-md" style={{ background: s.accent + "12", color: s.accent }}>{tag}</span>
                      ))}
                    </div>
                    {!s.soon && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-[#F3F4F6] gap-0.5 sm:gap-0">
                        <span className="font-bold text-[15px] sm:text-[clamp(14px,1.4vw,18px)]" style={{ color: s.accent, fontFamily: "var(--font-jetbrains)" }}>{s.price}</span>
                        <span className="text-[10px] sm:text-[11px] text-[#9CA3AF]">{s.days}</span>
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
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>실제 운영한 결과물</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {([
              { label: "블로그 운영", title: "네이버 블로그 운영대행", stack: "Naver Blog · SEO · GA4", accent: "#10B981", bg: "#F0FDF4", border: "#BBF7D0", desktop: "/portfolio/blogautopilot-multinational/published-post-ko.png", delay: "0s" },
              { label: "SNS 운영", title: "인스타그램 운영대행", stack: "Instagram · Reels · Meta Ads", accent: "#F472B6", bg: "#FDF2F8", border: "#FBCFE8", desktop: "/images/portfolio/ws-all-desktop.png", delay: "3s" },
              { label: "유튜브 운영", title: "유튜브 채널 운영대행", stack: "YouTube · Shorts · 썸네일", accent: "#FB923C", bg: "#FFF7ED", border: "#FED7AA", desktop: "/images/portfolio/ws-shop-desktop.png", delay: "6s" },
            ] as const).map((set) => (
              <div key={set.label} style={{ background: set.bg, borderRadius: 20, padding: "20px 16px 16px", border: `1px solid ${set.border}` }}>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: set.accent + "22", color: set.accent }}>{set.label}</span>
                  <span className="text-[13px] font-bold text-[#111]">{set.title}</span>
                </div>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: "1.71%", left: "12.01%", width: "76.11%", height: "70.85%", overflow: "hidden", zIndex: 0 }}>
                    <div style={{ width: "100%", animation: `hubScroll 16s linear ${set.delay} infinite` }}>
                      <img src={set.desktop} alt={set.title} style={{ width: "100%", display: "block" }} />
                      <img src={set.desktop} aria-hidden="true" style={{ width: "100%", display: "block" }} />
                      <img src={set.desktop} aria-hidden="true" style={{ width: "100%", display: "block" }} />
                    </div>
                  </div>
                  <Image src="/mockups/monitor.png" alt="monitor" width={3072} height={2048} unoptimized style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))" }} />
                </div>
                <p className="text-[10px] text-[#9CA3AF] mt-2 text-center" style={{ fontFamily: "var(--font-jetbrains)" }}>{set.stack}</p>
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
              <h2 className="font-bold text-[#111] mb-4" style={{ fontSize: "clamp(22px,3vw,36px)" }}>데이터로 증명하며<br />운영합니다</h2>
              <p className="text-[#6B7280] text-[13px] leading-[1.8] mb-6">
                감이 아닌 수치 — 매주 KPI를 공유하고<br className="hidden md:block" />측정된 결과로만 다음 방향을 결정합니다
              </p>
              <div className="flex justify-center md:justify-start gap-6 mb-6 pb-6 border-b border-[#E5E7EB]">
                {[{ v: "주 1회", l: "KPI 리포트" }, { v: "3개월", l: "성과 기준" }].map((s) => (
                  <div key={s.l} className="text-center md:text-left">
                    <div className="font-bold text-[#111]" style={{ fontSize: "clamp(22px,2.5vw,30px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center md:justify-start">
                <Link href={`/${locale}/quote`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[13px] font-bold text-white bg-[#111] transition-all hover:-translate-y-0.5 hover:shadow-md">
                  운영 문의 →
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
        headline={<>꾸준히 보이는 <span style={{ color: ACCENT }}>운영</span>이 필요한가요?</>}
        sub="지금 문의하면 24시간 안에 견적 · 1주 안에 첫 발행"
        ctaLabel="운영 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
