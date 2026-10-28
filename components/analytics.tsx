"use client";
import Script from "next/script";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/attribution";
import { SiteTracking } from "./tracking";
import { analyticsAllowed, gtmId, gtmSnippet } from "@/lib/analytics-config";
export function Analytics({
  measurementId,
  canonicalHost,
}: {
  measurementId: string;
  canonicalHost: string;
}) {
  const containerId = gtmId();
  const pathname = usePathname(),
    params = useSearchParams(),
    [enabled, setEnabled] = useState(false),
    lastSent = useRef<string | null>(null);
  useEffect(() => {
    setEnabled(
      Boolean(containerId || measurementId) &&
        analyticsAllowed({
          hostname: location.hostname,
          canonicalHost,
          pathname,
        }),
    );
  }, [measurementId, canonicalHost, containerId, pathname]);
  useEffect(() => {
    if (!enabled || !containerId || document.getElementById("gtm-init")) return;
    const script = document.createElement("script");
    script.id = "gtm-init";
    script.textContent = gtmSnippet(containerId);
    document.head.appendChild(script);
  }, [enabled, containerId]);
  useEffect(() => {
    captureAttribution(pathname, new URLSearchParams(params));
  }, [pathname, params]);
  const sendPageView = useCallback(() => {
    if (
      containerId ||
      !enabled ||
      !window.gtag ||
      lastSent.current === pathname
    )
      return;
    lastSent.current = pathname;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: location.origin + pathname,
      page_referrer: document.referrer.split("?")[0],
    });
  }, [pathname, enabled, containerId]);
  useEffect(() => {
    sendPageView();
  }, [sendPageView]);
  return (
    <>
      <SiteTracking pathname={pathname} />
      {enabled && !containerId ? (
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
