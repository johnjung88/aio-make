"use client";
import { useState } from "react";
import Link from "next/link";

interface Props { locale: string }

const cats = [
  { id: "all", label: "전체", count: 42 },
  { id: "medical", label: "병원", count: 8 },
  { id: "legal", label: "법률·세무", count: 6 },
  { id: "shop", label: "쇼핑몰", count: 9 },
  { id: "edu", label: "교육", count: 5 },
  { id: "fnb", label: "F&B", count: 4 },
  { id: "beauty", label: "뷰티", count: 4 },
  { id: "realty", label: "부동산", count: 3 },
  { id: "other", label: "일반", count: 3 },
];

const gradients: Record<string, string> = {
  medical: "linear-gradient(135deg,#1a3a4a,#2d5e6f 50%,#4dd4ac)",
  legal:   "linear-gradient(135deg,#2a2818,#5a4a28 50%,#b89148)",
  shop:    "linear-gradient(135deg,#2a1f0a,#6a4628 50%,#ffb347)",
  edu:     "linear-gradient(135deg,#1a2640,#4a6fa5 50%,#79c0ff)",
  fnb:     "linear-gradient(135deg,#2a1010,#6f2818 50%,#c8472d)",
  beauty:  "linear-gradient(135deg,#2a1530,#6a3858 50%,#d2a8ff)",
  realty:  "linear-gradient(135deg,#1a2018,#3a4a3a 50%,#56d364)",
  other:   "linear-gradient(135deg,#1a1c20,#4a4d54 50%,#8a8f9a)",
};

const projects = [
  { cat: "medical", file: "jaeheon-clinic.tsx", badge: "Medical", stack: "Next.js · Supabase", name: "자연 한의원\n예약 시스템", meta: "의원·한의원", title: "자연한의원 — 예약·진료시간·블로그 통합", comment: "의료광고법 검수", stats: ["+120%/예약","5d/납품","5p/페이지"] },
  { cat: "legal",   file: "seoul-legal.tsx",    badge: "Legal",    stack: "Next.js · Vercel",   name: "서울법무사사무소\n상담 폼 + 업무 분야", meta: "법무사",   title: "서울법무 — 업무분야 8 + 상담 자동화",  comment: "표시광고법 가이드", stats: ["+85%/상담","4d/납품","5p/페이지"] },
  { cat: "shop",    file: "chefmeal-d2c.tsx",   badge: "Shopping", stack: "Cafe24 · 모바일",    name: "셰프밀 식품몰\n카페24 메인 리뉴얼",   meta: "식품몰",   title: "셰프밀 — 메인·배너·동선 정리",          comment: "카페24 스킨",      stats: ["+28%/매출","5d/납품","10p/상품"] },
  { cat: "edu",     file: "academy-valley.tsx", badge: "Education",stack: "Next.js · Stripe",   name: "아카데미밸리\n온라인 강의 등록",      meta: "학원·강의", title: "아카데미밸리 — 강사·시간표·결제",        comment: "Stripe + 카카오",  stats: ["+44%/등록","5d/납품","5p/페이지"] },
  { cat: "shop",    file: "homechef.tsx",       badge: "Mealkit",  stack: "자사몰 · Stripe",    name: "홈셰프 밀키트\n자사 D2C 몰",         meta: "자사몰",   title: "홈셰프 — 정기배송·결제 흐름",           comment: "Next.js + Stripe", stats: ["+52%/전환","7d/납품","×1.2/매출"] },
  { cat: "fnb",     file: "cafe-moru.tsx",      badge: "F&B",      stack: "Next.js · Vercel",   name: "모루커피\n매장 + 메뉴 사이트",       meta: "카페",     title: "모루커피 — 메뉴·매장·인스타 연결",      comment: "1p 랜딩",         stats: ["+38%/방문","3d/납품","1p/페이지"] },
  { cat: "beauty",  file: "veila-nail.tsx",     badge: "Beauty",   stack: "Next.js · 예약",     name: "베일라 네일\n예약 + 시술 메뉴",      meta: "네일·미용", title: "베일라 네일 — 시술·예약·후기",          comment: "구글 캘린더 연동", stats: ["+95%/예약","4d/납품","5p/페이지"] },
  { cat: "medical", file: "smile-dental.tsx",   badge: "Dental",   stack: "Next.js · 의료",     name: "스마일치과\n치료·예약·블로그",        meta: "치과",     title: "스마일치과 — 진료시간·예약·콘텐츠",     comment: "의료광고법",      stats: ["+72%/예약","5d/납품","5p/페이지"] },
  { cat: "realty",  file: "vista-realty.tsx",   badge: "Realty",   stack: "Next.js · Maps",     name: "비스타 부동산\n매물 + 지도 + 문의",  meta: "중개·분양", title: "비스타 — 매물 리스트·지도 클러스터",    comment: "Naver Maps",      stats: ["+62%/문의","5d/납품","5p/페이지"] },
  { cat: "legal",   file: "tax-pro.tsx",        badge: "Tax",      stack: "Next.js · 상담",     name: "택스프로 세무사\n업무·전문가·약도",   meta: "세무사",   title: "택스프로 — 세무 상담 자동화",           comment: "표시광고법",      stats: ["+58%/상담","3d/납품","3p/페이지"] },
  { cat: "shop",    file: "vaio-bio.tsx",       badge: "B2B SaaS", stack: "Next.js · TypeScript",name: "V-AIO 바이오\n제품 소개 + 문의",    meta: "바이오",   title: "V-AIO — 영문/국문 + 제품 소개",         comment: "한·영 동시",      stats: ["+108%/문의","5d/납품","5p/한·영"] },
  { cat: "other",   file: "indie-startup.tsx",  badge: "Startup",  stack: "Next.js · Vercel",   name: "인디 스타트업\n1p 랜딩 + Waitlist", meta: "스타트업",  title: "Indie — 1p 랜딩 + Waitlist 자동화",    comment: "Resend + Supabase", stats: ["×2.4/대기열","2d/납품","1p/페이지"] },
];

