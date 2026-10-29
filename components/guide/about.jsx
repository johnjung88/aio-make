"use client";
import Image from "next/image";
import { GuideLink } from "./primitives";
import {
  divisions,
  ContactCta,
  SectionHead,
  companySteps,
} from "@/components/home/renewal-sections";
import { ProcessSteps } from "@/components/content-home/process-steps";
import "@/components/content-site/theme.css";
import "@/components/content-home/content-home.css";
import "@/components/home/main-about-renewal.css";
import "./about-results.css";

function AboutDivisionCards() {
  const images = [
    "/lab/clinic-pc.webp",
    "/marketing-renewal/feed-3.webp",
    "/service-detail-v14/webtoon-05.webp",
  ];
  const labels = [
    "서리온결 · 가상 브랜드 웹사이트",
    "가상 브랜드 카페 · 게시 소재 예시",
    "자체 기획 웹툰 완성 원고",
  ];
  return (
    <div className="rw-divisions">
      {divisions.map((item, i) => (
        <GuideLink key={item.href} className="rw-division" href={item.href}>
          <div className="rw-card-media">
            <Image
              src={images[i]}
              alt={labels[i]}
              width={960}
              height={600}
              sizes="(min-width:768px) 33vw, 100vw"
            />
          </div>
          <div className="rw-card-body">
            <span className="cs-t-num">0{i + 1}</span>
            <h3 className="cs-t-h3">{item.name}</h3>
            <p className="cs-t-body">{item.line}</p>
            <p className="cs-t-small rw-muted">{item.services}</p>
            <p className="cs-t-caption">{labels[i]}</p>
            <span className="cs-link">{item.name} 살펴보기 ↗</span>
          </div>
        </GuideLink>
      ))}
    </div>
  );
}
export default function About() {
  return (
    <div className="guide-page cs-site rw-site rw-about">
      <section
        className="rw-about-hero"
        aria-labelledby="rw-about-title"
        data-cs-section="hero"
      >
        <div className="cs-container rw-about-hero-inner">
          <div>
            <span className="cs-t-eyebrow">ABOUT</span>
            <h1 id="rw-about-title" className="cs-t-display">
              분야별 전문가가
              <br />
              AI로 만듭니다
            </h1>
            <p className="cs-t-lead">
              AIO는 All-In-One
              <br />
              컨텐츠·마케팅·개발을 한곳에서 함께합니다
            </p>
            <div className="rw-about-actions">
              <GuideLink className="cs-btn" href="/contact?source=about">
                상담 신청 →
              </GuideLink>
              <GuideLink className="cs-link" href="/about/team">
                분야별 업무 보기 →
              </GuideLink>
            </div>
          </div>
          <figure
            className="rw-about-results"
            aria-label="개발·마케팅·컨텐츠 제작 결과 예시"
          >
            <Image
              src="/lab/food-pc.webp"
              alt="가상 음료 브랜드 웹사이트 디자인 샘플"
              width={960}
              height={600}
              sizes="(min-width:768px) 30vw, 60vw"
              priority
            />
            <Image
              src="/marketing-renewal/feed-7.webp"
              alt="가상 카페의 공간을 소개하는 게시 소재"
              width={600}
              height={600}
              sizes="(min-width:768px) 20vw, 40vw"
            />
            <Image
              src="/service-detail-v14/webtoon-03.webp"
              alt="자체 기획 웹툰 완성 원고"
              width={600}
              height={900}
              sizes="(min-width:768px) 20vw, 40vw"
            />
            <figcaption>
              가상 브랜드 웹사이트·게시 소재와 자체 기획 웹툰
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="rw-section" aria-labelledby="rw-about-services">
        <div className="cs-container">
          <SectionHead
            id="rw-about-services"
            eyebrow="ALL SERVICES"
            title={"하나의 브랜드,\n세 분야의 전문가"}
          />
          <AboutDivisionCards />
        </div>
      </section>
      <div className="cs-home">
        <section
          className="rw-process ch-process"
          data-cs-section="process"
          aria-labelledby="rw-about-process"
        >
          <div className="cs-container cs-container--read">
            <SectionHead
              id="rw-about-process"
              eyebrow="PROCESS"
              title={"범위를 정하고,\n완성까지 확인합니다"}
              lead="목적과 자료를 확인한 뒤 기획·제작·검수를 거쳐 전달합니다"
            />
            <ProcessSteps
              distinctFrames
              steps={companySteps.map((step) => ({
                label: step.title,
                text: step.body,
                art: step.art,
              }))}
            />
          </div>
        </section>
      </div>
      <ContactCta source="about" />
    </div>
  );
}
