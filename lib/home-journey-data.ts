// Server-only selection for the main page journey (01 개발 · 03 컨텐츠).
// The company main development step uses one explicitly authorized case from
// home-main-approved.ts. All other customer catalog selection below keeps its
// exact NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1" gate. Client components receive
// plain props and never import this module.
import "server-only";
import { companyMainDevProject } from "./home-main-approved.ts";
import type { Entry } from "./db";
import { mergeGuideEntries } from "./guide-content.ts";
import {
  displayWorkCatalog,
  workMatchesService,
  type WorkItem,
} from "./work-catalog.ts";
import {
  contentTabs,
  fallbackContentSelection,
  toJourneyMedia,
  type BeforeShot,
  type ContentSelection,
  type ContentTab,
  type ContentTabId,
  type DevProject,
  type DevProjectConfig,
  type HomeJourneyData,
} from "./home-journey.ts";

// R7: one development case only (DR's Secret). Other review works stay in the
// catalog and on /work, but never enter the main page development step.
export const devProjectConfig: DevProjectConfig | null =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? { slug: "bwl-store", label: "DR's Secret 쇼핑몰" }
    : null;

// Real captures only (cropped from the customer folder, no retouching).
export const beforeShots: Record<string, BeforeShot> =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? {
        "bwl-store": {
          pc: {
            kind: "image",
            src: "/reference-review/bwl-store/before-pc.webp",
            width: 1440,
            height: 900,
            alt: "기존 쇼핑몰 첫 화면 PC 캡처",
          },
          mobile: {
            kind: "image",
            src: "/reference-review/bwl-store/before-mobile.webp",
            width: 390,
            height: 844,
            alt: "기존 쇼핑몰 첫 화면 모바일 캡처",
          },
        },
      }
    : {};

export const contentReviewSlugs: Partial<Record<ContentTabId, string>> =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? {
        webtoon: "yofree-outing-webtoon",
        animation: "yofree-outing-motion",
        "ai-influencer": "bwl-aqua-ad",
        "motion-graphics": "bwl-brand-motion",
        "brand-film": "healernet-motion",
        ad: "yofree-mg-short",
      }
    : {};

// FACTS_AI_INFLUENCER.md: the three proposal drafts featuring 87언니.
export const aiInfluencerDraft =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? {
        slugs: ["bwl-aqua-ad", "bwl-cplus-ad", "bwl-cleanser-ad"],
        caption: "87언니(AI 가상인물) 출연 · 제안용 시안",
      }
    : { slugs: [] as string[], caption: "" };

// The case is shown only when it exists in the displayed catalog.
export function selectDevProject(catalog: WorkItem[]): DevProject | null {
  const config = devProjectConfig;
  if (!config) return null;
  const work = catalog.find((item) => item.slug === config.slug);
  const first = work?.media[0];
  if (!work || !first) return null;
  return {
    title: config.label,
    detail: {
      title: work.title,
      status: work.productionStatus,
      description: work.description,
      purpose: work.purpose,
      scope: work.scope,
    },
    after: toJourneyMedia(first),
    afterMobile: first.mobileSrc
      ? {
          kind: "image",
          src: first.mobileSrc,
          width: 390,
          height: 844,
          alt: first.alt.replace("PC 화면", "모바일 화면"),
        }
      : null,
    before: beforeShots[config.slug] ?? null,
  };
}

export function selectContentMedia(
  tab: ContentTab,
  catalog: WorkItem[],
): ContentSelection {
  const preferred = contentReviewSlugs[tab.id];
  const work =
    (preferred && catalog.find((item) => item.slug === preferred)) ||
    catalog.find((item) => workMatchesService(item, tab.id, "video")) ||
    null;
  const first = work?.media[0];
  if (!work || !first) return fallbackContentSelection(tab);
  const caption = aiInfluencerDraft.slugs.includes(work.slug)
    ? aiInfluencerDraft.caption
    : `${work.brand} · ${work.title}`;
  return {
    tab,
    work,
    media: toJourneyMedia(first),
    caption,
    tag: work.productionStatus,
  };
}

// displayWorkCatalog adds review works only for the exact "1" flag.
export function homeJourneyData(entries: Entry[] = []): HomeJourneyData {
  const catalog = displayWorkCatalog(mergeGuideEntries(entries, "reference"));
  return {
    devProject: companyMainDevProject,
    contentSelections: contentTabs.map((tab) =>
      selectContentMedia(tab, catalog),
    ),
  };
}
