"use client";

import Link from "next/link";

interface Props { locale: string }

const TrafficDots = () => (
  <div style={{ display: "flex", gap: 5 }}>
    {(["#FF5F57", "#FEBC2E", "#28C840"] as const).map((c) => (
      <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
    ))}
  </div>
);

const cards = [
  {
    filename: "website.tsx",
    num: "01 · web",
    title: "웹사이트",
    desc: "랜딩페이지·기업 사이트·전문 업종 사이트. SEO·접근성·성능을 모두 갖춘 수준까지.",
    items: ["Next.js 15 + React 19", "한·영 다국어 기본", "Vercel Edge 자동 배포", "업종별 핵심 기능 사전 설계"],
  },
  {
    filename: "shopping.tsx",
    num: "02 · shop",
    title: "쇼핑몰",
    desc: "카페24 메인부터 자사몰까지. 한 화면 안에 상품성과 구매 동선이 자연스럽게 보이도록.",
    items: ["카페24 메인 디자인", "자사몰 (Next.js + Stripe)", "모바일 우선 구성", "결제·배송 흐름 검증"],
  },
];

export function IdeServices({ locale }: Props) {
  return (
    <section style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1280, margin: "0 auto" }}>
      {/* heading */}
      <div style={{ margin: "0 auto 48px", maxWidth: 760, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>aio build</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--types</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.08, color: "var(--tone-ide-fg)", marginBottom: 14 }}>
          2가지 형태,<br />
          <span style={{ color: "var(--tone-ide-mint)" }}>끝까지 책임</span>집니다
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 16.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
          단순 페이지가 아니라 <strong style={{ color: "var(--tone-ide-fg)", fontWeight: 600 }}>운영·확장·유지보수</strong>까지 한 팀이 맡습니다.
        </p>
      </div>

      {/* 2-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {cards.map((c) => (
          <div
            key={c.filename}
            style={{ background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 8, overflow: "hidden" }}
          >
            {/* VS Code title bar */}
            <div style={{ padding: "8px 16px", background: "var(--tone-ide-bg-3)", borderBottom: "1px solid var(--tone-ide-line)", display: "flex", alignItems: "center", gap: 10 }}>
              <TrafficDots />
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-2)", marginLeft: 4 }}>{c.filename}</span>
            </div>
            {/* body */}
            <div style={{ padding: "clamp(20px,3vw,28px)" }}>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-mint)", marginBottom: 14 }}>
                <span style={{ color: "var(--tone-ide-fg-3)" }}>{"// "}</span>{c.num}
              </div>
              <h3 style={{ fontFamily: "var(--font-jetbrains)", fontSize: 26, fontWeight: 600, lineHeight: 1.2, marginBottom: 12, color: "var(--tone-ide-fg)" }}>
                {c.title}
              </h3>
              <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 14, lineHeight: 1.65, color: "var(--tone-ide-fg-2)", marginBottom: 18 }}>
                {c.desc}
              </p>
              <ul style={{ listStyle: "none", padding: 0, paddingTop: 16, borderTop: "1px solid var(--tone-ide-line)" }}>
                {c.items.map((item) => (
                  <li key={item} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--tone-ide-fg-2)", padding: "6px 0" }}>
                    <span style={{ color: "var(--tone-ide-mint)", fontWeight: 700, marginRight: 6 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/quote`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, padding: "10px 18px", background: "transparent", color: "var(--tone-ide-mint)", border: "1px solid var(--tone-ide-mint)", borderRadius: 6, fontFamily: "var(--font-jetbrains)", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}
              >
                $ 견적 문의 →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
