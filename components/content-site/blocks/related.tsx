/* 관련 서비스(바탕 --cs-bg-2): 현재 서비스를 뺀 5개를 한 줄 카드(라벨 + 시작가 head)로. */
import Link from "next/link";
import { startingPrice } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import {
  CONTENT_SERVICES,
  contentServicePath,
  type ContentServiceId,
} from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

export function CsRelated({ current }: { current: ContentServiceId }) {
  return (
    <section
      className="cs-section cs-section--sm cs-section--alt"
      data-cs-section="related"
      aria-labelledby="cs-related-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-related-title"
          eyebrow={CS_COPY.related.eyebrow}
          title={CS_COPY.related.title}
        />
        <ul className="cs-related-list">
          {CONTENT_SERVICES.filter((s) => s.id !== current).map((s) => {
            const price = startingPrice(s.id, true);
            return (
              <li key={s.id}>
                <Link href={contentServicePath(s.id)} className="cs-related-card">
                  <span className="cs-t-h3">{s.label}</span>
                  {price ? <span className="cs-t-small">{price.head}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
