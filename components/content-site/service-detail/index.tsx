import { displayCopy } from "@/lib/display-copy";
import { formatWon, pricingPlans, PRICING_COMMON, WEBTOON_PAGE_STANDARD } from "@/lib/content-pricing";
import { DETAIL_CASES, DETAIL_COPY, DETAIL_SCOPE } from "@/lib/content-site/service-detail-content";
import type { ContentServiceId } from "@/lib/content-site/types";
import { serviceCasePresentation, type ServiceCase } from "@/lib/service-case-schema";
import { seedServiceCases } from "@/lib/service-cases.server";
import { CsInquiry } from "../blocks/inquiry";
import { CsRelated } from "../blocks/related";
import { WebtoonDetail } from "./webtoon";
import { AnimationDetail, AiInfluencerDetail } from "./character-details";
import { MotionGraphicsDetail, BrandFilmDetail, AdDetail } from "./film-details";
import { DetailSection } from "./shared";
import { AdditionalCases, type PublicServiceCase } from "./additional-cases";
import { RecordDetail } from "./record-detail";
import { ServiceExperience } from "./experience";
import { ServiceTools } from "./service-tools";
import { StartingBoard } from "./starting-board";
import "./detail.css";

const detail = { webtoon: WebtoonDetail, animation: AnimationDetail, "ai-influencer": AiInfluencerDetail, "motion-graphics": MotionGraphicsDetail, "brand-film": BrandFilmDetail, ad: AdDetail };
const consumed: Record<ContentServiceId, string[]> = {
  webtoon: ["CASE-CLUBOWNER-EP01", "CASE-YOFREE-OUTING"],
  animation: ["CASE-YOFREE-CHARACTER"],
  "ai-influencer": ["CASE-UNNIE87-MODEL", "CASE-BWL-CPLUS-AD", "CASE-BWL-CLEANSER-AD"],
  "motion-graphics": ["CASE-BWL-BRAND-MOTION", "CASE-HEALERNET-MOTION", "CASE-YOFREE-CHARACTER", "CASE-AIO-BRAND-INTRO", "CASE-YOFREE-SHORT"],
  "brand-film": ["CASE-BWL-BRAND-AD", "CASE-YOFREE-JINSANG", "CASE-BWL-BRAND-MOTION", "CASE-HEALERNET-MOTION", "CASE-AIO-BRAND-INTRO"],
  ad: ["CASE-BWL-CPLUS-AD", "CASE-BWL-CLEANSER-AD", "CASE-YOFREE-CHARACTER"],
};
const publicCase = ({ caseId, title, summary, scope, publicLabel, assets, services, brief, decisions, stages }: ServiceCase): PublicServiceCase => ({ caseId, title, summary, scope, publicLabel, assets, services, brief, decisions, stages });

function Pricing({ id }: { id: ContentServiceId }) {
  const { groups, notes } = pricingPlans(id);
  const orderedGroups = id === "webtoon" ? [...groups].sort((a, b) => Number(b.bundle) - Number(a.bundle)) : groups;
  return <DetailSection id="pricing" eyebrow="SCOPE & PRICE" title={id === "webtoon" ? "웹툰과 영상, 함께 제작하세요" : "필요한 구성으로 시작하세요"} lead={id === "webtoon" ? "웹툰과 모션코믹을 함께 만드는 세트입니다\n웹툰 제작이나 영상 편집만 따로 의뢰할 수도 있습니다" : "필요한 결과물과 보유 자료에 맞춰 구성을 고르세요\n표시 금액은 모두 부가세 별도입니다"}>
    <div className="sd-price-groups">{orderedGroups.map((group) => <div className={`sd-price-group${group.bundle ? " sd-price-group--bundle" : ""}`} key={group.key}>
      {group.bundle ? <p className="sd-bundle-label">WEBTOON + MOTION COMIC · 함께 제작</p> : null}
      {group.title ? <h3>{group.title}</h3> : null}<div className="sd-price-grid">{group.plans.map((plan) => <article key={plan.key} data-price-plan={plan.key}>
        <h4>{plan.option}</h4><p className="sd-price-amount">{formatWon(plan.amount)}</p>
        <a className="sd-text-link" href="#inquiry" data-plan={plan.key} data-entry="pricing" data-material={plan.key.startsWith("motion-comic") ? "완성 웹툰 있음" : undefined}>이 구성으로 문의<span aria-hidden="true">↗</span></a>
      </article>)}</div>
    </div>)}</div>
    <ul className="sd-price-notes">{[PRICING_COMMON.vat, ...notes, PRICING_COMMON.revisions, PRICING_COMMON.bulk].map((note) => <li key={note}>{note}</li>)}</ul>
    {id === "webtoon" ? <p className="sd-lead sd-unit-note">{`1P 기준: ${WEBTOON_PAGE_STANDARD.label} (세로형 ${WEBTOON_PAGE_STANDARD.ratio})\n웹툰 상품은 12P·24P, 영상 상품은 30초·60초입니다\n대표 사례는 25P와 40초 영상으로 제작했습니다`}</p> : null}
    <div className="sd-scope"><div><h3>함께 확인하는 범위</h3><ul>{DETAIL_SCOPE[id].included.map((line) => <li key={line}>{line}</li>)}</ul></div>
      <div><h3>의뢰에 맞춰 정하는 항목</h3><ul>{DETAIL_SCOPE[id].confirm.map((line) => <li key={line}>{line}</li>)}<li>납기·추가 규격·편집 원본·사용 조건은 의뢰 범위를 확인해 안내합니다</li></ul></div></div>
  </DetailSection>;
}

export function ServiceDetail({ id, cases }: { id: ContentServiceId; cases: ServiceCase[] }) {
  cases = displayCopy(cases);
  const Detail = detail[id]; const copy = DETAIL_COPY[id];
  const { primary, useAuthoredJourney } = serviceCasePresentation(seedServiceCases, cases, id, DETAIL_CASES[id].caseId);
  const choices = cases.map((record) => ({ caseId: record.caseId, title: record.title }));
  const publicCases = cases.filter((record) => useAuthoredJourney ? !consumed[id].includes(record.caseId) : record.caseId !== primary?.caseId).map(publicCase);
  return <div className={`sd sd-service-${id}`}><ServiceExperience>
    {useAuthoredJourney ? <Detail /> : <RecordDetail service={id} record={primary ? publicCase(primary) : null} />}
    <ServiceTools service={id} />
    <StartingBoard service={id} />
    <AdditionalCases cases={publicCases} service={id} />
    <Pricing id={id} />
    <DetailSection id="faq" eyebrow="FAQ" title="의뢰 전에 궁금한 점">
      <div className="sd-faq-list">{copy.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
    </DetailSection>
    <CsInquiry service={id} copy={copy.inquiry} caseOptions={choices} defaultCase={primary ? { caseId: primary.caseId, title: primary.title } : undefined} />
    <CsRelated current={id} />
  </ServiceExperience></div>;
}
