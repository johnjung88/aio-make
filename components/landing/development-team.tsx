"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, DPNav, DPSubnav } from "./dp-shell";

type M = { av: string; role: string; nm: string; one: string; tags: string[] };
const TEAM: M[] = [
  { av: "의", role: "Founder", nm: "대표 · 의장", one: "고객 관계와 최종 결정을 책임집니다", tags: ["전략", "결정"] },
  { av: "아", role: "Lead PM", nm: "총괄 · 아대표", one: "프로젝트 우선순위와 품질을 관리합니다", tags: ["PM", "품질"] },
  { av: "리", role: "Planner", nm: "기획 · 리아", one: "목적과 흐름을 먼저 설계합니다", tags: ["IA", "와이어프레임"] },
  { av: "준", role: "Copywriter", nm: "카피 · 준", one: "읽게 만드는 한 줄을 씁니다", tags: ["메시지", "카피"] },
  { av: "도", role: "Designer", nm: "디자인 · 도윤", one: "첫인상을 디자인합니다", tags: ["UI", "비주얼"] },
  { av: "세", role: "Developer", nm: "개발 · 세호", one: "운영 가능한 상태로 구현·배포합니다", tags: ["Next.js", "반응형"] },
  { av: "현", role: "QA · Ops", nm: "검수·운영 · 현아", one: "끝까지 점검하고 유지보수합니다", tags: ["QA", "A/S"] },
];

export function DevelopmentTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <DPNav base={base} crumb="개발 / 팀원소개" />
      <DPSubnav base={base} cat="development" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Team · 개발</span>
        <h1>개발을 만드는<br /><em>사람들</em></h1>
        <p className="lead">기획부터 카피·디자인·개발·검수까지, 분야별 담당자가 프로젝트 하나를 처음부터 끝까지 함께합니다</p>
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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <footer className="foot"><div className="wrap">AIO · 개발 &nbsp;·&nbsp; 사업자 682-01-02748 &nbsp;·&nbsp; aiomake2023@gmail.com</div></footer>
    </div>
  );
}
