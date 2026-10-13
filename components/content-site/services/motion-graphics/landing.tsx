/* motion-graphics 서비스 모듈 — WP0 스텁(기본 2열 히어로 + 공통 블록만). 이후 WP-B 소유.
 * WP-B가 채울 것: 키네틱 타이포 무대 히어로 · 단순형과 맞춤형 · 정지 화면 → 움직임.
 * 규칙: 서비스 고유 스타일은 ./motion-graphics.css 한 파일, 선택자는 모두 .cs-svc-motion-graphics로 시작. 자산 경로는 이 파일 상단 상수 한 곳에. */
import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import "./motion-graphics.css";

const HERO_MEDIA = {
  src: CONTENT_SITE_ASSETS.hero.src,
  alt: "보라색 유리 곡면이 흐르는 그래픽 장면 연출 예시",
  tag: MEDIA_TAGS.staged,
};

function Hero({ data }: ServiceSectionProps) {
  return (
    <CsHero
      id={data.id}
      hero={data.hero}
      className="cs-svc-motion-graphics-hero"
      media={
        <CsMedia
          ratio="1x1"
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

export const motionGraphicsLanding: ServiceModule = {
  Hero,
  worksLayout: "wide",
};
