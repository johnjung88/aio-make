"use client";
import Image from "next/image";
import { GuideLink } from "./primitives";
import {
  DivisionCards,
  ContactCta,
  SectionHead,
  companySteps,
} from "@/components/home/renewal-sections";
import { ProcessSteps } from "@/components/content-home/process-steps";
import "@/components/content-site/theme.css";
import "@/components/content-home/content-home.css";
import "@/components/home/main-about-renewal.css";
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
          <Image
            src="/images/guide/hero/team-meeting.jpg"
            alt="제작 방향을 함께 논의하는 팀 작업 장면"
            width={960}
            height={1200}
            sizes="(min-width:768px) 50vw, 100vw"
            priority
          />
        </div>
      </section>
      <section className="rw-section" aria-labelledby="rw-about-services">
        <div className="cs-container">
          <SectionHead
            id="rw-about-services"
            eyebrow="ALL SERVICES"
            title={"하나의 브랜드,\n세 분야의 전문가"}
          />
          <DivisionCards />
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
