"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";

const ACCENT = "#10B981";

const SUB_SERVICES = [
  {
    no: "01", id: "blog", title: "블로그 콘텐츠 운영", en: "Blog Content",
    desc: "업종에 맞는 키워드·주제를 정리하고, 검색에 노출될 수 있는 구조로 콘텐츠를 꾸준히 쌓아드립니다. 상위노출을 보장하는 상품은 아닙니다.",
    price: "₩149,000~/월", days: "월 4건 기준", tags: ["Naver Blog", "키워드", "원고"],
    href: (l: string) => `/${l}/services/marketing`, soon: false, accent: "#10B981", bg: "#F0FDF4",
  },
  {
    no: "02", id: "sns", title: "SNS 콘텐츠 운영", en: "SNS Content",
    desc: "업종에 맞는 이미지 콘텐츠·캡션·해시태그를 제작해 SNS 계정을 꾸준히 채워드립니다. 팔로워·조회수 증가를 보장하는 상품은 아닙니다.",
    price: "₩149,000~/월", days: "월 8건 기준", tags: ["Instagram", "카드뉴스", "캡션"],
    href: (l: string) => `/${l}/services/marketing`, soon: false, accent: "#F472B6", bg: "#FDF2F8",
  },
  {
    no: "03", id: "shorts", title: "유튜브 쇼츠 운영", en: "YouTube Shorts",
    desc: "쇼츠 형식에 맞는 제목·자막·설명문·해시태그를 구성해 채널에 콘텐츠를 꾸준히 쌓아드립니다. 구독자·조회수 보장 상품이 아닙니다.",
    price: "₩190,000~/월", days: "월 4개 기준", tags: ["YouTube Shorts", "자막", "썸네일"],
    href: (l: string) => `/${l}/services/marketing`, soon: false, accent: "#FB923C", bg: "#FFF7ED",
  },
  {
    no: "04", id: "bundle", title: "통합 콘텐츠 운영", en: "All-in-One",
    desc: "블로그·SNS·유튜브 쇼츠를 한 번에 운영하고 싶은 고객을 위한 통합 패키지입니다. 여러 채널에 콘텐츠 기반을 함께 쌓아드립니다.",
    price: "₩390,000~/월", days: "라이트 기준", tags: ["블로그", "SNS", "쇼츠"],
    href: (l: string) => `/${l}/services/marketing`, soon: false, accent: "#8B5CF6", bg: "#F5F3FF",
  },
];

const MK_DIAGNOSIS = [
  { label: "블로그 콘텐츠 방향 진단", price: "49,000" },
  { label: "SNS 계정 콘텐츠 방향 진단", price: "49,000" },
  { label: "유튜브 채널 콘텐츠 방향 진단", price: "49,000" },
  { label: "쇼핑몰·웹사이트 마케팅 동선 진단", price: "99,000" },
  { label: "GA4·픽셀·전환추적 점검", price: "149,000" },
  { label: "광고 계정 기본 세팅", price: "149,000" },
];

const MK_GROUPS = [
  {
    key: "블로그 콘텐츠 운영", accent: "#10B981", bg: "#F0FDF4",
    items: [
      { label: "월 4건", price: "149,000", popular: false },
      { label: "월 8건", price: "290,000", popular: true },
      { label: "월 12건", price: "390,000", popular: false },
    ],
    includes: ["키워드·주제 선정", "제목·본문 구성", "원고 작성·편집", "기본 이미지 배치", "업로드 원고·대행", "월간 리포트"],
    note: "상위노출 보장 아님 — 검색 노출 가능한 구조로 꾸준히 축적합니다",
  },
  {
    key: "SNS 콘텐츠 운영", accent: "#F472B6", bg: "#FDF2F8",
    items: [
      { label: "월 8건", price: "149,000", popular: false },
      { label: "월 12건", price: "240,000", popular: true },
      { label: "월 20건", price: "390,000", popular: false },
    ],
    includes: ["카드뉴스·이미지 제작", "짧은 캡션 작성", "해시태그 정리", "업로드 이미지 제공", "기본 업로드 대행", "월간 리포트"],
    note: "팔로워·조회수 증가 보장 아님 — 꾸준히 쌓고 반응 보며 방향을 개선합니다",
  },
  {
    key: "유튜브 쇼츠 운영", accent: "#FB923C", bg: "#FFF7ED",
    items: [
      { label: "월 4개", price: "190,000", popular: false },
      { label: "월 8개", price: "350,000", popular: true },
      { label: "월 12개", price: "490,000", popular: false },
    ],
    includes: ["주제·구성 정리", "고객 자료 기반 편집", "기본 자막", "제목·설명문 작성", "해시태그 정리", "업로드 세팅"],
    note: "조회수·구독자 보장 아님 — 쇼츠 형식에 맞춘 콘텐츠를 채널에 축적합니다",
  },
  {
    key: "통합 콘텐츠 운영", accent: "#8B5CF6", bg: "#F5F3FF",
    items: [
      { label: "라이트 (SNS8·블로그4·쇼츠4)", price: "390,000", popular: false },
      { label: "스탠다드 (SNS12·블로그8·쇼츠8)", price: "590,000", popular: true },
      { label: "집중 (SNS20·블로그12·쇼츠12)", price: "890,000", popular: false },
    ],
    includes: [],
    note: "블로그·SNS·쇼츠를 한 번에 운영 — 여러 채널에 콘텐츠 기반을 함께 쌓아드립니다",
  },
];

