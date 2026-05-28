"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

/**
 * Video Hub — Full Cinema character
 *
 * 차별화 포인트
 * - 풀폭 letterbox bars 히어로 (시네마 framing)
 * - 씬-바이-씬 reel (16:9 풀폭 + 타임코드)
 * - 서비스 = 영화 포스터 카드 (장르 태그 + 러닝타임)
 * - 프로세스 = 스크러버 타임라인 (00:00 / 00:30 / 01:00 ...)
 */
const CSS = `
.aiovh{--bg:#000;--bg2:#0a0908;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(232,163,64,.32);--line2:rgba(239,233,221,.08);--gold:#C8A24A;--amber:#E8A340;--ember:#F4B45A;
  --frau:var(--font-fraunces);--corm:var(--font-cormorant);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(52px,9.5vw,140px);--fs-h2:clamp(30px,5.4vw,70px);--fs-lead:clamp(15px,1.4vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1280px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;min-height:100vh;text-align:center}
.aiovh *{box-sizing:border-box}
.aiovh a{text-decoration:none;color:inherit}
.aiovh .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiovh .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.36em;text-transform:uppercase;color:var(--amber)}
.aiovh .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}.aiovh .reveal.in{opacity:1;transform:none}
.aiovh .reveal.d1{transition-delay:.1s}.aiovh .reveal.d2{transition-delay:.2s}.aiovh .reveal.d3{transition-delay:.3s}
.aiovh .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--ember),var(--amber))}

/* Cinema hero — full bleed with letterbox bars */
.aiovh .cine{position:relative;min-height:88vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
.aiovh .cine::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(232,163,64,.16),transparent 60%);pointer-events:none}
.aiovh .cine .bar{position:absolute;left:0;right:0;height:clamp(56px,8vh,96px);background:#000;z-index:2;display:flex;align-items:center;padding:0 var(--sp-edge);font-family:var(--mono);font-size:10.5px;letter-spacing:.24em;color:var(--fg3);text-transform:uppercase}
.aiovh .cine .bar.t{top:0;border-bottom:1px solid var(--line2)}
.aiovh .cine .bar.b{bottom:0;border-top:1px solid var(--line2);justify-content:space-between}
.aiovh .cine .bar .l,.aiovh .cine .bar .r{flex:1}
.aiovh .cine .bar .r{text-align:right}
.aiovh .cine .bar .c{flex:0 0 auto;color:var(--amber)}
.aiovh .cine .wrap{position:relative;z-index:1;padding-top:60px;padding-bottom:60px}
.aiovh .cine h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.95;letter-spacing:-.02em;margin-bottom:30px}
.aiovh .cine h1 em{font-family:var(--corm);font-style:italic;color:var(--amber);font-weight:500}
.aiovh .cine .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:46ch;margin:0 auto 40px}
.aiovh .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiovh .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:0;background:var(--amber);color:#000;letter-spacing:.02em;border:1px solid var(--amber)}
.aiovh .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aiovh .runtime{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10.5px;letter-spacing:.26em;color:var(--amber);text-transform:uppercase;margin-bottom:24px;border:1px solid var(--line);padding:6px 14px;border-radius:999px}
.aiovh .runtime .dot{width:7px;height:7px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 4px rgba(232,163,64,.2)}

/* Section common */
.aiovh .sec{padding:var(--sp-sec) 0}
.aiovh .shead{margin-bottom:48px}
.aiovh .shead .kick{display:block;margin-bottom:16px}
.aiovh .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.04;margin-bottom:16px;letter-spacing:-.014em}
.aiovh .shead h2 em{font-family:var(--corm);font-style:italic;color:var(--amber);font-weight:500}
.aiovh .shead p{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:54ch;margin:0 auto}

/* Featured Reel — single 16:9 full bleed cinema frame */
.aiovh .reel{position:relative;aspect-ratio:21/9;max-width:1180px;margin:0 auto;border:1px solid var(--line);background:linear-gradient(135deg,rgba(232,163,64,.28) 0%,rgba(200,162,74,.14) 40%,#000 100%);overflow:hidden}
.aiovh .reel::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 2px,transparent 2px,transparent 4px);pointer-events:none}
.aiovh .reel .crn{position:absolute;width:24px;height:24px;border:1px solid var(--amber)}
.aiovh .reel .crn.tl{top:14px;left:14px;border-right:none;border-bottom:none}
.aiovh .reel .crn.tr{top:14px;right:14px;border-left:none;border-bottom:none}
.aiovh .reel .crn.bl{bottom:14px;left:14px;border-right:none;border-top:none}
.aiovh .reel .crn.br{bottom:14px;right:14px;border-left:none;border-top:none}
.aiovh .reel .play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:clamp(72px,10vw,128px);height:clamp(72px,10vw,128px);border:1px solid var(--amber);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.4);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}
.aiovh .reel .play::after{content:"";display:block;width:0;height:0;border-left:clamp(20px,3vw,36px) solid var(--amber);border-top:clamp(14px,2vw,24px) solid transparent;border-bottom:clamp(14px,2vw,24px) solid transparent;margin-left:8px}
.aiovh .reel .tc{position:absolute;left:24px;top:24px;font-family:var(--mono);font-size:11px;color:var(--amber);letter-spacing:.18em;text-transform:uppercase}
.aiovh .reel .tc::before{content:"●";color:#FF3D00;margin-right:8px;animation:aiovh-blink 1.5s infinite}
.aiovh .reel .meta{position:absolute;right:24px;bottom:24px;font-family:var(--mono);font-size:10.5px;color:var(--fg3);letter-spacing:.18em;text-align:right;line-height:1.85}
.aiovh .reel .meta b{color:var(--amber);font-weight:400;letter-spacing:.22em}
.aiovh .reel .scrub{position:absolute;left:24px;right:24px;bottom:18px;height:2px;background:rgba(239,233,221,.18)}
.aiovh .reel .scrub::after{content:"";position:absolute;left:0;top:0;bottom:0;width:38%;background:var(--amber)}
.aiovh .reel .scrub::before{content:"";position:absolute;left:38%;top:50%;transform:translate(-50%,-50%);width:12px;height:12px;border-radius:50%;background:var(--amber);box-shadow:0 0 0 4px rgba(232,163,64,.25)}
@keyframes aiovh-blink{0%,100%{opacity:1}50%{opacity:.3}}

/* Scenes — service cards as movie posters */
.aiovh .scenes{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:48px}
.aiovh .scene{position:relative;aspect-ratio:2/3;border:1px solid var(--line2);overflow:hidden;background:var(--bg2);text-align:left;transition:border-color .3s,transform .3s}
.aiovh .scene:hover{border-color:var(--amber);transform:translateY(-4px)}
.aiovh .scene .bg{position:absolute;inset:0}
.aiovh .scene.a .bg{background:linear-gradient(160deg,rgba(232,163,64,.35),rgba(0,0,0,.85))}
.aiovh .scene.b .bg{background:linear-gradient(190deg,rgba(244,180,90,.30),rgba(0,0,0,.9))}
.aiovh .scene.c .bg{background:linear-gradient(150deg,rgba(200,162,74,.30),rgba(0,0,0,.9))}
.aiovh .scene.d .bg{background:linear-gradient(210deg,rgba(232,163,64,.25),rgba(0,0,0,.9))}
.aiovh .scene .bg::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,transparent 60%,rgba(0,0,0,.85) 100%)}
.aiovh .scene .info{position:absolute;left:18px;right:18px;bottom:18px;z-index:2}
.aiovh .scene .info .tc{font-family:var(--mono);font-size:10px;color:var(--amber);letter-spacing:.2em;margin-bottom:10px}
.aiovh .scene .info h3{font-family:var(--frau);font-size:clamp(20px,2.2vw,26px);font-weight:500;line-height:1.1;margin-bottom:6px;color:var(--fg)}
.aiovh .scene .info h3 em{font-family:var(--corm);font-style:italic;color:var(--amber)}
.aiovh .scene .info p{font-size:12.5px;color:var(--fg2);line-height:1.6;margin:0}
.aiovh .scene .genre{position:absolute;top:14px;left:14px;font-family:var(--mono);font-size:9px;letter-spacing:.22em;color:var(--amber);border:1px solid var(--amber);padding:4px 9px;z-index:2}
.aiovh .scene .rt{position:absolute;top:14px;right:14px;font-family:var(--mono);font-size:9.5px;color:var(--fg3);letter-spacing:.16em;z-index:2}
@media(max-width:880px){.aiovh .scenes{grid-template-columns:repeat(2,1fr)}}

/* Pricing — minimal cinematic */
.aiovh .pkg{max-width:560px;margin:0 auto;border:1px solid var(--line);padding:36px 30px;text-align:center}
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
.aiovh .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 50% 50%,rgba(232,163,64,.14),transparent 70%)}
.aiovh .ctaS .wrap{position:relative}
.aiovh .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.98;margin-bottom:22px;letter-spacing:-.014em}
.aiovh .ctaS h2 em{font-family:var(--corm);font-style:italic;color:var(--amber);font-weight:500}
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
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="video" active="service" />

      {/* Cinema hero */}
      <header className="cine">
        <div className="bar t"><span className="l">AIO · CINEMA</span><span className="c">A · I · O</span><span className="r">2026 · ISSUE 03</span></div>
        <div className="wrap">
          <div className="runtime"><span className="dot" /> NOW SHOWING · RUNTIME 03:00</div>
          <h1>한 컷이,<br /><em>전부</em>입니다</h1>
          <p className="lead">브랜드 · SNS · 마케팅 · 유튜브. 첫 3초가 멈출지 말지를 결정합니다 — 머무르게 만드는 컷으로</p>
          <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 ▶</a><a className="cta-link" href={`${base}/services/video/team`}>팀원 소개</a></div>
        </div>
        <div className="bar b"><span className="l">REEL · DURATION 03 : 00 : 00</span><span className="c">●  REC</span><span className="r">24 FPS · 4K</span></div>
      </header>

      {/* Featured reel */}
      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Featured Reel</span><h2>이번 분기 <em>리일</em></h2><p>최근 작업한 브랜드·SNS·유튜브 컷들 중 한 컷</p></div>
        <div className="reel reveal d1">
          <span className="crn tl" /><span className="crn tr" /><span className="crn bl" /><span className="crn br" />
          <span className="tc">REC · 00:01:23</span>
          <span className="meta"><b>FEATURED REEL</b><br />Brand · 60s · 4K</span>
          <div className="play" aria-label="Play reel" />
          <div className="scrub" />
        </div>
      </section>

      {/* Scenes — services as posters */}
      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Four Scenes</span><h2>네 가지 <em>장르</em></h2><p>각 장르에 맞춰 무드·길이·컷의 호흡이 다릅니다</p></div>
        <div className="scenes">
          <div className="scene a reveal d1"><div className="bg" /><span className="genre">BRAND</span><span className="rt">60s</span><div className="info"><div className="tc">SCENE 01 · BRAND</div><h3><em>회사</em>·제품 소개</h3><p>홈페이지·전시·세일즈 — 오래 가는 무게감 있는 한 편</p></div></div>
          <div className="scene b reveal d2"><div className="bg" /><span className="genre">SHORT</span><span className="rt">15–60s</span><div className="info"><div className="tc">SCENE 02 · SNS</div><h3><em>숏폼</em>·릴스·틱톡</h3><p>15~60초 짧고 강한 컷 — 첫 1초에 멈추게</p></div></div>
          <div className="scene c reveal d3"><div className="bg" /><span className="genre">AD</span><span className="rt">30s</span><div className="info"><div className="tc">SCENE 03 · MARKETING</div><h3><em>광고</em>·전환 영상</h3><p>유튜브 광고·SNS 광고 — 데이터 기반 컷 구성</p></div></div>
          <div className="scene d reveal d1"><div className="bg" /><span className="genre">EDIT</span><span className="rt">5–20m</span><div className="info"><div className="tc">SCENE 04 · YOUTUBE</div><h3><em>유튜브</em> 편집</h3><p>인트로·자막·컷·썸네일 — 채널 톤 일관성</p></div></div>
        </div>
      </section>

      {/* Pricing pkg */}
      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 준비 중</span><h2>가격은 <em>상담 후</em></h2><p>분량·촬영 유무·소스 사용 범위에 따라 다릅니다 · 정식 가격표는 곧 공개</p></div>
        <div className="pkg reveal d1">
          <div className="lbl">기준 가격대 — 상담 후 견적</div>
          <div className="num"><em>49.9 ~ 199</em> 만원</div>
          <p className="desc">SNS 숏폼 한 편부터 브랜드 영상 풀패키지까지 — 의뢰 내용에 맞춰</p>
        </div>
      </section>

      {/* Process — scrubber timeline */}
      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Process · Timeline</span><h2>제작 <em>흐름</em></h2></div>
        <div className="tl reveal d1">
          <div className="tlrow">
            <div className="tlc"><div className="tc">00:00</div><h4>레퍼런스</h4><p>방향을 시안으로 먼저 합의</p></div>
            <div className="tlc"><div className="tc">01:00</div><h4>러프 컷</h4><p>구조와 호흡을 먼저</p></div>
            <div className="tlc"><div className="tc">02:00</div><h4>파인 컷</h4><p>컬러·자막·믹스 다듬기</p></div>
            <div className="tlc"><div className="tc">03:00</div><h4>마스터</h4><p>4K·소스 원본 함께 전달</p></div>
          </div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>찍을 게<br /><em>있나요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 시안 컷</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 ▶</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
