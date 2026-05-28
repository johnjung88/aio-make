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
.aioppt .hero{position:relative;padding:clamp(74px,12vw,156px) 0 clamp(50px,7vw,80px);overflow:hidden}
.aioppt .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 58% at 50% 16%,rgba(122,174,236,.10),transparent 70%)}
.aioppt .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.0;letter-spacing:-.01em;margin-bottom:30px}
.aioppt .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aioppt .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 auto clamp(34px,5vw,44px)}
.aioppt .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aioppt .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aioppt .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aioppt .sec{padding:var(--sp-sec) 0}
.aioppt .shead{margin-bottom:48px}
.aioppt .shead .kick{display:block;margin-bottom:18px}
.aioppt .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px}
.aioppt .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aioppt .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Slide mockup */
.aioppt .slides{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;max-width:880px;margin:0 auto}
.aioppt .sl{aspect-ratio:16/9;border:1px solid var(--line2);border-radius:10px;padding:20px 22px;background:var(--bg2);position:relative;text-align:left;overflow:hidden}
.aioppt .sl::after{content:attr(data-no);position:absolute;right:14px;bottom:10px;font-family:var(--mono);font-size:10px;color:var(--fg3);letter-spacing:.14em}
.aioppt .sl .st{font-family:var(--frau);font-size:18px;color:var(--fg);font-weight:500;margin-bottom:14px}
.aioppt .sl .st em{color:var(--gold);font-style:normal}
.aioppt .sl .bul{font-family:var(--mono);font-size:9.5px;color:var(--fg2);letter-spacing:.12em;line-height:1.95}
.aioppt .sl .bar{height:6px;background:linear-gradient(90deg,var(--gold),var(--blue));border-radius:3px;margin-top:14px;max-width:64%}
.aioppt .sl.kpi{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.aioppt .sl.kpi .big{font-family:var(--frau);font-size:46px;color:var(--gold);line-height:1;margin-bottom:6px}
.aioppt .sl.chart .ch{display:flex;align-items:flex-end;gap:6px;height:60%;margin-top:8px}
.aioppt .sl.chart .b{flex:1;background:linear-gradient(180deg,var(--gold),rgba(200,162,74,.3));border-radius:2px 2px 0 0}
@media(max-width:680px){.aioppt .slides{grid-template-columns:1fr}}

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
      <AioNav locale={locale} level="leaf" cat="design" active="service" />

      <header className="hero"><div className="wrap">
        <span className="kick">AIO · PPT Design</span>
        <h1>전달되는<br /><em>슬라이드</em>를</h1>
        <p className="lead">제안·IR·사업계획·발표 — 결정권자가 한 장에서 핵심을 보게. 글이 많은 슬라이드 대신 메시지가 남는 슬라이드로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/ppt-design/portfolio`}>포트폴리오 보기</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Preview</span><h2>이런 <em>슬라이드</em>를 만듭니다</h2><p>제목·근거·KPI·차트 — 한 장씩 명확하게</p></div>
        <div className="slides reveal d1">
          <div className="sl" data-no="01"><div className="st">우리는 <em>읽지 않습니다</em>, 봅니다</div><div className="bul">— 결정권자는 평균 12초 / 한 슬라이드에 한 메시지<br />— 글이 많을수록 기억은 사라집니다</div><div className="bar" /></div>
          <div className="sl kpi" data-no="02"><div className="bul" style={{ marginBottom: 8 }}>YoY 매출 증가</div><div className="big">+128%</div><div className="bul">2024 → 2025 누적 기준</div></div>
          <div className="sl chart" data-no="03"><div className="st">3년 <em>실적 추이</em></div><div className="ch"><div className="b" style={{ height: "40%" }} /><div className="b" style={{ height: "55%" }} /><div className="b" style={{ height: "72%" }} /><div className="b" style={{ height: "88%" }} /><div className="b" style={{ height: "100%" }} /></div></div>
          <div className="sl" data-no="04"><div className="st">다음 <em>마일스톤</em></div><div className="bul">Q1 — 베타 출시<br />Q2 — Seed 라운드<br />Q3 — Series A<br />Q4 — 해외 진출</div><div className="bar" /></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 한정 (~26년 6월)</span><h2>가격은 <em>장수별</em></h2><p>표시 가격은 26년 6월까지 한정. 정상가는 표시가의 3배</p></div>
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
          <div className="v"><div className="vn">03</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 2~5일, 다음 날 착수</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">2차 수정 무료</div><div className="vd">시안·중간·최종 무제한</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>발표할 게<br /><em>있나요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
