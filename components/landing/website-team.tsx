"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "리", role: "Planner · 기획", nm: "한리아", career: "만들기 전에 구조를 맞춰 수정 비용을 줄입니다 — IA · 사이트맵 · URL 설계", duties: ["IA·사이트맵·URL 구조 설계", "요구사항 정리 → 제작 구조 수립", "PC/모바일 반응형 우선순위 정의"] },
  { av: "연", role: "Copywriter · 카피", nm: "박서연", career: "검색에 걸리고 읽으면 행동하게 만드는 문장을 씁니다 — 히어로 카피 · SEO · CTA", duties: ["히어로 헤드라인·서브카피·CTA 작성", "섹션별 전환 카피·폼/FAQ 문구", "SEO title·description·OG 문구"] },
  { av: "도", role: "Web Designer · 디자인", nm: "오도윤", career: "어떤 기기에서도 보기 좋고 쓰기 편한 화면을 만듭니다 — 반응형 · UI/UX · 디자인 시스템", duties: ["디자인 토큰·컴포넌트 시안 설계", "반응형 그리드·히어로 비율 정의", "Figma 기반 UI/UX 시안"] },
  { av: "세", role: "Developer · 개발", nm: "정세호", career: "느리지 않고 다운되지 않는 구조로 구현합니다 — Next.js · Supabase · Vercel", duties: ["Next.js·반응형 사이트 구현", "폼·CTA·Supabase·배포·도메인 연동", "빌드·성능·브라우저 호환성 대응"] },
  { av: "현", role: "QA · 검수", nm: "신현아", career: "고객이 발견하기 전에 문제를 모두 잡아냅니다 — 반응형 · 링크 · 폼 · OG 전수 검수", duties: ["반응형·링크·폼·OG 전수 검수", "배포 전 위험·롤백 포인트 점검", "허구 클레임·접근성 점검"] },
  { av: "은", role: "Ops · 납품운영", nm: "강지은", career: "납품 후에도 문제가 생기면 바로 대응합니다 — 배포 · 도메인 · A/S", duties: ["도메인·호스팅·추적코드 세팅", "납품 패키지 준비·고객 전달 안내", "납품 후 1개월 무상 유지보수"] },
];

export function WebsiteTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="website" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Website · 팀원 소개</span>
        <h1>웹사이트를 만드는<br /><em>사람들</em></h1>
        <p className="lead">기획·카피·디자인·개발·검수·납품 — 한 사이트를 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="웹사이트" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 웹사이트 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
        <div className="team" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
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
