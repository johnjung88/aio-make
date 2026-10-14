/* 관련 서비스: 현재 서비스를 뺀 5개를 행 목록(서비스명 / 시작가 / 한 줄 설명)으로. 박스 없이 위 가는 선만.
 * 한 줄 설명은 lib/content-home.ts의 contentHomeServices[].line을 읽기 전용으로 재사용한다. */
import Link from "next/link";
import { contentHomeServices } from "@/lib/content-home";
import { startingPrice } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import {
  CONTENT_SERVICES,
  contentServicePath,
  type ContentServiceId,
} from "@/lib/content-site/types";
import { CsSectionHead } from "../ui/section-head";

const lineOf = (id: ContentServiceId) =>
  contentHomeServices.find((s) => s.id === id)?.line;

export function CsRelated({ current }: { current: ContentServiceId }) {
  return (
    <section
      className="cs-section cs-section--sm"
      data-cs-section="related"
      aria-labelledby="cs-related-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-related-title"
          eyebrow={CS_COPY.related.eyebrow}
          title={CS_COPY.related.title}
        />
        <ul className="cs-related-list">
          {CONTENT_SERVICES.filter((s) => s.id !== current).map((s) => {
            const price = startingPrice(s.id, true);
            const line = lineOf(s.id);
            return (
              <li key={s.id}>
                <Link href={contentServicePath(s.id)} className="cs-related-row">
                  <span className="cs-related-name cs-t-h3">{s.label}</span>
                  {price ? (
                    <span className="cs-related-price cs-t-small">{price.head}</span>
                  ) : null}
                  {line ? (
                    <span className="cs-related-line cs-t-small">{line}</span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
