import Link from "next/link";
import type { Metadata } from "next";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  return localizedPageMetadata({
    locale,
    path: "/services/video",
    title: isKo ? "영상 서비스 — AIO" : "Video Services — AIO",
    description: isKo
      ? "브랜드 영상·SNS 숏폼·마케팅 광고·유튜브 편집 — 장면을 담는 분야."
      : "Brand films, social shorts, ad films, YouTube editing.",
  });
}

type Sub = { num: string; name: string; nameEn: string; desc: string; deliver: string; ratio: string };

const subs: Sub[] = [
  { num: "01", name: "브랜드 영상", nameEn: "brand film", desc: "브랜드의 톤을 30초 안에 — 회사·제품·캠페인", deliver: "회사 소개 · 제품 필름 · 캠페인", ratio: "16:9" },
  { num: "02", name: "SNS 영상", nameEn: "social shorts", desc: "끝까지 보게 만드는 릴스·숏폼·쇼츠", deliver: "릴스 · 틱톡 · 쇼츠", ratio: "9:16" },
  { num: "03", name: "마케팅 영상", nameEn: "ad film", desc: "광고로 바로 쓰는 퍼포먼스 영상 소재", deliver: "메타·유튜브 광고 · 상세 영상", ratio: "1:1 / 9:16" },
  { num: "04", name: "유튜브 편집", nameEn: "youtube edit", desc: "채널을 키우는 롱폼 편집 — 자막·썸네일까지", deliver: "롱폼 편집 · 자막 · 썸네일", ratio: "16:9" },
];

const steps = [
  { step: "01", title: "소재 전달", desc: "촬영본·이미지·기획안 전달" },
  { step: "02", title: "구성안", desc: "편집 방향·레퍼런스 합의" },
  { step: "03", title: "편집", desc: "컷·자막·모션·사운드" },
  { step: "04", title: "피드백", desc: "2회 무상 수정" },
  { step: "05", title: "납품", desc: "플랫폼별 규격으로" },
];

const faqs = [
  { q: "촬영도 해주시나요?", a: "편집·후반 작업이 중심입니다. 촬영본·소재를 주시면 완성합니다. 촬영이 필요하면 협력 촬영팀 연결을 도와드립니다." },
  { q: "수정은 몇 회까지 되나요?", a: "구성안 1회 + 편집본 2회 무상. 큰 방향 전환은 별도 협의." },
  { q: "어떤 파일로 받나요?", a: "플랫폼별 규격(MP4, 9:16·16:9·1:1)으로 납품. 원본 프로젝트 파일도 요청 시 제공." },
  { q: "납기는 얼마나 걸리나요?", a: "분량·난이도에 따라 3-7일. 숏폼 단건은 더 빠르게 가능." },
];

export default async function VideoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main style={{ background: "var(--tone-cinema-bg)", color: "var(--tone-cinema-fg)", minHeight: "100vh" }}>
      <CinemaNav locale={locale} />
      <HeroSection locale={locale} />
      <SubServicesSection />
      <FormatsSection />
      <ProcessSection />
      <FaqSection />
      <CtaSection locale={locale} />
    </main>
  );
}

/* 슬림 시네마 내비 */
function CinemaNav({ locale }: { locale: string }) {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between"
      style={{
        padding: "14px clamp(20px, 4vw, 48px)",
        background: "color-mix(in srgb, var(--tone-cinema-bg) 82%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--tone-cinema-line-2)",
      }}
    >
      <Link href={`/${locale}`} style={{ fontFamily: "var(--font-jakarta)", fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", color: "var(--tone-cinema-fg)" }}>
        AIO <span style={{ color: "var(--tone-cinema-amber)" }}>STUDIO</span>
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        <Link href={`/${locale}/#toc`} className="hidden sm:inline transition-colors hover:!text-[var(--tone-cinema-fg)]" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11.5, color: "var(--tone-cinema-fg-3)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          분야
        </Link>
        <Link href={`/${locale}/quote`} className="inline-flex items-center gap-2 transition-all hover:-translate-y-0.5" style={{ padding: "8px 18px", background: "var(--tone-cinema-amber)", color: "var(--tone-cinema-bg)", fontFamily: "var(--font-pretendard)", fontSize: 13, fontWeight: 600, borderRadius: 999 }}>
          견적 문의 →
        </Link>
      </div>
    </nav>
  );
}

/* Hero — 레터박스 시네마 */
function HeroSection({ locale }: { locale: string }) {
  return (
    <section className="relative" style={{ borderBottom: "1px solid var(--tone-cinema-line-2)" }}>
      {/* 상단 레터박스 라인 */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--tone-cinema-amber), transparent)", opacity: 0.5 }} />
      <div className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
        <div className="mb-7 md:mb-9 inline-flex items-center gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-cinema-fg-3)", letterSpacing: "0.28em", textTransform: "uppercase" }}>
          <span className="inline-flex items-center gap-1.5">
            <span className="animate-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--tone-cinema-red)", display: "inline-block" }} />
            REC
          </span>
          <span style={{ width: 24, height: 1, background: "var(--tone-cinema-line)", display: "inline-block" }} />
          Video · 04 Sub-services
        </div>
        <h1 className="font-normal mb-7 md:mb-9 mx-auto max-w-[14ch]" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", letterSpacing: "-0.02em", color: "var(--tone-cinema-fg)", fontWeight: 700 }}>
          장면이, 브랜드를
          <br />
          <span style={{ color: "var(--tone-cinema-amber)" }}>말하게</span>
        </h1>
        <p className="mb-10 md:mb-12 mx-auto max-w-[50ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-cinema-fg-2)" }}>
          브랜드 영상부터 SNS 숏폼·광고·유튜브 편집까지
          <br />
          <strong style={{ color: "var(--tone-cinema-fg)", fontWeight: 600 }}>소재만 주시면, 끝까지 보게 만드는 한 편으로</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-[300px] sm:max-w-none mx-auto">
          <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-cinema-amber)", color: "var(--tone-cinema-bg)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 999 }}>
            견적 문의 →
          </Link>
          <Link href="#subs" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-cinema-fg)", border: "1px solid var(--tone-cinema-line)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 999 }}>
            서비스 보기
          </Link>
        </div>
      </div>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--tone-cinema-amber), transparent)", opacity: 0.5 }} />
    </section>
  );
}

