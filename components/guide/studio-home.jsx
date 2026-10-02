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

class Component extends GuideLogic {
  renderVals() {
    const svc = [
      ["webtoon", "웹툰", "맞춤 제작"],
      ["animation", "애니메이션", "맞춤 제작"],
      ["ai-influencer", "AI 인플루언서 컨텐츠", "맞춤 제작"],
      ["promo", "브랜드 홍보 컨텐츠", "맞춤 제작"],
      ["ad", "SNS 광고 컨텐츠", "맞춤 제작"],
      ["edit", "편집·클리퍼", "보유 컨텐츠 편집·클립"],
    ];
    return {
      works: [
        ["웹툰", "webtoon"],
        ["애니메이션", "animation"],
        ["AI 인플루언서", "ai-influencer"],
        ["SNS 광고 컨텐츠", "ad"],
      ].map(([cat, service], i) => ({
        id: "studio-home-w" + (i + 1),
        cat,
        n: 0,
        href: "/video/work/example-" + service,
      })),
      services: svc.map(([k, name, line], i) => ({
        no: String(i + 1).padStart(2, "0"),
        name,
        line,
        href: "Studio 서비스 상세.dc.html?s=" + k,
      })),
      steps: [
        {
          no: "01",
          title: "상담·시나리오",
          desc: "상담 자료로 조사하고 시나리오를 기획합니다 수정 범위 합의 후 확정합니다",
        },
        {
          no: "02",
          title: "샷 기획·확정",
          desc: "장면별 샷을 설계하고 고객 피드백으로 확정합니다",
        },
        {
          no: "03",
          title: "Blender 시뮬레이션",
          desc: "확정한 샷을 3D로 미리 움직여 구조를 검증합니다",
        },
        {
          no: "04",
          title: "제작·수정",
          desc: "컨텐츠를 제작하고 합의한 범위 안에서 보완합니다",
        },
        {
          no: "05",
          title: "납품 검수",
          desc: "인물·제품·자막·권리를 확인한 뒤 전달합니다",
        },
      ],
      posts: [
        {
          id: "studio-home-p1",
          date: "제작 가이드",
          title: "브랜드 웹툰, 몇 컷이 적당할까",
        },
        {
          id: "studio-home-p2",
          date: "제작 가이드",
          title: "AI 인플루언서를 운영하기 전에 정해야 할 것들",
        },
        {
          id: "studio-home-p3",
          date: "제작 가이드",
          title: "숏폼 첫 3초를 구성하는 방법",
        },
      ],
    };
  }

