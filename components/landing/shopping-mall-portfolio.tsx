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
.aiosmp .back{font-family:var(--mono);font-size:12px;color:var(--fg3);display:inline-block;margin-bottom:18px;text-decoration:none}.aiosmp .back:hover{color:var(--gold)}
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
.aiosmp .card .top .code{flex:1;text-align:left;font-family:var(--mono);font-size:10.5px;color:var(--fg3);margin-left:8px}
.aiosmp .card .shot{aspect-ratio:4/3;position:relative;display:flex;align-items:center;justify-content:center}
.aiosmp .card .shot .concept{font-family:var(--frau);font-size:clamp(12px,1.8vw,16px);color:rgba(239,233,221,.55);text-align:center;padding:0 12px;line-height:1.45}
.aiosmp .card .shot .swatch{position:absolute;bottom:14px;left:50%;transform:translateX(-50%);width:32px;height:32px;border-radius:50%;border:2px solid rgba(239,233,221,.18)}
.aiosmp .card .cap{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;text-align:left}
.aiosmp .card .nm{font-family:var(--frau);font-size:16px;font-weight:500}
.aiosmp .card .ct{font-family:var(--mono);font-size:10px;color:var(--fg3);letter-spacing:.16em}
.aiosmp .card .badge{font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;padding:3px 8px;border-radius:999px;border:1px solid rgba(251,146,60,.35);color:var(--gold)}
@media(max-width:900px){.aiosmp .grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.aiosmp .grid{grid-template-columns:1fr 1fr;gap:12px}}
.aiosmp .ctaS{padding:clamp(60px,9vw,110px) 0;text-align:center}
.aiosmp .ctaS h2{font-family:var(--frau);font-weight:400;font-size:clamp(32px,5vw,58px);margin-bottom:18px;line-height:1.06}
.aiosmp .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiosmp .ctaS p{color:var(--fg2);margin-bottom:30px;font-size:clamp(14px,1.2vw,16.5px)}
.aiosmp .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;text-decoration:none}
`;

interface DesignItem {
  code: string;      // "D01"
  nm: string;        // "Minimal Mono"
  concept: string;   // 1줄 컨셉
  color: string;     // 대표 컬러 hex
  ct: string;        // 필터 카테고리 key
  // TODO(추후): 카페24 디자인센터/데모몰 URL 연결
  // 원본 경로: 솔로프리너/1_플랫폼관리/카페24/{NN_category}/{DXX}/v2/index.html
  demo?: string;
}

const ITEMS: DesignItem[] = [
  // ── 1인 창업 (01_solopreneur) ──────────────────────────────
  { code: "D01", nm: "Minimal Mono",        concept: "퇴사 후 첫 쇼핑몰, 흑백으로 단단하게",    color: "#111111", ct: "solopreneur" },
  { code: "D02", nm: "Soft Pastel",         concept: "취미를 비즈니스로, 다정한 첫인상",         color: "#FFE9DC", ct: "solopreneur" },
  { code: "D03", nm: "Bold Modern",         concept: "1인 브랜드, 자신감 있게 굵직하게",         color: "#FFD400", ct: "solopreneur" },
  // ── 식품/건강 (02_food_health) ─────────────────────────────
  { code: "D04", nm: "Natural Forest",      concept: "건강한 식탁, 숲에서 시작",                color: "#2D4A2B", ct: "food_health" },
  { code: "D05", nm: "Warm Bakery",         concept: "갓 구운 따뜻함, 손맛이 보이는 쇼핑몰",   color: "#B8541F", ct: "food_health" },
  { code: "D06", nm: "Premium Dark",        concept: "프리미엄 건강식품, 럭셔리 어두운 톤",     color: "#C9A96E", ct: "food_health" },
  // ── 라이브커머스 (03_live_commerce) ───────────────────────
  { code: "D07", nm: "Live Pulse",          concept: "지금 라이브 중 — 빨강 펄스 알람",         color: "#FF2D55", ct: "live_commerce" },
  { code: "D08", nm: "Studio Bright",       concept: "스튜디오 조명, 형광 그라데이션",           color: "#6E40FF", ct: "live_commerce" },
  { code: "D09", nm: "Trendy Pop",          concept: "Z세대 팝, 채도 높은 트렌디 컬러",          color: "#FF6B9D", ct: "live_commerce" },
  // ── 반려동물 (04_pet) ──────────────────────────────────────
  { code: "D10", nm: "Cozy Pet",            concept: "한 살부터 노견까지, 아이의 시간을 함께",   color: "#8FA886", ct: "pet" },
  { code: "D11", nm: "Premium Pet Maison",  concept: "정직한 재료, 럭셔리 펫 메종",             color: "#C9A96E", ct: "pet" },
  { code: "D12", nm: "Active Outdoor",      concept: "밖에서 더 강해지는 유대 — 액티브 펫 기어", color: "#1F4E3D", ct: "pet" },
  // ── 홈인테리어 (05_home_interior) ─────────────────────────
  { code: "D13", nm: "Neo Deco",            concept: "아르데코 부활 — 기하와 황동의 격조",       color: "#C9A96E", ct: "home_interior" },
  { code: "D14", nm: "Butter Yellow",       concept: "따뜻한 컬러풀, 집이 환해지는 쇼핑몰",     color: "#F5C518", ct: "home_interior" },
  { code: "D15", nm: "Cool Blue",           concept: "차분한 미니멀, 공간을 넓혀주는 톤",        color: "#5AAEDC", ct: "home_interior" },
  // ── 뷰티/화장품 (06_beauty) ────────────────────────────────
  { code: "D16", nm: "K-Beauty Chrome",     concept: "K뷰티 크롬홀로그램, 미래적 광채",          color: "#B8C8E0", ct: "beauty" },
  { code: "D17", nm: "Persimmon Pop",       concept: "페르시몬 컬러풀, 생기 넘치는 뷰티",        color: "#E8563A", ct: "beauty" },
  { code: "D18", nm: "Plum Noir",           concept: "플럼 누아, 다크 럭셔리 감성",              color: "#6B2D5E", ct: "beauty" },
];

const FILTERS = [
  { f: "all",          label: "전체",       emoji: "" },
  { f: "solopreneur",  label: "1인 창업",   emoji: "🚀" },
  { f: "food_health",  label: "식품·건강",  emoji: "🥗" },
  { f: "live_commerce",label: "라이브커머스",emoji: "🔴" },
  { f: "pet",          label: "반려동물",   emoji: "🐾" },
  { f: "home_interior",label: "홈인테리어", emoji: "🏠" },
  { f: "beauty",       label: "뷰티",       emoji: "✨" },
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
          <a className="back" href={`${base}/services/shopping-mall`}>← 쇼핑몰 소개로</a>
          <span className="kick">Shopping Mall · Portfolio</span>
          <h1>업종별<br /><em>카페24 디자인</em></h1>
          <p>6개 업종 × 18개 테마 — 카페24 디자인센터 등록 작업물</p>
          <div className="count">총 <b>{shown.length}</b>개 디자인</div>
        </div>
      </header>

      <div className="filters">
        {FILTERS.map((f) => (
          <button key={f.f} className={"chip" + (filter === f.f ? " on" : "")} onClick={() => setFilter(f.f)}>
            {f.emoji && <>{f.emoji} </>}{f.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {shown.map((it) => (
          // TODO(추후): it.demo가 생기면 href={it.demo ?? "#"}로 교체 — 카페24 디자인센터/데모몰 URL 연결
          <a key={it.code} className="card reveal" href="#"
            onClick={(e) => e.preventDefault()}
            title={`${it.code} ${it.nm} — 카페24 데모 연결 예정`}
          >
            <div className="top"><i /><i /><i /><span className="code">{it.code} · {it.nm}</span></div>
            <div className="shot" style={{ background: `linear-gradient(135deg, ${it.color}22, ${it.color}08)` }}>
              <span className="concept">{it.concept}</span>
              <span className="swatch" style={{ background: it.color }} />
            </div>
            <div className="cap">
              <span className="nm">{it.nm}</span>
              <span className="badge">준비중</span>
            </div>
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
