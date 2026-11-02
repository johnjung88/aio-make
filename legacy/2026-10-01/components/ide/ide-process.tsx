"use client";

const rows = [
  { hash: "a1b2c3d", day: "DAY 01",    name: "consultation",       time: "무료",      desc: "30분 화상 · 요구사항·예산·일정 정리" },
  { hash: "e4f5a67", day: "DAY 02",    name: "quote + wireframe",  time: "estimate", desc: "투명한 견적서 + 기획안 · 1회 무료 수정" },
  { hash: "b8c9d12", day: "DAY 03–04", name: "development",        time: "build",    desc: "매일 진행 화면 공유 · 실시간 피드백" },
  { hash: "f7e8b34", day: "DAY 05",    name: "deliver + warranty", time: "ship 🚀",  desc: "운영 가이드 + 1개월 무상 A/S" },
];

export function IdeProcess() {
  return (
    <section style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1280, margin: "0 auto" }}>
      {/* heading */}
      <div style={{ margin: "0 auto 36px", maxWidth: 600, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>git log</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--graph --since=&quot;5d&quot;</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.08, color: "var(--tone-ide-fg)" }}>
          의뢰부터 납품까지{" "}
          <span style={{ color: "var(--tone-ide-mint)" }}>5일</span>
        </h2>
      </div>

      {/* git log box */}
      <div style={{ background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 8, overflow: "hidden" }}>
        {/* header */}
        <div style={{ padding: "10px 18px", background: "var(--tone-ide-bg-3)", borderBottom: "1px solid var(--tone-ide-line)", fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-fg-2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>
            <span style={{ color: "var(--tone-ide-mint)" }}>main</span>
            {" · 5d-delivery.timeline"}
          </span>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>4 commits · ↑ ahead</span>
        </div>

        {/* rows */}
        <div style={{ padding: "8px 0" }}>
          {rows.map((r, i) => (
            <div
              key={r.hash}
              style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "18px 1fr", gap: 14, alignItems: "start", position: "relative" }}
            >
              {/* vertical connector line (not on last row) */}
              {i < rows.length - 1 && (
                <span style={{ position: "absolute", left: 26, top: 32, bottom: -14, width: 1, background: "var(--tone-ide-line-2)" }} />
              )}
              {/* bullet */}
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--tone-ide-bg)", border: "2px solid var(--tone-ide-mint)", marginTop: 4, boxShadow: "0 0 8px var(--tone-ide-mint-soft)", position: "relative", zIndex: 1 }} />
              {/* content */}
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color: "var(--tone-ide-fg)" }}>
                <span style={{ color: "var(--tone-ide-amber)", marginRight: 12 }}>{r.hash}</span>
                <span style={{ color: "var(--tone-ide-mint)", marginRight: 8 }}>{r.day}</span>
                <span style={{ color: "var(--tone-ide-fg)", fontWeight: 600 }}>{r.name}</span>
                <span style={{ float: "right", color: "var(--tone-ide-fg-3)", fontSize: 11 }}>— {r.time}</span>
                <span style={{ display: "block", marginTop: 5, color: "var(--tone-ide-fg-2)", fontSize: 12, lineHeight: 1.55 }}>{r.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
