"use client";
import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiosmp{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(251,146,60,.22);--line2:rgba(239,233,221,.10);--gold:#FB923C;--gold2:#FDB07A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(38px,7vw,82px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;text-align:center;min-height:100vh}
.aiosmp .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiosmp .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--gold),var(--gold2))}
.aiosmp .reveal{opacity:0;transform:translateY(22px);transition:opacity .9s,transform .9s}.aiosmp .reveal.in{opacity:1;transform:none}
.aiosmp .head{padding:clamp(70px,11vw,140px) 0 clamp(40px,6vw,70px)}
.aiosmp .head .kick{font-family:var(--mono);font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:18px}
.aiosmp .head h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:18px}
.aiosmp .head h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiosmp .head p{font-size:clamp(14.5px,1.25vw,17px);color:var(--fg2);max-width:48ch;margin:0 auto 18px;line-height:1.85}
.aiosmp .head .count{font-family:var(--mono);font-size:11px;color:var(--fg3);letter-spacing:.12em}
.aiosmp .head .count b{color:var(--gold)}
.aiosmp .filters{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:36px;padding:0 var(--sp-edge)}
.aiosmp .chip{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg3);border:1px solid var(--line2);background:transparent;padding:9px 16px;border-radius:999px;cursor:pointer;transition:all .2s}
.aiosmp .chip:hover{color:var(--fg);border-color:var(--line)}
.aiosmp .chip.on{color:#0E0D0B;background:var(--gold);border-color:var(--gold)}
.aiosmp .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;padding:0 var(--sp-edge);max-width:var(--maxw);margin:0 auto clamp(60px,8vw,100px)}
.aiosmp .card{display:block;background:var(--bg2);border:1px solid var(--line2);border-radius:14px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .3s,border-color .3s}
.aiosmp .card:hover{transform:translateY(-4px);border-color:var(--gold)}
.aiosmp .card .top{display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--line2);background:#1c1a13}
.aiosmp .card .top i{width:7px;height:7px;border-radius:50%;background:rgba(239,233,221,.18)}
.aiosmp .card .top .url{flex:1;text-align:left;font-family:var(--mono);font-size:10.5px;color:var(--fg3);margin-left:8px}
.aiosmp .card .shot{aspect-ratio:4/3;background:linear-gradient(135deg,rgba(200,162,74,.18),rgba(215,138,138,.10));position:relative}
.aiosmp .card .shot::after{content:"STORE";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--mono);font-size:11px;color:rgba(239,233,221,.3);letter-spacing:.3em}
.aiosmp .card .cap{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;text-align:left}
.aiosmp .card .nm{font-family:var(--frau);font-size:16px;font-weight:500}
.aiosmp .card .ct{font-family:var(--mono);font-size:10px;color:var(--fg3);letter-spacing:.16em}
@media(max-width:900px){.aiosmp .grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.aiosmp .grid{grid-template-columns:1fr 1fr;gap:12px}}
.aiosmp .ctaS{padding:clamp(60px,9vw,110px) 0;text-align:center}
.aiosmp .ctaS h2{font-family:var(--frau);font-weight:400;font-size:clamp(32px,5vw,58px);margin-bottom:18px;line-height:1.06}
.aiosmp .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiosmp .ctaS p{color:var(--fg2);margin-bottom:30px;font-size:clamp(14px,1.2vw,16.5px)}
.aiosmp .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;text-decoration:none}
`;

const ITEMS = [
  { nm: "에이엘 코스메틱", url: "alcosmetic.co.kr", ct: "Beauty" },
  { nm: "오감 마켓", url: "ogam.market", ct: "Food" },
  { nm: "리프 리빙", url: "leaf-living.kr", ct: "Living" },
  { nm: "베라 패션", url: "vera-fashion.com", ct: "Fashion" },
  { nm: "어반 가드너", url: "urbangardener.kr", ct: "Plant" },
  { nm: "코드 키친", url: "codekitchen.co", ct: "Food" },
  { nm: "스튜디오 마노", url: "studio-mano.kr", ct: "Lifestyle" },
  { nm: "노블 페트", url: "noblepet.shop", ct: "Pet" },
  { nm: "마인드 풀", url: "mindfull.kr", ct: "Health" },
];

const FILTERS = [
  { f: "all", label: "전체" },
  { f: "Beauty", label: "뷰티" },
  { f: "Food", label: "푸드" },
  { f: "Fashion", label: "패션" },
  { f: "Living", label: "리빙" },
];

export function ShoppingMallPortfolio({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");
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
  const shown = filter === "all" ? ITEMS : ITEMS.filter((i) => i.ct === filter);
  return (
    <div className="aiosmp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="shopping-mall" active="portfolio" />

      <header className="head">
        <div className="wrap">
          <span className="kick">Shopping Mall · Portfolio</span>
          <h1>실제 운영 중인<br /><em>스토어</em>들</h1>
          <p>오픈한 다음 매출 데이터로 검증된 작업물만</p>
          <div className="count">총 <b>{shown.length}</b>개 스토어</div>
        </div>
      </header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.f} className={"chip" + (filter === f.f ? " on" : "")} onClick={() => setFilter(f.f)}>{f.label}</button>
        ))}
      </div>

      <div className="grid">
        {shown.map((it, i) => (
          <a key={i} className="card reveal" href={`${base}/services/shopping-mall`}>
            <div className="top"><i /><i /><i /><span className="url">{it.url}</span></div>
            <div className="shot" />
            <div className="cap"><span className="nm">{it.nm}</span><span className="ct">↗ {it.ct}</span></div>
          </a>
        ))}
      </div>

      <section className="ctaS"><div className="wrap reveal">
        <h2>다음 스토어는<br /><em>당신 차례</em>입니다</h2>
        <p>지금 문의하면 24시간 안에 견적 · 빠르면 다음 날 오픈</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
