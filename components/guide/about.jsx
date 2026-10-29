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

class Component extends GuideLogic {
  renderVals() {
    return {
      steps: [
        {
          no: "01",
          title: "상담",
          en: "CONSULT",
          description: "필요한 결과물과 사용처를 확인합니다",
          confirm: "작업 범위·일정·비용을 함께 정합니다",
        },
        {
          no: "02",
          title: "기획",
          en: "PLAN",
          description: "자료와 참고 방향을 살펴봅니다",
          confirm: "전달할 메시지와 화면 구성을 정합니다",
        },
        {
          no: "03",
          title: "제작",
          en: "MAKE",
          description: "합의한 기획을 바탕으로 제작합니다",
          confirm: "문구·화면·기능을 확인하고 다듬습니다",
        },
        {
          no: "04",
          title: "운영",
          en: "CARE",
          description: "결과물과 사용 방법을 정리합니다",
          confirm: "추가 수정과 운영 지원 범위는 견적에서 확인합니다",
        },
      ],
      roles: [
        {
          no: "01",
          title: "응대",
          en: "RECEPTION",
          body: "상담·견적 담당, AI로 요구사항을 빠르게 정리해 명확한 견적을 드립니다",
        },
        {
          no: "02",
          title: "기획",
          en: "PLANNING",
          body: "구조·카피 담당, 분야 전문가가 첫 방향부터 함께 잡습니다",
        },
        {
          no: "03",
          title: "제작",
          en: "PRODUCTION",
          body: "컨텐츠·마케팅·개발 담당, 전문가가 AI로 제작하고 직접 검수해 완성합니다",
        },
        {
          no: "04",
          title: "운영",
          en: "CARE",
          body: "유지보수 담당, 납품 후에도 수정과 운영 문의에 바로 대응합니다",
        },
      ],
      stacks: [
        {
          name: "Studio · 컨텐츠",
          tools: [
            "After Effects",
            "DaVinci Resolve",
            "Remotion",
            "컬러그레이딩",
            "모션그래픽",
          ],
        },
        {
          name: "Marketing · 마케팅",
          tools: ["GA4", "A/B 테스트", "SEO", "컨텐츠 캘린더", "카드뉴스·숏폼"],
        },
        {
          name: "Lab · 개발",
          tools: [
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS 4",
            "Supabase",
            "Vercel",
            "Python 3.12",
            "n8n",
            "React Native / Expo",
            "Resend",
            "shadcn/ui",
            "Cafe24",
            "Shopify",
          ],
        },
      ],
      biz: [
        { k: "상호명", v: "에이아이오 (AIO)" },
        { k: "대표자", v: "정재홍" },
        { k: "사업자번호", v: "682-01-02748" },
        { k: "통신판매업신고", v: "제 2026-경기김포-3656 호" },
        { k: "주소", v: "경기도 김포시 대곶면 흥신로67" },
        { k: "이메일", v: "AIOMAKE2023@GMAIL.COM" },
      ],
    };
  }