export function IdePortfolio({ locale }: Props) {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? projects : projects.filter((p) => p.cat === active);

  return (
    <>
      {/* Hero */}
      <section style={{ padding: "80px 24px 40px", maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-fg-2)",
            display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px",
            background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 6, marginBottom: 28,
          }}
        >
          <span style={{ color: "var(--tone-ide-mint)" }}>$</span>{" "}
          <span>aio open portfolio</span>{" "}
          <span style={{ color: "var(--tone-ide-amber)" }}>--all</span>{" "}
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>&quot;42 projects&quot;</span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-jetbrains)", fontSize: "clamp(36px,5.4vw,76px)", fontWeight: 700,
            letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--tone-ide-fg)", marginBottom: 24,
          }}
        >
          실제 운영 중인{" "}
          <span style={{ color: "var(--tone-ide-mint)" }}>42</span>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>개</span>
        </h1>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 16, color: "var(--tone-ide-fg-2)", lineHeight: 1.6, maxWidth: 620, margin: "0 auto 36px" }}>
          데모가 아닙니다.{" "}
          <strong style={{ color: "var(--tone-ide-fg)" }}>매출이 일어나고 있는 사이트</strong>만 모았습니다.{" "}
          업종별 필터로 비슷한 사례를 찾아보세요.
        </p>

        {/* Filter */}
        <div
          style={{
            display: "inline-flex", gap: 6, flexWrap: "wrap", padding: 6,
            background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)",
            borderRadius: 8, justifyContent: "center",
          }}
        >
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                padding: "8px 14px", borderRadius: 5, border: "1px solid transparent",
                background: active === c.id ? "var(--tone-ide-mint)" : "transparent",
                color: active === c.id ? "var(--tone-ide-bg)" : "var(--tone-ide-fg-2)",
                fontFamily: "var(--font-jetbrains)", fontSize: 12, cursor: "pointer",
                fontWeight: active === c.id ? 700 : 400, transition: "all 0.2s",
              }}
            >
              {c.label} <span style={{ opacity: 0.55, fontSize: 10 }}>{c.count}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: "24px 24px 80px", maxWidth: 1480, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {filtered.map((p) => {
            const [stat0, stat1, stat2] = p.stats.map((s) => s.split("/"));
            return (
              <article
                key={p.file}
                style={{
                  background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)",
                  borderRadius: 8, overflow: "hidden",
                }}
              >
                {/* Window chrome */}
                <div style={{ padding: "8px 14px", background: "var(--tone-ide-bg-3)", borderBottom: "1px solid var(--tone-ide-line)", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#FF5F57","#FEBC2E","#28C840"].map((bg) => (
                      <span key={bg} style={{ width: 9, height: 9, borderRadius: "50%", background: bg, display: "block" }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-2)", flex: 1 }}>
                    {p.file.replace(".tsx", "")}<span style={{ color: "var(--tone-ide-mint)" }}>.tsx</span>
                  </span>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", padding: "2px 8px", background: "var(--tone-ide-mint-soft)", border: "1px solid rgba(77,212,172,0.25)", color: "var(--tone-ide-mint)", borderRadius: 3 }}>
                    LIVE
                  </span>
                </div>

                {/* Visual */}
                <div style={{ aspectRatio: "16/9", background: gradients[p.cat] ?? gradients.other, position: "relative", overflow: "hidden", padding: 14 }}>
                  <span style={{ position: "absolute", top: 14, left: 14, padding: "4px 10px", background: "rgba(13,17,23,0.7)", border: "1px solid rgba(240,246,252,0.16)", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--tone-ide-fg)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                    {p.badge}
                  </span>
                  <span style={{ position: "absolute", top: 14, right: 14, padding: "4px 10px", background: "rgba(13,17,23,0.7)", border: "1px solid rgba(240,246,252,0.16)", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--tone-ide-mint)", letterSpacing: "0.06em" }}>
                    {p.stack}
                  </span>
                  <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, fontFamily: "var(--font-jetbrains)", fontSize: 22, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "white", whiteSpace: "pre-line" }}>
                    {p.name}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "18px 20px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontFamily: "var(--font-jetbrains)", fontSize: 10.5 }}>
                    <span style={{ color: "var(--tone-ide-mint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{p.cat}</span>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-ide-fg-faint)", display: "block" }} />
                    <span style={{ color: "var(--tone-ide-fg-2)" }}>{p.meta}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 16, fontWeight: 600, lineHeight: 1.35, marginBottom: 14, color: "var(--tone-ide-fg)" }}>
                    {p.title} <span style={{ color: "var(--tone-ide-fg-3)", fontWeight: 400 }}>{"{/* "}{p.comment}{" */"}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, paddingTop: 12, borderTop: "1px solid var(--tone-ide-line)" }}>
                    {[stat0, stat1, stat2].map(([v, l], i) => (
                      <div key={i}>
                        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 16, fontWeight: 700, color: "var(--tone-ide-mint)", letterSpacing: "-0.02em", lineHeight: 1 }}>{v}</div>
                        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9.5, color: "var(--tone-ide-fg-3)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px 56px", maxWidth: 1180, margin: "0 auto", textAlign: "center", borderTop: "1px solid var(--tone-ide-line)" }}>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(28px,4vw,56px)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.0, color: "var(--tone-ide-fg)", marginBottom: 16 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$ deploy</span>{" "}
          <span style={{ color: "var(--tone-ide-mint)" }}>your_project</span>
        </h2>
        <p style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color: "var(--tone-ide-fg-2)", marginBottom: 26 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>{"//"}</span> 1시간 답변 · 24시간 견적 · 5일 결과물
        </p>
        <div style={{ display: "inline-flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href={`/${locale}/quote`} style={{ padding: "13px 24px", background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", border: "1px solid var(--tone-ide-mint)", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, borderRadius: 6, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            $ 견적 시작 →
          </Link>
          <Link href={`/${locale}/services/website`} style={{ padding: "13px 24px", background: "var(--tone-ide-bg-2)", color: "var(--tone-ide-fg)", border: "1px solid var(--tone-ide-line-2)", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 500, borderRadius: 6, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            ← services.tsx
          </Link>
        </div>
      </section>
    </>
  );
}
