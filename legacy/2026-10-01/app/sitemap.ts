import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const BASE = SITE_URL;
const LOCALE = "ko";

const CORE_PAGES = [
  { path: "",         priority: 1.0, freq: "weekly"  },
  { path: "/about",   priority: 0.8, freq: "monthly" },
  { path: "/quote",   priority: 1.0, freq: "weekly"  },
  { path: "/portfolio", priority: 0.8, freq: "weekly" },
  { path: "/pricing", priority: 0.7, freq: "monthly" },
] as const;

const SERVICE_HUBS = ["development", "design", "video", "marketing"] as const;

const SERVICE_CATEGORIES = [
  "website",
  "shopping-mall",
  "detail-page",
  "ppt-design",
  "automation-app",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core = CORE_PAGES.map(({ path, priority, freq }) => ({
    url: `${BASE}/${LOCALE}${path}`,
    lastModified: now,
    changeFrequency: freq as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority,
  }));

  const hubs = SERVICE_HUBS.map((hub) => ({
    url: `${BASE}/${LOCALE}/services/${hub}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const categories = SERVICE_CATEGORIES.flatMap((cat) => [
    {
      url: `${BASE}/${LOCALE}/services/${cat}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/${LOCALE}/portfolio/category/${cat}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]);

  return [...core, ...hubs, ...categories];
}
