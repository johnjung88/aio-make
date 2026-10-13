/* animation 서비스 모듈(WP-A). 고유 client 섬은 before-motion.tsx 하나(탭).
 * 히어로: 화면 오른쪽 70%를 캐릭터 장면이 채우고 왼쪽은 바탕색 그라데이션 위에 문구, 캐릭터 머리 근처 후광 원.
 * 고유 섹션: ① 그림체 3종(연출 예시) ② 움직이기 전 확인 3탭.
 * 스타일은 ./animation.css(.cs-svc-animation로 시작). 후광 루프의 @keyframes만 ./animation.keyframes.css에 둔다
 * (테스트 7번 파서 제약, RESULT_WPA '공용 변경 요청'). 자산 경로와 alt는 아래 상수 한 곳에 둔다. */
import { CsHeroCopy, HERO_TITLE_ID } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsMedia } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";
import { animationSignature as sig } from "@/lib/content-site/services/animation";
import { CONTENT_SITE_ASSETS, MEDIA_TAGS } from "@/lib/content-site/types";
import { BeforeMotionTabs } from "./before-motion";
import "./animation.css";
import "./animation.keyframes.css";

/* ---------------------------------------------------------------- 자산 */
/** 히어로와 그림체 첫 카드가 같은 원본을 쓰므로 sizes를 맞춰 같은 /_next/image 주소를 받는다(중복 요청 0). */
const CHARACTER_SIZES = "(max-width: 1023px) 100vw, 70vw";

const HERO_MEDIA = {
  src: CONTENT_SITE_ASSETS.animation.src,
  alt: "아치형 문 앞 계단 위에 선 보라색 입체 캐릭터 장면 연출 예시",
};

/** 그림체 카드(순서 = animationSignature.styles.items). 모두 AI로 만든 연출 예시 이미지. */
const STYLE_MEDIA = [
  {
    src: CONTENT_SITE_ASSETS.animation.src,
    alt: "동그란 눈의 보라색 입체 캐릭터를 가까이 담은 연출 예시",
    sizes: CHARACTER_SIZES,
  },
  {
    src: "/creative-v06/video-animation.webp",
    alt: "노란 우비를 입은 너구리가 비 내리는 밤 돌다리를 건너는 동화풍 장면 연출 예시",
    sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  },
  {
    src: "/renewal/animation-sample.webp",
    alt: "보라 목도리를 두른 하얀 캐릭터가 등불을 들고 다리 위에 선 장면 연출 예시",
    sizes: "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  },
] as const;

/* ---------------------------------------------------------------- 히어로 */
function Hero({ data }: ServiceSectionProps) {
  return (
    <section
      className="cs-hero cs-svc-animation-hero"
      data-cs-section="hero"
      aria-labelledby={HERO_TITLE_ID}
    >
      <div className="cs-svc-animation-stage">
        <CsMedia
          ratio="2x3"
          className="cs-svc-animation-stage-media"
          src={HERO_MEDIA.src}
          alt={HERO_MEDIA.alt}
          tag={MEDIA_TAGS.staged}
          sizes={CHARACTER_SIZES}
          priority
        />
        <span className="cs-svc-animation-halo" aria-hidden="true" />
      </div>
      <div className="cs-container">
        <div className="cs-grid cs-hero-grid">
          <div className="cs-col-6">
            <CsHeroCopy id={data.id} hero={data.hero} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ① 그림체 */
function Styles() {
  const s = sig.styles;
  return (
    <section
      className="cs-section cs-section--alt cs-svc-animation-styles"
      data-cs-section="signature"
      aria-labelledby="cs-animation-styles-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-animation-styles-title"
          eyebrow={s.eyebrow}
          title={s.title}
          lead={s.lead}
        />
        <ul className="cs-svc-animation-style-list">
          {s.items.map((item, i) => {
            const media = STYLE_MEDIA[i];
            return (
              <li
                key={item.title}
                className="cs-svc-animation-style"
                data-look={i + 1}
                data-reveal
              >
                <CsMedia
                  ratio="4x5"
                  className="cs-media--zoom"
                  src={media.src}
                  alt={media.alt}
                  sizes={media.sizes}
                  tag={MEDIA_TAGS.staged}
                />
                <h3 className="cs-t-h3">{item.title}</h3>
                <p className="cs-t-small">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- ② 움직이기 전 확인 */
function BeforeMotion() {
  const b = sig.beforeMotion;
  return (
    <section
      className="cs-section cs-svc-animation-before-section"
      data-cs-section="signature"
      aria-labelledby="cs-animation-before-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-animation-before-title"
          eyebrow={b.eyebrow}
          title={b.title}
          lead={b.lead}
        />
        <BeforeMotionTabs
          tabsLabel={b.tabsLabel}
          items={b.items}
          story={b.story}
          views={b.views}
          frames={b.frames}
        />
      </div>
    </section>
  );
}

function Signature() {
  return (
    <>
      <Styles />
      <BeforeMotion />
    </>
  );
}

export const animationLanding: ServiceModule = {
  Hero,
  Signature,
  worksLayout: "vertical",
};
