"use client";
import { useState } from "react";
import Link from "next/link";
import { MarketingFinder } from "./experience";
import {
  MarketingCards,
  MarketingHead,
  MarketingPicture,
  MarketingProcess,
  MarketingFaq,
  MarketingInquiry,
} from "./blocks";
import {
  monthlySteps,
  marketingIds,
  marketingNames,
  marketingCopy,
  type MarketingId,
} from "@/lib/marketing-renewal";
export function MarketingHome() {
  const [recommended, setRecommended] = useState<MarketingId | "">("sns");
  const [stage, setStage] = useState(0);
  return (
    <div className="mk-home" data-recommended={recommended}>
      <section className="mk-home-hero" data-stage={stage}>
        <div className="mk-container">
          <p className="mk-eyebrow">AIO MAKE MARKETING</p>
          <h1>
            고객의 질문을
            <br />
            <em>문의로</em> 잇습니다
          </h1>
          <p className="mk-lead">컨텐츠와 채널 운영, 검색 개선을 연결합니다</p>
          <div className="mk-actions">
            <a className="mk-primary" href="#finder">
              우리에게 맞는 운영 찾기 ↓
            </a>
            <Link href="/marketing/contact">상담하기 ↗</Link>
          </div>
        </div>
        <div className="mk-channel-ribbon" id="channel-preview">
          <MarketingPicture
            name="home-ribbon"
            stage={stage}
            alt="같은 브랜드의 인스타그램 피드, 블로그 글, 검색 답변이 나란히 이어지는 채널 화면"
          />
        </div>
        <div className="mk-container">
          <ol className="mk-journey">
            {["01 노출", "02 유입", "03 문의"].map((label, index) => (
              <li key={label}>
                <button
                  type="button"
                  aria-pressed={stage === index}
                  aria-controls="channel-preview"
                  onClick={() => setStage(index)}
                >
                  {label}
                </button>
              </li>
            ))}
          </ol>
          <p className="mk-caption" aria-live="polite">
            {
              [
                "인스타그램에서 브랜드를 만납니다",
                "블로그에서 자세한 정보를 확인합니다",
                "검색 답변에서 문의할 곳으로 이어집니다",
              ][stage]
            }
          </p>
        </div>
      </section>
      <MarketingFinder onRecommend={setRecommended} />
      <section className="mk-container mk-section" id="services">
        <MarketingHead
          id="services-title"
          eyebrow="OUR SERVICES"
          title={"지금 필요한 운영부터\n선택하세요"}
          lead="컨텐츠 운영은 월 단위로, 검색 개선은 프로젝트 단위로 진행합니다"
        />
        <MarketingCards />
        <p className="mk-caption">화면은 제작 방향 예시입니다</p>
        <p className="mk-note">
          월 운영 상품에는 기본 소개·문의 사이트 구축 또는 리뉴얼 1회가
          포함됩니다
          <br />
          세부 범위와 운영 실비는 견적에서 구분합니다
        </p>
      </section>
      <section
        className="mk-container mk-section mk-home-comparison"
        aria-labelledby="compare-title"
      >
        <MarketingHead
          id="compare-title"
          eyebrow="SCOPE & PRICE"
          title={"맡길 범위와 가격을\n한눈에 비교하세요"}
          lead="제작과 게시 범위를 확인한 뒤 필요한 운영을 선택하세요"
        />
        <table className="mk-compare-table">
          <caption>마케팅 서비스별 기본 가격과 계약 단위 · 부가세 별도</caption>
          <thead>
            <tr>
              <th scope="col">담당 범위</th>
              <th scope="col">가격 · 운영 단위</th>
            </tr>
          </thead>
          <tbody>
            {marketingIds.map((id) => (
              <tr key={id}>
                <th scope="row">
                  <Link href={`/marketing/services/${id}`}>
                    {marketingNames[id]} ↗
                  </Link>
                  <span>{marketingCopy[id].intro}</span>
                </th>
                <td>
                  <strong>{marketingCopy[id].price}</strong>
                  <span>{marketingCopy[id].term}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="mk-container mk-section">
        <MarketingHead
          id="touchpoints-title"
          eyebrow="ONE SOURCE"
          title={"한 번의 제작을\n여러 접점으로"}
          lead="같은 소재도 채널에 맞는 길이와 문구로 고객이 만나는 자리에 배치합니다"
        />
        <MarketingPicture
          name="home-touchpoints"
          alt="수업 공간 원본 사진에서 인스타그램, 블로그, 쇼츠 화면으로 이어지는 흐름도"
        />
        <p className="mk-caption">
          가상 브랜드의 원본 한 장을 세 채널로 바꾼 제작 방향 예시
        </p>
      </section>
      <section className="mk-container mk-section">
        <MarketingHead
          id="process-title"
          eyebrow="PROCESS"
          title={"계획과 결과를\n단계마다 확인합니다"}
          lead="단계마다 고객이 확인할 것을 먼저 정합니다"
        />
        <MarketingProcess steps={monthlySteps} />
      </section>
      <section className="mk-container mk-section" id="faq">
        <MarketingHead
          id="faq-title"
          eyebrow="FAQ"
          title={"운영 전에\n궁금한 점"}
        />
        <MarketingFaq
          faq={[
            [
              "어떤 서비스부터 시작하면 좋을까요?",
              "컨텐츠와 채널을 함께 맡기려면 통합 마케팅, 꾸준한 게시가 필요하면 SNS 운영을 살펴보세요\n브랜드 인물이 필요하면 AI 인플루언서, 사이트 구조를 개선하려면 SEO·AEO·GEO를 선택할 수 있습니다",
            ],
            [
              "기존 자료와 채널로 시작할 수 있나요?",
              "현재 자료와 채널을 먼저 확인합니다\n이용 권리와 수정 가능한 범위를 확인한 뒤 부족한 자료와 추가 제작을 견적에서 정합니다",
            ],
            [
              "운영 결과는 어떻게 확인하나요?",
              "제작 컨텐츠와 채널별 게시 내역, 확인 가능한 반응과 다음 운영 계획을 함께 정리합니다",
            ],
            [
              "광고비와 추가 촬영도 포함되나요?",
              "광고 매체비와 촬영, 추가 채널과 제작은 기본 제공 범위와 구분해 견적에서 확인합니다",
            ],
          ]}
        />
      </section>
      <MarketingInquiry />
    </div>
  );
}
