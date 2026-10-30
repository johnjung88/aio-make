import { cleanUtm, type Attribution } from "./attribution.ts";
type Events = {
  kakao_chat_click: "page" | "division";
  aio_page_view: "page_path" | "page_title" | "page_type" | "service_slug";
  aio_cta_click: "cta_location" | "service_slug";
  aio_service_view: "service_slug";
  aio_reference_view: "content_type" | "content_slug" | "industry" | "biz_type";
  aio_video_play: "video_id" | "content_slug";
  aio_form_start: "form_name";
  aio_form_error: "error_field";
  aio_lead:
    | "event_id"
    | "division"
    | "service"
    | "purpose"
    | "found_via"
    | "utm_source"
    | "utm_medium"
    | "utm_campaign"
    | "utm_content"
    | "utm_term"
    | "first_utm_source"
    | "first_utm_content";
};
const fields: { [E in keyof Events]: readonly Events[E][] } = {
  kakao_chat_click: ["page", "division"],
  aio_page_view: ["page_path", "page_title", "page_type", "service_slug"],
  aio_cta_click: ["cta_location", "service_slug"],
  aio_service_view: ["service_slug"],
  aio_reference_view: ["content_type", "content_slug", "industry", "biz_type"],
  aio_video_play: ["video_id", "content_slug"],
  aio_form_start: ["form_name"],
  aio_form_error: ["error_field"],
  aio_lead: [
    "event_id",
    "division",
    "service",
    "purpose",
    "found_via",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "first_utm_source",
    "first_utm_content",
  ],
};
declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}
export function track<E extends keyof Events>(
  event: E,
  values: Partial<Record<Events[E], string>> = {},
) {
  try {
    if (typeof window === "undefined") return;
    const payload: Record<string, string> = { event };
    for (const key of fields[event]) {
      const value = values[key];
      if (typeof value === "string") payload[key] = value;
    }
    (window.dataLayer ??= []).push(payload);
    if (event === "kakao_chat_click") {
      const gtag = (window as Window & { gtag?: (...args: unknown[]) => void })
        .gtag;
      if (typeof gtag === "function") {
        const { event: eventName, ...parameters } = payload;
        gtag("event", eventName, parameters);
      }
    }
  } catch {
    /* Tracking must not interrupt the form or navigation. */
  }
}
const emittedLeads = new Set<string>();
function eventUtm(value: unknown) {
  return Object.fromEntries(
    Object.entries(cleanUtm(value)).filter(([, text]) =>
      /^[A-Za-z0-9_-]{1,150}$/.test(text),
    ),
  );
}
const startedForms = new WeakSet<object>();
export function trackFormStart(form: object | null) {
  if (!form || startedForms.has(form)) return;
  startedForms.add(form);
  track("aio_form_start", { form_name: "content_contact" });
}
export function trackLead(
  receipt: { inquiryId?: unknown; duplicate?: unknown },
  data: {
    division: string;
    service: string;
    purpose?: string;
    found_via?: string;
    attribution: Attribution;
  },
) {
  const id = receipt.inquiryId;
  if (
    receipt.duplicate !== false ||
    typeof id !== "string" ||
    !/^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(id) ||
    emittedLeads.has(id)
  )
    return false;
  emittedLeads.add(id);
  const utm = eventUtm(data.attribution.utm),
    first = eventUtm(data.attribution.firstTouch?.utm);
  track("aio_lead", {
    event_id: id,
    division: data.division,
    service: data.service,
    purpose: data.purpose ?? "",
    found_via: data.found_via ?? "",
    ...utm,
    first_utm_source: first.utm_source ?? "",
    first_utm_content: first.utm_content ?? "",
  });
  return true;
}
export function pageTracking(path: string) {
  const parts = path.split("/").filter(Boolean);
  const service =
    parts[0] === "content" &&
    parts[1] === "services" &&
    [
      "webtoon",
      "animation",
      "ai-influencer",
      "motion-graphics",
      "brand-film",
      "ad",
    ].includes(parts[2])
      ? parts[2]
      : "";
  const standaloneWork = parts.length === 2 && parts[0] === "work";
  const article =
    standaloneWork ||
    (parts.length === 3 &&
      ["projects", "insights", "references", "work"].includes(parts[1]));
  const type =
    path === "/" || path === "/content"
      ? "home"
      : parts.includes("contact")
        ? "contact"
        : parts.includes("services")
          ? "service"
          : parts.includes("insights")
            ? "insight"
            : parts.some((p) => ["projects", "references", "work"].includes(p))
              ? "reference"
              : "other";
  return {
    type,
    service,
    article,
    slug: article ? parts[standaloneWork ? 1 : 2] : "",
    contentType: parts[1] === "insights" ? "insight" : "reference",
  };
}
