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

const V = "#6B4DFF",
  VL = "#A99BFF",
  INK = "#0D0D12",
  P = "#F4F3EF",
  L = "#DAD8D1",
  G = "#2A2A32";
const U = (id) => guideAsset(id);
const CASES = marketingExamples;
const DUR = 5000;
const STEPS = [
  {
    title: "상담·분석",
    desc: "사업과 운영 중인 채널을 확인하고 시장, 경쟁사, 운영 방향을 자료로 정리합니다",
    ai: "시장·경쟁사 데이터 수집",
    pro: "업종과 고객층에 맞는 운영 방향 결정",
  },
  {
    title: "계약·구축",
    desc: "계약하신 고객께 사이트 구축 또는 리뉴얼을 제공합니다",
    ai: "현재 사이트 점검과 구조 초안",
    pro: "구축·리뉴얼 범위와 방향 확정",
  },
  {
    title: "제작·게시",
    desc: "채널 형식에 맞춰 콘텐츠를 만들고 게시합니다",
    ai: "원고·이미지·자막 초안 생성",
    pro: "브랜드 톤 검수 후 채널별 게시",
  },
  {
    title: "분석·개선",
    desc: "스토어와 검색·AI 답변을 월 1회 분석하고 개선합니다",
    ai: "노출·리뷰·검색 데이터 정리",
    pro: "유지·수정·시험할 항목 결정",
  },
];
const ease = (t) => 1 - Math.pow(1 - t, 3);
const BANDS = [
  { s: 0.2, a: 62, c: "#6B4DFF", k: 1, t: "+ 콘텐츠 유입" },
  { s: 0.45, a: 72, c: "#8C74FF", k: 2, t: "+ 지도·플레이스 유입" },
  { s: 0.7, a: 80, c: "#A99BFF", k: 3, t: "+ 검색·AI 답변 유입" },
];
const sm = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const bandV = (b, x) =>
  b.a * sm((x - b.s) / 0.2) * (1 + 0.05 * Math.sin(x * 31 + b.k * 2));
const baseV = (x) => 34 + 3 * Math.sin(x * 23);
const cum = (k, x) =>
  baseV(x) + BANDS.slice(0, k).reduce((a, b) => a + bandV(b, x), 0);
const totV = (x) => cum(3, x);
const revV = (x) =>
  22 + 0.82 * (totV(Math.max(0, x - 0.06)) - 34) + 2 * Math.sin(x * 17);
