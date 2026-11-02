// Server-only selection for the /marketing and /lab reference grid
// (components/guide/home-references.tsx). Same pattern as home-journey-data.ts:
// the work catalog (and its review-only customer works, added only for the
// exact NEXT_PUBLIC_AIO_REFERENCE_REVIEW="1" flag) is read here on the server.
// The client component receives the selected works as props and never imports
// the catalog module.
import "server-only";
import type { Entry } from "./db";
import type { DivisionId } from "./content.ts";
import { mergeGuideEntries } from "./guide-content.ts";
import { displayWorkCatalog, type WorkItem } from "./work-catalog.ts";

export const FIXED_DIVISION_LIMIT = 4;

// With a fixed division the grid shows that division's first four works, so
// only those leave the server. Without one, the client filter needs the list.
export function homeReferenceWorks(
  entries: Entry[] = [],
  division?: DivisionId,
): WorkItem[] {
  const available = displayWorkCatalog(
    mergeGuideEntries(entries, "reference", division),
  );
  return division
    ? available
        .filter((work) => work.division === division)
        .slice(0, FIXED_DIVISION_LIMIT)
    : available;
}
