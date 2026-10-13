/* types 섹션(무엇을 만드는지): 3열 카드(장식 번호 + h3 + small). 바탕 --cs-bg. */
import type { ServiceLandingData } from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

export function CsTypes({ types }: { types: ServiceLandingData["types"] }) {
  return (
    <section
      className="cs-section"
      data-cs-section="types"
      aria-labelledby="cs-types-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-types-title"
          eyebrow={types.eyebrow}
          title={types.title}
          lead={types.lead}
        />
        <ul className="cs-types-grid">
          {types.items.map((item, i) => (
            <li key={item.title} className="cs-type-card" data-reveal>
              <span className="cs-t-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="cs-t-h3">{item.title}</h3>
              <p className="cs-t-small">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
