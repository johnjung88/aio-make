"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

/**
 * Marketing Hub — Console (그리드 라인 + 코너 픽셀 + 상단 admin bar)
 * 페이지 전체가 admin console. 그래프 페이퍼 그리드가 fixed로 깔리고,
 * 모든 섹션 frame에 코너 픽셀 마커. 하단 status bar 상시.
 */
const CSS = `
.aiomh{--bg:#080A0B;--bg2:#0F1213;--bg3:#0A0D0E;--fg:#EFE9DD;--fg2:#A8AFA9;--fg3:#5C645E;
  --line:rgba(139,224,194,.26);--line2:rgba(239,233,221,.06);--grid:rgba(139,224,194,.045);
  --gold:#C8A24A;--mint:#8BE0C2;--lime:#C6EE7A;--down:#E27B7B;
  --frau:var(--font-fraunces);--corm:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(46px,8.5vw,116px);--fs-h2:clamp(30px,5.2vw,68px);--fs-lead:clamp(15px,1.4vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1280px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;min-height:100vh;text-align:center;position:relative}
/* Graph-paper grid background — fixed, fills viewport */
.aiomh::before{content:"";position:fixed;inset:0;background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:32px 32px;background-position:center center;pointer-events:none;z-index:0}
/* Subtle scanline */
.aiomh::after{content:"";position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(139,224,194,.012) 3px,rgba(139,224,194,.012) 4px);pointer-events:none;z-index:1}
.aiomh > *{position:relative;z-index:5}
.aiomh *{box-sizing:border-box}
.aiomh a{text-decoration:none;color:inherit}
.aiomh .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiomh .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.32em;text-transform:uppercase;color:var(--mint)}
.aiomh .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}.aiomh .reveal.in{opacity:1;transform:none}
.aiomh .reveal.d1{transition-delay:.1s}.aiomh .reveal.d2{transition-delay:.2s}.aiomh .reveal.d3{transition-delay:.3s}
.aiomh .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--mint),var(--lime))}

/* Top admin bar (full width sticky-ish) */
.aiomh .tbar{padding:11px var(--sp-edge);border-bottom:1px solid var(--line2);font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--fg3);text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;background:var(--bg3);position:relative}
.aiomh .tbar .l{display:flex;align-items:center;gap:14px}
.aiomh .tbar .l span:not(.live){color:var(--fg3)}
.aiomh .tbar .live{display:inline-flex;align-items:center;gap:6px;color:var(--mint)}
.aiomh .tbar .live .d{width:7px;height:7px;border-radius:50%;background:var(--mint);box-shadow:0 0 0 3px rgba(139,224,194,.25);animation:aiomh-pulse 2s infinite}
@keyframes aiomh-pulse{0%,100%{opacity:1}50%{opacity:.55}}
/* Corner pixel markers (4 corners of viewport) */
.aiomh .corner{position:fixed;width:14px;height:14px;border:1px solid var(--mint);pointer-events:none;z-index:4;opacity:.5}
.aiomh .corner.tl{top:50px;left:14px;border-right:none;border-bottom:none}
.aiomh .corner.tr{top:50px;right:14px;border-left:none;border-bottom:none}
.aiomh .corner.bl{bottom:50px;left:14px;border-right:none;border-top:none}
.aiomh .corner.br{bottom:50px;right:14px;border-left:none;border-top:none}

/* Status bar — fixed bottom */
.aiomh .sbar{position:fixed;bottom:0;left:0;right:0;padding:8px var(--sp-edge);background:var(--bg3);border-top:1px solid var(--line2);font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:var(--fg3);text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;z-index:6}
.aiomh .sbar b{color:var(--mint);font-weight:400}
.aiomh .sbar span.dot{margin:0 10px;color:var(--fg3)}

/* Hero — KPIs as part of headline */
.aiomh .hero{padding:clamp(56px,8vw,100px) 0 clamp(40px,6vw,72px);position:relative}
.aiomh .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 50% 30%,rgba(139,224,194,.10),transparent 70%);pointer-events:none}
.aiomh .hero .wrap{position:relative}
.aiomh .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.96;letter-spacing:-.018em;margin-bottom:28px}
.aiomh .hero h1 em{font-family:var(--frau);font-style:normal;color:var(--mint);font-weight:600}
.aiomh .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:46ch;margin:0 auto 36px}
.aiomh .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiomh .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:0;background:var(--mint);color:#0E0D0B;border:1px solid var(--mint);letter-spacing:-.005em;transition:all .25s}
.aiomh .cta-pill:hover{background:transparent;color:var(--mint)}
.aiomh .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}

/* Console panel — frame with corner markers around each section block */
.aiomh .panel{position:relative;border:1px solid var(--line2);background:rgba(15,18,19,.6);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}
.aiomh .panel::before,.aiomh .panel::after,.aiomh .panel .pcr,.aiomh .panel .pcr2{position:absolute;width:9px;height:9px;border:1px solid var(--mint);content:""}
.aiomh .panel::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
.aiomh .panel::after{top:-1px;right:-1px;border-left:none;border-bottom:none}
.aiomh .panel .pcr{bottom:-1px;left:-1px;border-right:none;border-top:none;background:transparent}
.aiomh .panel .pcr2{bottom:-1px;right:-1px;border-left:none;border-top:none;background:transparent}
.aiomh .panel .pbar{padding:11px 22px;border-bottom:1px solid var(--line2);font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--fg3);text-transform:uppercase;display:flex;justify-content:space-between;align-items:center}
.aiomh .panel .pbar b{color:var(--mint);font-weight:400}

/* Live KPI strip */
.aiomh .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin:clamp(30px,4vw,48px) auto 0;max-width:1140px;text-align:left}
.aiomh .kpi{padding:24px 26px;border-right:1px solid var(--line2);position:relative}
.aiomh .kpi:last-child{border-right:none}
.aiomh .kpi .lbl{font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;color:var(--fg3);text-transform:uppercase;margin-bottom:10px}
.aiomh .kpi .num{font-family:var(--frau);font-size:clamp(26px,3.4vw,40px);line-height:1;color:var(--fg);margin-bottom:8px;letter-spacing:-.008em}
.aiomh .kpi .delta{font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--mint);display:flex;align-items:center;gap:6px}
.aiomh .kpi .delta.dn{color:var(--down)}
.aiomh .kpi .spark{margin-top:14px;height:32px;display:flex;align-items:flex-end;gap:3px}
.aiomh .kpi .spark .b{flex:1;background:linear-gradient(180deg,var(--mint),rgba(139,224,194,.18));border-radius:1px 1px 0 0;min-width:2px}
@media(max-width:880px){.aiomh .kpis{grid-template-columns:1fr 1fr}.aiomh .kpi:nth-child(2n){border-right:none}.aiomh .kpi:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

/* Sections */
.aiomh .sec{padding:var(--sp-sec) 0}
.aiomh .shead{margin-bottom:48px}
.aiomh .shead .kick{display:block;margin-bottom:16px}
.aiomh .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.04;margin-bottom:16px;letter-spacing:-.014em}
.aiomh .shead h2 em{font-family:var(--frau);font-style:normal;color:var(--mint);font-weight:600}
.aiomh .shead p{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:54ch;margin:0 auto}

/* Channels */
.aiomh .ch{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
.aiomh .chc{padding:30px 28px 26px;background:rgba(15,18,19,.7);border:1px solid var(--line2);text-align:left;transition:border-color .3s,transform .3s;position:relative;display:flex;flex-direction:column}
.aiomh .chc:hover{border-color:var(--mint);transform:translateY(-4px)}
.aiomh .chc::before,.aiomh .chc::after{content:"";position:absolute;width:7px;height:7px;border:1px solid var(--mint)}
.aiomh .chc::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
.aiomh .chc::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
.aiomh .chc .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.aiomh .chc .top .tag{font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:var(--mint);text-transform:uppercase}
.aiomh .chc .top .live{display:inline-flex;align-items:center;gap:5px;font-family:var(--mono);font-size:9px;color:var(--mint);letter-spacing:.14em;text-transform:uppercase}
.aiomh .chc .top .live .d{width:6px;height:6px;border-radius:50%;background:var(--mint)}
.aiomh .chc h3{font-family:var(--frau);font-size:clamp(22px,2.4vw,28px);font-weight:500;margin-bottom:8px;letter-spacing:-.008em}
.aiomh .chc h3 em{font-family:var(--frau);font-style:normal;color:var(--mint)}
.aiomh .chc .d{font-size:14px;line-height:1.8;color:var(--fg2);margin:0 0 22px}
.aiomh .chc .stat{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px}
.aiomh .chc .stat .s{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;color:var(--fg3);text-transform:uppercase}
.aiomh .chc .stat .s b{color:var(--mint);font-weight:400;font-family:var(--frau);font-size:16px;letter-spacing:.01em;margin-left:6px}
.aiomh .chc .chart{height:52px;border-top:1px solid var(--line2);padding-top:12px;margin-top:auto;position:relative;display:flex;align-items:flex-end;gap:4px}
.aiomh .chc .chart .b{flex:1;background:linear-gradient(180deg,var(--mint),rgba(139,224,194,.2));border-radius:1px 1px 0 0;min-width:2px}
@media(max-width:880px){.aiomh .ch{grid-template-columns:1fr}}

/* Report table */
.aiomh .rep{max-width:1100px;margin:48px auto 0}
.aiomh .rep table{width:100%;border-collapse:collapse;font-family:var(--pret);font-size:13.5px}
.aiomh .rep th{text-align:left;padding:14px 24px;color:var(--fg3);font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;font-weight:400;border-bottom:1px solid var(--line2)}
.aiomh .rep td{padding:16px 24px;border-bottom:1px solid var(--line2);color:var(--fg2)}
.aiomh .rep tr:last-child td{border-bottom:none}
.aiomh .rep td.r{text-align:right;font-family:var(--mono);font-size:13px;letter-spacing:.04em}
.aiomh .rep td.r.up{color:var(--mint)}
.aiomh .rep td.r.dn{color:var(--down)}
.aiomh .rep td.name{color:var(--fg);font-family:var(--frau);font-size:15px}
@media(max-width:680px){.aiomh .rep th,.aiomh .rep td{padding:12px 14px;font-size:12px}}

/* Ways */
.aiomh .ways{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);max-width:1100px;margin:32px auto 0;background:rgba(15,18,19,.6);position:relative}
.aiomh .ways::before,.aiomh .ways::after{content:"";position:absolute;width:8px;height:8px;border:1px solid var(--mint)}
.aiomh .ways::before{top:-1px;left:-1px;border-right:none;border-bottom:none}
.aiomh .ways::after{bottom:-1px;right:-1px;border-left:none;border-top:none}
.aiomh .way{padding:24px 18px;border-right:1px solid var(--line2);text-align:center}
.aiomh .way:last-child{border-right:none}
.aiomh .way .n{font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--mint);margin-bottom:10px;text-transform:uppercase}
.aiomh .way .t{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aiomh .way .d{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aiomh .ways{grid-template-columns:1fr 1fr}.aiomh .way:nth-child(2n){border-right:none}.aiomh .way:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

/* CTA */
.aiomh .ctaS{padding:var(--sp-sec) 0 calc(var(--sp-sec) + 40px);position:relative;overflow:hidden;text-align:center}
.aiomh .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 50% 50%,rgba(139,224,194,.12),transparent 70%)}
.aiomh .ctaS .wrap{position:relative}
.aiomh .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.98;margin-bottom:22px;letter-spacing:-.014em}
.aiomh .ctaS h2 em{font-family:var(--frau);font-style:normal;color:var(--mint);font-weight:600}
.aiomh .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const spark = (heights: number[]) => heights.map((h, i) => <div key={i} className="b" style={{ height: `${h}%` }} />);

export function MarketingHub({ locale }: { locale: string }) {
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
    <div className="aiomh" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="marketing" active="service" />

      <div className="tbar">
        <div className="l"><span>AIO · Growth Console</span><span>·</span><span>Workspace 2026Q2</span></div>
        <div className="live"><span className="d" /> LIVE · LAST SYNC 12s</div>
      </div>

      {/* Fixed corner markers */}
      <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />

      <header className="hero">
        <div className="wrap">
          <span className="kick">Marketing · 서비스 소개</span>
          <h1 style={{ marginTop: 22 }}>유입의 답은<br /><em>꾸준함</em>입니다</h1>
          <p className="lead">블로그·SNS·영상채널 — 매일 보이는 것이 한 달 뒤의 매출이 됩니다 · 측정되고 검증되는 운영으로</p>
          <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/marketing/team`}>팀원 소개</a></div>

          <div className="panel reveal d1" style={{ marginTop: 48 }}>
            <span className="pcr" /><span className="pcr2" />
            <div className="pbar"><span>module / live-kpis</span><span><b>● live</b> · 12s</span></div>
            <div className="kpis">
              <div className="kpi"><div className="lbl">평균 방문자</div><div className="num">128,420</div><div className="delta">▲ +42.0%  MoM</div><div className="spark">{spark([35, 42, 38, 52, 60, 58, 72, 78, 85, 92, 98])}</div></div>
              <div className="kpi"><div className="lbl">평균 전환율</div><div className="num">3.84%</div><div className="delta">▲ +0.9pt</div><div className="spark">{spark([22, 28, 30, 35, 32, 42, 48, 52, 56, 64, 70])}</div></div>
              <div className="kpi"><div className="lbl">평균 CPC</div><div className="num">₩ 318</div><div className="delta dn">▼ −22%</div><div className="spark">{spark([88, 82, 78, 70, 64, 58, 52, 48, 40, 34, 28])}</div></div>
              <div className="kpi"><div className="lbl">평균 ROAS</div><div className="num">412%</div><div className="delta">▲ +1.4×</div><div className="spark">{spark([28, 32, 38, 44, 52, 58, 64, 72, 78, 86, 94])}</div></div>
            </div>
          </div>
        </div>
      </header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Channels · 03</span><h2>세 가지 <em>운영 채널</em></h2><p>채널은 다르지만 원칙은 같습니다 — 꾸준함 · 측정 · 개선</p></div>
        <div className="ch">
          <div className="chc reveal d1">
            <div className="top"><span className="tag">01 · BLOG</span><span className="live"><span className="d" /> Live</span></div>
            <h3>블로그 <em>운영대행</em></h3>
            <p className="d">네이버·티스토리 — 월 8~12편 · SEO 키워드 → 글 → 발행 → 추적까지</p>
            <div className="stat"><span className="s">월 발행 <b>10</b></span><span className="s">평균 노출 <b>+38%</b></span></div>
            <div className="chart">{spark([22, 28, 32, 36, 42, 38, 46, 52, 58, 62, 68, 74])}</div>
          </div>
          <div className="chc reveal d2">
            <div className="top"><span className="tag">02 · SNS</span><span className="live"><span className="d" /> Live</span></div>
            <h3>SNS <em>운영대행</em></h3>
            <p className="d">인스타·릴스·틱톡 — 월 20~30컷 · 컨셉 → 촬영·편집 → 발행 → 반응 분석</p>
            <div className="stat"><span className="s">월 컷 <b>25</b></span><span className="s">평균 리치 <b>+62%</b></span></div>
            <div className="chart">{spark([18, 22, 30, 38, 42, 50, 48, 56, 64, 70, 76, 82])}</div>
          </div>
          <div className="chc reveal d3">
            <div className="top"><span className="tag">03 · VIDEO CH.</span><span className="live"><span className="d" /> Live</span></div>
            <h3>영상채널 <em>운영대행</em></h3>
            <p className="d">유튜브·숏폼 — 월 4~8편 · 기획 → 촬영 → 편집·자막 → 썸네일 → 분석</p>
            <div className="stat"><span className="s">월 편 <b>6</b></span><span className="s">평균 시청 <b>+74%</b></span></div>
            <div className="chart">{spark([14, 18, 24, 30, 34, 40, 48, 54, 62, 70, 78, 88])}</div>
          </div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Weekly Report — Sample</span><h2>매주 <em>리포트</em></h2><p>월요일마다 보내드리는 KPI 표 — 실제 운영 데이터 그대로</p></div>
        <div className="panel rep reveal d1">
          <span className="pcr" /><span className="pcr2" />
          <div className="pbar"><span>module / weekly-report</span><span><b>2026 · WK 21</b></span></div>
          <table>
            <thead>
              <tr><th>Channel</th><th>KPI</th><th style={{ textAlign: "right" }}>This Wk</th><th style={{ textAlign: "right" }}>Δ vs Prev</th></tr>
            </thead>
            <tbody>
              <tr><td className="name">블로그 (Naver)</td><td>방문자</td><td className="r">12,840</td><td className="r up">▲ +18.4%</td></tr>
              <tr><td className="name">블로그 (Naver)</td><td>유입 검색어</td><td className="r">62 / 78</td><td className="r up">▲ +14</td></tr>
              <tr><td className="name">Instagram</td><td>도달</td><td className="r">48,210</td><td className="r up">▲ +32%</td></tr>
              <tr><td className="name">Instagram</td><td>저장 수</td><td className="r">1,840</td><td className="r up">▲ +28%</td></tr>
              <tr><td className="name">YouTube</td><td>시청 시간 (h)</td><td className="r">320h</td><td className="r up">▲ +21%</td></tr>
              <tr><td className="name">YouTube</td><td>구독자</td><td className="r">+184</td><td className="r dn">▼ −6.0%</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>운영 <em>원칙</em></h2></div>
        <div className="ways reveal d1">
          <div className="way"><div className="n">01</div><div className="t">주간 리포트</div><div className="d">매주 월요일 KPI 공유</div></div>
          <div className="way"><div className="n">02</div><div className="t">월 종합</div><div className="d">월말 종합 + 다음 달 계획</div></div>
          <div className="way"><div className="n">03</div><div className="t">데이터 기반</div><div className="d">GA4·서치콘솔·픽셀 연동</div></div>
          <div className="way"><div className="n">04</div><div className="t">월 단위 계약</div><div className="d">최소 3개월 / 해지 30일 전 통보</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>꾸준히 보이는<br /><em>운영</em>이 필요한가요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 1주 안에 첫 발행</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      {/* Bottom status bar — fixed */}
      <div className="sbar">
        <span><b>AIO/MK</b><span className="dot">·</span>console v0.26<span className="dot">·</span>uptime 99.8%</span>
        <span>{`{ status: "monitoring" }`}<span className="dot">·</span><b>{`◉ live`}</b></span>
      </div>

      <AioFooter locale={locale} />
    </div>
  );
}
