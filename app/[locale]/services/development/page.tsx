import Link from "next/link";
import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/development",
    title: isKo ? "개발 서비스 — AIO" : "Development Services — AIO",
    description: isKo ? "웹·앱·자동화·프로그램 — 코드로 만드는 모든 것." : "Web, app, automation, programs — built in code.",
  });
}

type SubService = {
  num: string; name: string; nameEn: string; desc: string;
  priceMan?: string; priceCheon?: string; priceText?: string; days: string; benefit: string; available: boolean;
};

const subs: SubService[] = [
  { num: "01", name: "웹사이트", nameEn: "website", desc: "운영 가능한 홈페이지를 빠르게 — 기획부터 배포까지", priceMan: "9", priceCheon: "9", days: "1-5일", benefit: "검색 노출 · 모바일 최적화 · 관리자 페이지", available: true },
  { num: "02", name: "쇼핑몰", nameEn: "shopping mall", desc: "카페24·자사몰, 상품 등록·결제까지 한 번에", priceText: "별도 견적", days: "5-10일", benefit: "카페24 · 상품 등록 · 결제 연동", available: true },
  { num: "03", name: "자동화", nameEn: "automation", desc: "반복 업무를 코드에게 — 매크로·크롤링·연동", priceMan: "19", priceCheon: "", days: "3-7일", benefit: "노션·구글시트·텔레그램 연동", available: true },
  { num: "04", name: "프로그램", nameEn: "program", desc: "업무에 필요한 데스크탑·CLI 도구를 직접", priceMan: "29", priceCheon: "", days: "5-14일", benefit: "Windows·맥 데스크탑 · 업무 매크로", available: true },
  { num: "05", name: "앱", nameEn: "app", desc: "iOS·Android 모바일 앱 — 곧 합류합니다", priceText: "준비 중", days: "COMING SOON", benefit: "iOS · Android · 푸시 알림", available: false },
];

const steps = [
  { step: "01", title: "의뢰", desc: "필요한 것을 한 문장으로 전달" },
  { step: "02", title: "견적", desc: "24시간 안에 가격·일정 회신" },
  { step: "03", title: "작업", desc: "매일 진행 상황 공유" },
  { step: "04", title: "납품", desc: "운영 가능한 상태로 손에" },
  { step: "05", title: "유지보수", desc: "1개월 무상 + 텔레그램 상시" },
];

const faqs = [
  { q: "수정은 몇 회까지 가능한가요?", a: "주요 분기점(시안 · 1차 결과물 · 최종)에서 무제한. 큰 방향 전환은 별도 협의." },
  { q: "도메인·서버는 직접 준비해야 하나요?", a: "Vercel·카페24 등 권장 인프라 셋업까지 포함. 도메인 구매만 의뢰인이 진행." },
  { q: "유지보수 범위는?", a: "1개월 무상 = 코드 버그 수정·도메인 이슈·내용 소소 변경. 신규 기능은 별도 견적." },
  { q: "결제는 어떻게 진행하나요?", a: "착수 50% / 납품 50%. 세금계산서 발행 가능." },
];

export default async function DevelopmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main style={{ background: "var(--tone-ide-bg)", color: "var(--tone-ide-fg)", minHeight: "100vh" }}>
      <HeroSection locale={locale} />
      <SubServicesSection />
      <ProcessSection />
      <FaqSection />
      <CtaSection locale={locale} />
    </main>
  );
}

