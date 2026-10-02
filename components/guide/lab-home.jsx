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

const ITEMS = [
  "상담과 범위 확인",
  "작업 전 공유 · 범위와 일정",
  "제작",
  "작업 후 공유 · 결과 확인",
  "납품 후 지원",
];
const STEPS = [
  ["상담", "요청 내용과 범위를 확인합니다"],
  ["작업 전 공유", "범위와 일정을 먼저 알려드립니다"],
  ["제작", "AI로 초안을 만들고 개발자가 완성합니다"],
  ["작업 후 공유", "결과를 보여드린 뒤 검수합니다"],
  ["납품·A/S", "인수인계 후 합의한 범위 안에서 지원합니다"],
];
class Component extends GuideLogic {
  state = {
    ready: !!LAB_DATA,
    done: [true, true, false, false, false],
    tab: 0,
    step: 0,
    sel: 0,
    pos: "0%",
  };
  componentDidMount() {
    if (!this.state.ready)
      this.iv = setInterval(() => {
        if (LAB_DATA) {
          clearInterval(this.iv);
          this.setState({ ready: true });
        }
      }, 50);
    this.t0 = setTimeout(() => this.setState({ pos: "100%" }), 400);
    this.pl = setInterval(
      () => this.setState((s) => ({ pos: s.pos === "0%" ? "100%" : "0%" })),
      8500,
    );
    this.tick = setInterval(
      () => this.setState((s) => ({ step: (s.step + 1) % 7 })),
      1500,
    );
    this.w = { mx: 0, e: 0, on: false };
    const h = () => document.getElementById("lab-wave");
    this.mv = (e) => {
      this.w.mx = e.clientX;
    };
    this.enter = () => {
      this.w.on = true;
    };
    this.leave = () => {
      this.w.on = false;
    };
    this.bind = setInterval(() => {
      const el = h();
      if (el && !el.__w) {
        el.__w = 1;
        el.addEventListener("pointermove", this.mv);
        el.addEventListener("pointerenter", this.enter);
        el.addEventListener("pointerleave", this.leave);
      }
    }, 200);
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const loop = (t) => {
      this.raf = requestAnimationFrame(loop);
      const el = h();
      if (!el || reduce) {
        cancelAnimationFrame(this.raf);
        return;
      }
      const w = this.w;
      w.e += ((w.on ? 1 : 0) - w.e) * 0.05;
      const amp = 6 + 5 * w.e;
      let n = 0;
      el.querySelectorAll("[data-ch]").forEach((s) => {
        const y = Math.sin(t * 0.0021 - n++ * 0.42) * amp;
        s.style.transform = "translateY(" + y.toFixed(2) + "px)";
      });
    };
    this.raf = requestAnimationFrame(loop);
  }
  componentWillUnmount() {
    const el = document.getElementById("lab-wave");
    if (el) {
      el.removeEventListener("pointermove", this.mv);
      el.removeEventListener("pointerenter", this.enter);
      el.removeEventListener("pointerleave", this.leave);
      delete el.__w;
    }
    clearInterval(this.iv);
    clearInterval(this.bind);
    clearInterval(this.tick);
    clearInterval(this.pl);
    clearTimeout(this.t0);
    cancelAnimationFrame(this.raf);
  }
  renderVals() {
    const D = LAB_DATA || { services: [], cases: [] },
      { done, tab } = this.state;
    const all = ITEMS.map((t, i) => ({ t, i, d: done[i] }));
    const shown = all.filter((x) => tab === 0 || (tab === 1 ? !x.d : x.d));
    const n = done.filter(Boolean).length;
    const slugs = ["ondam", "chefmeal", "autopilot", "v-aio-admin"];
    const rl = slugs
      .map((sl) => D.cases.find((c) => c.slug === sl))
      .filter(Boolean);
    const cur0 = rl[this.state.sel] || rl[0] || { stack: [] };
    const st = this.state.step,
      TL = [
        ["상담과 범위 확인", "", ""],
        ["작업 전 공유", "BEFORE", "범위와 일정을 먼저 전달했습니다"],
        ["제작", "", ""],
        ["작업 후 공유", "AFTER", "완성된 결과를 보여드리고 검수합니다"],
        ["납품 후 지원", "", ""],
      ];
    return {
      refs: rl.map((c, i) => ({
        svc: c.svcName,
        title: c.title,
        client: c.client,
        ind: c.ind,
        bd: i === this.state.sel ? "#A99BFF" : "transparent",
        bg: i === this.state.sel ? "#16161C" : "transparent",
        fg: i === this.state.sel ? "#F4F3EF" : "#B5B5BD",
        pick: () => this.setState({ sel: i, pos: "0%" }),
      })),
      cur: {
        url: cur0.url,
        desk: cur0.desk,
        stackStr: cur0.stack.join(" · "),
        href: "Lab 사례 상세.dc.html?c=" + cur0.slug,
      },
      pos: this.state.pos,
      lineH: (Math.min(st, 4) / 4) * 100 + "%",
      tl: TL.map(([t, tag, note], i) => {
        const on = i <= st,
          cur = i === st;
        return {
          pick: () => {
            clearInterval(this.tick);
            this.setState({ step: i });
          },
          no: "0" + (i + 1),
          t,
          tag,
          note,
          bg: on ? "#6B4DFF" : "#0D0D12",
          fg: on ? "#fff" : "#8A8A94",
          bd: on ? "#A99BFF" : "#2E2E38",
          tc: on ? "#F4F3EF" : "#8A8A94",
          glow: cur ? "0 0 0 6px rgba(169,155,255,.18)" : "none",
          mh: tag && on ? "90px" : "0px",
          op: tag && on ? 1 : 0,
        };
      }),
      heroLines: ["필요한 것을 만들고,", "소스까지 넘겨드립니다"].map((l) => ({
        chars: [...l].map((c) => ({ c: c === " " ? "\u00a0" : c })),
      })),
      services: D.services.map((x, i) => ({
        ...x,
        href: "Lab 서비스 상세 v3.dc.html?s=" + x.key,
        stackStr: x.stack.join(" · "),
      })),
      tabs: [
        ["전체", 5],
        ["진행 중", 5 - n],
        ["완료", n],
      ].map(([label, c], i) => ({
        label,
        n: c,
        fg: tab === i ? "#fff" : "#B5B5BD",
        bd: tab === i ? "#A99BFF" : "transparent",
        pick: () => this.setState({ tab: i }),
      })),
      items: shown.map((x) => ({
        t: x.t,
        box: x.d ? "#6B4DFF" : "transparent",
        mark: x.d ? "✓" : "",
        fg: x.d ? "#8A8A94" : "#F4F3EF",
        deco: x.d ? "line-through" : "none",
        toggle: () =>
          this.setState((s) => {
            const d = s.done.slice();
            d[x.i] = !d[x.i];
            return { done: d };
          }),
      })),
      doneN: "0" + n,
      pct: (n / 5) * 100 + "%",
      steps: STEPS.map(([t, d], i) => ({ no: "0" + (i + 1), t, d })),
      cases: slugs
        .map((sl) => D.cases.find((c) => c.slug === sl))
        .filter(Boolean)
        .map((c) => ({ ...c, href: "Lab 사례 상세.dc.html?c=" + c.slug })),
    };
  }

