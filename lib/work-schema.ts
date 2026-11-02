import { z } from "zod";
import { services } from "./content.ts";

const divisionSchema = z.enum(["video", "development", "marketing"]);
const localMediaPath = z
  .string()
  .regex(/^\/(?:[\w-]+\/)*[\w.-]+$/, "사이트 내부 미디어 경로가 필요합니다")
  .refine((path) => !path.includes(".."), "상위 경로는 허용하지 않습니다");
const text = z
  .string()
  .min(1)
  .refine((value) => value.trim().length > 0, "빈 문구는 허용하지 않습니다");

export const workMediaSchema = z
  .object({
    kind: z.enum(["image", "video", "webtoon"]),
    src: localMediaPath,
    alt: text,
    poster: localMediaPath.optional(),
    mobileSrc: localMediaPath.optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    presentation: z
      .enum(["site", "wide", "portrait", "webtoon", "square"])
      .optional(),
    source: text.optional(),
  })
  .strict();

export const workSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(100),
    id: text,
    brand: text,
    title: text,
    division: divisionSchema,
    primaryService: text,
    relatedServices: z.array(
      z.object({ division: divisionSchema, id: text }).strict(),
    ),
    productionStatus: z.enum([
      "제작 예시",
      "제작 후보",
      "제작 완료",
      "운영 중",
    ]),
    visibility: z.enum(["public", "review"]),
    rightsConfirmed: z.boolean(),
    featuredOrder: z.number().int().nonnegative().optional(),
    description: text,
    purpose: text,
    scope: text,
    media: z.array(workMediaSchema).min(1),
  })
  .strict()
  .superRefine((work, ctx) => {
    const issue = (path: (string | number)[], message: string) =>
      ctx.addIssue({ code: "custom", path, message });
    const matches = (division: string, id: string) =>
      services.some(
        (service) => service.division === division && service.id === id,
      );
    if (!matches(work.division, work.primaryService))
      issue(
        ["primaryService"],
        `${work.division}의 서비스가 아닙니다: ${work.primaryService}`,
      );
    work.relatedServices.forEach((service, index) => {
      if (!matches(service.division, service.id))
        issue(
          ["relatedServices", index, "id"],
          `${service.division}의 서비스가 아닙니다: ${service.id}`,
        );
    });
    if (work.purpose.trim() === work.scope.trim())
      issue(["scope"], "purpose와 scope는 서로 달라야 합니다");
    if (work.visibility === "public") {
      if (!work.rightsConfirmed)
        issue(["rightsConfirmed"], "공개 작품은 공개 권리 확인이 필요합니다");
      if (work.productionStatus === "제작 후보")
        issue(["productionStatus"], "제작 후보는 공개할 수 없습니다");
    }
    let page = 0;
    work.media.forEach((media, index) => {
      if (media.kind === "video" && !media.poster?.endsWith(".webp"))
        issue(["media", index, "poster"], "영상은 .webp poster가 필요합니다");
      if (media.kind === "webtoon") {
        page += 1;
        const filename = media.src.split("/").at(-1);
        if (filename !== `gallery-${String(page).padStart(2, "0")}.webp`)
          issue(
            ["media", index, "src"],
            `웹툰은 gallery-${String(page).padStart(2, "0")}.webp 순서여야 합니다`,
          );
      }
    });
  });

export type WorkRecord = z.infer<typeof workSchema>;
export type WorkMedia = z.infer<typeof workMediaSchema>;
