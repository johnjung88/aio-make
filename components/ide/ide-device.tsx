// components/ide/ide-device.tsx
import Link from "next/link";

interface Props { locale: string }

const MiniPage = ({ variant }: { variant: "home" | "portfolio" | "process" | "why" }) => {
  const bg: Record<string, string> = {
    home:      "linear-gradient(135deg,#1a3a4a,#2d5e6f 50%,#4dd4ac)",
    portfolio: "linear-gradient(135deg,#001626,#003a5c 50%,#4dd4ac)",
    process:   "linear-gradient(135deg,#1a2018,#4dd4ac)",
    why:       "linear-gradient(135deg,#2a1f0a,#6a4628 50%,#ffb347)",
  };
  const labels: Record<string, { badge: string; h1a: string; h1b: string; sub: string }> = {
    home:      { badge: "Web · Live",       h1a: "5일 후,",      h1b: "결과물을 받습니다",   sub: "업종별 전문 사이트 · 운영 가능한 수준으로" },
    portfolio: { badge: "Portfolio · 42",   h1a: "결과를 보고",  h1b: "맡기는 외주",          sub: "실제 라이브 사이트와 KPI를 먼저 보여드립니다" },
    process:   { badge: "Process · 5 days", h1a: "의뢰부터",     h1b: "납품까지 5일",         sub: "DAY 01 상담 → 02 견적 → 03-04 개발 → 05 납품" },
    why:       { badge: "Why AIO",          h1a: "속도, 응대,",  h1b: "완성도·유지보수",      sub: "의뢰 전 가장 궁금한 4가지에 대한 답" },
  };
  const l = labels[variant];
  return (
    <div style={{ width: "100%", height: "100%", background: "var(--tone-ide-bg-2)", flexShrink: 0, overflow: "hidden" }}>
      {/* nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--tone-ide-line)", background: "rgba(13,17,23,0.7)" }}>
        <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 700, color: "var(--tone-ide-fg)" }}>
          AIO<span style={{ color: "var(--tone-ide-mint)" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 14, fontFamily: "var(--font-jetbrains)", fontSize: 10, color: "var(--tone-ide-fg-2)" }}>
          <span>Services</span><span>Work</span><span>About</span>
        </div>
        <span style={{ padding: "5px 11px", background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", borderRadius: 4, fontFamily: "var(--font-jetbrains)", fontSize: 9.5, fontWeight: 700 }}>견적</span>
      </div>
      {/* hero image */}
      <div style={{ margin: "20px 20px 14px", borderRadius: 6, background: bg[variant], aspectRatio: "16/9", position: "relative", overflow: "hidden" }}>
        <span style={{ position: "absolute", top: 10, left: 12, padding: "3px 8px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", borderRadius: 3, fontFamily: "var(--font-jetbrains)", fontSize: 8, color: "rgba(255,255,255,0.85)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
          {l.badge}
        </span>
      </div>
      {/* text */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 8.5, color: "var(--tone-ide-mint)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--tone-ide-mint)", display: "inline-block" }} />
          {l.badge}
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.1, marginBottom: 10, color: "var(--tone-ide-fg)" }}>
          <span style={{ color: "var(--tone-ide-fg-3)", fontWeight: 500 }}>{l.h1a}</span><br />
          <span style={{ color: "var(--tone-ide-mint)" }}>{l.h1b}</span>
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 10.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.55, marginBottom: 14, maxWidth: "90%" }}>{l.sub}</p>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ padding: "6px 12px", borderRadius: 4, background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", fontFamily: "var(--font-jetbrains)", fontSize: 9.5, fontWeight: 600 }}>견적 시작 →</span>
          <span style={{ padding: "6px 12px", borderRadius: 4, background: "var(--tone-ide-bg)", color: "var(--tone-ide-fg)", fontFamily: "var(--font-jetbrains)", fontSize: 9.5, border: "1px solid var(--tone-ide-line-2)" }}>사례 보기</span>
        </div>
      </div>
      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "14px 20px", borderTop: "1px solid var(--tone-ide-line)", borderBottom: "1px solid var(--tone-ide-line)", background: "rgba(13,17,23,0.5)" }}>
        {([ ["42","Projects"],["5d","Delivery"],["4.9","Rating"] ] as [string,string][]).map(([n,lbl]) => (
          <div key={lbl}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 20, fontWeight: 700, color: "var(--tone-ide-mint)", letterSpacing: "-0.025em", lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 7.5, color: "var(--tone-ide-fg-3)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</div>
          </div>
        ))}
      </div>
      {/* foot */}
      <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-jetbrains)", fontSize: 8, color: "var(--tone-ide-fg-3)", background: "rgba(13,17,23,0.5)" }}>
        <span style={{ color: "var(--tone-ide-mint)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--tone-ide-mint)", display: "inline-block" }} />main
        </span>
        <span>aio-make.com</span>
      </div>
    </div>
  );
};

