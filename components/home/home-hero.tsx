import Image from "next/image";
import Link from "next/link";
import { emptyJourneyData, type HomeJourneyData } from "@/lib/home-journey";
import { newTabProps } from "@/lib/new-tab";
import { NewTabHint } from "@/components/new-tab-hint";
import "./home-hero.css";

/** Customer media reaches this client-safe view only through the server review gate */
export function HomeHero({ data = emptyJourneyData }: { data?: HomeJourneyData }) {
  const selection = data.contentSelections.find(item => item.tab.id === "motion-graphics") ?? data.contentSelections[0];
  const media = selection.media;
  const dev = data.devProjects[0];
  const image = media.kind === "video" ? media.poster : media.src;
  return <section className="main-hero home-hero" aria-labelledby="main-hero-title">
    <div className="l-container home-hero-grid">
      <div className="home-hero-copy">
        <p className="eyebrow">AIO MAKE · ALL-IN-ONE AGENCY</p>
        <h1 id="main-hero-title" className="t-h1">브랜드를 알리는 일<br /><span>만드는 것부터<br />고객을 만날 때까지</span></h1>
        <p className="t-lead">컨텐츠·개발·마케팅을 한 흐름으로<br />지금 필요한 작업부터 함께 시작합니다</p>
        <div className="home-hero-actions" data-inline-contact>
          <a href="#divisions" className="home-hero-primary t-button">서비스 살펴보기 <span aria-hidden="true">↓</span></a>
          <a href="#contact" className="home-hero-secondary t-button">상담 신청 <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="home-hero-portfolio">
        <Link href={selection.work ? `/content/projects/${selection.work.slug}?service=${selection.tab.id}` : "/content/services/motion-graphics"} className="home-hero-feature" {...newTabProps}>
          <div className="home-hero-frame">{image ? <Image src={image} alt={media.alt} fill priority sizes="(min-width:1024px) 55vw, 100vw" /> : null}<span className="home-hero-open t-button" aria-hidden="true">↗</span></div>
          <div className="home-hero-caption"><span className="eyebrow">CONTENT / MOTION</span><span className="t-small">{selection.caption ?? "제품의 특징을 보여주는 영상"}<NewTabHint /></span>{selection.tag ? <span className="t-caption">{selection.tag}</span> : null}</div>
        </Link>
        <Link href={dev ? dev.config.serviceHref : "/lab"} className="home-hero-site">
          <div className="home-hero-site-image"><Image src={dev?.after.src ?? "/creative-v08/development-website.webp"} alt={dev?.after.alt ?? "웹사이트 제작 연출 예시"} fill sizes="(min-width:1024px) 25vw, 45vw" /></div>
          <div><span className="eyebrow">DEVELOPMENT</span><p className="t-small">{dev ? dev.work.title : "브랜드를 만나는 웹사이트"}</p><span className="t-caption">{dev ? "웹사이트 제작" : "연출 예시"} ↗</span></div>
        </Link>
      </div>
    </div>
    <div className="l-container home-hero-bottom t-caption"><span>기획부터 제작·운영까지</span><a href="#work">우리가 일하는 방식 <span aria-hidden="true">↓</span></a></div>
  </section>;
}
