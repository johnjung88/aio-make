"use client";

import { sendGAEvent } from "@next/third-parties/google";

const SESSION_KEY = "aio_session_uid";
const UTM_KEY = "aio_first_utm";

export function getOrCreateSessionUid(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const uid = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, uid);
    return uid;
  } catch {
    return "anon";
  }
}

export function getStoredUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function captureUtmFromUrl() {
  if (typeof window === "undefined") return;
  try {
    const existing = sessionStorage.getItem(UTM_KEY);
    if (existing) return; // first-touch only
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","_tl"].forEach((k) => {
      const v = params.get(k);
      if (v) utm[k] = v;
    });
    if (Object.keys(utm).length > 0) {
      utm.capturedAt = new Date().toISOString();
      sessionStorage.setItem(UTM_KEY, JSON.stringify(utm));
    }
  } catch {}
}

/** 연락처 링크 클릭 이벤트 헬퍼 (click_email / click_phone / click_kakao) */
export function trackContactClick(kind: "email" | "phone" | "kakao") {
  const eventMap = { email: "click_email", phone: "click_phone", kakao: "click_kakao" } as const;
  trackEvent(eventMap[kind]);
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  // GA4
  try { sendGAEvent("event", name, params); } catch {}

  // Supabase dual-write
  if (typeof window === "undefined") return;
  const sessionUid = getOrCreateSessionUid();
  const utm = getStoredUtm();

  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      sessionUid,
      eventType: name,
      eventPath: window.location.pathname,
      eventProps: params,
      utm: Object.keys(utm).length > 0 ? utm : undefined,
    }),
  }).catch(() => {});
}
