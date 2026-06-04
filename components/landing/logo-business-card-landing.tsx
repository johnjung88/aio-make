"use client";
import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiologo{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--teal:#5AC8A8;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiologo *{box-sizing:border-box}
.aiologo a{text-decoration:none;color:inherit}
.aiologo .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiologo .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
.aiologo .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s,transform 1.1s}.aiologo .reveal.in{opacity:1;transform:none}
.aiologo .reveal.d1{transition-delay:.1s}.aiologo .reveal.d2{transition-delay:.2s}.aiologo .reveal.d3{transition-delay:.3s}
.aiologo .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--teal),var(--gold))}
.aiologo .hero2{display:grid;grid-template-columns:55% 45%;min-height:100vh}
.aiologo .hero2-l{position:relative;overflow:hidden;display:flex;align-items:center;padding:clamp(80px,10vw,120px) clamp(32px,5vw,72px) clamp(60px,8vw,100px)}
.aiologo .hero2-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:.55;z-index:0}
.aiologo .hero2-ov{position:absolute;inset:0;background:linear-gradient(105deg,rgba(14,13,11,.92) 0%,rgba(14,13,11,.78) 60%,rgba(14,13,11,.88) 100%);z-index:1;pointer-events:none}
.aiologo .hero2-txt{position:relative;z-index:2;text-align:left}
.aiologo .hero2-hkick{font-family:var(--mono);font-size:11px;letter-spacing:.30em;text-transform:uppercase;color:var(--teal);margin-bottom:24px;display:block}
.aiologo .hero2-h1{font-family:var(--frau);font-weight:400;font-size:clamp(36px,4.5vw,76px);letter-spacing:-.025em;line-height:1.0;color:#F4ECDC;margin-bottom:24px;max-width:560px}
.aiologo .hero2-h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiologo .hero2-lead{font-size:clamp(14px,1.1vw,17px);color:rgba(239,233,221,.58);line-height:1.85;max-width:460px;margin-bottom:32px}
.aiologo .hero2-bdgs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px}
.aiologo .hero2-bdg{font-size:11px;font-weight:600;padding:6px 14px;border:1px solid var(--teal);color:var(--teal);border-radius:999px;letter-spacing:.04em}
.aiologo .hero2-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--teal);color:#0E0D0B;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none}
.aiologo .hero2-r{display:flex;flex-direction:column;justify-content:center;padding:clamp(80px,10vw,120px) clamp(24px,4vw,56px) clamp(60px,8vw,100px) clamp(16px,3vw,32px);gap:14px;position:relative}
.aiologo .hero2-r::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 40%,rgba(90,200,168,.06),transparent 70%);pointer-events:none}
.aiologo .kcard-inner{background:rgba(22,27,34,.88);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 18px;backdrop-filter:blur(12px);display:flex;align-items:center;gap:14px;min-width:220px;max-width:280px;box-shadow:0 8px 32px rgba(0,0,0,.45)}
.aiologo .knum-box{border-radius:8px;width:48px;height:48px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
@media(max-width:880px){.aiologo .hero2{grid-template-columns:1fr}.aiologo .hero2-r{display:none}.aiologo .hero2-l{min-height:80vh}}
@media(max-width:768px){.aiologo .hero2-txt{text-align:center}.aiologo .hero2-txt h1{max-width:none}.aiologo .hero2-txt p{max-width:none}.aiologo .hero2-bdgs{justify-content:center}}
.aiologo .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiologo .sec{padding:var(--sp-sec) 0}
.aiologo .shead{margin-bottom:48px}
.aiologo .shead .kick{display:block;margin-bottom:18px}
.aiologo .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px}
.aiologo .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiologo .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Showcase viewer */
.aiologo .sv-wrap{max-width:800px;margin:0 auto}
.aiologo .sv-frame{border:2px solid var(--gold);border-radius:12px;overflow:hidden;background:var(--bg2);position:relative;box-shadow:0 24px 64px rgba(0,0,0,.6)}
.aiologo .sv-frame img{display:block;width:100%;height:auto;object-fit:cover}
.aiologo .sv-film{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:16px}
.aiologo .sv-thumb{border:1px solid var(--line2);border-radius:8px;overflow:hidden;cursor:pointer;flex-shrink:0;width:88px;height:88px;transition:border-color .2s,transform .2s;background:none;padding:0}
.aiologo .sv-thumb:hover{border-color:var(--gold);transform:translateY(-2px)}
.aiologo .sv-thumb.active{border-color:var(--gold);box-shadow:0 0 0 2px var(--gold)}
.aiologo .sv-thumb img{display:block;width:100%;height:100%;object-fit:cover}
.aiologo .gmore{display:block;margin:32px auto 0;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px;width:fit-content}
@media(max-width:480px){.aiologo .sv-thumb{width:68px;height:68px}}

