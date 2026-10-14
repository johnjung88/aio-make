/* 포함·별도 범위: 가격 블록(CsPricing) 아래의 2열 텍스트 목록(박스 없음). 별도 섹션이 아니다(R6).
 * 같은 사실은 한 번만 쓰므로 진행 방식·FAQ가 맡는 문장(수정 횟수, 대량·정기 제작)은 목록에서 거른다.
 * 서비스 데이터에서 그 항목이 지워지면 이 필터는 아무 일도 하지 않는다. */
import { CS_COPY } from "@/lib/content-site/copy";
import type { ServiceLandingData } from "@/lib/content-site/types";

/** 진행 방식(수정 2회·1회)과 FAQ(대량·정기 제작)에 이미 있는 문장 */
const DUPLICATE_FACT = /수정\s*\d회|대량·정기/;

export function CsScopeText({ scope }: { scope: ServiceLandingData["scope"] }) {
  const c = CS_COPY.scope;
  const keep = (items: string[]) => items.filter((item) => !DUPLICATE_FACT.test(item));
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
