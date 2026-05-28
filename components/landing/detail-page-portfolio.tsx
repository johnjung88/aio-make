"use client";
import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiodp2p{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--rose:#D78A8A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(38px,7vw,82px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;text-align:center;min-height:100vh}
.aiodp2p .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiodp2p .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--rose),var(--gold))}
.aiodp2p .reveal{opacity:0;transform:translateY(22px);transition:opacity .9s,transform .9s}.aiodp2p .reveal.in{opacity:1;transform:none}
.aiodp2p .head{padding:clamp(70px,11vw,140px) 0 clamp(40px,6vw,70px)}
.aiodp2p .head .kick{font-family:var(--mono);font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:18px}
.aiodp2p .head h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:18px}
.aiodp2p .head h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2p .head p{font-size:clamp(14.5px,1.25vw,17px);color:var(--fg2);max-width:48ch;margin:0 auto 18px;line-height:1.85}
.aiodp2p .head .count{font-family:var(--mono);font-size:11px;color:var(--fg3);letter-spacing:.12em}
.aiodp2p .head .count b{color:var(--gold)}
.aiodp2p .filters{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:36px;padding:0 var(--sp-edge)}
.aiodp2p .chip{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg3);border:1px solid var(--line2);background:transparent;padding:9px 16px;border-radius:999px;cursor:pointer}
.aiodp2p .chip.on{color:#0E0D0B;background:var(--gold);border-color:var(--gold)}
.aiodp2p .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;padding:0 var(--sp-edge);max-width:var(--maxw);margin:0 auto clamp(60px,8vw,100px)}
.aiodp2p .card{display:block;background:var(--bg2);border:1px solid var(--line2);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .3s,border-color .3s}
.aiodp2p .card:hover{transform:translateY(-4px);border-color:var(--gold)}
.aiodp2p .card .shot{aspect-ratio:9/16;background:linear-gradient(160deg,rgba(200,162,74,.18),rgba(215,138,138,.10));position:relative}
.aiodp2p .card .shot::after{content:attr(data-px);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--mono);font-size:11px;color:rgba(239,233,221,.35);letter-spacing:.3em}
.aiodp2p .card .cap{padding:12px 14px;text-align:left}
.aiodp2p .card .nm{font-family:var(--frau);font-size:15px;font-weight:500;display:block}
.aiodp2p .card .ct{font-family:var(--mono);font-size:10px;color:var(--fg3);letter-spacing:.14em;margin-top:4px;display:block}
@media(max-width:900px){.aiodp2p .grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:680px){.aiodp2p .grid{grid-template-columns:repeat(2,1fr)}}
.aiodp2p .ctaS{padding:clamp(60px,9vw,110px) 0;text-align:center}
.aiodp2p .ctaS h2{font-family:var(--frau);font-weight:400;font-size:clamp(32px,5vw,58px);margin-bottom:18px;line-height:1.06}
.aiodp2p .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2p .ctaS p{color:var(--fg2);margin-bottom:30px;font-size:clamp(14px,1.2vw,16.5px)}
.aiodp2p .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;text-decoration:none}
`;

const ITEMS = [
  { nm: "비건 단백질", ct: "Food", px: "10,000PX" },
  { nm: "프리미엄 향수", ct: "Beauty", px: "20,000PX" },
  { nm: "원목 가구", ct: "Living", px: "10,000PX" },
  { nm: "프리미엄 캔들", ct: "Living", px: "5,000PX" },
  { nm: "디톡스 차", ct: "Food", px: "10,000PX" },
  { nm: "여행 가방", ct: "Travel", px: "20,000PX" },
  { nm: "스마트 조명", ct: "Tech", px: "10,000PX" },
  { nm: "운동 보조", ct: "Health", px: "5,000PX" },
  { nm: "남자 코트", ct: "Fashion", px: "20,000PX" },
  { nm: "유아 매트", ct: "Baby", px: "10,000PX" },
  { nm: "반려동물 사료", ct: "Pet", px: "10,000PX" },
  { nm: "캠핑 텐트", ct: "Travel", px: "20,000PX" },
];
const FILTERS = [
  { f: "all", label: "전체" }, { f: "Food", label: "푸드" }, { f: "Beauty", label: "뷰티" }, { f: "Living", label: "리빙" }, { f: "Fashion", label: "패션" },
];

export function DetailPagePortfolio({ locale }: { locale: string }) {
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
    <div className="aiodp2p" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" active="portfolio" />

      <header className="head"><div className="wrap">
        <span className="kick">Detail Page · Portfolio</span>
        <h1>스크롤을 멈춘<br /><em>상세페이지</em>들</h1>
        <p>실제 매출로 검증된 페이지만 모았습니다</p>
        <div className="count">총 <b>{shown.length}</b>개 상세페이지</div>
      </div></header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.f} className={"chip" + (filter === f.f ? " on" : "")} onClick={() => setFilter(f.f)}>{f.label}</button>
        ))}
      </div>

      <div className="grid">
        {shown.map((it, i) => (
          <a key={i} className="card reveal" href={`${base}/services/detail-page`}>
            <div className="shot" data-px={it.px} />
            <div className="cap"><span className="nm">{it.nm}</span><span className="ct">↗ {it.ct}</span></div>
          </a>
        ))}
      </div>

      <section className="ctaS"><div className="wrap reveal">
        <h2>다음 상세는<br /><em>당신 차례</em>입니다</h2>
        <p>지금 문의하면 24시간 안에 견적</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
