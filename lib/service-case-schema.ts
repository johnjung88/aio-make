import { z } from "zod";

export const caseService = z.enum(["webtoon", "animation", "ai-influencer", "motion-graphics", "brand-film", "ad"]);
const text = z.string().trim().min(1).max(1200);
const localAsset = z.string().regex(/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+$/).refine((p) => !p.includes(".."), "올바른 사이트 자료 경로가 필요합니다");
export const serviceCaseSchema = z.object({
  caseId: z.string().regex(/^CASE-[A-Z0-9]+(?:-[A-Z0-9]+)*$/),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  revision: z.number().int().positive(),
  title: text, brand: text, summary: text, scope: text,
  publicLabel: text,
  productionStatus: z.enum(["draft", "completed", "in-use"]),
  publication: z.enum(["draft", "review", "ready", "published"]),
  sourceWorkIds: z.array(z.string().regex(/^AIO-WORK-[A-Z0-9-]+$/)).default([]),
  services: z.array(z.object({ id: caseService, relation: z.enum(["direct", "related", "usage"]), description: text }).strict()).min(1),
  assets: z.array(z.object({ kind: z.enum(["image", "video", "webtoon"]), src: localAsset, poster: localAsset.optional(), alt: text, width: z.number().int().positive().optional(), height: z.number().int().positive().optional() }).strict()).min(1),
  brief: z.string().max(3000).default(""),
  decisions: z.array(z.object({ title: text, description: text }).strict()).default([]),
  stages: z.array(z.object({ title: text, description: text, asset: localAsset.optional() }).strict()).default([]),
  featuredFor: z.array(caseService).default([]),
  order: z.number().int().min(0).max(9999).default(100),
}).strict().superRefine((value, ctx) => {
  if (new Set(value.services.map((s) => s.id)).size !== value.services.length) ctx.addIssue({ code: "custom", path: ["services"], message: "같은 서비스를 중복 연결할 수 없습니다" });
  if (new Set(value.sourceWorkIds).size !== value.sourceWorkIds.length) ctx.addIssue({ code: "custom", path: ["sourceWorkIds"], message: "기존 작품ID가 중복됩니다" });
  value.assets.forEach((a, i) => { if (a.kind === "video" && !a.poster) ctx.addIssue({ code: "custom", path: ["assets", i, "poster"], message: "영상 포스터를 연결해주세요" }); });
  if (["ready", "published"].includes(value.publication) && value.productionStatus === "draft" && !/시안|자체|제작 중/.test(value.publicLabel)) ctx.addIssue({ code: "custom", path: ["publicLabel"], message: "공개할 시안의 실제 상태를 표시해주세요" });
});
export type ServiceCase = z.infer<typeof serviceCaseSchema>;
export const CASE_BODY_PREFIX = "AIO_SERVICE_CASE_V1\n";
export function parseServiceCaseBody(body: string): ServiceCase | null {
  if (!body.startsWith(CASE_BODY_PREFIX)) return null;
  try { const result = serviceCaseSchema.safeParse(JSON.parse(body.slice(CASE_BODY_PREFIX.length))); return result.success ? result.data : null; } catch { return null; }
}
export function encodeServiceCaseBody(record: ServiceCase): string {
  return CASE_BODY_PREFIX + JSON.stringify(serviceCaseSchema.parse(record));
}
/** Seed records are read-only inputs. An admin record with the same canonical ID replaces it once. */
export function mergeServiceCases(seed: ServiceCase[], additions: ServiceCase[]): ServiceCase[] {
  const result = new Map(seed.map((record) => [record.caseId, record]));
  const ids = new Set<string>(); const slugs = new Set<string>();
  for (const input of additions) {
    const record = serviceCaseSchema.parse(input);
    if (ids.has(record.caseId) || slugs.has(record.slug)) throw new Error("중복 사례ID 또는 주소입니다");
    ids.add(record.caseId); slugs.add(record.slug);
    const previous = result.get(record.caseId);
    if (previous && record.revision < previous.revision) throw new Error("오래된 사례 버전으로 덮어쓸 수 없습니다");
    result.set(record.caseId, record);
  }
  const merged = [...result.values()];
  if (new Set(merged.map((r) => r.slug)).size !== merged.length) throw new Error("사례 주소가 중복됩니다");
  return merged.sort((a, b) => a.order - b.order || a.caseId.localeCompare(b.caseId));
}
export function casesForService(records: ServiceCase[], id: z.infer<typeof caseService>) {
  return records.filter((r) => ["ready", "published"].includes(r.publication) && r.services.some((s) => s.id === id));
}

/** Existing case edits replace the authored case journey; new unfeatured cases never replace it. */
export function serviceCasePresentation(seed: ServiceCase[], records: ServiceCase[], id: z.infer<typeof caseService>, defaultId: string) {
  const baseline = casesForService(seed, id);
  const originals = new Map(baseline.map((r) => [r.caseId, r]));
  const featured = records.filter((r) => r.featuredFor.includes(id)).sort((a, b) =>
    Number(!originals.has(b.caseId) || b.revision > (originals.get(b.caseId)?.revision ?? 0)) - Number(!originals.has(a.caseId) || a.revision > (originals.get(a.caseId)?.revision ?? 0)) || a.order - b.order);
  const primary = featured[0] ?? null;
  const baselineChanged = baseline.some((record) => !records.some((next) => next.caseId === record.caseId && next.revision === record.revision));
  return { primary, useAuthoredJourney: Boolean(primary && primary.caseId === defaultId && !baselineChanged) };
}
