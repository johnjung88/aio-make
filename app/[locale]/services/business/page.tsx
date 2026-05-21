import Link from "next/link";
import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/business",
    title: isKo ? "비즈니스 서비스 — AIO" : "Business Services — AIO",
    description: isKo ? "사업계획서·PPT·정부지원금 — 결정을 돕는 한 장." : "Business plans, presentations, gov-funding documents.",
  });
}

type SubService = { num: string; name: string; nameEn: string; desc: string; priceMan: string; priceCheon: string; days: string; benefit: string };

const subs: SubService[] = [
  { num: "01", name: "사업계획서", nameEn: "business plan", desc: "투자 받기 위한 IR Deck부터 사업 제안서까지", priceMan: "49", priceCheon: "", days: "5-10일", benefit: "IR Deck · 사업 제안서 · 투자 발표" },
  { num: "02", name: "발표 자료", nameEn: "presentation", desc: "한 장이 결정짓는 자리, 발표·세미나·제안", priceMan: "4", priceCheon: "", days: "1-3일", benefit: "발표 · 세미나 · 제안서" },
  { num: "03", name: "정부지원금", nameEn: "gov. funding", desc: "심사 통과 가능 수준의 서류 일체", priceMan: "99", priceCheon: "", days: "7-14일", benefit: "K-스타트업 · 중기부 · 지자체" },
];

const steps = [
  { step: "01", title: "의뢰", desc: "사업·심사 기준·기한 전달" },
  { step: "02", title: "견적", desc: "24시간 안에 가격·일정 회신" },
  { step: "03", title: "초안", desc: "구조·핵심 메시지 합의" },
  { step: "04", title: "납품", desc: "편집 가능한 원본 파일 포함" },
  { step: "05", title: "유지보수", desc: "심사·발표 직전 수정 무상" },
];

const faqs = [
  { q: "발표 직전 수정도 가능한가요?", a: "심사·발표 1주일 전까지 무상 수정. 큰 방향 전환은 별도 협의." },
  { q: "정부지원금 서류는 어떤 사업이 가능한가요?", a: "K-스타트업, 창업도약패키지, 청년창업, 지자체 지원사업 등 대부분 가능. 사전 상담 권장." },
  { q: "PPT 템플릿만 받을 수 있나요?", a: "네, 마스터 슬라이드 + 디자인 가이드 형태로 전달 가능." },
  { q: "결제는 어떻게 진행하나요?", a: "착수 50% / 납품 50%. 세금계산서 발행 가능." },
];

export default async function BusinessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main style={{ background: "var(--tone-consult-paper)", color: "var(--tone-consult-ink)", minHeight: "100vh" }}>
      <HeroSection locale={locale} />
      <SubServicesSection />
      <ProcessSection />
      <FaqSection />
      <CtaSection locale={locale} />
    </main>
  );
}

function HeroSection({ locale }: { locale: string }) {
  return (
    <section className="max-w-[1100px] mx-auto relative text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <div className="mb-8 md:mb-10 inline-flex items-center gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.28em", textTransform: "uppercase" }}>
        <span style={{ width: 24, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        Business · 03 Sub-services
        <span style={{ width: 24, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
      </div>
      <h1 className="font-normal mb-7 md:mb-9 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", letterSpacing: "-0.018em", color: "var(--tone-consult-ink)", fontWeight: 700 }}>
        결정을 돕는<br />
        <span style={{ color: "var(--tone-consult-navy)" }}>한 장</span>
      </h1>
      <p className="mb-10 md:mb-14 mx-auto max-w-[60ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-consult-ink-2)" }}>
        사업계획서·발표 자료·정부지원금 — 글과 숫자, 도식으로 결정을 만듭니다
        <br />
        <strong style={{ color: "var(--tone-consult-ink)", fontWeight: 600 }}>심사위원이 멈추는 한 장, 임원진이 끄덕이는 한 장</strong>
      </p>
      <div className="inline-flex flex-col md:flex-row gap-3 max-w-[280px] md:max-w-none w-full md:w-auto items-stretch md:items-center justify-center">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-consult-navy)", color: "var(--tone-consult-paper)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 2 }}>
          견적 문의 →
        </Link>
        <Link href="#subs" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-consult-ink)", border: "1px solid var(--tone-consult-line-2)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 2 }}>
          분야 더 보기
        </Link>
      </div>
    </section>
  );
}

function SubServicesSection() {
  return (
    <section id="subs" className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <SectionEyebrow label="Sub-services · 03" />
      <h2 className="font-normal mb-8 md:mb-12 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", letterSpacing: "-0.012em", color: "var(--tone-consult-ink)", fontWeight: 700 }}>
        세 갈래의 <span style={{ color: "var(--tone-consult-navy)" }}>비즈니스 분야</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {subs.map((s) => <SubCard key={s.num} s={s} />)}
      </div>
    </section>
  );
}

