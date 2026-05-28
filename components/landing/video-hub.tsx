"use client";
import { useEffect, useRef } from "react";
import { AioNav, AioFooter } from "./aio-nav";

const CSS = `
.aiovh{--bg:#08080A;--bg2:#101013;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;--line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--amber:#E8A340;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(42px,8vw,104px);--fs-h2:clamp(29px,5vw,58px);--fs-lead:clamp(15px,1.5vw,18px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(72px,10vw,140px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiovh *{box-sizing:border-box}
.aiovh a{text-decoration:none;color:inherit}
.aiovh .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiovh .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--amber)}
.aiovh .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s,transform 1.1s}.aiovh .reveal.in{opacity:1;transform:none}
.aiovh .reveal.d1{transition-delay:.1s}.aiovh .reveal.d2{transition-delay:.2s}.aiovh .reveal.d3{transition-delay:.3s}
.aiovh .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--amber),var(--gold))}
.aiovh .hero{position:relative;padding:clamp(74px,12vw,156px) 0 clamp(50px,7vw,80px);overflow:hidden}
.aiovh .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 65% 50% at 50% 30%,rgba(232,163,64,.16),transparent 70%)}
.aiovh .hero::after{content:"";position:absolute;left:0;right:0;top:0;height:60px;background:#000;z-index:1}
.aiovh .hero .barb{content:"";position:absolute;left:0;right:0;bottom:0;height:60px;background:#000;z-index:1}
.aiovh .hero .wrap{position:relative;z-index:2}
.aiovh .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.0;letter-spacing:-.01em;margin-bottom:30px}
.aiovh .hero h1 em{font-style:normal;color:var(--amber);font-weight:600}
.aiovh .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:42ch;margin:0 auto clamp(34px,5vw,44px)}
.aiovh .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center}
.aiovh .cta-pill{font-size:14px;font-weight:600;padding:14px 32px;border-radius:999px;background:var(--amber);color:#08080A}
.aiovh .cta-link{font-family:var(--mono);font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--fg2);border-bottom:1px solid var(--line);padding-bottom:6px}
.aiovh .sec{padding:var(--sp-sec) 0}
.aiovh .shead{margin-bottom:48px}
.aiovh .shead .kick{display:block;margin-bottom:18px}
.aiovh .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.06;margin-bottom:14px}
.aiovh .shead h2 em{font-style:normal;color:var(--amber);font-weight:600}
.aiovh .shead p{font-size:var(--fs-lead);line-height:1.8;color:var(--fg2);max-width:50ch;margin:0 auto}

/* Film strip */
.aiovh .film{max-width:980px;margin:0 auto;border:1px solid var(--line2);border-radius:6px;overflow:hidden;background:#000;padding:14px 0;position:relative}
.aiovh .film::before,.aiovh .film::after{content:"";position:absolute;left:0;right:0;height:14px;background-image:repeating-linear-gradient(90deg,transparent 0,transparent 18px,rgba(239,233,221,.12) 18px,rgba(239,233,221,.12) 28px);background-size:auto}
.aiovh .film::before{top:0}.aiovh .film::after{bottom:0}
.aiovh .frames{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 16px}
.aiovh .frame{aspect-ratio:16/9;border:1px solid var(--line2);background:linear-gradient(135deg,rgba(232,163,64,.22),rgba(200,162,74,.10));position:relative;border-radius:2px}
.aiovh .frame::after{content:attr(data-l);position:absolute;left:8px;bottom:6px;font-family:var(--mono);font-size:9px;color:rgba(239,233,221,.5);letter-spacing:.2em}
@media(max-width:680px){.aiovh .frames{grid-template-columns:repeat(2,1fr)}}

.aiovh .doc{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;margin-top:48px}
.aiovh .dc{padding:32px 26px;border:1px solid var(--line2);border-radius:14px;background:var(--bg2);text-align:left}
.aiovh .dc .dn{font-family:var(--mono);font-size:11px;color:var(--amber);letter-spacing:.18em;text-transform:uppercase;margin-bottom:14px}
.aiovh .dc h3{font-family:var(--frau);font-size:22px;font-weight:500;margin-bottom:10px;text-align:center}
.aiovh .dc p{font-size:14px;line-height:1.8;color:var(--fg2);text-align:center}
@media(max-width:760px){.aiovh .doc{grid-template-columns:1fr}}

.aiovh .vals{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:24px;max-width:920px;margin-left:auto;margin-right:auto}
.aiovh .v{padding:26px 18px;border-right:1px solid var(--line2)}
.aiovh .v:last-child{border-right:none}
.aiovh .v .vn{font-family:var(--mono);font-size:10px;color:var(--amber);letter-spacing:.2em;margin-bottom:8px}
.aiovh .v .vt{font-family:var(--frau);font-size:18px;margin-bottom:6px}
.aiovh .v .vd{font-size:12.5px;line-height:1.7;color:var(--fg2)}
@media(max-width:760px){.aiovh .vals{grid-template-columns:1fr 1fr}.aiovh .v:nth-child(2n){border-right:none}.aiovh .v:nth-child(-n+2){border-bottom:1px solid var(--line2)}}

.aiovh .ctaS{padding:var(--sp-sec) 0;position:relative;overflow:hidden}
.aiovh .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 50%,rgba(232,163,64,.10),transparent 70%)}
.aiovh .ctaS .wrap{position:relative}
.aiovh .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiovh .ctaS h2 em{font-style:normal;color:var(--amber);font-weight:600}
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

      <header className="hero"><div className="wrap">
        <span className="kick">Video · 서비스 소개</span>
        <h1>한 컷이,<br /><em>전부</em>입니다</h1>
        <p className="lead">브랜드·SNS·마케팅·유튜브 — 첫 3초가 결정합니다. 보여주기용 영상이 아니라 머무르게 만드는 영상으로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/video/team`}>팀원 소개</a></div>
      </div><div className="barb" /></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Reel</span><h2>이런 <em>영상</em>을 만듭니다</h2><p>브랜드 무드부터 SNS 숏폼까지 — 톤·컷·리듬을 직접</p></div>
        <div className="film reveal d1"><div className="frames">
          <div className="frame" data-l="BRAND · 01" />
          <div className="frame" data-l="BRAND · 02" />
          <div className="frame" data-l="SNS · SHORT" />
          <div className="frame" data-l="SNS · VLOG" />
        </div></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Services</span><h2>영상 <em>분야</em></h2><p>제작·편집·운영 — 필요한 만큼 빌려갑니다</p></div>
        <div className="doc">
          <div className="dc reveal d1"><div className="dn">01 · 브랜드 영상</div><h3>회사·제품 소개</h3><p>홈페이지·전시·세일즈 — 한 번 만들고 오래 쓰는 무게감 있는 영상</p></div>
          <div className="dc reveal d2"><div className="dn">02 · SNS 영상</div><h3>숏폼·릴스·틱톡</h3><p>15~60초 짧고 강한 컷 — 첫 1초에 멈추게 만드는 흐름</p></div>
          <div className="dc reveal d1"><div className="dn">03 · 마케팅 영상</div><h3>광고·전환 영상</h3><p>유튜브 광고·SNS 광고·랜딩 영상 — 데이터 기반 컷 구성</p></div>
          <div className="dc reveal d2"><div className="dn">04 · 유튜브 편집</div><h3>채널 운영용</h3><p>인트로·자막·컷 편집·썸네일 — 채널 톤 일관성 유지</p></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Pricing · 준비 중</span><h2>가격은 <em>상담 후</em></h2><p>영상은 분량·촬영 유무·소스 사용 범위에 따라 다릅니다. 정식 가격표는 곧 공개</p></div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="vals reveal d1">
          <div className="v"><div className="vn">01</div><div className="vt">레퍼런스 먼저</div><div className="vd">방향을 시안으로 먼저 합의</div></div>
          <div className="v"><div className="vn">02</div><div className="vt">2차 수정</div><div className="vd">시안·러프·파인 2차 무료</div></div>
          <div className="v"><div className="vn">03</div><div className="vt">소스 보관</div><div className="vd">원본 소스 1년 보관</div></div>
          <div className="v"><div className="vn">04</div><div className="vt">빠른 속도</div><div className="vd">의뢰 후 5~14일, 다음 날 착수</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>찍을 게<br /><em>있나요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 시안 컷</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
