// Client-safe work card. It imports only the WorkItem type from the work
// catalog, so client components (home-references.tsx) can render server-
// selected works without bundling the catalog module or its customer data.
import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content";
import type { WorkItem } from "@/lib/work-catalog";

export function WorkCard({
  work,
  heading: Heading = "h2",
}: {
  work: WorkItem;
  heading?: "h2" | "h3";
}) {
  const cover = work.media[0];
  const label =
    services.find(
      (service) =>
        service.id === work.primaryService &&
        service.division === work.division,
    )?.name ?? "작업";
  return (
    <Link className="work-card" href={work.canonicalPath}>
      <div
        className={`work-card-media work-media-${cover?.presentation ?? "wide"}`}
      >
        {cover?.presentation === "site" && (
          <span className="work-browser-bar" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
        {cover?.src ? (
          <picture className="work-card-picture">
            {cover.mobileSrc && (
              <source media="(max-width: 767px)" srcSet={cover.mobileSrc} />
            )}
            <Image
              src={
                cover.kind === "video" ? (cover.poster ?? cover.src) : cover.src
              }
              alt={cover.alt}
              fill
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </picture>
        ) : (
          <span className="work-card-placeholder">{work.brand}</span>
        )}
        {cover?.kind === "video" && (
          <span className="work-card-play" aria-hidden="true">
            ▶
          </span>
        )}
        <span className="work-card-open" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="work-card-meta">
        <span>{label}</span>
        <span>{work.productionStatus}</span>
      </div>
      <Heading>
        <span>{work.brand}</span>
        <strong>{work.title}</strong>
      </Heading>
      <p className="t-body">{work.description}</p>
    </Link>
  );
}
