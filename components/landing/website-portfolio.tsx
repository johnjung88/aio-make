"use client";

import { useEffect, useRef, useState } from "react";

const CSS = `
.aiowsp{--bg:#F5F8FF;--surface:#fff;--fg:#0D1220;--fg2:#5A6478;--fg3:#9AA2B4;--line:#E7EBF5;--a1:#3B7DFF;--a2:#10C6C6;
  --jak:var(--font-jakarta);--pret:var(--font-pretendard);--jet:var(--font-jetbrains);--frau:var(--font-fraunces);
  --fs-display:clamp(34px,6.5vw,68px);--fs-lead:clamp(15px,1.5vw,18px);--sp-sec:clamp(56px,8vw,104px);--sp-edge:clamp(20px,4vw,40px);--maxw:1180px;
  --shadow:0 14px 44px rgba(20,40,90,.09);--shadow-sm:0 6px 20px rgba(20,40,90,.06);
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;text-align:center;min-height:100vh}
.aiowsp *{box-sizing:border-box}
.aiowsp a{text-decoration:none;color:inherit}
.aiowsp .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiowsp .grad{background:linear-gradient(100deg,var(--a1),var(--a2),var(--a1));background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:aiowsp-gf 6s ease-in-out infinite}
@keyframes aiowsp-gf{50%{background-position:100% 0}}
@keyframes aiowsp-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
@keyframes aiowsp-bob{50%{transform:translateY(9px)}}@keyframes aiowsp-bob2{50%{transform:translateY(-11px)}}
.aiowsp .reveal{opacity:0;transform:translateY(30px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1)}
.aiowsp .reveal.in{opacity:1;transform:none}
.aiowsp .prog{position:fixed;top:0;left:0;height:3px;width:0;z-index:99;background:linear-gradient(100deg,var(--a1),var(--a2))}
.aiowsp .nav{position:sticky;top:0;z-index:50;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);background:rgba(245,248,255,.78);border-bottom:1px solid var(--line)}
.aiowsp .nav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;align-items:center;height:60px;text-align:left}
.aiowsp .nav .b{font-family:var(--jak);font-weight:800;font-size:17px}
.aiowsp .nav .crumb{font-family:var(--jet);font-size:11px;color:var(--fg3);margin-left:14px;letter-spacing:.08em}
.aiowsp .nav .ncta{margin-left:auto;font-size:13px;font-weight:600;padding:9px 18px;border-radius:999px;background:linear-gradient(100deg,var(--a1),var(--a2));color:#fff;box-shadow:var(--shadow-sm)}
.aiowsp .head{position:relative;overflow:hidden;padding:clamp(60px,9vw,110px) 0 clamp(32px,5vw,52px);isolation:isolate}
.aiowsp .aurora{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.aiowsp .head::after{content:"";position:absolute;left:0;right:0;bottom:0;height:40%;z-index:0;background:linear-gradient(180deg,transparent,var(--bg))}
.aiowsp .head .wrap{position:relative;z-index:1}
.aiowsp .back{font-family:var(--jet);font-size:12px;color:var(--fg2);display:inline-block;margin-bottom:18px;animation:aiowsp-rise .6s both}
.aiowsp .eyebrow{font-family:var(--jet);font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--a2);margin-bottom:14px;animation:aiowsp-rise .7s both}
.aiowsp h1{font-family:var(--jak);font-weight:800;font-size:var(--fs-display);line-height:1.02;letter-spacing:-.03em;margin-bottom:16px;animation:aiowsp-rise .8s .08s both}
.aiowsp .sub{font-size:var(--fs-lead);color:var(--fg2);line-height:1.7;max-width:46ch;margin:0 auto;animation:aiowsp-rise .8s .18s both}
.aiowsp .count{font-family:var(--jet);font-size:13px;color:var(--fg3);margin-top:14px;animation:aiowsp-rise .8s .26s both}
.aiowsp .filters{display:flex;gap:9px;flex-wrap:wrap;justify-content:center;margin:clamp(28px,4vw,40px) auto clamp(34px,5vw,46px);max-width:var(--maxw);padding:0 var(--sp-edge)}
.aiowsp .chip{font-size:13px;font-weight:600;padding:9px 18px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--fg2);cursor:pointer;transition:all .25s;box-shadow:var(--shadow-sm)}
.aiowsp .chip:hover{color:var(--fg)}
.aiowsp .chip.on{background:linear-gradient(100deg,var(--a1),var(--a2));color:#fff;border-color:transparent}
.aiowsp .grid{max-width:var(--maxw);margin:0 auto clamp(40px,6vw,60px);padding:0 var(--sp-edge);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.aiowsp .bw{border-radius:16px;overflow:hidden;border:1px solid var(--line);background:var(--surface);box-shadow:var(--shadow-sm);transition:transform .4s,box-shadow .4s;text-align:left}
.aiowsp .bw:hover{transform:translateY(-8px);box-shadow:var(--shadow)}
.aiowsp .bw .top{display:flex;align-items:center;gap:6px;padding:10px 13px;background:#F0F3FA;border-bottom:1px solid var(--line)}
.aiowsp .bw .top i{width:10px;height:10px;border-radius:50%;display:inline-block}
.aiowsp .bw .url{margin-left:9px;flex:1;background:#fff;border:1px solid var(--line);border-radius:6px;font-family:var(--jet);font-size:10.5px;color:var(--fg3);padding:5px 11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aiowsp .bw .shot{aspect-ratio:16/11;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:26px;gap:10px;color:#fff}
.aiowsp .bw .shot .ttl{font-family:var(--jak);font-weight:800;font-size:clamp(20px,2.6vw,26px);line-height:1.1}
.aiowsp .bw .shot .ln{height:8px;border-radius:5px;background:rgba(255,255,255,.4)}
.aiowsp .bw .cap{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:8px}
.aiowsp .bw .cap .nm{font-weight:600;font-size:13.5px}.aiowsp .bw .cap .tg{font-family:var(--jet);font-size:10.5px;color:var(--a1);white-space:nowrap}
.aiowsp .g-blue .shot{background:linear-gradient(135deg,#3B7DFF,#10C6C6)}.aiowsp .g-ink .shot{background:linear-gradient(135deg,#0D1220,#2C3550)}
.aiowsp .g-coral .shot{background:linear-gradient(135deg,#FF7A59,#FFB155)}.aiowsp .g-violet .shot{background:linear-gradient(135deg,#8B7DFF,#3B7DFF)}
.aiowsp .g-teal .shot{background:linear-gradient(135deg,#10C6C6,#3B7DFF)}.aiowsp .g-warm .shot{background:linear-gradient(135deg,#C8704A,#FFB155)}
.aiowsp .bw.f1{animation:aiowsp-bob 6s ease-in-out infinite}.aiowsp .bw.f2{animation:aiowsp-bob2 7s ease-in-out infinite}
.aiowsp .cta-sec{padding:clamp(80px,11vw,120px) 0;border-top:1px solid var(--line);margin-top:var(--sp-sec)}
.aiowsp .cta-sec h2{font-family:var(--jak);font-weight:800;font-size:var(--fs-display);line-height:1.04;letter-spacing:-.03em;margin-bottom:20px}
.aiowsp .cta-sec p{color:var(--fg2);margin-bottom:30px;font-size:var(--fs-lead)}
.aiowsp .btn{font-size:15px;font-weight:600;padding:15px 30px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;transition:transform .25s;background:linear-gradient(100deg,var(--a1),var(--a2));color:#fff;box-shadow:0 12px 30px rgba(59,125,255,.3);cursor:pointer}
.aiowsp .btn:hover{transform:translateY(-3px)}
.aiowsp .foot{border-top:1px solid var(--line);padding:38px 0;color:var(--fg3);font-family:var(--jet);font-size:11.5px;line-height:1.9}
@media(max-width:900px){.aiowsp .grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.aiowsp .grid{grid-template-columns:1fr}}
`;

