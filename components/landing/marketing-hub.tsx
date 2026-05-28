"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiomh{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--mint:#8BE0C2;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiomh *{box-sizing:border-box}
.aiomh a{text-decoration:none;color:inherit}
.aiomh .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiomh .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--mint)}
.aiomh .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s,transform 1.1s}.aiomh .reveal.in{opacity:1;transform:none}
.aiomh .reveal.d1{transition-delay:.1s}.aiomh .reveal.d2{transition-delay:.2s}.aiomh .reveal.d3{transition-delay:.3s}
.aiomh .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--mint),var(--gold))}
.aiomh .hero{position:relative;padding:clamp(74px,12vw,156px) 0 clamp(50px,7vw,80px);overflow:hidden}
.aiomh .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 65% 50% at 50% 25%,rgba(139,224,194,.10),transparent 70%)}
.aiomh .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.0;letter-spacing:-.01em;margin-bottom:30px}
.aiomh .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiomh .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 auto clamp(34px,5vw,44px)}
.aiomh .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiomh .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiomh .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aiomh .sec{padding:var(--sp-sec) 0}
.aiomh .shead{margin-bottom:48px}
.aiomh .shead .kick{display:block;margin-bottom:18px}
.aiomh .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px}
.aiomh .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiomh .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Dashboard mockup */
.aiomh .dash{max-width:980px;margin:0 auto;background:var(--bg2);border:1px solid var(--line2);border-radius:14px;padding:20px;box-shadow:0 36px 96px rgba(0,0,0,.6)}
.aiomh .dash .top{display:flex;justify-content:space-between;padding-bottom:14px;border-bottom:1px solid var(--line2);margin-bottom:18px;font-family:var(--mono);font-size:10.5px;color:var(--fg3);letter-spacing:.12em;text-transform:uppercase}
.aiomh .dash .top b{color:var(--mint)}
.aiomh .dash .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}
.aiomh .dash .kpi{background:#0a0908;border:1px solid var(--line2);border-radius:8px;padding:14px;text-align:left}
.aiomh .dash .kpi .l{font-family:var(--mono);font-size:9.5px;color:var(--fg3);letter-spacing:.16em;margin-bottom:6px}
.aiomh .dash .kpi .n{font-family:var(--frau);font-size:24px;color:var(--fg);margin-bottom:4px}
.aiomh .dash .kpi .d{font-family:var(--mono);font-size:10px;color:var(--mint)}
.aiomh .dash .kpi .d.dn{color:#D78A8A}
.aiomh .dash .ch{background:#0a0908;border:1px solid var(--line2);border-radius:8px;padding:18px;height:200px;display:flex;align-items:flex-end;gap:6px}
.aiomh .dash .b{flex:1;background:linear-gradient(180deg,var(--gold),rgba(200,162,74,.3));border-radius:2px 2px 0 0}
@media(max-width:680px){.aiomh .dash .kpis{grid-template-columns:repeat(2,1fr)}}

.aiomh .doc{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.aiomh .dc{padding:32px 26px;border:1px solid var(--line2);border-radius:14px;background:var(--bg2);text-align:left}
.aiomh .dc .dn{font-family:var(--mono);font-size:11px;color:var(--mint);letter-spacing:.18em;text-transform:uppercase;margin-bottom:14px}
.aiomh .dc h3{font-family:var(--frau);font-size:22px;font-weight:500;margin-bottom:10px;text-align:center}
.aiomh .dc p{font-size:14px;line-height:1.8;color:var(--fg2);text-align:center}
@media(max-width:820px){.aiomh .doc{grid-template-columns:1fr 1fr}}
@media(max-width:540px){.aiomh .doc{grid-template-columns:1fr}}

.aiomh .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aiomh .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aiomh .v:last-child{border-right:none}
.aiomh .v .vn{font-family:var(--mono);font-size:10px;color:var(--mint);letter-spacing:.2em;margin-bottom:8px}
.aiomh .v .vt{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aiomh .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aiomh .vals{grid-template-columns:1fr 1fr}.aiomh .v:nth-child(2n){border-right:none}.aiomh .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

.aiomh .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aiomh .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(139,224,194,.10),transparent 70%)}
.aiomh .ctaS .wrap{position:relative}
.aiomh .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiomh .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiomh .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const Dashboard = () => (
  <div className="dash">
    <div className="top"><span>AIO · Growth Report</span><span><b>● Live</b> · 2026 May</span></div>
    <div className="kpis">
      <div className="kpi"><div className="l">방문자</div><div className="n">128,420</div><div className="d">▲ 42% MoM</div></div>
      <div className="kpi"><div className="l">전환율</div><div className="n">3.84%</div><div className="d">▲ 0.9pt</div></div>
      <div className="kpi"><div className="l">CPC</div><div className="n">₩ 318</div><div className="d dn">▼ 22%</div></div>
      <div className="kpi"><div className="l">ROAS</div><div className="n">412%</div><div className="d">▲ 1.4×</div></div>
    </div>
    <div className="ch">
      {[35, 42, 38, 52, 60, 58, 72, 78, 85, 92, 98].map((h, i) => <div key={i} className="b" style={{ height: `${h}%` }} />)}
    </div>
  </div>
);

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

      <header className="hero"><div className="wrap">
        <span className="kick">Marketing · 서비스 소개</span>
        <h1>유입은,<br /><em>꾸준함</em>이 만듭니다</h1>
        <p className="lead">블로그·SNS·영상채널 — 매일 보이는 운영이 한 달 뒤의 매출을 만듭니다. 한 번 만들고 끝나는 게 아니라 매주 보이는 결과로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/marketing/team`}>팀원 소개</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Live Report</span><h2>이런 <em>리포트</em>를 받습니다</h2><p>매주 KPI · 매월 종합 · 매분기 전략 — 보이게, 측정되게</p></div>
        <div className="reveal d1"><Dashboard /></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Services · 3 buckets</span><h2>운영 <em>대행</em></h2><p>채널은 다르지만 원칙은 같습니다 — 꾸준함 · 측정 · 개선</p></div>
        <div className="doc">
          <div className="dc reveal d1"><div className="dn">01 · 블로그 운영대행</div><h3>네이버·티스토리</h3><p>월 8~12편 / SEO 기반 키워드 → 글쓰기 → 발행 → 추적</p></div>
          <div className="dc reveal d2"><div className="dn">02 · SNS 운영대행</div><h3>인스타·릴스·틱톡</h3><p>월 20~30컷 / 컨셉 → 촬영·편집 → 발행 → 반응 분석</p></div>
          <div className="dc reveal d3"><div className="dn">03 · 영상채널 운영대행</div><h3>유튜브·숏폼</h3><p>월 4~8편 / 기획 → 촬영 → 편집·자막 → 썸네일 → 분석</p></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 준비 중</span><h2>가격은 <em>상담 후</em></h2><p>채널 수·발행 분량·광고비 운영 여부에 따라 다릅니다. 정식 가격표는 곧 공개</p></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">주간 리포트</div><div className="vd">매주 월요일 KPI 공유</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">월 종합</div><div className="vd">월말 종합 리포트 + 다음 달 계획</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">데이터 기반</div><div className="vd">GA4·서치콘솔·픽셀 연동</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">월 단위 계약</div><div className="vd">최소 3개월 / 해지 30일 전 통보</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>꾸준히 보이는<br /><em>운영</em>이 필요한가요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 1주 안에 첫 발행</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
