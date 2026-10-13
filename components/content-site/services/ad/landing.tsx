/* ad 서비스 모듈 — WP0 스텁(기본 2열 히어로 + 공통 블록만). 이후 WP-C 소유.
 * WP-C가 채울 것: 9:16 카드 콜라주 히어로 · 첫 장면 설계 9:16 프레임 3개.
 * 규칙: 서비스 고유 스타일은 ./ad.css 한 파일, 선택자는 모두 .cs-svc-ad로 시작. 자산 경로는 이 파일 상단 상수 한 곳에. */
import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import "./ad.css";

const HERO_MEDIA = {
  src: "/creative-v06/video-sns-ad.webp",
  alt: "물방울이 튀는 보라색 음료 캔 광고 장면 연출 예시",
  tag: MEDIA_TAGS.staged,
};

function Hero({ data }: ServiceSectionProps) {
  return (
    <CsHero
      id={data.id}
      hero={data.hero}
      className="cs-svc-ad-hero"
      media={
        <CsMedia
          ratio="4x5"
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

export const adLanding: ServiceModule = {
  Hero,
  worksLayout: "vertical",
};
