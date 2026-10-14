/* 진행 방식 블록. 박스 없는 텍스트 4행: 번호 · 단계 · 한 줄 설명 · '함께 확인' 한 줄.
 * 단계 번호는 렌더 시 01부터 만든다(데이터에 숫자 없음). 수정 횟수는 단계의 check와 FAQ에만 둔다. 읽기 폭(880) 컨테이너. */
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
      <div className="cs-container cs-container--read">
        <CsSectionHead
          id="cs-process-title"
          eyebrow={CS_COPY.process.eyebrow}
          title={process.title}
          lead={process.lead}
        />
        <ol className="cs-steps" data-count={process.steps.length}>
          {process.steps.map((step, i) => (
            <li key={step.title} className="cs-step">
              <span className="cs-t-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="cs-t-h3">{step.title}</h3>
              <p className="cs-step-body cs-t-small">{step.body}</p>
              <p className="cs-step-check">
                <span className="cs-t-label">{CS_COPY.process.check}</span>
                <span className="cs-t-small">{step.check}</span>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
