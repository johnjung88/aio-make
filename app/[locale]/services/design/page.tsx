import Link from "next/link";
import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/design",
    title: isKo ? "디자인 서비스 — AIO" : "Design Services — AIO",
    description: isKo ? "로고·명함, 상세페이지, PPT — 감각을 입히는 분야." : "Logo, business cards, detail pages, and presentations.",
  });
}

type SubService = { num: string; name: string; nameEn: string; desc: string; priceMan: string; priceCheon: string; days: string; benefit: string };

const subs: SubService[] = [
  { num: "01", name: "로고·명함", nameEn: "brand brief", desc: "새 브랜드의 첫인상을 한 세트로", priceMan: "19", priceCheon: "", days: "3-7일", benefit: "로고 · 명함 · 컬러·타이포 가이드" },
  { num: "02", name: "상세페이지", nameEn: "detail page", desc: "스크롤 한 번에, 결제 버튼까지", priceMan: "4", priceCheon: "9", days: "1-3일", benefit: "쇼핑몰 · 랜딩 · 이벤트 페이지" },
  { num: "03", name: "PPT", nameEn: "presentation", desc: "한 장이 결정짓는 자리 — 발표·제안·IR", priceMan: "4", priceCheon: "", days: "1-5일", benefit: "발표 자료 · 제안서 · IR Deck" },
];

const steps = [
  { step: "01", title: "의뢰", desc: "원하는 무드·참고 자료 전달" },
  { step: "02", title: "견적", desc: "24시간 안에 가격·일정 회신" },
  { step: "03", title: "초안", desc: "1차 시안 공유 + 피드백" },
  { step: "04", title: "납품", desc: "원본 파일과 함께" },
  { step: "05", title: "유지보수", desc: "1개월 무상 + 텔레그램 상시" },
];

const faqs = [
  { q: "수정은 몇 회까지 가능한가요?", a: "초안 · 1차 · 최종 분기점에서 무제한. 큰 방향 전환은 별도 협의." },
  { q: "원본 파일(AI / PSD)도 받을 수 있나요?", a: "네, 모든 작업물의 편집 가능한 원본 파일을 함께 전달드립니다." },
  { q: "상세페이지는 어디서 사용할 수 있나요?", a: "스마트스토어 · 쿠팡 · 카페24 · 자체 쇼핑몰 등 어디든 사용 가능합니다." },
  { q: "결제는 어떻게 진행하나요?", a: "착수 50% / 납품 50%. 세금계산서 발행 가능." },
];

export default async function DesignPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main style={{ background: "var(--tone-life-cream)", color: "var(--tone-life-ink)", minHeight: "100vh" }}>
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
    <section className="relative overflow-hidden text-center">
      <div className="aio-atmos" aria-hidden>
        <div className="aio-glow" style={{ top: -130, left: "50%", transform: "translateX(-50%)", width: 660, height: 460, borderRadius: "50%", background: "radial-gradient(ellipse, color-mix(in srgb, var(--tone-life-rose) 16%, transparent), transparent 70%)", filter: "blur(46px)" }} />
        <div style={{ bottom: -90, right: -70, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--tone-life-olive) 14%, transparent), transparent 70%)", filter: "blur(46px)" }} />
        <div style={{ bottom: -90, left: -70, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--tone-life-rose) 10%, transparent), transparent 70%)", filter: "blur(46px)" }} />
      </div>
      <div className="max-w-[1100px] mx-auto relative z-10" style={{ padding: "var(--space-section) var(--space-edge)" }}>
        <div className="aio-rise mb-8 md:mb-10 inline-flex items-center gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-jakarta)", fontSize: 11, color: "var(--tone-life-ink-3)", letterSpacing: "0.28em", textTransform: "uppercase", animationDelay: "0.05s" }}>
          <span style={{ width: 24, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
          Design · 03 Sub-services
          <span style={{ width: 24, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
        </div>
        <h1 className="aio-rise font-normal mb-7 md:mb-9 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-fraunces)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", letterSpacing: "-0.014em", color: "var(--tone-life-ink)", fontWeight: 400, animationDelay: "0.14s" }}>
          결정에 영향을 주는
          <br />
          <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)", fontWeight: 500 }}>감각</em>
        </h1>
        <p className="aio-rise mb-10 md:mb-14 mx-auto max-w-[60ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-life-ink-2)", animationDelay: "0.22s" }}>
          로고에서 상세페이지·PPT까지, 보이는 것의 첫인상을 만듭니다
          <br />
          <strong style={{ color: "var(--tone-life-ink)", fontWeight: 600 }}>예쁜 것을 넘어, 구매 결정을 돕는 흐름까지</strong>
        </p>
        <div className="aio-rise inline-flex flex-col md:flex-row gap-3 max-w-[280px] md:max-w-none w-full md:w-auto items-stretch md:items-center justify-center" style={{ animationDelay: "0.3s" }}>
          <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-life-rose)", color: "var(--tone-life-cream)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 999 }}>
            견적 문의 →
          </Link>
          <Link href="#subs" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-life-ink)", border: "1px solid var(--tone-life-line-2)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 999 }}>
            분야 더 보기
          </Link>
        </div>
      </div>
    </section>
  );
}

