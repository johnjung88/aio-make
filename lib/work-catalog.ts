import type { Entry } from "./db";
import { divisions, services, type DivisionId } from "./content.ts";
import { generatedWorks } from "./generated/works.generated.ts";
import type { WorkMedia } from "./work-schema.ts";
export type { WorkMedia } from "./work-schema.ts";

export type WorkItem = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  primaryService: string;
  relatedServices: { division: DivisionId; id: string }[];
  division: DivisionId;
  canonicalPath: string;
  description: string;
  purpose: string;
  scope: string;
  media: WorkMedia[];
  productionStatus: "제작 예시" | "제작 후보" | "제작 완료" | "운영 중";
  visibility: "public" | "review";
  rightsConfirmed: boolean;
  order: number;
};

// Rights and review visibility both gate customer publication.
const unfeaturedOrder =
  Math.max(-1, ...generatedWorks.map((work) => work.featuredOrder ?? -1)) + 1;
const registeredWorks: WorkItem[] = generatedWorks.map((work, index) => ({
  ...work,
  canonicalPath: `/work/${work.slug}`,
  order: (work.featuredOrder ?? unfeaturedOrder + index) * 10,
  visibility:
    work.visibility === "public" && work.rightsConfirmed ? "public" : "review",
}));
export const reviewWorks = registeredWorks.filter(
  (work) => work.visibility === "review" || !work.rightsConfirmed,
);
export const publicWorks = registeredWorks.filter(
  (work) => work.visibility === "public" && work.rightsConfirmed,
);

// Only the explicit local review build includes customer work pending release.
// Search feeds always use publicWorkCatalog, never this display helper.
export const localReferenceReview =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1";
export function displayWorkCatalog(entries: Entry[]): WorkItem[] {
  const published = publicWorkCatalog(entries);
  return (
    localReferenceReview ? [...reviewWorks, ...published] : published
  ).sort(
    (a, b) =>
      Number(a.productionStatus === "제작 예시") -
        Number(b.productionStatus === "제작 예시") ||
      a.order - b.order ||
      a.id.localeCompare(b.id),
  );
}

export function workFromEntry(entry: Entry): WorkItem {
  const division = divisions.find((value) => value.id === entry.division);
  if (!division) throw new Error(`Unknown work division: ${entry.division}`);
  const service = services.find(
    (value) => value.id === entry.service && value.division === entry.division,
  );
  return {
    id: entry.id,
    slug: entry.slug,
    brand: entry.kind === "example" ? "AIO MAKE" : entry.title,
    title: entry.title,
    primaryService: entry.service,
    relatedServices: [],
    division: division.id,
    canonicalPath: `/${division.path}/work/${entry.slug}`,
    description: entry.summary,
    purpose: entry.summary,
    scope: service?.description ?? entry.summary,
    media: entry.cover_url
      ? [
          {
            kind: "image",
            src: entry.cover_url,
            alt: `${entry.title} 대표 이미지`,
          },
        ]
      : [],
    productionStatus: entry.kind === "example" ? "제작 예시" : "제작 완료",
    visibility:
      entry.is_published && entry.rights_confirmed ? "public" : "review",
    rightsConfirmed: entry.rights_confirmed,
    order: entry.display_order,
  };
}

export function publicWorkCatalog(entries: Entry[]): WorkItem[] {
  const catalog = entries.map(workFromEntry).concat(registeredWorks);
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const work of catalog) {
    if (ids.has(work.id) || paths.has(work.canonicalPath))
      throw new Error(`Duplicate work ID or URL: ${work.id}`);
    if (
      work.visibility === "public" &&
      work.id.startsWith("AIO-WORK-") &&
      (!work.rightsConfirmed ||
        work.media.length === 0 ||
        work.productionStatus === "제작 후보" ||
        work.media.some(
          (media) =>
            !media.alt ||
            !media.src.startsWith("/") ||
            (media.kind === "video" && !media.poster),
        ))
    ) {
      throw new Error(
        `Public work requires verified media and a completed status: ${work.id}`,
      );
    }
    ids.add(work.id);
    paths.add(work.canonicalPath);
  }
  return catalog
    .filter((work) => work.visibility === "public" && work.rightsConfirmed)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function workMatchesService(
  work: WorkItem,
  service: string,
  division?: string,
) {
  return (
    (work.primaryService === service &&
      (!division || work.division === division)) ||
    work.relatedServices.some(
      (item) =>
        item.id === service && (!division || item.division === division),
    )
  );
}
