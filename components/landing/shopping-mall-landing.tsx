// components/landing/shopping-mall-landing.tsx
"use client";

import { AioNav, AioFooter } from "./aio-nav";
import { ServiceHero } from "@/components/services/service-hero";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#FB923C";

const service = servicesData.find((s) => s.id === "shopping-mall")!;

const INDUSTRIES = [
  { icon: "💄", title: "뷰티·화장품", desc: "스킨케어·메이크업·향수 전문 쇼핑몰" },
  { icon: "🍱", title: "식품·건강", desc: "농산물·건강기능식품·밀키트 전문 쇼핑몰" },
  { icon: "👗", title: "패션·의류", desc: "여성복·남성복·액세서리 전문 쇼핑몰" },
  { icon: "🛋️", title: "리빙·인테리어", desc: "가구·조명·생활용품 전문 쇼핑몰" },
];

const INCLUDES = [
  { icon: "📦", title: "상품 등록", desc: "상품 사진·설명·옵션·가격 세팅" },
  { icon: "💳", title: "결제 연동", desc: "카드·계좌·간편결제 연동 및 테스트" },
  { icon: "📱", title: "모바일 최적화", desc: "모바일 쇼핑 흐름 우선 설계" },
  { icon: "🛠️", title: "14일 A/S", desc: "납품 후 무상 유지보수 포함" },
];

const TRUST = [
  { value: "142", label: "누적 의뢰", sub: "쇼핑몰 포함" },
  { value: "98%", label: "재의뢰율", sub: "142명 중 139명" },
  { value: "2일", label: "평균 납기", sub: "기본 플랜 기준" },
  { value: "카페24", label: "전문 파트너", sub: "공식 구축 경험" },
];

export function ShoppingMallLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero ── */}
      <ServiceHero
        accentColor={ACCENT}
        eyebrow="Shopping Mall · 쇼핑몰 구축"
        headline={
          <>
            팔리는 쇼핑몰을<br />
            <span style={{ color: ACCENT }}>구축</span>합니다
          </>
        }
        sub="카페24·독립몰·자사몰. 상품 등록부터 결제 연동까지 한 번에. 운영 가능한 완성몰로 납품합니다."
        badges={["카페24 전문", "결제연동 포함", "14일 A/S"]}
        ctaLabel="쇼핑몰 제작 문의 →"
        ctaHref={`/${locale}/quote`}
        imageSrc="/images/services/shopping-hero.png"
        imageAlt="쇼핑몰 구축 팀"
      />

      {/* ── 신뢰 수치 ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── 포함 내역 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Includes
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              기본 패키지에 모두 포함
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {INCLUDES.map((inc) => (
              <div
                key={inc.title}
                className="border border-[#E5E7EB] rounded-2xl p-6 text-center bg-white"
              >
                <div className="text-3xl mb-3">{inc.icon}</div>
                <h3 className="text-[15px] font-bold text-[#111] mb-2">{inc.title}</h3>
                <p className="text-[12px] text-[#6B7280] leading-[1.7]">{inc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 업종별 전문 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Industries
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              업종별 전문 쇼핑몰
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center"
              >
                <div className="text-3xl mb-3">{ind.icon}</div>
                <h3 className="text-[15px] font-bold text-[#111] mb-2">{ind.title}</h3>
                <p className="text-[12px] text-[#6B7280] leading-[1.7]">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 가격 3티어 ── */}
      <PricingTiers
        tiers={service.pricing}
        accentColor={ACCENT}
        isKo={isKo}
        ctaHref={`/${locale}/quote`}
      />

      {/* ── 프로세스 ── */}
      <ProcessSteps steps={service.process} accentColor={ACCENT} isKo={isKo} />

      {/* ── CTA ── */}
      <ServiceCta
        accentColor={ACCENT}
        headline="팔리는 쇼핑몰, 지금 시작하세요"
        sub="24시간 안에 견적 · 2-5일 안에 운영 가능한 완성몰"
        ctaLabel="쇼핑몰 제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
