"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

const EXTRA = `
.aiodp .galg{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:880px;margin:0 auto}
.aiodp .gx{aspect-ratio:3/4;border-radius:12px;border:1px solid var(--line2);position:relative;overflow:hidden;background:linear-gradient(135deg,rgba(200,162,74,.14),rgba(215,138,138,.08))}
.aiodp .gx.l{background:linear-gradient(160deg,rgba(200,162,74,.22),rgba(14,13,11,.4))}
.aiodp .gx.r{background:linear-gradient(200deg,rgba(215,138,138,.18),rgba(200,162,74,.10))}
.aiodp .gx.b{background:linear-gradient(140deg,rgba(139,224,194,.12),rgba(200,162,74,.10))}
.aiodp .gx::after{content:attr(data-cap);position:absolute;left:14px;bottom:12px;font-family:var(--font-ibm-plex-mono);font-size:9.5px;color:rgba(239,233,221,.55);letter-spacing:.18em}
@media(max-width:680px){.aiodp .galg{grid-template-columns:repeat(2,1fr)}}
`;

export function DesignHub({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS + EXTRA }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="design" active="service" />

      <header className="hero"><div className="wrap">
        <span className="kick">Design · 서비스 소개</span>
        <h1>첫인상을,<br /><em>디자인</em>합니다</h1>
        <p className="lead">상세페이지·로고·명함·PPT — 브랜드가 처음 만나는 화면을 다듬습니다. 보기 좋은 게 아니라 팔리는 디자인으로</p>
        <div className="acts"><a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a><a className="cta-link" href={`${base}/services/detail-page`}>상세페이지부터</a></div>
      </div></header>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Preview</span><h2>이런 <em>작업물</em>을 만듭니다</h2><p>로고·명함·상세·PPT — 분야별 전문가가 직접</p></div>
        <div className="galg reveal d1">
          <div className="gx l" data-cap="DETAIL · 5,000PX" />
          <div className="gx" data-cap="LOGO · BRAND" />
          <div className="gx r" data-cap="PPT · DECK" />
          <div className="gx b" data-cap="CARD · BUSINESS" />
          <div className="gx" data-cap="DETAIL · 10,000PX" />
          <div className="gx l" data-cap="PPT · IR" />
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Services</span><h2>세 가지 <em>디자인 서비스</em></h2><p>각 서비스를 누르면 전용 소개·포트폴리오 페이지로</p></div>
        <div className="dogrid">
          <div className="doc reveal d1"><div className="no">01</div><div className="dn">로고·명함</div><div className="dd">브랜드의 첫 글자, 첫 명함</div><span className="soon">COMING SOON</span></div>
          <a className="doc reveal d2" href={`${base}/services/detail-page`}><div className="no">02</div><div className="dn">상세페이지</div><div className="dd">스크롤을 멈추게 만드는 한 화면 — 5,000~20,000PX</div></a>
          <a className="doc reveal d1" href={`${base}/services/ppt-design`}><div className="no">03</div><div className="dn">PPT 디자인</div><div className="dd">제안·IR·발표 — 한 장으로 전달되는 슬라이드</div></a>
        </div>
      </section>

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">How we work</span><h2>일하는 <em>방식</em></h2></div>
        <div className="ways reveal d1">
          <div className="way"><div className="wt">매일 공유</div><div className="wd">매일 진행을 알려드립니다</div></div>
          <div className="way"><div className="wt">원본 제공</div><div className="wd">PSD·AI·PPTX 원본 전부</div></div>
          <div className="way"><div className="wt">빠른 속도</div><div className="wd">의뢰 후 2~5일, 다음 날 착수</div></div>
          <div className="way"><div className="wt">2차 수정 무료</div><div className="wd">시안·중간·최종 무제한 수정</div></div>
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>디자인할 게<br /><em>있나요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
