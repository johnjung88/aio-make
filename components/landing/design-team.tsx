"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
type Sub = { name: string; cols: number; members: M[] };

const SUBTEAMS: Sub[] = [
  {
    name: "상세페이지 조직",
    cols: 2,
    members: [
      { av: "설", role: "Analyst · 분석기획", nm: "김설아", career: "상품·서비스의 강점을 분석해 전환으로 이어지는 구조를 설계합니다 — 시장 분석 · 경쟁사 벤치마킹 · 기획", duties: ["시장·경쟁사·고객 리뷰 분석", "전환 구조·섹션 흐름 기획", "기획서·브리핑 문서 작성"] },
      { av: "유", role: "Detail Designer · 디자인", nm: "나유나", career: "보는 사람이 구매 버튼을 누르게 설계합니다 — 전환율 최적화 · 스크롤 스토리텔링", duties: ["상품·서비스 상세페이지 시안 제작", "시선→정보→증거→CTA 흐름 설계", "모바일 가독성·전환율 최적화"] },
      { av: "문", role: "Copywriter · 카피", nm: "문준", career: "검색에도 걸리고 읽으면 사고 싶어지는 문장을 씁니다 — 설득 카피 · SEO", duties: ["히어로 헤드라인·서브카피·CTA 작성", "섹션별 전환 카피·FAQ 문구", "SEO 키워드 최적화 문구"] },
      { av: "나", role: "QA · Ops · 검수운영", nm: "이하나", career: "납품 전 전수 검수하고, 고객이 바로 쓸 수 있게 정리합니다 — 품질 검증 · 납품 운영", duties: ["링크·이미지·폰트·레이아웃 전수 검수", "PC/모바일 크로스 브라우저 점검", "납품 패키지 준비·수정 대응"] },
    ],
  },
  {
    name: "PPT·IR 조직",
    cols: 2,
    members: [
      { av: "기", role: "Analyst · 분석기획", nm: "박기원", career: "발표 목적과 청중을 분석해 슬라이드 구조를 정확히 설계합니다 — 구조 분석 · 메시지 위계 기획", duties: ["발표 목적·청중·메시지 분석", "슬라이드 구조·목차·흐름 기획", "기획안·초안 브리핑 문서"] },
      { av: "원", role: "PPT Designer · 디자인", nm: "류지원", career: "복잡한 내용을 한 슬라이드에 명확히 정리합니다 — IR 덱 · 제안서 · 공모전", duties: ["제안·IR·사업계획 슬라이드 디자인", "메시지 위계·도식화·인포그래픽", "발표용 비주얼 시스템·템플릿"] },
      { av: "진", role: "Copywriter · 카피", nm: "오유진", career: "숫자와 논리를 설득력 있는 문장으로 바꿉니다 — IR 카피 · 제안 내러티브", duties: ["핵심 메시지·슬라이드 카피 작성", "IR 내러티브·투자자 언어 최적화", "발표 스크립트·보조 문구"] },
      { av: "호", role: "QA · Ops · 검수운영", nm: "한재호", career: "납품 전 전수 검수하고 파일 포맷·호환성까지 챙깁니다 — 품질 검증 · 납품 운영", duties: ["슬라이드·폰트·링크 전수 검수", "PPT/PDF/Keynote 포맷 호환 점검", "납품 패키지 준비·수정 대응"] },
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
        <p className="lead">상세페이지·PPT·IR — 분석기획부터 디자인·카피·검수·납품까지 분야별 담당자가 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="디자인" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 디자인 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 시안</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
