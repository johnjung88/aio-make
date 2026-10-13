/* webtoon 서비스 모듈 — WP0 스텁(기본 2열 히어로 + 공통 블록만). 이후 WP-A 소유.
 * WP-A가 채울 것: 세로 리더(id="reader") · 웹툰 + 모션코믹 묶음.
 * 규칙: 서비스 고유 스타일은 ./webtoon.css 한 파일, 선택자는 모두 .cs-svc-webtoon로 시작. 자산 경로는 이 파일 상단 상수 한 곳에. */
import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import "./webtoon.css";

const HERO_MEDIA = {
  src: "/webtoon-v11/cut-01.webp",
  alt: "《1억의 구단주》 1화 표지 컷 · AIO 자체 웹툰 제작 예시",
  tag: MEDIA_TAGS.ownWebtoon,
};

function Hero({ data }: ServiceSectionProps) {
  return (
    <CsHero
      id={data.id}
      hero={data.hero}
      className="cs-svc-webtoon-hero"
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

export const webtoonLanding: ServiceModule = {
  Hero,
  worksLayout: "webtoon",
};
