// components/landing/automation-landing.tsx
"use client";

import { AioNav, AioFooter } from "./aio-nav";
import { ServiceHero } from "@/components/services/service-hero";
import { TrustNumbers } from "@/components/services/trust-numbers";
import { PricingTiers } from "@/components/services/pricing-tiers";
import { ProcessSteps } from "@/components/services/process-steps";
import { ServiceCta } from "@/components/services/service-cta";
import { servicesData } from "@/lib/services-data";

const ACCENT = "#818CF8";

const service = servicesData.find((s) => s.id === "automation-app")!;

const CASES = [
  {
    icon: "📊",
    title: "엑셀·데이터 파싱",
    before: "매일 2시간 수작업 복사·붙여넣기",
    after: "버튼 한 번으로 3분 완료",
    saving: "1,820시간/년 절약",
  },
  {
    icon: "🔔",
    title: "카카오 알림 자동 발송",
    before: "주문마다 수동 문자 발송",
    after: "조건 충족 시 자동 발송",
    saving: "무한 반복 제거",
  },
  {
    icon: "🌐",
    title: "데이터 크롤링·수집",
    before: "경쟁사 가격 매일 직접 확인",
    after: "매일 자동 수집 → 엑셀 저장",
    saving: "실시간 데이터 확보",
  },
  {
    icon: "⚙️",
    title: "반복 매크로·클릭봇",
    before: "같은 화면 클릭을 매일 반복",
    after: "스케줄 설정 → 자동 실행",
    saving: "야근·실수 제로화",
  },
];

const STACK = [
  { name: "n8n", desc: "노코드 자동화 플로우" },
  { name: "Make", desc: "API·앱 연동 자동화" },
  { name: "Python", desc: "크롤링·파싱·스크립트" },
  { name: "Electron", desc: "데스크탑 프로그램" },
  { name: "매크로", desc: "반복 클릭·입력 자동화" },
];

const TRUST = [
  { value: "142", label: "누적 의뢰", sub: "자동화 포함" },
  { value: "98%", label: "재의뢰율", sub: "142명 중 139명" },
  { value: "1일~", label: "최소 납기", sub: "단순 자동화 기준" },
  { value: "14일", label: "기본 A/S", sub: "납품 후 무상" },
];

export function AutomationLanding({ locale }: { locale: string }) {
  const isKo = locale === "ko";

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-pretendard)", wordBreak: "keep-all" }}>
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      {/* ── Hero ── */}
      <ServiceHero
        accentColor={ACCENT}
        eyebrow="Automation · 자동화·프로그램"
        headline={
          <>
            반복 업무를<br />
            <span style={{ color: ACCENT }}>코드</span>에게 맡기세요
          </>
        }
        sub="엑셀 파싱·알림 발송·크롤링·매크로·데스크탑 프로그램. 하루 수 시간의 반복을 한 번에 없앱니다."
        badges={["1일~ 납기", "Python·n8n·Make", "14일 A/S"]}
        ctaLabel="자동화 문의 →"
        ctaHref={`/${locale}/quote`}
        imageSrc="/images/services/automation-hero.png"
        imageAlt="자동화 개발팀"
      />

      {/* ── 신뢰 수치 ── */}
      <TrustNumbers accentColor={ACCENT} items={TRUST} />

      {/* ── Before / After 케이스 ── */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Before / After
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              이런 일을 자동화합니다
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CASES.map((c) => (
              <div key={c.title} className="border border-[#E5E7EB] rounded-2xl p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{c.icon}</span>
                  <h3 className="text-[15px] font-bold text-[#111]">{c.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#FEF2F2] rounded-xl p-3">
                    <p className="text-[10px] font-bold text-[#EF4444] mb-1 uppercase tracking-wider">BEFORE</p>
                    <p className="text-[12px] text-[#374151] leading-[1.6]">{c.before}</p>
                  </div>
                  <div
                    className="rounded-xl p-3"
                    style={{ background: ACCENT + "18" }}
                  >
                    <p
                      className="text-[10px] font-bold mb-1 uppercase tracking-wider"
                      style={{ color: ACCENT }}
                    >
                      AFTER
                    </p>
                    <p className="text-[12px] text-[#374151] leading-[1.6]">{c.after}</p>
                  </div>
                </div>
                <div
                  className="text-[12px] font-semibold px-3 py-1.5 rounded-full inline-block"
                  style={{ background: ACCENT + "18", color: ACCENT }}
                >
                  💡 {c.saving}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 시간 절약 계산 ── */}
      <section className="bg-[#111] text-white py-16 md:py-20 text-center">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-5"
            style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
          >
            Time Savings
          </p>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontSize: "clamp(24px,4vw,44px)" }}
          >
            하루 <span style={{ color: ACCENT }}>3시간</span> × 365일
          </h2>
          <p
            className="font-bold mb-4"
            style={{ fontSize: "clamp(32px,6vw,72px)", color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
          >
            = 1,095시간/년
          </p>
          <p className="text-[#9CA3AF] text-[15px] max-w-[40ch] mx-auto leading-[1.7]">
            그 시간을 매출·성장·쉬는 시간에 쓰세요.<br />
            자동화는 한 번 만들면 계속 일합니다.
          </p>
        </div>
      </section>

      {/* ── 기술 스택 ── */}
      <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-20">
          <div className="text-center mb-10">
            <p
              className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
              style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
            >
              Tech Stack
            </p>
            <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
              사용하는 기술 스택
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {STACK.map((s) => (
              <div
                key={s.name}
                className="border rounded-xl px-6 py-4 text-center min-w-[120px] bg-white"
                style={{ borderColor: ACCENT + "44" }}
              >
                <p
                  className="text-[15px] font-bold mb-1"
                  style={{ color: ACCENT, fontFamily: "var(--font-jetbrains)" }}
                >
                  {s.name}
                </p>
                <p className="text-[11px] text-[#6B7280]">{s.desc}</p>
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
        headline="지금 자동화할 업무가 있나요?"
        sub="24시간 안에 견적 · 빠르면 1일 안에 결과물"
        ctaLabel="자동화 문의 →"
        ctaHref={`/${locale}/quote`}
      />

      <AioFooter locale={locale} />
    </div>
  );
}
