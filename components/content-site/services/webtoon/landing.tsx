/* webtoon 서비스 모듈(WP-A, 서버 컴포넌트만 · 고유 client 섬 0개).
 * 히어로: 기울어진 《1억의 구단주》 표지 카드 / 고유 섹션: ① 12컷 세로 리더(#reader, CSS 스크롤) ② 웹툰 + 모션코믹 묶음.
 * 스타일은 ./webtoon.css 한 파일(.cs-svc-webtoon로 시작). 자산 경로와 alt는 아래 상수 한 곳에 둔다. */
import Image from "next/image";
import { CsHero } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { CsTag } from "../../ui/tag";
import { formatWon, pricingPlans } from "@/lib/content-pricing";
import { CS_COPY } from "@/lib/content-site/copy";
import { webtoonSignature as sig } from "@/lib/content-site/services/webtoon";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import "./webtoon.css";

/* ---------------------------------------------------------------- 자산 */
const WORK_TITLE = "《1억의 구단주》";

/** 표지와 리더 첫 컷이 같은 /_next/image 주소를 쓰도록 sizes를 맞춘다(중복 요청 0). */
const CUT_SIZES = "(max-width: 767px) 100vw, 440px";

/** 《1억의 구단주》 1회 12컷(AIO 자체 웹툰, 800×1200). */
const CUTS = [
  "독립구단 창단식 무대 위 선수들과 객석에서 응원 영상을 보는 두 주인공",
  "기업 인수 체결식에서 악수하는 형과 피곤한 얼굴로 먼저 자리를 뜨는 주인공",
  "회사를 판 뒤 평일 알람을 모두 끄고 쉬다가 월드컵 중계를 켜는 주인공",
  "소파에서 축구 경기를 보다 골 장면에 환호하는 주인공",
  "형과 경기 이야기를 메시지로 나누고 옛 응원 머플러를 꺼내는 주인공",
  "강등된 축구팀의 다큐멘터리를 보며 아쉬워하는 주인공",
  "구단의 예산 고민을 다룬 다큐멘터리를 보고 다음 회를 켜는 주인공",
  "작은 구단을 인수한 두 배우의 다큐멘터리를 보며 구단 운영에 눈뜨는 주인공",
  "경기를 지켜보는 구단주들의 표정을 보며 생각에 잠긴 주인공",
  "구단 운영을 검색하다 축구 경영 게임을 설치하는 주인공",
  "게임 속 구단을 운영하며 첫 승리에 기뻐하는 주인공",
  "형의 저녁 전화에 게임을 저장하고 급히 나가는 주인공",
].map((scene, i) => ({
  src: `/webtoon-v11/cut-${String(i + 1).padStart(2, "0")}.webp`,
  alt: `${WORK_TITLE} 1회 ${i + 1}번째 컷. ${scene}`,
}));

const COVER = {
  src: CUTS[0].src,
  alt: `${WORK_TITLE} 1회 첫 컷을 표지로 쓴 카드. 독립구단 창단식 무대와 객석의 두 주인공`,
};

const MOTION_COMIC_VIDEO = {
  src: "/videos/webtoon-reference-v02.mp4",
  poster: "/videos/webtoon-reference-poster.jpg",
};