const Y = (v) => 292 - v;
const STAGES = [
  {
    name: "상담·분석 자료",
    sub: "시장·경쟁사·운영 방향 정리",
    tag: "기존 유입 진단",
    sw: "#4A4A56",
  },
  {
    name: "콘텐츠 제작·게시",
    sub: "원본 20개 → 5개 채널 100개 게시",
    tag: "+ 콘텐츠 유입",
    sw: "#6B4DFF",
  },
  {
    name: "구글·네이버 스토어",
    sub: "구글맵·네이버 플레이스 월 1회 개선",
    tag: "+ 지도·플레이스 유입",
    sw: "#8C74FF",
  },
  {
    name: "SEO·AEO·GEO",
    sub: "검색·AI 답변 월 1회 분석·개선",
    tag: "+ 검색·AI 답변 유입",
    sw: "#A99BFF",
  },
];
class HeroChart extends React.Component {
  state = { c: 1, o: 1 };
  componentDidMount() {
    this.props.onStage && this.props.onStage(3);
    this.st = 3;
    if (
      document.hidden ||
      (window.matchMedia &&
        matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      this.onVis = () => {
        if (!document.hidden && !this.raf) {
          document.removeEventListener("visibilitychange", this.onVis);
          this.start();
        }
      };
      document.addEventListener("visibilitychange", this.onVis);
      return;
    }
    this.start();
  }
  start() {
    if (
      window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const G = 10500,
      CY = 13500,
      ENDS = [0.19, 0.44, 0.69, 1];
    let tb = performance.now();
    this.setState({ c: 0, o: 0 });
    const f = (now) => {
      const L = this.props.lock;
      let c, o, st;
      if (L != null) {
        const cur = this.state.c,
          tg = ENDS[L];
        c = Math.abs(tg - cur) < 0.002 ? tg : cur + (tg - cur) * 0.1;
        o = Math.min(1, this.state.o + 0.08);
        st = L;
        tb = null;
      } else {
        if (tb == null) tb = now - this.state.c * G;
        const e = (now - tb) % CY;
        c = Math.min(1, e / G);
        o =
          e > CY - 450
            ? Math.max(0, (CY - e) / 450)
            : Math.min(1, Math.max(this.state.o, e / 300));
        st = c < 0.2 ? 0 : c < 0.45 ? 1 : c < 0.7 ? 2 : 3;
      }
      this.setState({ c, o });
      if (st !== this.st) {
        this.st = st;
        this.props.onStage && this.props.onStage(st);
      }
      this.raf = requestAnimationFrame(f);
    };
    this.raf = requestAnimationFrame(f);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
    this.onVis && document.removeEventListener("visibilitychange", this.onVis);
  }
  render() {
    const h = React.createElement,
      { c, o } = this.state,
      N = 80,
      xs = [];
    for (let i = 0; i <= N; i++) xs.push((i / N) * c);
    const P = (x, v) => (x * 1000).toFixed(1) + " " + Y(v).toFixed(1);
    const area = (lo, hi) => {
      if (c <= 0) return "";
      let d = "";
      xs.forEach((x, i) => {
        d += (i ? "L" : "M") + P(x, hi(x));
      });
      for (let i = xs.length - 1; i >= 0; i--) d += "L" + P(xs[i], lo(xs[i]));
      return d + "Z";
    };
    const line = (fn) =>
      c <= 0 ? "" : xs.map((x, i) => (i ? "L" : "M") + P(x, fn(x))).join("");
    const layers = [
      { lo: () => 0, hi: baseV, c: "#3A3A46" },
      ...BANDS.map((b, k) => ({
        lo: (x) => cum(k, x),
        hi: (x) => cum(k + 1, x),
        c: b.c,
      })),
    ];
    const ns = { vectorEffect: "non-scaling-stroke" };
    const svg = h(
      "svg",
      {
        viewBox: "0 0 1000 300",
        preserveAspectRatio: "none",
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        },
      },
      [60, 120, 180, 240].map((y) =>
        h("line", {
          key: y,
          x1: 0,
          x2: 1000,
          y1: y,
          y2: y,
          stroke: "#22222A",
          strokeWidth: 1,
          ...ns,
        }),
      ),
      layers.map((l, i) =>
        h("path", { key: "a" + i, d: area(l.lo, l.hi), fill: l.c }),
      ),
      h("path", {
        key: "t",
        d: line(totV),
        fill: "none",
        stroke: "#C9BEFF",
        strokeWidth: 2,
        ...ns,
      }),
      h("path", {
        key: "r",
        d: line(revV),
        fill: "none",
        stroke: "#fff",
        strokeWidth: 3,
        strokeLinejoin: "round",
        ...ns,
      }),
      h("line", {
        key: "cur",
        x1: c * 1000,
        x2: c * 1000,
        y1: 0,
        y2: 300,
        stroke: "#fff",
        strokeOpacity: 0.25,
        strokeDasharray: "4 6",
        strokeWidth: 1,
        ...ns,
      }),
    );
    const dot = (k, v, bg, sz) =>
      h("span", {
        key: k,
        style: {
          position: "absolute",
          left: c * 100 + "%",
          top: Y(v) / 3 + "%",
          width: sz,
          height: sz,
          marginLeft: -sz / 2,
          marginTop: -sz / 2,
          borderRadius: "50%",
          background: bg,
          boxShadow: "0 0 0 6px rgba(169,155,255,.2)",
        },
      });
    const tags = BANDS.map((b, k) => {
      const x = b.s + 0.1,
        show = c > b.s + 0.06,
        mid = (cum(k, x) + cum(k + 1, x)) / 2;
      return h(
        "span",
        {
          key: "g" + k,
          style: {
            position: "absolute",
            left: x * 100 + "%",
            top: Y(mid) / 3 + "%",
            transform:
              "translate(-50%,-50%) translateY(" + (show ? 0 : 8) + "px)",
            opacity: show ? 1 : 0,
            transition: "opacity .5s, transform .5s",
            background: "#0D0D12",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "5px 9px",
            whiteSpace: "nowrap",
            border: "1px solid " + b.c,
          },
        },
        b.t,
      );
    });
    return h(
      "div",
      { style: { position: "absolute", inset: 0, opacity: o } },
      svg,
      c > 0 && dot("d1", totV(c), "#C9BEFF", 10),
      c > 0 && dot("d2", revV(c), "#fff", 12),
      tags,
    );
  }
}
class Component extends GuideLogic {
  state = { ch: 0, active: 0 };
  barEls = [];
  hsOuter = React.createRef();
  hsTrack = React.createRef();
  hsBar = React.createRef();
  hsSticky = React.createRef();
  stepEls = [];
  timers = [];
  componentDidMount() {
    this.onScroll = () => this.updateHS();
    this.onResize = () => {
      const n = window.innerWidth < 900;
      if (n !== this.state.narrow || window.innerWidth !== this.state.vw)
        this.setState({ narrow: n, vw: window.innerWidth });
      this.measure();
      this.updateHS();
    };
    window.addEventListener("scroll", this.onScroll, { passive: true });
    window.addEventListener("resize", this.onResize);
    this.timers.push(
      setTimeout(this.onResize, 80),
      setTimeout(this.onResize, 800),
    );
    this.stepIO = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            const i = this.stepEls.indexOf(e.target);
            if (i >= 0 && i !== this.state.active) this.setState({ active: i });
          }
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    this.timers.push(
      setTimeout(() => {
        this.stepEls.forEach((el) => el && this.stepIO.observe(el));
      }, 100),
    );
  }
  componentWillUnmount() {
    this.timers.forEach(clearTimeout);
    cancelAnimationFrame(this.heroRaf);
    window.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("resize", this.onResize);
    this.stepIO && this.stepIO.disconnect();
  }
  measure() {
    const o = this.hsOuter.current,
      t = this.hsTrack.current,
      s = this.hsSticky.current;
    if (!o || !t || !s) return;
    s.style.cssText += ";position:sticky;height:auto;min-height:0";
    t.style.overflowX = "";
    t.style.transform = "";
    const avail = window.innerHeight - 72;
    this.pinned = s.scrollHeight <= avail;
    if (!this.pinned) {
      s.style.position = "static";
      o.style.height = "auto";
      t.style.overflowX = "auto";
      t.style.scrollSnapType = "x mandatory";
      if (this.hsBar.current) this.hsBar.current.style.width = "0";
      return;
    }
    t.style.scrollSnapType = "";
    this.dist = Math.max(0, t.scrollWidth - t.clientWidth);
    this.vh = avail;
    s.style.height = avail + "px";
    o.style.height = avail + this.dist + "px";
  }
  updateHS() {
    const o = this.hsOuter.current,
      t = this.hsTrack.current;
    if (!o || !t || !this.pinned) return;
    const vh = this.vh || Math.max(560, window.innerHeight - 72),
      total = o.offsetHeight - vh;
    const p =
      total > 0
        ? Math.min(1, Math.max(0, (72 - o.getBoundingClientRect().top) / total))
        : 0;
    t.style.transform = `translate3d(${-p * (this.dist || 0)}px,0,0)`;
    if (this.hsBar.current) this.hsBar.current.style.width = p * 100 + "%";
  }
  renderVals() {
    const v = this.baseVals(),
      ch = this.state.ch,
      nw = !!this.state.narrow;
    const w = this.state.vw || 1440,
      cols = w < 560 ? 1 : w < 900 ? 2 : 4;
    v.stCols = cols;
    v.stages = STAGES.map((s, i) => ({
      ...s,
      no: "0" + (i + 1),
      br: (i + 1) % cols === 0 ? "none" : "1px solid #2A2A32",
      bb: i < STAGES.length - cols ? "1px solid #2A2A32" : "none",
      op: i === ch ? 1 : i < ch ? 0.85 : 0.42,
      bar: i === ch ? "#A99BFF" : i < ch ? "#6B4DFF" : "transparent",
      nc: i === ch ? "#A99BFF" : "#9A9AA3",
      go: () => this.setState({ lock: i, ch: i }),
    }));
    [0, 1, 2, 3].forEach((i) => {
      v["d" + i] = ch === i;
    });
    v.locked = this.state.lock != null;
    v.resumeAuto = () => this.setState({ lock: null });
    if (!this.onStage)
      this.onStage = (st) => {
        if (st !== this.state.ch && this.state.lock == null)
          this.setState({ ch: st });
      };
    v.heroChart = React.createElement(HeroChart, {
      lock: this.state.lock ?? null,
      onStage: this.onStage,
    });
    return v;
  }
  baseVals() {
    const ch = this.state.ch,
      a = this.state.active;
    const nw = !!this.state.narrow;
    return {
      hsOuter: this.hsOuter,
      hsTrack: this.hsTrack,
      hsBar: this.hsBar,
      hsSticky: this.hsSticky,
      cases: CASES.map((c) => ({
        ...c,
        isFeed: c.type === "feed",
        isSearch: c.type === "search",
        isAi: c.type === "ai",
        isChart: c.type === "chart",
        isBlog: c.type === "blog",
        isShorts: c.type === "shorts",
        bars: (c.bars || []).map((hh, i, arr) => ({
          h: hh,
          c: i === arr.length - 1 ? V : INK,
        })),
        posts: (c.posts || []).map((t, i) => ({ n: i + 1, t })),
      })),
      services: [
        {
          no: "01",
          en: "INTEGRATED",
          name: "통합 마케팅",
          price: "월 200만 원부터 · VAT 별도",
          desc: "콘텐츠 제작·게시부터 구글·네이버 스토어, 검색·AI 답변 관리까지 한 번에 맡깁니다",
          items: [
            "월 원본 콘텐츠 20개 제작 (영상 위주)",
            "5개 채널 변형·게시, 월 100개: 유튜브 숏츠, 인스타그램, 페이스북, 네이버 클립, 네이버 블로그",
            "구글·네이버 스토어 월 1회 분석·개선",
            "SEO·AEO·GEO 월 1회 분석·개선",
          ],
          note: "스레드 운영은 별도 협의 (추가 금액)",
          bd: INK,
          bg: "#fff",
          bar: V,
          href: "Marketing 서비스 상세.dc.html?s=integrated",
        },
        {
          no: "02",
          en: "SNS",
          name: "SNS 대행 운영",
          price: "월 100만 원 · VAT 별도",
          desc: "이미지와 영상 콘텐츠를 제작하고 원본 소스를 채널마다 바꿔 게시합니다",
          items: [
            "월 12회 이미지 콘텐츠 제작·게시",
            "월 4회 영상 콘텐츠 제작·게시",
            "원본 소스 멀티 유즈",
            "기본 채널: 유튜브 숏츠, 인스타그램, 네이버 블로그",
          ],
          note: "",
          bd: L,
          bg: "#fff",
          bar: L,
          href: "Marketing 서비스 상세.dc.html?s=sns",
        },
        {
          no: "03",
          en: "AI INFLUENCER",
          name: "AI 인플루언서 마케팅",
          price: "월 100만 원 · VAT 별도",
          desc: "브랜드 전용 가상 인물로 콘텐츠를 만들어 게시합니다",
          items: [
            "캐릭터 구축 서비스 제공 (구축비 없음)",
            "월 8회 콘텐츠 제작·게시",
            "콘텐츠 1회 30초 기준",
          ],
          note: "",
          bd: L,
          bg: "#fff",
          bar: L,
          href: "Marketing 서비스 상세.dc.html?s=ai",
        },
        {
          no: "04",
          en: "SEO · AEO · GEO",
          name: "SEO·AEO·GEO",
          price: "별도 견적",
          desc: "기존 사이트를 진단하고 실제 코드·CMS에 적용해 검색과 AI 답변에서 잘 보이게 합니다",
          items: [
            "현재 상태 진단",
            "질문·페이지 설계",
            "메타·sitemap·구조화 데이터",
            "스테이징·운영 검수",
          ],
          note: "사이트와 수정 범위에 따라 견적을 안내합니다",
          bd: L,
          bg: "#fff",
          bar: L,
          href: "Marketing 서비스 상세.dc.html?s=seo",
        },
      ],
      steps: STEPS.map((s, i) => ({
        ...s,
        no: String(i + 1).padStart(2, "0"),
        ref: (el) => {
          this.stepEls[i] = el;
        },
        op: i === a ? 1 : 0.4,
        bd: i === a ? V : L,
        nc: i === a ? V : "#A8A69E",
        dot: i <= a ? V : L,
      })),
      reviews: [],
      posts: [
        {
          cat: "SEO",
          date: "제작 가이드",
          title: "네이버 블로그와 구글 검색, 무엇부터 해야 할까",
          img: U("1432888498266-38ffec3eaf0a", 300),
        },
        {
          cat: "SNS",
          date: "제작 가이드",
          title: "방치된 SNS 계정을 다시 살리는 순서",
          img: U("1611162617213-7d7a39e9b1d7", 300),
        },
        {
          cat: "SNS",
          date: "제작 가이드",
          title: "인스타그램 운영, 한 달에 몇 개를 올려야 할까",
          img: U("1611162616305-c69b3fa7fbe0", 300),
        },
        {
          cat: "SEO",
          date: "제작 가이드",
          title: "병원 마케팅에서 먼저 점검할 검색 설정",
          img: U("1519494026892-80bbd2d6fd0d", 300),
        },
      ],
    };
  }

