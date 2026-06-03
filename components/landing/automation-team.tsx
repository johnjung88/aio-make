"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "훈", role: "Automation Dev · 자동화개발", nm: "송지훈", career: "사람이 하던 일을 시스템이 대신하게 만들어드립니다 — Python · n8n · API 연동", duties: ["반복 업무 자동화 설계·구현", "Python · n8n · API 연동", "알림·보고서·데이터 자동화"] },
  { av: "재", role: "Ops · 요구분석", nm: "이재원", career: "고객 업무를 단계별로 정리해 자동화 범위를 정확히 설계합니다", duties: ["현행 업무 절차 단계별 분석", "입력·출력·예외 케이스 정리", "사용법 문서·납품 준비"] },
  { av: "아", role: "QA · 검수", nm: "최민아", career: "반복 실행해도 오류 없이 동작하는지 검증합니다 — 실행 검증 · 보안 · 납품 검수", duties: ["반복 실행·예외 케이스 검증", "계정·보안·약관 위험 검토", "PASS/WARN/FAIL 보고"] },
];

export function AutomationTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="automation-app" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Automation · 팀원 소개</span>
        <h1>자동화를 만드는<br /><em>사람들</em></h1>
        <p className="lead">요구분석·개발·검수 — 반복 업무를 시스템으로 대신합니다</p>
      </div></header>

      <OrgStructure svc="자동화" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 자동화 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
