import { contentHomeProcess as steps, pad2 } from "@/lib/content-home";
/** All four deliverables stay visible instead of hiding explanatory text behind tabs */
export function ProcessTabs() {
 return <ol className="ch-process-rows">{steps.map((step,index) => <li key={step.label} className="ch-process-row">
  <span className="ch-process-number cs-t-eyebrow">{pad2(index + 1)}</span>
  <div className="ch-process-name"><p className="cs-t-caption">{step.label}</p><h3 className="cs-t-h3">{step.title}</h3></div>
  <p className="cs-t-body">{step.body}</p>
  <div className="ch-process-result"><span className="cs-t-caption">결과물</span><strong className="cs-t-body">{step.output}</strong></div>
 </li>)}</ol>;
}