type Item = { cat: string; g: string; f: string; url: string; ttl: string; nm: string; w1: string; w2: string };
const ITEMS: Item[] = [
  { cat: "corp", g: "g-blue", f: "f1", url: "chueok-korea.com", ttl: "추억코리아", nm: "추억코리아 · 회사 홈페이지", w1: "55%", w2: "35%" },
  { cat: "corp", g: "g-ink", f: "f2", url: "aio-make.com", ttl: "AIO 에이전시", nm: "AIO · 브랜드 사이트", w1: "50%", w2: "40%" },
  { cat: "service", g: "g-teal", f: "f1", url: "v-aio.app", ttl: "V-AIO", nm: "V-AIO · 서비스 랜딩", w1: "48%", w2: "30%" },
  { cat: "mkt", g: "g-coral", f: "f2", url: "promo.event.kr", ttl: "이벤트 프로모션", nm: "캠페인 · 마케팅 랜딩", w1: "52%", w2: "30%" },
  { cat: "service", g: "g-violet", f: "f1", url: "app-service.io", ttl: "SaaS 랜딩", nm: "SaaS · 서비스 랜딩", w1: "46%", w2: "34%" },
  { cat: "shop", g: "g-warm", f: "f2", url: "farm-fresh.cafe24.com", ttl: "팜프레시 몰", nm: "팜프레시 · 쇼핑몰", w1: "50%", w2: "38%" },
  { cat: "corp", g: "g-blue", f: "f1", url: "company-official.kr", ttl: "기업 공식 사이트", nm: "제조 · 회사 홈페이지", w1: "54%", w2: "32%" },
  { cat: "mkt", g: "g-coral", f: "f2", url: "edu-signup.kr", ttl: "수강 신청 랜딩", nm: "교육 · 마케팅 랜딩", w1: "48%", w2: "30%" },
];
const FILTERS = [
  { f: "all", label: "전체" }, { f: "corp", label: "회사 홈페이지" }, { f: "service", label: "서비스 랜딩" },
  { f: "mkt", label: "마케팅 랜딩" }, { f: "shop", label: "쇼핑몰" },
];

