"use client";
import Script from "next/script";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
export function Analytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname(),
    params = useSearchParams(),
    [enabled, setEnabled] = useState(false),
    lastSent = useRef<string | null>(null);
  useEffect(() => {
    setEnabled(
      Boolean(measurementId) &&
        !["localhost", "127.0.0.1", "::1", "[::1]"].includes(location.hostname),
    );
  }, [measurementId]);
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("aio_renewal_landing"))
        sessionStorage.setItem("aio_renewal_landing", pathname);
      const utm: Record<string, string> = {};
      for (const key of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ]) {
        const value = params.get(key);
        if (value) utm[key] = value.slice(0, 250);
      }
      if (Object.keys(utm).length && !sessionStorage.getItem("aio_renewal_utm"))
        sessionStorage.setItem("aio_renewal_utm", JSON.stringify(utm));
    } catch {}
  }, [pathname, params]);
  const sendPageView = useCallback(() => {
    if (!enabled || !window.gtag || lastSent.current === pathname) return;
    lastSent.current = pathname;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: location.origin + pathname,
      page_referrer: document.referrer.split("?")[0],
    });
  }, [pathname, enabled]);
  useEffect(() => {
    sendPageView();
  }, [sendPageView]);
  if (!enabled) return null;
  return (
    <Script id="ga-init" strategy="afterInteractive" onReady={sendPageView}>
      {'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",' +
        JSON.stringify(measurementId) +
        ',{send_page_view:false,allow_google_signals:false,page_location:location.origin+location.pathname,page_referrer:document.referrer.split("?")[0]});var s=document.createElement("script");s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(' +
        JSON.stringify(measurementId) +
        ");s.async=true;document.head.appendChild(s);"}
    </Script>
  );
}
