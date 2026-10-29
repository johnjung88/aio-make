import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";
import { divisions, divisionServices } from "@/lib/content";
import { publicEntries } from "@/lib/db";
import { guideEntries } from "@/lib/guide-content";
import { publicWorkCatalog } from "@/lib/work-catalog";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    "/",
    "/about",
    "/about/team",
    "/contact",
    "/privacy",
    "/terms",
    "/content/references",
  ];
  for (const d of divisions) {
    if (d.id === "development") {
      paths.push(
        "/lab",
        ...divisionServices("development").map((s) => "/lab/services/" + s.id),
      );
      continue;
    }
    paths.push(
      "/" + d.path,
      "/" + d.path + "/contact",
      ...(d.id === "video" ? [] : ["/" + d.path + "/work"]),
      "/" + d.path + "/insights",
    );
    for (const s of divisionServices(d.id))
      paths.push("/" + d.path + "/services/" + s.id);
  }
  const rows = await Promise.all([
    publicEntries("reference"),
    publicEntries("insight"),
  ]);
  for (const e of [
    ...rows.flat(),
    ...guideEntries("reference"),
    ...guideEntries("insight"),
  ]) {
    const d = divisions.find((d) => d.id === e.division);
    if (
      d &&
      d.id !== "development" &&
      !(d.id === "video" && e.type === "reference")
    )
      paths.push(
        "/" +
          d.path +
          "/" +
          (e.type === "reference" ? "work" : "insights") +
          "/" +
          e.slug,
      );
  }
  paths.push(...publicWorkCatalog([]).map((work) => work.canonicalPath));
  return [...new Set(paths)].map((path) => ({
    url: siteUrl + path,
    changeFrequency: "monthly",
  }));
}