/* Hero — IDE 톤 좌정렬 (코드 에디터 무드) */
function HeroSection({ locale }: { locale: string }) {
  return (
    <section className="max-w-[1100px] mx-auto relative" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <div className="mb-8 md:mb-10 inline-flex items-center gap-2 flex-wrap" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-fg-3)", letterSpacing: "0.06em" }}>
        <span style={{ color: "var(--tone-ide-mint)" }}>~/services</span>
        <span style={{ color: "var(--tone-ide-fg-faint)" }}>/</span>
        <span>development</span>
        <span className="ml-3 inline-flex items-center gap-1.5" style={{ padding: "2px 8px", background: "var(--tone-ide-mint-soft)", color: "var(--tone-ide-mint)", borderRadius: 2, fontSize: 10.5, letterSpacing: "0.18em" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--tone-ide-mint)" }} className="inline-block animate-dot-pulse-mag" />
          LIVE · 04 SUBS
        </span>
      </div>
      <h1 className="font-normal mb-7 md:mb-9" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", letterSpacing: "-0.014em", color: "var(--tone-ide-fg)", fontWeight: 500 }}>
        필요한 것이,
        <br />
        <span style={{ color: "var(--tone-ide-mint)" }}>5일 안에</span> 코드로
      </h1>
      <p className="mb-10 md:mb-14 max-w-[60ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-ide-fg-2)" }}>
        웹·앱·자동화·프로그램 — 네 갈래의 코드 작업을 한 손에서
        <br />
        <strong style={{ color: "var(--tone-ide-fg)", fontWeight: 600 }}>매일 진행 상황을 공유하고, 1개월 무상 유지보수까지</strong>
      </p>
      <div className="flex flex-col md:flex-row gap-3 max-w-[280px] md:max-w-none items-stretch md:items-center">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 2 }}>
          견적 문의 →
        </Link>
        <Link href="#subs" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-ide-fg)", border: "1px solid var(--tone-ide-line)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 2 }}>
          분야 더 보기
        </Link>
      </div>
    </section>
  );
}

function SubServicesSection() {
  return (
    <section id="subs" className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <SectionEyebrow label="// sub-services" />
      <h2 className="font-normal mb-8 md:mb-12 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", letterSpacing: "-0.012em", color: "var(--tone-ide-fg)", fontWeight: 500 }}>
        코드로 <span style={{ color: "var(--tone-ide-mint)" }}>만드는 것들</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {subs.map((s) => <SubCard key={s.num} s={s} />)}
      </div>
    </section>
  );
}

