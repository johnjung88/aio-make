"use client";

import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiowsp{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;
  --line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(36px,7vw,76px);--fs-lead:clamp(15px,1.5vw,18px);--sp-sec:clamp(64px,9vw,120px);--sp-edge:clamp(20px,5vw,64px);--maxw:1200px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;text-align:center;min-height:100vh}
.aiowsp *{box-sizing:border-box}
.aiowsp a{text-decoration:none;color:inherit}
.aiowsp .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiowsp .kick{font-family:var(--mono);font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
@keyframes aiowsp-rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.aiowsp .reveal{opacity:0;transform:translateY(28px);transition:opacity 1s cubic-bezier(.2,1,.3,1),transform 1s cubic-bezier(.2,1,.3,1)}
.aiowsp .reveal.in{opacity:1;transform:none}
.aiowsp .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--gold),var(--gold2))}
.aiowsp .nav{position:sticky;top:0;z-index:50;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background:rgba(14,13,11,.82);border-bottom:1px solid var(--line2)}
.aiowsp .nav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;align-items:center;height:62px;text-align:left}
.aiowsp .nav .b{font-family:var(--frau);font-weight:600;font-size:20px}.aiowsp .nav .b em{font-style:normal;color:var(--gold)}
.aiowsp .nav .crumb{font-family:var(--mono);font-size:11px;color:var(--fg3);margin-left:16px;letter-spacing:.1em;text-transform:uppercase}
.aiowsp .nav .ncta{margin-left:auto;font-size:13px;font-weight:600;padding:9px 20px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiowsp .subnav{position:sticky;top:62px;z-index:49;background:rgba(14,13,11,.9);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid var(--line2)}
.aiowsp .subnav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;gap:4px;height:50px;align-items:center;justify-content:center;overflow-x:auto;scrollbar-width:none}
.aiowsp .subnav .nw::-webkit-scrollbar{display:none}
.aiowsp .subnav a{font-family:var(--mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);padding:8px 16px;white-space:nowrap;border-bottom:2px solid transparent;transition:color .2s,border-color .2s}
.aiowsp .subnav a:hover{color:var(--fg)}.aiowsp .subnav a.on{color:var(--gold);border-bottom-color:var(--gold)}
.aiowsp .head{position:relative;overflow:hidden;padding:clamp(60px,9vw,110px) 0 clamp(30px,4vw,48px)}
.aiowsp .head::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 12%,rgba(200,162,74,.10),transparent 70%);pointer-events:none}
.aiowsp .head .wrap{position:relative}
.aiowsp .back{font-family:var(--mono);font-size:12px;color:var(--fg3);display:inline-block;margin-bottom:18px}
.aiowsp .back:hover{color:var(--gold)}
.aiowsp .head .kick{display:inline-block;margin-bottom:14px}
.aiowsp h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;letter-spacing:-.01em;margin-bottom:16px}
.aiowsp h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiowsp .sub{font-size:var(--fs-lead);color:var(--fg2);line-height:1.8;max-width:46ch;margin:0 auto}
.aiowsp .count{font-family:var(--mono);font-size:12px;color:var(--fg3);margin-top:14px}
.aiowsp .count b{color:var(--gold)}
.aiowsp .filters{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:clamp(28px,4vw,40px) auto clamp(34px,5vw,46px);max-width:var(--maxw);padding:0 var(--sp-edge)}
.aiowsp .chip{font-family:var(--mono);font-size:12px;letter-spacing:.04em;padding:9px 16px;border-radius:999px;border:1px solid var(--line2);background:transparent;color:var(--fg2);cursor:pointer;transition:all .25s}
.aiowsp .chip:hover{color:var(--fg);border-color:var(--line)}
.aiowsp .chip.on{background:var(--gold);color:#0E0D0B;border-color:var(--gold)}
.aiowsp .grid{max-width:var(--maxw);margin:0 auto clamp(40px,6vw,60px);padding:0 var(--sp-edge);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.aiowsp .bw{border-radius:12px;overflow:hidden;border:1px solid var(--line2);background:var(--bg2);transition:transform .4s,border-color .4s}
.aiowsp .bw:hover{transform:translateY(-7px);border-color:var(--line)}
.aiowsp .bw .top{display:flex;align-items:center;gap:6px;padding:10px 13px;border-bottom:1px solid var(--line2)}
.aiowsp .bw .top i{width:9px;height:9px;border-radius:50%;background:var(--fg3);display:inline-block;opacity:.5}
.aiowsp .bw .url{margin-left:8px;flex:1;font-family:var(--mono);font-size:10.5px;color:var(--fg3);text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.aiowsp .bw .shot{height:clamp(160px,22vw,200px)}
.aiowsp .bw .cap{padding:14px 16px;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}
.aiowsp .bw .cap .nm{font-size:13.5px;color:var(--fg)}.aiowsp .bw .cap .ct{font-family:var(--mono);font-size:10.5px;color:var(--gold)}
.aiowsp .dsite{border-radius:0;overflow:hidden;background:#14120C;display:flex;flex-direction:column;height:100%;text-align:left}
.aiowsp .dsite .sbar{display:flex;align-items:center;gap:6px;padding:9px 12px;border-bottom:1px solid var(--line2)}
.aiowsp .dsite .lg{width:13px;height:13px;border-radius:4px;background:var(--gold)}
.aiowsp .dsite .mi{height:5px;width:20px;border-radius:3px;background:rgba(239,233,221,.22)}
.aiowsp .dsite .sp{flex:1}.aiowsp .dsite .bt{height:12px;width:34px;border-radius:6px;background:var(--gold)}
.aiowsp .dsite .sbd{flex:1;padding:14px;display:flex;flex-direction:column;gap:8px;background:radial-gradient(ellipse at 50% 0%,rgba(200,162,74,.07),transparent 70%)}
.aiowsp .dsite .ht{height:12px;width:60%;border-radius:4px;background:#EFE9DD}
.aiowsp .dsite .ht2{height:12px;width:42%;border-radius:4px;background:var(--gold)}
.aiowsp .dsite .pp{height:6px;width:78%;border-radius:3px;background:rgba(239,233,221,.28)}
.aiowsp .dsite .cta{height:16px;width:72px;border-radius:8px;background:var(--gold);margin-top:2px}
.aiowsp .dsite .drow{display:flex;gap:7px;margin-top:auto}.aiowsp .dsite .drow .cc{flex:1;height:clamp(24px,4vw,34px);border-radius:6px;background:#211E15;border:1px solid var(--line2)}
.aiowsp .dsite.land .sbd{align-items:center;text-align:center}.aiowsp .dsite.land .ht{width:68%}.aiowsp .dsite.land .ht2{width:46%}.aiowsp .dsite.land .pp{width:56%}.aiowsp .dsite.land .cta{width:110px}
.aiowsp .ctaS{position:relative;text-align:center;padding:clamp(80px,11vw,130px) 0;border-top:1px solid var(--line);margin-top:var(--sp-sec)}
.aiowsp .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 50% 50%,rgba(200,162,74,.1),transparent 70%);pointer-events:none}
.aiowsp .ctaS .wrap{position:relative}
.aiowsp .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:20px}
.aiowsp .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiowsp .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:32px}
.aiowsp .cta-pill{font-size:15px;font-weight:600;padding:15px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;display:inline-flex;transition:transform .25s,background .25s}
.aiowsp .cta-pill:hover{transform:translateY(-2px);background:var(--gold2)}
.aiowsp .foot{border-top:1px solid var(--line2);padding:38px 0;text-align:center;font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--fg3);line-height:2}
@media(max-width:900px){.aiowsp .grid{grid-template-columns:1fr 1fr}}
@media(max-width:600px){.aiowsp .grid{grid-template-columns:1fr}}
`;

type Item = { cat: string; land: boolean; url: string; nm: string };
const ITEMS: Item[] = [
  { cat: "corp", land: false, url: "chueok-korea.com", nm: "추억코리아 · 회사 홈페이지" },
  { cat: "corp", land: false, url: "aio-make.com", nm: "AIO · 브랜드 사이트" },
  { cat: "service", land: true, url: "v-aio.app", nm: "V-AIO · 서비스 랜딩" },
  { cat: "mkt", land: true, url: "promo.event.kr", nm: "캠페인 · 마케팅 랜딩" },
  { cat: "service", land: true, url: "app-service.io", nm: "SaaS · 서비스 랜딩" },
  { cat: "shop", land: false, url: "farm-fresh.cafe24.com", nm: "팜프레시 · 쇼핑몰" },
  { cat: "corp", land: false, url: "company-official.kr", nm: "제조 · 회사 홈페이지" },
  { cat: "mkt", land: true, url: "edu-signup.kr", nm: "교육 · 마케팅 랜딩" },
];
const FILTERS = [
  { f: "all", label: "전체" }, { f: "corp", label: "회사 홈페이지" }, { f: "service", label: "서비스 랜딩" },
  { f: "mkt", label: "마케팅 랜딩" }, { f: "shop", label: "쇼핑몰" },
];

const Site = ({ land }: { land: boolean }) => (
  <div className={"dsite" + (land ? " land" : "")}>
    <div className="sbar"><span className="lg" />{!land && <><span className="mi" /><span className="mi" /></>}<span className="sp" /><span className="bt" /></div>
    <div className="sbd"><span className="ht" /><span className="ht2" /><span className="pp" /><span className="cta" />{!land && <span className="drow"><span className="cc" /><span className="cc" /><span className="cc" /></span>}</div>
  </div>
);

export function WebsitePortfolio({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");
  const base = `/${locale}`;
  const shown = ITEMS.filter((it) => filter === "all" || it.cat === filter);
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const prog = root.querySelector<HTMLElement>(".prog");
    const onScroll = () => { const h = document.documentElement; if (prog) prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%"; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <AioNav locale={locale} level="leaf" cat="development" sub="website" active="portfolio" />

      <header className="head"><div className="wrap">
        <a className="back" href={`${base}/services/website`}>← 웹사이트 소개로</a>
        <span className="kick">Portfolio</span>
        <h1>실제 운영 중인<br /><em>웹사이트</em>들</h1>
        <p className="sub">회사 홈페이지부터 서비스·마케팅 랜딩, 쇼핑몰까지 실제 작업물을 분야별로 모았습니다</p>
        <div className="count">총 <b>{shown.length}</b>개 프로젝트</div>
      </div></header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.f} className={"chip" + (filter === f.f ? " on" : "")} onClick={() => setFilter(f.f)}>{f.label}</button>
        ))}
      </div>

      <div className="grid">
        {shown.map((it, i) => (
          <a key={i} className="bw reveal" href={`${base}/services/website`}>
            <div className="top"><i /><i /><i /><span className="url">{it.url}</span></div>
            <div className="shot"><Site land={it.land} /></div>
            <div className="cap"><span className="nm">{it.nm}</span><span className="ct">↗ CASE</span></div>
          </a>
        ))}
      </div>

      <section className="ctaS"><div className="wrap reveal">
        <h2>다음 프로젝트는<br /><em>당신 차례</em>입니다</h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 화면</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
