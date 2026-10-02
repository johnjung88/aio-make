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

const R = (scope, role, count, desc, tags) => ({
  scope,
  role,
  count,
  desc,
  tags,
});
const DATA = [
  {
    key: "Studio",
    name: "Studio",
    ko: "영상 팀",
    roles: [
      R(
        "영상",
        "기획",
        2,
        "목적과 채널에 맞춰 콘셉트, 스토리보드, 장면 구성을 설계합니다",
        ["콘셉트", "스토리보드", "연출"],
      ),
      R(
        "영상",
        "편집",
        4,
        "AI로 만든 소스를 편집하고 자막, 사운드, 컬러까지 채널 규격에 맞춰 완성합니다",
        ["컷 편집", "자막·사운드", "컬러그레이딩"],
      ),
    ],
  },
  {
    key: "Marketing",
    name: "Marketing",
    ko: "마케팅 팀",
    roles: [
      R(
        "마케팅",
        "기획",
        2,
        "브랜드와 목표에 맞는 채널 전략과 월간 운영 계획을 세웁니다",
        ["채널 전략", "운영 캘린더"],
      ),
      R(
        "마케팅",
        "콘텐츠",
        4,
        "SNS 피드, 블로그, 숏폼 콘텐츠를 꾸준히 제작하고 발행합니다",
        ["SNS", "블로그", "숏폼"],
      ),
      R(
        "마케팅",
        "디자인",
        2,
        "카드뉴스, 배너, 피드 이미지를 브랜드 톤에 맞춰 만듭니다",
        ["카드뉴스", "배너", "피드"],
      ),
      R(
        "마케팅",
        "그로스",
        1,
        "광고와 유입 채널을 실험하며 성과가 나는 방향을 찾습니다",
        ["퍼포먼스", "A/B 테스트"],
      ),
      R(
        "마케팅",
        "SEO·AEO",
        1,
        "검색엔진과 AI 검색에서 브랜드가 잘 노출되도록 구조와 콘텐츠를 최적화합니다",
        ["SEO", "AEO", "키워드"],
      ),
      R(
        "마케팅",
        "분석",
        1,
        "채널 데이터를 분석해 월간 리포트와 다음 달 개선안을 드립니다",
        ["GA4", "리포트"],
      ),
    ],
  },
  {
    key: "Lab",
    name: "Lab",
    ko: "개발 팀",
    roles: [
      R(
        "웹사이트 · 쇼핑몰",
        "기획",
        2,
        "요구사항을 정리하고 사이트 구조, 화면 흐름, 결제 흐름을 설계합니다",
        ["요구사항", "IA", "화면 설계"],
      ),
      R(
        "웹사이트 · 쇼핑몰",
        "디자인",
        2,
        "반응형 UI와 상세·배너 이미지를 브랜드에 맞게 디자인합니다",
        ["UI/UX", "반응형", "상세페이지"],
      ),
      R(
        "웹사이트 · 쇼핑몰",
        "개발",
        2,
        "웹사이트와 쇼핑몰을 구축하고 배포, 유지보수까지 맡습니다",
        ["Next.js", "Cafe24", "Shopify"],
      ),
      R(
        "업무 자동화",
        "기획",
        1,
        "고객의 반복 업무를 분석해 자동화할 범위와 흐름을 설계합니다",
        ["업무 분석", "프로세스"],
      ),
      R(
        "업무 자동화",
        "개발",
        1,
        "알림, 보고서, 데이터 처리를 자동화 시스템으로 구현합니다",
        ["Python", "n8n", "API"],
      ),
    ],
  },
].map((d) => ({ ...d, total: d.roles.reduce((n, r) => n + r.count, 0) }));
class Component extends GuideLogic {
  state = { tab: "전체" };
  renderVals() {
    const tab = this.state.tab;
    return {
      leaders: [],
      tabs: ["전체", "Studio", "Marketing", "Lab"].map((label) => ({
        label,
        bg: tab === label ? "#0D0D12" : "#fff",
        fg: tab === label ? "#fff" : "#0D0D12",
        pick: () => this.setState({ tab: label }),
      })),
      divisions: tab === "전체" ? DATA : DATA.filter((d) => d.key === tab),
    };
  }

