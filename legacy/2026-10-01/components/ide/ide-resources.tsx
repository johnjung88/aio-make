"use client";
import { useState } from "react";
import Link from "next/link";

interface Props { locale: string }

const filters = [
  { id: "all", label: "$ all", count: 14 },
  { id: "checklist", label: "checklist", count: 4 },
  { id: "guide", label: "guide", count: 5 },
  { id: "comparison", label: "comparison", count: 3 },
  { id: "workflow", label: "workflow", count: 2 },
];

const resources = [
  { cat: "checklist", file: "checklist-12.pdf", size: "2.4MB", tag: "Checklist · 12p", title: "의뢰 전 결정해야 할 12가지", desc: "도메인·결제·호스팅·다국어 — 견적 전에 정하면 작업이 2일 단축되는 항목.", rating: "★ 4.9" },
  { cat: "checklist", file: "launch-day.pdf", size: "1.6MB", tag: "Checklist · 8p", title: "오픈 D-1 점검 8단계", desc: "SSL·robots·sitemap·Open Graph·GA4·픽셀 — 오픈 직전 빠뜨리면 안 되는 8개 항목.", rating: "★ 4.8" },
  { cat: "checklist", file: "cms-checklist.pdf", size: "1.8MB", tag: "Checklist · 10p", title: "CMS 도입 점검 리스트", desc: "WordPress·Sanity·Strapi·Notion CMS — 우리 사이트에 맞는 헤드리스 CMS 고르는 법.", rating: "★ 4.7" },
  { cat: "checklist", file: "seo-basics.pdf", size: "1.4MB", tag: "Checklist · 6p", title: "중소기업 SEO 기본 16가지", desc: "title·meta·H1·alt·내부 링크·schema — 외주 받기 전 본인이 미리 점검하는 16개.", rating: "★ 4.6" },
  { cat: "guide", file: "verticals-32.pdf", size: "5.2MB", tag: "Guide · 32p", title: "업종별 사이트 구조 가이드", desc: "병원·법률·뷰티·푸드·교육·부동산·쇼핑몰·기업 — 8개 업종별 권장 IA와 전환 패턴.", rating: "★ 4.9" },
  { cat: "guide", file: "stack-2026.pdf", size: "2.8MB", tag: "Guide · 24p", title: "2026 스타트업 웹 스택 가이드", desc: "Next.js·Astro·Remix·Vercel·Supabase·Resend — 매출 단계별 권장 스택과 이유.", rating: "★ 4.8" },
  { cat: "guide", file: "domain-ssl.pdf", size: "1.6MB", tag: "Guide · 10p", title: "도메인·SSL·DNS 한 번에 정리", desc: "가비아·후이즈·Cloudflare — 도메인 사고 SSL 거는 데까지 가장 빠른 경로.", rating: "★ 4.7" },
  { cat: "guide", file: "a11y-ko.pdf", size: "2.2MB", tag: "Guide · 18p", title: "한국형 접근성 + 다국어 가이드", desc: "웹 접근성 인증마크·국문/영문/일문 라우팅·폰트 fallback — 글로벌 사이트 기본기.", rating: "★ 4.6" },
  { cat: "guide", file: "analytics-setup.pdf", size: "2.0MB", tag: "Guide · 14p", title: "GA4 + Meta·TikTok 픽셀 설치", desc: "GTM 컨테이너·서버사이드·동의 배너·이벤트 매핑 — 전환 추적 처음부터 끝까지.", rating: "★ 4.7" },
  { cat: "comparison", file: "cafe24-vs-d2c.pdf", size: "3.1MB", tag: "Comparison · 16p", title: "카페24 vs 자사몰 비교표", desc: "월 운영비·확장성·결제 수수료·디자인 자유도 — 매출 단계별 추천 솔루션.", rating: "★ 4.8" },
  { cat: "comparison", file: "wp-vs-next.pdf", size: "2.4MB", tag: "Comparison · 12p", title: "WordPress vs Next.js 의사결정표", desc: "SEO·속도·운영·외주비·확장성 — 어떤 사이트는 WP가 답이고 어떤 건 Next가 답.", rating: "★ 4.7" },
  { cat: "comparison", file: "hosting-2026.pdf", size: "1.8MB", tag: "Comparison · 10p", title: "Vercel·Netlify·Cloudflare·국내호스팅", desc: "속도·가격·국내 IDC 의무·법적 이슈 — 한국 사이트에 맞는 호스팅 선택법.", rating: "★ 4.6" },
  { cat: "workflow", file: "5day-flow.pdf", size: "1.8MB", tag: "Workflow · 8p", title: "5일 외주 제작 흐름도", desc: "DAY 01 ~ 05 — 의뢰인이 무엇을 준비하고 언제 검수해야 할지 시간표로 정리.", rating: "★ 4.9" },
  { cat: "workflow", file: "handover.pdf", size: "1.4MB", tag: "Workflow · 6p", title: "납품 후 인수인계 워크플로우", desc: "DNS 이전·계정 권한·운영 매뉴얼·1개월 A/S — 외주 마감 후 빠뜨리면 안 되는 것들.", rating: "★ 4.7" },
];

