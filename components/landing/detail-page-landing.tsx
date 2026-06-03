"use client";
import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiodp2{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--rose:#D78A8A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiodp2 *{box-sizing:border-box}
.aiodp2 a{text-decoration:none;color:inherit}
.aiodp2 .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiodp2 .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
.aiodp2 .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s,transform 1.1s}.aiodp2 .reveal.in{opacity:1;transform:none}
.aiodp2 .reveal.d1{transition-delay:.1s}.aiodp2 .reveal.d2{transition-delay:.2s}
.aiodp2 .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--rose),var(--gold))}
.aiodp2 .hero2{display:grid;grid-template-columns:55% 45%;min-height:100vh}
.aiodp2 .hero2-l{position:relative;overflow:hidden;display:flex;align-items:center;padding:clamp(80px,10vw,120px) clamp(32px,5vw,72px) clamp(60px,8vw,100px)}
.aiodp2 .hero2-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:.55;z-index:0}
.aiodp2 .hero2-ov{position:absolute;inset:0;background:linear-gradient(105deg,rgba(14,13,11,.92) 0%,rgba(14,13,11,.78) 60%,rgba(14,13,11,.88) 100%);z-index:1;pointer-events:none}
.aiodp2 .hero2-txt{position:relative;z-index:2;text-align:left}
.aiodp2 .hero2-hkick{font-family:var(--mono);font-size:11px;letter-spacing:.30em;text-transform:uppercase;color:var(--rose);margin-bottom:24px;display:block}
.aiodp2 .hero2-h1{font-family:var(--frau);font-weight:400;font-size:clamp(36px,4.5vw,76px);letter-spacing:-.025em;line-height:1.0;color:#F4ECDC;margin-bottom:24px;max-width:560px}
.aiodp2 .hero2-h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2 .hero2-lead{font-size:clamp(14px,1.1vw,17px);color:rgba(239,233,221,.58);line-height:1.85;max-width:460px;margin-bottom:32px}
.aiodp2 .hero2-bdgs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px}
.aiodp2 .hero2-bdg{font-size:11px;font-weight:600;padding:6px 14px;border:1px solid var(--rose);color:var(--rose);border-radius:999px;letter-spacing:.04em}
.aiodp2 .hero2-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--rose);color:#0E0D0B;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none}
.aiodp2 .hero2-r{display:flex;flex-direction:column;justify-content:center;padding:clamp(80px,10vw,120px) clamp(24px,4vw,56px) clamp(60px,8vw,100px) clamp(16px,3vw,32px);gap:14px;position:relative}
.aiodp2 .hero2-r::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 40%,rgba(215,138,138,.06),transparent 70%);pointer-events:none}
.aiodp2 .kcard-inner{background:rgba(22,27,34,.88);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 18px;backdrop-filter:blur(12px);display:flex;align-items:center;gap:14px;min-width:220px;max-width:280px;box-shadow:0 8px 32px rgba(0,0,0,.45)}
.aiodp2 .knum-box{border-radius:8px;width:48px;height:48px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
@media(max-width:880px){.aiodp2 .hero2{grid-template-columns:1fr}.aiodp2 .hero2-r{display:none}.aiodp2 .hero2-l{min-height:80vh}}
.aiodp2 .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiodp2 .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiodp2 .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aiodp2 .sec{padding:var(--sp-sec) 0}
.aiodp2 .shead{margin-bottom:48px}
.aiodp2 .shead .kick{display:block;margin-bottom:18px}
.aiodp2 .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px}
.aiodp2 .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2 .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Phone mockup — real image */
.aiodp2 .pre{display:flex;justify-content:center;gap:28px;align-items:flex-end;padding-bottom:8px}
.aiodp2 .ph{position:relative;border-radius:36px;overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,.7),0 0 0 1.5px rgba(200,162,74,.4);background:#0a0908;flex-shrink:0}
.aiodp2 .ph::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:72px;height:22px;background:#0a0908;border-radius:0 0 16px 16px;z-index:3}
.aiodp2 .ph::after{content:"";position:absolute;inset:0;border-radius:36px;box-shadow:inset 0 0 0 1px rgba(200,162,74,.2);z-index:3;pointer-events:none}
.aiodp2 .ph img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center;position:relative;z-index:1}
.aiodp2 .ph.s{width:220px;height:440px}
.aiodp2 .ph.m{width:240px;height:520px}
.aiodp2 .ph.l{width:260px;height:620px}
.aiodp2 .ph .badge{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);white-space:nowrap;font-family:var(--mono);font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);background:rgba(14,13,11,.88);padding:5px 14px;border-radius:999px;border:1px solid rgba(200,162,74,.35);z-index:4}
@media(max-width:820px){.aiodp2 .pre{gap:14px}.aiodp2 .ph.s{width:160px;height:320px}.aiodp2 .ph.m{width:175px;height:380px}.aiodp2 .ph.l{width:190px;height:450px}}
@media(max-width:500px){.aiodp2 .pre{gap:8px}.aiodp2 .ph.s{width:28vw;height:56vw}.aiodp2 .ph.m{width:30vw;height:64vw}.aiodp2 .ph.l{width:32vw;height:75vw}}

