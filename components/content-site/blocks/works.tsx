/* 사례 블록(서버, id="works", 바탕 --cs-bg). works는 서버(lib/content-site/works.server.ts)가 고른 평범한 객체다.
 * 기본 빌드(검토 플래그 미설정·"0")에서는 빈 배열이라 섹션·제목 모두 렌더하지 않는다.
 * 사례 상세는 기존 /work/{slug}(메인 셸)를 그대로 쓴다. */
import Link from "next/link";
import { studioText } from "@/lib/content-site/text";
import { CS_COPY } from "@/lib/content-site/copy";
import type {
  CsWorkCard,
  CsWorkMedia,
  CsWorksLayout,
} from "@/lib/content-site/types";
import { CsMedia, type CsRatio } from "../ui/media";
import { CsSectionHead } from "../ui/section-head";
import { AdWorkVariants } from "../services/ad/ad-reel";

function ratioOf(media: CsWorkMedia): CsRatio {
  if (media.kind === "webtoon" || media.presentation === "webtoon") return "2x3";
  if (media.presentation === "portrait") return "9x16";
  if (media.presentation === "square") return "1x1";
  return "16x9";
}

const isPortraitVideo = (media: CsWorkMedia) => media.kind === "video" && media.presentation === "portrait";

/** 카드에 보일 미디어. 세로형(vertical) 서비스만 9:16 영상을 앞세우고, 서버가 안 수 표시(variantLabel)를 준 작품은
 * 9:16 영상 최대 4개를 포스터 띠로 묶는다. 다른 레이아웃은 첫 미디어를 그대로 쓴다(R7) */
function cardMedia(work: CsWorkCard, layout: CsWorksLayout): { main: CsWorkMedia; variants: CsWorkMedia[] } {
  if (layout !== "vertical") return { main: work.media[0], variants: [] };
  const portrait = work.media.filter(isPortraitVideo);
  const variants = work.variantLabel && portrait.length > 1 ? portrait.slice(0, 4) : [];
  return { main: portrait[0] ?? work.media[0], variants };
}

const SIZES: Record<CsWorksLayout, string> = {
  vertical: "(max-width: 479px) 90vw, (max-width: 1023px) 45vw, 22vw",
  webtoon: "(max-width: 479px) 90vw, (max-width: 1023px) 45vw, 22vw",
  wide: "(max-width: 1023px) 90vw, 45vw",
};

export function CsWorks({
  works,
  layout,
}: {
  works: CsWorkCard[];
  layout: CsWorksLayout;
}) {
  if (works.length === 0) return null;
  const c = CS_COPY.works;
  return (
    <section
      id="works"
      className="cs-section"
      data-cs-section="works"
      aria-labelledby="cs-works-title"
    >
      <div className="cs-container">
        <CsSectionHead id="cs-works-title" eyebrow={c.eyebrow} title={c.title} />
        <ul className="cs-works-grid" data-layout={layout}>
          {works.map((work) => {
            const { main: media, variants } = cardMedia(work, layout);
            return (
              <li key={work.slug} className="cs-work">
                {variants.length > 1 && work.variantLabel ? (
                  <AdWorkVariants
                    label={work.variantLabel}
                    tag={work.label}
                    items={variants.map((item, i) => ({ src: item.src, poster: item.poster, alt: `${work.title} ${i + 1}번째 안` }))}
                  />
                ) : media.kind === "video" ? (
                  <CsMedia
                    kind="video"
                    ratio={ratioOf(media)}
                    src={media.src}
                    poster={media.poster}
                    alt={media.alt}
                    controls
                    preload="none"
                    tag={work.label}
                  />
                ) : (
                  <CsMedia
                    ratio={ratioOf(media)}
                    src={media.src}
                    alt={media.alt}
                    sizes={SIZES[layout]}
                    tag={work.label}
                  />
                )}
                <div className="cs-work-body">
                  <p className="cs-t-caption">{work.brand}</p>
                  <h3 className="cs-t-h3">{work.title}</h3>
                  <p className="cs-t-small">{studioText(work.scope)}</p>
                  <Link href={work.href} className="cs-link">
                    {c.more} <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
