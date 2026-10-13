/* 브랜드 홍보 영상 서비스 모듈(WP-C 소유, BRIEF_P2R_SERVICES 5절).
 * - Hero: 화면 전체 배경 영상(아래층 이미지가 LCP, 위층 12초 무음 영상은 frame.tsx가 마운트 후 재생).
 *   문구는 왼쪽 아래, 오른쪽 아래에 `연출 예시 · 무음` 태그와 영상 일시정지 버튼(고유 client 섬 1개).
 * - Signature: 이야기 순서(큰 문장 3행 + 세로 이미지) → 길이별 구성 예시(30초·60초 타임라인 + 해당 금액·상담 링크).
 * 스타일은 ./brand-film.css(.cs-svc-brand-film로 시작), 자산 경로는 아래 ASSETS 한 곳. */
import { formatWon, pricingPlans } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import type { BrandFilmSignature } from "@/lib/content-site/services/brand-film";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import { CsHeroCopy, HERO_TITLE_ID } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { CsTag } from "../../ui/tag";
import { FilmControl } from "./film-control";
import "./brand-film.css";

const ASSETS = {
  /** 배경 영상 아래층(LCP·재생 전 화면) */
  heroStill: CONTENT_SITE_ASSETS.hero.src,
  /** 12초 무음 반복 영상 */
  heroMotion: CONTENT_SITE_ASSETS.brandMotion.src,
  /** 이야기 순서 옆 세로 이미지(3:4 크롭) */
  story: "/creative-v06/video-brand-film.webp",
} as const;

const sig = (data: ServiceSectionProps["data"]) =>
  data.signature as BrandFilmSignature;

function Hero({ data }: ServiceSectionProps) {
  const s = sig(data).hero;
  return (
    <section
      className="cs-hero cs-svc-brand-film-hero"
      data-cs-section="hero"
      aria-labelledby={HERO_TITLE_ID}
    >
      <CsMedia
        kind="video"
        ratio="16x9"
        className="cs-svc-brand-film-backdrop"
        src={ASSETS.heroMotion}
        alt={s.videoLabel}
        autoplay
        preload="metadata"
        under={{ src: ASSETS.heroStill, sizes: "100vw", priority: true }}
      />
      <div className="cs-svc-brand-film-shade" aria-hidden="true" />
      <div className="cs-container">
        <div className="cs-svc-brand-film-hero-inner">
          <CsHeroCopy id={data.id} hero={data.hero} />
          <div className="cs-svc-brand-film-meta">
            <CsTag>{MEDIA_TAGS.stagedMuted}</CsTag>
            <FilmControl pauseLabel={s.pause} playLabel={s.play} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Story({ data }: ServiceSectionProps) {
  const s = sig(data).story;
  return (
    <section
      className="cs-section cs-section--alt cs-svc-brand-film-story"
      data-cs-section="signature"
      aria-labelledby="cs-svc-brand-film-story-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-svc-brand-film-story-title"
          eyebrow={s.eyebrow}
          title={s.title}
          lead={s.lead}
        />
        <div className="cs-grid cs-svc-brand-film-story-grid">
          <ol className="cs-svc-brand-film-story-list cs-col-7">
            {s.rows.map((row, i) => (
              <li
                key={row.statement}
                className="cs-svc-brand-film-story-row"
                data-reveal
              >
                <span className="cs-t-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="cs-svc-brand-film-story-text">
                  <h3 className="cs-t-statement">{row.statement}</h3>
                  <p className="cs-t-body">{row.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="cs-svc-brand-film-story-media cs-col-4 cs-col-start-9">
            <CsMedia
              ratio="3x4"
              src={ASSETS.story}
              alt={s.mediaAlt}
              tag={MEDIA_TAGS.staged}
              sizes="(max-width: 767px) 90vw, (max-width: 1023px) 60vw, 30vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Length({ data }: ServiceSectionProps) {
  const s = sig(data).length;
  const plans = pricingPlans(data.id).groups.flatMap((g) => g.plans);
  // 막대 길이: 가장 긴 길이(60초)는 전체 폭, 30초는 절반. 칸 폭은 줄 안에서 균등(시간 비율을 주장하지 않는다).
  const seconds = (length: string) => Number.parseInt(length, 10);
  const longest = Math.max(...s.rows.map((row) => seconds(row.length)));
  const c = CS_COPY.pricing;
  return (
    <section
      className="cs-section cs-svc-brand-film-length"
      data-cs-section="signature"
      aria-labelledby="cs-svc-brand-film-length-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-svc-brand-film-length-title"
          eyebrow={s.eyebrow}
          title={s.title}
        />
        <ul className="cs-svc-brand-film-lengths">
          {s.rows.map((row) => {
            const plan = plans.find((p) => p.label === row.length);
            const headId = `cs-svc-brand-film-length-${seconds(row.length)}`;
            return (
              <li
                key={row.length}
                className="cs-svc-brand-film-length-row"
                data-reveal
              >
                <div className="cs-svc-brand-film-length-head">
                  <h3 id={headId} className="cs-t-h3">
                    {row.length}
                  </h3>
                  {plan ? (
                    <>
                      <p className="cs-svc-brand-film-length-price">
                        <span className="cs-t-price-sm">
                          {formatWon(plan.amount)}
                        </span>
                        <span className="cs-t-small">{c.vat}</span>
                      </p>
                      <a
                        href="#inquiry"
                        className="cs-link"
                        data-plan={plan.key}
                      >
                        {c.cta} <span aria-hidden="true">↓</span>
                      </a>
                    </>
                  ) : null}
                </div>
                <ol
                  className="cs-svc-brand-film-parts"
                  aria-labelledby={headId}
                  data-span={seconds(row.length) === longest ? "full" : "half"}
                >
                  {row.parts.map((part) => (
                    <li key={part} className="cs-t-small">
                      {part}
                    </li>
                  ))}
                </ol>
              </li>
            );
          })}
        </ul>
        <p className="cs-svc-brand-film-length-note cs-t-small">{s.note}</p>
      </div>
    </section>
  );
}

function Signature(props: ServiceSectionProps) {
  return (
    <>
      <Story {...props} />
      <Length {...props} />
    </>
  );
}

export const brandFilmLanding: ServiceModule = {
  Hero,
  Signature,
  worksLayout: "wide",
};
