"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
type Sub = { name: string; cols: number; members: M[] };

const SUBTEAMS: Sub[] = [
  {
    name: "SNS 운영 대행 조직",
    cols: 3,
    members: [
      { av: "영", role: "SNS Ops · 운영PM", nm: "최서영", career: "채널 전략부터 일정 관리까지 SNS 운영 전체를 총괄합니다 — 콘텐츠 기획 · 운영 캘린더 · 채널 전략", duties: ["SNS 채널 전략·운영 캘린더 기획", "월간 콘텐츠 키워드·방향 설계", "채널 톤·브랜드 가이드 관리"] },
      { av: "하", role: "SNS Editor · 에디터", nm: "김도하", career: "피드 하나하나가 브랜드를 설명하게 만듭니다 — 인스타 피드 · 카드뉴스 · 숏폼", duties: ["카드뉴스·썸네일·배너 제작", "채널별 비주얼 포맷·템플릿", "캠페인 소재 디자인"] },
      { av: "혁", role: "Growth Analyst · 분석", nm: "서준혁", career: "데이터가 다음 마케팅 방향을 결정합니다 — GA4 · A/B 테스트 · 맞춤 리포트", duties: ["GA4·전환·유입 분석·리포트", "채널 성장 실험·A/B 테스트", "데이터 기반 다음 액션 제안"] },
    ],
  },
  {
    name: "블로그 운영 대행 조직",
    cols: 3,
    members: [
      { av: "진", role: "Blog Content · 콘텐츠", nm: "이진희", career: "검색에 걸리고 읽히는 블로그 포스팅을 꾸준히 발행합니다 — SEO 블로그 · 키워드 전략 · 콘텐츠 제작", duties: ["SEO 키워드 선정·콘텐츠 기획", "블로그 포스팅 작성·발행", "월간 콘텐츠 캘린더 운영"] },
      { av: "슬", role: "Growth Ops · 그로스", nm: "박슬기", career: "유입 데이터를 분석해 더 잘 검색되는 구조로 개선합니다 — 키워드 분석 · 순위 추적 · 채널 최적화", duties: ["검색 순위·유입 데이터 분석", "키워드·제목·구조 최적화", "월간 성과 리포트·개선 제안"] },
      { av: "지", role: "QA · Ops · 검수운영", nm: "장지호", career: "발행 전 전수 검수하고, 납품 후에도 운영 이슈를 즉시 처리합니다", duties: ["발행 전 맞춤법·링크·이미지 검수", "SEO 메타·구조화 데이터 점검", "운영 중 문제 즉시 처리"] },
    ],
  },
];

function SubDivider({ name }: { name: string }) {
  return (
    <div style={{ background: "var(--gold)", color: "#0E0D0B", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 26px", marginTop: 48, marginBottom: 0 }}>
      <span style={{ fontFamily: "var(--frau)", fontSize: "clamp(17px,2vw,22px)", fontWeight: 600, letterSpacing: "0.01em" }}>{name}</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.6 }}>Org</span>
    </div>
  );
}

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
        <h1>운영하는<br className="hidden md:block" /><em>사람들</em></h1>
        <p className="lead">SNS 운영 대행·블로그 운영 대행 — 전략·콘텐츠·분석·검수까지 담당자가 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="마케팅" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 마케팅 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
        {SUBTEAMS.map((st) => (
          <div key={st.name} className="reveal">
            <SubDivider name={st.name} />
            <div className="team" style={{ marginTop: 0 }}>
              {st.members.map((m, i) => (
                <div key={i} className={"mem d" + ((i % 4) + 1)} style={{ borderRadius: 0, borderTop: "none" }}>
                  <div className="av">{m.av}</div>
                  <div className="role">{m.role}</div>
                  <div className="nm">{m.nm}</div>
                  <div className="career">{m.career}</div>
                  <ul className="duties">{m.duties.map((d, j) => <li key={j}>{d}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        ))}
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
