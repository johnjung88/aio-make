"use client";

import { useRef, useState } from "react";
import type React from "react";
import {
  contentHomeProcess as steps,
  contentHomeProcessHead as head,
  pad2,
  type ContentHomeStep,
} from "@/lib/content-home";

const PANEL_ID = "ch-step-panel";
const tabId = (i: number) => `ch-step-tab-${i + 1}`;
const NEXT_KEYS = ["ArrowDown", "ArrowRight"];
const PREV_KEYS = ["ArrowUp", "ArrowLeft"];

/* 패널 높이는 다섯 단계 내용을 같은 칸에 겹쳐 가장 긴 단계로 정한다.
 * 보이지 않는 사본은 heading이 아닌 요소로 만들고 aria-hidden으로 숨긴다. */
function StepContent({
  step,
  index,
  sizer = false,
}: {
  step: ContentHomeStep;
  index: number;
  sizer?: boolean;
}) {
  if (sizer)
    return (
      <div className="ch-step-content is-sizer" aria-hidden="true">
        <div className="ch-step-title t-h3">{step.title}</div>
        <div className="ch-body t-body">{step.body}</div>
        <div className="ch-step-output">
          <div className="ch-caption t-small">{head.outputLabel}</div>
          <div className="ch-body t-body">{step.output}</div>
        </div>
      </div>
    );
  return (
    <div className="ch-step-content">
      <span className="ch-display-num" aria-hidden="true">
        {pad2(index + 1)}
      </span>
      <h3 className="ch-step-title t-h3">{step.title}</h3>
      <p className="ch-body t-body">{step.body}</p>
      <dl className="ch-step-output">
        <dt className="ch-caption t-small">{head.outputLabel}</dt>
        <dd className="ch-body t-body">{step.output}</dd>
      </dl>
    </div>
  );
}

export function ProcessTabs() {
  const [current, setCurrent] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    const next = (index + steps.length) % steps.length;
    setCurrent(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (NEXT_KEYS.includes(event.key)) next = current + 1;
    else if (PREV_KEYS.includes(event.key)) next = current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = steps.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <div className="ch-container l-container ch-process-layout">
      <div
        className="ch-step-tabs"
        role="tablist"
        aria-label={head.tabsLabel}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {steps.map((step, i) => (
          <button
            key={step.label}
            ref={(node) => {
              tabRefs.current[i] = node;
            }}
            type="button"
            role="tab"
            id={tabId(i)}
            className="ch-step-tab"
            aria-selected={i === current}
            aria-controls={PANEL_ID}
            tabIndex={i === current ? 0 : -1}
            onClick={() => select(i)}
          >
            <span className="ch-num eyebrow">{pad2(i + 1)}</span>
            <span className="ch-tab t-chip">{step.label}</span>
          </button>
        ))}
      </div>
      <div
        className="ch-step-panel"
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={tabId(current)}
      >
        <div className="ch-step-stack">
          {steps.map((step, i) => (
            <StepContent
              key={step.label}
              step={step}
              index={i}
              sizer={i !== current}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