/* Gallery */
.aiologo .pgallery{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:0}
.aiologo .gcard{border-radius:12px;overflow:hidden;background:var(--bg2);transition:transform .28s,box-shadow .28s}
.aiologo .gcard:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,.5)}
.aiologo .gshot{aspect-ratio:1;position:relative;overflow:hidden}
.aiologo .gshot img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
.aiologo .gcap{padding:12px 14px;font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg3)}
@media(max-width:760px){.aiologo .pgallery{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.aiologo .pgallery{grid-template-columns:1fr}}

/* Pricing */
.aiologo .price{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:48px}
.aiologo .prow{padding:30px 22px;border:1px solid var(--gold);border-radius:14px;text-align:center;position:relative}
.aiologo .prow.rec{border-color:var(--teal);box-shadow:0 0 0 1px var(--teal)}
.aiologo .prow .rec-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);font-family:var(--mono);font-size:10px;letter-spacing:.14em;background:var(--teal);color:#0E0D0B;padding:3px 14px;border-radius:999px;white-space:nowrap}
.aiologo .prow .pname{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.aiologo .prow.rec .pname{color:var(--teal)}
.aiologo .prow .pnum{font-family:var(--frau);font-size:clamp(28px,3.5vw,42px);margin-bottom:6px}
.aiologo .prow .pnum .unit{font-size:.55em;color:var(--fg2);margin-left:4px}
.aiologo .prow .reg{font-family:var(--mono);font-size:10.5px;color:var(--fg3);text-decoration:line-through;letter-spacing:.06em;margin-bottom:10px}
.aiologo .prow ul{list-style:none;padding:0;margin:12px 0 0;text-align:left}
.aiologo .prow ul li{font-size:12.5px;color:var(--fg2);line-height:1.7;padding:4px 0;border-bottom:1px solid var(--line2)}
.aiologo .prow ul li:last-child{border-bottom:none}
.aiologo .prow ul li::before{content:"✓ ";color:var(--gold);font-weight:700}
.aiologo .prow.rec ul li::before{color:var(--teal)}
@media(max-width:760px){.aiologo .price{grid-template-columns:1fr}}

/* Addon */
.aiologo .addon-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:24px}
.aiologo .addon-row{padding:12px 16px;border:1px dashed var(--line2);border-radius:10px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.aiologo .addon-row .aname{font-size:13px;color:var(--fg2);text-align:left}
.aiologo .addon-row .aprice{font-family:var(--mono);font-size:12px;color:var(--gold);flex-shrink:0}

/* Vals */
.aiologo .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aiologo .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aiologo .v:last-child{border-right:none}
.aiologo .v .vn{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.2em;margin-bottom:8px}
.aiologo .v .vt{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aiologo .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aiologo .vals{grid-template-columns:1fr 1fr}.aiologo .v:nth-child(2n){border-right:none}.aiologo .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

/* CTA */
.aiologo .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aiologo .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(90,200,168,.10),transparent 70%)}
.aiologo .ctaS .wrap{position:relative}
.aiologo .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiologo .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiologo .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const SHOWCASE_BRANDS = [
  {
    id: "moru-coffee",
    label: "카페·F&B",
    slides: [
      { src: "/portfolio/logo-showcase/moru-coffee/premium-logo-detail.jpg",         cap: "로고 디자인" },
      { src: "/portfolio/logo-showcase/moru-coffee/premium-business-card-detail.jpg", cap: "명함 디자인" },
      { src: "/portfolio/logo-showcase/moru-coffee/premium-presentation.jpg",         cap: "브랜드 프레젠테이션" },
      { src: "/portfolio/logo-showcase/moru-coffee/premium-packaging-detail.jpg",     cap: "패키징 적용" },
    ],
  },
  {
    id: "vela-skin",
    label: "뷰티·스킨케어",
    slides: [
      { src: "/portfolio/logo-showcase/vela-skin/premium-logo-detail.jpg",         cap: "로고 디자인" },
      { src: "/portfolio/logo-showcase/vela-skin/premium-business-card-detail.jpg", cap: "명함 디자인" },
      { src: "/portfolio/logo-showcase/vela-skin/premium-presentation.jpg",         cap: "브랜드 프레젠테이션" },
      { src: "/portfolio/logo-showcase/vela-skin/premium-packaging-detail.jpg",     cap: "패키징 적용" },
    ],
  },
  {
    id: "flowstack",
    label: "테크·스타트업",
    slides: [
      { src: "/portfolio/logo-showcase/flowstack/premium-logo-detail.jpg",         cap: "로고 디자인" },
      { src: "/portfolio/logo-showcase/flowstack/premium-business-card-detail.jpg", cap: "명함 디자인" },
      { src: "/portfolio/logo-showcase/flowstack/premium-presentation.jpg",         cap: "브랜드 프레젠테이션" },
    ],
  },
  {
    id: "harufit",
    label: "건강·피트니스",
    slides: [
      { src: "/portfolio/logo-showcase/harufit/premium-logo-detail.jpg",         cap: "로고 디자인" },
      { src: "/portfolio/logo-showcase/harufit/premium-business-card-detail.jpg", cap: "명함 디자인" },
      { src: "/portfolio/logo-showcase/harufit/premium-presentation.jpg",         cap: "브랜드 프레젠테이션" },
    ],
  },
];

