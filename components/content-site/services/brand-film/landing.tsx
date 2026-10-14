import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { MEDIA_TAGS, CONTENT_SITE_ASSETS, type CsWorkCard } from "@/lib/content-site/types";
import { getExampleMedia } from "@/lib/content-site/example-media";
import { brandFilmSignature } from "@/lib/content-site/services/brand-film";
import { ServiceHero, FeaturedWork, ProductionNotes } from "../service-hero";
import "./brand-film.css";
import { FilmScreen, FilmTimeline, type FilmSource } from "./film-timeline";

const labels = { pause: brandFilmSignature.hero.pause, play: brandFilmSignature.hero.play };

/** 검토판: 서버가 고른 실제 작업물(영상 우선). 공개판에는 works가 비어 있다 */
function selectedWork(works?: CsWorkCard[]) {
  return works?.find(item=>item.slug === "bwl-brand-ad") ?? works?.find(item=>item.media.some(media=>media.kind==="video"));
}

/** 공개판 메인 영상: 연출 예시 슬롯 brandfilm-main(교체는 example-media.ts 한 줄). 슬롯이 없으면 기존 연출 예시 영상 */
function exampleFilm(): FilmSource {
  const slot = getExampleMedia("brand-film", "main")[0];
  if (slot?.kind === "video") return { src: slot.src, poster: slot.poster, label: slot.alt, tag: slot.label };
  return { src: CONTENT_SITE_ASSETS.brandMotion.src, poster: CONTENT_SITE_ASSETS.hero.src, label: brandFilmSignature.hero.videoLabel, tag: MEDIA_TAGS.stagedMuted };
}

function Hero({ data, works }: ServiceSectionProps) {
  const work = selectedWork(works);
  return <ServiceHero data={data} wide media={<FeaturedWork work={work} fallback={<FilmScreen source={exampleFilm()} labels={labels}/>}/>}/>;
}
function Signature({ works }: ServiceSectionProps) {
  const work = selectedWork(works);
  const video = work?.media.find(media=>media.kind === "video");
  const source: FilmSource = work && video ? { src: video.src, poster: video.poster, label: `${work.title} · ${work.label}`, tag: work.label } : exampleFilm();
  return <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-brand-edit-title"><div className="cs-container">
    <CsSectionHead id="cs-brand-edit-title" eyebrow="FILM DIRECTION" title={"무엇을 보여주고\n무엇을 남길지"} lead="소개 자료의 모든 내용을 담기보다 영상을 보는 사람이 기억할 내용을 먼저 고릅니다"/>
    <ProductionNotes title="소개 자료를 영상으로" items={[{title:"고객이 겪는 상황",body:"제품이나 서비스가 필요한 순간을 도입 장면으로 정리합니다"},{title:"제품과 일하는 방식",body:"제품의 특징과 회사가 하는 일을 자료와 장면으로 설명합니다"},{title:"마지막에 남길 정보",body:"브랜드 이름과 핵심 문구, 이어서 볼 정보와 문의 경로를 정합니다"}]}/>
    <FilmTimeline source={source} labels={labels}/>
    <p className="cs-service-review-note cs-t-small">길이별 구성 예시이며 실제 장면 순서는 기획안에서 정합니다</p>
  </div></section>;
}
export const brandFilmLanding: ServiceModule = { Hero, Signature, worksLayout:"wide" };
