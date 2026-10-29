"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  emptyJourneyData,
  journeyIntro,
  journeySteps,
  railLabel,
  type HomeJourneyData,
  type JourneyStepId,
} from "@/lib/home-journey";
import { JourneyContent } from "./journey-content";
import { JourneyDev } from "./journey-dev";
import { JourneyMarketing } from "./journey-marketing";
import "./workflow-journey.css";

// R7-fix1: each sentence is its own block so text-wrap:balance evens out the lines of every sentence
// (Chrome balances only the first segment of a pre-line paragraph).
function LeadText({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.length === 1) return <>{text}</>;
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="wj-lead-line">
          {line}
        </span>
      ))}
    </>
  );
}

// data comes from the server (lib/home-journey-data.ts) as plain props.
export function WorkflowJourney({
  data = emptyJourneyData,
}: {
  data?: HomeJourneyData;
}) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);

  // One observer over the three articles. The band is 45%–50% of the viewport;
  // the current step is the last article whose top passed the band's lower
  // edge, so every band enter/leave callback resolves to the right step.
  useEffect(() => {
    const section = root.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const articles = Array.from(
      section.querySelectorAll<HTMLElement>(".wj-step"),
    );
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!reduce)
      section.querySelectorAll<HTMLElement>(".wj-media").forEach((media) => {
        if (media.getBoundingClientRect().top > window.innerHeight)
          media.dataset.reveal = "pending";
      });
    const update = () => {
      const line = window.innerHeight * 0.5;
      let current = 0;
      articles.forEach((article, index) => {
        if (article.getBoundingClientRect().top <= line) current = index;
      });
      setActive(current);
      articles.slice(0, current + 1).forEach((article) =>
        article
          .querySelectorAll<HTMLElement>('.wj-media[data-reveal="pending"]')
          .forEach((media) => {
            media.dataset.reveal = "done";
          }),
      );
    };
    const observer = new IntersectionObserver(update, {
      rootMargin: "-45% 0px -50% 0px",
    });
    articles.forEach((article) => observer.observe(article));
    return () => observer.disconnect();
  }, []);

  const bodies: Record<JourneyStepId, ReactNode> = {
    "journey-dev": <JourneyDev project={data.devProject} />,
    "journey-content": <JourneyContent selections={data.contentSelections} />,
    "journey-marketing": <JourneyMarketing />,
  };
  return (
    <section
      id="work"
      ref={root}
      className="wj"
      aria-labelledby="wj-title"
      data-active={active}
    >
      <div className="wj-inner l-container">
        <header className="wj-intro">
          <p className="wj-eyebrow eyebrow">{journeyIntro.eyebrow}</p>
          <h2 id="wj-title" className="wj-title t-h2">
            {journeyIntro.title}
          </h2>
        </header>
        <div className="wj-layout">
          <nav className="wj-rail" aria-label={railLabel}>
            <span className="wj-rail-track" aria-hidden="true">
              <span className="wj-rail-fill" />
            </span>
            <ol className="wj-rail-list">
              {journeySteps.map((step, index) => (
                <li key={step.id}>
                  <a
                    className="wj-rail-link"
                    href={`#${step.id}`}
                    aria-current={index === active ? "step" : undefined}
                  >
                    <span className="wj-num eyebrow">{step.num}</span>
                    <span className="wj-rail-label t-nav">
                      {step.railLabel}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="wj-main">
            <ol className="wj-steps">
              {journeySteps.map((step, index) => (
                <li key={step.id} className="wj-step-item">
                  <article
                    id={step.id}
                    className="wj-step"
                    aria-labelledby={`${step.id}-title`}
                    data-current={index === active ? "true" : undefined}
                  >
                    <p className="wj-eyebrow eyebrow">{step.eyebrow}</p>
                    <h2
                      id={`${step.id}-title`}
                      className="wj-step-title t-h3--feature"
                    >
                      {step.title}
                    </h2>
                    <p className="wj-lead t-lead">
                      <LeadText text={step.lead} />
                    </p>
                    <div className="wj-step-body">{bodies[step.id]}</div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
