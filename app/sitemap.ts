import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { publicPaths } from "@/lib/marketing/routes";
export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.map((path) => ({
    url: SITE_URL + "/ko" + path,
    changeFrequency: "monthly",
    priority: path ? 0.7 : 1,
  }));
}
