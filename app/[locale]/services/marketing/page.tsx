import Link from "next/link";
import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/marketing",
    title: isKo ? "마케팅 서비스 — AIO" : "Marketing Services — AIO",
    description: isKo
      ? "블로그·SNS·영상 채널 운영 대행 — 고객을 부르는 분야."
      : "Blog, SNS, and video channel management services.",
  });
}

type Sub = { num: string; name: string; nameEn: string; desc: string; includes: string };

const subs: Sub[] = [
  { num: "01", name: "블로그 운영 대행", nameEn: "blog ops", desc: "네이버 블로그를 매주 채웁니다 — 기획·작성·발행까지", includes: "키워드 · 포스팅 · 이미지 · 발행" },
  { num: "02", name: "SNS 운영 대행", nameEn: "sns ops", desc: "인스타·스레드를 브랜드 톤으로 꾸준히", includes: "콘텐츠 기획 · 제작 · 발행 · 소통" },
  { num: "03", name: "영상 채널 운영 대행", nameEn: "channel ops", desc: "유튜브·릴스 채널을 키웁니다 — 기획·편집·업로드", includes: "기획 · 편집 · 업로드 · 분석" },
];

const steps = [
  { step: "01", title: "진단", desc: "채널·경쟁사·타깃 분석" },
  { step: "02", title: "전략", desc: "주제·발행 캘린더 수립" },
  { step: "03", title: "제작", desc: "콘텐츠 기획·제작" },
  { step: "04", title: "운영", desc: "일정대로 발행·소통" },
  { step: "05", title: "리포트", desc: "월간 성과 리포트" },
];

const values = [
  { title: "직접 운영한 노하우", desc: "AIO가 자체 채널을 운영하며 검증한 방식 그대로 적용합니다." },
  { title: "브랜드 톤 유지", desc: "맡기셔도 어색하지 않게 — 브랜드의 말투와 결을 지킵니다." },
  { title: "월간 성과 리포트", desc: "조회·유입·전환을 매달 정리해, 다음 달 방향을 함께 잡습니다." },
];

const faqs = [
  { q: "최소 계약 기간이 있나요?", a: "운영 대행은 월 단위입니다. 보통 3개월 이상 운영해야 성과가 쌓입니다. 1개월 단위 진행도 가능." },
  { q: "콘텐츠 소재는 누가 준비하나요?", a: "기획·작성은 저희가 합니다. 제품 사진·핵심 정보만 공유해 주시면 됩니다." },
  { q: "어떤 플랫폼을 운영하나요?", a: "네이버 블로그, 인스타그램·스레드, 유튜브·릴스 중심. 다른 채널도 상담 가능." },
  { q: "비용은 어떻게 책정되나요?", a: "운영 채널 수·발행 빈도에 따라 월 정액으로 책정. 상담 후 견적 회신." },
];

export default async function MarketingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main style={{ background: "var(--tone-consult-paper)", color: "var(--tone-consult-ink)", minHeight: "100vh" }}>
      <ConsultNav locale={locale} />
      <HeroSection locale={locale} />
      <SubServicesSection />
      <ValuesSection />
      <ProcessSection />
      <FaqSection />
      <CtaSection locale={locale} />
    </main>
  );
}

function ConsultNav({ locale }: { locale: string }) {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between"
      style={{
        padding: "14px clamp(20px, 4vw, 48px)",
        background: "color-mix(in srgb, var(--tone-consult-paper) 85%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--tone-consult-line-2)",
      }}
    >
      <Link href={`/${locale}`} style={{ fontFamily: "var(--font-pretendard)", fontSize: 16, fontWeight: 700, letterSpacing: "0.02em", color: "var(--tone-consult-ink)" }}>
        AIO <span style={{ color: "var(--tone-consult-navy)" }}>AGENCY</span>
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        <Link href={`/${locale}/#toc`} className="hidden sm:inline transition-colors hover:!text-[var(--tone-consult-ink)]" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11.5, color: "var(--tone-consult-ink-3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          분야
        </Link>
        <Link href={`/${locale}/quote`} className="inline-flex items-center gap-2 transition-all hover:-translate-y-0.5" style={{ padding: "8px 18px", background: "var(--tone-consult-navy)", color: "var(--tone-consult-paper)", fontFamily: "var(--font-pretendard)", fontSize: 13, fontWeight: 600, borderRadius: 2 }}>
          운영 상담 →
        </Link>
      </div>
    </nav>
  );
}