function SubServicesSection() {
  return (
    <section id="subs" className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)" }}>
      <CinemaEyebrow label="Sub-services" />
      <h2 className="font-normal mb-8 md:mb-12 mx-auto max-w-[900px]" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", letterSpacing: "-0.018em", color: "var(--tone-cinema-fg)", fontWeight: 700 }}>
        네 가지 <span style={{ color: "var(--tone-cinema-amber)" }}>영상 작업</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {subs.map((s) => (
          <div key={s.num} className="group text-center flex flex-col items-center transition-all hover:-translate-y-1" style={{ padding: "clamp(28px, 3.2vw, 44px) clamp(20px, 2.5vw, 32px)", background: "var(--tone-cinema-bg-2)", border: "1px solid var(--tone-cinema-line)", borderRadius: 6 }}>
            {/* 미니 프레임 */}
            <div className="mb-5 w-full flex items-center justify-center" style={{ aspectRatio: "16 / 6", background: "linear-gradient(135deg, var(--tone-cinema-bg-3), var(--tone-cinema-bg))", border: "1px solid var(--tone-cinema-line-2)", borderRadius: 4, position: "relative" }}>
              <span style={{ fontFamily: "var(--font-jakarta)", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "var(--tone-cinema-line)", letterSpacing: "-0.02em" }}>{s.ratio}</span>
              <span style={{ position: "absolute", top: 8, left: 10, fontFamily: "var(--font-jetbrains)", fontSize: 9.5, color: "var(--tone-cinema-fg-3)", letterSpacing: "0.18em" }}>▶ {s.num}</span>
            </div>
            <div className="mb-3 inline-flex items-baseline gap-3 flex-wrap justify-center" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-h2)", lineHeight: 1.1, color: "var(--tone-cinema-fg)", fontWeight: 700, letterSpacing: "-0.012em" }}>
              {s.name}
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: "0.46em", color: "var(--tone-cinema-fg-3)", fontStyle: "italic", fontWeight: 400, letterSpacing: "0.04em" }}>{s.nameEn}</span>
            </div>
            <p className="mb-4 max-w-[38ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.7, color: "var(--tone-cinema-fg-2)" }}>{s.desc}</p>
            <div className="mb-5 px-4 py-2" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", color: "var(--tone-cinema-amber)", lineHeight: 1.55, background: "var(--tone-cinema-bg-3)", borderRadius: 3 }}>{s.deliver}</div>
            <div className="mt-auto pt-5 w-full inline-flex flex-col items-center gap-2" style={{ borderTop: "1px solid var(--tone-cinema-line-2)" }}>
              <span style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-body)", fontWeight: 600, color: "var(--tone-cinema-fg)" }}>프로젝트 견적</span>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-cinema-fg-3)", letterSpacing: "0.18em" }}>3-7 DAYS</span>
              <span className="mt-2" style={{ padding: "3px 12px", background: "color-mix(in srgb, var(--tone-cinema-amber) 18%, transparent)", color: "var(--tone-cinema-amber)", borderRadius: 999, fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.18em" }}>의뢰 가능</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* 포맷 스트립 */
function FormatsSection() {
  const formats = [
    { ratio: "16:9", label: "가로 · 유튜브·웹", box: "16 / 9" },
    { ratio: "9:16", label: "세로 · 릴스·쇼츠", box: "9 / 16" },
    { ratio: "1:1", label: "정방형 · 피드", box: "1 / 1" },
  ];
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-cinema-line-2)" }}>
      <CinemaEyebrow label="Formats" />
      <h2 className="font-normal mb-10 md:mb-14 mx-auto" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-cinema-fg)", fontWeight: 700, letterSpacing: "-0.018em" }}>
        플랫폼에 <span style={{ color: "var(--tone-cinema-amber)" }}>맞는 비율</span>로
      </h2>
      <div className="flex flex-wrap items-end justify-center gap-5 md:gap-8">
        {formats.map((f) => (
          <div key={f.ratio} className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center" style={{ width: f.box === "9 / 16" ? 80 : f.box === "1 / 1" ? 120 : 180, aspectRatio: f.box, background: "linear-gradient(135deg, var(--tone-cinema-bg-3), var(--tone-cinema-bg-2))", border: "1px solid var(--tone-cinema-line)", borderRadius: 4 }}>
              <span style={{ fontFamily: "var(--font-jakarta)", fontSize: 18, fontWeight: 700, color: "var(--tone-cinema-fg-3)" }}>{f.ratio}</span>
            </div>
            <span style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", color: "var(--tone-cinema-fg-2)" }}>{f.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-cinema-line-2)" }}>
      <CinemaEyebrow label="Process · 05 steps" />
      <h2 className="font-normal mb-10 md:mb-14" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-cinema-fg)", fontWeight: 700, letterSpacing: "-0.018em" }}>
        소재 전달부터 납품까지 <span style={{ color: "var(--tone-cinema-amber)" }}>5단계</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {steps.map((p, i) => (
          <div key={p.step} className={i === 4 ? "col-span-2 md:col-span-1" : ""} style={{ padding: "clamp(20px, 2.5vw, 28px)", background: "var(--tone-cinema-bg-2)", border: "1px solid var(--tone-cinema-line)", borderRadius: 6 }}>
            <div className="mb-3" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-cinema-amber)", letterSpacing: "0.18em" }}>{p.step}</div>
            <h3 className="mb-2" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-h3)", color: "var(--tone-cinema-fg)", fontWeight: 700, lineHeight: 1.2 }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-small)", lineHeight: 1.65, color: "var(--tone-cinema-fg-3)" }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="max-w-[900px] mx-auto" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-cinema-line-2)" }}>
      <div className="text-center"><CinemaEyebrow label="FAQ" /></div>
      <h2 className="font-normal mb-10 md:mb-14 text-center" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-head)", color: "var(--tone-cinema-fg)", fontWeight: 700, letterSpacing: "-0.018em" }}>
        자주 묻는 질문
      </h2>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="group" style={{ padding: "clamp(18px, 2vw, 24px) clamp(20px, 2.5vw, 28px)", background: "var(--tone-cinema-bg-2)", border: "1px solid var(--tone-cinema-line)", borderRadius: 6 }}>
            <summary className="cursor-pointer flex items-center justify-between gap-3 text-left [&::-webkit-details-marker]:hidden" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", fontWeight: 500, color: "var(--tone-cinema-fg)", listStyle: "none" }}>
              <span>{f.q}</span>
              <span className="transition-transform group-open:rotate-45 shrink-0" style={{ fontFamily: "var(--font-jetbrains)", color: "var(--tone-cinema-amber)", fontSize: 22, lineHeight: 1, width: 24, textAlign: "center" }}>+</span>
            </summary>
            <p className="mt-4 text-left" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-body)", lineHeight: 1.8, color: "var(--tone-cinema-fg-2)" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaSection({ locale }: { locale: string }) {
  return (
    <section className="max-w-[1100px] mx-auto text-center" style={{ padding: "var(--space-section) var(--space-edge)", borderTop: "1px solid var(--tone-cinema-line)" }}>
      <h2 className="font-normal mb-6 md:mb-8 mx-auto" style={{ fontFamily: "var(--font-jakarta)", fontSize: "var(--text-display)", lineHeight: "var(--leading-display)", color: "var(--tone-cinema-fg)", fontWeight: 700, letterSpacing: "-0.02em" }}>
        만들고 싶은<br />장면이 있나요?
      </h2>
      <p className="mb-10 mx-auto max-w-[48ch]" style={{ fontFamily: "var(--font-pretendard)", fontSize: "var(--text-lead)", lineHeight: 1.8, color: "var(--tone-cinema-fg-2)" }}>
        24시간 안에 견적 회신 · 소재만 주시면 시작합니다
      </p>
      <div className="inline-flex flex-col sm:flex-row gap-3 max-w-[300px] sm:max-w-none w-full sm:w-auto">
        <Link href={`/${locale}/quote`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "var(--tone-cinema-amber)", color: "var(--tone-cinema-bg)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 600, borderRadius: 999 }}>
          견적 문의 →
        </Link>
        <Link href={`/${locale}/#toc`} className="inline-flex items-center justify-center gap-2 px-8 py-4 transition-all hover:-translate-y-0.5" style={{ background: "transparent", color: "var(--tone-cinema-fg)", border: "1px solid var(--tone-cinema-line)", fontFamily: "var(--font-pretendard)", fontSize: 14, fontWeight: 500, borderRadius: 999 }}>
          다른 분야 보기
        </Link>
      </div>
    </section>
  );
}

function CinemaEyebrow({ label }: { label: string }) {
  return (
    <div className="mb-10 md:mb-14 inline-flex items-center gap-2" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-cinema-fg-3)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
      <span style={{ width: 32, height: 1, background: "var(--tone-cinema-amber)", display: "inline-block" }} />
      {label}
    </div>
  );
}
