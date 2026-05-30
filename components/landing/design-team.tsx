"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "유", role: "Detail Designer · 상세", nm: "유나", career: "8년차 · 커머스 상세·전환 디자인", duties: ["상품·서비스 상세페이지 기획·디자인", "시선→정보→증거→CTA 흐름 설계", "모바일 가독성·길이 최적화"] },
  { av: "한", role: "PPT Designer · 발표", nm: "한결", career: "9년차 · IR·제안서 디자이너", duties: ["제안·IR·사업계획 슬라이드 디자인", "메시지 위계·도식화·인포그래픽", "발표용 비주얼 시스템·템플릿"] },
  { av: "민", role: "Brand Designer · 브랜드", nm: "민서", career: "7년차 · 로고·BI 디자이너", duties: ["로고·심볼·워드마크 컨셉", "명함·브랜드 키트·적용 가이드", "컬러·타이포 브랜드 시스템"] },
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
        <p className="lead">상세페이지·PPT·로고까지 — 분야별 전문가가 한 프로젝트를 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="디자인" />

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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
