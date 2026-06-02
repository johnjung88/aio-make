// components/landing/website-landing.tsx
"use client";

import { AioNav, AioFooter } from "./aio-nav";
import { ServiceHero } from "@/components/services/service-hero";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#4DD4AC";

const service = servicesData.find((s) => s.id === "website")!;

const INDUSTRIES = [
  { icon: "🏥", title: "병원·의원", desc: "예약 유도와 신뢰 강조에 최적화된 의료 홈페이지" },
  { icon: "⚖️", title: "법률사무소", desc: "전문성과 상담 유도를 중심으로 한 법률 사이트" },
  { icon: "🛒", title: "커머스·브랜드", desc: "제품과 브랜드를 전면에 내세운 커머스 랜딩" },
  { icon: "🚀", title: "스타트업·서비스", desc: "빠른 런칭과 전환율 중심의 서비스 랜딩페이지" },
];

const TRUST = [
  { value: "142", label: "누적 의뢰", sub: "기업·개인 포함" },
  { value: "98%", label: "재의뢰율", sub: "142명 중 139명 재의뢰" },
  { value: "23분", label: "평균 응답", sub: "영업일 기준" },
  { value: "14일", label: "기본 A/S", sub: "납품 후 무상" },
];

const PORTFOLIO_ITEMS = [
  { title: "병원 홈페이지", tag: "의료", bg: "#EFF6FF" },
  { title: "법률사무소", tag: "법률", bg: "#F5F3FF" },
  { title: "스타트업 랜딩", tag: "서비스", bg: "#F0FDF4" },
  { title: "브랜드 홈페이지", tag: "커머스", bg: "#FFF7ED" },
  { title: "포트폴리오 사이트", tag: "개인", bg: "#FDF2F8" },
  { title: "B2B 서비스 랜딩", tag: "B2B", bg: "#F0F9FF" },
];

export function WebsiteLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="leaf" sub="website" cat="development" active="service" />

      {/* ── Hero (첫 화면 CTA 포함) ── */}
      <ServiceHero
        accentColor={ACCENT}
        eyebrow="Website · 웹사이트 제작"
        headline={
          <>
            스크롤을 멈추게<br />
            만드는 <span style={{ color: ACCENT }}>홈페이지</span>
          </>
        }
        sub="랜딩페이지·회사 홈페이지·서비스 사이트. 바로 운영 가능한 완성품을 5일 이내 납품합니다."
        badges={["5일 납품", "14일 A/S", "SEO 세팅 포함"]}
        ctaLabel="웹사이트 제작 문의 →"
        ctaHref={`/${locale}/quote`}
        imageSrc="/images/services/website-hero.png"
        imageAlt="웹사이트 제작 팀"
      />

      {/* ── 신뢰 수치 ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── 포트폴리오 쇼케이스 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Portfolio
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              실제 납품한 사이트들
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {PORTFOLIO_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl overflow-hidden border border-[#E5E7EB] aspect-[4/3] flex items-end p-5"
                style={{ background: item.bg }}
              >
                <div>
                  <span
                    className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                    style={{ background: ACCENT + "22", color: ACCENT }}
                  >
                    {item.tag}
                  </span>
                  <p className="text-[13px] font-semibold text-[#111]">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={`/${locale}/portfolio/category/website`}
              className="text-[13px] font-semibold underline"
              style={{ color: ACCENT }}
            >
              전체 포트폴리오 보기 →
            </a>
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
              업종별 전문 제작
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
        headline="지금 제작 문의하세요"
        sub="24시간 안에 견적 · 5일 안에 첫 화면"
        ctaLabel="웹사이트 제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
