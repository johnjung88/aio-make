"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

function hubPrice(id: string): string {
  return servicesData.find((s) => s.id === id)?.pricing[0]?.eventPrice ?? "별도 견적";
}

const ACCENT = "#C8A24A";

const SUB_SERVICES = [
  {
    no: "01", id: "website", title: "웹사이트", en: "Website",
    desc: "랜딩페이지·회사 홈페이지·서비스 사이트 — 스크롤을 멈추게 만드는 완성형 홈페이지",
    price: hubPrice("website"), days: "결제 후 5일 내", tags: ["Next.js", "WordPress", "카페24"],
    href: (l: string) => `/${l}/services/website`, soon: false, accent: "#4DD4AC", bg: "#EEF9F5",
  },
  {
    no: "02", id: "shopping-mall", title: "쇼핑몰", en: "Shopping Mall",
    desc: "카페24·독립몰 구축 — 상품 등록·결제 연동·GA4·광고 픽셀까지 한 번에",
    price: hubPrice("shopping-mall"), days: "결제 후 5일 내", tags: ["카페24", "결제연동", "GA4·픽셀"],
    href: (l: string) => `/${l}/services/shopping-mall`, soon: false, accent: "#FB923C", bg: "#FFF7ED",
  },
  {
    no: "03", id: "automation-app", title: "자동화·프로그램", en: "Automation & Program",
    desc: "엑셀·크롤링·알림·매크로·데스크탑 프로그램 — 반복 업무를 코드에게",
    price: hubPrice("automation-app"), days: "결제 후 5일 내", tags: ["Python", "n8n", "Electron"],
    href: (l: string) => `/${l}/services/automation-app`, soon: false, accent: "#818CF8", bg: "#F5F3FF",
  },
  {
    no: "04", id: "app", title: "앱", en: "Mobile App",
    desc: "iOS·Android 네이티브 앱 및 크로스플랫폼 개발 — 현재 준비 중",
    price: "준비 중", days: "", tags: ["React Native", "Flutter"],
    href: () => "#", soon: true, accent: "#9CA3AF", bg: "#F9FAFB",
  },
];

const HOW = [
  { no: "01", title: "투명한 진행", desc: "작업 상황을 매일 공유 — 카카오톡 채널로 실시간 소통", icon: "💬" },
  { no: "02", title: "운영 가능한 납품", desc: "시안이 아닌 완성품으로 납품 — 받는 즉시 운영할 수 있는 결과물", icon: "✅" },
  { no: "03", title: "빠른 속도", desc: "의뢰 후 1–5일 납품 — 다음 날 착수, 매일 중간 공유", icon: "⚡" },
  { no: "04", title: "책임 A/S", desc: "납품 후 1달 무상 유지보수 — 오류·수정 모두 책임", icon: "🛡️" },
];


const REVIEWS = [
  { stars: 5, text: "생각보다 훨씬 빠르게 완성됐고 퀄리티도 기대 이상이었어요 — 요청한 내용 100% 반영해주셨습니다", author: "이*진", service: "웹사이트 제작", date: "2026.04" },
  { stars: 5, text: "카페24 쇼핑몰 세팅부터 상품 등록, GA4까지 한 번에 처리해주셔서 정말 편했습니다 — 오픈 후 바로 광고 돌릴 수 있었어요", author: "박*수", service: "쇼핑몰 구축", date: "2026.03" },
  { stars: 5, text: "매일 엑셀 정리하던 걸 자동화로 해결했습니다 — 하루 2시간씩 아끼고 있어요, 코드 설명도 친절하게 해주셨습니다", author: "최*영", service: "업무 자동화", date: "2026.05" },
];

const FAQS = [
  { q: "제작 기간이 얼마나 걸리나요?", a: "웹사이트·쇼핑몰 기본 작업은 결제 후 5일 내 완성이 기준입니다. 자동화 프로그램은 1–7일이 기준이며, 기능형(예약·결제·회원 등)은 범위에 따라 별도 협의합니다." },
  { q: "수정은 몇 번까지 가능한가요?", a: "기본 수정 1회가 포함됩니다. 납품 후 작업 범위 내 오류·누락은 무상으로 처리하며, 이후 추가 수정은 별도 견적으로 진행합니다." },
  { q: "도메인·호스팅도 포함인가요?", a: "도메인과 호스팅은 기본 패키지에 포함되지 않으며 별도 구매가 필요합니다 — 구매 후 연결 세팅은 모두 지원드립니다" },
  { q: "결제·예약·회원가입 기능도 만들 수 있나요?", a: "가능합니다 — 다만 해당 기능은 기본 패키지 외 별도 견적으로 진행되며 필요한 기능을 말씀해주시면 정확한 비용을 안내드립니다" },
  { q: "착수금은 얼마이고 어떻게 결제하나요?", a: "착수 시 50%, 납품 시 나머지 50%를 계좌이체로 진행하며 견적 확정 후 착수금 입금이 확인되면 다음 날 작업을 시작합니다" },
  { q: "납품 후 유지보수는 어떻게 되나요?", a: "납품 후 1달간 무상 A/S를 제공합니다 — 오류 수정, 사소한 텍스트·이미지 교체는 무상으로 처리하며 이후 추가 수정·기능 추가는 별도 견적으로 진행합니다" },
];

