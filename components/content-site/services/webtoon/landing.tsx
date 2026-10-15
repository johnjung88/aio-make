/* webtoon 서비스 모듈(R6, BRIEF_R6 5절).
 * 순서: 히어로(표지 컷 1장, 리더 첫 장과 다른 컷) → ① 12컷 3D 책 리더 → ② 모션코믹(영상 + 한 줄 + 맡기는 방법 2개) → (공통) 가격 → 진행 방식 → FAQ → 문의 → 다른 서비스.
 * 금액은 이 파일에 없다. 웹툰·모션코믹·함께 제작 금액은 #pricing(CsPricing) 한 곳에서만 보인다(VERIFY_FINAL_P2R WP-A-1).
 * 컷 경로·설명은 lib/content-site/example-media.ts의 webtoon-cut-1..12 슬롯 한 곳에 둔다(교체는 슬롯 한 줄). */
import { WebtoonReader } from "./webtoon-experience";
import { ServiceHero } from "../service-hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { webtoonSignature as sig } from "@/lib/content-site/services/webtoon";
import { getExampleMedia, getSlot } from "@/lib/content-site/example-media";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import { r8Sections } from "@/lib/content-site/r8-sections";
import { r8Details } from "@/lib/content-site/r8-details";
import { EditorialSection } from "../editorial-section";
import { FigureRow } from "../figure-row";
import { ReelPlayer } from "../reel-player";
import "./webtoon.css";

/* ---------------------------------------------------------------- 자산 */
/** 《1억의 구단주》 1회 12컷(AIO 자체 웹툰, 800×1200) */
const CUTS = getExampleMedia("webtoon", "cut").map(({ src, alt }) => ({ src, alt }));
/** 표지와 리더가 같은 sizes를 쓴다. 표지는 리더 첫 장(컷 1)과 같은 이미지가 연달아 나오지 않도록 컷 4(경기를 보며 환호하는 장면)를 쓴다 */

const CUT_SIZES = "(max-width:767px) 80vw, 440px";

/** poster는 같은 영상 17.6초 프레임(《1억의 구단주》 제목 + 장면)을 ffmpeg로 뽑은 1280×720 webp다.
 * 기존 /videos/webtoon-reference-poster.jpg(로고 엔드카드)는 메인 사이트가 쓰므로 그대로 둔다. */

/* R8: 30초 서비스 영상 슬롯, 연결 전에는 승인 표지 컷 */
function Hero({ data }: ServiceSectionProps) {

  return (
    <ServiceHero
      data={data}
      media={
        <ReelPlayer slot={getSlot("webtoon-hero-reel")} hero />
      }
    />
  );
}

/* ---------------------------------------------------------------- ① 12컷 페이지 넘김 리더 */
function Reader() {
  const r = sig.reader;
  return (
    <section
      id="reader"
      className="cs-section cs-svc-webtoon-reader"
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
          </div>
          <div className="cs-col-6 cs-col-start-7 cs-svc-webtoon-book-col">
            <WebtoonReader cuts={CUTS} sizes={CUT_SIZES} label={r.label} tag={MEDIA_TAGS.ownWebtoon} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ② 모션코믹 */
function MotionComic() {
  const m = sig.motionComic;
  return (
    <section
      className="cs-section"
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
          <div className="cs-col-7 cs-svc-webtoon-video">
            <ReelPlayer slot={getSlot("webtoon-motion-comic")} />
          </div>
          <div className="cs-col-5 cs-svc-webtoon-ways">
            <p className="cs-t-label" id="cs-webtoon-ways-label">
              {m.waysLabel}
            </p>
            <ul className="cs-svc-webtoon-way-list" aria-labelledby="cs-webtoon-ways-label">
              {m.ways.map((way) => (
                <li key={way.title} className="cs-svc-webtoon-way">
                  <h3 className="cs-t-h3">{way.title}</h3>
                  <p className="cs-t-body">{way.body}</p>
                </li>
              ))}
            </ul>
            <a className="cs-link" href="#pricing">제작 가격 보기 ↓</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Signature() {
  return (
    <>
      <EditorialSection id="webtoon-types" head={r8Sections.webtoon["STORY TYPES"]}>
        <FigureRow snap items={r8Details.webtoon["STORY TYPES"].map((item, i) => ({ ...item, slot: `webtoon-type-${i + 1}` }))} />
      </EditorialSection>
      <Reader />
      <EditorialSection id="webtoon-craft" head={r8Sections.webtoon["ONE CUT"]}>
        <div className="cs-svc-webtoon-craft-art"><p className="cs-t-body">장면과 대사를 글로 먼저 정리합니다</p><ReelPlayer slot={getSlot("webtoon-cut-4")} /><ReelPlayer slot={getSlot("webtoon-cut-8")} /></div>
        <FigureRow items={r8Details.webtoon["ONE CUT"]} />
        <p className="cs-t-small cs-r8-note">콘티와 대사는 기획안 단계에서 먼저 확인합니다</p>
      </EditorialSection>
      <MotionComic />
    </>
  );
}

export const webtoonLanding: ServiceModule = {
  Hero,
  Signature,
  worksLayout: "webtoon",
};