  render() {
    const values = adaptGuideValues(
      "studio-home",
      this.renderVals(),
      this.props,
    );
    const { posts, services, steps, works } = values;
    return (
      <div className="guide-page guide-studio-home">
        <GuideEffects />
        <div
          style={{
            background: "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GuideNav division="video" active="home" />
          <section
            style={{
              position: "relative",
              height: "calc(100vh - 128px)",
              minHeight: "600px",
              maxHeight: "1000px",
              overflow: "hidden",
              background: "#0D0D12",
            }}
          >
            <div style={{ position: "absolute", inset: "0" }}>
              <GuideMedia id="studio-home-reel" mode="autoplay" sample="reel" />
            </div>
            <div
              style={{
                position: "absolute",
                inset: "0",
                pointerEvents: "none",
                background:
                  "linear-gradient(180deg,rgba(0,0,0,.25) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,.85) 100%)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                left: "0",
                right: "0",
                bottom: "0",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  maxWidth: "1440px",
                  margin: "0 auto",
                  padding: "0 clamp(20px,4vw,56px) clamp(36px,5vw,64px)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "32px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".18em",
                      color: "#A99BFF",
                    }}
                  >
                    {"AIO MAKE STUDIO"}
                  </span>
                  <div
                    data-fit=""
                    style={{ width: "fit-content", maxWidth: "100%" }}
                  >
                    <h1
                      style={{
                        margin: "0",
                        fontSize: "clamp(40px,6.6vw,100px)",
                        lineHeight: "1.1",
                        letterSpacing: "-.045em",
                        fontWeight: "800",
                      }}
                    >
                      <span data-fit-line="">
                        <span style={{ color: "#A99BFF" }}>{"AI"}</span>
                        {"가 속도를 내고"}
                      </span>
                      <span data-fit-line="">{"전문가가 완성합니다"}</span>
                    </h1>
                  </div>
                </div>
                <GuideLink
                  href="Studio 작업 사례.dc.html"
                  style={{
                    pointerEvents: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "13px",
                    letterSpacing: ".1em",
                  }}
                  context="video"
                >
                  <span
                    style={{
                      width: "56px",
                      height: "56px",
                      border: "1.5px solid #fff",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                    }}
                  >
                    {"→"}
                  </span>
                  {"제작 방향 살펴보기"}
                </GuideLink>
              </div>
            </div>
          </section>
          <section
            style={{
              maxWidth: "1440px",
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              padding:
                "clamp(80px,10vw,140px) clamp(20px,4vw,56px) clamp(40px,5vw,64px)",
            }}
          >
            <p
              className="centered-copy studio-expertise"
              style={{
                margin: "0",
                fontSize: "clamp(22px,2.8vw,40px)",
                lineHeight: "1.45",
                letterSpacing: "-.03em",
                fontWeight: "600",
              }}
            >
              <span style={{ display: "block" }}>
                {"초안은 "}
                <span style={{ color: "#A99BFF" }}>{"AI"}</span>
                {"로 빠르게 만들고"}
              </span>
              <span style={{ display: "block", color: "#77777F" }}>
                {"연출과 검수는 "}
                <strong style={{ color: "#A99BFF", fontWeight: "inherit" }}>
                  컨텐츠 전문가
                </strong>
                {"가 직접 합니다"}
              </span>
            </p>
          </section>
          <section
            style={{
              maxWidth: "1440px",
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              padding:
                "clamp(40px,5vw,64px) clamp(20px,4vw,56px) clamp(80px,10vw,140px)",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "20px",
                flexWrap: "wrap",
                borderBottom: "1px solid #2A2A32",
                paddingBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0",
                  fontFamily: "Unbounded,sans-serif",
                  fontSize: "clamp(36px,5vw,72px)",
                  fontWeight: "800",
                  letterSpacing: "-.04em",
                  lineHeight: "1",
                }}
              >
                {"Works"}
              </h2>
              <GuideLink
                href="Studio 작업 사례.dc.html"
                style={{
                  fontFamily: "Unbounded,sans-serif",
                  fontSize: "13px",
                  letterSpacing: ".1em",
                  borderBottom: "1px solid #fff",
                  paddingBottom: "4px",
                }}
                context="video"
              >
                {"ALL WORKS →"}
              </GuideLink>
            </div>
            <GuideLink
              href="/video/work/example-brand-film"
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              context="video"
            >
              <div
                style={{
                  aspectRatio: "21/9",
                  position: "relative",
                  background: "#141418",
                }}
              >
                <GuideMedia id="studio-home-w0" n="2" sample="brand-film" />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <strong
                  style={{
                    fontSize: "clamp(20px,2vw,26px)",
                    letterSpacing: "-.02em",
                  }}
                >
                  {"제작 예시"}
                </strong>
                <span style={{ color: "#9A9AA3", fontSize: "14px" }}>
                  {"서비스 · 2026"}
                </span>
              </div>
            </GuideLink>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(min(100%,380px),1fr))",
                gap: "40px 16px",
              }}
            >
              {(works || []).map((w, __index3) => (
                <React.Fragment key={__index3}>
                  <GuideLink
                    href={w.href}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                    context="video"
                  >
                    <div
                      style={{
                        aspectRatio: "16/9",
                        position: "relative",
                        background: "#141418",
                      }}
                    >
                      {w.id === "studio-home-w1" ? (
                        <GuideImage
                          src="/images/guide/webtoon-svc-webtoon-cut01.webp"
                          placeholder="1억의 구단주 웹툰 제작 시안"
                        />
                      ) : (
                        <GuideMedia id={w.id} n={w.n} sample={w.cat} />
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <strong style={{ fontSize: "17px" }}>
                        {"제작 예시"}
                      </strong>
                      <span style={{ color: "#9A9AA3", fontSize: "13.5px" }}>
                        {w.cat}
                        {" · 2026"}
                      </span>
                    </div>
                  </GuideLink>
                </React.Fragment>
              ))}
            </div>
          </section>
          <section style={{ borderTop: "1px solid #2A2A32" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "20px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "clamp(36px,5vw,72px)",
                    fontWeight: "800",
                    letterSpacing: "-.04em",
                    lineHeight: "1",
                  }}
                >
                  {"Services"}
                </h2>
                <span style={{ fontSize: "17px", color: "#C9C9D1" }}>
                  {"가격과 제작 과정을 서비스별로 확인하세요"}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #fff",
                }}
              >
                {(services || []).map((s, __index4) => (
                  <React.Fragment key={__index4}>
                    <GuideLink
                      href={s.href}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(min(100%,280px),1fr))",
                        gap: "12px 32px",
                        alignItems: "center",
                        padding: "clamp(22px,2.6vw,32px) 0",
                        borderBottom: "1px solid #2A2A32",
                      }}
                      className="gh-3a9b8b3e"
                      context="video"
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "20px",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontSize: "13px",
                            color: "#A99BFF",
                          }}
                        >
                          {s.no}
                        </span>
                        <strong
                          style={{
                            fontSize: "clamp(24px,2.6vw,36px)",
                            letterSpacing: "-.03em",
                          }}
                        >
                          {s.name}
                        </strong>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "20px",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "16px", color: "#C9C9D1" }}>
                          {s.line}
                        </span>
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontSize: "18px",
                            color: "#A99BFF",
                          }}
                        >
                          {"→"}
                        </span>
                      </div>
                    </GuideLink>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ borderTop: "1px solid #2A2A32" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "48px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                  gap: "24px 48px",
                  alignItems: "end",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "clamp(36px,5vw,72px)",
                    fontWeight: "800",
                    letterSpacing: "-.04em",
                    lineHeight: "1",
                  }}
                >
                  {"Process"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.7",
                    color: "#C9C9D1",
                  }}
                >
                  {"상담 자료로 "}
                  <span style={{ color: "#A99BFF" }}>
                    {"시나리오와 샷을 먼저 확정"}
                  </span>
                  {"하고 제작해, 납품 뒤 구조를 다시 짜는 일을 줄입니다"}
                </p>
              </div>
              <ol
                style={{
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,180px),1fr))",
                  gap: "16px",
                }}
              >
                {(steps || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <li
                      style={{
                        borderTop: "2px solid #6B4DFF",
                        paddingTop: "24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "32px",
                          fontWeight: "300",
                          color: "#A99BFF",
                        }}
                      >
                        {p.no}
                      </span>
                      <strong style={{ fontSize: "20px" }}>{p.title}</strong>
                      <span style={{ color: "#9A9AA3", fontSize: "15px" }}>
                        {p.desc}
                      </span>
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </div>
          </section>
          <section style={{ borderTop: "1px solid #2A2A32" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "20px",
                  flexWrap: "wrap",
                  borderBottom: "1px solid #2A2A32",
                  paddingBottom: "20px",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "clamp(36px,5vw,72px)",
                    fontWeight: "800",
                    letterSpacing: "-.04em",
                    lineHeight: "1",
                  }}
                >
                  {"Insights"}
                </h2>
                <GuideLink
                  href="Studio 인사이트.dc.html"
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "13px",
                    letterSpacing: ".1em",
                    borderBottom: "1px solid #fff",
                    paddingBottom: "4px",
                  }}
                  context="video"
                >
                  {"ALL INSIGHTS →"}
                </GuideLink>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(min(100%,260px),1fr))",
                  gap: "32px 16px",
                }}
              >
                {(posts || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <GuideLink
                      href={p.href}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                      context="video"
                    >
                      <div
                        style={{
                          aspectRatio: "16/10",
                          position: "relative",
                          background: "#141418",
                        }}
                      >
                        <GuideImage
                          id={p.id}
                          placeholder="칼럼 썸네일 (1600×1000)"
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#9A9AA3",
                          fontFamily: "Unbounded,sans-serif",
                          letterSpacing: ".04em",
                        }}
                      >
                        {p.date === "制作" ? "제작 가이드" : p.date}
                      </span>
                      <strong
                        style={{
                          fontSize: "19px",
                          lineHeight: "1.45",
                          letterSpacing: "-.02em",
                        }}
                      >
                        {p.title}
                      </strong>
                    </GuideLink>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ background: "#6B4DFF" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(64px,8vw,112px) clamp(20px,4vw,56px)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: "32px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(32px,4.6vw,64px)",
                    letterSpacing: "-.04em",
                    fontWeight: "800",
                    lineHeight: "1.08",
                  }}
                >
                  {"어떤 컨텐츠가 필요 하신가요?"}
                </h2>
                <span style={{ fontSize: "17px" }}>
                  {"내용을 남겨주시면 컨텐츠 담당자가 견적과 일정을 안내드립니다"}
                </span>
              </div>
              <GuideLink
                href="Studio 문의.dc.html"
                style={{
                  background: "#fff",
                  color: "#0D0D12",
                  padding: "18px 28px",
                  fontWeight: "600",
                }}
                context="video"
              >
                {"프로젝트 문의 →"}
              </GuideLink>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