const MK_CUSTOM = [
  "광고비", "광고 성과 관리", "광고 효율 보장형 운영",
  "매일 댓글·DM 응대", "인플루언서 섭외", "체험단 운영",
  "현장 촬영", "제품 촬영", "모델 섭외", "전문 영상 촬영",
  "고급 카드뉴스 디자인", "상세페이지급 디자인",
  "장문 전문 원고", "보도자료 작성", "언론홍보",
  "상위노출 보장형 작업", "조회수·팔로워·매출 보장형 작업",
  "커뮤니티 바이럴 작업",
];

const HOW = [
  { no: "01", title: "현재 상태 확인", desc: "기존 블로그·SNS·유튜브 계정·업종·주요 고객층·참고 채널을 확인하고 현재 콘텐츠 문제점을 정리합니다", icon: "🔍" },
  { no: "02", title: "콘텐츠 방향 정리", desc: "운영 채널 선정·콘텐츠 주제·키워드/해시태그 방향·게시물 유형·월간 구성을 함께 잡습니다", icon: "🗂️" },
  { no: "03", title: "콘텐츠 제작", desc: "블로그 원고·SNS 카드뉴스·캡션·쇼츠 편집·제목/설명문/해시태그를 업종에 맞게 제작합니다", icon: "✏️" },
  { no: "04", title: "업로드 보조 + 리포트", desc: "업로드용 파일 제공·기본 업로드 대행·월간 간단 리포트·다음 콘텐츠 방향 제안까지", icon: "📋" },
];


const REVIEWS = [
  { stars: 5, text: "매주 리포트로 진행 상황이 투명하게 보여서 믿고 맡길 수 있었어요 — 어떤 키워드로 글을 쓰는지 함께 공유해줘서 방향이 잡히는 느낌이었습니다", author: "정*연", service: "블로그 콘텐츠 운영", date: "2026.04" },
  { stars: 5, text: "방치되던 SNS 계정이 꾸준히 채워지니 브랜드가 살아있는 느낌입니다 — 매달 어떤 콘텐츠를 올릴지 같이 정리해줘서 운영이 훨씬 수월해졌어요", author: "한*미", service: "SNS 콘텐츠 운영", date: "2026.03" },
  { stars: 5, text: "쇼츠가 채널에 차곡차곡 쌓이는 게 보이고, 제목·자막 구성 방향도 같이 잡아줘서 좋았어요 — 처음 혼자 했을 때보다 훨씬 정돈된 채널이 됐습니다", author: "윤*석", service: "유튜브 쇼츠 운영", date: "2026.05" },
];

