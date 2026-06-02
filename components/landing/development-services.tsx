"use client";

import Link from "next/link";
import Image from "next/image";
import { AioNav, AioFooter } from "./aio-nav";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { ServiceCta } from "@/components/services/service-cta";

const ACCENT = "#111111";

const SUB_SERVICES = [
  {
    no: "01",
    id: "website",
    title: "웹사이트",
    en: "Website",
    desc: "랜딩페이지·회사 홈페이지·서비스 사이트. 스크롤을 멈추게 만드는 완성형 홈페이지.",
    price: "₩99,000~",
    days: "1–5일",
    tags: ["Next.js", "WordPress", "카페24"],
    href: (locale: string) => `/${locale}/services/website`,
    soon: false,
    accent: "#3B82F6",
  },
  {
    no: "02",
    id: "shopping-mall",
    title: "쇼핑몰",
    en: "Shopping Mall",
    desc: "카페24·독립몰 구축. 상품 등록·결제 연동·GA4·광고 픽셀까지 한 번에.",
    price: "₩149,000~",
    days: "2–5일",
    tags: ["카페24", "결제연동", "GA4·픽셀"],
    href: (locale: string) => `/${locale}/services/shopping-mall`,
    soon: false,
    accent: "#FB923C",
  },
  {
    no: "03",
    id: "automation-app",
    title: "자동화·프로그램",
    en: "Automation & Program",
    desc: "엑셀·크롤링·알림·매크로·데스크탑 프로그램. 반복 업무를 코드에게.",
    price: "₩100,000~",
    days: "1–7일",
    tags: ["Python", "n8n", "Electron"],
    href: (locale: string) => `/${locale}/services/automation-app`,
    soon: false,
    accent: "#818CF8",
  },
  {
    no: "04",
    id: "app",
    title: "앱",
    en: "Mobile App",
    desc: "iOS·Android 네이티브 앱 및 크로스플랫폼 개발. 현재 준비 중입니다.",
    price: "준비 중",
    days: "",
    tags: ["React Native", "Flutter"],
    href: () => "#",
    soon: true,
    accent: "#9CA3AF",
  },
];

const HOW = [
  { no: "01", title: "투명한 진행", desc: "작업 상황을 매일 공유합니다. 카카오톡 채널로 실시간 소통.", icon: "💬" },
  { no: "02", title: "운영 가능한 납품", desc: "시안이 아닌 완성품으로 드립니다. 받는 즉시 운영할 수 있는 결과물.", icon: "✅" },
  { no: "03", title: "빠른 속도", desc: "의뢰 후 1–5일 납품. 다음 날 착수, 매일 중간 공유.", icon: "⚡" },
  { no: "04", title: "책임 A/S", desc: "납품 후 14일 무상 유지보수. 오류·수정 모두 책임집니다.", icon: "🛡️" },
];

const TRUST = [
  { value: "142", label: "누적 의뢰", sub: "기업·개인 포함" },
  { value: "98%", label: "재의뢰율", sub: "142명 중 139명" },
  { value: "23분", label: "평균 응답", sub: "영업일 기준" },
  { value: "5일", label: "평균 납기", sub: "전 서비스 기준" },
];

