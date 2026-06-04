"use client";

import Link from "next/link";
import type { PricingTier, AddonItem } from "@/lib/services-data";

const BASIC_INCLUDES = [
  "기본 원고 정리",
  "기본 문구 다듬기",
  "기본 이미지 제작/배치",
  "기본 배너 제작",
  "페이지·메뉴 구성",
  "모바일 반응형 기본 적용",
  "문의 버튼 연결",
  "전화/이메일/카카오/네이버톡톡 등 기본 링크 연결",
  "기본 SEO 메타 정리",
  "PC/모바일 기본 확인",
  "문의 링크 작동 확인",
  "기본 수정 1회",
];

const GUARANTEE = [
  "원고가 부족해도 기본 정리를 도와드립니다",
  "기본 이미지와 배너 구성을 함께 지원합니다",
  "모바일 화면을 기본 확인합니다",
  "문의 버튼과 연락 링크 작동을 확인합니다",
  "추가 비용이 필요한 기능은 작업 전 미리 안내드립니다",
  "기본 수정 1회를 포함합니다",
];

interface Props {
  tiers: PricingTier[];
  addons?: AddonItem[];
  accentColor: string;
  ctaHref: string;
  sectionBg?: string;
}

export function WebsitePricingSection({ tiers, addons, accentColor, ctaHref, sectionBg }: Props) {
  const isFreeQuote = (t: PricingTier) => t.eventPrice === "별도 견적";

  return (
    <section style={{ background: sectionBg ?? "#EEF9F5" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-12 md:py-20">

        {/* ── 헤더 ── */}
        <div className="text-center mb-8 md:mb-14">
          <p
            className="text-[10px] md:text-[11px] font-semibold tracking-[0.22em] uppercase mb-2"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Pricing
          </p>
          <h2
            className="font-bold text-[#111] mb-3 leading-tight"
            style={{ fontSize: "clamp(18px,3.5vw,36px)", wordBreak: "keep-all" }}
          >
            가격 부담은 낮추고, 기본 퀄리티는 보장합니다
          </h2>
          <p
            className="text-[13px] md:text-[15px] text-[#6B7280] mb-5 leading-relaxed"
            style={{ wordBreak: "keep-all" }}
          >
            필요한 기능만 추가하고, 기본 제작 구성은 AIO가 함께 도와드립니다
          </p>
          {/* 납기 배지 */}
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] md:text-[12px] font-semibold text-white"
            style={{ background: accentColor }}
          >
            <span>⚡</span>
            결제 후 5일 내 완성
            <span className="font-normal opacity-75 ml-1">· 기능형 제외</span>
          </span>
        </div>

        {/* ── 4단 요금제 카드 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12 md:mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name.ko}
              className="border rounded-2xl p-5 md:p-6 flex flex-col bg-white"
              style={
                tier.recommended
                  ? { borderColor: accentColor, borderWidth: 2, boxShadow: `0 8px 32px ${accentColor}33` }
                  : { borderColor: "#E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }
              }
            >
              {/* 추천 배지 */}
              {tier.recommended && (
                <div className="mb-3">
                  <span
                    className="inline-block text-[10px] font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: accentColor }}
                  >
                    추천
                  </span>
                </div>
              )}

              {/* 티어명 */}
              <div className="text-[12px] md:text-[13px] font-semibold text-[#6B7280] mb-2" style={{ wordBreak: "keep-all" }}>
                {tier.name.ko}
              </div>

              {/* 가격 */}
              <div
                className="font-bold leading-none mb-4"
                style={{
                  fontSize: isFreeQuote(tier) ? "clamp(16px,2.5vw,22px)" : "clamp(22px,3.5vw,34px)",
                  fontFamily: isFreeQuote(tier) ? "var(--font-pretendard)" : "var(--font-jetbrains)",
                  color: isFreeQuote(tier) ? "#374151" : "#111",
                }}
              >
                {tier.eventPrice}
              </div>

              {/* 구분선 */}
              <div className="border-t border-[#F3F4F6] mb-4" />

              {/* 포함 항목 */}
              <ul className="space-y-2 flex-1">
                {tier.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] md:text-[12px] text-[#374151]" style={{ wordBreak: "keep-all" }}>
                    <span className="mt-0.5 text-[9px] font-bold flex-shrink-0" style={{ color: accentColor }}>✓</span>
                    {inc.ko}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={ctaHref}
                className="mt-5 block text-center py-2.5 rounded-xl text-[12px] md:text-[13px] font-semibold transition-all hover:-translate-y-0.5"
                style={
                  tier.recommended
                    ? { background: accentColor, color: "#fff" }
                    : { background: "#F9FAFB", color: "#111", border: "1px solid #E5E7EB" }
                }
              >
                {isFreeQuote(tier) ? "견적 문의 →" : "이 플랜으로 문의 →"}
              </Link>
            </div>
          ))}
        </div>

        {/* ── 기본 포함 / 추가요금 2단 패널 ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* 좌: 기본 포함 */}
          <div className="rounded-2xl border border-[#D1FAE5] bg-white p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: accentColor }}
              >
                ✓
              </span>
              <h3 className="font-bold text-[14px] md:text-[15px] text-[#111]">기본 포함 항목</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold ml-auto flex-shrink-0" style={{ background: accentColor }}>
                추가요금 없음
              </span>
            </div>
            <ul className="space-y-2.5">
              {BASIC_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12px] md:text-[13px] text-[#374151]" style={{ wordBreak: "keep-all" }}>
                  <span className="mt-0.5 text-[10px] font-bold flex-shrink-0" style={{ color: accentColor }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 우: 추가요금 항목 */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 md:p-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-full flex items-center justify-center bg-[#F3F4F6] text-[#6B7280] text-[12px] font-bold flex-shrink-0">
                +
              </span>
              <h3 className="font-bold text-[14px] md:text-[15px] text-[#111]">추가요금 항목</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#6B7280] font-semibold ml-auto flex-shrink-0">
                필요 시만
              </span>
            </div>
            <ul className="space-y-4">
              {(addons ?? []).map((addon) => (
                <li key={addon.name.ko}>
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[12px] md:text-[13px] font-semibold text-[#111]" style={{ wordBreak: "keep-all" }}>
                      {addon.name.ko}
                    </span>
                    <span
                      className="text-[11px] md:text-[12px] font-bold flex-shrink-0"
                      style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
                    >
                      {addon.price}
                    </span>
                  </div>
                  {addon.detail && (
                    <p className="text-[11px] text-[#9CA3AF] leading-relaxed" style={{ wordBreak: "keep-all" }}>
                      {addon.detail.ko}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── AIO 기본 제작 보장 카드 ── */}
        <div
          className="rounded-2xl p-6 md:p-10"
          style={{ background: `linear-gradient(135deg, ${accentColor}18 0%, ${accentColor}08 100%)`, border: `1.5px solid ${accentColor}44` }}
        >
          <div className="text-center mb-6">
            <p
              className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
              style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
            >
              Guarantee
            </p>
            <h3 className="font-bold text-[16px] md:text-[20px] text-[#111]">AIO 기본 제작 보장</h3>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-7">
            {GUARANTEE.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12px] md:text-[13px] text-[#374151]" style={{ wordBreak: "keep-all" }}>
                <span className="mt-0.5 text-[10px] font-bold flex-shrink-0" style={{ color: accentColor }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <div className="text-center pt-5 border-t" style={{ borderColor: `${accentColor}33` }}>
            <p className="font-semibold text-[13px] md:text-[14px] text-[#374151] leading-relaxed" style={{ wordBreak: "keep-all" }}>
              가격 부담은 낮추고, 기본 퀄리티는 보장합니다.<br className="hidden sm:block" />
              <span className="text-[#6B7280] font-normal"> 필요한 기능만 추가하고, 기본 제작 구성은 AIO가 함께 도와드립니다.</span>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
