/* brand-film 서비스 모듈 — WP0 스텁(기본 2열 히어로 + 공통 블록만). 이후 WP-C 소유.
 * WP-C가 채울 것: 화면 전체 배경 영상 히어로(일시정지 버튼 client 섬 1개) · 이야기 순서 · 길이별 구성 예시.
 * 규칙: 서비스 고유 스타일은 ./brand-film.css 한 파일, 선택자는 모두 .cs-svc-brand-film로 시작. 자산 경로는 이 파일 상단 상수 한 곳에. */
import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import "./brand-film.css";

const HERO_MEDIA = {
  src: CONTENT_SITE_ASSETS.hero.src,
  alt: "보라색 유리 곡면이 흐르는 브랜드 영상 장면 연출 예시",
  tag: MEDIA_TAGS.staged,
};

function Hero({ data }: ServiceSectionProps) {
  return (
    <CsHero
      id={data.id}
      hero={data.hero}
      className="cs-svc-brand-film-hero"
      media={
        <CsMedia
          ratio="16x9"
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

export const brandFilmLanding: ServiceModule = {
  Hero,
  worksLayout: "wide",
};
