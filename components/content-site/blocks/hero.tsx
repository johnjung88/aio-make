/* 서비스 히어로 공통 요소(BRIEF_P2R_SERVICES 0-2). 배치는 서비스마다 다르므로
 * - CsHeroCopy: eyebrow → h1 → lead → 가격 칩 → 안내 줄 → 버튼 2개 → facts 3개 (모든 서비스 같은 규칙)
 * - CsHero: 기본 2열 배치(문구 7/12 + 미디어 5/12). 서비스가 배치를 바꾸려면 className·media·backdrop을 쓰거나
 *   자기 섹션을 직접 그리되 CsHeroCopy와 data-cs-section="hero", aria-labelledby="cs-hero-title"을 유지한다. */
import { startingPrice } from "@/lib/content-pricing";
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
  const price = startingPrice(id, true);
  return (
    <div className="cs-hero-copy">
      <p className="cs-t-eyebrow">{hero.eyebrow}</p>
      <h1 id={HERO_TITLE_ID} className="cs-t-display">
        {hero.title}
      </h1>
      <p className="cs-hero-lead cs-t-lead">{hero.lead}</p>
      <CsPrice id={id} />
      {price?.note ? (
        <p className="cs-hero-note cs-t-small">{price.note}</p>
      ) : null}
      {hero.note ? <p className="cs-hero-note cs-t-small">{hero.note}</p> : null}
      <div className="cs-hero-actions">
        <a href="#inquiry" className="cs-btn cs-btn--primary cs-btn--lg">
          {CS_COPY.hero.primary} <span aria-hidden="true">↓</span>
        </a>
        <a href="#pricing" className="cs-btn cs-btn--ghost cs-btn--lg">
          {CS_COPY.hero.secondary} <span aria-hidden="true">↓</span>
        </a>
      </div>
      <ul className="cs-hero-facts" aria-label={CS_COPY.hero.factsLabel}>
        {hero.facts.map((fact) => (
          <li key={fact} className="cs-t-small">
            {fact}
          </li>
        ))}
      </ul>
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
