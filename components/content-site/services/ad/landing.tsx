import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { MEDIA_TAGS, type CsWorkCard } from "@/lib/content-site/types";
import { getExampleMedia, type ExampleSlot } from "@/lib/content-site/example-media";
import { adSignature } from "@/lib/content-site/services/ad";
import { brandFilmSignature } from "@/lib/content-site/services/brand-film";
import { ServiceHero, FeaturedWork, ProductionNotes } from "../service-hero";
import { WorkSequence } from "../work-sequence";
import "./ad.css";
import { AdRail, type CenterMedia, type RailCard } from "./ad-reel";

/** 레일 3열 × 4칸. m = 소재 카드, t = 문구 카드(adSignature 화면 문구) */
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

/** 검토판 레일: 서버가 고른 SNS 광고 작업물의 실제 발췌 장면과 포스터만 쓴다(연출 예시와 섞지 않는다) */
function reviewCards(works: CsWorkCard[] | undefined, featured: CsWorkCard): RailCard[] {
  const cards: RailCard[] = [1, 2, 3].map(n => ({ kind: "image", src: `/reference-review/r3-scenes/${featured.slug}/scene-${n}.webp`, width: 900, height: 1600 }));
  for (const work of works ?? []) {
    const media = work.media[0];
    if (!media) continue;
    const src = media.kind === "video" ? media.poster : media.src;
    if (src) cards.push({ kind: "image", src, width: media.width ?? 900, height: media.height ?? 1600 });
  }
  return cards;
}

/** 공개판 가운데 9:16 화면: 슬롯 ad-center-1(교체는 example-media.ts 한 줄) */
function centerExample(): CenterMedia | undefined {
  const slot = getExampleMedia("ad").find(item => item.id === "ad-center-1");
  if (!slot) return undefined;
  return { kind: slot.kind, src: slot.src, poster: slot.poster, alt: slot.alt, tag: slot.label, width: slot.width, height: slot.height, focus: position(slot.focus) };
}

function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-aqua-ad");
  const examples = getExampleMedia("ad", "rail");
  const media = work ? reviewCards(works, work) : examples.map(fromSlot);
  const type: RailCard[] = adSignature.hook.frames.map(frame => ({ kind: "type", text: frame.screen }));
  /* 공개판 레일 표기: AI 인물 소재가 섞이면 'AI 가상인물 · 연출 예시' */
  const tag = work ? undefined : examples.some(slot => slot.label === MEDIA_TAGS.aiPerson) ? MEDIA_TAGS.aiPerson : MEDIA_TAGS.staged;
  return <ServiceHero data={data} media={<AdRail columns={railColumns(media, type)} center={work ? undefined : centerExample()} tag={tag} labels={{ pause: brandFilmSignature.hero.pause, play: brandFilmSignature.hero.play }}>
    {work ? <FeaturedWork work={work} fallback={null}/> : null}
  </AdRail>}/>;
}
function Signature({ works }: ServiceSectionProps) {
  const work = works?.find(item=>item.slug === "bwl-aqua-ad");
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-ad-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-ad-edit-title" eyebrow="VERTICAL EDIT" title={"사용하는 순간을\n보여주는 광고"} lead="첫 장면에서 상황을 전하고 제품을 쓰는 과정으로 이어갑니다"/>
    <WorkSequence work={work} portrait labels={["퇴근 후의 일상", "사용 방법을 자막으로", "사용 장면으로 마무리"]}/>
    {work && <p className="cs-t-small cs-service-review-note">{work.label} · 실제 영상에서 발췌한 장면</p>}
    <ProductionNotes title="한 제품, 한 콘셉트" items={[{title:"첫 화면에 담을 상황",body:"누가 언제 제품을 찾는지 정하고 시작 문구를 씁니다"},{title:"보여줄 제품의 특징",body:"제품 사진과 설명 자료를 바탕으로 필요한 장면과 자막을 고릅니다"},{title:"게시할 세로 화면",body:"9:16 화면에 맞춰 편집하고 기본 자막과 배경음악을 더합니다"}]}/>
  </div></section>;
}
export const adLanding: ServiceModule = { Hero, Signature, worksLayout:"vertical" };
