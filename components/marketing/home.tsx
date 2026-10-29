import Image from "next/image";
import Link from "next/link";
import { divisionServices } from "@/lib/content";
import { servicePlans } from "@/lib/service-plans";
import { creativeAsset } from "@/lib/creative-assets";
import { GuideNav } from "@/components/guide/primitives";
import { CampaignExperience } from "./experience";

const process = [
  [
    "현재 상황 확인",
    "고객·브랜드·자료와 운영 중인 채널을 살펴봅니다",
    "고객 질문과 채널 현황",
  ],
  [
    "범위와 견적 합의",
    "제작 수량·채널·운영 기간과 검토 일정을 정합니다",
    "운영 계획과 견적",
  ],
  [
    "제작과 검수",
    "브랜드의 사실과 표현을 확인하고 채널에 맞춰 게시합니다",
    "검수할 컨텐츠와 게시 목록",
  ],
  [
    "보고와 개선",
    "수행 내역과 확인 가능한 반응을 다음 운영에 반영합니다",
    "운영 내역과 다음 계획",
  ],
];
export function MarketingHome() {
  const services = divisionServices("marketing");
  return (
    <div className="mk-home">
      <GuideNav division="marketing" />
      <section className="mk-hero mk-container">
        <div className="mk-hero-copy">
          <span className="mk-kicker">AIO MAKE · 마케팅</span>
          <h1 className="t-h1">
            고객의 질문에서
            <br />
            <em>문의까지</em> 이어지도록
          </h1>
          <p className="t-lead">
            컨텐츠와 채널 운영
            <br />
            검색 개선을 연결합니다
          </p>
          <div className="mk-actions">
            <a className="mk-primary" href="#flow">
              운영 흐름 살펴보기 <span aria-hidden="true">↓</span>
            </a>
            <Link href="/marketing/contact">상담하기 ↗</Link>
          </div>
        </div>
        <div id="flow">
          <CampaignExperience />
        </div>
      </section>
      <section id="services" className="mk-container mk-section">
        <div className="mk-heading">
          <span className="mk-kicker">OUR SERVICES</span>
          <h2 className="t-h2">
            지금 필요한 운영부터
            <br />
            선택하세요
          </h2>
          <p>컨텐츠 운영은 월 단위로, 검색 개선은 프로젝트 단위로 진행합니다</p>
        </div>
        <div className="mk-services">
          {services.map((service, index) => {
            const plan = servicePlans[service.id];
            return (
              <Link
                className="mk-service"
                key={service.id}
                href={`/marketing/services/${service.id}`}
              >
                <div className="mk-service-image">
                  <Image
                    src={creativeAsset("marketing", service.id)}
                    alt={`${service.name} 제작 방향 예시`}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, 23vw"
                  />
                </div>
                <div className="mk-service-copy">
                  <span className="mk-kicker">
                    0{index + 1} /{" "}
                    {service.id === "seo" ? "프로젝트" : "월 운영"}
                  </span>
                  <h3 className="t-h3">{service.name}</h3>
                  <p>{service.description.replace("소스·CMS", "소스와 CMS")}</p>
                  <strong className="mk-price">{plan.price}</strong>
                  <small>{plan.term}</small>
                  <span className="mk-text-link">범위와 진행 방법 보기 ↗</span>
                </div>
              </Link>
            );
          })}
        </div>
        <p className="mk-note">
          월 운영 상품에는 기본 소개·문의 사이트 구축 또는 리뉴얼 1회가
          포함됩니다
          <br />
          세부 범위와 운영 실비는 견적에서 구분합니다
        </p>
      </section>
      <section className="mk-reuse mk-container mk-section">
        <div>
          <span className="mk-kicker">ONE SOURCE, MANY TOUCHPOINTS</span>
          <h2 className="t-h2">
            한 번의 제작을
            <br />
            <em>여러 접점으로</em>
          </h2>
          <p>
            같은 소재도 채널에 맞는 길이와 문구로
            <br />
            고객이 만나는 자리에 배치합니다
          </p>
          <Link className="mk-text-link" href="/marketing/work">
            제작 방향과 공개 작업 보기 ↗
          </Link>
        </div>
        <div className="mk-reuse-cards">
          {[
            ["/creative-v06/marketing-sns.webp", "채널 컨텐츠"],
            [
              "/content-examples/ai-influencer/ai-creator.webp",
              "브랜드 이야기",
            ],
            ["/creative-v08/marketing-seo.webp", "검색과 페이지"],
          ].map(([src, label]) => (
            <figure key={label}>
              <div>
                <Image
                  src={src}
                  alt={`${label} 제작 방향 예시`}
                  fill
                  sizes="(max-width:767px) 30vw, 220px"
                />
              </div>
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
        <span className="mk-reuse-note">
          제작 방향 예시 · 실제 운영 데이터가 아닙니다
        </span>
      </section>
      <section className="mk-container mk-section">
        <div className="mk-heading">
          <span className="mk-kicker">HOW WE WORK</span>
          <h2 className="t-h2">
            계획과 결과를
            <br />
            단계마다 확인합니다
          </h2>
        </div>
        <ol className="mk-process">
          {process.map(([title, copy, result], i) => (
            <li key={title}>
              <span className="mk-process-no">0{i + 1}</span>
              <h3 className="t-h3">{title}</h3>
              <p>{copy}</p>
              <div>
                <span>함께 확인할 자료</span>
                <strong>{result}</strong>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section id="faq" className="mk-container mk-section mk-faq">
        <div className="mk-heading">
          <span className="mk-kicker">FAQ</span>
          <h2 className="t-h2">
            운영 전에
            <br />
            궁금한 점
          </h2>
        </div>
        <div>
          {[
            [
              "어떤 서비스부터 시작하면 좋을까요?",
              "컨텐츠와 채널을 함께 맡기려면 통합 마케팅, 꾸준한 게시가 필요하면 SNS 운영을 살펴보세요 브랜드 인물이 필요하면 AI 인플루언서, 사이트의 검색 접근성과 정보 구조를 개선하려면 SEO·AEO·GEO를 선택할 수 있습니다",
            ],
            [
              "기존 자료와 채널로 시작할 수 있나요?",
              "현재 자료와 채널을 먼저 확인합니다 이용 권리와 수정 가능한 범위를 확인한 뒤 부족한 자료와 추가 제작을 견적에서 정합니다",
            ],
            [
              "운영 결과는 어떻게 확인하나요?",
              "제작 컨텐츠와 채널별 게시 내역, 확인 가능한 반응과 다음 운영 계획을 함께 정리합니다",
            ],
            [
              "광고비와 추가 촬영도 포함되나요?",
              "광고 매체비와 촬영, 추가 채널과 제작은 기본 제공 범위와 구분해 견적에서 확인합니다",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="mk-container mk-section">
        <div className="mk-cta">
          <div>
            <span className="mk-kicker">LET’S CONNECT</span>
            <h2 className="t-h2">
              현재 채널과
              <br />
              해결하고 싶은 문제를 알려주세요
            </h2>
            <p>필요한 서비스와 범위부터 함께 정리합니다</p>
            <Link className="mk-primary" href="/marketing/contact">
              상담 문의하기 ↗
            </Link>
          </div>
          <div className="mk-cta-image">
            <Image
              src="/content-examples/ai-influencer/ai-creator.webp"
              alt="브랜드 컨텐츠 제작 방향 예시"
              fill
              sizes="(max-width:767px) 100vw, 480px"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
