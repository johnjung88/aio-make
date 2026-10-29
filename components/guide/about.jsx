"use client";
import Image from "next/image";
import { useState } from "react";
import { GuideLink } from "./primitives";
import {
  divisions,
  ContactCta,
  SectionHead,
  companySteps,
} from "@/components/home/renewal-sections";
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
            {i === 1 ? (
              <div className="rw-marketing-strip">
                {["sns-pour", "sns-beans", "sns-takeaway"].map((scene, n) => (
                  <div key={scene}>
                    <Image
                      src={`/marketing-renewal/f3a2-${scene}.webp`}
                      alt={
                        [
                          "라떼 제조 게시 소재",
                          "재료 안내 게시 소재",
                          "테이크아웃 게시 소재",
                        ][n]
                      }
                      width={320}
                      height={600}
                      sizes="(min-width:768px) 11vw, 33vw"
                    />
                    <span>{["메뉴", "재료", "일상"][n]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Image
                src={images[i]}
                alt={labels[i]}
                width={960}
                height={600}
                sizes="(min-width:768px) 33vw, 100vw"
              />
            )}
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
  const [division, setDivision] = useState(0);
  const scopes = [
    [
      "웹사이트·쇼핑몰·프로그램·업무 자동화",
      "합의한 기능과 화면, 실제 사용 환경에서 확인할 항목",
      "기존 사이트와 업무 흐름, 필요한 기능",
    ],
    [
      "통합 마케팅·SNS 운영·검색 정보 개선",
      "제작 컨텐츠와 게시 내역, 확인한 반응과 다음 계획",
      "보유 소재와 운영 채널, 알리고 싶은 내용",
    ],
    [
      "웹툰·애니메이션·영상·AI 인플루언서",
      "합의한 규격의 완성 파일과 검수 내용",
      "제작 목적과 참고 자료, 사용할 채널",
    ],
  ];
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
              sizes="(min-width:768px) 58vw, 100vw"
              priority
            />
            <figcaption>모그레빗 · 가상 브랜드 웹사이트 제작 샘플</figcaption>
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
      <section
        className="rw-section rw-about-scope"
        aria-labelledby="rw-scope-title"
      >
        <div className="cs-container">
          <SectionHead
            id="rw-scope-title"
            eyebrow="WORK TOGETHER"
            title={"필요한 분야를 고르고,\n전달받을 결과를 확인하세요"}
            lead="구체적인 수량과 일정, 비용은 자료를 확인한 뒤 견적에서 정합니다"
          />
          <div
            className="rw-scope-choices"
            role="group"
            aria-label="담당 분야 선택"
          >
            {divisions.map((item, i) => (
              <button
                type="button"
                key={item.name}
                aria-pressed={division === i}
                aria-controls="rw-scope-result"
                onClick={() => setDivision(i)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div id="rw-scope-result" aria-live="polite">
            <h3 className="cs-t-h3">
              {divisions[division].name} 분야에서 함께할 일
            </h3>
            <table>
              <thead>
                <tr>
                  <th scope="col">담당 범위</th>
                  <th scope="col">완성 결과 · 준비 자료</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">{scopes[division][0]}</th>
                  <td>{scopes[division][1]}</td>
                </tr>
                <tr>
                  <th scope="row">시작 전 함께 확인</th>
                  <td>{scopes[division][2]}</td>
                </tr>
              </tbody>
            </table>
            <GuideLink className="cs-link" href={divisions[division].href}>
              {divisions[division].name} 구성과 범위 보기 ↗
            </GuideLink>
          </div>
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
            <ol className="rw-about-process-scenes">
              {companySteps.map((step, i) => (
                <li key={step.title}>
                  <Image
                    src={`/marketing-renewal/f3a2-process-${["brief", "plan", "make", "review"][i]}.webp`}
                    alt={
                      [
                        "자료와 목적을 함께 살펴보는 장면",
                        "사진과 색상으로 제작 방향을 정리하는 장면",
                        "제품 촬영 소재를 만드는 장면",
                        "완성된 시안을 함께 검토하는 장면",
                      ][i]
                    }
                    width={720}
                    height={540}
                    sizes="(min-width:1024px) 25vw, (min-width:768px) 50vw, 100vw"
                  />
                  <h3 className="cs-t-h3">
                    <span className="cs-t-num">0{i + 1}</span> {step.title}
                  </h3>
                  <p className="cs-t-small">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="cs-t-caption rw-process-disclaimer">
              제작 과정을 설명하는 가상 장면 이미지
            </p>
          </div>
        </section>
      </div>
      <ContactCta source="about" />
    </div>
  );
}
