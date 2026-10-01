"use client";
/* Generated from the preserved design by scripts/restore-guide.py.
 * Layout and copy changes belong in the compiler adaptation or shared primitives.
 * No DC interpreter, eval, HTML injection, editor runtime or stock video ships. */
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import React from "react";
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
import { HomeReferences } from "./home-references";

class Component extends GuideLogic {
  state = { service: "", sent: false, open: 0 };
  renderVals() {
    const faqData = [
      [
        "AIO MAKE는 어떤 회사인가요?",
        "영상·마케팅·개발 분야의 전문가들이 AI를 적극 활용해 일하는 올인원 에이전시입니다",
      ],
      [
        "어떤 일을 맡길 수 있나요?",
        "영상(웹툰, 애니메이션, AI 인플루언서, 브랜드 영상), 마케팅(통합 마케팅, SNS 대행 운영, SEO·AEO·GEO), 개발(업무 자동화, 프로그램, 웹사이트, 쇼핑몰)을 맡길 수 있습니다",
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
      workGroups: [
        {
          name: "Studio",
          ko: "영상",
          href: "Studio 작업 사례.dc.html",
          bigId: "main-studio-big",
          s1Id: "main-studio-s1",
          s2Id: "main-studio-s2",
          cat1: "애니메이션",
          cat2: "AI 인플루언서",
          cat3: "브랜드 영상",
        },
        {
          name: "Marketing",
          ko: "마케팅",
          href: "/marketing/work",
          bigId: "main-mkt-big",
          s1Id: "main-mkt-s1",
          s2Id: "main-mkt-s2",
          cat1: "SNS 대행 운영",
          cat2: "통합 마케팅",
          cat3: "SNS 대행 운영",
        },
        {
          name: "Lab",
          ko: "개발",
          href: "/lab/work",
          bigId: "main-lab-big",
          s1Id: "main-lab-s1",
          s2Id: "main-lab-s2",
          cat1: "웹사이트",
          cat2: "쇼핑몰",
          cat3: "업무 자동화",
        },
      ],
      faqs: faqData.map(([q, a], i) => ({
        q,
        a,
        open: this.state.open === i,
        sign: this.state.open === i ? "−" : "+",
        toggle: () => this.setState({ open: this.state.open === i ? -1 : i }),
      })),
      services: ["영상", "마케팅", "개발", "아직 모르겠어요"].map((label) => {
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
    const { faqs, notSent, sent, services, submit, workGroups } = values;
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
              style={{
                position: "relative",
                pointerEvents: "none",
                maxWidth: "1320px",
                width: "100%",
                boxSizing: "border-box",
                margin: "0 auto",
                padding: "64px clamp(20px,4vw,48px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: "32px",
              }}
            >
              <div
                style={{
                  fontFamily: "Unbounded,sans-serif",
                  fontSize: "12px",
                  letterSpacing: ".16em",
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
                  style={{
                    margin: "0",
                    fontSize: "clamp(42px,7vw,104px)",
                    lineHeight: "1.08",
                    letterSpacing: "-.03em",
                    fontWeight: "800",
                    textWrap: "balance",
                  }}
                >
                  <span style={{ letterSpacing: "-.008em" }}>
                    {"분야별 "}
                    <span style={{ color: "#A99BFF" }}>{"전문가들"}</span>
                    {"이"}
                  </span>
                  <br />
                  <span style={{ color: "#A99BFF" }}>{"AI"}</span>
                  {"와 함께 일합니다"}
                </h1>
                <p
                  style={{
                    margin: "0",
                    maxWidth: "530px",
                    fontSize: "clamp(16px,1.5vw,21px)",
                    lineHeight: "1.75",
                    color: "#D6D6DC",
                    textAlign: "center",
                    alignSelf: "center",
                  }}
                >
                  {"영상·마케팅·개발, "}
                  <strong style={{ color: "#A99BFF" }}>{"필요한 일"}</strong>
                  {"을 골라 맡기고 결과를 함께 확인하세요."}
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
                  href="#contact"
                  style={{
                    background: "#6B4DFF",
                    color: "#fff",
                    padding: "18px 28px",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                  context="main"
                >
                  {"견적 문의"}
                </GuideLink>
                <GuideLink
                  href="#work"
                  style={{
                    border: "1.5px solid #fff",
                    color: "#fff",
                    padding: "16.5px 26px",
                    fontWeight: "600",
                    fontSize: "16px",
                  }}
                  context="main"
                >
                  {"제작 예시 살펴보기"}
                </GuideLink>
              </div>
            </div>
          </section>
          <section
            id="divisions"
            style={{
              maxWidth: "1320px",
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              padding: "clamp(80px,10vw,140px) clamp(20px,4vw,48px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(48px,6vw,80px)",
            }}
          >
            <h2
              style={{
                margin: "0",
                textAlign: "center",
                fontSize: "clamp(28px,4.4vw,60px)",
                letterSpacing: "-.035em",
                fontWeight: "700",
                lineHeight: "1.15",
              }}
            >
              {"필요한 분야만 "}
              <span style={{ color: "#6B4DFF" }}>{"골라"}</span>
              {" 맡기세요"}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,340px),1fr))",
                gap: "12px",
              }}
            >
              <GuideLink
                href="/video"
                style={{
                  background: "#0D0D12",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}
                context="main"
              >
                <div
                  style={{
                    aspectRatio: "16/10",
                    overflow: "hidden",
                    background: "#141418",
                  }}
                >
                  <img
                    alt="영상 제작 스튜디오"
                    src={guideAsset("public/images/cards/card-video.jpg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: "1",
                    padding: "28px 32px 32px",
                    display: "grid",
                    gridTemplateRows: "auto 1fr auto auto auto auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "28px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Unbounded,sans-serif",
                        fontSize: "12px",
                        letterSpacing: ".14em",
                        color: "#A99BFF",
                      }}
                    >
                      {"01 · VIDEO"}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        border: "1px solid #55555E",
                        padding: "4px 10px",
                        color: "#C9C9D1",
                      }}
                    >
                      {"바로 의뢰 가능"}
                    </span>
                  </div>
                  <span></span>
                  <span
                    style={{
                      fontSize: "15px",
                      color: "#A99BFF",
                      marginBottom: "10px",
                    }}
                  >
                    {"장면을 담는 분야"}
                  </span>
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "clamp(30px,3vw,40px)",
                      fontWeight: "600",
                      letterSpacing: "-.03em",
                      marginBottom: "14px",
                    }}
                  >
                    {"Studio"}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(12px,1.06vw,14px)",
                      whiteSpace: "nowrap",
                      color: "#C9C9D1",
                      marginBottom: "24px",
                    }}
                  >
                    {"웹툰 · 애니메이션 · AI 인플루언서 · 브랜드 영상"}
                  </span>
                  <span style={{ fontWeight: "600" }}>{"영상 상담하기 →"}</span>
                </div>
              </GuideLink>
              <GuideLink
                href="/marketing"
                style={{
                  background: "#0D0D12",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}
                context="main"
              >
                <div
                  style={{
                    aspectRatio: "16/10",
                    overflow: "hidden",
                    background: "#141418",
                  }}
                >
                  <img
                    alt="마케팅 전략 회의"
                    src={guideAsset("public/images/cards/card-marketing.jpg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: "1",
                    padding: "28px 32px 32px",
                    display: "grid",
                    gridTemplateRows: "auto 1fr auto auto auto auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "28px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Unbounded,sans-serif",
                        fontSize: "12px",
                        letterSpacing: ".14em",
                        color: "#A99BFF",
                      }}
                    >
                      {"02 · MARKETING"}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        border: "1px solid #55555E",
                        padding: "4px 10px",
                        color: "#C9C9D1",
                      }}
                    >
                      {"문의 가능"}
                    </span>
                  </div>
                  <span></span>
                  <span
                    style={{
                      fontSize: "15px",
                      color: "#A99BFF",
                      marginBottom: "10px",
                    }}
                  >
                    {"고객을 부르는 분야"}
                  </span>
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "clamp(30px,3vw,40px)",
                      fontWeight: "600",
                      letterSpacing: "-.03em",
                      marginBottom: "14px",
                    }}
                  >
                    {"Marketing"}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(12px,1.06vw,14px)",
                      whiteSpace: "nowrap",
                      color: "#C9C9D1",
                      marginBottom: "24px",
                    }}
                  >
                    {"통합 마케팅 · SNS 대행 운영 · SEO·AEO·GEO"}
                  </span>
                  <span style={{ fontWeight: "600" }}>
                    {"마케팅 상담하기 →"}
                  </span>
                </div>
              </GuideLink>
              <GuideLink
                href="/lab"
                style={{
                  background: "#0D0D12",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}
                context="main"
              >
                <div
                  style={{
                    aspectRatio: "16/10",
                    overflow: "hidden",
                    background: "#141418",
                  }}
                >
                  <img
                    alt="개발팀 작업 공간"
                    src={guideAsset("public/images/cards/card-lab.jpg")}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: "1",
                    padding: "28px 32px 32px",
                    display: "grid",
                    gridTemplateRows: "auto 1fr auto auto auto auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "28px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Unbounded,sans-serif",
                        fontSize: "12px",
                        letterSpacing: ".14em",
                        color: "#A99BFF",
                      }}
                    >
                      {"03 · DEV"}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        border: "1px solid #55555E",
                        padding: "4px 10px",
                        color: "#C9C9D1",
                      }}
                    >
                      {"문의 가능"}
                    </span>
                  </div>
                  <span></span>
                  <span
                    style={{
                      fontSize: "15px",
                      color: "#A99BFF",
                      marginBottom: "10px",
                    }}
                  >
                    {"시스템을 만드는 분야"}
                  </span>
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "clamp(30px,3vw,40px)",
                      fontWeight: "600",
                      letterSpacing: "-.03em",
                      marginBottom: "14px",
                    }}
                  >
                    {"Lab"}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(12px,1.06vw,14px)",
                      whiteSpace: "nowrap",
                      color: "#C9C9D1",
                      marginBottom: "24px",
                    }}
                  >
                    {"업무 자동화 · 프로그램 · 웹사이트 · 쇼핑몰"}
                  </span>
                  <span style={{ fontWeight: "600" }}>{"개발 상담하기 →"}</span>
                </div>
              </GuideLink>
            </div>
          </section>
          <HomeReferences entries={this.props.entries} />
          <section
            id="process"
            className="main-method"
            style={{ background: "#0D0D12", color: "#F4F3EF" }}
          >
            <div
              style={{
                maxWidth: "1320px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,48px)",
                display: "flex",
                flexDirection: "column",
                gap: "56px",
              }}
            >
              <div className="method-intro">
                <h2 aria-label="AI로 효율을 높이고, 전문가가 품질을 지킵니다">
                  <span className="method-line">
                    <em>AI</em>로 효율을 높이고
                  </span>
                  <span className="method-line">
                    <em>전문가</em>가 품질을 지킵니다
                  </span>
                </h2>
                <p>
                  <span>AI로 제작 속도를 높이고,</span>
                  <span>
                    분야별 전문가가 기획부터 최종 검수까지 책임집니다.
                  </span>
                </p>
              </div>
              <ol
                style={{
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,240px),1fr))",
                  gap: "32px 24px",
                  borderTop: "1px solid #2A2A32",
                  paddingTop: "32px",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "13px",
                      color: "#A99BFF",
                    }}
                  >
                    {"01"}
                  </span>
                  <strong style={{ fontSize: "20px" }}>{"기획"}</strong>
                  <span
                    style={{
                      color: "#B5B5BD",
                      fontSize: "15px",
                      lineHeight: "1.7",
                    }}
                  >
                    {"전문가가 목표와 결과물을 먼저 정리합니다"}
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "13px",
                      color: "#A99BFF",
                    }}
                  >
                    {"02"}
                  </span>
                  <strong style={{ fontSize: "20px" }}>{"AI 활용 제작"}</strong>
                  <span
                    style={{
                      color: "#B5B5BD",
                      fontSize: "15px",
                      lineHeight: "1.7",
                    }}
                  >
                    {"전문가가 AI로 초안과 시안을 빠르게 만듭니다"}
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "13px",
                      color: "#A99BFF",
                    }}
                  >
                    {"03"}
                  </span>
                  <strong style={{ fontSize: "20px" }}>{"전문가 검수"}</strong>
                  <span
                    style={{
                      color: "#B5B5BD",
                      fontSize: "15px",
                      lineHeight: "1.7",
                    }}
                  >
                    {"분야별 전문가가 품질을 검수하고 완성합니다"}
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "13px",
                      color: "#A99BFF",
                    }}
                  >
                    {"04"}
                  </span>
                  <strong style={{ fontSize: "20px" }}>{"납품·관리"}</strong>
                  <span
                    style={{
                      color: "#B5B5BD",
                      fontSize: "15px",
                      lineHeight: "1.7",
                    }}
                  >
                    {"납품 후에도 수정과 유지보수를 이어갑니다"}
                  </span>
                </li>
              </ol>
            </div>
          </section>
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
                style={{
                  fontFamily: "Unbounded,sans-serif",
                  fontSize: "12px",
                  letterSpacing: ".16em",
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "15px",
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
              style={{
                maxWidth: "1320px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,48px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "48px",
              }}
            >
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(32px,4.4vw,60px)",
                  letterSpacing: "-.035em",
                  fontWeight: "700",
                  lineHeight: "1.15",
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
                        onClick={f.toggle}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "22px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "16px",
                          fontSize: "18px",
                          fontWeight: "600",
                        }}
                        type="button"
                        aria-expanded={f.open}
                        aria-controls={`main-faq-answer-${__index4}`}
                      >
                        {f.q}
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontWeight: "300",
                            color: "#6B4DFF",
                          }}
                        >
                          {f.sign}
                        </span>
                      </button>
                      <p
                        id={`main-faq-answer-${__index4}`}
                        hidden={!f.open}
                        style={{
                          margin: "0 0 24px",
                          color: "#3A3A42",
                          fontSize: "16px",
                          lineHeight: "1.75",
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
              style={{
                maxWidth: "1320px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,48px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "48px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(36px,5vw,68px)",
                    letterSpacing: "-.04em",
                    fontWeight: "800",
                    lineHeight: "1.1",
                  }}
                >
                  {"필요한 작업,"}
                  <br />
                  {"편하게 문의하세요"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.75",
                    maxWidth: "36ch",
                  }}
                >
                  {"이름과 연락처만 남겨주세요"}
                  <br />
                  <strong>{"담당자가 먼저 연락드립니다"}</strong>
                </p>
                <GuideLink
                  href="/contact"
                  style={{
                    fontWeight: "600",
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
                    <strong style={{ fontSize: "24px" }}>
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
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {"고객명"}
                      <input
                        placeholder="홍길동"
                        required={true}
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #0D0D12",
                          padding: "10px 0",
                          fontSize: "17px",
                          outline: "none",
                          background: "transparent",
                        }}
                        name="name"
                      />
                    </label>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      {"연락처"}
                      <input
                        placeholder="010-0000-0000"
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #0D0D12",
                          padding: "10px 0",
                          fontSize: "17px",
                          outline: "none",
                          background: "transparent",
                        }}
                        type="tel"
                        name="phone"
                      />
                    </label>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        fontSize: "14px",
                        fontWeight: "600",
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
                              onClick={s.pick}
                              style={{
                                cursor: "pointer",
                                padding: "10px 16px",
                                fontSize: "15px",
                                fontWeight: "500",
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
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        fontSize: "14px",
                        color: "#3A3A42",
                        cursor: "pointer",
                      }}
                    >
                      <input
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
                      style={{
                        cursor: "pointer",
                        border: "none",
                        background: "#0D0D12",
                        color: "#fff",
                        padding: "18px",
                        fontSize: "16px",
                        fontWeight: "600",
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