const FAQS = [
  { q: "상위노출이 보장되나요?", a: "상위노출은 보장하지 않습니다. 상위노출은 계정 지수·키워드 경쟁도·업종·콘텐츠 누적량·알고리즘 변화 등 여러 요소의 영향을 받습니다. AIO는 상위노출 보장 방식이 아니라, 검색과 노출 가능성을 높일 수 있도록 키워드 기반 콘텐츠를 꾸준히 제작·운영합니다." },
  { q: "조회수나 팔로워 증가가 보장되나요?", a: "조회수·팔로워 증가·매출 상승은 보장하지 않습니다. 대신 콘텐츠 주제·제목·자막·해시태그·업로드 구조를 정리하고, 반응 데이터를 보며 콘텐츠 방향을 개선합니다." },
  { q: "광고 운영도 포함인가요?", a: "기본 콘텐츠 운영 상품에는 광고비와 광고 성과 관리가 포함되어 있지 않습니다. 광고 계정 세팅·픽셀/전환추적 점검·광고 운영은 별도 상담 후 안내드립니다." },
  { q: "블로그 글만 작성해주나요?", a: "블로그 콘텐츠 운영은 원고 작성뿐 아니라 주제·키워드·제목·본문 구성·기본 이미지 배치까지 함께 정리합니다. 업로드 대행이 필요한 경우 계정 권한 또는 업로드 자료 제공이 필요합니다." },
  { q: "SNS는 어떤 콘텐츠를 만들어주나요?", a: "업종과 상품에 맞는 이미지 콘텐츠·카드뉴스·짧은 캡션·해시태그를 제작합니다. 고급 디자인 작업이나 촬영 콘텐츠는 별도 견적으로 안내드립니다." },
  { q: "유튜브 롱폼 영상도 포함인가요?", a: "기본 유튜브 운영은 쇼츠 중심입니다. 롱폼 영상 편집·촬영·전문 자막·고급 편집은 별도 견적으로 안내드립니다." },
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
              상위노출·조회수·팔로워 증가를 보장하지 않습니다<br />대신 업종에 맞는 콘텐츠를 블로그·SNS·유튜브에 꾸준히 쌓아드립니다
            </p>
            <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
              {["블로그·SNS·유튜브 쇼츠", "보장 없는 정직한 운영", "월 단위 계약", "간단 리포트 포함"].map((b) => (
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
              {[{ v: "4채널", l: "블로그·SNS·유튜브·쇼츠" }, { v: "월 단위", l: "유연한 계약" }, { v: "주 1회", l: "KPI 리포트" }].map((s) => (
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
                { label: "운영 채널", value: "블로그·SNS·유튜브·쇼츠", note: "4채널" },
                { label: "콘텐츠 제작 방식", value: "월 단위 기획·제작·발행", note: "정기" },
                { label: "리포트 주기", value: "매주 KPI 공유", note: "주 1회" },
                { label: "계약 방식", value: "월 단위 · 30일 전 해지 통보", note: "유연" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.40)", fontFamily: "var(--font-jetbrains)" }}>{row.label}</span>
                  <div className="text-right">
                    <div className="text-[12px] font-semibold text-white leading-tight">{row.value}</div>
                    <div className="text-[10px]" style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}>{row.note}</div>
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
              { label: "유튜브 운영", title: "유튜브 채널 운영대행", stack: "YouTube · Shorts · 썸네일", accent: "#FB923C", bg: "#FFF7ED", border: "#FED7AA", desktop: "/images/portfolio/ws-youtube-desktop.png", delay: "6s" },
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
              <h2 className="font-bold text-[#111] mb-4" style={{ fontSize: "clamp(22px,3vw,36px)" }}>콘텐츠 기반을<br />함께 쌓아갑니다</h2>
              <p className="text-[#6B7280] text-[13px] leading-[1.8] mb-6">
                상위노출·조회수를 보장하지 않습니다<br />방향을 잡고 꾸준히 쌓고 반응 보며 개선합니다
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

      {/* ── 가격 안내 ── */}
      <section style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-14 md:py-20">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: "#9CA3AF", fontFamily: "var(--font-jetbrains)" }}>Pricing</p>
            <h2 className="font-bold text-[#111] mb-2" style={{ fontSize: "clamp(22px,3vw,36px)" }}>마케팅 서비스 가격</h2>
            <p className="text-[13px] text-[#6B7280]">모든 가격은 시작가 기준 · 상위노출·조회수·팔로워 증가를 보장하는 상품이 아닙니다</p>
          </div>

          {/* 진단·세팅 */}
          <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white mb-6">
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #F3F4F6", background: "#F0FDF4" }}>
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase" style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}>마케팅 진단·세팅</span>
              <span className="text-[10px] text-[#9CA3AF]">— 방향 점검 단건 상품</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#F3F4F6]">
              {MK_DIAGNOSIS.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-3 border-b border-[#F3F4F6]">
                  <span className="text-[13px] text-[#374151]">{item.label}</span>
                  <div>
                    <span className="font-bold text-[14px]" style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}>{item.price}</span>
                    <span className="text-[11px] text-[#9CA3AF] ml-0.5">원~</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 운영 그룹 4개 카드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
            {MK_GROUPS.map((g) => (
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

          {/* 별도견적 */}
          <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] bg-white mb-8">
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid #F3F4F6", background: "#F9FAFB" }}>
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#6B7280]" style={{ fontFamily: "var(--font-jetbrains)" }}>별도 견적</span>
              <span className="text-[10px] text-[#9CA3AF]">— 기본 상품 미포함</span>
            </div>
            <div className="px-5 py-4">
              <div className="flex flex-wrap gap-2">
                {MK_CUSTOM.map((item) => (
                  <span key={item} className="text-[11px] px-2.5 py-1 rounded-lg text-[#6B7280]" style={{ background: "#F3F4F6", border: "1px solid #E5E7EB" }}>{item}</span>
                ))}
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-4 leading-[1.7]">위 항목이 포함된 경우 상담 후 별도 견적으로 안내드립니다 · 광고비는 별도입니다</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href={`/${locale}/quote`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-[14px] font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background: ACCENT }}
            >
              운영 견적 받기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline={<>콘텐츠 <span style={{ color: ACCENT }}>기반</span>이 필요한가요?</>}
        sub="보장 없이도 꾸준히 — 24시간 안에 견적, 1주 안에 방향 정리"
        ctaLabel="운영 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
