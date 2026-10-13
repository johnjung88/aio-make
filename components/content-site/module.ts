/* 서비스 모듈 계약(WP0). 각 services/<id>/landing.tsx가 이 모양으로 내보내고
 * service-landing.tsx(레지스트리)가 고정 순서로 조립한다:
 *   Hero → types(공통) → Signature → works(공통, 검토 빌드만) → BeforePricing → pricing → process → scope → faq → inquiry → related
 * 공통 블록·순서·바탕은 레지스트리가 정한다. 서비스는 Hero·Signature·BeforePricing·worksLayout만 정한다. */
import type { ReactNode } from "react";
import type {
  CsWorksLayout,
  ServiceLandingData,
} from "@/lib/content-site/types";

export type ServiceSectionProps = { data: ServiceLandingData };

export type ServiceModule = {
  /** data-cs-section="hero"와 aria-labelledby="cs-hero-title"(CsHeroCopy)를 유지한다 */
  Hero: (props: ServiceSectionProps) => ReactNode;
  /** 서비스 고유 섹션 1~2개(data-cs-section="signature") */
  Signature?: (props: ServiceSectionProps) => ReactNode;
  /** 가격 섹션 바로 위 띠(예: AI 인플루언서 AI 가상인물 표기) */
  BeforePricing?: (props: ServiceSectionProps) => ReactNode;
  /** CsWorks 변형 */
  worksLayout: CsWorksLayout;
};
