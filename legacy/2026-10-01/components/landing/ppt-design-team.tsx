"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "기", role: "Analyst · 분석기획", nm: "박기원", career: "발표 목적과 청중을 분석해 슬라이드 구조를 정확히 설계합니다 — 구조 분석 · 메시지 위계 기획", duties: ["발표 목적·청중·메시지 분석", "슬라이드 구조·목차·흐름 기획", "기획안·초안 브리핑 문서"] },
  { av: "원", role: "PPT Designer · 디자인", nm: "류지원", career: "복잡한 내용을 한 슬라이드에 명확히 정리합니다 — IR 덱 · 제안서 · 공모전", duties: ["제안·IR·사업계획 슬라이드 디자인", "메시지 위계·도식화·인포그래픽", "발표용 비주얼 시스템·템플릿"] },
  { av: "진", role: "Copywriter · 카피", nm: "오유진", career: "숫자와 논리를 설득력 있는 문장으로 바꿉니다 — IR 카피 · 제안 내러티브", duties: ["핵심 메시지·슬라이드 카피 작성", "IR 내러티브·투자자 언어 최적화", "발표 스크립트·보조 문구"] },
  { av: "호", role: "QA · Ops · 검수운영", nm: "한재호", career: "납품 전 전수 검수하고 파일 포맷·호환성까지 챙깁니다 — 품질 검증 · 납품 운영", duties: ["슬라이드·폰트·링크 전수 검수", "PPT/PDF/Keynote 포맷 호환 점검", "납품 패키지 준비·수정 대응"] },
];

export function PptDesignTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" sub="ppt-design" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">PPT · IR · 팀원 소개</span>
        <h1>발표 자료를 만드는<br /><em>사람들</em></h1>
        <p className="lead">분석기획·디자인·카피·검수 — 슬라이드 하나가 Yes를 만들어냅니다</p>
      </div></header>

      <OrgStructure svc="PPT·IR" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · PPT·IR 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
        <div className="team" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
