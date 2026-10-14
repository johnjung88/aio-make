"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  contentCopy,
  devServiceLinks,
  emptyJourneyData,
  journeyClosing,
  journeyIntro,
  journeySteps,
  marketingPanel,
  railLabel,
  type HomeJourneyData,
  type JourneyLink,
  type JourneyStepId,
} from "@/lib/home-journey";
import { contentLinkProps } from "@/lib/new-tab";
import { NewTabHint } from "@/components/new-tab-hint";
import { JourneyContent } from "./journey-content";
import { JourneyDev } from "./journey-dev";
import "./workflow-journey.css";

function JourneyAnchor({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith("#"))
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  // Links into /content open the content site in a new tab.
  const newTab = contentLinkProps(href);
  return (
    <Link className={className} href={href} {...newTab}>
      {children}
      {newTab.target && <NewTabHint />}
    </Link>
  );
}

function LinkRow({ links }: { links: JourneyLink[] }) {
  if (!links.length) return null;
  return (
    <div className="wj-links wj-step-links">
      {links.map((link) => (
        <JourneyAnchor
          key={link.href}
          className="wj-link t-button"
          href={link.href}
        >
          {link.label} <span aria-hidden="true">→</span>
        </JourneyAnchor>
      ))}
    </div>
  );
}

function MarketingBody() {
  const { nodes, branches } = marketingPanel;
  return (
    <div className="wj-panel">
      <div className="wj-panel-head">
        <p className="wj-caption wj-panel-label t-small">
          {marketingPanel.label}
        </p>
        <span className="wj-tag t-caption">{marketingPanel.tag}</span>
      </div>
      <ol className="wj-cycle">
        {nodes.map((node, index) => (
          <li key={node.id} className={`wj-node wj-node--${node.id}`}>
            {index > 0 && <span className="wj-flow-arrow" aria-hidden="true" />}
            {index === 1 && (
              <>
                <span className="wj-loop wj-loop--start" aria-hidden="true" />
                <span className="wj-loop-head" aria-hidden="true" />
              </>
            )}
            {index === 2 && (
              <span className="wj-loop wj-loop--mid" aria-hidden="true" />
            )}
            {index === 3 && (
              <span className="wj-loop wj-loop--end" aria-hidden="true" />
            )}
            <span className="wj-num eyebrow">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="wj-item-title t-h3">{node.title}</h3>
            <p className="wj-caption t-small">{node.detail}</p>
            {node.id === "improve" && (
              <ul className="wj-branches">
                {branches.map((branch) => (
                  <li key={branch.href}>
                    <a className="wj-link t-button" href={branch.href}>
                      {branch.from} <span aria-hidden="true">→</span>{" "}
                      {branch.to}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </div>
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
    "journey-dev": <JourneyDev projects={data.devProjects} />,
    "journey-content": <JourneyContent selections={data.contentSelections} />,
    "journey-marketing": <MarketingBody />,
  };
  const links: Record<JourneyStepId, JourneyLink[]> = {
    "journey-dev": devServiceLinks,
    "journey-content": contentCopy.stepLinks,
    "journey-marketing": marketingPanel.links,
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
          <p className="wj-lead t-lead">{journeyIntro.lead}</p>
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
                    <p className="wj-lead t-lead">{step.lead}</p>
                    <div className="wj-step-body">{bodies[step.id]}</div>
                    <LinkRow links={links[step.id]} />
                  </article>
                </li>
              ))}
            </ol>
            <div className="wj-closing">
              <p className="wj-lead t-lead">{journeyClosing.lead}</p>
              <a
                className="wj-button t-button"
                href={journeyClosing.button.href}
              >
                {journeyClosing.button.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
