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

function ratioOf(media: CsWorkMedia): CsRatio {
  if (media.kind === "webtoon" || media.presentation === "webtoon") return "2x3";
  if (media.presentation === "portrait") return "9x16";
  if (media.presentation === "square") return "1x1";
  return "16x9";
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
            const media = work.media[0];
            return (
              <li key={work.slug} className="cs-work">
                {media.kind === "video" ? (
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
