/* 제작 과정 4단계(서버, R8). 박스 장식 없이 단계마다 장면 그림(이미지 틀) + 단계 이름 + 설명 한 문장을 둔다.
 * 그림은 공개 저장소 자체 소재(웹툰 컷)와 CSS 도형이며 장식이라 스크린리더에서 숨긴다.
 * 진행 모션은 process-run.tsx가 시작 신호만 주고, 모든 움직임과 순서 지연(--i 단계 번호, --r 그림 안 순번)은 content-home.css가 맡는다. */
import Image from "next/image";
import { contentHomeProcess as defaultSteps, type ContentHomeStepArt } from "@/lib/content-home";
import { ProcessRun } from "./process-run";

const CUT = (n: number) => `/content-renewal-20261019/webtoon-${String(n).padStart(2, "0")}.webp`;

function Cut({ n, sizes, detail = false }: { n: number; sizes: string; detail?: boolean }) {
  const src = detail ? `/service-detail-v14/webtoon-${String(n).padStart(2, "0")}.webp` : CUT(n);
  return <Image src={src} alt="" fill sizes={sizes} className="ch-art-img" />;
}

function StepArt({ kind, distinctFrames = false }: { kind: ContentHomeStepArt; distinctFrames?: boolean }) {
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
          {["이야기", "캐릭터", "컷 구성"].map((label, index) => (
            <span key={label} className="ch-art-slot">
              <span className="ch-art-document"><b className="cs-t-caption">0{index + 1}</b><span className="cs-t-caption">{label}</span><i/><i/><i/></span>
            </span>
          ))}
        </>
      );
    case "refine":
      return (
        <span className="ch-art-draft">
          <Cut n={distinctFrames ? 11 : 5} detail={distinctFrames} sizes="(min-width:1024px) 240px, 80px" />
        </span>
      );
    case "frames":
      return (
        <>
          {(["916", "45", "169"] as const).map((ratio, index) => (
            <span
              key={ratio}
              className="ch-art-frame"
              data-ratio={ratio}
            >
              <Cut n={distinctFrames ? [10, 16, 21][index] : 21} detail={distinctFrames} sizes="(min-width:1024px) 100px, 40px" />
            </span>
          ))}
        </>
      );
  }
}

export function ProcessSteps({ steps = defaultSteps, distinctFrames = false }: { steps?: { label: string; text: string; art: ContentHomeStepArt }[]; distinctFrames?: boolean } = {}) {
  return (
    <ProcessRun count={steps.length}>
      {steps.map((step, index) => (
        <li
          key={step.label}
          className="ch-step"
        >
          <div className="ch-step-top">
          <div className="ch-step-art" aria-hidden="true">
            <div className="ch-art-stage" data-art={step.art}>
              <StepArt kind={step.art} distinctFrames={distinctFrames} />
            </div>
          </div>
          <h3 className="ch-step-name cs-t-h3">
            <span className="ch-step-num cs-t-num" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            {step.label}
          </h3>
          </div>
          <p className="ch-step-text cs-t-small">{step.text}</p>
        </li>
      ))}
    </ProcessRun>
  );
}