export function IdeResources({ locale }: Props) {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? resources : resources.filter((r) => r.cat === active);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "80px 24px 48px", maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-fg-2)", display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 6, marginBottom: 28 }}>
          <span style={{ color: "var(--tone-ide-mint)" }}>$</span> <span>aio docs</span>{" "}
          <span style={{ color: "var(--tone-ide-amber)" }}>--free</span>{" "}
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>&quot;web-development&quot;</span>
        </div>
        <h1 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(36px,5.4vw,72px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--tone-ide-fg)", marginBottom: 24 }}>
          Field Guide<span style={{ color: "var(--tone-ide-fg-3)" }}> · </span>
          <span style={{ color: "var(--tone-ide-mint)" }}>14편</span>
        </h1>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 16, lineHeight: 1.65, color: "var(--tone-ide-fg-2)", maxWidth: 640, margin: "0 auto 16px" }}>
          의뢰 전 알면 좋은 것들 — 16개월 동안 갈고 닦은{" "}
          <strong style={{ color: "var(--tone-ide-fg)" }}>웹 개발 실전 가이드</strong>를 무료로 다운로드하세요.
        </p>
        <div style={{ display: "inline-flex", gap: 22, fontFamily: "var(--font-jetbrains)", fontSize: 11.5, color: "var(--tone-ide-fg-3)", flexWrap: "wrap", justifyContent: "center" }}>
          {["이메일 인증 X","월 1회 신규 발행","실제 사례 기반"].map((t) => (
            <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--tone-ide-mint)", fontWeight: 700 }}>✓</span>{t}
            </span>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "inline-flex", gap: 6, flexWrap: "wrap", marginTop: 36, padding: 6, background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 8, justifyContent: "center" }}>
          {filters.map((f) => (
            <button key={f.id} onClick={() => setActive(f.id)} style={{ padding: "8px 14px", borderRadius: 5, border: "1px solid transparent", background: active === f.id ? "var(--tone-ide-mint)" : "transparent", color: active === f.id ? "var(--tone-ide-bg)" : "var(--tone-ide-fg-2)", fontFamily: "var(--font-jetbrains)", fontSize: 12, cursor: "pointer", fontWeight: active === f.id ? 700 : 400, transition: "all 0.2s" }}>
              {f.label} <span style={{ opacity: 0.55, fontSize: 10 }}>{f.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: "0 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", background: "var(--tone-ide-bg-2)", border: "1px solid rgba(77,212,172,0.2)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg,#0d1117,#1a2a35 50%,#4dd4ac 200%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ position: "absolute", top: 16, left: 16, padding: "5px 11px", background: "var(--tone-ide-amber)", color: "#1a0e00", fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 3 }}>★ Featured</span>
            <div style={{ padding: "20px 26px", background: "rgba(13,17,23,0.85)", border: "1px solid var(--tone-ide-mint)", borderRadius: 8, textAlign: "center", transform: "rotate(-3deg)" }}>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.22em", color: "var(--tone-ide-mint)", textTransform: "uppercase", marginBottom: 10 }}>aio · field guide vol.01</div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 60, fontWeight: 700, color: "var(--tone-ide-fg)", lineHeight: 0.9, letterSpacing: "-0.04em" }}>
                12<span style={{ color: "var(--tone-ide-mint)" }}>+</span>
              </div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-2)", marginTop: 8, letterSpacing: "0.04em" }}>decisions before brief</div>
            </div>
          </div>
          <div style={{ padding: "36px 36px 32px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-amber)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>Checklist · 12 pages · 2.4 MB</span>
            <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--tone-ide-fg)" }}>
              의뢰 전 결정해야 할 <span style={{ color: "var(--tone-ide-mint)" }}>12가지</span>
            </h2>
            <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 14.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.7 }}>
              도메인부터 결제 모듈, 호스팅, 다국어, 챗봇 — 견적 단계 전에 정해 두면 작업이 평균 <strong style={{ color: "var(--tone-ide-fg)" }}>2일 단축</strong>되는 핵심 항목들.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 14, borderTop: "1px dashed var(--tone-ide-line-2)", fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-3)", flexWrap: "wrap" }}>
              <span>📄 PDF</span><span>📅 &apos;26.05 업데이트</span><span>📊 의뢰 100건 기반</span><span>★ 4.9</span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "12px 22px", background: "var(--tone-ide-bg-3)", color: "var(--tone-ide-fg-3)", border: "1px solid var(--tone-ide-line)", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 8, cursor: "not-allowed" }}>
                $ pending
                <span style={{ color: "var(--tone-ide-amber)", fontSize: 11, letterSpacing: "0.15em", fontWeight: 700 }}>SOON</span>
              </span>
              <span style={{ fontFamily: "var(--font-pretendard)", fontSize: 12.5, color: "var(--tone-ide-fg-3)", letterSpacing: "-0.005em" }}>
                자료 준비가 완료되면 공개됩니다
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Resource grid */}
      <section style={{ padding: "56px 24px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, gap: 16, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", letterSpacing: "0.04em" }}>
            <span style={{ color: "var(--tone-ide-fg-3)" }}>{"//"}</span> 전체 자료실 ({filtered.length}편)
          </span>
          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-3)" }}>$ ls -la ./resources/</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 14 }}>
          {filtered.map((r) => (
            <div key={r.file} style={{ background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "7px 12px", background: "var(--tone-ide-bg-3)", borderBottom: "1px solid var(--tone-ide-line)", display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-jetbrains)", fontSize: 10.5 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3].map((i) => <span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--tone-ide-fg-faint)", display: "block" }} />)}
                </div>
                <span style={{ color: "var(--tone-ide-fg-2)", flex: 1 }}>{r.file.replace(".pdf","")}<span style={{ color: "var(--tone-ide-mint)" }}>.pdf</span></span>
                <span style={{ color: "var(--tone-ide-fg-3)", fontSize: 9.5 }}>{r.size}</span>
              </div>
              <div style={{ padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--tone-ide-amber)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>{r.tag}</span>
                <h3 style={{ fontFamily: "var(--font-pretendard)", fontSize: 15.5, fontWeight: 600, color: "var(--tone-ide-fg)", letterSpacing: "-0.012em", lineHeight: 1.35 }}>{r.title}</h3>
                <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 13, color: "var(--tone-ide-fg-2)", lineHeight: 1.6, flex: 1 }}>{r.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--tone-ide-line)", fontFamily: "var(--font-jetbrains)", fontSize: 10.5 }}>
                  <span style={{ color: "var(--tone-ide-fg-3)" }}>{r.rating}</span>
                  <span style={{ color: "var(--tone-ide-fg-faint)" }}>$ pending <span style={{ color: "var(--tone-ide-amber)", fontSize: 9.5, marginLeft: 4 }}>SOON</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ padding: "60px 24px", maxWidth: 980, margin: "0 auto", textAlign: "center", borderTop: "1px solid var(--tone-ide-line)" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span> aio subscribe <span style={{ color: "var(--tone-ide-amber)" }}>--monthly</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(24px,3.4vw,40px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.1, marginBottom: 12, color: "var(--tone-ide-fg)" }}>
          월 1회, <span style={{ color: "var(--tone-ide-mint)" }}>Field Guide</span> 곧 발송 시작
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 14.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.65, maxWidth: 540, margin: "0 auto 24px" }}>
          구독 시스템이 준비되면 공개됩니다. 그동안은 견적 문의를 통해 미리 받아보실 수 있습니다.
        </p>
        <Link href={`/${locale}/quote`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 700, borderRadius: 6, textDecoration: "none", letterSpacing: "0.05em" }}>$ aio quote →</Link>
        <p style={{ marginTop: 14, fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-3)" }}>
          <span style={{ color: "var(--tone-ide-fg-faint)" }}>{"//"}</span> Coming Soon · 광고 메일 없음
        </p>
      </section>
    </>
  );
}