  render() {
    const values = adaptGuideValues("about", this.renderVals(), this.props);
    const { biz, steps } = values;
    return (
      <div className="guide-page guide-about">
        <GuideEffects />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <section
            className="about-centered-hero l-container"
            style={{
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              paddingBlock: "var(--section-y-sm)",
              paddingInline: "var(--gutter)",
              display: "flex",
              flexDirection: "column",
              gap: "36px",
            }}
          >
            <span
              className="eyebrow"
              style={{
                color: "#6E6E78",
              }}
            >
              {"ABOUT · THE STUDIO"}
            </span>
            <div data-fit="" style={{ width: "fit-content", maxWidth: "100%" }}>
              <h1
                className="t-h1"
                style={{
                  margin: "0",
                }}
              >
                <span data-fit-line="">
                  <span style={{ color: "#6B4DFF" }}>{"AI로"}</span>
                  {" 제작 효율을 높이고"}
                </span>
                <span data-fit-line="">{"결과물은 전문가가 검수합니다"}</span>
              </h1>
            </div>
            <div
              className="about-centered-description"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,380px),1fr))",
                gap: "32px",
                borderTop: "1.5px solid #0D0D12",
                paddingTop: "28px",
              }}
            >
              <strong className="t-lead">
                {"AI를 활용하는 분야별 전문가 팀"}
              </strong>
              <p
                className="t-lead"
                style={{
                  margin: "0",
                  color: "#3A3A42",
                }}
              >
                {"AIO MAKE는 "}
                <strong style={{ color: "#6B4DFF" }}>{"AI를 적극 활용"}</strong>
                {"하는 분야별 전문가 팀입니다"}
                <br />
                {"AI는 반복 작업을 돕고, 전문가는 방향과 품질을 확인합니다"}
              </p>
            </div>
          </section>
          <section
            className="about-brand-section"
            style={{ background: "#0D0D12", color: "#F4F3EF" }}
          >
            <div
              className="l-container"
              style={{
                margin: "0 auto",
                paddingBlock: "var(--section-y)",
                paddingInline: "var(--gutter)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,440px),1fr))",
                gap: "56px",
                alignItems: "center",
              }}
            >
              <div
                className="centered-copy about-brand-copy"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <span
                  className="eyebrow"
                  style={{
                    color: "#A99BFF",
                  }}
                >
                  {"BRAND · ALL-IN-ONE"}
                </span>
                <h2
                  className="t-h2"
                  style={{
                    margin: "0",
                  }}
                >
                  {"AIO는"}
                  <br />
                  <span style={{ color: "#A99BFF" }}>{"All-In-One"}</span>
                  {"입니다"}
                </h2>
                <p
                  className="t-lead"
                  style={{
                    margin: "0",
                    color: "#C9C9D1",
                    maxWidth: "46ch",
                  }}
                >
                  {"컨텐츠·마케팅·개발을 한 곳에서 맡습니다"}
                  <br />
                  {"필요한 작업을 "}
                  <strong style={{ color: "#fff" }}>
                    {"합리적인 가격에, 검수한 결과물로"}
                  </strong>
                  {" 드립니다"}
                </p>
              </div>
              <div
                style={{
                  border: "1px solid #2A2A32",
                  aspectRatio: "16/10",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "28px",
                  padding: "24px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--ff-display)",
                    fontSize: "clamp(40px,5.4vw,72px)",
                    letterSpacing: "-.03em",
                    display: "flex",
                    alignItems: "baseline",
                    gap: ".25em",
                  }}
                >
                  <span style={{ fontWeight: "800" }}>{"AIO"}</span>
                  <span style={{ fontWeight: "300" }}>{"MAKE"}</span>
                  <span
                    style={{
                      width: ".22em",
                      height: ".22em",
                      background: "#6B4DFF",
                      display: "block",
                    }}
                  ></span>
                </div>
                <div
                  className="t-small"
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    color: "#B5B5BD",
                  }}
                >
                  <span>{"AIO · 굵게 = 모든 분야를 하나로"}</span>
                  <span>{"MAKE · 가늘게 = 만드는 사람"}</span>
                  <span style={{ color: "#A99BFF" }}>{"■ 바이올렛 = AI"}</span>
                </div>
              </div>
            </div>
          </section>
          <section
            className="l-container"
            style={{
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              paddingBlock: "var(--section-y)",
              paddingInline: "var(--gutter)",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            <div
              className="about-centered-divisions"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "32px",
                alignItems: "end",
              }}
            >
              <h2
                className="t-h2"
                style={{
                  margin: "0",
                }}
              >
                {"하나의 브랜드,"}
                <br />
                <span style={{ color: "#6B4DFF" }}>{"세 개의 스튜디오"}</span>
              </h2>
              <p
                className="t-lead"
                style={{
                  margin: "0",
                  color: "#3A3A42",
                }}
              >
                {"분야는 달라도 품질 기준은 같습니다"}
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,320px),1fr))",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  minHeight: "260px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="t-lead"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontWeight: "800" }}>{"AIO"}</span>
                  <span style={{ fontWeight: "300" }}>{"MAKE"}</span>
                  <span
                    style={{
                      width: "1px",
                      height: "16px",
                      background: "#55555E",
                      display: "block",
                    }}
                  ></span>
                  <span style={{ fontWeight: "600", color: "#A99BFF" }}>
                    {"Studio"}
                  </span>
                </div>
                <span
                  className="t-small"
                  style={{
                    color: "#A99BFF",
                  }}
                >
                  {"장면을 담는 분야 · 컨텐츠"}
                </span>
                <span
                  className="t-small"
                  style={{
                    color: "#C9C9D1",
                  }}
                >
                  {
                    "웹툰 · 애니메이션 · AI 인플루언서 · 모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상"
                  }
                </span>
              </div>
              <div
                style={{
                  background: "#fff",
                  border: "1px solid #DAD8D1",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  minHeight: "260px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="t-lead"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontWeight: "800" }}>{"AIO"}</span>
                  <span style={{ fontWeight: "300" }}>{"MAKE"}</span>
                  <span
                    style={{
                      width: "1px",
                      height: "16px",
                      background: "#C9C7BF",
                      display: "block",
                    }}
                  ></span>
                  <span style={{ fontWeight: "600", color: "#6B4DFF" }}>
                    {"Marketing"}
                  </span>
                </div>
                <span
                  className="t-small"
                  style={{
                    color: "#6B4DFF",
                  }}
                >
                  {"고객을 부르는 분야 · 마케팅"}
                </span>
                <span
                  className="t-small"
                  style={{
                    color: "#3A3A42",
                  }}
                >
                  {"마케팅 패키지, SNS 운영 대행, SEO·AEO 최적화"}
                </span>
              </div>
              <div
                style={{
                  background: "#1C1C22",
                  color: "#fff",
                  padding: "28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  minHeight: "260px",
                  boxSizing: "border-box",
                }}
              >
                <div
                  className="t-lead"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontWeight: "800" }}>{"AIO"}</span>
                  <span style={{ fontWeight: "300" }}>{"MAKE"}</span>
                  <span
                    style={{
                      width: "1px",
                      height: "16px",
                      background: "#55555E",
                      display: "block",
                    }}
                  ></span>
                  <span style={{ fontWeight: "600", color: "#A99BFF" }}>
                    {"Lab"}
                  </span>
                </div>
                <span
                  className="t-small"
                  style={{
                    color: "#A99BFF",
                  }}
                >
                  {"시스템을 만드는 분야 · 개발"}
                </span>
                <span
                  className="t-small"
                  style={{
                    color: "#C9C9D1",
                  }}
                >
                  {"업무 자동화 구축, 프로그램 개발, 웹사이트, 쇼핑몰"}
                </span>
              </div>
            </div>
          </section>
          <section
            style={{
              background: "#fff",
              borderTop: "1px solid #DAD8D1",
              borderBottom: "1px solid #DAD8D1",
            }}
          >
            <div
              className="l-container"
              style={{
                margin: "0 auto",
                paddingBlock: "var(--section-y)",
                paddingInline: "var(--gutter)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "16px",
                }}
              >
                <span
                  className="eyebrow"
                  style={{
                    color: "#6E6E78",
                  }}
                >
                  {"HOW WE WORK"}
                </span>
                <h2
                  className="t-h2"
                  style={{
                    margin: "0",
                    textWrap: "balance",
                  }}
                >
                  {"범위를 정하고, "}
                  <span style={{ color: "#6B4DFF" }}>
                    {"완성까지 확인합니다"}
                  </span>
                </h2>
                <p
                  className="t-lead"
                  style={{
                    margin: "0",
                    color: "#3A3A42",
                    maxWidth: "44ch",
                  }}
                >
                  {
                    "목적과 자료를 확인하고, 기획·제작·검수를 거쳐 결과물을 전달합니다"
                  }
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,260px),1fr))",
                  gap: "12px",
                }}
              >
                {(steps || []).map((s, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      style={{
                        background: "#F4F3EF",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          padding: "28px 28px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--ff-display)",
                            fontSize: "clamp(36px,3.4vw,48px)",
                            fontWeight: "300",
                            color: "#6B4DFF",
                            lineHeight: "1",
                          }}
                        >
                          {s.no}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "baseline",
                            gap: "10px",
                          }}
                        >
                          <strong className="t-lead">{s.title}</strong>
                          <span
                            className="eyebrow"
                            style={{
                              color: "#6E6E78",
                            }}
                          >
                            {s.en}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: "auto",
                          padding: "18px 28px",
                          borderTop: "1px solid #DAD8D1",
                          display: "grid",
                          gap: "6px",
                        }}
                      >
                        <p className="t-small" style={{ margin: 0 }}>
                          {s.description}
                        </p>
                        <p className="t-small" style={{ margin: 0 }}>
                          {s.confirm}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section
            className="l-container"
            style={{
              width: "100%",
              boxSizing: "border-box",
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
              {"사업자 정보"}
            </h2>
            <dl
              className="t-body"
              style={{
                margin: "0",
                display: "flex",
                flexDirection: "column",
                borderTop: "1.5px solid #0D0D12",
              }}
            >
              {(biz || []).map((b, __index3) => (
                <React.Fragment key={__index3}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "140px minmax(0,1fr)",
                      gap: "16px",
                      padding: "16px 0",
                      borderBottom: "1px solid #DAD8D1",
                    }}
                  >
                    <dt style={{ color: "#6E6E78" }}>{b.k}</dt>
                    <dd style={{ margin: "0", fontWeight: "500" }}>{b.v}</dd>
                  </div>
                </React.Fragment>
              ))}
            </dl>
          </section>
          <section style={{ background: "#6B4DFF", color: "#fff" }}>
            <div
              className="l-container"
              style={{
                margin: "0 auto",
                paddingBlock: "var(--section-y-sm)",
                paddingInline: "var(--gutter)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "32px",
                flexWrap: "wrap",
              }}
            >
              <h2
                className="t-h2"
                style={{
                  margin: "0",
                }}
              >
                {"필요한 작업, 편하게 문의하세요"}
              </h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <GuideLink
                  className="t-button"
                  href="AIO 메인 시안.dc.html#contact"
                  style={{
                    background: "#fff",
                    color: "#0D0D12",
                    padding: "18px 28px",
                  }}
                  context="main"
                >
                  {"견적 문의 →"}
                </GuideLink>
                <GuideLink
                  className="t-button"
                  href="AIO 팀원소개 시안.dc.html"
                  style={{
                    border: "1.5px solid #fff",
                    padding: "16.5px 26px",
                  }}
                  context="main"
                >
                  {"팀원 보기"}
                </GuideLink>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
