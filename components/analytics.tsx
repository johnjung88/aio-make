"use client";
import Script from "next/script";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";
import { SiteTracking } from "./tracking";
export function Analytics({
  measurementId,
  canonicalHost,
}: {
  measurementId: string;
  canonicalHost: string;
}) {
  const pathname = usePathname(),
    params = useSearchParams(),
    [enabled, setEnabled] = useState(false),
    lastSent = useRef<string | null>(null);
  useEffect(() => {
    setEnabled(
      Boolean(measurementId) &&
        location.hostname === canonicalHost &&
        !["localhost", "127.0.0.1", "::1", "[::1]"].includes(location.hostname),
    );
  }, [measurementId, canonicalHost]);
  useEffect(() => {
    captureAttribution(pathname, new URLSearchParams(params));
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
  return (
    <>
      <SiteTracking pathname={pathname} />
      {enabled ? (
        <Script id="ga-init" strategy="afterInteractive" onReady={sendPageView}>
          {'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config",' +
            JSON.stringify(measurementId) +
            ',{send_page_view:false,allow_google_signals:false,page_location:location.origin+location.pathname,page_referrer:document.referrer.split("?")[0]});var s=document.createElement("script");s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(' +
            JSON.stringify(measurementId) +
            ");s.async=true;document.head.appendChild(s);"}
        </Script>
      ) : null}
    </>
  );
}
