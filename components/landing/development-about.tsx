"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, DPNav, DPSubnav } from "./dp-shell";

export function DevelopmentAbout({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <DPNav base={base} crumb="개발 / 회사소개" />
      <DPSubnav base={base} cat="development" active="about" />

      <header className="hero"><div className="wrap">
        <span className="kick">About · 개발</span>
        <h1>필요한 것을,<br /><em>코드</em>로 만듭니다</h1>
        <p className="lead">AIO 개발팀은 웹사이트·쇼핑몰·자동화까지, 비즈니스에 필요한 것을 코드로 빠르게 만듭니다. 보여주기용이 아니라 바로 운영 가능한 결과물로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/website`}>서비스 보기</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">What we do</span><h2>개발팀이 <em>하는 일</em></h2></div>
        <div className="dogrid">
          <a className="doc reveal d1" href={`${base}/services/website`}><div className="no">01</div><div className="dn">웹사이트</div><div className="dd">회사 홈페이지부터 서비스·마케팅 랜딩까지, 스크롤을 멈추게 만드는 한 페이지</div></a>
          <a className="doc reveal d2" href={`${base}/services/shopping-mall`}><div className="no">02</div><div className="dn">쇼핑몰</div><div className="dd">카페24·독립몰 구축과 디자인, 상품 등록·결제 연동까지 한 번에</div></a>
          <a className="doc reveal d1" href={`${base}/services/automation-app`}><div className="no">03</div><div className="dn">자동화 및 프로그램</div><div className="dd">엑셀·데이터 처리·파싱·크롤링·매크로, 반복 업무를 코드에게</div></a>
          <div className="doc reveal d2"><div className="no">04</div><div className="dn">앱</div><div className="dd">iOS·Android 모바일 앱</div><span className="soon">COMING SOON</span></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="ways reveal d1">
          <div className="way"><div className="wt">매일 공유</div><div className="wd">진행 상황을 매일 투명하게 공유합니다</div></div>
          <div className="way"><div className="wt">운영 가능한 납품</div><div className="wd">시안이 아니라 바로 쓰는 결과물로 드립니다</div></div>
          <div className="way"><div className="wt">1개월 A/S</div><div className="wd">납품 후 한 달간 무상 유지보수</div></div>
          <div className="way"><div className="wt">투명한 가격</div><div className="wd">착수 전 가격과 일정을 명확하게</div></div>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">By the numbers</span><h2>숫자로 보는 <em>AIO</em></h2></div>
        <div className="stats reveal d1">
          <div className="stat"><div className="sv">2024</div><div className="sl">설립</div></div>
          <div className="stat"><div className="sv">4</div><div className="sl">개발 분야</div></div>
          <div className="stat"><div className="sv">1–5일</div><div className="sl">평균 납기</div></div>
          <div className="stat"><div className="sv">1개월</div><div className="sl">무상 A/S</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>코드로 만들 게<br /><em>있나요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 첫 결과물</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <footer className="foot"><div className="wrap">AIO · 개발 &nbsp;·&nbsp; 사업자 682-01-02748 &nbsp;·&nbsp; aiomake2023@gmail.com</div></footer>
    </div>
  );
}
