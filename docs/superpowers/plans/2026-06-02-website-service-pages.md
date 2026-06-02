# 웹사이트 서비스 페이지 (IDE 톤) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/services/website` 랜딩 + `/services/website/portfolio` 두 페이지를 IDE 톤(dark #0D1117, mint #4DD4AC)으로 완전 재작성하고, 누락된 IDE 섹션 컴포넌트 5개를 신규 작성한다.

**Architecture:** `components/ide/` 아래 서버 컴포넌트(또는 최소 client) 5개를 새로 만들고, `website-landing.tsx`·`website-portfolio.tsx`를 `data-tone="ide"` 래퍼 + IDE 컴포넌트 조립 방식으로 재작성한다. 레이아웃 충돌 없음 — `site-shell.tsx`의 `isStandalone()` 함수가 이 경로에서 SiteHeader/SiteFooter를 자동 숨김.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, CSS 변수(`var(--tone-ide-*)`, `globals.css`에 정의됨), `@keyframes ideScrollUp`(globals.css에 정의), JetBrains Mono(`var(--font-jetbrains)`), Pretendard(`var(--font-pretendard)`)

---

## 파일 맵

| 작업 | 파일 경로 | 신규/수정 |
|---|---|---|
| Task 1 | `components/ide/ide-device.tsx` | 신규 |
| Task 2 | `components/ide/ide-services.tsx` | 신규 |
| Task 3 | `components/ide/ide-process.tsx` | 신규 |
| Task 4 | `components/ide/ide-resources-teaser.tsx` | 신규 |
| Task 5 | `components/ide/ide-faq.tsx` | 신규 |
| Task 6 | `components/landing/website-landing.tsx` | 전체 재작성 |
| Task 7 | `components/landing/website-portfolio.tsx` | 전체 재작성 |

`app/[locale]/services/website/page.tsx`, `portfolio/page.tsx` — **수정 없음** (import만 하므로)

---

## Task 1: IdeDevice — Mac+iPhone 목업 섹션

**Files:**
- Create: `components/ide/ide-device.tsx`

**사전 지식:**
- `globals.css`에 `.animate-ide-scroll { animation: ideScrollUp 28s linear infinite; }` 정의됨
- `ideScrollUp` = 4단계 translateY(0→-25%→-50%→-75%) 루프
- 즉, `.site-mock` 컨테이너에 4개 페이지를 쌓으면 25%씩 이동하며 보임

- [ ] **Step 1: 파일 생성**

```tsx
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
    home:      { badge: "Web · Live",      h1a: "5일 후,",     h1b: "결과물을 받습니다",  sub: "업종별 전문 사이트 · 운영 가능한 수준으로" },
    portfolio: { badge: "Portfolio · 42",  h1a: "결과를 보고", h1b: "맡기는 외주",         sub: "실제 라이브 사이트와 KPI를 먼저 보여드립니다" },
    process:   { badge: "Process · 5 days",h1a: "의뢰부터",   h1b: "납품까지 5일",        sub: "DAY 01 상담 → 02 견적 → 03-04 개발 → 05 납품" },
    why:       { badge: "Why AIO",         h1a: "속도, 응대,", h1b: "완성도·유지보수",     sub: "의뢰 전 가장 궁금한 4가지에 대한 답" },
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
          <span style={{ color: "var(--tone-ide-mint)" }}>{l.h1b.split(" ")[0]}</span> {l.h1b.split(" ").slice(1).join(" ")}
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 10.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.55, marginBottom: 14, maxWidth: "90%" }}>{l.sub}</p>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ padding: "6px 12px", borderRadius: 4, background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", fontFamily: "var(--font-jetbrains)", fontSize: 9.5, fontWeight: 600 }}>견적 시작 →</span>
          <span style={{ padding: "6px 12px", borderRadius: 4, background: "var(--tone-ide-bg)", color: "var(--tone-ide-fg)", fontFamily: "var(--font-jetbrains)", fontSize: 9.5, border: "1px solid var(--tone-ide-line-2)" }}>사례 보기</span>
        </div>
      </div>
      {/* stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: "14px 20px", borderTop: "1px solid var(--tone-ide-line)", borderBottom: "1px solid var(--tone-ide-line)", background: "rgba(13,17,23,0.5)" }}>
        {[["42","Projects"],["5d","Delivery"],["4.9","Rating"]].map(([n,l]) => (
          <div key={l}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 20, fontWeight: 700, color: "var(--tone-ide-mint)", letterSpacing: "-0.025em", lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 7.5, color: "var(--tone-ide-fg-3)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
          </div>
        ))}
      </div>
      {/* foot */}
      <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-jetbrains)", fontSize: 8, color: "var(--tone-ide-fg-3)", borderTop: "1px solid var(--tone-ide-line)", background: "rgba(13,17,23,0.5)" }}>
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
        <div style={{ display: "flex", alignItems: "flex-end", gap: 0, position: "relative", paddingBottom: 60 }}>

          {/* MacBook */}
          <div style={{ position: "relative", width: "76%", maxWidth: 900, margin: 0 }}>
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
              {/* site-mock: 4 pages stacked, scrolled by ideScrollUp */}
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
              <div style={{ animation: "ideScrollUp 22s linear infinite" }} className="" style2={{ display: "flex", flexDirection: "column", width: "100%", height: "400%" }}>
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
```

