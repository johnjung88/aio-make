"use client";
/* eslint-disable @next/next/no-img-element -- Compare the two verified source images without further cropping or compression. */

import { useState, type CSSProperties } from "react";
import type { ContentServiceId } from "@/lib/content-site/types";
import { CaseCta, DetailSection } from "./shared";
import "./service-tools.css";

export function ServiceTools({ service }: { service: ContentServiceId }) {
  const [split, setSplit] = useState(50);
  if (service !== "ai-influencer") return null;
  return <DetailSection id="model-comparison" eyebrow="COMPARE THE DETAILS" title="같은 장면의 보완 전후를 비교해 보세요" lead={"같은 장면을 보완하기 전과 후의 이미지입니다\n슬라이더를 움직여 얼굴·의상·조명의 차이를 비교해 보세요"}>
    <div className="sd-model-compare" style={{ "--compare-split": `${split}%` } as CSSProperties}>
      <img src="/service-detail-v14/ai-t2.webp" alt="보완 전 장면 시험 · 달라진 얼굴 인상과 의상·조명" loading="lazy" />
      <div className="sd-compare-after"><img src="/service-detail-v14/ai-t3.webp" alt="보완 후 채택 장면 · 밝은 조명과 기준에 맞춘 니트 의상" loading="lazy" /></div>
      <span className="sd-compare-divider" aria-hidden="true"><span>↔</span></span>
      <span className="sd-compare-tag sd-compare-tag-before">보완 전</span><span className="sd-compare-tag sd-compare-tag-after">보완 후</span>
    </div>
    <label className="sd-compare-slider-label">좌우로 움직여 비교<input className="sd-compare-slider" type="range" min={0} max={100} step={1} value={split} onChange={(event) => setSplit(Number(event.target.value))} aria-label="AI 모델 보완 전후 비교" aria-valuetext={`보완 전 ${split}%, 보완 후 ${100 - split}%`} /></label>
    <div className="sd-compare-actions"><div><button type="button" onClick={() => setSplit(100)}>보완 전만 보기</button><button type="button" onClick={() => setSplit(50)}>나란히 비교</button><button type="button" onClick={() => setSplit(0)}>보완 후만 보기</button></div><CaseCta caseId="CASE-UNNIE87-MODEL" caseTitle="87언니 AI 가상인물 기준 모델" material="기준 모델 있음" entryPoint="model-comparison">이런 기준으로 모델 제작 상담</CaseCta></div>
  </DetailSection>;
}
