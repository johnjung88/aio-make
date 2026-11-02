"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCsMotion } from "../shell/frame";
import "./experience.css";

type Chapter = { id: string; label: string };

/** Page navigation stays outside the hero, keeping the opening a work showcase. */
export function ServiceExperience({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const { motion, toggle } = useCsMotion();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState("");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const sections = Array.from(node.querySelectorAll<HTMLElement>(".sd-section"));
    const first = sections.find((s) => /case$/.test(s.id)) ?? sections.find((s) => s.id !== "pricing");
    const process = sections.find((s) => /기획|설계|포즈|같은 장면|제작 과정/.test(s.querySelector("h2")?.textContent ?? "") && s !== first);
    if (first && !first.id) first.id = "service-first-case";
    if (process && !process.id) process.id = "service-making";
    const entries = [
      first ? { id: first.id, label: "제작 사례" } : null,
      process ? { id: process.id, label: "기획·과정" } : null,
      { id: "pricing", label: "구성·가격" },
      { id: "faq", label: "FAQ" },
      { id: "inquiry", label: "제작 상담" },
    ].filter((x): x is Chapter => Boolean(x && node.querySelector(`#${x.id}`)));
    setChapters(entries);
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const header = parseFloat(getComputedStyle(node).getPropertyValue("--cs-header-h")) || 76;
        const hero = node.querySelector(".sd-hero");
        setVisible(Boolean(hero && hero.getBoundingClientRect().bottom < header));
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        setProgress(Math.max(0, Math.min(1, window.scrollY / max)));
        setActive(entries.filter((chapter) => (document.getElementById(chapter.id)?.getBoundingClientRect().top ?? Infinity) < header + 160).at(-1)?.id ?? entries[0]?.id ?? "");
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    if (motion !== "on" || !root.current) return;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      media.add("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const heads = Array.from(root.current!.querySelectorAll<HTMLElement>(".sd-section-head"));
        heads.filter((node) => node.getBoundingClientRect().top > window.innerHeight).forEach((node) => {
          gsap.fromTo(node, { y: 22, autoAlpha: .5 }, {
            y: 0, autoAlpha: 1, duration: .7, ease: "power2.out", clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: node, start: "top 91%", once: true },
          });
        });
      }, root.current);
      cleanup = () => media.revert();
    });
    return () => { cancelled = true; cleanup?.(); };
  }, [motion]);

  return <div className="sd-experience" ref={root} data-experience-motion={motion}>
    <nav className="sd-chapters" aria-label="상세 페이지 목차" data-visible={visible}>
      <div className="sd-chapters-inner"><span className="sd-chapters-label">ON THIS PAGE</span>
        <div className="sd-chapters-links">{chapters.map((chapter) => <a key={chapter.id} href={`#${chapter.id}`} aria-current={active === chapter.id ? "location" : undefined} tabIndex={visible ? 0 : -1}>{chapter.label}</a>)}</div>
        <button type="button" onClick={toggle} aria-pressed={motion === "paused"} tabIndex={visible ? 0 : -1}>{motion === "on" ? "움직임 멈춤 Ⅱ" : "움직임 켜기 ▷"}</button>
      </div><span className="sd-chapters-progress" style={{ width: `${progress * 100}%` }} />
    </nav>
    {children}
  </div>;
}
