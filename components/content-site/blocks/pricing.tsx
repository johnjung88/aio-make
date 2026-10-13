/* 가격 블록(id="pricing", 바탕 --cs-bg-2). 금액은 lib/content-pricing.ts에서만 온다(SHOW_STARTING_PRICE와 관계없이 항상 표시).
 * 카드 = 플랜 라벨(h3) · 금액(cs-t-price) + 부가세 별도 · 이 구성으로 상담(a[data-plan] → CsInquiry가 받는다). */
import {
  PRICING_COMMON_LINES,
  formatWon,
  pricingPlans,
} from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import type { ContentServiceId } from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

export function CsPricing({ id }: { id: ContentServiceId }) {
  const { groups, notes } = pricingPlans(id);
  const c = CS_COPY.pricing;
  return (
    <section
      id="pricing"
      className="cs-section cs-section--alt"
      data-cs-section="pricing"
      aria-labelledby="cs-pricing-title"
    >
      <div className="cs-container">
        <CsSectionHead id="cs-pricing-title" eyebrow={c.eyebrow} title={c.title} />
        <div className="cs-pricing-groups">
          {groups.map((group) => (
            <div key={group.key} className="cs-pricing-group">
              {group.title ? (
                <p className="cs-t-label" id={`cs-pricing-${group.key}`}>
                  {group.title}
                </p>
              ) : null}
              <ul
                className="cs-pricing-grid"
                data-count={Math.min(group.plans.length, 4)}
                aria-labelledby={group.title ? `cs-pricing-${group.key}` : undefined}
              >
                {group.plans.map((plan) => (
                  <li
                    key={plan.key}
                    className={"cs-plan" + (plan.bundle ? " cs-plan--bundle" : "")}
                  >
                    {plan.bundle ? (
                      <span className="cs-plan-badge cs-t-caption">{c.bundle}</span>
                    ) : null}
                    <h3 className="cs-t-h3">{plan.label}</h3>
                    <p className="cs-plan-amount">
                      <span className="cs-t-price">{formatWon(plan.amount)}</span>
                      <span className="cs-t-small">{c.vat}</span>
                    </p>
                    <a href="#inquiry" className="cs-link" data-plan={plan.key}>
                      {c.cta} <span aria-hidden="true">↓</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ul className="cs-pricing-notes">
          {[...PRICING_COMMON_LINES, ...notes].map((line) => (
            <li key={line} className="cs-t-small">
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
