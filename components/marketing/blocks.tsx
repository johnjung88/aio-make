import Image from "next/image";
import Link from "next/link";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import {
  marketingCopy,
  marketingNames,
  marketingIds,
  marketingContact,
  type MarketingId,
} from "@/lib/marketing-renewal";

export function MarketingHead({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  const word =
    [
      "운영",
      "채널",
      "컨텐츠",
      "인물",
      "사이트",
      "계획",
      "질문",
      "선택",
      "확인",
      "진단",
      "상담",
      "자료",
    ].find((keyword) => title.includes(keyword)) ??
    title
      .split("\n")
      .at(-1)
      ?.split(" ")
      .find((token) => token.length > 1);
  return (
    <CsSectionHead
      id={id}
      eyebrow={eyebrow}
      title={title}
      lead={lead}
      emphasis={word}
      align="center"
    />
  );
}
export function MarketingPicture({
  name,
  alt,
  hero = false,
}: {
  name: string;
  alt: string;
  hero?: boolean;
}) {
  return (
    <picture
      className={`mk-picture${hero ? " mk-picture-hero" : ""}${name === "home-touchpoints" ? " mk-picture-flow" : ""}`}
    >
      {(hero || name === "home-touchpoints") && (
        <source
          media="(max-width: 767px)"
          srcSet={`/marketing-renewal/${name}-mobile.webp`}
        />
      )}
      <Image
        src={`/marketing-renewal/${name}.webp`}
        alt={alt}
        quality={90}
        width={hero ? 1600 : 1200}
        height={hero ? 1000 : 900}
        priority={hero || name === "home-ribbon"}
        sizes={
          name === "home-ribbon"
            ? "(max-width:767px) 850px, 100vw"
            : name === "home-touchpoints"
              ? "100vw"
              : hero
                ? "(max-width:767px) 100vw, 58vw"
                : "(max-width:767px) 85vw, 33vw"
        }
      />
    </picture>
  );
}
export function MarketingCards({ current }: { current?: MarketingId }) {
  return (
    <div
      className={`mk-service-grid${current ? " mk-service-grid-three" : ""}`}
    >
      {marketingIds
        .filter((id) => id !== current)
        .map((id, i) => (
          <Link
            className="mk-service-card"
            data-service={id}
            key={id}
            href={`/marketing/services/${id}`}
          >
            <MarketingPicture
              name={`${id}-card`}
              alt={`${marketingNames[id]} 결과물 방향 예시`}
            />
            <div className="mk-card-body">
              <span className="mk-eyebrow">
                0{i + 1} / {id === "seo" ? "프로젝트" : "월 운영"}
              </span>
              <h3>{marketingNames[id]}</h3>
              <p>{marketingCopy[id].intro.split("\n")[0]}</p>
              <strong className="mk-price">{marketingCopy[id].price}</strong>
              <small>{marketingCopy[id].term}</small>
              <span className="mk-card-link">{marketingNames[id]} 보기 →</span>
            </div>
          </Link>
        ))}
    </div>
  );
}
export function MarketingProcess({ steps }: { steps: string[][] }) {
  return (
    <ol className="mk-steps">
      {steps.map(([title, body, check], i) => (
        <li key={title}>
          <svg
            viewBox="0 0 48 48"
            width="48"
            height="48"
            fill="none"
            aria-hidden="true"
          >
            <rect x="9" y="8" width="30" height="34" rx="5" />
            <path
              d={
                [
                  "M17 19h14M17 26h9M17 33h14",
                  "M16 18h16v16H16zM24 12v27M12 25h24",
                  "m15 25 6 6 12-14M16 37h16",
                  "M16 33V23m8 10V17m8 16V12",
                ][i]
              }
            />
          </svg>
          <span className="mk-eyebrow">0{i + 1}</span>
          <h3>{title}</h3>
          <p>{body}</p>
          <span className="mk-check">확인할 것 · {check}</span>
        </li>
      ))}
    </ol>
  );
}
export function MarketingFaq({ faq }: { faq: string[][] }) {
  return (
    <div className="mk-faq-list">
      {faq.map(([q, a]) => (
        <details key={q}>
          <summary>
            <h3>{q}</h3>
            <span aria-hidden="true">+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function MarketingInquiry({ service }: { service?: MarketingId }) {
  const copy = service ? marketingCopy[service] : null;
  return (
    <section className="mk-inquiry mk-section">
      <div className="mk-container">
        <MarketingHead
          id="inquiry-title"
          eyebrow="CONTACT"
          title={
            copy?.inquiryTitle ?? "현재 채널과\n해결하고 싶은 문제를 알려주세요"
          }
          lead={copy?.inquiryLead ?? "필요한 서비스와 범위부터 함께 정리합니다"}
        />
        <Link
          className="mk-primary"
          href={marketingContact(service ?? "", "inquiry")}
        >
          {service ? `${marketingNames[service]} 상담하기` : "상담 문의하기"} ↗
        </Link>
        {copy && <p className="mk-caption">{copy.example}</p>}
      </div>
    </section>
  );
}