function HeroSection({ locale }: { locale: string }) {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderBottom: "1px solid var(--tone-consult-line-2)" }}>
      <div className="mb-7 md:mb-9 inline-flex items-center gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.28em", textTransform: "uppercase" }}>
        <span style={{ width: 24, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
        Marketing · 03 Sub-services
        <span style={{ width: 24, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
      </div>
      <h1 className="font-normal mb-7 md:mb-9 mx-auto max-w-[16ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", letterSpacing: "-0.018em", color: "var(--tone-consult-ink)", fontWeight: 700 }}>
        채널은 맡기고,
        <br />
        <span style={{ color: "var(--tone-consult-navy)" }}>본업에 집중</span>하세요
      </h1>
      <p className="mb-10 md:mb-12 mx-auto max-w-[50ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-consult-ink-2)" }}>
        블로그·SNS·영상 채널을 매달 대신 운영합니다
        <br />
        <strong style={{ color: "var(--tone-consult-ink)", fontWeight: 600 }}>기획부터 발행·리포트까지, 꾸준함이 만드는 유입</strong>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-[300px] sm:max-w-none mx-auto">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-consult-navy)", color: "var(--tone-consult-paper)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 2 }}>
          운영 상담 →
        </Link>
        <Link href="#subs" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-consult-ink)", border: "1px solid var(--tone-consult-line-2)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 2 }}>
          서비스 보기
        </Link>
      </div>
    </section>
  );
}

