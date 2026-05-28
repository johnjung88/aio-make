"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

/**
 * Design Hub — Editorial Magazine character (Dark Premium 패밀리)
 *
 * 차별화 포인트
 * - 비대칭 magazine cover hero (좌 텍스트 / 우 대형 art frame)
 * - 풀폭 magazine spread (가로 6컷 마스리, 사이즈 mix)
 * - 서비스 = "Issue" 카드 (잡지 호수 스타일)
 * - 큐레이션 quote — pull-quote 패턴
 */
const CSS = `
.aiodh{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--rose:#D78A8A;--cream:#F4ECDC;
  --frau:var(--font-fraunces);--corm:var(--font-cormorant);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(48px,9vw,128px);--fs-h2:clamp(32px,5.5vw,72px);--fs-lead:clamp(15px,1.4vw,18px);--fs-body:clamp(14px,1.1vw,15.5px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1280px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;min-height:100vh}
.aiodh *{box-sizing:border-box}
.aiodh a{text-decoration:none;color:inherit}
.aiodh .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiodh .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.36em;text-transform:uppercase;color:var(--rose)}
.aiodh .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}.aiodh .reveal.in{opacity:1;transform:none}
.aiodh .reveal.d1{transition-delay:.1s}.aiodh .reveal.d2{transition-delay:.2s}.aiodh .reveal.d3{transition-delay:.3s}
.aiodh .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--rose),var(--gold))}

/* Hero — magazine cover (asymmetric grid) */
.aiodh .cover{padding:clamp(82px,11vw,156px) 0 clamp(50px,7vw,100px);position:relative;overflow:hidden}
.aiodh .cover::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 55% 50% at 70% 30%,rgba(215,138,138,.16),transparent 70%)}
.aiodh .cover .wrap{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,4vw,72px);align-items:center}
.aiodh .cover .l{text-align:left}
.aiodh .cover .meta{font-family:var(--mono);font-size:11px;color:var(--fg3);letter-spacing:.22em;text-transform:uppercase;margin-bottom:18px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}
.aiodh .cover .meta b{color:var(--rose);font-weight:400}
.aiodh .cover .meta span.bar{width:18px;height:1px;background:var(--line);display:inline-block}
.aiodh .cover h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.98;letter-spacing:-.018em;margin-bottom:24px}
.aiodh .cover h1 em{font-family:var(--corm);font-style:italic;font-weight:500;color:var(--rose)}
.aiodh .cover .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 0 28px}
.aiodh .acts{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.aiodh .cta-pill{font-size:14px;font-weight:600;padding:14px 30px;border-radius:999px;background:var(--cream);color:#0E0D0B;letter-spacing:-.005em}
.aiodh .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
/* Cover art frame */
.aiodh .cover .r{position:relative}
.aiodh .frame{position:relative;aspect-ratio:4/5;border:1px solid var(--line);background:linear-gradient(155deg,rgba(215,138,138,.32) 0%,rgba(200,162,74,.18) 45%,rgba(14,13,11,.6) 100%);overflow:hidden;border-radius:2px}
.aiodh .frame .tag{position:absolute;top:14px;left:14px;font-family:var(--mono);font-size:10px;color:var(--cream);letter-spacing:.24em;border:1px solid var(--cream);padding:5px 10px}
.aiodh .frame .label{position:absolute;left:18px;bottom:20px;font-family:var(--frau);color:var(--cream);font-size:clamp(20px,2.5vw,34px);line-height:1;letter-spacing:-.01em}
.aiodh .frame .label em{font-family:var(--corm);font-style:italic;color:#FFD7BB}
.aiodh .frame .price{position:absolute;right:14px;bottom:18px;font-family:var(--mono);font-size:10px;color:var(--cream);letter-spacing:.18em;text-align:right;line-height:1.7}
.aiodh .frame::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0,transparent 38px,rgba(244,236,220,.04) 38px,rgba(244,236,220,.04) 39px)}
@media(max-width:880px){.aiodh .cover .wrap{grid-template-columns:1fr;text-align:center}.aiodh .cover .l{text-align:center}.aiodh .cover .lead{margin-left:auto;margin-right:auto}.aiodh .frame{max-width:420px;margin:0 auto}}

/* Section common */
.aiodh .sec{padding:var(--sp-sec) 0}
.aiodh .shead{margin-bottom:48px;text-align:center}
.aiodh .shead .kick{display:block;margin-bottom:16px}
.aiodh .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.04;margin-bottom:16px;letter-spacing:-.014em}
.aiodh .shead h2 em{font-family:var(--corm);font-style:italic;color:var(--rose);font-weight:500}
.aiodh .shead p{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:54ch;margin:0 auto}

/* Spread — masonry-style gallery */
.aiodh .spread{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:160px;gap:14px}
.aiodh .tile{position:relative;border:1px solid var(--line2);overflow:hidden;background:var(--bg2);transition:border-color .3s,transform .3s}
.aiodh .tile:hover{border-color:var(--rose);transform:translateY(-3px)}
.aiodh .tile .tag{position:absolute;left:14px;top:12px;font-family:var(--mono);font-size:9.5px;letter-spacing:.22em;color:var(--cream);text-transform:uppercase}
.aiodh .tile .ttl{position:absolute;left:14px;bottom:12px;right:14px;font-family:var(--frau);font-size:clamp(15px,1.6vw,22px);color:var(--cream);line-height:1.1}
.aiodh .tile .ttl em{font-family:var(--corm);font-style:italic;color:var(--gold2)}
.aiodh .tile.t1{grid-column:span 5;grid-row:span 2;background:linear-gradient(135deg,rgba(215,138,138,.34),rgba(200,162,74,.18))}
.aiodh .tile.t2{grid-column:span 7;grid-row:span 2;background:linear-gradient(165deg,rgba(244,236,220,.18),rgba(14,13,11,.6))}
.aiodh .tile.t3{grid-column:span 4;grid-row:span 2;background:linear-gradient(180deg,rgba(200,162,74,.22),rgba(215,138,138,.10))}
.aiodh .tile.t4{grid-column:span 4;grid-row:span 2;background:linear-gradient(200deg,rgba(244,236,220,.10),rgba(200,162,74,.20))}
.aiodh .tile.t5{grid-column:span 4;grid-row:span 2;background:linear-gradient(140deg,rgba(215,138,138,.20),rgba(244,236,220,.06))}
@media(max-width:880px){.aiodh .spread{grid-template-columns:repeat(6,1fr)}.aiodh .tile.t1{grid-column:span 6}.aiodh .tile.t2{grid-column:span 6}.aiodh .tile.t3,.aiodh .tile.t4,.aiodh .tile.t5{grid-column:span 3}}

/* Issue cards — magazine-style service cards (large, editorial) */
.aiodh .issues{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.aiodh .iss{position:relative;border:1px solid var(--line);padding:36px 30px 32px;background:var(--bg2);display:flex;flex-direction:column;min-height:340px;text-align:left;transition:border-color .3s,transform .3s}
.aiodh .iss:hover{border-color:var(--rose);transform:translateY(-4px)}
.aiodh .iss .num{font-family:var(--mono);font-size:11px;letter-spacing:.28em;color:var(--rose);margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
.aiodh .iss .num .v{color:var(--fg3)}
.aiodh .iss .pic{aspect-ratio:5/4;background:linear-gradient(135deg,rgba(215,138,138,.22),rgba(200,162,74,.10));margin:0 -30px 22px;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);position:relative}
.aiodh .iss.a .pic{background:linear-gradient(165deg,rgba(200,162,74,.18),rgba(14,13,11,.6))}
.aiodh .iss.b .pic{background:linear-gradient(145deg,rgba(215,138,138,.26),rgba(200,162,74,.12))}
.aiodh .iss.c .pic{background:linear-gradient(195deg,rgba(244,236,220,.10),rgba(215,138,138,.18))}
.aiodh .iss .pic .cap{position:absolute;left:14px;bottom:10px;font-family:var(--mono);font-size:9.5px;color:var(--cream);letter-spacing:.2em}
.aiodh .iss h3{font-family:var(--frau);font-size:clamp(22px,2.4vw,30px);font-weight:500;line-height:1.1;letter-spacing:-.008em;margin-bottom:10px}
.aiodh .iss h3 em{font-family:var(--corm);font-style:italic;color:var(--rose)}
.aiodh .iss .desc{font-size:14px;line-height:1.8;color:var(--fg2);margin-bottom:auto}
.aiodh .iss .more{margin-top:18px;font-family:var(--mono);font-size:11px;letter-spacing:.18em;color:var(--gold);text-transform:uppercase}
.aiodh .iss .soon{position:absolute;top:16px;right:16px;font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;color:var(--fg3);border:1px solid var(--line2);padding:4px 8px}
@media(max-width:880px){.aiodh .issues{grid-template-columns:1fr}}

/* Pull quote */
.aiodh .pq{padding:clamp(70px,9vw,130px) 0;text-align:center;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}
.aiodh .pq blockquote{margin:0 auto;max-width:18ch;font-family:var(--corm);font-style:italic;font-weight:500;font-size:clamp(34px,5vw,72px);line-height:1.12;color:var(--cream);letter-spacing:-.012em}
.aiodh .pq blockquote::before,.aiodh .pq blockquote::after{content:"";display:block;width:36px;height:1px;background:var(--rose);margin:24px auto}
.aiodh .pq cite{font-style:normal;font-family:var(--mono);font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--fg3)}

/* Way list — editorial */
.aiodh .ways2{max-width:780px;margin:0 auto}
.aiodh .way2{display:grid;grid-template-columns:64px 1fr;gap:24px;padding:28px 0;border-top:1px solid var(--line2);text-align:left}
.aiodh .way2:last-child{border-bottom:1px solid var(--line2)}
.aiodh .way2 .wn{font-family:var(--frau);font-size:32px;color:var(--rose);line-height:1}
.aiodh .way2 .wb h4{font-family:var(--frau);font-size:22px;font-weight:500;margin-bottom:6px;color:var(--fg)}
.aiodh .way2 .wb p{font-size:14.5px;line-height:1.85;color:var(--fg2);margin:0}

/* CTA */
.aiodh .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden;text-align:center}
.aiodh .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 50% 50%,rgba(215,138,138,.12),transparent 70%)}
.aiodh .ctaS .wrap{position:relative}
.aiodh .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1;margin-bottom:22px;letter-spacing:-.014em}
.aiodh .ctaS h2 em{font-family:var(--corm);font-style:italic;color:var(--rose);font-weight:500}
.aiodh .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

export function DesignHub({ locale }: { locale: string }) {
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
    <div className="aiodh" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="design" active="service" />

      {/* Cover — magazine asymmetric */}
      <header className="cover"><div className="wrap">
        <div className="l">
          <div className="meta">
            <b>Issue 02</b><span className="bar" />Design<span className="bar" />A · I · O 2026
          </div>
          <h1>보이는 것이,<br /><em>신뢰</em>가 됩니다</h1>
          <p className="lead">로고·명함·상세페이지·PPT — 브랜드의 첫 인사를 다듬습니다. 한 번 봤을 때 남는 디자인으로</p>
          <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/detail-page`}>상세페이지부터</a></div>
        </div>
        <div className="r">
          <div className="frame">
            <span className="tag">Cover · Editorial</span>
            <span className="label"><em>Brand</em><br />First Impression</span>
            <span className="price">N° 02<br />2026 . AIO</span>
          </div>
        </div>
      </div></header>

      {/* Featured spread — masonry */}
      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Featured Spread</span><h2>이번 호의 <em>작업들</em></h2><p>로고·명함·상세페이지·PPT — 분야별 전문가가 각자의 매체로</p></div>
        <div className="spread reveal d1">
          <div className="tile t1"><span className="tag">Detail · 10,000PX</span><span className="ttl"><em>스크롤</em>이<br />멈추는 페이지</span></div>
          <div className="tile t2"><span className="tag">PPT · IR Deck</span><span className="ttl">한 장에 <em>한 메시지</em></span></div>
          <div className="tile t3"><span className="tag">Logo · Brand</span><span className="ttl"><em>첫 글자</em></span></div>
          <div className="tile t4"><span className="tag">Card · Business</span><span className="ttl">손에 남는 <em>두께</em></span></div>
          <div className="tile t5"><span className="tag">Detail · 20,000PX</span><span className="ttl">풀 <em>스토리</em></span></div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="pq">
        <blockquote>좋은 디자인은 한 번 봤을 때 남습니다</blockquote>
        <cite>— Design Director · AIO</cite>
      </section>

      {/* Issues — services as magazine issues */}
      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Three Issues</span><h2>세 가지 <em>디자인 서비스</em></h2><p>각 호수를 누르면 전용 소개·포트폴리오 페이지로</p></div>
        <div className="issues">
          <div className="iss a reveal d1">
            <div className="num"><span>N° 01</span><span className="v">Soon</span></div>
            <div className="pic"><span className="cap">Logo · Business Card</span></div>
            <h3>로고·<em>명함</em></h3>
            <p className="desc">브랜드의 첫 글자, 손에 남는 첫 명함</p>
            <span className="more">준비 중 →</span>
            <span className="soon">COMING SOON</span>
          </div>
          <a className="iss b reveal d2" href={`${base}/services/detail-page`}>
            <div className="num"><span>N° 02</span><span className="v">Live</span></div>
            <div className="pic"><span className="cap">Detail · 5,000 – 20,000PX</span></div>
            <h3>상세<em>페이지</em></h3>
            <p className="desc">스크롤을 멈추게 만드는 한 페이지 — 길이와 깊이를 골라서</p>
            <span className="more">자세히 →</span>
          </a>
          <a className="iss c reveal d3" href={`${base}/services/ppt-design`}>
            <div className="num"><span>N° 03</span><span className="v">Live</span></div>
            <div className="pic"><span className="cap">PPT · IR · Proposal</span></div>
            <h3>PPT <em>디자인</em></h3>
            <p className="desc">제안·IR·발표 — 한 장으로 전달되는 슬라이드</p>
            <span className="more">자세히 →</span>
          </a>
        </div>
      </section>

      {/* Ways — editorial list */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal"><span className="kick">Editorial Standard</span><h2>일하는 <em>방식</em></h2></div>
          <div className="ways2 reveal d1">
            <div className="way2"><div className="wn">01</div><div className="wb"><h4>매일 공유</h4><p>매일 진행을 알려드립니다. 작업 중간 시안이 막혀도 모르고 기다리는 시간이 없도록</p></div></div>
            <div className="way2"><div className="wn">02</div><div className="wb"><h4>원본 제공</h4><p>PSD · AI · PPTX 원본 그대로 드립니다. 나중에 다른 곳에서 수정해도 막힘 없이</p></div></div>
            <div className="way2"><div className="wn">03</div><div className="wb"><h4>빠른 속도</h4><p>의뢰 후 2~5일 안에 첫 시안. 다음 날 착수합니다</p></div></div>
            <div className="way2"><div className="wn">04</div><div className="wb"><h4>2차 수정 무료</h4><p>시안·중간·최종 무제한 수정. 만족할 때까지 한 번에</p></div></div>
          </div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>디자인할 게<br /><em>있나요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
