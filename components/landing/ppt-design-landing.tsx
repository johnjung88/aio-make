"use client";
import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aioppt{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--blue:#7AAEEC;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aioppt *{box-sizing:border-box}
.aioppt a{text-decoration:none;color:inherit}
.aioppt .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aioppt .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
.aioppt .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s,transform 1.1s}.aioppt .reveal.in{opacity:1;transform:none}
.aioppt .reveal.d1{transition-delay:.1s}.aioppt .reveal.d2{transition-delay:.2s}.aioppt .reveal.d3{transition-delay:.3s}
.aioppt .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--blue),var(--gold))}
.aioppt .hero2{position:relative;overflow:hidden;display:grid;grid-template-columns:1fr;min-height:100vh}
.aioppt .hero2-l{position:relative;z-index:2;display:flex;align-items:center;padding:clamp(80px,10vw,120px) clamp(32px,5vw,72px) clamp(60px,8vw,100px)}
.aioppt .hero2-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:.75;z-index:0}
.aioppt .hero2-ov{position:absolute;inset:0;background:linear-gradient(105deg,rgba(14,13,11,.92) 0%,rgba(14,13,11,.72) 50%,rgba(14,13,11,.35) 100%);z-index:1;pointer-events:none}
.aioppt .hero2-txt{position:relative;z-index:2;text-align:center;width:100%}
.aioppt .hero2-txt h1,.aioppt .hero2-txt p{margin-left:auto;margin-right:auto}
.aioppt .hero2-hkick{font-family:var(--mono);font-size:11px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);margin-bottom:24px;display:block}
.aioppt .hero2-h1{font-family:var(--frau);font-weight:400;font-size:clamp(36px,4.5vw,76px);letter-spacing:-.025em;line-height:1.0;color:#F4ECDC;margin-bottom:24px;max-width:560px}
.aioppt .hero2-h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aioppt .hero2-lead{font-size:clamp(14px,1.1vw,17px);color:rgba(239,233,221,.58);line-height:1.85;max-width:460px;margin-bottom:32px}
.aioppt .hero2-bdgs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px;justify-content:center}
.aioppt .hero2-bdg{font-size:11px;font-weight:600;padding:6px 14px;border:1px solid var(--blue);color:var(--blue);border-radius:999px;letter-spacing:.04em}
.aioppt .hero2-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--blue);color:#0E0D0B;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none}
.aioppt .hero2-r{display:none;flex-direction:column;justify-content:center;padding:clamp(80px,10vw,120px) clamp(24px,4vw,56px) clamp(60px,8vw,100px) clamp(16px,3vw,32px);gap:14px;position:relative;z-index:2}
.aioppt .hero2-r::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 40%,rgba(122,174,236,.06),transparent 70%);pointer-events:none}
.aioppt .kcard-inner{background:rgba(22,27,34,.88);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 18px;backdrop-filter:blur(12px);display:flex;align-items:center;gap:14px;min-width:220px;max-width:280px;box-shadow:0 8px 32px rgba(0,0,0,.45)}
.aioppt .knum-box{border-radius:8px;width:48px;height:48px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
@media(max-width:880px){.aioppt .hero2{grid-template-columns:1fr}.aioppt .hero2-r{display:none}.aioppt .hero2-l{min-height:80vh}}
@media(max-width:880px){.aioppt .hero2-txt{text-align:center;width:100%}.aioppt .hero2-txt h1{max-width:none}.aioppt .hero2-txt p{max-width:none}.aioppt .hero2-bdgs{justify-content:center}}

/* Slide viewer */
.aioppt .sv-frame{border:2px solid var(--gold);border-radius:12px;overflow:hidden;background:var(--bg2);aspect-ratio:16/9;position:relative;max-width:800px;margin:0 auto;box-shadow:0 24px 64px rgba(0,0,0,.6)}
.aioppt .sv-frame img{display:block;width:100%;height:100%;object-fit:cover;object-position:top center}
.aioppt .sv-film{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px}
.aioppt .sv-thumb{border:1px solid var(--line2);border-radius:8px;overflow:hidden;cursor:pointer;flex-shrink:0;width:100px;aspect-ratio:16/9;transition:border-color .2s,transform .2s}
.aioppt .sv-thumb:hover{border-color:var(--gold);transform:translateY(-2px)}
.aioppt .sv-thumb.active{border-color:var(--gold);box-shadow:0 0 0 2px var(--gold)}
.aioppt .sv-thumb img{display:block;width:100%;height:100%;object-fit:cover}
.aioppt .gmore{display:block;margin:32px auto 0;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px;width:fit-content}
@media(max-width:640px){.aioppt .sv-thumb{width:80px}}
.aioppt .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aioppt .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aioppt .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aioppt .sec{padding:var(--sp-sec) 0}
.aioppt .shead{margin-bottom:48px}
.aioppt .shead .kick{display:block;margin-bottom:18px}
.aioppt .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px}
.aioppt .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aioppt .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Slide gallery — real images */
.aioppt .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:960px;margin:0 auto}
.aioppt .pcard{border:1px solid var(--line2);border-radius:10px;overflow:hidden;background:var(--bg2);transition:border-color .25s,transform .25s}
.aioppt .pcard:hover{border-color:var(--gold);transform:translateY(-3px)}
.aioppt .pshot{aspect-ratio:16/9;overflow:hidden;position:relative}
.aioppt .pshot img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top}
.aioppt .pcap{padding:10px 14px;font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg3)}
@media(max-width:720px){.aioppt .pgrid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.aioppt .pgrid{grid-template-columns:1fr}}

