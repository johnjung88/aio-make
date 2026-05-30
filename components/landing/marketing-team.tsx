"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "서", role: "Content Ops · 운영", nm: "서영", career: "7년차 · 블로그·SNS 콘텐츠 운영", duties: ["블로그·SNS 콘텐츠 기획·발행", "월간 운영 캘린더·키워드 설계", "채널 톤·가이드 관리"] },
  { av: "지", role: "Growth · 분석", nm: "지호", career: "8년차 · 퍼포먼스·데이터 분석", duties: ["GA4·전환·유입 분석·리포트", "채널 성장 실험·A/B 테스트", "데이터 기반 다음 액션 제안"] },
  { av: "나", role: "Content Designer · 디자인", nm: "나래", career: "5년차 · 콘텐츠 디자이너", duties: ["카드뉴스·썸네일·배너 제작", "채널별 비주얼 포맷·템플릿", "캠페인 소재 디자인"] },
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
              <div className="career">{m.career}</div>
              <ul className="duties">{m.duties.map((d, j) => <li key={j}>{d}</li>)}</ul>
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
