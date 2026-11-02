"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { NewTabHint } from "@/components/new-tab-hint";
import { newTabProps } from "@/lib/new-tab";
import "./production-case.css";

// Same-scene relationship: EP01_SCENARIO_v07 scene 3 → PAGE_SCRIPT page 5
// → approved episode 1 page 05. The text is an edited Korean summary,
// not a quotation or a drawn storyboard. No intermediate image is invented.
const steps = [
  {
    label: "원고 요약",
    title: "인물의 행동과 대사를 정합니다",
    text: "휴대전화를 내려놓고 경기에 몰입하다가, 골이 들어가자 일어나 환호하는 행동을 원고에 담았습니다",
    sequence: "휴대전화 내려놓기 → 경기에 몰입 → 환호",
    source: "1화 시나리오 장면 3 · 공개용 요약",
  },
  {
    label: "장면 구성",
    title: "행동을 컷의 순서로 나눕니다",
    text: "시선과 몸의 방향, 패널의 높이와 빈 옆자리까지 정리해 같은 장면을 그림으로 옮길 기준을 만들었습니다",
    sequence: "시선과 몸의 방향 → 컷 배치 → 대사 위치",
    source: "작화 입력용 장면 구성 page 5 · 공개용 요약",
  },
  {
    label: "완성 페이지",
    title: "그림과 대사를 함께 확인합니다",
    text: "같은 장면의 완성 페이지에서 인물의 행동과 표정, 대사와 읽는 순서가 원고의 흐름으로 이어지는지 살펴봅니다",
    sequence: "행동과 표정 → 대사 → 읽는 흐름",
    source: "《1억의 구단주》 1화 · 실제 완성 페이지 05",
  },
] as const;

export function ProductionCase() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const step = steps[selected];

  return (
    <section className="wjpc" aria-labelledby={`${id}-title`}>
      <header className="wjpc-head">
        <p className="wjpc-kicker eyebrow">실제 제작 과정</p>
        <h3 id={`${id}-title`} className="wjpc-title t-h3">
          원고의 한 장면이 완성 페이지로
        </h3>
        <p className="wjpc-intro t-small">
          《1억의 구단주》의 원고와 같은 장면을 이어 봅니다
        </p>
      </header>

      <div className="wjpc-layout">
        <div className="wjpc-copy">
          <div
            className="wjpc-options"
            role="group"
            aria-label="같은 장면의 제작 단계 선택"
          >
            {steps.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className="wjpc-option t-small"
                aria-pressed={index === selected}
                aria-controls={`${id}-description`}
                onClick={() => setSelected(index)}
              >
                <span className="wjpc-num eyebrow" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          <div
            id={`${id}-description`}
            className="wjpc-description"
            aria-live="polite"
            aria-atomic="true"
          >
            <h4 className="wjpc-step-title t-h3">{step.title}</h4>
            <p className="wjpc-body t-body">{step.text}</p>
            <p className="wjpc-sequence t-small">{step.sequence}</p>
            <p className="wjpc-source t-caption">{step.source}</p>
          </div>
        </div>

        <figure className="wjpc-result">
          <Image
            src="/content-renewal-20261019/webtoon-05.webp"
            alt="휴대전화를 내려놓고 축구 경기에 몰입하다 환호하는 1억의 구단주 1화 완성 페이지 05"
            width={1024}
            height={1536}
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 300px, calc(100vw - 80px)"
          />
          <figcaption className="wjpc-caption t-caption">
            자체 기획 IP · 같은 장면의 완성 페이지 05
          </figcaption>
        </figure>
      </div>

      <Link className="wjpc-link t-small" href="/content" {...newTabProps}>
        컨텐츠 제작 사례와 가격 보기 <span aria-hidden="true">↗</span>
        <NewTabHint />
      </Link>
    </section>
  );
}
