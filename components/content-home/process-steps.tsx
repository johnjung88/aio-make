/* 제작 과정 4단계(서버, R7). 박스 장식 없이 단계마다 장면 그림(이미지 틀) + 단계 이름 + 확인 문장 + 받는 것을 둔다.
 * 그림은 공개 저장소 자체 소재(웹툰 컷)와 CSS 도형이며 장식이라 스크린리더에서 숨긴다.
 * 진행 모션은 process-run.tsx가 시작 신호만 주고, 모든 움직임과 순서 지연(--i 단계 번호, --r 그림 안 순번)은 content-home.css가 맡는다. */
import Image from "next/image";
import {
  contentHomeProcess as steps,
  contentHomeProcessHead as head,
  type ContentHomeStepArt,
} from "@/lib/content-home";
import { ProcessRun } from "./process-run";

const CUT = (n: number) => `/webtoon-v11/cut-${String(n).padStart(2, "0")}.webp`;

function Cut({ n, sizes }: { n: number; sizes: string }) {
  return <Image src={CUT(n)} alt="" fill sizes={sizes} className="ch-art-img" />;
}

function StepArt({ kind }: { kind: ContentHomeStepArt }) {
  switch (kind) {
    case "checklist":
      return (
        <>
          {[0, 1, 2].map((row) => (
            <span key={row} className="ch-art-row">
              <span className="ch-art-box" />
              <span className="ch-art-bar" />
            </span>
          ))}
        </>
      );
    case "storyboard":
      return (
        <>
          {[1, 2, 3].map((n) => (
            <span key={n} className="ch-art-slot">
              <Cut n={n} sizes="(min-width:1024px) 80px, 40px" />
            </span>
          ))}
        </>
      );
    case "refine":
      return (
        <span className="ch-art-draft">
          <Cut n={2} sizes="(min-width:1024px) 240px, 80px" />
        </span>
      );
    case "frames":
      return (
        <>
          {(["916", "45", "169"] as const).map((ratio) => (
            <span
              key={ratio}
              className="ch-art-frame"
              data-ratio={ratio}
            >
              <Cut n={3} sizes="(min-width:1024px) 100px, 40px" />
            </span>
          ))}
        </>
      );
  }
}

export function ProcessSteps() {
  return (
    <ProcessRun count={steps.length}>
      {steps.map((step, index) => (
        <li
          key={step.label}
          className="ch-step"
        >
          <div className="ch-step-art" aria-hidden="true">
            <div className="ch-art-stage" data-art={step.art}>
              <StepArt kind={step.art} />
            </div>
          </div>
          <h3 className="ch-step-name cs-t-h3">
            <span className="ch-step-num cs-t-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step.label}
          </h3>
          <div className="ch-step-check">
            <p className="cs-sr-only">{head.checkLabel}</p>
            <p className="cs-t-small">{step.check.join(" · ")}</p>
          </div>
          <p className="ch-step-output cs-t-caption">
            {head.outputLabel} · <span className="ch-step-output-value">{step.output}</span>
          </p>
        </li>
      ))}
    </ProcessRun>
  );
}
