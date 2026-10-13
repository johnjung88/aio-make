// Server-only selection for the main page journey (03 개발 · 04 컨텐츠).
// Customer work data (project labels, before captures, review slugs, the
// 87언니 label) lives only here and only when NEXT_PUBLIC_AIO_REFERENCE_REVIEW
// is exactly "1". Unset or any other value means none of it is selected, so it
// never reaches the server HTML, the RSC payload or a client bundle. Client
// components receive the result as props and never import this module.
import "server-only";
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

export const devProjects: DevProjectConfig[] =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? [
        {
          slug: "bwl-store",
          label: "DR's Secret 쇼핑몰",
          serviceHref: "/lab/services/shopping-mall",
        },
        {
          slug: "healernet-website",
          label: "힐러넷 웹사이트",
          serviceHref: "/lab/services/website",
        },
        {
          slug: "yofree-shop",
          label: "요프리 쇼핑몰",
          serviceHref: "/lab/services/shopping-mall",
        },
      ]
    : [];

// Real captures only (cropped from the customer folder, no retouching).
// yofree-shop has no capture and stays a HOLD placeholder.
export const beforeShots: Record<string, BeforeShot> =
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? {
        "bwl-store": {
          pc: {
            kind: "image",
            src: "/reference-review/bwl-store/before-pc.webp",
            width: 1440,
            height: 900,
            alt: "DR's Secret 기존 공식몰 첫 화면 PC 캡처",
          },
          mobile: {
            kind: "image",
            src: "/reference-review/bwl-store/before-mobile.webp",
            width: 390,
            height: 844,
            alt: "DR's Secret 기존 공식몰 첫 화면 모바일 캡처",
          },
          caption: "기존 공식몰 첫 화면 · 2026-10-10 캡처",
        },
        "healernet-website": {
          pc: {
            kind: "image",
            src: "/reference-review/healernet-website/before-pc.webp",
            width: 1440,
            height: 900,
            alt: "힐러넷 기존 홈페이지 첫 화면 PC 캡처",
          },
          mobile: {
            kind: "image",
            src: "/reference-review/healernet-website/before-mobile.webp",
            width: 390,
            height: 844,
            alt: "힐러넷 기존 홈페이지 첫 화면 모바일 캡처",
          },
          caption: "기존 홈페이지 첫 화면 · 2026-10-10 캡처",
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

// Only projects that exist in the displayed catalog are shown, in config order.
export function selectDevProjects(catalog: WorkItem[]): DevProject[] {
  return devProjects.flatMap((config) => {
    const work = catalog.find((item) => item.slug === config.slug);
    const first = work?.media[0];
    if (!work || !first) return [];
    return [
      {
        config,
        work,
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
      },
    ];
  });
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
    devProjects: selectDevProjects(catalog),
    contentSelections: contentTabs.map((tab) =>
      selectContentMedia(tab, catalog),
    ),
  };
}
