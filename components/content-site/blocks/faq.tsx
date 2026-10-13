/* FAQ 블록(id="faq", 바탕 --cs-bg-2). <details>·<summary> 서버 렌더(JS 없음).
 * 문자열은 JSON-LD FAQPage(lib/content-site/schema.ts)와 같은 배열(서비스 데이터 faq)에서 온다. */
import { CS_COPY } from "@/lib/content-site/copy";
import type {
  ContentServiceId,
  ServiceLandingData,
} from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

export function CsFaq({
  id,
  faq,
}: {
  id: ContentServiceId;
  faq: ServiceLandingData["faq"];
}) {
  return (
    <section
      id="faq"
      className="cs-section cs-section--alt"
      data-cs-section="faq"
      aria-labelledby="cs-faq-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-faq-title"
          eyebrow={CS_COPY.faq.eyebrow}
          title={CS_COPY.faq.title}
        />
        <div className="cs-faq-list">
          {faq.map(([question, answer], i) => (
            <details key={question} className="cs-faq-item">
              <summary
                className="cs-faq-q cs-t-h3"
                aria-controls={`cs-faq-${id}-${i}`}
              >
                <span>{question}</span>
                <span className="cs-faq-icon" aria-hidden="true" />
              </summary>
              <p id={`cs-faq-${id}-${i}`} className="cs-faq-a cs-t-body">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