  render() {
    const values = adaptGuideValues("team", this.renderVals(), this.props);
    const { divisions, leaders, tabs } = values;
    return (
      <div className="guide-page guide-team">
        <GuideEffects />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <section
            style={{
              maxWidth: "1320px",
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              padding:
                "clamp(64px,9vw,128px) clamp(20px,4vw,48px) clamp(48px,6vw,80px)",
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
              {"OUR EXPERTISE"}
            </span>
            <div
              data-fit=""
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                width: "fit-content",
                maxWidth: "100%",
              }}
            >
              <h1
                style={{
                  margin: "0",
                  fontSize: "clamp(44px,7.4vw,112px)",
                  lineHeight: "1.1",
                  letterSpacing: "-.045em",
                  fontWeight: "800",
                }}
              >
                <span data-fit-line="">{"각 분야의 역할이"}</span>
                <span data-fit-line="" style={{ color: "#6B4DFF" }}>
                  {"하나의 결과물로"}
                </span>
              </h1>
              <p
                style={{
                  margin: "0",
                  fontSize: "20px",
                  lineHeight: "1.6",
                  color: "#3A3A42",
                }}
              >
                <span data-fit-line="sub">
                  {"기획부터 제작과 검수까지 역할을 나누고"}
                </span>
                <span
                  data-fit-line="sub"
                  style={{ color: "#0D0D12", fontWeight: "600" }}
                >
                  {"합의한 기준으로 결과물을 완성합니다"}
                </span>
              </p>
            </div>
          </section>
          <section
            style={{
              maxWidth: "1320px",
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              padding: "0 clamp(20px,4vw,48px) clamp(80px,10vw,140px)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "16px",
                flexWrap: "wrap",
                borderTop: "1.5px solid #0D0D12",
                paddingTop: "18px",
              }}
            >
              <h2
                style={{
                  margin: "0",
                  fontSize: "22px",
                  letterSpacing: "-.02em",
                }}
              >
                {"기획부터 완성까지 함께합니다"}
              </h2>
              <span
                style={{
                  fontFamily: "Unbounded,sans-serif",
                  fontSize: "12px",
                  letterSpacing: ".14em",
                  color: "#6E6E78",
                }}
              >
                {"OUR EXPERTISE"}
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,260px),1fr))",
                gap: "12px",
              }}
            >
              {(leaders || []).map((l, __index3) => (
                <React.Fragment key={__index3}>
                  <div
                    style={{
                      background: l.bg,
                      color: l.fg,
                      border: "1px solid #DAD8D1",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: "4/3",
                        position: "relative",
                        background: "#E6E4DD",
                      }}
                    >
                      <GuideImage
                        id={l.id}
                        placeholder={l.name + " 작업을 설명하는 이미지"}
                      />
                    </div>
                    <div
                      style={{
                        padding: "22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "11px",
                          letterSpacing: ".14em",
                          color: l.accent,
                        }}
                      >
                        {l.tag}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <strong style={{ fontSize: "22px" }}>{l.name}</strong>
                        <span style={{ fontSize: "14px", opacity: ".75" }}>
                          {l.role}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.7",
                          opacity: ".8",
                        }}
                      >
                        {l.desc}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>
          <section
            style={{ background: "#fff", borderTop: "1px solid #DAD8D1" }}
          >
            <div
              style={{
                maxWidth: "1320px",
                margin: "0 auto",
                padding:
                  "clamp(64px,8vw,112px) clamp(20px,4vw,48px) clamp(80px,10vw,140px)",
                display: "flex",
                flexDirection: "column",
                gap: "48px",
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
                    fontSize: "clamp(32px,4.4vw,60px)",
                    letterSpacing: "-.035em",
                    fontWeight: "700",
                    lineHeight: "1.1",
                  }}
                >
                  {"분야별 업무"}
                </h2>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {(tabs || []).map((t, __index5) => (
                    <React.Fragment key={__index5}>
                      <button
                        onClick={t.pick}
                        style={{
                          cursor: "pointer",
                          padding: "9px 16px",
                          fontSize: "14px",
                          fontWeight: "600",
                          border: "1.5px solid #0D0D12",
                          background: t.bg,
                          color: t.fg,
                        }}
                        type="button"
                      >
                        {t.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {(divisions || []).map((d, __index3) => (
                <React.Fragment key={__index3}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "28px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        alignItems: "baseline",
                        borderTop: "1.5px solid #0D0D12",
                        paddingTop: "18px",
                        flexWrap: "wrap",
                      }}
                    >
                      <strong
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "22px",
                          fontWeight: "600",
                          letterSpacing: "-.02em",
                        }}
                      >
                        {d.name}
                      </strong>
                      <span style={{ color: "#6E6E78", fontSize: "15px" }}>
                        {d.ko}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill,minmax(min(100%,280px),1fr))",
                        gap: "12px",
                      }}
                    >
                      {(d.roles || []).map((r, __index6) => (
                        <React.Fragment key={__index6}>
                          <div
                            style={{
                              background: "#F4F3EF",
                              padding: "24px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "14px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                  minWidth: "0",
                                }}
                              >
                                <span
                                  style={{ fontSize: "13px", color: "#6E6E78" }}
                                >
                                  {r.scope}
                                </span>
                                <strong
                                  style={{
                                    fontSize: "22px",
                                    letterSpacing: "-.02em",
                                  }}
                                >
                                  {r.role}
                                </strong>
                              </div>

                            </div>
                            <span
                              style={{
                                fontSize: "15px",
                                color: "#3A3A42",
                                lineHeight: "1.7",
                              }}
                            >
                              {r.desc}
                            </span>
                            <div
                              style={{
                                display: "flex",
                                gap: "6px",
                                flexWrap: "wrap",
                              }}
                            >
                              {(r.tags || []).map((t, __index9) => (
                                <React.Fragment key={__index9}>
                                  <span
                                    style={{
                                      fontSize: "12.5px",
                                      padding: "4px 9px",
                                      border: "1px solid #DAD8D1",
                                      background: "#fff",
                                    }}
                                  >
                                    {t}
                                  </span>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </section>
          <section style={{ background: "#6B4DFF", color: "#fff" }}>
            <div
              style={{
                maxWidth: "1320px",
                margin: "0 auto",
                padding: "clamp(64px,8vw,112px) clamp(20px,4vw,48px)",
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
                  {"필요한 작업, 편하게 문의하세요"}
                </h2>
                <span style={{ fontSize: "17px" }}>
                  {"문의를 남기시면 담당자가 먼저 연락드립니다"}
                </span>
              </div>
              <GuideLink
                href="AIO 메인 시안.dc.html#contact"
                style={{
                  background: "#fff",
                  color: "#0D0D12",
                  padding: "18px 28px",
                  fontWeight: "600",
                }}
                context="main"
              >
                {"견적 문의 →"}
              </GuideLink>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