/* Portfolio gallery */
.aiodp2 .pgallery{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:0}
.aiodp2 .gcard{border-radius:12px;overflow:hidden;background:#17150F;transition:transform .28s,box-shadow .28s}
.aiodp2 .gcard:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,.5)}
.aiodp2 .gshot{aspect-ratio:3/4;position:relative;overflow:hidden}
.aiodp2 .gshot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
.aiodp2 .gcap{padding:12px 14px;font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg3)}
.aiodp2 .gmore{display:block;margin:32px auto 0;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px;width:fit-content}
@media(max-width:760px){.aiodp2 .pgallery{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.aiodp2 .pgallery{grid-template-columns:1fr}}

.aiodp2 .price{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:48px}
.aiodp2 .prow{padding:30px 22px;border:1px solid var(--gold);border-radius:14px;text-align:center}
.aiodp2 .prow .pname{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.aiodp2 .prow .pnum{font-family:var(--frau);font-size:clamp(28px,3.5vw,42px);margin-bottom:6px}
.aiodp2 .prow .pnum .unit{font-size:.55em;color:var(--fg2);margin-left:4px}
.aiodp2 .prow .reg{font-family:var(--mono);font-size:10.5px;color:var(--fg3);text-decoration:line-through;letter-spacing:.06em;margin-bottom:6px}
.aiodp2 .prow .pdesc{font-size:13px;line-height:1.8;color:var(--fg2);margin-top:8px}
@media(max-width:760px){.aiodp2 .price{grid-template-columns:1fr}}

.aiodp2 .addon{max-width:520px;margin:24px auto 0;padding:18px 22px;border:1px dashed var(--line2);border-radius:12px;font-size:13px;color:var(--fg2)}
.aiodp2 .addon b{color:var(--gold)}

.aiodp2 .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aiodp2 .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aiodp2 .v:last-child{border-right:none}
.aiodp2 .v .vn{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.2em;margin-bottom:8px}
.aiodp2 .v .vt{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aiodp2 .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aiodp2 .vals{grid-template-columns:1fr 1fr}.aiodp2 .v:nth-child(2n){border-right:none}.aiodp2 .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

.aiodp2 .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aiodp2 .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(215,138,138,.10),transparent 70%)}
.aiodp2 .ctaS .wrap{position:relative}
.aiodp2 .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiodp2 .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2 .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const PREVIEW_ITEMS = [
  { id: "vegan-cleanser",   label: "5,000PX",  name: "비건 클렌저",    src: "/portfolio/detail-page/vegan-cleanser/detail.png" },
  { id: "premium-mealkit",  label: "10,000PX", name: "프리미엄 밀키트", src: "/portfolio/detail-page/premium-mealkit/detail.png" },
  { id: "linen-onepiece",   label: "20,000PX", name: "리넨 원피스",    src: "/portfolio/detail-page/linen-onepiece/detail.png" },
];
type PreviewItem = (typeof PREVIEW_ITEMS)[number];

// Monitor screen area: top=1.71% left=12.01% width=76.11% height=70.85%
function PreviewMacbook({ item }: { item: PreviewItem }) {
  return (
    <div style={{ position: "relative", width: "74%", maxWidth: 800, flexShrink: 0 }}>
      <div style={{ position: "relative" }}>
        {/* Content behind transparent mockup */}
        <div style={{
          position: "absolute",
          top: "1.71%", left: "12.01%", width: "76.11%", height: "70.85%",
          overflow: "hidden", zIndex: 0,
        }}>
          <img src={item.src} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
        </div>
        {/* Transparent-screen monitor mockup on top */}
        <img
          src="/mockups/monitor.png"
          alt="monitor mockup"
          style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))" }}
        />
      </div>
    </div>
  );
}

