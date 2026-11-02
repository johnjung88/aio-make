"use client";

import { useEffect } from "react";

export function PageNavigation() {
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
  // The root ScrollToTop owns the single public-page top action.
  return null;
}
