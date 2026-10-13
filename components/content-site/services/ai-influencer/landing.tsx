/* AI 인플루언서 서비스 모듈(WP-B). 서버 컴포넌트만(고유 client 섬 0개).
 * 히어로: 아치형 인물 카드(87언니 기준 얼굴) · 시그니처: 캐릭터 시트(#sheet) · 가격 위 띠: AI 가상인물 표기.
 * AI가 만든 사람 이미지는 모두 MEDIA_TAGS.aiPerson 태그와 `… · AI로 만든 가상인물` alt를 단다.
 * 고객 시안은 공통 CsWorks(서버 게이트)만 그린다. 이 파일에는 고객 문자열이 없다.
 * 스타일은 ./ai-influencer.css 한 파일, 선택자는 모두 .cs-svc-ai-influencer로 시작. */
import { HERO_TITLE_ID, CsHeroCopy } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { aiInfluencerSignature as sig } from "@/lib/content-site/services/ai-influencer";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import "./ai-influencer.css";

/** 87언니(자체 AI 가상인물) 이미지. 원본은 MCN 03_기록하는87 캐릭터·프로필 폴더, 크기만 줄인 webp(RESULT_WPB 자산 표).
 * 공개를 거두면 이 표의 src만 CONTENT_SITE_ASSETS.creator 등 공개 연출 예시로 바꾼다. */
const ASSETS = {
  hero: "/content-site/ai-influencer/unnie87-face.webp",
  views: {
    front: "/content-site/ai-influencer/unnie87-front.webp",
    side: "/content-site/ai-influencer/unnie87-side.webp",
    full: "/content-site/ai-influencer/unnie87-full.webp",
    street: "/content-site/ai-influencer/unnie87-street.webp",
  },
} as const;

function Hero({ data }: ServiceSectionProps) {
  const p = sig.persona;
  return (
    <section
      className="cs-hero cs-svc-ai-influencer-hero"
      data-cs-section="hero"
      aria-labelledby={HERO_TITLE_ID}
    >
      <div className="cs-svc-ai-influencer-halo" aria-hidden="true" />
      <div className="cs-container">
        <div className="cs-grid cs-hero-grid">
          <div className="cs-col-7">
            <CsHeroCopy id={data.id} hero={data.hero} />
          </div>
          <div className="cs-col-5 cs-svc-ai-influencer-stage">
            <figure className="cs-svc-ai-influencer-arch">
              <CsMedia
                ratio="2x3"
                className="cs-svc-ai-influencer-arch-media"
                src={ASSETS.hero}
                alt={p.alt}
                tag={MEDIA_TAGS.aiPerson}
                sizes="(max-width: 767px) 79vw, (max-width: 1023px) 420px, 34vw"
                priority
              />
              <figcaption className="cs-svc-ai-influencer-persona">
                <span className="cs-t-caption">{p.role}</span>
                <span className="cs-t-h3">{p.name}</span>
                <a href="#sheet" className="cs-link">
                  {p.sheetLink} <span aria-hidden="true">↓</span>
                </a>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

function Signature() {
  const s = sig.sheet;
  return (
    <section
      id="sheet"
      className="cs-section cs-section--alt cs-svc-ai-influencer-sheet"
      data-cs-section="signature"
      aria-labelledby="cs-ai-sheet-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-ai-sheet-title"
          eyebrow={s.eyebrow}
          title={s.title}
          lead={s.lead}
        />
        <div className="cs-grid cs-svc-ai-influencer-sheet-grid">
          <ul
            className="cs-col-7 cs-svc-ai-influencer-views"
            aria-label={s.viewsLabel}
          >
            {s.views.map((view) => (
              <li
                key={view.id}
                className="cs-svc-ai-influencer-view"
                data-view={view.id}
              >
                <CsMedia
                  ratio="3x4"
                  src={ASSETS.views[view.id]}
                  alt={view.alt}
                  tag={MEDIA_TAGS.aiPerson}
                  sizes="(max-width: 1023px) 46vw, 24vw"
                />
                <p className="cs-t-label">{view.label}</p>
              </li>
            ))}
          </ul>
          <div className="cs-col-5 cs-svc-ai-influencer-profile">
            <div className="cs-svc-ai-influencer-profile-head">
              <p className="cs-t-caption">{s.profile.role}</p>
              <h3 className="cs-t-h3">{s.profile.name}</h3>
              <p className="cs-t-body">{s.profile.body}</p>
            </div>
            <dl className="cs-svc-ai-influencer-rows">
              {s.rows.map((row) => (
                <div key={row.term} className="cs-svc-ai-influencer-row">
                  <dt className="cs-t-label">{row.term}</dt>
                  <dd className="cs-t-body">{row.detail}</dd>
                </div>
              ))}
            </dl>
            <p className="cs-svc-ai-influencer-note cs-t-small">{s.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforePricing() {
  const d = sig.disclosure;
  return (
    <section
      className="cs-section cs-section--sm cs-svc-ai-influencer-disclosure"
      data-cs-section="signature"
      aria-labelledby="cs-ai-disclosure-title"
    >
      <div className="cs-container">
        <div className="cs-svc-ai-influencer-band">
          <span className="cs-svc-ai-influencer-band-mark cs-t-label" aria-hidden="true">
            AI
          </span>
          <div className="cs-svc-ai-influencer-band-copy">
            <h3 id="cs-ai-disclosure-title" className="cs-t-h3">
              {d.title}
            </h3>
            <p className="cs-t-body">{d.body}</p>
          </div>
          <ul className="cs-svc-ai-influencer-band-items">
            {d.items.map((item) => (
              <li key={item} className="cs-t-chip">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export const aiInfluencerLanding: ServiceModule = {
  Hero,
  Signature,
  BeforePricing,
  worksLayout: "vertical",
};
