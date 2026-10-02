import { creativeAsset } from "@/lib/creative-assets";
import { ServiceMotion } from "./service-motion";
import Link from "next/link";
import { type Service } from "@/lib/content";
import { servicePlans } from "@/lib/service-plans";
import { developmentQuoteTerms } from "@/lib/development-offers";
import { GuideNav, ServiceTabs } from "./primitives";

export function ServiceDetail({ service }: { service: Service }) {
  const plan = servicePlans[service.id];
  const marketing = service.division === "marketing";
  const monthly = marketing && service.id !== "seo";
  const root = marketing ? "marketing" : "lab";
  const contact = `/${root}/contact?service=${service.id}`;
  const stages = monthly
    ? [
        [
          "목표와 자료 확인",
          "고객·브랜드·채널과 자료의 이용 범위를 확인합니다",
        ],
        [
          "월간 계획 합의",
          "원본 수량과 채널별 게시 계획, 검토 일정을 정합니다",
        ],
        ["제작과 게시", "초안과 결과물을 검수하고 합의한 채널에서 운영합니다"],
        [
          "보고와 다음 계획",
          "운영 내역과 확인 가능한 반응을 바탕으로 다음 계획을 조정합니다",
        ],
      ]
    : [
        [
          "요구사항 정리",
          "현재 환경과 자료를 보고 작업 범위·견적·일정을 합의합니다",
        ],
        [
          "구조와 작업안 확인",
          "필요한 화면 또는 작업 흐름과 고객 확인 항목을 정합니다",
        ],
        [
          "구현과 실제 검수",
          "합의한 환경에서 화면과 기능, 오류 상황을 확인합니다",
        ],
        ["인계와 운영 안내", plan.handoff],
      ];
  return (
    <div className={`guide-page service-detail service-dark`}>
      <GuideNav division={root} active="services" />
      <ServiceTabs division={root} className="service-picker" />
      <section className="service-hero service-hero-visual review-container">
        <div className="service-hero-copy">
          <span className="review-eyebrow">{service.name}</span>
          <h1 aria-label={plan.headline.replace("\n", " ")}>
            {plan.headline.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p>{plan.intro}</p>
          <div className="service-actions">
            <Link className="service-primary" href={contact}>
              이 서비스 문의하기 ↗
            </Link>
            <a href="#service-scope">제공 범위 살펴보기 ↓</a>
          </div>
        </div>
        <ServiceMotion
          label={service.name + " · 작업 흐름"}
          frames={plan.example.steps.map(([title, copy]) => ({
            image: creativeAsset(service.division, service.id),
            title,
            copy,
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
        <aside className="service-price" aria-label="가격과 제공 기준">
          <span>가격과 제공 기준</span>
          <strong>{plan.price}</strong>
          <p>{plan.term}</p>
          <dl>
            {plan.facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="service-price-note">
            {monthly
              ? "세부 제작·수정·게시 범위는 상담 후 견적과 운영 계획에서 정합니다"
              : marketing
                ? "사이트 진단과 실제 적용·검수 범위는 접근 가능한 환경을 확인한 뒤 견적에서 정합니다"
                : developmentQuoteTerms}
          </p>
        </aside>
      </section>
      <section className="service-fit review-container">
        <h2>이럴 때 잘 맞습니다</h2>
        <ul>
          {plan.fit.map((fit, index) => (
            <li key={fit}>
              <span>0{index + 1}</span>
              {fit}
            </li>
          ))}
        </ul>
      </section>
      <section id="service-scope" className="service-scope review-container">
        <div className="service-section-heading">
          <span className="review-eyebrow">제공 범위</span>
          <h2>맡길 일과 준비할 일을 분명하게</h2>
          <p>포함 항목과 추가 협의 사항을 먼저 맞춥니다</p>
        </div>
        <div className="service-scope-grid">
          <div>
            <h3>제공하는 일</h3>
            <ul>
              {plan.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>
              {service.id === "shopping-mall" ? "제외·별도 확인" : "별도 협의"}
            </h3>
            <ul>
              {plan.optional.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>고객이 준비할 자료</h3>
            <ul>
              {service.inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              현재 준비된 자료부터 알려주세요 부족한 부분은 상담에서 함께
              정리합니다
            </p>
          </div>
        </div>
        {monthly && (
          <div className="service-benefit">
            <strong>
              월 운영 상품 혜택 · 기본 소개·문의 사이트 구축 또는 리뉴얼 1회
            </strong>
            <p>
              페이지 수와 수정·유지 범위는 견적에서 정합니다
              쇼핑몰·정기결제·추가 기능과 지속 운영 실비는 별도이며, 상품 결합
              시 혜택 중복 적용은 별도 확인합니다
            </p>
          </div>
        )}
      </section>
      <section className="service-example review-container">
        <div className="service-section-heading">
          <span className="review-eyebrow">구성 예시</span>
          <h2>{plan.example.title}</h2>
        </div>
        <ol className="service-example-flow">
          {plan.example.steps.map(([title, description], index) => (
            <li key={title}>
              <span className="example-step-no">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        <p className="service-example-note">{plan.example.note}</p>
      </section>
      <section className="service-process review-container">
        <div className="service-section-heading">
          <span className="review-eyebrow">진행 방법</span>
          <h2>
            {monthly
              ? "한 달의 운영을 함께 확인합니다"
              : "범위 합의부터 실제 사용까지"}
          </h2>
        </div>
        <ol>
          {stages.map(([title, description], index) => (
            <li key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
        {monthly && <p className="service-handoff">{plan.handoff}</p>}
      </section>
      <section className="service-faq review-container">
        <div className="service-section-heading">
          <span className="review-eyebrow">자주 묻는 질문</span>
          <h2>의뢰 전에 확인하세요</h2>
        </div>
        <div>
          {plan.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>
                {question}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="service-next review-container">
        <span className="review-eyebrow">{service.name} 상담</span>
        <h2>현재 상황부터 알려주세요</h2>
        <p>
          현재 상황과 필요한 결과물, 참고 자료를 알려주시면 범위와 견적을
          안내합니다
        </p>
        <Link href={contact} className="service-primary">
          이 서비스 문의하기 ↗
        </Link>
      </section>
    </div>
  );
}
