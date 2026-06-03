"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiodh{--bg:#0E0D0B;--bg2:#17150F;--paper:#F4ECDC;--paper2:#EEDEC2;--ink:#1A1612;--ink2:#4B413A;--ink3:#7D7568;
  --fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);
  --gold:#C8A24A;--rose:#C66060;--rose2:#D78A8A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(48px,9vw,128px);--fs-h2:clamp(32px,5.5vw,72px);--fs-lead:clamp(15px,1.4vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(56px,8vw,110px);--sp-edge:clamp(20px,5vw,64px);--maxw:1280px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;min-height:100vh;position:relative}
.aiodh::before{content:"";position:fixed;inset:0;background-image:radial-gradient(circle at 20% 30%,rgba(198,96,96,.06),transparent 40%),radial-gradient(circle at 80% 70%,rgba(200,162,74,.05),transparent 40%);pointer-events:none;z-index:0}
.aiodh > *{position:relative;z-index:1}
.aiodh *{box-sizing:border-box}
.aiodh a{text-decoration:none;color:inherit}
.aiodh .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiodh .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.36em;text-transform:uppercase;color:var(--rose2)}
.aiodh .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}.aiodh .reveal.in{opacity:1;transform:none}
.aiodh .reveal.d1{transition-delay:.1s}.aiodh .reveal.d2{transition-delay:.2s}.aiodh .reveal.d3{transition-delay:.3s}
.aiodh .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--rose),var(--gold))}

/* Cover hero */
.aiodh .cover{position:relative;min-height:90vh;display:flex;align-items:center;overflow:hidden;padding:clamp(100px,12vw,156px) 0 clamp(64px,8vw,110px)}
.aiodh .cover .cbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 35%;z-index:0}
.aiodh .cover .cov{position:absolute;inset:0;background:linear-gradient(100deg,rgba(14,13,11,.97) 0%,rgba(14,13,11,.92) 38%,rgba(14,13,11,.52) 68%,rgba(14,13,11,.22) 100%);z-index:1;pointer-events:none}
.aiodh .cover .wrap{position:relative;z-index:2}
.aiodh .cover .l{max-width:640px;text-align:left}
.aiodh .cover .meta{font-family:var(--mono);font-size:11px;color:var(--fg3);letter-spacing:.22em;text-transform:uppercase;margin-bottom:18px;display:flex;flex-wrap:wrap;gap:14px;align-items:center}
.aiodh .cover .meta b{color:var(--rose2);font-weight:400}
.aiodh .cover .meta span.bar{width:18px;height:1px;background:var(--line);display:inline-block}
.aiodh .cover h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:.98;letter-spacing:-.018em;margin-bottom:24px}
.aiodh .cover h1 em{font-family:var(--frau);font-style:normal;font-weight:600;color:var(--rose2)}
.aiodh .cover .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:46ch;margin:0 0 28px}
.aiodh .acts{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.aiodh .cta-pill{font-size:14px;font-weight:600;padding:14px 30px;border-radius:0;background:var(--paper);color:var(--ink);letter-spacing:-.005em}
.aiodh .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
@media(max-width:880px){.aiodh .cover .l{max-width:100%;text-align:center}.aiodh .acts{justify-content:center}.aiodh .cover .lead{margin-left:auto;margin-right:auto}}

/* Paper section */
.aiodh .paper{background:var(--paper);color:var(--ink);position:relative;padding:clamp(64px,9vw,110px) 0;margin:clamp(32px,5vw,72px) 0;box-shadow:0 30px 90px rgba(0,0,0,.45)}
.aiodh .paper::before{content:"";position:absolute;inset:0;background-image:radial-gradient(circle at 25% 35%,rgba(120,100,80,.06) 0,transparent 50%),radial-gradient(circle at 75% 65%,rgba(120,100,80,.04) 0,transparent 50%);pointer-events:none}
.aiodh .paper::after{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:rgba(26,22,18,.16)}
.aiodh .paper .crease{position:absolute;left:0;right:0;bottom:0;height:1px;background:rgba(26,22,18,.16)}
.aiodh .paper .kick{color:var(--rose)}
.aiodh .paper .shead h2{color:var(--ink)}
.aiodh .paper .shead h2 em{color:var(--rose)}
.aiodh .paper .shead p{color:var(--ink2)}

/* Section common */
.aiodh .sec{padding:var(--sp-sec) 0}
.aiodh .shead{margin-bottom:40px;text-align:center}
.aiodh .shead .kick{display:block;margin-bottom:16px}
.aiodh .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.04;margin-bottom:16px;letter-spacing:-.014em}
.aiodh .shead h2 em{font-family:var(--frau);font-style:normal;color:var(--rose2);font-weight:600}
.aiodh .shead p{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:54ch;margin:0 auto}

