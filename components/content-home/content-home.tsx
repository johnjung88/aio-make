/* /content 컨텐츠 사이트 홈(서버). 헤더·푸터는 app/(content-site)/content/layout.tsx의 컨텐츠 셸이 그린다.
 * 구성: 작품 중심 히어로(쇼릴 슬롯 유지) → 서비스 6종 수동 갤러리 → 제작 과정 → 상담.
 * 글자는 .cs-t-* 역할 클래스만, 색·간격·모양은 컨텐츠 사이트 토큰(--cs-*)만 쓴다. */
import Image from "next/image";
import { publicEntries } from "@/lib/db";
import { homeJourneyData } from "@/lib/home-journey-data";
import Link from "next/link";
import { CsSectionHead } from "@/components/content-site/ui/section-head";
import {
  contentHomeCta as cta,
  contentHomeHero as hero,
  contentHomeProcessHead as processHead,
  contentHomeServices,
} from "@/lib/content-home";
import { HeroMedia } from "./hero-media";
import { ProcessTabs } from "./process-tabs";
import { ServiceShowcase } from "./service-showcase";
import "./content-home.css";

/* h1의 강조어만 색을 바꾼다. 줄바꿈은 데이터의 \n에서만 일어난다(cs-t-display: pre-line). */
function HeroTitle() {
  const at = hero.title.indexOf(hero.accent);
  if (at < 0) return <>{hero.title}</>;
  return (
    <>
      {hero.title.slice(0, at)}
      <span className="ch-accent">{hero.accent}</span>
      {hero.title.slice(at + hero.accent.length)}
    </>
  );
}

export async function ContentHome() {
  const journey = homeJourneyData(await publicEntries("reference", "video"));
  const feature = journey.contentSelections.find(item => item.tab.id === "motion-graphics") ?? journey.contentSelections[0];
  const comic = journey.contentSelections.find(item => item.tab.id === "webtoon") ?? journey.contentSelections[0];
  const media = feature.media;
  const poster = media.kind === "video" ? media.poster : media.src;
  return (
    <div className="cs-home">
      <section
        className="ch-hero"
        data-cs-section="hero"
        aria-labelledby="ch-hero-title"
      >
        <div className="cs-container ch-hero-editorial">
          <div className="ch-hero-copy">
            <p className="cs-t-eyebrow">{hero.eyebrow}</p>
            <h1 id="ch-hero-title" className="cs-t-display"><HeroTitle /></h1>
            <p className="ch-hero-lead cs-t-lead">{hero.lead}</p>
            <div className="ch-hero-actions" data-inline-contact>
              <a className="cs-btn cs-btn--primary cs-btn--lg" href={hero.buttonHref}>{hero.button}<span aria-hidden="true">↓</span></a>
              <Link className="cs-btn cs-btn--ghost cs-btn--lg" href={hero.secondaryHref}>{hero.secondary}<span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="ch-hero-works">
            <Link className="ch-hero-feature" href={feature.work ? `/content/projects/${feature.work.slug}?service=${feature.tab.id}` : "/content/services/motion-graphics"}>
              <div className="ch-hero-feature-image">{poster ? <Image src={poster} alt={media.alt} fill priority sizes="(min-width:1024px) 55vw, 100vw" /> : null}<span className="ch-hero-open cs-t-button" aria-hidden="true">↗</span></div>
              <div className="ch-hero-work-caption"><span className="cs-t-eyebrow">MOTION GRAPHICS</span><p className="cs-t-small">{feature.caption ?? "제품을 이해시키는 장면"}</p>{feature.tag ? <span className="cs-t-caption">{feature.tag}</span> : null}</div>
            </Link>
            <Link className="ch-hero-comic" href={comic.work ? `/content/projects/${comic.work.slug}?service=webtoon` : "/content/services/webtoon"}>
              <div className="ch-hero-comic-image"><Image src={comic.media.poster ?? comic.media.src} alt={comic.media.alt} fill sizes="(min-width:1024px) 10vw, 30vw" /></div>
              <div><span className="cs-t-eyebrow">BRAND WEBTOON</span><p className="cs-t-small">읽는 흐름 속에<br />브랜드를 담는 이야기</p><span className="cs-t-caption">{comic.tag ?? "웹툰 제작"} ↗</span></div>
            </Link>
          </div>
        </div>
        <div className="cs-container ch-hero-formats cs-t-caption" aria-label="제작 형식">{contentHomeServices.map(service => <a href={service.href} key={service.id}>{service.label}<span aria-hidden="true">↗</span></a>)}</div>
        {hero.video ? <div className="ch-hero-showreel"><HeroMedia /></div> : null}
      </section>

      <ServiceShowcase selections={journey.contentSelections} />

      <section
        id="process"
        className="ch-process"
        data-cs-section="process"
        aria-labelledby="ch-process-title"
      >
        <div className="cs-container">
          <CsSectionHead
            id="ch-process-title"
            eyebrow={processHead.eyebrow}
            title={processHead.title}
            lead={processHead.lead}
          />
          <ProcessTabs selections={journey.contentSelections} />
        </div>
      </section>

      <section
        className="ch-cta"
        data-cs-section="cta"
        aria-labelledby="ch-cta-title"
      >
        <div className="cs-container ch-cta-inner">
          <div className="ch-cta-copy">
            <p className="cs-t-eyebrow">{cta.eyebrow}</p>
            <h2 id="ch-cta-title" className="cs-t-h2">
              {cta.title}
            </h2>
            <p className="cs-t-lead">{cta.lead}</p>
          </div>
          <Link className="cs-btn cs-btn--lg ch-cta-button" href={cta.href}>
            {cta.button}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