// Phone screen area: top=15.79% left=18.17% width=63.54% height=70.87%
function PreviewPhone({ item }: { item: PreviewItem }) {
  return (
    <div style={{
      position: "absolute", bottom: "-8%", right: "1%",
      width: "21%", maxWidth: 170, transform: "rotate(3deg)", zIndex: 10,
    }}>
      <div style={{ position: "relative" }}>
        {/* Content behind transparent mockup */}
        <div style={{
          position: "absolute",
          top: "15.79%", left: "18.17%", width: "63.54%", height: "70.87%",
          overflow: "hidden", zIndex: 0,
        }}>
          <img src={item.src} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }} />
        </div>
        {/* Transparent-screen phone mockup on top */}
        <img
          src="/mockups/phone.png"
          alt="phone mockup"
          style={{ width: "100%", height: "auto", display: "block", position: "relative", zIndex: 1, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
        />
        <div style={{
          position: "absolute", bottom: "10%", left: "50%", transform: "translateX(-50%)",
          whiteSpace: "nowrap", fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 9,
          letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)",
          background: "rgba(14,13,11,0.88)", padding: "5px 14px", borderRadius: 999,
          border: "1px solid rgba(200,162,74,0.35)", zIndex: 4,
        }}>
          {item.label}
        </div>
      </div>
    </div>
  );
}

const GALLERY_ITEMS = [
  { src: "/portfolio/detail-page/vegan-cleanser/cover.png",  cap: "비건 클렌저" },
  { src: "/portfolio/detail-page/premium-mealkit/cover.png", cap: "프리미엄 밀키트" },
  { src: "/portfolio/detail-page/linen-onepiece/cover.png",  cap: "리넨 원피스" },
  { src: "/portfolio/detail-page/herbal-cream/cover.png",    cap: "허브 크림" },
  { src: "/portfolio/detail-page/hotel-bedding/cover.png",   cap: "호텔 침구" },
  { src: "/portfolio/detail-page/senior-protein/cover.png",  cap: "시니어 단백질" },
];