/* ===== Studio Mockup Preview ===== */
.aiodh .showcase{display:flex;justify-content:center;align-items:flex-end;gap:clamp(14px,2.8vw,36px);padding-top:4px}
.aiodh .mac-frame{position:relative;width:min(64%,620px);flex-shrink:0}
.aiodh .iph-frame{position:relative;width:min(18%,155px);flex-shrink:0;margin-bottom:8px}
.aiodh .droll-frame{position:absolute;inset:0;opacity:0;animation:dhFade 16s linear infinite}
.aiodh .droll-frame img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top}
@keyframes dhFade{0%{opacity:0}5%{opacity:1}23%{opacity:1}28%{opacity:0}100%{opacity:0}}

/* label strip below mockups */
.aiodh .showcase-label{text-align:center;margin-top:22px;font-family:var(--mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--ink3)}
.aiodh .showcase-dots{display:flex;justify-content:center;gap:8px;margin-top:10px}
.aiodh .sdot{width:5px;height:5px;border-radius:50%;background:rgba(26,22,18,.25)}
.aiodh .sdot.a1{animation:dhDot 16s linear infinite}.aiodh .sdot.a2{animation:dhDot 16s linear 4s infinite}.aiodh .sdot.a3{animation:dhDot 16s linear 8s infinite}.aiodh .sdot.a4{animation:dhDot 16s linear 12s infinite}
@keyframes dhDot{0%,4%{background:var(--rose)}25%,100%{background:rgba(26,22,18,.25)}}

@media(max-width:760px){.aiodh .showcase{gap:10px}.aiodh .iph-frame{width:min(22%,120px)}}
@media(max-width:520px){.aiodh .iph-frame{display:none}.aiodh .mac-frame{width:100%}}

/* Pull quote — compact */
.aiodh .pq{padding:clamp(36px,4vw,52px) 0;text-align:center}
.aiodh .pq blockquote{margin:0 auto;max-width:28ch;font-family:var(--frau);font-style:normal;font-weight:400;font-size:clamp(20px,2.6vw,34px);line-height:1.25;color:var(--fg2);letter-spacing:-.008em}
.aiodh .pq blockquote::before,.aiodh .pq blockquote::after{content:"";display:block;width:28px;height:1px;background:var(--rose2);margin:14px auto}
.aiodh .pq cite{font-style:normal;font-family:var(--mono);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--fg3)}

/* Service cards */
.aiodh .scards{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:40px}
.aiodh .scard{position:relative;border-radius:2px;overflow:hidden;border:1px solid rgba(26,22,18,.18);background:var(--paper2);display:flex;flex-direction:column;transition:border-color .3s,transform .3s}
.aiodh .scard:hover{border-color:rgba(26,22,18,.42);transform:translateY(-3px)}
.aiodh .scard .simg{aspect-ratio:3/2;overflow:hidden;position:relative;flex-shrink:0}
.aiodh .scard .simg-ph{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transition:transform .5s}
.aiodh .scard:hover .simg-ph{transform:scale(1.04)}
.aiodh .scard .sbody{padding:20px 22px 24px;display:flex;flex-direction:column;flex:1}
.aiodh .scard .sn{font-family:var(--mono);font-size:10px;letter-spacing:.28em;color:var(--rose);margin-bottom:10px;display:flex;align-items:center;justify-content:space-between}
.aiodh .scard .sv{color:var(--ink3);border:1px solid rgba(26,22,18,.22);padding:3px 8px;font-size:9px;font-family:var(--mono);letter-spacing:.14em}
.aiodh .scard h3{font-family:var(--frau);font-size:clamp(20px,2.2vw,26px);font-weight:500;line-height:1.1;letter-spacing:-.012em;margin-bottom:10px;color:var(--ink)}
.aiodh .scard h3 em{font-family:var(--frau);font-style:normal;color:var(--rose)}
.aiodh .scard .sdesc{font-size:13.5px;line-height:1.8;color:var(--ink2);margin-bottom:auto}
.aiodh .scard .smore{margin-top:16px;font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--rose);text-transform:uppercase}
@media(max-width:880px){.aiodh .scards{grid-template-columns:1fr}.aiodh .scard .simg{aspect-ratio:16/9}}