- [ ] **Step 2: iPhone 인라인 style 중복 수정**

위 코드에서 iPhone screen div에 `style`과 `style2`가 충돌합니다. 다음으로 교체:

```tsx
            <div style={{ position: "absolute", top: "3.4%", left: "6.5%", width: "87%", height: "93.2%", background: "var(--tone-ide-bg)", borderRadius: "11%", overflow: "hidden" }}>
              <div className="animate-ide-scroll" style={{ display: "flex", flexDirection: "column", width: "100%", height: "400%", animationDuration: "22s" }}>
                {(["home","portfolio","process","why"] as const).map((v) => (
                  <div key={`ip-${v}`} style={{ width: "100%", height: "25%", flexShrink: 0, overflow: "hidden", fontSize: "0.6em" }}>
                    <MiniPage variant={v} />
                  </div>
                ))}
              </div>
            </div>
```

- [ ] **Step 3: 빌드 확인**

```bash
cd aio-make-src
npm run build 2>&1 | tail -20
```

Expected: 오류 없음

- [ ] **Step 4: Commit**

```bash
git add components/ide/ide-device.tsx
git commit -m "feat(ide): IdeDevice — Mac+iPhone 목업 섹션 신규"
```

---

## Task 2: IdeServices — 서비스 타입 2열 카드

