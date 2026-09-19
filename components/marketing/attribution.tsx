"use client";
import { useEffect } from "react";
export function MarketingAttribution() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("aio_marketing_entry")) {
        const q = new URLSearchParams(location.search);
        sessionStorage.setItem(
          "aio_marketing_entry",
          JSON.stringify({
            entry_path: location.pathname,
            referrer: document.referrer.slice(0, 1000),
            ...Object.fromEntries(
              [
                "utm_source",
                "utm_medium",
                "utm_campaign",
                "utm_content",
                "content_id",
                "reference_case",
              ].map((k) => [k, (q.get(k) || "").slice(0, 200)]),
            ),
          }),
        );
      }
    } catch {
      /* Storage may be disabled. Form can still submit. */
    }
  }, []);
  return null;
}
