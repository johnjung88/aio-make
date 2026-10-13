/* 캐러셀 패널과 목록 항목이 같이 쓰는 서비스 설명 블록. 훅이 없어 서버·클라이언트 공용이다.
 * 시작가는 lib/content-pricing.ts의 startingPrice(id)만 쓴다. 표시 여부는 SHOW_STARTING_PRICE 하나가 정한다
 * (값이 없으면 가격 칩과 옵션 줄을 모두 그리지 않고 빈 자리도 남기지 않는다). */
import Link from "next/link";
import { startingPrice } from "@/lib/content-pricing";
import {
  contentHomeServicesHead,
  pad2,
  type ContentHomeService,
} from "@/lib/content-home";

export function ServiceDetail({
  service,
  index,
}: {
  service: ContentHomeService;
  index: number;
}) {
  const price = startingPrice(service.id);
  return (
    <div className="ch-detail">
      <p className="ch-detail-meta">
        <span className="ch-num cs-t-eyebrow">{pad2(index + 1)}</span>
        <span className="cs-t-eyebrow">{service.kicker}</span>
      </p>
      <h3 className="ch-svc-title cs-t-h3">{service.label}</h3>
      <p className="ch-svc-line cs-t-lead">{service.line}</p>
      <p className="ch-svc-body cs-t-body">{service.description}</p>
      <ul className="ch-chips" aria-label={`${service.label} 활용처`}>
        {service.uses.map((use) => (
          <li key={use} className="ch-chip cs-t-chip">
            {use}
          </li>
        ))}
      </ul>
      {price ? (
        <div className="ch-price-block">
          <p className="ch-price cs-price">
            <span className="cs-price-unit cs-t-price-sm">{price.head}</span>
            {price.rest.map((unit) => (
              <span key={unit} className="cs-price-unit cs-t-small">
                {unit}
              </span>
            ))}
          </p>
          {price.note ? (
            <p className="ch-price-note cs-t-small">{price.note}</p>
          ) : null}
        </div>
      ) : null}
      {service.scopeNote ? (
        <p className="ch-note cs-t-small">{service.scopeNote}</p>
      ) : null}
      <Link
        className="cs-btn cs-btn--ghost ch-detail-link"
        href={service.href}
        aria-label={`${service.label} ${contentHomeServicesHead.detailLink}`}
      >
        {contentHomeServicesHead.detailLink}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
