/* 범위 블록(id="scope", 바탕 --cs-bg): 기본 포함 / 별도 상담 / 준비하면 좋은 자료 3열. */
import { CS_COPY } from "@/lib/content-site/copy";
import type { ServiceLandingData } from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

export function CsScope({ scope }: { scope: ServiceLandingData["scope"] }) {
  const c = CS_COPY.scope;
  const columns = [
    ["included", c.included, scope.included],
    ["separate", c.separate, scope.separate],
    ["prepare", c.prepare, scope.prepare],
  ] as const;
  return (
    <section
      id="scope"
      className="cs-section"
      data-cs-section="scope"
      aria-labelledby="cs-scope-title"
    >
      <div className="cs-container">
        <CsSectionHead id="cs-scope-title" eyebrow={c.eyebrow} title={c.title} />
        <div className="cs-scope-grid">
          {columns.map(([key, title, items]) => (
            <div key={key} className="cs-scope-col">
              <h3 className="cs-t-h3" id={`cs-scope-${key}`}>
                {title}
              </h3>
              <ul className="cs-scope-list" aria-labelledby={`cs-scope-${key}`}>
                {items.map((item) => (
                  <li key={item} className="cs-t-body">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
