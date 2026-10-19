"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import "./scroll-to-top.css";

/** A native page scroll indicator and top action shared by every public route. */
export function ScrollToTop() {
  const path = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const frame = useRef(0);
  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
        setVisible(max > 200 && window.scrollY > 240);
        setKeyboard(Boolean(window.visualViewport && window.innerHeight - window.visualViewport.height > 160));
      });
    };
    const resize = new ResizeObserver(update);
    resize.observe(document.documentElement);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame.current);
      resize.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, [path]);
  if (path.startsWith("/admin")) return null;
  function toTop() {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    const heading = document.querySelector<HTMLElement>("main h1, main");
    if (heading) {
      const temporary = !heading.hasAttribute("tabindex");
      if (temporary) heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
      if (temporary) heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
    }
  }
  return <button className="aio-scroll-top" type="button" aria-label="맨 위로 이동" title="맨 위로 이동" data-visible={visible && !keyboard} tabIndex={visible && !keyboard ? 0 : -1} onClick={toTop} style={{ "--top-progress": progress } as CSSProperties}>
    <svg viewBox="0 0 52 52" aria-hidden="true"><circle className="aio-top-track" cx="26" cy="26" r="23" /><circle className="aio-top-progress" cx="26" cy="26" r="23" pathLength="1" /><path d="M26 35V17m-7 7 7-7 7 7" /></svg>
    <span>TOP</span>
  </button>;
}
