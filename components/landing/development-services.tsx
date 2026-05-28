"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

export function DevelopmentServices({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="development" active="service" />

      <header className="hero"><div className="wrap">
        <span className="kick">Development · 서비스 소개</span>
        <h1>필요한 것을<br /><em>코드</em>로 만듭니다</h1>
        <p className="lead">웹사이트·쇼핑몰·자동화까지 — 비즈니스에 필요한 것을 코드로 빠르게 · 보여주기용이 아니라 바로 운영 가능한 결과물로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/website`}>웹사이트부터 보기</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Services</span><h2>네 가지 <em>개발 서비스</em></h2>
          <p>각 서비스를 누르면 전용 소개·포트폴리오 페이지로 들어갑니다</p></div>
        <div className="dogrid">
          <a className="doc reveal d1" href={`${base}/services/website`}><div className="no">01</div><div className="dn">웹사이트</div><div className="dd">회사 홈페이지·서비스·마케팅 랜딩, 스크롤을 멈추게 만드는 한 페이지</div></a>
          <a className="doc reveal d2" href={`${base}/services/shopping-mall`}><div className="no">02</div><div className="dn">쇼핑몰</div><div className="dd">카페24·독립몰 구축, 상품 등록·결제 연동까지 한 번에</div></a>
          <a className="doc reveal d1" href={`${base}/services/automation-app`}><div className="no">03</div><div className="dn">자동화 및 프로그램</div><div className="dd">엑셀·데이터 처리·파싱·크롤링·매크로, 반복 업무를 코드에게</div></a>
          <div className="doc reveal d2"><div className="no">04</div><div className="dn">앱</div><div className="dd">iOS·Android 모바일 앱</div><span className="soon">COMING SOON</span></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="ways reveal d1">
          <div className="way"><div className="wt">투명한 진행</div><div className="wd">작업 상황을 매일 공유합니다</div></div>
          <div className="way"><div className="wt">운영 가능한 납품</div><div className="wd">시안이 아닌 완성품으로 드립니다</div></div>
          <div className="way"><div className="wt">빠른 속도</div><div className="wd">의뢰 후 1~5일 — 다음 날 착수</div></div>
          <div className="way"><div className="wt">책임 A/S</div><div className="wd">납품 후 한 달 무상 유지보수</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>코드로 만들<br /><em>일</em>이 있나요?</h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
