import "server-only";
import seedData from "@/content/service-cases-v14.json";
import { database, databaseReady } from "./db";
import { CASE_BODY_PREFIX, casesForService, mergeServiceCases, parseServiceCaseBody, serviceCaseSchema, type ServiceCase } from "./service-case-schema";
import type { ContentServiceId } from "./content-site/types";

export const seedServiceCases: ServiceCase[] = seedData.map((record) => serviceCaseSchema.parse(record));

/** The existing entry remains the only writable record. Static seed records are never written back. */
export async function allServiceCases(): Promise<ServiceCase[]> {
  const publicRecords = (records: ServiceCase[]) => records.filter((record) => ["ready", "published"].includes(record.publication));
  if (!databaseReady()) return publicRecords(seedServiceCases);
  const additions: ServiceCase[] = [];
  // Page through the case rows so the former 4/5-card cap and entry-list first-page limit cannot trim new cases.
  for (let page = 0; page < 100; page += 1) {
    const { data, error } = await database().from("website_entries")
      .select("id,body,is_published,rights_confirmed")
      .eq("type", "reference").eq("division", "video")
      .like("body", `${CASE_BODY_PREFIX}%`).order("id").range(page * 100, page * 100 + 99);
    if (error) return [];
    for (const entry of data ?? []) {
      const record = parseServiceCaseBody(entry.body);
      if (!record) continue;
      // Private rows can suppress a previous version, but none of their private fields reach the renderer.
      additions.push({ ...record, publication: entry.is_published && entry.rights_confirmed ? "published" : "draft" });
    }
    if (!data || data.length < 100) break;
  }
  try { return publicRecords(mergeServiceCases(seedServiceCases, additions)); }
  catch { return []; }
}

export async function serviceCases(id: ContentServiceId): Promise<ServiceCase[]> {
  return casesForService(await allServiceCases(), id);
}
