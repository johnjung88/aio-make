"use client";
/* Generated from the preserved design by scripts/restore-guide.py.
 * Layout and copy changes belong in the compiler adaptation or shared primitives.
 * No DC interpreter, eval, HTML injection, editor runtime or stock video ships. */
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import React from "react";
import { ShowcaseVideo } from "./showcase-video";
import {
  GuideLogic,
  GuideImage,
  GuideMedia,
  GuideLink,
  GuideNav,
  GuideCloud,
  GuideEffects,
  GuideOffer,
  developmentOffer,
  guideAsset,
  guideServiceHref,
  guideContactKey,
  adaptGuideValues,
  marketingExamples,
} from "./primitives";
import { InquiryBridge } from "./inquiry-bridge";
import { WorkflowJourney } from "@/components/home/workflow-journey";
import { NewTabHint } from "@/components/new-tab-hint";
import { newTabProps } from "@/lib/new-tab";
import { MainLight } from "@/components/home/main-light";
import "@/components/home/main-renewal.css";

// Keep each service name on one line; wrapping happens only between items.
const divisionServiceItems = (text) => {
  const items = text.split(" · ");
  return items.map((item, index) => (
    <React.Fragment key={item}>
      <span>{index < items.length - 1 ? `${item} ·` : item}</span>
      {index < items.length - 1 ? " " : null}
    </React.Fragment>
  ));
};