  render() {
    const values = adaptGuideValues(
      "marketing-home",
      this.renderVals(),
      this.props,
    );
    const {
      cases,
      d0,
      d1,
      d2,
      d3,
      heroChart,
      hsBar,
      hsOuter,
      hsSticky,
      hsTrack,
      locked,
      posts,
      resumeAuto,
      reviews,
      services,
      stCols,
      stages,
      steps,
    } = values;
    return (
      <div className="guide-page guide-marketing-home">
        <GuideEffects />
        <div
          style={{
            background: "#fff",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GuideNav division="marketing" active="home" />
          <section style={{ background: "#fff" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding:
                  "clamp(48px,6vw,88px) clamp(20px,4vw,56px) clamp(56px,6vw,88px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(36px,4.4vw,60px)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,460px),1fr))",
                  gap: "28px clamp(40px,5vw,80px)",
                  alignItems: "end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".18em",
                      color: "#6B4DFF",
                    }}
                  >
                    {"AIO MAKE MARKETING"}
                  </span>
                  <div
                    data-fit="balance"
                    style={{ width: "fit-content", maxWidth: "100%" }}
                  >
                    <h1
                      style={{
                        margin: "0",
                        fontSize: "clamp(40px,5.2vw,80px)",
                        lineHeight: "1.12",
                        letterSpacing: "-.045em",
                        fontWeight: "800",
                      }}
                    >
                      <span data-fit-line="">{"고객이 먼저 찾아오는"}</span>
                      <span data-fit-line="">{"마케팅 구조를 만듭니다"}</span>
                    </h1>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <p
                    style={{
                      margin: "0",
                      fontSize: "clamp(18px,1.6vw,21px)",
                      lineHeight: "1.65",
                      color: "#3A3A42",
                      maxWidth: "34ch",
                    }}
                  >
                    {
                      "검색 결과, AI 답변, SNS 피드. 고객이 브랜드를 처음 만나는 곳을 설계하고 매달 운영합니다"
                    }
                  </p>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <GuideLink
                      href="Marketing 문의.dc.html"
                      style={{
                        background: "#6B4DFF",
                        color: "#fff",
                        padding: "18px 28px",
                        fontWeight: "600",
                      }}
                      context="marketing"
                    >
                      {"운영 문의"}
                    </GuideLink>
                    <GuideLink
                      href="Marketing 운영 사례.dc.html"
                      style={{
                        background: "#fff",
                        border: "1.5px solid #0D0D12",
                        padding: "16.5px 26px",
                        fontWeight: "600",
                      }}
                      context="marketing"
                    >
                      {"운영 사례 보기"}
                    </GuideLink>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#0D0D12",
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                    padding: "clamp(20px,2.4vw,30px) clamp(20px,2.6vw,40px)",
                    borderBottom: "1px solid #2A2A32",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "8px 16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Unbounded,sans-serif",
                        fontSize: "11px",
                        letterSpacing: ".16em",
                        color: "#A99BFF",
                      }}
                    >
                      {"INTEGRATED"}
                    </span>
                    <strong
                      style={{
                        fontSize: "clamp(22px,2vw,28px)",
                        fontWeight: "800",
                        letterSpacing: "-.03em",
                      }}
                    >
                      {"통합 마케팅"}
                    </strong>
                    <span style={{ fontSize: "15px", color: "#C9C9D1" }}>
                      {"월 200만 원부터 · VAT 별도"}
                    </span>
                  </div>
                  <GuideLink
                    href="Marketing 서비스 상세.dc.html?s=integrated"
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      color: "#fff",
                    }}
                    className="gh-857f3b1c"
                    context="marketing"
                  >
                    {"자세히 보기 "}
                    <span style={{ color: "#A99BFF" }}>{"→"}</span>
                  </GuideLink>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(" + stCols + ",minmax(0,1fr))",
                    borderBottom: "1px solid #2A2A32",
                  }}
                  className="guide-stage-grid"
                >
                  {(stages || []).map((s, __index5) => (
                    <React.Fragment key={__index5}>
                      <button
                        onClick={s.go}
                        style={{
                          all: "unset",
                          boxSizing: "border-box",
                          cursor: "pointer",
                          position: "relative",
                          padding:
                            "clamp(18px,2vw,26px) clamp(20px,2.6vw,40px)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          borderRight: s.br,
                          borderBottom: s.bb,
                          opacity: s.op,
                          transition: "opacity .5s,background .3s",
                        }}
                        className="gh-9b87605e"
                        type="button"
                        aria-pressed={this.state.ch === Number(s.no) - 1}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "0",
                            right: "0",
                            top: "-1px",
                            height: "3px",
                            background: s.bar,
                            transition: "background .5s",
                          }}
                        ></span>
                        <span
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "baseline",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "12px",
                              letterSpacing: ".08em",
                              color: s.nc,
                              transition: "color .5s",
                            }}
                          >
                            {s.no}
                          </span>
                          <strong
                            style={{
                              fontSize: "clamp(17px,1.4vw,20px)",
                              fontWeight: "700",
                            }}
                          >
                            {s.name}
                          </strong>
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#C9C9D1",
                            lineHeight: "1.5",
                          }}
                        >
                          {s.sub}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "#fff",
                          }}
                        >
                          <span
                            style={{
                              width: "10px",
                              height: "10px",
                              background: s.sw,
                              display: "block",
                              flex: "none",
                            }}
                          ></span>
                          {s.tag}
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  <div
                    style={{
                      flex: "1 1 340px",
                      minWidth: "0",
                      boxSizing: "border-box",
                      padding: "clamp(22px,2.4vw,32px) clamp(20px,2.6vw,40px)",
                      borderRight: "1px solid #2A2A32",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {d0 ? (
                      <React.Fragment>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          <div
                            style={{
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
                                color: "#A99BFF",
                              }}
                            >
                              {"STEP 01 · 상담·분석 자료"}
                            </span>
                            <strong
                              style={{
                                fontSize: "clamp(20px,1.7vw,24px)",
                                lineHeight: "1.4",
                                letterSpacing: "-.02em",
                                fontWeight: "700",
                              }}
                            >
                              {
                                "시장, 경쟁사, 운영 방향을 자료로 정리해 드립니다"
                              }
                            </strong>
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"시장 분석"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"업종·검색 수요·고객 질문"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#C9C9D1",
                                  background: "#1C1C24",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"시장 분석 자료"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"경쟁사 분석"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"경쟁 브랜드의 채널과 콘텐츠"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#C9C9D1",
                                  background: "#1C1C24",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"경쟁사 분석 자료"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                                borderBottom: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"운영 방향"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"채널 역할과 콘텐츠 방향"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  color: "#C9C9D1",
                                  background: "#1C1C24",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"운영 방향 제안"}
                              </span>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "13.5px",
                              lineHeight: "1.6",
                              color: "#C9C9D1",
                            }}
                          >
                            {"상담을 받으신 고객께 분석 자료를 제공합니다"}
                          </span>
                        </div>
                      </React.Fragment>
                    ) : null}
                    {d1 ? (
                      <React.Fragment>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          <div
                            style={{
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
                                color: "#A99BFF",
                              }}
                            >
                              {"STEP 02 · 콘텐츠 제작·게시"}
                            </span>
                            <strong
                              style={{
                                fontSize: "clamp(20px,1.7vw,24px)",
                                lineHeight: "1.4",
                                letterSpacing: "-.02em",
                                fontWeight: "700",
                              }}
                            >
                              {
                                "영상 위주 원본 20개를 5개 채널 100개 게시물로 만듭니다"
                              }
                            </strong>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "space-between",
                              gap: "12px",
                              padding: "16px 0",
                              borderTop: "1px solid #2A2A32",
                              borderBottom: "1px solid #2A2A32",
                            }}
                          >
                            <span
                              style={{ fontSize: "14px", color: "#C9C9D1" }}
                            >
                              {"원본 콘텐츠 → 채널별 변형·게시"}
                            </span>
                            <span
                              style={{
                                fontFamily: "Unbounded,sans-serif",
                                fontSize: "32px",
                                fontWeight: "600",
                                letterSpacing: "-.03em",
                              }}
                            >
                              {"20"}
                              <span
                                style={{
                                  fontFamily:
                                    "'Pretendard Variable',sans-serif",
                                  fontSize: "16px",
                                  color: "#A99BFF",
                                  margin: "0 10px 0 4px",
                                }}
                              >
                                {"개"}
                              </span>
                              {"→ 100"}
                              <span
                                style={{
                                  fontFamily:
                                    "'Pretendard Variable',sans-serif",
                                  fontSize: "16px",
                                  color: "#A99BFF",
                                  marginLeft: "4px",
                                }}
                              >
                                {"개"}
                              </span>
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "13.5px",
                                padding: "6px 11px",
                                border: "1px solid #3A3A46",
                              }}
                            >
                              {"유튜브 숏츠"}
                            </span>
                            <span
                              style={{
                                fontSize: "13.5px",
                                padding: "6px 11px",
                                border: "1px solid #3A3A46",
                              }}
                            >
                              {"인스타그램"}
                            </span>
                            <span
                              style={{
                                fontSize: "13.5px",
                                padding: "6px 11px",
                                border: "1px solid #3A3A46",
                              }}
                            >
                              {"페이스북"}
                            </span>
                            <span
                              style={{
                                fontSize: "13.5px",
                                padding: "6px 11px",
                                border: "1px solid #3A3A46",
                              }}
                            >
                              {"네이버 클립"}
                            </span>
                            <span
                              style={{
                                fontSize: "13.5px",
                                padding: "6px 11px",
                                border: "1px solid #3A3A46",
                              }}
                            >
                              {"네이버 블로그"}
                            </span>
                          </div>
                          <span
                            style={{
                              fontSize: "13.5px",
                              lineHeight: "1.6",
                              color: "#C9C9D1",
                            }}
                          >
                            {"스레드 운영은 별도 협의이며 추가 금액이 있습니다"}
                          </span>
                        </div>
                      </React.Fragment>
                    ) : null}
                    {d2 ? (
                      <React.Fragment>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          <div
                            style={{
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
                                color: "#A99BFF",
                              }}
                            >
                              {"STEP 03 · 구글·네이버 스토어 관리"}
                            </span>
                            <strong
                              style={{
                                fontSize: "clamp(20px,1.7vw,24px)",
                                lineHeight: "1.4",
                                letterSpacing: "-.02em",
                                fontWeight: "700",
                              }}
                            >
                              {
                                "구글맵과 네이버 플레이스의 정보와 리뷰를 관리합니다"
                              }
                            </strong>
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"구글맵"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"업체 정보·리뷰"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  background: "#6B4DFF",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"월 1회 분석·개선"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                                borderBottom: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"네이버 플레이스"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"업체 정보·리뷰"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  background: "#6B4DFF",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"월 1회 분석·개선"}
                              </span>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "13.5px",
                              lineHeight: "1.6",
                              color: "#C9C9D1",
                            }}
                          >
                            {"매달 상태를 분석하고 고칠 항목을 바로 개선합니다"}
                          </span>
                        </div>
                      </React.Fragment>
                    ) : null}
                    {d3 ? (
                      <React.Fragment>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                          }}
                        >
                          <div
                            style={{
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
                                color: "#A99BFF",
                              }}
                            >
                              {"STEP 04 · SEO·AEO·GEO"}
                            </span>
                            <strong
                              style={{
                                fontSize: "clamp(20px,1.7vw,24px)",
                                lineHeight: "1.4",
                                letterSpacing: "-.02em",
                                fontWeight: "700",
                              }}
                            >
                              {
                                "검색과 AI 답변에서 브랜드가 보이도록 개선합니다"
                              }
                            </strong>
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"검색 결과 (SEO)"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"네이버·구글 검색 노출"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  background: "#6B4DFF",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"월 1회 분석·개선"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"답변 영역 (AEO)"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"검색 결과 상단 답변 노출"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  background: "#6B4DFF",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"월 1회 분석·개선"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                                padding: "12px 0",
                                borderTop: "1px solid #2A2A32",
                                borderBottom: "1px solid #2A2A32",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "2px",
                                }}
                              >
                                <span style={{ fontSize: "15px" }}>
                                  {"생성형 AI 답변 (GEO)"}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12.5px",
                                    color: "#9A9AA3",
                                  }}
                                >
                                  {"AI 답변 속 브랜드 언급"}
                                </span>
                              </span>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "600",
                                  background: "#6B4DFF",
                                  padding: "4px 9px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {"월 1회 분석·개선"}
                              </span>
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "13.5px",
                              lineHeight: "1.6",
                              color: "#C9C9D1",
                            }}
                          >
                            {
                              "분석 결과는 다음 달 콘텐츠와 페이지 개선에 반영합니다"
                            }
                          </span>
                        </div>
                      </React.Fragment>
                    ) : null}
                  </div>
                  <div
                    style={{
                      flex: "1.6 1 440px",
                      minWidth: "0",
                      boxSizing: "border-box",
                      padding:
                        "clamp(22px,2.4vw,32px) clamp(20px,2.6vw,40px) clamp(18px,2vw,26px)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px 16px",
                        flexWrap: "wrap",
                        fontSize: "13px",
                        color: "#C9C9D1",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: "14px",
                              height: "10px",
                              background: "#6B4DFF",
                              display: "block",
                            }}
                          ></span>
                          {"유입"}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: "18px",
                              height: "3px",
                              background: "#fff",
                              display: "block",
                            }}
                          ></span>
                          {"매출"}
                        </span>
                      </div>
                      {locked ? (
                        <React.Fragment>
                          <button
                            onClick={resumeAuto}
                            style={{
                              all: "unset",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#fff",
                              padding: "6px 12px",
                              border: "1px solid #6B4DFF",
                            }}
                            className="gh-5ba441e6"
                            type="button"
                          >
                            {"▶ 자동 재생"}
                          </button>
                        </React.Fragment>
                      ) : null}
                    </div>
                    <div
                      style={{
                        position: "relative",
                        flex: "1",
                        minHeight: "clamp(240px,22vw,340px)",
                      }}
                    >
                      {heroChart}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        flexWrap: "wrap",
                        fontSize: "12.5px",
                        color: "#9A9AA3",
                      }}
                    >
                      <span>{"착수"}</span>
                      <span>
                        {
                          "예시 흐름 · 실제 성과는 업종과 운영 기간에 따라 다릅니다"
                        }
                      </span>
                      <span>{"운영"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            style={{ background: "#fff", borderTop: "1px solid #DAD8D1" }}
          >
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(72px,9vw,120px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "40px",
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
                {"Benefits"}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    background: "#F4F3EF",
                    padding: "clamp(28px,3.4vw,48px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    minHeight: "300px",
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "600" }}>
                    {"상담 고객"}
                  </span>
                  <strong
                    style={{
                      fontSize: "clamp(28px,3vw,42px)",
                      letterSpacing: "-.04em",
                      lineHeight: "1.25",
                    }}
                  >
                    {"분석 자료 제공"}
                  </strong>
                  <span
                    style={{
                      fontSize: "17px",
                      lineHeight: "1.8",
                      color: "#3A3A42",
                      marginTop: "auto",
                    }}
                  >
                    {"시장, 경쟁사, 운영 방향을 자료로 정리해 드립니다"}
                  </span>
                </div>
                <div
                  style={{
                    background: "#0D0D12",
                    color: "#fff",
                    padding: "clamp(28px,3.4vw,48px)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    minHeight: "300px",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#A99BFF",
                    }}
                  >
                    {"계약 고객"}
                  </span>
                  <strong
                    style={{
                      fontSize: "clamp(28px,3vw,42px)",
                      letterSpacing: "-.04em",
                      lineHeight: "1.25",
                    }}
                  >
                    {"사이트 구축 및 리뉴얼 제공"}
                  </strong>
                  <span
                    style={{
                      fontSize: "17px",
                      lineHeight: "1.8",
                      color: "#D6D6DC",
                      marginTop: "auto",
                    }}
                  >
                    {
                      "기본 소개·문의용 사이트의 신규 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다"
                    }
                  </span>
                </div>
              </div>
            </div>
          </section>
          <section
            ref={hsOuter}
            style={{
              position: "relative",
              background: "#0D0D12",
              color: "#fff",
            }}
          >
            <div
              ref={hsSticky}
              style={{
                position: "sticky",
                top: "72px",
                height: "calc(100vh - 72px)",
                minHeight: "560px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "clamp(24px,3.4vw,40px)",
                padding: "32px 0",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  maxWidth: "1440px",
                  width: "100%",
                  boxSizing: "border-box",
                  margin: "0 auto",
                  padding: "0 clamp(20px,4vw,56px)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "20px",
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
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "clamp(36px,5vw,72px)",
                      fontWeight: "800",
                      letterSpacing: "-.04em",
                      lineHeight: "1",
                    }}
                  >
                    {"Results"}
                  </h2>
                  <span style={{ fontSize: "17px", color: "#C9C9D1" }}>
                    {"서비스별 콘텐츠와 검색 접점의 구성 예시"}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <span
                    style={{
                      display: "block",
                      width: "160px",
                      height: "2px",
                      background: "#2A2A32",
                    }}
                  >
                    <span
                      ref={hsBar}
                      style={{
                        display: "block",
                        height: "100%",
                        width: "0",
                        background: "#A99BFF",
                      }}
                    ></span>
                  </span>
                  <GuideLink
                    href="Marketing 운영 사례.dc.html"
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "13px",
                      letterSpacing: ".1em",
                      borderBottom: "1px solid #fff",
                      paddingBottom: "4px",
                    }}
                    context="marketing"
                  >
                    {"ALL CASES →"}
                  </GuideLink>
                </div>
              </div>
              <div
                ref={hsTrack}
                style={{
                  display: "flex",
                  gap: "16px",
                  padding: "0 clamp(20px,4vw,56px)",
                  willChange: "transform",
                }}
              >
                {(cases || []).map((c, __index4) => (
                  <React.Fragment key={__index4}>
                    <GuideLink
                      href={`/marketing/work/example-${c.type === "feed" ? "sns" : c.type === "search" ? "seo" : "ai-influencer"}`}
                      style={{
                        flex: "none",
                        width: "min(80vw,440px)",
                        background: "#16161C",
                        display: "flex",
                        flexDirection: "column",
                      }}
                      className="gh-50caf04d"
                      context="marketing"
                    >
                      <div
                        style={{
                          height: "clamp(260px,32vh,300px)",
                          position: "relative",
                          overflow: "hidden",
                          background: "#1C1C22",
                        }}
                      >
                        <img
                          alt={c.client}
                          loading="lazy"
                          src={guideAsset(c.img)}
                          style={{
                            position: "absolute",
                            inset: "0",
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            inset: "0",
                            background:
                              "linear-gradient(180deg,rgba(13,13,18,0) 30%,rgba(13,13,18,.62) 100%)",
                          }}
                        ></div>
                        <div
                          style={{
                            position: "absolute",
                            left: "16px",
                            right: "16px",
                            bottom: "16px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            color: "#0D0D12",
                          }}
                        >
                          {c.isFeed ? (
                            <React.Fragment>
                              <div
                                style={{
                                  background: "#fff",
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "min(100%,236px)",
                                  boxShadow: "0 10px 28px rgba(0,0,0,.28)",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "7px 9px",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      borderRadius: "50%",
                                      background: "#6B4DFF",
                                      display: "block",
                                    }}
                                  ></span>
                                  <strong style={{ fontSize: "10.5px" }}>
                                    {c.handle}
                                  </strong>
                                  <span
                                    style={{
                                      marginLeft: "auto",
                                      fontSize: "10px",
                                      color: "#6E6E78",
                                    }}
                                  >
                                    {"▶ "}
                                    {c.reel}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3,1fr)",
                                    gap: "2px",
                                  }}
                                >
                                  {(c.tiles || []).map((t, __index11) => (
                                    <React.Fragment key={__index11}>
                                      <img
                                        alt=""
                                        loading="lazy"
                                        src={guideAsset(t)}
                                        style={{
                                          width: "100%",
                                          aspectRatio: "1",
                                          objectFit: "cover",
                                          display: "block",
                                        }}
                                      />
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          {c.isSearch ? (
                            <React.Fragment>
                              <div
                                style={{
                                  background: "#fff",
                                  boxShadow: "0 10px 28px rgba(0,0,0,.28)",
                                  padding: "12px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                  width: "min(100%,310px)",
                                  boxSizing: "border-box",
                                }}
                              >
                                <div
                                  style={{
                                    border: "1.5px solid #0D0D12",
                                    padding: "6px 10px",
                                    fontSize: "12px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>{c.query}</span>
                                  <span style={{ color: "#6B4DFF" }}>
                                    {"⌕"}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    background: "#F4F3EF",
                                    borderLeft: "3px solid #6B4DFF",
                                    padding: "8px 10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "2px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      color: "#6B4DFF",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {"예시"}
                                  </span>
                                  <strong style={{ fontSize: "12.5px" }}>
                                    {c.resultTitle}
                                  </strong>
                                  <span
                                    style={{
                                      fontSize: "10.5px",
                                      color: "#6E6E78",
                                    }}
                                  >
                                    {c.url}
                                  </span>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          {c.isAi ? (
                            <React.Fragment>
                              <div
                                style={{
                                  background: "#0D0D12",
                                  color: "#fff",
                                  boxShadow: "0 10px 28px rgba(0,0,0,.3)",
                                  padding: "12px 14px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                  width: "min(100%,330px)",
                                  boxSizing: "border-box",
                                  fontSize: "12.5px",
                                  lineHeight: "1.55",
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: "Unbounded,sans-serif",
                                    fontSize: "9.5px",
                                    letterSpacing: ".14em",
                                    color: "#A99BFF",
                                  }}
                                >
                                  {"AI ANSWER"}
                                </span>
                                <span
                                  style={{
                                    alignSelf: "flex-end",
                                    background: "#2A2A32",
                                    padding: "6px 10px",
                                  }}
                                >
                                  {c.q}
                                </span>
                                <span style={{ color: "#D6D6DC" }}>
                                  {c.a1}
                                  <strong
                                    style={{
                                      color: "#fff",
                                      borderBottom: "2px solid #6B4DFF",
                                    }}
                                  >
                                    {c.client}
                                  </strong>
                                  {c.a2}
                                </span>
                              </div>
                            </React.Fragment>
                          ) : null}
                          {c.isChart ? (
                            <React.Fragment>
                              <div
                                style={{
                                  background: "#fff",
                                  boxShadow: "0 10px 28px rgba(0,0,0,.28)",
                                  padding: "12px",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                  width: "min(100%,250px)",
                                  boxSizing: "border-box",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "11px",
                                  }}
                                >
                                  <strong>{c.chartTitle}</strong>
                                  <span style={{ color: "#6E6E78" }}>
                                    {"8개월"}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    height: "64px",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "4px",
                                    borderBottom: "1px solid #DAD8D1",
                                  }}
                                >
                                  {(c.bars || []).map((b, __index11) => (
                                    <React.Fragment key={__index11}>
                                      <span
                                        style={{
                                          flex: "1",
                                          height: b.h,
                                          background: b.c,
                                          display: "block",
                                        }}
                                      ></span>
                                    </React.Fragment>
                                  ))}
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          {c.isBlog ? (
                            <React.Fragment>
                              <div
                                style={{
                                  background: "#fff",
                                  boxShadow: "0 10px 28px rgba(0,0,0,.28)",
                                  display: "flex",
                                  flexDirection: "column",
                                  width: "min(100%,310px)",
                                }}
                              >
                                <div
                                  style={{
                                    padding: "8px 12px",
                                    borderBottom: "1px solid #DAD8D1",
                                    fontSize: "11px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <strong>
                                    {c.client}
                                    {" 블로그"}
                                  </strong>
                                  <span style={{ color: "#6E6E78" }}>
                                    {"인기 글"}
                                  </span>
                                </div>
                                {(c.posts || []).map((p, __index10) => (
                                  <React.Fragment key={__index10}>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        alignItems: "center",
                                        padding: "7px 12px",
                                        borderBottom: "1px solid #EEECE6",
                                        fontSize: "11.5px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          width: "16px",
                                          height: "16px",
                                          background: "#6B4DFF",
                                          color: "#fff",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "9.5px",
                                          fontWeight: "700",
                                          flex: "none",
                                        }}
                                      >
                                        {p.n}
                                      </span>
                                      <span
                                        style={{
                                          flex: "1",
                                          minWidth: "0",
                                          whiteSpace: "nowrap",
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                        }}
                                      >
                                        {p.t}
                                      </span>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            </React.Fragment>
                          ) : null}
                          {c.isShorts ? (
                            <React.Fragment>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  alignItems: "flex-end",
                                }}
                              >
                                {(c.shorts || []).map((s, __index10) => (
                                  <React.Fragment key={__index10}>
                                    <div
                                      style={{
                                        width: "66px",
                                        aspectRatio: "9/16",
                                        position: "relative",
                                        overflow: "hidden",
                                        border: "2px solid #fff",
                                        boxShadow: "0 10px 28px rgba(0,0,0,.3)",
                                      }}
                                    >
                                      <img
                                        alt=""
                                        loading="lazy"
                                        src={guideAsset(s.img)}
                                        style={{
                                          position: "absolute",
                                          inset: "0",
                                          width: "100%",
                                          height: "100%",
                                          objectFit: "cover",
                                        }}
                                      />
                                      <span
                                        style={{
                                          position: "absolute",
                                          left: "5px",
                                          bottom: "5px",
                                          fontSize: "9.5px",
                                          color: "#fff",
                                          fontWeight: "700",
                                          textShadow:
                                            "0 1px 4px rgba(0,0,0,.6)",
                                        }}
                                      >
                                        {"▶ "}
                                        {s.v}
                                      </span>
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          flex: "1",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "4px 9px",
                              border: "1px solid #3A3A42",
                              color: "#C9C9D1",
                            }}
                          >
                            {c.ind}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "4px 9px",
                              border: "1px solid #3A3A42",
                              color: "#C9C9D1",
                            }}
                          >
                            {c.svc}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <span
                            style={{ fontSize: "13.5px", color: "#9A9AA3" }}
                          >
                            {c.client}
                          </span>
                          <strong
                            style={{
                              fontSize: "19px",
                              letterSpacing: "-.02em",
                              lineHeight: "1.45",
                            }}
                          >
                            {c.title}
                          </strong>
                        </div>
                        <div
                          style={{
                            marginTop: "auto",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "12px",
                            borderTop: "1px solid #2A2A32",
                            paddingTop: "16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "Unbounded,sans-serif",
                                fontSize: "clamp(24px,2.4vw,32px)",
                                fontWeight: "600",
                                color: "#A99BFF",
                                letterSpacing: "-.03em",
                              }}
                            >
                              {c.m1v}
                            </span>
                            <span
                              style={{ fontSize: "13px", color: "#9A9AA3" }}
                            >
                              {c.m1l}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "Unbounded,sans-serif",
                                fontSize: "clamp(24px,2.4vw,32px)",
                                fontWeight: "600",
                                color: "#A99BFF",
                                letterSpacing: "-.03em",
                              }}
                            >
                              {c.m2v}
                            </span>
                            <span
                              style={{ fontSize: "13px", color: "#9A9AA3" }}
                            >
                              {c.m2l}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GuideLink>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section>
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
                  {"Services"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.7",
                    color: "#3A3A42",
                  }}
                >
                  {
                    "필요한 범위에 맞춰 하나로 시작합니다. 모든 서비스는 월 단위로 운영하고 금액은 부가세 별도입니다"
                  }
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,300px),1fr))",
                  gap: "16px",
                  alignItems: "stretch",
                }}
              >
                {(services || []).map((s, __index4) => (
                  <React.Fragment key={__index4}>
                    <GuideLink
                      href={s.href}
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        padding: "clamp(24px,2.4vw,32px)",
                        border: "1.5px solid " + s.bd,
                        background: s.bg,
                        boxSizing: "border-box",
                      }}
                      className="gh-840862dd"
                      context="marketing"
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "-1.5px",
                          right: "-1.5px",
                          top: "-1.5px",
                          height: "4px",
                          background: s.bar,
                        }}
                      ></span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontSize: "12px",
                            letterSpacing: ".1em",
                            color: "#6B4DFF",
                          }}
                        >
                          {s.no}
                          {" · "}
                          {s.en}
                        </span>
                        <strong
                          style={{
                            fontSize: "clamp(24px,2vw,30px)",
                            letterSpacing: "-.035em",
                            lineHeight: "1.25",
                          }}
                        >
                          {s.name}
                        </strong>
                        <span
                          style={{
                            fontSize: "15.5px",
                            lineHeight: "1.65",
                            color: "#3A3A42",
                          }}
                        >
                          {s.desc}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          borderTop: "1px solid #DAD8D1",
                          paddingTop: "20px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize: "clamp(26px,2.4vw,34px)",
                            letterSpacing: "-.04em",
                            fontWeight: "800",
                          }}
                        >
                          {s.price}
                        </strong>
                        <span style={{ fontSize: "13px", color: "#6E6E78" }}>
                          {"부가세 별도"}
                        </span>
                      </div>
                      <ul
                        style={{
                          margin: "0",
                          padding: "0",
                          listStyle: "none",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {(s.items || []).map((it, __index7) => (
                          <React.Fragment key={__index7}>
                            <li
                              style={{
                                display: "flex",
                                gap: "10px",
                                padding: "11px 0",
                                borderTop: "1px solid #EEECE6",
                                fontSize: "15px",
                                lineHeight: "1.5",
                              }}
                            >
                              <span style={{ color: "#6B4DFF" }}>{"✓"}</span>
                              {it}
                            </li>
                          </React.Fragment>
                        ))}
                      </ul>
                      <span
                        style={{
                          fontSize: "13.5px",
                          lineHeight: "1.6",
                          color: "#6E6E78",
                        }}
                      >
                        {s.note}
                      </span>
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "12px",
                          letterSpacing: ".1em",
                          marginTop: "auto",
                        }}
                      >
                        {"VIEW SERVICE →"}
                      </span>
                    </GuideLink>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ background: "#F4F3EF" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,140px) clamp(20px,4vw,56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "48px clamp(40px,6vw,96px)",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flex: "1 1 360px",
                  position: "sticky",
                  top: "160px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
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
                    fontSize: "clamp(18px,1.6vw,21px)",
                    lineHeight: "1.65",
                    color: "#3A3A42",
                    maxWidth: "30ch",
                  }}
                >
                  {"데이터 수집과 초안은 "}
                  <strong style={{ color: "#6B4DFF" }}>{"AI"}</strong>
                  {"가 빠르게 만들고, 방향과 발행 판단은 마케터가 직접 합니다"}
                </p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(steps || []).map((p, __index5) => (
                    <React.Fragment key={__index5}>
                      <span
                        style={{
                          display: "block",
                          width: "40px",
                          height: "3px",
                          background: p.dot,
                          transition: "background .4s",
                        }}
                      ></span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <ol
                style={{
                  flex: "1.4 1 480px",
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {(steps || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <li
                      ref={p.ref}
                      style={{
                        background: "#fff",
                        border: "1.5px solid " + p.bd,
                        opacity: p.op,
                        transition: "opacity .45s ease,border-color .45s ease",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          padding: "clamp(24px,3vw,36px)",
                          display: "flex",
                          gap: "24px",
                          alignItems: "baseline",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontSize: "clamp(36px,4vw,56px)",
                            fontWeight: "300",
                            color: p.nc,
                            lineHeight: "1",
                            transition: "color .45s",
                          }}
                        >
                          {p.no}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "clamp(22px,2.2vw,28px)",
                              letterSpacing: "-.02em",
                            }}
                          >
                            {p.title}
                          </strong>
                          <span
                            style={{
                              fontSize: "16px",
                              lineHeight: "1.7",
                              color: "#3A3A42",
                            }}
                          >
                            {p.desc}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit,minmax(min(100%,220px),1fr))",
                        }}
                      >
                        <div
                          style={{
                            borderTop: "1px solid #DAD8D1",
                            padding: "16px clamp(24px,3vw,36px)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "11px",
                              letterSpacing: ".14em",
                              color: "#6B4DFF",
                            }}
                          >
                            {"AI"}
                          </span>
                          <span style={{ fontSize: "15px", color: "#3A3A42" }}>
                            {p.ai}
                          </span>
                        </div>
                        <div
                          style={{
                            background: "#6B4DFF",
                            color: "#fff",
                            padding: "16px clamp(24px,3vw,36px)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Unbounded,sans-serif",
                              fontSize: "11px",
                              letterSpacing: ".14em",
                            }}
                          >
                            {"MARKETER"}
                          </span>
                          <span style={{ fontSize: "15px" }}>{p.pro}</span>
                        </div>
                      </div>
                    </li>
                  </React.Fragment>
                ))}
              </ol>
            </div>
          </section>
          <section>
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
                {"Our standards"}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,320px),1fr))",
                  gap: "16px",
                }}
              >
                {(reviews || []).map((r, __index4) => (
                  <React.Fragment key={__index4}>
                    <figure
                      style={{
                        margin: "0",
                        background: "#F4F3EF",
                        padding: "32px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "44px",
                          lineHeight: ".6",
                          color: "#6B4DFF",
                        }}
                      >
                        {"“"}
                      </span>
                      <blockquote
                        style={{
                          margin: "0",
                          fontSize: "17.5px",
                          lineHeight: "1.75",
                          color: "#0D0D12",
                        }}
                      >
                        {r.text}
                      </blockquote>
                      <figcaption
                        style={{
                          marginTop: "auto",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          fontSize: "14px",
                          borderTop: "1px solid #DAD8D1",
                          paddingTop: "18px",
                        }}
                      >
                        <span>
                          <strong>{r.author}</strong>
                          <span style={{ color: "#6E6E78" }}>
                            {" · "}
                            {r.service}
                          </span>
                        </span>
                        <span
                          style={{
                            color: "#6E6E78",
                            fontFamily: "Unbounded,sans-serif",
                            fontSize: "12px",
                          }}
                        >
                          {r.date}
                        </span>
                      </figcaption>
                    </figure>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section style={{ borderTop: "1px solid #DAD8D1" }}>
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
                  borderBottom: "1px solid #DAD8D1",
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
                  href="Marketing 인사이트.dc.html"
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "13px",
                    letterSpacing: ".1em",
                    borderBottom: "1px solid #0D0D12",
                    paddingBottom: "4px",
                  }}
                  context="marketing"
                >
                  {"ALL INSIGHTS →"}
                </GuideLink>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,440px),1fr))",
                  gap: "40px 48px",
                }}
              >
                <GuideLink
                  href={posts?.[0]?.href || "/marketing/insights"}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                  context="marketing"
                >
                  <div
                    style={{
                      aspectRatio: "16/10",
                      overflow: "hidden",
                      background: "#e9e7e1",
                    }}
                  >
                    <GuideImage
                      id={posts?.[0]?.img}
                      placeholder={posts?.[0]?.title || "마케팅 안내"}
                    />
                  </div>
                  <span style={{ fontSize: "13px", color: "#6B4DFF" }}>
                    {posts?.[0]?.date}
                  </span>
                  <strong
                    style={{
                      fontSize: "clamp(24px,2.4vw,32px)",
                      lineHeight: "1.35",
                      letterSpacing: "-.03em",
                    }}
                  >
                    {posts?.[0]?.title}
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      lineHeight: "1.7",
                      color: "#5f5f68",
                    }}
                  >
                    {posts?.[0]?.summary}
                  </p>
                </GuideLink>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1.5px solid #0D0D12",
                  }}
                >
                  {(posts || []).slice(1).map((p, __index5) => (
                    <React.Fragment key={__index5}>
                      <GuideLink
                        href={p.href}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0,1fr) 112px",
                          gap: "20px",
                          alignItems: "center",
                          padding: "20px 0",
                          borderBottom: "1px solid #DAD8D1",
                        }}
                        context="marketing"
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            minWidth: "0",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12.5px",
                              color: "#6E6E78",
                              fontFamily: "Unbounded,sans-serif",
                              letterSpacing: ".06em",
                            }}
                          >
                            {p.cat}
                            {" · "}
                            {p.date === "制作" ? "제작 가이드" : p.date}
                          </span>
                          <strong
                            style={{
                              fontSize: "18px",
                              lineHeight: "1.45",
                              letterSpacing: "-.02em",
                            }}
                          >
                            {p.title}
                          </strong>
                        </div>
                        <div
                          style={{
                            aspectRatio: "4/3",
                            position: "relative",
                            overflow: "hidden",
                            background: "#F4F3EF",
                          }}
                        >
                          <img
                            alt=""
                            loading="lazy"
                            src={guideAsset(p.img)}
                            style={{
                              position: "absolute",
                              inset: "0",
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </GuideLink>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section style={{ background: "#6B4DFF", color: "#fff" }}>
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
                <div
                  data-fit="balance"
                  style={{ width: "fit-content", maxWidth: "100%" }}
                >
                  <h2
                    style={{
                      margin: "0",
                      fontSize: "clamp(30px,4.2vw,60px)",
                      letterSpacing: "-.04em",
                      fontWeight: "800",
                      lineHeight: "1.14",
                    }}
                  >
                    <span data-fit-line="">{"상담만 받아도 분석 자료를"}</span>
                    <span data-fit-line="">{"먼저 받아보실 수 있습니다"}</span>
                  </h2>
                </div>
                <span style={{ fontSize: "17px" }}>
                  {
                    "업종과 운영 중인 채널을 알려주시면 시장, 경쟁사, 운영 방향을 정리해 드립니다"
                  }
                </span>
              </div>
              <GuideLink
                href="Marketing 문의.dc.html"
                style={{
                  background: "#fff",
                  color: "#0D0D12",
                  padding: "18px 28px",
                  fontWeight: "600",
                }}
                context="marketing"
              >
                {"상담 신청 →"}
              </GuideLink>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Component;