function startAurora(cv: HTMLCanvasElement) {
  const ctx = cv.getContext("2d"); if (!ctx) return () => {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2); let W = 0, H = 0, raf = 0;
  const blobs = [
    { c: "59,125,255", x: .24, y: .34, ax: .10, ay: .08, r: .6, sx: .13, sy: .10, p: 0 },
    { c: "16,198,198", x: .72, y: .3, ax: .12, ay: .09, r: .56, sx: .10, sy: .14, p: 1.7 },
    { c: "255,122,89", x: .55, y: .7, ax: .11, ay: .10, r: .46, sx: .12, sy: .11, p: 3.1 },
  ];
  function size() { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx!.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function frame(t: number) { ctx!.clearRect(0, 0, W, H); const base = Math.max(W, H); try { ctx!.filter = "blur(" + Math.round(base * 0.06) + "px)"; } catch (e) {}
    for (const b of blobs) { const x = (b.x + Math.sin(t * b.sx + b.p) * b.ax) * W, y = (b.y + Math.cos(t * b.sy + b.p) * b.ay) * H, rr = b.r * base * 0.6;
      const g = ctx!.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, "rgba(" + b.c + ",0.5)"); g.addColorStop(1, "rgba(" + b.c + ",0)"); ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(x, y, rr, 0, 6.2832); ctx!.fill(); } ctx!.filter = "none"; }
  size(); const onR = () => size(); window.addEventListener("resize", onR, { passive: true });
  if (reduce) { frame(0); return () => window.removeEventListener("resize", onR); }
  const t0 = performance.now(); const loop = (now: number) => { frame((now - t0) / 1000 * 0.42); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
  return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onR); };
}

export function WebsitePortfolio({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");
  const base = `/${locale}`;
  const shown = ITEMS.filter((it) => filter === "all" || it.cat === filter);
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const cleanups: Array<() => void> = [];
    const prog = root.querySelector<HTMLElement>(".prog");
    const onScroll = () => { const h = document.documentElement; if (prog) prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%"; };
    window.addEventListener("scroll", onScroll, { passive: true }); cleanups.push(() => window.removeEventListener("scroll", onScroll));
    const cv = root.querySelector<HTMLCanvasElement>("canvas.aurora"); if (cv) cleanups.push(startAurora(cv));
    return () => cleanups.forEach((f) => f());
  }, []);
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    root.querySelectorAll(".reveal").forEach((el) => { el.classList.remove("in"); io.observe(el); });
    return () => io.disconnect();
  }, [filter]);

  return (
    <div className="aiowsp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <div className="nav"><div className="nw"><span className="b">AIO</span><span className="crumb">개발 / 웹사이트 / 포트폴리오</span><a className="ncta" href={`${base}/quote`}>무료 상담 →</a></div></div>

      <header className="head">
        <canvas className="aurora" aria-hidden="true" />
        <div className="wrap">
          <a className="back" href={`${base}/services/website`}>← 웹사이트 소개로</a>
          <div className="eyebrow">Portfolio</div>
          <h1>웹사이트 <span className="grad">포트폴리오</span></h1>
          <p className="sub">회사 홈페이지부터 서비스·마케팅 랜딩, 쇼핑몰까지 — 실제 작업물을 분야별로 모았습니다.</p>
          <div className="count">총 <b>{shown.length}</b>개 프로젝트</div>
        </div>
      </header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.f} className={"chip" + (filter === f.f ? " on" : "")} onClick={() => setFilter(f.f)}>{f.label}</button>
        ))}
      </div>

      <div className="grid">
        {shown.map((it, i) => (
          <a key={i} className={`bw ${it.g} reveal ${it.f}`} href={`${base}/services/website`}>
            <div className="top"><i style={{ background: "#FF5F56" }} /><i style={{ background: "#FFBD2E" }} /><i style={{ background: "#27C93F" }} /><span className="url">{it.url}</span></div>
            <div className="shot"><div className="ttl">{it.ttl}</div><div className="ln" style={{ width: it.w1 }} /><div className="ln" style={{ width: it.w2 }} /></div>
            <div className="cap"><span className="nm">{it.nm}</span><span className="tg">↗ CASE</span></div>
          </a>
        ))}
      </div>

      <section className="cta-sec"><div className="wrap reveal">
        <h2>다음 프로젝트는<br /><span className="grad">당신 차례</span>입니다</h2>
        <p>24시간 안에 견적 회신 · 5일 안에 첫 화면</p>
        <a className="btn" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <footer className="foot"><div className="wrap">AIO · 개발 / 웹사이트 / 포트폴리오 &nbsp;|&nbsp; aiomake2023@gmail.com</div></footer>
    </div>
  );
}
