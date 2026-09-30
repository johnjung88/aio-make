"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureUtmFromUrl, trackEvent } from "@/lib/analytics/client";

export function AnalyticsInit() {
  const pathname = usePathname();
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    captureUtmFromUrl();
    // "page_view" → "pageview" (DB CHECK 제약 맞춤)
    trackEvent("pageview", { path: pathname });

    // 페이지 전환 시 스크롤/체류 트래커 초기화
    const fired = new Set<string>();
    firedRef.current = fired;

    // ── 스크롤 깊이 이벤트 (50% / 90%) ──────────────────
    function onScroll() {
      const el = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      if (!fired.has("scroll_50") && pct >= 50) {
        fired.add("scroll_50");
        trackEvent("scroll_depth_50", { path: pathname });
      }
      if (!fired.has("scroll_90") && pct >= 90) {
        fired.add("scroll_90");
        trackEvent("scroll_depth_90", { path: pathname });
        window.removeEventListener("scroll", onScroll, { capture: false });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── 체류시간 이벤트 (30초 / 2분) ─────────────────────
    const t30  = setTimeout(() => { if (!fired.has("time_30s"))  { fired.add("time_30s");  trackEvent("time_30s",  { path: pathname }); } }, 30_000);
    const t2m  = setTimeout(() => { if (!fired.has("time_2min")) { fired.add("time_2min"); trackEvent("time_2min", { path: pathname }); } }, 120_000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t30);
      clearTimeout(t2m);
    };
  }, [pathname]);

  return null;
}
