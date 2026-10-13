/* 시작가 칩: head(cs-t-price-sm) · 나머지 단위(cs-t-small). 줄바꿈은 ' · ' 단위 사이에서만.
 * 단위 사이 '·'는 CSS가 그린다(.cs-price-unit + .cs-price-unit::before). */
import { startingPrice } from "@/lib/content-pricing";
import type { ContentServiceId } from "@/lib/content-site/types";

export function CsPrice({ id }: { id: ContentServiceId }) {
  const price = startingPrice(id, true);
  if (!price) return null;
  return (
    <p className="cs-price">
      <span className="cs-price-unit cs-t-price-sm">{price.head}</span>
      {price.rest.map((unit) => (
        <span key={unit} className="cs-price-unit cs-t-small">
          {unit}
        </span>
      ))}
    </p>
  );
}
