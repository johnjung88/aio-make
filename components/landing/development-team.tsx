"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "리", role: "Planner · 기획", nm: "리아", career: "8년차 · IA/UX 설계 · 前 핀테크 PO", duties: ["사이트 IA·사이트맵·URL 구조 설계", "페이지별 섹션·CTA·문의 전환 흐름 설계", "PC/모바일 반응형 우선순위·기본 SEO 구조 정의"] },
  { av: "준", role: "Copywriter · 카피", nm: "준", career: "6년차 · 브랜드 카피라이터", duties: ["히어로 헤드라인·서브카피·CTA 작성", "섹션별 전환 카피·폼/FAQ 문구 작성", "SEO title·description·OG 문구 작성"] },
  { av: "도", role: "Designer · 디자인", nm: "도윤", career: "9년차 · 웹 UI/UX 디자이너", duties: ["디자인 토큰·컴포넌트 시안 설계", "페이지 시각 위계·그리드·히어로 비율 정의", "히어로/섹션 비주얼 제작·웹 최적화"] },
  { av: "세", role: "Developer · 개발", nm: "세호", career: "10년차 · 프론트엔드 · Next.js", duties: ["Next.js·반응형 사이트 구현", "폼·CTA·Supabase·배포·도메인 연동", "빌드·성능·브라우저 호환성 대응"] },
  { av: "현", role: "QA · Ops · 검수운영", nm: "현아", career: "7년차 · 웹 QA·운영", duties: ["반응형·링크·폼·SEO·OG 전수 검수", "배포 전 위험·롤백 포인트 점검", "납품 후 1개월 무상 유지보수"] },
];

export function DevelopmentTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="development" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Development · 팀원소개</span>
        <h1>개발을 만드는<br /><em>사람들</em></h1>
        <p className="lead">기획부터 카피·디자인·개발·검수까지 — 분야별 담당자가 한 프로젝트를 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="개발" />

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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
