"use client";
/* eslint-disable @next/next/no-img-element -- Compare the two verified source images without further cropping or compression. */

import { useState, type CSSProperties } from "react";
import type { ContentServiceId } from "@/lib/content-site/types";
import { CaseCta, DetailSection } from "./shared";
import "./service-tools.css";

export function ServiceTools({ service }: { service: ContentServiceId }) {
  const [split, setSplit] = useState(50);
  if (service !== "ai-influencer") return null;
  return <DetailSection id="model-comparison" eyebrow="COMPARE THE DETAILS" title="다른 동작에서도 같은 인물인지 확인하세요" lead={"클렌저 소개와 세안 동작에서 가져온 서로 다른 영상 컷입니다\n슬라이더를 움직여 표정·손·제품이 자연스럽게 이어지는지 확인해 보세요"}>
    <div className="sd-model-compare" style={{ "--compare-split": `${split}%` } as CSSProperties}>
      <img src="/content-fb3/cleanser-02.webp" alt="클렌저를 소개하는 87언니 가상인물" loading="lazy" />
      <div className="sd-compare-after"><img src="/content-fb3/cleanser-12.webp" alt="얼굴에 클렌저를 펴 바르는 87언니 가상인물" loading="lazy" /></div>
      <span className="sd-compare-divider" aria-hidden="true"><span>↔</span></span>
      <span className="sd-compare-tag sd-compare-tag-before">제품 소개</span><span className="sd-compare-tag sd-compare-tag-after">세안 동작</span>
    </div>
    <label className="sd-compare-slider-label">좌우로 움직여 비교<input className="sd-compare-slider" type="range" min={0} max={100} step={1} value={split} onChange={(event) => setSplit(Number(event.target.value))} aria-label="AI 모델의 제품 소개와 세안 동작 비교" aria-valuetext={`제품 소개 ${split}%, 세안 동작 ${100 - split}%`} /></label>
    <div className="sd-compare-actions"><div><button type="button" onClick={() => setSplit(100)}>제품 소개만 보기</button><button type="button" onClick={() => setSplit(50)}>나란히 비교</button><button type="button" onClick={() => setSplit(0)}>세안 동작만 보기</button></div><CaseCta caseId="CASE-UNNIE87-MODEL" caseTitle="87언니 AI 가상인물 기준 모델" material="기준 모델 있음" entryPoint="model-comparison">이런 기준으로 모델 제작 상담</CaseCta></div>
  </DetailSection>;
}
