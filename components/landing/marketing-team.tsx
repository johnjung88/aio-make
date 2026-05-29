"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; one: string; tags: string[] };
const TEAM: M[] = [
  { av: "서", role: "Content Ops", nm: "콘텐츠 · 서영", one: "꾸준히 보이는 운영을 만듭니다", tags: ["블로그", "SNS"] },
  { av: "지", role: "Growth", nm: "그로스 · 지호", one: "데이터에서 다음 한 수를 봅니다", tags: ["GA", "리포트"] },
  { av: "—", role: "Designer · Soon", nm: "마케팅 디자이너 (준비 중)", one: "곧 합류합니다", tags: ["Soon"] },
];

export function MarketingTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="marketing" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Marketing · 팀원 소개</span>
        <h1>운영하는<br /><em>사람들</em></h1>
        <p className="lead">콘텐츠·운영·데이터 — 꾸준히 보이는 결과를 함께 만듭니다</p>
      </div></header>

      <OrgStructure svc="마케팅" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 실무팀</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
        <div className="team">
          {TEAM.map((m, i) => (
            <div key={i} className={"mem reveal d" + ((i % 4) + 1)}>
              <div className="av">{m.av}</div>
              <div className="role">{m.role}</div>
              <div className="nm">{m.nm}</div>
              <div className="one">{m.one}</div>
              <div className="tags">{m.tags.map((t, j) => <span key={j}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>함께 만들어<br /><em>볼까요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적 · 1주 안에 첫 발행</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
