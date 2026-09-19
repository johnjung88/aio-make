import { z } from "zod";
import { marketing } from "@/lib/marketing/content";
const copy = z.string().trim().min(1).max(3000);
export const contentSchemas = {
  home: z.object({ title: copy, description: copy }).strict(),
  marketing: z
    .array(z.object({ title: copy, tag: copy, text: copy }).strict())
    .min(1)
    .max(6),
  pricing: z
    .array(
      z
        .object({
          order: copy,
          amount: z.string().regex(/^\d+(?:\.\d+)?$/),
          guarantee: copy,
        })
        .strict(),
    )
    .min(1)
    .max(10),
  projects: z
    .array(z.object({ name: copy, kind: copy, text: copy }).strict())
    .max(12),
  resources: z
    .array(
      z
        .object({
          slug: z.enum(["marketing-checklist", "consultation-prep"]),
          title: copy,
          text: copy,
        })
        .strict(),
    )
    .max(2),
};
export const defaults = {
  home: { title: marketing.title, description: marketing.description },
  marketing: marketing.services,
  pricing: marketing.prices,
  projects: marketing.projects,
  resources: [
    {
      slug: "marketing-checklist",
      title: "마케팅 운영 점검표",
      text: "재방문 준비·콘텐츠·유입 측정의 현재 상태를 확인하세요.",
    },
    {
      slug: "consultation-prep",
      title: "상담 준비자료",
      text: "매장 정보와 운영 채널, 목표를 미리 정리해 보세요.",
    },
  ],
};
export type ContentSlug = keyof typeof defaults;
