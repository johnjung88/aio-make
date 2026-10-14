/* 서비스 히어로 공통 요소(BRIEF_P2R_SERVICES 0-2). 배치는 서비스마다 다르므로
 * - CsHeroCopy: eyebrow → h1 → lead → 가격 한 줄 → 상담 신청 버튼 1개 (R6: facts · 안내 줄 · 가격 보기 버튼 삭제)
 * - CsHero: 기본 2열 배치(문구 7/12 + 미디어 5/12). 서비스가 배치를 바꾸려면 className·media·backdrop을 쓰거나
 *   자기 섹션을 직접 그리되 CsHeroCopy와 data-cs-section="hero", aria-labelledby="cs-hero-title"을 유지한다. */
import { CS_COPY } from "@/lib/content-site/copy";
import type {
  ContentServiceId,
  ServiceLandingData,
} from "@/lib/content-site/types";
import { CsPrice } from "../ui/price";

export const HERO_TITLE_ID = "cs-hero-title";

export function CsHeroCopy({
  id,
  hero,
}: {
  id: ContentServiceId;
  hero: ServiceLandingData["hero"];
}) {
  return (
    <div className="cs-hero-copy">
      <p className="cs-t-eyebrow">{hero.eyebrow}</p>
      <h1 id={HERO_TITLE_ID} className="cs-t-display">
        {hero.title}
      </h1>
      <p className="cs-hero-lead cs-t-lead">{hero.lead}</p>
      <CsPrice id={id} />
      <div className="cs-hero-actions">
        <a href="#inquiry" className="cs-btn cs-btn--primary cs-btn--lg">
          {CS_COPY.hero.primary} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}

export function CsHero({
  id,
  hero,
  media,
  backdrop,
  className,
}: {
  id: ContentServiceId;
  hero: ServiceLandingData["hero"];
  /** 오른쪽 5/12 미디어(태그 포함) */
  media?: React.ReactNode;
  /** 섹션 전체 배경층(장식·배경 영상). 문구 뒤에 깔린다 */
  backdrop?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={"cs-hero" + (className ? " " + className : "")}
      data-cs-section="hero"
      aria-labelledby={HERO_TITLE_ID}
    >
      {backdrop}
      <div className="cs-container">
        <div className="cs-grid cs-hero-grid">
          <div className="cs-col-7">
            <CsHeroCopy id={id} hero={hero} />
          </div>
          {media ? (
            <div className="cs-hero-media cs-col-5">{media}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
