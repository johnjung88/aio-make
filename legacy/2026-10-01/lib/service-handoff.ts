import type { ServiceCategory } from "@/lib/services-data";

export type HandoffStatus = "new" | "needs_triage" | "assigned";

export type HandoffInfo = {
  serviceKey: ServiceCategory;
  assignedPmQueue: string;
  handoffStatus: HandoffStatus;
  handoffReason: string;
};

const PM_QUEUE_BY_SERVICE: Record<ServiceCategory, string> = {
  website: "aio_pm_website",
  "shopping-mall": "aio_pm_website",
  "logo-business-card": "aio_pm_page",
  "detail-page": "aio_pm_page",
  "ppt-design": "aio_pm_ppt",
  "automation-app": "aio_director_dev",
  "video-content": "aio_pm_sns",
};

export function getHandoffInfo(category: ServiceCategory, subtype?: string | null): HandoffInfo {
  const assignedPmQueue = PM_QUEUE_BY_SERVICE[category] ?? "aio_pm_insales";
  return {
    serviceKey: category,
    assignedPmQueue,
    handoffStatus: "new",
    handoffReason: subtype
      ? `${category} / ${subtype} 견적 폼 제출`
      : `${category} 견적 폼 제출`,
  };
}

export function normalizeEntryPath(value?: string | null, fallback = "/quote"): string {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return fallback;

  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const url = new URL(raw);
      return `${url.pathname}${url.search}`.slice(0, 500);
    }
  } catch {
    return fallback;
  }

  if (!raw.startsWith("/")) return fallback;
  return raw.slice(0, 500);
}