/* Ways */
.aiodh .ways2{max-width:780px;margin:0 auto}
.aiodh .way2{display:grid;grid-template-columns:64px 1fr;gap:24px;padding:28px 0;border-top:1px solid var(--line2);text-align:left}
.aiodh .way2:last-child{border-bottom:1px solid var(--line2)}
.aiodh .way2 .wn{font-family:var(--frau);font-size:32px;color:var(--rose2);line-height:1}
.aiodh .way2 .wb h4{font-family:var(--frau);font-size:22px;font-weight:500;margin-bottom:6px;color:var(--fg)}
.aiodh .way2 .wb p{font-size:14.5px;line-height:1.85;color:var(--fg2);margin:0}

/* CTA */
.aiodh .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden;text-align:center}
.aiodh .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 55% 45% at 50% 50%,rgba(198,96,96,.14),transparent 70%)}
.aiodh .ctaS .wrap{position:relative}
.aiodh .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1;margin-bottom:22px;letter-spacing:-.014em}
.aiodh .ctaS h2 em{font-family:var(--frau);font-style:normal;color:var(--rose2);font-weight:600}
.aiodh .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const MAC_SRCS = [
  "/portfolio/detail-page/compact-furniture/cover.png",   // 1200×900
  "/portfolio/detail-page/premium-dog-food/cover.png",    // 1200×900
  "/portfolio/detail-page/smart-pet-feeder/cover.png",    // 1200×900
  "/portfolio/detail-page/_categories/living.jpg",        // 1600×900
];

