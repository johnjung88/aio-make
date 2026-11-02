import { z } from "zod";
import { services } from "./content.ts";
import { cleanUtm } from "./attribution.ts";
import {
  CASE_BODY_PREFIX,
  encodeServiceCaseBody,
  parseServiceCaseBody,
  serviceCaseSchema,
  type ServiceCase,
} from "./service-case-schema.ts";
export const divisionSchema = z.enum(["marketing", "development", "video"]);
export const purposeSchema = z.enum(
  ["sales_ad", "brand_intro", "sns_ops", "other", "unknown"],
  { errorMap: () => ({ message: "사용 목적을 골라주세요" }) },
);
export const foundViaSchema = z.enum([
  "youtube",
  "instagram",
  "facebook",
  "threads",
  "naver",
  "search",
  "referral",
  "other",
]);
const utmSchema = z.record(z.string()).transform(cleanUtm);
export const contactSchema = z
  .object({
    name: z.string().trim().min(1, "성함을 입력해주세요").max(100),
    email: z
      .string()
      .trim()
      .email("이메일을 확인해주세요")
      .max(255)
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine(
        (v) =>
          !v ||
          (/^\+?[\d\s()-]+$/.test(v) &&
            v.replace(/\D/g, "").length >= 6 &&
            v.replace(/\D/g, "").length <= 15),
        "전화번호를 확인해주세요",
      ),
    company: z.string().trim().max(150).default(""),
    division: divisionSchema,
    service: z.string().max(50),
    formId: z
      .enum(["content_contact", "general_contact", "guide_inquiry"])
      .optional(),
    purpose: purposeSchema.optional(),
    found_via: foundViaSchema.optional(),
    message: z
      .string()
      .trim()
      .min(5, "요청 내용을 5자 이상 입력해주세요")
      .max(4000),
    consent: z.literal(true, {
      errorMap: () => ({ message: "개인정보 수집·이용에 동의해주세요" }),
    }),
    website: z.string().max(0),
    idempotencyKey: z.string().uuid(),
    attribution: z.object({
      landingPath: z.string().max(500).default("/"),
      submitPath: z.string().max(500),
      referrer: z.string().max(500).default(""),
      utm: utmSchema.default({}),
      sessionUid: z.string().uuid().optional(),
      firstTouch: z
        .object({
          utm: utmSchema,
          landingPath: z.string().startsWith("/").max(500),
          date: z.string().datetime(),
        })
        .optional(),
      clickIds: z
        .object({
          gclid: z
            .string()
            .regex(/^[A-Za-z0-9_.~%|=:-]{1,1000}$/)
            .optional(),
          fbclid: z
            .string()
            .regex(/^[A-Za-z0-9_.~%|=:-]{1,1000}$/)
            .optional(),
          NaPm: z
            .string()
            .regex(/^[A-Za-z0-9_.~%|=:-]{1,1000}$/)
            .optional(),
        })
        .optional(),
    }),
  })
  .superRefine((v, ctx) => {
    if (!v.email && !v.phone)
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "이메일 또는 전화번호를 입력해주세요",
      });
    if (!services.some((s) => s.division === v.division && s.id === v.service))
      ctx.addIssue({
        code: "custom",
        path: ["service"],
        message: "해당 분야의 서비스를 선택해주세요",
      });
  });
