/* SNS 광고 영상 서비스 모듈(WP-C 소유, BRIEF_P2R_SERVICES 6절).
 * - Hero: 왼쪽 문구 + 오른쪽 끝까지 닿는 9:16 카드 콜라주(3열 9장, 전체 -12도, 가운데 열 72px 아래).
 *   레일 왕복은 ./ad.css의 CSS 키프레임(reduced-motion: no-preference 안)이 맡고 헤더 움직임 토글·reduced-motion에서 멈춘다.
 *   콜라주는 장식이라 카드 이미지 alt는 비우고 컨테이너 하나에만 aria-label을 둔다. 사람이 나오는 이미지는 쓰지 않는다.
 * - Signature: 첫 장면 설계. 같은 연출 예시 이미지를 장면마다 다르게 잘라 한 편 안의 세 장면(첫 장면·제품 장면·마지막 장면)을
 *   9:16 휴대폰 틀에 보여주고, 틀 위 화면 요소(진행 막대 + 장면마다 실제 문구 하나: 첫 장면 큰 문구·제품 장면 자막·
 *   마지막 장면 버튼)는 장식(aria-hidden)이다. 내용은 이미지 alt가 설명한다. 틀은 ≥768에서 3칸 양 끝에 맞춰 퍼진다.
 * 스타일은 ./ad.css(.cs-svc-ad로 시작), 자산 경로는 아래 ASSETS 한 곳. 광고 성과 수치는 쓰지 않는다. */
import type { AdSignature } from "@/lib/content-site/services/ad";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import { CsHeroCopy, HERO_TITLE_ID } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";

import "./ad.css";

/** 공개 연출 예시 이미지(사람 없음). 같은 원본은 한 곳에서만 같은 sizes로 쓴다(/_next/image 중복 요청 0). */
const ASSETS = {
  can: "/creative-v06/video-sns-ad.webp",
  products: "/renewal/shop-products.webp",
  cafe: "/creative-v06/marketing-sns.webp",
  bottle: "/renewal/brand-film-v03.webp",
  glass: "/renewal/video.webp",
  /** 첫 장면 설계 프레임 3개가 함께 쓰는 세로 이미지 */
  hook: CONTENT_SITE_ASSETS.brand.src,
} as const;

const HOOK_SIZES = "(max-width: 767px) 80vw, 30vw";

/** 휴대폰 화면 위 문구(frames[i].screen)의 모양과 글자 역할. 장면 순서대로 첫 장면 큰 문구 · 자막 띠 · 버튼 */
const SCREEN_TEXT = [
  { kind: "headline", role: "cs-t-h3" },
  { kind: "caption", role: "cs-t-caption" },
  { kind: "cta", role: "cs-t-label" },
] as const;

const sig = (data: ServiceSectionProps["data"]) => data.signature as AdSignature;

function Hero({ data }: ServiceSectionProps) {
  const cards = [
    { src: ASSETS.can, label: "제품의 디테일", alt: "제품을 크게 보여주는 세로 광고 연출 예시" },
    { src: ASSETS.bottle, label: "브랜드의 분위기", alt: "향수병과 소재로 분위기를 표현한 세로 광고 연출 예시" },
  ];
  return <section className="cs-hero cs-svc-ad-hero" data-cs-section="hero" aria-labelledby={HERO_TITLE_ID}>
    <div className="cs-container"><div className="cs-grid cs-hero-grid">
      <div className="cs-col-7"><CsHeroCopy id={data.id} hero={data.hero} /></div>
      <div className="cs-col-5 cs-svc-ad-edit">
        {cards.map((card,i)=><figure key={card.src}><CsMedia ratio="9x16" src={card.src} alt={card.alt} sizes="(max-width:767px) 43vw, 22vw" priority={i===0} /><figcaption className="cs-t-label">{card.label}</figcaption></figure>)}
        <p className="cs-svc-ad-edit-note cs-t-caption">연출 예시 · 세로 화면에 맞춘 장면 구성</p>
      </div>
    </div></div>
  </section>;
}

function Hook({ data }: ServiceSectionProps) {
  const { hook } = sig(data);
  return (
    <section
      className="cs-section cs-section--alt cs-svc-ad-hook"
      data-cs-section="signature"
      aria-labelledby="cs-svc-ad-hook-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-svc-ad-hook-title"
          eyebrow={hook.eyebrow}
          title={hook.title}
          lead={hook.lead}
        />
        <ol className="cs-svc-ad-frames">
          {hook.frames.map((frame, i) => (
            <li
              key={frame.title}
              className="cs-svc-ad-frame"
              data-scene={i + 1}
              data-reveal
            >
              <div className="cs-svc-ad-phone">
                <div className="cs-svc-ad-screen">
                  <CsMedia
                    ratio="9x16"
                    src={ASSETS.hook}
                    alt={frame.alt}
                    tag={MEDIA_TAGS.staged}
                    sizes={HOOK_SIZES}
                  />
                  <div className="cs-svc-ad-ui" aria-hidden="true">
                    <span className="cs-svc-ad-progress">
                      {hook.frames.map((_, n) => (
                        <i key={n} data-on={n <= i ? "" : undefined} />
                      ))}
                    </span>
                    {SCREEN_TEXT[i] ? (
                      <span
                        className={`cs-svc-ad-screen-text ${SCREEN_TEXT[i].role}`}
                        data-kind={SCREEN_TEXT[i].kind}
                      >
                        {frame.screen}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="cs-svc-ad-frame-text">
                <h3 className="cs-t-h3">{frame.title}</h3>
                <p className="cs-t-small">{frame.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export const adLanding: ServiceModule = {
  Hero,
  Signature: Hook,
  worksLayout: "vertical",
};
