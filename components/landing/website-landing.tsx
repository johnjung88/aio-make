"use client";

import { useEffect, useRef } from "react";

const CSS = `
.aiows{--bg:#F5F8FF;--surface:#fff;--fg:#0D1220;--fg2:#5A6478;--fg3:#9AA2B4;--line:#E7EBF5;--a1:#3B7DFF;--a2:#10C6C6;--a3:#FF7A59;
  --jak:var(--font-jakarta);--pret:var(--font-pretendard);--jet:var(--font-jetbrains);--frau:var(--font-fraunces);
  --fs-display:clamp(38px,8vw,86px);--fs-h2:clamp(27px,4.4vw,48px);--fs-lead:clamp(15px,1.5vw,19px);--fs-body:clamp(14px,1.1vw,15.5px);--fs-kicker:clamp(11px,1vw,12px);--fs-big:clamp(26px,3vw,34px);
  --sp-sec:clamp(68px,9vw,124px);--sp-edge:clamp(20px,4vw,40px);--maxw:1140px;--shadow:0 14px 44px rgba(20,40,90,.09);--shadow-sm:0 6px 20px rgba(20,40,90,.06);
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiows *{box-sizing:border-box}
.aiows a{text-decoration:none;color:inherit}
.aiows .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiows .grad{background:linear-gradient(100deg,var(--a1),var(--a2),var(--a1));background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:aiows-gflow 6s ease-in-out infinite}
@keyframes aiows-gflow{50%{background-position:100% 0}}
@keyframes aiows-rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes aiows-marq{to{transform:translateX(-50%)}}
@keyframes aiows-cue{0%,100%{opacity:.4;transform:translateY(0)}50%{opacity:1;transform:translateY(6px)}}
@keyframes aiows-flip{0%,28%{opacity:0;transform:translateY(14px)}36%,90%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-14px)}}
@keyframes aiows-bob{50%{transform:translateY(10px)}}
@keyframes aiows-bob2{50%{transform:translateY(-12px)}}
.aiows .reveal{opacity:0;transform:translateY(34px);transition:opacity 1s cubic-bezier(.22,1,.36,1),transform 1s cubic-bezier(.22,1,.36,1)}
.aiows .reveal.in{opacity:1;transform:none}
.aiows .reveal.d1{transition-delay:.08s}.aiows .reveal.d2{transition-delay:.16s}.aiows .reveal.d3{transition-delay:.24s}
.aiows .prog{position:fixed;top:0;left:0;height:3px;width:0;z-index:99;background:linear-gradient(100deg,var(--a1),var(--a2))}
.aiows .nav{position:sticky;top:0;z-index:50;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);background:rgba(245,248,255,.78);border-bottom:1px solid var(--line)}
.aiows .nav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;align-items:center;height:60px;text-align:left}
.aiows .nav .b{font-family:var(--jak);font-weight:800;font-size:17px}
.aiows .nav .crumb{font-family:var(--jet);font-size:11px;color:var(--fg3);margin-left:14px;letter-spacing:.08em}
.aiows .nav .ncta{margin-left:auto;font-size:13px;font-weight:600;padding:9px 18px;border-radius:999px;background:linear-gradient(100deg,var(--a1),var(--a2));color:#fff;box-shadow:var(--shadow-sm)}
.aiows .hero{position:relative;overflow:hidden;padding:clamp(80px,12vw,140px) 0 clamp(56px,7vw,84px);isolation:isolate}
.aiows .aurora{position:absolute;inset:0;width:100%;height:100%;z-index:0;display:block}
.aiows .hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:34%;z-index:0;background:linear-gradient(180deg,transparent,var(--bg))}
.aiows .hero .wrap{position:relative;z-index:1}
.aiows .eyebrow{font-family:var(--jet);font-size:var(--fs-kicker);letter-spacing:.22em;text-transform:uppercase;color:var(--fg2);display:inline-flex;gap:10px;align-items:center;margin-bottom:clamp(20px,3vw,30px);animation:aiows-rise .7s both}
.aiows .eyebrow .tag{background:rgba(59,125,255,.12);color:#2C63D6;padding:4px 11px;border-radius:999px;letter-spacing:.12em}
.aiows .rot{display:inline-block;height:1.3em;overflow:hidden;vertical-align:bottom;text-align:left;min-width:8.5em}
.aiows .rot b{display:block;font-weight:500;color:#2C63D6;animation:aiows-flip 7.5s infinite both}
.aiows .rot b:nth-child(2){animation-delay:2.5s}.aiows .rot b:nth-child(3){animation-delay:5s}
.aiows h1{font-family:var(--jak);font-weight:800;font-size:var(--fs-display);line-height:.98;letter-spacing:-.03em;margin-bottom:clamp(20px,3vw,28px)}
.aiows h1 .l1{display:block;animation:aiows-rise .9s .05s both}.aiows h1 .l2{display:block;animation:aiows-rise .9s .16s both}
.aiows h1 .l2 em{font-family:var(--frau);font-style:italic;font-weight:600}
.aiows .lead{font-size:var(--fs-lead);line-height:1.75;color:var(--fg2);max-width:46ch;margin:0 auto clamp(28px,4vw,38px);animation:aiows-rise .9s .26s both}
.aiows .lead b{color:var(--fg);font-weight:600}
.aiows .btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;animation:aiows-rise .9s .36s both}
.aiows .btn{font-size:15px;font-weight:600;padding:15px 30px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;transition:transform .25s,box-shadow .25s;cursor:pointer}
.aiows .btn:hover{transform:translateY(-3px)}
.aiows .btn.p{background:linear-gradient(100deg,var(--a1),var(--a2));color:#fff;box-shadow:0 12px 30px rgba(59,125,255,.3)}
.aiows .btn.g{background:var(--surface);border:1px solid var(--line);color:var(--fg);box-shadow:var(--shadow-sm)}
.aiows .cue{margin-top:clamp(40px,6vw,58px);font-family:var(--jet);font-size:11px;color:var(--fg3);letter-spacing:.2em;animation:aiows-cue 2s infinite}
.aiows .marq{margin-top:clamp(40px,6vw,60px);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:18px 0;overflow:hidden;white-space:nowrap;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.aiows .marq .row{display:inline-flex;animation:aiows-marq 24s linear infinite;will-change:transform}
.aiows .marq .row span{font-family:var(--frau);font-style:italic;font-size:clamp(20px,2.4vw,28px);color:var(--fg3);display:inline-flex;align-items:center;gap:30px;padding-right:30px}
.aiows .marq .row span::after{content:"";width:6px;height:6px;border-radius:50%;background:var(--a2)}
.aiows .sec{padding:var(--sp-sec) 0}
.aiows .kicker{font-family:var(--jet);font-size:var(--fs-kicker);letter-spacing:.22em;text-transform:uppercase;color:var(--a2);margin-bottom:16px}
.aiows .h2{font-family:var(--jak);font-weight:800;font-size:var(--fs-h2);line-height:1.08;letter-spacing:-.02em;margin-bottom:16px}
.aiows .psub{color:var(--fg2);font-size:var(--fs-body);line-height:1.75;max-width:48ch;margin:0 auto clamp(38px,5vw,48px)}
.aiows .types{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.aiows .type{background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:var(--shadow-sm);transition:transform .4s,box-shadow .4s}
.aiows .type:hover{transform:translateY(-8px);box-shadow:var(--shadow)}
.aiows .mini{height:clamp(120px,16vw,150px);position:relative;overflow:hidden;border-bottom:1px solid var(--line)}
.aiows .mini i{position:absolute;display:block;border-radius:5px;background:rgba(13,18,32,.10)}
.aiows .mini.m1{background:linear-gradient(135deg,#E8EFFF,#F5F8FF)}.aiows .mini.m2{background:linear-gradient(135deg,#E1F7F7,#F5F8FF)}.aiows .mini.m3{background:linear-gradient(135deg,#FFEDE7,#F5F8FF)}
.aiows .mini .ba{top:26px;left:24px;width:48%;height:9px}.aiows .mini .bb{top:46px;left:24px;width:30%;height:7px}
.aiows .mini .bc{top:84px;left:24px;width:62%;height:34px;border-radius:8px;background:linear-gradient(100deg,var(--a1),var(--a2))}
.aiows .mini.m3 .bc{background:linear-gradient(100deg,var(--a3),#FFB155)}
.aiows .type .body{padding:clamp(18px,2.4vw,24px)}
.aiows .type .n{font-family:var(--jak);font-weight:700;font-size:var(--fs-big);margin-bottom:8px}
.aiows .type .d{color:var(--fg2);font-size:var(--fs-body);line-height:1.7;max-width:30ch;margin:0 auto}
.aiows .pf{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
.aiows .bw{border-radius:16px;overflow:hidden;border:1px solid var(--line);background:var(--surface);box-shadow:var(--shadow-sm);transition:transform .4s,box-shadow .4s;text-align:left}
.aiows .bw:hover{transform:translateY(-8px);box-shadow:var(--shadow)}
.aiows .bw .top{display:flex;align-items:center;gap:7px;padding:11px 14px;background:#F0F3FA;border-bottom:1px solid var(--line)}
.aiows .bw .top i{width:11px;height:11px;border-radius:50%;display:inline-block}
.aiows .bw .url{margin-left:10px;flex:1;background:#fff;border:1px solid var(--line);border-radius:6px;font-family:var(--jet);font-size:11px;color:var(--fg3);padding:5px 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aiows .bw .shot{aspect-ratio:16/10;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:30px;gap:12px;color:#fff}
.aiows .bw .shot .ttl{font-family:var(--jak);font-weight:800;font-size:clamp(22px,3vw,28px);line-height:1.1}
.aiows .bw .shot .ln{height:9px;border-radius:5px;background:rgba(255,255,255,.4)}
.aiows .bw .cap{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:10px}
.aiows .bw .cap .nm{font-weight:600;font-size:14px}.aiows .bw .cap .tg{font-family:var(--jet);font-size:11px;color:var(--a1);white-space:nowrap}
.aiows .g-blue .shot{background:linear-gradient(135deg,#3B7DFF,#10C6C6)}.aiows .g-ink .shot{background:linear-gradient(135deg,#0D1220,#2C3550)}.aiows .g-coral .shot{background:linear-gradient(135deg,#FF7A59,#FFB155)}.aiows .g-soft .shot{background:#EEF1F8;color:#9AA2B4}
.aiows .float{animation:aiows-bob 6s ease-in-out infinite}.aiows .float2{animation:aiows-bob2 7s ease-in-out infinite}
.aiows .pf-more{margin-top:34px}
.aiows .promo{display:inline-block;margin-bottom:clamp(26px,4vw,34px);font-family:var(--jet);font-size:12px;color:#2C63D6;background:rgba(59,125,255,.1);border:1px solid rgba(59,125,255,.22);border-radius:999px;padding:7px 16px;letter-spacing:.02em}
.aiows .price{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.aiows .pc{background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow-sm);padding:clamp(24px,3vw,32px) 20px}
.aiows .pc .pl{font-family:var(--jet);font-size:12px;color:var(--a2);letter-spacing:.1em;margin-bottom:12px}
.aiows .pc .pv{font-family:var(--jak);font-weight:800;font-size:var(--fs-big);margin-bottom:6px}
.aiows .pc .po{font-size:12.5px;color:var(--fg3)}
.aiows .pc .po s{color:var(--fg3)}
.aiows .vals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.aiows .val{background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow-sm);padding:clamp(22px,3vw,30px) 16px}
.aiows .val .v{font-family:var(--jak);font-weight:800;font-size:var(--fs-big);margin-bottom:6px}
.aiows .val .l{color:var(--fg2);font-size:13px}
.aiows .steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.aiows .step{background:var(--surface);border:1px solid var(--line);border-top:2px solid var(--a1);border-radius:0 0 14px 14px;padding:18px 16px;text-align:left;box-shadow:var(--shadow-sm)}
.aiows .step .s{font-family:var(--jet);font-size:12px;color:var(--a2);margin-bottom:8px}
.aiows .step .t{font-family:var(--jak);font-weight:700;font-size:17px;margin-bottom:6px}
.aiows .step .d{color:var(--fg2);font-size:13px;line-height:1.65}
.aiows .reviews{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.aiows .rev{background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow-sm);padding:24px;text-align:left;display:flex;flex-direction:column;gap:12px}
.aiows .rev .stars{color:#FFB155;font-size:14px;letter-spacing:2px}
.aiows .rev .q{font-size:15px;line-height:1.7;color:var(--fg)}
.aiows .rev .who{display:flex;align-items:center;gap:10px;margin-top:auto}
.aiows .rev .av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--jak);font-weight:700;font-size:15px;flex:none}
.aiows .rev .nm{font-weight:600;font-size:13.5px}.aiows .rev .meta{font-size:12px;color:var(--fg3)}
.aiows .team{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.aiows .mem{background:var(--surface);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow-sm);padding:24px 14px;transition:transform .35s,box-shadow .35s}
.aiows .mem:hover{transform:translateY(-7px);box-shadow:var(--shadow)}
.aiows .mem .av{width:62px;height:62px;border-radius:50%;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--jak);font-weight:800;font-size:23px}
.aiows .mem .role{font-family:var(--jet);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:4px}
.aiows .mem .nm{font-family:var(--jak);font-weight:700;font-size:16px;margin-bottom:8px}
.aiows .mem .one{font-size:12px;color:var(--fg2);line-height:1.55;margin-bottom:12px;min-height:3em}
.aiows .mem .tags{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}
.aiows .mem .tags span{font-size:10px;color:var(--fg2);background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:3px 8px}
.aiows .av-blue{background:linear-gradient(135deg,#3B7DFF,#6FA8FF)}.aiows .av-teal{background:linear-gradient(135deg,#10C6C6,#5BE0D0)}.aiows .av-coral{background:linear-gradient(135deg,#FF7A59,#FFB155)}.aiows .av-violet{background:linear-gradient(135deg,#8B7DFF,#B0A8FF)}.aiows .av-gray{background:linear-gradient(135deg,#5A6478,#9AA2B4)}
.aiows .teamlink{margin-top:30px}
.aiows .cta-sec{padding:clamp(90px,12vw,128px) 0;position:relative;overflow:hidden;margin-top:var(--sp-sec);border-top:1px solid var(--line);isolation:isolate}
.aiows .cta-sec .aurora{opacity:.85}
.aiows .cta-sec .wrap{position:relative;z-index:1}
.aiows .cta-sec h2{font-family:var(--jak);font-weight:800;font-size:var(--fs-display);line-height:1.02;letter-spacing:-.03em;margin-bottom:22px}
.aiows .cta-sec p{color:var(--fg2);margin-bottom:32px;font-size:var(--fs-lead)}
.aiows .foot{border-top:1px solid var(--line);padding:38px 0;color:var(--fg3);font-family:var(--jet);font-size:11.5px;line-height:1.9;letter-spacing:.02em}
@media(max-width:820px){.aiows .types{grid-template-columns:1fr}.aiows .pf{grid-template-columns:1fr}.aiows .price{grid-template-columns:1fr}.aiows .vals{grid-template-columns:1fr 1fr}.aiows .steps{grid-template-columns:1fr 1fr}.aiows .reviews{grid-template-columns:1fr}.aiows .team{grid-template-columns:1fr 1fr}.aiows .btn{flex:1;justify-content:center}.aiows .rot{min-width:7em}}
`;