// Historical envelopes use contactSchema. New requests use independent content
// signals, so deleting/changing formId or submitPath cannot exempt video inquiries.
export function contactRequestSchema(fromContentPage = false) {
  return contactSchema.superRefine((value, ctx) => {
    if (value.purpose === "unknown")
      ctx.addIssue({ code: "custom", path: ["purpose"], message: "사용 목적을 다시 골라주세요" });
    const contentService =
      value.division === "video" &&
      services.some(
        (service) =>
          service.division === "video" && service.id === value.service,
      );
    if (value.formId === "content_contact" && !contentService)
      ctx.addIssue({
        code: "custom",
        path: ["formId"],
        message: "문의 폼과 서비스 분야를 확인해주세요",
      });
    if (
      (fromContentPage ||
        value.formId === "content_contact" ||
        value.division === "video") &&
      !value.purpose
    )
      ctx.addIssue({
        code: "custom",
        path: ["purpose"],
        message: "사용 목적을 골라주세요",
      });
  });
}
export const trackedContactSchema = contactRequestSchema();
export const entrySchema = z
  .object({
    id: z.string().uuid().optional(),
    type: z.enum(["reference", "insight"]),
    division: divisionSchema,
    service: z.string().max(50),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    title: z.string().trim().min(2).max(150),
    summary: z.string().trim().max(400),
    body: z.string().trim().max(30000),
    cover_url: z.string().max(1500),
    video_url: z.string().max(1500).default(""),
    kind: z.enum(["case", "example"]).default("example"),
    rights_confirmed: z.boolean().default(false),
    is_published: z.boolean().default(false),
    is_featured: z.boolean().default(false),
    display_order: z.number().int().min(0).max(9999).default(0),
  })
  .superRefine((v, ctx) => {
    if (!services.some((s) => s.division === v.division && s.id === v.service))
      ctx.addIssue({
        code: "custom",
        path: ["service"],
        message: "분야와 서비스가 맞지 않습니다",
      });
    if (v.is_published && !v.rights_confirmed)
      ctx.addIssue({
        code: "custom",
        path: ["rights_confirmed"],
        message: "공개 권리와 내용의 사실을 확인해주세요",
      });
    for (const field of ["cover_url", "video_url"] as const) {
      const url = v[field];
      if (
        url &&
        !(field === "cover_url" ? isSafeImageUrl(url) : isSafeMediaUrl(url))
      )
        ctx.addIssue({
          code: "custom",
          path: [field],
          message:
            field === "cover_url"
              ? "대표 이미지는 사이트 이미지 또는 연결된 저장소의 공개 이미지 주소를 입력해주세요"
              : "허용된 HTTPS 컨텐츠 주소가 필요합니다",
        });
    }
  });
export function isSafeImageUrl(url: string) {
  if (
    /^\/service-detail-v(?:14|15)\/(?:[\w-]+\/)*[\w.-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(url) &&
    !url.includes("..")
  ) return true;
  if (
    /^\/(renewal|portfolio|images)\/[\w./-]+$/.test(url) &&
    !url.includes("..")
  )
    return true;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      u.hostname === "rohodabwnabpqkxgxbft.supabase.co" &&
      u.pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    return false;
  }
}
export function isSafeMediaUrl(url: string) {
  if (
    /^\/service-detail-v(?:14|15)\/(?:[\w-]+\/)*[\w.-]+\.(?:mp4|webm)$/i.test(url) &&
    !url.includes("..")
  ) return true;
  if (isSafeImageUrl(url)) return true;
  try {
    const u = new URL(url);
    return (
      u.protocol === "https:" &&
      !u.username &&
      !u.password &&
      ["www.youtube.com", "youtu.be", "vimeo.com", "player.vimeo.com"].includes(
        u.hostname,
      )
    );
  } catch {
    return false;
  }
}

export type ServiceCaseEntryDraft = z.infer<typeof entrySchema>;
export type ExistingServiceCaseEntry = { id: string; body: string; slug: string };
export class ServiceCaseConflictError extends Error {}

