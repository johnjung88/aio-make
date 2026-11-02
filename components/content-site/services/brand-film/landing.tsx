import Image from "next/image";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { getSlot } from "@/lib/content-site/example-media";
import { r8Sections } from "@/lib/content-site/r8-sections";
import { r8Details } from "@/lib/content-site/r8-details";
import { r8Boards } from "@/lib/content-site/r8-boards";
import { ServiceHero, FeaturedWork } from "../service-hero";
import { EditorialSection } from "../editorial-section";
import { FigureRow } from "../figure-row";
import { CutBoard } from "../cut-board";
import { FilmScreen, FilmTimeline } from "./film-timeline";
import "./brand-film.css";

const head = r8Sections["brand-film"];
const labels = { pause: "영상 일시정지", play: "영상 재생" };
function Hero({ data, works }: ServiceSectionProps) {
  const work = works?.find(item => item.slug === "bwl-brand-ad");
  return <ServiceHero data={data} wide media={<FeaturedWork work={getSlot("brandfilm-main").src ? undefined : work} fallback={<FilmScreen slot={getSlot("brandfilm-main")} source={{src:"",label:"브랜드 홍보 영상 제작 예시 30초"}} labels={labels} />} />} />;
}
function Signature() {
  return <>
    <EditorialSection id="brand-story" head={head["STORY STRUCTURE"]} split><div><h3 className="cs-t-h3">소개 영상의 네 장</h3><ol className="cs-svc-brand-film-story-list">{r8Details["brand-film"]["STORY STRUCTURE"].map((item,i)=><li key={item.title}><Image src={getSlot(`brandfilm-story-${i+1}`).src} alt={getSlot(`brandfilm-story-${i+1}`).alt} width={96} height={54} sizes="96px" /><div><p className="cs-t-caption">{String(i+1).padStart(2,"0")}</p><h4 className="cs-t-label">{item.title}</h4><p className="cs-t-body">{item.body}</p></div></li>)}</ol></div></EditorialSection>
    <CutBoard board={r8Boards["brand-film"]} />
    <EditorialSection id="brand-sources" head={head.SOURCES}><FigureRow items={[
      {title:"보유 자료",body:"회사와 제품 사진, 행사 사진, 기존 영상을 먼저 고릅니다",slot:"brandfilm-source-own"},
      {title:"제작 영상",body:"부족한 장면은 이미지와 영상 생성 도구로 만듭니다",slot:"brandfilm-source-made"},
      {title:"그래픽",body:"로고와 자막, 게이지 같은 정보 요소를 모션으로 만듭니다",slot:"brandfilm-source-graphic"},
    ]} /><p className="cs-t-small cs-r8-note">제조사와 행사 측이 만든 사진과 로고는 사용 허락 범위를 확인한 뒤 씁니다</p></EditorialSection>
    <EditorialSection id="brand-length" head={head.LENGTH}><FilmTimeline source={r8Boards["brand-film"].sample[0].src ? {src:r8Boards["brand-film"].sample[0].src,poster:r8Boards["brand-film"].sample[0].poster,label:"특장차 전문 기업 홍보 영상",tag:"제작 예시 · AI 생성 장면 포함"} : undefined} labels={labels} /><p className="cs-t-small cs-r8-note">샘플 영상의 장 구성을 바탕으로 한 구성 예시이며 실제 초 단위 배분은 기획안에서 정합니다</p></EditorialSection>
  </>;
}
export const brandFilmLanding: ServiceModule = { Hero, Signature, worksLayout: "wide" };
