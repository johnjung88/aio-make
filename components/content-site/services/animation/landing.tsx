/* animation 서비스 모듈 — WP0 스텁(기본 2열 히어로 + 공통 블록만). 이후 WP-A 소유.
 * WP-A가 채울 것: 움직이기 전 확인 3탭(client 섬 1개).
 * 규칙: 서비스 고유 스타일은 ./animation.css 한 파일, 선택자는 모두 .cs-svc-animation로 시작. 자산 경로는 이 파일 상단 상수 한 곳에. */
import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import "./animation.css";

const HERO_MEDIA = {
  src: CONTENT_SITE_ASSETS.animation.src,
  alt: "보라색 캐릭터가 계단 위에 선 애니메이션 장면 연출 예시",
  tag: MEDIA_TAGS.staged,
};

function Hero({ data }: ServiceSectionProps) {
  return (
    <CsHero
      id={data.id}
      hero={data.hero}
      className="cs-svc-animation-hero"
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

export const animationLanding: ServiceModule = {
  Hero,
  worksLayout: "vertical",
};
