"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageNavigation() {
  const path = usePathname();
  const [visible, setVisible] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const header = document.querySelector(".guide-header");
    if (!header) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    measure();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const viewport = window.visualViewport;
    const update = () => {
      setVisible(window.scrollY > 320);
      setKeyboard(!!viewport && window.innerHeight - viewport.height > 160);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    viewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      viewport?.removeEventListener("resize", update);
    };
  }, [path]);
  return (
    <button
      className="back-to-top"
      hidden={!visible || keyboard}
      aria-label="맨 위로 이동"
      title="맨 위로 이동"
      onClick={() => {
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
        document
          .querySelector<HTMLAnchorElement>(".guide-header a")
          ?.focus({ preventScroll: true });
      }}
    >
      <ArrowUp size={22} aria-hidden="true" />
    </button>
  );
}
