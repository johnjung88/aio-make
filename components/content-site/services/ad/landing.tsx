import Link from "next/link";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { CS_COPY } from "@/lib/content-site/copy";
import { MEDIA_TAGS, type CsWorkCard } from "@/lib/content-site/types";
import { getExampleMedia, type ExampleSlot } from "@/lib/content-site/example-media";
import { adSignature } from "@/lib/content-site/services/ad";
import { ServiceHero } from "../service-hero";
import { SceneSequence, type SceneFrame } from "../scene-sequence";
import { WorkSequence } from "../work-sequence";
import "./ad.css";
import { AdRail, type RailCard } from "./ad-reel";

/** 레일 3열 × 4칸. m = 소재 카드, t = 문구 카드(adSignature.screens) */
const LAYOUT = [["m", "t", "m", "m"], ["m", "m", "m", "t"], ["t", "m", "m", "m"]] as const;

function railColumns(media: RailCard[], type: RailCard[]): RailCard[][] {
  let m = 0, t = 0;
  return LAYOUT.map(column => column.map(kind => kind === "t" ? type[t++ % type.length] : media[m++ % media.length]));
}

/** 슬롯 구도(focus: [x, y] 퍼센트 또는 CSS 문자열) → object-position 값 */
function position(focus: unknown): string | undefined {
  if (typeof focus === "string") return focus;
  if (Array.isArray(focus) && focus.length === 2) return `${focus[0]}% ${focus[1]}%`;
  return undefined;
}

const fromSlot = (slot: ExampleSlot): RailCard => slot.kind === "video"
  ? { kind: "video", src: slot.src, poster: slot.poster, focus: position(slot.focus) }
  : { kind: "image", src: slot.src, width: slot.width, height: slot.height, focus: position(slot.focus) };

/** 9:16 영상 중 포스터가 있는 것(S1·S2·S3 같은 편 순서는 작품 데이터의 미디어 순서를 따른다) */
const portraitPosters = (work: CsWorkCard) => work.media.filter(media => media.kind === "video" && media.presentation === "portrait" && media.poster);

/** 검토판 레일(R7): 앞칸에 서버가 표시한 작품(railLead)의 9:16 포스터를 편 순서대로 두고, 그 뒤에 나머지 광고 포스터를 잇는다.
 * 서버가 고른 SNS 광고 작업물의 포스터만 쓰며 연출 예시와 섞지 않는다. 기준 작품(featured)은 시그니처 작품이다 */
function reviewCards(works: CsWorkCard[] | undefined, featured: CsWorkCard): RailCard[] {
  const all = works ?? [];
  const lead = all.filter(work => work.railLead || work.slug === featured.slug);
  const cards: RailCard[] = [];
  for (const work of lead) for (const media of portraitPosters(work)) cards.push({ kind: "image", src: media.poster as string, width: media.width ?? 900, height: media.height ?? 1600 });
  for (const work of all) {
    if (lead.includes(work)) continue;
    const media = work.media[0];
    if (!media) continue;
    const src = media.kind === "video" ? media.poster : media.src;
    if (src) cards.push({ kind: "image", src, width: media.width ?? 900, height: media.height ?? 1600 });
  }
  return cards;
}

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item => item.placement === "ad-signature");
  const examples = getExampleMedia("ad", "rail");
  const media = work ? reviewCards(works, work) : examples.map(fromSlot);
  const type: RailCard[] = adSignature.screens.map(text => ({ kind: "type", text }));
  /* 공개판 레일 표기: AI 인물 소재가 섞이면 'AI 가상인물 · 연출 예시' */
  const tag = work ? undefined : examples.some(slot => slot.label === MEDIA_TAGS.aiPerson) ? MEDIA_TAGS.aiPerson : MEDIA_TAGS.staged;
  return <ServiceHero data={data} media={<AdRail columns={railColumns(media, type)} tag={tag}/>}/>;
}

/** 시그니처 3장면(R7, 검토판): 서버가 시그니처 작품으로 표시한 작품의 9:16 3편을 한 편씩 장면 자리에 둔다. 장면 이름은 서버가 준 값이다 */
function signatureScenes(work: CsWorkCard): SceneFrame[] {
  return portraitPosters(work).slice(0, 3).map((media, index) => ({
    src: media.poster as string,
    alt: `${work.title} ${index + 1}번째 영상 · ${work.label}`,
    width: media.width ?? 900,
    height: media.height ?? 1600,
  }));
}

const PUBLIC_SCENE_LABELS = ["첫 장면에서 상황을 전달", "사용 방법을 자막으로", "사용 장면으로 마무리"] as const;

function Signature({ works }: ServiceSectionProps) {
  const work = works?.find(item => item.placement === "ad-signature");
  const scenes = work ? signatureScenes(work) : [];
  const labels = work?.signatureLabels;
  const review = work && labels && scenes.length === 3 ? { work, labels, scenes } : undefined;
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-ad-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-ad-edit-title" eyebrow="VERTICAL EDIT" title={"사용하는 순간을\n보여주는 광고"} lead="첫 장면에서 상황을 전하고 제품을 쓰는 과정으로 이어갑니다"/>
    {review
      ? <SceneSequence variant="ad" name={review.work.title} labels={review.labels} scenes={review.scenes} portrait note="30초 광고 3편의 대표 장면" tag={review.work.label}/>
      : <WorkSequence work={work} portrait service="ad" labels={PUBLIC_SCENE_LABELS} exampleLabels={PUBLIC_SCENE_LABELS}/>}
    {review && <p className="cs-t-small cs-service-review-note">{review.work.label} · 편마다 다른 톤으로 만든 9:16 영상 3편 · <Link href={review.work.href} className="cs-link">{CS_COPY.works.more} <span aria-hidden="true">↗</span></Link></p>}
  </div></section>;
}
export const adLanding: ServiceModule = { Hero, Signature, worksLayout:"vertical" };
