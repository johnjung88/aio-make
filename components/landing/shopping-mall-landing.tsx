"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiosm{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--rose:#D78A8A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);--fs-body:clamp(14px,1.1vw,15.5px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiosm *{box-sizing:border-box}
.aiosm a{text-decoration:none;color:inherit}
.aiosm .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiosm .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
@keyframes aiosm-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.aiosm .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}
.aiosm .reveal.in{opacity:1;transform:none}
.aiosm .reveal.d1{transition-delay:.1s}.aiosm .reveal.d2{transition-delay:.2s}.aiosm .reveal.d3{transition-delay:.3s}
.aiosm .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--gold),var(--gold2))}
.aiosm .hero{position:relative;padding:clamp(74px,12vw,156px) 0 clamp(50px,7vw,80px);overflow:hidden}
.aiosm .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 58% at 50% 16%,rgba(200,162,74,.10),transparent 70%);pointer-events:none}
.aiosm .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.0;letter-spacing:-.01em;margin-bottom:30px}
.aiosm .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiosm .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 auto clamp(34px,5vw,44px)}
.aiosm .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiosm .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiosm .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aiosm .sec{padding:var(--sp-sec) 0}
.aiosm .shead{margin-bottom:48px}
.aiosm .shead .kick{display:block;margin-bottom:18px}
.aiosm .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px;letter-spacing:-.012em}
.aiosm .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiosm .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Storefront mockup */
.aiosm .store{position:relative;max-width:880px;margin:0 auto;border:1px solid var(--line);border-radius:14px;background:var(--bg2);overflow:hidden;box-shadow:0 36px 96px rgba(0,0,0,.55)}
.aiosm .store .bar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line2);background:#1c1a13}
.aiosm .store .bar .dot{width:9px;height:9px;border-radius:50%;background:rgba(239,233,221,.18)}
.aiosm .store .bar .url{flex:1;text-align:left;font-family:var(--mono);font-size:11px;color:var(--fg3);letter-spacing:.06em;margin-left:8px}
.aiosm .store .nav{display:flex;justify-content:center;gap:24px;padding:14px 18px;border-bottom:1px solid var(--line2);font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--fg3)}
.aiosm .store .nav b{color:var(--gold)}
.aiosm .store .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.aiosm .store .prod{padding:18px 14px;border-right:1px solid var(--line2);border-bottom:1px solid var(--line2)}
.aiosm .store .prod:nth-child(4n){border-right:none}
.aiosm .store .prod:nth-last-child(-n+4){border-bottom:none}
.aiosm .store .prod .thumb{aspect-ratio:1;background:linear-gradient(135deg,rgba(200,162,74,.18),rgba(215,138,138,.12));border-radius:6px;margin-bottom:10px}
.aiosm .store .prod .pn{font-family:var(--pret);font-size:12px;color:var(--fg);margin-bottom:4px}
.aiosm .store .prod .pp{font-family:var(--mono);font-size:11px;color:var(--gold);letter-spacing:.06em}
@media(max-width:680px){.aiosm .store .grid{grid-template-columns:repeat(2,1fr)}.aiosm .store .prod:nth-child(4n){border-right:1px solid var(--line2)}.aiosm .store .prod:nth-child(2n){border-right:none}}

.aiosm .types{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:48px}
.aiosm .tcard{position:relative;padding:36px 28px;border:1px solid var(--line2);border-radius:14px;background:var(--bg2);text-align:left}
.aiosm .tcard .tnum{font-family:var(--mono);font-size:11px;color:var(--gold);letter-spacing:.18em;margin-bottom:10px}
.aiosm .tcard h3{font-family:var(--frau);font-size:clamp(22px,2.4vw,30px);font-weight:500;margin-bottom:10px;color:var(--fg);text-align:center}
.aiosm .tcard p{font-size:14px;line-height:1.8;color:var(--fg2);margin-bottom:18px;text-align:center}
.aiosm .tcard ul{list-style:none;padding:0;margin:0 auto;max-width:280px;font-size:13px;color:var(--fg2);line-height:1.95}
.aiosm .tcard ul li::before{content:"·";color:var(--gold);margin-right:8px}
.aiosm .tcard .tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:20px;justify-content:center}
.aiosm .tcard .tag{font-family:var(--mono);font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--fg3);border:1px solid var(--line2);padding:5px 10px;border-radius:999px}
@media(max-width:760px){.aiosm .types{grid-template-columns:1fr}}

