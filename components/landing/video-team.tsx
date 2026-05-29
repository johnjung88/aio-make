"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; one: string; tags: string[] };
const TEAM: M[] = [
  { av: "민", role: "Director", nm: "감독 · 민재", one: "한 컷의 무게를 압니다", tags: ["연출", "기획"] },
  { av: "정", role: "Editor", nm: "편집 · 정우", one: "리듬과 호흡으로 끝까지 보게 합니다", tags: ["편집", "컬러"] },
  { av: "—", role: "Producer · Soon", nm: "프로듀서 (준비 중)", one: "곧 합류합니다", tags: ["Soon"] },
];

export function VideoTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="video" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Video · 팀원 소개</span>
        <h1>영상을 만드는<br /><em>사람들</em></h1>
        <p className="lead">연출·편집·컬러·믹스까지 — 영상 한 편을 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="영상" />

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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 시안 컷</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
