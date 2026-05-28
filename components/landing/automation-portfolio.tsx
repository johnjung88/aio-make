"use client";
import { useEffect, useRef, useState } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aioamp{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--mint:#8BE0C2;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(38px,7vw,82px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;text-align:center;min-height:100vh}
.aioamp .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aioamp .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--gold),var(--mint))}
.aioamp .reveal{opacity:0;transform:translateY(22px);transition:opacity .9s,transform .9s}.aioamp .reveal.in{opacity:1;transform:none}
.aioamp .head{padding:clamp(70px,11vw,140px) 0 clamp(40px,6vw,70px)}
.aioamp .head .kick{font-family:var(--mono);font-size:11px;letter-spacing:.34em;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:18px}
.aioamp .head h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:18px}
.aioamp .head h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aioamp .head p{font-size:clamp(14.5px,1.25vw,17px);color:var(--fg2);max-width:48ch;margin:0 auto 18px;line-height:1.85}
.aioamp .head .count{font-family:var(--mono);font-size:11px;color:var(--fg3);letter-spacing:.12em}
.aioamp .head .count b{color:var(--gold)}
.aioamp .filters{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-bottom:36px;padding:0 var(--sp-edge)}
.aioamp .chip{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg3);border:1px solid var(--line2);background:transparent;padding:9px 16px;border-radius:999px;cursor:pointer}
.aioamp .chip.on{color:#0E0D0B;background:var(--gold);border-color:var(--gold)}
.aioamp .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:0 var(--sp-edge);max-width:var(--maxw);margin:0 auto clamp(60px,8vw,100px)}
.aioamp .card{display:block;text-align:left;background:#0a0908;border:1px solid var(--line2);border-radius:12px;padding:22px;text-decoration:none;color:inherit;transition:border-color .3s,transform .3s;font-family:var(--mono);font-size:12.5px;line-height:1.85;min-height:240px}
.aioamp .card:hover{border-color:var(--mint);transform:translateY(-4px)}
.aioamp .card .tag{display:inline-block;font-size:9.5px;color:var(--mint);letter-spacing:.18em;margin-bottom:14px}
.aioamp .card h3{font-family:var(--frau);font-size:18px;color:var(--fg);margin-bottom:10px;font-weight:500;letter-spacing:-.005em}
.aioamp .card .c{color:var(--fg3)}
.aioamp .card .v{color:var(--mint)}
.aioamp .card .meta{margin-top:18px;padding-top:14px;border-top:1px solid var(--line2);font-size:10.5px;color:var(--fg3);letter-spacing:.1em}
@media(max-width:900px){.aioamp .grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.aioamp .grid{grid-template-columns:1fr}}
.aioamp .ctaS{padding:clamp(60px,9vw,110px) 0;text-align:center}
.aioamp .ctaS h2{font-family:var(--frau);font-weight:400;font-size:clamp(32px,5vw,58px);margin-bottom:18px;line-height:1.06}
.aioamp .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aioamp .ctaS p{color:var(--fg2);margin-bottom:30px;font-size:clamp(14px,1.2vw,16.5px)}
.aioamp .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;text-decoration:none}
`;

const ITEMS = [
  { tag: "BOT", title: "주문 알림 봇", desc: ["// 카페24 → 텔레그램", "$ ./order-alert", "→ 142건/일 자동 보고"], cat: "Bot", meta: "9분 → 9초" },
  { tag: "SHEET", title: "정산 시트 자동 생성", desc: ["// 어제 매출 → 엑셀", "$ python sales.py", "→ 30개 시트 자동 생성"], cat: "Sheet", meta: "월 60시간 절약" },
  { tag: "CRAWL", title: "경쟁사 가격 모니터", desc: ["// 상위 5개사", "$ ./price-watch", "→ 변동시 알림"], cat: "Crawl", meta: "5분/일 → 0" },
  { tag: "MACRO", title: "엑셀 매크로 (인사·정산)", desc: ["// 매주 월요일 09:00", "$ macro_run.bat", "→ 4시간 → 4분"], cat: "Macro", meta: "주 4시간 단축" },
  { tag: "DESKTOP", title: "재고 관리 데스크탑", desc: ["// Windows GUI", "→ 바코드 스캔 입력", "→ 일별 리포트"], cat: "Desktop", meta: "직원 1명 ↓" },
  { tag: "API", title: "노션·시트 양방향 연동", desc: ["// Notion ↔ Sheets", "$ ./sync", "→ 5분마다 자동"], cat: "API", meta: "이중 입력 제거" },
  { tag: "BOT", title: "리뷰 모음·번역 봇", desc: ["// 아마존·라쿠텐", "$ ./reviews", "→ 한 번에 100건"], cat: "Bot", meta: "수동 6h → 6m" },
  { tag: "CRAWL", title: "공고 모니터링", desc: ["// 12개 사이트", "$ ./watcher", "→ 신규 공고 즉시"], cat: "Crawl", meta: "기회 누락 0" },
  { tag: "SHEET", title: "예산 분석 대시보드", desc: ["// 월간 카드·계좌", "$ ./finance", "→ 카테고리별 자동 분류"], cat: "Sheet", meta: "월 16h 절약" },
];

const FILTERS = [
  { f: "all", label: "전체" },
  { f: "Bot", label: "봇·알림" },
  { f: "Sheet", label: "시트·엑셀" },
  { f: "Crawl", label: "크롤링" },
  { f: "Macro", label: "매크로" },
];

export function AutomationPortfolio({ locale }: { locale: string }) {
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
  const shown = filter === "all" ? ITEMS : ITEMS.filter((i) => i.cat === filter);
  return (
    <div className="aioamp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="automation-app" active="portfolio" />

      <header className="head">
        <div className="wrap">
          <span className="kick">Automation · Portfolio</span>
          <h1>실제 돌아가는<br /><em>자동화</em>들</h1>
          <p>매일 누군가의 시간을 9분, 6시간, 4시간씩 돌려준 코드들</p>
          <div className="count">총 <b>{shown.length}</b>개 시스템</div>
        </div>
      </header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.f} className={"chip" + (filter === f.f ? " on" : "")} onClick={() => setFilter(f.f)}>{f.label}</button>
        ))}
      </div>

      <div className="grid">
        {shown.map((it, i) => (
          <a key={i} className="card reveal" href={`${base}/services/automation-app`}>
            <span className="tag">[{it.tag}]</span>
            <h3>{it.title}</h3>
            {it.desc.map((line, j) => (
              <div key={j}><span className={line.startsWith("//") ? "c" : line.startsWith("$") ? "v" : "c"}>{line}</span></div>
            ))}
            <div className="meta">⏱ {it.meta}</div>
          </a>
        ))}
      </div>

      <section className="ctaS"><div className="wrap reveal">
        <h2>다음 자동화는<br /><em>당신 차례</em>입니다</h2>
        <p>지금 문의하면 24시간 안에 기준 견적</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
