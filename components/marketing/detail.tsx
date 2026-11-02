import Link from "next/link";
import { marketingFaq } from "@/lib/marketing-faq";
import { type Service } from "@/lib/content";
import { servicePlans } from "@/lib/service-plans";
import {
  marketingCopy,
  marketingIds,
  marketingNames,
  marketingContact,
  monthlySteps,
  seoSteps,
  aiSteps,
  type MarketingId,
} from "@/lib/marketing-renewal";
import { NewTabHint } from "@/components/new-tab-hint";
import { ServiceExperience } from "./experience";
import {
  MarketingHead,
  MarketingPicture,
  MarketingCards,
  MarketingProcess,
  MarketingFaq,
  MarketingInquiry,
} from "./blocks";
export function MarketingDetail({
  service,
}: {
  service: Service;
  references?: React.ReactNode;
}) {
  const id = service.id as MarketingId;
  if (!marketingIds.includes(id)) return null;
  const plan = servicePlans[id],
    copy = marketingCopy[id];
  const steps =
    id === "seo"
      ? seoSteps
      : id === "ai-influencer"
        ? aiSteps
        : monthlySteps.map((step, i) =>
            id === "sns"
              ? [
                  step[0],
                  step[1],
                  [
                    "보유 사진 목록",
                    "월간 주제",
                    "게시 전 초안",
                    "다음 달 주제",
                  ][i],
                ]
              : step,
          );
  return (
    <div className={"mk-detail mk-detail-" + id}>
      <section className="mk-detail-hero mk-container">
        <div className="mk-detail-copy">
          <p className="mk-eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="mk-lead">
            {copy.intro}
            {id === "seo" && (
              <>
                <br />
                SEO 검색 구조 · AEO 질문과 답변 · GEO 참고할 사실 정보
              </>
            )}
          </p>
          <p className="mk-hero-price">
            <strong>{copy.price}</strong>
            <span>{copy.term}</span>
          </p>
        </div>
        <div className="mk-hero-image">
          <MarketingPicture
            name={id + "-hero"}
            alt={marketingNames[id] + " 결과물 방향 예시"}
            hero
          />
        </div>
        <div className="mk-actions">
          <Link className="mk-primary" href={marketingContact(id, "hero")}>
            {marketingNames[id]} 상담하기 ↗
          </Link>
          <a href="#signature">{copy.secondary} ↓</a>
        </div>
      </section>
      <section className="mk-fit mk-container">
        <ol>
          {plan.fit.map((fit, i) => (
            <li key={fit}>
              <span>0{i + 1}</span>
              {fit}
            </li>
          ))}
        </ol>
        <div>
          <a href="#pricing">구성과 가격 보기 ↓</a>
        </div>
      </section>
      <section className="mk-section mk-container" id="signature">
        <MarketingHead
          id="signature-title"
          eyebrow={copy.signature[0]}
          title={copy.signature[1]}
          lead={copy.signature[2]}
        />
        <ServiceExperience service={id} />
      </section>
      <section className="mk-section mk-container" id="deliverables">
        <MarketingHead
          id="results-title"
          eyebrow="WHAT YOU GET"
          title={copy.resultsTitle}
          lead={copy.resultsLead}
        />
        <div className="mk-deliverables">
          {copy.results.map(([title, desc], i) => (
            <figure key={title}>
              <MarketingPicture
                name={id + "-result-" + (i + 1)}
                alt={title + " 화면 예시"}
              />
              <figcaption>
                <h3>{title}</h3>
                <p>{desc}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mk-caption">제작 방향 예시</p>
      </section>
      <section className="mk-section mk-container" id="pricing">
        <MarketingHead
          id="pricing-title"
          eyebrow="SCOPE & PRICE"
          title={copy.pricingTitle}
          lead={
            id === "seo"
              ? "접근 가능한 환경을 확인한 뒤 견적을 드립니다"
              : "표시 금액은 부가세 별도입니다"
          }
        />
        <div className="mk-pricing">
          <div>
            <p className="mk-eyebrow">{marketingNames[id]}</p>
            <strong className="mk-price">{copy.price}</strong>
            <p>{copy.term}</p>
            <Link className="mk-primary" href={marketingContact(id, "pricing")}>
              이 구성으로 상담 ↗
            </Link>
          </div>
          <dl>
            {plan.facts.slice(0, 3).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {id === "integrated" && (
          <p className="mk-note">
            원본은 새로 만드는 컨텐츠 · 게시는 채널에 올리는 횟수
          </p>
        )}
        <div className="mk-scope">
          {[
            ["포함", plan.included],
            ["별도 협의", plan.optional],
            ["준비하면 좋은 것", service.inputs],
          ].map(([title, items]) => (
            <div key={String(title)}>
              <h3>{title}</h3>
              <ul>
                {(items as string[]).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {id !== "seo" && (
          <p className="mk-note">
            월 운영 상품 혜택 · 기본 소개·문의 사이트 구축 또는 리뉴얼 1회
            <br />
            페이지 수와 수정·유지 범위는 견적에서 정합니다
            <br />
            쇼핑몰·정기결제·추가 기능과 운영 실비는 별도이며 결합 시 혜택 중복
            적용은 별도 확인합니다
          </p>
        )}
        {id === "ai-influencer" && (
          <>
            <p className="mk-note">
              가상 인물을 실제 사용 후기의 주인공으로 표현하지 않습니다
            </p>
            <p className="mk-note">
              <Link
                href="/content/services/ai-influencer"
                target="_blank"
                rel="noopener noreferrer"
              >
                한 번만 만들고 싶다면 컨텐츠 분야 AI 인플루언서 제작 보기{" "}
                <NewTabHint />
              </Link>
            </p>
          </>
        )}
      </section>
      <section className="mk-section mk-container">
        <MarketingHead
          id="process-title"
          eyebrow="PROCESS"
          title={copy.processTitle}
          lead={
            id === "sns"
              ? "초안을 확인한 뒤 채널에 게시합니다"
              : "단계마다 고객이 확인할 것을 먼저 정합니다"
          }
        />
        <MarketingProcess steps={steps} />
      </section>
      <section id="faq" className="mk-section mk-container">
        <MarketingHead
          id="faq-title"
          eyebrow="FAQ"
          title={
            id === "seo"
              ? "진단 전에\n많이 묻는 질문"
              : "운영 전에\n많이 묻는 질문"
          }
        />
        <MarketingFaq faq={marketingFaq(id)} />
        <p className="mk-resource-links">
          <Link href="/guides/project-checklist">의뢰 준비표 내려받기</Link>
          <Link href="/terms">이용 안내</Link>
        </p>
      </section>
      <section className="mk-section mk-container">
        <MarketingHead
          id="related-title"
          eyebrow="OTHER SERVICES"
          title={"다른 운영도\n살펴보세요"}
        />
        <MarketingCards current={id} />
        {id === "seo" && (
          <p className="mk-note">
            <Link
              href="/lab/services/website"
              target="_blank"
              rel="noopener noreferrer"
            >
              사이트부터 새로 만들어야 한다면 웹사이트 제작 <NewTabHint />
            </Link>
          </p>
        )}
      </section>
      <MarketingInquiry service={id} />
    </div>
  );
}
