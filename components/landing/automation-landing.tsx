"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aioam{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;--mint:#8BE0C2;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);--fs-body:clamp(14px,1.1vw,15.5px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aioam *{box-sizing:border-box}
.aioam a{text-decoration:none;color:inherit}
.aioam .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aioam .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
.aioam .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s,transform 1.1s}.aioam .reveal.in{opacity:1;transform:none}
.aioam .reveal.d1{transition-delay:.1s}.aioam .reveal.d2{transition-delay:.2s}.aioam .reveal.d3{transition-delay:.3s}
.aioam .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--gold),var(--mint))}
.aioam .hero{position:relative;padding:clamp(74px,12vw,156px) 0 clamp(50px,7vw,80px);overflow:hidden}
.aioam .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 58% at 50% 18%,rgba(139,224,194,.08),transparent 70%);pointer-events:none}
.aioam .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.0;letter-spacing:-.01em;margin-bottom:30px}
.aioam .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aioam .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 auto clamp(34px,5vw,44px)}
.aioam .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aioam .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aioam .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aioam .sec{padding:var(--sp-sec) 0}
.aioam .shead{margin-bottom:48px}
.aioam .shead .kick{display:block;margin-bottom:18px}
.aioam .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px;letter-spacing:-.012em}
.aioam .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aioam .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

