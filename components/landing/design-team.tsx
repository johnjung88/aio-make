"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; one: string; tags: string[] };
const TEAM: M[] = [
  { av: "유", role: "Detail Designer", nm: "상세 · 유나", one: "스크롤을 멈추게 만드는 상세를 만듭니다", tags: ["상세", "전환"] },
  { av: "한", role: "PPT Designer", nm: "PPT · 한결", one: "전달이 되는 슬라이드를 짭니다", tags: ["IR", "제안"] },
  { av: "—", role: "Logo · Soon", nm: "로고·명함 (준비 중)", one: "곧 합류합니다", tags: ["Soon"] },
];

export function DesignTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="design" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Design · 팀원 소개</span>
        <h1>디자인을 만드는<br /><em>사람들</em></h1>
        <p className="lead">상세페이지·PPT·로고까지, 분야별 전문가가 한 프로젝트를 끝까지 함께합니다</p>
      </div></header>

      <section className="sec wrap">
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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
