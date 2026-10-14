/* 제작 과정 4행 표(서버). 박스 없이 번호·단계 | 확인하는 것 | 받는 것 세 칸이며 구분은 위 가는 선만 쓴다.
 * 모바일에서는 같은 순서로 세로로 쌓는다. 문장은 데이터의 check 배열을 한 문장씩 줄로 나눠 그린다. */
import {
  contentHomeProcess as steps,
  contentHomeProcessHead as head,
} from "@/lib/content-home";

export function ProcessSteps() {
  return (
    <ol className="ch-steps" data-count={steps.length}>
      {steps.map((step, index) => (
        <li key={step.label} className="ch-step">
          <h3 className="ch-step-name cs-t-h3">
            <span className="ch-step-num cs-t-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step.label}
          </h3>
          <div className="ch-step-check">
            <p className="ch-step-label cs-t-label">{head.checkLabel}</p>
            {step.check.map((sentence) => (
              <p key={sentence} className="cs-t-body">
                {sentence}
              </p>
            ))}
          </div>
          <div className="ch-step-output">
            <p className="ch-step-label cs-t-label">{head.outputLabel}</p>
            <p className="cs-t-body">{step.output}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
