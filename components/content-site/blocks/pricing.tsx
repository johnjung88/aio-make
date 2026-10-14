/* 가격 블록(id="pricing"). 금액은 lib/content-pricing.ts에서만 온다(SHOW_STARTING_PRICE와 관계없이 항상 표시).
 * R6: 플랜 박스(`라벨 / 금액` 2줄, 왼쪽 정렬)만 틀을 쓴다. 부가세 별도는 그룹 아래 주석 한 줄로 한 번만 쓰고,
 * 수정 횟수·대량 제작 문구는 여기 두지 않는다(진행 방식·FAQ가 맡는다).
 * 포함·별도 범위는 같은 섹션 아래 2열 텍스트(CsScopeText)로 보여준다. */
import {
  PRICING_COMMON,
  formatWon,
  pricingPlans,
} from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import type {
  ContentServiceId,
  ServiceLandingData,
} from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";
import { CsScopeText } from "./scope";

export function CsPricing({
  id,
  scope,
}: {
  id: ContentServiceId;
  scope?: ServiceLandingData["scope"];
}) {
  const { groups, notes } = pricingPlans(id);
  const c = CS_COPY.pricing;
  return (
    <section
      id="pricing"
      className="cs-section"
      data-cs-section="pricing"
      aria-labelledby="cs-pricing-title"
    >
      <div className="cs-container">
        <CsSectionHead id="cs-pricing-title" eyebrow={c.eyebrow} title={c.title} />
        <div className="cs-pricing-groups">
          {groups.map((group) => (
            <div key={group.key} className="cs-pricing-group">
              {group.title ? (
                <p
                  className={"cs-t-label" + (group.bundle ? " cs-pricing-badge cs-t-caption" : "")}
                  id={`cs-pricing-${group.key}`}
                >
                  {group.title}
                </p>
              ) : null}
              <ul
                className="cs-pricing-grid"
                data-count={Math.min(group.plans.length, 4)}
                aria-labelledby={group.title ? `cs-pricing-${group.key}` : undefined}
              >
                {group.plans.map((plan) => (
                  /* 묶음(함께 제작) 그룹은 배지를 그룹 제목에 두고, 박스는 모두 같은 구조(라벨/금액)로 둔다 */
                  <li
                    key={plan.key}
                    className={"cs-plan" + (plan.bundle ? " cs-plan--bundle" : "")}
                  >
                    <h3 className="cs-t-label">{plan.label}</h3>
                    <p className="cs-plan-amount">
                      <span className="cs-t-price">{formatWon(plan.amount)}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ul className="cs-pricing-notes">
          {[PRICING_COMMON.vat, ...notes].map((line) => (
            <li key={line} className="cs-t-small">
              {line}
            </li>
          ))}
        </ul>
        {scope ? <CsScopeText scope={scope} /> : null}
      </div>
    </section>
  );
}
