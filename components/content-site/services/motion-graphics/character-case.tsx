/* 캐릭터 제작 사례(서버 컴포넌트, R6).
 * - 공개판: 고객명·제품명·수치가 없는 일반 공정 3단계(캐릭터 설정 → 포즈 디자인 → 모션 제작)만 렌더한다. 문구는 lib 데이터에 있다.
 * - 검토판(NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1): works.server.ts가 placement="character-case"로 표시한 작품(30초 광고 모션그래픽 3편)이 있으면
 *   같은 자리에 실물 영상을 덧붙인다. 그 작품은 맨 아래 사례 목록(CsWorks)에서 빠진다. 공개판은 works가 []라 이 분기가 렌더되지 않고,
 *   환경 변수와 고객 slug는 이 파일이 갖지 않는다. */
import { motionGraphicsSignature } from "@/lib/content-site/services/motion-graphics";
import { studioText } from "@/lib/content-site/text";
import type { CsWorkCard, CsWorkMedia } from "@/lib/content-site/types";
import { CsMedia, type CsRatio } from "../../ui/media";
import { CsSectionHead } from "../../ui/section-head";

function ratioOf(media: CsWorkMedia): CsRatio {
  if (media.presentation === "portrait") return "9x16";
  if (media.presentation === "square") return "1x1";
  return "16x9";
}

function ReviewCase({ work }: { work: CsWorkCard }) {
  return <div className="cs-svc-motion-graphics-case-review" data-review-case="true">
    <p className="cs-t-caption">{work.brand} · {work.label}</p>
    <h3 className="cs-t-h3">{work.title}</h3>
    <p className="cs-t-small">{studioText(work.scope)}</p>
    <ul className="cs-svc-motion-graphics-case-media">
      {work.media.map((media, index) => <li key={media.src} data-ratio={ratioOf(media)}>
        {media.kind === "video"
          ? <CsMedia kind="video" ratio={ratioOf(media)} src={media.src} poster={media.poster} alt={`${media.alt} ${index + 1}`} controls preload="none" tag={work.label} />
          : <CsMedia ratio={ratioOf(media)} src={media.src} alt={media.alt} sizes="(max-width:767px) 90vw, 45vw" tag={work.label} />}
      </li>)}
    </ul>
  </div>;
}

export function CharacterCase({ works }: { works?: CsWorkCard[] }) {
  const c = motionGraphicsSignature.characterCase;
  const reviewWork = works?.find((work) => work.placement === "character-case");
  return <section className="cs-section cs-svc-motion-graphics-case" data-cs-section="signature" aria-labelledby="cs-motion-case-title">
    <div className="cs-container cs-container--read">
      <CsSectionHead id="cs-motion-case-title" eyebrow={c.eyebrow} title={c.title} />
      <ol className="cs-steps" data-count={c.steps.length}>
        {c.steps.map((step, index) => <li key={step.title} className="cs-step">
          <span className="cs-t-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="cs-t-h3">{step.title}</h3>
          <p className="cs-step-body cs-t-small">{step.body}</p>
        </li>)}
      </ol>
      {reviewWork ? <ReviewCase work={reviewWork} /> : null}
    </div>
  </section>;
}