.aioam .term{max-width:860px;margin:0 auto;background:#0a0908;border:1px solid var(--line2);border-radius:12px;overflow:hidden;text-align:left;box-shadow:0 32px 80px rgba(0,0,0,.55);font-family:var(--mono);font-size:13px;line-height:1.9}
.aioam .term .tbar{display:flex;align-items:center;gap:8px;padding:11px 14px;border-bottom:1px solid var(--line2);background:#181613}
.aioam .term .tbar .d{width:10px;height:10px;border-radius:50%}
.aioam .term .tbar .d.r{background:#ff5f57}.aioam .term .tbar .d.y{background:#febc2e}.aioam .term .tbar .d.g{background:#28c840}
.aioam .term .tbar .name{margin-left:8px;color:var(--fg3);font-size:11px;letter-spacing:.06em}
.aioam .term .body{padding:22px 22px 24px;color:var(--fg2)}
.aioam .term .pr{color:var(--gold)}
.aioam .term .v{color:var(--mint)}
.aioam .term .c{color:var(--fg3)}
.aioam .term .o{color:#E0BE6A}

.aioam .doc{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
.aioam .dc{padding:30px 22px;border:1px solid var(--line2);border-radius:14px;background:var(--bg2);text-align:left}
.aioam .dc .dn{font-family:var(--mono);font-size:10.5px;color:var(--gold);letter-spacing:.16em;text-transform:uppercase;margin-bottom:14px}
.aioam .dc h3{font-family:var(--frau);font-size:20px;font-weight:500;margin-bottom:10px;text-align:center}
.aioam .dc p{font-size:13.5px;line-height:1.8;color:var(--fg2);text-align:center}
@media(max-width:820px){.aioam .doc{grid-template-columns:1fr 1fr}}
@media(max-width:540px){.aioam .doc{grid-template-columns:1fr}}

.aioam .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aioam .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aioam .v:last-child{border-right:none}
.aioam .v .vn{font-family:var(--mono);font-size:10px;color:var(--gold);letter-spacing:.2em;margin-bottom:8px}
.aioam .v .vt{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aioam .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aioam .vals{grid-template-columns:1fr 1fr}.aioam .v:nth-child(2n){border-right:none}.aioam .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

.aioam .price{max-width:540px;margin:48px auto 0;padding:36px 30px;border:1px solid var(--gold);border-radius:14px;text-align:center}
.aioam .price .pname{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
.aioam .price .pnum{font-family:var(--frau);font-size:clamp(28px,4vw,40px);margin-bottom:6px}
.aioam .price .pnum em{font-style:normal;color:var(--gold)}
.aioam .price .pdesc{font-size:13.5px;line-height:1.85;color:var(--fg2);margin-top:10px;max-width:36ch;margin-left:auto;margin-right:auto}
.aioam .price .reg{font-family:var(--mono);font-size:11px;color:var(--fg3);margin-top:12px;letter-spacing:.06em}

.aioam .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aioam .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(139,224,194,.08),transparent 70%)}
.aioam .ctaS .wrap{position:relative}
.aioam .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aioam .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aioam .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:34px}
`;

const Terminal = () => (
  <div className="term">
    <div className="tbar"><span className="d r" /><span className="d y" /><span className="d g" /><span className="name">aio@auto:~/order-bot.py</span></div>
    <div className="body">
      <div><span className="c"># 매일 09:00 — 주문 수집 → 엑셀 → 텔레그램</span></div>
      <div><span className="pr">$</span> <span className="o">python</span> order-bot.py <span className="v">--schedule daily</span></div>
      <div><span className="c">→ 카페24 API 인증… <span className="v">OK</span></span></div>
      <div><span className="c">→ 어제 주문 <span className="v">142</span>건 수집 완료</span></div>
      <div><span className="c">→ 정산표 생성: <span className="v">orders_20260528.xlsx</span></span></div>
      <div><span className="c">→ 텔레그램 발송: <span className="v">@aio_alert</span></span></div>
      <div><span className="pr">✓</span> <span className="o">완료</span> — <span className="v">9분 23초 단축</span> · 매일 자동 실행</div>
    </div>
  </div>
);

export function AutomationLanding({ locale }: { locale: string }) {
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
    <div className="aioam" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="automation-app" active="service" />

      <header className="hero"><div className="wrap">
        <span className="kick">AIO · Automation & Programs</span>
        <h1>반복은 코드에,<br /><em>시간</em>은 당신에게</h1>
        <p className="lead">엑셀·데이터·크롤링·매크로 — 매일 반복되는 작업을 코드로 · 데스크탑 프로그램·텔레그램 봇·시트 자동화까지</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/automation-app/portfolio`}>포트폴리오 보기</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Preview</span><h2>이런 <em>자동화</em>를 만듭니다</h2><p>주문·정산·재고·리포트 — 매일 9분 걸리는 일을 9초로</p></div>
        <div className="reveal d1"><Terminal /></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">What we build</span><h2>만드는 <em>도구들</em></h2></div>
        <div className="doc">
          <div className="dc reveal d1"><div className="dn">01 · 데이터 수집</div><h3>크롤링·파싱</h3><p>여러 사이트의 데이터를 자동으로 모아 정리합니다</p></div>
          <div className="dc reveal d2"><div className="dn">02 · 엑셀·시트 자동화</div><h3>리포트 자동 생성</h3><p>매일/매주 반복되는 엑셀 작업을 자동화합니다</p></div>
          <div className="dc reveal d3"><div className="dn">03 · 데스크탑 프로그램</div><h3>업무용 매크로</h3><p>Windows/Mac 데스크탑에서 돌아가는 전용 도구</p></div>
          <div className="dc reveal d1"><div className="dn">04 · 외부 API 연동</div><h3>노션·시트·텔레그램</h3><p>여러 서비스를 묶어 알림·기록·승인을 자동으로</p></div>
          <div className="dc reveal d2"><div className="dn">05 · 챗봇·알림봇</div><h3>텔레그램·슬랙</h3><p>매일 9시 자동 보고·이상치 알림·승인 응답</p></div>
          <div className="dc reveal d3"><div className="dn">06 · 데이터 정제</div><h3>대량 데이터 처리</h3><p>1만 줄 이상의 데이터를 일관된 포맷으로</p></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 한정 (~26년 6월)</span><h2>가격은 <em>상담 후</em></h2><p>요구사항·데이터 양·연동 범위에 따라 다릅니다 · 표시는 기준 가격대</p></div>
        <div className="price reveal d1">
          <div className="pname">기준 가격대 (한정)</div>
          <div className="pnum"><em>19.9 ~ 49.9</em> 만원</div>
          <div className="pdesc">단순 매크로·시트 자동화부터 데스크탑 프로그램·다중 API 연동까지</div>
          <div className="reg">정상가 기준 3배 · 상담 후 정확한 견적 발송</div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">매일 공유</div><div className="vd">진행을 매일 알려드립니다</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">실행 가능</div><div className="vd">설치·실행 안내까지 끝내드립니다</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 3~14일 — 다음 날 착수</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">책임 A/S</div><div className="vd">납품 후 한 달 무상 유지보수</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>줄이고 싶은<br /><em>반복</em>이 있나요?</h2>
        <p>지금 문의하면 24시간 안에 기준 견적 · 3일 안에 1차 데모</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