/** Pure validation is shared by the admin API and local fixtures; it never queries a database. */
export function validateServiceCaseEntry(
  entry: ServiceCaseEntryDraft,
  existingEntries: ExistingServiceCaseEntry[] = [],
  seedCases: ServiceCase[] = [],
): { record: ServiceCase | null; previous: ServiceCase | null; body: string } {
  if (!entry.body.startsWith(CASE_BODY_PREFIX)) {
    return { record: null, previous: null, body: entry.body };
  }
  if (entry.type !== "reference" || entry.division !== "video") {
    throw new Error("서비스 제작 사례는 콘텐츠 분야의 레퍼런스에서 작성해주세요");
  }
  if (entry.is_published && !entry.rights_confirmed) {
    throw new Error("공개 권리와 내용의 사실을 확인해주세요");
  }
  let raw: Record<string, unknown>;
  try {
    const decoded: unknown = JSON.parse(entry.body.slice(CASE_BODY_PREFIX.length));
    if (!decoded || typeof decoded !== "object" || Array.isArray(decoded)) throw new Error();
    raw = decoded as Record<string, unknown>;
  } catch {
    throw new Error("서비스 사례 내용을 읽을 수 없습니다 보존된 본문을 복구한 뒤 저장해주세요");
  }
  if (entry.is_published && !["ready", "published"].includes(String(raw.publication))) {
    throw new Error("공개 준비 상태를 '공개 준비 완료'로 바꾼 뒤 게시해주세요");
  }
  const candidate = {
    ...raw,
    title: entry.title,
    slug: entry.slug,
    summary: entry.summary || raw.scope,
    order: entry.display_order,
    publication: entry.is_published ? "published" : raw.publication === "published" ? "ready" : raw.publication,
    services: Array.isArray(raw.services) ? raw.services.map((service) => {
      if (!service || typeof service !== "object") return service;
      return { ...service, description: service.description || raw.scope };
    }) : raw.services,
    assets: Array.isArray(raw.assets) ? raw.assets.map((asset) => {
      if (!asset || typeof asset !== "object") return asset;
      return { ...asset, alt: asset.alt || entry.title };
    }) : raw.assets,
  };
  const parsed = serviceCaseSchema.safeParse(candidate);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(`서비스 사례의 ${issue.path.join(" · ") || "내용"}을 확인해주세요: ${issue.message}`);
  }
  const record = parsed.data;
  if (!record.services.some((service) => service.id === entry.service)) {
    throw new Error("상단의 서비스가 관련 서비스에 연결되어 있는지 확인해주세요");
  }
  for (const asset of record.assets) {
    if (asset.kind === "video" ? !isSafeMediaUrl(asset.src) || !/\.(?:mp4|webm)$/i.test(asset.src) : !isSafeImageUrl(asset.src)) {
      throw new Error("결과물은 허용된 사이트 이미지·영상 경로를 사용해주세요");
    }
    if (asset.poster && !isSafeImageUrl(asset.poster)) {
      throw new Error("영상 포스터는 허용된 사이트 이미지 경로를 사용해주세요");
    }
  }
  if (record.stages.some((stage) => stage.asset && !isSafeImageUrl(stage.asset))) {
    throw new Error("과정 자료는 허용된 사이트 이미지 경로를 사용해주세요");
  }
  const previousEntry = entry.id ? existingEntries.find((item) => item.id === entry.id) : undefined;
  const previous = previousEntry ? parseServiceCaseBody(previousEntry.body) : null;
  if (previous && previous.caseId !== record.caseId) {
    throw new ServiceCaseConflictError("저장된 사례ID는 유지해주세요 별도 작업은 새 콘텐츠로 등록할 수 있습니다");
  }
  const canonical = previous ?? seedCases.find((item) => item.caseId === record.caseId);
  if (canonical && record.revision !== canonical.revision) {
    throw new ServiceCaseConflictError("다른 수정이 반영된 사례 버전입니다 최신 내용을 다시 열어 확인해주세요");
  }
  for (const item of existingEntries) {
    if (item.id === entry.id) continue;
    if (!item.body.startsWith(CASE_BODY_PREFIX)) continue;
    const other = parseServiceCaseBody(item.body);
    if (item.slug === record.slug || other?.slug === record.slug) {
      throw new ServiceCaseConflictError("같은 주소의 서비스 사례가 이미 있습니다 기존 사례를 편집하거나 주소를 바꿔주세요");
    }
    if (!other) continue;
    if (other.caseId === record.caseId) {
      throw new ServiceCaseConflictError("같은 사례ID가 이미 등록되어 있습니다 기존 사례를 편집해주세요");
    }
    if (record.sourceWorkIds.some((workId) => other.sourceWorkIds.includes(workId))) {
      throw new ServiceCaseConflictError("같은 기존 작품이 다른 사례에 연결되어 있습니다 기존 사례의 관련 서비스를 확장해주세요");
    }
  }
  for (const other of seedCases) {
    if (other.caseId === record.caseId) continue;
    if (other.slug === record.slug) {
      throw new ServiceCaseConflictError("기존 정본 사례와 주소가 같습니다 정본 사례를 불러오거나 다른 주소를 입력해주세요");
    }
    if (record.sourceWorkIds.some((workId) => other.sourceWorkIds.includes(workId))) {
      throw new ServiceCaseConflictError("기존 정본 작품에 연결된 작업ID입니다 같은 정본 사례를 불러와 보완해주세요");
    }
  }
  const normalized = {
    ...record,
    revision: canonical ? canonical.revision + 1 : record.revision,
    featuredFor: canonical ? record.featuredFor : [],
  };
  return { record: normalized, previous, body: encodeServiceCaseBody(normalized) };
}
export const inquiryStatuses = [
  "new",
  "replied",
  "draft",
  "contracted",
  "archived",
  "rejected",
] as const;
export const statusLabels: Record<string, string> = {
  new: "신규",
  replied: "상담중",
  draft: "견적 준비",
  contracted: "계약",
  archived: "보류",
  rejected: "종료",
  sent: "견적 발송",
  viewed: "견적 확인",
  matched: "연결",
};
export const inquiryUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(inquiryStatuses),
  note: z.string().trim().max(4000).default(""),
});
export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
