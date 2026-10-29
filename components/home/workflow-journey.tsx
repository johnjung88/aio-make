"use client";
import Image from "next/image";
import { MonthlyMarketingBoard } from "./monthly-marketing-board";
import {
  emptyJourneyData,
  journeySteps,
  type HomeJourneyData,
} from "@/lib/home-journey";
import { ServiceShowcase } from "@/components/content-home/service-showcase";
import { GuideLink } from "@/components/guide/primitives";
import { SectionHead } from "./renewal-sections";
export function WorkflowJourney({
  data = emptyJourneyData,
}: {
  data?: HomeJourneyData;
}) {
  const [dev, marketing, content] = journeySteps;
  const project = data.devProject;
  return (
    <div id="work" className="rw-work cs-home">
      <section
        id="journey-dev"
        className="rw-section"
        aria-labelledby="journey-dev-title"
      >
        <div className="cs-container">
          <SectionHead
            id="journey-dev-title"
            eyebrow="DEVELOPMENT"
            title={dev.title}
            lead={dev.lead}
          />
          <figure>
            <div className="rw-work-media rw-dev-media">
              <Image
                src={
                  project?.after.src ??
                  "/company-main-20261019-v11/development/after-home-pc-v03.png"
                }
                alt="DR’s Secret 쇼핑몰 PC 홈 디자인 시안"
                width={1440}
                height={1000}
                sizes="(min-width:768px) 900px, 65vw"
              />
              <Image
                src={
                  project?.afterMobile?.src ??
                  "/company-main-20261019-v11/development/after-home-mobile-v03.png"
                }
                alt="같은 홈 디자인의 모바일 시안"
                width={390}
                height={1000}
                sizes="(min-width:768px) 230px, 30vw"
              />
            </div>
            <figcaption className="cs-t-small">
              DR’s Secret · PC·모바일 홈 디자인 시안
              <br />
              실제 주문과 결제는 받지 않는 레퍼런스입니다
            </figcaption>
          </figure>
          <GuideLink className="cs-btn cs-btn--ghost rw-work-link" href="/lab">
            개발 작동 샘플 보기 ↗
          </GuideLink>
        </div>
      </section>
      <section
        id="journey-marketing"
        className="rw-section"
        aria-labelledby="journey-marketing-title"
      >
        <div className="cs-container">
          <SectionHead
            id="journey-marketing-title"
            eyebrow="MARKETING"
            title={marketing.title}
            lead={marketing.lead}
          />
          <MonthlyMarketingBoard />
          <GuideLink
            className="cs-btn cs-btn--ghost rw-work-link"
            href="/marketing"
          >
            마케팅 운영 방식 보기 ↗
          </GuideLink>
        </div>
      </section>
      <div id="journey-content">
        <ServiceShowcase
          selections={data.contentSelections}
          heading={{
            eyebrow: "CONTENT",
            title: content.title,
            titleEm: "컨텐츠",
          }}
        />
        <GuideLink
          className="cs-btn cs-btn--ghost rw-work-link"
          href="/content"
        >
          컨텐츠 제작 사례와 가격 보기 ↗
        </GuideLink>
      </div>
    </div>
  );
}