export function DevelopmentServices({ locale }: { locale: string }) {
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
                style={{ fontSize: "clamp(36px,5.5vw,68px)" }}
              >
                코드로 만드는<br />모든 것
              </h1>
              <p className="text-[#6B7280] leading-[1.8] mb-8" style={{ fontSize: "clamp(14px,1.2vw,17px)" }}>
                웹사이트·쇼핑몰·자동화·프로그램 — 비즈니스에 필요한 결과물을 빠르게 만듭니다.
                보여주기용이 아닌, 바로 운영 가능한 완성품으로.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["5일 납품 보장", "98% 재의뢰율", "1시간 응답", "14일 무상 A/S"].map((b) => (
                  <span key={b} className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151]">
                    {b}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/quote`}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-lg text-[14px] font-bold text-white bg-[#111] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  제작 문의 →
                </Link>
                <Link
                  href={`/${locale}/portfolio`}
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-lg text-[14px] font-semibold text-[#111] bg-white border border-[#E5E7EB] transition-all hover:border-[#111]"
                >
                  포트폴리오 보기
                </Link>
              </div>
            </div>
            {/* 이미지 + 하단 수치 오버레이 */}
            <div className="relative w-full h-[280px] md:h-[420px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/services/development-hero.png"
                alt="AIO 개발팀"
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/75 to-transparent">
                <div className="flex gap-6">
                  {[{ v: "142", l: "누적 의뢰" }, { v: "5일", l: "평균 납기" }, { v: "98%", l: "재의뢰율" }].map((s) => (
                    <div key={s.l}>
                      <div className="font-bold text-white leading-none" style={{ fontSize: "clamp(18px,2.5vw,26px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                      <div className="text-[11px] text-white/60 mt-0.5">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 신뢰 수치 바 ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── 4 서비스 카드 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3" style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}>Services</p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,40px)" }}>네 가지 개발 서비스</h2>
            <p className="text-[#9CA3AF] text-[13px] mt-2">각 카드를 클릭하면 전용 소개·포트폴리오 페이지로 이동합니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SUB_SERVICES.map((s) => {
              const Card = (
                <div
                  className="group border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl bg-white"
                  style={{ borderColor: "#E5E7EB", opacity: s.soon ? 0.65 : 1 }}
                >
                  {/* 상단 컬러 바 */}
                  <div className="h-1.5" style={{ background: s.accent }} />
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[11px] font-bold tracking-[0.18em]" style={{ color: s.accent, fontFamily: "var(--font-jetbrains)" }}>{s.no}</span>
                      {s.soon && <span className="text-[10px] font-bold px-2.5 py-1 bg-[#F3F4F6] text-[#9CA3AF] rounded-full">COMING SOON</span>}
                    </div>
                    <h3 className="font-bold text-[#111] mb-1" style={{ fontSize: "clamp(20px,2vw,26px)" }}>{s.title}</h3>
                    <p className="text-[12px] text-[#9CA3AF] mb-4">{s.en}</p>
                    <p className="text-[13px] text-[#6B7280] leading-[1.75] mb-5">{s.desc}</p>
                    {/* 기술 태그 */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {s.tags.map((tag) => (
                        <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-md" style={{ background: s.accent + "15", color: s.accent }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* 가격 + 납기 */}
                    {!s.soon && (
                      <div className="flex items-center justify-between pt-5 border-t border-[#F3F4F6]">
                        <div>
                          <span className="font-bold" style={{ fontSize: "clamp(17px,1.8vw,22px)", color: s.accent, fontFamily: "var(--font-jetbrains)" }}>{s.price}</span>
                          <span className="text-[11px] text-[#9CA3AF] ml-1">시작가</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-[#9CA3AF]">납기</span>
                          <span className="text-[13px] font-bold text-[#111]" style={{ fontFamily: "var(--font-jetbrains)" }}>{s.days}</span>
                        </div>
                      </div>
                    )}
                    {!s.soon && (
                      <div className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold transition-all group-hover:gap-3" style={{ color: s.accent }}>
                        자세히 보기 <span className="transition-transform group-hover:translate-x-0.5">→</span>
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

      {/* ── 일하는 방식 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* 좌: 텍스트 */}
            <div className="md:sticky md:top-24">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-4" style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}>How We Work</p>
              <h2 className="font-bold text-[#111] mb-5" style={{ fontSize: "clamp(24px,3.5vw,40px)" }}>
                결과물 중심으로<br />일합니다
              </h2>
              <p className="text-[#6B7280] text-[14px] leading-[1.8] mb-8">
                빠르고 투명하게. 의뢰부터 납품까지 매일 진행 상황을 공유하고,
                시안이 아닌 바로 쓸 수 있는 완성품으로 드립니다.
              </p>
              {/* 핵심 수치 강조 */}
              <div className="flex gap-8 mb-8 pb-8 border-b border-[#E5E7EB]">
                {[{ v: "1시간", l: "평균 응답" }, { v: "5일", l: "평균 납기" }].map((s) => (
                  <div key={s.l}>
                    <div className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3vw,36px)", fontFamily: "var(--font-jetbrains)" }}>{s.v}</div>
                    <div className="text-[12px] text-[#9CA3AF] mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              <Link
                href={`/${locale}/quote`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-[13px] font-bold text-white bg-[#111] transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                제작 문의 →
              </Link>
            </div>
            {/* 우: 4가지 방식 카드 */}
            <div className="grid grid-cols-1 gap-4">
              {HOW.map((h) => (
                <div key={h.no} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#111] transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-[#F9FAFB] border border-[#E5E7EB]">
                    {h.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold" style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}>{h.no}</span>
                      <h3 className="text-[14px] font-bold text-[#111]">{h.title}</h3>
                    </div>
                    <p className="text-[12px] text-[#6B7280] leading-[1.7]">{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