function SubServicesSection() {
  return (
    <section id="subs" className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <SectionEyebrow label="Sub-services · 03" />
      <h2 className="font-normal mb-8 md:mb-12 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-fraunces)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", letterSpacing: "-0.012em", color: "var(--tone-life-ink)", fontWeight: 400 }}>
        세 갈래의{" "}
        <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)", fontWeight: 500 }}>감각</em>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {subs.map((s) => <SubCard key={s.num} s={s} />)}
      </div>
    </section>
  );
}

function SubCard({ s }: { s: SubService }) {
  return (
    <div className="transition-all hover:-translate-y-1 text-center flex flex-col items-center" style={{ padding: "clamp(28px, 3.2vw, 44px) clamp(20px, 2.5vw, 32px)", background: "var(--tone-life-cream-2)", border: "1px solid var(--tone-life-line)", borderRadius: 16 }}>
      <span className="mb-2" style={{ fontFamily: "var(--font-jakarta)", fontSize: 12, color: "var(--tone-life-ink-3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{s.num}</span>
      <div className="mb-3 inline-flex items-baseline gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-fraunces)", fontSize: "var(--text-h2)", lineHeight: 1.1, color: "var(--tone-life-ink)", fontWeight: 400, letterSpacing: "-0.012em" }}>
        {s.name}
        <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: "0.5em", color: "var(--tone-life-ink-3)", fontWeight: 400 }}>{s.nameEn}</em>
      </div>
      <p className="mb-4 max-w-[36ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--tone-life-ink-2)" }}>{s.desc}</p>
      <div className="mb-5 px-4 py-2" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", color: "var(--tone-life-olive)", lineHeight: 1.55, background: "rgba(123,142,63,0.08)", borderRadius: 999 }}>{s.benefit}</div>
      <div className="mt-auto pt-5 w-full inline-flex flex-col items-center gap-2" style={{ borderTop: "1px solid var(--tone-life-line)" }}>
        <span style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 600, color: "var(--tone-life-ink)" }}>
          <span style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.6em", fontWeight: 500, color: "var(--tone-life-rose)" }}>{s.priceMan}</span>
          <span style={{ marginLeft: 2 }}>만</span>
          {s.priceCheon && (<>{" "}<span style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.6em", fontWeight: 500, color: "var(--tone-life-rose)" }}>{s.priceCheon}</span><span style={{ marginLeft: 2 }}>천</span></>)}
          <span style={{ marginLeft: 2, color: "var(--tone-life-ink-3)", fontWeight: 400 }}>원~</span>
        </span>
        <span style={{ fontFamily: "var(--font-jakarta)", fontSize: 11, color: "var(--tone-life-ink-3)", letterSpacing: "0.18em" }}>{s.days}</span>
        <span className="mt-2" style={{ padding: "3px 12px", background: "var(--tone-life-rose-soft)", color: "var(--tone-life-rose)", borderRadius: 999, fontFamily: "var(--font-pretendard)", fontSize: 11, fontWeight: 500 }}>의뢰 가능</span>
      </div>
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <SectionEyebrow label="Process · 05 steps" />
      <h2 className="font-normal mb-10 md:mb-14" style={{ fontFamily: "var(--font-fraunces)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-life-ink)", fontWeight: 400 }}>
        의뢰부터 운영까지{" "}
        <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)", fontWeight: 500 }}>5단계</em>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {steps.map((p, i) => (
          <div key={p.step} className={i === 4 ? "col-span-2 md:col-span-1" : ""} style={{ padding: "clamp(20px, 2.5vw, 28px)", background: "var(--tone-life-cream-2)", border: "1px solid var(--tone-life-line)", borderRadius: 12 }}>
            <div className="mb-3" style={{ fontFamily: "var(--font-jakarta)", fontSize: 11, color: "var(--tone-life-rose)", letterSpacing: "0.18em", textTransform: "uppercase" }}>{p.step}</div>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-fraunces)", fontSize: "var(--text-h3)", color: "var(--tone-life-ink)", fontWeight: 400, lineHeight: 1.2 }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", lineHeight: 1.65, color: "var(--tone-life-ink-3)" }}>{p.desc}</p>
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
      <h2 className="font-normal mb-10 md:mb-14 text-center" style={{ fontFamily: "var(--font-fraunces)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-life-ink)", fontWeight: 400 }}>
        자주 묻는 질문
      </h2>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="group" style={{ padding: "clamp(18px, 2vw, 24px) clamp(20px, 2.5vw, 28px)", background: "var(--tone-life-cream-2)", border: "1px solid var(--tone-life-line)", borderRadius: 12 }}>
            <summary className="cursor-pointer flex items-center justify-between gap-3 text-left [&::-webkit-details-marker]:hidden" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 500, color: "var(--tone-life-ink)", listStyle: "none" }}>
              <span>{f.q}</span>
              <span className="transition-transform group-open:rotate-45 shrink-0" style={{ fontFamily: "var(--font-fraunces)", color: "var(--tone-life-rose)", fontSize: 26, lineHeight: 1, width: 24, textAlign: "center" }}>+</span>
            </summary>
            <p className="mt-4 text-left" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.8, color: "var(--tone-life-ink-2)" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-life-line)" }}>
      <h2 className="font-normal mb-6 md:mb-8 mx-auto" style={{ fontFamily: "var(--font-fraunces)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", color: "var(--tone-life-ink)", fontWeight: 400, letterSpacing: "-0.018em" }}>
        감각을 입힐{" "}
        <em style={{ fontStyle: "italic", color: "var(--tone-life-rose)", fontWeight: 500 }}>작업</em>이<br />있나요?
      </h2>
      <p className="mb-10 mx-auto max-w-[48ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-life-ink-2)" }}>
        24시간 안에 견적 회신 · 1-7일 안에 결과물
      </p>
      <div className="inline-flex flex-col md:flex-row gap-3 max-w-[280px] md:max-w-none w-full md:w-auto">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-life-rose)", color: "var(--tone-life-cream)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 999 }}>
          견적 문의 →
        </Link>
        <Link href={`/${locale}/#toc`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-life-ink)", border: "1px solid var(--tone-life-line-2)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 999 }}>
          다른 분야 보기
        </Link>
      </div>
    </section>
  );
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-10 md:mb-14 inline-flex items-center gap-3" style={{ fontFamily: "var(--font-jakarta)", fontSize: 11, color: "var(--tone-life-ink-3)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
      <span style={{ width: 24, height: 1, background: "var(--tone-life-rose)", display: "inline-block" }} />
      {label}
    </div>
  );
}