const GALLERY_BRANDS = [
  { id: "moru-coffee",   cap: "모루 커피 — F&B" },
  { id: "vela-skin",     cap: "벨라스킨 — 뷰티" },
  { id: "flowstack",     cap: "플로우스택 — SaaS" },
  { id: "harufit",       cap: "하루핏 — 헬스케어" },
  { id: "nudekind",      cap: "누드카인드 — 라이프스타일" },
  { id: "nova-node",     cap: "노바노드 — IT" },
];

const PRICING = [
  {
    name: "입문형 로고·명함",
    price: "29,000",
    reg: "59,000",
    duration: "1일",
    recommended: false,
    includes: ["로고 1안", "명함 1안", "수정 1회", "PNG/JPG/PDF 납품"],
  },
  {
    name: "실속형 로고 3안·명함",
    price: "49,000",
    reg: "99,000",
    duration: "1-2일",
    recommended: true,
    includes: ["로고 3안 제안", "최종 1안 선택", "명함 1안", "수정 2회", "PNG/JPG/PDF 납품"],
  },
  {
    name: "창업형 브랜드 키트",
    price: "99,000",
    reg: "199,000",
    duration: "2-3일",
    recommended: false,
    includes: ["로고 3안 + 명함 1안", "SNS 프로필 이미지", "실사 목업 3컷", "미니 브랜드 가이드", "PNG/JPG/PDF/SVG 납품"],
  },
];

const ADDONS = [
  { name: "AI(일러스트레이터) 원본 파일", price: "+₩20,000" },
  { name: "명함 인원 추가 1명",           price: "+₩10,000" },
  { name: "수정 1회 추가",               price: "+₩10,000" },
  { name: "실사 목업 3컷 추가",           price: "+₩20,000" },
  { name: "급행 24시간 납품",            price: "+₩20,000" },
];