export function IdeDevice({ locale }: Props) {
  return (
    <section style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 1480, margin: "0 auto" }}>
      {/* section heading */}
      <div style={{ margin: "0 auto 56px", maxWidth: 760, textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>cat live-sites.log</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--running</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.08, color: "var(--tone-ide-fg)", marginBottom: 14 }}>
          지금 보이는 모든 사이트,{" "}
          <span style={{ color: "var(--tone-ide-mint)" }}>실제 운영 중</span>입니다
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 16.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.6, maxWidth: 640, margin: "0 auto" }}>
          데모가 아닙니다. <strong style={{ color: "var(--tone-ide-fg)" }}>실제 결과물</strong>을 먼저 보고 결정하세요.
        </p>
      </div>

      {/* device stage */}
      <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", position: "relative", paddingBottom: 60 }}>

          {/* MacBook */}
          <div style={{ position: "relative", width: "76%", maxWidth: 900 }}>
            <svg viewBox="0 0 1000 660" style={{ width: "100%", height: "auto", display: "block", filter: "drop-shadow(0 60px 100px rgba(0,0,0,0.6))" }}>
              <defs>
                <linearGradient id="mac-bezel-d" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a3d44"/><stop offset="50%" stopColor="#1f2229"/><stop offset="100%" stopColor="#14171c"/>
                </linearGradient>
                <linearGradient id="mac-base-d" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a2d34"/><stop offset="100%" stopColor="#0f1116"/>
                </linearGradient>
                <linearGradient id="mac-side-d" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0a0c10"/><stop offset="50%" stopColor="#2a2d34"/><stop offset="100%" stopColor="#0a0c10"/>
                </linearGradient>
              </defs>
              <rect x="20" y="0" width="960" height="600" rx="20" ry="20" fill="url(#mac-bezel-d)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
              <rect x="55" y="30" width="890" height="540" rx="6" ry="6" fill="#000"/>
              <rect x="468" y="0" width="64" height="14" rx="0" ry="0" fill="#0a0a0c"/>
              <circle cx="500" cy="7" r="2.2" fill="#1a1a1f" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4"/>
              <circle cx="510" cy="7" r="1" fill="#4DD4AC" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.4s" repeatCount="indefinite"/>
              </circle>
              <rect x="0" y="600" width="1000" height="6" fill="url(#mac-side-d)"/>
              <path d="M 0 606 L 1000 606 L 988 654 L 12 654 Z" fill="url(#mac-base-d)"/>
              <line x1="2" y1="608" x2="998" y2="608" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5"/>
              <rect x="380" y="650" width="240" height="6" rx="0" fill="#050608"/>
              <ellipse cx="500" cy="660" rx="350" ry="3" fill="rgba(0,0,0,0.4)"/>
            </svg>
            {/* screen area */}
            <div style={{ position: "absolute", top: "4.5%", left: "5.5%", width: "89%", height: "84%", background: "var(--tone-ide-bg)", borderRadius: "1%", overflow: "hidden" }}>
              <div className="animate-ide-scroll" style={{ display: "flex", flexDirection: "column", width: "100%", height: "400%" }}>
                {(["home","portfolio","process","why"] as const).map((v) => (
                  <div key={v} style={{ width: "100%", height: "25%", flexShrink: 0, overflow: "hidden" }}>
                    <MiniPage variant={v} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* iPhone */}
          <div style={{ position: "absolute", bottom: "-8%", right: "4%", width: "22%", maxWidth: 220, transform: "rotate(2.5deg)" }}>
            <svg viewBox="0 0 220 460" style={{ width: "100%", height: "auto", display: "block", filter: "drop-shadow(0 35px 70px rgba(0,0,0,0.55))" }}>
              <defs>
                <linearGradient id="ip-frame-d" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3a3d44"/><stop offset="40%" stopColor="#1f2229"/><stop offset="100%" stopColor="#0e1014"/>
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="220" height="460" rx="50" ry="50" fill="url(#ip-frame-d)"/>
              <rect x="2" y="2" width="216" height="456" rx="48" ry="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <rect x="14" y="14" width="192" height="432" rx="40" ry="40" fill="#000"/>
              <rect x="68" y="32" width="84" height="22" rx="11" fill="#000" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
              <circle cx="138" cy="43" r="3.5" fill="#1a1f2e"/>
              <circle cx="84" cy="43" r="1.6" fill="#0a0a0a"/>
            </svg>
            {/* iPhone screen */}
            <div style={{ position: "absolute", top: "3.4%", left: "6.5%", width: "87%", height: "93.2%", background: "var(--tone-ide-bg)", borderRadius: "11%", overflow: "hidden" }}>
              <div className="animate-ide-scroll" style={{ display: "flex", flexDirection: "column", width: "100%", height: "400%", animationDuration: "22s" }}>
                {(["home","portfolio","process","why"] as const).map((v) => (
                  <div key={`ip-${v}`} style={{ width: "100%", height: "25%", flexShrink: 0, overflow: "hidden", fontSize: "0.6em" }}>
                    <MiniPage variant={v} />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
