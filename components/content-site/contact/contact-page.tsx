/* /content/contact — WP0 스텁(짧은 히어로 + CsInquiry chooser). 이후 WP-D 소유(BRIEF_P2R_SERVICES 8절).
 * WP-D가 채울 것: 히어로 문구 확정, 서비스 선택 카드 배치, '가격 기준' 3줄(PRICING_COMMON) 곁들임. */
import type { ContentServiceId } from "@/lib/content-site/types";
import { CsInquiry } from "../blocks/inquiry";

const CONTACT_COPY = {
  eyebrow: "CONTACT",
  title: "어떤 컨텐츠가\n필요하신가요?",
  lead: "서비스를 고르고 만들고 싶은 내용을 남겨주세요. 담당자가 범위와 견적을 안내합니다.",
  inquiry: {
    title: "상담 신청",
    lead: "요청 서비스와 연락처를 남겨주시면 범위와 견적을 안내합니다",
    placeholder: "예: 신제품을 알릴 30초 영상이 필요해요",
  },
};

export function ContentContact({ service }: { service?: ContentServiceId }) {
  return (
    <div className="cs-contact">
      <section
        className="cs-section cs-section--sm"
        data-cs-section="hero"
        aria-labelledby="cs-hero-title"
      >
        <div className="cs-container cs-head-main">
          <p className="cs-t-eyebrow">{CONTACT_COPY.eyebrow}</p>
          <h1 id="cs-hero-title" className="cs-t-display">
            {CONTACT_COPY.title}
          </h1>
          <p className="cs-t-lead">{CONTACT_COPY.lead}</p>
        </div>
      </section>
      <CsInquiry service={service} chooser copy={CONTACT_COPY.inquiry} />
    </div>
  );
}
