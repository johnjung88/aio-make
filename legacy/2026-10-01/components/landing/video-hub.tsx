"use client";

import { useState } from "react";
import Link from "next/link";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";

const ACCENT = "#F59E0B";

const SUB_SERVICES = [
  {
    no: "01", id: "shortform", title: "SNS 숏폼", en: "SNS Short-form",
    desc: "고객 자료 + AI 영상 모델로 제작하는 세로형 숏폼 — 인스타 릴스·유튜브 쇼츠·틱톡·네이버 클립용",
    price: "₩49,000~/편", days: "3–5일", tags: ["Instagram", "TikTok", "Reels"],
    href: (l: string) => `/${l}/services/video`, soon: false, accent: "#F472B6", bg: "#FDF2F8",
  },
  {
    no: "02", id: "youtube", title: "유튜브 채널", en: "YouTube Channel",
    desc: "기획·촬영·편집·자막·썸네일 — 구독과 체류 시간을 끌어올리는 채널 운영",
    price: "₩79,000~/편", days: "5–7일", tags: ["YouTube", "Shorts", "4K"],
    href: (l: string) => `/${l}/services/video`, soon: false, accent: "#EF4444", bg: "#FEF2F2",
  },
  {
    no: "03", id: "brand", title: "브랜드 영상", en: "Brand Video",
    desc: "AI 영상 모델 + 고객 자료 기반으로 쇼핑몰·상세페이지·홈페이지에 쓸 홍보영상을 빠르게 제작",
    price: "₩349,000~/편", days: "7–14일", tags: ["촬영", "편집", "4K", "색보정"],
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
  { no: "01", title: "고객 자료 확인", desc: "제품 사진·기존 영상·로고·상품 설명·브랜드 컬러·참고 영상을 받아 제작 범위를 확인합니다", icon: "📋" },
  { no: "02", title: "영상 방향 정리", desc: "활용 채널·영상 길이·주요 메시지·분위기·필요한 장면 구성을 함께 정리합니다", icon: "🎯" },
  { no: "03", title: "AI 영상 모델 활용", desc: "제품·브랜드 분위기에 맞는 장면을 AI로 생성 — 이미지 기반 영상화·배경·연출컷을 구성합니다", icon: "🤖" },
  { no: "04", title: "컷편집·자막·BGM", desc: "생성된 장면을 편집으로 정리하고 자막·BGM·모션·화면 비율을 플랫폼에 맞게 다듬습니다", icon: "✂️" },
  { no: "05", title: "납품", desc: "SNS 세로형·쇼핑몰용·유튜브 쇼츠용 영상 파일로 전달 — 필요 시 썸네일 이미지 포함", icon: "📦" },
];


const REVIEWS = [
  { stars: 5, text: "릴스 올리고 나서 팔로워가 2주 만에 2,000명 넘게 늘었어요 — 첫 3초 후킹이 진짜 다르다는 게 느껴졌습니다", author: "김*현", service: "SNS 숏폼 제작", date: "2026.04" },
  { stars: 5, text: "브랜드 소개 영상 반응이 완전히 달라졌어요 — 투자자 미팅에서 영상 하나로 분위기가 바뀌었습니다", author: "이*준", service: "브랜드 영상 제작", date: "2026.03" },
  { stars: 5, text: "유튜브 채널 운영 맡기고 조회수가 꾸준히 오르고 있어요 — 썸네일 퀄리티가 확실히 다르고 편집 속도도 빠릅니다", author: "박*서", service: "유튜브 채널 영상", date: "2026.05" },
];

const FAQS = [
  { q: "촬영도 포함인가요?", a: "기본 상품에는 촬영이 포함되어 있지 않습니다. AIO 영상 제작은 고객님이 제공해주시는 사진·영상·로고·상품 정보를 바탕으로 AI 영상 모델과 편집을 활용해 제작하는 방식입니다. 현장 촬영·모델 섭외·스튜디오 촬영이 필요한 경우 별도 상담이 필요합니다." },
  { q: "모델이나 성우가 나오나요?", a: "기본 상품에는 실제 모델 섭외나 성우 녹음이 포함되어 있지 않습니다. 필요한 경우 AI 영상 모델 활용 장면 구성이나 자막·BGM 중심으로 제작합니다. 실제 모델 촬영·전문 성우 녹음·나레이션 녹음은 별도 견적입니다." },
  { q: "제품을 보내면 촬영해주시나요?", a: "현재 기본 상품에는 제품 실물 촬영이 포함되어 있지 않습니다. 고객님이 보유한 제품 사진·상세 이미지·기존 영상·로고·상품 설명을 바탕으로 제작합니다." },
  { q: "조회수나 광고 성과가 보장되나요?", a: "조회수·광고 성과·매출 증가는 보장하지 않습니다. AIO는 고객이 활용할 수 있는 영상 콘텐츠를 제작해드리며, 성과는 채널 상태·업종·업로드 방식·광고 집행 여부에 따라 달라질 수 있습니다." },
  { q: "어떤 영상에 적합한가요?", a: "SNS 숏폼·유튜브 쇼츠·쇼핑몰 상품 홍보·상세페이지 삽입 영상·홈페이지 소개·랜딩페이지 홍보·브랜드 서비스 소개에 적합합니다. 현장 촬영 광고·인터뷰·실제 모델 출연·전문 성우 나레이션·고급 3D 모션그래픽·TV 광고급 영상은 별도 상담이 필요합니다." },
];

const STACK = ["AI 영상 모델", "Premiere Pro", "After Effects", "DaVinci Resolve", "CapCut", "Photoshop"];

const VIDEO_GROUPS = [
  {
    key: "숏폼 / SNS 영상", accent: "#F472B6", bg: "#FDF2F8",
    items: [
      { label: "숏폼 1개", price: "49,000", popular: false },
      { label: "숏폼 3개", price: "129,000", popular: true },
      { label: "숏폼 10개", price: "350,000", popular: false },
    ],
    includes: ["고객 제공 이미지·영상 기반", "AI 영상 모델 활용", "기본 컷편집", "기본 자막", "BGM", "간단 모션", "세로 영상 제작", "수정 1회"],
    note: "인스타 릴스·유튜브 쇼츠·틱톡·네이버 클립에 활용할 짧은 세로형 영상",
  },
  {
    key: "제품·서비스 홍보영상", accent: "#F59E0B", bg: "#FFFBEB",
    items: [
      { label: "30초 홍보영상", price: "89,000", popular: false },
      { label: "60초 홍보영상", price: "179,000", popular: true },
      { label: "브랜드·상세 구성형", price: "349,000", popular: false },
    ],
    includes: ["제품·서비스 소개 구성", "고객 자료 기반 편집", "AI 영상 모델 활용", "기본 자막", "BGM", "간단 모션", "썸네일 1장", "수정 1회"],
    note: "쇼핑몰·상세페이지·홈페이지·랜딩페이지용 — 촬영 없이 보유 자료로 빠르게 구성",
  },
  {
    key: "유튜브 편집", accent: "#EF4444", bg: "#FEF2F2",
    items: [
      { label: "기본 편집 1편", price: "79,000", popular: false },
      { label: "기본 편집 4편", price: "290,000", popular: true },
      { label: "쇼츠 변환 1개", price: "30,000", popular: false },
      { label: "쇼츠 변환 5개", price: "120,000", popular: false },
    ],
    includes: ["원본 30분 이내", "완성본 10분 이내", "컷편집", "기본 자막 일부", "BGM", "제목·설명문 기본 제안"],
    note: "유튜브 업로드 영상 정리 + 기존 영상 쇼츠 변환 — 길이·자막 범위·난이도에 따라 견적 변동",
  },
  {
    key: "월 영상 콘텐츠", accent: "#8B5CF6", bg: "#F5F3FF",
    items: [
      { label: "월 숏폼 8개", price: "290,000", popular: false },
      { label: "월 숏폼 12개", price: "390,000", popular: true },
      { label: "월 숏폼 20개", price: "690,000", popular: false },
    ],
    includes: [],
    note: "매월 꾸준히 숏폼을 발행하고 싶은 고객용 — SNS·쇼츠·상세페이지·쇼핑몰 홍보용",
  },
];

const VIDEO_OPTIONS = [
  { label: "비율 추가", price: "20,000~" },
  { label: "자막 언어 추가", price: "30,000~" },
  { label: "썸네일 추가", price: "20,000~" },
  { label: "AI 이미지·연출컷 추가", price: "50,000~" },
  { label: "추가 수정 1회", price: "30,000~" },
  { label: "빠른 제작·급행", price: "50,000~" },
];

const VIDEO_CUSTOM = [
  "현장 촬영", "제품 실물 촬영", "모델 섭외", "성우 녹음",
  "전문 나레이션 녹음", "스튜디오 촬영",
  "고급 모션그래픽", "3D 영상", "60초 초과 영상",
  "원본 30분 초과 편집", "풀자막 전체 삽입",
  "광고 소재 대량 제작", "기획·대본 전체 작성",
  "저작권·초상권 확인 필요 작업",
];

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
              Video · AI 숏폼·홍보영상 제작
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
              촬영 없이 — 고객 자료 + AI 영상 모델로<br />
              SNS·쇼핑몰·유튜브에 바로 쓸 수 있는 영상을 만듭니다
            </p>
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
              {["AI 영상 모델 활용", "촬영 없이 제작", "플랫폼 최적화", "빠른 납기"].map((b) => (
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
              <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.30)", fontFamily: "var(--font-jetbrains)" }}>aio-video.pipeline</span>
              <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "#EF4444", fontFamily: "var(--font-jetbrains)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> ● AI
              </span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { tc: "STEP 1", label: "고객 자료 확인", color: ACCENT },
                { tc: "STEP 2", label: "영상 방향 정리", color: ACCENT },
                { tc: "STEP 3", label: "AI 영상 모델 활용", color: "#F472B6" },
                { tc: "STEP 4", label: "컷편집·자막·BGM", color: ACCENT },
                { tc: "STEP 5", label: "납품", color: ACCENT },
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
              { label: "브랜드 소개 영상", title: "서비스 소개", accent: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", src: "/videos/brand-intro.mp4", poster: "/videos/brand-intro-poster.png" },
              { label: "제품 광고 영상", title: "제품 광고", accent: "#EF4444", bg: "#FEF2F2", border: "#FECACA", src: "/videos/product-ad.mp4", poster: "/videos/product-ad-poster.png" },
              { label: "인플루언서 숏폼", title: "숏폼 영상", accent: "#F472B6", bg: "#FDF2F8", border: "#FBCFE8", src: "/videos/influencer-shortform.mp4", poster: "/videos/influencer-shortform-poster.png" },
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
              <h2 className="font-bold text-[#111] mb-4" style={{ fontSize: "clamp(22px,3vw,36px)" }}>AI 모델로<br />빠르게 만듭니다</h2>
              <p className="text-[#6B7280] text-[13px] leading-[1.8] mb-6">
                고객 자료 확인 → AI 영상 모델 활용 → 편집·납품<br />촬영 없이 보유 자료만으로 온라인용 영상을 완성합니다
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

      {/* ── 가격 안내 ── */}
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14 md:py-20">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>Pricing</p>
            <h2 className="font-bold text-[#111] mb-2" style={{ fontSize: "clamp(22px,3vw,36px)" }}>영상 제작 가격</h2>
            <p className="text-[13px] text-[#6B7280]">모든 가격은 시작가 기준 · 난이도·분량에 따라 달라질 수 있습니다</p>
          </div>

          {/* 4개 그룹 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {VIDEO_GROUPS.map((g) => (
              <div key={g.key} className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white">
                <div className="h-1" style={{ background: g.accent }} />
                <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #F3F4F6", background: g.bg }}>
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: g.accent, fontFamily: "var(--font-jetbrains)" }}>{g.key}</span>
                </div>
                <div className="divide-y divide-[#F3F4F6]">
                  {g.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between px-5 py-3"
                      style={item.popular ? { background: g.bg } : {}}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[#111]">{item.label}</span>
                        {item.popular && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: g.accent, color: "#fff" }}>BEST</span>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-[14px]" style={{ color: g.accent, fontFamily: "var(--font-jetbrains)" }}>{item.price}</span>
                        <span className="text-[11px] text-[#9CA3AF] ml-0.5">원~</span>
                      </div>
                    </div>
                  ))}
                </div>
                {g.includes.length > 0 && (
                  <div className="px-5 py-3.5 border-t border-[#F3F4F6]">
                    <p className="text-[10px] font-bold text-[#9CA3AF] mb-2 uppercase tracking-widest">포함</p>
                    <div className="flex flex-wrap gap-1.5">
                      {g.includes.map((inc) => (
                        <span key={inc} className="text-[11px] px-2 py-0.5 rounded-md" style={{ background: g.accent + "12", color: g.accent }}>{inc}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="px-5 py-3 border-t border-[#F3F4F6]">
                  <p className="text-[11px] text-[#9CA3AF] leading-[1.7]">{g.note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 영상 옵션 + 별도견적 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {/* 영상 옵션 */}
            <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white">
              <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#6B7280]" style={{ fontFamily: "var(--font-jetbrains)" }}>영상 옵션</span>
                <span className="text-[10px] text-[#9CA3AF]">— 선택 추가</span>
              </div>
              <div className="divide-y divide-[#F3F4F6]">
                {VIDEO_OPTIONS.map((opt) => (
                  <div key={opt.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-[13px] text-[#374151]">{opt.label}</span>
                    <span className="text-[13px] font-bold text-[#111]" style={{ fontFamily: "var(--font-jetbrains)" }}>{opt.price}<span className="text-[11px] font-normal text-[#9CA3AF] ml-0.5">원</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* 별도견적 */}
            <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white">
              <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
                <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#6B7280]" style={{ fontFamily: "var(--font-jetbrains)" }}>별도 견적</span>
                <span className="text-[10px] text-[#9CA3AF]">— 기본 상품 미포함</span>
              </div>
              <div className="px-5 py-4">
                <div className="flex flex-wrap gap-2">
                  {VIDEO_CUSTOM.map((item) => (
                    <span key={item} className="text-[11px] px-2.5 py-1 rounded-lg text-[#6B7280]" style={{ background: "#F3F4F6", border: "1px solid #E5E7EB" }}>{item}</span>
                  ))}
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-4 leading-[1.7]">위 항목이 포함된 경우 상담 후 별도 견적으로 안내드립니다</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-[14px] font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: ACCENT }}
            >
              제작 견적 받기 ▶
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline={<>만들 <span style={{ color: ACCENT }}>영상</span>이 있나요?</>}
        sub="고객 자료만 있으면 됩니다 — 24시간 안에 견적, AI로 빠르게 제작"
        ctaLabel="제작 문의 ▶"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
