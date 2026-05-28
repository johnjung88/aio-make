"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiodp2{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--rose:#D78A8A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiodp2 *{box-sizing:border-box}
.aiodp2 a{text-decoration:none;color:inherit}
.aiodp2 .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiodp2 .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
.aiodp2 .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s,transform 1.1s}.aiodp2 .reveal.in{opacity:1;transform:none}
.aiodp2 .reveal.d1{transition-delay:.1s}.aiodp2 .reveal.d2{transition-delay:.2s}
.aiodp2 .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--rose),var(--gold))}
.aiodp2 .hero{position:relative;padding:clamp(74px,12vw,156px) 0 clamp(50px,7vw,80px);overflow:hidden}
.aiodp2 .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 58% at 50% 16%,rgba(215,138,138,.10),transparent 70%)}
.aiodp2 .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.0;letter-spacing:-.01em;margin-bottom:30px}
.aiodp2 .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2 .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 auto clamp(34px,5vw,44px)}
.aiodp2 .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiodp2 .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiodp2 .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aiodp2 .sec{padding:var(--sp-sec) 0}
.aiodp2 .shead{margin-bottom:48px}
.aiodp2 .shead .kick{display:block;margin-bottom:18px}
.aiodp2 .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px}
.aiodp2 .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2 .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Phone mockup */
.aiodp2 .pre{display:flex;justify-content:center;gap:18px;align-items:flex-start}
.aiodp2 .ph{width:300px;height:540px;border:1px solid var(--gold);border-radius:32px;background:var(--bg2);padding:14px;box-shadow:0 32px 80px rgba(0,0,0,.6);position:relative;overflow:hidden}
.aiodp2 .ph::before{content:"";position:absolute;top:14px;left:50%;transform:translateX(-50%);width:90px;height:8px;background:#0E0D0B;border-radius:0 0 14px 14px;z-index:2}
.aiodp2 .ph .scr{height:100%;border-radius:22px;overflow:hidden;background:#0a0908;display:flex;flex-direction:column;gap:8px;padding:30px 14px 14px;text-align:left}
.aiodp2 .ph .hr1{height:42px;background:linear-gradient(135deg,rgba(200,162,74,.3),rgba(215,138,138,.2));border-radius:6px}
.aiodp2 .ph .img{height:120px;background:linear-gradient(160deg,rgba(200,162,74,.18),rgba(215,138,138,.10));border-radius:6px}
.aiodp2 .ph .ln{height:6px;background:rgba(239,233,221,.18);border-radius:3px}
.aiodp2 .ph .ln.s{width:60%}.aiodp2 .ph .ln.m{width:85%}
.aiodp2 .ph .img2{height:80px;background:linear-gradient(180deg,rgba(139,224,194,.14),rgba(200,162,74,.10));border-radius:6px}
.aiodp2 .ph .cta{height:36px;background:var(--gold);border-radius:6px;margin-top:auto}
.aiodp2 .ph.tall{height:680px}.aiodp2 .ph.taller{height:820px}
@media(max-width:820px){.aiodp2 .pre{flex-wrap:wrap;gap:14px}.aiodp2 .ph{width:240px;height:430px}.aiodp2 .ph.tall{height:540px}.aiodp2 .ph.taller{height:640px}}

.aiodp2 .price{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:48px}
.aiodp2 .prow{padding:30px 22px;border:1px solid var(--gold);border-radius:14px;text-align:center}
.aiodp2 .prow .pname{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.aiodp2 .prow .pnum{font-family:var(--frau);font-size:clamp(28px,3.5vw,42px);margin-bottom:6px}
.aiodp2 .prow .pnum .unit{font-size:.55em;color:var(--fg2);margin-left:4px}
.aiodp2 .prow .reg{font-family:var(--mono);font-size:10.5px;color:var(--fg3);text-decoration:line-through;letter-spacing:.06em;margin-bottom:6px}
.aiodp2 .prow .pdesc{font-size:13px;line-height:1.8;color:var(--fg2);margin-top:8px}
@media(max-width:760px){.aiodp2 .price{grid-template-columns:1fr}}

.aiodp2 .addon{max-width:520px;margin:24px auto 0;padding:18px 22px;border:1px dashed var(--line2);border-radius:12px;font-size:13px;color:var(--fg2)}
.aiodp2 .addon b{color:var(--gold)}

.aiodp2 .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aiodp2 .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aiodp2 .v:last-child{border-right:none}
.aiodp2 .v .vn{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.2em;margin-bottom:8px}
.aiodp2 .v .vt{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aiodp2 .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aiodp2 .vals{grid-template-columns:1fr 1fr}.aiodp2 .v:nth-child(2n){border-right:none}.aiodp2 .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

.aiodp2 .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aiodp2 .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(215,138,138,.10),transparent 70%)}
.aiodp2 .ctaS .wrap{position:relative}
.aiodp2 .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiodp2 .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp2 .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const Phone = ({ size = "" }: { size?: "" | "tall" | "taller" }) => (
  <div className={"ph " + size}>
    <div className="scr">
      <div className="hr1" />
      <div className="img" />
      <div className="ln m" /><div className="ln s" /><div className="ln m" />
      <div className="img2" />
      <div className="ln m" /><div className="ln s" />
      {size === "tall" && <><div className="img" /><div className="ln m" /></>}
      {size === "taller" && <><div className="img" /><div className="ln m" /><div className="img2" /><div className="ln m" /></>}
      <div className="cta" />
    </div>
  </div>
);

export function DetailPageLanding({ locale }: { locale: string }) {
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
    <div className="aiodp2" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" sub="detail-page" active="service" />

      <header className="hero"><div className="wrap">
        <span className="kick">AIO · Detail Page</span>
        <h1>스크롤을 멈추게,<br /><em>구매</em>까지 닿게</h1>
        <p className="lead">5,000PX 단순 소개부터 20,000PX 풀 스토리텔링까지 — 시선·정보·증거·CTA를 하나의 흐름으로 엮어 만듭니다</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/detail-page/portfolio`}>포트폴리오 보기</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Preview · 3 sizes</span><h2>세 가지 <em>길이</em></h2><p>제품·상황·예산에 맞춰 길이와 깊이를 고릅니다</p></div>
        <div className="pre reveal d1"><Phone /><Phone size="tall" /><Phone size="taller" /></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 한정 (~26년 6월)</span><h2>가격은 <em>길이별</em></h2><p>표시 가격은 26년 6월까지 한정. 정상가는 표시가의 3배</p></div>
        <div className="price">
          <div className="prow reveal d1"><div className="pname">기본 · 5,000PX</div><div className="pnum">4.9<span className="unit">만원</span></div><div className="reg">정상가 14.7만원</div><div className="pdesc">제품 소개 + 핵심 USP + CTA</div></div>
          <div className="prow reveal d2"><div className="pname">표준 · 10,000PX</div><div className="pnum">6.9<span className="unit">만원</span></div><div className="reg">정상가 20.7만원</div><div className="pdesc">스토리텔링 + 증거 + 비교 + CTA</div></div>
          <div className="prow reveal d1"><div className="pname">풀 · 20,000PX</div><div className="pnum">9.9<span className="unit">만원</span></div><div className="reg">정상가 29.7만원</div><div className="pdesc">풀 스토리텔링 + Q&amp;A + 후기 + 추천</div></div>
        </div>
        <div className="addon reveal d2">⊕ <b>GIF</b> 건당 <b>1만원</b> · 움직이는 비교/시연 등 모션 컷 추가</div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">매일 공유</div><div className="vd">진행을 매일 알려드립니다</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">원본 PSD</div><div className="vd">PSD 원본 무료 제공</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 2~5일, 다음 날 착수</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">2차 수정 무료</div><div className="vd">시안·중간·최종 무제한</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>팔리게 만들<br /><em>제품</em>이 있나요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
