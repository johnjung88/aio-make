"use client";
/* Generated from the preserved design by scripts/restore-guide.py.
 * Layout and copy changes belong in the compiler adaptation or shared primitives.
 * No DC interpreter, eval, HTML injection, editor runtime or stock video ships. */
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import React from "react";
import { WebtoonScope } from "./webtoon-scope";
import { WebtoonDevices } from "./webtoon-devices";
import { creativeAsset } from "@/lib/creative-assets";
import {
  GuideLogic,
  GuideImage,
  GuideMedia,
  GuideLink,
  GuideNav,
  ServiceTabs,
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

const rc = React.createElement,
  VV = "#6B4DFF",
  VL = "#A99BFF",
  FF = "'Pretendard Variable',Pretendard,sans-serif",
  UN = "Unbounded,sans-serif";
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)),
  pr = (t, a, b) => cl((t - a) / (b - a)),
  ez = (x) => 1 - Math.pow(1 - x, 3);
const R = (k, x, y, w, h, o = {}) =>
  rc("rect", {
    key: k,
    x,
    y,
    width: Math.max(0, w),
    height: Math.max(0, h),
    fill: "none",
    ...o,
  });
const T = (k, x, y, s, o = {}) =>
  rc(
    "text",
    {
      key: k,
      x,
      y,
      fill: "#fff",
      fontSize: 16,
      fontFamily: FF,
      fontWeight: 600,
      ...o,
    },
    s,
  );
const PA = (k, d, o = {}) => rc("path", { key: k, d, fill: "none", ...o });
const CI = (k, cx, cy, r, o = {}) => rc("circle", { key: k, cx, cy, r, ...o });
const GL = { filter: "url(#gl)" };
const U = (id) => guideAsset(id);
const PH = {
  animation: ["1574717024653-61fd2cf4d44d", "1536440136628-849c177e76a1"],
  ai: [
    "1494790108377-be9c29b29330",
    "1531746020798-e6953c6e8e04",
    "1438761681033-6461ffad8d80",
  ],
  promo: [
    "1542744173-8e7e53415bb0",
    "1497366216548-37526070297c",
    "1536440136628-849c177e76a1",
  ],
  ad: [
    "1523275335684-37898b6baf30",
    "1542291026-7eec264c27ff",
    "1526170375885-4d8ecf77b99f",
  ],
  edit: ["1574717024653-61fd2cf4d44d", "1536440136628-849c177e76a1"],
};
const box = (k, st, ...ch) =>
  rc(
    "div",
    { key: k, style: { position: "absolute", boxSizing: "border-box", ...st } },
    ...ch,
  );
const txt = (k, st, s) =>
  rc(
    "span",
    {
      key: k,
      style: {
        position: "absolute",
        fontFamily: FF,
        color: "#fff",
        fontWeight: 600,
        whiteSpace: "nowrap",
        ...st,
      },
    },
    s,
  );
const chip = (k, st, s, bg) =>
  box(
    k,
    {
      background: bg || "rgba(13,13,18,.72)",
      border: "1px solid rgba(255,255,255,.18)",
      padding: "6px 12px",
      fontSize: 13,
      fontFamily: FF,
      fontWeight: 600,
      color: "#fff",
      whiteSpace: "nowrap",
      ...st,
    },
    s,
  );
const xf = (t, n, per = 3.4) => {
  const i = Math.floor(t / per) % n,
    f = (t % per) / per,
    fd = Math.min(1, (f * per) / 0.9);
  return Array.from({ length: n }, (_, k) =>
    k === i
      ? [fd, 1.03 + 0.07 * f]
      : k === (i - 1 + n) % n
        ? [1 - fd, 1.1]
        : [0, 1.03],
  );
};
const photos = (kind, t, per) => {
  const ids = PH[kind],
    s = xf(t, ids.length, per);
  return ids.map((id, i) =>
    rc("img", {
      key: "im" + i,
      src: U(id, 1000),
      alt: "",
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: s[i][0],
        transform: "scale(" + s[i][1] + ")",
      },
    }),
  );
};
const shade = (k) =>
  box(k, {
    inset: 0,
    background:
      "linear-gradient(180deg,rgba(13,13,18,.35) 0%,rgba(13,13,18,0) 30%,rgba(13,13,18,.8) 100%)",
  });
const bar = (k, st, p, col) =>
  box(
    k,
    { height: 4, background: "rgba(255,255,255,.25)", ...st },
    box(k + "f", {
      left: 0,
      top: 0,
      bottom: 0,
      width: p * 100 + "%",
      background: col || "#fff",
    }),
  );
