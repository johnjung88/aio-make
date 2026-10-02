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
  website: "웹사이트 제작",
  shop: "카페24 쇼핑몰",
  automation: "업무 자동화",
  program: "프로그램 개발",
};
const FEAT = {
  web: [
    "문의 폼",
    "예약",
    "결제",
    "회원가입·로그인",
    "게시판·공지",
    "관리자 페이지",
    "아직 모르겠어요",
  ],
  shop: ["단순 복사 (150,000원)", "풀 세팅 (300,000원)", "아직 모르겠어요"],
  auto: [
    "데이터 수집",
    "엑셀·시트 정리",
    "알림 발송",
    "외부 API 연동",
    "관리자 화면",
    "외부 서비스 연동",
    "아직 모르겠어요",
  ],
};
const HAVE = [
  "로고",
  "원고·소개 자료",
  "사진",
  "도메인",
  "참고 사이트",
  "샘플 파일",
];
class Component extends GuideLogic {
  state = {
    service:
      MAP[guideContactKey(this.props.service, "lab")] ||
      (() => {
        try {
          return MAP[new URLSearchParams(location.search).get("s")] || "";
        } catch (e) {
          return "";
        }
      })(),
    feat: [],
    have: [],
    sent: false,
  };
  renderVals() {
    const sv = this.state.service,
      isAuto = sv === "업무 자동화" || sv === "프로그램 개발",
      isShop = sv === "카페24 쇼핑몰";
    const G = [
      [
        "service",
        "만들고 싶은 것 *",
        [...Object.values(MAP), "아직 모르겠어요"],
        false,
      ],
      [
        "feat",
        "필요한 기능 (여러 개 선택 가능)",
        isAuto ? FEAT.auto : isShop ? FEAT.shop : FEAT.web,
        true,
      ],
      ["have", "준비된 자료 (여러 개 선택 가능)", HAVE, true],
    ];
    return {
      terms: [
        ["견적 안내", "범위 확인 후"],
        ["진행 공유", "작업 전 · 작업 끝난 후"],
        ["결제", "견적서에서 협의"],
        ["착수", "일정 합의 후"],
        ["납품 후 지원", "견적 시 협의"],
      ].map(([k, v]) => ({ k, v })),
      estimate:
        !sv || sv === "아직 모르겠어요"
          ? "범위별 협의"
          : isAuto
            ? "범위별 협의"
            : "범위별 협의",
      estimateNote:
        !sv || sv === "아직 모르겠어요"
          ? "프로젝트마다 다르며, 작업 전 공유 때 확정합니다"
          : sv === "웹사이트 제작"
            ? developmentOffer("website").summary
            : isShop
              ? developmentOffer("shop").summary
              : "요청별 개별 견적 · 기능 범위에 따라 달라집니다",
      groups: G.map(([key, label, opts, multi]) => ({
        label,
        opts: opts.map((o) => {
          const on = multi
            ? this.state[key].includes(o)
            : this.state[key] === o;
          return {
            selected: on,
            label: o,
            bg: on ? "#A99BFF" : "transparent",
            fg: on ? "#0D0D12" : "#E4E4EA",
            bd: on ? "#A99BFF" : "#3A3A46",
            pick: () =>
              this.setState((s) =>
                multi
                  ? {
                      [key]: on
                        ? s[key].filter((x) => x !== o)
                        : [...s[key], o],
                    }
                  : { service: o, feat: [] },
              ),
          };
        }),
      })),
      refLabel: isAuto ? "지금 쓰는 도구·파일" : "참고 사이트 URL",
      refPh: isAuto
        ? "엑셀, 구글 시트, 사용 중인 솔루션 이름 등"
        : isShop
          ? "참고하는 쇼핑몰 주소"
          : "비슷하게 만들고 싶은 사이트 주소",
      msgPh: isAuto
        ? "반복하는 작업 순서를 적어주세요 예: 매일 아침 5개 마켓 가격을 복사해 엑셀에 정리합니다"
        : isShop
          ? "상품 수, 옵션 구성, 원하는 분위기를 적어주세요"
          : "업종, 필요한 페이지, 원하는 분위기를 자유롭게 적어주세요",
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
      "lab-contact",
      this.renderVals(),
      this.props,
    );
    const {
      estimate,
      estimateNote,
      groups,
      msgPh,
      notSent,
      refLabel,
      refPh,
      sent,
      submit,
      terms,
    } = values;
    return (
      <div className="guide-page guide-lab-contact">
        <GuideEffects />
        <div
          style={{
            background: "#0D0D12",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GuideNav division="lab" active="contact" />
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
              gap: "56px clamp(40px,6vw,96px)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "22px",
                alignSelf: "start",
              }}
            >
              <span
                style={{
                  fontFamily:
                    "'JetBrains Mono','Pretendard Variable',Pretendard,monospace",
                  fontSize: "13px",
                  letterSpacing: ".14em",
                  color: "#A99BFF",
                }}
              >
                {"START A PROJECT"}
              </span>
              <div
                data-fit="balance"
                style={{ width: "fit-content", maxWidth: "100%" }}
              >
                <h1
                  style={{
                    margin: "0",
                    fontSize: "clamp(34px,4.4vw,60px)",
                    letterSpacing: "-.04em",
                    fontWeight: "800",
                    lineHeight: "1.16",
                  }}
                >
                  <span data-fit-line="">{"만들고 싶은 것을 알려주시면"}</span>
                  <span data-fit-line="">
                    <span style={{ color: "#A99BFF" }}>{"범위와 일정"}</span>
                    {"을 먼저 공유드립니다"}
                  </span>
                </h1>
              </div>
              <p
                style={{
                  textAlign: "justify",
                  margin: "0",
                  fontSize: "17px",
                  lineHeight: "1.75",
                  color: "#B5B5BD",
                }}
              >
                {
                  "참고 사이트나 지금 쓰는 엑셀 파일이 있으면 함께 알려주세요 개발자가 요청 내용을 확인한 뒤 연락드립니다"
                }
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1px solid #3A3A46",
                  marginTop: "8px",
                }}
              >
                {(terms || []).map((t, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                        padding: "14px 0",
                        borderBottom: "1px solid #2E2E38",
                        fontSize: "15px",
                      }}
                    >
                      <span style={{ color: "#B5B5BD" }}>{t.k}</span>
                      <strong style={{ fontWeight: "600", textAlign: "right" }}>
                        {t.v}
                      </strong>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div
                style={{
                  background: "#16161C",
                  border: "1px solid #2E2E38",
                  padding: "20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "'JetBrains Mono','Pretendard Variable',Pretendard,monospace",
                    fontSize: "11px",
                    letterSpacing: ".1em",
                    color: "#A99BFF",
                  }}
                >
                  {"예상 납기"}
                </span>
                <strong style={{ fontSize: "22px", letterSpacing: "-.02em" }}>
                  {estimate}
                </strong>
                <span style={{ fontSize: "13.5px", color: "#B5B5BD" }}>
                  {estimateNote}
                </span>
              </div>
            </div>
            {sent ? (
              <React.Fragment>
                <div
                  style={{
                    border: "1px solid #A99BFF",
                    background: "#1C1C22",
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    justifyContent: "center",
                    alignSelf: "start",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        "'JetBrains Mono','Pretendard Variable',Pretendard,monospace",
                      fontSize: "12px",
                      color: "#A99BFF",
                    }}
                  >
                    {"RECEIVED"}
                  </span>
                  <strong style={{ fontSize: "26px" }}>
                    {"문의가 접수되었습니다"}
                  </strong>
                  <span
                    style={{
                      textAlign: "justify",
                      color: "#B5B5BD",
                      lineHeight: "1.7",
                    }}
                  >
                    {
                      "개발자가 요청 내용을 확인한 뒤 연락드립니다 견적이 확정되면 작업 전에 범위와 일정을 먼저 공유드립니다"
                    }
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
                    gap: "26px",
                  }}
                  division="development"
                  selection={this.state}
                  initialService={this.props.service}
                  quick={false}
                >
                  {(groups || []).map((g, __index4) => (
                    <React.Fragment key={__index4}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          fontSize: "13.5px",
                          color: "#B5B5BD",
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
                      color: "#B5B5BD",
                    }}
                  >
                    {refLabel}
                    <input
                      placeholder={refPh}
                      style={{
                        border: "none",
                        borderBottom: "1.5px solid #3A3A46",
                        padding: "10px 0",
                        fontSize: "17px",
                        outline: "none",
                        background: "transparent",
                        color: "#fff",
                      }}
                      name="detail0"
                    />
                  </label>
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      fontSize: "13.5px",
                      color: "#B5B5BD",
                    }}
                  >
                    {"요청 내용"}
                    <textarea
                      placeholder={msgPh}
                      rows={5}
                      style={{
                        border: "1px solid #3A3A46",
                        padding: "16px",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        outline: "none",
                        background: "#16161C",
                        color: "#fff",
                        resize: "vertical",
                      }}
                      name="message"
                    ></textarea>
                  </label>
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
                        color: "#B5B5BD",
                      }}
                    >
                      {"고객명 *"}
                      <input
                        placeholder="홍길동"
                        required={true}
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #3A3A46",
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
                        color: "#B5B5BD",
                      }}
                    >
                      {"연락처 "}
                      <input
                        placeholder="010-0000-0000"
                        style={{
                          border: "none",
                          borderBottom: "1.5px solid #3A3A46",
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
                      color: "#B5B5BD",
                    }}
                  >
                    {"이메일 "}
                    <input
                      placeholder="name@company.com"
                      style={{
                        border: "none",
                        borderBottom: "1.5px solid #3A3A46",
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
                  <label
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#B5B5BD",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      required={true}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#A99BFF",
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
                      fontWeight: "700",
                    }}
                    type="submit"
                  >
                    {"견적 요청 보내기"}
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