.aiosm .price{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:48px}
.aiosm .prow{padding:30px 24px;border:1px solid var(--line2);border-radius:14px;text-align:center}
.aiosm .prow.lim{border-color:var(--gold)}
.aiosm .prow .pname{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.aiosm .prow .pnum{font-family:var(--frau);font-size:clamp(32px,4vw,46px);font-weight:500;color:var(--fg);margin-bottom:6px}
.aiosm .prow .pnum .unit{font-size:.55em;color:var(--fg2);margin-left:4px}
.aiosm .prow .reg{font-family:var(--mono);font-size:10.5px;color:var(--fg3);text-decoration:line-through;margin-bottom:14px;letter-spacing:.06em}
.aiosm .prow .pdesc{font-size:13px;line-height:1.8;color:var(--fg2);margin-top:8px}
@media(max-width:680px){.aiosm .price{grid-template-columns:1fr}}

.aiosm .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aiosm .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aiosm .v:last-child{border-right:none}
.aiosm .v .vn{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.2em;margin-bottom:8px}
.aiosm .v .vt{font-family:var(--frau);font-size:18px;color:var(--fg);margin-bottom:6px}
.aiosm .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aiosm .vals{grid-template-columns:1fr 1fr}.aiosm .v:nth-child(2n){border-right:none}.aiosm .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

.aiosm .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aiosm .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(200,162,74,.10),transparent 70%);pointer-events:none}
.aiosm .ctaS .wrap{position:relative}
.aiosm .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiosm .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiosm .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const Storefront = () => (
  <div className="store">
    <div className="bar"><span className="dot" /><span className="dot" /><span className="dot" /><span className="url">store.brand.kr</span></div>
    <div className="nav"><b>홈</b><span>전체상품</span><span>BEST</span><span>NEW</span><span>이벤트</span></div>
    <div className="grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="prod">
          <div className="thumb" />
          <div className="pn">상품 {String(i + 1).padStart(2, "0")}</div>
          <div className="pp">₩ {(19 + i * 4).toString()}.000</div>
        </div>
      ))}
    </div>
  </div>
);

export function ShoppingMallLanding({ locale }: { locale: string }) {
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
    <div className="aiosm" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="shopping-mall" active="service" />

      <header className="hero"><div className="wrap">
        <span className="kick">AIO · Shopping Mall</span>
        <h1>팔리는 <em>스토어</em>,<br />하루 만에</h1>
        <p className="lead">카페24·독립몰 — 디자인·상품 등록·결제 연동까지 한 번에. 보여주기용 데모가 아니라 바로 매출 받을 수 있는 상태로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/shopping-mall/portfolio`}>포트폴리오 보기</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Preview</span><h2>이런 <em>스토어</em>를 만듭니다</h2><p>카페24 · 독립몰 · 자사몰 — 디자인 센터 톤부터 풀 커스텀까지</p></div>
        <div className="reveal d1"><Storefront /></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Two ways</span><h2>두 가지 <em>제작 방식</em></h2><p>예산과 일정에 맞춰, 풀 커스텀이나 빠른 복사 셋업으로</p></div>
        <div className="types">
          <div className="tcard reveal d1">
            <div className="tnum">01 · 단순 복사 셋업</div>
            <h3>빠른 <em style={{ color: "var(--gold)", fontStyle: "normal" }}>오픈</em></h3>
            <p>레퍼런스 톤을 가져와 빠르게 오픈할 수 있는 상태로</p>
            <ul><li>카페24 디자인 센터 적용</li><li>상품 10개 등록</li><li>결제·배송·정산 셋업</li><li>모바일·PC 점검</li></ul>
            <div className="tags"><span className="tag">2~3일</span><span className="tag">카페24</span></div>
          </div>
          <div className="tcard reveal d2">
            <div className="tnum">02 · 풀 세팅 (디자인+개발)</div>
            <h3>브랜드 <em style={{ color: "var(--gold)", fontStyle: "normal" }}>스토어</em></h3>
            <p>브랜드 톤을 살린 디자인부터 전체 페이지 구성까지</p>
            <ul><li>메인·카테고리·상세 전 페이지 디자인</li><li>상품 30개 등록 / 카테고리 정리</li><li>이벤트 배너·쿠폰 셋업</li><li>리뷰·SEO·픽셀 연동</li></ul>
            <div className="tags"><span className="tag">5~10일</span><span className="tag">자사몰 가능</span></div>
          </div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 한정 (~26년 6월)</span><h2>가격은 <em>한정가</em>입니다</h2><p>표시 가격은 26년 6월까지 한정. 정상가는 표시가의 3배</p></div>
        <div className="price">
          <div className="prow lim reveal d1"><div className="pname">단순 복사 셋업</div><div className="pnum">9.9<span className="unit">만원</span></div><div className="reg">정상가 29.7만원</div><div className="pdesc">카페24 · 상품 10 · 결제·배송 셋업</div></div>
          <div className="prow lim reveal d2"><div className="pname">풀 세팅 (디자인+개발)</div><div className="pnum">19.9<span className="unit">만원</span></div><div className="reg">정상가 59.7만원</div><div className="pdesc">디자인 전체 + 상품 30 + 이벤트·쿠폰</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">매일 공유</div><div className="vd">진행 상황을 매일 알려드립니다</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">바로 오픈</div><div className="vd">결제까지 받을 수 있는 상태로</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 2~10일, 다음 날 착수</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">책임 A/S</div><div className="vd">납품 후 한 달 무상 유지보수</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>오픈할 <em>스토어</em>,<br />있나요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 빠르면 다음 날 오픈</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