  render() {
    const values = adaptGuideValues("lab-home", this.renderVals(), this.props);
    const { heroLines, lineH, services, steps, tl } = values;
    return (
      <div className="guide-page guide-lab-home">
        <GuideEffects />
        <div
          style={{
            background: "#0D0D12",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: "0",
          }}
        >
          <GuideCloud />
          <GuideNav division="lab" active="home" />
          <section style={{ borderBottom: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(72px,10vw,150px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "clamp(40px,5vw,72px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "24px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#A99BFF",
                  }}
                >
                  {"AIO MAKE LAB · 개발"}
                </span>
                <h1
                  id="lab-wave"
                  style={{
                    margin: "0",
                    fontSize: "clamp(40px,6.4vw,104px)",
                    lineHeight: "1.32",
                    letterSpacing: "-.055em",
                    fontWeight: "800",
                    cursor: "default",
                  }}
                  aria-label="필요한 것을 만들고, 소스까지 넘겨드립니다"
                >
                  {(heroLines || []).map((ln, __index5) => (
                    <React.Fragment key={__index5}>
                      <span style={{ display: "block", whiteSpace: "nowrap" }}>
                        {(ln.chars || []).map((ch, __index7) => (
                          <React.Fragment key={__index7}>
                            <span
                              data-ch=""
                              style={{
                                display: "inline-block",
                                willChange: "transform",
                              }}
                              aria-hidden="true"
                            >
                              {ch.c}
                            </span>
                          </React.Fragment>
                        ))}
                      </span>
                    </React.Fragment>
                  ))}
                </h1>
                <p
                  style={{
                    margin: "0",
                    fontSize: "clamp(17px,1.5vw,20px)",
                    lineHeight: "1.8",
                    color: "#B5B5BD",
                    maxWidth: "38ch",
                  }}
                >
                  {
                    "웹사이트, 쇼핑몰, 업무 자동화, 프로그램을 제작합니다 작업 전과 작업이 끝난 후에 진행 상황을 공유하고, 납품 후 지원 범위는 견적 단계에서 정합니다"
                  }
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <GuideLink
                  href="Lab 문의 v3.dc.html"
                  style={{
                    background: "#6B4DFF",
                    color: "#fff",
                    padding: "18px 30px",
                    fontWeight: "600",
                  }}
                  className="gh-59b0af27"
                  context="lab"
                >
                  {"제작 문의"}
                </GuideLink>
                <GuideLink
                  href="#services"
                  style={{
                    border: "1.5px solid #F4F3EF",
                    color: "#F4F3EF",
                    padding: "16.5px 28px",
                    fontWeight: "600",
                  }}
                  className="gh-21e28941"
                  context="lab"
                >
                  {"서비스 보기"}
                </GuideLink>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  rowGap: "16px",
                  fontFamily: "'JetBrains Mono',monospace",
                  borderTop: "1px solid #2E2E38",
                  paddingTop: "24px",
                  width: "100%",
                  maxWidth: "820px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "0 24px",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#B5B5BD" }}>
                    {"웹사이트 · 쇼핑몰"}
                  </span>
                  <strong style={{ fontSize: "18px" }}>{"범위별 협의"}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "0 24px",
                    borderLeft: "1px solid #2E2E38",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#B5B5BD" }}>
                    {"자동화 · 프로그램"}
                  </span>
                  <strong style={{ fontSize: "18px" }}>{"범위별 협의"}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "0 24px",
                    borderLeft: "1px solid #2E2E38",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#B5B5BD" }}>
                    {"진행 공유"}
                  </span>
                  <strong style={{ fontSize: "18px" }}>{"작업 전 · 후"}</strong>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "0 24px",
                    borderLeft: "1px solid #2E2E38",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "12px", color: "#B5B5BD" }}>
                    {"납품 후 지원"}
                  </span>
                  <strong style={{ fontSize: "18px" }}>{"견적 시 협의"}</strong>
                </div>
              </div>
            </div>
          </section>
          <section id="services" style={{ borderBottom: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(32px,4vw,56px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    letterSpacing: ".14em",
                    color: "#A99BFF",
                  }}
                >
                  {"SERVICES"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"제작 분야"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #F4F3EF",
                }}
              >
                {(services || []).map((x, __index4) => (
                  <React.Fragment key={__index4}>
                    <GuideLink
                      href={x.href}
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "clamp(48px,6vw,88px) minmax(0,1.2fr) minmax(0,1.4fr) auto",
                        gap: "12px clamp(16px,3vw,48px)",
                        alignItems: "center",
                        padding: "clamp(24px,3vw,36px) 0",
                        borderBottom: "1px solid #2E2E38",
                        color: "#F4F3EF",
                        transition: "background .2s,padding .2s",
                      }}
                      className="gh-bccdd24d"
                      context="lab"
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono',monospace",
                          fontSize: "13px",
                          color: "#A99BFF",
                        }}
                      >
                        {x.no}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "clamp(24px,2.6vw,38px)",
                            letterSpacing: "-.04em",
                            fontWeight: "800",
                          }}
                        >
                          {x.name}
                        </strong>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "12px",
                            letterSpacing: ".1em",
                            color: "#B5B5BD",
                          }}
                        >
                          {x.en}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            lineHeight: "1.65",
                            color: "#B5B5BD",
                          }}
                        >
                          {x.short}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "14px",
                          }}
                        >
                          {x.days}
                        </span>
                        <span
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            border: "1.5px solid #A99BFF",
                            color: "#A99BFF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
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
          <section style={{ borderBottom: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "56px clamp(48px,7vw,120px)",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: "1 1 320px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    letterSpacing: ".14em",
                    color: "#A99BFF",
                  }}
                >
                  {"SHARING"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"진행 상황은 이렇게 공유합니다"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#B5B5BD",
                    maxWidth: "36ch",
                  }}
                >
                  {
                    "작업 전에는 범위와 일정을, 작업이 끝나면 결과를 공유합니다 오른쪽 항목을 눌러 진행 방식을 확인해 보세요"
                  }
                </p>
              </div>
              <div
                style={{
                  flex: "1 1 420px",
                  minWidth: "0",
                  display: "flex",
                  justifyContent: "center",
                  padding: "36px 0",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "480px",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "21px",
                      top: "22px",
                      bottom: "22px",
                      width: "2px",
                      background: "#2E2E38",
                      display: "block",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "21px",
                      top: "22px",
                      width: "2px",
                      background: "#A99BFF",
                      display: "block",
                      height: lineH,
                      transition: "height .9s ease",
                    }}
                  ></span>
                  {(tl || []).map((n, __index5) => (
                    <React.Fragment key={__index5}>
                      <button
                        style={{
                          position: "relative",
                          display: "flex",
                          gap: "20px",
                          alignItems: "flex-start",
                          padding: "0 0 30px",
                          textAlign: "left",
                          cursor: "pointer",
                          background: "none",
                          border: "0",
                          padding: "0",
                          width: "100%",
                          color: "inherit",
                        }}
                        onClick={n.pick}
                        type="button"
                      >
                        <span
                          style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "50%",
                            boxSizing: "border-box",
                            flex: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "'JetBrains Mono',monospace",
                            fontSize: "13px",
                            background: n.bg,
                            color: n.fg,
                            border: "1.5px solid " + n.bd,
                            transition: "all .5s",
                            boxShadow: n.glow,
                          }}
                        >
                          {n.no}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            paddingTop: "9px",
                            minWidth: "0",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "18px",
                              letterSpacing: "-.02em",
                              color: n.tc,
                              transition: "color .5s",
                            }}
                          >
                            {n.t}
                          </strong>
                          <div
                            style={{
                              maxHeight: n.mh,
                              opacity: n.op,
                              overflow: "hidden",
                              transition: "all .6s ease",
                            }}
                          >
                            <div
                              style={{
                                background: "#16161C",
                                border: "1px solid #2E2E38",
                                borderLeft: "3px solid #A99BFF",
                                padding: "12px 14px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: "'JetBrains Mono',monospace",
                                  fontSize: "11px",
                                  letterSpacing: ".1em",
                                  color: "#A99BFF",
                                }}
                              >
                                {n.tag}
                              </span>
                              <span
                                style={{
                                  fontSize: "14.5px",
                                  lineHeight: "1.6",
                                  color: "#F4F3EF",
                                }}
                              >
                                {n.note}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section style={{ borderBottom: "1px solid #2E2E38" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(48px,6vw,88px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "12px",
                    letterSpacing: ".14em",
                    color: "#A99BFF",
                  }}
                >
                  {"PROCESS"}
                </span>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4vw,56px)",
                    letterSpacing: "-.045em",
                    fontWeight: "800",
                    lineHeight: "1.15",
                  }}
                >
                  {"진행 순서"}
                </h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,128px),1fr))",
                  gap: "56px 12px",
                }}
              >
                {(steps || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: "22px",
                      }}
                    >
                      <div
                        style={{
                          width: "clamp(88px,8vw,104px)",
                          height: "clamp(88px,8vw,104px)",
                          borderRadius: "50%",
                          boxSizing: "border-box",
                          border: "1.5px solid #A99BFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "clamp(28px,2.6vw,34px)",
                          fontWeight: "600",
                          letterSpacing: "-.02em",
                          color: "#F4F3EF",
                        }}
                      >
                        {p.no}
                      </div>
                      <strong
                        style={{ fontSize: "20px", letterSpacing: "-.02em" }}
                      >
                        {p.t}
                      </strong>
                      <span
                        style={{
                          fontSize: "15px",
                          lineHeight: "1.7",
                          color: "#B5B5BD",
                          maxWidth: "20ch",
                        }}
                      >
                        {p.d}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section>
            <div
              style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "clamp(28px,4vw,48px)",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px",
                  letterSpacing: ".14em",
                  color: "#A99BFF",
                }}
              >
                {"CONTACT"}
              </span>
              <h2
                style={{
                  margin: "0",
                  fontSize: "clamp(36px,5.6vw,84px)",
                  letterSpacing: "-.05em",
                  fontWeight: "800",
                  lineHeight: "1.14",
                }}
              >
                {"만들고 싶은 것을"}
                <br />
                {"알려주세요"}
              </h2>
              <GuideLink
                data-cloud="outline"
                href="Lab 문의 v3.dc.html"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#16161C",
                  color: "#F4F3EF",
                  padding: "clamp(18px,2vw,26px) clamp(20px,2.4vw,32px)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  textAlign: "left",
                  fontSize: "clamp(16px,1.5vw,20px)",
                }}
                className="gh-bbc019b2"
                context="lab"
              >
                <span style={{ color: "#B5B5BD" }}>
                  {"어떤 작업이 필요하신가요?"}
                </span>
                <span
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "#6B4DFF",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: "none",
                    fontSize: "22px",
                  }}
                >
                  {"→"}
                </span>
              </GuideLink>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "12px",
                  color: "#B5B5BD",
                }}
              >
                {"범위 확인 후 견적 · 납기·지원 범위는 견적 시 합의"}
              </span>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
