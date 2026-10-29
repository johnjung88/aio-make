"use client";
import Image from "next/image";
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
          <ol className="rw-marketing-steps cs-t-body">
            {[
              "목표와 채널 설정",
              "컨텐츠 기획",
              "발행과 운영",
              "데이터 확인·개선",
            ].map((label, i) => (
              <li key={label}>
                <span className="cs-t-num">0{i + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <figure>
            <div className="rw-work-media">
              <Image
                src="/images/guide/portfolio/blogautopilot-multinational/real-demo/app-dashboard.png"
                alt="발행 현황과 예약 일정을 확인하는 컨텐츠 운영 도구 화면"
                width={1600}
                height={1000}
                sizes="(min-width:1200px) 1120px, 100vw"
              />
            </div>
            <figcaption className="cs-t-small">
              컨텐츠 운영 도구 화면 · 채널과 발행 현황을 한곳에서 확인합니다
            </figcaption>
          </figure>
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