export function LogoBusinessCardLanding({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeBrandId, setActiveBrandId] = useState("moru-coffee");
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const activeBrand = SHOWCASE_BRANDS.find((b) => b.id === activeBrandId) ?? SHOWCASE_BRANDS[0];
  const activeSlide = activeBrand.slides[activeSlideIdx] ?? activeBrand.slides[0];

  const handleBrandChange = (id: string) => {
    setActiveBrandId(id);
    setActiveSlideIdx(0);
  };

  useEffect(() => {
    const root = ref.current; if (!root) return;
    const prog = root.querySelector<HTMLElement>(".prog");
    const onScroll = () => {
      const h = document.documentElement;
      if (prog) prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: .14 }
    );
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const base = `/${locale}`;
  return (
    <div className="aiologo" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" sub="logo-business-card" active="service" />

      {/* ── DARK HERO ── */}
      <header className="hero2">
        {/* 왼쪽: 배경 이미지 + 텍스트 */}
        <div className="hero2-l">
          <img
            className="hero2-bg"
            src="/images/services/logo-team.png"
            alt=""
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="hero2-ov" />
          <div className="hero2-txt">
            <span className="hero2-hkick">AIO · Brand Design · N° 06</span>
            <h1 className="hero2-h1">
              처음 본 사람도<br />
              기억하는 <em>브랜드</em>
            </h1>
            <p className="hero2-lead">
              로고·명함·브랜드 키트 — 창업 첫날부터<br />
              신뢰감 있는 첫인상을 만듭니다
            </p>
            <div className="hero2-bdgs">
              {["1일 납품", "원본 파일 제공", "수정 무제한"].map((b) => (
                <span key={b} className="hero2-bdg">{b}</span>
              ))}
            </div>
            <a className="hero2-btn" href={`${base}/quote`}>로고·명함 제작 문의 →</a>
          </div>
        </div>

        {/* 오른쪽: KPI 카드 */}
        <div className="hero2-r">
          {([
            { kpi: "240+", label: "누적 제작",   sub: "로고·명함·브랜드 키트", color: "#5AC8A8", ml: 0,  delay: "0s",   idx: 0 },
            { kpi: "1일",  label: "최단 납품",   sub: "입문형 기준",            color: "#C8A24A", ml: 44, delay: "0.6s", idx: 1 },
            { kpi: "88%",  label: "재의뢰율",    sub: "240건 중 211건 재의뢰",  color: "#5AC8A8", ml: 20, delay: "1.2s", idx: 2 },
            { kpi: "3안",  label: "실속형 제안", sub: "마음에 드는 방향 선택",  color: "#C8A24A", ml: 60, delay: "1.8s", idx: 3 },
            { kpi: "SVG",  label: "원본 납품",   sub: "인쇄·웹 모두 사용 가능", color: "#5AC8A8", ml: 10, delay: "0.3s", idx: 4 },
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

      {/* ── 브랜드 쇼케이스 ── */}
      <section className="sec wrap">
        <div className="shead reveal">
          <span className="kick">Brand Showcase</span>
          <h2>이런 <em>브랜드</em>를 만듭니다</h2>
          <p>카페·뷰티·테크·헬스케어 — 분야별 실제 납품 작업물</p>
        </div>

        {/* 브랜드 탭 */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          {SHOWCASE_BRANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => handleBrandChange(b.id)}
              style={{
                padding: "8px 18px", borderRadius: 999, border: "1px solid",
                borderColor: activeBrandId === b.id ? "var(--gold)" : "rgba(239,233,221,0.15)",
                background: activeBrandId === b.id ? "var(--gold)" : "transparent",
                color: activeBrandId === b.id ? "#0E0D0B" : "rgba(239,233,221,0.5)",
                fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 12,
                fontWeight: activeBrandId === b.id ? 700 : 400, cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* 메인 이미지 뷰어 */}
        <div className="sv-wrap reveal">
          <div className="sv-frame">
            <img src={activeSlide.src} alt={activeSlide.cap} />
          </div>
          <div className="sv-film">
            {activeBrand.slides.map((sl, idx) => (
              <button
                key={sl.src}
                type="button"
                onClick={() => setActiveSlideIdx(idx)}
                className={`sv-thumb${activeSlideIdx === idx ? " active" : ""}`}
              >
                <img src={sl.src} alt={sl.cap} />
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <span style={{ fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--fg3)" }}>
              {activeSlide.cap}
            </span>
          </div>
        </div>

        <a className="gmore reveal" href={`${base}/services/logo-business-card/portfolio`}>
          포트폴리오 전체 보기 →
        </a>
      </section>

      {/* ── 최근 작업 갤러리 ── */}
      <section className="sec wrap">
        <div className="shead reveal">
          <span className="kick">Recent Work</span>
          <h2>최근 <em>작업물</em></h2>
          <p>분야·스타일·규모 모두 다른 실제 납품 브랜드</p>
        </div>
        <div className="pgallery">
          {GALLERY_BRANDS.map(({ id, cap }, i) => (
            <div key={id} className={`gcard reveal d${(i % 3) + 1}`}>
              <div className="gshot">
                <img
                  src={`/portfolio/logo-showcase/${id}/premium-logo-detail.jpg`}
                  alt={cap}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `/portfolio/logo-showcase/${id}/cover.svg`;
                  }}
                />
              </div>
              <div className="gcap">{cap}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 가격 ── */}
      <section className="sec wrap">
        <div className="shead reveal">
          <span className="kick">Pricing · 한정 (~26년 6월)</span>
          <h2>가격은 <em>패키지별</em></h2>
          <p>표시 가격은 26년 6월까지 한정 · 정상가는 표시가의 2배</p>
        </div>
        <div className="price">
          {PRICING.map((p, i) => (
            <div key={p.name} className={`prow reveal d${i + 1}${p.recommended ? " rec" : ""}`}>
              {p.recommended && <div className="rec-badge">추천</div>}
              <div className="pname">{p.name}</div>
              <div className="pnum">
                {p.price.replace(",", "")}
                <span className="unit">원</span>
              </div>
              <div className="reg">정상가 {p.reg}원~</div>
              <div style={{ fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 11, color: "var(--fg3)", marginBottom: 12 }}>
                납품 {p.duration}
              </div>
              <ul>
                {p.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 애드온 */}
        <div style={{ maxWidth: 760, margin: "40px auto 0" }}>
          <p style={{ fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 11, letterSpacing: ".20em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 16 }}>Add-ons</p>
          <div className="addon-grid reveal d2">
            {ADDONS.map(({ name, price }) => (
              <div key={name} className="addon-row">
                <span className="aname">{name}</span>
                <span className="aprice">{price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 일하는 방식 ── */}
      <section className="sec wrap">
        <div className="shead reveal">
          <span className="kick">How we work</span>
          <h2>일하는 <em>방식</em></h2>
        </div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">브리프 접수</div><div className="vd">업종·톤·레퍼런스 확인 후 당일 착수</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">3안 제안</div><div className="vd">방향이 다른 3가지 시안 제시</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">수정 무제한</div><div className="vd">마음에 들 때까지 수정</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">원본 납품</div><div className="vd">PNG·JPG·PDF·SVG 모두 포함</div></div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ctaS">
        <div className="wrap reveal">
          <h2>브랜드로<br /><em>시작</em>하세요</h2>
          <p>지금 문의하면 24시간 안에 견적 · 1일 안에 첫 시안</p>
          <a className="cta-pill" href={`${base}/quote`}>로고·명함 제작 문의 →</a>
        </div>
      </section>

      <AioFooter locale={locale} />
    </div>
  );
}