const SC = {
  animation: (t) => {
    const sh = Math.floor(t / 1.9) % 6,
      p = (t % 11.4) / 11.4;
    return [
      ...photos("animation", t, 3.8),
      shade("sh"),
      chip(
        "c1",
        { left: 16, top: 16 },
        "SHOT " + String(sh + 1).padStart(2, "0") + " / 06",
      ),
      chip(
        "c2",
        { right: 16, top: 16, background: "#6B4DFF", border: "none" },
        "BLENDER PREVIEW",
      ),
      box(
        "sb",
        { left: 16, right: 16, bottom: 44, display: "flex", gap: 8 },
        ...[0, 1, 2, 3, 4, 5].map((i) =>
          box(
            "th" + i,
            {
              position: "relative",
              flex: 1,
              aspectRatio: "16/10",
              border:
                i === sh
                  ? "2px solid #A99BFF"
                  : "1px solid rgba(255,255,255,.25)",
              opacity: i === sh ? 1 : 0.55,
              overflow: "hidden",
            },
            rc("img", {
              key: "ti",
              src: U(PH.animation[i % 2], 240),
              alt: "",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              },
            }),
          ),
        ),
      ),
      bar("tb", { left: 16, right: 16, bottom: 22 }, p, "#A99BFF"),
      txt("t0", { left: 16, bottom: 4, fontSize: 11, fontFamily: UN }, "0:00"),
      txt("t1", { right: 16, bottom: 4, fontSize: 11, fontFamily: UN }, "0:30"),
    ];
  },
  ai: (t) => {
    const c = (t % 10) / 10,
      sec = Math.floor(c * 30),
      line = "브랜드 전용 가상 인물이 직접 소개합니다",
      n = Math.min(line.length, Math.floor((t % 10) * 3.4));
    return [
      ...photos("ai", t, 3.6),
      shade("sh"),
      chip("c0", { left: 16, top: 16 }, "AI INFLUENCER"),
      bar("pb", { left: 16, right: 16, top: 56 }, c, "#A99BFF"),
      txt(
        "sc",
        { right: 16, top: 66, fontSize: 12, fontFamily: UN },
        sec + " / 30초",
      ),
      ...["외형", "말투", "세계관"].map((s, i) =>
        chip(
          "k" + i,
          {
            right: 16,
            top: 100 + i * 44,
            opacity: Math.min(1, Math.max(0, ((t % 10) - 1 - i * 0.8) * 2)),
          },
          s,
        ),
      ),
      box(
        "sub",
        {
          left: "12%",
          right: "12%",
          bottom: 26,
          background: "rgba(13,13,18,.78)",
          padding: "10px 16px",
          textAlign: "center",
          fontFamily: FF,
          fontWeight: 600,
          fontSize: 16,
          color: "#fff",
        },
        line.slice(0, n) || " ",
      ),
    ];
  },
  promo: (t) => {
    const c = (t % 15) / 15,
      ch = ["오프닝", "브랜드", "서비스", "신뢰", "마무리"];
    return [
      ...photos("promo", t, 4),
      box("lt", {
        left: 0,
        right: 0,
        top: 0,
        height: "11%",
        background: "#000",
      }),
      box("lb", {
        left: 0,
        right: 0,
        bottom: 0,
        height: "11%",
        background: "#000",
      }),
      shade("sh"),
      txt(
        "e",
        {
          left: 28,
          bottom: "30%",
          fontSize: 12,
          fontFamily: UN,
          color: "#A99BFF",
          letterSpacing: ".16em",
        },
        "BRAND FILM",
      ),
      txt(
        "h",
        {
          left: 28,
          bottom: "21%",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: "-.03em",
          opacity: Math.min(1, (t % 4) * 2),
        },
        "우리 브랜드의 이야기",
      ),
      box(
        "ch",
        { left: 28, right: 28, bottom: "3%", display: "flex", gap: 6 },
        ...ch.map((n, i) =>
          box(
            "c" + i,
            { position: "relative", flex: 1, height: 22 },
            box("cb" + i, {
              left: 0,
              right: 0,
              top: 0,
              height: 3,
              background: "rgba(255,255,255,.25)",
            }),
            box("cf" + i, {
              left: 0,
              top: 0,
              height: 3,
              width: Math.min(1, Math.max(0, c * 5 - i)) * 100 + "%",
              background: "#fff",
            }),
            txt(
              "cl" + i,
              {
                left: 0,
                top: 8,
                fontSize: 10.5,
                color: c * 5 > i ? "#fff" : "#6E6E78",
              },
              n,
            ),
          ),
        ),
      ),
    ];
  },
  ad: (t) => {
    const p = (t % 9) / 9,
      pz = Math.min(1, Math.max(0, (p * 9 - 2) * 1.5)),
      ct = Math.min(1, Math.max(0, (p * 9 - 5) * 2));
    return [
      ...photos("ad", t, 3),
      shade("sh"),
      bar("pb", { left: 18, right: 18, top: 18 }, p),
      box(
        "hk",
        {
          left: 18,
          top: 36,
          background: "#6B4DFF",
          padding: "8px 14px",
          fontFamily: FF,
          fontWeight: 700,
          fontSize: 15,
          color: "#fff",
          transform:
            "translateX(" + -120 * (1 - Math.min(1, p * 9 * 1.5)) + "%)",
        },
        "첫 3초 훅",
      ),
      box(
        "pr",
        {
          right: 18,
          top: "40%",
          background: "#fff",
          color: "#0D0D12",
          padding: "8px 14px",
          fontFamily: FF,
          fontWeight: 800,
          fontSize: 16,
          transform: "scale(" + pz + ")",
          transformOrigin: "right center",
        },
        "오늘만 특가",
      ),
      box(
        "cta",
        {
          left: 18,
          right: 18,
          bottom: 26,
          background: "#6B4DFF",
          textAlign: "center",
          padding: "15px 0",
          fontFamily: FF,
          fontWeight: 700,
          fontSize: 16,
          color: "#fff",
          borderRadius: 999,
          opacity: ct,
          transform: "scale(" + (1 + 0.03 * Math.sin(t * 6) * ct) + ")",
        },
        "지금 확인하기",
      ),
    ];
  },
  edit: (t) => {
    const p = (t % 12) / 12,
      cl = Math.floor(p * 3) + 1;
    return [
      ...photos("edit", t, 2.6),
      shade("sh"),
      chip("c0", { left: 16, top: 16 }, "LONG → CLIP"),
      chip(
        "c1",
        { right: 16, top: 16, background: "#6B4DFF", border: "none" },
        "CLIP " + String(cl).padStart(2, "0") + " / 03",
      ),
      box(
        "fs",
        {
          left: 14,
          right: 14,
          bottom: 30,
          display: "flex",
          gap: 3,
          height: 50,
        },
        ...Array.from({ length: 8 }, (_, i) =>
          box(
            "f" + i,
            {
              position: "relative",
              flex: 1,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.2)",
            },
            rc("img", {
              key: "fi",
              src: U(PH.edit[i % 2], 160),
              alt: "",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              },
            }),
          ),
        ),
      ),
      box("m1", {
        left: "33.3%",
        bottom: 24,
        width: 2,
        height: 62,
        background: "#A99BFF",
      }),
      box("m2", {
        left: "66.6%",
        bottom: 24,
        width: 2,
        height: 62,
        background: "#A99BFF",
      }),
      box("ph", {
        left: p * 100 + "%",
        bottom: 20,
        width: 3,
        height: 70,
        background: "#fff",
      }),
    ];
  },
};
class Stage extends React.Component {
  state = { t: 0.5 };
  componentDidMount() {
    if (
      window.matchMedia &&
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const t0 = performance.now(),
      f = (n) => {
        this.setState({ t: (n - t0) / 1000 + 0.5 });
        this.raf = requestAnimationFrame(f);
      };
    this.raf = requestAnimationFrame(f);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }
  render() {
    return rc(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          background: "#101016",
        },
      },
      SC[this.props.kind](this.state.t),
    );
  }
}
const N = (n) => String(n).padStart(2, "0");
const TIP = (l, p, n, was, pct, hl) => ({
  l,
  p,
  n,
  was,
  pct,
  wd: was ? "flex" : "none",
  bd: hl ? VV : "#2A2A32",
  bg: hl ? "#14102B" : "#0D0D12",
});
const SHOTSTEPS = (extra) => [
  ["상담", "사용 목적과 보유 자료를 확인하고 상담 자료로 정리합니다", ""],
  [
    "시나리오",
    "상담 자료로 조사하고 시나리오를 기획해 전달합니다 합의한 수정 범위 안에서 보완한 뒤 확정합니다",
    "수정 범위 합의",
  ],
  ["샷 기획·확정", "장면별 샷을 설계하고 고객 피드백으로 확정합니다", ""],
  ["Blender 시뮬레이션", "확정한 샷을 3D로 미리 움직여 구조를 검증합니다", ""],
  [
    "제작·수정",
    "영상을 제작하고 결과물을 확인합니다 합의한 범위 안에서 보완합니다",
    "수정 범위 합의",
  ],
  ["납품", extra, ""],
];
const SVC = {
  webtoon: {
    name: "웹툰",
    en: "WEBTOON",
    line: "상담 자료로 시나리오를 기획하고, 캐릭터 설정부터 연출, 최종 이미지까지 한 회차씩 완성합니다",
    hero: "split",
    proc: "row",
    tiers: [
      TIP(
        "단일 작업",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        1,
      ),
      TIP(
        "연속 제작",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        0,
      ),
    ],
    priceNote:
      "사용 목적, 분량과 수정 범위를 확인한 뒤 견적과 일정을 안내합니다",
    research: [
      [
        "캐릭터·세계관 설정",
        "상담에서 받은 브랜드와 인물 자료로 외형, 성격, 말투, 세계관 규칙을 정리합니다",
      ],
      [
        "시나리오 자료조사",
        "주제와 독자에 맞는 사실, 용어, 비슷한 사례를 조사해 시나리오에 반영합니다",
      ],
      [
        "연출 레퍼런스",
        "컷 흐름, 말풍선 배치, 색 톤 레퍼런스를 골라 제작 기준으로 삼습니다",
      ],
    ],
    scope: [
      "상담 자료 기반 자료조사",
      "캐릭터·세계관 설정",
      "시나리오 기획·전달 (수정 범위 합의 후 확정)",
      "컷 연출·웹툰 제작",
      "결과물 확인 (수정 범위 합의 후 확정)",
      "최종 이미지 납품",
    ],
    procNote:
      "시나리오와 결과물을 고객과 확인하고, 계약 전에 정한 수정 범위 안에서 보완한 뒤 확정합니다",
    steps: [
      ["상담", "목적, 독자, 브랜드 자료를 확인하고 상담 자료로 정리합니다", ""],
      ["조사·캐릭터 설정", "자료조사와 캐릭터·세계관 설정을 정리합니다", ""],
      [
        "시나리오",
        "시나리오를 기획해 전달합니다 합의한 수정 범위 안에서 보완한 뒤 확정합니다",
        "수정 범위 합의",
      ],
      ["웹툰 제작", "확정한 시나리오로 연출하고 최종 이미지를 만듭니다", ""],
      [
        "결과물 확인",
        "결과물을 확인하고, 합의한 수정 범위 안에서 보완한 뒤 확정합니다",
        "수정 범위 합의",
      ],
      ["납품", "최종 이미지를 전달합니다", ""],
    ],
    faqs: [
      [
        "회차별 분량은 어떻게 정하나요?",
        "완성 이미지 1장을 1컷으로 세며 1회분은 24컷으로 제작합니다 이미지 안에 여러 장면이 있어도 이미지 한 장이 1컷입니다",
      ],
      [
        "수정은 몇 번까지 되나요?",
        "시나리오와 결과물을 확인하는 단계에서 계약 전에 정한 수정 범위 안에서 보완한 뒤 확정합니다",
      ],
      [
        "시나리오는 누가 쓰나요?",
        "초기 상담 자료를 바탕으로 저희가 조사하고 기획해 전달합니다 이미 쓴 시나리오가 있으면 그것을 기준으로 다듬습니다",
      ],
      [
        "여러 회차를 이어서 제작할 수 있나요?",
        "필요한 회차 수와 회차별 컷 수를 먼저 합의하고 순서대로 진행합니다 확정한 캐릭터 설정을 다음 회차에도 이어서 사용합니다",
      ],
    ],
  },
  animation: {
    name: "애니메이션",
    en: "ANIMATION",
    line: "시나리오부터 샷 설계, 제작까지 한 흐름으로 30초 내외 숏폼 애니메이션을 만듭니다",
    hero: "left",
    proc: "row",
    tiers: [
      TIP(
        "단일 작업",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        1,
      ),
      TIP(
        "연속 제작",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        0,
      ),
      TIP(
        "연속 제작",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        0,
      ),
    ],
    priceNote:
      "사용 목적, 분량과 수정 범위를 확인한 뒤 견적과 일정을 안내합니다",
    research: [
      ["타깃·메시지 조사", "상담 자료로 시청자와 전달할 메시지를 정리합니다"],
      [
        "비슷한 영상 조사",
        "같은 분야 숏폼의 구성과 길이를 조사해 시나리오에 반영합니다",
      ],
      ["캐릭터·화면 톤", "필요한 캐릭터와 화면 톤을 정해 샷 기획에 맞춥니다"],
    ],
    scope: [
      "상담 자료 기반 조사",
      "시나리오 기획 또는 기존 시나리오 다듬기",
      "장면별 샷 기획·확정",
      "Blender 시뮬레이션",
      "제작·합의한 범위의 수정 보완",
      "납품",
    ],
    procNote:
      "샷을 먼저 확정하고 제작에 들어가, 납품 뒤 구조를 다시 짜는 일을 줄입니다",
    steps: SHOTSTEPS("최종 검수 후 전달합니다"),
    faqs: [
      [
        "기존 시나리오가 있으면요?",
        "충분한 시나리오가 있으면 같은 메시지 안에서 다듬어 진행합니다 새 이야기가 필요하면 상담 자료를 바탕으로 기획합니다",
      ],
      [
        "롱폼도 가능한가요?",
        "롱폼형은 별도로 문의해 주세요 길이와 장면 수에 따라 견적을 안내드립니다",
      ],
      [
        "샷을 확정한 뒤 바꾸고 싶으면요?",
        "샷 확정 후 구조 변경은 별도로 협의합니다 저희 쪽 제작 오류는 수정 횟수에서 빼고 고칩니다",
      ],
    ],
  },
  "ai-influencer": {
    name: "AI 인플루언서 영상",
    en: "AI INFLUENCER",
    line: "브랜드 전용 가상 인물을 만들고, 그 인물이 등장하는 30초 영상을 제작합니다",
    hero: "split",
    proc: "row",
    tiers: [
      TIP(
        "단일 작업",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        1,
      ),
      TIP(
        "연속 제작",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        0,
      ),
    ],
    priceNote:
      "사용 목적, 분량과 수정 범위를 확인한 뒤 견적과 일정을 안내합니다",
    research: [
      [
        "브랜드·타깃 조사",
        "상담 자료로 브랜드 톤과 시청자를 정리해 인물 설정의 기준으로 씁니다",
      ],
      [
        "캐릭터 설정",
        "외형, 말투, 가상 인물 표기 방식과 사용 범위를 정하고 권리를 확인합니다",
      ],
      [
        "콘텐츠 방향",
        "인물이 말할 주제와 영상 형식을 정해 시나리오에 반영합니다",
      ],
    ],
    scope: [
      "상담 자료 기반 조사",
      "브랜드 전용 캐릭터 설정",
      "시나리오 기획",
      "장면별 샷 기획·확정",
      "Blender 시뮬레이션",
      "제작·합의한 범위의 수정 보완",
    ],
    procNote:
      "인물 설정을 먼저 확정하고 영상마다 같은 인물이 유지되도록 검수합니다",
    steps: SHOTSTEPS("인물·제품·자막을 검수한 뒤 전달합니다"),
    faqs: [
      [
        "SNS 계정 운영도 맡길 수 있나요?",
        "계정 개설·게시·운영·성과 분석은 Marketing의 AI 인플루언서 마케팅에서 따로 진행합니다",
      ],
      [
        "실존 인물이나 제품 자료를 써도 되나요?",
        "사용 권한과 생성 도구 업로드 범위를 먼저 확인한 뒤 진행합니다",
      ],
      [
        "캐릭터를 다른 곳에도 쓰나요?",
        "합의한 캐릭터 자산은 다른 고객에게 재사용하지 않습니다",
      ],
    ],
  },
  promo: {
    name: "브랜드 홍보 영상",
    en: "BRAND FILM",
    line: "회사와 브랜드를 1분 내외 영상 한 편으로 소개합니다",
    hero: "left",
    proc: "row",
    tiers: [
      TIP(
        "단일 작업",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        1,
      ),
    ],
    priceNote:
      "사용 목적, 분량과 수정 범위를 확인한 뒤 견적과 일정을 안내합니다",
    research: [
      ["브랜드 메시지 정리", "상담 자료에서 꼭 전할 한 문장과 근거를 뽑습니다"],
      [
        "경쟁·유사 영상 조사",
        "같은 업종 소개 영상의 구성과 길이를 조사해 차별점을 잡습니다",
      ],
      [
        "장면 구성",
        "한 편 안에서 다룰 장면과 순서를 정해 시나리오에 반영합니다",
      ],
    ],
    scope: [
      "상담 자료 기반 조사",
      "시나리오 기획",
      "장면별 샷 기획·확정",
      "Blender 시뮬레이션",
      "제작·합의한 범위의 수정 보완",
      "납품",
    ],
    procNote:
      "한 편의 흐름을 시나리오 단계에서 먼저 정하고, 샷 확정 후 제작합니다",
    steps: SHOTSTEPS("최종 검수 후 전달합니다"),
    faqs: [
      [
        "촬영도 포함되나요?",
        "현장 촬영은 기본 범위에 포함되지 않으며, 필요하면 견적에서 따로 정합니다",
      ],
      [
        "원본 프로젝트 파일도 받을 수 있나요?",
        "원본 파일 제공 여부는 견적에서 명시합니다",
      ],
      [
        "수정은 몇 번까지 되나요?",
        "시나리오는 수정 범위 합의 후 확정하고, 샷 확정 후 제작 단계에서 합의한 범위 안에서 보완합니다",
      ],
    ],
  },
  ad: {
    name: "SNS 광고 영상",
    en: "SNS AD FILM",
    line: "30초 내외 숏폼 광고를 제품·라벨·문구 검수까지 거쳐 만듭니다",
    hero: "phone",
    proc: "row",
    tiers: [
      TIP(
        "단일 작업",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        1,
      ),
      TIP(
        "연속 제작",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        0,
      ),
    ],
    priceNote:
      "사용 목적, 분량과 수정 범위를 확인한 뒤 견적과 일정을 안내합니다",
    research: [
      ["제품·고객 조사", "상담 자료로 제품의 강점과 구매 이유를 정리합니다"],
      [
        "경쟁 광고 조사",
        "같은 분야 광고의 첫 3초와 문구를 조사해 훅 후보를 만듭니다",
      ],
      [
        "사실 검수 기준",
        "제품 모양, 라벨, 색, 용도와 광고 문구의 사실 여부를 미리 정합니다",
      ],
    ],
    scope: [
      "상담 자료 기반 조사",
      "시나리오 기획",
      "장면별 샷 기획·확정",
      "Blender 시뮬레이션",
      "제작·합의한 범위의 수정 보완",
      "광고 문구·제품·라벨·CTA 사실 검수",
    ],
    procNote:
      "광고 문구와 제품 표현은 납품 전에 사실 여부를 한 번 더 확인합니다",
    steps: SHOTSTEPS("광고 문구와 권리를 검수한 뒤 전달합니다"),
    faqs: [
      [
        "광고 집행도 해주나요?",
        "광고 운영과 매체비는 포함되지 않습니다 운영은 Marketing과 따로 협의할 수 있습니다",
      ],
      [
        "여러 버전으로 받을 수 있나요?",
        "훅 변형이나 추가 화면비는 견적에서 포함 여부를 정합니다",
      ],
      [
        "제품 표현은 어떻게 검수하나요?",
        "제품 모양·라벨·색·용도와 광고 문구의 사실 여부를 납품 전에 확인합니다",
      ],
    ],
  },
  edit: {
    name: "편집·클리퍼",
    en: "EDIT & CLIP",
    line: "보유한 영상을 채널에 맞는 편집본과 짧은 클립으로 만듭니다",
    hero: "phone",
    proc: "row",
    tiers: [
      TIP(
        "단일 작업",
        "범위 확인 후 견적",
        "길이·분량·수정 기준을 먼저 정합니다",
        "",
        "",
        1,
      ),
    ],
    priceNote:
      "사용 목적, 분량과 수정 범위를 확인한 뒤 견적과 일정을 안내합니다",
    research: [
      ["원본 확인", "보유 영상의 길이와 화질, 사용 목적을 확인합니다"],
      [
        "클립 구간 선정",
        "채널에서 반응하기 쉬운 구간과 길이를 골라 구성을 정합니다",
      ],
      ["채널 규격 확인", "게시할 채널별 화면비와 자막 기준을 미리 맞춥니다"],
    ],
    scope: [
      "원본 확인·구성",
      "컷 편집",
      "자막·효과음",
      "화면비·채널별 편집본",
      "납품 검수",
    ],
    procNote: "원본 영상이 있으면 가장 빨리 시작할 수 있는 서비스입니다",
    steps: [
      ["원본 확인", "원본 영상과 사용 목적을 확인합니다", ""],
      ["구성", "클립 구간과 편집 구성을 정합니다", ""],
      ["편집", "편집하고 자막을 넣습니다", ""],
      ["납품", "채널별 규격으로 검수한 뒤 전달합니다", ""],
    ],
    faqs: [
      [
        "어떤 원본을 보내면 되나요?",
        "보유한 영상 파일과 사용할 채널을 알려주시면 편집 가능 범위를 먼저 안내드립니다",
      ],
      ["음악을 넣을 수 있나요?", "사용 권한이 확인된 음원만 사용합니다"],
      ["게시까지 해주나요?", "채널 게시와 운영은 Marketing과 따로 진행합니다"],
    ],
  },
};
const W = (k) => {
  const keys = Object.keys(SVC);
  const start = keys.indexOf(k);
  return [0, 1, 2].map((offset) => {
    const key = keys[(start + offset) % keys.length];
    const service =
      { promo: "brand-film", ai: "ai-influencer", edit: "editing" }[key] || key;
    return {
      key: service,
      title: SVC[key].name,
      image: creativeAsset("video", service),
    };
  });
};
const KEYS = Object.keys(SVC),
  CUTN = 10;
