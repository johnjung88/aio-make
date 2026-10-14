/* webtoon 서비스 모듈(WP-A, 서버 데이터 + React 읽기 인터랙션).
 * 히어로: 기울어진 《1억의 구단주》 표지 카드 / 고유 섹션: ① 12컷 스냅 리더와 전체 읽기 ② 웹툰 + 모션코믹(영상 + 맡기는 방법).
 * 금액은 이 파일에 없다. 웹툰·모션코믹·함께 제작 금액은 #pricing(CsPricing) 한 곳에서만 보인다(VERIFY_FINAL_P2R WP-A-1).
 * 스타일은 ./webtoon.css 한 파일(.cs-svc-webtoon로 시작). 자산 경로와 alt는 아래 상수 한 곳에 둔다. */
import { WebtoonCover, WebtoonReader } from "./webtoon-experience";
import { ServiceHero } from "../service-hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { webtoonSignature as sig } from "@/lib/content-site/services/webtoon";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import "./webtoon.css";

/* ---------------------------------------------------------------- 자산 */
const WORK_TITLE = "《1억의 구단주》";

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
  alt: `${WORK_TITLE} 1회 ${i + 1}번째 컷 · ${scene}`,
}));

/** poster는 같은 영상 17.6초 프레임(《1억의 구단주》 제목 + 장면)을 ffmpeg로 뽑은 1280×720 webp다.
 * 기존 /videos/webtoon-reference-poster.jpg(로고 엔드카드)는 메인 사이트가 쓰므로 그대로 둔다. */
const MOTION_COMIC_VIDEO = {
  src: "/videos/webtoon-reference-v02.mp4",
  poster: "/webtoon-v11/motion-comic-poster.webp",
};

/* ---------------------------------------------------------------- 히어로 */
function Hero({ data }: ServiceSectionProps) { return <ServiceHero data={data} media={<WebtoonCover cuts={CUTS}/>} />; }

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
            <WebtoonReader cuts={CUTS}/>
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
