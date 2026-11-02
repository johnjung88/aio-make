"use client";

import Link from "next/link";

interface Props { locale: string }

const teaserItems = [
  { file: "checklist-12.pdf",  size: "2.4MB", tag: "Checklist · 12p", title: "의뢰 전 결정해야 할 12가지",  desc: "도메인·결제·호스팅·다국어 — 견적 전에 정하면 작업이 2일 단축되는 항목.",                  rating: "★ 4.9" },
  { file: "verticals-32.pdf",  size: "5.2MB", tag: "Guide · 32p",     title: "업종별 사이트 구조 가이드",    desc: "병원·법률·뷰티·푸드·교육·부동산·쇼핑몰·기업 — 8개 업종별 권장 IA.",                    rating: "★ 4.9" },
  { file: "5day-flow.pdf",     size: "1.8MB", tag: "Workflow · 8p",   title: "5일 외주 제작 흐름도",        desc: "DAY 01~05 — 의뢰인이 무엇을 준비하고 언제 검수해야 할지 시간표로 정리.",                rating: "★ 4.9" },
  { file: "launch-day.pdf",    size: "1.6MB", tag: "Checklist · 8p",  title: "오픈 D-1 점검 8단계",         desc: "SSL·robots·sitemap·GA4 — 오픈 직전 빠뜨리면 안 되는 8개 항목.",                      rating: "★ 4.8" },
];

export function IdeResourcesTeaser({ locale }: Props) {
  return (
    <section style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1180, margin: "0 auto" }}>
      {/* heading */}
      <div style={{ margin: "0 auto 40px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>aio docs</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--preview</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.08, color: "var(--tone-ide-fg)", marginBottom: 14 }}>
          의뢰 전에 <span style={{ color: "var(--tone-ide-mint)" }}>꿀팁</span> 먼저
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.6, maxWidth: 560, margin: "0 auto" }}>
          16개월 실전 경험을 담은 무료 가이드 14편. 의뢰 전에 읽으면 작업이 빨라집니다.
        </p>
      </div>

      {/* 2×2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, maxWidth: 980, margin: "0 auto" }}>
        {teaserItems.map((r) => (
          <div
            key={r.file}
            style={{ display: "flex", gap: 18, padding: "22px 22px 20px", background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 6 }}
          >
            {/* PDF icon */}
            <div style={{ position: "relative", width: 48, height: 60, flexShrink: 0, background: "var(--tone-ide-bg-3)", border: "1px solid var(--tone-ide-mint-soft)", display: "grid", placeItems: "center", fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 700, color: "var(--tone-ide-mint)", letterSpacing: "0.04em" }}>
              PDF
              <span style={{ position: "absolute", top: -1, right: -1, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 12px 12px 0", borderColor: "transparent var(--tone-ide-bg) transparent transparent" }} />
            </div>
            {/* body */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10.5, color: "var(--tone-ide-amber)", letterSpacing: "0.16em", textTransform: "uppercase" }}>{r.tag}</span>
              <h3 style={{ fontFamily: "var(--font-pretendard)", fontSize: 16, fontWeight: 600, color: "var(--tone-ide-fg)", letterSpacing: "-0.012em", lineHeight: 1.35 }}>{r.title}</h3>
              <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 13, color: "var(--tone-ide-fg-2)", lineHeight: 1.55 }}>{r.desc}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6, fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)" }}>
                <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span> 꿀팁 보기
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 28, textAlign: "center" }}>
        <Link
          href={`/${locale}/services/website/resources`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "transparent", color: "var(--tone-ide-fg)", border: "1px solid var(--tone-ide-line-2)", borderRadius: 6, fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
        >
          → 전체 꿀팁 보기 (14편)
        </Link>
        <div style={{ marginTop: 14, fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-fg-3)", display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", border: "1px solid var(--tone-ide-line)", borderRadius: 14, background: "var(--tone-ide-bg-2)" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--tone-ide-mint)", display: "inline-block" }} />
          이메일 인증 없이 무료 다운로드
        </div>
      </div>
    </section>
  );
}
