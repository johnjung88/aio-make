/* /content/contact (서버, WP-D). BRIEF_P2R_SERVICES 8절.
 * 히어로(eyebrow·h1·lead) + 옆(≥1024)·아래 '가격 기준' 3줄 → 서비스 선택 카드 6개(<form> 밖) → 문의 폼(CsInquiry).
 * 서비스 선택과 미선택 안내는 ContactFlow(client)가 맡는다. ?service=가 6종 중 하나면 미리 선택한다. */
import { PRICING_COMMON_LINES } from "@/lib/content-pricing";
import type { ContentServiceId } from "@/lib/content-site/types";
import { ContactFlow } from "./contact-flow";
import { CONTACT_COPY } from "./copy";
import "./contact.css";

export function ContentContact({ service }: { service?: ContentServiceId }) {
  const { hero, basis } = CONTACT_COPY;
  return (
    <div className="cs-contact">
      <ContactFlow
        initialService={service}
        head={
          <div className="cs-grid cs-contact-head">
            <div className="cs-contact-intro cs-col-7">
              <p className="cs-t-eyebrow">{hero.eyebrow}</p>
              <h1 id="cs-hero-title" className="cs-t-display">
                {hero.title}
              </h1>
              <p className="cs-contact-lead cs-t-lead">{hero.lead}</p>
            </div>
            <aside
              className="cs-contact-basis cs-col-4 cs-col-start-9"
              aria-labelledby="cs-contact-basis-title"
            >
              <h2 id="cs-contact-basis-title" className="cs-t-label">
                {basis.title}
              </h2>
              <ul className="cs-contact-basis-list">
                {PRICING_COMMON_LINES.map((line) => (
                  <li key={line} className="cs-t-small">
                    {line}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        }
      />
    </div>
  );
}