function SubCard({ s }: { s: SubService }) {
  return (
    <div className="transition-all hover:-translate-y-1 text-center flex flex-col items-center" style={{ padding: "clamp(28px, 3vw, 40px) clamp(20px, 2.5vw, 32px)", background: "var(--tone-consult-paper-2)", border: "1px solid var(--tone-consult-line)", borderRadius: 2 }}>
      <span className="mb-2" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 12, color: "var(--tone-consult-ink-3)", letterSpacing: "0.18em" }}>{s.num}</span>
      <div className="mb-3 inline-flex items-baseline gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h2)", lineHeight: 1.1, color: "var(--tone-consult-ink)", fontWeight: 700, letterSpacing: "-0.012em" }}>
        {s.name}
        <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "0.5em", color: "var(--tone-consult-ink-3)", fontWeight: 500 }}>{s.nameEn}</span>
      </div>
      <p className="mb-4 max-w-[36ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--tone-consult-ink-2)" }}>{s.desc}</p>
      <div className="mb-5 px-4 py-2" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", color: "var(--tone-consult-navy)", lineHeight: 1.55, background: "var(--tone-consult-gold-soft)", borderRadius: 2 }}>{s.benefit}</div>
      <div className="mt-auto pt-5 w-full inline-flex flex-col items-center gap-2" style={{ borderTop: "1px solid var(--tone-consult-line)" }}>
        <span style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 600, color: "var(--tone-consult-ink)" }}>
          <span style={{ fontFamily: "var(--font-pretendard)", fontSize: "1.6em", fontWeight: 700, color: "var(--tone-consult-navy)" }}>{s.priceMan}</span>
          <span style={{ marginLeft: 2 }}>만</span>
          {s.priceCheon && (<>{" "}<span style={{ fontFamily: "var(--font-pretendard)", fontSize: "1.6em", fontWeight: 700, color: "var(--tone-consult-navy)" }}>{s.priceCheon}</span><span style={{ marginLeft: 2 }}>천</span></>)}
          <span style={{ marginLeft: 2, color: "var(--tone-consult-ink-3)", fontWeight: 400 }}>원~</span>
        </span>
        <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.18em" }}>{s.days}</span>
        <span className="mt-2" style={{ padding: "3px 12px", background: "var(--tone-consult-gold-soft)", color: "var(--tone-consult-navy)", borderRadius: 2, fontFamily: "var(--font-pretendard)", fontSize: 11, fontWeight: 600 }}>의뢰 가능</span>
      </div>
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <SectionEyebrow label="Process · 05 steps" />
      <h2 className="font-normal mb-10 md:mb-14" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-consult-ink)", fontWeight: 700 }}>
        의뢰부터 발표까지 <span style={{ color: "var(--tone-consult-navy)" }}>5단계</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {steps.map((p, i) => (
          <div key={p.step} className={i === 4 ? "col-span-2 md:col-span-1" : ""} style={{ padding: "clamp(20px, 2.5vw, 28px)", background: "var(--tone-consult-paper-2)", border: "1px solid var(--tone-consult-line)", borderRadius: 2 }}>
            <div className="mb-3" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-gold)", letterSpacing: "0.18em" }}>{p.step}</div>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h3)", color: "var(--tone-consult-ink)", fontWeight: 700, lineHeight: 1.2 }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", lineHeight: 1.65, color: "var(--tone-consult-ink-3)" }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="max-w-[900px] mx-auto" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <div className="text-center"><SectionEyebrow label="FAQ" /></div>
      <h2 className="font-normal mb-10 md:mb-14 text-center" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-consult-ink)", fontWeight: 700 }}>
        자주 묻는 질문
      </h2>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="group" style={{ padding: "clamp(18px, 2vw, 24px) clamp(20px, 2.5vw, 28px)", background: "var(--tone-consult-paper-2)", border: "1px solid var(--tone-consult-line)", borderRadius: 2 }}>
            <summary className="cursor-pointer flex items-center justify-between gap-3 text-left [&::-webkit-details-marker]:hidden" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 600, color: "var(--tone-consult-ink)", listStyle: "none" }}>
              <span>{f.q}</span>
              <span className="transition-transform group-open:rotate-45 shrink-0" style={{ fontFamily: "var(--font-pretendard)", color: "var(--tone-consult-navy)", fontSize: 24, lineHeight: 1, width: 24, textAlign: "center", fontWeight: 300 }}>+</span>
            </summary>
            <p className="mt-4 text-left" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.8, color: "var(--tone-consult-ink-2)" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-consult-line)" }}>
      <h2 className="font-normal mb-6 md:mb-8 mx-auto" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", color: "var(--tone-consult-ink)", fontWeight: 700, letterSpacing: "-0.018em" }}>
        결정짓는 한 장이<br />필요하신가요?
      </h2>
      <p className="mb-10 mx-auto max-w-[48ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-consult-ink-2)" }}>
        24시간 안에 견적 회신 · 1-14일 안에 결과물
      </p>
      <div className="inline-flex flex-col md:flex-row gap-3 max-w-[280px] md:max-w-none w-full md:w-auto">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-consult-navy)", color: "var(--tone-consult-paper)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 2 }}>
          견적 문의 →
        </Link>
        <Link href={`/${locale}/#toc`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-consult-ink)", border: "1px solid var(--tone-consult-line-2)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 2 }}>
          다른 분야 보기
        </Link>
      </div>
    </section>
  );
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-10 md:mb-14 inline-flex items-center gap-3" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
      <span style={{ width: 24, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
      {label}
    </div>
  );
}
