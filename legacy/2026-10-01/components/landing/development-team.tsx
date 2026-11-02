"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
type Sub = { name: string; cols: number; members: M[] };

const SUBTEAMS: Sub[] = [
  {
    name: "웹사이트 조직",
    cols: 3,
    members: [
      { av: "리", role: "Planner · 기획", nm: "한리아", career: "만들기 전에 구조를 맞춰 수정 비용을 줄입니다 — IA · 사이트맵 · URL 설계", duties: ["IA·사이트맵·URL 구조 설계", "요구사항 정리 → 제작 구조 수립", "PC/모바일 반응형 우선순위 정의"] },
      { av: "연", role: "Copywriter · 카피", nm: "박서연", career: "검색에 걸리고 읽으면 행동하게 만드는 문장을 씁니다 — 히어로 카피 · SEO · CTA", duties: ["히어로 헤드라인·서브카피·CTA 작성", "섹션별 전환 카피·폼/FAQ 문구", "SEO title·description·OG 문구"] },
      { av: "도", role: "Web Designer · 디자인", nm: "오도윤", career: "어떤 기기에서도 보기 좋고 쓰기 편한 화면을 만듭니다 — 반응형 · UI/UX · 디자인 시스템", duties: ["디자인 토큰·컴포넌트 시안 설계", "반응형 그리드·히어로 비율 정의", "Figma 기반 UI/UX 시안"] },
      { av: "세", role: "Developer · 개발", nm: "정세호", career: "느리지 않고 다운되지 않는 구조로 구현합니다 — Next.js · Supabase · Vercel", duties: ["Next.js·반응형 사이트 구현", "폼·CTA·Supabase·배포·도메인 연동", "빌드·성능·브라우저 호환성 대응"] },
      { av: "현", role: "QA · 검수", nm: "신현아", career: "고객이 발견하기 전에 문제를 모두 잡아냅니다 — 반응형 · 링크 · 폼 · OG 전수 검수", duties: ["반응형·링크·폼·OG 전수 검수", "배포 전 위험·롤백 포인트 점검", "허구 클레임·접근성 점검"] },
      { av: "은", role: "Ops · 납품운영", nm: "강지은", career: "납품 후에도 문제가 생기면 바로 대응합니다 — 배포 · 도메인 · A/S", duties: ["도메인·호스팅·추적코드 세팅", "납품 패키지 준비·고객 전달 안내", "납품 후 1개월 무상 유지보수"] },
    ],
  },
  {
    name: "쇼핑몰 조직",
    cols: 3,
    members: [
      { av: "준", role: "E-commerce Planner · 기획", nm: "윤준서", career: "이탈 없는 구매 경험을 기획합니다 — 상품 구조 · 결제 흐름 · 카테고리 설계", duties: ["장바구니→결제 전환 흐름 설계", "상품 구조·카테고리·필터 기획", "쇼핑몰 UX 기획·와이어프레임"] },
      { av: "수", role: "Copywriter · 카피", nm: "임수아", career: "상품이 팔리게 만드는 카피와 배너 문구를 씁니다 — 상품 카피 · 배너 · CTA", duties: ["브랜드 슬로건·메인 배너 문구", "상품명·상품설명·CTA 카피", "이벤트·프로모션 문구"] },
      { av: "미", role: "Designer · 디자인", nm: "박미소", career: "스킨·배너·상품 이미지를 브랜드에 맞게 제작합니다 — 쇼핑몰 스킨 · 배너 · 상세 이미지", duties: ["Cafe24 스킨 시안·배너 디자인", "상품 이미지·프로모션 소재 제작", "모바일/PC 비주얼 최적화"] },
      { av: "태", role: "E-commerce Dev · 개발", nm: "임태양", career: "재고·주문·결제가 자동으로 연결됩니다 — Cafe24 · Shopify · 커스텀", duties: ["쇼핑몰 구현·PG 결제 연동", "재고·주문·배송 자동화 구조", "스킨 HTML/CSS/JS 기술 적용"] },
      { av: "민", role: "QA · Ops · 검수운영", nm: "배지민", career: "결제 오류 하나 없이 오픈하고, 운영 중 문제도 즉시 처리합니다", duties: ["결제·재고·배송 전수 테스트", "오픈 전 취약점·오류 전량 점검", "운영 중 문제 즉시 처리"] },
    ],
  },
  {
    name: "자동화 조직",
    cols: 3,
    members: [
      { av: "훈", role: "Automation Dev · 자동화개발", nm: "송지훈", career: "사람이 하던 일을 시스템이 대신하게 만들어드립니다 — Python · n8n · API 연동", duties: ["반복 업무 자동화 설계·구현", "Python · n8n · API 연동", "알림·보고서·데이터 자동화"] },
      { av: "재", role: "Ops · 요구분석", nm: "이재원", career: "고객 업무를 단계별로 정리해 자동화 범위를 정확히 설계합니다", duties: ["현행 업무 절차 단계별 분석", "입력·출력·예외 케이스 정리", "사용법 문서·납품 준비"] },
      { av: "아", role: "QA · 검수", nm: "최민아", career: "반복 실행해도 오류 없이 동작하는지 검증합니다 — 실행 검증 · 보안 · 납품 검수", duties: ["반복 실행·예외 케이스 검증", "계정·보안·약관 위험 검토", "PASS/WARN/FAIL 보고"] },
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
        <span className="kick">Development · 팀원 소개</span>
        <h1>개발을 만드는<br /><em>사람들</em></h1>
        <p className="lead">웹사이트·쇼핑몰·자동화 — 기획부터 검수·운영까지 분야별 담당자가 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="개발" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 개발 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
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
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
