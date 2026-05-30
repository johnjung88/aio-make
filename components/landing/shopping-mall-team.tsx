"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "준", role: "E-commerce Planner · 기획", nm: "윤준서", career: "이탈 없는 구매 경험을 기획합니다 — 상품 구조 · 결제 흐름 · 카테고리 설계", duties: ["장바구니→결제 전환 흐름 설계", "상품 구조·카테고리·필터 기획", "쇼핑몰 UX 기획·와이어프레임"] },
  { av: "수", role: "Copywriter · 카피", nm: "임수아", career: "상품이 팔리게 만드는 카피와 배너 문구를 씁니다 — 상품 카피 · 배너 · CTA", duties: ["브랜드 슬로건·메인 배너 문구", "상품명·상품설명·CTA 카피", "이벤트·프로모션 문구"] },
  { av: "미", role: "Designer · 디자인", nm: "박미소", career: "스킨·배너·상품 이미지를 브랜드에 맞게 제작합니다 — 쇼핑몰 스킨 · 배너 · 상세 이미지", duties: ["Cafe24 스킨 시안·배너 디자인", "상품 이미지·프로모션 소재 제작", "모바일/PC 비주얼 최적화"] },
  { av: "태", role: "E-commerce Dev · 개발", nm: "임태양", career: "재고·주문·결제가 자동으로 연결됩니다 — Cafe24 · Shopify · 커스텀", duties: ["쇼핑몰 구현·PG 결제 연동", "재고·주문·배송 자동화 구조", "스킨 HTML/CSS/JS 기술 적용"] },
  { av: "민", role: "QA · Ops · 검수운영", nm: "배지민", career: "결제 오류 하나 없이 오픈하고, 운영 중 문제도 즉시 처리합니다", duties: ["결제·재고·배송 전수 테스트", "오픈 전 취약점·오류 전량 점검", "운영 중 문제 즉시 처리"] },
];

export function ShoppingMallTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="leaf" cat="development" sub="shopping-mall" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Shopping Mall · 팀원 소개</span>
        <h1>쇼핑몰을 만드는<br /><em>사람들</em></h1>
        <p className="lead">기획·카피·디자인·개발·검수·운영 — 팔리는 쇼핑몰을 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="쇼핑몰" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 쇼핑몰 조직</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
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
        <p>지금 문의하면 24시간 안에 견적 · 7일 안에 첫 결과물</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
