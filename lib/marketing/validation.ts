import { z } from "zod";
const text = (max: number) => z.string().trim().min(1).max(max);
export const quoteSchema = z
  .object({
    locale: z.literal("ko"),
    category: z.literal("marketing"),
    idempotencyKey: z.string().uuid(),
    company: text(150),
    name: text(100),
    email: z.string().trim().email().max(254),
    phone: text(30),
    industry: text(100),
    region: text(150),
    description: text(5000),
    channels: z.string().max(1000).default(""),
    goal: z.string().max(1000).default(""),
    budget_range: z.string().max(100).default("미정"),
    timeline: z.string().max(100).default("미정"),
    reference_links: z.string().max(2000).default(""),
    consent_privacy: z.literal(true),
    consent_version: text(80),
    attribution: z
      .object({
        entry_path: z.string().max(1000),
        referrer: z.string().max(1000),
        utm_source: z.string().max(200),
        utm_medium: z.string().max(200),
        utm_campaign: z.string().max(200),
        utm_content: z.string().max(200),
        content_id: z.string().max(200),
        reference_case: z.string().max(200),
      })
      .strict(),
  })
  .strict();
export const statuses = [
  "new",
  "reviewing",
  "awaiting_info",
  "proposed",
  "contracted",
  "on_hold",
  "closed",
] as const;
export const statusLabels: Record<string, string> = {
  new: "신규",
  reviewing: "확인 중",
  awaiting_info: "추가정보 대기",
  proposed: "견적 제안",
  contracted: "계약",
  on_hold: "보류",
  closed: "종료",
};