const IPH_SRCS = [
  "/portfolio/detail-page/vegan-cleanser/cover.png",
  "/portfolio/detail-page/linen-onepiece/cover.png",
  "/portfolio/detail-page/hotel-bedding/cover.png",
  "/portfolio/detail-page/senior-protein/cover.png",
];

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

      {/* Cover */}
      <header className="cover">
        <img className="cbg" src="/images/services/design-hub.jpg" alt="" />
        <div className="cov" />
        <div className="wrap">
          <div className="l">
            <div className="meta">
              <b>Issue 02</b><span className="bar" />Design<span className="bar" />A · I · O 2026
            </div>
            <h1>보이는 것이<br />곧 <em>신뢰</em>입니다</h1>
            <p className="lead">로고·명함·상세페이지·PPT — 브랜드의 첫 인사를 다듬습니다</p>
            <div className="acts">
              <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
              <a className="cta-link" href={`${base}/services/detail-page`}>상세페이지부터</a>
            </div>
          </div>
        </div>
      </header>

      {/* === PAPER 1: Studio Preview === */}
      <section className="paper">
        <div className="wrap">
          <div className="shead reveal">
            <span className="kick">Studio Preview</span>
            <h2>화면으로 보는 <em>작업물</em></h2>
            <p>실제 납품된 상세페이지 — PC와 모바일 두 화면으로</p>
          </div>
          <div className="showcase reveal d1">

            {/* MacBook: SVG frame image + screen overlay (viewBox 1000×660, screen x=55 y=30 w=890 h=540) */}
            <div className="mac-frame">
              <img
                src="/mockups/macbook.svg"
                alt=""
                style={{ width: "100%", display: "block", filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.72))" }}
              />
              <div style={{
                position: "absolute",
                top: "4.55%", left: "5.5%", width: "89%", height: "81.8%",
                overflow: "hidden", borderRadius: 4,
              }}>
                <div style={{
                  height: 26, background: "#1a1a1a", borderBottom: "1px solid #2a2a2a",
                  display: "flex", alignItems: "center", gap: 6, padding: "0 10px", flexShrink: 0,
                }}>
                  {(["#FF5F57","#FEBC2E","#28C840"] as const).map((c) => (
                    <span key={c} style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <div style={{ position: "relative", height: "calc(100% - 26px)", overflow: "hidden" }}>
                  {MAC_SRCS.map((src, i) => (
                    <div key={src} className="droll-frame" style={{ animationDelay: `${i * 4}s` }}>
                      <img src={src} alt="" loading={i === 0 ? "eager" : "lazy"} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* iPhone: SVG frame image + screen overlay (viewBox 220×460, screen x=14 y=14 w=192 h=432) */}
            <div className="iph-frame">
              <img
                src="/mockups/iphone.svg"
                alt=""
                style={{ width: "100%", display: "block", filter: "drop-shadow(0 22px 52px rgba(0,0,0,0.62))" }}
              />
              <div style={{
                position: "absolute",
                top: "3%", left: "6.4%", width: "87.3%", height: "93.9%",
                overflow: "hidden", borderRadius: "min(20%, 30px)",
              }}>
                {/* dynamic island: SVG y=32, screen start y=14 → top=(32-14)/432=4.2% */}
                <div style={{
                  position: "absolute", top: "4.2%", left: "50%", transform: "translateX(-50%)",
                  width: "43.75%", height: "5.1%",
                  background: "#000", borderRadius: 999, zIndex: 3,
                }} />
                <div style={{ position: "absolute", inset: 0 }}>
                  {IPH_SRCS.map((src, i) => (
                    <div key={src} className="droll-frame" style={{ animationDelay: `${i * 4 + 2}s` }}>
                      <img src={src} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
          <div className="showcase-label">Actual delivered work · Auto playing</div>
          <div className="showcase-dots">
            {(["a1","a2","a3","a4"] as const).map((c) => (
              <span key={c} className={`sdot ${c}`} />
            ))}
          </div>
        </div>
        <span className="crease" />
      </section>

      {/* Pull quote */}
      <section className="pq">
        <blockquote>좋은 디자인은 한 번 봤을 때 남습니다</blockquote>
        <cite>— Design Director · AIO</cite>
      </section>

      {/* === PAPER 2: 세 가지 디자인 서비스 === */}
      <section className="paper">
        <div className="wrap">
          <div className="shead reveal">
            <span className="kick">Three Issues</span>
            <h2>세 가지 <em>디자인 서비스</em></h2>
            <p>카드를 누르면 전용 소개·포트폴리오 페이지로</p>
          </div>
          <div className="scards">
            <div className="scard reveal d1">
              <div className="simg" style={{ background:"linear-gradient(135deg,#1e1810 0%,#2a2016 50%,#382a1e 100%)" }}>
                <img className="simg-ph" src="/images/services/design-logo-card.jpg" alt="로고·명함"
                     onError={(e) => { e.currentTarget.style.display = "none"; }} loading="lazy" />
              </div>
              <div className="sbody">
                <div className="sn"><span>N° 01</span><span className="sv">COMING SOON</span></div>
                <h3>로고·<em>명함</em></h3>
                <p className="sdesc">브랜드의 첫 글자 — 손에 남는 첫 명함</p>
                <span className="smore">준비 중 →</span>
              </div>
            </div>
            <a className="scard reveal d2" href={`${base}/services/detail-page`}>
              <div className="simg" style={{ background:"linear-gradient(135deg,#121816 0%,#1a241e 50%,#223028 100%)" }}>
                <img className="simg-ph" src="/images/services/design-detail-page.jpg" alt="상세페이지"
                     onError={(e) => { e.currentTarget.style.display = "none"; }} loading="lazy" />
              </div>
              <div className="sbody">
                <div className="sn"><span>N° 02</span><span className="sv">LIVE</span></div>
                <h3>상세<em>페이지</em></h3>
                <p className="sdesc">스크롤을 멈추게 만드는 한 페이지 — 길이와 깊이를 골라서</p>
                <span className="smore">자세히 →</span>
              </div>
            </a>
            <a className="scard reveal d3" href={`${base}/services/ppt-design`}>
              <div className="simg" style={{ background:"linear-gradient(135deg,#101420 0%,#161c2e 50%,#1e2638 100%)" }}>
                <img className="simg-ph" src="/images/services/design-ppt.jpg" alt="PPT 디자인"
                     onError={(e) => { e.currentTarget.style.display = "none"; }} loading="lazy" />
              </div>
              <div className="sbody">
                <div className="sn"><span>N° 03</span><span className="sv">LIVE</span></div>
                <h3>PPT <em>디자인</em></h3>
                <p className="sdesc">제안·IR·발표 — 한 장으로 전달되는 슬라이드</p>
                <span className="smore">자세히 →</span>
              </div>
            </a>
          </div>
        </div>
        <span className="crease" />
      </section>

      {/* Ways */}
      <section className="sec">
        <div className="wrap">
          <div className="shead reveal"><span className="kick">Editorial Standard</span><h2>일하는 <em>방식</em></h2></div>
          <div className="ways2 reveal d1">
            <div className="way2"><div className="wn">01</div><div className="wb"><h4>매일 공유</h4><p>매일 진행을 알려드립니다. 시안이 막혀도 모르고 기다리는 시간이 없도록</p></div></div>
            <div className="way2"><div className="wn">02</div><div className="wb"><h4>원본 제공</h4><p>PSD · AI · PPTX 원본 그대로 — 나중에 다른 곳에서 수정해도 막힘 없이</p></div></div>
            <div className="way2"><div className="wn">03</div><div className="wb"><h4>빠른 속도</h4><p>의뢰 후 2~5일 안에 첫 시안 — 다음 날 착수합니다</p></div></div>
            <div className="way2"><div className="wn">04</div><div className="wb"><h4>2차 수정 무료</h4><p>시안·중간·최종 무제한 수정 — 만족할 때까지 한 번에</p></div></div>
          </div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>디자인할<br /><em>일</em>이 있나요?</h2>
        <p>지금 문의하면 24시간 안에 견적</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