export function DetailPageLanding({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [previewId, setPreviewId] = useState("vegan-cleanser");
  const activePreview = PREVIEW_ITEMS.find((p) => p.id === previewId) ?? PREVIEW_ITEMS[0];
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const prog = root.querySelector<HTMLElement>(".prog");
    const onScroll = () => { const h = document.documentElement; if (prog) prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%"; };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .14 });
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);
  const base = `/${locale}`;
  return (
    <div className="aiodp2" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" sub="detail-page" active="service" />

      <header className="hero2">
        {/* 왼쪽: 팀 사진 + 텍스트 */}
        <div className="hero2-l">
          <img className="hero2-bg" src="/images/services/detail-page-team.jpg" alt="" />
          <div className="hero2-ov" />
          <div className="hero2-txt">
            <span className="hero2-hkick">AIO · Detail Page · N° 04</span>
            <h1 className="hero2-h1">스크롤을 멈추게<br className="hidden md:block" />만드는 <em>상세페이지</em></h1>
            <p className="hero2-lead">5,000PX 기본 소개부터 20,000PX 풀 스토리텔링까지<br className="hidden md:block" />시선·증거·CTA를 하나의 흐름으로 설계합니다</p>
            <div className="hero2-bdgs">
              {["2~5일 납품", "원본 PSD 무료", "수정 무제한"].map((b) => (
                <span key={b} className="hero2-bdg">{b}</span>
              ))}
            </div>
            <a className="hero2-btn" href={`${base}/quote`}>상세페이지 제작 문의 →</a>
          </div>
        </div>
        {/* 오른쪽: KPI 카드 */}
        <div className="hero2-r">
          {([
            { kpi: "320+",  label: "누적 납품",   sub: "상세페이지 누적 제작",  color: "#D78A8A", ml: 0,  delay: "0s",   idx: 0 },
            { kpi: "+23%",  label: "전환율 향상",  sub: "평균 CVR 개선 효과",   color: "#C8A24A", ml: 44, delay: "0.6s", idx: 1 },
            { kpi: "3.2일", label: "평균 납품",   sub: "의뢰 후 첫 시안까지",  color: "#D78A8A", ml: 20, delay: "1.2s", idx: 2 },
            { kpi: "89%",   label: "재의뢰율",    sub: "320건 중 285건 재의뢰", color: "#C8A24A", ml: 60, delay: "1.8s", idx: 3 },
            { kpi: "1만원", label: "GIF 모션",    sub: "건당 애니메이션 추가",  color: "#D78A8A", ml: 10, delay: "0.3s", idx: 4 },
          ] as const).map((c) => (
            <div key={c.label} style={{ marginLeft: c.ml, animation: `kpiFloat${c.idx} ${2.4 + c.idx * 0.35}s ease-in-out ${c.delay} infinite`, position: "relative", zIndex: 1 }}>
              <div className="kcard-inner" style={{ borderLeft: `3px solid ${c.color}` }}>
                <div className="knum-box" style={{ background: `${c.color}18`, border: `1px solid ${c.color}35` }}>
                  <span style={{ fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 13, fontWeight: 700, color: c.color, lineHeight: 1 }}>{c.kpi}</span>
                  <span style={{ fontSize: 10, color: c.color, opacity: 0.7, marginTop: 2 }}>↑</span>
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#F4ECDC", marginBottom: 3 }}>{c.label}</p>
                  <p style={{ fontSize: 11, color: "rgba(239,233,221,.42)", lineHeight: 1.5 }}>{c.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Studio Preview · 3 sizes</span><h2>화면으로 보는 <em>작업물</em></h2><p>실제 납품된 상세페이지 — PC와 모바일 두 화면으로</p></div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          {PREVIEW_ITEMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreviewId(p.id)}
              style={{
                padding: "8px 18px", borderRadius: 999, border: "1px solid",
                borderColor: previewId === p.id ? "var(--gold)" : "rgba(239,233,221,0.15)",
                background: previewId === p.id ? "var(--gold)" : "transparent",
                color: previewId === p.id ? "#0E0D0B" : "rgba(239,233,221,0.5)",
                fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 12,
                fontWeight: previewId === p.id ? 700 : 400, cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="reveal" style={{ background: "#F0EDE6", borderRadius: 24, padding: "40px 32px 80px", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", paddingBottom: 20 }}>
            <PreviewMacbook item={activePreview} />
            <PreviewPhone item={activePreview} />
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--fg3)" }}>
              {activePreview.name} · {activePreview.label}
            </span>
          </div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Recent Work</span><h2>최근 <em>작업물</em></h2><p>실제 납품된 상세페이지 — 카테고리·길이·스타일 모두 다르게</p></div>
        <div className="pgallery">
          {GALLERY_ITEMS.map(({ src, cap }, i) => (
            <div key={src} className={`gcard reveal d${(i % 3) + 1}`}>
              <div className="gshot"><img src={src} alt={cap} loading="lazy" /></div>
              <div className="gcap">{cap}</div>
            </div>
          ))}
        </div>
        <a className="gmore reveal d2" href={`/${locale}/services/detail-page/portfolio`}>포트폴리오 전체 보기 →</a>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 한정 (~26년 6월)</span><h2>가격은 <em>길이별</em></h2><p>표시 가격은 26년 6월까지 한정 · 정상가는 표시가의 3배</p></div>
        <div className="price">
          <div className="prow reveal d1"><div className="pname">기본 · 5,000PX</div><div className="pnum">4.9<span className="unit">만원</span></div><div className="reg">정상가 14.7만원</div><div className="pdesc">제품 소개 + 핵심 USP + CTA</div></div>
          <div className="prow reveal d2"><div className="pname">표준 · 10,000PX</div><div className="pnum">6.9<span className="unit">만원</span></div><div className="reg">정상가 20.7만원</div><div className="pdesc">스토리텔링 + 증거 + 비교 + CTA</div></div>
          <div className="prow reveal d1"><div className="pname">풀 · 20,000PX</div><div className="pnum">9.9<span className="unit">만원</span></div><div className="reg">정상가 29.7만원</div><div className="pdesc">풀 스토리텔링 + Q&amp;A + 후기 + 추천</div></div>
        </div>
        <div className="addon reveal d2">⊕ <b>GIF</b> 건당 <b>1만원</b> · 움직이는 비교/시연 등 모션 컷 추가</div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">매일 공유</div><div className="vd">진행을 매일 알려드립니다</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">원본 PSD</div><div className="vd">PSD 원본 무료 제공</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 2~5일 — 다음 날 착수</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">2차 수정 무료</div><div className="vd">시안·중간·최종 무제한</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>팔리게 만들<br /><em>제품</em>이 있나요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