function SubCard({ s }: { s: SubService }) {
  const dim = !s.available;
  return (
    <div
      className={`group transition-all text-center flex flex-col items-center ${dim ? "md:col-span-2" : "hover:-translate-y-1"}`}
      style={{ padding: "clamp(28px, 3.2vw, 44px) clamp(20px, 2.5vw, 32px)", background: "var(--tone-ide-bg-2)", border: dim ? "1px dashed var(--tone-ide-line)" : "1px solid var(--tone-ide-line)", borderRadius: 4, opacity: dim ? 0.82 : 1 }}
    >
      <span className="mb-2" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-fg-3)", letterSpacing: "0.18em" }}>{s.num}</span>
      <div className="mb-3 inline-flex items-baseline gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "var(--text-h2)", lineHeight: 1.1, color: dim ? "var(--tone-ide-fg-2)" : "var(--tone-ide-fg)", fontWeight: 500, letterSpacing: "-0.012em" }}>
        {s.name}
        <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.5em", color: "var(--tone-ide-fg-3)", fontStyle: "italic", fontWeight: 400 }}>{s.nameEn}</span>
      </div>
      <p className="mb-4 max-w-[36ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--tone-ide-fg-2)" }}>{s.desc}</p>
      <div className="mb-5 px-4 py-2" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", color: dim ? "var(--tone-ide-fg-3)" : "var(--tone-ide-syntax-string)", lineHeight: 1.55, background: "var(--tone-ide-bg-3)", borderRadius: 2 }}>{s.benefit}</div>
      <div className="mt-auto pt-5 w-full inline-flex flex-col items-center gap-2" style={{ borderTop: dim ? "1px dashed var(--tone-ide-line)" : "1px solid var(--tone-ide-line)" }}>
        <span style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 600, color: "var(--tone-ide-fg)" }}>
          {s.priceText ? (
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: "1.05em", fontWeight: 500, color: dim ? "var(--tone-ide-fg-3)" : "var(--tone-ide-mint)", letterSpacing: "0.01em" }}>{s.priceText}</span>
          ) : (
            <>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: "1.6em", fontWeight: 500, color: "var(--tone-ide-mint)" }}>{s.priceMan}</span>
              <span style={{ marginLeft: 2 }}>만</span>
              {s.priceCheon && (<>{" "}<span style={{ fontFamily: "var(--font-jetbrains)", fontSize: "1.6em", fontWeight: 500, color: "var(--tone-ide-mint)" }}>{s.priceCheon}</span><span style={{ marginLeft: 2 }}>천</span></>)}
              <span style={{ marginLeft: 2, color: "var(--tone-ide-fg-3)", fontWeight: 400 }}>원~</span>
            </>
          )}
        </span>
        <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-3)", letterSpacing: "0.18em" }}>{s.days}</span>
        <span className="mt-2" style={{ padding: "3px 12px", background: dim ? "var(--tone-ide-bg-3)" : "var(--tone-ide-mint-soft)", color: dim ? "var(--tone-ide-fg-3)" : "var(--tone-ide-mint)", borderRadius: 2, fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.18em" }}>{s.available ? "의뢰 가능" : "준비 중"}</span>
      </div>
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <SectionEyebrow label="// 05 steps" />
      <h2 className="font-normal mb-10 md:mb-14" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-ide-fg)", fontWeight: 500 }}>
        의뢰부터 운영까지 <span style={{ color: "var(--tone-ide-mint)" }}>5단계</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {steps.map((p, i) => (
          <div key={p.step} className={i === 4 ? "col-span-2 md:col-span-1" : ""} style={{ padding: "clamp(20px, 2.5vw, 28px)", background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 4 }}>
            <div className="mb-3" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-mint)", letterSpacing: "0.18em" }}>{p.step}</div>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "var(--text-h3)", color: "var(--tone-ide-fg)", fontWeight: 500, lineHeight: 1.2 }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", lineHeight: 1.65, color: "var(--tone-ide-fg-3)" }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="max-w-[900px] mx-auto" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <div className="text-center"><SectionEyebrow label="// FAQ" /></div>
      <h2 className="font-normal mb-10 md:mb-14 text-center" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-ide-fg)", fontWeight: 500 }}>
        자주 묻는 질문
      </h2>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="group" style={{ padding: "clamp(18px, 2vw, 24px) clamp(20px, 2.5vw, 28px)", background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 4 }}>
            <summary className="cursor-pointer flex items-center justify-between gap-3 text-left [&::-webkit-details-marker]:hidden" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 500, color: "var(--tone-ide-fg)", listStyle: "none" }}>
              <span>{f.q}</span>
              <span className="transition-transform group-open:rotate-45 shrink-0" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-ide-mint)", fontSize: 22, lineHeight: 1, width: 24, textAlign: "center" }}>+</span>
            </summary>
            <p className="mt-4 text-left" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.8, color: "var(--tone-ide-fg-2)" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-ide-line)" }}>
      <h2 className="font-normal mb-6 md:mb-8 mx-auto" style={{ fontFamily: "var(--font-jetbrains)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", color: "var(--tone-ide-fg)", fontWeight: 500, letterSpacing: "-0.018em" }}>
        코드로 만들 게<br />있나요?
      </h2>
      <p className="mb-10 mx-auto max-w-[48ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-ide-fg-2)" }}>
        24시간 안에 견적 회신 · 5일 안에 첫 결과물
      </p>
      <div className="inline-flex flex-col md:flex-row gap-3 max-w-[280px] md:max-w-none w-full md:w-auto">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 2 }}>
          견적 문의 →
        </Link>
        <Link href={`/${locale}/#toc`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-ide-fg)", border: "1px solid var(--tone-ide-line)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 2 }}>
          다른 분야 보기
        </Link>
      </div>
    </section>
  );
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-10 md:mb-14 inline-flex items-center gap-2" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-3)", letterSpacing: "0.22em" }}>
      <span style={{ width: 32, height: 1, background: "var(--tone-ide-line)", display: "inline-block" }} />
      {label}
    </div>
  );
}
