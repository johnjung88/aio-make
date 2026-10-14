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
import LAB_DATA from "./lab-data";
import { HomeServices } from "@/components/home/home-services";
import { WorkflowJourney } from "@/components/home/workflow-journey";
import { NewTabHint } from "@/components/new-tab-hint";
import { newTabProps } from "@/lib/new-tab";

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
          bg: on ? "#0D0D12" : "#fff",
          fg: on ? "#fff" : "#0D0D12",
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
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <section
            className="main-hero"
            style={{
              position: "relative",
              minHeight: "min(780px,calc(100svh - 70px))",
              background: "#0D0D12",
              color: "#fff",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: "0" }}>
              <GuideImage
                id="main-hero-bg"
                placeholder="히어로 배경 이미지 (2560×1440 이상, 어두운 톤)"
                src="public/hero/hero-bg.jpg"
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: "0",
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg,rgba(13,13,18,.58),rgba(13,13,18,.75))",
              }}
            ></div>
            <div
              className="l-container"
              style={{
                position: "relative",
                pointerEvents: "none",
                width: "100%",
                boxSizing: "border-box",
                margin: "0 auto",
                paddingBlock: "64px",
                paddingInline: "var(--gutter)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: "32px",
              }}
            >
              <div
                className="eyebrow"
                style={{
                  textTransform: "uppercase",
                  color: "#C9C9D1",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#6B4DFF",
                    display: "block",
                  }}
                ></span>
                {"All-In-One Agency"}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                  width: "fit-content",
                  maxWidth: "100%",
                }}
              >
                <h1
                  className="t-h1"
                  style={{
                    margin: "0",
                    textWrap: "balance",
                  }}
                >
                  <span>
                    {"분야별 "}
                    <span style={{ color: "#A99BFF" }}>{"전문가들"}</span>
                    {"이"}
                  </span>
                  <br />
                  <span style={{ color: "#A99BFF" }}>{"AI"}</span>
                  {"와 함께 일합니다"}
                </h1>
                <p
                  className="t-lead"
                  style={{
                    margin: "0",
                    maxWidth: "530px",
                    color: "#D6D6DC",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  {"컨텐츠·마케팅·개발, "}
                  <strong style={{ color: "#A99BFF" }}>{"필요한 일"}</strong>
                  {"을 골라 맡기고 결과를 함께 확인하세요"}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  pointerEvents: "auto",
                }}
              >
                <GuideLink
                  className="t-button"
                  href="#contact"
                  style={{
                    background: "#6B4DFF",
                    color: "#fff",
                    padding: "18px 28px",
                  }}
                  context="main"
                >
                  {"견적 문의"}
                </GuideLink>
                <GuideLink
                  className="t-button"
                  href="#work"
                  style={{
                    border: "1.5px solid #fff",
                    color: "#fff",
                    padding: "16.5px 26px",
                  }}
                  context="main"
                >
                  {"작업 과정 살펴보기"}
                </GuideLink>
              </div>
            </div>
          </section>
          <ShowcaseVideo kind="brand" />
          <HomeServices data={this.props.journey} />
          <WorkflowJourney data={this.props.journey} />
          <section
            style={{ background: "#fff", borderBottom: "1px solid #DAD8D1" }}
          >
            <div
              style={{
                maxWidth: "1000px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,48px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "32px",
              }}
            >
              <span
                className="eyebrow"
                style={{
                  color: "#6E6E78",
                }}
              >
                {"OUR STANDARD"}
              </span>
              <blockquote
                style={{
                  margin: "0",
                  fontSize: "clamp(24px,3.2vw,42px)",
                  lineHeight: "1.5",
                  letterSpacing: "-.03em",
                  fontWeight: "600",
                  maxWidth: "26ch",
                  textWrap: "balance",
                }}
              >
                {"만드는 일의 끝은,"}
                <br />
                <span style={{ color: "#6B4DFF" }}>
                  {"고객이 쓰기 시작하는 순간"}
                </span>
                {"입니다"}
              </blockquote>
              <div
                className="t-small"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <strong>{"AIO MAKE의 작업 기준"}</strong>
                <span style={{ color: "#6E6E78" }}>
                  {"기획 · 제작 · 검수 · 인계"}
                </span>
              </div>
            </div>
          </section>
          <section>
            <div
              className="l-container"
              style={{
                margin: "0 auto",
                paddingBlock: "var(--section-y)",
                paddingInline: "var(--gutter)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "48px",
              }}
            >
              <h2
                className="t-h2"
                style={{
                  margin: "0",
                }}
              >
                {"자주 묻는 질문"}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #0D0D12",
                }}
              >
                {(faqs || []).map((f, __index4) => (
                  <React.Fragment key={__index4}>
                    <div style={{ borderBottom: "1px solid #DAD8D1" }}>
                      <button
                        className="t-button t-button-reset"
                        onClick={f.toggle}
                        style={{
                          cursor: "pointer",
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "22px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "16px",
                        }}
                        type="button"
                        aria-expanded={f.open}
                        aria-controls={`main-faq-answer-${__index4}`}
                      >
                        {f.q}
                        <span
                          style={{
                            fontFamily: "var(--ff-display)",
                            fontWeight: "300",
                            color: "#6B4DFF",
                          }}
                        >
                          {f.sign}
                        </span>
                      </button>
                      <p
                        className="t-body"
                        id={`main-faq-answer-${__index4}`}
                        hidden={!f.open}
                        style={{
                          margin: "0 0 24px",
                          color: "#3A3A42",
                          maxWidth: "56ch",
                        }}
                      >
                        {f.a}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section
            id="contact"
            style={{ background: "#6B4DFF", color: "#fff" }}
          >
            <div
              className="l-container"
              style={{
                margin: "0 auto",
                paddingBlock: "var(--section-y)",
                paddingInline: "var(--gutter)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "48px",
                alignItems: "start",
              }}
            >
              <div
                className="centered-copy main-contact-copy"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <h2
                  className="t-h2"
                  style={{
                    margin: "0",
                  }}
                >
                  {"필요한 작업,"}
                  <br />
                  {"편하게 문의하세요"}
                </h2>
                <p
                  className="t-lead"
                  style={{
                    margin: "0",
                    maxWidth: "36ch",
                  }}
                >
                  {"이름과 연락처만 남겨주세요"}
                  <br />
                  <strong>{"담당자가 먼저 연락드립니다"}</strong>
                </p>
                <GuideLink
                  className="t-button"
                  href="/contact"
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                  }}
                  context="main"
                >
                  {"상세 문의 남기기 →"}
                </GuideLink>
              </div>
              {sent ? (
                <React.Fragment>
                  <div
                    style={{
                      background: "#fff",
                      color: "#0D0D12",
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
                    <span style={{ color: "#3A3A42" }}>
                      {"담당자가 확인 후 연락드리겠습니다"}
                    </span>
                  </div>
                </React.Fragment>
              ) : null}
              {notSent ? (
                <React.Fragment>
                  <InquiryBridge
                    style={{
                      background: "#fff",
                      color: "#0D0D12",
                      padding: "clamp(24px,3vw,40px)",
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
                          borderBottom: "1.5px solid #0D0D12",
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
                          borderBottom: "1.5px solid #0D0D12",
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
                              style={{
                                cursor: "pointer",
                                padding: "10px 16px",
                                border: "1.5px solid #0D0D12",
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
                        color: "#3A3A42",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        className="t-body"
                        required={true}
                        style={{
                          width: "18px",
                          height: "18px",
                          accentColor: "#6B4DFF",
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
                        background: "#0D0D12",
                        color: "#fff",
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
