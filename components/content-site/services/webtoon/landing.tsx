/* webtoon 서비스 모듈(R5 WP-S1, 서버 데이터 + React 읽기 인터랙션).
 * 히어로: 《1억의 구단주》 3컷 부채 / 고유 섹션: ① 스크롤 컷 펼침 ② 12컷 3D 페이지 넘김 리더와 전체 읽기 ③ 웹툰 + 모션코믹(영상 + 맡기는 방법).
 * 금액은 이 파일에 없다. 웹툰·모션코믹·함께 제작 금액은 #pricing(CsPricing) 한 곳에서만 보인다(VERIFY_FINAL_P2R WP-A-1).
 * 컷 경로·설명은 lib/content-site/example-media.ts의 webtoon-cut-1..12 슬롯 한 곳에 둔다(교체는 슬롯 한 줄). */
import { WebtoonCover, WebtoonReader, WebtoonUnfold } from "./webtoon-experience";
import { ServiceHero } from "../service-hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { webtoonSignature as sig } from "@/lib/content-site/services/webtoon";
import { getExampleMedia } from "@/lib/content-site/example-media";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import "./webtoon.css";

/* ---------------------------------------------------------------- 자산 */
/** 《1억의 구단주》 1회 12컷(AIO 자체 웹툰, 800×1200) */
const CUTS = getExampleMedia("webtoon", "cut").map(({ src, alt }) => ({ src, alt }));
/** 표지·펼침·리더가 같은 sizes를 써서 같은 /_next/image 주소를 재사용한다 */
const CUT_SIZES = "(max-width:767px) 80vw, 440px";

/** poster는 같은 영상 17.6초 프레임(《1억의 구단주》 제목 + 장면)을 ffmpeg로 뽑은 1280×720 webp다.
 * 기존 /videos/webtoon-reference-poster.jpg(로고 엔드카드)는 메인 사이트가 쓰므로 그대로 둔다. */
const MOTION_COMIC_VIDEO = {
  src: "/videos/webtoon-reference-v02.mp4",
  poster: "/webtoon-v11/motion-comic-poster.webp",
};

/* ---------------------------------------------------------------- 히어로 */
function Hero({ data }: ServiceSectionProps) {
  return <ServiceHero data={data} media={<WebtoonCover cuts={CUTS} sizes={CUT_SIZES} title={sig.cover.title} caption={MEDIA_TAGS.ownWebtoon}/>} />;
}

/* ---------------------------------------------------------------- ① 스크롤 컷 펼침 */
function Unfold() {
  const u = sig.unfold;
  return (
    <section className="cs-section cs-svc-webtoon-unfold" data-cs-section="signature" aria-labelledby="cs-webtoon-unfold-title">
      <div className="cs-container">
        <CsSectionHead id="cs-webtoon-unfold-title" eyebrow={u.eyebrow} title={u.title} lead={u.lead} />
        <p className="cs-t-small cs-svc-webtoon-unfold-caption">{u.caption}</p>
        <WebtoonUnfold cuts={CUTS.slice(0, 5)} sizes={CUT_SIZES} tag={MEDIA_TAGS.ownWebtoon} hint={u.hint}/>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ② 12컷 페이지 넘김 리더 */
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
            <WebtoonReader cuts={CUTS} sizes={CUT_SIZES} label={r.label} tag={MEDIA_TAGS.ownWebtoon}/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ② 웹툰 + 모션코믹 */
function MotionComic() {
  const m = sig.motionComic;
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
          <div className="cs-col-5 cs-svc-webtoon-ways">
            <p className="cs-t-label" id="cs-webtoon-ways-label">
              {m.waysLabel}
            </p>
            <ol
              className="cs-svc-webtoon-way-list"
              aria-labelledby="cs-webtoon-ways-label"
            >
              {m.ways.map((way, i) => (
                <li key={way.title} className="cs-svc-webtoon-way" data-reveal>
                  <span
                    className="cs-svc-webtoon-way-num cs-t-caption"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="cs-t-h3">{way.title}</h3>
                  <p className="cs-t-body">{way.body}</p>
                </li>
              ))}
            </ol>
            <a href="#pricing" className="cs-link cs-svc-webtoon-price-link">
              {m.priceLink} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Signature() {
  return (
    <>
      <Unfold />
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
