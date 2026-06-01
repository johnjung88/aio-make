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
.aioppt .hero{position:relative;min-height:88vh;display:flex;align-items:center;padding:clamp(108px,14vw,176px) 0 clamp(52px,7vw,82px);overflow:hidden}
.aioppt .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 68% at 22% 32%,rgba(122,174,236,.12),transparent 66%);pointer-events:none}
.aioppt .hero .wrap{position:relative;width:100%;text-align:left}
.aioppt .hero .ghost{position:absolute;right:1vw;top:50%;transform:translateY(-50%);z-index:0;font-family:var(--frau);font-weight:600;font-size:clamp(260px,40vw,560px);line-height:.74;color:transparent;-webkit-text-stroke:5px rgba(122,174,236,.34);pointer-events:none;user-select:none}
.aioppt .hero .inner{position:relative;z-index:1;max-width:min(100%,940px)}
.aioppt .hero .kick{display:inline-flex;align-items:center;gap:14px;margin-bottom:clamp(24px,3vw,34px)}
.aioppt .hero .kick::before{content:"";width:clamp(28px,4vw,56px);height:1px;background:var(--blue)}
.aioppt .hero h1{font-family:var(--frau);font-weight:400;font-size:clamp(50px,11vw,150px);line-height:.92;letter-spacing:-.025em;margin-bottom:clamp(34px,4.4vw,52px)}
.aioppt .hero h1 .l{display:block;overflow:hidden;padding-bottom:.05em}
.aioppt .hero h1 .l>span{display:block;transform:translateY(112%);animation:kin-aioppt 1.15s cubic-bezier(.16,1,.3,1) forwards}
.aioppt .hero h1 .l2>span{animation-delay:.18s}
.aioppt .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aioppt .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 0 clamp(32px,4vw,44px)}
.aioppt .hero .acts{justify-content:flex-start}
@keyframes kin-aioppt{to{transform:none}}
@media(prefers-reduced-motion:reduce){.aioppt .hero h1 .l>span{animation:none;transform:none}}
@media(max-width:600px){.aioppt .hero{min-height:auto;align-items:flex-start;padding:clamp(42px,11vw,70px) 0 clamp(44px,9vw,60px)}.aioppt .hero .inner{max-width:100%}.aioppt .hero h1{font-size:clamp(46px,14.5vw,82px)}.aioppt .hero .ghost{font-size:clamp(200px,66vw,320px);right:0;top:auto;bottom:-1vh;transform:none;-webkit-text-stroke-width:3px;opacity:.5}}
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

      <header className="hero"><div className="wrap">
        <span className="ghost" aria-hidden="true">P</span>
        <div className="inner">
        <span className="kick">AIO · PPT Design — N° 05</span>
        <h1><span className="l l1"><span>읽지 않고도</span></span><span className="l l2"><span>전달되는 <em>슬라이드</em></span></span></h1>
        <p className="lead">제안·IR·사업계획·발표 — 결정권자가 한 장에서 핵심을 보게 · 글이 많은 슬라이드 대신 메시지가 남는 한 장으로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/ppt-design/portfolio`}>포트폴리오 보기</a></div>
        </div>
      </div></header>

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
