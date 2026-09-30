import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";
import { divisions, divisionServices } from "@/lib/content";
import { publicEntries } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ["/", "/about", "/contact", "/work", "/privacy", "/terms"];
  for (const d of divisions) {
    paths.push(
      "/" + d.path,
      "/" + d.path + "/contact",
      "/work",
      "/" + d.path + "/work",
      "/" + d.path + "/insights",
    );
    for (const s of divisionServices(d.id))
      paths.push("/" + d.path + "/services/" + s.id);
  }
  const rows = await Promise.all([
    publicEntries("reference"),
    publicEntries("insight"),
  ]);
  for (const e of rows.flat()) {
    const d = divisions.find((d) => d.id === e.division);
    if (d)
      paths.push(
        "/" +
          d.path +
          "/" +
          (e.type === "reference" ? "work" : "insights") +
          "/" +
          e.slug,
      );
  }
  return [...new Set(paths)].map((path) => ({
    url: siteUrl + path,
    changeFrequency: "monthly",
  }));
}
