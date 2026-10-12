import Image from "next/image";
import Link from "next/link";
import { divisions, divisionServices, services, type DivisionId } from "@/lib/content";
import { workMatchesService, type WorkItem } from "@/lib/work-catalog";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "./ui";
import { GuideNav } from "./guide/primitives";

export const workPageSize = 12;

export function WorkCard({ work }: { work: WorkItem }) {
  const cover = work.media[0];
  const label = services.find((service) => service.id === work.primaryService && service.division === work.division)?.name ?? "작업";
  return (
    <Link className="work-card" href={work.canonicalPath}>
      <div className={`work-card-media work-media-${cover?.presentation ?? "wide"}`}>
        {cover?.presentation === "site" && <span className="work-browser-bar" aria-hidden="true"><i /><i /><i /></span>}
        {cover?.src ? <Image src={cover.kind === "video" ? cover.poster ?? cover.src : cover.src} alt={cover.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /> : <span className="work-card-placeholder">{work.brand}</span>}
        {cover?.kind === "video" && <span className="work-card-play" aria-hidden="true">▶</span>}
        <span className="work-card-open" aria-hidden="true">↗</span>
      </div>
      <div className="work-card-meta"><span>{label}</span><span>{work.productionStatus}</span></div>
      <h2><span>{work.brand}</span><strong>{work.title}</strong></h2>
      <p>{work.description}</p>
    </Link>
  );
}

function pageHref(base: string, service: string, page: number, filterDivision?: string) {
  const query = new URLSearchParams();
  if (service) query.set("service", service);
  if (service && filterDivision) query.set("division", filterDivision);
  if (page > 1) query.set("page", String(page));
  return base + (query.size ? `?${query}` : "");
}

export function WorkIndex({
  works,
  base = "/work",
  division,
  service = "",
  filterDivision,
  page = 1,
}: {
  works: WorkItem[];
  base?: string;
  division?: DivisionId;
  service?: string;
  filterDivision?: string;
  page?: number;
}) {
  const available = works.filter((work) => !division || work.division === division || work.relatedServices.some((item) => item.division === division));
  const filtered = available.filter((work) => !service || workMatchesService(work, service, filterDivision ?? division));
  const pages = Math.max(1, Math.ceil(filtered.length / workPageSize));
  const current = Math.min(Math.max(1, page), pages);
  const selected = filtered.slice((current - 1) * workPageSize, current * workPageSize);
  const filters = (division ? divisionServices(division) : services).filter((item) => available.some((work) => workMatchesService(work, item.id, item.division)));
  const title = division ? `${divisions.find((item) => item.id === division)?.label} 작업` : "레퍼런스";
  return (
    <div className="work-page">
      {division && <GuideNav division={division === "video" ? "video" : divisions.find((item) => item.id === division)!.path} active="cases" />}
      <section className="work-index" aria-labelledby="work-title">
        <div className="work-index-heading">
          <span className="work-eyebrow">AIO MAKE / SELECTED WORK</span>
          <h1 id="work-title">{title}<span aria-hidden="true">.</span></h1>
          <p>웹사이트부터 영상과 웹툰까지,<br />작업의 목적과 제작 범위를 살펴보세요</p>
        </div>
        <div className="work-index-toolbar">
          <nav className="work-filter-menu" aria-label="서비스 필터">
            <Link aria-current={!service ? "page" : undefined} href={pageHref(base, "", 1)}>전체</Link>
            {filters.map((item) => <Link key={`${item.division}-${item.id}`} aria-current={service === item.id && (division || filterDivision) === item.division ? "page" : undefined} href={pageHref(base, item.id, 1, division ? undefined : item.division)}>{item.name}</Link>)}
          </nav>
          <span className="work-count">{String(filtered.length).padStart(2, "0")} PROJECTS</span>
        </div>
        <div className="work-grid">
          {selected.map((work) => <WorkCard key={work.id} work={work} />)}
        </div>
        {!selected.length && <p className="work-empty">이 서비스에 공개된 작업은 아직 없습니다</p>}
        {pages > 1 && <nav className="work-pagination" aria-label="작업 페이지">
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => <Link key={number} aria-current={number === current ? "page" : undefined} href={pageHref(base, service, number, filterDivision)}>{number}</Link>)}
        </nav>}
      </section>
    </div>
  );
}

export function WorkDetail({ work, related }: { work: WorkItem; related: WorkItem[] }) {
  const hero = work.media[0];
  const service = services.find((item) => item.id === work.primaryService && item.division === work.division);
  const division = divisions.find((item) => item.id === work.division)!;
  return <div className="work-page">
    <article className="work-detail">
      <JsonLd data={breadcrumbSchema([{ name: "AIO MAKE", path: "/" }, { name: "레퍼런스", path: "/work" }, { name: work.title, path: work.canonicalPath }])} />
      <Link className="work-back" href="/work">← 전체 작업</Link>
      <div className="work-detail-heading"><span className="work-eyebrow">{work.brand} / {service?.name}</span><h1>{work.title}</h1><p>{work.description}</p></div>
      {hero?.src && <figure className={`work-detail-hero work-media-${hero.presentation ?? "wide"}`}>
        {hero.kind === "video" ? <video controls preload="none" poster={hero.poster} aria-label={hero.alt}><source src={hero.src} /></video> : <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" />}
      </figure>}
      <div className="work-detail-facts"><section><span>01 / 목적</span><h2>무엇을 만들었나요</h2><p>{work.purpose}</p></section><section><span>02 / 범위</span><h2>어디까지 작업했나요</h2><p>{work.scope}</p><p>제작 상태: {work.productionStatus}</p></section></div>
      {work.media.length > 1 && <section className="work-gallery"><h2>{hero?.kind === "webtoon" ? "순서대로 읽기" : "작업 살펴보기"}</h2>{(hero?.kind === "webtoon" ? work.media : work.media.slice(1)).map((media, index) => <figure key={`${media.src}-${index}`}>{media.kind === "video" ? <video controls preload="none" poster={media.poster} aria-label={media.alt}><source src={media.src} /></video> : <Image src={media.src} alt={media.alt} width={media.kind === "webtoon" ? 1024 : 1440} height={media.kind === "webtoon" ? 1536 : 900} />}{media.kind === "webtoon" && <figcaption>{index + 1}페이지</figcaption>}</figure>)}</section>}
      {related.length > 0 && <section className="work-related"><h2>관련 작업</h2><div className="work-grid">{related.slice(0, 2).map((item) => <WorkCard key={item.id} work={item} />)}</div></section>}
      <section className="work-contact"><div><span className="work-eyebrow">START A PROJECT</span><h2>비슷한 작업을 계획하고 있나요</h2><p>필요한 화면과 자료, 목적을 알려주시면 작업 범위를 함께 정리합니다</p></div><Link href={`/${division.path}/contact${service ? `?service=${service.id}` : ""}`}>서비스 문의 ↗</Link></section>
    </article>
  </div>;
}
