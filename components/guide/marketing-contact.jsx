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

const MAP = {
  integrated: "통합 마케팅 (월 200만 원부터 · VAT 별도)",
  sns: "SNS 대행 운영 (월 100만 원 · VAT 별도)",
  ai: "AI 인플루언서 마케팅 (월 100만 원 · VAT 별도)",
  seo: "SEO·AEO·GEO (별도 견적)",
};
const G = [
  ["service", "원하는 서비스 *", [...Object.values(MAP), "아직 모르겠어요"]],
  [
    "ind",
    "업종 *",
    [
      "요식",
      "뷰티",
      "병원·의원",
      "교육·학원",
      "쇼핑몰",
      "부동산",
      "숙박·여행",
      "전문직(법률·세무)",
      "기타",
    ],
  ],
  [
    "pain",
    "현재 고민 (여러 개 선택 가능)",
    [
      "유입이 적다",
      "문의·구매로 이어지지 않는다",
      "계정이 방치돼 있다",
      "검색에 나오지 않는다",
      "AI 답변에 나오지 않는다",
      "운영할 사람이 없다",
    ],
  ],
  ["when", "희망 시작일", ["바로", "2주 이내", "1개월 이내", "협의"]],
];
const MULTI = { pain: true };
class Component extends GuideLogic {
  state = {
    service:
      MAP[guideContactKey(this.props.service, "marketing")] ||
      (() => {
        try {
          return MAP[new URLSearchParams(location.search).get("s")] || "";
        } catch (e) {
          return "";
        }
      })(),
    ind: "",
    pain: [],
    when: "",
    sent: false,
  };
  renderVals() {
    return {
      groups: G.map(([key, label, opts]) => ({
        label,
        opts: opts.map((o) => {
          const multi = MULTI[key];
          const on = multi
            ? this.state[key].includes(o)
            : this.state[key] === o;
          return {
            selected: on,
            label: o,
            bg: on ? "#6B4DFF" : "transparent",
            fg: on ? "#fff" : "#0D0D12",
            bd: on ? "#6B4DFF" : "#A8A69E",
            pick: () =>
              this.setState((s) =>
                multi
                  ? {
                      [key]: on
                        ? s[key].filter((x) => x !== o)
                        : [...s[key], o],
                    }
                  : { [key]: o },
              ),
          };
        }),
      })),
      sent: this.state.sent,
      notSent: !this.state.sent,
      submit: (e) => {
        e.preventDefault();
        this.setState({ sent: true });
      },
    };
  }