**Files:**
- Create: `components/ide/ide-services.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// components/ide/ide-services.tsx
import Link from "next/link";

interface Props { locale: string }

const TrafficDots = () => (
  <div style={{ display: "flex", gap: 5 }}>
    {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
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
          단순 페이지가 아니라 <strong style={{ color: "var(--tone-ide-fg)" }}>운영·확장·유지보수</strong>까지 한 팀이 맡습니다.
        </p>
      </div>

      {/* 2-col grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {cards.map((c) => (
          <div key={c.filename}
            style={{ background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 8, overflow: "hidden", transition: "border-color 0.3s" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--tone-ide-mint)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--tone-ide-line)")}
          >
            {/* title bar */}
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
                {c.desc.replace("SEO·접근성·성능", "")}
                <strong style={{ color: "var(--tone-ide-fg)", fontWeight: 600 }}>SEO·접근성·성능</strong>
                {c.desc.includes("SEO·접근성·성능") ? "을 모두 갖춘 수준까지." : ""}
              </p>
              <ul style={{ listStyle: "none", padding: 0, paddingTop: 16, borderTop: "1px solid var(--tone-ide-line)" }}>
                {c.items.map((item) => (
                  <li key={item} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12.5, color: "var(--tone-ide-fg-2)", padding: "6px 0" }}>
                    <span style={{ color: "var(--tone-ide-mint)", fontWeight: 700, marginRight: 6 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/quote`}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 22, padding: "10px 18px", background: "transparent", color: "var(--tone-ide-mint)", border: "1px solid var(--tone-ide-mint)", borderRadius: 6, fontFamily: "var(--font-jetbrains)", fontSize: 12.5, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
              >
                $ 견적 문의 →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* mobile: stack */}
      <style>{`@media(max-width:700px){.ide-svc-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}
```

> **참고**: `desc` 문자열에서 `strong` 처리가 복잡합니다. 아래처럼 `cards` 데이터를 수정하는 게 더 깔끔합니다.

- [ ] **Step 2: desc strong 처리 단순화**

`cards` 배열의 desc를 ReactNode로 바꾸지 않고, 그냥 텍스트로 유지하되 `p` 태그에서 그대로 렌더링합니다:

```tsx
// cards 배열의 desc를 다음으로 교체
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
```

그리고 `p` 태그를 다음으로 교체:

```tsx
<p style={{ fontFamily: "var(--font-pretendard)", fontSize: 14, lineHeight: 1.65, color: "var(--tone-ide-fg-2)", marginBottom: 18 }}>
  {c.desc}
</p>
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 4: Commit**

```bash
git add components/ide/ide-services.tsx
git commit -m "feat(ide): IdeServices — 서비스 타입 2열 카드 신규"
```

---

## Task 3: IdeProcess — git log 타임라인

**Files:**
- Create: `components/ide/ide-process.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// components/ide/ide-process.tsx

const rows = [
  { hash: "a1b2c3d", day: "DAY 01",   name: "consultation",      time: "무료",      desc: "30분 화상 · 요구사항·예산·일정 정리" },
  { hash: "e4f5a67", day: "DAY 02",   name: "quote + wireframe", time: "estimate", desc: "투명한 견적서 + 기획안 · 1회 무료 수정" },
  { hash: "b8c9d12", day: "DAY 03–04",name: "development",       time: "build",    desc: "매일 진행 화면 공유 · 실시간 피드백" },
  { hash: "f7e8b34", day: "DAY 05",   name: "deliver + warranty",time: "ship 🚀",  desc: "운영 가이드 + 1개월 무상 A/S" },
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
            <div key={r.hash}
              style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "18px 1fr", gap: 14, alignItems: "start", position: "relative", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--tone-ide-bg-3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* vertical line */}
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
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/ide/ide-process.tsx
git commit -m "feat(ide): IdeProcess — git log 타임라인 신규"
```

---

## Task 4: IdeResourcesTeaser — 꿀팁 4개 미리보기

**Files:**
- Create: `components/ide/ide-resources-teaser.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// components/ide/ide-resources-teaser.tsx
import Link from "next/link";

interface Props { locale: string }

const teaserItems = [
  { file: "checklist-12.pdf", size: "2.4MB", tag: "Checklist · 12p", title: "의뢰 전 결정해야 할 12가지", desc: "도메인·결제·호스팅·다국어 — 견적 전에 정하면 작업이 2일 단축되는 항목.", rating: "★ 4.9" },
  { file: "verticals-32.pdf", size: "5.2MB", tag: "Guide · 32p",     title: "업종별 사이트 구조 가이드",  desc: "병원·법률·뷰티·푸드·교육·부동산·쇼핑몰·기업 — 8개 업종별 권장 IA.",      rating: "★ 4.9" },
  { file: "5day-flow.pdf",    size: "1.8MB", tag: "Workflow · 8p",   title: "5일 외주 제작 흐름도",      desc: "DAY 01~05 — 의뢰인이 무엇을 준비하고 언제 검수해야 할지 시간표로 정리.", rating: "★ 4.9" },
  { file: "launch-day.pdf",   size: "1.6MB", tag: "Checklist · 8p",  title: "오픈 D-1 점검 8단계",       desc: "SSL·robots·sitemap·GA4 — 오픈 직전 빠뜨리면 안 되는 8개 항목.",          rating: "★ 4.8" },
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 980, margin: "0 auto" }}>
        {teaserItems.map((r) => (
          <div key={r.file}
            style={{ display: "flex", gap: 18, padding: "22px 22px 20px", background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 6, transition: "all 0.2s", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--tone-ide-mint)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "var(--tone-ide-bg-3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--tone-ide-line)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "var(--tone-ide-bg-2)"; }}
          >
            {/* PDF icon */}
            <div style={{ position: "relative", width: 48, height: 60, flexShrink: 0, background: "var(--tone-ide-bg-3)", border: "1px solid var(--tone-ide-mint-soft)", display: "grid", placeItems: "center", fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 700, color: "var(--tone-ide-mint)", letterSpacing: "0.04em" }}>
              PDF
              <span style={{ position: "absolute", top: -1, right: -1, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 12px 12px 0", borderColor: `transparent var(--tone-ide-bg) transparent transparent` }} />
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
        <Link href={`/${locale}/services/website/resources`}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "transparent", color: "var(--tone-ide-fg)", border: "1px solid var(--tone-ide-line-2)", borderRadius: 6, fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--tone-ide-mint)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--tone-ide-mint)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--tone-ide-line-2)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--tone-ide-fg)"; }}
        >
          → 전체 꿀팁 보기 (14편)
        </Link>
        <div style={{ marginTop: 14, fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-fg-3)", display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", border: "1px solid var(--tone-ide-line)", borderRadius: 14, background: "var(--tone-ide-bg-2)" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--tone-ide-mint)", display: "inline-block" }} />
          이메일 인증 없이 무료 다운로드
        </div>
      </div>

      {/* mobile responsive */}
      <style>{`@media(max-width:700px){.ide-res-teaser-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/ide/ide-resources-teaser.tsx
git commit -m "feat(ide): IdeResourcesTeaser — 꿀팁 4개 미리보기 신규"
```

---

## Task 5: IdeFaq — FAQ 아코디언

**Files:**
- Create: `components/ide/ide-faq.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// components/ide/ide-faq.tsx
"use client";
import { useState } from "react";

const faqs = [
  { num: "Q.01", q: "병원·법률 사무소처럼 전문 업종 사이트도 가능한가요?",       a: "네, 가능합니다. 의료광고법·표시광고법 등 업종별 가이드라인을 인지하고 작업합니다. 의원·한의원·치과·변호사·세무사·법무사·노무사 등 20개+ 전문 업종 사이트 경험이 있습니다." },
  { num: "Q.02", q: "5일 납품이 정말 가능한가요? 퀄리티가 떨어지지 않나요?",    a: "대부분의 의뢰는 5일 안에 끝납니다. 비결은 업종별 검증된 패턴을 기반으로 시작하기 때문입니다. 의뢰인 만족도 4.9/5를 유지하고 있습니다." },
  { num: "Q.03", q: "웹사이트와 쇼핑몰 견적은 왜 따로 나뉘나요?",               a: "구축 체계가 다릅니다. 웹사이트는 페이지 수와 다국어·CMS 위주로, 쇼핑몰은 결제·배송·회원 시스템 같은 기능 단위로 결정됩니다." },
  { num: "Q.04", q: "결제 시스템이나 예약 시스템도 만들 수 있나요?",             a: "결제는 Stripe·카카오페이·토스, 예약은 구글 캘린더 연동·자체 예약 시스템 모두 가능합니다. 추가 옵션으로 견적이 산출됩니다." },
  { num: "Q.05", q: "호스팅·도메인은 별도인가요?",                              a: "호스팅·도메인은 별도입니다. 구입·연동까지 도와드립니다 (.com 약 1.5만/년)." },
  { num: "Q.06", q: "코드 소스도 받을 수 있나요?",                              a: "네, 전체 소스코드를 GitHub로 인계해드립니다. 운영 가이드 영상도 함께 제공하므로 인수인계가 쉽습니다." },
  { num: "Q.07", q: "1개월 무상 A/S는 어떤 범위까지인가요?",                    a: "납품 후 30일간 발생하는 버그 수정·반응형 미세 조정·콘텐츠 교체는 무료입니다. 신규 기능 추가나 디자인 전면 수정은 별도 견적입니다." },
  { num: "Q.08", q: "지방에서도 작업 가능한가요?",                              a: "전국 어디든 가능합니다. 모든 작업은 화상·메신저로 진행되어 의뢰인이 서울에 계시지 않아도 됩니다. 텔레그램으로 24/7 즉시 응대 가능합니다." },
];

export function IdeFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section style={{ padding: "80px clamp(16px,3vw,24px)", maxWidth: 980, margin: "0 auto" }}>
      {/* heading */}
      <div style={{ margin: "0 auto 40px", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: "var(--tone-ide-mint)", marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
          <span style={{ color: "var(--tone-ide-syntax-string)" }}>aio faq</span>
          <span style={{ color: "var(--tone-ide-amber)" }}>--all</span>
        </div>
        <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(30px,4.2vw,52px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.08, color: "var(--tone-ide-fg)", marginBottom: 14 }}>
          자주 묻는 <span style={{ color: "var(--tone-ide-mint)" }}>질문</span>
        </h2>
        <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.6, maxWidth: 540, margin: "0 auto" }}>
          결정 전에 가장 많이 받는 8가지.
        </p>
      </div>

      {/* FAQ list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.num}
              style={{ background: "var(--tone-ide-bg-2)", border: `1px solid ${isOpen ? "var(--tone-ide-mint)" : "var(--tone-ide-line)"}`, borderRadius: 6, overflow: "hidden", transition: "border-color 0.2s" }}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                style={{ width: "100%", padding: "16px 22px", fontFamily: "var(--font-jetbrains)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, background: "transparent", border: "none", color: "var(--tone-ide-fg)", textAlign: "left" }}
              >
                <span style={{ display: "flex", alignItems: "flex-start", gap: 14, flex: 1 }}>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: "var(--tone-ide-mint)", flexShrink: 0, paddingTop: 2 }}>{f.num}</span>
                  <span>{f.q}</span>
                </span>
                <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 14, color: isOpen ? "var(--tone-ide-mint)" : "var(--tone-ide-fg-3)", transition: "transform 0.3s, color 0.2s", transform: isOpen ? "rotate(45deg)" : "none", lineHeight: 1, flexShrink: 0 }}>+</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 22px 18px 50px", fontFamily: "var(--font-pretendard)", fontSize: 13.5, color: "var(--tone-ide-fg-2)", lineHeight: 1.7 }}>
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add components/ide/ide-faq.tsx
git commit -m "feat(ide): IdeFaq — FAQ 아코디언 신규"
```

---

## Task 6: website-landing.tsx 전체 재작성

**Files:**
- Modify: `components/landing/website-landing.tsx`

**사전 확인:** `IdeIndustries`, `IdePricing` props 확인

```bash
head -10 components/ide/ide-industries.tsx
head -10 components/ide/ide-pricing.tsx
```

`IdeIndustries`는 `locale: string`, `IdePricing`은 `locale: string` props를 받는 것으로 가정 (이미 읽은 코드 기준).

- [ ] **Step 1: 파일 전체 교체**

```tsx
// components/landing/website-landing.tsx
"use client";

import { IdeTitlebar }        from "@/components/ide/ide-titlebar";
import { IdeTabbar }          from "@/components/ide/ide-tabbar";
import { IdeHero }            from "@/components/ide/ide-hero";
import { IdeDevice }          from "@/components/ide/ide-device";
import { IdeIndustries }      from "@/components/ide/ide-industries";
import { IdeServices }        from "@/components/ide/ide-services";
import { IdePricing }         from "@/components/ide/ide-pricing";
import { IdeProcess }         from "@/components/ide/ide-process";
import { IdeResourcesTeaser } from "@/components/ide/ide-resources-teaser";
import { IdeFaq }             from "@/components/ide/ide-faq";
import { IdeCta }             from "@/components/ide/ide-cta";
import { IdeStatusbar }       from "@/components/ide/ide-statusbar";
import Link from "next/link";

export function WebsiteLanding({ locale }: { locale: string }) {
  const tabs = [
    { num: "01", label: "services.tsx",  href: `/${locale}/services/website`,           active: true },
    { num: "02", label: "portfolio.tsx", href: `/${locale}/services/website/portfolio` },
    { num: "03", label: "resources.md",  href: `/${locale}/services/website/resources` },
  ];

  return (
    <main data-tone="ide" style={{ background: "var(--tone-ide-bg)", minHeight: "100vh" }}>
      <IdeTitlebar locale={locale} />
      <IdeTabbar tabs={tabs} />
      <IdeHero locale={locale} />
      <IdeDevice locale={locale} />
      <IdeIndustries />
      <IdeServices locale={locale} />
      <IdePricing locale={locale} />
      <IdeProcess />
      <IdeResourcesTeaser locale={locale} />
      <IdeFaq />

      {/* Portfolio teaser */}
      <section style={{ padding: "80px clamp(16px,3vw,24px) 56px", maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ padding: "56px clamp(20px,3vw,40px)", background: "var(--tone-ide-bg-2)", border: "1px solid var(--tone-ide-line)", borderRadius: 8, position: "relative", overflow: "hidden", textAlign: "center" }}>
          {/* glow */}
          <span style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 100%, var(--tone-ide-mint-soft), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11.5, color: "var(--tone-ide-mint)", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 8, position: "relative" }}>
            <span style={{ color: "var(--tone-ide-fg-3)" }}>$</span>
            aio open portfolio --view
          </div>
          <h2 style={{ fontFamily: "var(--font-jetbrains)", fontSize: "clamp(26px,3.4vw,42px)", fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.1, marginBottom: 14, color: "var(--tone-ide-fg)", position: "relative" }}>
            이미 42개.{" "}
            <span style={{ color: "var(--tone-ide-mint)" }}>결과를 보고</span> 결정하세요.
          </h2>
          <p style={{ fontFamily: "var(--font-pretendard)", fontSize: 15, color: "var(--tone-ide-fg-2)", maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6, position: "relative" }}>
            실제 운영 중인 사이트들. 한 작품 한 작품이 다음 의뢰의 답입니다.
          </p>
          <Link href={`/${locale}/services/website/portfolio`}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", background: "var(--tone-ide-mint)", color: "var(--tone-ide-bg)", border: "1px solid var(--tone-ide-mint)", fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 600, borderRadius: 6, textDecoration: "none", position: "relative", transition: "all 0.25s" }}
          >
            $ portfolio.tsx →
          </Link>
        </div>
      </section>

      <IdeCta locale={locale} />
      <IdeStatusbar locale={locale} />
    </main>
  );
}
```

- [ ] **Step 2: IdeIndustries props 확인 후 수정**

만약 `IdeIndustries`가 `locale` prop을 받지 않는 경우, `<IdeIndustries />` 그대로 사용. 받는 경우 `<IdeIndustries locale={locale} />`로 변경.

```bash
head -15 components/ide/ide-industries.tsx
```

출력을 보고 `Props` interface를 확인해 맞게 수정.

- [ ] **Step 3: 빌드 확인**

```bash
npm run build 2>&1 | grep -E "error|Error|✓|Failed"
```

Expected: `✓ Compiled successfully` 또는 오류 없음

- [ ] **Step 4: 개발 서버에서 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000/ko/services/website` 접속:
- IDE 톤(dark) 배경 확인
- Titlebar(traffic lights + filepath) 표시
- Tabbar (01 services.tsx active)
- Hero, Device, Industries, Services, Pricing, Process, ResourcesTeaser, FAQ, PortfolioTeaser, CTA, Statusbar 순서 확인
- 모바일 375px에서 레이아웃 깨짐 없는지 확인

- [ ] **Step 5: Commit**

```bash
git add components/landing/website-landing.tsx
git commit -m "feat: website-landing 전체 재작성 — IDE 톤 완전체"
```

---

## Task 7: website-portfolio.tsx 전체 재작성

**Files:**
- Modify: `components/landing/website-portfolio.tsx`

- [ ] **Step 1: 파일 전체 교체**

```tsx
// components/landing/website-portfolio.tsx
"use client";

import { IdeTitlebar }  from "@/components/ide/ide-titlebar";
import { IdeTabbar }    from "@/components/ide/ide-tabbar";
import { IdePortfolio } from "@/components/ide/ide-portfolio";
import { IdeStatusbar } from "@/components/ide/ide-statusbar";

export function WebsitePortfolio({ locale }: { locale: string }) {
  const tabs = [
    { num: "01", label: "services.tsx",  href: `/${locale}/services/website` },
    { num: "02", label: "portfolio.tsx", href: `/${locale}/services/website/portfolio`, active: true },
    { num: "03", label: "resources.md",  href: `/${locale}/services/website/resources` },
  ];

  return (
    <main data-tone="ide" style={{ background: "var(--tone-ide-bg)", minHeight: "100vh" }}>
      <IdeTitlebar locale={locale} />
      <IdeTabbar tabs={tabs} />
      <IdePortfolio locale={locale} />
      <IdeStatusbar locale={locale} />
    </main>
  );
}
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build 2>&1 | grep -E "error|Error|✓|Failed"
```

- [ ] **Step 3: 개발 서버에서 확인**

브라우저에서 `http://localhost:3000/ko/services/website/portfolio` 접속:
- IDE 톤(dark) 배경 확인
- Tabbar에서 02 portfolio.tsx active 강조
- 필터 칩 (전체/병원/법률·세무/쇼핑몰/...) 클릭 작동
- 프로젝트 카드 그리드 표시
- Statusbar 표시

- [ ] **Step 4: 3개 탭 이동 테스트**

| URL | 예상 active 탭 |
|---|---|
| `/ko/services/website` | 01 services.tsx |
| `/ko/services/website/portfolio` | 02 portfolio.tsx |
| `/ko/services/website/resources` | 03 resources.md |

각 탭 클릭 시 해당 페이지로 이동 확인.

- [ ] **Step 5: Commit**

```bash
git add components/landing/website-portfolio.tsx
git commit -m "feat: website-portfolio 전체 재작성 — IDE 톤 IdePortfolio 기반"
```

---

## Task 8: 최종 검증 및 배포

- [ ] **Step 1: 전체 빌드 통과**

```bash
npm run build
```

Expected: 오류 없이 완료

- [ ] **Step 2: 반응형 확인 (3개 페이지)**

개발 서버 열고 Chrome DevTools로 다음 3개 페이지를 375px / 768px / 1280px에서 확인:
- `/ko/services/website`
- `/ko/services/website/portfolio`
- `/ko/services/website/resources`

체크:
- 텍스트 깨짐 없음
- 가로 스크롤 없음
- 버튼/링크 탭 가능 크기

- [ ] **Step 3: push + Vercel 배포 확인**

```bash
git push origin master
```

Vercel 대시보드 또는 이메일에서 빌드 READY 확인.

- [ ] **Step 4: 라이브 사이트 3탭 최종 확인**

`https://aio-make.com/ko/services/website` 접속:
- IDE 톤 다크 배경
- 3탭 네비게이션 이동
- 모바일 디바이스에서도 확인

---

## 완료 체크리스트

- [ ] `ide-device.tsx` 빌드 통과
- [ ] `ide-services.tsx` 빌드 통과
- [ ] `ide-process.tsx` 빌드 통과
- [ ] `ide-resources-teaser.tsx` 빌드 통과
- [ ] `ide-faq.tsx` 빌드 통과
- [ ] `website-landing.tsx` 재작성 — IDE 섹션 순서 일치
- [ ] `website-portfolio.tsx` 재작성 — IdePortfolio + 3탭
- [ ] 3탭 간 이동 정상 작동
- [ ] 375px 모바일 반응형 이상 없음
- [ ] `npm run build` 로컬 통과
- [ ] Vercel 배포 READY 확인