const STACK = ["Next.js", "React", "Python", "Node.js", "n8n", "Electron", "카페24", "WordPress"];

export function DevelopmentServices({ locale }: { locale: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero — 전체 화면 다크 이미지 배경 ── */}
      <section className="relative min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <Image
          src="/images/services/development-hero.png"
          alt="AIO 개발팀"
          fill
          className="object-cover object-center"
          priority
          quality={100}
          unoptimized
        />
        {/* 오버레이 — 좌측 강하게, 우측 이미지 살림 */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(105deg, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.80) 42%, rgba(10,10,10,0.40) 100%)" }}
        />
        {/* 하단 화이트 페이드 */}
        <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to top, #fff 0%, transparent 100%)" }} />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-28 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10 items-center">

          {/* 좌: 헤드라인 + CTA */}
          <div className="text-center md:text-left">
            <p
              className="text-[11px] font-semibold tracking-[0.28em] uppercase mb-5"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-jetbrains)" }}
            >
              Development · 개발 서비스
            </p>
            <h1
              className="font-bold leading-[1.02] tracking-tight text-white mb-5"
              style={{ fontSize: "clamp(30px,5.5vw,72px)" }}
            >
              <span style={{ color: ACCENT }}>코드</span>로 만드는<br className="hidden md:block" />{" "}모든 것
            </h1>
            <p
              className="leading-[1.8] mb-8"
              style={{ fontSize: "clamp(14px,1.1vw,16px)", color: "rgba(255,255,255,0.6)" }}
            >
              시안이 아닌 완성품 — 받는 즉시 운영하는 코드<br />
              <span style={{ opacity: 0.7, fontFamily: "var(--font-jetbrains)", letterSpacing: "0.04em" }}>
                {'< 웹사이트 · 쇼핑몰 · 자동화 · 프로그램 >'}
              </span>
            </p>
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
              {["5일 납품 보장", "98% 재의뢰율", "1시간 응답", "1달 무상 A/S"].map((b) => (
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
            {/* 하단 수치 */}
            <div className="flex justify-center md:justify-start gap-6 sm:gap-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              {[{ v: "142", l: "누적 의뢰" }, { v: "5일", l: "평균 납기" }, { v: "98%", l: "재의뢰율" }].map((s) => (
                <div key={s.l} className="text-center md:text-left">
                  <div className="font-bold text-white leading-none" style={{ fontSize: "clamp(20px,2.5vw,30px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                  <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: 코드 터미널 블록 (데스크탑 전용) */}
          <div
            className="hidden md:block rounded-xl overflow-hidden"
            style={{ background: "rgba(10,10,10,0.85)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            {/* 터미널 헤더 */}
            <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" }}>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28CA41]" />
              <span className="ml-3 text-[10px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}>aio-build.config.js</span>
            </div>
            {/* 코드 */}
            <pre
              className="p-5 text-[12px] leading-[1.9]"
              style={{ fontFamily: "var(--font-jetbrains)", color: "rgba(255,255,255,0.75)" }}
            >{`// AIO 개발팀에 맡기면
const project = {
  type: "website" | "shop" | "auto",
  deadline: "≤ 5days",
  response: "< 1hour",
  revision: "guaranteed",
  warranty: "14days",
};

// 다음 날 착수
await aio.build(project);
//  ✓ 완성품 납품`}</pre>
          </div>
        </div>
      </section>

      {/* ── 기술 스택 strip ── */}
      <div style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span
            className="text-[9px] font-bold tracking-[0.25em] uppercase"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-jetbrains)" }}
          >
            Tech Stack
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
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(22px,3vw,36px)" }}>네 가지 개발 서비스</h2>
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
        @keyframes devScrollDesktop {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes devScrollMobile {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
      `}</style>
      <section style={{ background: "#F2F2F2", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14">

          {/* 헤더 — 모바일 가운데 정렬 */}
          <div className="text-center md:text-left mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-2" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>Portfolio</p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(20px,2.5vw,32px)" }}>실제 납품한 결과물</h2>
          </div>

          {/* 2 세트 */}
          <div className="grid grid-cols-1 gap-8">
            {([
              { label: "웹사이트", title: "자연한의원", stack: "Next.js · Vercel · 병원·의료", accent: "#4DD4AC", bg: "#EEF9F5", border: "#D1FAE5", desktop: "/images/portfolio/ws-clinic-scroll.png",  mobile: "/images/portfolio/ws-clinic-scroll.png",  delay: "0s" },
              { label: "쇼핑몰",   title: "셰프밀 밀키트", stack: "카페24 · GA4 · Meta픽셀",   accent: "#FB923C", bg: "#FFF7ED", border: "#FED7AA", desktop: "/images/portfolio/ws-mealkit-scroll.png", mobile: "/images/portfolio/ws-mealkit-scroll.png", delay: "5s" },
            ] as const).map((set) => (
              <div key={set.label} style={{ background: set.bg, borderRadius: 20, padding: "24px 20px 20px", border: `1px solid ${set.border}` }}>

                {/* 세트 헤더 */}
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: set.accent + "22", color: set.accent }}>{set.label}</span>
                  <span className="text-[14px] font-bold text-[#111]">{set.title}</span>
                  <span className="hidden sm:inline text-[11px] text-[#9CA3AF]" style={{ fontFamily: "var(--font-jetbrains)" }}>{set.stack}</span>
                </div>

                {/* PC + 모바일 목업 행 */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "3%" }}>

                  {/* 모니터 (PC) — flex 1 */}
                  <div style={{ flex: "1 1 0", minWidth: 0, position: "relative" }}>
                    {/* 스크롤 콘텐츠: 2장 복제 + translateY(-50%) seamless loop */}
                    <div style={{
                      position: "absolute", top: "1.71%", left: "12.01%",
                      width: "76.11%", height: "70.85%",
                      overflow: "hidden", zIndex: 0,
                    }}>
                      <div style={{ width: "100%", animation: `devScrollDesktop 16s linear ${set.delay} infinite` }}>
                        <img src={set.desktop} alt={set.title} style={{ width: "100%", display: "block" }} />
                        <img src={set.desktop} alt="" aria-hidden="true" style={{ width: "100%", display: "block" }} />
                      </div>
                    </div>
                    <Image src="/mockups/monitor.png" alt="monitor" width={3072} height={2048} unoptimized
                      style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1,
                        filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))" }} />
                  </div>

                  {/* 폰 (모바일) — 고정 너비 23% */}
                  <div style={{ flexShrink: 0, width: "30%", maxWidth: 260 }}>
                    <div style={{ position: "relative" }}>
                      {/* 스크롤 콘텐츠: 3장 복제 + translateY(-33.33%) seamless loop */}
                      <div style={{
                        position: "absolute", top: "15.79%", left: "18.17%",
                        width: "63.54%", height: "70.87%",
                        overflow: "hidden", zIndex: 0,
                      }}>
                        <div style={{ width: "100%", animation: `devScrollMobile 11s linear ${set.delay} infinite` }}>
                          <img src={set.mobile} alt={set.title + " 모바일"} style={{ width: "100%", display: "block" }} />
                          <img src={set.mobile} alt="" aria-hidden="true" style={{ width: "100%", display: "block" }} />
                          <img src={set.mobile} alt="" aria-hidden="true" style={{ width: "100%", display: "block" }} />
                        </div>
                      </div>
                      <img src="/mockups/phone.png" alt="phone"
                        style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1,
                          filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.22))" }} />
                    </div>
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
              <h2 className="font-bold text-[#111] mb-4" style={{ fontSize: "clamp(22px,3vw,36px)" }}>결과물 중심으로<br />일합니다</h2>
              <p className="text-[#6B7280] text-[13px] leading-[1.8] mb-6">
                다음 날 착수, 매일 진행 공유<br /> — 시안이 아닌 받는 즉시 운영 가능한 완성품으로만 납품합니다
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
        headline={<><span style={{ color: ACCENT }}>코드</span>로 만들 일이 있나요?</>}
        sub="지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물"
        ctaLabel="제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
