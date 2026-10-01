import { creativeAsset } from "@/lib/creative-assets";
import { ServiceMotion } from "./service-motion";
import Link from "next/link";
import { divisionServices } from "@/lib/content";
import { servicePlans } from "@/lib/service-plans";
import type { Entry } from "@/lib/db";
import { GuideNav } from "./primitives";
import { HomeReferences } from "./home-references";

export function ServiceOverview({
  division,
  entries,
}: {
  division: "marketing" | "development";
  entries: Entry[];
}) {
  const marketing = division === "marketing";
  const root = marketing ? "marketing" : "lab";
  const items = divisionServices(division);
  return (
    <div className={`guide-page service-detail service-overview service-dark`}>
      <GuideNav division={root} />
      <section className="overview-hero review-container">
        <div>
          <span className="review-eyebrow">
            AIO MAKE · {marketing ? "마케팅" : "개발"}
          </span>
          <h1>
            {marketing ? (
              <>
                고객의 질문에 답하고
                <br />
                문의 경로를 설계합니다
              </>
            ) : (
              <>
                필요한 범위를 정하고
                <br />실제로 쓰는 결과물을 만듭니다
              </>
            )}
          </h1>
          <p>
            {marketing
              ? "콘텐츠 제작과 채널 운영, 검색 개선까지. 현재 필요한 일을 고르고 브랜드에 맞는 운영을 시작하세요."
              : "홈페이지와 카페24 쇼핑몰부터 업무 자동화와 프로그램까지. 범위와 가격, 인계 방법을 먼저 맞춥니다."}
          </p>
          <div className="service-actions">
            <a className="service-primary" href="#services">
              서비스 비교하기 ↓
            </a>
            <Link href={`/${root}/contact`}>상담하기 ↗</Link>
          </div>
        </div>
        <ServiceMotion
          label={
            marketing
              ? "브랜드를 알리는 네 가지 방법"
              : "아이디어를 구현하는 네 가지 방법"
          }
          frames={items.map((service) => ({
            image: creativeAsset(division, service.id),
            title: service.name,
            copy: service.description,
            visual:
              service.id === "integrated"
                ? "growth"
                : service.id === "automation"
                  ? "automation"
                  : service.id === "seo"
                    ? "search"
                    : undefined,
          }))}
        />
      </section>
      <section id="services" className="overview-services review-container">
        <div className="service-section-heading">
          <span className="review-eyebrow">서비스 선택</span>
          <h2>
            {marketing
              ? "지금 필요한 운영부터 선택하세요"
              : "어떤 결과물이 필요한가요?"}
          </h2>
          <p>
            {marketing
              ? "콘텐츠 운영은 월 단위로, 검색 개선은 프로젝트 단위로 진행합니다. 금액은 부가세 별도입니다."
              : "홈페이지·카페24는 아래 가격 기준으로, 자동화·프로그램은 요청별 범위를 확인해 견적을 안내합니다."}
          </p>
        </div>
        <div className="marketing-offer-grid overview-offers">
          {items.map((service, index) => {
            const plan = servicePlans[service.id];
            return (
              <Link
                key={service.id}
                className="marketing-offer-card overview-card"
                href={`/${root}/services/${service.id}`}
              >
                <div className="offer-summary">
                  <span className="review-eyebrow">
                    0{index + 1} ·{" "}
                    {marketing && service.id !== "seo" ? "월 운영" : "프로젝트"}
                  </span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                </div>
                <div className="offer-price">
                  <strong>{plan.price}</strong>
                  <span>{plan.term}</span>
                </div>
                <ul>
                  {plan.facts.map(([label, value]) => (
                    <li key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </li>
                  ))}
                </ul>
                <p className="overview-card-note">
                  {service.id === "shopping-mall"
                    ? "상품 등록·PG·배송 등 오픈 설정은 포함되지 않습니다."
                    : service.id === "website"
                      ? "이미지 자료가 없으면 AI 이미지 제작·적용 포함. 대시보드 추가 +3만 원은 기능 범위를 먼저 합의합니다."
                      : service.audience}
                </p>
                <span className="overview-card-link">
                  범위와 진행 방법 보기 <span aria-hidden="true">↗</span>
                </span>
              </Link>
            );
          })}
        </div>
        {marketing && (
          <p className="overview-footnote">
            통합·SNS·AI 인플루언서 월 운영 상품에는 기본 소개·문의 사이트 구축
            또는 리뉴얼 1회 혜택이 있습니다. 페이지·수정·추가 기능과 운영 실비는
            견적에서 구분합니다.
          </p>
        )}
      </section>
      <HomeReferences entries={entries} division={division} />
      <section className="service-process review-container">
        <div className="service-section-heading">
          <span className="review-eyebrow">함께 일하는 방법</span>
          <h2>계획과 결과를 단계마다 확인합니다</h2>
        </div>
        <ol>
          {[
            [
              "현재 상황 확인",
              marketing
                ? "고객·브랜드·자료와 운영 중인 채널을 살펴봅니다."
                : "현재 도구와 자료, 필요한 페이지·기능을 확인합니다.",
            ],
            [
              "범위와 견적 합의",
              marketing
                ? "제작 수량·채널·운영 기간 또는 사이트 적용 범위를 정합니다."
                : "작업 목록과 가격·납기·수정·인계 방법을 정합니다.",
            ],
            [
              "제작과 검수",
              marketing
                ? "브랜드의 사실과 표현을 확인하고 콘텐츠 또는 사이트 개선안을 적용합니다."
                : "합의한 환경에서 실제 화면과 기능, 오류 상황을 검수합니다.",
            ],
            [
              marketing ? "보고와 개선" : "인계와 사용 안내",
              marketing
                ? "수행 내역과 확인 가능한 반응을 정리해 다음 운영에 반영합니다."
                : "완성된 결과와 사용 방법을 전달하고 계약에 따른 지원 범위를 안내합니다.",
            ],
          ].map(([title, desc], index) => (
            <li key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="service-next review-container">
        <span className="review-eyebrow">
          {marketing ? "마케팅" : "개발"} 상담
        </span>
        <h2>아직 정리되지 않은 상태여도 괜찮습니다</h2>
        <p>
          {marketing ? (
            <>
              <span>현재 채널과 가장 해결하고 싶은 문제를 알려주세요</span>
              <span>필요한 서비스와 범위부터 함께 정리합니다</span>
            </>
          ) : (
            <>
              <span>만들고 싶은 것과 현재 불편한 일을 알려주세요</span>
              <span>필요한 화면과 기능, 예산에 맞는 범위를 살펴봅니다</span>
            </>
          )}
        </p>
        <Link className="service-primary" href={`/${root}/contact`}>
          상담 문의하기 ↗
        </Link>
      </section>
    </div>
  );
}
