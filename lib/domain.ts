import { z } from "zod";
import { services } from "./content.ts";
export const divisionSchema = z.enum(["marketing", "development", "video"]);
export const contactSchema = z
  .object({
    name: z.string().trim().min(1, "성함을 입력해주세요.").max(100),
    email: z
      .string()
      .trim()
      .email("이메일을 확인해주세요.")
      .max(255)
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(30)
      .refine(
        (v) => !v || /^[+\d\s()-]{6,30}$/.test(v),
        "전화번호를 확인해주세요.",
      ),
    company: z.string().trim().max(150).default(""),
    division: divisionSchema,
    service: z.string().max(50),
    message: z
      .string()
      .trim()
      .min(5, "요청 내용을 5자 이상 입력해주세요.")
      .max(4000),
    consent: z.literal(true, {
      errorMap: () => ({ message: "개인정보 수집·이용에 동의해주세요." }),
    }),
    website: z.string().max(0),
    idempotencyKey: z.string().uuid(),
    attribution: z.object({
      landingPath: z.string().max(500).default("/"),
      submitPath: z.string().max(500),
      referrer: z.string().max(500).default(""),
      utm: z.record(z.string().max(250)).default({}),
      sessionUid: z.string().uuid().optional(),
    }),
  })
  .superRefine((v, ctx) => {
    if (!v.email && !v.phone)
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "이메일 또는 전화번호를 입력해주세요.",
      });
    if (!services.some((s) => s.division === v.division && s.id === v.service))
      ctx.addIssue({
        code: "custom",
        path: ["service"],
        message: "해당 분야의 서비스를 선택해주세요.",
      });
  });
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
        message: "분야와 서비스가 맞지 않습니다.",
      });
    if (v.is_published && !v.rights_confirmed)
      ctx.addIssue({
        code: "custom",
        path: ["rights_confirmed"],
        message: "공개 권리와 내용의 사실을 확인해주세요.",
      });
    for (const field of ["cover_url", "video_url"] as const) {
      const url = v[field];
      if (url && !isSafeMediaUrl(url))
        ctx.addIssue({
          code: "custom",
          path: [field],
          message: "허용된 HTTPS 또는 로컬 이미지 경로가 필요합니다.",
        });
    }
  });
export function isSafeMediaUrl(url: string) {
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
      (/\.supabase\.co$/.test(u.hostname) ||
        [
          "www.youtube.com",
          "youtu.be",
          "vimeo.com",
          "player.vimeo.com",
        ].includes(u.hostname))
    );
  } catch {
    return false;
  }
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
