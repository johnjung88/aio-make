"use client";
import { useEffect, useRef } from "react";
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
.aioppt .hero2{display:grid;grid-template-columns:55% 45%;min-height:100vh}
.aioppt .hero2-l{position:relative;overflow:hidden;display:flex;align-items:center;padding:clamp(80px,10vw,120px) clamp(32px,5vw,72px) clamp(60px,8vw,100px)}
.aioppt .hero2-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;opacity:.55;z-index:0}
.aioppt .hero2-ov{position:absolute;inset:0;background:linear-gradient(105deg,rgba(14,13,11,.92) 0%,rgba(14,13,11,.78) 60%,rgba(14,13,11,.88) 100%);z-index:1;pointer-events:none}
.aioppt .hero2-txt{position:relative;z-index:2;text-align:left}
.aioppt .hero2-hkick{font-family:var(--mono);font-size:11px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);margin-bottom:24px;display:block}
.aioppt .hero2-h1{font-family:var(--frau);font-weight:400;font-size:clamp(36px,4.5vw,76px);letter-spacing:-.025em;line-height:1.0;color:#F4ECDC;margin-bottom:24px;max-width:560px}
.aioppt .hero2-h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aioppt .hero2-lead{font-size:clamp(14px,1.1vw,17px);color:rgba(239,233,221,.58);line-height:1.85;max-width:460px;margin-bottom:32px}
.aioppt .hero2-bdgs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:36px}
.aioppt .hero2-bdg{font-size:11px;font-weight:600;padding:6px 14px;border:1px solid var(--blue);color:var(--blue);border-radius:999px;letter-spacing:.04em}
.aioppt .hero2-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;background:var(--blue);color:#0E0D0B;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none}
.aioppt .hero2-r{display:flex;flex-direction:column;justify-content:center;padding:clamp(80px,10vw,120px) clamp(24px,4vw,56px) clamp(60px,8vw,100px) clamp(16px,3vw,32px);gap:14px;position:relative}
.aioppt .hero2-r::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 60% 40%,rgba(122,174,236,.06),transparent 70%);pointer-events:none}
.aioppt .kcard-inner{background:rgba(22,27,34,.88);border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:14px 18px;backdrop-filter:blur(12px);display:flex;align-items:center;gap:14px;min-width:220px;max-width:280px;box-shadow:0 8px 32px rgba(0,0,0,.45)}
.aioppt .knum-box{border-radius:8px;width:48px;height:48px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
@media(max-width:880px){.aioppt .hero2{grid-template-columns:1fr}.aioppt .hero2-r{display:none}.aioppt .hero2-l{min-height:80vh}}
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

.aioppt .price{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:48px}
.aioppt .prow{padding:30px 24px;border:1px solid var(--gold);border-radius:14px;text-align:center}
.aioppt .prow .pname{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.aioppt .prow .pnum{font-family:var(--frau);font-size:clamp(30px,4vw,44px);margin-bottom:6px}
.aioppt .prow .pnum .unit{font-size:.55em;color:var(--fg2);margin-left:4px}
.aioppt .prow .reg{font-family:var(--mono);font-size:10.5px;color:var(--fg3);text-decoration:line-through;letter-spacing:.06em;margin-bottom:6px}
.aioppt .prow .pdesc{font-size:13px;line-height:1.8;color:var(--fg2);margin-top:8px}
@media(max-width:680px){.aioppt .price{grid-template-columns:1fr}}

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

export function PptDesignLanding({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
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
        {/* 왼쪽: 팀 사진 + 텍스트 */}
        <div className="hero2-l">
          <img className="hero2-bg" src="/images/services/ppt-design-team.png" alt="" />
          <div className="hero2-ov" />
          <div className="hero2-txt">
            <span className="hero2-hkick">AIO · PPT Design · N° 05</span>
            <h1 className="hero2-h1">읽지 않고도<br />전달되는 <em>슬라이드</em></h1>
            <p className="hero2-lead">제안·IR·사업계획·발표 — 결정권자가 한 장에서 핵심을 보게<br />글이 많은 슬라이드 대신 메시지가 남는 한 장으로</p>
            <div className="hero2-bdgs">
              {["2~5일 납품", "원본 PPTX 무료", "수정 무제한"].map((b) => (
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
        <div className="pgrid">
          {[
            { src: "/portfolio/ppt-design/ir-investment/cover-slide.png",        cap: "IR · Seed Round" },
            { src: "/portfolio/ppt-design/government-grant/cover-slide.png",     cap: "정부지원사업" },
            { src: "/portfolio/ppt-design/brand-proposal/cover-slide.png",       cap: "회사소개서" },
            { src: "/portfolio/ppt-design/beanbrew-b2b-proposal/cover-slide.png",cap: "B2B 가맹 제안" },
            { src: "/portfolio/ppt-design/ir-investment/sample-2.png",           cap: "IR · 시장 트랙션" },
            { src: "/portfolio/ppt-design/government-grant/sample-1.png",        cap: "지원사업 · 사업 구성" },
          ].map(({ src, cap }, i) => (
            <div key={src} className={`pcard reveal d${(i % 3) + 1}`}>
              <div className="pshot"><img src={src} alt={cap} /></div>
              <div className="pcap">{cap}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 한정 (~26년 6월)</span><h2>가격은 <em>장수별</em></h2><p>표시 가격은 26년 6월까지 한정 · 정상가는 표시가의 3배</p></div>
        <div className="price">
          <div className="prow reveal d1"><div className="pname">표준 · 10페이지 이내</div><div className="pnum">4.9<span className="unit">만원</span></div><div className="reg">정상가 14.7만원</div><div className="pdesc">제안·발표용 / 표지·목차·본문·CTA</div></div>
          <div className="prow reveal d2"><div className="pname">풀 · 30페이지 이내</div><div className="pnum">9.9<span className="unit">만원</span></div><div className="reg">정상가 29.7만원</div><div className="pdesc">IR·사업계획서 / 그래프·KPI·로드맵·재무</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">한 장 한 메시지</div><div className="vd">슬라이드 1장 = 메시지 1개</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">원본 PPTX</div><div className="vd">PowerPoint 원본 제공</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 2~5일 — 다음 날 착수</div></div>
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
