/* R8 approved included, separate and preparation lists, centered below pricing. */
import { CS_COPY } from "@/lib/content-site/copy";
import type { ServiceLandingData } from "@/lib/content-site/types";



export function CsScopeText({ scope }: { scope: ServiceLandingData["scope"] }) {
  const c = CS_COPY.scope;
  const keep = (items: string[]) => items;
  const columns = (
    [
      ["included", c.included, keep(scope.included)],
      ["separate", c.separate, keep(scope.separate)],
    ] as const
  ).filter(([, , items]) => items.length > 0);
  const prepare = keep(scope.prepare);
  if (columns.length === 0 && prepare.length === 0) return null;
  return (
    <div className="cs-scope-grid">
      {columns.map(([key, title, items]) => (
        <div key={key} className="cs-scope-col">
          <h3 className="cs-t-label" id={`cs-scope-${key}`}>
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
      {prepare.length > 0 ? (
        <div className="cs-scope-col cs-scope-col--wide">
          <h3 className="cs-t-label" id="cs-scope-prepare">
            {c.prepare}
          </h3>
          <p className="cs-scope-prepare cs-t-body">{prepare.join(", ")}</p>
        </div>
      ) : null}
    </div>
  );
}
