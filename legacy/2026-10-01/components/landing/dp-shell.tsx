"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export const DP_CSS = `
.aiodp{--bg:#0E0D0B;--bg2:#17150F;--fg:#EFE9DD;--fg2:#B7B0A2;--fg3:#6F6A5E;
  --line:rgba(200,162,74,.22);--line2:rgba(239,233,221,.10);--gold:#C8A24A;--gold2:#E0BE6A;
  --frau:var(--font-fraunces);--pret:var(--font-pretendard);--mono:var(--font-ibm-plex-mono);
  --fs-display:clamp(40px,7.5vw,92px);--fs-h2:clamp(28px,4.6vw,52px);--fs-lead:clamp(15px,1.5vw,18px);--fs-body:clamp(14px,1.1vw,15.5px);
  --fs-kick:clamp(10px,1vw,11px);--sp-sec:clamp(70px,10vw,134px);--sp-edge:clamp(20px,5vw,64px);--maxw:1180px;
  background:var(--bg);color:var(--fg);font-family:var(--pret);word-break:keep-all;overflow-wrap:break-word;text-align:center;min-height:100vh}
.aiodp *{box-sizing:border-box}
.aiodp a{text-decoration:none;color:inherit}
.aiodp .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge)}
.aiodp .kick{font-family:var(--mono);font-size:var(--fs-kick);letter-spacing:.34em;text-transform:uppercase;color:var(--gold)}
@keyframes aiodp-rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
.aiodp .reveal{opacity:0;transform:translateY(28px);transition:opacity 1.1s cubic-bezier(.2,1,.3,1),transform 1.1s cubic-bezier(.2,1,.3,1)}
.aiodp .reveal.in{opacity:1;transform:none}
.aiodp .reveal.d1{transition-delay:.1s}.aiodp .reveal.d2{transition-delay:.2s}.aiodp .reveal.d3{transition-delay:.3s}.aiodp .reveal.d4{transition-delay:.4s}
.aiodp .prog{position:fixed;top:0;left:0;height:2px;width:0;z-index:99;background:linear-gradient(90deg,var(--gold),var(--gold2))}
.aiodp .nav{position:sticky;top:0;z-index:50;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background:rgba(14,13,11,.82);border-bottom:1px solid var(--line2)}
.aiodp .nav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;align-items:center;height:62px;text-align:left}
.aiodp .nav .b{font-family:var(--frau);font-weight:600;font-size:20px}.aiodp .nav .b em{font-style:normal;color:var(--gold)}
.aiodp .nav .crumb{font-family:var(--mono);font-size:11px;color:var(--fg3);margin-left:16px;letter-spacing:.1em;text-transform:uppercase}
.aiodp .nav .ncta{margin-left:auto;font-size:13px;font-weight:600;padding:9px 20px;border-radius:999px;background:var(--gold);color:#0E0D0B}
.aiodp .subnav{position:sticky;top:62px;z-index:49;background:rgba(14,13,11,.9);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border-bottom:1px solid var(--line2)}
.aiodp .subnav .nw{max-width:var(--maxw);margin:0 auto;padding:0 var(--sp-edge);display:flex;gap:4px;height:50px;align-items:center;justify-content:center;overflow-x:auto;scrollbar-width:none}
.aiodp .subnav .nw::-webkit-scrollbar{display:none}
.aiodp .subnav a{font-family:var(--mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);padding:8px 16px;white-space:nowrap;border-bottom:2px solid transparent;transition:color .2s,border-color .2s}
.aiodp .subnav a:hover{color:var(--fg)}.aiodp .subnav a.on{color:var(--gold);border-bottom-color:var(--gold)}
.aiodp .hero{position:relative;text-align:center;padding:clamp(80px,13vw,160px) 0 clamp(46px,6vw,70px);overflow:hidden}
.aiodp .hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 58% at 50% 16%,rgba(200,162,74,.11),transparent 70%);pointer-events:none}
.aiodp .hero .wrap{position:relative}
.aiodp .hero .kick{display:block;margin-bottom:26px;animation:aiodp-rise .8s both}
.aiodp .hero h1{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.02;letter-spacing:-.01em;margin-bottom:28px;animation:aiodp-rise 1s .1s both}
.aiodp .hero h1 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp .hero .lead{font-size:var(--fs-lead);line-height:1.85;color:var(--fg2);max-width:46ch;margin:0 auto clamp(30px,4vw,40px);animation:aiodp-rise 1s .26s both}
.aiodp .acts{display:inline-flex;align-items:center;gap:24px;flex-wrap:wrap;justify-content:center;animation:aiodp-rise 1s .38s both}
.aiodp .cta-pill{font-size:15px;font-weight:600;padding:15px 32px;border-radius:999px;background:var(--gold);color:#0E0D0B;transition:transform .25s,background .25s;display:inline-flex;align-items:center;gap:8px}
.aiodp .cta-pill:hover{transform:translateY(-2px);background:var(--gold2)}
.aiodp .cta-link{font-family:var(--mono);font-size:13px;letter-spacing:.1em;color:var(--gold);border-bottom:1px solid var(--gold);padding-bottom:3px}
.aiodp .sec{padding:var(--sp-sec) 0}
.aiodp .shead{margin-bottom:clamp(40px,5vw,56px);text-align:center}
.aiodp .shead .kick{display:inline-block;margin-bottom:16px}
.aiodp .shead h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-h2);line-height:1.1;letter-spacing:-.01em}
.aiodp .shead h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp .shead p{color:var(--fg2);font-size:var(--fs-body);line-height:1.8;max-width:50ch;margin:14px auto 0}
.aiodp .dogrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.aiodp .doc{border:1px solid var(--line2);border-radius:12px;padding:clamp(26px,3vw,36px);background:var(--bg2);text-align:center;transition:border-color .3s,transform .3s}
.aiodp .doc:hover{border-color:var(--gold);transform:translateY(-5px)}
.aiodp .doc .no{font-family:var(--frau);color:var(--gold);font-size:20px;margin-bottom:10px}
.aiodp .doc .dn{font-family:var(--frau);font-size:clamp(22px,2.6vw,28px);font-weight:500;margin-bottom:8px}
.aiodp .doc .dd{color:var(--fg2);font-size:var(--fs-body);line-height:1.75}
.aiodp .doc .soon{font-family:var(--mono);font-size:10.5px;color:var(--fg3);letter-spacing:.14em;border:1px solid var(--line2);border-radius:999px;padding:3px 10px;display:inline-block;margin-top:12px}
.aiodp .ways{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--line2);border-radius:14px;overflow:hidden;max-width:920px;margin:0 auto;background:var(--bg2)}
.aiodp .way{padding:clamp(28px,3vw,38px) 18px;border-right:1px solid var(--line2);text-align:center}
.aiodp .way:last-child{border-right:none}
.aiodp .way .wt{font-family:var(--frau);font-size:19px;font-weight:500;margin-bottom:8px;color:var(--gold)}
.aiodp .way .wd{color:var(--fg2);font-size:13px;line-height:1.7;max-width:24ch;margin:0 auto}
.aiodp .stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.aiodp .stat{text-align:center;padding:10px}
.aiodp .stat .sv{font-family:var(--frau);font-weight:600;font-size:clamp(30px,4.5vw,52px);color:var(--gold);line-height:1;margin-bottom:8px}
.aiodp .stat .sl{color:var(--fg2);font-size:13px}
.aiodp .team{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.aiodp .mem{border:1px solid var(--line2);border-radius:14px;padding:clamp(24px,2.6vw,30px);text-align:left;background:var(--bg2);transition:border-color .3s,transform .3s}
.aiodp .mem:hover{border-color:var(--gold);transform:translateY(-6px)}
.aiodp .mem .av{width:60px;height:60px;border-radius:50%;margin:0 0 14px;border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;color:var(--gold);font-family:var(--frau);font-size:24px}
.aiodp .mem .role{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg3);margin-bottom:6px}
.aiodp .mem .nm{font-family:var(--frau);font-size:19px;font-weight:500;margin-bottom:10px}
.aiodp .mem .one{font-size:12.5px;color:var(--fg2);line-height:1.6;margin-bottom:12px;min-height:3.2em}
.aiodp .mem .tags{display:flex;flex-wrap:wrap;gap:5px;justify-content:center}
.aiodp .mem .tags span{font-family:var(--mono);font-size:10px;color:var(--fg2);border:1px solid var(--line2);border-radius:999px;padding:3px 9px}
.aiodp .mem .career{font-family:var(--mono);font-size:11px;letter-spacing:.02em;color:var(--gold);margin-bottom:13px;line-height:1.5}
.aiodp .mem .duties{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:7px}
.aiodp .mem .duties li{position:relative;padding-left:13px;font-size:12.5px;color:var(--fg2);line-height:1.55}
.aiodp .mem .duties li::before{content:"";position:absolute;left:0;top:8px;width:4px;height:4px;border-radius:50%;background:var(--gold)}
.aiodp .ctaS{position:relative;text-align:center;padding:clamp(86px,12vw,140px) 0;border-top:1px solid var(--line)}
.aiodp .ctaS::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 70% at 50% 50%,rgba(200,162,74,.1),transparent 70%);pointer-events:none}
.aiodp .ctaS .wrap{position:relative}
.aiodp .ctaS h2{font-family:var(--frau);font-weight:400;font-size:var(--fs-display);line-height:1.04;margin-bottom:22px}
.aiodp .ctaS h2 em{font-style:normal;color:var(--gold);font-weight:600}
.aiodp .ctaS p{color:var(--fg2);font-size:var(--fs-lead);margin-bottom:32px}
.aiodp .foot{border-top:1px solid var(--line2);padding:40px 0;text-align:center;font-family:var(--mono);font-size:11px;letter-spacing:.08em;color:var(--fg3);line-height:2}
@media(max-width:820px){.aiodp .dogrid{grid-template-columns:1fr}.aiodp .ways{grid-template-columns:1fr 1fr;max-width:540px}.aiodp .way:nth-child(2n){border-right:none}.aiodp .way:nth-child(-n+2){border-bottom:1px solid var(--line2)}.aiodp .stats{grid-template-columns:1fr 1fr}.aiodp .team{grid-template-columns:1fr!important}}
.aiodp .org{max-width:660px;margin:0 auto;display:flex;flex-direction:column;align-items:center}
.aiodp .org .lvl{width:100%;border:1px solid var(--line2);border-radius:12px;background:var(--bg2);padding:18px 24px;text-align:center;transition:border-color .3s,transform .3s}
.aiodp .org .lvl:hover{border-color:var(--gold);transform:translateY(-3px)}
.aiodp .org .lvl.lead2{border-color:var(--gold);background:linear-gradient(180deg,rgba(200,162,74,.08),var(--bg2))}
.aiodp .org .lvl .lr{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:7px}
.aiodp .org .lvl .lb{display:block;font-family:var(--frau);font-size:clamp(19px,2.2vw,25px);font-weight:600;color:var(--fg);line-height:1.12}
.aiodp .org .lvl .ld{display:block;margin-top:7px;font-size:13px;color:var(--fg2);line-height:1.6}
.aiodp .org .orgline{width:2px;height:24px;background:linear-gradient(var(--gold),rgba(200,162,74,.15))}
`;

export function OrgStructure({ svc }: { svc: string }) {
  return (
    <section className="sec wrap">
      <div className="shead reveal"><span className="kick">Structure · 책임 구조</span><h2>한 프로젝트, <em>분명한 책임선</em></h2><p>의장의 최종 결정 아래, 총괄 PM이 일정·품질을 관리하고 {svc} PM이 실무팀을 이끕니다</p></div>
      <div className="org reveal d1">
        <div className="lvl"><span className="lr">Chair · 의장</span><span className="lb">최종 결정</span><span className="ld">고객 관계 · 가격 · 납기 · 결재</span></div>
        <span className="orgline" />
        <div className="lvl lead2"><span className="lr">Lead · 총괄 PM</span><span className="lb">대표 · 총괄 PM</span><span className="ld">우선순위 · 진행 관리 · 품질·리스크 · 보고</span></div>
        <span className="orgline" />
        <div className="lvl"><span className="lr">PM · 서비스</span><span className="lb">{svc} PM</span><span className="ld">이 서비스 납품 책임 · 일정·범위 조율</span></div>
        <span className="orgline" />
        <div className="lvl"><span className="lr">Team · 실무</span><span className="lb">실무팀</span><span className="ld">기획 · 카피 · 디자인 · 개발 · 검수·운영</span></div>
      </div>
    </section>
  );
}

export function useDarkPremium(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current; if (!root) return;
    const prog = root.querySelector<HTMLElement>(".prog");
    const onScroll = () => { const h = document.documentElement; if (prog) prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%"; };
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .14 });
    root.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, [ref]);
}

export function DPNav({ base, crumb }: { base: string; crumb: string }) {
  return (
    <div className="nav"><div className="nw"><span className="b">A<em>I</em>O</span><span className="crumb">{crumb}</span><a className="ncta" href={`${base}/quote`}>무료 상담 →</a></div></div>
  );
}

export function DPSubnav({ base, cat, active }: { base: string; cat: string; active: "about" | "team" | "service" | "portfolio" }) {
  const items: { key: string; label: string; href: string }[] = [
    { key: "about", label: "회사소개", href: `${base}/services/${cat}/about` },
    { key: "team", label: "팀원소개", href: `${base}/services/${cat}/team` },
    { key: "service", label: "서비스 소개", href: `${base}/services/${cat}` },
    { key: "portfolio", label: "포트폴리오", href: `${base}/services/${cat}` },
  ];
  return (
    <div className="subnav"><div className="nw">
      {items.map((it) => <a key={it.key} className={active === it.key ? "on" : ""} href={it.href}>{it.label}</a>)}
    </div></div>
  );
}