  render() {
    const values = adaptGuideValues(
      "marketing-contact",
      this.renderVals(),
      this.props,
    );
    const { groups, notSent, sent, submit } = values;
    const isSeo = this.state.service === MAP.seo;
    const isIntegrated = this.state.service === MAP.integrated;
    return (
      <div className="guide-page guide-marketing-contact">
        <GuideEffects />
        <div
          style={{
            background: "#fff",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GuideNav division="marketing" active="contact" />
          <section
            style={{
              maxWidth: "1440px",
              width: "100%",
              boxSizing: "border-box",
              margin: "0 auto",
              padding:
                "clamp(56px,7vw,100px) clamp(20px,4vw,56px) clamp(80px,10vw,140px)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(min(100%,440px),1fr))",
              gap: "56px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              <span
                style={{
                  fontFamily: "Unbounded,sans-serif",
                  fontSize: "12px",
                  letterSpacing: ".16em",
                  color: "#6B4DFF",
                }}
              >
                {"START MARKETING"}
              </span>
              <div
                data-fit="balance"
                style={{ width: "fit-content", maxWidth: "100%" }}
              >
                <h1
                  style={{
                    margin: "0",
                    fontSize: "clamp(34px,4.6vw,62px)",
                    letterSpacing: "-.04em",
                    fontWeight: "800",
                    lineHeight: "1.14",
                  }}
                >
                  <span data-fit-line="">{"상담만 남기셔도"}</span>
                  <span data-fit-line="">{"분석 자료를 드립니다"}</span>
                </h1>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "17px",
                  lineHeight: "1.75",
                  color: "#3A3A42",
                }}
              >
                {"업종과 운영 중인 채널을 남겨주시면 "}
                <strong style={{ color: "#6B4DFF" }}>
                  {"시장, 경쟁사, 운영 방향 분석 자료"}
                </strong>
                {"를 정리해 드립니다"}
                <br />
                {
                  "통합·SNS·AI 인플루언서 월 운영 계약에는 기본 소개·문의 사이트 구축 또는 리뉴얼 1회를 제공합니다 범위와 운영 실비는 견적에서 확인합니다"
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #0D0D12",
                  marginTop: "12px",
                  maxWidth: "420px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "14px 0",
                    borderBottom: "1px solid #DAD8D1",
                    fontSize: "15px",
                  }}
                >
                  <span style={{ color: "#6E6E78" }}>{"계약"}</span>
                  <strong style={{ fontWeight: "600" }}>
                    {isSeo
                      ? "프로젝트 단위"
                      : isIntegrated
                        ? "최소 3개월"
                        : "서비스별 확인"}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "14px 0",
                    borderBottom: "1px solid #DAD8D1",
                    fontSize: "15px",
                  }}
                >
                  <span style={{ color: "#6E6E78" }}>{"일정·수정"}</span>
                  <strong style={{ fontWeight: "600" }}>
                    {"견적에서 합의"}
                  </strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    padding: "14px 0",
                    borderBottom: "1px solid #DAD8D1",
                    fontSize: "15px",
                  }}
                >
                  <span style={{ color: "#6E6E78" }}>
                    {isSeo ? "구축 이후" : "월 운영 혜택"}
                  </span>
                  <strong style={{ fontWeight: "600" }}>
                    {isSeo ? "월 유지관리 선택" : "기본 사이트 1회"}
                  </strong>
                </div>
              </div>
            </div>
            {sent ? (
              <React.Fragment>
                <div
                  style={{
                    border: "1px solid #6B4DFF",
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
                    {"마케팅 담당자가 확인한 뒤 연락드리겠습니다"}
                  </span>
                </div>
              </React.Fragment>
            ) : null}
            {notSent ? (
              <React.Fragment>
                <InquiryBridge
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                  division="marketing"
                  selection={this.state}
                  initialService={this.props.service}
                  quick={false}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit,minmax(min(100%,200px),1fr))",
                      gap: "22px",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "13.5px",
                        color: "#6E6E78",
                      }}
                    >
                      {"고객명 *"}
                      <input
                        placeholder="홍길동"
                        required={true}
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #A8A69E",
                          padding: "10px 0",
                          fontSize: "17px",
                          outline: "none",
                          background: "transparent",
                          color: "#0D0D12",
                        }}
                        name="name"
                      />
                    </label>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "13.5px",
                        color: "#6E6E78",
                      }}
                    >
                      {"연락처 "}
                      <input
                        placeholder="010-0000-0000"
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #A8A69E",
                          padding: "10px 0",
                          fontSize: "17px",
                          outline: "none",
                          background: "transparent",
                          color: "#0D0D12",
                        }}
                        type="tel"
                        name="phone"
                      />
                    </label>
                  </div>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "13.5px",
                      color: "#6E6E78",
                    }}
                  >
                    {"이메일 "}
                    <input
                      placeholder="name@company.com"
                      style={{
                        border: "none",
                        borderBottom: "1.5px solid #A8A69E",
                        padding: "10px 0",
                        fontSize: "17px",
                        outline: "none",
                        background: "transparent",
                        color: "#0D0D12",
                      }}
                      type="email"
                      name="email"
                    />
                  </label>
                  {(groups || []).map((g, __index4) => (
                    <React.Fragment key={__index4}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontSize: "13.5px",
                          color: "#6E6E78",
                        }}
                      >
                        {g.label}
                        {"\n          "}
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          {(g.opts || []).map((o, __index7) => (
                            <React.Fragment key={__index7}>
                              <button
                                onClick={o.pick}
                                style={{
                                  cursor: "pointer",
                                  padding: "10px 16px",
                                  fontSize: "15px",
                                  borderRadius: "999px",
                                  border: "1px solid " + o.bd,
                                  background: o.bg,
                                  color: o.fg,
                                }}
                                type="button"
                                aria-pressed={o.selected}
                              >
                                {o.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "13.5px",
                      color: "#6E6E78",
                    }}
                  >
                    {"운영 중인 채널·계정 URL"}
                    <input
                      placeholder="인스타그램, 블로그, 홈페이지 주소 등"
                      style={{
                        border: "none",
                        borderBottom: "1.5px solid #A8A69E",
                        padding: "10px 0",
                        fontSize: "17px",
                        outline: "none",
                        background: "transparent",
                        color: "#0D0D12",
                      }}
                      name="detail3"
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "13.5px",
                      color: "#6E6E78",
                    }}
                  >
                    {"요청 내용"}
                    <textarea
                      placeholder="브랜드 소개와 원하는 방향을 자유롭게 적어주세요"
                      rows={5}
                      style={{
                        border: "1px solid #A8A69E",
                        padding: "16px",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        outline: "none",
                        background: "transparent",
                        color: "#0D0D12",
                        resize: "vertical",
                      }}
                      name="message"
                    ></textarea>
                  </label>
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
                      background: "#6B4DFF",
                      color: "#fff",
                      padding: "20px",
                      fontSize: "16px",
                      fontWeight: "600",
                    }}
                    type="submit"
                  >
                    {"문의 보내기"}
                  </button>
                </InquiryBridge>
              </React.Fragment>
            ) : null}
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
