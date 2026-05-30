"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
type Sub = { name: string; cols: number; members: M[] };

const SUBTEAMS: Sub[] = [
  {
    name: "브랜드 영상 조직",
    cols: 2,
    members: [
      { av: "민", role: "Director · 연출", nm: "조민재", career: "보는 사람이 신뢰하게 만드는 연출 — 브랜드 필름 · 광고 · 인터뷰", duties: ["브랜드·홍보 영상 기획·연출", "스토리보드·촬영 디렉션", "메시지·톤·레퍼런스 설계"] },
      { av: "우", role: "Editor · 편집", nm: "윤정우", career: "브랜드 톤에 맞는 색감과 분위기로 마무리합니다 — 컬러그레이딩 · 사운드 믹싱", duties: ["컷·리듬·자막·컬러 편집", "브랜드 톤 컬러그레이딩", "숏폼·릴스 포맷 최적화"] },
    ],
  },
  {
    name: "SNS·숏폼 조직",
    cols: 2,
    members: [
      { av: "은", role: "Shorts Specialist · 숏폼", nm: "이서은", career: "트렌드를 타면서 브랜드 메시지를 함께 전달합니다 — 릴스 · 쇼츠 · 틱톡", duties: ["스크롤을 멈추는 첫 1초 설계", "릴스·쇼츠·틱톡 포맷 기획", "후킹 구조·트렌드 적용"] },
      { av: "호", role: "Motion Designer · 모션", nm: "박지호", career: "움직임 하나로 제품의 특장점을 직관적으로 전달합니다 — 모션그래픽 · 자막 디자인", duties: ["인트로·자막·인포그래픽 모션", "브랜드 모션 시스템·트랜지션", "그래픽 에셋 제작"] },
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
        <p className="lead">브랜드 영상·SNS·숏폼 — 연출부터 편집·모션까지 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="영상" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 영상 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
        {SUBTEAMS.map((st) => (
          <div key={st.name} className="reveal">
            <SubDivider name={st.name} />
            <div className="team" style={{ gridTemplateColumns: `repeat(${st.cols}, minmax(0, 1fr))`, marginTop: 0 }}>
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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 시안 컷</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
