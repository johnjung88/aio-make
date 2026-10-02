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
  webtoon: "웹툰",
  animation: "애니메이션",
  "ai-influencer": "AI 인플루언서 컨텐츠",
  promo: "브랜드 홍보 컨텐츠",
  ad: "SNS 광고 컨텐츠",
  edit: "편집·클리퍼",
};
const G = [
  ["service", "요청 서비스 *", [...Object.values(MAP), "아직 모르겠어요"]],
  [
    "purpose",
    "사용 목적",
    ["상세페이지", "광고 소재", "브랜드 소개", "SNS 계정 운영", "기타"],
  ],
  [
    "assets",
    "보유 자료 (여러 개 선택 가능)",
    ["로고", "제품 사진·컨텐츠", "캐릭터", "시나리오·웹툰", "없음"],
  ],
  [
    "channel",
    "사용 채널 (여러 개 선택 가능)",
    ["유튜브", "인스타그램", "틱톡", "광고", "웹사이트", "행사·오프라인"],
  ],
  ["when", "희망 공개일", ["2주 이내", "1개월 이내", "2개월 이내", "협의"]],
];
const MULTI = ["channel", "assets"];
class Component extends GuideLogic {
  state = {
    service:
      MAP[guideContactKey(this.props.service, "video")] ||
      (typeof location !== "undefined" &&
        MAP[new URLSearchParams(location.search).get("s")]) ||
      "",
    purpose: "",
    assets: [],
    channel: [],
    when: "",
    sent: false,
  };
  renderVals() {
    return {
      groups: G.map(([key, label, opts]) => ({
        label,
        opts: opts.map((o) => {
          const multi = MULTI.includes(key);
          const on = multi
            ? this.state[key].includes(o)
            : this.state[key] === o;
          return {
            selected: on,
            label: o,
            bg: on ? "#6B4DFF" : "transparent",
            bd: on ? "#6B4DFF" : "#55555E",
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
      "studio-contact",
      this.renderVals(),
      this.props,
    );
    const { groups, notSent, sent, submit } = values;
    return (
      <div className="guide-page guide-studio-contact">
        <GuideEffects />
        <div
          style={{
            background: "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GuideNav division="video" active="contact" />
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
                  color: "#A99BFF",
                }}
              >
                {"START A PROJECT"}
              </span>
              <h1
                style={{
                  margin: "0",
                  fontSize: "clamp(36px,5vw,68px)",
                  letterSpacing: "-.04em",
                  fontWeight: "800",
                  lineHeight: "1.08",
                }}
              >
                {"어떤 컨텐츠가"}
                <br />
                {"필요 하신가요?"}
              </h1>
              <p
                style={{
                  margin: "0",
                  fontSize: "17px",
                  lineHeight: "1.75",
                  color: "#C9C9D1",
                }}
              >
                {"자세히 적어주실수록 "}
                <strong style={{ color: "#A99BFF" }}>
                  {"견적이 정확해집니다"}
                </strong>
                <br />
                {"컨텐츠 담당자가 확인 후 연락드립니다"}
              </p>
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
                  <span style={{ color: "#C9C9D1" }}>
                    {"컨텐츠 담당자가 확인 후 연락드리겠습니다"}
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
                  division="video"
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
                        color: "#9A9AA3",
                      }}
                    >
                      {"고객명 *"}
                      <input
                        placeholder="홍길동"
                        required={true}
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #55555E",
                          padding: "10px 0",
                          fontSize: "17px",
                          outline: "none",
                          background: "transparent",
                          color: "#fff",
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
                        color: "#9A9AA3",
                      }}
                    >
                      {"연락처 "}
                      <input
                        placeholder="010-0000-0000"
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #55555E",
                          padding: "10px 0",
                          fontSize: "17px",
                          outline: "none",
                          background: "transparent",
                          color: "#fff",
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
                      color: "#9A9AA3",
                    }}
                  >
                    {"이메일 "}
                    <input
                      placeholder="name@company.com"
                      style={{
                        border: "none",
                        borderBottom: "1.5px solid #55555E",
                        padding: "10px 0",
                        fontSize: "17px",
                        outline: "none",
                        background: "transparent",
                        color: "#fff",
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
                          color: "#9A9AA3",
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
                                  color: "#fff",
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
                      color: "#9A9AA3",
                    }}
                  >
                    {"참고 컨텐츠 링크"}
                    <input
                      placeholder="https://"
                      style={{
                        border: "none",
                        borderBottom: "1.5px solid #55555E",
                        padding: "10px 0",
                        fontSize: "17px",
                        outline: "none",
                        background: "transparent",
                        color: "#fff",
                      }}
                      name="reference"
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "13.5px",
                      color: "#9A9AA3",
                    }}
                  >
                    {"요청 내용 *"}
                    <textarea
                      placeholder="회사·브랜드 소개와 컨텐츠의 목적을 자유롭게 적어주세요"
                      required={true}
                      rows={6}
                      style={{
                        border: "1px solid #55555E",
                        padding: "16px",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        outline: "none",
                        background: "transparent",
                        color: "#fff",
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
                      color: "#C9C9D1",
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