const q = () => {
  try {
    const v = new URLSearchParams(location.search).get("s");
    return KEYS.includes(v) ? v : null;
  } catch (e) {
    return null;
  }
};
class Component extends GuideLogic {
  state = { key: this.props.service || "webtoon", open: 0 };
  componentDidMount() {
    this.t = setTimeout(() => this.initReveal(), 120);
    this.t2 = setTimeout(() => this.initReveal(), 1200);
    this.rv = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = 1;
            e.target.style.transform = "none";
            this.rv.unobserve(e.target);
          }
        }),
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" },
    );
  }
  componentWillUnmount() {
    clearTimeout(this.t);
    clearTimeout(this.t2);
    this.rv && this.rv.disconnect();
  }
  initReveal() {
    if (!this.rv) return;
    document.querySelectorAll("[data-rv]").forEach((el) => {
      if (el.dataset.rvd) return;
      el.dataset.rvd = "1";
      const i = +el.dataset.rv || 0;
      el.style.opacity = 0;
      el.style.transform = "translateY(28px)";
      el.style.transition =
        "opacity .8s ease " +
        i * 90 +
        "ms, transform .8s cubic-bezier(.2,.7,.2,1) " +
        i * 90 +
        "ms";
      this.rv.observe(el);
    });
  }
  pick(key) {
    this.setState({ key, open: 0 }, () => this.initReveal());
    location.assign(guideServiceHref("video", key));
  }
  renderVals() {
    const k = this.state.key,
      d = SVC[k],
      h = d.hero;
    const s = {
      ...d,
      key: k,
      tiers: d.tiers,
      research: d.research.map(([t, x], i) => ({ no: N(i + 1), t, d: x })),
      steps: d.steps.map(([title, desc, tag], i) => ({
        no: N(i + 1),
        title,
        desc,
        tag,
        vis: tag ? "visible" : "hidden",
        bg: tag ? "#2A2A32" : "transparent",
      })),
      works: W(k),
    };
    return {
      s,
      contactHref: "Studio 문의.dc.html?s=" + k,
      isWebtoon: k === "webtoon",
      cutNote: "제공된 가이드에서 발췌한 이미지 10장",
      cuts: Array.from({ length: CUTN }, (_, i) => ({
        id: "svc-webtoon-cut" + N([1, 2, 3, 4, 5, 6, 7, 8, 11, 12][i]),
        no: N(i + 1),
        ph: "발췌 예시 컷 " + N(i + 1) + " (최종 이미지)",
      })),
      heroDir: h === "left" ? "row-reverse" : "row",
      heroJust: h === "phone" ? "center" : "flex-end",
      heroRatio: h === "phone" ? "9/16" : "4/3",
      heroMax: h === "phone" ? "360px" : "720px",
      procDir: "row",
      heroAnim:
        k === "webtoon"
          ? React.createElement(WebtoonDevices)
          : React.createElement(Stage, {
              kind: k === "ai-influencer" ? "ai" : k,
              key: k,
            }),
      tabs: KEYS.map((key, i) => {
        const on = key === k;
        return {
          no: N(i + 1),
          label: SVC[key].name,
          fg: on ? "#fff" : "#9A9AA3",
          nc: on ? "#A99BFF" : "#6E6E78",
          bd: on ? "#A99BFF" : "transparent",
          pick: () => this.pick(key),
        };
      }),
      faqs: d.faqs.map(([qq, a], i) => ({
        q: qq,
        a,
        open: this.state.open === i,
        sign: this.state.open === i ? "−" : "+",
        toggle: () => this.setState({ open: this.state.open === i ? -1 : i }),
      })),
    };
  }

  render() {
    const values = adaptGuideValues(
      "studio-services",
      this.renderVals(),
      this.props,
    );
    const {
      contactHref,
      cutNote,
      cuts,
      faqs,
      heroAnim,
      heroDir,
      heroJust,
      heroMax,
      heroRatio,
      isWebtoon,
      procDir,
      s,
      tabs,
    } = values;
    return (
      <div className="guide-page guide-studio-services">
        <GuideEffects />
        <div
          style={{
            background: "#000",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GuideNav division="video" active="services" />
          <section style={{}}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "0 clamp(20px,4vw,56px)",
                display: "flex",
                gap: "clamp(18px,2.6vw,40px)",
                flexWrap: "wrap",
                borderBottom: "1px solid #2A2A32",
              }}
            >
              <ServiceTabs division="video" />
            </div>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(56px,7vw,104px) clamp(20px,4vw,56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "56px clamp(40px,5vw,88px)",
                alignItems: "center",
                flexDirection: heroDir,
              }}
            >
              <div
                style={{
                  flex: "1 1 440px",
                  minWidth: "0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
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
                  {s.en}
                </span>
                <h1
                  style={{
                    margin: "0",
                    fontSize: "clamp(44px,6vw,96px)",
                    lineHeight: "1.08",
                    letterSpacing: "-.055em",
                    fontWeight: "800",
                  }}
                >
                  {s.name}
                </h1>
                <p
                  style={{
                    margin: "0",
                    fontSize: "clamp(17px,1.5vw,20px)",
                    lineHeight: "1.8",
                    color: "#D6D6DC",
                    maxWidth: "40ch",
                  }}
                >
                  {s.line}
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <GuideLink
                    href={contactHref}
                    style={{
                      background: "#6B4DFF",
                      color: "#fff",
                      padding: "18px 30px",
                      fontWeight: "600",
                    }}
                    className="gh-59b0af27"
                    context="video"
                  >
                    {"견적 문의"}
                  </GuideLink>
                  <GuideLink
                    href="#price"
                    style={{
                      border: "1.5px solid #fff",
                      padding: "16.5px 28px",
                      fontWeight: "600",
                    }}
                    className="gh-4ed674bc"
                    context="video"
                  >
                    {"가격 보기"}
                  </GuideLink>
                </div>
              </div>
              <div
                style={{
                  flex: "1 1 440px",
                  minWidth: "0",
                  display: "flex",
                  justifyContent: heroJust,
                }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: isWebtoon ? "auto" : heroRatio,
                    width: "100%",
                    maxWidth: heroMax,
                    overflow: "hidden",
                    background: "#101016",
                    border: "1px solid #2A2A32",
                  }}
                >
                  {heroAnim}
                </div>
              </div>
            </div>
          </section>
          <section id="price" style={{ borderTop: "1px solid #2A2A32" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  data-rv=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".16em",
                      color: "#A99BFF",
                    }}
                  >
                    {"PRICE"}
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
                    {"가격"}
                  </h2>
                </div>
                <span
                  data-rv="1"
                  style={{ fontSize: "15px", color: "#9A9AA3" }}
                >
                  {"모든 금액은 부가세 별도입니다"}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,300px),1fr))",
                  gap: "16px",
                }}
              >
                {(s.tiers || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      data-rv=""
                      style={{
                        border: "1.5px solid " + p.bd,
                        background: p.bg,
                        padding: "clamp(24px,2.6vw,36px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                        minHeight: "260px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          alignItems: "baseline",
                        }}
                      >
                        <span style={{ fontSize: "15px", fontWeight: "600" }}>
                          {p.l}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div
                          style={{
                            display: p.wd,
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              color: "#6E6E78",
                              textDecoration: "line-through",
                            }}
                          >
                            {p.was}
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: "700",
                              padding: "4px 10px",
                              background: "#6B4DFF",
                              color: "#fff",
                            }}
                          >
                            {p.pct}
                          </span>
                        </div>
                        <strong
                          style={{
                            fontSize: "clamp(30px,3.2vw,46px)",
                            letterSpacing: "-.04em",
                            fontWeight: "800",
                            lineHeight: "1.15",
                          }}
                        >
                          {p.p}
                        </strong>
                      </div>
                      <span
                        style={{
                          fontSize: "15px",
                          lineHeight: "1.7",
                          color: "#C9C9D1",
                          marginTop: "auto",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {p.n}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <p
                data-rv=""
                style={{
                  margin: "0",
                  fontSize: "15px",
                  lineHeight: "1.8",
                  color: "#9A9AA3",
                  maxWidth: "70ch",
                }}
              >
                {s.priceNote}
              </p>
            </div>
          </section>
          {isWebtoon ? <WebtoonScope /> : null}
          <section style={{ borderTop: "1px solid #2A2A32" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                data-rv=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#A99BFF",
                  }}
                >
                  {"RESEARCH"}
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
                  {"상담 자료를 바탕으로 조사하고 설계합니다"}
                </h2>
                <p
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#C9C9D1",
                    maxWidth: "44ch",
                  }}
                >
                  {
                    "상담에서 받은 자료를 그대로 옮기지 않고, 제작에 필요한 조사와 설정으로 바꿔 전달합니다"
                  }
                </p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(min(100%,280px),1fr))",
                  gap: "40px",
                }}
              >
                {(s.research || []).map((r, __index4) => (
                  <React.Fragment key={__index4}>
                    <div
                      data-rv=""
                      style={{
                        borderTop: "1.5px solid #fff",
                        paddingTop: "22px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "13px",
                          color: "#A99BFF",
                        }}
                      >
                        {r.no}
                      </span>
                      <strong
                        style={{
                          fontSize: "clamp(20px,1.8vw,24px)",
                          letterSpacing: "-.03em",
                          lineHeight: "1.4",
                        }}
                      >
                        {r.t}
                      </strong>
                      <span
                        style={{
                          fontSize: "16px",
                          lineHeight: "1.8",
                          color: "#C9C9D1",
                        }}
                      >
                        {r.d}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section
            style={{ borderTop: "1px solid #2A2A32", background: "#0D0D12" }}
          >
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: "56px clamp(40px,6vw,96px)",
                alignItems: "flex-start",
                flexDirection: procDir,
              }}
            >
              <div
                className="studio-process-heading"
                style={{
                  flex: "1 1 320px",
                  position: "static",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <div
                  data-rv=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".16em",
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
                    {"진행 과정"}
                  </h2>
                </div>
                <p
                  data-rv=""
                  style={{
                    margin: "0",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "#C9C9D1",
                    maxWidth: "32ch",
                  }}
                >
                  {s.procNote}
                </p>
              </div>
              <ol
                style={{
                  flex: "1.5 1 480px",
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #fff",
                }}
              >
                {(s.steps || []).map((p, __index4) => (
                  <React.Fragment key={__index4}>
                    <li
                      data-rv=""
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "clamp(56px,6vw,88px) minmax(0,1fr) auto",
                        gap: "8px 24px",
                        alignItems: "baseline",
                        padding: "26px 0",
                        borderBottom: "1px solid #2A2A32",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "Unbounded,sans-serif",
                          fontSize: "clamp(28px,3vw,44px)",
                          fontWeight: "300",
                          color: "#A99BFF",
                          lineHeight: "1",
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
                            fontSize: "clamp(20px,1.8vw,24px)",
                            letterSpacing: "-.03em",
                            lineHeight: "1.35",
                          }}
                        >
                          {p.title}
                        </strong>
                        <span
                          style={{
                            fontSize: "16px",
                            lineHeight: "1.75",
                            color: "#C9C9D1",
                          }}
                        >
                          {p.desc}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: "600",
                          padding: "5px 10px",
                          background: p.bg,
                          color: "#fff",
                          whiteSpace: "nowrap",
                          visibility: p.vis,
                        }}
                      >
                        {p.tag}
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
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  data-rv=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".16em",
                      color: "#A99BFF",
                    }}
                  >
                    {"INCLUDED"}
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
                    {"제공 범위"}
                  </h2>
                </div>
                <span
                  data-rv="1"
                  style={{
                    fontSize: "15px",
                    color: "#9A9AA3",
                    maxWidth: "44ch",
                    lineHeight: "1.7",
                  }}
                >
                  {
                    "결과물 수·길이·화면비·파일 규격, 원본 파일 제공 여부와 사용 범위는 견적에서 확정합니다"
                  }
                </span>
              </div>
              <ul
                style={{
                  margin: "0",
                  padding: "0",
                  listStyle: "none",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(min(100%,300px),1fr))",
                  gap: "0 40px",
                  borderTop: "1px solid #2A2A32",
                }}
              >
                {(s.scope || []).map((x, __index4) => (
                  <React.Fragment key={__index4}>
                    <li
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "baseline",
                        padding: "20px 0",
                        borderBottom: "1px solid #2A2A32",
                        fontSize: "16.5px",
                        lineHeight: "1.55",
                        fontWeight: "500",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          background: "#A99BFF",
                          display: "block",
                          flex: "none",
                          transform: "translateY(-3px)",
                        }}
                      ></span>
                      {x}
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </section>
          <section id="works" style={{ borderTop: "1px solid #2A2A32" }}>
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "flex",
                flexDirection: "column",
                gap: "clamp(40px,5vw,64px)",
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
                <div
                  data-rv=""
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Unbounded,sans-serif",
                      fontSize: "12px",
                      letterSpacing: ".16em",
                      color: "#A99BFF",
                    }}
                  >
                    {"WORKS"}
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
                    {"함께 살펴볼 제작 예시"}
                  </h2>
                </div>
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(min(100%,260px),1fr))",
                  gap: "32px 16px",
                }}
              >
                {(s.works || []).map((w, __index4) => (
                  <React.Fragment key={__index4}>
                    <GuideLink
                      href={`/video/work/example-${w.key}`}
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
                        <GuideImage
                          src={w.image}
                          alt={w.title + " 제작 이미지"}
                        />
                      </div>
                      <strong style={{ fontSize: "17px" }}>{w.title}</strong>
                      <span style={{ fontSize: "12px", color: "#B9B3CC" }}>
                        서비스 미리보기
                      </span>
                    </GuideLink>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>
          <section
            id="faq"
            style={{ borderTop: "1px solid #2A2A32", background: "#0D0D12" }}
          >
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "clamp(80px,10vw,144px) clamp(20px,4vw,56px)",
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(min(100%,420px),1fr))",
                gap: "48px clamp(40px,6vw,96px)",
              }}
            >
              <div
                data-rv=""
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Unbounded,sans-serif",
                    fontSize: "12px",
                    letterSpacing: ".16em",
                    color: "#A99BFF",
                  }}
                >
                  {"FAQ"}
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
                  {"자주 묻는 질문"}
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: "1.5px solid #fff",
                }}
              >
                {(faqs || []).map((f, __index4) => (
                  <React.Fragment key={__index4}>
                    <div style={{ borderBottom: "1px solid #2A2A32" }}>
                      <button
                        onClick={f.toggle}
                        style={{
                          all: "unset",
                          cursor: "pointer",
                          width: "100%",
                          boxSizing: "border-box",
                          padding: "26px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "20px",
                          fontSize: "18px",
                          lineHeight: "1.5",
                          fontWeight: "600",
                        }}
                        type="button"
                        aria-expanded={f.open}
                        aria-controls={`studio-faq-answer-${__index4}`}
                      >
                        {f.q}
                        <span
                          style={{
                            fontFamily: "Unbounded,sans-serif",
                            fontWeight: "300",
                            color: "#A99BFF",
                            flex: "none",
                          }}
                        >
                          {f.sign}
                        </span>
                      </button>
                      <p
                        id={`studio-faq-answer-${__index4}`}
                        hidden={!f.open}
                        style={{
                          margin: "0 0 28px",
                          color: "#C9C9D1",
                          fontSize: "16px",
                          lineHeight: "1.85",
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
                  gap: "18px",
                }}
              >
                <h2
                  style={{
                    margin: "0",
                    fontSize: "clamp(30px,4.2vw,60px)",
                    letterSpacing: "-.05em",
                    fontWeight: "800",
                    lineHeight: "1.16",
                  }}
                >
                  {s.name}
                  {", 견적부터 받아보세요"}
                </h2>
                <span style={{ fontSize: "17px", lineHeight: "1.7" }}>
                  {
                    "사용 목적과 보유 자료를 알려주시면 범위와 견적을 안내드립니다"
                  }
                </span>
              </div>
              <GuideLink
                href={contactHref}
                style={{
                  background: "#fff",
                  color: "#0D0D12",
                  padding: "18px 30px",
                  fontWeight: "600",
                }}
                context="video"
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
