"use client";

import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiows{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;
  --line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);--fs-body:clamp(14px,1.1vw,15.5px);
  --fs-kick:clamp(10px,1vw,11px);--fs-num:clamp(30px,4vw,46px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiows *{box-sizing:border-box}
.aiows a{text-decoration:none;color:inherit}
.aiows .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiows .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
@keyframes aiows-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes aiows-marq{to{transform:translateX(-50%)}}
.aiows .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}
.aiows .reveal.in{opacity:1;transform:none}
.aiows .reveal.d1{transition-delay:.1s}.aiows .reveal.d2{transition-delay:.2s}.aiows .reveal.d3{transition-delay:.3s}
.aiows .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--gold),var(--gold2))}
.aiows .nav{position:sticky;top:0;z-index:50;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background:rgba(14,13,11,.82);border-bottom:1px solid var(--line2)}
.aiows .nav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;align-items:center;height:62px;text-align:left}
.aiows .nav .b{font-family:var(--frau);font-weight:600;font-size:20px}.aiows .nav .b em{font-style:normal;color:var(--gold)}
.aiows .nav .crumb{font-family:var(--mono);font-size:11px;color:var(--fg3);margin-left:16px;letter-spacing:.1em;text-transform:uppercase}
.aiows .nav .ncta{margin-left:auto;font-size:13px;font-weight:600;padding:9px 20px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiows .subnav{position:sticky;top:62px;z-index:49;background:rgba(14,13,11,.9);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid var(--line2)}
.aiows .subnav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;gap:4px;height:50px;align-items:center;justify-content:center;overflow-x:auto;scrollbar-width:none}
.aiows .subnav .nw::-webkit-scrollbar{display:none}
.aiows .subnav a{font-family:var(--mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);padding:8px 16px;white-space:nowrap;border-bottom:2px solid transparent;transition:color .2s,border-color .2s}
.aiows .subnav a:hover{color:var(--fg)}.aiows .subnav a.on{color:var(--gold);border-bottom-color:var(--gold)}
.aiows .hero{position:relative;min-height:90vh;display:flex;align-items:center;padding:clamp(116px,15vw,190px) 0 clamp(56px,7vw,84px);overflow:hidden}
.aiows .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 20% 32%,rgba(200,162,74,.14),transparent 66%);pointer-events:none}
.aiows .hero .wrap{position:relative;width:100%;text-align:left}
.aiows .hero .ghost{position:absolute;right:-3vw;top:50%;transform:translateY(-50%);z-index:0;font-family:var(--frau);font-weight:600;font-size:clamp(300px,46vw,680px);line-height:.72;color:transparent;-webkit-text-stroke:5px rgba(200,162,74,.42);pointer-events:none;user-select:none;animation:aiows-rise 1.5s .2s both}
.aiows .hero .inner{position:relative;z-index:1;max-width:min(100%,980px)}
.aiows .hero .kick{display:inline-flex;align-items:center;gap:14px;margin-bottom:clamp(26px,3vw,38px);animation:aiows-rise .8s both}
.aiows .hero .kick::before{content:"";width:clamp(28px,4vw,56px);height:1px;background:var(--gold)}
.aiows .hero h1{font-family:var(--frau);font-weight:400;font-size:clamp(50px,11vw,150px);line-height:.92;letter-spacing:-.025em;margin-bottom:clamp(36px,4.6vw,56px)}
.aiows .hero h1 .l{display:block;overflow:hidden;padding-bottom:.05em}
.aiows .hero h1 .l>span{display:block;transform:translateY(112%);animation:kin 1.15s cubic-bezier(.16,1,.3,1) forwards}
.aiows .hero h1 .l1>span{animation-delay:.18s}.aiows .hero h1 .l2>span{animation-delay:.34s}
.aiows .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiows .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 0 clamp(32px,4vw,44px);animation:aiows-rise 1s .5s both}
.aiows .hero .t3{margin:0 0 clamp(30px,3.8vw,40px)!important;justify-content:flex-start!important}
.aiows .hero .acts{justify-content:flex-start}
@keyframes kin{to{transform:none}}
@media(prefers-reduced-motion:reduce){.aiows .hero h1 .l>span{animation:none;transform:none}.aiows .hero .ghost{animation:none}}
.aiows .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center;animation:aiows-rise 1s .44s both}
.aiows .cta-pill{font-size:15px;font-weight:600;padding:15px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;transition:transform .25s,background .25s;display:inline-flex;align-items:center;gap:8px}
.aiows .cta-pill:hover{transform:translateY(-2px);background:var(--gold2)}
.aiows .cta-link{font-family:var(--mono);font-size:13px;letter-spacing:.1em;color:var(--gold);border-bottom:1px solid var(--gold);padding-bottom:3px}
.aiows .marq{margin-top:clamp(48px,7vw,72px);border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);padding:16px 0;overflow:hidden;white-space:nowrap;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.aiows .marq .row{display:inline-flex;animation:aiows-marq 28s linear infinite}
.aiows .marq .row span{font-family:var(--frau);font-size:clamp(18px,2.2vw,26px);color:var(--fg2);display:inline-flex;align-items:center;gap:28px;padding-right:28px}
.aiows .marq .row span::after{content:"";width:5px;height:5px;border-radius:50%;background:var(--gold)}
.aiows .sec{padding:var(--sp-sec) 0}
.aiows .shead{margin-bottom:clamp(40px,5vw,58px);text-align:center}
.aiows .shead .kick{display:inline-block;margin-bottom:18px}
.aiows .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.1;letter-spacing:-.01em}
.aiows .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiows .shead p{color:var(--fg2);font-size:var(--fs-body);line-height:1.8;max-width:48ch;margin:14px auto 0}
.aiows .dsite{border-radius:8px;overflow:hidden;border:1px solid var(--line2);background:#14120C;display:flex;flex-direction:column;height:100%;text-align:left}
.aiows .dsite .sbar{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid var(--line2)}
.aiows .dsite .lg{width:14px;height:14px;border-radius:4px;background:var(--gold)}
.aiows .dsite .mi{height:5px;width:22px;border-radius:3px;background:rgba(239,233,221,.22)}
.aiows .dsite .sp{flex:1}.aiows .dsite .bt{height:13px;width:36px;border-radius:6px;background:var(--gold)}
.aiows .dsite .sbd{flex:1;padding:clamp(12px,2vw,18px);display:flex;flex-direction:column;gap:9px;background:radial-gradient(ellipse at 50% 0%,rgba(200,162,74,.07),transparent 70%)}
.aiows .dsite .ht{height:13px;width:62%;border-radius:4px;background:#EFE9DD}
.aiows .dsite .ht2{height:13px;width:42%;border-radius:4px;background:var(--gold)}
.aiows .dsite .pp{height:6px;width:80%;border-radius:3px;background:rgba(239,233,221,.28)}
.aiows .dsite .cta{height:18px;width:80px;border-radius:9px;background:var(--gold);margin-top:2px}
.aiows .dsite .drow{display:flex;gap:8px;margin-top:auto}.aiows .dsite .drow .cc{flex:1;height:clamp(26px,5vw,40px);border-radius:6px;background:#211E15;border:1px solid var(--line2)}
.aiows .dsite.land .sbd{align-items:center;text-align:center}.aiows .dsite.land .ht{width:70%}.aiows .dsite.land .ht2{width:48%}.aiows .dsite.land .pp{width:58%}.aiows .dsite.land .cta{width:120px;height:22px}
.aiows .types{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.aiows .tcard{border:1px solid var(--line2);border-radius:14px;overflow:hidden;background:var(--bg2);transition:border-color .35s,transform .35s}
.aiows .tcard:hover{border-color:var(--gold);transform:translateY(-6px)}
.aiows .tcard .mk{height:clamp(150px,20vw,200px);border-bottom:1px solid var(--line2);padding:16px}
.aiows .tcard .body{padding:clamp(22px,3vw,32px);text-align:center}
.aiows .tcard .no{font-family:var(--frau);font-style:normal;color:var(--gold);font-size:22px;margin-bottom:8px}
.aiows .tcard .tn{font-family:var(--frau);font-size:clamp(24px,3vw,32px);font-weight:500;margin-bottom:10px}
.aiows .tcard .td{color:var(--fg2);font-size:var(--fs-body);line-height:1.8;max-width:38ch;margin:0 auto 16px}
.aiows .tcard .tg{display:inline-flex;gap:8px;flex-wrap:wrap;justify-content:center}
.aiows .tcard .tg span{font-family:var(--mono);font-size:11px;color:var(--fg2);border:1px solid var(--line2);border-radius:999px;padding:5px 12px}
.aiows .pf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
.aiows .bw{border-radius:12px;overflow:hidden;border:1px solid var(--line2);background:var(--bg2);transition:transform .4s,border-color .4s}
.aiows .bw:hover{transform:translateY(-7px);border-color:var(--line)}
.aiows .bw .top{display:flex;align-items:center;gap:7px;padding:11px 14px;border-bottom:1px solid var(--line2)}
.aiows .bw .top i{width:10px;height:10px;border-radius:50%;background:var(--fg3);display:inline-block;opacity:.5}
.aiows .bw .url{margin-left:8px;flex:1;font-family:var(--mono);font-size:11px;color:var(--fg3);text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aiows .bw .shot{height:clamp(168px,23vw,210px)}
.aiows .bw .shot img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.aiows .bw .cap{padding:15px 16px;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}
.aiows .bw .cap .nm{font-size:14px;color:var(--fg)}.aiows .bw .cap .ct{font-family:var(--mono);font-size:11px;color:var(--gold)}
.aiows .more{margin-top:36px}
.aiows .promo{display:inline-block;margin-bottom:clamp(28px,4vw,38px);font-family:var(--mono);font-size:11.5px;letter-spacing:.06em;color:var(--gold);border:1px solid var(--line);border-radius:999px;padding:8px 18px}
.aiows .price{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.aiows .pc{border:1px solid var(--line2);border-radius:12px;padding:clamp(28px,3vw,38px) 22px;background:var(--bg2);transition:border-color .3s;text-align:center}
.aiows .pc:hover{border-color:var(--gold)}
.aiows .pc .pl{font-family:var(--mono);font-size:12px;letter-spacing:.08em;color:var(--fg2);margin-bottom:14px;text-transform:uppercase}
.aiows .pc .pv{font-family:var(--frau);font-weight:600;font-size:var(--fs-num);color:var(--fg);line-height:1;margin-bottom:8px}
.aiows .pc .pv em{font-style:normal;color:var(--gold)}.aiows .pc .pv .u{font-size:.42em;color:var(--fg2);font-family:var(--pret)}
.aiows .pc .po{font-family:var(--mono);font-size:12px;color:var(--fg3)}
.aiows .vals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.aiows .val{text-align:center;padding:8px}
.aiows .val .v{font-family:var(--frau);font-weight:600;font-size:clamp(26px,3vw,38px);color:var(--gold);margin-bottom:8px}
.aiows .val .l{color:var(--fg2);font-size:13px}
.aiows .steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0}
.aiows .step{padding:clamp(24px,3vw,32px) 16px;border-top:1px solid var(--line);text-align:center}
.aiows .step .s{font-family:var(--frau);font-style:normal;font-size:22px;color:var(--gold);margin-bottom:10px}
.aiows .step .t{font-family:var(--frau);font-size:19px;font-weight:500;margin-bottom:7px}
.aiows .step .d{color:var(--fg2);font-size:13px;line-height:1.7;max-width:22ch;margin:0 auto}
.aiows .reviews{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.aiows .rev{border:1px solid var(--line2);border-radius:12px;padding:28px;text-align:center;display:flex;flex-direction:column;gap:14px;background:var(--bg2)}
.aiows .rev .st{color:var(--gold);font-size:13px;letter-spacing:3px}
.aiows .rev .q{font-family:var(--frau);font-size:16px;line-height:1.75;color:var(--fg)}
.aiows .rev .who{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:auto}
.aiows .rev .av{width:42px;height:42px;border-radius:50%;border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:var(--frau);font-size:17px}
.aiows .rev .nm{font-size:13.5px;color:var(--fg)}.aiows .rev .mt{font-family:var(--mono);font-size:11px;color:var(--fg3)}
.aiows .team{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.aiows .mem{border:1px solid var(--line2);border-radius:12px;padding:28px 14px;text-align:center;background:var(--bg2);transition:border-color .3s}
.aiows .mem:hover{border-color:var(--gold)}
.aiows .mem .av{width:60px;height:60px;border-radius:50%;margin:0 auto 13px;border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:var(--frau);font-size:24px}
.aiows .mem .role{font-family:var(--mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:5px}
.aiows .mem .nm{font-family:var(--frau);font-size:17px;font-weight:500;margin-bottom:9px}
.aiows .mem .one{font-size:12px;color:var(--fg2);line-height:1.55;min-height:3em}
.aiows .teamlink{margin-top:30px}
.aiows .ctaS{position:relative;text-align:center;padding:clamp(90px,13vw,150px) 0;border-top:1px solid var(--line)}
.aiows .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 50% 50%,rgba(200,162,74,.11),transparent 70%);pointer-events:none}
.aiows .ctaS .wrap{position:relative}
.aiows .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiows .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiows .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
.aiows .foot{border-top:1px solid var(--line2);padding:40px 0;text-align:center;font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--fg3);line-height:2}
@media(max-width:820px){.aiows .types{grid-template-columns:1fr}.aiows .pf{grid-template-columns:1fr}.aiows .price{grid-template-columns:1fr}.aiows .vals{grid-template-columns:1fr 1fr}.aiows .steps{grid-template-columns:1fr 1fr}.aiows .reviews{grid-template-columns:1fr}.aiows .team{grid-template-columns:1fr 1fr}}
/* hero 3-second meter */
.aiows .t3{display:flex;justify-content:center;align-items:center;gap:12px;margin:0 auto clamp(30px,4vw,42px);font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);animation:aiows-rise 1s .5s both}
.aiows .t3 .bar{position:relative;width:118px;height:3px;border-radius:2px;background:var(--line2);overflow:hidden}
.aiows .t3 .bar i{position:absolute;inset:0;width:0;background:linear-gradient(90deg,var(--gold),var(--gold2));animation:t3fill 3s .6s cubic-bezier(.4,0,.2,1) forwards}
.aiows .t3 .num{color:var(--gold);font-variant-numeric:tabular-nums}
@keyframes t3fill{to{width:100%}}
@media(prefers-reduced-motion:reduce){.aiows .t3 .bar i{animation:none;width:100%}}
/* pricing featured tier */
.aiows .pc{position:relative}
.aiows .pc.feat{border-color:var(--gold);background:linear-gradient(180deg,rgba(200,162,74,.08),var(--bg2))}
.aiows .pc .badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#0E0D0B;background:var(--gold);border-radius:999px;padding:4px 12px;white-space:nowrap}
@media(max-width:600px){
.aiows .hero{min-height:auto;align-items:flex-start;padding:clamp(42px,11vw,70px) 0 clamp(44px,9vw,60px)}
.aiows .hero .inner{max-width:100%}
.aiows .hero .kick{margin-bottom:clamp(18px,5vw,26px)}
.aiows .hero h1{font-size:clamp(46px,14.5vw,82px);margin-bottom:clamp(26px,6vw,34px)}
.aiows .hero .lead{margin-bottom:clamp(24px,6vw,32px)}
.aiows .hero .ghost{font-size:clamp(220px,72vw,360px);right:-6vw;top:auto;bottom:-2vh;transform:none;-webkit-text-stroke-width:3px;opacity:.5}
}
`;

const Site = ({ land = false }: { land?: boolean }) => (
  <div className={"dsite" + (land ? " land" : "")}>
    <div className="sbar"><span className="lg" />{!land && <><span className="mi" /><span className="mi" /><span className="mi" /></>}<span className="sp" /><span className="bt" /></div>
    <div className="sbd"><span className="ht" /><span className="ht2" /><span className="pp" /><span className="cta" />{!land && <span className="drow"><span className="cc" /><span className="cc" /><span className="cc" /></span>}</div>
  </div>

);

// ─────────────────────────────────────────────────────────────
// 포트폴리오 목록 — 여기만 수정하면 됩니다.
//  img: /public 기준 이미지 경로. 비워두면 자동으로 기본 목업이 표시됩니다.
//  land: true = 랜딩형(가운데 정렬) 목업 (img 없을 때만 의미)
const WORK: { url: string; title: string; img?: string; land?: boolean }[] = [
  { url: "chueok-korea.com", title: "추억코리아 · 회사 홈페이지", img: "/portfolio/chueok-korea/live.png" },
  { url: "aio-make.com", title: "AIO · 브랜드 사이트", img: "/portfolio/aio-design-agency/live.png" },
  { url: "v-aio.app", title: "V-AIO · 서비스 랜딩", land: true },        // img 추가 전 — 기본 목업 표시
  { url: "promo.event.kr", title: "캠페인 · 마케팅 랜딩", land: true },  // img 추가 전 — 기본 목업 표시
];

export function WebsiteLanding({ locale }: { locale: string }) {
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
    <div className="aiows" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="website" active="service" />

      <header className="hero"><div className="wrap">
        <span className="ghost" aria-hidden="true">3</span>
        <div className="inner">
        <span className="kick">AIO · Website — N° 01</span>
        <h1><span className="l l1"><span>첫 3초가,</span></span><span className="l l2"><span><em>전부</em>입니다</span></span></h1>
        <p className="lead">방문자는 3초 안에 남을지 떠날지를 결정합니다 — 회사 홈페이지·전환형 랜딩까지, 시선을 끝까지 붙잡는 한 페이지를</p>
        <div className="t3"><span>첫인상이 결정되기까지</span><span className="bar"><i /></span><span className="num">3.0s</span></div>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href="#work">작업 보기</a></div>
        </div>
        <div className="marq"><div className="row"><span>회사 홈페이지</span><span>서비스 랜딩</span><span>마케팅 랜딩</span><span>이벤트 페이지</span><span>반응형</span><span>검색 최적화</span><span>회사 홈페이지</span><span>서비스 랜딩</span><span>마케팅 랜딩</span><span>이벤트 페이지</span><span>반응형</span><span>검색 최적화</span></div></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">What we build</span><h2>두 가지 <em>홈페이지</em></h2>
          <p>브랜드를 보여줄지, 전환을 이끌지 — 목적이 다르면 페이지 구조도 달라집니다</p></div>
        <div className="types">
          <div className="tcard reveal d1"><div className="mk"><Site /></div><div className="body"><div className="no">01</div><div className="tn">홈페이지</div><div className="td">회사와 브랜드의 공식 사이트. 소개부터 서비스, 문의까지 방문자가 신뢰를 쌓아가도록 구성합니다</div><div className="tg"><span>회사 소개</span><span>브랜드</span><span>문의</span></div></div></div>
          <div className="tcard reveal d2"><div className="mk"><Site land /></div><div className="body"><div className="no">02</div><div className="tn">랜딩페이지</div><div className="td">광고로 들어온 방문자를 놓치지 않는 한 장. 문의·구매·신청, 하나의 목표에 집중해 전환을 이끕니다</div><div className="tg"><span>서비스 랜딩</span><span>광고 유입</span><span>이벤트</span></div></div></div>
        </div>
      </section>

      <section className="sec wrap" id="work">
        <div className="shead reveal"><span className="kick">Portfolio</span><h2><em>포트폴리오</em></h2>
          <p>실제 작업물입니다. 카드를 누르면 상세 케이스로, 전체는 포트폴리오 페이지에서 볼 수 있습니다</p></div>
        <div className="pf">
          {WORK.map((w, i) => (
            <a key={w.url} className={`bw reveal ${i % 2 ? "d2" : "d1"}`} href={`${base}/services/website/portfolio`}>
              <div className="top"><i /><i /><i /><span className="url">{w.url}</span></div>
              <div className="shot">{w.img ? <img src={w.img} alt={w.title} loading="lazy" /> : <Site land={w.land} />}</div>
              <div className="cap"><span className="nm">{w.title}</span><span className="ct">↗ CASE</span></div>
            </a>
          ))}
        </div>
        <div className="more reveal"><a className="cta-link" href={`${base}/services/website/portfolio`}>포트폴리오 전체 보기 →</a></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing</span><h2>투명한 <em>가격</em></h2>
          <p>페이지 수에 따라 명확하게 책정합니다 — 지금은 한정가로 진행 중입니다</p>
          <div className="promo">2026년 6월까지 한정가 · 이후 정상가 3배</div></div>
        <div className="price">
          <div className="pc reveal d1"><div className="pl">랜딩페이지 · 1P</div><div className="pv"><em>4.9</em><span className="u"> 만원</span></div><div className="po">정상가 14.7만원</div></div>
          <div className="pc feat reveal d2"><span className="badge">가장 인기</span><div className="pl">5페이지 이내</div><div className="pv"><em>9.9</em><span className="u"> 만원</span></div><div className="po">정상가 29.7만원</div></div>
          <div className="pc reveal d3"><div className="pl">10페이지 이내</div><div className="pv"><em>14.9</em><span className="u"> 만원</span></div><div className="po">정상가 44.7만원</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="vals reveal">
          <div className="val"><div className="v">1–5일</div><div className="l">빠른 제작</div></div>
          <div className="val"><div className="v">100%</div><div className="l">모바일 반응형</div></div>
          <div className="val"><div className="v">SEO</div><div className="l">검색 노출 최적화</div></div>
          <div className="val"><div className="v">1개월</div><div className="l">무상 유지보수</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How it works</span><h2>의뢰부터 <em>운영</em>까지</h2></div>
        <div className="steps reveal d1">
          <div className="step"><div className="s">01</div><div className="t">의뢰</div><div className="d">목적과 레퍼런스를 한 문장으로 전달</div></div>
          <div className="step"><div className="s">02</div><div className="t">견적</div><div className="d">24시간 안에 가격과 일정 회신</div></div>
          <div className="step"><div className="s">03</div><div className="t">제작</div><div className="d">매일 진행 상황을 공유하며 제작</div></div>
          <div className="step"><div className="s">04</div><div className="t">운영</div><div className="d">배포 후 1개월 무상 유지보수</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Reviews</span><h2>고객 <em>후기</em></h2></div>
        <div className="reviews">
          <div className="rev reveal d1"><div className="st">★★★★★</div><div className="q">"문의 3일 만에 시안, 일주일 만에 오픈했어요. 모바일에서도 정말 깔끔하게 나와서 만족합니다"</div><div className="who"><div className="av">김</div><div className="nm">김** 대표</div><div className="mt">카페 창업 · 회사 홈페이지</div></div></div>
          <div className="rev reveal d2"><div className="st">★★★★★</div><div className="q">"광고용 랜딩을 맡겼는데 전환이 눈에 띄게 올랐습니다. 구조 설계가 확실히 다르네요"</div><div className="who"><div className="av">박</div><div className="nm">박** 매니저</div><div className="mt">교육 스타트업 · 마케팅 랜딩</div></div></div>
          <div className="rev reveal d3"><div className="st">★★★★★</div><div className="q">"진행 상황을 매일 공유해줘서 안심이 됐어요. 납품 후 수정 요청에도 빠르게 대응해줬습니다"</div><div className="who"><div className="av">이</div><div className="nm">이** 실장</div><div className="mt">제조 · 서비스 랜딩</div></div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team</span><h2>이 서비스를 만드는 <em>팀</em></h2>
          <p>웹사이트 하나에, 분야별 담당자가 처음부터 끝까지 함께합니다</p></div>
        <div className="team">
          <div className="mem reveal d1"><div className="av">리</div><div className="role">Planner</div><div className="nm">기획 · 리아</div><div className="one">목적과 흐름을 먼저 설계합니다</div></div>
          <div className="mem reveal d2"><div className="av">준</div><div className="role">Copywriter</div><div className="nm">카피 · 준</div><div className="one">읽게 만드는 한 줄을 씁니다</div></div>
          <div className="mem reveal d3"><div className="av">도</div><div className="role">Designer</div><div className="nm">디자인 · 도윤</div><div className="one">첫인상을 디자인합니다</div></div>
          <div className="mem reveal d1"><div className="av">세</div><div className="role">Developer</div><div className="nm">개발 · 세호</div><div className="one">운영 가능한 상태로 구현·배포합니다</div></div>
          <div className="mem reveal d2"><div className="av">현</div><div className="role">QA · Ops</div><div className="nm">검수·운영 · 현아</div><div className="one">끝까지 점검하고 유지보수합니다</div></div>
        </div>
        <div className="teamlink reveal"><a className="cta-link" href={`${base}/services/development/team`}>개발팀 전체 보기 →</a></div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>스크롤을 멈추는<br /><em>홈페이지</em>를 만들까요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 화면</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