function SubServicesSection() {
  return (
    <section id="subs" className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <ConsultEyebrow label="// 03 sub-services" />
      <h2 className="font-normal mb-8 md:mb-12 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", letterSpacing: "-0.018em", color: "var(--tone-consult-ink)", fontWeight: 700 }}>
        세 가지 <span style={{ color: "var(--tone-consult-navy)" }}>운영 대행</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {subs.map((s) => (
          <div key={s.num} className="group text-center flex flex-col items-center transition-all hover:-translate-y-1" style={{ padding: "clamp(28px, 3vw, 40px) clamp(20px, 2.5vw, 32px)", background: "var(--tone-consult-paper-2)", border: "1px solid var(--tone-consult-line)", borderRadius: 2 }}>
            <span className="mb-2" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 12, color: "var(--tone-consult-ink-3)", letterSpacing: "0.18em" }}>{s.num}</span>
            <div className="mb-3 flex flex-col items-center gap-1" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h3)", lineHeight: 1.25, color: "var(--tone-consult-ink)", fontWeight: 700, letterSpacing: "-0.012em" }}>
              {s.name}
              <span style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: "0.7em", color: "var(--tone-consult-ink-3)", fontWeight: 500 }}>{s.nameEn}</span>
            </div>
            <p className="mb-4 max-w-[34ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--tone-consult-ink-2)" }}>{s.desc}</p>
            <div className="mb-5 px-4 py-2" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", color: "var(--tone-consult-navy)", lineHeight: 1.55, background: "var(--tone-consult-paper)", border: "1px solid var(--tone-consult-line-2)", borderRadius: 2 }}>{s.includes}</div>
            <div className="mt-auto pt-5 w-full inline-flex flex-col items-center gap-2" style={{ borderTop: "1px solid var(--tone-consult-line-2)" }}>
              <span style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 700, color: "var(--tone-consult-ink)" }}>월 운영</span>
              <span style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.18em" }}>MONTHLY</span>
              <span className="mt-2" style={{ padding: "3px 12px", background: "color-mix(in srgb, var(--tone-consult-navy) 12%, transparent)", color: "var(--tone-consult-navy)", borderRadius: 2, fontFamily: "var(--font-ibm-plex-mono)", fontSize: 10, letterSpacing: "0.18em" }}>운영 가능</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-consult-line-2)" }}>
      <ConsultEyebrow label="// why AIO" />
      <h2 className="font-normal mb-10 md:mb-14 mx-auto" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-consult-ink)", fontWeight: 700, letterSpacing: "-0.018em" }}>
        맡길 만한 <span style={{ color: "var(--tone-consult-navy)" }}>이유</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {values.map((v, i) => (
          <div key={i} className="text-left" style={{ padding: "clamp(24px, 2.8vw, 34px)", background: "var(--tone-consult-paper-2)", border: "1px solid var(--tone-consult-line)", borderRadius: 2 }}>
            <div className="mb-4" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 13, color: "var(--tone-consult-gold)", letterSpacing: "0.18em" }}>0{i + 1}</div>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h3)", color: "var(--tone-consult-ink)", fontWeight: 700, lineHeight: 1.3 }}>{v.title}</h3>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--tone-consult-ink-2)" }}>{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-consult-line-2)" }}>
      <ConsultEyebrow label="// 05 steps · 월간 사이클" />
      <h2 className="font-normal mb-10 md:mb-14" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-consult-ink)", fontWeight: 700, letterSpacing: "-0.018em" }}>
        매달 도는 <span style={{ color: "var(--tone-consult-navy)" }}>운영 사이클</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {steps.map((p, i) => (
          <div key={p.step} className={i === 4 ? "col-span-2 md:col-span-1" : ""} style={{ padding: "clamp(20px, 2.5vw, 28px)", background: "var(--tone-consult-paper-2)", border: "1px solid var(--tone-consult-line)", borderRadius: 2 }}>
            <div className="mb-3" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-navy)", letterSpacing: "0.18em" }}>{p.step}</div>
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
    <section className="max-w-[900px] mx-auto" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-consult-line-2)" }}>
      <div className="text-center"><ConsultEyebrow label="// FAQ" /></div>
      <h2 className="font-normal mb-10 md:mb-14 text-center" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-consult-ink)", fontWeight: 700, letterSpacing: "-0.018em" }}>
        자주 묻는 질문
      </h2>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="group" style={{ padding: "clamp(18px, 2vw, 24px) clamp(20px, 2.5vw, 28px)", background: "var(--tone-consult-paper-2)", border: "1px solid var(--tone-consult-line)", borderRadius: 2 }}>
            <summary className="cursor-pointer flex items-center justify-between gap-3 text-left [&::-webkit-details-marker]:hidden" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 500, color: "var(--tone-consult-ink)", listStyle: "none" }}>
              <span>{f.q}</span>
              <span className="transition-transform group-open:rotate-45 shrink-0" style={{ fontFamily: "var(--font-ibm-plex-mono)", color: "var(--tone-consult-navy)", fontSize: 22, lineHeight: 1, width: 24, textAlign: "center" }}>+</span>
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
      <h2 className="font-normal mb-6 md:mb-8 mx-auto" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", color: "var(--tone-consult-ink)", fontWeight: 700, letterSpacing: "-0.02em" }}>
        채널 운영,<br />이제 맡기세요
      </h2>
      <p className="mb-10 mx-auto max-w-[48ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-consult-ink-2)" }}>
        현재 채널 주소만 주시면 무료 진단부터 시작합니다
      </p>
      <div className="inline-flex flex-col sm:flex-row gap-3 max-w-[300px] sm:max-w-none w-full sm:w-auto">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-consult-navy)", color: "var(--tone-consult-paper)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 2 }}>
          운영 상담 →
        </Link>
        <Link href={`/${locale}/#toc`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-consult-ink)", border: "1px solid var(--tone-consult-line-2)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 2 }}>
          다른 분야 보기
        </Link>
      </div>
    </section>
  );
}

function ConsultEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-10 md:mb-14 inline-flex items-center gap-2" style={{ fontFamily: "var(--font-ibm-plex-mono)", fontSize: 11, color: "var(--tone-consult-ink-3)", letterSpacing: "0.22em" }}>
      <span style={{ width: 32, height: 1, background: "var(--tone-consult-gold)", display: "inline-block" }} />
      {label}
    </div>
  );
}
