"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "설", role: "Analyst · 분석기획", nm: "김설아", career: "상품·서비스의 강점을 분석해 전환으로 이어지는 구조를 설계합니다 — 시장 분석 · 경쟁사 벤치마킹 · 기획", duties: ["시장·경쟁사·고객 리뷰 분석", "전환 구조·섹션 흐름 기획", "기획서·브리핑 문서 작성"] },
  { av: "유", role: "Detail Designer · 디자인", nm: "나유나", career: "보는 사람이 구매 버튼을 누르게 설계합니다 — 전환율 최적화 · 스크롤 스토리텔링", duties: ["상품·서비스 상세페이지 시안 제작", "시선→정보→증거→CTA 흐름 설계", "모바일 가독성·전환율 최적화"] },
  { av: "문", role: "Copywriter · 카피", nm: "문준", career: "검색에도 걸리고 읽으면 사고 싶어지는 문장을 씁니다 — 설득 카피 · SEO", duties: ["히어로 헤드라인·서브카피·CTA 작성", "섹션별 전환 카피·FAQ 문구", "SEO 키워드 최적화 문구"] },
  { av: "나", role: "QA · Ops · 검수운영", nm: "이하나", career: "납품 전 전수 검수하고, 고객이 바로 쓸 수 있게 정리합니다 — 품질 검증 · 납품 운영", duties: ["링크·이미지·폰트·레이아웃 전수 검수", "PC/모바일 크로스 브라우저 점검", "납품 패키지 준비·수정 대응"] },
];

export function DetailPageTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="design" sub="detail-page" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Detail Page · 팀원 소개</span>
        <h1>상세페이지를 만드는<br /><em>사람들</em></h1>
        <p className="lead">분석기획·디자인·카피·검수 — 스크롤할수록 사고 싶어지는 페이지를 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="상세페이지" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 상세페이지 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
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