class Component extends GuideLogic {
  state = { service: "", sent: false, open: 0 };
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
      services: ["컨텐츠", "마케팅", "개발", "아직 모르겠어요"].map((label) => {
        const on = this.state.service === label;
        return {
          label,
          bg: on ? "var(--ink)" : "var(--renewal-white)",
          fg: on ? "var(--renewal-white)" : "var(--ink)",
          pick: () => this.setState({ service: label }),
        };
      }),
      sent: this.state.sent,
      notSent: !this.state.sent,
      submit: (e) => {
        e.preventDefault();
        this.setState({ sent: true });
      },
    };
  }

  render() {
    const values = adaptGuideValues("main", this.renderVals(), this.props);
    const { faqs, notSent, sent, services, submit } = values;
    return (
      <div className="guide-page guide-main">
        <GuideEffects />
        <div className="main-shell">
          <section className="main-hero">
            <div className="main-hero-bg">
              <GuideImage
                id="main-hero-bg"
                placeholder="히어로 배경 이미지 (2560×1440 이상, 어두운 톤)"
                src="public/hero/hero-bg.jpg"
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
                  href="#contact"
                  context="main"
                >
                  {"견적 문의"}
                </GuideLink>
                <GuideLink
                  className="t-button main-btn main-btn--line"
                  href="#work"
                  context="main"
                >
                  {"제작 예시 살펴보기"}
                </GuideLink>
              </div>
            </div>
          </section>
          <ShowcaseVideo kind="brand" />
          <section className="l-container main-divisions" id="divisions">
            <h2 className="t-h2 main-divisions-title">
              {"필요한 분야만 "}
              <span className="main-accent">{"골라"}</span>
              {" 맡기세요"}
            </h2>
            <div className="main-division-grid">
              {/* 번호와 순서는 워크플로우(개발 → 마케팅 → 컨텐츠)와 같다. */}
              <GuideLink
                className="main-division"
                href="/lab"
                {...newTabProps}
                context="main"
              >
                <div className="main-division-media">
                  <img
                    alt="개발팀 작업 공간"
                    src={guideAsset("public/images/cards/card-lab.jpg")}
                  />
                </div>
                <div className="main-division-body">
                  <span className="main-division-name t-h3">
                    <span className="main-division-num eyebrow">{"01"}</span>
                    {"개발"}
                  </span>
                  <span className="main-division-line t-small">
                    {"시스템을 만드는 분야"}
                  </span>
                  <span className="home-division-services t-small">
                    {divisionServiceItems(
                      "업무 자동화 · 프로그램 · 웹사이트 · 쇼핑몰",
                    )}
                  </span>
                  <span className="main-division-cta">{"개발 상담하기 →"}</span>
                </div>
                <NewTabHint />
              </GuideLink>
              <GuideLink
                className="main-division"
                href="/marketing"
                context="main"
              >
                <div className="main-division-media">
                  <img
                    alt="마케팅 전략 회의"
                    src={guideAsset("public/images/cards/card-marketing.jpg")}
                  />
                </div>
                <div className="main-division-body">
                  <span className="main-division-name t-h3">
                    <span className="main-division-num eyebrow">{"02"}</span>
                    {"마케팅"}
                  </span>
                  <span className="main-division-line t-small">
                    {"고객을 부르는 분야"}
                  </span>
                  <span className="home-division-services t-small">
                    {divisionServiceItems(
                      "통합 마케팅 · SNS 대행 운영 · SEO·AEO·GEO",
                    )}
                  </span>
                  <span className="main-division-cta">
                    {"마케팅 상담하기 →"}
                  </span>
                </div>
              </GuideLink>
              {/* The content site opens in a new tab (lib/new-tab.ts). */}
              <GuideLink
                className="main-division"
                href="/content"
                {...newTabProps}
                context="main"
              >
                <div className="main-division-media">
                  <img
                    alt="컨텐츠 제작 스튜디오"
                    src={guideAsset("public/images/cards/card-video.jpg")}
                  />
                </div>
                <div className="main-division-body">
                  <span className="main-division-name t-h3">
                    <span className="main-division-num eyebrow">{"03"}</span>
                    {"컨텐츠"}
                  </span>
                  <span className="main-division-line t-small">
                    {"장면을 담는 분야"}
                  </span>
                  <span className="home-division-services t-small">
                    {divisionServiceItems(
                      "웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상",
                    )}
                  </span>
                  <span className="main-division-cta">
                    {"컨텐츠 상담하기 →"}
                  </span>
                  <NewTabHint />
                </div>
              </GuideLink>
            </div>
          </section>
          <WorkflowJourney data={this.props.journey} />
          <section className="main-standard">
            <div className="l-container main-standard-inner">
              <span className="eyebrow main-standard-eyebrow">
                {"OUR STANDARD"}
              </span>
              <blockquote className="main-standard-quote">
                {"만드는 일의 끝은,"}
                <br />
                <span className="main-accent">
                  {"고객이 쓰기 시작하는 순간"}
                </span>
                {"입니다"}
              </blockquote>
            </div>
          </section>
          <section>
            <div className="l-container main-faq">
              <h2 className="t-h2 main-faq-title">{"자주 묻는 질문"}</h2>
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
          <section id="contact" className="main-contact">
            <div className="l-container main-contact-inner">
              <div className="main-contact-copy">
                <h2 className="t-h2 main-contact-title">
                  {"필요한 작업,"}
                  <br />
                  {"편하게 문의하세요"}
                </h2>
                <p className="t-lead main-contact-lead">
                  {"이름과 연락처만 남겨주세요"}
                  <br />
                  <strong>{"담당자가 먼저 연락드립니다"}</strong>
                </p>
                <GuideLink
                  className="t-button main-contact-link"
                  href="/contact"
                  context="main"
                >
                  {"상세 문의 남기기 →"}
                </GuideLink>
              </div>
              {sent ? (
                <React.Fragment>
                  <div
                    style={{
                      background: "var(--renewal-white)",
                      color: "var(--ink)",
                      padding: "40px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      justifyContent: "center",
                    }}
                  >
                    <strong className="t-lead">
                      {"문의가 접수되었습니다"}
                    </strong>
                    <span style={{ color: "var(--form-muted)" }}>
                      {"담당자가 확인 후 연락드리겠습니다"}
                    </span>
                  </div>
                </React.Fragment>
              ) : null}
              {notSent ? (
                <React.Fragment>
                  <InquiryBridge
                    style={{
                      background: "var(--renewal-white)",
                      color: "var(--ink)",
                      padding: "var(--section-y-sm)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                    division="marketing"
                    selection={this.state}
                    initialService={this.props.service}
                    quick={true}
                  >
                    <label
                      className="t-label t-small"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {"고객명"}
                      <input
                        className="t-body"
                        placeholder="홍길동"
                        required={true}
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid var(--ink)",
                          padding: "10px 0",
                          outline: "none",
                          background: "transparent",
                        }}
                        name="name"
                      />
                    </label>
                    <label
                      className="t-label t-small"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {"연락처"}
                      <input
                        className="t-body"
                        placeholder="이메일 또는 전화번호"
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid var(--ink)",
                          padding: "10px 0",
                          outline: "none",
                          background: "transparent",
                        }}
                        type="text"
                        name="phone"
                      />
                    </label>
                    <div
                      className="t-small"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {"관심 분야\n          "}
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        {(services || []).map((s, __index7) => (
                          <React.Fragment key={__index7}>
                            <button
                              className="t-chip"
                              onClick={s.pick}
                              aria-pressed={this.state.service === s.label}
                              style={{
                                cursor: "pointer",
                                padding: "10px 16px",
                                border: "1.5px solid var(--ink)",
                                background: s.bg,
                                color: s.fg,
                              }}
                              type="button"
                            >
                              {s.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <label
                      className="t-label t-small"
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        color: "var(--form-muted)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        className="t-body"
                        required={true}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "var(--violet)",
                        }}
                        type="checkbox"
                        name="consent"
                      />
                      {"개인정보 수집·이용에 동의합니다 (필수)"}
                    </label>
                    <button
                      className="t-button t-button--lg"
                      style={{
                        cursor: "pointer",
                        border: "none",
                        background: "var(--ink)",
                        color: "var(--renewal-white)",
                        padding: "18px",
                      }}
                      type="submit"
                    >
                      {"간단 문의 보내기"}
                    </button>
                  </InquiryBridge>
                </React.Fragment>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
