// components/landing/development-services.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { AioNav, AioFooter } from "./aio-nav";
import { ServiceCta } from "@/components/services/service-cta";

const ACCENT = "#111111";

const SUB_SERVICES = [
  {
    no: "01",
    id: "website",
    title: "웹사이트",
    en: "Website",
    desc: "랜딩페이지·회사 홈페이지·서비스 사이트. 스크롤을 멈추게 만드는 한 페이지.",
    price: "₩99,000~",
    days: "1-5일",
    href: (locale: string) => `/${locale}/services/website`,
    soon: false,
  },
  {
    no: "02",
    id: "shopping-mall",
    title: "쇼핑몰",
    en: "Shopping Mall",
    desc: "카페24·독립몰 구축. 상품 등록·결제 연동·모바일 최적화까지 한 번에.",
    price: "₩149,000~",
    days: "2-5일",
    href: (locale: string) => `/${locale}/services/shopping-mall`,
    soon: false,
  },
  {
    no: "03",
    id: "automation-app",
    title: "자동화·프로그램",
    en: "Automation & App",
    desc: "엑셀·데이터·크롤링·알림·매크로. 반복 업무를 코드에게 맡기세요.",
    price: "₩100,000~",
    days: "1-7일",
    href: (locale: string) => `/${locale}/services/automation-app`,
    soon: false,
  },
  {
    no: "04",
    id: "app",
    title: "앱",
    en: "App",
    desc: "iOS·Android 모바일 앱 개발. 현재 준비 중입니다.",
    price: "준비 중",
    days: "",
    href: () => "#",
    soon: true,
  },
];

const HOW = [
  { title: "투명한 진행", desc: "작업 상황을 매일 공유합니다" },
  { title: "운영 가능한 납품", desc: "시안이 아닌 완성품으로 드립니다" },
  { title: "빠른 속도", desc: "의뢰 후 1~5일 — 다음 날 착수" },
  { title: "책임 A/S", desc: "납품 후 14일 무상 유지보수" },
];

export function DevelopmentServices({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p
                className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5"
                style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
              >
                Development · 개발 서비스
              </p>
              <h1
                className="font-bold leading-[1.05] tracking-tight text-[#111] mb-5"
                style={{ fontSize: "clamp(34px,5vw,62px)" }}
              >
                코드로 만드는<br />
                <span style={{ color: ACCENT }}>모든 것</span>
              </h1>
              <p className="text-[#6B7280] leading-[1.8] mb-7" style={{ fontSize: "clamp(14px,1.2vw,17px)" }}>
                웹사이트·쇼핑몰·자동화·프로그램 — 비즈니스에 필요한 결과물을 빠르게 만듭니다.
                보여주기용이 아닌, 바로 운영 가능한 완성품으로.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["5일 납품", "98% 재의뢰율", "1시간 응답", "14일 A/S"].map((b) => (
                  <span
                    key={b}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#111] text-[#111]"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center gap-2 px-7 py-4 rounded-lg text-[14px] font-bold text-white bg-[#111] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                제작 문의 →
              </Link>
            </div>
            <div className="relative w-full h-[260px] md:h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/services/development-hero.png"
                alt="AIO 개발팀"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 서비스 카드 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Services
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              네 가지 <span style={{ borderBottom: "3px solid #111" }}>개발 서비스</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SUB_SERVICES.map((s) => {
              const Inner = (
                <div
                  className="border rounded-2xl p-7 bg-white flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-md"
                  style={{ opacity: s.soon ? 0.6 : 1 }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[11px] font-bold"
                      style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
                    >
                      {s.no}
                    </span>
                    {s.soon && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F3F4F6] text-[#9CA3AF] rounded-full">
                        COMING SOON
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#111]">{s.title}</h3>
                    <p className="text-[12px] text-[#9CA3AF]">{s.en}</p>
                  </div>
                  <p className="text-[13px] text-[#6B7280] leading-[1.7] flex-1">{s.desc}</p>
                  {!s.soon && (
                    <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                      <span
                        className="text-[15px] font-bold"
                        style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
                      >
                        {s.price}
                      </span>
                      <span className="text-[11px] text-[#9CA3AF]">{isKo ? `납기 ${s.days}` : `Delivery ${s.days}`}</span>
                    </div>
                  )}
                </div>
              );
              return s.soon ? (
                <div key={s.id}>{Inner}</div>
              ) : (
                <Link key={s.id} href={s.href(locale)} className="block">
                  {Inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 일하는 방식 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              How We Work
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              일하는 방식
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HOW.map((h) => (
              <div key={h.title} className="text-center p-6 border border-[#E5E7EB] rounded-2xl">
                <h3 className="text-[15px] font-bold text-[#111] mb-2">{h.title}</h3>
                <p className="text-[13px] text-[#6B7280] leading-[1.7]">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceCta
        accentColor={ACCENT}
        headline="코드로 만들 일이 있나요?"
        sub="지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물"
        ctaLabel="제작 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
