/* 과정 블록(바탕 --cs-bg). 단계 번호는 렌더 시 01부터 만든다(데이터에 숫자 없음).
 * check = '함께 확인'(cs-t-label) + 한 줄. 아래에 수정 기준 한 줄(PRICING_COMMON). */
import { PRICING_COMMON } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import type { ServiceLandingData } from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

export function CsProcess({
  process,
}: {
  process: ServiceLandingData["process"];
}) {
  return (
    <section
      className="cs-section"
      data-cs-section="process"
      aria-labelledby="cs-process-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-process-title"
          eyebrow={CS_COPY.process.eyebrow}
          title={process.title}
          lead={process.lead}
        />
        <ol className="cs-steps" data-count={process.steps.length}>
          {process.steps.map((step, i) => (
            <li key={step.title} className="cs-step" data-reveal>
              <span className="cs-t-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="cs-t-h3">{step.title}</h3>
              <p className="cs-t-small">{step.body}</p>
              <p className="cs-step-check">
                <span className="cs-t-label">{CS_COPY.process.check}</span>
                <span className="cs-t-small">{step.check}</span>
              </p>
            </li>
          ))}
        </ol>
        <p className="cs-process-note cs-t-small">{PRICING_COMMON.revisions}</p>
      </div>
    </section>
  );
}