function startAurora(cv: HTMLCanvasElement, alpha: number) {
  const ctx = cv.getContext("2d");
  if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, raf = 0;
  const blobs = [
    { c: "59,125,255", x: .24, y: .32, ax: .10, ay: .08, r: .62, sx: .13, sy: .10, p: 0 },
    { c: "16,198,198", x: .74, y: .28, ax: .12, ay: .09, r: .56, sx: .10, sy: .14, p: 1.7 },
    { c: "255,122,89", x: .55, y: .68, ax: .11, ay: .10, r: .48, sx: .12, sy: .11, p: 3.1 },
    { c: "139,125,255", x: .38, y: .62, ax: .10, ay: .08, r: .44, sx: .09, sy: .12, p: 4.6 },
  ];
  function size() { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function frame(t: number) {
    ctx!.clearRect(0, 0, W, H);
    const base = Math.max(W, H);
    try { ctx!.filter = "blur(" + Math.round(base * 0.06) + "px)"; } catch (e) {}
    for (const b of blobs) {
      const x = (b.x + Math.sin(t * b.sx + b.p) * b.ax) * W;
      const y = (b.y + Math.cos(t * b.sy + b.p) * b.ay) * H;
      const rr = b.r * base * 0.6;
      const g = ctx!.createRadialGradient(x, y, 0, x, y, rr);
      g.addColorStop(0, "rgba(" + b.c + "," + alpha + ")");
      g.addColorStop(1, "rgba(" + b.c + ",0)");
      ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(x, y, rr, 0, 6.2832); ctx!.fill();
    }
    ctx!.filter = "none";
  }
  size();
  const onR = () => size();
  window.addEventListener("resize", onR, { passive: true });
  if (reduce) { frame(0); return () => window.removeEventListener("resize", onR); }
  const t0 = performance.now();
  const loop = (now: number) => { frame((now - t0) / 1000 * 0.42); raf = requestAnimationFrame(loop); };
  raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
}

export function WebsiteLanding({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const cleanups: Array<() => void> = [];
    const prog = root.querySelector<HTMLElement>(".prog");
    const onScroll = () => { const h = document.documentElement; if (prog) prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%"; };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          const c = (e.target as HTMLElement).querySelector<HTMLElement>(".cnt");
          if (c) { const to = +(c.dataset.to || "0"); let n = 0; const st = to / 38; const iv = setInterval(() => { n += st; if (n >= to) { n = to; clearInterval(iv); } c.textContent = String(Math.round(n)); }, 20); }
          io.unobserve(e.target);
        }
      });
    }, { threshold: .18 });
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());
    root.querySelectorAll<HTMLCanvasElement>("canvas.aurora").forEach((cv) => cleanups.push(startAurora(cv, 0.5)));
    return () => cleanups.forEach((f) => f());
  }, []);

  const base = `/${locale}`;
  return (
    <div className="aiows" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <div className="nav"><div className="nw"><span className="b">AIO</span><span className="crumb">개발 / 웹사이트</span><a className="ncta" href={`${base}/quote`}>무료 상담 →</a></div></div>

      <header className="hero">
        <canvas className="aurora" aria-hidden="true" />
        <div className="wrap">
          <div className="eyebrow"><span className="tag">WEBSITE</span>
            <span className="rot"><b>회사 홈페이지</b><b>서비스 랜딩</b><b>마케팅 랜딩</b></span>
          </div>
          <h1><span className="l1">첫 3초가,</span><span className="l2"><em className="grad">전부</em>입니다</span></h1>
          <p className="lead">스크롤을 멈추게 만드는 홈페이지를 만듭니다. <b>회사 소개부터 제품·서비스·마케팅 랜딩까지</b>, 보는 순간 신뢰가 생기고 끝까지 읽게 되는 한 페이지.</p>
          <div className="btns"><a className="btn p" href={`${base}/quote`}>제작 문의 →</a><a className="btn g" href="#work">작업 보기</a></div>
          <div className="cue">SCROLL ↓</div>
        </div>
        <div className="marq"><div className="row">
          <span>회사 홈페이지</span><span>서비스 랜딩</span><span>마케팅 랜딩</span><span>이벤트 페이지</span><span>반응형</span><span>검색 최적화</span>
          <span>회사 홈페이지</span><span>서비스 랜딩</span><span>마케팅 랜딩</span><span>이벤트 페이지</span><span>반응형</span><span>검색 최적화</span>
        </div></div>
      </header>

      <section className="sec wrap">
        <div className="reveal"><div className="kicker">What we build</div><div className="h2">세 가지 홈페이지</div>
          <p className="psub">목적이 다르면 구조도 달라야 합니다. 보여줄 것, 팔 것, 전환시킬 것 — 각각에 맞춰 설계합니다.</p></div>
        <div className="types">
          <div className="type reveal d1"><div className="mini m1"><i className="ba" /><i className="bb" /><i className="bc" /></div><div className="body"><div className="n">회사 홈페이지</div><div className="d">브랜드 신뢰를 만드는 공식 사이트. 소개·연혁·문의까지.</div></div></div>
          <div className="type reveal d2"><div className="mini m2"><i className="ba" /><i className="bb" /><i className="bc" /></div><div className="body"><div className="n">서비스 랜딩</div><div className="d">제품·서비스 하나에 집중. 스크롤 흐름으로 가치를 설득.</div></div></div>
          <div className="type reveal d3"><div className="mini m3"><i className="ba" /><i className="bb" /><i className="bc" /></div><div className="body"><div className="n">마케팅 랜딩</div><div className="d">광고 유입 전환용. 한 가지 행동으로 몰아주는 구조.</div></div></div>
        </div>
      </section>

      <section className="sec wrap" id="work">
        <div className="reveal"><div className="kicker">Selected work</div><div className="h2">만든 것들</div>
          <p className="psub">미리보기입니다. 클릭하면 케이스로, 아래 버튼으로 전체 포트폴리오 페이지로 들어갑니다.</p></div>
        <div className="pf">
          <a className="bw g-blue reveal d1 float" href={`${base}/services/website/portfolio`}><div className="top"><i style={{ background: "#FF5F56" }} /><i style={{ background: "#FFBD2E" }} /><i style={{ background: "#27C93F" }} /><span className="url">chueok-korea.com</span></div><div className="shot"><div className="ttl">추억코리아</div><div className="ln" style={{ width: "55%" }} /><div className="ln" style={{ width: "35%" }} /></div><div className="cap"><span className="nm">추억코리아 · 회사 홈페이지</span><span className="tg">↗ CASE</span></div></a>
          <a className="bw g-ink reveal d2 float2" href={`${base}/services/website/portfolio`}><div className="top"><i style={{ background: "#FF5F56" }} /><i style={{ background: "#FFBD2E" }} /><i style={{ background: "#27C93F" }} /><span className="url">aio-make.com</span></div><div className="shot"><div className="ttl">AIO 에이전시</div><div className="ln" style={{ width: "50%" }} /><div className="ln" style={{ width: "40%" }} /></div><div className="cap"><span className="nm">AIO · 브랜드 사이트</span><span className="tg">↗ CASE</span></div></a>
          <a className="bw g-coral reveal d1 float2" href={`${base}/services/website/portfolio`}><div className="top"><i style={{ background: "#FF5F56" }} /><i style={{ background: "#FFBD2E" }} /><i style={{ background: "#27C93F" }} /><span className="url">v-aio.app</span></div><div className="shot"><div className="ttl">V-AIO</div><div className="ln" style={{ width: "48%" }} /><div className="ln" style={{ width: "30%" }} /></div><div className="cap"><span className="nm">V-AIO · 서비스 랜딩</span><span className="tg">↗ CASE</span></div></a>
          <a className="bw g-soft reveal d2 float" href={`${base}/services/website/portfolio`}><div className="top"><i style={{ background: "#FF5F56" }} /><i style={{ background: "#FFBD2E" }} /><i style={{ background: "#27C93F" }} /><span className="url">your-brand.com</span></div><div className="shot"><div className="ttl">다음은<br />당신 차례</div></div><div className="cap"><span className="nm">당신의 홈페이지</span><span className="tg">+ 문의</span></div></a>
        </div>
        <div className="pf-more reveal"><a className="btn g" href={`${base}/services/website/portfolio`} style={{ display: "inline-flex" }}>포트폴리오 전체 보기 →</a></div>
      </section>

      <section className="sec wrap">
        <div className="reveal"><div className="kicker">Pricing</div><div className="h2">투명한 가격</div>
          <p className="psub">필요한 페이지 수에 맞춰. 지금은 한정가로 진행합니다.</p>
          <div className="promo">2026년 6월까지 한정가 · 이후 정상가 적용</div></div>
        <div className="price">
          <div className="pc reveal d1"><div className="pl">랜딩페이지 · 1P</div><div className="pv grad">4.9<span style={{ fontSize: "0.5em" }}> 만원</span></div><div className="po">정상가 <s>14.7만원</s></div></div>
          <div className="pc reveal d2"><div className="pl">5페이지 이내</div><div className="pv grad">9.9<span style={{ fontSize: "0.5em" }}> 만원</span></div><div className="po">정상가 <s>29.7만원</s></div></div>
          <div className="pc reveal d3"><div className="pl">10페이지 이내</div><div className="pv grad">14.9<span style={{ fontSize: "0.5em" }}> 만원</span></div><div className="po">정상가 <s>44.7만원</s></div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="vals reveal">
          <div className="val"><div className="v grad">1–5일</div><div className="l">빠른 제작</div></div>
          <div className="val"><div className="v grad"><span className="cnt" data-to="100">0</span>%</div><div className="l">모바일 반응형</div></div>
          <div className="val"><div className="v grad">SEO</div><div className="l">검색 노출 최적화</div></div>
          <div className="val"><div className="v grad">1개월</div><div className="l">무상 유지보수</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="reveal"><div className="kicker">How it works</div><div className="h2">의뢰부터 운영까지</div></div>
        <div className="steps reveal d1">
          <div className="step"><div className="s">01</div><div className="t">의뢰</div><div className="d">목적·레퍼런스 한 문장으로</div></div>
          <div className="step"><div className="s">02</div><div className="t">견적</div><div className="d">24시간 안에 가격·일정 회신</div></div>
          <div className="step"><div className="s">03</div><div className="t">제작</div><div className="d">매일 진행 상황 공유</div></div>
          <div className="step"><div className="s">04</div><div className="t">운영</div><div className="d">배포 + 1개월 무상 A/S</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="reveal"><div className="kicker">Reviews</div><div className="h2">고객 후기</div>
          <p className="psub">실제 의뢰 후기를 그대로 보여드립니다.</p></div>
        <div className="reviews">
          <div className="rev reveal d1"><div className="stars">★★★★★</div><div className="q">"문의 3일 만에 시안, 일주일 만에 오픈했어요. 모바일에서 정말 깔끔하게 나와서 만족합니다."</div><div className="who"><div className="av av-blue">김</div><div><div className="nm">김** 대표</div><div className="meta">카페 창업 · 회사 홈페이지</div></div></div></div>
          <div className="rev reveal d2"><div className="stars">★★★★★</div><div className="q">"광고용 랜딩을 맡겼는데 전환이 눈에 띄게 올랐습니다. 구조 설계가 확실히 다르네요."</div><div className="who"><div className="av av-coral">박</div><div><div className="nm">박** 매니저</div><div className="meta">교육 스타트업 · 마케팅 랜딩</div></div></div></div>
          <div className="rev reveal d3"><div className="stars">★★★★★</div><div className="q">"진행 상황을 매일 공유해줘서 안심됐어요. 납품 후 수정도 빠르게 대응해줍니다."</div><div className="who"><div className="av av-violet">이</div><div><div className="nm">이** 실장</div><div className="meta">제조 · 서비스 랜딩</div></div></div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="reveal"><div className="kicker">Team</div><div className="h2">이 서비스를 만드는 팀</div>
          <p className="psub">웹사이트 하나에, 분야별 담당자가 처음부터 끝까지 함께합니다.</p></div>
        <div className="team">
          <div className="mem reveal d1"><div className="av av-blue">리</div><div className="role">Planner</div><div className="nm">기획 · 리아</div><div className="one">목적과 흐름을 먼저 설계합니다.</div><div className="tags"><span>IA</span><span>와이어프레임</span></div></div>
          <div className="mem reveal d2"><div className="av av-teal">준</div><div className="role">Copywriter</div><div className="nm">카피 · 준</div><div className="one">읽게 만드는 한 줄을 씁니다.</div><div className="tags"><span>메시지</span><span>카피</span></div></div>
          <div className="mem reveal d3"><div className="av av-coral">도</div><div className="role">Designer</div><div className="nm">디자인 · 도윤</div><div className="one">첫인상을 디자인합니다.</div><div className="tags"><span>UI</span><span>비주얼</span></div></div>
          <div className="mem reveal d1"><div className="av av-violet">세</div><div className="role">Developer</div><div className="nm">개발 · 세호</div><div className="one">운영 가능한 상태로 구현·배포합니다.</div><div className="tags"><span>Next.js</span><span>반응형</span></div></div>
          <div className="mem reveal d2"><div className="av av-gray">현</div><div className="role">QA · Ops</div><div className="nm">검수·운영 · 현아</div><div className="one">끝까지 점검하고 유지보수합니다.</div><div className="tags"><span>QA</span><span>A/S</span></div></div>
        </div>
        <div className="teamlink reveal"><a className="btn g" href={`${base}/services/development/team`} style={{ display: "inline-flex" }}>개발팀 전체 보기 →</a></div>
      </section>

      <section className="cta-sec"><canvas className="aurora" aria-hidden="true" /><div className="wrap reveal">
        <h2>멈추게 만드는<br /><span className="grad">홈페이지</span>, 만들까요?</h2>
        <p>24시간 안에 견적 회신 · 5일 안에 첫 화면</p>
        <a className="btn p" href={`${base}/quote`} style={{ fontSize: "16px" }}>제작 문의 →</a>
      </div></section>

      <footer className="foot">
        <div className="wrap">AIO · 개발 / 웹사이트 &nbsp;|&nbsp; 사업자 682-01-02748 &nbsp;|&nbsp; aiomake2023@gmail.com</div>
      </footer>
    </div>
  );
}
