"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

/**
 * Video Hub — Pure Cinema 흑백 캔버스
 * 필름 그레인 노이즈 + 코너 비네트 + 미세한 scanline + 항상 letterbox.
 * 컬러는 풀블랙 + amber spotlight + 따뜻한 골드 액센트만.
 */
const CSS = `
.aiovh{--bg:#000;--bg2:#0a0908;--bg3:#0e0c0a;--fg:#EFE9DD;--fg2:#A8A092;--fg3:#5C564B;
  --line:rgba(232,163,64,.32);--line2:rgba(239,233,221,.08);
  --gold:#C8A24A;--amber:#E8A340;--ember:#F4B45A;--rec:#FF3D00;
  --frau:var(--font-fraunces);--corm:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(52px,9.5vw,140px);--fs-h2:clamp(30px,5.4vw,70px);--fs-lead:clamp(15px,1.4vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1280px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;min-height:100vh;text-align:center;position:relative;overflow-x:hidden}
/* Film grain noise — fixed overlay */
.aiovh::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:2;opacity:.18;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.7' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px 200px}
/* Scanlines — subtle */
.aiovh::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:3;background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0,rgba(0,0,0,.18) 1px,transparent 1px,transparent 3px);opacity:.45}
/* Edge vignette */
.aiovh .vig{position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse 80% 70% at 50% 50%,transparent 50%,rgba(0,0,0,.85) 100%)}
.aiovh > *{position:relative;z-index:5}
.aiovh *{box-sizing:border-box}
.aiovh a{text-decoration:none;color:inherit}
.aiovh .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiovh .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.36em;text-transform:uppercase;color:var(--amber)}
.aiovh .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}.aiovh .reveal.in{opacity:1;transform:none}
.aiovh .reveal.d1{transition-delay:.1s}.aiovh .reveal.d2{transition-delay:.2s}.aiovh .reveal.d3{transition-delay:.3s}
.aiovh .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--ember),var(--amber))}

/* Section letterbox bars (every section gets them subtly) */
.aiovh .letterbox{position:relative}
.aiovh .letterbox::before,.aiovh .letterbox::after{content:"";position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,var(--line) 12%,var(--line) 88%,transparent 100%)}
.aiovh .letterbox::before{top:0}
.aiovh .letterbox::after{bottom:0}

/* Cinema hero — full bleed with letterbox bars */
.aiovh .cine{position:relative;min-height:90vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
.aiovh .cine::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 50% 45% at 50% 50%,rgba(232,163,64,.22),transparent 65%);pointer-events:none}
.aiovh .cine .bar{position:absolute;left:0;right:0;height:clamp(56px,8vh,96px);background:#000;z-index:2;display:flex;align-items:center;padding:0 var(--sp-edge);font-family:var(--mono);font-size:10.5px;letter-spacing:.24em;color:var(--fg3);text-transform:uppercase}
.aiovh .cine .bar.t{top:0;border-bottom:1px solid var(--line2)}
.aiovh .cine .bar.b{bottom:0;border-top:1px solid var(--line2);justify-content:space-between}
.aiovh .cine .bar .l,.aiovh .cine .bar .r{flex:1}
.aiovh .cine .bar .r{text-align:right}
.aiovh .cine .bar .c{flex:0 0 auto;color:var(--amber)}
.aiovh .cine .wrap{position:relative;z-index:1;padding-top:60px;padding-bottom:60px}
.aiovh .cine h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.95;letter-spacing:-.02em;margin-bottom:30px;text-shadow:0 4px 50px rgba(232,163,64,.18)}
.aiovh .cine h1 em{font-family:var(--frau);font-style:normal;color:var(--amber);font-weight:600}
.aiovh .cine .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:46ch;margin:0 auto 40px}
.aiovh .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiovh .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:0;background:var(--amber);color:#000;letter-spacing:.02em;border:1px solid var(--amber);transition:all .25s}
.aiovh .cta-pill:hover{background:transparent;color:var(--amber)}
.aiovh .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aiovh .runtime{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10.5px;letter-spacing:.26em;color:var(--amber);text-transform:uppercase;margin-bottom:24px;border:1px solid var(--line);padding:6px 14px;border-radius:999px}
.aiovh .runtime .dot{width:7px;height:7px;border-radius:50%;background:var(--rec);box-shadow:0 0 0 4px rgba(255,61,0,.2);animation:aiovh-blink 1.5s infinite}
@keyframes aiovh-blink{0%,100%{opacity:1}50%{opacity:.35}}

/* Sections — every section is a "scene" with subtle frame */
.aiovh .sec{padding:var(--sp-sec) 0;position:relative}
.aiovh .sec.dim{background:linear-gradient(180deg,transparent 0%,var(--bg2) 30%,var(--bg2) 70%,transparent 100%)}
.aiovh .shead{margin-bottom:48px}
.aiovh .shead .kick{display:block;margin-bottom:16px}
.aiovh .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.04;margin-bottom:16px;letter-spacing:-.014em}
.aiovh .shead h2 em{font-family:var(--frau);font-style:normal;color:var(--amber);font-weight:600}
.aiovh .shead p{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:54ch;margin:0 auto}

/* Featured Reel — single 21:9 full bleed cinema frame */
.aiovh .reel{position:relative;aspect-ratio:21/9;max-width:1180px;margin:0 auto;border:1px solid var(--line);background:linear-gradient(135deg,rgba(232,163,64,.28) 0%,rgba(200,162,74,.14) 40%,#000 100%);overflow:hidden}
.aiovh .reel::before{content:"";position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");opacity:.4;mix-blend-mode:overlay;pointer-events:none}
.aiovh .reel .crn{position:absolute;width:24px;height:24px;border:1px solid var(--amber)}
.aiovh .reel .crn.tl{top:14px;left:14px;border-right:none;border-bottom:none}
.aiovh .reel .crn.tr{top:14px;right:14px;border-left:none;border-bottom:none}
.aiovh .reel .crn.bl{bottom:14px;left:14px;border-right:none;border-top:none}
.aiovh .reel .crn.br{bottom:14px;right:14px;border-left:none;border-top:none}
.aiovh .reel .play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:clamp(72px,10vw,128px);height:clamp(72px,10vw,128px);border:1px solid var(--amber);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.5);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);z-index:2}
.aiovh .reel .play::after{content:"";display:block;width:0;height:0;border-left:clamp(20px,3vw,36px) solid var(--amber);border-top:clamp(14px,2vw,24px) solid transparent;border-bottom:clamp(14px,2vw,24px) solid transparent;margin-left:8px}
.aiovh .reel .tc{position:absolute;left:24px;top:24px;font-family:var(--mono);font-size:11px;color:var(--amber);letter-spacing:.18em;text-transform:uppercase;z-index:2}
.aiovh .reel .tc::before{content:"●";color:var(--rec);margin-right:8px;animation:aiovh-blink 1.5s infinite}
.aiovh .reel .meta{position:absolute;right:24px;bottom:48px;font-family:var(--mono);font-size:10.5px;color:var(--fg3);letter-spacing:.18em;text-align:right;line-height:1.85;z-index:2}
.aiovh .reel .meta b{color:var(--amber);font-weight:400;letter-spacing:.22em}
.aiovh .reel .scrub{position:absolute;left:24px;right:24px;bottom:18px;height:2px;background:rgba(239,233,221,.18);z-index:2}
.aiovh .reel .scrub::after{content:"";position:absolute;left:0;top:0;bottom:0;width:38%;background:var(--amber)}
.aiovh .reel .scrub::before{content:"";position:absolute;left:38%;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 4px rgba(232,163,64,.25)}

/* Scenes — 4 short-form platforms (Instagram Reels / TikTok / Facebook Reels / YouTube Shorts) — 같은 레이아웃, chrome만 다름 */
.aiovh .scenes{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:48px}
.aiovh .scene{position:relative;display:flex;flex-direction:column;border:1px solid var(--line2);overflow:hidden;background:var(--bg2);text-align:left;transition:border-color .3s,transform .3s}
.aiovh .scene:hover{border-color:var(--amber);transform:translateY(-4px)}

/* Common short-form vertical mock */
.aiovh .scene .mock{flex:0 0 auto;position:relative;overflow:hidden;background:#000;aspect-ratio:9/16;width:100%}
.aiovh .scene .mock .bg{position:absolute;inset:0}
.aiovh .scene .mock .bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,transparent 30%,transparent 60%,rgba(0,0,0,.85) 100%)}

/* Platform chip (top-right) — small badge with logo */
.aiovh .scene .pchip{position:absolute;top:10px;right:10px;display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:6px;font-family:Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;color:#fff;letter-spacing:.02em;z-index:3;background:rgba(0,0,0,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}

/* Action stack (right) — same position/structure across all */
.aiovh .scene .stack{position:absolute;right:8px;bottom:78px;display:flex;flex-direction:column;align-items:center;gap:14px;z-index:3;color:#fff;font-family:Helvetica,Arial,sans-serif}
.aiovh .scene .stack .av{width:34px;height:34px;border-radius:50%;border:2px solid #fff;position:relative;flex-shrink:0;background:#E8A340}
.aiovh .scene .stack .av::after{content:"+";position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:50%;background:#ff3050;color:#fff;font-size:11px;line-height:14px;text-align:center;border:1.5px solid #000;font-weight:700}
.aiovh .scene .stack .ic{display:flex;flex-direction:column;align-items:center}
.aiovh .scene .stack .ic .em{font-size:22px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6))}
.aiovh .scene .stack .ic .n{font-size:10px;margin-top:3px;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,.6)}
.aiovh .scene .stack .disc{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at center,#666 0,#222 50%,#000 60%,#444 70%,#000 100%);border:1px solid rgba(255,255,255,.2);animation:aiovh-spin 8s linear infinite}
@keyframes aiovh-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

/* Bottom caption block */
.aiovh .scene .cap{position:absolute;left:12px;right:60px;bottom:14px;color:#fff;z-index:3;font-family:Helvetica,Arial,sans-serif;text-shadow:0 1px 3px rgba(0,0,0,.5)}
.aiovh .scene .cap .un{font-size:11px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:4px}
.aiovh .scene .cap .un .v{font-weight:500;font-size:10px;opacity:.8}
.aiovh .scene .cap .tx{font-size:10.5px;line-height:1.4;opacity:.95;margin-bottom:6px}
.aiovh .scene .cap .mu{display:inline-flex;align-items:center;gap:5px;font-size:9.5px;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.15);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}

/* Bottom AIO footer (검정 라벨 영역) */
.aiovh .scene .sfoot{padding:14px 16px 18px;background:#000;border-top:1px solid var(--line2);min-height:108px;display:flex;flex-direction:column;justify-content:flex-start}
.aiovh .scene .sfoot .tc{font-family:var(--mono);font-size:9.5px;color:var(--amber);letter-spacing:.2em;margin-bottom:6px;text-transform:uppercase}
.aiovh .scene .sfoot h3{font-family:var(--frau);font-size:clamp(17px,1.8vw,22px);font-weight:500;line-height:1.15;margin-bottom:4px;color:var(--fg);letter-spacing:-.005em}
.aiovh .scene .sfoot h3 em{font-family:var(--frau);font-style:normal;color:var(--amber)}
.aiovh .scene .sfoot p{font-size:11.5px;color:var(--fg2);line-height:1.55;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:calc(11.5px * 1.55 * 2)}

/* === Platform A: INSTAGRAM REELS — 핑크/오렌지/퍼플 그라데이션 === */
.aiovh .scene.a .mock .bg{background:linear-gradient(160deg,#f09433 0%,#dc2743 35%,#bc1888 70%,#0a0a0a 100%)}
.aiovh .scene.a .pchip{background:linear-gradient(135deg,#f09433,#e6683c,#dc2743,#bc1888)}
.aiovh .scene.a .pchip::before{content:"◉";margin-right:1px;font-size:11px}

/* === Platform B: TIKTOK — 검정/민트/핑크 액센트 === */
.aiovh .scene.b .mock .bg{background:radial-gradient(ellipse at 30% 30%,rgba(37,244,238,.18),transparent 55%),radial-gradient(ellipse at 70% 70%,rgba(254,44,85,.18),transparent 55%),#000}
.aiovh .scene.b .pchip{background:#000;border:1px solid rgba(255,255,255,.18)}
.aiovh .scene.b .pchip::before{content:"♪";color:#fe2c55;font-size:13px;margin-right:1px;text-shadow:1.5px 0 0 #25f4ee}

/* === Platform C: FACEBOOK REELS — 파란 액센트 === */
.aiovh .scene.c .mock .bg{background:linear-gradient(165deg,#1877f2 0%,#0a3a8c 50%,#000 100%)}
.aiovh .scene.c .pchip{background:#1877f2}
.aiovh .scene.c .pchip::before{content:"f";font-family:Georgia,serif;font-weight:900;font-style:normal;font-size:13px;margin-right:1px}
.aiovh .scene.c .stack .av{background:#1877f2}

/* === Platform D: YOUTUBE SHORTS — 빨간 액센트 === */
.aiovh .scene.d .mock .bg{background:linear-gradient(180deg,rgba(232,163,64,.25) 0%,#1a1a1a 50%,#000 100%)}
.aiovh .scene.d .pchip{background:#fff;color:#000}
.aiovh .scene.d .pchip::before{content:"▶";color:#ff0000;font-size:11px;margin-right:1px}
.aiovh .scene.d .stack .av{background:linear-gradient(135deg,#ff0000,#cc0000)}
.aiovh .scene.d .stack .av::after{display:none}

@media(max-width:880px){.aiovh .scenes{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.aiovh .scenes{grid-template-columns:1fr}}

/* Pricing — minimal cinematic */
.aiovh .pkg{max-width:560px;margin:0 auto;border:1px solid var(--line);padding:36px 30px;text-align:center;background:rgba(232,163,64,.04)}
.aiovh .pkg .lbl{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--amber);margin-bottom:12px;text-transform:uppercase}
.aiovh .pkg .num{font-family:var(--frau);font-size:clamp(28px,4vw,40px);margin-bottom:8px}
.aiovh .pkg .num em{font-style:normal;color:var(--amber)}
.aiovh .pkg .desc{font-size:13.5px;color:var(--fg2);line-height:1.8;margin-top:10px;max-width:36ch;margin-left:auto;margin-right:auto}

/* Process — scrubber timeline */
.aiovh .tl{position:relative;max-width:880px;margin:32px auto 0;padding:30px 18px 18px}
.aiovh .tl::before{content:"";position:absolute;left:14px;right:14px;top:46px;height:1px;background:var(--line)}
.aiovh .tlrow{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;position:relative}
.aiovh .tlc{position:relative;padding-top:34px;text-align:center}
.aiovh .tlc::before{content:"";position:absolute;left:50%;top:0;transform:translateX(-50%);width:12px;height:12px;border-radius:50%;background:var(--amber);z-index:2;box-shadow:0 0 0 4px #000}
.aiovh .tlc .tc{font-family:var(--mono);font-size:10.5px;color:var(--amber);letter-spacing:.18em;margin-bottom:6px}
.aiovh .tlc h4{font-family:var(--frau);font-size:18px;font-weight:500;margin-bottom:6px}
.aiovh .tlc p{font-size:12.5px;line-height:1.7;color:var(--fg2);max-width:22ch;margin:0 auto}
@media(max-width:720px){.aiovh .tlrow{grid-template-columns:1fr 1fr;row-gap:36px}.aiovh .tl::before{display:none}}

/* CTA */
.aiovh .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden;text-align:center}
.aiovh .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 50% 50%,rgba(232,163,64,.20),transparent 70%)}
.aiovh .ctaS .wrap{position:relative}
.aiovh .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.98;margin-bottom:22px;letter-spacing:-.014em}
.aiovh .ctaS h2 em{font-family:var(--frau);font-style:normal;color:var(--amber);font-weight:600}
.aiovh .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

export function VideoHub({ locale }: { locale: string }) {
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
    <div className="aiovh" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <span className="vig" />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="video" active="service" />

      {/* Cinema hero */}
      <header className="cine">
        <div className="bar t"><span className="l">AIO · CINEMA</span><span className="c">A · I · O</span><span className="r">2026 · ISSUE 03</span></div>
        <div className="wrap">
          <div className="runtime"><span className="dot" /> NOW SHOWING · RUNTIME 03:00</div>
          <h1>한 컷이<br /><em>전부</em>입니다</h1>
          <p className="lead">브랜드·SNS·마케팅·유튜브 — 첫 3초가 멈출지 말지를 결정합니다 · 머무르게 만드는 컷으로</p>
          <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 ▶</a><a className="cta-link" href={`${base}/services/video/team`}>팀원 소개</a></div>
        </div>
        <div className="bar b"><span className="l">REEL · DURATION 03 : 00 : 00</span><span className="c">● REC</span><span className="r">24 FPS · 4K</span></div>
      </header>

      {/* Featured reel */}
      <section className="sec letterbox">
        <div className="wrap">
          <div className="shead reveal"><span className="kick">Featured Reel</span><h2>이번 분기 <em>리일</em></h2><p>최근 작업한 브랜드·SNS·유튜브 컷들 중 한 컷</p></div>
          <div className="reel reveal d1">
            <span className="crn tl" /><span className="crn tr" /><span className="crn bl" /><span className="crn br" />
            <span className="tc">REC · 00:01:23</span>
            <span className="meta"><b>FEATURED REEL</b><br />Brand · 60s · 4K</span>
            <div className="play" aria-label="Play reel" />
            <div className="scrub" />
          </div>
        </div>
      </section>

      {/* Scenes — services as posters */}
      <section className="sec dim letterbox">
        <div className="wrap">
          <div className="shead reveal"><span className="kick">Four Platforms</span><h2>네 곳의 <em>화면</em></h2><p>인스타·틱톡·페이스북·유튜브 — 플랫폼마다 호흡과 비율, 후킹 포인트가 다릅니다</p></div>
          <div className="scenes">

            {/* Card 1 — INSTAGRAM REELS */}
            <div className="scene a reveal d1">
              <div className="mock">
                <div className="bg" />
                <span className="pchip">Reels</span>
                <div className="stack">
                  <span className="av" />
                  <span className="ic"><span className="em">♥</span><span className="n">28.4K</span></span>
                  <span className="ic"><span className="em">💬</span><span className="n">412</span></span>
                  <span className="ic"><span className="em">↗</span><span className="n">공유</span></span>
                  <span className="disc" />
                </div>
                <div className="cap">
                  <div className="un">aio_studio<span className="v">· 팔로우</span></div>
                  <div className="tx">한 컷이 전부입니다 ✨ #릴스 #브랜딩</div>
                  <span className="mu">🎵 Original audio · aio_studio</span>
                </div>
              </div>
              <div className="sfoot">
                <div className="tc">Platform 01 · Instagram Reels</div>
                <h3>인스타 <em>릴스</em></h3>
                <p>브랜드·라이프스타일·후킹 컷 — 알고리즘이 좋아하는 흐름으로</p>
              </div>
            </div>

            {/* Card 2 — TIKTOK */}
            <div className="scene b reveal d2">
              <div className="mock">
                <div className="bg" />
                <span className="pchip">TikTok</span>
                <div className="stack">
                  <span className="av" />
                  <span className="ic"><span className="em">♥</span><span className="n">128K</span></span>
                  <span className="ic"><span className="em">💬</span><span className="n">2,840</span></span>
                  <span className="ic"><span className="em">↗</span><span className="n">42K</span></span>
                  <span className="disc" />
                </div>
                <div className="cap">
                  <div className="un">@aio_studio</div>
                  <div className="tx">첫 1초에 잡습니다 #fyp #쇼츠 #브랜딩</div>
                  <span className="mu">🎵 trending · 12.4M videos</span>
                </div>
              </div>
              <div className="sfoot">
                <div className="tc">Platform 02 · TikTok</div>
                <h3><em>틱톡</em> 콘텐츠</h3>
                <p>트렌드를 타는 후킹 컷 — 첫 1초에 멈추게, 끝까지 보게</p>
              </div>
            </div>

            {/* Card 3 — FACEBOOK REELS */}
            <div className="scene c reveal d3">
              <div className="mock">
                <div className="bg" />
                <span className="pchip">Reels</span>
                <div className="stack">
                  <span className="av" />
                  <span className="ic"><span className="em">👍</span><span className="n">8.2K</span></span>
                  <span className="ic"><span className="em">💬</span><span className="n">186</span></span>
                  <span className="ic"><span className="em">↗</span><span className="n">공유</span></span>
                  <span className="disc" />
                </div>
                <div className="cap">
                  <div className="un">AIO Studio<span className="v">· Sponsored</span></div>
                  <div className="tx">광고비 대비 4.1× ROAS — 다음 한 클릭을 만드는 영상</div>
                  <span className="mu">🎵 Brand audio · aio</span>
                </div>
              </div>
              <div className="sfoot">
                <div className="tc">Platform 03 · Facebook</div>
                <h3>페이스북 <em>릴스</em></h3>
                <p>광고·전환 영상 — Sponsored 노출에 최적화된 호흡과 컷</p>
              </div>
            </div>

            {/* Card 4 — YOUTUBE SHORTS */}
            <div className="scene d reveal d1">
              <div className="mock">
                <div className="bg" />
                <span className="pchip">Shorts</span>
                <div className="stack">
                  <span className="av" />
                  <span className="ic"><span className="em">👍</span><span className="n">52K</span></span>
                  <span className="ic"><span className="em">💬</span><span className="n">1.2K</span></span>
                  <span className="ic"><span className="em">↗</span><span className="n">공유</span></span>
                  <span className="disc" />
                </div>
                <div className="cap">
                  <div className="un">AIO Studio<span className="v">· 구독</span></div>
                  <div className="tx">매일 9분 단축한 워크플로우 [Behind] #shorts</div>
                  <span className="mu">🎵 워크플로우 · AIO</span>
                </div>
              </div>
              <div className="sfoot">
                <div className="tc">Platform 04 · YouTube Shorts</div>
                <h3>유튜브 <em>숏츠</em></h3>
                <p>채널 운영용 숏폼 — 구독·체류 시간 모두 끌어올리는 컷</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing pkg */}
      <section className="sec letterbox">
        <div className="wrap">
          <div className="shead reveal"><span className="kick">Pricing · 준비 중</span><h2>가격은 <em>상담 후</em></h2><p>분량·촬영 유무·소스 사용 범위에 따라 다릅니다 · 정식 가격표는 곧 공개</p></div>
          <div className="pkg reveal d1">
            <div className="lbl">기준 가격대 — 상담 후 견적</div>
            <div className="num"><em>49.9 ~ 199</em> 만원</div>
            <p className="desc">SNS 숏폼 한 편부터 브랜드 영상 풀패키지까지 — 의뢰 내용에 맞춰</p>
          </div>
        </div>
      </section>

      {/* Process — scrubber timeline */}
      <section className="sec dim letterbox">
        <div className="wrap">
          <div className="shead reveal"><span className="kick">Process · Timeline</span><h2>제작 <em>흐름</em></h2></div>
          <div className="tl reveal d1">
            <div className="tlrow">
              <div className="tlc"><div className="tc">00:00</div><h4>레퍼런스</h4><p>방향을 시안으로 먼저 합의</p></div>
              <div className="tlc"><div className="tc">01:00</div><h4>러프 컷</h4><p>구조와 호흡을 먼저</p></div>
              <div className="tlc"><div className="tc">02:00</div><h4>파인 컷</h4><p>컬러·자막·믹스 다듬기</p></div>
              <div className="tlc"><div className="tc">03:00</div><h4>마스터</h4><p>4K·소스 원본 함께 전달</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>찍을<br /><em>한 컷</em>이 있나요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 시안 컷</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 ▶</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