/* ---------------------------------------------------------------- 히어로 */
function Cover() {
  return (
    <div className="cs-svc-webtoon-cover">
      <div className="cs-svc-webtoon-cover-card">
        <CsMedia
          ratio="2x3"
          className="cs-svc-webtoon-cover-media"
          src={COVER.src}
          alt={COVER.alt}
          tag={MEDIA_TAGS.ownWebtoon}
          sizes={CUT_SIZES}
          priority
        />
        <div className="cs-svc-webtoon-cover-caption cs-on-accent">
          <p className="cs-t-h2">{sig.cover.title}</p>
          <a href="#reader" className="cs-link">
            {sig.cover.read} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function Hero({ data }: ServiceSectionProps) {
  return (
    <CsHero
      id={data.id}
      hero={data.hero}
      className="cs-svc-webtoon-hero"
      backdrop={<span className="cs-svc-webtoon-glow" aria-hidden="true" />}
      media={<Cover />}
    />
  );
}

/* ---------------------------------------------------------------- ① 세로 리더 */
function Reader() {
  const r = sig.reader;
  return (
    <section
      id="reader"
      className="cs-section cs-section--alt cs-svc-webtoon-reader"
      data-cs-section="signature"
      aria-labelledby="cs-webtoon-reader-title"
    >
      <div className="cs-container">
        <div className="cs-grid cs-svc-webtoon-reader-grid">
          <div className="cs-col-5 cs-svc-webtoon-reader-copy">
            <p className="cs-t-eyebrow">{r.eyebrow}</p>
            <h2 id="cs-webtoon-reader-title" className="cs-t-h2">
              {r.title}
            </h2>
            <p className="cs-t-lead">{r.lead}</p>
            <div className="cs-svc-webtoon-reader-meta">
              <span className="cs-svc-webtoon-chip cs-t-chip">{r.chip}</span>
              <p className="cs-t-small">{r.hint}</p>
            </div>
          </div>
          <div className="cs-col-6 cs-col-start-7 cs-svc-webtoon-phone-wrap">
            <div className="cs-svc-webtoon-phone">
              <div
                className="cs-svc-webtoon-scroll"
                role="region"
                aria-label={r.label}
                tabIndex={0}
              >
                {CUTS.map((cut) => (
                  <Image
                    key={cut.src}
                    className="cs-svc-webtoon-cut"
                    src={cut.src}
                    alt={cut.alt}
                    width={800}
                    height={1200}
                    sizes={CUT_SIZES}
                    loading="lazy"
                  />
                ))}
              </div>
              <CsTag overlay>{MEDIA_TAGS.ownWebtoon}</CsTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ② 웹툰 + 모션코믹 */
function MotionComic() {
  const m = sig.motionComic;
  const [webtoonGroup, motionGroup, bundleGroup] = pricingPlans("webtoon").groups;
  const c = CS_COPY.pricing;
  return (
    <section
      className="cs-section cs-svc-webtoon-motion"
      data-cs-section="signature"
      aria-labelledby="cs-webtoon-motion-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-webtoon-motion-title"
          eyebrow={m.eyebrow}
          title={m.title}
          lead={m.lead}
        />
        <div className="cs-grid cs-svc-webtoon-motion-grid">
          <figure className="cs-col-7 cs-svc-webtoon-video">
            <CsMedia
              kind="video"
              ratio="16x9"
              className="cs-svc-webtoon-video-media"
              src={MOTION_COMIC_VIDEO.src}
              poster={MOTION_COMIC_VIDEO.poster}
              alt={m.videoLabel}
              controls
              preload="none"
              tag={MEDIA_TAGS.ownWebtoonVideo}
            />
            <figcaption className="cs-t-small">{m.caption}</figcaption>
          </figure>
          <div className="cs-col-5 cs-svc-webtoon-bundles">
            <p className="cs-t-label" id="cs-webtoon-bundles-label">
              {m.bundlesLabel}
            </p>
            <ul
              className="cs-svc-webtoon-bundle-list"
              aria-labelledby="cs-webtoon-bundles-label"
            >
              {bundleGroup.plans.map((plan, i) => {
                const parts = [webtoonGroup.plans[i], motionGroup.plans[i]];
                return (
                  <li key={plan.key} className="cs-plan cs-plan--bundle" data-reveal>
                    <span className="cs-plan-badge cs-t-caption">{c.bundle}</span>
                    <h3 className="cs-t-h3">{plan.label}</h3>
                    <p className="cs-plan-amount">
                      <span className="cs-t-price">{formatWon(plan.amount)}</span>
                      <span className="cs-t-small">{c.vat}</span>
                    </p>
                    <p className="cs-svc-webtoon-sum cs-t-small">
                      <span className="cs-nowrap">
                        {parts[0].option} {formatWon(parts[0].amount)}
                      </span>{" "}
                      <span className="cs-nowrap">
                        + {parts[1].option} {formatWon(parts[1].amount)}
                      </span>
                    </p>
                    <a href="#inquiry" className="cs-link" data-plan={plan.key}>
                      {c.cta} <span aria-hidden="true">↓</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <dl className="cs-svc-webtoon-solo">
              <dt>
                <span className="cs-t-label">{m.soloLabel}</span>
                <span className="cs-t-caption">{c.vat}</span>
              </dt>
              {motionGroup.plans.map((plan) => (
                <dd key={plan.key}>
                  <span className="cs-t-small">{plan.label}</span>
                  <span className="cs-t-price-sm">{formatWon(plan.amount)}</span>
                </dd>
              ))}
            </dl>
            <p className="cs-svc-webtoon-note cs-t-small">{m.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Signature() {
  return (
    <>
      <Reader />
      <MotionComic />
    </>
  );
}

export const webtoonLanding: ServiceModule = {
  Hero,
  Signature,
  worksLayout: "webtoon",
};
