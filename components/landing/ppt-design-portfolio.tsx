"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiopptp{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(122,174,236,.22);--line2:rgba(239,233,221,.10);--gold:#7AAEEC;--gold2:#A3CEFF;--blue:#7AAEEC;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(38px,7vw,82px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;text-align:center;min-height:100vh}
.aiopptp .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiopptp .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--blue),var(--gold))}
.aiopptp .reveal{opacity:0;transform:translateY(22px);transition:opacity .9s,transform .9s}.aiopptp .reveal.in{opacity:1;transform:none}
.aiopptp .head{padding:clamp(70px,11vw,140px) 0 clamp(40px,6vw,70px)}
.aiopptp .head .kick{font-family:var(--mono);font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:18px}
.aiopptp .head h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:18px}
.aiopptp .head h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiopptp .head p{font-size:clamp(14.5px,1.25vw,17px);color:var(--fg2);max-width:48ch;margin:0 auto 18px;line-height:1.85}
.aiopptp .head .count{font-family:var(--mono);font-size:11px;color:var(--fg3);letter-spacing:.12em}
.aiopptp .head .count b{color:var(--gold)}
.aiopptp .filters{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:36px;padding:0 var(--sp-edge)}
.aiopptp .chip{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg3);border:1px solid var(--line2);background:transparent;padding:9px 16px;border-radius:999px;cursor:pointer}
.aiopptp .chip.on{color:#0E0D0B;background:var(--gold);border-color:var(--gold)}
.aiopptp .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:0 var(--sp-edge);max-width:var(--maxw);margin:0 auto clamp(60px,8vw,100px)}
.aiopptp .card{display:block;background:var(--bg2);border:1px solid var(--line2);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .3s,border-color .3s}
.aiopptp .card:hover{transform:translateY(-4px);border-color:var(--gold)}
.aiopptp .card .shot{aspect-ratio:16/9;position:relative;background:#17150F}
.aiopptp .card .cap{padding:12px 16px;text-align:left}
.aiopptp .card .nm{font-family:var(--frau);font-size:16px;font-weight:500;display:block}
.aiopptp .card .ct{font-family:var(--mono);font-size:10px;color:var(--fg3);letter-spacing:.14em;margin-top:4px;display:block}
@media(max-width:820px){.aiopptp .grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:540px){.aiopptp .grid{grid-template-columns:1fr 1fr;gap:10px}}
.aiopptp .ctaS{padding:clamp(60px,9vw,110px) 0;text-align:center}
.aiopptp .ctaS h2{font-family:var(--frau);font-weight:400;font-size:clamp(32px,5vw,58px);margin-bottom:18px;line-height:1.06}
.aiopptp .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiopptp .ctaS p{color:var(--fg2);margin-bottom:30px;font-size:clamp(14px,1.2vw,16.5px)}
.aiopptp .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;text-decoration:none}
`;

const FILTERS = [
  { f: "all",       label: "전체" },
  { f: "IR·투자유치", label: "IR·투자유치" },
  { f: "지원사업·R&D", label: "지원사업·R&D" },
  { f: "제안·회사소개", label: "제안·회사소개" },
  { f: "발표·강연",   label: "발표·강연" },
  { f: "학술·과제",   label: "학술·과제" },
];

interface PptItem {
  slug: string;
  title: string;
  cover: string;
  slides: string;
  deckUrl: string | null;
  kind: string;
}

export function PptDesignPortfolio({ locale, items }: { locale: string; items: PptItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");

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
  const shown = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <div className="aiopptp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" sub="ppt-design" active="portfolio" />

      <header className="head"><div className="wrap">
        <span className="kick">PPT · Portfolio</span>
        <h1>전달이 된<br /><em>슬라이드</em>들</h1>
        <p>실제 투자·계약·승인을 받은 슬라이드만 모았습니다</p>
        <div className="count">총 <b>{shown.length}</b>개 덱</div>
      </div></header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.f} className={"chip" + (filter === f.f ? " on" : "")} onClick={() => setFilter(f.f)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {shown.map((it) => (
          <a key={it.slug} className="card reveal" href={`${base}/portfolio/${it.slug}`}>
            <div className="shot">
              <Image
                src={it.cover}
                alt={it.title}
                fill
                sizes="(max-width:540px) 100vw, (max-width:820px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="cap">
              <span className="nm">{it.title}</span>
              <span className="ct">↗ {it.kind}{it.slides ? ` · ${it.slides}P` : ""}</span>
            </div>
          </a>
        ))}
      </div>

      <section className="ctaS"><div className="wrap reveal">
        <h2>다음 덱은<br /><em>당신 차례</em>입니다</h2>
        <p>지금 문의하면 24시간 안에 견적</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
