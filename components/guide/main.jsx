"use client";
/* W-RW1: shared result cards and the operational content gallery. */
import React from "react";
import {
  DivisionCards,
  ContactCta,
  SectionHead,
  BrandVideoButton,
} from "@/components/home/renewal-sections";
import "@/components/content-site/theme.css";
import "@/components/content-home/content-home.css";
import "@/components/home/main-about-renewal.css";
import {
  GuideLogic,
  GuideImage,
  GuideLink,
  GuideEffects,
  adaptGuideValues,
} from "./primitives";
import { WorkflowJourney } from "@/components/home/workflow-journey";
import { MainLight } from "@/components/home/main-light";
import "@/components/home/main-renewal.css";

class Component extends GuideLogic {
  state = { open: 0 };
  renderVals() {
    const faqData = [
      [
        "AIO MAKE는 어떤 회사인가요?",
        "컨텐츠·마케팅·개발 분야의 전문가들이 AI를 적극 활용해 일하는 올인원 에이전시입니다",
      ],
      [
        "어떤 일을 맡길 수 있나요?",
        "컨텐츠(웹툰, 애니메이션, AI 인플루언서, 모션그래픽, 브랜드 홍보 영상, SNS 광고 영상), 마케팅(통합 마케팅, SNS 대행 운영, SEO·AEO·GEO), 개발(업무 자동화, 프로그램, 웹사이트, 쇼핑몰)을 맡길 수 있습니다",
      ],
      [
        "견적은 어떻게 받나요?",
        "문의를 남기시면 담당자가 연락드려 요청 범위에 맞는 견적과 일정을 안내합니다",
      ],
      [
        "AI를 쓰면 품질은 괜찮나요?",
        "AI는 전문가가 효율을 높이는 도구로 쓰고, 모든 결과물은 분야별 전문가가 직접 검수한 뒤 납품합니다",
      ],
      [
        "납품 후에도 관리해 주나요?",
        "네, 수정 요청과 유지보수를 지원하며 범위는 견적 단계에서 함께 정합니다",
      ],
    ];
    return {
      faqs: faqData.map(([q, a], i) => ({
        q,
        a,
        open: this.state.open === i,
        sign: this.state.open === i ? "−" : "+",
        toggle: () => this.setState({ open: this.state.open === i ? -1 : i }),
      })),
    };
  }

  render() {
    const values = adaptGuideValues("main", this.renderVals(), this.props);
    const { faqs } = values;
    return (
      <div className="guide-page guide-main cs-site rw-site">
        <GuideEffects />
        <div className="main-shell">
          <section className="main-hero" data-cs-section="hero">
            <div className="main-hero-bg">
              <GuideImage
                id="main-hero-bg"
                alt=""
                src="/images/guide/hero/hero-bg-seo2.webp"
              />
            </div>
            <div className="main-hero-shade"></div>
            <MainLight />
            <div className="l-container main-hero-inner">
              <div className="eyebrow main-hero-eyebrow">
                {"All-In-One Agency"}
              </div>
              <div className="main-hero-copy">
                <h1 className="t-h1 main-hero-title">
                  <span>
                    {"분야별 "}
                    <span className="main-accent-light">{"전문가들"}</span>
                    {"이"}
                  </span>
                  <br />
                  <span className="main-accent-light">{"AI"}</span>
                  {"와 함께 일합니다"}
                </h1>
                <p className="t-lead main-hero-lead">
                  {"컨텐츠·마케팅·개발, "}
                  <strong className="main-accent-light">{"필요한 일만"}</strong>
                  {" 골라 맡기고 결과를 함께 확인하세요"}
                </p>
              </div>
              <div className="main-hero-actions">
                <GuideLink
                  className="t-button main-btn main-btn--solid"
                  href="/contact?source=main"
                  context="main"
                >
                  {"견적 문의"}
                </GuideLink>
                <GuideLink
                  className="t-button main-btn main-btn--line"
                  href="#work"
                  context="main"
                >
                  {"제작 사례 보기"}
                </GuideLink>
                <BrandVideoButton />
              </div>
              <div className="rw-hero-chips cs-t-small">
                <a href="#journey-dev">개발</a>
                <a href="#journey-marketing">마케팅</a>
                <a href="#journey-content">컨텐츠</a>
              </div>
            </div>
          </section>
          <section
            className="rw-section"
            id="divisions"
            aria-labelledby="rw-main-services"
          >
            <div className="cs-container">
              <SectionHead
                id="rw-main-services"
                eyebrow="ALL SERVICES"
                title="필요한 분야만 골라 맡기세요"
              />
              <DivisionCards />
            </div>
          </section>
          <WorkflowJourney data={this.props.journey} />
          <section>
            <div className="l-container main-faq">
              <SectionHead
                id="rw-faq-title"
                eyebrow="FAQ"
                title="자주 묻는 질문"
              />
              <div className="main-faq-list">
                {(faqs || []).map((f, __index4) => (
                  <React.Fragment key={__index4}>
                    <div className="main-faq-item">
                      <button
                        className="t-button main-faq-q"
                        onClick={f.toggle}
                        type="button"
                        aria-expanded={f.open}
                        aria-controls={`main-faq-answer-${__index4}`}
                      >
                        {f.q}
                        <span className="main-faq-sign">{f.sign}</span>
                      </button>
                      <p
                        className="t-body main-faq-a"
                        id={`main-faq-answer-${__index4}`}
                        hidden={!f.open}
                      >
                        {f.a}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <ContactCta />
        </div>
      </div>
    );
  }
}

export default Component;
