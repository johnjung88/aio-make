/* ai-influencer 서비스 모듈 — WP0 스텁(기본 2열 히어로 + 공통 블록만). 이후 WP-B 소유.
 * WP-B가 채울 것: 캐릭터 시트(id="sheet") · BeforePricing: AI 가상인물 표기 띠.
 * 규칙: 서비스 고유 스타일은 ./ai-influencer.css 한 파일, 선택자는 모두 .cs-svc-ai-influencer로 시작. 자산 경로는 이 파일 상단 상수 한 곳에. */
import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import "./ai-influencer.css";

const HERO_MEDIA = {
  src: CONTENT_SITE_ASSETS.creator.src,
  alt: "AI 인플루언서 인물 연출 예시 · AI로 만든 가상인물",
  tag: MEDIA_TAGS.aiPerson,
};

function Hero({ data }: ServiceSectionProps) {
  return (
    <CsHero
      id={data.id}
      hero={data.hero}
      className="cs-svc-ai-influencer-hero"
      media={
        <CsMedia
          ratio="2x3"
          src={HERO_MEDIA.src}
          alt={HERO_MEDIA.alt}
          tag={HERO_MEDIA.tag}
          sizes="(max-width: 1023px) 90vw, 40vw"
          priority
        />
      }
    />
  );
}

export const aiInfluencerLanding: ServiceModule = {
  Hero,
  worksLayout: "vertical",
};
