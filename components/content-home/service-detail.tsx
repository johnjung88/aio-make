import { Fragment } from "react";
import Link from "next/link";
import {
  contentHomeServicesHead,
  pad2,
  startingPrice,
  type ContentHomeService,
} from "@/lib/content-home";

/* 캐러셀 패널과 목록 항목이 같이 쓰는 서비스 설명 블록. 훅이 없어 서버·클라이언트 공용이다. */
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
        <span className="ch-num eyebrow">{pad2(index + 1)}</span>
        <span className="ch-kicker eyebrow">{service.kicker}</span>
      </p>
      <h3 className="ch-svc-title t-h3">{service.label}</h3>
      <p className="ch-svc-line t-lead">{service.line}</p>
      <p className="ch-body t-body">{service.description}</p>
      <ul className="ch-chips" aria-label={`${service.label} 활용처`}>
        {service.uses.map((use) => (
          <li key={use} className="ch-chip t-chip">
            {use}
          </li>
        ))}
      </ul>
      {price ? (
        <>
          <p className="ch-price t-body">
            <strong className="ch-price-amount ch-nowrap">{price.head}</strong>
            {price.rest.map((part) => (
              <Fragment key={part}>
                {" "}
                <span className="ch-nowrap">{"· " + part}</span>
              </Fragment>
            ))}
          </p>
          {price.note ? (
            <p className="ch-price-note t-small">{price.note}</p>
          ) : null}
        </>
      ) : null}
      {service.scopeNote ? (
        <p className="ch-note t-small">{service.scopeNote}</p>
      ) : null}
      <Link
        className="ch-link t-button"
        href={service.href}
        aria-label={`${service.label} ${contentHomeServicesHead.detailLink}`}
      >
        {contentHomeServicesHead.detailLink}
        <span aria-hidden="true"> →</span>
      </Link>
    </div>
  );
}