.aioppt .price{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.aioppt .prow{padding:30px 24px;border:1px solid var(--gold);border-radius:14px;text-align:center}
.aioppt .prow .pname{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.aioppt .prow .pnum{font-family:var(--frau);font-size:clamp(30px,4vw,44px);margin-bottom:6px}
.aioppt .prow .pnum .unit{font-size:.55em;color:var(--fg2);margin-left:4px}
.aioppt .prow .pdesc{font-size:13px;line-height:1.8;color:var(--fg2);margin-top:8px}
@media(max-width:760px){.aioppt .price{grid-template-columns:1fr}}
.aioppt .addon{margin:24px auto 0;padding:18px 22px;border:1px dashed rgba(200,162,74,.22);border-radius:12px;font-size:13px;color:var(--fg2)}
.aioppt .addon-list{list-style:none;padding:0;margin:10px 0 0;display:flex;flex-direction:column;gap:6px}
.aioppt .addon-list li{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(239,233,221,.07)}
.aioppt .addon-list li:last-child{border-bottom:none}
.aioppt .addon-price{font-family:var(--mono);font-size:12px;color:var(--gold);white-space:nowrap;margin-left:12px}

.aioppt .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aioppt .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aioppt .v:last-child{border-right:none}
.aioppt .v .vn{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.2em;margin-bottom:8px}
.aioppt .v .vt{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aioppt .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aioppt .vals{grid-template-columns:1fr 1fr}.aioppt .v:nth-child(2n){border-right:none}.aioppt .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

.aioppt .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aioppt .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(122,174,236,.10),transparent 70%)}
.aioppt .ctaS .wrap{position:relative}
.aioppt .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aioppt .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aioppt .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const SLIDE_SETS = [
  {
    id: "ir",
    label: "IR 투자유치",
    slides: [
      { src: "/portfolio/ppt-design/ir-investment/cover-slide.png", cap: "표지 슬라이드" },
      { src: "/portfolio/ppt-design/ir-investment/sample-2.png",    cap: "시장 트랙션" },
      { src: "/portfolio/ppt-design/ir-investment/sample-3.png",    cap: "재무 계획" },
      { src: "/portfolio/ppt-design/ir-investment/sample-6.png",    cap: "로드맵" },
    ],
  },
  {
    id: "gov",
    label: "정부지원사업",
    slides: [
      { src: "/portfolio/ppt-design/government-grant/cover-slide.png", cap: "표지 슬라이드" },
      { src: "/portfolio/ppt-design/government-grant/sample-2.png",    cap: "추진 계획" },
      { src: "/portfolio/ppt-design/government-grant/sample-3.png",    cap: "기대 효과" },
      { src: "/portfolio/ppt-design/government-grant/sample-4.png",    cap: "예산 계획" },
    ],
  },
  {
    id: "brand",
    label: "회사소개서",
    slides: [
      { src: "/portfolio/ppt-design/brand-proposal/cover-slide.png", cap: "표지 슬라이드" },
      { src: "/portfolio/ppt-design/brand-proposal/sample-4.png",    cap: "서비스 구조" },
      { src: "/portfolio/ppt-design/brand-proposal/sample-5.png",    cap: "제안" },
      { src: "/portfolio/ppt-design/vibestack-company-profile/cover-slide.png", cap: "기업 소개" },
    ],
  },
  {
    id: "b2b",
    label: "B2B 제안",
    slides: [
      { src: "/portfolio/ppt-design/beanbrew-b2b-proposal/cover-slide.png", cap: "표지 슬라이드" },
    ],
  },
];

export function PptDesignLanding({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeSetId, setActiveSetId] = useState("ir");
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const activeSet = SLIDE_SETS.find((s) => s.id === activeSetId) ?? SLIDE_SETS[0];
  const activeSlide = activeSet.slides[activeSlideIdx] ?? activeSet.slides[0];

  const handleSetChange = (id: string) => {
    setActiveSetId(id);
    setActiveSlideIdx(0);
  };

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
    <div className="aioppt" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" sub="ppt-design" active="service" />

      <header className="hero2">
        {/* 배경 이미지 — 섹션 전체 덮음 */}
        <img className="hero2-bg" src="/images/services/ppt-design-team.jpg" alt="" />
        <div className="hero2-ov" />
        {/* 왼쪽: 텍스트 */}
        <div className="hero2-l">
          <div className="hero2-txt">
            <span className="hero2-hkick">AIO · PPT Design · N° 05</span>
            <h1 className="hero2-h1">읽지 않고도<br />전달되는 <em>슬라이드</em></h1>
            <p className="hero2-lead">제안·IR·사업계획·발표 — 결정권자가 한 장에서 핵심을 보게<br />글이 많은 슬라이드 대신 메시지가 남는 한 장으로</p>
            <div className="hero2-bdgs">
              {["5일 이내 납품", "원본 PPTX 무료", "수정 무제한"].map((b) => (
                <span key={b} className="hero2-bdg">{b}</span>
              ))}
            </div>
            <a className="hero2-btn" href={`${base}/quote`}>PPT 디자인 제작 문의 →</a>
          </div>
        </div>
        {/* 오른쪽: KPI 카드 */}
        <div className="hero2-r">
          {([
            { kpi: "180+",  label: "누적 제작",      sub: "PPT·IR·제안서 누적",    color: "#7AAEEC", ml: 0,  delay: "0s",   idx: 0 },
            { kpi: "14건",  label: "IR 투자유치",    sub: "시드·프리A 지원",        color: "#C8A24A", ml: 44, delay: "0.6s", idx: 1 },
            { kpi: "8건",   label: "정부지원 선정",  sub: "창업패키지·R&D 등",      color: "#7AAEEC", ml: 20, delay: "1.2s", idx: 2 },
            { kpi: "2.8일", label: "평균 납품",      sub: "의뢰 후 첫 시안까지",   color: "#C8A24A", ml: 60, delay: "1.8s", idx: 3 },
            { kpi: "86%",   label: "재의뢰율",       sub: "180건 중 155건 재의뢰",  color: "#7AAEEC", ml: 10, delay: "0.3s", idx: 4 },
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
        <div className="shead reveal"><span className="kick">Preview · Real Work</span><h2>이런 <em>슬라이드</em>를 만듭니다</h2><p>IR · 지원사업 · 회사소개 · 제안 — 분야별 실제 작업물</p></div>

        {/* 카테고리 탭 */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          {SLIDE_SETS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSetChange(s.id)}
              style={{
                padding: "8px 18px", borderRadius: 999, border: "1px solid",
                borderColor: activeSetId === s.id ? "var(--gold)" : "rgba(239,233,221,0.15)",
                background: activeSetId === s.id ? "var(--gold)" : "transparent",
                color: activeSetId === s.id ? "#0E0D0B" : "rgba(239,233,221,0.5)",
                fontFamily: "var(--font-ibm-plex-mono,monospace)", fontSize: 12,
                fontWeight: activeSetId === s.id ? 700 : 400, cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* 대형 슬라이드 뷰어 */}
        <div className="sv-frame reveal">
          <img src={activeSlide.src} alt={activeSlide.cap} />
        </div>

        {/* 썸네일 필름스트립 */}
        <div className="sv-film">
          {activeSet.slides.map((sl, idx) => (
            <button
              key={sl.src}
              type="button"
              onClick={() => setActiveSlideIdx(idx)}
              className={`sv-thumb${activeSlideIdx === idx ? " active" : ""}`}
              style={{ background: "none", border: "none", padding: 0 }}
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

        <a className="gmore reveal" href={`/${locale}/services/ppt-design/portfolio`}>
          포트폴리오 전체 보기 →
        </a>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 한정 (~26년 6월)</span><h2>가격은 <em>장수별</em></h2><p>직접 문의 기준 · 6월 한정가</p></div>
        <div className="price">
          <div className="prow reveal d1"><div className="pname">디자인 정리형 · 10P 이하</div><div className="pnum">49,000<span className="unit">원~</span></div><div className="pdesc">기존 자료 정리 / 표지·목차·본문·CTA</div></div>
          <div className="prow reveal d2"><div className="pname">제안서·회사소개서 · 20P 이하</div><div className="pnum">99,000<span className="unit">원~</span></div><div className="pdesc">기획·스토리텔링 / 그래프·비교·후기</div></div>
          <div className="prow reveal d1"><div className="pname">기획형·IR·사업계획서 · 30P 이하</div><div className="pnum">199,000<span className="unit">원~</span></div><div className="pdesc">KPI·로드맵·재무·투자 유치용 풀 구성</div></div>
        </div>
        <div className="addon reveal d2">
          <b>추가 옵션</b>
          <ul className="addon-list">
            <li><span>슬라이드 추가</span><span className="addon-price">+5,000원~/장</span></li>
            <li><span>도표 / 인포그래픽 고도화</span><span className="addon-price">+30,000원~</span></li>
            <li><span>빠른 납품 / 급행</span><span className="addon-price">+50,000원~</span></li>
          </ul>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">한 장 한 메시지</div><div className="vd">슬라이드 1장 = 메시지 1개</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">원본 PPTX</div><div className="vd">PowerPoint 원본 제공</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 5일 이내 — 다음 날 착수</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">2차 수정 무료</div><div className="vd">시안·중간·최종 무제한</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>발표할<br /><em>한 장</em>이 있나요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
